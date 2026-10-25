export interface PortalGuideScreenshot {
  type: 
    | 'property_tree'
    | 'portal_login'
    | 'staff_management'
    | 'issue_staff_vendor_keys'
    | 'temporary_access'
    | 'pin_code_access'
    | 'key_fob_distribution'
    | 'gateway_status'
    | 'hvac_config'
    | 'access_wallet'
    | 'device_report_export'
    | 'support_modal';
  caption: string;
  uiTitle: string;
  urlPath: string;
}

export interface PortalGuideChapter {
  id: string;
  chapterNumber: number;
  title: string;
  shortTitle: string;
  readTime: string;
  description: string;
  category: 'auth' | 'infrastructure' | 'hvac' | 'access' | 'diagnostics' | 'troubleshooting';
  screenshot?: PortalGuideScreenshot;
  sections: {
    id: string;
    title: string;
    content: string[];
    steps?: { stepNumber: number; title: string; detail: string; warning?: string; tip?: string }[];
    table?: { headers: string[]; rows: string[][] };
    codeOrConfig?: { label: string; snippet: string };
    keyTakeaway?: string;
    needHelpCallout?: string;
  }[];
}

export const PORTAL_GUIDE_METADATA = {
  documentTitle: "Quext Portal (quext.io) Installer Field Operations & Device Provisioning Manual",
  version: "v4.4.0 - Master Field Edition",
  effectiveDate: "March 2026",
  docRef: "QXT-PRT-MAN-2026-V4.4",
  portalUrl: "https://quext.io",
  helpCenterUrl: "https://help.quext.io",
  supportEmail: "support@onequext.com",
  supportPhone: "1-800-798-8319 (1-800-QXT-HELP)",
  targetAudience: "Certified Partner Technicians, Field Deployment Specialists, System Integrators, Property Leads",
  summary: "Comprehensive master reference manual for property hierarchy, portal login, staff & user onboarding, issuing digital/virtual/fob keys, scheduling temporary vendor access, PIN code assignment, gateway verification, HVAC profiles, device reports, and technical troubleshooting."
};

export const PORTAL_GUIDE_CHAPTERS: PortalGuideChapter[] = [
  // SECTION 1: Community Hierarchy (Moved from Page 3 to Page 1)
  {
    id: 'ch1_property_hierarchy',
    chapterNumber: 1,
    title: 'Property & Community Hierarchy Mapping',
    shortTitle: 'Community Hierarchy',
    readTime: '4 min',
    category: 'infrastructure',
    description: 'Understanding how Quext organizes ownership groups, properties, common spaces, and residential units.',
    screenshot: {
      type: 'property_tree',
      caption: 'Quext.io Community Spatial Tree: Ownership -> Property -> Amenities -> Units',
      uiTitle: 'Quext IoT Portal · Property Structure Navigator',
      urlPath: 'https://quext.io/properties/1042/structure'
    },
    sections: [
      {
        id: 'sec1_1',
        title: '1.1 Community Hierarchy',
        content: [
          'Every physical multifamily asset is represented in the Quext Portal through a standardized nested relational structure. Understanding this hierarchy ensures hardware is mapped to the exact physical room and circuit.'
        ],
        table: {
          headers: ['Hierarchy Level', 'Entity Description', 'Supported Hardware & Devices'],
          rows: [
            ['Tier 1: Community/ Ownership', 'The overall ownership group or management company.', 'N/A'],
            ['Tier 2: Building / Property', 'Physical structure with assigned street address', 'Cellular Gateways, Hubs, Bridges'],
            ['Tier 3: Common Areas & Amenities', 'Shared spaces (Clubhouse, Fitness Center, Pool Gate)', "RC's Card readers, XE360, NDE BE/ FE locks, PDK, Dormakaba, Butterfly,"],
            ['Tier 4: Residential Units', 'Individual tenant apartments (e.g. Unit 304, Unit PH-2)', 'Quext Smart Thermostats, Schlage Control locks (BE467F/FE410), Water Leak Sensors']
          ]
        }
      },
      {
        id: 'sec1_2',
        title: '1.2 Navigating the Units Dashboard & Status Badges',
        content: [
          'Inside the Community view, the "Units" tab displays a real-time list of all mapped apartment units. Each unit row shows color-coded operational indicators for rapid visual inspection during deployment walk-throughs.',
          '• Green (Online / Healthy): All mapped hardware devices have reported telemetry within the last 15-minute heartbeat cycle with battery > 30% and RSSI > -110 dBm.',
          '• Yellow (Warning / Attention Required): Device battery is below 25%, or one secondary sensor has missed 2 consecutive check-ins.',
          '• Red (Offline / Critical Error): Thermostat or Primary Entry Lock is disconnected from the LoRaWAN gateway for > 60 minutes.',
          '• Gray (Unprovisioned): Unit space exists in the property blueprint but has no assigned hardware serials.'
        ]
      }
    ]
  },

  // SECTION 2: Portal Access, Authentication & Organization Scope (Page 2)
  {
    id: 'ch2_portal_access',
    chapterNumber: 2,
    title: 'Portal Access, Authentication & Organization Scope',
    shortTitle: 'Access & Roles',
    readTime: '3 min',
    category: 'auth',
    description: 'Accessing the Quext IoT Portal (quext.io), technician authentication, multi-factor verification, and property scoping.',
    screenshot: {
      type: 'portal_login',
      caption: 'Quext.io Installer Portal Authentication & Community Switcher Interface',
      uiTitle: 'Quext IoT Management Portal · Sign In',
      urlPath: 'https://quext.io/login'
    },
    sections: [
      {
        id: 'sec2_1',
        title: '2.1 System Architecture & Portal Entry Points',
        content: [
          'The Quext IoT Management Platform provides a unified cloud interface for property managers, installers, and service technicians. Technicians utilize the installer scope to commission devices, inspect gateway backhauls, and execute hardware health checks without disrupting resident privacy controls.',
          'All field technicians must maintain active credentials provisioned by their authorized partner company administrator. Quext enforces role-based access control (RBAC) to ensure installers only access properties currently assigned to their active work orders.'
        ],
        table: {
          headers: ['Portal URL / App', 'Target Persona', 'Key Operations & Permissions'],
          rows: [
            ['quext.io', 'Installers & Techs', 'Device verification, gateway status checks, HVAC profiles, lock pairing, device reports'],
            ['Quext IoT Admin Mobile App', 'Field Technicians', 'Barcode/QR scanning, Bluetooth pairing, instantaneous unit mapping'],
            ['Quext Resident App', 'Multifamily Residents', 'Keyless entry, thermostat setpoint adjustments, resident guest passes (NEVER use for installs)']
          ]
        },
        keyTakeaway: 'Always perform field commissioning inside the Quext IoT Admin portal/app. Never use the resident app for device claiming.'
      },
      {
        id: 'sec2_2',
        title: '2.2 Logging In & Property Portfolio Selection',
        content: [
          'Follow the standardized authentication sequence to access the Quext portal:'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to the Portal',
            detail: 'Open your web browser (Chrome, Edge, or Safari recommended) to https://quext.io.'
          },
          {
            stepNumber: 2,
            title: 'Enter Certified Installer Credentials',
            detail: 'Input your company-assigned corporate email address and secure password. Click "Sign In".'
          },
          {
            stepNumber: 3,
            title: 'Multi-Factor Verification (MFA)',
            detail: 'Enter the 6-digit one-time passcode generated by your authenticator app or received via SMS/Email.',
            warning: 'If you fail MFA 5 times consecutively, your account enters a 15-minute cooldown. Contact support@onequext.com if locked.'
          },
          {
            stepNumber: 4,
            title: 'Select Active Community / Property',
            detail: 'Click the Property Selector dropdown in the top navigation header. Search for the assigned property name or ID.'
          }
        ]
      }
    ]
  },

  // SECTION 3: Staff Management: Creating a New Staff User (Page 3)
  {
    id: 'ch3_staff_user_create',
    chapterNumber: 3,
    title: 'Staff Management: Creating a New Staff User',
    shortTitle: 'Staff Management',
    readTime: '3 min',
    category: 'auth',
    description: 'Step-by-step instructions for adding staff members, configuring role permissions, assigning property portfolio scope, and issuing portal access credentials.',
    screenshot: {
      type: 'staff_management',
      caption: 'Quext.io Portal: Staff Management > Add New Staff User & Role Permissions',
      uiTitle: 'Quext IoT Portal · Staff > Create New Staff User',
      urlPath: 'https://quext.io/staff/new'
    },
    sections: [
      {
        id: 'sec3_1',
        title: '3.1 Creating a New Staff User in the Quext Portal',
        content: [
          'Property administrators and certified team leads can create and manage staff user accounts directly from the Quext Portal. Provisioning new staff members grants them the necessary credentials and role-based permissions to operate within designated properties, commission IoT devices, and manage access privileges.'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to the Staff Tab',
            detail: 'From the left-hand navigation sidebar in the Quext Portal, click on "Staff" (or "Users & Staff").'
          },
          {
            stepNumber: 2,
            title: 'Click "+ Add Staff"',
            detail: 'Click the "+ Add Staff" (or "Create Staff User") button located in the top-right corner of the Staff dashboard.'
          },
          {
            stepNumber: 3,
            title: 'Enter Staff Profile Information',
            detail: 'Complete the required user profile fields: First Name, Last Name, Corporate Email Address, and Mobile Phone Number (used for identity verification and multi-factor authentication).'
          },
          {
            stepNumber: 4,
            title: 'Assign Role & Permissions',
            detail: 'Select the appropriate permission tier for the user (e.g., Certified Field Installer, Maintenance Technician, Property Manager, or Leasing Agent).'
          },
          {
            stepNumber: 5,
            title: 'Select Property / Community Portfolio',
            detail: 'Assign the user to their designated property or community portfolio. For multi-property teams, specify all authorized communities.'
          },
          {
            stepNumber: 6,
            title: 'Save and Dispatch Activation Invite',
            detail: 'Click "Save" or "Create User". The Quext system automatically sends an email invitation with a secure link for the staff member to complete account setup and establish their password.'
          }
        ]
      },
      {
        id: 'sec3_2',
        title: '3.2 Staff Role Permissions & Credential Matrix',
        content: [
          'Assigning the correct role ensures technicians and team members have full access to necessary hardware commissioning tools without exposing unauthorized administrative or resident privacy controls.'
        ],
        table: {
          headers: ['Role / Permission Level', 'Operational Capabilities', 'Recommended Use Case'],
          rows: [
            ['Certified Field Installer', 'Device claiming, Gateway inspection, LoRaWAN RSSI telemetry, HVAC config, Device Report export', 'Third-party installation partners & field technicians'],
            ['Maintenance Technician', 'Thermostat setpoints, unit lock diagnostics, battery replacements, maintenance unlock keys', 'On-site maintenance teams & facility engineers'],
            ['Property / Community Manager', 'Full property dashboard, resident management, staff user creation, access schedules, audit logs', 'On-site property management & leasing directors'],
            ['Ownership / Portfolio Admin', 'Cross-property analytics, portfolio hierarchy, hardware asset tracking, billing sign-offs', 'Asset managers, regional directors & corporate ownership']
          ]
        },
        keyTakeaway: 'Staff members must click the activation link in their welcome email within 48 hours to set up their password and enable Multi-Factor Authentication (MFA).',
        needHelpCallout: 'NEED HELP?: Reach out to support@onequext.com or your Project manager for any assistance with the above.'
      }
    ]
  },

  // SECTION 4: Staff - Issue Staff / Vendor Keys (Page 4)
  // Ref: https://help.quext.io/en/articles/10149509-staff-issue-staff-vendor-keys
  {
    id: 'ch4_issue_staff_vendor_keys',
    chapterNumber: 4,
    title: 'Staff Management: Issuing Staff & Vendor Keys',
    shortTitle: 'Issue Staff Keys',
    readTime: '4 min',
    category: 'access',
    description: 'Issuing Virtual Keys, Mobile BLE keys, physical fobs, PIN codes, and digital passes to staff and authorized third-party vendors.',
    screenshot: {
      type: 'issue_staff_vendor_keys',
      caption: 'Quext.io Portal: Access & Keyring > Issue Staff / Vendor Master Keys',
      uiTitle: 'Quext IoT Portal · People > Keyring > Manage Keys',
      urlPath: 'https://quext.io/people/keyring/manage'
    },
    sections: [
      {
        id: 'sec4_1',
        title: '4.1 Quext Supported Key Types & Operational Rules',
        content: [
          'The Quext platform supports multiple key modalities to ensure seamless access for on-site staff, contractors, and specialized service vendors. Choosing the correct key type ensures proper communication with locks while maintaining campus security.'
        ],
        table: {
          headers: ['Key Modality', 'Target Audience', 'Architecture & Location Limits'],
          rows: [
            ['Virtual Keys (Recommended for Staff)', 'Staff Only (Not for Vendors)', 'Communicates directly from IoT Admin app to door lock via BLE, bypassing the thermostat hub. Unlimited locations.'],
            ['Mobile BLE Keys', 'Staff & Vendors', 'Resides on the Quext app; communicates with lock via IoT Thermostat hub. Max 15 locations per transaction.'],
            ['Physical Key Fobs', 'Staff, Vendors & Residents', 'Encrypted 13.56MHz RFID/DESFire physical fob; assigned via badge ID. Max 5 fobs per profile.'],
            ['Digital Wallet Passes', 'Staff & Residents', 'NFC Apple Wallet & Google Wallet pass with Express Mode enabled for tap-and-go.'],
            ['PIN Codes', 'Staff & Contractors', 'Numeric keypad codes for communities with PIN-compatible smart deadbolts & readers.'],
            ['Gate Tags', 'Staff & Residents', 'Long-range RFID tags for perimeter gates, vehicle booms, and parking garage arms.']
          ]
        },
        keyTakeaway: 'Always prefer Virtual Keys for full-time staff members as they offer unlimited location access and direct-to-lock reliability.'
      },
      {
        id: 'sec4_2',
        title: '4.2 Step-by-Step Key Issuance Sequence',
        content: [
          'Follow these steps in the Quext portal to issue or manage keys for staff and vendors:'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to People / Staff Keyring',
            detail: 'In the left sidebar, click "People" (or "Access"), then select "Staff" or "Vendors". Search for the target individual.'
          },
          {
            stepNumber: 2,
            title: 'Open "Keyring" -> "Manage Keys"',
            detail: 'Click on the user profile row, select the "Keyring" tab, and click "Manage Keys".'
          },
          {
            stepNumber: 3,
            title: 'Select Key Type & Configuration',
            detail: 'Choose the appropriate key type (Virtual Key, Mobile Key, Fob, PIN Code, or Digital Wallet Pass).'
          },
          {
            stepNumber: 4,
            title: 'Specify Access Scope & Badge/Pass Info',
            detail: 'For fobs, enter the 8-10 digit Badge ID. For virtual/mobile keys, select authorized unit/common area scopes (respecting the 15-location limit for mobile keys).'
          },
          {
            stepNumber: 5,
            title: 'Save & Dispatch Key Credential',
            detail: 'Click "Save". The key is immediately pushed to the Quext cloud engine and synced to mobile apps or lock whitelists.'
          }
        ],
        needHelpCallout: 'NEED HELP?: If a staff member or vendor does not see their key appear in the app, contact support@onequext.com or your Project Manager.'
      }
    ]
  },

  // SECTION 5: Staff - Assign Temporary Access for Staff & Vendors (Page 5)
  // Ref: https://help.quext.io/en/articles/10291920-staff-assign-temporary-access-for-staff-vendors
  {
    id: 'ch5_temporary_access',
    chapterNumber: 5,
    title: 'Staff Management: Assigning Temporary Access',
    shortTitle: 'Temporary Access',
    readTime: '4 min',
    category: 'access',
    description: 'Granting time-bound access privileges, setting date ranges, defining custom schedules, and enforcing location boundaries.',
    screenshot: {
      type: 'temporary_access',
      caption: 'Quext.io Portal: Access > Grant Temporary Access > Date Range & Shift Schedules',
      uiTitle: 'Quext IoT Portal · Access > Grant Access',
      urlPath: 'https://quext.io/access/grant-temporary'
    },
    sections: [
      {
        id: 'sec5_1',
        title: '5.1 Temporary Access Architecture & Security Rules',
        content: [
          'Temporary access allows property managers and field supervisors to grant contractors, painters, HVAC technicians, and seasonal staff strict, time-bound entry privileges. Access automatically revokes upon reaching the scheduled expiration timestamp.',
          '• Virtual Access: Recommended for internal staff members. Bypasses the thermostat hub and supports unlimited door locations.',
          '• Mobile Access: Ideal for external vendors. Limited to a maximum of 15 access locations per transaction to optimize lock memory.',
          '• Schedule Options: By default, access runs 24/7 during the active date range. Custom schedules (e.g., Mon-Fri 8:00 AM - 5:00 PM) can be assigned to prevent unauthorized after-hours entry.'
        ],
        table: {
          headers: ['Access Parameter', 'Staff Members', 'Third-Party Vendors / Contractors'],
          rows: [
            ['Recommended Access Type', 'Virtual Keys (Direct BLE to Lock)', 'Mobile Keys (BLE via Hub) or Temporary PIN'],
            ['Location Limit', 'Unlimited Locations', 'Max 15 Locations per Transaction'],
            ['Default Schedule', '24/7 Access', 'Business Hours / Custom Shift Schedule'],
            ['Date Range Window', 'Annual / Project Duration', 'Exact Work Order Window (1 to 30 Days)']
          ]
        }
      },
      {
        id: 'sec5_2',
        title: '5.2 Step-by-Step Temporary Access Grant Sequence',
        content: [
          'Follow the standardized workflow on the Access page to provision temporary access:'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to the Access Page',
            detail: 'From the left navigation menu in your Quext portal, click on "Access".'
          },
          {
            stepNumber: 2,
            title: 'Open Grant Access Modal',
            detail: 'Click on the three-dot menu (⋮) in the top-right corner and select "Grant Access".'
          },
          {
            stepNumber: 3,
            title: 'Choose Access Type (Virtual vs Mobile)',
            detail: 'Select "Virtual" for staff members or "Mobile" for vendors and external contractors.'
          },
          {
            stepNumber: 4,
            title: 'Define Date Range & Active Schedule',
            detail: 'Set the start date and expiration date. Choose "24/7" or select a predefined custom shift schedule.'
          },
          {
            stepNumber: 5,
            title: 'Select Locations, Common Areas & Units',
            detail: 'Search for specific units or use "Select All" to choose all doors under a building. Keep vendor mobile key selections within 15 locations.'
          },
          {
            stepNumber: 6,
            title: 'Click "Save" to Activate',
            detail: 'Click "Save". The temporary credential is encrypted and dispatched instantly to the recipient.'
          }
        ],
        keyTakeaway: 'Always assign external contractors a custom schedule to restrict access strictly to contracted work hours.'
      }
    ]
  },

  // SECTION 6: Staff - Create PIN Code & Assign Temporary Access (Page 6)
  // Ref: https://help.quext.io/en/articles/10291950-staff-create-pin-code-assign-temporary-access
  {
    id: 'ch6_pin_code_access',
    chapterNumber: 6,
    title: 'Staff Management: PIN Code Creation & Temporary Access',
    shortTitle: 'PIN Code Access',
    readTime: '3 min',
    category: 'access',
    description: 'Generating numeric PIN codes for keypad-equipped locks, setting auto-expiring codes, and managing contractor entry.',
    screenshot: {
      type: 'pin_code_access',
      caption: 'Quext.io Portal: Access > PIN Code Generator & Unit Door Lock Assignment',
      uiTitle: 'Quext IoT Portal · Access > PIN Management',
      urlPath: 'https://quext.io/access/pin-codes'
    },
    sections: [
      {
        id: 'sec6_1',
        title: '6.1 PIN Code Architecture & Security Protocol',
        content: [
          'For communities utilizing smart deadbolts or common area readers equipped with physical or capacitive touch keypads (such as Schlage Control, PDK, or dormakaba), PIN codes provide reliable phone-free access for maintenance crews and emergency service providers.',
          '• Length & Entropy: PIN codes are 4 to 8 digits in length. The Quext portal enforces anti-trivial pattern checks (rejecting 1234, 0000, 1111).'
        ],
        table: {
          headers: ['PIN Code Feature', 'Specification', 'Best Practice / Field Recommendation'],
          rows: [
            ['Code Length', '4 to 8 Numeric Digits', 'Use 6-digit random generated PINs for high security'],
            ['Supported Locks', 'Keypad Deadbolts, PDK Keypads', 'Ensure lock firmware supports keypad encryption'],
            ['Expiration Mechanism', 'Automated Timestamp Deactivation', 'Set PIN expiration to match work order completion'],
            ['Network Push Time', '< 3 Seconds over LoRaWAN', 'Verify door lock beeps/acknowledges PIN push']
          ]
        }
      },
      {
        id: 'sec6_2',
        title: '6.2 Step-by-Step PIN Creation & Assignment Sequence',
        content: [
          'Follow these steps to generate and dispatch temporary PIN codes:'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to Access -> PIN Management',
            detail: 'From the portal menu, open "Access" and select "PIN Codes" (or click "Grant Access" -> "PIN Code").'
          },
          {
            stepNumber: 2,
            title: 'Select Recipient (Staff, Contractor, or Vendor)',
            detail: 'Choose an existing user or input the contractor\'s full name, email, and mobile phone number.'
          },
          {
            stepNumber: 3,
            title: 'Generate or Enter Secure PIN',
            detail: 'Click "Generate Random PIN" for maximum entropy, or manually enter a custom 4-8 digit numeric code.'
          },
          {
            stepNumber: 4,
            title: 'Set Validity Window & Unit Doors',
            detail: 'Specify the active date/time range and select the target unit lock(s) or common amenities.'
          },
          {
            stepNumber: 5,
            title: 'Save & Transmit to Smart Lock',
            detail: 'Click "Save". The PIN is securely provisioned to the lock over the IoT gateway. An automated SMS/Email with PIN instructions is sent to the recipient.'
          }
        ],
        keyTakeaway: 'Never write PIN codes on physical locksets or door jambs. PINs expire automatically upon reaching the scheduled date.'
      }
    ]
  },

  // SECTION 7: Key Fob Assignment (Page 7)
  // Ref: https://help.quext.io/en/articles/10396545-staff-key-fob-distribution
  {
    id: 'ch7_key_fob_distribution',
    chapterNumber: 7,
    title: 'Key Fob Assignment',
    shortTitle: 'Key Fob Assignment',
    readTime: '4 min',
    category: 'access',
    description: 'Issuing physical RFID key fobs, assigning Badge IDs, enforcing fob limits, and revoking lost hardware tokens.',
    screenshot: {
      type: 'key_fob_distribution',
      caption: 'Quext.io Portal: People > Residents/Staff > Keyring > Fob Badge ID Assignment',
      uiTitle: 'Quext IoT Portal · People > Fob Management',
      urlPath: 'https://quext.io/people/fob-distribution'
    },
    sections: [
      {
        id: 'sec7_1',
        title: '7.1 Physical Fob Specifications & Allocation Rules',
        content: [
          'While Quext emphasizes seamless digital wallet and mobile app entry, physical key fobs remain a vital credential option for residents, maintenance staff, and contractors requiring physical hardware tokens.',
          '• Technology: Encrypted 13.56MHz MIFARE / DESFire EV3 contactless RFID fobs.',
          '• Badge ID: Each fob is laser-engraved with an 8 to 10 character alphanumeric Badge ID (e.g., `QXT-FOB-94812`).',
          '• Allocation Limits: Property rules enforce a maximum of 3 key fobs per resident profile and up to 5 key fobs per staff profile.'
        ],
        table: {
          headers: ['Credential Type', 'Fob Technology', 'Max Fobs / Profile', 'Revocation Speed'],
          rows: [
            ['Resident Key Fob', 'DESFire EV3 13.56MHz', 'Max 3 Fobs per Resident', 'Instantaneous via Portal Trash Icon'],
            ['Staff Master Fob', 'DESFire EV3 Multi-Sector', 'Max 5 Fobs per Staff', 'Immediate Global Blacklist Sync'],
            ['Vendor Day Fob', 'Standard RFID Tag', '1 Fob per Work Order', 'Auto-Deactivates at Shift End']
          ]
        }
      },
      {
        id: 'sec7_2',
        title: '7.2 Step-by-Step Fob Assignment & Revocation Workflow',
        content: [
          'Follow this sequence to program and assign a physical key fob to a user:'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to "People" -> "Residents" or "Staff"',
            detail: 'From the portal dashboard, click "People" and select the "Residents" or "Staff" tile.'
          },
          {
            stepNumber: 2,
            title: 'Search and Select User Profile',
            detail: 'Use the search bar to locate the recipient by name, unit number, or email.'
          },
          {
            stepNumber: 3,
            title: 'Open "Keyring" -> "Manage Keys"',
            detail: 'Click into the user details, navigate to the "Keyring" tab, and select "Manage Keys".'
          },
          {
            stepNumber: 4,
            title: 'Input Fob Badge ID',
            detail: 'Under the Fob Keys section, search for or type the laser-engraved Badge ID from the physical fob.'
          },
          {
            stepNumber: 5,
            title: 'Save and Verify at Physical Reader',
            detail: 'Click "Save". Tap the fob against the unit lock or RC Card Reader to verify immediate unlock response.'
          },
          {
            stepNumber: 6,
            title: 'Revocation Protocol (Lost Fob)',
            detail: 'To deactivate a lost fob, return to "Manage Keys", click the trash can icon next to the Badge ID, and click "Confirm Revocation".'
          }
        ],
        keyTakeaway: 'Always test newly assigned key fobs on both a common amenity RC Reader and the resident unit deadbolt before handing them over.',
        needHelpCallout: 'NEED HELP?: For defective fobs or badge ID read errors, reach out to support@onequext.com or your Project manager.'
      }
    ]
  },

  // SECTION 8: Gateway & LoRaWAN Infrastructure Management (Page 8)
  {
    id: 'ch8_gateway_lora',
    chapterNumber: 8,
    title: 'Gateway & LoRaWAN Infrastructure Management',
    shortTitle: 'Gateways & LoRaWAN',
    readTime: '4 min',
    category: 'infrastructure',
    description: 'Verifying campus IoT Gateways, analyzing packet SNR/RSSI, and confirming cloud backhaul prior to unit rollout.',
    screenshot: {
      type: 'gateway_status',
      caption: 'TEKTELIC IoT Gateway Health & LoRaWAN Packet Stream in Quext.io',
      uiTitle: 'Quext Portal · Infrastructure > Gateways',
      urlPath: 'https://quext.io/infrastructure/gateways'
    },
    sections: [
      {
        id: 'sec8_1',
        title: '8.1 Pre-Installation Gateway Verification',
        content: [
          'CRITICAL RULE: Never begin mounting or provisioning in-unit thermostats or locks until the campus IoT Gateways are verified as "Online & Operational" with active backhaul in the Quext Portal. Devices cannot complete cryptographic key negotiation without an active gateway.',
          'Confirm with support@onequext.com or your Project manager the ensure the status of the Gateway is online before proceeding.'
        ],
        keyTakeaway: 'Do not mount or power hardware until Gateway online status is confirmed with Support or your Project Manager.'
      },
      {
        id: 'sec8_2',
        title: '8.2 RF Signal Standards (RSSI & SNR Metrics)',
        content: [
          'The Quext Portal displays real-time RF health metrics for every device connected to the LoRaWAN gateway. Use these benchmark values during validation:'
        ],
        table: {
          headers: ['Metric', 'Optimal Range', 'Marginal Range', 'Action Required (< Marginal)'],
          rows: [
            ['RSSI (Received Signal Strength)', '-60 dBm to -95 dBm', '-96 dBm to -115 dBm', 'RSSI < -118 dBm: Reposition gateway or add Kona Micro Repeater'],
            ['SNR (Signal-to-Noise Ratio)', '+5 dB to +12 dB', '-2 dB to +4 dB', 'SNR < -7 dB: Check for structural interference (concrete/foil insulation)'],
            ['Packet Loss Rate', '< 0.5%', '0.5% - 2.5%', 'Loss > 3.0%: Device may fail Over-the-Air commands']
          ]
        }
      }
    ]
  },

  // SECTION 9: Thermostat Configuration & HVAC System Mapping (Page 9)
  {
    id: 'ch9_hvac_configuration',
    chapterNumber: 9,
    title: 'Thermostat Configuration & HVAC System Mapping',
    shortTitle: 'HVAC Settings',
    readTime: '4 min',
    category: 'hvac',
    description: 'Configuring HVAC system profiles in the portal, setting O/B reversing valve polarity, and heat pump stages.',
    screenshot: {
      type: 'hvac_config',
      caption: 'Quext.io Portal: Devices > Thermostats > Unit Settings > HVAC Config & O/B Polarity',
      uiTitle: 'Quext Portal · Devices > Thermostats > Unit 204 > Settings',
      urlPath: 'https://quext.io/devices/thermostats/unit-204/settings'
    },
    sections: [
      {
        id: 'sec9_1',
        title: '9.1 HVAC System Type Selection in Portal',
        content: [
          'Mismatched HVAC settings in the portal will cause equipment damage or continuous compressor operation. Always inspect the physical air handler / furnace control board to confirm system type before applying profile settings.'
        ],
        table: {
          headers: ['HVAC System Profile', 'Terminal Wiring Scheme', 'Portal Configuration Value'],
          rows: [
            ['Conventional Gas / Electric Furnace', 'R, C, W1, Y1, G (Single Stage)', 'System Type: Conventional | Heating: Gas/Elec | Cooling: 1-Stage'],
            ['Heat Pump (Standard Reversing Valve)', 'R, C, Y1, G, O/B (Energized in Cool)', 'System Type: Heat Pump | O/B Polarity: O (Cooling) | Aux: Off'],
            ['Heat Pump with Aux Electric Heat Strip', 'R, C, Y1, W1/Aux, G, O/B (Reversing Valve)', 'System Type: Heat Pump | O/B Polarity: O | Aux Heat: 2nd Stage (W1)'],
            ['Rheem / Ruud Heat Pump', 'R, C, Y1, G, O/B (Energized in Heat)', 'System Type: Heat Pump | O/B Polarity: B (Heating) | Aux: Optional']
          ]
        },
        keyTakeaway: 'Over 90% of heat pump issues stem from incorrect O/B polarity. If AC blows hot air, toggle O/B polarity in the Quext portal.',
        needHelpCallout: 'NEED HELP?: Reach out to support@onequext.com or your Project manager for any assistance with the above.'
      }
    ]
  },

  // SECTION 10: Access Control, Credential Management & Reader Testing (Page 10)
  {
    id: 'ch10_access_control',
    chapterNumber: 10,
    title: 'Access Control, Credential Management & Reader Testing',
    shortTitle: 'Access Control',
    readTime: '4 min',
    category: 'access',
    description: 'Managing digital NFC credentials (Apple Wallet, Google Wallet), physical fobs, RC Card Readers.',
    screenshot: {
      type: 'access_wallet',
      caption: 'Quext.io Portal: Access Control > Credentials > Issue Digital NFC Wallet Pass',
      uiTitle: 'Quext Portal · Access Control > Digital Credentials',
      urlPath: 'https://quext.io/access-control/credentials'
    },
    sections: [
      {
        id: 'sec10_1',
        title: '10.1 NFC Digital Key & Apple Wallet Credential Issuance',
        content: [
          'Quext Access Control integrates natively with Apple Wallet and Google Wallet for contactless NFC access. Digital keys operate via high-security encrypted DESFire EV3 / PKI tokens.'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to "Access Control" -> "Credentials" in Portal',
            detail: 'Open the property credentials management console.'
          },
          {
            stepNumber: 2,
            title: 'Issue Technician / Maintenance Field Master Pass',
            detail: 'Select the technician profile, choose "Issue Digital Credential", and send the SMS/Email invite link.'
          },
          {
            stepNumber: 3,
            title: 'Add Pass to Mobile Wallet',
            detail: 'Open the invite link on iOS/Android, tap "Add to Apple Wallet" or "Add to Google Wallet". Enable "Express Mode" for instant tap-to-unlock without biometric prompt.'
          },
          {
            stepNumber: 4,
            title: 'Test Physical Tap at Reader',
            detail: 'Hold the top of iPhone or Android device within 1.5 inches of the reader lens. The reader LED illuminates Solid Green with a confirmation beep, and the strike clicks open.'
          }
        ]
      }
    ]
  },

  // SECTION 11: Device Installation Export & Field Sign-Off (Page 11)
  {
    id: 'ch11_device_report_signoff',
    chapterNumber: 11,
    title: 'Device Installation Export, and Installation Completion and Field sign off.',
    shortTitle: 'Device Report & Sign-Off',
    readTime: '3 min',
    category: 'diagnostics',
    description: 'Exporting the official project Device Report PDF and emailing it with your signed SOW to your project manager.',
    screenshot: {
      type: 'device_report_export',
      caption: 'Quext.io Portal: Home > Device Report > Review SOW Matching & Export PDF',
      uiTitle: 'Quext Portal · Home > Device Report Export',
      urlPath: 'https://quext.io/home/device-report'
    },
    sections: [
      {
        id: 'sec11_1',
        title: '11.1 Device Installation Export',
        content: [
          'Before handing over a completed building to property management, installers must execute the Device Export.'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to Home Tab',
            detail: 'Navigate to the Home tab on the left side bar in the quext portal.'
          },
          {
            stepNumber: 2,
            title: 'Scroll Down to Device Report',
            detail: 'Scroll down to Device Report.'
          },
          {
            stepNumber: 3,
            title: 'Review SOW Matching',
            detail: 'Review that the devices shown match the SOW for your project.'
          },
          {
            stepNumber: 4,
            title: 'Export PDF',
            detail: 'Click Export PDF when confirmed.'
          }
        ]
      },
      {
        id: 'sec11_2',
        title: '11.2 Installation Completion and Field sign off',
        content: [
          'Upon completion of the installation. Email the Device Report PDF together with your signed SOW to your project manager for confirmation of completion.'
        ],
        keyTakeaway: 'Email both the Device Report PDF and your signed SOW to your Project Manager to finalize commissioning and billing sign-off.'
      }
    ]
  },

  // SECTION 12: Troubleshooting Decision Matrix & Support Escalation (Page 12)
  {
    id: 'ch12_troubleshooting_matrix',
    chapterNumber: 12,
    title: 'Troubleshooting Decision Matrix & Support Escalation',
    shortTitle: 'Troubleshooting',
    readTime: '5 min',
    category: 'troubleshooting',
    description: 'Symptom-cause-resolution matrix, thermostat HVAC config adjustments, and Quext Tier-2/3 support escalation protocols.',
    screenshot: {
      type: 'support_modal',
      caption: 'Quext.io Portal: Help & Escalation Modal with Support and Project Manager CC',
      uiTitle: 'Quext Portal · Help & Tier-2/3 Escalation',
      urlPath: 'https://quext.io/support/urgent-ticket'
    },
    sections: [
      {
        id: 'sec12_1',
        title: '12.1 Rapid Field Troubleshooting Table',
        content: [
          'Refer to this table when diagnosing field anomalies prior to contacting Quext Technical Support:'
        ],
        table: {
          headers: ['Observed Symptom', 'Probable Root Cause', 'Exact Portal & Physical Resolution'],
          rows: [
            [
              'Thermostat shows "NO NET" on LED screen',
              'Subbase not receiving LoRa signal or gateway offline',
              '1. Check Gateway with Support@onequext.com and/or your project manager.\n2. Press and hold Reset button on thermostat bottom for 10 seconds to trigger LoRa rejoin.\n3. Verify RSSI in portal.'
            ],
            [
              'Lock does not respond to digital wallet tap',
              'Credential not synced to reader or antenna obstructed',
              '1. In Portal, check Access Control -> Audit Logs.\n2. Click "Resync Token Whitelist".\n3. Tap card again to refresh local cache.'
            ],
            [
              'AC unit blowing warm air in Cool Mode',
              'O/B Reversing valve polarity inverted in portal',
              '1. click devices -> Thermostats -> Desired unit -> Settings\n2. then scroll to HVAC config\n3. Toggle O/B Polarity from "O" to "B" (or vice versa).\n4. Click "Save".'
            ],
            [
              'Gateway displays Solid Red LED',
              'Loss of Ethernet/Cellular internet backhaul',
              '1. Check PoE cable link lights.\n2. Verify property firewall allows outbound UDP port 1700 (Semtech Packet Forwarder).\n3. Power cycle PoE injector.'
            ]
          ]
        }
      },
      {
        id: 'sec12_2',
        title: '12.2 Official Support Escalation Protocol',
        content: [
          'When an on-site issue cannot be resolved through the standard matrix, initiate Tier-2/3 escalation with Quext Field Engineering:'
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Gather Diagnostic Telemetry Package',
            detail: 'Record: Property Name, Unit Number, Gateway Serial Number, Device DevEUI/MAC, and accurate photos of the physical wiring.'
          },
          {
            stepNumber: 2,
            title: 'Submit Ticket via Quext Portal Support Chat',
            detail: 'Click the Help / Support icon in the bottom right of the portal (or email support@onequext.com with subject line: "[URGENT FIELD INSTALL] - Property Name - Unit #"). Additionally add your Project Manager to this email.'
          },
          {
            stepNumber: 3,
            title: 'Call Field Engineering Hotline',
            detail: 'For active on-site work stop emergencies, call 1-800-798-8319 (1-800-QXT-HELP) and select option 2 for Certified Field Installers.'
          }
        ],
        keyTakeaway: 'Always include the 16-character DevEUI and CC your Project Manager on all escalation communications.'
      }
    ]
  }
];
