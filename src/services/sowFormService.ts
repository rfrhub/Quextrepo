import { GoogleFormSubmission, FieldTechContact } from '../types/sowForm';
import { sendRealGmailEmail, getAccessToken } from './gmailService';
import { getSowPdfBase64, downloadSowPdf } from '../utils/generateSowPdf';

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

export const loadSubmissions = (): GoogleFormSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out any legacy fake sample submissions
    return parsed.filter(
      (s) => s && s.id !== 'sub-sample-1' && s.id !== 'sub-sample-2'
    );
  } catch (err) {
    console.error('Failed to load SOW submissions from localStorage:', err);
    return [];
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

export const buildPartnerVendorPlainTextEmail = (
  submission: GoogleFormSubmission,
  recipientName: string,
  customNotes?: string
): { subject: string; body: string } => {
  const subject = `[OneQuext SOW Work Order] ${submission.communityName} — Onsite Visit & Scope of Work (${submission.sowReferenceNumber})`;

  const scopeLines: string[] = [];
  if (submission.unitLocksIssue) {
    scopeLines.push(`• Unit Locks (Devices & Issue): ${submission.unitLocksIssue}`);
  }
  if (submission.accessControlIssue) {
    scopeLines.push(`• Access Control (Devices & Issue): ${submission.accessControlIssue}`);
  }
  if (submission.camerasIssue) {
    scopeLines.push(`• Cameras (Devices & Issue): ${submission.camerasIssue}`);
  }
  if (submission.residentWifiIssue) {
    scopeLines.push(`• Resident Wi-Fi (Devices & Issue): ${submission.residentWifiIssue}`);
  }
  if (submission.communityWifiIssue) {
    scopeLines.push(`• Community Wi-Fi (Devices & Issue): ${submission.communityWifiIssue}`);
  }
  if (submission.staffWifiIssue) {
    scopeLines.push(`• Staff Wi-Fi (Devices & Issue): ${submission.staffWifiIssue}`);
  }
  if (submission.thermostatsIssue) {
    scopeLines.push(`• Thermostats (Devices & Issue): ${submission.thermostatsIssue}`);
  }
  if (submission.leakSensorsIssue) {
    scopeLines.push(`• Leak Sensors (Devices & Issue): ${submission.leakSensorsIssue}`);
  }
  if (scopeLines.length === 0) {
    scopeLines.push('• General Onsite Diagnostics & System Verification');
  }

  const shippingBlock =
    submission.equipmentNeedsShipping === 'Yes'
      ? [
          '',
          'EQUIPMENT TO BE SHIPPED:',
          `• Equipment Needed, Quantity & Install Location: ${
            submission.equipmentQuantityAndLocation || submission.equipmentToShip || 'See attached SOW'
          }`,
          `• Shipping Recipient Name: ${
            submission.shippingRecipient || `${submission.pocName} (Same as Site POC)`
          }`,
          `• Shipping Phone Number: ${
            submission.shippingPhone || `${submission.pocPhone} (Same as Site POC)`
          }`,
          `• Shipping Email Address: ${
            submission.shippingEmail || `${submission.pocEmail} (Same as Site POC)`
          }`,
          `• Shipping Method: ${submission.shippingMethod || 'Ground'}`,
        ].join('\n')
      : '\nEQUIPMENT TO BE SHIPPED:\n• No additional equipment shipment required.';

  const notesBlock = customNotes?.trim()
    ? `\nADDITIONAL DISPATCH NOTES / INSTRUCTIONS:\n${customNotes.trim()}\n`
    : '';

  const body = [
    `Hello ${recipientName || 'Partner Integrator / Vendor Team'},`,
    '',
    `Please find below the official OneQuext Scope of Work (SOW) and onsite visit scheduling details for ${submission.communityName}. The formatted 2-page SOW PDF work order is also generated and ready for your technician's onsite visit.`,
    notesBlock,
    '==================================================',
    'ONEQUEXT SCOPE OF WORK (SOW) & ONSITE VISIT DETAILS',
    '==================================================',
    `SOW Reference #: ${submission.sowReferenceNumber}`,
    `1. Community / Site Name: ${submission.communityName}`,
    `2. Work Site Address: ${submission.workSiteAddress}`,
    `3. Date Prepared: ${submission.datePrepared}`,
    `4. Requested Install / Visit Date: ${submission.installDate || 'TBD'}`,
    '',
    'SITE POINT OF CONTACT (POC):',
    `5. POC Name: ${submission.pocName}`,
    `6. POC Title / Role: ${submission.pocTitle || 'Site Contact'}`,
    `7. POC Phone Number: ${submission.pocPhone}`,
    `8. POC Email Address: ${submission.pocEmail}`,
    `9. Alternate Contact: ${submission.alternateContact || 'None provided'}`,
    '',
    'DEVICE NAMES & ISSUE DESCRIPTIONS (SCOPE OF WORK):',
    ...scopeLines,
    shippingBlock,
    '',
    'ONSITE DOCUMENTATION & SIGN-OFF REQUIREMENTS:',
    '1. Check in with the Site POC upon arrival and prior to departure.',
    '2. Capture pre- and post-service photos and record any replaced serial/MAC numbers.',
    '3. Verify online telemetry in the Quext portal and obtain POC walkthrough sign-off.',
    '',
    'Thank you,',
    `${submission.preparedBy || 'Quext Customer Success Team'}`,
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
  const scopeRowsHtml: string[] = [];
  const addRow = (label: string, val?: string) => {
    if (!val || !val.trim()) return;
    scopeRowsHtml.push(`
      <tr>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; background-color: #f1f5f9; font-weight: 700; color: #1b365d; width: 210px; vertical-align: top;">${label}</td>
        <td style="padding: 8px 10px; border: 1px solid #cbd5e1; color: #0f172a; white-space: pre-wrap;">${val}</td>
      </tr>
    `);
  };

  addRow('10. Unit Locks Issue & Devices', submission.unitLocksIssue);
  addRow('11. Access Control Issue & Devices', submission.accessControlIssue);
  addRow('12. Cameras Issue & Devices', submission.camerasIssue);
  addRow('13. Resident Wi-Fi Issue & Devices', submission.residentWifiIssue);
  addRow('14. Community Wi-Fi Issue & Devices', submission.communityWifiIssue);
  addRow('15. Staff Wi-Fi Issue & Devices', submission.staffWifiIssue);
  addRow('16. Thermostats Issue & Devices', submission.thermostatsIssue);
  addRow('17. Leak Sensors Issue & Devices', submission.leakSensorsIssue);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 720px;">
      <div style="background-color: #1b365d; color: #ffffff; padding: 18px 22px; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 18px;">OneQuext Scope of Work (SOW) — Partner / Vendor Work Order</h2>
        <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 13px;">Reference: <strong>${submission.sowReferenceNumber}</strong> • Prepared: ${submission.datePrepared}</p>
      </div>

      <div style="border: 1px solid #e2e8f0; border-top: none; padding: 20px 22px; border-radius: 0 0 10px 10px; background-color: #ffffff;">
        <p style="margin-top: 0;">Hello <strong>${tech.name || 'Partner Integrator / Vendor Team'}</strong>,</p>
        <p>Please find below the complete <strong>Onsite Visit Scheduling and Scope of Work (SOW)</strong> for <strong>${submission.communityName}</strong>. The official 2-page OneQuext SOW PDF is also attached to this email.</p>

        ${
          customNotes
            ? `
          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
            <strong style="color: #065f46;">Additional CSM / Dispatch Notes:</strong>
            <div style="margin-top: 4px; font-size: 14px; color: #064e3b; white-space: pre-wrap;">${customNotes}</div>
          </div>
        `
            : ''
        }

        <h4 style="margin: 18px 0 8px 0; color: #1b365d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #1b365d; padding-bottom: 4px;">1. Site &amp; Point of Contact (POC) Information</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700; width: 210px;">1. Community / Site Name</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; font-weight: 700;">${submission.communityName}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">2. Work Site Address</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.workSiteAddress}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">3. Date Prepared</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.datePrepared}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">4. Install / Visit Date</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; font-weight: 700; color: #0f766e;">${submission.installDate || 'TBD'}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">5. POC Name</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.pocName}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">6. POC Title / Role</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.pocTitle || 'Site Contact'}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">7. POC Phone Number</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.pocPhone}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">8. POC Email Address</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.pocEmail}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">9. Alternate Contact</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.alternateContact || 'None provided'}</td>
          </tr>
        </table>

        <h4 style="margin: 18px 0 8px 0; color: #1b365d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #1b365d; padding-bottom: 4px;">2. Scope of Work — Device Names &amp; Issue Descriptions</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
          ${
            scopeRowsHtml.length > 0
              ? scopeRowsHtml.join('')
              : `<tr><td style="padding: 10px; border: 1px solid #cbd5e1;">Standard onsite system diagnostics and verification.</td></tr>`
          }
        </table>

        <h4 style="margin: 18px 0 8px 0; color: #1b365d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #1b365d; padding-bottom: 4px;">3. Equipment Shipping Details</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
          <tr>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700; width: 210px;">18. Equipment Needs Shipping?</td>
            <td style="padding: 7px 10px; border: 1px solid #cbd5e1; font-weight: 700;">${submission.equipmentNeedsShipping}</td>
          </tr>
          ${
            submission.equipmentNeedsShipping === 'Yes'
              ? `
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">19. Equipment, Qty &amp; Location</td>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1; white-space: pre-wrap;">${submission.equipmentQuantityAndLocation || submission.equipmentToShip || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">20. Shipping Recipient Name</td>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.shippingRecipient || `${submission.pocName} (Same as Site POC)`}</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">21. Shipping Phone Number</td>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.shippingPhone || `${submission.pocPhone} (Same as Site POC)`}</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">22. Shipping Email Address</td>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1;">${submission.shippingEmail || `${submission.pocEmail} (Same as Site POC)`}</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1; background-color: #f8fafc; font-weight: 700;">23. Shipping Method</td>
              <td style="padding: 7px 10px; border: 1px solid #cbd5e1; font-weight: 700;">${submission.shippingMethod || 'Ground'}</td>
            </tr>
          `
              : ''
          }
        </table>

        <p style="font-size: 13px; color: #334155; margin-top: 16px;">
          📎 <strong>Attached:</strong> Official 2-Page <strong>OneQuext Scope of Work (SOW) PDF</strong> with onsite communication protocols, documentation requirements, and walkthrough sign-off blocks.
        </p>
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
