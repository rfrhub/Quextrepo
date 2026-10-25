import { jsPDF } from 'jspdf';
import {
  BEFE_GUIDE_METADATA,
  BEFE_TECHNICAL_SPECS,
  BEFE_AUDITORY_CODES,
  BEFE_GUIDE_STEPS,
  BEFE_GUIDE_STAGES,
  BefeGuideStep,
} from '../data/befeGuideData';

export interface BefePdfOptions {
  theme?: 'white' | 'dark';
  format?: 'letter' | 'mobile';
}

export const generateAndDownloadBefePdf = (options: BefePdfOptions = {}) => {
  const { theme = 'white', format = 'letter' } = options;
  const isDark = theme === 'dark';
  const isMobile = format === 'mobile';

  // Determine page dimensions
  // Letter: 612 x 792 pt (Portrait)
  // Mobile: 390 x 844 pt (iPhone / Android Phone Aspect Ratio, single-column scroll)
  const pageWidth = isMobile ? 390 : 612;
  const pageHeight = isMobile ? 844 : 792;
  const margin = isMobile ? 24 : 40;
  const contentWidth = pageWidth - margin * 2;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: isMobile ? [390, 844] : 'letter',
  });

  // Color Palette
  const colors = {
    pageBg: isDark ? [10, 14, 24] : [255, 255, 255],
    cardBg: isDark ? [18, 24, 38] : [248, 250, 252],
    cardBorder: isDark ? [40, 50, 72] : [226, 232, 240],
    purpleMain: isDark ? [192, 132, 252] : [126, 34, 206],
    purpleDeep: [91, 33, 182],
    cyanAccent: isDark ? [34, 211, 238] : [8, 145, 178],
    headingText: isDark ? [255, 255, 255] : [15, 23, 42],
    subText: isDark ? [203, 213, 225] : [71, 85, 105],
    bodyText: isDark ? [226, 232, 240] : [30, 41, 59],
    mutedText: isDark ? [148, 163, 184] : [100, 116, 139],
    warningBg: isDark ? [45, 20, 10] : [254, 242, 242],
    warningBorder: isDark ? [185, 28, 28] : [239, 68, 68],
    warningText: isDark ? [254, 202, 202] : [153, 27, 27],
    successBg: isDark ? [10, 40, 25] : [240, 253, 244],
    successBorder: isDark ? [16, 185, 129] : [34, 197, 94],
    successText: isDark ? [167, 243, 208] : [21, 128, 61],
  };

  let currentPage = 1;
  let totalPagesEstimate = isMobile ? 8 : 4;

  const drawPageBackground = () => {
    doc.setFillColor(colors.pageBg[0], colors.pageBg[1], colors.pageBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  const drawRunningHeader = (sectionTitle: string) => {
    // Top Logo lockup
    doc.setDrawColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
    doc.setLineWidth(1);
    doc.rect(margin, 20, 42, 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 8 : 9);
    doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
    doc.text('quext', margin + 6, 31);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 7 : 8);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text(isMobile ? 'BE467 / FE410 GUIDE' : 'SCHLAGE CONTROL BE467 / FE410 FIELD MANUAL', margin + 50, 31);

    if (!isMobile) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
      doc.text(sectionTitle.toUpperCase(), pageWidth - margin, 31, { align: 'right' });
    }

    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.setLineWidth(0.6);
    doc.line(margin, 42, pageWidth - margin, 42);
  };

  const drawFooter = () => {
    const footY = pageHeight - 20;
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.setLineWidth(0.6);
    doc.line(margin, footY - 8, pageWidth - margin, footY - 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isMobile ? 6.5 : 7.5);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text(isMobile ? 'QUEXT CERTIFIED INSTALLER' : 'CONFIDENTIAL · FOR CERTIFIED QUEXT FIELD INSTALLERS ONLY', margin, footY);

    const pageStr = isMobile ? `PAGE ${currentPage}` : `PAGE ${currentPage} · ${BEFE_GUIDE_METADATA.documentCode}`;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
    doc.text(pageStr, pageWidth - margin, footY, { align: 'right' });
  };

  // Helper to start a new page cleanly
  const advancePage = (headerTitle: string) => {
    drawFooter();
    doc.addPage();
    currentPage += 1;
    drawPageBackground();
    drawRunningHeader(headerTitle);
    return 58; // new starting curY
  };

  // =========================================================================
  // PAGE 1: Technical Overview & Specs
  // =========================================================================
  drawPageBackground();
  drawRunningHeader('TECHNICAL OVERVIEW & SPECIFICATIONS');
  let curY = 60;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 14 : 17);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('BE / FE Smart Deadbolts Field Guide', margin, curY);

  curY += isMobile ? 14 : 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 8.5 : 9.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('Schlage Control BE467 / FE410 · 2-Turn FDR & Deletion Protocol', margin, curY);

  curY += isMobile ? 16 : 20;

  // Executive Summary Card with dynamic text split
  const summaryText =
    'Standardized field procedure for commissioning Schlage Control BE467 Smart Deadbolts and FE410 Interconnected Locks in the Quext IoT network. Follow all pre-pairing phone settings, verify deadbolt free-throw clearance, execute the 10-second capacitor drain with 2-turn thumbturn FDR, and adhere strictly to the Quext Cloud Deletion Protocol.';
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 24);
  const summaryCardHeight = 26 + summaryLines.length * 11;

  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, curY, contentWidth, summaryCardHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('EXECUTIVE FIELD SUMMARY', margin + 12, curY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobile ? 7 : 7.5);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
  summaryLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + 12, curY + 28 + idx * 11);
  });

  curY += summaryCardHeight + 14;

  // Hardware Specs Card
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  const specsHeight = isMobile ? 180 : 164;
  doc.roundedRect(margin, curY, contentWidth, specsHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('HARDWARE & SYSTEM SPECIFICATIONS', margin + 12, curY + 16);

  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.setLineWidth(0.5);
  doc.line(margin + 12, curY + 22, margin + contentWidth - 12, curY + 22);

  let specY = curY + 34;
  BEFE_TECHNICAL_SPECS.forEach((spec) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 6.8 : 7.5);
    doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
    doc.text(spec.label + ':', margin + 12, specY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    const valLines = doc.splitTextToSize(spec.value, contentWidth - (isMobile ? 110 : 160));
    doc.text(valLines[0], margin + (isMobile ? 100 : 150), specY);

    specY += isMobile ? 18 : 16;
  });

  curY += specsHeight + 14;

  // 5 Stages Roadmap
  if (!isMobile) {
    const roadmapHeight = 220;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, roadmapHeight, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text('5-STAGE FIELD WORKFLOW ROADMAP', margin + 12, curY + 16);
    doc.line(margin + 12, curY + 22, margin + contentWidth - 12, curY + 22);

    const stagesRoadmap = [
      { num: 'STAGE 1', title: 'Mobile Environment & Phone Settings', desc: 'Quext IoT Admin app verification, display Auto-Lock to Never, cellular data priority.' },
      { num: 'STAGE 2', title: 'Physical Latch Inspection & Battery Pack', desc: 'Verify free deadbolt throw (no strike binding), remove backplate, expose 4x AA pack.' },
      { num: 'STAGE 3', title: 'Quext Admin Onboarding & BLE Sync', desc: 'Navigate Community/Building/Unit, scan barcode sticker, pair over BLE, push Sync.' },
      { num: 'STAGE 4', title: '2-Turn Thumbturn FDR & Auditory Beeps', desc: 'Remove 1 battery, 10s capacitor discharge, replace battery, 2 rapid thumbturns, beep test.' },
      { num: 'STAGE 5', title: 'Deletion Protocol & Support Escalation', desc: 'Mandatory cloud record deletion by support@onequext.com before re-using any lock.' },
    ];

    let roadY = curY + 38;
    stagesRoadmap.forEach((stage) => {
      doc.setFillColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
      doc.roundedRect(margin + 12, roadY - 8, 54, 13, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(stage.num, margin + 18, roadY + 1);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
      doc.text(stage.title, margin + 74, roadY + 1);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
      doc.text(stage.desc, margin + 74, roadY + 13);

      roadY += 34;
    });
  }

  // =========================================================================
  // HELPER TO RENDER A STEP CARD WITH COMPLETE TEXT WRAPPING
  // =========================================================================
  const renderStepCard = (step: BefeGuideStep, stageHeaderTitle: string) => {
    const textPadding = 12;
    const maxTextWidth = contentWidth - textPadding * 2 - 14;

    // Split title and instructions so nothing EVER runs off
    const titleLines = doc.splitTextToSize(`Step ${step.stepNumber}: ${step.title}`, maxTextWidth);
    
    // Process bullet points and measure lines
    const wrappedInstructions: string[][] = step.instructions.map((ins) =>
      doc.splitTextToSize(`• ${ins}`, maxTextWidth)
    );
    const totalInstructionLines = wrappedInstructions.reduce((sum, lines) => sum + lines.length, 0);

    let wrappedTip: string[] | null = null;
    if (step.fieldTips && step.fieldTips.length > 0) {
      wrappedTip = doc.splitTextToSize(`Tip: ${step.fieldTips[0]}`, maxTextWidth);
    }

    let wrappedWarning: string[] | null = null;
    if (step.criticalWarning) {
      wrappedWarning = doc.splitTextToSize(`WARNING: ${step.criticalWarning}`, maxTextWidth);
    }

    // Dynamic height calculation
    const lineHeight = isMobile ? 9.5 : 10.5;
    let cardHeight = 22 + (titleLines.length - 1) * 11 + totalInstructionLines * lineHeight + 12;
    if (wrappedTip) cardHeight += wrappedTip.length * lineHeight + 6;
    if (wrappedWarning) cardHeight += wrappedWarning.length * lineHeight + 6;

    // Check if card fits on current page, if not advance to new page!
    if (curY + cardHeight > pageHeight - (isMobile ? 36 : 46)) {
      curY = advancePage(stageHeaderTitle);
    }

    // Draw Card Background
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.setLineWidth(0.7);
    doc.roundedRect(margin, curY, contentWidth, cardHeight, 5, 5, 'FD');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 7.8 : 8.5);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    titleLines.forEach((tLine: string, tIdx: number) => {
      doc.text(tLine, margin + textPadding, curY + 15 + tIdx * 11);
    });

    let textY = curY + 18 + titleLines.length * 11;

    // Instructions
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isMobile ? 6.8 : 7.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    wrappedInstructions.forEach((lines) => {
      lines.forEach((line) => {
        doc.text(line, margin + textPadding + 4, textY);
        textY += lineHeight;
      });
    });

    // Tip
    if (wrappedTip) {
      textY += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(isMobile ? 6.8 : 7.2);
      doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
      wrappedTip.forEach((line) => {
        doc.text(line, margin + textPadding + 4, textY);
        textY += lineHeight;
      });
    }

    // Warning
    if (wrappedWarning) {
      textY += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(isMobile ? 6.8 : 7.2);
      doc.setTextColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
      wrappedWarning.forEach((line) => {
        doc.text(line, margin + textPadding + 4, textY);
        textY += lineHeight;
      });
    }

    curY += cardHeight + 8;
  };

  // =========================================================================
  // PAGE 2: STAGE 1 (PHONE SETUP) & STAGE 2 (PHYSICAL LATCH INSPECTION)
  // =========================================================================
  curY = advancePage('STAGE 1: PHONE SETUP & STAGE 2: PHYSICAL LATCH');

  // Stage 1 Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 9 : 10.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('STAGE 1: MOBILE ENVIRONMENT & PHONE PREPARATION', margin, curY);
  curY += 12;

  const stage1Steps = BEFE_GUIDE_STEPS.filter((s) => s.stageNumber === 1);
  stage1Steps.forEach((s) => renderStepCard(s, 'STAGE 1: PHONE SETUP & STAGE 2: PHYSICAL LATCH'));

  curY += 4;

  // Stage 2 Header
  if (curY > pageHeight - 140) {
    curY = advancePage('STAGE 2: PHYSICAL LATCH & BATTERY ACCESS');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 9 : 10.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('STAGE 2: PHYSICAL LATCH INSPECTION & BATTERY COMPARTMENT', margin, curY);
  curY += 12;

  const stage2Steps = BEFE_GUIDE_STEPS.filter((s) => s.stageNumber === 2);
  stage2Steps.forEach((s) => renderStepCard(s, 'STAGE 2: PHYSICAL LATCH & BATTERY ACCESS'));

  // Prevent Motor Stall Callout Box with text wrapping
  const stallTitle = 'PREVENT MOTOR STALL & BATTERY DRAIN:';
  const stallDesc =
    'Schlage Control deadbolts rely on an internal 6V DC stepper motor. If the bolt rubs against an undersized strike cavity, motor current spikes up to 700mA (8x nominal), depleting 4x AA batteries in under 60 days. Ensure a full 1-inch cavity depth.';
  const stallLines = doc.splitTextToSize(stallDesc, contentWidth - 24);
  const stallBoxHeight = 22 + stallLines.length * 10.5;

  if (curY + stallBoxHeight > pageHeight - (isMobile ? 36 : 46)) {
    curY = advancePage('STAGE 2: PHYSICAL LATCH & BATTERY ACCESS');
  }

  doc.setFillColor(colors.warningBg[0], colors.warningBg[1], colors.warningBg[2]);
  doc.setDrawColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, curY, contentWidth, stallBoxHeight, 5, 5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 7 : 7.8);
  doc.setTextColor(colors.warningText[0], colors.warningText[1], colors.warningText[2]);
  doc.text(stallTitle, margin + 12, curY + 14);

  doc.setFont('helvetica', 'normal');
  stallLines.forEach((line: string, idx: number) => {
    doc.text(line, margin + 12, curY + 26 + idx * 10.5);
  });

  curY += stallBoxHeight + 10;

  // =========================================================================
  // PAGE 3: STAGE 3 (APP ONBOARDING) & STAGE 4 (2-TURN FDR SEQUENCE)
  // =========================================================================
  curY = advancePage('STAGE 3: APP PROVISIONING & STAGE 4: 2-TURN FDR');

  // Stage 3 Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 9 : 10.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('STAGE 3: IN-APP QUEXT ADMIN PROVISIONING & PAIRING', margin, curY);
  curY += 12;

  const stage3Steps = BEFE_GUIDE_STEPS.filter((s) => s.stageNumber === 3);
  stage3Steps.forEach((s) => renderStepCard(s, 'STAGE 3: APP PROVISIONING & STAGE 4: 2-TURN FDR'));

  curY += 4;

  // Stage 4 Header
  if (curY > pageHeight - 160) {
    curY = advancePage('STAGE 4: THE 2-TURN THUMBTURN FDR RESET');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 9 : 10.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('STAGE 4: THE 2-TURN THUMBTURN FACTORY DEFAULT RESET (FDR)', margin, curY);
  curY += 12;

  // FDR Visual Process Box with text wrapping
  const fdrSteps = [
    '1. Power Disconnect: Remove exactly ONE (1) AA battery from the interior battery tray.',
    '2. Capacitor Drain: Wait full 5 to 10 seconds. Internal capacitors MUST discharge completely.',
    '3. Power Restoration: Reinsert the AA battery. Keep ear close and listen for SINGLE POWER-UP BEEP.',
    '4. Rapid 2-Turn Action: Immediately after the beep, rotate interior thumbturn TWICE within 2 seconds.',
    '5. Auditory Confirmation: Listen for TWO (2) SHORT BEEPS + ONE (1) LONG BEEP ("Beep-Beep... Beeeeep").',
  ];

  const fdrBoxHeight = isMobile ? 124 : 110;
  if (curY + fdrBoxHeight > pageHeight - (isMobile ? 36 : 46)) {
    curY = advancePage('STAGE 4: THE 2-TURN THUMBTURN FDR RESET');
  }

  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.setLineWidth(1);
  doc.roundedRect(margin, curY, contentWidth, fdrBoxHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 7.5 : 8.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('MANDATORY 5-STEP FDR EXECUTION SEQUENCE', margin + 12, curY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobile ? 6.8 : 7.5);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
  fdrSteps.forEach((st, idx) => {
    const wrappedSt = doc.splitTextToSize(st, contentWidth - 24);
    doc.text(wrappedSt, margin + 14, curY + 28 + idx * (isMobile ? 18 : 15));
  });

  curY += fdrBoxHeight + 10;

  // Auditory Codes Table
  if (curY > pageHeight - 160) {
    curY = advancePage('AUDITORY BEEP CODES & CONFIRMATION MATRIX');
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 8 : 9);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('AUDITORY BEEP CODES & CONFIRMATION MATRIX', margin, curY);
  curY += 8;

  const audioTableHeight = isMobile ? 160 : 136;
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.roundedRect(margin, curY, contentWidth, audioTableHeight, 5, 5, 'FD');

  let tableY = curY + 16;
  BEFE_AUDITORY_CODES.forEach((code) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 7 : 7.8);
    if (code.status === 'success') {
      doc.setTextColor(colors.successText[0], colors.successText[1], colors.successText[2]);
    } else if (code.status === 'error' || code.status === 'warning') {
      doc.setTextColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
    } else {
      doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
    }

    doc.text(code.sequence, margin + 12, tableY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isMobile ? 6.5 : 7.2);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    const meaningText = doc.splitTextToSize(`Meaning: ${code.meaning}`, contentWidth - (isMobile ? 120 : 170));
    doc.text(meaningText[0], margin + (isMobile ? 115 : 165), tableY);
    const actionText = doc.splitTextToSize(`Action: ${code.actionRequired}`, contentWidth - (isMobile ? 120 : 170));
    doc.text(actionText[0], margin + (isMobile ? 115 : 165), tableY + 10);

    tableY += isMobile ? 36 : 28;
  });

  curY += audioTableHeight + 10;

  // =========================================================================
  // PAGE 4: STAGE 5 (DELETION PROTOCOL & ESCALATION)
  // =========================================================================
  curY = advancePage('STAGE 5: DELETION PROTOCOL & ESCALATION');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 9 : 10.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('STAGE 5: STRICT OEM DELETION PROTOCOL & CLOUD DISSOCIATION', margin, curY);
  curY += 12;

  // Critical Deletion Callout Box
  const deletionTitle = 'CRITICAL PROTOCOL MANDATE: LOCK DELETIONS IN QUEXT CLOUD';
  const deletionText =
    'Whenever you delete a lock from the Quext app, you MUST reach out to Quext Support (support@onequext.com) to receive assistance in fully clearing out the lock from the property database before you can continue using that same lock in the app.\n\n• Deleting a lock on a mobile device only removes local bindings; the cryptographic hardware ID remains locked in the cloud.\n• Attempting to re-pair a deleted lock without support clearance will trigger pairing rejection (Cloud Conflict 409).\n• Always notify support@onequext.com immediately when swapping, moving, or reassigning any BE467 or FE410 smart lock.';
  const deletionParagraphs = doc.splitTextToSize(deletionText, contentWidth - 24);
  const deletionBoxHeight = 26 + deletionParagraphs.length * 10;

  doc.setFillColor(colors.warningBg[0], colors.warningBg[1], colors.warningBg[2]);
  doc.setDrawColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, curY, contentWidth, deletionBoxHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 7.5 : 8.5);
  doc.setTextColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.text(deletionTitle, margin + 12, curY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobile ? 6.8 : 7.5);
  doc.setTextColor(colors.warningText[0], colors.warningText[1], colors.warningText[2]);
  deletionParagraphs.forEach((line: string, idx: number) => {
    doc.text(line, margin + 12, curY + 28 + idx * 10);
  });

  curY += deletionBoxHeight + 12;

  // The 4-Step Recovery Loop
  const recoveryHeight = isMobile ? 120 : 108;
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.roundedRect(margin, curY, contentWidth, recoveryHeight, 5, 5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 7.8 : 8.5);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('THE STANDARD 4-STEP HARDWARE RECOVERY LOOP', margin + 12, curY + 16);

  const recoverySteps = [
    { step: 'Step A: Delete in App', text: 'Delete the lock profile inside Quext IoT Admin under unit settings.' },
    { step: 'Step B: Email Support', text: 'Send ticket to support@onequext.com with property name, unit, and barcode.' },
    { step: 'Step C: Physical FDR', text: 'Perform the 2-Turn Thumbturn Factory Default Reset to clear local memory.' },
    { step: 'Step D: Re-Onboard', text: 'Once support confirms cloud release, scan barcode and provision into target unit.' },
  ];

  let recY = curY + 34;
  recoverySteps.forEach((s) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 6.8 : 7.5);
    doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
    doc.text(s.step + ':', margin + 14, recY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    const recText = doc.splitTextToSize(s.text, contentWidth - (isMobile ? 100 : 120));
    doc.text(recText[0], margin + (isMobile ? 95 : 115), recY);

    recY += isMobile ? 18 : 16;
  });

  curY += recoveryHeight + 12;

  // Support Ticket Template
  const emailBoxLines = [
    'TO: support@onequext.com',
    'SUBJECT: Urgent Lock Deletion & Cloud Clearance Request - [Community Name]',
    'Community Name: _____________________   Building & Unit: _____________________',
    'Lock Model: [ ] BE467 Deadbolt   [ ] FE410 Interconnected',
    'Serial Number (from barcode sticker): _____________________',
    'Installer Name & Field ID: _____________________',
    'Reason: [ ] Physical Replacement   [ ] Test Unit Transfer   [ ] Unit Move',
  ];

  const emailBoxHeight = isMobile ? 120 : 108;
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.roundedRect(margin, curY, contentWidth, emailBoxHeight, 5, 5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 7.5 : 8.5);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('SUPPORT ESCALATION DISPATCH TEMPLATE (support@onequext.com)', margin + 12, curY + 16);

  doc.setFont('courier', 'normal');
  doc.setFontSize(isMobile ? 6.5 : 7.2);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
  emailBoxLines.forEach((line, idx) => {
    doc.text(line, margin + 14, curY + 30 + idx * (isMobile ? 12 : 11));
  });

  curY += emailBoxHeight + 12;

  // Sign-off verification box
  if (!isMobile) {
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.setLineWidth(0.8);
    doc.rect(margin, curY, contentWidth, 44);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text('FIELD COMMISSIONING VERIFICATION & SIGN-OFF:', margin + 12, curY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Installer Signature: ____________________________   Date: ___________   2-Turn FDR Verified: [ ] YES', margin + 12, curY + 31);
  }

  drawFooter();

  // Save the generated PDF
  const filename = isMobile
    ? `Quext_BEFE_Smart_Deadbolts_Mobile_QuickGuide_${theme}.pdf`
    : `Quext_BEFE_Smart_Deadbolts_Field_Guide_${theme}.pdf`;
  doc.save(filename);
};
