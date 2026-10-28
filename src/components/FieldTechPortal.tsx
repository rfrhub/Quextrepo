import React, { useState, useMemo } from 'react';
import {
  OperationProject,
  FieldTechName,
  AVAILABLE_FIELD_TECHS,
  normalizeFieldTech,
  getProjectIntegratorPartners,
  getCategoryDisplayName,
  getCategoryUnitLabel,
  CommonAreaDoor,
  ThermostatBrand,
  InstallLogEntry,
  PendingInstallationChange,
  ProjectStatusTag,
  calculateProjectScheduleHealth,
} from '../types';
import { QuextLogo } from './QuextLogo';
import { QuextVisionLogo } from './QuextVisionLogo';
import { ProgressGraph } from './ProgressGraph';
import { SOWForecasterSection } from './SOWForecasterSection';
import { ShippingDockSection } from './ShippingDockSection';
import { InstallLogSection } from './InstallLogSection';
import { InstallLogsAndMediaContainer } from './InstallLogsAndMediaContainer';
import { InstallersClipModal } from './InstallersClipModal';
import {
  PARTNER_IDENTITY_DIRECTORY,
  resolveMyQuextEmailIdentity,
} from '../partner-academy/utils/projectCoursePackager';
import {
  Wrench,
  Activity,
  BarChart2,
  ClipboardList,
  Truck,
  DoorOpen,
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  LogOut,
  KeyRound,
  Mail,
  Lock,
  X,
  Layers,
  Filter,
  ChevronDown,
  Calendar,
  Users,
  BookOpen,
  Sparkles,
  Zap,
} from 'lucide-react';

export interface FieldTechAccountProfile {
  name: FieldTechName;
  email: string;
  role: string;
  badgeCode: string;
  region: string;
  initials: string;
}

export const FIELD_TECH_PROFILES: Record<string, FieldTechAccountProfile> = {
  'Raul Recalde': {
    name: 'Raul Recalde',
    email: 'raul.recalde@onequext.com',
    role: 'Director of Implementation',
    badgeCode: 'QXT-DIR-001',
    region: 'All Operations Territories',
    initials: 'RR',
  },
  'Bethany Condon': {
    name: 'Bethany Condon',
    email: 'bethany.condon@onequext.com',
    role: 'Project Manager',
    badgeCode: 'QXT-PM-102',
    region: 'Eastern & Midwest Region',
    initials: 'BC',
  },
  'Megan Rossman': {
    name: 'Megan Rossman',
    email: 'megan.rossman@onequext.com',
    role: 'Director of Operations',
    badgeCode: 'QXT-DIR-002',
    region: 'All Operations Territories',
    initials: 'MR',
  },
  'Ian Robertson': {
    name: 'Ian Robertson',
    email: 'ian.robertson@onequext.com',
    role: 'Project Coordinator',
    badgeCode: 'QXT-PC-105',
    region: 'Central & Texas Region',
    initials: 'IR',
  },
  'Sean Gates': {
    name: 'Sean Gates',
    email: 'sean.gates@onequext.com',
    role: 'Lead Field Deployment Technician',
    badgeCode: 'QXT-FT-204',
    region: 'Southwest & Mountain Region',
    initials: 'SG',
  },
  'Hector Lopez': {
    name: 'Hector Lopez',
    email: 'hector.lopez@onequext.com',
    role: 'Senior Field Integration Technician',
    badgeCode: 'QXT-FT-108',
    region: 'Central & Southeast Region',
    initials: 'HL',
  },
};

export function getFieldTechProfile(nameOrEmail?: string | null): FieldTechAccountProfile {
  if (!nameOrEmail) return FIELD_TECH_PROFILES['Raul Recalde'];
  if (FIELD_TECH_PROFILES[nameOrEmail]) return FIELD_TECH_PROFILES[nameOrEmail];

  const lower = nameOrEmail.toLowerCase().trim();
  for (const [key, profile] of Object.entries(FIELD_TECH_PROFILES)) {
    if (lower === key.toLowerCase() || lower.includes(key.toLowerCase()) || lower.includes(profile.email.toLowerCase())) {
      return profile;
    }
  }

  const parts = nameOrEmail.trim().split(/\s+/);
  const initials = parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : nameOrEmail.slice(0, 2).toUpperCase();

  return {
    name: nameOrEmail,
    email: lower.includes('@') ? lower : `${parts.join('.').toLowerCase()}@onequext.com`,
    role: 'Field Operations Specialist',
    badgeCode: `QXT-OPS-${Math.abs(nameOrEmail.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 900 + 100}`,
    region: 'All Operations Territories',
    initials,
  };
}

interface FieldTechLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLoggedInTech: FieldTechName | null;
  currentPartnerEmail?: string | null;
  onLoginAsFieldTech: (tech: FieldTechName) => void;
  onLoginAsAdminPM: () => void;
  onLoginAsPartnerAcademy?: (email: string, companyId?: string, partnerShortName?: string) => void;
  projects: OperationProject[];
}

export const FieldTechLoginModal: React.FC<FieldTechLoginModalProps> = ({
  isOpen,
  onClose,
  currentLoggedInTech,
  currentPartnerEmail,
  onLoginAsFieldTech,
  onLoginAsAdminPM,
  onLoginAsPartnerAcademy,
  projects,
}) => {
  const [emailInput, setEmailInput] = useState<string>('installer@skbmintegrations.com');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');

  if (!isOpen) return null;

  const getAssignedCount = (tech: FieldTechName) =>
    projects.filter((p) => normalizeFieldTech(p.assignedFieldTech) === tech).length;

  const getPartnerProjectCount = (partnerShortName: string) =>
    projects.filter((p) =>
      getProjectIntegratorPartners(p).some(
        (name) => name.trim().toLowerCase() === partnerShortName.trim().toLowerCase()
      )
    ).length;

  const liveRoutePreview = resolveMyQuextEmailIdentity(emailInput, projects);

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolved = resolveMyQuextEmailIdentity(emailInput, projects);

    if (resolved.portal === 'field_tech') {
      onLoginAsFieldTech(resolved.fieldTech);
      onClose();
      return;
    }

    if (resolved.portal === 'pm_operations') {
      onLoginAsAdminPM();
      onClose();
      return;
    }

    if (resolved.portal === 'partner_academy' && onLoginAsPartnerAcademy) {
      onLoginAsPartnerAcademy(
        resolved.email,
        resolved.companyId,
        resolved.partnerShortName
      );
      onClose();
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
        {/* Clean White Quext Header matching myquext.com */}
        <div className="bg-gradient-to-r from-white via-sky-50/40 to-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QuextLogo className="h-7 sm:h-8 w-auto" />
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                myquext.com Unified Email Identity Router
              </h3>
              <p className="text-[11px] text-slate-500">
                Enter any user email to automatically route to Partner Academy, Field Tech Portal, or Operations Hub
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs max-h-[82vh] overflow-y-auto">
          {/* 1. Simulated myquext.com Email Routing Form */}
          <form
            onSubmit={handleCredentialSubmit}
            className="p-4 bg-slate-900 text-white border border-slate-800 rounded-xl space-y-3.5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Simulate myquext.com Email Login &amp; Auto-Routing
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px]">
                Domain-Aware Portal Router
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  User Email Address (Partner, Field Tech, or Quext PM)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="installer@skbmintegrations.com"
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Live Routing Destination Indicator */}
            <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-[11px] text-slate-300">
                <span className="text-slate-400 font-mono">Destination Route: </span>
                {liveRoutePreview.portal === 'partner_academy' && (
                  <strong className="text-purple-300">
                    Quext Partner Training &amp; Certification Academy ({liveRoutePreview.partnerShortName} — {liveRoutePreview.companyName})
                  </strong>
                )}
                {liveRoutePreview.portal === 'field_tech' && (
                  <strong className="text-sky-300">
                    Quext Field Tech Portal ({liveRoutePreview.fieldTech})
                  </strong>
                )}
                {liveRoutePreview.portal === 'pm_operations' && (
                  <strong className="text-emerald-300">
                    Quext Operations &amp; Sales Hub ({liveRoutePreview.pmName})
                  </strong>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In &amp; Route by Email</span>
              </button>
            </div>

            {/* Quick-Fill Email Pills */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-slate-400 font-mono">Test Emails:</span>
              {[
                'installer@skbmintegrations.com',
                'ops@atbfield.com',
                'installer@everbase.io',
                'installer@rmrintegrations.com',
                'sean.gates@onequext.com',
                'raul.recalde@onequext.com',
              ].map((sampleEmail) => (
                <button
                  key={sampleEmail}
                  type="button"
                  onClick={() => setEmailInput(sampleEmail)}
                  className={`px-2 py-0.5 rounded border font-mono transition-colors cursor-pointer ${
                    emailInput.toLowerCase() === sampleEmail.toLowerCase()
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {sampleEmail}
                </button>
              ))}
            </div>
          </form>

          {/* 2. Quick 1-Click Integrator Partner Academy Logins */}
          {onLoginAsPartnerAcademy && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>Official Channel Partners (OCP Academy Accounts)</span>
                </div>
                <span className="text-[10px] font-mono text-sky-800 bg-sky-50 border border-sky-300 px-2 py-0.5 rounded font-bold">
                  OCP Portal
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PARTNER_IDENTITY_DIRECTORY.slice(0, 5).map((partner) => {
                  const projCount = getPartnerProjectCount(partner.partnerShortName);
                  const isCurrentPartner =
                    currentPartnerEmail?.toLowerCase() === partner.defaultEmail.toLowerCase();

                  return (
                    <button
                      key={partner.companyId}
                      type="button"
                      onClick={() => {
                        onLoginAsPartnerAcademy(
                          partner.defaultEmail,
                          partner.companyId,
                          partner.partnerShortName
                        );
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isCurrentPartner
                          ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-200'
                          : 'bg-white hover:bg-purple-50/40 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-mono text-[10px]">
                              {partner.partnerShortName}
                            </span>
                            <span>{partner.companyName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {partner.defaultEmail}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-200 font-mono tabular-nums">
                          {projCount} Assigned {projCount === 1 ? 'Project' : 'Projects'}
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold text-purple-700 text-[11px]">
                          <span>Open Academy</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Quick 1-Click Field Tech Logins */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Quext Internal Field Technician Accounts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_FIELD_TECHS.map((techName) => {
                const profile = FIELD_TECH_PROFILES[techName];
                const assignedCount = getAssignedCount(techName);
                const isCurrent = currentLoggedInTech === techName && !currentPartnerEmail;

                return (
                  <button
                    key={techName}
                    type="button"
                    onClick={() => {
                      onLoginAsFieldTech(techName);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isCurrent
                        ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-200 shadow-xs'
                        : 'bg-white hover:bg-sky-50/30 border-slate-200 hover:border-sky-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                          {profile.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {profile.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{profile.email}</div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-200 font-mono tabular-nums">
                        {assignedCount} Assigned Projects
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-sky-700 text-[11px]">
                        <span>Sign in as {profile.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Return to Full PM / Director Operations View */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800">Full Operations &amp; Sales Hub (PM / Director)</div>
              <div className="text-[11px] text-slate-500 font-mono">
                raul.recalde@onequext.com · Director of Implementation
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onLoginAsAdminPM();
                onClose();
              }}
              className={`px-3.5 py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                currentLoggedInTech === null && !currentPartnerEmail
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {currentLoggedInTech === null && !currentPartnerEmail
                ? 'Currently in PM View'
                : 'Switch to PM / Admin View'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FieldTechPortalProps {
  fieldTech: FieldTechName;
  projects: OperationProject[];
  onUpdateProject: (updated: OperationProject) => void;
  onSwitchFieldTech: (tech: FieldTechName) => void;
  onLogoutToMainSite: () => void;
  onOpenLoginModal: () => void;
}

export const FieldTechPortal: React.FC<FieldTechPortalProps> = ({
  fieldTech,
  projects,
  onUpdateProject,
  onSwitchFieldTech,
  onLogoutToMainSite,
  onOpenLoginModal,
}) => {
  const techProfile = getFieldTechProfile(fieldTech);

  // Filter projects strictly to those assigned to the logged-in Field Tech / PM
  const assignedProjects = useMemo(() => {
    // 1. If Sean Gates or Hector Lopez, filter by assignedFieldTech
    if (fieldTech === 'Sean Gates' || fieldTech === 'Hector Lopez') {
      return projects.filter((p) => normalizeFieldTech(p.assignedFieldTech) === fieldTech);
    }
    // 2. If matching assignedPM
    const byPM = projects.filter(
      (p) => p.assignedPM?.name?.toLowerCase() === fieldTech.toLowerCase()
    );
    if (byPM.length > 0) return byPM;

    // 3. If field tech specifically assigned matches
    const byFieldTech = projects.filter(
      (p) => p.assignedFieldTech?.toLowerCase() === fieldTech.toLowerCase()
    );
    if (byFieldTech.length > 0) return byFieldTech;

    // 4. Default for Director or PM with no direct projects: return all projects
    return projects;
  }, [projects, fieldTech]);

  // 'hub' = Field Tech's Live Activity Hub, or a specific project ID
  const [activeTab, setActiveTab] = useState<string>('hub');

  // Filter inside the Field Tech Live Activity Hub (just like the PM filter on HomeScreen.tsx)
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [activityStreamFilter, setActivityStreamFilter] = useState<
    'all' | 'sow' | 'dock' | 'logs' | 'doors'
  >('all');

  // Installers Clip standalone in-the-field modal/view toggle
  const [isInstallersClipOpen, setIsInstallersClipOpen] = useState<boolean>(false);
  const [clipInitialProjectId, setClipInitialProjectId] = useState<string | null>(null);

  // Common Area Door Quick Add state for the active project view
  const [isAddingDoor, setIsAddingDoor] = useState<boolean>(false);
  const [newDoorName, setNewDoorName] = useState<string>('');
  const [newDoorArea, setNewDoorArea] = useState<string>('');

  const selectedProject =
    activeTab !== 'hub'
      ? assignedProjects.find((p) => p.id === activeTab) || assignedProjects[0] || null
      : null;

  // Filtered projects for the Live Activity Hub based on the selected property filter
  const hubFilteredProjects = useMemo(() => {
    if (selectedProjectFilter === 'all') return assignedProjects;
    return assignedProjects.filter((p) => p.id === selectedProjectFilter);
  }, [assignedProjects, selectedProjectFilter]);

  const onTrackProjects = hubFilteredProjects.filter((p) => p.statusTag === 'On Track');
  const behindScheduleProjects = hubFilteredProjects.filter(
    (p) => p.statusTag === 'Behind Schedule'
  );
  const highRiskProjects = hubFilteredProjects.filter((p) => p.statusTag === 'High Risk');

  // ============================================================================
  // AGGREGATE METRICS ACROSS ASSIGNED PROJECTS FOR FIELD TECH LIVE ACTIVITY HUB
  // ============================================================================

  // 1. Hardware Categories Progress Breakdown across filtered assigned projects
  const categoryMap = new Map<string, { quoted: number; installed: number }>();
  let totalAssignedQuotedDevices = 0;
  let totalAssignedInstalledDevices = 0;

  hubFilteredProjects.forEach((p) => {
    p.bomItems.forEach((item) => {
      totalAssignedQuotedDevices += item.quantity;
      totalAssignedInstalledDevices += item.installedCount;
      const dispName = getCategoryDisplayName(item.category);
      const existing = categoryMap.get(dispName) || { quoted: 0, installed: 0 };
      categoryMap.set(dispName, {
        quoted: existing.quoted + item.quantity,
        installed: existing.installed + item.installedCount,
      });
    });
  });

  const overallHardwarePct =
    totalAssignedQuotedDevices > 0
      ? Math.round((totalAssignedInstalledDevices / totalAssignedQuotedDevices) * 100)
      : 0;

  const categoryBreakdownList = Array.from(categoryMap.entries()).map(([name, stats]) => ({
    name,
    unitLabel: getCategoryUnitLabel(name),
    quoted: stats.quoted,
    installed: stats.installed,
    pct: stats.quoted > 0 ? Math.min(100, Math.round((stats.installed / stats.quoted) * 100)) : 0,
  }));

  // 2. SOW Forecaster items across filtered assigned projects
  const allSowItems = hubFilteredProjects.flatMap((p) =>
    (p.sowForecastItems || []).map((item) => ({
      ...item,
      projectId: p.id,
      propertyName: p.propertyName,
      clientName: p.clientName,
      assignedPMName: p.assignedPM.name,
    }))
  );
  const sowInProgressCount = allSowItems.filter((s) => s.status === 'In Progress').length;
  const sowCompletedCount = allSowItems.filter((s) => s.status === 'Completed').length;
  const sowForecastedCount = allSowItems.filter((s) => s.status === 'Forecasted').length;
  const totalSowForecastedUnits = allSowItems.reduce(
    (sum, s) => sum + (s.forecastedQuantity || 0),
    0
  );

  // 3. Shipping Dock items across filtered assigned projects
  const allDockItems = hubFilteredProjects.flatMap((p) =>
    (p.shippingDockItems || []).map((item) => ({
      ...item,
      projectId: p.id,
      propertyName: p.propertyName,
      assignedPMName: p.assignedPM.name,
    }))
  );
  const deliveredBatchesCount = allDockItems.filter((d) => d.status === 'Delivered to Site').length;
  const inTransitBatchesCount = allDockItems.filter(
    (d) => d.status === 'Shipped / In Transit'
  ).length;
  const totalShippedUnits = allDockItems.reduce((sum, d) => sum + (d.shippedQuantity || 0), 0);

  // 4. Installer Completion & Verification Log entries across filtered assigned projects
  const allInstallLogs = hubFilteredProjects
    .flatMap((p) =>
      (p.installLogs || []).map((log) => ({
        ...log,
        projectId: p.id,
        propertyName: p.propertyName,
        assignedPMName: p.assignedPM.name,
      }))
    )
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // 5. Common Area Doors Location Tree & Device Mapping across filtered assigned projects
  const allCommonDoors = hubFilteredProjects.flatMap((p) =>
    (p.customerIntake?.commonAreaDoors || []).map((door) => ({
      ...door,
      projectId: p.id,
      propertyName: p.propertyName,
      assignedPMName: p.assignedPM.name,
    }))
  );
  const doorsOnlineCount = allCommonDoors.filter(
    (d) => d.installedStatus === 'Installed & Online'
  ).length;
  const doorsWiredCount = allCommonDoors.filter(
    (d) => d.installedStatus === 'Wired & Calibrated'
  ).length;
  const doorsPendingCount = allCommonDoors.filter((d) => d.installedStatus === 'Pending').length;

  // Unified Live Activity Feed across the 5 sections (matching HomeScreen.tsx's Latest Updates & Field Activity)
  interface FieldActivityEvent {
    id: string;
    projectId: string;
    propertyName: string;
    assignedPMName: string;
    timestamp: string;
    category: 'sow' | 'dock' | 'logs' | 'doors';
    title: string;
    details: string;
    badge: string;
    badgeColor: string;
  }

  const unifiedFieldEvents: FieldActivityEvent[] = [];

  allInstallLogs.forEach((log) => {
    unifiedFieldEvents.push({
      id: `ft-log-${log.id}`,
      projectId: log.projectId,
      propertyName: log.propertyName,
      assignedPMName: log.assignedPMName,
      timestamp: log.timestamp,
      category: 'logs',
      title: `Installed +${log.quantityCompleted} ${log.itemName}`,
      details: `${log.locationCompleted} · Verified by ${log.installerName} (${log.statusCheck})`,
      badge: 'Installer Log',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    });
  });

  allSowItems.forEach((sow) => {
    unifiedFieldEvents.push({
      id: `ft-sow-${sow.id}`,
      projectId: sow.projectId,
      propertyName: sow.propertyName,
      assignedPMName: sow.assignedPMName,
      timestamp: `${sow.scheduledStartDate} – ${sow.scheduledEndDate}`,
      category: 'sow',
      title: `SOW Forecaster: ${sow.bomItemName} (Qty: ${sow.forecastedQuantity})`,
      details: `${sow.workDescription} · ${sow.buildingOrArea} · Installer: ${sow.assignedInstaller} (${sow.status})`,
      badge: 'SOW Forecaster',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    });
  });

  allDockItems.forEach((dock) => {
    unifiedFieldEvents.push({
      id: `ft-dock-${dock.id}`,
      projectId: dock.projectId,
      propertyName: dock.propertyName,
      assignedPMName: dock.assignedPMName,
      timestamp: `ETA ${dock.estimatedArrivalDate}`,
      category: 'dock',
      title: `Shipping Dock: ${dock.bomItemName} (Qty: ${dock.shippedQuantity})`,
      details: `${dock.carrier} · Tracking: ${dock.trackingNumber} · Status: ${dock.status}`,
      badge: 'Shipping Dock',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
    });
  });

  allCommonDoors.forEach((door) => {
    unifiedFieldEvents.push({
      id: `ft-door-${door.projectId}-${door.id}`,
      projectId: door.projectId,
      propertyName: door.propertyName,
      assignedPMName: door.assignedPMName,
      timestamp: door.installedDate || 'Scheduled',
      category: 'doors',
      title: `Common Door: ${door.doorName} (${door.buildingOrArea || 'Main Area'})`,
      details: `Status: ${door.installedStatus}${door.installedDeviceName ? ` · Mapped Hardware: ${door.installedDeviceName}` : ''}`,
      badge: 'Common Area Door',
      badgeColor:
        door.installedStatus === 'Installed & Online'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
          : 'bg-amber-50 text-amber-800 border-amber-300',
    });
  });

  const filteredActivityEvents =
    activityStreamFilter === 'all'
      ? unifiedFieldEvents
      : unifiedFieldEvents.filter((ev) => ev.category === activityStreamFilter);

  // ============================================================================
  // HANDLERS FOR PROJECT SECTIONS IN FIELD TECH VIEW
  // ============================================================================

  const handleUpdateThermostatBrandAll = (project: OperationProject, brand: ThermostatBrand) => {
    const updatedBOM = project.bomItems.map((item) => {
      if (
        item.category === 'Smart Thermostats & HVAC' ||
        item.name.toLowerCase().includes('thermostat')
      ) {
        return {
          ...item,
          thermostatBrand: brand,
          model: brand === 'Honeywell' ? 'HON-TH6-ZW' : 'QXT-TH-300',
          name:
            brand === 'Honeywell'
              ? 'Honeywell Home T6 Pro Z-Wave Smart Thermostat'
              : 'Quext IoT Smart Thermostat (LoRaWAN Hubless)',
        };
      }
      return item;
    });

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleToggleProjectFeature = (
    project: OperationProject,
    feature: 'nfc' | 'qr',
    checked: boolean
  ) => {
    if (feature === 'nfc') {
      onUpdateProject({
        ...project,
        useNfcWallet: checked,
        communityDetails: project.communityDetails
          ? {
              ...project.communityDetails,
              nfcWalletConfigured: checked,
            }
          : undefined,
        customerIntake: {
          ...(project.customerIntake || { pmsSoftware: 'Yardi', commonAreaDoors: [], staffRoles: [] }),
          useNfcWallet: checked,
        },
        lastUpdated: new Date().toISOString(),
      });
    } else {
      onUpdateProject({
        ...project,
        useQrIntercom: checked,
        customerIntake: {
          ...(project.customerIntake || { pmsSoftware: 'Yardi', commonAreaDoors: [], staffRoles: [] }),
          useQrIntercom: checked,
        },
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const handleAddLog = (
    project: OperationProject,
    newLog: Omit<InstallLogEntry, 'id'>,
    autoIncrementBOM: boolean
  ) => {
    const logId = `postit-${Date.now()}`;
    const isOverAllocation = Boolean(newLog.exceedsSOW);
    const offset = newLog.offsetQuantity || 0;

    const logEntry: InstallLogEntry = {
      ...newLog,
      id: logId,
      projectId: project.id,
      itemId: newLog.itemId,
      pendingPMConfirmation: true,
      submittedByRole: 'field_tech',
      color: isOverAllocation ? 'rose' : 'amber',
      approvalStatus: isOverAllocation ? 'pending_approval' : undefined,
    };

    const pendingChange: PendingInstallationChange = {
      id: `pending-ft-log-${Date.now()}`,
      source: 'install_log',
      sourceId: logId,
      title: isOverAllocation ? `⚠️ SOW Over-Allocation: ${newLog.itemName}` : `Installer Log: ${newLog.itemName}`,
      submittedBy: `${fieldTech} (Field Tech)`,
      submittedRole: 'field_tech',
      submittedAt: new Date().toISOString(),
      details: isOverAllocation
        ? `Logged ${newLog.quantityCompleted} units in ${newLog.locationCompleted} (Exceeds SOW by +${offset} units). Requires PM Approval.`
        : `Logged ${newLog.quantityCompleted} units in ${newLog.locationCompleted} (${newLog.statusCheck}). Awaiting PM Confirmation.`,
      bomIncrements: { [newLog.itemId]: newLog.quantityCompleted },
      status: 'pending',
      associatedLog: logEntry,
      exceedsSOW: isOverAllocation,
      offsetQuantity: offset,
      approvalStatus: isOverAllocation ? 'pending_approval' : undefined,
    };

    const updatedBOM = project.bomItems.map((item) => {
      if (item.id === newLog.itemId) {
        const existingLogs = item.postItLogs || [];
        const shouldIncrement = autoIncrementBOM && !isOverAllocation;
        const newCount = shouldIncrement
          ? item.installedCount + newLog.quantityCompleted
          : item.installedCount;
        return {
          ...item,
          installedCount: newCount,
          postItLogs: [logEntry, ...existingLogs],
        };
      }
      return item;
    });

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      installLogs: [logEntry, ...project.installLogs],
      pendingInstallationChanges: [pendingChange, ...(project.pendingInstallationChanges || [])],
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleDeleteLog = (project: OperationProject, logId: string) => {
    const updatedBOM = project.bomItems.map((item) => ({
      ...item,
      postItLogs: (item.postItLogs || []).filter((l) => l.id !== logId),
    }));

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      installLogs: project.installLogs.filter((l) => l.id !== logId),
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleUpdateDoor = (
    project: OperationProject,
    doorId: string,
    updates: Partial<CommonAreaDoor>
  ) => {
    const existingDoors = project.customerIntake?.commonAreaDoors || [];
    const currentDoor = existingDoors.find((d) => d.id === doorId);
    const updatedDoors = existingDoors.map((door) =>
      door.id === doorId ? { ...door, ...updates } : door
    );

    let updatedBOM = [...project.bomItems];
    const targetDeviceId =
      updates.installedDeviceId !== undefined
        ? updates.installedDeviceId
        : currentDoor?.installedDeviceId;
    const newStatus =
      updates.installedStatus !== undefined ? updates.installedStatus : currentDoor?.installedStatus;
    const oldStatus = currentDoor?.installedStatus;

    if (targetDeviceId && oldStatus !== newStatus) {
      if (newStatus === 'Installed & Online' && oldStatus !== 'Installed & Online') {
        updatedBOM = updatedBOM.map((item) =>
          item.id === targetDeviceId
            ? { ...item, installedCount: Math.min(item.quantity, (item.installedCount || 0) + 1) }
            : item
        );
      } else if (oldStatus === 'Installed & Online' && newStatus !== 'Installed & Online') {
        updatedBOM = updatedBOM.map((item) =>
          item.id === targetDeviceId
            ? { ...item, installedCount: Math.max(0, (item.installedCount || 0) - 1) }
            : item
        );
      }
    }

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      customerIntake: {
        ...(project.customerIntake || { pmsSoftware: 'Yardi', staffRoles: [], commonAreaDoors: [] }),
        commonAreaDoors: updatedDoors,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleAddCustomDoor = (e: React.FormEvent, project: OperationProject) => {
    e.preventDefault();
    if (!newDoorName.trim()) return;

    const newDoor: CommonAreaDoor = {
      id: `door-${Date.now()}`,
      doorName: newDoorName.trim(),
      buildingOrArea: newDoorArea.trim() || 'Clubhouse / Amenity Space',
      installedStatus: 'Pending',
    };

    const existingDoors = project.customerIntake?.commonAreaDoors || [];
    onUpdateProject({
      ...project,
      customerIntake: {
        ...(project.customerIntake || { pmsSoftware: 'Yardi', staffRoles: [], commonAreaDoors: [] }),
        commonAreaDoors: [...existingDoors, newDoor],
      },
      lastUpdated: new Date().toISOString(),
    });

    setNewDoorName('');
    setNewDoorArea('');
    setIsAddingDoor(false);
  };

  const handleDeleteDoor = (project: OperationProject, doorId: string) => {
    const existingDoors = project.customerIntake?.commonAreaDoors || [];
    onUpdateProject({
      ...project,
      customerIntake: {
        ...(project.customerIntake || { pmsSoftware: 'Yardi', staffRoles: [], commonAreaDoors: [] }),
        commonAreaDoors: existingDoors.filter((d) => d.id !== doorId),
      },
      lastUpdated: new Date().toISOString(),
    });
  };

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Inter'] overflow-x-hidden">
      {/* Unified Quext White Header matching Header.tsx on https://myquext.com/# */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Quext Brand Logo + Field Operations Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <QuextLogo className="h-7 sm:h-8 w-auto" onClick={() => setActiveTab('hub')} />

            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                activeTab !== 'hub'
                  ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title="Field Tech Portal Home"
            >
              <Layers className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="hidden xs:inline sm:inline">Field Tech Portal</span>
              <span className="xs:hidden sm:hidden">Field Tech</span>
            </button>
          </div>

          {/* Zone 2: Center Navigation (Live Activity Hub + Installers Clip) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'hub'
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Live Activity Hub</span>
              <span className="px-1.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded tabular-nums">
                {assignedProjects.length} Active
              </span>
            </button>

            {/* Installers Clip Field App Toggle */}
            <button
              type="button"
              onClick={() => {
                setClipInitialProjectId(activeTab !== 'hub' ? activeTab : null);
                setIsInstallersClipOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:to-indigo-500 text-white shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 border border-sky-400/40"
              title="Open Installers Clip — Standalone In-the-Field Logging App"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              <span>Installers Clip</span>
              <span className="px-1.5 py-0.2 bg-white/20 rounded text-[9px] font-black uppercase tracking-wider">
                Field
              </span>
            </button>
          </nav>

          {/* Zone 3: Field Tech Switcher & Profile matching Header.tsx */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Installers Clip Button */}
            <button
              type="button"
              onClick={() => {
                setClipInitialProjectId(activeTab !== 'hub' ? activeTab : null);
                setIsInstallersClipOpen(true);
              }}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xs border border-sky-400/40 cursor-pointer"
              title="Open Installers Clip"
            >
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300 shrink-0" />
              <span>Clip</span>
            </button>
            <button
              type="button"
              onClick={onLogoutToMainSite}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs shrink-0"
              title="Return to Operations tab on myquext.com"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Back to Operations</span>
              <span className="sm:hidden">Ops</span>
            </button>

            <div
              className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 p-1 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {techProfile.initials}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  <span>{techProfile.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">{techProfile.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Second Row: Live Activity Hub (md:hidden) */}
        <div className="md:hidden border-t border-slate-100 bg-slate-50/90 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('hub')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'hub'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Activity Hub ({assignedProjects.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas matching App.tsx */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'hub' || !selectedProject ? (
          /* ==================================================================
             VIEW 1: FIELD TECH LIVE ACTIVITY HUB
             Styled identically to HomeScreen.tsx on https://myquext.com/#
             ================================================================== */
          <div className="space-y-6">
            {/* Homescreen Hero Welcome Banner matching HomeScreen.tsx */}
            <div data-tutorial-id="field-tech-hub" className="bg-gradient-to-r from-white via-sky-50/40 to-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
              {/* Quext Vision Emblem in Top Right matching HomeScreen.tsx */}
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-4 z-20">
                <QuextVisionLogo size={63} />
              </div>

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pr-14 sm:pr-20">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded-md">
                      Live Operations Hub
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      · Field Technician Telemetry &amp; Assigned Communities ({techProfile.badgeCode})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                      Welcome back, {techProfile.name}
                    </h1>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {techProfile.role}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                    Managing on-site smart community deployments across your{' '}
                    <strong>{assignedProjects.length} assigned communities</strong> in the{' '}
                    <strong>{techProfile.region}</strong> for Hardware Categories Progress, SOW
                    Forecaster, Shipping Dock, Installer Completion Logs, and
                    Common Area Doors.
                  </p>
                </div>

                {/* Quick Action Navigation Buttons matching HomeScreen.tsx */}
                <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
                  {assignedProjects[0] && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(assignedProjects[0].id)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-all cursor-pointer max-w-full"
                    >
                      <Layers className="w-4 h-4 shrink-0" />
                      <span className="truncate">Open {assignedProjects[0].propertyName}</span>
                    </button>
                  )}

                  {assignedProjects[1] && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(assignedProjects[1].id)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-lg shadow-xs transition-all cursor-pointer max-w-full"
                    >
                      <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="truncate">Open {assignedProjects[1].propertyName}</span>
                    </button>
                  )}

                  <a
                    href="#ft-section-summaries"
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-all cursor-pointer max-w-full"
                  >
                    <BarChart2 className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">5-Section Summary ({hubFilteredProjects.length})</span>
                  </a>
                </div>
              </div>

              {/* Assigned Community Filter Bar matching HomeScreen.tsx PM Filter Bar */}
              <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-1">
                    <Filter className="w-3.5 h-3.5 text-sky-600" />
                    <span>Filter by Assigned Community:</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProjectFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedProjectFilter === 'all'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Assigned Communities</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                        selectedProjectFilter === 'all'
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {assignedProjects.length}
                    </span>
                  </button>

                  {assignedProjects.map((proj) => {
                    const isSelected = selectedProjectFilter === proj.id;
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() =>
                          setSelectedProjectFilter(isSelected ? 'all' : proj.id)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>{proj.propertyName}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {proj.unitsCount}u
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedProjectFilter}
                    onChange={(e) => setSelectedProjectFilter(e.target.value)}
                    aria-label="Filter by Assigned Community"
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs"
                  >
                    <option value="all">
                      All Assigned Communities ({assignedProjects.length} Projects)
                    </option>
                    {assignedProjects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.propertyName} ({proj.city}, {proj.state})
                      </option>
                    ))}
                  </select>

                  {selectedProjectFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedProjectFilter('all')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Clear Community Filter"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Health Status & KPI Bar matching HomeScreen.tsx */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
                {/* Box 1: Projects Health Status */}
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                  <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-between gap-2">
                    <span className="truncate">Assigned Projects Health Status</span>
                    <Activity className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-300 tabular-nums whitespace-nowrap">
                      {onTrackProjects.length} On Track
                    </span>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-amber-50 text-amber-800 border-amber-300 tabular-nums whitespace-nowrap">
                      {behindScheduleProjects.length} Behind
                    </span>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-rose-50 text-rose-800 border-rose-300 tabular-nums whitespace-nowrap">
                      {highRiskProjects.length} High Risk
                    </span>
                  </div>
                </div>

                {/* Box 2: Total Hardware Installed */}
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden min-w-0">
                  <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-between gap-2">
                    <span className="truncate">Total Hardware Installed ({fieldTech})</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                    <span>{totalAssignedInstalledDevices.toLocaleString()}</span>
                    <span className="text-xs font-normal text-slate-500">
                      / {totalAssignedQuotedDevices.toLocaleString()} items ({overallHardwarePct}%)
                    </span>
                  </div>
                </div>

                {/* Box 3: Active Communities & Field Scopes */}
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden min-w-0">
                  <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center justify-between gap-2">
                    <span className="truncate">Active Communities &amp; Field Scopes</span>
                    <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span>
                      {hubFilteredProjects.length}{' '}
                      {hubFilteredProjects.length === 1 ? 'Community' : 'Communities'}
                    </span>
                    <span className="text-xs font-normal text-slate-500">
                      · {allSowItems.length} SOW Scopes · {allDockItems.length} Shipments
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid matching HomeScreen.tsx: Left Activity Stream + Right Active Communities */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Live Activity Feed across the 5 Field Tech sections */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      Latest Updates &amp; Field Activity
                    </h2>
                  </div>

                  {/* Section Filter Tabs inside Activity Stream */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                    {[
                      { id: 'all', label: `All (${unifiedFieldEvents.length})` },
                      { id: 'logs', label: `Installer Logs (${allInstallLogs.length})` },
                      { id: 'sow', label: `SOW Forecaster (${allSowItems.length})` },
                      { id: 'dock', label: `Shipping Dock (${allDockItems.length})` },
                      { id: 'doors', label: `Common Doors (${allCommonDoors.length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setActivityStreamFilter(
                            tab.id as 'all' | 'sow' | 'dock' | 'logs' | 'doors'
                          )
                        }
                        className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          activityStreamFilter === tab.id
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-3 max-h-[540px] overflow-y-auto pr-1">
                  {filteredActivityEvents.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No recent field activity recorded for this filter.
                    </div>
                  ) : (
                    filteredActivityEvents.slice(0, 15).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setActiveTab(item.projectId)}
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
                            <span className="font-mono text-slate-500 text-[11px] tabular-nums">
                              {item.timestamp}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}
                          >
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

              {/* Right Column: Active Communities Spotlight matching HomeScreen.tsx */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Active Communities ({hubFilteredProjects.length})
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Click a community to open its 5-section Field Tech Workspace
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-3">
                    {hubFilteredProjects.map((project) => {
                      const totalQuoted = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
                      const totalInstalled = project.bomItems.reduce(
                        (acc, i) => acc + i.installedCount,
                        0
                      );
                      const pct =
                        totalQuoted > 0
                          ? Math.min(100, Math.round((totalInstalled / totalQuoted) * 100))
                          : 0;
                      const projSowCount = (project.sowForecastItems || []).length;
                      const projDockCount = (project.shippingDockItems || []).length;
                      const projDoorsCount = (project.customerIntake?.commonAreaDoors || []).length;

                      return (
                        <div
                          key={project.id}
                          onClick={() => setActiveTab(project.id)}
                          className="p-3.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-slate-50 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate max-w-[190px]">
                              {project.propertyName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusBadgeStyle(
                                project.statusTag
                              )}`}
                            >
                              {project.statusTag}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-1">
                            <span>
                              {project.city}, {project.state} ·{' '}
                              <strong className="text-slate-700 font-sans">
                                {project.assignedPM.name}
                              </strong>
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
                              <span className="font-bold text-slate-700 ml-1 tabular-nums">
                                {pct}%
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-mono tabular-nums">
                              {projSowCount} SOW · {projDockCount} Dock · {projDoorsCount} Doors
                            </span>
                            <span className="inline-flex items-center gap-1 font-bold text-sky-600 group-hover:translate-x-0.5 transition-transform">
                              <span>Open Workspace</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Section Field Tech Activity Summaries matching myquext.com card styling */}
            <div id="ft-section-summaries" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Summary 1: Hardware Categories Progress Breakdown */}
                <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 overflow-hidden min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <BarChart2 className="w-5 h-5 text-sky-600 shrink-0" />
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        Hardware Categories Progress Breakdown
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-700 tabular-nums shrink-0">
                      {overallHardwarePct}% Total Installed
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {categoryBreakdownList.map((cat) => (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                          <span className="font-bold text-slate-800">{cat.name}</span>
                          <div className="font-mono flex items-center gap-2 tabular-nums">
                            <span className="text-slate-600">
                              {cat.installed.toLocaleString()} / {cat.quoted.toLocaleString()}{' '}
                              {cat.unitLabel}
                            </span>
                            <span className="font-bold text-sky-700">{cat.pct}%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              cat.pct === 100 ? 'bg-emerald-500' : 'bg-sky-500'
                            }`}
                            style={{ width: `${cat.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary 2: SOW Forecaster */}
                <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 overflow-hidden min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <ClipboardList className="w-5 h-5 text-indigo-600 shrink-0" />
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        SOW Forecaster ({allSowItems.length} Scopes ·{' '}
                        {totalSowForecastedUnits.toLocaleString()} Units)
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-700 font-bold tabular-nums">
                      {sowInProgressCount} Active · {sowForecastedCount} Upcoming ·{' '}
                      {sowCompletedCount} Done
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {allSowItems.map((sow) => (
                      <div
                        key={sow.id}
                        onClick={() => setActiveTab(sow.projectId)}
                        className="p-3 rounded-lg bg-white hover:bg-sky-50/30 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3 text-xs overflow-hidden"
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-sky-700">{sow.propertyName}</span>
                            <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                              {sow.scheduledStartDate} – {sow.scheduledEndDate}
                            </span>
                          </div>
                          <div className="font-semibold text-slate-900 break-words">{sow.bomItemName}</div>
                          <div className="text-[11px] text-slate-600 break-words">
                            {sow.workDescription} · <strong>{sow.buildingOrArea}</strong> (
                            {sow.assignedInstaller})
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-0 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                              sow.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : sow.status === 'In Progress'
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {sow.status}
                          </span>
                          <div className="font-mono font-bold text-slate-800 sm:mt-1 tabular-nums">
                            Qty: {sow.forecastedQuantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Summary 3: Shipping Dock */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 overflow-hidden min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <Truck className="w-5 h-5 text-sky-600 shrink-0" />
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        Shipping Dock
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-sky-700 font-bold tabular-nums">
                      {deliveredBatchesCount} On Site · {inTransitBatchesCount} Transit
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {allDockItems.map((dock) => (
                      <div
                        key={dock.id}
                        onClick={() => setActiveTab(dock.projectId)}
                        className="p-3 rounded-lg bg-white hover:bg-sky-50/30 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer text-xs space-y-1 overflow-hidden"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="font-bold text-sky-700 truncate">{dock.propertyName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                              dock.status === 'Delivered to Site'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-sky-50 text-sky-800 border-sky-200'
                            }`}
                          >
                            {dock.status}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900 break-words">
                          {dock.bomItemName} (Qty: {dock.shippedQuantity})
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 tabular-nums break-all sm:break-words">
                          {dock.carrier} · {dock.trackingNumber} · ETA: {dock.estimatedArrivalDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary 4: Installer Completion & Verification Log */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 overflow-hidden min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        Installer Completion &amp; Verification Log
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold tabular-nums shrink-0">
                      {allInstallLogs.length} Logs
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {allInstallLogs.map((log) => (
                      <div
                        key={log.id}
                        onClick={() => setActiveTab(log.projectId)}
                        className="p-3 rounded-lg bg-white hover:bg-sky-50/30 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer text-xs space-y-1 overflow-hidden"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-[11px] tabular-nums">
                          <span className="font-bold text-sky-700 font-sans truncate">
                            {log.propertyName}
                          </span>
                          <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                        </div>
                        <div className="font-bold text-slate-900 break-words">
                          +{log.quantityCompleted} {log.itemName}
                        </div>
                        <div className="text-[11px] text-slate-600 break-words">
                          {log.locationCompleted} · {log.installerName} ({log.statusCheck})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary 5: Common Area Doors Location Tree & Device Mapping */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 overflow-hidden min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <DoorOpen className="w-5 h-5 text-sky-600 shrink-0" />
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        Common Area Doors &amp; Device Mapping
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-sky-700 font-bold tabular-nums shrink-0">
                      {doorsOnlineCount}/{allCommonDoors.length} Online
                    </span>
                  </div>

                  {allCommonDoors.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      No common area doors logged yet. Click any assigned community to add or map
                      door locations.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {allCommonDoors.map((door) => (
                        <div
                          key={`${door.projectId}-${door.id}`}
                          onClick={() => setActiveTab(door.projectId)}
                          className="p-3 rounded-lg bg-white hover:bg-sky-50/30 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer text-xs space-y-1 overflow-hidden"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="font-bold text-slate-900 break-words">{door.doorName}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                                door.installedStatus === 'Installed & Online'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : door.installedStatus === 'Wired & Calibrated'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : door.installedStatus === 'Needs Service'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {door.installedStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 break-words">
                            <strong className="text-sky-700">{door.propertyName}</strong> ·{' '}
                            {door.buildingOrArea || 'Main Area'}
                          </div>
                          {door.installedDeviceName && (
                            <div className="text-[11px] font-mono text-slate-700 break-words">
                              Mapped Device: {door.installedDeviceName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================================
             VIEW 2: FIELD TECH PROJECT WORKSPACE
             Styled identically to ProjectDetailView.tsx on https://myquext.com/#
             Contains ONLY the 5 sections requested by the user:
             1. Hardware Categories Progress Breakdown
             2. SOW Forecaster
             3. Shipping Dock
             4. Installer Completion & Verification Log
             5. Common Area Doors Location Tree & Device Mapping
             ================================================================== */
          <div className="space-y-6">
            {(() => {
              const health = calculateProjectScheduleHealth(
                selectedProject.targetCompletionDate,
                selectedProject.statusTag,
                selectedProject.milestones,
                selectedProject.notes
              );
              const totalQuotedDevices = selectedProject.bomItems.reduce(
                (acc, i) => acc + i.quantity,
                0
              );
              const totalInstalledDevices = selectedProject.bomItems.reduce(
                (acc, i) => acc + i.installedCount,
                0
              );
              const deploymentPct =
                totalQuotedDevices > 0
                  ? Math.min(100, Math.round((totalInstalledDevices / totalQuotedDevices) * 100))
                  : 0;
              const progressBarColor =
                health.effectiveTag === 'On Track'
                  ? 'bg-emerald-500'
                  : health.effectiveTag === 'Behind Schedule'
                  ? 'bg-amber-500'
                  : 'bg-rose-500';

              return (
                /* Top Banner / Project Profile matching ProjectDetailView.tsx */
                <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="min-h-[10.5rem] sm:h-52 w-full relative overflow-hidden bg-slate-900 p-3 sm:p-4 flex flex-col justify-between">
                    <img
                      src={selectedProject.heroImage}
                      alt={selectedProject.propertyName}
                      className="absolute inset-0 w-full h-full object-cover opacity-65"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('hub')}
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-lg transition-colors shadow-sm cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Activity Hub</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setClipInitialProjectId(selectedProject.id);
                            setIsInstallersClipOpen(true);
                          }}
                          className="text-[11px] sm:text-xs px-2.5 py-1 rounded bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                          title="Open this project in Installers Clip"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>Open in Installers Clip</span>
                        </button>
                        <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded bg-sky-600/90 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>{fieldTech}</span>
                        </span>
                        <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono font-medium">
                          Quote #{selectedProject.quoteNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-white border-t border-slate-100">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                            {selectedProject.propertyName}
                          </h1>
                          <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-sky-100 text-sky-800 border border-sky-300">
                            Field Tech Workspace
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded font-bold border ${getStatusBadgeStyle(
                              health.effectiveTag
                            )}`}
                          >
                            {health.effectiveTag}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="text-slate-900 font-semibold">
                            {selectedProject.clientName}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {selectedProject.address}, {selectedProject.city},{' '}
                            {selectedProject.state}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <strong className="text-slate-900 font-mono tabular-nums">
                              {selectedProject.unitsCount}
                            </strong>{' '}
                            Units
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-500 text-xs">Target Date:</span>
                            <span className="font-mono text-slate-900 font-bold text-xs tabular-nums">
                              {selectedProject.targetCompletionDate}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                            <span className="text-slate-500">Assigned PM:</span>
                            <strong className="text-sky-900">
                              {selectedProject.assignedPM.name}
                            </strong>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                            <span className="text-slate-500">Assigned Field Tech:</span>
                            <strong className="text-sky-900">{fieldTech}</strong>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                            <span className="text-slate-500">Integrator Partners:</span>
                            <strong className="text-indigo-900">
                              {getProjectIntegratorPartners(selectedProject).join(', ')}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Right side Overall Deployment Progress Box matching ProjectDetailView.tsx */}
                      <div className="lg:w-72 shrink-0 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">
                            Overall Hardware Progress
                          </span>
                          <span className="font-mono font-extrabold text-slate-900 tabular-nums">
                            {deploymentPct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progressBarColor}`}
                            style={{ width: `${deploymentPct}%` }}
                          />
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-1.5 tabular-nums">
                          {totalInstalledDevices.toLocaleString()} of{' '}
                          {totalQuotedDevices.toLocaleString()} BOM devices installed
                        </div>
                      </div>
                    </div>

                    {/* Quick Section Sub-Navigation Bar (Swipeable on Mobile) */}
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                      <a
                        href="#ft-hardware-breakdown"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-800 border border-slate-200 transition-colors whitespace-nowrap shrink-0"
                      >
                        <BarChart2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Hardware Categories Progress Breakdown</span>
                      </a>
                      <a
                        href="#sow-forecaster-section"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-800 border border-slate-200 transition-colors whitespace-nowrap shrink-0"
                      >
                        <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
                        <span>SOW Forecaster</span>
                      </a>
                      <a
                        href="#shipping-dock-section"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-800 border border-slate-200 transition-colors whitespace-nowrap shrink-0"
                      >
                        <Truck className="w-3.5 h-3.5 text-sky-600" />
                        <span>Shipping Dock</span>
                      </a>
                      <a
                        href="#ft-installer-log"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 transition-colors whitespace-nowrap shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Installer Completion &amp; Verification Log</span>
                      </a>
                      <a
                        href="#ft-common-doors"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-800 border border-slate-200 transition-colors whitespace-nowrap shrink-0"
                      >
                        <DoorOpen className="w-3.5 h-3.5 text-sky-600" />
                        <span>Common Area Doors Location Tree &amp; Device Mapping</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SECTION 1: Hardware Categories Progress Breakdown */}
            <div id="ft-hardware-breakdown">
              <ProgressGraph
                bomItems={selectedProject.bomItems}
                installLogs={selectedProject.installLogs}
                targetCompletionDate={selectedProject.targetCompletionDate}
                onUpdateThermostatBrand={(brand) =>
                  handleUpdateThermostatBrandAll(selectedProject, brand)
                }
                useNfcWallet={Boolean(
                  selectedProject.useNfcWallet ??
                    selectedProject.communityDetails?.nfcWalletConfigured
                )}
                useQrIntercom={Boolean(
                  selectedProject.useQrIntercom ?? selectedProject.customerIntake?.useQrIntercom
                )}
                onToggleFeature={(feature, checked) =>
                  handleToggleProjectFeature(selectedProject, feature, checked)
                }
              />
            </div>

            {/* SECTION 2: SOW Forecaster */}
            <SOWForecasterSection
              project={selectedProject}
              onUpdateProject={onUpdateProject}
              editorRole="field_tech"
              editorName={`${fieldTech} (Field Tech)`}
            />

            {/* SECTION 3: Shipping Dock */}
            <ShippingDockSection
              project={selectedProject}
              onUpdateProject={onUpdateProject}
            />

            {/* SECTION 4: Installer Completion & Verification Log & Field Media Carousel */}
            <div id="ft-installer-log">
              <InstallLogsAndMediaContainer
                project={selectedProject}
                logs={selectedProject.installLogs}
                bomItems={selectedProject.bomItems}
                projectIntegratorPartners={getProjectIntegratorPartners(selectedProject)}
                onAddLog={(newLog, autoInc) => handleAddLog(selectedProject, newLog, Boolean(autoInc))}
                onDeleteLog={(logId) => handleDeleteLog(selectedProject, logId)}
                defaultInstallerName={`${fieldTech} (Field Tech)`}
                editorRole="field_tech"
                editorName={`${fieldTech} (Field Tech)`}
                assignedPM={selectedProject.assignedPM}
                onOpenInstallersClip={() => {
                  setClipInitialProjectId(selectedProject.id);
                  setIsInstallersClipOpen(true);
                }}
              />
            </div>

            {/* SECTION 5: Common Area Doors Location Tree & Device Mapping */}
            <div
              id="ft-common-doors"
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
            >
              {(() => {
                const commonDoors = selectedProject.customerIntake?.commonAreaDoors || [];
                const accessControlBOM = selectedProject.bomItems.filter(
                  (i) =>
                    i.category === 'Smart Access Control' ||
                    i.category === 'Common Area & Utilities'
                );

                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <DoorOpen className="w-5 h-5 text-sky-600" />
                          <h3 className="text-base font-bold text-slate-900">
                            Common Area Doors Location Tree &amp; Device Mapping
                          </h3>
                          <span className="text-[11px] font-mono px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-200 rounded font-bold tabular-nums">
                            {commonDoors.length} Doors
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Select which specific hardware device was installed at each common area
                          location and update its commissioning status.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingDoor(!isAddingDoor)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAddingDoor ? 'Cancel' : '+ Add Door Location'}</span>
                        </button>
                      </div>
                    </div>

                    {isAddingDoor && (
                      <form
                        onSubmit={(e) => handleAddCustomDoor(e, selectedProject)}
                        className="p-4 bg-sky-50/50 border border-sky-200 rounded-lg space-y-3"
                      >
                        <div className="text-xs font-bold text-sky-900">
                          Add New Common Area Door to {selectedProject.propertyName}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Door Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Clubhouse West Exit, Dog Park Gate"
                              value={newDoorName}
                              onChange={(e) => setNewDoorName(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-sky-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Building or Area
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Amenity Building, Building 4"
                              value={newDoorArea}
                              onChange={(e) => setNewDoorArea(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingDoor(false)}
                            className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3.5 py-1 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded cursor-pointer"
                          >
                            Save Door
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                            <th className="py-2.5 px-3">Door Location Name</th>
                            <th className="py-2.5 px-3">Building / Area</th>
                            <th className="py-2.5 px-3 min-w-[240px]">
                              Corresponding BOM Line Item
                            </th>
                            <th className="py-2.5 px-3 min-w-[170px]">Installation Status</th>
                            <th className="py-2.5 px-3">Completed Date</th>
                            <th className="py-2.5 px-3">Installer Notes</th>
                            <th className="py-2.5 px-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {commonDoors.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400">
                                No common area doors logged yet. Click &quot;+ Add Door
                                Location&quot; above to add a door.
                              </td>
                            </tr>
                          ) : (
                            commonDoors.map((door) => (
                              <tr
                                key={door.id}
                                className="hover:bg-slate-50/70 transition-colors"
                              >
                                <td className="py-2.5 px-3 font-semibold text-slate-900">
                                  {door.doorName}
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">
                                  {door.buildingOrArea || 'Main Area'}
                                </td>
                                <td className="py-2.5 px-3">
                                  <select
                                    value={door.installedDeviceId || ''}
                                    onChange={(e) => {
                                      const selectedItem = selectedProject.bomItems.find(
                                        (i) => i.id === e.target.value
                                      );
                                      handleUpdateDoor(selectedProject, door.id, {
                                        installedDeviceId: e.target.value,
                                        installedDeviceName: selectedItem
                                          ? selectedItem.name
                                          : e.target.value
                                          ? 'Custom Hardware'
                                          : '',
                                      });
                                    }}
                                    className="w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer"
                                  >
                                    <option value="">-- Select Installed Device --</option>
                                    <optgroup label="Access Control & Locks BOM">
                                      {accessControlBOM.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.name} ({item.model})
                                        </option>
                                      ))}
                                    </optgroup>
                                    <optgroup label="All Project BOM Hardware">
                                      {selectedProject.bomItems
                                        .filter(
                                          (i) =>
                                            i.category !== 'Smart Access Control' &&
                                            i.category !== 'Common Area & Utilities'
                                        )
                                        .map((item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.name} ({item.category})
                                          </option>
                                        ))}
                                    </optgroup>
                                  </select>
                                </td>
                                <td className="py-2.5 px-3">
                                  <select
                                    value={door.installedStatus}
                                    onChange={(e) =>
                                      handleUpdateDoor(selectedProject, door.id, {
                                        installedStatus: e.target
                                          .value as CommonAreaDoor['installedStatus'],
                                        installedDate:
                                          e.target.value !== 'Pending'
                                            ? door.installedDate ||
                                              new Date().toISOString().split('T')[0]
                                            : undefined,
                                      })
                                    }
                                    className={`w-full text-xs font-bold rounded px-2 py-1 border focus:outline-none cursor-pointer ${
                                      door.installedStatus === 'Installed & Online'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : door.installedStatus === 'Wired & Calibrated'
                                        ? 'bg-sky-50 text-sky-800 border-sky-300'
                                        : door.installedStatus === 'Needs Service'
                                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                                        : 'bg-slate-50 text-slate-700 border-slate-300'
                                    }`}
                                  >
                                    <option value="Pending">⏳ Pending</option>
                                    <option value="Installed & Online">
                                      ✓ Installed &amp; Online
                                    </option>
                                    <option value="Wired & Calibrated">
                                      ⚡ Wired &amp; Calibrated
                                    </option>
                                    <option value="Needs Service">⚠ Needs Service</option>
                                  </select>
                                </td>
                                <td className="py-2.5 px-3">
                                  <input
                                    type="date"
                                    value={door.installedDate || ''}
                                    onChange={(e) =>
                                      handleUpdateDoor(selectedProject, door.id, {
                                        installedDate: e.target.value,
                                      })
                                    }
                                    className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700"
                                  />
                                </td>
                                <td className="py-2.5 px-3">
                                  <input
                                    type="text"
                                    placeholder="Latch verified, strike plate..."
                                    value={door.installerNotes || ''}
                                    onChange={(e) =>
                                      handleUpdateDoor(selectedProject, door.id, {
                                        installerNotes: e.target.value,
                                      })
                                    }
                                    className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:outline-none focus:border-sky-500"
                                  />
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDoor(selectedProject, door.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                    title="Remove door"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      {/* Quext White Theme Clean Footer matching App.tsx */}
      <footer className="border-t border-slate-200 bg-white py-5 pb-24 md:pb-5 mt-12 text-xs text-slate-500">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
              QUEXT
            </span>
            <span>·</span>
            <span>Multifamily IoT &amp; Smart Community Operations</span>
            <span>·</span>
            <span className="font-mono text-slate-500">myquext.com</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
            >
              Switch Field Tech Account
            </button>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>
              Logged in as: <strong className="text-slate-800">{techProfile.email}</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Fixed Thumb-Zone Bottom Navigation Bar for Field Techs on Mobile (md:hidden) */}
      <nav
        aria-label="Field Tech Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 grid grid-cols-5 gap-1"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('hub');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'hub'
              ? 'text-sky-700 bg-sky-50 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Activity</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (activeTab === 'hub' && assignedProjects[0]) {
              setActiveTab(assignedProjects[0].id);
            }
            setTimeout(() => {
              document.getElementById('sow-forecaster-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-slate-500 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <ClipboardList className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">SOW</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (activeTab === 'hub' && assignedProjects[0]) {
              setActiveTab(assignedProjects[0].id);
            }
            setTimeout(() => {
              document.getElementById('shipping-dock-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-slate-500 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Dock</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (activeTab === 'hub' && assignedProjects[0]) {
              setActiveTab(assignedProjects[0].id);
            }
            setTimeout(() => {
              document.getElementById('ft-installer-log')?.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-slate-500 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Logs</span>
        </button>

        <button
          type="button"
          onClick={onOpenLoginModal}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-slate-500 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <Users className="w-4 h-4 text-sky-600" />
          <span className="text-[10px] mt-0.5 truncate max-w-full">Account</span>
        </button>
      </nav>

      {/* Installers Clip Standalone In-The-Field Modal / App */}
      <InstallersClipModal
        isOpen={isInstallersClipOpen}
        onClose={() => setIsInstallersClipOpen(false)}
        projects={assignedProjects}
        onUpdateProject={onUpdateProject}
        initialProjectId={clipInitialProjectId}
        activeInstallerName={fieldTech}
        installerRole="field_tech"
        companyName="Quext Field Operations"
      />
    </div>
  );
};
