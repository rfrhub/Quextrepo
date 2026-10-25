import { jsPDF } from 'jspdf';
import { WALLET_GUIDE_PAGES, WALLET_GUIDE_METADATA } from '../data/walletGuideData';

export const generateAndDownloadWalletPdf = (theme: 'dark' | 'white' = 'dark') => {
  try {
    const isDark = theme === 'dark';

    // Landscape orientation (matching presentation 16:9 / Letter format 792 x 612 pt)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 792 pt
    const pageHeight = doc.internal.pageSize.getHeight(); // 612 pt
    const margin = 40;
    const contentWidth = pageWidth - margin * 2; // 712 pt

    // Color Palette Definition (Dark Quext Theme)
    const colors = {
      pageBg: isDark ? [10, 14, 24] : [255, 255, 255],
      accentPurple: [168, 85, 247],
      brightPurple: [147, 51, 234],
      deepPurple: [91, 33, 182],
      glowPurple: isDark ? [45, 18, 77] : [243, 232, 255],
      
      headerBg: isDark ? [17, 24, 39] : [241, 245, 249],
      headerText: isDark ? [255, 255, 255] : [15, 23, 42],
      headerSub: isDark ? [148, 163, 184] : [100, 116, 139],
      
      titleText: isDark ? [255, 255, 255] : [15, 23, 42],
      subTitleText: isDark ? [216, 180, 254] : [109, 40, 217],
      descText: isDark ? [203, 213, 225] : [51, 65, 85],
      bodyText: isDark ? [226, 232, 240] : [71, 85, 105],
      mutedText: isDark ? [148, 163, 184] : [100, 116, 139],
      
      cardBg: isDark ? [18, 24, 38] : [248, 250, 252],
      cardBorder: isDark ? [40, 48, 68] : [226, 232, 240],
      cardHighlightBg: isDark ? [26, 20, 48] : [250, 245, 255],
      cardHighlightBorder: [147, 51, 234],
      
      badgeBg: isDark ? [147, 51, 234] : [147, 51, 234],
      badgeText: [255, 255, 255],
      
      warningBg: isDark ? [45, 20, 10] : [254, 243, 199],
      warningBorder: [245, 158, 11],
      warningText: isDark ? [253, 230, 138] : [146, 64, 14],
      
      successBg: isDark ? [10, 40, 25] : [236, 253, 245],
      successBorder: [16, 185, 129],
      successText: isDark ? [167, 243, 208] : [6, 95, 70],
      
      footerText: isDark ? [148, 163, 184] : [100, 116, 139],
      footerAccent: isDark ? [192, 132, 252] : [126, 34, 206]
    };

    // Helper: Draw Background and Running Header/Footer
    const drawPageChrome = (pageIdx: number, totalPages: number, pageTitle?: string) => {
      // Background Fill (Pure Dark Slate, No White Blocks)
      doc.setFillColor(colors.pageBg[0], colors.pageBg[1], colors.pageBg[2]);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Left Accent Strip (Quext Brand Violet Glow)
      doc.setFillColor(colors.brightPurple[0], colors.brightPurple[1], colors.brightPurple[2]);
      doc.rect(0, 0, 5, pageHeight, 'F');

      // Top Header: Quext Boxed Logo
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1.2);
      doc.rect(pageWidth - margin - 54, 24, 54, 22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text('quext', pageWidth - margin - 46, 39);

      // Running Bottom Footer (Official Quext Brand format)
      const formattedPageNum = pageIdx < 10 ? `0${pageIdx}` : `${pageIdx}`;
      const footerY = pageHeight - 24;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(colors.footerText[0], colors.footerText[1], colors.footerText[2]);
      doc.text('QUEXT  /  SMART COMMUNITY', margin, footerY);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.footerAccent[0], colors.footerAccent[1], colors.footerAccent[2]);
      const footerRight = `WALLET UPGRADE • FIELD INSTALLATION GUIDE • ${formattedPageNum}`;
      doc.text(footerRight, pageWidth - margin - doc.getTextWidth(footerRight), footerY);
    };

    // Helper: Draw Top Pill Badge
    const drawSectionBadge = (text: string, x: number, y: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const textWidth = doc.getTextWidth(text);
      const pillWidth = textWidth + 18;
      const pillHeight = 18;

      doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
      doc.roundedRect(x, y, pillWidth, pillHeight, 9, 9, 'F');

      doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
      doc.text(text, x + 9, y + 12);

      return y + pillHeight + 14;
    };

    // Helper: Draw Standard Card
    const drawCard = (x: number, y: number, w: number, h: number, title: string, desc: string, tag?: string) => {
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
      doc.setLineWidth(1);
      doc.roundedRect(x, y, w, h, 6, 6, 'FD');

      let curY = y + 18;
      if (tag) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text(tag.toUpperCase(), x + 12, curY);
        curY += 14;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
      doc.text(title, x + 12, curY);

      curY += 15;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
      const lines = doc.splitTextToSize(desc, w - 24);
      doc.text(lines, x + 12, curY);
    };

    // Helper: Draw Important Banner
    const drawImportantBanner = (x: number, y: number, w: number, tag: string, text: string) => {
      doc.setFillColor(colors.cardHighlightBg[0], colors.cardHighlightBg[1], colors.cardHighlightBg[2]);
      doc.setDrawColor(colors.cardHighlightBorder[0], colors.cardHighlightBorder[1], colors.cardHighlightBorder[2]);
      doc.setLineWidth(1.2);
      
      const lines = doc.splitTextToSize(text, w - 28);
      const h = 24 + lines.length * 12 + 10;
      doc.roundedRect(x, y, w, h, 6, 6, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
      doc.text(tag.toUpperCase(), x + 14, y + 16);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(lines, x + 14, y + 32);

      return y + h;
    };

    // Render Each of the 17 Pages
    WALLET_GUIDE_PAGES.forEach((pageData, index) => {
      if (index > 0) {
        doc.addPage();
      }

      drawPageChrome(pageData.pageNumber, WALLET_GUIDE_PAGES.length, pageData.title);

      // =========================================================================
      // PAGE 1: COVER HERO
      // =========================================================================
      if (pageData.visualType === 'cover_hero') {
        let y = 50;
        y = drawSectionBadge('STEP-BY-STEP GUIDE', margin, y);

        y += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Wallet Upgrade:', margin, y);
        y += 38;
        doc.text('Field Installation Guide', margin, y);

        y += 24;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
        doc.text('EXISTING ALLEGION & SCHLAGE HARDWARE', margin, y);

        y += 26;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        const descLines = doc.splitTextToSize(
          'Complete requirements, configuration, validation, synchronization, resident rollout, and troubleshooting guidance for Apple & Google Wallet mobile credentials.',
          360
        );
        doc.text(descLines, margin, y);

        // Phase Pills at Bottom
        const phases = ['PREP', 'CONFIG', 'VERIFY', 'SYNC'];
        let phaseX = margin;
        const phaseY = pageHeight - 110;
        phases.forEach((phase) => {
          doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
          doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
          doc.roundedRect(phaseX, phaseY, 76, 28, 6, 6, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(phase, phaseX + 22, phaseY + 18);
          phaseX += 88;
        });

        // Right Hero Visual Mockup: Dark Smartphone with Quext Wallet Pass
        const phoneX = pageWidth - margin - 260;
        const phoneY = 90;
        const phoneW = 240;
        const phoneH = 430;

        // Outer glow
        doc.setFillColor(25, 15, 45);
        doc.roundedRect(phoneX - 8, phoneY - 8, phoneW + 16, phoneH + 16, 28, 28, 'F');

        // Phone body
        doc.setFillColor(15, 20, 30);
        doc.setDrawColor(60, 70, 95);
        doc.setLineWidth(2);
        doc.roundedRect(phoneX, phoneY, phoneW, phoneH, 24, 24, 'FD');

        // Dynamic Island
        doc.setFillColor(5, 5, 5);
        doc.roundedRect(phoneX + phoneW / 2 - 36, phoneY + 12, 72, 14, 7, 7, 'F');

        // Digital Key Card on Screen
        const cardX = phoneX + 20;
        const cardY = phoneY + 70;
        const cardW = phoneW - 40;
        const cardH = 260;

        doc.setFillColor(35, 18, 65);
        doc.setDrawColor(168, 85, 247);
        doc.setLineWidth(1.5);
        doc.roundedRect(cardX, cardY, cardW, cardH, 14, 14, 'FD');

        // Quext Logo on Pass
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.rect(cardX + 16, cardY + 16, 42, 18);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('quext', cardX + 22, cardY + 29);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(216, 180, 254);
        doc.text('Smart Community Pass', cardX + 16, cardY + 54);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text('Unit 408 · Resident Key', cardX + 16, cardY + 80);

        // NFC contactless icon symbol
        doc.setDrawColor(168, 85, 247);
        doc.setLineWidth(2);
        doc.circle(cardX + cardW / 2, cardY + 160, 26, 'S');
        doc.circle(cardX + cardW / 2, cardY + 160, 18, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text('HOLD NEAR READER', cardX + cardW / 2 - 46, cardY + 215);

        // Express Mode pill
        doc.setFillColor(15, 23, 42);
        doc.roundedRect(cardX + 16, cardY + cardH - 30, cardW - 32, 18, 4, 4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(147, 197, 253);
        doc.text('✓ Express Mode Enabled', cardX + 36, cardY + cardH - 18);
      }

      // =========================================================================
      // PAGE 2: TECHNICAL REQUIREMENTS & COMPATIBILITY
      // =========================================================================
      else if (pageData.visualType === 'tech_requirements') {
        let y = 46;
        y = drawSectionBadge('BEFORE YOU START', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Technical requirements & compatibility', margin, y);

        // 6 Grid Cards (3 cols x 2 rows)
        const colW = (contentWidth - 28) / 3;
        const rowH = 76;
        const startGridY = y + 16;

        pageData.cards?.forEach((card, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const cx = margin + col * (colW + 14);
          const cy = startGridY + row * (rowH + 12);
          drawCard(cx, cy, colW, rowH, card.title, card.description, card.tag);
        });

        // Important Callout
        const bannerY = startGridY + 2 * (rowH + 12) + 6;
        drawImportantBanner(
          margin,
          bannerY,
          contentWidth,
          'IMPORTANT',
          'Every lock must be on supported firmware before Wallet rollout.\nAllow approximately 10 minutes per lock for firmware upgrades. Update every Allegion/Schlage lock, including RCs.'
        );

        // 5-Step Pipeline at Bottom
        const pipeY = bannerY + 70;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Installation flow', margin, pipeY);

        const flowSteps = [
          { num: '01', label: 'TEST DEVICE' },
          { num: '02', label: 'POWER CYCLE' },
          { num: '03', label: 'SCAN ≤ 60 SEC' },
          { num: '04', label: 'VERIFY NFC' },
          { num: '05', label: 'SYNC & RETEST' }
        ];

        const stepW = (contentWidth - 40) / 5;
        flowSteps.forEach((st, i) => {
          const sx = margin + i * (stepW + 10);
          const sy = pipeY + 12;

          doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
          doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
          doc.roundedRect(sx, sy, stepW, 36, 6, 6, 'FD');

          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.roundedRect(sx + 8, sy + 8, 22, 20, 4, 4, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(255, 255, 255);
          doc.text(st.num, sx + 12, sy + 22);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(st.label, sx + 36, sy + 22);
        });
      }

      // =========================================================================
      // PAGE 3: OVERVIEW: THE UPGRADE PROCESS
      // =========================================================================
      else if (pageData.visualType === 'process_flow') {
        let y = 46;
        y = drawSectionBadge('PROCESS FLOW', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Overview: The Upgrade Process', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('We are enabling the "Wallet" feature on your existing locks. No hardware replacement is required.', margin, y);

        // 4 Horizontal Process Cards
        const cardW = (contentWidth - 45) / 4;
        const cardH = 290;
        const cardY = y + 36;

        pageData.steps?.forEach((step, i) => {
          const cx = margin + i * (cardW + 15);
          doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
          doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
          doc.setLineWidth(1.2);
          doc.roundedRect(cx, cardY, cardW, cardH, 10, 10, 'FD');

          // Number Circle Top
          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.circle(cx + cardW / 2, cardY + 46, 24, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.text(step.number, cx + cardW / 2 - 7, cardY + 51);

          // Step Title
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(step.title, cx + cardW / 2 - doc.getTextWidth(step.title) / 2, cardY + 104);

          // Badge
          if (step.badge) {
            doc.setFillColor(colors.glowPurple[0], colors.glowPurple[1], colors.glowPurple[2]);
            const bw = doc.getTextWidth(step.badge) + 16;
            doc.roundedRect(cx + cardW / 2 - bw / 2, cardY + 120, bw, 18, 9, 9, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
            doc.text(step.badge, cx + cardW / 2 - doc.getTextWidth(step.badge) / 2, cardY + 132);
          }

          // Action Description
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const descLines = doc.splitTextToSize(step.action, cardW - 24);
          doc.text(descLines, cx + 12, cardY + 165);

          // Arrow Connector (except last)
          if (i < 3) {
            const arrX = cx + cardW + 3;
            const arrY = cardY + 46;
            doc.setDrawColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
            doc.setLineWidth(2);
            doc.line(arrX, arrY, arrX + 8, arrY);
          }
        });
      }

      // =========================================================================
      // PAGE 4: PREINSTALL CHECKLIST
      // =========================================================================
      else if (pageData.visualType === 'preinstall_checklist') {
        let y = 46;
        y = drawSectionBadge('PREINSTALLATION', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Preinstall Checklist', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Ensure you have these items before heading to the first unit.', margin, y);

        // 3 Large Feature Columns
        const cardW = (contentWidth - 30) / 3;
        const cardH = 320;
        const cardY = y + 36;

        pageData.cards?.forEach((card, i) => {
          const cx = margin + i * (cardW + 15);
          doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
          doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
          doc.roundedRect(cx, cardY, cardW, cardH, 10, 10, 'FD');

          // Icon Box
          doc.setFillColor(colors.cardHighlightBg[0], colors.cardHighlightBg[1], colors.cardHighlightBg[2]);
          doc.setDrawColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
          doc.roundedRect(cx + 20, cardY + 24, 60, 60, 10, 10, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
          doc.text(`0${i + 1}`, cx + 43, cardY + 59);

          // Card Title
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(card.title, cx + 20, cardY + 115);

          // Tag
          if (card.tag) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
            doc.text(card.tag, cx + 20, cardY + 132);
          }

          // Description
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const lines = doc.splitTextToSize(card.description, cardW - 40);
          doc.text(lines, cx + 20, cardY + 155);
        });
      }

      // =========================================================================
      // PAGE 5: 1. SETUP YOUR TESTING DEVICE
      // =========================================================================
      else if (pageData.visualType === 'setup_device') {
        let y = 46;
        y = drawSectionBadge('STEP 1', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('1. Setup Your Testing Device', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Ensure you have these items before heading to the first unit.', margin, y);

        // Left Content Column (Steps & Alert)
        const leftW = 380;
        let leftY = y + 24;

        leftY = drawImportantBanner(
          margin,
          leftY,
          leftW,
          'MANDATORY VALIDATION',
          'You cannot test the installation without a valid credential on your own device.'
        );

        leftY += 20;
        pageData.steps?.forEach((st) => {
          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.circle(margin + 12, leftY + 6, 10, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
          doc.text(st.number, margin + 9, leftY + 9.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(st.title, margin + 30, leftY + 9);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const descLines = doc.splitTextToSize(st.action, leftW - 34);
          doc.text(descLines, margin + 30, leftY + 23);

          leftY += 24 + descLines.length * 11;
        });

        // Right Mockup Column (Dual App Screens)
        const mockX = margin + leftW + 30;
        const mockY = y + 24;
        const phoneW = 125;
        const phoneH = 340;

        // Phone 1: Quext App Profile
        doc.setFillColor(15, 20, 30);
        doc.setDrawColor(60, 70, 95);
        doc.roundedRect(mockX, mockY, phoneW, phoneH, 16, 16, 'FD');
        doc.setFillColor(5, 5, 5);
        doc.roundedRect(mockX + phoneW / 2 - 20, mockY + 8, 40, 8, 4, 4, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text('Wallet Pass', mockX + 36, mockY + 34);

        doc.setFillColor(30, 16, 55);
        doc.roundedRect(mockX + 10, mockY + 50, phoneW - 20, 80, 8, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text('quext', mockX + 18, mockY + 70);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text('Preparing Wallet Pass...', mockX + 18, mockY + 95);

        // Phone 2: Apple Wallet Ready Screen
        const mock2X = mockX + phoneW + 20;
        doc.setFillColor(15, 20, 30);
        doc.setDrawColor(60, 70, 95);
        doc.roundedRect(mock2X, mockY, phoneW, phoneH, 16, 16, 'FD');
        doc.setFillColor(5, 5, 5);
        doc.roundedRect(mock2X + phoneW / 2 - 20, mockY + 8, 40, 8, 4, 4, 'F');

        doc.setFillColor(35, 18, 65);
        doc.roundedRect(mock2X + 10, mockY + 50, phoneW - 20, 100, 8, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text('Your Wallet Pass is ready', mock2X + 16, mockY + 115);

        // Black Add to Wallet Pill
        doc.setFillColor(0, 0, 0);
        doc.setDrawColor(255, 255, 255);
        doc.roundedRect(mock2X + 14, mockY + phoneH - 45, phoneW - 28, 24, 6, 6, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text('Add to Apple Wallet', mock2X + 26, mockY + phoneH - 30);
      }

      // =========================================================================
      // PAGE 6: 2. POWER CYCLE THE LOCK
      // =========================================================================
      else if (pageData.visualType === 'power_cycle_lock') {
        let y = 46;
        y = drawSectionBadge('STEP 2', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('2. Power Cycle The Lock', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('The lock must be rebooted to accept the new NFC configuration.', margin, y);

        const leftW = 380;
        let leftY = y + 30;

        pageData.steps?.forEach((st) => {
          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.circle(margin + 12, leftY + 6, 10, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
          doc.text(st.number, margin + 9, leftY + 9.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(st.title, margin + 30, leftY + 9);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const descLines = doc.splitTextToSize(st.action, leftW - 34);
          doc.text(descLines, margin + 30, leftY + 24);

          leftY += 28 + descLines.length * 11;
        });

        // RC Note
        leftY += 10;
        drawImportantBanner(
          margin,
          leftY,
          leftW,
          'READER CONTROLLERS (RCS)',
          'For Reader Controllers (RCs), momentarily disconnect main power or flip the breaker.'
        );

        // Right Technical Diagram: Battery Compartment
        const diagX = margin + leftW + 40;
        const diagY = y + 20;
        const diagW = 240;
        const diagH = 360;

        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
        doc.roundedRect(diagX, diagY, diagW, diagH, 12, 12, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text('BATTERY PACK REBOOT', diagX + 16, diagY + 28);

        // Lock Escutcheon Outline
        const lockX = diagX + 45;
        const lockY = diagY + 50;
        doc.setFillColor(20, 27, 42);
        doc.setDrawColor(80, 95, 125);
        doc.roundedRect(lockX, lockY, 150, 260, 20, 20, 'FD');

        // Battery Slots
        const batX = lockX + 25;
        const batY = lockY + 50;
        for (let b = 0; b < 4; b++) {
          const bx = batX + b * 26;
          doc.setFillColor(30, 41, 59);
          doc.setDrawColor(100, 116, 139);
          doc.roundedRect(bx, batY, 20, 80, 4, 4, 'FD');

          if (b === 1) {
            // Lifted Battery Arrow
            doc.setDrawColor(168, 85, 247);
            doc.setFillColor(168, 85, 247);
            doc.setLineWidth(2);
            doc.line(bx + 10, batY - 10, bx + 10, batY - 30);
            doc.triangle(bx + 5, batY - 26, bx + 15, batY - 26, bx + 10, batY - 36, 'FD');
          }
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
        doc.text('Wait 5s then reinsert', diagX + 68, diagY + 340);
      }

      // =========================================================================
      // PAGE 7: 3. SCAN CONFIGURATION CARD
      // =========================================================================
      else if (pageData.visualType === 'scan_config_card') {
        let y = 46;
        y = drawSectionBadge('STEP 3', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('3. Scan Configuration Card', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('This step activates NFC recognition on the hardware.', margin, y);

        const leftW = 380;
        let leftY = y + 24;

        leftY = drawImportantBanner(
          margin,
          leftY,
          leftW,
          'CRITICAL TIMING',
          'Perform this step within 60 seconds of reinserting the battery.'
        );

        leftY += 24;
        pageData.steps?.forEach((st) => {
          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.circle(margin + 12, leftY + 6, 10, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
          doc.text(st.number, margin + 9, leftY + 9.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(st.title, margin + 30, leftY + 9);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const descLines = doc.splitTextToSize(st.action, leftW - 34);
          doc.text(descLines, margin + 30, leftY + 24);

          leftY += 28 + descLines.length * 11;
        });

        // Right Illustration: Card Tap against Lock
        const illX = margin + leftW + 30;
        const illY = y + 20;
        const illW = 260;
        const illH = 360;

        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
        doc.roundedRect(illX, illY, illW, illH, 12, 12, 'FD');

        // 60-Second Timer Badge
        doc.setFillColor(30, 16, 55);
        doc.setDrawColor(168, 85, 247);
        doc.roundedRect(illX + illW - 85, illY + 16, 70, 26, 6, 6, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(216, 180, 254);
        doc.text('≤ 60 SEC', illX + illW - 74, illY + 33);

        // Lock Escutcheon
        const lx = illX + 40;
        const ly = illY + 60;
        doc.setFillColor(20, 27, 42);
        doc.roundedRect(lx, ly, 100, 200, 16, 16, 'FD');

        // NFC Reader Lens
        doc.setFillColor(15, 23, 42);
        doc.circle(lx + 50, ly + 50, 30, 'F');
        doc.setDrawColor(168, 85, 247);
        doc.circle(lx + 50, ly + 50, 22, 'S');

        // NFC Config Card being tapped
        const cardX = lx + 30;
        const cardY = ly + 40;
        doc.setFillColor(124, 58, 237);
        doc.setDrawColor(255, 255, 255);
        doc.roundedRect(cardX, cardY, 110, 70, 8, 8, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text('ALLEGION / QUEXT', cardX + 12, cardY + 24);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text('NFC Configuration Card', cardX + 12, cardY + 40);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
        doc.text('Hold flat until beep confirmation', illX + 38, illY + 320);
      }

      // =========================================================================
      // PAGE 8: 4. TEST FOR NFC RESPONSE
      // =========================================================================
      else if (pageData.visualType === 'test_nfc_response') {
        let y = 46;
        y = drawSectionBadge('STEP 4', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('4. Test For NFC Response', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Verify the lock creates a "handshake" with your device.', margin, y);

        const leftW = 380;
        let leftY = y + 24;

        leftY = drawImportantBanner(
          margin,
          leftY,
          leftW,
          'EXPECTED BEHAVIOR',
          'The door may not unlock yet. This is normal.\nAs long as the phone reacts and opens the pass, the NFC upgrade is complete.'
        );

        leftY += 24;
        pageData.steps?.forEach((st) => {
          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.circle(margin + 12, leftY + 6, 10, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
          doc.text(st.number, margin + 9, leftY + 9.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(st.title, margin + 30, leftY + 9);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const descLines = doc.splitTextToSize(st.action, leftW - 34);
          doc.text(descLines, margin + 30, leftY + 24);

          leftY += 28 + descLines.length * 11;
        });

        // Right Mockup: Tap Phone to Reader
        const mockX = margin + leftW + 40;
        const mockY = y + 30;
        const mockW = 240;
        const mockH = 340;

        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
        doc.roundedRect(mockX, mockY, mockW, mockH, 12, 12, 'FD');

        // Hand holding phone to lock
        doc.setFillColor(20, 27, 42);
        doc.roundedRect(mockX + 30, mockY + 40, 80, 160, 12, 12, 'FD');
        doc.circle(mockX + 70, mockY + 80, 24, 'S');

        // Phone Overlaid
        doc.setFillColor(15, 20, 30);
        doc.setDrawColor(168, 85, 247);
        doc.setLineWidth(1.5);
        doc.roundedRect(mockX + 70, mockY + 90, 130, 200, 16, 16, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text('Quext Wallet Pass', mockX + 90, mockY + 130);

        doc.setFillColor(16, 185, 129);
        doc.circle(mockX + 135, mockY + 175, 20, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('NFC', mockX + 125, mockY + 179);

        // Green Status Box
        doc.setFillColor(6, 78, 59);
        doc.roundedRect(mockX + 24, mockY + 302, mockW - 48, 22, 6, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(52, 211, 153);
        const handText = '✓ Handshake Verified';
        doc.text(handText, mockX + mockW / 2 - doc.getTextWidth(handText) / 2, mockY + 316);
      }

      // =========================================================================
      // PAGE 9: 5. SYNC TO ENABLE CREDENTIALS
      // =========================================================================
      else if (pageData.visualType === 'sync_credentials') {
        let y = 46;
        y = drawSectionBadge('STEP 5', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('5. Sync To Enable Credentials', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('For the key to open the door, the lock must download the latest access credential data.', margin, y);

        // Two Big Dual-Path Cards
        const cardW = (contentWidth - 20) / 2;
        const cardH = 220;
        const cardY = y + 24;

        pageData.cards?.forEach((card, i) => {
          const cx = margin + i * (cardW + 20);
          drawCard(cx, cardY, cardW, cardH, card.title, card.description, card.tag);
        });

        // Final Test Banner at Bottom
        const finalY = cardY + cardH + 20;
        doc.setFillColor(colors.successBg[0], colors.successBg[1], colors.successBg[2]);
        doc.setDrawColor(colors.successBorder[0], colors.successBorder[1], colors.successBorder[2]);
        doc.setLineWidth(1.5);
        doc.roundedRect(margin, finalY, contentWidth, 54, 8, 8, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(colors.successText[0], colors.successText[1], colors.successText[2]);
        doc.text('FINAL VERIFICATION TEST', margin + 18, finalY + 20);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(255, 255, 255);
        doc.text('Tap your phone again. The door should now unlock (green light & motor retracts).', margin + 18, finalY + 38);
      }

      // =========================================================================
      // PAGE 10: HANDLING RCS
      // =========================================================================
      else if (pageData.visualType === 'handling_rcs') {
        let y = 46;
        y = drawSectionBadge('PERIMETER ACCESS', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Handling Reader Controllers (RCs)', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('The process for Reader Controllers (RCs) is identical to unit locks.', margin, y);

        const leftW = 400;
        let leftY = y + 30;

        pageData.steps?.forEach((st) => {
          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.circle(margin + 12, leftY + 6, 10, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
          doc.text(st.number, margin + 9, leftY + 9.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(st.title, margin + 30, leftY + 9);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const descLines = doc.splitTextToSize(st.action, leftW - 34);
          doc.text(descLines, margin + 30, leftY + 24);

          leftY += 28 + descLines.length * 11;
        });

        // Right Mockup: Hardwired RC Reader
        const rcX = margin + leftW + 40;
        const rcY = y + 20;
        const rcW = 220;
        const rcH = 360;

        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
        doc.roundedRect(rcX, rcY, rcW, rcH, 12, 12, 'FD');

        // Slim Mullion Reader
        doc.setFillColor(15, 20, 30);
        doc.setDrawColor(60, 70, 95);
        doc.roundedRect(rcX + rcW / 2 - 30, rcY + 40, 60, 240, 16, 16, 'FD');

        // Status LED Bar
        doc.setFillColor(16, 185, 129);
        doc.roundedRect(rcX + rcW / 2 - 16, rcY + 54, 32, 6, 3, 3, 'F');

        // NFC waves symbol
        doc.setDrawColor(168, 85, 247);
        doc.circle(rcX + rcW / 2, rcY + 140, 16, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('SCHLAGE RC', rcX + rcW / 2 - 28, rcY + 260);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(colors.mutedText[0], colors.mutedText[1], colors.mutedText[2]);
        doc.text('Wiegand / RS-485 / NFC', rcX + rcW / 2 - 42, rcY + 310);
      }

      // =========================================================================
      // PAGE 11: ROLLING OUT TO RESIDENTS
      // =========================================================================
      else if (pageData.visualType === 'rolling_out_residents') {
        let y = 46;
        y = drawSectionBadge('COMMUNITY ROLLOUT', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Rolling out to Residents', margin, y);

        y += 24;
        // Big Toggle Visual (Off -> On)
        const togX = margin + 200;
        const togY = y;
        
        // OFF Toggle
        doc.setFillColor(50, 50, 60);
        doc.roundedRect(togX, togY, 70, 36, 18, 18, 'F');
        doc.setFillColor(160, 160, 170);
        doc.circle(togX + 18, togY + 18, 14, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(160, 160, 170);
        doc.text('OFF', togX + 24, togY + 50);

        // Arrow
        doc.setDrawColor(168, 85, 247);
        doc.setLineWidth(2);
        doc.line(togX + 85, togY + 18, togX + 125, togY + 18);

        // ON Toggle (Purple)
        doc.setFillColor(147, 51, 234);
        doc.roundedRect(togX + 140, togY, 70, 36, 18, 18, 'F');
        doc.setFillColor(255, 255, 255);
        doc.circle(togX + 140 + 52, togY + 18, 14, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text('ON', togX + 140 + 26, togY + 50);

        y += 80;
        y = drawImportantBanner(
          margin,
          y,
          contentWidth,
          'MANDATORY SEQUENCE REQUIREMENT',
          'Do not enable the feature for residents until all locks have been physically configured.'
        );

        y += 24;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('The Handoff:', margin, y);

        y += 20;
        pageData.steps?.forEach((st) => {
          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.circle(margin + 12, y + 4, 9, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(255, 255, 255);
          doc.text(st.number, margin + 9.5, y + 7);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(st.title, margin + 28, y + 7);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const descLines = doc.splitTextToSize(st.action, contentWidth - 34);
          doc.text(descLines, margin + 28, y + 20);

          y += 24 + descLines.length * 11;
        });
      }

      // =========================================================================
      // PAGE 12: THE RESIDENT EXPERIENCE
      // =========================================================================
      else if (pageData.visualType === 'resident_experience') {
        let y = 46;
        y = drawSectionBadge('USER JOURNEY', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('The Resident Experience', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Effortless resident onboarding with zero friction and instant tap-to-unlock access.', margin, y);

        // 4 Realistic Phone Mockups for the 4 Resident Journey Stages
        const colW = (contentWidth - 36) / 4;
        const colH = 345;
        const startY = y + 20;

        const stageBadges = ['01 · IN-APP PROMPT', '02 · PROVISIONING', '03 · ADD TO PASS', '04 · EXPRESS TAP'];

        pageData.steps?.forEach((st, i) => {
          const cx = margin + i * (colW + 12);
          
          // Card Container
          doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
          doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
          doc.setLineWidth(1.2);
          doc.roundedRect(cx, startY, colW, colH, 12, 12, 'FD');

          // Stage Badge at top
          doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
          doc.roundedRect(cx + 10, startY + 10, colW - 20, 16, 8, 8, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(216, 180, 254);
          doc.text(stageBadges[i] || `STAGE ${st.number}`, cx + colW / 2 - doc.getTextWidth(stageBadges[i] || `STAGE ${st.number}`) / 2, startY + 21);

          // Realistic iPhone Outer Titanium Chassis
          const phoneX = cx + 12;
          const phoneY = startY + 32;
          const pW = colW - 24;
          const pH = 180;

          doc.setFillColor(8, 12, 22);
          doc.setDrawColor(60, 75, 100);
          doc.setLineWidth(1.5);
          doc.roundedRect(phoneX, phoneY, pW, pH, 12, 12, 'FD');

          // Dynamic Island Notch
          doc.setFillColor(0, 0, 0);
          doc.roundedRect(phoneX + pW / 2 - 15, phoneY + 5, 30, 5, 2.5, 2.5, 'F');

          // Top Status Time
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(5.5);
          doc.setTextColor(200, 200, 210);
          doc.text('9:41', phoneX + 8, phoneY + 9);

          // Phone Screen Body by Stage
          if (i === 0) {
            // Stage 01: Quext In-App Prompt
            doc.setFillColor(14, 20, 36);
            doc.roundedRect(phoneX + 5, phoneY + 16, pW - 10, 14, 3, 3, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(168, 85, 247);
            doc.text('QUEXT', phoneX + 8, phoneY + 25);
            doc.setTextColor(255, 255, 255);
            doc.text('Home', phoneX + 32, phoneY + 25);

            // In-app prompt banner
            doc.setFillColor(55, 18, 95);
            doc.roundedRect(phoneX + 5, phoneY + 34, pW - 10, 68, 6, 6, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(255, 255, 255);
            doc.text('Your Wallet Pass is ready!', phoneX + 8, phoneY + 48);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(5);
            doc.setTextColor(216, 180, 254);
            doc.text('Add resident key to Apple Wallet', phoneX + 8, phoneY + 58);
            doc.text('for easy 1-tap door access.', phoneX + 8, phoneY + 66);

            // Black Button
            doc.setFillColor(0, 0, 0);
            doc.roundedRect(phoneX + 8, phoneY + 76, pW - 16, 16, 4, 4, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(255, 255, 255);
            doc.text('Get Started >', phoneX + pW / 2 - 14, phoneY + 87);

            // Door lock status widget below
            doc.setFillColor(16, 22, 38);
            doc.roundedRect(phoneX + 5, phoneY + 108, pW - 10, 24, 4, 4, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(255, 255, 255);
            doc.text('Front Door', phoneX + 10, phoneY + 120);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(5);
            doc.setTextColor(52, 211, 153);
            doc.text('Schlage Control · Locked', phoneX + 10, phoneY + 128);
          } else if (i === 1) {
            // Stage 02: Provisioning / Generating
            doc.setFillColor(14, 20, 36);
            doc.roundedRect(phoneX + 5, phoneY + 16, pW - 10, 14, 3, 3, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(255, 255, 255);
            doc.text('Wallet Pass Setup', phoneX + pW / 2 - 20, phoneY + 25);

            // Pass card with spinner
            doc.setFillColor(42, 14, 76);
            doc.roundedRect(phoneX + 5, phoneY + 36, pW - 10, 80, 6, 6, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(168, 85, 247);
            doc.text('quext', phoneX + 9, phoneY + 48);
            doc.setTextColor(255, 255, 255);
            doc.text('Apartment Key', phoneX + 9, phoneY + 58);

            // Circular spinner ring
            doc.setDrawColor(168, 85, 247);
            doc.setLineWidth(1.5);
            doc.circle(phoneX + pW / 2, phoneY + 80, 10, 'S');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(255, 255, 255);
            doc.text('Preparing Wallet Pass...', phoneX + pW / 2 - 25, phoneY + 102);

            // Progress bar
            doc.setFillColor(168, 85, 247);
            doc.roundedRect(phoneX + 8, phoneY + 126, (pW - 16) * 0.75, 4, 2, 2, 'F');
          } else if (i === 2) {
            // Stage 03: Add to Apple Wallet
            doc.setFillColor(14, 20, 36);
            doc.roundedRect(phoneX + 5, phoneY + 16, pW - 10, 14, 3, 3, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(255, 255, 255);
            doc.text('Your Pass is Ready', phoneX + pW / 2 - 22, phoneY + 25);

            // Ready pass card
            doc.setFillColor(48, 16, 85);
            doc.roundedRect(phoneX + 5, phoneY + 36, pW - 10, 75, 6, 6, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(168, 85, 247);
            doc.text('quext', phoneX + 9, phoneY + 50);
            doc.setTextColor(255, 255, 255);
            doc.text('Scott Miller · 408', phoneX + 9, phoneY + 62);

            // Black Add to Apple Wallet Button
            doc.setFillColor(0, 0, 0);
            doc.setDrawColor(120, 120, 130);
            doc.setLineWidth(1);
            doc.roundedRect(phoneX + 7, phoneY + 78, pW - 14, 18, 4, 4, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(255, 255, 255);
            doc.text('Add to Apple Wallet', phoneX + pW / 2 - 23, phoneY + 90);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(5);
            doc.setTextColor(216, 180, 254);
            doc.text('Express Mode is active', phoneX + pW / 2 - 23, phoneY + 125);
          } else {
            // Stage 04: Express Mode / Tap to Unlock
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5);
            doc.setTextColor(52, 211, 153);
            doc.text('NFC FIELD DETECTED', phoneX + pW / 2 - 25, phoneY + 24);

            // Active Apple Wallet Pass
            doc.setFillColor(38, 12, 70);
            doc.setDrawColor(52, 211, 153);
            doc.setLineWidth(1.2);
            doc.roundedRect(phoneX + 5, phoneY + 32, pW - 10, 85, 6, 6, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(168, 85, 247);
            doc.text('quext', phoneX + 9, phoneY + 45);
            doc.setTextColor(52, 211, 153);
            doc.text('READY', phoneX + pW - 28, phoneY + 45);

            // NFC wave rings
            doc.setDrawColor(52, 211, 153);
            doc.setLineWidth(1.2);
            doc.circle(phoneX + pW / 2, phoneY + 68, 10, 'S');
            doc.circle(phoneX + pW / 2, phoneY + 68, 6, 'S');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(255, 255, 255);
            doc.text('Hold Near Reader', phoneX + pW / 2 - 22, phoneY + 92);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(5);
            doc.setTextColor(200, 200, 210);
            doc.text('Stephanie R · Apt 408', phoneX + pW / 2 - 24, phoneY + 102);

            // Green Status Banner
            doc.setFillColor(6, 78, 59);
            doc.roundedRect(phoneX + 5, phoneY + 124, pW - 10, 14, 3, 3, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5);
            doc.setTextColor(52, 211, 153);
            doc.text('✓ Express Mode Active', phoneX + pW / 2 - 24, phoneY + 133);
          }

          // Bottom Home Bar
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(phoneX + pW / 2 - 12, phoneY + pH - 6, 24, 2, 1, 1, 'F');

          // Step Title below Phone
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
          doc.text(st.title, cx + 12, startY + 232);

          // Action Description below Phone
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const descLines = doc.splitTextToSize(st.action, colW - 24);
          doc.text(descLines, cx + 12, startY + 250);
        });
      }

      // =========================================================================
      // PAGE 13: FEATURE OVERVIEW
      // =========================================================================
      else if (pageData.visualType === 'feature_overview') {
        let y = 46;
        y = drawSectionBadge('PLATFORM CAPABILITIES', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Feature Overview', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Comprehensive capabilities unlocked by the Quext smart wallet ecosystem.', margin, y);

        // 6 Modern Feature Cards (2 cols x 3 rows)
        const colW = (contentWidth - 20) / 2;
        const rowH = 75;
        const startGridY = y + 24;

        pageData.cards?.forEach((card, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const cx = margin + col * (colW + 20);
          const cy = startGridY + row * (rowH + 14);
          drawCard(cx, cy, colW, rowH, card.title, card.description, card.tag);
        });
      }

      // =========================================================================
      // PAGE 14: FEATURE SPOTLIGHT: DEAD PHONE FRIENDLY
      // =========================================================================
      else if (pageData.visualType === 'feature_spotlight_power') {
        let y = 46;
        y = drawSectionBadge('FEATURE SPOTLIGHT', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Feature Spotlight', margin, y);

        // Hero Spotlight Card
        const spotX = margin;
        const spotY = y + 24;
        const spotW = contentWidth;
        const spotH = 380;

        doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
        doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
        doc.roundedRect(spotX, spotY, spotW, spotH, 16, 16, 'FD');

        // Left Big Text
        let leftY = spotY + 60;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Dead phone friendly', spotX + 40, leftY);

        leftY += 34;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
        doc.text('Express mode works for up to 5 hours', spotX + 40, leftY);
        leftY += 22;
        doc.text('while in power reserve.', spotX + 40, leftY);

        leftY += 40;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        const lines = doc.splitTextToSize(
          'Residents can safely enter their apartment even if their smartphone battery runs completely out during the day. Apple & Google NFC secure elements maintain reserve power specifically for access keys.',
          320
        );
        doc.text(lines, spotX + 40, leftY);

        // Right Mockup: iPhone in Power Reserve with Red Battery Icon
        const phoneX = spotX + spotW - 260;
        const phoneY = spotY + 30;
        const phoneW = 180;
        const phoneH = 320;

        doc.setFillColor(5, 5, 5);
        doc.setDrawColor(40, 50, 70);
        doc.roundedRect(phoneX, phoneY, phoneW, phoneH, 20, 20, 'FD');

        // Red Battery Icon
        const batX = phoneX + phoneW / 2 - 25;
        const batY = phoneY + 90;
        doc.setDrawColor(239, 68, 68);
        doc.setLineWidth(2);
        doc.roundedRect(batX, batY, 50, 24, 4, 4, 'S');
        doc.setFillColor(239, 68, 68);
        doc.roundedRect(batX + 50, batY + 6, 4, 12, 2, 2, 'F');
        // Red fill level (10%)
        doc.roundedRect(batX + 4, batY + 4, 8, 16, 2, 2, 'F');

        // Text on Black Screen
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(203, 213, 225);
        doc.text('Express cards and', phoneX + 48, phoneY + 220);
        doc.text('keys available', phoneX + 56, phoneY + 234);
      }

      // =========================================================================
      // PAGE 15: HARDWARE GALLERY
      // =========================================================================
      else if (pageData.visualType === 'hardware_gallery') {
        let y = 46;
        y = drawSectionBadge('HARDWARE ARCHITECTURE', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Architectural Lock Showcase', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Schlage Control Smart Deadbolt with integrated Allegion NFC credential reader.', margin, y);

        // Center Architectural Showcase Frame
        const cardX = margin;
        const cardY = y + 24;
        const cardW = contentWidth;
        const cardH = 380;

        doc.setFillColor(15, 20, 30);
        doc.setDrawColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.setLineWidth(1.5);
        doc.roundedRect(cardX, cardY, cardW, cardH, 16, 16, 'FD');

        // Lock Graphic in Center
        const lockX = cardX + cardW / 2 - 80;
        const lockY = cardY + 40;
        
        // Door Background Simulation
        doc.setFillColor(25, 30, 42);
        doc.roundedRect(lockX - 40, lockY - 10, 240, 300, 12, 12, 'F');

        // Lock Escutcheon
        doc.setFillColor(10, 12, 18);
        doc.setDrawColor(100, 116, 139);
        doc.roundedRect(lockX, lockY, 160, 240, 24, 24, 'FD');

        // Schlage Wordmark
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text('SCHLAGE', lockX + 54, lockY + 36);

        // Glowing Reader Lens
        doc.setFillColor(20, 27, 44);
        doc.setDrawColor(168, 85, 247);
        doc.circle(lockX + 80, lockY + 110, 44, 'FD');

        // Lever / Thumbturn
        doc.setFillColor(71, 85, 105);
        doc.roundedRect(lockX + 70, lockY + 180, 20, 40, 4, 4, 'F');

        // Spec Tags on Side
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(colors.subTitleText[0], colors.subTitleText[1], colors.subTitleText[2]);
        doc.text('COMMERCIAL GRADE 1 SECURITY', cardX + 40, cardY + 100);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('• Bluetooth Low Energy & NFC Dual-Stack', cardX + 40, cardY + 125);
        doc.text('• End-to-End Cryptographic Vault', cardX + 40, cardY + 145);
        doc.text('• Powered by 4 AA Batteries (18+ mo life)', cardX + 40, cardY + 165);
      }

      // =========================================================================
      // PAGE 16: TROUBLESHOOTING & TIPS
      // =========================================================================
      else if (pageData.visualType === 'troubleshooting_matrix') {
        let y = 46;
        y = drawSectionBadge('DIAGNOSTICS', margin, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(colors.titleText[0], colors.titleText[1], colors.titleText[2]);
        doc.text('Troubleshooting & Tips', margin, y);

        y += 20;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Instant solutions for common field installation and commissioning scenarios.', margin, y);

        // 3 Structured Diagnosis Cards
        const cardW = contentWidth;
        const cardH = 94;
        let cardY = y + 24;

        pageData.troubleshooting?.forEach((item) => {
          doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
          doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
          doc.roundedRect(margin, cardY, cardW, cardH, 8, 8, 'FD');

          // Issue Header (Amber / Red indicator)
          doc.setFillColor(colors.warningBg[0], colors.warningBg[1], colors.warningBg[2]);
          doc.roundedRect(margin + 14, cardY + 14, 52, 18, 4, 4, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(colors.warningText[0], colors.warningText[1], colors.warningText[2]);
          doc.text('ISSUE', margin + 26, cardY + 26);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(255, 255, 255);
          doc.text(item.issue, margin + 76, cardY + 27);

          // Fix Section
          doc.setFillColor(colors.cardHighlightBg[0], colors.cardHighlightBg[1], colors.cardHighlightBg[2]);
          doc.roundedRect(margin + 14, cardY + 42, 52, 18, 4, 4, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
          doc.text('FIX', margin + 31, cardY + 54);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
          const fixLines = doc.splitTextToSize(item.fix, cardW - 100);
          doc.text(fixLines, margin + 76, cardY + 55);

          cardY += cardH + 16;
        });
      }

      // =========================================================================
      // PAGE 17: BACK COVER & SUPPORT
      // =========================================================================
      else if (pageData.visualType === 'back_cover') {
        const coverX = margin;
        const coverY = 50;
        const coverW = contentWidth;
        const coverH = 480;

        // Radiant Back Card
        doc.setFillColor(18, 12, 36);
        doc.setDrawColor(147, 51, 234);
        doc.setLineWidth(1.5);
        doc.roundedRect(coverX, coverY, coverW, coverH, 20, 20, 'FD');

        // Large Boxed Wordmark
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(2);
        doc.rect(coverX + 60, coverY + 70, 90, 38);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text('quext', coverX + 75, coverY + 95);

        // Need Help Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(255, 255, 255);
        doc.text('Need help?', coverX + 60, coverY + 160);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(18);
        doc.setTextColor(216, 180, 254);
        doc.text('Chat with support any time', coverX + 60, coverY + 205);
        doc.text('using the Quext apps.', coverX + 60, coverY + 235);

        // Support Details Grid
        const gridY = coverY + 280;
        doc.setFillColor(25, 18, 50);
        doc.roundedRect(coverX + 60, gridY, 260, 110, 10, 10, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text('ONLINE KNOWLEDGE BASE', coverX + 80, gridY + 28);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('help.quext.io', coverX + 80, gridY + 48);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Official field documentation, wiring guides, and firmware bulletins.', coverX + 80, gridY + 70);

        // Second support card
        doc.setFillColor(25, 18, 50);
        doc.roundedRect(coverX + 340, gridY, 260, 110, 10, 10, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(colors.accentPurple[0], colors.accentPurple[1], colors.accentPurple[2]);
        doc.text('FIELD INSTALLER HOTLINE', coverX + 360, gridY + 28);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('support@onequext.com', coverX + 360, gridY + 48);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(colors.descText[0], colors.descText[1], colors.descText[2]);
        doc.text('Direct escalation queue for certified technicians and property managers.', coverX + 360, gridY + 70);
      }
    });

    // Save and Download the PDF
    const filename = `Quext_Wallet_Upgrade_Field_Installation_Guide_${theme}.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error('Failed to generate Wallet PDF guide:', err);
    throw err;
  }
};
