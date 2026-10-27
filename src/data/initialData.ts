import {
  Quote,
  OperationProject,
  ProjectMilestone,
  OperationMilestoneTitle,
  SOWForecastItem,
  ShippingDockItem,
  normalizeFieldTech,
  getProjectIntegratorPartners,
  checkAndApplyCsmHandoffAutoClose,
  isLockBOMItem,
  detectLockFamily,
  sanitizeLockSplits,
} from '../types';
import { buildProjectPrePackagedBundle } from '../partner-academy/utils/projectCoursePackager';
import { MYQUEXT_QUOTES, MYQUEXT_PROJECTS } from './myquextOpportunities';

export const INITIAL_QUOTES: Quote[] = MYQUEXT_QUOTES;

export const LEGACY_SAMPLE_QUOTES: Quote[] = [
  {
    id: '33om1u0TTgW3MYKO2FhH',
    quoteNumber: 'QXT-2026-8841',
    propertyName: 'The Vue at Grand Horizon',
    clientName: 'Greystar Real Estate Partners',
    address: '4500 Grand Horizon Blvd',
    city: 'Austin',
    state: 'TX',
    unitsCount: 248,
    stage: 'Deal Won',
    stageUpdatedAt: '2026-10-12T14:30:00Z',
    totalHardwareAmount: 184520,
    totalInstallAmount: 43400,
    monthlyServiceFee: 7440,
    assignedSalesLead: 'Sarah Jenkins',
    notes: 'Full turnkey deployment including Smart Access, Thermostats, LoRaWAN Gateways, Leak Detection, and Bulk Managed Wi-Fi 7.',
    bomItems: [
      {
        id: 'bom-33-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units & Common Amenities',
        quantity: 254,
        installedCount: 202,
        unitPrice: 220,
        lockFinishConfig: {
          family: 'befe',
          befeTrimStyle: 'Greenwich',
          befeColorFinish: '622 - Matte Black',
        },
        description: 'Integrated digital key deadbolt with NFC/BLE reader, hardened brass latch, and remote lock/unlock.',
      },
      {
        id: 'bom-33-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Residential Units',
        quantity: 248,
        installedCount: 188,
        unitPrice: 165,
        description: 'Hubless LoRaWAN thermostat with dual humidity sensing and automated vacant unit temperature drift control.',
      },
      {
        id: 'bom-33-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Rooftops & Clubhouse Tower',
        quantity: 4,
        installedCount: 4,
        unitPrice: 1250,
        description: 'IP67 rated 8-channel cellular-backhaul LoRa base station providing property-wide 915MHz coverage.',
      },
      {
        id: 'bom-33-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Water Heater Pan & Under Kitchen Sink (2/unit)',
        quantity: 496,
        installedCount: 340,
        unitPrice: 42,
        description: 'Instant conductivity alarm with LoRaWAN wireless telemetry and 5-year coin battery life.',
      },
      {
        id: 'bom-33-05',
        name: 'Quext Video Intercom & Perimeter Gate Reader',
        model: 'QXT-IC-20',
        category: 'Smart Access Control',
        location: 'Pedestrian Gates & Clubhouse Main Entrance',
        quantity: 6,
        installedCount: 5,
        unitPrice: 1850,
        description: 'Vandal-proof touchscreen video intercom with mobile directory calling and digital guest passes.',
      },
      {
        id: 'bom-33-06',
        name: 'Managed Wi-Fi 7 Bulk Access Point (Wallplate PoE+)',
        model: 'QXT-WF7-WP',
        category: 'Bulk Managed Wi-Fi',
        location: 'Unit Living Rooms & Clubhouse',
        quantity: 256,
        installedCount: 168,
        unitPrice: 195,
        description: 'Tri-band Wi-Fi 7 with integrated 4-port Gigabit switch for high-density smart multifamily living.',
      },
      {
        id: 'bom-33-07',
        name: 'Smart High-Load Water Heater 30A Relay Switch',
        model: 'QXT-SW-30A',
        category: 'Common Area & Utilities',
        location: 'Individual Unit Utility Closets',
        quantity: 248,
        installedCount: 120,
        unitPrice: 85,
        description: 'Auto-shutoff relay triggered by leak sensor alerts to prevent catastrophic water damage.',
      },
    ],
  },
  {
    id: 'kathryn-canals-55',
    quoteNumber: 'QXT-2026-8910',
    propertyName: 'The Kathryn on the Canals',
    clientName: 'Greystar Real Estate Partners',
    address: '4255 Cotton Gin Rd',
    city: 'Frisco',
    state: 'TX',
    unitsCount: 342,
    stage: 'Deal Won',
    stageUpdatedAt: '2026-10-14T11:00:00Z',
    totalHardwareAmount: 265400,
    totalInstallAmount: 62000,
    monthlyServiceFee: 10260,
    assignedSalesLead: 'Sarah Jenkins',
    notes: 'Canal-front community requiring water mitigation and mobile access for all unit balconies and dock gates.',
    bomItems: [
      {
        id: 'bom-kat-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units & Balconies',
        quantity: 342,
        installedCount: 220,
        unitPrice: 220,
        lockFinishConfig: {
          family: 'befe',
          befeTrimStyle: 'Addison',
          befeColorFinish: '619 - Satin Nickel',
        },
      },
      {
        id: 'bom-kat-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Units',
        quantity: 342,
        installedCount: 215,
        unitPrice: 165,
      },
      {
        id: 'bom-kat-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Canal Tower & Clubhouse',
        quantity: 5,
        installedCount: 5,
        unitPrice: 1250,
      },
      {
        id: 'bom-kat-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'All Unit Sinks & Water Heaters',
        quantity: 684,
        installedCount: 420,
        unitPrice: 42,
      },
      {
        id: 'bom-kat-05',
        name: 'Quext Perimeter Gate Reader / Dock Controller',
        model: 'QXT-IC-20',
        category: 'Smart Access Control',
        location: 'Marina Dock Gates & Pedestrian Entrances',
        quantity: 8,
        installedCount: 7,
        unitPrice: 1850,
      },
    ],
  },
  {
    id: 'parkside-craig-ranch-38',
    quoteNumber: 'QXT-2026-8772',
    propertyName: 'Parkside at Craig Ranch',
    clientName: 'Cortland Management',
    address: '6151 Collin McKinney Pkwy',
    city: 'McKinney',
    state: 'TX',
    unitsCount: 280,
    stage: 'Deal Won',
    stageUpdatedAt: '2026-10-09T15:20:00Z',
    totalHardwareAmount: 212000,
    totalInstallAmount: 49500,
    monthlyServiceFee: 8400,
    assignedSalesLead: 'Marcus Vance',
    notes: 'Suburban garden layout with comprehensive common area pool/fitness access control.',
    bomItems: [
      {
        id: 'bom-pk-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units',
        quantity: 280,
        installedCount: 160,
        unitPrice: 220,
      },
      {
        id: 'bom-pk-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Residential Units',
        quantity: 280,
        installedCount: 145,
        unitPrice: 165,
      },
      {
        id: 'bom-pk-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Buildings 1, 4, and 7 Roofs',
        quantity: 4,
        installedCount: 4,
        unitPrice: 1250,
      },
      {
        id: 'bom-pk-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Sinks & Laundry Closets',
        quantity: 560,
        installedCount: 280,
        unitPrice: 42,
      },
    ],
  },
  {
    id: 'domain-citycenter-92',
    quoteNumber: 'QXT-2026-9205',
    propertyName: 'The Domain at CityCenter',
    clientName: 'Lincoln Property Co.',
    address: '801 Town and Country Blvd',
    city: 'Houston',
    state: 'TX',
    unitsCount: 310,
    stage: 'Deal Won',
    stageUpdatedAt: '2026-10-11T16:45:00Z',
    totalHardwareAmount: 241000,
    totalInstallAmount: 55000,
    monthlyServiceFee: 9300,
    assignedSalesLead: 'Alex Romero',
    notes: 'Urban midrise over retail. Garage barrier arms and commercial elevators integrated.',
    bomItems: [
      {
        id: 'bom-dom-01',
        name: 'Quext Smart Mortise Lock (Keyless Entry)',
        model: 'QXT-ML-450',
        category: 'Smart Access Control',
        location: 'Midrise Units',
        quantity: 310,
        installedCount: 180,
        unitPrice: 280,
        lockFinishConfig: {
          family: 'xe360',
          xe360Subtype: 'Mortise',
          xe360ColorFinish: '622 - Matte Black',
          xe360LeverStyle: 'BRW - Broadway',
          xe360MortiseGrade: 'ANSI/BHMA Grade 1',
          xe360MortiseFunction: 'Interior push button (B)',
        },
      },
      {
        id: 'bom-dom-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Units',
        quantity: 310,
        installedCount: 175,
        unitPrice: 165,
      },
      {
        id: 'bom-dom-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Garage Top Deck & Elevator Shafts',
        quantity: 4,
        installedCount: 4,
        unitPrice: 1250,
      },
      {
        id: 'bom-dom-04',
        name: 'Managed Wi-Fi 7 Bulk Access Point',
        model: 'QXT-WF7-WP',
        category: 'Bulk Managed Wi-Fi',
        location: 'Living Rooms & Leasing Lounge',
        quantity: 310,
        installedCount: 120,
        unitPrice: 195,
      },
    ],
  },
  {
    id: 'lumina-midtown-64',
    quoteNumber: 'QXT-2026-9088',
    propertyName: 'Lumina at Midtown',
    clientName: 'Alliance Residential',
    address: '2900 Cityplace West Blvd',
    city: 'Dallas',
    state: 'TX',
    unitsCount: 260,
    stage: 'Deal Won',
    stageUpdatedAt: '2026-10-16T13:30:00Z',
    totalHardwareAmount: 198000,
    totalInstallAmount: 46000,
    monthlyServiceFee: 7800,
    assignedSalesLead: 'Sarah Jenkins',
    notes: 'Luxury smart living retrofit with smart water shutoff valves and Apple Wallet digital key access.',
    bomItems: [
      {
        id: 'bom-lum-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units',
        quantity: 260,
        installedCount: 140,
        unitPrice: 220,
      },
      {
        id: 'bom-lum-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Residential Units',
        quantity: 260,
        installedCount: 135,
        unitPrice: 165,
      },
      {
        id: 'bom-lum-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Rooftops',
        quantity: 3,
        installedCount: 3,
        unitPrice: 1250,
      },
      {
        id: 'bom-lum-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Kitchen & Bathrooms',
        quantity: 520,
        installedCount: 260,
        unitPrice: 42,
      },
    ],
  },
  {
    id: 'apex-tech-lofts-88',
    quoteNumber: 'QXT-2026-9024',
    propertyName: 'Apex Tech Park Lofts',
    clientName: 'Cortland Management',
    address: '128 Innovation Way',
    city: 'Denver',
    state: 'CO',
    unitsCount: 180,
    stage: 'Deal Won',
    stageUpdatedAt: '2026-10-15T09:15:00Z',
    totalHardwareAmount: 132400,
    totalInstallAmount: 31500,
    monthlyServiceFee: 5400,
    assignedSalesLead: 'Marcus Vance',
    notes: 'Converted from Proposal. Phase 1 scheduled for Buildings A & B.',
    bomItems: [
      {
        id: 'bom-apex-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units',
        quantity: 180,
        installedCount: 82,
        unitPrice: 220,
      },
      {
        id: 'bom-apex-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Residential Units',
        quantity: 180,
        installedCount: 75,
        unitPrice: 165,
      },
      {
        id: 'bom-apex-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Building A & B Parapets',
        quantity: 3,
        installedCount: 3,
        unitPrice: 1250,
      },
      {
        id: 'bom-apex-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Kitchen & HVAC Pans',
        quantity: 360,
        installedCount: 110,
        unitPrice: 42,
      },
      {
        id: 'bom-apex-05',
        name: 'Quext Elevator Access Control Interface',
        model: 'QXT-ELV-04',
        category: 'Smart Access Control',
        location: 'Elevator Cabs 1 & 2',
        quantity: 4,
        installedCount: 1,
        unitPrice: 1450,
      },
    ],
  },
  {
    id: 'solara-luxury-71',
    quoteNumber: 'QXT-2026-9148',
    propertyName: 'Solara Luxury Residences',
    clientName: 'Lincoln Property Co.',
    address: '890 Coastal Ave',
    city: 'Miami',
    state: 'FL',
    unitsCount: 320,
    stage: 'Deal Won',
    stageUpdatedAt: '2026-10-08T16:00:00Z',
    totalHardwareAmount: 248900,
    totalInstallAmount: 58000,
    monthlyServiceFee: 9600,
    assignedSalesLead: 'Sarah Jenkins',
    notes: 'High-rise tower with strict electrical subcontractor coordination.',
    bomItems: [
      {
        id: 'bom-sol-01',
        name: 'Quext Smart Mortise Lock (Keyless Entry)',
        model: 'QXT-ML-450',
        category: 'Smart Access Control',
        location: 'Tower Units (Floors 1-16)',
        quantity: 320,
        installedCount: 95,
        unitPrice: 280,
      },
      {
        id: 'bom-sol-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Units',
        quantity: 320,
        installedCount: 90,
        unitPrice: 165,
      },
      {
        id: 'bom-sol-03',
        name: 'Quext LoRaWAN Riser Repeater Station',
        model: 'QXT-GW-RP4',
        category: 'IoT Gateways & Mesh',
        location: 'Tower Risers (Floors 4, 8, 12, 16)',
        quantity: 5,
        installedCount: 2,
        unitPrice: 1100,
      },
      {
        id: 'bom-sol-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Luxury Kitchen & Utility Pans',
        quantity: 640,
        installedCount: 140,
        unitPrice: 42,
      },
      {
        id: 'bom-sol-05',
        name: 'Managed Wi-Fi 7 Bulk Access Point',
        model: 'QXT-WF7-WP',
        category: 'Bulk Managed Wi-Fi',
        location: 'All Tower Units',
        quantity: 320,
        installedCount: 65,
        unitPrice: 195,
      },
    ],
  },
  {
    id: 'summit-park-52',
    quoteNumber: 'QXT-2026-7730',
    propertyName: 'Summit Park Apartments',
    clientName: 'Camden Living',
    address: '740 Mountain View Dr',
    city: 'Phoenix',
    state: 'AZ',
    unitsCount: 140,
    stage: 'Deal Won',
    stageUpdatedAt: '2026-09-28T11:00:00Z',
    totalHardwareAmount: 104200,
    totalInstallAmount: 26000,
    monthlyServiceFee: 4200,
    assignedSalesLead: 'Alex Romero',
    notes: 'Garden style community nearing final handover.',
    bomItems: [
      {
        id: 'bom-sum-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'Residential Units',
        quantity: 140,
        installedCount: 138,
        unitPrice: 220,
      },
      {
        id: 'bom-sum-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'Residential Units',
        quantity: 140,
        installedCount: 135,
        unitPrice: 165,
      },
      {
        id: 'bom-sum-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Leasing Office Roof',
        quantity: 2,
        installedCount: 2,
        unitPrice: 1250,
      },
      {
        id: 'bom-sum-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Water Heater & AC Drain',
        quantity: 280,
        installedCount: 270,
        unitPrice: 42,
      },
    ],
  },
  {
    id: 'broadstone-travesia-22',
    quoteNumber: 'QXT-2026-9280',
    propertyName: 'Broadstone Travesia',
    clientName: 'Alliance Residential',
    address: '4301 Travesia Way',
    city: 'Austin',
    state: 'TX',
    unitsCount: 396,
    stage: 'Contract Review',
    stageUpdatedAt: '2026-10-19T14:00:00Z',
    totalHardwareAmount: 304000,
    totalInstallAmount: 71000,
    monthlyServiceFee: 11880,
    assignedSalesLead: 'Sarah Jenkins',
    notes: 'Master services contract sent for signature. Large-scale Austin smart deployment.',
    bomItems: [
      {
        id: 'bom-bt-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Units & Clubhouses',
        quantity: 396,
        installedCount: 0,
        unitPrice: 220,
      },
      {
        id: 'bom-bt-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Units',
        quantity: 396,
        installedCount: 0,
        unitPrice: 165,
      },
    ],
  },
  {
    id: 'mariners-cove-99',
    quoteNumber: 'QXT-2026-9311',
    propertyName: "Mariner's Cove Smart Community",
    clientName: 'Starwood Capital',
    address: '3200 Pelican Bay Rd',
    city: 'Tampa',
    state: 'FL',
    unitsCount: 290,
    stage: 'Contract Review',
    stageUpdatedAt: '2026-10-18T18:00:00Z',
    totalHardwareAmount: 215000,
    totalInstallAmount: 51000,
    monthlyServiceFee: 8700,
    assignedSalesLead: 'Marcus Vance',
    notes: 'Client reviewed Master Service Agreement. Marking Deal Won will generate implementation project automatically.',
    bomItems: [
      {
        id: 'bom-mc-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'Residential Units',
        quantity: 290,
        installedCount: 0,
        unitPrice: 220,
      },
      {
        id: 'bom-mc-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'Residential Units',
        quantity: 290,
        installedCount: 0,
        unitPrice: 165,
      },
    ],
  },
  {
    id: 'highland-ridge-44',
    quoteNumber: 'QXT-2026-9402',
    propertyName: 'Highland Ridge Commons',
    clientName: 'Cortland Management',
    address: '512 Ridgecrest Parkway',
    city: 'Charlotte',
    state: 'NC',
    unitsCount: 210,
    stage: 'Proposal Sent',
    stageUpdatedAt: '2026-10-19T10:00:00Z',
    totalHardwareAmount: 156000,
    totalInstallAmount: 37500,
    monthlyServiceFee: 6300,
    assignedSalesLead: 'Sarah Jenkins',
    notes: 'Initial quotation submitted. Awaiting board approval.',
    bomItems: [
      {
        id: 'bom-hr-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'Residential Units',
        quantity: 210,
        installedCount: 0,
        unitPrice: 220,
      },
      {
        id: 'bom-hr-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'Residential Units',
        quantity: 210,
        installedCount: 0,
        unitPrice: 165,
      },
    ],
  },
];

export const INITIAL_PROJECTS: OperationProject[] = MYQUEXT_PROJECTS;

export const LEGACY_SAMPLE_PROJECTS: OperationProject[] = [
  {
    id: '33om1u0TTgW3MYKO2FhH',
    quoteId: '33om1u0TTgW3MYKO2FhH',
    quoteNumber: 'QXT-2026-8841',
    propertyName: 'The Vue at Grand Horizon',
    clientName: 'Greystar Real Estate Partners',
    address: '4500 Grand Horizon Blvd',
    city: 'Austin',
    state: 'TX',
    unitsCount: 248,
    heroImage: '/src/assets/images/property_grand_horizon_1792605840266.jpg',
    assignedPM: {
      name: 'Raul Recalde',
      email: 'raul.recalde@onequext.com',
      role: 'Director of Implementation',
    },
    assignedCSM: 'Nicole Franklin',
    assignedFieldTech: 'Hector Lopez',
    integratorPartners: ['SKBM', 'Everbase'],
    statusTag: 'On Track',
    statusReason: 'Phase 2 Smart Deadbolts & Thermostats pacing 4 days ahead of scheduled October 31 milestone.',
    startDate: '2026-10-14',
    targetCompletionDate: '2026-11-15',
    lastUpdated: '2026-10-21T10:30:00Z',
    bomItems: [
      {
        id: 'bom-33-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units & Common Amenities',
        quantity: 254,
        installedCount: 202,
        unitPrice: 220,
        sparesCount: 10,
        sparesDelivered: true,
        lockFinishConfig: {
          family: 'befe',
          befeTrimStyle: 'Greenwich',
          befeColorFinish: '622 - Matte Black',
        },
        description: 'Integrated digital key deadbolt with NFC/BLE reader, hardened brass latch, and remote lock/unlock.',
        postItLogs: [
          {
            id: 'log-33-101',
            projectId: '33om1u0TTgW3MYKO2FhH',
            timestamp: '2026-10-21 09:45 AM',
            installerName: 'Austin Field Crew Alpha (Marco T.)',
            itemId: 'bom-33-01',
            itemName: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
            quantityCompleted: 24,
            locationCompleted: 'Building 4, Units 401 through 424',
            statusCheck: 'Verified & Online',
            notes: 'Calibrated door strike plates and provisioned Apple Wallet digital credentials for property management test master key.',
            color: 'yellow',
          },
        ],
      },
      {
        id: 'bom-33-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Residential Units',
        quantity: 248,
        installedCount: 188,
        unitPrice: 165,
        thermostatBrand: 'Quext',
        sparesCount: 8,
        sparesDelivered: false,
        description: 'Hubless LoRaWAN thermostat with dual humidity sensing and automated vacant unit temperature drift control.',
        postItLogs: [
          {
            id: 'log-33-102',
            projectId: '33om1u0TTgW3MYKO2FhH',
            timestamp: '2026-10-20 03:30 PM',
            installerName: 'Austin Field Crew Beta (Dave Chen)',
            itemId: 'bom-33-02',
            itemName: 'Quext IoT Smart Thermostat (LoRaWAN)',
            quantityCompleted: 28,
            locationCompleted: 'Building 3, Floors 2 & 3',
            statusCheck: 'Signal Testing Passed',
            notes: 'LoRaWAN RSSI verified at -78 dBm across all units. C-wire test passed 24V steady.',
            color: 'yellow',
          },
        ],
      },
      {
        id: 'bom-33-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Rooftops & Clubhouse Tower',
        quantity: 4,
        installedCount: 4,
        unitPrice: 1250,
        description: 'IP67 rated 8-channel cellular-backhaul LoRa base station providing property-wide 915MHz coverage.',
        postItLogs: [
          {
            id: 'log-33-103',
            projectId: '33om1u0TTgW3MYKO2FhH',
            timestamp: '2026-10-19 11:15 AM',
            installerName: 'Quext Network Deployment Team',
            itemId: 'bom-33-03',
            itemName: 'Quext LoRaWAN Outdoor Gateway Base Station',
            quantityCompleted: 2,
            locationCompleted: 'Clubhouse Tower & Building 2 Parapet',
            statusCheck: 'Verified & Online',
            notes: 'All 4 property gateways are now fully synced to Quext Cloud IoT core with LTE failover backup enabled.',
            color: 'yellow',
          },
        ],
      },
      {
        id: 'bom-33-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Water Heater Pan & Under Kitchen Sink (2/unit)',
        quantity: 496,
        installedCount: 340,
        unitPrice: 42,
        description: 'Instant conductivity alarm with LoRaWAN wireless telemetry and 5-year coin battery life.',
        postItLogs: [
          {
            id: 'log-33-104',
            projectId: '33om1u0TTgW3MYKO2FhH',
            timestamp: '2026-10-18 04:00 PM',
            installerName: 'Austin Field Crew Alpha',
            itemId: 'bom-33-04',
            itemName: 'Smart Flood & Water Leak Detector Pro',
            quantityCompleted: 60,
            locationCompleted: 'Building 1 & 2 Kitchen Sinks & Hot Water Closets',
            statusCheck: 'Verified & Online',
            notes: 'Moisture probe test triggered automatic LED flash and notification callback.',
            color: 'yellow',
          },
        ],
      },
      {
        id: 'bom-33-05',
        name: 'Quext Video Intercom & Perimeter Gate Reader',
        model: 'QXT-IC-20',
        category: 'Smart Access Control',
        location: 'Pedestrian Gates & Clubhouse Main Entrance',
        quantity: 6,
        installedCount: 5,
        unitPrice: 1850,
        description: 'Vandal-proof touchscreen video intercom with mobile directory calling and digital guest passes.',
      },
      {
        id: 'bom-33-06',
        name: 'Managed Wi-Fi 7 Bulk Access Point (Wallplate PoE+)',
        model: 'QXT-WF7-WP',
        category: 'Bulk Managed Wi-Fi',
        location: 'Unit Living Rooms & Clubhouse',
        quantity: 256,
        installedCount: 168,
        unitPrice: 195,
        description: 'Tri-band Wi-Fi 7 with integrated 4-port Gigabit switch for high-density smart multifamily living.',
      },
      {
        id: 'bom-33-07',
        name: 'Smart High-Load Water Heater 30A Relay Switch',
        model: 'QXT-SW-30A',
        category: 'Common Area & Utilities',
        location: 'Individual Unit Utility Closets',
        quantity: 248,
        installedCount: 120,
        unitPrice: 85,
        description: 'Auto-shutoff relay triggered by leak sensor alerts to prevent catastrophic water damage.',
      },
    ],
    installLogs: [
      {
        id: 'log-33-101',
        projectId: '33om1u0TTgW3MYKO2FhH',
        timestamp: '2026-10-21 09:45 AM',
        installerName: 'Austin Field Crew Alpha (Sean Gates)',
        itemId: 'bom-33-01',
        itemName: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        quantityCompleted: 24,
        locationCompleted: 'Building 4, Units 401 through 424',
        statusCheck: 'Verified & Online',
        notes: 'Calibrated door strike plates and provisioned Apple Wallet digital credentials for property management test master key.',
        itemNotes: 'Calibrated door strike plates and provisioned Apple Wallet digital credentials for property management test master key.',
        color: 'yellow',
        submittedByRole: 'field_tech',
        photos: [
          '/src/assets/images/schlage_befe_control_lock_1791238473031.jpg',
          '/src/assets/images/schlage_befe_control_lock_interior.png',
        ],
        audioNoteUrl: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAAAAAAAAAAAAAAA=',
        audioNoteDuration: 8,
      },
      {
        id: 'log-33-102',
        projectId: '33om1u0TTgW3MYKO2FhH',
        timestamp: '2026-10-20 03:30 PM',
        installerName: 'SKBM Partner Crew (Bill Meyers)',
        itemId: 'bom-33-02',
        itemName: 'Quext IoT Smart Thermostat (LoRaWAN)',
        quantityCompleted: 28,
        locationCompleted: 'Building 3, Floors 2 & 3',
        statusCheck: 'Signal Testing Passed',
        notes: 'LoRaWAN RSSI verified at -78 dBm across all units. C-wire test passed 24V steady.',
        itemNotes: 'LoRaWAN RSSI verified at -78 dBm across all units. C-wire test passed 24V steady.',
        color: 'yellow',
        submittedByRole: 'integrator_partner',
        photos: [
          '/src/assets/images/quext_iot_thermostat_1791229740444.jpg',
          '/src/assets/images/cover_quext_thermostat_1791385399191.jpg',
        ],
        audioNoteUrl: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAAAAAAAAAAAAAAA=',
        audioNoteDuration: 12,
      },
      {
        id: 'log-33-103',
        projectId: '33om1u0TTgW3MYKO2FhH',
        timestamp: '2026-10-19 11:15 AM',
        installerName: 'Quext Network Deployment Team',
        itemId: 'bom-33-03',
        itemName: 'Quext LoRaWAN Outdoor Gateway Base Station',
        quantityCompleted: 2,
        locationCompleted: 'Clubhouse Tower & Building 2 Parapet',
        statusCheck: 'Verified & Online',
        notes: 'All 4 property gateways are now fully synced to Quext Cloud IoT core with LTE failover backup enabled.',
        itemNotes: 'Base station antenna torqued to spec, LTE failover verified on carrier test.',
        color: 'yellow',
        submittedByRole: 'field_tech',
        photos: [
          '/src/assets/images/tektelic_gateway_iot_1791238061805.jpg',
        ],
        audioNoteUrl: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAAAAAAAAAAAAAAA=',
        audioNoteDuration: 6,
      },
      {
        id: 'log-33-104',
        projectId: '33om1u0TTgW3MYKO2FhH',
        timestamp: '2026-10-18 04:00 PM',
        installerName: 'Austin Field Crew Alpha',
        itemId: 'bom-33-04',
        itemName: 'Smart Flood & Water Leak Detector Pro',
        quantityCompleted: 60,
        locationCompleted: 'Building 1 & 2 Kitchen Sinks & Hot Water Closets',
        statusCheck: 'Verified & Online',
        notes: 'Moisture probe test triggered automatic LED flash and notification callback.',
        color: 'yellow',
      },
    ],
    notes: [
      {
        id: 'note-33-01',
        projectId: '33om1u0TTgW3MYKO2FhH',
        author: 'Raul Recalde',
        timestamp: '2026-10-21 08:30 AM',
        category: 'General Context',
        text: 'Met with Greystar Regional Property Manager (Elena Vance) this morning. Walkthrough of Buildings 1 & 2 completed with zero punch list defects. Building 4 doors accepted new deadbolt mortises smoothly.',
        isPinned: true,
      },
      {
        id: 'note-33-02',
        projectId: '33om1u0TTgW3MYKO2FhH',
        author: 'Raul Recalde',
        timestamp: '2026-10-20 01:15 PM',
        category: 'Site Access & Keys',
        text: 'Maintenance crew granted master key badge clearance for all risers. Wi-Fi 7 cabling drops in Building 4 are 100% terminated by the low-voltage contractor.',
        isPinned: false,
      },
    ],
    milestones: [
      { id: 'm1-1', title: 'Project kickoff', status: 'Completed', targetDate: '2026-10-14' },
      { id: 'm1-2', title: 'Portal Buildout', status: 'Completed', targetDate: '2026-10-16' },
      { id: 'm1-4', title: 'Product Acquisition', status: 'Completed', targetDate: '2026-10-20' },
      { id: 'm1-5', title: 'CSM Intro - Pre-implementation', status: 'Completed', targetDate: '2026-10-23' },
      { id: 'm1-6', title: 'Implementation', status: 'In Progress', targetDate: '2026-10-31' },
      { id: 'm1-7', title: 'CSM Handoff', status: 'Upcoming', targetDate: '2026-11-08' },
      { id: 'm1-8', title: 'Project Closed', status: 'Upcoming', targetDate: '2026-11-15' },
    ],
    customerIntake: {
      pmsSoftware: 'Yardi',
      walkthroughCompleted: true,
      subscriberEmail: 'elena.vance@greystar.com',
      emailUpdatesCadence: 'weekly',
      commonAreaDoors: [
        { id: 'cad-33-01', doorName: 'Clubhouse Main Entry', buildingOrArea: 'Clubhouse Main Level', installedStatus: 'Installed & Online' },
        { id: 'cad-33-02', doorName: 'Fitness Center North', buildingOrArea: 'Amenity Center', installedStatus: 'Installed & Online' },
        { id: 'cad-33-03', doorName: 'Sky Lounge Pool Access', buildingOrArea: 'Building 4 Level 3', installedStatus: 'Wired & Calibrated' },
      ],
      doorsConfirmedByCustomer: true,
      staffRoles: [
        { id: 'sr-1', firstName: 'Elena', lastName: 'Vance', email: 'elena.vance@greystar.com', phoneNumber: '(512) 555-8901', permissionLevel: 'Manager', roleOrTitle: 'Regional Property Director' },
        { id: 'sr-2', firstName: 'Marcus', lastName: 'Bell', email: 'marcus.bell@greystar.com', phoneNumber: '(512) 555-8902', permissionLevel: 'Staff', roleOrTitle: 'Lead Maintenance Tech' },
      ],
    },
    communityDetails: {
      pmsSystem: 'Yardi Voyager',
      projectType: 'Retrofit / Occupied',
      stagingLocation: 'Clubhouse Basement / Vacant Unit 104',
      staffEscortRequired: false,
      officeHours: '9:00 AM - 6:00 PM Mon-Fri',
      installWorkingHours: '9:00 AM - 5:00 PM Mon-Fri',
      masterFobsKnoxBox: 'Fire Knox Box #4 & 2 Master Fobs Provided',
      nfcWalletConfigured: true,
      csmName: 'Nicole Franklin',
      fieldOpsLead: 'Sean Gates',
    },
  },
  {
    id: 'kathryn-canals-55',
    quoteId: 'kathryn-canals-55',
    quoteNumber: 'QXT-2026-8910',
    propertyName: 'The Kathryn on the Canals',
    clientName: 'Greystar Real Estate Partners',
    address: '4255 Cotton Gin Rd',
    city: 'Frisco',
    state: 'TX',
    unitsCount: 342,
    heroImage: '/src/assets/images/property_grand_horizon_1792605840266.jpg',
    assignedPM: {
      name: 'Bethany Condon',
      email: 'bethany.condon@onequext.com',
      role: 'Project Manager',
    },
    assignedCSM: 'Jasmine Hunt',
    assignedFieldTech: 'Sean Gates',
    integratorPartners: ['ATB'],
    statusTag: 'On Track',
    statusReason: 'Dock and marina perimeter access readers completed. Units in Building 2 active.',
    startDate: '2026-10-14',
    targetCompletionDate: '2026-11-30',
    lastUpdated: '2026-10-21T09:30:00Z',
    bomItems: [
      {
        id: 'bom-kat-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units & Balconies',
        quantity: 342,
        installedCount: 220,
        unitPrice: 220,
        lockFinishConfig: {
          family: 'befe',
          befeTrimStyle: 'Addison',
          befeColorFinish: '619 - Satin Nickel',
        },
        postItLogs: [
          {
            id: 'log-kat-01',
            projectId: 'kathryn-canals-55',
            timestamp: '2026-10-20 02:30 PM',
            installerName: 'DFW Tech Crew A',
            itemId: 'bom-kat-01',
            itemName: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
            quantityCompleted: 40,
            locationCompleted: 'Building 2 Balcony Corridors',
            statusCheck: 'Verified & Online',
            notes: 'Digital key guest passes verified with onsite leasing staff.',
            color: 'yellow',
          },
        ],
      },
      {
        id: 'bom-kat-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Units',
        quantity: 342,
        installedCount: 215,
        unitPrice: 165,
      },
      {
        id: 'bom-kat-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Canal Tower & Clubhouse',
        quantity: 5,
        installedCount: 5,
        unitPrice: 1250,
      },
      {
        id: 'bom-kat-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'All Unit Sinks & Water Heaters',
        quantity: 684,
        installedCount: 420,
        unitPrice: 42,
      },
      {
        id: 'bom-kat-05',
        name: 'Quext Perimeter Gate Reader / Dock Controller',
        model: 'QXT-IC-20',
        category: 'Smart Access Control',
        location: 'Marina Dock Gates & Pedestrian Entrances',
        quantity: 8,
        installedCount: 7,
        unitPrice: 1850,
      },
    ],
    installLogs: [
      {
        id: 'log-kat-01',
        projectId: 'kathryn-canals-55',
        timestamp: '2026-10-20 02:30 PM',
        installerName: 'DFW Tech Crew A',
        itemId: 'bom-kat-01',
        itemName: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        quantityCompleted: 40,
        locationCompleted: 'Building 2 Balcony Corridors',
        statusCheck: 'Verified & Online',
        notes: 'Digital key guest passes verified with onsite leasing staff.',
        color: 'yellow',
      },
    ],
    notes: [
      {
        id: 'note-kat-01',
        projectId: 'kathryn-canals-55',
        author: 'Raul Recalde',
        timestamp: '2026-10-20 04:00 PM',
        category: 'General Context',
        text: 'Coordinating with Greystar property manager for marina dock gate testing on Thursday morning.',
        isPinned: true,
      },
    ],
    milestones: [
      { id: 'm-kat-1', title: 'Project kickoff', status: 'Completed', targetDate: '2026-10-14' },
      { id: 'm-kat-2', title: 'Portal Buildout', status: 'Completed', targetDate: '2026-10-16' },
      { id: 'm-kat-4', title: 'Product Acquisition', status: 'Completed', targetDate: '2026-10-20' },
      { id: 'm-kat-5', title: 'CSM Intro - Pre-implementation', status: 'Completed', targetDate: '2026-10-24' },
      { id: 'm-kat-6', title: 'Implementation', status: 'In Progress', targetDate: '2026-11-10' },
      { id: 'm-kat-7', title: 'CSM Handoff', status: 'Upcoming', targetDate: '2026-11-20' },
      { id: 'm-kat-8', title: 'Project Closed', status: 'Upcoming', targetDate: '2026-11-30' },
    ],
  },
  {
    id: 'parkside-craig-ranch-38',
    quoteId: 'parkside-craig-ranch-38',
    quoteNumber: 'QXT-2026-8772',
    propertyName: 'Parkside at Craig Ranch',
    clientName: 'Cortland Management',
    address: '6151 Collin McKinney Pkwy',
    city: 'McKinney',
    state: 'TX',
    unitsCount: 280,
    heroImage: '/src/assets/images/property_apex_lofts_1792605841159.jpg',
    assignedPM: {
      name: 'Megan Rossman',
      email: 'megan.rossman@onequext.com',
      role: 'Project Manager',
    },
    assignedCSM: 'Tessa Peshke',
    assignedFieldTech: 'Hector Lopez',
    integratorPartners: ['SBH'],
    statusTag: 'On Track',
    statusReason: 'Garden buildings 1-4 completed. Subcontractors working on clubhouse lockset.',
    startDate: '2026-10-09',
    targetCompletionDate: '2026-11-12',
    lastUpdated: '2026-10-21T08:00:00Z',
    bomItems: [
      {
        id: 'bom-pk-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units',
        quantity: 280,
        installedCount: 160,
        unitPrice: 220,
      },
      {
        id: 'bom-pk-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Residential Units',
        quantity: 280,
        installedCount: 145,
        unitPrice: 165,
      },
      {
        id: 'bom-pk-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Buildings 1, 4, and 7 Roofs',
        quantity: 4,
        installedCount: 4,
        unitPrice: 1250,
      },
      {
        id: 'bom-pk-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Sinks & Laundry Closets',
        quantity: 560,
        installedCount: 280,
        unitPrice: 42,
      },
    ],
    installLogs: [
      {
        id: 'log-pk-01',
        projectId: 'parkside-craig-ranch-38',
        timestamp: '2026-10-19 01:15 PM',
        installerName: 'Texas Low Voltage Systems',
        itemId: 'bom-pk-01',
        itemName: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        quantityCompleted: 35,
        locationCompleted: 'Buildings 3 & 4 Upper Floors',
        statusCheck: 'Verified & Online',
        notes: 'Door fitment verified and strike plates centered.',
        color: 'yellow',
      },
    ],
    notes: [
      {
        id: 'note-pk-01',
        projectId: 'parkside-craig-ranch-38',
        author: 'Raul Recalde',
        timestamp: '2026-10-19 03:00 PM',
        category: 'Hardware Delivery',
        text: 'Remaining batch of 120 deadbolts verified in property storage.',
        isPinned: false,
      },
    ],
    milestones: [
      { id: 'm-pk-1', title: 'Project kickoff', status: 'Completed', targetDate: '2026-10-09' },
      { id: 'm-pk-2', title: 'Portal Buildout', status: 'Completed', targetDate: '2026-10-11' },
      { id: 'm-pk-4', title: 'Product Acquisition', status: 'Completed', targetDate: '2026-10-16' },
      { id: 'm-pk-5', title: 'CSM Intro - Pre-implementation', status: 'Completed', targetDate: '2026-10-20' },
      { id: 'm-pk-6', title: 'Implementation', status: 'In Progress', targetDate: '2026-10-30' },
      { id: 'm-pk-7', title: 'CSM Handoff', status: 'Upcoming', targetDate: '2026-11-05' },
      { id: 'm-pk-8', title: 'Project Closed', status: 'Upcoming', targetDate: '2026-11-12' },
    ],
  },
  {
    id: 'domain-citycenter-92',
    quoteId: 'domain-citycenter-92',
    quoteNumber: 'QXT-2026-9205',
    propertyName: 'The Domain at CityCenter',
    clientName: 'Lincoln Property Co.',
    address: '801 Town and Country Blvd',
    city: 'Houston',
    state: 'TX',
    unitsCount: 310,
    heroImage: '/src/assets/images/property_grand_horizon_1792605840266.jpg',
    assignedPM: {
      name: 'Raul Recalde',
      email: 'raul.recalde@onequext.com',
      role: 'Director of Implementation',
    },
    assignedCSM: 'Branden Girman',
    assignedFieldTech: 'Sean Gates',
    statusTag: 'Behind Schedule',
    statusReason: 'Garage gate controller wiring requiring CityCenter commercial retail security conduit sign-off.',
    startDate: '2026-10-11',
    targetCompletionDate: '2026-11-25',
    lastUpdated: '2026-10-21T07:15:00Z',
    bomItems: [
      {
        id: 'bom-dom-01',
        name: 'Quext Smart Mortise Lock (Keyless Entry)',
        model: 'QXT-ML-450',
        category: 'Smart Access Control',
        location: 'Midrise Units',
        quantity: 310,
        installedCount: 180,
        unitPrice: 280,
        lockFinishConfig: {
          family: 'xe360',
          xe360Subtype: 'Mortise',
          xe360ColorFinish: '622 - Matte Black',
          xe360LeverStyle: 'BRW - Broadway',
          xe360MortiseGrade: 'ANSI/BHMA Grade 1',
          xe360MortiseFunction: 'Interior push button (B)',
        },
      },
      {
        id: 'bom-dom-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Units',
        quantity: 310,
        installedCount: 175,
        unitPrice: 165,
      },
      {
        id: 'bom-dom-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Garage Top Deck & Elevator Shafts',
        quantity: 4,
        installedCount: 4,
        unitPrice: 1250,
      },
      {
        id: 'bom-dom-04',
        name: 'Managed Wi-Fi 7 Bulk Access Point',
        model: 'QXT-WF7-WP',
        category: 'Bulk Managed Wi-Fi',
        location: 'Living Rooms & Leasing Lounge',
        quantity: 310,
        installedCount: 120,
        unitPrice: 195,
      },
    ],
    installLogs: [],
    notes: [
      {
        id: 'note-dom-01',
        projectId: 'domain-citycenter-92',
        author: 'Raul Recalde',
        timestamp: '2026-10-20 09:00 AM',
        category: 'Site Access & Keys',
        text: 'Conduit inspection scheduled for Tuesday with retail master association.',
        isPinned: true,
      },
    ],
    milestones: [
      { id: 'm-dom-1', title: 'Project kickoff', status: 'Completed', targetDate: '2026-10-12' },
      { id: 'm-dom-2', title: 'Portal Buildout', status: 'Completed', targetDate: '2026-10-14' },
      { id: 'm-dom-4', title: 'Product Acquisition', status: 'Completed', targetDate: '2026-10-19' },
      { id: 'm-dom-5', title: 'CSM Intro - Pre-implementation', status: 'Completed', targetDate: '2026-10-24' },
      { id: 'm-dom-6', title: 'Implementation', status: 'In Progress', targetDate: '2026-11-10' },
      { id: 'm-dom-7', title: 'CSM Handoff', status: 'Upcoming', targetDate: '2026-11-18' },
      { id: 'm-dom-8', title: 'Project Closed', status: 'Upcoming', targetDate: '2026-11-25' },
    ],
  },
  {
    id: 'lumina-midtown-64',
    quoteId: 'lumina-midtown-64',
    quoteNumber: 'QXT-2026-9088',
    propertyName: 'Lumina at Midtown',
    clientName: 'Alliance Residential',
    address: '2900 Cityplace West Blvd',
    city: 'Dallas',
    state: 'TX',
    unitsCount: 260,
    heroImage: '/src/assets/images/property_apex_lofts_1792605841159.jpg',
    assignedPM: {
      name: 'Bethany Condon',
      email: 'bethany.condon@onequext.com',
      role: 'Project Manager',
    },
    assignedCSM: 'Kennedy Staiger',
    assignedFieldTech: 'Hector Lopez',
    integratorPartners: ['SKBM'],
    statusTag: 'On Track',
    statusReason: 'Smart water shutoff relays and in-unit deadbolts passing commissioning tests.',
    startDate: '2026-10-16',
    targetCompletionDate: '2026-11-20',
    lastUpdated: '2026-10-21T10:00:00Z',
    bomItems: [
      {
        id: 'bom-lum-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units',
        quantity: 260,
        installedCount: 140,
        unitPrice: 220,
      },
      {
        id: 'bom-lum-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Residential Units',
        quantity: 260,
        installedCount: 135,
        unitPrice: 165,
      },
      {
        id: 'bom-lum-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Rooftops',
        quantity: 3,
        installedCount: 3,
        unitPrice: 1250,
      },
      {
        id: 'bom-lum-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Kitchen & Bathrooms',
        quantity: 520,
        installedCount: 260,
        unitPrice: 42,
      },
    ],
    installLogs: [],
    notes: [],
    milestones: [
      { id: 'm-lum-1', title: 'Project kickoff', status: 'Completed', targetDate: '2026-10-16' },
      { id: 'm-lum-2', title: 'Portal Buildout', status: 'Completed', targetDate: '2026-10-18' },
      { id: 'm-lum-4', title: 'Product Acquisition', status: 'Completed', targetDate: '2026-10-22' },
      { id: 'm-lum-5', title: 'CSM Intro - Pre-implementation', status: 'Completed', targetDate: '2026-10-26' },
      { id: 'm-lum-6', title: 'Implementation', status: 'In Progress', targetDate: '2026-11-08' },
      { id: 'm-lum-7', title: 'CSM Handoff', status: 'Upcoming', targetDate: '2026-11-15' },
      { id: 'm-lum-8', title: 'Project Closed', status: 'Upcoming', targetDate: '2026-11-20' },
    ],
  },
  {
    id: 'apex-tech-lofts-88',
    quoteId: 'apex-tech-lofts-88',
    quoteNumber: 'QXT-2026-9024',
    propertyName: 'Apex Tech Park Lofts',
    clientName: 'Cortland Management',
    address: '128 Innovation Way',
    city: 'Denver',
    state: 'CO',
    unitsCount: 180,
    heroImage: '/src/assets/images/property_apex_lofts_1792605841159.jpg',
    assignedPM: {
      name: 'Megan Rossman',
      email: 'megan.rossman@onequext.com',
      role: 'Director of Operations',
    },
    assignedCSM: 'Nicole Franklin',
    assignedFieldTech: 'Sean Gates',
    integratorPartners: ['JTS'],
    statusTag: 'Behind Schedule',
    statusReason: 'Elevator access control interface installation delayed by local OTIS elevator modernization inspector review; rescheduling for Friday.',
    startDate: '2026-10-15',
    targetCompletionDate: '2026-10-12',
    lastUpdated: '2026-10-21T08:15:00Z',
    bomItems: [
      {
        id: 'bom-apex-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'All Residential Units',
        quantity: 180,
        installedCount: 82,
        unitPrice: 220,
        sparesCount: 8,
        sparesDelivered: true,
      },
      {
        id: 'bom-apex-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Residential Units',
        quantity: 180,
        installedCount: 75,
        unitPrice: 165,
        thermostatBrand: 'Honeywell',
        sparesCount: 6,
        sparesDelivered: false,
      },
      {
        id: 'bom-apex-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Building A & B Parapets',
        quantity: 3,
        installedCount: 3,
        unitPrice: 1250,
      },
      {
        id: 'bom-apex-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Kitchen & HVAC Pans',
        quantity: 360,
        installedCount: 110,
        unitPrice: 42,
      },
      {
        id: 'bom-apex-05',
        name: 'Quext Elevator Access Control Interface',
        model: 'QXT-ELV-04',
        category: 'Smart Access Control',
        location: 'Elevator Cabs 1 & 2',
        quantity: 4,
        installedCount: 1,
        unitPrice: 1450,
      },
    ],
    installLogs: [
      {
        id: 'log-apex-01',
        projectId: 'apex-tech-lofts-88',
        timestamp: '2026-10-20 02:00 PM',
        installerName: 'Rocky Mountain Low Voltage (Lead: Sam K.)',
        itemId: 'bom-apex-01',
        itemName: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        quantityCompleted: 30,
        locationCompleted: 'Building B, 2nd Floor Corridor',
        statusCheck: 'Verified & Online',
        notes: 'Door prep completed. Tested latch retraction and digital guest pass access.',
        color: 'yellow',
      },
    ],
    notes: [
      {
        id: 'note-apex-01',
        projectId: 'apex-tech-lofts-88',
        author: 'Raul Recalde',
        timestamp: '2026-10-20 04:45 PM',
        category: 'Site Access & Keys',
        text: 'Elevator technician signoff requires permit addendum from city inspector. We have prioritized in-unit locks and thermostats while elevator clearance is processed.',
        isPinned: true,
      },
    ],
    milestones: [
      { id: 'm-ap-1', title: 'Project kickoff', status: 'Completed', targetDate: '2026-10-15' },
      { id: 'm-ap-2', title: 'Portal Buildout', status: 'Completed', targetDate: '2026-10-17' },
      { id: 'm-ap-4', title: 'Product Acquisition', status: 'Completed', targetDate: '2026-10-20' },
      { id: 'm-ap-5', title: 'CSM Intro - Pre-implementation', status: 'Completed', targetDate: '2026-10-24' },
      { id: 'm-ap-6', title: 'Implementation', status: 'In Progress', targetDate: '2026-11-05' },
      { id: 'm-ap-7', title: 'CSM Handoff', status: 'Upcoming', targetDate: '2026-11-12' },
      { id: 'm-ap-8', title: 'Project Closed', status: 'Upcoming', targetDate: '2026-11-20' },
    ],
  },
  {
    id: 'solara-luxury-71',
    quoteId: 'solara-luxury-71',
    quoteNumber: 'QXT-2026-9148',
    propertyName: 'Solara Luxury Residences',
    clientName: 'Lincoln Property Co.',
    address: '890 Coastal Ave',
    city: 'Miami',
    state: 'FL',
    unitsCount: 320,
    heroImage: '/src/assets/images/property_grand_horizon_1792605840266.jpg',
    assignedPM: {
      name: 'Raul Recalde',
      email: 'raul.recalde@onequext.com',
      role: 'Director of Implementation',
    },
    assignedCSM: 'Jasmine Hunt',
    assignedFieldTech: 'Hector Lopez',
    integratorPartners: ['ATB', 'SBH'],
    statusTag: 'High Risk',
    statusReason: 'Electrical contractor delayed delivery of PoE+ switches for high-rise riser floors 9-16. Subcontractor meeting called for 2:00 PM.',
    startDate: '2026-10-08',
    targetCompletionDate: '2026-10-02',
    lastUpdated: '2026-10-21T07:45:00Z',
    bomItems: [
      {
        id: 'bom-sol-01',
        name: 'Quext Smart Mortise Lock (Keyless Entry)',
        model: 'QXT-ML-450',
        category: 'Smart Access Control',
        location: 'Tower Units (Floors 1-16)',
        quantity: 320,
        installedCount: 95,
        unitPrice: 280,
        sparesCount: 16,
        sparesDelivered: false,
      },
      {
        id: 'bom-sol-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'All Units',
        quantity: 320,
        installedCount: 90,
        unitPrice: 165,
        thermostatBrand: 'Quext',
        sparesCount: 12,
        sparesDelivered: false,
      },
      {
        id: 'bom-sol-03',
        name: 'Quext LoRaWAN Riser Repeater Station',
        model: 'QXT-GW-RP4',
        category: 'IoT Gateways & Mesh',
        location: 'Tower Risers (Floors 4, 8, 12, 16)',
        quantity: 5,
        installedCount: 2,
        unitPrice: 1100,
      },
      {
        id: 'bom-sol-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Luxury Kitchen & Utility Pans',
        quantity: 640,
        installedCount: 140,
        unitPrice: 42,
      },
      {
        id: 'bom-sol-05',
        name: 'Managed Wi-Fi 7 Bulk Access Point',
        model: 'QXT-WF7-WP',
        category: 'Bulk Managed Wi-Fi',
        location: 'All Tower Units',
        quantity: 320,
        installedCount: 65,
        unitPrice: 195,
      },
    ],
    installLogs: [
      {
        id: 'log-sol-01',
        projectId: 'solara-luxury-71',
        timestamp: '2026-10-19 04:15 PM',
        installerName: 'Florida Smart Home Contractors',
        itemId: 'bom-sol-01',
        itemName: 'Quext Smart Mortise Lock (Keyless Entry)',
        quantityCompleted: 20,
        locationCompleted: 'Tower Level 4 (Units 401-420)',
        statusCheck: 'Verified & Online',
        notes: 'Mortise pockets needed minor router trimming for weather stripping clearance.',
        color: 'yellow',
      },
    ],
    notes: [
      {
        id: 'note-sol-01',
        projectId: 'solara-luxury-71',
        author: 'Raul Recalde',
        timestamp: '2026-10-21 07:30 AM',
        category: 'Inspection & Commissioning',
        text: 'Escalated PoE switch availability with general contractor. High risk flag remains active until riser switch gear is mounted.',
        isPinned: true,
      },
    ],
    milestones: [
      { id: 'm-sol-1', title: 'Project kickoff', status: 'Completed', targetDate: '2026-10-08' },
      { id: 'm-sol-2', title: 'Portal Buildout', status: 'Completed', targetDate: '2026-10-12' },
      { id: 'm-sol-4', title: 'Product Acquisition', status: 'In Progress', targetDate: '2026-10-26' },
      { id: 'm-sol-5', title: 'CSM Intro - Pre-implementation', status: 'Upcoming', targetDate: '2026-11-04' },
      { id: 'm-sol-6', title: 'Implementation', status: 'Upcoming', targetDate: '2026-11-12' },
      { id: 'm-sol-7', title: 'CSM Handoff', status: 'Upcoming', targetDate: '2026-11-22' },
      { id: 'm-sol-8', title: 'Project Closed', status: 'Upcoming', targetDate: '2026-12-01' },
    ],
  },
  {
    id: 'summit-park-52',
    quoteId: 'summit-park-52',
    quoteNumber: 'QXT-2026-7730',
    propertyName: 'Summit Park Apartments',
    clientName: 'Camden Living',
    address: '740 Mountain View Dr',
    city: 'Phoenix',
    state: 'AZ',
    unitsCount: 140,
    heroImage: '/src/assets/images/property_apex_lofts_1792605841159.jpg',
    assignedPM: {
      name: 'Bethany Condon',
      email: 'bethany.condon@onequext.com',
      role: 'Project Manager',
    },
    assignedCSM: 'Tessa Peshke',
    assignedFieldTech: 'Sean Gates',
    integratorPartners: ['Everbase'],
    statusTag: 'On Track',
    statusReason: 'Hardware installation 97% complete. Punch list review scheduled for tomorrow afternoon.',
    startDate: '2026-09-28',
    targetCompletionDate: '2026-10-25',
    lastUpdated: '2026-10-20T17:00:00Z',
    bomItems: [
      {
        id: 'bom-sum-01',
        name: 'Quext Smart Deadbolt Lock (BLE & Apple Wallet)',
        model: 'QXT-DL-900',
        category: 'Smart Access Control',
        location: 'Residential Units',
        quantity: 140,
        installedCount: 138,
        unitPrice: 220,
      },
      {
        id: 'bom-sum-02',
        name: 'Quext IoT Smart Thermostat (LoRaWAN)',
        model: 'QXT-TH-300',
        category: 'Smart Thermostats & HVAC',
        location: 'Residential Units',
        quantity: 140,
        installedCount: 135,
        unitPrice: 165,
      },
      {
        id: 'bom-sum-03',
        name: 'Quext LoRaWAN Outdoor Gateway Base Station',
        model: 'QXT-GW-LR8',
        category: 'IoT Gateways & Mesh',
        location: 'Leasing Office Roof',
        quantity: 2,
        installedCount: 2,
        unitPrice: 1250,
      },
      {
        id: 'bom-sum-04',
        name: 'Smart Flood & Water Leak Detector Pro',
        model: 'QXT-LK-100',
        category: 'Sensors & Leak Protection',
        location: 'Water Heater & AC Drain',
        quantity: 280,
        installedCount: 270,
        unitPrice: 42,
      },
    ],
    installLogs: [
      {
        id: 'log-sum-01',
        projectId: 'summit-park-52',
        timestamp: '2026-10-20 11:00 AM',
        installerName: 'Desert Tech Solutions (Lead: Tyler B.)',
        itemId: 'bom-sum-04',
        itemName: 'Smart Flood & Water Leak Detector Pro',
        quantityCompleted: 40,
        locationCompleted: 'Buildings 6 & 7',
        statusCheck: 'Verified & Online',
        notes: 'Final batch of leak detectors placed. Signal reception confirmed at 915 MHz with 100% packet receipt.',
        color: 'yellow',
      },
    ],
    notes: [
      {
        id: 'note-sum-01',
        projectId: 'summit-park-52',
        author: 'Raul Recalde',
        timestamp: '2026-10-20 04:00 PM',
        category: 'Resident Notice',
        text: 'On-site leasing staff trained on Quext Staff Dashboard. Ready for final resident credential generation on Monday.',
        isPinned: false,
      },
    ],
    csmHandoffEnteredAt: '2026-10-18',
    milestones: [
      { id: 'm-sum-1', title: 'Project kickoff', status: 'Completed', targetDate: '2026-09-28' },
      { id: 'm-sum-2', title: 'Portal Buildout', status: 'Completed', targetDate: '2026-10-02' },
      { id: 'm-sum-4', title: 'Product Acquisition', status: 'Completed', targetDate: '2026-10-08' },
      { id: 'm-sum-5', title: 'CSM Intro - Pre-implementation', status: 'Completed', targetDate: '2026-10-12' },
      { id: 'm-sum-6', title: 'Implementation', status: 'Completed', targetDate: '2026-10-18' },
      { id: 'm-sum-7', title: 'CSM Handoff', status: 'In Progress', targetDate: '2026-10-23', startedAt: '2026-10-18' },
      { id: 'm-sum-8', title: 'Project Closed', status: 'Upcoming', targetDate: '2026-10-25' },
    ],
  },
];

const STORAGE_KEY_QUOTES = 'quext_myquext_live_quotes_v1';
const STORAGE_KEY_PROJECTS = 'quext_myquext_live_projects_v1';

export function buildDefaultSOWForecastItems(project: Partial<OperationProject>): SOWForecastItem[] {
  const bom = project.bomItems || [];
  if (bom.length === 0) return [];
  const installer = (project.integratorPartners && project.integratorPartners[0]) || 'SKBM';
  return bom.slice(0, 4).map((item, idx) => {
    const remaining = Math.max(0, item.quantity - (item.installedCount || 0));
    const forecastedQty = remaining > 0 ? remaining : item.quantity;
    return {
      id: `sow-${project.id || 'proj'}-${idx + 1}`,
      bomItemId: item.id,
      bomItemName: item.name,
      workDescription:
        idx === 0
          ? `Mount, calibrate, and commission ${item.name} across remaining residential corridors`
          : idx === 1
          ? `Wire 24VAC HVAC backplates and pair ${item.name} to LoRaWAN mesh`
          : `Install and signal-verify ${item.name} at ${item.location}`,
      buildingOrArea: item.location || `Buildings ${idx + 1} - ${idx + 2}`,
      assignedInstaller: `${installer} Field Crew`,
      forecastedQuantity: forecastedQty,
      scheduledStartDate: '2026-10-22',
      scheduledEndDate: '2026-10-29',
      status: remaining === 0 ? 'Completed' : idx === 0 ? 'In Progress' : 'Forecasted',
      notes: 'Matched directly to BOM line item scope.',
    };
  });
}

export function buildDefaultShippingDockItems(project: Partial<OperationProject>): ShippingDockItem[] {
  const bom = project.bomItems || [];
  if (bom.length === 0) return [];
  const integrator = (project.integratorPartners && project.integratorPartners[0]) || 'SKBM';
  return bom.map((item, idx) => ({
    id: `dock-${project.id || 'proj'}-${idx + 1}`,
    shipmentBatchLabel: idx < 2 ? 'Batch #1 - Primary Hardware Pallet' : 'Batch #2 - Secondary Staging Shipment',
    integratorName: integrator,
    bomItemId: item.id,
    bomItemName: item.name,
    bomItemModel: item.model,
    shippedQuantity: item.quantity + (item.sparesCount || 0),
    carrier: idx % 2 === 0 ? 'FedEx Freight' : 'UPS Supply Chain',
    trackingNumber: `QXT-TRK-${(project.quoteNumber || '8841').replace(/[^0-9]/g, '')}-${100 + idx + 1}`,
    shippedDate: '2026-10-16',
    estimatedArrivalDate: '2026-10-20',
    status: (item.installedCount || 0) > 0 ? 'Delivered to Site' : 'Shipped / In Transit',
    customerAccepted: false,
    customerScenarioNotes: '',
  }));
}

export function loadStoredQuotes(): Quote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUOTES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored quotes', e);
  }
  return INITIAL_QUOTES;
}

export function saveStoredQuotes(quotes: Quote[]) {
  try {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(quotes));
  } catch (e) {
    console.error('Failed to save quotes', e);
  }
}

export function createDefaultMilestones(
  prefix: string,
  startDateStr?: string,
  targetDateStr?: string
): ProjectMilestone[] {
  const base = startDateStr ? new Date(startDateStr) : new Date();
  const target = targetDateStr ? new Date(targetDateStr) : new Date(base.getTime() + 45 * 24 * 60 * 60 * 1000);
  const totalDays = Math.max(14, Math.round((target.getTime() - base.getTime()) / (24 * 60 * 60 * 1000)));

  const addDays = (d: number) => {
    const res = new Date(base.getTime() + d * 24 * 60 * 60 * 1000);
    return res.toISOString().split('T')[0];
  };

  return [
    {
      id: `${prefix}-1`,
      title: 'Project kickoff',
      status: 'In Progress',
      targetDate: addDays(Math.max(2, Math.round(totalDays * 0.08))),
    },
    {
      id: `${prefix}-2`,
      title: 'Portal Buildout',
      status: 'Upcoming',
      targetDate: addDays(Math.max(5, Math.round(totalDays * 0.22))),
    },
    {
      id: `${prefix}-3`,
      title: 'Product Acquisition',
      status: 'Upcoming',
      targetDate: addDays(Math.max(12, Math.round(totalDays * 0.42))),
    },
    {
      id: `${prefix}-4`,
      title: 'CSM Intro - Pre-implementation',
      status: 'Upcoming',
      targetDate: addDays(Math.max(18, Math.round(totalDays * 0.58))),
    },
    {
      id: `${prefix}-5`,
      title: 'Implementation',
      status: 'Upcoming',
      targetDate: addDays(Math.max(24, Math.round(totalDays * 0.78))),
    },
    {
      id: `${prefix}-6`,
      title: 'CSM Handoff',
      status: 'Upcoming',
      targetDate: addDays(Math.max(30, Math.round(totalDays * 0.89))),
    },
    {
      id: `${prefix}-7`,
      title: 'Project Closed',
      status: 'Upcoming',
      targetDate: target.toISOString().split('T')[0],
    },
  ];
}

export function normalizeProjectMilestones(
  existingMilestones: ProjectMilestone[] | undefined,
  projectId: string,
  startDateStr?: string,
  targetDateStr?: string
): ProjectMilestone[] {
  const defaults = createDefaultMilestones(`m-${projectId}`, startDateStr, targetDateStr);
  if (!existingMilestones || existingMilestones.length === 0) {
    return defaults;
  }

  const normalizeTitle = (title: string): string => {
    const t = title.trim().toLowerCase();
    if (t.includes('kickoff')) return 'Project kickoff';
    if (t.includes('portal build')) return 'Portal Buildout';
    if (t === 'design') return '__REMOVED_DESIGN__';
    if (t.includes('acquisition') || t.includes('product')) return 'Product Acquisition';
    if (t.includes('csm intro') || t.includes('pre-implementation')) return 'CSM Intro - Pre-implementation';
    if (t === 'implementation') return 'Implementation';
    if (t.includes('training') || t.includes('csm handoff') || t.includes('csm hand off') || t.includes('hand off')) return 'CSM Handoff';
    if (t.includes('closed') || t.includes('closure')) return 'Project Closed';
    return title;
  };

  const existingMap = new Map<string, ProjectMilestone>();
  existingMilestones.forEach((m) => {
    const norm = normalizeTitle(m.title);
    if (norm !== '__REMOVED_DESIGN__') {
      existingMap.set(norm, m);
    }
  });

  const standardTitles: OperationMilestoneTitle[] = [
    'Project kickoff',
    'Portal Buildout',
    'Product Acquisition',
    'CSM Intro - Pre-implementation',
    'Implementation',
    'CSM Handoff',
    'Project Closed',
  ];

  return standardTitles.map((title, idx) => {
    const existing = existingMap.get(title);
    const defaultM = defaults[idx];
    if (existing) {
      return {
        ...existing,
        id: existing.id || `${projectId}-m${idx + 1}`,
        title,
        status: existing.status,
        targetDate: existing.targetDate || defaultM.targetDate,
      };
    }

    let inferredStatus: 'Completed' | 'In Progress' | 'Upcoming' = defaultM.status;
    const laterCompleted = standardTitles.slice(idx + 1).some((t) => {
      const later = existingMap.get(t);
      return later && (later.status === 'Completed' || later.status === 'In Progress');
    });

    if (laterCompleted) {
      inferredStatus = 'Completed';
    }

    return {
      id: `${projectId}-m${idx + 1}`,
      title,
      status: inferredStatus,
      targetDate: defaultM.targetDate,
    };
  });
}

export function enrichProjectDefaults(p: OperationProject): OperationProject {
  const initProj = INITIAL_PROJECTS.find((ip) => ip.id === p.id);
  const partners =
    p.integratorPartners && p.integratorPartners.length > 0
      ? p.integratorPartners
      : initProj?.integratorPartners || ['SKBM'];

  const hasGateways = (p.bomItems || []).some(
    (b) => b.category === 'IoT Gateways & Mesh' || /gateway|hub|repeater/i.test(b.name)
  );
  const hasIntercomOnBom = (p.bomItems || []).some((b) =>
    /intercom|reader|perimeter/i.test(b.name + ' ' + b.model)
  );

  const enriched: OperationProject = {
    ...p,
    assignedFieldTech: normalizeFieldTech(p.assignedFieldTech),
    integratorPartners: partners,
    bomItems: (p.bomItems || []).map((b) => {
      let fixedModel = b.model;
      if (/enrollment reader/i.test(b.name)) {
        if (/mt20w/i.test(b.name) || /mt20w/i.test(b.model)) {
          fixedModel = 'SCH-MT20W';
        } else if (/mt20/i.test(b.name) || /mt20/i.test(b.model)) {
          fixedModel = 'SCH-MT20';
        }
      }
      // If it is NOT a lock (e.g. Schlage Enrollment Reader MT20W, Readers, Gate Readers, Intercoms), strip any mistakenly applied lockFinishConfig
      if (!isLockBOMItem({ ...b, model: fixedModel }) && b.lockFinishConfig) {
        const cleaned = { ...b, model: fixedModel };
        delete cleaned.lockFinishConfig;
        return cleaned;
      }
      if (b.lockFinishConfig) {
        const itemObj = { ...b, model: fixedModel };
        const trueFamily = detectLockFamily(itemObj);
        const splits = b.lockFinishConfig.splits
          ? sanitizeLockSplits(b.lockFinishConfig.splits, trueFamily)
          : undefined;
        return {
          ...b,
          model: fixedModel,
          lockFinishConfig: {
            family: trueFamily,
            isSplit: b.lockFinishConfig.isSplit,
            splits,
            customNotes: b.lockFinishConfig.customNotes,
            ...(trueFamily === 'befe' && {
              befeTrimStyle: b.lockFinishConfig.befeTrimStyle,
              befeColorFinish: b.lockFinishConfig.befeColorFinish,
            }),
            ...(trueFamily === 'nde' && {
              ndeColorFinish: b.lockFinishConfig.ndeColorFinish,
              ndeLeverType: b.lockFinishConfig.ndeLeverType,
            }),
            ...(trueFamily === 'xe360' && {
              xe360Subtype: b.lockFinishConfig.xe360Subtype,
              xe360ColorFinish: b.lockFinishConfig.xe360ColorFinish,
              xe360LeverStyle: b.lockFinishConfig.xe360LeverStyle,
              xe360ExitTrimCrashbar: b.lockFinishConfig.xe360ExitTrimCrashbar,
              xe360ExitTrimFunction: b.lockFinishConfig.xe360ExitTrimFunction,
              xe360TubularGrade: b.lockFinishConfig.xe360TubularGrade,
              xe360TubularFunction: b.lockFinishConfig.xe360TubularFunction,
              xe360MortiseGrade: b.lockFinishConfig.xe360MortiseGrade,
              xe360MortiseFunction: b.lockFinishConfig.xe360MortiseFunction,
            }),
          },
        };
      }
      if (fixedModel !== b.model) {
        return { ...b, model: fixedModel };
      }
      return b;
    }),
    installLogs:
      p.installLogs && p.installLogs.length > 0
        ? p.installLogs.map((l) => {
            const initMatch = INITIAL_PROJECTS.find((ip) => ip.id === p.id)?.installLogs?.find(
              (il) => il.id === l.id
            );
            return {
              ...l,
              photos: l.photos && l.photos.length > 0 ? l.photos : initMatch?.photos || [],
              audioNoteUrl: l.audioNoteUrl || initMatch?.audioNoteUrl,
              audioNoteDuration: l.audioNoteDuration || initMatch?.audioNoteDuration,
              itemNotes: l.itemNotes || initMatch?.itemNotes,
            };
          })
        : INITIAL_PROJECTS.find((ip) => ip.id === p.id)?.installLogs || [],
    useNfcWallet:
      p.useNfcWallet !== undefined
        ? p.useNfcWallet
        : p.communityDetails?.nfcWalletConfigured !== undefined
        ? p.communityDetails.nfcWalletConfigured
        : true,
    useQrIntercom:
      p.useQrIntercom !== undefined
        ? p.useQrIntercom
        : p.customerIntake?.useQrIntercom !== undefined
        ? p.customerIntake.useQrIntercom
        : hasIntercomOnBom,
    sowForecastCadenceEnabled:
      p.sowForecastCadenceEnabled !== undefined ? p.sowForecastCadenceEnabled : true,
    sowForecastItems:
      p.sowForecastItems && p.sowForecastItems.length > 0
        ? p.sowForecastItems
        : buildDefaultSOWForecastItems({ ...p, integratorPartners: partners }),
    shippingDockItems:
      p.shippingDockItems && p.shippingDockItems.length > 0
        ? p.shippingDockItems
        : buildDefaultShippingDockItems({ ...p, integratorPartners: partners }),
    milestones: normalizeProjectMilestones(p.milestones, p.id, p.startDate, p.targetCompletionDate),
    customerIntake: {
      pmsSoftware: 'Yardi',
      commonAreaDoors: [],
      staffRoles: [],
      ...(p.customerIntake || {}),
      sitePlanConfirmedEdited:
        p.customerIntake?.sitePlanConfirmedEdited !== undefined
          ? p.customerIntake.sitePlanConfirmedEdited
          : hasGateways && p.id === '33om1u0TTgW3MYKO2FhH'
          ? true
          : false,
      sitePlanPdfName:
        p.customerIntake?.sitePlanPdfName ||
        (hasGateways && p.id === '33om1u0TTgW3MYKO2FhH'
          ? 'The_Vue_Grand_Horizon_Gateway_Locations_MarkedUp.pdf'
          : undefined),
      sitePlanUploadedAt:
        p.customerIntake?.sitePlanUploadedAt ||
        (hasGateways && p.id === '33om1u0TTgW3MYKO2FhH' ? '2026-10-15' : undefined),
    },
  };

  enriched.partnerCourseBundle = buildProjectPrePackagedBundle(enriched);

  return checkAndApplyCsmHandoffAutoClose(enriched);
}

export function loadStoredProjects(): OperationProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (raw) {
      const parsed: OperationProject[] = JSON.parse(raw);
      return parsed.map((p) => enrichProjectDefaults(p));
    }
  } catch (e) {
    console.error('Failed to parse stored projects', e);
  }
  return INITIAL_PROJECTS.map((p) => enrichProjectDefaults(p));
}

export function saveStoredProjects(projects: OperationProject[]) {
  try {
    const enriched = projects.map((p) => enrichProjectDefaults(p));
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(enriched));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

export function createProjectFromQuote(quote: Quote): OperationProject {
  const startDate = new Date().toISOString().split('T')[0];
  const targetDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const baseProject: OperationProject = {
    id: quote.id,
    quoteId: quote.id,
    quoteNumber: quote.quoteNumber,
    propertyName: quote.propertyName,
    clientName: quote.clientName,
    address: quote.address,
    city: quote.city,
    state: quote.state,
    unitsCount: quote.unitsCount,
    heroImage: '/src/assets/images/property_grand_horizon_1792605840266.jpg',
    assignedPM: {
      name: 'Raul Recalde',
      email: 'raul.recalde@onequext.com',
      role: 'Director of Implementation',
    },
    assignedCSM: 'Nicole Franklin',
    assignedFieldTech: 'Hector Lopez',
    integratorPartners: ['SKBM'],
    statusTag: 'On Track',
    statusReason: 'Project newly converted from Deal Won quote. Initial staging initiated.',
    startDate,
    targetCompletionDate: targetDate,
    lastUpdated: new Date().toISOString(),
    bomItems: quote.bomItems.map((item) => ({
      ...item,
      installedCount: item.installedCount || 0,
      postItLogs: [],
    })),
    installLogs: [
      {
        id: `log-init-${Date.now()}`,
        projectId: quote.id,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        installerName: 'Quext Operations Staging',
        itemId: quote.bomItems[0]?.id || 'init',
        itemName: quote.bomItems[0]?.name || 'Initial BOM Staging',
        quantityCompleted: 0,
        locationCompleted: 'Central Staging Facility',
        statusCheck: 'Verified & Online',
        notes: `Project generated automatically upon quote #${quote.quoteNumber} reaching Deal Won status. Pre-packaged Partner Academy course bundle assembled for assigned integrator partner.`,
        color: 'yellow',
      },
    ],
    notes: [
      {
        id: `note-init-${Date.now()}`,
        projectId: quote.id,
        author: 'Raul Recalde',
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        category: 'General Context',
        text: `Deal Won conversion verified. Quoted ${quote.unitsCount} units for ${quote.clientName}. Total hardware units on BOM: ${quote.bomItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        )}. Pre-packaged Quext Partner Academy courses & guides automatically assigned.`,
        isPinned: true,
      },
    ],
    milestones: createDefaultMilestones(`m-${quote.id}`, startDate, targetDate),
    customerIntake: {
      pmsSoftware: 'None',
      commonAreaDoors: [],
      staffRoles: [],
    },
  };

  const enriched = enrichProjectDefaults(baseProject);
  enriched.partnerCourseBundle = buildProjectPrePackagedBundle(enriched, 'Deal Won Automation');
  return enriched;
}
