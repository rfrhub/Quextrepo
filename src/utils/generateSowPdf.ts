import { jsPDF } from 'jspdf';
import { GoogleFormSubmission } from '../types/sowForm';

/**
 * Generates a pixel-perfect 2-page PDF document matching the OneQuext SOW template
 * exactly as attached.
 */
export const createSowPdfDocument = (submission: GoogleFormSubmission): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter', // 612 x 792 pt
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 36;
  const contentWidth = pageWidth - margin * 2; // 540 pt

  // Color constants matching the provided PDF
  const NAVY = [27, 54, 93]; // Primary deep navy: #1B365D
  const LIGHT_HEADER_BG = [224, 233, 243]; // Table header light gray-blue: #E0E9F3
  const BORDER_COLOR = [188, 202, 219]; // Table line border: #BCCADB
  const DARK_TEXT = [30, 41, 59]; // Body text: #1E293B
  const SECTION_LINE = [30, 41, 59]; // Section divider line

  // Helper: Draw 2-column table
  const drawTwoColumnTable = (
    startY: number,
    rows: { label: string; value: string; minHeight?: number }[],
    col1Width = 140
  ): number => {
    let currentY = startY;
    const col2Width = contentWidth - col1Width;

    rows.forEach((row) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      // Calculate wrapped lines for value
      const valText = row.value || '—';
      const lines = doc.splitTextToSize(valText, col2Width - 14);
      const calculatedHeight = Math.max(row.minHeight || 17, lines.length * 10 + 7);

      // Background for Col 1
      doc.setFillColor(LIGHT_HEADER_BG[0], LIGHT_HEADER_BG[1], LIGHT_HEADER_BG[2]);
      doc.rect(margin, currentY, col1Width, calculatedHeight, 'F');

      // Col 1 Border
      doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
      doc.setLineWidth(0.75);
      doc.rect(margin, currentY, col1Width, calculatedHeight, 'S');

      // Col 2 Border
      doc.rect(margin + col1Width, currentY, col2Width, calculatedHeight, 'S');

      // Col 1 Label
      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(row.label, margin + 7, currentY + 11.5);

      // Col 2 Value
      doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(lines, margin + col1Width + 7, currentY + 11.5);

      currentY += calculatedHeight;
    });

    return currentY;
  };

  // Helper: Draw Section Header with Underline
  const drawSectionHeader = (title: string, yPos: number): number => {
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(title, margin, yPos);

    // Solid line underneath
    doc.setDrawColor(SECTION_LINE[0], SECTION_LINE[1], SECTION_LINE[2]);
    doc.setLineWidth(0.75);
    doc.line(margin, yPos + 3, margin + contentWidth, yPos + 3);

    return yPos + 10;
  };

  // Derive products list from issues
  const products: string[] = [];
  if (submission.unitLocksIssue) products.push('Unit Locks');
  if (submission.accessControlIssue) products.push('Access Control');
  if (submission.camerasIssue) products.push('Security Cameras');
  if (submission.residentWifiIssue || submission.communityWifiIssue || submission.staffWifiIssue) {
    products.push('Community & Resident Wi-Fi');
  }
  if (submission.thermostatsIssue) products.push('Smart Thermostats');
  if (submission.leakSensorsIssue) products.push('IoT Leak Sensors');
  if (products.length === 0) products.push('IoT Hardware & Access Infrastructure');

  // ==========================================
  // PAGE 1
  // ==========================================

  // 1. Header Titles
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('OneQuext SCOPE OF WORK (SOW)', pageWidth / 2, 44, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(70, 80, 95);
  doc.text('Technical Installation & Site Work Order', pageWidth / 2, 57, { align: 'center' });

  // Top Navy Divider Bar
  doc.setDrawColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.setLineWidth(2.2);
  doc.line(margin, 70, margin + contentWidth, 70);

  // 2. SOW Meta Box
  let y = 78;
  const sowMetaRows = [
    { label: 'SOW Reference #:', value: submission.sowReferenceNumber || `SOW-${new Date().getFullYear()}-${submission.id.slice(-4).toUpperCase()}` },
    { label: 'Date Prepared:', value: submission.datePrepared || new Date().toISOString().split('T')[0] },
    { label: 'Prepared By:', value: submission.preparedBy || 'Quext Field Operations & Deployment' },
  ];
  y = drawTwoColumnTable(y, sowMetaRows, 140);

  y += 15;

  // 3. SITE & PROJECT IDENTIFICATION
  y = drawSectionHeader('SITE & PROJECT IDENTIFICATION', y);
  const siteRows = [
    { label: 'Community / Site Name:', value: submission.communityName || '—' },
    { label: 'Work Site Address:', value: submission.workSiteAddress || '—' },
    { label: 'Install Date:', value: submission.installDate || 'TBD - Per Tech Dispatch' },
    { label: 'Product / Equipment:', value: products.join(', ') },
  ];
  y = drawTwoColumnTable(y, siteRows, 140);

  y += 15;

  // 4. POINT OF CONTACT (POC)
  y = drawSectionHeader('POINT OF CONTACT (POC)', y);
  const pocRows = [
    { label: 'POC Name:', value: submission.pocName || '—' },
    { label: 'POC Title / Role:', value: submission.pocTitle || 'Site Contact' },
    { label: 'POC Phone Number:', value: submission.pocPhone || '—' },
    { label: 'POC Email Address:', value: submission.pocEmail || '—' },
    { label: 'Alternate Contact:', value: submission.alternateContact || 'None specified' },
  ];
  y = drawTwoColumnTable(y, pocRows, 140);

  y += 15;

  // 5. PROJECT OVERVIEW
  y = drawSectionHeader('PROJECT OVERVIEW', y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);

  const overviewText = `Field service deployment for ${submission.communityName || 'the property'} scheduled for ${
    submission.installDate || 'the requested installation window'
  }. The certified field technician will conduct targeted onsite diagnostics, hardware installation, firmware provisioning, and cloud gateway verification for reported systems.`;

  const overviewLines = doc.splitTextToSize(overviewText, contentWidth);
  doc.text(overviewLines, margin, y + 5);
  y += overviewLines.length * 9.5 + 8;

  // Equipment Sub-line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('Equipment:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);
  doc.text(products.join('  •  '), margin + 55, y);

  y += 14;

  // 6. EQUIPMENT OVERVIEW & SCOPE OF WORK
  y = drawSectionHeader('EQUIPMENT OVERVIEW & SCOPE OF WORK', y);

  // Group issue items into clean structured items
  const scopeRows: { label: string; value: string }[] = [];

  if (submission.unitLocksIssue) {
    scopeRows.push({ label: 'Unit Locks Scope:', value: submission.unitLocksIssue });
  }
  if (submission.accessControlIssue) {
    scopeRows.push({ label: 'Access Control Scope:', value: submission.accessControlIssue });
  }
  if (submission.camerasIssue) {
    scopeRows.push({ label: 'Security Cameras Scope:', value: submission.camerasIssue });
  }
  if (submission.residentWifiIssue) {
    scopeRows.push({ label: 'Resident Wi-Fi Scope:', value: submission.residentWifiIssue });
  }
  if (submission.communityWifiIssue) {
    scopeRows.push({ label: 'Community Wi-Fi Scope:', value: submission.communityWifiIssue });
  }
  if (submission.staffWifiIssue) {
    scopeRows.push({ label: 'Staff Wi-Fi Scope:', value: submission.staffWifiIssue });
  }
  if (submission.thermostatsIssue) {
    scopeRows.push({ label: 'Thermostats Scope:', value: submission.thermostatsIssue });
  }
  if (submission.leakSensorsIssue) {
    scopeRows.push({ label: 'Leak Sensors Scope:', value: submission.leakSensorsIssue });
  }

  // If equipment shipping was specified
  if (submission.equipmentNeedsShipping === 'Yes') {
    let shipVal = `Parts to ship: ${submission.equipmentToShip || 'Standard replenishment kit'}\nQuantity & Locations: ${
      submission.equipmentQuantityAndLocation || 'Per site ticket specs'
    }\nShipping Method: ${submission.shippingMethod || 'Ground'} | Recipient: ${
      submission.shippingRecipient || submission.pocName || 'Site POC'
    } (${submission.shippingPhone || submission.pocPhone || '—'})`;
    scopeRows.push({ label: 'Equipment Shipping:', value: shipVal });
  }

  if (scopeRows.length === 0) {
    scopeRows.push({
      label: 'Standard Installation:',
      value: 'Perform full system check, diagnose offline devices, and verify RF mesh signal integrity.',
    });
  }

  y = drawTwoColumnTable(y, scopeRows, 140);

  // Bottom footer page 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 150, 165);
  doc.text('OneQuext Technical Scope of Work  |  Confidential & Proprietary', margin, pageHeight - 20);
  doc.text('Page 1 of 2', pageWidth - margin - 40, pageHeight - 20);

  // ==========================================
  // PAGE 2
  // ==========================================
  doc.addPage();

  let y2 = 44;

  // 1. COMMUNICATION METHOD WHILE ONSITE
  y2 = drawSectionHeader('COMMUNICATION METHOD WHILE ONSITE', y2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);
  doc.text(
    'Indicate how the on-site technician(s) should communicate with the project team, POC, and/or support desk during the engagement.',
    margin,
    y2 + 6
  );
  y2 += 18;

  // Draw Checkboxes
  const drawCheckbox = (x: number, yPos: number, label: string, isChecked: boolean) => {
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.75);
    doc.rect(x, yPos, 8, 8, 'S');

    if (isChecked) {
      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('X', x + 1.5, yPos + 6.8);
    }

    doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(label, x + 13, yPos + 6.8);
  };

  // Row 1 checkboxes
  drawCheckbox(margin, y2, 'Cell Phone', true);
  drawCheckbox(margin + 80, y2, 'Radio', false);
  drawCheckbox(margin + 150, y2, 'Email', true);
  drawCheckbox(margin + 220, y2, 'Text/SMS', true);

  y2 += 14;

  // Row 2 checkboxes
  drawCheckbox(margin, y2, 'Conferencing App (Teams/Zoom)', false);
  drawCheckbox(margin + 170, y2, 'Walkie-Talkie/Push-to-Talk', false);
  drawCheckbox(margin + 340, y2, 'Other:', false);

  y2 += 16;

  // Communication Table
  const commRows = [
    { label: 'Primary Contact Method:', value: submission.primaryContactMethod || 'Cell Phone / Direct Call' },
    { label: 'Backup Contact Method:', value: submission.backupContactMethod || 'Text/SMS & Email' },
    { label: 'Check-in Frequency:', value: submission.checkInFrequency || 'Upon site arrival, midday milestone, and prior to departure' },
    { label: 'Escalation Contact:', value: submission.escalationContact || `Quext Dispatch Operations (888-555-QXT) & ${submission.pocName || 'Site POC'}` },
  ];
  y2 = drawTwoColumnTable(y2, commRows, 140);

  y2 += 22;

  // 2. DOCUMENTATION REQUIREMENTS
  y2 = drawSectionHeader('DOCUMENTATION REQUIREMENTS', y2);

  const docRequirements = [
    '1. Pre-Installation Documentation: Complete high-resolution photos of initial unit locks, access panels, thermostat wiring, and cable terminations before initiating any disassembly.',
    '2. Device Asset Tracking: Accurately record all installed and replaced MAC addresses, serial numbers, firmware revisions, and unit numbers in the Quext Field Portal.',
    '3. Functional Testing & Validation: Verify live telemetry on the OneQuext Cloud Dashboard for every repaired or newly commissioned device (Locks, Thermostats, APs, Leak Sensors).',
    '4. Site Cleanliness & Tenant Respect: Ensure all debris, wire trimmings, and old hardware are neatly cleaned and removed from resident units and common facilities.',
    '5. Scope Change & Incident Escalation: Any deviations from the initial work order or pre-existing site damages must be documented with photos and approved by the Project Manager before proceeding.',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);

  docRequirements.forEach((req) => {
    const lines = doc.splitTextToSize(req, contentWidth);
    doc.text(lines, margin, y2 + 5);
    y2 += lines.length * 9.5 + 4;
  });

  y2 += 18;

  // 3. APPROVAL / SIGN-OFF
  y2 = drawSectionHeader('APPROVAL / SIGN-OFF', y2);

  const signoffRows = [
    { label: 'Technician Name / Signature:', value: submission.assignedTechName ? `${submission.assignedTechName}  (Pending Onsite Signature)` : ' ' },
    { label: 'Date:', value: ' ' },
    { label: 'POC Name / Signature:', value: `${submission.pocName || 'Site POC'}  (Pending Final Walkthrough Signature)` },
    { label: 'Date:', value: ' ' },
  ];
  y2 = drawTwoColumnTable(y2, signoffRows, 160);

  // Bottom footer page 2
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 150, 165);
  doc.text('OneQuext Technical Scope of Work  |  Confidential & Proprietary', margin, pageHeight - 20);
  doc.text('Page 2 of 2', pageWidth - margin - 40, pageHeight - 20);

  return doc;
};

/**
 * Downloads the SOW PDF to the user's browser
 */
export const downloadSowPdf = (submission: GoogleFormSubmission) => {
  const doc = createSowPdfDocument(submission);
  const cleanName = (submission.communityName || 'Site').replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = submission.installDate || new Date().toISOString().split('T')[0];
  doc.save(`OneQuext_SOW_${cleanName}_${dateStr}.pdf`);
};

/**
 * Generates base64 data URI string for email attachment or preview
 */
export const getSowPdfBase64 = (submission: GoogleFormSubmission): string => {
  const doc = createSowPdfDocument(submission);
  return doc.output('datauristring').split(',')[1];
};

/**
 * Generates data URI for iframe preview
 */
export const getSowPdfDataUri = (submission: GoogleFormSubmission): string => {
  const doc = createSowPdfDocument(submission);
  return doc.output('datauristring');
};
