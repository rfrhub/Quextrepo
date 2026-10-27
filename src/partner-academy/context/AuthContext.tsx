import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PartnerCompany, UserRole, IssuedCertificate } from '../types';
import { INITIAL_USERS, PARTNER_COMPANIES, COURSE_MODULES } from '../data/mockData';
import { PARTNER_IDENTITY_DIRECTORY } from '../utils/projectCoursePackager';

interface AuthContextType {
  currentUser: User;
  currentCompany: PartnerCompany;
  companies: PartnerCompany[];
  allUsers: User[];
  companyUsers: User[];
  loginAsUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  switchCompany: (companyId: string) => void;
  completeLesson: (lessonId: string, moduleId: string) => void;
  submitQuizScore: (moduleId: string, score: number) => { passed: boolean; unlockedCert: boolean };
  generateCertificate: (userId?: string) => IssuedCertificate;
  getCompanyCertificates: () => IssuedCertificate[];
  registerCompany: (newCompany: Omit<PartnerCompany, 'id' | 'joinedDate'>) => PartnerCompany;
  addTechnician: (technician: { name: string; email: string; fieldIdNumber: string }) => User;
  loginWithCredentials: (email: string, companyCode: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY_USERS = 'quext_academy_users_v5';
const STORAGE_KEY_COMPANIES = 'quext_academy_companies_v5';
const STORAGE_KEY_CURRENT_USER = 'quext_academy_current_user_v5';

export function isQuextEmployeeUser(
  user?: Partial<User> | null,
  company?: Partial<PartnerCompany> | null
): boolean {
  if (!user) return false;
  if (user.role === 'quext_director') return true;
  if (user.companyId === 'comp_quext_hq') return true;
  if (company?.id === 'comp_quext_hq') return true;
  if (
    user.email &&
    (user.email.toLowerCase().endsWith('@onequext.com') ||
      user.email.toLowerCase().endsWith('@quext.com'))
  ) {
    return true;
  }
  return false;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  activePartnerEmail?: string | null;
  activeCompanyId?: string | null;
}> = ({ children, activePartnerEmail, activeCompanyId }) => {
  const [companies, setCompanies] = useState<PartnerCompany[]>(() => {
    const allowedCompanyIds = new Set(PARTNER_COMPANIES.map((c) => c.id));
    const saved = localStorage.getItem(STORAGE_KEY_COMPANIES);
    if (saved) {
      try {
        const parsed: PartnerCompany[] = JSON.parse(saved);
        const validParsed = parsed.filter((c) => allowedCompanyIds.has(c.id));
        const existingIds = new Set(validParsed.map((c) => c.id));
        const missing = PARTNER_COMPANIES.filter((c) => !existingIds.has(c.id));
        return [...missing, ...validParsed];
      } catch (e) {
        console.error(e);
      }
    }
    return PARTNER_COMPANIES;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const allowedUserIds = new Set(INITIAL_USERS.map((u) => u.id));
    const allowedCompanyIds = new Set(PARTNER_COMPANIES.map((c) => c.id));
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const validParsed = parsed.filter(
          (u) => allowedUserIds.has(u.id) || allowedCompanyIds.has(u.companyId)
        );
        const existingIds = new Set(validParsed.map((u) => u.id));
        const missing = INITIAL_USERS.filter((u) => !existingIds.has(u.id));
        return [...missing, ...validParsed];
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (saved && INITIAL_USERS.some((u) => u.id === saved)) {
      return saved;
    }
    return 'user_spirit_lead';
  });

  // Sync when activePartnerEmail or activeCompanyId changes from MyQuext Email Router
  useEffect(() => {
    if (!activePartnerEmail && !activeCompanyId) return;

    if (activePartnerEmail) {
      const lowerEmail = activePartnerEmail.trim().toLowerCase();
      const matchedUser = allUsers.find((u) => u.email.toLowerCase() === lowerEmail);
      if (matchedUser) {
        setCurrentUserId(matchedUser.id);
        return;
      }

      // Check if it matches a known partner directory entry
      const dirEntry = PARTNER_IDENTITY_DIRECTORY.find(
        (d) =>
          d.defaultEmail.toLowerCase() === lowerEmail ||
          d.aliases.some((alias) => lowerEmail.includes(alias))
      );
      if (dirEntry) {
        const userInComp = allUsers.find((u) => u.companyId === dirEntry.companyId);
        if (userInComp) {
          setCurrentUserId(userInComp.id);
          return;
        }
      }
    }

    if (activeCompanyId) {
      const userInComp = allUsers.find((u) => u.companyId === activeCompanyId);
      if (userInComp) {
        setCurrentUserId(userInComp.id);
      }
    }
  }, [activePartnerEmail, activeCompanyId]);

  // Save changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(allUsers));
    window.dispatchEvent(new Event('quext-partner-progress-updated'));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, currentUserId);
  }, [currentUserId]);

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];
  const currentCompany = companies.find(c => c.id === currentUser.companyId) || companies[0];

  const companyUsers = allUsers.filter(u => u.companyId === currentCompany.id);

  const loginAsUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (
      target &&
      (target.role === 'quext_director' ||
        target.companyId === 'comp_quext_hq' ||
        target.email.toLowerCase().endsWith('@onequext.com') ||
        target.email.toLowerCase().endsWith('@quext.com'))
    ) {
      if (!isQuextEmployeeUser(currentUser, currentCompany)) {
        return;
      }
    }
    if (allUsers.some((u) => u.id === userId)) {
      setCurrentUserId(userId);
    }
  };

  const switchRole = (role: UserRole) => {
    // Only Quext employees can hold or switch to quext_director role
    if (role === 'quext_director' && !isQuextEmployeeUser(currentUser, currentCompany)) {
      return;
    }
    // Find first user with that role in current company, or any company
    const matchingInCompany = companyUsers.find(u => u.role === role);
    if (matchingInCompany) {
      setCurrentUserId(matchingInCompany.id);
      return;
    }
    const matchingAny = allUsers.find(u => u.role === role);
    if (matchingAny) {
      // If matchingAny is a Quext employee but current user isn't, don't allow
      if (matchingAny.role === 'quext_director' && !isQuextEmployeeUser(currentUser, currentCompany)) {
        return;
      }
      setCurrentUserId(matchingAny.id);
    }
  };

  const switchCompany = (companyId: string) => {
    const targetComp = companies.find(c => c.id === companyId);
    if (!targetComp) return;
    const userInComp = allUsers.find(u => u.companyId === companyId);
    if (userInComp) {
      setCurrentUserId(userInComp.id);
    } else {
      // create default user for that company
      const newUser: User = {
        id: `user_${companyId}_admin`,
        name: `${targetComp.name} Admin`,
        email: targetComp.contactEmail,
        role: 'partner_admin',
        companyId: targetComp.id,
        companyName: targetComp.name,
        fieldIdNumber: `MGR-${Math.floor(1000 + Math.random() * 9000)}`,
        certifications: [],
        progress: {},
        completedLessons: [],
        quizScores: {},
      };
      setAllUsers(prev => [...prev, newUser]);
      setCurrentUserId(newUser.id);
    }
  };

  const completeLesson = (lessonId: string, moduleId: string) => {
    setAllUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id !== currentUserId) return user;

        const updatedCompleted = user.completedLessons.includes(lessonId)
          ? user.completedLessons
          : [...user.completedLessons, lessonId];

        // compute module progress
        const targetModule = COURSE_MODULES.find(m => m.id === moduleId);
        const totalLessons = targetModule ? targetModule.lessons.length : 1;
        const finishedInModule = targetModule
          ? targetModule.lessons.filter(l => updatedCompleted.includes(l.id)).length
          : 1;

        const modPercent = Math.round((finishedInModule / totalLessons) * 100);

        return {
          ...user,
          completedLessons: updatedCompleted,
          progress: {
            ...user.progress,
            [moduleId]: Math.max(user.progress[moduleId] || 0, modPercent),
          },
        };
      });
    });
  };

  const submitQuizScore = (moduleId: string, score: number) => {
    const targetModule = COURSE_MODULES.find(m => m.id === moduleId);
    const passingScore = targetModule?.quiz.passingScore || 80;
    const passed = score >= passingScore;

    let certEarned = false;

    setAllUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id !== currentUserId) return user;

        const newScores = {
          ...user.quizScores,
          [moduleId]: score,
        };

        const newProgress = {
          ...user.progress,
          [moduleId]: passed ? 100 : Math.max(user.progress[moduleId] || 0, 75),
        };

        // Check if all 5 modules are passed >= 80
        const allModulesPassed = COURSE_MODULES.every(mod => {
          const modScore = newScores[mod.id];
          return modScore !== undefined && modScore >= mod.quiz.passingScore;
        });

        let updatedCerts = [...user.certifications];
        let certDate = user.certificationDate;

        if (allModulesPassed && updatedCerts.length === 0) {
          const newCertId = `QCIP-2026-${currentCompany.code.replace('-', '')}-${user.fieldIdNumber.replace('TECH-', '')}`;
          updatedCerts.push(newCertId);
          certDate = new Date().toISOString().split('T')[0];
          certEarned = true;
        }

        return {
          ...user,
          quizScores: newScores,
          progress: newProgress,
          certifications: updatedCerts,
          certificationDate: certDate,
        };
      });
    });

    return { passed, unlockedCert: certEarned };
  };

  const generateCertificate = (userId?: string): IssuedCertificate => {
    const targetUser = allUsers.find(u => u.id === (userId || currentUserId)) || currentUser;
    const certId = targetUser.certifications[0] || `QCIP-2026-${targetUser.companyId.slice(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const issueDate = targetUser.certificationDate || new Date().toISOString().split('T')[0];
    const expiryYear = parseInt(issueDate.split('-')[0], 10) + 2;
    const expiryDate = `${expiryYear}-${issueDate.split('-')[1]}-${issueDate.split('-')[2]}`;

    // Average score across quizzes
    const scores = Object.values(targetUser.quizScores);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 94;

    return {
      certificateId: certId,
      technicianId: targetUser.id,
      technicianName: targetUser.name,
      technicianEmail: targetUser.email,
      fieldIdNumber: targetUser.fieldIdNumber,
      companyName: targetUser.companyName,
      companyId: targetUser.companyId,
      courseTitle: 'Quext Certified Multifamily IoT Field Specialist (Level 2)',
      issueDate,
      expiryDate,
      score: avgScore,
      credentialCode: `AUTH-SHA256-${certId}`,
      authorizedSigner: 'Raul Recalde',
      signerTitle: 'VP of Partner Operations & Training, Quext',
    };
  };

  const getCompanyCertificates = (): IssuedCertificate[] => {
    return companyUsers
      .filter(u => u.certifications.length > 0)
      .map(u => generateCertificate(u.id));
  };

  const registerCompany = (newCompanyData: Omit<PartnerCompany, 'id' | 'joinedDate'>) => {
    const newId = `comp_${Date.now()}`;
    const newComp: PartnerCompany = {
      ...newCompanyData,
      id: newId,
      joinedDate: 'Just now',
    };
    setCompanies(prev => [...prev, newComp]);

    // Create an initial admin user for this company
    const newAdmin: User = {
      id: `user_${newId}_admin`,
      name: `${newCompanyData.name} Lead`,
      email: newCompanyData.contactEmail,
      role: 'partner_admin',
      companyId: newId,
      companyName: newCompanyData.name,
      fieldIdNumber: `MGR-${Math.floor(1000 + Math.random() * 9000)}`,
      certifications: [],
      progress: {},
      completedLessons: [],
      quizScores: {},
    };
    setAllUsers(prev => [...prev, newAdmin]);
    setCurrentUserId(newAdmin.id);
    return newComp;
  };

  const addTechnician = (techData: { name: string; email: string; fieldIdNumber: string }) => {
    const newTech: User = {
      id: `user_tech_${Date.now()}`,
      name: techData.name,
      email: techData.email,
      role: 'partner_installer',
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      fieldIdNumber: techData.fieldIdNumber,
      certifications: [],
      progress: {},
      completedLessons: [],
      quizScores: {},
    };
    setAllUsers(prev => [...prev, newTech]);
    setCompanies(prev => prev.map(c => c.id === currentCompany.id ? { ...c, activeTechnicians: c.activeTechnicians + 1 } : c));
    return newTech;
  };

  const loginWithCredentials = (email: string, companyCode: string): boolean => {
    const matchingCompany = companies.find(c => c.code.toLowerCase() === companyCode.trim().toLowerCase());
    if (!matchingCompany) return false;

    const matchingUser = allUsers.find(
      u => u.companyId === matchingCompany.id && u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchingUser) {
      setCurrentUserId(matchingUser.id);
      return true;
    }

    // Auto-create technician if company code matches
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email.trim(),
      role: 'partner_installer',
      companyId: matchingCompany.id,
      companyName: matchingCompany.name,
      fieldIdNumber: `TECH-${Math.floor(1000 + Math.random() * 9000)}`,
      certifications: [],
      progress: {},
      completedLessons: [],
      quizScores: {},
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return true;
  };

  const logout = () => {
    // switch to first partner installer
    setCurrentUserId('user_skbm_lead');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentCompany,
        companies,
        allUsers,
        companyUsers,
        loginAsUser,
        switchRole,
        switchCompany,
        completeLesson,
        submitQuizScore,
        generateCertificate,
        getCompanyCertificates,
        registerCompany,
        addTechnician,
        loginWithCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
