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
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { OperationProject, Quote, isLockBOMItem } from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_QUOTES,
  enrichProjectDefaults,
  sanitizeProjectRealTeamOnly,
  saveStoredProjects,
  saveStoredQuotes,
  loadArchivedProjectIds,
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
            const enriched = sanitizeProjectRealTeamOnly(enrichProjectDefaults(data));
            if (hasInvalidLockTag) {
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
