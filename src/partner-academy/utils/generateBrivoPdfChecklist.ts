import { jsPDF } from 'jspdf';
import { BRIVO_PLATFORM_CHECKLIST } from '../data/integrationChecklistsData';

export interface BrivoPdfExportOptions {
  theme?: 'white' | 'dark';
  completedItemIds?: string[];
  phase1Statuses?: Record<string, string>;
  phase1Notes?: Record<string, string>;
  completionDate?: string;
}

export const generateAndDownloadBrivoPdf = (options: BrivoPdfExportOptions = {}) => {
  const {
    theme = 'white',
    completedItemIds = [],
    phase1Statuses = {},
    phase1Notes = {},
    completionDate = new Date().toLocaleDateString('en-US')
  } = options;

  const isDark = theme === 'dark';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 612 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 792 pt

  // Neatly centered page layout: 44 pt left and right margins
  const margin = 44;
  const contentWidth = pageWidth - margin * 2; // 524 pt
  const maxUsableY = pageHeight - 48; // Leaves room for footer

  // Branding colors aligned with onequext.com
  const colors = {
    pageBg: isDark ? [10, 14, 24] : [255, 255, 255],
    cardBg: isDark ? [16, 22, 36] : [248, 250, 252],
    titleBlue: isDark ? [96, 165, 250] : [37, 99, 235],
    titlePurple: isDark ? [192, 132, 252] : [124, 58, 237],
    headingText: isDark ? [255, 255, 255] : [17, 24, 39],
    subHeadingText: isDark ? [203, 213, 225] : [75, 85, 99],
    bodyText: isDark ? [226, 232, 240] : [31, 41, 55],
    mutedText: isDark ? [148, 163, 184] : [107, 114, 128],
    borderLight: isDark ? [45, 55, 75] : [229, 231, 235],
    borderHeader: isDark ? [60, 75, 105] : [209, 213, 219],
    tableHeaderBg: isDark ? [20, 28, 46] : [241, 245, 249],
    statusPendingBg: isDark ? [88, 28, 135] : [254, 242, 242],
    statusPendingText: isDark ? [244, 114, 182] : [220, 38, 38],
    statusInProgressBg: isDark ? [30, 58, 138] : [239, 246, 255],
    statusInProgressText: isDark ? [147, 197, 253] : [29, 78, 216],
    statusVerifiedBg: isDark ? [6, 78, 59] : [236, 253, 245],
    statusVerifiedText: isDark ? [52, 211, 153] : [16, 185, 129],
    checkboxBorder: isDark ? [156, 163, 175] : [107, 114, 128],
    checkboxCheckedBg: isDark ? [37, 99, 235] : [37, 99, 235],
    stepBg: isDark ? [18, 25, 42] : [243, 244, 246]
  };

  const drawPageBackground = () => {
    doc.setFillColor(colors.pageBg[0], colors.pageBg[1], colors.pageBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  let currentY = 54;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > maxUsableY) {
      doc.addPage();
      drawPageBackground();
      drawRunningHeader();
      currentY = 56;
    }
  };

  const drawRunningHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text('Brivo + Quext integration Checklist', margin, 32);
    doc.text('QUEXT FIELD OPERATIONS', pageWidth - margin, 32, { align: 'right' });

    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 38, pageWidth - margin, 38);
  };

  // Helper to draw a checkbox
  const drawCheckbox = (x: number, y: number, checked: boolean) => {
    doc.setDrawColor(colors.checkboxBorder[0], colors.checkboxBorder[1], colors.checkboxBorder[2]);
    doc.setLineWidth(0.85);

    if (checked) {
      doc.setFillColor(colors.checkboxCheckedBg[0], colors.checkboxCheckedBg[1], colors.checkboxCheckedBg[2]);
      doc.roundedRect(x, y - 8.5, 11, 11, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text('✓', x + 2, y);
    } else {
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.roundedRect(x, y - 8.5, 11, 11, 2, 2, 'FD');
    }
  };

  /**
   * Helper that prints an inline bold title followed by normal description.
   * Ensures 100% of text stays strictly inside [startX, startX + maxWidth].
   * Nothing ever rolls off the page!
   */
  const drawInlineItemText = (
    title: string,
    description: string | undefined,
    startX: number,
    startY: number,
    maxWidth: number,
    lineHeight: number = 13
  ): number => {
    const titleStr = title.endsWith(':') ? title : `${title}:`;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);

    if (!description || description.trim().length === 0) {
      const titleLines = doc.splitTextToSize(title, maxWidth);
      doc.text(titleLines, startX, startY);
      return titleLines.length * lineHeight;
    }

    const titleWidth = doc.getTextWidth(titleStr + ' ');

    // If title is super wide (takes more than 70% of line), put title on line 1 and description below
    if (titleWidth > maxWidth * 0.7) {
      doc.text(titleStr, startX, startY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      const descLines = doc.splitTextToSize(description, maxWidth);
      doc.text(descLines, startX, startY + lineHeight);
      return (descLines.length + 1) * lineHeight;
    }

    // Otherwise, pack as many words as possible on line 1 alongside title
    const words = description.split(/\s+/);
    let line1Words: string[] = [];
    let line1Width = titleWidth;
    let wordIndex = 0;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);

    while (wordIndex < words.length) {
      const testWord = (line1Words.length > 0 ? ' ' : '') + words[wordIndex];
      const testWidth = doc.getTextWidth(testWord);
      if (line1Width + testWidth <= maxWidth) {
        line1Words.push(words[wordIndex]);
        line1Width += testWidth;
        wordIndex++;
      } else {
        break;
      }
    }

    // Print Line 1: Title (bold) + first words (normal)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text(titleStr, startX, startY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    if (line1Words.length > 0) {
      doc.text(line1Words.join(' '), startX + titleWidth, startY);
    }

    // Subsequent lines (if any words remaining)
    if (wordIndex < words.length) {
      const remainingText = words.slice(wordIndex).join(' ');
      const restLines = doc.splitTextToSize(remainingText, maxWidth);
      doc.text(restLines, startX, startY + lineHeight);
      return (restLines.length + 1) * lineHeight;
    }

    return lineHeight;
  };

  // =========================================================================
  // PAGE 1: HEADER & PHASE 1 & PHASE 2
  // =========================================================================
  drawPageBackground();

  // Document Title: Neatly Centered & Tucked with OneQuext Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(colors.titleBlue[0], colors.titleBlue[1], colors.titleBlue[2]);
  doc.text('Brivo + Quext', pageWidth / 2, currentY, { align: 'center' });
  currentY += 24;

  doc.setFontSize(20);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text('integration Checklist', pageWidth / 2, currentY, { align: 'center' });
  currentY += 16;

  // Centered Accent Line
  doc.setDrawColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.setLineWidth(1.5);
  doc.line(pageWidth / 2 - 80, currentY, pageWidth / 2 + 80, currentY);
  currentY += 24;

  // =========================================================================
  // PHASE 1: PRE-INTEGRATION INFORMATION GATHERING
  // =========================================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text(BRIVO_PLATFORM_CHECKLIST.phase1.title, margin, currentY);
  currentY += 12;

  // Table Dimensions: Total width = 524 pt (Centered horizontally)
  // Col 1 (Scope): 108 pt
  // Col 2 (Config Details): 216 pt
  // Col 3 (Status): 72 pt (Centered badge)
  // Col 4 (Notes): 128 pt
  const tableX = margin;
  const colWidths = {
    scope: 108,
    config: 216,
    status: 72,
    notes: 128
  };

  const colX = {
    scope: tableX,
    config: tableX + colWidths.scope,
    status: tableX + colWidths.scope + colWidths.config,
    notes: tableX + colWidths.scope + colWidths.config + colWidths.status
  };

  // Table Header Background Bar
  const tableHeaderHeight = 20;
  doc.setFillColor(colors.tableHeaderBg[0], colors.tableHeaderBg[1], colors.tableHeaderBg[2]);
  doc.roundedRect(tableX, currentY, contentWidth, tableHeaderHeight, 2, 2, 'F');

  doc.setDrawColor(colors.borderHeader[0], colors.borderHeader[1], colors.borderHeader[2]);
  doc.setLineWidth(0.75);
  doc.roundedRect(tableX, currentY, contentWidth, tableHeaderHeight, 2, 2, 'S');

  // Header Column Labels
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);

  doc.text('Item / Scope', colX.scope + 8, currentY + 13);
  doc.text('Configuration Details', colX.config + 8, currentY + 13);
  doc.text('Status', colX.status + colWidths.status / 2, currentY + 13, { align: 'center' });
  doc.text('Notes', colX.notes + 8, currentY + 13);

  currentY += tableHeaderHeight;

  // Phase 1 Table Rows
  BRIVO_PLATFORM_CHECKLIST.phase1.items.forEach((item, index) => {
    const scopeLines = doc.splitTextToSize(item.scope, colWidths.scope - 14);
    const configLines = doc.splitTextToSize(item.configurationDetails, colWidths.config - 16);

    const userNote = phase1Notes[item.id] || '';
    const noteLines = userNote ? doc.splitTextToSize(userNote, colWidths.notes - 14) : ['—'];

    const contentLineCount = Math.max(scopeLines.length, configLines.length, noteLines.length);
    const rowHeight = Math.max(contentLineCount * 12.5 + 16, 38);

    checkPageBreak(rowHeight);

    // Row alternating background
    if (index % 2 === 1) {
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.rect(tableX, currentY, contentWidth, rowHeight, 'F');
    }

    // Row border line
    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.5);
    doc.rect(tableX, currentY, contentWidth, rowHeight, 'S');

    // Scope Column
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text(scopeLines, colX.scope + 8, currentY + 14);

    // Configuration Details Column
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    doc.text(configLines, colX.config + 8, currentY + 14);

    // Status Pill Column (Perfectly Centered in column)
    const currentStatus = phase1Statuses[item.id] || item.defaultStatus;
    const isVerified = currentStatus === 'Verified';
    const isInProgress = currentStatus === 'In Progress';

    const pillBg = isVerified
      ? colors.statusVerifiedBg
      : isInProgress
      ? colors.statusInProgressBg
      : colors.statusPendingBg;
    const pillText = isVerified
      ? colors.statusVerifiedText
      : isInProgress
      ? colors.statusInProgressText
      : colors.statusPendingText;

    const pillWidth = 58;
    const pillHeight = 15;
    const pillX = colX.status + (colWidths.status - pillWidth) / 2;
    const pillY = currentY + 8;

    doc.setFillColor(pillBg[0], pillBg[1], pillBg[2]);
    doc.roundedRect(pillX, pillY, pillWidth, pillHeight, 7.5, 7.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(pillText[0], pillText[1], pillText[2]);
    doc.text(currentStatus, pillX + pillWidth / 2, pillY + 10.5, { align: 'center' });

    // Notes Column
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text(noteLines, colX.notes + 8, currentY + 14);

    currentY += rowHeight;
  });

  currentY += 22;

  // =========================================================================
  // PHASE 2: EXTERNAL SETUP (CUSTOMER, BRIVO RESELLER & BRIVO)
  // =========================================================================
  checkPageBreak(120);

  // Section Header Bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text(BRIVO_PLATFORM_CHECKLIST.phase2.title, margin, currentY);
  currentY += 6;

  doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
  doc.setLineWidth(0.75);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 14;

  // Phase 2 Items
  BRIVO_PLATFORM_CHECKLIST.phase2.items.forEach((item) => {
    checkPageBreak(30);
    const isChecked = completedItemIds.includes(item.id);

    // Draw checkbox
    drawCheckbox(margin + 4, currentY, isChecked);

    // Draw neatly wrapped inline title + description
    const textHeight = drawInlineItemText(
      item.title,
      item.description,
      margin + 22,
      currentY,
      contentWidth - 26,
      13
    );

    currentY += Math.max(textHeight, 13) + 7;
  });

  // =========================================================================
  // PAGE 2: PHASE 3 & PHASE 4
  // =========================================================================
  doc.addPage();
  drawPageBackground();
  drawRunningHeader();
  currentY = 56;

  // Phase 3 Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text(BRIVO_PLATFORM_CHECKLIST.phase3.title, margin, currentY);
  currentY += 6;

  doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
  doc.setLineWidth(0.75);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 14;

  // STEP 1: API Entry & Provisioning
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text(BRIVO_PLATFORM_CHECKLIST.phase3.step1.stepTitle, margin + 4, currentY);
  currentY += 14;

  BRIVO_PLATFORM_CHECKLIST.phase3.step1.items.forEach((item) => {
    checkPageBreak(36);
    const isChecked = completedItemIds.includes(item.id);

    drawCheckbox(margin + 6, currentY, isChecked);

    const textHeight = drawInlineItemText(
      item.title,
      item.description,
      margin + 24,
      currentY,
      contentWidth - 28,
      13
    );
    currentY += Math.max(textHeight, 13) + 4;

    if (item.subBullets && item.subBullets.length > 0) {
      item.subBullets.forEach((bullet) => {
        checkPageBreak(18);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.subHeadingText[0], colors.subHeadingText[1], colors.subHeadingText[2]);

        doc.text('○', margin + 30, currentY);
        const bulletLines = doc.splitTextToSize(bullet, contentWidth - 48);
        doc.text(bulletLines, margin + 40, currentY);
        currentY += bulletLines.length * 12 + 4;
      });
    }

    currentY += 3;
  });

  currentY += 10;

  // STEP 2: Site Scrub Assessment
  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text(BRIVO_PLATFORM_CHECKLIST.phase3.step2.stepTitle, margin + 4, currentY);
  currentY += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(colors.subHeadingText[0], colors.subHeadingText[1], colors.subHeadingText[2]);
  doc.text(BRIVO_PLATFORM_CHECKLIST.phase3.step2.description, margin + 4, currentY);
  currentY += 14;

  BRIVO_PLATFORM_CHECKLIST.phase3.step2.items.forEach((item) => {
    checkPageBreak(24);
    const isChecked = completedItemIds.includes(item.id);

    const indentX = item.indent ? margin + 24 : margin + 6;
    const textStartX = indentX + 18;
    const maxTextW = contentWidth - (textStartX - margin) - 4;

    drawCheckbox(indentX, currentY, isChecked);

    const textHeight = drawInlineItemText(
      item.title,
      item.description,
      textStartX,
      currentY,
      maxTextW,
      13
    );

    currentY += Math.max(textHeight, 13) + 5;
  });

  currentY += 10;

  // STEP 3: Door Mapping & Phased Rollout
  checkPageBreak(100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text(BRIVO_PLATFORM_CHECKLIST.phase3.step3.stepTitle, margin + 4, currentY);
  currentY += 14;

  BRIVO_PLATFORM_CHECKLIST.phase3.step3.items.forEach((item) => {
    checkPageBreak(34);
    const isChecked = completedItemIds.includes(item.id);

    drawCheckbox(margin + 6, currentY, isChecked);

    const textHeight = drawInlineItemText(
      item.title,
      item.description,
      margin + 24,
      currentY,
      contentWidth - 28,
      13
    );
    currentY += Math.max(textHeight, 13) + 4;

    if (item.subBullets && item.subBullets.length > 0) {
      item.subBullets.forEach((bullet) => {
        checkPageBreak(18);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.subHeadingText[0], colors.subHeadingText[1], colors.subHeadingText[2]);

        doc.text('○', margin + 30, currentY);
        const bulletLines = doc.splitTextToSize(bullet, contentWidth - 48);
        doc.text(bulletLines, margin + 40, currentY);
        currentY += bulletLines.length * 12 + 4;
      });
    }

    currentY += 3;
  });

  currentY += 14;

  // =========================================================================
  // PHASE 4: VALIDATION & SIGN-OFF
  // =========================================================================
  checkPageBreak(80);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text(BRIVO_PLATFORM_CHECKLIST.phase4.title, margin, currentY);
  currentY += 6;

  doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
  doc.setLineWidth(0.75);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 14;

  // Items 1 & 2
  BRIVO_PLATFORM_CHECKLIST.phase4.items.slice(0, 2).forEach((item) => {
    checkPageBreak(26);
    const isChecked = completedItemIds.includes(item.id);

    drawCheckbox(margin + 6, currentY, isChecked);

    const textHeight = drawInlineItemText(
      item.title,
      item.description,
      margin + 24,
      currentY,
      contentWidth - 28,
      13
    );

    currentY += Math.max(textHeight, 13) + 6;
  });

  // Completion Date Line (Tucked and formatted with clean date field)
  checkPageBreak(28);
  const dateItem = BRIVO_PLATFORM_CHECKLIST.phase4.items[2];
  const isDateChecked = completedItemIds.includes(dateItem.id);

  drawCheckbox(margin + 6, currentY, isDateChecked);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Completion Date: ', margin + 24, currentY);

  const dateTitleWidth = doc.getTextWidth('Completion Date: ');
  const dateBoxX = margin + 24 + dateTitleWidth + 4;

  // Clean date tag box
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.roundedRect(dateBoxX, currentY - 9, 110, 15, 3, 3, 'F');
  doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
  doc.setLineWidth(0.65);
  doc.roundedRect(dateBoxX, currentY - 9, 110, 15, 3, 3, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
  doc.text(completionDate || '____________________', dateBoxX + 8, currentY + 1.5);

  // =========================================================================
  // STAMP FOOTERS ON ALL PAGES (Centered, balanced, professional)
  // =========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);

    doc.text('Brivo + Quext integration Checklist', margin, pageHeight - 22);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth / 2, pageHeight - 22, { align: 'center' });
    doc.text('QUEXT CONFIDENTIAL · FIELD OPERATIONS', pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  // Save PDF
  const filename = `Brivo_Quext_Integration_Checklist_${theme === 'dark' ? 'NightDark' : 'Printable'}.pdf`;
  doc.save(filename);
};
