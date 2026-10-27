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
  pendingPMConfirmation?: boolean; // When logged by field tech or partner, awaiting PM confirmation
  submittedByRole?: 'field_tech' | 'integrator_partner' | 'pm';
  exceedsSOW?: boolean;
  offsetQuantity?: number;
  itemNotes?: string; // Dedicated note tied to this individual BOM line item
  approvalStatus?: 'pending_approval' | 'approved' | 'denied';
  photos?: string[]; // In-the-field photos confirming installation / hardware context
  audioNoteUrl?: string; // Voice memo audio recording URL or data URI
  audioNoteDuration?: number; // Duration of audio memo in seconds
}

export interface PendingInstallationChange {
  id: string;
  source: 'sow_forecaster' | 'install_log';
  sourceId: string;
  title: string;
  submittedBy: string; // e.g. "Sean Gates (Field Tech)" or "SKBM Partner Crew"
  submittedRole: 'field_tech' | 'integrator_partner' | 'pm';
  submittedAt: string;
  details: string; // Summary of changes
  bomIncrements: Record<string, number>; // { [bomItemId]: quantity }
  status: 'pending' | 'confirmed';
  confirmedAt?: string;
  confirmedBy?: string;
  associatedLog?: InstallLogEntry;
  exceedsSOW?: boolean;
  offsetQuantity?: number;
  approvalStatus?: 'pending_approval' | 'approved' | 'denied';
  denialReason?: string;
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
  lockFinishConfig?: LockFinishConfig; // PM-configured lock trim style, lever style, color finish & hardware settings
  postItLogs?: InstallLogEntry[]; // Stored and logged within its corresponding row!
  sparesCount?: number; // Spares included in line item total, but distinct from installed device count
  sparesDelivered?: boolean; // Subtle confirmation by PM that spares have been delivered to customer
  overAllocationOffset?: number; // When installer exceeded SOW, tracked offset
  overAllocationDenied?: boolean; // Flagged when PM denied the over-allocation
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
  {
    name: 'Ian Robertson',
    email: 'ian.robertson@onequext.com',
    role: 'Project Coordinator',
    phone: '(806) 555-0177',
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

export const OFFICIAL_CHANNEL_PARTNERS: readonly string[] = [
  'Spirit Security',
  'Engineered Controls',
  'Everbase Solutions',
  'SKBM Smart Tech',
  'Southbay Hardware',
  'DIY (Customer Self-Install)',
] as const;

export const DEFAULT_INTEGRATOR_PARTNERS = OFFICIAL_CHANNEL_PARTNERS;

export type OfficialChannelPartner = typeof OFFICIAL_CHANNEL_PARTNERS[number];
export type DefaultIntegratorPartner = OfficialChannelPartner;

export interface UsedIntegratorHistoryEntry {
  name: string;
  lastUsedAt: string;
  lastUsedOnProject?: string;
  usedCount: number;
}

export const STORAGE_KEY_CUSTOM_INTEGRATORS = 'quext_custom_integrator_partners';
export const STORAGE_KEY_USED_INTEGRATORS_HISTORY = 'quext_used_integrators_history_v1';

export function isOfficialChannelPartner(name: string): boolean {
  if (!name) return false;
  const normalized = name.trim().toLowerCase();
  const ocpMatches = [
    'spirit security',
    'spirit',
    'engineered controls',
    'engineered',
    'eci',
    'everbase solutions',
    'everbase',
    'skbm smart tech',
    'skbm',
    'southbay hardware',
    'southbay',
    'sbh',
    'diy (customer self-install)',
    'diy',
    'customer self-install',
    'self-install',
  ];
  return ocpMatches.includes(normalized) || OFFICIAL_CHANNEL_PARTNERS.some((p) => p.toLowerCase() === normalized);
}

export function isDiyPartner(partner?: string | null): boolean {
  if (!partner) return false;
  const n = partner.trim().toLowerCase();
  return (
    n === 'diy' ||
    n.includes('customer self-install') ||
    n.includes('self-install') ||
    n.startsWith('diy')
  );
}

export const isMainIntegratorPartner = isOfficialChannelPartner;

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

// Official Channel Partners (OCP) list: strictly returns only the official channel partners list (does NOT include manually typed integrators)
export function getAllIntegratorPartners(_projects?: { integratorPartners?: string[] }[]): string[] {
  return [...OFFICIAL_CHANNEL_PARTNERS];
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
  pendingPMConfirmation?: boolean; // When updated by field tech / partner, awaiting PM confirmation
  submittedByRole?: 'field_tech' | 'integrator_partner' | 'pm';
  confirmedAt?: string;
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

export type ProjectNotificationSection =
  | 'all'
  | 'kickoff'
  | 'bom'
  | 'shipping'
  | 'sow'
  | 'common_doors'
  | 'installer_logs'
  | 'notes'
  | 'milestones';

export interface ProjectActivityNotification {
  id: string;
  projectId: string;
  propertyName: string;
  assignedPMName: string;
  assignedFieldTech: FieldTechName;
  timestamp: string;
  createdAtIso: string;
  audience: 'pm' | 'field_tech' | 'all';
  category:
    | 'customer_kickoff_submission'
    | 'customer_walkthrough_update'
    | 'customer_acceptance'
    | 'pm_update'
    | 'installer_log'
    | 'bom_update'
    | 'shipping_update'
    | 'sow_update'
    | 'common_door_update'
    | 'note_update'
    | 'milestone_update';
  section?: ProjectNotificationSection;
  sectionTargetId?: string; // HTML element ID for smooth scrolling (e.g. 'pm-bom-table')
  title: string;
  details: string;
  actorName: string;
  actorRole?: 'pm' | 'field_tech' | 'installer_partner' | 'customer' | 'system';
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
  pendingInstallationChanges?: PendingInstallationChange[]; // Staged changes from Field Techs & Integrator Partners awaiting PM confirmation
  kickoffCompleted?: boolean;
  isManuallyCreated?: boolean;
  isBomLocked?: boolean;
  isBomOverridden?: boolean;
  isDiyInstallation?: boolean; // Customer is doing the installation themselves
  originalQuoteBOM?: BOMItem[];
  manualLinkHistory?: ManualLinkQuoteHistory[];
  teamAssists?: TeamAssistEntry[];
  financialMilestones?: FinancialMilestones;
  partnerCourseBundle?: PrePackagedProjectCourseBundle;
  pmpMitigationPlan?: PMPMitigationPlan;
  lastUpdated: string;
}

export type PMPMitigationStrategyType =
  | 'Parallel Installation (Unblocked Zones)'
  | 'Crew Augmentation & Accelerated Staging'
  | 'Blocker Isolation & Vendor Escalation'
  | 'Phased Recovery & Parallel Execution';

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
export function getCategoryUnitLabel(category: string, item?: { name?: string; model?: string }): string {
  if (item && !isLockBOMItem(item) && (category === 'Smart Access Control' || category === 'Common Area & Utilities')) {
    return 'units';
  }
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
      return 'units';
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

  // Choose primary strategy based on project profile & notes
  let strategyType: PMPMitigationStrategyType = 'Parallel Installation (Unblocked Zones)';
  if (isHighRisk && hasSupplyChainOrContractorIssue) {
    strategyType = 'Crew Augmentation & Accelerated Staging';
  } else if (hasInspectorOrPermitIssue) {
    strategyType = 'Blocker Isolation & Vendor Escalation';
  } else if (isHighRisk) {
    strategyType = 'Phased Recovery & Parallel Execution';
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
      : 'No field notes logged yet; plan derived from current status reason and BOM progress.';

  // 1. Current Blocker & Project Notes Summary
  const scheduleVarianceText =
    health.diffDays > 0
      ? `Project is ${health.diffDays} days past its ${project.targetCompletionDate} target (${health.weeksBehindLabel}).`
      : `Target completion is ${project.targetCompletionDate} (${health.weeksBehindLabel}), currently flagged as "${health.effectiveTag}".`;

  const rootCauseSynthesis = [
    `${project.propertyName} (${project.unitsCount} Units, ${project.city}, ${project.state}):`,
    `${scheduleVarianceText} Overall BOM installation is at ${overallBomPct}% (${totalInstalled}/${totalQuoted} devices).`,
    project.statusReason
      ? `Primary Blocker (${pmName}): "${project.statusReason}"`
      : `Active Focus: Recover schedule on milestone "${activeMilestone?.title || 'Implementation'}".`,
    allNotes.length > 0
      ? `Project Notes Context (${allNotes.length} Note${allNotes.length === 1 ? '' : 's'}): ${notesDigest}`
      : `Field Notes: Awaiting additional site updates from ${fieldTech} and ${partners}.`,
  ].join(' ');

  // 2. Field Execution & Schedule Recovery Plan
  const scheduleCompressionPlan = hasInspectorOrPermitIssue
    ? `Isolate the external inspection/permit hold on ${infraBottleneckSummary} so it does not block unit turns. Direct Field Tech ${fieldTech} and integrator partner (${partners}) to continue installing the remaining ${inUnitRemainingSummary} across unblocked residential corridors in parallel. Once inspector/municipal sign-off is cleared, prioritize completing the held interface within 48 hours.`
    : hasSupplyChainOrContractorIssue
    ? `While electrical/GC riser dependencies (${infraBottleneckSummary}) are resolved through daily contractor check-ins, reallocate ${partners} and Field Tech ${fieldTech} to complete 100% of in-unit ${inUnitRemainingSummary} and pre-stage drop locations. As soon as switch/riser gear is mounted, deploy an accelerated crew shift to close the ${health.weeksBehindLabel} gap.`
    : `Run parallel installation waves across ${project.propertyName} (${project.unitsCount} units) with ${fieldTech} and ${partners}, prioritizing ${inUnitRemainingSummary} while concurrently closing out ${infraBottleneckSummary} to stay aligned with the "${activeMilestone?.title || 'Implementation'}" milestone (${activeMilestone?.targetDate || project.targetCompletionDate}).`;

  // 3. Stakeholder & Vendor Coordination Plan
  const latestNote = allNotes[0];
  const stakeholderEscalationPlan = [
    `Coordination Plan for ${project.clientName}:`,
    `1) Field Sync: ${pmName} (PM) and ${fieldTech} (Field Tech) hold a ${isHighRisk ? 'daily 15-minute check-in' : '48-hour sync'} with ${partners} to track daily unit completion.`,
    latestNote
      ? `2) Project Note Follow-Up: Track ${latestNote.author}'s [${latestNote.category}] note ("${latestNote.text}") to completion and escalate to ${project.clientName} regional leadership if delayed >24 hours.`
      : `2) Vendor & Site Escalation: Coordinate directly with ${project.clientName} site leadership regarding "${project.statusReason || 'schedule recovery'}" to clear outstanding dependencies.`,
    `3) CSM Alignment: Keep assigned CSM (${csmName}) updated on the revised completion timeline so staff training and resident onboarding at ${project.propertyName} match physical readiness.`,
  ].join(' ');

  // 4. Contingency & Phased Handover Plan
  const contingencyReserveNotes = isHighRisk
    ? `Phased Handover Option: Complete and sign off all finished residential buildings/floors first so ${project.clientName} can begin resident portal onboarding with CSM ${csmName}, while ring-fencing blocked riser/common-area items (${infraBottleneckSummary}) into a dedicated 5-day closeout punch list.`
    : `Schedule Buffer & Spares: Hold weekend catch-up availability with ${partners} if "${activeMilestone?.title || 'Implementation'}" slips more than 3 business days, and stage on-site spare hardware (${project.bomItems.reduce((acc, i) => acc + (i.sparesCount || 0), 0)} spares allocated) to avoid replacement delays.`;

  // 5. Tailored Action Items
  const actionItems: PMPMitigationActionItem[] = [
    {
      id: `pmp-act-${project.id}-1`,
      phase: 'Immediate (24-48h)',
      pmpTechnique: isHighRisk ? 'Blocker Escalation' : 'Blocker Resolution',
      action: project.statusReason
        ? `Resolve primary blocker on ${project.propertyName}: ${project.statusReason}`
        : `Complete immediate blocker review on ${project.propertyName} (${activeMilestone?.title || 'Implementation'} milestone).`,
      owner: `${pmName} (PM)`,
      status: 'In Progress',
    },
    ...(allNotes.length > 0
      ? allNotes.slice(0, 2).map((note, idx) => ({
          id: `pmp-act-${project.id}-note-${idx + 1}`,
          phase: (idx === 0 ? 'Immediate (24-48h)' : 'Short-Term (7 Days)') as PMPMitigationActionPhase,
          pmpTechnique: `Project Note (${note.category})`,
          action: `Follow up on ${note.author}'s note: "${note.text}" — confirm resolution and log updated status.`,
          owner: `${pmName} & ${fieldTech}`,
          status: 'In Progress' as const,
        }))
      : [
          {
            id: `pmp-act-${project.id}-note-fallback`,
            phase: 'Immediate (24-48h)' as PMPMitigationActionPhase,
            pmpTechnique: 'Field Status Log',
            action: `Log current site blocker & inspection details in Project Notes with ${fieldTech} and ${partners}.`,
            owner: `${fieldTech} (Field Tech)`,
            status: 'Pending' as const,
          },
        ]),
    {
      id: `pmp-act-${project.id}-2`,
      phase: 'Short-Term (7 Days)',
      pmpTechnique: 'Parallel Installation',
      action: `Continue unblocked installation of ${inUnitRemainingSummary} in parallel via ${partners} & ${fieldTech} (advancing BOM from ${overallBomPct}% toward 85%+).`,
      owner: `${fieldTech} & ${partners}`,
      status: 'Pending',
    },
    {
      id: `pmp-act-${project.id}-3`,
      phase: 'Milestone Recovery',
      pmpTechnique: isHighRisk ? 'Accelerated Commissioning' : 'Milestone Target',
      action: `Close out "${activeMilestone?.title || 'Implementation'}" milestone (Target: ${activeMilestone?.targetDate || project.targetCompletionDate}) and finish commissioning ${infraBottleneckSummary}.`,
      owner: `${pmName} & ${partners}`,
      status: 'Pending',
    },
    {
      id: `pmp-act-${project.id}-4`,
      phase: 'Risk Control',
      pmpTechnique: 'Client & CSM Sync',
      action: !project.customerIntake?.walkthroughCompleted
        ? `Complete pending Customer Kickoff Intake & PMS credentials with ${project.clientName} and align CSM ${csmName} on updated handover dates.`
        : `Send updated schedule status to ${project.clientName} and coordinate with CSM ${csmName} for ${project.propertyName} handoff.`,
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
    id: `mitigation-plan-${project.id}`,
    projectId: project.id,
    strategyType,
    pmbokKnowledgeAreas: [
      'Schedule Recovery',
      'Blocker Mitigation',
      'Vendor & Client Coordination',
      'Phased Handover',
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

export function buildCustomerKickoffPortalUrl(projectId: string): string {
  if (typeof window === 'undefined') return `#/customer-kickoff/${projectId}`;
  const origin = window.location.origin;
  let path = window.location.pathname || '/';
  path = path.replace(/index\.html$/i, '');
  if (!path.endsWith('/')) {
    path = `${path}/`;
  }
  return `${origin}${path}#/customer-kickoff/${projectId}`;
}

export function buildProductAcceptancePortalUrl(projectId: string): string {
  if (typeof window === 'undefined') return `#/product-acceptance/${projectId}`;
  const origin = window.location.origin;
  let path = window.location.pathname || '/';
  path = path.replace(/index\.html$/i, '');
  if (!path.endsWith('/')) {
    path = `${path}/`;
  }
  return `${origin}${path}#/product-acceptance/${projectId}`;
}

// ==========================================
// Lock Finishes, Trim & Lever Specifications
// ==========================================

export type LockFamilyType = 'befe' | 'nde' | 'xe360';

// BE & FE Locks (BE467, FE410, etc.)
export type BeFeTrimStyle = 'Greenwich' | 'Addison';
export const BE_FE_TRIM_STYLES: readonly BeFeTrimStyle[] = ['Greenwich', 'Addison'] as const;

export type BeFeColorFinish =
  | '619 - Satin Nickel'
  | '622 - Matte Black'
  | '625 - Polished Chrome'
  | '626 - Satin Chrome'
  | '716 - Aged Bronze';

export const BE_FE_COLOR_FINISHES: readonly BeFeColorFinish[] = [
  '619 - Satin Nickel',
  '622 - Matte Black',
  '625 - Polished Chrome',
  '626 - Satin Chrome',
  '716 - Aged Bronze',
] as const;

// NDE Locks (NDEB Wireless Levers)
export type NdeColorFinish =
  | '605: Bright Brass'
  | '606: Satin Brass'
  | '612: Satin Bronze'
  | '643e: Aged Bronze'
  | '619: Satin Nickel'
  | '622: Matte Black'
  | '625: Bright Chrome'
  | '626: Satin Chrome'
  | '626AM: Satin Chrome with Antimicrobial Coating';

export const NDE_COLOR_FINISHES: readonly NdeColorFinish[] = [
  '605: Bright Brass',
  '606: Satin Brass',
  '612: Satin Bronze',
  '643e: Aged Bronze',
  '619: Satin Nickel',
  '622: Matte Black',
  '625: Bright Chrome',
  '626: Satin Chrome',
  '626AM: Satin Chrome with Antimicrobial Coating',
] as const;

export type NdeLeverType =
  | 'Athens (ATH)'
  | 'Boardwalk (BRK)'
  | 'Broadway (BRW)'
  | 'Latitude (LAT)'
  | 'Longitude (LON)'
  | 'Omega (OME)'
  | 'Rhodes (RHO)'
  | 'Sparta (SPA)'
  | 'Tubular (TLR)';

export const NDE_LEVER_TYPES: readonly NdeLeverType[] = [
  'Athens (ATH)',
  'Boardwalk (BRK)',
  'Broadway (BRW)',
  'Latitude (LAT)',
  'Longitude (LON)',
  'Omega (OME)',
  'Rhodes (RHO)',
  'Sparta (SPA)',
  'Tubular (TLR)',
] as const;

// XE360 Locks (Exit Trim, Tubular, Mortise)
export type Xe360ColorFinish =
  | '619 - Satin Nickel'
  | '622 - Matte Black'
  | '626 - Satin Chrome';

export const XE360_COLOR_FINISHES: readonly Xe360ColorFinish[] = [
  '619 - Satin Nickel',
  '622 - Matte Black',
  '626 - Satin Chrome',
] as const;

export type Xe360LeverStyle =
  | 'BRW - Broadway'
  | 'LAT - Latitude'
  | 'LONE - Longitude-Extended'
  | 'NEP - Neptune (Sparta)';

export const XE360_LEVER_STYLES: readonly Xe360LeverStyle[] = [
  'BRW - Broadway',
  'LAT - Latitude',
  'LONE - Longitude-Extended',
  'NEP - Neptune (Sparta)',
] as const;

export type Xe360Subtype = 'Exit Trim' | 'Tubular' | 'Mortise';
export const XE360_SUBTYPES: readonly Xe360Subtype[] = ['Exit Trim', 'Tubular', 'Mortise'] as const;

export type Xe360ExitTrimCrashbar =
  | 'Falcon 25'
  | 'Von Duprin 98/99 / XP98/99 rim'
  | 'Von Duprin 22 rim/surface vertical rod devices';

export const XE360_EXIT_TRIM_CRASHBARS: readonly Xe360ExitTrimCrashbar[] = [
  'Falcon 25',
  'Von Duprin 98/99 / XP98/99 rim',
  'Von Duprin 22 rim/surface vertical rod devices',
] as const;

export type Xe360ExitTrimFunction =
  | 'Interior push button with LED indicator (B)'
  | 'Interior LED indicator (I)';

export const XE360_EXIT_TRIM_FUNCTIONS: readonly Xe360ExitTrimFunction[] = [
  'Interior push button with LED indicator (B)',
  'Interior LED indicator (I)',
] as const;

export type Xe360TubularFunction =
  | 'Push button (B) - Common areas and package rooms'
  | 'Indicator (I) - Common areas and package rooms';

export const XE360_TUBULAR_FUNCTIONS: readonly Xe360TubularFunction[] = [
  'Push button (B) - Common areas and package rooms',
  'Indicator (I) - Common areas and package rooms',
] as const;

export type Xe360MortiseFunction =
  | 'Interior LED indicator (I)'
  | 'Interior push button (B)'
  | 'Mortise deadbolt with thumbturn and LED indicator (D)';

export const XE360_MORTISE_FUNCTIONS: readonly Xe360MortiseFunction[] = [
  'Interior LED indicator (I)',
  'Interior push button (B)',
  'Mortise deadbolt with thumbturn and LED indicator (D)',
] as const;

export interface LockFinishSplit {
  id: string;
  label?: string; // e.g. "Residential Units", "Clubhouse", "Buildings 1-3"
  quantity: number; // allocated units
  // BE & FE Locks
  befeTrimStyle?: BeFeTrimStyle;
  befeColorFinish?: BeFeColorFinish;
  // NDE Locks
  ndeColorFinish?: NdeColorFinish;
  ndeLeverType?: NdeLeverType;
  // XE360 Locks
  xe360Subtype?: Xe360Subtype;
  xe360ColorFinish?: Xe360ColorFinish;
  xe360LeverStyle?: Xe360LeverStyle;
  xe360ExitTrimCrashbar?: Xe360ExitTrimCrashbar;
  xe360ExitTrimFunction?: Xe360ExitTrimFunction;
  xe360TubularGrade?: string;
  xe360TubularFunction?: Xe360TubularFunction;
  xe360MortiseGrade?: string;
  xe360MortiseFunction?: Xe360MortiseFunction;
  notes?: string;
}

export interface LockFinishConfig {
  family: LockFamilyType;
  // BE & FE Locks
  befeTrimStyle?: BeFeTrimStyle;
  befeColorFinish?: BeFeColorFinish;
  // NDE Locks
  ndeColorFinish?: NdeColorFinish;
  ndeLeverType?: NdeLeverType;
  // XE360 Locks
  xe360Subtype?: Xe360Subtype;
  xe360ColorFinish?: Xe360ColorFinish;
  xe360LeverStyle?: Xe360LeverStyle;
  xe360ExitTrimCrashbar?: Xe360ExitTrimCrashbar;
  xe360ExitTrimFunction?: Xe360ExitTrimFunction;
  xe360TubularGrade?: string; // 'ANSI/BHMA Grade 2'
  xe360TubularFunction?: Xe360TubularFunction;
  xe360MortiseGrade?: string; // 'ANSI/BHMA Grade 1'
  xe360MortiseFunction?: Xe360MortiseFunction;
  customNotes?: string;

  // Split finish choices across line item quantity
  isSplit?: boolean;
  splits?: LockFinishSplit[];
}

export function isLockBOMItem(item: { name?: string; model?: string; category?: string }): boolean {
  if (!item) return false;
  const name = (item.name || '').toLowerCase();
  const model = (item.model || '').toLowerCase();
  const s = `${name} ${model}`;

  // Explicitly exclude non-lock items (Enrollment Readers, MT20W, Readers, Gate Readers, Elevators, Controllers, Intercoms, Fobs, Credentials, Handles)
  if (
    name.includes('enrollment') ||
    name.includes('mt20') ||
    name.includes('mt20w') ||
    name.includes('reader') ||
    name.includes('controller') ||
    name.includes('elevator') ||
    name.includes('intercom') ||
    name.includes('gate') ||
    name.includes('fob') ||
    name.includes('credential') ||
    name.includes('passage handle') ||
    name.includes('handleset') ||
    s.includes('enrollment') ||
    s.includes('mt20') ||
    s.includes('mt20w') ||
    s.includes('gate reader') ||
    s.includes('elevator') ||
    s.includes('fob') ||
    s.includes('credential') ||
    s.includes('card reader') ||
    s.includes('rc reader') ||
    s.includes('rc-reader') ||
    s.includes('rc11') ||
    s.includes('rc15') ||
    s.includes('rck15') ||
    s.includes('controller') ||
    s.includes('intercom')
  ) {
    return false;
  }

  return (
    name.includes('be467') ||
    name.includes('fe410') ||
    name.includes('ndeb') ||
    name.includes('nde') ||
    name.includes('xe360') ||
    name.includes('deadbolt') ||
    name.includes('smart lock') ||
    name.includes('interconnected') ||
    name.includes('mortise') ||
    name.includes('exit trim') ||
    name.includes('tubular') ||
    name.includes('lever') ||
    model.includes('be467') ||
    model.includes('fe410') ||
    model.includes('ndeb') ||
    model.includes('nde') ||
    model.includes('xe360') ||
    (Boolean(item.category && item.category.toLowerCase().includes('smart access control')) && name.includes('lock'))
  );
}

export function detectLockFamily(item: {
  name?: string;
  model?: string;
  category?: string;
  lockFinishConfig?: LockFinishConfig;
}): LockFamilyType {
  const s = `${item?.name || ''} ${item?.model || ''}`.toLowerCase();
  
  // 1. NDEB / NDE commercial wireless levers (must be checked BEFORE generic 'tubular' or 'mortise' to avoid misclassifying NDEB Tubular)
  if (s.includes('ndeb') || s.includes('nde') || s.includes('wireless lever') || s.includes('cylindrical')) {
    return 'nde';
  }

  // 2. BE467 / FE410 / Deadbolts & Interconnected
  if (
    s.includes('be467') ||
    s.includes('be468') ||
    s.includes('be367') ||
    s.includes('fe410') ||
    s.includes('deadbolt') ||
    s.includes('interconnect') ||
    s.includes('qxt-dl') ||
    /\b(be|fe)\b/i.test(s)
  ) {
    return 'befe';
  }

  // 3. XE360 architectural locks (exit trim, tubular, mortise)
  if (s.includes('xe360') || s.includes('xe-360') || s.includes('exit trim') || s.includes('tubular') || (s.includes('mortise') && !s.includes('deadbolt'))) {
    return 'xe360';
  }

  // 4. Fall back to config family if specified and title was generic
  if (item?.lockFinishConfig?.family) {
    return item.lockFinishConfig.family;
  }

  return 'befe';
}

export function isLockFamilyLockedToBOM(item: { name?: string; model?: string }): boolean {
  const s = `${item?.name || ''} ${item?.model || ''}`.toLowerCase();
  return (
    s.includes('xe360') ||
    s.includes('ndeb') ||
    s.includes('nde') ||
    s.includes('be467') ||
    s.includes('be468') ||
    s.includes('be367') ||
    s.includes('fe410') ||
    /\b(be|fe)\b/i.test(s)
  );
}

export function getLockTypeDisplay(
  item: { name?: string; model?: string; category?: string; lockFinishConfig?: LockFinishConfig },
  splitOrSubtype?: Xe360Subtype | { xe360Subtype?: Xe360Subtype }
): string {
  const family = detectLockFamily(item);
  const s = `${item?.name || ''} ${item?.model || ''}`.toUpperCase();

  if (family === 'xe360') {
    let subtype: Xe360Subtype = 'Mortise';
    if (typeof splitOrSubtype === 'string') {
      subtype = splitOrSubtype;
    } else if (splitOrSubtype && typeof splitOrSubtype === 'object' && splitOrSubtype.xe360Subtype) {
      subtype = splitOrSubtype.xe360Subtype;
    } else if (item?.lockFinishConfig?.xe360Subtype) {
      subtype = item.lockFinishConfig.xe360Subtype;
    } else if (s.includes('EXIT')) {
      subtype = 'Exit Trim';
    } else if (s.includes('TUBULAR')) {
      subtype = 'Tubular';
    }
    return `XE360 ${subtype}`;
  }

  if (family === 'nde') {
    if (s.includes('NDEB')) return 'NDEB Series';
    return 'NDE Series';
  }

  // family === 'befe'
  if (s.includes('FE410') || s.includes('INTERCONNECT') || /\bFE\b/.test(s)) {
    return 'FE410 Interconnected';
  }
  if (s.includes('BE467')) {
    return 'BE467 Deadbolt';
  }
  if (s.includes('BE468')) {
    return 'BE468 Deadbolt';
  }
  if (s.includes('BE367')) {
    return 'BE367 Deadbolt';
  }
  if (/\bBE\b/.test(s)) {
    return 'BE Deadbolt';
  }
  if (s.includes('DEADBOLT')) {
    return 'Smart Deadbolt';
  }
  return 'BE467 Deadbolt';
}

export function sanitizeLockSplits(
  splits: LockFinishSplit[],
  family: LockFamilyType
): LockFinishSplit[] {
  return splits.map((s) => {
    if (family === 'befe') {
      return {
        id: s.id,
        label: s.label,
        quantity: Number(s.quantity) || 0,
        befeTrimStyle: s.befeTrimStyle || 'Greenwich',
        befeColorFinish: s.befeColorFinish || '622 - Matte Black',
        notes: s.notes,
      };
    }
    if (family === 'nde') {
      return {
        id: s.id,
        label: s.label,
        quantity: Number(s.quantity) || 0,
        ndeColorFinish: s.ndeColorFinish || '619: Satin Nickel',
        ndeLeverType: s.ndeLeverType || 'Latitude (LAT)',
        notes: s.notes,
      };
    }
    // family === 'xe360'
    return {
      id: s.id,
      label: s.label,
      quantity: Number(s.quantity) || 0,
      xe360Subtype: s.xe360Subtype || 'Mortise',
      xe360ColorFinish: s.xe360ColorFinish || '622 - Matte Black',
      xe360LeverStyle: s.xe360LeverStyle || 'LAT - Latitude',
      xe360ExitTrimCrashbar: s.xe360ExitTrimCrashbar,
      xe360ExitTrimFunction: s.xe360ExitTrimFunction,
      xe360TubularGrade: s.xe360Subtype === 'Tubular' ? 'ANSI/BHMA Grade 2' : undefined,
      xe360TubularFunction: s.xe360TubularFunction,
      xe360MortiseGrade: s.xe360Subtype === 'Mortise' ? 'ANSI/BHMA Grade 1' : undefined,
      xe360MortiseFunction: s.xe360MortiseFunction,
      notes: s.notes,
    };
  });
}

export function getSingleLockFinishSummary(
  config: {
    befeTrimStyle?: BeFeTrimStyle;
    befeColorFinish?: BeFeColorFinish;
    ndeColorFinish?: NdeColorFinish;
    ndeLeverType?: NdeLeverType;
    xe360Subtype?: Xe360Subtype;
    xe360ColorFinish?: Xe360ColorFinish;
    xe360LeverStyle?: Xe360LeverStyle;
  },
  family: LockFamilyType
): string {
  if (family === 'befe') {
    const parts = [config.befeTrimStyle, config.befeColorFinish].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : 'BE/FE Lock';
  }
  if (family === 'nde') {
    const parts = [config.ndeColorFinish, config.ndeLeverType].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : 'NDE Lock';
  }
  if (family === 'xe360') {
    const subtypeLabel = config.xe360Subtype ? `XE360 ${config.xe360Subtype}` : 'XE360';
    const parts = [subtypeLabel, config.xe360ColorFinish, config.xe360LeverStyle].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : 'XE360 Lock';
  }
  return 'Lock';
}

export function getLockFinishSummaryTag(config?: LockFinishConfig): string | null {
  if (!config) return null;
  if (config.isSplit && config.splits && config.splits.length > 0) {
    const splitParts = config.splits.map((s) => {
      const summary = getSingleLockFinishSummary(s, config.family);
      return `${s.quantity}x ${summary}`;
    });
    return `Split: ${splitParts.join(' | ')}`;
  }
  if (config.family === 'befe') {
    const parts = [config.befeTrimStyle, config.befeColorFinish].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : null;
  }
  if (config.family === 'nde') {
    const parts = [config.ndeColorFinish, config.ndeLeverType].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : null;
  }
  if (config.family === 'xe360') {
    const subtypeLabel = config.xe360Subtype ? `XE360 ${config.xe360Subtype}` : 'XE360';
    const parts = [subtypeLabel, config.xe360ColorFinish, config.xe360LeverStyle].filter(Boolean);
    return parts.length > 0 ? parts.join(' · ') : null;
  }
  return null;
}

export function getLockFinishColorHex(colorFinish?: string): string {
  if (!colorFinish) return '#64748B';
  const c = colorFinish.toLowerCase();
  if (c.includes('622') || c.includes('matte black') || c.includes('black')) return '#18181B';
  if (c.includes('619') || c.includes('satin nickel') || c.includes('nickel')) return '#CBD5E1';
  if (c.includes('625') || c.includes('bright chrome') || c.includes('polished chrome')) return '#F1F5F9';
  if (c.includes('626am')) return '#94A3B8';
  if (c.includes('626') || c.includes('satin chrome')) return '#94A3B8';
  if (c.includes('716') || c.includes('643e') || c.includes('aged bronze') || c.includes('bronze')) return '#78350F';
  if (c.includes('605') || c.includes('bright brass')) return '#F59E0B';
  if (c.includes('606') || c.includes('satin brass') || c.includes('brass')) return '#D97706';
  if (c.includes('612') || c.includes('satin bronze')) return '#92400E';
  return '#64748B';
}


