export interface WalletGuideStep {
  number: string;
  title: string;
  action: string;
  note?: string;
  badge?: string;
}

export interface WalletGuideCard {
  title: string;
  description: string;
  tag?: string;
  icon?: string;
  details?: string[];
}

export interface WalletGuidePage {
  pageNumber: number;
  id: string;
  sectionTag: string;
  title: string;
  subtitle: string;
  phase?: 'PREP' | 'CONFIG' | 'VERIFY' | 'SYNC' | 'ROLLOUT' | 'SUPPORT';
  contentSummary?: string;
  badgeText?: string;
  importantNote?: string;
  cards?: WalletGuideCard[];
  steps?: WalletGuideStep[];
  troubleshooting?: Array<{
    issue: string;
    fix: string;
  }>;
  visualType: 
    | 'cover_hero'
    | 'tech_requirements'
    | 'process_flow'
    | 'preinstall_checklist'
    | 'setup_device'
    | 'power_cycle_lock'
    | 'scan_config_card'
    | 'test_nfc_response'
    | 'sync_credentials'
    | 'handling_rcs'
    | 'rolling_out_residents'
    | 'resident_experience'
    | 'feature_overview'
    | 'feature_spotlight_power'
    | 'hardware_gallery'
    | 'troubleshooting_matrix'
    | 'back_cover';
}

export const WALLET_GUIDE_METADATA = {
  documentTitle: 'Wallet Upgrade: Field Installation Guide',
  subtitle: 'EXISTING ALLEGION & SCHLAGE HARDWARE',
  description: 'Complete requirements, configuration, validation, synchronization, resident rollout, and troubleshooting guidance.',
  version: 'v2.4 - Official Field Edition',
  reference: 'onequext.com · help.quext.io',
  brand: 'QUEXT / SMART COMMUNITY',
  totalPages: 17
};

export const WALLET_GUIDE_PAGES: WalletGuidePage[] = [
  // PAGE 1: COVER
  {
    pageNumber: 1,
    id: 'page_01_cover',
    sectionTag: 'STEP-BY-STEP GUIDE',
    title: 'Wallet Upgrade: Field Installation Guide',
    subtitle: 'EXISTING ALLEGION & SCHLAGE HARDWARE',
    phase: 'PREP',
    contentSummary: 'Complete requirements, configuration, validation, synchronization, resident rollout, and troubleshooting guidance for Apple & Google Wallet mobile credentials on existing Allegion & Schlage lock hardware.',
    visualType: 'cover_hero'
  },

  // PAGE 2: BEFORE YOU START
  {
    pageNumber: 2,
    id: 'page_02_tech_reqs',
    sectionTag: 'BEFORE YOU START',
    title: 'Technical Requirements & Compatibility',
    subtitle: 'Verify ecosystem hardware prerequisites prior to field deployment.',
    phase: 'PREP',
    importantNote: 'Every lock must be on supported firmware before Wallet rollout. Allow approximately 10 minutes per lock for firmware upgrades. Update every Allegion/Schlage lock, including RCs.',
    contentSummary: 'Hardware, mobile operating system, firmware, and provisioning requirements for enabling Apple Wallet and Google Wallet NFC credentials.',
    cards: [
      {
        title: 'SUPPORTED DEVICES',
        description: 'iOS and Android smartphones, Apple Watch, and Wear OS devices with NFC enabled.',
        tag: 'MOBILE & WEARABLE'
      },
      {
        title: 'MOBILE OS',
        description: 'Latest Apple Wallet and Google Wallet apps required with active operating system support.',
        tag: 'SOFTWARE'
      },
      {
        title: 'LOCK HARDWARE',
        description: 'Allegion NFC-capable locks (Schlage Control, NDEB, LEB), including all Reader Controllers (RCs).',
        tag: 'HARDWARE'
      },
      {
        title: 'FIRMWARE',
        description: 'Latest supported firmware required for credential compatibility and NFC encryption keys.',
        tag: 'FIRMWARE'
      },
      {
        title: 'PROVISIONING',
        description: 'Property-specific NFC Configuration Card required for each lock to inject master keys.',
        tag: 'CREDENTIAL'
      },
      {
        title: 'SYNC',
        description: 'Thermostat hub auto-syncs over-the-air; otherwise perform manual sync via Quext App.',
        tag: 'NETWORK'
      }
    ],
    visualType: 'tech_requirements'
  },

  // PAGE 3: OVERVIEW: THE UPGRADE PROCESS
  {
    pageNumber: 3,
    id: 'page_03_process_overview',
    sectionTag: 'PROCESS FLOW',
    title: 'Overview: The Upgrade Process',
    subtitle: 'We are enabling the "Wallet" feature on your existing locks. No hardware replacement is required.',
    phase: 'CONFIG',
    contentSummary: 'The 4-phase non-destructive upgrade path: Prep test user, Power cycle & scan config card, Verify NFC handshake, and Sync lock data.',
    steps: [
      {
        number: '01',
        title: 'Prep',
        action: 'Enable Wallet for the installer / test user in Quext profile',
        badge: 'PREREQUISITE'
      },
      {
        number: '02',
        title: 'Config',
        action: 'Power cycle lock & scan property NFC Configuration Card within 60s',
        badge: 'HARDWARE SCAN'
      },
      {
        number: '03',
        title: 'Verify',
        action: 'Test NFC handshake with mobile smartphone or Apple Watch',
        badge: 'FIELD VALIDATE'
      },
      {
        number: '04',
        title: 'Sync',
        action: 'Update lock credential cache automatically via Hub or Quext App',
        badge: 'FINAL ACTIVATION'
      }
    ],
    visualType: 'process_flow'
  },

  // PAGE 4: PREINSTALL CHECKLIST
  {
    pageNumber: 4,
    id: 'page_04_preinstall_checklist',
    sectionTag: 'PREINSTALLATION',
    title: 'Preinstall Checklist',
    subtitle: 'Ensure you have these items in hand before heading to the first unit door.',
    phase: 'PREP',
    contentSummary: 'Mandatory tools and credentials required on-site before initiating lock power cycles and NFC configuration card scanning.',
    cards: [
      {
        title: 'NFC Configuration Card',
        description: 'Commissioned by Allegion specifically for this property. Contains cryptographic property keys. If missing, contact Quext support immediately.',
        tag: 'PHYSICAL CARD'
      },
      {
        title: 'Supported Hardware',
        description: 'Confirm locks are supported Schlage commercial/residential models (Schlage Control BE467/FE285, NDEB, LEB) and approved by Quext.',
        tag: 'COMPATIBILITY'
      },
      {
        title: 'Installer Credential',
        description: 'Your smartphone must have an active Quext Wallet credential pass loaded in Apple Wallet or Google Wallet ready for tap testing.',
        tag: 'WALLET PASS'
      }
    ],
    visualType: 'preinstall_checklist'
  },

  // PAGE 5: 1. SETUP YOUR TESTING DEVICE
  {
    pageNumber: 5,
    id: 'page_05_setup_device',
    sectionTag: 'STEP 1',
    title: '1. Setup Your Testing Device',
    subtitle: 'Configure your installer smartphone with an active digital NFC wallet pass.',
    phase: 'PREP',
    importantNote: 'You cannot test the installation without a valid credential on your own device.',
    steps: [
      {
        number: '1',
        title: 'Open Quext Mobile App',
        action: 'Launch the Quext mobile app on your smartphone and navigate to your user profile settings.'
      },
      {
        number: '2',
        title: 'Enable Wallet Credential',
        action: 'Ensure the "Wallet" credential type toggle is enabled under your digital key settings.'
      },
      {
        number: '3',
        title: 'Add to Apple / Google Wallet',
        action: 'Tap the "Add to Apple Wallet" or "Add to Google Wallet" button and follow the operating system prompts.'
      },
      {
        number: '4',
        title: 'Verify Pass in Wallet App',
        action: 'Open your native Wallet app and confirm the branded Quext Community Pass is active with Express Mode enabled.'
      }
    ],
    visualType: 'setup_device'
  },

  // PAGE 6: 2. POWER CYCLE THE LOCK
  {
    pageNumber: 6,
    id: 'page_06_power_cycle',
    sectionTag: 'STEP 2',
    title: '2. Power Cycle The Lock',
    subtitle: 'The lock must be rebooted into pairing mode to accept the new NFC configuration.',
    phase: 'CONFIG',
    importantNote: 'Note: For Reader Controllers (RCs), momentarily disconnect main 12V/24V power or flip the breaker.',
    steps: [
      {
        number: '1',
        title: 'Remove Battery Cover',
        action: 'Remove the interior escutcheon battery cover located on the secure interior side of the door.'
      },
      {
        number: '2',
        title: 'Disconnect Power',
        action: 'Remove one AA alkaline battery (or disconnect the 4-AA battery pack harness).'
      },
      {
        number: '3',
        title: 'Discharge Capacitors',
        action: 'Wait 5 seconds to ensure the lock internal microcontroller completely discharges.'
      },
      {
        number: '4',
        title: 'Reinsert Battery',
        action: 'Reinsert the battery. The lock will emit an initialization LED sequence and start a 60-second config window.'
      }
    ],
    visualType: 'power_cycle_lock'
  },

  // PAGE 7: 3. SCAN CONFIGURATION CARD
  {
    pageNumber: 7,
    id: 'page_07_scan_config_card',
    sectionTag: 'STEP 3',
    title: '3. Scan Configuration Card',
    subtitle: 'This step activates NFC recognition and writes the property security domain to the hardware.',
    phase: 'CONFIG',
    importantNote: 'CRITICAL TIMING: Perform this step within 60 seconds of reinserting the battery.',
    steps: [
      {
        number: '1',
        title: 'Present NFC Card',
        action: 'Hold the property-specific NFC Configuration Card flat against the exterior lock reader face.'
      },
      {
        number: '2',
        title: 'Maintain Contact',
        action: 'Keep the card stationary for 2 to 3 seconds until the cryptographic handshake completes.'
      },
      {
        number: '3',
        title: 'Confirm Feedback',
        action: 'Listen for a distinct confirmation beep and observe the lock LED flash green/amber.'
      }
    ],
    visualType: 'scan_config_card'
  },

  // PAGE 8: 4. TEST FOR NFC RESPONSE
  {
    pageNumber: 8,
    id: 'page_08_test_nfc_response',
    sectionTag: 'STEP 4',
    title: '4. Test For NFC Response',
    subtitle: 'Verify the lock creates a secure digital handshake with your mobile device.',
    phase: 'VERIFY',
    importantNote: 'Important: The door may not unlock yet. This is normal. As long as the phone reacts and brings up the Wallet pass, the NFC upgrade is complete.',
    steps: [
      {
        number: '1',
        title: 'Tap Phone to Lock',
        action: 'Hold your iPhone or Android smartphone near the top portion of the lock face reader.'
      },
      {
        number: '2',
        title: 'Observe Wallet Pass',
        action: 'Success Indicator: Your Quext Wallet Pass should automatically trigger on screen (Express Mode).'
      },
      {
        number: '3',
        title: 'Verify Recognition',
        action: 'The lock reader light will illuminate, confirming the NFC reader firmware is successfully active.'
      }
    ],
    visualType: 'test_nfc_response'
  },

  // PAGE 9: 5. SYNC TO ENABLE CREDENTIALS
  {
    pageNumber: 9,
    id: 'page_09_sync_credentials',
    sectionTag: 'STEP 5',
    title: '5. Sync To Enable Credentials',
    subtitle: 'For the key to unlock the latch, the lock must download the latest authorized access table.',
    phase: 'SYNC',
    importantNote: 'Final Test: Tap your phone again after sync. The lock will flash GREEN and the motorized deadbolt will retract.',
    cards: [
      {
        title: 'Method A: Automatic (Thermostat Hub)',
        description: 'If the unit contains an active Quext Thermostat Hub, the lock will automatically sync over-the-air within 30 to 180 seconds via LoRaWAN / BLE gateway.',
        tag: 'RECOMMENDED / ZERO-TOUCH'
      },
      {
        title: 'Method B: Manual (Quext App Sync)',
        description: 'Open the Quext mobile app, navigate to the specific lock detail screen, and tap "Sync Lock Data" to push credential keys directly via Bluetooth.',
        tag: 'BLE DIRECT SYNC'
      }
    ],
    visualType: 'sync_credentials'
  },

  // PAGE 10: HANDLING RCS (READER CONTROLLERS)
  {
    pageNumber: 10,
    id: 'page_10_handling_rcs',
    sectionTag: 'PERIMETER ACCESS',
    title: 'Handling Reader Controllers (RCs)',
    subtitle: 'The upgrade process for perimeter gates, amenity doors, and elevators is identical to unit locks.',
    phase: 'CONFIG',
    contentSummary: 'Standard operating procedure for upgrading hardwired Allegion RC card readers controlling electric strikes, magnetic locks, and elevator relays.',
    steps: [
      {
        number: '1',
        title: 'Power Cycle',
        action: 'Turn the RC power off and back on (disconnect 12V/24V power terminal or toggle the dedicated circuit breaker).'
      },
      {
        number: '2',
        title: 'Scan Card',
        action: 'Present the property NFC Configuration Card to the RC reader lens within 60 seconds of reboot.'
      },
      {
        number: '3',
        title: 'Test Response',
        action: 'Tap your smartphone to the reader face to confirm the Quext Wallet pass immediately displays.'
      },
      {
        number: '4',
        title: 'Sync Platform',
        action: 'Ensure the RC device is synced through the Quext cloud portal or local gateway controller.'
      }
    ],
    visualType: 'handling_rcs'
  },

  // PAGE 11: ROLLING OUT TO RESIDENTS
  {
    pageNumber: 11,
    id: 'page_11_rolling_out',
    sectionTag: 'COMMUNITY ROLLOUT',
    title: 'Rolling Out to Residents',
    subtitle: 'Strict sequence protocol for enabling resident-facing mobile digital keys.',
    phase: 'ROLLOUT',
    importantNote: 'CRITICAL WARNING: Do not enable the Wallet feature for residents in the Quext portal until ALL locks on property have been physically upgraded and verified.',
    steps: [
      {
        number: '1',
        title: 'Complete 100% Upgrades',
        action: 'Complete the physical card scan and NFC verification on all apartment unit doors and common area amenity readers.'
      },
      {
        number: '2',
        title: 'Quext Backend Activation',
        action: 'The Quext operations team flips the community-wide "Apple & Google Wallet" feature toggle to ACTIVE in the cloud backend.'
      },
      {
        number: '3',
        title: 'Resident In-App Prompt',
        action: 'Residents automatically receive a native in-app modal prompt to "Add Digital Key to Wallet" upon their next app launch.'
      }
    ],
    visualType: 'rolling_out_residents'
  },

  // PAGE 12: THE RESIDENT EXPERIENCE
  {
    pageNumber: 12,
    id: 'page_12_resident_experience',
    sectionTag: 'USER JOURNEY',
    title: 'The Resident Experience',
    subtitle: 'Effortless resident onboarding with zero friction and instant tap-to-unlock access.',
    phase: 'ROLLOUT',
    contentSummary: 'The end-to-end resident activation sequence from initial in-app prompt to Express Mode door access.',
    steps: [
      {
        number: '01',
        title: 'Wallet Prompt',
        action: 'Resident opens Quext app and sees "Your Wallet Pass is Ready" banner with one-tap setup.'
      },
      {
        number: '02',
        title: 'Generate Pass',
        action: 'System securely provisions cryptographic credentials signed by Apple & Google servers.'
      },
      {
        number: '03',
        title: 'Add to Wallet',
        action: 'Resident taps "Add to Apple Wallet" / "Add to Google Wallet" with biometric confirmation.'
      },
      {
        number: '04',
        title: 'Tap to Unlock',
        action: 'Express Mode allows instant door access simply by holding the device near the lock—no app opening required.'
      }
    ],
    visualType: 'resident_experience'
  },

  // PAGE 13: FEATURE OVERVIEW
  {
    pageNumber: 13,
    id: 'page_13_feature_overview',
    sectionTag: 'PLATFORM CAPABILITIES',
    title: 'Feature Overview: Smart Wallet Ecosystem',
    subtitle: 'Next-generation access control built on native operating system security.',
    phase: 'SUPPORT',
    cards: [
      {
        title: 'Works 100% Offline',
        description: 'Locks and devices validate cryptographically even during complete internet or cellular outages.',
        tag: 'OFFLINE RESILIENT'
      },
      {
        title: 'Express Mode (No App Opening)',
        description: 'Residents tap phone or Apple Watch against the lock without waking the screen or unlocking FaceID.',
        tag: 'ZERO FRICTION'
      },
      {
        title: 'Wearable & Phone Support',
        description: 'Native compatibility across iPhone, Apple Watch, Android phones, and Wear OS smartwatches.',
        tag: 'MULTI-DEVICE'
      },
      {
        title: 'Instant Access Configuration',
        description: 'Digital keys provision or revoke dynamically in real-time from the Quext property portal.',
        tag: 'CLOUD SYNC'
      },
      {
        title: 'Custom Branded Wallet Artwork',
        description: 'High-resolution property branding with resident name, unit number, and access credentials.',
        tag: 'PROPERTY BRANDING'
      },
      {
        title: 'Enhanced Security & Audit Logs',
        description: 'End-to-end hardware encryption with secure element chip isolation and tamper audit trails.',
        tag: 'BANK-GRADE SECURITY'
      }
    ],
    visualType: 'feature_overview'
  },

  // PAGE 14: FEATURE SPOTLIGHT: DEAD PHONE FRIENDLY
  {
    pageNumber: 14,
    id: 'page_14_feature_spotlight',
    sectionTag: 'FEATURE SPOTLIGHT',
    title: 'Dead Phone Friendly: Power Reserve',
    subtitle: 'Residents are never locked out, even when their smartphone battery is completely drained.',
    phase: 'SUPPORT',
    contentSummary: 'Apple Express Mode with Power Reserve keeps digital keys functional for up to 5 hours after the iPhone battery indicates low power.',
    importantNote: 'Express mode works for up to 5 hours while the phone is in power reserve mode. "Express cards and keys available" will display on the black screen.',
    visualType: 'feature_spotlight_power'
  },

  // PAGE 15: HARDWARE GALLERY
  {
    pageNumber: 15,
    id: 'page_15_hardware_gallery',
    sectionTag: 'HARDWARE ARCHITECTURE',
    title: 'Architectural Lock Integration',
    subtitle: 'Schlage Control Smart Deadbolt with integrated Allegion NFC credential reader.',
    phase: 'SUPPORT',
    contentSummary: 'Sleek, commercial-grade architectural lock hardware engineered for multifamily smart community reliability and durability.',
    visualType: 'hardware_gallery'
  },

  // PAGE 16: TROUBLESHOOTING & TIPS
  {
    pageNumber: 16,
    id: 'page_16_troubleshooting',
    sectionTag: 'DIAGNOSTICS',
    title: 'Troubleshooting & Rapid Field Tips',
    subtitle: 'Instant solutions for common field installation and commissioning scenarios.',
    phase: 'SUPPORT',
    troubleshooting: [
      {
        issue: "Phone doesn't react when tapped to lock.",
        fix: 'The NFC configuration scan timed out or failed. Remove one battery, wait 5 seconds, reinsert, and scan the NFC Configuration Card again immediately (must occur within 60 seconds).'
      },
      {
        issue: "Phone reacts and brings up pass, but door won't unlock.",
        fix: "The lock has NFC reader firmware enabled, but has not downloaded the latest credential table. Perform a manual Bluetooth sync in the Quext mobile app or allow 2 minutes for the Thermostat Hub over-the-air sync."
      },
      {
        issue: "Apple Watch or Wear OS device isn't unlocking the door.",
        fix: 'Ensure the watch is actively paired to the primary phone and that the Quext Wallet Pass is mirrored in the Watch app with Express Mode toggled ON.'
      }
    ],
    visualType: 'troubleshooting_matrix'
  },

  // PAGE 17: BACK COVER & SUPPORT
  {
    pageNumber: 17,
    id: 'page_17_support_back',
    sectionTag: 'SUPPORT ESCALATION',
    title: 'Need Help? 24/7 Field Support',
    subtitle: 'Dedicated Quext engineering and installer support lines.',
    phase: 'SUPPORT',
    contentSummary: 'Chat with Quext technical support anytime through the Quext mobile app or access the online field operations portal at help.quext.io.',
    visualType: 'back_cover'
  }
];
