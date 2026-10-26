import { jsPDF } from 'jspdf';
import {
  GATEWAY_GUIDE_METADATA,
  GATEWAY_REQUIRED_MATERIALS,
  GATEWAY_GUIDE_STEPS,
} from '../data/gatewayGuideData';

export const generateAndDownloadGatewayPdf = (theme: 'white' | 'dark' = 'white') => {
  try {
    const isDark = theme === 'dark';

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 612 pt
    const pageHeight = doc.internal.pageSize.getHeight(); // 792 pt
    const margin = 44;
    const contentWidth = pageWidth - margin * 2; // 524 pt
    const maxUsableY = pageHeight - 48;

    const colors = {
      pageBg: isDark ? [11, 14, 23] : [255, 255, 255],
      headerBg: isDark ? [20, 27, 44] : [15, 23, 42],
      headerBrand: isDark ? [192, 132, 252] : [147, 51, 234],
      titleText: isDark ? [255, 255, 255] : [15, 23, 42],
      subTitleText: isDark ? [216, 180, 254] : [126, 34, 206],
      descText: isDark ? [203, 213, 225] : [71, 85, 105],
      bodyText: isDark ? [226, 232, 240] : [51, 65, 85],
      cardBg: isDark ? [17, 24, 39] : [248, 250, 252],
      cardBorder: isDark ? [45, 55, 75] : [226, 232, 240],
      badgeBg: isDark ? [59, 7, 100] : [243, 232, 255],
      badgeText: isDark ? [216, 180, 254] : [126, 34, 206],
      accentPurple: [147, 51, 234],
      accentSky: [2, 132, 199],
      footerText: isDark ? [148, 163, 184] : [120, 130, 145],
    };

    const drawHeader = (pageNum: number, totalPagesEst: number) => {
      // Header bar
      doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
      doc.rect(0, 0, pageWidth, 56, 'F');

      // Top accent strip
      doc.setFillColor(colors.headerBrand[0], colors.headerBrand[1], colors.headerBrand[2]);
      doc.rect(0, 0, pageWidth, 3, 'F');

      // Brand Wordmark
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('QUEXT', margin, 32);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(203, 213, 225);
      doc.text('Smart Community Partner Academy', margin + 60, 32);

      // Support hotline right badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(192, 132, 252);
      doc.text(GATEWAY_GUIDE_METADATA.supportHotline, pageWidth - margin, 32, { align: 'right' });

      // Footer
      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
      doc.setLineWidth(1);
      doc.line(margin, pageHeight - 36, pageWidth - margin, pageHeight - 36);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.footerText[0], colors.footerText[1], colors.footerText[2]);
      doc.text(
        `${GATEWAY_GUIDE_METADATA.title} · ${GATEWAY_GUIDE_METADATA.documentCode}`,
        margin,
        pageHeight - 22
      );
      doc.text(`Page ${pageNum} of ${totalPagesEst}`, pageWidth - margin, pageHeight - 22, {
        align: 'right',
      });
    };

    let currentPage = 1;
    const totalPages = 4;

    // PAGE 1: COVER & BILL OF MATERIALS
    drawHeader(currentPage, totalPages);
    let curY = 82;

    // Title banner
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text(GATEWAY_GUIDE_METADATA.title, margin, curY);
    curY += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
    doc.text(
      'Everything you need to know to install, connect and verify your Quext gateway.',
      margin,
      curY
    );
    curY += 24;

    // Hardware Specs Box
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, 72, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Target Hardware Specification', margin + 14, curY + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(`• Device: ${GATEWAY_GUIDE_METADATA.targetDevice}`, margin + 14, curY + 36);
    doc.text(`• Antenna: ${GATEWAY_GUIDE_METADATA.antennaType}`, margin + 14, curY + 50);
    doc.text(
      `• Field Support: Call ${GATEWAY_GUIDE_METADATA.supportHotline} or email ${GATEWAY_GUIDE_METADATA.supportEmail}`,
      margin + 14,
      curY + 64
    );
    curY += 90;

    // Bill of Materials Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Required Materials & Tools for Installation', margin, curY);
    curY += 16;

    // Table Header
    doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
    doc.rect(margin, curY, contentWidth, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
    doc.text('Material / Component', margin + 8, curY + 14);
    doc.text('Quantity / Spec', margin + 220, curY + 14);
    doc.text('Installation Purpose', margin + 340, curY + 14);
    curY += 20;

    GATEWAY_REQUIRED_MATERIALS.forEach((mat, idx) => {
      const isEven = idx % 2 === 0;
      doc.setFillColor(
        isEven ? colors.cardBg[0] : (colors.pageBg[0] as number),
        isEven ? colors.cardBg[1] : (colors.pageBg[1] as number),
        isEven ? colors.cardBg[2] : (colors.pageBg[2] as number)
      );
      doc.rect(margin, curY, contentWidth, 22, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(mat.item, margin + 8, curY + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      doc.text(mat.qty, margin + 220, curY + 14);
      doc.text(mat.purpose, margin + 340, curY + 14);

      curY += 22;
    });

    // PAGE 2: MOUNTING LOCATION, UNISTRUT & ANTENNA MAST
    doc.addPage();
    currentPage = 2;
    drawHeader(currentPage, totalPages);
    curY = 80;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Mounting Location, Unistrut & Antenna Assembly', margin, curY);
    curY += 20;

    const stepsPage2 = GATEWAY_GUIDE_STEPS.slice(2, 5); // Steps 02, 03, 04
    stepsPage2.forEach((step) => {
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
      doc.roundedRect(margin, curY, contentWidth, 140, 6, 6, 'FD');

      // Badge
      doc.setFillColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.rect(margin + 12, curY + 12, 60, 16, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`STEP ${step.stepNumber}`, margin + 42, curY + 23, { align: 'center' });

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(step.stepTitle, margin + 80, curY + 24);

      let bulletY = curY + 44;
      step.bulletPoints.slice(0, 4).forEach((bp, bIdx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text(`${bIdx + 1}.`, margin + 14, bulletY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text(`${bp.title}:`, margin + 28, bulletY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        const lines = doc.splitTextToSize(bp.description, contentWidth - 160);
        doc.text(lines, margin + 130, bulletY);

        bulletY += Math.max(16, lines.length * 10 + 4);
      });

      curY += 152;
    });

    // PAGE 3: GATEWAY BRACKET & WATERPROOF WIRING
    doc.addPage();
    currentPage = 3;
    drawHeader(currentPage, totalPages);
    curY = 80;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Gateway Bracket & Waterproof PoE Wiring', margin, curY);
    curY += 20;

    const stepsPage3 = GATEWAY_GUIDE_STEPS.slice(5, 8); // Steps 05, 06, 07
    stepsPage3.forEach((step) => {
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
      doc.roundedRect(margin, curY, contentWidth, 140, 6, 6, 'FD');

      doc.setFillColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.rect(margin + 12, curY + 12, 60, 16, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`STEP ${step.stepNumber}`, margin + 42, curY + 23, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(step.stepTitle, margin + 80, curY + 24);

      let bulletY = curY + 44;
      step.bulletPoints.slice(0, 4).forEach((bp, bIdx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text(`${bIdx + 1}.`, margin + 14, bulletY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text(`${bp.title}:`, margin + 28, bulletY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        const lines = doc.splitTextToSize(bp.description, contentWidth - 160);
        doc.text(lines, margin + 130, bulletY);

        bulletY += Math.max(16, lines.length * 10 + 4);
      });

      curY += 152;
    });

    // PAGE 4: FINAL CHECKS & VERIFICATION
    doc.addPage();
    currentPage = 4;
    drawHeader(currentPage, totalPages);
    curY = 80;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Final Checks & Cloud Verification', margin, curY);
    curY += 20;

    // Final Checks Checklist Box
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, 160, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('08 • Pre-Power Final Checklist', margin + 16, curY + 24);

    const checklistItems = [
      '1. All fasteners, lag bolts & pipe clamps are torqued tight.',
      '2. Antenna mast is plumb on both axes, level, and mechanically secure.',
      '3. Top of the Unistrut channel is capped/sealed against water intrusion.',
      '4. Gateway-side cable enters through the water-tight connector gland with seated grommet.',
      '5. RJ45 termination follows strict T568B pinout and tested on both ends.',
    ];

    let checkY = curY + 44;
    checklistItems.forEach((item) => {
      doc.setFillColor(colors.accentSky[0], colors.accentSky[1], colors.accentSky[2]);
      doc.circle(margin + 22, checkY - 3, 4, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      doc.text(item, margin + 34, checkY);
      checkY += 22;
    });
    curY += 180;

    // Three-Phase Sign-Off Box
    doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
    doc.roundedRect(margin, curY, contentWidth, 120, 8, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("You're ready to go: Final Completion Check", margin + 16, curY + 24);

    const phaseCols = [
      { num: '01', title: 'MOUNTING', sub: 'Secure & sealed' },
      { num: '02', title: 'WIRING', sub: 'Gateway & PoE connected' },
      { num: '03', title: 'CONNECTIVITY', sub: 'Verify with Quext' },
    ];

    const colWidth = (contentWidth - 32) / 3;
    phaseCols.forEach((col, idx) => {
      const colX = margin + 16 + idx * colWidth;
      doc.setFillColor(59, 7, 100);
      doc.roundedRect(colX, curY + 38, colWidth - 8, 48, 4, 4, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(192, 132, 252);
      doc.text(`${col.num} ${col.title}`, colX + 10, curY + 56);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(226, 232, 240);
      doc.text(col.sub, colX + 10, curY + 72);
    });

    curY += 140;

    // Support hotline banner
    doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
    doc.setDrawColor(colors.headerBrand[0], colors.headerBrand[1], colors.headerBrand[2]);
    doc.roundedRect(margin, curY, contentWidth, 48, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
    doc.text(
      `Call Quext Support on Site: ${GATEWAY_GUIDE_METADATA.supportHotline}`,
      pageWidth / 2,
      curY + 28,
      { align: 'center' }
    );

    // Save and download
    const filename = `Quext_Smart_Community_Gateway_Installation_Guide_${theme}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error('Error generating Gateway PDF guide:', err);
    throw err;
  }
};
