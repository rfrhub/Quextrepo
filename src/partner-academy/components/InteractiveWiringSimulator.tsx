import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Zap,
  RotateCcw,
  ShieldAlert,
  Cpu,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
  FileText,
  Sliders,
  Layers,
  ArrowRight,
  Info,
  Check,
  Flame,
  Snowflake,
  Wind,
} from 'lucide-react';

interface TerminalSlot {
  name: string;
  expectedWire: string | null;
  description: string;
  subsystem?: 'indoor' | 'heatpump' | 'none';
  roleNote?: string;
}

export const InteractiveWiringSimulator: React.FC<{
  onComplete?: () => void;
}> = ({ onComplete }) => {
  const [hvacType, setHvacType] = useState<'conventional' | 'heat_pump'>('conventional');
  const [viewLayout, setViewLayout] = useState<'dual' | 'simulator' | 'schematic'>('dual');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);

  // Available wires in the field cable bundle
  const availableWires = [
    { id: 'wire_red', colorName: 'Red (R)', hex: '#EF4444', label: '24VAC Power (Heating Transformer)', defaultTarget: 'R' },
    { id: 'wire_blue', colorName: 'Blue (C)', hex: '#0EA5E9', label: '24VAC Common Return (Mandatory)', defaultTarget: 'C' },
    { id: 'wire_yellow', colorName: 'Yellow (Y)', hex: '#EAB308', label: 'Compressor Relay / 1st Stage', defaultTarget: 'Y' },
    { id: 'wire_white', colorName: 'White (W)', hex: '#F8FAFC', label: hvacType === 'conventional' ? 'Heat Relay' : 'Aux Heat (W1)', defaultTarget: 'W' },
    { id: 'wire_green', colorName: 'Green (G)', hex: '#22C55E', label: 'Fan Relay (Indoor Blower)', defaultTarget: 'G' },
    { id: 'wire_orange', colorName: 'Orange (O/B)', hex: '#F97316', label: 'Heat Pump O/B Reversing Valve', defaultTarget: 'Aux' },
  ];

  // Conventional terminal layout (Untitled 2 reference)
  const conventionalTerminals: TerminalSlot[] = [
    { name: 'R', expectedWire: 'wire_red', description: '24VAC Power from Heating Transformer', subsystem: 'indoor' },
    { name: 'Rc', expectedWire: null, description: 'Not Used', subsystem: 'none', roleNote: 'Unconnected / bridged internally' },
    { name: 'Y', expectedWire: 'wire_yellow', description: 'Compressor Relay', subsystem: 'indoor' },
    { name: 'C', expectedWire: 'wire_blue', description: '24VAC Common Wire', subsystem: 'indoor', roleNote: 'Mandatory for LoRaWAN gateway power' },
    { name: 'W', expectedWire: 'wire_white', description: 'Heat Relay', subsystem: 'indoor' },
    { name: 'G', expectedWire: 'wire_green', description: 'Fan Relay', subsystem: 'indoor' },
    { name: 'Aux', expectedWire: null, description: 'Not Used', subsystem: 'none' },
    { name: 'NC', expectedWire: null, description: 'Not Used', subsystem: 'none' },
  ];

  // Heat pump terminal layout (IMG_6014 reference)
  const heatPumpTerminals: TerminalSlot[] = [
    { name: 'R', expectedWire: 'wire_red', description: '24VAC Power from Heating Transformer', subsystem: 'indoor', roleNote: 'Indoor Handler 24VAC transformer' },
    { name: 'Rc', expectedWire: null, description: 'Not Used', subsystem: 'none' },
    { name: 'Y', expectedWire: 'wire_yellow', description: 'Compressor Relay (1st Stage Y1)', subsystem: 'heatpump', roleNote: 'Heat Pump Connections' },
    { name: 'C', expectedWire: 'wire_blue', description: '24VAC Common Wire', subsystem: 'indoor', roleNote: 'Indoor Handler return path' },
    { name: 'W', expectedWire: 'wire_white', description: 'Aux Heat (W1 Relay)', subsystem: 'heatpump', roleNote: 'Emergency & auxiliary strip heat' },
    { name: 'G', expectedWire: 'wire_green', description: 'Fan Relay', subsystem: 'indoor', roleNote: 'Indoor Handler blower' },
    { name: 'Aux', expectedWire: 'wire_orange', description: 'Heat Pump O/B (Reversing Valve)', subsystem: 'heatpump', roleNote: 'Controls seasonal cooling/heating valve' },
    { name: 'NC', expectedWire: null, description: 'Not Used', subsystem: 'none' },
  ];

  const currentTerminals = hvacType === 'conventional' ? conventionalTerminals : heatPumpTerminals;

  // Selected wire to connect
  const [selectedWire, setSelectedWire] = useState<string | null>(null);
  // Map terminal name -> wireId
  const [connections, setConnections] = useState<Record<string, string>>({
    R: 'wire_red',
  });

  const [testOutput, setTestOutput] = useState<{
    tested: boolean;
    success: boolean;
    voltage: number;
    activeMode: 'COOL' | 'HEAT' | 'AUX_HEAT' | 'OFF';
    message: string;
    details: string[];
  } | null>(null);

  const activeImageSrc =
    hvacType === 'conventional'
      ? '/assets/aistudio/Untitled_2_583db62c.png'
      : '/assets/aistudio/IMG_6014_21031614.jpeg';

  const activeDiagramTitle =
    hvacType === 'conventional'
      ? 'Conventional 1 Stage Heating, 1 Stage Cooling Reference'
      : 'Heat Pump - 2 Heat, 1 Cool Reference Wiring Schematic';

  const handleConnect = (terminalName: string) => {
    if (!selectedWire) return;

    // Check if terminal is Not Used
    const targetTerm = currentTerminals.find((t) => t.name === terminalName);
    if (targetTerm && targetTerm.expectedWire === null) {
      // Allow inserting but keep warning ready during test
    }

    const updated = { ...connections };
    // Remove wire from other terminals if already placed
    Object.keys(updated).forEach((t) => {
      if (updated[t] === selectedWire) delete updated[t];
    });

    updated[terminalName] = selectedWire;
    setConnections(updated);
    setSelectedWire(null);
    setTestOutput(null);
  };

  const handleDisconnect = (terminalName: string) => {
    const updated = { ...connections };
    delete updated[terminalName];
    setConnections(updated);
    setTestOutput(null);
  };

  const handleReset = () => {
    setConnections({});
    setSelectedWire(null);
    setTestOutput(null);
  };

  const handleAutoWirePreset = () => {
    const preset: Record<string, string> = {};
    currentTerminals.forEach((t) => {
      if (t.expectedWire) {
        preset[t.name] = t.expectedWire;
      }
    });
    setConnections(preset);
    setTestOutput(null);
  };

  const runDiagnosticCircuitTest = () => {
    const hasR = connections['R'] === 'wire_red';
    const hasC = connections['C'] === 'wire_blue';
    const hasY = connections['Y'] === 'wire_yellow';
    const hasW = connections['W'] === 'wire_white';
    const hasG = connections['G'] === 'wire_green';
    const hasAux = connections['Aux'] === 'wire_orange';

    const details: string[] = [];

    // Check R & C fundamentals
    if (!hasR) {
      details.push('CRITICAL FAULT: Missing 24VAC Power from Heating Transformer (R terminal). Sub-base has no power.');
    }
    if (!hasC) {
      details.push('CRITICAL FAULT: 24VAC Common (C) wire not connected! Quext embedded LoRaWAN gateway radio cannot power on.');
    }

    // Check unwanted connections on Not Used terminals
    if (connections['Rc']) {
      details.push('NOTE: Rc terminal is flagged "Not Used" on this Quext installation. Remove or isolate jumper.');
    }
    if (connections['NC']) {
      details.push('NOTE: NC terminal must remain open ("Not Used"). Remove wire from NC.');
    }

    let activeMode: 'COOL' | 'HEAT' | 'AUX_HEAT' | 'OFF' = 'OFF';

    if (hvacType === 'conventional') {
      if (!hasY) details.push('WARNING: Y (Compressor Relay) wire missing or misplaced. Cooling stage inoperable.');
      if (!hasW) details.push('WARNING: W (Heat Relay) wire missing or misplaced. Heating stage inoperable.');
      if (!hasG) details.push('WARNING: G (Fan Relay) wire missing or misplaced. Indoor blower fan will not engage.');
      if (connections['Aux']) {
        details.push('ADVISORY: Aux terminal is "Not Used" in Conventional 1-Heat / 1-Cool mode. Orange wire should only be wired on Heat Pump systems.');
      }
      if (hasR && hasC && hasY && hasG) activeMode = 'COOL';
      else if (hasR && hasC && hasW && hasG) activeMode = 'HEAT';
    } else {
      // Heat pump mode
      if (!hasY) details.push('WARNING: Y (Compressor 1st Stage Y1) wire missing or misplaced.');
      if (!hasAux) {
        details.push('CRITICAL: Aux (Heat Pump O/B Reversing Valve) wire missing! Thermostat cannot switch between cooling and heating.');
      }
      if (!hasW) details.push('ADVISORY: W (Aux Heat / Emergency Heat W1) wire missing or misplaced.');
      if (!hasG) details.push('WARNING: G (Fan Relay) wire missing or misplaced.');
      if (hasR && hasC && hasY && hasAux) activeMode = 'COOL';
    }

    const isSuccess = hasR && hasC && details.filter((d) => d.startsWith('CRITICAL') || d.startsWith('WARNING')).length === 0;

    setTestOutput({
      tested: true,
      success: isSuccess,
      voltage: hasR && hasC ? 26.2 : 0.0,
      activeMode: isSuccess ? activeMode : 'OFF',
      message: isSuccess
        ? `All ${hvacType === 'conventional' ? 'Conventional 1H/1C' : 'Heat Pump 2H/1C'} HVAC control circuits verified! 26.2 VAC nominal measured. Quext LoRaWAN Gateway transceiver online.`
        : 'Circuit verification failed. Please review terminal clamps and cross-reference with the official wiring schematic.',
      details,
    });

    if (isSuccess && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-[#090b10] border border-zinc-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl text-zinc-100">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Official Field Engineering Tool
            </span>
            <span className="text-[11px] font-mono text-zinc-500">Model QXT100048 / QX-TSTAT-V2</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5 tracking-tight">
            Quext thermostat Wiring Sandbox
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Simulate and verify 24VAC thermostat sub-base terminations for Conventional Split and Heat Pump HVAC systems, grounded in official Quext engineering schematics.
          </p>
        </div>

        {/* System & View controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* HVAC Type Toggle */}
          <div className="flex items-center p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl shadow-inner">
            <button
              onClick={() => {
                setHvacType('conventional');
                setConnections({ R: 'wire_red' });
                setTestOutput(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                hvacType === 'conventional'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Conventional (1H / 1C)</span>
            </button>
            <button
              onClick={() => {
                setHvacType('heat_pump');
                setConnections({ R: 'wire_red' });
                setTestOutput(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                hvacType === 'heat_pump'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-cyan-300" />
              <span>Heat Pump (2H / 1C)</span>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="hidden sm:flex items-center p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl">
            <button
              onClick={() => setViewLayout('dual')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                viewLayout === 'dual' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Side-by-side Schematic & Simulator"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dual View</span>
            </button>
            <button
              onClick={() => setViewLayout('simulator')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                viewLayout === 'simulator' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Simulator Board Only"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sandbox</span>
            </button>
            <button
              onClick={() => setViewLayout('schematic')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                viewLayout === 'schematic' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Official Schematic Diagram"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Diagram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sandbox Container */}
      <div className="mt-6 space-y-6">
        {/* Dual Layout: Diagram + Interactive Sub-Base */}
        <div
          className={`grid gap-6 ${
            viewLayout === 'dual'
              ? 'grid-cols-1 lg:grid-cols-12'
              : 'grid-cols-1'
          }`}
        >
          {/* SECTION A: Official Field Wiring Reference Diagram */}
          {(viewLayout === 'dual' || viewLayout === 'schematic') && (
            <div
              className={`${
                viewLayout === 'dual' ? 'lg:col-span-5' : 'w-full'
              } flex flex-col bg-zinc-950/90 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Official Quext Wiring Blueprint
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-md">
                    {hvacType === 'conventional' ? 'Untitled 2 Source' : 'IMG_6014 Source'}
                  </span>
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors cursor-pointer"
                    title="Enlarge Blueprint in High-Res Modal"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Blueprint Image Preview Box */}
              <div className="mt-4 relative group rounded-xl overflow-hidden border border-zinc-800 bg-[#06080d] flex items-center justify-center min-h-[220px]">
                <img
                  src={activeImageSrc}
                  alt={activeDiagramTitle}
                  className="w-full h-auto max-h-[340px] object-contain transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-white backdrop-blur-[2px] cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4 text-cyan-400" />
                  <span>Click to Enlarge Official Diagram</span>
                </button>
              </div>

              {/* Sub-Base Terminal Mapping Table directly from the uploaded reference */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    Terminal Connections Reference
                  </h4>
                  <span className="text-[10px] text-zinc-500">
                    {hvacType === 'conventional' ? '1 Heat, 1 Cool' : '2 Heat, 1 Cool'}
                  </span>
                </div>

                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/60 divide-y divide-zinc-800/80 text-xs">
                  {currentTerminals.map((t) => {
                    const isHovered = hoveredTerminal === t.name;
                    const isConnected = !!connections[t.name];

                    return (
                      <div
                        key={t.name}
                        onMouseEnter={() => setHoveredTerminal(t.name)}
                        onMouseLeave={() => setHoveredTerminal(null)}
                        className={`flex items-center justify-between p-2 transition-colors ${
                          isHovered
                            ? 'bg-purple-950/40 text-purple-200'
                            : isConnected
                            ? 'bg-zinc-900/40'
                            : 'hover:bg-zinc-800/30'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-[11px] text-amber-300 shrink-0">
                            {t.name}
                          </span>
                          <div>
                            <span className="font-semibold text-white text-[12px]">{t.description}</span>
                            {t.roleNote && (
                              <p className="text-[10px] text-zinc-400 leading-tight">{t.roleNote}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          {t.expectedWire ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {t.expectedWire === 'wire_red' && 'Red (R)'}
                              {t.expectedWire === 'wire_blue' && 'Blue (C)'}
                              {t.expectedWire === 'wire_yellow' && 'Yellow (Y)'}
                              {t.expectedWire === 'wire_white' && 'White (W)'}
                              {t.expectedWire === 'wire_green' && 'Green (G)'}
                              {t.expectedWire === 'wire_orange' && 'Orange (O/B)'}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-500">
                              Not Used
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subsystem Distinction Callout */}
              {hvacType === 'heat_pump' && (
                <div className="mt-3 p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/30 text-[11px] text-zinc-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-300">Indoor Handler vs Heat Pump: </span>
                    Terminals <span className="font-mono text-white">R, C, G</span> connect to the Indoor Handler, while <span className="font-mono text-white">Y (Compressor), Aux (Reversing Valve O/B), and W (Aux Heat W1)</span> connect to the outdoor Heat Pump unit.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION B: Interactive Sub-Base Termination Board & Multimeter */}
          {(viewLayout === 'dual' || viewLayout === 'simulator') && (
            <div
              className={`${
                viewLayout === 'dual' ? 'lg:col-span-7' : 'w-full'
              } space-y-5`}
            >
              {/* Wire Dispenser Strip */}
              <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      18/8 Thermostat Cable Bundle
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {selectedWire ? 'Click any clamp below to terminate' : 'Click a lead to pick it up'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableWires.map((wire) => {
                    const isSelected = selectedWire === wire.id;
                    const connectedTo = Object.keys(connections).find((t) => connections[t] === wire.id);

                    return (
                      <button
                        key={wire.id}
                        onClick={() => setSelectedWire(isSelected ? null : wire.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/50 ring-2 ring-cyan-400 shadow-lg'
                            : connectedTo
                            ? 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700'
                            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/50 shadow-sm shrink-0"
                              style={{ backgroundColor: wire.hex }}
                            />
                            <span className="text-xs font-bold text-white">{wire.colorName}</span>
                          </div>
                          {connectedTo && (
                            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.2 rounded">
                              → {connectedTo}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{wire.label}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Preset & Reset actions */}
                <div className="mt-3.5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={handleAutoWirePreset}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Auto-Wire Reference Standard</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All Wires</span>
                  </button>
                </div>
              </div>

              {/* Physical Quext Sub-Base Graphic Terminal Array */}
              <div className="bg-gradient-to-b from-[#101524] via-[#0b0e17] to-[#07090f] border-2 border-zinc-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl relative">
                {/* Physical Subbase Headplate */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-zinc-800/80">
                  <div>
                    <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" />
                      Quext Patented Sub-Base · Terminal Block Array
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      R · Rc · Y · C · W · G · Aux · NC (Standard 8-Terminal Strip)
                    </div>
                  </div>

                  {/* Built-in Spirit Level Bubble Graphic */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Sub-Base Level:</span>
                    <div className="w-20 bg-emerald-950/70 border border-emerald-500/40 rounded-full h-4 relative flex items-center justify-center overflow-hidden">
                      <div className="w-3.5 h-3 bg-emerald-400 rounded-full opacity-90 shadow-sm" />
                      <span className="absolute text-[7px] font-mono text-emerald-200 uppercase tracking-widest pointer-events-none">
                        OK
                      </span>
                    </div>
                  </div>
                </div>

                {/* The 8 Physical Sub-Base Clamps matching IMG_6014 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentTerminals.map((terminal) => {
                    const connectedWireId = connections[terminal.name];
                    const connectedWire = availableWires.find((w) => w.id === connectedWireId);
                    const isSelectedTarget = selectedWire !== null;
                    const isNotUsed = terminal.expectedWire === null;
                    const isHovered = hoveredTerminal === terminal.name;

                    return (
                      <div
                        key={terminal.name}
                        onClick={() => {
                          if (selectedWire) {
                            handleConnect(terminal.name);
                          }
                        }}
                        onMouseEnter={() => setHoveredTerminal(terminal.name)}
                        onMouseLeave={() => setHoveredTerminal(null)}
                        className={`relative p-3 rounded-xl border transition-all cursor-pointer ${
                          connectedWire
                            ? 'border-zinc-600 bg-zinc-900/95 shadow-md ring-1 ring-white/10'
                            : isSelectedTarget
                            ? 'border-dashed border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40'
                            : isNotUsed
                            ? 'border-dashed border-zinc-800/80 bg-zinc-950/40 opacity-70'
                            : 'border-dashed border-zinc-800 bg-zinc-950/70 hover:border-zinc-700'
                        } ${isHovered ? 'ring-2 ring-purple-400' : ''}`}
                      >
                        {/* Clamp Top Bar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {/* Screw head representation */}
                            <div className="w-6 h-6 rounded-md bg-amber-950/60 border border-amber-500/50 flex items-center justify-center font-mono font-extrabold text-amber-300 text-xs shadow-inner">
                              {terminal.name}
                            </div>
                            <span className="text-xs font-bold text-white">
                              {terminal.name}
                            </span>
                          </div>

                          {connectedWire && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDisconnect(terminal.name);
                              }}
                              className="w-5 h-5 rounded hover:bg-rose-950/80 text-zinc-400 hover:text-rose-400 flex items-center justify-center text-xs transition-colors cursor-pointer"
                              title="Disconnect lead"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Terminal Role text */}
                        <div className="text-[10px] text-zinc-400 mt-1.5 leading-snug min-h-[28px]">
                          {terminal.description}
                        </div>

                        {/* Connection Lead visual status */}
                        <div className="mt-2.5 pt-2 border-t border-zinc-800/90 flex items-center justify-between text-[11px]">
                          {connectedWire ? (
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 rounded-full border border-black/50 shadow"
                                style={{ backgroundColor: connectedWire.hex }}
                              />
                              <span className="font-semibold text-zinc-200">
                                {connectedWire.colorName.split(' ')[0]}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-500 italic">
                              {selectedWire ? 'Click to insert' : isNotUsed ? 'Not Used' : 'Open Clamp'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Circuit Test Verification Action */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-zinc-400">
                    Validate 24VAC R/C transformer circuit, relay energization, and LoRaWAN backhaul radio.
                  </div>
                  <button
                    onClick={runDiagnosticCircuitTest}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>Run Circuit &amp; LoRa Diagnostic</span>
                  </button>
                </div>
              </div>

              {/* Thermostat Screen Simulator & Diagnostic Multimeter Status */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Live Thermostat Screen */}
                <div className="md:col-span-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                      Quext Digital Display
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                        testOutput?.success
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {testOutput?.success ? 'GATEWAY ONLINE' : 'POWER CUTOFF'}
                    </span>
                  </div>

                  <div
                    className={`aspect-video rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-500 relative border ${
                      testOutput?.success
                        ? 'bg-black border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                        : 'bg-black/70 border-zinc-900 text-zinc-600'
                    }`}
                  >
                    {testOutput?.success ? (
                      <>
                        <div className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          QUEXT CONNECTED
                        </div>
                        <div className="text-4xl font-extrabold text-white tracking-tighter tabular-nums">
                          72°
                        </div>
                        <div className="text-[11px] text-zinc-300 font-medium mt-0.5 flex items-center gap-2">
                          <span>{testOutput.activeMode === 'COOL' ? 'COOL SET 74°' : 'HEAT SET 70°'}</span>
                          <span className="text-[9px] font-mono text-cyan-300/80 bg-zinc-900 px-1.5 py-0.5 rounded">
                            {hvacType === 'conventional' ? '1H/1C Split' : 'Heat Pump'}
                          </span>
                        </div>
                        <div className="mt-1.5 text-[9px] text-zinc-400 font-mono">
                          Lora Thermogate · RSSI: -68 dBm
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <ShieldAlert className="w-7 h-7 mx-auto mb-1 text-zinc-700" />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                          24VAC Power Offline
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Multimeter Circuit Readouts */}
                <div className="md:col-span-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                      Field Multimeter Circuit Readings
                    </span>
                    <div className="mt-3 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                        <span className="text-zinc-400">R - C Transformer:</span>
                        <span className="font-bold text-white tabular-nums">
                          {testOutput?.voltage ? `${testOutput.voltage} VAC (Nominal)` : '0.0 VAC (No Circuit)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                        <span className="text-zinc-400">Compressor Y Circuit:</span>
                        <span
                          className={
                            connections['Y'] === 'wire_yellow' ? 'text-emerald-400 font-bold' : 'text-zinc-500'
                          }
                        >
                          {connections['Y'] === 'wire_yellow' ? 'ENERGIZED (24VAC)' : 'OPEN / INACTIVE'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                        <span className="text-zinc-400">
                          {hvacType === 'conventional' ? 'Heat Relay W:' : 'Reversing Valve Aux (O/B):'}
                        </span>
                        <span
                          className={
                            (hvacType === 'conventional' ? connections['W'] === 'wire_white' : connections['Aux'] === 'wire_orange')
                              ? 'text-emerald-400 font-bold'
                              : 'text-zinc-500'
                          }
                        >
                          {(hvacType === 'conventional' ? connections['W'] === 'wire_white' : connections['Aux'] === 'wire_orange')
                            ? 'OK (READY)'
                            : 'OPEN / UNCONNECTED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                    Quext IoT Gateway requirement: Continuous 24VAC across R &amp; C
                  </div>
                </div>
              </div>

              {/* Diagnostic Test Feedback Alert */}
              {testOutput && (
                <div
                  className={`p-4 rounded-2xl border text-xs transition-all ${
                    testOutput.success
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-bold text-sm">
                    {testOutput.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span>{testOutput.message}</span>
                  </div>

                  {testOutput.details.length > 0 && (
                    <ul className="mt-2.5 space-y-1.5 list-disc list-inside text-rose-300/90 pl-1">
                      {testOutput.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for High-Resolution Blueprint Viewing */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-zinc-200">
            <div>
              <div className="text-xs font-mono uppercase text-purple-400 font-bold">
                High-Resolution Engineering Diagram Viewer
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeDiagramTitle}</h3>
              <p className="text-xs text-zinc-400">
                {hvacType === 'heat_pump'
                  ? 'Reference: IMG_6014 · Heat Pump 2 Heat, 1 Cool · Terminal strip R, Rc, Y, C, W, G, Aux, NC'
                  : 'Reference: Untitled 2 · Conventional 1 Stage Heating, 1 Stage Cooling'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-zinc-400 px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2.5 py-1.5 text-xs font-mono rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setIsLightboxOpen(false);
                  setZoomLevel(1);
                }}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer ml-2"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Container */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <div
              className="transition-transform duration-200 origin-center max-w-full max-h-full flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={activeImageSrc}
                alt={activeDiagramTitle}
                className="max-w-full max-h-[82vh] object-contain rounded-xl border border-zinc-800 shadow-2xl bg-zinc-950"
              />
            </div>
          </div>

          {/* Lightbox Footer Guide */}
          <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">Active System:</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-cyan-300">
                {hvacType === 'conventional' ? 'Conventional 1H / 1C' : 'Heat Pump 2H / 1C'}
              </span>
              <span>
                {hvacType === 'heat_pump'
                  ? 'Indoor Handler: R, C, G | Heat Pump: Y1 (Y), Reversing Valve O/B (Aux), Aux Heat W1 (W)'
                  : 'Heating Transformer: R | Common: C | Compressor: Y | Heat: W | Fan: G | Aux & NC: Not Used'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setHvacType(hvacType === 'conventional' ? 'heat_pump' : 'conventional');
                  setZoomLevel(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Switch to {hvacType === 'conventional' ? 'Heat Pump' : 'Conventional'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
