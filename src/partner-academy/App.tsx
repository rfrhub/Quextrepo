import React, { useState, useEffect, useMemo } from 'react';
import { OperationProject, getProjectIntegratorPartners } from '../types';
import { AuthProvider, useAuth, isQuextEmployeeUser } from './context/AuthContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { UpcomingPartnerProjectsSection } from './components/UpcomingPartnerProjectsSection';
import { ProjectCoursePackageView } from './components/ProjectCoursePackageView';
import { CourseCurriculum } from './components/CourseCurriculum';
import { LessonViewer } from './components/LessonViewer';
import { EngineeringSchematicViewer } from './components/EngineeringSchematicViewer';
import { ThermostatOnboardingFlow } from './components/ThermostatOnboardingFlow';
import { InteractiveWiringSimulator } from './components/InteractiveWiringSimulator';
import { PartnerAdminDashboard } from './components/PartnerAdminDashboard';
import { CertificateModal } from './components/CertificateModal';
import { QuizModal } from './components/QuizModal';
import { LoginModal } from './components/LoginModal';
import { PortalInstallerGuide } from './components/PortalInstallerGuide';
import { WalletUpgradeGuide } from './components/WalletUpgradeGuide';
import { IntegrationChecklists } from './components/IntegrationChecklists';
import { QrIntercomGuide } from './components/QrIntercomGuide';
import { LeakSensorsGuide } from './components/LeakSensorsGuide';
import { BefeLocksGuide } from './components/BefeLocksGuide';
import { LockFieldGuide } from './components/LockFieldGuide';
import { SpecSheetsViewer } from './components/SpecSheetsViewer';
import { ButterflyIntercomWiring } from './components/ButterflyIntercomWiring';
import { InstallersClipModal } from '../components/InstallersClipModal';
import { CourseModule } from './types';
import { COURSE_MODULES } from './data/mockData';
import { PARTNER_IDENTITY_DIRECTORY } from './utils/projectCoursePackager';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Layers,
  Cpu,
  BookOpen,
  Smartphone,
  FileText,
  Sparkles,
} from 'lucide-react';

interface PartnerAcademyPortalProps {
  projects?: OperationProject[];
  onUpdateProject?: (updated: OperationProject) => void;
  activePartnerEmail?: string | null;
  activeCompanyId?: string | null;
  initialSelectedProjectId?: string | null;
  onOpenUnifiedSignInModal?: () => void;
  onExitToOperationsHub?: () => void;
}

const MainApp: React.FC<{
  projects: OperationProject[];
  onUpdateProject?: (updated: OperationProject) => void;
  initialSelectedProjectId?: string | null;
  onOpenUnifiedSignInModal?: () => void;
  onExitToOperationsHub?: () => void;
}> = ({
  projects,
  onUpdateProject,
  initialSelectedProjectId,
  onOpenUnifiedSignInModal,
  onExitToOperationsHub,
}) => {
  const { currentUser, currentCompany } = useAuth();
  const isQuextEmployee = isQuextEmployeeUser(currentUser, currentCompany);

  // Map currentCompany to its corresponding Operations Integrator Partner name
  const currentPartnerShortName = useMemo(() => {
    const compNameLower = currentCompany.name.toLowerCase();
    const compIdLower = currentCompany.id.toLowerCase();

    for (const dir of PARTNER_IDENTITY_DIRECTORY) {
      if (
        dir.companyId.toLowerCase() === compIdLower ||
        compNameLower.includes(dir.partnerShortName.toLowerCase()) ||
        dir.aliases.some((a) => compNameLower.includes(a) || compIdLower.includes(a))
      ) {
        return dir.partnerShortName;
      }
    }
    return null;
  }, [currentCompany]);

  // Non-Quext partners can strictly see ONLY the projects assigned to them
  const visibleProjects = useMemo(() => {
    if (isQuextEmployee) return projects;
    if (!currentPartnerShortName) return [];
    return projects.filter((p) =>
      getProjectIntegratorPartners(p).some(
        (partner) => partner.trim().toLowerCase() === currentPartnerShortName.trim().toLowerCase()
      )
    );
  }, [projects, isQuextEmployee, currentPartnerShortName]);

  const [currentTab, setCurrentTab] = useState<string>('curriculum');
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [activeQuizModule, setActiveQuizModule] = useState<CourseModule | null>(null);
  const [activeQuizMode, setActiveQuizMode] = useState<'practice_quiz' | 'certification_exam'>('certification_exam');
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [certTargetUserId, setCertTargetUserId] = useState<string | undefined>(undefined);

  // Installers Clip standalone field logging app state
  const [isInstallersClipOpen, setIsInstallersClipOpen] = useState<boolean>(false);
  const [clipInitialProjectId, setClipInitialProjectId] = useState<string | null>(null);

  // Track which project's Pre-Packaged Installation Prep Bundle is active
  const [activePrepProjectId, setActivePrepProjectId] = useState<string | null>(
    initialSelectedProjectId || null
  );
  const [isViewingProjectPrepHub, setIsViewingProjectPrepHub] = useState<boolean>(
    Boolean(initialSelectedProjectId)
  );

  useEffect(() => {
    if (initialSelectedProjectId) {
      // Validate that the project is accessible to this user
      if (isQuextEmployee || visibleProjects.some((p) => p.id === initialSelectedProjectId)) {
        setActivePrepProjectId(initialSelectedProjectId);
        setIsViewingProjectPrepHub(true);
        setSelectedModule(null);
        setCurrentTab('curriculum');
      } else {
        setActivePrepProjectId(null);
        setIsViewingProjectPrepHub(false);
      }
    }
  }, [initialSelectedProjectId, isQuextEmployee, visibleProjects]);

  // Security guard: If current user changes and active project isn't theirs, reset
  useEffect(() => {
    if (activePrepProjectId && !isQuextEmployee) {
      const allowed = visibleProjects.some((p) => p.id === activePrepProjectId);
      if (!allowed) {
        setActivePrepProjectId(null);
        setIsViewingProjectPrepHub(false);
      }
    }
  }, [activePrepProjectId, isQuextEmployee, visibleProjects]);

  const activePrepProject = activePrepProjectId
    ? visibleProjects.find((p) => p.id === activePrepProjectId) || (isQuextEmployee ? projects.find((p) => p.id === activePrepProjectId) : null) || null
    : null;

  const handleStartCourse = (moduleId: string) => {
    const mod = COURSE_MODULES.find((m) => m.id === moduleId) || COURSE_MODULES[0];
    setIsViewingProjectPrepHub(false);
    setSelectedModule(mod);
    setCurrentTab('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCertificate = (userId?: string) => {
    setCertTargetUserId(userId);
    setShowCertModal(true);
  };

  const handleSelectProjectPackage = (project: OperationProject) => {
    setActivePrepProjectId(project.id);
    setIsViewingProjectPrepHub(true);
    setSelectedModule(null);
    setCurrentTab('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToProjectPrepHub = () => {
    setIsViewingProjectPrepHub(true);
    setSelectedModule(null);
    setCurrentTab('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-[#f8fafc] flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'installers_clip') {
            setClipInitialProjectId(activePrepProjectId);
            setIsInstallersClipOpen(true);
            return;
          }
          setIsViewingProjectPrepHub(false);
          setSelectedModule(null);
          setCurrentTab(tab);
        }}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenCertModal={() => handleOpenCertificate(currentUser.id)}
        onOpenInstallersClip={() => {
          setClipInitialProjectId(activePrepProjectId);
          setIsInstallersClipOpen(true);
        }}
        onOpenUnifiedSignInModal={onOpenUnifiedSignInModal}
        onExitToOperationsHub={onExitToOperationsHub}
      />

      {/* Persistent Context Bar when studying a Course or Guide launched from a Project's Pre-Packaged Prep Bundle */}
      {activePrepProject && !isViewingProjectPrepHub && (
        <div className="bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-cyan-950/90 border-b border-purple-500/40 px-4 lg:px-8 py-2.5 sticky top-[61px] z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                Studying Pre-Packaged Project Bundle:{' '}
                <strong className="text-white">{activePrepProject.propertyName}</strong> (
                {activePrepProject.city}, {activePrepProject.state})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReturnToProjectPrepHub}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to {activePrepProject.propertyName} Prep Bundle</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePrepProjectId(null);
                  setIsViewingProjectPrepHub(false);
                }}
                className="px-2.5 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-medium transition-colors cursor-pointer"
              >
                Clear Project Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main data-tutorial-id="partner-academy-hub" className="flex-1">
        {/* Hero banner shown on main curriculum tab when no specific course or project prep view is open */}
        {currentTab === 'curriculum' && !selectedModule && !isViewingProjectPrepHub && (
          <HeroBanner
            onStartCourse={handleStartCourse}
            onOpenCertModal={() => handleOpenCertificate(currentUser.id)}
            onOpenWiringSandbox={() => setCurrentTab('wiring_sandbox')}
            onOpenPortalGuide={() => setCurrentTab('portal_guide')}
            onOpenWalletGuide={() => setCurrentTab('wallet_guide')}
            onOpenIntegrationChecklists={() => setCurrentTab('integration_checklists')}
            onOpenQrIntercomGuide={() => setCurrentTab('qr_intercom_guide')}
            onOpenLeakSensorsGuide={() => setCurrentTab('leak_sensors')}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-10">
          {/* View 0: Dedicated Pre-Packaged Project Installation Prep View when a partner clicks a project card */}
          {currentTab === 'curriculum' && isViewingProjectPrepHub && activePrepProject && (
            <ProjectCoursePackageView
              project={activePrepProject}
              onBackToHomepage={() => {
                setIsViewingProjectPrepHub(false);
                setSelectedModule(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartCourseModule={(mod) => {
                setIsViewingProjectPrepHub(false);
                setSelectedModule(mod);
                setCurrentTab('curriculum');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTakeCourseQuiz={(mod, mode) => {
                setActiveQuizMode(mode);
                setActiveQuizModule(mod);
              }}
              onOpenGuideTab={(tabId) => {
                setIsViewingProjectPrepHub(false);
                setSelectedModule(null);
                setCurrentTab(tabId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenInstallersClip={() => {
                setClipInitialProjectId(activePrepProject.id);
                setIsInstallersClipOpen(true);
              }}
              onUpdateProject={onUpdateProject}
            />
          )}

          {/* View 1: Active Course Lesson Player */}
          {currentTab === 'curriculum' && !isViewingProjectPrepHub && selectedModule && (
            <LessonViewer
              module={selectedModule}
              onBack={() => {
                if (activePrepProject) {
                  setIsViewingProjectPrepHub(true);
                }
                setSelectedModule(null);
              }}
              onTakeQuiz={(mode) => {
                setActiveQuizMode(mode || 'certification_exam');
                setActiveQuizModule(selectedModule);
              }}
              onSelectNextModule={(nextMod) => {
                setSelectedModule(nextMod);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* View 2: Partner Academy Homepage: Upcoming Assigned Projects + Full Course Catalog */}
          {currentTab === 'curriculum' && !isViewingProjectPrepHub && !selectedModule && (
            <>
              {visibleProjects.length >= 0 && (
                <UpcomingPartnerProjectsSection
                  projects={visibleProjects}
                  onSelectProjectPackage={handleSelectProjectPackage}
                />
              )}

              <CourseCurriculum
                onSelectModule={(mod) => {
                  setSelectedModule(mod);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onTakeQuiz={(mod, mode) => {
                  setActiveQuizMode(mode || 'certification_exam');
                  setActiveQuizModule(mod);
                }}
                onOpenWiringSimulator={() => setCurrentTab('wiring_sandbox')}
              />
            </>
          )}

          {/* View 2.4: Quext Wallet Upgrade Field Installation Guide */}
          {currentTab === 'wallet_guide' && (
            <WalletUpgradeGuide
              onOpenCourse={(modId) => handleStartCourse(modId)}
              onSwitchToPortalGuide={() => setCurrentTab('portal_guide')}
            />
          )}

          {/* View 2.5: Quext Portal Installer Guide */}
          {currentTab === 'portal_guide' && (
            <PortalInstallerGuide
              onOpenCourse={(modId) => handleStartCourse(modId)}
            />
          )}

          {/* View 2.6: Official Integration Checklists (Brivo + Quext) */}
          {currentTab === 'integration_checklists' && (
            <IntegrationChecklists
              onOpenCourse={(modId) => handleStartCourse(modId)}
            />
          )}

          {/* View 2.7: QR Intercom Plaque Integration Guide */}
          {currentTab === 'qr_intercom_guide' && (
            <QrIntercomGuide
              onOpenCourse={(modId) => handleStartCourse(modId)}
            />
          )}

          {/* View 2.8: Water Leak & Toilet Run Sensor Installation Guide */}
          {currentTab === 'leak_sensors' && (
            <LeakSensorsGuide
              onOpenCourse={(modId) => handleStartCourse(modId)}
            />
          )}

          {/* Individual Lock Field Guides from Quext_Locks_ec728054.pdf */}
          {currentTab === 'befe_guide' && (
            <LockFieldGuide
              lockType="befe"
              onOpenCourse={(modId) => handleStartCourse(modId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'ndeb_guide' && (
            <LockFieldGuide
              lockType="ndeb"
              onOpenCourse={(modId) => handleStartCourse(modId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'xe360_guide' && (
            <LockFieldGuide
              lockType="xe360"
              onOpenCourse={(modId) => handleStartCourse(modId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'rc_reader_guide' && (
            <LockFieldGuide
              lockType="rc_reader"
              onOpenCourse={(modId) => handleStartCourse(modId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {/* Dedicated Spec Sheets & Door Prep Tab (Slides 18 & 19) */}
          {currentTab === 'spec_sheets' && (
            <SpecSheetsViewer
              onOpenCourse={(modId) => handleStartCourse(modId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {/* View 3: Dedicated Thermostat Onboarding Guide Walkthrough */}
          {currentTab === 'thermostat_flow' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    Official PDF Guide Flow · Model QXT100048
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Thermostat Onboarding Guide Simulator
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Interactive reproduction of the official 12-page Quext Thermostat Onboarding Field Manual.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setCurrentTab('wiring_sandbox')}
                    className="px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Quext thermostat Wiring Sandbox</span>
                  </button>
                  <button
                    onClick={() => handleStartCourse('mod_thermostat_onboarding')}
                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Full Course Module</span>
                  </button>
                </div>
              </div>

              <ThermostatOnboardingFlow onComplete={() => handleStartCourse('mod_thermostat_onboarding')} />
            </div>
          )}

          {/* View 3.5: ButterflyMX Video Intercom Wiring Diagram */}
          {currentTab === 'butterfly_wiring' && (
            <ButterflyIntercomWiring
              onOpenCourse={(modId) => handleStartCourse(modId)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {/* View 4: Official Engineering Schematics Gallery */}
          {currentTab === 'schematics_lab' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Engineering Blueprint Archive · Drawn by Raul Recalde
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    RC Card Reader &amp; Access Control Schematics
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Official technical diagrams for Elevator Call Buttons, 12V/24V Electric Strikes with RBSN Relays, and PS914-2RS Power Supplies.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setCurrentTab('butterfly_wiring')}
                    className="px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Butterfly Intercom Wiring →</span>
                  </button>
                  <button
                    onClick={() => handleStartCourse('mod_rc_card_readers')}
                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Study RC Reader Course</span>
                  </button>
                </div>
              </div>

              <EngineeringSchematicViewer onNavigateTab={(tab) => setCurrentTab(tab)} />
            </div>
          )}

          {/* View 5: Quext thermostat Wiring Sandbox */}
          {currentTab === 'wiring_sandbox' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Quext thermostat Wiring Sandbox
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Official field wiring diagrams &amp; interactive 24VAC R, Rc, Y, C, W, G, Aux, NC sub-base terminal simulator for Conventional and Heat Pump HVAC systems.
                  </p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <button
                    onClick={() => setCurrentTab('thermostat_flow')}
                    className="text-xs text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
                  >
                    ← Onboarding Guide Simulator
                  </button>
                  <button
                    onClick={() => setCurrentTab('curriculum')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    Return to Field Courses →
                  </button>
                </div>
              </div>

              <InteractiveWiringSimulator />
            </div>
          )}

          {/* View 6: Partner Admin Dashboard */}
          {currentTab === 'admin_portal' && (
            <PartnerAdminDashboard
              onViewCertForUser={(userId) => handleOpenCertificate(userId)}
            />
          )}
        </div>
      </main>

      {/* Official Quext Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#050505] py-10 px-4 lg:px-8 text-xs text-zinc-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="inline-block border border-white px-2 py-0.5 text-white font-extrabold text-xs rounded">
              quext
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300 font-semibold">
              Official Partner Installation &amp; Training Academy
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-zinc-400">
            <button
              onClick={() => setShowLoginModal(true)}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              Company Switcher
            </button>
            <span aria-hidden="true">·</span>
            {onOpenUnifiedSignInModal && (
              <>
                <button
                  onClick={onOpenUnifiedSignInModal}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
                >
                  myquext.com Email Router
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <button
              onClick={() => handleOpenCertificate(currentUser.id)}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              Verify Certificate
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="mailto:support@onequext.com"
              className="hover:text-purple-400 transition-colors"
            >
              support@onequext.com
            </a>
          </div>

          <div className="text-zinc-500 text-[11px] font-mono">
            &copy; {new Date().getFullYear()} Quext (OneQuext). Patented Multifamily IoT Solutions.
          </div>
        </div>
      </footer>

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          onClose={() => setShowCertModal(false)}
          onTakeRemainingExams={() => {
            setShowCertModal(false);
            setCurrentTab('curriculum');
          }}
        />
      )}

      {/* Quiz Modal */}
      {activeQuizModule && (
        <QuizModal
          module={activeQuizModule}
          initialMode={activeQuizMode}
          onClose={() => setActiveQuizModule(null)}
          onViewCertificate={() => handleOpenCertificate(currentUser.id)}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* Installers Clip Standalone In-The-Field App for Integrator Partners */}
      <InstallersClipModal
        isOpen={isInstallersClipOpen}
        onClose={() => setIsInstallersClipOpen(false)}
        projects={visibleProjects}
        onUpdateProject={(updated) => {
          if (onUpdateProject) onUpdateProject(updated);
        }}
        initialProjectId={clipInitialProjectId}
        activeInstallerName={currentUser.name}
        installerRole="integrator_partner"
        companyName={currentCompany?.name || 'Integrator Partner'}
      />
    </div>
  );
};

export default function PartnerAcademyApp({
  projects = [],
  onUpdateProject,
  activePartnerEmail,
  activeCompanyId,
  initialSelectedProjectId,
  onOpenUnifiedSignInModal,
  onExitToOperationsHub,
}: PartnerAcademyPortalProps) {
  return (
    <AuthProvider activePartnerEmail={activePartnerEmail} activeCompanyId={activeCompanyId}>
      <MainApp
        projects={projects}
        onUpdateProject={onUpdateProject}
        initialSelectedProjectId={initialSelectedProjectId}
        onOpenUnifiedSignInModal={onOpenUnifiedSignInModal}
        onExitToOperationsHub={onExitToOperationsHub}
      />
    </AuthProvider>
  );
}
