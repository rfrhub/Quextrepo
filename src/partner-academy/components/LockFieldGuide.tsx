import React, { useState, useRef } from 'react';
import {
  Download,
  BookOpen,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Copy,
  Check,
  Smartphone,
  Wrench,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Printer,
  FileText,
  Clock,
  Radio,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Lock,
  Flame,
  Zap,
} from 'lucide-react';
import {
  LOCK_GUIDES_CONFIGS,
  LockGuideConfig,
  ONBOARDING_FLOW_SLIDES,
  INSTALLATION_INFO_NEED_TO_KNOWS,
} from '../data/quextLockGuidesData';
import { generateAndDownloadIndividualLockPdf } from '../utils/generateIndividualLockPdf';

export const LockFieldGuide: React.FC<{
  lockType: 'befe' | 'ndeb' | 'xe360' | 'rc_reader';
  onOpenCourse?: (moduleId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}> = ({ lockType, onOpenCourse, onNavigateTab }) => {
  const config = LOCK_GUIDES_CONFIGS[lockType] || LOCK_GUIDES_CONFIGS.befe;

  const [activeTab, setActiveTab] = useState<'walkthrough' | 'slides' | 'fdr_lab' | 'troubleshooting'>('walkthrough');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSlideLightboxOpen, setIsSlideLightboxOpen] = useState<boolean>(false);
  const [downloadDropdown, setDownloadDropdown] = useState<boolean>(false);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Audio tone playback
  const [playingTone, setPlayingTone] = useState<string | null>(null);

  // Lock-Specific FDR Simulation States
  // Shared
  const [fdrStep, setFdrStep] = useState<number>(0);
  const [fdrSuccess, setFdrSuccess] = useState<boolean>(false);
  const [fdrCountdown, setFdrCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<any>(null);

  // BE/FE & NDEB
  const [fdrBatteryRemoved, setFdrBatteryRemoved] = useState<boolean>(false);
  const [fdrBatteryReplaced, setFdrBatteryReplaced] = useState<boolean>(false);
  const [actionCount, setActionCount] = useState<number>(0); // thumbturn or handle turns or button presses
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [ndebPostResetTimer, setNdebPostResetTimer] = useState<number | null>(null);

  // XE360
  const [xe360ModeSwitchHeld, setXe360ModeSwitchHeld] = useState<boolean>(false);

  // RC Reader
  const [rcResetMode, setRcResetMode] = useState<'network' | 'fdr'>('fdr');
  const [rcHoldSeconds, setRcHoldSeconds] = useState<number>(0);
  const rcTimerRef = useRef<any>(null);

  // Slides for this specific lock
  const lockSlides = ONBOARDING_FLOW_SLIDES.filter((s) =>
    config.relevantSlideIndices.includes(s.slideNumber)
  );

  // Web Audio Synthesizer
  const playTone = (type: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      setPlayingTone(type);
      const now = ctx.currentTime;

      if (type === 'single_beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(1320, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        setTimeout(() => setPlayingTone(null), 300);
      } else if (type === 'success_fdr') {
        // 2 Short + 1 Long Beep
        const osc1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        osc1.frequency.setValueAtTime(1760, now);
        g1.gain.setValueAtTime(0.25, now);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc1.connect(g1);
        g1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.1);

        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.frequency.setValueAtTime(1760, now + 0.16);
        g2.gain.setValueAtTime(0.25, now + 0.16);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc2.connect(g2);
        g2.connect(ctx.destination);
        osc2.start(now + 0.16);
        osc2.stop(now + 0.26);

        const osc3 = ctx.createOscillator();
        const g3 = ctx.createGain();
        osc3.frequency.setValueAtTime(1760, now + 0.36);
        g3.gain.setValueAtTime(0.3, now + 0.36);
        g3.gain.exponentialRampToValueAtTime(0.001, now + 0.96);
        osc3.connect(g3);
        g3.connect(ctx.destination);
        osc3.start(now + 0.36);
        osc3.stop(now + 0.96);

        setTimeout(() => setPlayingTone(null), 1100);
      } else if (type === 'action_beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(1480, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        setTimeout(() => setPlayingTone(null), 200);
      } else if (type === 'error_beep') {
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + i * 0.14;
          osc.frequency.setValueAtTime(520, t);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.08);
        }
        setTimeout(() => setPlayingTone(null), 600);
      }
    } catch (e) {
      console.warn('Audio not available:', e);
      setPlayingTone(null);
    }
  };

  // FDR Handlers
  const handleStartBatteryDischarge = () => {
    setFdrBatteryRemoved(true);
    setFdrBatteryReplaced(false);
    setActionCount(0);
    setFdrSuccess(false);
    setFdrCountdown(10);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setFdrCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReinsertBattery = () => {
    if (fdrCountdown !== null && fdrCountdown > 0) {
      playTone('error_beep');
      alert('Capacitor discharge incomplete! Please wait the full 10 seconds before reinserting battery.');
      return;
    }
    setFdrBatteryReplaced(true);
    playTone('single_beep');
  };

  const handleExecuteLockAction = () => {
    const newCount = actionCount + 1;
    setActionCount(newCount);
    setRotationAngle((prev) => prev + 90);
    playTone('action_beep');

    if (config.id === 'befe' && newCount === 2) {
      setFdrSuccess(true);
      playTone('success_fdr');
    } else if (config.id === 'ndeb' && newCount === 3) {
      setFdrSuccess(true);
      playTone('success_fdr');
      // Start 30s NDEB post-reset timer
      setNdebPostResetTimer(30);
      const timer = setInterval(() => {
        setNdebPostResetTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (config.id === 'xe360' && newCount === 3) {
      setFdrSuccess(true);
      playTone('success_fdr');
    }
  };

  const handleXe360ModeSwitch = () => {
    setXe360ModeSwitchHeld(true);
    playTone('action_beep');
    setTimeout(() => playTone('action_beep'), 200);
  };

  const handleResetFdrSimulator = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setFdrBatteryRemoved(false);
    setFdrBatteryReplaced(false);
    setActionCount(0);
    setFdrSuccess(false);
    setFdrCountdown(null);
    setRotationAngle(0);
    setNdebPostResetTimer(null);
    setXe360ModeSwitchHeld(false);
    setRcHoldSeconds(0);
  };

  const handleCopySupportTemplate = () => {
    const template = `TO: support@onequext.com
SUBJECT: Lock Deletion & Cloud Clearance Request - [Community Name]

Hello Quext Support,

Please dissociate the following hardware record from the property cloud database:

• Property / Community Name: [Community Name]
• Building & Unit / Door: [e.g. Building 2, Unit 204 / Front Door]
• Hardware Model: ${config.deviceModels}
• Serial Number / Barcode: [Enter 10-digit Serial Number]
• Reason: [Hardware Swap / Reset / Unit Move]
• Field Installer Name & ID: [Your Name]

Thank you,
Field Installation Team`;

    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 3000);
  };

  const handleToggleComplete = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 pb-16 text-zinc-100">
      {/* Top Banner & Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#120f26] via-[#090b14] to-[#06070a] border border-purple-900/40 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-mono font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                Official Field Manual · Quext_Locks_ec728054.pdf Source
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {config.deviceModels}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {config.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 mt-2 leading-relaxed">
              {config.subtitle}. Complete step-by-step onboarding, cloud sync, testing, and hardware-specific Factory Default Reset (FDR).
            </p>

            {/* Quick Lock Family Switcher Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 font-semibold mr-1">Switch Lock Guide:</span>
              {(['befe', 'ndeb', 'xe360', 'rc_reader'] as const).map((id) => {
                const isCurrent = id === lockType;
                return (
                  <button
                    key={id}
                    onClick={() => onNavigateTab && onNavigateTab(LOCK_GUIDES_CONFIGS[id].tabId)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400/50 shadow-md'
                        : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {LOCK_GUIDES_CONFIGS[id].name.replace(' Field Guide', '')}
                  </button>
                );
              })}
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('spec_sheets')}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-950/40 text-cyan-300 hover:bg-cyan-950/70 border border-cyan-800/60 transition-all cursor-pointer flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Spec Sheets, Manuals &amp; Cut Sheets →</span>
                </button>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 relative z-30">
            {/* PDF Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDownloadDropdown(!downloadDropdown)}
                className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ring-1 ring-white/10"
              >
                <Download className="w-4 h-4 text-purple-200" />
                <span>Download {config.name} PDF</span>
                <ChevronDown className={`w-3.5 h-3.5 text-purple-200 transition-transform duration-200 ${downloadDropdown ? 'rotate-180' : ''}`} />
              </button>

              {downloadDropdown && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDownloadDropdown(false)}
                />
              )}

              {downloadDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#0c0e17] border border-zinc-700 rounded-2xl shadow-2xl shadow-black/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                  <div className="px-3 py-1.5 border-b border-zinc-800/80 mb-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
                      Select Download Format
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      generateAndDownloadIndividualLockPdf(config.id, { theme: 'white', format: 'letter' });
                      setDownloadDropdown(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-cyan-400 group-hover:border-cyan-500/50 shrink-0">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        Print-Friendly PDF (Letter)
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                        Clean white background formatted for physical printing
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      generateAndDownloadIndividualLockPdf(config.id, { theme: 'dark', format: 'letter' });
                      setDownloadDropdown(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-purple-400 group-hover:border-purple-500/50 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                        Quext Dark Theme PDF (Tablet)
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                        High-contrast OLED presentation for iPad and field tablets
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      generateAndDownloadIndividualLockPdf(config.id, { theme: 'dark', format: 'mobile' });
                      setDownloadDropdown(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer group mt-1 border-t border-zinc-800/80 pt-2"
                  >
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/40 text-emerald-400 group-hover:border-emerald-500/50 shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                        <span>Mobile Phone Edition</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">NEW</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                        Single-column 9:16 layout optimized for smartphone screens
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {onOpenCourse && (
              <button
                onClick={() => {
                  const courseId =
                    config.id === 'befe'
                      ? 'mod_befe_locks'
                      : config.id === 'ndeb'
                      ? 'mod_nde_wireless'
                      : config.id === 'xe360'
                      ? 'mod_xe360_suite'
                      : 'mod_rc_card_readers';
                  onOpenCourse(courseId);
                }}
                className="px-5 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Open Related Field Course</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Section Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('walkthrough')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'walkthrough'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Step-by-Step Onboarding Flow</span>
        </button>

        <button
          onClick={() => setActiveTab('fdr_lab')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'fdr_lab'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Interactive Factory Reset (FDR) Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'slides'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Original PDF Slide Deck ({lockSlides.length} Slides)</span>
        </button>

        <button
          onClick={() => setActiveTab('troubleshooting')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'troubleshooting'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Troubleshooting &amp; Deletion Protocol</span>
        </button>
      </div>

      {/* VIEW 1: STEP-BY-STEP ONBOARDING WALKTHROUGH */}
      {activeTab === 'walkthrough' && (
        <div className="space-y-6">
          {/* Hardware Spotlight */}
          <div className="bg-[#090b12] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="text-[11px] font-mono text-purple-400 uppercase font-bold tracking-wider mb-1">
                Active Hardware Target
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {config.deviceModels}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {config.subtitle}. Verified for Quext IoT Admin mobile app provisioning, BLE 5.0 synchronization, and NFC mobile wallet credentials.
              </p>

              {config.specificNotes && (
                <div className="mt-4 space-y-1.5 text-xs text-zinc-300">
                  {config.specificNotes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold shrink-0">•</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-48 sm:w-56 aspect-square rounded-2xl bg-zinc-950 border border-zinc-800 p-4 flex items-center justify-center shrink-0">
              <img
                src={config.hardwareImage}
                alt={config.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Stepper Cards */}
          <div className="space-y-4">
            {lockSlides.slice(0, 16).map((slide) => {
              const isDone = !!completedSteps[`slide_${slide.slideNumber}`];

              return (
                <div
                  key={slide.slideNumber}
                  className={`rounded-2xl border transition-all p-5 sm:p-6 ${
                    isDone
                      ? 'bg-zinc-950/40 border-emerald-500/30'
                      : 'bg-[#090b12] border-zinc-800 hover:border-zinc-700/80 shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={() => handleToggleComplete(`slide_${slide.slideNumber}`)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-colors shrink-0 mt-0.5 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/40'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-purple-500 hover:text-white'
                        }`}
                        title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                      >
                        {isDone ? '✓' : slide.slideNumber}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
                            Slide {slide.slideNumber} · {slide.category}
                          </span>
                        </div>
                        <h3 className={`text-base sm:text-lg font-bold mt-1 ${isDone ? 'line-through text-zinc-400' : 'text-white'}`}>
                          {slide.title}
                        </h3>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                          {slide.description}
                        </p>

                        {slide.bulletPoints && (
                          <div className="mt-3 space-y-1 text-xs text-zinc-400 pl-2">
                            {slide.bulletPoints.map((b, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span className="text-purple-400 font-bold">•</span>
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleComplete(`slide_${slide.slideNumber}`)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {isDone ? 'Completed' : 'Check Off'}
                      </button>

                      <button
                        onClick={() => {
                          const idx = lockSlides.findIndex((s) => s.slideNumber === slide.slideNumber);
                          if (idx >= 0) {
                            setCurrentSlideIndex(idx);
                            setActiveTab('slides');
                          }
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Slide Image →</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE FACTORY DEFAULT RESET (FDR) LAB */}
      {activeTab === 'fdr_lab' && (
        <div className="space-y-6">
          <div className="bg-[#090b12] border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-mono text-purple-400 uppercase font-bold tracking-wider">
                  Official Reset Sequence · Slide {config.fdrSlideNumber}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  {config.fdrTitle}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Practice the physical timing, pin/button presses, and listen for auditory feedback before executing on the door.
                </p>
              </div>

              <button
                onClick={handleResetFdrSimulator}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-zinc-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            </div>

            {/* Lock-Specific Simulator Controls */}
            {/* 1. BE/FE Simulator */}
            {config.id === 'befe' && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-2xl border text-center ${fdrBatteryRemoved ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">Step A: Battery Pull</div>
                    <div className="text-xs font-bold text-white mb-2">Remove 1 Battery</div>
                    <button
                      disabled={fdrBatteryRemoved}
                      onClick={handleStartBatteryDischarge}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer ${fdrBatteryRemoved ? 'bg-emerald-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                    >
                      {fdrBatteryRemoved ? '✓ Battery Removed' : 'Remove 1 Battery'}
                    </button>
                    {fdrCountdown !== null && (
                      <div className="mt-2 text-[10px] font-mono">
                        {fdrCountdown > 0 ? <span className="text-amber-400 font-bold">Drain: {fdrCountdown}s</span> : <span className="text-emerald-400 font-bold">✓ Discharge Complete</span>}
                      </div>
                    )}
                  </div>

                  <div className={`p-4 rounded-2xl border text-center ${fdrBatteryReplaced ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">Step C: Battery Replace</div>
                    <div className="text-xs font-bold text-white mb-2">Reinsert Battery</div>
                    <button
                      disabled={!fdrBatteryRemoved || fdrBatteryReplaced || (fdrCountdown !== null && fdrCountdown > 0)}
                      onClick={handleReinsertBattery}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer ${fdrBatteryReplaced ? 'bg-emerald-600 text-white' : !fdrBatteryRemoved || (fdrCountdown !== null && fdrCountdown > 0) ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                    >
                      {fdrBatteryReplaced ? '✓ 1 Beep Heard' : 'Reinsert Battery'}
                    </button>
                    <div className="mt-2 text-[10px] text-zinc-400">
                      {fdrBatteryReplaced ? 'Single power-up beep heard' : 'Wait for 10s countdown'}
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border text-center ${fdrSuccess ? 'border-emerald-500/50 bg-emerald-950/20 ring-2 ring-emerald-500/40' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">Step E: 2-Turn Action</div>
                    <div className="text-xs font-bold text-white mb-2">Rotate Thumbturn (x2)</div>
                    <button
                      disabled={!fdrBatteryReplaced || fdrSuccess}
                      onClick={handleExecuteLockAction}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer ${fdrSuccess ? 'bg-emerald-600 text-white' : !fdrBatteryReplaced ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}
                    >
                      {fdrSuccess ? '✓ FDR Success!' : `Turn Thumbturn (${actionCount}/2)`}
                    </button>
                    <div className="mt-2 text-[10px] text-zinc-400">
                      {fdrSuccess ? '2 Short + 1 Long Beep!' : 'Turn twice within 2 seconds'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. NDEB Simulator */}
            {config.id === 'ndeb' && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className={`p-3.5 rounded-2xl border text-center ${fdrBatteryRemoved ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono text-zinc-400">Step A: Battery</div>
                    <button
                      disabled={fdrBatteryRemoved}
                      onClick={handleStartBatteryDischarge}
                      className="mt-2 w-full py-1.5 px-2 bg-purple-600 text-white rounded-lg text-xs font-bold cursor-pointer disabled:bg-emerald-600"
                    >
                      {fdrBatteryRemoved ? '✓ Pulled' : 'Pull 1 Battery'}
                    </button>
                    {fdrCountdown !== null && <div className="mt-1 text-[10px] font-mono text-amber-400">Wait {fdrCountdown}s</div>}
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-center ${fdrBatteryReplaced ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono text-zinc-400">Step C: Reinsert</div>
                    <button
                      disabled={!fdrBatteryRemoved || fdrBatteryReplaced || (fdrCountdown !== null && fdrCountdown > 0)}
                      onClick={handleReinsertBattery}
                      className="mt-2 w-full py-1.5 px-2 bg-purple-600 text-white rounded-lg text-xs font-bold cursor-pointer disabled:bg-zinc-800"
                    >
                      {fdrBatteryReplaced ? '✓ Reinserted' : 'Replace Battery'}
                    </button>
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-center ${fdrStep >= 1 ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono text-zinc-400">Step D: Pin Hold</div>
                    <button
                      disabled={!fdrBatteryReplaced || fdrStep >= 1}
                      onClick={() => {
                        setFdrStep(1);
                        playTone('action_beep');
                      }}
                      className="mt-2 w-full py-1.5 px-2 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer disabled:bg-zinc-800"
                    >
                      {fdrStep >= 1 ? '✓ Pin Held 7s' : 'Hold Pin (7s)'}
                    </button>
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-center ${fdrSuccess ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono text-zinc-400">Step E: Handle Turns</div>
                    <button
                      disabled={fdrStep < 1 || fdrSuccess}
                      onClick={handleExecuteLockAction}
                      className="mt-2 w-full py-1.5 px-2 bg-cyan-600 text-white rounded-lg text-xs font-bold cursor-pointer disabled:bg-zinc-800"
                    >
                      {fdrSuccess ? '✓ 2 Beeps + 1 Long' : `Turn Lever (${actionCount}/3)`}
                    </button>
                  </div>
                </div>

                {/* NDEB 30-Second Wake Timer Callout (Slide 20 Pro Tip) */}
                {fdrSuccess && (
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Slide 20 Pro Tip: </span>
                      Wait 30 seconds for the NDEB lock to initialize before starting Quext app pairing.
                    </div>
                    {ndebPostResetTimer !== null && (
                      <span className="font-mono font-bold text-cyan-300 text-sm bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-700">
                        {ndebPostResetTimer > 0 ? `${ndebPostResetTimer}s remaining` : '✓ Ready for App Onboarding!'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. XE360 Simulator */}
            {config.id === 'xe360' && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border text-center ${xe360ModeSwitchHeld ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Step 1: Mode Switch</div>
                    <div className="text-xs font-bold text-white mb-2">Hold Mode Switch 5 Seconds</div>
                    <button
                      disabled={xe360ModeSwitchHeld}
                      onClick={handleXe360ModeSwitch}
                      className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer disabled:bg-emerald-600"
                    >
                      {xe360ModeSwitchHeld ? '✓ 2 Green Lights + 2 Beeps' : 'Hold Mode Switch (5s)'}
                    </button>
                  </div>

                  <div className={`p-4 rounded-2xl border text-center ${fdrSuccess ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-zinc-800 bg-zinc-900/60'}`}>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Step 2: Lever / Crash Bar</div>
                    <div className="text-xs font-bold text-white mb-2">Rotate or Depress 3 Times within 20s</div>
                    <button
                      disabled={!xe360ModeSwitchHeld || fdrSuccess}
                      onClick={handleExecuteLockAction}
                      className="w-full py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer disabled:bg-zinc-800"
                    >
                      {fdrSuccess ? '✓ FDR Complete (1 Green + 1 Beep)' : `Rotate Lever / Crash Bar (${actionCount}/3)`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. RC Reader Simulator */}
            {config.id === 'rc_reader' && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => {
                      setRcResetMode('fdr');
                      handleResetFdrSimulator();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${rcResetMode === 'fdr' ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}
                  >
                    Factory Default Reset (FDR · Slide 23)
                  </button>
                  <button
                    onClick={() => {
                      setRcResetMode('network');
                      handleResetFdrSimulator();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${rcResetMode === 'network' ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-zinc-400'}`}
                  >
                    Network Reset (Slide 22)
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center max-w-md mx-auto">
                  <div className="text-xs font-bold text-white mb-1">
                    {rcResetMode === 'fdr' ? 'FDR Reset Button (Hold 10s, Release before 14s)' : 'Network Reset Button (Hold 5s)'}
                  </div>
                  <p className="text-[11px] text-zinc-400 mb-4">
                    {rcResetMode === 'fdr'
                      ? 'Hold longer than 7s for first two beeps, but release BEFORE 14s or FDR is cancelled!'
                      : 'Hold approx. 5 seconds until 1 green LED flash and 1 short beep, then release.'}
                  </p>

                  <div className="text-3xl font-mono font-extrabold text-cyan-400 my-3">
                    {rcHoldSeconds}s
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        const newSec = rcHoldSeconds + 2;
                        setRcHoldSeconds(newSec);
                        playTone('action_beep');

                        if (rcResetMode === 'network' && newSec >= 5) {
                          setFdrSuccess(true);
                          playTone('single_beep');
                        } else if (rcResetMode === 'fdr') {
                          if (newSec >= 8 && newSec <= 12) {
                            setFdrSuccess(true);
                            playTone('success_fdr');
                          } else if (newSec > 14) {
                            setFdrSuccess(false);
                            playTone('error_beep');
                            alert('Exceeded 14 seconds! The FDR process was cancelled per OEM firmware rules.');
                          }
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-lg"
                    >
                      + Hold Pin (+2s)
                    </button>
                  </div>

                  {fdrSuccess && (
                    <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                      {rcResetMode === 'fdr' ? '✓ Steady Green Light & Long Beep (FDR Success)' : '✓ 1 Green Flash & 1 Short Beep (Network Reset Success)'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: ORIGINAL PDF SLIDE DECK VIEWER */}
      {activeTab === 'slides' && (
        <div className="space-y-6">
          <div className="bg-[#090b12] border border-zinc-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-mono text-purple-400 uppercase font-bold">
                  Quext_Locks_ec728054.pdf Original Slides
                </span>
                <h2 className="text-xl font-extrabold text-white mt-0.5">
                  Slide {lockSlides[currentSlideIndex]?.slideNumber}: {lockSlides[currentSlideIndex]?.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-zinc-400 px-2">
                  {currentSlideIndex + 1} / {lockSlides.length}
                </span>
                <button
                  disabled={currentSlideIndex === lockSlides.length - 1}
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(lockSlides.length - 1, prev + 1))}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsSlideLightboxOpen(true)}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white ml-2 cursor-pointer shadow-md"
                  title="Enlarge Slide in High-Res Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Image Stage */}
            <div className="mt-6 flex flex-col items-center justify-center bg-black rounded-2xl border border-zinc-800 p-4 sm:p-6 min-h-[460px]">
              <img
                src={lockSlides[currentSlideIndex]?.image}
                alt={lockSlides[currentSlideIndex]?.title}
                className="max-h-[580px] w-auto object-contain rounded-xl shadow-2xl cursor-pointer"
                onClick={() => setIsSlideLightboxOpen(true)}
              />
              <p className="text-xs text-zinc-400 mt-4 max-w-xl text-center">
                {lockSlides[currentSlideIndex]?.description}
              </p>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {lockSlides.map((slide, idx) => (
                <button
                  key={slide.slideNumber}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-16 h-12 rounded-lg border overflow-hidden shrink-0 transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'border-purple-400 ring-2 ring-purple-400'
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: TROUBLESHOOTING & DELETION PROTOCOL */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-6">
          {/* Deletion Protocol Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-rose-950/60 via-zinc-950 to-purple-950/40 border-2 border-rose-600/50 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Mandatory OEM Deletion Protocol · Slide 2 &amp; Slides 25-26</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-1.5">
                  Deleting a Lock Requires Quext Support Cloud Clearance
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                  Whenever you delete a lock from the Quext app you will need to reach out to support (<span className="font-bold text-white underline decoration-rose-500">support@onequext.com</span>) to receive assistance in fully clearing out the lock from the property database before you can continue using that same lock in the app.
                </p>

                <div className="mt-4 p-3 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono text-purple-300">
                  Standard Recovery Loop: Delete in App → Email support@onequext.com → Perform Hardware FDR → Re-onboard from Slide 5 through 11.
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <button
                  onClick={handleCopySupportTemplate}
                  className="w-full md:w-auto px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Support Ticket Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-rose-400" />
                      <span>Copy Email Template</span>
                    </>
                  )}
                </button>
                <div className="text-[10px] text-zinc-400 text-center mt-2 font-mono">
                  support@onequext.com
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting Cards (Slides 24, 25, 26) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#090b12] border border-zinc-800 shadow-md">
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">Slide 24</div>
              <h4 className="text-sm font-bold text-white mt-1">Missing App Invite or Credentials?</h4>
              <p className="text-xs text-zinc-300 mt-2">
                Contact Quext Support (support@onequext.com). They can assist with getting you back on track with login issues and missing credentials!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090b12] border border-zinc-800 shadow-md">
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">Slide 25</div>
              <h4 className="text-sm font-bold text-white mt-1">Lock Not Responding to App or Fob?</h4>
              <p className="text-xs text-zinc-300 mt-2">
                Ensure your phone is running the latest OS version and Bluetooth is ON. As a last resort, delete the lock in app, reach out to support to delete from cloud, perform Factory Reset (FDR), and repeat onboarding from Slide 5 to 11.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090b12] border border-zinc-800 shadow-md">
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">Slide 26</div>
              <h4 className="text-sm font-bold text-white mt-1">Won't Complete the Sync Step?</h4>
              <p className="text-xs text-zinc-300 mt-2">
                Delete lock in app, contact support@onequext.com to delete on backend, perform Factory Reset (FDR), and repeat onboarding from Slide 5 through Slide 11, then try Syncing or engaging lock!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for High-Resolution Slide Inspection */}
      {isSlideLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-zinc-200">
            <div>
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                Slide {lockSlides[currentSlideIndex]?.slideNumber} of 26
              </span>
              <h3 className="text-base font-bold text-white">
                {lockSlides[currentSlideIndex]?.title}
              </h3>
            </div>
            <button
              onClick={() => setIsSlideLightboxOpen(false)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-2">
            <img
              src={lockSlides[currentSlideIndex]?.image}
              alt={lockSlides[currentSlideIndex]?.title}
              className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
