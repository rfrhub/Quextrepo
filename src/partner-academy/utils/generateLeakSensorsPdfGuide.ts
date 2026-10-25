import { jsPDF } from 'jspdf';
import {
  TOILET_INSTALLATION_STEPS,
  POINT_OF_USE_LEAK_LOCATIONS,
  TROUBLESHOOTING_CASES,
  LEAK_SENSOR_SPECS,
  PORTAL_AUTOMATION_RULES,
  LeakStep
} from '../data/leakSensorsGuideData';

export interface LeakPdfOptions {
  theme?: 'white' | 'dark';
}

export const generateAndDownloadLeakSensorsPdf = (options: LeakPdfOptions = {}) => {
  const { theme = 'white' } = options;
  const isDark = theme === 'dark';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 612 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 792 pt
  const margin = 44;
  const contentWidth = pageWidth - margin * 2; // 524 pt
  const maxUsableY = pageHeight - 48;

  // Quext Branding Palette Aligned with onequext.com
  const colors = {
    pageBg: isDark ? [10, 14, 24] : [255, 255, 255],
    cardBg: isDark ? [16, 22, 36] : [248, 250, 252],
    cardBorder: isDark ? [38, 48, 70] : [226, 232, 240],
    titlePurple: isDark ? [192, 132, 252] : [124, 58, 237],
    titleBlue: isDark ? [96, 165, 250] : [37, 99, 235],
    accentCyan: isDark ? [34, 211, 238] : [8, 145, 178],
    headingText: isDark ? [255, 255, 255] : [15, 23, 42],
    subText: isDark ? [203, 213, 225] : [71, 85, 105],
    bodyText: isDark ? [226, 232, 240] : [30, 41, 59],
    mutedText: isDark ? [148, 163, 184] : [100, 116, 139],
    accentAmber: isDark ? [251, 191, 36] : [217, 119, 6],
    badgeBg: isDark ? [24, 32, 50] : [241, 245, 249],
    warningBg: isDark ? [45, 20, 20] : [254, 242, 242],
    warningBorder: isDark ? [153, 27, 27] : [252, 165, 165],
    warningText: isDark ? [254, 202, 202] : [185, 28, 28],
    successBg: isDark ? [16, 40, 28] : [240, 253, 244],
    successText: isDark ? [134, 239, 172] : [22, 101, 52]
  };

  const drawPageBackground = () => {
    doc.setFillColor(colors.pageBg[0], colors.pageBg[1], colors.pageBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  const drawRunningHeader = (categoryName: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text('QUEXT IOT · LEAK SENSORS & TOILET RUN FIELD GUIDE', margin, 32);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.accentCyan[0], colors.accentCyan[1], colors.accentCyan[2]);
    doc.text(categoryName.toUpperCase(), pageWidth - margin, 32, { align: 'right' });

    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.setLineWidth(0.6);
    doc.line(margin, 38, pageWidth - margin, 38);
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    const footY = pageHeight - 26;
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.setLineWidth(0.6);
    doc.line(margin, footY - 8, pageWidth - margin, footY - 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text('onequext.com · OEM Technical Documentation · Field Operations', margin, footY);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footY, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  drawPageBackground();

  // Top Quext Logo & Badge
  doc.setDrawColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.setFillColor(isDark ? 18 : 243, isDark ? 24 : 244, isDark ? 42 : 246);
  doc.roundedRect(margin, 52, 68, 22, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text('quext', margin + 34, 67, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(colors.accentCyan[0], colors.accentCyan[1], colors.accentCyan[2]);
  doc.text('PARTNER ACADEMY · OEM FIELD GUIDE', margin + 78, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
  doc.text('Sensor Industries Integration & Smart Water Management', margin + 78, 72);

  // Main Title with generous vertical spacing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Water Leak & Toilet Run Sensor', margin, 114);
  doc.text('Installation & Dispatch Manual', margin, 142);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
  const coverIntro = 'Official step-by-step procedural guide for deploying Sensor Industries In-Line Toilet Run Sensors and Point-of-Use Surface Leak Detectors across Quext multifamily properties, featuring embedded LoRaWAN gateway communications and automated portal dispatch.';
  const splitIntro = doc.splitTextToSize(coverIntro, contentWidth);
  doc.text(splitIntro, margin, 168);

  // Quick Spec Cards (2 columns)
  let yCard = 210;
  const halfColWidth = (contentWidth - 14) / 2;

  // Box 1: Toilet Run Sensor
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.roundedRect(margin, yCard, halfColWidth, 115, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.titleBlue[0], colors.titleBlue[1], colors.titleBlue[2]);
  doc.text('SI-FLUSH-01 IN-LINE SENSOR', margin + 12, yCard + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
  doc.text('• Placement: Between angle stop line & tank fill valve', margin + 12, yCard + 36);
  doc.text('• Mechanism: Magnetic piston & internal reed switch', margin + 12, yCard + 50);
  doc.text('• Installation Time: 2-3 minutes (Hand-tightened only)', margin + 12, yCard + 64);
  doc.text('• Battery: 7+ Year pre-installed lithium cell', margin + 12, yCard + 78);
  doc.text('• Detects: Continuous runs, flapper leaks, micro-flows', margin + 12, yCard + 92);
  doc.text('• Network: SI-Mesh / LoRaWAN to Quext Thermostat', margin + 12, yCard + 104);

  // Box 2: Surface Probe Sensor
  const col2X = margin + halfColWidth + 14;
  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.roundedRect(col2X, yCard, halfColWidth, 115, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.text('SI-LEAK-01 SURFACE DETECTOR', col2X + 12, yCard + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
  doc.text('• Placement: Under sinks, water heaters, HVAC pans', col2X + 12, yCard + 36);
  doc.text('• Detection: Dual gold-plated conductivity pins', col2X + 12, yCard + 50);
  doc.text('• Trigger: 1/16" standing water puddle contact', col2X + 12, yCard + 64);
  doc.text('• Response Time: Instantaneous SMS / portal dispatch', col2X + 12, yCard + 78);
  doc.text('• Battery: 8+ Year replaceable lithium cell', col2X + 12, yCard + 92);
  doc.text('• Footprint: Ultra-slim compact 2.1" diameter disk', col2X + 12, yCard + 104);

  // Core Architecture Diagram Banner
  yCard += 130;
  doc.setFillColor(isDark ? 14 : 241, isDark ? 20 : 245, isDark ? 32 : 249);
  doc.setDrawColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
  doc.roundedRect(margin, yCard, contentWidth, 80, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('EMBEDDED LORAWAN ECOSYSTEM ARCHITECTURE', margin + 14, yCard + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
  const archText = 'Quext Smart Thermostats (QXT100048) house an embedded LoRaWAN radio gateway, forming a property-wide wireless umbrella. Sensor Industries toilet sensors and flood probes communicate directly with the local thermostat hub without requiring resident Wi-Fi passwords, secondary hub bridges, or cellular repeaters.';
  const splitArch = doc.splitTextToSize(archText, contentWidth - 28);
  doc.text(splitArch, margin + 14, yCard + 32);

  // Summary Table of Contents / Quick Highlights
  yCard += 95;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('FIELD GUIDE CONTENTS & PHASES', margin, yCard);

  yCard += 16;
  const sections = [
    { num: 'PHASE 1-2', label: 'Preparation & Supply Line Isolation (Water shutoff, bowl setup, fill valve stabilization)' },
    { num: 'PHASE 3-5', label: 'Sensor Activation & Mechanical Installation (Pulling zip tie, hand-threading, reconnection)' },
    { num: 'PHASE 6-7', label: 'Pressure Test & Flush Telemetry Verification (Wipe check, flush cycle, portal check-in)' },
    { num: 'MODULE 2', label: 'Point-of-Use Surface Leak Detector Placement (Kitchen, vanity, HVAC, water heater pans)' },
    { num: 'MODULE 3', label: 'Quext IoT Portal Management & Automation (Device logs, RSSI diagnostics, SMS dispatch roster)' },
    { num: 'MODULE 4', label: 'Field Troubleshooting & Diagnostic Protocol (Continuous run alarms, slow weeping, offline pings)' }
  ];

  sections.forEach((sec, idx) => {
    const itemY = yCard + idx * 24;
    doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
    doc.roundedRect(margin, itemY - 11, 62, 16, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
    doc.text(sec.num, margin + 31, itemY, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    doc.text(sec.label, margin + 70, itemY);
  });

  // Footer on cover
  drawFooter(1, 4);

  // ==========================================
  // PAGE 2: THE 7-STEP TOILET SENSOR GUIDE
  // ==========================================
  doc.addPage();
  drawPageBackground();
  drawRunningHeader('Toilet In-Line Sensor Installation');

  let curY = 56;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('7-Step In-Line Toilet Sensor Installation', margin, curY);

  curY += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
  doc.text('Toolless hand-threaded installation procedure (Approximate field duration: 2-3 minutes per unit).', margin, curY);

  curY += 16;

  // Render steps 1 through 5 on Page 2
  TOILET_INSTALLATION_STEPS.slice(0, 5).forEach((st) => {
    const boxHeight = 76;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, boxHeight, 5, 5, 'FD');

    // Step Number Badge
    doc.setFillColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
    doc.roundedRect(margin + 8, curY + 8, 48, 16, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`STEP 0${st.stepNumber}`, margin + 32, curY + 19, { align: 'center' });

    // Step Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text(st.title, margin + 64, curY + 20);

    // Summary line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
    doc.text(st.summary, margin + 12, curY + 36);

    // Key bullets
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    const b1 = st.keyActions[0];
    const b2 = st.keyActions[1] || '';
    doc.text(`• ${b1}`, margin + 12, curY + 49);
    if (b2) {
      doc.text(`• ${b2}`, margin + 12, curY + 61);
    }

    // Warning callout if present
    if (st.fieldWarning) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(colors.accentAmber[0], colors.accentAmber[1], colors.accentAmber[2]);
      doc.text(`ATTN: ${st.fieldWarning.substring(0, 88)}...`, margin + 12, curY + 71);
    }

    curY += boxHeight + 10;
  });

  drawFooter(2, 4);

  // ==========================================
  // PAGE 3: STEPS 6-7 & POINT-OF-USE PROBES
  // ==========================================
  doc.addPage();
  drawPageBackground();
  drawRunningHeader('Steps 6-7 & Point-of-Use Surface Placement');

  curY = 56;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Verification & Flush Diagnostics (Steps 6 & 7)', margin, curY);
  curY += 18;

  // Render Steps 6 and 7
  TOILET_INSTALLATION_STEPS.slice(5, 7).forEach((st) => {
    const boxHeight = 84;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, boxHeight, 5, 5, 'FD');

    // Step Number Badge
    doc.setFillColor(colors.accentCyan[0], colors.accentCyan[1], colors.accentCyan[2]);
    doc.roundedRect(margin + 8, curY + 8, 48, 16, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`STEP 0${st.stepNumber}`, margin + 32, curY + 19, { align: 'center' });

    // Step Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text(st.title, margin + 64, curY + 20);

    // Summary line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
    doc.text(st.summary, margin + 12, curY + 36);

    // Key bullets
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    st.keyActions.slice(0, 2).forEach((action, aIdx) => {
      doc.text(`• ${action}`, margin + 12, curY + 49 + aIdx * 11);
    });

    if (st.proTip) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
      doc.text(`PRO TIP: ${st.proTip}`, margin + 12, curY + 77);
    }

    curY += boxHeight + 12;
  });

  // Section: Surface Probe Placement Matrix
  curY += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Point-of-Use Surface Leak Detector Placement Matrix', margin, curY);

  curY += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
  doc.text('Guidelines for high-risk flood zones within residential apartment units (SI-LEAK-01 probes).', margin, curY);

  curY += 16;
  POINT_OF_USE_LEAK_LOCATIONS.forEach((loc) => {
    const locBoxHeight = 52;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, locBoxHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text(loc.zone, margin + 10, curY + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(loc.priority.includes('Critical') ? colors.warningText[0] : colors.accentCyan[0], loc.priority.includes('Critical') ? colors.warningText[1] : colors.accentCyan[1], loc.priority.includes('Critical') ? colors.warningText[2] : colors.accentCyan[2]);
    doc.text(loc.priority.toUpperCase(), pageWidth - margin - 10, curY + 16, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    doc.text(`Source: ${loc.targetSource}`, margin + 10, curY + 30);
    doc.text(`Protocol: ${loc.placementProtocol}`, margin + 10, curY + 43);

    curY += locBoxHeight + 8;
  });

  drawFooter(3, 4);

  // ==========================================
  // PAGE 4: QUExt PORTAL AUTOMATION & TROUBLESHOOTING
  // ==========================================
  doc.addPage();
  drawPageBackground();
  drawRunningHeader('Quext Portal Management & Troubleshooting');

  curY = 56;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Quext IoT Portal: Automation & Dispatch Configuration', margin, curY);

  curY += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
  doc.text('Access path: Bookmarks -> IoT -> "Devices" (Leak Sensors) & "Automation" (Notification Rules).', margin, curY);

  curY += 16;

  // Automation triggers grid
  PORTAL_AUTOMATION_RULES.triggerTypes.forEach((rule) => {
    const ruleBoxHeight = 44;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, ruleBoxHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colors.titlePurple[0], colors.titlePurple[1], colors.titlePurple[2]);
    doc.text(rule.name, margin + 10, curY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text(`Threshold: ${rule.threshold}`, margin + 10, curY + 28);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    doc.text(`Dispatch: ${rule.action}`, margin + 10, curY + 39);

    curY += ruleBoxHeight + 6;
  });

  // Troubleshooting Matrix
  curY += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Field Troubleshooting & Diagnostic Protocol', margin, curY);

  curY += 16;
  TROUBLESHOOTING_CASES.forEach((tc) => {
    const tcBoxHeight = 62;
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, tcBoxHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(tc.severity === 'Critical' ? colors.warningText[0] : colors.accentAmber[0], tc.severity === 'Critical' ? colors.warningText[1] : colors.accentAmber[1], tc.severity === 'Critical' ? colors.warningText[2] : colors.accentAmber[2]);
    doc.text(`[${tc.severity.toUpperCase()}] ${tc.symptom}`, margin + 10, curY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
    doc.text(`Root Cause: ${tc.potentialCause}`, margin + 10, curY + 28);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    doc.text(`Action: ${tc.fieldAction[0]}`, margin + 10, curY + 41);
    if (tc.fieldAction[1]) {
      doc.text(`        ${tc.fieldAction[1]}`, margin + 10, curY + 53);
    }

    curY += tcBoxHeight + 8;
  });

  // Engineering Sign-off Box
  curY = pageHeight - 110;
  doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
  doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
  doc.roundedRect(margin, curY, contentWidth, 48, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('OEM SPECIFICATION & VERIFICATION SIGN-OFF', margin + 12, curY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(colors.subText[0], colors.subText[1], colors.subText[2]);
  doc.text('Prepared by: Raul Recalde, Field Operations & Smart Systems Engineering · Quext IoT', margin + 12, curY + 28);
  doc.text('Applicable Standards: Sensor Industries SI-Mesh LoRaWAN Protocol · Quext Thermostat Gateway QXT100048', margin + 12, curY + 39);

  drawFooter(4, 4);

  // Trigger download
  const filename = `Quext_Water_Leak_Sensor_Installation_Guide_${theme.toUpperCase()}.pdf`;
  doc.save(filename);
};
