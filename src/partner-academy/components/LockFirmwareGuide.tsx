import React, { useState, useEffect } from 'react';
import {
  Download,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Copy,
  Check,
  Smartphone,
  ChevronDown,
  Sparkles,
  Printer,
  FileText,
  Clock,
  Radio,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Lock,
  Zap,
  ArrowRight,
  RotateCcw,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  LOCK_FIRMWARE_METADATA,
  LOCK_FIRMWARE_SLIDES,
  LOCK_FIRMWARE_STEPS,
} from '../data/lockFirmwareGuideData';
import { generateAndDownloadLockFirmwarePdf } from '../utils/generateLockFirmwarePdfGuide';

export const LockFirmwareGuide: React.FC<{
  onOpenCourse?: (moduleId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}> = ({ onOpenCourse, onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'slides' | 'simulator' | 'troubleshooting'>('walkthrough');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSlideLightboxOpen, setIsSlideLightboxOpen] = useState<boolean>(false);
  const [downloadDropdown, setDownloadDropdown] = useState<boolean>(false);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Simulator states
  const [simStep, setSimStep] = useState<number>(0); // 0: unit card, 1: 3-dots open, 2: version screen, 3: version picker, 4: uploading, 5: blinking LED, 6: success
  const [simUploadPercent, setSimUploadPercent] = useState<number>(0);
  const [simBlinkTimer, setSimBlinkTimer] = useState<number>(10);
  const [simLedColor, setSimLedColor] = useState<'green' | 'red'>('green');

  // Simulator blinking effect
  useEffect(() => {
    let interval: any;
    if (simStep === 5) {
      interval = setInterval(() => {
        setSimLedColor((prev) => (prev === 'green' ? 'red' : 'green'));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [simStep]);

  // Simulator countdown
  useEffect(() => {
    let timer: any;
    if (simStep === 5 && simBlinkTimer > 0) {
      timer = setTimeout(() => {
        setSimBlinkTimer((prev) => prev - 1);
      }, 1000);
    } else if (simStep === 5 && simBlinkTimer === 0) {
      setSimStep(6);
    }
    return () => clearTimeout(timer);
  }, [simStep, simBlinkTimer]);

  const handleStartSimUpload = () => {
    setSimStep(4);
    setSimUploadPercent(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setSimUploadPercent(100);
        setTimeout(() => {
          setSimStep(5);
          setSimBlinkTimer(10);
        }, 800);
      } else {
        setSimUploadPercent(p);
      }
    }, 400);
  };

  const handleResetSim = () => {
    setSimStep(0);
    setSimUploadPercent(0);
    setSimBlinkTimer(10);
  };

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const currentSlide = LOCK_FIRMWARE_SLIDES[currentSlideIndex];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Official OEM Lock Firmware Update Protocol</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Lock Firmware Guide
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Step-by-step procedure to wirelessly upgrade smart lock firmware via Bluetooth Low Energy in the Quext IoT Admin app. Applies to both{' '}
              <strong className="text-white">BE467, FE410, XE360, and NDEB</strong> lock lines.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Target: BE, FE, XE360, NDEB
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Latest Build: {LOCK_FIRMWARE_METADATA.latestFirmwareTarget}
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Flashing Time: 5 - 10 min
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            {onOpenCourse && (
              <button
                type="button"
                onClick={() => onOpenCourse('mod_lock_firmware')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 border border-purple-400/40 transition-all cursor-pointer active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Launch Course 09: Lock Firmware</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}

            {/* Download Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDownloadDropdown(!downloadDropdown)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Download PDF Guide</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {downloadDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="text-[10px] font-mono text-zinc-400 px-3 py-1.5 uppercase tracking-wider">
                    Format &amp; Theme
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      generateAndDownloadLockFirmwarePdf({ theme: 'white', format: 'letter' });
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-200 hover:bg-purple-950/50 hover:text-purple-300 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      Letter · Clean White (Print)
                    </span>
                    <Printer className="w-3 h-3 text-zinc-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      generateAndDownloadLockFirmwarePdf({ theme: 'dark', format: 'letter' });
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-200 hover:bg-purple-950/50 hover:text-purple-300 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      Letter · Dark Field Ops
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      generateAndDownloadLockFirmwarePdf({ theme: 'dark', format: 'mobile' });
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-200 hover:bg-purple-950/50 hover:text-purple-300 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      Mobile · iPhone / Android Pocket
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('walkthrough')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'walkthrough'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Step-by-Step Walkthrough</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('slides')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'slides'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Interactive Slide Deck (14 Slides)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'simulator'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Firmware Flashing Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('troubleshooting')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'troubleshooting'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Troubleshooting &amp; Support</span>
        </button>
      </div>

      {/* Tab 1: Walkthrough */}
      {activeTab === 'walkthrough' && (
        <div className="space-y-6">
          {/* Important Notices Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Critical Field Mandates (Slides 2 &amp; 3)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-amber-200/90 leading-relaxed">
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="font-bold text-white block mb-1">1. Cellular Signal Priority</span>
                Ensure that you prioritize using cellular signal as your main method of communication to the Quext app unless under a poor service area. Disconnect from guest Wi-Fi.
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20">
                <span className="font-bold text-white block mb-1">2. Disable Screen Auto-Lock</span>
                Prevent OS sleep during firmware upload. Android: Settings → Security → Screen lock → "None" or "Swipe". iOS: Settings → Display &amp; Brightness → Auto-Lock → "Never".
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {LOCK_FIRMWARE_STEPS.map((step) => {
              const isDone = !!completedSteps[step.id];
              return (
                <div
                  key={step.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300 font-mono font-bold">
                          Step {step.stepNumber}
                        </span>
                        <span className="text-zinc-400 font-medium">Stage {step.stageNumber}: {step.stageTitle}</span>
                        {step.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {step.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white">{step.title}</h3>
                      <p className="text-xs text-zinc-400">{step.summary}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleStepCompleted(step.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                      }`}
                      title={isDone ? 'Mark as incomplete' : 'Mark step as completed'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Instructions */}
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-1.5 text-xs text-zinc-300">
                    {step.instructions.map((inst, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                        <span>{inst}</span>
                      </div>
                    ))}
                  </div>

                  {/* Field Tip / Warning */}
                  {step.fieldTips && step.fieldTips.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-purple-300 text-[11px]">
                        <Info className="w-3.5 h-3.5" />
                        Field Tip
                      </span>
                      {step.fieldTips.map((tip, idx) => (
                        <p key={idx}>{tip}</p>
                      ))}
                    </div>
                  )}

                  {step.criticalWarning && (
                    <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{step.criticalWarning}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Slides */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          {/* Main Slide Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                  Slide {currentSlide.slideNumber} of {LOCK_FIRMWARE_SLIDES.length}
                </span>
                <span className="text-xs font-semibold text-zinc-300">{currentSlide.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSlideLightboxOpen(true)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Image Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-black flex items-center justify-center p-4">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Slide Metadata & Description */}
            <div className="p-4 sm:p-6 bg-zinc-900/90 border-t border-zinc-800 space-y-2">
              <div className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                {currentSlide.category}
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed">{currentSlide.description}</p>
              {currentSlide.bulletPoints && (
                <div className="pt-2 space-y-1">
                  {currentSlide.bulletPoints.map((bp, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{bp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                disabled={currentSlideIndex === 0}
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              <span className="text-xs font-mono text-zinc-500">
                {currentSlideIndex + 1} / {LOCK_FIRMWARE_SLIDES.length}
              </span>

              <button
                type="button"
                disabled={currentSlideIndex === LOCK_FIRMWARE_SLIDES.length - 1}
                onClick={() => setCurrentSlideIndex((prev) => Math.min(LOCK_FIRMWARE_SLIDES.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Thumbnails Grid */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
              Slide Deck Overview
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {LOCK_FIRMWARE_SLIDES.map((slide, idx) => (
                <button
                  key={slide.slideNumber}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'bg-purple-950/80 border-purple-500 shadow-md ring-1 ring-purple-400'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="aspect-[4/3] rounded overflow-hidden bg-black mb-1">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 truncate">
                    #{slide.slideNumber} {slide.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Simulator */}
      {activeTab === 'simulator' && (
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>In-App Firmware Flashing Simulator</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Interact with the Quext IoT Admin mock interface to test lock selection, version picking, BLE upload, and the 5-10 minute physical LED cycle.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetSim}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulator</span>
            </button>
          </div>

          {/* Interactive Phone Mock Frame */}
          <div className="max-w-md mx-auto rounded-3xl bg-black border-4 border-zinc-700 overflow-hidden shadow-2xl p-4 text-white font-sans space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 px-1 border-b border-zinc-800 pb-2">
              <span>11:25</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Sim Step 0: Lock Device Profile Card */}
            {simStep === 0 && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-sm">Lock · Unit 103</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimStep(1)}
                    className="p-1 text-purple-400 hover:text-white rounded hover:bg-zinc-800 text-lg font-bold tracking-widest cursor-pointer"
                    title="Tap three dots (...)"
                  >
                    •••
                  </button>
                </div>

                <div className="text-xs font-mono text-zinc-400 space-y-1">
                  <div>Serial number: <span className="text-white">e20000000127399</span></div>
                  <div>Model: <span className="text-white">BE467BM (Deadbolt)</span></div>
                  <div>Current FW: <span className="text-amber-400 font-bold">05.19.02</span></div>
                  <div>Battery voltage: <span className="text-emerald-400">5.55 V (OK)</span></div>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] text-purple-300 text-center animate-pulse">
                    👉 Tap the three dots (•••) in top right to access menu
                  </p>
                </div>
              </div>
            )}

            {/* Sim Step 1: Context Menu Pop-up */}
            {simStep === 1 && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="text-xs font-mono text-zinc-400">Lock Profile Options</div>
                <div className="space-y-1 text-xs">
                  <div className="p-2 rounded bg-zinc-800/50 text-zinc-400">Read audits</div>
                  <button
                    type="button"
                    onClick={() => setSimStep(2)}
                    className="w-full text-left p-2 rounded bg-purple-600 hover:bg-purple-500 font-bold text-white transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>Update firmware</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="p-2 rounded bg-zinc-800/50 text-zinc-400">Change location</div>
                  <div className="p-2 rounded bg-zinc-800/50 text-zinc-400">Uninstall</div>
                </div>
              </div>
            )}

            {/* Sim Step 2: Firmware Update Screen */}
            {simStep === 2 && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-zinc-300 border-b border-zinc-800 pb-1">
                  Firmware update · Unit 103
                </div>
                <div className="text-xs font-mono space-y-2">
                  <div className="p-2 rounded bg-zinc-800/60">
                    <span className="text-zinc-500 block text-[10px]">CURRENT VERSION</span>
                    <span className="text-white font-bold">05.19.02</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimStep(3)}
                    className="w-full text-left p-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-purple-500/50 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="text-purple-300 block text-[10px] font-bold">SELECTED VERSION</span>
                      <span className="text-white font-bold">05.20.03</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleStartSimUpload}
                  className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 shadow-sm cursor-pointer"
                >
                  Update
                </button>
              </div>
            )}

            {/* Sim Step 3: Version Picker Modal */}
            {simStep === 3 && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-zinc-200">Select Lock Firmware Version</div>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSimStep(2)}
                    className="w-full p-2.5 rounded-lg bg-purple-600/30 border border-purple-500 text-white font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>05.20.03 (Recommended)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </button>
                  <div className="p-2.5 rounded-lg bg-zinc-800/60 text-zinc-400 flex items-center justify-between">
                    <span>05.19.02 (current)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSimStep(2)}
                  className="w-full py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Sim Step 4: Uploading in Progress */}
            {simStep === 4 && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
                <div className="font-bold text-zinc-200">Firmware update in progress...</div>
                <div className="p-2 rounded bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300">
                  ⚠️ To ensure a successful update, please stay on this screen until the update is complete.
                </div>

                <div className="space-y-1 text-zinc-400 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Getting serial number: Done
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Getting security token: Done
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Downloading firmware: Done
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Checking bluetooth availability: Done
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Looking for the lock: Done
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Uploading firmware...</span>
                    <span className="text-purple-400 font-bold">{simUploadPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${simUploadPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sim Step 5: Physical Lock Blinking Green & Red */}
            {simStep === 5 && (
              <div className="p-5 rounded-xl bg-zinc-900 border border-purple-500/50 space-y-4 text-center">
                <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  Slide 13: Physical Flashing Cycle Active
                </div>

                {/* Simulated Lock LED Circle */}
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <div
                    className={`w-16 h-16 rounded-full border-4 transition-colors duration-200 flex items-center justify-center shadow-2xl ${
                      simLedColor === 'green'
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-emerald-500/50'
                        : 'bg-red-500/30 border-red-500 text-red-300 shadow-red-500/50'
                    }`}
                  >
                    <Radio className="w-8 h-8 animate-spin" />
                  </div>
                  <span className="text-xs font-bold font-mono">
                    Lock LED: {simLedColor === 'green' ? '🟢 GREEN' : '🔴 RED'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                  The Lock will blink Green and Red for approximately 5 - 10 min. (Fast simulated: {simBlinkTimer}s remaining).
                  <br />
                  <strong className="text-amber-400">Do NOT remove batteries or operate the lock!</strong>
                </div>
              </div>
            )}

            {/* Sim Step 6: Completion */}
            {simStep === 6 && (
              <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Firmware Update Complete!</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The lock has rebooted into firmware build <strong className="text-white">v05.20.03</strong>.
                  Telemetry synchronized with Quext Cloud.
                </p>
                <button
                  type="button"
                  onClick={handleResetSim}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Test Another Lock
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Troubleshooting */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Troubleshooting FAQ &amp; Field Support (Slide 14)</span>
            </h3>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="font-bold text-white block">
                  Q: I don't see my invite to the app or credentials I need? (Slide 14)
                </span>
                <p className="text-zinc-400 leading-relaxed">
                  Contact Quext Support! They can assist with getting you back on track with login issues and missing credentials! Email: <strong className="text-purple-300">support@onequext.com</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="font-bold text-white block">
                  Q: What if the phone screen auto-locks during upload?
                </span>
                <p className="text-zinc-400 leading-relaxed">
                  The OS suspends background Bluetooth connections. Verify screen auto-lock is set to "Never", reopen Quext IoT Admin, select the lock, and restart from the three-dots menu.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="font-bold text-white block">
                  Q: Why does the lock take longer to update?
                </span>
                <p className="text-zinc-400 leading-relaxed">
                  As noted on Slide 13: "This ultimately depends on how old the current firmware the lock was previously on; expect longer times if the firmware is older." Allow the full 10 minutes for older builds.
                </p>
              </div>
            </div>

            {/* Email Support Dispatch Box */}
            <div className="mt-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-purple-200">
                <strong className="text-white block">Quext Field Engineering Support</strong>
                Email: <span className="text-purple-300 font-mono">support@onequext.com</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('support@onequext.com');
                  setCopiedTemplate(true);
                  setTimeout(() => setCopiedTemplate(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Copied' : 'Copy Support Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isSlideLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-white">
            <span className="font-mono text-sm font-bold">
              Slide {currentSlide.slideNumber} of {LOCK_FIRMWARE_SLIDES.length}: {currentSlide.title}
            </span>
            <button
              type="button"
              onClick={() => setIsSlideLightboxOpen(false)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <button
              type="button"
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-bold text-white cursor-pointer"
            >
              Previous Slide
            </button>
            <button
              type="button"
              disabled={currentSlideIndex === LOCK_FIRMWARE_SLIDES.length - 1}
              onClick={() => setCurrentSlideIndex((prev) => Math.min(LOCK_FIRMWARE_SLIDES.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-bold text-white cursor-pointer"
            >
              Next Slide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
