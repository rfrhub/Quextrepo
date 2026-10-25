export interface LeakStep {
  stepNumber: number;
  phase: string;
  category: 'Preparation' | 'Mechanical Installation' | 'Testing & Verification' | 'Portal Provisioning';
  title: string;
  summary: string;
  timeEstimate: string;
  toolsRequired: string[];
  keyActions: string[];
  fieldWarning?: string;
  proTip?: string;
  hardwareFocus: 'SI-Toilet Sensor' | 'SI-Leak Probe' | 'Quext LoRaWAN Hub' | 'Both';
}

export interface TroubleshootingCase {
  id: string;
  symptom: string;
  potentialCause: string;
  fieldAction: string[];
  severity: 'Critical' | 'Warning' | 'Informational';
}

export interface SensorSpec {
  model: string;
  name: string;
  network: string;
  batteryLife: string;
  dimensions: string;
  operatingTemp: string;
  waterDetectionThreshold: string;
  warranty: string;
}

export const LEAK_SENSOR_SPECS: Record<string, SensorSpec> = {
  toiletSensor: {
    model: 'SI-FLUSH-01 / SI-TOILET-V2',
    name: 'Sensor Industries In-Line Toilet Run & Flush Sensor',
    network: 'SI-Mesh / LoRaWAN to Quext Smart Thermostat Hub',
    batteryLife: '7+ Years (Pre-installed industrial lithium cell)',
    dimensions: '2.4" H x 1.4" W (7/8" Ballcock Female to 7/8" Male)',
    operatingTemp: '32°F to 140°F (Indoor plumbing)',
    waterDetectionThreshold: 'Dynamic magnetic shuttle flow detection (>0.1 GPM)',
    warranty: 'Commercial Multifamily 5-Year OEM Warranty'
  },
  surfaceProbe: {
    model: 'SI-LEAK-01',
    name: 'Sensor Industries Point-of-Use Surface Leak Detector',
    network: 'SI-Mesh / LoRaWAN to Quext Smart Thermostat Hub',
    batteryLife: '8+ Years (Replaceable CR2450 / Lithium Pack)',
    dimensions: '2.1" Diameter x 0.6" Height',
    operatingTemp: '14°F to 140°F',
    waterDetectionThreshold: '1/16" standing water puddle / dual gold-plated pins',
    warranty: 'Commercial Multifamily 5-Year OEM Warranty'
  }
};

export const TOILET_INSTALLATION_STEPS: LeakStep[] = [
  {
    stepNumber: 1,
    phase: 'Phase 1: Water Isolation',
    category: 'Preparation',
    title: 'Shut Off Water Supply at Angle Stop & Depressurize',
    summary: 'Isolate the domestic cold water supply line to prevent water spillage before breaking the fill valve coupling.',
    timeEstimate: '30 seconds',
    toolsRequired: ['Hand towel or microfiber rag', 'Shallow catchment bowl'],
    keyActions: [
      'Locate the chrome or brass angle stop valve situated behind or beside the toilet base.',
      'Turn the valve handle clockwise until completely seated and closed.',
      'Flush the toilet once to discharge water from the tank into the bowl, depressurizing the line.',
      'Hold the flush lever down until the tank finishes draining down to its residual sill level.'
    ],
    fieldWarning: 'If the angle stop does not shut off completely due to mineral buildup, do not force it with pliers. Notify property maintenance to isolate the unit riser.',
    proTip: 'A shallow plastic bowl placed directly under the tank fitting catches the few tablespoons of residual water trapped in the fill valve shank.',
    hardwareFocus: 'SI-Toilet Sensor'
  },
  {
    stepNumber: 2,
    phase: 'Phase 2: Supply Line Decoupling',
    category: 'Mechanical Installation',
    title: 'Disconnect Existing Flexible Supply Line',
    summary: 'Loosen and detach the existing 7/8" ballcock supply nut while stabilizing the fill valve inside the tank.',
    timeEstimate: '45 seconds',
    toolsRequired: ['Catchment bowl', 'Clean dry rag'],
    keyActions: [
      'Position the catchment bowl directly below the bottom male shank of the toilet fill valve.',
      'Reach one hand into or at the base of the tank to grip the fill valve top bushing, preventing the valve assembly from spinning.',
      'Using your other hand, hand-loosen the 7/8" female nut on the flexible supply line counter-clockwise.',
      'Allow residual line water to drip into the bowl and wipe the exposed threads dry with a rag.',
      'Inspect the internal black rubber cone washer inside the supply line nut for cracks, hardening, or debris.'
    ],
    fieldWarning: 'Always stabilize the internal fill valve with your upper hand! Allowing the fill valve to spin can misalign the float arm or loosen the bottom tank gasket, causing tank leaks.',
    hardwareFocus: 'SI-Toilet Sensor'
  },
  {
    stepNumber: 3,
    phase: 'Phase 3: Sensor Activation',
    category: 'Preparation',
    title: 'Pull Activation Zip Tie & Verify Magnetic Shuttle',
    summary: 'Energize the onboard lithium battery and mechanically verify that the internal flow-detection piston moves freely.',
    timeEstimate: '30 seconds',
    toolsRequired: ['Pre-enrolled SI-Toilet Sensor'],
    keyActions: [
      'Confirm the sensor QR code/barcode matches the assigned apartment unit on your work order.',
      'Firmly pull the plastic activation zip tie / pull-tab straight out from the sensor housing to engage the battery circuit.',
      'Gently rock and shake the sensor up and down in your hand.',
      'Listen for the distinct audible click of the internal magnetic shuttle sliding inside the chamber. This confirms the piston is uninhibited.'
    ],
    fieldWarning: 'If you do NOT hear the magnetic shuttle click when rocking the sensor, do not install it. The piston may be mechanically bound. Set aside for exchange.',
    proTip: 'The sensor is shipped in ultra-low power sleep mode. Removing the zip tie wakes the LoRaWAN transceiver to ping the Quext Thermostat Gateway.',
    hardwareFocus: 'SI-Toilet Sensor'
  },
  {
    stepNumber: 4,
    phase: 'Phase 4: Sensor Coupling',
    category: 'Mechanical Installation',
    title: 'Hand-Thread Sensor Onto Tank Fill Valve Shank',
    summary: 'Seat the top female collar of the sensor onto the toilet fill valve shank without over-torquing.',
    timeEstimate: '45 seconds',
    toolsRequired: ['Clean hands only (No tools permitted)'],
    keyActions: [
      'Verify that the internal silicone sealing washer is seated flat inside the top female collar of the sensor.',
      'Align the sensor vertically directly underneath the fill valve shank at the base of the tank.',
      'Carefully engage the threads clockwise by hand, ensuring the sensor threads smoothly without cross-threading.',
      'Hand-tighten until snug and firmly seated against the shank gasket.'
    ],
    fieldWarning: 'CRITICAL OEM RULE: HAND-TIGHTEN ONLY! NEVER use pliers, channel locks, or adjustable wrenches. Overtightening will fracture the composite plastic collar and void the warranty.',
    proTip: 'Orientation: Position the sensor so its barcode/label faces forward or outward, making future optical auditing quick and painless.',
    hardwareFocus: 'SI-Toilet Sensor'
  },
  {
    stepNumber: 5,
    phase: 'Phase 5: Line Reconnection',
    category: 'Mechanical Installation',
    title: 'Reconnect Flexible Supply Line to Sensor Base',
    summary: 'Thread the flexible water supply line to the bottom male 7/8" outlet of the sensor.',
    timeEstimate: '45 seconds',
    toolsRequired: ['Clean dry rag'],
    keyActions: [
      'Align the existing flexible water line nut with the bottom male threads of the installed SI sensor.',
      'While holding the sensor body with one hand to prevent it from twisting, hand-tighten the supply nut clockwise.',
      'Tighten until the supply line cone washer seats firmly against the sensor base.',
      'Verify that the flexible braided line has a natural gentle bend with no kink or sharp twist.'
    ],
    fieldWarning: 'Do not twist or torque the sensor body while tightening the supply nut. Hold the sensor body firmly in place.',
    hardwareFocus: 'SI-Toilet Sensor'
  },
  {
    stepNumber: 6,
    phase: 'Phase 6: Pressure & Moisture Inspection',
    category: 'Testing & Verification',
    title: 'Pressurize System & Inspect All Joints for Leaks',
    summary: 'Restore water line pressure slowly and verify 100% moisture-free sealing at all connection points.',
    timeEstimate: '60 seconds',
    toolsRequired: ['Clean dry white paper towel or microfiber cloth'],
    keyActions: [
      'Thoroughly wipe down all fittings, threads, and the sensor housing with a dry towel so all surfaces are completely bone-dry.',
      'Slowly open the angle stop valve counter-clockwise, allowing water to fill the tank smoothly.',
      'Once the tank is fully pressurized and the fill valve shuts off, visually inspect both upper and lower threaded collars.',
      'Wrap a dry white paper towel around the connections for 15 seconds. Check for any wet spots, drops, or weeping.'
    ],
    fieldWarning: 'If any drip or bead of water appears, shut off the angle stop immediately. Loosen and re-seat the nut. Check for a pinched cone washer.',
    hardwareFocus: 'SI-Toilet Sensor'
  },
  {
    stepNumber: 7,
    phase: 'Phase 7: Telemetry & Flush Verification',
    category: 'Testing & Verification',
    title: 'Conduct Verification Flush & Verify Gateway Check-in',
    summary: 'Execute a test flush to witness the magnetic flow shuttle in action and verify real-time portal logging.',
    timeEstimate: '90 seconds',
    toolsRequired: ['Smartphone / Quext Portal Mobile View'],
    keyActions: [
      'Flush the toilet and listen closely to the sensor body.',
      'As water flows into the tank, water pressure lifts the internal magnet, closing the reed switch circuit to start cycle timing.',
      'When the water reaches the tank waterline and the fill valve snaps shut, listen for the magnet to drop back to its resting seat.',
      'Open the Quext IoT Portal on your phone, navigate to Devices -> Leak Sensors, and verify the latest flush event was logged with RSSI signal > -105 dBm.'
    ],
    fieldWarning: 'If the magnet does not drop after the tank stops filling, the toilet flapper may be leaking water into the bowl, causing constant flow. Replace the flapper.',
    proTip: 'The Sensor Industries sensor accurately detects micro-leaks as small as 0.05 gallons per hour (flapper leak) that are otherwise silent and invisible!',
    hardwareFocus: 'Both'
  }
];

export const POINT_OF_USE_LEAK_LOCATIONS = [
  {
    zone: 'Kitchen Sink Under-Cabinet',
    targetSource: 'Garbage disposal vibration looseness, P-trap joints, dishwasher supply line.',
    placementProtocol: 'Place sensor flat on cabinet floor directly under the P-trap and disposal drain tailpiece. Ensure gold pins touch wood surface.',
    priority: 'High Priority (Primary property claim source)'
  },
  {
    zone: 'Master & Guest Bath Vanities',
    targetSource: 'Sink pop-up drain assembly, supply flex hoses, shutoff angle stops.',
    placementProtocol: 'Position beneath the lowest point of the hot/cold shutoff valves. Avoid resting on stored bottles or cleaning caddies.',
    priority: 'High Priority'
  },
  {
    zone: 'Water Heater Catchment Pan',
    targetSource: 'Tank temperature/pressure relief (T&P) valve blowoff, tank seam degradation, inlet dielectric union leaks.',
    placementProtocol: 'Rest sensor inside the metal or composite catchment pan directly underneath the T&P drain pipe drop.',
    priority: 'Critical (Catastrophic flood prevention)'
  },
  {
    zone: 'HVAC Air Handler Condensate Pan',
    targetSource: 'Clogged primary condensate drain line, slime algae blockage, secondary drain pan overflow.',
    placementProtocol: 'Place inside the secondary emergency drain pan beneath the evaporator coil cabinet.',
    priority: 'Critical (Ceiling collapse & drywall damage prevention)'
  },
  {
    zone: 'Laundry Washing Machine Tray',
    targetSource: 'High-pressure rubber hose rupture, pump seal wear, drain standpipe overflow.',
    placementProtocol: 'Center sensor inside the recessed washer pan beneath the rear water supply connections.',
    priority: 'High Priority'
  }
];

export const TROUBLESHOOTING_CASES: TroubleshootingCase[] = [
  {
    id: 'ts-01',
    symptom: 'Quext Portal triggers "Continuous Water Flow / Running Toilet" alarm on newly installed unit',
    potentialCause: 'Worn or warped flapper valve allowing water to leak into the bowl; fill valve water level set higher than overflow tube; or sensor shuttle hung up on debris.',
    fieldAction: [
      'Check water level in tank: Ensure water stops 1/2" to 1" below the top of the overflow tube.',
      'Perform food coloring or dye tablet test: Put 3 drops of blue food coloring in tank. If blue water appears in bowl without flushing, the flapper is leaking.',
      'Replace flapper with a rigid 2" or 3" commercial silicone flapper.',
      'If flapper is tight, isolate water, remove sensor, and shake to ensure debris did not wash in from the supply line.'
    ],
    severity: 'Critical'
  },
  {
    id: 'ts-02',
    symptom: 'Weeping or slow moisture drip at upper or lower sensor collar',
    potentialCause: 'Cone washer not seated flat, cross-threaded plastic collar, or fitting overtightened causing thread distortion.',
    fieldAction: [
      'Turn off angle stop and flush toilet to drain residual pressure.',
      'Disconnect fitting and inspect threads on the tank shank and supply line.',
      'Ensure the internal black sealing washer is centered inside the sensor female inlet.',
      'Re-thread strictly by HAND. Do NOT use thread tape (Teflon) on ballcock compression threads — the rubber washer creates the seal.'
    ],
    severity: 'Warning'
  },
  {
    id: 'ts-03',
    symptom: 'Sensor shows "Offline" or fails to transmit flush events in Quext Portal',
    potentialCause: 'Zip tie was not fully pulled out; LoRaWAN distance/attenuation from nearest Thermostat Hub; or unit thermostat is powered down.',
    fieldAction: [
      'Verify that the plastic battery pull-tab came out cleanly and no plastic tab remnant is wedged in the contact.',
      'Check that the apartment Quext Smart Thermostat (QXT100048) is powered on and displaying normal HVAC status.',
      'The thermostat serves as the local LoRaWAN / SI-Mesh gateway for all in-unit sensors.',
      'Trigger a test transmission by performing 2 consecutive flushes 60 seconds apart.'
    ],
    severity: 'Warning'
  },
  {
    id: 'ts-04',
    symptom: 'Point-of-Use Surface Leak Sensor triggers false alarm on dry cabinet floor',
    potentialCause: 'Dust containing conductive mineral residue, metallic cleaner residue, or uneven surface shorting gold pins.',
    fieldAction: [
      'Wipe down bottom gold contact pins with 70% isopropyl alcohol and dry thoroughly.',
      'Wipe the floor/shelf surface clean of all dust and residue.',
      'Ensure sensor sits flat on all 3 base pads so pins do not contact metal staples or screws in cabinet flooring.'
    ],
    severity: 'Informational'
  }
];

export const PORTAL_AUTOMATION_RULES = {
  title: 'Quext IoT Leak & Water Waste Automation Rules',
  description: 'Automated 24/7 incident dispatch engine connecting Sensor Industries field telemetry to on-call maintenance teams.',
  triggerTypes: [
    {
      name: 'Active Liquid Leak (Surface Probe)',
      threshold: 'Instantaneous contact (1/16" liquid layer)',
      action: 'High-priority SMS dispatch + Push alert + Email to Property Maintenance Emergency Roster'
    },
    {
      name: 'Continuous Toilet Running (Fill Valve / Flapper)',
      threshold: 'Uninterrupted flow exceeding 15 minutes',
      action: 'Generates urgent work ticket in Quext Portal + SMS alert to Unit Maintenance Lead'
    },
    {
      name: 'Abnormal Cycle Frequency (Ghost Flushing)',
      threshold: '> 6 unprompted fill cycles within 2 hours',
      action: 'Flags flapper replacement work order on morning technician dashboard'
    },
    {
      name: 'Low Battery / Hardware Health',
      threshold: 'Battery voltage drops below 15%',
      action: 'Schedules low-priority maintenance swap during scheduled preventative maintenance'
    }
  ]
};
