import { User, CourseModule, CourseCompletionRecord } from '../types';
import { COURSE_MODULES } from '../data/mockData';
import { OperationProject, getProjectIntegratorPartners } from '../../types';
import { PARTNER_IDENTITY_DIRECTORY, isPartnerMatching } from './projectCoursePackager';

export const CURRENT_CALENDAR_YEAR = new Date().getFullYear();

/**
 * Extracts the 4-digit calendar year from an ISO or standard date string.
 */
export function getYearFromDateString(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(20\d\d)\b/);
  if (match) return parseInt(match[1], 10);
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed.getFullYear();
}

/**
 * Evaluates whether a specific technician has completed a course module
 * for the given calendar year (defaults to the current calendar year).
 *
 * Once completed in the current calendar year, the technician is certified
 * for that hardware curriculum and does NOT need to retake it for any
 * newly assigned projects within that calendar year.
 */
export function isCourseCompletedForCurrentYear(
  user: User | null | undefined,
  moduleId: string,
  targetYear: number = CURRENT_CALENDAR_YEAR
): boolean {
  if (!user) return false;

  // 1. Check explicit course completion record
  const record = user.courseCompletions?.[moduleId];
  if (record && record.passed) {
    const recordYear = record.year || getYearFromDateString(record.completedAt);
    if (recordYear === targetYear) return true;
  }

  // 2. Check quiz score against passing score
  const mod = COURSE_MODULES.find((m) => m.id === moduleId);
  const passScore = mod?.quiz.passingScore || 80;
  const score = user.quizScores?.[moduleId];
  const progress = user.progress?.[moduleId] || 0;

  const isPassed = (score !== undefined && score >= passScore) || progress >= 100;
  if (!isPassed) return false;

  // Check if user's certification date belongs to targetYear or is current
  if (user.certificationDate) {
    const certYear = getYearFromDateString(user.certificationDate);
    if (certYear === targetYear) return true;
    // If completed before targetYear, they would need an annual refresher
    if (certYear !== null && certYear < targetYear) return false;
  }

  // Default active user completion is valid for the current year
  return true;
}

export interface CourseAnnualDetails {
  isCompletedThisYear: boolean;
  completionYear: number;
  completionDate?: string;
  score?: number;
  passed: boolean;
  isRetakeRequired: boolean;
  statusBadgeText: string;
}

/**
 * Returns comprehensive annual certification metadata for a course and user.
 */
export function getCourseAnnualCompletionDetails(
  user: User | null | undefined,
  moduleId: string,
  targetYear: number = CURRENT_CALENDAR_YEAR
): CourseAnnualDetails {
  const isCompleted = isCourseCompletedForCurrentYear(user, moduleId, targetYear);
  const record = user?.courseCompletions?.[moduleId];
  const score = record?.score ?? user?.quizScores?.[moduleId];
  const date =
    record?.completedAt ||
    user?.certificationDate ||
    `${targetYear}-${new Date().toISOString().slice(5, 10)}`;

  return {
    isCompletedThisYear: isCompleted,
    completionYear: targetYear,
    completionDate: isCompleted ? date : undefined,
    score: isCompleted ? (score ?? 95) : score,
    passed: isCompleted,
    isRetakeRequired: !isCompleted,
    statusBadgeText: isCompleted
      ? `Completed for ${targetYear}`
      : `Required for ${targetYear}`,
  };
}

/**
 * Checks if ANY technician at the partner company has completed the course
 * for the current calendar year.
 */
export function isCourseCompletedByPartnerCompany(
  companyId: string | null | undefined,
  moduleId: string,
  allUsersList: User[],
  targetYear: number = CURRENT_CALENDAR_YEAR
): {
  isCompleted: boolean;
  completedByTech?: User;
  score?: number;
  date?: string;
  year: number;
} {
  if (!companyId) return { isCompleted: false, year: targetYear };

  const companyTechs = allUsersList.filter(
    (u) => u.companyId && u.companyId.toLowerCase() === companyId.toLowerCase()
  );

  for (const tech of companyTechs) {
    if (isCourseCompletedForCurrentYear(tech, moduleId, targetYear)) {
      const details = getCourseAnnualCompletionDetails(tech, moduleId, targetYear);
      return {
        isCompleted: true,
        completedByTech: tech,
        score: details.score,
        date: details.completionDate,
        year: targetYear,
      };
    }
  }

  return { isCompleted: false, year: targetYear };
}

/**
 * High-level evaluator: Determines if a project course requirement is satisfied
 * for an Integrator Partner based on their single annual completion in the current calendar year.
 */
export function isProjectCourseSatisfiedForPartner(
  project: OperationProject,
  moduleId: string,
  currentTech: User | null | undefined,
  allUsersList: User[],
  currentCompanyId?: string | null,
  targetYear: number = CURRENT_CALENDAR_YEAR
): {
  isSatisfied: boolean;
  reason: string;
  completedYear: number;
  score?: number;
  date?: string;
  completedByTechName?: string;
} {
  // 1. Check if the currently logged-in technician has completed it for targetYear
  if (currentTech && isCourseCompletedForCurrentYear(currentTech, moduleId, targetYear)) {
    const details = getCourseAnnualCompletionDetails(currentTech, moduleId, targetYear);
    return {
      isSatisfied: true,
      reason: `Completed by ${currentTech.name} for calendar year ${targetYear} — credited across all assigned projects (no retake required)`,
      completedYear: targetYear,
      score: details.score,
      date: details.completionDate,
      completedByTechName: currentTech.name,
    };
  }

  // 2. Check if any technician at the current company has completed it
  const compId = currentCompanyId || currentTech?.companyId;
  const companyCheck = isCourseCompletedByPartnerCompany(compId, moduleId, allUsersList, targetYear);
  if (companyCheck.isCompleted && companyCheck.completedByTech) {
    return {
      isSatisfied: true,
      reason: `Covered under partner firm's ${targetYear} annual certification (${companyCheck.completedByTech.name}) — credited for all projects`,
      completedYear: targetYear,
      score: companyCheck.score,
      date: companyCheck.date,
      completedByTechName: companyCheck.completedByTech.name,
    };
  }

  // 3. Check by assigned project partner short name in directory
  const assignedPartners = getProjectIntegratorPartners(project);
  for (const pName of assignedPartners) {
    const dir = PARTNER_IDENTITY_DIRECTORY.find((d) => isPartnerMatching(pName, d.partnerShortName));
    if (dir) {
      const matchCompCheck = isCourseCompletedByPartnerCompany(dir.companyId, moduleId, allUsersList, targetYear);
      if (matchCompCheck.isCompleted && matchCompCheck.completedByTech) {
        return {
          isSatisfied: true,
          reason: `Covered under ${dir.companyName}'s ${targetYear} annual certification (${matchCompCheck.completedByTech.name}) — credited for all projects`,
          completedYear: targetYear,
          score: matchCompCheck.score,
          date: matchCompCheck.date,
          completedByTechName: matchCompCheck.completedByTech.name,
        };
      }
    }
  }

  return {
    isSatisfied: false,
    reason: `Annual certification required for calendar year ${targetYear}`,
    completedYear: targetYear,
  };
}

/**
 * Creates an updated user record with the course completion stamped for the current calendar year.
 */
export function createAnnualCourseCompletionRecord(
  moduleId: string,
  score: number,
  passed: boolean,
  year: number = CURRENT_CALENDAR_YEAR
): CourseCompletionRecord {
  return {
    moduleId,
    completedAt: new Date().toISOString().split('T')[0],
    year,
    score,
    passed,
    notes: `Completed for calendar year ${year} - valid across all assigned partner projects`,
  };
}
