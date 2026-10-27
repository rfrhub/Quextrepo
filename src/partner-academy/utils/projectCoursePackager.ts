import { OperationProject, BOMItem, getProjectIntegratorPartners } from '../../types';
import { COURSE_MODULES, INITIAL_USERS } from '../data/mockData';
import { DOOR_PREP_CUT_SHEETS, HARDWARE_DATA_SHEETS } from '../data/quextLockGuidesData';
import { User } from '../types';

export interface PackagedCourseItem {
  moduleId: string;
  code: string;
  title: string;
  category: string;
  durationMinutes: number;
  difficulty: string;
  hardwareImage: string;
  matchReason: string;
  matchedBomQuantity: number;
  isMandatory: boolean;
}

export interface PackagedGuideItem {
  tabId: string;
  title: string;
  subtitle: string;
  category: 'Field Guide' | 'Wiring Simulator' | 'Checklist' | 'Spec & Cut Sheets';
  badge: string;
  matchReason: string;
  estimatedMinutes: number;
}

export interface PackagedSpecSheetItem {
  id: string;
  title: string;
  code: string;
  type: 'Door Prep Template' | 'Hardware Data Sheet';
  lockModel: string;
  pdfPath: string;
  matchReason: string;
}

export interface PreInstallChecklistItem {
  id: string;
  title: string;
  detail: string;
  category: 'Training & Certs' | 'Site Readiness' | 'Hardware & BOM' | 'Portal & Commissioning';
  completed: boolean;
}

export interface PrePackagedProjectCourseBundle {
  packageId: string;
  projectId: string;
  propertyName: string;
  generatedAt: string;
  generationTrigger: 'Deal Won Automation' | 'Manual Project Creation' | 'BOM Scope Sync';
  assignedPartners: string[];
  courses: PackagedCourseItem[];
  guides: PackagedGuideItem[];
  specSheets: PackagedSpecSheetItem[];
  checklist: PreInstallChecklistItem[];
}

/**
 * Analyzes a project's BOM items, scope flags, and community intake to dynamically build
 * a pre-packaged course, guide, checklist, and spec-sheet bundle from the Quext Partner Academy.
 */
export function buildProjectPrePackagedBundle(
  project: OperationProject,
  generationTrigger?: 'Deal Won Automation' | 'Manual Project Creation' | 'BOM Scope Sync'
): PrePackagedProjectCourseBundle {
  const bomItems: BOMItem[] = project.bomItems || [];
  const existingBundle = project.partnerCourseBundle;
  const trigger =
    generationTrigger ||
    existingBundle?.generationTrigger ||
    (project.isManuallyCreated ? 'Manual Project Creation' : 'Deal Won Automation');

  const assignedPartners = getProjectIntegratorPartners(project);

  const bomText = bomItems
    .map((b) => `${b.name} ${b.model} ${b.category} ${b.location} ${b.description || ''}`)
    .join(' ')
    .toLowerCase();

  // Helper to sum BOM quantities matching a predicate
  const sumBomMatching = (pred: (item: BOMItem) => boolean): { qty: number; names: string[] } => {
    const matched = bomItems.filter(pred);
    return {
      qty: matched.reduce((acc, item) => acc + (item.quantity || 0), 0),
      names: matched.map((m) => `${m.quantity}x ${m.name}`),
    };
  };

  // Detect project hardware categories
  const thermostatMatch = sumBomMatching(
    (b) =>
      b.category === 'Smart Thermostats & HVAC' ||
      /thermostat|hvac|qxt-th|tstat/i.test(`${b.name} ${b.model}`)
  );
  const hasThermostats = thermostatMatch.qty > 0;

  const unitLockMatch = sumBomMatching(
    (b) =>
      b.category === 'Smart Access Control' &&
      /deadbolt|unit|be467|fe410|qxt-dl|lock/i.test(`${b.name} ${b.model} ${b.location}`)
  );
  const hasUnitLocks = unitLockMatch.qty > 0 || bomText.includes('deadbolt') || bomText.includes('lock');

  const commonAccessMatch = sumBomMatching(
    (b) =>
      /intercom|reader|gate|perimeter|rc11|rc15|qxt-ic|common|clubhouse/i.test(
        `${b.name} ${b.model} ${b.location}`
      )
  );
  const hasCommonReadersOrIntercom =
    commonAccessMatch.qty > 0 ||
    Boolean(project.useQrIntercom) ||
    (project.customerIntake?.commonAreaDoors?.length || 0) > 0;

  const leakSensorMatch = sumBomMatching(
    (b) =>
      b.category === 'Sensors & Leak Protection' ||
      /leak|flood|water|sensor|qxt-lk|relay|shutoff/i.test(`${b.name} ${b.model}`)
  );
  const hasLeakSensors = leakSensorMatch.qty > 0;

  const gatewayMatch = sumBomMatching(
    (b) =>
      b.category === 'IoT Gateways & Mesh' ||
      /gateway|lorawan|hub|base station|qxt-gw/i.test(`${b.name} ${b.model}`)
  );
  const hasGateways = gatewayMatch.qty > 0;

  const hasNfcWallet =
    Boolean(project.useNfcWallet) ||
    Boolean(project.communityDetails?.nfcWalletConfigured) ||
    /wallet|nfc|ble|apple/i.test(bomText);

  const hasQrIntercom =
    Boolean(project.useQrIntercom) ||
    Boolean(project.customerIntake?.useQrIntercom) ||
    /intercom|qxt-ic/i.test(bomText);

  // 1. Assemble Required Certification Courses from COURSE_MODULES
  const packagedCourses: PackagedCourseItem[] = [];
  const addCourse = (moduleId: string, matchReason: string, matchedBomQuantity: number, isMandatory = true) => {
    const mod = COURSE_MODULES.find((m) => m.id === moduleId);
    if (!mod || packagedCourses.some((c) => c.moduleId === moduleId)) return;
    packagedCourses.push({
      moduleId: mod.id,
      code: mod.code,
      title: mod.title,
      category: mod.category,
      durationMinutes: mod.durationMinutes,
      difficulty: mod.difficulty,
      hardwareImage: mod.hardwareImage,
      matchReason,
      matchedBomQuantity,
      isMandatory,
    });
  };

  // Always include Portal Commissioning
  const totalHardwareUnits = bomItems.reduce((sum, b) => sum + (b.quantity || 0), 0);
  addCourse(
    'mod_portal_guide',
    `Required for property portal buildout, device binding & commissioning (${project.unitsCount} units / ${totalHardwareUnits.toLocaleString()} total BOM devices)`,
    totalHardwareUnits,
    true
  );

  if (hasThermostats) {
    addCourse(
      'mod_thermostat_onboarding',
      `Matched to ${thermostatMatch.qty.toLocaleString()} Smart Thermostats on BOM (${thermostatMatch.names[0] || 'Quext IoT Smart Thermostat'})`,
      thermostatMatch.qty,
      true
    );
  }

  if (hasUnitLocks) {
    addCourse(
      'mod_befe_locks',
      `Matched to ${unitLockMatch.qty.toLocaleString()} Residential Smart Locks on BOM (${unitLockMatch.names[0] || 'Unit Smart Deadbolts'})`,
      unitLockMatch.qty,
      true
    );
  }

  if (hasNfcWallet || hasUnitLocks) {
    addCourse(
      'mod_nfc_wallet',
      hasNfcWallet
        ? `NFC Apple/Google Wallet enabled for ${project.propertyName} (${unitLockMatch.qty || project.unitsCount} mobile access points)`
        : `Mobile credential provisioning for ${unitLockMatch.qty} Smart Access Locks`,
      unitLockMatch.qty || project.unitsCount,
      true
    );
  }

  if (hasCommonReadersOrIntercom) {
    const doorCount = project.customerIntake?.commonAreaDoors?.length || commonAccessMatch.qty || 4;
    addCourse(
      'mod_rc_card_readers',
      `Matched to ${commonAccessMatch.qty || doorCount} Perimeter / Common Area Access Readers & Intercom Controllers`,
      commonAccessMatch.qty || doorCount,
      true
    );
    addCourse(
      'mod_nde_locks',
      `Matched to Common Area & Amenity Interior Doors (${doorCount} common access points configured)`,
      doorCount,
      false
    );
    addCourse(
      'mod_xe360_locks',
      `Matched to High-Traffic Perimeter / Exit Trim & Common Area Access Doors`,
      doorCount,
      false
    );
  }

  // IoT LoRaWAN Gateways & Mesh Infrastructure (Mandatory when on BOM)
  if (hasGateways) {
    addCourse(
      'mod_gateway_installation',
      `Required for LoRaWAN IoT infrastructure (${gatewayMatch.qty} Base Station Gateway${gatewayMatch.qty > 1 ? 's' : ''} on BOM: ${gatewayMatch.names[0] || 'Base Station Gateway'})`,
      gatewayMatch.qty,
      true
    );
  }

  // 2. Assemble Interactive Field Guides, Checklists & Simulators
  const packagedGuides: PackagedGuideItem[] = [];
  const addGuide = (item: PackagedGuideItem) => {
    if (!packagedGuides.some((g) => g.tabId === item.tabId)) {
      packagedGuides.push(item);
    }
  };

  // Always include Portal Installer Guide & Integration Checklists
  addGuide({
    tabId: 'portal_guide',
    title: 'Quext Portal Installer & Commissioning Guide',
    subtitle: 'Step-by-step property hierarchy, gateway pairing, and room/unit device binding',
    category: 'Field Guide',
    badge: 'Mandatory Prep',
    matchReason: `Required for ${project.propertyName} (${project.customerIntake?.pmsSoftware || project.communityDetails?.pmsSystem || 'PMS'} integration)`,
    estimatedMinutes: 15,
  });

  addGuide({
    tabId: 'integration_checklists',
    title: 'Official Brivo + Quext Integration Checklists',
    subtitle: 'Pre-flight hardware verification, power supply, relay & network readiness checklists',
    category: 'Checklist',
    badge: 'Official Checklist',
    matchReason: `Required pre-installation verification for ${assignedPartners.join(', ')} field crew`,
    estimatedMinutes: 12,
  });

  if (hasNfcWallet || hasUnitLocks) {
    addGuide({
      tabId: 'wallet_guide',
      title: 'NFC Apple/Google Wallet Upgrade Field Guide',
      subtitle: 'Mobile credential reader upgrade sequence, Express Mode test & sync rollout',
      category: 'Field Guide',
      badge: 'NFC Wallet Active',
      matchReason: `NFC Wallet configured on ${project.propertyName} (${unitLockMatch.qty || project.unitsCount} doors)`,
      estimatedMinutes: 15,
    });
  }

  if (hasUnitLocks) {
    addGuide({
      tabId: 'befe_guide',
      title: 'Schlage BE467F / FE410F Unit Lock Field Guide',
      subtitle: 'Deadbolt & interconnected lock installation, 2-turn thumbturn FDR & BLE pairing',
      category: 'Field Guide',
      badge: `${unitLockMatch.qty} Unit Locks`,
      matchReason: `Matched to ${unitLockMatch.qty.toLocaleString()} residential unit locks on BOM`,
      estimatedMinutes: 15,
    });
  }

  if (hasThermostats) {
    addGuide({
      tabId: 'thermostat_flow',
      title: 'Thermostat Onboarding Guide Simulator (QXT100048)',
      subtitle: 'Interactive 12-page sub-base installation, LoRaWAN join & HVAC test flow',
      category: 'Wiring Simulator',
      badge: `${thermostatMatch.qty} Thermostats`,
      matchReason: `Matched to ${thermostatMatch.qty.toLocaleString()} Smart Thermostats on BOM`,
      estimatedMinutes: 18,
    });
    addGuide({
      tabId: 'wiring_sandbox',
      title: 'Quext Thermostat 24VAC Interactive Wiring Sandbox',
      subtitle: 'Hands-on R, Rc, Y, C, W, G, Aux/O/B terminal simulator for Heat Pump & Conventional HVAC',
      category: 'Wiring Simulator',
      badge: 'Interactive Lab',
      matchReason: `Practice 24VAC HVAC terminal wiring prior to ${project.propertyName} unit deployment`,
      estimatedMinutes: 15,
    });
  }

  if (hasLeakSensors) {
    addGuide({
      tabId: 'leak_sensors',
      title: 'Water Leak & Toilet Run Sensor Installation Guide',
      subtitle: 'Probe placement under sinks/water heaters, LoRaWAN telemetry & shutoff relay pairing',
      category: 'Field Guide',
      badge: `${leakSensorMatch.qty} Leak Devices`,
      matchReason: `Matched to ${leakSensorMatch.qty.toLocaleString()} Leak Protection & Shutoff devices on BOM`,
      estimatedMinutes: 14,
    });
  }

  if (hasGateways) {
    addGuide({
      tabId: 'gateway_guide',
      title: 'Quext Smart Community Gateway Installation Guide',
      subtitle: 'TEKTELIC outdoor gateway mounting, Unistrut & antenna, T568B termination, PoE & verification',
      category: 'Field Guide',
      badge: `${gatewayMatch.qty} Gateway${gatewayMatch.qty > 1 ? 's' : ''}`,
      matchReason: `Required for ${gatewayMatch.qty} IoT Base Station Gateway(s) on ${project.propertyName}`,
      estimatedMinutes: 15,
    });
  }

  if (hasCommonReadersOrIntercom) {
    addGuide({
      tabId: 'rc_reader_guide',
      title: 'Schlage RC11 / RC15 Reader Controller Field Guide',
      subtitle: 'Mullion & wall reader installation, IP/RS-485 wiring, and 7-14s FDR sequence',
      category: 'Field Guide',
      badge: 'Common Area Access',
      matchReason: `Matched to perimeter gates & common area access points on ${project.propertyName}`,
      estimatedMinutes: 16,
    });
    addGuide({
      tabId: 'schematics_lab',
      title: 'RC Card Reader & Access Control Wiring Schematics',
      subtitle: 'Official blueprints for 12V/24V electric strikes, RBSN relays, elevators & PS914-2RS power',
      category: 'Wiring Simulator',
      badge: 'Engineering Blueprints',
      matchReason: `Required for common area door strikes & perimeter gate relays`,
      estimatedMinutes: 20,
    });
    addGuide({
      tabId: 'ndeb_guide',
      title: 'Schlage NDE / NDEB Wireless Lever Field Guide',
      subtitle: 'Interior common door cylindrical lock prep, reset pin & 3-turn handle FDR',
      category: 'Field Guide',
      badge: 'Amenity Doors',
      matchReason: `Matched to clubhouse & interior amenity doors`,
      estimatedMinutes: 12,
    });
    addGuide({
      tabId: 'xe360_guide',
      title: 'Schlage XE360 Series Lock Field Guide',
      subtitle: 'Mortise, tubular & exit trim installation and 5-second mode switch FDR',
      category: 'Field Guide',
      badge: 'Exit Trim / Mortise',
      matchReason: `Matched to stairwell exit trims & high-traffic common entries`,
      estimatedMinutes: 14,
    });
  }

  if (hasQrIntercom || hasCommonReadersOrIntercom) {
    addGuide({
      tabId: 'qr_intercom_guide',
      title: 'QR Intercom Plaque & Visitor Directory Guide',
      subtitle: 'Physical QR plaque mounting, resident directory binding & visitor video calling',
      category: 'Field Guide',
      badge: 'QR Intercom',
      matchReason: `Matched to perimeter entry intercom & guest access scope`,
      estimatedMinutes: 10,
    });
    addGuide({
      tabId: 'butterfly_wiring',
      title: 'ButterflyMX Video Intercom to RC Reader Wiring',
      subtitle: '8" & 12" Video Intercom relay connection to Quext RC Reader REX & Common terminals',
      category: 'Wiring Simulator',
      badge: 'Intercom Wiring',
      matchReason: `Matched to video intercom & perimeter gate controller BOM items`,
      estimatedMinutes: 12,
    });
  }

  // Always include Spec Sheets & Cut Sheets
  addGuide({
    tabId: 'spec_sheets',
    title: 'Spec Sheets, Manuals & Door Prep Cut Sheets',
    subtitle: 'Official OEM data sheets, wood/metal door prep templates, and hole routing blueprints',
    category: 'Spec & Cut Sheets',
    badge: '15 OEM PDFs',
    matchReason: `Complete door prep template & hardware spec package for ${project.propertyName}`,
    estimatedMinutes: 10,
  });

  // 3. Assemble relevant Spec Sheets & Door Prep Templates
  const specSheets: PackagedSpecSheetItem[] = [];
  if (hasUnitLocks) {
    DOOR_PREP_CUT_SHEETS.filter((s) => s.lockModel === 'BE467' || s.lockModel === 'FE410').forEach((s) => {
      specSheets.push({
        id: s.id,
        title: s.title,
        code: s.templateCode,
        type: 'Door Prep Template',
        lockModel: s.lockModel,
        pdfPath: s.pdfPath,
        matchReason: `Unit door preparation template for ${unitLockMatch.qty} residential locks`,
      });
    });
    HARDWARE_DATA_SHEETS.filter((s) => s.lockModel === 'BE467' || s.lockModel === 'FE410').forEach((s) => {
      specSheets.push({
        id: s.id,
        title: s.title,
        code: s.docCode,
        type: 'Hardware Data Sheet',
        lockModel: s.lockModel,
        pdfPath: s.pdfPath,
        matchReason: `Technical specifications for residential unit smart locks`,
      });
    });
  }

  if (hasCommonReadersOrIntercom) {
    HARDWARE_DATA_SHEETS.filter(
      (s) => s.lockModel === 'RC Reader' || s.lockModel === 'NDEB' || s.lockModel === 'XE360'
    ).forEach((s) => {
      specSheets.push({
        id: s.id,
        title: s.title,
        code: s.docCode,
        type: 'Hardware Data Sheet',
        lockModel: s.lockModel,
        pdfPath: s.pdfPath,
        matchReason: `Common area & perimeter access hardware specification`,
      });
    });
  }

  // 4. Build Project-Specific Pre-Installation Checklist (preserving completion state if already saved)
  const prevCompletedMap = new Map<string, boolean>();
  if (existingBundle?.checklist) {
    existingBundle.checklist.forEach((item) => {
      prevCompletedMap.set(item.id, item.completed);
    });
  }

  const checklist: PreInstallChecklistItem[] = [
    {
      id: `chk-${project.id}-courses`,
      title: `Complete ${packagedCourses.length} Required Quext Partner Academy Courses`,
      detail: `Ensure all assigned ${assignedPartners.join(', ')} field technicians pass the ${packagedCourses.length} course modules packaged for ${project.propertyName} with 80%+ score.`,
      category: 'Training & Certs',
      completed: prevCompletedMap.get(`chk-${project.id}-courses`) ?? false,
    },
    {
      id: `chk-${project.id}-staging`,
      title: `Confirm Site Staging, Working Hours & Access Credentials`,
      detail: `Staging: ${project.communityDetails?.stagingLocation || 'Property Clubhouse / Main Office'} · Hours: ${project.communityDetails?.installWorkingHours || '9:00 AM - 5:00 PM Mon-Fri'} · Knox/Keys: ${project.communityDetails?.masterFobsKnoxBox || 'Coordinate with Property Manager on arrival'}.`,
      category: 'Site Readiness',
      completed: prevCompletedMap.get(`chk-${project.id}-staging`) ?? false,
    },
    {
      id: `chk-${project.id}-bom`,
      title: `Verify Hardware BOM Delivery & Spares Count (${totalHardwareUnits.toLocaleString()} Total Devices)`,
      detail: `Cross-check delivered shipments at ${project.propertyName} against the ${bomItems.length} BOM line items before beginning unit-by-unit installation.`,
      category: 'Hardware & BOM',
      completed: prevCompletedMap.get(`chk-${project.id}-bom`) ?? false,
    },
  ];

  if (hasGateways) {
    checklist.push({
      id: `chk-${project.id}-gateways`,
      title: `Bring Online ${gatewayMatch.qty} LoRaWAN Base Station Gateways First`,
      detail: `Mount and verify LTE/Ethernet backhaul + 915MHz RSSI coverage prior to pairing unit thermostats or leak sensors.`,
      category: 'Portal & Commissioning',
      completed: prevCompletedMap.get(`chk-${project.id}-gateways`) ?? false,
    });
  }

  if (hasUnitLocks || hasNfcWallet) {
    checklist.push({
      id: `chk-${project.id}-locks`,
      title: `Review Door Prep Templates & NFC Apple/Google Wallet Provisioning Sequence`,
      detail: `Verify wood/metal door prep compatibility and mobile credential reader firmware sequence for ${unitLockMatch.qty || project.unitsCount} locks.`,
      category: 'Hardware & BOM',
      completed: prevCompletedMap.get(`chk-${project.id}-locks`) ?? false,
    });
  }

  if (hasThermostats) {
    checklist.push({
      id: `chk-${project.id}-tstat`,
      title: `Verify HVAC System Type (Conventional vs. Heat Pump) & 24VAC C-Wire`,
      detail: `Review the Interactive 24VAC Wiring Sandbox and confirm thermostat drift range (${project.customerIntake?.thermostatTempRange || '65°F Cool / 75°F Heat'}).`,
      category: 'Hardware & BOM',
      completed: prevCompletedMap.get(`chk-${project.id}-tstat`) ?? false,
    });
  }

  if (hasLeakSensors) {
    checklist.push({
      id: `chk-${project.id}-leak`,
      title: `Review Water Leak Detector & Shutoff Relay Placement Protocol`,
      detail: `Confirm probe placement under kitchen sinks, water heater pans, and toilet tank run sensors (${leakSensorMatch.qty.toLocaleString()} devices).`,
      category: 'Hardware & BOM',
      completed: prevCompletedMap.get(`chk-${project.id}-leak`) ?? false,
    });
  }

  checklist.push({
    id: `chk-${project.id}-portal`,
    title: `Coordinate Daily Installer Log & Portal Device Binding with Quext Field Tech (${project.assignedFieldTech || 'Hector Lopez'})`,
    detail: `Log completed buildings/units daily and verify 100% online telemetry in the Quext Installer Portal with PM ${project.assignedPM?.name || 'Raul Recalde'}.`,
    category: 'Portal & Commissioning',
    completed: prevCompletedMap.get(`chk-${project.id}-portal`) ?? false,
  });

  return {
    packageId: existingBundle?.packageId || `pkg-${project.id}`,
    projectId: project.id,
    propertyName: project.propertyName,
    generatedAt: existingBundle?.generatedAt || new Date().toISOString(),
    generationTrigger: trigger,
    assignedPartners,
    courses: packagedCourses,
    guides: packagedGuides,
    specSheets,
    checklist,
  };
}

export interface PartnerIdentityDirectoryEntry {
  partnerShortName: string;
  companyId: string;
  companyName: string;
  companyCode: string;
  defaultEmail: string;
  leadName: string;
  region: string;
  aliases: string[];
}

export const PARTNER_IDENTITY_DIRECTORY: PartnerIdentityDirectoryEntry[] = [
  {
    partnerShortName: 'Spirit Security',
    companyId: 'comp_spirit',
    companyName: 'Spirit Security',
    companyCode: 'SPR-101',
    defaultEmail: 'shanna@spiritsecurityllc.com',
    leadName: 'Shanna Olmstead (Spirit Security)',
    region: 'Southeast & National Integrations',
    aliases: ['spirit security', 'spirit', 'spiritsecurityllc.com', 'spiritsecurity', 'shanna', 'olmstead'],
  },
  {
    partnerShortName: 'Engineered Controls',
    companyId: 'comp_engineered',
    companyName: 'Engineered Controls',
    companyCode: 'ENC-202',
    defaultEmail: 'ajones@engineeredcontrols.com',
    leadName: 'Adam Jones (Engineered Controls)',
    region: 'Midwest & Central Region',
    aliases: ['engineered controls', 'engineered', 'engineeredcontrols.com', 'engineeredcontrols', 'eci', 'adam jones', 'ajones'],
  },
  {
    partnerShortName: 'Everbase Solutions',
    companyId: 'comp_everbase',
    companyName: 'Everbase Solutions',
    companyCode: 'EVB-303',
    defaultEmail: 'erik@everbasesolutions.com',
    leadName: 'Erik Burch (Everbase Solutions)',
    region: 'Houston & Gulf Coast Region',
    aliases: ['everbase solutions', 'everbase', 'everbasesolutions.com', 'everbasesolutions', 'erik burch', 'erik', 'installer@everbase.io', 'carlos mendez'],
  },
  {
    partnerShortName: 'SKBM Smart Tech',
    companyId: 'comp_skbm',
    companyName: 'SKBM Smart Tech',
    companyCode: 'SKB-404',
    defaultEmail: 'bill@skbmsmarttech.com',
    leadName: 'Bill Meyers (SKBM Smart Tech)',
    region: 'Texas & Southwest Region',
    aliases: ['skbm smart tech', 'skbm', 'skbmsmarttech.com', 'skbmsmarttech', 'bill meyers', 'bill', 'marcus vance', 'installer@skbmintegrations.com'],
  },
  {
    partnerShortName: 'Southbay Hardware',
    companyId: 'comp_southbay',
    companyName: 'Southbay Hardware',
    companyCode: 'SBH-505',
    defaultEmail: 'kyle@southbayhardware.com',
    leadName: 'Kyle Brunet (Southbay Hardware)',
    region: 'North Texas & West Region',
    aliases: ['southbay hardware', 'southbay', 'southbayhardware.com', 'southbayhardware', 'sbh', 'kyle brunet', 'kyle', 'david kim', 'installer@sbhintegrators.com'],
  },
  {
    partnerShortName: 'ATB Commercial Field',
    companyId: 'comp_atb',
    companyName: 'ATB Commercial Field Solutions',
    companyCode: 'ATB-606',
    defaultEmail: 'ops@atbfield.com',
    leadName: 'Elena Rostova (ATB Lead)',
    region: 'DFW & Central Region',
    aliases: ['atb', 'atbfield', 'protech', 'protechfield', 'elena rostova'],
  },
  {
    partnerShortName: 'JTS Multifamily',
    companyId: 'comp_jts',
    companyName: 'JTS Multifamily Installations',
    companyCode: 'JTS-707',
    defaultEmail: 'installer@jtsintegrations.com',
    leadName: 'Jason Taylor (JTS Lead)',
    region: 'National Multifamily Deployment',
    aliases: ['jts', 'jtsintegrations'],
  },
  {
    partnerShortName: 'RMR Partners',
    companyId: 'comp_rmr',
    companyName: 'RMR Multifamily Integration Partners',
    companyCode: 'RMR-808',
    defaultEmail: 'installer@rmrintegrations.com',
    leadName: 'Ryan Miller (RMR Lead)',
    region: 'National Turnkey Integrations',
    aliases: ['rmr', 'rmrintegrations'],
  },
  {
    partnerShortName: 'All Media Systems',
    companyId: 'comp_allmedia',
    companyName: 'All Media Low-Voltage & IoT Systems',
    companyCode: 'AMD-909',
    defaultEmail: 'ops@allmediaintegrations.com',
    leadName: 'Devon Brooks (All Media Lead)',
    region: 'Southeast & Mid-Atlantic Region',
    aliases: ['all media', 'allmedia', 'allmediaintegrations'],
  },
  {
    partnerShortName: 'DIY',
    companyId: 'comp_diy',
    companyName: 'DIY (Customer Self-Install)',
    companyCode: 'DIY-000',
    defaultEmail: 'customer@diy-install.com',
    leadName: 'Customer On-Site Team (DIY Self-Install)',
    region: 'Property Owner & Maintenance Self-Deployment',
    aliases: ['diy', 'customer self-install', 'self-install', 'diy partner', 'customer install', 'diy@customerinstall.com'],
  },
];

/**
 * Accurately determines if a project's assigned partner matches a partner academy company/user identity.
 * Handles abbreviations ('SKBM' vs 'SKBM Smart Tech'), aliases, and company IDs.
 */
export function isPartnerMatching(projectPartner: string, candidatePartnerName?: string | null): boolean {
  if (!candidatePartnerName) return false;
  const p1 = projectPartner.trim().toLowerCase();
  const p2 = candidatePartnerName.trim().toLowerCase();
  if (p1 === p2 || p1.includes(p2) || p2.includes(p1)) return true;

  for (const dir of PARTNER_IDENTITY_DIRECTORY) {
    const dShort = dir.partnerShortName.toLowerCase();
    const dComp = dir.companyName.toLowerCase();
    const matchesCandidate =
      dShort === p2 ||
      dComp.includes(p2) ||
      dir.aliases.some((a) => a.toLowerCase() === p2 || a.toLowerCase().includes(p2) || p2.includes(a.toLowerCase()));

    if (matchesCandidate) {
      if (
        dShort === p1 ||
        dShort.includes(p1) ||
        p1.includes(dShort) ||
        dir.aliases.some((a) => a.toLowerCase() === p1 || a.toLowerCase().includes(p1) || p1.includes(a.toLowerCase()))
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Given any email address or partner name, determines if it belongs to an Integrator Partner,
 * a Quext Field Tech, or a Quext PM/Director for simulated myquext.com email-based routing.
 */
export function resolveMyQuextEmailIdentity(
  emailInput: string,
  projects: OperationProject[] = []
):
  | { portal: 'field_tech'; fieldTech: 'Sean Gates' | 'Hector Lopez'; email: string }
  | { portal: 'pm_operations'; pmName: string; email: string }
  | {
      portal: 'partner_academy';
      partnerShortName: string;
      companyId: string;
      companyName: string;
      companyCode: string;
      userName: string;
      email: string;
    } {
  const cleaned = emailInput.trim().toLowerCase();

  // 1. Check Quext Field Techs
  if (cleaned.includes('sean.gates') || cleaned === 'sean@onequext.com' || cleaned.includes('sean')) {
    return {
      portal: 'field_tech',
      fieldTech: 'Sean Gates',
      email: 'sean.gates@onequext.com',
    };
  }
  if (cleaned.includes('hector.lopez') || cleaned === 'hector@onequext.com' || cleaned.includes('hector')) {
    return {
      portal: 'field_tech',
      fieldTech: 'Hector Lopez',
      email: 'hector.lopez@onequext.com',
    };
  }

  // 2. Check Quext Internal PM / Leadership (@onequext.com or PM names)
  if (
    cleaned.includes('raul') ||
    cleaned.includes('bethany') ||
    cleaned.includes('megan') ||
    cleaned.includes('ian') ||
    cleaned.includes('robertson') ||
    cleaned.includes('roberston') ||
    cleaned.includes('nicole') ||
    cleaned.includes('jasmine') ||
    cleaned.endsWith('@onequext.com')
  ) {
    const pmName = cleaned.includes('bethany')
      ? 'Bethany Condon'
      : cleaned.includes('megan')
      ? 'Megan Rossman'
      : (cleaned.includes('ian') || cleaned.includes('robertson') || cleaned.includes('roberston'))
      ? 'Ian Robertson'
      : 'Raul Recalde';
    return {
      portal: 'pm_operations',
      pmName,
      email: cleaned.includes('@') ? cleaned : 'raul.recalde@onequext.com',
    };
  }

  // 3. Check known Partner Identity Directory
  for (const entry of PARTNER_IDENTITY_DIRECTORY) {
    if (
      cleaned === entry.defaultEmail.toLowerCase() ||
      entry.aliases.some((alias) => cleaned.includes(alias))
    ) {
      return {
        portal: 'partner_academy',
        partnerShortName: entry.partnerShortName,
        companyId: entry.companyId,
        companyName: entry.companyName,
        companyCode: entry.companyCode,
        userName: entry.leadName,
        email: cleaned.includes('@') ? cleaned : entry.defaultEmail,
      };
    }
  }

  // 4. Check if email matches any custom integrator partner assigned to any project
  const allProjectPartners = new Set<string>();
  projects.forEach((p) => {
    (p.integratorPartners || []).forEach((partner) => {
      if (partner && partner.trim()) allProjectPartners.add(partner.trim());
    });
  });

  for (const partnerName of Array.from(allProjectPartners)) {
    const slug = partnerName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (slug && cleaned.replace(/[^a-z0-9]/g, '').includes(slug)) {
      return {
        portal: 'partner_academy',
        partnerShortName: partnerName,
        companyId: `comp_${slug}`,
        companyName: `${partnerName} Integration Partners`,
        companyCode: `${slug.slice(0, 3).toUpperCase()}-808`,
        userName: `${partnerName} Lead Installer`,
        email: cleaned.includes('@') ? cleaned : `installer@${slug}.com`,
      };
    }
  }

  // 5. Fallback: Any external contractor email routes to the Quext Partner Training & Certification Academy Portal
  const domainPart = cleaned.split('@')[1]?.split('.')[0] || 'partner';
  const matchedDefault = PARTNER_IDENTITY_DIRECTORY[0];
  return {
    portal: 'partner_academy',
    partnerShortName: matchedDefault.partnerShortName,
    companyId: matchedDefault.companyId,
    companyName:
      domainPart !== 'partner'
        ? `${domainPart.toUpperCase()} Integration Partners (${matchedDefault.partnerShortName})`
        : matchedDefault.companyName,
    companyCode: matchedDefault.companyCode,
    userName: cleaned.split('@')[0] || matchedDefault.leadName,
    email: cleaned.includes('@') ? cleaned : matchedDefault.defaultEmail,
  };
}

const STORAGE_KEY_USERS = 'quext_academy_users_v3';

export function loadPartnerAcademyUsers(): User[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (saved) {
      const parsed: User[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((u) => u.id));
      const missing = INITIAL_USERS.filter((u) => !existingIds.has(u.id));
      return [...missing, ...parsed];
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_USERS;
}

export function savePartnerAcademyUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    window.dispatchEvent(new Event('quext-partner-progress-updated'));
  } catch (e) {
    console.error(e);
  }
}

export function findPartnerUserAndDirectory(partnerShortName: string, usersList?: User[]): {
  dirEntry: PartnerIdentityDirectoryEntry;
  user: User;
} {
  const users = usersList || loadPartnerAcademyUsers();
  const normalized = partnerShortName.trim().toLowerCase();

  const dirEntry =
    PARTNER_IDENTITY_DIRECTORY.find(
      (d) =>
        d.partnerShortName.toLowerCase() === normalized ||
        d.companyId.toLowerCase() === normalized ||
        d.aliases.some((a) => normalized.includes(a))
    ) || {
      partnerShortName,
      companyId: `comp_${normalized.replace(/[^a-z0-9]/g, '')}`,
      companyName: `${partnerShortName} Integration Partners`,
      companyCode: `${partnerShortName.slice(0, 3).toUpperCase()}-808`,
      defaultEmail: `installer@${normalized.replace(/[^a-z0-9]/g, '')}.com`,
      leadName: `${partnerShortName} Lead Installer`,
      region: 'National Deployment',
      aliases: [normalized],
    };

  const user =
    users.find((u) => u.companyId === dirEntry.companyId) ||
    users.find((u) => u.email.toLowerCase() === dirEntry.defaultEmail.toLowerCase()) ||
    users[0];

  return { dirEntry, user };
}

export interface PartnerModuleProgressItem {
  moduleId: string;
  code: string;
  title: string;
  category: string;
  progressPct: number;
  quizScore?: number;
  isCompleted: boolean;
}

export interface PartnerOverallCourseSummary {
  partnerShortName: string;
  companyId: string;
  companyName: string;
  companyCode: string;
  leadName: string;
  email: string;
  region: string;
  overallPct: number;
  completedModulesCount: number;
  totalModulesCount: number;
  passedQuizzesCount: number;
  isAllAcademyCompleted: boolean;
  modules: PartnerModuleProgressItem[];
}

/**
 * Returns the overall course progress across all 7 Quext Partner Academy modules
 * for a given Integrator Partner (e.g., 'SKBM', 'ATB', 'SBH', 'Everbase', 'JTS', 'RMR', 'All Media').
 */
export function getPartnerOverallProgress(
  partnerShortName: string,
  usersList?: User[]
): PartnerOverallCourseSummary {
  const { dirEntry, user } = findPartnerUserAndDirectory(partnerShortName, usersList);

  const modules: PartnerModuleProgressItem[] = COURSE_MODULES.map((mod) => {
    const rawPct = user?.progress?.[mod.id] || 0;
    const quizScore = user?.quizScores?.[mod.id];
    const passedQuiz = quizScore !== undefined && quizScore >= (mod.quiz?.passingScore || 80);
    const isCompleted = rawPct >= 100 || passedQuiz;
    const progressPct = isCompleted ? 100 : rawPct;

    return {
      moduleId: mod.id,
      code: mod.code,
      title: mod.title,
      category: mod.category,
      progressPct,
      quizScore,
      isCompleted,
    };
  });

  const totalModulesCount = modules.length;
  const completedModulesCount = modules.filter((m) => m.isCompleted).length;
  const passedQuizzesCount = modules.filter(
    (m) => m.quizScore !== undefined && m.quizScore >= 80
  ).length;
  const overallPct =
    totalModulesCount > 0
      ? Math.round(modules.reduce((acc, m) => acc + m.progressPct, 0) / totalModulesCount)
      : 0;

  return {
    partnerShortName: dirEntry.partnerShortName,
    companyId: dirEntry.companyId,
    companyName: dirEntry.companyName,
    companyCode: dirEntry.companyCode,
    leadName: user?.name || dirEntry.leadName,
    email: user?.email || dirEntry.defaultEmail,
    region: dirEntry.region,
    overallPct,
    completedModulesCount,
    totalModulesCount,
    passedQuizzesCount,
    isAllAcademyCompleted: completedModulesCount === totalModulesCount,
    modules,
  };
}

export interface ProjectPartnerCourseItemStatus {
  moduleId: string;
  code: string;
  title: string;
  category: string;
  isMandatory: boolean;
  matchReason: string;
  matchedBomQuantity: number;
  progressPct: number;
  quizScore?: number;
  isCompleted: boolean;
}

export interface ProjectAssignedPartnerStatus {
  partnerShortName: string;
  companyId: string;
  companyName: string;
  companyCode: string;
  leadName: string;
  email: string;
  isCompleted: boolean;
  completedCoursesCount: number;
  totalCoursesCount: number;
  progressPct: number;
  overallAcademyPct: number;
  courseStatuses: ProjectPartnerCourseItemStatus[];
}

export interface ProjectCourseCompletionEvaluation {
  projectId: string;
  propertyName: string;
  assignedPartners: string[];
  isCompleted: boolean;
  statusLabel: 'Completed' | 'In Progress' | 'Not Started';
  overallProjectCoursePct: number;
  completedCoursesCount: number;
  totalCoursesCount: number;
  checklistCompletedCount: number;
  checklistTotalCount: number;
  partnerStatuses: ProjectAssignedPartnerStatus[];
}

/**
 * Evaluates whether the Integrator Partner(s) assigned to a project have completed
 * the pre-packaged courses required for that specific project.
 */
export function getProjectPartnerCourseCompletion(
  project: OperationProject,
  usersList?: User[]
): ProjectCourseCompletionEvaluation {
  const users = usersList || loadPartnerAcademyUsers();
  const bundle = project.partnerCourseBundle || buildProjectPrePackagedBundle(project);
  const assignedPartners = getProjectIntegratorPartners(project);

  // Required courses for the project (prioritize mandatory BOM-matched courses, or all packaged courses)
  const requiredCourses =
    bundle.courses.filter((c) => c.isMandatory).length > 0
      ? bundle.courses.filter((c) => c.isMandatory)
      : bundle.courses;

  const partnerStatuses: ProjectAssignedPartnerStatus[] = assignedPartners.map((partnerName) => {
    const { dirEntry, user } = findPartnerUserAndDirectory(partnerName, users);
    const overallSummary = getPartnerOverallProgress(partnerName, users);

    const courseStatuses: ProjectPartnerCourseItemStatus[] = requiredCourses.map((c) => {
      const rawPct = user?.progress?.[c.moduleId] || 0;
      const quizScore = user?.quizScores?.[c.moduleId];
      const passedQuiz = quizScore !== undefined && quizScore >= 80;
      const isCompleted = rawPct >= 100 || passedQuiz;
      const progressPct = isCompleted ? 100 : rawPct;

      return {
        moduleId: c.moduleId,
        code: c.code,
        title: c.title,
        category: c.category,
        isMandatory: c.isMandatory,
        matchReason: c.matchReason,
        matchedBomQuantity: c.matchedBomQuantity,
        progressPct,
        quizScore,
        isCompleted,
      };
    });

    const totalCoursesCount = courseStatuses.length;
    const completedCoursesCount = courseStatuses.filter((cs) => cs.isCompleted).length;
    const progressPct =
      totalCoursesCount > 0
        ? Math.round(
            courseStatuses.reduce((sum, cs) => sum + cs.progressPct, 0) / totalCoursesCount
          )
        : 100;
    const isCompleted = totalCoursesCount > 0 && completedCoursesCount === totalCoursesCount;

    return {
      partnerShortName: dirEntry.partnerShortName,
      companyId: dirEntry.companyId,
      companyName: dirEntry.companyName,
      companyCode: dirEntry.companyCode,
      leadName: user?.name || dirEntry.leadName,
      email: user?.email || dirEntry.defaultEmail,
      isCompleted,
      completedCoursesCount,
      totalCoursesCount,
      progressPct,
      overallAcademyPct: overallSummary.overallPct,
      courseStatuses,
    };
  });

  const primaryPartner = partnerStatuses[0];
  const isCompleted =
    partnerStatuses.length > 0 && partnerStatuses.every((ps) => ps.isCompleted);
  const overallProjectCoursePct =
    partnerStatuses.length > 0
      ? Math.round(
          partnerStatuses.reduce((sum, ps) => sum + ps.progressPct, 0) / partnerStatuses.length
        )
      : 0;

  const completedCoursesCount = primaryPartner ? primaryPartner.completedCoursesCount : 0;
  const totalCoursesCount = primaryPartner ? primaryPartner.totalCoursesCount : requiredCourses.length;

  const checklistTotalCount = bundle.checklist.length;
  const checklistCompletedCount = bundle.checklist.filter((chk) => chk.completed).length;

  const statusLabel: 'Completed' | 'In Progress' | 'Not Started' = isCompleted
    ? 'Completed'
    : overallProjectCoursePct > 0
    ? 'In Progress'
    : 'Not Started';

  return {
    projectId: project.id,
    propertyName: project.propertyName,
    assignedPartners,
    isCompleted,
    statusLabel,
    overallProjectCoursePct,
    completedCoursesCount,
    totalCoursesCount,
    checklistCompletedCount,
    checklistTotalCount,
    partnerStatuses,
  };
}

/**
 * Toggles a single course module's completion state for an Integrator Partner
 * and broadcasts the update across the Live Activity Hub and Project pages.
 */
export function togglePartnerSingleCourseCompletion(
  partnerShortName: string,
  moduleId: string
): void {
  const users = loadPartnerAcademyUsers();
  const { user } = findPartnerUserAndDirectory(partnerShortName, users);
  if (!user) return;

  const currentPct = user.progress?.[moduleId] || 0;
  const currentScore = user.quizScores?.[moduleId];
  const isCurrentlyCompleted = currentPct >= 100 || (currentScore !== undefined && currentScore >= 80);

  const updatedUsers = users.map((u) => {
    if (u.id !== user.id) return u;
    const nextProgress = { ...u.progress, [moduleId]: isCurrentlyCompleted ? 50 : 100 };
    const nextScores = { ...u.quizScores };
    if (isCurrentlyCompleted) {
      delete nextScores[moduleId];
    } else {
      nextScores[moduleId] = 94;
    }
    return {
      ...u,
      progress: nextProgress,
      quizScores: nextScores,
    };
  });

  savePartnerAcademyUsers(updatedUsers);
}

/**
 * Marks all required courses for a specific project as Completed (or In Progress)
 * for the specified Integrator Partner.
 */
export function setPartnerCourseCompletionForProject(
  project: OperationProject,
  partnerShortName: string,
  markComplete: boolean
): void {
  const users = loadPartnerAcademyUsers();
  const { user } = findPartnerUserAndDirectory(partnerShortName, users);
  if (!user) return;

  const bundle = project.partnerCourseBundle || buildProjectPrePackagedBundle(project);
  const requiredCourses =
    bundle.courses.filter((c) => c.isMandatory).length > 0
      ? bundle.courses.filter((c) => c.isMandatory)
      : bundle.courses;

  const updatedUsers = users.map((u) => {
    if (u.id !== user.id) return u;
    const nextProgress = { ...u.progress };
    const nextScores = { ...u.quizScores };

    requiredCourses.forEach((c, idx) => {
      if (markComplete) {
        nextProgress[c.moduleId] = 100;
        if (!nextScores[c.moduleId] || nextScores[c.moduleId] < 80) {
          nextScores[c.moduleId] = 92;
        }
      } else {
        // Leave first courses complete and last one in progress (60%)
        if (idx === requiredCourses.length - 1) {
          nextProgress[c.moduleId] = 60;
          delete nextScores[c.moduleId];
        }
      }
    });

    return {
      ...u,
      progress: nextProgress,
      quizScores: nextScores,
    };
  });

  savePartnerAcademyUsers(updatedUsers);
}

