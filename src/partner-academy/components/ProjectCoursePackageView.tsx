import React, { useState, useMemo } from 'react';
import { OperationProject, getProjectIntegratorPartners, ProjectActivityNotification } from '../../types';
import { CourseModule } from '../types';
import { COURSE_MODULES } from '../data/mockData';
import { useAuth, isQuextEmployeeUser } from '../context/AuthContext';
import {
  buildProjectPrePackagedBundle,
  PrePackagedProjectCourseBundle,
  PARTNER_IDENTITY_DIRECTORY,
  isPartnerMatching,
} from '../utils/projectCoursePackager';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Cpu,
  FileText,
  Layers,
  MapPin,
  Calendar,
  ShieldCheck,
  Sparkles,
  Wrench,
  Building2,
  CheckSquare,
  Square,
  ExternalLink,
  Award,
  Play,
  Zap,
  Radio,
} from 'lucide-react';

interface ProjectCoursePackageViewProps {
  project: OperationProject;
  onBackToHomepage: () => void;
  onStartCourseModule: (module: CourseModule) => void;
  onTakeCourseQuiz: (module: CourseModule, mode: 'practice_quiz' | 'certification_exam') => void;
  onOpenGuideTab: (tabId: string) => void;
  onOpenInstallersClip?: () => void;
  onUpdateProject?: (updatedProject: OperationProject) => void;
}

export const ProjectCoursePackageView: React.FC<ProjectCoursePackageViewProps> = ({
  project,
  onBackToHomepage,
  onStartCourseModule,
  onTakeCourseQuiz,
  onOpenGuideTab,
  onOpenInstallersClip,
  onUpdateProject,
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

  const partners = getProjectIntegratorPartners(project);

  const isAssigned = useMemo(() => {
    if (isQuextEmployee) return true;
    if (!currentPartnerShortName) return true;
    return partners.some((p) =>
      isPartnerMatching(p, currentPartnerShortName)
    );
  }, [partners, isQuextEmployee, currentPartnerShortName]);

  const [activeSubView, setActiveSubView] = useState<'all' | 'courses' | 'guides' | 'checklist_bom'>('all');

  const bundle: PrePackagedProjectCourseBundle =
    project.partnerCourseBundle || buildProjectPrePackagedBundle(project);

  const totalBomDevices = (project.bomItems || []).reduce((acc, b) => acc + (b.quantity || 0), 0);

  // Calculate course completion stats
  const completedCoursesCount = bundle.courses.filter((c) => {
    const score = currentUser.quizScores[c.moduleId];
    const mod = COURSE_MODULES.find((m) => m.id === c.moduleId);
    const passScore = mod?.quiz.passingScore || 80;
    const prog = currentUser.progress[c.moduleId] || 0;
    return (score !== undefined && score >= passScore) || prog >= 100;
  }).length;

  const completedChecklistCount = bundle.checklist.filter((item) => item.completed).length;
  const overallReadiness = Math.round(
    ((completedCoursesCount / (bundle.courses.length || 1)) * 0.65 +
      (completedChecklistCount / (bundle.checklist.length || 1)) * 0.35) *
      100
  );

  // If partner is not assigned to this project and is not a Quext employee, block access
  if (!isAssigned) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={onBackToHomepage}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Projects</span>
        </button>

        <div className="p-8 sm:p-12 rounded-3xl bg-[#0e121e] border border-rose-500/40 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Partner Access Restricted
          </h2>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto">
            This installation project ({project.propertyName}) is not assigned to{' '}
            <strong className="text-white">{currentPartnerShortName || currentCompany.name}</strong>.
            Authorized partner accounts can only view and prepare pre-packaged bundles for projects assigned directly to their firm.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onBackToHomepage}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Return to Assigned Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = bundle.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updatedBundle: PrePackagedProjectCourseBundle = {
      ...bundle,
      checklist: updatedChecklist,
    };
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        partnerCourseBundle: updatedBundle,
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [simulationSuccessMsg, setSimulationSuccessMsg] = useState<string | null>(null);

  const handleSimulateFieldVerification = (type: 'gateway' | 'befe' | 'tstat') => {
    if (!onUpdateProject) return;
    setIsSimulatingSync(true);

    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const partnerName = currentPartnerShortName || partners[0] || 'SKBM';
    const actor = `${currentUser.name} (${partnerName})`;

    let title = '';
    let details = '';

    if (type === 'gateway') {
      title = `${partnerName} Gateway SOP Verified (Roof Mount & PoE)`;
      details = `${actor} verified TEKTELIC LoRaWAN Gateway indoor/outdoor bracket, RF antenna alignment, and waterproof RJ45 PoE on ${project.propertyName}.`;
    } else if (type === 'befe') {
      title = `${partnerName} Unit Locks Handing & Strike Plate Verified`;
      details = `${actor} completed Schlage BE467F / FE410F 2-turn thumbturn handing & door frame strike clearance check on ${project.propertyName}.`;
    } else {
      title = `${partnerName} HVAC 24VAC Terminal & LoRa Join Verified`;
      details = `${actor} verified thermostat C-wire power delivery and 915MHz telemetry ping for ${project.propertyName}.`;
    }

    const notif: ProjectActivityNotification = {
      id: `notif-sim-partner-${project.id}-${Date.now()}`,
      projectId: project.id,
      propertyName: project.propertyName,
      assignedPMName: project.assignedPM.name,
      assignedFieldTech: project.assignedFieldTech || 'Hector Lopez',
      timestamp: formattedTime,
      createdAtIso: now.toISOString(),
      audience: 'all',
      category: 'bom_update',
      section: 'bom',
      sectionTargetId: 'pm-bom-table',
      actorRole: 'installer_partner',
      actorName: actor,
      badgeLabel: 'Partner SOP Verified',
      title,
      details,
    };

    // Also mark matching checklist item completed if present
    let updatedBundle = bundle;
    if (updatedBundle.checklist) {
      const matchKeyword = type === 'gateway' ? 'gateway' : type === 'befe' ? 'lock' : 'tstat';
      const updatedChecklist = updatedBundle.checklist.map((item) =>
        item.id.toLowerCase().includes(matchKeyword) ? { ...item, completed: true } : item
      );
      updatedBundle = { ...updatedBundle, checklist: updatedChecklist };
    }

    const updatedProject: OperationProject = {
      ...project,
      partnerCourseBundle: updatedBundle,
      activityNotifications: [notif, ...(project.activityNotifications || [])],
      lastUpdated: 'Just now',
    };

    onUpdateProject(updatedProject);

    setTimeout(() => {
      setIsSimulatingSync(false);
      setSimulationSuccessMsg(
        `Cloud sync sent! PM ${project.assignedPM?.name || 'Raul Recalde'}'s Notifications dock at #/operations will auto-slide out in real time.`
      );
      setTimeout(() => setSimulationSuccessMsg(null), 7000);
    }, 400);
  };

  return (
    <div data-tutorial-id="project-course-package-view" className="space-y-8 pb-16 text-zinc-100">
      {/* Top Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToHomepage}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Back to Partner Academy Homepage &amp; Upcoming Projects</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-200 font-mono font-bold">
            Bundle ID: {bundle.packageId}
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 font-mono">
            {bundle.generationTrigger}
          </span>
        </div>
      </div>

      {/* Project Hero & Site Readiness Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0e1526] via-[#0a0e18] to-[#06080e] border border-purple-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Pre-Packaged Partner Installation Curriculum
                </span>
                {partners.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold"
                  >
                    Assigned Partner: {p}
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-mono">
                  Quote #{project.quoteNumber}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {project.propertyName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {project.address}, {project.city}, {project.state}
                </span>
                <span>·</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {project.unitsCount} Residential Units
                </span>
                <span>·</span>
                <span className="font-mono font-bold text-purple-300 tabular-nums">
                  {totalBomDevices.toLocaleString()} Total BOM Hardware Devices
                </span>
              </div>
            </div>

            {/* Readiness Score Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 min-w-[260px] lg:w-80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Installation Prep Readiness
                </span>
                <span className="text-lg font-extrabold font-mono text-purple-300 tabular-nums">
                  {overallReadiness}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(overallReadiness, 6)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-zinc-400">
                <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800">
                  <div className="font-mono font-bold text-white tabular-nums">
                    {completedCoursesCount} / {bundle.courses.length}
                  </div>
                  <div>Courses Passed</div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800">
                  <div className="font-mono font-bold text-white tabular-nums">
                    {completedChecklistCount} / {bundle.checklist.length}
                  </div>
                  <div>Prep Checklist</div>
                </div>
              </div>

              {/* Installers Clip Field Mode Launcher */}
              <button
                type="button"
                onClick={onOpenInstallersClip || (() => onOpenGuideTab('installers_clip'))}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm border border-sky-400/30 cursor-pointer transition-all active:scale-98"
                title="Open Installers Clip for this project"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Open in Installers Clip (Field Log)</span>
              </button>
            </div>
          </div>

          {/* Site Logistics & Quext Operations Contacts Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/80 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/90">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Target Installation Window
              </div>
              <div className="font-mono font-bold text-white mt-1 tabular-nums flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>
                  {project.startDate} → {project.targetCompletionDate}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/90">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Quext Field Tech &amp; PM
              </div>
              <div className="font-bold text-white mt-1 truncate">
                Tech: {project.assignedFieldTech || 'Hector Lopez'} · PM: {project.assignedPM?.name}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/90">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Site Staging &amp; Hours
              </div>
              <div className="font-semibold text-zinc-200 mt-1 truncate">
                {project.communityDetails?.stagingLocation || 'Clubhouse Staging Area'} ({project.communityDetails?.installWorkingHours || '9AM-5PM Mon-Fri'})
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/90">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Access &amp; PMS Config
              </div>
              <div className="font-semibold text-zinc-200 mt-1 truncate">
                PMS: {project.customerIntake?.pmsSoftware || project.communityDetails?.pmsSystem || 'Yardi'} · {project.useNfcWallet ? 'NFC Wallet Enabled' : 'Standard BLE'}
              </div>
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveSubView('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubView === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              All Pre-Packaged Content
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView('courses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubView === 'courses'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Required Certification Courses ({bundle.courses.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView('guides')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubView === 'guides'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Interactive Field Guides &amp; Simulators ({bundle.guides.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView('checklist_bom')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubView === 'checklist_bom'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Pre-Install Checklist &amp; BOM Spec Sheets ({bundle.checklist.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Pre-Packaged Certification Courses */}
      {(activeSubView === 'all' || activeSubView === 'courses') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>1. Pre-Packaged Certification Courses for {project.propertyName}</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automatically selected from the Quext Partner Training &amp; Certification Academy based on this project&apos;s hardware BOM.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-950/50 border border-purple-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
              {completedCoursesCount} of {bundle.courses.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bundle.courses.map((courseItem) => {
              const fullMod = COURSE_MODULES.find((m) => m.id === courseItem.moduleId);
              if (!fullMod) return null;

              const progress = currentUser.progress[fullMod.id] || 0;
              const quizScore = currentUser.quizScores[fullMod.id];
              const isPassed = quizScore !== undefined && quizScore >= fullMod.quiz.passingScore;

              return (
                <div
                  key={courseItem.moduleId}
                  className="rounded-2xl bg-[#0b0e17] border border-zinc-800 hover:border-purple-500/50 overflow-hidden flex flex-col justify-between transition-all shadow-lg"
                >
                  <div>
                    {/* Course Image Header */}
                    <div className="relative h-40 bg-zinc-950 overflow-hidden">
                      <img
                        src={fullMod.hardwareImage}
                        alt={fullMod.title}
                        className="w-full h-full object-cover opacity-85"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-black/40 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-xs border border-zinc-700 text-[10px] font-mono font-bold text-purple-300">
                          MODULE {fullMod.number} · {fullMod.code}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        {isPassed ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Passed ({quizScore}%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                            Required Prep
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Body */}
                    <div className="p-5 space-y-3">
                      <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-200 font-medium leading-snug">
                        <strong className="text-purple-300 font-mono uppercase text-[10px] block mb-0.5">
                          Why Packaged for This Project:
                        </strong>
                        {courseItem.matchReason}
                      </div>

                      <h3 className="text-base font-extrabold text-white leading-snug">
                        {fullMod.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {fullMod.shortDescription}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {fullMod.durationMinutes} mins
                        </span>
                        <span>·</span>
                        <span>{fullMod.lessons.length} Lessons</span>
                        <span>·</span>
                        <span>{fullMod.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Course Footer Actions */}
                  <div className="p-5 pt-0 space-y-2.5">
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                        style={{ width: `${Math.max(progress, 5)}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onStartCourseModule(fullMod)}
                        className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Course</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onTakeCourseQuiz(fullMod, 'certification_exam')}
                        className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Cert Exam</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Pre-Packaged Interactive Field Guides, Simulators & Checklists */}
      {(activeSubView === 'all' || activeSubView === 'guides') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" />
                <span>2. Pre-Packaged Field Guides, Simulators &amp; Checklists</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Interactive field installation guides, 24VAC wiring sandboxes, engineering schematics, and Brivo/Quext checklists tailored to {project.propertyName}.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
              {bundle.guides.length} Interactive Guides &amp; Labs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bundle.guides.map((guide) => (
              <div
                key={guide.tabId}
                onClick={() => onOpenGuideTab(guide.tabId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenGuideTab(guide.tabId);
                  }
                }}
                className="group rounded-2xl bg-[#0b0e17] hover:bg-[#111726] border border-zinc-800 hover:border-cyan-500/50 p-5 flex flex-col justify-between gap-4 transition-all cursor-pointer shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                        guide.category === 'Checklist'
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : guide.category === 'Wiring Simulator'
                          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                          : guide.category === 'Spec & Cut Sheets'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                          : 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                      }`}
                    >
                      {guide.category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {guide.badge} · ~{guide.estimatedMinutes}m
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {guide.subtitle}
                  </p>

                  <div className="p-2 rounded-lg bg-zinc-950/90 border border-zinc-800/90 text-[11px] text-zinc-300">
                    <span className="text-cyan-400 font-mono font-bold">Project Scope: </span>
                    {guide.matchReason}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                  <span>Launch Interactive Guide / Lab</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Pre-Installation Readiness Checklist & Project BOM Hardware */}
      {(activeSubView === 'all' || activeSubView === 'checklist_bom') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Interactive Project Pre-Install Checklist */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0b0e17] border border-zinc-800 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                  <span>3. Project Pre-Installation Readiness Checklist</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Interactive preparation steps for {partners.join(', ')} prior to arriving at {project.propertyName}.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tabular-nums">
                {completedChecklistCount}/{bundle.checklist.length} Done
              </span>
            </div>

            {/* Live Cloud Sync Simulation Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 via-zinc-950/90 to-cyan-950/30 border border-purple-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>Cloud Live Updates Simulator (Google Cloud Firestore)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                  ● Firestore Real-Time Active
                </span>
              </div>

              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Test the out-of-state field verification workflow between this partner portal and the PM Operations workspace. Triggering an action below updates Cloud Firestore and slides out the PM's Notifications dock in real time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSimulateFieldVerification('gateway')}
                  disabled={isSimulatingSync}
                  className="py-2 px-2.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Radio className="w-3 h-3 text-cyan-300" />
                  <span>Gateway SOP Signoff</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFieldVerification('befe')}
                  disabled={isSimulatingSync}
                  className="py-2 px-2.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-3 h-3 text-cyan-300" />
                  <span>BEFE Locks Handing</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFieldVerification('tstat')}
                  disabled={isSimulatingSync}
                  className="py-2 px-2.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3 h-3 text-emerald-300" />
                  <span>24VAC T-Stat Join</span>
                </button>
              </div>

              {simulationSuccessMsg && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs text-emerald-200 text-center font-medium animate-fade-in">
                  ✓ {simulationSuccessMsg}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono border-t border-zinc-800/80 pt-2">
                <ShieldCheck className="w-3 h-3 text-zinc-500 shrink-0" />
                <span>Security Boundary: Integrator partners only have access to Partner Academy. PM operations &amp; quotes remain restricted.</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {bundle.checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleChecklistItem(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    item.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-200'
                      : 'bg-zinc-950/80 hover:bg-zinc-900 border-zinc-800 text-white'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          item.completed ? 'line-through text-zinc-400' : 'text-white'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right 5 Cols: Project BOM Hardware Summary & Spec Sheet Links */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0b0e17] border border-zinc-800 p-5 sm:p-6 space-y-5">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>Assigned Project BOM Hardware</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Exact quoted hardware scope driving this pre-packaged curriculum.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenGuideTab('spec_sheets')}
                className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-colors cursor-pointer"
              >
                All Spec Sheets →
              </button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {(project.bomItems || []).map((bom) => (
                <div
                  key={bom.id}
                  className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/90 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white leading-snug">
                      {bom.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      Model: {bom.model} · {bom.category}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Location: {bom.location}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-200 font-mono font-extrabold text-xs tabular-nums block">
                      {bom.quantity.toLocaleString()} units
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Matched PDF Cut Sheets & Data Sheets Quick Access */}
            {bundle.specSheets.length > 0 && (
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Packaged Door Prep Templates &amp; Data Sheets ({bundle.specSheets.length})
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {bundle.specSheets.slice(0, 6).map((spec) => (
                    <a
                      key={spec.id}
                      href={spec.pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 hover:text-cyan-300 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate font-medium">{spec.title}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
