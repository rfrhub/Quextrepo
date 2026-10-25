import { jsPDF } from 'jspdf';
import { QR_INTERCOM_GUIDE_STEPS, PLAQUE_SPECS, IntercomStep } from '../data/qrIntercomGuideData';

export interface QrIntercomPdfOptions {
  theme?: 'white' | 'dark';
}

export const generateAndDownloadQrIntercomPdf = (options: QrIntercomPdfOptions = {}) => {
  const { theme = 'white' } = options;
  const isDark = theme === 'dark';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 612 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 792 pt
  const margin = 38;
  const contentWidth = pageWidth - margin * 2; // 536 pt

  const colors = {
    pageBg: isDark ? [10, 14, 24] : [255, 255, 255],
    cardBg: isDark ? [17, 24, 39] : [248, 250, 252],
    titleBlue: isDark ? [96, 165, 250] : [37, 99, 235],
    titlePurple: isDark ? [192, 132, 252] : [124, 58, 237],
    headingText: isDark ? [255, 255, 255] : [17, 24, 39],
    subHeadingText: isDark ? [203, 213, 225] : [75, 85, 99],
    bodyText: isDark ? [226, 232, 240] : [31, 41, 55],
    mutedText: isDark ? [148, 163, 184] : [100, 116, 139],
    borderLight: isDark ? [45, 55, 75] : [226, 232, 240],
    borderAccent: isDark ? [79, 70, 229] : [99, 102, 241],
    tagBg: isDark ? [49, 46, 129] : [238, 242, 255],
    tagText: isDark ? [199, 210, 254] : [67, 56, 202],
    plaqueBg: isDark ? [226, 232, 240] : [241, 245, 249],
    plaqueText: [15, 23, 42],
    phoneShell: [24, 30, 42],
    phoneScreen: [13, 19, 34],
    phoneBorder: [51, 65, 85]
  };

  const drawPageBackground = () => {
    doc.setFillColor(colors.pageBg[0], colors.pageBg[1], colors.pageBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  const drawRunningHeader = (categoryText?: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text('QR Intercom Plaque Integration Guide', margin, 24);
    doc.text(
      categoryText ? `${categoryText.toUpperCase()} · GEOKEY ACCESS` : 'QUEXT FIELD OPERATIONS · GEOKEY ACCESS',
      pageWidth - margin,
      24,
      { align: 'right' }
    );

    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 30, pageWidth - margin, 30);
  };

  // Helper to draw clean wrapped text without roll-off
  const drawWrappedText = (
    text: string,
    x: number,
    y: number,
    maxW: number,
    lineH: number = 13
  ): number => {
    const lines = doc.splitTextToSize(text, maxW);
    doc.text(lines, x, y);
    return lines.length * lineH;
  };

  // =========================================================================
  // VECTOR ICON DRAWING HELPERS (Avoid unicode emoji clipping / character roll-off)
  // =========================================================================
  const drawVectorKey = (
    kx: number,
    ky: number,
    kw: number = 10,
    kh: number = 6,
    color = [15, 23, 42]
  ) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setFillColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.8);
    // Key ring head
    doc.circle(kx + 2.5, ky + kh / 2, 2.3, 'S');
    // Key shaft
    doc.line(kx + 4.8, ky + kh / 2, kx + kw, ky + kh / 2);
    // Key notch teeth
    doc.line(kx + kw - 2.5, ky + kh / 2, kx + kw - 2.5, ky + kh / 2 + 2.2);
    doc.line(kx + kw - 0.5, ky + kh / 2, kx + kw - 0.5, ky + kh / 2 + 1.8);
  };

  const drawVectorCamera = (
    cx: number,
    cy: number,
    cw: number = 11,
    ch: number = 8,
    color = [255, 255, 255]
  ) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(cx, cy, cw - 4, ch, 1.2, 1.2, 'F');
    // Triangular projection lens on right
    doc.triangle(cx + cw - 3, cy + ch / 2 - 2.5, cx + cw, cy + 0.5, cx + cw, cy + ch - 0.5, 'F');
  };

  const drawVectorPhone = (
    px: number,
    py: number,
    pw: number = 10,
    ph: number = 10,
    color = [255, 255, 255]
  ) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(1.6);
    // Handset receiver line with rounded ends
    doc.line(px + 1.5, py + ph - 2, px + pw - 2, py + 1.5);
    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(px + 1.8, py + ph - 1.8, 1.6, 'F');
    doc.circle(px + pw - 1.8, py + 1.8, 1.6, 'F');
  };

  const drawVectorLock = (
    lx: number,
    ly: number,
    lw: number = 8,
    lh: number = 9,
    color = [147, 197, 253]
  ) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setFillColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.7);
    // Shackle arch
    doc.roundedRect(lx + 1.5, ly, lw - 3, 4, 1.5, 1.5, 'S');
    // Body box
    doc.roundedRect(lx, ly + 3.2, lw, lh - 3.2, 1.2, 1.2, 'F');
    // Center keyhole
    doc.setFillColor(15, 23, 42);
    doc.circle(lx + lw / 2, ly + 5.5, 0.7, 'F');
  };

  const drawVectorLink = (
    lx: number,
    ly: number,
    color = [15, 23, 42]
  ) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(lx, ly, 5, 3.5, 1, 1, 'S');
    doc.roundedRect(lx + 3.5, ly + 1.5, 5, 3.5, 1, 1, 'S');
  };

  // Helper: Draw Standalone Pure Isolated Plaque Schematic
  const drawPurePlaque = (
    x: number,
    y: number,
    w: number,
    h: number,
    type: 'vertical' | 'horizontal'
  ) => {
    // Plaque Body (Stainless Steel / Anodized Finish)
    doc.setFillColor(235, 240, 245);
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.75);
    doc.roundedRect(x, y, w, h, 3, 3, 'FD');

    // Horizontal brush texture lines
    doc.setDrawColor(215, 222, 230);
    doc.setLineWidth(0.35);
    const step = 8;
    for (let ty = y + 5; ty < y + h - 5; ty += step) {
      doc.line(x + 4, ty, x + w - 4, ty);
    }

    // 4 Corner Screws (Stainless Machine Screws)
    const screwInset = 4.5;
    const screwR = 1.6;
    doc.setFillColor(71, 85, 105);
    doc.circle(x + screwInset, y + screwInset, screwR, 'F');
    doc.circle(x + w - screwInset, y + screwInset, screwR, 'F');
    doc.circle(x + screwInset, y + h - screwInset, screwR, 'F');
    doc.circle(x + w - screwInset, y + h - screwInset, screwR, 'F');

    // Screw slots
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.35);
    doc.line(x + screwInset - 1, y + screwInset, x + screwInset + 1, y + screwInset);
    doc.line(x + w - screwInset - 1, y + screwInset, x + w - screwInset + 1, y + screwInset);
    doc.line(x + screwInset - 1, y + h - screwInset, x + screwInset + 1, y + h - screwInset);
    doc.line(x + w - screwInset - 1, y + h - screwInset, x + w - screwInset + 1, y + h - screwInset);

    if (type === 'vertical') {
      // Laser Etched Property Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5);
      doc.setTextColor(30, 41, 59);
      doc.text('TAMARIN RIDGE', x + w / 2, y + 11, { align: 'center' });

      doc.setDrawColor(71, 85, 105);
      doc.setLineWidth(0.4);
      doc.line(x + 12, y + 14, x + w - 12, y + 14);

      // Central Isolated QR Code
      const qrW = 42;
      const qrH = 42;
      const qrX = x + (w - qrW) / 2;
      const qrY = y + 17;

      doc.setFillColor(15, 23, 42);
      doc.rect(qrX, qrY, qrW, qrH, 'F');

      // QR Corner Anchors (White and Inner Black)
      doc.setFillColor(255, 255, 255);
      doc.rect(qrX + 3, qrY + 3, 11, 11, 'F');
      doc.rect(qrX + qrW - 14, qrY + 3, 11, 11, 'F');
      doc.rect(qrX + 3, qrY + qrH - 14, 11, 11, 'F');

      doc.setFillColor(15, 23, 42);
      doc.rect(qrX + 5.5, qrY + 5.5, 6, 6, 'F');
      doc.rect(qrX + qrW - 11.5, qrY + 5.5, 6, 6, 'F');
      doc.rect(qrX + 5.5, qrY + qrH - 11.5, 6, 6, 'F');

      // Random data matrix simulation blocks
      doc.setFillColor(255, 255, 255);
      doc.rect(qrX + 17, qrY + 6, 8, 3, 'F');
      doc.rect(qrX + 17, qrY + 12, 4, 4, 'F');
      doc.rect(qrX + 6, qrY + 17, 3, 8, 'F');
      doc.rect(qrX + 15, qrY + 19, 12, 4, 'F');
      doc.rect(qrX + 31, qrY + 17, 5, 8, 'F');
      doc.rect(qrX + 17, qrY + 27, 8, 3, 'F');
      doc.rect(qrX + 17, qrY + 33, 4, 4, 'F');

      // Plaque Footer Marking
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(4);
      doc.setTextColor(71, 85, 105);
      doc.text('GEOKEY INTERCOM', x + w / 2, y + h - 5, { align: 'center' });
    } else {
      // Horizontal Plaque Dual Zone
      const qrSize = 34;
      const qrX = x + 8;
      const qrY = y + (h - qrSize) / 2;

      doc.setFillColor(15, 23, 42);
      doc.rect(qrX, qrY, qrSize, qrSize, 'F');

      doc.setFillColor(255, 255, 255);
      doc.rect(qrX + 2.5, qrY + 2.5, 9, 9, 'F');
      doc.rect(qrX + qrSize - 11.5, qrY + 2.5, 9, 9, 'F');
      doc.rect(qrX + 2.5, qrY + qrSize - 11.5, 9, 9, 'F');

      doc.setFillColor(15, 23, 42);
      doc.rect(qrX + 4.5, qrY + 4.5, 5, 5, 'F');
      doc.rect(qrX + qrSize - 9.5, qrY + 4.5, 5, 5, 'F');
      doc.rect(qrX + 4.5, qrY + qrSize - 9.5, 5, 5, 'F');

      // Right zone: Lockmark and Branding
      const rx = x + qrSize + 14;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text('GEOKEY', rx, y + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5);
      doc.setTextColor(71, 85, 105);
      doc.text('TOUCHLESS ENTRY', rx, y + 25);
      doc.text('SCAN QR TO CALL', rx, y + 33);
    }
  };

  // =========================================================================
  // HELPER: DRAW AUTHENTIC IPHONE DEVICE MOCKUP SCREENSHOT
  // =========================================================================
  const drawIPhoneMockup = (
    phoneX: number,
    phoneY: number,
    phoneW: number,
    phoneH: number,
    step: IntercomStep
  ) => {
    // 1. Outer Dark Titanium Chassis
    doc.setFillColor(colors.phoneShell[0], colors.phoneShell[1], colors.phoneShell[2]);
    doc.setDrawColor(colors.phoneBorder[0], colors.phoneBorder[1], colors.phoneBorder[2]);
    doc.setLineWidth(1.1);
    doc.roundedRect(phoneX, phoneY, phoneW, phoneH, 20, 20, 'FD');

    // Side Physical Buttons (Volume buttons on left, Power on right)
    doc.setFillColor(colors.phoneBorder[0], colors.phoneBorder[1], colors.phoneBorder[2]);
    doc.roundedRect(phoneX - 2.2, phoneY + 60, 2.2, 24, 1, 1, 'F'); // Vol Up
    doc.roundedRect(phoneX - 2.2, phoneY + 92, 2.2, 24, 1, 1, 'F'); // Vol Down
    doc.roundedRect(phoneX + phoneW, phoneY + 76, 2.2, 34, 1, 1, 'F'); // Power/Action

    // 2. Screen Display Viewport
    const screenX = phoneX + 6.5;
    const screenY = phoneY + 6.5;
    const screenW = phoneW - 13;
    const screenH = phoneH - 13;

    doc.setFillColor(colors.phoneScreen[0], colors.phoneScreen[1], colors.phoneScreen[2]);
    doc.roundedRect(screenX, screenY, screenW, screenH, 15, 15, 'F');

    // 3. Dynamic Island Pill
    const diW = 50;
    const diH = 12;
    const diX = phoneX + phoneW / 2 - diW / 2;
    const diY = screenY + 6;

    doc.setFillColor(0, 0, 0);
    doc.roundedRect(diX, diY, diW, diH, 6, 6, 'F');

    // Mini camera lens dot
    doc.setFillColor(30, 41, 59);
    doc.circle(diX + diW - 10, diY + diH / 2, 2, 'F');

    // 4. iOS Status Bar
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text('9:41', screenX + 10, screenY + 14.5);

    // Battery & Signal Indicators
    const batX = screenX + screenW - 20;
    const batY = screenY + 9;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.roundedRect(batX, batY, 12, 6, 1.2, 1.2, 'S');
    doc.setFillColor(34, 197, 94); // Green Battery
    doc.rect(batX + 1.2, batY + 1.2, 8, 3.6, 'F');

    // 5. iOS Home Indicator Bar
    const hiW = 38;
    const hiH = 2.5;
    const hiX = phoneX + phoneW / 2 - hiW / 2;
    const hiY = screenY + screenH - 7;
    doc.setFillColor(203, 213, 225);
    doc.roundedRect(hiX, hiY, hiW, hiH, 1.25, 1.25, 'F');

    // =========================================================================
    // 6. STEP-SPECIFIC IN-SCREEN UI SCREENSHOT GRAPHICS
    // =========================================================================
    const contentY = screenY + 26;
    const usableW = screenW - 14;
    const cx = screenX + 7;

    switch (step.mockupType) {
      // -----------------------------------------------------------------------
      // STEP 1: Portal Custom Settings (Admin Portal view on iPhone)
      // -----------------------------------------------------------------------
      case 'portal_settings': {
        // Portal Header
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(cx, contentY, usableW, 19, 4, 4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(147, 197, 253);
        doc.text('Geokey Portal · Custom Settings', cx + 6, contentY + 12.5);

        // Toggle: Enable Intercom
        let sy = contentY + 24;
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(cx, sy, usableW, 24, 4, 4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(255, 255, 255);
        doc.text('Enable Intercom System', cx + 6, sy + 15);

        // Active Toggle Switch
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(cx + usableW - 22, sy + 7, 16, 9, 4.5, 4.5, 'F');
        doc.setFillColor(255, 255, 255);
        doc.circle(cx + usableW - 10, sy + 11.5, 3.5, 'F');

        // Form Fields
        sy += 29;
        const fields = [
          { label: 'System Name', value: 'Westline Intercom System' },
          { label: 'QR Code Geofence', value: '150 Meters Radius' },
          { label: 'Landing Page URL', value: 'westlineflanagan.geokeyaccess.com' }
        ];

        fields.forEach((f) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(5);
          doc.setTextColor(148, 163, 184);
          doc.text(f.label, cx, sy + 6);

          doc.setFillColor(15, 23, 42);
          doc.setDrawColor(51, 65, 85);
          doc.setLineWidth(0.5);
          doc.roundedRect(cx, sy + 8, usableW, 18, 3, 3, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(5.8);
          doc.setTextColor(255, 255, 255);
          doc.text(f.value, cx + 5, sy + 20);

          sy += 33;
        });

        // Brand Color Palettes
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5);
        doc.setTextColor(148, 163, 184);
        doc.text('Brand Theme Colors', cx, sy + 6);
        sy += 9;

        doc.setFillColor(30, 41, 59);
        doc.roundedRect(cx, sy, usableW, 26, 4, 4, 'F');

        // Color Swatches
        doc.setFillColor(30, 42, 74); // Navy
        doc.roundedRect(cx + 6, sy + 5, 15, 15, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5);
        doc.setTextColor(203, 213, 225);
        doc.text('Primary', cx + 24, sy + 14);

        doc.setFillColor(75, 119, 141); // Slate Cyan
        doc.roundedRect(cx + 74, sy + 5, 15, 15, 2, 2, 'F');
        doc.text('Secondary', cx + 92, sy + 14);

        // Save & Publish Button (Neatly centered with safe font)
        sy += 34;
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(cx, sy, usableW, 22, 5, 5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text('Save & Publish Landing Page', cx + usableW / 2, sy + 14, { align: 'center' });
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 2: iOS Camera App Scanning Plaque
      // -----------------------------------------------------------------------
      case 'qr_scan_badge': {
        // Camera Viewfinder Screen
        doc.setFillColor(5, 5, 8);
        doc.roundedRect(cx, contentY, usableW, 260, 6, 6, 'F');

        // Top Camera Status Indicators
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text('FLASH OFF', cx + 8, contentY + 12);
        doc.text('1x', cx + usableW / 2, contentY + 12, { align: 'center' });
        doc.text('HDR ON', cx + usableW - 8, contentY + 12, { align: 'right' });

        // Yellow Reticle Focus Brackets in Center
        const retX = cx + 16;
        const retY = contentY + 30;
        const retW = usableW - 32;
        const retH = 132;

        doc.setDrawColor(234, 179, 8); // iOS Yellow Scan Focus
        doc.setLineWidth(1.3);
        // Top-left
        doc.line(retX, retY, retX + 14, retY);
        doc.line(retX, retY, retX, retY + 14);
        // Top-right
        doc.line(retX + retW, retY, retX + retW - 14, retY);
        doc.line(retX + retW, retY, retX + retW, retY + 14);
        // Bottom-left
        doc.line(retX, retY + retH, retX + 14, retY + retH);
        doc.line(retX, retY + retH, retX, retY + retH - 14);
        // Bottom-right
        doc.line(retX + retW, retY + retH, retX + retW - 14, retY + retH);
        doc.line(retX + retW, retY + retH, retX + retW, retY + retH - 14);

        // Pure Isolated Plaque Visible inside the Viewfinder
        drawPurePlaque(retX + 20, retY + 12, retW - 40, retH - 24, 'vertical');

        // Yellow Safari Link Pop-up Pill (Text sized safely to never roll off pill)
        const popY = retY + retH + 12;
        const pillW = usableW - 14;
        const pillX = cx + 7;
        doc.setFillColor(234, 179, 8);
        doc.roundedRect(pillX, popY, pillW, 20, 10, 10, 'F');

        // Draw small vector link icon inside the yellow pill
        drawVectorLink(pillX + 12, popY + 7, [15, 23, 42]);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.8);
        doc.setTextColor(15, 23, 42);
        doc.text('westlineflanagan.geokeyaccess.com', pillX + pillW / 2 + 5, popY + 13, { align: 'center' });

        // Camera Bottom Shutter Control
        const camBotY = contentY + 228;
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1.2);
        doc.circle(cx + usableW / 2, camBotY, 15, 'S');
        doc.setFillColor(255, 255, 255);
        doc.circle(cx + usableW / 2, camBotY, 12, 'F');
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 3: Browser Landing Page & Geofence Verification
      // -----------------------------------------------------------------------
      case 'landing_page': {
        // Mobile Safari Address Bar
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(cx, contentY, usableW, 17, 4, 4, 'F');
        drawVectorLock(cx + 8, contentY + 4, 6.5, 8, [148, 163, 184]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.8);
        doc.setTextColor(148, 163, 184);
        doc.text('westlineflanagan.geokeyaccess.com', cx + usableW / 2 + 4, contentY + 11.5, { align: 'center' });

        // Geofence Verified Banner
        let ly = contentY + 22;
        doc.setFillColor(22, 101, 52); // Green
        doc.roundedRect(cx, ly, usableW, 16, 4, 4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.8);
        doc.setTextColor(255, 255, 255);
        doc.text('Location Verified · Within 150m Geofence', cx + usableW / 2, ly + 11, { align: 'center' });

        // Landing Page Main Card
        ly += 22;
        const mainH = 210;
        doc.setFillColor(30, 42, 74);
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.65);
        doc.roundedRect(cx, ly, usableW, mainH, 8, 8, 'FD');

        // Property Crest Headers (Generous spacing, zero overlap)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(147, 197, 253);
        doc.text('THE WESTLINE', cx + usableW / 2, ly + 25, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(255, 255, 255);
        doc.text('@ FLANAGAN LAKE', cx + usableW / 2, ly + 40, { align: 'center' });

        doc.setDrawColor(96, 165, 250);
        doc.setLineWidth(0.8);
        doc.line(cx + 26, ly + 48, cx + usableW - 26, ly + 48);

        // Action Buttons (Properly centered, sized safely so text never rolls off)
        const btnW = usableW - 24;
        const btnX = cx + 12;
        const btnH = 34;

        // Button 1: Leasing
        const btnY = ly + 68;
        doc.setFillColor(75, 119, 141);
        doc.roundedRect(btnX, btnY, btnW, btnH, 7, 7, 'F');
        drawVectorPhone(btnX + 32, btnY + 12, 10, 10, [255, 255, 255]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('Leasing', btnX + btnW / 2 + 8, btnY + 21.5, { align: 'center' });

        // Button 2: People
        const btn2Y = btnY + 44;
        doc.setFillColor(75, 119, 141);
        doc.roundedRect(btnX, btn2Y, btnW, btnH, 7, 7, 'F');
        // Small vector user icon
        doc.setFillColor(255, 255, 255);
        doc.circle(btnX + 36, btn2Y + 14, 2.5, 'F');
        doc.roundedRect(btnX + 32.5, btn2Y + 18, 7, 4, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('People', btnX + btnW / 2 + 8, btn2Y + 21.5, { align: 'center' });

        // Powered by Geokey Footer
        drawVectorLock(cx + usableW / 2 - 38, ly + mainH - 18, 7, 8, [147, 197, 253]);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.8);
        doc.setTextColor(147, 197, 253);
        doc.text('Powered by Geokey Access', cx + usableW / 2 + 6, ly + mainH - 11.5, { align: 'center' });
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 4: Caller Name Input Screen
      // -----------------------------------------------------------------------
      case 'name_prompt': {
        // Top Header
        doc.setFillColor(30, 42, 74);
        doc.roundedRect(cx, contentY, usableW, 250, 8, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(147, 197, 253);
        doc.text('THE WESTLINE', cx + usableW / 2, contentY + 25, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(255, 255, 255);
        doc.text('@ FLANAGAN LAKE', cx + usableW / 2, contentY + 41, { align: 'center' });

        // Prompt Subtext
        let ny = contentY + 68;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(226, 232, 240);
        doc.text('Please enter your name to access', cx + usableW / 2, ny, { align: 'center' });
        doc.text('the resident intercom directory', cx + usableW / 2, ny + 12, { align: 'center' });

        // Input Field Box
        ny += 28;
        const inpW = usableW - 24;
        const inpX = cx + 12;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(inpX, ny, inpW, 28, 5, 5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text('Raul Recalde', cx + usableW / 2, ny + 18, { align: 'center' });

        // Submit Button (Small enough to fit neatly, centered)
        ny += 38;
        doc.setFillColor(75, 119, 141);
        doc.roundedRect(inpX, ny, inpW, 28, 5, 5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text('Submit', cx + usableW / 2, ny + 18, { align: 'center' });

        // Security Footnote
        ny += 48;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Visitor entry logged for community security.', cx + usableW / 2, ny, { align: 'center' });
        doc.text('Audited with GPS coordinates & timestamp.', cx + usableW / 2, ny + 9, { align: 'center' });
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 5: Resident Directory Search
      // -----------------------------------------------------------------------
      case 'directory_search': {
        doc.setFillColor(30, 42, 74);
        doc.roundedRect(cx, contentY, usableW, 255, 8, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(147, 197, 253);
        doc.text('THE WESTLINE · RESIDENT DIRECTORY', cx + usableW / 2, contentY + 19, { align: 'center' });

        // Search Input Box
        let dy = contentY + 28;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(cx + 8, dy, usableW - 16, 20, 4, 4, 'F');
        
        // Vector magnifying glass icon
        doc.setDrawColor(100, 116, 139);
        doc.setLineWidth(0.8);
        doc.circle(cx + 17, dy + 9.5, 2.5, 'S');
        doc.line(cx + 19, dy + 11.5, cx + 21.5, dy + 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Search resident...', cx + 27, dy + 13);

        // Resident Rows
        dy += 27;
        const residents = [
          { name: 'G. Ayers', video: true, call: true },
          { name: 'C. Cardon', video: true, call: true },
          { name: 'R. Evans', video: false, call: true },
          { name: 'T. Givens', video: true, call: true },
          { name: 'R. Mitchell', video: true, call: true }
        ];

        residents.forEach((r) => {
          doc.setFillColor(40, 56, 94);
          doc.roundedRect(cx + 8, dy, usableW - 16, 22, 4, 4, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(255, 255, 255);
          doc.text(r.name, cx + 16, dy + 14);

          // Action Badges on Right (Crisp vector icons, zero emojis)
          const badgeY = dy + 4.5;
          if (r.video) {
            const bx = cx + usableW - 46;
            doc.setFillColor(37, 99, 235);
            doc.roundedRect(bx, badgeY, 16, 13, 2.5, 2.5, 'F');
            drawVectorCamera(bx + 3, badgeY + 2.8, 10, 7.4, [255, 255, 255]);
          }

          if (r.call) {
            const bx = cx + usableW - 27;
            doc.setFillColor(22, 163, 74);
            doc.roundedRect(bx, badgeY, 16, 13, 2.5, 2.5, 'F');
            drawVectorPhone(bx + 3.2, badgeY + 2.2, 9, 8.6, [255, 255, 255]);
          }

          dy += 26;
        });

        // Bottom Privacy Tag
        drawVectorLock(cx + 12, contentY + 241, 6, 7, [147, 197, 253]);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor(147, 197, 253);
        doc.text('Unit numbers and personal phones remain private', cx + usableW / 2 + 5, contentY + 246, { align: 'center' });
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 6: Caller Outgoing Voice Call
      // -----------------------------------------------------------------------
      case 'voice_calling': {
        doc.setFillColor(17, 24, 39);
        doc.roundedRect(cx, contentY, usableW, 255, 8, 8, 'F');

        // Calling Status
        let cy = contentY + 28;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(96, 165, 250);
        doc.text('CALLING RESIDENT', cx + usableW / 2, cy, { align: 'center' });

        cy += 18;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text('G. Ayers', cx + usableW / 2, cy, { align: 'center' });

        // Property Emblem (Generous circle radius and uncrowded text)
        cy += 26;
        doc.setFillColor(30, 42, 74);
        doc.circle(cx + usableW / 2, cy + 24, 26, 'F');
        doc.setDrawColor(96, 165, 250);
        doc.setLineWidth(0.9);
        doc.circle(cx + usableW / 2, cy + 24, 26, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5);
        doc.setTextColor(147, 197, 253);
        doc.text('THE WESTLINE', cx + usableW / 2, cy + 20, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text('@ FLANAGAN', cx + usableW / 2, cy + 29, { align: 'center' });

        // System Name
        cy += 60;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Westline Intercom System', cx + usableW / 2, cy, { align: 'center' });

        // Red End Call Button
        cy += 28;
        doc.setFillColor(220, 38, 38);
        doc.circle(cx + usableW / 2, cy + 16, 16, 'F');
        // Draw white X
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1.4);
        const ex = cx + usableW / 2;
        const ey = cy + 16;
        doc.line(ex - 4, ey - 4, ex + 4, ey + 4);
        doc.line(ex + 4, ey - 4, ex - 4, ey + 4);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(148, 163, 184);
        doc.text('End Call', cx + usableW / 2, cy + 39, { align: 'center' });
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 7: Resident Incoming Audio Call (VoIP Push)
      // -----------------------------------------------------------------------
      case 'incoming_audio': {
        doc.setFillColor(17, 24, 39);
        doc.roundedRect(cx, contentY, usableW, 255, 8, 8, 'F');

        // Incoming Call Header
        let ay = contentY + 25;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(34, 197, 94); // Green
        doc.text('INCOMING INTERCOM CALL', cx + usableW / 2, ay, { align: 'center' });

        ay += 18;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12.5);
        doc.setTextColor(255, 255, 255);
        doc.text('Raul Recalde', cx + usableW / 2, ay, { align: 'center' });

        // Emblem
        ay += 24;
        doc.setFillColor(30, 42, 74);
        doc.circle(cx + usableW / 2, ay + 20, 23, 'F');
        doc.setDrawColor(34, 197, 94);
        doc.setLineWidth(0.9);
        doc.circle(cx + usableW / 2, ay + 20, 23, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5);
        doc.setTextColor(147, 197, 253);
        doc.text('THE WESTLINE', cx + usableW / 2, ay + 17, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text('@ FLANAGAN', cx + usableW / 2, ay + 25, { align: 'center' });

        ay += 52;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Westline Intercom System', cx + usableW / 2, ay, { align: 'center' });

        // 4 Circular Resident Action Buttons (Precision centered, safe widths)
        ay += 24;
        const btnSpace = usableW / 4;
        const bRad = 12;

        // 1. Decline (Red)
        const b1X = cx + btnSpace * 0.5;
        doc.setFillColor(220, 38, 38);
        doc.circle(b1X, ay + 12, bRad, 'F');
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1.2);
        doc.line(b1X - 3.5, ay + 8.5, b1X + 3.5, ay + 15.5);
        doc.line(b1X + 3.5, ay + 8.5, b1X - 3.5, ay + 15.5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Decline', b1X, ay + 31, { align: 'center' });

        // 2. Request Video (Gray)
        const b2X = cx + btnSpace * 1.5;
        doc.setFillColor(71, 85, 105);
        doc.circle(b2X, ay + 12, bRad, 'F');
        drawVectorCamera(b2X - 5.5, ay + 8, 11, 8, [255, 255, 255]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Req Video', b2X, ay + 31, { align: 'center' });

        // 3. Unlock Door (Yellow Key)
        const b3X = cx + btnSpace * 2.5;
        doc.setFillColor(245, 158, 11); // Amber
        doc.circle(b3X, ay + 12, bRad, 'F');
        drawVectorKey(b3X - 5, ay + 9, 10, 6, [15, 23, 42]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(245, 158, 11);
        doc.text('Unlock', b3X, ay + 31, { align: 'center' });

        // 4. Answer Call (Green)
        const b4X = cx + btnSpace * 3.5;
        doc.setFillColor(22, 163, 74);
        doc.circle(b4X, ay + 12, bRad, 'F');
        drawVectorPhone(b4X - 4.5, ay + 7.5, 9, 9, [255, 255, 255]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(34, 197, 94);
        doc.text('Answer', b4X, ay + 31, { align: 'center' });
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 8: Video Request Confirmation Modal
      // -----------------------------------------------------------------------
      case 'video_request_modal': {
        // Dimmed Background
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(cx, contentY, usableW, 255, 8, 8, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(71, 85, 105);
        doc.text('Calling G. Ayers...', cx + usableW / 2, contentY + 26, { align: 'center' });

        // White Dialog Confirmation Card in Center
        const modY = contentY + 54;
        const modW = usableW - 20;
        const modX = cx + 10;
        const modH = 118;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(modX, modY, modW, modH, 7, 7, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text('PLEASE CONFIRM!', cx + usableW / 2, modY + 20, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text('G. Ayers is requesting', cx + usableW / 2, modY + 36, { align: 'center' });
        doc.text('a video call.', cx + usableW / 2, modY + 48, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        doc.text('Do you wish to proceed?', cx + usableW / 2, modY + 64, { align: 'center' });

        // Dialog Action Buttons: No and Yes (Neatly sized and centered)
        const btnY = modY + 78;
        const bW = (modW - 24) / 2;

        // No Button
        const noX = modX + 8;
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.roundedRect(noX, btnY, bW, 24, 4, 4, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        doc.text('No', noX + bW / 2, btnY + 15, { align: 'center' });

        // Yes Button
        const yesX = noX + bW + 8;
        doc.setFillColor(30, 42, 74);
        doc.roundedRect(yesX, btnY, bW, 24, 4, 4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text('Yes', yesX + bW / 2, btnY + 15, { align: 'center' });
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 9: Incoming Video Call Prompt
      // -----------------------------------------------------------------------
      case 'incoming_video': {
        doc.setFillColor(17, 24, 39);
        doc.roundedRect(cx, contentY, usableW, 255, 8, 8, 'F');

        // Video Call Header
        let vy = contentY + 25;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(192, 132, 252); // Purple
        doc.text('INCOMING VIDEO CALL', cx + usableW / 2, vy, { align: 'center' });

        vy += 18;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12.5);
        doc.setTextColor(255, 255, 255);
        doc.text('Raul Recalde', cx + usableW / 2, vy, { align: 'center' });

        // Emblem
        vy += 24;
        doc.setFillColor(59, 7, 100);
        doc.circle(cx + usableW / 2, vy + 20, 23, 'F');
        doc.setDrawColor(192, 132, 252);
        doc.setLineWidth(0.9);
        doc.circle(cx + usableW / 2, vy + 20, 23, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5);
        doc.setTextColor(216, 180, 254);
        doc.text('THE WESTLINE', cx + usableW / 2, vy + 17, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text('@ FLANAGAN', cx + usableW / 2, vy + 25, { align: 'center' });

        vy += 52;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Westline Intercom System', cx + usableW / 2, vy, { align: 'center' });

        // 3 Action Buttons: Decline, Unlock, Answer Video
        vy += 24;
        const bRad3 = 13;
        const bWidth3 = usableW / 3;

        // 1. Decline (Red)
        const bx1 = cx + bWidth3 * 0.5;
        doc.setFillColor(220, 38, 38);
        doc.circle(bx1, vy + 13, bRad3, 'F');
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1.2);
        doc.line(bx1 - 3.5, vy + 9.5, bx1 + 3.5, vy + 16.5);
        doc.line(bx1 + 3.5, vy + 9.5, bx1 - 3.5, vy + 16.5);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Decline', bx1, vy + 33, { align: 'center' });

        // 2. Unlock (Amber Key)
        const bx2 = cx + bWidth3 * 1.5;
        doc.setFillColor(245, 158, 11);
        doc.circle(bx2, vy + 13, bRad3, 'F');
        drawVectorKey(bx2 - 5.5, vy + 10, 11, 7, [15, 23, 42]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(245, 158, 11);
        doc.text('Unlock', bx2, vy + 33, { align: 'center' });

        // 3. Answer Video (Green)
        const bx3 = cx + bWidth3 * 2.5;
        doc.setFillColor(22, 163, 74);
        doc.circle(bx3, vy + 13, bRad3, 'F');
        drawVectorCamera(bx3 - 6, vy + 9, 12, 8, [255, 255, 255]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.setTextColor(34, 197, 94);
        doc.text('Answer', bx3, vy + 33, { align: 'center' });
        break;
      }

      // -----------------------------------------------------------------------
      // STEP 10: Live Two-Way Video Stream & Door Release
      // -----------------------------------------------------------------------
      case 'live_video_stream': {
        // Video Viewport (Dark ambient background simulating live video feed)
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(cx, contentY, usableW, 255, 8, 8, 'F');

        // Simulated Camera Feed Silhouette (Visitor standing at entrance plaque)
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(cx + 6, contentY + 26, usableW - 12, 134, 6, 6, 'F');

        // Silhouette head & shoulders of visitor
        doc.setFillColor(71, 85, 105);
        doc.circle(cx + usableW / 2, contentY + 72, 17, 'F'); // Head
        doc.roundedRect(cx + usableW / 2 - 26, contentY + 93, 52, 42, 7, 7, 'F'); // Shoulders

        // Top Status Overlays
        doc.setFillColor(0, 0, 0);
        doc.roundedRect(cx + 10, contentY + 32, 54, 13, 6.5, 6.5, 'F');
        doc.setFillColor(239, 68, 68);
        doc.circle(cx + 18, contentY + 38.5, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.2);
        doc.setTextColor(239, 68, 68);
        doc.text('LIVE 00:24', cx + 37, contentY + 41, { align: 'center' });

        doc.setFillColor(0, 0, 0);
        doc.roundedRect(cx + usableW - 68, contentY + 32, 58, 13, 6.5, 6.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.2);
        doc.setTextColor(255, 255, 255);
        doc.text('Westline Gate', cx + usableW - 39, contentY + 41, { align: 'center' });

        // Bottom Door Release Controls
        let lvy = contentY + 172;

        // Big Amber "UNLOCK DOOR" Button (Clean vector key and safely sized text)
        const btnW = usableW - 20;
        const btnX = cx + 10;
        doc.setFillColor(245, 158, 11);
        doc.roundedRect(btnX, lvy, btnW, 34, 7, 7, 'F');

        // Draw key icon on left of text
        drawVectorKey(btnX + 32, lvy + 12, 11, 7, [15, 23, 42]);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text('UNLOCK DOOR', btnX + btnW / 2 + 7, lvy + 17.5, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5);
        doc.setTextColor(69, 26, 3);
        doc.text('TRIGGERS HARDWARE RELAY / STRIKE', btnX + btnW / 2, lvy + 27, { align: 'center' });

        // Red End Call Button
        lvy += 40;
        doc.setFillColor(220, 38, 38);
        doc.roundedRect(btnX, lvy, btnW, 24, 5, 5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text('End Call & Lock', btnX + btnW / 2, lvy + 15, { align: 'center' });
        break;
      }
    }
  };

  // =========================================================================
  // PAGE 1: COVER & ARCHITECTURAL HARDWARE PLAQUE SPECIFICATIONS
  // =========================================================================
  drawPageBackground();
  drawRunningHeader();

  // Cover Headers with generous breathing room and zero overlap
  let curY = 58;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(colors.titleBlue[0], colors.titleBlue[1], colors.titleBlue[2]);
  doc.text('QR Intercom Plaque', pageWidth / 2, curY, { align: 'center' });
  curY += 26;

  doc.setFontSize(17);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text('Integration & Field Deployment Guide', pageWidth / 2, curY, { align: 'center' });
  curY += 16;

  // Accent Gradient Bar
  doc.setDrawColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.setLineWidth(1.5);
  doc.line(pageWidth / 2 - 95, curY, pageWidth / 2 + 95, curY);
  curY += 20;

  // Overview Summary Box
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.roundedRect(margin, curY, contentWidth, 54, 4, 4, 'F');
  doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
  doc.setLineWidth(0.65);
  doc.roundedRect(margin, curY, contentWidth, 54, 4, 4, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
  const overviewText =
    'Complete field installation and technical specification guide for Geokey-powered QR Intercom Plaques. Covers cloud portal provisioning, isolated plaque mounting specifications, smartphone camera scanning, GPS geofence validation, visitor directory routing, and two-way encrypted audio/video calling to resident smartphones with remote door unlock.';
  drawWrappedText(overviewText, margin + 12, curY + 16, contentWidth - 24, 12);
  curY += 66;

  // Physical Plaque Specifications Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Physical QR Intercom Plaque Specifications (Isolated Plaques)', margin, curY);
  curY += 14;

  // Render 2 Plaque Specification Cards
  PLAQUE_SPECS.forEach((plaque, index) => {
    const cardHeight = 98;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.roundedRect(margin, curY, contentWidth, cardHeight, 4, 4, 'F');
    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.65);
    doc.roundedRect(margin, curY, contentWidth, cardHeight, 4, 4, 'S');

    // Draw Isolated Plaque Vector Artwork
    const artX = margin + 12;
    const artY = curY + 11;
    if (index === 0) {
      // Vertical Plaque 8x10
      drawPurePlaque(artX, artY, 65, 76, 'vertical');
    } else {
      // Horizontal Plaque 7.5x3.5
      drawPurePlaque(artX, artY + 13, 88, 50, 'horizontal');
    }

    // Plaque Details
    const textX = margin + 110;
    const textW = contentWidth - 124;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.titleBlue[0], colors.titleBlue[1], colors.titleBlue[2]);
    doc.text(plaque.name, textX, curY + 17);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text(`Format: ${plaque.format}  ·  Dimensions: ${plaque.dimensions}`, textX, curY + 30);
    doc.text(`Material: ${plaque.material}`, textX, curY + 41);
    doc.text(`Mounting: ${plaque.mounting}`, textX, curY + 52);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    drawWrappedText(plaque.description, textX, curY + 65, textW, 10);

    curY += cardHeight + 12;
  });

  // End-to-End Implementation Roadmap Overview Box
  curY += 2;
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.roundedRect(margin, curY, contentWidth, 76, 4, 4, 'F');
  doc.setDrawColor(colors.borderAccent[0], colors.borderAccent[1], colors.borderAccent[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, curY, contentWidth, 76, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text('GUIDE ROADMAP & STEP-BY-STEP IPHONE PROCEDURES', margin + 12, curY + 16);

  const roadmapItems = [
    { num: 'P1', title: 'Portal Provisioning & QR Plaque (Steps 1 & 2)', desc: 'Cloud intercom enablement, geofencing setup, and native camera scanning.' },
    { num: 'P2', title: 'Caller Navigation & Audio Calling (Steps 3 – 6)', desc: 'Browser location services, leasing vs. resident directory, and encrypted VoIP audio.' },
    { num: 'P3', title: 'Resident App, Video & Door Release (Steps 7 – 10)', desc: 'Instant push alert, two-way WebRTC video escalation, and remote door strike trigger.' }
  ];

  let rmY = curY + 30;
  roadmapItems.forEach((rm) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.titleBlue[0], colors.titleBlue[1], colors.titleBlue[2]);
    doc.text(`${rm.num}: ${rm.title}`, margin + 14, rmY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    doc.text(`— ${rm.desc}`, margin + 225, rmY);

    rmY += 15;
  });

  // =========================================================================
  // PAGES 2 THROUGH 11: STEPS 1 TO 10 WITH DEDICATED IPHONE MOCKUP ON EACH STEP
  // =========================================================================
  QR_INTERCOM_GUIDE_STEPS.forEach((step) => {
    doc.addPage();
    drawPageBackground();
    drawRunningHeader(step.category);

    // Header section with carefully calculated, non-overlapping vertical rhythm
    let stepY = 46;

    // Category Pill & Step Number
    doc.setFillColor(colors.tagBg[0], colors.tagBg[1], colors.tagBg[2]);
    doc.roundedRect(margin, stepY, 60, 16, 8, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.tagText[0], colors.tagText[1], colors.tagText[2]);
    doc.text(
      step.stepNumber < 10 ? `STEP 0${step.stepNumber}` : `STEP ${step.stepNumber}`,
      margin + 30,
      stepY + 11,
      { align: 'center' }
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
    doc.text(step.category.toUpperCase(), margin + 70, stepY + 11);

    // Generous vertical gap: pill ends at 46 + 16 = 62.
    // Setting stepY = 82 ensures title caps (baseline 82 - 12 = 70) have a full 8pt margin below the pill.
    stepY = 82;

    // Step Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    const titleLines = doc.splitTextToSize(step.title, contentWidth);
    doc.text(titleLines, margin, stepY);

    // Explicit spacing between title lines and summary to guarantee NO overlap
    stepY += titleLines.length * 18 + 8;

    // Step Summary
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.subHeadingText[0], colors.subHeadingText[1], colors.subHeadingText[2]);
    const summaryLines = doc.splitTextToSize(step.summary, contentWidth);
    doc.text(summaryLines, margin, stepY);
    stepY += summaryLines.length * 12 + 8;

    // Horizontal Divider
    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.6);
    doc.line(margin, stepY, pageWidth - margin, stepY);
    stepY += 14;

    // Two-Column Layout: Left Column (Procedures & Callouts) & Right Column (iPhone Mockup)
    const leftColW = 312;
    const phoneW = 194;
    const phoneH = 412;
    const phoneX = margin + leftColW + 18; // 38 + 312 + 18 = 368 pt. (Leaves 50pt margin on right)
    const phoneY = stepY;

    // -------------------------------------------------------------------------
    // LEFT COLUMN: FIELD PROCEDURE & TECHNICAL SPECIFICATIONS
    // -------------------------------------------------------------------------
    let leftY = stepY;

    // Procedure Card Container
    const cardHeight = 412;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.roundedRect(margin, leftY, leftColW, cardHeight, 6, 6, 'F');
    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.65);
    doc.roundedRect(margin, leftY, leftColW, cardHeight, 6, 6, 'S');

    // Section Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.titleBlue[0], colors.titleBlue[1], colors.titleBlue[2]);
    doc.text('FIELD PROCEDURE & OPERATIONAL SPECIFICATIONS', margin + 14, leftY + 19);

    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.4);
    doc.line(margin + 14, leftY + 25, margin + leftColW - 14, leftY + 25);

    let bulletY = leftY + 38;
    step.details.forEach((bullet) => {
      // Bullet Dot
      doc.setFillColor(colors.borderAccent[0], colors.borderAccent[1], colors.borderAccent[2]);
      doc.circle(margin + 18, bulletY - 2.5, 2, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);

      const bLines = doc.splitTextToSize(bullet, leftColW - 36);
      doc.text(bLines, margin + 26, bulletY);
      bulletY += bLines.length * 11.5 + 6;
    });

    // Optional Callout Box
    if (step.callout) {
      const calloutH = 58;
      const calloutY = leftY + cardHeight - 110;

      let calloutBg = [238, 242, 255];
      let calloutBorder = [99, 102, 241];
      let calloutTag = 'INFO PROTOCOL';

      if (step.callout.type === 'warning') {
        calloutBg = isDark ? [69, 26, 3] : [254, 252, 232];
        calloutBorder = [245, 158, 11];
        calloutTag = 'SECURITY WARNING';
      } else if (step.callout.type === 'success') {
        calloutBg = isDark ? [6, 78, 59] : [240, 253, 244];
        calloutBorder = [16, 185, 129];
        calloutTag = 'VERIFIED BEST PRACTICE';
      } else if (isDark) {
        calloutBg = [30, 27, 75];
      }

      doc.setFillColor(calloutBg[0], calloutBg[1], calloutBg[2]);
      doc.setDrawColor(calloutBorder[0], calloutBorder[1], calloutBorder[2]);
      doc.setLineWidth(0.8);
      doc.roundedRect(margin + 12, calloutY, leftColW - 24, calloutH, 4, 4, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(calloutBorder[0], calloutBorder[1], calloutBorder[2]);
      doc.text(calloutTag, margin + 18, calloutY + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      drawWrappedText(step.callout.text, margin + 18, calloutY + 26, leftColW - 36, 10.5);
    }

    // Technician On-Site Verification Checkbox
    const checkY = leftY + cardHeight - 44;
    if (isDark) {
      doc.setFillColor(24, 32, 50);
    } else {
      doc.setFillColor(241, 245, 249);
    }
    doc.roundedRect(margin + 12, checkY, leftColW - 24, 32, 4, 4, 'F');
    doc.setDrawColor(colors.borderLight[0], colors.borderLight[1], colors.borderLight[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin + 12, checkY, leftColW - 24, 32, 4, 4, 'S');

    // Checkbox Square
    doc.setDrawColor(colors.titleBlue[0], colors.titleBlue[1], colors.titleBlue[2]);
    doc.setLineWidth(1);
    doc.rect(margin + 20, checkY + 10, 11, 11, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text('Installer Verification: Step Tested & Passed On-Site', margin + 38, checkY + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text('Technician Initials: ____________    Date: ____________', margin + 38, checkY + 28);

    // -------------------------------------------------------------------------
    // RIGHT COLUMN: IPHONE DEVICE MOCKUP WITH DETAILED IN-SCREEN SCREENSHOT
    // -------------------------------------------------------------------------
    drawIPhoneMockup(phoneX, phoneY, phoneW, phoneH, step);
  });

  // =========================================================================
  // FOOTERS ON ALL PAGES
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

    doc.text('QR Intercom Plaque Integration Guide · QXT-GEOKEY-2026', margin, pageHeight - 22);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth / 2, pageHeight - 22, { align: 'center' });
    doc.text('CONFIDENTIAL · FIELD CERTIFIED', pageWidth - margin, pageHeight - 22, { align: 'right' });
  }

  // Save PDF
  const filename = `QR_Intercom_Plaque_Integration_Guide_${theme === 'dark' ? 'NightDark' : 'Printable'}.pdf`;
  doc.save(filename);
};
