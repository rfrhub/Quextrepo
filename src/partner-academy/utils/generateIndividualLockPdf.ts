import { jsPDF } from 'jspdf';
import {
  LOCK_GUIDES_CONFIGS,
  LockGuideConfig,
  ONBOARDING_FLOW_SLIDES,
  INSTALLATION_INFO_NEED_TO_KNOWS,
} from '../data/quextLockGuidesData';

export interface LockPdfOptions {
  theme?: 'white' | 'dark';
  format?: 'letter' | 'mobile';
}

export const generateAndDownloadIndividualLockPdf = (
  lockId: 'befe' | 'ndeb' | 'xe360' | 'rc_reader',
  options: LockPdfOptions = {}
) => {
  const { theme = 'white', format = 'letter' } = options;
  const isDark = theme === 'dark';
  const isMobile = format === 'mobile';

  const config: LockGuideConfig = LOCK_GUIDES_CONFIGS[lockId];

  // Letter: 612 x 792 pt | Mobile: 390 x 844 pt
  const pageWidth = isMobile ? 390 : 612;
  const pageHeight = isMobile ? 844 : 792;
  const margin = isMobile ? 24 : 40;
  const contentWidth = pageWidth - margin * 2;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: isMobile ? [390, 844] : 'letter',
  });

  const colors = {
    pageBg: isDark ? [10, 14, 24] : [255, 255, 255],
    cardBg: isDark ? [18, 24, 38] : [248, 250, 252],
    cardBorder: isDark ? [40, 50, 72] : [226, 232, 240],
    purpleMain: isDark ? [192, 132, 252] : [126, 34, 206],
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

  const drawPageBackground = () => {
    doc.setFillColor(colors.pageBg[0], colors.pageBg[1], colors.pageBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  const drawRunningHeader = (sectionTitle: string) => {
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
    doc.text(config.name.toUpperCase(), margin + 52, 31);

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
    doc.text('QUEXT CERTIFIED OEM FIELD INSTALLATION GUIDE', margin, footY);

    const pageStr = isMobile ? `PAGE ${currentPage}` : `PAGE ${currentPage} · ${config.deviceModels}`;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
    doc.text(pageStr, pageWidth - margin, footY, { align: 'right' });
  };

  const advancePage = (headerTitle: string) => {
    drawFooter();
    doc.addPage();
    currentPage += 1;
    drawPageBackground();
    drawRunningHeader(headerTitle);
    return 58;
  };

  // =========================================================================
  // PAGE 1: COVER & IMPORTANT NOTICES
  // =========================================================================
  drawPageBackground();
  drawRunningHeader('OVERVIEW & IMPORTANT NOTICES');
  let curY = 60;

  // Title Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 15 : 18);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text(config.name, margin, curY);

  curY += isMobile ? 14 : 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 8.5 : 9.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text(config.subtitle, margin, curY);

  curY += isMobile ? 16 : 20;

  // Deletion Protocol Warning (Slide 2)
  const deletionTitle = 'CRITICAL OEM NOTICE: LOCK DELETION IN APP (SLIDE 2)';
  const deletionText =
    'Whenever you delete a lock from the Quext app you will need to reach out to support (support@onequext.com) to receive assistance in fully clearing out the lock from the system before you can continue using that same lock in the app.\n\nDeleting on a mobile phone only removes local links. The cloud database holds the cryptographic reservation until cleared by Quext Support.';
  const deletionLines = doc.splitTextToSize(deletionText, contentWidth - 24);
  const deletionBoxHeight = 26 + deletionLines.length * 10.5;

  doc.setFillColor(colors.warningBg[0], colors.warningBg[1], colors.warningBg[2]);
  doc.setDrawColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, curY, contentWidth, deletionBoxHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 7.5 : 8.5);
  doc.setTextColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.text(deletionTitle, margin + 12, curY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobile ? 7 : 7.5);
  doc.setTextColor(colors.warningText[0], colors.warningText[1], colors.warningText[2]);
  deletionLines.forEach((l: string, idx: number) => {
    doc.text(l, margin + 12, curY + 28 + idx * 10.5);
  });

  curY += deletionBoxHeight + 12;

  // Phone Environment Setup (Slides 3, 4, 5)
  const phoneNotices = [
    {
      title: 'Slide 3: Turn Off Screen Auto-Lock',
      desc: 'Ensure your phone settings do not automatically lock your screen during key exchange.\n• iOS: Settings → Display & Brightness → Auto-Lock → Select "Never".\n• Android: Settings → Security & Privacy → Screen Lock → Select "None" or "Swipe".',
    },
    {
      title: 'Slide 4: Prioritize Cellular Signal',
      desc: 'Ensure that you prioritize using cellular signal as your main method of communication to the Quext app unless in a poor service area for cellular coverage.',
    },
    {
      title: 'Slide 5: Quext IoT Admin App Verification',
      desc: 'Double check you are using the Quext IOT Admin app (with the dark icon and cyan frame), NOT the resident-facing Quext IoT app.',
    },
  ];

  phoneNotices.forEach((notice) => {
    const lines = doc.splitTextToSize(notice.desc, contentWidth - 24);
    const boxH = 22 + lines.length * 10.5;

    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, boxH, 5, 5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 7.5 : 8.2);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text(notice.title, margin + 12, curY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isMobile ? 6.8 : 7.2);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    lines.forEach((l: string, idx: number) => {
      doc.text(l, margin + 12, curY + 26 + idx * 10.5);
    });

    curY += boxH + 8;
  });

  // =========================================================================
  // PAGE 2: IN-APP ONBOARDING, SYNCING & TESTING (SLIDES 6 - 17)
  // =========================================================================
  curY = advancePage('ONBOARDING, SYNCING & TESTING');

  const onboardingSteps = [
    { num: 'Slide 6', title: 'Login with Admin Credentials', text: 'Enter your email and password, check the legal agreement boxes, and tap Sign In.' },
    { num: 'Slide 7', title: 'Tap the Service Gear Icon', text: 'Once logged in, tap on the "Service" gear icon located on the bottom navigation bar.' },
    { num: 'Slide 8', title: 'Select Location for Service', text: 'Navigate: Community → Building → Specific Unit number or Amenity Door.' },
    { num: 'Slide 9', title: 'Tap "+ Install device"', text: 'Tap the purple install device button at the bottom of the location profile screen.' },
    { num: 'Slide 10', title: 'Select "Lock" from Pop-Up', text: 'Select "Lock" from the pop up menu (used for BE467, FE410, NDEB, XE360, and RC readers).' },
    { num: 'Slide 11', title: 'Scan Lock Barcode Sticker', text: 'Locate the lock serial number barcode sticker and place inside the camera scan reticle.' },
    { num: 'Slide 12', title: 'Confirm Location & Tap Install', text: 'Confirm location matches unit number and tap "Install". The app automatically adds the lock.' },
    { num: 'Slide 13', title: 'Tap "Sync" Button', text: 'Once installed, tap the purple "Sync" button on the lock profile to push active credentials.' },
    { num: 'Slides 14-16', title: 'Test the Lock via Home Screen', text: 'Return Home, tap the key symbol, wait for Bluetooth search, verify "Activated!", and unlock.' },
    { num: 'Slide 17', title: 'Onboarding Completed!', text: 'Door engaged and verified. The mobile credential pass is live and ready for residents/staff.' },
  ];

  onboardingSteps.forEach((st) => {
    const lines = doc.splitTextToSize(st.text, contentWidth - 90);
    const boxH = Math.max(isMobile ? 38 : 34, 18 + lines.length * 10.5);

    if (curY + boxH > pageHeight - (isMobile ? 36 : 46)) {
      curY = advancePage('ONBOARDING, SYNCING & TESTING');
    }

    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, boxH, 4, 4, 'FD');

    doc.setFillColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
    doc.roundedRect(margin + 10, curY + 9, 58, 14, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(st.num, margin + 14, curY + 19);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 7.5 : 8);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text(st.title, margin + 76, curY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isMobile ? 6.5 : 7.2);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    lines.forEach((l: string, idx: number) => {
      doc.text(l, margin + 76, curY + 27 + idx * 10);
    });

    curY += boxH + 6;
  });

  // =========================================================================
  // PAGE 3: HARDWARE-SPECIFIC FACTORY RESET (SLIDES 20 - 23)
  // =========================================================================
  curY = advancePage(`FACTORY RESET: ${config.name.toUpperCase()}`);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 10 : 12);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text(`FACTORY DEFAULT RESET: ${config.fdrTitle.toUpperCase()}`, margin, curY);
  curY += 12;

  // FDR Card Box
  const fdrInstructionLines = config.fdrInstructions.map((ins) =>
    doc.splitTextToSize(ins, contentWidth - 28)
  );
  const totalFdrLines = fdrInstructionLines.reduce((sum, arr) => sum + arr.length, 0);
  const fdrCardH = 26 + totalFdrLines * 11 + (config.fdrTimingRule ? 24 : 0);

  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, curY, contentWidth, fdrCardH, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text(`OFFICIAL RESET SEQUENCE · SLIDE ${config.fdrSlideNumber}`, margin + 14, curY + 16);

  let insY = curY + 30;
  fdrInstructionLines.forEach((lines) => {
    lines.forEach((line: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(isMobile ? 7 : 7.8);
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      doc.text(line, margin + 14, insY);
      insY += 11;
    });
  });

  if (config.fdrTimingRule) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 7 : 7.5);
    doc.setTextColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
    doc.text(`CRITICAL TIMING: ${config.fdrTimingRule}`, margin + 14, insY + 6);
  }

  curY += fdrCardH + 12;

  // Pro Tips for this lock
  if (config.fdrProTips && config.fdrProTips.length > 0) {
    config.fdrProTips.forEach((tip) => {
      const tipLines = doc.splitTextToSize(`PRO TIP: ${tip}`, contentWidth - 24);
      const tipH = 16 + tipLines.length * 10.5;

      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.setDrawColor(colors.cyanAccent[0], colors.cyanAccent[1], colors.cyanAccent[2]);
      doc.roundedRect(margin, curY, contentWidth, tipH, 5, 5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(isMobile ? 6.8 : 7.5);
      doc.setTextColor(colors.cyanAccent[0], colors.cyanAccent[1], colors.cyanAccent[2]);
      tipLines.forEach((l: string, idx: number) => {
        doc.text(l, margin + 12, curY + 14 + idx * 10.5);
      });

      curY += tipH + 8;
    });
  }

  // =========================================================================
  // PAGE 4: TROUBLESHOOTING & SUPPORT DISPATCH (SLIDES 24 - 26)
  // =========================================================================
  curY = advancePage('TROUBLESHOOTING & CONTACT SUPPORT');

  const troubleshootingItems = [
    {
      q: 'Slide 24: I don\'t see my invite to the app or credentials I need?',
      a: 'Contact Quext Support (support@onequext.com). They can assist with getting you back on track with login issues and missing credentials!',
    },
    {
      q: 'Slide 25: The lock I just installed is not responding to the app or fob?',
      a: '1. Ensure your phone is running the latest OS version and Bluetooth is ON.\n2. As a last resort, delete the lock from the Quext App.\n3. Reach out to support@onequext.com to have them delete the lock from the cloud.\n4. Perform Factory Reset (FDR) as described in this guide.\n5. Repeat onboarding process from Slide 5 through Slide 11, then Sync and test!',
    },
    {
      q: 'Slide 26: The lock I just installed won\'t complete the Sync step?',
      a: 'In this instance, the solution is again deleting the lock you are having issues with from the Quext App, reaching out to support to delete on their end, performing another Factory Reset (FDR), and repeating onboarding from Slide 5 to 11.',
    },
  ];

  troubleshootingItems.forEach((item) => {
    const qLines = doc.splitTextToSize(item.q, contentWidth - 24);
    const aLines = doc.splitTextToSize(item.a, contentWidth - 24);
    const boxH = 24 + (qLines.length - 1) * 11 + aLines.length * 10.5;

    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, boxH, 5, 5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 7.5 : 8.2);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    qLines.forEach((l: string, idx: number) => {
      doc.text(l, margin + 12, curY + 15 + idx * 11);
    });

    let ansY = curY + 18 + qLines.length * 11;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isMobile ? 6.8 : 7.2);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    aLines.forEach((l: string) => {
      doc.text(l, margin + 12, ansY);
      ansY += 10.5;
    });

    curY += boxH + 8;
  });

  // Support Footer Dispatch
  const supportBoxH = 46;
  doc.setFillColor(colors.warningBg[0], colors.warningBg[1], colors.warningBg[2]);
  doc.setDrawColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.roundedRect(margin, curY, contentWidth, supportBoxH, 5, 5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 7.5 : 8.5);
  doc.setTextColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.text('DIRECT ESCALATION CONTACT:', margin + 12, curY + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobile ? 7 : 7.5);
  doc.setTextColor(colors.warningText[0], colors.warningText[1], colors.warningText[2]);
  doc.text('Email: support@onequext.com · Provide Property Name, Unit #, Lock Model, and Barcode Serial Number.', margin + 12, curY + 31);

  drawFooter();

  const filename = isMobile
    ? `Quext_${config.id.toUpperCase()}_Field_Guide_Mobile_${theme}.pdf`
    : `Quext_${config.id.toUpperCase()}_Field_Guide_${theme}.pdf`;
  doc.save(filename);
};
