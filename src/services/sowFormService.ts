import { GoogleFormSubmission, FieldTechContact } from '../types/sowForm';
import { sendRealGmailEmail, getAccessToken } from './gmailService';
import { getSowPdfBase64, downloadSowPdf } from '../utils/generateSowPdf';
import { saveLiveSOWSubmission, deleteLiveSOWSubmission } from './realtimeSyncService';

const STORAGE_KEY = 'quext_sow_google_form_submissions_v2';

export const DEFAULT_FIELD_TECHS: FieldTechContact[] = [
  {
    id: 'partner-skbm',
    name: 'SKBM (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-dtv',
    name: 'DTV (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-allbridge',
    name: 'All Bridge (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-halocom',
    name: 'halocom (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-teleco',
    name: 'teleco (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-highland',
    name: 'Highland (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-luinc',
    name: 'lu inc (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-highstandard',
    name: 'high standard (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-triplec',
    name: 'triple c (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-convergentz',
    name: 'convergentz (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'partner-alltech',
    name: 'all tech (Partner Integrator)',
    email: '',
    phone: '',
    role: 'Partner Integrator / Vendor',
    region: 'National Partner',
  },
  {
    id: 'ft-hector',
    name: 'Hector Lopez',
    email: 'hector.lopez@onequext.com',
    phone: '',
    role: 'Quext Field Technician',
    region: 'Field Operations',
  },
  {
    id: 'ft-sean',
    name: 'Sean Gates',
    email: 'sean.gates@onequext.com',
    phone: '',
    role: 'Quext Field Technician',
    region: 'Field Operations',
  },
];

export const SEED_SOW_21_PEARL: GoogleFormSubmission = {
  id: 'sow-21-pearl-master',
  submittedAt: '2026-11-01T14:30:00.000Z',
  source: 'simulator',
  status: 'pdf_generated',
  orderStatus: 'Scheduled',
  scheduledDate: '2026-11-15',
  propertyId: 'proj-21-pearl',
  communityName: '21 Pearl',
  workSiteAddress: '21 Pearl St, Austin, TX 78705',
  datePrepared: '2026-11-01',
  installDate: '2026-11-15',
  preparedBy: 'Raul Recalde',
  sowReferenceNumber: 'SOW-2026-21PL-QXT',
  pocName: 'Marcus Vance',
  pocTitle: 'Lead Community Director',
  pocPhone: '(512) 472-2100',
  pocEmail: 'marcus.vance@21pearlapts.com',
  alternateContact: 'Elena Ruiz (Maintenance Supervisor) (512) 472-2105',
  unitLocksIssue:
    'Building B Floors 2 & 3: 14 Smart Locksets experiencing BLE gateway desynchronization following power cycle. Re-pairing and firmware flash required.',
  accessControlIssue:
    'Main Courtyard Perimeter Pedestrian Gate: Magnetic shear lock not releasing on keyfob scan. Reader telemetry operational, relay needs replacement.',
  camerasIssue: 'North Parking Garage Level 1: Dome camera #04 offline due to PoE injector reset.',
  residentWifiIssue:
    'Clubhouse Resident Lounge: AP-02 channel interference with leasing office router.',
  communityWifiIssue: '',
  staffWifiIssue: 'Leasing office management AP running on default mesh; needs VLAN separation.',
  thermostatsIssue:
    'Units 204, 208, 312: EcoBee thermostats lost cloud pairing after Wi-Fi credential update.',
  leakSensorsIssue: 'Water heater closet sensors #08 and #11 reported low battery warnings.',
  equipmentNeedsShipping: 'Yes',
  equipmentToShip:
    '14x BLE Deadbolt modules, 1x 12V 5A Relay Board, 2x PoE+ Injectors, 6x CR123A Lithium Batteries',
  equipmentQuantityAndLocation:
    '14 Locksets (Bldg B), 1 Relay (Courtyard Gate), 2 Injectors (Garage L1)',
  shippingRecipient: 'Marcus Vance (Site POC)',
  shippingPhone: '(512) 472-2100',
  shippingEmail: 'marcus.vance@21pearlapts.com',
  shippingMethod: '2 Day',
  primaryContactMethod: 'Cell Phone & Text/SMS',
  backupContactMethod: 'Email to Site POC',
  checkInFrequency: 'Upon site arrival and before leaving site',
  escalationContact: 'Quext Customer Success & Field Operations',
  integratorPartners: ['Spirit Security'],
};

export const SEED_SOW_RIVERTOWN_COMMONS: GoogleFormSubmission = {
  id: 'sow-rivertown-commons-master',
  submittedAt: '2026-11-02T16:15:00.000Z',
  source: 'simulator',
  status: 'sent_to_tech',
  orderStatus: 'Scheduled',
  scheduledDate: '2026-05-11',
  propertyId: 'proj-master-1793739220206',
  communityName: 'Rivertown Commons',
  workSiteAddress: '100 Main St, Dallas, TX 75201',
  datePrepared: '2026-11-02',
  installDate: '2026-05-11',
  preparedBy: 'Raul Recalde',
  sowReferenceNumber: 'SOW-2026-RTC-QXT',
  pocName: 'Danielle Miller',
  pocTitle: 'Senior Community General Manager',
  pocPhone: '(214) 555-0142',
  pocEmail: 'danielle.miller@trilogyre.com',
  alternateContact: 'Carlos Mendez (Lead Maintenance Supervisor) (214) 555-0149',
  unitLocksIssue:
    'Full property retrofit across 408 residential units: Deploy Quext Smart Deadbolts (QXT-DL-900). Pre-commission BLE pairing, verify interior thumbturn throw, strike plate mortise clearance, and gateway packet capture across all residential corridors.',
  accessControlIssue:
    'Common Areas: Clubhouse Main Entry and Fitness Center Entry access control reader wiring, electrified mortise latch integration, and Knox Box master emergency override fob testing.',
  camerasIssue:
    'Clubhouse and Amenity Center: Verify PoE network switch uplink and verify RTSP feed transmission to cloud video management.',
  residentWifiIssue:
    'Resident common amenity spaces Wi-Fi mesh optimization and guest portal onboarding verification.',
  communityWifiIssue: '',
  staffWifiIssue: 'Property management leasing office admin network isolation and secure VLAN configuration.',
  thermostatsIssue:
    '408 Residential Units: Deploy Quext IoT Smart Thermostat (QXT-TH-300). Perform LoRaWAN sub-GHz network join, verify HVAC 24V C-wire voltage supply, and test heat/cool operational relays.',
  leakSensorsIssue: 'Water heater closet sensors inspection and battery telemetry baseline check.',
  equipmentNeedsShipping: 'Yes',
  equipmentToShip:
    '408x Quext Smart Deadbolts (QXT-DL-900), 408x Quext Smart Thermostats (QXT-TH-300), 7x LoRaWAN Outdoor Gateways (QXT-GW-LR8), mounting brackets, strike plates, and hardware install kits',
  equipmentQuantityAndLocation:
    '408 Units (Locks & Thermostats), 7 Gateways (Clubhouse Rooftop & Central Buildings), 2 Readers (Clubhouse & Fitness Center)',
  shippingRecipient: 'Danielle Miller (Attn: Maintenance Shop Staging Area)',
  shippingPhone: '(214) 555-0142',
  shippingEmail: 'danielle.miller@trilogyre.com',
  shippingMethod: 'Ground',
  primaryContactMethod: 'Cell Phone & Text/SMS',
  backupContactMethod: 'Email to Site POC',
  checkInFrequency: 'Upon site arrival and before leaving site',
  escalationContact: 'Nicole Franklin (Quext CSM) & Hector Lopez (Field Ops Lead)',
  integratorPartners: ['SKBM'],
  assignedTechName: 'SKBM (Partner Integrator)',
  assignedTechEmail: 'hector.lopez@onequext.com',
  dispatchedAt: '2026-11-02T17:00:00.000Z',
  dispatchedMessageId: 'live-dispatched-rtc-01',
};

export const INITIAL_SOW_SUBMISSIONS: GoogleFormSubmission[] = [
  SEED_SOW_21_PEARL,
  SEED_SOW_RIVERTOWN_COMMONS,
];

export const loadSubmissions = (): GoogleFormSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let parsed: GoogleFormSubmission[] = [];
    if (raw) {
      const json = JSON.parse(raw);
      if (Array.isArray(json)) {
        parsed = json.filter(
          (s) => s && s.id !== 'sub-sample-1' && s.id !== 'sub-sample-2'
        );
      }
    }
    // Ensure 21 Pearl SOW is always present
    const has21Pearl = parsed.some(
      (s) =>
        (s.communityName || '').trim().toLowerCase() === '21 pearl' ||
        (s.sowReferenceNumber || '').includes('21PL') ||
        s.id === 'sow-21-pearl-master'
    );
    if (!has21Pearl) {
      parsed.unshift(SEED_SOW_21_PEARL);
    }

    // Ensure Rivertown Commons SOW is always present
    const hasRivertown = parsed.some(
      (s) =>
        (s.communityName || '').trim().toLowerCase().includes('rivertown') ||
        (s.sowReferenceNumber || '').includes('RTC') ||
        s.id === 'sow-rivertown-commons-master'
    );
    if (!hasRivertown) {
      parsed.push(SEED_SOW_RIVERTOWN_COMMONS);
    }

    if (!has21Pearl || !hasRivertown) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // ignore
      }
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load SOW submissions from localStorage:', err);
    return INITIAL_SOW_SUBMISSIONS;
  }
};

export const saveSubmissions = (submissions: GoogleFormSubmission[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    window.dispatchEvent(new Event('quext_sow_submissions_updated'));
  } catch (err) {
    console.error('Failed to save SOW submissions to localStorage:', err);
  }
};

export const addSubmission = (
  submissionData: Partial<GoogleFormSubmission>
): GoogleFormSubmission => {
  const current = loadSubmissions();
  const newSubmission: GoogleFormSubmission = {
    id: `sow-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    submittedAt: new Date().toISOString(),
    source: submissionData.source || 'simulator',
    status: 'pdf_generated',
    communityName: submissionData.communityName || 'Unnamed Community',
    workSiteAddress: submissionData.workSiteAddress || 'Address Pending',
    datePrepared: submissionData.datePrepared || new Date().toISOString().split('T')[0],
    installDate: submissionData.installDate || 'TBD',
    preparedBy: submissionData.preparedBy || 'Quext Customer Success',
    sowReferenceNumber:
      submissionData.sowReferenceNumber ||
      `SOW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-QXT`,
    pocName: submissionData.pocName || 'Site Contact',
    pocTitle: submissionData.pocTitle || 'Property Manager',
    pocPhone: submissionData.pocPhone || '—',
    pocEmail: submissionData.pocEmail || '—',
    alternateContact: submissionData.alternateContact || '',
    unitLocksIssue: submissionData.unitLocksIssue || '',
    accessControlIssue: submissionData.accessControlIssue || '',
    camerasIssue: submissionData.camerasIssue || '',
    residentWifiIssue: submissionData.residentWifiIssue || '',
    communityWifiIssue: submissionData.communityWifiIssue || '',
    staffWifiIssue: submissionData.staffWifiIssue || '',
    thermostatsIssue: submissionData.thermostatsIssue || '',
    leakSensorsIssue: submissionData.leakSensorsIssue || '',
    equipmentNeedsShipping: submissionData.equipmentNeedsShipping || 'No',
    equipmentToShip: submissionData.equipmentToShip || '',
    equipmentQuantityAndLocation: submissionData.equipmentQuantityAndLocation || '',
    shippingRecipient: submissionData.shippingRecipient || '',
    shippingPhone: submissionData.shippingPhone || '',
    shippingEmail: submissionData.shippingEmail || '',
    shippingMethod: submissionData.shippingMethod || 'Ground',
    primaryContactMethod: submissionData.primaryContactMethod || 'Cell Phone & Text/SMS',
    backupContactMethod: submissionData.backupContactMethod || 'Email to Site POC',
    checkInFrequency:
      submissionData.checkInFrequency || 'Upon site arrival and before leaving site',
    escalationContact: submissionData.escalationContact || 'Quext Customer Success & Operations',
    ...submissionData,
  };

  const updated = [newSubmission, ...current];
  saveSubmissions(updated);
  // Live Cloud Firestore synchronization across all browsers and devices
  saveLiveSOWSubmission(newSubmission).catch((err) =>
    console.warn('[Cloud Sync] Background live SOW creation save failed:', err)
  );
  return newSubmission;
};

export const updateSubmission = (
  id: string,
  updates: Partial<GoogleFormSubmission>
): GoogleFormSubmission | null => {
  const current = loadSubmissions();
  const index = current.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const updatedItem = { ...current[index], ...updates };
  current[index] = updatedItem;
  saveSubmissions(current);
  // Live Cloud Firestore synchronization across all browsers and devices
  saveLiveSOWSubmission(updatedItem).catch((err) =>
    console.warn(`[Cloud Sync] Background live SOW update for ${id} failed:`, err)
  );
  return updatedItem;
};

export const deleteSubmission = (id: string, propertyId?: string): void => {
  const current = loadSubmissions();
  const target = current.find((s) => s.id === id);
  const resolvedPropertyId = propertyId || target?.propertyId;
  const filtered = current.filter((s) => s.id !== id);
  saveSubmissions(filtered);
  // Live Cloud Firestore deletion & tombstone across all browsers and devices
  deleteLiveSOWSubmission(id, resolvedPropertyId).catch((err) =>
    console.warn(`[Cloud Sync] Background live SOW delete for ${id} failed:`, err)
  );
};

export const buildPartnerVendorPlainTextEmail = (
  submission: GoogleFormSubmission,
  recipientName: string,
  customNotes?: string
): { subject: string; body: string } => {
  const subject = `[OneQuext SOW Work Order] ${submission.communityName} — Technical SOW PDF Attached (${submission.sowReferenceNumber})`;

  const notesBlock = customNotes?.trim()
    ? `\nDISPATCH / ONSITE NOTES:\n${customNotes.trim()}\n`
    : '';

  const body = [
    `Hello ${recipientName || 'Partner Integrator / Vendor Team'},`,
    '',
    `Please find attached the official OneQuext Scope of Work (SOW) Work Order PDF for ${submission.communityName}.`,
    '',
    'ONSITE VISIT DETAILS:',
    `• Community / Property: ${submission.communityName}`,
    `• Work Site Address: ${submission.workSiteAddress}`,
    `• Requested Install / Visit Date: ${submission.installDate || 'TBD'}`,
    `• SOW Reference Number: ${submission.sowReferenceNumber}`,
    `• Site Point of Contact: ${submission.pocName} (${submission.pocTitle || 'Site Contact'}) — Phone: ${submission.pocPhone}${submission.pocEmail ? ` | Email: ${submission.pocEmail}` : ''}`,
    `• Assigned Integrator / Installer: ${
      submission.integratorPartners && submission.integratorPartners.length > 0
        ? submission.integratorPartners.join(', ')
        : 'Quext Certified Field Operations'
    }`,
    notesBlock,
    '--------------------------------------------------',
    'ATTACHED WORK ORDER PDF:',
    `Please refer to the attached "${submission.sowReferenceNumber}.pdf" document for complete technical specifications, reported device issue locations, hardware shipping status, and onsite customer sign-off requirements.`,
    '--------------------------------------------------',
    '',
    'Thank you,',
    `${submission.preparedBy || 'Quext Customer Success & Field Operations'}`,
  ]
    .filter((line) => line !== undefined)
    .join('\n');

  return { subject, body };
};

export const buildFieldTechEmailHtml = (
  submission: GoogleFormSubmission,
  tech: FieldTechContact,
  customNotes?: string
): string => {
  const pdfFilename = `OneQuext_SOW_${submission.communityName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${submission.installDate || 'Visit'}.pdf`;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 640px; margin: 0 auto;">
      <div style="background-color: #1b365d; color: #ffffff; padding: 20px 24px; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 700;">OneQuext Scope of Work (SOW) Work Order</h2>
        <p style="margin: 6px 0 0 0; color: #93c5fd; font-size: 13px;">Reference: <strong>${submission.sowReferenceNumber}</strong> • Prepared: ${submission.datePrepared}</p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 10px 10px; background-color: #ffffff;">
        <p style="margin-top: 0; font-size: 14px;">Hello <strong>${tech.name || 'Partner Integrator / Vendor Team'}</strong>,</p>
        <p style="font-size: 14px; color: #334155;">
          Please find attached the official <strong>OneQuext Scope of Work (SOW) Work Order PDF</strong> for <strong>${submission.communityName}</strong>.
        </p>

        <!-- Attached PDF Banner -->
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">📎</span>
            <div>
              <div style="font-weight: 700; color: #166534; font-size: 13px;">Attached Work Order Document:</div>
              <div style="font-family: monospace; font-size: 12px; color: #14532d; font-weight: 600; margin-top: 2px;">${pdfFilename}</div>
            </div>
          </div>
          <div style="font-size: 11px; color: #15803d; margin-top: 6px; padding-left: 30px;">
            Full 2-Page Technical SOW, Device Diagnostic Specs, Shipping Manifest &amp; Sign-Off Sheet attached as PDF.
          </div>
        </div>

        ${
          customNotes?.trim()
            ? `
          <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
            <strong style="color: #0369a1; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">CSM / Dispatch Notes:</strong>
            <div style="margin-top: 4px; font-size: 13px; color: #0f172a; white-space: pre-wrap;">${customNotes.trim()}</div>
          </div>
        `
            : ''
        }

        <h4 style="margin: 20px 0 10px 0; color: #1b365d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #1b365d; padding-bottom: 4px;">Onsite Visit Summary</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: 700; width: 180px; color: #475569;">Community / Site</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f172a;">${submission.communityName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: 700; color: #475569;">Work Site Address</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a;">${submission.workSiteAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: 700; color: #475569;">Scheduled Visit Date</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f766e;">${submission.installDate || 'TBD'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: 700; color: #475569;">Site Point of Contact</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #0f172a;">${submission.pocName} (${submission.pocTitle || 'Site Contact'}) • ${submission.pocPhone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-weight: 700; color: #475569;">Assigned Integrator</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #1e293b;">${
              submission.integratorPartners && submission.integratorPartners.length > 0
                ? submission.integratorPartners.join(', ')
                : 'Quext Certified Field Operations'
            }</td>
          </tr>
        </table>

        <p style="font-size: 13px; color: #475569; margin-top: 16px;">
          Please open and review the attached <strong>OneQuext Scope of Work (SOW) PDF</strong> for the comprehensive hardware list, reported device issues, shipping tracking, and onsite sign-off block.
        </p>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <strong>OneQuext Customer Success &amp; Field Operations</strong><br />
          Prepared by: ${submission.preparedBy || 'Quext Field Operations'}
        </div>
      </div>
    </div>
  `;
};

export const dispatchSowEmailToTech = async ({
  submissionId,
  tech,
  customNotes,
  customSubject,
}: {
  submissionId: string;
  tech: FieldTechContact;
  customNotes?: string;
  customSubject?: string;
}): Promise<{ success: boolean; messageId?: string; fallback?: boolean }> => {
  const submissions = loadSubmissions();
  const sub = submissions.find((s) => s.id === submissionId);
  if (!sub) throw new Error('Submission not found');

  const pdfBase64 = getSowPdfBase64(sub);
  const pdfFilename = `OneQuext_SOW_${sub.communityName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${sub.installDate || 'Visit'}.pdf`;

  const subject =
    customSubject?.trim() ||
    `[OneQuext SOW Work Order] ${sub.communityName} — Onsite Visit & Scope of Work (${sub.sowReferenceNumber})`;
  const htmlBody = buildFieldTechEmailHtml(sub, tech, customNotes);

  try {
    const token = await getAccessToken();
    if (!token || !tech.email) {
      downloadSowPdf(sub);
      updateSubmission(submissionId, {
        status: 'sent_to_tech',
        assignedTechName: tech.name,
        assignedTechEmail: tech.email || 'Partner Integrator / Vendor',
        dispatchedAt: new Date().toISOString(),
        dispatchedMessageId: 'manual-download-dispatched',
      });
      return { success: true, fallback: true };
    }

    const sendRes = await sendRealGmailEmail({
      to: tech.email,
      subject,
      htmlBody,
      attachments: [
        {
          filename: pdfFilename,
          contentType: 'application/pdf',
          base64Data: pdfBase64,
        },
      ],
    });

    updateSubmission(submissionId, {
      status: 'sent_to_tech',
      assignedTechName: tech.name,
      assignedTechEmail: tech.email,
      dispatchedAt: new Date().toISOString(),
      dispatchedMessageId: sendRes.id,
    });

    return { success: true, messageId: sendRes.id };
  } catch (err: any) {
    console.warn('Gmail API dispatch encountered error, providing fallback:', err);
    downloadSowPdf(sub);
    updateSubmission(submissionId, {
      status: 'sent_to_tech',
      assignedTechName: tech.name,
      assignedTechEmail: tech.email || 'Partner Integrator / Vendor',
      dispatchedAt: new Date().toISOString(),
      dispatchedMessageId: 'manual-dispatch',
    });
    return { success: true, fallback: true };
  }
};

export const getGoogleAppsScriptWebhookCode = (_webhookUrl: string): string => '';
export const getGoogleAppsScriptDirectEmailCode = (_defaultTechEmail: string): string => '';
