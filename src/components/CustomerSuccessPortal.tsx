import React, { useState, useMemo, useRef } from 'react';
import {
  OperationProject,
  CSMRiskTier,
  CSM_RISK_TIERS,
  CSM_DEFAULT_NOTE_TAGS,
  CSMContractScrubbedAnalysis,
  CSMPropertyNote,
  CSMRiskGroup,
  CSMResolutionPlan,
  isProjectInCustomerSuccessPortal,
  getCSMCalendarBookingProfile,
  getProjectPlatform,
  getPlatformBadgeStyle,
  getLockFinishSummaryTag,
  getLockFinishColorHex,
  formatFullFinishDetailsLines,
  getCategoryDisplayName,
  getCategoryUnitLabel,
  BOMItem,
  BOMAcquisitionSubmission,
  LockFinishConfig,
  ThermostatBrand,
  AVAILABLE_CSMS,
  CSMName,
  AVAILABLE_FIELD_TECHS,
  FieldTechName,
  normalizeFieldTech,
  getProjectIntegratorPartners,
  isDiyPartner,
  getPropertyManagementCompany,
} from '../types';
import { scrubContractDocumentWithAI } from '../services/contractScrubberService';
import { IntegratorPartnerSelector } from './IntegratorPartnerSelector';
import { RMATicketingSection } from './RMATicketingSection';
import { ChangeOrderSection } from './ChangeOrderSection';
import { SOWFormAutomationHub } from './SOWFormAutomationHub';
import { LockFinishModal } from './LockFinishModal';
import {
  Building2,
  Wrench,
  Users,
  Phone,
  Mail,
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search,
  Plus,
  Minus,
  Send,
  Tag,
  FolderGit2,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Check,
  X,
  Download,
  ExternalLink,
  Package,
  KeyRound,
  Wifi,
  Sliders,
  Layers,
  ClipboardCheck,
  UserCheck,
  FileSignature,
  Truck,
} from 'lucide-react';

interface CustomerSuccessPortalProps {
  projects: OperationProject[];
  onUpdateProject: (updated: OperationProject) => void;
  onOpenProjectInOperations: (projectId: string) => void;
  onGoToOperationsDashboard: () => void;
  currentUserName?: string;
}

export function getRiskTierBadgeStyle(tier: CSMRiskTier): {
  badge: string;
  border: string;
  bg: string;
  dot: string;
} {
  switch (tier) {
    case 'Critical - Escalation':
      return {
        badge: 'bg-rose-100 text-rose-900 border-rose-300',
        border: 'border-rose-300',
        bg: 'bg-rose-50/70',
        dot: 'bg-rose-600',
      };
    case 'Tier 1 - High Risk':
      return {
        badge: 'bg-orange-100 text-orange-900 border-orange-300',
        border: 'border-orange-300',
        bg: 'bg-orange-50/70',
        dot: 'bg-orange-500',
      };
    case 'Tier 2 - Moderate Risk':
      return {
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        border: 'border-amber-300',
        bg: 'bg-amber-50/70',
        dot: 'bg-amber-500',
      };
    case 'Tier 3 - Low Risk':
      return {
        badge: 'bg-sky-100 text-sky-900 border-sky-300',
        border: 'border-sky-200',
        bg: 'bg-sky-50/60',
        dot: 'bg-sky-500',
      };
    case 'None':
    default:
      return {
        badge: 'bg-slate-100 text-slate-700 border-slate-300',
        border: 'border-slate-200',
        bg: 'bg-slate-50',
        dot: 'bg-slate-400',
      };
  }
}

export const CustomerSuccessPortal: React.FC<CustomerSuccessPortalProps> = ({
  projects,
  onUpdateProject,
  onOpenProjectInOperations,
  onGoToOperationsDashboard,
  currentUserName = 'Raul Recalde',
}) => {
  // Properties that have CSM Handoff marked In Progress (or Completed)
  const handoffProperties = useMemo(() => {
    return projects.filter((p) => isProjectInCustomerSuccessPortal(p));
  }, [projects]);

  // Projects in Operations that have not yet had CSM Handoff marked In Progress
  const pendingOperationsProjects = useMemo(() => {
    return projects.filter((p) => !isProjectInCustomerSuccessPortal(p));
  }, [projects]);

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [csmFilter, setCsmFilter] = useState<string>('all');
  const [projectToTransitionId, setProjectToTransitionId] = useState<string>('');
  const [isSowModalOpen, setIsSowModalOpen] = useState<boolean>(false);
  const [sowTargetProperty, setSowTargetProperty] = useState<OperationProject | null>(null);

  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    return projects.find((p) => p.id === selectedPropertyId) || null;
  }, [projects, selectedPropertyId]);

  const filteredProperties = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return handoffProperties.filter((prop) => {
      const matchesCsm =
        csmFilter === 'all' ||
        (prop.assignedCSM || 'Nicole Franklin').toLowerCase() === csmFilter.toLowerCase();
      if (!matchesCsm) return false;
      if (!q) return true;
      const staffText = (prop.customerIntake?.staffRoles || [])
        .map((s) => `${s.firstName} ${s.lastName} ${s.email} ${s.roleOrTitle || ''}`)
        .join(' ')
        .toLowerCase();
      return (
        prop.propertyName.toLowerCase().includes(q) ||
        prop.clientName.toLowerCase().includes(q) ||
        getPropertyManagementCompany(prop).toLowerCase().includes(q) ||
        prop.city.toLowerCase().includes(q) ||
        prop.state.toLowerCase().includes(q) ||
        (prop.customerIntake?.communityEmail || '').toLowerCase().includes(q) ||
        staffText.includes(q)
      );
    });
  }, [handoffProperties, searchTerm, csmFilter]);

  // Mark a project's CSM Handoff milestone as In Progress so it brings the project over as a Property
  const handleMarkCsmHandoffInProgress = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const hasCsmMilestone = target.milestones.some(
      (m) => m.title === 'CSM Handoff' || m.title.toLowerCase().includes('csm handoff')
    );

    const updatedMilestones = hasCsmMilestone
      ? target.milestones.map((m) => {
          if (m.title === 'CSM Handoff' || m.title.toLowerCase().includes('csm handoff')) {
            return {
              ...m,
              status: 'In Progress' as const,
              startedAt: m.startedAt || todayStr,
            };
          }
          return m;
        })
      : [
          ...target.milestones,
          {
            id: `ms-csm-handoff-${Date.now()}`,
            title: 'CSM Handoff' as const,
            status: 'In Progress' as const,
            targetDate: todayStr,
            startedAt: todayStr,
          },
        ];

    onUpdateProject({
      ...target,
      milestones: updatedMilestones,
      csmHandoffEnteredAt: target.csmHandoffEnteredAt || todayStr,
      lastUpdated: new Date().toISOString(),
    });
    setProjectToTransitionId('');
    setSelectedPropertyId(target.id);
  };

  if (selectedProperty) {
    return (
      <>
        <CustomerSuccessPropertyDetailView
          property={selectedProperty}
          onBack={() => setSelectedPropertyId(null)}
          onUpdateProperty={onUpdateProject}
          onOpenInOperations={() => onOpenProjectInOperations(selectedProperty.id)}
          onOpenCreateSow={() => {
            setSowTargetProperty(selectedProperty);
            setIsSowModalOpen(true);
          }}
          currentUserName={currentUserName}
        />
        <SOWFormAutomationHub
          isOpen={isSowModalOpen}
          onClose={() => {
            setIsSowModalOpen(false);
            setSowTargetProperty(null);
          }}
          properties={handoffProperties}
          initialProperty={sowTargetProperty}
          currentUserName={currentUserName}
        />
      </>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Portal Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Customer Success Portal • Active Properties</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Inter_Tight',sans-serif] mt-2">
              Customer Success Properties ({handoffProperties.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Projects from the Operations tab automatically transition here as <strong>Properties</strong> when their{' '}
              <span className="font-semibold text-slate-900">CSM Handoff</span> milestone is marked{' '}
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[11px]">
                In Progress
              </span>
              . View up-front property contacts, consolidated Kickoff Walkthrough records, installed BOM counts, AI-scrubbed contracts, and the CSM Risk &amp; Note Engine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSowTargetProperty(null);
                setIsSowModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              title="Open the in-app Onsite Visit Scheduling and SOW Information Form to generate a ready-to-use SOW PDF & Partner Integrator / Vendor email"
            >
              <FileText className="w-4 h-4" />
              <span>Create SOW</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>{handoffProperties.length} Active Properties in CSM Workspace</span>
            </div>
          </div>
        </div>

        {/* Search, Filter & Quick Transition Bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties by name, client/owner, city, or staff contact..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={csmFilter}
              onChange={(e) => setCsmFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Assigned CSMs ({handoffProperties.length})</option>
              {AVAILABLE_CSMS.map((csm) => (
                <option key={csm} value={csm}>
                  CSM: {csm}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <select
              value={projectToTransitionId}
              onChange={(e) => setProjectToTransitionId(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 text-xs bg-indigo-50/60 border border-indigo-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
              title="Mark an Operations project's CSM Handoff milestone In Progress to bring it into Customer Success as a Property"
            >
              <option value="">
                + Bring Operations Project to CSM Handoff ({pendingOperationsProjects.length} in Ops)...
              </option>
              {pendingOperationsProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.propertyName} ({p.clientName})
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!projectToTransitionId}
              onClick={() => {
                if (projectToTransitionId) {
                  handleMarkCsmHandoffInProgress(projectToTransitionId);
                }
              }}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shrink-0 cursor-pointer transition-colors"
            >
              Mark In Progress
            </button>
          </div>
        </div>
      </div>

      {/* Onsite Visit Scheduling & SOW Creation Feature Banner on Customer Success Page */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-teal-500/30 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold">
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>Onsite Visit Scheduling &amp; SOW Information Form</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Create SOW &amp; Email Partner Integrator or Vendor
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Fill out the built-in 23-question Onsite Visit Scheduling and SOW Information Form directly inside the Customer Success Portal to generate a ready-to-use 2-page SOW PDF and formatted dispatch email for your Partner Integrator or Vendor.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSowTargetProperty(null);
              setIsSowModalOpen(true);
            }}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Create SOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Properties Portfolio List */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Properties Match Your Current Filter
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Projects from Operations automatically appear here as Properties once their{' '}
            <strong>CSM Handoff</strong> milestone is marked <strong>In Progress</strong>. Use the dropdown above or open a project in Operations to mark CSM Handoff In Progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProperties.map((property) => {
            const intake = property.customerIntake;
            const staffRoles = intake?.staffRoles || [];
            const primaryContact = staffRoles[0];
            const siteEmail =
              intake?.communityEmail ||
              intake?.subscriberEmail ||
              primaryContact?.email ||
              'Not provided in kickoff yet';
            const sitePhone =
              intake?.sitePhoneNumber ||
              primaryContact?.phoneNumber ||
              'Not provided in kickoff yet';

            const totalBomQty = property.bomItems.reduce((acc, item) => acc + item.quantity, 0);
            const totalInstalledQty = property.bomItems.reduce(
              (acc, item) => acc + item.installedCount,
              0
            );
            const installPct =
              totalBomQty > 0 ? Math.round((totalInstalledQty / totalBomQty) * 100) : 0;

            const csmData = property.csmPortalData;
            const notesCount = csmData?.csmNotes?.length || 0;
            const openRiskGroups = (csmData?.riskGroups || []).filter(
              (g) => g.resolutionPlan.issueStatus !== 'Resolved'
            );
            const contractsCount = csmData?.contracts?.length || 0;
            const csmMilestone = property.milestones.find(
              (m) => m.title === 'CSM Handoff' || m.title.toLowerCase().includes('csm handoff')
            );
            const platform = getProjectPlatform(property);
            const platformStyle = getPlatformBadgeStyle(platform);

            return (
              <div
                key={property.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPropertyId(property.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPropertyId(property.id);
                  }
                }}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Up-Front Header: Property Name, Client/Owner, Status Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Property • CSM Handoff {csmMilestone?.status || 'In Progress'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${platformStyle.badgeClass}`}
                        >
                          {platform}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {property.unitsCount} Units
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {property.propertyName}
                      </h2>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>
                          Client / Owner:{' '}
                          <strong className="text-slate-900">{property.clientName}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Property Mgmt Co.:{' '}
                          <strong className="text-indigo-900">
                            {getPropertyManagementCompany(property) || 'Not specified'}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          {property.address}, {property.city}, {property.state}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPropertyId(property.id);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <span>Open Property</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Up-Front Community Site Contact & Assigned CSM */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Community Site Contact
                      </div>
                      {primaryContact ? (
                        <div className="font-bold text-slate-900">
                          {primaryContact.firstName} {primaryContact.lastName}{' '}
                          <span className="text-[11px] font-normal text-slate-500">
                            ({primaryContact.roleOrTitle || primaryContact.permissionLevel})
                          </span>
                        </div>
                      ) : (
                        <div className="font-semibold text-slate-700">On-Site Management Office</div>
                      )}
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{siteEmail}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{sitePhone}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-3">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Customer Success, Field Tech &amp; Integrator
                      </div>
                      <div className="text-[11px] text-slate-700 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>
                          Assigned CSM:{' '}
                          <strong className="text-slate-900">
                            {property.assignedCSM || 'Nicole Franklin'}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Field Tech:{' '}
                          <strong className="text-sky-900">
                            {normalizeFieldTech(property.assignedFieldTech)}
                          </strong>
                        </span>
                      </div>
                      <div
                        className="pt-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          <IntegratorPartnerSelector
                            assignedPartners={getProjectIntegratorPartners(property)}
                            projectName={property.propertyName}
                            label="Integrator Partner / Installers:"
                            onChange={(updatedPartners) => {
                              onUpdateProject({
                                ...property,
                                integratorPartners: updatedPartners,
                                isDiyInstallation: updatedPartners.some(isDiyPartner),
                                lastUpdated: new Date().toISOString(),
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-700">
                        Installed BOM:{' '}
                        <strong className="text-emerald-700 font-mono">
                          {totalInstalledQty.toLocaleString()} / {totalBomQty.toLocaleString()}
                        </strong>{' '}
                        devices ({installPct}%)
                      </div>
                    </div>
                  </div>

                  {/* Up-Front Staff Members Provided in Kickoff Walkthrough */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>
                          Kickoff Walkthrough Staff Members ({staffRoles.length})
                        </span>
                      </span>
                      <span className="text-slate-400">
                        {intake?.commonAreaDoors?.length || 0} Common Area Doors
                      </span>
                    </div>

                    {staffRoles.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {staffRoles.slice(0, 4).map((staff) => (
                          <div
                            key={staff.id}
                            className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-slate-900 truncate">
                                {staff.firstName} {staff.lastName}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                                {staff.permissionLevel}
                              </span>
                            </div>
                            <div className="text-slate-500 truncate mt-0.5">
                              {staff.roleOrTitle || 'Property Staff'} • {staff.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
                        No staff members submitted in Kickoff Walkthrough document yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: CSM Portal Activity Indicators */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      <FileSignature className="w-3.5 h-3.5 text-indigo-600" />
                      <span>
                        {contractsCount} Contract{contractsCount === 1 ? '' : 's'} Uploaded
                      </span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {notesCount} CSM Note{notesCount === 1 ? '' : 's'}
                      </span>
                    </span>
                    {openRiskGroups.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[10px]">
                          {openRiskGroups.length} Active Risk Group{openRiskGroups.length === 1 ? '' : 's'}
                        </span>
                      </>
                    )}
                  </div>

                  <span className="text-emerald-700 group-hover:text-emerald-800 font-bold inline-flex items-center gap-1">
                    <span>Open Property Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SOWFormAutomationHub
        isOpen={isSowModalOpen}
        onClose={() => {
          setIsSowModalOpen(false);
          setSowTargetProperty(null);
        }}
        properties={handoffProperties}
        initialProperty={sowTargetProperty}
        currentUserName={currentUserName}
      />
    </div>
  );
};

// ============================================================================
// INDIVIDUAL PROPERTY DETAIL PAGE IN CUSTOMER SUCCESS PORTAL
// ============================================================================

interface CustomerSuccessPropertyDetailViewProps {
  property: OperationProject;
  onBack: () => void;
  onUpdateProperty: (updated: OperationProject) => void;
  onOpenInOperations: () => void;
  onOpenCreateSow: () => void;
  currentUserName: string;
}

const CustomerSuccessPropertyDetailView: React.FC<CustomerSuccessPropertyDetailViewProps> = ({
  property,
  onBack,
  onUpdateProperty,
  onOpenInOperations,
  onOpenCreateSow,
  currentUserName,
}) => {
  const intake = property.customerIntake;
  const staffRoles = intake?.staffRoles || [];
  const commonDoors = intake?.commonAreaDoors || [];
  const primaryContact = staffRoles[0];
  const csmProfile = getCSMCalendarBookingProfile(property.assignedCSM);

  const portalData = property.csmPortalData || {
    contracts: [],
    csmNotes: [],
    riskGroups: [],
  };

  const contracts = portalData.contracts || [];
  const csmNotes = portalData.csmNotes || [];
  const riskGroups = portalData.riskGroups || [];

  // BOM Installed vs Original Totals
  const totalOriginalBomQty = property.bomItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalInstalledBomQty = property.bomItems.reduce(
    (sum, item) => sum + item.installedCount,
    0
  );
  const overallInstalledPct =
    totalOriginalBomQty > 0 ? Math.round((totalInstalledBomQty / totalOriginalBomQty) * 100) : 0;

  // ==========================================================================
  // 1. CONTRACT UPLOAD & AI SCRUBBER STATE
  // ==========================================================================
  const contractFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isScrubbingContract, setIsScrubbingContract] = useState(false);
  const [scrubError, setScrubError] = useState<string | null>(null);
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  const [contractEditDraft, setContractEditDraft] = useState<CSMContractScrubbedAnalysis | null>(
    null
  );
  const [rmaPreselectedBomId, setRmaPreselectedBomId] = useState<string | null>(null);

  // Property BOM -> Product Acquisition Portal & Finish Options states
  const [activeLockFinishBomItem, setActiveLockFinishBomItem] = useState<BOMItem | null>(null);
  const [acquisitionModalBomItem, setAcquisitionModalBomItem] = useState<BOMItem | null>(null);
  const [acquisitionConfirmedQty, setAcquisitionConfirmedQty] = useState<number>(1);
  const [acquisitionModalNeededByDate, setAcquisitionModalNeededByDate] = useState<string>('');
  const [acquisitionNotes, setAcquisitionNotes] = useState<string>('');
  const [lastSentSubmission, setLastSentSubmission] = useState<BOMAcquisitionSubmission | null>(null);

  const handleUpdatePropertyBomLockFinish = (itemId: string, config?: LockFinishConfig) => {
    const updatedBomItems = property.bomItems.map((i) =>
      i.id === itemId ? { ...i, lockFinishConfig: config } : i
    );
    onUpdateProperty({
      ...property,
      bomItems: updatedBomItems,
      lastUpdated: new Date().toISOString(),
    });
    if (acquisitionModalBomItem && acquisitionModalBomItem.id === itemId) {
      setAcquisitionModalBomItem({
        ...acquisitionModalBomItem,
        lockFinishConfig: config,
      });
    }
  };

  const handleOpenPropertyBomAcquisitionModal = (item: BOMItem) => {
    setAcquisitionModalBomItem(item);
    setAcquisitionConfirmedQty(Math.max(1, item.quantity));
    setAcquisitionModalNeededByDate('');
    setAcquisitionNotes('');
  };

  const handleConfirmSendPropertyBomToAcquisition = () => {
    if (!acquisitionModalBomItem) return;
    const latestItem =
      property.bomItems.find((i) => i.id === acquisitionModalBomItem.id) || acquisitionModalBomItem;
    const existingSubmissions = property.bomAcquisitionSubmissions || [];
    const nextIdx = existingSubmissions.length + 1;
    const subNum = `ACQ-BOM-${property.quoteNumber.replace(/^QXT-/, '')}-${String(nextIdx).padStart(2, '0')}`;
    const qtyToSend = Math.max(1, Number(acquisitionConfirmedQty) || latestItem.quantity);
    const uPrice = latestItem.unitPrice || 0;
    const dispCategory = getCategoryDisplayName(latestItem.category);
    const isTherm = dispCategory === 'Smart Thermostats';
    const resolvedBrand: ThermostatBrand | undefined = isTherm
      ? latestItem.thermostatBrand ||
        (latestItem.name.toLowerCase().includes('honeywell') ? 'Honeywell' : 'Quext')
      : latestItem.thermostatBrand;

    const newSubmission: BOMAcquisitionSubmission = {
      id: `bom-acq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      submissionNumber: subNum,
      bomItemId: latestItem.id,
      name: latestItem.name,
      model: latestItem.model,
      category: latestItem.category,
      location: latestItem.location,
      description: latestItem.description,
      quotedQuantity: latestItem.quantity,
      installedCount: latestItem.installedCount,
      sparesCount: latestItem.sparesCount,
      confirmedQuantity: qtyToSend,
      unitPrice: uPrice,
      totalCost: Number((qtyToSend * uPrice).toFixed(2)),
      thermostatBrand: resolvedBrand,
      lockFinishConfig: latestItem.lockFinishConfig,
      neededByDate: acquisitionModalNeededByDate.trim() || undefined,
      notes: acquisitionNotes.trim() || undefined,
      sourceWorkspace: 'Property',
      sourceSectionLabel: 'Smart Community Bill of Materials (BOM)',
      itemType: 'Smart Community Bill of Materials (BOM)',
      fulfillmentStatus: 'Pending Acquisition / Review',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      createdBy: currentUserName || property.assignedCSM || 'Customer Success Manager',
    };

    onUpdateProperty({
      ...property,
      bomAcquisitionSubmissions: [newSubmission, ...existingSubmissions],
      lastUpdated: new Date().toISOString(),
    });

    setLastSentSubmission(newSubmission);
    setAcquisitionModalBomItem(null);
  };

  const handleContractFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScrubError(null);
    setIsScrubbingContract(true);
    try {
      const scrubbed = await scrubContractDocumentWithAI(
        file,
        property,
        currentUserName || property.assignedCSM || 'Customer Success Team'
      );
      const updatedContracts = [scrubbed, ...contracts];
      onUpdateProperty({
        ...property,
        csmPortalData: {
          ...portalData,
          contracts: updatedContracts,
          lastUpdatedAt: new Date().toISOString(),
        },
        lastUpdated: new Date().toISOString(),
      });
    } catch (err: any) {
      setScrubError(err?.message || 'Failed to scrub contract document.');
    } finally {
      setIsScrubbingContract(false);
      if (contractFileInputRef.current) {
        contractFileInputRef.current.value = '';
      }
    }
  };

  const handleSaveContractEdit = () => {
    if (!contractEditDraft) return;
    const updatedContracts = contracts.map((c) =>
      c.id === contractEditDraft.id ? contractEditDraft : c
    );
    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        contracts: updatedContracts,
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });
    setEditingContractId(null);
    setContractEditDraft(null);
  };

  const handleDeleteContract = (contractId: string) => {
    const updatedContracts = contracts.filter((c) => c.id !== contractId);
    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        contracts: updatedContracts,
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  // ==========================================================================
  // 2. CSM NOTE-TAKING ENGINE, MULTI-TAGGING & RISK GROUPING STATE
  // ==========================================================================
  const [noteAuthor, setNoteAuthor] = useState<string>(
    property.assignedCSM || currentUserName || 'Nicole Franklin'
  );
  const [noteText, setNoteText] = useState<string>('');
  const [noteRiskTier, setNoteRiskTier] = useState<CSMRiskTier>('None');
  const [noteSelectedTags, setNoteSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [noteAssignRiskGroupId, setNoteAssignRiskGroupId] = useState<string>('');
  const [includeNoteResolutionPlan, setIncludeNoteResolutionPlan] = useState<boolean>(false);
  const [noteResPlanSummary, setNoteResPlanSummary] = useState<string>('');
  const [noteResNextSteps, setNoteResNextSteps] = useState<string>('');
  const [noteResStatus, setNoteResStatus] = useState<'Open' | 'Resolution Plan Active' | 'Resolved'>(
    'Resolution Plan Active'
  );

  // Selection of a specific subset of notes to group into a Risk Level
  const [selectedNoteIdsForGrouping, setSelectedNoteIdsForGrouping] = useState<string[]>([]);
  const [isCreatingRiskGroup, setIsCreatingRiskGroup] = useState<boolean>(false);
  const [newGroupTitle, setNewGroupTitle] = useState<string>('');
  const [newGroupRiskTier, setNewGroupRiskTier] = useState<CSMRiskTier>('Tier 1 - High Risk');
  const [newGroupTags, setNewGroupTags] = useState<string[]>([]);
  const [newGroupPlanSummary, setNewGroupPlanSummary] = useState<string>('');
  const [newGroupNextSteps, setNewGroupNextSteps] = useState<string>('');
  const [newGroupStatus, setNewGroupStatus] = useState<
    'Open' | 'Resolution Plan Active' | 'Resolved'
  >('Open');
  const [newGroupTargetDate, setNewGroupTargetDate] = useState<string>('');

  // Editing an existing Risk Group's Resolution Plan / Next Steps / Contributing Notes
  const [editingRiskGroupId, setEditingRiskGroupId] = useState<string | null>(null);
  const [editingRiskGroupDraft, setEditingRiskGroupDraft] = useState<CSMRiskGroup | null>(null);

  // Editing an individual Note's Resolution Plan / Next Steps
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteDraft, setEditingNoteDraft] = useState<CSMPropertyNote | null>(null);

  // Filter CSM notes by tag or risk tier
  const [filterRiskTier, setFilterRiskTier] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');

  // Project History section filter tab
  const [projectHistoryTab, setProjectHistoryTab] = useState<
    | 'all'
    | 'sow'
    | 'doors'
    | 'installer_logs'
    | 'shipping'
    | 'bom_notes'
    | 'rma_tickets'
    | 'change_orders'
  >('all');

  // Selective Project Notes Browser & Transfer Modal State (Project notes only appear when CSM clicks this button)
  const [isProjectNotesBrowserOpen, setIsProjectNotesBrowserOpen] = useState<boolean>(false);
  const [selectedProjectNoteIdsToTransfer, setSelectedProjectNoteIdsToTransfer] = useState<
    string[]
  >([]);
  const [transferNotesRiskTier, setTransferNotesRiskTier] = useState<CSMRiskTier>('None');

  const projectNotes = useMemo(() => property.notes || [], [property.notes]);

  const alreadyTransferredProjectNoteIds = useMemo(() => {
    const set = new Set<string>();
    csmNotes.forEach((n) => {
      if (n.transferredFromProjectNoteId) {
        set.add(n.transferredFromProjectNoteId);
      }
    });
    return set;
  }, [csmNotes]);

  const handleToggleProjectNoteForTransfer = (projNoteId: string) => {
    setSelectedProjectNoteIdsToTransfer((prev) =>
      prev.includes(projNoteId) ? prev.filter((id) => id !== projNoteId) : [...prev, projNoteId]
    );
  };

  const handleTransferSelectedProjectNotes = () => {
    if (selectedProjectNoteIdsToTransfer.length === 0) return;

    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const notesToCopy = projectNotes.filter((pn) =>
      selectedProjectNoteIdsToTransfer.includes(pn.id)
    );
    if (notesToCopy.length === 0) return;

    const transferredCsmNotes: CSMPropertyNote[] = notesToCopy.map((pn, idx) => ({
      id: `csm-note-transferred-${property.id}-${Date.now()}-${idx}`,
      propertyId: property.id,
      author: `${pn.author} (Transferred Project Note)`,
      createdAt: `${nowFormatted} (Orig: ${pn.timestamp})`,
      text: pn.text,
      riskTier: transferNotesRiskTier,
      tags: [pn.category, 'Transferred Project Note'].filter(Boolean),
      transferredFromProjectNoteId: pn.id,
    }));

    const updatedNotes = [...transferredCsmNotes, ...csmNotes];
    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        csmNotes: updatedNotes,
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });

    setSelectedProjectNoteIdsToTransfer([]);
    setTransferNotesRiskTier('None');
    setIsProjectNotesBrowserOpen(false);
  };

  const allAvailableTags = useMemo(() => {
    const set = new Set<string>(CSM_DEFAULT_NOTE_TAGS);
    csmNotes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    riskGroups.forEach((g) => g.tags.forEach((t) => set.add(t)));
    noteSelectedTags.forEach((t) => set.add(t));
    return Array.from(set);
  }, [csmNotes, riskGroups, noteSelectedTags]);

  const handleToggleNoteTag = (tag: string) => {
    setNoteSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!noteSelectedTags.includes(trimmed)) {
      setNoteSelectedTags((prev) => [...prev, trimmed]);
    }
    setCustomTagInput('');
  };

  const handleCreateCsmNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newNoteId = `csm-note-${property.id}-${Date.now()}`;
    const newNote: CSMPropertyNote = {
      id: newNoteId,
      propertyId: property.id,
      author: noteAuthor.trim() || currentUserName,
      createdAt: nowFormatted,
      text: noteText.trim(),
      riskTier: noteRiskTier,
      tags: noteSelectedTags,
      riskGroupId: noteAssignRiskGroupId || undefined,
      resolutionPlan:
        includeNoteResolutionPlan || (noteRiskTier !== 'None' && (noteResPlanSummary.trim() || noteResNextSteps.trim()))
          ? {
              hasResolutionPlan: Boolean(noteResPlanSummary.trim()),
              issueStatus: noteResStatus,
              planSummary: noteResPlanSummary.trim(),
              nextSteps: noteResNextSteps.trim(),
              owner: noteAuthor.trim() || currentUserName,
              updatedAt: nowFormatted,
              updatedBy: noteAuthor.trim() || currentUserName,
            }
          : undefined,
    };

    const updatedNotes = [newNote, ...csmNotes];
    const updatedRiskGroups = noteAssignRiskGroupId
      ? riskGroups.map((g) =>
          g.id === noteAssignRiskGroupId && !g.contributingNoteIds.includes(newNoteId)
            ? { ...g, contributingNoteIds: [...g.contributingNoteIds, newNoteId] }
            : g
        )
      : riskGroups;

    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        csmNotes: updatedNotes,
        riskGroups: updatedRiskGroups,
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });

    setNoteText('');
    setNoteSelectedTags([]);
    setNoteRiskTier('None');
    setNoteAssignRiskGroupId('');
    setIncludeNoteResolutionPlan(false);
    setNoteResPlanSummary('');
    setNoteResNextSteps('');
  };

  const handleDeleteCsmNote = (noteId: string) => {
    const updatedNotes = csmNotes.filter((n) => n.id !== noteId);
    const updatedGroups = riskGroups.map((g) => ({
      ...g,
      contributingNoteIds: g.contributingNoteIds.filter((id) => id !== noteId),
    }));
    setSelectedNoteIdsForGrouping((prev) => prev.filter((id) => id !== noteId));
    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        csmNotes: updatedNotes,
        riskGroups: updatedGroups,
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSaveEditedNote = () => {
    if (!editingNoteDraft) return;
    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const updatedNote: CSMPropertyNote = {
      ...editingNoteDraft,
      updatedAt: nowFormatted,
      resolutionPlan: editingNoteDraft.resolutionPlan
        ? {
            ...editingNoteDraft.resolutionPlan,
            updatedAt: nowFormatted,
            updatedBy: currentUserName,
          }
        : undefined,
    };

    const updatedNotes = csmNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        csmNotes: updatedNotes,
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });
    setEditingNoteId(null);
    setEditingNoteDraft(null);
  };

  const handleToggleSelectNoteForGroup = (noteId: string) => {
    setSelectedNoteIdsForGrouping((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  };

  const handleCreateRiskGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;

    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Combine tags from selected notes + explicitly chosen tags
    const combinedTags = new Set<string>(newGroupTags);
    csmNotes
      .filter((n) => selectedNoteIdsForGrouping.includes(n.id))
      .forEach((n) => n.tags.forEach((t) => combinedTags.add(t)));

    const newGroupId = `risk-group-${property.id}-${Date.now()}`;
    const newGroup: CSMRiskGroup = {
      id: newGroupId,
      propertyId: property.id,
      title: newGroupTitle.trim(),
      riskTier: newGroupRiskTier,
      tags: Array.from(combinedTags),
      contributingNoteIds: selectedNoteIdsForGrouping,
      createdAt: nowFormatted,
      createdBy: noteAuthor || currentUserName,
      resolutionPlan: {
        hasResolutionPlan: Boolean(newGroupPlanSummary.trim()),
        issueStatus: newGroupStatus,
        planSummary: newGroupPlanSummary.trim(),
        nextSteps: newGroupNextSteps.trim(),
        owner: noteAuthor || currentUserName,
        targetResolutionDate: newGroupTargetDate || undefined,
        updatedAt: nowFormatted,
        updatedBy: noteAuthor || currentUserName,
      },
    };

    const updatedNotes = csmNotes.map((n) =>
      selectedNoteIdsForGrouping.includes(n.id)
        ? {
            ...n,
            riskGroupId: newGroupId,
            riskTier: n.riskTier === 'None' ? newGroupRiskTier : n.riskTier,
          }
        : n
    );

    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        csmNotes: updatedNotes,
        riskGroups: [newGroup, ...riskGroups],
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });

    setNewGroupTitle('');
    setNewGroupPlanSummary('');
    setNewGroupNextSteps('');
    setNewGroupTags([]);
    setSelectedNoteIdsForGrouping([]);
    setIsCreatingRiskGroup(false);
  };

  const handleSaveRiskGroupEdit = () => {
    if (!editingRiskGroupDraft) return;
    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedGroup: CSMRiskGroup = {
      ...editingRiskGroupDraft,
      resolutionPlan: {
        ...editingRiskGroupDraft.resolutionPlan,
        hasResolutionPlan: Boolean(editingRiskGroupDraft.resolutionPlan.planSummary.trim()),
        updatedAt: nowFormatted,
        updatedBy: currentUserName,
      },
    };

    const updatedGroups = riskGroups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g));
    const updatedNotes = csmNotes.map((n) => {
      if (updatedGroup.contributingNoteIds.includes(n.id)) {
        return { ...n, riskGroupId: updatedGroup.id };
      }
      if (n.riskGroupId === updatedGroup.id && !updatedGroup.contributingNoteIds.includes(n.id)) {
        return { ...n, riskGroupId: undefined };
      }
      return n;
    });

    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        csmNotes: updatedNotes,
        riskGroups: updatedGroups,
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });
    setEditingRiskGroupId(null);
    setEditingRiskGroupDraft(null);
  };

  const handleDeleteRiskGroup = (groupId: string) => {
    const updatedGroups = riskGroups.filter((g) => g.id !== groupId);
    const updatedNotes = csmNotes.map((n) =>
      n.riskGroupId === groupId ? { ...n, riskGroupId: undefined } : n
    );
    onUpdateProperty({
      ...property,
      csmPortalData: {
        ...portalData,
        csmNotes: updatedNotes,
        riskGroups: updatedGroups,
        lastUpdatedAt: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const filteredCsmNotes = useMemo(() => {
    return csmNotes.filter((n) => {
      if (filterRiskTier !== 'all' && n.riskTier !== filterRiskTier) return false;
      if (filterTag !== 'all' && !n.tags.includes(filterTag)) return false;
      return true;
    });
  }, [csmNotes, filterRiskTier, filterTag]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation & Property Identity Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="bg-gradient-to-r from-[#191E29] via-[#132D46] to-[#191E29] px-6 py-5 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Properties</span>
              </button>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#01C38D]/20 text-[#01C38D] border border-[#01C38D]/40">
                Customer Success Property
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-slate-200">
                {property.unitsCount} Residential Units
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {property.propertyName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-2">
              <span>
                Client / Owner: <strong className="text-white">{property.clientName}</strong>
              </span>
              <span>•</span>
              <span>
                Property Mgmt Co.:{' '}
                <strong className="text-[#01C38D]">
                  {getPropertyManagementCompany(property) || 'Not specified'}
                </strong>
              </span>
              <span>•</span>
              <span>
                {property.address}, {property.city}, {property.state}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenCreateSow}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              title="Fill out the Onsite Visit Scheduling and SOW Information Form for this property and generate a ready-to-send SOW email for the Partner Integrator or Vendor"
            >
              <FileText className="w-4 h-4" />
              <span>Create SOW</span>
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs">
              <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
                Assigned CSM
              </div>
              <div className="font-black text-[#01C38D]">{csmProfile.name}</div>
            </div>
          </div>
        </div>

        {/* Assigned Partner Integrator / Installers, Field Tech & CSM Assignment Strip */}
        <div className="px-5 sm:px-6 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2.5 text-xs">
          {/* Assigned CSM */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs">Assigned CSM:</span>
            <select
              value={property.assignedCSM || 'Nicole Franklin'}
              onChange={(e) => {
                onUpdateProperty({
                  ...property,
                  assignedCSM: e.target.value as CSMName,
                  lastUpdated: new Date().toISOString(),
                });
              }}
              className="font-bold text-emerald-900 bg-transparent focus:outline-none cursor-pointer text-xs"
            >
              {AVAILABLE_CSMS.map((csm) => (
                <option key={csm} value={csm}>
                  {csm}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Field Tech */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs">Field Tech:</span>
            <select
              value={normalizeFieldTech(property.assignedFieldTech)}
              onChange={(e) => {
                onUpdateProperty({
                  ...property,
                  assignedFieldTech: e.target.value as FieldTechName,
                  lastUpdated: new Date().toISOString(),
                });
              }}
              className="font-bold text-sky-900 bg-transparent focus:outline-none cursor-pointer text-xs"
            >
              {AVAILABLE_FIELD_TECHS.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Integrator Partner(s) / Installers */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <IntegratorPartnerSelector
              assignedPartners={getProjectIntegratorPartners(property)}
              projectName={property.propertyName}
              label="Integrator Partner / Installers:"
              onChange={(updatedPartners) => {
                onUpdateProperty({
                  ...property,
                  integratorPartners: updatedPartners,
                  isDiyInstallation: updatedPartners.some(isDiyPartner),
                  lastUpdated: new Date().toISOString(),
                });
              }}
            />
          </div>

          {/* Assigned PM */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs">Implementation PM:</span>
            <span className="font-bold text-slate-800 text-xs">{property.assignedPM.name}</span>
          </div>
        </div>

        {/* Up-Front Key Property Contacts & Ownership Summary Strip */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 border-b border-slate-200">
          {/* Card 1: Property, Client/Owner & Property Management Company */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Property, Client / Owner &amp; Mgmt Co.</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">{property.propertyName}</div>
            <div className="text-xs text-slate-700">
              Client / Owner: <strong className="text-slate-900">{property.clientName}</strong>
            </div>
            <div className="text-xs text-slate-700 flex items-center gap-1.5">
              <span className="shrink-0">Property Mgmt Co.:</span>
              <input
                type="text"
                value={getPropertyManagementCompany(property)}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateProperty({
                    ...property,
                    propertyManagementCompany: val,
                    customerIntake: {
                      ...(property.customerIntake || {
                        pmsSoftware: 'Yardi',
                        commonAreaDoors: [],
                        staffRoles: [],
                      }),
                      propertyManagementCompany: val,
                    },
                    lastUpdated: new Date().toISOString(),
                  });
                }}
                placeholder="Enter Property Mgmt Co. (Optional)..."
                className="flex-1 min-w-0 px-2 py-0.5 bg-indigo-50/70 hover:bg-indigo-50 focus:bg-white border border-indigo-200 focus:border-indigo-500 rounded font-bold text-indigo-950 placeholder:text-slate-400 placeholder:font-normal text-xs focus:outline-none"
                title="Property Management Company on this Property (synced with Project & Kickoff Walkthrough)"
              />
            </div>
            <div className="text-xs text-slate-500">
              {property.address}, {property.city}, {property.state} ({property.unitsCount} Units)
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Transitioned from PM: <strong className="text-slate-800">{property.assignedPM.name}</strong>
            </div>
          </div>

          {/* Card 2: Community Site Contact */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Community Site Contact</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {primaryContact
                ? `${primaryContact.firstName} ${primaryContact.lastName} (${
                    primaryContact.roleOrTitle || primaryContact.permissionLevel
                  })`
                : intake?.submittedBy || 'Community Management Office'}
            </div>
            <div className="text-xs text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {intake?.communityEmail ||
                  intake?.subscriberEmail ||
                  primaryContact?.email ||
                  'No community email entered yet'}
              </span>
            </div>
            <div className="text-xs text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>
                {intake?.sitePhoneNumber ||
                  primaryContact?.phoneNumber ||
                  'No site phone number entered yet'}
              </span>
            </div>
            {intake?.subscriberEmail && (
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                Digest Subscriber: <strong className="text-slate-800">{intake.subscriberEmail}</strong>
              </div>
            )}
          </div>

          {/* Card 3: Staff Roster & Installed Hardware Summary */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>On-Site Staff &amp; Hardware Status</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900">
              {staffRoles.length} Staff Member{staffRoles.length === 1 ? '' : 's'} Provided in Kickoff
            </div>
            <div className="text-xs text-slate-700">
              Installed Hardware:{' '}
              <strong className="text-emerald-700 font-mono">
                {totalInstalledBomQty.toLocaleString()} / {totalOriginalBomQty.toLocaleString()}
              </strong>{' '}
              devices ({overallInstalledPct}%)
            </div>
            <div className="text-xs text-slate-700">
              Common Area Doors:{' '}
              <strong className="text-slate-900">{commonDoors.length} Doors Configured</strong>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              Kickoff Walkthrough:{' '}
              <strong className={intake?.walkthroughCompleted ? 'text-emerald-700' : 'text-amber-700'}>
                {intake?.walkthroughCompleted ? '✓ Completed by Customer' : 'Pending Customer Completion'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: CONSOLIDATED SINGLE-SECTION KICKOFF WALKTHROUGH SUMMARY
      ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Unified Kickoff Walkthrough Record</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              Consolidated Kickoff Walkthrough Summary &amp; Staff Directory
            </h2>
            <p className="text-xs text-slate-500">
              All property contacts, staff members, PMS credentials, smart access settings, uploaded assets, and common area doors captured in the Kickoff Walkthrough document in a single view.
            </p>
          </div>
          {intake?.submittedAt && (
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0">
              Submitted: {intake.submittedAt}
            </span>
          )}
        </div>

        {/* Part A: All Staff Members Provided in the Kickoff Walkthrough Document */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>
              All Property Staff Members Provided in Kickoff Walkthrough ({staffRoles.length})
            </span>
          </h3>

          {staffRoles.length > 0 ? (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3.5">Staff Member Name</th>
                    <th className="py-2.5 px-3.5">Role / Title</th>
                    <th className="py-2.5 px-3.5">Permission Level</th>
                    <th className="py-2.5 px-3.5">Email Address</th>
                    <th className="py-2.5 px-3.5">Phone Number</th>
                    <th className="py-2.5 px-3.5">Doors / Access Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {staffRoles.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3.5 font-bold text-slate-900">
                        {staff.firstName} {staff.lastName}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700">
                        {staff.roleOrTitle || 'Property Staff'}
                      </td>
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            staff.permissionLevel === 'Manager'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : staff.permissionLevel === 'Staff'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {staff.permissionLevel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-sky-700 font-medium">{staff.email}</td>
                      <td className="py-2.5 px-3.5 text-slate-700">{staff.phoneNumber || '—'}</td>
                      <td className="py-2.5 px-3.5 text-slate-500">
                        {staff.doorsAccessRequested || 'All authorized community doors'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
              No staff members have been entered into the Kickoff Walkthrough document for this property yet.
            </div>
          )}
        </div>

        {/* Part B: Consolidated Kickoff Specifications Grid (PMS, Site Settings, Smart Upgrades, Uploaded Files) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              PMS Software &amp; Mgmt Company
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {intake?.pmsSoftware || property.communityDetails?.pmsSystem || 'Not Specified'}
            </div>
            <div className="text-[11px] text-slate-700">
              Property Mgmt Co.:{' '}
              <strong className="text-indigo-900">
                {getPropertyManagementCompany(property) || 'Not provided (Optional)'}
              </strong>
            </div>
            {intake?.pmsSoftware === 'Entrata' && intake.entrataCredentials ? (
              <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200/70">
                <div>
                  User: <strong className="font-mono">{intake.entrataCredentials.username || '—'}</strong>
                </div>
                <div className="truncate">
                  URL: <span className="font-mono">{intake.entrataCredentials.apiBaseUrl || '—'}</span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">
                PMS Notice Acknowledged: <strong>{intake?.pmsNoticeAcknowledged ? 'Yes' : 'Standard'}</strong>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Site Operations &amp; HVAC Settings
            </div>
            <div className="text-[11px] text-slate-700">
              Time Zone: <strong className="text-slate-900">{intake?.timeZone || 'Local Property Time'}</strong>
            </div>
            <div className="text-[11px] text-slate-700">
              Thermostat Range:{' '}
              <strong className="text-slate-900">
                {intake?.thermostatTempRange || 'Standard Vacant Setpoint'}
              </strong>
            </div>
            <div className="text-[11px] text-slate-700">
              Fire / Knox Keys:{' '}
              <strong className="text-slate-900">
                {intake?.fireKeysFobs || property.communityDetails?.masterFobsKnoxBox || 'Not specified'}
              </strong>
            </div>
            {intake?.priorityDating && (
              <div className="text-[11px] text-slate-700">
                Priority Dating: <strong className="text-slate-900">{intake.priorityDating}</strong>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              QR Intercom &amp; NFC Wallet Upgrades
            </div>
            <div className="text-[11px] text-slate-700 flex items-center justify-between">
              <span>QR Intercom:</span>
              <strong className="text-slate-900">
                {intake?.qrIntercomConfirmedByCustomer
                  ? intake.qrIntercomConfirmedByCustomer.toUpperCase()
                  : property.useQrIntercom
                  ? 'Enabled'
                  : 'No'}
              </strong>
            </div>
            {intake?.qrIntercomLogoName && (
              <div className="text-[11px] text-emerald-700 font-semibold truncate">
                Logo: {intake.qrIntercomLogoName}
              </div>
            )}
            <div className="text-[11px] text-slate-700 flex items-center justify-between pt-1 border-t border-slate-200/70">
              <span>NFC Wallet Pass:</span>
              <strong className="text-slate-900">
                {intake?.nfcWalletConfirmedByCustomer
                  ? intake.nfcWalletConfirmedByCustomer.toUpperCase()
                  : property.useNfcWallet
                  ? 'Enabled'
                  : 'No'}
              </strong>
            </div>
            {intake?.nfcCardArtPhotoName && (
              <div className="text-[11px] text-emerald-700 font-semibold truncate">
                Card Art: {intake.nfcCardArtPhotoName}
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Site Map PDF &amp; Custom Access Notes
            </div>
            <div className="text-[11px] text-slate-700">
              Site Plan PDF:{' '}
              {intake?.sitePlanPdfName ? (
                intake.sitePlanPdfDataUrl ? (
                  <a
                    href={intake.sitePlanPdfDataUrl}
                    download={intake.sitePlanPdfName}
                    className="font-bold text-sky-700 underline"
                  >
                    {intake.sitePlanPdfName}
                  </a>
                ) : (
                  <strong className="text-emerald-700">{intake.sitePlanPdfName}</strong>
                )
              ) : (
                <span className="text-slate-500">Not uploaded</span>
              )}
            </div>
            <div className="text-[11px] text-slate-700">
              Custom Groups / Notes:{' '}
              <span className="text-slate-900 font-medium">
                {intake?.customGroupsNotes || 'None specified'}
              </span>
            </div>
            {intake?.additionalCustomerEmails && intake.additionalCustomerEmails.length > 0 && (
              <div className="text-[11px] text-slate-600 truncate">
                CC Emails: {intake.additionalCustomerEmails.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Part C: Common Area Doors Captured in Kickoff Walkthrough */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>Common Area Doors Schedule ({commonDoors.length})</span>
            </h3>
            {intake?.doorsConfirmedByCustomer && (
              <span className="text-[11px] font-bold text-emerald-700">
                ✓ Door Names Confirmed by Customer
              </span>
            )}
          </div>

          {commonDoors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {commonDoors.map((door) => (
                <div
                  key={door.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{door.doorName}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {door.buildingOrArea || 'Common Area'}
                      {door.installedDeviceName ? ` • ${door.installedDeviceName}` : ''}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                      door.installedStatus === 'Installed & Online' ||
                      door.installedStatus === 'Wired & Calibrated'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {door.installedStatus}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
              No common area doors listed in Kickoff Walkthrough.
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: INSTALLED BOM LIST ITEMS (INSTALLED VS. ORIGINAL QUANTITY)
      ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              <span>Property Hardware Inventory</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              Installed BOM Line Items (Installed vs. Original BOM Quantity)
            </h2>
            <p className="text-xs text-slate-500">
              Reflects what has been installed at {property.propertyName} compared to the total quantity on each original BOM line item.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quext:open-product-acquisition-portal'));
              }}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Open the centralized Product Acquisition Portal"
            >
              <Package className="w-4 h-4" />
              <span>Product Acquisition Portal</span>
              {(property.bomAcquisitionSubmissions?.length || 0) > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                  {property.bomAcquisitionSubmissions?.length}
                </span>
              )}
            </button>
            <div className="px-4 py-2.5 rounded-xl bg-slate-900 text-white flex items-center gap-4 shrink-0">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Installed / Original BOM Total
                </div>
                <div className="text-base font-black font-mono text-[#01C38D]">
                  {totalInstalledBomQty.toLocaleString()} / {totalOriginalBomQty.toLocaleString()}{' '}
                  <span className="text-xs text-white font-sans font-bold">
                    ({overallInstalledPct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {lastSentSubmission && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Sent <strong>{lastSentSubmission.confirmedQuantity}x {lastSentSubmission.name}</strong> ({lastSentSubmission.submissionNumber}) to the <strong>Product Acquisition Portal</strong> with full product &amp; finish details.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('quext:open-product-acquisition-portal'));
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View in Product Acquisition Portal</span>
              </button>
              <button
                type="button"
                onClick={() => setLastSentSubmission(null)}
                className="p-1 rounded text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">BOM Hardware Line Item</th>
                <th className="py-3 px-4">Category &amp; Location</th>
                <th className="py-3 px-4 text-right">Installed Quantity</th>
                <th className="py-3 px-4 text-right">Original BOM Quantity</th>
                <th className="py-3 px-4">Installed vs. Original Progress</th>
                <th className="py-3 px-4 text-right">RMA &amp; Product Acquisition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {property.bomItems.map((item) => {
                const pct =
                  item.quantity > 0
                    ? Math.min(100, Math.round((item.installedCount / item.quantity) * 100))
                    : 0;
                const finishSummary = getLockFinishSummaryTag(item.lockFinishConfig);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Model: {item.model}
                        {item.thermostatBrand ? ` • ${item.thermostatBrand}` : ''}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {finishSummary && (
                          <div className="inline-flex items-center gap-1 text-[10px] text-white bg-slate-900 border border-slate-700 rounded-full px-2 py-0.5 font-semibold">
                            <span
                              className="w-2 h-2 rounded-full border border-white/50 shrink-0"
                              style={{
                                backgroundColor: getLockFinishColorHex(
                                  item.lockFinishConfig?.befeColorFinish ||
                                    item.lockFinishConfig?.ndeColorFinish ||
                                    item.lockFinishConfig?.xe360ColorFinish
                                ),
                              }}
                            />
                            <span>{finishSummary}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveLockFinishBomItem(item)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 cursor-pointer transition-colors"
                          title="Configure or edit finish options for this BOM item"
                        >
                          🎨 {item.lockFinishConfig ? 'Edit Finish' : '+ Finish Options'}
                        </button>
                      </div>

                      {/* Acquisition Status & Milestones */}
                      {(() => {
                        const acqSub = (property.bomAcquisitionSubmissions || []).find(
                          (s) => s.bomItemId === item.id
                        );
                        if (!acqSub) return null;
                        const acqUid = `bom::${property.id}::${acqSub.id}`;
                        const acqMilestone = property.acquisitionMilestones?.[acqUid];
                        const isShipped = !!(acqMilestone?.isShipped ?? acqSub.isShipped ?? (acqSub.fulfillmentStatus === 'In Transit / Shipped'));
                        const isArrived = !!(acqMilestone?.isArrivedToWarehouse ?? acqSub.isArrivedToWarehouse);
                        const isOrdered = !!(acqMilestone?.isOrdered ?? acqSub.isOrdered ?? (acqSub.fulfillmentStatus === 'PO Submitted / Ordered'));
                        const trackNum = acqMilestone?.trackingNumber || acqSub.trackingNumber || acqSub.poOrTrackingNumber;
                        const neededBy = acqMilestone?.neededByDate || acqSub.neededByDate;

                        return (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 animate-fadeIn">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                isShipped
                                  ? 'bg-sky-100 text-sky-950 border-sky-300'
                                  : isArrived
                                  ? 'bg-teal-100 text-teal-950 border-teal-300'
                                  : isOrdered
                                  ? 'bg-indigo-100 text-indigo-950 border-indigo-300'
                                  : 'bg-emerald-50 text-emerald-950 border-emerald-300'
                              }`}
                            >
                              <Package className="w-3 h-3 text-emerald-700" />
                              <span>
                                Acquisition Portal:{' '}
                                {isShipped
                                  ? 'Shipped'
                                  : isArrived
                                  ? 'Arrived to Warehouse'
                                  : isOrdered
                                  ? 'Ordered'
                                  : 'In Queue'}
                              </span>
                              {trackNum && (
                                <span className="font-mono font-bold bg-white px-2 py-0.2 rounded text-[10px] text-sky-900 border border-sky-300 flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-sky-600" />
                                  <span>Tracking: {trackNum}</span>
                                </span>
                              )}
                            </span>
                            {neededBy && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-950 border border-amber-300">
                                <Calendar className="w-3 h-3 text-amber-600" />
                                <span>Needed by: {neededBy}</span>
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{item.category}</div>
                      <div className="text-[11px] text-slate-500">{item.location}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-black text-sm">
                        {item.installedCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-mono font-bold text-sm">
                        {item.quantity.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 min-w-[200px]">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className="font-mono text-slate-900">
                          {item.installedCount.toLocaleString()} of {item.quantity.toLocaleString()}{' '}
                          installed
                        </span>
                        <span
                          className={
                            pct >= 100
                              ? 'text-emerald-700'
                              : pct > 0
                              ? 'text-sky-700'
                              : 'text-slate-400'
                          }
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 100 ? 'bg-emerald-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setRmaPreselectedBomId(item.id);
                            setTimeout(() => {
                              document
                                .getElementById('rma-ticketing-workflow')
                                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 80);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold cursor-pointer transition-colors"
                          title={`Select ${item.name} in the RMA Ticketing Workflow`}
                        >
                          <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                          <span>RMA Ticket</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Property BOM Lock Finish Modal */}
        {activeLockFinishBomItem && (
          <LockFinishModal
            item={activeLockFinishBomItem}
            isOpen={!!activeLockFinishBomItem}
            onClose={() => setActiveLockFinishBomItem(null)}
            onSave={(itemId, config) => {
              handleUpdatePropertyBomLockFinish(itemId, config);
            }}
          />
        )}

        {/* Property BOM -> Send to Product Acquisition Confirmation Modal */}
        {acquisitionModalBomItem && (() => {
          const liveItem =
            property.bomItems.find((i) => i.id === acquisitionModalBomItem.id) ||
            acquisitionModalBomItem;
          const unitLabel = getCategoryUnitLabel(liveItem.category, liveItem);
          const dispCategory = getCategoryDisplayName(liveItem.category);
          const remainingQty = Math.max(0, liveItem.quantity - liveItem.installedCount);
          const totalWithSpares = liveItem.quantity + (liveItem.sparesCount || 0);
          const finishLines = formatFullFinishDetailsLines(liveItem.lockFinishConfig, liveItem);
          const unitPrice = liveItem.unitPrice || 0;
          const estTotal = Math.max(1, Number(acquisitionConfirmedQty) || 1) * unitPrice;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
                <div className="bg-emerald-950 text-white p-4 sm:p-5 flex items-start justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">
                          Send BOM Line Item to Product Acquisition Portal
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                          Property Page · Smart Community BOM
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/90 mt-0.5">
                        Confirm the quantity to send and verify full product &amp; finish specifications
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAcquisitionModalBomItem(null)}
                    className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
                  <div className="p-4 rounded-xl bg-emerald-50/80 border-2 border-emerald-300 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                          1. Confirm Quantity to Send to Product Acquisition *
                        </label>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          Specify how many units of <strong>{liveItem.name}</strong> should be queued in the Product Acquisition Portal.
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setAcquisitionConfirmedQty(Math.max(1, acquisitionConfirmedQty - 1))
                          }
                          className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={acquisitionConfirmedQty}
                          onChange={(e) =>
                            setAcquisitionConfirmedQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                          }
                          className="w-24 text-center py-1.5 px-2 bg-white border-2 border-emerald-500 rounded-lg font-mono font-extrabold text-sm text-emerald-950 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setAcquisitionConfirmedQty(acquisitionConfirmedQty + 1)}
                          className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/80">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        Quick Presets:
                      </span>
                      <button
                        type="button"
                        onClick={() => setAcquisitionConfirmedQty(Math.max(1, liveItem.quantity))}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                          acquisitionConfirmedQty === liveItem.quantity
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        Full Quoted Qty ({liveItem.quantity} {unitLabel})
                      </button>
                      {remainingQty > 0 && remainingQty !== liveItem.quantity && (
                        <button
                          type="button"
                          onClick={() => setAcquisitionConfirmedQty(remainingQty)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                            acquisitionConfirmedQty === remainingQty
                              ? 'bg-emerald-700 text-white border-emerald-800'
                              : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          Remaining Uninstalled ({remainingQty} {unitLabel})
                        </button>
                      )}
                      {(liveItem.sparesCount || 0) > 0 && (
                        <button
                          type="button"
                          onClick={() => setAcquisitionConfirmedQty(totalWithSpares)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                            acquisitionConfirmedQty === totalWithSpares
                              ? 'bg-emerald-700 text-white border-emerald-800'
                              : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          Quoted + Spares ({totalWithSpares} {unitLabel})
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                        2. Full Product Specifications (Included in Portal Intake)
                      </span>
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Est. Value: ${estTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Product Name</span>
                        <span className="font-bold text-slate-900 text-xs">{liveItem.name}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Model / SKU</span>
                        <span className="font-mono font-bold text-slate-800 text-xs">{liveItem.model}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Category</span>
                        <span className="font-semibold text-slate-800 text-xs">{dispCategory}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Location / Scope</span>
                        <span className="font-semibold text-slate-800 text-xs">{liveItem.location || 'Property-wide'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-sky-400" />
                        <div>
                          <span className="text-xs font-bold text-sky-300 block">
                            3. Product Finish &amp; Hardware Options Included
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Full finish options (trim, color finish, lever style, grade, function, or split finishes) travel with this item
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveLockFinishBomItem(liveItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold cursor-pointer"
                      >
                        <span>🎨 {liveItem.lockFinishConfig ? 'Edit Finish Options' : '+ Set Finish Options'}</span>
                      </button>
                    </div>

                    {liveItem.lockFinishConfig ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-sky-200">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                            style={{
                              backgroundColor: getLockFinishColorHex(
                                liveItem.lockFinishConfig.befeColorFinish ||
                                  liveItem.lockFinishConfig.ndeColorFinish ||
                                  liveItem.lockFinishConfig.xe360ColorFinish
                              ),
                            }}
                          />
                          <span>{getLockFinishSummaryTag(liveItem.lockFinishConfig)}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {finishLines.map((line, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] text-slate-200 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono"
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
                        <span>
                          No custom finish configuration attached yet (Standard factory finish will be listed unless configured).
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveLockFinishBomItem(liveItem)}
                          className="text-sky-400 hover:text-sky-300 font-bold underline shrink-0 cursor-pointer"
                        >
                          Configure Finish Now
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Date Picker: When is this product needed by? */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>When is this product needed by? *</span>
                    </label>
                    <p className="text-[11px] text-amber-900">
                      Set the required on-site or delivery date so the Product Acquisition team can prioritize procurement and tracking.
                    </p>
                    <input
                      type="date"
                      value={acquisitionModalNeededByDate}
                      onChange={(e) => setAcquisitionModalNeededByDate(e.target.value)}
                      className="w-full sm:w-64 px-3 py-2 text-xs font-semibold bg-white border border-amber-400 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Acquisition / Fulfillment Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={acquisitionNotes}
                      onChange={(e) => setAcquisitionNotes(e.target.value)}
                      placeholder="Add any shipping priority, phase allocation, or special procurement instructions..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                  <div className="text-[11px] text-slate-500">
                    Tagged as: <strong className="text-slate-800">Property Page</strong> ·{' '}
                    <strong className="text-emerald-700">Smart Community Bill of Materials (BOM)</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAcquisitionModalBomItem(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmSendPropertyBomToAcquisition}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm &amp; Send {acquisitionConfirmedQty} {unitLabel} to Acquisition Portal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* =====================================================================
          SECTION 2A: CHANGE ORDER WORKFLOW (SEPARATE FROM ORIGINAL BOM)
      ===================================================================== */}
      <ChangeOrderSection
        project={property}
        onUpdateProject={onUpdateProperty}
        currentUserName={currentUserName || property.assignedCSM || 'Customer Success Manager'}
        contextLabel="Property"
      />

      {/* =====================================================================
          SECTION 2B: PROPERTY HARDWARE RMA TICKETING WORKFLOW
      ===================================================================== */}
      <RMATicketingSection
        project={property}
        onUpdateProject={onUpdateProperty}
        currentUserName={currentUserName}
        preselectedBomItemId={rmaPreselectedBomId}
        onClearPreselectedBomItem={() => setRmaPreselectedBomId(null)}
        contextLabel="Property"
      />

      {/* =====================================================================
          SECTION 2C: PROJECT HISTORY (HIGHLIGHTS OF EACH SECTION'S ITEMS & NOTES TRANSFERRED TO PROPERTIES + RMA TICKETS & CHANGE ORDERS)
      ===================================================================== */}
      {(() => {
        const sowItems = property.sowForecastItems || [];
        const doorItems = property.customerIntake?.commonAreaDoors || [];
        const installLogs = property.installLogs || [];
        const shippingItems = property.shippingDockItems || [];
        const acceptanceSubmission = property.productAcceptanceSubmission;
        const bomItemsWithNotes = (property.bomItems || []).filter(
          (b) =>
            (b.postItLogs && b.postItLogs.length > 0) ||
            Boolean(b.description && b.description.trim()) ||
            installLogs.some((l) => l.itemId === b.id && (l.notes?.trim() || l.itemNotes?.trim()))
        );
        const rmaTickets = property.rmaTickets || [];
        const changeOrders = property.changeOrders || [];

        const tabs: {
          id:
            | 'all'
            | 'sow'
            | 'doors'
            | 'installer_logs'
            | 'shipping'
            | 'bom_notes'
            | 'rma_tickets'
            | 'change_orders';
          label: string;
          count: number;
        }[] = [
          {
            id: 'all',
            label: 'All Project History',
            count:
              sowItems.length +
              doorItems.length +
              installLogs.length +
              shippingItems.length +
              bomItemsWithNotes.length +
              rmaTickets.length +
              changeOrders.length,
          },
          { id: 'sow', label: 'SOW Forecaster', count: sowItems.length },
          {
            id: 'doors',
            label: 'Common Area Doors & Device Mapping',
            count: doorItems.length,
          },
          {
            id: 'installer_logs',
            label: 'Installer Completion & Verification Log',
            count: installLogs.length,
          },
          { id: 'shipping', label: 'Shipping Dock', count: shippingItems.length },
          {
            id: 'bom_notes',
            label: 'Smart Community BOM Notes',
            count: bomItemsWithNotes.length,
          },
          { id: 'rma_tickets', label: 'RMA Tickets', count: rmaTickets.length },
          { id: 'change_orders', label: 'Change Orders', count: changeOrders.length },
        ];

        const showSection = (
          key:
            | 'sow'
            | 'doors'
            | 'installer_logs'
            | 'shipping'
            | 'bom_notes'
            | 'rma_tickets'
            | 'change_orders'
        ) => projectHistoryTab === 'all' || projectHistoryTab === key;

        return (
          <div
            id="property-project-history"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-sky-900 bg-sky-100 border border-sky-300 px-2.5 py-0.5 rounded-md">
                  <Layers className="w-3.5 h-3.5 text-sky-700" />
                  <span>Transferred Implementation Record</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  Project History
                </h2>
                <p className="text-xs text-slate-500">
                  Highlights of each section&apos;s items and their notes transferred to{' '}
                  <strong>{property.propertyName}</strong> from the SOW Forecaster, Common Area
                  Doors Location Tree &amp; Device Mapping, Installer Completion &amp; Verification
                  Log, Shipping Dock, and Smart Community Bill of Materials (BOM) notes, plus all
                  documented RMA Tickets and Change Orders.
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const active = projectHistoryTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProjectHistoryTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-5">
              {/* 1. SOW Forecaster Highlights & Notes */}
              {showSection('sow') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <span>1. SOW Forecaster Highlights &amp; Notes ({sowItems.length})</span>
                    </h3>
                  </div>

                  {sowItems.length === 0 ? (
                    <div className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                      No SOW Forecaster items logged on the project yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sowItems.map((sow) => (
                        <div
                          key={sow.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-extrabold text-slate-900">
                              {sow.bomItemNames && sow.bomItemNames.length > 0
                                ? sow.bomItemNames.join(', ')
                                : sow.bomItemName}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                                sow.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : sow.status === 'In Progress'
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {sow.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5">
                            <span>
                              Area: <strong>{sow.buildingOrArea || 'Property-Wide'}</strong>
                            </span>
                            <span>
                              Forecasted Qty: <strong className="font-mono">{sow.forecastedQuantity}</strong>
                            </span>
                            <span>
                              Installer: <strong>{sow.assignedInstaller}</strong>
                            </span>
                            <span>
                              Dates:{' '}
                              <strong className="font-mono">
                                {sow.scheduledStartDate} → {sow.scheduledEndDate}
                              </strong>
                            </span>
                          </div>
                          {(sow.workDescription || sow.notes) && (
                            <div className="pt-1.5 border-t border-slate-100 space-y-1 text-[11px]">
                              {sow.workDescription && (
                                <div className="text-slate-700">
                                  <span className="font-bold text-slate-900">Scope / Work Note:</span>{' '}
                                  {sow.workDescription}
                                </div>
                              )}
                              {sow.notes && (
                                <div className="text-slate-700">
                                  <span className="font-bold text-slate-900">SOW Note:</span>{' '}
                                  {sow.notes}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Common Area Doors Location Tree & Device Mapping Highlights & Notes */}
              {showSection('doors') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      <span>
                        2. Common Area Doors Location Tree &amp; Device Mapping ({doorItems.length})
                      </span>
                    </h3>
                  </div>

                  {doorItems.length === 0 ? (
                    <div className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                      No common area doors mapped on the project yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {doorItems.map((door) => (
                        <div
                          key={door.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-extrabold text-slate-900">{door.doorName}</div>
                              <div className="text-[11px] text-slate-500">
                                {door.buildingOrArea || 'Common Area'}
                              </div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                                door.installedStatus === 'Installed & Online' ||
                                door.installedStatus === 'Wired & Calibrated'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : door.installedStatus === 'Needs Service'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {door.installedStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700">
                            Mapped Device:{' '}
                            <strong className="text-slate-900">
                              {door.installedDeviceName || 'Unassigned'}
                            </strong>
                            {door.installedDate ? ` • Completed: ${door.installedDate}` : ''}
                          </div>
                          {door.installerNotes && (
                            <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-700">
                              <span className="font-bold text-slate-900">Door Installer Note:</span>{' '}
                              {door.installerNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Installer Completion & Verification Log Highlights & Notes */}
              {showSection('installer_logs') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                      <span>
                        3. Installer Completion &amp; Verification Log Highlights &amp; Notes (
                        {installLogs.length})
                      </span>
                    </h3>
                  </div>

                  {installLogs.length === 0 ? (
                    <div className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                      No installer completion logs recorded on the project yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {installLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-extrabold text-slate-900">
                                {log.itemName}{' '}
                                <span className="text-emerald-700 font-mono">
                                  (+{log.quantityCompleted} Installed)
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">
                                By <strong>{log.installerName}</strong> • {log.timestamp} •{' '}
                                {log.locationCompleted}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">
                              {log.statusCheck}
                            </span>
                          </div>
                          {(log.notes || log.itemNotes) && (
                            <div className="pt-1.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-700">
                              {log.notes && (
                                <div>
                                  <span className="font-bold text-slate-900">Verification Note:</span>{' '}
                                  {log.notes}
                                </div>
                              )}
                              {log.itemNotes && (
                                <div>
                                  <span className="font-bold text-slate-900">BOM Item Note:</span>{' '}
                                  {log.itemNotes}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Shipping Dock Highlights & Notes */}
              {showSection('shipping') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-amber-600" />
                      <span>
                        4. Shipping Dock Highlights &amp; Notes ({shippingItems.length} Shipments)
                      </span>
                    </h3>
                  </div>

                  {acceptanceSubmission && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1">
                      <div className="font-extrabold text-emerald-950">
                        ✓ Product Acceptance Signed by {acceptanceSubmission.signedByName} (
                        {acceptanceSubmission.signedByTitle}) on {acceptanceSubmission.signedAt}
                      </div>
                      {acceptanceSubmission.stagingLocation && (
                        <div className="text-[11px] text-emerald-900">
                          Staging Location: <strong>{acceptanceSubmission.stagingLocation}</strong>
                        </div>
                      )}
                      {acceptanceSubmission.overallDeliveryNotes && (
                        <div className="text-[11px] text-emerald-900">
                          <strong>Delivery Acceptance Notes:</strong>{' '}
                          {acceptanceSubmission.overallDeliveryNotes}
                        </div>
                      )}
                    </div>
                  )}

                  {shippingItems.length === 0 ? (
                    <div className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                      No Shipping Dock shipments logged on the project yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {shippingItems.map((ship) => (
                        <div
                          key={ship.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-extrabold text-slate-900">
                                {ship.shipmentBatchLabel}:{' '}
                                {ship.bomItemNames && ship.bomItemNames.length > 0
                                  ? ship.bomItemNames.join(', ')
                                  : ship.bomItemName}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Carrier: {ship.carrier} • Tracking: {ship.trackingNumber}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold shrink-0">
                              {ship.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700 flex flex-wrap gap-x-3 gap-y-0.5">
                            <span>
                              Shipped Qty: <strong className="font-mono">{ship.shippedQuantity}</strong>
                            </span>
                            <span>
                              Shipped: <strong className="font-mono">{ship.shippedDate}</strong>
                            </span>
                            <span>
                              ETA: <strong className="font-mono">{ship.estimatedArrivalDate}</strong>
                            </span>
                            {ship.integratorName && (
                              <span>
                                Recipient: <strong>{ship.integratorName}</strong>
                              </span>
                            )}
                          </div>
                          {ship.customerScenarioNotes && (
                            <div className="pt-1.5 border-t border-slate-100 text-[11px] text-slate-700">
                              <span className="font-bold text-slate-900">Shipping Dock Note:</span>{' '}
                              {ship.customerScenarioNotes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Smart Community Bill of Materials (BOM) Notes */}
              {showSection('bom_notes') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>
                        5. Smart Community Bill of Materials (BOM) Notes ({bomItemsWithNotes.length}{' '}
                        Items with Notes)
                      </span>
                    </h3>
                  </div>

                  {bomItemsWithNotes.length === 0 ? (
                    <div className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                      No row notes or post-it logs recorded on individual BOM line items yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {bomItemsWithNotes.map((item) => {
                        const rowLogs = [
                          ...(item.postItLogs || []),
                          ...installLogs.filter(
                            (l) =>
                              l.itemId === item.id &&
                              !(item.postItLogs || []).some((p) => p.id === l.id) &&
                              (l.notes?.trim() || l.itemNotes?.trim())
                          ),
                        ];
                        return (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-extrabold text-slate-900">{item.name}</div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  Model: {item.model} • Location: {item.location}
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold shrink-0">
                                {item.installedCount} / {item.quantity} Installed
                              </span>
                            </div>

                            {item.description && (
                              <div className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                                <span className="font-bold text-slate-900">BOM Description / Spec:</span>{' '}
                                {item.description}
                              </div>
                            )}

                            {rowLogs.length > 0 && (
                              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                {rowLogs.map((rl) => (
                                  <div
                                    key={rl.id}
                                    className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-slate-800 space-y-0.5"
                                  >
                                    <div className="font-bold text-amber-950">
                                      {rl.installerName} • {rl.timestamp} (+{rl.quantityCompleted}{' '}
                                      at {rl.locationCompleted})
                                    </div>
                                    {rl.itemNotes && <div>{rl.itemNotes}</div>}
                                    {rl.notes && rl.notes !== rl.itemNotes && <div>{rl.notes}</div>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 6. Documented RMA Tickets */}
              {showSection('rma_tickets') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-rose-600" />
                      <span>6. Documented RMA Tickets ({rmaTickets.length})</span>
                    </h3>
                  </div>

                  {rmaTickets.length === 0 ? (
                    <div className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                      No RMA tickets have been created for this property yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rmaTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                                {ticket.ticketNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                                {ticket.matchedCompany}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-200 text-[10px] font-bold">
                              {ticket.status}
                            </span>
                          </div>
                          <div className="font-extrabold text-slate-900">
                            {ticket.bomItemName} ({ticket.bomItemModel}) — Qty:{' '}
                            {ticket.defectiveQuantity}
                          </div>
                          <div className="text-[11px] text-slate-600 font-mono">
                            RMA #: {ticket.issuedRmaNumber || 'Pending'} • SN:{' '}
                            {ticket.serialNumbers || 'Pending'} • Created by {ticket.createdBy} (
                            {ticket.createdAt})
                          </div>
                          {(ticket.trackingNumber ||
                            ticket.returnTrackingNumber ||
                            property.acquisitionMilestones?.[`rma::${property.id}::${ticket.id}`]?.trackingNumber) && (
                            <div className="pt-0.5">
                              <span className="inline-flex items-center gap-1 font-mono font-bold text-sky-900 bg-sky-50 border border-sky-300 px-2 py-0.5 rounded text-[11px]">
                                <Truck className="w-3.5 h-3.5 text-sky-600" />
                                <span>
                                  Tracking #: {ticket.trackingNumber ||
                                    ticket.returnTrackingNumber ||
                                    property.acquisitionMilestones?.[`rma::${property.id}::${ticket.id}`]?.trackingNumber}
                                </span>
                              </span>
                            </div>
                          )}
                          <div className="pt-1.5 border-t border-slate-100 space-y-1 text-[11px] text-slate-700">
                            <div>
                              <span className="font-bold text-slate-900">Failure Description:</span>{' '}
                              {ticket.failureDescription || '—'}
                            </div>
                            {ticket.troubleshootingNotes && (
                              <div>
                                <span className="font-bold text-slate-900">
                                  Troubleshooting Notes:
                                </span>{' '}
                                {ticket.troubleshootingNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. Documented Change Orders / Supplemental Orders */}
              {showSection('change_orders') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      <span>
                        7. Documented Change Orders &amp; Supplemental Orders ({changeOrders.length})
                      </span>
                    </h3>
                  </div>

                  {changeOrders.length === 0 ? (
                    <div className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                      No change orders or supplemental orders have been created for this property yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {changeOrders.map((co) => (
                        <div
                          key={co.id}
                          className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-200 font-mono text-[10px] font-bold">
                                {co.changeOrderNumber}
                              </span>
                              <span className="font-extrabold text-slate-900 text-sm">
                                {co.title}
                              </span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                              {co.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                            <span>
                              Created by <strong>{co.createdBy}</strong> on {co.createdAt}
                            </span>
                            {co.approvedBy && (
                              <span>
                                Approved by: <strong>{co.approvedBy}</strong>
                              </span>
                            )}
                            {co.integratorPartners && co.integratorPartners.length > 0 && (
                              <span>
                                Partner Integrator:{' '}
                                <strong>{co.integratorPartners.join(', ')}</strong>
                              </span>
                            )}
                            {co.assignedFieldTech && (
                              <span>
                                Field Tech: <strong>{co.assignedFieldTech}</strong>
                              </span>
                            )}
                          </div>

                          {(co.trackingNumber ||
                            property.acquisitionMilestones?.[`co::${property.id}::${co.id}`]?.trackingNumber) && (
                            <div>
                              <span className="inline-flex items-center gap-1 font-mono font-bold text-sky-900 bg-sky-50 border border-sky-300 px-2 py-0.5 rounded text-[11px]">
                                <Truck className="w-3.5 h-3.5 text-sky-600" />
                                <span>
                                  Tracking #: {co.trackingNumber ||
                                    property.acquisitionMilestones?.[`co::${property.id}::${co.id}`]?.trackingNumber}
                                </span>
                              </span>
                            </div>
                          )}

                          {(co.reason || co.notes) && (
                            <div className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                              {co.reason && (
                                <div>
                                  <span className="font-bold text-slate-900">Order Reason / Scope:</span>{' '}
                                  {co.reason}
                                </div>
                              )}
                              {co.notes && (
                                <div>
                                  <span className="font-bold text-slate-900">Order Notes:</span>{' '}
                                  {co.notes}
                                </div>
                              )}
                            </div>
                          )}

                          {co.items && co.items.length > 0 && (
                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                              <table className="w-full text-left border-collapse text-[11px]">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                                    <th className="py-1.5 px-2.5">Catalog Item</th>
                                    <th className="py-1.5 px-2.5">Type</th>
                                    <th className="py-1.5 px-2.5">Installed / Qty</th>
                                    <th className="py-1.5 px-2.5">Location &amp; Notes</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {co.items.map((ci) => (
                                    <tr key={ci.id}>
                                      <td className="py-1.5 px-2.5 font-bold text-slate-900">
                                        {ci.name}{' '}
                                        <span className="font-mono text-slate-500 font-normal">
                                          ({ci.sku})
                                        </span>
                                      </td>
                                      <td className="py-1.5 px-2.5">{ci.productType}</td>
                                      <td className="py-1.5 px-2.5 font-mono font-bold">
                                        {ci.installedCount} / {ci.quantity}
                                      </td>
                                      <td className="py-1.5 px-2.5 text-slate-600">
                                        {ci.location}
                                        {ci.notes ? ` — ${ci.notes}` : ''}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* =====================================================================
          SECTION 3: CONTRACT FILE UPLOAD & AI CONTRACT SCRUBBER
      ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Contract Scrubber &amp; Agreement Repository</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              Property Contracts &amp; AI Agreement Scrubber
            </h2>
            <p className="text-xs text-slate-500">
              Upload executed property contracts (.pdf, .docx, .txt) to automatically scrub the contract timeline (start &amp; termination dates), summarize Quext&apos;s responsibilities and the Customer&apos;s responsibilities, and display both signing parties.
            </p>
          </div>

          <div className="shrink-0">
            <input
              ref={contractFileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md,.rtf"
              onChange={handleContractFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={isScrubbingContract}
              onClick={() => contractFileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>
                {isScrubbingContract ? 'AI Scrubbing Contract...' : 'Upload & Scrub Contract'}
              </span>
            </button>
          </div>
        </div>

        {scrubError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
            {scrubError}
          </div>
        )}

        {contracts.length === 0 ? (
          <div
            onClick={() => !isScrubbingContract && contractFileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-purple-50/30 space-y-2"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <FileSignature className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">
              {isScrubbingContract
                ? 'Analyzing contract timeline, signatories, and party obligations...'
                : 'No Contract Uploaded Yet — Click to Upload Executed Agreement'}
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Supports PDF, Word (.docx), or text contracts. The AI scrubber extracts the start date, termination date, Quext responsibilities, Customer responsibilities, and both signing parties.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {contracts.map((contract) => {
              const isEditing =
                editingContractId === contract.id && contractEditDraft !== null;

              return (
                <div
                  key={contract.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden space-y-4 p-5"
                >
                  {/* Contract File Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                        <FileSignature className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                            {contract.fileName}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            {contract.aiModelUsed}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Uploaded {contract.uploadedAt} by <strong>{contract.uploadedBy}</strong> •{' '}
                          {Math.max(1, Math.round(contract.fileSize / 1024))} KB
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {contract.fileDataUrl && (
                        <a
                          href={contract.fileDataUrl}
                          download={contract.fileName}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download File</span>
                        </a>
                      )}
                      {!isEditing ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingContractId(contract.id);
                            setContractEditDraft(JSON.parse(JSON.stringify(contract)));
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Contract Details</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleSaveContractEdit}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save Changes</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingContractId(null);
                              setContractEditDraft(null);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-slate-600 border border-slate-200 text-xs font-semibold cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteContract(contract.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete contract"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isEditing && contractEditDraft ? (
                    <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Contract Start / Effective Date
                          </label>
                          <input
                            type="text"
                            value={contractEditDraft.contractStartDate}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                contractStartDate: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Contract Termination / End Date
                          </label>
                          <input
                            type="text"
                            value={contractEditDraft.contractTerminationDate}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                contractTerminationDate: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Contract Term Summary
                          </label>
                          <input
                            type="text"
                            value={contractEditDraft.contractTermSummary}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                contractTermSummary: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div className="space-y-2">
                          <div className="font-black text-slate-800 uppercase text-[11px]">
                            Quext Signatory Details
                          </div>
                          <input
                            type="text"
                            placeholder="Quext Entity Name"
                            value={contractEditDraft.quextSignatory.entityName}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                quextSignatory: {
                                  ...contractEditDraft.quextSignatory,
                                  entityName: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Quext Signer Name"
                            value={contractEditDraft.quextSignatory.signerName}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                quextSignatory: {
                                  ...contractEditDraft.quextSignatory,
                                  signerName: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Title"
                              value={contractEditDraft.quextSignatory.signerTitle}
                              onChange={(e) =>
                                setContractEditDraft({
                                  ...contractEditDraft,
                                  quextSignatory: {
                                    ...contractEditDraft.quextSignatory,
                                    signerTitle: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                            />
                            <input
                              type="text"
                              placeholder="Signed Date"
                              value={contractEditDraft.quextSignatory.signedDate}
                              onChange={(e) =>
                                setContractEditDraft({
                                  ...contractEditDraft,
                                  quextSignatory: {
                                    ...contractEditDraft.quextSignatory,
                                    signedDate: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="font-black text-slate-800 uppercase text-[11px]">
                            Customer / Owner Signatory Details
                          </div>
                          <input
                            type="text"
                            placeholder="Customer Entity Name"
                            value={contractEditDraft.customerSignatory.entityName}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                customerSignatory: {
                                  ...contractEditDraft.customerSignatory,
                                  entityName: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Customer Signer Name"
                            value={contractEditDraft.customerSignatory.signerName}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                customerSignatory: {
                                  ...contractEditDraft.customerSignatory,
                                  signerName: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Title"
                              value={contractEditDraft.customerSignatory.signerTitle}
                              onChange={(e) =>
                                setContractEditDraft({
                                  ...contractEditDraft,
                                  customerSignatory: {
                                    ...contractEditDraft.customerSignatory,
                                    signerTitle: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                            />
                            <input
                              type="text"
                              placeholder="Signed Date"
                              value={contractEditDraft.customerSignatory.signedDate}
                              onChange={(e) =>
                                setContractEditDraft({
                                  ...contractEditDraft,
                                  customerSignatory: {
                                    ...contractEditDraft.customerSignatory,
                                    signedDate: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Quext Responsibilities (one per line)
                          </label>
                          <textarea
                            rows={4}
                            value={contractEditDraft.quextResponsibilities.join('\n')}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                quextResponsibilities: e.target.value
                                  .split('\n')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Customer Responsibilities (one per line)
                          </label>
                          <textarea
                            rows={4}
                            value={contractEditDraft.customerResponsibilities.join('\n')}
                            onChange={(e) =>
                              setContractEditDraft({
                                ...contractEditDraft,
                                customerResponsibilities: e.target.value
                                  .split('\n')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* 1. Timeline of the Contract (Start & Termination) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              Contract Start Date
                            </div>
                            <div className="text-sm font-black text-slate-900 mt-0.5">
                              {contract.contractStartDate}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-rose-50 text-rose-700 shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              Contract Termination Date
                            </div>
                            <div className="text-sm font-black text-slate-900 mt-0.5">
                              {contract.contractTerminationDate}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-purple-50 text-purple-700 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              Term &amp; Renewal Timeline
                            </div>
                            <div className="text-xs font-bold text-slate-900 mt-0.5">
                              {contract.contractTermSummary}
                            </div>
                            {contract.autoRenewalTerms && (
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {contract.autoRenewalTerms}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Both Parties That Signed the Contract */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                            Signed Party 1 • Quext Signatory
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">
                            {contract.quextSignatory.entityName}
                          </div>
                          <div className="text-xs text-slate-700">
                            Signed By:{' '}
                            <strong className="text-slate-900">
                              {contract.quextSignatory.signerName}
                            </strong>{' '}
                            ({contract.quextSignatory.signerTitle})
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Date Signed: {contract.quextSignatory.signedDate}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                          <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                            Signed Party 2 • Customer / Owner Signatory
                          </div>
                          <div className="text-sm font-extrabold text-slate-900">
                            {contract.customerSignatory.entityName}
                          </div>
                          <div className="text-xs text-slate-700">
                            Signed By:{' '}
                            <strong className="text-slate-900">
                              {contract.customerSignatory.signerName}
                            </strong>{' '}
                            ({contract.customerSignatory.signerTitle})
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Date Signed: {contract.customerSignatory.signedDate}
                          </div>
                        </div>
                      </div>

                      {/* 3. Quext Responsibilities & Customer Responsibilities */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                          <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>What Quext Is Responsible For in the Agreement</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                            {contract.quextResponsibilities.map((resp, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                          <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-indigo-600" />
                            <span>What the Customer Is Responsible For in the Agreement</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                            {contract.customerResponsibilities.map((resp, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================================
          SECTION 4: CSM NOTE-TAKING ENGINE, RISK TIERS, MULTI-TAGS, RISK GROUPS & RESOLUTION PLANS
      ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md">
              <FolderGit2 className="w-3.5 h-3.5 text-amber-700" />
              <span>CSM Property Note Engine &amp; Risk Resolution Tracker</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
              CSM, Notes &amp; Resolutions Plans
            </h2>
            <p className="text-xs text-slate-500">
              Log property notes, assign a Risk Tier level and multiple tags, group a specific subset of notes contributing to a risk level, and maintain resolution plans with next steps while issues remain open.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedProjectNoteIdsToTransfer([]);
                setIsProjectNotesBrowserOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              title="Browse project notes associated with this property and select individual notes to copy and transfer into your CSM Property Notes"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Browse &amp; Transfer Project Notes</span>
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-200/80 text-indigo-950 font-mono text-[10px]">
                {projectNotes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreatingRiskGroup((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-[#01C38D]" />
              <span>
                {selectedNoteIdsForGrouping.length > 0
                  ? `Group ${selectedNoteIdsForGrouping.length} Selected Note${
                      selectedNoteIdsForGrouping.length === 1 ? '' : 's'
                    } into Risk Level`
                  : '+ Create Risk Group from Notes'}
              </span>
            </button>
          </div>
        </div>

        {/* Selective Project Notes Browser & Transfer Modal (Only visible when CSM clicks "Browse & Transfer Project Notes") */}
        {isProjectNotesBrowserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      Selective Note Transfer
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      {projectNotes.length} Project Note{projectNotes.length === 1 ? '' : 's'} Found
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                    Browse &amp; Transfer Project Notes — {property.propertyName}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Select individual project notes below to copy and transfer them into your Property Notes section. Project notes remain hidden from the Property page unless you select and transfer them.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProjectNotesBrowserOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                {projectNotes.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                    <div className="text-sm font-bold text-slate-700">
                      No Project Notes Found on {property.propertyName}
                    </div>
                    <p className="text-xs text-slate-500">
                      No project notes were logged on the implementation project for this property.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedProjectNoteIdsToTransfer(projectNotes.map((n) => n.id))
                          }
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold cursor-pointer"
                        >
                          Select All ({projectNotes.length})
                        </button>
                        {selectedProjectNoteIdsToTransfer.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedProjectNoteIdsToTransfer([])}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-semibold cursor-pointer"
                          >
                            Clear Selection
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="font-bold text-slate-700">
                          Assign Risk Tier on Transfer:
                        </label>
                        <select
                          value={transferNotesRiskTier}
                          onChange={(e) => setTransferNotesRiskTier(e.target.value as CSMRiskTier)}
                          className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                        >
                          {CSM_RISK_TIERS.map((tier) => (
                            <option key={tier} value={tier}>
                              {tier}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {projectNotes.map((pn) => {
                        const isSelected = selectedProjectNoteIdsToTransfer.includes(pn.id);
                        const wasAlreadyTransferred = alreadyTransferredProjectNoteIds.has(pn.id);
                        return (
                          <label
                            key={pn.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-400/20'
                                : 'bg-white hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleProjectNoteForTransfer(pn.id)}
                              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-extrabold text-slate-900">
                                    {pn.author}
                                  </span>
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    {pn.timestamp}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
                                    {pn.category}
                                  </span>
                                  {pn.isPinned && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold">
                                      Pinned on Project
                                    </span>
                                  )}
                                </div>
                                {wasAlreadyTransferred && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                                    ✓ Transferred to Property Notes
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                                {pn.text}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600 font-medium">
                  <strong>{selectedProjectNoteIdsToTransfer.length}</strong> project note
                  {selectedProjectNoteIdsToTransfer.length === 1 ? '' : 's'} selected to copy
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProjectNotesBrowserOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={selectedProjectNoteIdsToTransfer.length === 0}
                    onClick={handleTransferSelectedProjectNotes}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Copy &amp; Transfer Selected ({selectedProjectNoteIdsToTransfer.length}) to Property Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Risk Group Modal / Drawer (Groups a Specific Subset of Notes Contributing to a Risk Level) */}
        {(isCreatingRiskGroup || selectedNoteIdsForGrouping.length > 0) && (
          <form
            onSubmit={handleCreateRiskGroupSubmit}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-rose-50/60 border-2 border-amber-300 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Group Subset of Notes Contributing to a Risk Level
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                  Create Risk Group &amp; Resolution Plan ({selectedNoteIdsForGrouping.length} Contributing Note
                  {selectedNoteIdsForGrouping.length === 1 ? '' : 's'} Selected)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingRiskGroup(false);
                  setSelectedNoteIdsForGrouping([]);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Risk Group / Issue Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="e.g. Gate Reader Connectivity & PMS Sync Issue"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Risk Tier Level *
                </label>
                <select
                  value={newGroupRiskTier}
                  onChange={(e) => setNewGroupRiskTier(e.target.value as CSMRiskTier)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                >
                  {CSM_RISK_TIERS.filter((t) => t !== 'None').map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Issue Status &amp; Target Date
                </label>
                <div className="flex gap-2">
                  <select
                    value={newGroupStatus}
                    onChange={(e) =>
                      setNewGroupStatus(
                        e.target.value as 'Open' | 'Resolution Plan Active' | 'Resolved'
                      )
                    }
                    className="flex-1 px-2.5 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Open">Open (Needs Plan)</option>
                    <option value="Resolution Plan Active">Resolution Plan Active</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <input
                    type="date"
                    value={newGroupTargetDate}
                    onChange={(e) => setNewGroupTargetDate(e.target.value)}
                    className="px-2.5 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Select Which Notes Contribute to This Risk Group */}
            {csmNotes.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <label className="block font-bold text-slate-700">
                  Select Specific Subset of CSM Notes Contributing to This Risk Level:
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2.5 bg-white rounded-xl border border-slate-200">
                  {csmNotes.map((n) => {
                    const checked = selectedNoteIdsForGrouping.includes(n.id);
                    return (
                      <label
                        key={n.id}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                          checked ? 'bg-amber-50 border border-amber-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleSelectNoteForGroup(n.id)}
                          className="mt-0.5 rounded border-slate-300"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900">
                            {n.author} • <span className="text-slate-500 font-normal">{n.createdAt}</span>
                          </div>
                          <div className="text-slate-700 truncate">{n.text}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resolution Plan & Next Steps if Issue Remains Open */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resolution Plan Notes
                </label>
                <textarea
                  rows={3}
                  value={newGroupPlanSummary}
                  onChange={(e) => setNewGroupPlanSummary(e.target.value)}
                  placeholder="Describe the resolution plan in place to address this risk..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Next Steps (While Issue Remains Open)
                </label>
                <textarea
                  rows={3}
                  value={newGroupNextSteps}
                  onChange={(e) => setNewGroupNextSteps(e.target.value)}
                  placeholder="List concrete next steps and follow-up actions if the issue remains open..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Save Risk Group &amp; Resolution Plan
              </button>
            </div>
          </form>
        )}

        {/* Active Risk Groups Display (Showing Subset of Contributing Notes + Resolution Plan & Next Steps) */}
        {riskGroups.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Grouped Risk Issues &amp; Resolution Plans ({riskGroups.length})</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {riskGroups.map((group) => {
                const style = getRiskTierBadgeStyle(group.riskTier);
                const contributingNotes = csmNotes.filter(
                  (n) =>
                    group.contributingNoteIds.includes(n.id) || n.riskGroupId === group.id
                );
                const isEditingGroup =
                  editingRiskGroupId === group.id && editingRiskGroupDraft !== null;

                return (
                  <div
                    key={group.id}
                    className={`rounded-2xl border-2 ${style.border} ${style.bg} p-5 space-y-4`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badge}`}
                          >
                            {group.riskTier}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              group.resolutionPlan.issueStatus === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : group.resolutionPlan.issueStatus === 'Resolution Plan Active'
                                ? 'bg-sky-100 text-sky-900 border-sky-300'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            Status: {group.resolutionPlan.issueStatus}
                          </span>
                          {group.resolutionPlan.hasResolutionPlan && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                              ✓ Resolution Plan Attached
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900">{group.title}</h4>
                        <div className="text-[11px] text-slate-500">
                          Created {group.createdAt} by <strong>{group.createdBy}</strong> •{' '}
                          <strong>{contributingNotes.length}</strong> Contributing Note
                          {contributingNotes.length === 1 ? '' : 's'}
                          {group.resolutionPlan.targetResolutionDate
                            ? ` • Target Resolution: ${group.resolutionPlan.targetResolutionDate}`
                            : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isEditingGroup ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRiskGroupId(group.id);
                              setEditingRiskGroupDraft(JSON.parse(JSON.stringify(group)));
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold cursor-pointer shadow-2xs"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Update Resolution Plan &amp; Next Steps</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveRiskGroupEdit}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Plan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRiskGroupId(null);
                                setEditingRiskGroupDraft(null);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-slate-600 border border-slate-300 text-xs font-semibold cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteRiskGroup(group.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white cursor-pointer"
                          title="Delete Risk Group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isEditingGroup && editingRiskGroupDraft ? (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Risk Group Title
                            </label>
                            <input
                              type="text"
                              value={editingRiskGroupDraft.title}
                              onChange={(e) =>
                                setEditingRiskGroupDraft({
                                  ...editingRiskGroupDraft,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Risk Tier Level
                            </label>
                            <select
                              value={editingRiskGroupDraft.riskTier}
                              onChange={(e) =>
                                setEditingRiskGroupDraft({
                                  ...editingRiskGroupDraft,
                                  riskTier: e.target.value as CSMRiskTier,
                                })
                              }
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
                            >
                              {CSM_RISK_TIERS.filter((t) => t !== 'None').map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Issue Resolution Status
                            </label>
                            <select
                              value={editingRiskGroupDraft.resolutionPlan.issueStatus}
                              onChange={(e) =>
                                setEditingRiskGroupDraft({
                                  ...editingRiskGroupDraft,
                                  resolutionPlan: {
                                    ...editingRiskGroupDraft.resolutionPlan,
                                    issueStatus: e.target.value as
                                      | 'Open'
                                      | 'Resolution Plan Active'
                                      | 'Resolved',
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
                            >
                              <option value="Open">Open (Needs Resolution Plan)</option>
                              <option value="Resolution Plan Active">
                                Resolution Plan Active (Issue Remains Open)
                              </option>
                              <option value="Resolved">Resolved &amp; Closed</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Resolution Plan Notes
                            </label>
                            <textarea
                              rows={3}
                              value={editingRiskGroupDraft.resolutionPlan.planSummary}
                              onChange={(e) =>
                                setEditingRiskGroupDraft({
                                  ...editingRiskGroupDraft,
                                  resolutionPlan: {
                                    ...editingRiskGroupDraft.resolutionPlan,
                                    planSummary: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter the resolution plan details..."
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Next Steps (If Issue Remains Open)
                            </label>
                            <textarea
                              rows={3}
                              value={editingRiskGroupDraft.resolutionPlan.nextSteps}
                              onChange={(e) =>
                                setEditingRiskGroupDraft({
                                  ...editingRiskGroupDraft,
                                  resolutionPlan: {
                                    ...editingRiskGroupDraft.resolutionPlan,
                                    nextSteps: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter next steps while the issue remains open..."
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>

                        {/* Toggle Which Notes Contribute to This Risk Group */}
                        {csmNotes.length > 0 && (
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Contributing Subset of CSM Notes:
                            </label>
                            <div className="max-h-32 overflow-y-auto space-y-1 p-2 border border-slate-200 rounded-lg bg-slate-50">
                              {csmNotes.map((n) => {
                                const isLinked =
                                  editingRiskGroupDraft.contributingNoteIds.includes(n.id);
                                return (
                                  <label
                                    key={n.id}
                                    className="flex items-center gap-2 text-xs cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isLinked}
                                      onChange={() => {
                                        const nextIds = isLinked
                                          ? editingRiskGroupDraft.contributingNoteIds.filter(
                                              (id) => id !== n.id
                                            )
                                          : [...editingRiskGroupDraft.contributingNoteIds, n.id];
                                        setEditingRiskGroupDraft({
                                          ...editingRiskGroupDraft,
                                          contributingNoteIds: nextIds,
                                        });
                                      }}
                                    />
                                    <span className="truncate">
                                      <strong>{n.author}</strong> ({n.createdAt}): {n.text}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Resolution Plan & Next Steps Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                              Resolution Plan Notes
                            </div>
                            <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                              {group.resolutionPlan.planSummary ||
                                'No resolution plan notes entered yet — click "Update Resolution Plan & Next Steps" to add.'}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                              Next Steps (If Issue Remains Open)
                            </div>
                            <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                              {group.resolutionPlan.nextSteps ||
                                'No open next steps logged yet — click "Update Resolution Plan & Next Steps" to add.'}
                            </p>
                          </div>
                        </div>

                        {/* Contributing Subset of Notes */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                            Contributing Subset of Notes ({contributingNotes.length})
                          </div>
                          {contributingNotes.length > 0 ? (
                            <div className="space-y-1.5">
                              {contributingNotes.map((cn) => (
                                <div
                                  key={cn.id}
                                  className="p-3 rounded-xl bg-white/90 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                >
                                  <div className="space-y-0.5">
                                    <div className="font-bold text-slate-900">
                                      {cn.author}{' '}
                                      <span className="text-slate-400 font-normal">
                                        • {cn.createdAt}
                                      </span>
                                    </div>
                                    <div className="text-slate-700">{cn.text}</div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 shrink-0">
                                    {cn.tags.map((t) => (
                                      <span
                                        key={t}
                                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                                      >
                                        #{t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500 italic">
                              No individual notes linked yet. Select notes below or edit this group to link contributing notes.
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New CSM Note Composer */}
        <form
          onSubmit={handleCreateCsmNote}
          className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-slate-900">Add New CSM Property Note</h3>
            <span className="text-[11px] text-slate-500">
              Tag with a Risk Tier and multiple topic tags
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">CSM / Author</label>
              <input
                type="text"
                value={noteAuthor}
                onChange={(e) => setNoteAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Risk Tier Level</label>
              <select
                value={noteRiskTier}
                onChange={(e) => setNoteRiskTier(e.target.value as CSMRiskTier)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                {CSM_RISK_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Link to Existing Risk Group (Optional)
              </label>
              <select
                value={noteAssignRiskGroupId}
                onChange={(e) => setNoteAssignRiskGroupId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-700"
              >
                <option value="">— Standalone Note (or group later) —</option>
                {riskGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.riskTier})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multi-Tag Selector */}
          <div className="space-y-2 text-xs">
            <label className="block font-bold text-slate-700">
              Select Multiple Tags ({noteSelectedTags.length} selected):
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {allAvailableTags.map((tag) => {
                const active = noteSelectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleNoteTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </button>
                );
              })}

              <div className="inline-flex items-center gap-1 ml-1">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  placeholder="+ Custom tag..."
                  className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded-lg w-32"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Note Text */}
          <div>
            <textarea
              rows={3}
              required
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter CSM property note, client feedback, adoption update, or risk observation..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Optional Direct Resolution Plan on Note when Risk Tier is selected */}
          {noteRiskTier !== 'None' && (
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold text-amber-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNoteResolutionPlan}
                    onChange={(e) => setIncludeNoteResolutionPlan(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Attach Resolution Plan &amp; Next Steps for this Risk Note</span>
                </label>
                {includeNoteResolutionPlan && (
                  <select
                    value={noteResStatus}
                    onChange={(e) =>
                      setNoteResStatus(
                        e.target.value as 'Open' | 'Resolution Plan Active' | 'Resolved'
                      )
                    }
                    className="px-2.5 py-1 border border-slate-300 rounded-lg font-bold text-[11px]"
                  >
                    <option value="Open">Issue Open</option>
                    <option value="Resolution Plan Active">Resolution Plan Active</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                )}
              </div>

              {includeNoteResolutionPlan && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Resolution Plan Notes
                    </label>
                    <textarea
                      rows={2}
                      value={noteResPlanSummary}
                      onChange={(e) => setNoteResPlanSummary(e.target.value)}
                      placeholder="How is this risk being resolved?"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Next Steps (If Issue Remains Open)
                    </label>
                    <textarea
                      rows={2}
                      value={noteResNextSteps}
                      onChange={(e) => setNoteResNextSteps(e.target.value)}
                      placeholder="Next steps and follow-ups while open..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Post CSM Property Note</span>
            </button>
          </div>
        </form>

        {/* CSM Notes Feed & Subset Selection Controls */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs font-black uppercase tracking-wider text-slate-700">
              Property CSM Notes ({filteredCsmNotes.length})
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={filterRiskTier}
                onChange={(e) => setFilterRiskTier(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="all">All Risk Tiers</option>
                {CSM_RISK_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>

              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700"
              >
                <option value="all">All Tags</option>
                {allAvailableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredCsmNotes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
              <div className="text-sm font-bold text-slate-700">
                Clean Slate — No CSM Notes Logged Yet
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Use the note composer above to enter CSM property notes, tag them with risk tiers and multiple tags, and group subsets of notes into risk resolution plans.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCsmNotes.map((note) => {
                const riskStyle = getRiskTierBadgeStyle(note.riskTier);
                const linkedGroup = riskGroups.find(
                  (g) => g.id === note.riskGroupId || g.contributingNoteIds.includes(note.id)
                );
                const isSelectedForGroup = selectedNoteIdsForGrouping.includes(note.id);
                const isEditingThisNote =
                  editingNoteId === note.id && editingNoteDraft !== null;

                return (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isSelectedForGroup
                        ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-400/20'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelectedForGroup}
                            onChange={() => handleToggleSelectNoteForGroup(note.id)}
                            className="rounded border-slate-300"
                            title="Select note to group into a Risk Level"
                          />
                          <span>{note.author}</span>
                        </label>
                        <span className="text-[11px] text-slate-400">{note.createdAt}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskStyle.badge}`}
                        >
                          {note.riskTier}
                        </span>
                        {linkedGroup && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Risk Group: {linkedGroup.title}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditingNoteDraft({
                              ...JSON.parse(JSON.stringify(note)),
                              resolutionPlan: note.resolutionPlan || {
                                hasResolutionPlan: false,
                                issueStatus: 'Open',
                                planSummary: '',
                                nextSteps: '',
                                owner: note.author,
                                updatedAt: note.createdAt,
                                updatedBy: currentUserName,
                              },
                            });
                          }}
                          className="text-[11px] font-bold text-sky-700 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit / Update Resolution Plan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCsmNote(note.id)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                      {note.text}
                    </p>

                    {/* Tags */}
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Individual Note Resolution Plan Display or Editor */}
                    {isEditingThisNote && editingNoteDraft ? (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Risk Tier Level
                            </label>
                            <select
                              value={editingNoteDraft.riskTier}
                              onChange={(e) =>
                                setEditingNoteDraft({
                                  ...editingNoteDraft,
                                  riskTier: e.target.value as CSMRiskTier,
                                })
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                            >
                              {CSM_RISK_TIERS.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Resolution Status
                            </label>
                            <select
                              value={editingNoteDraft.resolutionPlan?.issueStatus || 'Open'}
                              onChange={(e) =>
                                setEditingNoteDraft({
                                  ...editingNoteDraft,
                                  resolutionPlan: {
                                    ...(editingNoteDraft.resolutionPlan || {
                                      hasResolutionPlan: true,
                                      planSummary: '',
                                      nextSteps: '',
                                      owner: editingNoteDraft.author,
                                      updatedAt: '',
                                      updatedBy: currentUserName,
                                    }),
                                    issueStatus: e.target.value as
                                      | 'Open'
                                      | 'Resolution Plan Active'
                                      | 'Resolved',
                                  },
                                })
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                            >
                              <option value="Open">Open</option>
                              <option value="Resolution Plan Active">
                                Resolution Plan Active
                              </option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Note Text</label>
                          <textarea
                            rows={2}
                            value={editingNoteDraft.text}
                            onChange={(e) =>
                              setEditingNoteDraft({ ...editingNoteDraft, text: e.target.value })
                            }
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Resolution Plan Notes
                            </label>
                            <textarea
                              rows={2}
                              value={editingNoteDraft.resolutionPlan?.planSummary || ''}
                              onChange={(e) =>
                                setEditingNoteDraft({
                                  ...editingNoteDraft,
                                  resolutionPlan: {
                                    ...(editingNoteDraft.resolutionPlan || {
                                      hasResolutionPlan: true,
                                      issueStatus: 'Resolution Plan Active',
                                      nextSteps: '',
                                      owner: editingNoteDraft.author,
                                      updatedAt: '',
                                      updatedBy: currentUserName,
                                    }),
                                    hasResolutionPlan: Boolean(e.target.value.trim()),
                                    planSummary: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter resolution plan..."
                              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Next Steps (If Issue Remains Open)
                            </label>
                            <textarea
                              rows={2}
                              value={editingNoteDraft.resolutionPlan?.nextSteps || ''}
                              onChange={(e) =>
                                setEditingNoteDraft({
                                  ...editingNoteDraft,
                                  resolutionPlan: {
                                    ...(editingNoteDraft.resolutionPlan || {
                                      hasResolutionPlan: true,
                                      issueStatus: 'Resolution Plan Active',
                                      planSummary: '',
                                      owner: editingNoteDraft.author,
                                      updatedAt: '',
                                      updatedBy: currentUserName,
                                    }),
                                    nextSteps: e.target.value,
                                  },
                                })
                              }
                              placeholder="Enter next steps while issue remains open..."
                              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingNoteDraft(null);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveEditedNote}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer"
                          >
                            Save Note &amp; Plan
                          </button>
                        </div>
                      </div>
                    ) : (
                      note.resolutionPlan &&
                      (note.resolutionPlan.planSummary || note.resolutionPlan.nextSteps) && (
                        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                              Resolution Plan ({note.resolutionPlan.issueStatus})
                            </span>
                            <span className="text-slate-800">
                              {note.resolutionPlan.planSummary || '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 block">
                              Next Steps (While Open)
                            </span>
                            <span className="text-slate-800">
                              {note.resolutionPlan.nextSteps || '—'}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
