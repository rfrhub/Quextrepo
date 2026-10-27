import { jsPDF } from 'jspdf';
import {
  GATEWAY_GUIDE_METADATA,
  GATEWAY_REQUIRED_MATERIALS,
  GATEWAY_GUIDE_STEPS,
} from '../data/gatewayGuideData';
import {
  INSIDE_ROOF_WALL_MOUNT_B64,
  OUTSIDE_ROOF_MOUNT_B64,
  GATEWAY_MOUNTING_BRACKET_B64,
  WATERPROOF_POE_ANTENNA_B64,
} from '../data/gatewayPdfImages';

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
    const margin = 40;
    const contentWidth = pageWidth - margin * 2; // 532 pt

    const colors = {
      pageBg: isDark ? [15, 18, 28] : [255, 255, 255],
      headerBg: isDark ? [24, 30, 48] : [15, 23, 42],
      headerBrand: isDark ? [192, 132, 252] : [147, 51, 234],
      titleText: isDark ? [255, 255, 255] : [15, 23, 42],
      subTitleText: isDark ? [216, 180, 254] : [126, 34, 206],
      descText: isDark ? [203, 213, 225] : [71, 85, 105],
      bodyText: isDark ? [226, 232, 240] : [51, 65, 85],
      cardBg: isDark ? [20, 27, 44] : [248, 250, 252],
      cardBorder: isDark ? [45, 55, 75] : [226, 232, 240],
      badgeBg: isDark ? [59, 7, 100] : [243, 232, 255],
      badgeText: isDark ? [216, 180, 254] : [126, 34, 206],
      accentPurple: [147, 51, 234],
      accentSky: [2, 132, 199],
      footerText: isDark ? [148, 163, 184] : [120, 130, 145],
    };

    const drawHeader = (pageNum: number, totalPagesCount: number) => {
      // Header background
      doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
      doc.rect(0, 0, pageWidth, 52, 'F');

      // Accent color stripe
      doc.setFillColor(colors.headerBrand[0], colors.headerBrand[1], colors.headerBrand[2]);
      doc.rect(0, 0, pageWidth, 3, 'F');

      // Wordmark
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('QUEXT', margin, 32);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(203, 213, 225);
      doc.text('Smart Community Partner Academy · OEM Field SOP', margin + 60, 32);

      // Support hotline
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(192, 132, 252);
      doc.text(GATEWAY_GUIDE_METADATA.supportHotline, pageWidth - margin, 32, { align: 'right' });

      // Footer
      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
      doc.setLineWidth(1);
      doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.footerText[0], colors.footerText[1], colors.footerText[2]);
      doc.text(
        `${GATEWAY_GUIDE_METADATA.title} · ${GATEWAY_GUIDE_METADATA.documentCode} · Revision: ${GATEWAY_GUIDE_METADATA.revisionDate}`,
        margin,
        pageHeight - 20
      );
      doc.text(`Page ${pageNum} of ${totalPagesCount}`, pageWidth - margin, pageHeight - 20, {
        align: 'right',
      });
    };

    const totalPages = 4;

    // ==========================================
    // PAGE 1: TITLE, SPECS & MATERIALS BOM
    // ==========================================
    let currentPage = 1;
    drawHeader(currentPage, totalPages);
    let curY = 74;

    // Document Title Banner
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text(GATEWAY_GUIDE_METADATA.title, margin, curY);
    curY += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
    doc.text(
      'Official Standard Operating Procedure (SOP) for Multi-Family LoRaWAN Macro Base Station Deployment',
      margin,
      curY
    );
    curY += 20;

    // Target Hardware Specifications Box
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, 68, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Target Hardware Specification & Radio Architecture', margin + 14, curY + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(`• Device: ${GATEWAY_GUIDE_METADATA.targetDevice}`, margin + 14, curY + 32);
    doc.text(`• Radio: ${GATEWAY_GUIDE_METADATA.antennaType}`, margin + 14, curY + 45);
    doc.text(
      `• Power: 48V-56V Active PoE (802.3af/at) · Direct Field Hotline: ${GATEWAY_GUIDE_METADATA.supportHotline}`,
      margin + 14,
      curY + 58
    );
    curY += 80;

    // Required Materials BOM Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Required Materials & Tools for Installation (BOM)', margin, curY);
    curY += 14;

    // Table Header
    doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
    doc.rect(margin, curY, contentWidth, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
    doc.text('Material / Component', margin + 8, curY + 12);
    doc.text('Quantity / Spec', margin + 210, curY + 12);
    doc.text('Installation Purpose', margin + 330, curY + 12);
    curY += 18;

    GATEWAY_REQUIRED_MATERIALS.forEach((mat, idx) => {
      const isEven = idx % 2 === 0;
      doc.setFillColor(
        isEven ? colors.cardBg[0] : (colors.pageBg[0] as number),
        isEven ? colors.cardBg[1] : (colors.pageBg[1] as number),
        isEven ? colors.cardBg[2] : (colors.pageBg[2] as number)
      );
      doc.rect(margin, curY, contentWidth, 20, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(mat.item, margin + 8, curY + 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      doc.text(mat.qty, margin + 210, curY + 13);
      doc.text(mat.purpose, margin + 330, curY + 13);

      curY += 20;
    });

    curY += 16;

    // EIA/TIA-568B Pinout Standard Reference Box
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, 90, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('EIA/TIA-568B RJ45 Color Pinout Standard (Strictly Enforced)', margin + 14, curY + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(
      'Both the outdoor gateway gland and the indoor data closet must be terminated 1:1 with T568B standard.',
      margin + 14,
      curY + 30
    );

    const pins1 = ['Pin 1: White/Orange', 'Pin 2: Orange', 'Pin 3: White/Green', 'Pin 4: Blue'];
    const pins2 = ['Pin 5: White/Blue', 'Pin 6: Green', 'Pin 7: White/Brown', 'Pin 8: Brown'];

    let pinY = curY + 46;
    pins1.forEach((p, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.text(p, margin + 14 + idx * 128, pinY);
    });
    pinY += 16;
    pins2.forEach((p, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.text(p, margin + 14 + idx * 128, pinY);
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text('PoE: Pins 1, 2, 3, 6 = Data (10/100 Mbps) · Pins 4, 5 (+) and 7, 8 (-) = 48V-56V DC Power', margin + 14, curY + 80);

    // ==========================================
    // PAGE 2: STEPS 01, 02, 03 & FIELD PHOTOS (INSIDE VS OUTSIDE)
    // ==========================================
    doc.addPage();
    currentPage = 2;
    drawHeader(currentPage, totalPages);
    curY = 72;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Phase 1: Pre-Installation, Scope & Mounting Location Geometry', margin, curY);
    curY += 16;

    // Step 01 & Step 02 Compact Cards
    const step1 = GATEWAY_GUIDE_STEPS[0];
    const step2 = GATEWAY_GUIDE_STEPS[1];

    [step1, step2].forEach((st) => {
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
      doc.roundedRect(margin, curY, contentWidth, 78, 6, 6, 'FD');

      doc.setFillColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.roundedRect(margin + 10, curY + 10, 52, 14, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`STEP ${st.stepNumber}`, margin + 36, curY + 20, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(st.stepTitle, margin + 68, curY + 21);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      doc.text(st.summary, margin + 12, curY + 36, { maxWidth: contentWidth - 24 });

      // Bullets
      let bY = curY + 50;
      st.bulletPoints.slice(0, 2).forEach((bp) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text(`• ${bp.title}:`, margin + 12, bY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        const textLines = doc.splitTextToSize(bp.description, contentWidth - 140);
        doc.text(textLines, margin + 120, bY);
        bY += 12;
      });

      curY += 86;
    });

    curY += 6;

    // STEP 03 CARD WITH EMBEDDED DUAL FIELD PHOTOS (INSIDE VS OUTSIDE)
    const step3 = GATEWAY_GUIDE_STEPS[2];
    const step3Height = 360;

    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, step3Height, 6, 6, 'FD');

    doc.setFillColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
    doc.roundedRect(margin + 10, curY + 10, 52, 14, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`STEP ${step3.stepNumber}`, margin + 36, curY + 20, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text(step3.stepTitle, margin + 68, curY + 21);

    // Bullets for Step 03
    let s3bY = curY + 36;
    step3.bulletPoints.slice(0, 3).forEach((bp) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.text(`• ${bp.title}:`, margin + 12, s3bY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      const lines = doc.splitTextToSize(bp.description, contentWidth - 160);
      doc.text(lines, margin + 140, s3bY);
      s3bY += 12;
    });

    // Dual Field Photo Section (Inside Roof Wall Mount & Outside Roof Mount)
    const photoY = curY + 76;
    const photoCardW = (contentWidth - 28) / 2; // ~252 pt each
    const photoCardH = 270;

    // Photo 1: Inside Roof Wall Mount Box
    doc.setFillColor(isDark ? 10 : 240, isDark ? 14 : 243, isDark ? 24 : 246);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin + 10, photoY, photoCardW, photoCardH, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('INSIDE ROOF WALL MOUNT', margin + 18, photoY + 14);

    // Embed Inside Roof Wall Mount JPEG directly
    try {
      doc.addImage(
        INSIDE_ROOF_WALL_MOUNT_B64,
        'JPEG',
        margin + 10 + (photoCardW - 105) / 2,
        photoY + 22,
        105,
        198,
        undefined,
        'FAST'
      );
    } catch (err) {
      console.warn('Inside image insertion:', err);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(
      'Protected interior parapet: Unistrut backplane mounted to wall with EMT conduit mast extending antenna above roofline.',
      margin + 16,
      photoY + 232,
      { maxWidth: photoCardW - 16 }
    );

    // Photo 2: Outside Roof Mount Box
    const photo2X = margin + 18 + photoCardW;
    doc.setFillColor(isDark ? 10 : 240, isDark ? 14 : 243, isDark ? 24 : 246);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(photo2X, photoY, photoCardW, photoCardH, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('OUTSIDE ROOF MOUNT', photo2X + 8, photoY + 14);

    // Embed Outside Roof Mount JPEG directly
    try {
      doc.addImage(
        OUTSIDE_ROOF_MOUNT_B64,
        'JPEG',
        photo2X + (photoCardW - 118) / 2,
        photoY + 22,
        118,
        198,
        undefined,
        'FAST'
      );
    } catch (err) {
      console.warn('Outside image insertion:', err);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(
      'Exterior building wall: Ladder access with EMT conduit mast extended above building cornice for 360° radio coverage.',
      photo2X + 8,
      photoY + 232,
      { maxWidth: photoCardW - 16 }
    );

    // ==========================================
    // PAGE 3: STEPS 04, 05, 06 & GATEWAY BRACKET PHOTO
    // ==========================================
    doc.addPage();
    currentPage = 3;
    drawHeader(currentPage, totalPages);
    curY = 72;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Phase 2: Weatherproof Anchoring & Mechanical Bracket Mounting', margin, curY);
    curY += 16;

    // Step 04 & Step 05 Cards
    const step4 = GATEWAY_GUIDE_STEPS[3];
    const step5 = GATEWAY_GUIDE_STEPS[4];

    [step4, step5].forEach((st) => {
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
      doc.roundedRect(margin, curY, contentWidth, 90, 6, 6, 'FD');

      doc.setFillColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.roundedRect(margin + 10, curY + 10, 52, 14, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`STEP ${st.stepNumber}`, margin + 36, curY + 20, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(st.stepTitle, margin + 68, curY + 21);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      doc.text(st.summary, margin + 12, curY + 36, { maxWidth: contentWidth - 24 });

      let bY = curY + 50;
      st.bulletPoints.slice(0, 3).forEach((bp) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text(`• ${bp.title}:`, margin + 12, bY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        const lines = doc.splitTextToSize(bp.description, contentWidth - 160);
        doc.text(lines, margin + 140, bY);
        bY += 12;
      });

      curY += 98;
    });

    curY += 6;

    // STEP 06 CARD WITH GATEWAY BRACKET MOUNTING PHOTO
    const step6 = GATEWAY_GUIDE_STEPS[5];
    const step6Height = 330;

    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, step6Height, 6, 6, 'FD');

    doc.setFillColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
    doc.roundedRect(margin + 10, curY + 10, 52, 14, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`STEP ${step6.stepNumber}`, margin + 36, curY + 20, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text(step6.stepTitle, margin + 68, curY + 21);

    // Left Column: Step 06 Text & Execution Bullets (Width: 260 pt)
    const s6TextW = 250;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(step6.summary, margin + 12, curY + 38, { maxWidth: s6TextW });

    let s6bY = curY + 62;
    step6.bulletPoints.forEach((bp, bIdx) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.text(`${bIdx + 1}.`, margin + 12, s6bY);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(bp.title, margin + 24, s6bY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      const lines = doc.splitTextToSize(bp.description, s6TextW);
      doc.text(lines, margin + 24, s6bY + 11);
      s6bY += 16 + lines.length * 9;
    });

    // Right Column: Bracket Mounting Photo Box (Width: 250 pt)
    const bracketPhotoX = margin + 270;
    const bracketPhotoY = curY + 34;
    const bracketPhotoW = contentWidth - 276;
    const bracketPhotoH = 280;

    doc.setFillColor(isDark ? 10 : 240, isDark ? 14 : 243, isDark ? 24 : 246);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(bracketPhotoX, bracketPhotoY, bracketPhotoW, bracketPhotoH, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('GATEWAY MOUNTING BRACKET', bracketPhotoX + 10, bracketPhotoY + 14);

    // Embed Gateway Mounting Bracket JPEG directly
    try {
      doc.addImage(
        GATEWAY_MOUNTING_BRACKET_B64,
        'JPEG',
        bracketPhotoX + (bracketPhotoW - 120) / 2,
        bracketPhotoY + 22,
        120,
        226,
        undefined,
        'FAST'
      );
    } catch (err) {
      console.warn('Bracket image insertion:', err);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(
      'Technician securing powder-coated bracket to horizontal Unistrut channels with Grade 5 bolts.',
      bracketPhotoX + 10,
      bracketPhotoY + 262,
      { maxWidth: bracketPhotoW - 16 }
    );

    // ==========================================
    // PAGE 4: STEPS 07, 08, 09, 10 & POE PHOTO & SIGN-OFF
    // ==========================================
    doc.addPage();
    currentPage = 4;
    drawHeader(currentPage, totalPages);
    curY = 72;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('Phase 3: Waterproof Wiring, PoE Injection & Live Field Sign-Off', margin, curY);
    curY += 16;

    // STEP 07 CARD WITH WATERPROOF POE & ANTENNA PHOTO
    const step7 = GATEWAY_GUIDE_STEPS[6];
    const step7Height = 240;

    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, step7Height, 6, 6, 'FD');

    doc.setFillColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
    doc.roundedRect(margin + 10, curY + 10, 52, 14, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`STEP ${step7.stepNumber}`, margin + 36, curY + 20, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text(step7.stepTitle, margin + 68, curY + 21);

    // Left Column: Step 07 Text & Bullets (Width: 260 pt)
    const s7TextW = 250;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(step7.summary, margin + 12, curY + 36, { maxWidth: s7TextW });

    let s7bY = curY + 56;
    step7.bulletPoints.forEach((bp, bIdx) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
      doc.text(`${bIdx + 1}.`, margin + 12, s7bY);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(bp.title, margin + 24, s7bY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      const lines = doc.splitTextToSize(bp.description, s7TextW);
      doc.text(lines, margin + 24, s7bY + 10);
      s7bY += 14 + lines.length * 8;
    });

    // Right Column: Waterproof PoE Photo Box (Width: 250 pt)
    const poePhotoX = margin + 270;
    const poePhotoY = curY + 32;
    const poePhotoW = contentWidth - 276;
    const poePhotoH = 196;

    doc.setFillColor(isDark ? 10 : 240, isDark ? 14 : 243, isDark ? 24 : 246);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(poePhotoX, poePhotoY, poePhotoW, poePhotoH, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text('WATERPROOF POE & ANTENNA', poePhotoX + 8, poePhotoY + 13);

    // Embed Waterproof PoE & Antenna JPEG directly
    try {
      doc.addImage(
        WATERPROOF_POE_ANTENNA_B64,
        'JPEG',
        poePhotoX + (poePhotoW - 95) / 2,
        poePhotoY + 20,
        95,
        150,
        undefined,
        'FAST'
      );
    } catch (err) {
      console.warn('PoE image insertion:', err);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text(
      'IP67 compression gland sealed for PoE & N-type RF antenna coax with downward drip loop.',
      poePhotoX + 8,
      poePhotoY + 180,
      { maxWidth: poePhotoW - 14 }
    );

    curY += step7Height + 12;

    // STEP 08 & 09 COMPACT BOX
    const step8 = GATEWAY_GUIDE_STEPS[7];
    const step9 = GATEWAY_GUIDE_STEPS[8];

    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, 80, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text(`Step ${step8.stepNumber}: ${step8.stepTitle}`, margin + 12, curY + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text('Plug gateway roof cable strictly into "POE" port of injector. Plug "LAN" port to switch/cellular router.', margin + 12, curY + 28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
    doc.text(`Step ${step9.stepNumber}: Pre-Power 5-Point Mechanical Checklist`, margin + 12, curY + 44);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
    doc.text('1. Torqued fasteners · 2. Plumb antenna mast · 3. Unistrut sealed · 4. IP67 gland compressed · 5. 1:1 T568B test pass.', margin + 12, curY + 56);
    doc.text('CRITICAL: Never connect standard network switch to POE port. Always use battery-backed UPS AC power.', margin + 12, curY + 68);

    curY += 90;

    // STEP 10: OFFICIAL FIELD SIGN-OFF CERTIFICATE BOX
    doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
    doc.roundedRect(margin, curY, contentWidth, 140, 8, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('Step 10: Official Field Installation Sign-Off & Commissioning', margin + 16, curY + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(
      `Call Quext Support directly from the roof/jobsite: ${GATEWAY_GUIDE_METADATA.supportHotline} (OPTION 4).`,
      margin + 16,
      curY + 36
    );

    // Sign-Off Form Fields (Grid)
    const soY = curY + 48;
    const colW = (contentWidth - 32) / 3;

    const fields = [
      { label: 'Installer Full Name', val: '_______________________' },
      { label: 'Partner Integrator Company', val: '_______________________' },
      { label: 'Installation Date', val: '_______________________' },
      { label: 'Gateway MAC Address', val: '_______________________' },
      { label: 'Gateway Serial Number', val: '_______________________' },
      { label: 'Quext Engineer Sign-Off', val: '_______________________' },
    ];

    fields.forEach((f, fIdx) => {
      const fCol = fIdx % 3;
      const fRow = Math.floor(fIdx / 3);
      const fx = margin + 16 + fCol * colW;
      const fy = soY + fRow * 32;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(192, 132, 252);
      doc.text(f.label, fx, fy);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(f.val, fx, fy + 14);
    });

    // Save and download our own generated PDF
    const filename = `Quext_Smart_Community_Gateway_Installation_Guide_${theme === 'dark' ? 'Digital' : 'Print'}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error('Error generating Gateway PDF guide:', err);
    throw err;
  }
};
