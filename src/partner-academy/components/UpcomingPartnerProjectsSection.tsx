import React, { useState, useMemo } from 'react';
import { OperationProject, getProjectIntegratorPartners } from '../../types';
import { useAuth, isQuextEmployeeUser } from '../context/AuthContext';
import { COURSE_MODULES } from '../data/mockData';
import {
  buildProjectPrePackagedBundle,
  PARTNER_IDENTITY_DIRECTORY,
} from '../utils/projectCoursePackager';
import {
  Building2,
  Calendar,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Layers,
  Wrench,
  FileText,
  Sparkles,
  MapPin,
  Cpu,
  Filter,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface UpcomingPartnerProjectsSectionProps {
  projects: OperationProject[];
  onSelectProjectPackage: (project: OperationProject) => void;
}

export const UpcomingPartnerProjectsSection: React.FC<UpcomingPartnerProjectsSectionProps> = ({
  projects,
  onSelectProjectPackage,
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

  // Extract all unique integrator partners across projects (strictly for Quext Employees only)
  const allPartnerFilters = useMemo(() => {
    if (!isQuextEmployee) return [];
    const set = new Set<string>();
    projects.forEach((p) => {
      getProjectIntegratorPartners(p).forEach((partner) => {
        if (partner && partner.trim()) set.add(partner.trim());
      });
    });
    return Array.from(set);
  }, [projects, isQuextEmployee]);

  const [selectedFilter, setSelectedFilter] = useState<string>('my_partner');

  const filteredProjects = useMemo(() => {
    // Non-Quext Partner Users: Strictly isolate to projects assigned to their specific firm.
    // They cannot view other partners' projects and do not fall back to all projects.
    if (!isQuextEmployee) {
      if (!currentPartnerShortName) return [];
      return projects.filter((p) =>
        getProjectIntegratorPartners(p).some(
          (partner) => partner.trim().toLowerCase() === currentPartnerShortName.trim().toLowerCase()
        )
      );
    }

    // Quext Employees: Full portfolio visibility with partner filtering capabilities
    if (selectedFilter === 'all' || selectedFilter === 'my_partner') {
      return projects;
    }

    return projects.filter((p) =>
      getProjectIntegratorPartners(p).some(
        (partner) => partner.trim().toLowerCase() === selectedFilter.trim().toLowerCase()
      )
    );
  }, [projects, selectedFilter, currentPartnerShortName, isQuextEmployee]);

  // Calculate technician readiness for a project's pre-packaged bundle
  const getProjectReadiness = (project: OperationProject) => {
    const bundle = project.partnerCourseBundle || buildProjectPrePackagedBundle(project);
    const totalCourses = bundle.courses.length || 1;
    const passedOrCompletedCourses = bundle.courses.filter((c) => {
      const score = currentUser.quizScores[c.moduleId];
      const mod = COURSE_MODULES.find((m) => m.id === c.moduleId);
      const passThreshold = mod?.quiz.passingScore || 80;
      const prog = currentUser.progress[c.moduleId] || 0;
      return (score !== undefined && score >= passThreshold) || prog >= 100;
    }).length;

    const totalChecklist = bundle.checklist.length || 1;
    const completedChecklist = bundle.checklist.filter((item) => item.completed).length;

    const readinessPercent = Math.round(
      ((passedOrCompletedCourses / totalCourses) * 0.65 +
        (completedChecklist / totalChecklist) * 0.35) *
        100
    );

    return {
      bundle,
      passedOrCompletedCourses,
      totalCourses: bundle.courses.length,
      completedChecklist,
      totalChecklist: bundle.checklist.length,
      readinessPercent,
    };
  };

  return (
    <section className="rounded-3xl bg-gradient-to-b from-[#0d1322] via-[#090d16] to-[#07090f] border border-purple-500/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute -top-24 right-12 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-12 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/90">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Pre-Packaged Project Installation Prep
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-semibold">
                Authenticated: {currentUser.email}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Your Upcoming Assigned Projects
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-3xl">
              Each assigned project automatically packages the exact <strong>Quext Partner Academy courses, interactive field guides, wiring sandboxes, checklists, and hardware cut sheets</strong> matched to that property&apos;s BOM. Click any project card below to begin preparing for your installation.
            </p>
          </div>

          {/* Partner Filter Controls */}
          {isQuextEmployee ? (
            <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-center bg-zinc-950/90 border border-zinc-800 p-1.5 rounded-2xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 flex items-center gap-1">
                <Filter className="w-3 h-3 text-purple-400" />
                Quext Oversight:
              </span>
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === 'all' || selectedFilter === 'my_partner'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                All Projects ({projects.length})
              </button>
              {allPartnerFilters.map((partner) => (
                <button
                  key={partner}
                  type="button"
                  onClick={() => setSelectedFilter(partner)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === partner
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {partner}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 self-start lg:self-center">
              <span className="px-3.5 py-1.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-2 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>
                  {currentPartnerShortName || currentCompany.name} Assigned ({filteredProjects.length})
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Project Cards Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="py-12 px-6 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center space-y-3">
            <Building2 className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Assigned Projects</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              There are currently no active installation projects assigned to{' '}
              <strong className="text-purple-300">{currentPartnerShortName || currentCompany.name}</strong>.
              Contact your Quext Implementation Project Manager for upcoming assignments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
            const {
              bundle,
              passedOrCompletedCourses,
              totalCourses,
              readinessPercent,
            } = getProjectReadiness(project);
            const partners = getProjectIntegratorPartners(project);
            const totalBomDevices = (project.bomItems || []).reduce(
              (acc, item) => acc + (item.quantity || 0),
              0
            );

            return (
              <div
                key={project.id}
                onClick={() => onSelectProjectPackage(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProjectPackage(project);
                  }
                }}
                className="group rounded-2xl bg-[#0c0f17] hover:bg-[#111624] border border-zinc-800 hover:border-purple-500/60 p-5 flex flex-col justify-between gap-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-purple-950/30"
              >
                <div className="space-y-3.5">
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {partners.map((p) => (
                        <span
                          key={p}
                          className="px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-200 text-[11px] font-mono font-bold"
                        >
                          Partner: {p}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-mono">
                        {project.isManuallyCreated ? 'Manual Project' : 'Deal Won Auto-Packaged'}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                        project.statusTag === 'On Track'
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : project.statusTag === 'Behind Schedule'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                          : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      {project.statusTag}
                    </span>
                  </div>

                  {/* Property Title & Location */}
                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {project.propertyName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        {project.city}, {project.state}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-zinc-300 font-semibold tabular-nums">
                        {project.unitsCount} Units
                      </span>
                      <span>·</span>
                      <span className="font-mono text-zinc-400 tabular-nums">
                        {totalBomDevices.toLocaleString()} Devices
                      </span>
                    </div>
                  </div>

                  {/* Schedule & Quext Contacts */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 text-[11px]">
                    <div>
                      <div className="text-zinc-500 font-mono uppercase text-[10px]">
                        Install Window
                      </div>
                      <div className="text-zinc-200 font-semibold font-mono tabular-nums mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">
                          {project.startDate} → {project.targetCompletionDate}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-zinc-500 font-mono uppercase text-[10px]">
                        Quext Field Lead
                      </div>
                      <div className="text-zinc-200 font-semibold mt-0.5 truncate">
                        {project.assignedFieldTech || 'Hector Lopez'} · PM: {project.assignedPM?.name.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  {/* Pre-Packaged Content Summary Grid */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center justify-between">
                      <span>Pre-Packaged Installation Curriculum</span>
                      <span className="text-cyan-400">{bundle.courses.length + bundle.guides.length} Modules Ready</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-purple-950/25 border border-purple-500/25">
                        <div className="text-sm font-extrabold text-white font-mono tabular-nums">
                          {bundle.courses.length}
                        </div>
                        <div className="text-[10px] text-purple-200 font-medium">
                          Cert Courses
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-cyan-950/25 border border-cyan-500/25">
                        <div className="text-sm font-extrabold text-white font-mono tabular-nums">
                          {bundle.guides.length}
                        </div>
                        <div className="text-[10px] text-cyan-200 font-medium">
                          Field Guides
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-950/25 border border-emerald-500/25">
                        <div className="text-sm font-extrabold text-white font-mono tabular-nums">
                          {bundle.checklist.length}
                        </div>
                        <div className="text-[10px] text-emerald-200 font-medium">
                          Prep Tasks
                        </div>
                      </div>
                    </div>

                    {/* Preview of packaged course badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {bundle.courses.slice(0, 4).map((c) => (
                        <span
                          key={c.moduleId}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 truncate max-w-[160px]"
                        >
                          {c.title.replace('Quext ', '').replace('Schlage ', '')}
                        </span>
                      ))}
                      {bundle.courses.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-purple-300 font-mono">
                          +{bundle.courses.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Readiness Progress + CTA */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">
                        Course Readiness ({passedOrCompletedCourses}/{totalCourses} courses complete)
                      </span>
                      <span className="font-mono font-bold text-purple-300 tabular-nums">
                        {readinessPercent}% Ready
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(readinessPercent, 8)}%` }}
                      />
                    </div>
                  </div>

                  <div className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-purple-600/90 to-indigo-600/90 group-hover:from-purple-500 group-hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-between transition-all shadow-md">
                    <span>Open Pre-Packaged Project Prep</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </section>
  );
};
