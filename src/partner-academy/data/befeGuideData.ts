export interface BefeGuideStep {
  id: string;
  stageNumber: number;
  stageTitle: string;
  stepNumber: number;
  title: string;
  summary: string;
  instructions: string[];
  fieldTips?: string[];
  criticalWarning?: string;
  badge?: string;
  category: 'prep' | 'mounting' | 'app' | 'fdr' | 'support';
}

export interface AuditoryCode {
  sequence: string;
  visualGraphic: string;
  meaning: string;
  actionRequired: string;
  audioToneType: 'single_beep' | 'success_fdr' | 'error_rapid' | 'jam_beep';
  status: 'info' | 'success' | 'warning' | 'error';
}

export const BEFE_GUIDE_METADATA = {
  title: 'BE / FE Smart Deadbolts & Interconnected Locks Field Guide',
  subtitle: 'Official Field Manual · Model Schlage Control BE467 / FE410',
  documentCode: 'QXT-GUIDE-BEFE-REV4',
  targetDevices: 'Schlage Control Smart Deadbolt (BE467) & Interconnected (FE410)',
  platform: 'Quext IoT Admin Platform · Bluetooth Low Energy (BLE)',
  powerSource: '4x AA 1.5V Alkaline Batteries (Energizer Industrial / Duracell Procell Recommended)',
  hardwareEscutcheon: 'Architectural Satin Nickel / Matte Black with Centered RFID Reader Ring',
  supportEmail: 'support@onequext.com',
  lastUpdated: 'October 2026',
};

export const BEFE_TECHNICAL_SPECS = [
  { label: 'Compatible Models', value: 'Schlage Control BE467 (Deadbolt) & FE410 (Interconnected Cylindrical)' },
  { label: 'Wireless Protocols', value: 'Bluetooth Low Energy (BLE 5.0) & 13.56 MHz NFC / RFID' },
  { label: 'Power Requirements', value: '6V DC via 4x AA Alkaline (Strictly non-rechargeable)' },
  { label: 'Backplate Screws', value: '2x T15 Torx / Phillips interior mounting machine screws' },
  { label: 'Thumbturn Action', value: 'Independent 90° mechanical throw with optical sensor' },
  { label: 'Capacitor Drain Time', value: '5 to 10 seconds continuous disconnected state' },
  { label: 'Reset Success Tone', value: '2 Short Beeps + 1 Long Beep (High Frequency)' },
  { label: 'Operating Temp', value: '-35°C to 66°C (-31°F to 151°F) exterior escutcheon' },
];

export const BEFE_AUDITORY_CODES: AuditoryCode[] = [
  {
    sequence: '1 Long Beep (Power-On)',
    visualGraphic: '●─────────',
    meaning: 'Battery reconnected; internal power supply rail energized',
    actionRequired: 'Immediately initiate 2 rapid thumbturn rotations within 2 seconds',
    audioToneType: 'single_beep',
    status: 'info',
  },
  {
    sequence: '2 Short Beeps + 1 Long Beep',
    visualGraphic: '• • ──────',
    meaning: 'Factory Default Reset (FDR) successfully executed',
    actionRequired: 'Local pairing keys erased. Lock is ready for in-app Quext BLE provisioning',
    audioToneType: 'success_fdr',
    status: 'success',
  },
  {
    sequence: '3 Rapid Low Beeps',
    visualGraphic: '• • •',
    meaning: 'Reset sequence timed out or thumbturn turned too late/slowly',
    actionRequired: 'Remove battery, discharge 10 seconds, and restart reset sequence',
    audioToneType: 'error_rapid',
    status: 'warning',
  },
  {
    sequence: 'Continuous Rapid Beeping + Red LED',
    visualGraphic: '••••••••',
    meaning: 'Motorized deadbolt bolt stall or strike plate physical misalignment',
    actionRequired: 'Loosen interior mounting screws slightly to relieve binding, inspect bolt hole depth',
    audioToneType: 'jam_beep',
    status: 'error',
  },
];

export const BEFE_GUIDE_STAGES = [
  { id: 1, title: 'Mobile Environment & Phone Setup', badge: 'Preparation' },
  { id: 2, title: 'Physical Inspection & Battery Access', badge: 'Hardware' },
  { id: 3, title: 'Quext IoT Admin App Provisioning', badge: 'Commissioning' },
  { id: 4, title: '2-Turn Thumbturn FDR Sequence', badge: 'Reset Protocol' },
  { id: 5, title: 'Deletion Protocol & Support Escalation', badge: 'Compliance' },
];

export const BEFE_GUIDE_STEPS: BefeGuideStep[] = [
  // Stage 1: Phone Setup
  {
    id: 'befe_step_01',
    stageNumber: 1,
    stageTitle: 'Mobile Environment & Phone Setup',
    stepNumber: 1,
    title: 'Verify Dedicated Quext IoT Admin Application',
    summary: 'Ensure you are logged into the enterprise installer app and not the resident portal.',
    instructions: [
      'Locate and open the Quext IoT Admin app on your iOS or Android field device.',
      'Confirm the app icon features the dark lockup with white square boundary and "Admin" designation.',
      'Never attempt to onboard or provision hardware using the resident-facing Quext IoT app, as installer device addition menus are disabled.',
    ],
    fieldTips: [
      'If you see resident unit thermostat controls or smart plugs upon login, you are in the resident app. Switch immediately to Quext IoT Admin.',
    ],
    criticalWarning: 'Resident credentials will fail cryptographic handshake when pairing locks.',
    category: 'prep',
    badge: 'Mandatory',
  },
  {
    id: 'befe_step_02',
    stageNumber: 1,
    stageTitle: 'Mobile Environment & Phone Setup',
    stepNumber: 2,
    title: 'Configure OS Auto-Lock & Display Sleep to "Never"',
    summary: 'Prevent iOS or Android display timeouts from dropping active Bluetooth connections.',
    instructions: [
      'Open iOS Settings → Display & Brightness → Auto-Lock → Select "Never".',
      'For Android: Navigate to Settings → Display → Screen Timeout → Set to Maximum (10–30 minutes) or enable Developer Keep Awake.',
      'Ensure Bluetooth is turned ON in system settings and Quext Admin has "Always Allow" Bluetooth permissions.',
    ],
    fieldTips: [
      'If the screen sleeps during the 30-second firmware key negotiation, the BLE handshake packet will drop, requiring a full power cycle of the lock.',
    ],
    category: 'prep',
    badge: 'Device Setting',
  },
  {
    id: 'befe_step_03',
    stageNumber: 1,
    stageTitle: 'Mobile Environment & Phone Setup',
    stepNumber: 3,
    title: 'Prioritize Cellular Data Over Property Wi-Fi',
    summary: 'Building guest Wi-Fi networks frequently block the secure WebSocket ports required by Quext Cloud.',
    instructions: [
      'Disable Wi-Fi in the phone quick settings panel to force LTE/5G cellular data.',
      'Ensure at least 2 bars of reliable cellular coverage before starting commissioning.',
      'If working in concrete elevator cores or subterranean corridors, use a cellular booster or tether to a mobile hotspot with verified WAN access.',
    ],
    fieldTips: [
      'Unauthenticated captive Wi-Fi portals will silently terminate the pairing session without an explicit error code.',
    ],
    category: 'prep',
    badge: 'Connectivity',
  },

  // Stage 2: Hardware
  {
    id: 'befe_step_04',
    stageNumber: 2,
    stageTitle: 'Physical Inspection & Battery Access',
    stepNumber: 4,
    title: 'Verify Latch Free-Throw & Door Alignment',
    summary: 'Ensure the deadbolt bolt throws smoothly without rubbing against the door jamb strike.',
    instructions: [
      'With the door open, manually extend and retract the bolt using the interior thumbturn. Movement must be effortless.',
      'Close the door and throw the bolt. If friction is felt, adjust the strike plate or deepen the strike cavity in the wood/metal frame (minimum 1" depth required).',
      'Check that weatherstripping does not exert excessive spring pressure requiring the user to push/pull the door to latch.',
    ],
    fieldTips: [
      'Motor binding is the #1 cause of premature battery drain on BE467 deadbolts. The motor will draw up to 8x current if the bolt rubs against the strike hole.',
    ],
    criticalWarning: 'Never force a motorized deadbolt into an undersized jamb hole.',
    category: 'mounting',
    badge: 'Physical Check',
  },
  {
    id: 'befe_step_05',
    stageNumber: 2,
    stageTitle: 'Physical Inspection & Battery Access',
    stepNumber: 5,
    title: 'Remove Interior Backplate & Access 4x AA Battery Pack',
    summary: 'Unscrew the interior security cover to reveal the battery compartment and motherboard.',
    instructions: [
      'Using a #2 Phillips or T15 Torx driver, remove the two mounting screws securing the black interior decorative housing.',
      'Carefully slide the cover upward and off the interior chassis.',
      'Inspect the 4x AA battery harness. Verify premium alkaline cells (Duracell or Energizer) are installed with correct polarity.',
      'Locate the serial number barcode sticker affixed to the interior chassis or battery tray. Keep it visible for step 7.',
    ],
    fieldTips: [
      'Do not pinch the delicate ribbon cable connecting the exterior RFID reader to the interior PCB when removing or reinstalling the cover.',
    ],
    category: 'mounting',
    badge: 'Disassembly',
  },

  // Stage 3: App Onboarding
  {
    id: 'befe_step_06',
    stageNumber: 3,
    stageTitle: 'Quext IoT Admin App Provisioning',
    stepNumber: 6,
    title: 'Navigate Property Hierarchy in Quext Admin',
    summary: 'Select the precise Community, Building, and Target Unit in the Quext portal.',
    instructions: [
      'Tap on the "Service" gear icon located in the bottom navigation bar of Quext IoT Admin.',
      'Select your active Community from the property list.',
      'Select the target Building number.',
      'Scroll to and select the specific Unit number (e.g., Unit 204).',
    ],
    fieldTips: [
      'Always double-check the apartment physical placard against the app unit number before tapping Install.',
    ],
    category: 'app',
    badge: 'Portal Navigation',
  },
  {
    id: 'befe_step_07',
    stageNumber: 3,
    stageTitle: 'Quext IoT Admin App Provisioning',
    stepNumber: 7,
    title: 'Initiate "+ Install device" and Scan Serial Barcode',
    summary: 'Add the smart lock to unit records using the phone camera scanner.',
    instructions: [
      'Tap the purple "+ Install device" button at the bottom of the unit profile.',
      'Select "Lock" from the hardware device categories.',
      'Position the phone camera over the 1D/2D serial barcode sticker located on the lock chassis.',
      'Wait for the green reticle confirmation box and audible beep from the phone.',
    ],
    fieldTips: [
      'If lighting is dim, toggle the in-app flashlight or manually type the 10-character serial code printed beneath the barcode.',
    ],
    category: 'app',
    badge: 'Barcode Scan',
  },
  {
    id: 'befe_step_08',
    stageNumber: 3,
    stageTitle: 'Quext IoT Admin App Provisioning',
    stepNumber: 8,
    title: 'Establish BLE Handshake, Synchronize & Test Unlock',
    summary: 'Negotiate cryptographic keys over Bluetooth and test the physical actuator.',
    instructions: [
      'Hold the phone within 3 feet (1 meter) of the exterior Schlage reader face.',
      'Tap "Install & Pair Lock" in the app.',
      'Observe the concentric white/blue LED status ring on the exterior lock faceplate illuminate.',
      'Once pairing completes, tap the purple "Sync" button in the app to download active resident credentials.',
      'Perform a physical unlock test via the app toggle. Verify the motor drives the deadbolt smoothly to full retraction.',
    ],
    fieldTips: [
      'If the app displays "BLE Connection Failed", proceed immediately to Stage 4 (Factory Default Reset) to clear stale pairing keys.',
    ],
    criticalWarning: 'Never walk away from a door until both in-app unlock and physical interior thumbturn lock have been verified.',
    category: 'app',
    badge: 'BLE Handshake',
  },

  // Stage 4: Reset Protocol
  {
    id: 'befe_step_09',
    stageNumber: 4,
    stageTitle: '2-Turn Thumbturn FDR Sequence',
    stepNumber: 9,
    title: 'Disconnect Exactly One (1) AA Battery',
    summary: 'Interrupt the 6V DC main power rail while preserving the remaining cells in the tray.',
    instructions: [
      'With the interior cover removed, grasp the uppermost AA alkaline battery in the holder.',
      'Pull the single battery out of the clip so that one end is completely disconnected from the contact terminal.',
      'Leave the other three (3) batteries firmly in their respective slots.',
    ],
    fieldTips: [
      'There is no need to remove all 4 batteries; disconnecting one battery completely breaks the series circuit.',
    ],
    category: 'fdr',
    badge: 'Power Cycle',
  },
  {
    id: 'befe_step_10',
    stageNumber: 4,
    stageTitle: '2-Turn Thumbturn FDR Sequence',
    stepNumber: 10,
    title: 'Wait Full 5 to 10 Seconds for Capacitor Discharge',
    summary: 'Allow onboard capacitors to bleed off residual energy so the microcontroller cleanly resets.',
    instructions: [
      'Keep the battery disconnected and count out a full 10 seconds (1-Mississippi, 2-Mississippi...).',
      'Do not rush this step! The lock PCB contains storage capacitors that power the secure cryptoprocessor for several seconds after battery removal.',
      'If the battery is reinserted before capacitors fully discharge, the lock will warm-boot and ignore the subsequent reset sequence.',
    ],
    fieldTips: [
      'Use the interactive countdown timer in this guide to guarantee a full 10-second drain.',
    ],
    criticalWarning: 'Failing to wait at least 5 seconds is the #1 reason FDR sequences fail in the field.',
    category: 'fdr',
    badge: 'Capacitor Drain',
  },
  {
    id: 'befe_step_11',
    stageNumber: 4,
    stageTitle: '2-Turn Thumbturn FDR Sequence',
    stepNumber: 11,
    title: 'Reinsert Battery & Listen for Single Power-Up Beep',
    summary: 'Restore 6V power and prepare for immediate mechanical input.',
    instructions: [
      'Firmly press the removed AA battery back into its slot, ensuring correct polarity (+ to + terminal).',
      'Keep your ear close to the lock and listen intently for ONE (1) single power-up beep.',
      'Place your fingers on the interior thumbturn immediately upon reinsertion.',
    ],
    fieldTips: [
      'The single beep occurs within 1 to 2 seconds after the battery makes solid contact.',
    ],
    category: 'fdr',
    badge: 'Power Restoration',
  },
  {
    id: 'befe_step_12',
    stageNumber: 4,
    stageTitle: '2-Turn Thumbturn FDR Sequence',
    stepNumber: 12,
    title: 'Immediately Turn Thumbturn Twice in Rapid Succession',
    summary: 'Execute the patented 2-turn mechanical reset sequence within the 2-second time window.',
    instructions: [
      'IMMEDIATELY after hearing the single power-up beep, rotate the deadbolt thumbturn 90° clockwise/counter-clockwise, then back again (Turn 1).',
      'Instantly repeat the motion a second time (Turn 2).',
      'Both turns must be completed within 2 seconds of the power-up beep.',
    ],
    fieldTips: [
      'Turn rhythm should be swift: Turn-Turn! Smooth, deliberate mechanical throws.',
    ],
    category: 'fdr',
    badge: '2-Turn Sequence',
  },
  {
    id: 'befe_step_13',
    stageNumber: 4,
    stageTitle: '2-Turn Thumbturn FDR Sequence',
    stepNumber: 13,
    title: 'Verify Auditory Confirmation: 2 Short Beeps + 1 Long Beep',
    summary: 'Listen for the definitive tone combination that proves local factory reset is complete.',
    instructions: [
      'Release the thumbturn and listen for the confirmation audio signature.',
      'SUCCESS CONFIRMATION: You will hear exactly TWO (2) short beeps followed immediately by ONE (1) long beep: "Beep-Beep... Beeeeep".',
      'The exterior LED ring will flash green momentarily.',
      'If you hear 3 rapid low beeps or no beeps at all, the sequence failed. Pull the battery, wait 10 seconds, and try again.',
    ],
    fieldTips: [
      'Use the audio simulator button in this guide to hear the exact tone pattern before performing it on the door.',
    ],
    criticalWarning: 'Never reinstall the interior cover until the 2-short + 1-long tone has been heard and confirmed.',
    category: 'fdr',
    badge: 'Auditory Confirmation',
  },

  // Stage 5: Deletion Protocol & Support
  {
    id: 'befe_step_14',
    stageNumber: 5,
    stageTitle: 'Deletion Protocol & Support Escalation',
    stepNumber: 14,
    title: 'Strict Adherence to the Quext Deletion Protocol',
    summary: 'Deleting a lock in the app requires mandatory support cloud dissociation before the lock can be reused.',
    instructions: [
      'CRITICAL OEM RULE: Whenever you delete a lock from the Quext app, you MUST reach out to Quext Support (support@onequext.com) to receive assistance in fully clearing out the lock record from the property cloud database.',
      'Deleting the lock in the mobile app only disassociates the local client. The backend cryptographic keys remain reserved to that specific unit until cleared by a Tier-2 administrator.',
      'Attempting to re-onboard a deleted lock without cloud clearance will trigger "Hardware Already Provisioned (Code 409)" errors.',
    ],
    fieldTips: [
      'Always follow the standard 4-step recovery loop: (1) Delete in App → (2) Email support@onequext.com → (3) Perform Physical 2-Turn FDR → (4) Re-onboard.',
    ],
    criticalWarning: 'DELETION PROTOCOL MANDATE: Never swap a deleted lock to a new unit without notifying support@onequext.com first.',
    category: 'support',
    badge: 'Critical Protocol',
  },
  {
    id: 'befe_step_15',
    stageNumber: 5,
    stageTitle: 'Deletion Protocol & Support Escalation',
    stepNumber: 15,
    title: 'Field Support Escalation & Ticket Template',
    summary: 'Standard dispatch template to minimize downtime when contacting Quext Field Engineering.',
    instructions: [
      'When emailing support@onequext.com, always provide the complete hardware profile:',
      '• Property / Community Name',
      '• Building & Unit Number',
      '• Lock Model (BE467 Deadbolt or FE410 Interconnected)',
      '• Serial Number & MAC Address (from barcode sticker)',
      '• Reason for Deletion / Swap (Hardware replacement, test unit move, or pairing lockout)',
      'Quext Support Tier-2 specialists can purge the cloud lockup within minutes during standard field hours.',
    ],
    fieldTips: [
      'Use the one-click copyable email template provided in the guide below to submit tickets instantly.',
    ],
    category: 'support',
    badge: 'Escalation',
  },
];
