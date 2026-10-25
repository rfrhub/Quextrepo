import React, { useState } from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, Layers, Zap, Play, RotateCcw, Eye, Sparkles } from 'lucide-react';

export type SchematicId =
  | 'strike_12v_direct'
  | 'strike_24v_rbsn'
  | 'double_rc_in_out'
  | 'elevator_inside_rb5'
  | 'elevator_outside_stairwell'
  | 'ps914_panic_bar'
  | 'butterfly_intercom';

export interface WireDefinition {
  pin: number;
  color: string;
  hex: string;
  strokeClass?: string;
  name: string;
  gauge: string;
  connectedTo: string;
  functionDesc: string;
  voltage: string;
  isUsed: boolean;
}

export interface SchematicConfig {
  id: SchematicId;
  tabLabel: string;
  sheetTitle: string;
  projectNumber: string;
  drawnBy: string;
  checkedBy: string;
  sheetNumber: string;
  dateStr: string;
  summaryNote: string;
  specNotes: string[];
  fieldRules: string[];
  wires: WireDefinition[];
}

export const SCHEMATIC_CONFIGS: SchematicConfig[] = [
  // 1. 12VDC Electric Strike Direct Wiring (RCElectricStrike12VDCand24VDC.pdf)
  {
    id: 'strike_12v_direct',
    tabLabel: '1. 12VDC Strike (Direct)',
    sheetTitle: 'Complete Wiring Diagram - 12VDC Electric Strike Direct Wiring',
    projectNumber: 'RC.PwrSup.EDK.Strike-12VDC',
    drawnBy: 'Raul Recalde',
    checkedBy: 'Raul Recalde',
    sheetNumber: 'HB-001',
    dateStr: 'AUG 2026',
    summaryNote:
      'To wire without the RBSN wire red and black to the red and black of the strike for 12 V applications. The RBSN is only needed if the strike is operating off of 24VDC.',
    specNotes: [
      'The RBSN is only needed if the strike is operating off of 24VDC.',
      'To wire without the RBSN, wire RED and BLACK directly to the red and black of the strike for 12 V applications.',
      'BackEMF Diode Assembly MUST be installed close to strike (cathode silver band to Red +, anode to Black -).',
      'All other 6 wires (Orange, Yellow, White, Blue, Green, Brown): Isolate and insulate wires not used.',
      'Depending on NO or NC reach out to Homebase / Quext to configure the Reader to trigger the Hardware in software.',
    ],
    fieldRules: [
      'PoE switch delivers power to reader controller via Cat5e/6.',
      'Reader supplies conditioned 12VDC directly (up to 600mA).',
      'Never send external 24VDC to this direct circuit.',
    ],
    wires: [
      { pin: 1, color: 'Red', hex: '#EF4444', name: 'Pin 1: Red', gauge: '22 AWG', connectedTo: 'Electric Strike RED (+12VDC)', functionDesc: '12VDC Switched Lock Power Output', voltage: '+12VDC (Switched)', isUsed: true },
      { pin: 2, color: 'Black', hex: '#18181B', name: 'Pin 2: Black', gauge: '22 AWG', connectedTo: 'Electric Strike BLACK (GND -)', functionDesc: 'Lock Ground / Common Return', voltage: '0V (Ground)', isUsed: true },
      { pin: 3, color: 'Orange', hex: '#F97316', name: 'Pin 3: Orange', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Auxiliary 12VDC Continuous Output', voltage: '+12VDC Const (Unused)', isUsed: false },
      { pin: 4, color: 'Yellow', hex: '#FACC15', name: 'Pin 4: Yellow', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'EDK RS-485 Data A / Comm', voltage: 'Logic Data (Unused)', isUsed: false },
      { pin: 5, color: 'White', hex: '#F8FAFC', name: 'Pin 5: White', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'EDK RS-485 Data B / Comm', voltage: 'Logic Data (Unused)', isUsed: false },
      { pin: 6, color: 'Blue', hex: '#3B82F6', name: 'Pin 6: Blue', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'REX Request to Exit Input', voltage: 'Dry Sense (Unused)', isUsed: false },
      { pin: 7, color: 'Green', hex: '#22C55E', name: 'Pin 7: Green', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'DPS Door Position Sensor Input', voltage: 'Dry Sense (Unused)', isUsed: false },
      { pin: 8, color: 'Brown', hex: '#A16207', name: 'Pin 8: Brown', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Auxiliary Signal Ground / Comm', voltage: 'Common (Unused)', isUsed: false },
    ],
  },

  // 2. 24VDC Strike with Altronix RBSN Relay (RCElectricStrike12VDCand24VDC.pdf)
  {
    id: 'strike_24v_rbsn',
    tabLabel: '2. 24VDC Strike (RBSN)',
    sheetTitle: 'Complete Wiring Diagram - 24VDC Electric Strike with RBSN Relay',
    projectNumber: 'RC.PwrSup.EDK.Strike-24VDC-RBSN',
    drawnBy: 'Raul Recalde',
    checkedBy: 'Raul Recalde',
    sheetNumber: 'HB-002',
    dateStr: 'AUG 2026',
    summaryNote:
      'The RBSN is only needed if the strike is operating off of 24VDC. The reader itself maxes out at 12 VDC supply; the RBSN relay handles the 24VDC external isolation.',
    specNotes: [
      'The RBSN is strictly required when the strike operates on 24VDC. Never send 24VDC directly to the RC-15 reader.',
      'Red wire from RC-15 connects to POS + on the RBSN relay; Black wire connects to NEG - on the RBSN relay.',
      'External 24VDC Power Supply: +24VDC wire feeds into C (Common); NO terminal feeds Red wire of 24V strike.',
      'Power Supply (-) connects directly to Black wire of 24V strike.',
      'BackEMF Diode Assembly must be installed close to strike (cathode silver band to Red +, anode to Black -).',
      'Depending on NO or NC reach out to Homebase / Quext to configure the Reader to trigger the Hardware in cloud software.',
    ],
    fieldRules: [
      'Reader trigger coil: 12VDC on RBSN POS/NEG.',
      'External power: 24VDC connected across C and Lock.',
      'Isolate unused Orange, Yellow, White, Blue, Green, Brown wires.',
    ],
    wires: [
      { pin: 1, color: 'Red', hex: '#EF4444', name: 'Pin 1: Red', gauge: '22 AWG', connectedTo: 'RBSN Relay POS (+) Terminal', functionDesc: 'Reader 12VDC Trigger Pulse to Relay Coil (+)', voltage: '+12VDC (Trigger)', isUsed: true },
      { pin: 2, color: 'Black', hex: '#18181B', name: 'Pin 2: Black', gauge: '22 AWG', connectedTo: 'RBSN Relay NEG (-) Terminal', functionDesc: 'Reader Trigger Common Ground Return (-)', voltage: '0V (Trigger GND)', isUsed: true },
      { pin: 3, color: 'Orange', hex: '#F97316', name: 'Pin 3: Orange', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Auxiliary 12VDC Continuous Output', voltage: 'Unused', isUsed: false },
      { pin: 4, color: 'Yellow', hex: '#FACC15', name: 'Pin 4: Yellow', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'EDK RS-485 Data A / Comm', voltage: 'Unused', isUsed: false },
      { pin: 5, color: 'White', hex: '#F8FAFC', name: 'Pin 5: White', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'EDK RS-485 Data B / Comm', voltage: 'Unused', isUsed: false },
      { pin: 6, color: 'Blue', hex: '#3B82F6', name: 'Pin 6: Blue', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'REX Request to Exit Input', voltage: 'Unused', isUsed: false },
      { pin: 7, color: 'Green', hex: '#22C55E', name: 'Pin 7: Green', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'DPS Door Position Sensor Input', voltage: 'Unused', isUsed: false },
      { pin: 8, color: 'Brown', hex: '#A16207', name: 'Pin 8: Brown', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Auxiliary Signal Ground / Comm', voltage: 'Unused', isUsed: false },
    ],
  },

  // 3. Double RC In & Out with RBSN Relay (DoubleRC.RBSN-STrike-INandOUT.pdf)
  {
    id: 'double_rc_in_out',
    tabLabel: '3. Double RC (In & Out)',
    sheetTitle: 'Double RC Electric Strike (In & Out Readers) with RBSN Relay',
    projectNumber: 'RC.EDK-ST-INOUT',
    drawnBy: 'Raul Recalde',
    checkedBy: 'Raul Recalde',
    sheetNumber: 'HB-003',
    dateStr: 'AUG 2026',
    summaryNote:
      'Dual RC reader controllers configured for bidirectional ingress and egress control. Both readers splice together in parallel to trigger a single RBSN relay and electric strike.',
    specNotes: [
      'Inbound RC-15 and Outbound RC-15 both receive dedicated Cat5e/6 PoE cables from the PoE switch.',
      'Reader 1 (IN) RED wire and Reader 2 (OUT) RED wire splice together with a wire-nut to RBSN POS (+).',
      'Reader 1 (IN) BLACK wire and Reader 2 (OUT) BLACK wire splice together with a wire-nut to RBSN NEG (-).',
      'All other 6 wires on BOTH readers are isolated and insulated individually.',
      'External Power Supply +24VDC connects to C (Common) on RBSN; NO connects to Strike RED.',
      'Power Supply (-) connects to Strike BLACK. BackEMF diode across strike leads.',
      'Valid presentation at EITHER reader triggers the shared strike plate.',
    ],
    fieldRules: [
      'Parallel trigger connection: RED+RED to POS(+), BLACK+BLACK to NEG(-).',
      'Dual PoE drops: Never try to split a single PoE cable between two readers.',
      'Software configuration: Inbound and Outbound MAC addresses mapped to same door asset.',
    ],
    wires: [
      { pin: 1, color: 'Red', hex: '#EF4444', name: 'Red (Both Readers)', gauge: '22 AWG Spliced', connectedTo: 'RBSN Relay POS (+) Terminal', functionDesc: 'Parallel 12VDC Strike Trigger Leg', voltage: '+12VDC Spliced', isUsed: true },
      { pin: 2, color: 'Black', hex: '#18181B', name: 'Black (Both Readers)', gauge: '22 AWG Spliced', connectedTo: 'RBSN Relay NEG (-) Terminal', functionDesc: 'Parallel Common Ground Return Leg', voltage: '0V Spliced', isUsed: true },
      { pin: 3, color: 'Orange', hex: '#F97316', name: 'Orange (R1 & R2)', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Aux 12V continuous', voltage: 'Unused', isUsed: false },
      { pin: 4, color: 'Yellow', hex: '#FACC15', name: 'Yellow (R1 & R2)', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'RS-485 Data A', voltage: 'Unused', isUsed: false },
      { pin: 5, color: 'White', hex: '#F8FAFC', name: 'White (R1 & R2)', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'RS-485 Data B', voltage: 'Unused', isUsed: false },
      { pin: 6, color: 'Blue', hex: '#3B82F6', name: 'Blue (R1 & R2)', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'REX input', voltage: 'Unused', isUsed: false },
      { pin: 7, color: 'Green', hex: '#22C55E', name: 'Green (R1 & R2)', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'DPS input', voltage: 'Unused', isUsed: false },
      { pin: 8, color: 'Brown', hex: '#A16207', name: 'Brown (R1 & R2)', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Signal ground', voltage: 'Unused', isUsed: false },
    ],
  },

  // 4. Elevator Inside Car with RB 5 Relay (RCPoweredoverEthernetwithElevatorCallButtoninside car.pdf)
  {
    id: 'elevator_inside_rb5',
    tabLabel: '4. Elevator Inside Car (RB 5)',
    sheetTitle: 'Complete Wiring Diagram - RC PoE with Elevator Call Button Inside Car',
    projectNumber: 'RC.POE.EDK.ElevatorCallButton',
    drawnBy: 'VRB / Raul Recalde',
    checkedBy: 'VRB / Raul Recalde',
    sheetNumber: 'HB-004',
    dateStr: 'AUG 2026',
    summaryNote:
      'Reader connects to RB 5 Relay utilizing Terminals of Control/Panel to Bell Output. Elevator call & control outputs are terminated exclusively by elevator technicians.',
    specNotes: [
      'Red wire from RC-15 connects to + POS on RB 5 Relay (Terminals of Control / Panel to Bell Output).',
      'Black wire from RC-15 connects to - NEG on RB 5 Relay (Terminals of Control / Panel to Bell Output).',
      'All other 6 wires (Orange, Yellow, White, Blue, Green, Brown): Isolate and insulate wires not used.',
      'Elevator Control Button Output: Terminated exclusively by elevator technician. Do not attempt to terminate this yourself.',
      'Elevator Call Button: Terminated by elevator technician.',
      'NO and NC connections can vary; this is to be determined by the elevator technician based on cab logic.',
    ],
    fieldRules: [
      'RC-15 receives PoE through the elevator traveling cable.',
      'Red and Black terminate to RB 5 Relay (+ POS and - NEG).',
      'STRICT DEMARCATION: Elevator technician makes all connections to elevator buttons.',
    ],
    wires: [
      { pin: 1, color: 'Red', hex: '#EF4444', name: 'Pin 1: Red', gauge: '22 AWG', connectedTo: 'RB 5 Relay + POS (Control Panel to Bell Output)', functionDesc: 'Reader Relay Activation Power Leg (+)', voltage: '+12VDC (Trigger)', isUsed: true },
      { pin: 2, color: 'Black', hex: '#18181B', name: 'Pin 2: Black', gauge: '22 AWG', connectedTo: 'RB 5 Relay - NEG (Control Panel to Bell Output)', functionDesc: 'Reader Relay Ground Reference (-)', voltage: '0V (Trigger GND)', isUsed: true },
      { pin: 3, color: 'Orange', hex: '#F97316', name: 'Pin 3: Orange', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 4, color: 'Yellow', hex: '#FACC15', name: 'Pin 4: Yellow', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 5, color: 'White', hex: '#F8FAFC', name: 'Pin 5: White', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 6, color: 'Blue', hex: '#3B82F6', name: 'Pin 6: Blue', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 7, color: 'Green', hex: '#22C55E', name: 'Pin 7: Green', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 8, color: 'Brown', hex: '#A16207', name: 'Pin 8: Brown', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
    ],
  },

  // 5. Elevator Outside Call Button / Stairwell with Fire Alarm Input (RC.ElevatorCallButtonoutside car.pdf)
  {
    id: 'elevator_outside_stairwell',
    tabLabel: '5. Stairwell & FA Relay',
    sheetTitle: 'Complete Wiring Diagram - Elevator Outside Call Button / Stairwell with Fire Alarm Input',
    projectNumber: 'RC.PwrSup.EDK.Stairwell.ElevatorCallButton.Code',
    drawnBy: 'Raul Recalde',
    checkedBy: 'Raul Recalde',
    sheetNumber: 'HB-005',
    dateStr: 'AUG 2026',
    summaryNote:
      'Power Supply with Fire Alarm Input and Fire Alarm Relay compliance. Fail Safe Electrified Lockset or Trim that maintains latch-point when unlocked.',
    specNotes: [
      'Cat5e/6 cable routes to PoE Switch to deliver power. Isolate and insulate wires not used.',
      'Reader Red and Black wires connect to intermediate relay coil to trigger access.',
      'BackEMF Diode Assembly must be installed close to lock to prevent voltage spikes.',
      'Utilizes Fail Safe Electrified Lockset or Trim that maintains latch-point when unlocked.',
      'Requires Power Supply with Fire Alarm Input (+12VDC, -12VDC, FA IN) and Fire Alarm Relay.',
      'Elevator Control Button Output: Terminated by elevator technician.',
      'Optional Key Switch Override with Com, NC, NO.',
      'Once installation and wiring is completed Homebase/Quext Dev Team will need to push a configuration to this reader in order for it to trigger the hardware correctly.',
    ],
    fieldRules: [
      'Fail-Safe Lockset: Drops power on Fire Alarm activation to permit free egress.',
      'Fire Alarm Relay breaks power loop immediately upon building emergency trigger.',
      'Elevator control demarcation maintained.',
    ],
    wires: [
      { pin: 1, color: 'Red', hex: '#EF4444', name: 'Pin 1: Red', gauge: '22 AWG', connectedTo: 'Intermediate Relay Coil POS (+)', functionDesc: 'Reader 12VDC Trigger Signal', voltage: '+12VDC Trigger', isUsed: true },
      { pin: 2, color: 'Black', hex: '#18181B', name: 'Pin 2: Black', gauge: '22 AWG', connectedTo: 'Intermediate Relay Coil NEG (-)', functionDesc: 'Reader Trigger Common Ground Return', voltage: '0V GND', isUsed: true },
      { pin: 3, color: 'Orange', hex: '#F97316', name: 'Pin 3: Orange', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 4, color: 'Yellow', hex: '#FACC15', name: 'Pin 4: Yellow', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 5, color: 'White', hex: '#F8FAFC', name: 'Pin 5: White', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 6, color: 'Blue', hex: '#3B82F6', name: 'Pin 6: Blue', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 7, color: 'Green', hex: '#22C55E', name: 'Pin 7: Green', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 8, color: 'Brown', hex: '#A16207', name: 'Pin 8: Brown', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
    ],
  },

  // 6. PS914-2RS Power Supply with Electrified Panic Bar (RC.POE.PS914-2RS.RBSN12_24.1xEL.REX.DSM)
  {
    id: 'ps914_panic_bar',
    tabLabel: '6. PS914-2RS (Panic Bar EL)',
    sheetTitle: 'RC PoE with PS914-2RS Power Supply, RBSN12/24 Relay, Electrified Panic Bar (EL), REX, & DSM',
    projectNumber: 'RC.POE.PS914-2RS.RBSN12_24.1xEL.REX.DSM',
    drawnBy: 'Raul Recalde',
    checkedBy: 'Raul Recalde',
    sheetNumber: 'HB-006',
    dateStr: 'AUG 2026',
    summaryNote:
      'High-draw electrified latch retraction panic bars (EL) require dedicated PS914-2RS 24VDC power supply. Reader triggers RBSN12/24 relay, which signals PS914-2RS inputs with potentiometer timing.',
    specNotes: [
      'When utilizing 12VDC from PoE powered RC-15, verify power calculation to ensure enough power is available for all devices.',
      'Reader connects RED and BLACK to RBSN12/24 relay POS and NEG coil terminals.',
      'All other 6 reader wires (Orange, Yellow, White, Blue, Green, Brown): Isolate and insulate wires not used.',
      'RBSN12/24 dry contacts (C and NO) connect to PS914-2RS Input 1 (I1) and Sense Common (SC).',
      'PS914-2RS 2RS Board Output 1 (O1 and GND) delivers high inrush 24VDC over 12-14AWG cable to Electrified Panic Bar (EL).',
      'Some adjustment of timing will be necessary by adjusting potentiometers on the hardware; installing device at default values will result in errors.',
      'REX (Request to Exit) and DSM (Door Status Monitor) wired through dedicated low-voltage field pairs.',
      'After wiring is completed reach out to Homebase / Quext so the reader can be configured to NO or NC Wiring.',
    ],
    fieldRules: [
      'Never attempt to power high-draw motorized latch retraction directly from the RC-15 reader.',
      'Calibrate potentiometer hold delay to match egress clearance requirements.',
      'Verify 12-14 AWG wire gauge on 24VDC panic bar output to prevent voltage drop.',
    ],
    wires: [
      { pin: 1, color: 'Red', hex: '#EF4444', name: 'Pin 1: Red', gauge: '22 AWG', connectedTo: 'RBSN12/24 Relay Coil POS (+)', functionDesc: 'Reader 12VDC pulse to trigger relay', voltage: '+12VDC (Trigger)', isUsed: true },
      { pin: 2, color: 'Black', hex: '#18181B', name: 'Pin 2: Black', gauge: '22 AWG', connectedTo: 'RBSN12/24 Relay Coil NEG (-)', functionDesc: 'Reader trigger common return', voltage: '0V (Trigger GND)', isUsed: true },
      { pin: 3, color: 'Orange', hex: '#F97316', name: 'Pin 3: Orange', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 4, color: 'Yellow', hex: '#FACC15', name: 'Pin 4: Yellow', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 5, color: 'White', hex: '#F8FAFC', name: 'Pin 5: White', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 6, color: 'Blue', hex: '#3B82F6', name: 'Pin 6: Blue', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 7, color: 'Green', hex: '#22C55E', name: 'Pin 7: Green', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
      { pin: 8, color: 'Brown', hex: '#A16207', name: 'Pin 8: Brown', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Isolate and insulate', voltage: 'Unused', isUsed: false },
    ],
  },

  // 7. ButterflyMX Video Intercom Integration with RC Reader Controller
  {
    id: 'butterfly_intercom',
    tabLabel: '7. ButterflyMX Intercom (RC REX)',
    sheetTitle: 'ButterflyMX 8" & 12" Video Intercom with Schlage RC Reader Controller',
    projectNumber: 'RC.EDK.BUTTERFLYMX.REX.COM',
    drawnBy: 'Raul Recalde / Quext IoT',
    checkedBy: 'Raul Recalde',
    sheetNumber: 'HB-007',
    dateStr: 'OCT 2026',
    summaryNote:
      'ButterflyMX 8" and 12" Video Intercom connects to the Schlage RC Reader Controller using Pin 6 Blue (REX - Request to Exit) and Pin 2 Black (Common GND). When tenant buzzes a visitor in, the dry contact relay closes, commanding the RC reader to release the door strike.',
    specNotes: [
      'ButterflyMX dry contact locking relay connects across RC Reader Pin 6 Blue (REX) and Pin 2 Black (Common).',
      'Uses 18 AWG 2-conductor (18/2) cable between Intercom and RC Reader controller.',
      'RC Reader controller receives PoE via Cat5e/6 from PoE Network Switch and handles all access logs and strike timing.',
      'Pin 1 Red (+12VDC) and Pin 2 Black (GND) from RC Reader energize the 12VDC electric strike or RBSN isolation relay.',
      'ButterflyMX Intercom powered by dedicated 24VDC/50W power supply plugged into UPS (min 300W/600VA).',
      'Configured in software (Homebase / Quext Cloud) as Normally Open (NO) REX trigger.',
    ],
    fieldRules: [
      'ButterflyMX dry contacts connect to RC Blue (REX) and Black (Common).',
      'Never send 24VDC power supply output into the RC Reader or REX circuit.',
      'Always install minimum 300W / 600VA UPS backup for the ButterflyMX Intercom.',
    ],
    wires: [
      { pin: 1, color: 'Red', hex: '#EF4444', name: 'Pin 1: Red', gauge: '22 AWG', connectedTo: 'Electric Strike RED (+12VDC) or RBSN Relay POS (+)', functionDesc: '12VDC Switched Lock Power Output', voltage: '+12VDC (Switched)', isUsed: true },
      { pin: 2, color: 'Black', hex: '#18181B', name: 'Pin 2: Black', gauge: '22 AWG', connectedTo: 'ButterflyMX Relay Terminal B (Common) & Strike Return', functionDesc: 'Lock Ground & REX Common Return', voltage: '0V (Ground)', isUsed: true },
      { pin: 3, color: 'Orange', hex: '#F97316', name: 'Pin 3: Orange', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Auxiliary 12VDC Continuous Output', voltage: 'Unused', isUsed: false },
      { pin: 4, color: 'Yellow', hex: '#FACC15', name: 'Pin 4: Yellow', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'EDK RS-485 Data A / Comm', voltage: 'Unused', isUsed: false },
      { pin: 5, color: 'White', hex: '#F8FAFC', name: 'Pin 5: White', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'EDK RS-485 Data B / Comm', voltage: 'Unused', isUsed: false },
      { pin: 6, color: 'Blue', hex: '#3B82F6', name: 'Pin 6: Blue', gauge: '22 AWG', connectedTo: 'ButterflyMX Relay Terminal A (REX Trigger Input)', functionDesc: 'REX Request to Exit Input (Active Low / Contact Closure)', voltage: 'Dry Sense (3.3V Pulled High)', isUsed: true },
      { pin: 7, color: 'Green', hex: '#22C55E', name: 'Pin 7: Green', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'DPS Door Position Sensor Input', voltage: 'Unused', isUsed: false },
      { pin: 8, color: 'Brown', hex: '#A16207', name: 'Pin 8: Brown', gauge: '22 AWG', connectedTo: 'Not Used (Cap / Wire-Nut)', functionDesc: 'Auxiliary Signal Ground / Comm', voltage: 'Unused', isUsed: false },
    ],
  },
];

interface EngineeringSchematicViewerProps {
  schematicType?: string;
  schematicData?: any;
  onNavigateTab?: (tab: string) => void;
}

export const EngineeringSchematicViewer: React.FC<EngineeringSchematicViewerProps> = ({
  schematicType,
  onNavigateTab,
}) => {
  const getInitialId = (): SchematicId => {
    if (schematicType === 'rc_elevator_stairwell') return 'elevator_outside_stairwell';
    if (schematicType === 'rc_electric_strike') return 'strike_12v_direct';
    if (schematicType === 'rc_double_strike' || schematicType === 'double_rc_in_out') return 'double_rc_in_out';
    if (schematicType === 'rc_rb5_elevator') return 'elevator_inside_rb5';
    if (schematicType === 'rc_ps914_power') return 'ps914_panic_bar';
    return 'strike_12v_direct';
  };

  const [selectedSchematicId, setSelectedSchematicId] = useState<SchematicId>(getInitialId());
  const [activeWirePin, setActiveWirePin] = useState<number | null>(null);
  const [canvasTheme, setCanvasTheme] = useState<'cad_white' | 'dark_blueprint'>('dark_blueprint');

  React.useEffect(() => {
    if (schematicType) {
      setSelectedSchematicId(getInitialId());
      setActiveWirePin(null);
    }
  }, [schematicType]);
  const [isSimulatingTrigger, setIsSimulatingTrigger] = useState<boolean>(false);
  const [showSuperimposedHardware, setShowSuperimposedHardware] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentConfig =
    SCHEMATIC_CONFIGS.find((c) => c.id === selectedSchematicId) || SCHEMATIC_CONFIGS[0];

  const activeWireInfo = currentConfig.wires.find((w) => w.pin === activeWirePin);

  const handleSimulateTrigger = () => {
    if (isSimulatingTrigger) return;
    setIsSimulatingTrigger(true);
    setTimeout(() => {
      setIsSimulatingTrigger(false);
    }, 3200);
  };

  const isLight = canvasTheme === 'cad_white';

  return (
    <div className="bg-[#05070D] border-2 border-zinc-800 rounded-2xl p-4 sm:p-7 shadow-2xl space-y-6 my-6 text-zinc-100">
      {/* Blueprint Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Official Quext / Homebase Low-Voltage Engineering Blueprints
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Access Control &amp; RC Reader Wiring Schematics
          </h2>
          <div className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-3">
            <span>Drawn By: <strong className="text-purple-300 font-semibold">{currentConfig.drawnBy}</strong></span>
            <span className="text-zinc-600">|</span>
            <span>Checked By: <strong className="text-purple-300 font-semibold">{currentConfig.checkedBy}</strong></span>
            <span className="text-zinc-600">|</span>
            <span>Sheet: <strong className="font-mono text-cyan-300">{currentConfig.sheetNumber}</strong></span>
            <span className="text-zinc-600">|</span>
            <span>Address: <span className="text-zinc-300">1619 Walnut St, Kansas City, MO 64130</span></span>
          </div>
        </div>

        {/* View Controls: CAD Draft vs Dark Blueprint, RC11 Photo Overlay & Test Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Test Trigger Simulation Button */}
          <button
            onClick={handleSimulateTrigger}
            disabled={isSimulatingTrigger}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
              isSimulatingTrigger
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulatingTrigger ? 'animate-spin' : ''}`} />
            <span>{isSimulatingTrigger ? 'Access Granted (Triggering Coil...)' : 'Simulate Reader Card Read'}</span>
          </button>

          {/* Superimposed Hardware Photo Button */}
          <button
            onClick={() => setShowSuperimposedHardware(!showSuperimposedHardware)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border shadow-sm ${
              showSuperimposedHardware
                ? 'bg-purple-950/90 border-purple-500 text-purple-200'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Superimpose authentic Schlage RC11 hardware photo into diagram"
          >
            <span>📷</span>
            <span>RC11 Photo: {showSuperimposedHardware ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theme switcher */}
          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCanvasTheme('dark_blueprint')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                !isLight
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>🌙</span>
              <span>Dark Blueprint</span>
            </button>
            <button
              onClick={() => setCanvasTheme('cad_white')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                isLight
                  ? 'bg-white text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>📄</span>
              <span>CAD Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Schematic Selector Tabs (All 7 Official Diagrams) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 p-1.5 bg-[#090D16] border border-zinc-800 rounded-xl">
        {SCHEMATIC_CONFIGS.map((cfg) => {
          const isSelected = selectedSchematicId === cfg.id;
          return (
            <button
              key={cfg.id}
              onClick={() => {
                setSelectedSchematicId(cfg.id);
                setActiveWirePin(null);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-left truncate ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md ring-1 ring-cyan-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {cfg.tabLabel}
            </button>
          );
        })}
      </div>

      {/* Schematic Overview & Golden Rule Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border-l-4 border-cyan-500 text-xs sm:text-sm text-cyan-100 leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-cyan-300 font-bold uppercase tracking-wider mb-0.5">
            Engineering Spec Rule · {currentConfig.sheetTitle}:
          </strong>
          <span>{currentConfig.summaryNote}</span>
        </div>
      </div>

      {/* Official Hardware Identification Card for Schlage RC11 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 border-2 border-cyan-500/40 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <img
              src="/src/assets/images/schlage_rc11_reader_1791238012335.jpg"
              alt="Schlage RC11 Mullion Pure IP Reader Controller"
              className="w-16 h-16 object-cover rounded-xl border-2 border-cyan-400 shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-cyan-900 text-cyan-200 border border-cyan-400">
              RC11
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50">
                ACTIVE SCHEMATIC MODEL
              </span>
              <span className="text-sm font-extrabold text-white">Schlage RC11 Mullion Pure IP Reader Controller</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                ✓ Authentic Device
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              <strong className="text-cyan-300">Target Model: Left-most device from the Schlage RC Family (RC11 slim profile).</strong> Pure IP Power over Ethernet (PoE 802.3af 48V) architecture with integrated 8-conductor color-coded lead harness and direct +12VDC switched output (Pin 1 Red / Pin 2 Black).
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <span className="text-[11px] font-mono text-purple-300 bg-purple-950/80 px-3 py-1 rounded-lg border border-purple-500/50 font-bold">
            Allegion Pure IP
          </span>
          {selectedSchematicId === 'butterfly_intercom' && onNavigateTab ? (
            <button
              onClick={() => onNavigateTab('butterfly_wiring')}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Open Dedicated ButterflyMX Studio →</span>
            </button>
          ) : (
            <span className="text-[10px] font-mono text-zinc-400">
              Part # RC11-MULLION-PoE
            </span>
          )}
        </div>
      </div>

      {/* CAD Canvas Frame */}
      <div
        className={`relative rounded-2xl border-2 transition-colors duration-300 overflow-hidden ${
          isLight
            ? 'bg-[#F8FAFC] border-zinc-300 text-zinc-900 shadow-inner'
            : 'bg-[#060911] border-cyan-900/50 text-zinc-100'
        }`}
      >
        {/* Architectural drafting grid overlay */}
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${
            isLight ? 'invert' : ''
          }`}
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(6, 182, 212, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Blueprint Sheet Header */}
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-3 border-b text-xs font-mono ${
            isLight
              ? 'bg-zinc-100/90 border-zinc-300 text-zinc-700'
              : 'bg-[#0B1120] border-zinc-800 text-zinc-400'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-cyan-400">{currentConfig.projectNumber}</span>
            <span className="text-zinc-500">|</span>
            <span className="font-semibold truncate">{currentConfig.sheetTitle}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 sm:mt-0 text-[11px]">
            <span>SHEET: <strong className="text-cyan-400 font-bold">{currentConfig.sheetNumber}</strong></span>
            <span>REV: <strong className="text-emerald-400 font-bold">1.4 (Accurate)</strong></span>
          </div>
        </div>

        {/* Interactive SVG Schematic */}
        <div className="relative z-10 w-full overflow-x-auto p-4 sm:p-6 select-none">
          <svg
            viewBox="0 0 1020 540"
            className="w-full min-w-[880px] h-auto font-sans"
            style={{ filter: isLight ? 'contrast(1.05)' : undefined }}
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="rcReaderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isLight ? '#334155' : '#1E293B'} />
                <stop offset="100%" stopColor={isLight ? '#0F172A' : '#0B0F19'} />
              </linearGradient>

              <linearGradient id="strikeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isLight ? '#F1F5F9' : '#181E29'} />
                <stop offset="100%" stopColor={isLight ? '#E2E8F0' : '#0F172A'} />
              </linearGradient>

              {/* Wire Glow Filter */}
              <filter id="activeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06B6D4" />
              </filter>
              <filter id="energizedGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#10B981" />
              </filter>

              {/* ClipPaths for Superimposed RC11 Hardware Photos */}
              <clipPath id="rc11PillClip">
                <rect x="0" y="0" width="84" height="260" rx="38" />
              </clipPath>
              <clipPath id="rc11OutboundClip">
                <rect x="0" y="0" width="84" height="145" rx="30" />
              </clipPath>
            </defs>

            {/* PoE Switch Riser Box (Common to all schematics) */}
            <g transform="translate(30, 20)">
              <rect
                width="200"
                height="38"
                rx="6"
                fill={isLight ? '#E2E8F0' : '#111827'}
                stroke={isLight ? '#94A3B8' : '#374151'}
                strokeWidth="1.5"
              />
              <circle cx="20" cy="19" r="4" fill="#10B981" />
              <text x="115" y="24" fill={isLight ? '#0F172A' : '#F9FAFB'} fontSize="11" fontWeight="bold" textAnchor="middle">
                PoE Network Switch (48V)
              </text>
              {/* Cat5e/6 PoE Run line */}
              <path
                d="M 115 38 L 115 90"
                stroke="#06B6D4"
                strokeWidth="3"
                strokeDasharray="5 3"
              />
              <text x="125" y="65" fill="#06B6D4" fontSize="9" fontWeight="bold">
                Cat5e / Cat6 PoE Cable
              </text>
            </g>

            {/* ============================================================== */}
            {/* COMPONENT: SCHLAGE RC11 MULLION READER (Left Side)             */}
            {/* ============================================================== */}
            <g transform="translate(60, 90)">
              {/* Slim Mullion Housing with rounded pill top & bottom */}
              <rect
                width="84"
                height="260"
                rx="38"
                fill="url(#rcReaderGrad)"
                stroke={isSimulatingTrigger ? '#10B981' : isLight ? '#475569' : '#38BDF8'}
                strokeWidth={isSimulatingTrigger ? '3' : '2'}
                filter={isSimulatingTrigger ? 'url(#energizedGlow)' : undefined}
              />

              {/* Superimposed Authentic Schlage RC11 Hardware Photo */}
              {showSuperimposedHardware && (
                <g clipPath="url(#rc11PillClip)">
                  <image
                    href="/src/assets/images/schlage_rc11_reader_1791238012335.jpg"
                    x="0"
                    y="0"
                    width="84"
                    height="260"
                    preserveAspectRatio="xMidYMid slice"
                    opacity={isLight ? '0.90' : '0.80'}
                  />
                  {/* Subtle darkening tint to keep text/LEDs razor sharp */}
                  <rect
                    width="84"
                    height="260"
                    fill={isLight ? 'rgba(255,255,255,0.15)' : 'rgba(5,7,13,0.30)'}
                  />
                </g>
              )}

              {/* Top Capsule Status LED Indicator Bar (Green/Red) */}
              <rect
                x="22"
                y="20"
                width="40"
                height="8"
                rx="4"
                fill={isSimulatingTrigger ? '#10B981' : '#22C55E'}
                filter="url(#activeGlow)"
              />
              <text
                x="42"
                y="38"
                fill={isSimulatingTrigger ? '#10B981' : '#22C55E'}
                fontSize="6.5"
                textAnchor="middle"
                fontWeight="extrabold"
              >
                {isSimulatingTrigger ? 'UNLOCKED' : 'ONLINE'}
              </text>

              {/* NFC Radio Contactless Sweet Spot Icon ((•)) */}
              <g transform="translate(42, 95)" opacity="0.9">
                <circle cx="0" cy="0" r="3" fill="#38BDF8" />
                <path d="M -8 -6 A 10 10 0 0 0 -8 6" stroke="#38BDF8" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 8 -6 A 10 10 0 0 1 8 6" stroke="#38BDF8" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M -14 -11 A 18 18 0 0 0 -14 11" stroke="#38BDF8" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.75" />
                <path d="M 14 -11 A 18 18 0 0 1 14 11" stroke="#38BDF8" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.75" />
              </g>
              <text x="42" y="125" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="7.5" textAnchor="middle" fontWeight="bold">
                NFC / MOBILE
              </text>

              {/* Embossed SCHLAGE Brand Badge */}
              <rect
                x="14"
                y="170"
                width="56"
                height="18"
                rx="4"
                fill="#0F172A"
                stroke="#334155"
                strokeWidth="1"
              />
              <text
                x="42"
                y="182"
                fill="#F8FAFC"
                fontSize="8"
                fontWeight="extrabold"
                textAnchor="middle"
                letterSpacing="1.2"
              >
                SCHLAGE
              </text>

              {/* Model Number Tag */}
              <text x="42" y="215" fill="#FFFFFF" fontSize="13" fontWeight="extrabold" textAnchor="middle">
                RC11
              </text>
              <text x="42" y="228" fill="#38BDF8" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                MULLION IP
              </text>
              <text x="42" y="240" fill={isLight ? '#475569' : '#64748B'} fontSize="6.5" textAnchor="middle">
                PoE Powered
              </text>

              {/* Light Gray Flexible Ethernet Cable & RJ45 Pigtail extending from base */}
              <path
                d="M 42 260 C 42 295 10 280 -10 250"
                stroke="#CBD5E1"
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
              />
              <g transform="translate(-24, 238)">
                <rect width="18" height="24" rx="3" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
                <rect x="4" y="22" width="10" height="4" fill="#64748B" />
                <text x="9" y="14" fill="#0F172A" fontSize="6.5" fontWeight="extrabold" textAnchor="middle">
                  RJ45
                </text>
              </g>

              {/* Wire Bridge connecting RC11 to 8-Wire Lead block */}
              <path d="M 84 110 L 135 110" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
            </g>

            {/* ============================================================== */}
            {/* 8-PIN HARNESS / PIGTAIL TERMINAL BLOCK                         */}
            {/* ============================================================== */}
            <g transform="translate(195, 100)">
              {/* Harness housing */}
              <rect
                width="44"
                height="210"
                rx="6"
                fill={isLight ? '#E2E8F0' : '#111827'}
                stroke={isLight ? '#94A3B8' : '#374151'}
                strokeWidth="1.5"
              />
              <text
                x="22"
                y="-10"
                fill={isLight ? '#0F172A' : '#E2E8F0'}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                8-Wire Lead
              </text>

              {currentConfig.wires.map((wire, idx) => {
                const yPos = idx * 24 + 16;
                const isSelected = activeWirePin === wire.pin;
                const isBlackWire = wire.color === 'Black';

                return (
                  <g
                    key={wire.pin}
                    transform={`translate(0, ${yPos})`}
                    className="cursor-pointer"
                    onClick={() => setActiveWirePin(isSelected ? null : wire.pin)}
                  >
                    {/* Pin screw terminal */}
                    <circle
                      cx="22"
                      cy="0"
                      r="6"
                      fill={isBlackWire ? '#18181B' : wire.hex}
                      stroke={isSelected ? '#38BDF8' : isBlackWire ? '#FFFFFF' : '#475569'}
                      strokeWidth={isSelected ? '2.5' : isBlackWire ? '1.5' : '1'}
                    />
                    <text
                      x="22"
                      y="3.5"
                      fill={isBlackWire || wire.color === 'Blue' ? '#FFFFFF' : '#000000'}
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {wire.pin}
                    </text>

                    {/* Wire Color Tag */}
                    <text
                      x="50"
                      y="3.5"
                      fill={
                        isSelected
                          ? '#06B6D4'
                          : wire.isUsed
                          ? isLight
                            ? '#0F172A'
                            : '#F1F5F9'
                          : '#64748B'
                      }
                      fontSize="10"
                      fontWeight={wire.isUsed ? 'bold' : 'normal'}
                    >
                      {wire.color}
                    </text>

                    {!wire.isUsed && (
                      <text x="100" y="3.5" fill="#EF4444" fontSize="8" fontStyle="italic">
                        (Insulated)
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* ============================================================== */}
            {/* SCHEMATIC 1: 12VDC DIRECT ELECTRIC STRIKE                      */}
            {/* ============================================================== */}
            {selectedSchematicId === 'strike_12v_direct' && (
              <g>
                {/* Pin 1: RED wire (+12VDC Switched) directly to Strike RED */}
                <path
                  d="M 240 116 L 460 116 L 460 170 L 680 170"
                  stroke="#EF4444"
                  strokeWidth={activeWirePin === 1 || isSimulatingTrigger ? '4' : '2.5'}
                  fill="none"
                  filter={activeWirePin === 1 || isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                />
                <rect x="470" y="152" width="130" height="18" rx="4" fill={isLight ? '#FEE2E2' : '#450A0A'} />
                <text x="535" y="165" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Pin 1: RED (+12VDC Switched)
                </text>

                {/* Pin 2: BLACK wire (GND Return) directly to Strike BLACK */}
                {/* To ensure black wire is visible on dark mode, render a white jacket halo behind the jet-black wire */}
                <path
                  d="M 240 140 L 440 140 L 440 220 L 680 220"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M 240 140 L 440 140 L 440 220 L 680 220"
                  stroke="#18181B"
                  strokeWidth="2.5"
                  fill="none"
                  filter={activeWirePin === 2 ? 'url(#activeGlow)' : undefined}
                />
                <rect x="470" y="228" width="130" height="18" rx="4" fill={isLight ? '#F1F5F9' : '#1E293B'} />
                <text x="535" y="241" fill={isLight ? '#0F172A' : '#E2E8F0'} fontSize="9" fontWeight="bold" textAnchor="middle">
                  Pin 2: BLACK (GND Return)
                </text>

                {/* Unused Wires 3 through 8 Bundled and Insulated */}
                <g opacity="0.65">
                  <path d="M 240 164 Q 280 164 290 190" stroke="#F97316" strokeWidth="2" strokeDasharray="3 2" fill="none" />
                  <path d="M 240 188 Q 280 188 290 205" stroke="#FACC15" strokeWidth="2" strokeDasharray="3 2" fill="none" />
                  <path d="M 240 212 Q 280 212 290 220" stroke="#F8FAFC" strokeWidth="2" strokeDasharray="3 2" fill="none" />
                  <path d="M 240 236 Q 280 236 290 235" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 2" fill="none" />
                  <path d="M 240 260 Q 280 260 290 250" stroke="#22C55E" strokeWidth="2" strokeDasharray="3 2" fill="none" />
                  <path d="M 240 284 Q 280 284 290 265" stroke="#A16207" strokeWidth="2" strokeDasharray="3 2" fill="none" />

                  {/* Wire-nut / Insulation Cap Box */}
                  <rect
                    x="285"
                    y="180"
                    width="135"
                    height="100"
                    rx="8"
                    fill={isLight ? '#FEE2E2' : '#2D1515'}
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="352" y="215" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ISOLATE &amp; INSULATE
                  </text>
                  <text x="352" y="232" fill={isLight ? '#991B1B' : '#FCA5A5'} fontSize="8" textAnchor="middle">
                    Wires Not Used (3, 4, 5, 6, 7, 8)
                  </text>
                  <text x="352" y="247" fill={isLight ? '#7F1D1D' : '#F87171'} fontSize="8" textAnchor="middle">
                    Cap Individually
                  </text>
                </g>

                {/* BackEMF Diode Assembly Across Strike */}
                <g transform="translate(620, 170)">
                  <line x1="0" y1="0" x2="0" y2="50" stroke={isLight ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
                  {/* Diode body */}
                  <rect
                    x="-40"
                    y="12"
                    width="80"
                    height="26"
                    rx="4"
                    fill="#18181B"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                  />
                  {/* Silver Cathode Band at Top (to Red +) */}
                  <rect x="-40" y="12" width="80" height="6" fill="#E2E8F0" />
                  <text x="0" y="30" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                    DIODE (1N4004)
                  </text>
                  <text x="0" y="50" fill="#EF4444" fontSize="7" fontWeight="bold" textAnchor="middle">
                    Cathode Band to Red (+)
                  </text>
                </g>

                {/* 12VDC Electric Strike Box */}
                <g transform="translate(680, 135)">
                  <rect
                    width="230"
                    height="125"
                    rx="10"
                    fill="url(#strikeGrad)"
                    stroke={isSimulatingTrigger ? '#10B981' : isLight ? '#059669' : '#10B981'}
                    strokeWidth="2.5"
                    filter={isSimulatingTrigger ? 'url(#energizedGlow)' : undefined}
                  />
                  <text x="115" y="30" fill={isLight ? '#065F46' : '#34D399'} fontSize="13" fontWeight="extrabold" textAnchor="middle">
                    12 VDC Electric Strike
                  </text>

                  {/* Red wire terminal */}
                  <circle cx="35" cy="55" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="48" y="58" fill={isLight ? '#0F172A' : '#F1F5F9'} fontSize="10" fontWeight="bold">
                    Strike RED Lead (+12VDC)
                  </text>

                  {/* Black wire terminal */}
                  <circle cx="35" cy="85" r="5" fill="#18181B" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="48" y="88" fill={isLight ? '#0F172A' : '#F1F5F9'} fontSize="10" fontWeight="bold">
                    Strike BLACK Lead (GND -)
                  </text>

                  {/* Verification Note */}
                  <rect x="20" y="98" width="190" height="18" rx="4" fill={isLight ? '#DCFCE7' : '#064E3B'} />
                  <text x="115" y="111" fill={isLight ? '#166534' : '#6EE7B7'} fontSize="8" fontWeight="bold" textAnchor="middle">
                    ✓ NO RBSN RELAY REQUIRED FOR 12VDC
                  </text>
                </g>
              </g>
            )}

            {/* ============================================================== */}
            {/* SCHEMATIC 2: 24VDC STRIKE WITH RBSN RELAY                      */}
            {/* ============================================================== */}
            {selectedSchematicId === 'strike_24v_rbsn' && (
              <g>
                {/* Pin 1: RED wire from RC-15 to RBSN POS (+) */}
                <path
                  d="M 240 116 L 380 116 L 380 160 L 440 160"
                  stroke="#EF4444"
                  strokeWidth={activeWirePin === 1 || isSimulatingTrigger ? '4' : '2.5'}
                  fill="none"
                  filter={activeWirePin === 1 || isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                />
                <text x="320" y="110" fill="#EF4444" fontSize="9" fontWeight="bold">
                  Pin 1: RED (+12V Trigger)
                </text>

                {/* Pin 2: BLACK wire from RC-15 to RBSN NEG (-) */}
                <path d="M 240 140 L 360 140 L 360 190 L 440 190" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path
                  d="M 240 140 L 360 140 L 360 190 L 440 190"
                  stroke="#18181B"
                  strokeWidth="2.5"
                  fill="none"
                  filter={activeWirePin === 2 ? 'url(#activeGlow)' : undefined}
                />
                <text x="310" y="152" fill={isLight ? '#0F172A' : '#E2E8F0'} fontSize="9" fontWeight="bold">
                  Pin 2: BLACK (Trigger GND)
                </text>

                {/* Unused wires capped */}
                <rect x="250" y="200" width="120" height="90" rx="6" fill={isLight ? '#FEE2E2' : '#2D1515'} stroke="#EF4444" strokeDasharray="3 3" opacity="0.6" />
                <text x="310" y="235" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Wires 3-8 Insulated
                </text>
                <text x="310" y="250" fill={isLight ? '#991B1B' : '#FCA5A5'} fontSize="8" textAnchor="middle">
                  Not Used
                </text>

                {/* Altronix RBSN Relay Module */}
                <g transform="translate(440, 115)">
                  <rect
                    width="160"
                    height="170"
                    rx="8"
                    fill={isLight ? '#FEF9C3' : '#1C1917'}
                    stroke="#EAB308"
                    strokeWidth="2"
                    filter={isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                  />
                  <text x="80" y="24" fill="#EAB308" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    Altronix RBSN Relay
                  </text>
                  <text x="80" y="38" fill={isLight ? '#854D0E' : '#CA8A04'} fontSize="8" textAnchor="middle">
                    Coil: 12VDC · Contacts: 24VDC Rated
                  </text>

                  {/* Input Coil Terminals */}
                  <circle cx="25" cy="45" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="36" y="48" fill="#EF4444" fontSize="9" fontWeight="bold">
                    POS (+)
                  </text>
                  <circle cx="25" cy="75" r="5" fill="#18181B" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="36" y="78" fill={isLight ? '#0F172A' : '#F1F5F9'} fontSize="9" fontWeight="bold">
                    NEG (-)
                  </text>

                  {/* Output Dry Contacts */}
                  <circle cx="135" cy="50" r="5" fill="#EAB308" stroke="#000000" strokeWidth="1" />
                  <text x="110" y="53" fill="#EAB308" fontSize="10" fontWeight="bold">
                    C (Com)
                  </text>

                  <circle cx="135" cy="85" r="5" fill="#EAB308" stroke="#000000" strokeWidth="1" />
                  <text x="110" y="88" fill="#EAB308" fontSize="10" fontWeight="bold">
                    NO
                  </text>

                  <circle cx="135" cy="120" r="5" fill="#71717A" stroke="#000000" strokeWidth="1" />
                  <text x="110" y="123" fill="#71717A" fontSize="9">
                    NC
                  </text>
                </g>

                {/* External 24VDC Power Supply Box */}
                <g transform="translate(440, 320)">
                  <rect
                    width="160"
                    height="75"
                    rx="8"
                    fill={isLight ? '#EFF6FF' : '#1E293B'}
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <text x="80" y="24" fill="#3B82F6" fontSize="11" fontWeight="extrabold" textAnchor="middle">
                    External 24VDC Power Supply
                  </text>
                  <circle cx="35" cy="50" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="46" y="53" fill="#EF4444" fontSize="9" fontWeight="bold">
                    +24VDC
                  </text>

                  <circle cx="105" cy="50" r="4.5" fill="#18181B" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="116" y="53" fill={isLight ? '#0F172A' : '#F1F5F9'} fontSize="9" fontWeight="bold">
                    -24VDC
                  </text>
                </g>

                {/* Wire: +24VDC Power Supply up to RBSN Common (C) */}
                <path d="M 475 345 L 475 305 L 575 305 L 575 165" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                <text x="585" y="235" fill="#EF4444" fontSize="8" fontWeight="bold">
                  +24V to C
                </text>

                {/* Switched +24VDC wire from RBSN NO to 24V Strike RED */}
                <path
                  d="M 575 200 L 710 200"
                  stroke="#EF4444"
                  strokeWidth={isSimulatingTrigger ? '4' : '2.5'}
                  fill="none"
                  filter={isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                />
                <text x="615" y="192" fill="#EF4444" fontSize="9" fontWeight="bold">
                  Switched +24VDC
                </text>

                {/* -24VDC Return Wire from Power Supply directly to Strike BLACK */}
                <path d="M 545 370 L 780 370 L 780 250" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M 545 370 L 780 370 L 780 250" stroke="#18181B" strokeWidth="2.5" fill="none" />
                <text x="635" y="362" fill={isLight ? '#0F172A' : '#E2E8F0'} fontSize="9" fontWeight="bold">
                  -24VDC Ground Return
                </text>

                {/* BackEMF Diode */}
                <g transform="translate(660, 200)">
                  <line x1="0" y1="0" x2="0" y2="40" stroke={isLight ? '#0F172A' : '#FFFFFF'} strokeWidth="2" />
                  <rect x="-35" y="8" width="70" height="22" rx="3" fill="#18181B" stroke="#EF4444" strokeWidth="1" />
                  <rect x="-35" y="8" width="70" height="5" fill="#E2E8F0" />
                  <text x="0" y="23" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                    DIODE (Band +)
                  </text>
                </g>

                {/* 24VDC Electric Strike Box */}
                <g transform="translate(710, 160)">
                  <rect
                    width="220"
                    height="120"
                    rx="10"
                    fill="url(#strikeGrad)"
                    stroke="#EAB308"
                    strokeWidth="2.5"
                    filter={isSimulatingTrigger ? 'url(#energizedGlow)' : undefined}
                  />
                  <text x="110" y="30" fill="#EAB308" fontSize="13" fontWeight="extrabold" textAnchor="middle">
                    24 VDC Electric Strike
                  </text>

                  <circle cx="35" cy="55" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="48" y="58" fill={isLight ? '#0F172A' : '#F1F5F9'} fontSize="10" fontWeight="bold">
                    Strike RED Lead (+24V)
                  </text>

                  <circle cx="35" cy="85" r="5" fill="#18181B" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="48" y="88" fill={isLight ? '#0F172A' : '#F1F5F9'} fontSize="10" fontWeight="bold">
                    Strike BLACK Lead (-24V)
                  </text>
                </g>
              </g>
            )}

            {/* ============================================================== */}
            {/* SCHEMATIC 3: DOUBLE RC (IN & OUT READERS WITH RBSN)            */}
            {/* ============================================================== */}
            {selectedSchematicId === 'double_rc_in_out' && (
              <g>
                {/* Outbound Reader 2 Housing (Mounted below Reader 1) */}
                <g transform="translate(60, 360)">
                  <rect
                    width="84"
                    height="145"
                    rx="30"
                    fill="url(#rcReaderGrad)"
                    stroke={isSimulatingTrigger ? '#10B981' : isLight ? '#475569' : '#38BDF8'}
                    strokeWidth="2"
                  />

                  {/* Superimposed Authentic Schlage RC11 Hardware Photo */}
                  {showSuperimposedHardware && (
                    <g clipPath="url(#rc11OutboundClip)">
                      <image
                        href="/src/assets/images/schlage_rc11_reader_1791238012335.jpg"
                        x="0"
                        y="0"
                        width="84"
                        height="145"
                        preserveAspectRatio="xMidYMid slice"
                        opacity={isLight ? '0.90' : '0.80'}
                      />
                      <rect
                        width="84"
                        height="145"
                        fill={isLight ? 'rgba(255,255,255,0.15)' : 'rgba(5,7,13,0.30)'}
                      />
                    </g>
                  )}

                  {/* Top LED */}
                  <rect x="22" y="14" width="40" height="6" rx="3" fill={isSimulatingTrigger ? '#10B981' : '#22C55E'} />
                  {/* NFC icon */}
                  <circle cx="42" cy="55" r="3" fill="#38BDF8" />
                  <path d="M 34 50 A 8 8 0 0 0 34 60" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
                  <path d="M 50 50 A 8 8 0 0 1 50 60" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
                  {/* SCHLAGE logo badge */}
                  <rect x="14" y="80" width="56" height="15" rx="3" fill="#0F172A" stroke="#334155" />
                  <text x="42" y="91" fill="#FFFFFF" fontSize="7" fontWeight="extrabold" textAnchor="middle">
                    SCHLAGE
                  </text>
                  <text x="42" y="112" fill="#FFFFFF" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                    RC11 (OUT)
                  </text>
                  <text x="42" y="125" fill="#38BDF8" fontSize="7" textAnchor="middle" fontWeight="bold">
                    Outbound Mullion
                  </text>

                  {/* Wire Bridge connecting RC11 to R2 pigtail */}
                  <path d="M 84 40 L 135 40" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                </g>

                {/* Reader 2 8-wire lead box */}
                <g transform="translate(195, 365)">
                  <rect width="44" height="100" rx="4" fill={isLight ? '#E2E8F0' : '#111827'} stroke="#475569" strokeWidth="1" />
                  <text x="22" y="-5" fill="#94A3B8" fontSize="8" textAnchor="middle">
                    R2 Pigtail
                  </text>
                  <circle cx="22" cy="20" r="5" fill="#EF4444" />
                  <text x="35" y="23" fill="#EF4444" fontSize="8" fontWeight="bold">
                    Red
                  </text>
                  <circle cx="22" cy="45" r="5" fill="#18181B" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="35" y="48" fill={isLight ? '#0F172A' : '#FFFFFF'} fontSize="8" fontWeight="bold">
                    Black
                  </text>
                </g>

                {/* Splicing Junction: Reader 1 Red + Reader 2 Red into wire-nut */}
                <path d="M 240 116 L 360 116 L 360 210" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                <path d="M 240 385 L 360 385 L 360 210" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                {/* Red Wire-Nut Splice Point */}
                <circle cx="360" cy="210" r="8" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="360" y="200" fill="#EF4444" fontSize="8" fontWeight="extrabold" textAnchor="middle">
                  SPLICE (RED)
                </text>

                {/* Wire from Red Splice to RBSN POS (+) */}
                <path
                  d="M 368 210 L 450 210 L 450 170 L 480 170"
                  stroke="#EF4444"
                  strokeWidth={isSimulatingTrigger ? '4' : '2.5'}
                  fill="none"
                  filter={isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                />

                {/* Splicing Junction: Reader 1 Black + Reader 2 Black into wire-nut */}
                <path d="M 240 140 L 330 140 L 330 250" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M 240 140 L 330 140 L 330 250" stroke="#18181B" strokeWidth="2.5" fill="none" />
                <path d="M 240 410 L 330 410 L 330 250" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M 240 410 L 330 410 L 330 250" stroke="#18181B" strokeWidth="2.5" fill="none" />
                {/* Black Wire-Nut Splice Point */}
                <circle cx="330" cy="250" r="8" fill="#18181B" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="330" y="270" fill={isLight ? '#0F172A' : '#E2E8F0'} fontSize="8" fontWeight="extrabold" textAnchor="middle">
                  SPLICE (BLACK)
                </text>

                {/* Wire from Black Splice to RBSN NEG (-) */}
                <path d="M 338 250 L 430 250 L 430 200 L 480 200" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M 338 250 L 430 250 L 430 200 L 480 200" stroke="#18181B" strokeWidth="2.5" fill="none" />

                {/* Shared RBSN Relay */}
                <g transform="translate(480, 125)">
                  <rect
                    width="150"
                    height="160"
                    rx="8"
                    fill={isLight ? '#FEF9C3' : '#1C1917'}
                    stroke="#EAB308"
                    strokeWidth="2"
                    filter={isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                  />
                  <text x="75" y="24" fill="#EAB308" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Shared RBSN Relay
                  </text>
                  <circle cx="20" cy="45" r="4.5" fill="#EF4444" stroke="#FFF" />
                  <text x="30" y="48" fill="#EF4444" fontSize="8" fontWeight="bold">POS (+)</text>
                  <circle cx="20" cy="75" r="4.5" fill="#18181B" stroke="#FFF" />
                  <text x="30" y="78" fill={isLight ? '#0F172A' : '#FFF'} fontSize="8" fontWeight="bold">NEG (-)</text>
                  <circle cx="130" cy="50" r="4.5" fill="#EAB308" />
                  <text x="110" y="53" fill="#EAB308" fontSize="9" fontWeight="bold">C</text>
                  <circle cx="130" cy="85" r="4.5" fill="#EAB308" />
                  <text x="110" y="88" fill="#EAB308" fontSize="9" fontWeight="bold">NO</text>
                </g>

                {/* Strike Box */}
                <g transform="translate(710, 140)">
                  <rect
                    width="230"
                    height="130"
                    rx="10"
                    fill="url(#strikeGrad)"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    filter={isSimulatingTrigger ? 'url(#energizedGlow)' : undefined}
                  />
                  <text x="115" y="30" fill="#10B981" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    Shared Electric Strike
                  </text>
                  <text x="115" y="50" fill={isLight ? '#475569' : '#94A3B8'} fontSize="9" textAnchor="middle">
                    Bidirectional Egress &amp; Ingress
                  </text>
                  <rect x="25" y="80" width="180" height="24" rx="4" fill={isLight ? '#DCFCE7' : '#064E3B'} />
                  <text x="115" y="96" fill={isLight ? '#166534' : '#6EE7B7'} fontSize="8" fontWeight="bold" textAnchor="middle">
                    Triggered by IN or OUT Reader
                  </text>
                </g>
                <path d="M 610 210 L 710 210" stroke="#EF4444" strokeWidth="2.5" fill="none" />
              </g>
            )}

            {/* ============================================================== */}
            {/* SCHEMATIC 4: ELEVATOR INSIDE CAR WITH RB 5 RELAY               */}
            {/* ============================================================== */}
            {selectedSchematicId === 'elevator_inside_rb5' && (
              <g>
                {/* Red wire from RC-15 to RB 5 Relay POS + */}
                <path
                  d="M 240 116 L 400 116 L 400 160 L 460 160"
                  stroke="#EF4444"
                  strokeWidth={activeWirePin === 1 || isSimulatingTrigger ? '4' : '2.5'}
                  fill="none"
                  filter={activeWirePin === 1 || isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                />
                <text x="300" y="108" fill="#EF4444" fontSize="9" fontWeight="bold">
                  Pin 1: RED to + POS
                </text>

                {/* Black wire from RC-15 to RB 5 Relay NEG - */}
                <path d="M 240 140 L 380 140 L 380 200 L 460 200" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path
                  d="M 240 140 L 380 140 L 380 200 L 460 200"
                  stroke="#18181B"
                  strokeWidth="2.5"
                  fill="none"
                  filter={activeWirePin === 2 ? 'url(#activeGlow)' : undefined}
                />
                <text x="300" y="148" fill={isLight ? '#0F172A' : '#E2E8F0'} fontSize="9" fontWeight="bold">
                  Pin 2: BLACK to - NEG
                </text>

                {/* RB 5 Relay Module Box */}
                <g transform="translate(460, 115)">
                  <rect
                    width="170"
                    height="160"
                    rx="8"
                    fill={isLight ? '#F3E8FF' : '#1E1528'}
                    stroke="#A855F7"
                    strokeWidth="2"
                    filter={isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                  />
                  <text x="85" y="24" fill="#C084FC" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    RB 5 Relay
                  </text>
                  <text x="85" y="38" fill={isLight ? '#6B21A8' : '#D8B4FE'} fontSize="8" textAnchor="middle">
                    Terminals of Control / Panel
                  </text>
                  <text x="85" y="48" fill={isLight ? '#6B21A8' : '#D8B4FE'} fontSize="8" textAnchor="middle">
                    to Bell Output
                  </text>

                  {/* Input Terminals */}
                  <circle cx="25" cy="45" r="4.5" fill="#EF4444" stroke="#FFFFFF" />
                  <text x="35" y="48" fill="#EF4444" fontSize="9" fontWeight="bold">
                    + POS
                  </text>

                  <circle cx="25" cy="85" r="4.5" fill="#18181B" stroke="#FFFFFF" />
                  <text x="35" y="88" fill={isLight ? '#0F172A' : '#FFFFFF'} fontSize="9" fontWeight="bold">
                    - NEG
                  </text>

                  {/* Output Contacts to Elevator */}
                  <circle cx="145" cy="50" r="4.5" fill="#A855F7" />
                  <text x="125" y="53" fill="#A855F7" fontSize="9" fontWeight="bold">C</text>
                  <circle cx="145" cy="80" r="4.5" fill="#A855F7" />
                  <text x="120" y="83" fill="#A855F7" fontSize="9" fontWeight="bold">NO</text>
                  <circle cx="145" cy="110" r="4.5" fill="#A855F7" />
                  <text x="120" y="113" fill="#A855F7" fontSize="9" fontWeight="bold">NC</text>
                </g>

                {/* High-visibility Elevator Demarcation Warning Wire & Boxes */}
                <path d="M 605 165 L 720 165" stroke="#FACC15" strokeWidth="2.5" strokeDasharray="4 2" fill="none" />
                <path d="M 605 195 L 720 195" stroke="#FACC15" strokeWidth="2.5" strokeDasharray="4 2" fill="none" />

                {/* Elevator Control Button Output Box */}
                <g transform="translate(720, 115)">
                  <rect
                    width="230"
                    height="95"
                    rx="8"
                    fill={isLight ? '#FEF2F2' : '#1A0E0E'}
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />
                  <text x="115" y="26" fill="#EF4444" fontSize="11" fontWeight="extrabold" textAnchor="middle">
                    Elevator Control Button Output
                  </text>
                  <rect x="20" y="38" width="190" height="26" rx="4" fill="#DC2626" />
                  <text x="115" y="55" fill="#FFFFFF" fontSize="9" fontWeight="extrabold" textAnchor="middle">
                    ⚠ TERMINATED BY ELEVATOR TECH ONLY
                  </text>
                  <text x="115" y="80" fill={isLight ? '#7F1D1D' : '#FCA5A5'} fontSize="8" textAnchor="middle">
                    Do not attempt to terminate this yourself
                  </text>
                </g>

                {/* Elevator Call Button */}
                <g transform="translate(720, 235)">
                  <rect
                    width="230"
                    height="85"
                    rx="8"
                    fill={isLight ? '#EFF6FF' : '#0F172A'}
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <circle cx="45" cy="42" r="18" fill="#10B981" />
                  <text x="45" y="47" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">▲</text>
                  <text x="80" y="35" fill="#3B82F6" fontSize="11" fontWeight="bold">Elevator Call Button</text>
                  <text x="80" y="55" fill="#EF4444" fontSize="9" fontWeight="bold">BY ELEVATOR TECH</text>
                  <text x="80" y="70" fill="#94A3B8" fontSize="8">NO/NC determined by car logic</text>
                </g>
              </g>
            )}

            {/* ============================================================== */}
            {/* SCHEMATIC 5: ELEVATOR OUTSIDE / STAIRWELL                      */}
            {/* ============================================================== */}
            {selectedSchematicId === 'elevator_outside_stairwell' && (
              <g>
                <path d="M 240 116 L 360 116 L 360 150 L 430 150" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                <path d="M 240 140 L 340 140 L 340 190 L 430 190" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M 240 140 L 340 140 L 340 190 L 430 190" stroke="#18181B" strokeWidth="2.5" fill="none" />

                {/* Central Relay & Fire Alarm Interface Box */}
                <g transform="translate(430, 115)">
                  <rect
                    width="190"
                    height="210"
                    rx="8"
                    fill={isLight ? '#FEF2F2' : '#180B0B'}
                    stroke="#DC2626"
                    strokeWidth="2.5"
                  />
                  <text x="95" y="24" fill="#EF4444" fontSize="11" fontWeight="extrabold" textAnchor="middle">
                    Power Supply &amp; FA Relay
                  </text>
                  <text x="95" y="38" fill={isLight ? '#7F1D1D' : '#FCA5A5'} fontSize="8" textAnchor="middle">
                    +12VDC · -12VDC · FA IN
                  </text>

                  {/* Fire Alarm Relay Emergency Block */}
                  <rect x="20" y="55" width="150" height="45" rx="4" fill="#991B1B" stroke="#EF4444" strokeWidth="1.5" />
                  <text x="95" y="76" fill="#FFFFFF" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                    FIRE ALARM RELAY
                  </text>
                  <text x="95" y="90" fill="#FCA5A5" fontSize="8" textAnchor="middle">
                    NFPA Emergency Power Drop
                  </text>

                  {/* Key Switch Override */}
                  <rect x="20" y="115" width="150" height="35" rx="4" fill={isLight ? '#E2E8F0' : '#1E293B'} stroke="#64748B" />
                  <text x="95" y="132" fill={isLight ? '#0F172A' : '#F1F5F9'} fontSize="9" fontWeight="bold" textAnchor="middle">
                    Key Switch Override
                  </text>
                  <text x="95" y="143" fill="#94A3B8" fontSize="7" textAnchor="middle">
                    COM · NC · NO
                  </text>

                  {/* Riser arrow */}
                  <text x="95" y="185" fill="#FACC15" fontSize="9" fontWeight="bold" textAnchor="middle">
                    ▲ RISER TO NEXT FLOOR
                  </text>
                </g>

                {/* Fail Safe Electrified Lockset */}
                <g transform="translate(690, 120)">
                  <rect
                    width="230"
                    height="100"
                    rx="8"
                    fill="url(#strikeGrad)"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    filter={isSimulatingTrigger ? 'url(#energizedGlow)' : undefined}
                  />
                  <text x="115" y="28" fill="#10B981" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    Fail Safe Electrified Lockset
                  </text>
                  <text x="115" y="44" fill={isLight ? '#475569' : '#94A3B8'} fontSize="8" textAnchor="middle">
                    Maintains latch-point when unlocked
                  </text>
                  <rect x="35" y="58" width="160" height="24" rx="4" fill="#18181B" stroke="#EF4444" strokeWidth="1" />
                  <text x="115" y="74" fill="#F87171" fontSize="8" fontWeight="bold" textAnchor="middle">
                    BackEMF Diode Close to Lock
                  </text>
                </g>

                {/* Elevator Demarcation */}
                <g transform="translate(690, 245)">
                  <rect width="230" height="80" rx="8" fill={isLight ? '#EFF6FF' : '#1E293B'} stroke="#3B82F6" strokeDasharray="4 4" />
                  <text x="115" y="28" fill="#3B82F6" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Elevator Control Output
                  </text>
                  <text x="115" y="48" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                    TERMINATED BY ELEVATOR TECH
                  </text>
                </g>
                <path d="M 620 170 L 690 170" stroke="#EF4444" strokeWidth="2.5" fill="none" />
              </g>
            )}

            {/* ============================================================== */}
            {/* SCHEMATIC 6: PS914-2RS POWER SUPPLY WITH PANIC BAR EL          */}
            {/* ============================================================== */}
            {selectedSchematicId === 'ps914_panic_bar' && (
              <g>
                {/* Wires from Reader to RBSN12/24 Relay */}
                <path d="M 240 116 L 350 116 L 350 200 L 400 200" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                <path d="M 240 140 L 330 140 L 330 230 L 400 230" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M 240 140 L 330 140 L 330 230 L 400 230" stroke="#18181B" strokeWidth="2.5" fill="none" />

                {/* PS914-2RS 24VDC Power Supply Box (Top Center) */}
                <g transform="translate(420, 25)">
                  <rect
                    width="230"
                    height="120"
                    rx="8"
                    fill={isLight ? '#EFF6FF' : '#0B132B'}
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                  />
                  <text x="115" y="24" fill="#3B82F6" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    PS914-2RS 24VDC Power Supply
                  </text>
                  <text x="115" y="40" fill={isLight ? '#1E40AF' : '#93C5FD'} fontSize="8" textAnchor="middle">
                    High-Inrush Power Supply for Electrified Panic Bars
                  </text>

                  {/* 2RS Option Board Terminal Block */}
                  <rect x="20" y="52" width="190" height="30" rx="4" fill={isLight ? '#DBEAFE' : '#030712'} stroke="#1D4ED8" />
                  <text x="115" y="71" fill="#60A5FA" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    SC · I1 · O1 · I2 · O2 · GND
                  </text>

                  {/* Potentiometer knobs */}
                  <circle cx="60" cy="100" r="8" fill="#F59E0B" stroke="#000" />
                  <line x1="60" y1="100" x2="65" y2="95" stroke="#000" strokeWidth="2" />
                  <text x="60" y="116" fill={isLight ? '#0F172A' : '#D1D5DB'} fontSize="7" textAnchor="middle">Zone 1 Pot</text>

                  <circle cx="170" cy="100" r="8" fill="#F59E0B" stroke="#000" />
                  <line x1="170" y1="100" x2="175" y2="95" stroke="#000" strokeWidth="2" />
                  <text x="170" y="116" fill={isLight ? '#0F172A' : '#D1D5DB'} fontSize="7" textAnchor="middle">Zone 2 Pot</text>
                </g>

                {/* Intermediate RBSN12/24 Relay */}
                <g transform="translate(400, 175)">
                  <rect
                    width="140"
                    height="125"
                    rx="8"
                    fill={isLight ? '#FEF9C3' : '#1C1917'}
                    stroke="#EAB308"
                    strokeWidth="2"
                    filter={isSimulatingTrigger ? 'url(#activeGlow)' : undefined}
                  />
                  <text x="70" y="24" fill="#EAB308" fontSize="11" fontWeight="bold" textAnchor="middle">
                    RBSN12/24 Relay
                  </text>
                  <text x="70" y="38" fill={isLight ? '#854D0E' : '#CA8A04'} fontSize="8" textAnchor="middle">
                    Triggers PS914 I1 / SC
                  </text>

                  <circle cx="20" cy="50" r="4.5" fill="#EF4444" stroke="#FFF" />
                  <text x="30" y="53" fill="#EF4444" fontSize="8" fontWeight="bold">POS (+)</text>

                  <circle cx="20" cy="75" r="4.5" fill="#18181B" stroke="#FFF" />
                  <text x="30" y="78" fill={isLight ? '#0F172A' : '#FFF'} fontSize="8" fontWeight="bold">NEG (-)</text>

                  <circle cx="120" cy="55" r="4.5" fill="#EAB308" />
                  <text x="100" y="58" fill="#EAB308" fontSize="8" fontWeight="bold">C</text>

                  <circle cx="120" cy="85" r="4.5" fill="#EAB308" />
                  <text x="95" y="88" fill="#EAB308" fontSize="8" fontWeight="bold">NO</text>
                </g>

                {/* Wire from RBSN Relay contacts up to PS914 I1 and SC */}
                <path d="M 520 230 L 580 230 L 580 82 L 490 82" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                <path d="M 520 260 L 600 260 L 600 82 L 470 82" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <text x="610" y="190" fill="#8B5CF6" fontSize="8" fontWeight="bold">
                  Dry trigger to I1 / SC
                </text>

                {/* Heavy 12-14 AWG 24VDC Run from PS914-2RS to Panic Bar */}
                <path
                  d="M 540 82 L 720 82 L 720 180"
                  stroke="#EF4444"
                  strokeWidth={isSimulatingTrigger ? '5' : '3.5'}
                  fill="none"
                  filter={isSimulatingTrigger ? 'url(#energizedGlow)' : undefined}
                />
                <text x="640" y="74" fill="#EF4444" fontSize="9" fontWeight="extrabold">
                  Heavy 12-14 AWG (24VDC High Inrush)
                </text>

                {/* Electrified Latch Retraction (EL) Panic Bar Box */}
                <g transform="translate(680, 160)">
                  <rect
                    width="260"
                    height="160"
                    rx="10"
                    fill="url(#strikeGrad)"
                    stroke={isSimulatingTrigger ? '#10B981' : '#10B981'}
                    strokeWidth="2.5"
                    filter={isSimulatingTrigger ? 'url(#energizedGlow)' : undefined}
                  />
                  <text x="130" y="28" fill="#10B981" fontSize="13" fontWeight="extrabold" textAnchor="middle">
                    Electrified Panic Bar (EL / QEL)
                  </text>
                  <text x="130" y="44" fill={isLight ? '#475569' : '#94A3B8'} fontSize="8" textAnchor="middle">
                    Motorized Latch Retraction (Von Duprin 98/99 EL / Falcon)
                  </text>

                  {/* High current solenoid / motor terminal */}
                  <rect x="25" y="55" width="210" height="28" rx="4" fill={isLight ? '#DCFCE7' : '#064E3B'} stroke="#10B981" />
                  <text x="130" y="73" fill={isLight ? '#166534' : '#6EE7B7'} fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                    24VDC (+) · GND (-) MOTOR
                  </text>

                  {/* Built-in REX Switch and DSM sensor */}
                  <rect x="25" y="92" width="100" height="22" rx="4" fill={isLight ? '#E0E7FF' : '#1E1B4B'} />
                  <text x="75" y="106" fill="#818CF8" fontSize="8" fontWeight="bold" textAnchor="middle">
                    REX Microswitch
                  </text>

                  <rect x="135" y="92" width="100" height="22" rx="4" fill={isLight ? '#E0F2FE' : '#082F49'} />
                  <text x="185" y="106" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">
                    DSM Door Sensor
                  </text>

                  <text x="130" y="138" fill="#EF4444" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Adjust potentiometer to prevent latch motor bind
                  </text>
                </g>
              </g>
            )}

            {/* 7. ButterflyMX Intercom Integration with RC Reader Controller */}
            {selectedSchematicId === 'butterfly_intercom' && (
              <g id="schematic-butterfly-intercom">
                {/* Wires from RC Reader to ButterflyMX Intercom */}
                {/* Pin 6 Blue (REX) wire */}
                <path
                  d="M 235 220 L 450 220 L 450 180 L 580 180"
                  stroke="#3B82F6"
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Pin 2 Black (Common GND) wire */}
                <path
                  d="M 235 140 L 470 140 L 470 210 L 580 210"
                  stroke={isLight ? '#0F172A' : '#F8FAFC'}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Wire identification labels */}
                <rect x="300" y="208" width="130" height="18" rx="4" fill="#1E3A8A" />
                <text x="365" y="221" fill="#93C5FD" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Pin 6 Blue: REX Input
                </text>

                <rect x="300" y="128" width="140" height="18" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
                <text x="370" y="141" fill="#F8FAFC" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  Pin 2 Black: Common GND
                </text>

                {/* ButterflyMX Intercom Chassis */}
                <g transform="translate(580, 100)">
                  <rect
                    width="180"
                    height="190"
                    rx="16"
                    fill={isLight ? '#FFFFFF' : '#0B0F19'}
                    stroke={isLight ? '#0284C7' : '#38BDF8'}
                    strokeWidth="2.5"
                  />
                  {/* Header bar */}
                  <rect width="180" height="32" rx="16" fill={isLight ? '#E0F2FE' : '#0C4A6E'} />
                  <rect y="16" width="180" height="16" fill={isLight ? '#E0F2FE' : '#0C4A6E'} />
                  
                  {/* ButterflyMX logo icon */}
                  <circle cx="22" cy="16" r="3" fill="#38BDF8" />
                  <circle cx="28" cy="12" r="3" fill="#F43F5E" />
                  <circle cx="34" cy="16" r="3" fill="#F97316" />
                  
                  <text x="44" y="20" fill={isLight ? '#0369A1' : '#F0F9FF'} fontSize="11" fontWeight="bold">
                    ButterflyMX Intercom
                  </text>
                  <text x="90" y="46" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="8.5" textAnchor="middle">
                    8" / 12" Video Touchscreen
                  </text>

                  {/* Intercom Relay Output Terminals */}
                  <g transform="translate(15, 60)">
                    <rect width="150" height="50" rx="6" fill={isLight ? '#F1F5F9' : '#020617'} stroke={isLight ? '#CBD5E1' : '#1E293B'} />
                    <text x="75" y="16" fill={isLight ? '#0F172A' : '#FFFFFF'} fontSize="9" fontWeight="bold" textAnchor="middle">
                      LOCKING RELAY (Dry Contact)
                    </text>
                    <circle cx="25" cy="34" r="5" fill="#3B82F6" />
                    <text x="35" y="37" fill="#3B82F6" fontSize="8" fontWeight="bold">Term A (to REX)</text>
                    <circle cx="100" cy="34" r="5" fill={isLight ? '#0F172A' : '#F8FAFC'} />
                    <text x="110" y="37" fill={isLight ? '#0F172A' : '#F8FAFC'} fontSize="8" fontWeight="bold">Term B (COM)</text>
                  </g>

                  {/* Power Subsystem note */}
                  <g transform="translate(15, 120)">
                    <rect width="150" height="54" rx="6" fill={isLight ? '#FAF5FF' : '#2E1065'} stroke="#A855F7" strokeWidth="1" />
                    <text x="75" y="16" fill={isLight ? '#6B21A8' : '#E9D5FF'} fontSize="8.5" fontWeight="bold" textAnchor="middle">
                      24VDC / 50W Dedicated Supply
                    </text>
                    <text x="75" y="30" fill={isLight ? '#7E22CE' : '#D8B4FE'} fontSize="7.5" textAnchor="middle">
                      + UPS Backup (min 300W / 600VA)
                    </text>
                    <text x="75" y="44" fill={isLight ? '#9333EA' : '#C084FC'} fontSize="7.5" textAnchor="middle">
                      Never power from RC 12VDC leads
                    </text>
                  </g>
                </g>

                {/* Shared Electric Strike controlled by RC Reader (Option A) & Intercom Relay (Option B) */}
                <g transform="translate(780, 110)">
                  <rect
                    width="180"
                    height="124"
                    rx="8"
                    fill={isLight ? '#F8FAFC' : '#111827'}
                    stroke={isLight ? '#059669' : '#10B981'}
                    strokeWidth="1.5"
                  />
                  <text x="90" y="22" fill={isLight ? '#0F172A' : '#FFFFFF'} fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    SHARED DOOR STRIKE
                  </text>
                  <text x="90" y="36" fill={isLight ? '#047857' : '#34D399'} fontSize="7.5" fontWeight="bold" textAnchor="middle">
                    ★ COMMON HARDWARE (OPTION A &amp; B)
                  </text>
                  <rect x="15" y="46" width="150" height="22" rx="4" fill="#047857" />
                  <text x="90" y="60" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                    RELEASES ON REX TRIGGER
                  </text>
                  <text x="90" y="82" fill={isLight ? '#334155' : '#94A3B8'} fontSize="7.5" textAnchor="middle">
                    Option A: RC Pin 1 (+12V) &amp; Pin 2 (GND)
                  </text>
                  <text x="90" y="96" fill={isLight ? '#DC2626' : '#F87171'} fontSize="7.5" textAnchor="middle">
                    Option B: Intercom Relay (Diode/MOV)
                  </text>
                  <text x="90" y="112" fill="#10B981" fontSize="7" textAnchor="middle">
                    BackEMF Diode at strike terminals
                  </text>
                </g>
              </g>
            )}

            {/* ============================================================== */}
            {/* CAD TITLE BLOCK (Bottom Right)                                 */}
            {/* ============================================================== */}
            <g transform="translate(520, 440)">
              <rect
                width="460"
                height="80"
                rx="4"
                fill={isLight ? '#FFFFFF' : '#060911'}
                stroke={isLight ? '#CBD5E1' : '#334155'}
                strokeWidth="1.5"
              />
              {/* Horizontal Dividers */}
              <line x1="0" y1="26" x2="460" y2="26" stroke={isLight ? '#E2E8F0' : '#1E293B'} strokeWidth="1" />
              <line x1="0" y1="52" x2="460" y2="52" stroke={isLight ? '#E2E8F0' : '#1E293B'} strokeWidth="1" />
              {/* Vertical Divider */}
              <line x1="230" y1="0" x2="230" y2="80" stroke={isLight ? '#E2E8F0' : '#1E293B'} strokeWidth="1" />

              {/* Row 1 */}
              <text x="12" y="17" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="8">
                PROJECT: <tspan fill={isLight ? '#0F172A' : '#FFFFFF'} fontWeight="bold">Homebase / Quext IoT Access Control</tspan>
              </text>
              <text x="242" y="17" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="8">
                SHEET TITLE: <tspan fill={isLight ? '#0F172A' : '#FFFFFF'} fontWeight="bold">{currentConfig.sheetTitle.slice(0, 26)}...</tspan>
              </text>

              {/* Row 2 */}
              <text x="12" y="42" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="8">
                ADDRESS: <tspan fill={isLight ? '#0F172A' : '#E2E8F0'}>1619 Walnut St, Kansas City, MO</tspan>
              </text>
              <text x="242" y="42" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="8">
                SHEET NO: <tspan fill="#06B6D4" fontWeight="bold">{currentConfig.sheetNumber}</tspan> · REV: <tspan fill="#10B981" fontWeight="bold">1.4</tspan>
              </text>

              {/* Row 3 */}
              <text x="12" y="68" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="8">
                DRAWN BY: <tspan fill="#C084FC" fontWeight="bold">{currentConfig.drawnBy}</tspan>
              </text>
              <text x="242" y="68" fill={isLight ? '#64748B' : '#94A3B8'} fontSize="8">
                CHECKED BY: <tspan fill="#C084FC" fontWeight="bold">{currentConfig.checkedBy}</tspan> · DATE: <tspan fill={isLight ? '#0F172A' : '#FFFFFF'}>{currentConfig.dateStr}</tspan>
              </text>
            </g>
          </svg>
        </div>

        {/* Selected Wire Inspector Bar */}
        <div
          className={`p-4 border-t text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
            isLight
              ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
              : 'bg-[#0B1120] border-zinc-800 text-zinc-300'
          }`}
        >
          {activeWireInfo ? (
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full inline-block shrink-0 shadow-sm border border-white/50"
                style={{ backgroundColor: activeWireInfo.hex }}
              />
              <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded text-[11px]">
                {activeWireInfo.name} ({activeWireInfo.gauge})
              </span>
              <span className="text-cyan-400 font-mono font-semibold">
                [{activeWireInfo.voltage}]
              </span>
              <span className="text-zinc-300 font-medium">
                → {activeWireInfo.connectedTo}
              </span>
              <span className="text-zinc-400 text-[11px]">
                ({activeWireInfo.functionDesc})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Click on any wire lead or terminal pin in the diagram above to inspect voltage, destination, and gauge specifications.</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="text-zinc-500">Status:</span>
            <span className={`px-2 py-0.5 rounded font-bold ${isSimulatingTrigger ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-300'}`}>
              {isSimulatingTrigger ? 'COIL ENERGIZED' : 'STANDBY ARMED'}
            </span>
          </div>
        </div>
      </div>

      {/* Field Wiring Rules & Code Compliance Spec Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spec Notes */}
        <div className="bg-[#090D16] border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Technical Specification Notes</span>
          </div>
          <ul className="space-y-2">
            {currentConfig.specNotes.map((note, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Life Safety & Field Rules */}
        <div className="bg-[#090D16] border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Field Installation Directives</span>
          </div>
          <ul className="space-y-2">
            {currentConfig.fieldRules.map((rule, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                <span className="text-purple-400 font-bold">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 p-3 bg-purple-950/30 border border-purple-800/40 rounded-lg text-purple-200 text-xs leading-relaxed">
            <strong className="block text-purple-300 font-bold mb-0.5">OEM Escalation Rule:</strong>
            Reach out to Quext Field Support (<a href="mailto:support@onequext.com" className="text-cyan-400 underline font-mono">support@onequext.com</a>) once low-voltage wiring is complete to push reader NO/NC cloud configuration.
          </div>
        </div>
      </div>
    </div>
  );
};
