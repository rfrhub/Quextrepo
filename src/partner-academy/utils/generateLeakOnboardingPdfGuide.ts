import { jsPDF } from 'jspdf';
import { LEAK_APP_ONBOARDING_STEPS, LeakAppStep } from '../data/leakAppOnboardingData';

export interface LeakOnboardingPdfOptions {
  theme?: 'white' | 'dark';
  screenshots?: Record<number, string>;
}

export const generateAndDownloadLeakOnboardingPdf = (options: LeakOnboardingPdfOptions = {}) => {
  const { theme = 'white' } = options;
  const isDark = theme === 'dark';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 612 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 792 pt
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // 532 pt
  const maxUsableY = pageHeight - 48;

  // Quext Brand Palette (onequext.com)
  const colors = {
    pageBg: isDark ? [10, 14, 24] : [255, 255, 255],
    cardBg: isDark ? [16, 22, 36] : [248, 250, 252],
    cardBorder: isDark ? [38, 48, 70] : [226, 232, 240],
    mockupBg: isDark ? [15, 23, 42] : [241, 245, 249],
    mockupBorder: isDark ? [51, 65, 85] : [203, 213, 225],
    titlePurple: isDark ? [192, 132, 252] : [124, 58, 237],
    titleBlue: isDark ? [96, 165, 250] : [37, 99, 235],
    accentCyan: isDark ? [34, 211, 238] : [8, 145, 178],
    headingText: isDark ? [255, 255, 255] : [15, 23, 42],
    subText: isDark ? [203, 213, 225] : [71, 85, 105],
    bodyText: isDark ? [226, 232, 240] : [30, 41, 59],
    mutedText: isDark ? [148, 163, 184] : [100, 116, 139],
    accentAmber: isDark ? [251, 191, 36] : [217, 119, 6],
    badgeBg: isDark ? [24, 32, 50] : [238, 242, 255],
    badgeText: isDark ? [167, 139, 250] : [79, 70, 229],
    buttonBlue: [37, 99, 235]
  };

  const drawPageBackground = () => {
    doc.setFillColor(colors.pageBg[0], colors.pageBg[1], colors.pageBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  const drawRunningHeader = (categoryName: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text('QUEXT ADMIN APP — WATER LEAK SENSOR ONBOARDING GUIDE', margin, 26);
    doc.text(categoryName.toUpperCase(), pageWidth - margin, 26, { align: 'right' });

    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, 32, pageWidth - margin, 32);
  };

  const drawRunningFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 34, pageWidth - margin, pageHeight - 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text('onequext.com | Confidential Field Engineering Guide | Authorized Quext Technicians', margin, pageHeight - 20);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  };

  // COVER PAGE
  drawPageBackground();

  // Top Accent Gradient bar
  doc.setFillColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.rect(0, 0, pageWidth, 8, 'F');

  let currentY = 55;

  // Quext Brand Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text('QUEXT MULTIFAMILY IOT ECOSYSTEM', margin, currentY);

  currentY += 28;

  // Main Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Quext Admin App: Leak Sensor Onboarding Guide', margin, currentY);

  currentY += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
  doc.text('Official 15-Step Smartphone Commissioning SOP from Home Screen to Final Gateway Verification', margin, currentY);

  currentY += 25;

  // Metadata Card
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.setLineWidth(1);
  doc.roundedRect(margin, currentY, contentWidth, 75, 8, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text('FIELD SPECIFICATIONS', margin + 16, currentY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);

  doc.text('Software Platform: Quext Admin Mobile App (iOS / Android)', margin + 16, currentY + 38);
  doc.text('Hardware: Sensor Industries SI-LEAK-01 / SI-FLUSH Toilet Run Sensor', margin + 16, currentY + 54);

  doc.text('Network Protocol: SI-Mesh / LoRaWAN to Quext Thermostat Gateway', margin + 270, currentY + 38);
  doc.text('Step Sequence: 15 Verified App Stages with UI Device Mockups', margin + 270, currentY + 54);

  currentY += 92;

  // Executive Overview Card
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.roundedRect(margin, currentY, contentWidth, 110, 8, 8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Standard Operating Procedure Overview', margin + 16, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
  const overviewText = 
    'This field engineering guide outlines the complete sequence required to pair and register water leak and toilet run sensors into the Quext Admin App. Following this 15-step protocol ensures every device is correctly bound to its spatial hierarchy (Property > Building > Unit > Room Placement), validated against Quext Cloud telemetry rules, and instantly linked to maintenance dispatch rosters.';
  const splitOverview = doc.splitTextToSize(overviewText, contentWidth - 32);
  doc.text(splitOverview, margin + 16, currentY + 40);

  currentY += 128;

  // Table of Categories
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Guide Workflow Stages', margin, currentY);

  currentY += 16;

  const categories = [
    { title: 'Stage 1: Navigation & Spatial Hierarchy', steps: 'Steps 1 - 3 (Home > Building > Unit Selection)' },
    { title: 'Stage 2: Device Catalog & Category', steps: 'Steps 4 - 5 (Install Device > Select Other Devices)' },
    { title: 'Stage 3: QR Optical Scanning & Validation', steps: 'Steps 6 - 7 (Scan QR Code > DevEUI Identity Verification)' },
    { title: 'Stage 4: Room Location & Physical Activation', steps: 'Steps 8 - 11 (Specify Location > Power On & Piston Mobility)' },
    { title: 'Stage 5: Gateway Pairing & Verification', steps: 'Steps 12 - 15 (Install Handshake > Cloud Sync > Online Inventory)' }
  ];

  categories.forEach((cat) => {
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, currentY, contentWidth, 34, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
    doc.text(cat.title, margin + 14, currentY + 21);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
    doc.text(cat.steps, pageWidth - margin - 14, currentY + 21, { align: 'right' });

    currentY += 40;
  });

  // STEP CARDS: Render 2 steps per page for generous vertical rhythm, zero overlap
  const totalPages = 1 + Math.ceil(LEAK_APP_ONBOARDING_STEPS.length / 2);
  let pageNumber = 1;
  drawRunningFooter(pageNumber, totalPages);

  for (let i = 0; i < LEAK_APP_ONBOARDING_STEPS.length; i += 2) {
    doc.addPage();
    pageNumber++;
    drawPageBackground();

    const stepA = LEAK_APP_ONBOARDING_STEPS[i];
    const stepB = LEAK_APP_ONBOARDING_STEPS[i + 1];

    drawRunningHeader(stepA.category);
    let yPos = 48;

    const renderStepCard = (step: LeakAppStep, y: number) => {
      const cardHeight = 330;
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
      doc.setLineWidth(1);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 8, 8, 'FD');

      // Step Number Pill
      doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
      doc.roundedRect(margin + 16, y + 14, 85, 20, 10, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
      doc.text(`STEP ${step.stepNumber} OF 15`, margin + 58, y + 27, { align: 'center' });

      // Step Category tag
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
      doc.text(step.category.toUpperCase(), margin + 110, y + 27);

      // Source Tag (Recentered / Native)
      if (step.sourceType === 'video_capture') {
        doc.setFillColor(254, 243, 199);
        doc.roundedRect(pageWidth - margin - 110, y + 14, 94, 20, 10, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(180, 83, 9);
        doc.text('VIDEO DEMO STEP', pageWidth - margin - 63, y + 27, { align: 'center' });
      }

      // Step Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
      doc.text(step.title, margin + 16, y + 54);

      // Action Subtitle
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(colors.titleBlue[0], colors.titleBlue[1], colors.titleBlue[2]);
      const splitAction = doc.splitTextToSize(step.actionText, 320);
      doc.text(splitAction, margin + 16, y + 70);

      // Two column layout inside card: Left = Description & SOP instructions, Right = Device Mockup
      let leftY = y + 96;

      // Description text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      const splitDesc = doc.splitTextToSize(step.description, 320);
      doc.text(splitDesc, margin + 16, leftY);
      leftY += splitDesc.length * 11 + 8;

      // Instructions header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
      doc.text('ACTION PROTOCOL:', margin + 16, leftY);
      leftY += 12;

      // Instruction bullets
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      step.instructions.forEach((ins) => {
        const bulletText = `•  ${ins}`;
        const splitBullet = doc.splitTextToSize(bulletText, 314);
        doc.text(splitBullet, margin + 16, leftY);
        leftY += splitBullet.length * 10 + 2;
      });

      // Field Pro Tip Card
      doc.setFillColor(isDark ? 28 : 241, isDark ? 36 : 245, isDark ? 52 : 249);
      doc.roundedRect(margin + 16, y + cardHeight - 44, 320, 32, 6, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
      doc.text('TECHNICIAN TIP:', margin + 24, y + cardHeight - 32);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
      const splitTip = doc.splitTextToSize(step.fieldTip, 304);
      doc.text(splitTip, margin + 24, y + cardHeight - 20);

      // RIGHT COLUMN: iPhone Device Mockup
      const phoneX = pageWidth - margin - 170;
      const phoneY = y + 50;
      const phoneW = 154;
      const phoneH = 260;

      // Phone outer bezel (Titanium style)
      doc.setFillColor(15, 23, 42); // slate-900 bezel
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(1.5);
      doc.roundedRect(phoneX, phoneY, phoneW, phoneH, 16, 16, 'FD');

      // Screen inner canvas
      const screenX = phoneX + 6;
      const screenY = phoneY + 6;
      const screenW = phoneW - 12;
      const screenH = phoneH - 12;

      doc.setFillColor(isDark ? 10 : 255, isDark ? 14 : 255, isDark ? 24 : 255);
      doc.roundedRect(screenX, screenY, screenW, screenH, 12, 12, 'F');

      const exactImg = options.screenshots?.[step.stepNumber];
      if (exactImg) {
        try {
          doc.addImage(exactImg, 'JPEG', screenX, screenY, screenW, screenH, undefined, 'FAST');
        } catch {
          try {
            doc.addImage(exactImg, 'PNG', screenX, screenY, screenW, screenH, undefined, 'FAST');
          } catch {
            // fallback
          }
        }

        // Re-stroke phone outer titanium bezel cleanly framing the uncropped screenshot
        doc.setDrawColor(51, 65, 85);
        doc.setLineWidth(1.5);
        doc.roundedRect(phoneX, phoneY, phoneW, phoneH, 16, 16, 'S');
      } else {
        // Dynamic Island / Speaker notch
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(phoneX + phoneW / 2 - 20, phoneY + 9, 40, 7, 3.5, 3.5, 'F');

        // Screen Header Bar
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(isDark ? 255 : 15, isDark ? 255 : 23, isDark ? 255 : 42);
        doc.text(step.uiMockup.headerTitle, phoneX + phoneW / 2, phoneY + 26, { align: 'center' });

        // Screen Step Badge inside Mockup
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        doc.text(`Step ${step.stepNumber}`, phoneX + phoneW / 2, phoneY + 36, { align: 'center' });

        // Mockup screen content box
        const boxX = phoneX + 10;
        const boxY = phoneY + 42;
        const boxW = phoneW - 20;
        const boxH = phoneH - 84;

        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(boxX, boxY, boxW, boxH, 6, 6, 'FD');

        // Render custom mini-UI within box based on content type
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
        doc.text(step.screenTitle.toUpperCase(), boxX + 6, boxY + 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);

        if (step.uiMockup.mainContent.type === 'home_service') {
          doc.text('Tap "Service" Icon', boxX + 6, boxY + 32);
          doc.setFillColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
          doc.roundedRect(boxX + 6, boxY + 44, boxW - 12, 22, 4, 4, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(255, 255, 255);
          doc.text('[ Service Hub ]', boxX + boxW / 2 - 6, boxY + 58, { align: 'center' });
        } else if (step.uiMockup.mainContent.type === 'select_building') {
          doc.text('Select Assigned Building:', boxX + 6, boxY + 28);
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(boxX + 6, boxY + 36, boxW - 12, 18, 3, 3, 'F');
          doc.setTextColor(79, 70, 229);
          doc.setFont('helvetica', 'bold');
          doc.text('Building 1 (Selected)', boxX + 10, boxY + 48);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.text('Building 2', boxX + 10, boxY + 68);
        } else if (step.uiMockup.mainContent.type === 'select_unit') {
          doc.text('Select Apartment Unit:', boxX + 6, boxY + 28);
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(boxX + 6, boxY + 36, boxW - 12, 18, 3, 3, 'F');
          doc.setTextColor(79, 70, 229);
          doc.setFont('helvetica', 'bold');
          doc.text('Unit 104 (Selected)', boxX + 10, boxY + 48);
          doc.setTextColor(100, 116, 139);
          doc.setFont('helvetica', 'normal');
          doc.text('Unit 105', boxX + 10, boxY + 68);
        } else if (step.uiMockup.mainContent.type === 'other_devices_list') {
          doc.text('Device Category:', boxX + 6, boxY + 28);
          doc.setFillColor(238, 242, 255);
          doc.roundedRect(boxX + 6, boxY + 40, boxW - 12, 24, 4, 4, 'F');
          doc.setTextColor(79, 70, 229);
          doc.setFont('helvetica', 'bold');
          doc.text('✓ Other Devices', boxX + 10, boxY + 55);
        } else if (step.uiMockup.mainContent.type === 'scan_qr_camera') {
          doc.text('Align QR Code In Box', boxX + 6, boxY + 26);
          doc.setDrawColor(37, 99, 235);
          doc.setLineWidth(1);
          doc.roundedRect(boxX + 18, boxY + 34, boxW - 36, 40, 4, 4, 'D');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6);
          doc.text('[ Camera Reticle ]', boxX + boxW / 2 - 6, boxY + 58, { align: 'center' });
        } else if (step.uiMockup.mainContent.type === 'qr_scanned_details') {
          doc.setTextColor(22, 101, 52);
          doc.setFont('helvetica', 'bold');
          doc.text('✓ QR Payload Captured', boxX + 6, boxY + 28);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6);
          doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
          doc.text('DevEUI: 00-80-E1-04-3A', boxX + 6, boxY + 42);
          doc.text('Type: Leak Sensor', boxX + 6, boxY + 54);
        } else if (step.uiMockup.mainContent.type === 'specify_location') {
          doc.text('Placement Location:', boxX + 6, boxY + 26);
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(boxX + 6, boxY + 34, boxW - 12, 18, 3, 3, 'F');
          doc.setTextColor(79, 70, 229);
          doc.setFont('helvetica', 'bold');
          doc.text('Master Bath Toilet', boxX + 10, boxY + 46);
        } else if (step.uiMockup.mainContent.type === 'power_on_prompt' || step.uiMockup.mainContent.type === 'power_on_video') {
          doc.setTextColor(180, 83, 9);
          doc.setFont('helvetica', 'bold');
          doc.text('Pull Shipping Zip-Tie', boxX + 6, boxY + 26);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6);
          doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
          doc.text('Rock sensor in hand;', boxX + 6, boxY + 42);
          doc.text('Listen for piston click.', boxX + 6, boxY + 54);
        } else if (step.uiMockup.mainContent.type === 'tap_install') {
          doc.text('Gateway in Range', boxX + 6, boxY + 26);
          doc.setFillColor(37, 99, 235);
          doc.roundedRect(boxX + 6, boxY + 40, boxW - 12, 22, 4, 4, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(255, 255, 255);
          doc.text('Tap "Install"', boxX + boxW / 2 - 6, boxY + 54, { align: 'center' });
        } else if (step.uiMockup.mainContent.type === 'wait_onboarding') {
          doc.text('Registering Keys...', boxX + 6, boxY + 26);
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(boxX + 6, boxY + 42, boxW - 12, 8, 4, 4, 'F');
          doc.setFillColor(124, 58, 237);
          doc.roundedRect(boxX + 6, boxY + 42, (boxW - 12) * 0.8, 8, 4, 4, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(124, 58, 237);
          doc.text('85% Syncing...', boxX + boxW / 2 - 6, boxY + 62, { align: 'center' });
        } else if (step.uiMockup.mainContent.type === 'tap_finish') {
          doc.setTextColor(22, 101, 52);
          doc.setFont('helvetica', 'bold');
          doc.text('✓ Installation Success', boxX + 6, boxY + 28);
          doc.setFillColor(37, 99, 235);
          doc.roundedRect(boxX + 6, boxY + 42, boxW - 12, 20, 4, 4, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(255, 255, 255);
          doc.text('Tap "Finish"', boxX + boxW / 2 - 6, boxY + 55, { align: 'center' });
        } else if (step.uiMockup.mainContent.type === 'device_in_list') {
          doc.text('Active Inventory:', boxX + 6, boxY + 24);
          doc.setFillColor(240, 253, 244);
          doc.roundedRect(boxX + 6, boxY + 34, boxW - 12, 18, 3, 3, 'F');
          doc.setTextColor(22, 101, 52);
          doc.setFont('helvetica', 'bold');
          doc.text('● Water Leak Sensor', boxX + 10, boxY + 46);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6);
          doc.setTextColor(100, 116, 139);
          doc.text('Online (100% Bat)', boxX + 10, boxY + 64);
        } else {
          doc.text(step.screenSubtitle || 'Standard Action', boxX + 6, boxY + 30);
        }

        // Phone Footer Action Button
        if (step.uiMockup.footerButton) {
          const btnY = phoneY + phoneH - 34;
          doc.setFillColor(37, 99, 235);
          doc.roundedRect(phoneX + 14, btnY, phoneW - 28, 18, 5, 5, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(255, 255, 255);
          doc.text(step.uiMockup.footerButton.label, phoneX + phoneW / 2, btnY + 11.5, { align: 'center' });
        }
      }
    };

    renderStepCard(stepA, yPos);

    if (stepB) {
      yPos += 342;
      renderStepCard(stepB, yPos);
    }

    drawRunningFooter(pageNumber, totalPages);
  }

  // Save the document
  const fileName = `Quext_Admin_App_Leak_Sensor_Onboarding_Guide_${isDark ? 'Obsidian_Dark' : 'Printable_White'}.pdf`;
  doc.save(fileName);
};
