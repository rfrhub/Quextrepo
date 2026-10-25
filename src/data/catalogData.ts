import { HardwareCatalogItem, SoftwareCatalogItem } from '../types';

/**
 * Full Hardware Catalog that informs Quext project quotes
 * Source: https://myquext.com/#/analysis/KgU6WfWMmU7fR7UxgED8/kickoff
 */
export const QUEUXT_HARDWARE_CATALOG: HardwareCatalogItem[] = [
  {
    id: 'hw-dl-900',
    sku: 'QXT-DL-900',
    name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet NFC)',
    category: 'Smart Access Control',
    unitCost: 140,
    unitPrice: 220,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Quext',
    isPopularQuickAdd: true,
    description: 'Commercial-grade residential smart deadbolt with integrated BLE & Apple Wallet / Google Wallet NFC credentials. Features hardened brass anti-pick latch and remote cloud lock/unlock telemetry.',
    specifications: [
      'Battery: 4x AA Lithium (12+ months life)',
      'Protocol: LoRaWAN 915 MHz + Bluetooth Low Energy 5.2 + NFC',
      'Door Prep: Standard 2-1/8" bore, 2-3/8" or 2-3/4" backset',
      'Credential Compatibility: Apple Wallet NFC, Google Wallet, Mobile Passcode, Physical Master Override Key',
      'Certifications: ANSI/BHMA Grade 2, UL 20-minute fire rated'
    ]
  },
  {
    id: 'hw-ml-450',
    sku: 'QXT-ML-450',
    name: 'Quext Smart Mortise Lock (Keyless High-Rise Entry)',
    category: 'Smart Access Control',
    unitCost: 185,
    unitPrice: 280,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Quext',
    isPopularQuickAdd: true,
    description: 'Heavy-duty mortise chassis smart lock designed for urban high-rise and mid-rise developments requiring high wind resistance and commercial fire egress compliance.',
    specifications: [
      'Battery: 4x AA Alkaline / Lithium',
      'Certifications: ANSI/BHMA Grade 1, 3-hour UL Fire Rated',
      'Finish Options: Satin Chrome, Matte Black, Satin Brass',
      'Connectivity: 915 MHz LoRaWAN backhaul with local BLE mesh failover'
    ]
  },
  {
    id: 'hw-int-500',
    sku: 'QXT-INT-500',
    name: 'Quext Commercial Interconnected Egress Lockset',
    category: 'Smart Access Control',
    unitCost: 195,
    unitPrice: 295,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Interconnected deadbolt and lever latch mechanism providing single-motion egress for emergency exit compliance in clubhouse, fitness, and common amenity corridors.',
    specifications: [
      'Mechanism: Single-motion egress unlocking both latch and deadbolt simultaneously',
      'Grade: ANSI/BHMA Grade 2 Interconnected',
      'Handing: Field reversible lever handing'
    ]
  },
  {
    id: 'hw-th-300',
    sku: 'QXT-TH-300',
    name: 'Quext IoT Smart Thermostat (LoRaWAN Hubless)',
    category: 'Smart Thermostats & HVAC',
    unitCost: 98,
    unitPrice: 165,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Quext',
    isPopularQuickAdd: true,
    description: 'Patented hubless LoRaWAN smart thermostat with dual humidity sensing, automated vacant unit temperature drift control, and freeze protection algorithms.',
    specifications: [
      'Power: 24VAC C-wire (with 4x AA battery backup)',
      'HVAC Compatibility: Up to 2 Heat / 2 Cool heat pumps and conventional gas/electric split systems',
      'Range: Up to 1.5 miles wireless connectivity to rooftop LoRa gateway',
      'Sensors: Precision temperature (0.5 F accuracy), relative humidity sensor',
      'Modes: Auto, Heat, Cool, Eco Vacancy, Freeze Alert'
    ]
  },
  {
    id: 'hw-hon-t6',
    sku: 'HON-TH6-ZW',
    name: 'Honeywell Home T6 Pro Z-Wave Smart Thermostat',
    category: 'Smart Thermostats & HVAC',
    unitCost: 85,
    unitPrice: 145,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Honeywell',
    isPopularQuickAdd: true,
    description: 'Honeywell Home enterprise smart thermostat integrating with Quext Smart Community via Z-Wave Plus bridge. Supports 7-day scheduling, dual-fuel heat pumps, and remote property manager lockouts.',
    specifications: [
      'Connectivity: Z-Wave Plus 700 Series',
      'Display: High-contrast touchscreen with ambient backlight',
      'Compatibility: 3 Heat / 2 Cool Heat Pump, 2 Heat / 2 Cool Conventional',
      'Scheduling: 7-day, 5-1-1, or non-programmable with cloud policy enforcement'
    ]
  },
  {
    id: 'hw-gw-lr8',
    sku: 'QXT-GW-LR8',
    name: 'Quext LoRaWAN Outdoor Gateway Base Station (8-Channel)',
    category: 'IoT Gateways & Mesh',
    unitCost: 780,
    unitPrice: 1250,
    typicalScope: 'Central Infrastructure / Riser',
    manufacturer: 'Quext',
    isPopularQuickAdd: true,
    description: 'Industrial-grade IP67 weatherproof outdoor 8-channel LoRaWAN gateway providing uninterrupted property-wide 915MHz RF coverage with cellular 4G LTE failover and PoE+ power.',
    specifications: [
      'Channels: 8 multi-SF LoRa channels + 1 FSK channel',
      'Backhaul: Gigabit Ethernet (PoE+ 802.3at) with Global 4G LTE Cat-M1 failover SIM',
      'Enclosure: IP67 NEMA 4X aluminum die-cast housing with lightning surge arrester',
      'Coverage: Penetrates 12+ concrete floors and covers up to 40 acres of garden garden/mid-rise buildings'
    ]
  },
  {
    id: 'hw-gw-rp4',
    sku: 'QXT-GW-RP4',
    name: 'Quext LoRaWAN Riser Repeater Station',
    category: 'IoT Gateways & Mesh',
    unitCost: 650,
    unitPrice: 1100,
    typicalScope: 'Central Infrastructure / Riser',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'High-rise elevator and electrical riser repeater ensuring zero RF packet loss across concrete shafts, deep parking decks, and subterranean utility tunnels.',
    specifications: [
      'Mounting: DIN-rail / wall-mount in electrical risers',
      'RF Band: 902-928 MHz US ISM Band',
      'Power: 12-24VDC or PoE'
    ]
  },
  {
    id: 'hw-gw-in2',
    sku: 'QXT-GW-IN2',
    name: 'Quext Indoor Micro Gateway (Clubhouse & Amenities)',
    category: 'IoT Gateways & Mesh',
    unitCost: 260,
    unitPrice: 450,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Compact PoE indoor LoRaWAN gateway engineered for dedicated coverage inside leasing centers, fitness hubs, and amenity clubhouses.',
    specifications: [
      'Form Factor: Discreet smoke-detector-style ceiling mount',
      'Channels: 4 LoRa channels',
      'Power: PoE (802.3af)'
    ]
  },
  {
    id: 'hw-lk-100',
    sku: 'QXT-LK-100',
    name: 'Aeotec Pro Smart Flood & Water Leak Detector',
    category: 'Sensors & Leak Protection',
    unitCost: 24,
    unitPrice: 42,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Aeotec',
    isPopularQuickAdd: true,
    description: 'Sub-compact water leak detector with gold-plated conductivity sensor pins and remote probe cord. Triggers instant sub-second cloud alarms and automatically commands shutoff valves.',
    specifications: [
      'Battery: CR2450 coin cell (up to 5-year operating life)',
      'Probe: Dual surface contacts + 3.5ft extension probe cord for AC drain pans',
      'Audible Alarm: 70 dB piezo siren on detection',
      'Telemetry: Instant moisture alert, battery voltage, temperature'
    ]
  },
  {
    id: 'hw-sw-30a',
    sku: 'QXT-SW-30A',
    name: 'Smart High-Load Water Heater 30A Relay Switch',
    category: 'Common Area & Utilities',
    unitCost: 48,
    unitPrice: 85,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Quext',
    isPopularQuickAdd: true,
    description: 'Heavy-duty 30A electrical relay wired to individual unit water heaters. Automatically interrupts power and shuts off water line upon receiving leak detector conductivity telemetry.',
    specifications: [
      'Load Capacity: 30A @ 120/240VAC (supports 4500W-5500W residential water heaters)',
      'Integration: Auto-shutoff triggered by QXT-LK-100 within 400 milliseconds',
      'Manual Override: Physical test/toggle rocker button with status LED'
    ]
  },
  {
    id: 'hw-ic-20',
    sku: 'QXT-IC-20',
    name: 'Quext Video Intercom & Perimeter Gate Reader',
    category: 'Smart Access Control',
    unitCost: 1150,
    unitPrice: 1850,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: true,
    description: 'Vandal-proof touchscreen video intercom and RFID access controller. Connects resident smartphone apps for two-way HD video calling, guest PINs, and automated courier delivery access.',
    specifications: [
      'Camera: 1080p Full HD wide-angle (140 FOV) with infrared night vision',
      'Display: 7-inch anti-glare capacitive outdoor touchscreen',
      'Housing: IK09 impact resistant, IP65 weatherproof brushed stainless steel',
      'Output: Dual Wiegand & dry contact relays for pedestrian gates and vehicular gate operators'
    ]
  },
  {
    id: 'hw-elv-04',
    sku: 'QXT-ELV-04',
    name: 'Quext Elevator Access Control Interface Relay',
    category: 'Smart Access Control',
    unitCost: 920,
    unitPrice: 1450,
    typicalScope: 'Central Infrastructure / Riser',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Commercial elevator traveling-cable interface module restricting cab floor selection based on resident credential tiers and guest delivery schedules.',
    specifications: [
      'Floors: 16 relay channels per controller (expandable to 64)',
      'Protocol: Wiegand, RS-485 OSDP v2.2',
      'Egress: Fire alarm override tie-in input'
    ]
  },
  {
    id: 'hw-xe360',
    sku: 'QXT-XE360',
    name: 'XE360 Amenity & Pool Gate Magnetic Lock Package',
    category: 'Common Area & Utilities',
    unitCost: 590,
    unitPrice: 980,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Outdoor weatherproof 1,200 lb electromagnetic lock assembly complete with armored gate bracket, waterproof push-to-exit button, and request-to-exit motion sensor.',
    specifications: [
      'Holding Force: 1,200 lbs (544 kg)',
      'Power: 12/24VDC dual voltage',
      'Protection: Corrosion-resistant stainless steel case with conduit connector'
    ]
  },
  {
    id: 'hw-wf7-wp',
    sku: 'QXT-WF7-WP',
    name: 'Managed Wi-Fi 7 Bulk Access Point (Wallplate PoE+)',
    category: 'Bulk Managed Wi-Fi',
    unitCost: 118,
    unitPrice: 195,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Quext',
    isPopularQuickAdd: true,
    description: 'Enterprise Tri-Band Wi-Fi 7 in-wall access point providing dedicated 5.8 Gbps aggregate throughput, private resident Personal Area Networks (PANs), and 4-port Gigabit switch.',
    specifications: [
      'Bands: 2.4 GHz, 5 GHz, and 6 GHz (Wi-Fi 7 / 802.11be)',
      'Ports: 4x 10/100/1000 Mbps Ethernet ports (1x PoE Out for IPTV/VoIP)',
      'Security: WPA3-Enterprise with per-resident Dynamic Pre-Shared Key (DPSKs)'
    ]
  },
  {
    id: 'hw-wf7-od',
    sku: 'QXT-WF7-OD',
    name: 'Managed Wi-Fi 7 Outdoor High-Density Access Point',
    category: 'Bulk Managed Wi-Fi',
    unitCost: 190,
    unitPrice: 320,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Weatherized IP68 outdoor access point providing seamless roaming across pools, courtyards, dog parks, and parking structures.',
    specifications: [
      'Enclosure: IP68 waterproof and UV stabilized',
      'Coverage: Up to 350-foot radius with high-gain beamforming antennas',
      'Power: PoE+ (802.3at)'
    ]
  },
  {
    id: 'hw-fob-25',
    sku: 'QXT-FOB-25',
    name: 'Quext Multi-Tech Encrypted Key Fobs (Pack of 25)',
    category: 'Smart Access Control',
    unitCost: 65,
    unitPrice: 125,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'High-security AES-128 encrypted key fobs for residents and maintenance staff requiring backup physical RFID keys alongside Apple Wallet.',
    specifications: [
      'Encryption: MIFARE DESFire EV3 128-bit AES',
      'Durability: Ultrasonically welded waterproof casing with key ring slot'
    ]
  },
  {
    id: 'hw-knox-01',
    sku: 'QXT-KNOX-01',
    name: 'Knox Box Rapid Entry Emergency Key Interface',
    category: 'Common Area & Utilities',
    unitCost: 210,
    unitPrice: 350,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Knox',
    isPopularQuickAdd: false,
    description: 'First responder emergency access vault tied into Quext perimeter and building access relays for municipal fire compliance.',
    specifications: [
      'Security: UL 1037 listed attack-resistant heavy steel vault',
      'Interface: Built-in microswitch signal feedback to Quext cloud'
    ]
  },
  {
    id: 'hw-sw-24p',
    sku: 'QXT-SW-24P',
    name: 'Quext Managed 24-Port Gigabit PoE+ Core Network Switch',
    category: 'Common Area & Utilities',
    unitCost: 340,
    unitPrice: 580,
    typicalScope: 'Central Infrastructure / Riser',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'High-density 24-port Gigabit managed PoE+ switch (370W power budget) powering Wi-Fi 7 wallplate APs, outdoor gateways, and video intercom stations across property risers.',
    specifications: [
      'Ports: 24x 10/100/1000 Mbps RJ45 PoE+ (802.3at/af) + 4x 10G SFP+ Uplinks',
      'PoE Budget: 370W total, IEEE 802.3at compliant (up to 30W/port)',
      'Management: Quext Cloud Centralized VLAN provisioning & port-level remote power cycling'
    ]
  },
  {
    id: 'hw-sw-48p',
    sku: 'QXT-SW-48P',
    name: 'Quext Managed 48-Port Gigabit PoE+ Enterprise Switch',
    category: 'Common Area & Utilities',
    unitCost: 590,
    unitPrice: 980,
    typicalScope: 'Central Infrastructure / Riser',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'High-capacity 48-port enterprise managed PoE+ switch (740W power budget) designed for centralized MDF/IDF racks in midrise and highrise residential towers.',
    specifications: [
      'Ports: 48x Gigabit PoE+ RJ45 + 4x 10G SFP+ fiber uplinks',
      'PoE Budget: 740W total power budget with redundant hot-swap fan modules',
      'Certifications: Layer 3 routing, static IP routing, DHCP server, 802.1X security'
    ]
  },
  {
    id: 'hw-cr-mini',
    sku: 'QXT-CR-MINI',
    name: 'Quext Desktop USB NFC & Mifare Credential Encoder',
    category: 'Smart Access Control',
    unitCost: 110,
    unitPrice: 195,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Leasing office USB desktop programmer for instant encoding of physical backup fobs, maintenance master keycards, and vendor credentials directly from the staff dashboard.',
    specifications: [
      'Interface: USB 2.0 Plug-and-Play (Windows & macOS compatible)',
      'Read/Write Frequency: 13.56 MHz (ISO 14443A/B, MIFARE DESFire EV3, NFC Forum Tag)',
      'Security: Hardware Secure Access Module (SAM) slot for cryptographic key protection'
    ]
  },
  {
    id: 'hw-ps-4a',
    sku: 'QXT-PS-4A',
    name: 'Low-Voltage Central 12/24VDC 4A Power Supply & Battery Enclosure',
    category: 'Common Area & Utilities',
    unitCost: 145,
    unitPrice: 245,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'General',
    isPopularQuickAdd: false,
    description: 'Regulated multi-output DC power supply with supervised battery backup charging circuit for magnetic locks, electric strikes, and intercom gate controllers.',
    specifications: [
      'Output: Selectable 12VDC or 24VDC @ 4A continuous output',
      'Supervision: AC fail, battery low, and power supervisory outputs tied to Quext gateway alerts',
      'Enclosure: Heavy-gauge steel cabinet with cam lock and 7Ah sealed lead-acid battery backup'
    ]
  },
  {
    id: 'hw-mag-600',
    sku: 'QXT-MAG-600',
    name: 'Quext Interior 600 lb Electromagnetic Lock Package',
    category: 'Common Area & Utilities',
    unitCost: 280,
    unitPrice: 460,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Architectural interior magnetic lock with built-in magnetic bond sensor (MBS) and status LED for fitness center, business lounge, and roof deck access doors.',
    specifications: [
      'Holding Force: 600 lbs (272 kg)',
      'Voltage: Dual voltage 12/24VDC auto-sensing',
      'Bond Sensor: Built-in Form C relay output for real-time door secure verification'
    ]
  },
  {
    id: 'hw-rex-pir',
    sku: 'QXT-REX-PIR',
    name: 'Passive Infrared Request-to-Exit (REX) Motion Sensor with Sounder',
    category: 'Common Area & Utilities',
    unitCost: 38,
    unitPrice: 65,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Ceiling or door header mounted digital REX sensor with dual pyroelectric detection zones, adjustable relock timer, and piezo door-held-open warning sounder.',
    specifications: [
      'Detection Field: Curtain pattern or wide-angle pattern up to 20 feet',
      'Relock Timer: Adjustable 0.5 to 64 seconds',
      'Integration: Auto-releases fail-safe magnetic locks upon detection for emergency egress'
    ]
  },
  {
    id: 'hw-cnt-mag',
    sku: 'QXT-CNT-MAG',
    name: 'Surface Mount Heavy-Duty Armored Door Position Contact',
    category: 'Common Area & Utilities',
    unitCost: 18,
    unitPrice: 32,
    typicalScope: 'Common Area & Amenities',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Industrial extruded aluminum magnetic contact with stainless steel armored cable lead, providing door-ajar and forced-entry telemetry to Quext cloud.',
    specifications: [
      'Gap Distance: 2.5 inch operating gap for heavy commercial gates and steel doors',
      'Cable: 24-inch stainless steel armored conduit lead',
      'Ratings: IP67 waterproof, NEMA 4X exterior rated'
    ]
  },
  {
    id: 'hw-kit-wire',
    sku: 'QXT-KIT-WIRE',
    name: 'Residential Pre-Wire & Terminal Harness Rigging Kit',
    category: 'Common Area & Utilities',
    unitCost: 22,
    unitPrice: 39,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Pre-cut, color-coded, labeled low-voltage wire harness assemblies for quick-snap lock mortises, HVAC thermostat C-wire bridges, and leak sensor extensions.',
    specifications: [
      'Contents: C-Wire jumper harness, 4-pin quick connect lock wire harness, probe extension leads, wire nuts',
      'Rating: UL Listed Plenum-rated conductors'
    ]
  },
  {
    id: 'hw-sub-h2o',
    sku: 'QXT-SUB-H2O',
    name: 'LoRaWAN Smart Water Submetering Pulse Sensor',
    category: 'Sensors & Leak Protection',
    unitCost: 95,
    unitPrice: 175,
    typicalScope: 'Per Residential Unit',
    manufacturer: 'Quext',
    isPopularQuickAdd: false,
    description: 'Submeter pulse counter interface transmitting high-resolution hourly water consumption data over LoRaWAN for utility billing and continuous flow leak detection.',
    specifications: [
      'Resolution: 1 pulse per gallon or 10 pulses per gallon',
      'Battery Life: 10-year non-replaceable lithium battery',
      'RF Band: LoRaWAN US915 MHz Class A telemetry'
    ]
  }
];

/**
 * Full Software Catalog that informs Quext project quotes
 * Source: https://myquext.com/#/analysis/KgU6WfWMmU7fR7UxgED8/kickoff
 */
export const QUEUXT_SOFTWARE_CATALOG: SoftwareCatalogItem[] = [
  {
    id: 'sw-core',
    sku: 'QXT-SW-CORE',
    name: 'Quext IoT Smart Community Platform Core',
    tier: 'Base Platform',
    billingType: 'per_unit_per_month',
    monthlyCost: 6.50,
    monthlyPrice: 15.00,
    description: 'Foundational smart community cloud software: unit inventory synchronization, staff web dashboard, remote device health diagnostics, and automated move-in/move-out provisioning.',
    features: [
      'Live Unit Device Health & Online/Offline Telemetry',
      'Multi-Role Staff Access Permissions (Manager, Staff, Limited)',
      'Automated Vacancy Smart Thermostat & Lock Management',
      'Real-Time Battery Level & RF Signal Strength Monitoring',
      'Unlimited Cloud Event & Access Audit Log Storage'
    ]
  },
  {
    id: 'sw-access',
    sku: 'QXT-SW-ACCESS',
    name: 'Smart Access & Digital Key Management (Apple & Google Wallet)',
    tier: 'Access Control',
    billingType: 'per_unit_per_month',
    monthlyCost: 1.80,
    monthlyPrice: 5.00,
    description: 'Enterprise digital key management: enables resident and staff Apple Wallet and Google Wallet passes, temporary guest PINs, vendor time-restricted access, and perimeter gate control.',
    features: [
      'Apple Wallet & Google Wallet 1-Tap NFC Pass Provisioning',
      'Instant Mobile Key Revocation upon Lease Expiration',
      'Visitor PIN Generation with SMS Passcode Delivery',
      'Time-Restricted Vendor & Maintenance Access Windows',
      'Full Entryway Activity Audit Log with Timestamp and Photo'
    ]
  },
  {
    id: 'sw-hvac',
    sku: 'QXT-SW-HVAC',
    name: 'Smart HVAC & Vacant Energy Automation Cloud',
    tier: 'Climate & Energy',
    billingType: 'per_unit_per_month',
    monthlyCost: 1.20,
    monthlyPrice: 4.00,
    description: 'Algorithmic energy management: automatically shifts vacant units into energy-saver eco mode, prevents frozen pipes during severe winter freezes, and enforces property heating/cooling limits.',
    features: [
      'Automated Vacant Unit Temperature Drift Control (15-28% Energy Savings)',
      'Severe Weather Freeze Protection & Pipe Burst Safeguard',
      'Property-Enforced Setpoint Boundaries (e.g., 65 F min cool / 75 F max heat)',
      'Resident In-App 7-Day Smart Scheduling & Geofencing',
      'HVAC Compressor Run-Time Degradation Alerts'
    ]
  },
  {
    id: 'sw-leak',
    sku: 'QXT-SW-LEAK',
    name: 'Smart Water Mitigation & Automated Valve Protection',
    tier: 'Water Protection',
    billingType: 'per_unit_per_month',
    monthlyCost: 0.90,
    monthlyPrice: 3.00,
    description: 'Commercial catastrophic water mitigation: monitors moisture sensors 24/7 and automatically triggers in-line shutoff valves within milliseconds to prevent multi-floor structural flooding.',
    features: [
      'Sub-Second Automated Water Heater Shutoff Relay Command',
      'Instant SMS, Push, and Email Alert Dispatch to On-Call Maintenance',
      'Insurance Compliance Audit Reporting for Risk Reduction Credits',
      'Sensor Battery & RF Signal Health Heartbeat Checks'
    ]
  },
  {
    id: 'sw-wifi',
    sku: 'QXT-SW-WIFI',
    name: 'Bulk Managed Wi-Fi 7 Resident Network Service',
    tier: 'Managed Wi-Fi',
    billingType: 'per_unit_per_month',
    monthlyCost: 11.00,
    monthlyPrice: 25.00,
    description: 'Turnkey managed property Wi-Fi: gives each apartment a dedicated, isolated Personal Area Network (PAN) with property-wide seamless roaming from apartment to pool to fitness center.',
    features: [
      'Zero Move-In Friction: Instant Pre-Activated Apartment Wi-Fi',
      'Dedicated Resident Personal Area Network (Private VLAN Isolation)',
      'Community-Wide Roaming Across All Indoor & Outdoor Amenity APs',
      'Guest Wi-Fi Portal with Marketing Analytics & Branding',
      '24/7/365 Direct Resident Technical Support Desk'
    ]
  },
  {
    id: 'sw-intercom',
    sku: 'QXT-SW-INTERCOM',
    name: 'Video Intercom & Visitor Cloud Directory Service',
    tier: 'Access Control',
    billingType: 'per_property_per_month',
    monthlyCost: 45.00,
    monthlyPrice: 120.00,
    description: 'Cloud directory calling service for QXT-IC-20 entrance stations. Routes visitor calls to resident smartphones via HD video, manages delivery driver access PINs, and records entry photos.',
    features: [
      'Smartphone HD Video Calling via iOS & Android Apps',
      'Delivery Courier Master PINs for Amazon, UPS, FedEx, DoorDash',
      'Cloud Resident Directory Auto-Synchronized with PMS Roster',
      'Two-Way Audio with Remote Door Release Command'
    ]
  },
  {
    id: 'sw-pms',
    sku: 'QXT-SW-PMS',
    name: 'PMS Automated Bi-Directional Sync Integration',
    tier: 'Integration & Tours',
    billingType: 'per_property_per_month',
    monthlyCost: 40.00,
    monthlyPrice: 150.00,
    description: 'Certified API connectors for Yardi, RealPage, Entrata, MRI, and ResMan. Keeps resident accounts, move-in/out dates, and access credentials automatically in sync without double-entry.',
    features: [
      'Real-Time Roster Synchronization with Zero Manual Entry',
      'Automated Move-In Welcome Email with App Download & Credentials',
      'Automatic Immediate Credential Revocation on Move-Out Date',
      'Direct Support for Yardi Voyager, RealPage Onesite, Entrata, MRI, ResMan'
    ]
  },
  {
    id: 'sw-tours',
    sku: 'QXT-SW-TOURS',
    name: 'Self-Guided Touring & Prospect Access Module',
    tier: 'Integration & Tours',
    billingType: 'per_unit_per_month',
    monthlyCost: 0.80,
    monthlyPrice: 2.50,
    description: 'Prospect self-guided touring software. Generates time-bounded digital entry codes for prospective renters to tour model units and amenities after hours or without an escort.',
    features: [
      'Automated ID Verification & Temporary Passcode Dispatch',
      'Tour Path Enforced Access: Model Units + Amenity Corridors Only',
      'Leasing Agent Real-Time Tour Progression Notifications',
      'Follow-Up Application Link Texted Upon Tour Completion'
    ]
  },
  {
    id: 'sw-telemetry',
    sku: 'QXT-SW-TELEMETRY',
    name: 'Predictive Operations & Environmental Telemetry Cloud',
    tier: 'Base Platform',
    billingType: 'per_unit_per_month',
    monthlyCost: 0.60,
    monthlyPrice: 2.00,
    description: 'Advanced analytics engine for regional directors and maintenance leads. Analyzes temperature gradients, HVAC cycle frequencies, humidity trends, and LoRa gateway packet statistics.',
    features: [
      'Abnormal Humidity Spikes Detection (Mold Pre-Warning)',
      'HVAC Short-Cycling & Refrigerant Leak Early Diagnosis',
      'Property-Wide Energy Efficiency Benchmark Comparison',
      'LoRa Gateway RSSI Heatmap & Coverage Diagnostics'
    ]
  },
  {
    id: 'sw-mobile',
    sku: 'QXT-SW-MOBILE',
    name: 'Quext Resident Mobile App & IoT Smart Hub License',
    tier: 'Base Platform',
    billingType: 'per_unit_per_month',
    monthlyCost: 1.50,
    monthlyPrice: 4.00,
    description: 'All-in-one resident smartphone portal for Apple iOS and Google Android. Integrates smart deadbolt digital keys, climate control scheduling, leak warnings, Wi-Fi passwords, and community chat.',
    features: [
      'Native iOS & Android Mobile App with Biometric FaceID/Fingerprint Login',
      '1-Tap Digital Key Access with Apple Wallet & Google Wallet Integration',
      'Full Thermostat Remote Temperature Control & Energy Schedule Management',
      'Instant Resident Push Notifications for Maintenance & Leak Warnings',
      'Community Announcement Board & Amenity Reservation Passcode Generation'
    ]
  },
  {
    id: 'sw-sla',
    sku: 'QXT-SW-SLA',
    name: 'Quext 24/7 Enterprise Operations Monitoring & Hardware Replacement SLA',
    tier: 'Base Platform',
    billingType: 'per_property_per_month',
    monthlyCost: 120.00,
    monthlyPrice: 290.00,
    description: 'Enterprise operational service level agreement: proactive 24/7 cloud health pings, next-business-day expedited hardware swaps for failed field devices, and dedicated priority implementation hotline.',
    features: [
      'Continuous 24/7 Automated Cloud Gateway & Lock Heartbeat Monitoring',
      'Advance Hardware Replacement Dispatch with Pre-Paid Return Logistics',
      'Guaranteed 15-Minute Critical Outage Escalation SLA',
      'Dedicated Customer Success Manager (CSM) Monthly Operational Reviews'
    ]
  },
  {
    id: 'sw-esg',
    sku: 'QXT-SW-ESG',
    name: 'Quext ESG Carbon Footprint & Energy Sustainability Reporting Suite',
    tier: 'Climate & Energy',
    billingType: 'per_property_per_month',
    monthlyCost: 50.00,
    monthlyPrice: 150.00,
    description: 'Executive sustainability compliance reporting engine. Aggregates kilowatt-hour reductions, HVAC run-time curtailments, and water mitigation prevention metrics for institutional ESG audits.',
    features: [
      'GRESB & ENERGY STAR Certified Property Telemetry Export Formats',
      'Carbon Emissions Reduction Calculations from Automated Vacancy Drift',
      'Water Conservation & Leak Avoidance Catastrophic Loss Prevention Ledger',
      'Quarterly Executive PDF Reports for Institutional Investors and Lenders'
    ]
  },
  {
    id: 'sw-setup',
    sku: 'QXT-SW-SETUP',
    name: 'White-Glove Community Onboarding, Floor Plan CAD Ingestion & Portal Setup',
    tier: 'Base Platform',
    billingType: 'one_time',
    monthlyCost: 450.00,
    monthlyPrice: 1250.00,
    description: 'Comprehensive initial deployment configuration: digitization of architectural floor plans, common area access tree mapping, PMS rent roll integration, and staff credential encoding.',
    features: [
      'Architectural CAD Floor Plan Ingestion & GPS/RF Map Generation',
      'Complete Common Area Tree & Elevator Floor Access Matrix Setup',
      'Initial PMS Voyager / Entrata Database Bridge Commissioning',
      'Onsite Staff Video Training Session & Management Master Fob Commissioning'
    ]
  },
  {
    id: 'sw-calling',
    sku: 'QXT-SW-CALLING',
    name: 'Quext Cellular LTE Multi-Carrier Gateway Cloud Pool & High-Availability Failover',
    tier: 'Base Platform',
    billingType: 'per_property_per_month',
    monthlyCost: 35.00,
    monthlyPrice: 85.00,
    description: 'Private encrypted cellular backhaul data pool across AT&T and Verizon LTE Cat-M networks, ensuring gateways remain online even during property broadband outages.',
    features: [
      'Dual-Carrier eSIM Auto-Switching (AT&T FirstNet & Verizon Wireless)',
      'Unlimited M2M LoRa Packet Telemetry Data Pool',
      'Zero-Trust Private APN Tunnel Directly to Quext AWS IoT Core',
      'Instant Automatic Failover from Ethernet to Cellular Within 3 Seconds'
    ]
  }
];
