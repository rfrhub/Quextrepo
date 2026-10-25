import { jsPDF } from 'jspdf';
import { PORTAL_GUIDE_CHAPTERS, PORTAL_GUIDE_METADATA } from '../data/portalGuideData';

export const generateAndDownloadPdf = (theme: 'white' | 'dark' = 'white') => {
  try {
    const isDark = theme === 'dark';

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 612 pt
    const pageHeight = doc.internal.pageSize.getHeight(); // 792 pt
    const margin = 44; // Generous 44pt margins
    const contentWidth = pageWidth - margin * 2; // 524 pt
    const maxUsableY = pageHeight - 48; // Room for footer

    // Color Palette Definition
    const colors = {
      pageBg: isDark ? [11, 14, 23] : [255, 255, 255],
      headerBg: isDark ? [20, 27, 44] : [15, 23, 42],
      headerText: [255, 255, 255],
      headerSub: isDark ? [203, 213, 225] : [226, 232, 240],
      headerBrand: isDark ? [192, 132, 252] : [168, 85, 247],
      
      titleText: isDark ? [255, 255, 255] : [15, 23, 42],
      subTitleText: isDark ? [216, 180, 254] : [109, 40, 217],
      descText: isDark ? [203, 213, 225] : [71, 85, 105],
      bodyText: isDark ? [226, 232, 240] : [51, 65, 85],
      mutedText: isDark ? [148, 163, 184] : [100, 116, 139],
      
      cardBg: isDark ? [17, 24, 39] : [248, 250, 252],
      cardBorder: isDark ? [45, 55, 75] : [226, 232, 240],
      
      badgeBg: isDark ? [59, 7, 100] : [243, 232, 255],
      badgeBorder: isDark ? [147, 51, 234] : [216, 180, 254],
      badgeText: isDark ? [216, 180, 254] : [126, 34, 206],
      
      stepBadgeBg: [147, 51, 234],
      stepBadgeText: [255, 255, 255],
      
      tableHeaderBg: isDark ? [46, 16, 101] : [243, 232, 255],
      tableHeaderText: isDark ? [233, 213, 255] : [88, 28, 135],
      tableBorder: isDark ? [51, 65, 85] : [226, 232, 240],
      tableRowEven: isDark ? [15, 21, 35] : [255, 255, 255],
      tableRowOdd: isDark ? [20, 28, 45] : [248, 250, 252],
      tableText: isDark ? [226, 232, 240] : [30, 41, 59],
      
      calloutBg: isDark ? [30, 18, 55] : [250, 245, 255],
      calloutBorder: [168, 85, 247],
      calloutText: isDark ? [233, 213, 255] : [88, 28, 135],
      
      cautionBg: isDark ? [69, 26, 3] : [254, 243, 199],
      cautionBorder: isDark ? [180, 83, 9] : [245, 158, 11],
      cautionText: isDark ? [253, 230, 138] : [146, 64, 14],
      
      footerLine: isDark ? [45, 55, 75] : [226, 232, 240],
      footerText: isDark ? [148, 163, 184] : [120, 130, 145]
    };

    let currentPageNumber = 1;

    // Helper: Draw Background and Running Header on current page
    const drawPageHeader = (sectionShortTitle?: string) => {
      // Background fill
      doc.setFillColor(colors.pageBg[0], colors.pageBg[1], colors.pageBg[2]);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Top Header Bar
      doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
      doc.rect(margin, 22, contentWidth, 26, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(colors.headerText[0], colors.headerText[1], colors.headerText[2]);
      doc.text('QUEXT', margin + 10, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.headerSub[0], colors.headerSub[1], colors.headerSub[2]);
      doc.text('|   IoT Field Operations & Engineering Division', margin + 58, 38);

      if (sectionShortTitle) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(colors.headerBrand[0], colors.headerBrand[1], colors.headerBrand[2]);
        const displayTitle = sectionShortTitle.length > 32 ? sectionShortTitle.slice(0, 30) + '...' : sectionShortTitle;
        doc.text(displayTitle, pageWidth - margin - doc.getTextWidth(displayTitle) - 10, 38);
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(colors.headerBrand[0], colors.headerBrand[1], colors.headerBrand[2]);
        doc.text('help.quext.io', pageWidth - margin - 62, 38);
      }
    };

    // Helper to check for page break and create new page if needed
    const ensureSpace = (neededHeight: number, currentY: number, sectionShortTitle?: string): number => {
      if (currentY + neededHeight > maxUsableY) {
        doc.addPage();
        currentPageNumber++;
        drawPageHeader(sectionShortTitle);
        return 74; // Reset cy with generous top breathing room below header
      }
      return currentY;
    };

    // ==========================================
    // PAGE 1: COVER PAGE
    // ==========================================
    drawPageHeader();

    let y = 74;

    // Top Badge (Clean text, no pill box)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
    doc.text('OFFICIAL INSTALLATION MANUAL  ·  HELP.QUEXT.IO', margin, y);

    y += 24;

    // Main Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Quext Portal (quext.io)', margin, y);
    y += 28;
    doc.text('Installer Field Operations & Device', margin, y);
    y += 28;
    doc.text('Provisioning Manual', margin, y);

    y += 20;

    // Accent line
    doc.setDrawColor(168, 85, 247);
    doc.setLineWidth(3);
    doc.line(margin, y, margin + 90, y);

    y += 26;

    // Description text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    const descLines = doc.splitTextToSize(PORTAL_GUIDE_METADATA.summary, contentWidth);
    doc.text(descLines, margin, y, { lineHeightFactor: 1.4 });

    y += descLines.length * 13.5 + 24;

    // Specs Grid Box
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, y, contentWidth, 58, 6, 6, 'FD');

    const colW = contentWidth / 4;
    const specs = [
      { label: 'PLATFORM', val: 'quext.io' },
      { label: 'TARGET AUDIENCE', val: 'Certified Installers' },
      { label: 'REVISION', val: PORTAL_GUIDE_METADATA.version },
      { label: 'SUPPORT HOTLINE', val: 'support@onequext.com' }
    ];

    specs.forEach((s, idx) => {
      const cx = margin + idx * colW + 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
      doc.text(s.label, cx, y + 20);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(s.val, cx, y + 38);
    });

    y += 76;

    // Table of Contents Box (2-Column Grid for Spacious Layout)
    const itemsPerCol = Math.ceil(PORTAL_GUIDE_CHAPTERS.length / 2);
    const tocBoxHeight = 32 + itemsPerCol * 24 + 10;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, y, contentWidth, tocBoxHeight, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('DOCUMENT SECTIONS & FIELD MODULES', margin + 14, y + 20);

    const startTocY = y + 38;
    const colWidth = (contentWidth - 20) / 2;

    PORTAL_GUIDE_CHAPTERS.forEach((chap, idx) => {
      const isCol2 = idx >= itemsPerCol;
      const colX = margin + (isCol2 ? colWidth + 20 : 8);
      const rowY = startTocY + (idx % itemsPerCol) * 24;

      doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
      doc.roundedRect(colX, rowY - 8, 18, 14, 3, 3, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
      doc.text(String(chap.chapterNumber), colX + (chap.chapterNumber >= 10 ? 3.5 : 6), rowY + 2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      const itemTitle = chap.shortTitle || chap.title;
      const maxColTitleW = colWidth - 85;
      const displayTitle = doc.getTextWidth(itemTitle) > maxColTitleW
        ? itemTitle.slice(0, 26) + '...'
        : itemTitle;
      doc.text(displayTitle, colX + 24, rowY + 1);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
      doc.text(`${chap.readTime}`, colX + colWidth - 28, rowY + 1);
    });

    // ==========================================
    // SECTION PAGES WITH SPACIOUS, UNCLUTTERED FLOW
    // ==========================================
    PORTAL_GUIDE_CHAPTERS.forEach((chap) => {
      // Start each section on a clean new page
      doc.addPage();
      currentPageNumber++;
      drawPageHeader(chap.shortTitle);

      let cy = 76; // Start below header bar

      // 1. SECTION TAG (Clean typography without bubble/box)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
      doc.text(`SECTION ${chap.chapterNumber}  ·  ${chap.readTime.toUpperCase()} FIELD READ`, margin, cy);

      cy += 20; // Generous space before section title

      // 2. MAIN SECTION TITLE (Wrapped and safely measured)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15.5);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      const titleLines = doc.splitTextToSize(chap.title, contentWidth);
      doc.text(titleLines, margin, cy, { lineHeightFactor: 1.3 });

      cy += titleLines.length * 19 + 12; // Ample gap between title and description

      // 3. SECTION DESCRIPTION
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      const cDesc = doc.splitTextToSize(chap.description, contentWidth);
      doc.text(cDesc, margin, cy, { lineHeightFactor: 1.4 });

      cy += cDesc.length * 13.5 + 22; // Extra breathing room before content

      // 4. SCREENSHOT MOCKUP CONTAINER
      if (chap.screenshot) {
        cy = ensureSpace(82, cy, chap.shortTitle);

        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
        doc.roundedRect(margin, cy, contentWidth, 64, 5, 5, 'FD');

        // Top bar of browser mockup
        doc.setFillColor(isDark ? 8 : 15, isDark ? 12 : 23, isDark ? 22 : 42);
        doc.roundedRect(margin, cy, contentWidth, 18, 5, 5, 'F');
        doc.rect(margin, cy + 10, contentWidth, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text(`PORTAL ACTION: ${chap.screenshot.uiTitle}`, margin + 10, cy + 12.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        const urlStr = `URL: ${chap.screenshot.urlPath}`;
        doc.text(urlStr, pageWidth - margin - doc.getTextWidth(urlStr) - 10, cy + 12.5);

        // Screenshot Caption Text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
        const scCap = doc.splitTextToSize(chap.screenshot.caption, contentWidth - 20);
        doc.text(scCap, margin + 10, cy + 34, { lineHeightFactor: 1.35 });

        cy += 78; // Ample space after screenshot
      }

      // 5. RENDER SUB-SECTIONS
      chap.sections.forEach((sec) => {
        // Generous spacing before new subsection header
        if (cy > 85) {
          cy += 14;
        }

        // Sub-section Title (Wrapped and measured so it never overlaps)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11.5);
        doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
        const secTitleLines = doc.splitTextToSize(sec.title, contentWidth);
        const neededHeadH = secTitleLines.length * 16 + 28;
        cy = ensureSpace(neededHeadH, cy, chap.shortTitle);

        doc.text(secTitleLines, margin, cy, { lineHeightFactor: 1.3 });
        cy += secTitleLines.length * 16 + 8; // Clean gap before content

        // Paragraphs (Readable 9pt font with 1.4x line height)
        sec.content.forEach((p) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
          const pLines = doc.splitTextToSize(p, contentWidth);
          const pHeight = pLines.length * 13 + 8;
          cy = ensureSpace(pHeight, cy, chap.shortTitle);
          doc.text(pLines, margin, cy, { lineHeightFactor: 1.4 });
          cy += pHeight;
        });

        // Steps (Spacious Step Cards with Dynamic Height)
        if (sec.steps) {
          sec.steps.forEach((st) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            const detailLines = doc.splitTextToSize(st.detail, contentWidth - 44);
            let cautionLines: string[] = [];
            if (st.warning) {
              cautionLines = doc.splitTextToSize(`CAUTION: ${st.warning}`, contentWidth - 54);
            }
            let tipLines: string[] = [];
            if (st.tip) {
              tipLines = doc.splitTextToSize(`TIP: ${st.tip}`, contentWidth - 54);
            }

            // Calculate exact height needed
            let stepHeight = 24 + detailLines.length * 12.5;
            if (cautionLines.length > 0) stepHeight += cautionLines.length * 11.5 + 14;
            if (tipLines.length > 0) stepHeight += tipLines.length * 11.5 + 14;
            stepHeight = Math.max(stepHeight, 38);

            cy = ensureSpace(stepHeight + 10, cy, chap.shortTitle);

            // Background Card
            doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
            doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
            doc.roundedRect(margin, cy, contentWidth, stepHeight, 4, 4, 'FD');

            // Step Circle Badge
            doc.setFillColor(colors.stepBadgeBg[0], colors.stepBadgeBg[1], colors.stepBadgeBg[2]);
            doc.circle(margin + 15, cy + 17, 8, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(colors.stepBadgeText[0], colors.stepBadgeText[1], colors.stepBadgeText[2]);
            doc.text(String(st.stepNumber), margin + 12.5, cy + 20);

            // Step Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
            doc.text(st.title, margin + 30, cy + 16);

            // Step Detail
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
            doc.text(detailLines, margin + 30, cy + 30, { lineHeightFactor: 1.35 });

            let subY = cy + 30 + detailLines.length * 12.5 + 2;

            // Warning Callout inside step
            if (cautionLines.length > 0) {
              const cBoxH = cautionLines.length * 11.5 + 8;
              doc.setFillColor(colors.cautionBg[0], colors.cautionBg[1], colors.cautionBg[2]);
              doc.setDrawColor(colors.cautionBorder[0], colors.cautionBorder[1], colors.cautionBorder[2]);
              doc.roundedRect(margin + 30, subY, contentWidth - 44, cBoxH, 3, 3, 'FD');

              doc.setFont('helvetica', 'bold');
              doc.setFontSize(7.5);
              doc.setTextColor(colors.cautionText[0], colors.cautionText[1], colors.cautionText[2]);
              doc.text(cautionLines, margin + 36, subY + 10, { lineHeightFactor: 1.25 });
              subY += cBoxH + 6;
            }

            // Tip Callout inside step
            if (tipLines.length > 0) {
              const tBoxH = tipLines.length * 11.5 + 8;
              doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
              doc.setDrawColor(colors.badgeBorder[0], colors.badgeBorder[1], colors.badgeBorder[2]);
              doc.roundedRect(margin + 30, subY, contentWidth - 44, tBoxH, 3, 3, 'FD');

              doc.setFont('helvetica', 'bold');
              doc.setFontSize(7.5);
              doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
              doc.text(tipLines, margin + 36, subY + 10, { lineHeightFactor: 1.25 });
            }

            cy += stepHeight + 10;
          });
        }

        // Data Table with Dynamic Row Height, Clean Padding, and Readable Fonts
        if (sec.table) {
          const tW = contentWidth;
          const numCols = sec.table.headers.length;
          const tColW = tW / numCols;

          // Header Row
          cy = ensureSpace(38, cy, chap.shortTitle);
          doc.setFillColor(colors.tableHeaderBg[0], colors.tableHeaderBg[1], colors.tableHeaderBg[2]);
          doc.setDrawColor(colors.badgeBorder[0], colors.badgeBorder[1], colors.badgeBorder[2]);
          doc.rect(margin, cy, tW, 20, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(colors.tableHeaderText[0], colors.tableHeaderText[1], colors.tableHeaderText[2]);
          sec.table.headers.forEach((h, hIdx) => {
            doc.text(h, margin + hIdx * tColW + 6, cy + 13.5);
          });
          cy += 20;

          // Data Rows
          sec.table.rows.forEach((row, rIdx) => {
            // Determine row height based on largest column text
            let maxLines = 1;
            const splitCells = row.map(cell => {
              const lines = doc.splitTextToSize(cell, tColW - 12);
              if (lines.length > maxLines) maxLines = lines.length;
              return lines;
            });

            const rowHeight = Math.max(22, maxLines * 11.5 + 10);
            cy = ensureSpace(rowHeight + 4, cy, chap.shortTitle);

            const isEven = rIdx % 2 === 0;
            const rBg = isEven ? colors.tableRowEven : colors.tableRowOdd;
            doc.setFillColor(rBg[0], rBg[1], rBg[2]);
            doc.setDrawColor(colors.tableBorder[0], colors.tableBorder[1], colors.tableBorder[2]);
            doc.rect(margin, cy, tW, rowHeight, 'FD');

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(colors.tableText[0], colors.tableText[1], colors.tableText[2]);
            splitCells.forEach((lines, cIdx) => {
              doc.text(lines, margin + cIdx * tColW + 6, cy + 12, { lineHeightFactor: 1.3 });
            });
            cy += rowHeight;
          });
          cy += 14;
        }

        // Key Rule Callout Box (Dynamic Height with Spacious Padding)
        if (sec.keyTakeaway) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          const krLines = doc.splitTextToSize(sec.keyTakeaway, contentWidth - 85);
          const krBoxH = Math.max(30, krLines.length * 12.5 + 14);

          cy = ensureSpace(krBoxH + 12, cy, chap.shortTitle);

          doc.setFillColor(colors.calloutBg[0], colors.calloutBg[1], colors.calloutBg[2]);
          doc.setDrawColor(colors.calloutBorder[0], colors.calloutBorder[1], colors.calloutBorder[2]);
          doc.roundedRect(margin, cy, contentWidth, krBoxH, 4, 4, 'FD');

          doc.setFillColor(colors.calloutBorder[0], colors.calloutBorder[1], colors.calloutBorder[2]);
          doc.rect(margin, cy, 4, krBoxH, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
          doc.text('KEY RULE:', margin + 12, cy + 16);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
          doc.text(krLines, margin + 68, cy + 16, { lineHeightFactor: 1.35 });

          cy += krBoxH + 14;
        }

        // Need Help Callout Box (Dynamic Height with Spacious Padding)
        if (sec.needHelpCallout) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          const nhLines = doc.splitTextToSize(sec.needHelpCallout, contentWidth - 30);
          const nhBoxH = Math.max(30, nhLines.length * 12.5 + 14);

          cy = ensureSpace(nhBoxH + 12, cy, chap.shortTitle);

          doc.setFillColor(colors.calloutBg[0], colors.calloutBg[1], colors.calloutBg[2]);
          doc.setDrawColor(colors.calloutBorder[0], colors.calloutBorder[1], colors.calloutBorder[2]);
          doc.roundedRect(margin, cy, contentWidth, nhBoxH, 4, 4, 'FD');

          doc.setFillColor(colors.calloutBorder[0], colors.calloutBorder[1], colors.calloutBorder[2]);
          doc.rect(margin, cy, 4, nhBoxH, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
          doc.text(nhLines, margin + 14, cy + 16, { lineHeightFactor: 1.35 });

          cy += nhBoxH + 14;
        }

        cy += 6;
      });
    });

    // ==========================================
    // STAMP FINAL PAGE NUMBERS & FOOTERS ACROSS ALL PAGES
    // ==========================================
    const totalGeneratedPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalGeneratedPages; p++) {
      doc.setPage(p);

      // Draw footer line
      doc.setDrawColor(colors.footerLine[0], colors.footerLine[1], colors.footerLine[2]);
      doc.setLineWidth(0.75);
      doc.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32);

      // Footer Text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.footerText[0], colors.footerText[1], colors.footerText[2]);
      doc.text(`Ref: ${PORTAL_GUIDE_METADATA.docRef}  ·  © 2026 Quext (OneQuext)`, margin, pageHeight - 19);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      const pageStr = `Page ${p} of ${totalGeneratedPages}`;
      doc.text(pageStr, pageWidth - margin - doc.getTextWidth(pageStr), pageHeight - 19);
    }

    // Save PDF directly with theme suffix
    const fileName = isDark 
      ? 'Quext-Portal-Installer-Field-Guide-NightDark.pdf' 
      : 'Quext-Portal-Installer-Field-Guide.pdf';
      
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('Vector PDF generation error:', error);
    throw error;
  }
};
