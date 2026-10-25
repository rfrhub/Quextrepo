import { jsPDF } from 'jspdf';

export interface ButterflyPdfOptions {
  theme?: 'white' | 'dark';
}

export const generateButterflyPdfGuide = async (options: ButterflyPdfOptions = {}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter', // 215.9 x 279.4 mm
  });

  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // --- PAGE 1: WIRING DIAGRAM (Replicating ButterflyMX with Quext RC Reader) ---
  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top header with ButterflyMX branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text('ButterflyMX', margin, 20);

  // Logo color bar simulation (ButterflyMX colors: Cyan, Pink, Orange, Yellow)
  doc.setFillColor(56, 189, 248); // Cyan
  doc.circle(margin + 50, 18, 2.2, 'F');
  doc.setFillColor(244, 63, 94);  // Pink
  doc.circle(margin + 54, 15, 2.2, 'F');
  doc.setFillColor(249, 115, 22); // Orange
  doc.circle(margin + 58, 18, 2.2, 'F');

  // Sub-header
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 25);
  doc.text('Wiring Diagram', margin, 32);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 110);
  doc.text('For the 8" and 12" Intercom · Quext RC Card Reader Integration', margin, 39);

  // Caution badge
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(pageWidth - margin - 52, 16, 52, 9, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('! Images are not to scale.', pageWidth - margin - 48, 22);

  // Diagram Box Container
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, 44, contentWidth, 178, 3, 3, 'FD');

  // --- TOP SUBSYSTEM: POWER ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 90);
  doc.text('POWER (Top Port)', margin + 30, 52);

  // Power wiring line
  doc.setDrawColor(75, 85, 99);
  doc.setLineWidth(0.8);
  doc.line(margin + 42, 55, margin + 42, 60);
  doc.line(margin + 42, 60, margin + 85, 60);

  // Demarcation Cut & Strip marks
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('Cut', margin + 70, 56);
  doc.setTextColor(75, 85, 99);
  doc.text('Strip', margin + 70, 66);
  doc.setDrawColor(220, 38, 38);
  doc.line(margin + 74, 57, margin + 74, 63);

  // 24VDC Power Supply Box
  doc.setFillColor(124, 58, 237); // Purple
  doc.roundedRect(margin + 85, 54, 28, 12, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('24VDC', margin + 92, 62);

  // Line to UPS
  doc.setDrawColor(75, 85, 99);
  doc.line(margin + 113, 60, margin + 130, 60);

  // UPS Box
  doc.setFillColor(109, 40, 217);
  doc.roundedRect(margin + 130, 53, 32, 14, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(233, 213, 255);
  doc.text('UPS: min 300W / 600VA', margin + 131, 59);
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('UPS', margin + 141, 65);

  // Line to Wall Outlet (Far right)
  doc.setDrawColor(75, 85, 99);
  doc.line(margin + 162, 60, margin + 172, 60);
  doc.line(margin + 172, 60, margin + 172, 68);

  // Wall Duplex Outlet Box (Far right x: margin + 164 to margin + 182)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(156, 163, 175);
  doc.roundedRect(margin + 164, 68, 18, 24, 2, 2, 'FD');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('110 - 240 VAC', margin + 165, 66);
  // Receptacles
  doc.rect(margin + 169, 72, 8, 7);
  doc.rect(margin + 169, 81, 8, 7);

  // --- CENTER: BUTTERFLYMX INTERCOM 8" / 12" ---
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.setDrawColor(15, 23, 42);
  doc.roundedRect(margin + 12, 75, 52, 60, 4, 4, 'FD');

  // Screen
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin + 16, 81, 44, 44, 2, 2, 'F');

  // Camera & speaker dots
  doc.setFillColor(148, 163, 184);
  doc.circle(margin + 38, 78, 1.2, 'F');
  doc.rect(margin + 32, 85, 12, 1.5, 'F');

  // ButterflyMX logo on screen
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(248, 250, 252);
  doc.text('ButterflyMX', margin + 26, 102);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('8" / 12" Video Intercom', margin + 22, 108);

  // Intercom Port Labels
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('POWER', margin + 29, 72);
  doc.text('LOCKING', margin + 66, 104);
  doc.text('INTERNET', margin + 27, 140);

  // --- LOCKING PATHS (OPTION A & OPTION B) ---
  // Option A (Blue Line) -> Schlage RC Card Reader
  doc.setDrawColor(37, 99, 235); // Royal Blue
  doc.setLineWidth(1.2);
  doc.line(margin + 64, 98, margin + 90, 98);
  doc.line(margin + 90, 98, margin + 90, 90);
  doc.line(margin + 90, 90, margin + 104, 90);

  // Option A Label (Placed above the line with clean background)
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin + 66, 82, 48, 6.5, 1, 1, 'FD');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('Option A: Schlage RC Reader*', margin + 67.5, 86.5);

  // Cable specification label
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(59, 130, 246);
  doc.text('18/2 · REX + COM', margin + 67.5, 95);

  // SCHLAGE RC CARD READER (Pill Housing + Technical Terminals)
  // Left: RC11 Mullion Reader Pill Shape
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.setDrawColor(56, 189, 248); // Sky blue border
  doc.roundedRect(margin + 104, 82, 12, 44, 6, 6, 'FD');

  // Top Status LED on RC Pill
  doc.setFillColor(34, 197, 94); // Emerald Green LED
  doc.roundedRect(margin + 106.5, 85.5, 7, 2, 1, 1, 'F');

  // Laser-etched Schlage logo on pill
  doc.setFontSize(4);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SCHLAGE', margin + 106, 118);

  // Right: Wiring Connection Card (Expanded width 46mm, x: margin + 118 to margin + 164)
  doc.setFillColor(18, 18, 24);
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(margin + 118, 82, 46, 44, 2, 2, 'FD');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SCHLAGE RC11 / RC15', margin + 120.5, 87.5);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(147, 197, 253);
  doc.text('Quext Pure IP Controller', margin + 120.5, 92);
  doc.setFontSize(4.8);
  doc.setTextColor(148, 163, 184);
  doc.text('*(Replaces 3rd-Party ACS)', margin + 120.5, 96);

  // Pin 6: Blue (REX Input)
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(margin + 120, 98, 42, 6, 1, 1, 'F');
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('• PIN 6: BLUE (REX Input)', margin + 122, 102.2);

  // Pin 2: Black (Common GND)
  doc.setFillColor(24, 24, 27);
  doc.setDrawColor(82, 82, 91);
  doc.roundedRect(margin + 120, 105.5, 42, 6, 1, 1, 'FD');
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(244, 244, 245);
  doc.text('• PIN 2: BLACK (Common GND)', margin + 122, 109.7);

  // Strike Trigger feed
  doc.setFillColor(4, 120, 87);
  doc.roundedRect(margin + 120, 113, 42, 6, 1, 1, 'F');
  doc.setFontSize(5.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(236, 253, 245);
  doc.text('• Switched Output to Strike (+12V)', margin + 122, 117.2);

  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(250, 204, 21);
  doc.text('Configure in Quext as NO REX Trigger', margin + 120.5, 123.5);

  // Link wire from RC Reader down to Shared Door Strike
  doc.setDrawColor(5, 150, 105); // Emerald Green
  doc.setLineWidth(1.0);
  doc.line(margin + 139, 126, margin + 139, 134);

  // Option B (Red Line) -> Direct Door Strike
  doc.setDrawColor(220, 38, 38); // Red
  doc.setLineWidth(1.0);
  doc.line(margin + 64, 108, margin + 74, 108);
  doc.line(margin + 74, 108, margin + 74, 143);
  doc.line(margin + 74, 143, margin + 112, 143);

  // Option B Label (Above red wire run)
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + 76, 135, 32, 5.5, 1, 1, 'FD');
  doc.setFontSize(5.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('Option B: Direct Strike', margin + 77.5, 139);

  // Diode / Varistor callout on Option B line
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin + 88, 144, 22, 7, 1, 1, 'FD');
  doc.setFontSize(4.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Diode OR Varistor**', margin + 89, 148.8);

  // SHARED ELECTRIC DOOR STRIKE BOX (Used by Both Option A & Option B)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(5, 150, 105); // Highlighted in emerald green border
  doc.roundedRect(margin + 112, 134, 52, 22, 1.5, 1.5, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('ELECTRIC DOOR STRIKE', margin + 115, 139);
  
  // Shared usage tag
  doc.setFillColor(209, 250, 229);
  doc.roundedRect(margin + 114, 140.5, 48, 4.5, 0.8, 0.8, 'F');
  doc.setFontSize(4.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(4, 120, 87);
  doc.text('★ SHARED: USED IN BOTH OPTION A & B', margin + 116, 143.8);

  doc.setFontSize(4.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('• Option A: RC switched 12VDC output', margin + 115, 148.5);
  doc.text('• Option B: Direct ButterflyMX relay trip', margin + 115, 152.5);

  // --- BOTTOM SUBSYSTEM: INTERNET ROUTING ---
  // Option A (Blue Line): routes straight down on the left at margin + 24
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1.0);
  doc.line(margin + 24, 135, margin + 24, 174);

  // Option A bubble on the FAR LEFT of the blue line (Zero overlap with red line!)
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin + 2, 150, 20, 14, 1, 1, 'FD');
  doc.setFontSize(4.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('Option A: Direct', margin + 3.5, 154.5);
  doc.text('to Router', margin + 3.5, 158.5);
  doc.setFontSize(4.2);
  doc.setTextColor(59, 130, 246);
  doc.text('300 ft Max', margin + 3.5, 162.2);

  // Pointer line from Option A bubble to blue wire
  doc.setDrawColor(37, 99, 235);
  doc.line(margin + 22, 157, margin + 24, 157);
  doc.setFontSize(5);
  doc.text('300 ft', margin + 16, 170);

  // Option B: Network Switch (Red line to the right of blue line)
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.9);
  doc.line(margin + 44, 135, margin + 44, 156);
  doc.line(margin + 44, 156, margin + 64, 156);

  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('Option B: Network Switch (250 ft)', margin + 46, 154);

  // Network Switch Box
  doc.setFillColor(124, 58, 237);
  doc.roundedRect(margin + 64, 150, 24, 12, 2, 2, 'F');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Network', margin + 68, 155);
  doc.text('Switch', margin + 70, 159.5);

  // Line from Switch down and left to Router
  doc.setDrawColor(220, 38, 38);
  doc.line(margin + 76, 162, margin + 76, 180);
  doc.line(margin + 76, 180, margin + 36, 180);
  doc.setFontSize(5.5);
  doc.text('250 ft', margin + 50, 178);

  // Internet Router Box (x: margin + 16 to margin + 36)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(100, 116, 139);
  doc.roundedRect(margin + 16, 174, 20, 12, 2, 2, 'FD');
  // Antennas
  doc.line(margin + 19, 174, margin + 19, 169);
  doc.line(margin + 33, 174, margin + 33, 169);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Router', margin + 20, 181.5);

  // --- FOOTNOTES & FIELD NOTES ---
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const note1 = 'ButterflyMX supplies one 1N400X Series diode and one MOV AdvanceD series leaded varistor per Intercom.';
  const note2 = '*Quext Integration Standard: Intercom is connected to REX (Blue wire) and Common (Black wire) of the Schlage RC Reader Controller. No external relay or third-party ACS box is required.';
  const note3 = '**A diode (DC) or varistor (AC) is required if wiring directly to door strike. See AC or DC Wiring Guides for details.';
  doc.text(note1, margin + 5, 196);
  doc.text(doc.splitTextToSize(note2, contentWidth - 10), margin + 5, 201);
  doc.text(note3, margin + 5, 212);

  // Footer bar
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Version: v1 (updated 3/25/24) · Software: v2.1', margin, 226);
  doc.text('(800) 398-4416 ext. 2 · support@butterflymx.com · butterflymx.com', margin, 230);
  doc.text('©2024 ButterflyMX, Inc. · Configured with Quext Smart Communities IoT Architecture', margin, 234);

  // Page 1 footer page number
  doc.text('Page 1 of 2 — ButterflyMX & Quext RC Reader Controller Wiring Blueprint', margin, pageHeight - 8);

  // --- PAGE 2: WIRING INFORMATION & TECHNICAL SPECIFICATIONS ---
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text('ButterflyMX', margin, 20);

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 25);
  doc.text('Wiring Information', margin, 32);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 110);
  doc.text('For the 8" and 12" Intercom · Cable Specifications & Run Distance Rules', margin, 39);

  // Table header
  let yPos = 50;
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, yPos, contentWidth, 10, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Connection Path', margin + 4, yPos + 6.5);
  doc.text('Compatible Cables', margin + 60, yPos + 6.5);
  doc.text('Max Length & Field Rules', margin + 120, yPos + 6.5);

  yPos += 10;

  // Row 1: Intercom to electric locking hardware
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPos, contentWidth, 18, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Intercom to electric locking', margin + 4, yPos + 6);
  doc.text('hardware (Option B)', margin + 4, yPos + 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('18 AWG, 2 conductors', margin + 60, yPos + 6);
  doc.text('(18/2) cable', margin + 60, yPos + 11);

  doc.text('See lock power supply for', margin + 120, yPos + 6);
  doc.text('specifications and distance.', margin + 120, yPos + 11);

  yPos += 18;

  // Row 2: Intercom to Quext RC Reader Controller (Option A)
  doc.setFillColor(239, 246, 255); // Highlighted blue row
  doc.rect(margin, yPos, contentWidth, 24, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216);
  doc.text('Intercom to Quext RC Reader', margin + 4, yPos + 6);
  doc.text('Controller (Option A - Standard)', margin + 4, yPos + 11);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Replaces 3rd-party ACS', margin + 4, yPos + 16);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('18 AWG, 2 conductors', margin + 60, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('(18/2) cable to RC harness', margin + 60, yPos + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216);
  doc.text('Terminate directly to:', margin + 120, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('• Blue Wire (Pin 6: REX Input)', margin + 120, yPos + 11);
  doc.text('• Black Wire (Pin 2: Common GND)', margin + 120, yPos + 16);
  doc.text('Instant dry contact trigger response.', margin + 120, yPos + 21);

  yPos += 24;

  // Row 3: Intercom to power outlet
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPos, contentWidth, 54, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Intercom to power outlet', margin + 4, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text("10' 24VDC / 2.08A / 50W", margin + 60, yPos + 6);
  doc.text("power supply (6' AC cord)", margin + 60, yPos + 11);

  doc.text('DC length and gauge vary based on', margin + 120, yPos + 6);
  doc.text('distance from Intercom to outlet:', margin + 120, yPos + 11);
  doc.setFont('helvetica', 'bold');
  doc.text('• 0 - 10 ft:', margin + 122, yPos + 17);
  doc.setFont('helvetica', 'normal');
  doc.text('use included adapter & always install UPS', margin + 140, yPos + 17);

  doc.setFont('helvetica', 'bold');
  doc.text('• 10 - 50 ft:  18 AWG', margin + 122, yPos + 22);
  doc.text('• 50 - 100 ft: 16 AWG', margin + 122, yPos + 27);
  doc.text('• 100 - 180 ft: 14 AWG', margin + 122, yPos + 32);
  doc.text('• 180 - 300 ft: 12 AWG', margin + 122, yPos + 37);

  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('If run length exceeds 200 ft, consider using a junction box.', margin + 120, yPos + 44);

  yPos += 54;

  // Row 4: Intercom to Internet router
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, yPos, contentWidth, 48, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Intercom to Internet router', margin + 4, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('Ethernet: CAT5e or higher', margin + 60, yPos + 6);
  doc.text('(RJ45 terminations)', margin + 60, yPos + 11);

  doc.setFont('helvetica', 'bold');
  doc.text('328 ft Max Length', margin + 120, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('• Length varies based on distance to router.', margin + 120, yPos + 12);
  doc.text('• If distance > 300 ft, switch or repeater required.', margin + 120, yPos + 17);
  doc.text('• Use shielded twisted pairs cable (STP) wherever possible.', margin + 120, yPos + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('Note: Never splice Ethernet cables. Do not use', margin + 120, yPos + 28);
  doc.text('couplers, extenders, or data jacks.', margin + 120, yPos + 33);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Wireless options available per network specs.', margin + 120, yPos + 39);

  yPos += 52;

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Field Verification Checklist Box
  yPos += 6;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, yPos, contentWidth, 28, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('QUExt FIELD COMMISSIONING CHECKLIST', margin + 4, yPos + 6);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('[ ] Verify UPS backup battery is plugged in and showing green AC power indicator.', margin + 4, yPos + 12);
  doc.text('[ ] Confirm ButterflyMX relay dry contacts terminate to Quext RC Blue (REX) and Black (Common).', margin + 4, yPos + 17);
  doc.text('[ ] Perform live test: initiate ButterflyMX video call, press Open Door, verify RC status turns green.', margin + 4, yPos + 22);

  // Footer bar
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Version: v1 (updated 3/25/24) · Software: v2.1', margin, pageHeight - 16);
  doc.text('(800) 398-4416 ext. 2 · support@butterflymx.com · butterflymx.com', margin, pageHeight - 12);
  doc.text('Page 2 of 2 — ButterflyMX Wiring Specifications & Distance Rules · Quext Field Certified', margin, pageHeight - 8);

  // Save the document
  doc.save('Quext_ButterflyMX_RC_Intercom_Wiring_Guide.pdf');
};
