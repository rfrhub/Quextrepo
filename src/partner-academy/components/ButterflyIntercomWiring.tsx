import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  RotateCcw,
  Maximize2,
  Minimize2,
  Cpu,
  Layers,
  ArrowRight,
  Info,
  Check,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  BookOpen,
  Volume2,
  Sliders,
  DoorOpen,
} from 'lucide-react';
import { generateButterflyPdfGuide } from '../utils/generateButterflyPdfGuide';

interface ButterflyIntercomWiringProps {
  onOpenCourse?: (courseId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const ButterflyIntercomWiring: React.FC<ButterflyIntercomWiringProps> = ({
  onOpenCourse,
  onNavigateTab,
}) => {
  // View states
  const [activeTab, setActiveTab] = useState<'interactive' | 'specs_table' | 'original_pdf'>('interactive');
  const [selectedWireOption, setSelectedWireOption] = useState<'all' | 'option_a' | 'option_b'>('all');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>('rc_reader');
  const [isSimulatingUnlock, setIsSimulatingUnlock] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const [pdfPage, setPdfPage] = useState<1 | 2>(1);

  // Audio trigger for unlock simulation
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15); // A6
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.36);
    } catch {
      // AudioContext fallback
    }
  };

  const handleSimulateUnlock = () => {
    if (isSimulatingUnlock) return;
    setIsSimulatingUnlock(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2); // Relay closed
    }, 600);

    setTimeout(() => {
      setSimulationStep(3); // RC REX received
      playChime();
    }, 1200);

    setTimeout(() => {
      setSimulationStep(4); // Shared strike unlocked
    }, 1800);

    setTimeout(() => {
      setIsSimulatingUnlock(false);
      setSimulationStep(0);
    }, 4000);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateButterflyPdfGuide();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Schematics and Wiring · Official Integration Blueprint
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span>ButterflyMX Video Intercom Wiring Diagram</span>
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40">
              8" &amp; 12" Intercom
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl">
            Official wiring blueprint for ButterflyMX 8" and 12" intercoms. Features the{' '}
            <strong className="text-white">Schlage RC Reader Controller</strong> as the access control core, using{' '}
            <strong className="text-blue-400">REX (Blue wire)</strong> and{' '}
            <strong className="text-zinc-200">Common (Black wire)</strong>. The{' '}
            <strong className="text-emerald-400">Electric Door Strike</strong> is utilized in both Option A (via RC reader switched output) and Option B (direct intercom trip).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={handleSimulateUnlock}
            disabled={isSimulatingUnlock}
            className={`px-4 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              isSimulatingUnlock
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingUnlock ? 'animate-bounce' : ''}`} />
            <span>{isSimulatingUnlock ? 'Simulating Unlock...' : 'Simulate Tenant Unlock'}</span>
          </button>

          <button
            onClick={() => setShowOriginalModal(true)}
            className="px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>View Original PDF</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 rounded-full bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600/50 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-300" />
            <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF Guide'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filtering */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/70 border border-zinc-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'interactive'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Interactive Schematic (with Schlage RC Reader)
          </button>
          <button
            onClick={() => setActiveTab('specs_table')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'specs_table'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Wiring Specifications Table (Page 2)
          </button>
          <button
            onClick={() => setActiveTab('original_pdf')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'original_pdf'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Original Manufacturer PDF
          </button>
        </div>

        {/* Option Filter pills */}
        {activeTab === 'interactive' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-zinc-500 font-mono hidden md:inline">Path Focus:</span>
            <button
              onClick={() => setSelectedWireOption('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedWireOption === 'all'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Paths
            </button>
            <button
              onClick={() => setSelectedWireOption('option_a')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedWireOption === 'option_a'
                  ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Option A: Schlage RC Reader (Quext Standard)
            </button>
            <button
              onClick={() => setSelectedWireOption('option_b')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedWireOption === 'option_b'
                  ? 'bg-red-900/60 text-red-300 border border-red-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Option B: Direct Strike
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'interactive' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left / Center: Interactive SVG Schematic (8 cols) */}
          <div className="xl:col-span-8 space-y-4">
            <div className="bg-[#0b0c10] border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
              {/* Header inside canvas */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-sky-400" />
                    <span className="w-3 h-3 rounded-full bg-pink-500" />
                    <span className="w-3 h-3 rounded-full bg-orange-400" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-white tracking-wide">ButterflyMX</span>
                    <span className="text-xs text-zinc-400 ml-2">Wiring Diagram · For the 8" and 12" Intercom</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-blue-950/60 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                    Images are not to scale
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">v1 (updated 3/25/24) · Software: v2.1</span>
                </div>
              </div>

              {/* Simulation Banner when active */}
              {isSimulatingUnlock && (
                <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-blue-950/80 via-emerald-950/80 to-purple-950/80 border border-emerald-500/40 flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div className="text-xs">
                      <span className="font-bold text-white">Live Unlock Signal: </span>
                      {simulationStep === 1 && <span className="text-blue-300">Tenant authorizes entry on mobile video call...</span>}
                      {simulationStep === 2 && <span className="text-yellow-300">ButterflyMX dry contact relay closes (NO to COM)...</span>}
                      {simulationStep === 3 && (
                        <span className="text-emerald-300 font-bold">
                          Schlage RC Reader received REX (Blue) &amp; Common (Black) trigger! LED Green!
                        </span>
                      )}
                      {simulationStep === 4 && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <DoorOpen className="w-3.5 h-3.5" />
                          Shared Door Strike energized &amp; unlatched! (Common hardware active)
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">STEP {simulationStep}/4</span>
                </div>
              )}

              {/* Clean, Non-Overlapping Vector SVG Blueprint */}
              <div className="relative bg-[#07080a] border border-zinc-800/90 rounded-2xl p-2 sm:p-4 overflow-x-auto">
                <svg
                  viewBox="0 0 1200 750"
                  className="w-full h-auto select-none min-w-[960px]"
                  style={{ maxHeight: '740px' }}
                >
                  <defs>
                    <pattern id="bmx-grid-v2" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    </pattern>

                    {/* Animated Pulse Gradient for Blue Wire */}
                    <linearGradient id="pulse-blue-v2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>

                    {/* Animated Pulse Gradient for Strike Output */}
                    <linearGradient id="pulse-strike-v2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    {/* ClipPath for Schlage RC11 hardware photo */}
                    <clipPath id="rc11IntercomClipV2">
                      <rect x="0" y="0" width="76" height="220" rx="36" />
                    </clipPath>

                    {/* Drop shadow filter */}
                    <filter id="cleanShadowV2" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.6" />
                    </filter>
                    <filter id="greenGlowV2" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" />
                    </filter>
                  </defs>

                  <rect width="1200" height="750" fill="url(#bmx-grid-v2)" />

                  {/* ========================================================
                      1. TOP SUBSYSTEM: POWER (Zone y: 50-130)
                  ======================================================== */}
                  <text x="180" y="145" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                    POWER
                  </text>

                  {/* Wire from Intercom Top to 24VDC */}
                  <path
                    d="M 180 160 L 180 85 L 560 85"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Quick-disconnect clips */}
                  <g transform="translate(260, 78)">
                    <rect x="0" y="0" width="14" height="14" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x="22" y="0" width="14" height="14" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x="44" y="0" width="14" height="14" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                  </g>

                  {/* Cut & Strip Marks (positioned above & below wire with zero collision) */}
                  <g transform="translate(380, 60)">
                    <text x="12" y="10" fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Cut
                    </text>
                    <line x1="12" y1="14" x2="12" y2="36" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
                    <text x="12" y="48" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Strip
                    </text>
                  </g>

                  {/* 24VDC Power Supply Box (Purple) */}
                  <g
                    transform="translate(560, 58)"
                    className="cursor-pointer group"
                    onClick={() => setSelectedElement('power_supply')}
                    onMouseEnter={() => setHoveredElement('power_supply')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="100"
                      height="52"
                      rx="10"
                      fill="#6d28d9"
                      stroke={selectedElement === 'power_supply' ? '#c084fc' : '#7c3aed'}
                      strokeWidth="2"
                      filter="url(#cleanShadowV2)"
                    />
                    <text x="50" y="30" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">
                      24VDC
                    </text>
                    <text x="50" y="45" fill="#ddd6fe" fontSize="8" textAnchor="middle">
                      50W / 2.08A
                    </text>
                  </g>

                  {/* AC Cord from 24VDC to UPS */}
                  <line x1="660" y1="85" x2="740" y2="85" stroke="#64748b" strokeWidth="3" />
                  <rect x="725" y="77" width="15" height="16" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />

                  {/* UPS Box (Purple) */}
                  <g
                    transform="translate(740, 50)"
                    className="cursor-pointer group"
                    onClick={() => setSelectedElement('ups')}
                    onMouseEnter={() => setHoveredElement('ups')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <text x="57" y="-6" fill="#e2e8f0" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                      UPS: min 300 W / 600 VA
                    </text>
                    <rect
                      x="0"
                      y="0"
                      width="115"
                      height="58"
                      rx="10"
                      fill="#581c87"
                      stroke={selectedElement === 'ups' ? '#c084fc' : '#6b21a8'}
                      strokeWidth="2"
                      filter="url(#cleanShadowV2)"
                    />
                    <text x="57" y="36" fill="#ffffff" fontSize="17" fontWeight="bold" textAnchor="middle">
                      UPS
                    </text>
                  </g>

                  {/* Cord from UPS to Wall Outlet */}
                  <line x1="855" y1="85" x2="940" y2="85" stroke="#64748b" strokeWidth="3" />
                  <line x1="940" y1="85" x2="970" y2="85" stroke="#64748b" strokeWidth="3" />
                  <rect x="955" y="77" width="14" height="16" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />

                  {/* Wall Duplex Receptacle Box (Far Right x: 980-1065) */}
                  <g
                    transform="translate(980, 40)"
                    className="cursor-pointer group"
                    onClick={() => setSelectedElement('outlet')}
                  >
                    <text x="40" y="-6" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                      110 - 240 VAC
                    </text>
                    <rect
                      x="0"
                      y="0"
                      width="80"
                      height="96"
                      rx="8"
                      fill="#ffffff"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      filter="url(#cleanShadowV2)"
                    />
                    {/* Top Outlet */}
                    <rect x="25" y="12" width="30" height="30" rx="15" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                    <rect x="32" y="20" width="4" height="10" fill="#334155" />
                    <rect x="44" y="20" width="4" height="10" fill="#334155" />
                    <circle cx="40" cy="34" r="3" fill="#334155" />

                    {/* Bottom Outlet */}
                    <rect x="25" y="52" width="30" height="30" rx="15" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
                    <rect x="32" y="60" width="4" height="10" fill="#334155" />
                    <rect x="44" y="60" width="4" height="10" fill="#334155" />
                    <circle cx="40" cy="74" r="3" fill="#334155" />
                  </g>

                  {/* ========================================================
                      2. CENTER-LEFT: BUTTERFLYMX 8" & 12" INTERCOM
                  ======================================================== */}
                  <g
                    transform="translate(70, 160)"
                    className="cursor-pointer group"
                    onClick={() => setSelectedElement('intercom')}
                    onMouseEnter={() => setHoveredElement('intercom')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    {/* Intercom Outer Chassis */}
                    <rect
                      x="0"
                      y="0"
                      width="220"
                      height="210"
                      rx="28"
                      fill="#0f172a"
                      stroke={hoveredElement === 'intercom' || selectedElement === 'intercom' ? '#38bdf8' : '#334155'}
                      strokeWidth="3.5"
                      filter="url(#cleanShadowV2)"
                    />
                    {/* Bezel */}
                    <rect x="8" y="8" width="204" height="194" rx="22" fill="#020617" />

                    {/* Camera & Mic */}
                    <circle cx="110" cy="22" r="5" fill="#475569" />
                    <circle cx="110" cy="22" r="2.5" fill="#0ea5e9" />
                    <rect x="85" y="32" width="50" height="3" rx="1.5" fill="#334155" />

                    {/* Glass Touchscreen Display */}
                    <rect
                      x="16"
                      y="40"
                      width="188"
                      height="138"
                      rx="12"
                      fill={isSimulatingUnlock ? '#064e3b' : '#090d16'}
                      stroke="#1e293b"
                      strokeWidth="1.5"
                    />

                    {/* Screen Content */}
                    <g transform="translate(24, 48)">
                      {/* Butterfly Logo on screen */}
                      <circle cx="86" cy="28" r="4" fill="#38bdf8" />
                      <circle cx="94" cy="22" r="4" fill="#f43f5e" />
                      <circle cx="102" cy="28" r="4" fill="#f97316" />
                      <text x="94" y="52" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                        ButterflyMX
                      </text>
                      <text x="94" y="68" fill="#94a3b8" fontSize="9" textAnchor="middle">
                        8" &amp; 12" Video Intercom
                      </text>

                      {isSimulatingUnlock ? (
                        <g transform="translate(10, 82)">
                          <rect x="0" y="0" width="168" height="28" rx="6" fill="#10b981" />
                          <text x="84" y="18" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                            DOOR UNLOCKED · COME IN
                          </text>
                        </g>
                      ) : (
                        <g transform="translate(15, 82)">
                          <rect x="0" y="0" width="158" height="26" rx="6" fill="#1e293b" />
                          <text x="79" y="17" fill="#cbd5e1" fontSize="9" textAnchor="middle">
                            Tap to Call Resident
                          </text>
                        </g>
                      )}
                    </g>

                    {/* Butterfly Logo Emblem at bottom bezel */}
                    <g transform="translate(95, 185)">
                      <circle cx="10" cy="7" r="3" fill="#38bdf8" />
                      <circle cx="16" cy="3" r="3" fill="#f43f5e" />
                      <circle cx="22" cy="7" r="3" fill="#f97316" />
                    </g>
                  </g>

                  {/* Intercom Port Labels */}
                  <text
                    x="296"
                    y="245"
                    fill="#3b82f6"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="start"
                    letterSpacing="1"
                  >
                    LOCKING
                  </text>
                  <text
                    x="180"
                    y="390"
                    fill="#94a3b8"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    INTERNET
                  </text>

                  {/* ========================================================
                      3. OPTION A: QUExt / SCHLAGE RC CARD READER INTEGRATION
                  ======================================================== */}
                  {(selectedWireOption === 'all' || selectedWireOption === 'option_a') && (
                    <g>
                      {/* Option A Wire Badge (Cleanly above wire) */}
                      <g transform="translate(325, 205)">
                        <rect x="0" y="0" width="220" height="20" rx="5" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
                        <text x="110" y="14" fill="#93c5fd" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                          Option A: Access Control System*
                        </text>
                      </g>

                      {/* Cable Type Spec Tag (Cleanly below wire) */}
                      <g transform="translate(340, 260)">
                        <rect x="0" y="0" width="190" height="18" rx="4" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                        <text x="95" y="13" fill="#60a5fa" fontSize="9" fontWeight="bold" textAnchor="middle">
                          18 AWG (18/2) · REX + Common
                        </text>
                      </g>

                      {/* Blue Line Tracing from Intercom to RC Reader */}
                      <path
                        d="M 290 238 L 500 238 L 500 250 L 565 250"
                        fill="none"
                        stroke={isSimulatingUnlock ? 'url(#pulse-blue-v2)' : '#2563eb'}
                        strokeWidth={isSimulatingUnlock ? '4.5' : '3.5'}
                        strokeLinecap="round"
                        strokeDasharray={isSimulatingUnlock ? '8,4' : 'none'}
                      />
                    </g>
                  )}

                  {/* ========================================================
                      SCHLAGE RC CARD READER CONTROLLER (Centered x: 570, y: 150)
                      With generous width (360px) so NO text overflows the box/page!
                  ======================================================== */}
                  <g
                    transform="translate(570, 150)"
                    className="cursor-pointer group"
                    onClick={() => setSelectedElement('rc_reader')}
                    onMouseEnter={() => setHoveredElement('rc_reader')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    {/* 1. Physical Schlage RC11 Mullion Reader Housing (Pill Shape) */}
                    <g transform="translate(0, 0)">
                      {/* Outer Bezel */}
                      <rect
                        width="76"
                        height="230"
                        rx="36"
                        fill="#111827"
                        stroke={isSimulatingUnlock ? '#10b981' : '#38bdf8'}
                        strokeWidth={isSimulatingUnlock ? '3' : '2'}
                        filter={isSimulatingUnlock ? 'url(#greenGlowV2)' : 'url(#cleanShadowV2)'}
                      />

                      {/* Superimposed Authentic Schlage RC11 Photo */}
                      <g clipPath="url(#rc11IntercomClipV2)">
                        <image
                          href="/assets/images/schlage_rc11_reader_1791238012335.jpg"
                          x="0"
                          y="0"
                          width="76"
                          height="230"
                          preserveAspectRatio="xMidYMid slice"
                          opacity="0.88"
                        />
                        <rect width="76" height="230" fill="rgba(5,7,13,0.25)" />
                      </g>

                      {/* Top Status LED Capsule Bar */}
                      <rect
                        x="18"
                        y="18"
                        width="40"
                        height="7"
                        rx="3.5"
                        fill={isSimulatingUnlock ? '#10b981' : '#22c55e'}
                        filter={isSimulatingUnlock ? 'url(#greenGlowV2)' : undefined}
                      />

                      {/* Laser-etched Schlage Logo at bottom of reader */}
                      <rect
                        x="10"
                        y="182"
                        width="56"
                        height="16"
                        rx="3"
                        fill="rgba(0,0,0,0.6)"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1"
                      />
                      <text
                        x="38"
                        y="194"
                        fill="#ffffff"
                        fontSize="8"
                        fontWeight="bold"
                        letterSpacing="1"
                        textAnchor="middle"
                      >
                        SCHLAGE
                      </text>
                    </g>

                    {/* 2. RC Reader Wiring Connection Board (Spaced cleanly, width 360 - ZERO OVERFLOW) */}
                    <g transform="translate(92, 0)">
                      <rect
                        width="360"
                        height="230"
                        rx="14"
                        fill="#0c1017"
                        stroke={selectedElement === 'rc_reader' ? '#38bdf8' : '#1e293b'}
                        strokeWidth="2"
                        filter="url(#cleanShadowV2)"
                      />

                      {/* Header */}
                      <g transform="translate(16, 20)">
                        <text x="0" y="0" fill="#ffffff" fontSize="13" fontWeight="bold">
                          SCHLAGE RC11 / RC15
                        </text>
                        <text x="0" y="14" fill="#38bdf8" fontSize="10" fontWeight="semibold">
                          Quext Pure IP Reader Controller
                        </text>
                        <text x="0" y="27" fill="#94a3b8" fontSize="8.5" fontStyle="italic">
                          *(Replaces 3rd-Party Access Control System)
                        </text>
                      </g>

                      {/* PoE Input Badge */}
                      <g transform="translate(230, 12)">
                        <rect width="114" height="22" rx="4" fill="#042f2e" stroke="#0d9488" strokeWidth="1" />
                        <text x="57" y="15" fill="#5eead4" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          PoE Cat5e/6 (48V)
                        </text>
                      </g>

                      {/* Terminal 1: Pin 6 Blue (REX Input) */}
                      <g transform="translate(14, 58)">
                        <rect
                          width="332"
                          height="36"
                          rx="6"
                          fill={isSimulatingUnlock ? '#1e3a8a' : '#0f172a'}
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                        />
                        <circle cx="16" cy="18" r="5" fill="#3b82f6" />
                        <text x="28" y="15" fill="#ffffff" fontSize="10" fontWeight="bold">
                          PIN 6: BLUE WIRE (REX Input)
                        </text>
                        <text x="28" y="28" fill="#93c5fd" fontSize="8">
                          From ButterflyMX Relay Terminal A (NO Contact)
                        </text>
                        <rect x="272" y="8" width="48" height="20" rx="4" fill="#1d4ed8" />
                        <text x="296" y="21" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          REX
                        </text>
                      </g>

                      {/* Terminal 2: Pin 2 Black (Common GND) */}
                      <g transform="translate(14, 102)">
                        <rect
                          width="332"
                          height="36"
                          rx="6"
                          fill="#0f172a"
                          stroke="#64748b"
                          strokeWidth="1.5"
                        />
                        <circle cx="16" cy="18" r="5" fill="#000000" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="28" y="15" fill="#ffffff" fontSize="10" fontWeight="bold">
                          PIN 2: BLACK WIRE (Common GND)
                        </text>
                        <text x="28" y="28" fill="#cbd5e1" fontSize="8">
                          From ButterflyMX Relay Terminal B (COM Return)
                        </text>
                        <rect x="256" y="8" width="64" height="20" rx="4" fill="#334155" />
                        <text x="288" y="21" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                          COMMON
                        </text>
                      </g>

                      {/* Terminal 3: Output to Shared Door Strike */}
                      <g transform="translate(14, 146)">
                        <rect width="332" height="36" rx="6" fill="#022c22" stroke="#059669" strokeWidth="1" />
                        <circle cx="16" cy="18" r="5" fill="#10b981" />
                        <text x="28" y="15" fill="#6ee7b7" fontSize="9.5" fontWeight="bold">
                          Switched Output to Shared Door Strike:
                        </text>
                        <text x="28" y="28" fill="#a7f3d0" fontSize="8">
                          Pin 1 (Red +12V) &amp; Pin 2 (Black GND) triggers the strike
                        </text>
                        <rect x="240" y="8" width="80" height="20" rx="4" fill="#047857" />
                        <text x="280" y="21" fill="#ecfdf5" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                          +12V STRIKE
                        </text>
                      </g>

                      {/* Config rule with ample room */}
                      <text x="16" y="208" fill="#eab308" fontSize="8" fontWeight="bold">
                        Config: Set Quext Cloud / Homebase as Normally Open (NO) REX trigger.
                      </text>
                    </g>
                  </g>

                  {/* Wire Running DOWN from RC Reader Output directly into the Shared Door Strike */}
                  <g>
                    <path
                      d="M 830 380 L 830 415"
                      fill="none"
                      stroke={isSimulatingUnlock ? 'url(#pulse-strike-v2)' : '#059669'}
                      strokeWidth={isSimulatingUnlock ? '4' : '3'}
                      strokeLinecap="round"
                    />
                    <polygon points="826,410 834,410 830,417" fill="#10b981" />
                    <text x="836" y="402" fill="#34d399" fontSize="8" fontWeight="bold">
                      Option A Feed
                    </text>
                  </g>

                  {/* ========================================================
                      4. OPTION B: DIRECT TO STRIKE & THE SHARED DOOR STRIKE
                  ======================================================== */}
                  {(selectedWireOption === 'all' || selectedWireOption === 'option_b') && (
                    <g>
                      {/* Option B Red Wire Tracing into the SAME Door Strike */}
                      <path
                        d="M 290 280 L 320 280 L 320 465 L 620 465"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <polygon points="614,461 614,469 622,465" fill="#ef4444" />

                      {/* Option B Badge (Cleanly above red wire) */}
                      <g transform="translate(330, 440)">
                        <rect x="0" y="0" width="140" height="18" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
                        <text x="70" y="13" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
                          Option B: Door Strike
                        </text>
                      </g>

                      {/* Diode / Varistor Inline Suppression Box */}
                      <g
                        transform="translate(480, 440)"
                        className="cursor-pointer group"
                        onClick={() => setSelectedElement('diode')}
                      >
                        <rect x="0" y="0" width="130" height="50" rx="8" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
                        <text x="65" y="17" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                          Diode  OR  Varistor**
                        </text>
                        {/* Diode graphic */}
                        <rect x="22" y="25" width="28" height="12" rx="2" fill="#000000" stroke="#a1a1aa" />
                        <line x1="25" y1="25" x2="25" y2="37" stroke="#ffffff" strokeWidth="2" />
                        <text x="65" y="35" fill="#a1a1aa" fontSize="8" textAnchor="middle">
                          OR
                        </text>
                        {/* Varistor MOV disc */}
                        <circle cx="102" cy="31" r="7" fill="#0284c7" />
                      </g>
                    </g>
                  )}

                  {/* ========================================================
                      THE SHARED ELECTRIC DOOR STRIKE (Used by BOTH Option A & B!)
                  ======================================================== */}
                  <g
                    transform="translate(620, 415)"
                    className="cursor-pointer group"
                    onClick={() => setSelectedElement('strike')}
                    onMouseEnter={() => setHoveredElement('strike')}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="400"
                      height="98"
                      rx="14"
                      fill={isSimulatingUnlock ? '#022c22' : '#1e293b'}
                      stroke={
                        isSimulatingUnlock
                          ? '#10b981'
                          : selectedElement === 'strike'
                          ? '#ef4444'
                          : '#059669'
                      }
                      strokeWidth={isSimulatingUnlock ? '3.5' : '2'}
                      filter="url(#cleanShadowV2)"
                    />

                    {/* Shared Hardware Title Badge */}
                    <g transform="translate(16, 16)">
                      <text x="0" y="8" fill="#ffffff" fontSize="12.5" fontWeight="bold">
                        ELECTRIC LOCKING HARDWARE (DOOR STRIKE)
                      </text>
                      <rect x="0" y="16" width="260" height="20" rx="4" fill="#047857" />
                      <text x="130" y="30" fill="#ecfdf5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                        ★ SHARED HARDWARE: USED IN BOTH OPTION A &amp; B
                      </text>
                    </g>

                    {/* Dual Trigger Description for both options */}
                    <g transform="translate(16, 60)">
                      <text x="0" y="10" fill="#93c5fd" fontSize="8.5" fontWeight="bold">
                        • Option A Input: Driven by Schlage RC Reader switched 12VDC output
                      </text>
                      <text x="0" y="24" fill="#fca5a5" fontSize="8.5" fontWeight="bold">
                        • Option B Input: Driven by ButterflyMX dry contacts (with diode/varistor)
                      </text>
                    </g>

                    {/* Right status indicator on strike */}
                    <g transform="translate(290, 18)">
                      <rect
                        width="96"
                        height="62"
                        rx="8"
                        fill={isSimulatingUnlock ? '#059669' : '#0f172a'}
                        stroke={isSimulatingUnlock ? '#34d399' : '#334155'}
                      />
                      <text
                        x="48"
                        y="26"
                        fill={isSimulatingUnlock ? '#ffffff' : '#94a3b8'}
                        fontSize="9.5"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {isSimulatingUnlock ? 'UNLOCKED' : 'LOCKED'}
                      </text>
                      <text
                        x="48"
                        y="42"
                        fill={isSimulatingUnlock ? '#d1fae5' : '#64748b'}
                        fontSize="8"
                        textAnchor="middle"
                      >
                        {isSimulatingUnlock ? 'Latch Free' : 'Shared Hardware'}
                      </text>
                    </g>
                  </g>

                  {/* ========================================================
                      5. BOTTOM SUBSYSTEM: INTERNET ROUTING
                      Option A bubble and text is placed on the FAR LEFT of the blue line
                      ZERO overlap with the red line!
                  ======================================================== */}
                  {/* Option A (Blue Line: Direct to Router on FAR LEFT) */}
                  <g>
                    {/* Blue line routes straight down on the left at x=135 */}
                    <path
                      d="M 135 370 L 135 600"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Option A Text & Bubble placed COMPLETELY ON FAR LEFT (x: 10 to 115) */}
                    <g transform="translate(10, 465)">
                      <rect x="0" y="0" width="112" height="54" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
                      <text x="56" y="18" fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                        Option A: Direct
                      </text>
                      <text x="56" y="32" fill="#93c5fd" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                        to Router
                      </text>
                      <text x="56" y="45" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">
                        300 ft Max Length
                      </text>
                    </g>

                    {/* Leader line from Option A bubble to the Blue wire */}
                    <line x1="122" y1="492" x2="135" y2="492" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />

                    {/* Distance label to the left of the blue line */}
                    <text x="126" y="555" fill="#3b82f6" fontSize="9.5" fontWeight="bold" textAnchor="end">
                      300 ft
                    </text>
                  </g>

                  {/* Option B (Red Line: Network Switch to the RIGHT of Blue line) */}
                  <g>
                    {/* Red line drops down at x=225, steps RIGHT to x=330, completely separated */}
                    <path
                      d="M 225 370 L 225 460 L 330 460"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Red line from Network switch at x=385 down to y=640, then LEFT to x=210 into Router */}
                    <path
                      d="M 385 485 L 385 640 L 210 640"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Option B text placed safely above the red wire */}
                    <text x="235" y="452" fill="#f87171" fontSize="9.5" fontWeight="bold">
                      Option B: Network Switch
                    </text>
                    <text x="250" y="476" fill="#f87171" fontSize="9" fontWeight="bold">
                      250 ft
                    </text>
                    <text x="275" y="632" fill="#f87171" fontSize="9" fontWeight="bold">
                      250 ft
                    </text>

                    {/* Network Switch Box (Purple) */}
                    <g
                      transform="translate(330, 435)"
                      className="cursor-pointer group"
                      onClick={() => setSelectedElement('switch')}
                    >
                      <rect
                        x="0"
                        y="0"
                        width="110"
                        height="50"
                        rx="10"
                        fill="#6d28d9"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        filter="url(#cleanShadowV2)"
                      />
                      <text x="55" y="24" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Network
                      </text>
                      <text x="55" y="40" fill="#ddd6fe" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Switch
                      </text>
                    </g>
                  </g>

                  {/* Internet Router Box (x: 70, y: 600, width: 140) */}
                  <g
                    transform="translate(70, 600)"
                    className="cursor-pointer group"
                    onClick={() => setSelectedElement('router')}
                  >
                    {/* Antennas */}
                    <line x1="30" y1="20" x2="20" y2="-5" stroke="#94a3b8" strokeWidth="2.5" />
                    <line x1="110" y1="20" x2="120" y2="-5" stroke="#94a3b8" strokeWidth="2.5" />
                    <circle cx="20" cy="-5" r="2.5" fill="#38bdf8" />
                    <circle cx="120" cy="-5" r="2.5" fill="#38bdf8" />

                    <rect
                      x="0"
                      y="15"
                      width="140"
                      height="50"
                      rx="8"
                      fill="#0f172a"
                      stroke="#475569"
                      strokeWidth="2"
                      filter="url(#cleanShadowV2)"
                    />
                    <text x="70" y="38" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                      INTERNET
                    </text>
                    <text x="70" y="52" fill="#94a3b8" fontSize="10" textAnchor="middle">
                      Router
                    </text>
                    <circle cx="35" cy="58" r="2" fill="#22c55e" />
                    <circle cx="45" cy="58" r="2" fill="#22c55e" />
                    <circle cx="55" cy="58" r="2" fill="#22c55e" />
                  </g>

                  {/* ========================================================
                      6. MANUFACTURER NOTES CALLOUT (Bottom Right Zone, max x: 1160)
                  ======================================================== */}
                  <g transform="translate(630, 525)">
                    <rect
                      x="0"
                      y="0"
                      width="530"
                      height="185"
                      rx="12"
                      fill="#090d16"
                      stroke="#1e293b"
                      strokeWidth="1.5"
                    />
                    <text x="18" y="24" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                      ButterflyMX Field Supplies:
                    </text>
                    <text x="18" y="42" fill="#94a3b8" fontSize="8.5">
                      • ButterflyMX supplies one 1N400X Series diode and one MOV AdvanceD
                    </text>
                    <text x="26" y="55" fill="#94a3b8" fontSize="8.5">
                      series leaded varistor per Intercom.
                    </text>

                    <text x="18" y="78" fill="#60a5fa" fontSize="9.5" fontWeight="bold">
                      *Option A (Quext / Schlage RC Reader Controller Standard):
                    </text>
                    <text x="18" y="94" fill="#93c5fd" fontSize="8.5">
                      • Intercom connects to REX (Blue Wire) and Common (Black Wire) of the Schlage RC11 / RC15.
                    </text>
                    <text x="18" y="107" fill="#93c5fd" fontSize="8.5">
                      • The RC Reader then powers the Door Strike via Pin 1 Red (+12VDC) &amp; Pin 2 Black (GND).
                    </text>
                    <text x="18" y="122" fill="#cbd5e1" fontSize="8.5">
                      • Eliminates third-party ACS panels; RC handles cloud logs, audit trail, and strike timing.
                    </text>

                    <text x="18" y="145" fill="#f87171" fontSize="9.5" fontWeight="bold">
                      **Option B (Direct Strike Standard):
                    </text>
                    <text x="18" y="161" fill="#fca5a5" fontSize="8.5">
                      • A diode (DC) or varistor (AC) is required if wiring directly to the shared door strike.
                    </text>
                    <text x="26" y="174" fill="#fca5a5" fontSize="8.5">
                      See AC or DC Wiring Guides for details.
                    </text>
                  </g>
                </svg>
              </div>

              {/* Bottom bar of schematic */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Click any subsystem component in the blueprint to inspect pinout &amp; wiring rules.</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500">
                  <span>SUPPORT: (800) 398-4416 ext. 2</span>
                  <span>support@butterflymx.com</span>
                  <span>butterflymx.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Technical Inspector & Pinout Card (4 cols) */}
          <div className="xl:col-span-4 space-y-4">
            {/* RC Reader Deep-Dive Card */}
            <div className="bg-[#0e0f14] border border-blue-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Schlage RC Reader Controller</h3>
                    <p className="text-[11px] text-zinc-400">Schlage RC11 / RC15 pure IP</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                  Option A Core
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 leading-relaxed">
                  <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Shared Door Strike Operation:
                  </p>
                  The door strike is used in <strong className="text-white">both options</strong>. In Option A, ButterflyMX dry contacts bridge the RC Reader's{' '}
                  <strong className="text-white">Pin 6 (Blue / REX)</strong> to{' '}
                  <strong className="text-white">Pin 2 (Black / Common)</strong>. The RC Reader then energizes the shared strike via its switched +12VDC output.
                </div>

                {/* Wire Lead Checklist */}
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-blue-500/40 flex items-start gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 mt-0.5 shrink-0 shadow-sm shadow-blue-500" />
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs">PIN 6: BLUE WIRE (REX)</div>
                      <div className="text-[11px] text-zinc-400 break-words">
                        Request to Exit input (Dry contact sense). Connected to ButterflyMX Relay Terminal A.
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-700/60 flex items-start gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs">PIN 2: BLACK WIRE (COMMON)</div>
                      <div className="text-[11px] text-zinc-400 break-words">
                        Lock ground &amp; dry sense common return (0V). Connected to ButterflyMX Relay Terminal B.
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-emerald-500/40 flex items-start gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 mt-0.5 shrink-0 shadow-sm shadow-emerald-500" />
                    <div className="min-w-0">
                      <div className="font-bold text-emerald-300 text-xs">PIN 1 RED &amp; PIN 2 BLACK (STRIKE OUTPUT)</div>
                      <div className="text-[11px] text-zinc-400 break-words">
                        Direct +12VDC switched output running to the shared Electric Door Strike hardware.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Field Warning */}
                <div className="p-2.5 rounded-xl bg-yellow-950/30 border border-yellow-500/30 text-yellow-300/90 text-[11px]">
                  <strong>Field Note:</strong> Ensure the RC reader is configured in Quext Cloud / Homebase as{' '}
                  <span className="font-mono font-bold text-white">Normally Open (NO)</span> for the REX trigger.
                </div>
              </div>
            </div>

            {/* Subsystem Specifications Panel */}
            <div className="bg-[#0e0f14] border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Selected Subsystem Details</span>
              </h3>

              {selectedElement === 'strike' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <DoorOpen className="w-4 h-4" />
                    Shared Electric Door Strike Hardware
                  </div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    The physical door strike is installed at the door frame and is the common locking hardware controlled by <strong className="text-white">both options</strong>:
                  </p>
                  <ul className="space-y-1 text-[11px] text-zinc-400 list-disc ml-4">
                    <li><strong className="text-blue-300">Option A:</strong> Powered and triggered by the Schlage RC Reader controller on REX contact closure.</li>
                    <li><strong className="text-red-300">Option B:</strong> Triggered directly by ButterflyMX dry contact relay (requires inline 1N400X diode for DC or MOV varistor for AC).</li>
                  </ul>
                </div>
              )}

              {selectedElement === 'power_supply' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-purple-300">24VDC / 50W Power Supply</div>
                  <p className="text-zinc-400 text-[11px]">
                    Provides dedicated low-voltage DC power to the 8" or 12" ButterflyMX intercom unit. Includes a 10' DC
                    cable and 6' AC cord. Must be installed alongside a UPS (minimum 300W / 600VA).
                  </p>
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-300">
                    <div>Input: 110 - 240 VAC @ 50/60Hz</div>
                    <div>Output: 24VDC @ 2.08A (50W)</div>
                    <div>Demarcation: Cut &amp; Strip harness</div>
                  </div>
                </div>
              )}

              {selectedElement === 'ups' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-purple-300">Uninterruptible Power Supply (UPS)</div>
                  <p className="text-zinc-400 text-[11px]">
                    Minimum specification: <strong className="text-white">300 W / 600 VA</strong>. Always required to
                    guarantee intercom operation, property security, and life-safety egress during municipal power outages.
                  </p>
                </div>
              )}

              {selectedElement === 'rc_reader' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-blue-300">Option A: RC Card Reader Controller</div>
                  <p className="text-zinc-400 text-[11px]">
                    The standard Quext IoT installation. ButterflyMX acts as an auxiliary REX input into the Schlage
                    RC11 / RC15 reader controller. The reader receives power via PoE Cat5e/6 and directly energizes the
                    door strike or RBSN isolation relay.
                  </p>
                  <button
                    onClick={() => onNavigateTab && onNavigateTab('schematics_lab')}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open RC Reader Schematics Lab →</span>
                  </button>
                </div>
              )}

              {selectedElement === 'diode' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-yellow-300">Diode vs Varistor Surge Suppression</div>
                  <p className="text-zinc-400 text-[11px]">
                    ButterflyMX supplies one <strong className="text-white">1N400X series diode</strong> and one{' '}
                    <strong className="text-white">MOV AdvanceD leaded varistor</strong> per intercom. Diode is strictly
                    for DC strikes (silver band to Positive +); varistor is for AC strikes.
                  </p>
                </div>
              )}

              {selectedElement === 'router' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-sky-300">Internet Routing Requirements</div>
                  <p className="text-zinc-400 text-[11px]">
                    Option A connects directly to the Internet Router (300 ft maximum). Never splice Ethernet cables; do
                    not use couplers or data jacks. CAT5e or higher STP recommended.
                  </p>
                </div>
              )}

              {selectedElement === 'switch' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-purple-300">Network Switch (Option B)</div>
                  <p className="text-zinc-400 text-[11px]">
                    For runs extending past 300 ft or where structured cabling terminates at an IDF/MDF cabinet. Allows
                    250 ft from Intercom to Switch, and 250 ft from Switch to Router.
                  </p>
                </div>
              )}

              {selectedElement === 'intercom' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-sky-300">ButterflyMX 8" &amp; 12" Intercom Hardware</div>
                  <p className="text-zinc-400 text-[11px]">
                    Ruggedized outdoor-rated touchscreen intercom featuring wide-angle HD camera, digital tenant directory,
                    and dual locking relay dry contacts.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Cross-Navigation Links */}
            <div className="bg-[#0e0f14] border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                Related Wiring Labs
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => onNavigateTab && onNavigateTab('schematics_lab')}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="font-semibold">RC Reader Schematics (HB-001 - HB-007)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('wiring_sandbox')}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="font-semibold">Quext thermostat Wiring Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('qr_intercom_guide')}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="font-semibold">Quext QR Intercom Plaque Field Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Specifications Table (Page 2 of PDF) */}
      {activeTab === 'specs_table' && (
        <div className="bg-[#0b0c10] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                Official Manufacturer Reference · Page 2
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Wiring Information &amp; Distance Table</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cable gauges, conductor counts, and maximum distance guidelines for 8" and 12" Intercom installations.
              </p>
            </div>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Specifications PDF</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Connection Path</th>
                  <th className="py-3.5 px-4">Compatible Cables</th>
                  <th className="py-3.5 px-4">Max Length &amp; Requirements</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {/* Row 1: Option A (Quext Standard) */}
                <tr className="bg-blue-950/20 hover:bg-blue-950/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Intercom to Schlage RC Reader Controller (Option A)</span>
                    </div>
                    <div className="text-[10px] text-blue-300 font-mono mt-0.5 ml-4">
                      Replaces ButterflyMX Access Control System
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-zinc-200">
                    18 AWG, 2 conductors (18/2) cable
                  </td>
                  <td className="py-4 px-4 space-y-1">
                    <div className="font-semibold text-blue-300">
                      Terminate directly to RC Reader Pigtail:
                    </div>
                    <div className="text-zinc-300">
                      • <strong className="text-blue-400">Blue Wire:</strong> Pin 6 REX (Request to Exit Input)
                    </div>
                    <div className="text-zinc-300">
                      • <strong className="text-white">Black Wire:</strong> Pin 2 Common Ground Return
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      RC then switches 12VDC to the common door strike on trigger.
                    </div>
                  </td>
                </tr>

                {/* Row 2: Option B (Direct Strike) */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-4 font-semibold text-zinc-200">
                    Intercom to electric locking hardware (Option B - Shared Strike)
                  </td>
                  <td className="py-4 px-4 font-mono text-zinc-300">
                    18 AWG, 2 conductors (18/2) cable
                  </td>
                  <td className="py-4 px-4 text-zinc-400">
                    Connects directly to the same door strike hardware. Must install inline 1N400X diode (DC) or MOV varistor (AC).
                  </td>
                </tr>

                {/* Row 3: Power Outlet */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-4 font-semibold text-zinc-200">
                    Intercom to power outlet
                  </td>
                  <td className="py-4 px-4 font-mono text-zinc-300">
                    10' 24VDC / 2.08A / 50W power supply (6' AC cord)
                  </td>
                  <td className="py-4 px-4 space-y-1">
                    <div>DC length and gauge vary based on distance from Intercom to outlet:</div>
                    <ul className="space-y-0.5 text-[11px] text-zinc-300 ml-3 list-disc">
                      <li><strong>0 - 10 ft:</strong> use power adapter that is included &amp; always install UPS.</li>
                      <li><strong>10 - 50 ft:</strong> 18 AWG</li>
                      <li><strong>50 - 100 ft:</strong> 16 AWG</li>
                      <li><strong>100 - 180 ft:</strong> 14 AWG</li>
                      <li><strong>180 - 300 ft:</strong> 12 AWG</li>
                    </ul>
                    <div className="text-[10px] text-amber-400/90 italic pt-1">
                      If run length exceeds 200 ft, consider using a junction box.
                    </div>
                  </td>
                </tr>

                {/* Row 4: Internet Router */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-4 font-semibold text-zinc-200">
                    Intercom to Internet router
                  </td>
                  <td className="py-4 px-4 font-mono text-zinc-300">
                    Ethernet: CAT5e or higher (RJ45 terminations)
                  </td>
                  <td className="py-4 px-4 space-y-1">
                    <div className="font-bold text-white">328 ft Max Length</div>
                    <div className="text-[11px] text-zinc-400">
                      • Length varies based on distance from Intercom to router.
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      • If distance is greater than 300 ft, a network switch or repeater is required.
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      • Use a shielded twisted pairs (STP) cable wherever possible.
                    </div>
                    <div className="text-[11px] font-bold text-red-400">
                      Note: Never splice Ethernet cables. Do not use couplers, extenders, or data jacks.
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Original PDF View Tab */}
      {activeTab === 'original_pdf' && (
        <div className="bg-[#0b0c10] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                Source Document · ButterflyMX Video Intercom Wiring Diagram
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Manufacturer PDF Source Material</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                High-resolution scan of the original 2-page ButterflyMX wiring specification sheet.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPdfPage(1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pdfPage === 1 ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Page 1 (Diagram)
              </button>
              <button
                onClick={() => setPdfPage(2)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pdfPage === 2 ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Page 2 (Wiring Info)
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-black/60 p-4 rounded-2xl border border-zinc-800/80">
            <img
              src={pdfPage === 1 ? '/assets/aistudio/butterflymx_diagram/page_01.png' : '/assets/aistudio/butterflymx_diagram/page_02.png'}
              alt={`ButterflyMX Diagram Page ${pdfPage}`}
              className="max-h-[800px] object-contain rounded-xl shadow-2xl border border-zinc-700/50"
            />
          </div>
        </div>
      )}

      {/* Modal Lightbox for Original PDF */}
      {showOriginalModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d0f14] border border-zinc-700 max-w-4xl w-full max-h-[90vh] rounded-3xl p-5 overflow-y-auto flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <span>Original ButterflyMX Wiring Diagram PDF</span>
                <span className="text-xs font-normal text-zinc-400">(Page {pdfPage})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPdfPage(pdfPage === 1 ? 2 : 1)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer"
                >
                  Switch to Page {pdfPage === 1 ? 2 : 1}
                </button>
                <button
                  onClick={() => setShowOriginalModal(false)}
                  className="px-3 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-xs text-red-200 cursor-pointer font-bold"
                >
                  Close ✕
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={pdfPage === 1 ? '/assets/aistudio/butterflymx_diagram/page_01.png' : '/assets/aistudio/butterflymx_diagram/page_02.png'}
                alt="ButterflyMX Original PDF"
                className="max-h-[720px] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
