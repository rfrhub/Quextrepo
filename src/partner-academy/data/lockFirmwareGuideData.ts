export interface FirmwareSlide {
  slideNumber: number;
  title: string;
  category: 'Overview' | 'Important Notices' | 'Before You Start' | 'Updating Firmware' | 'Troubleshooting';
  description: string;
  image: string;
  bulletPoints?: string[];
}

export interface FirmwareGuideStep {
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
}

export const LOCK_FIRMWARE_METADATA = {
  title: 'Lock Firmware Guide',
  subtitle: 'Official In-Field Wireless Firmware Update Procedure',
  documentCode: 'QXT-GUIDE-FW-REV1',
  targetDevices: 'Schlage Control BE467 / FE410, XE360 Series (All Models), and NDEB / LE Commercial Levers',
  platform: 'Quext IoT Admin App · Bluetooth Low Energy (BLE)',
  supportEmail: 'support@onequext.com',
  ledBehavior: 'Alternating Green and Red Blinking for 5 - 10 Minutes',
  estimatedTime: '15 - 20 Minutes per Lock',
  latestFirmwareTarget: 'v05.20.03 (Recommended)',
  lastUpdated: 'November 2026',
};

export const LOCK_FIRMWARE_SLIDES: FirmwareSlide[] = [
  {
    slideNumber: 1,
    title: 'Lock Firmware Guide Overview',
    category: 'Overview',
    description: 'The following process applies to both BE, FE, XE360, and NDEB type locks.',
    image: '/assets/aistudio/firmware_guide_slides/slide_01.jpg',
    bulletPoints: [
      'Applicable Devices: BE467, FE410, XE360 (all models), and NDEB',
      'Over-the-Air Bluetooth Low Energy (BLE) firmware delivery via Quext IoT Admin app',
      'Eliminates lock audit anomalies, extends battery longevity, and updates cryptographic cipher suites',
    ],
  },
  {
    slideNumber: 2,
    title: 'Important Notices: Cellular Priority & Support',
    category: 'Important Notices',
    description: 'Ensure that you prioritize using cellular signal as your main method of communication to the Quext app unless under a poor service area for cellular coverage.',
    image: '/assets/aistudio/firmware_guide_slides/slide_02.jpg',
    bulletPoints: [
      'Prioritize cellular LTE / 5G signal over guest Wi-Fi',
      'Direct support channel: support@onequext.com',
      'Avoid switching network interfaces while firmware binary is downloading or uploading',
    ],
  },
  {
    slideNumber: 3,
    title: 'Important Notices: Turn Off Screen Auto-Lock',
    category: 'Important Notices',
    description: 'Ensure that your phone settings do not automatically lock your screen during firmware deployment.',
    image: '/assets/aistudio/firmware_guide_slides/slide_03.jpg',
    bulletPoints: [
      'Android: Open Settings → Security or Security and Privacy (on Samsung devices, tap Lock screen or Security and privacy first) → Screen lock or Screen lock type → Enter PIN, pattern, or password → Choose None or Swipe.',
      'iOS: Open Settings → Display & Brightness → Scroll down and tap on Auto-Lock → Select Never so screen stays on until you press the side button.',
    ],
  },
  {
    slideNumber: 4,
    title: 'Before You Start: App Verification',
    category: 'Before You Start',
    description: 'Double check you are using the Quext IOT Admin app (with the dark icon and cyan border), NOT the resident Quext IoT app.',
    image: '/assets/aistudio/firmware_guide_slides/slide_04.jpg',
    bulletPoints: [
      'Quext IoT Admin app (Green Checkmark): Dedicated enterprise installer app',
      'Quext IoT app (Red X): Resident-facing application lacking firmware update capabilities',
    ],
  },
  {
    slideNumber: 5,
    title: 'Before You Start: Login with Admin Credentials',
    category: 'Before You Start',
    description: 'Enter your email and password here. Agree to Privacy Policy, Terms of Use, and EULA, and tap Sign in.',
    image: '/assets/aistudio/firmware_guide_slides/slide_05.jpg',
    bulletPoints: [
      'Enter authorized installer email and password',
      'Acknowledge Privacy Policy, Terms of Use, and End User License Agreement',
      'Tap "Sign in" to access your assigned properties',
    ],
  },
  {
    slideNumber: 6,
    title: 'Updating Firmware: Tap the Service Gear Icon',
    category: 'Updating Firmware',
    description: 'Once logged in tap on the service gear icon located on the bottom navigation bar.',
    image: '/assets/aistudio/firmware_guide_slides/slide_06.jpg',
  },
  {
    slideNumber: 7,
    title: 'Updating Firmware: Select Lock Location',
    category: 'Updating Firmware',
    description: 'Select the location of your Lock (e.g., Amenities, Building 1, Homebase Office, or specific Unit number).',
    image: '/assets/aistudio/firmware_guide_slides/slide_07.jpg',
  },
  {
    slideNumber: 8,
    title: 'Updating Firmware: Tap the Three Dots (...)',
    category: 'Updating Firmware',
    description: 'Select your lock then tap on the three dots (...) in the top right corner of the lock profile card.',
    image: '/assets/aistudio/firmware_guide_slides/slide_08.jpg',
    bulletPoints: [
      'Verify lock serial number and battery voltage (must be ≥ 5.2V)',
      'Tap the "..." icon in the top right corner of the device card',
    ],
  },
  {
    slideNumber: 9,
    title: 'Updating Firmware: Select "Update firmware"',
    category: 'Updating Firmware',
    description: 'Select "Update firmware" from the context pop-up menu.',
    image: '/assets/aistudio/firmware_guide_slides/slide_09.jpg',
    bulletPoints: [
      'Options include: Read audits, Update firmware, Change location, Uninstall, Full delete',
      'Select "Update firmware" to launch the firmware update wizard',
    ],
  },
  {
    slideNumber: 10,
    title: 'Updating Firmware: Tap on "Selected version"',
    category: 'Updating Firmware',
    description: 'Review lock serial number and current version (e.g., 05.19.02). Tap on the "Selected version" row.',
    image: '/assets/aistudio/firmware_guide_slides/slide_10.jpg',
    bulletPoints: [
      'Current version displayed: e.g. 05.19.02',
      'Tap "Selected version >" to open the version picker',
    ],
  },
  {
    slideNumber: 11,
    title: 'Updating Firmware: Select Desired Firmware Version',
    category: 'Updating Firmware',
    description: 'Select Desired Firmware version from the bottom sheet selection modal (e.g., 05.20.03).',
    image: '/assets/aistudio/firmware_guide_slides/slide_11.jpg',
    bulletPoints: [
      'Choose the latest certified build (e.g., 05.20.03)',
      'Confirm selection to return to the firmware update screen',
    ],
  },
  {
    slideNumber: 12,
    title: 'Updating Firmware: Wait for Update to Complete',
    category: 'Updating Firmware',
    description: 'Tap "Update". Wait for Update to Complete. "To ensure a successful update, please stay on this screen until the update is complete."',
    image: '/assets/aistudio/firmware_guide_slides/slide_12.jpg',
    bulletPoints: [
      'Getting serial number: Done',
      'Getting security token: Done',
      'Downloading firmware: Done',
      'Checking bluetooth availability: Done',
      'Looking for the lock: Done',
      'Uploading firmware progress bar (e.g., 54% → 100%)',
      'Stay on this screen until the update reaches 100%!',
    ],
  },
  {
    slideNumber: 13,
    title: 'Updating Firmware: Physical Lock LED Behavior',
    category: 'Updating Firmware',
    description: 'The Lock will blink Green and Red for approximately 5 - 10 min. This ultimately depends on how old the current firmware the lock was previously on; expect longer times if the firmware is older.',
    image: '/assets/aistudio/firmware_guide_slides/slide_13.jpg',
    bulletPoints: [
      'Visual Confirmation: Lock exterior LED will blink Green and Red',
      'Duration: Approximately 5 to 10 minutes',
      'Time factor: Locks with older initial firmware take longer to flash',
      'Do NOT remove batteries or operate the lock while flashing is active',
    ],
  },
  {
    slideNumber: 14,
    title: 'Troubleshooting: What to Do If Credentials Missing',
    category: 'Troubleshooting',
    description: 'What to do if... I don\'t see my invite to the app or credentials I need? Contact Quext Support at support@onequext.com.',
    image: '/assets/aistudio/firmware_guide_slides/slide_14.jpg',
    bulletPoints: [
      'Contact Quext Support: support@onequext.com',
      'Quext Support can assist with getting you back on track with login issues and missing credentials!',
    ],
  },
];

export const LOCK_FIRMWARE_STEPS: FirmwareGuideStep[] = [
  {
    id: 'fw_step_01',
    stageNumber: 1,
    stageTitle: 'Mobile Environment & Phone Settings',
    stepNumber: 1,
    title: 'Disable Screen Auto-Lock & Prioritize Cellular',
    summary: 'Prevent OS sleep from terminating active BLE binary transfers and prioritize cellular signal.',
    instructions: [
      'iOS: Go to Settings → Display & Brightness → Auto-Lock → Select "Never".',
      'Android: Go to Settings → Security & Privacy → Screen lock → Choose "None" or "Swipe".',
      'Disconnect from unstable guest Wi-Fi and verify LTE / 5G cellular connection is active.',
      'Confirm battery level of installer mobile phone is above 50% or connected to portable battery pack.',
    ],
    fieldTips: [
      'If the phone screen turns off during the BLE upload phase (Slide 12), the transfer socket drops and must be restarted.',
    ],
    criticalWarning: 'Never initiate firmware updates on low phone battery or unstable Wi-Fi connections.',
    badge: 'Phone Prep',
  },
  {
    id: 'fw_step_02',
    stageNumber: 1,
    stageTitle: 'Mobile Environment & Phone Settings',
    stepNumber: 2,
    title: 'Verify Quext IoT Admin Enterprise App',
    summary: 'Ensure you are authenticated in Quext IoT Admin and NOT the resident app.',
    instructions: [
      'Confirm the app icon features the dark background with cyan square frame ("Quext IoT Admin").',
      'Enter your certified technician credentials and password.',
      'Check the legal EULA and Privacy Policy acknowledgement checkbox.',
      'Tap "Sign in" to access your assigned property communities.',
    ],
    fieldTips: [
      'If you cannot see your assigned properties or the app says credentials invalid, email support@onequext.com immediately.',
    ],
    badge: 'App Verification',
  },
  {
    id: 'fw_step_03',
    stageNumber: 2,
    stageTitle: 'Lock Selection & Navigation',
    stepNumber: 3,
    title: 'Navigate to Lock in Quext IoT Admin',
    summary: 'Open the Service tab, select property hierarchy, and open the lock profile.',
    instructions: [
      'Tap the "Service" gear icon on the bottom navigation bar.',
      'Drill down to the specific lock location: Community → Building → Unit or Common Area door.',
      'Select the lock card from the device list.',
      'Confirm lock battery voltage is displayed and exceeds 5.2V before attempting flashing.',
    ],
    fieldTips: [
      'If battery voltage is under 5.0V, replace 4x AA alkaline batteries first to prevent flash memory write failures.',
    ],
    badge: 'Device Selection',
  },
  {
    id: 'fw_step_04',
    stageNumber: 2,
    stageTitle: 'Lock Selection & Navigation',
    stepNumber: 4,
    title: 'Open Three Dots Menu & Select "Update firmware"',
    summary: 'Access the administrative device context menu to launch the firmware upgrade wizard.',
    instructions: [
      'Tap the three dots (...) icon in the upper-right corner of the lock profile card.',
      'In the pop-up context menu (Read audits, Update firmware, Change location, Uninstall, Full delete), select "Update firmware".',
      'The "Firmware update" screen will display the Lock Serial Number and Current Version (e.g., 05.19.02).',
    ],
    fieldTips: [
      'Do NOT tap "Full delete" or "Uninstall" unless instructed by Quext Tier-2 Engineering.',
    ],
    badge: 'Context Menu',
  },
  {
    id: 'fw_step_05',
    stageNumber: 3,
    stageTitle: 'Version Selection & Firmware Flashing',
    stepNumber: 5,
    title: 'Select Target Firmware Version & Begin Upload',
    summary: 'Choose the latest certified build and upload over Bluetooth Low Energy.',
    instructions: [
      'Tap on the "Selected version" row (e.g., showing current 05.19.02 and arrow).',
      'In the bottom-sheet selection modal, choose the desired firmware version (e.g., 05.20.03).',
      'Tap the black "Update" button at the bottom of the screen.',
      'Stand within 3 to 5 feet of the lock while the app completes automated checks:',
      '  ✓ Getting serial number',
      '  ✓ Getting security token',
      '  ✓ Downloading firmware',
      '  ✓ Checking bluetooth availability',
      '  ✓ Looking for the lock',
      '  ✓ Uploading firmware (Progress: 0% → 100%)',
    ],
    fieldTips: [
      'To ensure a successful update, stay on this screen until the progress bar reaches 100%. Do not switch apps!',
    ],
    criticalWarning: 'Do NOT background the Quext IoT Admin app or navigate away during the "Uploading firmware" stage.',
    badge: 'BLE Upload',
  },
  {
    id: 'fw_step_06',
    stageNumber: 3,
    stageTitle: 'Version Selection & Firmware Flashing',
    stepNumber: 6,
    title: 'Monitor 5-10 Min Green/Red Blinking & Verify Completion',
    summary: 'Observe the physical lock LED sequence and confirm successful firmware reboot.',
    instructions: [
      'Once the mobile app finishes the upload, the lock will enter its internal flashing and verification cycle.',
      'The exterior LED indicator will BLINK GREEN AND RED continuously for 5 to 10 minutes.',
      'Locks with older prior firmware require longer rewrite windows—allow up to 10 full minutes.',
      'Once the blinking stops, the lock will issue a single confirmation tone.',
      'In the Quext Admin app, navigate back to the lock card and tap "Sync" to refresh telemetry.',
      'Verify the "FW version (main)" and "FW version (lock)" now report the new version (e.g., 05.20.03).',
      'Perform a physical key toggle and mobile app unlock test to verify complete operation.',
    ],
    fieldTips: [
      'Never pull batteries while the LED is blinking Green and Red! Interrupted flash can brick the onboard EEPROM.',
    ],
    criticalWarning: 'DO NOT INTERRUPT: The 5-10 minute Green/Red flashing cycle must complete without disturbance.',
    badge: 'LED Verification',
  },
];
