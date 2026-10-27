import slide01Img from '../assets/images/gateway-guide/slide_01.png';
import slide02Img from '../assets/images/gateway-guide/slide_02.png';
import slide03Img from '../assets/images/gateway-guide/slide_03.png';
import slide04Img from '../assets/images/gateway-guide/slide_04.png';
import slide05Img from '../assets/images/gateway-guide/slide_05.png';
import slide06Img from '../assets/images/gateway-guide/slide_06.png';
import slide07Img from '../assets/images/gateway-guide/slide_07.png';
import slide08Img from '../assets/images/gateway-guide/slide_08.png';
import slide09Img from '../assets/images/gateway-guide/slide_09.png';
import slide10Img from '../assets/images/gateway-guide/slide_10.png';
import slide11Img from '../assets/images/gateway-guide/slide_11.png';
import slide12Img from '../assets/images/gateway-guide/slide_12.png';

// High-resolution field installation photos uploaded by team
import insideRoofWallMountImg from '../assets/images/gateway-guide/inside_roof_wall_mount.png';
import outsideRoofMountImg from '../assets/images/gateway-guide/outside_roof_mount.png';
import gatewayMountingBracketImg from '../assets/images/gateway-guide/gateway_mounting_bracket.png';
import waterproofPoeAntennaImg from '../assets/images/gateway-guide/waterproof_poe_antenna.png';

export interface GatewayPhotoItem {
  image: string;
  label: string;
  caption?: string;
  tag?: string;
}

export interface GatewayGuideStep {
  stepNumber: string;
  stepTitle: string;
  category: 'Overview' | 'Preparation' | 'Mounting' | 'Wiring' | 'PoE & Data' | 'Verification';
  hasVisualPhoto?: boolean;
  photoImage?: string;
  photoLabel?: string;
  photoCaption?: string;
  photos?: GatewayPhotoItem[];
  slideImage?: string;
  summary: string;
  bulletPoints: {
    title: string;
    description: string;
  }[];
  proTips?: string[];
  warningAlert?: string;
  hardwarePhotos?: {
    caption: string;
    label: string;
    src?: string;
  }[];
  specReference?: { label: string; value: string }[];
}

export const GATEWAY_GUIDE_METADATA = {
  title: 'Quext Smart Community Gateway Installation Guide',
  subtitle: 'Installation Guide for Field Installers & Systems Integrators',
  documentCode: 'QXT-GW-TEKTELIC-v2.4',
  targetDevice: 'TEKTELIC Outdoor LoRaWAN Macro Gateway Base Station (Model QXT-GW-LR8)',
  antennaType: 'High-Gain 915 MHz Omnidirectional LoRaWAN Antenna with N-Type Coax',
  supportHotline: '806-993-3200 • OPTION 4',
  supportEmail: 'support@onequext.com',
  totalPages: 12,
  revisionDate: 'October 2026',
  downloadPdfPath: '/assets/aistudio/Quext_Smart_Community_Gateway_Installer_Guide.pdf',
};

export const GATEWAY_REQUIRED_MATERIALS = [
  { item: '10\' 1/2" EMT Conduit', color: 'Silver', qty: '1 piece (10 ft)', purpose: 'Antenna mast extension above roof parapet or roofline' },
  { item: '2\' 12 GA Unistrut Channel', color: 'Silver', qty: '2 channels (2 ft each)', purpose: 'Heavy-duty wall mounting backplane for gateway & conduit' },
  { item: 'Unistrut Spring Channel Nuts', color: 'Galvanized', qty: '1 package (5 nuts)', purpose: 'Threaded channel clamping for brackets and conduit clamps' },
  { item: '1/2" Universal Pipe Clamps', color: 'Silver steel', qty: '2 clamps', purpose: 'Secures 10\' EMT conduit firmly to the Unistrut channels' },
  { item: 'OEM Gateway Mounting Bracket', color: 'Powder-coated steel', qty: '1 assembly', purpose: 'Custom bracket engineered for TEKTELIC chassis to Unistrut' },
  { item: 'Cat5e / Cat6 Outdoor UV-Rated Cable', color: 'Black/Blue UV', qty: 'Field cut to length', purpose: 'PoE power and Ethernet data backhaul from closet to roof' },
  { item: 'IP67 Waterproof Cable Gland', color: 'Industrial Black', qty: '1 kit (provided)', purpose: 'Water-tight sealing for RJ45 cable entry on gateway base' },
  { item: 'PoE Power Injector', color: 'Black 48V-56V', qty: '1 unit (provided)', purpose: 'Power over Ethernet delivery from data closet network rack' },
  { item: 'Polyurethane / Silicone Sealant', color: 'Clear or gray', qty: '1 tube', purpose: 'Weatherproofing drilled wall anchors and top of Unistrut channels' },
  { item: 'Heavy-Duty Wall Anchors & Fasteners', color: 'Grade 5 / Masonry', qty: '4 to 6 anchors', purpose: 'Lag bolts into wood framing studs or sleeve anchors into masonry' },
];

export const GATEWAY_GUIDE_STEPS: GatewayGuideStep[] = [
  {
    stepNumber: '01',
    stepTitle: 'Guide at a Glance & Scope',
    category: 'Overview',
    slideImage: slide03Img,
    summary: 'High-level deployment roadmap for mounting, wiring, and verifying the Quext Smart Community Gateway across multi-family properties.',
    bulletPoints: [
      {
        title: 'Before you start',
        description: 'Verify all field materials, EMT conduit, Unistrut channels, pipe clamps, and safety gear are on site.',
      },
      {
        title: 'Materials, tools & wall/anchor planning',
        description: 'Inspect the architectural roof parapet or exterior wall substrate before drilling any anchor holes.',
      },
      {
        title: 'Plan the mounting location',
        description: 'Ensure unobstructed line-of-sight across property buildings for the 915 MHz LoRaWAN omni antenna.',
      },
      {
        title: 'Antenna placement and structure',
        description: 'Position mast securely above the roofline with structural clearance away from large metallic HVAC chillers.',
      },
      {
        title: 'Mount the Unistrut',
        description: 'Fasten dual 12 GA Unistrut channels plumb and level with weather-sealed structural anchors.',
      },
    ],
    proTips: [
      'The Quext LoRaWAN gateway serves as the backbone for unit smart thermostats, water leak sensors, and IoT devices across hundreds of feet.',
      'Always install and commission the LoRaWAN gateway FIRST before provisioning residential thermostats or leak sensors.',
    ],
  },
  {
    stepNumber: '02',
    stepTitle: '01 • Before you start: Materials & Tools',
    category: 'Preparation',
    slideImage: slide04Img,
    summary: 'Standardized Bill of Materials required for a durable, weather-resistant outdoor gateway installation.',
    bulletPoints: [
      {
        title: 'Materials for installation',
        description: 'Acquire all specified Unistrut hardware, conduit, and clamps prior to climbing up to the roof staging area.',
      },
      {
        title: '10\' 1/2" EMT conduit — silver',
        description: 'Provides rigid vertical elevation for the LoRa antenna without flexing under high wind loads.',
      },
      {
        title: '2\' 12 GA Unistrut channel — silver (2)',
        description: 'Heavy 12-gauge channel thickness prevents warping and provides solid anchor spread across wall framing.',
      },
      {
        title: 'Unistrut nuts — 1 package of 5',
        description: 'Spring channel nuts allow quick, positive positioning along the channel track.',
      },
      {
        title: '1/2" universal pipe clamps (2)',
        description: 'Secure the 10-foot EMT conduit to both upper and lower Unistrut channels with dual mechanical clamping.',
      },
    ],
    proTips: [
      'Do not substitute light-gauge electrical strut for 12 GA Unistrut—roof parapets experience significant continuous wind shear.',
      'Bring a bubble level, cordless hammer drill, masonry drill bits (5/16" or 3/8"), and torque socket set.',
    ],
    warningAlert: 'Ensure exterior UV-rated Cat5e/Cat6 network cable is used. Standard indoor PVC jacketed Ethernet cable will degrade and crack in outdoor sunlight within 6 months.',
  },
  {
    stepNumber: '03',
    stepTitle: '02 • Plan the mounting location: Inside vs. Outside Parapet',
    category: 'Mounting',
    hasVisualPhoto: true,
    photoImage: insideRoofWallMountImg,
    photoLabel: 'Field Reference: Inside Roof Wall Mount & Outside Roof Mount',
    photoCaption: 'Official field photos: Inside Roof Wall Mount and Outside Roof Mount showing Unistrut and conduit mast extending antenna above roofline.',
    photos: [
      {
        image: insideRoofWallMountImg,
        label: 'Inside Roof Wall Mount',
        caption: 'Inside Roof Wall Mount: Unistrut backplane mounted to interior parapet wall with EMT conduit extending antenna mast above roofline.',
        tag: 'Inside Roof Wall Mount',
      },
      {
        image: outsideRoofMountImg,
        label: 'Outside Roof Mount',
        caption: 'Outside Roof Mount: Exterior building wall installation with ladder access and high antenna mast elevation for 360-degree radio coverage.',
        tag: 'Outside Roof Mount',
      },
    ],
    slideImage: insideRoofWallMountImg,
    summary: 'Identify the ideal mounting geometry: Inside Roof Wall Mount vs. Outside Roof Mount for optimal LoRa RF coverage.',
    bulletPoints: [
      {
        title: 'Choose antenna placement',
        description: 'Select the highest accessible structural elevation on property that provides panoramic radio visibility across all residential buildings.',
      },
      {
        title: 'Line-of-sight elevation',
        description: 'Determine mounting position for direct line-of-sight. The omnidirectional antenna tip should clear the parapet cap by at least 3 to 6 feet.',
      },
      {
        title: 'Identify the wall structure',
        description: 'Inspect whether the parapet is concrete masonry unit (CMU), poured concrete, or wood/metal stud framing with exterior stucco.',
      },
      {
        title: 'Framing vs. Masonry verification',
        description: 'For wood framing, locate the structural studs using a stud sensor. For masonry/CMU, verify solid wall web with a tap or small pilot test hole.',
      },
      {
        title: 'Choose orientation (Inside vs. Outside)',
        description: 'Inside roof wall mount provides protection from street-side sightlines and easier servicing; outside roof mount maximizes radial horizon clearance.',
      },
    ],
    hardwarePhotos: [
      {
        label: 'INSIDE ROOF WALL MOUNT',
        caption: 'Protected inside parapet mounting: Unistrut anchored to roof wall with conduit extending antenna above roofline.',
      },
      {
        label: 'OUTSIDE ROOF MOUNT',
        caption: 'Exterior wall mounting: Ladder access with antenna extended above building cornice for maximum 360-degree RF range.',
      },
    ],
    proTips: [
      'Maintain a minimum of 10 feet separation between the LoRa antenna and cellular base stations or high-power commercial Wi-Fi APs to avoid RF receiver desense.',
      'Check that the planned cable route from roof to data closet does not exceed the 328-foot (100-meter) Ethernet PoE distance limit.',
    ],
  },
  {
    stepNumber: '04',
    stepTitle: '03 • Mark, drill & seal: Weatherproof Anchoring',
    category: 'Mounting',
    slideImage: slide06Img,
    summary: 'Proper layout, pilot drilling, and sealant application to guarantee zero roof leaks and structural stability.',
    bulletPoints: [
      {
        title: 'Mark mounting points',
        description: 'Hold the first Unistrut channel against the wall at the designated height, check plumb and level, and mark anchor points through pre-punched slots.',
      },
      {
        title: 'Vertical spacing',
        description: 'Space the two 2-foot Unistrut channels 12 to 18 inches apart vertically to provide a wide, stable mechanical lever arm for the 10-foot EMT conduit.',
      },
      {
        title: 'Drill for the wall type',
        description: 'Wood framing: pre-drill into structural studs with a pilot hole slightly smaller than the lag bolt diameter. Masonry: use a rotary hammer drill and drill to proper anchor depth.',
      },
      {
        title: 'Clean the anchor holes',
        description: 'Blow out masonry dust from drilled holes using compressed air or a bulb blower to ensure anchor expansion sleeves bite cleanly.',
      },
      {
        title: 'Apply sealant generously',
        description: 'Inject outdoor silicone or polyurethane roofing sealant directly into each drilled hole and around the anchor flange before driving fasteners.',
      },
    ],
    warningAlert: 'Never drill into roof flashing, parapet coping caps, or roofing membrane boots. All mount holes must be in vertical structural wall substrate.',
  },
  {
    stepNumber: '05',
    stepTitle: '04 • Mount the Unistrut & antenna Mast',
    category: 'Mounting',
    slideImage: slide07Img,
    summary: 'Securing the dual channel backplane and clamping the 10-foot EMT mast with universal pipe clamps.',
    bulletPoints: [
      {
        title: 'Secure the Unistrut channels',
        description: 'Place both 2-foot channels back against the sealed holes, align fasteners, and drive lag bolts or masonry expansion sleeves securely.',
      },
      {
        title: 'Tighten carefully without crushing',
        description: 'Torque fasteners snugly to compress sealant against the wall without bowing the Unistrut profile or fracturing masonry stucco.',
      },
      {
        title: 'Insert universal pipe clamps',
        description: 'Slide two 1/2" universal pipe clamps into the Unistrut channel tracks—one clamp on the upper channel and one on the lower channel.',
      },
      {
        title: 'Clamp the 10\' EMT conduit mast',
        description: 'Seat the conduit into the pipe clamps, verify true vertical plumb with a torpedo level on two axes, and torque clamp bolts firmly.',
      },
      {
        title: 'Attach the LoRa omni antenna',
        description: 'Mount the fiberglass omnidirectional antenna to the top of the EMT mast with its supplied U-bolts, keeping the antenna radiating element completely clear of metallic conduit.',
      },
    ],
    proTips: [
      'The antenna radiating fiberglass cylinder must extend entirely ABOVE the top of the metal EMT conduit. If the metal pipe runs alongside the fiberglass cylinder, it will severely distort the 915 MHz radiation pattern.',
    ],
  },
  {
    stepNumber: '06',
    stepTitle: '05 • Reference: Gateway Bracket Mounting',
    category: 'Mounting',
    hasVisualPhoto: true,
    photoImage: gatewayMountingBracketImg,
    photoLabel: 'Field Reference: Gateway Chassis Bracket Mounting to Unistrut',
    photoCaption: 'Official installation photo showing the powder-coated bracket secured to the horizontal Unistrut channels on a parapet roof wall.',
    photos: [
      {
        image: gatewayMountingBracketImg,
        label: 'Gateway Mounting Bracket',
        caption: 'Technician securing the dual-arm bracket to the horizontal Unistrut channels on a parapet roof wall.',
        tag: 'Gateway Mounting Bracket',
      },
    ],
    slideImage: gatewayMountingBracketImg,
    summary: 'Mounting the heavy-duty TEKTELIC chassis bracket to the lower Unistrut channel for easy servicing and cooling.',
    bulletPoints: [
      {
        title: 'Use the supplied OEM bracket',
        description: 'The powder-coated bracket is precision-punched to mate directly with the rear heatsink boss mounting holes on the TEKTELIC chassis.',
      },
      {
        title: 'Fasten to Unistrut track',
        description: 'Secure the bracket to the Unistrut channel using supplied spring channel nuts and Grade 5 hex bolts with lock washers.',
      },
      {
        title: 'Heatsink airflow orientation',
        description: 'Position the gateway enclosure with the vertical heatsink cooling fins oriented vertically to allow natural convective airflow.',
      },
      {
        title: 'Bottom port clearance',
        description: 'Ensure at least 6 to 8 inches of clearance below the gateway enclosure to allow easy insertion of the waterproof PoE connector and antenna coax.',
      },
    ],
    hardwarePhotos: [
      {
        label: 'GATEWAY MOUNTING BRACKET',
        caption: 'Technician securing the dual-arm bracket to the horizontal Unistrut channel on a parapet roof wall.',
      },
    ],
  },
  {
    stepNumber: '07',
    stepTitle: '06 • Gateway Wiring: Waterproof PoE & Antenna Connection',
    category: 'Wiring',
    hasVisualPhoto: true,
    photoImage: waterproofPoeAntennaImg,
    photoLabel: 'Field Reference: Waterproof PoE Cable Gland & Antenna Drip Loop',
    photoCaption: 'Official installation photo showing bottom view of gateway chassis with IP67 sealed compression gland for PoE and heavy-gauge N-type RF antenna coax with drip loop.',
    photos: [
      {
        image: waterproofPoeAntennaImg,
        label: 'Waterproof PoE & Antenna Connection',
        caption: 'Bottom view of gateway chassis showing the sealed compression gland for PoE and the heavy-gauge N-type antenna coaxial cable with drip loop.',
        tag: 'Waterproof PoE & Antenna Connection',
      },
    ],
    slideImage: waterproofPoeAntennaImg,
    summary: 'Assembling the IP67 water-tight connector gland, terminating T568B RJ45, and dressing the N-type RF antenna coaxial cable.',
    bulletPoints: [
      {
        title: 'Route the network cable',
        description: 'Bring the outdoor UV-rated Cat5e/Cat6 cable from the roof penetration conduit over to the bottom of the gateway enclosure.',
      },
      {
        title: 'Pass cable through water-tight gland',
        description: 'Slide gland compression nut, rubber sealing grommet, and gland body onto the raw cable BEFORE crimping the RJ45 connector.',
      },
      {
        title: 'Terminate using T568B pinout standard',
        description: 'Strip jacket 1/2", untwist pairs minimally, and crimp RJ45 using strict EIA/TIA-568B: Orange-White, Orange, Green-White, Blue, Blue-White, Green, Brown-White, Brown.',
      },
      {
        title: 'Connect RJ45 to Gateway PoE port',
        description: 'Click RJ45 firmly into the gateway internal Ethernet jack until the locking tab engages, push gland body into port, and hand-tighten compression nut until the rubber grommet compresses snugly.',
      },
      {
        title: 'Connect RF antenna coaxial cable',
        description: 'Thread the low-loss coaxial cable from the antenna to the gateway N-type RF connector, torque hand-tight plus 1/4 turn, and form a downward moisture drip loop.',
      },
    ],
    hardwarePhotos: [
      {
        label: 'WATERPROOF POE & ANTENNA CONNECTION',
        caption: 'Bottom view of gateway chassis showing the sealed compression gland for PoE and the heavy-gauge N-type antenna coaxial cable with drip loop.',
      },
    ],
    warningAlert: 'Failure to slide the waterproof connector gland onto the cable before crimping the RJ45 will require cutting and re-crimping the cable. Never skip the rubber compression grommet.',
  },
  {
    stepNumber: '08',
    stepTitle: '07 • Data Closet Connection: PoE Injector & LAN Backhaul',
    category: 'PoE & Data',
    slideImage: slide10Img,
    summary: 'Terminating the data closet head-end, connecting the provided PoE power injector, and linking to the property switch or router.',
    bulletPoints: [
      {
        title: 'Connect the gateway cable in data closet',
        description: 'Dress the incoming roof cable cleanly down the equipment rack or wallboard into the network punchdown or patch panel.',
      },
      {
        title: 'Terminate data-closet end with T568B',
        description: 'Crimp the closet RJ45 or punch down to keystone jack using the identical T568B wiring scheme used at the roof gateway.',
      },
      {
        title: 'Connect to PoE injector POE port',
        description: 'Plug the cable coming directly from the roof gateway into the port labeled "POE" on the provided 48V-56V PoE injector.',
      },
      {
        title: 'Connect LAN port to router/switch',
        description: 'Run a standard patch cable from the port labeled "LAN" or "DATA" on the PoE injector into the property network switch or dedicated Quext cellular router.',
      },
      {
        title: 'Plug PoE injector into surge-protected AC power',
        description: 'Connect PoE injector AC power cord to an unswitched outlet on the property uninterruptible power supply (UPS).',
      },
    ],
    proTips: [
      'CRITICAL: NEVER plug the network switch into the POE port of the injector. Doing so can damage standard non-PoE network switch ports.',
      'Always use a UPS battery backup outlet so transient brownouts do not disconnect the entire property IoT mesh.',
    ],
  },
  {
    stepNumber: '09',
    stepTitle: '08 • Final Checks: Pre-Power Inspection',
    category: 'Verification',
    slideImage: slide11Img,
    summary: 'Comprehensive 5-point mechanical and electrical checklist before requesting cloud provisioning from Quext Support.',
    bulletPoints: [
      {
        title: '1. All fasteners are tight',
        description: 'Verify lag bolts, Unistrut nuts, pipe clamps, and gateway chassis bolts are torqued down firmly.',
      },
      {
        title: '2. Antenna is level and secure',
        description: 'Check that the EMT mast and antenna are plumb on both axes with zero wobble under manual shake test.',
      },
      {
        title: '3. Top of Unistrut is sealed as needed',
        description: 'Cap or seal the upper channel ends to prevent rainwater accumulation and internal corrosion inside the strut.',
      },
      {
        title: '4. Gateway-side cable enters through water-tight connector',
        description: 'Confirm compression gland nut is fully seated and rubber grommet has created a tight cylindrical seal around the jacket.',
      },
      {
        title: '5. RJ45 termination follows T568B',
        description: 'Verify both roof and closet terminations tested 1:1 on a pin-to-pin network cable tester with zero crossed pairs or open conductors.',
      },
    ],
  },
  {
    stepNumber: '10',
    stepTitle: 'Finish: Ready to Go & Cloud Verification',
    category: 'Verification',
    slideImage: slide12Img,
    summary: 'Final completion check and live verification with Quext Implementation Support at 806-993-3200 • OPTION 4.',
    bulletPoints: [
      {
        title: '01 MOUNTING: Secure & sealed',
        description: 'Structural integrity verified, roof penetrations silicone-sealed, conduit clamped at 2 Unistrut levels.',
      },
      {
        title: '02 WIRING: Gateway & PoE connected',
        description: 'T568B pinout verified on cable tester, waterproof gland sealed, PoE power indicator LED solid green.',
      },
      {
        title: '03 CONNECTIVITY: Verify with Quext Support',
        description: 'Call Quext Support directly from the field while still on site to confirm gateway cloud telemetry and RSSI status.',
      },
    ],
    proTips: [
      'Have the Gateway MAC Address and Serial Number (printed on the chassis barcode label) ready when calling Quext Support.',
      'Quext Support can immediately ping the gateway, check LoRa packet reception from nearby test nodes, and give you field sign-off.',
    ],
  },
];
