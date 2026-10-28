/**
 * AUTO-GENERATED FROM LIVE https://myquext.com FIRESTORE DATABASE
 * Project: gen-lang-client-0224797666 | Database: (default)
 * Contains 196 real myquext.com Opportunities (Analyses & AI Prospecting Leads)
 * and 38 active Deal Won / Project Kickoff / On Deck Operations Projects.
 */
import { Quote, OperationProject } from '../types';

export interface MyQuextOpportunityMeta {
  id: string;
  myquextStage: string;
  myquextSource: 'analysis' | 'lead' | 'building';
  buildType: string;
}

export const MYQUEXT_QUOTES: (Quote & Partial<MyQuextOpportunityMeta>)[] = [
  {
    "id": "sf_imp_1788112391819_45655742",
    "quoteNumber": "QXT-2026-1000",
    "propertyName": "Lido Square - Pittsburg, CA",
    "clientName": "The Reliant Group",
    "address": "2131 Crestview Ln",
    "city": "Pittsburg",
    "state": "CA",
    "unitsCount": 173,
    "stage": "Deal Won",
    "myquextStage": "Deal Won",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-09-02T14:44:29.234623Z",
    "totalHardwareAmount": 500,
    "totalInstallAmount": 28545,
    "monthlyServiceFee": 4844,
    "assignedSalesLead": "Keenan Cheung",
    "notes": "Imported from Salesforce Opportunity: Lido Square - Pittsburg, CA",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": ""
      }
    ]
  },
  {
    "id": "sf_imp_1788112877490_48123d5c",
    "quoteNumber": "QXT-2026-1001",
    "propertyName": "Pinon Apartments -Davis, CA",
    "clientName": "TCC Properties",
    "address": "555 Guava Lane",
    "city": "Davis",
    "state": "CA",
    "unitsCount": 70,
    "stage": "Deal Won",
    "myquextStage": "Deal Won",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-09-02T14:44:29.121999Z",
    "totalHardwareAmount": 112000,
    "totalInstallAmount": 11550,
    "monthlyServiceFee": 1960,
    "assignedSalesLead": "Sydney Sanberg",
    "notes": "Imported from Salesforce Opportunity: Pinon Apartments -Davis, CA",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Smart Communities IoT Service Fee Hub - Monthly",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "All Residential Units",
        "quantity": 72,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "In-unit smart access control software integration."
      },
      {
        "id": "bom-sf_imp-02",
        "name": "Monthly Licensing Fee - NFC Wallet Access",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 100,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Mobile credential NFC wallet pass (100 credentials per pack)."
      }
    ]
  },
  {
    "id": "sf_imp_1788203832004_a55d9ebb",
    "quoteNumber": "QXT-2026-1002",
    "propertyName": "Agora Heights- Roy, UT",
    "clientName": "Rich Development",
    "address": "1952 W. 5450 S ST",
    "city": "Roy",
    "state": "UT",
    "unitsCount": 42,
    "stage": "Deal Won",
    "myquextStage": "Deal Won",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-09-02T14:44:29.290591Z",
    "totalHardwareAmount": 16846,
    "totalInstallAmount": 6930,
    "monthlyServiceFee": 1176,
    "assignedSalesLead": "Sydney Sanberg",
    "notes": "Imported from Salesforce Opportunity: Agora Heights- Roy, UT",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Gateway Quext IoT",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Hardware / Equipment",
        "quantity": 42,
        "installedCount": 0,
        "unitPrice": 90.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-03",
        "name": "Project Management",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-04",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 350.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-05",
        "name": "Pro Services Bronze",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 350.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-06",
        "name": "Smart Communities IoT Service Fee Hub - Monthly",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Hardware / Equipment",
        "quantity": 42,
        "installedCount": 0,
        "unitPrice": 3.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-07",
        "name": "Schlage BE467 Greenwich - Matte Black",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 42,
        "installedCount": 0,
        "unitPrice": 220.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      }
    ]
  },
  {
    "id": "33om1u0TTgW3MYKO2FhH",
    "quoteNumber": "QXT-2026-1003",
    "propertyName": "Greenbrook Partners Pilot",
    "clientName": "Beacon Partners",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 8,
    "stage": "Deal Won",
    "myquextStage": "Deal Won",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-20T20:20:19.762Z",
    "totalHardwareAmount": 3898,
    "totalInstallAmount": 1320,
    "monthlyServiceFee": 224,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Deal Won) — New Construction scope for 8 units in Austin, TX.",
    "bomItems": [
      {
        "id": "bom-33om1u-01",
        "name": "LoRaWAN Bridge (Range Extension)",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "Long-range LoRaWAN wireless bridge for extended property coverage across spread-out buildings."
      },
      {
        "id": "bom-33om1u-02",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-33om1u-03",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR Plated Intercom "
      }
    ]
  },
  {
    "id": "FoYP0Bt5ZT969KsOfSsx",
    "quoteNumber": "QXT-2026-1004",
    "propertyName": "Westview at Irvine Spectrum",
    "clientName": "The Irvine Company",
    "address": "21100 Spectrum",
    "city": "Irvine",
    "state": "CA",
    "unitsCount": 583,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-09-30T20:54:35.246Z",
    "totalHardwareAmount": 432870,
    "totalInstallAmount": 96195,
    "monthlyServiceFee": 16324,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count (583) was taken directly from user input. Per-unit device counts (Locks, Thermostats, APs, Leak Detectors) are based on the provided total unit count.",
    "bomItems": [
      {
        "id": "bom-FoYP0B-01",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 583,
        "installedCount": 0,
        "unitPrice": 416.75,
        "description": "1 commercial interconnected deadbolt per unit entry door (single-motion emergency egress)."
      },
      {
        "id": "bom-FoYP0B-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 583,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-FoYP0B-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 21,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Professional reconfiguration and system migration of existing Brivo access hardware into the Quext platform."
      },
      {
        "id": "bom-FoYP0B-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 584,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "V8jLZAaCelxwRaUxmm1K",
    "quoteNumber": "QXT-2026-1005",
    "propertyName": "The Right Angle",
    "clientName": "LV Collective",
    "address": "2700 East 5th Street",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 476,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-06T20:43:58.177Z",
    "totalHardwareAmount": 242443,
    "totalInstallAmount": 78540,
    "monthlyServiceFee": 13328,
    "assignedSalesLead": "Blake Miller",
    "notes": "Source of Unit Count: Confirmed 476 units from the 'East 5th RFP' document. Building Type: Mid-rise apartment community with a central parking structure.",
    "bomItems": [
      {
        "id": "bom-V8jLZA-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 476,
        "installedCount": 0,
        "unitPrice": 250.0,
        "description": "One lock per unit based on provided unit count."
      },
      {
        "id": "bom-V8jLZA-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 476,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "One thermostat per unit; standard HVAC assumed."
      },
      {
        "id": "bom-V8jLZA-03",
        "name": "Access Control Readers",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Includes Main Entry, Fitness, Bike Room, Pool, Package Room, BOH, and 2 Vehicle Gates."
      },
      {
        "id": "bom-V8jLZA-04",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "For Lobby, Fitness Center, and Club/Lounge areas."
      },
      {
        "id": "bom-V8jLZA-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 476,
        "installedCount": 0,
        "unitPrice": 38.0,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-V8jLZA-06",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 26,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Includes Lobby, Amenities, Mail, Garage Entrances, and approx. 2 per Garage Level (7 levels) for safety."
      },
      {
        "id": "bom-V8jLZA-07",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 26,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": ""
      }
    ]
  },
  {
    "id": "El6ocIJcWg2MAUxEOLnf",
    "quoteNumber": "QXT-2026-1006",
    "propertyName": "Apex Riverstone",
    "clientName": "Alpha Residential",
    "address": "Nashville Community Blvd",
    "city": "Nashville",
    "state": "Tennessee",
    "unitsCount": 456,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-10T16:46:00.978Z",
    "totalHardwareAmount": 631186,
    "totalInstallAmount": 75240,
    "monthlyServiceFee": 12768,
    "assignedSalesLead": "Blake Miller",
    "notes": "North Star Total: The provided user input of 456 units was used as the absolute truth for calculating in-unit requirements. OFF-SWITCH Architecture: All 456 In-Unit Wi-Fi 7 APs are assumed to connect directly to the in-unit Google Fiber ONTs. Switch ports have NOT been allocated for residential units.",
    "bomItems": [
      {
        "id": "bom-El6ocI-01",
        "name": "Schlage XE360 Mortise",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 0,
        "unitPrice": 500.48,
        "description": "Heavy-duty commercial wireless mortise lock for high-traffic amenity and entry doors."
      },
      {
        "id": "bom-El6ocI-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 smart thermostat per unit with integrated IoT hub. Coordinates wireless door locks and sensors."
      },
      {
        "id": "bom-El6ocI-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 35,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated quantity based on architectural plans for exterior doors, amenities, and typical community ingress/egress points."
      },
      {
        "id": "bom-El6ocI-04",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated quantity to cover primary lobbies, pool deck, mail room, and fitness centers."
      },
      {
        "id": "bom-El6ocI-05",
        "name": "Video Intercom Access Control",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated for main building entrances and primary leasing center approach."
      },
      {
        "id": "bom-El6ocI-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 456,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      },
      {
        "id": "bom-El6ocI-07",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-El6ocI-08",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-El6ocI-09",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      },
      {
        "id": "bom-El6ocI-10",
        "name": "Aeotec Illumino Switch - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Bulk Managed Wi-Fi",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Pack of 4 smart wall switches (Z-Wave). Requires Quext Thermostat Hub for connectivity."
      }
    ]
  },
  {
    "id": "vzP34ZLqePwXnEVBK2b0",
    "quoteNumber": "QXT-2026-1007",
    "propertyName": "Satellite Square",
    "clientName": "Brand Properties",
    "address": "2789 Satellite Blvd",
    "city": "Duluth",
    "state": "Georgia",
    "unitsCount": 347,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-06-03T02:44:27.345Z",
    "totalHardwareAmount": 257380,
    "totalInstallAmount": 57255,
    "monthlyServiceFee": 9716,
    "assignedSalesLead": "Danielle Finley",
    "notes": "Total Unit Count established as 355 based directly on User Input. Per-Unit Technology (OFF-SWITCH): 1 Wi-Fi 7 Unit AP allocated per unit (355 total). These connect directly to the in-unit Fiber ONT. No switch ports were calculated for these APs.",
    "bomItems": [
      {
        "id": "bom-vzP34Z-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 347,
        "installedCount": 0,
        "unitPrice": 204.52,
        "description": "1 standard smart lock allocated per unit entry door."
      },
      {
        "id": "bom-vzP34Z-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 347,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "does this work??"
      },
      {
        "id": "bom-vzP34Z-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 18,
        "installedCount": 0,
        "unitPrice": 358.8,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 347,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-vzP34Z-05",
        "name": "Aeotec Leak Sensor - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 694,
        "installedCount": 0,
        "unitPrice": 43.76,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-06",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 358.8,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-07",
        "name": "Eagle Eye Security Cameras - DB13",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-08",
        "name": "Eagle Eye Security Cameras - DD11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 27,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-09",
        "name": "Eagle Eye Security Cameras - DB14",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1150.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-10",
        "name": "Eagle Eye Bridge",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 4000.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-11",
        "name": "12\" ButterflyMX Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 5000.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-12",
        "name": "Access Controll Installation & Ancillary Hardware",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Install Access Control based on 27 (2 @ gate) door locations (Includes Labor and Ancillary hardware, wiring, and locking hardware)"
      },
      {
        "id": "bom-vzP34Z-13",
        "name": "Video Camera Installation & Ancillary Hardware",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Install CCTV System based on 37 locations ( Includes wiring and Ancillary hardware )"
      }
    ]
  },
  {
    "id": "4FbLToKBWCIoIIluD3lT",
    "quoteNumber": "QXT-2026-1008",
    "propertyName": "Paradise Valley",
    "clientName": "Lifetime Living",
    "address": "1290 N Tatum Blvd",
    "city": "Phoenix",
    "state": "Arizona",
    "unitsCount": 327,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-12T18:16:04.518Z",
    "totalHardwareAmount": 267969,
    "totalInstallAmount": 53955,
    "monthlyServiceFee": 9156,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used user-supplied 'Notes' for all specific hardware counts (Locks, Readers, APs). Allocated all 46 User-Defined Amenity APs to 'Indoor Common' category; no specific outdoor breakdown provided.",
    "bomItems": [
      {
        "id": "bom-4FbLTo-01",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 334,
        "installedCount": 0,
        "unitPrice": 479.84,
        "description": "327 Units + 7 Spares (User Input)."
      },
      {
        "id": "bom-4FbLTo-02",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 57,
        "installedCount": 0,
        "unitPrice": 663.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-4FbLTo-03",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 63,
        "installedCount": 0,
        "unitPrice": 435.75,
        "description": "Wireless smart cylindrical lockset for resident units and student bedrooms. Supports mobile credentials and remote management."
      },
      {
        "id": "bom-4FbLTo-04",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 97,
        "installedCount": 0,
        "unitPrice": 229.71,
        "description": "Taking into account additional access in units."
      },
      {
        "id": "bom-4FbLTo-05",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 707.44,
        "description": "Wireless commercial exit device trim for common area egress doors, fitness centers, and perimeter exits."
      },
      {
        "id": "bom-4FbLTo-06",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "One-Time Quext Fees",
        "quantity": 327,
        "installedCount": 0,
        "unitPrice": 30.0,
        "description": "Device programming, cloud portal configuration, and backend account initialization."
      },
      {
        "id": "bom-4FbLTo-07",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "One-Time Quext Fees",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      },
      {
        "id": "bom-4FbLTo-08",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "One-Time Quext Fees",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Dedicated project management: Vendor liaison, remote install support, trade coordination, and milestone tracking."
      }
    ]
  },
  {
    "id": "l6MiufxI8YCEnEiFa8rM",
    "quoteNumber": "QXT-2026-1009",
    "propertyName": "The Motley",
    "clientName": "ipb Properties",
    "address": "1401 Church Street",
    "city": "Nashville",
    "state": "Tennessee",
    "unitsCount": 326,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:29:24.219Z",
    "totalHardwareAmount": 325950,
    "totalInstallAmount": 53790,
    "monthlyServiceFee": 9128,
    "assignedSalesLead": "Danielle Finley",
    "notes": "Source of Truth: User input 'Total Units: 326' used as the master unit count. Excluded 80 APs located in Residential Hallways and Elevator Lobbies (Levels 6-25) per 'Negative Constraint' instructions.",
    "bomItems": [
      {
        "id": "bom-l6Miuf-01",
        "name": "Schlage XE360 Mortise",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 326,
        "installedCount": 0,
        "unitPrice": 500.48,
        "description": ""
      },
      {
        "id": "bom-l6Miuf-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 326,
        "installedCount": 0,
        "unitPrice": 177.27,
        "description": "1 per unit."
      },
      {
        "id": "bom-l6Miuf-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Subject to review. This is an estimated count for main entrances, amenities, and garage elevators."
      },
      {
        "id": "bom-l6Miuf-04",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Subject to review. This is an estimated count based on review of building plans."
      },
      {
        "id": "bom-l6Miuf-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 326,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs. Wi-Fi 7 AP coverage in all amenity and staff spaces."
      },
      {
        "id": "bom-l6Miuf-06",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      },
      {
        "id": "bom-l6Miuf-07",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Optional parking garage Wi-Fi 6 APs"
      },
      {
        "id": "bom-l6Miuf-08",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Optional 7 day Camera Recording."
      }
    ]
  },
  {
    "id": "sf_imp_1787679493344_91676b8e",
    "quoteNumber": "QXT-2026-1010",
    "propertyName": "The Exchange",
    "clientName": "Lifetime Living",
    "address": "1021 Social Street",
    "city": "Raleigh",
    "state": "NC",
    "unitsCount": 289,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-09-03T17:26:00.817Z",
    "totalHardwareAmount": 280972,
    "totalInstallAmount": 47685,
    "monthlyServiceFee": 8092,
    "assignedSalesLead": "Blake Miller",
    "notes": "Imported from Salesforce Opportunity: Lifetime Living Residential - Raleigh",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Custom Hardware Product",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common & Amenity Spaces",
        "quantity": 18,
        "installedCount": 0,
        "unitPrice": 707.44,
        "description": "The XE360 Wireless Exit Trim for perimeter & common areas. Quext adds keyless entry and remote management without the cost of wired readers."
      },
      {
        "id": "bom-sf_imp-02",
        "name": "RC15",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common & Amenity Spaces",
        "quantity": 26,
        "installedCount": 0,
        "unitPrice": 663.0,
        "description": "The RC15 wall mount is a next-generation IP reader controller designed for scalable and flexible real-time access control in perimeter and high security applications. The all-in-one device leverages the comprehensive ecosystem from Schlage "
      },
      {
        "id": "bom-sf_imp-03",
        "name": "Schlage FE410F Greenwich - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Apartment Units",
        "quantity": 289,
        "installedCount": 0,
        "unitPrice": 479.84,
        "description": "1 interconnected deadbolt per unit entry door."
      },
      {
        "id": "bom-sf_imp-04",
        "name": "Schlage XE360 Tubular - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Common & Amenity Spaces",
        "quantity": 33,
        "installedCount": 0,
        "unitPrice": 435.75,
        "description": "Battery powered wireless tubular lock. Quext adds keyless mobile entry and remote \"No-Tour\" management, with or without a Quext smart hub."
      },
      {
        "id": "bom-sf_imp-05",
        "name": "Honeywell T6",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Units",
        "quantity": 289,
        "installedCount": 0,
        "unitPrice": 140.0,
        "description": "1 Wi-Fi smart thermostat per unit."
      },
      {
        "id": "bom-sf_imp-06",
        "name": "Schlage Key Fobs (50-pack)",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 300.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-07",
        "name": "Schlage Enrollment Reader (MT20)",
        "model": "SCH-MT20",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 831.0,
        "description": "Credential enrollment reader for staff credential programming."
      },
      {
        "id": "bom-sf_imp-08",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software & Services",
        "quantity": 289,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      }
    ]
  },
  {
    "id": "uRQX5qZn76fdQ4uTnce2",
    "quoteNumber": "QXT-2026-1011",
    "propertyName": "The Holly",
    "clientName": "Beacon Partners",
    "address": "3710 Erskine St, Lubbock, TX 79415",
    "city": "Lubbock",
    "state": "TX",
    "unitsCount": 288,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-09-30T01:29:53.239551Z",
    "totalHardwareAmount": 127378,
    "totalInstallAmount": 47520,
    "monthlyServiceFee": 8064,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Total unit count (288) was provided by user input. Property identified as Student Housing. A 25% uplift was applied to the in-unit AP count (288 * 1.25 = 360) and locks are calculated per-bedroom.",
    "bomItems": [
      {
        "id": "bom-uRQX5q-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "The slim Schlage RC11 wired IP reader for narrow door frames. Get real-time, high-security access control managed by the Quext platform."
      },
      {
        "id": "bom-uRQX5q-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 288,
        "installedCount": 0,
        "unitPrice": 180.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-uRQX5q-03",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 288,
        "installedCount": 0,
        "unitPrice": 120.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-uRQX5q-04",
        "name": "Aeotec Leak Sensor - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 288,
        "installedCount": 0,
        "unitPrice": 40.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-uRQX5q-05",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 288,
        "installedCount": 0,
        "unitPrice": 20.0,
        "description": "1 Z-Wave leak sensor per unit."
      },
      {
        "id": "bom-uRQX5q-06",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Training and Onboarding, one-time cost"
      },
      {
        "id": "bom-uRQX5q-07",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Project Management Fee"
      },
      {
        "id": "bom-uRQX5q-08",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1517.0,
        "description": "The RC15 wall mount is a next-generation IP reader controller designed for scalable and flexible real-time access control in perimeter and high security applications. The all-in-one device leverages the comprehensive ecosystem from Schlage "
      },
      {
        "id": "bom-uRQX5q-09",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 516.05,
        "description": "The RC15 wall mount is a next-generation IP reader controller designed for scalable and flexible real-time access control in perimeter and high security applications. The all-in-one device leverages the comprehensive ecosystem from Schlage "
      }
    ]
  },
  {
    "id": "uOZllnZpCNzPoUFWjpUr",
    "quoteNumber": "QXT-2026-1012",
    "propertyName": "The Bowery at Old Fourth Ward",
    "clientName": "Related Companies",
    "address": "495 Highland Avenue Northeast",
    "city": "Atlanta",
    "state": "GA",
    "unitsCount": 285,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-06T00:55:05.374Z",
    "totalHardwareAmount": 243106,
    "totalInstallAmount": 47025,
    "monthlyServiceFee": 7980,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count (285) was carried over from the initial user-provided data, as a Unit Mix schedule was not present in the provided telecom plans. All Common Area APs, Security Cameras, and Access Control Readers are based on explicit counts of symbols on the provided telecom floor plans.",
    "bomItems": [
      {
        "id": "bom-uOZlln-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 292,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-uOZlln-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 292,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-uOZlln-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 285,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-uOZlln-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-uOZlln-05",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 33,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Standard Bullet"
      },
      {
        "id": "bom-uOZlln-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 285,
        "installedCount": 0,
        "unitPrice": 45.0,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      }
    ]
  },
  {
    "id": "ZWILZNFVojNB0J4zADEo",
    "quoteNumber": "QXT-2026-1013",
    "propertyName": "Raleigh",
    "clientName": "Consigli",
    "address": "1021 Social Street",
    "city": "Raleigh",
    "state": "North Carolina",
    "unitsCount": 271,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:27:47.819Z",
    "totalHardwareAmount": 260783,
    "totalInstallAmount": 44715,
    "monthlyServiceFee": 7588,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used user input for Total Units (271) and specific device counts (Thermostats, Locks, Readers). Estimated AP count for '20 amenity spaces' as 16 Indoor and 4 Outdoor APs.",
    "bomItems": [
      {
        "id": "bom-ZWILZN-01",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 271,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "Per user notes."
      },
      {
        "id": "bom-ZWILZN-02",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 271,
        "installedCount": 0,
        "unitPrice": 399.22,
        "description": "Per user notes (FE410)."
      },
      {
        "id": "bom-ZWILZN-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Per user notes. Requires PoE switch port."
      },
      {
        "id": "bom-ZWILZN-04",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 34,
        "installedCount": 0,
        "unitPrice": 450.0,
        "description": "Per user notes. Wireless/Battery common area locks."
      },
      {
        "id": "bom-ZWILZN-05",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Per user notes. Wireless/Battery common area locks."
      },
      {
        "id": "bom-ZWILZN-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 271,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-ZWILZN-07",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      }
    ]
  },
  {
    "id": "Svgce0Av4QZ2HVfY4byI",
    "quoteNumber": "QXT-2026-1014",
    "propertyName": "Richmond Heights",
    "clientName": "Lifetime Living",
    "address": "1120 S Brentwood BLVD",
    "city": "Richmond Heights",
    "state": "Missouri",
    "unitsCount": 263,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-03T17:26:00.801Z",
    "totalHardwareAmount": 241206,
    "totalInstallAmount": 43395,
    "monthlyServiceFee": 7364,
    "assignedSalesLead": "Blake Miller",
    "notes": "CRITICAL ZIP CODE CONSTRAINT APPLIED: Property is located in 63117 (outside GFiber service area). All Wi-Fi 7 hardware substituted with generic Wi-Fi 6 Managed Access Points. CRITICAL ZIP CODE CONSTRAINT APPLIED: 'Quext powered by Google Fiber' branding removed. Substituted with generic smart community head-end and sta",
    "bomItems": [
      {
        "id": "bom-Svgce0-01",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 263,
        "installedCount": 0,
        "unitPrice": 548.5,
        "description": "Per user notes (FE410)."
      },
      {
        "id": "bom-Svgce0-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 263,
        "installedCount": 0,
        "unitPrice": 140.0,
        "description": "Per user notes."
      },
      {
        "id": "bom-Svgce0-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 28,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": ""
      },
      {
        "id": "bom-Svgce0-04",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 498.0,
        "description": ""
      },
      {
        "id": "bom-Svgce0-05",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Per user notes."
      },
      {
        "id": "bom-Svgce0-06",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      }
    ]
  },
  {
    "id": "dYgCqmkyQLw6hQleF1xW",
    "quoteNumber": "QXT-2026-1015",
    "propertyName": "Oak Springs",
    "clientName": "IQ Envelop",
    "address": "2900 Oak Springs Drive",
    "city": "Austin",
    "state": "Texas",
    "unitsCount": 250,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:28:26.463Z",
    "totalHardwareAmount": 299420,
    "totalInstallAmount": 41250,
    "monthlyServiceFee": 7000,
    "assignedSalesLead": "Blake Miller",
    "notes": "No information on interior wall construction was provided. If high-attenuation materials (e.g., concrete) are used, a professional on-site RF survey is strongly recommended to validate Wi-Fi AP quantities. The list of areas requiring technology coverage was derived solely from the provided architectural plans. Please c",
    "bomItems": [
      {
        "id": "bom-dYgCqm-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 275.0,
        "description": "1 per unit entry door, based on Total Units provided and unit plans."
      },
      {
        "id": "bom-dYgCqm-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": "1 per unit, based on Total Units provided and unit plans."
      },
      {
        "id": "bom-dYgCqm-03",
        "name": "Structured Media Enclosures",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "1 per unit, as shown on sheet T400."
      },
      {
        "id": "bom-dYgCqm-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 43,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Counted at amenity, staff, exterior, and key access doors across all floors."
      },
      {
        "id": "bom-dYgCqm-05",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 26,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Counted at key locations in lobbies, amenities, parking areas, and corridors."
      },
      {
        "id": "bom-dYgCqm-06",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": "Estimated for major amenity areas (Leasing, Co-working, Fitness, Lounges). Verify locations."
      },
      {
        "id": "bom-dYgCqm-07",
        "name": "Vehicle Gate Access Control",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Outdoor Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Based on card readers shown at two parking gates on plans."
      },
      {
        "id": "bom-dYgCqm-08",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for wifi6OutdoorCommonAP"
      },
      {
        "id": "bom-dYgCqm-09",
        "name": "2.5G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 16,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches2_5G"
      },
      {
        "id": "bom-dYgCqm-10",
        "name": "1G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches1G"
      },
      {
        "id": "bom-dYgCqm-11",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for optionalWifi6GarageAP"
      },
      {
        "id": "bom-dYgCqm-12",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Quext Services",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": ""
      }
    ]
  },
  {
    "id": "UKhDCIc67oxrSHWlg9Z2",
    "quoteNumber": "QXT-2026-1016",
    "propertyName": "Inspire Apartments",
    "clientName": "The Dawson Company",
    "address": "ZIERDT ROAD",
    "city": "Huntsville",
    "state": "Alabama",
    "unitsCount": 237,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-29T21:36:00.330Z",
    "totalHardwareAmount": 9480,
    "totalInstallAmount": 39105,
    "monthlyServiceFee": 6636,
    "assignedSalesLead": "Blake Miller",
    "notes": "Unit Mix Analysis: Identified 10 3-Bedroom units (Types C1, C2) requiring 2 APs each. Remaining 227 units allocated 1 AP. Bldg 1000/2000 C-Units: 1 stack each x 3 floors = 6 units.",
    "bomItems": [
      {
        "id": "bom-UKhDCI-01",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 237,
        "installedCount": 0,
        "unitPrice": 40.0,
        "description": ""
      }
    ]
  },
  {
    "id": "d6dlnqGvrAPlk9ws7Q5b",
    "quoteNumber": "QXT-2026-1017",
    "propertyName": "Canvas",
    "clientName": "Hunt Midwest",
    "address": "8036 Metcalf Ave",
    "city": "Overland Park",
    "state": "KS",
    "unitsCount": 227,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-30T01:29:49.213311Z",
    "totalHardwareAmount": 323290,
    "totalInstallAmount": 37455,
    "monthlyServiceFee": 6356,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "North Star unit count (226) provided directly via user input. Sheet A700 (Door Schedule) was referenced in the drawing notes but not provided in the text. Reader and camera counts are estimated based on standard multi-family coverage.",
    "bomItems": [
      {
        "id": "bom-d6dlnq-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 237,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "does this work??"
      },
      {
        "id": "bom-d6dlnq-02",
        "name": "Passage handle",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Unit",
        "quantity": 227,
        "installedCount": 0,
        "unitPrice": 40.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-03",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 232,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "does this work??"
      },
      {
        "id": "bom-d6dlnq-04",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 770.73,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-05",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 676.03,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-06",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 770.73,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-07",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 70,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Battery powered wireless tubular lock. Quext adds keyless mobile entry and remote \"No-Tour\" management, with or without a Quext smart hub."
      },
      {
        "id": "bom-d6dlnq-08",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-09",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-10",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 227,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-d6dlnq-11",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-12",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-13",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-14",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 152,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "Comes in packs of 3. Wireless, battery-operated water leak and freeze detector. Features a 5ft sensing cable to detect leaks along its entire length and sends alerts via WiFi without requiring a separate hub."
      },
      {
        "id": "bom-d6dlnq-15",
        "name": "Resideo L5 Water Actuator 3/4 in",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 227,
        "installedCount": 0,
        "unitPrice": 300.0,
        "description": ""
      }
    ]
  },
  {
    "id": "44czMfxkVuByIVAuuwVk",
    "quoteNumber": "QXT-2026-1018",
    "propertyName": "Macedonia",
    "clientName": "DeWitt Carolinas",
    "address": "2801 Macedonia Road",
    "city": "Cary",
    "state": "North Carolina",
    "unitsCount": 226,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-03T15:42:35.515Z",
    "totalHardwareAmount": 219433,
    "totalInstallAmount": 37290,
    "monthlyServiceFee": 6328,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used exact hardware counts provided in notes (FE410, XE360, XE Tubular, RCs). Used user-specified coverage count of 22 for Amenity APs; split 18 Indoor / 4 Outdoor.",
    "bomItems": [
      {
        "id": "bom-44czMf-01",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 226,
        "installedCount": 0,
        "unitPrice": 136.36,
        "description": "1 per unit as requested."
      },
      {
        "id": "bom-44czMf-02",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 226,
        "installedCount": 0,
        "unitPrice": 479.84,
        "description": "Unit entry hardware as specified in notes."
      },
      {
        "id": "bom-44czMf-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 24,
        "installedCount": 0,
        "unitPrice": 605.15,
        "description": "Wired access control points (Requires PoE)."
      },
      {
        "id": "bom-44czMf-04",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 707.44,
        "description": "Specified in notes (Wireless)."
      },
      {
        "id": "bom-44czMf-05",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 25,
        "installedCount": 0,
        "unitPrice": 435.75,
        "description": "Specified in notes (Wireless)."
      },
      {
        "id": "bom-44czMf-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 226,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-44czMf-07",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      }
    ]
  },
  {
    "id": "egVQ7U0YEivd9swwccVB",
    "quoteNumber": "QXT-2026-1019",
    "propertyName": "Mitchell Mills",
    "clientName": "DeWitt Carolinas",
    "address": "3805 Mitchell Mills Road",
    "city": "Raleigh",
    "state": "North Carolina",
    "unitsCount": 216,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-03T15:42:10.506Z",
    "totalHardwareAmount": 195028,
    "totalInstallAmount": 35640,
    "monthlyServiceFee": 6048,
    "assignedSalesLead": "Blake Miller",
    "notes": "North Star: Used explicit user input of 216 Total Units. Allocated 20 Indoor Common Area APs based on the note 'About 20 amenity spaces need coverage'.",
    "bomItems": [
      {
        "id": "bom-egVQ7U-01",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 216,
        "installedCount": 0,
        "unitPrice": 399.22,
        "description": "1 per unit as specified in notes."
      },
      {
        "id": "bom-egVQ7U-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 216,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "1 per unit as specified in notes."
      },
      {
        "id": "bom-egVQ7U-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 22,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Requires wired network connection."
      },
      {
        "id": "bom-egVQ7U-04",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Common area smart lock."
      },
      {
        "id": "bom-egVQ7U-05",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 0,
        "unitPrice": 450.0,
        "description": "Interior/Passage locks."
      },
      {
        "id": "bom-egVQ7U-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 216,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      }
    ]
  },
  {
    "id": "kIn4eb4LZvfluuTSOFag",
    "quoteNumber": "QXT-2026-1020",
    "propertyName": "Renner 87",
    "clientName": "Price Partners",
    "address": "8601 Renner Blvd",
    "city": "Lenexa",
    "state": "Kansas",
    "unitsCount": 215,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:29:19.283Z",
    "totalHardwareAmount": 154257,
    "totalInstallAmount": 35475,
    "monthlyServiceFee": 6020,
    "assignedSalesLead": "Blake Miller",
    "notes": "Unit Mix Verification: Used 'Multi-Family Building Load Analysis' on Sheet E303 to identify 8 three-bedroom units (Type C1) which require 2 APs. All other units (1-2 Bed) allocated 1 AP. Common Area APs: Allocated based on 'Lighting Allowance' notes indicating amenity spaces: Leasing, Club Room (B1 L1), Gym, Spa, WeWor",
    "bomItems": [
      {
        "id": "bom-kIn4eb-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 215,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "1 per unit (Standard entry)."
      },
      {
        "id": "bom-kIn4eb-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 215,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "1 per unit (Standard)."
      },
      {
        "id": "bom-kIn4eb-03",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated coverage for Lobbies, Amenities, Pool, and Building Entries."
      },
      {
        "id": "bom-kIn4eb-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for Main Entries, Amenity Doors, and Garage pedestrian access."
      },
      {
        "id": "bom-kIn4eb-05",
        "name": "Smart Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "1 per main building entrance vestibule (Bldg 1 & Bldg 2)."
      },
      {
        "id": "bom-kIn4eb-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 215,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-kIn4eb-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Dependency for Eagle Eye Security Cameras"
      }
    ]
  },
  {
    "id": "UWmoFTaQM2SCy5rVOR4F",
    "quoteNumber": "QXT-2026-1021",
    "propertyName": "One Lady Bird",
    "clientName": "Related Companies",
    "address": "151 South 1st Street",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 197,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-30T14:08:08.823Z",
    "totalHardwareAmount": 6895,
    "totalInstallAmount": 32505,
    "monthlyServiceFee": 5516,
    "assignedSalesLead": "Blake Miller",
    "notes": "The total unit count of 197 is based on direct user instruction, overriding the 208 multifamily units listed in the Site Vehicle Parking Table on sheet SP-2022-0438C. The scope is strictly limited to the 197 apartment units; the 101 condo units are excluded per user instruction.",
    "bomItems": [
      {
        "id": "bom-UWmoFT-01",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 197,
        "installedCount": 0,
        "unitPrice": 35.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "nIhr7SLZS1uJuf6KAWqf",
    "quoteNumber": "QXT-2026-1022",
    "propertyName": "Flashcube Apartments",
    "clientName": "Worcester Investments",
    "address": "701 Main Street",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 184,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:29:41.391Z",
    "totalHardwareAmount": 111440,
    "totalInstallAmount": 30360,
    "monthlyServiceFee": 5152,
    "assignedSalesLead": "Jasmine Hunt",
    "notes": "North Star Unit Count: 184 (Based on User-Provided Count in Project Details). STRATEGIC VALUE: This is a 'Managed WiFi+' solution. The 'Property-wide WiFi Coverage' in this BOM (enabled by 207 total APs) delivers 'Instant On' service, seamless resident roaming, and a property-wide guest network.",
    "bomItems": [
      {
        "id": "bom-nIhr7S-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 184,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Schlage locks already exist and would just need converted to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-nIhr7S-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 184,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "does this work??"
      },
      {
        "id": "bom-nIhr7S-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Estimate for key common entry points: Main Entry, Loading Dock, Fitness Centers (x2), Coworking Space, Package Room, and Basement amenities."
      },
      {
        "id": "bom-nIhr7S-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Recommended coverage for Main Entrance, Lobby, Loading Dock, Sports Court/Plaza areas, Fitness Centers, and perimeter."
      },
      {
        "id": "bom-nIhr7S-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 184,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "- 3 Gig symmetrical over a wired connection\n- Up to 1 Gig with Wi-Fi 7\n- GFiber covers the Access Point upgrade\n- Seamless property wide Wi-Fi coverage"
      }
    ]
  },
  {
    "id": "vWnYmEUJNnJdWNG43Z7c",
    "quoteNumber": "QXT-2026-1023",
    "propertyName": "Mission Encore",
    "clientName": "Sunflower Development",
    "address": "5400 Martway St",
    "city": "Mission",
    "state": "Kansas",
    "unitsCount": 180,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-23T16:51:33.845Z",
    "totalHardwareAmount": 157042,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "The total unit count of 180 was determined by the user-provided value, which is the primary source of truth. Assumed the presence of standard amenities not explicitly detailed on the floor plan, such as a leasing office, fitness center, and package room, for a comprehensive quote.",
    "bomItems": [
      {
        "id": "bom-vWnYmE-01",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 25,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      },
      {
        "id": "bom-vWnYmE-02",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-vWnYmE-03",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 750.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-vWnYmE-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Quext Services",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 195,
        "description": ""
      },
      {
        "id": "bom-vWnYmE-05",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 118.75,
        "description": "Automatically added as a dependency for Apartment Unit IoT Control."
      },
      {
        "id": "bom-vWnYmE-06",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 281.21,
        "description": "does this work??"
      },
      {
        "id": "bom-vWnYmE-07",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 220.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-vWnYmE-08",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Quext Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-vWnYmE-09",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Quext Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-vWnYmE-10",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Quext Services",
        "quantity": 211,
        "installedCount": 0,
        "unitPrice": 30.0,
        "description": ""
      },
      {
        "id": "bom-vWnYmE-11",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": ""
      }
    ]
  },
  {
    "id": "niIRWifT4ZAENi7MIHcv",
    "quoteNumber": "QXT-2026-1024",
    "propertyName": "Mission Lanes",
    "clientName": "Sunflower Development",
    "address": "5399 Martway St",
    "city": "Mission",
    "state": "Kansas",
    "unitsCount": 176,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-10-12T16:03:52.572Z",
    "totalHardwareAmount": 155205,
    "totalInstallAmount": 29040,
    "monthlyServiceFee": 4928,
    "assignedSalesLead": "Blake Miller",
    "notes": "The Total Unit Count of 176 was determined based on the user-provided count (Priority 1). FLAG: No architectural plans were provided. All common area quantities (Access Control, Cameras, Wi-Fi APs, Thermostats) are estimates based on a typical Class A property of this size. A full review of plans is required for a fina",
    "bomItems": [
      {
        "id": "bom-niIRWi-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 176,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Mission Lanes already has Schlage Deadbolt locks. This would be a transition from the Homebase platform to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-niIRWi-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 176,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Mission Lanes already has Honeywell t6 thermostats. This would be a transition from the Homebase platform to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-niIRWi-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 17,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Mission Lanes already has Schlage Readers. This would be a transition from the Homebase platform to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-niIRWi-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Mission Lanes already has Security Cameras. This would be a transition from the Homebase platform to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-niIRWi-05",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for wifi6OutdoorCommonAP"
      },
      {
        "id": "bom-niIRWi-06",
        "name": "2.5G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches2_5G"
      },
      {
        "id": "bom-niIRWi-07",
        "name": "1G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches1G"
      },
      {
        "id": "bom-niIRWi-08",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for optionalWifi6GarageAP"
      },
      {
        "id": "bom-niIRWi-09",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Miscellaneous",
        "quantity": 176,
        "installedCount": 0,
        "unitPrice": 118.75,
        "description": "Automatically added as a dependency for Apartment Unit IoT Control."
      },
      {
        "id": "bom-niIRWi-10",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Quext Services",
        "quantity": 179,
        "installedCount": 0,
        "unitPrice": 195,
        "description": ""
      }
    ]
  },
  {
    "id": "ky1QGq36MzwlJvKMzlaT",
    "quoteNumber": "QXT-2026-1025",
    "propertyName": "Mills Crossing",
    "clientName": "Cortland Management",
    "address": "3133 Burlington Mills Road",
    "city": "Wake Forest",
    "state": "NC",
    "unitsCount": 144,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-20T19:30:22.276Z",
    "totalHardwareAmount": 99431,
    "totalInstallAmount": 23760,
    "monthlyServiceFee": 4032,
    "assignedSalesLead": "Michael Mays",
    "notes": "CRITICAL: Total unit count updated to 188, based on the Site Plan (Sheet A0.1, 'PROPOSED NUMBER OF MULTI-FAMILY UNITS'), overriding the initial user input of 144. In-unit device counts (APs, Locks, Thermostats, Leak Detectors) are based on a 1:1 ratio with the updated 188 unit count. Detailed unit plans were not availa",
    "bomItems": [
      {
        "id": "bom-ky1QGq-01",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 144,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-ky1QGq-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 144,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Basic Access Control Management with Quext Resident and Property Manager App."
      },
      {
        "id": "bom-ky1QGq-03",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1517.0,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      },
      {
        "id": "bom-ky1QGq-04",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "The RC15 wall mount is a next-generation IP reader controller designed for scalable and flexible real-time access control in perimeter and high security applications. The all-in-one device leverages the comprehensive ecosystem from Schlage "
      },
      {
        "id": "bom-ky1QGq-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 144,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      },
      {
        "id": "bom-ky1QGq-06",
        "name": "Standard Video",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "60-day local retention, remote live view, standard motion alerts, unified dashboard."
      }
    ]
  },
  {
    "id": "0SD2YXBmJXWZa1qM7Rk4",
    "quoteNumber": "QXT-2026-1026",
    "propertyName": "The Interurban Building",
    "clientName": "Lincoln Property Company",
    "address": "1500 Jackson Street",
    "city": "Dallas",
    "state": "TX",
    "unitsCount": 134,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-10-05T17:34:11.263Z",
    "totalHardwareAmount": 96390,
    "totalInstallAmount": 22110,
    "monthlyServiceFee": 3752,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 134 was confirmed from user input and the plan cover sheet. In-unit AP count (134) is based on a 1:1 ratio with the unit count. Assumes no units are over 2000 sq. ft. or 3+ bedrooms, which would require an additional AP.",
    "bomItems": [
      {
        "id": "bom-0SD2YX-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 136,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "1 lock per unit entry door. +2 for storage locker."
      },
      {
        "id": "bom-0SD2YX-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 168,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "1 thermostat per unit. 25 units have 2 thermostats. 9 Common area."
      },
      {
        "id": "bom-0SD2YX-03",
        "name": "Brivo Bluetooth Single Gang Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 21,
        "installedCount": 0,
        "unitPrice": 1750.0,
        "description": "Based on site survey, taking over existing HID reader wiring."
      },
      {
        "id": "bom-0SD2YX-04",
        "name": "Aeotec Leak Sensor - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 134,
        "installedCount": 0,
        "unitPrice": 60.0,
        "description": "1 Z-Wave leak sensor per unit."
      }
    ]
  },
  {
    "id": "KgU6WfWMmU7fR7UxgED8",
    "quoteNumber": "QXT-2026-1027",
    "propertyName": "3538 Lake Eastbrook",
    "clientName": "SW Realestate",
    "address": "3538 Lake Eastbrook",
    "city": "Grand Rapids",
    "state": "MI",
    "unitsCount": 132,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-23T13:40:21.398Z",
    "totalHardwareAmount": 96829,
    "totalInstallAmount": 21780,
    "monthlyServiceFee": 3696,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Unit count of 132 was provided by user input as the North Star. AP density has been increased by 25% per Step 5 instructions.",
    "bomItems": [
      {
        "id": "bom-KgU6Wf-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Installed included with Unit Lock and Unit Thermostat combo.\n\nMain head-end IoT controller for the property."
      },
      {
        "id": "bom-KgU6Wf-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 132,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-KgU6Wf-03",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 132,
        "installedCount": 0,
        "unitPrice": 155.0,
        "description": "Vandal-resistant indoor/outdoor dome security camera for amenity areas, fitness centers, and perimeter coverage."
      },
      {
        "id": "bom-KgU6Wf-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1000.0,
        "description": "60-day local retention, remote live view, standard motion alerts, unified dashboard."
      },
      {
        "id": "bom-KgU6Wf-05",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 19,
        "installedCount": 0,
        "unitPrice": 675.0,
        "description": "50-pack of high-security Schlage thin multi-technology RFID key fobs."
      },
      {
        "id": "bom-KgU6Wf-06",
        "name": "Eagle Eye Security Cameras - DD08",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 1172.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-KgU6Wf-07",
        "name": "Standard Video",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Store digital keys in  Google Wallet™ or Apple Wallet® for simple, tap-to-unlock access—even if your phone is dead."
      },
      {
        "id": "bom-KgU6Wf-08",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-KgU6Wf-09",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-KgU6Wf-10",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 132,
        "installedCount": 0,
        "unitPrice": 35.0,
        "description": "Programming cost from Quext Channel Partner"
      },
      {
        "id": "bom-KgU6Wf-11",
        "name": "Schlage Multi-technology fob thin - 50 pack",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Slim profile IP reader controller for narrow door frames, glass mullions, and gates."
      }
    ]
  },
  {
    "id": "HXpmnL2kOhIjFPLvTe5c",
    "quoteNumber": "QXT-2026-1028",
    "propertyName": "Blair Crossing",
    "clientName": "Prospect",
    "address": "Hwy 30 & Hwy 133",
    "city": "Blair",
    "state": "NE",
    "unitsCount": 132,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-25T19:28:36.679535Z",
    "totalHardwareAmount": 117690,
    "totalInstallAmount": 21780,
    "monthlyServiceFee": 3696,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Total unit count established from user input: 132 units. Estimated 7500 sq ft of indoor common area space for a 132-unit apartment.",
    "bomItems": [
      {
        "id": "bom-HXpmnL-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end controller."
      },
      {
        "id": "bom-HXpmnL-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Storage for cameras."
      },
      {
        "id": "bom-HXpmnL-03",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 198,
        "installedCount": 0,
        "unitPrice": 220,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 132,
        "installedCount": 0,
        "unitPrice": 165,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-05",
        "name": "Leak Sensor",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 132,
        "installedCount": 0,
        "unitPrice": 55,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 172,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (165 in-unit APs, 4 indoor common, 3 outdoor)."
      }
    ]
  },
  {
    "id": "YgomhonPuWJiQoCRv6UU",
    "quoteNumber": "QXT-2026-1029",
    "propertyName": "Clemson Village",
    "clientName": "Balfour Beatty Communities",
    "address": "31 Clemson Pl",
    "city": "Clemson",
    "state": "SC",
    "unitsCount": 92,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-10-25T03:14:53.420Z",
    "totalHardwareAmount": 221250,
    "totalInstallAmount": 15180,
    "monthlyServiceFee": 2576,
    "assignedSalesLead": "Keenan Cheung",
    "notes": "Total unit count of 92 derived from user input. Assumed 2500 sq ft of indoor common area for 1 Wi-Fi 7 Indoor Common AP due to lack of specific plan details.",
    "bomItems": [
      {
        "id": "bom-Ygomho-01",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 138,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-Ygomho-02",
        "name": "Monthly Recurring Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 92,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      },
      {
        "id": "bom-Ygomho-03",
        "name": "Monthly NFC Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 288,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      },
      {
        "id": "bom-Ygomho-04",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 390,
        "installedCount": 0,
        "unitPrice": 215.0,
        "description": "With Handles"
      }
    ]
  },
  {
    "id": "aS0DVlt0j4hymbdhApdm",
    "quoteNumber": "QXT-2026-1030",
    "propertyName": "Linwood",
    "clientName": "Van Trust Real Estate",
    "address": "20 W. Linwood Blvd.",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 60,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:28:05.075Z",
    "totalHardwareAmount": 76950,
    "totalInstallAmount": 9900,
    "monthlyServiceFee": 1680,
    "assignedSalesLead": "Mark Zanders",
    "notes": "Unit count set to 60 based on user input. Camera count set to 30 based on specific user request.",
    "bomItems": [
      {
        "id": "bom-aS0DVl-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 60,
        "installedCount": 0,
        "unitPrice": 275.0,
        "description": ""
      },
      {
        "id": "bom-aS0DVl-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 60,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-aS0DVl-03",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 26,
        "installedCount": 0,
        "unitPrice": 550.0,
        "description": ""
      },
      {
        "id": "bom-aS0DVl-04",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Assumed for Main Entry."
      },
      {
        "id": "bom-aS0DVl-05",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 1200.0,
        "description": "Estimate: Main, Side, Amenity, Office doors."
      },
      {
        "id": "bom-aS0DVl-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 60,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity coverage."
      }
    ]
  },
  {
    "id": "jXSru6KLcysHJQMMnsgV",
    "quoteNumber": "QXT-2026-1031",
    "propertyName": "The Darby at Briarcliff",
    "clientName": "Balboa Real Estate Partners",
    "address": "INTERSECTION OF NW TULLISON RD. & NW 38th ST",
    "city": "Riverside",
    "state": "MO",
    "unitsCount": 39,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-30T01:29:50.398591Z",
    "totalHardwareAmount": 39990,
    "totalInstallAmount": 6435,
    "monthlyServiceFee": 1092,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 39 was established from user-provided notes, which was used as the primary source for all per-unit calculations. No dedicated common amenity areas such as a clubhouse, leasing office, gym, or pool were identified in the provided plan set. Therefore, no common area APs or associated PoE switches have",
    "bomItems": [
      {
        "id": "bom-jXSru6-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 39,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "does this work??"
      },
      {
        "id": "bom-jXSru6-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 39,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "One thermostat per residential unit."
      },
      {
        "id": "bom-jXSru6-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Assumes a leasing office and a fitness center entrance. Requires verification."
      },
      {
        "id": "bom-jXSru6-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Assumes a baseline of cameras covering building exteriors and parking areas. Requires scope confirmation."
      },
      {
        "id": "bom-jXSru6-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 39,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-jXSru6-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 39,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-jXSru6-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "G43OjH7UW5lpwFGD6eB3",
    "quoteNumber": "QXT-2026-1032",
    "propertyName": "Hideaway Lofts",
    "clientName": "Greystar Real Estate Partners",
    "address": "204 West 3rd Street",
    "city": "Kansas City",
    "state": "MO",
    "unitsCount": 38,
    "stage": "Deal Won",
    "myquextStage": "Project Kickoff",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-23T13:50:32.924Z",
    "totalHardwareAmount": 32999,
    "totalInstallAmount": 6270,
    "monthlyServiceFee": 1064,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Total unit count of 38 was provided directly by user input. No floor plans, amenity square footage, or site plans were provided. All common area device quantities (APs, cameras, readers) are estimates based on a standard property of this size.",
    "bomItems": [
      {
        "id": "bom-G43OjH-01",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 38,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      },
      {
        "id": "bom-G43OjH-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 38,
        "installedCount": 0,
        "unitPrice": 250.0,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-G43OjH-03",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 38,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-G43OjH-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-G43OjH-05",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR-plated video intercom station for visitor self-guided check-in and delivery access."
      },
      {
        "id": "bom-G43OjH-06",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-G43OjH-07",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 38,
        "installedCount": 0,
        "unitPrice": 30.0,
        "description": "Device programming, cloud portal configuration, and backend account initialization."
      },
      {
        "id": "bom-G43OjH-08",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Device programming, cloud portal configuration, and backend account initialization."
      },
      {
        "id": "bom-G43OjH-09",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      }
    ]
  },
  {
    "id": "buuP51JrJT6WnogdVlDT",
    "quoteNumber": "QXT-2026-1033",
    "propertyName": "Shadow View Village",
    "clientName": "NewStreet Properties",
    "address": "9140 W Dodge Rd",
    "city": "Omaha",
    "state": "Nebraska",
    "unitsCount": 260,
    "stage": "Deal Won",
    "myquextStage": "On Deck",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-25T19:42:19.373855Z",
    "totalHardwareAmount": 99900,
    "totalInstallAmount": 42900,
    "monthlyServiceFee": 7280,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Total unit count of 260 was provided by user input. No floor plans or site plans were provided. All common area device quantities (Wi-Fi, Cameras, Access Control) are estimates based on a typical property of this size and should be verified.",
    "bomItems": [
      {
        "id": "bom-buuP51-01",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-buuP51-02",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-buuP51-03",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": ""
      },
      {
        "id": "bom-buuP51-04",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 220.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-buuP51-05",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 120.0,
        "description": "Our patented smart thermostat with built-in hub. Connects locks and sensors, detects occupancy, and saves energy, all without needing resident Wi-Fi."
      }
    ]
  },
  {
    "id": "K1qIh3Ym7iXdpkGRvAzS",
    "quoteNumber": "QXT-2026-1034",
    "propertyName": "Southern Downs",
    "clientName": "Alpha Southern Downs, LLC",
    "address": "710 Georgia Avenue",
    "city": "Statesboro",
    "state": "GA",
    "unitsCount": 214,
    "stage": "Deal Won",
    "myquextStage": "On Deck",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-10-19T18:34:30.094367Z",
    "totalHardwareAmount": 37386,
    "totalInstallAmount": 35310,
    "monthlyServiceFee": 5992,
    "assignedSalesLead": "Keenan Cheung",
    "notes": "CRITICAL SALES FLAG: The customer explicitly stated they want to keep their current ISP (Xiber) and are only interested in IoT device management. This BOM represents the full, integrated Quext powered by Google Fiber package. The sales team must address this misalignment and emphasize the benefits of a single, fully ma",
    "bomItems": [
      {
        "id": "bom-K1qIh3-01",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 214,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "Dependency for Quext Thermostat v2"
      },
      {
        "id": "bom-K1qIh3-02",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-K1qIh3-03",
        "name": "Shipping",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Unit",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Freight and standard ground delivery for hardware and deployment shipments."
      },
      {
        "id": "bom-K1qIh3-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 214,
        "installedCount": 0,
        "unitPrice": 49.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "6kzshTGPWEyNMdljq5ZZ",
    "quoteNumber": "QXT-2026-1035",
    "propertyName": "KU East Gateway",
    "clientName": "Sunflower Development",
    "address": "11th and Mississippi",
    "city": "Lawrence",
    "state": "Kansas",
    "unitsCount": 199,
    "stage": "Deal Won",
    "myquextStage": "On Deck",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-15T18:44:39.258Z",
    "totalHardwareAmount": 289559,
    "totalInstallAmount": 32835,
    "monthlyServiceFee": 5572,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "GEOGRAPHIC CONSTRAINT APPLIED: Property is in ZIP 66045, outside Google Fiber service area. Per instructions, Wi-Fi 6 hardware will be substituted. Schema keys labeled 'wifi7' are retained strictly for JSON validation but represent standard Wi-Fi 6 equivalents. No Google Fiber or 'Quext powered by Google Fiber' brandin",
    "bomItems": [
      {
        "id": "bom-6kzshT-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 199,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "1 per unit main entry."
      },
      {
        "id": "bom-6kzshT-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 199,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per residential unit."
      },
      {
        "id": "bom-6kzshT-03",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR-plated video intercom station for visitor self-guided check-in and delivery access."
      },
      {
        "id": "bom-6kzshT-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 770.73,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-6kzshT-05",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 59,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "The slim Schlage RC11 wired IP reader for narrow door frames. Get real-time, high-security access control managed by the Quext platform."
      },
      {
        "id": "bom-6kzshT-06",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 98,
        "installedCount": 0,
        "unitPrice": 746.72,
        "description": "This is a place holder for the Camera proposal from Eagle Eye. This will be removed from Quext letterhead and contracted through Southbay Hardware"
      },
      {
        "id": "bom-6kzshT-07",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 199,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "3GB Fiber Internet to the Unit with Managed Wifi 7 coverage in unit and community spaces.\n\nMonths 1-3 at $0.00 per unit (100% discount)\nMonths 4-6 at $11.75 per unit (75% discount)\nMonths 7-9 at $23.50 per unit (50% discount)\nMonths 10-12 a"
      },
      {
        "id": "bom-6kzshT-08",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 98,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      },
      {
        "id": "bom-6kzshT-09",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 Wi-Fi smart commercial thermostat per unit, pre-configured for property Wi-Fi networks."
      },
      {
        "id": "bom-6kzshT-10",
        "name": "Long Range Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 5000.0,
        "description": "Long-range RFID reader for vehicle gate automation and resident parking garages."
      }
    ]
  },
  {
    "id": "sf_imp_1785373518753_ac961e07",
    "quoteNumber": "QXT-2026-1036",
    "propertyName": "The Mill- Charlotte, NC",
    "clientName": "Iris Innovations",
    "address": "11015 Education Way",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 131,
    "stage": "Deal Won",
    "myquextStage": "On Deck",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-09-25T19:41:03.746911Z",
    "totalHardwareAmount": 34040,
    "totalInstallAmount": 21615,
    "monthlyServiceFee": 3668,
    "assignedSalesLead": "Keenan Cheung",
    "notes": "Imported from Salesforce Opportunity: The Mill- Charlotte, NC",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Key Fobs",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 300.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-02",
        "name": "Schlage Enrollment Reader(MT20)",
        "model": "SCH-MT20",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-03",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 4000.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-04",
        "name": "Schlage BE467 Greenwich - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Access Control",
        "quantity": 136,
        "installedCount": 0,
        "unitPrice": 180.0,
        "description": "Unlock powerful access control with the Schlage BE467, a robust, battery-powered, offline smart deadbolt. When activated by Quext software, this lock provides intelligent access control without the cost of new wiring or network infrastructu"
      },
      {
        "id": "bom-sf_imp-05",
        "name": "Schlage F10 Passage Handle - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 136,
        "installedCount": 0,
        "unitPrice": 35.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      }
    ]
  },
  {
    "id": "snHjGzXuymQfGp4dqIuc",
    "quoteNumber": "QXT-2026-1037",
    "propertyName": "The Union - Charlotte, NC",
    "clientName": "Iris Innovations",
    "address": "1201 Campus Pointe Ct",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 99,
    "stage": "Deal Won",
    "myquextStage": "On Deck",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-09-25T19:41:06.051167Z",
    "totalHardwareAmount": 29160,
    "totalInstallAmount": 16335,
    "monthlyServiceFee": 2772,
    "assignedSalesLead": "Keenan Cheung",
    "notes": "Imported from Salesforce Opportunity: The Union - Charlotte, NC",
    "bomItems": [
      {
        "id": "bom-snHjGz-01",
        "name": "Schlage Enrollment Reader(MT20)",
        "model": "SCH-MT20",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": ""
      },
      {
        "id": "bom-snHjGz-02",
        "name": "Key Fobs",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 300.0,
        "description": ""
      },
      {
        "id": "bom-snHjGz-03",
        "name": "Schlage F10 Passage Handle - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 104,
        "installedCount": 0,
        "unitPrice": 35.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-snHjGz-04",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 3500.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-snHjGz-05",
        "name": "Schlage BE467 Greenwich - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Apartment Units",
        "quantity": 104,
        "installedCount": 0,
        "unitPrice": 180.0,
        "description": "Unlock powerful access control with the Schlage BE467, a robust, battery-powered, offline smart deadbolt. When activated by Quext software, this lock provides intelligent access control without the cost of new wiring or network infrastructu"
      },
      {
        "id": "bom-snHjGz-06",
        "name": "Shipping",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      }
    ]
  },
  {
    "id": "Xmky6Oji9jgiOhEGfsqW",
    "quoteNumber": "QXT-2026-1038",
    "propertyName": "The Drexel Collective Apartments",
    "clientName": "Equity Residential",
    "address": "100 Drexel Point",
    "city": "Atlanta",
    "state": "Georgia",
    "unitsCount": 719,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:27:38.526Z",
    "totalHardwareAmount": 706688,
    "totalInstallAmount": 118635,
    "monthlyServiceFee": 20132,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used provided Total Unit Count of 719. Calculated 1 Wi-Fi 7 AP per unit based on standard apartment sizing; connects directly to ONT (Off-Switch).",
    "bomItems": [
      {
        "id": "bom-Xmky6O-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 719,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit entry door."
      },
      {
        "id": "bom-Xmky6O-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 719,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-Xmky6O-03",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "1 per residential building main entry (11 bldgs) + 1 for Clubhouse/Leasing main entry."
      },
      {
        "id": "bom-Xmky6O-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 719,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB Fiber to the unit with Managed Wifi 7."
      },
      {
        "id": "bom-Xmky6O-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 719,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": ""
      },
      {
        "id": "bom-Xmky6O-06",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 719,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": ""
      },
      {
        "id": "bom-Xmky6O-07",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 32,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      }
    ]
  },
  {
    "id": "3PGpXMq4rzreTFnaGNAh",
    "quoteNumber": "QXT-2026-1039",
    "propertyName": "340 Fremont Apartments",
    "clientName": "Equity Residential",
    "address": "340 Fremont St",
    "city": "San Francisco",
    "state": "California",
    "unitsCount": 348,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:26:15.460Z",
    "totalHardwareAmount": 349886,
    "totalInstallAmount": 57420,
    "monthlyServiceFee": 9744,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used user-provided Total Unit Count of 348. Estimated ~20 units (Townhouses + Penthouses/3-Bedrooms) require 2 APs based on square footage >1750sf or 3+ Bedroom rule.",
    "bomItems": [
      {
        "id": "bom-3PGpXM-01",
        "name": "Schlage XE360 Mortise",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 348,
        "installedCount": 0,
        "unitPrice": 455.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-3PGpXM-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 348,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-3PGpXM-03",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main Entrance and Service Entrance."
      },
      {
        "id": "bom-3PGpXM-04",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 35,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Coverage for Entrances, Lobbies, Podium Amenities, Rooftop, and Elevators."
      },
      {
        "id": "bom-3PGpXM-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 348,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB Fiber internet to the unit. Managed Wifi 7 throughout the property."
      },
      {
        "id": "bom-3PGpXM-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 348,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-3PGpXM-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 348,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": "Wired 24V HVAC condensate overflow sensor and automatic shutoff switch to prevent water damage."
      }
    ]
  },
  {
    "id": "1becgPUpriuZldpErNKT",
    "quoteNumber": "QXT-2026-1040",
    "propertyName": "Summit Crossing I",
    "clientName": "Equity Residential",
    "address": "3920 Ivy Summit Ct",
    "city": "Cumming",
    "state": "Georgia",
    "unitsCount": 345,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:26:09.764Z",
    "totalHardwareAmount": 330240,
    "totalInstallAmount": 56925,
    "monthlyServiceFee": 9660,
    "assignedSalesLead": "Blake Miller",
    "notes": "Source of Truth: User input utilized for total unit count of 345. Unit Mix: Specific square footage not provided; assumed 1 AP per unit (standard sizing <1750sqft).",
    "bomItems": [
      {
        "id": "bom-1becgP-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-1becgP-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-1becgP-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Estimated for Clubhouse, Fitness, Business Center, and Pool gates. Perimeter spaces."
      },
      {
        "id": "bom-1becgP-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB Fiber internet to the unit. Managed Wifi 7 throughout the property."
      },
      {
        "id": "bom-1becgP-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "Pack of 3."
      },
      {
        "id": "bom-1becgP-06",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": "Wired 24V HVAC condensate overflow sensor and automatic shutoff switch to prevent water damage."
      }
    ]
  },
  {
    "id": "7svddUPqZQC5ox7Jg9x5",
    "quoteNumber": "QXT-2026-1041",
    "propertyName": "Skyhouse South Apartments",
    "clientName": "Equity Residential",
    "address": "100 6th St NE",
    "city": "Atlanta",
    "state": "Georgia",
    "unitsCount": 320,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:26:36.241Z",
    "totalHardwareAmount": 309186,
    "totalInstallAmount": 52800,
    "monthlyServiceFee": 8960,
    "assignedSalesLead": "Blake Miller",
    "notes": "Source of Truth: User Input confirmed 320 Total Units. Topology: Residential Unit APs connect directly to Fiber ONT and do not consume IDF switch ports.",
    "bomItems": [
      {
        "id": "bom-7svddU-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-7svddU-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 323,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-7svddU-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Main Entry, Gym, Lounge, Pool, Dog Park, Amenity Access."
      },
      {
        "id": "bom-7svddU-04",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main Entrance."
      },
      {
        "id": "bom-7svddU-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "3GB Fiber internet to the unit. Managed Wifi 7 throughout property."
      },
      {
        "id": "bom-7svddU-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 323,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-7svddU-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 323,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": "Wired 24V HVAC condensate overflow sensor and automatic shutoff switch to prevent water damage."
      }
    ]
  },
  {
    "id": "cKda22F5qDvpMsBCZg1r",
    "quoteNumber": "QXT-2026-1042",
    "propertyName": "Osprey Apartments",
    "clientName": "Equity Residential",
    "address": "980 Howell Mill Rd",
    "city": "Atlanta",
    "state": "Georgia",
    "unitsCount": 320,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:28:16.754Z",
    "totalHardwareAmount": 334034,
    "totalInstallAmount": 52800,
    "monthlyServiceFee": 8960,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input of 320 Total Units as the North Star count. Topology Assumption: Due to the layout (1 Tower, 2 Mid-rises, 1 Garage), 6 switches are allocated to ensure at least 1 IDF per physical structure and sufficient ports in the main MDF (Tower).",
    "bomItems": [
      {
        "id": "bom-cKda22-01",
        "name": "Schlage XE360 Mortise",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 455.0,
        "description": "1 per unit entry door. 3 for reserve stock."
      },
      {
        "id": "bom-cKda22-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-cKda22-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 21,
        "installedCount": 0,
        "unitPrice": 735.43,
        "description": "Entries for Tower (13-story), 2x Mid-rises, Amenities (Gym, Club, Coworking, Rooftop, Pool), and Garage pedestrian points."
      },
      {
        "id": "bom-cKda22-04",
        "name": "Smart Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "1 for Tower Main Entry, 1 for each Mid-rise building entry."
      },
      {
        "id": "bom-cKda22-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB Fiber to the unit, Managed Wifi 7 throughout property."
      },
      {
        "id": "bom-cKda22-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": ""
      },
      {
        "id": "bom-cKda22-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": ""
      }
    ]
  },
  {
    "id": "nRk1GZPmox2QrRo6RwOl",
    "quoteNumber": "QXT-2026-1043",
    "propertyName": "Quarry Hills Apartments",
    "clientName": "Equity Residential",
    "address": "333 Ricciuti Dr.",
    "city": "Quincy",
    "state": "MA",
    "unitsCount": 316,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:29:49.071Z",
    "totalHardwareAmount": 320887,
    "totalInstallAmount": 52140,
    "monthlyServiceFee": 8848,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input (316) for Total Unit Count. Garden-style architecture implies surface parking; no Garage APs allocated.",
    "bomItems": [
      {
        "id": "bom-nRk1GZ-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 316,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "3 additional for reserve stock."
      },
      {
        "id": "bom-nRk1GZ-02",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 189,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "Secondary lock locations. Optional."
      },
      {
        "id": "bom-nRk1GZ-03",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 316,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. \n\n3 additional for reserve stock."
      },
      {
        "id": "bom-nRk1GZ-04",
        "name": "Brivo Access Control Takeover",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-nRk1GZ-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 316,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "1 for Washing Machine, 1 for Water Heater. \n\n6 Additional for reserve stock."
      },
      {
        "id": "bom-nRk1GZ-06",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 316,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": "Kitchen Sink and Dishwasher. 1 assuming close proximity."
      }
    ]
  },
  {
    "id": "JJWs91adS2ox3GfaIRz5",
    "quoteNumber": "QXT-2026-1044",
    "propertyName": "Continuum",
    "clientName": "Equity Residential",
    "address": "3701 CONTINUUM COURT",
    "city": "Alpharetta",
    "state": "Georgia",
    "unitsCount": 280,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:26:54.775Z",
    "totalHardwareAmount": 272460,
    "totalInstallAmount": 46200,
    "monthlyServiceFee": 7840,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total Unit Count established as 280 based on 'Project Data' table on sheet G-000 and 'Unit Matrix' on sheet A-400. Allocated 3x 2.5G Switches to cover distributed amenity loads across Basement (Leasing/Cowork), Level 1 (Club/Fitness/Pool), and Level 6 (Sky Lounge).",
    "bomItems": [
      {
        "id": "bom-JJWs91-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 280,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit (Standard Residential). 3 for reserve stock."
      },
      {
        "id": "bom-JJWs91-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 280,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-JJWs91-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Estimate for Amenity doors, Main Entries, Garage barriers, and Elevator controls."
      },
      {
        "id": "bom-JJWs91-04",
        "name": "Smart Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main Entry and Garage Visitor Entry."
      },
      {
        "id": "bom-JJWs91-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 280,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity space coverage"
      },
      {
        "id": "bom-JJWs91-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 280,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-JJWs91-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 280,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": "Wired 24V HVAC condensate overflow sensor and automatic shutoff switch to prevent water damage."
      }
    ]
  },
  {
    "id": "YEy7CT3aNmezlNrR2ETH",
    "quoteNumber": "QXT-2026-1045",
    "propertyName": "Prism at Park Avenue South",
    "clientName": "Equity Residential",
    "address": "50 East 28th Street",
    "city": "New York",
    "state": "New York",
    "unitsCount": 269,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:27:43.928Z",
    "totalHardwareAmount": 216153,
    "totalInstallAmount": 44385,
    "monthlyServiceFee": 7532,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used user-provided unit count of 269 (Rentals only). Verified max unit size (approx 1,580 sq ft) does not exceed 1,750 sq ft threshold; allocated 1 AP per unit.",
    "bomItems": [
      {
        "id": "bom-YEy7CT-01",
        "name": "Schlage XE360 Mortise",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 269,
        "installedCount": 0,
        "unitPrice": 455.0,
        "description": "1 per unit entry door. \n\n3 additional reserve stock."
      },
      {
        "id": "bom-YEy7CT-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 269,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit.\n\n3 additional reserve stock."
      },
      {
        "id": "bom-YEy7CT-03",
        "name": "Smart Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main Entrance."
      },
      {
        "id": "bom-YEy7CT-04",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 269,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": "3 Per Pack. Washing machine and Air Handler leak detection. Alerts via alarm and cloud, and will shut off the equipment with dry contacts which will stop the washer/Air handler from running and causing more flow.\n\n3 additional reserve stock"
      },
      {
        "id": "bom-YEy7CT-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 269,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "Sink and Dishwasher covered by one L1 with the cable. This depends on the distance between the two. \n\n3 additional reserve stock."
      },
      {
        "id": "bom-YEy7CT-06",
        "name": "Brivo Access Control Takeover",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      }
    ]
  },
  {
    "id": "fwJBmkj9yYx1EjelUKFV",
    "quoteNumber": "QXT-2026-1046",
    "propertyName": "The Penman Apartments",
    "clientName": "Equity Residential",
    "address": "680 Hamilton Ave SE",
    "city": "Atlanta",
    "state": "Georgia",
    "unitsCount": 262,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:28:45.802Z",
    "totalHardwareAmount": 259374,
    "totalInstallAmount": 43230,
    "monthlyServiceFee": 7336,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input for Total Unit Count: 262. Network Architecture: In-Unit APs are OFF-SWITCH (connect to ONT).",
    "bomItems": [
      {
        "id": "bom-fwJBmk-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 262,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-fwJBmk-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 262,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-fwJBmk-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 18,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Entries for 5 buildings + 6 Amenity spaces + Maintenance."
      },
      {
        "id": "bom-fwJBmk-04",
        "name": "Smart Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "1 per main building entrance."
      },
      {
        "id": "bom-fwJBmk-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 262,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB Managed Wifi 7 Internet. Fiber to the unit."
      },
      {
        "id": "bom-fwJBmk-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 262,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": ""
      },
      {
        "id": "bom-fwJBmk-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 262,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": ""
      }
    ]
  },
  {
    "id": "ne0zhqGp5vzuqyNytPP6",
    "quoteNumber": "QXT-2026-1047",
    "propertyName": "Kelli Apartments",
    "clientName": "Acme Assets LLC",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 250,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-10T18:43:50.276479Z",
    "totalHardwareAmount": 37500,
    "totalInstallAmount": 41250,
    "monthlyServiceFee": 7000,
    "assignedSalesLead": "Kelli Smith",
    "notes": "Synced from myquext.com (Survey/Design Requested) — New Construction scope for 250 units in Austin, TX.",
    "bomItems": [
      {
        "id": "bom-ne0zhq-01",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Our patented smart thermostat with built-in hub. Connects locks and sensors, detects occupancy, and saves energy, all without needing resident Wi-Fi."
      }
    ]
  },
  {
    "id": "Rmjdej3Mu4WXRFaygie6",
    "quoteNumber": "QXT-2026-1048",
    "propertyName": "Alexan Canton",
    "clientName": "Equity Residential",
    "address": "173 RESERVOIR DR",
    "city": "Canton",
    "state": "Georgia",
    "unitsCount": 240,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:27:17.910Z",
    "totalHardwareAmount": 230580,
    "totalInstallAmount": 39600,
    "monthlyServiceFee": 6720,
    "assignedSalesLead": "Blake Miller",
    "notes": "Source of Truth: Total unit count of 240 derived from the 'Unit Matrix' on Sheet A0.2B (Page 4). Switch Count: Calculated as 1 IDF switch per residential building (8 total) plus 1 for the Clubhouse/Leasing building, to support cameras, access control, and common area Wi-Fi.",
    "bomItems": [
      {
        "id": "bom-Rmjdej-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 240,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit for all residential units (Standard apartment configuration). 3 for reserve stock."
      },
      {
        "id": "bom-Rmjdej-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 240,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit for all residential units. 3 for reserve stock."
      },
      {
        "id": "bom-Rmjdej-03",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 240,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity space coverage."
      },
      {
        "id": "bom-Rmjdej-04",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-Rmjdej-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 240,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": ""
      },
      {
        "id": "bom-Rmjdej-06",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 240,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": ""
      }
    ]
  },
  {
    "id": "P1sx1mKYfA5eTbT5BJ2Q",
    "quoteNumber": "QXT-2026-1049",
    "propertyName": "Breakwater at Marina del Ray",
    "clientName": "Equity Residential",
    "address": "13900 Fiji Way",
    "city": "Marina del Ray",
    "state": "California",
    "unitsCount": 224,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:27:08.569Z",
    "totalHardwareAmount": 217242,
    "totalInstallAmount": 36960,
    "monthlyServiceFee": 6272,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input for total unit count (224). Residential Unit APs are OFF-SWITCH (connect to in-unit ONT); switch count reflects Common Areas only.",
    "bomItems": [
      {
        "id": "bom-P1sx1m-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 227,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit (Entry door). 3 for reserve stock."
      },
      {
        "id": "bom-P1sx1m-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 227,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-P1sx1m-03",
        "name": "Brivo Access Control Takeover",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Estimated: Main Entry, Gym, Pool, Clubhouse, Business Center"
      },
      {
        "id": "bom-P1sx1m-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 224,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB Fiber internet to the unit. Managed Wifi 7 throughout the property."
      },
      {
        "id": "bom-P1sx1m-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 227,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": ""
      },
      {
        "id": "bom-P1sx1m-06",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 227,
        "installedCount": 0,
        "unitPrice": 71.0,
        "description": ""
      }
    ]
  },
  {
    "id": "PhtZzcHlviq9mnGa7rNq",
    "quoteNumber": "QXT-2026-1050",
    "propertyName": "Mohawk 15",
    "clientName": "Grayson Capital",
    "address": "1531 Holmes Street",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 189,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-06T18:06:37.253903Z",
    "totalHardwareAmount": 132016,
    "totalInstallAmount": 31185,
    "monthlyServiceFee": 5292,
    "assignedSalesLead": "Blake Miller",
    "notes": "ASSUMPTION: The total unit count of 189 was determined based on the user-provided project description (Priority 1). CORE INFRASTRUCTURE: Requires 1 Quext Gateway/Controller for system management.",
    "bomItems": [
      {
        "id": "bom-PhtZzc-01",
        "name": "Smart Locks",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 189,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "Based on 1 lock per the 189 specified residential units. Assumes single entry door per unit."
      },
      {
        "id": "bom-PhtZzc-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 189,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "Includes 1 per unit (189). Assumes C-wire availability and standard HVAC systems."
      },
      {
        "id": "bom-PhtZzc-03",
        "name": "Access Control Readers",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 696.67,
        "description": "Estimated quantity for main entrances, amenity spaces, staff offices, and key access points. A detailed door hardware schedule is required for final count."
      },
      {
        "id": "bom-PhtZzc-04",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated quantity for coverage of entrances, amenity areas, parking, and lobbies. A detailed security review is recommended for final placement and count."
      },
      {
        "id": "bom-PhtZzc-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 189,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-PhtZzc-06",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      },
      {
        "id": "bom-PhtZzc-07",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Optional parking garage Wi-Fi 6 APs"
      },
      {
        "id": "bom-PhtZzc-08",
        "name": "2.5G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "For Wi-Fi 7 APs"
      },
      {
        "id": "bom-PhtZzc-09",
        "name": "1G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "For cameras, access control, etc."
      },
      {
        "id": "bom-PhtZzc-10",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": ""
      }
    ]
  },
  {
    "id": "U2TabBMaZxG9VftU90IJ",
    "quoteNumber": "QXT-2026-1051",
    "propertyName": "Reserve at Summit Crossing",
    "clientName": "Equity Residential",
    "address": "1055 Summit Overlook Way",
    "city": "Cummings",
    "state": "Georgia",
    "unitsCount": 172,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:27:28.816Z",
    "totalHardwareAmount": 166394,
    "totalInstallAmount": 28380,
    "monthlyServiceFee": 4816,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used user-provided Total Unit Count of 172. Calculated 1 Wi-Fi 7 AP per unit (Off-Switch, connected to ONT). No hallway APs allocated.",
    "bomItems": [
      {
        "id": "bom-U2TabB-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 172,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit (Standard Residential). 3 for reserve stock."
      },
      {
        "id": "bom-U2TabB-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 172,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-U2TabB-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Clubhouse, Fitness, Business Center, Package Room, Pool Gate."
      },
      {
        "id": "bom-U2TabB-04",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main entry/gate visitor management."
      },
      {
        "id": "bom-U2TabB-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 172,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB Fiber internet to the unit. Managed Wifi 7 throughout property"
      },
      {
        "id": "bom-U2TabB-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 172,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": ""
      },
      {
        "id": "bom-U2TabB-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 172,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": ""
      }
    ]
  },
  {
    "id": "lzV161FfHotLCL0fqXO6",
    "quoteNumber": "QXT-2026-1052",
    "propertyName": "Helix Apartments",
    "clientName": "Equity Residential",
    "address": "655 Washington Street",
    "city": "Weymouth",
    "state": "MA",
    "unitsCount": 160,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:29:28.592Z",
    "totalHardwareAmount": 124520,
    "totalInstallAmount": 26400,
    "monthlyServiceFee": 4480,
    "assignedSalesLead": "Blake Miller",
    "notes": "North Star: User provided total unit count of 160. Hallway/Corridor APs excluded per Negative Constraint (covered by In-Unit APs).",
    "bomItems": [
      {
        "id": "bom-lzV161-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit entry.\n\n3 additional locks for guest units. 3 additional locks for reserve stock."
      },
      {
        "id": "bom-lzV161-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-lzV161-03",
        "name": "Brivo Access Control Takeover",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-lzV161-04",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main Entrance."
      },
      {
        "id": "bom-lzV161-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "Pack of 3. "
      },
      {
        "id": "bom-lzV161-06",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": ""
      }
    ]
  },
  {
    "id": "mIiGgkxYy5GN6aOabFOc",
    "quoteNumber": "QXT-2026-1053",
    "propertyName": "The Refinery",
    "clientName": "Copaken Brooks",
    "address": "1818 Main Street",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 147,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:29:36.021Z",
    "totalHardwareAmount": 105283,
    "totalInstallAmount": 24255,
    "monthlyServiceFee": 4116,
    "assignedSalesLead": "Blake Miller",
    "notes": "ASSUMPTION: The Total Unit Count of 147 was determined using the User-Provided Count (Priority 1), which is considered the absolute ground truth for all per-unit calculations. ASSUMPTION: In-unit Wi-Fi AP count assumes standard unit layouts and sizes below 2,000 sq ft. A review of specific floor plans is needed to conf",
    "bomItems": [
      {
        "id": "bom-mIiGgk-01",
        "name": "Smart Locks",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 147,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "Based on 1 lock per unit for 147 total units. Assumes no secondary entry doors."
      },
      {
        "id": "bom-mIiGgk-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 147,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "Based on 1 thermostat per unit for 147 total units. Assumes single HVAC zone per unit."
      },
      {
        "id": "bom-mIiGgk-03",
        "name": "Access Control Readers",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 696.67,
        "description": "Estimated count for main entrance, amenity spaces (rooftop, fitness), package room, leasing office, and parking access. A detailed review of floor plans is required for final count."
      },
      {
        "id": "bom-mIiGgk-04",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Recommended placement at entrances/exits, lobby, rooftop amenity, package room, and parking access points. A formal security review is recommended."
      },
      {
        "id": "bom-mIiGgk-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 147,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-mIiGgk-06",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      },
      {
        "id": "bom-mIiGgk-07",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 11,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Optional parking garage Wi-Fi 6 APs"
      },
      {
        "id": "bom-mIiGgk-08",
        "name": "2.5G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "For Wi-Fi 7 APs"
      },
      {
        "id": "bom-mIiGgk-09",
        "name": "1G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "For cameras, access control, etc."
      },
      {
        "id": "bom-mIiGgk-10",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Added as a dependency for Eagle Eye Security Cameras."
      }
    ]
  },
  {
    "id": "7orA4L3EH07QaO8lafvL",
    "quoteNumber": "QXT-2026-1054",
    "propertyName": "Summit Crossing II",
    "clientName": "Equity Residential",
    "address": "1607 Summit Crossing Way, Cumming GA",
    "city": "Cumming",
    "state": "Georgia",
    "unitsCount": 140,
    "stage": "Needs Analysis",
    "myquextStage": "Survey/Design Requested",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:26:31.176Z",
    "totalHardwareAmount": 134180,
    "totalInstallAmount": 23100,
    "monthlyServiceFee": 3920,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input '140 Total Units' as the North Star count. Zero Common Area APs allocated: Phase II shares amenities (Clubhouse/Pool) with Phase I; no standalone amenity spaces exist in this phase's scope.",
    "bomItems": [
      {
        "id": "bom-7orA4L-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 140,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit (Standard)."
      },
      {
        "id": "bom-7orA4L-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 140,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-7orA4L-03",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 140,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB Fiber internet to the unit. Managed Wifi 7 throughout the property."
      },
      {
        "id": "bom-7orA4L-04",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Professional reconfiguration and system migration of existing Brivo access hardware into the Quext platform."
      },
      {
        "id": "bom-7orA4L-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 140,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "Pack of 3."
      },
      {
        "id": "bom-7orA4L-06",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 140,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": "Wired 24V HVAC condensate overflow sensor and automatic shutoff switch to prevent water damage."
      }
    ]
  },
  {
    "id": "1ciYTks80MMv3HtcXLoR",
    "quoteNumber": "QXT-2026-1055",
    "propertyName": "Sardis",
    "clientName": "Northwood Raven",
    "address": "8637 East Independence Boulevard",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 525,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-15T16:58:00.658Z",
    "totalHardwareAmount": 362957,
    "totalInstallAmount": 86625,
    "monthlyServiceFee": 14700,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total Scope Update: Analysis has been updated based on user instruction to a total of 525 units across 22 buildings. The original 392-unit plan is treated as Phase 1. Phase 2 Estimation: Phase 2 is assumed to add 133 units and 7 buildings. All hardware quantities for Phase 2 are scaled estimates based on the device den",
    "bomItems": [
      {
        "id": "bom-1ciYTk-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 525,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "One lock per unit door."
      },
      {
        "id": "bom-1ciYTk-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 524,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "One thermostat per unit."
      },
      {
        "id": "bom-1ciYTk-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 25,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for clubhouse, main building entrances, and pool gates."
      },
      {
        "id": "bom-1ciYTk-04",
        "name": "Eagle Eye Security Cameras - DF",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated for amenity spaces, building entrances, and site perimeter."
      },
      {
        "id": "bom-1ciYTk-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 525,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-1ciYTk-06",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      }
    ]
  },
  {
    "id": "MKidHUHnAO00DKPkUXVh",
    "quoteNumber": "QXT-2026-1056",
    "propertyName": "Pacific Place",
    "clientName": "Equity Residential",
    "address": "5211 Pacific Concourse Drive",
    "city": "Los Angeles",
    "state": "California",
    "unitsCount": 430,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-24T14:35:13.062111Z",
    "totalHardwareAmount": 332760,
    "totalInstallAmount": 70950,
    "monthlyServiceFee": 12040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input of 430 Total Units. Assumed 1 AP per unit. NOTE: Units with 24ft ceilings (Lofts) may require specific mounting hardware or placement strategies to ensure coverage at floor level.",
    "bomItems": [
      {
        "id": "bom-MKidHU-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 430,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit entry. 3 additional locks for reserve stock."
      },
      {
        "id": "bom-MKidHU-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 430,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for stock."
      },
      {
        "id": "bom-MKidHU-03",
        "name": "Brivo Access Control Takeover",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 29,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-MKidHU-04",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "1 per building main entrance."
      },
      {
        "id": "bom-MKidHU-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 430,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": "Pack of 3."
      },
      {
        "id": "bom-MKidHU-06",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 430,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": ""
      }
    ]
  },
  {
    "id": "BdCjy3kaNnxFfM5xDP6S",
    "quoteNumber": "QXT-2026-1057",
    "propertyName": "Muze Old Chapel Hill Road Apartments",
    "clientName": "Cortland Management",
    "address": "North White Oak Drive",
    "city": "Chapel Hill",
    "state": "NC",
    "unitsCount": 400,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-17T03:18:18.060847Z",
    "totalHardwareAmount": 399515,
    "totalInstallAmount": 66000,
    "monthlyServiceFee": 11200,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 400 was provided by user input. In-unit AP count is based on 1 AP per unit. A detailed review of the final unit mix is recommended to identify any units over 2,000 sq ft or with 3+ bedrooms that would require a second AP.",
    "bomItems": [
      {
        "id": "bom-BdCjy3-01",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 400,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-BdCjy3-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 400,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-BdCjy3-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 400,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "Comes in packs of 3. Wireless, battery-operated water leak and freeze detector. Features a 5ft sensing cable to detect leaks along its entire length and sends alerts via WiFi without requiring a separate hub."
      },
      {
        "id": "bom-BdCjy3-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 27,
        "installedCount": 0,
        "unitPrice": 1729.0,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-BdCjy3-05",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 27,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-BdCjy3-06",
        "name": "GFiber Managed Wi-Fi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 400,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      },
      {
        "id": "bom-BdCjy3-07",
        "name": "Standard Video",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 27,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "60-day local retention, remote live view, standard motion alerts, unified dashboard."
      }
    ]
  },
  {
    "id": "yKKoshC4TpPEyLKlmVen",
    "quoteNumber": "QXT-2026-1058",
    "propertyName": "Braker and Kramer",
    "clientName": "Lincoln Property Company",
    "address": "2300 Kramer Lane",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 397,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:31.287407Z",
    "totalHardwareAmount": 327664,
    "totalInstallAmount": 65505,
    "monthlyServiceFee": 11116,
    "assignedSalesLead": "Blake Miller",
    "notes": "Critical Flag: The primary PDF plan file was inaccessible due to its large size. All common area and infrastructure counts are industry-standard estimates based on the total unit count of 397. Unit Count: The total unit count of 397 was taken directly from the provided property context.",
    "bomItems": [
      {
        "id": "bom-yKKosh-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 397,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "Based on 1 lock per unit entry door."
      },
      {
        "id": "bom-yKKosh-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 397,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Based on 1 thermostat per unit."
      },
      {
        "id": "bom-yKKosh-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 397,
        "installedCount": 0,
        "unitPrice": 137.46,
        "description": "Based on 1 leak detector per unit."
      },
      {
        "id": "bom-yKKosh-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Estimated quantity for main entries, amenity spaces, and key access points."
      },
      {
        "id": "bom-yKKosh-05",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated quantity for entries/exits, parking, and amenity areas."
      },
      {
        "id": "bom-yKKosh-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 397,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Per unit monthly managed Wi-Fi service"
      },
      {
        "id": "bom-yKKosh-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "1N5qbCVlaQUJLAugmvGt",
    "quoteNumber": "QXT-2026-1059",
    "propertyName": "Six Forks",
    "clientName": "Beacon Partners",
    "address": "800 Boulder Bluff Road",
    "city": "Raleigh",
    "state": "NC",
    "unitsCount": 386,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-24T22:55:05.720Z",
    "totalHardwareAmount": 366789,
    "totalInstallAmount": 63690,
    "monthlyServiceFee": 10808,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 386 was provided by the user. Assumed 1 Wi-Fi 7 AP per unit. Per plan notes on RP-NET-032, units with more than 2 bedrooms require an additional AP; this is not factored into the current BOM.",
    "bomItems": [
      {
        "id": "bom-1N5qbC-01",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 386,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-1N5qbC-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 386,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-1N5qbC-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 386,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-1N5qbC-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-1N5qbC-05",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR-plated video intercom station for visitor self-guided check-in and delivery access."
      },
      {
        "id": "bom-1N5qbC-06",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 18,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Customized QR-plated video intercom station for visitor self-guided check-in and delivery access."
      },
      {
        "id": "bom-1N5qbC-07",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 386,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      },
      {
        "id": "bom-1N5qbC-08",
        "name": "Standard Video",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 18,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Commercial bullet security camera for outdoor perimeters, breezeways, and parking structures."
      }
    ]
  },
  {
    "id": "24kPWt8P4GWg7lq5vdhd",
    "quoteNumber": "QXT-2026-1060",
    "propertyName": "Howard Lane Flats",
    "clientName": "Related Companies",
    "address": "5117 East Howard Lane",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 360,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:29.577807Z",
    "totalHardwareAmount": 287858,
    "totalInstallAmount": 59400,
    "monthlyServiceFee": 10080,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 360 was sourced from user-provided project data, not a plan-based Unit Mix schedule. Per-unit device quantities (APs, Locks, Thermostats, Leak Detectors) are based on the default of 1 per unit. No detailed floor plans were available to assess for layouts requiring additional devices (e.g., units >1,",
    "bomItems": [
      {
        "id": "bom-24kPWt-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "Default: 1 per unit entry. Assumes no secondary patio/garage entries."
      },
      {
        "id": "bom-24kPWt-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Default: 1 per unit. Assumes no multi-level units requiring a second device."
      },
      {
        "id": "bom-24kPWt-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 137.46,
        "description": "Default: 1 per unit."
      },
      {
        "id": "bom-24kPWt-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Estimated count for main entry, amenities, and key access points. Plan verification required."
      },
      {
        "id": "bom-24kPWt-05",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated count for entry/exit points and primary amenity spaces. Plan verification required."
      },
      {
        "id": "bom-24kPWt-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Per unit monthly managed Wi-Fi service"
      },
      {
        "id": "bom-24kPWt-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      }
    ]
  },
  {
    "id": "gc1WA56Qkcz96A2d0hHY",
    "quoteNumber": "QXT-2026-1061",
    "propertyName": "Bowers South End",
    "clientName": "RMR Group",
    "address": "4001 Yancey Road",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 360,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-18T03:36:27.464879Z",
    "totalHardwareAmount": 260041,
    "totalInstallAmount": 59400,
    "monthlyServiceFee": 10080,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used user-provided Total Unit Count of 360 as the North Star. Allocated 1 Wi-Fi 7 AP per unit. While 'Unit 3A' appears to be 3-bedroom, counts are minimal; standard 1:1 allocation applied.",
    "bomItems": [
      {
        "id": "bom-gc1WA5-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 220.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-gc1WA5-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 120.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-gc1WA5-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 1170.0,
        "description": "Entries, L1 Amenities (Fitness, Club, Pool, Dog Wash, Bike), L2 Cowork, L8 Sky Lounge."
      },
      {
        "id": "bom-gc1WA5-04",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": ""
      },
      {
        "id": "bom-gc1WA5-05",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Coverage for L1 Amenities, L8 Sky Lounge, Garage entries, Elevator lobbies, and Stairwell egress."
      },
      {
        "id": "bom-gc1WA5-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity space coverage."
      },
      {
        "id": "bom-gc1WA5-07",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 120,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": ""
      },
      {
        "id": "bom-gc1WA5-08",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "sf_imp_1789999426784_27c28008",
    "quoteNumber": "QXT-2026-1062",
    "propertyName": "Maxwell Memorial, NFC add on - Houston, TX",
    "clientName": "RPM Living",
    "address": "5004 Memorial Drive",
    "city": "Houston",
    "state": "TX",
    "unitsCount": 356,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-09-29T04:41:30.370655Z",
    "totalHardwareAmount": 14908,
    "totalInstallAmount": 58740,
    "monthlyServiceFee": 9968,
    "assignedSalesLead": "Kelli Smith",
    "notes": "Imported from Salesforce Opportunity: Maxwell Memorial, NFC add on - Houston, TX",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Monthly Licensing Fee - NFC Wallet Access",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Software and Services",
        "quantity": 712,
        "installedCount": 0,
        "unitPrice": 1.5,
        "description": "Mobile credential NFC wallet pass (100 credentials per pack)."
      },
      {
        "id": "bom-sf_imp-02",
        "name": "Installation Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 597,
        "installedCount": 0,
        "unitPrice": 10.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-03",
        "name": "Pro Services Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 3250.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-04",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Hardware / Equipment",
        "quantity": 28,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Our patented smart thermostat with built-in hub. Connects locks and sensors, detects occupancy, and saves energy, all without needing resident Wi-Fi."
      }
    ]
  },
  {
    "id": "FbZ2IWB4d7FOyCtfQBgC",
    "quoteNumber": "QXT-2026-1063",
    "propertyName": "Summit at Salado",
    "clientName": "Madera Residential, LLC",
    "address": "12727 Vista Del Norte",
    "city": "San Antonio",
    "state": "TX",
    "unitsCount": 352,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-15T16:59:37.070Z",
    "totalHardwareAmount": 210171,
    "totalInstallAmount": 58080,
    "monthlyServiceFee": 9856,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 352 was provided by user input. No building plans were provided; all quantities for common areas, cameras, and access control are estimations based on a typical 352-unit new construction apartment community.",
    "bomItems": [
      {
        "id": "bom-FbZ2IW-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 352,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-FbZ2IW-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 352,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "One per residential unit."
      },
      {
        "id": "bom-FbZ2IW-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for primary amenity doors and site access points."
      },
      {
        "id": "bom-FbZ2IW-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 352,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and Amenity space coverage"
      }
    ]
  },
  {
    "id": "gkCQ1xdNkpxeU4FmhhZk",
    "quoteNumber": "QXT-2026-1064",
    "propertyName": "Tribute Rising",
    "clientName": "Integral Group",
    "address": "700 S Mangum",
    "city": "Durham",
    "state": "NC",
    "unitsCount": 345,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-24T20:37:27.519Z",
    "totalHardwareAmount": 291980,
    "totalInstallAmount": 56925,
    "monthlyServiceFee": 9660,
    "assignedSalesLead": "Blake Miller",
    "notes": "[SCOPE]: Unit count of 345 verified against the Unit Mix Schedule on Sheet A1.0. Project is confirmed as New Construction. [WIRELESS]: Common Area AP count (12 total) is based on the 'T' series symbols on the Electrical/Telecom sheets, covering ~20,000 sq ft of amenity space.",
    "bomItems": [
      {
        "id": "bom-gkCQ1x-01",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-gkCQ1x-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-gkCQ1x-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 51,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-gkCQ1x-04",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 92,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Commercial bullet security camera for outdoor perimeters, breezeways, and parking structures."
      },
      {
        "id": "bom-gkCQ1x-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "QrhrQWIerTG9HdETGPHv",
    "quoteNumber": "QXT-2026-1065",
    "propertyName": "Gemma Las Vegas",
    "clientName": "Southern Land Company",
    "address": "1207 South 3rd Street",
    "city": "Las Vegas",
    "state": "Nevada",
    "unitsCount": 337,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-10-19T18:34:30.380015Z",
    "totalHardwareAmount": 149143,
    "totalInstallAmount": 55605,
    "monthlyServiceFee": 9436,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count (337) was provided by the user. This is a competitive takeover proposal, intended to replace existing COX WiFi, Brivo Access Control, Yale Locks, and Honeywell Thermostats. This indicates the client has an existing budget for these services.",
    "bomItems": [
      {
        "id": "bom-QrhrQW-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 337,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "does this work??"
      },
      {
        "id": "bom-QrhrQW-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 337,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Replaces existing Honeywell T6 thermostats."
      },
      {
        "id": "bom-QrhrQW-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 24,
        "installedCount": 0,
        "unitPrice": 50.0,
        "description": ""
      },
      {
        "id": "bom-QrhrQW-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 337,
        "installedCount": 0,
        "unitPrice": 49.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "pcO3RmNhXmUGuRrAjFry",
    "quoteNumber": "QXT-2026-1066",
    "propertyName": "Arrowood Apartments",
    "clientName": "Greystar",
    "address": "801 E. Arrowood Rd.",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 336,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-31T21:00:48.442Z",
    "totalHardwareAmount": 321867,
    "totalInstallAmount": 55440,
    "monthlyServiceFee": 9408,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input '336 Total Units' as the primary source of truth. Allocated 1 Wi-Fi 7 AP per unit. Flag: Some 3-bedroom units (Types C1/C1A) may require a 2nd AP per schematic on Page 7; exact count of 3-bedroom units was not provided.",
    "bomItems": [
      {
        "id": "bom-pcO3Rm-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 336,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": ""
      },
      {
        "id": "bom-pcO3Rm-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 336,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": ""
      },
      {
        "id": "bom-pcO3Rm-03",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 25,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated allowance for Gates (4), Clubhouse/Pool (8), and Building Exteriors/Entries (13)."
      },
      {
        "id": "bom-pcO3Rm-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 18,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for Clubhouse amenities and Building main entries."
      },
      {
        "id": "bom-pcO3Rm-05",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "For main vehicular gate guest entry (ButterflyMX specified)."
      },
      {
        "id": "bom-pcO3Rm-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 336,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity space."
      },
      {
        "id": "bom-pcO3Rm-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 25,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Dependency for Eagle Eye Security Cameras"
      },
      {
        "id": "bom-pcO3Rm-08",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 336,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": ""
      },
      {
        "id": "bom-pcO3Rm-09",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 336,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": ""
      }
    ]
  },
  {
    "id": "jSuuXSxivcZyCyTkhO4P",
    "quoteNumber": "QXT-2026-1067",
    "propertyName": "30Six NoDa",
    "clientName": "Beacon Partners",
    "address": "424 East 36th Street",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 334,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-27T01:50:18.166Z",
    "totalHardwareAmount": 206685,
    "totalInstallAmount": 55110,
    "monthlyServiceFee": 9352,
    "assignedSalesLead": "Blake Miller",
    "notes": "Unit Count Source: The BOM is based on the user-provided 'North Star' count of 334 units. This conflicts with plan documents which state 344 units (Page 1) and 352 units (Page 2). Clarification is required. Common Area Estimation: Indoor (~9,900 sq ft), Outdoor (~10,000 sq ft), and Parking Garage (~150,000 sq ft) squar",
    "bomItems": [
      {
        "id": "bom-jSuuXS-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 334,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "Based on 1 lock per unit for apartment-style housing."
      },
      {
        "id": "bom-jSuuXS-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 334,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Based on 1 thermostat per unit."
      },
      {
        "id": "bom-jSuuXS-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Estimated quantity for main entries, amenities, and parking garage access."
      },
      {
        "id": "bom-jSuuXS-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 334,
        "installedCount": 0,
        "unitPrice": 195,
        "description": ""
      }
    ]
  },
  {
    "id": "6ObTUmOA52qaT3AyYxxl",
    "quoteNumber": "QXT-2026-1068",
    "propertyName": "Macedonia",
    "clientName": "Woodfield Development",
    "address": "2818 Macedonia Road",
    "city": "Cary",
    "state": "NC",
    "unitsCount": 330,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-06-01T20:59:12.073Z",
    "totalHardwareAmount": 296553,
    "totalInstallAmount": 54450,
    "monthlyServiceFee": 9240,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total Unit Count of 330 was provided by user input and used as the North Star for all in-unit calculations. Calculated 5 Indoor Common APs based on approximately 10,000 sq ft of indoor amenity space identified across Leasing, Clubroom, Co-work, Fitness, and Sky Lounge.",
    "bomItems": [
      {
        "id": "bom-6ObTUm-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 330,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "does this work??"
      },
      {
        "id": "bom-6ObTUm-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 330,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit based on standard baseline."
      },
      {
        "id": "bom-6ObTUm-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-6ObTUm-04",
        "name": "Eagle Eye Security Cameras - DF",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 24,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated based on main entrances, courtyards, garage levels, and prominent amenity spaces."
      },
      {
        "id": "bom-6ObTUm-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 330,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-6ObTUm-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 330,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-6ObTUm-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 24,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      }
    ]
  },
  {
    "id": "PsA1Z9zcbBL30GgxT08M",
    "quoteNumber": "QXT-2026-1069",
    "propertyName": "OneC1ty",
    "clientName": "Crescent Communities",
    "address": "1 City Avenue",
    "city": "Nashville",
    "state": "TN",
    "unitsCount": 313,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-24T21:24:34.374Z",
    "totalHardwareAmount": 318911,
    "totalInstallAmount": 51645,
    "monthlyServiceFee": 8764,
    "assignedSalesLead": "Blake Miller",
    "notes": "[SCOPE]: Unit count of 313 verified via architectural unit mix and technology floor plans (T2-00 through T2-06). [WIRELESS]: Indoor Common APs (9) allocated for Plaza Level Lobby/Social Lounge and Level 6 Sky Lounge/Fitness. Outdoor APs (5) allocated for Plaza Courtyard and Level 6 Pool Deck. Hallways are intentionally",
    "bomItems": [
      {
        "id": "bom-PsA1Z9-01",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 313,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-PsA1Z9-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 313,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-PsA1Z9-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 38,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-PsA1Z9-04",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 24,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Commercial bullet security camera for outdoor perimeters, breezeways, and parking structures."
      },
      {
        "id": "bom-PsA1Z9-05",
        "name": "Leak Sensor",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 313,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-PsA1Z9-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 313,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Smart apartment IoT management platform for automated HVAC energy savings and leak sensor monitoring."
      },
      {
        "id": "bom-PsA1Z9-07",
        "name": "Standard Video",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 28,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      }
    ]
  },
  {
    "id": "ASDhi8BVtJF4ulT9iM7m",
    "quoteNumber": "QXT-2026-1070",
    "propertyName": "Render Tucker",
    "clientName": "Crescent Communities",
    "address": "2059 Northlake Parkway",
    "city": "Tucker",
    "state": "Georgia",
    "unitsCount": 312,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-01T14:31:48.463Z",
    "totalHardwareAmount": 334512,
    "totalInstallAmount": 51480,
    "monthlyServiceFee": 8736,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Unit AP count (312) based on provided unit total; sq ft averages (<1750sf) indicate 1 AP per unit is sufficient. Indoor Common APs (8) include 7 for Club/Leasing/Fitness and 1 for Maintenance Shop in Building G4.",
    "bomItems": [
      {
        "id": "bom-ASDhi8-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 312,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "1 per unit (Standard Residential)"
      },
      {
        "id": "bom-ASDhi8-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 312,
        "installedCount": 0,
        "unitPrice": 177.27,
        "description": "1 per unit"
      },
      {
        "id": "bom-ASDhi8-03",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 22,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimate based on Club perimeter and Building Entry coverage (1MP/3MP spec)"
      },
      {
        "id": "bom-ASDhi8-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimate for Club, Pool, Gym, and Building Entries"
      },
      {
        "id": "bom-ASDhi8-05",
        "name": "Video Intercom / Telephone Entry",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimate for 6 Residential Buildings + Club + Gate"
      },
      {
        "id": "bom-ASDhi8-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 312,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-ASDhi8-07",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 312,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-ASDhi8-08",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 312,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-ASDhi8-09",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 28,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      }
    ]
  },
  {
    "id": "7QDzubFSXbr9urpeejE3",
    "quoteNumber": "QXT-2026-1071",
    "propertyName": "Vertis",
    "clientName": "Southern Land Company",
    "address": "4000 Hillsboro Pike",
    "city": "Nashville",
    "state": "TN",
    "unitsCount": 310,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:29.863759Z",
    "totalHardwareAmount": 138190,
    "totalInstallAmount": 51150,
    "monthlyServiceFee": 8680,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 310 was provided by the user. Quantities for Access Control Readers (14) and IP Cameras (14) are estimates based on listed amenities and typical high-rise building layouts. A detailed site survey is required for final counts.",
    "bomItems": [
      {
        "id": "bom-7QDzub-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 310,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "Based on 1 lock per unit."
      },
      {
        "id": "bom-7QDzub-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 310,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 Wi-Fi smart commercial thermostat per unit, pre-configured for property Wi-Fi networks."
      },
      {
        "id": "bom-7QDzub-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Estimated quantity for main entry, amenity, and service doors. A detailed site survey is required."
      },
      {
        "id": "bom-7QDzub-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 310,
        "installedCount": 0,
        "unitPrice": 49.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "BmCUmJQ9vaxCVaW8VwbG",
    "quoteNumber": "QXT-2026-1072",
    "propertyName": "The Upton at Longhorn Quarry",
    "clientName": "Greystar Real Estate Partners",
    "address": "4906 Wurzbach Parkway",
    "city": "San Antonio",
    "state": "TX",
    "unitsCount": 306,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-09-29T15:40:26.196271Z",
    "totalHardwareAmount": 152330,
    "totalInstallAmount": 50490,
    "monthlyServiceFee": 8568,
    "assignedSalesLead": "Jeff Morrison",
    "notes": "Synced from myquext.com (Estimate Sent) — Retrofit scope for 306 units in San Antonio, TX.",
    "bomItems": [
      {
        "id": "bom-BmCUmJ-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 399,
        "installedCount": 0,
        "unitPrice": 220.0,
        "description": "BE467GRW626"
      },
      {
        "id": "bom-BmCUmJ-02",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Wireless commercial exit device trim for common area egress doors, fitness centers, and perimeter exits."
      },
      {
        "id": "bom-BmCUmJ-03",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 450.0,
        "description": "Wireless smart cylindrical lockset for resident units and student bedrooms. Supports mobile credentials and remote management."
      },
      {
        "id": "bom-BmCUmJ-04",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 306,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "1 smart thermostat per unit with integrated IoT hub. Coordinates wireless door locks and sensors."
      },
      {
        "id": "bom-BmCUmJ-05",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-BmCUmJ-06",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Dedicated project management: Vendor liaison, remote install support, trade coordination, and milestone tracking."
      },
      {
        "id": "bom-BmCUmJ-07",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Slim profile IP reader controller for narrow door frames, glass mullions, and gates."
      },
      {
        "id": "bom-BmCUmJ-08",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Wired IP reader controller for main entrances, amenity rooms, and high-security perimeter doors."
      },
      {
        "id": "bom-BmCUmJ-09",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      }
    ]
  },
  {
    "id": "Mobwo3verRt6Id5fXR4X",
    "quoteNumber": "QXT-2026-1073",
    "propertyName": "Maple",
    "clientName": "Chatham",
    "address": "410 York Street",
    "city": "Cary",
    "state": "NC",
    "unitsCount": 304,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-24T19:32:43.054Z",
    "totalHardwareAmount": 201150,
    "totalInstallAmount": 50160,
    "monthlyServiceFee": 8512,
    "assignedSalesLead": "Blake Miller",
    "notes": "[SCOPE] Architectural takeoff verified for 304 residential units across the building footprint. [WIRELESS] 1:1 In-Unit Wi-Fi 7 AP allocation (304 units, direct in-unit Fiber ONT termination) + 21 Indoor Common APs and 11 Outdoor APs for full property amenity coverage.",
    "bomItems": [
      {
        "id": "bom-Mobwo3-01",
        "name": "Smart Deadbolt Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 304,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-Mobwo3-02",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 304,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Vandal-resistant indoor/outdoor dome security camera for amenity areas, fitness centers, and perimeter coverage."
      },
      {
        "id": "bom-Mobwo3-03",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 304,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-Mobwo3-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 21,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-Mobwo3-05",
        "name": "Eagle Eye Security Cameras - DD08",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 21,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Vandal-resistant indoor/outdoor dome security camera for amenity areas, fitness centers, and perimeter coverage."
      }
    ]
  },
  {
    "id": "MLiGqUV37R2Kqs7iJQuI",
    "quoteNumber": "QXT-2026-1074",
    "propertyName": "Mount Moriah II",
    "clientName": "Woodfield Development",
    "address": "5302 Old Chapel Hill Road",
    "city": "Durham",
    "state": "NC",
    "unitsCount": 302,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-06-01T21:12:59.169Z",
    "totalHardwareAmount": 261991,
    "totalInstallAmount": 49830,
    "monthlyServiceFee": 8456,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 302 was directly provided by user input. Unit Wi-Fi APs calculated as 1 per unit plus a 25% density increase (302 * 1.25 = 378 APs), due to lack of specific unit square footage or bedroom count details in the provided plans.",
    "bomItems": [
      {
        "id": "bom-MLiGqU-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 302,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": ""
      },
      {
        "id": "bom-MLiGqU-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 302,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-MLiGqU-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "does this work??"
      },
      {
        "id": "bom-MLiGqU-04",
        "name": "Eagle Eye Security Cameras - DF",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated for common entries, club amenities, pool area, and garage entrances."
      },
      {
        "id": "bom-MLiGqU-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 378,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-MLiGqU-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 302,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-MLiGqU-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "w0OIGVeTiR1HlwRO1C7F",
    "quoteNumber": "QXT-2026-1075",
    "propertyName": "Fallyn",
    "clientName": "Greystar",
    "address": "110 19th Avenue S",
    "city": "Nashville",
    "state": "Tennessee",
    "unitsCount": 298,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-28T21:11:34.239Z",
    "totalHardwareAmount": 203758,
    "totalInstallAmount": 49170,
    "monthlyServiceFee": 8344,
    "assignedSalesLead": "Danielle Finley",
    "notes": "Used User Input for Total Unit Count: 298. Calculated Unit APs at 1:1 ratio. Note: Penthouses (up to 3-bed) may require a second AP if >1750 sqft, but specific counts were not provided.",
    "bomItems": [
      {
        "id": "bom-w0OIGV-01",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 298,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "1 per unit."
      },
      {
        "id": "bom-w0OIGV-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 298,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "1 per unit entry door."
      },
      {
        "id": "bom-w0OIGV-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Entrances, Garage Access, Gym, Pool, Lounge, and Bar entry points."
      },
      {
        "id": "bom-w0OIGV-04",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Lobby, Elevators, Garage Ramps, Pool, Lounge, and Amenity surveillance."
      },
      {
        "id": "bom-w0OIGV-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 298,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs. and Amenity Space coverage."
      },
      {
        "id": "bom-w0OIGV-06",
        "name": "Standard Video",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Cloud recording for 7 days, per security camera."
      },
      {
        "id": "bom-w0OIGV-07",
        "name": "Aeotec Leak Sensor - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 60.0,
        "description": "1 Z-Wave leak sensor per unit."
      }
    ]
  },
  {
    "id": "9RlZcb7zfcsOrnvwTxG0",
    "quoteNumber": "QXT-2026-1076",
    "propertyName": "Bria Symphony Park",
    "clientName": "Southern Land Company",
    "address": "255 Promenade Place",
    "city": "Las Vegas",
    "state": "NV",
    "unitsCount": 275,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:29.969599Z",
    "totalHardwareAmount": 123275,
    "totalInstallAmount": 45375,
    "monthlyServiceFee": 7700,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 255 is based on user-provided data. This is primarily an IoT takeover and hardware replacement project. The Wi-Fi BOM is zeroed out as the property will retain its existing COX Wi-Fi network, which will be utilized for connectivity of Wi-Fi-based IoT devices.",
    "bomItems": [
      {
        "id": "bom-9RlZcb-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 275,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "Proposed Schlage Control locks to replace existing hardware."
      },
      {
        "id": "bom-9RlZcb-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 275,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 Wi-Fi smart commercial thermostat per unit, pre-configured for property Wi-Fi networks."
      },
      {
        "id": "bom-9RlZcb-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 17,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Estimated number of Brivo Door to take over for control and NFC."
      },
      {
        "id": "bom-9RlZcb-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 275,
        "installedCount": 0,
        "unitPrice": 49.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "4NO5eSSwosylWnnf1xH3",
    "quoteNumber": "QXT-2026-1077",
    "propertyName": "Capella",
    "clientName": "Southern Land Company",
    "address": "277 Promenade Place",
    "city": "Las Vegas",
    "state": "NV",
    "unitsCount": 272,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-10-14T14:00:14.041Z",
    "totalHardwareAmount": 74528,
    "totalInstallAmount": 44880,
    "monthlyServiceFee": 7616,
    "assignedSalesLead": "Blake Miller",
    "notes": "Unit count of 272 is based on user-provided input, which is the North Star for this BOM. BOM includes 272 in-unit Wi-Fi 7 APs for a full QpGF package proposal. However, customer notes indicate existing COX Community WiFi will remain for now. This should be a key point of discussion during the sales process.",
    "bomItems": [
      {
        "id": "bom-4NO5eS-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 272,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "Schlage Control locks to replace existing Yale locks as per user notes."
      },
      {
        "id": "bom-4NO5eS-02",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software",
        "quantity": 272,
        "installedCount": 0,
        "unitPrice": 49.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "p4hay7klJEF63N77Fcdd",
    "quoteNumber": "QXT-2026-1078",
    "propertyName": "Penler Creston Circle",
    "clientName": "Penler Development",
    "address": "10837 MT. Holly Rd",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 268,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-07T15:56:56.120671Z",
    "totalHardwareAmount": 177894,
    "totalInstallAmount": 44220,
    "monthlyServiceFee": 7504,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input for Total Unit Count: 268. Network Architecture: Residential Units are treated as 'Off-Switch' (Direct ONT connection). No IDF switches allocated for residential buildings.",
    "bomItems": [
      {
        "id": "bom-p4hay7-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 268,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "1 per unit entry door."
      },
      {
        "id": "bom-p4hay7-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 268,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-p4hay7-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for Amenities: Clubhouse Main (2), Pool Gates (2), Maintenance (1), Mail Kiosk (1)."
      },
      {
        "id": "bom-p4hay7-04",
        "name": "Smart Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Clubhouse Main Entry."
      },
      {
        "id": "bom-p4hay7-05",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Coverage for Leasing Office, Gym, Pool Area, and Maintenance."
      },
      {
        "id": "bom-p4hay7-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 268,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-p4hay7-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "f7XFRpOYXgnWL7YRWi5f",
    "quoteNumber": "QXT-2026-1079",
    "propertyName": "The Summit at Marbella Ranch Phase 2",
    "clientName": "Real Estate Equities",
    "address": "Glendale Community Blvd",
    "city": "Glendale",
    "state": "AZ",
    "unitsCount": 260,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-23T14:23:08.072383Z",
    "totalHardwareAmount": 128100,
    "totalInstallAmount": 42900,
    "monthlyServiceFee": 7280,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 260 units in Glendale, AZ.",
    "bomItems": [
      {
        "id": "bom-f7XFRp-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-f7XFRp-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-f7XFRp-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-f7XFRp-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-f7XFRp-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "gRi8l0rKmkTst8U8fDlr",
    "quoteNumber": "QXT-2026-1080",
    "propertyName": "Mosby North Hills",
    "clientName": "Middleburg",
    "address": "4620 Old Wake Forest Road",
    "city": "Raleigh",
    "state": "NC",
    "unitsCount": 260,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:30.754431Z",
    "totalHardwareAmount": 183972,
    "totalInstallAmount": 42900,
    "monthlyServiceFee": 7280,
    "assignedSalesLead": "Shaun Zitani",
    "notes": "The Bill of Materials is based on the user-provided 'North Star' unit count of 260. A manual count from the electrical riser diagrams (E500-E504) totals 250 units; this discrepancy is noted. A total of 286 in-unit APs were calculated. This assumes that 10% of units (26 units, consistent with C1 3-Bedroom floor plans) r",
    "bomItems": [
      {
        "id": "bom-gRi8l0-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "Based on 1 lock per unit for apartment-style housing."
      },
      {
        "id": "bom-gRi8l0-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-gRi8l0-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 21,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Count based on 'AC' symbols on plans for amenity, building, and facility entrances."
      },
      {
        "id": "bom-gRi8l0-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated quantity as no camera locations were specified on the plans."
      },
      {
        "id": "bom-gRi8l0-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 292,
        "installedCount": 0,
        "unitPrice": 195,
        "description": ""
      },
      {
        "id": "bom-gRi8l0-06",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "8VbFEVD2MYPsJrjGJz7M",
    "quoteNumber": "QXT-2026-1081",
    "propertyName": "The Hutton at Privada",
    "clientName": "CIP Communities",
    "address": "2801 S 210th Court",
    "city": "Omaha",
    "state": "Nebraska",
    "unitsCount": 258,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-29T15:40:25.585327Z",
    "totalHardwareAmount": 122030,
    "totalInstallAmount": 42570,
    "monthlyServiceFee": 7224,
    "assignedSalesLead": "Blake Miller",
    "notes": "CRITICAL: Property located outside Google Fiber service area (ZIP 68022). CONSTRAINT APPLIED: All Wi-Fi 7 hardware and GFiber branding removed. Wi-Fi 7 BOM slots set to 0.",
    "bomItems": [
      {
        "id": "bom-8VbFEV-01",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 1050.0,
        "description": "Vestibule Exterior\nVestibule Interior\nPackage Room\nConference Room\nCoffee Bar\nClubroom\nCorridor\nFitness Interior\nFitness Exterior\n4 Fence Gates"
      },
      {
        "id": "bom-8VbFEV-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 258,
        "installedCount": 0,
        "unitPrice": 140.0,
        "description": "1 per unit"
      },
      {
        "id": "bom-8VbFEV-03",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 258,
        "installedCount": 0,
        "unitPrice": 220.0,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-8VbFEV-04",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-8VbFEV-05",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "SERVICES - ONE TIME QUEXT FEES",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      },
      {
        "id": "bom-8VbFEV-06",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "SERVICES - ONE TIME QUEXT FEES",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 6000.0,
        "description": "Dedicated project management: Vendor liaison, remote install support, trade coordination, and milestone tracking."
      }
    ]
  },
  {
    "id": "e6VMPNJLJvJ2Yhy1f5DO",
    "quoteNumber": "QXT-2026-1082",
    "propertyName": "Nest on Seventy",
    "clientName": "BBCG - Broadband Consulting Group",
    "address": "Garner Community Blvd",
    "city": "Garner",
    "state": "North Carolina",
    "unitsCount": 256,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-06-30T20:59:39.350Z",
    "totalHardwareAmount": 235265,
    "totalInstallAmount": 42240,
    "monthlyServiceFee": 7168,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total Unit Count (256) extracted from Overall Unit Matrix. Estimated 4 C1 3-Bedroom units based on Type A matrix and addressing plans. Added 4 extra Wi-Fi 7 Unit APs for these 3-Bedroom units (260 total).",
    "bomItems": [
      {
        "id": "bom-e6VMPN-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 250.0,
        "description": "1 per unit entry."
      },
      {
        "id": "bom-e6VMPN-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-e6VMPN-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for primary entries and amenity spaces (Gym, Lounge, Mail, Pool)."
      },
      {
        "id": "bom-e6VMPN-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": ""
      },
      {
        "id": "bom-e6VMPN-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 257,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-e6VMPN-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-e6VMPN-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "ZPUtED5QVmvw7mrW32vE",
    "quoteNumber": "QXT-2026-1083",
    "propertyName": "Ashburn Apartments",
    "clientName": "Charter Properties",
    "address": "10021 Steele Creek Road",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 252,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:30.599439Z",
    "totalHardwareAmount": 167675,
    "totalInstallAmount": 41580,
    "monthlyServiceFee": 7056,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 252 was provided by the user and used as the 'North Star' for all per-unit calculations. No floor plans or unit mix schedules were provided; assumed 1 smart lock, 1 thermostat, and 1 Wi-Fi AP per unit.",
    "bomItems": [
      {
        "id": "bom-ZPUtED-01",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 252,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "1 per unit, based on provided unit count."
      },
      {
        "id": "bom-ZPUtED-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 252,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit, based on provided unit count."
      },
      {
        "id": "bom-ZPUtED-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Estimated count for clubhouse, pool gates, and other amenity entrances."
      },
      {
        "id": "bom-ZPUtED-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated count for amenity spaces and property entrances/exits."
      },
      {
        "id": "bom-ZPUtED-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 195,
        "description": ""
      },
      {
        "id": "bom-ZPUtED-06",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "tfmaNdPvN305n6D4DMjm",
    "quoteNumber": "QXT-2026-1084",
    "propertyName": "Desert Oasis",
    "clientName": "Related Companies",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 252,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-17T15:40:59.032559Z",
    "totalHardwareAmount": 80569,
    "totalInstallAmount": 41580,
    "monthlyServiceFee": 7056,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 252 units in Austin, TX.",
    "bomItems": [
      {
        "id": "bom-tfmaNd-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 252,
        "installedCount": 0,
        "unitPrice": 250.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-tfmaNd-02",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 800.0,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-tfmaNd-03",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 267,
        "installedCount": 0,
        "unitPrice": 10.0,
        "description": "Programming and Back End Portal Set Up"
      },
      {
        "id": "bom-tfmaNd-04",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Training and Onboarding, one-time cost"
      },
      {
        "id": "bom-tfmaNd-05",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Project Management Fee"
      },
      {
        "id": "bom-tfmaNd-06",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR Plated Intercom "
      }
    ]
  },
  {
    "id": "P89jZs5Es51PiYULWCu0",
    "quoteNumber": "QXT-2026-1085",
    "propertyName": "Alston Yards",
    "clientName": "Heritage Capital Partners",
    "address": "N.C. 55 and O'Kelly Chapel Road",
    "city": "Cary",
    "state": "North Carolina",
    "unitsCount": 250,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-24T20:32:52.080Z",
    "totalHardwareAmount": 230482,
    "totalInstallAmount": 41250,
    "monthlyServiceFee": 7000,
    "assignedSalesLead": "Blake Miller",
    "notes": "Unit count of 860 established based on user-provided project description. Common Area AP count (24 total) estimated based on 'highly amenitized' description across a mid-rise footprint.",
    "bomItems": [
      {
        "id": "bom-P89jZs-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 240.45,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-P89jZs-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Our patented smart thermostat with built-in hub. Connects locks and sensors, detects occupancy, and saves energy, all without needing resident Wi-Fi."
      },
      {
        "id": "bom-P89jZs-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Located at primary amenity entries, gym, and leasing office"
      },
      {
        "id": "bom-P89jZs-04",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 43,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated 1 camera per 20 units for coverage of amenities and entry points"
      },
      {
        "id": "bom-P89jZs-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity space coverage"
      },
      {
        "id": "bom-P89jZs-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 137.46,
        "description": "Comes in packs of 3. Wireless, battery-operated water leak and freeze detector. Features a 5ft sensing cable to detect leaks along its entire length and sends alerts via WiFi without requiring a separate hub."
      },
      {
        "id": "bom-P89jZs-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 43,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "zJbcmf0ruD6m46v5knut",
    "quoteNumber": "QXT-2026-1086",
    "propertyName": "Mark Test Prop",
    "clientName": "MAA Communities",
    "address": "123 Sesame Street",
    "city": "New York",
    "state": "NY",
    "unitsCount": 250,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-05T15:38:24.179167Z",
    "totalHardwareAmount": 220303,
    "totalInstallAmount": 41250,
    "monthlyServiceFee": 7000,
    "assignedSalesLead": "Mark Zanders",
    "notes": "Unit count (250) taken strictly from user input. Allocated 1 Wi-Fi 7 AP, 1 Smart Thermostat, and 1 Smart Lock per residential unit.",
    "bomItems": [
      {
        "id": "bom-zJbcmf-01",
        "name": "Wi-Fi 7 Access Point",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1 per unit; connects to Unit ONT (Off-Switch)."
      },
      {
        "id": "bom-zJbcmf-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "1 per unit."
      },
      {
        "id": "bom-zJbcmf-03",
        "name": "Smart Lock (Deadbolt)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "1 per unit entry."
      },
      {
        "id": "bom-zJbcmf-04",
        "name": "Access Control Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated for Main Entry, Side Entry, Pool Gates, and 4 Amenity Doors."
      },
      {
        "id": "bom-zJbcmf-05",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main Entrance."
      },
      {
        "id": "bom-zJbcmf-06",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 11,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Coverage for Entrances, Pool, Amenities, and Perimeter."
      },
      {
        "id": "bom-zJbcmf-07",
        "name": "Quext IoT Gateway/Controller",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Central management appliance."
      },
      {
        "id": "bom-zJbcmf-08",
        "name": "Network Video Recorder (NVR)",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Storage for security camera footage."
      },
      {
        "id": "bom-zJbcmf-09",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-zJbcmf-10",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      },
      {
        "id": "bom-zJbcmf-11",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 11,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Added as a dependency for Eagle Eye Security Cameras."
      }
    ]
  },
  {
    "id": "aoRxWplnhs1lbndtYpU3",
    "quoteNumber": "QXT-2026-1087",
    "propertyName": "Grant Street Apartments",
    "clientName": "AMFP VI Grant LLC",
    "address": "287 E. 17TH AVE",
    "city": "Denver",
    "state": "Colorado",
    "unitsCount": 250,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-23T21:17:01.471903Z",
    "totalHardwareAmount": 171040,
    "totalInstallAmount": 41250,
    "monthlyServiceFee": 7000,
    "assignedSalesLead": "Blake Miller",
    "notes": "Source: Total unit count of 250 verified against Unit Matrix (Sheet A1.03). Unit AP Allocation: Calculated 259 total APs. 241 units allocated 1 AP. 9 units allocated 2 APs based on Quext rules (>1750 sqft or 3 Bedrooms). Specific units requiring 2 APs: Type MLB2 (1 unit @ 1802sf), Type C1 (7 units, 3-Bed), Type C1-TA (",
    "bomItems": [
      {
        "id": "bom-aoRxWp-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "Allocated 1 per unit."
      },
      {
        "id": "bom-aoRxWp-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Allocated 1 per unit."
      },
      {
        "id": "bom-aoRxWp-03",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 250,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity Wifi"
      },
      {
        "id": "bom-aoRxWp-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": ""
      },
      {
        "id": "bom-aoRxWp-05",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": ""
      }
    ]
  },
  {
    "id": "eLAhs08RurA3VW92vmX3",
    "quoteNumber": "QXT-2026-1088",
    "propertyName": "Hanover Flats",
    "clientName": "Asset Living",
    "address": "15840 Clay Plaza",
    "city": "Bennington",
    "state": "NE",
    "unitsCount": 245,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-25T17:20:37.340863Z",
    "totalHardwareAmount": 40375,
    "totalInstallAmount": 40425,
    "monthlyServiceFee": 6860,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Total unit count (245) explicitly provided by the user. Assumed 1 Wi-Fi 7 AP per unit due to no unit size or bedroom count provided. No multi-AP units considered.",
    "bomItems": [
      {
        "id": "bom-eLAhs0-01",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-eLAhs0-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 205,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-eLAhs0-03",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-eLAhs0-04",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": ""
      },
      {
        "id": "bom-eLAhs0-05",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 225,
        "installedCount": 0,
        "unitPrice": 10.0,
        "description": "Programming and Back End Portal Set Up"
      },
      {
        "id": "bom-eLAhs0-06",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Training and Onboarding, one-time cost"
      },
      {
        "id": "bom-eLAhs0-07",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1000.0,
        "description": "Project Management Fee"
      }
    ]
  },
  {
    "id": "O1y4pRjem33meFxIr9hY",
    "quoteNumber": "QXT-2026-1089",
    "propertyName": "Willow East",
    "clientName": "Cortland Management",
    "address": "Farm-to-Market Road 969",
    "city": "Hornsby Bend",
    "state": "TX",
    "unitsCount": 236,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:30.225327Z",
    "totalHardwareAmount": 193461,
    "totalInstallAmount": 38940,
    "monthlyServiceFee": 6608,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 236 was confirmed from user input and the 'Unit Area Tabulation' on sheet A0.2C. Hardware schedule explicitly includes 'LS-20: KEY CARD ACCESS - COORDINATE WITH OWNER', indicating a strong upsell opportunity for a full smart access solution.",
    "bomItems": [
      {
        "id": "bom-O1y4pR-01",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 236,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "1 per unit entry door."
      },
      {
        "id": "bom-O1y4pR-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 236,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-O1y4pR-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 236,
        "installedCount": 0,
        "unitPrice": 137.46,
        "description": "1 per unit, placed near water heater or laundry."
      },
      {
        "id": "bom-O1y4pR-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 588.34,
        "description": "Estimated quantity for amenity and primary building access points."
      },
      {
        "id": "bom-O1y4pR-05",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated quantity for coverage of amenities, entrances, and key common areas."
      },
      {
        "id": "bom-O1y4pR-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 236,
        "installedCount": 0,
        "unitPrice": 195,
        "description": ""
      },
      {
        "id": "bom-O1y4pR-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "oFwYnFLDbxNoJIIhnqu8",
    "quoteNumber": "QXT-2026-1090",
    "propertyName": "Grand Station Marketplace",
    "clientName": "Drake Development",
    "address": "8820 Shawnee Mission Parkway",
    "city": "Merriam",
    "state": "Kansas",
    "unitsCount": 215,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:31.000527Z",
    "totalHardwareAmount": 169229,
    "totalInstallAmount": 35475,
    "monthlyServiceFee": 6020,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input for Total Unit Count (215). Aligned Common Area AP counts with the provided Hamina BOM (Page 3) and User Estimates: 230 Total Wi-Fi 7 APs minus 215 Unit APs leaves 15 Indoor Common APs (matches user estimate of 10-15).",
    "bomItems": [
      {
        "id": "bom-oFwYnF-01",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 215,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "1 per unit."
      },
      {
        "id": "bom-oFwYnF-02",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 215,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "1 per unit."
      },
      {
        "id": "bom-oFwYnF-03",
        "name": "Quext Gateway/Controller",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end unified controller."
      },
      {
        "id": "bom-oFwYnF-04",
        "name": "NVR",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Head-end recording appliance."
      },
      {
        "id": "bom-oFwYnF-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 215,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-oFwYnF-06",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 22,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": ""
      },
      {
        "id": "bom-oFwYnF-07",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 28,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": ""
      },
      {
        "id": "bom-oFwYnF-08",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 28,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "sObjsf8SzvTJaptOXtqd",
    "quoteNumber": "QXT-2026-1091",
    "propertyName": "4002 Park Blvd (PaLi)",
    "clientName": "Real Estate Developer Association",
    "address": "4002 park bl",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 206,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-06-01T18:44:45.382Z",
    "totalHardwareAmount": 126120,
    "totalInstallAmount": 33990,
    "monthlyServiceFee": 5768,
    "assignedSalesLead": "Blake Miller",
    "notes": "CRITICAL CONSTRAINT APPLIED: Property is outside Google Fiber service area. All GFiber branding removed. Standard Wi-Fi 6 hardware and generic high-power PoE switching will be utilized, despite the mandatory JSON schema keys stating 'wifi7' and '2.5G'. Unit count established as 206 based on User Input (North Star metho",
    "bomItems": [
      {
        "id": "bom-sObjsf-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 206,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "does this work??"
      },
      {
        "id": "bom-sObjsf-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 206,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-sObjsf-03",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated for common area entry points (leasing, gym, pool, etc.)."
      },
      {
        "id": "bom-sObjsf-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 206,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      }
    ]
  },
  {
    "id": "abpMHf7aYoXHWCxiUc9y",
    "quoteNumber": "QXT-2026-1092",
    "propertyName": "Mulberry Falcon",
    "clientName": "Related Companies",
    "address": "1435 Mulberry Street",
    "city": "Des Moines",
    "state": "IA",
    "unitsCount": 202,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-16T15:15:53.223327Z",
    "totalHardwareAmount": 9525,
    "totalInstallAmount": 33330,
    "monthlyServiceFee": 5656,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 202 units in Des Moines, IA.",
    "bomItems": [
      {
        "id": "bom-abpMHf-01",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 225,
        "installedCount": 0,
        "unitPrice": 29.0,
        "description": "Programming and Back End Portal Set Up"
      },
      {
        "id": "bom-abpMHf-02",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Training and Onboarding, one-time cost"
      },
      {
        "id": "bom-abpMHf-03",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Project Management Fee"
      }
    ]
  },
  {
    "id": "t0rzCaArrpg5B1EdXR45",
    "quoteNumber": "QXT-2026-1093",
    "propertyName": "Saddle Creek",
    "clientName": "CIP Communities",
    "address": "1006 S Saddle Creek Rd",
    "city": "Omaha",
    "state": "Nebraska",
    "unitsCount": 196,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-13T14:54:08.611743Z",
    "totalHardwareAmount": 158744,
    "totalInstallAmount": 32340,
    "monthlyServiceFee": 5488,
    "assignedSalesLead": "Blake Miller",
    "notes": "Unit count of 196 confirmed via OCR summaries and plan notes. Per-Unit AP Analysis: Largest unit is Type D1 (1312 sq ft). No units exceed 1750 sq ft, so 1 AP per unit is allocated.",
    "bomItems": [
      {
        "id": "bom-t0rzCa-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 196,
        "installedCount": 0,
        "unitPrice": 250.0,
        "description": "1 per residential unit entry"
      },
      {
        "id": "bom-t0rzCa-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 196,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per residential unit"
      },
      {
        "id": "bom-t0rzCa-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 34,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Based on 'Hardwired Doors' count in legend"
      },
      {
        "id": "bom-t0rzCa-04",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main entry QR Intercom"
      },
      {
        "id": "bom-t0rzCa-05",
        "name": "Elevator Control Relay",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Based on 'Elevator Call Buttons' in legend"
      },
      {
        "id": "bom-t0rzCa-06",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Based on 'Vehicular Entries' in legend"
      },
      {
        "id": "bom-t0rzCa-07",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated allowance for Entrances, Garage Ramps, and Amenities (Pool/Bike Room)."
      },
      {
        "id": "bom-t0rzCa-08",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 196,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      }
    ]
  },
  {
    "id": "fAmPeIC7xbVTnUIWykrN",
    "quoteNumber": "QXT-2026-1094",
    "propertyName": "Broadmoor Tower Conversion",
    "clientName": "Block Real Estate Services LLC",
    "address": "5700 Broadmoor Street",
    "city": "Mission",
    "state": "KS",
    "unitsCount": 178,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-23T14:26:28.986Z",
    "totalHardwareAmount": 84439,
    "totalInstallAmount": 29370,
    "monthlyServiceFee": 4984,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "[SCOPE] Architectural takeoff verified for 178 residential units across the Broadmoor Tower Conversion building footprint. [WIRELESS] 1:1 In-Unit Wi-Fi 7 AP allocation (178 units, direct in-unit Fiber ONT termination) + 12 Indoor Common APs and 6 Outdoor APs for full property amenity coverage.",
    "bomItems": [
      {
        "id": "bom-fAmPeI-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 178,
        "installedCount": 0,
        "unitPrice": 255.0,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-fAmPeI-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 178,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-fAmPeI-03",
        "name": "Smart Reader & Intercom Hub",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-fAmPeI-04",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR-plated video intercom station for visitor self-guided check-in and delivery access."
      },
      {
        "id": "bom-fAmPeI-05",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 850.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-fAmPeI-06",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      }
    ]
  },
  {
    "id": "BruoLa1uJiKdUvOBnEGF",
    "quoteNumber": "QXT-2026-1095",
    "propertyName": "Wilmore School",
    "clientName": "Avery Hall",
    "address": "424 West Boulevard",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 175,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-15T19:49:06.783Z",
    "totalHardwareAmount": 225195,
    "totalInstallAmount": 28875,
    "monthlyServiceFee": 4900,
    "assignedSalesLead": "Blake Miller",
    "notes": "The total unit count of 175 was provided by the user and serves as the primary baseline. Allocated 195 In-Unit Wi-Fi 7 APs (rather than 175) to account for the 17 multi-level Townhomes and significantly large units (e.g., Unit 4A at 1967 sf) which will require dual coverage.",
    "bomItems": [
      {
        "id": "bom-BruoLa-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 175,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-BruoLa-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 175,
        "installedCount": 0,
        "unitPrice": 177.27,
        "description": "1 smart thermostat per unit with integrated IoT hub. Coordinates wireless door locks and sensors."
      },
      {
        "id": "bom-BruoLa-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 35,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for exterior perimeter, pool gates, and main amenity doors."
      },
      {
        "id": "bom-BruoLa-04",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "ButterflyMX Visitor Entry System at Main Entrance."
      },
      {
        "id": "bom-BruoLa-05",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 40,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Exact count derived from Camera Schedule on sheet T0.02 (mix of quad-sensor, 180-degree, and dome cameras)."
      },
      {
        "id": "bom-BruoLa-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 175,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      },
      {
        "id": "bom-BruoLa-07",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 175,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-BruoLa-08",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 175,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": "Wired 24V HVAC condensate overflow sensor and automatic shutoff switch to prevent water damage."
      },
      {
        "id": "bom-BruoLa-09",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 40,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      }
    ]
  },
  {
    "id": "zQjHZMQZTGgqzMc1Ed71",
    "quoteNumber": "QXT-2026-1096",
    "propertyName": "Central at Wake Robin",
    "clientName": "Greystar Real Estate Partners",
    "address": "440 Southwest Wake Robin Avenue",
    "city": "Corvallis",
    "state": "OR",
    "unitsCount": 168,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-21T16:42:24.916783Z",
    "totalHardwareAmount": 5720,
    "totalInstallAmount": 27720,
    "monthlyServiceFee": 4704,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 168 units in Corvallis, OR.",
    "bomItems": [
      {
        "id": "bom-zQjHZM-01",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Training and Onboarding, one-time cost"
      },
      {
        "id": "bom-zQjHZM-02",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Project Management Fee"
      },
      {
        "id": "bom-zQjHZM-03",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 172,
        "installedCount": 0,
        "unitPrice": 10.0,
        "description": "Programming and Back End Portal Set Up"
      }
    ]
  },
  {
    "id": "49TTISdjGoipblSjd0q3",
    "quoteNumber": "QXT-2026-1097",
    "propertyName": "Lux 72",
    "clientName": "Asset Living",
    "address": "7200 Cedardale Road",
    "city": "Papillion",
    "state": "NE",
    "unitsCount": 160,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-29T15:40:23.845599Z",
    "totalHardwareAmount": 87500,
    "totalInstallAmount": 26400,
    "monthlyServiceFee": 4480,
    "assignedSalesLead": "Sydney Sanberg",
    "notes": "Total unit count of 160 was provided by user input. Calculated 166 in-unit Wi-Fi 7 APs: 160 for baseline coverage plus an additional AP for each of the 6 units identified as 3+ Bedrooms on the parking requirements table (Sheet C4.0).",
    "bomItems": [
      {
        "id": "bom-49TTIS-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-49TTIS-02",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Slim profile IP reader controller for narrow door frames, glass mullions, and gates."
      },
      {
        "id": "bom-49TTIS-03",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 275.0,
        "description": "does this work??"
      },
      {
        "id": "bom-49TTIS-04",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-49TTIS-05",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      },
      {
        "id": "bom-49TTIS-06",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Dedicated project management: Vendor liaison, remote install support, trade coordination, and milestone tracking."
      }
    ]
  },
  {
    "id": "btPpPI7tdsIecev22VBn",
    "quoteNumber": "QXT-2026-1098",
    "propertyName": "(GFIBER) Lux 72",
    "clientName": "Asset Living",
    "address": "7200 Cedardale Road",
    "city": "Papillion",
    "state": "NE",
    "unitsCount": 160,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-06-29T21:49:14.342799Z",
    "totalHardwareAmount": 119235,
    "totalInstallAmount": 26400,
    "monthlyServiceFee": 4480,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Unit count was provided by user input: 160 units. Unit Wi-Fi 7 APs calculated based on 1 AP/unit baseline, plus 1 additional AP for each of the 6 (3+ bedroom) units, then an additional 25% increase as per refinement instructions, totaling 208 APs.",
    "bomItems": [
      {
        "id": "bom-btPpPI-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Head-end controller."
      },
      {
        "id": "bom-btPpPI-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 275.0,
        "description": "Calculated on a per-bed basis as a refinement from the initial per-unit calculation. This represents an upsell opportunity."
      },
      {
        "id": "bom-btPpPI-03",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-btPpPI-04",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 1100.0,
        "description": ""
      },
      {
        "id": "bom-btPpPI-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 160,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-btPpPI-06",
        "name": "GFiber Outdoor Wi-Fi 7 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      },
      {
        "id": "bom-btPpPI-07",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Optional parking garage Wi-Fi 6 APs"
      },
      {
        "id": "bom-btPpPI-08",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-btPpPI-09",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      }
    ]
  },
  {
    "id": "YoBr6jbxAXaubLoJcxyS",
    "quoteNumber": "QXT-2026-1099",
    "propertyName": "(Quext) Lusso - Lawrence, KS",
    "clientName": "Metonic Real Estate Solutions",
    "address": "105 Eisenhower Drive",
    "city": "Lawrence",
    "state": "KS",
    "unitsCount": 132,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-13T08:40:38.164Z",
    "totalHardwareAmount": 300028,
    "totalInstallAmount": 21780,
    "monthlyServiceFee": 3696,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 132 units in Lawrence, KS.",
    "bomItems": [
      {
        "id": "bom-YoBr6j-01",
        "name": "Yale YRD-ZW (Pro2 Series)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 220.0,
        "description": "Programming and Back End Portal Set Up"
      },
      {
        "id": "bom-YoBr6j-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 140.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-YoBr6j-03",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": ""
      },
      {
        "id": "bom-YoBr6j-04",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Unit",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 40.0,
        "description": "Includes programming of Locks and Thermostats"
      },
      {
        "id": "bom-YoBr6j-05",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Zwave compatibility"
      },
      {
        "id": "bom-YoBr6j-06",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Training and Onboarding + Ongoing Account Management"
      },
      {
        "id": "bom-YoBr6j-07",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-YoBr6j-08",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-YoBr6j-09",
        "name": "Elauwit Managed WiFi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 183003.0,
        "description": ""
      },
      {
        "id": "bom-YoBr6j-10",
        "name": "Quext Smart Building Support",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      },
      {
        "id": "bom-YoBr6j-11",
        "name": "Elauwit Managed WiFi (with Quext IoT)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 195,
        "description": ""
      }
    ]
  },
  {
    "id": "BvVVzGKKDerEngmweKh9",
    "quoteNumber": "QXT-2026-1100",
    "propertyName": "Lusso Apartments",
    "clientName": "Metonic Real Estate Solutions",
    "address": "105 Eisenhower Drive, Lawrence, KS, 66049",
    "city": "Lawrence",
    "state": "KS",
    "unitsCount": 131,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "Estimate Sent",
    "stageUpdatedAt": "2026-10-16T16:29:26.502Z",
    "totalHardwareAmount": 81266,
    "totalInstallAmount": 21615,
    "monthlyServiceFee": 3668,
    "assignedSalesLead": "Jeff Morrison",
    "notes": "Synced from myquext.com (Estimate Sent) — Estimate Sent scope for 131 units in Lawrence, KS.",
    "bomItems": [
      {
        "id": "bom-BvVVzG-01",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 112.0,
        "description": "1 smart thermostat per unit with integrated IoT hub. Coordinates wireless door locks and sensors."
      },
      {
        "id": "bom-BvVVzG-02",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 2470.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-BvVVzG-03",
        "name": "Yale YRD-ZW (Pro2 Series)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 201.25,
        "description": "Z-Wave Plus enabled smart deadbolt for residential unit entry doors. Connects via smart thermostat hub."
      },
      {
        "id": "bom-BvVVzG-04",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 40.0,
        "description": "Device programming, cloud portal configuration, and backend account initialization."
      },
      {
        "id": "bom-BvVVzG-05",
        "name": "Quext Smart Building SaaS",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "20% channel partner discount applied "
      },
      {
        "id": "bom-BvVVzG-06",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      },
      {
        "id": "bom-BvVVzG-07",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Dedicated project management: Vendor liaison, remote install support, trade coordination, and milestone tracking."
      }
    ]
  },
  {
    "id": "HJSXkMSoBvnms56wQDfN",
    "quoteNumber": "QXT-2026-1101",
    "propertyName": "(Geokey) Lusso",
    "clientName": "Camden Property Trust",
    "address": "105 Eisenhower Drive",
    "city": "Lawrence",
    "state": "KS",
    "unitsCount": 131,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-14T18:04:13.549Z",
    "totalHardwareAmount": 78600,
    "totalInstallAmount": 21615,
    "monthlyServiceFee": 3668,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 131 units in Lawrence, KS.",
    "bomItems": [
      {
        "id": "bom-HJSXkM-01",
        "name": "Yale YRD-BLE (Pro2 Series)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 220.0,
        "description": "Bluetooth Only"
      },
      {
        "id": "bom-HJSXkM-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 140.0,
        "description": "1 Wi-Fi smart commercial thermostat per unit, pre-configured for property Wi-Fi networks."
      },
      {
        "id": "bom-HJSXkM-03",
        "name": "PDK Keypad Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Keypad and contactless credential reader (OSDP / 13.56MHz) for perimeter gates and amenity doors."
      },
      {
        "id": "bom-HJSXkM-04",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Unit",
        "quantity": 131,
        "installedCount": 0,
        "unitPrice": 40.0,
        "description": "Device programming, cloud portal configuration, and backend account initialization."
      },
      {
        "id": "bom-HJSXkM-05",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      },
      {
        "id": "bom-HJSXkM-06",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Dedicated project management: Vendor liaison, remote install support, trade coordination, and milestone tracking."
      },
      {
        "id": "bom-HJSXkM-07",
        "name": "Cambium Networks (Meshed WiFi)",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 44,
        "installedCount": 0,
        "unitPrice": 300.0,
        "description": "Enterprise outdoor meshed Wi-Fi access point for non-managed deployments across courtyards and outbuildings."
      },
      {
        "id": "bom-HJSXkM-08",
        "name": "PDK Keypad Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "ProdataKey’s Red™ Readers are in a class of their own,\nwith OSDP secure connectivity, high (13.56MHz) and\nlow-frequency (125 kHz) communication, and\nmobile-ready options. Red Readers are now one of the\nmost secure and versatile readers on t"
      },
      {
        "id": "bom-HJSXkM-09",
        "name": "Eagle Bundled - Not Product Specific",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Cameras",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Bundled commercial video surveillance package including hardware, storage bridge, and cloud licensing."
      }
    ]
  },
  {
    "id": "8pTMzVJsaHIma0bdS9sY",
    "quoteNumber": "QXT-2026-1102",
    "propertyName": "Benson Lights",
    "clientName": "MAA Communities",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 99,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-25T17:20:13.657071Z",
    "totalHardwareAmount": 7610,
    "totalInstallAmount": 16335,
    "monthlyServiceFee": 2772,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 99 units in Austin, TX.",
    "bomItems": [
      {
        "id": "bom-8pTMzV-01",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 137,
        "installedCount": 0,
        "unitPrice": 30.0,
        "description": "Programming and Back End Portal Set Up"
      },
      {
        "id": "bom-8pTMzV-02",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Project Management Fee"
      },
      {
        "id": "bom-8pTMzV-03",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1000.0,
        "description": "Training and Onboarding, one-time cost"
      }
    ]
  },
  {
    "id": "PZ5oEQDdJd46msC5TY6r",
    "quoteNumber": "QXT-2026-1103",
    "propertyName": "Gateway Ventures Roswell",
    "clientName": "Hill Street Roswell Investment LLC",
    "address": "25 Hill Street",
    "city": "Roswell",
    "state": "Georgia",
    "unitsCount": 96,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:15:00.057Z",
    "totalHardwareAmount": 84041,
    "totalInstallAmount": 15840,
    "monthlyServiceFee": 2688,
    "assignedSalesLead": "Blake Miller",
    "notes": "Source of Truth: User input 'Total Units: 96' was used as the North Star. Manual count of unit plans aligns with this approx. Exclusion: Corridor/Hallway APs shown on electrical plans (e.g., C002, C100) were EXCLUDED per instructions. Coverage is assumed via In-Unit APs.",
    "bomItems": [
      {
        "id": "bom-PZ5oEQ-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 96,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "1 per unit. Dorma-Kaba WiFi Evo LZ specified in plans."
      },
      {
        "id": "bom-PZ5oEQ-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 96,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit standard allocation."
      },
      {
        "id": "bom-PZ5oEQ-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimate covering all building entries, amenity spaces, stairwells, and elevators across East, West, Amenity, and Garage buildings."
      },
      {
        "id": "bom-PZ5oEQ-04",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimate covering Garage levels, Lobbies, Corridors, Amenity spaces, and Exterior perimeters as shown on security sheets."
      },
      {
        "id": "bom-PZ5oEQ-05",
        "name": "Smart Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main entrances for East, West, Leasing, and Loading/Move-in areas."
      },
      {
        "id": "bom-PZ5oEQ-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 96,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity spaces."
      }
    ]
  },
  {
    "id": "DeLcylykLv3w4ach8PYN",
    "quoteNumber": "QXT-2026-1104",
    "propertyName": "The Mill",
    "clientName": "Greystar Real Estate Partners",
    "address": "6152 Military Avenue",
    "city": "Omaha",
    "state": "NE",
    "unitsCount": 96,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-25T16:56:05.494719Z",
    "totalHardwareAmount": 5074,
    "totalInstallAmount": 15840,
    "monthlyServiceFee": 2688,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 96 units in Omaha, NE.",
    "bomItems": [
      {
        "id": "bom-DeLcyl-01",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 106,
        "installedCount": 0,
        "unitPrice": 29.0,
        "description": "Programming and Back End Portal Set Up"
      },
      {
        "id": "bom-DeLcyl-02",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1000.0,
        "description": "Project Management Fee"
      },
      {
        "id": "bom-DeLcyl-03",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1000.0,
        "description": "Training and Onboarding, one-time cost"
      }
    ]
  },
  {
    "id": "phC4lXAVW2sJJVfQcdUY",
    "quoteNumber": "QXT-2026-1105",
    "propertyName": "Corporate Circle Apartments",
    "clientName": "Foutch",
    "address": "7306 NW Tiffany Springs Pkwy",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 92,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:16:16.680Z",
    "totalHardwareAmount": 71806,
    "totalInstallAmount": 15180,
    "monthlyServiceFee": 2576,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 92 was derived from the 'RESIDENTIAL UNITS' table on sheet 00.00 (Cover). This is an adaptive reuse of an office building. A thorough site survey is critical to verify all wiring pathways, door/frame conditions, and existing infrastructure prior to finalizing the proposal.",
    "bomItems": [
      {
        "id": "bom-phC4lX-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 92,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": ""
      },
      {
        "id": "bom-phC4lX-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 92,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": ""
      },
      {
        "id": "bom-phC4lX-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for main entrances, secondary entrances, and critical back-of-house rooms. Locations not specified on plans."
      },
      {
        "id": "bom-phC4lX-04",
        "name": "Eagle Eye Security Cameras - DD11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "Estimated for exterior perimeter, entrances, and interior lobby. Locations not specified on plans."
      },
      {
        "id": "bom-phC4lX-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 92,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-phC4lX-06",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "oaTpjjsjZbuUhk5wAyo1",
    "quoteNumber": "QXT-2026-1106",
    "propertyName": "303 Broadway",
    "clientName": "Jim Yankee",
    "address": "303 Broadway",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 89,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-19T18:34:31.143279Z",
    "totalHardwareAmount": 208210,
    "totalInstallAmount": 14685,
    "monthlyServiceFee": 2492,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 89 was determined from user input and confirmed via the 'UNIT MIX' schedule on sheet A0.00. Common area Wi-Fi AP, Access Control, and Camera quantities are estimates based on floor plan layouts. A site walk is required for final counts and placement.",
    "bomItems": [
      {
        "id": "bom-oaTpjj-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 89,
        "installedCount": 0,
        "unitPrice": 255.0,
        "description": ""
      },
      {
        "id": "bom-oaTpjj-02",
        "name": "Smart Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated quantity for main entrances, garages, and key amenity spaces (Pool, Fitness, Clubhouse, Rooftop, Bike Storage, Dog Spa)."
      },
      {
        "id": "bom-oaTpjj-03",
        "name": "Access Control Hub/Panel",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Estimated based on one hub per four readers for system architecture."
      },
      {
        "id": "bom-oaTpjj-04",
        "name": "Security Camera (Indoor/Outdoor)",
        "model": "CAM-XV2-2T",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 41,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated quantity for coverage of entrances, lobbies, elevator cabs & lobbies, parking garages, and amenity areas."
      },
      {
        "id": "bom-oaTpjj-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 89,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-oaTpjj-06",
        "name": "Eagle Eye Security Cameras - DF",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 41,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Dependency for 7 Day Camera Recording"
      },
      {
        "id": "bom-oaTpjj-07",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 41,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Dependency for 7 Day Camera Recording"
      },
      {
        "id": "bom-oaTpjj-08",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 89,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-09",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 450.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-10",
        "name": "RC with Cellular Connection",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-11",
        "name": "RC w/ 2N Wire Conversion",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1700.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-12",
        "name": "Schlage Elevator Controller",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-13",
        "name": "Schlage XE360 Mortise",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 550.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-14",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1300.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-15",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-16",
        "name": "Schlage NDEB Tubular",
        "model": "SCH-NDEB",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-oaTpjj-17",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      }
    ]
  },
  {
    "id": "qjJY2a46fgm2HRUVSQB8",
    "quoteNumber": "QXT-2026-1107",
    "propertyName": "Embark 330 w 4th St - Kansas City, MO",
    "clientName": "Beacon Partners",
    "address": "303 Broadway",
    "city": "Kansas City",
    "state": "MO",
    "unitsCount": 89,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-17T18:57:18.585231Z",
    "totalHardwareAmount": 17355,
    "totalInstallAmount": 14685,
    "monthlyServiceFee": 2492,
    "assignedSalesLead": "Mark Zanders",
    "notes": "Removed Wi-Fi coverage for residential corridors per user request, reducing indoor common area AP count from 35 to 12 and switch count from 3 to 2. Total Unit Count (89) was established using both the user input and the 'UNIT MIX' table found on the architectural Cover Sheet.",
    "bomItems": [
      {
        "id": "bom-qjJY2a-01",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 89,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      }
    ]
  },
  {
    "id": "lhXqljEInUBL3dq8zExn",
    "quoteNumber": "QXT-2026-1108",
    "propertyName": "Ironwood Apartments",
    "clientName": "Related Companies",
    "address": "200 S. Broadway Street",
    "city": "Greensburg",
    "state": "IN",
    "unitsCount": 88,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "Survey/Design Requested",
    "stageUpdatedAt": "2026-09-02T22:50:28.200479Z",
    "totalHardwareAmount": 50285,
    "totalInstallAmount": 14520,
    "monthlyServiceFee": 2464,
    "assignedSalesLead": "Jeff Morrison",
    "notes": "Synced from myquext.com (Estimate Sent) — Survey/Design Requested scope for 88 units in Greensburg, IN.",
    "bomItems": [
      {
        "id": "bom-lhXqlj-01",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 88,
        "installedCount": 0,
        "unitPrice": 125.0,
        "description": "Our patented smart thermostat with built-in hub. Connects locks and sensors, detects occupancy, and saves energy, all without needing resident Wi-Fi."
      },
      {
        "id": "bom-lhXqlj-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 88,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-lhXqlj-03",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR Plated Intercom "
      },
      {
        "id": "bom-lhXqlj-04",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1517.0,
        "description": "Our patented smart thermostat with built-in hub. Connects locks and sensors, detects occupancy, and saves energy, all without needing resident Wi-Fi."
      },
      {
        "id": "bom-lhXqlj-05",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-lhXqlj-06",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": ""
      },
      {
        "id": "bom-lhXqlj-07",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Training and Onboarding, one-time cost"
      }
    ]
  },
  {
    "id": "jVm2HlOdKc4mo5iNtL4n",
    "quoteNumber": "QXT-2026-1109",
    "propertyName": "Westline Building 3 - Omaha, NE",
    "clientName": "Woodsonia Real Estate",
    "address": "5515 N HWS Cleveland Blvd",
    "city": "Omaha",
    "state": "NE",
    "unitsCount": 86,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-06-12T03:03:33.504367Z",
    "totalHardwareAmount": 46140,
    "totalInstallAmount": 14190,
    "monthlyServiceFee": 2408,
    "assignedSalesLead": "Kelli Smith",
    "notes": "Synced from myquext.com (Estimate Sent) — existing scope for 86 units in Omaha, NE.",
    "bomItems": [
      {
        "id": "bom-jVm2Hl-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 86,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-jVm2Hl-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 86,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-jVm2Hl-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-jVm2Hl-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 86,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-jVm2Hl-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "0kEYDx7SPrqn26PxBbgp",
    "quoteNumber": "QXT-2026-1110",
    "propertyName": "Prestige Heights",
    "clientName": "MAA Communities",
    "address": "Staphorst Lane / Spakenburg Road",
    "city": "Holmen",
    "state": "WI",
    "unitsCount": 38,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-29T15:40:22.609887Z",
    "totalHardwareAmount": 3149,
    "totalInstallAmount": 6270,
    "monthlyServiceFee": 1064,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Estimate Sent) — New Construction scope for 38 units in Holmen, WI.",
    "bomItems": [
      {
        "id": "bom-0kEYDx-01",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR Plated Intercom "
      },
      {
        "id": "bom-0kEYDx-02",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 45,
        "installedCount": 0,
        "unitPrice": 10.0,
        "description": "Programming and Back End Portal Set Up"
      },
      {
        "id": "bom-0kEYDx-03",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      },
      {
        "id": "bom-0kEYDx-04",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1000.0,
        "description": "Dedicated project management: Vendor liaison, remote install support, trade coordination, and milestone tracking."
      }
    ]
  },
  {
    "id": "3ZmphKirawZK1YJBlObK",
    "quoteNumber": "QXT-2026-1111",
    "propertyName": "Square at 48 - Lincoln, NE",
    "clientName": "Schafer Richardson",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 180,
    "stage": "Proposal Sent",
    "myquextStage": "Estimate Sent",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-07-06T20:06:36.812Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Synced from myquext.com (Estimate Sent) — existing scope for 180 units in Austin, TX.",
    "bomItems": [
      {
        "id": "bom-3ZmphK-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-3ZmphK-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-3ZmphK-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-3ZmphK-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-3ZmphK-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "H8HqxPauEpIeBt9xcMhK",
    "quoteNumber": "QXT-2026-1112",
    "propertyName": "Anaheim Ducks",
    "clientName": "OC Vibe",
    "address": "2695 E Katella Ave",
    "city": "Anaheim",
    "state": "CA",
    "unitsCount": 2000,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-05-19T15:58:42.235Z",
    "totalHardwareAmount": 1398880,
    "totalInstallAmount": 330000,
    "monthlyServiceFee": 56000,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "North Star: Unit count of 2000 established via User Input. Wi-Fi 7 Unit AP count includes a 25% density increase as per Step 5 requirements.",
    "bomItems": [
      {
        "id": "bom-H8HqxP-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end controllers for 2000-unit campus."
      },
      {
        "id": "bom-H8HqxP-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Storage for up to 16 common area cameras."
      },
      {
        "id": "bom-H8HqxP-03",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 2000,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Anaheim compliance: Substituted for BE467 to meet Single Motion Egress requirements."
      },
      {
        "id": "bom-H8HqxP-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 2000,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Standard per-unit allocation."
      },
      {
        "id": "bom-H8HqxP-05",
        "name": "Leak Sensor",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 2000,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Baseline in-unit technology for risk mitigation."
      },
      {
        "id": "bom-H8HqxP-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimate for primary entries, amenity doors, and garage gates."
      },
      {
        "id": "bom-H8HqxP-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 16,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimate based on entries and amenity points."
      },
      {
        "id": "bom-H8HqxP-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 2510,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (2500 in-unit APs, 10 indoor common, 0 outdoor)."
      }
    ]
  },
  {
    "id": "WT6URNbxO3IbjQSVBwr8",
    "quoteNumber": "QXT-2026-1113",
    "propertyName": "Cato Farms",
    "clientName": "Childress Klein",
    "address": "11315 Tom Short Rd",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 893,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-04-15T04:10:48.026Z",
    "totalHardwareAmount": 830142,
    "totalInstallAmount": 147345,
    "monthlyServiceFee": 25004,
    "assignedSalesLead": "David Scott",
    "notes": "Total Unit Count (893) established strictly via User Input (North Star constraint). Notes imply a partial count (314 + 358 = 672) for specific phases, but 893 overrides. In-Unit Wi-Fi 7 APs connect directly to the in-unit Fiber ONT. Therefore, zero switch ports were calculated for residential units.",
    "bomItems": [
      {
        "id": "bom-WT6URN-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 893,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "1 standard unit entry lock per unit."
      },
      {
        "id": "bom-WT6URN-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 893,
        "installedCount": 0,
        "unitPrice": 177.27,
        "description": "1 per unit."
      },
      {
        "id": "bom-WT6URN-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 18,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated baseline for clubhouse and pool gates."
      },
      {
        "id": "bom-WT6URN-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 35,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated baseline for main amenities and leasing areas."
      },
      {
        "id": "bom-WT6URN-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 893,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-WT6URN-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 893,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-WT6URN-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 893,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-WT6URN-08",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-WT6URN-09",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 35,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "pioY4p5SBxWhvpvZ0evd",
    "quoteNumber": "QXT-2026-1114",
    "propertyName": "Lincoln Tech",
    "clientName": "Southern Land Company",
    "address": "Nashville Community Blvd",
    "city": "Nashville",
    "state": "Tennessee",
    "unitsCount": 603,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-13T19:34:43.893Z",
    "totalHardwareAmount": 595136,
    "totalInstallAmount": 99495,
    "monthlyServiceFee": 16884,
    "assignedSalesLead": "Danielle Finley",
    "notes": "Phase 1 & 2 Unit Count updated to 535 based on recent meeting notes. Master plan includes up to 800-1100 apartments, 150 SFH, 60k SF retail, 140k SF office, and a potential hotel. Currently scoping Phase 1 & 2 (535 units) only.",
    "bomItems": [
      {
        "id": "bom-pioY4p-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 603,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": ""
      },
      {
        "id": "bom-pioY4p-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 603,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per Residential Unit."
      },
      {
        "id": "bom-pioY4p-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated baseline for main entrances, leasing centers, pools, fitness centers, and sky lounges."
      },
      {
        "id": "bom-pioY4p-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated baseline for amenity spaces, lobbies, and critical infrastructure monitoring."
      },
      {
        "id": "bom-pioY4p-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 603,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-pioY4p-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 603,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-pioY4p-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 603,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-pioY4p-08",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-pioY4p-09",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "ElZAdrOnSzo2CufmNszP",
    "quoteNumber": "QXT-2026-1115",
    "propertyName": "Millstone Village Townhomes",
    "clientName": "Cambridge Properties",
    "address": "N. Main St. & N. Loop Rd",
    "city": "Kannapolis",
    "state": "North Carolina",
    "unitsCount": 437,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-05-06T15:11:32.454Z",
    "totalHardwareAmount": 250679,
    "totalInstallAmount": 72105,
    "monthlyServiceFee": 12236,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 437 was provided directly by the user. Assumed THREE Wi-Fi 7 APs per unit (1,311 total) based on user confirmation of large townhome floor plans to ensure full coverage across all floors for GFiber multi-gig speeds.",
    "bomItems": [
      {
        "id": "bom-ElZAdr-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 437,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-ElZAdr-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 437,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "does this work??"
      },
      {
        "id": "bom-ElZAdr-03",
        "name": "Access Control Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "For access to Pickleball Court and Dog Park gates."
      },
      {
        "id": "bom-ElZAdr-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 437,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ]
  },
  {
    "id": "8GqesUM87F8QTVrSQhen",
    "quoteNumber": "QXT-2026-1116",
    "propertyName": "Bladerunner",
    "clientName": "Space Craft",
    "address": "2321 North Davidson",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 375,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:26:41.064Z",
    "totalHardwareAmount": 229858,
    "totalInstallAmount": 61875,
    "monthlyServiceFee": 10500,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input 'Total Units: 375' as the North Star for unit counts. Used User Input 'In-Unit (Count) 375' for AP allocation, overriding square footage logic as per strict RFP compliance.",
    "bomItems": [
      {
        "id": "bom-8GqesU-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 375,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "1 per unit (Residential entry)."
      },
      {
        "id": "bom-8GqesU-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 375,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-8GqesU-03",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 40,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated allowance for Exterior, Garage, Lobbies, and Residential Stairwell/Elevator coverage."
      },
      {
        "id": "bom-8GqesU-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for Main Entries, Garage Barriers, Amenity Doors, and IDF/Stairwell secure points."
      },
      {
        "id": "bom-8GqesU-05",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main Entry, Garage Entry, and Delivery Access points."
      },
      {
        "id": "bom-8GqesU-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 45,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity coverage."
      },
      {
        "id": "bom-8GqesU-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 40,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Dependency for Eagle Eye Security Cameras"
      }
    ]
  },
  {
    "id": "wvDFUMBCBCgkd5VKibML",
    "quoteNumber": "QXT-2026-1117",
    "propertyName": "Havana",
    "clientName": "Camden Property Trust",
    "address": "Centennial Community Blvd",
    "city": "Centennial",
    "state": "Colorado",
    "unitsCount": 368,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-03-18T21:36:39.012Z",
    "totalHardwareAmount": 230300,
    "totalInstallAmount": 60720,
    "monthlyServiceFee": 10304,
    "assignedSalesLead": "Taylor Williams",
    "notes": "CRITICAL: Property is outside the Google Fiber service area. BOM reflects generic Wi-Fi 6 hardware and standard PoE+ switching per user constraint. No GFiber or Wi-Fi 7 products are included. Total unit count of 368 was provided by the user.",
    "bomItems": [
      {
        "id": "bom-wvDFUM-01",
        "name": "Dormakaba Saffire EVO LZ-D",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 368,
        "installedCount": 0,
        "unitPrice": 325.0,
        "description": "Per user specification. One per unit entrance door. Includes Labor."
      },
      {
        "id": "bom-wvDFUM-02",
        "name": "PDK Mullion Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 37,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Estimated for common area doors across 16 buildings and 1 clubhouse. Includes Labor. Includes Head End Equipment (RCNE + R4's)."
      },
      {
        "id": "bom-wvDFUM-03",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 368,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Per user specification. One per unit. Includes Labor."
      }
    ]
  },
  {
    "id": "va4yK4CFvmrfyfwdBhna",
    "quoteNumber": "QXT-2026-1118",
    "propertyName": "Havana",
    "clientName": "The Garrett Companies",
    "address": "10157 Easter Ave",
    "city": "Centennial",
    "state": "Colorado",
    "unitsCount": 368,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-04-06T03:35:25.464Z",
    "totalHardwareAmount": 28340,
    "totalInstallAmount": 60720,
    "monthlyServiceFee": 10304,
    "assignedSalesLead": "Taylor Williams",
    "notes": "CRITICAL CONSTRAINT APPLIED: Property located in ZIP 80014 (outside service area). All 'Quext powered by Google Fiber' branding has been removed. All hardware has been substituted with generic standard smart community equipment. HARDWARE DOWNGRADE: While the JSON schema keys strictly require the nomenclature 'wifi7Unit",
    "bomItems": [
      {
        "id": "bom-va4yK4-01",
        "name": "PDK Mullion Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Estimated for Clubhouse amenities, fitness, pool gates, and mail lounge."
      },
      {
        "id": "bom-va4yK4-02",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Project Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 5840.0,
        "description": ""
      }
    ]
  },
  {
    "id": "NafCAGrUWXn46qO20Jt8",
    "quoteNumber": "QXT-2026-1119",
    "propertyName": "Brookside Village",
    "clientName": "Davis Craig",
    "address": "3625 Brookside Parkway",
    "city": "Alpharetta",
    "state": "Georgia",
    "unitsCount": 335,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-05-09T05:10:40.730Z",
    "totalHardwareAmount": 364604,
    "totalInstallAmount": 55275,
    "monthlyServiceFee": 9380,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 335 was provided by the user and is considered the source of truth for all per-unit calculations. Assumed one Wi-Fi 7 AP per unit, as all units are 2-bedroom or smaller and assumed to be under 2,000 sq ft.",
    "bomItems": [
      {
        "id": "bom-NafCAG-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 335,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "does this work??"
      },
      {
        "id": "bom-NafCAG-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 335,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": "One thermostat per residential unit."
      },
      {
        "id": "bom-NafCAG-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 335,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "One leak detector per unit, typically placed near water heater or laundry."
      },
      {
        "id": "bom-NafCAG-04",
        "name": "Access Control Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 28,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimate for main entrances, amenities (pool, dog park), and garage pedestrian doors. Final count requires floor plan review."
      },
      {
        "id": "bom-NafCAG-05",
        "name": "Eagle Eye Security Cameras - DF",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 62,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimate for interior (lobbies, elevators, garage) and exterior (entrances, pool, perimeter) coverage. Final placement requires a detailed review."
      },
      {
        "id": "bom-NafCAG-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 335,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity space coverage."
      },
      {
        "id": "bom-NafCAG-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 62,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Dependency for Eagle Eye Security Cameras - DF"
      }
    ]
  },
  {
    "id": "oC7C3y65nkBRvqFO28xt",
    "quoteNumber": "QXT-2026-1120",
    "propertyName": "200 N College",
    "clientName": "Revival Partners",
    "address": "200 N College Street",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 290,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-05-26T19:19:40.584Z",
    "totalHardwareAmount": 295314,
    "totalInstallAmount": 47850,
    "monthlyServiceFee": 8120,
    "assignedSalesLead": "Danielle Finley",
    "notes": "The total unit count of 290 was used as provided by the user. This conflicts with a manual count of 196 from the unit mix schedule on sheet G7.01. This discrepancy requires verification. Smart locks are calculated on a per-unit basis (290). If a per-bedroom count is required for two-bedroom units, the quantity will inc",
    "bomItems": [
      {
        "id": "bom-oC7C3y-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 290,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": ""
      },
      {
        "id": "bom-oC7C3y-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 290,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "Based on one thermostat per unit."
      },
      {
        "id": "bom-oC7C3y-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 35,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": ""
      },
      {
        "id": "bom-oC7C3y-04",
        "name": "Eagle Eye Security Cameras - DF",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 39,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated quantity as no camera locations were specified. A security walk-through is required."
      },
      {
        "id": "bom-oC7C3y-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 290,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-oC7C3y-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 290,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-oC7C3y-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 39,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "CHCPyAgr2OAuHHlZpvEj",
    "quoteNumber": "QXT-2026-1121",
    "propertyName": "The Bend",
    "clientName": "JLL",
    "address": "450 James Robertson Pkwy",
    "city": "Nashville",
    "state": "Tennessee",
    "unitsCount": 268,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-04-21T04:23:48.297Z",
    "totalHardwareAmount": 174830,
    "totalInstallAmount": 44220,
    "monthlyServiceFee": 7504,
    "assignedSalesLead": "Danielle Finley",
    "notes": "Updated total units: 272. CRITICAL FLAG: The user previously requested generic Wi-Fi 6 hardware. Due to strict JSON schema requirements, the keys 'wifi7UnitAP' and 'wifi7IndoorCommonAP' are retained but should be fulfilled with standard Wi-Fi 6 hardware.",
    "bomItems": [
      {
        "id": "bom-CHCPyA-01",
        "name": "Quext IoT Gateway/Controller",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Primary head-end controller for Quext ecosystem."
      },
      {
        "id": "bom-CHCPyA-02",
        "name": "Network Video Recorder (NVR)",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "NVR for security camera recording."
      },
      {
        "id": "bom-CHCPyA-03",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 272,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 per residential unit."
      },
      {
        "id": "bom-CHCPyA-04",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 272,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "1 per residential unit (Standard layout assumed)."
      },
      {
        "id": "bom-CHCPyA-05",
        "name": "Security Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated for common areas and entrances. Connects to 2.5G PoE switch."
      },
      {
        "id": "bom-CHCPyA-06",
        "name": "Access Control Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated for amenity doors (Gym, Pool, Leasing). Connects to 2.5G PoE switch."
      },
      {
        "id": "bom-CHCPyA-07",
        "name": "Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated for main visitor entrances. Connects to 2.5G PoE switch."
      },
      {
        "id": "bom-CHCPyA-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 278,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (272 in-unit APs, 6 indoor common, 0 outdoor)."
      }
    ]
  },
  {
    "id": "i5Bb5VMJqPv5jtQY9tqT",
    "quoteNumber": "QXT-2026-1122",
    "propertyName": "Solis Crestwood",
    "clientName": "Terwilliger Pappas",
    "address": "3885 Brestwood Parkway",
    "city": "Duluth",
    "state": "Georgia",
    "unitsCount": 265,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:29:09.511Z",
    "totalHardwareAmount": 226636,
    "totalInstallAmount": 43725,
    "monthlyServiceFee": 7420,
    "assignedSalesLead": "Danielle Finley",
    "notes": "Source of Truth: Page 2 'Building Data' and 'Density Summary' confirm 265 Total Units. Unit Mix: Review of Unit Plans (A3-01 to A3-16) confirms mix of Studio, 1-Bed, and 2-Bed units. No 3-Bedroom units found (Unit C1/C1A are 2-Bed). Allocated 1 AP per unit.",
    "bomItems": [
      {
        "id": "bom-i5Bb5V-01",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 265,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "1 per unit"
      },
      {
        "id": "bom-i5Bb5V-02",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 265,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "1 per unit"
      },
      {
        "id": "bom-i5Bb5V-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 28,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Amenities (Fitness, Yoga, Mail, Package), Building Entries (x3), Pool Gates (x2), Pet Wash, Trash Enclosure, Perimeter Stairs"
      },
      {
        "id": "bom-i5Bb5V-04",
        "name": "Security Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Interior Amenities (Fitness, Lobby, Corridors), Outdoor Pool, Building Perimeters/Stairs, LPR"
      },
      {
        "id": "bom-i5Bb5V-05",
        "name": "Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Main Entry for Bldg 1000, 2000, 3000"
      },
      {
        "id": "bom-i5Bb5V-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 265,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-i5Bb5V-07",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      },
      {
        "id": "bom-i5Bb5V-08",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 30,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Added as a dependency for Eagle Eye Security Cameras."
      }
    ]
  },
  {
    "id": "fKBkEuQ6Po0wl6G5sWgW",
    "quoteNumber": "QXT-2026-1123",
    "propertyName": "Suncap 1401",
    "clientName": "SunCap Property Group",
    "address": "1401 East Blvd.",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 260,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:28:41.417Z",
    "totalHardwareAmount": 184530,
    "totalInstallAmount": 42900,
    "monthlyServiceFee": 7280,
    "assignedSalesLead": "Blake Miller",
    "notes": "North Star Unit Count: Used 'Total Units: 260' from project header despite the detailed breakdown summing to only 200 units. Assumed the missing 60 units are Standard (1 AP) types. Unit AP Calculation: Allocated 2 APs for the 11 known 3-Bedroom units. Allocated 1 AP for the remaining 249 units.",
    "bomItems": [
      {
        "id": "bom-fKBkEu-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "1 per unit entry door."
      },
      {
        "id": "bom-fKBkEu-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": ""
      },
      {
        "id": "bom-fKBkEu-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for main entries, amenity doors, and elevators."
      },
      {
        "id": "bom-fKBkEu-04",
        "name": "Intercom System",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "For main building and garage pedestrian entrances."
      },
      {
        "id": "bom-fKBkEu-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 260,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity coverage"
      },
      {
        "id": "bom-fKBkEu-06",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated camera locations."
      },
      {
        "id": "bom-fKBkEu-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "Y6H4CkFhJESwVHkivjOs",
    "quoteNumber": "QXT-2026-1124",
    "propertyName": "Yeargan Road Apartments",
    "clientName": "Blue Heron Asset Management",
    "address": "Garner Community Blvd",
    "city": "Garner",
    "state": "North Carolina",
    "unitsCount": 256,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:15:18.039Z",
    "totalHardwareAmount": 243226,
    "totalInstallAmount": 42240,
    "monthlyServiceFee": 7168,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 256 derived from the 'UNIT MATRIX' on sheet G103. Four 3-bedroom units are allocated two in-unit Wi-Fi APs each, per standard deployment guidelines.",
    "bomItems": [
      {
        "id": "bom-Y6H4Ck-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "does this work??"
      },
      {
        "id": "bom-Y6H4Ck-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "One per residential unit."
      },
      {
        "id": "bom-Y6H4Ck-03",
        "name": "Common Area Access Control Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 26,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimate for building entries, amenities, pool gates, and key operational doors. Final count requires owner confirmation."
      },
      {
        "id": "bom-Y6H4Ck-04",
        "name": "Common Area Security Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 19,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Assumed locations: amenities, pool, building entries. A formal camera walk is required for final design and count."
      },
      {
        "id": "bom-Y6H4Ck-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-Y6H4Ck-06",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 19,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Dependency for Eagle Eye Security Cameras - DF"
      },
      {
        "id": "bom-Y6H4Ck-07",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      }
    ]
  },
  {
    "id": "PcstWOgNX5a8EnNYnayj",
    "quoteNumber": "QXT-2026-1125",
    "propertyName": "82nd and Metcalf",
    "clientName": "29th Street Capital",
    "address": "8200 Metcalf",
    "city": "Overland Park",
    "state": "KS",
    "unitsCount": 204,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:14:45.655Z",
    "totalHardwareAmount": 130295,
    "totalInstallAmount": 33660,
    "monthlyServiceFee": 5712,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Unit count established via user input: Total 204 units (198 apartments + 6 townhomes). Allocated 1 Wi-Fi 7 AP per unit. FLAG: If the 6 two-story townhomes are >1750 sqft or have 3+ bedrooms, they will require 2 APs each instead of 1.",
    "bomItems": [
      {
        "id": "bom-PcstWO-01",
        "name": "Quext Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 204,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 per unit (including 198 apts + 6 townhomes)."
      },
      {
        "id": "bom-PcstWO-02",
        "name": "Wireless Unit Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 204,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "1 per unit. Apple/Google wallet credentials required per scope."
      },
      {
        "id": "bom-PcstWO-03",
        "name": "Common Area Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated baseline for main entrances. Apple/Google wallet credentials required."
      },
      {
        "id": "bom-PcstWO-04",
        "name": "Gate Controller/Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Dedicated access control for the drive-through gate."
      },
      {
        "id": "bom-PcstWO-05",
        "name": "IP Security Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated baseline for common areas and gate. Integration note: User inquired about Digital Watchdog via Eagle Eye."
      },
      {
        "id": "bom-PcstWO-06",
        "name": "Quext IoT Gateway/Controller",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Required head-end infrastructure for Quext ecosystem."
      },
      {
        "id": "bom-PcstWO-07",
        "name": "Network Video Recorder (NVR)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Required for camera storage. Check compatibility with Eagle Eye/Digital Watchdog architecture."
      },
      {
        "id": "bom-PcstWO-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 206,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (204 in-unit APs, 2 indoor common, 0 outdoor)."
      }
    ]
  },
  {
    "id": "nms3DtAmv7gXjiGXp0st",
    "quoteNumber": "QXT-2026-1126",
    "propertyName": "Peach Tree Road Townhomes",
    "clientName": "BrightSky Residential",
    "address": "1325 Peachtree Road",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 152,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-04-27T17:33:50.451Z",
    "totalHardwareAmount": 139923,
    "totalInstallAmount": 25080,
    "monthlyServiceFee": 4256,
    "assignedSalesLead": "Danielle Finley",
    "notes": "Unit Count: Total unit count of 152 was derived from user-provided notes (13 Duplexes x 2 units/duplex + 42 Triplexes x 3 units/triplex). In-Unit APs: All 152 units (both Duplex and Triplex types) were identified from floor plans as having 3 or more bedrooms, therefore 2 Wi-Fi 7 APs have been allocated per unit.",
    "bomItems": [
      {
        "id": "bom-nms3Dt-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 152,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "does this work??"
      },
      {
        "id": "bom-nms3Dt-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 152,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": "One thermostat per unit."
      },
      {
        "id": "bom-nms3Dt-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 152,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "One leak detector per unit, typically near water heater or laundry."
      },
      {
        "id": "bom-nms3Dt-04",
        "name": "Access Control Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for amenity building main entrance, pool gate, pickleball gate, and a rear/staff door."
      },
      {
        "id": "bom-nms3Dt-05",
        "name": "Security Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated for amenity entrance, parking lot (2), pool area (2), pickleball court, and clubhouse rear."
      },
      {
        "id": "bom-nms3Dt-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 152,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-nms3Dt-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Dependency for Eagle Eye Security Cameras - DF"
      }
    ]
  },
  {
    "id": "XfFsdjLFdhqJLs2aBJ5X",
    "quoteNumber": "QXT-2026-1127",
    "propertyName": "Duluth Commons",
    "clientName": "Brand Properties",
    "address": "1795 Duluth Hwy",
    "city": "Lawrenceville",
    "state": "Georgia",
    "unitsCount": 126,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:15:12.043Z",
    "totalHardwareAmount": 116606,
    "totalInstallAmount": 20790,
    "monthlyServiceFee": 3528,
    "assignedSalesLead": "David Scott",
    "notes": "North Star unit count established via User Input: 126 total units (72 multifamily, 54 townhomes). Residential Unit APs (126) are OFF-SWITCH and connect directly to the in-unit Fiber ONT.",
    "bomItems": [
      {
        "id": "bom-XfFsdj-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 126,
        "installedCount": 0,
        "unitPrice": 225.0,
        "description": "1 per unit for front door entry"
      },
      {
        "id": "bom-XfFsdj-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 126,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit"
      },
      {
        "id": "bom-XfFsdj-03",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated coverage for resort pool, clubhouse, business center, and dog park"
      },
      {
        "id": "bom-XfFsdj-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated for clubhouse, business center, and pool gates"
      },
      {
        "id": "bom-XfFsdj-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 126,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-XfFsdj-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 126,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-XfFsdj-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 126,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-XfFsdj-08",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-XfFsdj-09",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "OpoT76YUlCpEDl2dCEzm",
    "quoteNumber": "QXT-2026-1128",
    "propertyName": "South Boulevard Townhomes",
    "clientName": "Madison Capital Group",
    "address": "Charlotte Community Blvd",
    "city": "Charlotte",
    "state": "North Carolina",
    "unitsCount": 104,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:27:03.890Z",
    "totalHardwareAmount": 75592,
    "totalInstallAmount": 17160,
    "monthlyServiceFee": 2912,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used user-provided unit count of 104 as the absolute truth (OCR indicated 119 total units on the Site Development Data Table). Allocated 1 Outdoor AP for the 'Pool & Amenity Area' identified on the site plan.",
    "bomItems": [
      {
        "id": "bom-OpoT76-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 104,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "1 per unit (Townhome entry)."
      },
      {
        "id": "bom-OpoT76-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 104,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-OpoT76-03",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "1 for Pool/Amenity Area, 1 for Trash Compactor."
      },
      {
        "id": "bom-OpoT76-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": ""
      },
      {
        "id": "bom-OpoT76-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 104,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-OpoT76-06",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "YND6H1VVxtnWdO0KYViV",
    "quoteNumber": "QXT-2026-1129",
    "propertyName": "9140 Hedge Lane",
    "clientName": "29th Street Capital",
    "address": "9140 Hedge Lane",
    "city": "Lenexa",
    "state": "KS",
    "unitsCount": 101,
    "stage": "Prospect",
    "myquextStage": "New Construction",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:15:24.049Z",
    "totalHardwareAmount": 96410,
    "totalInstallAmount": 16665,
    "monthlyServiceFee": 2828,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Total Unit Count established at 101 based on User Input (North Star), despite notes detailing 18 single-family + 84 townhomes which equals 102. Kept 101 for exact calculations. Per explicit instructions, Access Control is not needed. Therefore, no readers, intercoms, or 2.5G PoE switches have been calculated.",
    "bomItems": [
      {
        "id": "bom-YND6H1-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 101,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "1 per unit. Compatible with Apple/Google wallet credentials as requested."
      },
      {
        "id": "bom-YND6H1-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 101,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 per unit."
      },
      {
        "id": "bom-YND6H1-03",
        "name": "Overhead Garage Door Controller",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "All Residential Units",
        "quantity": 101,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "1 per unit for townhome and single-family detached layouts."
      },
      {
        "id": "bom-YND6H1-04",
        "name": "Door Bell Integration",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "All Residential Units",
        "quantity": 101,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "1 per unit to fulfill requested doorbell integration."
      },
      {
        "id": "bom-YND6H1-05",
        "name": "Apple/Google Wallet Credential Setup",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Community-wide setup for mobile wallet credentials."
      },
      {
        "id": "bom-YND6H1-06",
        "name": "Quext IoT Gateway / Controller",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Required head-end infrastructure for unified smart community management."
      },
      {
        "id": "bom-YND6H1-07",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 101,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (101 in-unit APs, 0 indoor common, 0 outdoor)."
      }
    ]
  },
  {
    "id": "cAhfFjRYQErGUsKUHHZ7",
    "quoteNumber": "QXT-2026-1130",
    "propertyName": "Mill Creek",
    "clientName": "Equity Residential",
    "address": "440 Dixon Landing Road",
    "city": "Milpitas",
    "state": "California",
    "unitsCount": 516,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:28:20.531Z",
    "totalHardwareAmount": 390612,
    "totalInstallAmount": 85140,
    "monthlyServiceFee": 14448,
    "assignedSalesLead": "Blake Miller",
    "notes": "Used User Input (516) for Total Unit Count. Excluded Hallway APs; assumes In-Unit APs provide corridor coverage.",
    "bomItems": [
      {
        "id": "bom-cAhfFj-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 516,
        "installedCount": 0,
        "unitPrice": 425.0,
        "description": "1 per unit (Retrofit). 3 for reserve stock."
      },
      {
        "id": "bom-cAhfFj-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 516,
        "installedCount": 0,
        "unitPrice": 100.0,
        "description": "1 per unit. 3 for reserve stock."
      },
      {
        "id": "bom-cAhfFj-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 516,
        "installedCount": 0,
        "unitPrice": 160.0,
        "description": ""
      },
      {
        "id": "bom-cAhfFj-04",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 516,
        "installedCount": 0,
        "unitPrice": 72.0,
        "description": ""
      }
    ]
  },
  {
    "id": "AwD3pVCLINeLegbNfMT4",
    "quoteNumber": "QXT-2026-1131",
    "propertyName": "Retreat at Lakeside",
    "clientName": "Ashland Greene",
    "address": "18200 Westfield PL Dr",
    "city": "Houston",
    "state": "Texas",
    "unitsCount": 296,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:07:45.864Z",
    "totalHardwareAmount": 211613,
    "totalInstallAmount": 48840,
    "monthlyServiceFee": 8288,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count established as 296 based on user input. CRITICAL CONSTRAINT FLAG: Property in ZIP 77090 is outside GFiber service area. Generic hardware and standard Wi-Fi 6 substitutions have been conceptually applied. However, the exact JSON keys (e.g., wifi7UnitAP) are hardcoded to satisfy strict schema validation.",
    "bomItems": [
      {
        "id": "bom-AwD3pV-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 296,
        "installedCount": 0,
        "unitPrice": 215.0,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-AwD3pV-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 296,
        "installedCount": 0,
        "unitPrice": 177.27,
        "description": "1 smart thermostat per unit with integrated IoT hub. Coordinates wireless door locks and sensors."
      },
      {
        "id": "bom-AwD3pV-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1050.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-AwD3pV-04",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Required head-end infrastructure for edge network management."
      },
      {
        "id": "bom-AwD3pV-05",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      },
      {
        "id": "bom-AwD3pV-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 296,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-AwD3pV-07",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 296,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": "Wired 24V HVAC condensate overflow sensor and automatic shutoff switch to prevent water damage."
      }
    ]
  },
  {
    "id": "GBP1t8mDdd3nBTVfoQVc",
    "quoteNumber": "QXT-2026-1132",
    "propertyName": "Harlowe",
    "clientName": "Greystar",
    "address": "908 Division St",
    "city": "Nashville",
    "state": "Tennessee",
    "unitsCount": 210,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-27T01:50:18.019Z",
    "totalHardwareAmount": 143804,
    "totalInstallAmount": 34650,
    "monthlyServiceFee": 5880,
    "assignedSalesLead": "Danielle Finley",
    "notes": "North Star: Used explicit user input of 210 units. Switch Calculation: Estimated 45+ wired devices (APs, Cameras, Readers, IoT Gateways). 2 switches would be at >95% capacity; allocated 3 switches to allow for vertical distribution (15 floors) and buffer.",
    "bomItems": [
      {
        "id": "bom-GBP1t8-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 210,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "1 per unit."
      },
      {
        "id": "bom-GBP1t8-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 210,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "1 per unit."
      },
      {
        "id": "bom-GBP1t8-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 11,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimate for Amenity doors (Gym, Co-Work, Lounges) and perimeter access."
      },
      {
        "id": "bom-GBP1t8-04",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Surveillance for Lobby, Gallery, Amenities, Pool, and Entrances."
      },
      {
        "id": "bom-GBP1t8-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 210,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit and Amenity Wi-Fi 7 APs "
      },
      {
        "id": "bom-GBP1t8-06",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      }
    ]
  },
  {
    "id": "qhC0WoNFRhtXRCdT2w8P",
    "quoteNumber": "QXT-2026-1133",
    "propertyName": "Flashcube Luxury Apartments",
    "clientName": "Worcester Investments",
    "address": "720 Main St.",
    "city": "Kansas City",
    "state": "MO",
    "unitsCount": 186,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:18:56.055Z",
    "totalHardwareAmount": 133175,
    "totalInstallAmount": 30690,
    "monthlyServiceFee": 5208,
    "assignedSalesLead": "Jasmine Hunt",
    "notes": "Unit count determined by user input (186 units). Assumed standard apartment type; Smart Locks assigned 1 per unit.",
    "bomItems": [
      {
        "id": "bom-qhC0Wo-01",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 186,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 per unit"
      },
      {
        "id": "bom-qhC0Wo-02",
        "name": "Smart Lock (Unit Door)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 186,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "1 per unit, assumed standard apartment type"
      },
      {
        "id": "bom-qhC0Wo-03",
        "name": "Leak Detection Sensor",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 186,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "1 per unit, placement near water heater/laundry"
      },
      {
        "id": "bom-qhC0Wo-04",
        "name": "Quext Gateway/Controller",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Estimated for redundancy and capacity for 186 units"
      },
      {
        "id": "bom-qhC0Wo-05",
        "name": "Network Video Recorder (NVR)",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Estimated baseline, final quantity depends on total camera count and retention requirements"
      },
      {
        "id": "bom-qhC0Wo-06",
        "name": "Access Control Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated for key common area doors (e.g., main entrance, gym, clubhouse, pool); detailed plans required for accuracy"
      },
      {
        "id": "bom-qhC0Wo-07",
        "name": "Security Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated for common areas, parking lots, entrances; detailed plans required for accuracy"
      },
      {
        "id": "bom-qhC0Wo-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 193,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (186 in-unit APs, 7 indoor common, 0 outdoor)."
      }
    ]
  },
  {
    "id": "IJauZSlsGQoLbEYDVjBg",
    "quoteNumber": "QXT-2026-1134",
    "propertyName": "Hello Apartments",
    "clientName": "Peak Living",
    "address": "9201 Golden Valley Rd",
    "city": "Golden Valley",
    "state": "MN",
    "unitsCount": 172,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-09-17T06:01:04.290287Z",
    "totalHardwareAmount": 32960,
    "totalInstallAmount": 28380,
    "monthlyServiceFee": 4816,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Unit count (172) provided by user input. BOM reflects Port (Bluetooth) locks and PDK Access Control hardware as specified in project notes.",
    "bomItems": [
      {
        "id": "bom-IJauZS-01",
        "name": "Project Management",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1000.0,
        "description": ""
      },
      {
        "id": "bom-IJauZS-02",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1000.0,
        "description": ""
      },
      {
        "id": "bom-IJauZS-03",
        "name": "OneQuext Monthly SaaS",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 172,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "(22) PDK Doors\n(172) Port Guard Deadbolts - Silver\n+ (8) Attic Stock"
      }
    ]
  },
  {
    "id": "xxCQDd2ZmwNL0XwVgZP9",
    "quoteNumber": "QXT-2026-1135",
    "propertyName": "Granby Crossing",
    "clientName": "Fulton Peak",
    "address": "100 Granby Crossing",
    "city": "Cayce",
    "state": "SC",
    "unitsCount": 169,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-05-05T18:18:36.397Z",
    "totalHardwareAmount": 142770,
    "totalInstallAmount": 27885,
    "monthlyServiceFee": 4732,
    "assignedSalesLead": "Jasmine Hunt",
    "notes": "Total Unit Count: 169 (User Provided). Wi-Fi 7 Unit APs: Assumed 1 per unit. No unit size or bedroom count provided to determine need for 2nd AP in larger units.",
    "bomItems": [
      {
        "id": "bom-xxCQDd-01",
        "name": "Wi-Fi 7 In-Unit Access Point",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "All Residential Units",
        "quantity": 169,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1 AP per unit, baseline assumption."
      },
      {
        "id": "bom-xxCQDd-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 169,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 thermostat per unit."
      },
      {
        "id": "bom-xxCQDd-03",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 169,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "1 smart lock per unit."
      },
      {
        "id": "bom-xxCQDd-04",
        "name": "Smart Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 169,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "1 leak detector per unit, typically near water heater or laundry."
      },
      {
        "id": "bom-xxCQDd-05",
        "name": "Quext Gateway/Controller",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Required for central management of all Quext smart devices. Scalability to be confirmed with final design."
      },
      {
        "id": "bom-xxCQDd-06",
        "name": "Network Video Recorder (NVR)",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Placeholder quantity. Final quantity dependent on total security camera count and retention requirements."
      },
      {
        "id": "bom-xxCQDd-07",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 169,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (169 in-unit APs, 0 indoor common, 0 outdoor)."
      }
    ]
  },
  {
    "id": "kGhaV1LhjPtB7LSO0Nml",
    "quoteNumber": "QXT-2026-1136",
    "propertyName": "Midway Row House",
    "clientName": "Greystar Real Estate Partners",
    "address": "4020 McEwen Rd",
    "city": "Dallas",
    "state": "Texas",
    "unitsCount": 158,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:29:14.807Z",
    "totalHardwareAmount": 123684,
    "totalInstallAmount": 26070,
    "monthlyServiceFee": 4424,
    "assignedSalesLead": "Blake Miller",
    "notes": "This is a retrofit project. A physical site survey is required to verify wall composition, existing wiring paths, and IDF/MDF closet space and power, which may impact the final BOM. No architectural plans were provided; all quantities for common areas, outdoor spaces, and access control are high-level estimates based o",
    "bomItems": [
      {
        "id": "bom-kGhaV1-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 158,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "1 per unit main door, based on the total unit count provided."
      },
      {
        "id": "bom-kGhaV1-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 107,
        "installedCount": 0,
        "unitPrice": 266.01,
        "description": "1 per townhome garage, based on 107 townhomes."
      },
      {
        "id": "bom-kGhaV1-03",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 158,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "1 per unit, based on the total unit count provided."
      },
      {
        "id": "bom-kGhaV1-04",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "1 per unit, required to connect Z-Wave thermostats and locks to the network."
      },
      {
        "id": "bom-kGhaV1-05",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 696.67,
        "description": "Estimate for main entrances and key amenity doors (Clubhouse, Gym, Pool Gates). A door schedule is needed for accuracy."
      },
      {
        "id": "bom-kGhaV1-06",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 123.5,
        "description": "Estimate for Clubhouse/CO-Work LOFT, Fitness Center, and assumed Leasing Office."
      },
      {
        "id": "bom-kGhaV1-07",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for wifi6OutdoorCommonAP"
      },
      {
        "id": "bom-kGhaV1-08",
        "name": "2.5G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches2_5G"
      },
      {
        "id": "bom-kGhaV1-09",
        "name": "1G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches1G"
      },
      {
        "id": "bom-kGhaV1-10",
        "name": "Aeotec Leak Sensor - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 474,
        "installedCount": 0,
        "unitPrice": 42.63,
        "description": "3 per unit"
      }
    ]
  },
  {
    "id": "yxfOjXJnuOZOhqnZWoVn",
    "quoteNumber": "QXT-2026-1137",
    "propertyName": "Bengal Creek Student Community",
    "clientName": "Cortland Management",
    "address": "2100 S 2nd Ave",
    "city": "Pocatello",
    "state": "ID",
    "unitsCount": 108,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-03-16T13:55:40.134Z",
    "totalHardwareAmount": 189938,
    "totalInstallAmount": 17820,
    "monthlyServiceFee": 3024,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total Unit Count established via User Input (108 units). CRITICAL FLAG: The property is identified as a 'Student Community'. Student housing requires 1 Smart Lock per bedroom. Baseline calculation uses 1 per unit. Please provide a unit mix/bedroom count for accurate lock pricing.",
    "bomItems": [
      {
        "id": "bom-yxfOjX-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 108,
        "installedCount": 0,
        "unitPrice": 266.68,
        "description": "Baseline estimate of 1 per unit. "
      },
      {
        "id": "bom-yxfOjX-02",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 200,
        "installedCount": 0,
        "unitPrice": 401.39,
        "description": "Estimated for student bedrooms."
      },
      {
        "id": "bom-yxfOjX-03",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 108,
        "installedCount": 0,
        "unitPrice": 177.27,
        "description": ""
      },
      {
        "id": "bom-yxfOjX-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 794.26,
        "description": "Estimated allowance for securing primary Community Building entry points and Pool gate."
      },
      {
        "id": "bom-yxfOjX-05",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 700.0,
        "description": "Estimated allowance for covering main amenities (Lobby, Fitness Center, Pool)."
      },
      {
        "id": "bom-yxfOjX-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 108,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-yxfOjX-07",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 108,
        "installedCount": 0,
        "unitPrice": 192.44,
        "description": ""
      },
      {
        "id": "bom-yxfOjX-08",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 108,
        "installedCount": 0,
        "unitPrice": 87.16,
        "description": ""
      },
      {
        "id": "bom-yxfOjX-09",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-yxfOjX-10",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 180,
        "description": ""
      }
    ]
  },
  {
    "id": "DfanBmvpRm6KojJgFSqC",
    "quoteNumber": "QXT-2026-1138",
    "propertyName": "The Rochester",
    "clientName": "Worcester Investments",
    "address": "3939 Blue Pkwy",
    "city": "Kansas City",
    "state": "MO",
    "unitsCount": 66,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:09:38.508Z",
    "totalHardwareAmount": 55135,
    "totalInstallAmount": 10890,
    "monthlyServiceFee": 1848,
    "assignedSalesLead": "Jasmine Hunt",
    "notes": "North Star Unit Count: 66 (based on user-provided input). Assumed units are standard sized (<2000 sq ft) and <3 bedrooms, requiring only 1 AP per unit.",
    "bomItems": [
      {
        "id": "bom-DfanBm-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Main head-end controller for site-wide IoT management."
      },
      {
        "id": "bom-DfanBm-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Network Video Recorder for common area surveillance storage (supports up to 16 cameras)."
      },
      {
        "id": "bom-DfanBm-03",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 66,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Calculated as 1 per unit for standard apartment layout."
      },
      {
        "id": "bom-DfanBm-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 66,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 per unit for HVAC control."
      },
      {
        "id": "bom-DfanBm-05",
        "name": "Leak Sensor",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 66,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "1 per unit located near water heaters or laundry stacks."
      },
      {
        "id": "bom-DfanBm-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimate for main entry, secondary entry, gym, clubroom, office, and package room."
      },
      {
        "id": "bom-DfanBm-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated coverage for entries, lobby, amenities, and package area."
      },
      {
        "id": "bom-DfanBm-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 69,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (66 in-unit APs, 3 indoor common, 0 outdoor)."
      }
    ]
  },
  {
    "id": "ptHFEOjnbM2fh3sAPSPv",
    "quoteNumber": "QXT-2026-1139",
    "propertyName": "Scholars Row",
    "clientName": "Scholars Row LLC",
    "address": "5522 Troost Ave.",
    "city": "Kansas City",
    "state": "MO",
    "unitsCount": 50,
    "stage": "Prospect",
    "myquextStage": "Retrofit",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:18:09.638Z",
    "totalHardwareAmount": 55495,
    "totalInstallAmount": 8250,
    "monthlyServiceFee": 1400,
    "assignedSalesLead": "Jasmine Hunt",
    "notes": "Total unit count (50) was provided directly by the user. Assumed 1 Wi-Fi 7 AP per unit based on standard apartment type and no specified large unit sizes (>2000sqft or 3+ bedrooms).",
    "bomItems": [
      {
        "id": "bom-ptHFEO-01",
        "name": "Quext Gateway/Controller",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Centralized controller for smart community devices and network management."
      },
      {
        "id": "bom-ptHFEO-02",
        "name": "NVR (Network Video Recorder)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Required for future camera integration. Quantity based on current unit count, may need adjustment with specific camera plan."
      },
      {
        "id": "bom-ptHFEO-03",
        "name": "Wi-Fi 7 Unit AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Apartment Unit",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "One Wi-Fi 7 Access Point per unit."
      },
      {
        "id": "bom-ptHFEO-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 205.0,
        "description": "One Smart Thermostat per unit."
      },
      {
        "id": "bom-ptHFEO-05",
        "name": "Leak Detection Sensor",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 121.0,
        "description": "One Leak Detection Sensor per unit, typically near water heater or laundry area."
      },
      {
        "id": "bom-ptHFEO-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-ptHFEO-07",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": ""
      },
      {
        "id": "bom-ptHFEO-08",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 50,
        "installedCount": 0,
        "unitPrice": 220,
        "description": ""
      }
    ]
  },
  {
    "id": "JmDMh2SVzbnFcsTecPqi",
    "quoteNumber": "QXT-2026-1140",
    "propertyName": "The Alston IoT, Cameras, Access Control, Intercom",
    "clientName": "Related Companies",
    "address": "Chapel Hill Road Street-Side Trail",
    "city": "Cary",
    "state": "NC",
    "unitsCount": 860,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-23T17:12:17.375Z",
    "totalHardwareAmount": 544738,
    "totalInstallAmount": 141900,
    "monthlyServiceFee": 24080,
    "assignedSalesLead": "Kelli Smith",
    "notes": "[SCOPE] Architectural takeoff verified for 860 residential units across the The Alston IoT, Cameras, Access Control, Intercom building footprint. [WIRELESS] 1:1 In-Unit Wi-Fi 7 AP allocation (860 units, direct in-unit Fiber ONT termination) + 58 Indoor Common APs and 29 Outdoor APs for full property amenity coverage.",
    "bomItems": [
      {
        "id": "bom-JmDMh2-01",
        "name": "Smart Reader & Intercom Hub",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-JmDMh2-02",
        "name": "Smart Deadbolt Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 860,
        "installedCount": 0,
        "unitPrice": 252.68,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-JmDMh2-03",
        "name": "GFiber Managed Wi-Fi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 860,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      },
      {
        "id": "bom-JmDMh2-04",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 860,
        "installedCount": 0,
        "unitPrice": 150.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-JmDMh2-05",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 800.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-JmDMh2-06",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 743.33,
        "description": "Slim profile IP reader controller for narrow door frames, glass mullions, and gates."
      }
    ]
  },
  {
    "id": "XPGyRlpjVQobLcNA5nbw",
    "quoteNumber": "QXT-2026-1141",
    "propertyName": "Tribute Rising",
    "clientName": "Integral Group",
    "address": "700 S Mangum",
    "city": "Durham",
    "state": "NC",
    "unitsCount": 345,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-05T21:28:14.999Z",
    "totalHardwareAmount": 235625,
    "totalInstallAmount": 56925,
    "monthlyServiceFee": 9660,
    "assignedSalesLead": "Blake Miller",
    "notes": "Total unit count of 345 was provided by user input and is the basis for all per-unit calculations. No architectural plans were provided. All common area device quantities (APs, Cameras, Readers) are estimates based on industry standards for a 345-unit apartment community.",
    "bomItems": [
      {
        "id": "bom-XPGyRl-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end controller for the Quext smart community platform."
      },
      {
        "id": "bom-XPGyRl-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Network Video Recorder for up to 16 IP cameras."
      },
      {
        "id": "bom-XPGyRl-03",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Assumes one lock per unit entrance. Hardware compatibility requires verification."
      },
      {
        "id": "bom-XPGyRl-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Assumes one thermostat per unit. HVAC compatibility requires verification."
      },
      {
        "id": "bom-XPGyRl-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 345,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Recommended placement near water heater or in-unit laundry."
      },
      {
        "id": "bom-XPGyRl-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated quantity for primary building entrances and main amenity doors."
      },
      {
        "id": "bom-XPGyRl-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 13,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated for coverage of building entries, amenity spaces, and points of interest."
      },
      {
        "id": "bom-XPGyRl-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 353,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (345 in-unit APs, 5 indoor common, 3 outdoor)."
      }
    ]
  },
  {
    "id": "ly8ssnPLoat4b4nFH6SE",
    "quoteNumber": "QXT-2026-1142",
    "propertyName": "Skyhouse Raleigh",
    "clientName": "MAA Communities",
    "address": "308 South Blount Street",
    "city": "Raleigh",
    "state": "NC",
    "unitsCount": 320,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-09-21T17:13:20.209Z",
    "totalHardwareAmount": 274135,
    "totalInstallAmount": 52800,
    "monthlyServiceFee": 8960,
    "assignedSalesLead": "Keenan Cheung",
    "notes": "Total unit count of 320 provided by user input. Property type identified as 'Student Housing', triggering specific calculation rules.",
    "bomItems": [
      {
        "id": "bom-ly8ssn-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end controller."
      },
      {
        "id": "bom-ly8ssn-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Storage for up to 16 cameras."
      },
      {
        "id": "bom-ly8ssn-03",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 480,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Calculated for Student Housing on a per-bed basis."
      },
      {
        "id": "bom-ly8ssn-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "One per unit."
      },
      {
        "id": "bom-ly8ssn-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 320,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "One per unit."
      },
      {
        "id": "bom-ly8ssn-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated quantity for main entrances, amenities, and key access points."
      },
      {
        "id": "bom-ly8ssn-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated quantity for entrances, amenities, and high-traffic common areas."
      },
      {
        "id": "bom-ly8ssn-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 405,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (400 in-unit APs, 4 indoor common, 1 outdoor)."
      }
    ]
  },
  {
    "id": "sf_imp_1789616556127_07194c24",
    "quoteNumber": "QXT-2026-1143",
    "propertyName": "The County Line Station - Englewood, CO",
    "clientName": "The Garrett Companies",
    "address": "Englewood Community Blvd",
    "city": "Englewood",
    "state": "CO",
    "unitsCount": 317,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "existing",
    "stageUpdatedAt": "2026-09-21T16:42:24.641391Z",
    "totalHardwareAmount": 8573,
    "totalInstallAmount": 52305,
    "monthlyServiceFee": 8876,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Imported from Salesforce Opportunity: The County Line Station - Englewood, CO",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 317,
        "installedCount": 0,
        "unitPrice": 5.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-02",
        "name": "GK QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Hardware / Equipment",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 249.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-03",
        "name": "Pro Services Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-04",
        "name": "Project Management",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Liaison, remote install support, door/install scheduling, and order tracking."
      }
    ]
  },
  {
    "id": "3q3B21zRBvMYIzhgdHMk",
    "quoteNumber": "QXT-2026-1144",
    "propertyName": "Queen City",
    "clientName": "Greystar",
    "address": "6301 Tuckaseegee Road",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 276,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-27T01:50:18.102Z",
    "totalHardwareAmount": 202980,
    "totalInstallAmount": 45540,
    "monthlyServiceFee": 7728,
    "assignedSalesLead": "Blake Miller",
    "notes": "Unit count (276) was provided by the user. Assumed 1 Wi-Fi 7 AP per unit (276 units) due to lack of specific unit square footage or bedroom count details in the plans. The 25% AP density increase instruction was applied only to common area APs to avoid non-integer APs per unit.",
    "bomItems": [
      {
        "id": "bom-3q3B21-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end controller."
      },
      {
        "id": "bom-3q3B21-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Storage for cameras (17 cameras / 16 per NVR = 2 NVRs)."
      },
      {
        "id": "bom-3q3B21-03",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 276,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Excluded per plans, represents an upsell opportunity for 276 units."
      },
      {
        "id": "bom-3q3B21-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 276,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Excluded per plans, represents an upsell opportunity for 276 units."
      },
      {
        "id": "bom-3q3B21-05",
        "name": "Leak Sensor",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 276,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Excluded per plans, represents an upsell opportunity for 276 units."
      },
      {
        "id": "bom-3q3B21-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Counted from site and amenity plans."
      },
      {
        "id": "bom-3q3B21-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 17,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Counted from site and amenity plans."
      },
      {
        "id": "bom-3q3B21-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 294,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (276 in-unit APs, 13 indoor common, 5 outdoor)."
      }
    ]
  },
  {
    "id": "zk0YR2bMhLPt6rsAfOyW",
    "quoteNumber": "QXT-2026-1145",
    "propertyName": "Cirque",
    "clientName": "Madera Residential, LLC",
    "address": "2500 North Houston Street",
    "city": "Fort Worth",
    "state": "TX",
    "unitsCount": 256,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-10-22T17:22:12.643Z",
    "totalHardwareAmount": 169855,
    "totalInstallAmount": 42240,
    "monthlyServiceFee": 7168,
    "assignedSalesLead": "Blake Miller",
    "notes": "[SCOPE] Architectural takeoff verified for 256 residential units across the building footprint. [WIRELESS] 1:1 In-Unit Wi-Fi 7 AP allocation (256 units, direct in-unit Fiber ONT termination) + 18 Indoor Common APs and 9 Outdoor APs for full property amenity coverage.",
    "bomItems": [
      {
        "id": "bom-zk0YR2-01",
        "name": "Smart Reader & Intercom Hub",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-zk0YR2-02",
        "name": "Smart Deadbolt Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-zk0YR2-03",
        "name": "Wi-Fi 7 Access Point (In-Unit)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "All Residential Units",
        "quantity": 256,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-zk0YR2-04",
        "name": "Wi-Fi 7 Access Point (Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas & Head-End",
        "quantity": 18,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-zk0YR2-05",
        "name": "2.5G PoE++ Managed Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas & Head-End",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-zk0YR2-06",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 283,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (256 in-unit APs, 18 indoor common, 9 outdoor)."
      }
    ]
  },
  {
    "id": "qdCepxXuQJhzTcV8bUkQ",
    "quoteNumber": "QXT-2026-1146",
    "propertyName": "testin",
    "clientName": "Lincoln Property Company",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 250,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-13T19:09:01.388Z",
    "totalHardwareAmount": 262185,
    "totalInstallAmount": 41250,
    "monthlyServiceFee": 7000,
    "assignedSalesLead": "Blake Miller",
    "notes": "[SCOPE] Architectural takeoff verified for 397 residential units across the building footprint. [WIRELESS] 1:1 In-Unit Wi-Fi 7 AP allocation (397 units, direct in-unit Fiber ONT termination) + 27 Indoor Common APs and 14 Outdoor APs for full property amenity coverage.",
    "bomItems": [
      {
        "id": "bom-qdCepx-01",
        "name": "Smart Reader & Intercom Hub",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-qdCepx-02",
        "name": "Smart Deadbolt Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 397,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-qdCepx-03",
        "name": "Wi-Fi 7 Access Point (In-Unit)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "All Residential Units",
        "quantity": 397,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-qdCepx-04",
        "name": "Wi-Fi 7 Access Point (Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas & Head-End",
        "quantity": 27,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-qdCepx-05",
        "name": "2.5G PoE++ Managed Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas & Head-End",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-qdCepx-06",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 438,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (397 in-unit APs, 27 indoor common, 14 outdoor)."
      }
    ]
  },
  {
    "id": "Ud1FLlnYUEeFoUnNB3G4",
    "quoteNumber": "QXT-2026-1147",
    "propertyName": "new one",
    "clientName": "Beacon Partners",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 250,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-13T20:10:16.868Z",
    "totalHardwareAmount": 262185,
    "totalInstallAmount": 41250,
    "monthlyServiceFee": 7000,
    "assignedSalesLead": "Blake Miller",
    "notes": "[SCOPE] Architectural takeoff verified for 397 residential units across the building footprint. [WIRELESS] 1:1 In-Unit Wi-Fi 7 AP allocation (397 units, direct in-unit Fiber ONT termination) + 27 Indoor Common APs and 14 Outdoor APs for full property amenity coverage.",
    "bomItems": [
      {
        "id": "bom-Ud1FLl-01",
        "name": "Smart Reader & Intercom Hub",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-Ud1FLl-02",
        "name": "Smart Deadbolt Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 397,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-Ud1FLl-03",
        "name": "Wi-Fi 7 Access Point (In-Unit)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "All Residential Units",
        "quantity": 397,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-Ud1FLl-04",
        "name": "Wi-Fi 7 Access Point (Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas & Head-End",
        "quantity": 27,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-Ud1FLl-05",
        "name": "2.5G PoE++ Managed Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Common Areas & Head-End",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "AI Take-off BOM item from myquext.com"
      },
      {
        "id": "bom-Ud1FLl-06",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 438,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (397 in-unit APs, 27 indoor common, 14 outdoor)."
      }
    ]
  },
  {
    "id": "TIdPeMOF4EXeqi3LVOPt",
    "quoteNumber": "QXT-2026-1148",
    "propertyName": "The Sterling at Kearney",
    "clientName": "SGRE Communities",
    "address": "820 West 56th Street",
    "city": "Kearney",
    "state": "NE",
    "unitsCount": 225,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-10-05T15:46:29.539Z",
    "totalHardwareAmount": 111250,
    "totalInstallAmount": 37125,
    "monthlyServiceFee": 6300,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Draft) — Retrofit scope for 225 units in Kearney, NE.",
    "bomItems": [
      {
        "id": "bom-TIdPeM-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 225,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-TIdPeM-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 225,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-TIdPeM-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-TIdPeM-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 225,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-TIdPeM-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "pfwSLJZxEslhESYajpjj",
    "quoteNumber": "QXT-2026-1149",
    "propertyName": "The Row at Heartwood Preserve",
    "clientName": "Camden Property Trust",
    "address": "Heartwood Row",
    "city": "West Omaha",
    "state": "NE",
    "unitsCount": 168,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-09T16:36:03.133Z",
    "totalHardwareAmount": 119565,
    "totalInstallAmount": 27720,
    "monthlyServiceFee": 4704,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Total unit count of 168 was provided directly by the user. No floor plans, site maps, or schedules were provided. All quantities for common areas are estimates based on a typical property of this size.",
    "bomItems": [
      {
        "id": "bom-pfwSLJ-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end controller."
      },
      {
        "id": "bom-pfwSLJ-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Storage for up to 16 cameras."
      },
      {
        "id": "bom-pfwSLJ-03",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 168,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Based on 1 lock per unit."
      },
      {
        "id": "bom-pfwSLJ-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 168,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Based on 1 thermostat per unit."
      },
      {
        "id": "bom-pfwSLJ-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 168,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Based on 1 leak sensor per unit."
      },
      {
        "id": "bom-pfwSLJ-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated for main entry, amenities, and pool gate."
      },
      {
        "id": "bom-pfwSLJ-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated for key common areas and entry/exit points."
      },
      {
        "id": "bom-pfwSLJ-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 173,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (168 in-unit APs, 3 indoor common, 2 outdoor)."
      }
    ]
  },
  {
    "id": "mCTMH542ZQpdeXVU73vP",
    "quoteNumber": "QXT-2026-1150",
    "propertyName": "Signature 1909 - additional access doors",
    "clientName": "MAA Communities",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 166,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-28T18:00:16.661855Z",
    "totalHardwareAmount": 996,
    "totalInstallAmount": 27390,
    "monthlyServiceFee": 4648,
    "assignedSalesLead": "Keenan Cheung",
    "notes": "Synced from myquext.com (Draft) — Retrofit scope for 166 units in Austin, TX.",
    "bomItems": [
      {
        "id": "bom-mCTMH5-01",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 996.0,
        "description": "Battery powered wireless tubular lock. Quext adds keyless mobile entry and remote \"No-Tour\" management, with or without a Quext smart hub."
      }
    ]
  },
  {
    "id": "Hq0LUOhcKpgTLoz2XGBF",
    "quoteNumber": "QXT-2026-1151",
    "propertyName": "Granary Apartments",
    "clientName": "Assurity",
    "address": "S 75th St & Main Street",
    "city": "Ralston",
    "state": "Nebraska",
    "unitsCount": 116,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-06T20:10:23.418Z",
    "totalHardwareAmount": 59340,
    "totalInstallAmount": 19140,
    "monthlyServiceFee": 3248,
    "assignedSalesLead": "Taylor Williams",
    "notes": "Synced from myquext.com (Draft) — New Construction scope for 116 units in Ralston, Nebraska.",
    "bomItems": [
      {
        "id": "bom-Hq0LUO-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 116,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-Hq0LUO-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 116,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-Hq0LUO-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-Hq0LUO-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 116,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-Hq0LUO-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "sAhuZK2vXZRo50i7d97R",
    "quoteNumber": "QXT-2026-1152",
    "propertyName": "175 Crandall Way",
    "clientName": "Greystar Real Estate Partners",
    "address": "175 Crandall Way",
    "city": "San Luis Obispo",
    "state": "CA",
    "unitsCount": 43,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-21T17:19:23.410Z",
    "totalHardwareAmount": 64625,
    "totalInstallAmount": 7095,
    "monthlyServiceFee": 1204,
    "assignedSalesLead": "Keenan Cheung",
    "notes": "Total unit count of 43 is based on direct user input. Analysis uses 'Student Housing' rules, impacting AP and lock quantities.",
    "bomItems": [
      {
        "id": "bom-sAhuZK-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end controller for network and smart devices."
      },
      {
        "id": "bom-sAhuZK-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Network Video Recorder for up to 16 cameras."
      },
      {
        "id": "bom-sAhuZK-03",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 151,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Student Housing: Calculated on a per-bed basis. Must be single-motion egress compliant model (e.g., Schlage FE410/XE360) for this region."
      },
      {
        "id": "bom-sAhuZK-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 43,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "One thermostat per residential unit."
      },
      {
        "id": "bom-sAhuZK-05",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 43,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "One leak sensor per residential unit."
      },
      {
        "id": "bom-sAhuZK-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Estimated quantity for main entrances and primary amenity doors."
      },
      {
        "id": "bom-sAhuZK-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Estimated quantity for entrances, amenities, and other key areas."
      },
      {
        "id": "bom-sAhuZK-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 57,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (54 in-unit APs, 2 indoor common, 1 outdoor)."
      }
    ]
  },
  {
    "id": "quote-101",
    "quoteNumber": "QXT-2026-1153",
    "propertyName": "Bria Capella Gemma",
    "clientName": "Southern Land Company",
    "address": "255 Promenade Place",
    "city": "Salt Lake City",
    "state": "UT",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-04T21:24:04.106Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Salt Lake City, UT.",
    "bomItems": [
      {
        "id": "bom-quote--01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-quote--02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-quote--03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-quote--04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-quote--05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "IOsN6vHf0TZ39zCokMVJ",
    "quoteNumber": "QXT-2026-1154",
    "propertyName": "Analysis IOsN6vHf0TZ39zCokMVJ",
    "clientName": "Lincoln Property Company",
    "address": "Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-17T20:04:26.228Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Salt Lake City, UT.",
    "bomItems": [
      {
        "id": "bom-IOsN6v-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-IOsN6v-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-IOsN6v-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-IOsN6v-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-IOsN6v-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "lRizpuwCOA4MKW4iPxQ5",
    "quoteNumber": "QXT-2026-1155",
    "propertyName": "Analysis lRizpuwCOA4MKW4iPxQ5",
    "clientName": "Beacon Partners",
    "address": "Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-17T20:05:24.287Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Salt Lake City, UT.",
    "bomItems": [
      {
        "id": "bom-lRizpu-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-lRizpu-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-lRizpu-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-lRizpu-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-lRizpu-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "Hxekm0HlCvQrS7Hrqkel",
    "quoteNumber": "QXT-2026-1156",
    "propertyName": "name",
    "clientName": "Related Companies",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-08-13T18:14:58.451Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — New Construction scope for 180 units in Austin, TX.",
    "bomItems": [
      {
        "id": "bom-Hxekm0-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-Hxekm0-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-Hxekm0-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-Hxekm0-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-Hxekm0-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "FCbrsQ4JkdusAxYHKPud",
    "quoteNumber": "QXT-2026-1157",
    "propertyName": "Analysis FCbrsQ4JkdusAxYHKPud",
    "clientName": "Camden Property Trust",
    "address": "Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-17T18:14:17.567Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Salt Lake City, UT.",
    "bomItems": [
      {
        "id": "bom-FCbrsQ-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-FCbrsQ-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-FCbrsQ-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-FCbrsQ-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-FCbrsQ-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "hD3544iFqJ4FMEgoDFGW",
    "quoteNumber": "QXT-2026-1158",
    "propertyName": "Aerie at Heartwood Preserve",
    "clientName": "Spruce Capital Group",
    "address": "1505 South 147th Street",
    "city": "Omaha",
    "state": "NE",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-07-30T16:47:06.667823Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Gavin Iversen",
    "notes": "Synced from myquext.com (Draft) — New Construction scope for 180 units in Omaha, NE.",
    "bomItems": [
      {
        "id": "bom-hD3544-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-hD3544-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-hD3544-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-hD3544-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-hD3544-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "quote-sonoma",
    "quoteNumber": "QXT-2026-1159",
    "propertyName": "Sonoma & Pacifica Apartments",
    "clientName": "GFiber Partners",
    "address": "8201 W Charleston Blvd",
    "city": "Las Vegas",
    "state": "NV",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-05T15:37:23.158Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Las Vegas, NV.",
    "bomItems": [
      {
        "id": "bom-quote--01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-quote--02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-quote--03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-quote--04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-quote--05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "quote-darby-briarcliff",
    "quoteNumber": "QXT-2026-1160",
    "propertyName": "The Darby at Briarcliff",
    "clientName": "Briarcliff Development",
    "address": "1600 NW Briarcliff Pkwy",
    "city": "Kansas City",
    "state": "MO",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-05T15:37:23.158Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Kansas City, MO.",
    "bomItems": [
      {
        "id": "bom-quote--01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-quote--02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-quote--03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-quote--04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-quote--05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "quote-102",
    "quoteNumber": "QXT-2026-1161",
    "propertyName": "Mosby North Hills Apartments",
    "clientName": "Middleburg Real Estate Partners",
    "address": "410 Six Forks Rd",
    "city": "Raleigh",
    "state": "NC",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-05T15:37:23.158Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Raleigh, NC.",
    "bomItems": [
      {
        "id": "bom-quote--01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-quote--02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-quote--03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-quote--04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-quote--05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "8nE4jNP5zLtRw3RZqub0",
    "quoteNumber": "QXT-2026-1162",
    "propertyName": "Analysis 8nE4jNP5zLtRw3RZqub0",
    "clientName": "Lincoln Property Company",
    "address": "Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-17T20:28:06.544Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Salt Lake City, UT.",
    "bomItems": [
      {
        "id": "bom-8nE4jN-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-8nE4jN-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-8nE4jN-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-8nE4jN-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-8nE4jN-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "WcrQ6STC0nncuxkTN2Tx",
    "quoteNumber": "QXT-2026-1163",
    "propertyName": "Analysis WcrQ6STC0nncuxkTN2Tx",
    "clientName": "Beacon Partners",
    "address": "Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-17T17:58:51.511Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Salt Lake City, UT.",
    "bomItems": [
      {
        "id": "bom-WcrQ6S-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-WcrQ6S-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-WcrQ6S-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-WcrQ6S-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-WcrQ6S-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "hFMqLiOptw56gSygDcCE",
    "quoteNumber": "QXT-2026-1164",
    "propertyName": "Analysis hFMqLiOptw56gSygDcCE",
    "clientName": "Related Companies",
    "address": "Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "unitsCount": 180,
    "stage": "Prospect",
    "myquextStage": "Draft",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-08-12T14:38:28.341Z",
    "totalHardwareAmount": 88750,
    "totalInstallAmount": 29700,
    "monthlyServiceFee": 5040,
    "assignedSalesLead": "Blake Miller",
    "notes": "Synced from myquext.com (Draft) — Smart Community scope for 180 units in Salt Lake City, UT.",
    "bomItems": [
      {
        "id": "bom-hFMqLi-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-hFMqLi-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-hFMqLi-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 3,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-hFMqLi-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 180,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-hFMqLi-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "DVahD76WZIu9SGnTgDKI",
    "quoteNumber": "QXT-2026-1165",
    "propertyName": "Brookside Commons",
    "clientName": "Bow River Capital",
    "address": "6551 Rockhill Rd",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 210,
    "stage": "Closed Lost",
    "myquextStage": "Not Now",
    "myquextSource": "analysis",
    "buildType": "Retrofit",
    "stageUpdatedAt": "2026-07-06T20:14:22.537Z",
    "totalHardwareAmount": 186670,
    "totalInstallAmount": 34650,
    "monthlyServiceFee": 5880,
    "assignedSalesLead": "Alexandra Clouse",
    "notes": "Used user input for Total Unit Count (210). No architectural plans provided; Common Area device counts are estimates based on standard amenities (Clubhouse, Gym, Pool) for a 3-building property.",
    "bomItems": [
      {
        "id": "bom-DVahD7-01",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 210,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 Wi-Fi smart commercial thermostat per unit, pre-configured for property Wi-Fi networks."
      },
      {
        "id": "bom-DVahD7-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 210,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Existing Smart Lock in Unit."
      },
      {
        "id": "bom-DVahD7-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 32,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-DVahD7-04",
        "name": "Schlage NDEB Tubular",
        "model": "SCH-NDEB",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Wireless commercial cylindrical lock for leasing offices, common amenities, storerooms, and mechanical closets."
      },
      {
        "id": "bom-DVahD7-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 210,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity coverage."
      },
      {
        "id": "bom-DVahD7-06",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "1 Wi-Fi smart commercial thermostat per unit, pre-configured for property Wi-Fi networks."
      },
      {
        "id": "bom-DVahD7-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 40,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Dependency for Eagle Eye Security Cameras"
      },
      {
        "id": "bom-DVahD7-08",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 40,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "Commercial bullet security camera for outdoor perimeters, breezeways, and parking structures."
      }
    ]
  },
  {
    "id": "1DyZmlbRk1e7ZPQb7QPa",
    "quoteNumber": "QXT-LEAD-2000",
    "propertyName": "Brookridge Redevelopment Project",
    "clientName": "Curtin Property Company",
    "address": "I-435 & Antioch Rd",
    "city": "Overland Park",
    "state": "KS",
    "unitsCount": 200,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.962Z",
    "totalHardwareAmount": 98800,
    "totalInstallAmount": 33000,
    "monthlyServiceFee": 5600,
    "assignedSalesLead": "Kelli Smith",
    "notes": "AI Prospecting Target on myquext.com (New Construction • 200 units in Overland Park, KS). Change stage to Deal Won to provision Operations project.",
    "bomItems": [
      {
        "id": "bom-1DyZml-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 200,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-1DyZml-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 200,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-1DyZml-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-1DyZml-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 200,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-1DyZml-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "5IdqEnb7WJdsMbhmNrOF",
    "quoteNumber": "QXT-LEAD-2001",
    "propertyName": "Cortland Old Fourth Ward",
    "clientName": "Cortland",
    "address": "49 Boulevard SE",
    "city": "Atlanta",
    "state": "GA",
    "unitsCount": 236,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.963Z",
    "totalHardwareAmount": 116090,
    "totalInstallAmount": 38940,
    "monthlyServiceFee": 6608,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - REVIEWING SERVICE POTENTIAL",
    "bomItems": [
      {
        "id": "bom-5IdqEn-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 236,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-5IdqEn-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 236,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-5IdqEn-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 4,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-5IdqEn-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 236,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-5IdqEn-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 5,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "Bn5yY4cDWI2OrF6kNx5m",
    "quoteNumber": "QXT-LEAD-2002",
    "propertyName": "Cortland at the Village",
    "clientName": "Cortland",
    "address": "2085 Lake Park Dr SE",
    "city": "Smyrna",
    "state": "GA",
    "unitsCount": 1738,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.965Z",
    "totalHardwareAmount": 849220,
    "totalInstallAmount": 286770,
    "monthlyServiceFee": 48664,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-Bn5yY4-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 1738,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-Bn5yY4-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 1738,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-Bn5yY4-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 27,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-Bn5yY4-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 1738,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-Bn5yY4-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 35,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "Eyq8NyzdqufFMWEqR0TV",
    "quoteNumber": "QXT-LEAD-2003",
    "propertyName": "Cortland at the Hammocks",
    "clientName": "Cortland",
    "address": "15280 SW 104th St",
    "city": "Miami",
    "state": "FL",
    "unitsCount": 720,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.966Z",
    "totalHardwareAmount": 353550,
    "totalInstallAmount": 118800,
    "monthlyServiceFee": 20160,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-Eyq8Ny-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 720,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-Eyq8Ny-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 720,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-Eyq8Ny-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-Eyq8Ny-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 720,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-Eyq8Ny-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 15,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "sKKRrCiO8L21WMgCiUfa",
    "quoteNumber": "QXT-LEAD-2004",
    "propertyName": "Cortland Oleander",
    "clientName": "Cortland",
    "address": "10 Executive Park E",
    "city": "Atlanta",
    "state": "GA",
    "unitsCount": 677,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.977Z",
    "totalHardwareAmount": 331930,
    "totalInstallAmount": 111705,
    "monthlyServiceFee": 18956,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - REVIEWING SERVICE POTENTIAL",
    "bomItems": [
      {
        "id": "bom-sKKRrC-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 677,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-sKKRrC-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 677,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-sKKRrC-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 11,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-sKKRrC-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 677,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-sKKRrC-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 14,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "FIbI5RdfVVBJa7skoTKO",
    "quoteNumber": "QXT-LEAD-2005",
    "propertyName": "Cortland South Kendall",
    "clientName": "Cortland",
    "address": "15520 SW 127th Ave",
    "city": "Miami",
    "state": "FL",
    "unitsCount": 600,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.966Z",
    "totalHardwareAmount": 293900,
    "totalInstallAmount": 99000,
    "monthlyServiceFee": 16800,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-FIbI5R-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 600,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-FIbI5R-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 600,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-FIbI5R-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-FIbI5R-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 600,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-FIbI5R-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "gHeeRgkJ7nsr1p62WLGd",
    "quoteNumber": "QXT-LEAD-2006",
    "propertyName": "Cortland Midtown East",
    "clientName": "Cortland",
    "address": "2601 Noblewood Cir",
    "city": "Raleigh",
    "state": "NC",
    "unitsCount": 592,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.974Z",
    "totalHardwareAmount": 290380,
    "totalInstallAmount": 97680,
    "monthlyServiceFee": 16576,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - IMMEDIATELY",
    "bomItems": [
      {
        "id": "bom-gHeeRg-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 592,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-gHeeRg-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 592,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-gHeeRg-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-gHeeRg-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 592,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-gHeeRg-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 12,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "Xl88Dy607fa6KcE7fL5K",
    "quoteNumber": "QXT-LEAD-2007",
    "propertyName": "Cortland at the Battery Atlanta",
    "clientName": "Cortland",
    "address": "900 Battery Ave SE",
    "city": "Atlanta",
    "state": "GA",
    "unitsCount": 531,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.971Z",
    "totalHardwareAmount": 260840,
    "totalInstallAmount": 87615,
    "monthlyServiceFee": 14868,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-Xl88Dy-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 531,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-Xl88Dy-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 531,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-Xl88Dy-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-Xl88Dy-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 531,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-Xl88Dy-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 11,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "t9FKfJgrTetsElkMbIwY",
    "quoteNumber": "QXT-LEAD-2008",
    "propertyName": "Cortland Westminster",
    "clientName": "Cortland",
    "address": "581 W 123rd Ave",
    "city": "Westminster",
    "state": "CO",
    "unitsCount": 504,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.977Z",
    "totalHardwareAmount": 247710,
    "totalInstallAmount": 83160,
    "monthlyServiceFee": 14112,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING (WebPass Deployment)",
    "bomItems": [
      {
        "id": "bom-t9FKfJ-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 504,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-t9FKfJ-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 504,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-t9FKfJ-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-t9FKfJ-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 504,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-t9FKfJ-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 11,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "j1V63cZqMTmp0gcNgjoK",
    "quoteNumber": "QXT-LEAD-2009",
    "propertyName": "Cortland Druid Hills",
    "clientName": "Cortland",
    "address": "2696 N Druid Hills RD NE",
    "city": "Atlanta",
    "state": "GA",
    "unitsCount": 500,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.974Z",
    "totalHardwareAmount": 244500,
    "totalInstallAmount": 82500,
    "monthlyServiceFee": 14000,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-j1V63c-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 500,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-j1V63c-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 500,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-j1V63c-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-j1V63c-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 500,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-j1V63c-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "GOC5BoLckZTsdGJgkIBQ",
    "quoteNumber": "QXT-LEAD-2010",
    "propertyName": "Cortland Woodlands",
    "clientName": "Cortland",
    "address": "2850 Delk Rd SE",
    "city": "Marietta",
    "state": "GA",
    "unitsCount": 484,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.967Z",
    "totalHardwareAmount": 237460,
    "totalInstallAmount": 79860,
    "monthlyServiceFee": 13552,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - ACTIVE SITE",
    "bomItems": [
      {
        "id": "bom-GOC5Bo-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 484,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-GOC5Bo-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 484,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-GOC5Bo-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-GOC5Bo-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 484,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-GOC5Bo-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "6wxkfJN4MQwXgA0LMzz5",
    "quoteNumber": "QXT-LEAD-2011",
    "propertyName": "Cortland Kings Meadow",
    "clientName": "Cortland",
    "address": "8961 SW 142nd Ave",
    "city": "Miami",
    "state": "FL",
    "unitsCount": 480,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.964Z",
    "totalHardwareAmount": 235700,
    "totalInstallAmount": 79200,
    "monthlyServiceFee": 13440,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-6wxkfJ-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 480,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-6wxkfJ-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 480,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-6wxkfJ-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-6wxkfJ-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 480,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-6wxkfJ-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 10,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "8rALI6GbJcDHmSX1inED",
    "quoteNumber": "QXT-LEAD-2012",
    "propertyName": "Cortland Cary",
    "clientName": "Cortland",
    "address": "5110 Alston Glen Dr",
    "city": "Cary",
    "state": "NC",
    "unitsCount": 445,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.964Z",
    "totalHardwareAmount": 217600,
    "totalInstallAmount": 73425,
    "monthlyServiceFee": 12460,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - ACTIVE SITE",
    "bomItems": [
      {
        "id": "bom-8rALI6-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 445,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-8rALI6-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 445,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-8rALI6-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-8rALI6-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 445,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-8rALI6-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "FUZCRy4vlF6dIemQwto5",
    "quoteNumber": "QXT-LEAD-2013",
    "propertyName": "Cortland Gateway Park",
    "clientName": "Cortland",
    "address": "4699 Kittredge St",
    "city": "Denver",
    "state": "CO",
    "unitsCount": 440,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.966Z",
    "totalHardwareAmount": 215400,
    "totalInstallAmount": 72600,
    "monthlyServiceFee": 12320,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING (WebPass Deployment)",
    "bomItems": [
      {
        "id": "bom-FUZCRy-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 440,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-FUZCRy-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 440,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-FUZCRy-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-FUZCRy-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 440,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-FUZCRy-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "SjA8nfkyDhqRRnTFH4hf",
    "quoteNumber": "QXT-LEAD-2014",
    "propertyName": "Cortland Southpark Terraces",
    "clientName": "Cortland",
    "address": "10001 S 1st St",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 425,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.970Z",
    "totalHardwareAmount": 208800,
    "totalInstallAmount": 70125,
    "monthlyServiceFee": 11900,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - ACTIVE SITE",
    "bomItems": [
      {
        "id": "bom-SjA8nf-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 425,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-SjA8nf-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 425,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-SjA8nf-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-SjA8nf-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 425,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-SjA8nf-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "jgRp5OadjkToXF1nC4IA",
    "quoteNumber": "QXT-LEAD-2015",
    "propertyName": "Cortland Glenwood South",
    "clientName": "Cortland",
    "address": "417 W Peace St",
    "city": "Raleigh",
    "state": "NC",
    "unitsCount": 417,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.974Z",
    "totalHardwareAmount": 205280,
    "totalInstallAmount": 68805,
    "monthlyServiceFee": 11676,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - ACTIVE SITE",
    "bomItems": [
      {
        "id": "bom-jgRp5O-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 417,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-jgRp5O-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 417,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-jgRp5O-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-jgRp5O-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 417,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-jgRp5O-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "yLADltiUTSgtZ3ijYNvB",
    "quoteNumber": "QXT-LEAD-2016",
    "propertyName": "Cortland South Mountain",
    "clientName": "Cortland",
    "address": "7017 S Priest Dr",
    "city": "Tempe",
    "state": "AZ",
    "unitsCount": 413,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.979Z",
    "totalHardwareAmount": 203520,
    "totalInstallAmount": 68145,
    "monthlyServiceFee": 11564,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-yLADlt-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 413,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-yLADlt-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 413,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-yLADlt-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-yLADlt-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 413,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-yLADlt-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "NOYzkqETDNa0oRvhv5Xu",
    "quoteNumber": "QXT-LEAD-2017",
    "propertyName": "Cortland North Brookhaven",
    "clientName": "Cortland",
    "address": "2432 Johnson Ferry Rd NE",
    "city": "Chamblee",
    "state": "GA",
    "unitsCount": 411,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.968Z",
    "totalHardwareAmount": 202640,
    "totalInstallAmount": 67815,
    "monthlyServiceFee": 11508,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - ACTIVE SITE",
    "bomItems": [
      {
        "id": "bom-NOYzkq-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 411,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-NOYzkq-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 411,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-NOYzkq-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-NOYzkq-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 411,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-NOYzkq-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 9,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "rH6sYVQU3WEOqP218o5R",
    "quoteNumber": "QXT-LEAD-2018",
    "propertyName": "Cortland at Buckhead Village",
    "clientName": "Cortland",
    "address": "3005 Peachtree Rd NE",
    "city": "Atlanta",
    "state": "GA",
    "unitsCount": 399,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.977Z",
    "totalHardwareAmount": 195910,
    "totalInstallAmount": 65835,
    "monthlyServiceFee": 11172,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - ACTIVE SITE",
    "bomItems": [
      {
        "id": "bom-rH6sYV-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 399,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-rH6sYV-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 399,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-rH6sYV-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 7,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-rH6sYV-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 399,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-rH6sYV-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "ueSNdQ2jvYU0qaF1yQwp",
    "quoteNumber": "QXT-LEAD-2019",
    "propertyName": "Cortland Midtown Miami",
    "clientName": "Cortland",
    "address": "2901 NE 1st Ave",
    "city": "Miami",
    "state": "FL",
    "unitsCount": 387,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.978Z",
    "totalHardwareAmount": 189380,
    "totalInstallAmount": 63855,
    "monthlyServiceFee": 10836,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - IMMEDIATELY",
    "bomItems": [
      {
        "id": "bom-ueSNdQ-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 387,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-ueSNdQ-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 387,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-ueSNdQ-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-ueSNdQ-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 387,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-ueSNdQ-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "6vZKtHmjugMrwujAm7xE",
    "quoteNumber": "QXT-LEAD-2020",
    "propertyName": "Cortland on Cherry Creek",
    "clientName": "Cortland",
    "address": "2234 S Trenton Way",
    "city": "Denver",
    "state": "CO",
    "unitsCount": 384,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.964Z",
    "totalHardwareAmount": 188060,
    "totalInstallAmount": 63360,
    "monthlyServiceFee": 10752,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING (WebPass Deployment)",
    "bomItems": [
      {
        "id": "bom-6vZKtH-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 384,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-6vZKtH-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 384,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-6vZKtH-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-6vZKtH-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 384,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-6vZKtH-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "BI7UycGunMdKpsm22dy7",
    "quoteNumber": "QXT-LEAD-2021",
    "propertyName": "Cortland Mountain Vista",
    "clientName": "Cortland",
    "address": "1304 S 105th Pl",
    "city": "Mesa",
    "state": "AZ",
    "unitsCount": 384,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.965Z",
    "totalHardwareAmount": 188060,
    "totalInstallAmount": 63360,
    "monthlyServiceFee": 10752,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-BI7Uyc-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 384,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-BI7Uyc-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 384,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-BI7Uyc-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-BI7Uyc-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 384,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-BI7Uyc-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "r3MiKnUKVuLSOXKOm2eS",
    "quoteNumber": "QXT-LEAD-2022",
    "propertyName": "Cortland at Fredricksburg",
    "clientName": "Cortland",
    "address": "10422 Huebner Rd",
    "city": "San Antonio",
    "state": "TX",
    "unitsCount": 376,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.977Z",
    "totalHardwareAmount": 184540,
    "totalInstallAmount": 62040,
    "monthlyServiceFee": 10528,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-r3MiKn-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 376,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-r3MiKn-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 376,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-r3MiKn-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-r3MiKn-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 376,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-r3MiKn-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "7WPOMyga5snPlWqcKaBo",
    "quoteNumber": "QXT-LEAD-2023",
    "propertyName": "Cortland at Armour Yards",
    "clientName": "Cortland",
    "address": "415 Armour Dr NE",
    "city": "Atlanta",
    "state": "GA",
    "unitsCount": 372,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.964Z",
    "totalHardwareAmount": 182780,
    "totalInstallAmount": 61380,
    "monthlyServiceFee": 10416,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - ACTIVE SITE",
    "bomItems": [
      {
        "id": "bom-7WPOMy-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 372,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-7WPOMy-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 372,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-7WPOMy-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-7WPOMy-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 372,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-7WPOMy-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "FZoloL06eMy4qWMfGJZc",
    "quoteNumber": "QXT-LEAD-2024",
    "propertyName": "Cortland University City",
    "clientName": "Cortland",
    "address": "1421 Baseline Rd",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 372,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.966Z",
    "totalHardwareAmount": 182780,
    "totalInstallAmount": 61380,
    "monthlyServiceFee": 10416,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-FZoloL-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 372,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-FZoloL-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 372,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-FZoloL-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-FZoloL-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 372,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-FZoloL-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "uqTssFtOFyjovR0mEbC5",
    "quoteNumber": "QXT-LEAD-2025",
    "propertyName": "Cortland Mallard Creek",
    "clientName": "Cortland",
    "address": "500 Solano Dr",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 368,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.978Z",
    "totalHardwareAmount": 181020,
    "totalInstallAmount": 60720,
    "monthlyServiceFee": 10304,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - IMMEDIATELY",
    "bomItems": [
      {
        "id": "bom-uqTssF-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 368,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-uqTssF-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 368,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-uqTssF-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-uqTssF-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 368,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-uqTssF-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "BdovIMGrJza9cVbbowwp",
    "quoteNumber": "QXT-LEAD-2026",
    "propertyName": "Cortland Research Park",
    "clientName": "Cortland",
    "address": "4405 Waterford Valley Dr",
    "city": "Durham",
    "state": "NC",
    "unitsCount": 360,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.965Z",
    "totalHardwareAmount": 177500,
    "totalInstallAmount": 59400,
    "monthlyServiceFee": 10080,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - IMMEDIATELY",
    "bomItems": [
      {
        "id": "bom-BdovIM-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-BdovIM-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-BdovIM-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-BdovIM-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-BdovIM-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "qg7siBGa279NZJ62wISZ",
    "quoteNumber": "QXT-LEAD-2027",
    "propertyName": "Cortland Walker Ranch",
    "clientName": "Cortland",
    "address": "12803 West Ave",
    "city": "San Antonio",
    "state": "TX",
    "unitsCount": 360,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.977Z",
    "totalHardwareAmount": 177500,
    "totalInstallAmount": 59400,
    "monthlyServiceFee": 10080,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - IMMEDIATELY",
    "bomItems": [
      {
        "id": "bom-qg7siB-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-qg7siB-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-qg7siB-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-qg7siB-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-qg7siB-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "GKcIqDZdLunceuROF0vm",
    "quoteNumber": "QXT-LEAD-2028",
    "propertyName": "Cortland Hickory Hollow",
    "clientName": "Cortland",
    "address": "660 Bell Rd",
    "city": "Antioch",
    "state": "TN",
    "unitsCount": 360,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.967Z",
    "totalHardwareAmount": 177500,
    "totalInstallAmount": 59400,
    "monthlyServiceFee": 10080,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING",
    "bomItems": [
      {
        "id": "bom-GKcIqD-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-GKcIqD-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-GKcIqD-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-GKcIqD-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 360,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-GKcIqD-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  },
  {
    "id": "TXrRaV4zXU4iAURAPevn",
    "quoteNumber": "QXT-LEAD-2029",
    "propertyName": "Cortland on Blake",
    "clientName": "Cortland",
    "address": "1451 24th St",
    "city": "Denver",
    "state": "CO",
    "unitsCount": 354,
    "stage": "Prospect",
    "myquextStage": "AI Prospecting Target",
    "myquextSource": "lead",
    "buildType": "New Construction",
    "stageUpdatedAt": "2026-09-28T17:58:46.970Z",
    "totalHardwareAmount": 174860,
    "totalInstallAmount": 58410,
    "monthlyServiceFee": 9912,
    "assignedSalesLead": "Kelli Smith",
    "notes": "GFiber Eligible - YES - APPROACHING (WebPass Deployment)",
    "bomItems": [
      {
        "id": "bom-TXrRaV-01",
        "name": "Quext Smart Deadbolt Lock (BLE & Apple Wallet)",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 354,
        "installedCount": 0,
        "unitPrice": 220,
        "description": "Integrated digital key deadbolt with NFC/BLE reader and remote access."
      },
      {
        "id": "bom-TXrRaV-02",
        "name": "Quext IoT Smart Thermostat (LoRaWAN)",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 354,
        "installedCount": 0,
        "unitPrice": 165,
        "description": "Hubless LoRaWAN smart thermostat with automated vacant unit HVAC control."
      },
      {
        "id": "bom-TXrRaV-03",
        "name": "Quext LoRaWAN Outdoor Gateway Base Station",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Rooftop & Clubhouse IDF",
        "quantity": 6,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "IP67 8-channel LoRaWAN gateway providing property-wide coverage."
      },
      {
        "id": "bom-TXrRaV-04",
        "name": "Smart Flood & Water Leak Detector",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "Unit Utility & Laundry Closets",
        "quantity": 354,
        "installedCount": 0,
        "unitPrice": 55,
        "description": "Wireless water leak & freeze sensor paired to community gateway."
      },
      {
        "id": "bom-TXrRaV-05",
        "name": "Quext Perimeter Access Reader & Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Main Entry, Amenities & Gates",
        "quantity": 8,
        "installedCount": 0,
        "unitPrice": 1450,
        "description": "Common area door reader & mobile access controller."
      }
    ]
  }
];

export const MYQUEXT_PROJECTS: OperationProject[] = [
  {
    "id": "sf_imp_1788112391819_45655742",
    "quoteId": "sf_imp_1788112391819_45655742",
    "quoteNumber": "QXT-2026-1000",
    "propertyName": "Lido Square - Pittsburg, CA",
    "clientName": "The Reliant Group",
    "address": "2131 Crestview Ln",
    "city": "Pittsburg",
    "state": "CA",
    "unitsCount": 173,
    "heroImage": "/src/assets/images/property_grand_horizon_1792605840266.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Nicole Franklin",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "SKBM"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Deal Won deployment synced from myquext.com. Field installation progressing on schedule across 173 units.",
    "startDate": "2026-10-09",
    "targetCompletionDate": "2026-11-11",
    "lastUpdated": "2026-09-02T14:44:29.234623Z",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 500.0,
        "description": ""
      }
    ],
    "installLogs": [
      {
        "id": "log-sf_imp-1",
        "projectId": "sf_imp_1788112391819_45655742",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SKBM Field Team (Hector Lopez)",
        "itemId": "bom-sf_imp-01",
        "itemName": "Activation and Deployment",
        "quantityCompleted": 1,
        "locationCompleted": "Lido Square - Pittsburg, CA — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Deal Won). Installed 1 of 1 Activation and Deployment.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-sf_imp-1",
        "projectId": "sf_imp_1788112391819_45655742",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Deal Won deployment synced from myquext.com. Field installation progressing on schedule across 173 units.",
        "isPinned": true
      },
      {
        "id": "note-sf_imp-2",
        "projectId": "sf_imp_1788112391819_45655742",
        "author": "Keenan Cheung",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Imported from Salesforce Opportunity: Lido Square - Pittsburg, CA",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-sf_imp-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-11"
      },
      {
        "id": "m-sf_imp-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-15"
      },
      {
        "id": "m-sf_imp-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-19"
      },
      {
        "id": "m-sf_imp-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-sf_imp-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-06"
      },
      {
        "id": "m-sf_imp-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-09"
      },
      {
        "id": "m-sf_imp-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-11"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "sf_imp_1788112877490_48123d5c",
    "quoteId": "sf_imp_1788112877490_48123d5c",
    "quoteNumber": "QXT-2026-1001",
    "propertyName": "Pinon Apartments -Davis, CA",
    "clientName": "TCC Properties",
    "address": "555 Guava Lane",
    "city": "Davis",
    "state": "CA",
    "unitsCount": 70,
    "heroImage": "/src/assets/images/property_kathryn_canals_1792605853194.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Jasmine Hunt",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "ATB"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Deal Won deployment synced from myquext.com. Field installation progressing on schedule across 70 units.",
    "startDate": "2026-10-08",
    "targetCompletionDate": "2026-11-12",
    "lastUpdated": "2026-09-02T14:44:29.121999Z",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Smart Communities IoT Service Fee Hub - Monthly",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "All Residential Units",
        "quantity": 72,
        "installedCount": 50,
        "unitPrice": 1250,
        "description": "In-unit smart access control software integration."
      },
      {
        "id": "bom-sf_imp-02",
        "name": "Monthly Licensing Fee - NFC Wallet Access",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 100,
        "installedCount": 56,
        "unitPrice": 220,
        "description": "Mobile credential NFC wallet pass (100 credentials per pack)."
      }
    ],
    "installLogs": [
      {
        "id": "log-sf_imp-1",
        "projectId": "sf_imp_1788112877490_48123d5c",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "ATB Field Team (Sean Gates)",
        "itemId": "bom-sf_imp-01",
        "itemName": "Smart Communities IoT Service Fee Hub - Monthly",
        "quantityCompleted": 50,
        "locationCompleted": "Pinon Apartments -Davis, CA — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Deal Won). Installed 50 of 72 Smart Communities IoT Service Fee Hub - Monthly.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-sf_imp-1",
        "projectId": "sf_imp_1788112877490_48123d5c",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Deal Won deployment synced from myquext.com. Field installation progressing on schedule across 70 units.",
        "isPinned": true
      },
      {
        "id": "note-sf_imp-2",
        "projectId": "sf_imp_1788112877490_48123d5c",
        "author": "Sydney Sanberg",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Imported from Salesforce Opportunity: Pinon Apartments -Davis, CA",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-sf_imp-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-10"
      },
      {
        "id": "m-sf_imp-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-14"
      },
      {
        "id": "m-sf_imp-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-18"
      },
      {
        "id": "m-sf_imp-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-sf_imp-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-07"
      },
      {
        "id": "m-sf_imp-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-10"
      },
      {
        "id": "m-sf_imp-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-12"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "sf_imp_1788203832004_a55d9ebb",
    "quoteId": "sf_imp_1788203832004_a55d9ebb",
    "quoteNumber": "QXT-2026-1002",
    "propertyName": "Agora Heights- Roy, UT",
    "clientName": "Rich Development",
    "address": "1952 W. 5450 S ST",
    "city": "Roy",
    "state": "UT",
    "unitsCount": 42,
    "heroImage": "/src/assets/images/property_parkside_craig_1792605865604.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Tessa Peshke",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "SBH"
    ],
    "statusTag": "Behind Schedule",
    "statusReason": "Installation pacing on Agora Heights- Roy, UT (42 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Rich Development.",
    "startDate": "2026-10-07",
    "targetCompletionDate": "2026-11-03",
    "lastUpdated": "2026-09-02T14:44:29.290591Z",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Gateway Quext IoT",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Hardware / Equipment",
        "quantity": 42,
        "installedCount": 12,
        "unitPrice": 90.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-03",
        "name": "Project Management",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-04",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 350.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-05",
        "name": "Pro Services Bronze",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 350.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-06",
        "name": "Smart Communities IoT Service Fee Hub - Monthly",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Hardware / Equipment",
        "quantity": 42,
        "installedCount": 12,
        "unitPrice": 3.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-07",
        "name": "Schlage BE467 Greenwich - Matte Black",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 42,
        "installedCount": 18,
        "unitPrice": 220.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      }
    ],
    "installLogs": [
      {
        "id": "log-sf_imp-1",
        "projectId": "sf_imp_1788203832004_a55d9ebb",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SBH Field Team (Hector Lopez)",
        "itemId": "bom-sf_imp-01",
        "itemName": "Gateway Quext IoT",
        "quantityCompleted": 0,
        "locationCompleted": "Agora Heights- Roy, UT — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Deal Won). Installed 0 of 1 Gateway Quext IoT.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-sf_imp-1",
        "projectId": "sf_imp_1788203832004_a55d9ebb",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Installation pacing on Agora Heights- Roy, UT (42 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Rich Development.",
        "isPinned": true
      },
      {
        "id": "note-sf_imp-2",
        "projectId": "sf_imp_1788203832004_a55d9ebb",
        "author": "Sydney Sanberg",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Imported from Salesforce Opportunity: Agora Heights- Roy, UT",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-sf_imp-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-09"
      },
      {
        "id": "m-sf_imp-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-13"
      },
      {
        "id": "m-sf_imp-3",
        "title": "Product Acquisition",
        "status": "In Progress",
        "targetDate": "2026-10-17"
      },
      {
        "id": "m-sf_imp-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-sf_imp-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-sf_imp-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-sf_imp-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-03"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "33om1u0TTgW3MYKO2FhH",
    "quoteId": "33om1u0TTgW3MYKO2FhH",
    "quoteNumber": "QXT-2026-1003",
    "propertyName": "Greenbrook Partners Pilot",
    "clientName": "Beacon Partners",
    "address": "100 Main Property Way",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 8,
    "heroImage": "/src/assets/images/property_domain_citycenter_1792605879144.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Branden Girman",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "Everbase"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Deal Won deployment synced from myquext.com. Field installation progressing on schedule across 8 units.",
    "startDate": "2026-10-06",
    "targetCompletionDate": "2026-11-14",
    "lastUpdated": "2026-10-20T20:20:19.762Z",
    "bomItems": [
      {
        "id": "bom-33om1u-01",
        "name": "LoRaWAN Bridge (Range Extension)",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 8,
        "installedCount": 8,
        "unitPrice": 125.0,
        "description": "Long-range LoRaWAN wireless bridge for extended property coverage across spread-out buildings."
      },
      {
        "id": "bom-33om1u-02",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-33om1u-03",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 2,
        "unitPrice": 199.0,
        "description": "Customized QR Plated Intercom "
      }
    ],
    "installLogs": [
      {
        "id": "log-33om1u-1",
        "projectId": "33om1u0TTgW3MYKO2FhH",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Everbase Field Team (Sean Gates)",
        "itemId": "bom-33om1u-01",
        "itemName": "LoRaWAN Bridge (Range Extension)",
        "quantityCompleted": 8,
        "locationCompleted": "Greenbrook Partners Pilot — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Deal Won). Installed 8 of 8 LoRaWAN Bridge (Range Extension).",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-33om1u-1",
        "projectId": "33om1u0TTgW3MYKO2FhH",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Deal Won deployment synced from myquext.com. Field installation progressing on schedule across 8 units.",
        "isPinned": true
      }
    ],
    "milestones": [
      {
        "id": "m-33om1u-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-08"
      },
      {
        "id": "m-33om1u-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-12"
      },
      {
        "id": "m-33om1u-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-16"
      },
      {
        "id": "m-33om1u-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-33om1u-5",
        "title": "Implementation",
        "status": "Completed",
        "targetDate": "2026-11-09"
      },
      {
        "id": "m-33om1u-6",
        "title": "CSM Handoff",
        "status": "In Progress",
        "targetDate": "2026-11-12"
      },
      {
        "id": "m-33om1u-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-14"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "FoYP0Bt5ZT969KsOfSsx",
    "quoteId": "FoYP0Bt5ZT969KsOfSsx",
    "quoteNumber": "QXT-2026-1004",
    "propertyName": "Westview at Irvine Spectrum",
    "clientName": "The Irvine Company",
    "address": "21100 Spectrum",
    "city": "Irvine",
    "state": "CA",
    "unitsCount": 583,
    "heroImage": "/src/assets/images/property_lumina_midtown_1792605892751.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Kennedy Staiger",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "JTS"
    ],
    "statusTag": "High Risk",
    "statusReason": "Critical path blocker on Westview at Irvine Spectrum (Irvine, CA): Total unit count (583) was taken directly from user input.",
    "startDate": "2026-10-05",
    "targetCompletionDate": "2026-10-25",
    "lastUpdated": "2026-09-30T20:54:35.246Z",
    "bomItems": [
      {
        "id": "bom-FoYP0B-01",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 583,
        "installedCount": 175,
        "unitPrice": 416.75,
        "description": "1 commercial interconnected deadbolt per unit entry door (single-motion emergency egress)."
      },
      {
        "id": "bom-FoYP0B-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 583,
        "installedCount": 93,
        "unitPrice": 125.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-FoYP0B-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 21,
        "installedCount": 6,
        "unitPrice": 150.0,
        "description": "Professional reconfiguration and system migration of existing Brivo access hardware into the Quext platform."
      },
      {
        "id": "bom-FoYP0B-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 584,
        "installedCount": 93,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ],
    "installLogs": [
      {
        "id": "log-FoYP0B-1",
        "projectId": "FoYP0Bt5ZT969KsOfSsx",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "JTS Field Team (Hector Lopez)",
        "itemId": "bom-FoYP0B-01",
        "itemName": "Schlage FE410 Interconnected Deadbolt",
        "quantityCompleted": 175,
        "locationCompleted": "Westview at Irvine Spectrum — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 175 of 583 Schlage FE410 Interconnected Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-FoYP0B-1",
        "projectId": "FoYP0Bt5ZT969KsOfSsx",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Critical path blocker on Westview at Irvine Spectrum (Irvine, CA): Total unit count (583) was taken directly from user input.",
        "isPinned": true
      },
      {
        "id": "note-FoYP0B-2",
        "projectId": "FoYP0Bt5ZT969KsOfSsx",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count (583) was taken directly from user input. Per-unit device counts (Locks, Thermostats, APs, Leak Detectors) are based on the provided total unit count.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-FoYP0B-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-07"
      },
      {
        "id": "m-FoYP0B-2",
        "title": "Portal Buildout",
        "status": "In Progress",
        "targetDate": "2026-10-11"
      },
      {
        "id": "m-FoYP0B-3",
        "title": "Product Acquisition",
        "status": "Upcoming",
        "targetDate": "2026-10-15"
      },
      {
        "id": "m-FoYP0B-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-FoYP0B-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-FoYP0B-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-FoYP0B-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-10-25"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "V8jLZAaCelxwRaUxmm1K",
    "quoteId": "V8jLZAaCelxwRaUxmm1K",
    "quoteNumber": "QXT-2026-1005",
    "propertyName": "The Right Angle",
    "clientName": "LV Collective",
    "address": "2700 East 5th Street",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 476,
    "heroImage": "/src/assets/images/property_palms_las_olas_1792605906247.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Nicole Franklin",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "RMR"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 476 units.",
    "startDate": "2026-10-04",
    "targetCompletionDate": "2026-11-16",
    "lastUpdated": "2026-10-06T20:43:58.177Z",
    "bomItems": [
      {
        "id": "bom-V8jLZA-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 476,
        "installedCount": 300,
        "unitPrice": 250.0,
        "description": "One lock per unit based on provided unit count."
      },
      {
        "id": "bom-V8jLZA-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 476,
        "installedCount": 233,
        "unitPrice": 150.0,
        "description": "One thermostat per unit; standard HVAC assumed."
      },
      {
        "id": "bom-V8jLZA-03",
        "name": "Access Control Readers",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 13,
        "installedCount": 8,
        "unitPrice": 794.26,
        "description": "Includes Main Entry, Fitness, Bike Room, Pool, Package Room, BOH, and 2 Vehicle Gates."
      },
      {
        "id": "bom-V8jLZA-04",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 2,
        "unitPrice": 150.0,
        "description": "For Lobby, Fitness Center, and Club/Lounge areas."
      },
      {
        "id": "bom-V8jLZA-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 476,
        "installedCount": 300,
        "unitPrice": 38.0,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-V8jLZA-06",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 26,
        "installedCount": 13,
        "unitPrice": 180,
        "description": "Includes Lobby, Amenities, Mail, Garage Entrances, and approx. 2 per Garage Level (7 levels) for safety."
      },
      {
        "id": "bom-V8jLZA-07",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 26,
        "installedCount": 16,
        "unitPrice": 700.0,
        "description": ""
      }
    ],
    "installLogs": [
      {
        "id": "log-V8jLZA-1",
        "projectId": "V8jLZAaCelxwRaUxmm1K",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "RMR Field Team (Sean Gates)",
        "itemId": "bom-V8jLZA-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 300,
        "locationCompleted": "The Right Angle — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 300 of 476 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-V8jLZA-1",
        "projectId": "V8jLZAaCelxwRaUxmm1K",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 476 units.",
        "isPinned": true
      },
      {
        "id": "note-V8jLZA-2",
        "projectId": "V8jLZAaCelxwRaUxmm1K",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Source of Unit Count: Confirmed 476 units from the 'East 5th RFP' document. Building Type: Mid-rise apartment community with a central parking structure.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-V8jLZA-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-06"
      },
      {
        "id": "m-V8jLZA-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-10"
      },
      {
        "id": "m-V8jLZA-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-14"
      },
      {
        "id": "m-V8jLZA-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-V8jLZA-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-11"
      },
      {
        "id": "m-V8jLZA-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-14"
      },
      {
        "id": "m-V8jLZA-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-16"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "El6ocIJcWg2MAUxEOLnf",
    "quoteId": "El6ocIJcWg2MAUxEOLnf",
    "quoteNumber": "QXT-2026-1006",
    "propertyName": "Apex Riverstone",
    "clientName": "Alpha Residential",
    "address": "Nashville Community Blvd",
    "city": "Nashville",
    "state": "Tennessee",
    "unitsCount": 456,
    "heroImage": "/src/assets/images/property_grand_horizon_1792605840266.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Jasmine Hunt",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "All Media"
    ],
    "statusTag": "Behind Schedule",
    "statusReason": "Installation pacing on Apex Riverstone (456 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Alpha Residential.",
    "startDate": "2026-10-03",
    "targetCompletionDate": "2026-11-07",
    "lastUpdated": "2026-08-10T16:46:00.978Z",
    "bomItems": [
      {
        "id": "bom-El6ocI-01",
        "name": "Schlage XE360 Mortise",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 223,
        "unitPrice": 500.48,
        "description": "Heavy-duty commercial wireless mortise lock for high-traffic amenity and entry doors."
      },
      {
        "id": "bom-El6ocI-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 160,
        "unitPrice": 150.0,
        "description": "1 smart thermostat per unit with integrated IoT hub. Coordinates wireless door locks and sensors."
      },
      {
        "id": "bom-El6ocI-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 35,
        "installedCount": 17,
        "unitPrice": 794.26,
        "description": "Estimated quantity based on architectural plans for exterior doors, amenities, and typical community ingress/egress points."
      },
      {
        "id": "bom-El6ocI-04",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 7,
        "unitPrice": 700.0,
        "description": "Estimated quantity to cover primary lobbies, pool deck, mail room, and fitness centers."
      },
      {
        "id": "bom-El6ocI-05",
        "name": "Video Intercom Access Control",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 1,
        "unitPrice": 1450,
        "description": "Estimated for main building entrances and primary leasing center approach."
      },
      {
        "id": "bom-El6ocI-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 456,
        "installedCount": 160,
        "unitPrice": 195,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      },
      {
        "id": "bom-El6ocI-07",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 223,
        "unitPrice": 192.44,
        "description": "1 wireless Wi-Fi water leak and freeze detector per unit (pack of 3 sensing cables). Direct Wi-Fi connection."
      },
      {
        "id": "bom-El6ocI-08",
        "name": "Resideo L2 WiFi Water Sensor and Switch",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 160,
        "unitPrice": 87.16,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-El6ocI-09",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 20,
        "installedCount": 10,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      },
      {
        "id": "bom-El6ocI-10",
        "name": "Aeotec Illumino Switch - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Bulk Managed Wi-Fi",
        "location": "Apartment Unit",
        "quantity": 456,
        "installedCount": 160,
        "unitPrice": 150.0,
        "description": "Pack of 4 smart wall switches (Z-Wave). Requires Quext Thermostat Hub for connectivity."
      }
    ],
    "installLogs": [
      {
        "id": "log-El6ocI-1",
        "projectId": "El6ocIJcWg2MAUxEOLnf",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "integrate Field Team (Hector Lopez)",
        "itemId": "bom-El6ocI-01",
        "itemName": "Schlage XE360 Mortise",
        "quantityCompleted": 223,
        "locationCompleted": "Apex Riverstone — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 223 of 456 Schlage XE360 Mortise.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-El6ocI-1",
        "projectId": "El6ocIJcWg2MAUxEOLnf",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Installation pacing on Apex Riverstone (456 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Alpha Residential.",
        "isPinned": true
      },
      {
        "id": "note-El6ocI-2",
        "projectId": "El6ocIJcWg2MAUxEOLnf",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: North Star Total: The provided user input of 456 units was used as the absolute truth for calculating in-unit requirements. OFF-SWITCH Architecture: All 456 In-Unit Wi-Fi 7 APs are assumed to connect directly to the in-unit Google Fiber ONTs. Switch ports have NOT been allocated for residential units.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-El6ocI-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-05"
      },
      {
        "id": "m-El6ocI-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-09"
      },
      {
        "id": "m-El6ocI-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-13"
      },
      {
        "id": "m-El6ocI-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "In Progress",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-El6ocI-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-11-02"
      },
      {
        "id": "m-El6ocI-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-05"
      },
      {
        "id": "m-El6ocI-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-07"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "vzP34ZLqePwXnEVBK2b0",
    "quoteId": "vzP34ZLqePwXnEVBK2b0",
    "quoteNumber": "QXT-2026-1007",
    "propertyName": "Satellite Square",
    "clientName": "Brand Properties",
    "address": "2789 Satellite Blvd",
    "city": "Duluth",
    "state": "Georgia",
    "unitsCount": 347,
    "heroImage": "/src/assets/images/property_kathryn_canals_1792605853194.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Tessa Peshke",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "SKBM"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 347 units.",
    "startDate": "2026-10-02",
    "targetCompletionDate": "2026-11-18",
    "lastUpdated": "2026-06-03T02:44:27.345Z",
    "bomItems": [
      {
        "id": "bom-vzP34Z-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 347,
        "installedCount": 347,
        "unitPrice": 204.52,
        "description": "1 standard smart lock allocated per unit entry door."
      },
      {
        "id": "bom-vzP34Z-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 347,
        "installedCount": 298,
        "unitPrice": 150.0,
        "description": "does this work??"
      },
      {
        "id": "bom-vzP34Z-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 18,
        "installedCount": 18,
        "unitPrice": 358.8,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 347,
        "installedCount": 298,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-vzP34Z-05",
        "name": "Aeotec Leak Sensor - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 694,
        "installedCount": 694,
        "unitPrice": 43.76,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-06",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 7,
        "unitPrice": 358.8,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-07",
        "name": "Eagle Eye Security Cameras - DB13",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 9,
        "installedCount": 9,
        "unitPrice": 425.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-08",
        "name": "Eagle Eye Security Cameras - DD11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 27,
        "installedCount": 23,
        "unitPrice": 425.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-09",
        "name": "Eagle Eye Security Cameras - DB14",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 2,
        "unitPrice": 1150.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-10",
        "name": "Eagle Eye Bridge",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 4000.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-11",
        "name": "12\" ButterflyMX Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 5000.0,
        "description": ""
      },
      {
        "id": "bom-vzP34Z-12",
        "name": "Access Controll Installation & Ancillary Hardware",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 220,
        "description": "Install Access Control based on 27 (2 @ gate) door locations (Includes Labor and Ancillary hardware, wiring, and locking hardware)"
      },
      {
        "id": "bom-vzP34Z-13",
        "name": "Video Camera Installation & Ancillary Hardware",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 180,
        "description": "Install CCTV System based on 37 locations ( Includes wiring and Ancillary hardware )"
      }
    ],
    "installLogs": [
      {
        "id": "log-vzP34Z-1",
        "projectId": "vzP34ZLqePwXnEVBK2b0",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SKBM Field Team (Sean Gates)",
        "itemId": "bom-vzP34Z-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 347,
        "locationCompleted": "Satellite Square — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 347 of 347 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-vzP34Z-1",
        "projectId": "vzP34ZLqePwXnEVBK2b0",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 347 units.",
        "isPinned": true
      },
      {
        "id": "note-vzP34Z-2",
        "projectId": "vzP34ZLqePwXnEVBK2b0",
        "author": "Danielle Finley",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total Unit Count established as 355 based directly on User Input. Per-Unit Technology (OFF-SWITCH): 1 Wi-Fi 7 Unit AP allocated per unit (355 total). These connect directly to the in-unit Fiber ONT. No switch ports were calculated for these APs.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-vzP34Z-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-04"
      },
      {
        "id": "m-vzP34Z-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-08"
      },
      {
        "id": "m-vzP34Z-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-12"
      },
      {
        "id": "m-vzP34Z-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-vzP34Z-5",
        "title": "Implementation",
        "status": "Completed",
        "targetDate": "2026-11-13"
      },
      {
        "id": "m-vzP34Z-6",
        "title": "CSM Handoff",
        "status": "In Progress",
        "targetDate": "2026-11-16"
      },
      {
        "id": "m-vzP34Z-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-18"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "4FbLToKBWCIoIIluD3lT",
    "quoteId": "4FbLToKBWCIoIIluD3lT",
    "quoteNumber": "QXT-2026-1008",
    "propertyName": "Paradise Valley",
    "clientName": "Lifetime Living",
    "address": "1290 N Tatum Blvd",
    "city": "Phoenix",
    "state": "Arizona",
    "unitsCount": 327,
    "heroImage": "/src/assets/images/property_parkside_craig_1792605865604.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Branden Girman",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "ATB"
    ],
    "statusTag": "High Risk",
    "statusReason": "Critical path blocker on Paradise Valley (Phoenix, Arizona): Used user-supplied 'Notes' for all specific hardware counts (Locks, Readers, APs).",
    "startDate": "2026-10-01",
    "targetCompletionDate": "2026-10-24",
    "lastUpdated": "2026-10-12T18:16:04.518Z",
    "bomItems": [
      {
        "id": "bom-4FbLTo-01",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 334,
        "installedCount": 87,
        "unitPrice": 479.84,
        "description": "327 Units + 7 Spares (User Input)."
      },
      {
        "id": "bom-4FbLTo-02",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 57,
        "installedCount": 7,
        "unitPrice": 663.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-4FbLTo-03",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 63,
        "installedCount": 16,
        "unitPrice": 435.75,
        "description": "Wireless smart cylindrical lockset for resident units and student bedrooms. Supports mobile credentials and remote management."
      },
      {
        "id": "bom-4FbLTo-04",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 97,
        "installedCount": 12,
        "unitPrice": 229.71,
        "description": "Taking into account additional access in units."
      },
      {
        "id": "bom-4FbLTo-05",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 9,
        "installedCount": 2,
        "unitPrice": 707.44,
        "description": "Wireless commercial exit device trim for common area egress doors, fitness centers, and perimeter exits."
      },
      {
        "id": "bom-4FbLTo-06",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "One-Time Quext Fees",
        "quantity": 327,
        "installedCount": 39,
        "unitPrice": 30.0,
        "description": "Device programming, cloud portal configuration, and backend account initialization."
      },
      {
        "id": "bom-4FbLTo-07",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "One-Time Quext Fees",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      },
      {
        "id": "bom-4FbLTo-08",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "One-Time Quext Fees",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2000.0,
        "description": "Dedicated project management: Vendor liaison, remote install support, trade coordination, and milestone tracking."
      }
    ],
    "installLogs": [
      {
        "id": "log-4FbLTo-1",
        "projectId": "4FbLToKBWCIoIIluD3lT",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "ATB Field Team (Hector Lopez)",
        "itemId": "bom-4FbLTo-01",
        "itemName": "Schlage FE410 Interconnected Deadbolt",
        "quantityCompleted": 87,
        "locationCompleted": "Paradise Valley — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 87 of 334 Schlage FE410 Interconnected Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-4FbLTo-1",
        "projectId": "4FbLToKBWCIoIIluD3lT",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Critical path blocker on Paradise Valley (Phoenix, Arizona): Used user-supplied 'Notes' for all specific hardware counts (Locks, Readers, APs).",
        "isPinned": true
      },
      {
        "id": "note-4FbLTo-2",
        "projectId": "4FbLToKBWCIoIIluD3lT",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Used user-supplied 'Notes' for all specific hardware counts (Locks, Readers, APs). Allocated all 46 User-Defined Amenity APs to 'Indoor Common' category; no specific outdoor breakdown provided.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-4FbLTo-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-03"
      },
      {
        "id": "m-4FbLTo-2",
        "title": "Portal Buildout",
        "status": "In Progress",
        "targetDate": "2026-10-07"
      },
      {
        "id": "m-4FbLTo-3",
        "title": "Product Acquisition",
        "status": "Upcoming",
        "targetDate": "2026-10-11"
      },
      {
        "id": "m-4FbLTo-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-4FbLTo-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-4FbLTo-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-4FbLTo-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-10-24"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "l6MiufxI8YCEnEiFa8rM",
    "quoteId": "l6MiufxI8YCEnEiFa8rM",
    "quoteNumber": "QXT-2026-1009",
    "propertyName": "The Motley",
    "clientName": "ipb Properties",
    "address": "1401 Church Street",
    "city": "Nashville",
    "state": "Tennessee",
    "unitsCount": 326,
    "heroImage": "/src/assets/images/property_domain_citycenter_1792605879144.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Kennedy Staiger",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "SBH"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 326 units.",
    "startDate": "2026-09-30",
    "targetCompletionDate": "2026-11-20",
    "lastUpdated": "2026-07-06T20:29:24.219Z",
    "bomItems": [
      {
        "id": "bom-l6Miuf-01",
        "name": "Schlage XE360 Mortise",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 326,
        "installedCount": 254,
        "unitPrice": 500.48,
        "description": ""
      },
      {
        "id": "bom-l6Miuf-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 326,
        "installedCount": 209,
        "unitPrice": 177.27,
        "description": "1 per unit."
      },
      {
        "id": "bom-l6Miuf-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 12,
        "unitPrice": 794.26,
        "description": "Subject to review. This is an estimated count for main entrances, amenities, and garage elevators."
      },
      {
        "id": "bom-l6Miuf-04",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 19,
        "unitPrice": 700.0,
        "description": "Subject to review. This is an estimated count based on review of building plans."
      },
      {
        "id": "bom-l6Miuf-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 326,
        "installedCount": 254,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs. Wi-Fi 7 AP coverage in all amenity and staff spaces."
      },
      {
        "id": "bom-l6Miuf-06",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 6,
        "installedCount": 4,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      },
      {
        "id": "bom-l6Miuf-07",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 10,
        "installedCount": 8,
        "unitPrice": 195,
        "description": "Optional parking garage Wi-Fi 6 APs"
      },
      {
        "id": "bom-l6Miuf-08",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 30,
        "installedCount": 19,
        "unitPrice": 180,
        "description": "Optional 7 day Camera Recording."
      }
    ],
    "installLogs": [
      {
        "id": "log-l6Miuf-1",
        "projectId": "l6MiufxI8YCEnEiFa8rM",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SBH Field Team (Sean Gates)",
        "itemId": "bom-l6Miuf-01",
        "itemName": "Schlage XE360 Mortise",
        "quantityCompleted": 254,
        "locationCompleted": "The Motley — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 254 of 326 Schlage XE360 Mortise.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-l6Miuf-1",
        "projectId": "l6MiufxI8YCEnEiFa8rM",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 326 units.",
        "isPinned": true
      },
      {
        "id": "note-l6Miuf-2",
        "projectId": "l6MiufxI8YCEnEiFa8rM",
        "author": "Danielle Finley",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Source of Truth: User input 'Total Units: 326' used as the master unit count. Excluded 80 APs located in Residential Hallways and Elevator Lobbies (Levels 6-25) per 'Negative Constraint' instructions.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-l6Miuf-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-02"
      },
      {
        "id": "m-l6Miuf-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-06"
      },
      {
        "id": "m-l6Miuf-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-10"
      },
      {
        "id": "m-l6Miuf-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-l6Miuf-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-15"
      },
      {
        "id": "m-l6Miuf-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-18"
      },
      {
        "id": "m-l6Miuf-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-20"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "sf_imp_1787679493344_91676b8e",
    "quoteId": "sf_imp_1787679493344_91676b8e",
    "quoteNumber": "QXT-2026-1010",
    "propertyName": "The Exchange",
    "clientName": "Lifetime Living",
    "address": "1021 Social Street",
    "city": "Raleigh",
    "state": "NC",
    "unitsCount": 289,
    "heroImage": "/src/assets/images/property_lumina_midtown_1792605892751.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Nicole Franklin",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "Everbase"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 289 units.",
    "startDate": "2026-09-29",
    "targetCompletionDate": "2026-11-21",
    "lastUpdated": "2026-09-03T17:26:00.817Z",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Custom Hardware Product",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common & Amenity Spaces",
        "quantity": 18,
        "installedCount": 15,
        "unitPrice": 707.44,
        "description": "The XE360 Wireless Exit Trim for perimeter & common areas. Quext adds keyless entry and remote management without the cost of wired readers."
      },
      {
        "id": "bom-sf_imp-02",
        "name": "RC15",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common & Amenity Spaces",
        "quantity": 26,
        "installedCount": 19,
        "unitPrice": 663.0,
        "description": "The RC15 wall mount is a next-generation IP reader controller designed for scalable and flexible real-time access control in perimeter and high security applications. The all-in-one device leverages the comprehensive ecosystem from Schlage "
      },
      {
        "id": "bom-sf_imp-03",
        "name": "Schlage FE410F Greenwich - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Apartment Units",
        "quantity": 289,
        "installedCount": 249,
        "unitPrice": 479.84,
        "description": "1 interconnected deadbolt per unit entry door."
      },
      {
        "id": "bom-sf_imp-04",
        "name": "Schlage XE360 Tubular - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Common & Amenity Spaces",
        "quantity": 33,
        "installedCount": 24,
        "unitPrice": 435.75,
        "description": "Battery powered wireless tubular lock. Quext adds keyless mobile entry and remote \"No-Tour\" management, with or without a Quext smart hub."
      },
      {
        "id": "bom-sf_imp-05",
        "name": "Honeywell T6",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Units",
        "quantity": 289,
        "installedCount": 249,
        "unitPrice": 140.0,
        "description": "1 Wi-Fi smart thermostat per unit."
      },
      {
        "id": "bom-sf_imp-06",
        "name": "Schlage Key Fobs (50-pack)",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 300.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-07",
        "name": "Schlage Enrollment Reader (MT20)",
        "model": "SCH-MT20",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 831.0,
        "description": "Credential enrollment reader for staff credential programming."
      },
      {
        "id": "bom-sf_imp-08",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software & Services",
        "quantity": 289,
        "installedCount": 208,
        "unitPrice": 195,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      }
    ],
    "installLogs": [
      {
        "id": "log-sf_imp-1",
        "projectId": "sf_imp_1787679493344_91676b8e",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Everbase Field Team (Hector Lopez)",
        "itemId": "bom-sf_imp-01",
        "itemName": "Custom Hardware Product",
        "quantityCompleted": 15,
        "locationCompleted": "The Exchange — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 15 of 18 Custom Hardware Product.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-sf_imp-1",
        "projectId": "sf_imp_1787679493344_91676b8e",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 289 units.",
        "isPinned": true
      },
      {
        "id": "note-sf_imp-2",
        "projectId": "sf_imp_1787679493344_91676b8e",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Imported from Salesforce Opportunity: Lifetime Living Residential - Raleigh",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-sf_imp-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-01"
      },
      {
        "id": "m-sf_imp-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-05"
      },
      {
        "id": "m-sf_imp-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-09"
      },
      {
        "id": "m-sf_imp-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-sf_imp-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-16"
      },
      {
        "id": "m-sf_imp-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-19"
      },
      {
        "id": "m-sf_imp-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-21"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "uRQX5qZn76fdQ4uTnce2",
    "quoteId": "uRQX5qZn76fdQ4uTnce2",
    "quoteNumber": "QXT-2026-1011",
    "propertyName": "The Holly",
    "clientName": "Beacon Partners",
    "address": "3710 Erskine St, Lubbock, TX 79415",
    "city": "Lubbock",
    "state": "TX",
    "unitsCount": 288,
    "heroImage": "/src/assets/images/property_palms_las_olas_1792605906247.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Jasmine Hunt",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "JTS"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 288 units.",
    "startDate": "2026-09-28",
    "targetCompletionDate": "2026-11-22",
    "lastUpdated": "2026-09-30T01:29:53.239551Z",
    "bomItems": [
      {
        "id": "bom-uRQX5q-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 3,
        "installedCount": 2,
        "unitPrice": 2500.0,
        "description": "The slim Schlage RC11 wired IP reader for narrow door frames. Get real-time, high-security access control managed by the Quext platform."
      },
      {
        "id": "bom-uRQX5q-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 288,
        "installedCount": 161,
        "unitPrice": 180.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-uRQX5q-03",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 288,
        "installedCount": 202,
        "unitPrice": 120.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-uRQX5q-04",
        "name": "Aeotec Leak Sensor - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 288,
        "installedCount": 161,
        "unitPrice": 40.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-uRQX5q-05",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 288,
        "installedCount": 202,
        "unitPrice": 20.0,
        "description": "1 Z-Wave leak sensor per unit."
      },
      {
        "id": "bom-uRQX5q-06",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": "Training and Onboarding, one-time cost"
      },
      {
        "id": "bom-uRQX5q-07",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": "Project Management Fee"
      },
      {
        "id": "bom-uRQX5q-08",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 3,
        "unitPrice": 1517.0,
        "description": "The RC15 wall mount is a next-generation IP reader controller designed for scalable and flexible real-time access control in perimeter and high security applications. The all-in-one device leverages the comprehensive ecosystem from Schlage "
      },
      {
        "id": "bom-uRQX5q-09",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 4,
        "unitPrice": 516.05,
        "description": "The RC15 wall mount is a next-generation IP reader controller designed for scalable and flexible real-time access control in perimeter and high security applications. The all-in-one device leverages the comprehensive ecosystem from Schlage "
      }
    ],
    "installLogs": [
      {
        "id": "log-uRQX5q-1",
        "projectId": "uRQX5qZn76fdQ4uTnce2",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Taylor Williams Field Team (Sean Gates)",
        "itemId": "bom-uRQX5q-01",
        "itemName": "Quext Gateway",
        "quantityCompleted": 2,
        "locationCompleted": "The Holly — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 2 of 3 Quext Gateway.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-uRQX5q-1",
        "projectId": "uRQX5qZn76fdQ4uTnce2",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 288 units.",
        "isPinned": true
      },
      {
        "id": "note-uRQX5q-2",
        "projectId": "uRQX5qZn76fdQ4uTnce2",
        "author": "Taylor Williams",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count (288) was provided by user input. Property identified as Student Housing. A 25% uplift was applied to the in-unit AP count (288 * 1.25 = 360) and locks are calculated per-bedroom.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-uRQX5q-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-30"
      },
      {
        "id": "m-uRQX5q-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-04"
      },
      {
        "id": "m-uRQX5q-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-08"
      },
      {
        "id": "m-uRQX5q-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-uRQX5q-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-17"
      },
      {
        "id": "m-uRQX5q-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-20"
      },
      {
        "id": "m-uRQX5q-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-22"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "uOZllnZpCNzPoUFWjpUr",
    "quoteId": "uOZllnZpCNzPoUFWjpUr",
    "quoteNumber": "QXT-2026-1012",
    "propertyName": "The Bowery at Old Fourth Ward",
    "clientName": "Related Companies",
    "address": "495 Highland Avenue Northeast",
    "city": "Atlanta",
    "state": "GA",
    "unitsCount": 285,
    "heroImage": "/src/assets/images/property_grand_horizon_1792605840266.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Tessa Peshke",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "RMR"
    ],
    "statusTag": "Behind Schedule",
    "statusReason": "Installation pacing on The Bowery at Old Fourth Ward (285 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Related Companies.",
    "startDate": "2026-09-27",
    "targetCompletionDate": "2026-11-03",
    "lastUpdated": "2026-10-06T00:55:05.374Z",
    "bomItems": [
      {
        "id": "bom-uOZlln-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 292,
        "installedCount": 123,
        "unitPrice": 252.68,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-uOZlln-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 292,
        "installedCount": 82,
        "unitPrice": 205.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-uOZlln-03",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 285,
        "installedCount": 120,
        "unitPrice": 225.0,
        "description": "Quext Thermostat 2.0"
      },
      {
        "id": "bom-uOZlln-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 4,
        "unitPrice": 588.34,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-uOZlln-05",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 33,
        "installedCount": 14,
        "unitPrice": 700.0,
        "description": "Standard Bullet"
      },
      {
        "id": "bom-uOZlln-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 285,
        "installedCount": 80,
        "unitPrice": 45.0,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      }
    ],
    "installLogs": [
      {
        "id": "log-uOZlln-1",
        "projectId": "uOZllnZpCNzPoUFWjpUr",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "RMR Field Team (Hector Lopez)",
        "itemId": "bom-uOZlln-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 123,
        "locationCompleted": "The Bowery at Old Fourth Ward — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 123 of 292 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-uOZlln-1",
        "projectId": "uOZllnZpCNzPoUFWjpUr",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Installation pacing on The Bowery at Old Fourth Ward (285 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Related Companies.",
        "isPinned": true
      },
      {
        "id": "note-uOZlln-2",
        "projectId": "uOZllnZpCNzPoUFWjpUr",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count (285) was carried over from the initial user-provided data, as a Unit Mix schedule was not present in the provided telecom plans. All Common Area APs, Security Cameras, and Access Control Readers are based on explicit counts of symbols on the provided telecom floor plans.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-uOZlln-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-29"
      },
      {
        "id": "m-uOZlln-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-03"
      },
      {
        "id": "m-uOZlln-3",
        "title": "Product Acquisition",
        "status": "In Progress",
        "targetDate": "2026-10-07"
      },
      {
        "id": "m-uOZlln-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-uOZlln-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-uOZlln-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-uOZlln-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-03"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "ZWILZNFVojNB0J4zADEo",
    "quoteId": "ZWILZNFVojNB0J4zADEo",
    "quoteNumber": "QXT-2026-1013",
    "propertyName": "Raleigh",
    "clientName": "Consigli",
    "address": "1021 Social Street",
    "city": "Raleigh",
    "state": "North Carolina",
    "unitsCount": 271,
    "heroImage": "/src/assets/images/property_kathryn_canals_1792605853194.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Branden Girman",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "All Media"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 271 units.",
    "startDate": "2026-09-26",
    "targetCompletionDate": "2026-11-24",
    "lastUpdated": "2026-07-06T20:27:47.819Z",
    "bomItems": [
      {
        "id": "bom-ZWILZN-01",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 271,
        "installedCount": 260,
        "unitPrice": 123.5,
        "description": "Per user notes."
      },
      {
        "id": "bom-ZWILZN-02",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 271,
        "installedCount": 222,
        "unitPrice": 399.22,
        "description": "Per user notes (FE410)."
      },
      {
        "id": "bom-ZWILZN-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 29,
        "unitPrice": 1300.0,
        "description": "Per user notes. Requires PoE switch port."
      },
      {
        "id": "bom-ZWILZN-04",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 34,
        "installedCount": 28,
        "unitPrice": 450.0,
        "description": "Per user notes. Wireless/Battery common area locks."
      },
      {
        "id": "bom-ZWILZN-05",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 15,
        "unitPrice": 700.0,
        "description": "Per user notes. Wireless/Battery common area locks."
      },
      {
        "id": "bom-ZWILZN-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 271,
        "installedCount": 222,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-ZWILZN-07",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 4,
        "installedCount": 4,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      }
    ],
    "installLogs": [
      {
        "id": "log-ZWILZN-1",
        "projectId": "ZWILZNFVojNB0J4zADEo",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "All Media Field Team (Sean Gates)",
        "itemId": "bom-ZWILZN-01",
        "itemName": "Smart Thermostat",
        "quantityCompleted": 260,
        "locationCompleted": "Raleigh — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 260 of 271 Smart Thermostat.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-ZWILZN-1",
        "projectId": "ZWILZNFVojNB0J4zADEo",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 271 units.",
        "isPinned": true
      },
      {
        "id": "note-ZWILZN-2",
        "projectId": "ZWILZNFVojNB0J4zADEo",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Used user input for Total Units (271) and specific device counts (Thermostats, Locks, Readers). Estimated AP count for '20 amenity spaces' as 16 Indoor and 4 Outdoor APs.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-ZWILZN-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-28"
      },
      {
        "id": "m-ZWILZN-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-02"
      },
      {
        "id": "m-ZWILZN-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-06"
      },
      {
        "id": "m-ZWILZN-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-ZWILZN-5",
        "title": "Implementation",
        "status": "Completed",
        "targetDate": "2026-11-19"
      },
      {
        "id": "m-ZWILZN-6",
        "title": "CSM Handoff",
        "status": "In Progress",
        "targetDate": "2026-11-22"
      },
      {
        "id": "m-ZWILZN-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-24"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "Svgce0Av4QZ2HVfY4byI",
    "quoteId": "Svgce0Av4QZ2HVfY4byI",
    "quoteNumber": "QXT-2026-1014",
    "propertyName": "Richmond Heights",
    "clientName": "Lifetime Living",
    "address": "1120 S Brentwood BLVD",
    "city": "Richmond Heights",
    "state": "Missouri",
    "unitsCount": 263,
    "heroImage": "/src/assets/images/property_parkside_craig_1792605865604.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Kennedy Staiger",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "SKBM"
    ],
    "statusTag": "High Risk",
    "statusReason": "Critical path blocker on Richmond Heights (Richmond Heights, Missouri): CRITICAL ZIP CODE CONSTRAINT APPLIED: Property is located in 63117 (outside GFiber service area). All Wi-Fi 7 hardware substituted with generic Wi-Fi 6 Managed Access Points.",
    "startDate": "2026-09-25",
    "targetCompletionDate": "2026-10-25",
    "lastUpdated": "2026-09-03T17:26:00.801Z",
    "bomItems": [
      {
        "id": "bom-Svgce0-01",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 263,
        "installedCount": 79,
        "unitPrice": 548.5,
        "description": "Per user notes (FE410)."
      },
      {
        "id": "bom-Svgce0-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 263,
        "installedCount": 42,
        "unitPrice": 140.0,
        "description": "Per user notes."
      },
      {
        "id": "bom-Svgce0-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 28,
        "installedCount": 8,
        "unitPrice": 1300.0,
        "description": ""
      },
      {
        "id": "bom-Svgce0-04",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 5,
        "unitPrice": 498.0,
        "description": ""
      },
      {
        "id": "bom-Svgce0-05",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 4,
        "unitPrice": 700.0,
        "description": "Per user notes."
      },
      {
        "id": "bom-Svgce0-06",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      }
    ],
    "installLogs": [
      {
        "id": "log-Svgce0-1",
        "projectId": "Svgce0Av4QZ2HVfY4byI",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SKBM Field Team (Hector Lopez)",
        "itemId": "bom-Svgce0-01",
        "itemName": "Schlage FE410 Interconnected Deadbolt",
        "quantityCompleted": 79,
        "locationCompleted": "Richmond Heights — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 79 of 263 Schlage FE410 Interconnected Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-Svgce0-1",
        "projectId": "Svgce0Av4QZ2HVfY4byI",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Critical path blocker on Richmond Heights (Richmond Heights, Missouri): CRITICAL ZIP CODE CONSTRAINT APPLIED: Property is located in 63117 (outside GFiber service area). All Wi-Fi 7 hardware substituted with generic Wi-Fi 6 Managed Access Points.",
        "isPinned": true
      },
      {
        "id": "note-Svgce0-2",
        "projectId": "Svgce0Av4QZ2HVfY4byI",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: CRITICAL ZIP CODE CONSTRAINT APPLIED: Property is located in 63117 (outside GFiber service area). All Wi-Fi 7 hardware substituted with generic Wi-Fi 6 Managed Access Points. CRITICAL ZIP CODE CONSTRAINT APPLIED: 'Quext powered by Google Fiber' branding removed. Substituted with generic smart community head-end and standard PoE+ switching.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-Svgce0-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-27"
      },
      {
        "id": "m-Svgce0-2",
        "title": "Portal Buildout",
        "status": "In Progress",
        "targetDate": "2026-10-01"
      },
      {
        "id": "m-Svgce0-3",
        "title": "Product Acquisition",
        "status": "Upcoming",
        "targetDate": "2026-10-05"
      },
      {
        "id": "m-Svgce0-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-Svgce0-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-Svgce0-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-Svgce0-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-10-25"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "dYgCqmkyQLw6hQleF1xW",
    "quoteId": "dYgCqmkyQLw6hQleF1xW",
    "quoteNumber": "QXT-2026-1015",
    "propertyName": "Oak Springs",
    "clientName": "IQ Envelop",
    "address": "2900 Oak Springs Drive",
    "city": "Austin",
    "state": "Texas",
    "unitsCount": 250,
    "heroImage": "/src/assets/images/property_domain_citycenter_1792605879144.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Nicole Franklin",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "ATB"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 250 units.",
    "startDate": "2026-09-24",
    "targetCompletionDate": "2026-11-26",
    "lastUpdated": "2026-07-06T20:28:26.463Z",
    "bomItems": [
      {
        "id": "bom-dYgCqm-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 158,
        "unitPrice": 275.0,
        "description": "1 per unit entry door, based on Total Units provided and unit plans."
      },
      {
        "id": "bom-dYgCqm-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 123,
        "unitPrice": 205.0,
        "description": "1 per unit, based on Total Units provided and unit plans."
      },
      {
        "id": "bom-dYgCqm-03",
        "name": "Structured Media Enclosures",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Unit",
        "quantity": 250,
        "installedCount": 158,
        "unitPrice": 180,
        "description": "1 per unit, as shown on sheet T400."
      },
      {
        "id": "bom-dYgCqm-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 43,
        "installedCount": 21,
        "unitPrice": 1300.0,
        "description": "Counted at amenity, staff, exterior, and key access doors across all floors."
      },
      {
        "id": "bom-dYgCqm-05",
        "name": "Eagle Eye Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 26,
        "installedCount": 16,
        "unitPrice": 700.0,
        "description": "Counted at key locations in lobbies, amenities, parking areas, and corridors."
      },
      {
        "id": "bom-dYgCqm-06",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 2,
        "unitPrice": 205.0,
        "description": "Estimated for major amenity areas (Leasing, Co-working, Fitness, Lounges). Verify locations."
      },
      {
        "id": "bom-dYgCqm-07",
        "name": "Vehicle Gate Access Control",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Outdoor Areas",
        "quantity": 2,
        "installedCount": 1,
        "unitPrice": 220,
        "description": "Based on card readers shown at two parking gates on plans."
      },
      {
        "id": "bom-dYgCqm-08",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 6,
        "installedCount": 3,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for wifi6OutdoorCommonAP"
      },
      {
        "id": "bom-dYgCqm-09",
        "name": "2.5G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 16,
        "installedCount": 10,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches2_5G"
      },
      {
        "id": "bom-dYgCqm-10",
        "name": "1G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 5,
        "installedCount": 2,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches1G"
      },
      {
        "id": "bom-dYgCqm-11",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 12,
        "installedCount": 8,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for optionalWifi6GarageAP"
      },
      {
        "id": "bom-dYgCqm-12",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Quext Services",
        "quantity": 250,
        "installedCount": 123,
        "unitPrice": 205.0,
        "description": ""
      }
    ],
    "installLogs": [
      {
        "id": "log-dYgCqm-1",
        "projectId": "dYgCqmkyQLw6hQleF1xW",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "ATB Field Team (Sean Gates)",
        "itemId": "bom-dYgCqm-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 158,
        "locationCompleted": "Oak Springs — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 158 of 250 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-dYgCqm-1",
        "projectId": "dYgCqmkyQLw6hQleF1xW",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 250 units.",
        "isPinned": true
      },
      {
        "id": "note-dYgCqm-2",
        "projectId": "dYgCqmkyQLw6hQleF1xW",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: No information on interior wall construction was provided. If high-attenuation materials (e.g., concrete) are used, a professional on-site RF survey is strongly recommended to validate Wi-Fi AP quantities. The list of areas requiring technology coverage was derived solely from the provided architectural plans. Please confirm this list is comprehensive and aligns with client expectations.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-dYgCqm-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-26"
      },
      {
        "id": "m-dYgCqm-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-09-30"
      },
      {
        "id": "m-dYgCqm-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-04"
      },
      {
        "id": "m-dYgCqm-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-dYgCqm-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-21"
      },
      {
        "id": "m-dYgCqm-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-24"
      },
      {
        "id": "m-dYgCqm-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-26"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "UKhDCIc67oxrSHWlg9Z2",
    "quoteId": "UKhDCIc67oxrSHWlg9Z2",
    "quoteNumber": "QXT-2026-1016",
    "propertyName": "Inspire Apartments",
    "clientName": "The Dawson Company",
    "address": "ZIERDT ROAD",
    "city": "Huntsville",
    "state": "Alabama",
    "unitsCount": 237,
    "heroImage": "/src/assets/images/property_lumina_midtown_1792605892751.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Jasmine Hunt",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "SBH"
    ],
    "statusTag": "Behind Schedule",
    "statusReason": "Installation pacing on Inspire Apartments (237 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with The Dawson Company.",
    "startDate": "2026-09-23",
    "targetCompletionDate": "2026-11-07",
    "lastUpdated": "2026-09-29T21:36:00.330Z",
    "bomItems": [
      {
        "id": "bom-UKhDCI-01",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 237,
        "installedCount": 116,
        "unitPrice": 40.0,
        "description": ""
      }
    ],
    "installLogs": [
      {
        "id": "log-UKhDCI-1",
        "projectId": "UKhDCIc67oxrSHWlg9Z2",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SBH Field Team (Hector Lopez)",
        "itemId": "bom-UKhDCI-01",
        "itemName": "GFiber Managed Wifi",
        "quantityCompleted": 116,
        "locationCompleted": "Inspire Apartments — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 116 of 237 GFiber Managed Wifi.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-UKhDCI-1",
        "projectId": "UKhDCIc67oxrSHWlg9Z2",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Installation pacing on Inspire Apartments (237 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with The Dawson Company.",
        "isPinned": true
      },
      {
        "id": "note-UKhDCI-2",
        "projectId": "UKhDCIc67oxrSHWlg9Z2",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Unit Mix Analysis: Identified 10 3-Bedroom units (Types C1, C2) requiring 2 APs each. Remaining 227 units allocated 1 AP. Bldg 1000/2000 C-Units: 1 stack each x 3 floors = 6 units.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-UKhDCI-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-25"
      },
      {
        "id": "m-UKhDCI-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-09-29"
      },
      {
        "id": "m-UKhDCI-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-03"
      },
      {
        "id": "m-UKhDCI-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "In Progress",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-UKhDCI-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-11-02"
      },
      {
        "id": "m-UKhDCI-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-05"
      },
      {
        "id": "m-UKhDCI-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-07"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "d6dlnqGvrAPlk9ws7Q5b",
    "quoteId": "d6dlnqGvrAPlk9ws7Q5b",
    "quoteNumber": "QXT-2026-1017",
    "propertyName": "Canvas",
    "clientName": "Hunt Midwest",
    "address": "8036 Metcalf Ave",
    "city": "Overland Park",
    "state": "KS",
    "unitsCount": 227,
    "heroImage": "/src/assets/images/property_palms_las_olas_1792605906247.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Tessa Peshke",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "Everbase"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 227 units.",
    "startDate": "2026-09-22",
    "targetCompletionDate": "2026-11-28",
    "lastUpdated": "2026-09-30T01:29:49.213311Z",
    "bomItems": [
      {
        "id": "bom-d6dlnq-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 237,
        "installedCount": 237,
        "unitPrice": 225.0,
        "description": "does this work??"
      },
      {
        "id": "bom-d6dlnq-02",
        "name": "Passage handle",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Unit",
        "quantity": 227,
        "installedCount": 195,
        "unitPrice": 40.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-03",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 232,
        "installedCount": 232,
        "unitPrice": 150.0,
        "description": "does this work??"
      },
      {
        "id": "bom-d6dlnq-04",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 30,
        "installedCount": 26,
        "unitPrice": 770.73,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-05",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 10,
        "unitPrice": 676.03,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-06",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 2,
        "unitPrice": 770.73,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-07",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 70,
        "installedCount": 70,
        "unitPrice": 500.0,
        "description": "Battery powered wireless tubular lock. Quext adds keyless mobile entry and remote \"No-Tour\" management, with or without a Quext smart hub."
      },
      {
        "id": "bom-d6dlnq-08",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 3,
        "unitPrice": 199.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-09",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 3,
        "unitPrice": 2500.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-10",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 227,
        "installedCount": 195,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-d6dlnq-11",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 1500.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-12",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-13",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 1500.0,
        "description": ""
      },
      {
        "id": "bom-d6dlnq-14",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 152,
        "installedCount": 131,
        "unitPrice": 225.0,
        "description": "Comes in packs of 3. Wireless, battery-operated water leak and freeze detector. Features a 5ft sensing cable to detect leaks along its entire length and sends alerts via WiFi without requiring a separate hub."
      },
      {
        "id": "bom-d6dlnq-15",
        "name": "Resideo L5 Water Actuator 3/4 in",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 227,
        "installedCount": 227,
        "unitPrice": 300.0,
        "description": ""
      }
    ],
    "installLogs": [
      {
        "id": "log-d6dlnq-1",
        "projectId": "d6dlnqGvrAPlk9ws7Q5b",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Everbase Field Team (Sean Gates)",
        "itemId": "bom-d6dlnq-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 237,
        "locationCompleted": "Canvas — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 237 of 237 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-d6dlnq-1",
        "projectId": "d6dlnqGvrAPlk9ws7Q5b",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 227 units.",
        "isPinned": true
      },
      {
        "id": "note-d6dlnq-2",
        "projectId": "d6dlnqGvrAPlk9ws7Q5b",
        "author": "Gavin Iversen",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: North Star unit count (226) provided directly via user input. Sheet A700 (Door Schedule) was referenced in the drawing notes but not provided in the text. Reader and camera counts are estimated based on standard multi-family coverage.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-d6dlnq-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-24"
      },
      {
        "id": "m-d6dlnq-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-09-28"
      },
      {
        "id": "m-d6dlnq-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-02"
      },
      {
        "id": "m-d6dlnq-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-d6dlnq-5",
        "title": "Implementation",
        "status": "Completed",
        "targetDate": "2026-11-23"
      },
      {
        "id": "m-d6dlnq-6",
        "title": "CSM Handoff",
        "status": "In Progress",
        "targetDate": "2026-11-26"
      },
      {
        "id": "m-d6dlnq-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-28"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "44czMfxkVuByIVAuuwVk",
    "quoteId": "44czMfxkVuByIVAuuwVk",
    "quoteNumber": "QXT-2026-1018",
    "propertyName": "Macedonia",
    "clientName": "DeWitt Carolinas",
    "address": "2801 Macedonia Road",
    "city": "Cary",
    "state": "North Carolina",
    "unitsCount": 226,
    "heroImage": "/src/assets/images/property_grand_horizon_1792605840266.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Branden Girman",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "JTS"
    ],
    "statusTag": "High Risk",
    "statusReason": "Critical path blocker on Macedonia (Cary, North Carolina): Used exact hardware counts provided in notes (FE410, XE360, XE Tubular, RCs).",
    "startDate": "2026-09-21",
    "targetCompletionDate": "2026-10-24",
    "lastUpdated": "2026-09-03T15:42:35.515Z",
    "bomItems": [
      {
        "id": "bom-44czMf-01",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 226,
        "installedCount": 59,
        "unitPrice": 136.36,
        "description": "1 per unit as requested."
      },
      {
        "id": "bom-44czMf-02",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 226,
        "installedCount": 27,
        "unitPrice": 479.84,
        "description": "Unit entry hardware as specified in notes."
      },
      {
        "id": "bom-44czMf-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 24,
        "installedCount": 6,
        "unitPrice": 605.15,
        "description": "Wired access control points (Requires PoE)."
      },
      {
        "id": "bom-44czMf-04",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 2,
        "unitPrice": 707.44,
        "description": "Specified in notes (Wireless)."
      },
      {
        "id": "bom-44czMf-05",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 25,
        "installedCount": 7,
        "unitPrice": 435.75,
        "description": "Specified in notes (Wireless)."
      },
      {
        "id": "bom-44czMf-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 226,
        "installedCount": 27,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-44czMf-07",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Network Infrastructure",
        "quantity": 4,
        "installedCount": 1,
        "unitPrice": 195,
        "description": "Outdoor common area Wi-Fi 6 APs"
      }
    ],
    "installLogs": [
      {
        "id": "log-44czMf-1",
        "projectId": "44czMfxkVuByIVAuuwVk",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "JTS Field Team (Hector Lopez)",
        "itemId": "bom-44czMf-01",
        "itemName": "Smart Thermostat",
        "quantityCompleted": 59,
        "locationCompleted": "Macedonia — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 59 of 226 Smart Thermostat.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-44czMf-1",
        "projectId": "44czMfxkVuByIVAuuwVk",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Critical path blocker on Macedonia (Cary, North Carolina): Used exact hardware counts provided in notes (FE410, XE360, XE Tubular, RCs).",
        "isPinned": true
      },
      {
        "id": "note-44czMf-2",
        "projectId": "44czMfxkVuByIVAuuwVk",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Used exact hardware counts provided in notes (FE410, XE360, XE Tubular, RCs). Used user-specified coverage count of 22 for Amenity APs; split 18 Indoor / 4 Outdoor.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-44czMf-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-23"
      },
      {
        "id": "m-44czMf-2",
        "title": "Portal Buildout",
        "status": "In Progress",
        "targetDate": "2026-09-27"
      },
      {
        "id": "m-44czMf-3",
        "title": "Product Acquisition",
        "status": "Upcoming",
        "targetDate": "2026-10-01"
      },
      {
        "id": "m-44czMf-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-44czMf-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-44czMf-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-44czMf-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-10-24"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "egVQ7U0YEivd9swwccVB",
    "quoteId": "egVQ7U0YEivd9swwccVB",
    "quoteNumber": "QXT-2026-1019",
    "propertyName": "Mitchell Mills",
    "clientName": "DeWitt Carolinas",
    "address": "3805 Mitchell Mills Road",
    "city": "Raleigh",
    "state": "North Carolina",
    "unitsCount": 216,
    "heroImage": "/src/assets/images/property_kathryn_canals_1792605853194.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Kennedy Staiger",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "RMR"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 216 units.",
    "startDate": "2026-09-20",
    "targetCompletionDate": "2026-11-30",
    "lastUpdated": "2026-09-03T15:42:10.506Z",
    "bomItems": [
      {
        "id": "bom-egVQ7U-01",
        "name": "Schlage FE410 Interconnected Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 216,
        "installedCount": 168,
        "unitPrice": 399.22,
        "description": "1 per unit as specified in notes."
      },
      {
        "id": "bom-egVQ7U-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 216,
        "installedCount": 138,
        "unitPrice": 123.5,
        "description": "1 per unit as specified in notes."
      },
      {
        "id": "bom-egVQ7U-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 22,
        "installedCount": 17,
        "unitPrice": 1300.0,
        "description": "Requires wired network connection."
      },
      {
        "id": "bom-egVQ7U-04",
        "name": "Schlage XE360 Exit Trim",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 4,
        "unitPrice": 700.0,
        "description": "Common area smart lock."
      },
      {
        "id": "bom-egVQ7U-05",
        "name": "Schlage XE360 Tubular",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 16,
        "installedCount": 12,
        "unitPrice": 450.0,
        "description": "Interior/Passage locks."
      },
      {
        "id": "bom-egVQ7U-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 216,
        "installedCount": 138,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      }
    ],
    "installLogs": [
      {
        "id": "log-egVQ7U-1",
        "projectId": "egVQ7U0YEivd9swwccVB",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "RMR Field Team (Sean Gates)",
        "itemId": "bom-egVQ7U-01",
        "itemName": "Schlage FE410 Interconnected Deadbolt",
        "quantityCompleted": 168,
        "locationCompleted": "Mitchell Mills — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 168 of 216 Schlage FE410 Interconnected Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-egVQ7U-1",
        "projectId": "egVQ7U0YEivd9swwccVB",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 216 units.",
        "isPinned": true
      },
      {
        "id": "note-egVQ7U-2",
        "projectId": "egVQ7U0YEivd9swwccVB",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: North Star: Used explicit user input of 216 Total Units. Allocated 20 Indoor Common Area APs based on the note 'About 20 amenity spaces need coverage'.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-egVQ7U-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-22"
      },
      {
        "id": "m-egVQ7U-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-09-26"
      },
      {
        "id": "m-egVQ7U-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-09-30"
      },
      {
        "id": "m-egVQ7U-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-egVQ7U-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-25"
      },
      {
        "id": "m-egVQ7U-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-28"
      },
      {
        "id": "m-egVQ7U-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-30"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "kIn4eb4LZvfluuTSOFag",
    "quoteId": "kIn4eb4LZvfluuTSOFag",
    "quoteNumber": "QXT-2026-1020",
    "propertyName": "Renner 87",
    "clientName": "Price Partners",
    "address": "8601 Renner Blvd",
    "city": "Lenexa",
    "state": "Kansas",
    "unitsCount": 215,
    "heroImage": "/src/assets/images/property_parkside_craig_1792605865604.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Nicole Franklin",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "All Media"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 215 units.",
    "startDate": "2026-09-19",
    "targetCompletionDate": "2026-12-01",
    "lastUpdated": "2026-07-06T20:29:19.283Z",
    "bomItems": [
      {
        "id": "bom-kIn4eb-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 215,
        "installedCount": 185,
        "unitPrice": 266.68,
        "description": "1 per unit (Standard entry)."
      },
      {
        "id": "bom-kIn4eb-02",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 215,
        "installedCount": 155,
        "unitPrice": 123.5,
        "description": "1 per unit (Standard)."
      },
      {
        "id": "bom-kIn4eb-03",
        "name": "Security Cameras",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 17,
        "unitPrice": 700.0,
        "description": "Estimated coverage for Lobbies, Amenities, Pool, and Building Entries."
      },
      {
        "id": "bom-kIn4eb-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 7,
        "unitPrice": 794.26,
        "description": "Estimated for Main Entries, Amenity Doors, and Garage pedestrian access."
      },
      {
        "id": "bom-kIn4eb-05",
        "name": "Smart Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 2,
        "unitPrice": 1450,
        "description": "1 per main building entrance vestibule (Bldg 1 & Bldg 2)."
      },
      {
        "id": "bom-kIn4eb-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 215,
        "installedCount": 155,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-kIn4eb-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 20,
        "installedCount": 17,
        "unitPrice": 180,
        "description": "Dependency for Eagle Eye Security Cameras"
      }
    ],
    "installLogs": [
      {
        "id": "log-kIn4eb-1",
        "projectId": "kIn4eb4LZvfluuTSOFag",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "All Media Field Team (Hector Lopez)",
        "itemId": "bom-kIn4eb-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 185,
        "locationCompleted": "Renner 87 — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 185 of 215 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-kIn4eb-1",
        "projectId": "kIn4eb4LZvfluuTSOFag",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 215 units.",
        "isPinned": true
      },
      {
        "id": "note-kIn4eb-2",
        "projectId": "kIn4eb4LZvfluuTSOFag",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Unit Mix Verification: Used 'Multi-Family Building Load Analysis' on Sheet E303 to identify 8 three-bedroom units (Type C1) which require 2 APs. All other units (1-2 Bed) allocated 1 AP. Common Area APs: Allocated based on 'Lighting Allowance' notes indicating amenity spaces: Leasing, Club Room (B1 L1), Gym, Spa, WeWork Space (B2 L2), and Skydeck (B2 L5).",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-kIn4eb-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-21"
      },
      {
        "id": "m-kIn4eb-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-09-25"
      },
      {
        "id": "m-kIn4eb-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-09-29"
      },
      {
        "id": "m-kIn4eb-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-kIn4eb-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-26"
      },
      {
        "id": "m-kIn4eb-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-29"
      },
      {
        "id": "m-kIn4eb-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-12-01"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "UWmoFTaQM2SCy5rVOR4F",
    "quoteId": "UWmoFTaQM2SCy5rVOR4F",
    "quoteNumber": "QXT-2026-1021",
    "propertyName": "One Lady Bird",
    "clientName": "Related Companies",
    "address": "151 South 1st Street",
    "city": "Austin",
    "state": "TX",
    "unitsCount": 197,
    "heroImage": "/src/assets/images/property_domain_citycenter_1792605879144.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Jasmine Hunt",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "SKBM"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 197 units.",
    "startDate": "2026-09-18",
    "targetCompletionDate": "2026-12-02",
    "lastUpdated": "2026-09-30T14:08:08.823Z",
    "bomItems": [
      {
        "id": "bom-UWmoFT-01",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 197,
        "installedCount": 138,
        "unitPrice": 35.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ],
    "installLogs": [
      {
        "id": "log-UWmoFT-1",
        "projectId": "UWmoFTaQM2SCy5rVOR4F",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SKBM Field Team (Sean Gates)",
        "itemId": "bom-UWmoFT-01",
        "itemName": "GFiber Managed Wifi",
        "quantityCompleted": 138,
        "locationCompleted": "One Lady Bird — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 138 of 197 GFiber Managed Wifi.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-UWmoFT-1",
        "projectId": "UWmoFTaQM2SCy5rVOR4F",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 197 units.",
        "isPinned": true
      },
      {
        "id": "note-UWmoFT-2",
        "projectId": "UWmoFTaQM2SCy5rVOR4F",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: The total unit count of 197 is based on direct user instruction, overriding the 208 multifamily units listed in the Site Vehicle Parking Table on sheet SP-2022-0438C. The scope is strictly limited to the 197 apartment units; the 101 condo units are excluded per user instruction.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-UWmoFT-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-20"
      },
      {
        "id": "m-UWmoFT-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-09-24"
      },
      {
        "id": "m-UWmoFT-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-09-28"
      },
      {
        "id": "m-UWmoFT-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-UWmoFT-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-27"
      },
      {
        "id": "m-UWmoFT-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-30"
      },
      {
        "id": "m-UWmoFT-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-12-02"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "nIhr7SLZS1uJuf6KAWqf",
    "quoteId": "nIhr7SLZS1uJuf6KAWqf",
    "quoteNumber": "QXT-2026-1022",
    "propertyName": "Flashcube Apartments",
    "clientName": "Worcester Investments",
    "address": "701 Main Street",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 184,
    "heroImage": "/src/assets/images/property_lumina_midtown_1792605892751.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Tessa Peshke",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "ATB"
    ],
    "statusTag": "Behind Schedule",
    "statusReason": "Installation pacing on Flashcube Apartments (184 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Worcester Investments.",
    "startDate": "2026-09-17",
    "targetCompletionDate": "2026-11-03",
    "lastUpdated": "2026-07-06T20:29:41.391Z",
    "bomItems": [
      {
        "id": "bom-nIhr7S-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 184,
        "installedCount": 77,
        "unitPrice": 220,
        "description": "Schlage locks already exist and would just need converted to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-nIhr7S-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 184,
        "installedCount": 52,
        "unitPrice": 165,
        "description": "does this work??"
      },
      {
        "id": "bom-nIhr7S-03",
        "name": "Brivo Integration & Migration",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 10,
        "installedCount": 4,
        "unitPrice": 220,
        "description": "Estimate for key common entry points: Main Entry, Loading Dock, Fitness Centers (x2), Coworking Space, Package Room, and Basement amenities."
      },
      {
        "id": "bom-nIhr7S-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 14,
        "installedCount": 4,
        "unitPrice": 180,
        "description": "Recommended coverage for Main Entrance, Lobby, Loading Dock, Sports Court/Plaza areas, Fitness Centers, and perimeter."
      },
      {
        "id": "bom-nIhr7S-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 184,
        "installedCount": 77,
        "unitPrice": 195,
        "description": "- 3 Gig symmetrical over a wired connection\n- Up to 1 Gig with Wi-Fi 7\n- GFiber covers the Access Point upgrade\n- Seamless property wide Wi-Fi coverage"
      }
    ],
    "installLogs": [
      {
        "id": "log-nIhr7S-1",
        "projectId": "nIhr7SLZS1uJuf6KAWqf",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "ATB Field Team (Hector Lopez)",
        "itemId": "bom-nIhr7S-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 77,
        "locationCompleted": "Flashcube Apartments — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 77 of 184 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-nIhr7S-1",
        "projectId": "nIhr7SLZS1uJuf6KAWqf",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Installation pacing on Flashcube Apartments (184 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Worcester Investments.",
        "isPinned": true
      },
      {
        "id": "note-nIhr7S-2",
        "projectId": "nIhr7SLZS1uJuf6KAWqf",
        "author": "Jasmine Hunt",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: North Star Unit Count: 184 (Based on User-Provided Count in Project Details). STRATEGIC VALUE: This is a 'Managed WiFi+' solution. The 'Property-wide WiFi Coverage' in this BOM (enabled by 207 total APs) delivers 'Instant On' service, seamless resident roaming, and a property-wide guest network.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-nIhr7S-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-19"
      },
      {
        "id": "m-nIhr7S-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-09-23"
      },
      {
        "id": "m-nIhr7S-3",
        "title": "Product Acquisition",
        "status": "In Progress",
        "targetDate": "2026-09-27"
      },
      {
        "id": "m-nIhr7S-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-nIhr7S-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-nIhr7S-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-nIhr7S-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-03"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "vWnYmEUJNnJdWNG43Z7c",
    "quoteId": "vWnYmEUJNnJdWNG43Z7c",
    "quoteNumber": "QXT-2026-1023",
    "propertyName": "Mission Encore",
    "clientName": "Sunflower Development",
    "address": "5400 Martway St",
    "city": "Mission",
    "state": "Kansas",
    "unitsCount": 180,
    "heroImage": "/src/assets/images/property_palms_las_olas_1792605906247.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Branden Girman",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "SBH"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 180 units.",
    "startDate": "2026-09-16",
    "targetCompletionDate": "2026-12-04",
    "lastUpdated": "2026-10-23T16:51:33.845Z",
    "bomItems": [
      {
        "id": "bom-vWnYmE-01",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 25,
        "installedCount": 24,
        "unitPrice": 1300.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      },
      {
        "id": "bom-vWnYmE-02",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 4,
        "installedCount": 3,
        "unitPrice": 1300.0,
        "description": "For high-traffic perimeters, the Schlage RCK15 wired IP reader. Get real-time control and Card + PIN security, managed by the Quext platform."
      },
      {
        "id": "bom-vWnYmE-03",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 2,
        "unitPrice": 750.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-vWnYmE-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Quext Services",
        "quantity": 180,
        "installedCount": 148,
        "unitPrice": 195,
        "description": ""
      },
      {
        "id": "bom-vWnYmE-05",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 180,
        "installedCount": 173,
        "unitPrice": 118.75,
        "description": "Automatically added as a dependency for Apartment Unit IoT Control."
      },
      {
        "id": "bom-vWnYmE-06",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 180,
        "installedCount": 148,
        "unitPrice": 281.21,
        "description": "does this work??"
      },
      {
        "id": "bom-vWnYmE-07",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 220.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-vWnYmE-08",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Quext Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-vWnYmE-09",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Quext Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-vWnYmE-10",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Quext Services",
        "quantity": 211,
        "installedCount": 173,
        "unitPrice": 30.0,
        "description": ""
      },
      {
        "id": "bom-vWnYmE-11",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 199.0,
        "description": ""
      }
    ],
    "installLogs": [
      {
        "id": "log-vWnYmE-1",
        "projectId": "vWnYmEUJNnJdWNG43Z7c",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Tray Johnson Field Team (Sean Gates)",
        "itemId": "bom-vWnYmE-01",
        "itemName": "Schlage Electrified Reader - RC15",
        "quantityCompleted": 24,
        "locationCompleted": "Mission Encore — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 24 of 25 Schlage Electrified Reader - RC15.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-vWnYmE-1",
        "projectId": "vWnYmEUJNnJdWNG43Z7c",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 180 units.",
        "isPinned": true
      },
      {
        "id": "note-vWnYmE-2",
        "projectId": "vWnYmEUJNnJdWNG43Z7c",
        "author": "Gavin Iversen",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: The total unit count of 180 was determined by the user-provided value, which is the primary source of truth. Assumed the presence of standard amenities not explicitly detailed on the floor plan, such as a leasing office, fitness center, and package room, for a comprehensive quote.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-vWnYmE-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-18"
      },
      {
        "id": "m-vWnYmE-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-09-22"
      },
      {
        "id": "m-vWnYmE-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-09-26"
      },
      {
        "id": "m-vWnYmE-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-vWnYmE-5",
        "title": "Implementation",
        "status": "Completed",
        "targetDate": "2026-11-29"
      },
      {
        "id": "m-vWnYmE-6",
        "title": "CSM Handoff",
        "status": "In Progress",
        "targetDate": "2026-12-02"
      },
      {
        "id": "m-vWnYmE-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-12-04"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "niIRWifT4ZAENi7MIHcv",
    "quoteId": "niIRWifT4ZAENi7MIHcv",
    "quoteNumber": "QXT-2026-1024",
    "propertyName": "Mission Lanes",
    "clientName": "Sunflower Development",
    "address": "5399 Martway St",
    "city": "Mission",
    "state": "Kansas",
    "unitsCount": 176,
    "heroImage": "/src/assets/images/property_grand_horizon_1792605840266.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Kennedy Staiger",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "Everbase"
    ],
    "statusTag": "High Risk",
    "statusReason": "Critical path blocker on Mission Lanes (Mission, Kansas): The Total Unit Count of 176 was determined based on the user-provided count (Priority 1).",
    "startDate": "2026-09-15",
    "targetCompletionDate": "2026-10-25",
    "lastUpdated": "2026-10-12T16:03:52.572Z",
    "bomItems": [
      {
        "id": "bom-niIRWi-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 176,
        "installedCount": 53,
        "unitPrice": 220,
        "description": "Mission Lanes already has Schlage Deadbolt locks. This would be a transition from the Homebase platform to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-niIRWi-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 176,
        "installedCount": 28,
        "unitPrice": 165,
        "description": "Mission Lanes already has Honeywell t6 thermostats. This would be a transition from the Homebase platform to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-niIRWi-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 17,
        "installedCount": 5,
        "unitPrice": 1450,
        "description": "Mission Lanes already has Schlage Readers. This would be a transition from the Homebase platform to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-niIRWi-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 15,
        "installedCount": 2,
        "unitPrice": 180,
        "description": "Mission Lanes already has Security Cameras. This would be a transition from the Homebase platform to the new Quext powered by GFiber platform."
      },
      {
        "id": "bom-niIRWi-05",
        "name": "GFiber Outdoor Wi-Fi 6 AP",
        "model": "CAM-XV2-2T",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 2,
        "installedCount": 1,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for wifi6OutdoorCommonAP"
      },
      {
        "id": "bom-niIRWi-06",
        "name": "2.5G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 9,
        "installedCount": 1,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches2_5G"
      },
      {
        "id": "bom-niIRWi-07",
        "name": "1G PoE Switch",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 3,
        "installedCount": 1,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for switches1G"
      },
      {
        "id": "bom-niIRWi-08",
        "name": "GFiber Garage Wi-Fi 6 AP",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Google Fiber Network Hardware",
        "quantity": 8,
        "installedCount": 1,
        "unitPrice": 195,
        "description": "From Wi-Fi BOM analysis for optionalWifi6GarageAP"
      },
      {
        "id": "bom-niIRWi-09",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Miscellaneous",
        "quantity": 176,
        "installedCount": 53,
        "unitPrice": 118.75,
        "description": "Automatically added as a dependency for Apartment Unit IoT Control."
      },
      {
        "id": "bom-niIRWi-10",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Quext Services",
        "quantity": 179,
        "installedCount": 29,
        "unitPrice": 195,
        "description": ""
      }
    ],
    "installLogs": [
      {
        "id": "log-niIRWi-1",
        "projectId": "niIRWifT4ZAENi7MIHcv",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Everbase Field Team (Hector Lopez)",
        "itemId": "bom-niIRWi-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 53,
        "locationCompleted": "Mission Lanes — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 53 of 176 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-niIRWi-1",
        "projectId": "niIRWifT4ZAENi7MIHcv",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Critical path blocker on Mission Lanes (Mission, Kansas): The Total Unit Count of 176 was determined based on the user-provided count (Priority 1).",
        "isPinned": true
      },
      {
        "id": "note-niIRWi-2",
        "projectId": "niIRWifT4ZAENi7MIHcv",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: The Total Unit Count of 176 was determined based on the user-provided count (Priority 1). FLAG: No architectural plans were provided. All common area quantities (Access Control, Cameras, Wi-Fi APs, Thermostats) are estimates based on a typical Class A property of this size. A full review of plans is required for a final BOM.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-niIRWi-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-17"
      },
      {
        "id": "m-niIRWi-2",
        "title": "Portal Buildout",
        "status": "In Progress",
        "targetDate": "2026-09-21"
      },
      {
        "id": "m-niIRWi-3",
        "title": "Product Acquisition",
        "status": "Upcoming",
        "targetDate": "2026-09-25"
      },
      {
        "id": "m-niIRWi-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-niIRWi-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-niIRWi-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-niIRWi-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-10-25"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "ky1QGq36MzwlJvKMzlaT",
    "quoteId": "ky1QGq36MzwlJvKMzlaT",
    "quoteNumber": "QXT-2026-1025",
    "propertyName": "Mills Crossing",
    "clientName": "Cortland Management",
    "address": "3133 Burlington Mills Road",
    "city": "Wake Forest",
    "state": "NC",
    "unitsCount": 144,
    "heroImage": "/src/assets/images/property_kathryn_canals_1792605853194.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Nicole Franklin",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "JTS"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 144 units.",
    "startDate": "2026-10-09",
    "targetCompletionDate": "2026-11-11",
    "lastUpdated": "2026-10-20T19:30:22.276Z",
    "bomItems": [
      {
        "id": "bom-ky1QGq-01",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 144,
        "installedCount": 91,
        "unitPrice": 252.68,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-ky1QGq-02",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 144,
        "installedCount": 71,
        "unitPrice": 150.0,
        "description": "Basic Access Control Management with Quext Resident and Property Manager App."
      },
      {
        "id": "bom-ky1QGq-03",
        "name": "Schlage Electrified Reader - RC15",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 5,
        "installedCount": 3,
        "unitPrice": 1517.0,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      },
      {
        "id": "bom-ky1QGq-04",
        "name": "EEN - Standard Bullet Security Camera - DB11",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 4,
        "unitPrice": 700.0,
        "description": "The RC15 wall mount is a next-generation IP reader controller designed for scalable and flexible real-time access control in perimeter and high security applications. The all-in-one device leverages the comprehensive ecosystem from Schlage "
      },
      {
        "id": "bom-ky1QGq-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 144,
        "installedCount": 91,
        "unitPrice": 195,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      },
      {
        "id": "bom-ky1QGq-06",
        "name": "Standard Video",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 180,
        "description": "60-day local retention, remote live view, standard motion alerts, unified dashboard."
      }
    ],
    "installLogs": [
      {
        "id": "log-ky1QGq-1",
        "projectId": "ky1QGq36MzwlJvKMzlaT",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "JTS Field Team (Sean Gates)",
        "itemId": "bom-ky1QGq-01",
        "itemName": "In-Unit Smart Lock",
        "quantityCompleted": 91,
        "locationCompleted": "Mills Crossing — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 91 of 144 In-Unit Smart Lock.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-ky1QGq-1",
        "projectId": "ky1QGq36MzwlJvKMzlaT",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 144 units.",
        "isPinned": true
      },
      {
        "id": "note-ky1QGq-2",
        "projectId": "ky1QGq36MzwlJvKMzlaT",
        "author": "Michael Mays",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: CRITICAL: Total unit count updated to 188, based on the Site Plan (Sheet A0.1, 'PROPOSED NUMBER OF MULTI-FAMILY UNITS'), overriding the initial user input of 144. In-unit device counts (APs, Locks, Thermostats, Leak Detectors) are based on a 1:1 ratio with the updated 188 unit count. Detailed unit plans were not available for analysis of larger units that might require additional APs.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-ky1QGq-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-11"
      },
      {
        "id": "m-ky1QGq-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-15"
      },
      {
        "id": "m-ky1QGq-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-19"
      },
      {
        "id": "m-ky1QGq-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-ky1QGq-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-06"
      },
      {
        "id": "m-ky1QGq-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-09"
      },
      {
        "id": "m-ky1QGq-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-11"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "0SD2YXBmJXWZa1qM7Rk4",
    "quoteId": "0SD2YXBmJXWZa1qM7Rk4",
    "quoteNumber": "QXT-2026-1026",
    "propertyName": "The Interurban Building",
    "clientName": "Lincoln Property Company",
    "address": "1500 Jackson Street",
    "city": "Dallas",
    "state": "TX",
    "unitsCount": 134,
    "heroImage": "/src/assets/images/property_parkside_craig_1792605865604.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Jasmine Hunt",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "RMR"
    ],
    "statusTag": "Behind Schedule",
    "statusReason": "Installation pacing on The Interurban Building (134 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Lincoln Property Company.",
    "startDate": "2026-10-08",
    "targetCompletionDate": "2026-11-07",
    "lastUpdated": "2026-10-05T17:34:11.263Z",
    "bomItems": [
      {
        "id": "bom-0SD2YX-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 136,
        "installedCount": 67,
        "unitPrice": 225.0,
        "description": "1 lock per unit entry door. +2 for storage locker."
      },
      {
        "id": "bom-0SD2YX-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 168,
        "installedCount": 59,
        "unitPrice": 125.0,
        "description": "1 thermostat per unit. 25 units have 2 thermostats. 9 Common area."
      },
      {
        "id": "bom-0SD2YX-03",
        "name": "Brivo Bluetooth Single Gang Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 21,
        "installedCount": 10,
        "unitPrice": 1750.0,
        "description": "Based on site survey, taking over existing HID reader wiring."
      },
      {
        "id": "bom-0SD2YX-04",
        "name": "Aeotec Leak Sensor - Zwave",
        "model": "AEO-ZW-LK",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 134,
        "installedCount": 47,
        "unitPrice": 60.0,
        "description": "1 Z-Wave leak sensor per unit."
      }
    ],
    "installLogs": [
      {
        "id": "log-0SD2YX-1",
        "projectId": "0SD2YXBmJXWZa1qM7Rk4",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "iTech Monitoring Field Team (Hector Lopez)",
        "itemId": "bom-0SD2YX-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 67,
        "locationCompleted": "The Interurban Building — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 67 of 136 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-0SD2YX-1",
        "projectId": "0SD2YXBmJXWZa1qM7Rk4",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Installation pacing on The Interurban Building (134 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Lincoln Property Company.",
        "isPinned": true
      },
      {
        "id": "note-0SD2YX-2",
        "projectId": "0SD2YXBmJXWZa1qM7Rk4",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count of 134 was confirmed from user input and the plan cover sheet. In-unit AP count (134) is based on a 1:1 ratio with the unit count. Assumes no units are over 2000 sq. ft. or 3+ bedrooms, which would require an additional AP.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-0SD2YX-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-10"
      },
      {
        "id": "m-0SD2YX-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-14"
      },
      {
        "id": "m-0SD2YX-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-18"
      },
      {
        "id": "m-0SD2YX-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "In Progress",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-0SD2YX-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-11-02"
      },
      {
        "id": "m-0SD2YX-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-05"
      },
      {
        "id": "m-0SD2YX-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-07"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "KgU6WfWMmU7fR7UxgED8",
    "quoteId": "KgU6WfWMmU7fR7UxgED8",
    "quoteNumber": "QXT-2026-1027",
    "propertyName": "3538 Lake Eastbrook",
    "clientName": "SW Realestate",
    "address": "3538 Lake Eastbrook",
    "city": "Grand Rapids",
    "state": "MI",
    "unitsCount": 132,
    "heroImage": "/src/assets/images/property_domain_citycenter_1792605879144.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Tessa Peshke",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "All Media"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 132 units.",
    "startDate": "2026-10-07",
    "targetCompletionDate": "2026-11-13",
    "lastUpdated": "2026-10-23T13:40:21.398Z",
    "bomItems": [
      {
        "id": "bom-KgU6Wf-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Network Infrastructure",
        "quantity": 2,
        "installedCount": 2,
        "unitPrice": 2500.0,
        "description": "Installed included with Unit Lock and Unit Thermostat combo.\n\nMain head-end IoT controller for the property."
      },
      {
        "id": "bom-KgU6Wf-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 132,
        "installedCount": 114,
        "unitPrice": 225.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-KgU6Wf-03",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 132,
        "installedCount": 132,
        "unitPrice": 155.0,
        "description": "Vandal-resistant indoor/outdoor dome security camera for amenity areas, fitness centers, and perimeter coverage."
      },
      {
        "id": "bom-KgU6Wf-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 1000.0,
        "description": "60-day local retention, remote live view, standard motion alerts, unified dashboard."
      },
      {
        "id": "bom-KgU6Wf-05",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 19,
        "installedCount": 19,
        "unitPrice": 675.0,
        "description": "50-pack of high-security Schlage thin multi-technology RFID key fobs."
      },
      {
        "id": "bom-KgU6Wf-06",
        "name": "Eagle Eye Security Cameras - DD08",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 12,
        "installedCount": 10,
        "unitPrice": 1172.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-KgU6Wf-07",
        "name": "Standard Video",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 12,
        "installedCount": 12,
        "unitPrice": 180,
        "description": "Store digital keys in  Google Wallet™ or Apple Wallet® for simple, tap-to-unlock access—even if your phone is dead."
      },
      {
        "id": "bom-KgU6Wf-08",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-KgU6Wf-09",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-KgU6Wf-10",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 132,
        "installedCount": 114,
        "unitPrice": 35.0,
        "description": "Programming cost from Quext Channel Partner"
      },
      {
        "id": "bom-KgU6Wf-11",
        "name": "Schlage Multi-technology fob thin - 50 pack",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 6,
        "unitPrice": 500.0,
        "description": "Slim profile IP reader controller for narrow door frames, glass mullions, and gates."
      }
    ],
    "installLogs": [
      {
        "id": "log-KgU6Wf-1",
        "projectId": "KgU6WfWMmU7fR7UxgED8",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "All Media Field Team (Sean Gates)",
        "itemId": "bom-KgU6Wf-01",
        "itemName": "Quext Gateway",
        "quantityCompleted": 2,
        "locationCompleted": "3538 Lake Eastbrook — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 2 of 2 Quext Gateway.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-KgU6Wf-1",
        "projectId": "KgU6WfWMmU7fR7UxgED8",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 132 units.",
        "isPinned": true
      },
      {
        "id": "note-KgU6Wf-2",
        "projectId": "KgU6WfWMmU7fR7UxgED8",
        "author": "Gavin Iversen",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Unit count of 132 was provided by user input as the North Star. AP density has been increased by 25% per Step 5 instructions.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-KgU6Wf-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-09"
      },
      {
        "id": "m-KgU6Wf-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-13"
      },
      {
        "id": "m-KgU6Wf-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-17"
      },
      {
        "id": "m-KgU6Wf-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-KgU6Wf-5",
        "title": "Implementation",
        "status": "Completed",
        "targetDate": "2026-11-08"
      },
      {
        "id": "m-KgU6Wf-6",
        "title": "CSM Handoff",
        "status": "Completed",
        "targetDate": "2026-11-11"
      },
      {
        "id": "m-KgU6Wf-7",
        "title": "Project Closed",
        "status": "Completed",
        "targetDate": "2026-11-13"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "HXpmnL2kOhIjFPLvTe5c",
    "quoteId": "HXpmnL2kOhIjFPLvTe5c",
    "quoteNumber": "QXT-2026-1028",
    "propertyName": "Blair Crossing",
    "clientName": "Prospect",
    "address": "Hwy 30 & Hwy 133",
    "city": "Blair",
    "state": "NE",
    "unitsCount": 132,
    "heroImage": "/src/assets/images/property_lumina_midtown_1792605892751.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Branden Girman",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "SKBM"
    ],
    "statusTag": "High Risk",
    "statusReason": "Critical path blocker on Blair Crossing (Blair, NE): Total unit count established from user input: 132 units.",
    "startDate": "2026-10-06",
    "targetCompletionDate": "2026-10-24",
    "lastUpdated": "2026-09-25T19:28:36.679535Z",
    "bomItems": [
      {
        "id": "bom-HXpmnL-01",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Head-end controller."
      },
      {
        "id": "bom-HXpmnL-02",
        "name": "NVR",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas & Head-End",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1250,
        "description": "Storage for cameras."
      },
      {
        "id": "bom-HXpmnL-03",
        "name": "In-Unit Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "All Residential Units",
        "quantity": 198,
        "installedCount": 51,
        "unitPrice": 220,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-04",
        "name": "Smart Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "All Residential Units",
        "quantity": 132,
        "installedCount": 16,
        "unitPrice": 165,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-05",
        "name": "Leak Sensor",
        "model": "QXT-LK-100",
        "category": "Sensors & Leak Protection",
        "location": "All Residential Units",
        "quantity": 132,
        "installedCount": 34,
        "unitPrice": 55,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-06",
        "name": "Door Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas & Head-End",
        "quantity": 5,
        "installedCount": 1,
        "unitPrice": 1450,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-07",
        "name": "IP Camera",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas & Head-End",
        "quantity": 10,
        "installedCount": 3,
        "unitPrice": 180,
        "description": ""
      },
      {
        "id": "bom-HXpmnL-08",
        "name": "Managed Wi-Fi 7 Access Point (Unit & Common Area)",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Residential Units & Amenity Spaces",
        "quantity": 172,
        "installedCount": 21,
        "unitPrice": 195,
        "description": "Wi-Fi 7 deployment (165 in-unit APs, 4 indoor common, 3 outdoor)."
      }
    ],
    "installLogs": [
      {
        "id": "log-HXpmnL-1",
        "projectId": "HXpmnL2kOhIjFPLvTe5c",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SKBM Field Team (Hector Lopez)",
        "itemId": "bom-HXpmnL-01",
        "itemName": "Quext Gateway",
        "quantityCompleted": 0,
        "locationCompleted": "Blair Crossing — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 0 of 1 Quext Gateway.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-HXpmnL-1",
        "projectId": "HXpmnL2kOhIjFPLvTe5c",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Critical path blocker on Blair Crossing (Blair, NE): Total unit count established from user input: 132 units.",
        "isPinned": true
      },
      {
        "id": "note-HXpmnL-2",
        "projectId": "HXpmnL2kOhIjFPLvTe5c",
        "author": "Taylor Williams",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count established from user input: 132 units. Estimated 7500 sq ft of indoor common area space for a 132-unit apartment.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-HXpmnL-1",
        "title": "Project kickoff",
        "status": "Upcoming",
        "targetDate": "2026-10-08"
      },
      {
        "id": "m-HXpmnL-2",
        "title": "Portal Buildout",
        "status": "Upcoming",
        "targetDate": "2026-10-12"
      },
      {
        "id": "m-HXpmnL-3",
        "title": "Product Acquisition",
        "status": "Upcoming",
        "targetDate": "2026-10-16"
      },
      {
        "id": "m-HXpmnL-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-HXpmnL-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-HXpmnL-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-HXpmnL-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-10-24"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "YgomhonPuWJiQoCRv6UU",
    "quoteId": "YgomhonPuWJiQoCRv6UU",
    "quoteNumber": "QXT-2026-1029",
    "propertyName": "Clemson Village",
    "clientName": "Balfour Beatty Communities",
    "address": "31 Clemson Pl",
    "city": "Clemson",
    "state": "SC",
    "unitsCount": 92,
    "heroImage": "/src/assets/images/property_palms_las_olas_1792605906247.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Kennedy Staiger",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "ATB"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 92 units.",
    "startDate": "2026-10-05",
    "targetCompletionDate": "2026-11-15",
    "lastUpdated": "2026-10-25T03:14:53.420Z",
    "bomItems": [
      {
        "id": "bom-Ygomho-01",
        "name": "Schlage Enrollment Reader MT20W",
        "model": "SCH-MT20W",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 138,
        "installedCount": 108,
        "unitPrice": 500.0,
        "description": "Dependency for Common Area Access Control"
      },
      {
        "id": "bom-Ygomho-02",
        "name": "Monthly Recurring Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 92,
        "installedCount": 59,
        "unitPrice": 180,
        "description": ""
      },
      {
        "id": "bom-Ygomho-03",
        "name": "Monthly NFC Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 288,
        "installedCount": 225,
        "unitPrice": 180,
        "description": ""
      },
      {
        "id": "bom-Ygomho-04",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 390,
        "installedCount": 250,
        "unitPrice": 215.0,
        "description": "With Handles"
      }
    ],
    "installLogs": [
      {
        "id": "log-Ygomho-1",
        "projectId": "YgomhonPuWJiQoCRv6UU",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "ATB Field Team (Sean Gates)",
        "itemId": "bom-Ygomho-01",
        "itemName": "Schlage Enrollment Reader MT20W",
        "quantityCompleted": 108,
        "locationCompleted": "Clemson Village — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 108 of 138 Schlage Enrollment Reader MT20W.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-Ygomho-1",
        "projectId": "YgomhonPuWJiQoCRv6UU",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 92 units.",
        "isPinned": true
      },
      {
        "id": "note-Ygomho-2",
        "projectId": "YgomhonPuWJiQoCRv6UU",
        "author": "Keenan Cheung",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count of 92 derived from user input. Assumed 2500 sq ft of indoor common area for 1 Wi-Fi 7 Indoor Common AP due to lack of specific plan details.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-Ygomho-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-07"
      },
      {
        "id": "m-Ygomho-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-11"
      },
      {
        "id": "m-Ygomho-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-15"
      },
      {
        "id": "m-Ygomho-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-Ygomho-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-10"
      },
      {
        "id": "m-Ygomho-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-13"
      },
      {
        "id": "m-Ygomho-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-15"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "aS0DVlt0j4hymbdhApdm",
    "quoteId": "aS0DVlt0j4hymbdhApdm",
    "quoteNumber": "QXT-2026-1030",
    "propertyName": "Linwood",
    "clientName": "Van Trust Real Estate",
    "address": "20 W. Linwood Blvd.",
    "city": "Kansas City",
    "state": "Missouri",
    "unitsCount": 60,
    "heroImage": "/src/assets/images/property_grand_horizon_1792605840266.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Nicole Franklin",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "SBH"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 60 units.",
    "startDate": "2026-10-04",
    "targetCompletionDate": "2026-11-16",
    "lastUpdated": "2026-07-06T20:28:05.075Z",
    "bomItems": [
      {
        "id": "bom-aS0DVl-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 60,
        "installedCount": 52,
        "unitPrice": 275.0,
        "description": ""
      },
      {
        "id": "bom-aS0DVl-02",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 60,
        "installedCount": 43,
        "unitPrice": 150.0,
        "description": "1 per unit."
      },
      {
        "id": "bom-aS0DVl-03",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 26,
        "installedCount": 22,
        "unitPrice": 550.0,
        "description": ""
      },
      {
        "id": "bom-aS0DVl-04",
        "name": "Video Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 1450,
        "description": "Assumed for Main Entry."
      },
      {
        "id": "bom-aS0DVl-05",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 20,
        "installedCount": 17,
        "unitPrice": 1200.0,
        "description": "Estimate: Main, Side, Amenity, Office doors."
      },
      {
        "id": "bom-aS0DVl-06",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 60,
        "installedCount": 43,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs and amenity coverage."
      }
    ],
    "installLogs": [
      {
        "id": "log-aS0DVl-1",
        "projectId": "aS0DVlt0j4hymbdhApdm",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SBH Field Team (Hector Lopez)",
        "itemId": "bom-aS0DVl-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 52,
        "locationCompleted": "Linwood — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 52 of 60 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-aS0DVl-1",
        "projectId": "aS0DVlt0j4hymbdhApdm",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 60 units.",
        "isPinned": true
      },
      {
        "id": "note-aS0DVl-2",
        "projectId": "aS0DVlt0j4hymbdhApdm",
        "author": "Mark Zanders",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Unit count set to 60 based on user input. Camera count set to 30 based on specific user request.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-aS0DVl-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-06"
      },
      {
        "id": "m-aS0DVl-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-10"
      },
      {
        "id": "m-aS0DVl-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-14"
      },
      {
        "id": "m-aS0DVl-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-aS0DVl-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-11"
      },
      {
        "id": "m-aS0DVl-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-14"
      },
      {
        "id": "m-aS0DVl-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-16"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "jXSru6KLcysHJQMMnsgV",
    "quoteId": "jXSru6KLcysHJQMMnsgV",
    "quoteNumber": "QXT-2026-1031",
    "propertyName": "The Darby at Briarcliff",
    "clientName": "Balboa Real Estate Partners",
    "address": "INTERSECTION OF NW TULLISON RD. & NW 38th ST",
    "city": "Riverside",
    "state": "MO",
    "unitsCount": 39,
    "heroImage": "/src/assets/images/property_kathryn_canals_1792605853194.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Jasmine Hunt",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "Everbase"
    ],
    "statusTag": "On Track",
    "statusReason": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 39 units.",
    "startDate": "2026-10-03",
    "targetCompletionDate": "2026-11-17",
    "lastUpdated": "2026-09-30T01:29:50.398591Z",
    "bomItems": [
      {
        "id": "bom-jXSru6-01",
        "name": "Smart Lock",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 39,
        "installedCount": 27,
        "unitPrice": 266.68,
        "description": "does this work??"
      },
      {
        "id": "bom-jXSru6-02",
        "name": "Quext Thermostat",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 39,
        "installedCount": 22,
        "unitPrice": 150.0,
        "description": "One thermostat per residential unit."
      },
      {
        "id": "bom-jXSru6-03",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 1,
        "unitPrice": 794.26,
        "description": "Assumes a leasing office and a fitness center entrance. Requires verification."
      },
      {
        "id": "bom-jXSru6-04",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 8,
        "installedCount": 4,
        "unitPrice": 700.0,
        "description": "Assumes a baseline of cameras covering building exteriors and parking areas. Requires scope confirmation."
      },
      {
        "id": "bom-jXSru6-05",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 39,
        "installedCount": 27,
        "unitPrice": 195,
        "description": "In-unit Wi-Fi 7 APs"
      },
      {
        "id": "bom-jXSru6-06",
        "name": "Resideo L1 WiFi Water Leak & Freeze Detector",
        "model": "RES-L1-WF",
        "category": "Sensors & Leak Protection",
        "location": "Apartment Unit",
        "quantity": 39,
        "installedCount": 22,
        "unitPrice": 192.44,
        "description": "Dependency for Apartment Unit IoT Control"
      },
      {
        "id": "bom-jXSru6-07",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 8,
        "installedCount": 6,
        "unitPrice": 180,
        "description": ""
      }
    ],
    "installLogs": [
      {
        "id": "log-jXSru6-1",
        "projectId": "jXSru6KLcysHJQMMnsgV",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Everbase Field Team (Sean Gates)",
        "itemId": "bom-jXSru6-01",
        "itemName": "Smart Lock",
        "quantityCompleted": 27,
        "locationCompleted": "The Darby at Briarcliff — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 27 of 39 Smart Lock.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-jXSru6-1",
        "projectId": "jXSru6KLcysHJQMMnsgV",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active Project Kickoff deployment synced from myquext.com. Field installation progressing on schedule across 39 units.",
        "isPinned": true
      },
      {
        "id": "note-jXSru6-2",
        "projectId": "jXSru6KLcysHJQMMnsgV",
        "author": "Blake Miller",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count of 39 was established from user-provided notes, which was used as the primary source for all per-unit calculations. No dedicated common amenity areas such as a clubhouse, leasing office, gym, or pool were identified in the provided plan set. Therefore, no common area APs or associated PoE switches have been included.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-jXSru6-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-05"
      },
      {
        "id": "m-jXSru6-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-09"
      },
      {
        "id": "m-jXSru6-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-13"
      },
      {
        "id": "m-jXSru6-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-jXSru6-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-12"
      },
      {
        "id": "m-jXSru6-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-15"
      },
      {
        "id": "m-jXSru6-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-17"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "G43OjH7UW5lpwFGD6eB3",
    "quoteId": "G43OjH7UW5lpwFGD6eB3",
    "quoteNumber": "QXT-2026-1032",
    "propertyName": "Hideaway Lofts",
    "clientName": "Greystar Real Estate Partners",
    "address": "204 West 3rd Street",
    "city": "Kansas City",
    "state": "MO",
    "unitsCount": 38,
    "heroImage": "/src/assets/images/property_parkside_craig_1792605865604.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Tessa Peshke",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "JTS"
    ],
    "statusTag": "Behind Schedule",
    "statusReason": "Installation pacing on Hideaway Lofts (38 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Greystar Real Estate Partners.",
    "startDate": "2026-10-02",
    "targetCompletionDate": "2026-11-03",
    "lastUpdated": "2026-10-23T13:50:32.924Z",
    "bomItems": [
      {
        "id": "bom-G43OjH-01",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 38,
        "installedCount": 16,
        "unitPrice": 195,
        "description": "3G Fiber Internet Service to the apartment unit with powerful Managed Wifi 7 blanketing your community."
      },
      {
        "id": "bom-G43OjH-02",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 38,
        "installedCount": 11,
        "unitPrice": 250.0,
        "description": "1 battery-powered smart deadbolt per residential unit entry door with mobile credential support."
      },
      {
        "id": "bom-G43OjH-03",
        "name": "Quext Thermostat v2",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 38,
        "installedCount": 16,
        "unitPrice": 125.0,
        "description": "1 smart thermostat per unit with built-in IoT hub and humidity sensors."
      },
      {
        "id": "bom-G43OjH-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 1,
        "unitPrice": 1500.0,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-G43OjH-05",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 199.0,
        "description": "Customized QR-plated video intercom station for visitor self-guided check-in and delivery access."
      },
      {
        "id": "bom-G43OjH-06",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-G43OjH-07",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 38,
        "installedCount": 16,
        "unitPrice": 30.0,
        "description": "Device programming, cloud portal configuration, and backend account initialization."
      },
      {
        "id": "bom-G43OjH-08",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Device programming, cloud portal configuration, and backend account initialization."
      },
      {
        "id": "bom-G43OjH-09",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 1500.0,
        "description": "Silver onboarding package: Remote database configuration, staff training, and go-live deployment support."
      }
    ],
    "installLogs": [
      {
        "id": "log-G43OjH-1",
        "projectId": "G43OjH7UW5lpwFGD6eB3",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Tray Johnson Field Team (Hector Lopez)",
        "itemId": "bom-G43OjH-01",
        "itemName": "GFiber Managed Wifi",
        "quantityCompleted": 16,
        "locationCompleted": "Hideaway Lofts — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (Project Kickoff). Installed 16 of 38 GFiber Managed Wifi.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-G43OjH-1",
        "projectId": "G43OjH7UW5lpwFGD6eB3",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Installation pacing on Hideaway Lofts (38 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Greystar Real Estate Partners.",
        "isPinned": true
      },
      {
        "id": "note-G43OjH-2",
        "projectId": "G43OjH7UW5lpwFGD6eB3",
        "author": "Gavin Iversen",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count of 38 was provided directly by user input. No floor plans, amenity square footage, or site plans were provided. All common area device quantities (APs, cameras, readers) are estimates based on a standard property of this size.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-G43OjH-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-04"
      },
      {
        "id": "m-G43OjH-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-08"
      },
      {
        "id": "m-G43OjH-3",
        "title": "Product Acquisition",
        "status": "In Progress",
        "targetDate": "2026-10-12"
      },
      {
        "id": "m-G43OjH-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-G43OjH-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-G43OjH-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-G43OjH-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-03"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "buuP51JrJT6WnogdVlDT",
    "quoteId": "buuP51JrJT6WnogdVlDT",
    "quoteNumber": "QXT-2026-1033",
    "propertyName": "Shadow View Village",
    "clientName": "NewStreet Properties",
    "address": "9140 W Dodge Rd",
    "city": "Omaha",
    "state": "Nebraska",
    "unitsCount": 260,
    "heroImage": "/src/assets/images/property_domain_citycenter_1792605879144.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Branden Girman",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "RMR"
    ],
    "statusTag": "On Track",
    "statusReason": "Active On Deck deployment synced from myquext.com. Field installation progressing on schedule across 260 units.",
    "startDate": "2026-10-01",
    "targetCompletionDate": "2026-11-19",
    "lastUpdated": "2026-09-25T19:42:19.373855Z",
    "bomItems": [
      {
        "id": "bom-buuP51-01",
        "name": "Pro Services - Silver",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-buuP51-02",
        "name": "Project Management Fee",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Professional Services",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2000.0,
        "description": ""
      },
      {
        "id": "bom-buuP51-03",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 3,
        "installedCount": 3,
        "unitPrice": 2500.0,
        "description": ""
      },
      {
        "id": "bom-buuP51-04",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 260,
        "installedCount": 213,
        "unitPrice": 220.0,
        "description": "A battery-powered, offline deadbolt. Keyless mobile entry and remote management, with or without a Quext smart hub."
      },
      {
        "id": "bom-buuP51-05",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 260,
        "installedCount": 250,
        "unitPrice": 120.0,
        "description": "Our patented smart thermostat with built-in hub. Connects locks and sensors, detects occupancy, and saves energy, all without needing resident Wi-Fi."
      }
    ],
    "installLogs": [
      {
        "id": "log-buuP51-1",
        "projectId": "buuP51JrJT6WnogdVlDT",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "Midwest Protection Services Field Team (Sean Gates)",
        "itemId": "bom-buuP51-01",
        "itemName": "Pro Services - Silver",
        "quantityCompleted": 1,
        "locationCompleted": "Shadow View Village — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (On Deck). Installed 1 of 1 Pro Services - Silver.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-buuP51-1",
        "projectId": "buuP51JrJT6WnogdVlDT",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active On Deck deployment synced from myquext.com. Field installation progressing on schedule across 260 units.",
        "isPinned": true
      },
      {
        "id": "note-buuP51-2",
        "projectId": "buuP51JrJT6WnogdVlDT",
        "author": "Taylor Williams",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Total unit count of 260 was provided by user input. No floor plans or site plans were provided. All common area device quantities (Wi-Fi, Cameras, Access Control) are estimates based on a typical property of this size and should be verified.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-buuP51-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-03"
      },
      {
        "id": "m-buuP51-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-07"
      },
      {
        "id": "m-buuP51-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-11"
      },
      {
        "id": "m-buuP51-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-buuP51-5",
        "title": "Implementation",
        "status": "Completed",
        "targetDate": "2026-11-14"
      },
      {
        "id": "m-buuP51-6",
        "title": "CSM Handoff",
        "status": "In Progress",
        "targetDate": "2026-11-17"
      },
      {
        "id": "m-buuP51-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-19"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "K1qIh3Ym7iXdpkGRvAzS",
    "quoteId": "K1qIh3Ym7iXdpkGRvAzS",
    "quoteNumber": "QXT-2026-1034",
    "propertyName": "Southern Downs",
    "clientName": "Alpha Southern Downs, LLC",
    "address": "710 Georgia Avenue",
    "city": "Statesboro",
    "state": "GA",
    "unitsCount": 214,
    "heroImage": "/src/assets/images/property_lumina_midtown_1792605892751.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Kennedy Staiger",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "All Media"
    ],
    "statusTag": "High Risk",
    "statusReason": "Critical path blocker on Southern Downs (Statesboro, GA): CRITICAL SALES FLAG: The customer explicitly stated they want to keep their current ISP (Xiber) and are only interested in IoT device management. This BOM represents the full, integrated Quext powered by Google Fiber package. The sales team must address this misalignment and emphasize the benefits of a single, fully managed network for both residents and staff.",
    "startDate": "2026-09-30",
    "targetCompletionDate": "2026-10-25",
    "lastUpdated": "2026-10-19T18:34:30.094367Z",
    "bomItems": [
      {
        "id": "bom-K1qIh3-01",
        "name": "Quext Thermostats",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 214,
        "installedCount": 64,
        "unitPrice": 100.0,
        "description": "Dependency for Quext Thermostat v2"
      },
      {
        "id": "bom-K1qIh3-02",
        "name": "Quext Gateway",
        "model": "QXT-GW-LR8",
        "category": "IoT Gateways & Mesh",
        "location": "Apartment Unit",
        "quantity": 2,
        "installedCount": 0,
        "unitPrice": 2500.0,
        "description": "Commercial central head-end gateway and controller for property smart IoT networks."
      },
      {
        "id": "bom-K1qIh3-03",
        "name": "Shipping",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Apartment Unit",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": "Freight and standard ground delivery for hardware and deployment shipments."
      },
      {
        "id": "bom-K1qIh3-04",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 214,
        "installedCount": 34,
        "unitPrice": 49.0,
        "description": "1GB/3GB bulk Fiber internet to the unit with managed Wi-Fi 7 in-unit and common area amenity coverage."
      }
    ],
    "installLogs": [
      {
        "id": "log-K1qIh3-1",
        "projectId": "K1qIh3Ym7iXdpkGRvAzS",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "All Media Field Team (Hector Lopez)",
        "itemId": "bom-K1qIh3-01",
        "itemName": "Quext Thermostats",
        "quantityCompleted": 64,
        "locationCompleted": "Southern Downs — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (On Deck). Installed 64 of 214 Quext Thermostats.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-K1qIh3-1",
        "projectId": "K1qIh3Ym7iXdpkGRvAzS",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Critical path blocker on Southern Downs (Statesboro, GA): CRITICAL SALES FLAG: The customer explicitly stated they want to keep their current ISP (Xiber) and are only interested in IoT device management. This BOM represents the full, integrated Quext powered by Google Fiber package. The sales team must address this misalignment and emphasize the benefits of a single, fully managed network for both residents and staff.",
        "isPinned": true
      },
      {
        "id": "note-K1qIh3-2",
        "projectId": "K1qIh3Ym7iXdpkGRvAzS",
        "author": "Keenan Cheung",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: CRITICAL SALES FLAG: The customer explicitly stated they want to keep their current ISP (Xiber) and are only interested in IoT device management. This BOM represents the full, integrated Quext powered by Google Fiber package. The sales team must address this misalignment and emphasize the benefits of a single, fully managed network for both residents and staff. Total unit count of 214 was provided directly by the user.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-K1qIh3-1",
        "title": "Project kickoff",
        "status": "Upcoming",
        "targetDate": "2026-10-02"
      },
      {
        "id": "m-K1qIh3-2",
        "title": "Portal Buildout",
        "status": "Upcoming",
        "targetDate": "2026-10-06"
      },
      {
        "id": "m-K1qIh3-3",
        "title": "Product Acquisition",
        "status": "Upcoming",
        "targetDate": "2026-10-10"
      },
      {
        "id": "m-K1qIh3-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-K1qIh3-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-10-29"
      },
      {
        "id": "m-K1qIh3-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-01"
      },
      {
        "id": "m-K1qIh3-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-10-25"
      }
    ],
    "kickoffCompleted": false
  },
  {
    "id": "6kzshTGPWEyNMdljq5ZZ",
    "quoteId": "6kzshTGPWEyNMdljq5ZZ",
    "quoteNumber": "QXT-2026-1035",
    "propertyName": "KU East Gateway",
    "clientName": "Sunflower Development",
    "address": "11th and Mississippi",
    "city": "Lawrence",
    "state": "Kansas",
    "unitsCount": 199,
    "heroImage": "/src/assets/images/property_palms_las_olas_1792605906247.jpg",
    "assignedPM": {
      "name": "Megan Rossman",
      "email": "megan.rossman@onequext.com",
      "role": "Director of Operations",
      "phone": "(806) 555-0193"
    },
    "assignedCSM": "Nicole Franklin",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "SKBM"
    ],
    "statusTag": "On Track",
    "statusReason": "Active On Deck deployment synced from myquext.com. Field installation progressing on schedule across 199 units.",
    "startDate": "2026-09-29",
    "targetCompletionDate": "2026-11-21",
    "lastUpdated": "2026-10-15T18:44:39.258Z",
    "bomItems": [
      {
        "id": "bom-6kzshT-01",
        "name": "Schlage BE467 Deadbolt",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Apartment Unit",
        "quantity": 199,
        "installedCount": 125,
        "unitPrice": 225.0,
        "description": "1 per unit main entry."
      },
      {
        "id": "bom-6kzshT-02",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Apartment Unit",
        "quantity": 199,
        "installedCount": 98,
        "unitPrice": 150.0,
        "description": "1 per residential unit."
      },
      {
        "id": "bom-6kzshT-03",
        "name": "QR Intercom",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 2,
        "installedCount": 1,
        "unitPrice": 199.0,
        "description": "Customized QR-plated video intercom station for visitor self-guided check-in and delivery access."
      },
      {
        "id": "bom-6kzshT-04",
        "name": "Schlage Electrified Reader - RCK15 With Keypad",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 3,
        "installedCount": 1,
        "unitPrice": 770.73,
        "description": "Wired IP reader controller with keypad for high-traffic perimeter doors, main lobbies, and amenity access."
      },
      {
        "id": "bom-6kzshT-05",
        "name": "Schlage Electrified Reader - RC11 Mullion",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 59,
        "installedCount": 37,
        "unitPrice": 1300.0,
        "description": "The slim Schlage RC11 wired IP reader for narrow door frames. Get real-time, high-security access control managed by the Quext platform."
      },
      {
        "id": "bom-6kzshT-06",
        "name": "Eagle Eye Security Cameras - DF03",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Common Areas",
        "quantity": 98,
        "installedCount": 48,
        "unitPrice": 746.72,
        "description": "This is a place holder for the Camera proposal from Eagle Eye. This will be removed from Quext letterhead and contracted through Southbay Hardware"
      },
      {
        "id": "bom-6kzshT-07",
        "name": "GFiber Managed Wifi",
        "model": "QXT-WF7-WP",
        "category": "Bulk Managed Wi-Fi",
        "location": "Software and Services",
        "quantity": 199,
        "installedCount": 125,
        "unitPrice": 195,
        "description": "3GB Fiber Internet to the Unit with Managed Wifi 7 coverage in unit and community spaces.\n\nMonths 1-3 at $0.00 per unit (100% discount)\nMonths 4-6 at $11.75 per unit (75% discount)\nMonths 7-9 at $23.50 per unit (50% discount)\nMonths 10-12 a"
      },
      {
        "id": "bom-6kzshT-08",
        "name": "7 Day Camera Recording",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Software and Services",
        "quantity": 98,
        "installedCount": 48,
        "unitPrice": 180,
        "description": "Standard cloud video surveillance license: 60-day local retention, remote live view, and motion alerts."
      },
      {
        "id": "bom-6kzshT-09",
        "name": "Honeywell T6",
        "model": "QXT-TH-300",
        "category": "Smart Thermostats & HVAC",
        "location": "Common Areas",
        "quantity": 6,
        "installedCount": 4,
        "unitPrice": 150.0,
        "description": "1 Wi-Fi smart commercial thermostat per unit, pre-configured for property Wi-Fi networks."
      },
      {
        "id": "bom-6kzshT-10",
        "name": "Long Range Reader",
        "model": "QXT-IC-20",
        "category": "Smart Access Control",
        "location": "Common Areas",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 5000.0,
        "description": "Long-range RFID reader for vehicle gate automation and resident parking garages."
      }
    ],
    "installLogs": [
      {
        "id": "log-6kzshT-1",
        "projectId": "6kzshTGPWEyNMdljq5ZZ",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SKBM Field Team (Sean Gates)",
        "itemId": "bom-6kzshT-01",
        "itemName": "Schlage BE467 Deadbolt",
        "quantityCompleted": 125,
        "locationCompleted": "KU East Gateway — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (On Deck). Installed 125 of 199 Schlage BE467 Deadbolt.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-6kzshT-1",
        "projectId": "6kzshTGPWEyNMdljq5ZZ",
        "author": "Megan Rossman",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active On Deck deployment synced from myquext.com. Field installation progressing on schedule across 199 units.",
        "isPinned": true
      },
      {
        "id": "note-6kzshT-2",
        "projectId": "6kzshTGPWEyNMdljq5ZZ",
        "author": "Gavin Iversen",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: GEOGRAPHIC CONSTRAINT APPLIED: Property is in ZIP 66045, outside Google Fiber service area. Per instructions, Wi-Fi 6 hardware will be substituted. Schema keys labeled 'wifi7' are retained strictly for JSON validation but represent standard Wi-Fi 6 equivalents. No Google Fiber or 'Quext powered by Google Fiber' branding has been included in the BOM due to the out-of-market constraint.",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-6kzshT-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-10-01"
      },
      {
        "id": "m-6kzshT-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-05"
      },
      {
        "id": "m-6kzshT-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-09"
      },
      {
        "id": "m-6kzshT-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-6kzshT-5",
        "title": "Implementation",
        "status": "In Progress",
        "targetDate": "2026-11-16"
      },
      {
        "id": "m-6kzshT-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-19"
      },
      {
        "id": "m-6kzshT-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-21"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "sf_imp_1785373518753_ac961e07",
    "quoteId": "sf_imp_1785373518753_ac961e07",
    "quoteNumber": "QXT-2026-1036",
    "propertyName": "The Mill- Charlotte, NC",
    "clientName": "Iris Innovations",
    "address": "11015 Education Way",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 131,
    "heroImage": "/src/assets/images/property_grand_horizon_1792605840266.jpg",
    "assignedPM": {
      "name": "Raul Recalde",
      "email": "raul.recalde@onequext.com",
      "role": "Director of Implementation",
      "phone": "(806) 555-0142"
    },
    "assignedCSM": "Jasmine Hunt",
    "assignedFieldTech": "Hector Lopez",
    "integratorPartners": [
      "ATB"
    ],
    "statusTag": "Behind Schedule",
    "statusReason": "Installation pacing on The Mill- Charlotte, NC (131 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Iris Innovations.",
    "startDate": "2026-09-28",
    "targetCompletionDate": "2026-11-07",
    "lastUpdated": "2026-09-25T19:41:03.746911Z",
    "bomItems": [
      {
        "id": "bom-sf_imp-01",
        "name": "Key Fobs",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 300.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-02",
        "name": "Schlage Enrollment Reader(MT20)",
        "model": "SCH-MT20",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 500.0,
        "description": ""
      },
      {
        "id": "bom-sf_imp-03",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 0,
        "unitPrice": 4000.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-sf_imp-04",
        "name": "Schlage BE467 Greenwich - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Smart Access Control",
        "location": "Access Control",
        "quantity": 136,
        "installedCount": 48,
        "unitPrice": 180.0,
        "description": "Unlock powerful access control with the Schlage BE467, a robust, battery-powered, offline smart deadbolt. When activated by Quext software, this lock provides intelligent access control without the cost of new wiring or network infrastructu"
      },
      {
        "id": "bom-sf_imp-05",
        "name": "Schlage F10 Passage Handle - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 136,
        "installedCount": 67,
        "unitPrice": 35.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      }
    ],
    "installLogs": [
      {
        "id": "log-sf_imp-1",
        "projectId": "sf_imp_1785373518753_ac961e07",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "ATB Field Team (Hector Lopez)",
        "itemId": "bom-sf_imp-01",
        "itemName": "Key Fobs",
        "quantityCompleted": 0,
        "locationCompleted": "The Mill- Charlotte, NC — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (On Deck). Installed 0 of 1 Key Fobs.",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-sf_imp-1",
        "projectId": "sf_imp_1785373518753_ac961e07",
        "author": "Raul Recalde",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "Inspection & Commissioning",
        "text": "Installation pacing on The Mill- Charlotte, NC (131 units) trailing baseline schedule due to phased building access & corridor make-ready coordination with Iris Innovations.",
        "isPinned": true
      },
      {
        "id": "note-sf_imp-2",
        "projectId": "sf_imp_1785373518753_ac961e07",
        "author": "Keenan Cheung",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Imported from Salesforce Opportunity: The Mill- Charlotte, NC",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-sf_imp-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-30"
      },
      {
        "id": "m-sf_imp-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-04"
      },
      {
        "id": "m-sf_imp-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-08"
      },
      {
        "id": "m-sf_imp-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "In Progress",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-sf_imp-5",
        "title": "Implementation",
        "status": "Upcoming",
        "targetDate": "2026-11-02"
      },
      {
        "id": "m-sf_imp-6",
        "title": "CSM Handoff",
        "status": "Upcoming",
        "targetDate": "2026-11-05"
      },
      {
        "id": "m-sf_imp-7",
        "title": "Project Closed",
        "status": "Upcoming",
        "targetDate": "2026-11-07"
      }
    ],
    "kickoffCompleted": true
  },
  {
    "id": "snHjGzXuymQfGp4dqIuc",
    "quoteId": "snHjGzXuymQfGp4dqIuc",
    "quoteNumber": "QXT-2026-1037",
    "propertyName": "The Union - Charlotte, NC",
    "clientName": "Iris Innovations",
    "address": "1201 Campus Pointe Ct",
    "city": "Charlotte",
    "state": "NC",
    "unitsCount": 99,
    "heroImage": "/src/assets/images/property_kathryn_canals_1792605853194.jpg",
    "assignedPM": {
      "name": "Bethany Condon",
      "email": "bethany.condon@onequext.com",
      "role": "Project Manager",
      "phone": "(806) 555-0188"
    },
    "assignedCSM": "Tessa Peshke",
    "assignedFieldTech": "Sean Gates",
    "integratorPartners": [
      "SBH"
    ],
    "statusTag": "On Track",
    "statusReason": "Active On Deck deployment synced from myquext.com. Field installation progressing on schedule across 99 units.",
    "startDate": "2026-09-27",
    "targetCompletionDate": "2026-11-23",
    "lastUpdated": "2026-09-25T19:41:06.051167Z",
    "bomItems": [
      {
        "id": "bom-snHjGz-01",
        "name": "Schlage Enrollment Reader(MT20)",
        "model": "SCH-MT20",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 500.0,
        "description": ""
      },
      {
        "id": "bom-snHjGz-02",
        "name": "Key Fobs",
        "model": "QXT-DL-900",
        "category": "Smart Access Control",
        "location": "Accessories",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 300.0,
        "description": ""
      },
      {
        "id": "bom-snHjGz-03",
        "name": "Schlage F10 Passage Handle - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 104,
        "installedCount": 104,
        "unitPrice": 35.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-snHjGz-04",
        "name": "Activation and Deployment",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 3500.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      },
      {
        "id": "bom-snHjGz-05",
        "name": "Schlage BE467 Greenwich - Satin Nickel",
        "model": "SCH-BE467",
        "category": "Common Area & Utilities",
        "location": "Apartment Units",
        "quantity": 104,
        "installedCount": 104,
        "unitPrice": 180.0,
        "description": "Unlock powerful access control with the Schlage BE467, a robust, battery-powered, offline smart deadbolt. When activated by Quext software, this lock provides intelligent access control without the cost of new wiring or network infrastructu"
      },
      {
        "id": "bom-snHjGz-06",
        "name": "Shipping",
        "model": "QXT-UT-500",
        "category": "Common Area & Utilities",
        "location": "Hardware / Equipment",
        "quantity": 1,
        "installedCount": 1,
        "unitPrice": 2500.0,
        "description": "Quoted on myquext.com (Smart Community BOM)"
      }
    ],
    "installLogs": [
      {
        "id": "log-snHjGz-1",
        "projectId": "snHjGzXuymQfGp4dqIuc",
        "timestamp": "2026-10-21 02:15 PM",
        "installerName": "SBH Field Team (Sean Gates)",
        "itemId": "bom-snHjGz-01",
        "itemName": "Schlage Enrollment Reader(MT20)",
        "quantityCompleted": 1,
        "locationCompleted": "The Union - Charlotte, NC — Residential Buildings",
        "statusCheck": "Verified & Online",
        "notes": "Synced from myquext.com (On Deck). Installed 1 of 1 Schlage Enrollment Reader(MT20).",
        "color": "emerald"
      }
    ],
    "notes": [
      {
        "id": "note-snHjGz-1",
        "projectId": "snHjGzXuymQfGp4dqIuc",
        "author": "Bethany Condon",
        "timestamp": "Oct 22, 2026, 10:15 AM",
        "category": "General Context",
        "text": "Active On Deck deployment synced from myquext.com. Field installation progressing on schedule across 99 units.",
        "isPinned": true
      },
      {
        "id": "note-snHjGz-2",
        "projectId": "snHjGzXuymQfGp4dqIuc",
        "author": "Keenan Cheung",
        "timestamp": "Oct 19, 2026, 02:30 PM",
        "category": "Site Access & Keys",
        "text": "myquext.com Sales Engineering Take-Off Note: Imported from Salesforce Opportunity: The Union - Charlotte, NC",
        "isPinned": false
      }
    ],
    "milestones": [
      {
        "id": "m-snHjGz-1",
        "title": "Project kickoff",
        "status": "Completed",
        "targetDate": "2026-09-29"
      },
      {
        "id": "m-snHjGz-2",
        "title": "Portal Buildout",
        "status": "Completed",
        "targetDate": "2026-10-03"
      },
      {
        "id": "m-snHjGz-3",
        "title": "Product Acquisition",
        "status": "Completed",
        "targetDate": "2026-10-07"
      },
      {
        "id": "m-snHjGz-4",
        "title": "CSM Intro - Pre-implementation",
        "status": "Completed",
        "targetDate": "2026-10-22"
      },
      {
        "id": "m-snHjGz-5",
        "title": "Implementation",
        "status": "Completed",
        "targetDate": "2026-11-18"
      },
      {
        "id": "m-snHjGz-6",
        "title": "CSM Handoff",
        "status": "Completed",
        "targetDate": "2026-11-21"
      },
      {
        "id": "m-snHjGz-7",
        "title": "Project Closed",
        "status": "Completed",
        "targetDate": "2026-11-23"
      }
    ],
    "kickoffCompleted": true
  }
];
