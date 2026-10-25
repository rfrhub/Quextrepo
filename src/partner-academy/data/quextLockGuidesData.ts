export interface LockGuideConfig {
  id: 'befe' | 'ndeb' | 'xe360' | 'rc_reader';
  tabId: string;
  name: string;
  subtitle: string;
  deviceModels: string;
  hardwareImage: string;
  heroBadge: string;
  fdrSlideNumber: number;
  fdrTitle: string;
  fdrInstructions: string[];
  fdrProTips?: string[];
  fdrTimingRule?: string;
  fdrToneType: 'befe' | 'ndeb' | 'xe360' | 'rc_reader';
  specificNotes?: string[];
  relevantSlideIndices: number[]; // 1-indexed slide numbers
}

export const LOCK_GUIDES_CONFIGS: Record<string, LockGuideConfig> = {
  befe: {
    id: 'befe',
    tabId: 'befe_guide',
    name: 'BE/FE Field Guide',
    subtitle: 'Schlage Control Smart Deadbolt (BE467) & Interconnected Lock (FE410)',
    deviceModels: 'Schlage Control BE467 / FE410',
    hardwareImage: '/assets/aistudio/image_e90dca56.png',
    heroBadge: 'Residential Keyless Deadbolt',
    fdrSlideNumber: 20,
    fdrTitle: 'BE/FE 2-Turn Thumbturn Factory Reset',
    fdrInstructions: [
      'A. Remove one battery from lock (unscrew interior backplate to access).',
      'B. Wait 5-10 seconds for internal capacitors to discharge completely.',
      'C. Replace the battery into the compartment.',
      'D. Wait for the single power-up beep.',
      'E. Immediately turn the deadbolt thumbturn twice in rapid succession.',
      'F. Two (2) short beeps and one (1) long beep means SUCCESS!',
    ],
    fdrProTips: [
      'Do not rush battery reinsertion: waiting 10 full seconds guarantees capacitor drainage.',
      'Thumbturn rotations must be completed within 2 seconds of the single power-up beep.',
    ],
    fdrToneType: 'befe',
    specificNotes: [
      'Pre-configured and labelled by Quext for Homebase sites.',
      'Requires 1" deep strike cavity in frame to avoid motor current spikes (80mA -> 700mA).',
    ],
    relevantSlideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 24, 25, 26],
  },

  ndeb: {
    id: 'ndeb',
    tabId: 'ndeb_guide',
    name: 'NDEB Field Guide',
    subtitle: 'Schlage NDE / NDEB Wireless Commercial Cylindrical Lever Lock',
    deviceModels: 'Schlage NDEB / LE Commercial Levers',
    hardwareImage: '/src/assets/images/schlage_nde_lock_1791238029459.jpg',
    heroBadge: 'Commercial Wireless Lever',
    fdrSlideNumber: 20,
    fdrTitle: 'NDEB Pin & 3-Handle Turn Factory Default Reset (FDR)',
    fdrInstructions: [
      'A. Remove one battery from the battery tray.',
      'B. Wait 5-10 seconds for full capacitor bleed-off.',
      'C. Replace the battery into the compartment.',
      'D. Using the provided reset pin, hold down the reset button for 7 seconds until you hear the beeps.',
      'E. Turn the backside inside handle 3 times. Every time you turn the handle it will beep.',
      'F. On the third turn, you will hear: 2 beeps and one long beep — this signals SUCCESS!',
    ],
    fdrProTips: [
      'PRO TIP (Slide 20): After resetting an NDE or LE Lock, wait 30 seconds for the lock to fully power on and initialize. This has proven to assist with the onboarding process to avoid needing to repeat resetting the NDE or LE.',
      'Keep the reset pin perpendicular to avoid bending inside the housing pinhole.',
    ],
    fdrToneType: 'ndeb',
    specificNotes: [
      'Approved for interior office, common area, and unit entry cylindrical preps.',
      'Ensure 30-second post-reset wake window before attempting BLE connection.',
    ],
    relevantSlideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 24, 25, 26],
  },

  xe360: {
    id: 'xe360',
    tabId: 'xe360_guide',
    name: 'XE360 Field Guide',
    subtitle: 'Schlage XE360 Series Architectural Smart Lock (Exit Trim, Mortise & Cylindrical)',
    deviceModels: 'Schlage XE360 (Exit Trim, Mortise, Cylindrical)',
    hardwareImage: '/src/assets/images/schlage_xe360_lock_1791238043440.jpg',
    heroBadge: 'Commercial Architectural & Exit Device',
    fdrSlideNumber: 21,
    fdrTitle: 'XE360 Mode Switch & 3-Action Reset Sequence',
    fdrInstructions: [
      '1. Press and hold the mode switch for five (5) seconds. You will see 2 green lights and hear 2 beeps.',
      '2. Rotate and release the interior lever OR depress the exit crash bar three (3) times within 20 seconds of FDR sequence.',
      '3. Observe: 1 red light flash and 1 beep for each turn or depression.',
      '4. FDR in process: The lock will display a solid red light.',
      '5. FDR completes: The lock displays 1 green light and sounds 1 beep.',
      '6. Replace the electronic protective cover.',
    ],
    fdrProTips: [
      'Compatible with Falcon 25 and Von Duprin 98/99/22 exit devices (crash bars not provided by Quext).',
      'The 3 lever/crash bar presses must occur within the 20-second active window.',
    ],
    fdrToneType: 'xe360',
    specificNotes: [
      'Homebase Sites: Pre-configured and labelled by Quext; ready for site installation.',
      'Quext Sites: Installed and configured onsite by the Quext team (unless otherwise contracted).',
    ],
    relevantSlideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 24, 25, 26],
  },

  rc_reader: {
    id: 'rc_reader',
    tabId: 'rc_reader_guide',
    name: 'RC Reader Controller Field Guide',
    subtitle: 'Schlage RC11 (Mullion IP), RC15 & RCK15 (Keypad) Pure IP Reader Controllers',
    deviceModels: 'Schlage RC11, RC15, RCK15 Pure IP Reader Controllers',
    hardwareImage: '/src/assets/images/schlage_rc11_reader_1791238012335.jpg',
    heroBadge: 'Perimeter Access Pure IP Reader Controller',
    fdrSlideNumber: 22,
    fdrTitle: 'RC Network Reset & Factory Default Reset (FDR)',
    fdrInstructions: [
      'NETWORK RESET (Slide 22): Press and hold the reset button on the back of the reader for ~5 seconds until 1 green LED flash and 1 short beep, then release. Reestablishes IP connection and certificate routing.',
      'FACTORY DEFAULT RESET (Slide 23): Press and hold the reset button for ~10 seconds until two (2) green LED flashes and two (2) beeps, then release. Successful FDR is confirmed by a long steady green light and long beep.',
      '*CRITICAL FIRMWARE RULE (May 2021+): Hold the button longer than 7 seconds for the first two beeps, but release BEFORE 14 seconds! If held past 14 seconds, the FDR process is cancelled.',
      'PRO TIP (Slide 22 & 23): Locate the small reset button on the back of the reader itself using a very thin pin. Once power-on completes, continue in Quext Admin.',
      'IMPORTANT HARDWARE NOTICE (Slide 2): Reach out to Quext Support when wiring is completed — software settings may need to be changed in the cloud before the reader can be expected to work.',
    ],
    fdrProTips: [
      'Locate the small reset button on the back of the reader; you will need a very thin pin to reach it.',
      'Readers use Dry Contacts. If Wet Contacts are needed (via RB1224 relay), notify Project Manager to adjust backend configuration.',
    ],
    fdrTimingRule: 'Hold > 7 seconds for first two beeps, but RELEASE BEFORE 14 SECONDS or reset is cancelled!',
    fdrToneType: 'rc_reader',
    specificNotes: [
      'Provided pre-configured for specific locations, labelled, and ready for installation (Homebase Specific).',
      'Includes RB1224 Relay (for wet contact) and 18/4 Pigtail for door hardware wiring.',
      'CAT6 required for all readers (POE/Data) to receive power. Reader cannot supply power to anything over 12V.',
      'Hardware tie-in typically at door. IDF/Electrical room tie-ins require 18/4 wiring.',
    ],
    relevantSlideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 22, 23, 24, 25, 26],
  },
};

export interface DoorPrepCutSheet {
  id: string;
  title: string;
  templateCode: string;
  lockModel: 'BE467' | 'FE410' | 'NDEB' | 'XE360';
  lockFamilyName: string;
  doorMaterial: 'wood' | 'metal' | 'existing_holes';
  doorMaterialLabel: string;
  doorThickness: string;
  backset: string;
  faceplate: string;
  centerToCenter?: string;
  crossBoreDiameter: string;
  edgeBoreDiameter: string;
  dpsPrep?: string;
  keyFieldNotes: string[];
  pdfPath: string;
  previewImages: string[];
  description: string;
}

export const DOOR_PREP_CUT_SHEETS: DoorPrepCutSheet[] = [
  // 1. BE467F Wood Door Template (RB117)
  {
    id: 'be467_wood_rb117',
    title: 'Schlage Control BE467F Wood Door Prep Template',
    templateCode: 'RB117',
    lockModel: 'BE467',
    lockFamilyName: 'Schlage Control™ Smart Deadbolt (BE467 / BE467F)',
    doorMaterial: 'wood',
    doorMaterialLabel: 'Wood or Composite, Flat or Beveled',
    doorThickness: '1⅜" (35 mm) – 1¾" (44 mm); up to 2¼" (57 mm) with thick door kit',
    backset: '2⅜" (60 mm) or 2¾" (70 mm) standard',
    faceplate: 'Round Corner, ¼" (6 mm) Radius, 1" (25 mm) wide x 2¼" (57 mm) high',
    crossBoreDiameter: '2⅛" (54 mm) Diameter Hole',
    edgeBoreDiameter: '1" (25 mm) Diameter Latch Hole',
    keyFieldNotes: [
      '⅛" (4 mm) pilot holes in two places (1⅝" / 41 mm apart) on door edge',
      'Bevel ⅛" in 2" (3 mm in 51 mm) on edge of door',
      '5/32" (4 mm) edge setback to centerline of bolt',
      'Thick door kit available from Allegion Product Support for doors >1¾" up to 2¼"',
    ],
    pdfPath: '/assets/aistudio/Unit_Locks_Schlage-Control-BE467F-door-prep-template-RB117__1__c1095ea0.pdf',
    previewImages: ['/assets/aistudio/door_prep_templates/be467_wood_rb117_1.png'],
    description: 'Standard residential deadbolt door prep template with round corner faceplate, 2⅛" cross bore, and 2⅜" or 2¾" backset for wood doors.',
  },

  // 2. FE410F Wood Door Template (RF123)
  {
    id: 'fe410_wood_rf123',
    title: 'Schlage Control FE410F Wood Door Prep Template',
    templateCode: 'RF123',
    lockModel: 'FE410',
    lockFamilyName: 'Schlage Control™ Smart Interconnected Lock (FE410 / FE410F)',
    doorMaterial: 'wood',
    doorMaterialLabel: 'Wood or Composite, Flat or Beveled',
    doorThickness: '1⅝" (41 mm) – 1¾" (44 mm)',
    backset: '2⅜" (60 mm), 2¾" (70 mm) standard',
    faceplate: 'Round Corner, ¼" (6 mm) Radius, 1" (25 mm) wide x 2¼" (57 mm) high',
    centerToCenter: '4.000" (102 mm) OR 5.500" (140 mm) center-to-center',
    crossBoreDiameter: 'Two 2⅛" (54 mm) Diameter Holes',
    edgeBoreDiameter: 'Two 1" (25 mm) Diameter Holes (Latch & Deadbolt)',
    keyFieldNotes: [
      'CRITICAL: Specify either 4.0" or 5.5" center-to-center hole spacing when ordering and drilling',
      '⅛" (4 mm) pilot holes in four places (two per faceplate)',
      'Simultaneous egress mechanism mechanically interconnects deadbolt and latch lever',
      'Bevel ⅛" in 2" (3 in 51) with 5/32" (4 mm) setback',
    ],
    pdfPath: '/assets/aistudio/Wood_Door_Schlage-FE410-Control-Smart-Interconnected-Lock-Door-Prep-Template-RF123-1__1__bbd4a113.pdf',
    previewImages: ['/assets/aistudio/door_prep_templates/fe410_wood_rf123_1.png'],
    description: 'Interconnected wood door template for deadbolt and lever latch with round corner mortise and selectable 4.0" or 5.5" center-to-center spacing.',
  },

  // 3. FE410F Metal Door Template (RF124)
  {
    id: 'fe410_metal_rf124',
    title: 'Schlage Control FE410F Metal Door Prep Template',
    templateCode: 'RF124',
    lockModel: 'FE410',
    lockFamilyName: 'Schlage Control™ Smart Interconnected Lock (FE410 / FE410F)',
    doorMaterial: 'metal',
    doorMaterialLabel: 'Hollow Metal, Flat or Beveled',
    doorThickness: '1⅝" (41 mm) – 1¾" (44 mm)',
    backset: '2⅜" (60 mm), 2¾" (70 mm) standard',
    faceplate: 'Square Corner, 1.000" (25 mm) wide x 2.250" (57 mm) high',
    centerToCenter: '4.000" (102 mm) OR 5.500" (140 mm) center-to-center',
    crossBoreDiameter: 'Two 2.125" (54 mm) Diameter Holes (+.015 / -.000)',
    edgeBoreDiameter: 'Two 1.000" (25 mm) Holes (+.015 / -.000)',
    keyFieldNotes: [
      'Drill and tap for #8-32 F.H.M.S (M4) in four places (1.625" ± .005 spacing)',
      'Notches for anchors .156" (4 mm) deep on both sides of hole on outside face of door',
      'REINFORCEMENT: For metal door installations, suitable reinforcement is required to support latch in center of door and prevent lateral movement',
      'Must specify 4.0" or 5.5" center-to-center spacing',
    ],
    pdfPath: '/assets/aistudio/Metal_Door_Schlage-FE410-Control-Smart-Interconnected-Lock-Door-Prep-Template-RF124-1__1__413ec5ae.pdf',
    previewImages: ['/assets/aistudio/door_prep_templates/fe410_metal_rf124_1.png'],
    description: 'Hollow metal door preparation template with square corner faceplate, #8-32 machine screw tapping, and exterior anchor notch cutouts.',
  },

  // 4. FE410F Existing Holes Retrofit Guide
  {
    id: 'fe410_existing_holes',
    title: 'Schlage Control FE410F Door Prep for Existing Holes',
    templateCode: 'FE410F-RETRO',
    lockModel: 'FE410',
    lockFamilyName: 'Schlage Control™ Smart Interconnected Lock (FE410 / FE410F)',
    doorMaterial: 'existing_holes',
    doorMaterialLabel: 'Doors with Existing Holes (Wood or Metal Retrofit)',
    doorThickness: '1⅜" (35 mm) – 1¾" (44 mm); thick door kit available for doors up to 2¼"',
    backset: 'Must be 2⅜" or 2¾" (lock will not fit if other backset)',
    faceplate: 'Standard Latch & Bolt Strikes with Jamb Reinforcement Plate',
    centerToCenter: 'The two holes must be either 4" or 5½" apart (if not, lock will not fit)',
    crossBoreDiameter: '2⅛" (54 mm) face holes (enlarge with 2⅛" hole saw if smaller)',
    edgeBoreDiameter: '1" (25 mm) edge holes (enlarge with 1" drill bit or hole saw if smaller)',
    keyFieldNotes: [
      'Step 1: Measure door thickness (1⅜" - 1¾"); thick door kit available from Product Support at 800-847-1864',
      'Step 2: Measure backset (must be 2⅜" or 2¾")',
      'Step 3: Measure distance between the two holes (must be either 4" or 5½" apart)',
      'Step 4: Measure hole sizes (2⅛" and 1"). If smaller, enlarge using 2⅛" hole saw and 1" edge bit',
      'Step 5: Check door jamb: Place latch strike, bolt strike, and reinforcement plate against jamb; trace and mortise with chisel if correction needed',
    ],
    pdfPath: '/assets/aistudio/Schlage_Control_Interconnect_FE410F_DoorTemplate_ExistingHoles__1__bde381eb.pdf',
    previewImages: [
      '/assets/aistudio/door_prep_templates/fe410_existing_holes_1.png',
      '/assets/aistudio/door_prep_templates/fe410_existing_holes_2.png',
    ],
    description: '5-step installer retrofit checklist for existing doors. Verifies door thickness, backset, center-to-center spacing, hole enlargement, and jamb strike alignment.',
  },

  // 5. NDEB Wood Door Template (NDEB1)
  {
    id: 'ndeb_wood_ndeb1',
    title: 'Schlage NDEB Wireless Lock Wood Door Prep Template',
    templateCode: 'NDEB1',
    lockModel: 'NDEB',
    lockFamilyName: 'Schlage NDEB Commercial Wireless Cylindrical Lock',
    doorMaterial: 'wood',
    doorMaterialLabel: 'Wood or Composite, Flat',
    doorThickness: '1¾" (44 mm) Door',
    backset: '2¾" (70 mm) standard',
    faceplate: 'Square Corner, 1⅛" (29 mm) wide x 2¼" (57 mm) high',
    crossBoreDiameter: '2⅛" (54 mm) Diameter Hole',
    edgeBoreDiameter: '1" (25 mm) Hole with two ⅛" (3 mm) pilot holes',
    dpsPrep: '¾" (19 mm) hole at 3⅞" (98 mm) below centerline',
    keyFieldNotes: [
      'CRITICAL NOTE A: Drill ¾" (19 mm) hole only halfway through door thickness from inside face. Do NOT drill through outside face of door!',
      'Two 5/16" (8 mm) through-bolt mounting holes located 1⅜" (35 mm) above and below centerline',
      'Standard 4⅞" (124 mm) ANSI/ASA strike prep with #12-24 WMS (M6) mounting screws',
      'Edge hole: 1" (25 mm) diameter with two ⅛" (3 mm) pilot holes',
    ],
    pdfPath: '/assets/aistudio/NDE_Cut_Sheet___1__96bb32ea.pdf',
    previewImages: ['/assets/aistudio/door_prep_templates/ndeb_cutsheet_1.png'],
    description: 'Commercial wireless cylindrical lock template for wood doors. Features through-bolt mounting holes and interior-only half-depth wire harness routing hole.',
  },

  // 6. NDEB Metal Door Template (NDEB2)
  {
    id: 'ndeb_metal_ndeb2',
    title: 'Schlage NDEB Wireless Lock Metal Door Prep Template',
    templateCode: 'NDEB2',
    lockModel: 'NDEB',
    lockFamilyName: 'Schlage NDEB Commercial Wireless Cylindrical Lock',
    doorMaterial: 'metal',
    doorMaterialLabel: 'Hollow Metal Door',
    doorThickness: '1¾" (44 mm) Door',
    backset: '2¾" (70 mm) standard',
    faceplate: 'Square Corner, 1⅛" (29 mm) wide x 2¼" (57 mm) high',
    crossBoreDiameter: '2⅛" (54 mm) Diameter Hole',
    edgeBoreDiameter: '1" (25 mm) Hole with two ⅛" (3 mm) pilot holes',
    dpsPrep: '¾" (19 mm) hole at 3⅞" (98 mm) & 5" (127 mm) below centerline',
    keyFieldNotes: [
      'CRITICAL NOTE A: Do NOT drill through outside face of door for wire harness/DPS hole!',
      'Two 5/16" (8 mm) through-bolt holes (1⅜" above and below centerline)',
      'Standard 4⅞" (124 mm) ASA strike with #12-24 WMS (M6) tapped holes',
      'Supports cylindrical chassis with internal motor and antenna cable feed',
    ],
    pdfPath: '/assets/aistudio/NDE_Cut_Sheet___1__96bb32ea.pdf',
    previewImages: ['/assets/aistudio/door_prep_templates/ndeb_cutsheet_2.png'],
    description: 'Hollow metal door preparation template for NDEB wireless locks with through-bolt chassis cutouts and ASA strike frame dimensions.',
  },

  // 7. XE360-T Wood Door Template (XE101)
  {
    id: 'xe360_wood_xe101',
    title: 'Schlage XE360-T Series Wood Door Prep Template',
    templateCode: 'XE101',
    lockModel: 'XE360',
    lockFamilyName: 'Schlage XE360-Series (XE360-T Cylindrical / Mortise / Exit Trim)',
    doorMaterial: 'wood',
    doorMaterialLabel: 'Wood or Composite, Flat or Beveled',
    doorThickness: '1¾" (44 mm)',
    backset: '2¾" (70 mm) bold standard, 2⅜" (60 mm)',
    faceplate: 'Square Corner, 1" (25 mm) wide x 2¼" (57 mm) high',
    crossBoreDiameter: '2⅛" (54 mm) Diameter Hole',
    edgeBoreDiameter: '1" (25 mm) Hole with two ⅛" (3 mm) pilot holes',
    dpsPrep: '¾" (19 mm) DPS hole on door edge, ½" (13 mm) DPS hole interior only',
    keyFieldNotes: [
      'DPS ONLY: Prepare ¾" (19 mm) hole in jamb directly opposite hole in door edge',
      'Two ⅜" (8 mm) mounting holes at 1⅛" (29 mm) spacing, 2-13/32" (61 mm) below centerline',
      'Connect ⅜" (8 mm) DPS holes halfway through door (interior ONLY)',
      'Bevel ⅛" in 2" (3 in 51) with 5/32" (4 mm) setback; overall template span 6¾" (171 mm)',
    ],
    pdfPath: '/assets/aistudio/Wood_Door_Schlage_XE360-Series_Template_XE101_115873_98f53e11.pdf',
    previewImages: ['/assets/aistudio/door_prep_templates/xe360_wood_xe101_1.png'],
    description: 'Official Allegion template XE101 for XE360-T series wood doors with integrated DPS door position sensor routing and mounting holes.',
  },

  // 8. XE360-T Metal Door Template (XE102)
  {
    id: 'xe360_metal_xe102',
    title: 'Schlage XE360-T Series Metal Door Prep Template',
    templateCode: 'XE102',
    lockModel: 'XE360',
    lockFamilyName: 'Schlage XE360-Series (XE360-T Cylindrical / Mortise / Exit Trim)',
    doorMaterial: 'metal',
    doorMaterialLabel: 'Metal, Flat or Beveled',
    doorThickness: '1¾" (44 mm)',
    backset: '2¾" (70 mm) bold standard, 2⅜" (60 mm)',
    faceplate: 'Square Corner, 1.000" (25 mm) wide x 2.250" (57 mm) high',
    crossBoreDiameter: '2.125" (54 mm) Diameter Hole',
    edgeBoreDiameter: '1.000" (25 mm) Hole with two .125" (3 mm) pilot holes',
    dpsPrep: '.750" (19 mm) DPS hole on door edge, .500" (13 mm) DPS hole interior only',
    keyFieldNotes: [
      'DPS ONLY: Prepare .750" (19 mm) hole in jamb directly opposite hole in door edge',
      'Two .375" (8 mm) mounting holes at 1.125" (29 mm) spacing, 2.406" (61 mm) below centerline',
      '.375" (8 mm) DPS connect holes, .500" (13 mm) halfway through door (interior ONLY)',
      'Bevel .125" in 2" (3 in 51), .156" (4 mm) ± .005 setback; overall template span 6.75" (171 mm)',
    ],
    pdfPath: '/assets/aistudio/Metal_door_Schlage_XE360-Series_Template_XE102_115874_984fd25a.pdf',
    previewImages: [
      '/assets/aistudio/door_prep_templates/xe360_metal_xe102_1.png',
      '/assets/aistudio/door_prep_templates/xe360_cutsheet_1.png',
    ],
    description: 'Allegion factory template XE102 for hollow metal doors with precise .005" tolerances, DPS sensor wire channels, and machine screw pilot holes.',
  },
];

export interface HardwareDataSheet {
  id: string;
  title: string;
  docCode: string;
  lockModel: 'BE467' | 'FE410' | 'NDEB' | 'XE360' | 'RC Reader';
  lockFamilyName: string;
  pdfPath: string;
  previewImages: string[];
  pageCount: number;
  grade: string;
  credentials: string;
  batteryLife?: string;
  power?: string;
  highlights: string[];
  description: string;
}

export const HARDWARE_DATA_SHEETS: HardwareDataSheet[] = [
  // 1. Schlage XE360 Wireless Mortise Lock Data Sheet
  {
    id: 'xe360_mortise_datasheet',
    title: 'Schlage XE360™ Series Wireless Mortise Lock Data Sheet',
    docCode: '015589 (Rev. 04/25)',
    lockModel: 'XE360',
    lockFamilyName: 'Schlage XE360™ Series Wireless Mortise Lock',
    pdfPath: '/assets/aistudio/Schlage_XE360_Mortise_Data_Sheet_115589__1___1__97556e59.pdf',
    previewImages: [
      '/assets/aistudio/data_sheet_previews/xe360_mortise_datasheet_1.png',
      '/assets/aistudio/data_sheet_previews/xe360_mortise_datasheet_2.png',
      '/assets/aistudio/data_sheet_previews/xe360_mortise_datasheet_3.png',
      '/assets/aistudio/data_sheet_previews/xe360_mortise_datasheet_4.png',
    ],
    pageCount: 4,
    grade: 'ANSI/BHMA A156.13-2022 Grade 1 Mortise / UL 10C 3-Hour',
    credentials: '2,000 Credentials / 2,000 Audits',
    batteryLife: 'Up to 2 years (4 AA batteries included)',
    highlights: [
      'Heavy-duty Grade 1 mortise chassis with ¾" stainless steel latchbolt and 1" deadbolt',
      'FleX Module™ allows future upgrades for communication protocol, memory, and encryption',
      'Concealed key override cylinder in bottom edge preserves clean architectural aesthetics',
      'Smart (13.56MHz), BLE 5, and NFC mobile in Apple Wallet® and Google Wallet™',
      'Available with LED Indicator (Storeroom), Interior Button (Office/Privacy/Apartment), or Deadbolt',
    ],
    description: 'Comprehensive 4-page technical specification sheet for XE360 wireless mortise locks. Includes ANSI Grade 1 mechanical ratings, credential support, dimensional drawings, and complete ordering configuration matrix.',
  },

  // 2. Schlage Control FE410F Grade 2 Interconnected Lock Data Sheet
  {
    id: 'fe410_datasheet',
    title: 'Schlage Control™ FE410F Interconnected Lock Data Sheet',
    docCode: 'MF-6049 (Rev. 12/16)',
    lockModel: 'FE410',
    lockFamilyName: 'Schlage Control™ Smart Interconnected Locks (FE410F)',
    pdfPath: '/assets/aistudio/Schlage_FE410F_Data_sheet_86602217.pdf',
    previewImages: [
      '/assets/aistudio/data_sheet_previews/fe410_datasheet_1.png',
      '/assets/aistudio/data_sheet_previews/fe410_datasheet_2.png',
    ],
    pageCount: 2,
    grade: 'ANSI/BHMA A156.12 Grade 2 / 90-min UL Listed',
    credentials: 'Up to 500 users / 1,000 audit events',
    batteryLife: '2-year battery life (Off-Line Mode); 9V battery jump-start terminals',
    highlights: [
      'No-cylinder design makes lock 100% pick and bump proof',
      'Single-motion simultaneous egress retracts latch and deadbolt together for code compliance',
      'Available in Addison and Greenwich escutcheon styles with 14 decorative lever designs',
      '4.0" or 5.5" center-to-center door prep spacing (fits standard preps)',
      'Adjustable backset 2⅜" to 2¾"; door thickness 1⅜" to 1¾" (thick door kit up to 2")',
    ],
    description: 'Official 2-page cut sheet and specification manual for FE410F interconnected locks. Details single-motion egress, battery jump-start port, finish options, and lever styling for multi-family residential doors.',
  },

  // 3. Schlage XE360 Series Wireless Exit Trim Data Sheet
  {
    id: 'xe360_exit_trim_datasheet',
    title: 'Schlage XE360™ Series Wireless Exit Trim Data Sheet',
    docCode: '015590 (Rev. 03/23)',
    lockModel: 'XE360',
    lockFamilyName: 'Schlage XE360™ Series Wireless Exit Trim',
    pdfPath: '/assets/aistudio/Schlage_XE360_Exit_Trim_Data_Sheet_115590_70cfd960.pdf',
    previewImages: [
      '/assets/aistudio/data_sheet_previews/xe360_exit_datasheet_1.png',
      '/assets/aistudio/data_sheet_previews/xe360_exit_datasheet_2.png',
      '/assets/aistudio/data_sheet_previews/xe360_exit_datasheet_3.png',
      '/assets/aistudio/data_sheet_previews/xe360_exit_datasheet_4.png',
    ],
    pageCount: 4,
    grade: 'ANSI/BHMA A156.3-2014 Grade 1 Exit Device',
    credentials: '2,000 Credentials / 2,000 Audits',
    batteryLife: 'Up to 2 years (4 AA batteries included)',
    highlights: [
      'Compatible with Falcon 25 (Rim & SVR), Von Duprin 98/99 (Rim & SVR), and Von Duprin 22 (Rim & SVR)',
      'Modular adapter allows simple transition to a wide variety of commercial exit crash bars',
      'Supports both Low Current (RX-LC) and Normal (RX) request-to-exit switches',
      'Concealed key override standard with conventional 6-pin cylinder',
      'Interior finish of exit trim always 622 Matte Black to blend with crash bar hardware',
    ],
    description: 'Technical 4-page data sheet for XE360 wireless exit trim devices. Covers crash bar adapters for Falcon and Von Duprin, wide stile compatibility, and dimensional escutcheon specs.',
  },

  // 4. Schlage XE360 Series Wireless Tubular Lock Data Sheet
  {
    id: 'xe360_tubular_datasheet',
    title: 'Schlage XE360™ Series Wireless Tubular Lock Data Sheet',
    docCode: '015588 (Rev. 03/23)',
    lockModel: 'XE360',
    lockFamilyName: 'Schlage XE360™ Series Wireless Tubular Lock',
    pdfPath: '/assets/aistudio/Schlage_XE360_Tubular_Data_Sheet_115588_63f45a50.pdf',
    previewImages: [
      '/assets/aistudio/data_sheet_previews/xe360_tubular_datasheet_1.png',
      '/assets/aistudio/data_sheet_previews/xe360_tubular_datasheet_2.png',
      '/assets/aistudio/data_sheet_previews/xe360_tubular_datasheet_3.png',
      '/assets/aistudio/data_sheet_previews/xe360_tubular_datasheet_4.png',
    ],
    pageCount: 4,
    grade: 'ANSI/BHMA A156.2-2017 Grade 2 Cylindrical / Grade 1 tested',
    credentials: '2,000 Credentials / 2,000 Audits',
    batteryLife: 'Up to 2 years (4 AA batteries included)',
    highlights: [
      'Cylindrical tubular chassis with field adjustable backset: 2¾" standard or 2⅜"',
      'Weather resistant outdoor type rating (-31°F to 151°F exterior operation)',
      'Integrated FleX Module™ for future wireless protocol and encryption upgrades',
      'Functions: Indicator (Storeroom), Button (Office, Privacy, Apartment)',
      'Broadway, Latitude, and Neptune levers in 619 Satin Nickel, 622 Matte Black, 626 Satin Chrome',
    ],
    description: 'Full 4-page product specification for XE360 wireless tubular locks. Details cylindrical latchbolt options, 2,000-user capacity, wireless configuration via ENGAGE app, and lever dimensions.',
  },

  // 5. Schlage RC Multi-Technology IP Reader Controller Data Sheet
  {
    id: 'rc_reader_datasheet',
    title: 'Schlage® RC Multi-Technology IP Reader Controller Data Sheet',
    docCode: '013614 (Rev. 01/21)',
    lockModel: 'RC Reader',
    lockFamilyName: 'Schlage® RC Reader Controller (RC11, RC15, RCK15)',
    pdfPath: '/assets/aistudio/Schlage_RC_Reader_Controller_Datasheet_113614_c60c1c57.pdf',
    previewImages: [
      '/assets/aistudio/data_sheet_previews/rc_datasheet_1.png',
      '/assets/aistudio/data_sheet_previews/rc_datasheet_2.png',
    ],
    pageCount: 2,
    grade: 'UL 294 / IP65 Weatherproof / FCC / CE',
    credentials: '64,000 Credentials / 5,000 Events / 32 Schedules',
    power: 'PoE IEEE 802.3af Class 0 or 10-13 VDC (120mA avg)',
    highlights: [
      'Patented Pure IP™ technology integrates reader and controller directly at the door edge',
      'Three form factors: RC11 Mullion, RC15 Single Gang, RCK15 Single Gang with Keypad',
      'Simultaneous 125 kHz proximity, 13.56 MHz smart, and 2.4 GHz Bluetooth processing',
      'Three configurable onboard inputs: Door Position (DPS), Request to Exit (REX), and Auxiliary (AUX)',
      'Real-time connectivity with local mode operation during network disconnects',
    ],
    description: 'Engineering data sheet for Schlage RC Pure IP reader controllers. Outlines PoE power requirements, onboard dry contact relays, 64,000 credential memory, and multi-tech RFID/BLE antenna ranges.',
  },

  // 6. Schlage Control Mobile Enabled Smart Lock (BE467F & FE410F) Data Sheet
  {
    id: 'be_control_datasheet',
    title: 'Schlage Control™ Mobile Enabled Smart Lock Data Sheet',
    docCode: '013252 (Rev. 07/19)',
    lockModel: 'BE467',
    lockFamilyName: 'Schlage Control™ Smart Deadbolt (BE467F) & Interconnected (FE410F)',
    pdfPath: '/assets/aistudio/Schlage_BE_Data_Sheet_c90b7d98.pdf',
    previewImages: [
      '/assets/aistudio/data_sheet_previews/be_datasheet_1.png',
      '/assets/aistudio/data_sheet_previews/be_datasheet_2.png',
      '/assets/aistudio/data_sheet_previews/be_datasheet_3.png',
      '/assets/aistudio/data_sheet_previews/be_datasheet_4.png',
    ],
    pageCount: 4,
    grade: 'BE467F: ANSI/BHMA Grade 2 Deadbolt / FE410F: Grade 2 Interconnected',
    credentials: '500 users / 1,000 audits',
    batteryLife: 'Up to 1½ years (offline) / up to 1 year (BLE enabled); 4 AA batteries',
    highlights: [
      'Cylinder-less design eliminates key management, lock picking, and rekeying costs',
      'Addison and Greenwich escutcheon dimensional drawings for both BE467F and FE410F',
      'BLE mobile credentials built in; compatible with ENGAGE™ Gateway or No-Tour operation',
      'Adjustable backset 2⅜" to 2¾"; 1" standard throw deadbolt',
      'Finishes: 619 Satin Nickel, 622 Matte Black, 625 Bright Chrome, 626 Satin Chrome, 716 Aged Bronze',
    ],
    description: '4-page master architectural data sheet for Schlage Control smart locks. Features detailed exterior and interior dimensional blueprints, escutcheon sizing (3" × 5¼"), and lever pairing guides.',
  },

  // 7. Schlage NDE Wireless Cylindrical Lock with ENGAGE™ Data Sheet
  {
    id: 'nde_datasheet',
    title: 'Schlage® NDE Wireless Cylindrical Lock Data Sheet',
    docCode: '010409 (Rev. 12/17)',
    lockModel: 'NDEB',
    lockFamilyName: 'Schlage® NDE Wireless Cylindrical Lock (NDEB)',
    pdfPath: '/assets/aistudio/Schlage_NDE_Staff_Lock_Data_Sheet_78e25db7.pdf',
    previewImages: [
      '/assets/aistudio/data_sheet_previews/nde_datasheet_1.png',
      '/assets/aistudio/data_sheet_previews/nde_datasheet_2.png',
      '/assets/aistudio/data_sheet_previews/nde_datasheet_3.png',
      '/assets/aistudio/data_sheet_previews/nde_datasheet_4.png',
    ],
    pageCount: 4,
    grade: 'ANSI/BHMA A156.2-2011 Grade 1 Cylindrical / UL 10C 3-Hour Fire Rated',
    credentials: 'Up to 5,000 users / Up to 2,000 audit events',
    batteryLife: 'Up to 2 years with 4 AA batteries',
    highlights: [
      'Combines lock, reader, DPS door sensor, and REX switch in one standard ND cylindrical prep',
      'Built-in Wi-Fi® enables automatic daily updates sent directly from host software',
      'Built-in Bluetooth® enables wireless configuration from smartphones and tablets',
      'Storeroom function with Vandlgard® clutching lever prevents damage from forced entry',
      'Field reversible handing in seconds without tools; Everest 29 S123 keyway standard',
    ],
    description: 'Official 4-page commercial data sheet for NDE wireless cylindrical locks. Covers mechanical cylindrical specs, Wi-Fi connectivity, Vandlgard® clutching lever options, and interchangeable core compatibility.',
  },
];

// Unified catalog uniting Door Prep Cut Sheets and Hardware Data Sheets
export type DocumentCategory = 'all' | 'door_prep' | 'data_sheet';

// Backward-compatible alias for existing imports
export const SPEC_SHEET_LINKS = [
  ...DOOR_PREP_CUT_SHEETS.map((item) => ({
    title: item.title,
    category: 'door_prep' as const,
    filename: item.pdfPath.split('/').pop() || '',
    description: item.description,
    applicableModels: item.lockModel,
  })),
  ...HARDWARE_DATA_SHEETS.map((item) => ({
    title: item.title,
    category: 'data_sheet' as const,
    filename: item.pdfPath.split('/').pop() || '',
    description: item.description,
    applicableModels: item.lockModel,
  })),
];

export const INSTALLATION_INFO_NEED_TO_KNOWS = {
  shippingTimeline: {
    homebaseOnboarding: '1–2 weeks for onboarding into Homebase platform',
    shippingWindow: '2–6 weeks for hardware shipping (hardware dependent)',
  },
  cardReaders: [
    'Provided pre-configured for specific locations, labelled, and ready for installation (Homebase Specific).',
    'Includes RB1224 Relay (for wet contact) and 18/4 Pigtail for door hardware wiring.',
    'Connectivity: CAT6 required for all readers (POE/Data) to receive power. The card reader cannot supply power to anything over 12V.',
    'Wiring Path: Hardware tie-in typically at door. IDF/Electrical room tie-ins require 18/4 wiring.',
    'Important: Readers use Dry Contacts. If Wet Contacts are needed (via RB1224), notify the Project Manager to adjust backend configuration.',
    'Reach out to support when wiring is completed on RC card readers — software settings may need changed before it can be expected to work.',
  ],
  locks: [
    'Homebase Sites: Pre-configured and labelled by Quext; ready for site installation.',
    'Quext Sites: Installed and configured onsite by the Quext team (unless otherwise contracted).',
    'XE360 Compatibility: Falcon 25, Von Duprin 98/99/22. (Crash bars not provided by Quext).',
    'Door Prep: Ensure proper 1" deadbolt throw depth to prevent motor stall and battery drain.',
  ],
  supportEmail: 'support@onequext.com',
};

export const ONBOARDING_FLOW_SLIDES = [
  {
    slideNumber: 1,
    title: 'Lock Onboarding Guide Overview',
    category: 'Overview',
    description: 'Comprehensive onboarding procedure covering BE467, FE410, NDEB, XE360, and RC Card Reader controllers.',
    image: '/assets/aistudio/lock_guide_slides/slide_01.png',
  },
  {
    slideNumber: 2,
    title: 'Important Notices: Deletion Protocol & Support',
    category: 'Important Notices',
    description: 'Whenever you delete a lock from the Quext app you will need to reach out to support (support@onequext.com) to receive assistance in fully clearing out the lock from the system before you can continue using that same lock in the app.',
    image: '/assets/aistudio/lock_guide_slides/slide_02.png',
    bulletPoints: [
      'Mandatory Support Contact: support@onequext.com',
      'Deleting a lock from the app requires support to clear cloud records before re-use.',
      'Reach out to support when wiring is completed on RC card readers; software settings may need changed before it can be expected to work.',
    ],
  },
  {
    slideNumber: 3,
    title: 'Phone Settings: Turn Off Screen Auto-Lock',
    category: 'Important Notices',
    description: 'Ensure that your phone settings do not automatically lock your screen during provisioning.',
    image: '/assets/aistudio/lock_guide_slides/slide_03.png',
    bulletPoints: [
      'Android: Settings → Security or Security & Privacy → Screen lock → Choose None or Swipe.',
      'iOS: Settings → Display & Brightness → Auto-Lock → Select "Never" so the screen stays on.',
    ],
  },
  {
    slideNumber: 4,
    title: 'Network Settings: Prioritize Cellular Data',
    category: 'Important Notices',
    description: 'Ensure that you prioritize using cellular signal as your main method of communication to the Quext app unless in a poor service area.',
    image: '/assets/aistudio/lock_guide_slides/slide_04.png',
    bulletPoints: [
      'Disable building Wi-Fi if captive guest network blocks WebSocket / BLE traffic.',
      'Maintain strong LTE/5G cellular connectivity.',
    ],
  },
  {
    slideNumber: 5,
    title: 'App Verification: Use Quext IoT Admin App',
    category: 'Before You Start',
    description: 'Double check you are using the Quext IOT Admin app (with the dark icon and cyan square frame), NOT the resident Quext IoT app.',
    image: '/assets/aistudio/lock_guide_slides/slide_05.png',
  },
  {
    slideNumber: 6,
    title: 'Authentication: Enter Admin Credentials',
    category: 'Before You Start',
    description: 'Enter your email and password, check the box agreeing to Privacy Policy, Terms of Use, and EULA, and tap Sign in.',
    image: '/assets/aistudio/lock_guide_slides/slide_06.png',
  },
  {
    slideNumber: 7,
    title: 'Navigation: Tap the Service Gear Icon',
    category: 'Onboarding',
    description: 'Once logged in, tap on the "Service" gear icon located on the bottom navigation bar.',
    image: '/assets/aistudio/lock_guide_slides/slide_07.png',
  },
  {
    slideNumber: 8,
    title: 'Location Selection: Community, Building & Unit',
    category: 'Onboarding',
    description: 'Select the location your lock will be onboarded to (navigate Community → Building → Specific Unit or Amenity Door).',
    image: '/assets/aistudio/lock_guide_slides/slide_08.png',
  },
  {
    slideNumber: 9,
    title: 'Add Device: Tap "+ Install device"',
    category: 'Onboarding',
    description: 'Tap on the "+ Install device" button at the bottom of the location profile screen.',
    image: '/assets/aistudio/lock_guide_slides/slide_09.png',
  },
  {
    slideNumber: 10,
    title: 'Device Type: Select "Lock" from Menu',
    category: 'Onboarding',
    description: 'Select "Lock" from the pop up menu. This button is used for: XE360 all models, NDEB, BE467, FE410, and RC Card readers (all models).',
    image: '/assets/aistudio/lock_guide_slides/slide_10.png',
  },
  {
    slideNumber: 11,
    title: 'Barcode Scanning: Capture Serial Number',
    category: 'Onboarding',
    description: 'Locate the lock serial number barcode sticker. Place it inside the scan box with your app (or select from nearby / enter Allegion SN manually).',
    image: '/assets/aistudio/lock_guide_slides/slide_11.png',
  },
  {
    slideNumber: 12,
    title: 'Confirm Location & Tap "Install"',
    category: 'Onboarding',
    description: 'Confirm the unit location is correct and tap "Install". The app will automatically pair and provision the lock.',
    image: '/assets/aistudio/lock_guide_slides/slide_12.png',
  },
  {
    slideNumber: 13,
    title: 'Syncing: Push Active Credentials',
    category: 'Syncing',
    description: 'Once successful, you will see the lock profile screen. Tap the purple "Sync" button at the bottom right to sync the lock credentials.',
    image: '/assets/aistudio/lock_guide_slides/slide_13.png',
  },
  {
    slideNumber: 14,
    title: 'Testing: Return Home & Tap Key Symbol',
    category: 'Testing',
    description: 'Navigate back to the Home screen by tapping Home on the bottom bar, then tap the key symbol on your target door to test the lock.',
    image: '/assets/aistudio/lock_guide_slides/slide_14.png',
  },
  {
    slideNumber: 15,
    title: 'Testing: Bluetooth & Remote Search',
    category: 'Testing',
    description: 'Wait for the lock to respond ("Searching for the lock..."). Stand within Bluetooth range.',
    image: '/assets/aistudio/lock_guide_slides/slide_15.png',
  },
  {
    slideNumber: 16,
    title: 'Testing: "Activated!" Status Verified',
    category: 'Testing',
    description: 'If you see the "Activated!" screen with a checkmark, you can now unlock or lock the door with the app!',
    image: '/assets/aistudio/lock_guide_slides/slide_16.png',
  },
  {
    slideNumber: 17,
    title: 'SUCCESS: Onboarding Completed',
    category: 'Testing',
    description: 'Congratulations! You have completed the onboarding. The mobile credential pass is live on your smartphone and smartwatch.',
    image: '/assets/aistudio/lock_guide_slides/slide_17.png',
  },
  {
    slideNumber: 18,
    title: 'Spec Sheet Links & Door Prep Downloads',
    category: 'Spec Sheets',
    description: 'Official Allegion & Quext cut sheets, manufacturer templates, and user manuals for all supported locks.',
    image: '/assets/aistudio/lock_guide_slides/slide_18.png',
  },
  {
    slideNumber: 19,
    title: 'Installation Info & Need to Knows',
    category: 'Spec Sheets',
    description: 'Shipping timelines, pre-configuration guidelines, CAT6 POE specs, 18/4 wiring paths, and dry vs wet contacts.',
    image: '/assets/aistudio/lock_guide_slides/slide_19.png',
  },
  {
    slideNumber: 20,
    title: 'Factory Reset Process: BE/FE & NDE Locks',
    category: 'Factory Reset',
    description: 'Official capacitor discharge, 2-turn thumbturn (BE/FE) and 7-second pin with 3-handle turn (NDEB) procedures.',
    image: '/assets/aistudio/lock_guide_slides/slide_20.png',
  },
  {
    slideNumber: 21,
    title: 'Factory Reset Process: XE360 Locks',
    category: 'Factory Reset',
    description: '5-second mode switch hold, 3-action lever or crash bar depression within 20 seconds, and solid red LED sequence.',
    image: '/assets/aistudio/lock_guide_slides/slide_21.png',
  },
  {
    slideNumber: 22,
    title: 'Factory Reset Process: RC Reader Network Reset',
    category: 'Factory Reset',
    description: '5-second network reset button hold for IP and certificate file reestablishment.',
    image: '/assets/aistudio/lock_guide_slides/slide_22.png',
  },
  {
    slideNumber: 23,
    title: 'Factory Reset Process: RC Reader Factory Default Reset',
    category: 'Factory Reset',
    description: '10-second FDR hold with critical 7-14 second release window to clear memory to factory state.',
    image: '/assets/aistudio/lock_guide_slides/slide_23.png',
  },
  {
    slideNumber: 24,
    title: 'Troubleshooting: Missing App Invite or Credentials',
    category: 'Troubleshooting',
    description: 'Contact Quext Support at support@onequext.com to retrieve installer invitations and credentials.',
    image: '/assets/aistudio/lock_guide_slides/slide_24.png',
  },
  {
    slideNumber: 25,
    title: 'Troubleshooting: Lock Not Responding to App or Fob',
    category: 'Troubleshooting',
    description: 'Ensure Bluetooth is ON and OS is up to date. If unresolved, delete in app, notify support to clear backend, execute FDR, and re-onboard from Slide 5 to 11.',
    image: '/assets/aistudio/lock_guide_slides/slide_25.png',
  },
  {
    slideNumber: 26,
    title: 'Troubleshooting: Lock Won\'t Complete Sync Step',
    category: 'Troubleshooting',
    description: 'Delete lock in app, contact support@onequext.com to clear backend, perform FDR, and repeat onboarding from Slide 5 to 11.',
    image: '/assets/aistudio/lock_guide_slides/slide_26.png',
  },
];
