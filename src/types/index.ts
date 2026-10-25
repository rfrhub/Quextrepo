import type { PrePackagedProjectCourseBundle } from '../partner-academy/utils/projectCoursePackager';

export type DealStage = 
  | 'Prospect'
  | 'Needs Analysis'
  | 'Proposal Sent'
  | 'Contract Review'
  | 'Deal Won'
  | 'Closed Lost';

export type ProjectStatusTag = 'On Track' | 'Behind Schedule' | 'High Risk';

export type ThermostatBrand = 'Quext' | 'Honeywell';

export type BOMCategory = 
  | 'Smart Access Control'
  | 'Smart Thermostats & HVAC'
  | 'IoT Gateways & Mesh'
  | 'Sensors & Leak Protection'
  | 'Bulk Managed Wi-Fi'
  | 'Common Area & Utilities';

export interface InstallLogEntry {
  id: string;
  projectId: string;
  timestamp: string; // ISO or human date/time
  installerName: string;
  itemId: string;
  itemName: string;
  quantityCompleted: number;
  locationCompleted: string; // e.g. "Bldg 3, Units 301-316"
  statusCheck: 'Verified & Online' | 'Signal Testing Passed' | 'Pending LoRa Sync' | 'Hardware Swapped';
  notes: string;
  color?: 'yellow' | 'cyan' | 'emerald' | 'rose' | 'amber';
}

export interface BOMItem {
  id: string;
  name: string;
  model: string;
  category: BOMCategory;
  location: string;
  quantity: number; // Quoted Base Quantity
  installedCount: number; // Installed Quantity (Fillable by PM)
  unitPrice: number;
  description?: string;
  thermostatBrand?: ThermostatBrand; // Ability to specify if Honeywell or Quext thermostat!
  postItLogs?: InstallLogEntry[]; // Stored and logged within its corresponding row!
  sparesCount?: number; // Spares included in line item total, but distinct from installed device count
  sparesDelivered?: boolean; // Subtle confirmation by PM that spares have been delivered to customer
}

export interface ProjectNote {
  id: string;
  projectId: string;
  author: string;
  timestamp: string;
  category: 'General Context' | 'Site Access & Keys' | 'Hardware Delivery' | 'Inspection & Commissioning' | 'Resident Notice';
  text: string;
  isPinned?: boolean;
}

export type OperationMilestoneTitle =
  | 'Project kickoff'
  | 'Portal Buildout'
  | 'Product Acquisition'
  | 'CSM Intro - Pre-implementation'
  | 'Implementation'
  | 'CSM Handoff'
  | 'Project Closed';

export const DEFAULT_OPERATION_MILESTONES: readonly OperationMilestoneTitle[] = [
  'Project kickoff',
  'Portal Buildout',
  'Product Acquisition',
  'CSM Intro - Pre-implementation',
  'Implementation',
  'CSM Handoff',
  'Project Closed',
] as const;

export interface ProjectMilestone {
  id: string;
  title: OperationMilestoneTitle | string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  targetDate: string;
  startedAt?: string;
  completedDate?: string;
  notes?: string;
}

export interface ProjectManagerInfo {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
}

export const AVAILABLE_PMS: ProjectManagerInfo[] = [
  {
    name: 'Raul Recalde',
    email: 'raul.recalde@onequext.com',
    role: 'Director of Implementation',
    phone: '(806) 555-0142',
  },
  {
    name: 'Bethany Condon',
    email: 'bethany.condon@onequext.com',
    role: 'Project Manager',
    phone: '(806) 555-0188',
  },
  {
    name: 'Megan Rossman',
    email: 'megan.rossman@onequext.com',
    role: 'Director of Operations',
    phone: '(806) 555-0193',
  },
];

export type CSMName =
  | 'Nicole Franklin'
  | 'Jasmine Hunt'
  | 'Tessa Peshke'
  | 'Branden Girman'
  | 'Kennedy Staiger';

export const AVAILABLE_CSMS: CSMName[] = [
  'Nicole Franklin',
  'Jasmine Hunt',
  'Tessa Peshke',
  'Branden Girman',
  'Kennedy Staiger',
];

export const QUEXT_TRAINING_HELP_ARTICLE_URL =
  'https://help.quext.io/en/articles/14668354-schedule-a-training-session';

export interface CSMCalendarBookingProfile {
  name: CSMName;
  title: string;
  email: string;
  phone: string;
  quote: string;
  bookingUrl: string;
  avatar: string;
}

export const CSM_CALENDAR_BOOKING_DIRECTORY: CSMCalendarBookingProfile[] = [
  {
    name: 'Nicole Franklin',
    title: 'Sr. Customer Success Manager',
    email: 'nicole.franklin@onequext.com',
    phone: '(800) 656-1391 ext. 402',
    quote: 'Looking forward to working together and supporting our continued success!',
    bookingUrl: 'https://calendar.app.google/8TxNgeYGM9q7CyGS7',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Jasmine Hunt',
    title: 'Customer Success Manager',
    email: 'jasmine.hunt@onequext.com',
    phone: '(800) 656-1391 ext. 405',
    quote: 'Here to help you feel like a pro in no time!',
    bookingUrl: 'https://calendar.app.google/n8heSwNNv61522KY7',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Branden Girman',
    title: 'Customer Success Manager',
    email: 'branden.girman@onequext.com',
    phone: '(800) 656-1391 ext. 408',
    quote: "Together we'll make sure everything works exactly the way you need it to.",
    bookingUrl: 'https://calendar.app.google/jBmNJcj2hV7pGkHT6',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Kennedy Staiger',
    title: 'Customer Success Manager',
    email: 'kennedy.staiger@onequext.com',
    phone: '(800) 656-1391 ext. 411',
    quote: 'Let’s make this simple, smooth, and maybe even a little fun ✨',
    bookingUrl:
      'https://calendar.google.com/calendar/u/0/appointments/AcZssZ2yU3QgaosV_a0YWXE0tu5E71haVmpKd15Xyb0=',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    name: 'Tessa Peshke',
    title: 'Customer Success Manager',
    email: 'tessa.peshke@onequext.com',
    phone: '(800) 656-1391 ext. 414',
    quote: 'Here to ensure your staff and residents get the most out of Quext Smart Communities!',
    bookingUrl: 'https://help.quext.io/en/articles/14668354-schedule-a-training-session',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200&h=200',
  },
];

export function getCSMCalendarBookingProfile(csmName?: string | null): CSMCalendarBookingProfile {
  const found = CSM_CALENDAR_BOOKING_DIRECTORY.find(
    (c) => c.name.toLowerCase() === (csmName || 'Nicole Franklin').trim().toLowerCase()
  );
  return found || CSM_CALENDAR_BOOKING_DIRECTORY[0];
}

export type FieldTechName = 'Hector Lopez' | 'Sean Gates';

export const AVAILABLE_FIELD_TECHS: FieldTechName[] = [
  'Hector Lopez',
  'Sean Gates',
];

export function normalizeFieldTech(tech?: string | null): FieldTechName {
  if (!tech) return 'Hector Lopez';
  const trimmed = tech.trim().toLowerCase();
  if (trimmed.includes('sean') || trimmed.includes('gates')) {
    return 'Sean Gates';
  }
  return 'Hector Lopez';
}

export const DEFAULT_INTEGRATOR_PARTNERS: readonly string[] = [
  'SKBM',
  'ATB',
  'SBH',
  'Everbase',
  'JTS',
  'RMR',
  'All Media',
] as const;

export type DefaultIntegratorPartner = typeof DEFAULT_INTEGRATOR_PARTNERS[number];

export interface UsedIntegratorHistoryEntry {
  name: string;
  lastUsedAt: string;
  lastUsedOnProject?: string;
  usedCount: number;
}

export const STORAGE_KEY_CUSTOM_INTEGRATORS = 'quext_custom_integrator_partners';
export const STORAGE_KEY_USED_INTEGRATORS_HISTORY = 'quext_used_integrators_history_v1';

export function isMainIntegratorPartner(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return DEFAULT_INTEGRATOR_PARTNERS.some((p) => p.toLowerCase() === normalized);
}

export function loadUsedIntegratorHistory(
  projects?: { propertyName?: string; integratorPartners?: string[] }[]
): UsedIntegratorHistoryEntry[] {
  const map = new Map<string, UsedIntegratorHistoryEntry>();

  try {
    const rawHistory = localStorage.getItem(STORAGE_KEY_USED_INTEGRATORS_HISTORY);
    if (rawHistory) {
      const parsed = JSON.parse(rawHistory);
      if (Array.isArray(parsed)) {
        parsed.forEach((entry: any) => {
          if (entry && typeof entry.name === 'string' && entry.name.trim()) {
            const cleanName = entry.name.trim();
            if (!isMainIntegratorPartner(cleanName)) {
              map.set(cleanName.toLowerCase(), {
                name: cleanName,
                lastUsedAt: entry.lastUsedAt || 'Previously used',
                lastUsedOnProject: entry.lastUsedOnProject,
                usedCount: typeof entry.usedCount === 'number' && entry.usedCount > 0 ? entry.usedCount : 1,
              });
            }
          }
        });
      }
    }

    // Also migrate any legacy string array entries from STORAGE_KEY_CUSTOM_INTEGRATORS
    const rawLegacy = localStorage.getItem(STORAGE_KEY_CUSTOM_INTEGRATORS);
    if (rawLegacy) {
      const parsedLegacy = JSON.parse(rawLegacy);
      if (Array.isArray(parsedLegacy)) {
        parsedLegacy.forEach((item: any) => {
          if (typeof item === 'string' && item.trim()) {
            const cleanName = item.trim();
            const key = cleanName.toLowerCase();
            if (!isMainIntegratorPartner(cleanName) && !map.has(key)) {
              map.set(key, {
                name: cleanName,
                lastUsedAt: 'Saved in history',
                usedCount: 1,
              });
            }
          }
        });
      }
    }
  } catch (e) {
    console.error('Failed to load used integrator history', e);
  }

  // Also include any manually assigned integrators found on projects (excluding main list partners)
  if (projects && Array.isArray(projects)) {
    projects.forEach((proj) => {
      if (proj.integratorPartners && Array.isArray(proj.integratorPartners)) {
        proj.integratorPartners.forEach((p) => {
          if (p && p.trim()) {
            const cleanName = p.trim();
            const key = cleanName.toLowerCase();
            if (!isMainIntegratorPartner(cleanName) && !map.has(key)) {
              map.set(key, {
                name: cleanName,
                lastUsedAt: 'Assigned to project',
                lastUsedOnProject: proj.propertyName,
                usedCount: 1,
              });
            }
          }
        });
      }
    });
  }

  return Array.from(map.values());
}

export function saveUsedIntegratorToHistory(
  partner: string,
  projectName?: string
): UsedIntegratorHistoryEntry[] {
  const trimmed = partner.trim();
  if (!trimmed || isMainIntegratorPartner(trimmed)) {
    return loadUsedIntegratorHistory();
  }

  try {
    const current = loadUsedIntegratorHistory();
    const key = trimmed.toLowerCase();
    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const existingIdx = current.findIndex((item) => item.name.toLowerCase() === key);
    let updated: UsedIntegratorHistoryEntry[];

    if (existingIdx >= 0) {
      const existing = current[existingIdx];
      const updatedEntry: UsedIntegratorHistoryEntry = {
        ...existing,
        name: trimmed,
        lastUsedAt: nowFormatted,
        lastUsedOnProject: projectName || existing.lastUsedOnProject,
        usedCount: (existing.usedCount || 1) + 1,
      };
      updated = [
        updatedEntry,
        ...current.filter((_, idx) => idx !== existingIdx),
      ];
    } else {
      const newEntry: UsedIntegratorHistoryEntry = {
        name: trimmed,
        lastUsedAt: nowFormatted,
        lastUsedOnProject: projectName,
        usedCount: 1,
      };
      updated = [newEntry, ...current];
    }

    localStorage.setItem(STORAGE_KEY_USED_INTEGRATORS_HISTORY, JSON.stringify(updated));
    localStorage.setItem(
      STORAGE_KEY_CUSTOM_INTEGRATORS,
      JSON.stringify(updated.map((u) => u.name))
    );
    return updated;
  } catch (e) {
    console.error('Failed to save used integrator to history', e);
    return loadUsedIntegratorHistory();
  }
}

export function removeUsedIntegratorFromHistory(partnerName: string): UsedIntegratorHistoryEntry[] {
  try {
    const key = partnerName.trim().toLowerCase();
    const current = loadUsedIntegratorHistory();
    const updated = current.filter((item) => item.name.toLowerCase() !== key);
    localStorage.setItem(STORAGE_KEY_USED_INTEGRATORS_HISTORY, JSON.stringify(updated));
    localStorage.setItem(
      STORAGE_KEY_CUSTOM_INTEGRATORS,
      JSON.stringify(updated.map((u) => u.name))
    );
    return updated;
  } catch (e) {
    console.error('Failed to remove integrator from history', e);
    return loadUsedIntegratorHistory();
  }
}

export function loadCustomIntegratorPartners(): string[] {
  return loadUsedIntegratorHistory().map((entry) => entry.name);
}

export function saveCustomIntegratorPartner(partner: string, projectName?: string) {
  saveUsedIntegratorToHistory(partner, projectName);
}

// Main Integrator Partners list: strictly returns only the official main list (does NOT include manually typed integrators)
export function getAllIntegratorPartners(_projects?: { integratorPartners?: string[] }[]): string[] {
  return [...DEFAULT_INTEGRATOR_PARTNERS];
}

export function getProjectIntegratorPartners(project?: Partial<OperationProject>): string[] {
  if (project?.integratorPartners && Array.isArray(project.integratorPartners)) {
    return project.integratorPartners;
  }
  return ['SKBM'];
}

export type StaffPermissionLevel = 'Manager' | 'Staff' | 'Limited';

export interface StaffRoleSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  permissionLevel: StaffPermissionLevel;
  roleOrTitle?: string;
  doorsAccessRequested?: string;
}

export interface CommonAreaDoor {
  id: string;
  doorName: string;
  buildingOrArea?: string;
  installedDeviceId?: string;
  installedDeviceName?: string;
  installedStatus: 'Pending' | 'Installed & Online' | 'Wired & Calibrated' | 'Needs Service';
  installedDate?: string;
  installerNotes?: string;
}

export type PMSSoftwareChoice =
  | 'Yardi'
  | 'Appfolio'
  | 'Entrata'
  | 'Realpage'
  | 'Buildium'
  | 'Propertyware'
  | 'ResMan'
  | 'Rent Manager'
  | 'MRI Software'
  | 'None';

export interface EntrataCredentials {
  username: string;
  password?: string;
  apiBaseUrl: string;
  notes?: string;
}

export type CustomerEmailCadence = 'none' | 'weekly' | 'biweekly';

export interface CustomerCommsLog {
  id: string;
  projectId: string;
  timestamp: string;
  type:
    | 'kickoff_submission'
    | 'deployment_overview_email'
    | 'csm_training_portal'
    | 'csm_handoff_email'
    | 'closure_summary_email'
    | 'sow_forecast_email'
    | 'shipping_update_email'
    | 'product_acceptance_request'
    | 'custom_email';
  recipientEmail: string;
  subject: string;
  summary: string;
  sentBy: string;
  cadence?: CustomerEmailCadence;
  status: 'Sent' | 'Automated' | 'Delivered' | 'Pending';
}

export interface SOWForecastItem {
  id: string;
  bomItemId: string;
  bomItemName: string;
  bomItemIds?: string[];
  bomItemNames?: string[];
  bomItemQuantities?: Record<string, number>;
  workDescription: string;
  buildingOrArea: string;
  assignedInstaller: string;
  forecastedQuantity: number;
  scheduledStartDate: string;
  scheduledEndDate: string;
  status: 'Forecasted' | 'In Progress' | 'Completed';
  lastNotifiedCustomerAt?: string;
  notes?: string;
}

export type ShippingCarrier =
  | 'FedEx Freight'
  | 'UPS Supply Chain'
  | 'DHL Express'
  | 'Old Dominion LTL'
  | 'Direct Integrator Courier';

export type ShipmentDockStatus =
  | 'Preparing at Dock'
  | 'Shipped / In Transit'
  | 'Out for Delivery'
  | 'Delivered to Site'
  | 'Accepted by Customer';

export interface ShippingDockItem {
  id: string;
  shipmentBatchLabel: string;
  integratorName: string;
  bomItemId: string;
  bomItemName: string;
  bomItemModel: string;
  bomItemIds?: string[];
  bomItemNames?: string[];
  bomItemModels?: string[];
  bomItemQuantities?: Record<string, number>;
  shippedQuantity: number;
  carrier: ShippingCarrier;
  trackingNumber: string;
  shippedDate: string;
  estimatedArrivalDate: string;
  status: ShipmentDockStatus;
  lastNotifiedCustomerAt?: string;
  customerAccepted?: boolean;
  customerScenarioNotes?: string;
}

export interface ProductAcceptanceSubmission {
  signedByName: string;
  signedByTitle: string;
  signedByEmail: string;
  signatureText: string;
  signedAt: string;
  overallDeliveryNotes?: string;
}

export interface KickoffCustomerIntake {
  pmsSoftware: PMSSoftwareChoice;
  entrataCredentials?: EntrataCredentials;
  pmsNoticeAcknowledged?: boolean;
  commonAreaDoors: CommonAreaDoor[];
  staffRoles: StaffRoleSubmission[];
  submittedAt?: string;
  submittedBy?: string;
  sitePhoneNumber?: string;
  communityEmail?: string;
  timeZone?: string;
  priorityDating?: string;
  thermostatTempRange?: string; // e.g. "65 cool / 75 heat"
  fireKeysFobs?: string;
  customGroupsNotes?: string;
  walkthroughCompleted?: boolean;
  subscriberEmail?: string;
  emailUpdatesCadence?: CustomerEmailCadence;
  doorsConfirmedByCustomer?: boolean;
  doorNamesNotAvailableNow?: boolean;
  doorNamesFollowUpDate?: string;
  // Site Maps Gateway Location Confirmation (PDF Upload)
  sitePlanPdfName?: string;
  sitePlanPdfDataUrl?: string;
  sitePlanUploadedAt?: string;
  sitePlanConfirmedEdited?: boolean;
  // QR Intercom & NFC Wallet Upgrade Customer Confirmation & Branding Uploads
  useQrIntercom?: boolean;
  qrIntercomConfirmedByCustomer?: 'yes' | 'no';
  qrIntercomLogoName?: string;
  qrIntercomLogoDataUrl?: string;
  qrIntercomLogoUploadedAt?: string;
  useNfcWallet?: boolean;
  nfcWalletConfirmedByCustomer?: 'yes' | 'no';
  nfcCardArtPhotoName?: string;
  nfcCardArtPhotoDataUrl?: string;
  nfcCardArtUploadedAt?: string;
}

export interface TeamAssistEntry {
  id: string;
  date: string;
  loggedBy: string;
  assistanceDetails: string;
  createdAt: string;
}

export interface FinancialMilestones {
  fiftyPercentCollected?: boolean;
  fiftyPercentCollectedDate?: string;
  twentyPercentCollected?: boolean;
  twentyPercentCollectedDate?: string;
  thirtyPercentCollected?: boolean;
  thirtyPercentCollectedDate?: string;
  finalTwentyPercentCollected?: boolean;
  finalTwentyPercentCollectedDate?: string;
  saasStarted?: boolean;
  saasStartDate?: string;
}

export interface ManualLinkQuoteHistory {
  id: string;
  linkedAt: string;
  linkedBy: string;
  quoteId: string;
  quoteNumber: string;
  decision: 'Kept Quote Numbers' | 'Kept Project Numbers' | 'Custom Overwrite';
  previousBOMSnapshot: {
    itemId: string;
    name: string;
    previousQuantity: number;
    newQuantity: number;
  }[];
  notes?: string;
}

export interface CommunityKickoffDetails {
  pmsSystem: 'Yardi Voyager' | 'RealPage' | 'Entrata' | 'MRI Software' | 'ResMan';
  projectType: 'Retrofit / Occupied' | 'New Construction' | 'Full Phased Turnkey';
  stagingLocation: string; // e.g. "Clubhouse Basement / Vacant Unit 104"
  staffEscortRequired: boolean;
  officeHours: string; // e.g. "9:00 AM - 6:00 PM Mon-Fri"
  installWorkingHours: string; // e.g. "9:00 AM - 5:00 PM Mon-Fri"
  masterFobsKnoxBox: string; // e.g. "Fire Knox Box #4 & 2 Master Fobs Provided"
  nfcWalletConfigured: boolean; // Apple Wallet & Google Wallet
  csmName: CSMName;
  fieldOpsLead: string; // Sean Gates
  subcontractorCompany?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  propertyName: string;
  clientName: string;
  address: string;
  city: string;
  state: string;
  unitsCount: number;
  stage: DealStage;
  stageUpdatedAt: string;
  totalHardwareAmount: number;
  totalInstallAmount: number;
  monthlyServiceFee: number;
  assignedSalesLead: string;
  notes: string;
  bomItems: BOMItem[];
}

export interface ProjectActivityNotification {
  id: string;
  projectId: string;
  propertyName: string;
  assignedPMName: string;
  assignedFieldTech: FieldTechName;
  timestamp: string;
  createdAtIso: string;
  audience: 'pm' | 'field_tech';
  category:
    | 'customer_kickoff_submission'
    | 'customer_walkthrough_update'
    | 'customer_acceptance'
    | 'pm_update'
    | 'installer_log';
  title: string;
  details: string;
  actorName: string;
  badgeLabel: string;
}

export interface OperationProject {
  id: string;
  quoteId: string;
  quoteNumber: string;
  propertyName: string;
  clientName: string;
  address: string;
  city: string;
  state: string;
  unitsCount: number;
  heroImage: string;
  assignedPM: ProjectManagerInfo;
  assignedCSM?: CSMName;
  assignedFieldTech?: FieldTechName;
  integratorPartners?: string[]; // Assigned integrator partners & installers (SKBM, ATB, SBH, Everbase, JTS, or custom entries)
  statusTag: ProjectStatusTag;
  statusReason?: string;
  startDate: string;
  targetCompletionDate: string;
  bomItems: BOMItem[];
  installLogs: InstallLogEntry[];
  notes: ProjectNote[];
  milestones: ProjectMilestone[];
  communityDetails?: CommunityKickoffDetails;
  customerIntake?: KickoffCustomerIntake;
  customerCommsLogs?: CustomerCommsLog[];
  emailOverviewCadence?: CustomerEmailCadence;
  emailCadenceStartDate?: string; // Fillable start date for weekly/biweekly overview cadence
  sowForecastCadenceEnabled?: boolean; // Automated weekly/biweekly SOW Forecast overview dispatch when on CSM Intro - Pre-implementation
  useNfcWallet?: boolean; // PM Checkbox: NFC Wallet Upgrade
  useQrIntercom?: boolean; // PM Checkbox: QR Intercom Feature
  csmHandoffEnteredAt?: string; // Timestamp when project entered CSM Handoff (auto-closes after 7 days)
  sowForecastItems?: SOWForecastItem[];
  shippingDockItems?: ShippingDockItem[];
  productAcceptanceSubmission?: ProductAcceptanceSubmission;
  activityNotifications?: ProjectActivityNotification[];
  kickoffCompleted?: boolean;
  isManuallyCreated?: boolean;
  isBomLocked?: boolean;
  manualLinkHistory?: ManualLinkQuoteHistory[];
  teamAssists?: TeamAssistEntry[];
  financialMilestones?: FinancialMilestones;
  partnerCourseBundle?: PrePackagedProjectCourseBundle;
  pmpMitigationPlan?: PMPMitigationPlan;
  lastUpdated: string;
}

export type PMPMitigationStrategyType =
  | 'Fast Tracking (Parallel Execution)'
  | 'Crashing & Resource Compression'
  | 'Critical Path Decoupling & Escalation'
  | 'Hybrid PMBOK Schedule Recovery';

export type PMPMitigationActionPhase =
  | 'Immediate (24-48h)'
  | 'Short-Term (7 Days)'
  | 'Milestone Recovery'
  | 'Risk Control';

export interface PMPMitigationActionItem {
  id: string;
  phase: PMPMitigationActionPhase;
  pmpTechnique: string;
  action: string;
  owner: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface PMPMitigationPlan {
  id: string;
  projectId: string;
  strategyType: PMPMitigationStrategyType;
  pmbokKnowledgeAreas: string[];
  rootCauseSynthesis: string;
  scheduleCompressionPlan: string;
  stakeholderEscalationPlan: string;
  contingencyReserveNotes: string;
  actionItems: PMPMitigationActionItem[];
  targetRecoveryDate: string;
  tailoredFromNotesCount: number;
  lastEditedBy?: string;
  lastUpdated: string;
  isCustomEdited?: boolean;
}

export function projectHasGatewayOrHubOnBOM(bomItems: BOMItem[] = []): boolean {
  return bomItems.some((item) => {
    const text = `${item.name} ${item.model} ${item.category} ${item.description || ''}`.toLowerCase();
    return (
      item.category === 'IoT Gateways & Mesh' ||
      text.includes('gateway') ||
      text.includes('hub') ||
      text.includes('repeater') ||
      text.includes('base station')
    );
  });
}

export function getCsmHandoffAutoCloseInfo(project: OperationProject): {
  isOnCsmHandoff: boolean;
  isAlreadyClosed: boolean;
  enteredDateStr?: string;
  daysElapsed: number;
  daysRemaining: number;
  shouldAutoClose: boolean;
} {
  const csmMilestone = project.milestones.find(
    (m) => m.title === 'CSM Handoff' || m.title.toLowerCase().includes('csm handoff')
  );
  const closedMilestone = project.milestones.find(
    (m) => m.title === 'Project Closed' || m.title.toLowerCase().includes('closed')
  );

  const isAlreadyClosed = closedMilestone?.status === 'Completed';
  const isOnCsmHandoff =
    !isAlreadyClosed &&
    Boolean(csmMilestone && (csmMilestone.status === 'In Progress' || csmMilestone.status === 'Completed'));

  if (!isOnCsmHandoff) {
    return {
      isOnCsmHandoff: false,
      isAlreadyClosed,
      daysElapsed: 0,
      daysRemaining: 7,
      shouldAutoClose: false,
    };
  }

  const enteredDateStr =
    project.csmHandoffEnteredAt ||
    csmMilestone?.startedAt ||
    csmMilestone?.completedDate ||
    csmMilestone?.targetDate;

  const targetYear = new Date(project.targetCompletionDate || '2026-10-21').getFullYear();
  const refNow = targetYear >= 2026 ? new Date('2026-10-21T12:00:00Z') : new Date();
  const enteredDate = enteredDateStr ? new Date(enteredDateStr) : refNow;
  const diffMs = refNow.getTime() - enteredDate.getTime();
  const daysElapsed = isNaN(diffMs) ? 0 : Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, 7 - daysElapsed);

  return {
    isOnCsmHandoff: true,
    isAlreadyClosed: false,
    enteredDateStr,
    daysElapsed,
    daysRemaining,
    shouldAutoClose: daysElapsed >= 7,
  };
}

export function checkAndApplyCsmHandoffAutoClose(project: OperationProject): OperationProject {
  const info = getCsmHandoffAutoCloseInfo(project);
  if (!info.shouldAutoClose) {
    return project;
  }

  const updatedMilestones = project.milestones.map((m) => {
    if (
      m.title === 'CSM Handoff' ||
      m.title === 'Project Closed' ||
      m.title.toLowerCase().includes('csm handoff') ||
      m.title.toLowerCase().includes('closed')
    ) {
      return {
        ...m,
        status: 'Completed' as const,
        completedDate: m.completedDate || '2026-10-21',
      };
    }
    return m;
  });

  const autoCloseLogId = `auto-close-7d-${project.id}`;
  const hasAutoCloseLog = (project.customerCommsLogs || []).some((l) => l.id === autoCloseLogId);
  const defaultRecipient =
    project.customerIntake?.subscriberEmail ||
    project.customerIntake?.communityEmail ||
    project.customerIntake?.staffRoles?.[0]?.email ||
    'leasing@property.com';

  const updatedCommsLogs = hasAutoCloseLog
    ? project.customerCommsLogs
    : [
        {
          id: autoCloseLogId,
          projectId: project.id,
          timestamp: '2026-10-21 12:00 PM',
          type: 'closure_summary_email' as const,
          recipientEmail: defaultRecipient,
          subject: `Automated 7-Day CSM Handoff Closure: ${project.propertyName}`,
          summary: `Project automatically closed after 7 days on the CSM Handoff milestone. Transitioned to dedicated CSM (${project.assignedCSM || 'Nicole Franklin'}).`,
          sentBy: 'Quext Operations Automation',
          status: 'Automated' as const,
        },
        ...(project.customerCommsLogs || []),
      ];

  return {
    ...project,
    milestones: updatedMilestones,
    customerCommsLogs: updatedCommsLogs,
  };
}

export interface HardwareCatalogItem {
  id: string;
  sku: string;
  name: string;
  category: BOMCategory;
  unitCost: number; // Wholesale manufacturing / equipment cost
  unitPrice: number; // Quoted retail / customer price
  description: string;
  typicalScope: 'Per Residential Unit' | 'Common Area & Amenities' | 'Central Infrastructure / Riser';
  manufacturer: 'Quext' | 'Honeywell' | 'Aeotec' | 'Schlage' | 'Knox' | 'General';
  isPopularQuickAdd?: boolean;
  specifications: string[];
}

export interface SoftwareCatalogItem {
  id: string;
  sku: string;
  name: string;
  tier: 'Base Platform' | 'Access Control' | 'Climate & Energy' | 'Water Protection' | 'Managed Wi-Fi' | 'Integration & Tours';
  billingType: 'per_unit_per_month' | 'per_property_per_month' | 'one_time';
  monthlyCost: number; // Platform cost
  monthlyPrice: number; // Quoted client price
  description: string;
  features: string[];
}

// Category helper specifications
export function getCategoryUnitLabel(category: string): string {
  switch (category) {
    case 'Smart Access Control':
      return 'locks';
    case 'Smart Thermostats & HVAC':
    case 'Smart Thermostats':
      return 'stats';
    case 'IoT Gateways & Mesh':
    case 'Gateways and Hubs':
      return 'GTWYs';
    case 'Sensors & Leak Protection':
    case 'Sensors and Leak Protection':
      return 'devices';
    case 'Bulk Managed Wi-Fi':
    case 'Bulk Managed WiFi':
      return 'Devices';
    case 'Common Area & Utilities':
      return 'locks';
    default:
      return 'units';
  }
}

export function calculateProjectScheduleHealth(
  targetCompletionDate: string,
  manualTag?: ProjectStatusTag,
  param3?: ProjectMilestone[] | ProjectNote[],
  param4?: ProjectNote[] | ProjectMilestone[]
): {
  autoTag: ProjectStatusTag;
  effectiveTag: ProjectStatusTag;
  isOverdue: boolean;
  diffDays: number;
  weeksBehind: number;
  weeksBehindLabel: string;
  egregiousScheduleReason?: string;
  negativeNotes: ProjectNote[];
  overdueMilestones: ProjectMilestone[];
} {
  // Use simulated system reference date 2026-10-21 if year is 2026, otherwise current client date
  const targetYear = new Date(targetCompletionDate).getFullYear();
  const now = targetYear >= 2026 ? new Date('2026-10-21T12:00:00Z') : new Date();
  const target = new Date(targetCompletionDate);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let autoTag: ProjectStatusTag = 'On Track';
  let weeksBehind = 0;
  let weeksBehindLabel = 'On Schedule';
  let egregiousScheduleReason: string | undefined;

  let milestones: ProjectMilestone[] = [];
  let notes: ProjectNote[] = [];

  const inspectArray = (arr?: (ProjectMilestone | ProjectNote)[]) => {
    if (!arr || arr.length === 0) return;
    const first = arr[0];
    if (first && ('targetDate' in first || 'status' in first)) {
      milestones = arr as ProjectMilestone[];
    } else if (first && ('author' in first || 'category' in first)) {
      notes = arr as ProjectNote[];
    }
  };

  inspectArray(param3 as any);
  inspectArray(param4 as any);

  // Check milestones delays
  const overdueMilestones: ProjectMilestone[] = [];
  if (milestones && milestones.length > 0) {
    milestones.forEach((m) => {
      if (m.status !== 'Completed' && m.targetDate) {
        const mTarget = new Date(m.targetDate);
        const mDiffDays = Math.floor((now.getTime() - mTarget.getTime()) / (1000 * 60 * 60 * 24));
        if (mDiffDays > 0) {
          overdueMilestones.push(m);
        }
      }
    });
  }

  // Scan negative notes that impact risk assessment
  const negativeNotes: ProjectNote[] = [];
  if (notes && notes.length > 0) {
    const riskKeywords = ['delay', 'risk', 'defect', 'escalat', 'inspect', 'fail', 'permit', 'hold', 'subcontractor', 'stalled', 'stopped', 'issue', 'leak', 'weather', 'critical'];
    notes.forEach((note) => {
      const lower = (note.text + ' ' + note.category).toLowerCase();
      const hasKeyword = riskKeywords.some((kw) => lower.includes(kw));
      if (hasKeyword || note.isPinned) {
        negativeNotes.push(note);
      }
    });
  }

  if (diffDays > 0) {
    weeksBehind = Math.round((diffDays / 7) * 10) / 10;
    if (diffDays > 14) {
      autoTag = 'High Risk';
      weeksBehindLabel = `${weeksBehind} wks behind`;
      egregiousScheduleReason = `Project is egregiously behind schedule by ${weeksBehind} weeks (${diffDays} days past target date of ${targetCompletionDate}). Severe schedule variance is a major factor in this High Risk assessment.`;
    } else {
      autoTag = 'Behind Schedule';
      weeksBehindLabel = `${weeksBehind} wks behind`;
      egregiousScheduleReason = `Project is ${weeksBehind} weeks behind target completion (${diffDays} days overdue). Requires active mitigation.`;
    }
  } else {
    // If project target date is in the future, but milestones are severely delayed
    const maxMilestoneOverdueDays = overdueMilestones.reduce((max, m) => {
      const mTarget = new Date(m.targetDate);
      const mDiffDays = Math.floor((now.getTime() - mTarget.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(max, mDiffDays);
    }, 0);

    if (maxMilestoneOverdueDays > 14) {
      autoTag = 'High Risk';
      const mWeeks = Math.round((maxMilestoneOverdueDays / 7) * 10) / 10;
      weeksBehind = mWeeks;
      weeksBehindLabel = `${mWeeks} wks behind milestone`;
      egregiousScheduleReason = `Active milestone is egregiously overdue by ${mWeeks} weeks (${maxMilestoneOverdueDays} days), pushing overall delivery at high risk.`;
    } else if (maxMilestoneOverdueDays > 0) {
      autoTag = 'Behind Schedule';
      const mWeeks = Math.round((maxMilestoneOverdueDays / 7) * 10) / 10;
      weeksBehind = mWeeks;
      weeksBehindLabel = `${mWeeks} wks behind milestone`;
    } else {
      const daysRemaining = Math.abs(diffDays);
      const weeksRemaining = Math.round((daysRemaining / 7) * 10) / 10;
      weeksBehindLabel = `${weeksRemaining} wks remaining`;
    }
  }

  // Enforce dynamic timing criteria while respecting PM High Risk / Behind Schedule escalations:
  const effectiveTag: ProjectStatusTag =
    manualTag === 'High Risk' || autoTag === 'High Risk'
      ? 'High Risk'
      : manualTag === 'Behind Schedule' || autoTag === 'Behind Schedule'
      ? 'Behind Schedule'
      : 'On Track';

  return {
    autoTag,
    effectiveTag,
    isOverdue: diffDays > 0 || overdueMilestones.length > 0,
    diffDays,
    weeksBehind,
    weeksBehindLabel,
    egregiousScheduleReason,
    negativeNotes,
    overdueMilestones,
  };
}

export function generateTailoredPMPMitigationPlan(project: OperationProject): PMPMitigationPlan {
  const health = calculateProjectScheduleHealth(
    project.targetCompletionDate,
    project.statusTag,
    project.milestones,
    project.notes
  );

  const isHighRisk = health.effectiveTag === 'High Risk';
  const pmName = project.assignedPM?.name || 'Assigned PM';
  const fieldTech = normalizeFieldTech(project.assignedFieldTech);
  const csmName = project.assignedCSM || 'Nicole Franklin';
  const partners =
    project.integratorPartners && project.integratorPartners.length > 0
      ? project.integratorPartners.join(' & ')
      : 'Assigned Integrator Crew';

  // BOM Progress & Critical vs Parallelizable Scope Analysis
  const totalQuoted = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalInstalled = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
  const overallBomPct = totalQuoted > 0 ? Math.round((totalInstalled / totalQuoted) * 100) : 0;

  const incompleteBomItems = project.bomItems.filter((i) => i.installedCount < i.quantity);
  const inUnitItems = incompleteBomItems.filter(
    (i) =>
      i.category === 'Smart Access Control' ||
      i.category === 'Smart Thermostats & HVAC' ||
      i.category === 'Sensors & Leak Protection'
  );
  const infraItems = incompleteBomItems.filter(
    (i) =>
      i.category === 'IoT Gateways & Mesh' ||
      i.category === 'Bulk Managed Wi-Fi' ||
      i.category === 'Common Area & Utilities' ||
      i.name.toLowerCase().includes('elevator') ||
      i.name.toLowerCase().includes('riser') ||
      i.name.toLowerCase().includes('repeater')
  );

  const inUnitRemainingSummary =
    inUnitItems.length > 0
      ? inUnitItems
          .slice(0, 2)
          .map((i) => `${i.quantity - i.installedCount} ${i.name.replace('Quext ', '')}`)
          .join(' and ')
      : `${Math.max(0, totalQuoted - totalInstalled)} remaining smart devices`;

  const infraBottleneckSummary =
    infraItems.length > 0
      ? infraItems
          .map((i) => `${i.name} (${i.installedCount}/${i.quantity} in ${i.location})`)
          .join(', ')
      : incompleteBomItems[0]
      ? `${incompleteBomItems[0].name} (${incompleteBomItems[0].installedCount}/${incompleteBomItems[0].quantity})`
      : 'remaining field commissioning items';

  // Active & Overdue Milestone Analysis
  const activeMilestone =
    project.milestones.find((m) => m.status === 'In Progress') ||
    health.overdueMilestones[0] ||
    project.milestones.find((m) => m.status !== 'Completed');

  // Deep synthesis of Project Notes + PM Status Reason
  const allNotes = project.notes || [];
  const combinedContextText = `${project.statusReason || ''} ${allNotes.map((n) => `${n.category}: ${n.text}`).join(' ')}`.toLowerCase();

  const hasInspectorOrPermitIssue =
    combinedContextText.includes('inspect') ||
    combinedContextText.includes('permit') ||
    combinedContextText.includes('otis') ||
    combinedContextText.includes('elevator') ||
    combinedContextText.includes('conduit') ||
    combinedContextText.includes('association') ||
    combinedContextText.includes('code');

  const hasSupplyChainOrContractorIssue =
    combinedContextText.includes('poe') ||
    combinedContextText.includes('switch') ||
    combinedContextText.includes('riser') ||
    combinedContextText.includes('electrical') ||
    combinedContextText.includes('contractor') ||
    combinedContextText.includes('delivery') ||
    combinedContextText.includes('delayed');

  const hasAccessOrIntakeIssue =
    combinedContextText.includes('key') ||
    combinedContextText.includes('access') ||
    combinedContextText.includes('pms') ||
    combinedContextText.includes('kickoff') ||
    !project.customerIntake?.walkthroughCompleted;

  // Choose primary PMP strategy based on project profile & notes
  let strategyType: PMPMitigationStrategyType = 'Fast Tracking (Parallel Execution)';
  if (isHighRisk && hasSupplyChainOrContractorIssue) {
    strategyType = 'Crashing & Resource Compression';
  } else if (hasInspectorOrPermitIssue) {
    strategyType = 'Critical Path Decoupling & Escalation';
  } else if (isHighRisk) {
    strategyType = 'Hybrid PMBOK Schedule Recovery';
  }

  // Build Note Citations String
  const notesDigest =
    allNotes.length > 0
      ? allNotes
          .map(
            (n) =>
              `[${n.category} — ${n.author}, ${n.timestamp}]: "${n.text}"`
          )
          .join(' | ')
      : 'No field notes logged yet; analysis derived from PM status reason and BOM telemetry.';

  // 1. Root Cause Synthesis (PMBOK Identify Risks & Perform Qualitative Risk Analysis)
  const scheduleVarianceText =
    health.diffDays > 0
      ? `Schedule Variance (SV) is -${health.diffDays} days (${health.weeksBehindLabel} past ${project.targetCompletionDate} baseline).`
      : `Target completion is ${project.targetCompletionDate} (${health.weeksBehindLabel}), with active critical-path friction flagged under "${health.effectiveTag}".`;

  const rootCauseSynthesis = [
    `[PMBOK Qualitative Risk & Root Cause Analysis — ${project.propertyName} (${project.unitsCount} Units, ${project.city}, ${project.state})]:`,
    `${scheduleVarianceText} Overall BOM installation sits at ${overallBomPct}% (${totalInstalled}/${totalQuoted} devices).`,
    project.statusReason
      ? `Primary Blocker Flagged by PM (${pmName}): "${project.statusReason}"`
      : `Primary Blocker: Schedule compression required on milestone "${activeMilestone?.title || 'Implementation'}".`,
    allNotes.length > 0
      ? `Field Note Telemetry Incorporated (${allNotes.length} Note${allNotes.length === 1 ? '' : 's'}): ${notesDigest}`
      : `Field Note Telemetry: Awaiting additional site logs from ${fieldTech} and ${partners}.`,
  ].join(' ');

  // 2. Schedule Compression Plan (PMBOK Control Schedule: Fast Tracking & Crashing)
  const scheduleCompressionPlan = hasInspectorOrPermitIssue
    ? `Apply PMBOK Fast Tracking (Parallel Execution) & Critical Path Decoupling: Isolate the external inspection/permit dependency on ${infraBottleneckSummary} onto a non-blocking sub-network so it does not stall unit turns. Direct Field Tech ${fieldTech} and integrator partner (${partners}) to fast-track the remaining ${inUnitRemainingSummary} across unblocked residential corridors in parallel. Once municipal/inspector clearance is granted, execute 48-hour Schedule Crashing on the held interface to recover baseline float.`
    : hasSupplyChainOrContractorIssue
    ? `Apply PMBOK Schedule Crashing & Resource Leveling: While electrical/GC riser dependencies (${infraBottleneckSummary}) are expedited via daily contractor standups, reallocate ${partners} and Field Tech ${fieldTech} to complete 100% of in-unit ${inUnitRemainingSummary} and pre-terminate drop locations. Upon switch/riser gear mount, crash the commissioning phase with a dual crew shift to eliminate the ${health.weeksBehindLabel} schedule variance.`
    : `Apply PMBOK Fast Tracking & Rolling Wave Planning: Execute parallel installation waves across ${project.propertyName} (${project.unitsCount} units) with ${fieldTech} and ${partners}, prioritizing ${inUnitRemainingSummary} while concurrently closing out ${infraBottleneckSummary} to protect the "${activeMilestone?.title || 'Implementation'}" milestone target (${activeMilestone?.targetDate || project.targetCompletionDate}).`;

  // 3. Stakeholder & Vendor Escalation Plan (PMBOK Manage Stakeholder Engagement)
  const latestNote = allNotes[0];
  const stakeholderEscalationPlan = [
    `PMBOK Stakeholder & Communications Matrix for ${project.clientName}:`,
    `1) Internal & Field Alignment: ${pmName} (PM) and ${fieldTech} (Field Tech) hold ${isHighRisk ? 'daily 15-minute standup' : '48-hour checkpoint'} with ${partners} tracking unit velocity.`,
    latestNote
      ? `2) Note-Driven Action Follow-Up: Directly track ${latestNote.author}'s [${latestNote.category}] note ("${latestNote.text}") with written owner sign-off and escalation to ${project.clientName} regional leadership if SLA slips >24 hours.`
      : `2) Third-Party Blocker Escalation: Issue formal PMBOK Issue Log notice to ${project.clientName} site representative regarding "${project.statusReason || 'schedule recovery'}" to clear site/vendor dependencies.`,
    `3) Customer Success Continuity: Sync revised schedule baseline with assigned CSM (${csmName}) so resident onboarding and staff training at ${project.propertyName} align seamlessly with physical completion.`,
  ].join(' ');

  // 4. Contingency & Fallback Reserve Plan (PMBOK Plan Risk Responses)
  const contingencyReserveNotes = isHighRisk
    ? `PMBOK Contingency Fallback (High Risk Protocol): Establish a Phased Beneficial Occupancy Handover for ${project.propertyName}. Complete and sign off all commissioned residential buildings/floors first so ${project.clientName} can begin resident portal usage with CSM ${csmName}, while isolating blocked riser/common-area items (${infraBottleneckSummary}) into a 5-day ring-fenced punch-list reserve.`
    : `PMBOK Management Reserve & Workaround: Maintain buffer capacity with ${partners} for a weekend catch-up sprint if "${activeMilestone?.title || 'Implementation'}" slips more than 3 business days, and pre-stage spare hardware on-site (${project.bomItems.reduce((acc, i) => acc + (i.sparesCount || 0), 0)} spares allocated) to prevent RMA rework delays.`;

  // 5. Tailored Action Items Register
  const actionItems: PMPMitigationActionItem[] = [
    {
      id: `pmp-act-${project.id}-1`,
      phase: 'Immediate (24-48h)',
      pmpTechnique: isHighRisk ? 'Risk Response: Escalate & Mitigate' : 'Risk Response: Mitigate',
      action: project.statusReason
        ? `Resolve primary blocker on ${project.propertyName}: ${project.statusReason}`
        : `Conduct immediate critical-path blocker audit on ${project.propertyName} (${activeMilestone?.title || 'Implementation'} milestone).`,
      owner: `${pmName} (PM)`,
      status: 'In Progress',
    },
    ...(allNotes.length > 0
      ? allNotes.slice(0, 2).map((note, idx) => ({
          id: `pmp-act-${project.id}-note-${idx + 1}`,
          phase: (idx === 0 ? 'Immediate (24-48h)' : 'Short-Term (7 Days)') as PMPMitigationActionPhase,
          pmpTechnique: `Note Action (${note.category})`,
          action: `Execute follow-through on ${note.author}'s field note: "${note.text}" — verify clearance and log updated telemetry timestamp.`,
          owner: `${pmName} & ${fieldTech}`,
          status: 'In Progress' as const,
        }))
      : [
          {
            id: `pmp-act-${project.id}-note-fallback`,
            phase: 'Immediate (24-48h)' as PMPMitigationActionPhase,
            pmpTechnique: 'Control Communications: Field Log',
            action: `Capture detailed site blocker & inspection telemetry in Project Notes with ${fieldTech} and ${partners}.`,
            owner: `${fieldTech} (Field Tech)`,
            status: 'Pending' as const,
          },
        ]),
    {
      id: `pmp-act-${project.id}-2`,
      phase: 'Short-Term (7 Days)',
      pmpTechnique: 'Schedule Compression: Fast Tracking',
      action: `Fast-track unblocked installation of ${inUnitRemainingSummary} in parallel via ${partners} & ${fieldTech} (lifting BOM from ${overallBomPct}% toward 85%+).`,
      owner: `${fieldTech} & ${partners}`,
      status: 'Pending',
    },
    {
      id: `pmp-act-${project.id}-3`,
      phase: 'Milestone Recovery',
      pmpTechnique: isHighRisk ? 'Schedule Compression: Crashing' : 'Critical Path Control',
      action: `Recover "${activeMilestone?.title || 'Implementation'}" milestone baseline (Target: ${activeMilestone?.targetDate || project.targetCompletionDate}) and complete commissioning on ${infraBottleneckSummary}.`,
      owner: `${pmName} & ${partners}`,
      status: 'Pending',
    },
    {
      id: `pmp-act-${project.id}-4`,
      phase: 'Risk Control',
      pmpTechnique: 'Stakeholder Engagement & Baseline Sync',
      action: !project.customerIntake?.walkthroughCompleted
        ? `Expedite pending Customer Kickoff Intake & PMS credentials with ${project.clientName} and align CSM ${csmName} on adjusted handover window.`
        : `Deliver weekly PMP Schedule Variance & Risk Register briefing to ${project.clientName} and align CSM ${csmName} for ${project.propertyName} handoff.`,
      owner: `${pmName} & ${csmName} (CSM)`,
      status: 'Pending',
    },
  ];

  // Calculate a realistic target recovery date
  const baseDate = new Date(project.targetCompletionDate || '2026-11-15');
  const nowRef = baseDate.getFullYear() >= 2026 ? new Date('2026-10-21T12:00:00Z') : new Date();
  const recoveryBase = baseDate.getTime() < nowRef.getTime() ? nowRef : baseDate;
  const recoveryDateObj = new Date(recoveryBase.getTime() + (isHighRisk ? 14 : 10) * 24 * 60 * 60 * 1000);
  const targetRecoveryDate = isNaN(recoveryDateObj.getTime())
    ? project.targetCompletionDate
    : recoveryDateObj.toISOString().split('T')[0];

  return {
    id: `pmp-plan-${project.id}`,
    projectId: project.id,
    strategyType,
    pmbokKnowledgeAreas: [
      'Project Schedule Management (Fast Tracking & Crashing)',
      'Project Risk Management (Qualitative Risk & Mitigation)',
      'Project Stakeholder & Communications Management',
      'Critical Path Method (CPM) Variance Recovery',
    ],
    rootCauseSynthesis,
    scheduleCompressionPlan,
    stakeholderEscalationPlan,
    contingencyReserveNotes,
    actionItems,
    targetRecoveryDate,
    tailoredFromNotesCount: allNotes.length,
    lastUpdated: project.lastUpdated || new Date().toISOString(),
    isCustomEdited: false,
  };
}

export function getEffectivePMPMitigationPlan(project: OperationProject): PMPMitigationPlan {
  if (project.pmpMitigationPlan) {
    // If the plan was not custom-edited by the PM and the number of project notes changed, auto-refresh it
    if (
      !project.pmpMitigationPlan.isCustomEdited &&
      project.pmpMitigationPlan.tailoredFromNotesCount !== (project.notes?.length || 0)
    ) {
      return generateTailoredPMPMitigationPlan(project);
    }
    return project.pmpMitigationPlan;
  }
  return generateTailoredPMPMitigationPlan(project);
}

export function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'Smart Access Control':
      return 'Smart Access Control';
    case 'Smart Thermostats & HVAC':
    case 'Smart Thermostats':
      return 'Smart Thermostats';
    case 'IoT Gateways & Mesh':
    case 'Gateways and Hubs':
      return 'Gateways and Hubs';
    case 'Sensors & Leak Protection':
    case 'Sensors and Leak Protection':
      return 'Sensors and Leak Protection';
    case 'Bulk Managed Wi-Fi':
    case 'Bulk Managed WiFi':
      return 'Bulk Managed WiFi';
    case 'Common Area & Utilities':
      return 'Common Area & Utilities';
    default:
      return category;
  }
}

