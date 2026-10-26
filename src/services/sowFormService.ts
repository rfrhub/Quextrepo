import { GoogleFormSubmission, FieldTechContact } from '../types/sowForm';
import { sendRealGmailEmail, getAccessToken } from './gmailService';
import { getSowPdfBase64, downloadSowPdf } from '../utils/generateSowPdf';

const STORAGE_KEY = 'quext_sow_google_form_submissions_v1';

export const DEFAULT_FIELD_TECHS: FieldTechContact[] = [
  {
    id: 'ft-1',
    name: 'Austin Ricks',
    email: 'austin.ricks@onequext.com',
    phone: '(806) 555-0142',
    role: 'Senior Field Solutions Specialist',
    region: 'Central / Texas',
  },
  {
    id: 'ft-2',
    name: 'Taylor Brooks',
    email: 'taylor.brooks@onequext.com',
    phone: '(512) 555-0188',
    role: 'Lead IoT Deployment Engineer',
    region: 'Southwest',
  },
  {
    id: 'ft-3',
    name: 'Jordan Martinez',
    email: 'jordan.m@onequext.com',
    phone: '(214) 555-0199',
    role: 'Access & Lock Field Tech',
    region: 'North Texas',
  },
  {
    id: 'ft-4',
    name: 'Field Dispatch Desk',
    email: 'field-dispatch@onequext.com',
    phone: '(888) 555-7839',
    role: 'Central Dispatch Queue',
    region: 'National Operations',
  },
];

const INITIAL_SUBMISSIONS: GoogleFormSubmission[] = [
  {
    id: 'sub-sample-1',
    submittedAt: '2026-10-25T14:32:00Z',
    source: 'google_form',
    status: 'new',
    communityName: 'The Highland Lofts at Midtown',
    workSiteAddress: '4820 Highland Park Blvd, Austin, TX 78731',
    datePrepared: '2026-10-25',
    installDate: '2026-10-28',
    preparedBy: 'Sarah Jenkins (Quext Project Ops)',
    sowReferenceNumber: 'SOW-2026-0842-QXT',
    pocName: 'Marcus Vance',
    pocTitle: 'Property Operations Director',
    pocPhone: '(512) 555-8921',
    pocEmail: 'mvance@highlandlofts.com',
    alternateContact: 'Site Maintenance Super: Joe Davis (512-555-8924)',
    unitLocksIssue:
      'Units 302, 305, 412: Quext Smart Deadbolts failing to report battery state and intermittently dropping Zigbee mesh connection. Need lock motor realignment and gateway re-pairing.',
    accessControlIssue:
      'South Pedestrian Gate Brivo board: reader offline, needs 12V DC power cycle check and terminal re-termination.',
    camerasIssue:
      'Clubhouse NVR Cam 04 (Pool Entry): lens fogging and loose cat6 RJ45 connector crimp.',
    residentWifiIssue:
      'Bldg 3 2nd floor corridor Ruckus AP 3-201: solid red LED, needs PoE reset and DHCP re-check.',
    communityWifiIssue: 'Clubhouse guest portal redirect loop verified on iOS devices.',
    staffWifiIssue: 'Leasing office backup SSID not broadcasting.',
    thermostatsIssue:
      'Units 204 & 310: Honeywell Z-Wave thermostats displaying E2 error (C-wire voltage fluctuation).',
    leakSensorsIssue:
      'Building 1 boiler room: 2 Quext Water Sensors reporting low RSSI (-92 dBm), need mesh repeater.',
    equipmentNeedsShipping: 'Yes',
    equipmentToShip: '3x Quext Smart Deadbolts (Satin Nickel), 1x Ruckus AP Mount, 2x IoT Repeaters',
    equipmentQuantityAndLocation:
      '3 locks for Units 302/305/412; 1 AP mount for Bldg 3; 2 repeaters for Bldg 1 riser.',
    shippingRecipient: 'Marcus Vance (Attn: Maintenance Shop)',
    shippingPhone: '(512) 555-8921',
    shippingEmail: 'mvance@highlandlofts.com',
    shippingMethod: '2 Day',
    primaryContactMethod: 'Cell Phone & Text/SMS',
    backupContactMethod: 'Email to Site Director',
    checkInFrequency: 'Upon site arrival and before leaving site',
    escalationContact: 'Sarah Jenkins (888-555-0100 ext 402)',
  },
  {
    id: 'sub-sample-2',
    submittedAt: '2026-10-24T09:15:00Z',
    source: 'google_form',
    status: 'sent_to_tech',
    communityName: 'Solana Vista Apartments',
    workSiteAddress: '1200 Coronado Dr, Fort Worth, TX 76102',
    datePrepared: '2026-10-24',
    installDate: '2026-10-27',
    preparedBy: 'Raul Recalde (Quext Project Ops)',
    sowReferenceNumber: 'SOW-2026-0839-QXT',
    pocName: 'Elena Rostova',
    pocTitle: 'General Manager',
    pocPhone: '(817) 555-4302',
    pocEmail: 'elena.rostova@solanavista.com',
    alternateContact: 'Assistant Manager: Kevin Hall (817-555-4309)',
    unitLocksIssue:
      'Building 4 (Units 401-416): 6 deadbolts replaced during turn, require key cylinder matching and QR code binding to Quext Portal.',
    accessControlIssue: 'Main Clubhouse front door magnetic lock buzzing intermittently.',
    camerasIssue: '',
    residentWifiIssue: '',
    communityWifiIssue: 'Pool cabana outdoor access point weather enclosure loose.',
    staffWifiIssue: '',
    thermostatsIssue: 'Unit 414: Ecobee thermostat screen black; check 24V transformer breaker.',
    leakSensorsIssue: '',
    equipmentNeedsShipping: 'No',
    equipmentToShip: '',
    equipmentQuantityAndLocation: 'Onsite inventory available in maintenance storeroom.',
    shippingRecipient: '',
    shippingPhone: '',
    shippingEmail: '',
    shippingMethod: 'Ground',
    primaryContactMethod: 'Cell Phone',
    backupContactMethod: 'Email',
    checkInFrequency: 'Mid-shift and departure',
    escalationContact: 'Quext Operations Desk (888-555-7839)',
    assignedTechName: 'Austin Ricks',
    assignedTechEmail: 'austin.ricks@onequext.com',
    dispatchedAt: '2026-10-24T10:02:00Z',
    dispatchedMessageId: 'gmail-sample-849201',
  },
];

export const loadSubmissions = (): GoogleFormSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveSubmissions(INITIAL_SUBMISSIONS);
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load submissions from localStorage:', err);
    return INITIAL_SUBMISSIONS;
  }
};

export const saveSubmissions = (submissions: GoogleFormSubmission[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    // Dispatch local storage event for reactive UI updates across tabs/components
    window.dispatchEvent(new Event('quext_sow_submissions_updated'));
  } catch (err) {
    console.error('Failed to save submissions to localStorage:', err);
  }
};

export const addSubmission = (
  submissionData: Partial<GoogleFormSubmission>
): GoogleFormSubmission => {
  const current = loadSubmissions();
  const newSubmission: GoogleFormSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    submittedAt: new Date().toISOString(),
    source: submissionData.source || 'webhook',
    status: 'new',
    communityName: submissionData.communityName || 'Unnamed Community',
    workSiteAddress: submissionData.workSiteAddress || 'Address Pending',
    datePrepared: submissionData.datePrepared || new Date().toISOString().split('T')[0],
    installDate: submissionData.installDate || 'TBD',
    preparedBy: submissionData.preparedBy || 'Quext Field Operations',
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
    primaryContactMethod: submissionData.primaryContactMethod || 'Cell Phone / Text',
    backupContactMethod: submissionData.backupContactMethod || 'Email',
    checkInFrequency:
      submissionData.checkInFrequency || 'Upon site arrival and before leaving site',
    escalationContact: submissionData.escalationContact || 'Quext Operations Desk (888-555-QXT)',
    ...submissionData,
  };

  const updated = [newSubmission, ...current];
  saveSubmissions(updated);
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
  return updatedItem;
};

export const deleteSubmission = (id: string): void => {
  const current = loadSubmissions();
  const filtered = current.filter((s) => s.id !== id);
  saveSubmissions(filtered);
};

export const buildFieldTechEmailHtml = (
  submission: GoogleFormSubmission,
  tech: FieldTechContact,
  customNotes?: string
): string => {
  const products: string[] = [];
  if (submission.unitLocksIssue) products.push('Unit Locks');
  if (submission.accessControlIssue) products.push('Access Control');
  if (submission.camerasIssue) products.push('Security Cameras');
  if (submission.residentWifiIssue || submission.communityWifiIssue) products.push('Wi-Fi Infrastructure');
  if (submission.thermostatsIssue) products.push('Smart Thermostats');
  if (submission.leakSensorsIssue) products.push('IoT Leak Sensors');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
      <h2 style="color: #1b365d; margin-top: 0; margin-bottom: 8px;">Scope of Work (SOW) Work Order Dispatch</h2>
      <p style="margin-top: 0; color: #64748b; font-size: 14px;">Reference: <strong>${submission.sowReferenceNumber}</strong></p>
      
      <p>Hello <strong>${tech.name}</strong>,</p>
      <p>A new technical installation work order has been generated from the Google Form request and is ready for your onsite visit.</p>
      
      ${
        customNotes
          ? `
        <div style="background-color: #f1f5f9; border-left: 4px solid #01c38d; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
          <strong style="color: #0f172a;">Dispatcher Note:</strong>
          <div style="margin-top: 4px; font-size: 14px;">${customNotes}</div>
        </div>
      `
          : ''
      }

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 18px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1b365d; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Site Summary</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 8px; color: #64748b; width: 140px;">Community:</td>
            <td style="padding: 4px 8px; font-weight: 600; color: #0f172a;">${submission.communityName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; color: #64748b;">Address:</td>
            <td style="padding: 4px 8px;">${submission.workSiteAddress}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; color: #64748b;">Install Date:</td>
            <td style="padding: 4px 8px; font-weight: 600; color: #0369a1;">${submission.installDate}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; color: #64748b;">Site POC:</td>
            <td style="padding: 4px 8px;">${submission.pocName} (${submission.pocTitle}) • <a href="tel:${submission.pocPhone}" style="color: #0284c7;">${submission.pocPhone}</a></td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; color: #64748b;">Impacted Systems:</td>
            <td style="padding: 4px 8px; font-weight: 500;">${products.join(', ') || 'General IoT Maintenance'}</td>
          </tr>
          ${
            submission.equipmentNeedsShipping === 'Yes'
              ? `
            <tr>
              <td style="padding: 4px 8px; color: #b45309; font-weight: 600;">Hardware Shipped:</td>
              <td style="padding: 4px 8px; color: #b45309;">${submission.equipmentToShip || 'Yes'} (${submission.shippingMethod || 'Ground'})</td>
            </tr>
          `
              : ''
          }
        </table>
      </div>

      <p style="font-size: 14px;">
        📎 <strong>Attached:</strong> Complete filled <strong>OneQuext Scope of Work (SOW) 2-page PDF</strong> with full equipment scope, technician guidelines, onsite communication protocols, and sign-off pages.
      </p>

      <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
        Please review the attached SOW prior to site arrival and ensure all post-installation photos and serial numbers are captured during walkthrough.
      </p>
    </div>
  `;
};

/**
 * Sends the SOW document directly to the assigned Field Tech via Gmail API
 * with the generated 2-page PDF attached.
 */
export const dispatchSowEmailToTech = async ({
  submissionId,
  tech,
  customNotes,
}: {
  submissionId: string;
  tech: FieldTechContact;
  customNotes?: string;
}): Promise<{ success: boolean; messageId?: string; fallback?: boolean }> => {
  const submissions = loadSubmissions();
  const sub = submissions.find((s) => s.id === submissionId);
  if (!sub) throw new Error('Submission not found');

  const pdfBase64 = getSowPdfBase64(sub);
  const pdfFilename = `OneQuext_SOW_${sub.communityName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${sub.installDate || 'Visit'}.pdf`;

  const subject = `[SOW Work Order] ${sub.communityName} - ${sub.installDate || 'Field Visit'} (${sub.sowReferenceNumber})`;
  const htmlBody = buildFieldTechEmailHtml(sub, tech, customNotes);

  try {
    const token = await getAccessToken();
    if (!token) {
      // Fallback: If Gmail not authenticated in current session, trigger PDF download
      // and update status so user can attach via local mail client
      downloadSowPdf(sub);
      updateSubmission(submissionId, {
        status: 'sent_to_tech',
        assignedTechName: tech.name,
        assignedTechEmail: tech.email,
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
    // Allow user to download PDF directly
    downloadSowPdf(sub);
    updateSubmission(submissionId, {
      status: 'sent_to_tech',
      assignedTechName: tech.name,
      assignedTechEmail: tech.email,
      dispatchedAt: new Date().toISOString(),
      dispatchedMessageId: 'manual-dispatch',
    });
    return { success: true, fallback: true };
  }
};

/**
 * Returns the copy-paste Google Apps Script code to install into the Google Form
 * or its connected Google Sheet.
 */
export const getGoogleAppsScriptWebhookCode = (webhookUrl: string): string => {
  return `/**
 * Google Apps Script for: Onsite Visit Scheduling and SOW Information Form
 * URL: https://docs.google.com/forms/d/1JOuBltR4J6wDwXOzv3ZuK5pFS_SI9xSslgCRCR3iUSM/edit
 *
 * HOW TO INSTALL IN 60 SECONDS:
 * 1. Open your Google Form in Google Drive
 * 2. Click the three dots icon (More) in the top-right -> Select "Script editor"
 * 3. Delete any default code in Code.gs, paste this entire script, and click "Save" (disk icon)
 * 4. Click the Clock icon (Triggers) on the left sidebar
 * 5. Click "+ Add Trigger" (bottom right):
 *    - Choose which function to run: onFormSubmit
 *    - Select event source: "From form"
 *    - Select event type: "On form submit"
 * 6. Click Save and authorize permissions. Done!
 */

const WEBHOOK_URL = "${webhookUrl}";

function onFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    // Map responses by Question Title
    const data = {
      submittedAt: formResponse.getTimestamp().toISOString(),
      source: "google_form",
      sowReferenceNumber: "SOW-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000) + "-QXT"
    };

    for (let i = 0; i < itemResponses.length; i++) {
      const itemResponse = itemResponses[i];
      const title = itemResponse.getItem().getTitle().trim();
      const answer = itemResponse.getResponse();

      if (title.indexOf("Community / Site Name") !== -1) data.communityName = answer;
      else if (title.indexOf("Work Site Address") !== -1) data.workSiteAddress = answer;
      else if (title.indexOf("Date Prepared") !== -1) data.datePrepared = answer;
      else if (title.indexOf("Install Date") !== -1) data.installDate = answer;
      else if (title.indexOf("POC Name") !== -1 && title.indexOf("Shipping") === -1) data.pocName = answer;
      else if (title.indexOf("POC Title") !== -1) data.pocTitle = answer;
      else if (title.indexOf("POC Phone Number") !== -1 && title.indexOf("Shipping") === -1) data.pocPhone = answer;
      else if (title.indexOf("POC Email Address") !== -1 && title.indexOf("Shipping") === -1) data.pocEmail = answer;
      else if (title.indexOf("Alternate Contact") !== -1) data.alternateContact = answer;
      else if (title.indexOf("Unit Locks Issue") !== -1) data.unitLocksIssue = answer;
      else if (title.indexOf("Access Control Issue") !== -1) data.accessControlIssue = answer;
      else if (title.indexOf("Cameras Issue") !== -1) data.camerasIssue = answer;
      else if (title.indexOf("Resident Wifi Issue") !== -1) data.residentWifiIssue = answer;
      else if (title.indexOf("Community Wifi Issue") !== -1) data.communityWifiIssue = answer;
      else if (title.indexOf("Staff Wifi Issue") !== -1) data.staffWifiIssue = answer;
      else if (title.indexOf("Thermostats Issue") !== -1) data.thermostatsIssue = answer;
      else if (title.indexOf("Leak Sensors Issue") !== -1) data.leakSensorsIssue = answer;
      else if (title.indexOf("Will any equipment need to be shipped") !== -1) data.equipmentNeedsShipping = answer;
      else if (title.indexOf("Equipment to be shipped") !== -1) data.equipmentToShip = answer;
      else if (title.indexOf("What equipment will be needed") !== -1) data.equipmentQuantityAndLocation = answer;
      else if (title.indexOf("Shipping Recipient Name") !== -1) data.shippingRecipient = answer;
      else if (title.indexOf("Shipping Phone Number") !== -1) data.shippingPhone = answer;
      else if (title.indexOf("Shipping Email Address") !== -1) data.shippingEmail = answer;
      else if (title.indexOf("Shipping method") !== -1) data.shippingMethod = answer;
    }

    // Send payload to OneQuext SOW App Webhook
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("SOW Webhook response: " + response.getContentText());

  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
  }
}
`;
};

/**
 * Returns standalone Google Apps Script that runs 100% inside Google Cloud
 * and directly creates the PDF & emails it via GmailApp to the Field Tech
 * without needing any local server!
 */
export const getGoogleAppsScriptDirectEmailCode = (defaultTechEmail: string): string => {
  return `/**
 * Standalone Google Cloud Automation (Zero server required)
 * Form: Onsite Visit Scheduling and SOW Information Form
 * URL: https://docs.google.com/forms/d/1JOuBltR4J6wDwXOzv3ZuK5pFS_SI9xSslgCRCR3iUSM/edit
 *
 * This script runs automatically in Google Cloud 24/7 whenever the form is submitted.
 * It builds the OneQuext SOW HTML, compiles it into a PDF, and emails it
 * directly to the Field Tech via Gmail!
 */

const DEFAULT_DISPATCH_TECH_EMAIL = "${defaultTechEmail}";

function onFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    const d = {
      submittedAt: formResponse.getTimestamp().toLocaleString(),
      sowRef: "SOW-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000) + "-QXT"
    };

    for (let i = 0; i < itemResponses.length; i++) {
      const item = itemResponses[i];
      const title = item.getItem().getTitle().trim();
      const ans = item.getResponse() || "";

      if (title.indexOf("Community / Site Name") !== -1) d.communityName = ans;
      else if (title.indexOf("Work Site Address") !== -1) d.workSiteAddress = ans;
      else if (title.indexOf("Date Prepared") !== -1) d.datePrepared = ans;
      else if (title.indexOf("Install Date") !== -1) d.installDate = ans;
      else if (title.indexOf("POC Name") !== -1 && title.indexOf("Shipping") === -1) d.pocName = ans;
      else if (title.indexOf("POC Title") !== -1) d.pocTitle = ans;
      else if (title.indexOf("POC Phone Number") !== -1 && title.indexOf("Shipping") === -1) d.pocPhone = ans;
      else if (title.indexOf("POC Email Address") !== -1 && title.indexOf("Shipping") === -1) d.pocEmail = ans;
      else if (title.indexOf("Alternate Contact") !== -1) d.alternateContact = ans;
      else if (title.indexOf("Unit Locks Issue") !== -1) d.unitLocks = ans;
      else if (title.indexOf("Access Control Issue") !== -1) d.accessControl = ans;
      else if (title.indexOf("Cameras Issue") !== -1) d.cameras = ans;
      else if (title.indexOf("Resident Wifi Issue") !== -1) d.residentWifi = ans;
      else if (title.indexOf("Community Wifi Issue") !== -1) d.communityWifi = ans;
      else if (title.indexOf("Staff Wifi Issue") !== -1) d.staffWifi = ans;
      else if (title.indexOf("Thermostats Issue") !== -1) d.thermostats = ans;
      else if (title.indexOf("Leak Sensors Issue") !== -1) d.leakSensors = ans;
      else if (title.indexOf("Will any equipment need to be shipped") !== -1) d.needsShipping = ans;
      else if (title.indexOf("Equipment to be shipped") !== -1) d.equipmentToShip = ans;
      else if (title.indexOf("What equipment will be needed") !== -1) d.shippingDetails = ans;
      else if (title.indexOf("Shipping Recipient Name") !== -1) d.shippingRecipient = ans;
      else if (title.indexOf("Shipping Phone Number") !== -1) d.shippingPhone = ans;
      else if (title.indexOf("Shipping Email Address") !== -1) d.shippingEmail = ans;
      else if (title.indexOf("Shipping method") !== -1) d.shippingMethod = ans;
    }

    // Build the OneQuext Scope of Work HTML matching the PDF format
    const html = \`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #1e293b; padding: 24px; font-size: 11px; }
          .title { text-align: center; color: #1b365d; font-size: 18px; font-weight: bold; margin-bottom: 2px; }
          .sub { text-align: center; color: #64748b; font-style: italic; font-size: 11px; margin-bottom: 12px; }
          .navy-bar { border-top: 3px solid #1b365d; margin-bottom: 12px; }
          .section-title { color: #1b365d; font-weight: bold; font-size: 11px; margin-top: 14px; margin-bottom: 4px; border-bottom: 1px solid #334155; padding-bottom: 2px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          td { border: 1px solid #bccadb; padding: 5px 8px; font-size: 10.5px; }
          td.label { background-color: #e0e9f3; font-weight: bold; color: #1b365d; width: 160px; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="title">OneQuext SCOPE OF WORK (SOW)</div>
        <div class="sub">Technical Installation & Site Work Order</div>
        <div class="navy-bar"></div>

        <table>
          <tr><td class="label">SOW Reference #:</td><td>\${d.sowRef}</td></tr>
          <tr><td class="label">Date Prepared:</td><td>\${d.datePrepared || d.submittedAt}</td></tr>
          <tr><td class="label">Prepared By:</td><td>Quext Field Operations & Google Form Intake</td></tr>
        </table>

        <div class="section-title">SITE & PROJECT IDENTIFICATION</div>
        <table>
          <tr><td class="label">Community / Site Name:</td><td><strong>\${d.communityName || '—'}</strong></td></tr>
          <tr><td class="label">Work Site Address:</td><td>\${d.workSiteAddress || '—'}</td></tr>
          <tr><td class="label">Install Date:</td><td><strong>\${d.installDate || 'Pending Tech Schedule'}</strong></td></tr>
        </table>

        <div class="section-title">POINT OF CONTACT (POC)</div>
        <table>
          <tr><td class="label">POC Name:</td><td>\${d.pocName || '—'}</td></tr>
          <tr><td class="label">POC Title / Role:</td><td>\${d.pocTitle || 'Site Contact'}</td></tr>
          <tr><td class="label">POC Phone Number:</td><td>\${d.pocPhone || '—'}</td></tr>
          <tr><td class="label">POC Email Address:</td><td>\${d.pocEmail || '—'}</td></tr>
          <tr><td class="label">Alternate Contact:</td><td>\${d.alternateContact || 'None'}</td></tr>
        </table>

        <div class="section-title">EQUIPMENT OVERVIEW & SCOPE OF WORK</div>
        <table>
          \${d.unitLocks ? '<tr><td class="label">Unit Locks Scope:</td><td>' + d.unitLocks + '</td></tr>' : ''}
          \${d.accessControl ? '<tr><td class="label">Access Control Scope:</td><td>' + d.accessControl + '</td></tr>' : ''}
          \${d.cameras ? '<tr><td class="label">Security Cameras:</td><td>' + d.cameras + '</td></tr>' : ''}
          \${d.residentWifi ? '<tr><td class="label">Resident Wi-Fi:</td><td>' + d.residentWifi + '</td></tr>' : ''}
          \${d.communityWifi ? '<tr><td class="label">Community Wi-Fi:</td><td>' + d.communityWifi + '</td></tr>' : ''}
          \${d.staffWifi ? '<tr><td class="label">Staff Wi-Fi:</td><td>' + d.staffWifi + '</td></tr>' : ''}
          \${d.thermostats ? '<tr><td class="label">Thermostats:</td><td>' + d.thermostats + '</td></tr>' : ''}
          \${d.leakSensors ? '<tr><td class="label">Leak Sensors:</td><td>' + d.leakSensors + '</td></tr>' : ''}
          \${d.needsShipping === 'Yes' ? '<tr><td class="label">Equipment to Ship:</td><td>' + (d.equipmentToShip || '') + ' (' + (d.shippingMethod || 'Ground') + ')<br>Details: ' + (d.shippingDetails || '') + '</td></tr>' : ''}
        </table>

        <div class="page-break"></div>

        <div class="section-title" style="margin-top:0;">COMMUNICATION METHOD WHILE ONSITE</div>
        <p>Indicate how the on-site technician(s) should communicate with the project team, POC, and/or support desk during the engagement.</p>
        <table>
          <tr><td class="label">Primary Contact Method:</td><td>Cell Phone & Text/SMS</td></tr>
          <tr><td class="label">Backup Contact Method:</td><td>Email to Site POC</td></tr>
          <tr><td class="label">Check-in Frequency:</td><td>Upon site arrival and before leaving site</td></tr>
          <tr><td class="label">Escalation Contact:</td><td>Quext Dispatch Desk (888-555-7839) & \${d.pocName || 'POC'}</td></tr>
        </table>

        <div class="section-title">DOCUMENTATION REQUIREMENTS</div>
        <ol style="padding-left: 18px; line-height: 1.5;">
          <li>Pre-Installation Documentation: Complete photos of initial hardware and wiring before disassembly.</li>
          <li>Device Asset Tracking: Accurately record all replaced MAC addresses and serial numbers.</li>
          <li>Functional Testing: Verify live telemetry on the OneQuext Cloud Dashboard for all serviced units.</li>
          <li>Tenant Respect: Clean and remove all wire trimmings and packaging prior to departure.</li>
        </ol>

        <div class="section-title">APPROVAL / SIGN-OFF</div>
        <table>
          <tr><td class="label">Technician Name / Signature:</td><td>&nbsp;</td></tr>
          <tr><td class="label">Date:</td><td>&nbsp;</td></tr>
          <tr><td class="label">POC Name / Signature:</td><td>\${d.pocName || ''}</td></tr>
          <tr><td class="label">Date:</td><td>&nbsp;</td></tr>
        </table>
      </body>
      </html>
    \`;

    // Convert HTML to PDF blob
    const pdfBlob = Utilities.newBlob(html, "text/html", "OneQuext_SOW_" + (d.communityName || "Site").replace(/\\s+/g, "_") + ".html")
      .getAs("application/pdf")
      .setName("OneQuext_SOW_" + (d.communityName || "Site").replace(/\\s+/g, "_") + ".pdf");

    // Email to Field Tech with PDF attached
    const techEmail = DEFAULT_DISPATCH_TECH_EMAIL;
    const emailSubject = "[SOW Dispatch] " + (d.communityName || "New Site") + " - Installation Work Order (" + d.sowRef + ")";
    const emailBody = "Hello Field Tech,\\n\\nA new OneQuext Scope of Work (SOW) has been submitted and generated for " + d.communityName + ".\\n\\nInstall Date: " + (d.installDate || "TBD") + "\\nSite Address: " + d.workSiteAddress + "\\nPOC: " + d.pocName + " (" + d.pocPhone + ")\\n\\nPlease find the complete 2-page SOW Work Order PDF attached ready for your onsite visit.\\n\\nQuext Field Operations Team";

    GmailApp.sendEmail(techEmail, emailSubject, emailBody, {
      name: "Quext Dispatch Automation",
      attachments: [pdfBlob]
    });

    Logger.log("SOW PDF successfully emailed to " + techEmail);

  } catch (err) {
    Logger.log("Error in onFormSubmit: " + err.toString());
  }
}
`;
};
