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
    fdrSlideNumber: 22,
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
      'Slide 12: Select connectivity mode (Standalone, Thermostat or bridge, Ethernet).',
      'Slide 27-28 Troubleshooting: If lock fails to respond or won\'t complete Sync, delete from app, contact support@onequext.com to delete on backend, FDR, and repeat onboarding from slide 5 through slide 11.',
    ],
    fdrToneType: 'befe',
    specificNotes: [
      'Pre-configured and labelled by Quext for Homebase sites.',
      'Requires 1" deep strike cavity in frame to avoid motor current spikes (80mA -> 700mA).',
      'Slide 10: Lock button in Quext Admin is used for XE360, NDEB, BE467, FE410, and RC readers.',
      'Slide 12: Choose Standalone mode when thermostats are not installed.',
    ],
    relevantSlideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 26, 27, 28],
  },

  ndeb: {
    id: 'ndeb',
    tabId: 'ndeb_guide',
    name: 'NDEB Field Guide',
    subtitle: 'Schlage NDE / NDEB Wireless Commercial Cylindrical Lever Lock',
    deviceModels: 'Schlage NDEB / LE Commercial Levers',
    hardwareImage: '/src/assets/images/schlage_nde_lock_1791238029459.jpg',
    heroBadge: 'Commercial Wireless Lever',
    fdrSlideNumber: 22,
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
      'PRO TIP (Slide 22): After resetting an NDE or LE Lock wait 30 seconds for the lock to power on and this has proven to assist with the onboarding process to avoid needing to repeat resetting the NDE or LE.',
      'Keep the reset pin perpendicular to avoid bending inside the housing pinhole.',
      'Slide 27-28 Troubleshooting: If lock fails to respond or won\'t complete Sync, delete from app, contact support@onequext.com to delete on backend, FDR, and repeat onboarding from slide 5 through slide 11.',
    ],
    fdrToneType: 'ndeb',
    specificNotes: [
      'Approved for interior office, common area, and unit entry cylindrical preps.',
      'Ensure 30-second post-reset wake window before attempting BLE connection.',
      'Slide 10: Lock button in Quext Admin is used for NDEB, XE360, BE467, FE410, and RC Card readers.',
    ],
    relevantSlideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 26, 27, 28],
  },

  xe360: {
    id: 'xe360',
    tabId: 'xe360_guide',
    name: 'XE360 Field Guide',
    subtitle: 'Schlage XE360 Series Architectural Smart Lock (Exit Trim, Mortise & Cylindrical)',
    deviceModels: 'Schlage XE360 (Exit Trim, Mortise, Cylindrical)',
    hardwareImage: '/src/assets/images/schlage_xe360_lock_1791238043440.jpg',
    heroBadge: 'Commercial Architectural & Exit Device',
    fdrSlideNumber: 23,
    fdrTitle: 'XE360 Mode Switch & 3-Action Reset Sequence',
    fdrInstructions: [
      '1. Press and hold the mode switch for five (5) seconds. You will see 2 green lights and hear 2 beeps.',
      '2. Rotate and release the interior lever OR depress the exit crash bar three (3) times within 20 seconds of FDR sequence. 1 red light for each turn/press and 1 beep for each turn/press.',
      '3. FDR in process: The lock will display a solid red light.',
      '4. FDR completes: The lock displays 1 green light and sounds 1 beep.',
      '5. Replace the electronic protective cover.',
    ],
    fdrProTips: [
      'Compatible with Falcon 25 and Von Duprin 98/99/22 exit devices (crash bars not provided by Quext).',
      'The 3 lever or crash bar depressions must be executed within the 20-second active window.',
      'Slide 27-28 Troubleshooting: If lock fails to respond or won\'t complete Sync, delete from app, contact support@onequext.com to delete on backend, FDR, and repeat onboarding from slide 5 through slide 11.',
    ],
    fdrToneType: 'xe360',
    specificNotes: [
      'Homebase Sites: Pre-configured and labelled by Quext; ready for site installation.',
      'Quext Sites: Installed and configured onsite by the Quext team (unless otherwise contracted).',
      'XE360 Compatibility: Falcon 25, Von Duprin 98/99/22. Crash bars not provided.',
    ],
    relevantSlideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 26, 27, 28],
  },

  rc_reader: {
    id: 'rc_reader',
    tabId: 'rc_reader_guide',
    name: 'RC Reader Controller Field Guide',
    subtitle: 'Schlage RC11 (Mullion IP), RC15 & RCK15 (Keypad) Pure IP Reader Controllers',
    deviceModels: 'Schlage RC11, RC15, RCK15 Pure IP Reader Controllers',
    hardwareImage: '/src/assets/images/schlage_rc11_reader_1791238012335.jpg',
    heroBadge: 'Perimeter Access Pure IP Reader Controller',
    fdrSlideNumber: 24,
    fdrTitle: 'RC Network Reset & Factory Default Reset (FDR)',
    fdrInstructions: [
      'NETWORK RESET (Slide 24): Press and hold the reset button on the back of the reader until one green LED flash and one short beep (approx. five secs.), then release. Reestablishes network connection and routing certificate.',
      'FACTORY DEFAULT RESET (Slide 25): Press and hold the reset button until two green LED flashes and two beeps (approx. 10 secs.), then release. Successful FDR is indicated by a long steady green light and long beep.',
      '*CRITICAL FIRMWARE RULE (May 2021+): Hold the button longer than 7 seconds for the first two beeps, but release BEFORE 14 seconds! If held past 14 seconds, the FDR process is cancelled.',
      'PRO TIP (Slide 24 & 25): Locate the small reset button on the back of the reader itself using a very thin pin. Once power-on completes, continue in Quext Admin.',
      'IMPORTANT HARDWARE NOTICE (Slide 2): Reach out to Quext Support (support@onequext.com) when wiring is completed — software settings may need to be changed before it can be expected to work.',
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
    relevantSlideIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28],
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
    image: '/assets/aistudio/lock_guide_slides/slide_01.jpg',
  },
  {
    slideNumber: 2,
    title: 'Important Notices: Deletion Protocol & Support',
    category: 'Important Notices',
    description: 'Whenever you delete a lock from the Quext app you will need to reach out to support (support@onequext.com) to receive assistance in fully clearing out the lock from the system before you can continue using that same lock in the app.',
    image: '/assets/aistudio/lock_guide_slides/slide_02.jpg',
    bulletPoints: [
      'Mandatory Support Contact: support@onequext.com',
      'Deleting a lock from the app requires support assistance to fully clear out the lock from the system before re-use.',
      'Reach out to support when wiring is completed on RC card readers; software settings may need changed before it can be expected to work.',
    ],
  },
  {
    slideNumber: 3,
    title: 'Phone Settings: Turn Off Screen Auto-Lock',
    category: 'Important Notices',
    description: 'Ensure that your phone settings do not automatically lock your screen during provisioning.',
    image: '/assets/aistudio/lock_guide_slides/slide_03.jpg',
    bulletPoints: [
      'Android: Open Settings → Security or Security & Privacy (on Samsung devices, tap Lock screen or Security and privacy first) → Screen lock or Screen lock type → Enter PIN/pattern/password → Choose None to remove lock completely, or Swipe.',
      'iOS: Open Settings → Display & Brightness → Scroll down and tap on Auto-Lock → Select Never so screen stays on until you press the side button.',
    ],
  },
  {
    slideNumber: 4,
    title: 'Network Settings: Prioritize Cellular Signal',
    category: 'Important Notices',
    description: 'Ensure that you prioritize using cellular signal as your main method of communication to the Quext app unless under a poor service area for cellular coverage.',
    image: '/assets/aistudio/lock_guide_slides/slide_04.jpg',
    bulletPoints: [
      'Disable building Wi-Fi if captive guest network blocks WebSocket or BLE traffic.',
      'Maintain strong LTE/5G cellular connectivity.',
    ],
  },
  {
    slideNumber: 5,
    title: 'App Verification: Use Quext IoT Admin App',
    category: 'Before You Start',
    description: 'Double check you are using the Quext IOT Admin app (with the dark icon and cyan square frame), NOT the resident Quext IoT app.',
    image: '/assets/aistudio/lock_guide_slides/slide_05.jpg',
  },
  {
    slideNumber: 6,
    title: 'Authentication: Enter Admin Credentials',
    category: 'Before You Start',
    description: 'Enter your email and password here. Agree to Privacy Policy, Terms of Use, and EULA, and tap Sign in.',
    image: '/assets/aistudio/lock_guide_slides/slide_06.jpg',
  },
  {
    slideNumber: 7,
    title: 'Navigation: Tap the Service Gear Icon',
    category: 'Onboarding',
    description: 'Once logged in tap on the service gear icon located on the bottom navigation bar.',
    image: '/assets/aistudio/lock_guide_slides/slide_07.jpg',
  },
  {
    slideNumber: 8,
    title: 'Location Selection: Community, Building & Unit',
    category: 'Onboarding',
    description: 'Select the location your Lock will be onboarded to (navigate Community → Building → Specific Unit or Amenity Door).',
    image: '/assets/aistudio/lock_guide_slides/slide_08.jpg',
  },
  {
    slideNumber: 9,
    title: 'Add Device: Tap "+ Install device"',
    category: 'Onboarding',
    description: 'Tap on the install device button on the bottom of the screen.',
    image: '/assets/aistudio/lock_guide_slides/slide_09.jpg',
  },
  {
    slideNumber: 10,
    title: 'Device Type: Select "Lock" from Pop Up Menu',
    category: 'Onboarding',
    description: 'Select lock from the pop up menu. Locks this button is used for: XE360 all models, NDEB, BE467, FE410, and RC Card readers (all models).',
    image: '/assets/aistudio/lock_guide_slides/slide_10.jpg',
    bulletPoints: [
      'XE360 (all models)',
      'NDEB',
      'BE467',
      'FE410',
      'RC Card readers (all models)',
    ],
  },
  {
    slideNumber: 11,
    title: 'Barcode Scanning: Capture Serial Number',
    category: 'Onboarding',
    description: 'Locate the locks serial number barcode sticker. Place it in the scan box with your app (or select from nearby locks / enter Allegion SN manually).',
    image: '/assets/aistudio/lock_guide_slides/slide_11.jpg',
  },
  {
    slideNumber: 12,
    title: 'Connectivity Mode: Select Connection Type',
    category: 'Onboarding',
    description: 'Select the Connectivity mode for the lock: Standalone, Thermostat or bridge, or Ethernet.',
    image: '/assets/aistudio/lock_guide_slides/slide_12.jpg',
    bulletPoints: [
      'Standalone: This mode is used in locations where thermostats are not installed.',
      'Thermostat or bridge: This mode is used when a lock can be connected to a thermostat or a hub bridge.',
      'Ethernet: This mode is used to connect the device to the Cloud through an Ethernet connection.',
    ],
  },
  {
    slideNumber: 13,
    title: 'Sub-Location Selection: If Multiple Locations Exist',
    category: 'Onboarding',
    description: 'If Applicable select the location for the local if multiple locations exist (Install in → Select location for installation).',
    image: '/assets/aistudio/lock_guide_slides/slide_13.jpg',
  },
  {
    slideNumber: 14,
    title: 'Confirm Location & Tap Install',
    category: 'Onboarding',
    description: 'You should see this screen as soon as the camera catches the bar code. Confirm the location is correct and tap install! At this point the app will automatically add the lock for you and you are just waiting for the process to complete!',
    image: '/assets/aistudio/lock_guide_slides/slide_14.jpg',
  },
  {
    slideNumber: 15,
    title: 'Syncing: Tap Sync to Update the Lock',
    category: 'Syncing',
    description: 'Once successful you should see this screen. Tap on the sync button to sync the lock credentials and live configuration.',
    image: '/assets/aistudio/lock_guide_slides/slide_15.jpg',
  },
  {
    slideNumber: 16,
    title: 'Testing: Return Home & Tap Key Symbol',
    category: 'Testing',
    description: 'Navigate back to the Home screen by tapping Home. Then you can tap on the key symbol to test your lock!',
    image: '/assets/aistudio/lock_guide_slides/slide_16.jpg',
  },
  {
    slideNumber: 17,
    title: 'Testing: Wait for Lock to Respond',
    category: 'Testing',
    description: 'Wait for the lock to respond ("Searching for the lock..."). Supports Bluetooth and Remote activation channels.',
    image: '/assets/aistudio/lock_guide_slides/slide_17.jpg',
  },
  {
    slideNumber: 18,
    title: 'Testing: "Activated!" Door Ready to Unlock/Lock',
    category: 'Testing',
    description: 'If you see this screen, now you can unlock or lock the door! Tap Dismiss.',
    image: '/assets/aistudio/lock_guide_slides/slide_18.jpg',
  },
  {
    slideNumber: 19,
    title: 'SUCCESS: Onboarding Complete',
    category: 'Testing',
    description: 'SUCCESS! Congrats you have completed the onboarding! Mobile credentials are live on phone and smartwatch.',
    image: '/assets/aistudio/lock_guide_slides/slide_19.jpg',
  },
  {
    slideNumber: 20,
    title: 'Spec Sheet Links & Door Prep Downloads',
    category: 'Spec Sheets',
    description: 'Spec sheet links for locks, card readers, and door prep templates.',
    image: '/assets/aistudio/lock_guide_slides/slide_20.jpg',
    bulletPoints: [
      'Schlage_Reader_Controller_User_Guide_013562.pdf (includes door prep)',
      'Schlage_XE360_Exit_Trim_Data_Sheet_115590.pdf',
      'Schlage_XE360_Mortise_Data_Sheet_115589 (1).pdf',
      'BE Schlage_Control_Mobile_Data_Sheet_113252 (1).pdf',
      'Schlage_NDE Lock_Data Sheet.pdf',
      'Schlage_XE360-Series_User_Guide_115598',
      'Door Prep: XE360cut sheet (1).pdf, Schlage_NDEB_Door_Manufacturer_Template_013553.pdf, BE467F-door-prep-template-RB117.pdf, XE101 Template, FE410 RF124-1 (Metal) & RF123-1 (Wood)',
    ],
  },
  {
    slideNumber: 21,
    title: 'Installation Info & Need to Knows',
    category: 'Spec Sheets',
    description: 'Shipping timelines, pre-configuration guidelines, Falcon 25 / Von Duprin 98/99/22 exit device compatibility, CAT6 POE (max 12V), and dry vs wet contacts.',
    image: '/assets/aistudio/lock_guide_slides/slide_21.jpg',
    bulletPoints: [
      'Shipping Timeline: 1-2 weeks for onboarding into Homebase; 2-6 weeks for shipping (hardware dependent).',
      'Card Readers: Provided pre-configured and labelled. Includes RB1224 Relay (for wet contact) and 18/4 Pigtail.',
      'Locks (BE467, FE410, XE360): Homebase pre-configured; Quext sites installed/configured onsite.',
      'XE360 Compatibility: Falcon 25, Von Duprin 98/99/22. Crash bars not provided.',
      'Wiring: CAT6 required for all readers (POE/Data) - max 12V. Tie-in at door; IDF/electrical tie-ins require 18/4.',
      'Important: Readers use Dry Contacts. If Wet Contacts are needed (via RB1224), notify PM to adjust backend.',
    ],
  },
  {
    slideNumber: 22,
    title: 'Factory Reset Process: BE/FE & NDE Locks',
    category: 'Factory Reset',
    description: 'How to Factory Reset BE/FE Locks & How to reset NDE locks.',
    image: '/assets/aistudio/lock_guide_slides/slide_22.jpg',
    bulletPoints: [
      'BE/FE Locks: A. Remove one battery (unscrew backplate), B. Wait 5-10s, C. Replace battery, D. Wait for beep, E. Turn deadbolt twice, F. (2) short beeps and (1) long beep means success!',
      'NDE Locks: A. Remove one battery, B. Wait 5-10s, C. Replace battery, D. Using provided pin hold reset button for 7s until beeps, E. Turn backside handle 3 times (beeps each turn), F. 2 beeps and one long beep means success!',
      'Pro Tip: After resetting an NDE or LE Lock wait 30 seconds for the lock to power on and this has proven to assist with the onboarding process to avoid needing to repeat resetting the NDE or LE.',
    ],
  },
  {
    slideNumber: 23,
    title: 'Factory Reset Process: How to Factory Reset XE360',
    category: 'Factory Reset',
    description: 'XE360 Mode switch & 3-action turn/press reset sequence.',
    image: '/assets/aistudio/lock_guide_slides/slide_23.jpg',
    bulletPoints: [
      'Press and hold the mode switch for five (5) seconds. You will see 2 green lights and hear 2 beeps.',
      'Rotate and release the interior lever or depress exit device three (3) times within 20 seconds of FDR sequence. 1 red light and 1 beep for each turn/press.',
      'FDR in process: The lock will have solid red light.',
      'FDR completes: 1 green light and 1 beep.',
      'Replace the electronic cover.',
    ],
  },
  {
    slideNumber: 24,
    title: 'Factory Reset Process RC\'s: Network Reset',
    category: 'Factory Reset',
    description: 'Press and hold reset button until 1 green LED flash and 1 short beep (~5s) then release. Reestablishes network connection and certificates.',
    image: '/assets/aistudio/lock_guide_slides/slide_24.jpg',
    bulletPoints: [
      'Press and hold reset button until one green LED flash and one short beep (approx. 5 secs.) then release.',
      '*Note: As of May 2021, hold the button longer than 7 seconds for the first two beeps, but release before 14 seconds, otherwise the FDR process is cancelled.',
      'Pro Tip: Locate small reset button on back of reader using a very thin pin. Continue onboarding once power-on completes.',
    ],
  },
  {
    slideNumber: 25,
    title: 'Factory Reset Process RC\'s: Factory Default Reset (FDR)',
    category: 'Factory Reset',
    description: 'Press and hold reset button until two green LED flashes and two beeps (~10s) then release. Confirmed by long steady green light and long beep.',
    image: '/assets/aistudio/lock_guide_slides/slide_25.jpg',
    bulletPoints: [
      'Press and hold reset button until two green LED flashes and two beeps (approx. 10 secs.) then release.',
      'Successful FDR indicated by long steady green light and long beep.',
      '*Note: Hold longer than 7 seconds for first two beeps, but release BEFORE 14 seconds or FDR is cancelled.',
      'FDR returns Reader Controller settings to original factory settings; requires re-capture. Does not remove from ENGAGE account.',
    ],
  },
  {
    slideNumber: 26,
    title: 'Troubleshooting: Missing App Invite or Credentials',
    category: 'Troubleshooting',
    description: 'What to do if: I don\'t see my invite to the app or credentials I need? Contact Quext Support at support@onequext.com.',
    image: '/assets/aistudio/lock_guide_slides/slide_26.jpg',
    bulletPoints: [
      'Contact Quext Support: support@onequext.com',
      'Quext Support can assist with getting you back on track with login issues and missing credentials!',
    ],
  },
  {
    slideNumber: 27,
    title: 'Troubleshooting: Lock Not Responding to App or Fob',
    category: 'Troubleshooting',
    description: 'Ensure phone running latest software and Bluetooth ON. If unresolved: delete from Quext App, reach out to support to delete on their side, perform FDR, repeat onboarding from slide 5 through slide 11, then try syncing/engaging!',
    image: '/assets/aistudio/lock_guide_slides/slide_27.jpg',
    bulletPoints: [
      'Ensure phone is running latest OS version and Bluetooth is ON.',
      'As a last resort delete the lock you are having issues with from the Quext App.',
      'Reach out to support to have them delete the lock from their side.',
      'Perform another Factory Reset (FDR) as described in slide 22 / 23.',
      'Repeat the Onboarding process from slide 5 through slide 11.',
      'Then try Syncing or engaging the lock to unlock it!',
    ],
  },
  {
    slideNumber: 28,
    title: 'Troubleshooting: Lock Won\'t Complete the Sync Step',
    category: 'Troubleshooting',
    description: 'Delete lock in Quext App, contact support@onequext.com to delete on their end, perform FDR, repeat onboarding from slide 5 through slide 11, then try syncing or engaging to unlock!',
    image: '/assets/aistudio/lock_guide_slides/slide_28.jpg',
    bulletPoints: [
      'Delete the lock from the Quext App.',
      'Reach out to support@onequext.com to have them also delete the lock on their end.',
      'Perform another Factory Reset (FDR).',
      'Repeat the Onboarding process from slide 5 through slide 11.',
      'Then try Syncing or engaging the lock to unlock it!',
    ],
  },
];
