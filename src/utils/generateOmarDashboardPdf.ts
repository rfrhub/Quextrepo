import { jsPDF } from 'jspdf';
import { OperationProject } from '../types';

/**
 * Format date string into MM/DD/YYYY short string for PDF tables
 */
function formatShortDate(dateStr?: string): string {
  if (!dateStr || dateStr === 'TBD' || dateStr.toLowerCase().includes('tbd')) return 'TBD';
  const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return `${isoMatch[2].padStart(2, '0')}/${isoMatch[3].padStart(2, '0')}/${isoMatch[1]}`;
  }
  const slashMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    return `${slashMatch[1].padStart(2, '0')}/${slashMatch[2].padStart(2, '0')}/${slashMatch[3]}`;
  }
  return dateStr.length > 10 ? dateStr.substring(0, 10) : dateStr;
}

/**
 * Generates the official 2026 Master Projects Dashboard PDF Report.
 * Modeled after the 2026 Master Projects Dashboard - Project Tracker.
 * 
 * Features:
 * - Executive Dashboard & Scorecard banner on Page 1
 * - Comprehensive multi-page landscape table across operational projects
 * - Categories: Project & Portfolio, Units & Sys, Tech / Const, Status, Implementation Dates, Project Team, Installer, SWAT Invoicing, Scope & Notes
 * - Clean running headers, footers with page numbering (Page X of Y), and Quext branding
 */
export function generateOmarDashboardPdf(
  projects: OperationProject[],
  options?: { filterLabel?: string }
): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'letter', // 792 x 612 pt
  });

  const pageWidth = 792;
  const pageHeight = 612;
  const marginX = 28;
  const contentWidth = pageWidth - marginX * 2; // 736 pt

  // Colors
  const NAVY = [15, 23, 42]; // #0F172A
  const BRAND_BLUE = [2, 132, 199]; // #0284C7
  const LIGHT_BG = [248, 250, 252]; // #F8FAFC
  const BORDER_COLOR = [226, 232, 240]; // #E2E8F0
  const TEXT_DARK = [30, 41, 59]; // #1E293B
  const TEXT_MUTED = [100, 116, 139]; // #64748B
  const GREEN = [22, 101, 52];
  const GREEN_BG = [220, 252, 231];
  const AMBER = [146, 64, 14];
  const AMBER_BG = [254, 243, 199];
  const RED = [159, 18, 57];
  const RED_BG = [255, 228, 230];

  // Statistics calculation
  const totalProjects = projects.length;
  const totalUnits = projects.reduce((sum, p) => sum + (p.unitsCount || 0), 0);
  const closedCount = projects.filter(
    (p) =>
      (p.statusTag as string) === 'Project Closed' ||
      p.milestones?.some(
        (m) =>
          (m.title === 'Project Closed' || m.title.toLowerCase().includes('closed')) &&
          m.status === 'Completed'
      )
  ).length;
  const onTrackCount = projects.filter(
    (p) =>
      (p.statusTag || 'On Track') === 'On Track' &&
      !p.milestones?.some(
        (m) =>
          (m.title === 'Project Closed' || m.title.toLowerCase().includes('closed')) &&
          m.status === 'Completed'
      )
  ).length;
  const behindCount = projects.filter((p) => p.statusTag === 'Behind Schedule').length;
  const riskCount = projects.filter((p) => p.statusTag === 'High Risk').length;
  const quextCount = projects.filter((p) => (p.platform || 'Quext') === 'Quext').length;
  const geokeyCount = projects.filter((p) => p.platform === 'Geokey').length;
  const homebaseCount = projects.filter((p) => p.platform === 'Homebase').length;
  const nfcCount = projects.filter((p) => p.useNfcWallet).length;
  const qrCount = projects.filter((p) => p.useQrIntercom).length;

  // Columns definition: Total width 736 pt
  // Removed Property POC column; Replaced timeline with Implementation Dates (Install Start & Install Complete)
  const cols = [
    { id: 'prop', label: 'PROJECT & PORTFOLIO', width: 138 },
    { id: 'units', label: 'UNITS & SYS', width: 58 },
    { id: 'tech', label: 'TECH / CONST', width: 58 },
    { id: 'status', label: 'STATUS', width: 70 },
    { id: 'impl', label: 'IMPLEMENTATION DATES', width: 94 },
    { id: 'team', label: 'PROJECT TEAM', width: 110 },
    { id: 'installer', label: 'INSTALLER', width: 70 },
    { id: 'accounting', label: 'SWAT INVOICING', width: 65 },
    { id: 'notes', label: 'SCOPE & NOTES', width: 73 },
  ];

  let currentPage = 1;

  // Helper: Draw Header Block on First Page
  const drawPage1HeaderAndScorecard = (): number => {
    // Header Bar
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(marginX, 20, contentWidth, 42, 'F');

    // Title text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('QUEXT OPERATIONS · 2026 MASTER PROJECTS DASHBOARD', marginX + 12, 37);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(186, 230, 253);
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const filterSub = options?.filterLabel
      ? `Official Executive Portfolio Report · Scope: ${options.filterLabel} · ${dateStr}`
      : `Official Executive Portfolio Report · Generated on ${dateStr}`;
    doc.text(filterSub, marginX + 12, 51);

    // Executive Badge Pill in top right (No Omar wording)
    doc.setFillColor(BRAND_BLUE[0], BRAND_BLUE[1], BRAND_BLUE[2]);
    doc.roundedRect(marginX + contentWidth - 120, 27, 108, 26, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('PORTFOLIO REPORT', marginX + contentWidth - 112, 43);

    // Scorecard Section (Row of 5 Cards)
    const cardY = 68;
    const cardHeight = 44;
    const numCards = 5;
    const cardGap = 8;
    const cardWidth = (contentWidth - cardGap * (numCards - 1)) / numCards;

    const cards = [
      {
        label: 'TOTAL PROJECTS',
        val: `${totalProjects}`,
        sub: `${totalProjects - closedCount} Active · ${closedCount} Closed`,
      },
      {
        label: 'RESIDENTIAL UNITS',
        val: `${totalUnits.toLocaleString()}`,
        sub: totalProjects > 0 ? `Avg ${Math.round(totalUnits / totalProjects)} / property` : '—',
      },
      {
        label: 'PLATFORM ECOSYSTEM',
        val: `QXT: ${quextCount} · GEO: ${geokeyCount}`,
        sub: `Homebase: ${homebaseCount}`,
      },
      {
        label: 'PROJECT HEALTH',
        val: `${onTrackCount} On Track`,
        sub: `${behindCount} Behind · ${riskCount} Risk · ${closedCount} Closed`,
      },
      {
        label: 'TECH INNOVATION',
        val: `NFC: ${nfcCount} · QR: ${qrCount}`,
        sub: 'Mobile Wallet & Intercom',
      },
    ];

    cards.forEach((card, idx) => {
      const cX = marginX + idx * (cardWidth + cardGap);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
      doc.setLineWidth(0.75);
      doc.roundedRect(cX, cardY, cardWidth, cardHeight, 3, 3, 'FD');

      // Top color strip
      doc.setFillColor(BRAND_BLUE[0], BRAND_BLUE[1], BRAND_BLUE[2]);
      doc.rect(cX, cardY, cardWidth, 2.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text(card.label, cX + 6, cardY + 12);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(card.val, cX + 6, cardY + 26);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
      doc.text(card.sub, cX + 6, cardY + 38);
    });

    return cardY + cardHeight + 10;
  };

  // Helper: Draw Running Header for Page 2+
  const drawSubsequentPageHeader = (): number => {
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(marginX, 16, contentWidth, 22, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('QUEXT OPERATIONS · 2026 MASTER PROJECTS DASHBOARD', marginX + 8, 30);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(186, 230, 253);
    const filterSub = options?.filterLabel ? `Scope: ${options.filterLabel} · ` : '';
    doc.text(`${filterSub}${totalProjects} Total Properties`, marginX + contentWidth - 175, 30);

    return 44;
  };

  // Helper: Draw Table Header
  const drawTableHeader = (startY: number): number => {
    doc.setFillColor(238, 242, 246);
    doc.rect(marginX, startY, contentWidth, 16, 'F');

    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.75);
    doc.rect(marginX, startY, contentWidth, 16, 'S');

    let currentX = marginX;
    cols.forEach((col) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.text(col.label, currentX + 3.5, startY + 11);
      currentX += col.width;
      if (currentX < marginX + contentWidth) {
        doc.line(currentX, startY, currentX, startY + 16);
      }
    });

    return startY + 16;
  };

  // Helper: Draw Footer
  const drawFooter = () => {
    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.5);
    doc.line(marginX, pageHeight - 20, marginX + contentWidth, pageHeight - 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('Quext Operations & Customer Success · Confidential & Proprietary · Master Project Tracker', marginX, pageHeight - 11);

    const pageStr = `Page ${currentPage}`;
    doc.text(pageStr, marginX + contentWidth - 35, pageHeight - 11);
  };

  // Draw Page 1
  let currentY = drawPage1HeaderAndScorecard();
  currentY = drawTableHeader(currentY);

  const rowHeight = 24.5;
  const bottomLimit = pageHeight - 28;

  projects.forEach((p, idx) => {
    if (currentY + rowHeight > bottomLimit) {
      drawFooter();
      doc.addPage('letter', 'landscape');
      currentPage++;
      currentY = drawSubsequentPageHeader();
      currentY = drawTableHeader(currentY);
    }

    const isAlt = idx % 2 === 1;
    if (isAlt) {
      doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
      doc.rect(marginX, currentY, contentWidth, rowHeight, 'F');
    }

    doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
    doc.setLineWidth(0.5);
    doc.rect(marginX, currentY, contentWidth, rowHeight, 'S');

    let cellX = marginX;

    // Col 1: Property & Portfolio (138 pt)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const nameStr = `${idx + 1}. ${p.propertyName || 'Untitled'}`;
    const truncatedName = doc.splitTextToSize(nameStr, cols[0].width - 7)[0] || nameStr;
    doc.text(truncatedName, cellX + 3.5, currentY + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    const portStr = p.propertyManagementCompany || p.clientName || 'Portfolio Unassigned';
    const truncatedPort = doc.splitTextToSize(portStr, cols[0].width - 7)[0] || portStr;
    doc.text(truncatedPort, cellX + 3.5, currentY + 19);

    cellX += cols[0].width;
    doc.line(cellX, currentY, cellX, currentY + rowHeight);

    // Col 2: Units & Platform (58 pt)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(`${p.unitsCount || 0} Units`, cellX + 3.5, currentY + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    const plat = p.platform || 'Quext';
    if (plat === 'Geokey') doc.setTextColor(2, 132, 199);
    else if (plat === 'Homebase') doc.setTextColor(5, 150, 105);
    else doc.setTextColor(124, 58, 237);
    doc.text(plat, cellX + 3.5, currentY + 19);

    cellX += cols[1].width;
    doc.line(cellX, currentY, cellX, currentY + rowHeight);

    // Col 3: Tech & Construction (58 pt)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const nfcTag = p.useNfcWallet ? 'NFC:Y' : 'NFC:N';
    const qrTag = p.useQrIntercom ? 'QR:Y' : 'QR:N';
    doc.text(`${nfcTag} · ${qrTag}`, cellX + 3.5, currentY + 9.5);

    const constType = p.communityDetails?.projectType || (p as any).constructionType || 'New Const.';
    const shortConst = constType.includes('Retrofit') ? 'Retrofit' : 'New Const.';
    doc.setFontSize(5.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(shortConst, cellX + 3.5, currentY + 19);

    cellX += cols[2].width;
    doc.line(cellX, currentY, cellX, currentY + rowHeight);

    // Col 4: Status (70 pt)
    const isClosed =
      (p.statusTag as string) === 'Project Closed' ||
      p.milestones?.some(
        (m) =>
          (m.title === 'Project Closed' || m.title.toLowerCase().includes('closed')) &&
          m.status === 'Completed'
      );

    let status: string = p.statusTag || 'On Track';
    let sColor = GREEN;
    let sBg = GREEN_BG;

    if (isClosed) {
      status = 'Project Closed';
      sColor = [55, 48, 163]; // Indigo-800
      sBg = [224, 231, 255]; // Indigo-100
    } else if (status === 'Behind Schedule') {
      sColor = AMBER;
      sBg = AMBER_BG;
    } else if (status === 'High Risk') {
      sColor = RED;
      sBg = RED_BG;
    }

    doc.setFillColor(sBg[0], sBg[1], sBg[2]);
    doc.roundedRect(cellX + 3, currentY + 4, cols[3].width - 6, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(sColor[0], sColor[1], sColor[2]);
    doc.text(status, cellX + 6, currentY + 13.5);

    cellX += cols[3].width;
    doc.line(cellX, currentY, cellX, currentY + rowHeight);

    // Col 5: Implementation Dates: Install Start and Install Complete (94 pt)
    const implMilestone = p.milestones?.find(
      (m) => m.title === 'Implementation' || m.title.toLowerCase().includes('implement')
    );
    const installStart =
      (p as any).installationStartDate ||
      implMilestone?.startedAt ||
      p.startDate ||
      'TBD';
    const installComplete =
      (p as any).installationEndDate ||
      implMilestone?.completedDate ||
      implMilestone?.targetDate ||
      p.targetCompletionDate ||
      'TBD';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(`Start: ${formatShortDate(installStart)}`, cellX + 3.5, currentY + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`End: ${formatShortDate(installComplete)}`, cellX + 3.5, currentY + 19);

    cellX += cols[4].width;
    doc.line(cellX, currentY, cellX, currentY + rowHeight);

    // Col 6: Project Team (110 pt)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const pmName =
      p.assignedPM?.name?.replace(' Recalde', '')?.replace(' Condon', '')?.replace(' Rossman', '') || 'PM';
    const csmName = p.assignedCSM?.split(' ')?.[0] || 'Nicole';
    const teamLine1 = `PM: ${pmName}  ·  CSM: ${csmName}`;
    doc.text(teamLine1, cellX + 3.5, currentY + 9.5);

    const techName = p.assignedFieldTech || 'Hector Lopez';
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`Field: ${techName}`, cellX + 3.5, currentY + 19);

    cellX += cols[5].width;
    doc.line(cellX, currentY, cellX, currentY + rowHeight);

    // Col 7: Installer (70 pt)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    const partner = (p.integratorPartners && p.integratorPartners[0]) || 'SKBM';
    const truncPartner = doc.splitTextToSize(partner, cols[6].width - 6)[0] || partner;
    doc.text(truncPartner, cellX + 3.5, currentY + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('Certified Crew', cellX + 3.5, currentY + 19);

    cellX += cols[6].width;
    doc.line(cellX, currentY, cellX, currentY + rowHeight);

    // Col 8: SWAT Invoicing (65 pt)
    const fm = p.financialMilestones;
    const dep = fm?.fiftyPercentCollected ? 'Y' : 'N';
    const rough = fm?.thirtyPercentCollected ? 'Y' : 'N';
    const ret = fm?.finalTwentyPercentCollected ? 'Y' : 'N';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(`50:${dep}  30:${rough}  20:${ret}`, cellX + 3.5, currentY + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    const saasStr = fm?.saasStartDate ? `SaaS: ${fm.saasStartDate}` : 'SaaS: Pending';
    doc.text(saasStr, cellX + 3.5, currentY + 19);

    cellX += cols[7].width;
    doc.line(cellX, currentY, cellX, currentY + rowHeight);

    // Col 9: Scope & Notes (73 pt)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    let rawNote = p.notes?.[0]?.text || '';
    rawNote = rawNote
      .replace(/\[Master Tracker\]:\s*/g, '')
      .replace(/\[Network Notes\]:\s*/g, '')
      .replace(/📌 Post-It Note.*?:\s*/g, '')
      .replace(/\s+/g, ' ');
    const noteStr = rawNote.trim() || 'Deployment active';
    const lines = doc.splitTextToSize(noteStr, cols[8].width - 6);
    doc.text(lines[0] || noteStr, cellX + 3.5, currentY + 10);
    if (lines[1]) {
      doc.text(lines[1], cellX + 3.5, currentY + 18.5);
    }

    currentY += rowHeight;
  });

  drawFooter();

  // Second pass: Update total page counts across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(255, 255, 255);
    doc.rect(marginX + contentWidth - 65, pageHeight - 16, 65, 10, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`Page ${i} of ${totalPages}`, marginX + contentWidth - 48, pageHeight - 11);
  }

  return doc;
}

/**
 * Generates and triggers browser download of the Executive Dashboard Report PDF.
 */
export function downloadOmarDashboardPdf(
  projects: OperationProject[],
  options?: {
    filterLabel?: string;
    fileName?: string;
  }
): void {
  const doc = generateOmarDashboardPdf(projects, options);
  const defaultName = options?.fileName || (
    options?.filterLabel
      ? `Quext_Master_Projects_Dashboard_${options.filterLabel.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
      : 'Quext_Master_Projects_Dashboard_Report.pdf'
  );
  doc.save(defaultName);
}
