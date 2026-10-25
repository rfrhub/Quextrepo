import React, { useState } from 'react';
import { 
  WALLET_GUIDE_PAGES, 
  WALLET_GUIDE_METADATA, 
  WalletGuidePage 
} from '../data/walletGuideData';
import { generateAndDownloadWalletPdf } from '../utils/generateWalletPdfGuide';
import {
  ProcessFlowIconsAsset,
  PreinstallChecklistAsset,
  DualPhoneSetupAsset,
  BatteryPackSchematicAsset,
  ScanConfigCardAsset,
  TestNfcHandshakeAsset,
  SyncMethodsTriadAsset,
  SchlageRcReaderAsset,
  RolloutToggleAsset,
  ResidentExperienceScreensAsset,
  AppleWatchAndIPhoneAsset,
  DeadPhoneReserveAsset
} from './WalletGuideAssets';
import { 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Smartphone, 
  Key, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  Maximize2, 
  Radio, 
  LifeBuoy, 
  Clock, 
  Battery, 
  CreditCard, 
  Sliders, 
  Check, 
  Users, 
  ArrowRight,
  ExternalLink,
  Laptop,
  BookOpen
} from 'lucide-react';

interface WalletUpgradeGuideProps {
  onOpenCourse?: (moduleId: string) => void;
  onSwitchToPortalGuide?: () => void;
}

export const WalletUpgradeGuide: React.FC<WalletUpgradeGuideProps> = ({
  onOpenCourse,
  onSwitchToPortalGuide
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single_page' | 'continuous_deck'>('single_page');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadTheme, setDownloadTheme] = useState<'dark' | 'white'>('dark');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const currentPage = WALLET_GUIDE_PAGES[currentPageIndex];
  const totalPages = WALLET_GUIDE_PAGES.length;

  const handleDownloadPdf = async (theme: 'dark' | 'white') => {
    setIsDownloading(true);
    setDownloadTheme(theme);
    try {
      // Short delay for UI spinner
      await new Promise((resolve) => setTimeout(resolve, 300));
      generateAndDownloadWalletPdf(theme);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  // Render Visual Section for each page in web viewer
  const renderPageVisual = (page: WalletGuidePage) => {
    switch (page.visualType) {
      // PAGE 1: COVER HERO
      case 'cover_hero':
        return (
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0e1322] via-[#090d16] to-[#170e28] border border-purple-900/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Title & Metadata */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  {page.sectionTag}
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Wallet Upgrade:
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">
                      Field Installation Guide
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-purple-300 font-mono tracking-wide">
                    {page.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                  {page.contentSummary}
                </p>

                {/* Phase Pills */}
                <div className="pt-4 flex flex-wrap gap-2.5">
                  {['PREP', 'CONFIG', 'VERIFY', 'SYNC'].map((ph) => (
                    <div
                      key={ph}
                      className="px-4 py-2 rounded-xl bg-[#131929] border border-zinc-700/80 text-xs font-bold text-zinc-200 shadow-sm flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      {ph}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Sleek Smartphone Render with Pass */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-64 sm:w-72 rounded-[2.5rem] bg-[#0c101a] p-3 border-2 border-zinc-700 shadow-2xl relative">
                  {/* Dynamic Island */}
                  <div className="w-24 h-4 bg-black rounded-full mx-auto mb-4" />

                  {/* Pass UI */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#2a134a] via-[#1a1130] to-[#0d091a] p-5 border border-purple-500/40 shadow-inner space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="border border-white/80 px-2 py-0.5 text-white font-extrabold text-[11px] rounded tracking-wider">
                        quext
                      </span>
                      <span className="text-[10px] text-purple-300 font-medium">Smart Pass</span>
                    </div>

                    <div className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-400 mx-auto flex items-center justify-center text-purple-300 animate-pulse">
                        <Radio className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-bold text-white mt-3">HOLD NEAR READER</p>
                      <p className="text-[10px] text-zinc-400">Unit 408 · Resident Key</p>
                    </div>

                    <div className="rounded-lg bg-black/40 p-2.5 border border-purple-500/20 text-center">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <Check className="w-3 h-3" /> Express Mode Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // PAGE 2: TECH REQUIREMENTS
      case 'tech_requirements':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.cards?.map((card, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#111728] border border-zinc-800 p-5 space-y-2 hover:border-purple-500/40 transition-colors shadow-sm"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    {card.tag}
                  </div>
                  <h3 className="text-sm font-bold text-white">{card.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>

            {/* Important Banner */}
            {page.importantNote && (
              <div className="rounded-xl bg-purple-950/40 border border-purple-500/40 p-4 sm:p-5 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    IMPORTANT MANDATORY PREREQUISITE
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 font-medium">
                    {page.importantNote}
                  </p>
                </div>
              </div>
            )}

            {/* Installation Flow Pipeline */}
            <div className="rounded-xl bg-[#0d1220] border border-zinc-800 p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Installation Flow Sequence
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { num: '01', label: 'TEST DEVICE' },
                  { num: '02', label: 'POWER CYCLE' },
                  { num: '03', label: 'SCAN ≤ 60 SEC' },
                  { num: '04', label: 'VERIFY NFC' },
                  { num: '05', label: 'SYNC & RETEST' }
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-[#151c30] border border-zinc-700/80"
                  >
                    <span className="w-6 h-6 rounded bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-bold text-white truncate">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // PAGE 3: PROCESS OVERVIEW
      case 'process_flow':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {page.title}
              </h2>
              <p className="text-sm text-zinc-300">
                {page.subtitle}
              </p>
            </div>
            {/* Restored 4-step sequence icons from original document */}
            <ProcessFlowIconsAsset />
          </div>
        );

      // PAGE 4: PREINSTALL CHECKLIST
      case 'preinstall_checklist':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {page.title}
              </h2>
              <p className="text-sm text-zinc-300">
                {page.subtitle}
              </p>
            </div>
            {/* Restored 3-card checklist assets without white backgrounds */}
            <PreinstallChecklistAsset />
          </div>
        );

      // PAGE 5: SETUP DEVICE
      case 'setup_device':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-white">{page.title}</h2>
                  <p className="text-xs text-zinc-400">{page.subtitle}</p>
                </div>

                {page.importantNote && (
                  <div className="rounded-xl bg-purple-950/40 border border-purple-500/40 p-4 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                    <p className="text-xs font-semibold text-purple-200">{page.importantNote}</p>
                  </div>
                )}

                <div className="space-y-2.5">
                  {page.steps?.map((step, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#0f1526] border border-zinc-800 flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.number}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{step.title}</h4>
                        <p className="text-xs text-zinc-300 mt-0.5">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restored dual phone mockup asset */}
              <div className="lg:col-span-6">
                <DualPhoneSetupAsset />
              </div>
            </div>
          </div>
        );

      // PAGE 6: POWER CYCLE LOCK
      case 'power_cycle_lock':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-white">{page.title}</h2>
                  <p className="text-xs text-zinc-400">{page.subtitle}</p>
                </div>

                <div className="space-y-3">
                  {page.steps?.map((step, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#0f1526] border border-zinc-800 flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        <p className="text-xs text-zinc-300 mt-1">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {page.importantNote && (
                  <div className="p-3.5 rounded-xl bg-[#161224] border border-purple-900/50 text-xs text-purple-300">
                    {page.importantNote}
                  </div>
                )}
              </div>

              {/* Restored battery pack line-drawing schematic */}
              <div className="lg:col-span-5">
                <BatteryPackSchematicAsset />
              </div>
            </div>
          </div>
        );

      // PAGE 7: SCAN CONFIG CARD
      case 'scan_config_card':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-white">{page.title}</h2>
                  <p className="text-xs text-zinc-400">{page.subtitle}</p>
                </div>

                {page.importantNote && (
                  <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/50 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-400 shrink-0" />
                    <p className="text-xs font-bold text-purple-200">{page.importantNote}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {page.steps?.map((step, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#0f1526] border border-zinc-800 flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        <p className="text-xs text-zinc-300 mt-1">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restored card tap & 60-second timer illustration */}
              <div className="lg:col-span-5">
                <ScanConfigCardAsset />
              </div>
            </div>
          </div>
        );

      // PAGE 8: TEST NFC RESPONSE
      case 'test_nfc_response':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-white">{page.title}</h2>
                  <p className="text-xs text-zinc-400">{page.subtitle}</p>
                </div>

                {page.importantNote && (
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200">
                    {page.importantNote}
                  </div>
                )}

                <div className="space-y-3">
                  {page.steps?.map((step, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#0f1526] border border-zinc-800 flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        <p className="text-xs text-zinc-300 mt-1">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restored NFC Handshake test graphic */}
              <div className="lg:col-span-5">
                <TestNfcHandshakeAsset />
              </div>
            </div>
          </div>
        );

      // PAGE 9: SYNC CREDENTIALS
      case 'sync_credentials':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{page.title}</h2>
              <p className="text-sm text-zinc-300">{page.subtitle}</p>
            </div>

            {/* Restored Product Triad Asset: Thermostat Hub, Smart Lock, & Quext App */}
            <SyncMethodsTriadAsset />

            {page.importantNote && (
              <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-5 flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    FINAL OPERATIONAL TEST
                  </div>
                  <p className="text-sm font-semibold text-white mt-0.5">{page.importantNote}</p>
                </div>
              </div>
            )}
          </div>
        );

      // PAGE 10: HANDLING RCS
      case 'handling_rcs':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-white">{page.title}</h2>
                  <p className="text-xs text-zinc-400">{page.subtitle}</p>
                </div>

                <div className="space-y-3">
                  {page.steps?.map((step, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[#0f1526] border border-zinc-800 flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        <p className="text-xs text-zinc-300 mt-1">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restored Schlage RC Reader Controller graphic with pigtail harness */}
              <div className="lg:col-span-5">
                <SchlageRcReaderAsset />
              </div>
            </div>
          </div>
        );

      // PAGE 11: ROLLING OUT TO RESIDENTS
      case 'rolling_out_residents':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{page.title}</h2>
              <p className="text-sm text-zinc-300">{page.subtitle}</p>
            </div>

            {/* Restored Off/On Toggle Switch Asset */}
            <RolloutToggleAsset />

            {page.importantNote && (
              <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-4 sm:p-5 flex items-center gap-3.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-xs sm:text-sm font-bold text-rose-200">{page.importantNote}</p>
              </div>
            )}

            <div className="space-y-3">
              {page.steps?.map((step, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#0f1526] border border-zinc-800 flex items-start gap-3.5"
                >
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.number}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{step.title}</h4>
                    <p className="text-xs text-zinc-300 mt-1">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // PAGE 12: RESIDENT EXPERIENCE
      case 'resident_experience':
        return (
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{page.title}</h2>
              <p className="text-sm text-zinc-300">{page.subtitle}</p>
            </div>

            {/* Restored 4-stage mobile user journey screens */}
            <ResidentExperienceScreensAsset />
          </div>
        );

      // PAGE 13: FEATURE OVERVIEW
      case 'feature_overview':
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{page.title}</h2>
              <p className="text-sm text-zinc-300">{page.subtitle}</p>
            </div>

            {/* Restored Apple Watch & iPhone Showcase */}
            <AppleWatchAndIPhoneAsset />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {page.cards?.map((card, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#0f1526] border border-zinc-800 p-4 space-y-1.5 hover:border-purple-500/40 transition-colors shadow-sm"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    {card.tag}
                  </div>
                  <h3 className="text-sm font-bold text-white">{card.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // PAGE 14: FEATURE SPOTLIGHT POWER
      case 'feature_spotlight_power':
        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#0c1122] via-[#090d16] to-[#1a0f2e] border border-purple-900/40 p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Dead phone friendly
                </h2>
                <p className="text-base sm:text-lg font-semibold text-purple-300">
                  Express mode works for up to 5 hours while in power reserve.
                </p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Residents can unlock doors safely even if their device battery drains during the day. Apple &amp; Google NFC secure elements maintain reserve power specifically for access keys.
                </p>
              </div>

              {/* Restored low battery screen with red icon */}
              <div className="lg:col-span-5">
                <DeadPhoneReserveAsset />
              </div>
            </div>
          </div>
        );

      // PAGE 15: HARDWARE GALLERY
      case 'hardware_gallery':
        return (
          <div className="rounded-2xl bg-[#090d16] border border-zinc-800 p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative mx-auto w-72 sm:w-80 h-80 rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl bg-black">
                <img
                  src="/assets/aistudio/image_e90dca56.png"
                  alt="Schlage Control Smart Deadbolt (BE467 / FE410)"
                  className="w-full h-full object-contain p-4 bg-zinc-950"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest font-mono">
                    OFFICIAL HARDWARE
                  </span>
                  <div className="text-sm font-extrabold text-white">
                    Schlage Control Smart Deadbolt (BE467 / FE285)
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Architectural Lock Showcase</h3>
                <p className="text-xs text-zinc-400 max-w-lg mx-auto">
                  Commercial Grade 1 smart deadbolt with integrated Allegion NFC secure element and Bluetooth Low Energy transceiver.
                </p>
              </div>
            </div>
          </div>
        );

      // PAGE 16: TROUBLESHOOTING
      case 'troubleshooting_matrix':
        return (
          <div className="space-y-4">
            {page.troubleshooting?.map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-[#111728] border border-zinc-800 p-5 space-y-3 hover:border-purple-500/40 transition-colors shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase shrink-0">
                    ISSUE
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.issue}</h4>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-zinc-800/80">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase shrink-0">
                    FIX
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.fix}</p>
                </div>
              </div>
            ))}
          </div>
        );

      // PAGE 17: BACK COVER
      case 'back_cover':
        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#1b1035] via-[#0d0918] to-[#1f0e38] border border-purple-600/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <div className="inline-block border-2 border-white px-4 py-1 text-white font-extrabold text-lg rounded">
              quext
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Need help?</h2>
            <p className="text-base sm:text-lg text-purple-300 max-w-md mx-auto">
              Chat with support any time using the Quext apps.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <div className="px-6 py-4 rounded-xl bg-black/40 border border-purple-500/30 text-left">
                <div className="text-[10px] font-bold text-purple-400">ONLINE KNOWLEDGE BASE</div>
                <div className="text-sm font-bold text-white mt-0.5">help.quext.io</div>
              </div>
              <div className="px-6 py-4 rounded-xl bg-black/40 border border-purple-500/30 text-left">
                <div className="text-[10px] font-bold text-purple-400">FIELD INSTALLER HOTLINE</div>
                <div className="text-sm font-bold text-white mt-0.5">support@onequext.com</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card & Download Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {WALLET_GUIDE_METADATA.reference} · {WALLET_GUIDE_METADATA.version}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {WALLET_GUIDE_METADATA.documentTitle}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Reworked 17-page field installation manual in pure Quext dark mode with zero white backgrounds and high-definition vector typography.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Launch Field Course Module */}
          {onOpenCourse && (
            <button
              onClick={() => onOpenCourse('mod_nfc_wallet')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-blue-900/50 border border-purple-500/50 hover:border-purple-400 text-xs font-bold text-purple-200 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:text-white"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Launch Field Course</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'single_page' ? 'continuous_deck' : 'single_page')}
            className="px-3.5 py-2 rounded-xl bg-[#111728] border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-white transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{viewMode === 'single_page' ? 'All 17 Slides Deck' : 'Single Slide View'}</span>
          </button>

          {/* Download Dark PDF */}
          <button
            onClick={() => handleDownloadPdf('dark')}
            disabled={isDownloading}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-50"
          >
            {isDownloading && downloadTheme === 'dark' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download Dark PDF (.pdf)</span>
          </button>

          {/* Download White PDF */}
          <button
            onClick={() => handleDownloadPdf('white')}
            disabled={isDownloading}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Download White PDF</span>
          </button>
        </div>
      </div>

      {/* SINGLE PAGE SLIDE VIEW */}
      {viewMode === 'single_page' && (
        <div className="space-y-6">
          {/* Slide Navigation Bar */}
          <div className="flex items-center justify-between bg-[#0a0e18] border border-zinc-800 rounded-xl p-3 px-4 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono font-bold text-zinc-300">
                Slide <span className="text-purple-400">{currentPageIndex + 1}</span> of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPageIndex === totalPages - 1}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-bold text-purple-300 hidden sm:block truncate max-w-xs">
              {currentPage.title}
            </div>

            {/* Quick Page Picker Pill Bar */}
            <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-md py-1">
              {WALLET_GUIDE_PAGES.map((pg, idx) => (
                <button
                  key={pg.id}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    currentPageIndex === idx
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Page Card Display (Zero White Backgrounds) */}
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
                WALLET UPGRADE • FIELD GUIDE • {currentPageIndex + 1 < 10 ? `0${currentPageIndex + 1}` : currentPageIndex + 1}
              </div>
            </div>

            {/* Render Current Page Visual */}
            {renderPageVisual(currentPage)}
          </div>
        </div>
      )}

      {/* CONTINUOUS DECK VIEW (All 17 Slides in High-Def Dark Grid) */}
      {viewMode === 'continuous_deck' && (
        <div className="space-y-8">
          {WALLET_GUIDE_PAGES.map((page, idx) => (
            <div
              key={page.id}
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
                  SLIDE {idx + 1} OF {totalPages}
                </div>
              </div>

              {renderPageVisual(page)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
