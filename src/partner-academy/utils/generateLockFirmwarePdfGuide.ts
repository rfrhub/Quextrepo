import { jsPDF } from 'jspdf';
import {
  LOCK_FIRMWARE_METADATA,
  LOCK_FIRMWARE_SLIDES,
  LOCK_FIRMWARE_STEPS,
} from '../data/lockFirmwareGuideData';

export interface FirmwarePdfOptions {
  theme?: 'white' | 'dark';
  format?: 'letter' | 'mobile';
}

export const generateAndDownloadLockFirmwarePdf = (
  options: FirmwarePdfOptions = {}
) => {
  const { theme = 'white', format = 'letter' } = options;
  const isDark = theme === 'dark';
  const isMobile = format === 'mobile';

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
    doc.text('LOCK FIRMWARE GUIDE', margin + 52, 31);

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
    doc.text('QUEXT CERTIFIED OEM LOCK FIRMWARE UPGRADE GUIDE', margin, footY);

    const pageStr = isMobile ? `PAGE ${currentPage}` : `PAGE ${currentPage} · BE, FE, XE360 & NDEB LOCKS`;
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
  // PAGE 1: COVER & PREPARATION (SLIDES 1 - 5)
  // =========================================================================
  drawPageBackground();
  drawRunningHeader('OVERVIEW & PREPARATION');
  let curY = 60;

  // Title Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 15 : 18);
  doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
  doc.text('Lock Firmware Guide', margin, curY);

  curY += isMobile ? 14 : 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 8.5 : 9.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('The following process applies to both BE, FE, XE360, and NDEB type locks', margin, curY);

  curY += isMobile ? 16 : 20;

  // Overview Banner Box
  const overviewTitle = 'SUPPORT & CELLULAR PRIORITY MANDATE (SLIDE 2)';
  const overviewText =
    'Direct Support Contact: support@onequext.com\n\nEnsure that you prioritize using cellular signal as your main method of communication to the Quext app unless under a poor service area for cellular coverage. Building guest Wi-Fi networks frequently disrupt continuous Bluetooth Low Energy (BLE) firmware transfer packets.';
  const overviewLines = doc.splitTextToSize(overviewText, contentWidth - 24);
  const overviewBoxHeight = 26 + overviewLines.length * 10.5;

  doc.setFillColor(colors.warningBg[0], colors.warningBg[1], colors.warningBg[2]);
  doc.setDrawColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, curY, contentWidth, overviewBoxHeight, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 7.5 : 8.5);
  doc.setTextColor(colors.warningBorder[0], colors.warningBorder[1], colors.warningBorder[2]);
  doc.text(overviewTitle, margin + 12, curY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobile ? 7 : 7.5);
  doc.setTextColor(colors.warningText[0], colors.warningText[1], colors.warningText[2]);
  overviewLines.forEach((l: string, idx: number) => {
    doc.text(l, margin + 12, curY + 28 + idx * 10.5);
  });

  curY += overviewBoxHeight + 12;

  // Phone Environment Setup (Slides 3, 4, 5)
  const prepCards = [
    {
      title: 'Slide 3: Turn Off Phone Screen Auto-Lock',
      desc: 'Ensure that your phone settings do not automatically lock your screen during firmware updates.\n• Android: Settings → Security & Privacy (on Samsung devices, tap Lock screen or Security and privacy first) → Screen lock → Enter current PIN/pattern/pwd → Choose "None" or "Swipe".\n• iOS: Settings → Display & Brightness → Auto-Lock → Select "Never" so screen stays on until you press the side button.',
    },
    {
      title: 'Slide 4: App Verification (Quext IoT Admin App)',
      desc: 'Double check you are using the Quext IOT Admin app (with the dark lockup and cyan square border, marked with a green checkmark), NOT the resident-facing Quext IoT app (marked with a red X). The resident app lacks administrative firmware flashing controls.',
    },
    {
      title: 'Slide 5: Login with Enterprise Admin Credentials',
      desc: 'Enter your authorized installation email and password in the Quext Admin login screen. Check the legal agreement box ("I have read and agree to Privacy Policy, Terms of Use, and EULA") and tap "Sign in".',
    },
  ];

  prepCards.forEach((card) => {
    const lines = doc.splitTextToSize(card.desc, contentWidth - 24);
    const boxH = 22 + lines.length * 10.5;

    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    doc.roundedRect(margin, curY, contentWidth, boxH, 5, 5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobile ? 7.5 : 8.2);
    doc.setTextColor(colors.headingText[0], colors.headingText[1], colors.headingText[2]);
    doc.text(card.title, margin + 12, curY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isMobile ? 6.8 : 7.2);
    doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
    lines.forEach((l: string, idx: number) => {
      doc.text(l, margin + 12, curY + 26 + idx * 10.5);
    });

    curY += boxH + 8;
  });

  // =========================================================================
  // PAGE 2: IN-APP NAVIGATION & VERSION SELECTION (SLIDES 6 - 11)
  // =========================================================================
  curY = advancePage('IN-APP NAVIGATION & SELECTION');

  const navSteps = [
    {
      num: 'Slide 6',
      title: 'Tap the Service Gear Icon',
      text: 'Once logged in tap on the service gear icon located on the bottom navigation bar.',
    },
    {
      num: 'Slide 7',
      title: 'Select Lock Location',
      text: 'Drill down through the property tree to select the specific location of your Lock (e.g., Amenities, Building 1, Homebase Office, or specific Unit number).',
    },
    {
      num: 'Slide 8',
      title: 'Select Lock & Tap Three Dots (...)',
      text: 'Select your target lock from the device list, then tap on the three dots (...) in the upper-right corner of the lock profile card.',
    },
    {
      num: 'Slide 9',
      title: 'Select "Update firmware" from Menu',
      text: 'From the pop-up context menu (Read audits, Update firmware, Change location, Uninstall, Full delete), select "Update firmware" to launch the firmware update tool.',
    },
    {
      num: 'Slide 10',
      title: 'Review Current Version & Tap "Selected version"',
      text: 'The Firmware update screen displays Lock SN and Current version (e.g., 05.19.02). Tap on the "Selected version >" row to open the version picker.',
    },
    {
      num: 'Slide 11',
      title: 'Select Desired Firmware Version',
      text: 'In the bottom sheet modal, select the desired lock firmware version (e.g., 05.20.03). Then tap "Cancel" or proceed back to the update trigger.',
    },
  ];

  navSteps.forEach((st) => {
    const lines = doc.splitTextToSize(st.text, contentWidth - 90);
    const boxH = Math.max(isMobile ? 38 : 34, 18 + lines.length * 10.5);

    if (curY + boxH > pageHeight - (isMobile ? 36 : 46)) {
      curY = advancePage('IN-APP NAVIGATION & SELECTION');
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
  // PAGE 3: UPLOAD EXECUTION & LED FLASH BEHAVIOR (SLIDES 12 - 13)
  // =========================================================================
  curY = advancePage('FLASHING EXECUTION & LED INDICATOR');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobile ? 10 : 12);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('FIRMWARE UPLOAD & HARDWARE LED REWRITE (SLIDES 12 & 13)', margin, curY);
  curY += 14;

  // Slide 12 Card: Upload Progress
  const slide12Text = [
    '• Tap "Update" on the firmware update screen.',
    '• Stay on this screen until the progress bar reaches 100%! Do not switch apps or allow the phone to sleep.',
    '• Automated sequence executes: Getting serial number (Done) → Getting security token (Done) → Downloading firmware (Done) → Checking bluetooth availability (Done) → Looking for the lock (Done) → Uploading firmware (Progress: 0% → 100%).',
  ];
  const slide12Lines = slide12Text.map((t) => doc.splitTextToSize(t, contentWidth - 28));
  const totalS12Lines = slide12Lines.reduce((acc, a) => acc + a.length, 0);
  const card12H = 26 + totalS12Lines * 11;

  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.cyanAccent[0], colors.cyanAccent[1], colors.cyanAccent[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, curY, contentWidth, card12H, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.cyanAccent[0], colors.cyanAccent[1], colors.cyanAccent[2]);
  doc.text('SLIDE 12: WAIT FOR UPDATE TO COMPLETE', margin + 14, curY + 16);

  let pY = curY + 30;
  slide12Lines.forEach((lines) => {
    lines.forEach((l: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(isMobile ? 7 : 7.8);
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      doc.text(l, margin + 14, pY);
      pY += 11;
    });
  });

  curY += card12H + 12;

  // Slide 13 Card: Blinking Green and Red LED Behavior
  const slide13Text = [
    '• PHYSICAL LOCK CONFIRMATION: The Lock will blink Green and Red for approximately 5 - 10 minutes.',
    '• FIRMWARE AGE VARIANCE: This duration ultimately depends on how old the current firmware the lock was previously on; expect longer times if the firmware is older.',
    '• DO NOT DISRUPT: Do NOT pull batteries, force thumbturns, or cycle power while the Green and Red flashing is in progress.',
    '• COMPLETION & SYNC: Once the LED flashing stops, navigate back to the lock card in Quext Admin, tap "Sync", and confirm the lock reports the new firmware version.',
  ];
  const slide13Lines = slide13Text.map((t) => doc.splitTextToSize(t, contentWidth - 28));
  const totalS13Lines = slide13Lines.reduce((acc, a) => acc + a.length, 0);
  const card13H = 26 + totalS13Lines * 11;

  doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
  doc.setDrawColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, curY, contentWidth, card13H, 6, 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(colors.purpleMain[0], colors.purpleMain[1], colors.purpleMain[2]);
  doc.text('SLIDE 13: 5 - 10 MIN GREEN & RED BLINKING CYCLE', margin + 14, curY + 16);

  let p13Y = curY + 30;
  slide13Lines.forEach((lines) => {
    lines.forEach((l: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(isMobile ? 7 : 7.8);
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      doc.text(l, margin + 14, p13Y);
      p13Y += 11;
    });
  });

  curY += card13H + 14;

  // =========================================================================
  // PAGE 4: TROUBLESHOOTING & SUPPORT (SLIDE 14)
  // =========================================================================
  curY = advancePage('TROUBLESHOOTING & SUPPORT');

  const troubleshootingItems = [
    {
      q: 'Slide 14: What to do if... I don\'t see my invite to the app or credentials I need?',
      a: 'Contact Quext Support (support@onequext.com). They can assist with getting you back on track with login issues and missing credentials!',
    },
    {
      q: 'Troubleshooting: What if the phone screen locks during the upload?',
      a: 'The Bluetooth socket connection will be terminated by the operating system. Reopen the Quext IoT Admin app, re-select the lock profile, verify screen auto-lock is set to "Never", and restart the firmware upload from Slide 8.',
    },
    {
      q: 'Troubleshooting: What if the LED keeps blinking Green and Red past 12 minutes?',
      a: 'Locks upgrading across major revision jumps (e.g. legacy factory builds to 05.20.03) execute secondary EEPROM rewrites. Allow up to 15 minutes. If unresponsive after 20 minutes, perform physical FDR (Slide 22 / 23 of Lock Onboarding Guide) and notify support@onequext.com.',
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
    ? `Quext_Lock_Firmware_Guide_Mobile_${theme}.pdf`
    : `Quext_Lock_Firmware_Guide_${theme}.pdf`;
  doc.save(filename);
};
