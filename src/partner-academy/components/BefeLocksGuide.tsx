import React, { useState, useRef } from 'react';
import {
  Download,
  BookOpen,
  Volume2,
  VolumeX,
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
} from 'lucide-react';
import {
  BEFE_GUIDE_METADATA,
  BEFE_TECHNICAL_SPECS,
  BEFE_AUDITORY_CODES,
  BEFE_GUIDE_STAGES,
  BEFE_GUIDE_STEPS,
  BefeGuideStep,
} from '../data/befeGuideData';
import { generateAndDownloadBefePdf } from '../utils/generateBefePdfGuide';
import befeLockPhoto from '../assets/images/schlage_befe_control_lock_interior.png';

export const BefeLocksGuide: React.FC<{
  onOpenCourse?: (moduleId: string) => void;
}> = ({ onOpenCourse }) => {
  const [selectedStage, setSelectedStage] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [downloadDropdown, setDownloadDropdown] = useState<boolean>(false);

  // Audio tone playback state
  const [playingTone, setPlayingTone] = useState<string | null>(null);

  // Interactive FDR simulator state
  const [fdrBatteryRemoved, setFdrBatteryRemoved] = useState<boolean>(false);
  const [fdrCountdown, setFdrCountdown] = useState<number | null>(null);
  const [fdrBatteryReplaced, setFdrBatteryReplaced] = useState<boolean>(false);
  const [thumbturnCount, setThumbturnCount] = useState<number>(0);
  const [fdrSuccess, setFdrSuccess] = useState<boolean>(false);
  const [thumbturnAngle, setThumbturnAngle] = useState<number>(0);
  const countdownIntervalRef = useRef<any>(null);

  // Web Audio tone synthesizer for authentic auditory feedback
  const playAuditoryTone = (type: 'single_beep' | 'success_fdr' | 'error_rapid' | 'jam_beep') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      setPlayingTone(type);

      const now = ctx.currentTime;

      if (type === 'single_beep') {
        // Single power-up beep ~1320 Hz, 220ms
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1320, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        setTimeout(() => setPlayingTone(null), 300);
      } else if (type === 'success_fdr') {
        // 2 Short Beeps (~1760 Hz, 100ms each) + 1 Long Beep (~1760 Hz, 600ms)
        // Beep 1
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.frequency.setValueAtTime(1760, now);
        gain1.gain.setValueAtTime(0.25, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.1);

        // Beep 2 (offset 160ms)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.setValueAtTime(1760, now + 0.16);
        gain2.gain.setValueAtTime(0.25, now + 0.16);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.16);
        osc2.stop(now + 0.26);

        // Long Beep (offset 360ms, duration 600ms)
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.frequency.setValueAtTime(1760, now + 0.36);
        gain3.gain.setValueAtTime(0.3, now + 0.36);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.96);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.36);
        osc3.stop(now + 0.96);

        setTimeout(() => setPlayingTone(null), 1100);
      } else if (type === 'error_rapid') {
        // 3 rapid low beeps
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
      } else if (type === 'jam_beep') {
        // Repeating pulse
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + i * 0.12;
          osc.frequency.setValueAtTime(880, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.07);
        }
        setTimeout(() => setPlayingTone(null), 600);
      }
    } catch (e) {
      console.warn('Audio playback not supported:', e);
      setPlayingTone(null);
    }
  };

  // Interactive FDR Sandbox Handlers
  const handleRemoveBattery = () => {
    setFdrBatteryRemoved(true);
    setFdrBatteryReplaced(false);
    setThumbturnCount(0);
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
      playAuditoryTone('error_rapid');
      alert('Capacitor discharge incomplete! You must wait the full 5-10 seconds before reinserting the battery.');
      return;
    }
    setFdrBatteryReplaced(true);
    playAuditoryTone('single_beep');
  };

  const handleTurnThumbturn = () => {
    if (!fdrBatteryReplaced) {
      alert('You must pull the battery, wait 10 seconds, and reinsert before turning the thumbturn.');
      return;
    }
    const newAngle = thumbturnAngle + 90;
    setThumbturnAngle(newAngle);
    const newCount = thumbturnCount + 1;
    setThumbturnCount(newCount);

    if (newCount === 2) {
      setFdrSuccess(true);
      playAuditoryTone('success_fdr');
    }
  };

  const handleResetFdrSimulator = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setFdrBatteryRemoved(false);
    setFdrCountdown(null);
    setFdrBatteryReplaced(false);
    setThumbturnCount(0);
    setFdrSuccess(false);
    setThumbturnAngle(0);
  };

  const handleToggleComplete = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleCopySupportTemplate = () => {
    const template = `TO: support@onequext.com
SUBJECT: Urgent Lock Deletion & Cloud Clearance Request - [Community Name]

Hello Quext Support,

Please dissociate the following smart deadbolt from the property database so we can re-pair it in the field:

• Community Name: [Enter Community]
• Building & Unit: [e.g. Building 2, Unit 204]
• Lock Model: Schlage Control BE467 Deadbolt / FE410 Interconnected
• Serial Number / Barcode: [Enter 10-digit serial]
• Reason for Deletion: [Unit Transfer / Replacement / Setup Lockout]
• Field Installer Name: [Your Name]
• Field Installer ID: [Your Field ID]

Thank you,
Field Installation Team`;

    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 3000);
  };

  // Filter steps
  const filteredSteps = BEFE_GUIDE_STEPS.filter((step) => {
    const matchesStage = selectedStage === 'all' || step.stageNumber === selectedStage;
    const matchesQuery =
      searchQuery.trim() === '' ||
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.instructions.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStage && matchesQuery;
  });

  const totalSteps = BEFE_GUIDE_STEPS.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="space-y-8 pb-16 text-zinc-100">
      {/* Top Banner & Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#120f26] via-[#090b14] to-[#06070a] border border-purple-900/40 p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Glow ambient circle */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-mono font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                Official Field Manual · QXT-GUIDE-BEFE-REV4
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Schlage Control BE467 / FE410
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              BE / FE Smart Deadbolts &amp; Cylindrical Locks
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 mt-2 leading-relaxed">
              Complete step-by-step field guide for mobile phone setup, hardware installation, the 2-turn thumbturn capacitor discharge Factory Default Reset (FDR), and the mandatory Quext Cloud Deletion Protocol.
            </p>

            {/* Checklist Progress Bar */}
            <div className="mt-5 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-zinc-300">Field Checklist Completion:</span>
                <span className="font-mono text-purple-400 font-bold">
                  {completedCount} of {totalSteps} steps ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden border border-zinc-700/50">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
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
                <span>Download PDF Guide</span>
                <ChevronDown className={`w-3.5 h-3.5 text-purple-200 transition-transform duration-200 ${downloadDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Backdrop dismiss */}
              {downloadDropdown && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDownloadDropdown(false)}
                />
              )}

              {/* Dropdown Menu */}
              {downloadDropdown && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 bg-[#0c0e17] border border-zinc-700 rounded-2xl shadow-2xl shadow-black/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs"
                >
                  <div className="px-3 py-1.5 border-b border-zinc-800/80 mb-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
                      Select Download Format
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      generateAndDownloadBefePdf({ theme: 'white', format: 'letter' });
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
                        Clean white background formatted for physical printing &amp; clipboard
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      generateAndDownloadBefePdf({ theme: 'dark', format: 'letter' });
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
                      generateAndDownloadBefePdf({ theme: 'dark', format: 'mobile' });
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
                        Single-column 9:16 layout optimized for iPhone &amp; Android without pinching/zooming
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Link to Course */}
            {onOpenCourse && (
              <button
                onClick={() => onOpenCourse('mod_befe_locks')}
                className="px-5 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Study Full BE/FE Course</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hardware Profile & Interactive FDR Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hardware Visual & Specs Card */}
        <div className="lg:col-span-5 bg-[#090b12] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-purple-400" />
                Hardware Profile &amp; Escutcheon
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 rounded-md">
                BE467 / FE410
              </span>
            </div>

            {/* Hardware photo */}
            <div className="mt-4 relative group rounded-2xl overflow-hidden border border-zinc-800 bg-[#06080d] flex items-center justify-center p-4">
              <img
                src={befeLockPhoto}
                alt="Schlage Control BE467 / FE410 Smart Lock Interior & Thumbturn"
                className="w-full max-h-[260px] object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md rounded-xl p-2.5 border border-white/10 text-xs">
                <div className="font-bold text-white text-[12px]">
                  Schlage Control Smart Lock (BE467 / FE410)
                </div>
                <div className="text-[10px] text-zinc-400">
                  Architectural satin nickel interior housing with mechanical thumbturn lever and Schlage branded escutcheon.
                </div>
              </div>
            </div>

            {/* Specifications Matrix */}
            <div className="mt-4 space-y-2 text-xs">
              {BEFE_TECHNICAL_SPECS.slice(0, 5).map((spec, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80"
                >
                  <span className="text-zinc-400">{spec.label}</span>
                  <span className="font-mono text-zinc-200 font-semibold text-right max-w-[210px] truncate">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Battery: Strictly use 4x AA alkaline cells. Avoid rechargeable NiMH or lithium cells.</span>
          </div>
        </div>

        {/* Interactive FDR & Auditory Beep Simulator */}
        <div className="lg:col-span-7 bg-[#090b12] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Interactive 2-Turn Thumbturn FDR Simulator
                </span>
              </div>
              <button
                onClick={handleResetFdrSimulator}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Lab</span>
              </button>
            </div>

            <p className="text-xs text-zinc-400 mt-2">
              Practice the capacitor discharge and rapid 2-turn thumbturn sequence before touching the door in the field.
            </p>

            {/* Interactive Step-by-Step Simulator Panel */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Action 1: Battery Pull */}
              <div
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  fdrBatteryRemoved
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200'
                    : 'border-zinc-800 bg-zinc-900/70 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">
                  Step 1: Power Off
                </div>
                <div className="text-xs font-bold text-white mb-2">Remove 1 Battery</div>
                <button
                  disabled={fdrBatteryRemoved}
                  onClick={handleRemoveBattery}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    fdrBatteryRemoved
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95'
                  }`}
                >
                  {fdrBatteryRemoved ? '✓ Battery Pulled' : 'Pull 1 Battery'}
                </button>
                {fdrCountdown !== null && (
                  <div className="mt-2 text-[10px] font-mono">
                    {fdrCountdown > 0 ? (
                      <span className="text-amber-400 font-bold">Drain: {fdrCountdown}s remaining</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">✓ Capacitors Discharged</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action 2: Reinsert & Listen */}
              <div
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  fdrBatteryReplaced
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200'
                    : 'border-zinc-800 bg-zinc-900/70 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">
                  Step 2: Power Up
                </div>
                <div className="text-xs font-bold text-white mb-2">Reinsert Battery</div>
                <button
                  disabled={!fdrBatteryRemoved || fdrBatteryReplaced || (fdrCountdown !== null && fdrCountdown > 0)}
                  onClick={handleReinsertBattery}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    fdrBatteryReplaced
                      ? 'bg-emerald-600 text-white cursor-default'
                      : !fdrBatteryRemoved || (fdrCountdown !== null && fdrCountdown > 0)
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95'
                  }`}
                >
                  {fdrBatteryReplaced ? '✓ 1 Beep Heard' : 'Reinsert Battery'}
                </button>
                <div className="mt-2 text-[10px] text-zinc-400">
                  {fdrBatteryReplaced ? 'Listen for power-up tone' : 'Wait for 0s countdown'}
                </div>
              </div>

              {/* Action 3: Turn Thumbturn Twice */}
              <div
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  fdrSuccess
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200 ring-2 ring-emerald-500/30'
                    : 'border-zinc-800 bg-zinc-900/70 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">
                  Step 3: Reset Action
                </div>
                <div className="text-xs font-bold text-white mb-2">
                  Rotate Thumbturn (x2)
                </div>
                <button
                  disabled={!fdrBatteryReplaced || fdrSuccess}
                  onClick={handleTurnThumbturn}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    fdrSuccess
                      ? 'bg-emerald-600 text-white cursor-default'
                      : !fdrBatteryReplaced
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white active:scale-95'
                  }`}
                >
                  {fdrSuccess
                    ? '✓ Reset Complete!'
                    : `Turn Thumbturn (${thumbturnCount}/2)`}
                </button>
                <div className="mt-2 text-[10px] text-zinc-400">
                  {fdrSuccess ? '2 Short + 1 Long Beep!' : 'Turn twice rapidly within 2s'}
                </div>
              </div>
            </div>

            {/* Thumbturn Visual Graphic */}
            <div className="mt-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mechanical Thumbturn Representation */}
                <div
                  className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center transition-transform duration-300 shadow-inner"
                  style={{ transform: `rotate(${thumbturnAngle}deg)` }}
                >
                  <div className="w-2.5 h-10 bg-amber-400 rounded-full shadow" />
                </div>

                <div>
                  <div className="text-xs font-bold text-white">
                    Interior Mechanical Thumbturn
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Current Rotations: <span className="font-mono text-cyan-400 font-bold">{thumbturnCount} of 2</span>
                  </div>
                </div>
              </div>

              {fdrSuccess ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl animate-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>FDR Successful!</span>
                </div>
              ) : (
                <div className="text-[11px] text-zinc-500 font-mono">
                  Pending Execution
                </div>
              )}
            </div>
          </div>

          {/* Auditory Code Synthesizer Bar */}
          <div className="mt-5 pt-4 border-t border-zinc-800">
            <div className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>Auditory Confirmation Tone Synthesizer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BEFE_AUDITORY_CODES.map((code, idx) => (
                <button
                  key={idx}
                  onClick={() => playAuditoryTone(code.audioToneType)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    playingTone === code.audioToneType
                      ? 'border-purple-400 bg-purple-950/50 ring-2 ring-purple-400 shadow-md'
                      : 'border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-purple-400">{code.visualGraphic}</span>
                      <span>{code.sequence}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 leading-tight mt-0.5 line-clamp-1">
                      {code.meaning}
                    </div>
                  </div>

                  <span className="p-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white shrink-0 ml-2">
                    <Play className="w-3 h-3 text-cyan-400" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Deletion Protocol Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/50 via-zinc-950 to-purple-950/40 border-2 border-rose-600/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Critical OEM Rule · Mandatory Deletion Protocol</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
              Deleting a Lock in Quext App Requires Cloud Dissociation
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
              Whenever you delete a lock from the Quext app, you <span className="font-bold text-white underline decoration-rose-500">must reach out to Quext Support</span> to receive assistance in fully clearing out the lock from the system before you can continue using that same lock in the app.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <div className="px-3 py-1 rounded-lg bg-black/60 border border-zinc-800 text-zinc-300 font-mono">
                Recovery Loop: <span className="text-purple-300 font-bold">Delete in App → Email Support → Physical FDR → Re-Onboard</span>
              </div>
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
                  <span>Email Template Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-rose-400" />
                  <span>Copy Support Ticket Template</span>
                </>
              )}
            </button>
            <div className="text-[10px] text-zinc-400 text-center mt-2 font-mono">
              Direct line: support@onequext.com
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 sticky top-16 z-30 backdrop-blur-md">
        {/* Stage Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedStage === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            All Stages ({totalSteps})
          </button>
          {BEFE_GUIDE_STAGES.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedStage === st.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>Stage {st.id}</span>
              <span className="text-[10px] opacity-75 hidden md:inline">({st.badge})</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search instructions or tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Step-by-Step Cards Grid */}
      <div className="space-y-4">
        {filteredSteps.map((step) => {
          const isDone = !!completedSteps[step.id];

          return (
            <div
              key={step.id}
              className={`rounded-2xl border transition-all p-5 sm:p-6 ${
                isDone
                  ? 'bg-zinc-950/40 border-emerald-500/30'
                  : 'bg-[#090b12] border-zinc-800 hover:border-zinc-700/80 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Step Number Circle & Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(step.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-colors shrink-0 mt-0.5 cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/40'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-purple-500 hover:text-white'
                    }`}
                    title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    {isDone ? '✓' : step.stepNumber}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
                        Stage {step.stageNumber}: {step.stageTitle}
                      </span>
                      {step.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold mt-1 ${isDone ? 'line-through text-zinc-400' : 'text-white'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{step.summary}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleComplete(step.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  {isDone ? 'Completed' : 'Check Off'}
                </button>
              </div>

              {/* Instructions List */}
              <div className="mt-4 space-y-1.5 pl-10 text-xs text-zinc-300">
                {step.instructions.map((ins, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold shrink-0">•</span>
                    <span>{ins}</span>
                  </div>
                ))}
              </div>

              {/* Field Tips & Critical Warnings */}
              {(step.fieldTips || step.criticalWarning) && (
                <div className="mt-4 pt-3 border-t border-zinc-800/80 pl-10 space-y-2">
                  {step.fieldTips && step.fieldTips.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-purple-300 bg-purple-950/20 border border-purple-900/30 p-2.5 rounded-xl">
                      <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-300">Field Tip: </span>
                        {step.fieldTips[0]}
                      </div>
                    </div>
                  )}

                  {step.criticalWarning && (
                    <div className="flex items-start gap-2 text-xs text-rose-300 bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-rose-300">Critical Warning: </span>
                        {step.criticalWarning}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
