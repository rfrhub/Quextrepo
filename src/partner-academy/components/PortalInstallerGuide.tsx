import React, { useState, useRef } from 'react';
import { 
  PORTAL_GUIDE_CHAPTERS, 
  PORTAL_GUIDE_METADATA, 
  PortalGuideChapter 
} from '../data/portalGuideData';
import { PortalScreenshotMockup } from './PortalScreenshotMockup';
import { useAuth } from '../context/AuthContext';
import { generateAndDownloadPdf } from '../utils/generatePdfGuide';
import { 
  Printer, 
  Download, 
  AlertTriangle, 
  Layers, 
  Key, 
  Thermometer, 
  Radio, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Activity, 
  Sliders, 
  Sun, 
  Moon, 
  Lock, 
  Unlock, 
  CheckCircle2,
  Loader2,
  FileDown,
  Sparkles,
  BookOpen,
  RefreshCw
} from 'lucide-react';

export const PortalInstallerGuide: React.FC<{ onOpenCourse?: (moduleId: string) => void }> = ({ onOpenCourse }) => {
  const { currentUser } = useAuth();
  const [activePageIndex, setActivePageIndex] = useState<number>(0); // 0 = Cover page, 1..12 = Chapters
  const [viewMode, setViewMode] = useState<'single_page' | 'continuous_deck' | 'portal_simulator'>('single_page');
  const [paperTheme, setPaperTheme] = useState<'white' | 'dark'>('dark');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfProgressText, setPdfProgressText] = useState<string>('');

  // Portal Simulator State
  const [simCommunity, setSimCommunity] = useState<string>('The Heights at Austin (Community #1042)');
  const [simSelectedUnit, setSimSelectedUnit] = useState<string>('Unit 204');
  const [simGatewayStatus, setSimGatewayStatus] = useState<'online' | 'offline'>('online');
  const [simHvacMode, setSimHvacMode] = useState<'Heat Pump (O Polarity)' | 'Conventional Gas' | 'Heat Pump (B Polarity)'>('Heat Pump (O Polarity)');
  const [simLockStatus, setSimLockStatus] = useState<'locked' | 'unlocked'>('locked');
  const [simDiagnosticRunning, setSimDiagnosticRunning] = useState<boolean>(false);
  const [simDiagnosticResults, setSimDiagnosticResults] = useState<{
    testedCount: number;
    passCount: number;
    rssiAvg: string;
    firmwareOk: boolean;
    timestamp: string;
  } | null>(null);

  // Hidden offscreen container reference for PDF export
  const exportContainerRef = useRef<HTMLDivElement>(null);

  // Total Pages = 1 (Cover Page) + 7 Chapters = 8 Pages
  const totalPages = PORTAL_GUIDE_CHAPTERS.length + 1;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadPdf = (themeToDownload?: 'white' | 'dark') => {
    const targetTheme = themeToDownload || paperTheme;
    setIsGeneratingPdf(true);
    setPdfProgressText(
      targetTheme === 'dark' 
        ? 'Compiling Night Dark Edition PDF with Obsidian Theme...' 
        : 'Compiling Crisp White Print Edition PDF...'
    );

    setTimeout(() => {
      try {
        generateAndDownloadPdf(targetTheme);
        setPdfProgressText(
          targetTheme === 'dark'
            ? 'Night Dark PDF Downloaded!'
            : 'Crisp White PDF Downloaded!'
        );
        setTimeout(() => {
          setIsGeneratingPdf(false);
          setPdfProgressText('');
        }, 600);
      } catch (err) {
        console.error('Vector PDF generation error:', err);
        window.print();
        setIsGeneratingPdf(false);
        setPdfProgressText('');
      }
    }, 150);
  };

  const handleNextPage = () => {
    if (activePageIndex < totalPages - 1) {
      setActivePageIndex(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (activePageIndex > 0) {
      setActivePageIndex(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const runSimulatedHealthSweep = () => {
    setSimDiagnosticRunning(true);
    setTimeout(() => {
      setSimDiagnosticRunning(false);
      setSimDiagnosticResults({
        testedCount: 148,
        passCount: 148,
        rssiAvg: '-82 dBm (Optimal)',
        firmwareOk: true,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* LOADING MODAL WHEN DOWNLOADING PDF */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border-2 border-purple-500 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Generating Installer PDF Guide</h3>
              <p className="text-xs font-mono text-purple-300">{pdfProgressText}</p>
              <p className="text-[11px] text-zinc-400">
                Compiling {totalPages} high-resolution pages, portal screenshots, community hierarchy trees, and HVAC config tables.
              </p>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-full animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Top Header Card & Download Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {PORTAL_GUIDE_METADATA.docRef} · {PORTAL_GUIDE_METADATA.version}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Quext Portal Installer Guide
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            {PORTAL_GUIDE_METADATA.summary}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Launch Field Course Module */}
          {onOpenCourse && (
            <button
              onClick={() => onOpenCourse('mod_portal_guide')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-blue-900/50 border border-purple-500/50 hover:border-purple-400 text-xs font-bold text-purple-200 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:text-white"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Launch Field Course</span>
            </button>
          )}

          {/* View Mode Toggle: Single Page vs Continuous Deck */}
          <button
            onClick={() => setViewMode(viewMode === 'single_page' ? 'continuous_deck' : 'single_page')}
            className="px-3.5 py-2 rounded-xl bg-[#111728] border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-white transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{viewMode === 'single_page' ? `All ${totalPages} Slides Deck` : 'Single Slide View'}</span>
          </button>

          {/* Live Simulator Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'portal_simulator' ? 'single_page' : 'portal_simulator')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
              viewMode === 'portal_simulator'
                ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200'
                : 'bg-[#111728] border-zinc-700 hover:border-zinc-500 text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{viewMode === 'portal_simulator' ? 'Exit Simulator' : 'Portal Simulator'}</span>
          </button>

          {/* Download Dark PDF */}
          <button
            onClick={() => handleDownloadPdf('dark')}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download Dark PDF (.pdf)</span>
          </button>

          {/* Download White PDF */}
          <button
            onClick={() => handleDownloadPdf('white')}
            disabled={isGeneratingPdf}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Download White PDF</span>
          </button>
        </div>
      </div>

      {/* SIMULATOR VIEW (When active) */}
      {viewMode === 'portal_simulator' && (
        <div className="no-print bg-[#080b11] border-2 border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Interactive Field Lab · Simulated quext.io Admin Console
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Quext IoT Portal Live Simulation
              </h2>
              <p className="text-xs text-zinc-400">
                Practice executing live installer tasks: configuring HVAC profiles, verifying LoRaWAN gateway health, sending unlock commands, and running diagnostic sweeps.
              </p>
            </div>

            <button
              onClick={() => setViewMode('single_page')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold self-start sm:self-auto cursor-pointer"
            >
              Return to Field Manual
            </button>
          </div>

          {/* Simulated Portal Shell */}
          <div className="bg-[#0f141f] border border-zinc-700/80 rounded-xl overflow-hidden shadow-inner">
            <div className="bg-[#0a0e17] px-4 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-zinc-400 ml-2">https://quext.io/portal/installer/community/1042</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono text-[11px] border border-purple-700/40">
                  Role: Certified Field Installer ({currentUser.name})
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Col 1 */}
              <div className="bg-[#0a0d14] p-4 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    Property Structure
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    148 Units
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-zinc-400 block font-medium">Selected Community</label>
                  <select 
                    value={simCommunity} 
                    onChange={(e) => setSimCommunity(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>The Heights at Austin (Community #1042)</option>
                    <option>The Domain Grand Oaks (Community #2089)</option>
                    <option>Parkway Lofts Phase II (Community #3105)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-zinc-400 block font-medium">Select Unit to Inspect</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Unit 201', 'Unit 202', 'Unit 203', 'Unit 204', 'Unit 205', 'Clubhouse'].map((u) => (
                      <button
                        key={u}
                        onClick={() => setSimSelectedUnit(u)}
                        className={`py-2 px-2 text-xs rounded-lg font-mono font-bold transition-all border cursor-pointer ${
                          simSelectedUnit === u 
                            ? 'bg-purple-600/30 text-purple-300 border-purple-500' 
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      TEKTELIC Gateway
                    </span>
                    <button
                      onClick={() => setSimGatewayStatus(simGatewayStatus === 'online' ? 'offline' : 'online')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                        simGatewayStatus === 'online' 
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' 
                          : 'bg-red-900/60 text-red-300 border border-red-700'
                      }`}
                    >
                      {simGatewayStatus}
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-300">
                    <div>Backhaul: <span className="text-emerald-400">PoE Gigabit Ethernet</span></div>
                    <div>LoRa RSSI: <span className="text-purple-300">-78 dBm</span> · SNR: <span className="text-cyan-300">+9.2 dB</span></div>
                  </div>
                </div>
              </div>

              {/* Col 2 */}
              <div className="bg-[#0a0d14] p-4 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    {simSelectedUnit} Hardware
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">DevEUI: 70-B3-D5-7E-D0-04</span>
                </div>

                <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 space-y-3">
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>HVAC System Profile</span>
                    <span className="text-[10px] font-mono text-purple-400">QXT100048</span>
                  </div>

                  <div className="space-y-1.5">
                    {(['Heat Pump (O Polarity)', 'Heat Pump (B Polarity)', 'Conventional Gas'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setSimHvacMode(mode)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between border cursor-pointer ${
                          simHvacMode === mode
                            ? 'bg-purple-900/40 text-purple-200 border-purple-500'
                            : 'bg-black/50 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <span>{mode}</span>
                        {simHvacMode === mode && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      Schlage Control Lock
                    </span>
                    <span className="font-mono text-zinc-400 text-[10px]">Batt: 98%</span>
                  </div>

                  <button
                    onClick={() => {
                      setSimLockStatus(simLockStatus === 'locked' ? 'unlocked' : 'locked');
                    }}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                      simLockStatus === 'locked'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-800 hover:bg-amber-900/50'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900/50'
                    }`}
                  >
                    {simLockStatus === 'locked' ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Send Portal Remote Unlock (Test Pulse)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Bolt Retracted (Auto-Locking in 5s...)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Col 3 */}
              <div className="bg-[#0a0d14] p-4 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Device Report Export
                  </h3>
                  <span className="text-[10px] text-purple-400 font-mono">SOW Verification</span>
                </div>

                <p className="text-xs text-zinc-400">
                  Execute device export to verify mapped hardware against project SOW and export official documentation.
                </p>

                <button
                  onClick={runSimulatedHealthSweep}
                  disabled={simDiagnosticRunning}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${simDiagnosticRunning ? 'animate-bounce' : ''}`} />
                  <span>{simDiagnosticRunning ? 'Compiling Device Report...' : 'Generate Device Report PDF'}</span>
                </button>

                {simDiagnosticResults && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>SOW Devices Verified (100%)</span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-300 space-y-1">
                      <div>Units Verified: <span className="text-white font-bold">{simDiagnosticResults.testedCount}/{simDiagnosticResults.testedCount}</span></div>
                      <div>Average RSSI: <span className="text-emerald-300">{simDiagnosticResults.rssiAvg}</span></div>
                      <div className="text-purple-300 font-bold">Ready to Email to Project Manager</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE PAGE SLIDE VIEW */}
      {viewMode === 'single_page' && (
        <div className="space-y-6">
          {/* Slide Navigation Bar */}
          <div className="flex items-center justify-between bg-[#0a0e18] border border-zinc-800 rounded-xl p-3 px-4 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevPage}
                disabled={activePageIndex === 0}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-zinc-300">
                Slide <span className="text-purple-400">{activePageIndex + 1}</span> of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={activePageIndex === totalPages - 1}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-bold text-purple-300 hidden sm:block truncate max-w-xs">
              {activePageIndex === 0
                ? 'Cover · Field Operations Manual'
                : PORTAL_GUIDE_CHAPTERS[activePageIndex - 1]?.title}
            </div>

            {/* Quick Page Picker Pill Bar */}
            <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-md py-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePageIndex(idx)}
                  className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activePageIndex === idx
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Page Card Display (Zero White Backgrounds - matching Wallet Upgrade) */}
          <div className="rounded-2xl bg-[#0a0e18] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl relative">
            {/* Top Bar inside Slide */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <span className="border border-white/80 px-2 py-0.5 text-white font-extrabold text-[11px] rounded tracking-wider">
                  quext
                </span>
                <span className="text-xs text-zinc-500 font-mono">/ Smart Community</span>
              </div>
              <div className="text-xs font-mono font-bold text-purple-400">
                PORTAL INSTALLER GUIDE • FIELD MANUAL • {activePageIndex + 1 < 10 ? `0${activePageIndex + 1}` : activePageIndex + 1}
              </div>
            </div>

            {/* Slide Content */}
            {activePageIndex === 0 ? (
              <CoverPageView 
                theme={paperTheme} 
                onStartReading={() => setActivePageIndex(1)} 
                onDownloadPdf={() => handleDownloadPdf(paperTheme)}
              />
            ) : (
              <ChapterPageView 
                chapter={PORTAL_GUIDE_CHAPTERS[activePageIndex - 1]} 
                pageNumber={activePageIndex} 
                totalPages={totalPages - 1} 
                theme={paperTheme} 
              />
            )}
          </div>
        </div>
      )}

      {/* CONTINUOUS DECK VIEW (All 13 Slides in High-Def Dark Grid matching Wallet Upgrade) */}
      {viewMode === 'continuous_deck' && (
        <div className="space-y-8">
          {/* Slide 1: Cover Page */}
          <div className="rounded-2xl bg-[#0a0e18] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <span className="border border-white/80 px-2 py-0.5 text-white font-extrabold text-[11px] rounded tracking-wider">
                  quext
                </span>
                <span className="text-xs text-zinc-500 font-mono">/ Smart Community</span>
              </div>
              <div className="text-xs font-mono font-bold text-purple-400">
                SLIDE 1 OF {totalPages}
              </div>
            </div>
            <CoverPageView theme={paperTheme} onDownloadPdf={() => handleDownloadPdf(paperTheme)} />
          </div>

          {/* Slides 2..13: Chapters */}
          {PORTAL_GUIDE_CHAPTERS.map((chap, idx) => (
            <div
              key={chap.id}
              className="rounded-2xl bg-[#0a0e18] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl relative space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <span className="border border-white/80 px-2 py-0.5 text-white font-extrabold text-[11px] rounded tracking-wider">
                    quext
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">/ Smart Community</span>
                </div>
                <div className="text-xs font-mono font-bold text-purple-400">
                  SLIDE {idx + 2} OF {totalPages}
                </div>
              </div>
              <ChapterPageView 
                chapter={chap} 
                pageNumber={idx + 1} 
                totalPages={totalPages - 1} 
                theme={paperTheme} 
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

// Sub-component: Cover Page View
const CoverPageView: React.FC<{ 
  theme: 'white' | 'dark'; 
  onStartReading?: () => void;
  onDownloadPdf?: () => void;
}> = ({ theme, onStartReading, onDownloadPdf }) => {
  const isWhite = theme === 'white';
  return (
    <div className="min-h-[580px] flex flex-col justify-between py-2 space-y-6">

      {/* Main Title Hero */}
      <div className="space-y-4 py-8">
        <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs font-mono font-extrabold uppercase tracking-widest">
          Official Installation Manual · help.quext.io
        </div>

        <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight ${isWhite ? 'text-zinc-950' : 'text-white'}`}>
          Quext Portal (<span className="text-purple-600 dark:text-purple-400">quext.io</span>)<br />
          Installer Field Operations &amp; Device Provisioning Guide
        </h1>

        <p className={`text-base sm:text-lg leading-relaxed max-w-2xl ${isWhite ? 'text-zinc-600' : 'text-zinc-300'}`}>
          {PORTAL_GUIDE_METADATA.summary}
        </p>
      </div>

      {/* Quick Specs Grid */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border text-xs font-mono ${
        isWhite ? 'bg-zinc-50 border-zinc-200 text-zinc-700' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
      }`}>
        <div>
          <span className="text-zinc-400 block text-[10px]">PLATFORM</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">quext.io</span>
        </div>
        <div>
          <span className="text-zinc-400 block text-[10px]">TARGET AUDIENCE</span>
          <span className="font-bold">Certified Installers</span>
        </div>
        <div>
          <span className="text-zinc-400 block text-[10px]">REVISION</span>
          <span className="font-bold">{PORTAL_GUIDE_METADATA.version}</span>
        </div>
        <div>
          <span className="text-zinc-400 block text-[10px]">SUPPORT HOTLINE</span>
          <span className="font-bold text-cyan-600 dark:text-cyan-400">1-800-798-8319</span>
        </div>
      </div>

      {/* Action Button & Running Footer */}
      <div className={`pt-6 border-t-2 ${isWhite ? 'border-zinc-200' : 'border-zinc-800'} flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500`}>
        <div>&copy; 2026 Quext (OneQuext). Patented Multifamily IoT Solutions.</div>
        <div className="no-print flex flex-wrap items-center gap-3">
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className={`px-4 py-2.5 rounded-full text-white font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                !isWhite
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{!isWhite ? 'Download Dark PDF (.pdf)' : 'Download White PDF (.pdf)'}</span>
            </button>
          )}
          {onStartReading && (
            <button
              onClick={onStartReading}
              className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-900/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Start Reading (Page 1)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component: Chapter Page View
const ChapterPageView: React.FC<{
  chapter: PortalGuideChapter;
  pageNumber: number;
  totalPages: number;
  theme: 'white' | 'dark';
}> = ({ chapter, pageNumber, totalPages, theme }) => {
  const isWhite = theme === 'white';

  return (
    <div className="space-y-6 min-h-[580px]">

      {/* Chapter Title & Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          <span>SECTION {chapter.chapterNumber}</span>
          <span>·</span>
          <span>{chapter.readTime} Field Read</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isWhite ? 'text-zinc-950' : 'text-white'}`}>
          {chapter.title}
        </h2>
        <p className={`text-sm ${isWhite ? 'text-zinc-600' : 'text-zinc-300'}`}>{chapter.description}</p>
      </div>

      {/* SCREENSHOT MOCKUP OF QUEXT PORTAL / APP ACTION */}
      {chapter.screenshot && (
        <PortalScreenshotMockup screenshot={chapter.screenshot} theme={theme} />
      )}

      {/* Chapter Sections */}
      <div className="space-y-8">
        {chapter.sections.map((sec) => (
          <div key={sec.id} className="space-y-4">
            <h3 className={`text-base sm:text-lg font-bold ${isWhite ? 'text-purple-900' : 'text-purple-300'}`}>
              {sec.title}
            </h3>

            {sec.content.map((p, i) => (
              <p key={i} className={`text-xs sm:text-sm leading-relaxed ${isWhite ? 'text-zinc-700' : 'text-zinc-300'}`}>
                {p}
              </p>
            ))}

            {/* Steps */}
            {sec.steps && (
              <div className="space-y-2.5 my-3">
                {sec.steps.map((st) => (
                  <div 
                    key={st.stepNumber} 
                    className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      isWhite ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-900/60 border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {st.stepNumber}
                    </span>
                    <div className="space-y-1 text-xs">
                      <div className={`font-bold ${isWhite ? 'text-zinc-950' : 'text-white'}`}>{st.title}</div>
                      <div className={`${isWhite ? 'text-zinc-600' : 'text-zinc-300'}`}>{st.detail}</div>
                      {st.warning && (
                        <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/40 p-2 rounded border border-amber-300 dark:border-amber-800/50 mt-1 font-mono flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>CAUTION: {st.warning}</span>
                        </div>
                      )}
                      {st.tip && (
                        <div className="text-[11px] text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/40 p-2 rounded border border-cyan-300 dark:border-cyan-800/50 mt-1 font-mono">
                          TIP: {st.tip}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tables */}
            {sec.table && (
              <div className={`overflow-x-auto my-3 border rounded-xl ${isWhite ? 'border-zinc-200' : 'border-zinc-800'}`}>
                <table className="w-full text-left text-xs">
                  <thead className={`font-mono text-[11px] uppercase border-b ${
                    isWhite ? 'bg-purple-100 text-purple-900 border-zinc-200' : 'bg-purple-950/60 text-purple-200 border-zinc-800'
                  }`}>
                    <tr>
                      {sec.table.headers.map((h, hi) => (
                        <th key={hi} className="py-2.5 px-3.5 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isWhite ? 'divide-zinc-200 bg-white text-zinc-700' : 'divide-zinc-800 bg-[#07090f] text-zinc-300'}`}>
                    {sec.table.rows.map((r, ri) => (
                      <tr key={ri} className={isWhite ? 'hover:bg-zinc-50' : 'hover:bg-zinc-900/50'}>
                        {r.map((c, ci) => (
                          <td key={ci} className="py-2.5 px-3.5 whitespace-pre-line leading-relaxed">{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* KEY RULE Callout */}
            {sec.keyTakeaway && (
              <div className={`p-3 border-l-4 border-purple-500 rounded-r-xl text-xs font-medium my-2 ${
                isWhite ? 'bg-purple-50 text-purple-900' : 'bg-purple-950/30 text-purple-200'
              }`}>
                <span className="font-bold uppercase tracking-wider font-mono mr-1.5">Key Rule:</span>
                {sec.keyTakeaway}
              </div>
            )}

            {/* NEED HELP Callout (matching KEY RULE style) */}
            {sec.needHelpCallout && (
              <div className={`p-3 border-l-4 border-purple-500 rounded-r-xl text-xs font-medium my-2 ${
                isWhite ? 'bg-purple-50 text-purple-900' : 'bg-purple-950/30 text-purple-200'
              }`}>
                <span className="font-bold uppercase tracking-wider font-mono mr-1.5 text-purple-600 dark:text-purple-400">
                  {sec.needHelpCallout}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Running Footer */}
      <div className={`pt-6 border-t ${isWhite ? 'border-zinc-200' : 'border-zinc-800'} flex items-center justify-between text-[11px] font-mono text-zinc-500`}>
        <div>Quext IoT Platform · help.quext.io</div>
        <div>Page {pageNumber} of {totalPages}</div>
      </div>
    </div>
  );
};
