import React, { useState } from 'react';
import {
  OperationProject,
  ProjectStatusTag,
  ThermostatBrand,
  getCategoryUnitLabel,
  getCategoryDisplayName,
  calculateProjectScheduleHealth,
  AVAILABLE_PMS,
  AVAILABLE_FIELD_TECHS,
  TeamAssistEntry,
  normalizeFieldTech,
  getProjectIntegratorPartners,
  getAllIntegratorPartners,
} from '../types';
import { QUEUXT_HARDWARE_CATALOG } from '../data/catalogData';
import { PMPMitigationPlanPanel } from './PMPMitigationPlanPanel';
import { getEffectivePMPMitigationPlan } from '../types';
import {
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Building2,
  MapPin,
  Activity,
  Tag,
  Users,
  Filter,
  AlertTriangle,
  Search,
  MessageSquare,
  FileCheck,
  DollarSign,
  ShieldAlert,
  Lightbulb,
  Eye,
  HelpCircle,
  TrendingDown,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Zap,
  CheckCircle,
  X,
  Wrench,
  ShieldCheck,
} from 'lucide-react';

interface OverallDashboardProps {
  projects: OperationProject[];
  onSelectProjectTab: (projectId: string) => void;
  onUpdateProjectStatusTag: (projectId: string, newTag: ProjectStatusTag) => void;
  onGoToAllProjects: (filterStatus?: ProjectStatusTag) => void;
  onUpdateProject?: (updated: OperationProject) => void;
  onNavigateToKickoffAttention?: () => void;
}

export const OverallDashboard: React.FC<OverallDashboardProps> = ({
  projects,
  onSelectProjectTab,
  onUpdateProjectStatusTag,
  onGoToAllProjects,
  onUpdateProject,
  onNavigateToKickoffAttention,
}) => {
  const [selectedThermostatBrandFilter, setSelectedThermostatBrandFilter] = useState<'All' | 'Quext' | 'Honeywell'>('All');
  const [pmFilter, setPmFilter] = useState<string>('all');
  const [fieldTechFilter, setFieldTechFilter] = useState<string>('all');
  const [integratorFilter, setIntegratorFilter] = useState<string>('all');
  const [kickoffFilter, setKickoffFilter] = useState<'all' | 'needs_attention' | 'completed'>('all');
  const [tableSearch, setTableSearch] = useState<string>('');

  const allAvailableIntegrators = getAllIntegratorPartners(projects);

  const [showBehindTheVeil, setShowBehindTheVeil] = useState<boolean>(false);
  const [showMitigationPlans, setShowMitigationPlans] = useState<boolean>(false);
  const [showFinancialBreakdown, setShowFinancialBreakdown] = useState<boolean>(true);
  const [upcomingCardMode, setUpcomingCardMode] = useState<'go_lives' | 'installs'>('go_lives');
  const [upcomingDisplayView, setUpcomingDisplayView] = useState<'timeline' | 'cards'>('timeline');
  const [upcomingHorizonFilter, setUpcomingHorizonFilter] = useState<
    'all' | 'next_7' | 'days_8_14' | 'days_15_30' | 'days_30_plus'
  >('all');
  const [showAllUpcomingTimeline, setShowAllUpcomingTimeline] = useState<boolean>(false);
  const [showRolloutSequence, setShowRolloutSequence] = useState<boolean>(false);
  const [hoveredTimelineProjectId, setHoveredTimelineProjectId] = useState<string | null>(null);
  const [activeSpotlightSelection, setActiveSpotlightSelection] = useState<
    | { type: 'wave'; dateStr: string }
    | { type: 'zone'; bucket: 'next_7' | 'days_8_14' | 'days_15_30' | 'days_30_plus'; label: string }
    | null
  >(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [acknowledgedRoadblocks, setAcknowledgedRoadblocks] = useState<Record<string, boolean>>({});
  const [activeRoadblockCategory, setActiveRoadblockCategory] = useState<'all' | 'municipal' | 'supply_chain' | 'internal_assist'>('all');
  const [financialSortBy, setFinancialSortBy] = useState<'profit' | 'revenue' | 'margin' | 'collection'>('profit');
  const [isFinancialProjectsMinimized, setIsFinancialProjectsMinimized] = useState<boolean>(true);

  // Pop-up modal state for "Assistance Provided"
  const [assistModalProject, setAssistModalProject] = useState<OperationProject | null>(null);
  const [assistDate, setAssistDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [assistDetails, setAssistDetails] = useState<string>('');

  // PMP Mitigation Plan Hub & Modal state
  const [selectedPmpHubProjectId, setSelectedPmpHubProjectId] = useState<string>('all');
  const [pmpModalProjectId, setPmpModalProjectId] = useState<string | null>(null);

  // Requirement: "Provide a metric for customers that have not completed their kickoff walkthroughs or are missing information on their form submissions so that project managers can keep traffic and are able to follow up with the nonresponsive customers."
  const projectsNeedingKickoffAttention = projects.filter((p) => {
    const intake = p.customerIntake;
    const isMissingPms = !intake?.pmsSoftware || intake.pmsSoftware === 'None';
    const isMissingDoors = !intake?.commonAreaDoors || intake.commonAreaDoors.length === 0;
    const isMissingStaff = !intake?.staffRoles || intake.staffRoles.length === 0;
    const notSubmitted = !intake?.walkthroughCompleted;
    return notSubmitted || isMissingPms || isMissingDoors || isMissingStaff;
  });

  const totalProjects = projects.length;

  // Filter projects by PM, Field Tech, Integrator Partner, and Kickoff status for table
  const filteredProjects = projects.filter((project) => {
    const matchesPM = pmFilter === 'all' || project.assignedPM.name === pmFilter;
    const matchesFieldTech = fieldTechFilter === 'all' || (project.assignedFieldTech || 'Hector') === fieldTechFilter;
    const partners = getProjectIntegratorPartners(project);
    const matchesIntegrator = integratorFilter === 'all' || partners.includes(integratorFilter);
    const isAttention = projectsNeedingKickoffAttention.some((p) => p.id === project.id);
    const matchesKickoff =
      kickoffFilter === 'all' ||
      (kickoffFilter === 'needs_attention' && isAttention) ||
      (kickoffFilter === 'completed' && !isAttention);
    const matchesSearch =
      project.propertyName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      project.clientName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      project.city.toLowerCase().includes(tableSearch.toLowerCase()) ||
      project.quoteNumber.toLowerCase().includes(tableSearch.toLowerCase()) ||
      partners.some((p) => p.toLowerCase().includes(tableSearch.toLowerCase()));
    return matchesPM && matchesFieldTech && matchesIntegrator && matchesKickoff && matchesSearch;
  });

  const onTrackProjects = projects.filter(
    (p) => calculateProjectScheduleHealth(p.targetCompletionDate, p.statusTag, p.notes, p.milestones).effectiveTag === 'On Track'
  );
  const behindScheduleProjects = projects.filter(
    (p) => calculateProjectScheduleHealth(p.targetCompletionDate, p.statusTag, p.notes, p.milestones).effectiveTag === 'Behind Schedule'
  );
  const highRiskProjects = projects.filter(
    (p) => calculateProjectScheduleHealth(p.targetCompletionDate, p.statusTag, p.notes, p.milestones).effectiveTag === 'High Risk'
  );

  const totalQuotedUnits = projects.reduce(
    (acc, p) => acc + p.bomItems.reduce((bAcc, item) => bAcc + item.quantity, 0),
    0
  );
  const totalInstalledUnits = projects.reduce(
    (acc, p) => acc + p.bomItems.reduce((bAcc, item) => bAcc + item.installedCount, 0),
    0
  );
  const aggregatePct = totalQuotedUnits > 0 ? Math.round((totalInstalledUnits / totalQuotedUnits) * 100) : 0;
  const totalResidentialUnits = projects.reduce((acc, p) => acc + p.unitsCount, 0);

  // Upcoming Go Lives: Defined by the date the project will be handed off to CSM ('CSM Handoff' milestone targetDate)
  const upcomingGoLives = projects
    .map((project) => {
      const csmMilestone = project.milestones?.find((m) =>
        m.title.toLowerCase().includes('csm handoff')
      );
      const goLiveDate = csmMilestone?.targetDate || project.targetCompletionDate;
      const status = csmMilestone?.status || 'Upcoming';
      const csmName = project.assignedCSM || project.communityDetails?.csmName || 'Nicole Franklin';
      const parsedTime = new Date(`${goLiveDate}T00:00:00`).getTime();
      return {
        project,
        csmMilestone,
        goLiveDate,
        status,
        csmName,
        parsedTime: Number.isNaN(parsedTime) ? Number.MAX_SAFE_INTEGER : parsedTime,
      };
    })
    .filter((item) => item.status !== 'Completed')
    .sort((a, b) => a.parsedTime - b.parsedTime);

  // Upcoming Installs: Defined by the date reflected in the 'Implementation' milestone
  const upcomingInstalls = projects
    .map((project) => {
      const implMilestone = project.milestones?.find(
        (m) =>
          m.title === 'Implementation' ||
          (m.title.toLowerCase().includes('implementation') &&
            !m.title.toLowerCase().includes('pre-implementation'))
      );
      const installDate =
        implMilestone?.targetDate ||
        (project as any).installationStartDate ||
        project.targetCompletionDate;
      const status = implMilestone?.status || 'Upcoming';
      const fieldTech = normalizeFieldTech(project.assignedFieldTech);
      const parsedTime = new Date(`${installDate}T00:00:00`).getTime();
      return {
        project,
        implMilestone,
        installDate,
        status,
        fieldTech,
        parsedTime: Number.isNaN(parsedTime) ? Number.MAX_SAFE_INTEGER : parsedTime,
      };
    })
    .filter((item) => item.status !== 'Completed')
    .sort((a, b) => a.parsedTime - b.parsedTime);

  const formatGoLiveDate = (dateStr: string) => {
    const d = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Requirement: Leadership Financial & Cost Breakdown
  // "Let's provide a cost breakdown on the installation Overview Dashboard as well so that leadership can see on, a high-level, the overall profits of the total projects, as well as how on track we are to collect that money."
  const projectFinancials = projects.map((project) => {
    const health = calculateProjectScheduleHealth(
      project.targetCompletionDate,
      project.statusTag,
      project.notes,
      project.milestones
    );

    // Hardware quoted revenue
    const quotedHardwareRevenue = project.bomItems.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
      0
    );

    // Wholesale equipment costs lookup against Quext Hardware Catalog
    const estimatedHardwareCost = project.bomItems.reduce((sum, item) => {
      const match = QUEUXT_HARDWARE_CATALOG.find(
        (c) => c.sku.toLowerCase() === (item.model || '').toLowerCase() || c.name.toLowerCase() === (item.name || '').toLowerCase()
      );
      const unitCost = match ? match.unitCost : Math.round((item.unitPrice || 0) * 0.62);
      return sum + (item.quantity || 0) * (unitCost || 0);
    }, 0);

    // Quoted installation fee ($175 per residential unit or proportional)
    const quotedInstallRevenue = Math.round((project.unitsCount || 0) * 175);
    const estimatedInstallCost = Math.round(quotedInstallRevenue * 0.65); // 65% labor & low-voltage subcontractor costs

    const totalQuotedRevenue = quotedHardwareRevenue + quotedInstallRevenue;
    const totalEstimatedCost = estimatedHardwareCost + estimatedInstallCost;
    const grossProfit = totalQuotedRevenue - totalEstimatedCost;
    const grossMarginPct = totalQuotedRevenue > 0 ? Math.round((grossProfit / totalQuotedRevenue) * 100) : 0;

    // Milestone cash collection tracking (50% Collected + 30% Collected + Final 20% Collected, or milestone fallback)
    const fm = project.financialMilestones;
    const hasExplicitFinancialCheckoffs = Boolean(
      fm &&
        (fm.fiftyPercentCollected ||
          fm.twentyPercentCollected ||
          fm.thirtyPercentCollected ||
          fm.finalTwentyPercentCollected)
    );

    let billedPercentage = 0;
    if (hasExplicitFinancialCheckoffs && fm) {
      if (fm.fiftyPercentCollected ?? fm.twentyPercentCollected) billedPercentage += 50;
      if (fm.thirtyPercentCollected) billedPercentage += 30;
      if (fm.finalTwentyPercentCollected) billedPercentage += 20;
    } else if (project.milestones && project.milestones.length > 0) {
      const completedCount = project.milestones.filter((m) => m.status === 'Completed').length;
      if (completedCount >= 7) billedPercentage = 100;
      else if (completedCount >= 6) billedPercentage = 85;
      else if (completedCount >= 5) billedPercentage = 80;
      else if (completedCount >= 3) billedPercentage = 50;
      else if (completedCount >= 2) billedPercentage = 50;
      else if (completedCount >= 1) billedPercentage = 50;
      else billedPercentage = 0;
    } else {
      const qTotal = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
      const iTotal = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
      const pct = qTotal > 0 ? iTotal / qTotal : 0;
      billedPercentage = Math.min(100, Math.round(50 + pct * 50));
    }

    const cashCollected = Math.round((totalQuotedRevenue * billedPercentage) / 100);
    const unbilledAmount = totalQuotedRevenue - cashCollected;
    const isAtRisk = health.effectiveTag === 'High Risk' || health.effectiveTag === 'Behind Schedule';

    return {
      project,
      health,
      quotedHardwareRevenue,
      quotedInstallRevenue,
      totalQuotedRevenue,
      estimatedHardwareCost,
      estimatedInstallCost,
      totalEstimatedCost,
      grossProfit,
      grossMarginPct,
      billedPercentage,
      cashCollected,
      unbilledAmount,
      isAtRisk,
    };
  });

  const totalPortfolioRevenue = projectFinancials.reduce((sum, f) => sum + f.totalQuotedRevenue, 0);
  const totalPortfolioCost = projectFinancials.reduce((sum, f) => sum + f.totalEstimatedCost, 0);
  const totalPortfolioProfit = totalPortfolioRevenue - totalPortfolioCost;
  const portfolioBlendedMargin = totalPortfolioRevenue > 0 ? Math.round((totalPortfolioProfit / totalPortfolioRevenue) * 100) : 0;

  const totalCashCollected = projectFinancials.reduce((sum, f) => sum + f.cashCollected, 0);
  const totalCashOnTrack = projectFinancials.filter((f) => !f.isAtRisk).reduce((sum, f) => sum + f.unbilledAmount, 0);
  const totalCashAtRisk = projectFinancials.filter((f) => f.isAtRisk).reduce((sum, f) => sum + f.unbilledAmount, 0);
  const portfolioCollectionPct = totalPortfolioRevenue > 0 ? Math.round((totalCashCollected / totalPortfolioRevenue) * 100) : 0;

  // Aggregate Roadblocks for "Behind the Veil"
  const atRiskAndBehindProjects = projects.filter((p) => {
    const h = calculateProjectScheduleHealth(p.targetCompletionDate, p.statusTag, p.notes, p.milestones);
    return h.effectiveTag === 'Behind Schedule' || h.effectiveTag === 'High Risk';
  });

  const toggleAcknowledgeRoadblock = (projectId: string) => {
    setAcknowledgedRoadblocks((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  // Group by category with selectable Quext / Honeywell thermostat counts
  const categoryMap = new Map<string, { quoted: number; installed: number; quextStats: number; honeywellStats: number }>();

  projects.forEach((p) => {
    p.bomItems.forEach((item) => {
      const displayName = getCategoryDisplayName(item.category);
      const existing = categoryMap.get(displayName) || { quoted: 0, installed: 0, quextStats: 0, honeywellStats: 0 };

      const isHoneywell = item.thermostatBrand === 'Honeywell' || item.name.toLowerCase().includes('honeywell');
      const isQuext = item.thermostatBrand === 'Quext' || !isHoneywell;

      categoryMap.set(displayName, {
        quoted: existing.quoted + item.quantity,
        installed: existing.installed + item.installedCount,
        quextStats: existing.quextStats + (isQuext ? item.installedCount : 0),
        honeywellStats: existing.honeywellStats + (isHoneywell ? item.installedCount : 0),
      });
    });
  });

  const categories = Array.from(categoryMap.entries()).map(([cat, stats]) => ({
    name: cat,
    unitLabel: getCategoryUnitLabel(cat),
    quoted: stats.quoted,
    installed: stats.installed,
    quextStats: stats.quextStats,
    honeywellStats: stats.honeywellStats,
    pct: stats.quoted > 0 ? Math.round((stats.installed / stats.quoted) * 100) : 0,
  }));

  const allLogs = projects
    .flatMap((p) =>
      p.installLogs.map((log) => ({
        ...log,
        propertyName: p.propertyName,
      }))
    )
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 5);

  const getStatusBadgeStyle = (tag: ProjectStatusTag) => {
    switch (tag) {
      case 'On Track':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'Behind Schedule':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'High Risk':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
    }
  };

  const handleTagClick = (tag: ProjectStatusTag, list: OperationProject[]) => {
    if (list.length === 1 && list[0]) {
      onSelectProjectTab(list[0].id);
    } else {
      onGoToAllProjects(tag);
    }
  };

  const handleSaveAssistance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistModalProject || !assistDetails.trim()) return;

    const newAssist: TeamAssistEntry = {
      id: `assist-${Date.now()}`,
      date: assistDate,
      loggedBy: 'Megan Rossman (Director of Operations)',
      assistanceDetails: assistDetails.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedProject: OperationProject = {
      ...assistModalProject,
      teamAssists: [newAssist, ...(assistModalProject.teamAssists || [])],
      lastUpdated: new Date().toISOString(),
    };

    if (onUpdateProject) {
      onUpdateProject(updatedProject);
    }
    setAcknowledgedRoadblocks((prev) => ({ ...prev, [assistModalProject.id]: true }));
    setAssistModalProject(null);
    setAssistDetails('');
  };

  return (
    <div className="space-y-6">
      {/* High-Level Executive Banner (Renamed 'Won' to 'Active') */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
                All Projects Overview
              </span>
              <span className="text-xs text-slate-500">· All Active Deployments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
              Projects Installation Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Consolidated operational overview tracking field execution for all active implementation projects. Project managers can monitor completion across hardware categories, adjust health tags, and follow up with non-responsive customer kickoffs.
            </p>
          </div>

          <button
            onClick={() => onGoToAllProjects()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-all shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>View All Active Projects Directory</span>
          </button>
        </div>

        {/* 6-KPI Metric Strip (Including Kickoff Intake Attention & Upcoming Go Lives) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 mt-6 pt-5 border-t border-slate-200">
          {/* Active Projects */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="text-xs text-slate-600 font-medium flex items-center justify-between gap-2">
              <span className="truncate">Active Implementation Projects</span>
              <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
              {totalProjects}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Spanning <span className="text-slate-800 font-bold font-mono">{totalResidentialUnits}</span> residential units
            </div>
          </div>

          {/* BOM Total Units Installed */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="text-xs text-slate-600 font-medium flex items-center justify-between gap-2">
              <span className="truncate">Total Hardware Installed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <div className="text-2xl font-extrabold text-sky-700 font-mono mt-1 tabular-nums">
              {totalInstalledUnits.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">
                / {totalQuotedUnits.toLocaleString()}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              <strong className="text-slate-900 font-mono">{aggregatePct}%</strong> of all quoted BOM hardware
            </div>
          </div>

          {/* Upcoming Go Lives / Upcoming Installs KPI Card */}
          <div
            onClick={() =>
              setUpcomingCardMode((prev) => (prev === 'go_lives' ? 'installs' : 'go_lives'))
            }
            className="p-4 bg-sky-50/70 hover:bg-sky-100/70 rounded-xl border border-sky-200 cursor-pointer transition-all overflow-hidden"
            title="Click to toggle between Upcoming Go Lives (CSM Handoff) and Upcoming Installs (Implementation)"
          >
            <div className="text-xs text-sky-900 font-bold flex items-center justify-between gap-2">
              <span className="truncate">{upcomingCardMode === 'go_lives' ? 'Upcoming Go Lives' : 'Upcoming Installs'}</span>
              {upcomingCardMode === 'go_lives' ? (
                <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
              ) : (
                <Wrench className="w-4 h-4 text-sky-600 shrink-0" />
              )}
            </div>
            <div className="text-2xl font-extrabold text-sky-950 font-mono mt-1 tabular-nums flex items-baseline gap-1.5">
              <span>
                {upcomingCardMode === 'go_lives'
                  ? upcomingGoLives.length
                  : upcomingInstalls.length}
              </span>
              <span className="text-xs font-normal text-sky-700 truncate">
                {upcomingCardMode === 'go_lives' ? 'CSM handoffs' : 'Implementation'}
              </span>
            </div>
            <div className="text-[11px] text-sky-900/80 mt-0.5 flex items-center justify-between gap-1">
              <span className="truncate">
                {upcomingCardMode === 'go_lives' ? (
                  upcomingGoLives.length > 0 ? (
                    <>
                      Next:{' '}
                      <strong className="font-mono text-sky-950">
                        {formatGoLiveDate(upcomingGoLives[0].goLiveDate)}
                      </strong>
                    </>
                  ) : (
                    'All CSM handoffs complete'
                  )
                ) : upcomingInstalls.length > 0 ? (
                  <>
                    Next:{' '}
                    <strong className="font-mono text-sky-950">
                      {formatGoLiveDate(upcomingInstalls[0].installDate)}
                    </strong>
                  </>
                ) : (
                  'All installations complete'
                )}
              </span>
              <span className="text-[10px] font-bold underline text-sky-800 shrink-0">
                Switch
              </span>
            </div>
          </div>

          {/* Requirement: Metric for customers that have not completed their kickoff walkthroughs or are missing information */}
          <div
            onClick={() => {
              if (onNavigateToKickoffAttention) {
                onNavigateToKickoffAttention();
              } else {
                setKickoffFilter(kickoffFilter === 'needs_attention' ? 'all' : 'needs_attention');
              }
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all overflow-hidden ${
              projectsNeedingKickoffAttention.length > 0
                ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100 shadow-2xs'
                : 'bg-slate-50 border-slate-200'
            }`}
            title="Click to view all projects needing kickoff attention"
          >
            <div className="text-xs text-amber-900 font-bold flex items-center justify-between gap-2">
              <span className="truncate">Kickoff Intake Attention</span>
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
            <div className="text-2xl font-extrabold text-amber-950 font-mono mt-1 tabular-nums flex items-baseline gap-1.5">
              <span>{projectsNeedingKickoffAttention.length}</span>
              <span className="text-xs font-normal text-amber-800 truncate">/ {totalProjects} pending</span>
            </div>
            <div className="text-[11px] text-amber-900/80 mt-0.5 flex items-center justify-between gap-1">
              <span className="truncate">Missing intake or response</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onNavigateToKickoffAttention) {
                    onNavigateToKickoffAttention();
                  } else {
                    setKickoffFilter('needs_attention');
                  }
                }}
                className="font-bold underline text-[10px] text-amber-900 hover:text-amber-950 cursor-pointer shrink-0"
              >
                Filter List
              </button>
            </div>
          </div>

          {/* Projects Health Status (Dynamic Date-Calculated Tags) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-600 font-medium flex items-center justify-between gap-2">
                <span className="font-bold text-slate-800 truncate">Projects Health Status</span>
                <Activity className="w-4 h-4 text-sky-600 shrink-0" />
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => handleTagClick('On Track', onTrackProjects)}
                  className="px-1.5 py-1 text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 rounded transition-colors cursor-pointer text-center truncate min-w-0"
                  title={`${onTrackProjects.length} On Track projects`}
                >
                  {onTrackProjects.length} Track
                </button>

                <button
                  type="button"
                  onClick={() => handleTagClick('Behind Schedule', behindScheduleProjects)}
                  className="px-1.5 py-1 text-[11px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 rounded transition-colors cursor-pointer text-center truncate min-w-0"
                  title={`${behindScheduleProjects.length} Behind Schedule projects`}
                >
                  {behindScheduleProjects.length} Behind
                </button>

                <button
                  type="button"
                  onClick={() => handleTagClick('High Risk', highRiskProjects)}
                  className="px-1.5 py-1 text-[11px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 rounded transition-colors cursor-pointer text-center truncate min-w-0"
                  title={`${highRiskProjects.length} High Risk projects`}
                >
                  {highRiskProjects.length} Risk
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 flex flex-wrap items-center justify-between gap-1.5">
              <span className="truncate">Auto-synced with dates</span>
              {atRiskAndBehindProjects.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowBehindTheVeil(!showBehindTheVeil)}
                    className={`px-2 py-0.5 rounded font-bold inline-flex items-center gap-1 transition-all cursor-pointer border shrink-0 ${
                      showBehindTheVeil
                        ? 'bg-amber-200 text-amber-950 border-amber-400 shadow-2xs'
                        : 'bg-amber-100/80 text-amber-900 border-amber-300 hover:bg-amber-200'
                    }`}
                    title={showBehindTheVeil ? 'Minimize Behind the Veil intelligence node' : 'Reveal Behind the Veil intelligence node'}
                  >
                    <span>Behind the Veil</span>
                    <Eye className="w-3 h-3 text-amber-700 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMitigationPlans(!showMitigationPlans)}
                    className={`px-2 py-0.5 rounded font-bold inline-flex items-center gap-1 transition-all cursor-pointer border shrink-0 ${
                      showMitigationPlans
                        ? 'bg-indigo-200 text-indigo-950 border-indigo-400 shadow-2xs'
                        : 'bg-indigo-100/80 text-indigo-900 border-indigo-300 hover:bg-indigo-200'
                    }`}
                    title={showMitigationPlans ? 'Minimize PM Mitigation Plans summary' : 'Open summary of Mitigation Plans in process by PMs'}
                  >
                    <span>Mitigation Plans</span>
                    <ShieldAlert className="w-3 h-3 text-indigo-700 shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Average Completion Gauge */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-600 font-medium flex items-center justify-between">
              <span>Deployment Completion</span>
              <TrendingUp className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
              {aggregatePct}%
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                style={{ width: `${aggregatePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Small Overview Card: Toggleable between Upcoming Go Lives (CSM Handoff) & Upcoming Installs (Implementation) + Executive Timeline vs Project Cards */}
        <div className="mt-4 pt-4 border-t border-slate-200/80">
          <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-100 text-sky-700 rounded-lg border border-sky-200">
                  {upcomingCardMode === 'go_lives' ? (
                    <Calendar className="w-4 h-4" />
                  ) : (
                    <Wrench className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                      {upcomingCardMode === 'go_lives'
                        ? 'Upcoming Go Lives'
                        : 'Upcoming Installs'}
                    </h2>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200 rounded">
                      {upcomingCardMode === 'go_lives'
                        ? `${upcomingGoLives.length} Scheduled`
                        : `${upcomingInstalls.length} Approaching`}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 rounded">
                      Executive Cadence View
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {upcomingCardMode === 'go_lives' ? (
                      <>
                        Go-Live date is defined by the scheduled <strong>CSM Handoff</strong> milestone date for each deployment.
                      </>
                    ) : (
                      <>
                        Projects approaching installation based on the target date reflected in the <strong>Implementation</strong> milestone.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Controls: (1) Timeline View vs Project Cards toggle + (2) Upcoming Go Lives vs Upcoming Installs toggle */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                {/* Layout Toggle: Executive Timeline vs Project Cards */}
                <div className="inline-flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setUpcomingDisplayView('timeline')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      upcomingDisplayView === 'timeline'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    title="High-level executive timeline showing when projects are coming and how soon"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Timeline View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpcomingDisplayView('cards')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      upcomingDisplayView === 'cards'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    title="Grid of individual project cards"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Project Cards</span>
                  </button>
                </div>

                {/* Data Mode Toggle: Upcoming Go Lives vs Upcoming Installs */}
                <div className="inline-flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setUpcomingCardMode('go_lives')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      upcomingCardMode === 'go_lives'
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Upcoming Go Lives</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        upcomingCardMode === 'go_lives'
                          ? 'bg-sky-700 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {upcomingGoLives.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpcomingCardMode('installs')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      upcomingCardMode === 'installs'
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Upcoming Installs</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        upcomingCardMode === 'installs'
                          ? 'bg-sky-700 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {upcomingInstalls.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {(() => {
              // Unified items for either Upcoming Go Lives or Upcoming Installs
              const rawItems =
                upcomingCardMode === 'go_lives'
                  ? upcomingGoLives.map((item) => ({
                      project: item.project,
                      targetDate: item.goLiveDate,
                      status: item.status,
                      ownerLabel: 'CSM',
                      ownerName: item.csmName,
                      secondaryLabel: 'PM',
                      secondaryName: item.project.assignedPM?.name || 'Raul Recalde',
                      parsedTime: item.parsedTime,
                    }))
                  : upcomingInstalls.map((item) => ({
                      project: item.project,
                      targetDate: item.installDate,
                      status: item.status,
                      ownerLabel: 'Field Tech',
                      ownerName: item.fieldTech,
                      secondaryLabel: 'Partner',
                      secondaryName: getProjectIntegratorPartners(item.project)[0] || 'SKBM',
                      parsedTime: item.parsedTime,
                    }));

              if (rawItems.length === 0) {
                return (
                  <div className="text-xs text-slate-500 py-3 text-center bg-white rounded-lg border border-slate-200">
                    {upcomingCardMode === 'go_lives'
                      ? 'All active projects have completed their CSM Handoff Go-Live milestone.'
                      : 'All active projects have completed their Implementation milestone.'}
                  </div>
                );
              }

              // If Project Cards view is selected, render the card grid
              if (upcomingDisplayView === 'cards') {
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
                    {rawItems.map(({ project, targetDate, status, ownerLabel, ownerName }, idx) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => onSelectProjectTab(project.id)}
                        className={`text-left p-3 rounded-lg border transition-all cursor-pointer group flex flex-col justify-between ${
                          idx === 0
                            ? 'bg-white border-sky-300 shadow-2xs hover:border-sky-500'
                            : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-2xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded border ${
                                idx === 0
                                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                                  : status === 'In Progress'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {idx === 0
                                ? upcomingCardMode === 'go_lives'
                                  ? 'Next Go Live'
                                  : 'Next Install'
                                : status}
                            </span>
                            <span className="text-[11px] font-mono font-extrabold text-sky-700">
                              {formatGoLiveDate(targetDate)}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate mt-1">
                            {project.propertyName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {project.city}, {project.state} · {project.unitsCount} units
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                          <span className="truncate">
                            {ownerLabel === 'Field Tech' ? 'Tech' : ownerLabel}:{' '}
                            <strong className="text-slate-800">{ownerName}</strong>
                          </span>
                          <span className="text-sky-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 shrink-0">
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              }

              // =========================================================================
              // EXECUTIVE HIGH-LEVEL TIMELINE VIEW (When Projects Are Coming & How Soon)
              // =========================================================================
              // Anchor "Today" so relative days-until countdowns are always accurate and meaningful
              const nowMs = new Date('2026-10-25T00:00:00').getTime();
              const dayMs = 1000 * 60 * 60 * 24;

              const enrichedTimelineItems = rawItems.map((item, idx) => {
                const rawDays = Math.round((item.parsedTime - nowMs) / dayMs);
                const daysUntil = Math.max(1, rawDays);
                const quotedTotal = item.project.bomItems.reduce((s, b) => s + b.quantity, 0);
                const installedTotal = item.project.bomItems.reduce(
                  (s, b) => s + b.installedCount,
                  0
                );
                const installPct =
                  quotedTotal > 0 ? Math.min(100, Math.round((installedTotal / quotedTotal) * 100)) : 0;
                const scheduleHealth = calculateProjectScheduleHealth(
                  item.project.targetCompletionDate,
                  item.project.statusTag,
                  item.project.notes,
                  item.project.milestones
                );
                const horizonBucket: 'next_7' | 'days_8_14' | 'days_15_30' | 'days_30_plus' =
                  daysUntil <= 7
                    ? 'next_7'
                    : daysUntil <= 14
                    ? 'days_8_14'
                    : daysUntil <= 30
                    ? 'days_15_30'
                    : 'days_30_plus';

                return {
                  ...item,
                  rank: idx + 1,
                  daysUntil,
                  installPct,
                  effectiveHealth: scheduleHealth.effectiveTag,
                  horizonBucket,
                };
              });

              const maxDaysSpan = Math.max(
                35,
                ...enrichedTimelineItems.map((i) => i.daysUntil)
              );

              // Group counts by horizon bucket for the Executive Cadence Summary Strip
              const bucketStats = {
                all: {
                  count: enrichedTimelineItems.length,
                  units: enrichedTimelineItems.reduce((s, i) => s + i.project.unitsCount, 0),
                },
                next_7: {
                  count: enrichedTimelineItems.filter((i) => i.horizonBucket === 'next_7').length,
                  units: enrichedTimelineItems
                    .filter((i) => i.horizonBucket === 'next_7')
                    .reduce((s, i) => s + i.project.unitsCount, 0),
                },
                days_8_14: {
                  count: enrichedTimelineItems.filter((i) => i.horizonBucket === 'days_8_14').length,
                  units: enrichedTimelineItems
                    .filter((i) => i.horizonBucket === 'days_8_14')
                    .reduce((s, i) => s + i.project.unitsCount, 0),
                },
                days_15_30: {
                  count: enrichedTimelineItems.filter((i) => i.horizonBucket === 'days_15_30').length,
                  units: enrichedTimelineItems
                    .filter((i) => i.horizonBucket === 'days_15_30')
                    .reduce((s, i) => s + i.project.unitsCount, 0),
                },
                days_30_plus: {
                  count: enrichedTimelineItems.filter((i) => i.horizonBucket === 'days_30_plus')
                    .length,
                  units: enrichedTimelineItems
                    .filter((i) => i.horizonBucket === 'days_30_plus')
                    .reduce((s, i) => s + i.project.unitsCount, 0),
                },
              };

              const filteredTimelineItems =
                upcomingHorizonFilter === 'all'
                  ? enrichedTimelineItems
                  : enrichedTimelineItems.filter((i) => i.horizonBucket === upcomingHorizonFilter);

              // Group distinct dates for the top Visual Horizon Track so overlapping dates show a clear wave marker
              const dateWaveMap = new Map<
                string,
                {
                  dateStr: string;
                  daysUntil: number;
                  items: typeof enrichedTimelineItems;
                  totalUnits: number;
                }
              >();
              filteredTimelineItems.forEach((item) => {
                const existing = dateWaveMap.get(item.targetDate);
                if (existing) {
                  existing.items.push(item);
                  existing.totalUnits += item.project.unitsCount;
                } else {
                  dateWaveMap.set(item.targetDate, {
                    dateStr: item.targetDate,
                    daysUntil: item.daysUntil,
                    items: [item],
                    totalUnits: item.project.unitsCount,
                  });
                }
              });
              const dateWaves = Array.from(dateWaveMap.values());

              const displayedRows = showAllUpcomingTimeline
                ? filteredTimelineItems
                : filteredTimelineItems.slice(0, 10);

              // Determine the active group of projects shown in the Spotlight Bar:
              // - If user hovered/clicked a specific Date Wave node, show all projects on that date wave
              // - If user hovered/clicked one of the 4 Horizon Zone headers (+7 Days, +8 to +14 Days, +15 to +28 Days, +29 Days & Beyond), show all projects in that zone
              // - Otherwise default to the first Date Wave (or the wave containing hoveredTimelineProjectId)
              let activeSpotlightGroup: typeof enrichedTimelineItems = [];
              let activeSpotlightGroupLabel = '';

              if (activeSpotlightSelection?.type === 'wave') {
                const wave = dateWaves.find((w) => w.dateStr === activeSpotlightSelection.dateStr);
                if (wave && wave.items.length > 0) {
                  activeSpotlightGroup = wave.items;
                  activeSpotlightGroupLabel = `${formatGoLiveDate(wave.dateStr)} Wave (+${wave.daysUntil}d)`;
                }
              } else if (activeSpotlightSelection?.type === 'zone') {
                const zoneItems = enrichedTimelineItems.filter(
                  (i) => i.horizonBucket === activeSpotlightSelection.bucket
                );
                if (zoneItems.length > 0) {
                  activeSpotlightGroup = zoneItems;
                  activeSpotlightGroupLabel = activeSpotlightSelection.label;
                }
              }

              if (activeSpotlightGroup.length === 0) {
                const fallbackWave =
                  dateWaves.find((w) =>
                    w.items.some((i) => i.project.id === hoveredTimelineProjectId)
                  ) || dateWaves[0];
                if (fallbackWave) {
                  activeSpotlightGroup = fallbackWave.items;
                  activeSpotlightGroupLabel = `${formatGoLiveDate(fallbackWave.dateStr)} Wave (+${fallbackWave.daysUntil}d)`;
                } else if (filteredTimelineItems.length > 0) {
                  activeSpotlightGroup = [filteredTimelineItems[0]];
                  activeSpotlightGroupLabel = formatGoLiveDate(filteredTimelineItems[0].targetDate);
                }
              }

              const safeSpotlightIdx =
                activeSpotlightGroup.length > 0
                  ? ((spotlightIndex % activeSpotlightGroup.length) + activeSpotlightGroup.length) %
                    activeSpotlightGroup.length
                  : 0;
              const activeHoveredItem =
                activeSpotlightGroup[safeSpotlightIdx] ||
                filteredTimelineItems[0] ||
                enrichedTimelineItems[0];

              const selectWaveInSpotlight = (dateStr: string) => {
                if (
                  activeSpotlightSelection?.type !== 'wave' ||
                  activeSpotlightSelection.dateStr !== dateStr
                ) {
                  setActiveSpotlightSelection({ type: 'wave', dateStr });
                  setSpotlightIndex(0);
                }
              };

              const selectZoneInSpotlight = (
                bucket: 'next_7' | 'days_8_14' | 'days_15_30' | 'days_30_plus',
                label: string
              ) => {
                if (
                  activeSpotlightSelection?.type !== 'zone' ||
                  activeSpotlightSelection.bucket !== bucket
                ) {
                  setActiveSpotlightSelection({ type: 'zone', bucket, label });
                  setSpotlightIndex(0);
                }
              };

              return (
                <div className="space-y-3.5">
                  {/* 1. Executive Horizon Filter Strip (How Soon Are Projects Coming?) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUpcomingHorizonFilter('all');
                        setActiveSpotlightSelection(null);
                        setSpotlightIndex(0);
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        upcomingHorizonFilter === 'all'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-80">
                        <span>All Upcoming</span>
                        <span className="font-mono">{bucketStats.all.count}</span>
                      </div>
                      <div className="text-base font-extrabold font-mono mt-0.5 tabular-nums">
                        {bucketStats.all.count} Projects
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        {bucketStats.all.units.toLocaleString()} total units
                      </div>
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() =>
                        selectZoneInSpotlight('next_7', 'TODAY → +7 DAYS (This Week)')
                      }
                      onClick={() => {
                        setUpcomingHorizonFilter(
                          upcomingHorizonFilter === 'next_7' ? 'all' : 'next_7'
                        );
                        selectZoneInSpotlight('next_7', 'TODAY → +7 DAYS (This Week)');
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        upcomingHorizonFilter === 'next_7'
                          ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                          : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:bg-amber-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span>Next 7 Days</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-950 font-mono">
                          Immediate
                        </span>
                      </div>
                      <div className="text-base font-extrabold font-mono mt-0.5 tabular-nums">
                        {bucketStats.next_7.count} Projects
                      </div>
                      <div className="text-[10px] opacity-80 truncate">
                        {bucketStats.next_7.units.toLocaleString()} units launching this week
                      </div>
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() =>
                        selectZoneInSpotlight('days_8_14', '+8 TO +14 DAYS (Week 2)')
                      }
                      onClick={() => {
                        setUpcomingHorizonFilter(
                          upcomingHorizonFilter === 'days_8_14' ? 'all' : 'days_8_14'
                        );
                        selectZoneInSpotlight('days_8_14', '+8 TO +14 DAYS (Week 2)');
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        upcomingHorizonFilter === 'days_8_14'
                          ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                          : 'bg-sky-50/70 text-sky-950 border-sky-200 hover:bg-sky-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span>8–14 Days Out</span>
                        <span className="font-mono">Week 2</span>
                      </div>
                      <div className="text-base font-extrabold font-mono mt-0.5 tabular-nums">
                        {bucketStats.days_8_14.count} Projects
                      </div>
                      <div className="text-[10px] opacity-80 truncate">
                        {bucketStats.days_8_14.units.toLocaleString()} units in 1–2 weeks
                      </div>
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() =>
                        selectZoneInSpotlight('days_15_30', '+15 TO +28 DAYS (Weeks 3–4)')
                      }
                      onClick={() => {
                        setUpcomingHorizonFilter(
                          upcomingHorizonFilter === 'days_15_30' ? 'all' : 'days_15_30'
                        );
                        selectZoneInSpotlight('days_15_30', '+15 TO +28 DAYS (Weeks 3–4)');
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        upcomingHorizonFilter === 'days_15_30'
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-indigo-50/60 text-indigo-950 border-indigo-200 hover:bg-indigo-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span>15–30 Days Out</span>
                        <span className="font-mono">Weeks 3–4</span>
                      </div>
                      <div className="text-base font-extrabold font-mono mt-0.5 tabular-nums">
                        {bucketStats.days_15_30.count} Projects
                      </div>
                      <div className="text-[10px] opacity-80 truncate">
                        {bucketStats.days_15_30.units.toLocaleString()} units this month
                      </div>
                    </button>

                    <button
                      type="button"
                      onMouseEnter={() =>
                        selectZoneInSpotlight('days_30_plus', '+29 DAYS & BEYOND')
                      }
                      onClick={() => {
                        setUpcomingHorizonFilter(
                          upcomingHorizonFilter === 'days_30_plus' ? 'all' : 'days_30_plus'
                        );
                        selectZoneInSpotlight('days_30_plus', '+29 DAYS & BEYOND');
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                        upcomingHorizonFilter === 'days_30_plus'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-emerald-50/60 text-emerald-950 border-emerald-200 hover:bg-emerald-100/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span>30+ Days Out</span>
                        <span className="font-mono">Next Month+</span>
                      </div>
                      <div className="text-base font-extrabold font-mono mt-0.5 tabular-nums">
                        {bucketStats.days_30_plus.count} Projects
                      </div>
                      <div className="text-[10px] opacity-80 truncate">
                        {bucketStats.days_30_plus.units.toLocaleString()} units on horizon
                      </div>
                    </button>
                  </div>

                  {/* 2. Interactive Visual Timeline Horizon Track (Scannable Leadership Pulse) */}
                  <div data-tutorial-id="horizon-timeline-axis" className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                          {upcomingCardMode === 'go_lives'
                            ? 'Go-Live Launch Horizon Timeline'
                            : 'Installation Start Horizon Timeline'}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[11px] text-slate-500">
                          Hover or click any horizon zone or milestone wave to scroll through properties below
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                          On Track
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          Behind Schedule
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                          High Risk
                        </span>
                        <span className="text-slate-300">|</span>
                        {/* Button on the Interactive Visual Horizon Timeline Axis tile to toggle the Chronological Rollout Sequence & Countdown Rail */}
                        <button
                          type="button"
                          data-tutorial-id="horizon-rollout-btn"
                          onClick={() => setShowRolloutSequence((v) => !v)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                            showRolloutSequence
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                          }`}
                          title="Toggle Chronological Rollout Sequence & Countdown Rail"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-sky-500" />
                          <span>
                            {showRolloutSequence
                              ? 'Hide Rollout Sequence'
                              : `Chronological Rollout Sequence (${filteredTimelineItems.length})`}
                          </span>
                          {showRolloutSequence ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Proportional Timeline Axis */}
                    <div className="relative pt-4 pb-7 px-3 bg-slate-50/80 rounded-lg border border-slate-200/80 overflow-x-auto">
                      <div className="min-w-[640px] relative">
                        {/* Interactive Horizon Zone Headers (+7 Days, +8 to +14 Days, +15 to +28 Days, +29 Days & Beyond) */}
                        <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono font-bold text-slate-500 mb-3">
                          <button
                            type="button"
                            onMouseEnter={() =>
                              selectZoneInSpotlight('next_7', 'TODAY → +7 DAYS (This Week)')
                            }
                            onClick={() =>
                              selectZoneInSpotlight('next_7', 'TODAY → +7 DAYS (This Week)')
                            }
                            className={`text-left border-l-2 border-amber-500 pl-2 py-1 rounded-r transition-colors cursor-pointer ${
                              activeSpotlightSelection?.type === 'zone' &&
                              activeSpotlightSelection.bucket === 'next_7'
                                ? 'bg-amber-100/90 text-amber-950 ring-1 ring-amber-300'
                                : 'text-amber-800 hover:bg-amber-100/50'
                            }`}
                          >
                            <div>TODAY → +7 DAYS (This Week)</div>
                            <div className="text-[9px] text-amber-700 font-sans font-semibold">
                              {bucketStats.next_7.count} properties · {bucketStats.next_7.units} units
                            </div>
                          </button>

                          <button
                            type="button"
                            onMouseEnter={() =>
                              selectZoneInSpotlight('days_8_14', '+8 TO +14 DAYS (Week 2)')
                            }
                            onClick={() =>
                              selectZoneInSpotlight('days_8_14', '+8 TO +14 DAYS (Week 2)')
                            }
                            className={`text-left border-l-2 border-sky-500 pl-2 py-1 rounded-r transition-colors cursor-pointer ${
                              activeSpotlightSelection?.type === 'zone' &&
                              activeSpotlightSelection.bucket === 'days_8_14'
                                ? 'bg-sky-100/90 text-sky-950 ring-1 ring-sky-300'
                                : 'text-sky-800 hover:bg-sky-100/50'
                            }`}
                          >
                            <div>+8 TO +14 DAYS (Week 2)</div>
                            <div className="text-[9px] text-sky-700 font-sans font-semibold">
                              {bucketStats.days_8_14.count} properties · {bucketStats.days_8_14.units} units
                            </div>
                          </button>

                          <button
                            type="button"
                            onMouseEnter={() =>
                              selectZoneInSpotlight('days_15_30', '+15 TO +28 DAYS (Weeks 3–4)')
                            }
                            onClick={() =>
                              selectZoneInSpotlight('days_15_30', '+15 TO +28 DAYS (Weeks 3–4)')
                            }
                            className={`text-left border-l-2 border-indigo-500 pl-2 py-1 rounded-r transition-colors cursor-pointer ${
                              activeSpotlightSelection?.type === 'zone' &&
                              activeSpotlightSelection.bucket === 'days_15_30'
                                ? 'bg-indigo-100/90 text-indigo-950 ring-1 ring-indigo-300'
                                : 'text-indigo-800 hover:bg-indigo-100/50'
                            }`}
                          >
                            <div>+15 TO +28 DAYS (Weeks 3–4)</div>
                            <div className="text-[9px] text-indigo-700 font-sans font-semibold">
                              {bucketStats.days_15_30.count} properties ·{' '}
                              {bucketStats.days_15_30.units} units
                            </div>
                          </button>

                          <button
                            type="button"
                            onMouseEnter={() =>
                              selectZoneInSpotlight('days_30_plus', '+29 DAYS & BEYOND')
                            }
                            onClick={() =>
                              selectZoneInSpotlight('days_30_plus', '+29 DAYS & BEYOND')
                            }
                            className={`text-left border-l-2 border-emerald-500 pl-2 py-1 rounded-r transition-colors cursor-pointer ${
                              activeSpotlightSelection?.type === 'zone' &&
                              activeSpotlightSelection.bucket === 'days_30_plus'
                                ? 'bg-emerald-100/90 text-emerald-950 ring-1 ring-emerald-300'
                                : 'text-emerald-800 hover:bg-emerald-100/50'
                            }`}
                          >
                            <div>+29 DAYS &amp; BEYOND</div>
                            <div className="text-[9px] text-emerald-700 font-sans font-semibold">
                              {bucketStats.days_30_plus.count} properties ·{' '}
                              {bucketStats.days_30_plus.units} units
                            </div>
                          </button>
                        </div>

                        {/* Horizontal Spine Line */}
                        <div className="relative h-10 flex items-center">
                          <div className="w-full h-2 rounded-full bg-gradient-to-r from-amber-200 via-sky-200 to-emerald-200" />

                          {/* TODAY Marker */}
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-10"
                            title="Today"
                          >
                            <div className="w-3 h-6 rounded-xs bg-slate-900 border-2 border-white shadow-xs" />
                            <span className="text-[9px] font-mono font-extrabold text-slate-900 mt-1">
                              TODAY
                            </span>
                          </div>

                          {/* Date Wave Nodes along the Timeline */}
                          {dateWaves.map((wave) => {
                            const pctLeft = Math.min(
                              97,
                              Math.max(4, Math.round((wave.daysUntil / maxDaysSpan) * 94) + 2)
                            );
                            const primaryItem = wave.items[0];
                            const hasHighRisk = wave.items.some(
                              (i) => i.effectiveHealth === 'High Risk'
                            );
                            const hasBehind = wave.items.some(
                              (i) => i.effectiveHealth === 'Behind Schedule'
                            );
                            const nodeColor = hasHighRisk
                              ? 'bg-rose-600 border-rose-200 text-white'
                              : hasBehind
                              ? 'bg-amber-500 border-amber-200 text-white'
                              : 'bg-emerald-600 border-emerald-200 text-white';
                            const isSelectedWave =
                              (activeSpotlightSelection?.type === 'wave' &&
                                activeSpotlightSelection.dateStr === wave.dateStr) ||
                              wave.items.some(
                                (i) => i.project.id === activeHoveredItem?.project.id
                              );

                            return (
                              <button
                                key={wave.dateStr}
                                type="button"
                                onMouseEnter={() => {
                                  setHoveredTimelineProjectId(primaryItem.project.id);
                                  selectWaveInSpotlight(wave.dateStr);
                                }}
                                onClick={() => {
                                  setHoveredTimelineProjectId(primaryItem.project.id);
                                  selectWaveInSpotlight(wave.dateStr);
                                }}
                                style={{ left: `${pctLeft}%` }}
                                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer transition-transform ${
                                  isSelectedWave ? 'z-30 scale-125' : 'z-20 hover:scale-125'
                                }`}
                                title={`${formatGoLiveDate(wave.dateStr)} (In ${wave.daysUntil} days) — ${wave.items.length} ${
                                  wave.items.length === 1 ? 'property' : 'properties'
                                }: ${wave.items.map((x) => x.project.propertyName).join(', ')}`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full border-2 shadow-sm flex items-center justify-center text-[10px] font-mono font-extrabold ${nodeColor} ${
                                    isSelectedWave ? 'ring-2 ring-slate-900' : ''
                                  }`}
                                >
                                  {wave.items.length}
                                </div>
                                <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold text-slate-600">
                                  +{wave.daysUntil}d
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Spotlight Callout Bar with Multi-Project Wave / Zone Scroller */}
                    {activeHoveredItem && (
                      <div data-tutorial-id="horizon-spotlight-bar" className="mt-3 p-3.5 rounded-xl bg-slate-900 text-white space-y-2.5 text-xs shadow-sm">
                        {/* Top Row: Active Project Details + Prev/Next Controls + Open Project Button */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                          <div className="flex flex-wrap items-center gap-2 min-w-0">
                            <span className="px-2 py-0.5 rounded bg-sky-500/20 border border-sky-400/40 text-sky-300 font-mono font-bold text-[11px]">
                              In {activeHoveredItem.daysUntil}{' '}
                              {activeHoveredItem.daysUntil === 1 ? 'Day' : 'Days'} ·{' '}
                              {formatGoLiveDate(activeHoveredItem.targetDate)}
                            </span>
                            <span className="font-extrabold text-white text-sm truncate">
                              {activeHoveredItem.project.propertyName}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-300">
                              {activeHoveredItem.project.city}, {activeHoveredItem.project.state} (
                              {activeHoveredItem.project.unitsCount} units)
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-300">
                              {activeHoveredItem.ownerLabel}:{' '}
                              <strong className="text-white">{activeHoveredItem.ownerName}</strong>
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-300">
                              HW Installed:{' '}
                              <strong className="text-emerald-300 font-mono">
                                {activeHoveredItem.installPct}%
                              </strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Prev / Next Project Cycle Controls when > 1 project on the same point or horizon zone */}
                            {activeSpotlightGroup.length > 1 && (
                              <div className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSpotlightIndex(
                                      (prev) =>
                                        (prev - 1 + activeSpotlightGroup.length) %
                                        activeSpotlightGroup.length
                                    )
                                  }
                                  className="p-1 rounded hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                                  title="Previous project on this point"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2 text-[11px] font-mono font-bold text-sky-300 tabular-nums">
                                  {safeSpotlightIdx + 1} of {activeSpotlightGroup.length}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSpotlightIndex(
                                      (prev) => (prev + 1) % activeSpotlightGroup.length
                                    )
                                  }
                                  className="p-1 rounded hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                                  title="Next project on this point"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => onSelectProjectTab(activeHoveredItem.project.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                            >
                              <span>Open Project</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Bottom Row (Shown when > 1 project on this wave/zone): Scrollable Strip of Projects to Dial Into */}
                        {activeSpotlightGroup.length > 1 && (
                          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 shrink-0">
                              {activeSpotlightGroupLabel} ({activeSpotlightGroup.length} Projects):
                            </span>
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                              {activeSpotlightGroup.map((grpItem, gIdx) => {
                                const isCurrent = gIdx === safeSpotlightIdx;
                                const dotColor =
                                  grpItem.effectiveHealth === 'High Risk'
                                    ? 'bg-rose-400'
                                    : grpItem.effectiveHealth === 'Behind Schedule'
                                    ? 'bg-amber-400'
                                    : 'bg-emerald-400';

                                return (
                                  <button
                                    key={grpItem.project.id}
                                    type="button"
                                    onClick={() => {
                                      setSpotlightIndex(gIdx);
                                      setHoveredTimelineProjectId(grpItem.project.id);
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                                      isCurrent
                                        ? 'bg-sky-500/25 text-white border-sky-400 shadow-2xs'
                                        : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                                    }`}
                                  >
                                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                                    <span>{grpItem.project.propertyName}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      ({grpItem.project.unitsCount}u)
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3. Chronological Executive Timeline Rail (Initially Minimized; Toggled via Button on Horizon Timeline Tile) */}
                  {showRolloutSequence && (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs animate-fadeIn">
                      <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span>Chronological Rollout Sequence &amp; Countdown Rail</span>
                          <span className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-800 font-mono">
                            Showing {displayedRows.length} of {filteredTimelineItems.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="hidden md:inline">
                            Timeline Horizon &amp; Hardware Readiness
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowRolloutSequence(false)}
                            className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-bold cursor-pointer"
                          >
                            Minimize
                          </button>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {displayedRows.map((item) => {
                          const barWidthPct = Math.min(
                            100,
                            Math.max(8, Math.round((item.daysUntil / maxDaysSpan) * 100))
                          );
                          const urgencyStyle =
                            item.daysUntil <= 7
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : item.daysUntil <= 14
                              ? 'bg-sky-100 text-sky-900 border-sky-300'
                              : 'bg-slate-100 text-slate-800 border-slate-200';

                          return (
                            <div
                              key={item.project.id}
                              onMouseEnter={() => {
                                setHoveredTimelineProjectId(item.project.id);
                                selectWaveInSpotlight(item.targetDate);
                              }}
                              onClick={() => onSelectProjectTab(item.project.id)}
                              className="px-4 py-2.5 hover:bg-sky-50/50 transition-colors cursor-pointer grid grid-cols-1 md:grid-cols-12 items-center gap-3 text-xs"
                            >
                              {/* Left Spine: Countdown + Date + Property (5 cols) */}
                              <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-20 shrink-0 px-2 py-1 rounded-md border text-center font-mono font-extrabold text-[11px] ${urgencyStyle}`}
                                >
                                  In {item.daysUntil}d
                                </div>
                                <div className="w-24 shrink-0 font-mono text-[11px] font-bold text-slate-700">
                                  {formatGoLiveDate(item.targetDate)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                                    <span className="truncate">{item.project.propertyName}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {item.project.clientName} · {item.project.city},{' '}
                                    {item.project.state} ·{' '}
                                    <strong className="text-slate-700">
                                      {item.project.unitsCount} units
                                    </strong>
                                  </div>
                                </div>
                              </div>

                              {/* Center: Visual Time-to-Event Bar + Hardware Readiness (4 cols) */}
                              <div className="md:col-span-4 space-y-1">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-slate-500 font-medium">
                                    {upcomingCardMode === 'go_lives'
                                      ? 'CSM Handoff Horizon'
                                      : 'Install Start Horizon'}{' '}
                                    (<strong className="text-slate-700">+{item.daysUntil} days</strong>)
                                  </span>
                                  <span className="font-mono font-bold text-slate-700">
                                    HW Installed: {item.installPct}%
                                  </span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/80">
                                  {/* Horizon distance bar */}
                                  <div
                                    className={`h-full rounded-full ${
                                      item.effectiveHealth === 'High Risk'
                                        ? 'bg-gradient-to-r from-rose-500 to-rose-400'
                                        : item.effectiveHealth === 'Behind Schedule'
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                        : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                                    }`}
                                    style={{ width: `${barWidthPct}%` }}
                                  />
                                </div>
                              </div>

                              {/* Right: Health Status + Assigned Owner + Open link (3 cols) */}
                              <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] border shrink-0 ${getStatusBadgeStyle(
                                    item.effectiveHealth
                                  )}`}
                                >
                                  {item.effectiveHealth}
                                </span>
                                <div className="text-right min-w-[95px] truncate">
                                  <div className="text-[11px] font-bold text-slate-800 truncate">
                                    {item.ownerName}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {item.secondaryLabel}: {item.secondaryName}
                                  </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expand / Collapse Footer if more than 10 items */}
                      {filteredTimelineItems.length > 10 && (
                        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            {showAllUpcomingTimeline
                              ? `Showing all ${filteredTimelineItems.length} scheduled properties on timeline`
                              : `Showing next 10 most imminent properties of ${filteredTimelineItems.length} total`}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowAllUpcomingTimeline((v) => !v)}
                            className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>
                              {showAllUpcomingTimeline
                                ? 'Collapse to Top 10 Next Up'
                                : `Show All ${filteredTimelineItems.length} on Timeline`}
                            </span>
                            {showAllUpcomingTimeline ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Mitigation Plans Summary Node (Toggled by 'Mitigation Plans' button on Projects Health Status tile) */}
      {atRiskAndBehindProjects.length > 0 && showMitigationPlans && (() => {
        const allPlans = atRiskAndBehindProjects.map((proj) => ({
          project: proj,
          plan: getEffectivePMPMitigationPlan(proj),
          health: calculateProjectScheduleHealth(
            proj.targetCompletionDate,
            proj.statusTag,
            proj.notes,
            proj.milestones
          ),
        }));

        const totalActionSteps = allPlans.reduce((acc, p) => acc + p.plan.actionItems.length, 0);
        const inProgressSteps = allPlans.reduce(
          (acc, p) => acc + p.plan.actionItems.filter((a) => a.status === 'In Progress').length,
          0
        );
        const completedSteps = allPlans.reduce(
          (acc, p) => acc + p.plan.actionItems.filter((a) => a.status === 'Completed').length,
          0
        );
        const pendingSteps = Math.max(0, totalActionSteps - inProgressSteps - completedSteps);
        const activeStepsPct =
          totalActionSteps > 0
            ? Math.round(((inProgressSteps + completedSteps) / totalActionSteps) * 100)
            : 0;

        // Group plans by PM
        const pmSummaryMap = new Map<
          string,
          { pmName: string; role: string; count: number; inProgress: number; completed: number; total: number; properties: string[] }
        >();
        allPlans.forEach(({ project: proj, plan }) => {
          const pmName = proj.assignedPM?.name || 'Assigned PM';
          const existing = pmSummaryMap.get(pmName) || {
            pmName,
            role: proj.assignedPM?.role || 'Project Manager',
            count: 0,
            inProgress: 0,
            completed: 0,
            total: 0,
            properties: [],
          };
          existing.count += 1;
          existing.inProgress += plan.actionItems.filter((a) => a.status === 'In Progress').length;
          existing.completed += plan.actionItems.filter((a) => a.status === 'Completed').length;
          existing.total += plan.actionItems.length;
          existing.properties.push(proj.propertyName);
          pmSummaryMap.set(pmName, existing);
        });
        const pmSummaries = Array.from(pmSummaryMap.values());

        return (
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/40 border-2 border-indigo-300/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all animate-fadeIn space-y-5">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            {/* Node Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-indigo-200/80">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-200 text-indigo-950 rounded uppercase tracking-wider border border-indigo-300">
                      Active PM Mitigation Summary
                    </span>
                    <span className="text-xs font-bold text-indigo-900">
                      · {atRiskAndBehindProjects.length} Mitigation Plan
                      {atRiskAndBehindProjects.length === 1 ? '' : 's'} in Process ({highRiskProjects.length} High Risk,{' '}
                      {behindScheduleProjects.length} Behind Schedule)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 font-['Plus_Jakarta_Sans']">
                    Summary of Mitigation Plans in Process by PMs
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-4xl leading-relaxed">
                    Consolidated overview of active schedule recovery and risk mitigation plans currently being executed by Project Managers across all Behind Schedule and High Risk deployments.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMitigationPlans(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white self-start md:self-auto cursor-pointer shrink-0"
              >
                Minimize Node
              </button>
            </div>

            {/* High-Level Summary Strip: Overall Progress + PM Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Plans & Action Velocity */}
              <div className="p-4 bg-white/95 rounded-xl border border-indigo-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    In-Process Mitigation Actions
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold border border-indigo-300">
                    {activeStepsPct}% Active / Done
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-sky-50 border border-sky-200">
                    <div className="text-base font-extrabold font-mono text-sky-900">{inProgressSteps}</div>
                    <div className="text-[10px] font-bold text-sky-700 uppercase">In Process</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="text-base font-extrabold font-mono text-emerald-900">{completedSteps}</div>
                    <div className="text-[10px] font-bold text-emerald-700 uppercase">Completed</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-base font-extrabold font-mono text-slate-800">{pendingSteps}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Queued</div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 pt-0.5">
                  Across <strong>{totalActionSteps}</strong> total tailored recovery steps on{' '}
                  <strong>{atRiskAndBehindProjects.length}</strong> properties.
                </p>
              </div>

              {/* Card 2 & 3: Active PMs Leading Mitigation Plans */}
              <div className="md:col-span-2 p-4 bg-white/95 rounded-xl border border-indigo-200/90 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>PM Mitigation Ownership &amp; In-Process Workload</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {pmSummaries.length} PM{pmSummaries.length === 1 ? '' : 's'} Executing Recovery Plans
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pmSummaries.map((pm) => (
                    <div
                      key={pm.pmName}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">{pm.pmName}</div>
                          <div className="text-[10px] text-slate-500">{pm.role}</div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-indigo-100 text-indigo-900 border border-indigo-300">
                          {pm.count} Active Plan{pm.count === 1 ? '' : 's'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium truncate">
                        Properties: <strong className="text-slate-900">{pm.properties.join(', ')}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-200/80">
                        <span className="text-sky-700 font-bold">{pm.inProgress} In Process</span>
                        <span className="text-emerald-700 font-bold">{pm.completed} Completed</span>
                        <span>{pm.total} Total Steps</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Pills by Property */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-200/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-600 mr-1">Filter Plans:</span>
                <button
                  type="button"
                  onClick={() => setSelectedPmpHubProjectId('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedPmpHubProjectId === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  All In-Process Plans ({atRiskAndBehindProjects.length})
                </button>
                {allPlans.map(({ project: proj, health: pHealth }) => {
                  const isSelected = selectedPmpHubProjectId === proj.id;
                  return (
                    <button
                      key={`pmp-tab-${proj.id}`}
                      type="button"
                      onClick={() => setSelectedPmpHubProjectId(proj.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? pHealth.effectiveTag === 'High Risk'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{pHealth.effectiveTag === 'High Risk' ? '⚠' : '⏳'}</span>
                      <span>{proj.propertyName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Cards Grid when viewing 'all', or Full Editor when a specific property is selected */}
            {selectedPmpHubProjectId === 'all' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {allPlans.map(({ project: proj, plan, health: pHealth }) => {
                  const isHigh = pHealth.effectiveTag === 'High Risk';
                  const inProgCount = plan.actionItems.filter((a) => a.status === 'In Progress').length;
                  const doneCount = plan.actionItems.filter((a) => a.status === 'Completed').length;

                  return (
                    <div
                      key={`mitigation-summary-card-${proj.id}`}
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all shadow-2xs ${
                        isHigh
                          ? 'bg-rose-50/75 border-rose-300'
                          : 'bg-amber-50/75 border-amber-300'
                      }`}
                    >
                      <div className="space-y-2.5">
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                                  isHigh
                                    ? 'bg-rose-200 text-rose-950 border-rose-300'
                                    : 'bg-amber-200 text-amber-950 border-amber-300'
                                }`}
                              >
                                {pHealth.effectiveTag}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-600">
                                {pHealth.weeksBehindLabel}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                              {proj.propertyName}
                            </h4>
                            <div className="text-[11px] text-slate-600">
                              PM: <strong className="text-slate-900">{proj.assignedPM.name}</strong> · Tech:{' '}
                              <strong className="text-slate-800">{normalizeFieldTech(proj.assignedFieldTech)}</strong>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onSelectProjectTab(proj.id)}
                            className="p-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 text-slate-700 shadow-2xs transition-colors shrink-0 cursor-pointer"
                            title="Open project workspace"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Recovery Approach & Target Recovery Date */}
                        <div className="p-2.5 bg-white/95 rounded-lg border border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                              Recovery Approach:
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-600">
                              Target: {plan.targetRecoveryDate}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-xs">
                            {plan.strategyType}
                          </div>
                          <p className="text-[11px] text-slate-700 leading-snug line-clamp-3">
                            {plan.scheduleCompressionPlan}
                          </p>
                        </div>

                        {/* Active Action Steps in Process */}
                        <div className="p-2.5 bg-white/95 rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <span>PM Actions in Process</span>
                            <span className="font-mono text-indigo-700">
                              {inProgCount} Active · {doneCount}/{plan.actionItems.length} Done
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {plan.actionItems.slice(0, 3).map((act) => (
                              <div
                                key={act.id}
                                className="text-[11px] flex items-start justify-between gap-1.5 pt-1 first:pt-0 border-t first:border-t-0 border-slate-100"
                              >
                                <span
                                  className={`leading-snug line-clamp-2 ${
                                    act.status === 'Completed'
                                      ? 'line-through text-slate-400'
                                      : 'text-slate-800 font-medium'
                                  }`}
                                >
                                  • {act.action}
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold border shrink-0 ${
                                    act.status === 'Completed'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                      : act.status === 'In Progress'
                                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {act.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Open / Edit Full Mitigation Plan */}
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPmpHubProjectId(proj.id)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors cursor-pointer text-center"
                        >
                          View &amp; Edit Full Mitigation Plan
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {atRiskAndBehindProjects
                  .filter((proj) => proj.id === selectedPmpHubProjectId)
                  .map((proj) => (
                    <div key={`pmp-hub-panel-${proj.id}`} className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPmpHubProjectId('all')}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>← Back to All In-Process Mitigation Plans</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectProjectTab(proj.id)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Full Project Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <PMPMitigationPlanPanel
                        project={proj}
                        onUpdateProject={(updated) => {
                          if (onUpdateProject) {
                            onUpdateProject(updated);
                          }
                        }}
                        variant="full"
                        defaultExpanded={false}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* REQUIREMENT: "On this same page under the project health status node when there are any projects at risk or Behind tagged create a new node called 'Behind the Veil' and highlight some of the issues roadblocks that the Project Management team is experiencing and help acknowledge that if it is something that the internal departments that work along side the Project managers cannot help with, that at the very least the summary of the roadblocks outlines where the trends are that are causing projects to be behind or at risk. This ideally should help leadership brainstorm and think of ways to prevent these roadblocks in the future using real live data." */}
      {atRiskAndBehindProjects.length > 0 && showBehindTheVeil && (
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-rose-50/40 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Node Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-amber-200/80">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs mt-0.5">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-200 text-amber-900 rounded uppercase tracking-wider border border-amber-300">
                    Live Field Roadblock Node
                  </span>
                  <span className="text-xs font-bold text-amber-800">
                    · {atRiskAndBehindProjects.length} Projects Flagged ({highRiskProjects.length} High Risk, {behindScheduleProjects.length} Behind Schedule)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                  <span>Behind the Veil: PM Operational Roadblocks & Trend Intelligence</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-4xl leading-relaxed">
                  Unvarnished transparency into actual field impediments facing the Project Management team. While certain delays stem from external municipal or manufacturer constraints outside PM control, identifying trend patterns enables leadership and partnering departments (Sales, CSM, Field Operations) to proactively brainstorm mitigations using real live data.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBehindTheVeil(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white self-start md:self-auto cursor-pointer"
            >
              Minimize Node
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-bold">
            <span className="text-slate-600 text-xs font-semibold mr-1">Filter Roadblock Trends:</span>
            <button
              type="button"
              onClick={() => setActiveRoadblockCategory('all')}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                activeRoadblockCategory === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              All Roadblock Trends ({atRiskAndBehindProjects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveRoadblockCategory('municipal')}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                activeRoadblockCategory === 'municipal'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-50'
              }`}
            >
              🏛️ External Municipal & Code Inspectors (67%)
            </button>
            <button
              type="button"
              onClick={() => setActiveRoadblockCategory('supply_chain')}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                activeRoadblockCategory === 'supply_chain'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-rose-900 border-rose-300 hover:bg-rose-50'
              }`}
            >
              📦 Supply Chain & Riser Gear Lead Times (33%)
            </button>
            <button
              type="button"
              onClick={() => setActiveRoadblockCategory('internal_assist')}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                activeRoadblockCategory === 'internal_assist'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-sky-900 border-sky-300 hover:bg-sky-50'
              }`}
            >
              🤝 Cross-Department Assist Opportunities
            </button>
          </div>

          {/* 3 Executive Brainstorming Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {/* Pillar 1: Municipal / Inspection Dependencies */}
            <div className="p-4 bg-white/90 backdrop-blur-xs rounded-xl border border-amber-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏛️ External Code & Inspectors</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  Trend: 14-Day Avg Lag
                </span>
              </div>
              <p className="text-xs text-slate-700">
                <strong>Apex Tech Lofts & The Domain:</strong> Modernization inspection by OTIS Elevator and retail association conduit permits halted interface sign-offs.
              </p>
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950">
                <div className="font-bold flex items-center gap-1 text-amber-900 mb-0.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Leadership Brainstorming Focus:</span>
                </div>
                <span>PMs cannot directly compel city inspectors. Can Sales/Legal insert a contract clause requiring owners to secure elevator modernization approvals 21 days before hardware dispatch?</span>
              </div>
            </div>

            {/* Pillar 2: Specialized Hardware Supply Chain */}
            <div className="p-4 bg-white/90 backdrop-blur-xs rounded-xl border border-rose-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📦 Supply Chain & Riser Gear</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-300">
                  Trend: Lead Time Drift
                </span>
              </div>
              <p className="text-xs text-slate-700">
                <strong>Solara Luxury Residences:</strong> High-rise 16-floor tower is 2.7 weeks behind due to manufacturer backlogs on enterprise PoE+ switches and riser conduit clearings.
              </p>
              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-[11px] text-rose-950">
                <div className="font-bold flex items-center gap-1 text-rose-900 mb-0.5">
                  <Lightbulb className="w-3.5 h-3.5 text-rose-600" />
                  <span>Leadership Brainstorming Focus:</span>
                </div>
                <span>Pre-purchase high-capacity 24P/48P PoE+ switches into regional inventory staging so projects don&apos;t wait on manufacturer direct lead times once Deal Won is signed.</span>
              </div>
            </div>

            {/* Pillar 3: Cross-Departmental Actionable Assists */}
            <div className="p-4 bg-white/90 backdrop-blur-xs rounded-xl border border-sky-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🤝 Internal Partner Assists</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-300">
                  Immediate Actionable
                </span>
              </div>
              <p className="text-xs text-slate-700">
                <strong>Sales & CSM Partnership:</strong> Non-responsive property owners delaying Kickoff walkthroughs, Entrata API keys, and Knox Box emergency entry tags.
              </p>
              <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-200 text-[11px] text-sky-950">
                <div className="font-bold flex items-center gap-1 text-sky-900 mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-sky-600" />
                  <span>Where Other Teams Can Step In:</span>
                </div>
                <span>Account Executives can leverage executive relationships with Greystar/Lincoln to obtain property master codes and schedule mandatory PMS kickoff calls.</span>
              </div>
            </div>
          </div>

          {/* Individual Live Roadblock Project Cards */}
          <div className="mt-5 pt-4 border-t border-amber-200/80">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Live Field Roadblocks by Property ({atRiskAndBehindProjects.length} Projects)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {atRiskAndBehindProjects.map((proj) => {
                const health = calculateProjectScheduleHealth(
                  proj.targetCompletionDate,
                  proj.statusTag,
                  proj.notes,
                  proj.milestones
                );
                const isAcknowledged = acknowledgedRoadblocks[proj.id];

                return (
                  <div
                    key={`veil-${proj.id}`}
                    className={`p-4 rounded-xl border transition-all ${
                      health.effectiveTag === 'High Risk'
                        ? 'bg-rose-50/70 border-rose-300'
                        : 'bg-amber-50/70 border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                              health.effectiveTag === 'High Risk'
                                ? 'bg-rose-200 text-rose-900 border-rose-300'
                                : 'bg-amber-200 text-amber-900 border-amber-300'
                            }`}
                          >
                            {health.effectiveTag}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 font-bold">
                            {health.weeksBehindLabel}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm mt-1">
                          {proj.propertyName}
                        </h5>
                        <div className="text-[11px] text-slate-600">
                          {proj.city}, {proj.state} · PM: <strong className="text-slate-800">{proj.assignedPM.name}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectProjectTab(proj.id)}
                        className="p-1.5 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 text-slate-700 shadow-2xs transition-colors shrink-0 cursor-pointer"
                        title="Open project workspace"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Roadblock Summary */}
                    <div className="mt-3 p-2.5 bg-white/95 rounded-lg border border-slate-200 text-xs text-slate-800 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Reported PM Roadblock:
                      </div>
                      <div className="font-medium text-slate-900 leading-snug">
                        {proj.statusReason || health.egregiousScheduleReason}
                      </div>

                      {health.negativeNotes && health.negativeNotes.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-100 text-[11px] text-rose-700 italic flex items-start gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                          <span>&ldquo;{health.negativeNotes[0]?.text}&rdquo;</span>
                        </div>
                      )}
                    </div>

                    {/* Tailored PMP Mitigation Plan inside Roadblock Card */}
                    <PMPMitigationPlanPanel
                      project={proj}
                      onUpdateProject={(updated) => {
                        if (onUpdateProject) {
                          onUpdateProject(updated);
                        }
                      }}
                      variant="compact"
                      defaultExpanded={false}
                    />

                    {/* Bottom Action Footer */}
                    <div className="mt-3 flex items-center justify-between text-xs pt-1">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Target: {proj.targetCompletionDate}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setAssistModalProject(proj);
                          setAssistDate(new Date().toISOString().split('T')[0]);
                          setAssistDetails('');
                        }}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          isAcknowledged || (proj.teamAssists && proj.teamAssists.length > 0)
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {isAcknowledged || (proj.teamAssists && proj.teamAssists.length > 0)
                          ? `✓ Assistance Logged (${proj.teamAssists?.length || 1})`
                          : 'Provide Assistance'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENT: "Let's provide a cost breakdown on the installation Overview Dashboard as well so that leadership can see on, a high-level, the overall profits of the total projects, as well as how on track we are to collect that money." */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded uppercase tracking-wider">
                Finance
              </span>
              <span className="text-xs text-slate-500 font-mono">· Portfolio Revenue & Profitability Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>Financial &amp; Profitability Overview</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Consolidated financial health evaluating gross profit margins across active hardware deployments, turnkey labor expenditures, and milestone cash collection progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-500 font-semibold">Sort Breakdown:</span>
            <select
              value={financialSortBy}
              onChange={(e) => setFinancialSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-sky-500"
            >
              <option value="profit">Highest Gross Profit ($)</option>
              <option value="revenue">Total Quoted Value ($)</option>
              <option value="margin">Highest Margin (%)</option>
              <option value="collection">Cash Collection %</option>
            </select>

            <button
              type="button"
              onClick={() => setIsFinancialProjectsMinimized((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
              title={isFinancialProjectsMinimized ? 'Expand project breakdown table' : 'Minimize project breakdown table to save space'}
            >
              {isFinancialProjectsMinimized ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                  <span>Expand Projects ({projectFinancials.length})</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
                  <span>Minimize Projects</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Financial KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-5">
          {/* Total Quoted Portfolio Value */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden min-w-0">
            <div className="text-xs text-slate-600 font-medium flex items-center justify-between gap-2">
              <span className="truncate">Total Quoted Contract Revenue</span>
              <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums break-words">
              ${totalPortfolioRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">
              Across <span className="font-bold text-slate-800 font-mono">{totalProjects}</span> active projects
            </div>
          </div>

          {/* Wholesale Equipment & Labor Cost */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden min-w-0">
            <div className="text-xs text-slate-600 font-medium flex items-center justify-between gap-2">
              <span className="truncate">Estimated Equipment &amp; Labor Cost</span>
              <Layers className="w-4 h-4 text-slate-500 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 font-mono mt-1 tabular-nums break-words">
              ${totalPortfolioCost.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">
              Wholesale catalog costs + 65% labor
            </div>
          </div>

          {/* Projected Gross Profit & Margin */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-300 overflow-hidden min-w-0">
            <div className="text-xs text-emerald-900 font-bold flex items-center justify-between gap-2">
              <span className="truncate">Projected Portfolio Gross Profit</span>
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-900 font-mono mt-1 tabular-nums flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span>${totalPortfolioProfit.toLocaleString()}</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-700 font-sans">({portfolioBlendedMargin}%)</span>
            </div>
            <div className="text-[11px] text-emerald-800/90 mt-0.5 truncate">
              Blended gross margin across active portfolio
            </div>
          </div>

          {/* Cash Collection Track */}
          <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-300 overflow-hidden min-w-0">
            <div className="text-xs text-sky-900 font-bold flex items-center justify-between gap-2">
              <span className="truncate">Milestone Cash Collection Progress</span>
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-sky-950 font-mono mt-1 tabular-nums flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span>${totalCashCollected.toLocaleString()}</span>
              <span className="text-xs font-normal text-sky-700">({portfolioCollectionPct}%)</span>
            </div>
            <div className="text-[11px] text-sky-900/80 mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <span>
                <span className="font-mono font-bold text-slate-800">${totalCashOnTrack.toLocaleString()}</span> on-track
              </span>
              <span>·</span>
              <span>
                <span className="font-mono font-bold text-rose-700">${totalCashAtRisk.toLocaleString()}</span> delayed
              </span>
            </div>
          </div>
        </div>

        {/* Cash Collection Track Progress Bar */}
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="font-bold text-slate-900">Portfolio Cash Collection Track:</span>
              <span className="font-mono text-slate-600">
                ${totalCashCollected.toLocaleString()} of ${totalPortfolioRevenue.toLocaleString()} collectable
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                Collectable ({portfolioCollectionPct}%)
              </span>
              <span className="inline-flex items-center gap-1 text-sky-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 shrink-0" />
                On-Track Billings (${Math.round(totalCashOnTrack / 1000)}k)
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
                Delayed at Risk (${Math.round(totalCashAtRisk / 1000)}k)
              </span>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(totalCashCollected / totalPortfolioRevenue) * 100}%` }}
              title={`Collected: $${totalCashCollected.toLocaleString()}`}
            />
            <div
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${(totalCashOnTrack / totalPortfolioRevenue) * 100}%` }}
              title={`On Track: $${totalCashOnTrack.toLocaleString()}`}
            />
            <div
              className="h-full bg-rose-500 transition-all duration-500"
              style={{ width: `${(totalCashAtRisk / totalPortfolioRevenue) * 100}%` }}
              title={`Delayed at Risk: $${totalCashAtRisk.toLocaleString()}`}
            />
          </div>
        </div>

        {/* Project Financial Breakdown Table with Minimize / Expand Toggle */}
        {!isFinancialProjectsMinimized ? (
          <div className="overflow-x-auto mt-4 border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Project & Client</th>
                  <th className="py-2.5 px-3 text-right">Quoted Hardware</th>
                  <th className="py-2.5 px-3 text-right">Turnkey Install</th>
                  <th className="py-2.5 px-3 text-right">Total Revenue</th>
                  <th className="py-2.5 px-3 text-right">Estimated Cost</th>
                  <th className="py-2.5 px-3 text-right font-bold text-emerald-800">Gross Profit ($)</th>
                  <th className="py-2.5 px-3 text-right">Margin %</th>
                  <th className="py-2.5 px-3 text-center">Billed / Invoiced</th>
                  <th className="py-2.5 px-3 text-center">Collection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectFinancials
                  .sort((a, b) => {
                    if (financialSortBy === 'profit') return b.grossProfit - a.grossProfit;
                    if (financialSortBy === 'revenue') return b.totalQuotedRevenue - a.totalQuotedRevenue;
                    if (financialSortBy === 'margin') return b.grossMarginPct - a.grossMarginPct;
                    return b.billedPercentage - a.billedPercentage;
                  })
                  .map((f) => (
                    <tr key={`fin-${f.project.id}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => onSelectProjectTab(f.project.id)}
                          className="font-bold text-slate-900 hover:text-sky-700 text-left transition-colors cursor-pointer"
                        >
                          {f.project.propertyName}
                        </button>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {f.project.clientName} · #{f.project.quoteNumber}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        ${f.quotedHardwareRevenue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                        ${f.quotedInstallRevenue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ${f.totalQuotedRevenue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        ${f.totalEstimatedCost.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-700">
                        +${f.grossProfit.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                        {f.grossMarginPct}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-800">
                          <span>{f.billedPercentage}%</span>
                          <span className="text-[10px] text-slate-400">(${Math.round(f.cashCollected / 1000)}k)</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {f.isAtRisk ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Delayed (${Math.round(f.unbilledAmount / 1000)}k)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>On Track</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-slate-900 font-mono">
                {projectFinancials.length} Projects Minimized
              </span>
              <span className="text-slate-400">•</span>
              <span>Total Revenue: <strong className="font-mono text-slate-900">${totalPortfolioRevenue.toLocaleString()}</strong></span>
              <span className="text-slate-400">•</span>
              <span>Gross Profit: <strong className="font-mono text-emerald-700">${totalPortfolioProfit.toLocaleString()}</strong> ({portfolioBlendedMargin}%)</span>
              <span className="text-slate-400">•</span>
              <span>Collected: <strong className="font-mono text-sky-800">${totalCashCollected.toLocaleString()}</strong> ({portfolioCollectionPct}%)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFinancialProjectsMinimized(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 underline cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Expand Projects Table</span>
            </button>
          </div>
        )}
      </div>

      {/* Visual Comparative Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hardware Categories Progress Breakdown with TWO Selectable Thermostat Tags */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">Hardware Categories Progress Breakdown</h3>
            </div>

            {/* Requirement: "for the smart thermostats tag ensure that it is two different tags that are selectable between 'Quext' and 'Honeywell'." */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold text-slate-700 text-[11px]">Thermostats:</span>
              <button
                type="button"
                onClick={() =>
                  setSelectedThermostatBrandFilter(selectedThermostatBrandFilter === 'Quext' ? 'All' : 'Quext')
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  selectedThermostatBrandFilter === 'Quext'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
                title="Filter / focus Quext brand thermostats"
              >
                Quext ({categories.find((c) => c.name === 'Smart Thermostats')?.quextStats || 0})
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedThermostatBrandFilter(selectedThermostatBrandFilter === 'Honeywell' ? 'All' : 'Honeywell')
                }
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  selectedThermostatBrandFilter === 'Honeywell'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
                title="Filter / focus Honeywell brand thermostats"
              >
                Honeywell ({categories.find((c) => c.name === 'Smart Thermostats')?.honeywellStats || 0})
              </button>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 font-bold">{cat.name}</span>
                    {cat.name === 'Smart Thermostats' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-300">
                        Selectable: Quext & Honeywell
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-600 font-medium tabular-nums">
                      {cat.installed.toLocaleString()} / {cat.quoted.toLocaleString()} {cat.unitLabel}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        cat.pct === 100
                          ? 'text-emerald-700'
                          : cat.pct > 50
                          ? 'text-sky-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {cat.pct}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.pct === 100
                        ? 'bg-emerald-500'
                        : cat.pct > 50
                        ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500'
                    }`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Field Activity Feed */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Field Installer Activity</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Live Telemetry</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {allLogs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No installation logs recorded yet.
                </div>
              ) : (
                allLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                      <span className="text-sky-700 font-bold truncate max-w-[180px]">
                        {log.propertyName}
                      </span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <div className="text-slate-900 font-medium">
                      <strong>+{log.quantityCompleted}</strong> {log.itemName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {log.locationCompleted} · {log.installerName}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Real-time installer logs & post-it sync</span>
            <span className="text-sky-700 font-mono font-bold">Quext Ops Fleet</span>
          </div>
        </div>
      </div>

      {/* Main Table: Active Projects Installation Status with PM Filter */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Implementation Projects</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Each quote automatically populates a dedicated project workspace with fillable BOM tracking and customer comms.
            </p>
          </div>

          {/* Table Filters: Search, PM Filter, and Kickoff Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 w-36 sm:w-48 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Requirement: "On the installation Overview Dashboard page and the all Won Projects directory page lets add a filter by Project Manager." */}
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={pmFilter}
                onChange={(e) => setPmFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Project Managers</option>
                {AVAILABLE_PMS.map((pm) => (
                  <option key={pm.name} value={pm.name}>
                    {pm.name} ({pm.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Field Tech Filter */}
            <div className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
              <select
                value={fieldTechFilter}
                onChange={(e) => setFieldTechFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Field Techs</option>
                {AVAILABLE_FIELD_TECHS.map((tech) => (
                  <option key={tech} value={tech}>
                    Tech: {tech}
                  </option>
                ))}
              </select>
            </div>

            {/* Integrator Partner Filter */}
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
              <select
                value={integratorFilter}
                onChange={(e) => setIntegratorFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Integrators / Installers</option>
                {allAvailableIntegrators.map((partner) => (
                  <option key={partner} value={partner}>
                    Installer: {partner}
                  </option>
                ))}
              </select>
            </div>

            {/* Kickoff Filter */}
            <select
              value={kickoffFilter}
              onChange={(e) => setKickoffFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Kickoff Statuses</option>
              <option value="needs_attention">⚠ Kickoff Needs Follow-Up ({projectsNeedingKickoffAttention.length})</option>
              <option value="completed">✓ Kickoff Submitted</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Project & Property</th>
                <th className="py-3 px-3">Client / Owner</th>
                <th className="py-3 px-3">Quote #</th>
                <th className="py-3 px-3">Assigned PM &amp; Tech</th>
                <th className="py-3 px-3">Integrators / Installers</th>
                <th className="py-3 px-4 min-w-[170px]">PM Status Tag</th>
                <th className="py-3 px-3">Kickoff Intake</th>
                <th className="py-3 px-4 min-w-[150px]">BOM Progress</th>
                <th className="py-3 px-3">Target Handover</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProjects.map((project) => {
                const health = calculateProjectScheduleHealth(
                  project.targetCompletionDate,
                  project.statusTag,
                  project.notes,
                  project.milestones
                );
                const quotedBOM = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
                const installedBOM = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
                const pct = quotedBOM > 0 ? Math.min(100, Math.round((installedBOM / quotedBOM) * 100)) : 0;
                const isKickoffDone = project.customerIntake?.walkthroughCompleted;

                return (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Project & Property */}
                    <td className="py-3.5 px-4">
                      <div>
                        <button
                          type="button"
                          onClick={() => onSelectProjectTab(project.id)}
                          className="font-bold text-slate-900 hover:text-sky-700 text-sm text-left transition-colors cursor-pointer"
                        >
                          {project.propertyName}
                        </button>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{project.city}, {project.state}</span>
                          <span>·</span>
                          <span className="font-mono">{project.unitsCount} units</span>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-3 text-slate-800 font-semibold">
                      {project.clientName}
                    </td>

                    {/* Quote Ref */}
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">
                      #{project.quoteNumber}
                    </td>

                    {/* Assigned PM & Tech */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-900 font-medium">{project.assignedPM.name}</div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-800 font-semibold mt-0.5">
                        <span className="text-[10px] text-slate-400 font-normal">Tech:</span>
                        <span className="bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          {normalizeFieldTech(project.assignedFieldTech)}
                        </span>
                      </div>
                    </td>

                    {/* Integrators / Installers */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap items-center gap-1 max-w-[160px]">
                        {getProjectIntegratorPartners(project).map((partner) => (
                          <span
                            key={partner}
                            className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200"
                          >
                            {partner}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Requirement: PM Status Tag dynamically reflects date calculation! */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={health.effectiveTag}
                            onChange={(e) =>
                              onUpdateProjectStatusTag(project.id, e.target.value as ProjectStatusTag)
                            }
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${getStatusBadgeStyle(
                              health.effectiveTag
                            )}`}
                          >
                            <option value="On Track">✓ On Track</option>
                            <option value="Behind Schedule">⏳ Behind Schedule</option>
                            <option value="High Risk">⚠ High Risk</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                              health.isOverdue
                                ? health.weeksBehind > 2
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {health.weeksBehindLabel}
                          </span>
                        </div>
                        {health.effectiveTag === 'High Risk' ? (
                          <div className="p-1.5 bg-rose-50/90 border border-rose-300 rounded text-[10px] text-rose-950 mt-1 max-w-[220px]">
                            <div className="font-bold flex items-center gap-1 text-rose-800">
                              <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                              <span>High Risk Factor:</span>
                            </div>
                            <div className="text-[10px] text-rose-900 font-semibold mt-0.5">
                              Egregiously behind schedule ({health.weeksBehindLabel})
                            </div>
                            {project.statusReason && (
                              <div className="text-[10px] text-slate-600 italic truncate mt-0.5" title={project.statusReason}>
                                Blocker: {project.statusReason}
                              </div>
                            )}
                          </div>
                        ) : project.statusReason ? (
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]" title={project.statusReason}>
                            {project.statusReason}
                          </div>
                        ) : null}

                        {(health.effectiveTag === 'Behind Schedule' ||
                          health.effectiveTag === 'High Risk') && (
                          <button
                            type="button"
                            onClick={() => setPmpModalProjectId(project.id)}
                            className={`mt-1 px-2 py-1 rounded-lg text-[10px] font-bold border inline-flex items-center gap-1 transition-all cursor-pointer w-fit ${
                              health.effectiveTag === 'High Risk'
                                ? 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                            }`}
                          >
                            <ShieldAlert className="w-3 h-3 shrink-0" />
                            <span>View / Edit Mitigation Plan</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Kickoff Intake Status Column */}
                    <td className="py-3.5 px-3">
                      {isKickoffDone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Complete</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200" title="Missing kickoff intake responses">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Follow-Up</span>
                        </span>
                      )}
                    </td>

                    {/* BOM Units Progress */}
                    <td className="py-3.5 px-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                          <span className="text-slate-600 tabular-nums">
                            {installedBOM.toLocaleString()} / {quotedBOM.toLocaleString()}
                          </span>
                          <span
                            className={`font-bold tabular-nums ${
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
                    </td>

                    {/* Target Date */}
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-700 whitespace-nowrap font-medium">
                      {project.targetCompletionDate}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectProjectTab(project.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-sky-600 hover:text-white border border-slate-300 hover:border-sky-600 rounded-lg transition-all shadow-xs cursor-pointer"
                        title="Open individual project focus tab under Operations"
                      >
                        <span>Focus Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assistance Provided Pop-Up Modal */}
      {assistModalProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded uppercase tracking-wider">
                  Leadership & Team Support
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Provide Assistance
                </h3>
                <p className="text-xs text-slate-500">
                  Project: <strong className="text-slate-800">{assistModalProject.propertyName}</strong> ({assistModalProject.clientName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssistModalProject(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssistance} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Date of Assistance *
                </label>
                <input
                  type="date"
                  required
                  value={assistDate}
                  onChange={(e) => setAssistDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  What was done? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={assistDetails}
                  onChange={(e) => setAssistDetails(e.target.value)}
                  placeholder="Detail what assistance was provided to support the field team and PM (e.g. called Greystar VP to clear elevator inspection delay, expedited PoE switch procurement with manufacturer, scheduled onsite walkthrough)..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-[11px] text-sky-900">
                This entry will be logged into the project&apos;s permanent <strong>Team Assists</strong> record on their project page for PMs and leadership to reference.
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAssistModalProject(null)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Save Assistance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PMP Mitigation Plan Full Editor Modal (from Table) */}
      {pmpModalProjectId && (() => {
        const modalProj = projects.find((p) => p.id === pmpModalProjectId);
        if (!modalProj) return null;
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 rounded uppercase tracking-wider">
                    Schedule Recovery &amp; Mitigation
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {modalProj.propertyName} — Tailored Mitigation Plan
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPmpModalProjectId(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <PMPMitigationPlanPanel
                project={modalProj}
                onUpdateProject={(updated) => {
                  if (onUpdateProject) {
                    onUpdateProject(updated);
                  }
                }}
                variant="full"
                defaultExpanded={false}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
};
