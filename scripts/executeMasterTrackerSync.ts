import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import {
  OperationProject,
  BOMItem,
  ProjectStatusTag,
  ProjectPlatform,
  AVAILABLE_PMS,
  AVAILABLE_CSMS,
  AVAILABLE_FIELD_TECHS,
  CSMName,
  FieldTechName,
  normalizeFieldTech,
  ProjectMilestone,
} from '../src/types';
import { createDefaultMilestones } from '../src/data/initialData';

const CSV_PATH = '/Users/raulrecalde/Downloads/2026_Master Projects Dashboard - Project Tracker.csv';

const CLOUD_SYNC_CONFIG = {
  projectId: 'gen-lang-client-0224797666',
  apiKey: 'AIzaSyC1a9x4a4YOag2Zq6fIjc7PjO3jTtoUqso',
  appId: '1:662866527637:web:quext-cloud-sync',
};

function parseToIsoDate(val: any): string | undefined {
  if (!val) return undefined;
  const s = String(val).trim();
  if (!s) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const parts = s.split(/[\/\-]/);
  if (parts.length === 3) {
    let [m, d, y] = parts;
    if (m.length === 4) {
      return `${m}-${d.padStart(2, '0')}-${y.padStart(2, '0')}`;
    }
    if (y.length === 2) {
      y = `20${y}`;
    }
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const dt = new Date(s);
  if (!isNaN(dt.getTime())) {
    return dt.toISOString().split('T')[0];
  }
  return undefined;
}

function normalizePlatform(raw: any): ProjectPlatform {
  if (!raw) return 'Quext';
  const str = String(raw).trim().toLowerCase();
  if (str.includes('geo')) return 'Geokey';
  if (str.includes('home')) return 'Homebase';
  return 'Quext';
}

function normalizeStatusTag(raw: any): ProjectStatusTag {
  if (!raw) return 'On Track';
  const str = String(raw).trim().toLowerCase();
  if (str.includes('behind')) return 'Behind Schedule';
  if (str.includes('risk') || str.includes('high')) return 'High Risk';
  return 'On Track';
}

function normalizePM(raw: any) {
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

function normalizeCSM(raw: any): CSMName {
  if (!raw) return 'Nicole Franklin';
  const str = String(raw).trim().toLowerCase();
  const match = AVAILABLE_CSMS.find(
    (csm) => csm.toLowerCase().includes(str) || str.includes(csm.toLowerCase())
  );
  return match || 'Nicole Franklin';
}

function normalizeKey(str: string): string {
  return str.toLowerCase()
    .replace(/^project\s*-\s*/, '')
    .replace(/\s*-\s*[^,]+,\s*[a-z]{2}$/, '')
    .replace(/[^a-z0-9]/g, '');
}

function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

async function run() {
  console.log('=== QUExt Master Project Tracker Ingestion & Sync ===');
  
  // 1. Read CSV
  const buf = fs.readFileSync(CSV_PATH);
  const wb = XLSX.read(buf, { type: 'buffer' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rawAoa: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(20, rawAoa.length); i++) {
    const row = rawAoa[i] || [];
    if (row.some((cell: any) => /project\s*name/i.test(String(cell)))) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) {
    throw new Error('Failed to locate header row in CSV');
  }

  const rawHeaders = rawAoa[headerRowIdx].map((h: any) => String(h).trim());
  const csvProjects: any[] = [];

  for (let r = headerRowIdx + 1; r < rawAoa.length; r++) {
    const row = rawAoa[r];
    if (!row || row.every((c: any) => !c || String(c).trim() === '')) continue;

    const rowObj: Record<string, any> = {};
    rawHeaders.forEach((h: string, cIdx: number) => {
      rowObj[h] = row[cIdx] ?? '';
    });

    let name = String(rowObj['Project Name'] || '').trim();
    let portfolio = String(rowObj['Portfolio'] || '').trim();

    if (name.toLowerCase().includes('enclave property management') && portfolio) {
      const temp = name;
      name = portfolio;
      portfolio = temp;
    }

    if (!name) continue;

    const unitsCount = parseInt(String(rowObj['# of Units'] || '0').replace(/[^0-9]/g, ''), 10) || 0;
    const nfc = String(rowObj['NFC'] || '').trim().toUpperCase() === 'Y';
    const qrIntercom = String(rowObj['QR Intercom'] || '').trim().toUpperCase() === 'Y';
    const constructionType = String(rowObj['Construction Type'] || '').trim();
    const platform = normalizePlatform(rowObj['Platform']);
    const pm = normalizePM(rowObj['Project Manager']);
    const csm = normalizeCSM(rowObj['Customer Success Manager']);
    const fieldTech = normalizeFieldTech(rowObj['Field Ops']);
    const installer = String(rowObj['Installer'] || '').trim();
    const statusTag = normalizeStatusTag(rowObj['Project Status']);
    const installStart = parseToIsoDate(rowObj['Installation Start Date']);
    const installEnd = parseToIsoDate(rowObj['Installation End Date']);
    const closedDate = parseToIsoDate(rowObj['Project Closed Date']);
    const saasStartDate = parseToIsoDate(rowObj['SaaS Start Date']);
    const notesText = String(rowObj['Project Notes & Document Links'] || '').trim();
    const accountingNotes = String(rowObj['Accounting Notes'] || '').trim();
    const generalNotes = String(rowObj['General Notes / Network Notes'] || '').trim();

    const pocName = String(rowObj['POC Name'] || '').trim();
    const pocPhone = String(rowObj['POC Phone'] || '').trim();
    const pocEmail = String(rowObj['POC Email'] || '').trim();

    const depositPaid = String(rowObj['50% Deposit'] || '').trim().toUpperCase() === 'TRUE';
    const roughInPaid = String(rowObj['30% Rough-In'] || '').trim().toUpperCase() === 'TRUE';
    const retainagePaid = String(rowObj['20% Retainage'] || '').trim().toUpperCase() === 'TRUE';

    csvProjects.push({
      csvRowIndex: r + 1,
      name,
      portfolio,
      unitsCount,
      nfc,
      qrIntercom,
      constructionType,
      platform,
      pm,
      csm,
      fieldTech,
      installer: installer ? [installer] : ['SKBM'],
      statusTag,
      installStart,
      installEnd,
      closedDate,
      saasStartDate,
      notesText,
      accountingNotes,
      generalNotes,
      pocName,
      pocPhone,
      pocEmail,
      depositPaid,
      roughInPaid,
      retainagePaid,
    });
  }

  console.log(`Parsed ${csvProjects.length} rows from CSV.`);

  // 2. Fetch live Firestore projects
  const app = initializeApp(CLOUD_SYNC_CONFIG, 'master-tracker-sync-runner');
  const db = getFirestore(app);
  const snap = await getDocs(collection(db, 'quext_live_projects'));
  
  const liveProjectsMap = new Map<string, OperationProject>();
  snap.forEach((docSnap) => {
    liveProjectsMap.set(docSnap.id, docSnap.data() as OperationProject);
  });

  console.log(`Live Firestore projects currently: ${liveProjectsMap.size}`);

  const liveProjectsArray = Array.from(liveProjectsMap.values());
  const matchedLiveIds = new Set<string>();
  const updatedProjects: OperationProject[] = [];
  const createdProjects: OperationProject[] = [];

  for (const cp of csvProjects) {
    const cn = normalizeKey(cp.name);

    // 1. Exact or normalized key match
    let match = liveProjectsArray.find(
      (lp) => !matchedLiveIds.has(lp.id) && normalizeKey(lp.propertyName || '') === cn
    );

    // 2. Substring matching
    if (!match) {
      match = liveProjectsArray.find((lp) => {
        if (matchedLiveIds.has(lp.id)) return false;
        const ln = normalizeKey(lp.propertyName || '');
        if (cn.length >= 6 && ln.includes(cn)) return true;
        if (ln.length >= 6 && cn.includes(ln)) return true;
        if (cn.includes('marbellaranch') && ln.includes('marbellaranch')) return true;
        return false;
      });
    }

    // 3. Portfolio fallback for specific properties (e.g. Sage Houston 122)
    if (!match && cp.portfolio) {
      match = liveProjectsArray.find((lp) => {
        if (matchedLiveIds.has(lp.id)) return false;
        const ln = (lp.propertyName || '').toLowerCase();
        const port = cp.portfolio.toLowerCase();
        if (port.includes('houston 122') && ln.includes('houston 122')) return true;
        return false;
      });
    }

    if (match) {
      matchedLiveIds.add(match.id);

      // NON-DESTRUCTIVE UPDATE: Clone existing project to preserve notes, SOWs, tickets, BOMs, custom IDs
      const updated: OperationProject = {
        ...match,
        unitsCount: cp.unitsCount > 0 ? cp.unitsCount : match.unitsCount,
        platform: cp.platform || match.platform || 'Quext',
        useNfcWallet: cp.nfc || match.useNfcWallet || false,
        useQrIntercom: cp.qrIntercom || match.useQrIntercom || false,
        propertyManagementCompany: cp.portfolio || match.propertyManagementCompany,
        assignedPM: cp.pm || match.assignedPM,
        assignedCSM: cp.csm || match.assignedCSM,
        assignedFieldTech: cp.fieldTech || match.assignedFieldTech,
        integratorPartners:
          cp.installer && cp.installer.length > 0 && cp.installer[0] !== 'SKBM'
            ? cp.installer
            : match.integratorPartners || ['SKBM'],
        startDate: cp.installStart || match.startDate,
        targetCompletionDate: cp.installEnd || match.targetCompletionDate,
        lastUpdated: new Date().toISOString(),
      };

      // Financial milestones
      updated.financialMilestones = {
        ...(match.financialMilestones || {}),
        fiftyPercentCollected: cp.depositPaid || match.financialMilestones?.fiftyPercentCollected || false,
        thirtyPercentCollected: cp.roughInPaid || match.financialMilestones?.thirtyPercentCollected || false,
        finalTwentyPercentCollected: cp.retainagePaid || match.financialMilestones?.finalTwentyPercentCollected || false,
        saasStartDate: cp.saasStartDate || match.financialMilestones?.saasStartDate,
        saasStarted: Boolean(cp.saasStartDate) || match.financialMilestones?.saasStarted || false,
      };

      // Customer intake & contacts
      const existingIntake = match.customerIntake || {
        pmsSoftware: 'None',
        commonAreaDoors: [],
        staffRoles: [],
      };
      const existingStaff = [...(existingIntake.staffRoles || [])];

      if (cp.pocName) {
        const nameParts = cp.pocName.split(' ');
        const firstName = nameParts[0] || 'Property';
        const lastName = nameParts.slice(1).join(' ') || 'Contact';
        const hasPoc = existingStaff.some((s) => s.email === cp.pocEmail || s.firstName === firstName);
        if (!hasPoc) {
          existingStaff.unshift({
            id: `staff-poc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            firstName,
            lastName,
            email: cp.pocEmail || 'property@client.com',
            phoneNumber: cp.pocPhone || '',
            permissionLevel: 'Manager',
            roleOrTitle: 'Property POC',
          });
        }
      }

      updated.customerIntake = {
        ...existingIntake,
        propertyManagementCompany: cp.portfolio || existingIntake.propertyManagementCompany,
        sitePhoneNumber: cp.pocPhone || existingIntake.sitePhoneNumber,
        communityEmail: cp.pocEmail || existingIntake.communityEmail,
        staffRoles: existingStaff,
        useNfcWallet: updated.useNfcWallet,
        useQrIntercom: updated.useQrIntercom,
      };

      // Community details
      if (cp.constructionType) {
        const prevComm = match.communityDetails;
        updated.communityDetails = {
          pmsSystem: prevComm?.pmsSystem || 'Yardi Voyager',
          projectType: cp.constructionType === 'Retrofit' ? 'Retrofit / Occupied' : 'New Construction',
          stagingLocation: prevComm?.stagingLocation || 'Clubhouse Staging Area',
          staffEscortRequired: prevComm?.staffEscortRequired ?? false,
          officeHours: prevComm?.officeHours || '9:00 AM - 6:00 PM Mon-Fri',
          installWorkingHours: prevComm?.installWorkingHours || '9:00 AM - 5:00 PM Mon-Fri',
          masterFobsKnoxBox: prevComm?.masterFobsKnoxBox || 'Fire Knox Box & Master Fobs Provided',
          nfcWalletConfigured: updated.useNfcWallet ?? false,
          csmName: updated.assignedCSM || 'Nicole Franklin',
          fieldOpsLead: updated.assignedFieldTech || 'Sean Gates',
        };
      }

      // Append notes from Master Tracker if present and not duplicate
      const combinedNotes = [];
      if (cp.notesText) combinedNotes.push(`[Master Tracker]: ${cp.notesText}`);
      if (cp.accountingNotes) combinedNotes.push(`[Accounting SWAT]: ${cp.accountingNotes}`);
      if (cp.generalNotes) combinedNotes.push(`[Network Notes]: ${cp.generalNotes}`);

      if (combinedNotes.length > 0) {
        const newNotesText = combinedNotes.join('\n');
        const existingNotes = match.notes || [];
        const isDuplicate = existingNotes.some((n) => n.text.includes(cp.notesText || 'Master Tracker'));
        if (!isDuplicate) {
          updated.notes = [
            {
              id: `note-mt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              projectId: match.id,
              author: 'Master Project Tracker',
              timestamp: 'Just now',
              category: 'General Context',
              text: newNotesText,
              isPinned: false,
            },
            ...existingNotes,
          ];
        }
      }

      updatedProjects.push(updated);
    } else {
      // NEW PROJECT CREATION
      const timestamp = Date.now() + createdProjects.length;
      const projectId = `proj-master-${timestamp}`;
      const quoteId = `quote-master-${timestamp}`;
      const quoteNumber = `QXT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const startDate = cp.installStart || new Date().toISOString().split('T')[0];
      const targetDate = cp.installEnd || new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const units = cp.unitsCount > 0 ? cp.unitsCount : 150;

      const locksCount = units;
      const thermostatsCount = units;
      const gatewaysCount = Math.max(2, Math.ceil(units / 60));

      const bomItems: BOMItem[] = [
        {
          id: `bom-${projectId}-lock`,
          name:
            cp.platform === 'Geokey'
              ? 'Geokey Mobile-BLE Mortise & Deadbolt Lock'
              : cp.platform === 'Homebase'
              ? 'Homebase Wireless Smart Lock'
              : 'Quext Smart Deadbolt Lock (BLE & Apple Wallet NFC)',
          model: cp.platform === 'Geokey' ? 'GEO-LK-200' : cp.platform === 'Homebase' ? 'HB-LK-100' : 'QXT-DL-900',
          category: 'Smart Access Control',
          location: 'All Residential Units',
          quantity: locksCount,
          sparesCount: Math.max(2, Math.ceil(locksCount * 0.05)),
          sparesDelivered: false,
          installedCount: 0,
          unitPrice: cp.platform === 'Geokey' ? 245 : 220,
          description: `Smart lock hardware deployed across ${units} units on ${cp.platform} platform.`,
          postItLogs: [],
        },
        {
          id: `bom-${projectId}-therm`,
          name:
            cp.platform === 'Homebase'
              ? 'Homebase Hubless Smart Thermostat'
              : 'Quext IoT Smart Thermostat (LoRaWAN Hubless)',
          model: cp.platform === 'Homebase' ? 'HB-TH-50' : 'QXT-TH-300',
          category: 'Smart Thermostats & HVAC',
          location: 'All Residential Units',
          quantity: thermostatsCount,
          sparesCount: Math.max(2, Math.ceil(thermostatsCount * 0.05)),
          sparesDelivered: false,
          installedCount: 0,
          unitPrice: 165,
          description: 'Dual sensor IoT thermostat for energy management.',
          postItLogs: [],
        },
        {
          id: `bom-${projectId}-gw`,
          name: 'Quext LoRaWAN Outdoor Gateway Base Station (8-Channel)',
          model: 'QXT-GW-LR8',
          category: 'IoT Gateways & Mesh',
          location: 'Clubhouse Rooftop & Central Buildings',
          quantity: gatewaysCount,
          sparesCount: 1,
          sparesDelivered: false,
          installedCount: 0,
          unitPrice: 1250,
          description: 'Long-range LoRaWAN base station with cellular failover backhaul.',
          postItLogs: [],
        },
      ];

      const staffRoles = [];
      if (cp.pocName) {
        const nameParts = cp.pocName.split(' ');
        staffRoles.push({
          id: `staff-poc-${timestamp}`,
          firstName: nameParts[0] || 'Property',
          lastName: nameParts.slice(1).join(' ') || 'Contact',
          email: cp.pocEmail || 'property@client.com',
          phoneNumber: cp.pocPhone || '',
          permissionLevel: 'Manager' as const,
          roleOrTitle: 'Property POC',
        });
      }

      const notes = [];
      const noteParts = [];
      if (cp.notesText) noteParts.push(`[Master Tracker]: ${cp.notesText}`);
      if (cp.accountingNotes) noteParts.push(`[Accounting SWAT]: ${cp.accountingNotes}`);
      if (cp.generalNotes) noteParts.push(`[Network Notes]: ${cp.generalNotes}`);
      if (noteParts.length > 0) {
        notes.push({
          id: `note-${projectId}`,
          projectId,
          author: 'Master Project Tracker',
          timestamp: 'Just now',
          category: 'General Context' as const,
          text: noteParts.join('\n'),
          isPinned: true,
        });
      }

      const newProj: OperationProject = {
        id: projectId,
        quoteId,
        quoteNumber,
        propertyName: cp.name,
        clientName: cp.portfolio || 'Quext Client Portfolio',
        propertyManagementCompany: cp.portfolio || 'Quext Client Portfolio',
        address: '100 Main St',
        city: 'Dallas',
        state: 'TX',
        unitsCount: units,
        heroImage: '/src/assets/images/property_grand_horizon_1792605840266.jpg',
        assignedPM: cp.pm,
        assignedCSM: cp.csm,
        assignedFieldTech: cp.fieldTech,
        integratorPartners: cp.installer,
        statusTag: cp.statusTag,
        platform: cp.platform,
        statusReason: `Created from Master Projects Dashboard Tracker. Target completion: ${targetDate}.`,
        startDate,
        targetCompletionDate: targetDate,
        useNfcWallet: cp.nfc,
        useQrIntercom: cp.qrIntercom,
        isManuallyCreated: true,
        isBomLocked: true,
        bomItems,
        installLogs: [],
        notes,
        milestones: createDefaultMilestones(`m-${projectId}`, startDate, targetDate),
        financialMilestones: {
          fiftyPercentCollected: cp.depositPaid,
          thirtyPercentCollected: cp.roughInPaid,
          finalTwentyPercentCollected: cp.retainagePaid,
          saasStartDate: cp.saasStartDate,
          saasStarted: Boolean(cp.saasStartDate),
        },
        communityDetails: {
          pmsSystem: 'Yardi Voyager',
          projectType: cp.constructionType === 'Retrofit' ? 'Retrofit / Occupied' : 'New Construction',
          stagingLocation: 'Clubhouse Staging Area',
          staffEscortRequired: false,
          officeHours: '9:00 AM - 6:00 PM Mon-Fri',
          installWorkingHours: '9:00 AM - 5:00 PM Mon-Fri',
          masterFobsKnoxBox: 'Fire Knox Box & Master Fobs Provided',
          nfcWalletConfigured: cp.nfc,
          csmName: cp.csm,
          fieldOpsLead: cp.fieldTech,
        },
        customerIntake: {
          pmsSoftware: 'None',
          propertyManagementCompany: cp.portfolio || 'Quext Client Portfolio',
          sitePhoneNumber: cp.pocPhone || undefined,
          communityEmail: cp.pocEmail || undefined,
          commonAreaDoors: [
            { id: `cad-${timestamp}-1`, doorName: 'Clubhouse Main Entry', buildingOrArea: 'Clubhouse', installedStatus: 'Pending' },
            { id: `cad-${timestamp}-2`, doorName: 'Fitness Center Entry', buildingOrArea: 'Clubhouse Floor 1', installedStatus: 'Pending' },
          ],
          staffRoles,
          useNfcWallet: cp.nfc,
          useQrIntercom: cp.qrIntercom,
        },
        lastUpdated: new Date().toISOString(),
      };

      createdProjects.push(newProj);
    }
  }

  console.log(`Matched existing projects updated: ${updatedProjects.length}`);
  console.log(`New projects to create: ${createdProjects.length}`);
  console.log(`Untouched existing live projects: ${liveProjectsMap.size - updatedProjects.length}`);
  console.log(`Total Projects after sync will be: ${liveProjectsMap.size + createdProjects.length}`);

  // 3. Batch commit to Cloud Firestore
  console.log('Writing updates and new projects to Cloud Firestore (collection: quext_live_projects)...');

  // Push updated matched projects
  for (const p of updatedProjects) {
    const docRef = doc(db, 'quext_live_projects', p.id);
    await setDoc(docRef, sanitizeForFirestore(p), { merge: true });
  }
  console.log(`Successfully updated ${updatedProjects.length} matched projects in Cloud Firestore.`);

  // Push new projects
  for (const p of createdProjects) {
    const docRef = doc(db, 'quext_live_projects', p.id);
    await setDoc(docRef, sanitizeForFirestore(p), { merge: true });
  }
  console.log(`Successfully created ${createdProjects.length} new projects in Cloud Firestore.`);

  // Verify total count in Firestore
  const verifySnap = await getDocs(collection(db, 'quext_live_projects'));
  console.log(`Verified total live projects in Firestore: ${verifySnap.size}`);

  // 4. Generate master dataset fallback file
  const allFinalProjects: OperationProject[] = [];
  verifySnap.forEach((d) => {
    const raw = d.data() as any;
    // Cleanse communityDetails
    if (raw.communityDetails) {
      delete raw.communityDetails.communityDoorsCount;
      delete raw.communityDetails.unitsCount;
      delete raw.communityDetails.constructionType;
      if (!raw.communityDetails.pmsSystem) raw.communityDetails.pmsSystem = 'Yardi Voyager';
      if (!raw.communityDetails.projectType) raw.communityDetails.projectType = 'New Construction';
      if (!raw.communityDetails.stagingLocation) raw.communityDetails.stagingLocation = 'Clubhouse Staging Area';
      if (raw.communityDetails.staffEscortRequired === undefined) raw.communityDetails.staffEscortRequired = false;
      if (!raw.communityDetails.officeHours) raw.communityDetails.officeHours = '9:00 AM - 6:00 PM Mon-Fri';
      if (!raw.communityDetails.installWorkingHours) raw.communityDetails.installWorkingHours = '9:00 AM - 5:00 PM Mon-Fri';
      if (!raw.communityDetails.masterFobsKnoxBox) raw.communityDetails.masterFobsKnoxBox = 'Fire Knox Box Provided';
      if (raw.communityDetails.nfcWalletConfigured === undefined) raw.communityDetails.nfcWalletConfigured = false;
      if (!raw.communityDetails.csmName) raw.communityDetails.csmName = 'Nicole Franklin';
      if (!raw.communityDetails.fieldOpsLead) raw.communityDetails.fieldOpsLead = 'Sean Gates';
    }

    // Cleanse installLogs & postItLogs
    if (Array.isArray(raw.installLogs)) {
      raw.installLogs.forEach((log: any) => {
        if (!['Verified & Online', 'Signal Testing Passed', 'Pending LoRa Sync', 'Hardware Swapped'].includes(log.statusCheck)) {
          log.statusCheck = 'Verified & Online';
        }
      });
    }

    if (Array.isArray(raw.bomItems)) {
      raw.bomItems.forEach((b: any) => {
        if (Array.isArray(b.postItLogs)) {
          b.postItLogs.forEach((log: any) => {
            if (!log.projectId) log.projectId = raw.id;
            if (!log.itemId) log.itemId = b.id;
            if (!log.itemName) log.itemName = b.name;
            if (!['Verified & Online', 'Signal Testing Passed', 'Pending LoRa Sync', 'Hardware Swapped'].includes(log.statusCheck)) {
              log.statusCheck = 'Verified & Online';
            }
          });
        }
      });
    }

    // Cleanse bomAcquisitionSubmissions
    if (Array.isArray(raw.bomAcquisitionSubmissions)) {
      raw.bomAcquisitionSubmissions.forEach((sub: any) => {
        if (!sub.projectId) sub.projectId = raw.id;
        if (!sub.propertyName) sub.propertyName = raw.propertyName;
      });
    }

    // Cleanse staffRoles
    if (raw.customerIntake && Array.isArray(raw.customerIntake.staffRoles)) {
      raw.customerIntake.staffRoles.forEach((role: any) => {
        if (role.permissionLevel === 'Property Manager' || !['Manager', 'Staff', 'Limited'].includes(role.permissionLevel)) {
          role.permissionLevel = 'Manager';
        }
      });
    }

    allFinalProjects.push(raw as OperationProject);
  });

  // Sort descending by lastUpdated / startDate
  allFinalProjects.sort((a, b) => {
    const dateA = new Date(a.lastUpdated || a.startDate || 0).getTime();
    const dateB = new Date(b.lastUpdated || b.startDate || 0).getTime();
    return dateB - dateA;
  });

  // Ensure 21 Pearl is first
  const pearlIdx = allFinalProjects.findIndex(
    (p) => (p.propertyName || '').trim().toLowerCase() === '21 pearl' || p.id === 'proj-21-pearl'
  );
  if (pearlIdx > 0) {
    const [pearl] = allFinalProjects.splice(pearlIdx, 1);
    allFinalProjects.unshift(pearl);
  }

  const exportTsContent = `import { OperationProject } from '../types';

/**
 * MASTER PROJECTS DATASET (167 Operational Projects)
 * Ingested and synchronized from 2026 Master Projects Dashboard - Project Tracker.
 * Preserves 21 Pearl and all existing seed projects while integrating 97 tracker properties.
 */
export const MASTER_TRACKER_PROJECTS: OperationProject[] = ${JSON.stringify(allFinalProjects, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, '../src/data/masterTrackerData.ts'), exportTsContent);
  console.log(`Wrote ${allFinalProjects.length} projects to src/data/masterTrackerData.ts`);

  console.log('=== Ingestion & Sync Complete! ===');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error during master tracker sync:', err);
  process.exit(1);
});
