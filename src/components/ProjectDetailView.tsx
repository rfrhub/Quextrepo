import React, { useState, useRef, useEffect } from 'react';
import {
  OperationProject,
  BOMItem,
  InstallLogEntry,
  ProjectNote,
  ProjectStatusTag,
  ThermostatBrand,
  LockFinishConfig,
  AVAILABLE_PMS,
  AVAILABLE_CSMS,
  CSMName,
  AVAILABLE_FIELD_TECHS,
  FieldTechName,
  normalizeFieldTech,
  CommonAreaDoor,
  StaffRoleSubmission,
  calculateProjectScheduleHealth,
  Quote,
  TeamAssistEntry,
  FinancialMilestones,
  getProjectIntegratorPartners,
  getCsmHandoffAutoCloseInfo,
  projectHasGatewayOrHubOnBOM,
  getCSMCalendarBookingProfile,
  QUEXT_TRAINING_HELP_ARTICLE_URL,
  PendingInstallationChange,
  buildCustomerKickoffPortalUrl,
  CustomerCommsLog,
  getLockFinishSummaryTag,
  isLockBOMItem,
  isDiyPartner,
} from '../types';
import { IntegratorPartnerSelector } from './IntegratorPartnerSelector';
import { BOMTable } from './BOMTable';
import { ShippingDockSection, buildFullShippingUpdatePayload } from './ShippingDockSection';
import { LiveGmailConfirmModal, LiveGmailModalPayload } from './LiveGmailConfirmModal';
import { SOWForecasterSection } from './SOWForecasterSection';
import { ProgressGraph } from './ProgressGraph';
import { InstallLogSection } from './InstallLogSection';
import { InstallLogsAndMediaContainer } from './InstallLogsAndMediaContainer';
import { InstallersClipModal } from './InstallersClipModal';
import { ProjectNotesSection } from './ProjectNotesSection';
import { CustomerKickoffWalkthrough } from './CustomerKickoffWalkthrough';
import { CustomerCommsControlPanel } from './CustomerCommsControlPanel';
import { CSMTrainingPortal } from './CSMTrainingPortal';
import { ProjectClosureSummaryModal } from './ProjectClosureSummaryModal';
import { PortalBuildOutModal } from './PortalBuildOutModal';
import { ManualLinkProjectPanel } from './ManualLinkProjectPanel';
import { PMPMitigationPlanPanel } from './PMPMitigationPlanPanel';
import {
  Building2,
  QrCode,
  Smartphone,
  Clock,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Edit3,
  Save,
  Presentation,
  FileSpreadsheet,
  FileText,
  DoorOpen,
  Users2,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Plus,
  Trash2,
  Lock,
  Layers,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Thermometer,
  Send,
  Truck,
  FileSignature,
  DollarSign,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  X,
  FileCheck,
  GraduationCap,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import {
  getProjectPartnerCourseCompletion,
  loadPartnerAcademyUsers,
  setPartnerCourseCompletionForProject,
  buildProjectPrePackagedBundle,
} from '../partner-academy/utils/projectCoursePackager';

interface ProjectDetailViewProps {
  project: OperationProject;
  quotesList?: Quote[];
  onUpdateProject: (updated: OperationProject) => void;
  onBackToDashboard?: () => void;
  onViewQuoteAnalysis?: (quoteId: string) => void;
  initialTab?: 'field-bom' | 'customer-comms' | 'customer-kickoff';
  onOpenProjectInPartnerAcademy?: (project: OperationProject) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  quotesList = [],
  onUpdateProject,
  onBackToDashboard,
  onViewQuoteAnalysis,
  initialTab = 'field-bom',
  onOpenProjectInPartnerAcademy,
}) => {
  const [activeTab, setActiveTab] = useState<'field-bom' | 'customer-comms' | 'customer-kickoff'>(
    initialTab === 'customer-kickoff' ? 'customer-kickoff' : initialTab === 'customer-comms' ? 'customer-comms' : 'field-bom'
  );
  const [academySyncTick, setAcademySyncTick] = useState<number>(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const handleSync = () => setAcademySyncTick((prev) => prev + 1);
    window.addEventListener('quext-partner-progress-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('quext-partner-progress-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const partnerCourseEvaluation = (() => {
    void academySyncTick;
    return getProjectPartnerCourseCompletion(project, loadPartnerAcademyUsers());
  })();
  const [isEditingStatusReason, setIsEditingStatusReason] = useState<boolean>(false);
  const [statusReasonInput, setStatusReasonInput] = useState<string>(project.statusReason || '');
  const [isPortalBuildOutOpen, setIsPortalBuildOutOpen] = useState<boolean>(false);
  const [isCSMTrainingOpen, setIsCSMTrainingOpen] = useState<boolean>(false);
  const [csmPortalInitialMode, setCsmPortalInitialMode] = useState<'csm-intro-booking' | 'csm-handoff'>('csm-intro-booking');
  const [isClosureSummaryOpen, setIsClosureSummaryOpen] = useState<boolean>(false);
  const [isInstallersClipOpen, setIsInstallersClipOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showCSMCompletedAlert, setShowCSMCompletedAlert] = useState<boolean>(false);
  const [showCSMIntroBookingAlert, setShowCSMIntroBookingAlert] = useState<boolean>(false);
  const [showEntrataPassword, setShowEntrataPassword] = useState<boolean>(true);
  const [gmailModalPayload, setGmailModalPayload] = useState<LiveGmailModalPayload | null>(null);
  const [headerEmailSuccessBanner, setHeaderEmailSuccessBanner] = useState<string | null>(null);
  const [showMitigationPlan, setShowMitigationPlan] = useState<boolean>(false);

  // Ensure Mitigation plan on all projects is minimized as the default setting
  useEffect(() => {
    setShowMitigationPlan(false);
  }, [project.id]);

  // Common Area Door Quick Add state
  const [isAddingDoor, setIsAddingDoor] = useState<boolean>(false);
  const [newDoorName, setNewDoorName] = useState<string>('');
  const [newDoorArea, setNewDoorArea] = useState<string>('');

  // Dropdown state for Customer Comms Control Panel tab
  const [isCommsDropdownOpen, setIsCommsDropdownOpen] = useState<boolean>(false);
  const commsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commsDropdownRef.current && !commsDropdownRef.current.contains(event.target as Node)) {
        setIsCommsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Assistance modal state
  const [isAssistModalOpen, setIsAssistModalOpen] = useState<boolean>(false);
  const [assistDate, setAssistDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [assistDetails, setAssistDetails] = useState<string>('');

  // SAAS date prompt modal state
  const [isSaasDateModalOpen, setIsSaasDateModalOpen] = useState<boolean>(false);
  const [saasStartDateInput, setSaasStartDateInput] = useState<string>(
    project.financialMilestones?.saasStartDate || new Date().toISOString().split('T')[0]
  );

  const handleToggleFinancialMilestone = (milestoneKey: keyof FinancialMilestones) => {
    const existing = project.financialMilestones || {};
    if (milestoneKey === 'saasStarted') {
      const willBeActive = !existing.saasStarted;
      if (willBeActive) {
        setIsSaasDateModalOpen(true);
        return;
      } else {
        const updatedFinancials: FinancialMilestones = {
          ...existing,
          saasStarted: false,
          saasStartDate: undefined,
        };
        onUpdateProject({
          ...project,
          financialMilestones: updatedFinancials,
          lastUpdated: new Date().toISOString(),
        });
        return;
      }
    }

    if (milestoneKey === 'fiftyPercentCollected' || milestoneKey === 'twentyPercentCollected') {
      const currentVal = Boolean(existing.fiftyPercentCollected ?? existing.twentyPercentCollected);
      const nextVal = !currentVal;
      const updatedFinancials: FinancialMilestones = {
        ...existing,
        fiftyPercentCollected: nextVal,
        twentyPercentCollected: nextVal,
      };
      onUpdateProject({
        ...project,
        financialMilestones: updatedFinancials,
        lastUpdated: new Date().toISOString(),
      });
      return;
    }

    const updatedFinancials: FinancialMilestones = {
      ...existing,
      [milestoneKey]: !existing[milestoneKey],
    };

    onUpdateProject({
      ...project,
      financialMilestones: updatedFinancials,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSaveSaasStartDate = () => {
    const existing = project.financialMilestones || {};
    const updatedFinancials: FinancialMilestones = {
      ...existing,
      saasStarted: true,
      saasStartDate: saasStartDateInput,
    };
    onUpdateProject({
      ...project,
      financialMilestones: updatedFinancials,
      lastUpdated: new Date().toISOString(),
    });
    setIsSaasDateModalOpen(false);
  };

  const handleSaveProjectAssist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistDetails.trim()) return;

    const newAssist: TeamAssistEntry = {
      id: `assist-${Date.now()}`,
      date: assistDate,
      loggedBy: 'Leadership & PM Support',
      assistanceDetails: assistDetails.trim(),
      createdAt: new Date().toISOString(),
    };

    onUpdateProject({
      ...project,
      teamAssists: [newAssist, ...(project.teamAssists || [])],
      lastUpdated: new Date().toISOString(),
    });

    setIsAssistModalOpen(false);
    setAssistDetails('');
  };

  // Handle toggling spares delivery confirmation
  const handleToggleSparesDelivered = (itemId: string) => {
    const updatedBOM = project.bomItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, sparesDelivered: !item.sparesDelivered };
      }
      return item;
    });
    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Calculate schedule health (auto-tags and weeks behind badge)
  const health = calculateProjectScheduleHealth(
    project.targetCompletionDate,
    project.statusTag,
    project.milestones,
    project.notes
  );

  // Handle PM changing the status tag (High Risk, On Track, Behind Schedule)
  const handleStatusTagChange = (newTag: ProjectStatusTag) => {
    onUpdateProject({
      ...project,
      statusTag: newTag,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSaveStatusReason = () => {
    onUpdateProject({
      ...project,
      statusReason: statusReasonInput.trim(),
      lastUpdated: new Date().toISOString(),
    });
    setIsEditingStatusReason(false);
  };

  // Handle updating installed count in BOM table
  const handleUpdateInstalledCount = (itemId: string, newCount: number) => {
    const updatedBOM = project.bomItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, installedCount: newCount };
      }
      return item;
    });

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Handle adding an additional BOM item from the Product Catalog via PM Override
  const handleAddBOMItemOverride = (newItem: BOMItem, overrideReason?: string) => {
    const linkedQuote = quotesList.find(
      (q) => q.id === project.quoteId || q.quoteNumber === project.quoteNumber
    );
    const baselineQuoteBOM =
      project.originalQuoteBOM && project.originalQuoteBOM.length > 0
        ? project.originalQuoteBOM
        : (linkedQuote?.bomItems && linkedQuote.bomItems.length > 0 ? linkedQuote.bomItems : [...project.bomItems]);

    const prevDevicesTotal = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);

    const existingIndex = project.bomItems.findIndex(
      (b) => b.model.toLowerCase() === newItem.model.toLowerCase() || b.id === newItem.id
    );

    let updatedBOM: BOMItem[];
    if (existingIndex >= 0) {
      updatedBOM = project.bomItems.map((b, idx) => {
        if (idx === existingIndex) {
          return {
            ...b,
            quantity: b.quantity + newItem.quantity,
            sparesCount: (b.sparesCount || 0) + (newItem.sparesCount || 0),
            unitPrice: newItem.unitPrice || b.unitPrice,
            location: newItem.location || b.location,
            postItLogs: [...(b.postItLogs || []), ...(newItem.postItLogs || [])],
          };
        }
        return b;
      });
    } else {
      updatedBOM = [...project.bomItems, newItem];
    }

    const newDevicesTotal = updatedBOM.reduce((acc, i) => acc + i.quantity, 0);
    const auditText = `⚡ BOM OVERRIDE: Added ${newItem.quantity}x ${newItem.name} (${newItem.model}) to ${newItem.location}. Total project hardware increased from ${prevDevicesTotal} to ${newDevicesTotal} units. Justification: ${overrideReason || 'PM Catalog Scope Override'}.`;

    const updatedProject: OperationProject = {
      ...project,
      bomItems: updatedBOM,
      originalQuoteBOM: baselineQuoteBOM,
      isBomOverridden: true,
      lastUpdated: new Date().toISOString(),
      notes: [
        {
          id: `note-override-${Date.now()}`,
          projectId: project.id,
          author: project.assignedPM?.name || 'Project Manager',
          timestamp: 'Just now',
          category: 'General Context',
          text: auditText,
          isPinned: true,
        },
        ...project.notes,
      ],
      activityNotifications: [
        {
          id: `notif-${Date.now()}`,
          projectId: project.id,
          propertyName: project.propertyName,
          assignedPMName: project.assignedPM?.name || 'Project Manager',
          assignedFieldTech: project.assignedFieldTech || 'Sean Gates',
          timestamp: 'Just now',
          createdAtIso: new Date().toISOString(),
          audience: 'all',
          category: 'bom_update',
          actorName: project.assignedPM?.name || 'Project Manager',
          actorRole: 'pm',
          badgeLabel: 'BOM OVERRIDE',
          title: 'BOM Item Added from Product Catalog',
          details: `Added ${newItem.quantity}x ${newItem.name} (${newItem.model}). Total hardware count: ${newDevicesTotal} units.`,
          section: 'bom',
          sectionTargetId: 'pm-bom-table',
        },
        ...(project.activityNotifications || []),
      ],
    };

    onUpdateProject(updatedProject);
  };

  // Handle updating thermostat brand across all thermostat items for absolute consistency
  const handleUpdateThermostatBrandAll = (brand: ThermostatBrand) => {
    const updatedBOM = project.bomItems.map((item) => {
      if (item.category === 'Smart Thermostats & HVAC' || item.name.toLowerCase().includes('thermostat')) {
        return {
          ...item,
          thermostatBrand: brand,
          model: brand === 'Honeywell' ? 'HON-TH6-ZW' : 'QXT-TH-300',
          name: brand === 'Honeywell'
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

  const handleUpdateThermostatBrand = (_itemId: string, brand: ThermostatBrand) => {
    handleUpdateThermostatBrandAll(brand);
  };

  // Handle updating lock finish configuration (trim style, color finish, lever style, crashbar, functions)
  const handleUpdateLockFinishConfig = (itemId: string, config?: LockFinishConfig) => {
    const updatedBOM = project.bomItems.map((item) => {
      if (item.id === itemId) {
        if (!config) {
          const cleaned = { ...item };
          delete cleaned.lockFinishConfig;
          return cleaned;
        }
        return {
          ...item,
          lockFinishConfig: config,
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

  // Handle saving a post-it log attached directly to a BOM row
  const handleSaveRowLog = (itemId: string, newLog: Omit<InstallLogEntry, 'id'>, autoIncrementBOM: boolean) => {
    const logId = `postit-${Date.now()}`;
    const logEntry: InstallLogEntry = {
      ...newLog,
      id: logId,
      projectId: project.id,
      itemId,
    };

    const updatedBOM = project.bomItems.map((item) => {
      if (item.id === itemId) {
        const existingLogs = item.postItLogs || [];
        const shouldIncrement = autoIncrementBOM && !newLog.exceedsSOW;
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

    const pendingChanges = project.pendingInstallationChanges || [];
    let updatedPending = [...pendingChanges];
    if (newLog.exceedsSOW) {
      const pendingChange: PendingInstallationChange = {
        id: `pending-overalloc-${Date.now()}-${itemId}`,
        source: 'install_log',
        sourceId: logId,
        title: `⚠️ SOW Over-Allocation: ${newLog.itemName}`,
        submittedBy: newLog.installerName,
        submittedRole: newLog.submittedByRole || 'field_tech',
        submittedAt: new Date().toISOString(),
        details: `Logged ${newLog.quantityCompleted} units (Exceeds SOW by +${newLog.offsetQuantity} units). Requires PM Approval.`,
        bomIncrements: { [itemId]: newLog.quantityCompleted },
        status: 'pending',
        exceedsSOW: true,
        offsetQuantity: newLog.offsetQuantity,
        approvalStatus: 'pending_approval',
        associatedLog: logEntry,
      };
      updatedPending = [pendingChange, ...updatedPending];
    }

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      installLogs: [logEntry, ...project.installLogs],
      pendingInstallationChanges: updatedPending,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleAddLog = (newLog: Omit<InstallLogEntry, 'id'>, autoIncrementBOM: boolean) => {
    handleSaveRowLog(newLog.itemId, newLog, autoIncrementBOM);
  };

  const handleConfirmInstallation = (changeId?: string, sowItemId?: string, logId?: string) => {
    const bomIncrements: Record<string, number> = {};
    const confirmedDetails: string[] = [];

    // 1. If a specific changeId was given, or all pending changes:
    const pendingList = project.pendingInstallationChanges || [];
    const updatedPendingList = pendingList.map((c) => {
      if ((changeId && c.id === changeId) || (!changeId && !sowItemId && !logId && c.status === 'pending')) {
        Object.entries(c.bomIncrements).forEach(([bomId, qty]) => {
          bomIncrements[bomId] = (bomIncrements[bomId] || 0) + qty;
        });
        confirmedDetails.push(c.details);
        return {
          ...c,
          status: 'confirmed' as const,
          confirmedAt: new Date().toISOString(),
          confirmedBy: 'Project Manager',
        };
      }
      return c;
    });

    // 2. If a specific sowItemId was given or all pending SOW items:
    const updatedSowItems = (project.sowForecastItems || []).map((s) => {
      if ((sowItemId && s.id === sowItemId) || (!changeId && !sowItemId && !logId && s.status === 'Completed' && s.pendingPMConfirmation)) {
        const rowBomIds = s.bomItemIds && s.bomItemIds.length > 0 ? s.bomItemIds : [s.bomItemId];
        const matchedBoms = project.bomItems.filter((b) => rowBomIds.includes(b.id));
        matchedBoms.forEach((b) => {
          const qty = s.bomItemQuantities?.[b.id] ?? s.forecastedQuantity;
          bomIncrements[b.id] = (bomIncrements[b.id] || 0) + qty;
        });
        confirmedDetails.push(`SOW: ${s.workDescription || s.bomItemName}`);
        return {
          ...s,
          pendingPMConfirmation: false,
          confirmedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    // 3. If a specific logId was given or all pending install logs:
    const updatedInstallLogs = (project.installLogs || []).map((l) => {
      if ((logId && l.id === logId) || (!changeId && !sowItemId && !logId && l.pendingPMConfirmation)) {
        bomIncrements[l.itemId] = (bomIncrements[l.itemId] || 0) + l.quantityCompleted;
        confirmedDetails.push(`Install Log: ${l.itemName} (+${l.quantityCompleted})`);
        return {
          ...l,
          pendingPMConfirmation: false,
          color: 'emerald' as const,
          notes: `${l.notes} (✓ Confirmed by PM)`,
        };
      }
      return l;
    });

    // 4. Update BOM installed counts:
    const updatedBOM = project.bomItems.map((b) => {
      const inc = bomIncrements[b.id] || 0;
      if (inc > 0) {
        return {
          ...b,
          installedCount: Math.min(b.quantity, (b.installedCount || 0) + inc),
        };
      }
      return b;
    });

    // 5. Add a PM confirmation note to project:
    const confirmNote: ProjectNote = {
      id: `note-confirm-${Date.now()}`,
      projectId: project.id,
      author: 'Project Manager',
      timestamp:
        new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' ' +
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      category: 'Inspection & Commissioning',
      text: `PM Confirmed On-Site Installation Work: ${
        confirmedDetails.join(' · ') || 'Hardware batch committed to BOM.'
      }`,
      isPinned: true,
    };

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      sowForecastItems: updatedSowItems,
      installLogs: updatedInstallLogs,
      pendingInstallationChanges: updatedPendingList,
      notes: [confirmNote, ...project.notes],
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleApproveOverAllocation = (logId: string) => {
    const targetLog = (project.installLogs || []).find((l) => l.id === logId);
    if (!targetLog) return;

    // Increment BOM installed count by the full logged quantity
    const updatedBOM = project.bomItems.map((b) => {
      if (b.id === targetLog.itemId) {
        return {
          ...b,
          installedCount: (b.installedCount || 0) + targetLog.quantityCompleted,
          overAllocationDenied: false,
          overAllocationOffset: 0,
        };
      }
      return b;
    });

    // Update the log status
    const updatedLogs = (project.installLogs || []).map((l) => {
      if (l.id === logId) {
        return {
          ...l,
          approvalStatus: 'approved' as const,
          pendingPMConfirmation: false,
          color: 'emerald' as const,
          notes: `${l.notes} (✓ SOW Over-Allocation Approved by PM)`,
        };
      }
      return l;
    });

    // Update pending changes
    const updatedPendingList = (project.pendingInstallationChanges || []).map((c) => {
      if (c.sourceId === logId || c.associatedLog?.id === logId) {
        return {
          ...c,
          status: 'confirmed' as const,
          approvalStatus: 'approved' as const,
          confirmedAt: new Date().toISOString(),
          confirmedBy: 'Project Manager',
        };
      }
      return c;
    });

    const approveNote: ProjectNote = {
      id: `note-appr-${Date.now()}`,
      projectId: project.id,
      author: 'Project Manager',
      timestamp:
        new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' ' +
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      category: 'Inspection & Commissioning',
      text: `PM Approved SOW Over-Allocation: ${targetLog.installerName} logged ${targetLog.quantityCompleted} units of ${targetLog.itemName} (+${targetLog.offsetQuantity} over quoted). Committed to BOM.`,
      isPinned: true,
    };

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      installLogs: updatedLogs,
      pendingInstallationChanges: updatedPendingList,
      notes: [approveNote, ...project.notes],
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleDenyOverAllocation = (logId: string) => {
    const targetLog = (project.installLogs || []).find((l) => l.id === logId);
    if (!targetLog) return;

    // Flag the line item in BOM and highlight the offset
    const updatedBOM = project.bomItems.map((b) => {
      if (b.id === targetLog.itemId) {
        return {
          ...b,
          overAllocationDenied: true,
          overAllocationOffset: targetLog.offsetQuantity || 0,
        };
      }
      return b;
    });

    // Update the log status to denied
    const updatedLogs = (project.installLogs || []).map((l) => {
      if (l.id === logId) {
        return {
          ...l,
          approvalStatus: 'denied' as const,
          pendingPMConfirmation: false,
          color: 'rose' as const,
          notes: `${l.notes} (✕ SOW Over-Allocation Denied by PM - Requires Change Order)`,
        };
      }
      return l;
    });

    const updatedPendingList = (project.pendingInstallationChanges || []).map((c) => {
      if (c.sourceId === logId || c.associatedLog?.id === logId) {
        return {
          ...c,
          status: 'confirmed' as const,
          approvalStatus: 'denied' as const,
          denialReason: 'Over-allocation denied by PM',
          confirmedAt: new Date().toISOString(),
          confirmedBy: 'Project Manager',
        };
      }
      return c;
    });

    const denyNote: ProjectNote = {
      id: `note-deny-${Date.now()}`,
      projectId: project.id,
      author: 'Project Manager',
      timestamp:
        new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' ' +
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      category: 'Inspection & Commissioning',
      text: `PM Denied SOW Over-Allocation: ${targetLog.installerName} attempted ${targetLog.quantityCompleted} units of ${targetLog.itemName} (+${targetLog.offsetQuantity} over quoted). Line item flagged and offset highlighted for Change Order review.`,
      isPinned: true,
    };

    onUpdateProject({
      ...project,
      bomItems: updatedBOM,
      installLogs: updatedLogs,
      pendingInstallationChanges: updatedPendingList,
      notes: [denyNote, ...project.notes],
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleDeleteLog = (logId: string) => {
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

  const handleAddNote = (newNote: Omit<ProjectNote, 'id'>) => {
    const noteId = `note-${Date.now()}`;
    const noteEntry: ProjectNote = {
      ...newNote,
      id: noteId,
      projectId: project.id,
    };

    onUpdateProject({
      ...project,
      notes: [noteEntry, ...project.notes],
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleDeleteNote = (noteId: string) => {
    onUpdateProject({
      ...project,
      notes: project.notes.filter((n) => n.id !== noteId),
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleToggleMilestone = (milestoneId: string) => {
    let enteredCsmHandoff = false;
    let enteredCsmIntro = false;
    let nextCsmHandoffEnteredAt = project.csmHandoffEnteredAt;

    const updatedMilestones = project.milestones.map((m) => {
      if (m.id === milestoneId) {
        const nextStatus = m.status === 'Completed' ? 'In Progress' : m.status === 'In Progress' ? 'Upcoming' : 'Completed';
        if (m.title === 'CSM Handoff') {
          if (nextStatus === 'In Progress' || nextStatus === 'Completed') {
            enteredCsmHandoff = true;
            if (!nextCsmHandoffEnteredAt) {
              nextCsmHandoffEnteredAt = new Date().toISOString().split('T')[0];
            }
          }
        }
        if (m.title === 'CSM Intro - Pre-implementation') {
          if (nextStatus === 'In Progress' || nextStatus === 'Completed') {
            enteredCsmIntro = true;
          }
        }
        return { ...m, status: nextStatus as OperationProject['milestones'][0]['status'] };
      }
      return m;
    });

    if (enteredCsmHandoff) {
      setShowCSMCompletedAlert(true);
    }
    if (enteredCsmIntro) {
      setShowCSMIntroBookingAlert(true);
    }

    onUpdateProject({
      ...project,
      milestones: updatedMilestones,
      csmHandoffEnteredAt: nextCsmHandoffEnteredAt,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleToggleProjectFeature = (feature: 'nfc' | 'qr', checked: boolean) => {
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

  const handleTrigger7DayAutoCloseNow = () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const closedMilestones = project.milestones.map((m) =>
      m.title === 'CSM Handoff' || m.title === 'Project Closed'
        ? { ...m, status: 'Completed' as const, completedDate: new Date().toISOString().split('T')[0] }
        : m
    );
    onUpdateProject({
      ...project,
      csmHandoffEnteredAt: eightDaysAgo,
      milestones: closedMilestones,
      lastUpdated: new Date().toISOString(),
    });
  };

  const autoCloseInfo = getCsmHandoffAutoCloseInfo(project);
  const isNfcEnabled = Boolean(project.useNfcWallet ?? project.communityDetails?.nfcWalletConfigured);
  const isQrIntercomEnabled = Boolean(project.useQrIntercom ?? project.customerIntake?.useQrIntercom);
  const csmBookingProfile = getCSMCalendarBookingProfile(project.assignedCSM);
  const csmIntroMilestone = project.milestones.find((m) => m.title === 'CSM Intro - Pre-implementation');
  const isOnCSMIntroMilestone = csmIntroMilestone?.status === 'In Progress';

  // Door tracking handlers - auto-updates quantity of selected BOM line item when status is Installed & Online
  const handleUpdateDoor = (doorId: string, updates: Partial<CommonAreaDoor>) => {
    const existingDoors = project.customerIntake?.commonAreaDoors || [];
    const currentDoor = existingDoors.find((d) => d.id === doorId);
    const updatedDoors = existingDoors.map((door) => {
      if (door.id === doorId) {
        return { ...door, ...updates };
      }
      return door;
    });

    let updatedBOM = [...project.bomItems];
    const targetDeviceId = updates.installedDeviceId !== undefined ? updates.installedDeviceId : currentDoor?.installedDeviceId;
    const newStatus = updates.installedStatus !== undefined ? updates.installedStatus : currentDoor?.installedStatus;
    const oldStatus = currentDoor?.installedStatus;

    if (targetDeviceId && oldStatus !== newStatus) {
      if (newStatus === 'Installed & Online' && oldStatus !== 'Installed & Online') {
        // Increment quantity of corresponding selected line item
        updatedBOM = updatedBOM.map((item) =>
          item.id === targetDeviceId
            ? { ...item, installedCount: Math.min(item.quantity, (item.installedCount || 0) + 1) }
            : item
        );
      } else if (oldStatus === 'Installed & Online' && newStatus !== 'Installed & Online') {
        // Decrement quantity if reverted from Installed & Online
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

  const handleAddCustomDoor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoorName.trim()) return;

    const newDoor: CommonAreaDoor = {
      id: `door-${Date.now()}`,
      doorName: newDoorName.trim(),
      buildingOrArea: newDoorArea.trim() || 'Clubhouse / Amenity Space',
      installedStatus: 'Pending',
    };

    const existingDoors = project.customerIntake?.commonAreaDoors || [];
    const updatedDoors = [...existingDoors, newDoor];

    onUpdateProject({
      ...project,
      customerIntake: {
        ...(project.customerIntake || { pmsSoftware: 'Yardi', staffRoles: [], commonAreaDoors: [] }),
        commonAreaDoors: updatedDoors,
      },
      lastUpdated: new Date().toISOString(),
    });

    setNewDoorName('');
    setNewDoorArea('');
    setIsAddingDoor(false);
  };

  const handleDeleteDoor = (doorId: string) => {
    const existingDoors = project.customerIntake?.commonAreaDoors || [];
    const updatedDoors = existingDoors.filter((d) => d.id !== doorId);

    onUpdateProject({
      ...project,
      customerIntake: {
        ...(project.customerIntake || { pmsSoftware: 'Yardi', staffRoles: [], commonAreaDoors: [] }),
        commonAreaDoors: updatedDoors,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleCopyKickoffLink = () => {
    const link = buildCustomerKickoffPortalUrl(project.id);
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleCopyCsmPortalLink = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const link = `${origin}${pathname}#/csm-portal/${project.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const isKickoffCompleted = project.milestones.some(
    (m) => m.title.toLowerCase().includes('kickoff') && m.status === 'Completed'
  );
  const isTrainingCsmActive = project.milestones.some(
    (m) => (m.title.toLowerCase().includes('training') || m.title.toLowerCase().includes('csm')) && m.status === 'In Progress'
  );
  const isProjectClosed = project.milestones.some(
    (m) => m.title.toLowerCase().includes('closed') && m.status === 'Completed'
  );
  const isImplementationActive = project.milestones.some(
    (m) =>
      (m.title.toLowerCase() === 'implementation' ||
        (m.title.toLowerCase().includes('implementation') &&
          !m.title.toLowerCase().includes('pre-implementation'))) &&
      m.status === 'In Progress'
  );
  const isPortalBuildoutActive = project.milestones.some(
    (m) => m.title.toLowerCase().includes('portal buildout') && m.status === 'In Progress'
  );
  const isProductAcquisitionActive = project.milestones.some(
    (m) => m.title.toLowerCase().includes('product acquisition') && m.status === 'In Progress'
  );
  const isKickoffCompletedInEntirety = Boolean(
    project.customerIntake?.walkthroughCompleted ||
      project.customerIntake?.submittedAt ||
      isKickoffCompleted
  );

  const customerEmailRecipient =
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.communityEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    'RFRleasing@gmail.com';

  // Implementation Active: Send BOM progress overview (high-level view + individual line item view WITHOUT internal notes)
  const handleSendImplementationBomProgressEmail = () => {
    const bomItems = project.bomItems || [];
    const totalQuoted = bomItems.reduce((acc, i) => acc + i.quantity, 0);
    const totalInstalled = bomItems.reduce((acc, i) => acc + i.installedCount, 0);
    const overallPct = totalQuoted > 0 ? Math.min(100, Math.round((totalInstalled / totalQuoted) * 100)) : 0;

    // Categories summary
    const categories = Array.from(new Set(bomItems.map((b) => b.category)));
    const catRowsHtml = categories
      .map((cat) => {
        const catItems = bomItems.filter((b) => b.category === cat);
        const q = catItems.reduce((sum, i) => sum + i.quantity, 0);
        const inst = catItems.reduce((sum, i) => sum + i.installedCount, 0);
        const p = q > 0 ? Math.min(100, Math.round((inst / q) * 100)) : 0;
        return `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b; font-size: 13px;">${cat}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 13px; color: #334155;">${q.toLocaleString()}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 13px; font-weight: 700; color: #0284c7;">${inst.toLocaleString()}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-size: 13px; font-weight: 700; color: ${p >= 100 ? '#059669' : p > 0 ? '#0284c7' : '#64748b'};">${p}%</td>
          </tr>
        `;
      })
      .join('');

    // Individual line items table (WITHOUT internal notes visible to customer)
    const lineItemRowsHtml = bomItems
      .map((item) => {
        const pct = item.quantity > 0 ? Math.min(100, Math.round((item.installedCount / item.quantity) * 100)) : 0;
        const finishTag = isLockBOMItem(item) && item.lockFinishConfig ? ` <span style="font-size: 11px; color: #475569; font-weight: normal;">[${getLockFinishSummaryTag(item.lockFinishConfig)}]</span>` : '';
        const statusBadge =
          item.installedCount >= item.quantity
            ? `<span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background-color: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700;">Complete</span>`
            : item.installedCount > 0
            ? `<span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background-color: #f0f9ff; color: #0284c7; font-size: 11px; font-weight: 700;">In Progress (${pct}%)</span>`
            : `<span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background-color: #f8fafc; color: #64748b; font-size: 11px; font-weight: 600;">Pending</span>`;

        return `
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 13px;">
              <div style="font-weight: 600; color: #0f172a;">${item.name}${finishTag}</div>
              <div style="font-family: monospace; font-size: 11px; color: #64748b; margin-top: 2px;">Model: ${item.model}</div>
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 12px; color: #475569;">
              ${item.category}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; font-size: 12px; color: #475569;">
              ${item.location || 'On-site'}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; text-align: right; font-family: monospace; font-size: 13px; color: #334155;">
              ${item.quantity.toLocaleString()}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; text-align: right; font-family: monospace; font-size: 13px; font-weight: 700; color: #0284c7;">
              ${item.installedCount.toLocaleString()}
            </td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; text-align: center;">
              ${statusBadge}
            </td>
          </tr>
        `;
      })
      .join('');

    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #0284c7; font-weight: bold; text-transform: uppercase; line-height: 28px;">Deployment Progress Overview</span>
        </div>
        <p style="margin: 0 0 8px 0;">Hello <strong>${project.clientName}</strong> Team,</p>
        <p style="margin: 0 0 16px 0; font-size: 13px; color: #334155;">
          Here is your live Smart Community hardware installation progress overview for <strong>${project.propertyName}</strong>:
        </p>

        <!-- High-Level Overview Cards -->
        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
          <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600;">Total Quoted</div>
            <div style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px; font-family: monospace;">${totalQuoted.toLocaleString()}</div>
          </div>
          <div style="flex: 1; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; color: #0369a1; font-weight: 600;">Installed to Date</div>
            <div style="font-size: 20px; font-weight: 700; color: #0284c7; margin-top: 4px; font-family: monospace;">${totalInstalled.toLocaleString()}</div>
          </div>
          <div style="flex: 1; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 11px; text-transform: uppercase; color: #047857; font-weight: 600;">Overall Progress</div>
            <div style="font-size: 20px; font-weight: 700; color: #059669; margin-top: 4px; font-family: monospace;">${overallPct}%</div>
          </div>
        </div>

        <!-- High-Level Category Breakdown -->
        <div style="margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569;">Hardware Category Breakdown</h4>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f8fafc; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569;">
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0;">Category</th>
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">Quoted</th>
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">Installed</th>
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">% Done</th>
              </tr>
            </thead>
            <tbody>
              ${catRowsHtml}
            </tbody>
          </table>
        </div>

        <!-- Individual Line Item View (No internal notes) -->
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569;">Individual Hardware Line Items</h4>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #f8fafc; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569;">
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0;">Hardware / Model</th>
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0;">Category</th>
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0;">Location</th>
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">Quoted</th>
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">Installed</th>
                <th style="padding: 8px 12px; border-bottom: 2px solid #e2e8f0; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemRowsHtml}
            </tbody>
          </table>
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
          Best regards,<br/>
          <strong>${project.assignedPM?.name || 'Quext Project Manager'}</strong> • Quext Implementation Operations (${project.assignedPM?.email || 'pm@onequext.com'})
        </p>
      </div>
    `;

    setGmailModalPayload({
      title: 'Confirm & Send BOM Progress Deployment Overview via Gmail',
      defaultRecipients: customerEmailRecipient,
      subject: `[Deployment Overview] Hardware Installation Progress: ${project.propertyName} (${overallPct}% Complete)`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const newLog: CustomerCommsLog = {
          id: `bom-progress-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: 'deployment_overview_email',
          recipientEmail: recipients.join(', '),
          subject,
          summary: `Sent Smart Community BOM progress overview (${totalInstalled}/${totalQuoted} units, ${overallPct}%) to customer. [Gmail ID: ${gmailMessageId || 'Sent'}]`,
          sentBy: project.assignedPM?.name || 'Quext PM',
          status: 'Delivered',
        };
        onUpdateProject({
          ...project,
          customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
          lastUpdated: new Date().toISOString(),
        });
        setHeaderEmailSuccessBanner(
          `Real email delivered via Gmail: BOM Deployment Overview (${overallPct}% installed) sent to ${recipients.join(', ')}!`
        );
        setTimeout(() => setHeaderEmailSuccessBanner(null), 5000);
      },
    });
  };

  // Portal Buildout Active & Kickoff Incomplete: Send Kickoff Document to customer
  const handleSendKickoffDocumentEmail = () => {
    const portalUrl = buildCustomerKickoffPortalUrl(project.id);
    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #d97706; font-weight: bold; text-transform: uppercase; line-height: 28px;">Kickoff Walkthrough Document</span>
        </div>
        <p style="margin: 0 0 8px 0;">Hello <strong>${project.clientName}</strong> Team,</p>
        <p style="margin: 0 0 14px 0; font-size: 13px; color: #334155;">
          Please continue filling out your official <strong>Quext Smart Community Kickoff Document &amp; Intake Form</strong> for <strong>${project.propertyName}</strong> (${project.unitsCount} units):
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${portalUrl}" style="background-color: #f59e0b; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            Continue Kickoff Document
          </a>
        </div>
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 12px; color: #92400e;">
          <strong>Information required to finalize Portal Buildout:</strong>
          <ul style="margin: 6px 0 0 16px; padding: 0;">
            <li>Property Management Software (PMS) integration credentials (${project.customerIntake?.pmsSoftware || 'Yardi / RealPage / Entrata'})</li>
            <li>On-site staff directory &amp; administrative roles</li>
            <li>Common area access door schedule &amp; perimeter gates</li>
            <li>Site plan &amp; gateway placement confirmations</li>
          </ul>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
          Best regards,<br/>
          <strong>${project.assignedPM?.name || 'Quext Project Manager'}</strong> • Quext Implementation Operations (${project.assignedPM?.email || 'pm@onequext.com'})
        </p>
      </div>
    `;

    setGmailModalPayload({
      title: 'Confirm & Send Kickoff Document to Customer via Gmail',
      defaultRecipients: customerEmailRecipient,
      subject: `[Action Required] Quext Kickoff Document & Intake Form: ${project.propertyName}`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const newLog: CustomerCommsLog = {
          id: `kickoff-doc-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: 'kickoff_submission',
          recipientEmail: recipients.join(', '),
          subject,
          summary: `Sent Kickoff Document link to customer to continue filling out. [Gmail ID: ${gmailMessageId || 'Sent'}]`,
          sentBy: project.assignedPM?.name || 'Quext PM',
          status: 'Delivered',
        };
        onUpdateProject({
          ...project,
          customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
          lastUpdated: new Date().toISOString(),
        });
        setHeaderEmailSuccessBanner(
          `Real email delivered via Gmail: Kickoff Document link sent to ${recipients.join(', ')}!`
        );
        setTimeout(() => setHeaderEmailSuccessBanner(null), 5000);
      },
    });
  };

  // Portal Buildout Active & Kickoff Complete: Send touch base check-in email giving overview of completed items
  const handleSendTouchBaseCheckinEmail = () => {
    const intake = project.customerIntake;
    const submittedDateStr = intake?.submittedAt
      ? new Date(intake.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Confirmed & Verified';

    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
          <span style="float: right; font-size: 11px; color: #059669; font-weight: bold; text-transform: uppercase; line-height: 28px;">Project Check-In &amp; Milestone Update</span>
        </div>
        <p style="margin: 0 0 8px 0;">Hello <strong>${project.clientName}</strong> Team,</p>
        <p style="margin: 0 0 14px 0; font-size: 13px; color: #334155;">
          We are touching base to provide a status update on your smart community deployment for <strong>${project.propertyName}</strong> (${project.unitsCount} units).
        </p>
        <p style="margin: 0 0 16px 0; font-size: 13px; color: #334155;">
          Your kickoff document and intake details have been completed in their entirety and verified by our engineering team. Here is an overview of what has currently been completed for the project up to this point:
        </p>

        <!-- Completed Items Summary Cards -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="color: #059669; font-weight: bold; margin-right: 8px;">✓</span>
            <span style="font-size: 13px; color: #1e293b;"><strong>Kickoff Intake Document:</strong> Completed and verified (${submittedDateStr})</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="color: #059669; font-weight: bold; margin-right: 8px;">✓</span>
            <span style="font-size: 13px; color: #1e293b;"><strong>PMS Software Integration:</strong> Configured for <strong>${intake?.pmsSoftware || 'Selected PMS'}</strong></span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="color: #059669; font-weight: bold; margin-right: 8px;">✓</span>
            <span style="font-size: 13px; color: #1e293b;"><strong>Staff Roles &amp; User Directory:</strong> <strong>${intake?.staffRoles?.length || staffMembers.length || 0} Staff roles</strong> confirmed</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <span style="color: #059669; font-weight: bold; margin-right: 8px;">✓</span>
            <span style="font-size: 13px; color: #1e293b;"><strong>Common Area Door Tree:</strong> <strong>${intake?.commonAreaDoors?.length || commonDoors.length || 0} Common area doors &amp; access points</strong> mapped</span>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="color: #059669; font-weight: bold; margin-right: 8px;">✓</span>
            <span style="font-size: 13px; color: #1e293b;"><strong>Bill of Materials &amp; Lock Finishes:</strong> All <strong>${project.bomItems.length} line items</strong> verified</span>
          </div>
        </div>

        <!-- Milestone Ahead Reassurance -->
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 13px; color: #065f46;">
          <strong>Next Milestone Ahead:</strong> Everything is on track and progressing smoothly! You are on your way to the next Project Milestone — <strong>Product Acquisition</strong> — very soon, where your hardware batches and integrator shipments will be prepared at the shipping dock.
        </div>

        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
          Best regards,<br/>
          <strong>${project.assignedPM?.name || 'Quext Project Manager'}</strong> • Quext Implementation Operations (${project.assignedPM?.email || 'pm@onequext.com'})
        </p>
      </div>
    `;

    setGmailModalPayload({
      title: 'Confirm & Send Touch Base Check-In Email via Gmail',
      defaultRecipients: customerEmailRecipient,
      subject: `Project Check-In & Completed Milestones Overview: ${project.propertyName}`,
      htmlBody,
      onDispatched: ({ recipients, subject, gmailMessageId }) => {
        const nowStr = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const newLog: CustomerCommsLog = {
          id: `touch-base-${Date.now()}`,
          projectId: project.id,
          timestamp: nowStr,
          type: 'deployment_overview_email',
          recipientEmail: recipients.join(', '),
          subject,
          summary: `Sent touch base check-in email giving overview of completed items (Kickoff, PMS, Staff roles, Common doors) and upcoming Product Acquisition milestone transition. [Gmail ID: ${gmailMessageId || 'Sent'}]`,
          sentBy: project.assignedPM?.name || 'Quext PM',
          status: 'Delivered',
        };
        onUpdateProject({
          ...project,
          customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
          lastUpdated: new Date().toISOString(),
        });
        setHeaderEmailSuccessBanner(
          `Real email delivered via Gmail: Touch base check-in email delivered to ${recipients.join(', ')}!`
        );
        setTimeout(() => setHeaderEmailSuccessBanner(null), 5000);
      },
    });
  };

  // Product Acquisition Active: Send Shipping update to Customer (same as Send Full Update in Shipping Dock)
  const handleSendShippingUpdateEmail = () => {
    const payload = buildFullShippingUpdatePayload(
      project,
      (msg) => {
        setHeaderEmailSuccessBanner(msg);
        setTimeout(() => setHeaderEmailSuccessBanner(null), 5000);
      },
      onUpdateProject
    );
    setGmailModalPayload(payload);
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

  const commonDoors = project.customerIntake?.commonAreaDoors || [];
  const staffMembers = project.customerIntake?.staffRoles || [];
  const pmsChoice = project.customerIntake?.pmsSoftware || 'Yardi';
  const accessControlBOM = project.bomItems.filter(
    (i) => i.category === 'Smart Access Control' || i.category === 'Common Area & Utilities'
  );

  const totalQuotedDevices = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalInstalledDevices = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
  const deploymentPct =
    totalQuotedDevices > 0 ? Math.min(100, Math.round((totalInstalledDevices / totalQuotedDevices) * 100)) : 0;
  const progressBarColor =
    health.effectiveTag === 'On Track'
      ? 'bg-emerald-500'
      : health.effectiveTag === 'Behind Schedule'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="space-y-6">
      {headerEmailSuccessBanner && (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{headerEmailSuccessBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setHeaderEmailSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Top Banner / Project Profile (White Theme) */}
      <div className="relative z-40 bg-white border border-slate-200 rounded-xl overflow-visible shadow-xs">
        <div className="min-h-[11rem] sm:h-52 w-full relative overflow-hidden rounded-t-xl bg-slate-900 p-3 sm:p-4 flex flex-col justify-between">
          <img
            src={project.heroImage}
            alt={project.propertyName}
            className="absolute inset-0 w-full h-full object-cover opacity-65"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Projects</span>
              </button>
            )}

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Portal Build Out Button */}
              <button
                type="button"
                onClick={() => setIsPortalBuildOutOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer"
                title="Open 18-question Portal Build Out form and export PDF"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Portal Build Out</span>
              </button>

              {isProjectClosed ? (
                <button
                  type="button"
                  onClick={() => setIsClosureSummaryOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer"
                  title="Generate official 1-page closure email"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Closure Email</span>
                </button>
              ) : isTrainingCsmActive ? (
                <button
                  type="button"
                  onClick={handleCopyCsmPortalLink}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer border border-purple-300"
                  title="Copy CSM Onboarding & Training Portal link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-700" />}
                  <span>{copiedLink ? 'CSM Link Copied!' : 'Copy CSM Link'}</span>
                </button>
              ) : isImplementationActive ? (
                <button
                  type="button"
                  onClick={handleSendImplementationBomProgressEmail}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer"
                  title="Send Smart Community BOM progress overview (high-level cards & individual line items without notes) via Email"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Send Deployment Overview Email Now</span>
                  <span className="sm:hidden">Send BOM Progress</span>
                </button>
              ) : isPortalBuildoutActive ? (
                !isKickoffCompletedInEntirety ? (
                  <button
                    type="button"
                    onClick={handleSendKickoffDocumentEmail}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer"
                    title="Send Kickoff document link to customer to continue filling out"
                  >
                    <FileSignature className="w-3.5 h-3.5 text-white" />
                    <span className="hidden sm:inline">Send Kickoff Document</span>
                    <span className="sm:hidden">Kickoff Doc</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendTouchBaseCheckinEmail}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer"
                    title="Send touch base check-in email giving customer an overview of completed items and upcoming milestone transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span className="hidden sm:inline">Touch base with customer</span>
                    <span className="sm:hidden">Touch Base</span>
                  </button>
                )
              ) : isProductAcquisitionActive ? (
                <button
                  type="button"
                  onClick={handleSendShippingUpdateEmail}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer"
                  title="Send full Shipping Dock update to customer via Gmail"
                >
                  <Truck className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Send Shipping update to Customer</span>
                  <span className="sm:hidden">Shipping Update</span>
                </button>
              ) : isKickoffCompletedInEntirety ? (
                <button
                  type="button"
                  onClick={handleSendImplementationBomProgressEmail}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer"
                  title="Send Deployment Overview Email Now"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Send Deployment Overview Email Now</span>
                  <span className="sm:hidden">Send Overview</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendKickoffDocumentEmail}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-800 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg transition-colors shadow-sm cursor-pointer"
                  title="Send Kickoff document to customer to continue filling out"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileSignature className="w-3.5 h-3.5 text-amber-600" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Send Kickoff Document'}</span>
                </button>
              )}

              <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono font-medium">
                Quote #{project.quoteNumber}
              </span>

              {onViewQuoteAnalysis && (
                <button
                  type="button"
                  onClick={() => onViewQuoteAnalysis(project.quoteId)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-lg transition-colors shadow-sm cursor-pointer"
                  title="Open quote counts breakdown"
                >
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                  <span className="hidden sm:inline">View Quote Counts</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-white rounded-b-xl border-t border-slate-100 relative z-10">
          {/* Title, Property Info & Personnel Selectors */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                {project.propertyName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-sky-100 text-sky-800 border border-sky-300">
                Operations Focus Tab
              </span>
              {project.isBomLocked && (
                <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Locked BOM Baseline
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="text-slate-900 font-semibold">{project.clientName}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.address}, {project.city}, {project.state}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <strong className="text-slate-900 font-mono">{project.unitsCount}</strong> Units
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 text-xs">Target Date:</span>
                <input
                  type="date"
                  value={project.targetCompletionDate}
                  onChange={(e) => {
                    const newTarget = e.target.value;
                    const newHealth = calculateProjectScheduleHealth(newTarget, project.statusTag, project.milestones, project.notes);
                    onUpdateProject({
                      ...project,
                      targetCompletionDate: newTarget,
                      statusTag: newHealth.effectiveTag,
                      lastUpdated: new Date().toISOString(),
                    });
                  }}
                  className="font-mono text-slate-900 font-bold bg-transparent focus:outline-none cursor-pointer text-xs"
                  title="Change target completion date (auto-updates project health tag)"
                />
              </span>
            </div>

            {/* Personnel Selectors: PM, CSM & Field Tech */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {/* Assigned PM */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-xs">Assigned PM:</span>
                <select
                  value={project.assignedPM.name}
                  onChange={(e) => {
                    const pm = AVAILABLE_PMS.find((p) => p.name === e.target.value);
                    if (pm) {
                      onUpdateProject({
                        ...project,
                        assignedPM: pm,
                        lastUpdated: new Date().toISOString(),
                      });
                    }
                  }}
                  className="font-bold text-sky-900 bg-transparent focus:outline-none cursor-pointer text-xs"
                >
                  {AVAILABLE_PMS.map((pm) => (
                    <option key={pm.name} value={pm.name}>
                      {pm.name} ({pm.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned CSM */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-xs">Assigned CSM:</span>
                <select
                  value={project.assignedCSM || 'Nicole Franklin'}
                  onChange={(e) => {
                    onUpdateProject({
                      ...project,
                      assignedCSM: e.target.value as CSMName,
                      lastUpdated: new Date().toISOString(),
                    });
                  }}
                  className="font-bold text-sky-900 bg-transparent focus:outline-none cursor-pointer text-xs"
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
                  value={normalizeFieldTech(project.assignedFieldTech)}
                  onChange={(e) => {
                    onUpdateProject({
                      ...project,
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
                  assignedPartners={getProjectIntegratorPartners(project)}
                  projectName={project.propertyName}
                  onChange={(updatedPartners) => {
                    const isNowDiy = updatedPartners.some(isDiyPartner);
                    const updatedProj = {
                      ...project,
                      integratorPartners: updatedPartners,
                      isDiyInstallation: isNowDiy,
                      lastUpdated: new Date().toISOString(),
                    };
                    updatedProj.partnerCourseBundle = buildProjectPrePackagedBundle(
                      updatedProj,
                      'BOM Scope Sync'
                    );
                    onUpdateProject(updatedProj);
                  }}
                />
              </div>

              {/* DIY Tag Toggle Button (Customer Self-Install) */}
              <button
                type="button"
                onClick={() => {
                  const currentPartners = getProjectIntegratorPartners(project);
                  const isCurrentlyDiy = project.isDiyInstallation || currentPartners.some(isDiyPartner);
                  const nextDiy = !isCurrentlyDiy;
                  let updatedPartners = [...currentPartners];

                  if (nextDiy) {
                    if (!updatedPartners.some(isDiyPartner)) {
                      updatedPartners = ['DIY (Customer Self-Install)', ...updatedPartners];
                    }
                  } else {
                    updatedPartners = updatedPartners.filter((p) => !isDiyPartner(p));
                    if (updatedPartners.length === 0) {
                      updatedPartners = ['SKBM'];
                    }
                  }

                  const updatedProj: OperationProject = {
                    ...project,
                    isDiyInstallation: nextDiy,
                    integratorPartners: updatedPartners,
                    lastUpdated: new Date().toISOString(),
                  };
                  updatedProj.partnerCourseBundle = buildProjectPrePackagedBundle(
                    updatedProj,
                    'BOM Scope Sync'
                  );
                  onUpdateProject(updatedProj);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  project.isDiyInstallation || getProjectIntegratorPartners(project).some(isDiyPartner)
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300 ring-2 ring-amber-400/20 shadow-2xs font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title="Toggle DIY Installation (Customer is performing hardware installation themselves)"
              >
                <Wrench
                  className={`w-3.5 h-3.5 ${
                    project.isDiyInstallation || getProjectIntegratorPartners(project).some(isDiyPartner)
                      ? 'text-amber-700'
                      : 'text-slate-400'
                  }`}
                />
                <span>
                  DIY Tag: {project.isDiyInstallation || getProjectIntegratorPartners(project).some(isDiyPartner) ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Assigned Integrator Partner Course Completion Status Badge */}
              <div
                className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs ${
                  partnerCourseEvaluation.isCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <GraduationCap
                  className={`w-3.5 h-3.5 shrink-0 ${
                    partnerCourseEvaluation.isCompleted ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                />
                <span className="font-semibold">Integrator Courses:</span>
                <span className="font-mono font-extrabold">
                  {partnerCourseEvaluation.isCompleted
                    ? `✓ Completed (${partnerCourseEvaluation.completedCoursesCount}/${partnerCourseEvaluation.totalCoursesCount} Passed)`
                    : `⏳ Not Completed (${partnerCourseEvaluation.completedCoursesCount}/${partnerCourseEvaluation.totalCoursesCount} Done · ${partnerCourseEvaluation.overallProjectCoursePct}%)`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const primaryPartner =
                      partnerCourseEvaluation.partnerStatuses[0]?.partnerShortName || 'SKBM';
                    setPartnerCourseCompletionForProject(
                      project,
                      primaryPartner,
                      !partnerCourseEvaluation.isCompleted
                    );
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                    partnerCourseEvaluation.isCompleted
                      ? 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-amber-200/80 text-amber-950 border-amber-400 hover:bg-amber-300'
                  }`}
                  title="Toggle assigned integrator course completion status for this project"
                >
                  {partnerCourseEvaluation.isCompleted ? 'Verified' : 'Mark Complete'}
                </button>
                {onOpenProjectInPartnerAcademy && (
                  <button
                    type="button"
                    onClick={() => onOpenProjectInPartnerAcademy(project)}
                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
                  >
                    Academy View
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pending Field Tech / Integrator Installation Updates Banner with "Confirm installation" button */}
          {(() => {
            const pendingChanges = (project.pendingInstallationChanges || []).filter((c) => c.status === 'pending');
            const pendingSOWs = (project.sowForecastItems || []).filter((s) => s.status === 'Completed' && s.pendingPMConfirmation);
            const pendingLogs = (project.installLogs || []).filter((l) => l.pendingPMConfirmation);
            const hasPending = pendingChanges.length > 0 || pendingSOWs.length > 0 || pendingLogs.length > 0;
            if (!hasPending) return null;

            return (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-2 border-amber-400 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-400">
                        Field Tech / Integrator Changes Pending PM Confirmation
                      </span>
                      <span className="text-xs text-slate-600 font-mono">
                        {pendingChanges.length + pendingSOWs.length + pendingLogs.length} pending updates
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-amber-950 mt-1">
                      On-site installation work completed and submitted for project commit
                    </h4>
                    <div className="text-xs text-amber-900/90 mt-1 space-y-1">
                      {pendingChanges.map((c) => (
                        <div key={c.id} className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-slate-900">• {c.title}</span>
                          <span className="text-slate-600">by <strong className="text-amber-950">{c.submittedBy}</strong></span>
                          <span className="text-slate-400">·</span>
                          <span className="font-mono text-[11px] text-slate-700">{c.details}</span>
                        </div>
                      ))}
                      {pendingSOWs
                        .filter((s) => !pendingChanges.some((c) => c.sourceId === s.id))
                        .map((s) => (
                          <div key={s.id} className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-slate-900">• SOW Completed: {s.workDescription || s.bomItemName}</span>
                            <span className="text-slate-600">by <strong className="text-amber-950">{s.assignedInstaller}</strong></span>
                            <span className="text-slate-400">·</span>
                            <span className="font-mono text-[11px] text-slate-700">{s.buildingOrArea} ({s.forecastedQuantity} units)</span>
                          </div>
                        ))}
                      {pendingLogs
                        .filter((l) => !pendingChanges.some((c) => c.sourceId === l.id))
                        .map((l) => (
                          <div key={l.id} className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-slate-900">• Installer Log: {l.itemName} (+{l.quantityCompleted})</span>
                            <span className="text-slate-600">by <strong className="text-amber-950">{l.installerName}</strong></span>
                            <span className="text-slate-400">·</span>
                            <span className="font-mono text-[11px] text-slate-700">{l.locationCompleted} ({l.statusCheck})</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => handleConfirmInstallation()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer transition-transform hover:scale-105"
                    title="Confirm all pending installation updates and commit to project BOM"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm installation</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Unified Panel: Deployment Progress & Milestones (Left) + Project Health Tag (Right) */}
          <div data-tutorial-id="milestones-tracker-rail" className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {/* Left Side inside Panel: Deployment Progress Bar & Project Milestones */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span>Deployment Progress:</span>
                  <strong className="text-slate-900 font-mono">{deploymentPct}%</strong>
                  <span className="text-slate-500">
                    ({totalInstalledDevices.toLocaleString()} / {totalQuotedDevices.toLocaleString()} devices installed)
                  </span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">
                    Click any milestone card to update status ({project.milestones.filter((m) => m.status === 'Completed').length}/{project.milestones.length} Done)
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Target: {project.targetCompletionDate}
                  </span>
                </div>
              </div>

              <div className="w-full h-3 bg-white rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                  style={{ width: `${deploymentPct}%` }}
                />
              </div>

              {/* Milestones Horizontal Flow (7 Milestones — Design Removed) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-1.5 pt-1 text-center">
                {project.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    onClick={() => handleToggleMilestone(milestone.id)}
                    title={`Click to cycle status (${milestone.status})`}
                    className={`p-2 rounded-lg border text-xs transition-all cursor-pointer select-none ${
                      milestone.status === 'Completed'
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-semibold hover:bg-emerald-100/80'
                        : milestone.status === 'In Progress'
                        ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold ring-2 ring-sky-300/40 hover:bg-sky-100/80'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[10px] truncate">{milestone.title}</div>
                    <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                      {milestone.status === 'Completed' ? '✓ Done' : milestone.targetDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side inside Panel: PM Status Tag Controls with Auto-Tag and Weeks-Behind Indicator */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0 sm:pl-4 sm:border-l sm:border-slate-200/80">
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Project Health Tag
                </div>
                
                {/* Secondary Tag: Weeks Behind Badge */}
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                    health.isOverdue
                      ? health.weeksBehind > 2
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                  title={`Computed from target date ${project.targetCompletionDate}`}
                >
                  {health.weeksBehindLabel}
                </span>
              </div>
              
              {/* Interactive Tag Buttons - strictly reflect effective health tag */}
              <div className="flex items-center gap-1.5">
                {(['On Track', 'Behind Schedule', 'High Risk'] as ProjectStatusTag[]).map((tag) => {
                  const isActive = health.effectiveTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleStatusTagChange(tag)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? `${getStatusBadgeStyle(tag)} shadow-xs`
                          : 'bg-white border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-400'
                      }`}
                    >
                      {tag === 'On Track' && '✓ '}
                      {tag === 'Behind Schedule' && '⏳ '}
                      {tag === 'High Risk' && '⚠ '}
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Auto Status Helper */}
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span>Calculated Health:</span>
                <strong className="text-slate-700">{health.effectiveTag}</strong>
                <span>(≤2 wks = Behind, &gt;2 wks = High Risk)</span>
              </div>

              {/* Status Reason Context Input */}
              <div className="w-full text-right">
                {isEditingStatusReason ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={statusReasonInput}
                      onChange={(e) => setStatusReasonInput(e.target.value)}
                      placeholder="Specify status context / blocker..."
                      className="px-2 py-1 text-xs bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-sky-500 w-64 shadow-inner"
                    />
                    <button
                      onClick={handleSaveStatusReason}
                      className="p-1 bg-sky-600 hover:bg-sky-700 text-white rounded cursor-pointer"
                      title="Save reason"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-1.5 text-[11px] text-slate-600 mt-0.5">
                    <span className="truncate max-w-[280px]" title={project.statusReason}>
                      {project.statusReason || 'No status alerts currently flagged.'}
                    </span>
                    <button
                      onClick={() => setIsEditingStatusReason(true)}
                      className="text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                      title="Edit status note"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Small Text Button to Expand/Minimize Mitigation Plan */}
              <div className="pt-1.5 border-t border-slate-200/70 w-full flex items-center justify-between sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMitigationPlan((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold cursor-pointer transition-colors ${
                    showMitigationPlan
                      ? 'text-indigo-700 hover:text-indigo-900 underline'
                      : 'text-slate-500 hover:text-indigo-600'
                  }`}
                  title={showMitigationPlan ? 'Minimize Mitigation Plan' : 'Open tailored Mitigation Plan'}
                >
                  <ShieldAlert
                    className={`w-3.5 h-3.5 ${
                      health.effectiveTag === 'High Risk'
                        ? 'text-rose-500'
                        : health.effectiveTag === 'Behind Schedule'
                        ? 'text-amber-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{showMitigationPlan ? 'Hide Mitigation Plan' : 'Mitigation Plan'}</span>
                  <span className="text-[9px] text-slate-400 font-normal">
                    {showMitigationPlan ? '▲' : '▼'}
                  </span>
                  {(health.effectiveTag === 'Behind Schedule' || health.effectiveTag === 'High Risk') && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        health.effectiveTag === 'High Risk'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}
                    >
                      Active
                    </span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* CSM Intro - Pre-implementation Milestone Active: CSM Calendar Booking Link Automation Banner */}
      {(showCSMIntroBookingAlert || isOnCSMIntroMilestone) && (
        <div className="bg-gradient-to-r from-[#191E29] via-[#132D46] to-[#191E29] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-[#01C38D]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#01C38D]/20 border border-[#01C38D]/40 flex items-center justify-center shrink-0 shadow-inner">
              <Calendar className="w-5 h-5 text-[#01C38D]" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base font-['Plus_Jakarta_Sans'] flex flex-wrap items-center gap-2">
                <span>CSM Intro - Pre-Implementation • Calendar Booking Automation Active</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#01C38D]/20 text-[#01C38D] border border-[#01C38D]/40 font-bold">
                  Assigned CSM: {csmBookingProfile.name}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 max-w-3xl leading-relaxed">
                This project is on the <strong>CSM Intro - Pre-implementation</strong> milestone. Send the customer their designated CSM&apos;s Google Calendar booking link (<strong>{csmBookingProfile.name}</strong> — <em>&ldquo;{csmBookingProfile.quote}&rdquo;</em>) and full Quext CSM booking directory so they can book their training session.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setCsmPortalInitialMode('csm-intro-booking');
                setIsCSMTrainingOpen(true);
              }}
              className="px-4 py-2 bg-[#01C38D] hover:bg-[#00b07f] text-slate-950 font-black rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Send CSM Calendar Link &amp; Directory</span>
            </button>
            <a
              href={csmBookingProfile.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
              title={`Open ${csmBookingProfile.name}'s Google Calendar booking page`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#01C38D]" />
              <span>Book w/ {csmBookingProfile.name.split(' ')[0]}</span>
            </a>
            <a
              href={QUEXT_TRAINING_HELP_ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-white/5 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <span>All CSM Links</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {showCSMIntroBookingAlert && (
              <button
                type="button"
                onClick={() => setShowCSMIntroBookingAlert(false)}
                className="px-2.5 py-2 text-xs text-slate-300 hover:text-white"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* CSM Handoff Milestone Active / 7-Day Auto-Close Banner */}
      {(showCSMCompletedAlert || autoCloseInfo.isOnCsmHandoff) && (
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 shadow-inner">
              <Clock className="w-5 h-5 text-[#01C38D]" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base font-['Plus_Jakarta_Sans'] flex flex-wrap items-center gap-2">
                <span>CSM Handoff Milestone Active</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#01C38D]/20 text-[#01C38D] border border-[#01C38D]/40 font-bold">
                  {autoCloseInfo.isAlreadyClosed
                    ? 'Project Auto-Closed (7 Days Completed)'
                    : `Auto-Closes in ${autoCloseInfo.daysRemaining} Day${autoCloseInfo.daysRemaining === 1 ? '' : 's'} (7-Day Rule)`}
                </span>
              </div>
              <p className="text-xs text-purple-100 mt-1 max-w-2xl leading-relaxed">
                Implementation is transitioning to Customer Success Manager <strong>{project.assignedCSM || 'Nicole Franklin'}</strong>. Projects on the CSM Handoff milestone automatically close after 7 days.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setCsmPortalInitialMode('csm-handoff');
                setIsCSMTrainingOpen(true);
              }}
              className="px-4 py-2 bg-[#01C38D] hover:bg-[#00b07f] text-slate-950 font-black rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send CSM Handoff Info</span>
            </button>
            {!autoCloseInfo.isAlreadyClosed && (
              <button
                type="button"
                onClick={handleTrigger7DayAutoCloseNow}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                title="Simulate 7 days elapsed on CSM Handoff to trigger automatic project closure"
              >
                Simulate 7d Elapsed (Auto-Close)
              </button>
            )}
            {showCSMCompletedAlert && (
              <button
                type="button"
                onClick={() => setShowCSMCompletedAlert(false)}
                className="px-2.5 py-2 text-xs text-purple-200 hover:text-white"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* High Risk Operational Root Cause Assessment Banner */}
      {health.effectiveTag === 'High Risk' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200 pb-2.5">
            <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-rose-900 font-['Plus_Jakarta_Sans']">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>High Risk Operational Assessment &amp; Root Cause Analysis</span>
            </div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold font-mono bg-rose-200 text-rose-900 rounded uppercase">
              Critical Severity · Requires Immediate Mitigation
            </span>
          </div>

          <div className="text-xs text-rose-900/90 leading-relaxed space-y-2">
            <div className="p-3 bg-white/80 rounded-xl border border-rose-200">
              <span className="font-bold text-rose-950 uppercase tracking-wider text-[10px] block mb-1">
                Primary Timing &amp; Schedule Risk Factor:
              </span>
              <p className="font-semibold text-rose-950 text-xs sm:text-sm">
                {health.egregiousScheduleReason || `Project is egregiously behind schedule by ${health.weeksBehind} weeks (${health.diffDays} days past target date of ${project.targetCompletionDate}). Severe schedule variance is a major factor in this High Risk tag.`}
              </p>
              <p className="text-[11px] text-rose-800 mt-1">
                Being egregiously behind schedule jeopardizes physical deployment windows, subcontractor staging commitments, and milestone revenue collection.
              </p>
            </div>

            {health.overdueMilestones.length > 0 && (
              <div className="p-3 bg-white/80 rounded-xl border border-rose-200 space-y-1">
                <div className="font-bold text-rose-900 text-[11px] uppercase tracking-wider">
                  Overdue Milestone Bottlenecks:
                </div>
                {health.overdueMilestones.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-rose-800 text-xs">
                    <span>• {m.title}</span>
                    <span className="font-mono font-bold text-rose-950">Target Date: {m.targetDate}</span>
                  </div>
                ))}
              </div>
            )}

            {health.negativeNotes.length > 0 && (
              <div className="p-3 bg-white/80 rounded-xl border border-rose-200 space-y-1.5">
                <div className="font-bold text-rose-900 text-[11px] uppercase tracking-wider">
                  Impacting Field Roadblocks &amp; Negative Telemetry Notes:
                </div>
                {health.negativeNotes.map((note) => (
                  <div key={note.id} className="text-rose-900 text-xs">
                    <span className="font-bold text-rose-800">[{note.category}]</span> &quot;{note.text}&quot;{' '}
                    <span className="text-slate-500 font-mono text-[10px]">({note.author}, {note.timestamp})</span>
                  </div>
                ))}
              </div>
            )}

            {project.statusReason && (
              <div className="text-[11px] text-rose-900 italic pt-1 border-t border-rose-200/70">
                <strong>PM Documented Cause:</strong> &quot;{project.statusReason}&quot;
              </div>
            )}
          </div>
        </div>
      )}

      {/* PMP Tailored Mitigation & Schedule Recovery Plan (Minimized behind small text button on Project Health Tag section) */}
      {showMitigationPlan && (
        <div id="pmp-mitigation-plan-container" className="scroll-mt-36 animate-in fade-in duration-200">
          <PMPMitigationPlanPanel
            project={project}
            onUpdateProject={onUpdateProject}
            variant="full"
            defaultExpanded={false}
            onMinimize={() => setShowMitigationPlan(false)}
          />
        </div>
      )}

      {/* Project Workspace Tab Navigation + Mobile Quick Section Jump Bar */}
      <div className="sticky top-[104px] z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2 shadow-xs space-y-2 overflow-visible">
        <div className="flex flex-wrap items-center justify-between gap-2 overflow-visible">
          <div className="flex flex-wrap items-center gap-1.5 overflow-visible">
            <button
              type="button"
              onClick={() => setActiveTab('field-bom')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'field-bom'
                  ? 'bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Operations &amp; Field BOM</span>
            </button>

            {/* Customer Comms Control Panel Dropdown Tab */}
            <div
              ref={commsDropdownRef}
              className="relative inline-block"
              onMouseEnter={() => setIsCommsDropdownOpen(true)}
              onMouseLeave={() => setIsCommsDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('customer-comms');
                  setIsCommsDropdownOpen((prev) => !prev);
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'customer-comms' || activeTab === 'customer-kickoff'
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {activeTab === 'customer-kickoff' ? 'Customer Kickoff Walkthrough' : 'Customer Comms'}
                </span>
                {(!project.customerIntake?.walkthroughCompleted || commonDoors.length === 0) && (
                  <span className={`hidden sm:inline text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    activeTab === 'customer-comms' || activeTab === 'customer-kickoff' ? 'bg-amber-400 text-slate-950' : 'bg-amber-200 text-amber-900'
                  }`}>
                    Action Needed
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${isCommsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Dropdown Window */}
              {isCommsDropdownOpen && (
                <div className="absolute left-0 top-full pt-1.5 z-50 animate-fadeIn">
                  <div className="w-[calc(100vw-2.5rem)] max-w-sm sm:w-96 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl p-3 space-y-2 ring-1 ring-slate-900/10">
                    <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Customer Communications &amp; Kickoff
                      </span>
                    </div>

                    {/* Option 1: Customer Comms Control Panel */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('customer-comms');
                        setIsCommsDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        activeTab === 'customer-comms'
                          ? 'bg-sky-50 border border-sky-300 shadow-2xs'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0 mt-0.5">
                        <MessageSquare className="w-4 h-4 text-sky-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-slate-900">Customer Comms Control Panel</span>
                          {activeTab === 'customer-comms' && (
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded">Active</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Automated weekly email cadence, dispatch overview, telemetry updates &amp; PM audit log.
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Customer Kickoff Walkthrough */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('customer-kickoff');
                        setIsCommsDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        activeTab === 'customer-kickoff'
                          ? 'bg-purple-50 border border-purple-300 shadow-2xs'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center shrink-0 mt-0.5">
                        <Presentation className="w-4 h-4 text-purple-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-slate-900">Customer Kickoff Walkthrough</span>
                          {project.customerIntake?.walkthroughCompleted ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">✓ Complete</span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">Pending Review</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          8-step interactive customer orientation: PMS selection, common door approvals &amp; staff permissions.
                        </p>
                      </div>
                    </button>

                    {/* Direct Link Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 px-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyKickoffLink();
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{copiedLink ? 'Kickoff Link Copied!' : 'Copy Direct Client Link'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('customer-kickoff');
                          setIsCommsDropdownOpen(false);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
                      >
                        <span>Open Walkthrough</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct 1-Tap Kickoff Walkthrough Button on Mobile/Tablet */}
            <button
              type="button"
              onClick={() => setActiveTab('customer-kickoff')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'customer-kickoff'
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 shrink-0" />
              <span>Kickoff Walkthrough</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyKickoffLink}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50 border border-sky-200 rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-sky-600" />}
              <span>{copiedLink ? 'Copied Kickoff Link!' : 'Copy Kickoff link'}</span>
            </button>

            <div className="text-[11px] text-slate-500 font-mono hidden md:block">
              {activeTab === 'customer-kickoff' ? 'Client Presentation Mode' : activeTab === 'customer-comms' ? 'Customer Communications' : 'Internal PM Technical View'}
            </div>
          </div>
        </div>

        {/* Horizontal Swipeable Section Jump Bar when viewing Operations & Field BOM */}
        {activeTab === 'field-bom' && (
          <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Jump to:
            </span>
            <a
              href="#pm-kickoff-intake"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Kickoff Intake
            </a>
            <a
              href="#pm-hardware-progress"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Hardware Progress
            </a>
            <a
              href="#pm-bom-table"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              BOM Table
            </a>
            <a
              href="#shipping-dock-section"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Shipping Dock
            </a>
            <a
              href="#sow-forecaster-section"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              SOW Forecaster
            </a>
            <a
              href="#pm-common-doors"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Common Doors
            </a>
            <a
              href="#pm-installer-logs"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Installer Log
            </a>
            <a
              href="#pm-project-notes"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Notes &amp; Milestones
            </a>
            <a
              href="#pm-financial-milestones"
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Financials
            </a>
          </div>
        )}
      </div>

      {/* VIEW 1: Customer Comms Control Panel */}
      {activeTab === 'customer-comms' && (
        <div data-tutorial-id="customer-comms-panel">
          <CustomerCommsControlPanel
            project={project}
            onUpdateProject={onUpdateProject}
            onOpenKickoffWalkthrough={() => setActiveTab('customer-kickoff')}
            onOpenCSMPortal={(mode) => {
              setCsmPortalInitialMode(mode || (isOnCSMIntroMilestone ? 'csm-intro-booking' : 'csm-handoff'));
              setIsCSMTrainingOpen(true);
            }}
          />
        </div>
      )}

      {/* VIEW 2: Customer Kickoff Walkthrough */}
      {activeTab === 'customer-kickoff' && (
        <CustomerKickoffWalkthrough
          project={project}
          onUpdateProject={onUpdateProject}
          onBackToTechnicalBOM={() => setActiveTab('field-bom')}
        />
      )}

      {/* VIEW 2: Technical Field BOM & Installer Logs */}
      {activeTab === 'field-bom' && (
        <>
          {/* Customer Kickoff Intake Form Results (Project Manager Clean View) */}
          <div id="pm-kickoff-intake" className="scroll-mt-36 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Customer Kickoff Intake Form Results (Project Manager View)
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
                    project.customerIntake?.walkthroughCompleted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                    {project.customerIntake?.walkthroughCompleted ? '✓ Customer Walkthrough Completed' : 'Pending Client Submission'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete intake records entered by client during the Kickoff Walkthrough. All credentials and configurations visible for PM staging.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('customer-kickoff')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Open Client Walkthrough</span>
                </button>
              </div>
            </div>

            {/* 4-Column High-Level Intake Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Box 1: PMS Integration & Entrata Password (Visible to PMs) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>PMS Integration</span>
                  <span className="font-mono text-[11px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {pmsChoice}
                  </span>
                </div>

                {pmsChoice === 'Entrata' ? (
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1.5 shadow-2xs">
                      <div>
                        <span className="text-slate-500">API URL:</span>{' '}
                        <span className="text-slate-800 font-medium truncate block">
                          {project.customerIntake?.entrataCredentials?.apiBaseUrl || 'https://api.entrata.com/v1'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Username:</span>{' '}
                        <strong className="text-slate-900 font-bold">
                          {project.customerIntake?.entrataCredentials?.username || 'quext_pms_sync'}
                        </strong>
                      </div>
                      
                      {/* Entrata Password (Explicitly Visible to Project Managers) */}
                      <div className="pt-1.5 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-900 font-bold">Entrata Password:</span>
                          <button
                            type="button"
                            onClick={() => setShowEntrataPassword(!showEntrataPassword)}
                            className="text-[10px] text-sky-700 hover:text-sky-900 font-semibold underline cursor-pointer"
                          >
                            {showEntrataPassword ? 'Mask' : 'Reveal'}
                          </button>
                        </div>
                        <div className="mt-1 flex items-center justify-between bg-amber-50 px-2 py-1 rounded border border-amber-200">
                          <span className="font-bold text-amber-950 font-mono select-all">
                            {showEntrataPassword
                              ? project.customerIntake?.entrataCredentials?.password || 'EntrataPass#2026!'
                              : '••••••••••••••••'}
                          </span>
                          <span className="text-[9px] font-bold text-amber-800 uppercase">
                            PM Visible
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Ready for API bridge syncing</span>
                    </div>
                  </div>
                ) : pmsChoice === 'None' ? (
                  <p className="text-xs text-slate-500">
                    Client selected &quot;None&quot; (Standalone Quext Cloud Tenant).
                  </p>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                      <strong>PMS Partner:</strong> Client instructed to authorize Quext in {pmsChoice} App Store.
                    </div>
                  </div>
                )}
              </div>

              {/* Box 2: Operational Parameters & Setpoints */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Climate &amp; Keys</span>
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-500">Thermostat Setpoints:</span>
                    <div className="font-semibold text-slate-900 font-mono mt-0.5">
                      {project.customerIntake?.thermostatTempRange || '65°F cool min / 75°F heat max'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Emergency Access &amp; Knox:</span>
                    <div className="font-semibold text-slate-900 mt-0.5 truncate">
                      {project.customerIntake?.fireKeysFobs || 'Fire Knox Box #4, 2 Master Fobs'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Access Groups / Notes:</span>
                    <div className="font-semibold text-slate-800 mt-0.5 truncate">
                      {project.customerIntake?.customGroupsNotes || 'Standard resident & amenity tiers'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Community Site Contacts */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Community Site Contact</span>
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-500">Site Phone Number:</span>
                    <div className="font-bold text-slate-900 font-mono mt-0.5">
                      {project.customerIntake?.sitePhoneNumber || '(512) 555-8900'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Community Email:</span>
                    <div className="font-semibold text-slate-900 mt-0.5 truncate">
                      {project.customerIntake?.communityEmail || `${project.propertyName.toLowerCase().replace(/[^a-z0-9]/g, '')}@property.com`}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Time Zone &amp; Priority Dates:</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {project.customerIntake?.timeZone || 'Central Time (CT)'} · {project.customerIntake?.priorityDating || 'Immediate'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 4: Common Doors & Walkthrough Subscription */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Doors &amp; Subscription</span>
                  <DoorOpen className="w-3.5 h-3.5 text-purple-600" />
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Common Doors Tree:</span>
                    <strong className="text-slate-900 font-mono">{commonDoors.length} Doors Configured</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Client Door Approval:</span>
                    <span className="font-bold text-emerald-700">
                      {project.customerIntake?.doorsConfirmedByCustomer ? '✓ Confirmed by Client' : 'Pending Client Review'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Email Updates Subscriber:</span>
                    <div className="font-mono text-slate-900 text-[10px] truncate mt-0.5">
                      {project.customerIntake?.subscriberEmail || project.assignedPM.email}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Cadence: <strong className="text-sky-700 uppercase">{project.customerIntake?.emailUpdatesCadence || 'WEEKLY'}</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: QR Intercom, NFC Wallet Upgrade, and Site Plan Gateway PDF Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                    <span>QR Intercom Feature</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {project.customerIntake?.qrIntercomLogoName
                      ? `Logo: ${project.customerIntake.qrIntercomLogoName}`
                      : 'No QR Intercom logo uploaded yet'}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isQrIntercomEnabled
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {isQrIntercomEnabled ? 'Active' : 'Off'}
                </span>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NFC Wallet Upgrade</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {project.customerIntake?.nfcCardArtPhotoName
                      ? `Card Art: ${project.customerIntake.nfcCardArtPhotoName}`
                      : 'No property card art photo uploaded yet'}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isNfcEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {isNfcEnabled ? 'Active' : 'Off'}
                </span>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Site Maps Gateway PDF</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {!projectHasGatewayOrHubOnBOM(project.bomItems)
                      ? 'Not required (No Gateway/Hub on BOM)'
                      : project.customerIntake?.sitePlanPdfName
                      ? `${project.customerIntake.sitePlanPdfName} (${project.customerIntake.sitePlanConfirmedEdited ? 'Confirmed Edited' : 'Pending Edit Check'})`
                      : 'Awaiting client Site Plan PDF upload'}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  project.customerIntake?.sitePlanPdfName
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {project.customerIntake?.sitePlanPdfName ? 'Uploaded' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Staff Roster & Access Permissions Table */}
            {staffMembers.length > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Authorized Staff Roster &amp; Permissions ({staffMembers.length} Members)</span>
                  <Users2 className="w-4 h-4 text-slate-400" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50 text-slate-600 font-semibold text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Staff Name</th>
                        <th className="py-2 px-3">Role / Title</th>
                        <th className="py-2 px-3">Email Address</th>
                        <th className="py-2 px-3">Phone</th>
                        <th className="py-2 px-3 text-right">Permission Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staffMembers.map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-bold text-slate-900">{st.firstName} {st.lastName}</td>
                          <td className="py-2 px-3 text-slate-600">{st.roleOrTitle || 'Onsite Staff'}</td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-700">{st.email}</td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{st.phoneNumber}</td>
                          <td className="py-2 px-3 text-right">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              st.permissionLevel === 'Manager'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : st.permissionLevel === 'Staff'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {st.permissionLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Visual Graph Showing Progress & Hardware Categories Progress Breakdown (with NFC Wallet Upgrade & QR Intercom Feature Checkboxes) */}
          <div id="pm-hardware-progress" className="scroll-mt-36">
            <ProgressGraph
              bomItems={project.bomItems}
              installLogs={project.installLogs}
              targetCompletionDate={project.targetCompletionDate}
              onUpdateThermostatBrand={handleUpdateThermostatBrandAll}
              useNfcWallet={isNfcEnabled}
              useQrIntercom={isQrIntercomEnabled}
              onToggleFeature={handleToggleProjectFeature}
            />
          </div>

          {/* Smart Community Bill of Materials (BOM) Table with Post-It Note Window & Thermostat Brand Selector */}
          <div id="pm-bom-table" data-tutorial-id="hardware-bom-table" className="scroll-mt-36">
            <BOMTable
              items={project.bomItems}
              allProjectLogs={project.installLogs}
              commonAreaDoors={commonDoors}
              projectIntegratorPartners={getProjectIntegratorPartners(project)}
              onUpdateInstalledCount={handleUpdateInstalledCount}
              onSaveRowLog={handleSaveRowLog}
              onUpdateThermostatBrand={handleUpdateThermostatBrand}
              onUpdateLockFinishConfig={handleUpdateLockFinishConfig}
              onToggleSparesDelivered={handleToggleSparesDelivered}
              onDeleteLog={handleDeleteLog}
              project={project}
              quotesList={quotesList}
              onAddBOMItem={handleAddBOMItemOverride}
            />
          </div>

          {/* Shipping Dock (Under BOM Section) + Product Acceptance Portal */}
          <div id="shipping-dock-section" data-tutorial-id="shipping-dock-section" className="scroll-mt-36">
            <ShippingDockSection
              project={project}
              onUpdateProject={onUpdateProject}
            />
          </div>

          {/* SOW Forecaster Section (Installer Scope Forecast Matched Against BOM Line Items) */}
          <div id="sow-and-mitigation-section" data-tutorial-id="sow-and-mitigation-section" className="scroll-mt-36">
            <SOWForecasterSection
              project={project}
              onUpdateProject={onUpdateProject}
              editorRole="pm"
              editorName={project.assignedPM?.name || 'Project Manager'}
              onConfirmInstallation={handleConfirmInstallation}
            />
          </div>

          {/* COMMON AREA DOORS LOCATION TREE & DEVICE COMMISSIONING TRACKER */}
          <div id="pm-common-doors" className="scroll-mt-36 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Common Area Doors Location Tree & Device Mapping
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-200 rounded font-bold">
                    {commonDoors.length} Doors
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filled out by customer during kickoff. Select from the dropdown which specific hardware device was installed at each location.
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

            {/* Quick Add Door Form */}
            {isAddingDoor && (
              <form onSubmit={handleAddCustomDoor} className="p-4 bg-sky-50/50 border border-sky-200 rounded-lg space-y-3">
                <div className="text-xs font-bold text-sky-900">Add New Common Area Door to Project</div>
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

            {/* Doors Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                    <th className="py-2.5 px-3">Door Location Name</th>
                    <th className="py-2.5 px-3">Building / Area</th>
                    <th className="py-2.5 px-3 min-w-[240px]">Corresponding BOM Line Item</th>
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
                        No common area doors logged yet. Customer can submit doors via Kickoff Walkthrough or you can click &quot;+ Add Door Location&quot; above.
                      </td>
                    </tr>
                  ) : (
                    commonDoors.map((door) => (
                      <tr key={door.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {door.doorName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {door.buildingOrArea || 'Main Area'}
                        </td>
                        
                        {/* Device Picker Dropdown */}
                        <td className="py-2.5 px-3">
                          <select
                            value={door.installedDeviceId || ''}
                            onChange={(e) => {
                              const selectedItem = project.bomItems.find((i) => i.id === e.target.value);
                              handleUpdateDoor(door.id, {
                                installedDeviceId: e.target.value,
                                installedDeviceName: selectedItem ? selectedItem.name : e.target.value ? 'Custom Hardware' : '',
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
                              {project.bomItems
                                .filter((i) => i.category !== 'Smart Access Control' && i.category !== 'Common Area & Utilities')
                                .map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name} ({item.category})
                                  </option>
                                ))}
                            </optgroup>
                          </select>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-2.5 px-3">
                          <select
                            value={door.installedStatus}
                            onChange={(e) =>
                              handleUpdateDoor(door.id, {
                                installedStatus: e.target.value as CommonAreaDoor['installedStatus'],
                                installedDate: e.target.value !== 'Pending' ? (door.installedDate || '2026-10-21') : undefined,
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
                            <option value="Installed & Online">✓ Installed & Online</option>
                            <option value="Wired & Calibrated">⚡ Wired & Calibrated</option>
                            <option value="Needs Service">⚠ Needs Service</option>
                          </select>
                        </td>

                        {/* Completed Date */}
                        <td className="py-2.5 px-3">
                          <input
                            type="date"
                            value={door.installedDate || ''}
                            onChange={(e) => handleUpdateDoor(door.id, { installedDate: e.target.value })}
                            className="text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-700"
                          />
                        </td>

                        {/* Installer Notes */}
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            placeholder="Latch verified, strike plate..."
                            value={door.installerNotes || ''}
                            onChange={(e) => handleUpdateDoor(door.id, { installerNotes: e.target.value })}
                            className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-700 focus:outline-none focus:border-sky-500"
                          />
                        </td>

                        {/* Action */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteDoor(door.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
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
          </div>

          {/* Historical Installer Completion Log & Field Media Carousel (Horizontal Scroll Between Logs and Photos/Audio) */}
          <div id="pm-installer-logs" className="scroll-mt-36">
            <InstallLogsAndMediaContainer
              project={project}
              logs={project.installLogs}
              bomItems={project.bomItems}
              projectIntegratorPartners={getProjectIntegratorPartners(project)}
              onAddLog={handleAddLog}
              onDeleteLog={handleDeleteLog}
              editorRole="pm"
              editorName={project.assignedPM?.name || 'Project Manager'}
              assignedPM={project.assignedPM}
              onConfirmInstallation={handleConfirmInstallation}
              onApproveOverAllocation={handleApproveOverAllocation}
              onDenyOverAllocation={handleDenyOverAllocation}
              onOpenInstallersClip={() => setIsInstallersClipOpen(true)}
            />
          </div>

          {/* General Project Notes Section & Context */}
          <div id="pm-project-notes" className="scroll-mt-36">
            <ProjectNotesSection
              notes={project.notes}
              milestones={project.milestones}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onToggleMilestone={handleToggleMilestone}
            />
          </div>

          {/* FINANCIAL MILESTONES (PM Checkoff: 50% Collected, 30% Collected, Final 20% Collected, SAAS Started + date prompt) */}
          <div id="pm-financial-milestones" className="scroll-mt-36 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Financial Milestones
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    PM Financial Checkoff
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check off project cash collection checkpoints and document SAAS activation date.
                </p>
              </div>

              {project.financialMilestones?.saasStarted && project.financialMilestones?.saasStartDate && (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-mono text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SAAS Active Since: <strong>{project.financialMilestones.saasStartDate}</strong></span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 50% Collected */}
              <div
                onClick={() => handleToggleFinancialMilestone('fiftyPercentCollected')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  (project.financialMilestones?.fiftyPercentCollected ?? project.financialMilestones?.twentyPercentCollected)
                    ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">50% Collected</div>
                  <div className="text-[11px] text-slate-500">Deposit &amp; equipment staging</div>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  (project.financialMilestones?.fiftyPercentCollected ?? project.financialMilestones?.twentyPercentCollected)
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300'
                }`}>
                  {(project.financialMilestones?.fiftyPercentCollected ?? project.financialMilestones?.twentyPercentCollected) && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* 30% Collected */}
              <div
                onClick={() => handleToggleFinancialMilestone('thirtyPercentCollected')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  project.financialMilestones?.thirtyPercentCollected
                    ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">30% Collected</div>
                  <div className="text-[11px] text-slate-500">Mid-point installation progress</div>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  project.financialMilestones?.thirtyPercentCollected
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300'
                }`}>
                  {project.financialMilestones?.thirtyPercentCollected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Final 20% Collected */}
              <div
                onClick={() => handleToggleFinancialMilestone('finalTwentyPercentCollected')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  project.financialMilestones?.finalTwentyPercentCollected
                    ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900">Final 20% Collected</div>
                  <div className="text-[11px] text-slate-500">Substantial completion & closeout</div>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  project.financialMilestones?.finalTwentyPercentCollected
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300'
                }`}>
                  {project.financialMilestones?.finalTwentyPercentCollected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* SAAS Started */}
              <div
                onClick={() => handleToggleFinancialMilestone('saasStarted')}
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  project.financialMilestones?.saasStarted
                    ? 'bg-indigo-50 border-indigo-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-slate-900">SAAS Started</div>
                    <div className="text-[11px] text-slate-500">Recurring platform billing</div>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    project.financialMilestones?.saasStarted
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-300'
                  }`}>
                    {project.financialMilestones?.saasStarted && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {project.financialMilestones?.saasStarted && project.financialMilestones?.saasStartDate && (
                  <div className="mt-2 pt-1.5 border-t border-indigo-200 text-[11px] text-indigo-900 font-mono">
                    Start Date: <strong className="font-bold">{project.financialMilestones.saasStartDate}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TEAM ASSISTS NODE (Leadership & Cross-Functional Assist History) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Team Assists
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold border border-sky-300">
                    {(project.teamAssists || []).length} Recorded
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  History of assistance provided to unblock field roadblocks on this project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAssistModalOpen(true);
                  setAssistDate(new Date().toISOString().split('T')[0]);
                  setAssistDetails('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Assistance</span>
              </button>
            </div>

            {/* List of Team Assists */}
            {(project.teamAssists || []).length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                No team assists logged yet for this project. Click <strong>&quot;+ Log Assistance&quot;</strong> or log assistance from the All Projects Overview dashboard.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                {(project.teamAssists || []).map((assist) => (
                  <div key={assist.id} className="p-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50 text-xs">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{assist.loggedBy}</span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
                          Date: {assist.date}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {assist.assistanceDetails}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      Logged {new Date(assist.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTTOM-LEFT: Manual Link Project Dropdown Button & History */}
          <div className="pt-4 border-t border-slate-200">
            <ManualLinkProjectPanel
              project={project}
              quotesList={quotesList}
              onUpdateProject={onUpdateProject}
            />
          </div>
        </>
      )}

      {/* Portal Build Out 18-Question Modal */}
      <PortalBuildOutModal
        project={project}
        isOpen={isPortalBuildOutOpen}
        onClose={() => setIsPortalBuildOutOpen(false)}
        onSaveToProject={onUpdateProject}
      />

      {/* CSM Calendar Booking & Handoff Portal Modal */}
      {isCSMTrainingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full my-auto">
            <CSMTrainingPortal
              project={project}
              onClose={() => setIsCSMTrainingOpen(false)}
              onUpdateProject={onUpdateProject}
              initialMode={csmPortalInitialMode}
            />
          </div>
        </div>
      )}

      {/* 1-Page Project Closure Summary Email Modal */}
      <ProjectClosureSummaryModal
        project={project}
        isOpen={isClosureSummaryOpen}
        onClose={() => setIsClosureSummaryOpen(false)}
        onSendEmail={(emailData) => {
          const newLog = {
            id: `closure-${Date.now()}`,
            projectId: project.id,
            timestamp: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            type: 'closure_summary_email' as const,
            recipientEmail: emailData.recipientEmail,
            subject: emailData.subject,
            summary: `Dispatched 1-page Project Closure Summary certificate with CSM introduction (CC: ${emailData.ccEmail}).`,
            sentBy: project.assignedPM.name,
            status: 'Sent' as const,
          };
          onUpdateProject({
            ...project,
            customerCommsLogs: [newLog, ...(project.customerCommsLogs || [])],
            lastUpdated: new Date().toISOString(),
          });
        }}
      />

      {/* SAAS Start Date Prompt Modal */}
      {isSaasDateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Enter SAAS Start Date</h3>
                <p className="text-xs text-slate-500">Document the date recurring SAAS billing commenced for this property.</p>
              </div>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  SAAS Activation Date
                </label>
                <input
                  type="date"
                  value={saasStartDateInput}
                  onChange={(e) => setSaasStartDateInput(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSaasDateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSaasStartDate}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Confirm SAAS Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Assistance Provided (Team Assists) Modal */}
      {isAssistModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                  <Users2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Provide Assistance</h3>
                  <p className="text-xs text-slate-500">Record assistance provided for {project.propertyName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssistModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectAssist} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date of Assistance
                </label>
                <input
                  type="date"
                  value={assistDate}
                  onChange={(e) => setAssistDate(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  What was done?
                </label>
                <textarea
                  rows={4}
                  value={assistDetails}
                  onChange={(e) => setAssistDetails(e.target.value)}
                  placeholder="Detail the support, leadership escalation, technical unblocking, or customer alignment provided..."
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssistModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!assistDetails.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save to Team Assists
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Installers Clip Modal for fast mobile or desktop field logs & media */}
      <InstallersClipModal
        isOpen={isInstallersClipOpen}
        onClose={() => setIsInstallersClipOpen(false)}
        projects={[project]}
        onUpdateProject={onUpdateProject}
        initialProjectId={project.id}
        activeInstallerName={project.assignedPM?.name || 'Quext Field Operations'}
        installerRole="pm"
        companyName={getProjectIntegratorPartners(project)[0] || 'Integrator Partner'}
      />

      {/* Real Gmail Confirmation Modal for dispatches from ProjectDetailView */}
      <LiveGmailConfirmModal
        payload={gmailModalPayload}
        onClose={() => setGmailModalPayload(null)}
      />

    </div>
  );
};
