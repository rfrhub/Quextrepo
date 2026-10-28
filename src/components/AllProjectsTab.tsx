import React, { useState, useEffect } from 'react';
import {
  OperationProject,
  ProjectStatusTag,
  calculateProjectScheduleHealth,
  AVAILABLE_PMS,
  AVAILABLE_FIELD_TECHS,
  normalizeFieldTech,
  getProjectIntegratorPartners,
  getAllIntegratorPartners,
  ProjectPlatform,
  AVAILABLE_PLATFORMS,
  getProjectPlatform,
  getPlatformBadgeStyle,
} from '../types';
import {
  MapPin,
  ArrowRight,
  Search,
  Filter,
  Users,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  GraduationCap,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
} from 'lucide-react';
import {
  getProjectPartnerCourseCompletion,
  loadPartnerAcademyUsers,
} from '../partner-academy/utils/projectCoursePackager';
import { PMPMitigationPlanPanel } from './PMPMitigationPlanPanel';

interface AllProjectsTabProps {
  projects: OperationProject[];
  onSelectProjectTab: (projectId: string) => void;
  onUpdateProjectStatusTag: (projectId: string, newTag: ProjectStatusTag) => void;
  onUpdateProject?: (updated: OperationProject) => void;
  initialStatusFilter?: ProjectStatusTag | 'all';
}

export const AllProjectsTab: React.FC<AllProjectsTabProps> = ({
  projects,
  onSelectProjectTab,
  onUpdateProjectStatusTag,
  onUpdateProject,
  initialStatusFilter = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [pmFilter, setPmFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [fieldTechFilter, setFieldTechFilter] = useState<string>('all');
  const [integratorFilter, setIntegratorFilter] = useState<string>('all');
  const [areProjectCardsMinimized, setAreProjectCardsMinimized] = useState<boolean>(true);
  const [academySyncTick, setAcademySyncTick] = useState<number>(0);

  useEffect(() => {
    const handleSync = () => setAcademySyncTick((prev) => prev + 1);
    window.addEventListener('quext-partner-progress-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('quext-partner-progress-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const academyUsers = (() => {
    void academySyncTick;
    return loadPartnerAcademyUsers();
  })();

  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  const allAvailableIntegrators = getAllIntegratorPartners(projects);

  const filteredProjects = projects.filter((project) => {
    const health = calculateProjectScheduleHealth(
      project.targetCompletionDate,
      project.statusTag,
      project.notes,
      project.milestones
    );
    const matchesStatus = statusFilter === 'all' || health.effectiveTag === statusFilter;
    const matchesPM = pmFilter === 'all' || project.assignedPM.name === pmFilter;
    const currentTech = normalizeFieldTech(project.assignedFieldTech);
    const matchesFieldTech = fieldTechFilter === 'all' || currentTech === fieldTechFilter;
    const partners = getProjectIntegratorPartners(project);
    const matchesIntegrator = integratorFilter === 'all' || partners.includes(integratorFilter);
    const projectPlatform = getProjectPlatform(project);
    const matchesPlatform = platformFilter === 'all' || projectPlatform === platformFilter;
    const matchesSearch =
      project.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projectPlatform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partners.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesPM && matchesFieldTech && matchesIntegrator && matchesPlatform && matchesSearch;
  });

  const getStatusBadgeStyle = (tag: ProjectStatusTag) => {
    switch (tag) {
      case 'On Track':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Behind Schedule':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'High Risk':
        return 'bg-rose-50 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner (White Theme - Renamed 'Won' to 'Active') */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
                All Active Projects Directory
              </span>
              <span className="text-xs text-slate-500">· Operations Portfolio</span>
            </div>
            {/* Requirement: Header on this page says 'All Won Implementation Projects' -> changed to 'All Active Implementation Projects' */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
              All Active Implementation Projects
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Housing all active deployment projects created from quotes marked as &quot;Deal Won&quot;. Click any project to open its dedicated focus tab with fillable Smart Community BOM and sticky post-it notes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-500">Active Projects:</span>
            <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold">
              {projects.length}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar with PM, Field Tech, Integrator Partner, and Platform Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search property, client, platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-purple-600 shrink-0" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white font-medium"
            >
              <option value="all">All Platforms</option>
              {AVAILABLE_PLATFORMS.map((plat) => (
                <option key={plat} value={plat}>
                  Platform: {plat}
                </option>
              ))}
            </select>
          </div>

          {/* PM Filter */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={pmFilter}
              onChange={(e) => setPmFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
            >
              <option value="all">All PMs</option>
              {AVAILABLE_PMS.map((pm) => (
                <option key={pm.name} value={pm.name}>
                  {pm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Integrator Partner & Installer Filter */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <select
              value={integratorFilter}
              onChange={(e) => setIntegratorFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
            >
              <option value="all">All Integrators / Installers</option>
              {allAvailableIntegrators.map((partner) => (
                <option key={partner} value={partner}>
                  Installer: {partner}
                </option>
              ))}
            </select>
          </div>

          {/* Field Tech Filter */}
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
            <select
              value={fieldTechFilter}
              onChange={(e) => setFieldTechFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
            >
              <option value="all">All Techs</option>
              {AVAILABLE_FIELD_TECHS.map((tech) => (
                <option key={tech} value={tech}>
                  Tech: {tech}
                </option>
              ))}
            </select>
          </div>

          {/* Health Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
            >
              <option value="all">All Health ({projects.length})</option>
              <option value="On Track">✓ On Track</option>
              <option value="Behind Schedule">⏳ Behind Schedule</option>
              <option value="High Risk">⚠ High Risk</option>
            </select>
          </div>

          {/* Minimize / Expand Cards Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setAreProjectCardsMinimized((prev) => !prev)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title={areProjectCardsMinimized ? 'Expand full photo project cards' : 'Minimize cards to compact list to keep page clean'}
            >
              {areProjectCardsMinimized ? (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                  <span>Expand Cards ({filteredProjects.length})</span>
                </>
              ) : (
                <>
                  <List className="w-3.5 h-3.5 text-slate-500" />
                  <span>Minimize Cards</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display: Minimized Compact Table (Default) or Expanded Card Grid */}
      {areProjectCardsMinimized ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 whitespace-nowrap">Health Status</th>
                  <th className="p-3 whitespace-nowrap">Property Community</th>
                  <th className="p-3 whitespace-nowrap">Client</th>
                  <th className="p-3 whitespace-nowrap">Units</th>
                  <th className="p-3 whitespace-nowrap">Platform</th>
                  <th className="p-3 whitespace-nowrap">Assigned PM &amp; Tech</th>
                  <th className="p-3 whitespace-nowrap">Integrator</th>
                  <th className="p-3 whitespace-nowrap">Progress</th>
                  <th className="p-3 whitespace-nowrap">Target Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      No projects match your filter and search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => {
                    const health = calculateProjectScheduleHealth(
                      project.targetCompletionDate,
                      project.statusTag,
                      project.notes,
                      project.milestones
                    );
                    const totalQuotedBOM = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
                    const totalInstalledBOM = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
                    const pct = totalQuotedBOM > 0 ? Math.min(100, Math.round((totalInstalledBOM / totalQuotedBOM) * 100)) : 0;
                    const projectPlatform = getProjectPlatform(project);
                    const badgeStyle = getPlatformBadgeStyle(projectPlatform);

                    return (
                      <tr
                        key={project.id}
                        onClick={() => onSelectProjectTab(project.id)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="p-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={health.effectiveTag}
                            onChange={(e) => onUpdateProjectStatusTag(project.id, e.target.value as ProjectStatusTag)}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${getStatusBadgeStyle(health.effectiveTag)}`}
                          >
                            <option value="On Track">✓ On Track</option>
                            <option value="Behind Schedule">⏳ Behind Schedule</option>
                            <option value="High Risk">⚠ High Risk</option>
                          </select>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {project.propertyName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {project.city}, {project.state}
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap text-slate-600">
                          {project.clientName}
                        </td>
                        <td className="p-3 whitespace-nowrap font-bold font-mono">
                          {project.unitsCount}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle.badgeClass}`}>
                            {projectPlatform}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="text-slate-800 font-semibold">{project.assignedPM.name}</div>
                          <div className="text-[10px] text-amber-800">{normalizeFieldTech(project.assignedFieldTech)}</div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {getProjectIntegratorPartners(project).map((partner) => (
                              <span key={partner} className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200">
                                {partner}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-[11px] text-slate-700">{pct}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                          {project.targetCompletionDate}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:translate-x-0.5 transition-transform">
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            No projects match your filter and search criteria.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const health = calculateProjectScheduleHealth(
              project.targetCompletionDate,
              project.statusTag,
              project.notes,
              project.milestones
            );
            const totalQuotedBOM = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
            const totalInstalledBOM = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
            const pct = totalQuotedBOM > 0 ? Math.min(100, Math.round((totalInstalledBOM / totalQuotedBOM) * 100)) : 0;
            const isKickoffDone = project.customerIntake?.walkthroughCompleted;
            const projectPlatform = getProjectPlatform(project);

            return (
              <div
                key={project.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="relative h-40 bg-slate-900 overflow-hidden">
                    <img
                      src={project.heroImage}
                      alt={project.propertyName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/30" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/20 rounded">
                          #{project.quoteNumber}
                        </span>
                        {/* Interactive Platform Tag Selector */}
                        <select
                          value={projectPlatform}
                          onChange={(e) => {
                            e.stopPropagation();
                            const newPlat = e.target.value as ProjectPlatform;
                            if (onUpdateProject) {
                              onUpdateProject({
                                ...project,
                                platform: newPlat,
                                lastUpdated: new Date().toISOString(),
                              });
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer backdrop-blur-md shadow-xs ${
                            getPlatformBadgeStyle(projectPlatform).badgeClass
                          }`}
                          title="Tag Platform (Quext, Geokey, or Homebase)"
                        >
                          {AVAILABLE_PLATFORMS.map((plat) => (
                            <option key={plat} value={plat}>
                              {plat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Effective Health Tag with Auto Date-Calculation */}
                      <select
                        value={health.effectiveTag}
                        onChange={(e) =>
                          onUpdateProjectStatusTag(project.id, e.target.value as ProjectStatusTag)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer backdrop-blur-md shadow-xs ${getStatusBadgeStyle(
                          health.effectiveTag
                        )}`}
                      >
                        <option value="On Track">✓ On Track</option>
                        <option value="Behind Schedule">⏳ Behind Schedule</option>
                        <option value="High Risk">⚠ High Risk</option>
                      </select>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h3 className="text-base font-bold text-white tracking-tight truncate drop-shadow-md">
                        {project.propertyName}
                      </h3>
                      <div className="text-[11px] text-slate-200 drop-shadow flex items-center gap-1.5 mt-0.5 font-medium">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        <span>{project.city}, {project.state}</span>
                        <span>·</span>
                        <span className="font-mono">{project.unitsCount} units</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3.5 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Client / Operator:</span>
                      <strong className="text-slate-900">{project.clientName}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Platform:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPlatformBadgeStyle(projectPlatform).badgeClass}`}>
                        {projectPlatform}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Assigned PM:</span>
                      <span className="text-sky-700 font-semibold">{project.assignedPM.name}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Field Tech:</span>
                      <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {normalizeFieldTech(project.assignedFieldTech)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Integrator / Installers:</span>
                      <div className="flex items-center gap-1 flex-wrap justify-end max-w-[200px]">
                        {getProjectIntegratorPartners(project).map((partner) => (
                          <span
                            key={partner}
                            className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200"
                          >
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Assigned Integrator Course Completion Status for this Project */}
                    {(() => {
                      const courseEval = getProjectPartnerCourseCompletion(project, academyUsers);
                      return (
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                            <span>Integrator Courses:</span>
                          </span>
                          {courseEval.isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>
                                Completed ({courseEval.completedCoursesCount}/{courseEval.totalCoursesCount})
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>
                                Incomplete ({courseEval.completedCoursesCount}/{courseEval.totalCoursesCount} · {courseEval.overallProjectCoursePct}%)
                              </span>
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Target Handover:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-800 font-bold">{project.targetCompletionDate}</span>
                        <span className={`text-[10px] font-mono px-1 rounded border font-semibold ${
                          health.isOverdue ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {health.weeksBehindLabel}
                        </span>
                      </div>
                    </div>

                    {/* Kickoff Intake Metric Pill */}
                    <div className="flex items-center justify-between text-slate-500 pt-1">
                      <span>Kickoff Intake:</span>
                      {isKickoffDone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Submitted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Needs Follow-Up</span>
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                        <span className="text-slate-600">
                          BOM Installed: {totalInstalledBOM.toLocaleString()} / {totalQuotedBOM.toLocaleString()}
                        </span>
                        <span
                          className={`font-bold ${
                            pct === 100
                              ? 'text-emerald-700'
                              : pct > 50
                              ? 'text-sky-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            pct === 100
                              ? 'bg-emerald-500'
                              : pct > 50
                              ? 'bg-gradient-to-r from-sky-500 to-blue-600'
                              : 'bg-gradient-to-r from-amber-400 to-orange-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Requirement: "Also, when a project is marked as High risk on the project card provide a highlevel reasoning of why it is at high risk, highlight any negative notes that could be impacting the high risk assessment as well as make clear that being egregiously behind schedule is a big factor for the tag." */}
                    {health.effectiveTag === 'High Risk' ? (
                      <div className="p-3 bg-rose-50/90 rounded-xl text-xs text-rose-950 border border-rose-300 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] uppercase tracking-wider">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>High Risk Assessment & Blocker Factor</span>
                        </div>
                        <div className="text-[11px] text-rose-900 leading-snug">
                          <strong className="text-rose-950 font-bold">Egregiously behind schedule is a major factor:</strong>{' '}
                          Project is {health.weeksBehindLabel} ({Math.abs(health.diffDays)} days overdue past target of {project.targetCompletionDate}).
                        </div>
                        {project.statusReason && (
                          <div className="text-[11px] text-slate-800 font-medium pt-1 border-t border-rose-200">
                            <strong>PM Field Status:</strong> {project.statusReason}
                          </div>
                        )}
                        {health.negativeNotes && health.negativeNotes.length > 0 && (
                          <div className="text-[10px] text-rose-800 italic pt-1 border-t border-rose-200 flex items-start gap-1">
                            <span>Negative Note: &ldquo;{health.negativeNotes[0]?.text}&rdquo;</span>
                          </div>
                        )}
                        {health.overdueMilestones && health.overdueMilestones.length > 0 && (
                          <div className="text-[10px] text-rose-700 font-mono">
                            Overdue Milestone: {health.overdueMilestones[0]?.title} (Target: {health.overdueMilestones[0]?.targetDate})
                          </div>
                        )}
                      </div>
                    ) : project.statusReason ? (
                      <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-600 line-clamp-2 border border-slate-200">
                        {project.statusReason}
                      </div>
                    ) : null}

                    {/* Tailored PMP Mitigation Plan for Behind Schedule & High Risk Projects */}
                    {(health.effectiveTag === 'Behind Schedule' ||
                      health.effectiveTag === 'High Risk') && (
                      <PMPMitigationPlanPanel
                        project={project}
                        onUpdateProject={(updated) => {
                          if (onUpdateProject) {
                            onUpdateProject(updated);
                          }
                        }}
                        variant="compact"
                        defaultExpanded={false}
                      />
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => onSelectProjectTab(project.id)}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-sky-600 hover:text-white border border-slate-300 hover:border-sky-600 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Focus Individual Project Tab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      )}
    </div>
  );
};
