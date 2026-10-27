import { PARTNER_IDENTITY_DIRECTORY, PartnerIdentityDirectoryEntry } from './projectCoursePackager';

export interface PartnerSecurityCredential {
  companyId: string;
  partnerShortName: string;
  companyName: string;
  legacyCode: string;
  secureAccessCode: string;
  defaultEmail: string;
  leadName: string;
  region: string;
  lastGeneratedAt: string;
}

const STORAGE_KEY_PARTNER_CODES = 'quext_partner_secure_access_codes_v1';

// Default high-entropy cryptographic-style secure access codes for existing integrator partners
const DEFAULT_SECURE_CODES: Record<string, string> = {
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

// Generate an alphanumeric secure token
export function generateSecurePartnerCode(prefix = 'QX-PRT'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32 without confusing 0/O/1/I
  const randomChunk = (len: number) => {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `${prefix.toUpperCase()}-${randomChunk(4)}-${randomChunk(4)}`;
}

// Load all credentials from localStorage or defaults
export function loadPartnerSecurityCredentials(): Record<string, PartnerSecurityCredential> {
  const defaults: Record<string, PartnerSecurityCredential> = {};
  
  for (const entry of PARTNER_IDENTITY_DIRECTORY) {
    const prefix = `QX-${entry.companyCode.slice(0, 3).toUpperCase()}`;
    const code = DEFAULT_SECURE_CODES[entry.companyId] || `${prefix}-7492-9K1A`;
    
    defaults[entry.companyId] = {
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
  }

  if (typeof window === 'undefined') return defaults;

  try {
    const saved = localStorage.getItem(STORAGE_KEY_PARTNER_CODES);
    if (saved) {
      const parsed: Record<string, Partial<PartnerSecurityCredential>> = JSON.parse(saved);
      for (const [compId, cred] of Object.entries(parsed)) {
        if (defaults[compId] && cred.secureAccessCode) {
          defaults[compId] = {
            ...defaults[compId],
            ...cred,
          };
        }
      }
    }
  } catch (err) {
    console.error('[PartnerSecurity] Error reading stored credentials:', err);
  }

  return defaults;
}

// Save credentials
export function savePartnerSecurityCredentials(creds: Record<string, PartnerSecurityCredential>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PARTNER_CODES, JSON.stringify(creds));
  } catch (err) {
    console.error('[PartnerSecurity] Error saving credentials:', err);
  }
}

// Get single partner's secure code by companyId, partnerShortName, or legacy code
export function getPartnerSecureCode(partnerIdentifier?: string): string {
  if (!partnerIdentifier) return DEFAULT_SECURE_CODES['comp_spirit'];
  const norm = partnerIdentifier.trim().toLowerCase();
  const all = loadPartnerSecurityCredentials();

  for (const cred of Object.values(all)) {
    if (
      cred.companyId.toLowerCase() === norm ||
      cred.partnerShortName.toLowerCase() === norm ||
      cred.companyName.toLowerCase().includes(norm) ||
      cred.legacyCode.toLowerCase() === norm ||
      norm.includes(cred.partnerShortName.toLowerCase())
    ) {
      return cred.secureAccessCode;
    }
  }

  return DEFAULT_SECURE_CODES['comp_spirit'];
}

// Regenerate / rotate a partner's secure access code
export function rotatePartnerSecureCode(companyId: string): string {
  const all = loadPartnerSecurityCredentials();
  const target = all[companyId];
  if (!target) return generateSecurePartnerCode();

  const prefix = `QX-${target.legacyCode.slice(0, 3).toUpperCase()}`;
  const newCode = generateSecurePartnerCode(prefix);

  all[companyId] = {
    ...target,
    secureAccessCode: newCode,
    lastGeneratedAt: new Date().toISOString(),
  };

  savePartnerSecurityCredentials(all);
  return newCode;
}

// Resolve a partner from a secure code or legacy code
export function resolvePartnerByAccessCode(
  inputCode: string
): PartnerIdentityDirectoryEntry | null {
  if (!inputCode) return null;
  const clean = inputCode.trim().toUpperCase().replace(/[\s-]+/g, '');
  const all = loadPartnerSecurityCredentials();

  for (const cred of Object.values(all)) {
    const cleanSecure = cred.secureAccessCode.replace(/[\s-]+/g, '').toUpperCase();
    const cleanLegacy = cred.legacyCode.replace(/[\s-]+/g, '').toUpperCase();

    if (clean === cleanSecure || clean === cleanLegacy) {
      const dirEntry = PARTNER_IDENTITY_DIRECTORY.find((p) => p.companyId === cred.companyId);
      return dirEntry || null;
    }
  }

  return null;
}
