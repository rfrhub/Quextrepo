import { Quote, OperationProject, BOMCategory, BOMItem, DealStage } from '../types';
import { createProjectFromQuote } from '../data/initialData';

const MYQUEXT_PROJECT_ID = 'gen-lang-client-0224797666';
const MYQUEXT_DATABASE_ID = '(default)';
const MYQUEXT_API_KEY = 'AIzaSyC1a9x4a4YOag2Zq6fIjc7PjO3jTtoUqso';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${MYQUEXT_PROJECT_ID}/databases/${encodeURIComponent(
  MYQUEXT_DATABASE_ID
)}/documents`;

function unwrapFirestoreValue(v: any): any {
  if (!v || typeof v !== 'object') return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return Boolean(v.booleanValue);
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('mapValue' in v) {
    const fields = v.mapValue?.fields || {};
    const out: Record<string, any> = {};
    for (const k of Object.keys(fields)) {
      out[k] = unwrapFirestoreValue(fields[k]);
    }
    return out;
  }
  if ('arrayValue' in v) {
    const vals = v.arrayValue?.values || [];
    return vals.map(unwrapFirestoreValue);
  }
  return v;
}

function mapCategory(rawCat: string, rawName: string): BOMCategory {
  const s = `${rawCat || ''} ${rawName || ''}`.toLowerCase();
  if (s.includes('thermostat') || s.includes('hvac')) return 'Smart Thermostats & HVAC';
  if (s.includes('gateway') || s.includes('lora') || s.includes('hub') || s.includes('head-end') || s.includes('core infrastructure')) {
    return 'IoT Gateways & Mesh';
  }
  if (s.includes('leak') || s.includes('sensor') || s.includes('water') || s.includes('flood')) {
    return 'Sensors & Leak Protection';
  }
  if (s.includes('wifi') || s.includes('wi-fi') || s.includes('switch') || s.includes('network') || s.includes('internet') || s.includes('access point')) {
    return 'Bulk Managed Wi-Fi';
  }
  if (s.includes('lock') || s.includes('access') || s.includes('intercom') || s.includes('reader') || s.includes('deadbolt')) {
    return 'Smart Access Control';
  }
  return 'Common Area & Utilities';
}

export function mapMyQuextStageToDealStage(rawStage?: string): DealStage {
  const s = (rawStage || 'Draft').trim();
  switch (s) {
    case 'Deal Won':
    case 'Project Kickoff':
    case 'Proposal Accepted':
    case 'On Deck':
    case 'Fulfilled':
    case 'Accepted':
      return 'Deal Won';
    case 'Pending Contract':
      return 'Contract Review';
    case 'Estimate Sent':
      return 'Proposal Sent';
    case 'Survey/Design Requested':
      return 'Needs Analysis';
    case 'Deal Lost':
    case 'Closed Lost':
    case 'Not Now':
      return 'Closed Lost';
    default:
      return 'Prospect';
  }
}

export async function syncLiveOpportunitiesFromMyQuext(
  existingQuotes: (Quote & { myquextStage?: string; myquextSource?: string; buildType?: string })[],
  existingProjects: OperationProject[]
): Promise<{
  quotes: (Quote & { myquextStage?: string; myquextSource?: string; buildType?: string })[];
  projects: OperationProject[];
  syncedCount: number;
  newWonCount: number;
}> {
  const masks = [
    'propertyDetails',
    'projectName',
    'dealStage',
    'status',
    'salespersonName',
    'ownerName',
    'ownerNames',
    'prospectCompany',
    'mrr',
    'generatedQuote',
    'bomResult',
    'updatedAt',
  ]
    .map((m) => `mask.fieldPaths=${encodeURIComponent(m)}`)
    .join('&');

  const url = `${FIRESTORE_BASE}/analyses?pageSize=100&key=${MYQUEXT_API_KEY}&${masks}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  const docs: any[] = data.documents || [];

  const quotesMap = new Map(existingQuotes.map((q) => [q.id, { ...q }]));
  
  // CRITICAL SAFEGUARD: Never overwrite, mutate, or alter ANY existing project information!
  // Index all existing projects by ID, quoteId, quoteNumber, and propertyName to guarantee
  // that existing projects and their full state (BOM, SOW, milestones, notes, dock items, etc.) are 100% preserved.
  const existingProjectIds = new Set(existingProjects.map((p) => p.id));
  const existingQuoteIds = new Set(existingProjects.map((p) => p.quoteId).filter(Boolean));
  const existingQuoteNumbers = new Set(
    existingProjects.map((p) => (p.quoteNumber || '').trim().toLowerCase()).filter(Boolean)
  );
  const existingPropertyNames = new Set(
    existingProjects.map((p) => (p.propertyName || '').trim().toLowerCase()).filter(Boolean)
  );
  const existingAlphaNames = new Set(
    existingProjects
      .map((p) => (p.propertyName || '').toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter(Boolean)
  );

  const hasMatchingExistingProject = (pId: string, qNum?: string, propN?: string): boolean => {
    if (pId && (existingProjectIds.has(pId) || existingQuoteIds.has(pId))) return true;
    if (qNum && existingQuoteNumbers.has(qNum.trim().toLowerCase())) return true;
    if (propN) {
      const cleanProp = propN.trim().toLowerCase();
      const cleanAlpha = propN.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanProp && existingPropertyNames.has(cleanProp)) return true;
      if (cleanAlpha && existingAlphaNames.has(cleanAlpha)) return true;
    }
    return false;
  };

  const newProjectsMap = new Map<string, OperationProject>();
  let syncedCount = 0;
  let newWonCount = 0;

  const registerNewWonProject = (newProj: OperationProject) => {
    newProjectsMap.set(newProj.id, newProj);
    existingProjectIds.add(newProj.id);
    if (newProj.quoteId) existingQuoteIds.add(newProj.quoteId);
    if (newProj.quoteNumber) existingQuoteNumbers.add(newProj.quoteNumber.trim().toLowerCase());
    if (newProj.propertyName) {
      existingPropertyNames.add(newProj.propertyName.trim().toLowerCase());
      existingAlphaNames.add(newProj.propertyName.toLowerCase().replace(/[^a-z0-9]/g, ''));
    }
    newWonCount++;
  };

  docs.forEach((doc, idx) => {
    const id = String(doc.name || '').split('/').pop() || '';
    if (!id) return;
    const fieldsObj: Record<string, any> = {};
    const rawFields = doc.fields || {};
    for (const k of Object.keys(rawFields)) {
      fieldsObj[k] = unwrapFirestoreValue(rawFields[k]);
    }

    const pd = fieldsObj.propertyDetails || {};
    const propName = String(pd.name || fieldsObj.projectName || '').trim();
    if (!propName || ['test', 'new', 'unnamed'].includes(propName.toLowerCase())) return;
    if (propName.toLowerCase().startsWith('contract testing')) return;

    syncedCount++;
    const rawStage = String(fieldsObj.dealStage || pd.stage || 'Draft').trim();
    const mappedStage = mapMyQuextStageToDealStage(rawStage);
    const existingQ = quotesMap.get(id);

    if (existingQ) {
      // Only overwrite stage from remote if user hasn't manually promoted it to Deal Won locally
      if (existingQ.stage !== 'Deal Won' && mappedStage === 'Deal Won') {
        existingQ.stage = 'Deal Won';
        existingQ.myquextStage = rawStage;
        quotesMap.set(id, existingQ);
        // SAFEGUARD: Never overwrite an existing project! Only instantiate a new project if none exists.
        if (!hasMatchingExistingProject(id, existingQ.quoteNumber, existingQ.propertyName)) {
          const newProj = createProjectFromQuote(existingQ);
          registerNewWonProject(newProj);
        }
      }
      return;
    }

    const units = Number(pd.totalUnits) > 0 ? Number(pd.totalUnits) : 180;
    const addr = pd.address || {};
    const street = typeof addr === 'object' ? addr.street || '100 Main Property Way' : String(addr || '100 Main Property Way');
    const city = typeof addr === 'object' ? addr.city || 'Austin' : 'Austin';
    const state = typeof addr === 'object' ? addr.state || 'TX' : 'TX';
    const owner =
      fieldsObj.ownerName ||
      pd.ownerName ||
      fieldsObj.prospectCompany ||
      (Array.isArray(fieldsObj.ownerNames) ? fieldsObj.ownerNames[0] : '') ||
      'Greystar Real Estate Partners';
    const rep = fieldsObj.salespersonName || 'Blake Miller';

    const gq: any[] = Array.isArray(fieldsObj.generatedQuote) ? fieldsObj.generatedQuote : [];
    const bomItems: BOMItem[] = gq
      .filter((gi) => gi && gi.item)
      .map((gi, bIdx) => {
        const cat = mapCategory(gi.category || gi.section, gi.item);
        return {
          id: `bom-${id.slice(0, 6)}-${bIdx + 1}`,
          name: String(gi.item),
          model: 'QXT-STD-100',
          category: cat,
          location: gi.section || 'All Residential Units',
          quantity: Number(gi.quantity) > 0 ? Number(gi.quantity) : units,
          installedCount: 0,
          unitPrice: Number(gi.discountedUnitPrice || gi.standardMSRP || 195),
          description: gi.notes || 'Synced live from myquext.com',
        };
      });

    if (bomItems.length === 0) {
      bomItems.push(
        {
          id: `bom-${id.slice(0, 6)}-01`,
          name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
          model: 'QXT-DL-900',
          category: 'Smart Access Control',
          location: 'All Residential Units',
          quantity: units,
          installedCount: 0,
          unitPrice: 220,
        },
        {
          id: `bom-${id.slice(0, 6)}-02`,
          name: 'Quext IoT Smart Thermostat (LoRaWAN)',
          model: 'QXT-TH-300',
          category: 'Smart Thermostats & HVAC',
          location: 'All Residential Units',
          quantity: units,
          installedCount: 0,
          unitPrice: 165,
        }
      );
    }

    const newQuote: Quote & { myquextStage?: string; myquextSource?: string; buildType?: string } = {
      id,
      quoteNumber: `QXT-LIVE-${1500 + idx}`,
      propertyName: propName,
      clientName: String(owner),
      address: String(street),
      city: String(city),
      state: String(state),
      unitsCount: units,
      stage: mappedStage,
      myquextStage: rawStage,
      myquextSource: 'analysis',
      buildType: pd.stage || 'Retrofit',
      stageUpdatedAt: String(fieldsObj.updatedAt || doc.updateTime || new Date().toISOString()),
      totalHardwareAmount: bomItems.reduce((acc, b) => acc + b.quantity * b.unitPrice, 0),
      totalInstallAmount: units * 165,
      monthlyServiceFee: units * 28,
      assignedSalesLead: String(rep),
      notes: `Synced live from myquext.com (${rawStage}).`,
      bomItems,
    };

    quotesMap.set(id, newQuote);
    if (mappedStage === 'Deal Won') {
      // SAFEGUARD: Never overwrite an existing project! Only instantiate a new project if none exists.
      if (!hasMatchingExistingProject(id, newQuote.quoteNumber, newQuote.propertyName)) {
        const newProj = createProjectFromQuote(newQuote);
        registerNewWonProject(newProj);
      }
    }
  });

  return {
    quotes: Array.from(quotesMap.values()),
    // SAFEGUARD: All existing project instances are preserved 100% untouched.
    // Only newly discovered won projects that don't match any existing project are appended.
    projects: [
      ...existingProjects,
      ...Array.from(newProjectsMap.values()),
    ],
    syncedCount,
    newWonCount,
  };
}
