/**
 * Real-Time Cloud Firestore Sync Service
 * Enables live multi-user, multi-device synchronization across out-of-state teams.
 * Powered by Google Cloud Firestore with onSnapshot real-time streaming and offline fallback.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { OperationProject, Quote, isLockBOMItem } from '../types';
import type { GoogleFormSubmission } from '../types/sowForm';
import { SEED_SOW_21_PEARL, SEED_SOW_RIVERTOWN_COMMONS } from './sowFormService';
import type { PartnerSecurityCredential } from '../partner-academy/utils/partnerSecurity';
import { PARTNER_IDENTITY_DIRECTORY } from '../partner-academy/utils/projectCoursePackager';
import {
  INITIAL_PROJECTS,
  INITIAL_QUOTES,
  enrichProjectDefaults,
  sanitizeProjectRealTeamOnly,
  isMockOrSyntheticProject,
  saveStoredProjects,
  saveStoredQuotes,
  loadArchivedProjectIds,
  loadClearedPmVerificationIds,
} from '../data/initialData';

// Active Google Cloud Firestore Database Config
const CLOUD_SYNC_CONFIG = {
  projectId: 'gen-lang-client-0224797666',
  apiKey: 'AIzaSyC1a9x4a4YOag2Zq6fIjc7PjO3jTtoUqso',
  appId: '1:662866527637:web:quext-cloud-sync',
};

const appName = 'quext-cloud-sync';
const syncApp = getApps().find((a) => a.name === appName) || initializeApp(CLOUD_SYNC_CONFIG, appName);
const db = getFirestore(syncApp);

const PROJECTS_COLLECTION = 'quext_live_projects';
const ARCHIVED_PROJECTS_COLLECTION = 'quext_archived_projects';
const QUOTES_COLLECTION = 'quext_live_quotes';
const PARTNER_CREDENTIALS_COLLECTION = 'quext_live_partner_codes';
const DELETED_PARTNERS_COLLECTION = 'quext_live_deleted_partners';
const SOW_SUBMISSIONS_COLLECTION = 'quext_live_sow_submissions';
const DELETED_SOWS_COLLECTION = 'quext_live_deleted_sows';

export interface SyncStatus {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

let currentSyncStatus: SyncStatus = {
  isConnected: false,
  isSyncing: false,
  lastSyncedAt: null,
  error: null,
};

const statusSubscribers = new Set<(status: SyncStatus) => void>();

function updateSyncStatus(patch: Partial<SyncStatus>) {
  currentSyncStatus = { ...currentSyncStatus, ...patch };
  statusSubscribers.forEach((cb) => cb(currentSyncStatus));
}

export function subscribeToSyncStatus(cb: (status: SyncStatus) => void): () => void {
  statusSubscribers.add(cb);
  cb(currentSyncStatus);
  return () => statusSubscribers.delete(cb);
}

export function getSyncStatus(): SyncStatus {
  return currentSyncStatus;
}

/**
 * Removes undefined fields which Firestore rejects
 */
function sanitizeForFirestore<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    console.error('Error sanitizing object for Firestore', err);
    return obj;
  }
}

/**
 * Subscribes to the live Projects collection in Firestore.
 * Automatically seeds initial projects if the cloud collection is empty.
 */
export function subscribeToLiveProjects(
  onUpdate: (projects: OperationProject[]) => void,
  initialFallbackProjects: OperationProject[] = INITIAL_PROJECTS
): () => void {
  const colRef = collection(db, PROJECTS_COLLECTION);
  let isInitialLoad = true;

  updateSyncStatus({ isSyncing: true, error: null });

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      try {
        if (snapshot.empty && isInitialLoad) {
          isInitialLoad = false;
          console.log('[Cloud Sync] Cloud projects empty. Seeding initial projects to Firestore...');
          const toSeed = initialFallbackProjects.length > 0 ? initialFallbackProjects : INITIAL_PROJECTS;
          await seedInitialProjectsToCloud(toSeed);
          return;
        }

        isInitialLoad = false;
        const liveList: OperationProject[] = [];
        let hadNonLockTagsInCloud = false;
        const projectsToCleanseInCloud: OperationProject[] = [];
        const archivedIds = loadArchivedProjectIds();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as OperationProject;
          if (data && data.id) {
            // If project is registered as merged/archived, purge it from Cloud Firestore and skip
            if (archivedIds.has(data.id)) {
              deleteDoc(doc(db, PROJECTS_COLLECTION, data.id)).catch(() => {});
              return;
            }

            const hasInvalidLockTag = (data.bomItems || []).some(
              (b) => !isLockBOMItem(b) && Boolean(b.lockFinishConfig)
            );
            const hadSampleReplyArtifact =
              data.customerIntake?.pmsPropertyCode === 'ARBE-100 (API sync approved)' ||
              (data.customerIntake?.gatewayLocationNotes || '').includes(
                'Clubhouse 2nd floor IDF closet (PoE switch port 14 ready)'
              );
            const enriched = sanitizeProjectRealTeamOnly(enrichProjectDefaults(data));

            // Merge imported sheet notes from canonical INITIAL_PROJECTS if not present
            const initProj = INITIAL_PROJECTS.find((p) => p.id === data.id);
            if (initProj && initProj.notes) {
              const existingIds = new Set((enriched.notes || []).map((n) => n.id));
              const existingTexts = new Set((enriched.notes || []).map((n) => n.text?.trim()));
              const sheetNotes = initProj.notes.filter(
                (n) =>
                  n.id?.startsWith('note-sheet-') &&
                  !existingIds.has(n.id) &&
                  !existingTexts.has(n.text?.trim())
              );
              if (sheetNotes.length > 0) {
                enriched.notes = [...sheetNotes, ...(enriched.notes || [])];
              }
            }

            // Merge imported dates & milestones from canonical INITIAL_PROJECTS if missing/un-updated
            if (initProj) {
              if (initProj.installationStartDate && !enriched.installationStartDate) {
                enriched.installationStartDate = initProj.installationStartDate;
              }
              if (initProj.installationEndDate && !enriched.installationEndDate) {
                enriched.installationEndDate = initProj.installationEndDate;
              }
              const initHasActive = (initProj.milestones || []).some(
                (m) => m.status === 'Completed' || m.status === 'In Progress'
              );
              const enrichedHasActive = (enriched.milestones || []).some(
                (m) => m.status === 'Completed' || m.status === 'In Progress'
              );
              if (initHasActive && !enrichedHasActive) {
                enriched.milestones = initProj.milestones;
              }

              // Preserve needsVerifiedByPm unless permanently cleared by PM
              const clearedPmVerificationIds = loadClearedPmVerificationIds();
              if (clearedPmVerificationIds.has(enriched.id)) {
                enriched.needsVerifiedByPm = false;
              } else if (initProj.needsVerifiedByPm && enriched.needsVerifiedByPm === undefined) {
                enriched.needsVerifiedByPm = true;
              }
            }

            // Ensure Rivertown Commons and 21 Pearl SOWs are retained live in cloud projects
            if (
              data.id === 'proj-master-1793739220206' ||
              (data.propertyName || '').trim().toLowerCase() === 'rivertown commons'
            ) {
              if (!enriched.sowSubmissions || enriched.sowSubmissions.length === 0) {
                enriched.sowSubmissions = [SEED_SOW_RIVERTOWN_COMMONS];
              }
            }
            if (
              data.id === 'proj-21-pearl' ||
              data.id === 'proj-imported-1793730055881' ||
              (data.propertyName || '').trim().toLowerCase() === '21 pearl'
            ) {
              if (!enriched.sowSubmissions || enriched.sowSubmissions.length === 0) {
                enriched.sowSubmissions = [SEED_SOW_21_PEARL];
              }
            }
            if (hasInvalidLockTag || hadSampleReplyArtifact) {
              hadNonLockTagsInCloud = true;
              projectsToCleanseInCloud.push(enriched);
            }
            liveList.push(enriched);
          }
        });

        // If cloud snapshot had non-lock items tagged with lock finishes, immediately sanitize in Cloud Firestore
        if (hadNonLockTagsInCloud && projectsToCleanseInCloud.length > 0) {
          projectsToCleanseInCloud.forEach((p) => {
            saveLiveProject(p).catch((err) =>
              console.warn('[Cloud Sync] Auto-cleansed non-lock tag in Firestore error:', err)
            );
          });
        }

        // Sort by quote number or lastUpdated descending
        liveList.sort((a, b) => {
          const dateA = new Date(a.lastUpdated || a.startDate || 0).getTime();
          const dateB = new Date(b.lastUpdated || b.startDate || 0).getTime();
          return dateB - dateA;
        });

        if (liveList.length > 0) {
          saveStoredProjects(liveList);
          onUpdate(liveList);
        }

        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        updateSyncStatus({
          isConnected: true,
          isSyncing: false,
          lastSyncedAt: nowStr,
          error: null,
        });
      } catch (err: any) {
        console.error('[Cloud Sync] Error processing live projects snapshot:', err);
        updateSyncStatus({
          isConnected: false,
          isSyncing: false,
          error: err?.message || 'Failed to process projects snapshot',
        });
      }
    },
    (err) => {
      console.warn('[Cloud Sync] Firestore live projects listener encountered an issue:', err);
      updateSyncStatus({
        isConnected: false,
        isSyncing: false,
        error: err?.message || 'Firestore connection issue',
      });
    }
  );

  return unsubscribe;
}

/**
 * Saves a single project to Firestore in real-time.
 */
export async function saveLiveProject(project: OperationProject): Promise<void> {
  if (!project || !project.id) return;
  try {
    updateSyncStatus({ isSyncing: true });
    const clean = sanitizeForFirestore(enrichProjectDefaults(project));
    const docRef = doc(db, PROJECTS_COLLECTION, project.id);
    await setDoc(docRef, clean, { merge: true });

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    updateSyncStatus({
      isConnected: true,
      isSyncing: false,
      lastSyncedAt: nowStr,
      error: null,
    });
  } catch (err: any) {
    console.error(`[Cloud Sync] Failed to save project ${project.id} to Firestore:`, err);
    updateSyncStatus({
      isSyncing: false,
      error: err?.message || 'Failed to save project to cloud',
    });
    throw err;
  }
}

/**
 * Permanently deletes an obsolete/duplicate project from Cloud Firestore.
 */
export async function deleteLiveProject(projectId: string): Promise<void> {
  if (!projectId) return;
  try {
    updateSyncStatus({ isSyncing: true });
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(docRef);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    updateSyncStatus({
      isConnected: true,
      isSyncing: false,
      lastSyncedAt: nowStr,
      error: null,
    });
  } catch (err: any) {
    console.error(`[Cloud Sync] Failed to delete project ${projectId} from Firestore:`, err);
    updateSyncStatus({
      isSyncing: false,
      error: err?.message || 'Failed to delete project from cloud',
    });
    throw err;
  }
}

/**
 * Archives an obsolete duplicate project into the archived projects collection for permanent audit retention.
 */
export async function archiveLiveProject(
  obsoleteProject: OperationProject,
  survivorProjectId: string
): Promise<void> {
  if (!obsoleteProject || !obsoleteProject.id) return;
  try {
    const archivePayload = sanitizeForFirestore({
      ...obsoleteProject,
      archivedAt: new Date().toISOString(),
      archivedReason: 'Merged in The Clone Wars Duplicate Studio',
      mergedIntoProjectId: survivorProjectId,
    });
    const docRef = doc(db, ARCHIVED_PROJECTS_COLLECTION, obsoleteProject.id);
    await setDoc(docRef, archivePayload, { merge: true });
  } catch (err: any) {
    console.warn(`[Cloud Sync] Failed to record archived project ${obsoleteProject.id}:`, err);
  }
}

/**
 * Seed initial projects to Cloud Firestore
 */
async function seedInitialProjectsToCloud(projects: OperationProject[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    projects.forEach((p) => {
      const clean = sanitizeForFirestore(p);
      const docRef = doc(db, PROJECTS_COLLECTION, p.id);
      batch.set(docRef, clean, { merge: true });
    });
    await batch.commit();
    console.log(`[Cloud Sync] Successfully seeded ${projects.length} initial projects to Cloud Firestore.`);
  } catch (err) {
    console.error('[Cloud Sync] Failed to seed initial projects:', err);
  }
}

/**
 * Subscribes to the live Quotes collection in Firestore.
 */
export function subscribeToLiveQuotes(
  onUpdate: (quotes: Quote[]) => void,
  initialFallbackQuotes: Quote[] = INITIAL_QUOTES
): () => void {
  const colRef = collection(db, QUOTES_COLLECTION);
  let isInitialLoad = true;

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      try {
        if (snapshot.empty && isInitialLoad) {
          isInitialLoad = false;
          console.log('[Cloud Sync] Cloud quotes empty. Seeding initial quotes to Firestore...');
          const toSeed = initialFallbackQuotes.length > 0 ? initialFallbackQuotes : INITIAL_QUOTES;
          await seedInitialQuotesToCloud(toSeed);
          return;
        }

        isInitialLoad = false;
        const liveList: Quote[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Quote;
          if (data && data.id) {
            liveList.push(data);
          }
        });

        if (liveList.length > 0) {
          saveStoredQuotes(liveList);
          onUpdate(liveList);
        }
      } catch (err) {
        console.error('[Cloud Sync] Error processing live quotes snapshot:', err);
      }
    },
    (err) => {
      console.warn('[Cloud Sync] Firestore live quotes listener error:', err);
    }
  );

  return unsubscribe;
}

/**
 * Saves a single quote to Firestore in real-time.
 */
export async function saveLiveQuote(quote: Quote): Promise<void> {
  if (!quote || !quote.id) return;
  try {
    const clean = sanitizeForFirestore(quote);
    const docRef = doc(db, QUOTES_COLLECTION, quote.id);
    await setDoc(docRef, clean, { merge: true });
  } catch (err) {
    console.error(`[Cloud Sync] Failed to save quote ${quote.id} to Firestore:`, err);
  }
}

/**
 * Seed initial quotes to Cloud Firestore
 */
async function seedInitialQuotesToCloud(quotes: Quote[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    quotes.forEach((q) => {
      const clean = sanitizeForFirestore(q);
      const docRef = doc(db, QUOTES_COLLECTION, q.id);
      batch.set(docRef, clean, { merge: true });
    });
    await batch.commit();
    console.log(`[Cloud Sync] Successfully seeded ${quotes.length} initial quotes to Cloud Firestore.`);
  } catch (err) {
    console.error('[Cloud Sync] Failed to seed initial quotes:', err);
  }
}

/**
 * Saves or updates a partner security credential in Cloud Firestore in real-time.
 */
export async function saveLivePartnerCredential(cred: PartnerSecurityCredential): Promise<void> {
  if (!cred || !cred.companyId) return;
  try {
    updateSyncStatus({ isSyncing: true });
    const clean = sanitizeForFirestore({
      ...cred,
      isDeleted: false,
      syncedAt: new Date().toISOString(),
    });
    const docRef = doc(db, PARTNER_CREDENTIALS_COLLECTION, cred.companyId);
    await setDoc(docRef, clean, { merge: true });

    // Ensure removed from deleted tombstone collection
    try {
      await deleteDoc(doc(db, DELETED_PARTNERS_COLLECTION, cred.companyId));
    } catch {}

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    updateSyncStatus({
      isConnected: true,
      isSyncing: false,
      lastSyncedAt: nowStr,
      error: null,
    });
  } catch (err: any) {
    console.error(`[Cloud Sync] Failed to save partner credential ${cred.companyId}:`, err);
    updateSyncStatus({
      isSyncing: false,
      error: err?.message || 'Failed to save partner code to cloud',
    });
    throw err;
  }
}

/**
 * Permanently removes a partner firm and marks it as deleted in Cloud Firestore.
 */
export async function deleteLivePartnerCredential(companyId: string): Promise<void> {
  if (!companyId) return;
  try {
    updateSyncStatus({ isSyncing: true });

    // 1. Delete document from live partner codes collection
    const docRef = doc(db, PARTNER_CREDENTIALS_COLLECTION, companyId);
    await deleteDoc(docRef);

    // 2. Add tombstone to deleted collection so other devices do not re-seed it
    const delDocRef = doc(db, DELETED_PARTNERS_COLLECTION, companyId);
    await setDoc(delDocRef, { companyId, deletedAt: new Date().toISOString() }, { merge: true });

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    updateSyncStatus({
      isConnected: true,
      isSyncing: false,
      lastSyncedAt: nowStr,
      error: null,
    });
  } catch (err: any) {
    console.error(`[Cloud Sync] Failed to delete partner credential ${companyId}:`, err);
    updateSyncStatus({
      isSyncing: false,
      error: err?.message || 'Failed to delete partner code from cloud',
    });
    throw err;
  }
}

/**
 * Seed initial partner directory to Cloud Firestore if collection is empty
 */
async function seedInitialPartnersToCloud(): Promise<void> {
  try {
    const batch = writeBatch(db);
    const defaults: Record<string, string> = {
      comp_spirit: 'QX-SPR-9F4K-82A1',
      comp_engineered: 'QX-ENC-371B-94M2',
      comp_everbase: 'QX-EVB-883P-41K7',
      comp_skbm: 'QX-SKB-619X-55D2',
      comp_southbay: 'QX-SBH-204K-73L9',
      comp_atb: 'QX-ATB-582M-19N4',
      comp_jts: 'QX-JTS-447Q-88P3',
      comp_rmr: 'QX-RMR-731V-62X5',
      comp_allmedia: 'QX-AMD-905W-34E8',
      comp_diy: 'QX-DIY-100A-0000',
    };

    for (const entry of PARTNER_IDENTITY_DIRECTORY) {
      const prefix = `QX-${entry.companyCode.slice(0, 3).toUpperCase()}`;
      const code = defaults[entry.companyId] || `${prefix}-7492-9K1A`;
      const cred: PartnerSecurityCredential = {
        companyId: entry.companyId,
        partnerShortName: entry.partnerShortName,
        companyName: entry.companyName,
        legacyCode: entry.companyCode,
        secureAccessCode: code,
        defaultEmail: entry.defaultEmail,
        leadName: entry.leadName,
        region: entry.region,
        lastGeneratedAt: '2026-01-15T00:00:00.000Z',
      };
      const clean = sanitizeForFirestore(cred);
      const docRef = doc(db, PARTNER_CREDENTIALS_COLLECTION, cred.companyId);
      batch.set(docRef, clean, { merge: true });
    }
    await batch.commit();
    console.log('[Cloud Sync] Successfully seeded initial partner directory to Cloud Firestore.');
  } catch (err) {
    console.error('[Cloud Sync] Failed to seed initial partners to cloud:', err);
  }
}

/**
 * Synchronizes cloud partners with browser local storage and triggers state updates.
 */
function syncCloudPartnersToLocalStorage(
  liveCreds: Record<string, PartnerSecurityCredential>,
  cloudDeletedIds: string[]
): void {
  if (typeof window === 'undefined') return;

  try {
    const STORAGE_KEY_PARTNER_CODES = 'quext_partner_secure_access_codes_v1';
    const STORAGE_KEY_DELETED_PARTNER_IDS = 'quext_deleted_partner_ids_v1';
    const STORAGE_KEY_COMPANIES = 'quext_academy_companies_v5';
    const STORAGE_KEY_USERS = 'quext_academy_users_v5';

    // 1. Save partner credentials
    localStorage.setItem(STORAGE_KEY_PARTNER_CODES, JSON.stringify(liveCreds));

    // 2. Save deleted IDs
    const existingDeletedRaw = localStorage.getItem(STORAGE_KEY_DELETED_PARTNER_IDS);
    const existingDeleted: string[] = existingDeletedRaw ? JSON.parse(existingDeletedRaw) : [];
    const mergedDeleted = Array.from(new Set([...existingDeleted, ...cloudDeletedIds]));
    localStorage.setItem(STORAGE_KEY_DELETED_PARTNER_IDS, JSON.stringify(mergedDeleted));
    const deletedSet = new Set(mergedDeleted);

    // 3. Sync partner companies
    const savedCompaniesRaw = localStorage.getItem(STORAGE_KEY_COMPANIES);
    const currentCompanies: any[] = savedCompaniesRaw ? JSON.parse(savedCompaniesRaw) : [];
    const companyMap = new Map(currentCompanies.map((c) => [c.id, c]));

    // Remove deleted companies
    for (const id of deletedSet) {
      companyMap.delete(id);
    }

    // Add or update companies from liveCreds
    for (const cred of Object.values(liveCreds)) {
      if (deletedSet.has(cred.companyId)) continue;
      if (!companyMap.has(cred.companyId)) {
        companyMap.set(cred.companyId, {
          id: cred.companyId,
          name: cred.companyName,
          code: cred.legacyCode,
          region: cred.region,
          leadName: cred.leadName,
          tier: 'Authorized Partner',
          activeTechnicians: 1,
          contactEmail: cred.defaultEmail,
          joinedDate: 'Active Partner',
        });
      } else {
        const existing = companyMap.get(cred.companyId);
        companyMap.set(cred.companyId, {
          ...existing,
          name: cred.companyName,
          code: cred.legacyCode,
          region: cred.region,
          leadName: cred.leadName,
          contactEmail: cred.defaultEmail,
        });
      }
    }
    localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(Array.from(companyMap.values())));

    // 4. Sync partner admin users
    const savedUsersRaw = localStorage.getItem(STORAGE_KEY_USERS);
    const currentUsers: any[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    const userMap = new Map(currentUsers.map((u) => [u.id, u]));

    // Remove users belonging to deleted companies
    for (const [userId, user] of Array.from(userMap.entries())) {
      if (deletedSet.has(user.companyId)) {
        userMap.delete(userId);
      }
    }

    // Ensure admin user exists for each partner
    for (const cred of Object.values(liveCreds)) {
      if (deletedSet.has(cred.companyId)) continue;
      const adminUserId = `user_${cred.companyId}_admin`;
      if (!userMap.has(adminUserId)) {
        userMap.set(adminUserId, {
          id: adminUserId,
          name: cred.leadName || `${cred.partnerShortName} Lead`,
          email: cred.defaultEmail,
          role: 'partner_admin',
          companyId: cred.companyId,
          companyName: cred.companyName,
          fieldIdNumber: `MGR-${cred.legacyCode.replace(/[^0-9]/g, '').slice(-4) || '1001'}`,
          certifications: [],
          progress: {},
          completedLessons: [],
          quizScores: {},
        });
      } else {
        const existing = userMap.get(adminUserId);
        userMap.set(adminUserId, {
          ...existing,
          name: cred.leadName || existing.name,
          email: cred.defaultEmail || existing.email,
          companyName: cred.companyName,
        });
      }
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(Array.from(userMap.values())));

    // Broadcast update events to all local hooks and context
    window.dispatchEvent(new Event('quext-partner-credentials-updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('[Cloud Sync] Error syncing cloud partners to localStorage:', err);
  }
}

/**
 * Subscribes to live partner credentials collection in Cloud Firestore.
 * Automatically synchronizes with local storage and notifies subscribers.
 */
export function subscribeToLivePartnerCredentials(
  onUpdate?: (creds: Record<string, PartnerSecurityCredential>) => void
): () => void {
  const colRef = collection(db, PARTNER_CREDENTIALS_COLLECTION);
  const delColRef = collection(db, DELETED_PARTNERS_COLLECTION);
  let isInitialLoad = true;
  const cloudDeletedIds = new Set<string>();

  // Real-time listener for deleted partners
  const unsubDeleted = onSnapshot(
    delColRef,
    (delSnapshot) => {
      delSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.companyId) {
          cloudDeletedIds.add(data.companyId);
        }
      });
    },
    (err) => console.warn('[Cloud Sync] Firestore deleted partners listener warning:', err)
  );

  // Real-time listener for partner credentials
  const unsubCreds = onSnapshot(
    colRef,
    async (snapshot) => {
      try {
        if (snapshot.empty && isInitialLoad) {
          isInitialLoad = false;
          console.log('[Cloud Sync] Cloud partner codes empty. Seeding directory to Firestore...');
          await seedInitialPartnersToCloud();
          return;
        }

        isInitialLoad = false;
        const liveCreds: Record<string, PartnerSecurityCredential> = {};

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PartnerSecurityCredential & { isDeleted?: boolean };
          if (data && data.companyId && !data.isDeleted && !cloudDeletedIds.has(data.companyId)) {
            liveCreds[data.companyId] = {
              companyId: data.companyId,
              partnerShortName: data.partnerShortName,
              companyName: data.companyName,
              legacyCode: data.legacyCode,
              secureAccessCode: data.secureAccessCode,
              defaultEmail: data.defaultEmail,
              leadName: data.leadName,
              region: data.region,
              lastGeneratedAt: data.lastGeneratedAt,
            };
          }
        });

        syncCloudPartnersToLocalStorage(liveCreds, Array.from(cloudDeletedIds));

        if (onUpdate) {
          onUpdate(liveCreds);
        }
      } catch (err) {
        console.error('[Cloud Sync] Error processing live partner codes snapshot:', err);
      }
    },
    (err) => {
      console.warn('[Cloud Sync] Firestore live partner codes listener error:', err);
    }
  );

  return () => {
    unsubCreds();
    unsubDeleted();
  };
}

/**
 * Fallback direct cloud query to locate a partner by secure access code or company code.
 * Used when a user on a brand new browser attempts authentication.
 */
export async function fetchLivePartnerByCodeFromCloud(
  inputCode: string
): Promise<PartnerSecurityCredential | null> {
  if (!inputCode) return null;
  const clean = inputCode.trim().toUpperCase().replace(/[\s-]+/g, '');

  try {
    const snap = await getDocs(collection(db, PARTNER_CREDENTIALS_COLLECTION));
    for (const docSnap of snap.docs) {
      const data = docSnap.data() as PartnerSecurityCredential & { isDeleted?: boolean };
      if (!data || data.isDeleted) continue;
      const cleanSecure = (data.secureAccessCode || '').replace(/[\s-]+/g, '').toUpperCase();
      const cleanLegacy = (data.legacyCode || '').replace(/[\s-]+/g, '').toUpperCase();
      if (clean === cleanSecure || clean === cleanLegacy) {
        // Cache to local storage immediately
        syncCloudPartnersToLocalStorage({ [data.companyId]: data }, []);
        return data;
      }
    }
  } catch (err) {
    console.error('[Cloud Sync] Error querying partner by code from cloud:', err);
  }
  return null;
}

/**
 * Saves a single SOW submission to Cloud Firestore in real-time.
 * Also synchronizes the SOW into the corresponding Project document if propertyId is present.
 */
export async function saveLiveSOWSubmission(sow: GoogleFormSubmission): Promise<void> {
  if (!sow || !sow.id) return;
  try {
    updateSyncStatus({ isSyncing: true });
    const clean = sanitizeForFirestore({
      ...sow,
      lastSyncedAt: new Date().toISOString(),
    });
    const docRef = doc(db, SOW_SUBMISSIONS_COLLECTION, sow.id);
    await setDoc(docRef, clean, { merge: true });

    // Ensure removed from deleted tombstone collection
    try {
      await deleteDoc(doc(db, DELETED_SOWS_COLLECTION, sow.id));
    } catch {}

    // If linked to a property, also sync to project's sowSubmissions in Firestore
    if (sow.propertyId) {
      try {
        const projRef = doc(db, PROJECTS_COLLECTION, sow.propertyId);
        const projSnap = await getDoc(projRef);
        if (projSnap.exists()) {
          const projData = projSnap.data() as OperationProject;
          const currentSows = projData.sowSubmissions ? [...projData.sowSubmissions] : [];
          const idx = currentSows.findIndex((s) => s.id === sow.id);
          if (idx >= 0) {
            currentSows[idx] = sow;
          } else {
            currentSows.unshift(sow);
          }
          await setDoc(projRef, { sowSubmissions: currentSows }, { merge: true });
        }
      } catch (projErr) {
        console.warn(`[Cloud Sync] Could not sync SOW ${sow.id} to project doc ${sow.propertyId}:`, projErr);
      }
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    updateSyncStatus({
      isConnected: true,
      isSyncing: false,
      lastSyncedAt: nowStr,
      error: null,
    });
  } catch (err: any) {
    console.error(`[Cloud Sync] Failed to save SOW ${sow.id} to Firestore:`, err);
    updateSyncStatus({
      isSyncing: false,
      error: err?.message || 'Failed to save SOW to cloud',
    });
    throw err;
  }
}

/**
 * Permanently deletes an SOW from Cloud Firestore and marks a tombstone.
 */
export async function deleteLiveSOWSubmission(sowId: string, propertyId?: string): Promise<void> {
  if (!sowId) return;
  try {
    updateSyncStatus({ isSyncing: true });

    // 1. Delete from live SOW submissions collection
    const docRef = doc(db, SOW_SUBMISSIONS_COLLECTION, sowId);
    await deleteDoc(docRef);

    // 2. Add tombstone
    const delDocRef = doc(db, DELETED_SOWS_COLLECTION, sowId);
    await setDoc(delDocRef, { sowId, deletedAt: new Date().toISOString() }, { merge: true });

    // 3. Remove from project document if propertyId provided
    if (propertyId) {
      try {
        const projRef = doc(db, PROJECTS_COLLECTION, propertyId);
        const projSnap = await getDoc(projRef);
        if (projSnap.exists()) {
          const projData = projSnap.data() as OperationProject;
          if (projData.sowSubmissions) {
            const filtered = projData.sowSubmissions.filter((s) => s.id !== sowId);
            await setDoc(projRef, { sowSubmissions: filtered }, { merge: true });
          }
        }
      } catch (projErr) {
        console.warn(`[Cloud Sync] Could not remove SOW ${sowId} from project doc ${propertyId}:`, projErr);
      }
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    updateSyncStatus({
      isConnected: true,
      isSyncing: false,
      lastSyncedAt: nowStr,
      error: null,
    });
  } catch (err: any) {
    console.error(`[Cloud Sync] Failed to delete SOW ${sowId}:`, err);
    updateSyncStatus({
      isSyncing: false,
      error: err?.message || 'Failed to delete SOW from cloud',
    });
    throw err;
  }
}

/**
 * Seed initial SOW submissions (21 Pearl & Rivertown Commons) to Cloud Firestore if empty.
 */
export async function seedInitialSOWsToCloud(
  sows: GoogleFormSubmission[] = [SEED_SOW_21_PEARL, SEED_SOW_RIVERTOWN_COMMONS]
): Promise<void> {
  try {
    const batch = writeBatch(db);
    sows.forEach((sow) => {
      const clean = sanitizeForFirestore(sow);
      const docRef = doc(db, SOW_SUBMISSIONS_COLLECTION, sow.id);
      batch.set(docRef, clean, { merge: true });
    });
    await batch.commit();
    console.log(`[Cloud Sync] Successfully seeded ${sows.length} initial SOWs to Cloud Firestore.`);
  } catch (err) {
    console.error('[Cloud Sync] Failed to seed initial SOWs to cloud:', err);
  }
}

/**
 * Subscribes to live SOW submissions collection in Cloud Firestore.
 * Automatically synchronizes with local storage and notifies subscribers.
 */
export function subscribeToLiveSOWSubmissions(
  onUpdate?: (sows: GoogleFormSubmission[]) => void
): () => void {
  const colRef = collection(db, SOW_SUBMISSIONS_COLLECTION);
  const delColRef = collection(db, DELETED_SOWS_COLLECTION);
  let isInitialLoad = true;
  const cloudDeletedIds = new Set<string>();

  // Real-time listener for deleted SOWs
  const unsubDeleted = onSnapshot(
    delColRef,
    (delSnapshot) => {
      delSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.sowId) {
          cloudDeletedIds.add(data.sowId);
        }
      });
    },
    (err) => console.warn('[Cloud Sync] Firestore deleted SOWs listener warning:', err)
  );

  // Real-time listener for SOW submissions
  const unsubSows = onSnapshot(
    colRef,
    async (snapshot) => {
      try {
        if (snapshot.empty && isInitialLoad) {
          isInitialLoad = false;
          console.log('[Cloud Sync] Cloud SOWs empty. Seeding initial SOWs to Firestore...');
          await seedInitialSOWsToCloud([SEED_SOW_21_PEARL, SEED_SOW_RIVERTOWN_COMMONS]);
          return;
        }

        isInitialLoad = false;
        const liveList: GoogleFormSubmission[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as GoogleFormSubmission;
          if (data && data.id && !cloudDeletedIds.has(data.id)) {
            liveList.push(data);
          }
        });

        // Ensure 21 Pearl and Rivertown Commons are never missing unless explicitly deleted
        const has21Pearl = liveList.some(
          (s) =>
            s.id === SEED_SOW_21_PEARL.id ||
            (s.communityName || '').trim().toLowerCase() === '21 pearl'
        );
        if (!has21Pearl && !cloudDeletedIds.has(SEED_SOW_21_PEARL.id)) {
          liveList.unshift(SEED_SOW_21_PEARL);
        }

        const hasRivertown = liveList.some(
          (s) =>
            s.id === SEED_SOW_RIVERTOWN_COMMONS.id ||
            (s.communityName || '').trim().toLowerCase().includes('rivertown')
        );
        if (!hasRivertown && !cloudDeletedIds.has(SEED_SOW_RIVERTOWN_COMMONS.id)) {
          liveList.push(SEED_SOW_RIVERTOWN_COMMONS);
        }

        // Sort descending by submission date
        liveList.sort(
          (a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
        );

        // Update local storage cache
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('quext_sow_google_form_submissions_v2', JSON.stringify(liveList));
            window.dispatchEvent(new Event('quext_sow_submissions_updated'));
            window.dispatchEvent(new Event('storage'));
          }
        } catch (e) {
          console.warn('[Cloud Sync] Error updating localStorage with live SOWs:', e);
        }

        if (onUpdate) {
          onUpdate(liveList);
        }
      } catch (err) {
        console.error('[Cloud Sync] Error processing live SOW snapshot:', err);
      }
    },
    (err) => {
      console.warn('[Cloud Sync] Firestore live SOW listener error:', err);
    }
  );

  return () => {
    unsubSows();
    unsubDeleted();
  };
}

/**
 * Direct active fetch of all live SOW submissions from Cloud Firestore.
 * Performs deep reconciliation with cloud deleted tombstones, seeds any missing default SOWs
 * (Rivertown Commons, 21 Pearl), and synchronizes with local storage.
 */
export async function fetchLiveSOWSubmissionsFromCloud(): Promise<GoogleFormSubmission[]> {
  try {
    const [sowSnap, delSnap] = await Promise.all([
      getDocs(collection(db, SOW_SUBMISSIONS_COLLECTION)),
      getDocs(collection(db, DELETED_SOWS_COLLECTION)),
    ]);

    const cloudDeletedIds = new Set<string>();
    delSnap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.sowId) cloudDeletedIds.add(data.sowId);
    });

    const liveList: GoogleFormSubmission[] = [];
    sowSnap.forEach((docSnap) => {
      const data = docSnap.data() as GoogleFormSubmission;
      if (data && data.id && !cloudDeletedIds.has(data.id)) {
        liveList.push(data);
      }
    });

    // Ensure 21 Pearl and Rivertown Commons are never missing unless explicitly deleted
    const has21Pearl = liveList.some(
      (s) =>
        s.id === SEED_SOW_21_PEARL.id ||
        (s.communityName || '').trim().toLowerCase() === '21 pearl'
    );
    if (!has21Pearl && !cloudDeletedIds.has(SEED_SOW_21_PEARL.id)) {
      liveList.unshift(SEED_SOW_21_PEARL);
      saveLiveSOWSubmission(SEED_SOW_21_PEARL).catch(() => {});
    }

    const hasRivertown = liveList.some(
      (s) =>
        s.id === SEED_SOW_RIVERTOWN_COMMONS.id ||
        (s.communityName || '').trim().toLowerCase().includes('rivertown')
    );
    if (!hasRivertown && !cloudDeletedIds.has(SEED_SOW_RIVERTOWN_COMMONS.id)) {
      liveList.push(SEED_SOW_RIVERTOWN_COMMONS);
      saveLiveSOWSubmission(SEED_SOW_RIVERTOWN_COMMONS).catch(() => {});
    }

    // Sort descending by date
    liveList.sort(
      (a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
    );

    // Cache to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('quext_sow_google_form_submissions_v2', JSON.stringify(liveList));
        window.dispatchEvent(new Event('quext_sow_submissions_updated'));
      } catch (err) {
        console.warn('[Cloud Sync] Failed to cache live SOWs to localStorage:', err);
      }
    }

    return liveList;
  } catch (err) {
    console.error('[Cloud Sync] Failed to fetch live SOWs from cloud:', err);
    return [SEED_SOW_21_PEARL, SEED_SOW_RIVERTOWN_COMMONS];
  }
}
