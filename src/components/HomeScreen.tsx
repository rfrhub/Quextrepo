import React, { useState, useMemo, useEffect } from 'react';
import {
  OperationProject,
  ProjectStatusTag,
  AVAILABLE_PMS,
  getProjectIntegratorPartners,
  getAllIntegratorPartners,
  buildPartnerAcademyPortalUrl,
} from '../types';
import { QuextVisionLogo } from './QuextVisionLogo';
import {
  getPartnerOverallProgress,
  getProjectPartnerCourseCompletion,
  loadPartnerAcademyUsers,
  togglePartnerSingleCourseCompletion,
} from '../partner-academy/utils/projectCoursePackager';
import {
  Activity,
  CheckCircle2,
  Clock,
  Building2,
  Layers,
  Users,
  Filter,
  X,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  ArrowRight,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  Copy,
} from 'lucide-react';

interface HomeScreenProps {
  projects: OperationProject[];
  onNavigateToOperationsDashboard: () => void;
  onNavigateToAllProjects: (filterStatus?: ProjectStatusTag) => void;
  onNavigateToProject: (projectId: string) => void;
  onNavigateToQuotes: () => void;
  onTriggerSecretFocus?: () => void;
  onOpenPartnerAcademy?: (partnerShortName?: string, projectId?: string) => void;
  currentUserName?: string;
  currentUserRole?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects,
  onNavigateToOperationsDashboard,
  onNavigateToAllProjects,
  onNavigateToProject,
  onTriggerSecretFocus,
  onOpenPartnerAcademy,
  currentUserName = 'Raul Recalde',
  currentUserRole = 'Director of Implementation',
}) => {
  const [selectedPMFilter, setSelectedPMFilter] = useState<string>('all');
  const [partnerProgressFilter, setPartnerProgressFilter] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [areProjectCardsMinimized, setAreProjectCardsMinimized] = useState<boolean>(false);
  const [academySyncTick, setAcademySyncTick] = useState<number>(0);
  const [copiedPartnerKey, setCopiedPartnerKey] = useState<string | null>(null);

  const handleCopyPartnerLink = (partnerName?: string) => {
    const url = buildPartnerAcademyPortalUrl(partnerName);
    navigator.clipboard.writeText(url);
    const key = partnerName || 'general';
    setCopiedPartnerKey(key);
    setTimeout(() => {
      setCopiedPartnerKey((current) => (current === key ? null : current));
    }, 2500);
  };

  // Listen for live Partner Academy course updates
  useEffect(() => {
    const handleSync = () => setAcademySyncTick((prev) => prev + 1);
    window.addEventListener('quext-partner-progress-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('quext-partner-progress-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const academyUsers = useMemo(() => {
    void academySyncTick;
    return loadPartnerAcademyUsers();
  }, [academySyncTick]);

  // Build list of available PMs from standard roster + any PMs on projects
  const pmOptions = useMemo(() => {
    const names = new Set<string>(AVAILABLE_PMS.map((pm) => pm.name));
    projects.forEach((p) => {
      if (p.assignedPM?.name) {
        names.add(p.assignedPM.name);
      }
    });
    return Array.from(names);
  }, [projects]);

  // Narrow projects to the selected PM
  const filteredProjects = useMemo(() => {
    if (selectedPMFilter === 'all') return projects;
    return projects.filter((p) => p.assignedPM?.name === selectedPMFilter);
  }, [projects, selectedPMFilter]);

  const onTrackProjects = filteredProjects.filter((p) => p.statusTag === 'On Track');
  const behindScheduleProjects = filteredProjects.filter((p) => p.statusTag === 'Behind Schedule');
  const highRiskProjects = filteredProjects.filter((p) => p.statusTag === 'High Risk');

  // Evaluate project course completion for all filtered projects
  const projectCourseEvaluations = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getProjectPartnerCourseCompletion>>();
    filteredProjects.forEach((p) => {
      map.set(p.id, getProjectPartnerCourseCompletion(p, academyUsers));
    });
    return map;
  }, [filteredProjects, academyUsers]);

  // Build overall Integrator Partner Course Progress summaries
  const partnerOverallSummaries = useMemo(() => {
    const allPartners = getAllIntegratorPartners(projects);
    return allPartners
      .map((partnerName) => {
        const overall = getPartnerOverallProgress(partnerName, academyUsers);
        const assignedFilteredProjects = filteredProjects.filter((p) =>
          getProjectIntegratorPartners(p).includes(partnerName)
        );
        const assignedAllProjects = projects.filter((p) =>
          getProjectIntegratorPartners(p).includes(partnerName)
        );

        const projectEvaluations = assignedFilteredProjects.map((proj) => {
          const evalObj =
            projectCourseEvaluations.get(proj.id) ||
            getProjectPartnerCourseCompletion(proj, academyUsers);
          const partnerSpec =
            evalObj.partnerStatuses.find(
              (ps) => ps.partnerShortName.toLowerCase() === partnerName.toLowerCase()
            ) || evalObj.partnerStatuses[0];
          return {
            project: proj,
            isCompleted: partnerSpec ? partnerSpec.isCompleted : evalObj.isCompleted,
            completedCoursesCount: partnerSpec
              ? partnerSpec.completedCoursesCount
              : evalObj.completedCoursesCount,
            totalCoursesCount: partnerSpec
              ? partnerSpec.totalCoursesCount
              : evalObj.totalCoursesCount,
            progressPct: partnerSpec ? partnerSpec.progressPct : evalObj.overallProjectCoursePct,
          };
        });

        const completedAssignedProjectsCount = projectEvaluations.filter(
          (pe) => pe.isCompleted
        ).length;
        const allAssignedProjectsCoursesDone =
          projectEvaluations.length > 0
            ? completedAssignedProjectsCount === projectEvaluations.length
            : overall.isAllAcademyCompleted;

        return {
          overall,
          assignedFilteredProjects,
          assignedAllProjectsCount: assignedAllProjects.length,
          projectEvaluations,
          completedAssignedProjectsCount,
          allAssignedProjectsCoursesDone,
        };
      })
      .filter((item) => {
        // When filtering by a specific PM, only show partners assigned to that PM's projects
        if (selectedPMFilter !== 'all' && item.assignedFilteredProjects.length === 0) {
          return false;
        }
        if (partnerProgressFilter === 'completed') {
          return item.allAssignedProjectsCoursesDone;
        }
        if (partnerProgressFilter === 'in_progress') {
          return !item.allAssignedProjectsCoursesDone;
        }
        return true;
      });
  }, [projects, filteredProjects, academyUsers, selectedPMFilter, partnerProgressFilter, projectCourseEvaluations]);

  // Aggregate KPI metrics for Partner Course Progress in Live Activity Hub
  const partnerHubMetrics = useMemo(() => {
    const allPartners = getAllIntegratorPartners(projects);
    const relevantPartners =
      selectedPMFilter === 'all'
        ? allPartners
        : allPartners.filter((partnerName) =>
            filteredProjects.some((p) => getProjectIntegratorPartners(p).includes(partnerName))
          );

    const summaries = relevantPartners.map((name) => getPartnerOverallProgress(name, academyUsers));
    const avgOverallAcademyPct =
      summaries.length > 0
        ? Math.round(summaries.reduce((acc, s) => acc + s.overallPct, 0) / summaries.length)
        : 0;

    const totalPassedModules = summaries.reduce((acc, s) => acc + s.completedModulesCount, 0);
    const totalPossibleModules = summaries.reduce((acc, s) => acc + s.totalModulesCount, 0);

    const projectsWithCompletedCourses = filteredProjects.filter(
      (p) => projectCourseEvaluations.get(p.id)?.isCompleted
    ).length;

    const partnersFullyReadyCount = relevantPartners.filter((partnerName) => {
      const assigned = filteredProjects.filter((p) =>
        getProjectIntegratorPartners(p).includes(partnerName)
      );
      if (assigned.length === 0) {
        return getPartnerOverallProgress(partnerName, academyUsers).isAllAcademyCompleted;
      }
      return assigned.every((p) => {
        const ev = projectCourseEvaluations.get(p.id);
        const ps = ev?.partnerStatuses.find(
          (s) => s.partnerShortName.toLowerCase() === partnerName.toLowerCase()
        );
        return ps ? ps.isCompleted : ev?.isCompleted;
      });
    }).length;

    return {
      relevantPartnersCount: relevantPartners.length,
      avgOverallAcademyPct,
      totalPassedModules,
      totalPossibleModules,
      projectsWithCompletedCourses,
      totalFilteredProjects: filteredProjects.length,
      partnersFullyReadyCount,
    };
  }, [projects, filteredProjects, selectedPMFilter, academyUsers, projectCourseEvaluations]);

  // Collect all recent events across filtered projects (customer walkthrough submissions/updates, partner academy course progress, logs, notes, status)
  interface ActivityItem {
    id: string;
    projectId: string;
    propertyName: string;
    assignedPMName: string;
    timestamp: string;
    sortKey: string;
    type: 'customer_kickoff' | 'partner_training' | 'installer_log' | 'pm_note' | 'status_flag' | 'milestone';
    title: string;
    details: string;
    badge: string;
    badgeColor: string;
  }

  const activities: ActivityItem[] = [];

  filteredProjects.forEach((p) => {
    // 0. Add Integrator Partner Course Readiness event for this project
    const courseEval = projectCourseEvaluations.get(p.id);
    if (courseEval) {
      const partnerNames = courseEval.assignedPartners.join(', ');
      activities.push({
        id: `act-partner-courses-${p.id}`,
        projectId: p.id,
        propertyName: p.propertyName,
        assignedPMName: p.assignedPM.name,
        timestamp: courseEval.isCompleted ? 'Courses Verified' : 'Training Active',
        sortKey: courseEval.isCompleted ? `9997-${p.lastUpdated}` : `9996-${p.lastUpdated}`,
        type: 'partner_training',
        title: courseEval.isCompleted
          ? `Integrator Partner (${partnerNames}) Completed All ${courseEval.totalCoursesCount} Pre-Packaged Project Courses (100%)`
          : `Integrator Partner (${partnerNames}) Course Progress: ${courseEval.completedCoursesCount}/${courseEval.totalCoursesCount} Courses Completed (${courseEval.overallProjectCoursePct}%)`,
        details: courseEval.isCompleted
          ? `All required Quext Partner Academy certification modules for ${p.propertyName}'s hardware BOM are passed and verified prior to installation.`
          : `Remaining required modules for ${p.propertyName}: ${
              courseEval.partnerStatuses[0]?.courseStatuses
                .filter((c) => !c.isCompleted)
                .map((c) => `${c.code} (${c.progressPct}%)`)
                .join(', ') || 'In Progress'
            }.`,
        badge: courseEval.isCompleted
          ? '✓ Partner Courses Completed'
          : `⏳ Partner Courses ${courseEval.overallProjectCoursePct}%`,
        badgeColor: courseEval.isCompleted
          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
          : 'bg-purple-100 text-purple-900 border-purple-300',
      });
    }

    // 1. Add live Customer Kickoff Walkthrough & Customer Portal notifications for this project's PM
    const pmCustomerNotifs = (p.activityNotifications || []).filter((n) => n.audience === 'pm');
    pmCustomerNotifs.forEach((notif) => {
      activities.push({
        id: `act-cust-notif-${notif.id}`,
        projectId: p.id,
        propertyName: p.propertyName,
        assignedPMName: p.assignedPM.name,
        timestamp: notif.timestamp,
        sortKey: `9999-${notif.createdAtIso}`,
        type: 'customer_kickoff',
        title: notif.title,
        details: notif.details,
        badge: notif.badgeLabel || 'Customer Walkthrough Submitted',
        badgeColor:
          notif.category === 'customer_kickoff_submission'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-sky-100 text-sky-800 border-sky-300',
      });
    });

    // If customerIntake.walkthroughCompleted is true and no explicit customer_kickoff_submission notification exists yet, include it
    if (
      p.customerIntake?.walkthroughCompleted &&
      !pmCustomerNotifs.some((n) => n.category === 'customer_kickoff_submission')
    ) {
      const submittedTime = p.customerIntake.submittedAt
        ? new Date(p.customerIntake.submittedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Submitted';
      activities.push({
        id: `act-kickoff-completed-${p.id}`,
        projectId: p.id,
        propertyName: p.propertyName,
        assignedPMName: p.assignedPM.name,
        timestamp: submittedTime,
        sortKey: `9998-${p.customerIntake.submittedAt || p.lastUpdated}`,
        type: 'customer_kickoff',
        title: 'Customer Submitted Kickoff Walkthrough Form Answers',
        details: `PMS: ${p.customerIntake.pmsSoftware || 'Yardi'} · ${
          p.customerIntake.commonAreaDoors?.length || 0
        } Common Area Doors · ${p.customerIntake.staffRoles?.length || 0} Staff Roles confirmed for PM ${
          p.assignedPM.name
        }.`,
        badge: 'Kickoff Walkthrough Submitted',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      });
    }

    // 2. Add install logs
    p.installLogs.forEach((log) => {
      activities.push({
        id: `act-log-${log.id}`,
        projectId: p.id,
        propertyName: p.propertyName,
        assignedPMName: p.assignedPM.name,
        timestamp: log.timestamp,
        sortKey: log.timestamp,
        type: 'installer_log',
        title: `Installed +${log.quantityCompleted} ${log.itemName}`,
        details: `${log.locationCompleted} · Verified by ${log.installerName} (${log.statusCheck})`,
        badge: 'Field Install',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      });
    });

    // 3. Add PM notes
    p.notes.forEach((note) => {
      activities.push({
        id: `act-note-${note.id}`,
        projectId: p.id,
        propertyName: p.propertyName,
        assignedPMName: p.assignedPM.name,
        timestamp: note.timestamp,
        sortKey: note.timestamp,
        type: 'pm_note',
        title: `${note.author} posted note: ${note.category}`,
        details: note.text,
        badge: note.category,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      });
    });

    // 4. Add status reason if present
    if (p.statusReason) {
      activities.push({
        id: `act-status-${p.id}`,
        projectId: p.id,
        propertyName: p.propertyName,
        assignedPMName: p.assignedPM.name,
        timestamp: new Date(p.lastUpdated).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        sortKey: p.lastUpdated,
        type: 'status_flag',
        title: `Health Tag: ${p.statusTag}`,
        details: p.statusReason,
        badge: p.statusTag,
        badgeColor:
          p.statusTag === 'On Track'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : p.statusTag === 'Behind Schedule'
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'bg-rose-100 text-rose-800 border-rose-300',
      });
    }
  });

  // Sort activities newest first
  activities.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const totalQuotedUnits = filteredProjects.reduce(
    (acc, p) => acc + p.bomItems.reduce((bAcc, item) => bAcc + item.quantity, 0),
    0
  );
  const totalInstalledUnits = filteredProjects.reduce(
    (acc, p) => acc + p.bomItems.reduce((bAcc, item) => bAcc + item.installedCount, 0),
    0
  );
  const overallPct = totalQuotedUnits > 0 ? Math.round((totalInstalledUnits / totalQuotedUnits) * 100) : 0;

  const handleHealthTagClick = (tag: ProjectStatusTag, count: number, matchedList: OperationProject[]) => {
    if (count === 1 && matchedList[0]) {
      onNavigateToProject(matchedList[0].id);
    } else {
      onNavigateToAllProjects(tag);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Homescreen Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-white via-sky-50/40 to-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Quext Vision Secret Emblem in Top Right */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-4 z-20">
          <QuextVisionLogo size={63} onTriggerSecretFocus={onTriggerSecretFocus} />
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pr-14 sm:pr-20">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded-md">
                Live Operations Hub
              </span>
              <span className="text-xs text-slate-500 font-medium">· Real-Time Activity &amp; Implementation Telemetry</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                Welcome back, {currentUserName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                {currentUserRole}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Monitoring field operations with Project Managers <strong>Bethany Condon</strong>, <strong>Megan Rossman</strong>, <strong>Ian Robertson</strong>, and <strong>Raul Recalde</strong> across all multifamily smart community installations.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
            <button
              onClick={onNavigateToOperationsDashboard}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Installation Dashboard</span>
            </button>

            <button
              onClick={() => {
                window.location.hash = '#/timeline';
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Installation Timeline (3-Yr)</span>
            </button>

            <button
              onClick={() => onNavigateToAllProjects()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Projects Directory ({filteredProjects.length})</span>
            </button>
          </div>
        </div>

        {/* Assigned Project Manager Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-1">
              <Filter className="w-3.5 h-3.5 text-sky-600" />
              <span>Filter by Assigned PM:</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPMFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPMFilter === 'all'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>All Project Managers</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  selectedPMFilter === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {projects.length}
              </span>
            </button>

            {pmOptions.map((pmName) => {
              const count = projects.filter((p) => p.assignedPM?.name === pmName).length;
              const isSelected = selectedPMFilter === pmName;
              return (
                <button
                  key={pmName}
                  type="button"
                  onClick={() => setSelectedPMFilter(isSelected ? 'all' : pmName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{pmName}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPMFilter}
              onChange={(e) => setSelectedPMFilter(e.target.value)}
              aria-label="Filter by Assigned Project Manager"
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs"
            >
              <option value="all">All Assigned PMs ({projects.length} Projects)</option>
              {pmOptions.map((pmName) => {
                const count = projects.filter((p) => p.assignedPM?.name === pmName).length;
                return (
                  <option key={pmName} value={pmName}>
                    {pmName} ({count} {count === 1 ? 'Project' : 'Projects'})
                  </option>
                );
              })}
            </select>

            {selectedPMFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedPMFilter('all')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Clear PM Filter"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Health Status & KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
          
          {/* Projects Health Status Box (Clickable Tags) */}
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-between gap-2">
              <span className="truncate">
                Projects Health Status
                {selectedPMFilter !== 'all' ? ` (${selectedPMFilter})` : ''}
              </span>
              <Activity className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => handleHealthTagClick('On Track', onTrackProjects.length, onTrackProjects)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                title={onTrackProjects.length === 1 ? `Open ${onTrackProjects[0].propertyName}` : `Show all ${onTrackProjects.length} On Track projects`}
              >
                {onTrackProjects.length} On Track
              </button>

              <button
                type="button"
                onClick={() => handleHealthTagClick('Behind Schedule', behindScheduleProjects.length, behindScheduleProjects)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap"
                title={behindScheduleProjects.length === 1 ? `Open ${behindScheduleProjects[0].propertyName}` : `Show all ${behindScheduleProjects.length} Behind Schedule projects`}
              >
                {behindScheduleProjects.length} Behind
              </button>

              <button
                type="button"
                onClick={() => handleHealthTagClick('High Risk', highRiskProjects.length, highRiskProjects)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 transition-colors cursor-pointer whitespace-nowrap"
                title={highRiskProjects.length === 1 ? `Open ${highRiskProjects[0].propertyName}` : `Show all ${highRiskProjects.length} High Risk projects`}
              >
                {highRiskProjects.length} High Risk
              </button>
            </div>
          </div>

          {/* BOM Total Hardware Installed */}
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-between">
              <span>
                Total Hardware Installed
                {selectedPMFilter !== 'all' ? ` (${selectedPMFilter})` : ''}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
              {totalInstalledUnits.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">
                / {totalQuotedUnits.toLocaleString()} items ({overallPct}%)
              </span>
            </div>
          </div>

          {/* Active Communities */}
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-between">
              <span>
                Active Communities
                {selectedPMFilter !== 'all' ? ` (${selectedPMFilter})` : ''}
              </span>
              <Users className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Community' : 'Communities'}
              <span className="text-xs font-normal text-slate-500 ml-2">
                {selectedPMFilter === 'all' ? 'in active deployment' : `assigned to ${selectedPMFilter}`}
              </span>
            </div>
          </div>

          {/* Integrator Partner Course Readiness Summary KPI */}
          <div className="p-3.5 bg-gradient-to-br from-purple-50/90 via-white to-indigo-50/60 rounded-lg border border-purple-200 shadow-xs">
            <div className="text-xs text-purple-900 font-bold mb-1 flex items-center justify-between">
              <span className="truncate">Partner Course Readiness</span>
              <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
            </div>
            <div className="text-xl font-extrabold text-purple-950 font-mono mt-1 tabular-nums flex items-baseline gap-1.5">
              <span>{partnerHubMetrics.avgOverallAcademyPct}%</span>
              <span className="text-xs font-semibold text-purple-800 font-sans">
                Overall ({partnerHubMetrics.projectsWithCompletedCourses}/{partnerHubMetrics.totalFilteredProjects} Projects Ready)
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* NEW: Integrator Partner Course Progress & Certification Readiness Hub in Live Activity Hub */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
                  Partner Academy Telemetry
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  · Live Integrator Course &amp; Project Prep Tracking
                </span>
                {selectedPMFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                    Filtered by PM: {selectedPMFilter}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-1">
                Integrator Partner Course Progress Overview
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 max-w-3xl">
                Real-time visibility for Project Managers into each Integrator Partner&apos;s overall Quext Partner Academy certification progress (across all 7 hardware &amp; portal modules) and whether they have completed the pre-packaged courses for their assigned projects.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPartnerProgressFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  partnerProgressFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Partners ({partnerHubMetrics.relevantPartnersCount})
              </button>
              <button
                type="button"
                onClick={() => setPartnerProgressFilter('completed')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  partnerProgressFilter === 'completed'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ✓ Courses Complete ({partnerHubMetrics.partnersFullyReadyCount})
              </button>
              <button
                type="button"
                onClick={() => setPartnerProgressFilter('in_progress')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  partnerProgressFilter === 'in_progress'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⏳ In Progress ({partnerHubMetrics.relevantPartnersCount - partnerHubMetrics.partnersFullyReadyCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAreProjectCardsMinimized((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
              title={areProjectCardsMinimized ? 'Expand all partner project cards to full size' : 'Hide all cards as a whole to save space'}
            >
              {areProjectCardsMinimized ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                  <span>Expand Cards ({partnerOverallSummaries.length})</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
                  <span>Minimize Cards</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleCopyPartnerLink()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs transition-colors cursor-pointer"
              title="Copy dedicated Partner Academy link to send to field integrators"
            >
              {copiedPartnerKey === 'general' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-purple-600" />}
              <span>{copiedPartnerKey === 'general' ? 'Link Copied!' : 'Copy Partner Invite Link'}</span>
            </button>

            {onOpenPartnerAcademy && (
              <button
                type="button"
                onClick={() => onOpenPartnerAcademy()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Partner Academy</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Summary KPI Tiles for PM Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Overall Academy Completion</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
              {partnerHubMetrics.avgOverallAcademyPct}%
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${partnerHubMetrics.avgOverallAcademyPct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {partnerHubMetrics.totalPassedModules} of {partnerHubMetrics.totalPossibleModules} total partner modules passed
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center justify-between">
              <span>Projects w/ Courses Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-950 font-mono mt-1 tabular-nums">
              {partnerHubMetrics.projectsWithCompletedCourses}{' '}
              <span className="text-xs font-normal text-emerald-800">
                / {partnerHubMetrics.totalFilteredProjects} Projects
              </span>
            </div>
            <div className="text-[11px] text-emerald-800 mt-1">
              Assigned integrator passed 100% of required project BOM courses
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center justify-between">
              <span>Projects w/ Courses In Progress</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-950 font-mono mt-1 tabular-nums">
              {partnerHubMetrics.totalFilteredProjects - partnerHubMetrics.projectsWithCompletedCourses}{' '}
              <span className="text-xs font-normal text-amber-800">
                / {partnerHubMetrics.totalFilteredProjects} Projects
              </span>
            </div>
            <div className="text-[11px] text-amber-800 mt-1">
              Integrators actively completing pre-packaged hardware modules
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200">
            <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-between">
              <span>Partners 100% Project-Ready</span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-950 font-mono mt-1 tabular-nums">
              {partnerHubMetrics.partnersFullyReadyCount}{' '}
              <span className="text-xs font-normal text-indigo-800">
                / {partnerHubMetrics.relevantPartnersCount} Partners
              </span>
            </div>
            <div className="text-[11px] text-indigo-800 mt-1">
              Click any module pill below to sync or verify partner progress
            </div>
          </div>
        </div>

        {/* Per-Integrator Partner Course Progress Cards (Minimizable as a whole to save space) */}
        {!areProjectCardsMinimized ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {partnerOverallSummaries.map(
              ({
                overall,
                projectEvaluations,
                completedAssignedProjectsCount,
                allAssignedProjectsCoursesDone,
              }) => (
                <div
                  key={overall.partnerShortName}
                  className={`rounded-xl border p-4 flex flex-col justify-between transition-all shadow-2xs ${
                    allAssignedProjectsCoursesDone
                      ? 'bg-emerald-50/25 border-emerald-200 hover:border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Partner Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-indigo-100 text-indigo-950 border border-indigo-300">
                            {overall.partnerShortName}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {overall.companyCode}
                          </span>
                          {allAssignedProjectsCoursesDone ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Project Courses Complete</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Courses In Progress</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">
                          {overall.companyName}
                        </h3>
                        <div className="text-[11px] text-slate-500">
                          Lead: <strong className="text-slate-700">{overall.leadName}</strong> ·{' '}
                          <span className="font-mono">{overall.email}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-lg font-extrabold font-mono tabular-nums ${
                            overall.overallPct === 100
                              ? 'text-emerald-700'
                              : overall.overallPct >= 70
                              ? 'text-purple-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {overall.overallPct}%
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {overall.completedModulesCount}/{overall.totalModulesCount} Academy
                        </div>
                      </div>
                    </div>

                    {/* Overall Academy Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-600">
                          Overall Academy Course Progress
                        </span>
                        <span className="font-mono text-slate-700 font-bold">
                          {overall.passedQuizzesCount} Quizzes Passed
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            overall.overallPct === 100
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-purple-600 to-cyan-500'
                          }`}
                          style={{ width: `${overall.overallPct}%` }}
                        />
                      </div>
                    </div>

                    {/* All 7 Academy Modules Status Pills (Clickable to toggle/verify in real time) */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>Academy Course Modules ({overall.completedModulesCount}/{overall.totalModulesCount})</span>
                        <span className="font-normal text-slate-400">Click pill to toggle</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {overall.modules.map((mod) => (
                          <button
                            key={mod.moduleId}
                            type="button"
                            onClick={() =>
                              togglePartnerSingleCourseCompletion(
                                overall.partnerShortName,
                                mod.moduleId
                              )
                            }
                            title={`${mod.code}: ${mod.title} — ${
                              mod.isCompleted
                                ? `Completed (${mod.quizScore ? `Quiz: ${mod.quizScore}%` : '100%'})`
                                : `In Progress (${mod.progressPct}%)`
                            }. Click to toggle completion.`}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer inline-flex items-center gap-1 ${
                              mod.isCompleted
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : mod.progressPct > 0
                                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{mod.isCompleted ? '✓' : mod.progressPct > 0 ? '⏳' : '○'}</span>
                            <span>{mod.code}</span>
                            <span>{mod.progressPct}%</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Assigned Projects Course Completion Breakdown */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                        <span>
                          Assigned Projects ({completedAssignedProjectsCount}/{projectEvaluations.length} Courses Complete)
                        </span>
                      </div>
                      {projectEvaluations.length === 0 ? (
                        <div className="text-[11px] text-slate-400 italic py-1">
                          No projects assigned under current filter.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
                          {projectEvaluations.map((pe) => (
                            <div
                              key={pe.project.id}
                              onClick={() => onNavigateToProject(pe.project.id)}
                              className="p-2 rounded-lg bg-slate-50 hover:bg-sky-50/70 border border-slate-200 hover:border-sky-300 flex items-center justify-between gap-2 text-xs cursor-pointer transition-all"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {pe.project.propertyName}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  PM: {pe.project.assignedPM.name} · {pe.project.city}
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${
                                  pe.isCompleted
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                {pe.isCompleted
                                  ? `✓ Completed (${pe.completedCoursesCount}/${pe.totalCoursesCount})`
                                  : `⏳ ${pe.completedCoursesCount}/${pe.totalCoursesCount} (${pe.progressPct}%)`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Open Partner in Academy */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPartnerLink(overall.partnerShortName)}
                      className="text-[11px] font-semibold text-slate-600 hover:text-purple-700 inline-flex items-center gap-1 cursor-pointer"
                      title={`Copy dedicated invite link for ${overall.partnerShortName}`}
                    >
                      {copiedPartnerKey === overall.partnerShortName ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3 text-purple-600" />
                          <span>Copy Partner Link</span>
                        </>
                      )}
                    </button>
                    {onOpenPartnerAcademy && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenPartnerAcademy(
                            overall.partnerShortName,
                            projectEvaluations[0]?.project.id
                          )
                        }
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View in Partner Academy</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* Minimized Compact Strip: Hides all cards as a whole to save space */
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-slate-900 font-mono">
                {partnerOverallSummaries.length} Partner Cards Minimized
              </span>
              <span className="text-slate-400">•</span>
              <span>
                Avg Academy Progress: <strong className="font-mono text-purple-700">{partnerHubMetrics.avgOverallAcademyPct}%</strong>
              </span>
              <span className="text-slate-400">•</span>
              <span>
                Projects Complete: <strong className="font-mono text-emerald-700">{partnerHubMetrics.projectsWithCompletedCourses}/{partnerHubMetrics.totalFilteredProjects}</strong>
              </span>
              <span className="text-slate-400">•</span>
              <span>
                Ready Partners: <strong className="font-mono text-indigo-700">{partnerHubMetrics.partnersFullyReadyCount}/{partnerHubMetrics.relevantPartnersCount}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAreProjectCardsMinimized(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-2xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Expand All Cards ({partnerOverallSummaries.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Left Activity Stream + Right Community Quick Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Activity Feed across filtered projects */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900">
                Latest Updates &amp; Field Activity
              </h2>
              {selectedPMFilter !== 'all' && (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded-md">
                  PM: {selectedPMFilter}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing {activities.length} recent events
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No recent activity recorded for {selectedPMFilter === 'all' ? 'any project' : selectedPMFilter} yet.
              </div>
            ) : (
              activities.slice(0, 14).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateToProject(item.projectId)}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sky-700 group-hover:underline">
                        {item.propertyName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        PM: {item.assignedPMName}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-slate-500 text-[11px]">{item.timestamp}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="font-semibold text-slate-900 text-xs mt-0.5">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                    {item.details}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Projects Spotlight */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Communities</h3>
                {selectedPMFilter !== 'all' && (
                  <p className="text-[11px] text-sky-700 font-semibold mt-0.5">
                    Filtered by PM: {selectedPMFilter}
                  </p>
                )}
              </div>
              <button
                onClick={() => onNavigateToAllProjects()}
                className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No active communities assigned to {selectedPMFilter}.
                </div>
              ) : (
                filteredProjects.slice(0, 6).map((project) => {
                  const totalQuoted = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
                  const totalInstalled = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
                  const pct = totalQuoted > 0 ? Math.min(100, Math.round((totalInstalled / totalQuoted) * 100)) : 0;
                  const courseEval = projectCourseEvaluations.get(project.id);

                  return (
                    <div
                      key={project.id}
                      onClick={() => onNavigateToProject(project.id)}
                      className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900 truncate max-w-[170px]">
                          {project.propertyName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            project.statusTag === 'On Track'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : project.statusTag === 'Behind Schedule'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {project.statusTag}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1">
                        <span>
                          {project.city}, {project.state} · <strong className="text-slate-700 font-sans">{project.assignedPM.name}</strong>
                        </span>
                        <div className="flex items-center gap-1">
                          {getProjectIntegratorPartners(project).map((partner) => (
                            <span
                              key={partner}
                              className="px-1 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200"
                            >
                              {partner}
                            </span>
                          ))}
                          <span className="font-bold text-slate-700 ml-1">{pct}%</span>
                        </div>
                      </div>

                      {/* Partner Course Completion Status Pill on Community Card */}
                      {courseEval && (
                        <div className="mt-1.5 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Integrator Courses:</span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold border ${
                              courseEval.isCompleted
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}
                          >
                            {courseEval.isCompleted
                              ? `✓ Completed (${courseEval.completedCoursesCount}/${courseEval.totalCoursesCount})`
                              : `⏳ Incomplete (${courseEval.completedCoursesCount}/${courseEval.totalCoursesCount} · ${courseEval.overallProjectCoursePct}%)`}
                          </span>
                        </div>
                      )}

                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-sky-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};


