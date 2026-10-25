// Persistent IndexedDB + localStorage storage for high-resolution iPhone screenshots
// Solves browser 5MB localStorage quota limit so all 15 screenshots persist reliably.

const DB_NAME = 'quext_field_academy_db';
const STORE_NAME = 'leak_screenshots';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveScreenshot(stepNumber: number, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, stepNumber);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage', err);
    try {
      const existing = JSON.parse(localStorage.getItem('quext_leak_step_screenshots') || '{}');
      existing[stepNumber] = dataUrl;
      localStorage.setItem('quext_leak_step_screenshots', JSON.stringify(existing));
    } catch (e) {
      console.warn('localStorage full as well', e);
    }
  }
}

export async function loadAllScreenshots(): Promise<Record<number, string>> {
  const result: Record<number, string> = {};

  // First check localStorage for any immediate synchronous data
  try {
    const fromLocal = JSON.parse(localStorage.getItem('quext_leak_step_screenshots') || '{}');
    Object.assign(result, fromLocal);
  } catch {
    // ignore
  }

  // Then merge / upgrade from IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getAllKeysReq = store.getAllKeys();
    const getAllValuesReq = store.getAll();

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    const keys = getAllKeysReq.result as number[];
    const values = getAllValuesReq.result as string[];
    keys.forEach((key, idx) => {
      result[key] = values[idx];
    });
  } catch (err) {
    console.warn('IndexedDB load failed, using localStorage only', err);
  }

  return result;
}

export async function clearAllScreenshotsDB(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
  try {
    localStorage.removeItem('quext_leak_step_screenshots');
  } catch {
    // ignore
  }
}
