export interface IntercomStep {
  stepNumber: number;
  title: string;
  category: 'Portal Configuration' | 'Caller Experience' | 'Directory & Routing' | 'Resident Controls' | 'Video & Door Release';
  summary: string;
  details: string[];
  callout?: {
    type: 'info' | 'warning' | 'success';
    text: string;
  };
  mockupType: 
    | 'portal_settings' 
    | 'qr_scan_badge' 
    | 'landing_page' 
    | 'leasing_call'
    | 'name_prompt' 
    | 'directory_search' 
    | 'voice_calling' 
    | 'incoming_audio' 
    | 'video_request_modal' 
    | 'incoming_video' 
    | 'live_video_stream'
    | 'plaque_showcase';
  plaqueVariant?: 'vertical_custom' | 'horizontal_compact';
}

export interface PlaqueSpec {
  id: string;
  name: string;
  format: 'Vertical Architectural' | 'Horizontal Compact';
  dimensions: string;
  material: string;
  mounting: string;
  description: string;
  features: string[];
}

export const PLAQUE_SPECS: PlaqueSpec[] = [
  {
    id: 'plaque_vertical_custom',
    name: 'Tamarin Ridge Architectural Plaque',
    format: 'Vertical Architectural',
    dimensions: '8" W × 10" H × 0.125" Thick',
    material: 'Grade 316 Brushed Stainless Steel (Weatherproof IP67 rated)',
    mounting: '4 Corner Countersunk Stainless Machine Screws / Wall Anchors',
    description: 'Custom community entrance plaque with property name laser-etched header, high-contrast weatherproof QR code, and Geokey intercom certification markings.',
    features: [
      'Sub-surface fiber-laser engraving will never fade, peel, or scratch',
      'High-contrast matte black QR matrix readable in direct sunlight & low light',
      'Engineered for perimeter gates, pedestal mounts, and exterior masonry pillars',
      'Zero wiring or electrical rough-in required at gate locations'
    ]
  },
  {
    id: 'plaque_horizontal_compact',
    name: 'Geokey Compact Entrance Plaque',
    format: 'Horizontal Compact',
    dimensions: '7.5" W × 3.5" H × 0.08" Thick',
    material: 'Anodized Brushed Architectural Aluminum with Anti-Glare Passivation',
    mounting: '4 Corner Standoff Fasteners or 3M VHB Exterior Bond Tape',
    description: 'Sleek horizontal plaque designed for glass storefront entries, door mullions, and compact vestibules where wall space is constrained.',
    features: [
      'Ideal for interior vestibules, glass sidelites, and ADA entrance mullions',
      'Dual-zone layout pairing rapid QR scan zone with official verification lockmark',
      'UV-inhibited polymer surface clearcoat prevents fingerprint staining',
      'Rapid peel-and-press or screw-mount deployment in under 5 minutes'
    ]
  }
];

export const QR_INTERCOM_GUIDE_STEPS: IntercomStep[] = [
  {
    stepNumber: 1,
    title: 'Portal Intercom Configuration & Geofencing Setup',
    category: 'Portal Configuration',
    summary: 'Enable Intercom Functionality in the Geokey management portal custom settings and configure property geofencing parameters.',
    details: [
      'Admin enters the official name of the intercom system (e.g. "Westline Intercom System").',
      'Admin defines the QR Code Geofence radius in meters around property gates/vestibules.',
      'Admin inputs property name for the custom hosted landing page URL (https://www.property_name.geokeyaccess.com).',
      'Admin selects primary and secondary brand colors using the portal color picker for seamless resident UI matching.'
    ],
    callout: {
      type: 'info',
      text: 'Geokey automatically provisions and hosts the SSL landing page endpoint without requiring property server infrastructure.'
    },
    mockupType: 'portal_settings'
  },
  {
    stepNumber: 2,
    title: 'Caller Plaque QR Code Scanning',
    category: 'Caller Experience',
    summary: 'Visitors and delivery couriers scan the physical entrance plaque QR code using any native smartphone camera app.',
    details: [
      'Caller opens their iOS Camera or Android Google Lens / Camera app and frames the QR code.',
      'The QR code border automatically adopts the configured primary brand color.',
      'Configured intercom system name appears directly below the QR code for verification.'
    ],
    callout: {
      type: 'success',
      text: 'No app download is required for visitors. The workflow launches instantly in Safari, Chrome, or Samsung Internet.'
    },
    mockupType: 'qr_scan_badge',
    plaqueVariant: 'vertical_custom'
  },
  {
    stepNumber: 3,
    title: 'Geofence & Location Services Verification',
    category: 'Caller Experience',
    summary: 'The browser validates device location to confirm the caller is physically present within the designated property geofence.',
    details: [
      'Location services must be enabled on the mobile device to proceed to the landing page.',
      'If location services are disabled, notification alerts caller: "Please enable location services to use [intercom system name]."',
      'Device location is checked against portal coordinates. If outside: "It looks like you are outside the geofence for [Property Name]. Please verify you are in the correct location and try again."',
      'Upon verification, landing page displays account logo, primary background color, and secondary action buttons: Leasing or People.'
    ],
    callout: {
      type: 'warning',
      text: 'Geofencing prevents unauthorized remote directory browsing from callers not physically stationed at the property entrance.'
    },
    mockupType: 'landing_page'
  },
  {
    stepNumber: 4,
    title: 'Directory Routing: Leasing vs. Resident Selection',
    category: 'Directory & Routing',
    summary: 'Callers choose between reaching on-site management or searching the resident directory.',
    details: [
      'Option A (Leasing Selected): Automatically dials the leasing office phone number stored and maintained in the portal.',
      'Option B (People Selected): Prompts caller to input their name to access the resident directory.',
      'Caller entry is securely logged in the Geokey audit database with: Caller Name entered, Date/Time stamp, Account name, and GPS coordinates.'
    ],
    mockupType: 'name_prompt'
  },
  {
    stepNumber: 5,
    title: 'Resident Directory & Method Filtering',
    category: 'Directory & Routing',
    summary: 'Caller searches resident list; portal enforces resident privacy and communication preferences.',
    details: [
      'Resident list displays format: First initial, Last name (e.g. G. Ayers, C. Cardon, R. Evans, T. Givens).',
      'Caller can initiate either an Audio voice call or a Video call based on available icons.',
      'Resident call preference can be established in the portal: if a preference is locked, only the preferred icon (voice or video) is shown to visitors.'
    ],
    callout: {
      type: 'info',
      text: 'Apartment unit numbers and personal phone numbers remain 100% private and are never exposed to callers.'
    },
    mockupType: 'directory_search'
  },
  {
    stepNumber: 6,
    title: 'Voice Call Initiation by Visitor',
    category: 'Caller Experience',
    summary: 'Visitor taps phone icon to initiate a secure encrypted voice call to the resident.',
    details: [
      'Screen updates with real-time status: "Calling [Resident Name]".',
      'Property crest and intercom system branding are presented during ringing.',
      'Visitor can cancel anytime using the red End Call button.'
    ],
    mockupType: 'voice_calling'
  },
  {
    stepNumber: 7,
    title: 'Resident Audio Notification & Access Control',
    category: 'Resident Controls',
    summary: 'Resident smartphone rings via Geokey background push notification with complete access control options.',
    details: [
      'Geokey resident app receives high-priority VoIP call notification in foreground or background.',
      'Screen identifies incoming caller name (entered at directory prompt) and property intercom name.',
      'Resident can perform four distinct actions: Answer Call (Green), Request Video (Gray), Remote Unlock Door (Yellow Key), or Decline (Red X).'
    ],
    callout: {
      type: 'success',
      text: 'Resident can immediately press Unlock Door to grant entry without even answering if they recognize the delivery courier.'
    },
    mockupType: 'incoming_audio'
  },
  {
    stepNumber: 8,
    title: 'Two-Way Video Request & Escalation Protocol',
    category: 'Video & Door Release',
    summary: 'Resident can request a live video stream from caller; caller must confirm before camera activates.',
    details: [
      'Resident taps "Request Video" to request camera escalation.',
      'Caller mobile browser receives interactive prompt: "Please confirm! [Resident Name] is requesting a video call. Do you wish to proceed? [No] [Yes]".',
      'If caller refuses, resident immediately receives notification: "Caller refused video".',
      'If caller accepts, mobile camera engages over secure WebRTC stream.'
    ],
    mockupType: 'video_request_modal'
  },
  {
    stepNumber: 9,
    title: 'Incoming Video Call Notification & Missed Logs',
    category: 'Resident Controls',
    summary: 'Resident app displays incoming video call with instant door release capabilities.',
    details: [
      'Direct video calls notify resident with full-screen incoming video prompt.',
      'Resident can Answer Video (Green Camera), Remote Unlock Door (Yellow Key), or Decline (Red X).',
      'All missed calls are timestamped and logged with caller identity in the Geokey app notifications feed.'
    ],
    mockupType: 'incoming_video'
  },
  {
    stepNumber: 10,
    title: 'Live Two-Way Video Feed & Remote Door Release',
    category: 'Video & Door Release',
    summary: 'Resident visually confirms caller identity on high-definition video stream and triggers remote door unlock.',
    details: [
      'Resident views crystal-clear live video stream of caller standing outside the entrance plaque.',
      'Resident taps yellow "Unlock" key button to fire gate operator, electric strike, or magnetic lock.',
      'Call cleanly concludes with red "End Call" button once visitor enters.'
    ],
    callout: {
      type: 'success',
      text: 'Complete end-to-end integration: zero dedicated hardware wiring, zero monthly intercom cellular modem fees, and 100% cloud management.'
    },
    mockupType: 'live_video_stream'
  }
];
