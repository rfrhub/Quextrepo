import React, { useState, useEffect, useMemo } from 'react';
import {
  OperationProject,
  ProjectStatusTag,
  Quote,
  calculateProjectScheduleHealth,
  buildCustomerKickoffPortalUrl,
  AVAILABLE_PMS,
  evaluateKickoffIntake,
  KickoffEvaluation,
} from '../types';
import { OverallDashboard } from './OverallDashboard';
import { AllProjectsTab } from './AllProjectsTab';
import { ProjectDetailView } from './ProjectDetailView';
import { CreateManualProjectModal } from './CreateManualProjectModal';
import { SearchablePropertyPicker } from './SearchablePropertyPicker';
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
  Users,
  Search,
  Filter,
  X,
  UserCheck,
  FileCheck,
  MessageSquare,
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
  onDeleteProject?: (projectId: string) => void;
  onUpdateProjectStatusTag: (projectId: string, newTag: ProjectStatusTag) => void;
  onViewQuoteAnalysis: (quoteId: string) => void;
  activeSubTab: string; // 'dashboard' | 'all-projects' | projectId
  onSelectSubTab: (tabId: string) => void;
  externalDirectoryFilter?: ProjectStatusTag | 'all';
  onOpenProjectInPartnerAcademy?: (project: OperationProject) => void;
  projectDetailInitialTab?: 'field-bom' | 'customer-comms' | 'customer-kickoff';
  currentUserName?: string;
  currentUserRole?: string;
  isPMUser?: boolean;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  projects,
  quotesList,
  onUpdateProject,
  onCreateProject,
  onDeleteProject,
  onUpdateProjectStatusTag,
  onViewQuoteAnalysis,
  activeSubTab,
  onSelectSubTab,
  externalDirectoryFilter = 'all',
  onOpenProjectInPartnerAcademy,
  projectDetailInitialTab,
  currentUserName,
  currentUserRole,
  isPMUser,
}) => {
  const [directoryFilter, setDirectoryFilter] = useState<ProjectStatusTag | 'all'>(externalDirectoryFilter);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [academySyncTick, setAcademySyncTick] = useState<number>(0);
  const [kickoffPmFilter, setKickoffPmFilter] = useState<string>('all');
  const [kickoffSearchTerm, setKickoffSearchTerm] = useState<string>('');
  const [kickoffStatusFilter, setKickoffStatusFilter] = useState<'all' | 'needs-attention' | 'completed' | 'corrections'>('all');
  const [isPartnerCoursesExpanded, setIsPartnerCoursesExpanded] = useState<boolean>(false);
  const selectedProject = projects.find((p) => p.id === activeSubTab);

  const evaluatedKickoffProjects = useMemo(() => {
    return projects.map((p) => ({
      project: p,
      eval: evaluateKickoffIntake(p),
    }));
  }, [projects]);

  const kickoffCounts = useMemo(() => {
    const total = evaluatedKickoffProjects.length;
    const completed = evaluatedKickoffProjects.filter((x) => x.eval.isFullyCompleted && !x.eval.hasProductCorrection).length;
    const corrections = evaluatedKickoffProjects.filter((x) => x.eval.hasProductCorrection).length;
    const needsAttention = evaluatedKickoffProjects.filter((x) => !x.eval.isFullyCompleted || x.eval.hasProductCorrection).length;
    return { total, completed, corrections, needsAttention };
  }, [evaluatedKickoffProjects]);

  const kickoffPmList = useMemo(() => {
    const pmCounts = new Map<string, number>();
    evaluatedKickoffProjects.forEach(({ project }) => {
      const name = project.assignedPM?.name?.trim() || 'Unassigned';
      pmCounts.set(name, (pmCounts.get(name) || 0) + 1);
    });

    const allNames = new Set<string>();
    AVAILABLE_PMS.forEach((pm) => allNames.add(pm.name));
    evaluatedKickoffProjects.forEach(({ project }) => {
      if (project.assignedPM?.name) allNames.add(project.assignedPM.name.trim());
    });

    return Array.from(allNames)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        count: pmCounts.get(name) || 0,
      }));
  }, [evaluatedKickoffProjects]);

  const filteredKickoffEntries = useMemo(() => {
    return evaluatedKickoffProjects.filter(({ project, eval: ev }) => {
      // 1. Status Filter
      if (kickoffStatusFilter === 'needs-attention' && ev.isFullyCompleted && !ev.hasProductCorrection) {
        return false;
      }
      if (kickoffStatusFilter === 'completed' && (!ev.isFullyCompleted || ev.hasProductCorrection)) {
        return false;
      }
      if (kickoffStatusFilter === 'corrections' && !ev.hasProductCorrection) {
        return false;
      }

      // 2. PM Filter
      const pmName = project.assignedPM?.name?.trim() || 'Unassigned';
      const matchesPM = kickoffPmFilter === 'all' || pmName === kickoffPmFilter;

      // 3. Search Filter
      const term = kickoffSearchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        project.propertyName.toLowerCase().includes(term) ||
        project.clientName.toLowerCase().includes(term) ||
        project.quoteNumber.toLowerCase().includes(term) ||
        pmName.toLowerCase().includes(term) ||
        `${project.city}, ${project.state}`.toLowerCase().includes(term);

      return matchesPM && matchesSearch;
    });
  }, [evaluatedKickoffProjects, kickoffStatusFilter, kickoffPmFilter, kickoffSearchTerm]);

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

      {/* Sub-Tab 3 View: Kickoff Documents & Intake Status Hub */}
      {(activeSubTab === 'kickoff-intake-attention' || activeSubTab === 'kickoff-attention') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 uppercase tracking-wider">
                  Portfolio Operations
                </span>
                <span className="text-slate-400 text-xs">·</span>
                <span className="text-xs text-slate-500 font-mono font-bold">Kickoff Deliverables Matrix</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-1">
                Kickoff Documents &amp; Intake Status Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                Consolidated tracking of all 6 kickoff deliverables across all projects: customer orientation walkthroughs, PMS credentials, common area door naming approvals, staff access rosters, and customer hardware scope sign-offs.
              </p>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 flex items-center gap-2 shadow-2xs">
                <FileCheck className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs">{kickoffCounts.completed} Completed</div>
                  <div className="text-[10px] text-slate-500">of {kickoffCounts.total} Total Projects</div>
                </div>
              </div>

              {kickoffCounts.needsAttention > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 flex items-center gap-2 shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">{kickoffCounts.needsAttention} Need Attention</div>
                    <div className="text-[10px] text-amber-800">Pending intake items</div>
                  </div>
                </div>
              )}

              {kickoffCounts.corrections > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-950 flex items-center gap-2 shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">{kickoffCounts.corrections} Corrections</div>
                    <div className="text-[10px] text-rose-800">Scope flags from client</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Filter Tabs (All / Needs Attention / Completed / Corrections) */}
          <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              View Status:
            </span>
            <button
              type="button"
              onClick={() => setKickoffStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                kickoffStatusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>All Projects</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                kickoffStatusFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-white text-slate-700'
              }`}>
                {kickoffCounts.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setKickoffStatusFilter('needs-attention')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                kickoffStatusFilter === 'needs-attention'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Needs Attention</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                kickoffStatusFilter === 'needs-attention' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'
              }`}>
                {kickoffCounts.needsAttention}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setKickoffStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                kickoffStatusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Kickoff Completed</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                kickoffStatusFilter === 'completed' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {kickoffCounts.completed}
              </span>
            </button>

            {kickoffCounts.corrections > 0 && (
              <button
                type="button"
                onClick={() => setKickoffStatusFilter('corrections')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  kickoffStatusFilter === 'corrections'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>Product Corrections Flagged</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  kickoffStatusFilter === 'corrections' ? 'bg-rose-700 text-white' : 'bg-rose-200 text-rose-900'
                }`}>
                  {kickoffCounts.corrections}
                </span>
              </button>
            )}
          </div>

          {/* Assigned PM & Search Filter Toolbar */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Left: Assigned PM Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Filter by Assigned PM:</span>
                </div>
                <div className="relative min-w-[240px]">
                  <select
                    id="kickoff-pm-filter-select"
                    aria-label="Filter by Assigned PM"
                    value={kickoffPmFilter}
                    onChange={(e) => setKickoffPmFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-2xs cursor-pointer"
                  >
                    <option value="all">
                      All Assigned PMs ({evaluatedKickoffProjects.length} total)
                    </option>
                    {kickoffPmList.map((pm) => (
                      <option key={pm.name} value={pm.name}>
                        {pm.name} ({pm.count} {pm.count === 1 ? 'property' : 'properties'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right: Search Input & Reset Button */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    aria-label="Search properties"
                    placeholder="Search property, client, quote..."
                    value={kickoffSearchTerm}
                    onChange={(e) => setKickoffSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  {kickoffSearchTerm && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setKickoffSearchTerm('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {(kickoffPmFilter !== 'all' || kickoffSearchTerm || kickoffStatusFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setKickoffPmFilter('all');
                      setKickoffSearchTerm('');
                      setKickoffStatusFilter('all');
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick PM Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200 text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Quick PM Selection:
              </span>
              <button
                type="button"
                onClick={() => setKickoffPmFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  kickoffPmFilter === 'all'
                    ? 'bg-sky-700 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>All PMs</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  kickoffPmFilter === 'all' ? 'bg-sky-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {evaluatedKickoffProjects.length}
                </span>
              </button>

              {kickoffPmList
                .filter((pm) => pm.count > 0)
                .map((pm) => {
                  const isSelected = kickoffPmFilter === pm.name;
                  return (
                    <button
                      key={pm.name}
                      type="button"
                      onClick={() => setKickoffPmFilter(isSelected ? 'all' : pm.name)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-2xs font-bold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                      }`}
                    >
                      <Users className="w-3 h-3 shrink-0" />
                      <span>{pm.name}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isSelected ? 'bg-amber-700 text-white font-bold' : 'bg-amber-100 text-amber-800 font-bold'
                      }`}>
                        {pm.count}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Properties List or Zero State */}
          {filteredKickoffEntries.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                No Properties Match Current Filters
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try selecting &quot;All Projects&quot; or clearing your search term and PM filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKickoffPmFilter('all');
                  setKickoffSearchTerm('');
                  setKickoffStatusFilter('all');
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 mx-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredKickoffEntries.map(({ project, eval: ev }) => {
                const isComplete = ev.isFullyCompleted && !ev.hasProductCorrection;
                const hasCorrection = ev.hasProductCorrection;

                return (
                  <div
                    key={`intake-${project.id}`}
                    className={`p-5 rounded-xl border transition-all space-y-4 ${
                      hasCorrection
                        ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50/60'
                        : isComplete
                        ? 'border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                            {project.propertyName}
                          </h3>
                          <span className="text-xs text-slate-500 font-mono">Quote #{project.quoteNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            hasCorrection
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isComplete
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}>
                            {hasCorrection
                              ? '⚠ Product Correction Requested'
                              : isComplete
                              ? '✓ Kickoff Completed (6/6)'
                              : `${ev.completedCount} of 6 Items Completed (${ev.percentage}%)`}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                            <UserCheck className="w-3 h-3 text-sky-600" />
                            <span>PM: {project.assignedPM?.name || 'Unassigned'}</span>
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {project.clientName} · {project.city}, {project.state} · {project.unitsCount} Units
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = buildCustomerKickoffPortalUrl(project.id);
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

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isComplete ? 'bg-emerald-600' : ev.percentage >= 60 ? 'bg-sky-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${ev.percentage}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-600 shrink-0">
                        {ev.completedCount} / 6 Ready
                      </span>
                    </div>

                    {/* Customer Reported Product List Discrepancy Callout */}
                    {hasCorrection && (
                      <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-lg text-xs text-amber-950 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Hardware Scope Correction Requested:</strong>{' '}
                          <span>&quot;{ev.productCorrectionNotes}&quot;</span>
                        </div>
                      </div>
                    )}

                    {/* Customer Notes Preview */}
                    {project.customerIntake?.customerNotes && (
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <div className="truncate">
                          <span className="font-semibold text-slate-900">Customer Notes:</span>{' '}
                          <span className="italic">&quot;{project.customerIntake.customerNotes}&quot;</span>
                        </div>
                      </div>
                    )}

                    {/* 6 Diagnostic Checklist Deliverable Tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                      {ev.items.map((item) => {
                        const itemComplete = item.isComplete;
                        const itemAttention = item.statusTag === 'attention';

                        return (
                          <div
                            key={item.id}
                            className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                              itemComplete
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                                : itemAttention
                                ? 'bg-amber-50 border-amber-300 text-amber-950'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider truncate" title={item.title}>
                                {item.title}
                              </span>
                              {itemComplete ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              ) : itemAttention ? (
                                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                              ) : (
                                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                            </div>
                            <div className="font-semibold text-xs mt-1 truncate" title={item.statusLabel}>
                              {item.statusLabel}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedProject && (
        <div className="space-y-4">
          {(() => {
            const bundle =
              selectedProject.partnerCourseBundle || buildProjectPrePackagedBundle(selectedProject);
            const courseEval = getProjectPartnerCourseCompletion(selectedProject, academyUsers);

            return (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-purple-500/40 rounded-xl px-4 py-3 shadow-sm space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        courseEval.isCompleted
                          ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-300'
                          : 'bg-amber-500/25 border-amber-400/50 text-amber-300'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-extrabold text-white text-xs sm:text-sm">
                        Integrator Certification:
                      </span>
                      {courseEval.isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>
                            ✓ Completed ({courseEval.completedCoursesCount}/{courseEval.totalCoursesCount} Passed)
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/60 text-amber-200 font-bold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-300" />
                          <span>
                            ⏳ In Progress ({courseEval.completedCoursesCount}/{courseEval.totalCoursesCount} Done · {courseEval.overallProjectCoursePct}%)
                          </span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-purple-500/25 border border-purple-400/40 text-purple-200 font-mono text-[10px] font-bold">
                        Partner: {courseEval.assignedPartners.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPartnerCoursesExpanded((prev) => !prev)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                    >
                      {isPartnerCoursesExpanded
                        ? 'Hide Course Breakdown ▲'
                        : `Course Breakdown (${courseEval.totalCoursesCount}) ▼`}
                    </button>

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
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                          ps.isCompleted
                            ? 'bg-emerald-600/30 hover:bg-emerald-600/40 border-emerald-400/50 text-emerald-100'
                            : 'bg-amber-500/30 hover:bg-amber-500/40 border-amber-400/50 text-amber-100'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {ps.isCompleted
                            ? `${ps.partnerShortName}: Verified`
                            : `Mark ${ps.partnerShortName} Complete`}
                        </span>
                      </button>
                    ))}

                    {onOpenProjectInPartnerAcademy && (
                      <button
                        type="button"
                        onClick={() => onOpenProjectInPartnerAcademy(selectedProject)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Partner Academy</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Per-Partner & Per-Course Breakdown for this Project */}
                {isPartnerCoursesExpanded && (
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
                )}
              </div>
            );
          })()}

          <ProjectDetailView
            key={selectedProject.id}
            project={selectedProject}
            quotesList={quotesList}
            allProjects={projects}
            onUpdateProject={onUpdateProject}
            onDeleteProject={onDeleteProject}
            onBackToDashboard={() => onSelectSubTab('dashboard')}
            onViewQuoteAnalysis={onViewQuoteAnalysis}
            onOpenProjectInPartnerAcademy={onOpenProjectInPartnerAcademy}
            initialTab={projectDetailInitialTab}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
            isPMUser={isPMUser}
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

