import React, { useState, useEffect, useMemo } from 'react';
import { OperationProject, ProjectStatusTag, Quote, calculateProjectScheduleHealth } from '../types';
import { OverallDashboard } from './OverallDashboard';
import { AllProjectsTab } from './AllProjectsTab';
import { ProjectDetailView } from './ProjectDetailView';
import { CreateManualProjectModal } from './CreateManualProjectModal';
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
} from 'lucide-react';
import {
  buildProjectPrePackagedBundle,
  getProjectPartnerCourseCompletion,
  loadPartnerAcademyUsers,
  setPartnerCourseCompletionForProject,
  togglePartnerSingleCourseCompletion,
} from '../partner-academy/utils/projectCoursePackager';

interface OperationsViewProps {
  projects: OperationProject[];
  quotesList: Quote[];
  onUpdateProject: (updated: OperationProject) => void;
  onCreateProject: (newProject: OperationProject) => void;
  onUpdateProjectStatusTag: (projectId: string, newTag: ProjectStatusTag) => void;
  onViewQuoteAnalysis: (quoteId: string) => void;
  activeSubTab: string; // 'dashboard' | 'all-projects' | projectId
  onSelectSubTab: (tabId: string) => void;
  externalDirectoryFilter?: ProjectStatusTag | 'all';
  onOpenProjectInPartnerAcademy?: (project: OperationProject) => void;
  projectDetailInitialTab?: 'field-bom' | 'customer-comms' | 'customer-kickoff';
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  projects,
  quotesList,
  onUpdateProject,
  onCreateProject,
  onUpdateProjectStatusTag,
  onViewQuoteAnalysis,
  activeSubTab,
  onSelectSubTab,
  externalDirectoryFilter = 'all',
  onOpenProjectInPartnerAcademy,
  projectDetailInitialTab,
}) => {
  const [directoryFilter, setDirectoryFilter] = useState<ProjectStatusTag | 'all'>(externalDirectoryFilter);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [academySyncTick, setAcademySyncTick] = useState<number>(0);
  const selectedProject = projects.find((p) => p.id === activeSubTab);

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

  const handleCreatedProject = (newProject: OperationProject) => {
    onCreateProject(newProject);
    setIsCreateModalOpen(false);
    onSelectSubTab(newProject.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Operations Sub-Navigation Tabs Bar (White Theme, Mobile Optimized) */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {/* Sub-Tab 1: Installation Overview Dashboard */}
          <button
            type="button"
            onClick={() => onSelectSubTab('dashboard')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeSubTab === 'dashboard'
                ? 'bg-slate-100 text-slate-900 shadow-xs border border-slate-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Installation Overview</span>
          </button>

          {/* Sub-Tab 2: All Projects (Directory) */}
          <button
            type="button"
            onClick={() => onSelectSubTab('all-projects')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeSubTab === 'all-projects'
                ? 'bg-slate-100 text-slate-900 shadow-xs border border-slate-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>All Projects ({projects.length})</span>
          </button>

          {/* Sub-Tab 3: Kickoff Intake Attention */}
          <button
            type="button"
            onClick={() => onSelectSubTab('kickoff-intake-attention')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeSubTab === 'kickoff-intake-attention'
                ? 'bg-amber-100 text-amber-950 shadow-xs border border-amber-300 font-bold'
                : 'text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Kickoff Attention</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
              {projects.filter((p) => {
                const intake = p.customerIntake;
                return !intake?.walkthroughCompleted || !intake?.pmsSoftware || intake?.pmsSoftware === 'None' || !intake?.commonAreaDoors || intake.commonAreaDoors.length === 0 || !intake?.staffRoles || intake.staffRoles.length === 0;
              }).length}
            </span>
          </button>
        </div>

        {/* Right Side: Quick Project Jump Dropdown + Create Manual Project Button */}
        <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-2 pt-1.5 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <select
            aria-label="Quick Jump to Project"
            value={selectedProject ? selectedProject.id : ''}
            onChange={(e) => {
              if (e.target.value) {
                onSelectSubTab(e.target.value);
              } else {
                onSelectSubTab('dashboard');
              }
            }}
            className="flex-1 sm:flex-initial min-w-[180px] px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="">Jump to Property...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.propertyName} ({p.city})
              </option>
            ))}
          </select>

          <button
            type="button"
            data-tutorial-id="create-manual-project-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
            title="Create a project manually with custom BOM and assign PM/CSM"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Render Active View based on Sub-Tab */}
      {activeSubTab === 'dashboard' && (
        <OverallDashboard
          projects={projects}
          onSelectProjectTab={(projectId) => onSelectSubTab(projectId)}
          onUpdateProjectStatusTag={onUpdateProjectStatusTag}
          onUpdateProject={onUpdateProject}
          onNavigateToKickoffAttention={() => onSelectSubTab('kickoff-intake-attention')}
          onGoToAllProjects={(filterStatus) => {
            if (filterStatus) {
              setDirectoryFilter(filterStatus);
            } else {
              setDirectoryFilter('all');
            }
            onSelectSubTab('all-projects');
          }}
        />
      )}

      {activeSubTab === 'all-projects' && (
        <div data-tutorial-id="all-projects-container">
          <AllProjectsTab
            projects={projects}
            onSelectProjectTab={(projectId) => onSelectSubTab(projectId)}
            onUpdateProjectStatusTag={onUpdateProjectStatusTag}
            onUpdateProject={onUpdateProject}
            initialStatusFilter={directoryFilter}
          />
        </div>
      )}

      {/* Sub-Tab 3 View: Kickoff Intake Attention Gathering */}
      {activeSubTab === 'kickoff-intake-attention' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
                  PM Follow-Up Queue
                </span>
                <span className="text-slate-400 text-xs">·</span>
                <span className="text-xs text-slate-500 font-mono font-bold">Customer Kickoff Management</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-1">
                Kickoff Intake Attention Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                Consolidated tracking of all properties requiring customer orientation submissions, common area door naming approvals, staff permissions rosters, or PMS credentials.
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 flex items-center gap-2.5 shadow-2xs shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="font-bold text-xs">
                  {projects.filter((p) => {
                    const intake = p.customerIntake;
                    return !intake?.walkthroughCompleted || !intake?.pmsSoftware || intake?.pmsSoftware === 'None' || !intake?.commonAreaDoors || intake.commonAreaDoors.length === 0 || !intake?.staffRoles || intake.staffRoles.length === 0;
                  }).length} Properties Requiring Follow-Up
                </div>
                <div className="text-[11px] text-amber-800">Review missing intake items below</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects
              .filter((p) => {
                const intake = p.customerIntake;
                return !intake?.walkthroughCompleted || !intake?.pmsSoftware || intake?.pmsSoftware === 'None' || !intake?.commonAreaDoors || intake.commonAreaDoors.length === 0 || !intake?.staffRoles || intake.staffRoles.length === 0;
              })
              .map((project) => {
                const intake = project.customerIntake;
                const isMissingPms = !intake?.pmsSoftware || intake.pmsSoftware === 'None';
                const isMissingDoors = !intake?.commonAreaDoors || intake.commonAreaDoors.length === 0;
                const hasUnapprovedDoors = (intake?.commonAreaDoors?.length || 0) > 0 && !intake?.doorsConfirmedByCustomer && !intake?.doorNamesNotAvailableNow;
                const isMissingStaff = !intake?.staffRoles || intake.staffRoles.length === 0;
                const notSubmitted = !intake?.walkthroughCompleted;

                return (
                  <div
                    key={`intake-${project.id}`}
                    className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50/50 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                            {project.propertyName}
                          </h3>
                          <span className="text-xs text-slate-500 font-mono">Quote #{project.quoteNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Awaiting Response
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {project.clientName} · {project.city}, {project.state} · {project.unitsCount} Units · PM: <strong className="text-slate-800">{project.assignedPM.name}</strong>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = `${window.location.origin}/#/customer-kickoff/${project.id}`;
                            navigator.clipboard.writeText(url);
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          Copy Kickoff link
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectSubTab(project.id)}
                          className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Open Project Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Missing Items Diagnostic Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className={`p-3 rounded-lg border ${
                        notSubmitted
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <div className="font-bold text-[11px] uppercase tracking-wider">Walkthrough Form</div>
                        <div className="font-semibold text-xs mt-0.5">
                          {notSubmitted ? '⚠ Pending Client Submission' : '✓ Completed'}
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg border ${
                        isMissingPms
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <div className="font-bold text-[11px] uppercase tracking-wider">PMS Selection</div>
                        <div className="font-semibold text-xs mt-0.5">
                          {isMissingPms ? '⚠ Missing / Standalone' : `✓ ${intake?.pmsSoftware}`}
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg border ${
                        isMissingDoors || hasUnapprovedDoors
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <div className="font-bold text-[11px] uppercase tracking-wider">Common Area Doors</div>
                        <div className="font-semibold text-xs mt-0.5">
                          {isMissingDoors
                            ? '⚠ 0 Doors Logged'
                            : intake?.doorNamesNotAvailableNow
                            ? `⏳ Deferred to ${intake.doorNamesFollowUpDate || 'TBD'}`
                            : hasUnapprovedDoors
                            ? `⚠ ${intake?.commonAreaDoors?.length} Unapproved`
                            : `✓ ${intake?.commonAreaDoors?.length} Doors Approved`}
                        </div>
                      </div>

                      <div className={`p-3 rounded-lg border ${
                        isMissingStaff
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <div className="font-bold text-[11px] uppercase tracking-wider">Staff Roster</div>
                        <div className="font-semibold text-xs mt-0.5">
                          {isMissingStaff
                            ? '⚠ 0 Staff Provided'
                            : `✓ ${intake?.staffRoles?.length} Staff Members`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="space-y-4">
          {(() => {
            const bundle =
              selectedProject.partnerCourseBundle || buildProjectPrePackagedBundle(selectedProject);
            const courseEval = getProjectPartnerCourseCompletion(selectedProject, academyUsers);

            return (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-purple-500/40 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        courseEval.isCompleted
                          ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-300'
                          : 'bg-amber-500/25 border-amber-400/50 text-amber-300'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-extrabold text-white text-sm">
                          Assigned Integrator Course Completion Status
                        </span>
                        {courseEval.isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                            <span>
                              ✓ Courses Completed ({courseEval.completedCoursesCount}/{courseEval.totalCoursesCount} Passed · 100%)
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/60 text-amber-200 font-bold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-amber-300" />
                            <span>
                              ⏳ Courses Not Completed — In Progress ({courseEval.completedCoursesCount}/{courseEval.totalCoursesCount} Done · {courseEval.overallProjectCoursePct}%)
                            </span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-purple-500/25 border border-purple-400/40 text-purple-200 font-mono text-[10px] font-bold">
                          Assigned Partner: {courseEval.assignedPartners.join(', ')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-mono text-[10px]">
                          {bundle.generationTrigger}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Pre-packaged for <strong>{selectedProject.propertyName}</strong> BOM:{' '}
                        <strong>{courseEval.totalCoursesCount} Required Certification Courses</strong>,{' '}
                        <strong>{bundle.guides.length} Interactive Field Guides &amp; Simulators</strong>, and{' '}
                        <strong>
                          {courseEval.checklistCompletedCount}/{courseEval.checklistTotalCount} Pre-Install Checklist Items
                        </strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                    {courseEval.partnerStatuses.map((ps) => (
                      <button
                        key={`toggle-complete-${ps.partnerShortName}`}
                        type="button"
                        onClick={() =>
                          setPartnerCourseCompletionForProject(
                            selectedProject,
                            ps.partnerShortName,
                            !ps.isCompleted
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                          ps.isCompleted
                            ? 'bg-emerald-600/30 hover:bg-emerald-600/40 border-emerald-400/50 text-emerald-100'
                            : 'bg-amber-500/30 hover:bg-amber-500/40 border-amber-400/50 text-amber-100'
                        }`}
                        title={
                          ps.isCompleted
                            ? `Click to mark ${ps.partnerShortName}'s courses for this project as In Progress`
                            : `Click to verify & mark all ${ps.partnerShortName} courses for this project as Completed`
                        }
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {ps.isCompleted
                            ? `${ps.partnerShortName}: Verified Complete`
                            : `Mark ${ps.partnerShortName} Courses Complete`}
                        </span>
                      </button>
                    ))}

                    {onOpenProjectInPartnerAcademy && (
                      <button
                        type="button"
                        onClick={() => onOpenProjectInPartnerAcademy(selectedProject)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Open Project in Partner Academy</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Per-Partner & Per-Course Breakdown for this Project */}
                <div className="grid grid-cols-1 gap-3 pt-3 border-t border-white/10">
                  {courseEval.partnerStatuses.map((ps) => (
                    <div
                      key={ps.partnerShortName}
                      className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded font-extrabold bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                            {ps.partnerShortName} ({ps.companyName})
                          </span>
                          <span className="text-slate-300 text-[11px]">
                            Lead: <strong className="text-white">{ps.leadName}</strong> ({ps.email})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-300">
                            Overall Academy: <strong className="text-white">{ps.overallAcademyPct}%</strong>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                              ps.isCompleted
                                ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-200'
                                : 'bg-amber-500/25 border-amber-400/50 text-amber-200'
                            }`}
                          >
                            {ps.isCompleted
                              ? `✓ All ${ps.totalCoursesCount}/${ps.totalCoursesCount} Project Courses Completed`
                              : `⏳ ${ps.completedCoursesCount}/${ps.totalCoursesCount} Project Courses Completed (${ps.progressPct}%)`}
                          </span>
                        </div>
                      </div>

                      {/* Required Project Courses Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {ps.courseStatuses.map((cs) => (
                          <button
                            key={cs.moduleId}
                            type="button"
                            onClick={() =>
                              togglePartnerSingleCourseCompletion(ps.partnerShortName, cs.moduleId)
                            }
                            title={`Click to toggle completion for ${cs.code}: ${cs.title}`}
                            className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                              cs.isCompleted
                                ? 'bg-emerald-950/50 border-emerald-500/40 hover:border-emerald-400'
                                : 'bg-amber-950/40 border-amber-500/40 hover:border-amber-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-300">
                                {cs.code}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                                  cs.isCompleted
                                    ? 'bg-emerald-500/30 text-emerald-200'
                                    : 'bg-amber-500/30 text-amber-200'
                                }`}
                              >
                                {cs.isCompleted
                                  ? `✓ Completed${cs.quizScore ? ` (${cs.quizScore}%)` : ''}`
                                  : `⏳ Incomplete (${cs.progressPct}%)`}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white line-clamp-1">
                              {cs.title}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <ProjectDetailView
            project={selectedProject}
            quotesList={quotesList}
            onUpdateProject={onUpdateProject}
            onBackToDashboard={() => onSelectSubTab('dashboard')}
            onViewQuoteAnalysis={onViewQuoteAnalysis}
            onOpenProjectInPartnerAcademy={onOpenProjectInPartnerAcademy}
            initialTab={projectDetailInitialTab}
          />
        </div>
      )}

      {/* Modal: Create Manual Project */}
      <CreateManualProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreatedProject}
      />

    </div>
  );
};

