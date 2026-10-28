import * as XLSX from 'xlsx';
import {
  OperationProject,
  BOMItem,
  ProjectStatusTag,
  ProjectPlatform,
  AVAILABLE_PMS,
  AVAILABLE_CSMS,
  CSMName,
  FieldTechName,
  normalizeFieldTech,
} from '../types';
import { createDefaultMilestones } from '../data/initialData';

export interface ParsedProjectRow {
  rowNumber: number;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  propertyName: string;
  clientName: string;
  unitsCount: number;
  platform: ProjectPlatform;
  address: string;
  city: string;
  state: string;
  targetCompletionDate: string;
  statusTag: ProjectStatusTag;
  pmName: string;
  csmName: CSMName;
  fieldTechName: FieldTechName;
  integratorPartners: string[];
  locksCount: number;
  thermostatsCount: number;
  gatewaysCount: number;
  notes: string;
  raw: Record<string, any>;
}

export const TEMPLATE_COLUMNS = [
  'Property Name',
  'Client / Owner Name',
  'Residential Units Count',
  'Platform',
  'Street Address',
  'City',
  'State',
  'Target Completion Date (YYYY-MM-DD)',
  'Status Tag',
  'Assigned PM',
  'Assigned CSM',
  'Assigned Field Tech',
  'Integrator Partner',
  'IoT Deadbolt Locks Count',
  'IoT Thermostats Count',
  'Gateways Count',
  'Notes',
];

export const TEMPLATE_SAMPLE_ROWS = [
  [
    'The Vue at Riverwalk',
    'Cortland Communities',
    260,
    'Quext',
    '1250 Riverwalk Pkwy',
    'Austin',
    'TX',
    '2026-12-15',
    'On Track',
    'Raul Recalde',
    'Nicole Franklin',
    'Hector Lopez',
    'SKBM',
    260,
    260,
    4,
    'Phase 1 smart lock and thermostat installation with LoRaWAN gateways.',
  ],
  [
    'Agora Palms Luxury Living',
    'Rich Development Group',
    180,
    'Geokey',
    '450 Palms Blvd',
    'Salt Lake City',
    'UT',
    '2026-11-20',
    'Behind Schedule',
    'Megan Rossman',
    'Tessa Peshke',
    'Sean Gates',
    'SBH',
    180,
    180,
    3,
    'Geokey mobile credential integration with common area access controls.',
  ],
  [
    'The Standard at Renner',
    'Worcester Investments',
    310,
    'Homebase',
    '880 Renner Ave',
    'Kansas City',
    'MO',
    '2027-01-30',
    'On Track',
    'Ian Robertson',
    'Mark Henderson',
    'Hector Lopez',
    'ATB',
    310,
    310,
    5,
    'Homebase multifamily deployment with smart locks and thermostat integration.',
  ],
];

export const TEMPLATE_REFERENCE_GUIDE = [
  ['Column Header', 'Required?', 'Accepted Values / Format', 'Default Value', 'Description'],
  ['Property Name', 'YES', 'Text (e.g. The Vue at Riverwalk)', 'None', 'Full multifamily property community name.'],
  ['Client / Owner Name', 'YES', 'Text (e.g. Cortland Communities)', 'None', 'Management group, asset owner, or property management client.'],
  ['Residential Units Count', 'YES', 'Positive Integer (e.g. 240)', '200', 'Total residential apartments or units in deployment scope.'],
  ['Platform', 'Optional', 'Quext | Geokey | Homebase', 'Quext', 'Smart living ecosystem platform tag.'],
  ['Street Address', 'Optional', 'Text (e.g. 1250 Riverwalk Pkwy)', '100 Main St', 'Physical property address.'],
  ['City', 'Optional', 'Text (e.g. Austin)', 'Austin', 'Property municipality.'],
  ['State', 'Optional', '2-Letter State Code (e.g. TX, UT, MO)', 'TX', 'Property US state.'],
  ['Target Completion Date (YYYY-MM-DD)', 'Optional', 'YYYY-MM-DD or MM/DD/YYYY', '45 days out', 'Scheduled go-live / installation signoff date.'],
  ['Status Tag', 'Optional', 'On Track | Behind Schedule | High Risk | Not Started | Completed', 'On Track', 'Initial project milestone delivery health.'],
  ['Assigned PM', 'Optional', 'Raul Recalde | Bethany Condon | Megan Rossman | Ian Robertson', 'Raul Recalde', 'Quext Project Manager in charge of delivery.'],
  ['Assigned CSM', 'Optional', 'Nicole Franklin | Jasmine Hunt | Tessa Peshke', 'Nicole Franklin', 'Quext Customer Success Manager assigned.'],
  ['Assigned Field Tech', 'Optional', 'Hector Lopez | Sean Gates', 'Hector Lopez', 'Quext Field Engineer assigned for onsite hardware audits.'],
  ['Integrator Partner', 'Optional', 'SKBM | ATB | SBH | Everbase | JTS', 'SKBM', 'Certified subcontractor integrator / installer crew.'],
  ['IoT Deadbolt Locks Count', 'Optional', 'Positive Integer (e.g. 260)', 'Matches Units Count', 'Total smart deadbolts designated in baseline BOM.'],
  ['IoT Thermostats Count', 'Optional', 'Positive Integer (e.g. 260)', 'Matches Units Count', 'Total smart thermostats designated in baseline BOM.'],
  ['Gateways Count', 'Optional', 'Positive Integer (e.g. 4)', '1 per ~60 units (min 2)', 'LoRaWAN Outdoor Base Station gateways.'],
  ['Notes', 'Optional', 'Text', 'None', 'Initial operational remarks, special scope considerations, or comments.'],
];

/**
 * Downloads a pre-formatted Excel (.xlsx) workbook template.
 */
export function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();

  // 1. Projects Data Entry Sheet
  const wsData = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS, ...TEMPLATE_SAMPLE_ROWS]);
  wsData['!cols'] = [
    { wch: 28 }, // Property Name
    { wch: 26 }, // Client / Owner Name
    { wch: 24 }, // Residential Units Count
    { wch: 14 }, // Platform
    { wch: 26 }, // Street Address
    { wch: 18 }, // City
    { wch: 8 },  // State
    { wch: 26 }, // Target Completion Date
    { wch: 16 }, // Status Tag
    { wch: 18 }, // Assigned PM
    { wch: 18 }, // Assigned CSM
    { wch: 20 }, // Assigned Field Tech
    { wch: 18 }, // Integrator Partner
    { wch: 24 }, // IoT Deadbolt Locks Count
    { wch: 22 }, // IoT Thermostats Count
    { wch: 16 }, // Gateways Count
    { wch: 40 }, // Notes
  ];
  XLSX.utils.book_append_sheet(wb, wsData, 'Projects Import');

  // 2. Reference & Guidelines Sheet
  const wsRef = XLSX.utils.aoa_to_sheet(TEMPLATE_REFERENCE_GUIDE);
  wsRef['!cols'] = [{ wch: 32 }, { wch: 12 }, { wch: 48 }, { wch: 24 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsRef, 'Field Guidelines & Options');

  XLSX.writeFile(wb, 'Quext_Projects_Import_Template.xlsx');
}

/**
 * Downloads a pre-formatted CSV (.csv) template.
 */
export function downloadCsvTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS, ...TEMPLATE_SAMPLE_ROWS]);
  XLSX.utils.book_append_sheet(wb, ws, 'Projects');
  XLSX.writeFile(wb, 'Quext_Projects_Import_Template.csv', { bookType: 'csv' });
}

/**
 * Normalizes an arbitrary header name to a canonical key.
 */
function normalizeHeaderKey(header: string): string {
  const clean = header.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (
    clean.includes('property') ||
    clean.includes('community') ||
    clean === 'project' ||
    clean === 'projectname'
  ) {
    return 'propertyName';
  }
  if (
    clean.includes('client') ||
    clean.includes('owner') ||
    clean.includes('company') ||
    clean.includes('customer') ||
    clean.includes('management')
  ) {
    return 'clientName';
  }
  if (
    clean.includes('unit')
  ) {
    return 'unitsCount';
  }
  if (
    clean.includes('platform') ||
    clean.includes('system') ||
    clean.includes('brand')
  ) {
    return 'platform';
  }
  if (
    clean.includes('address') ||
    clean.includes('street')
  ) {
    return 'address';
  }
  if (clean.includes('city') || clean.includes('municipality')) {
    return 'city';
  }
  if (clean === 'state' || clean === 'province' || clean === 'st') {
    return 'state';
  }
  if (
    clean.includes('date') ||
    clean.includes('completion') ||
    clean.includes('golive') ||
    clean.includes('due')
  ) {
    return 'targetCompletionDate';
  }
  if (
    clean.includes('status') ||
    clean.includes('health')
  ) {
    return 'statusTag';
  }
  if (
    clean.includes('pm') ||
    clean.includes('manager')
  ) {
    return 'pmName';
  }
  if (
    clean.includes('csm') ||
    clean.includes('success')
  ) {
    return 'csmName';
  }
  if (
    clean.includes('tech') ||
    clean.includes('field') ||
    clean.includes('engineer')
  ) {
    return 'fieldTechName';
  }
  if (
    clean.includes('integrator') ||
    clean.includes('partner') ||
    clean.includes('installer') ||
    clean.includes('crew')
  ) {
    return 'integratorPartner';
  }
  if (
    clean.includes('lock') ||
    clean.includes('deadbolt')
  ) {
    return 'locksCount';
  }
  if (
    clean.includes('thermostat') ||
    clean.includes('hvac')
  ) {
    return 'thermostatsCount';
  }
  if (
    clean.includes('gateway') ||
    clean.includes('basestation')
  ) {
    return 'gatewaysCount';
  }
  if (
    clean.includes('note') ||
    clean.includes('comment') ||
    clean.includes('scope') ||
    clean.includes('desc')
  ) {
    return 'notes';
  }
  return clean;
}

/**
 * Normalizes a date string or Excel serial number into YYYY-MM-DD.
 */
function normalizeDate(rawVal: any): string {
  if (!rawVal) {
    const d = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  }

  // If number, treat as Excel date serial
  if (typeof rawVal === 'number') {
    try {
      const parsed = XLSX.SSF.parse_date_code(rawVal);
      if (parsed) {
        const y = parsed.y;
        const m = String(parsed.m).padStart(2, '0');
        const d = String(parsed.d).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    } catch {
      // Fallback
    }
  }

  const str = String(rawVal).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  const parsedDate = new Date(str);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }

  // Default 45 days out
  const fallback = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
  return fallback.toISOString().split('T')[0];
}

/**
 * Normalizes platform tag string.
 */
export function normalizePlatform(raw: any): ProjectPlatform {
  if (!raw) return 'Quext';
  const str = String(raw).trim().toLowerCase();
  if (str.includes('geo')) return 'Geokey';
  if (str.includes('home')) return 'Homebase';
  return 'Quext';
}

/**
 * Normalizes status tag string.
 */
export function normalizeStatusTag(raw: any): ProjectStatusTag {
  if (!raw) return 'On Track';
  const str = String(raw).trim().toLowerCase();
  if (str.includes('behind')) return 'Behind Schedule';
  if (str.includes('risk') || str.includes('high')) return 'High Risk';
  if (str.includes('complet')) return 'Completed';
  if (str.includes('not started') || str.includes('new') || str.includes('pending')) return 'Not Started';
  return 'On Track';
}

/**
 * Normalizes PM name against known available PMs.
 */
function normalizePM(raw: any): { name: string; email: string; role: string; phone: string } {
  if (!raw) return AVAILABLE_PMS[0];
  const str = String(raw).trim().toLowerCase();
  const match = AVAILABLE_PMS.find(
    (pm) =>
      pm.name.toLowerCase().includes(str) ||
      str.includes(pm.name.toLowerCase()) ||
      pm.email.toLowerCase().includes(str)
  );
  return match || AVAILABLE_PMS[0];
}

/**
 * Normalizes CSM name.
 */
function normalizeCSM(raw: any): CSMName {
  if (!raw) return 'Nicole Franklin';
  const str = String(raw).trim().toLowerCase();
  const match = AVAILABLE_CSMS.find(
    (csm) => csm.toLowerCase().includes(str) || str.includes(csm.toLowerCase())
  );
  return match || 'Nicole Franklin';
}

/**
 * Parses an ArrayBuffer (from File.arrayBuffer()) of an Excel or CSV file.
 */
export function parseProjectSpreadsheet(
  buffer: ArrayBuffer | Uint8Array,
  fileName: string
): { rows: ParsedProjectRow[]; totalCount: number; validCount: number; warningCount: number; errorCount: number } {
  const wb = XLSX.read(buffer, { type: 'array' });
  if (!wb.SheetNames || wb.SheetNames.length === 0) {
    throw new Error('Spreadsheet has no worksheets.');
  }

  // Use the first worksheet (or sheet containing 'project' in name)
  let sheetName = wb.SheetNames[0];
  const projectSheet = wb.SheetNames.find((s) => s.toLowerCase().includes('project'));
  if (projectSheet) sheetName = projectSheet;

  const sheet = wb.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Unable to read worksheet "${sheetName}".`);
  }

  // Convert to array of records
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

  const parsedRows: ParsedProjectRow[] = [];

  rawRows.forEach((row, idx) => {
    const rowNum = idx + 2; // Row 1 is header
    const normalizedRow: Record<string, any> = {};

    Object.entries(row).forEach(([colHeader, val]) => {
      const canonicalKey = normalizeHeaderKey(colHeader);
      normalizedRow[canonicalKey] = val;
    });

    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Property Name (Required)
    const rawProp = String(normalizedRow['propertyName'] || '').trim();
    if (!rawProp) {
      errors.push('Missing Property Name (Required)');
    }

    // 2. Client Name (Required)
    const rawClient = String(normalizedRow['clientName'] || '').trim();
    if (!rawClient) {
      warnings.push('Client Name was missing; defaulted to "Quext Client Portfolio"');
    }

    // 3. Units Count (Required)
    const rawUnits = parseInt(String(normalizedRow['unitsCount'] || '200'), 10);
    let unitsCount = isNaN(rawUnits) || rawUnits <= 0 ? 200 : rawUnits;
    if (isNaN(rawUnits) || rawUnits <= 0) {
      warnings.push(`Invalid units count "${normalizedRow['unitsCount']}"; defaulted to 200 units`);
    }

    // 4. Platform
    const platform = normalizePlatform(normalizedRow['platform']);

    // 5. Address, City, State
    const address = String(normalizedRow['address'] || '').trim() || '100 Main St';
    const city = String(normalizedRow['city'] || '').trim() || 'Austin';
    const state = String(normalizedRow['state'] || '').trim().toUpperCase() || 'TX';

    // 6. Target Date
    const targetCompletionDate = normalizeDate(normalizedRow['targetCompletionDate']);

    // 7. Status Tag
    const statusTag = normalizeStatusTag(normalizedRow['statusTag']);

    // 8. PM, CSM, Field Tech
    const pm = normalizePM(normalizedRow['pmName']);
    const csm = normalizeCSM(normalizedRow['csmName']);
    const fieldTech = normalizeFieldTech(normalizedRow['fieldTechName']);

    // 9. Integrator Partner
    const rawPartner = String(normalizedRow['integratorPartner'] || '').trim();
    const integratorPartners = rawPartner ? [rawPartner] : ['SKBM'];

    // 10. Hardware overrides
    const rawLocks = parseInt(String(normalizedRow['locksCount'] || ''), 10);
    const locksCount = isNaN(rawLocks) || rawLocks < 0 ? unitsCount : rawLocks;

    const rawThermostats = parseInt(String(normalizedRow['thermostatsCount'] || ''), 10);
    const thermostatsCount = isNaN(rawThermostats) || rawThermostats < 0 ? unitsCount : rawThermostats;

    const rawGateways = parseInt(String(normalizedRow['gatewaysCount'] || ''), 10);
    const gatewaysCount = isNaN(rawGateways) || rawGateways <= 0 ? Math.max(2, Math.ceil(unitsCount / 60)) : rawGateways;

    // 11. Notes
    const notes = String(normalizedRow['notes'] || '').trim();

    const isValid = errors.length === 0;

    parsedRows.push({
      rowNumber: rowNum,
      isValid,
      errors,
      warnings,
      propertyName: rawProp || `Untitled Property (Row ${rowNum})`,
      clientName: rawClient || 'Quext Client Portfolio',
      unitsCount,
      platform,
      address,
      city,
      state,
      targetCompletionDate,
      statusTag,
      pmName: pm.name,
      csmName: csm,
      fieldTechName: fieldTech,
      integratorPartners,
      locksCount,
      thermostatsCount,
      gatewaysCount,
      notes,
      raw: row,
    });
  });

  const totalCount = parsedRows.length;
  const validCount = parsedRows.filter((r) => r.isValid && r.warnings.length === 0).length;
  const warningCount = parsedRows.filter((r) => r.isValid && r.warnings.length > 0).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return {
    rows: parsedRows,
    totalCount,
    validCount,
    warningCount,
    errorCount,
  };
}

/**
 * Converts a validated ParsedProjectRow into an OperationProject object.
 */
export function convertRowToOperationProject(row: ParsedProjectRow, idx: number): OperationProject {
  const timestamp = Date.now() + idx;
  const projectId = `proj-imported-${timestamp}`;
  const pm = normalizePM(row.pmName);
  const startDate = new Date().toISOString().split('T')[0];

  const bomItems: BOMItem[] = [
    {
      id: `bom-imp-lock-${timestamp}`,
      name:
        row.platform === 'Geokey'
          ? 'Geokey Mobile-BLE Mortise & Deadbolt Lock'
          : row.platform === 'Homebase'
          ? 'Homebase Wireless Smart Lock'
          : 'Quext Smart Deadbolt Lock (BLE & Apple Wallet NFC)',
      model: row.platform === 'Geokey' ? 'GEO-LK-200' : row.platform === 'Homebase' ? 'HB-LK-100' : 'QXT-DL-900',
      category: 'Smart Access Control',
      location: 'All Residential Units',
      quantity: row.locksCount,
      sparesCount: Math.max(2, Math.ceil(row.locksCount * 0.05)),
      sparesDelivered: false,
      installedCount: 0,
      unitPrice: row.platform === 'Geokey' ? 245 : 220,
      description: `Smart lock hardware deployed across ${row.unitsCount} units on ${row.platform} platform.`,
      postItLogs: [],
    },
    {
      id: `bom-imp-therm-${timestamp}`,
      name:
        row.platform === 'Homebase'
          ? 'Homebase Hubless Smart Thermostat'
          : 'Quext IoT Smart Thermostat (LoRaWAN Hubless)',
      model: row.platform === 'Homebase' ? 'HB-TH-50' : 'QXT-TH-300',
      category: 'Smart Thermostats & HVAC',
      location: 'All Residential Units',
      quantity: row.thermostatsCount,
      sparesCount: Math.max(2, Math.ceil(row.thermostatsCount * 0.05)),
      sparesDelivered: false,
      installedCount: 0,
      unitPrice: 165,
      description: 'Dual sensor IoT thermostat for energy management.',
      postItLogs: [],
    },
    {
      id: `bom-imp-gw-${timestamp}`,
      name: 'Quext LoRaWAN Outdoor Gateway Base Station (8-Channel)',
      model: 'QXT-GW-LR8',
      category: 'IoT Gateways & Mesh',
      location: 'Clubhouse Rooftop & Central Buildings',
      quantity: row.gatewaysCount,
      sparesCount: 1,
      sparesDelivered: false,
      installedCount: 0,
      unitPrice: 1250,
      description: 'Long-range LoRaWAN base station with cellular failover backhaul.',
      postItLogs: [],
    },
  ];

  const initialNotes = [
    {
      id: `note-${timestamp}`,
      projectId,
      author: pm.name,
      timestamp: 'Just now',
      category: 'General Context' as const,
      text: row.notes
        ? `[Imported from Spreadsheet]: ${row.notes}`
        : `Project imported via spreadsheet with ${row.unitsCount} residential units on ${row.platform}. Assigned Integrator: ${row.integratorPartners.join(', ')}.`,
      isPinned: true,
    },
  ];

  const project: OperationProject = {
    id: projectId,
    quoteId: `import-quote-${timestamp}`,
    quoteNumber: `QXT-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
    propertyName: row.propertyName,
    clientName: row.clientName,
    address: row.address,
    city: row.city,
    state: row.state,
    unitsCount: row.unitsCount,
    heroImage: '/src/assets/images/property_grand_horizon_1792605840266.jpg',
    assignedPM: pm,
    assignedCSM: row.csmName,
    assignedFieldTech: row.fieldTechName,
    integratorPartners: row.integratorPartners,
    statusTag: row.statusTag,
    platform: row.platform,
    statusReason: `Imported via spreadsheet. Target completion set for ${row.targetCompletionDate}.`,
    startDate,
    targetCompletionDate: row.targetCompletionDate,
    isManuallyCreated: true,
    isBomLocked: true,
    bomItems,
    installLogs: [],
    notes: initialNotes,
    milestones: createDefaultMilestones(`m-${projectId}`, startDate, row.targetCompletionDate),
    customerIntake: {
      pmsSoftware: 'Yardi',
      commonAreaDoors: [
        { id: `cad-${timestamp}-1`, doorName: 'Clubhouse Main Entry', buildingOrArea: 'Clubhouse', installedStatus: 'Pending' },
        { id: `cad-${timestamp}-2`, doorName: 'Fitness Center Entry', buildingOrArea: 'Clubhouse Floor 1', installedStatus: 'Pending' },
      ],
      staffRoles: [],
      walkthroughCompleted: false,
      emailUpdatesCadence: 'weekly',
    },
    lastUpdated: new Date().toISOString(),
  };

  return project;
}
