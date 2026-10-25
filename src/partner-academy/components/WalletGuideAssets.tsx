import React from 'react';
import { 
  Radio, 
  Smartphone, 
  Watch, 
  Battery, 
  Lock, 
  RefreshCw, 
  Check, 
  CreditCard, 
  Sliders, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Cpu,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Layers,
  Thermometer,
  Wifi,
  Bell,
  User,
  Key,
  Shield,
  Sparkles
} from 'lucide-react';

/**
 * High-fidelity vector and component assets extracted and restored from the original
 * Quext Wallet Upgrade Guide, enhanced with dark-theme integration (zero white backgrounds).
 * 
 * Features realistic iPhone hardware mockups with authentic titanium edges,
 * Dynamic Island, iOS status bar, and the exact Quext mobile app / Apple Wallet screens.
 */

// =========================================================================
// REUSABLE REALISTIC IPHONE HARDWARE MOCKUP (DARK THEME, NO WHITE BG)
// =========================================================================
export interface RealisticIPhoneProps {
  children: React.ReactNode;
  time?: string;
  glowColor?: string;
  showDynamicIsland?: boolean;
  className?: string;
  screenClassName?: string;
  tiltClass?: string;
  compact?: boolean;
}

export const RealisticIPhone: React.FC<RealisticIPhoneProps> = ({
  children,
  time = '9:41',
  glowColor = 'rgba(168, 85, 247, 0.15)',
  showDynamicIsland = true,
  className = 'w-60 sm:w-64',
  screenClassName,
  tiltClass = '',
  compact = false
}) => {
  const outerRounding = compact ? 'rounded-[2.2rem]' : 'rounded-[3rem]';
  const bezelRounding = compact ? 'rounded-[2rem] p-1.5' : 'rounded-[2.8rem] p-2.5';
  const screenRounding = compact ? 'rounded-[1.6rem]' : 'rounded-[2.2rem]';
  const defaultScreenMinH = compact ? 'min-h-[250px]' : 'min-h-[440px]';

  return (
    <div className={`relative select-none shrink-0 ${className} ${tiltClass}`}>
      {/* Outer ambient glow */}
      <div 
        className={`absolute -inset-2 ${outerRounding} opacity-70 blur-xl pointer-events-none transition-opacity`}
        style={{ background: glowColor }}
      />

      {/* Titanium Outer Chassis with Multi-Layer Bevel */}
      <div className={`w-full relative ${outerRounding} p-[2.5px] bg-gradient-to-b from-[#2d3748] via-[#1a202c] to-[#111622] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)_inset]`}>
        
        {/* Left Side Buttons (Volume Up, Down, Action Button) */}
        {!compact && (
          <>
            <div className="absolute -left-[4.5px] top-20 w-[3px] h-6 rounded-l-sm bg-zinc-600 shadow-sm" />
            <div className="absolute -left-[4.5px] top-32 w-[3px] h-11 rounded-l-sm bg-zinc-600 shadow-sm" />
            <div className="absolute -left-[4.5px] top-48 w-[3px] h-11 rounded-l-sm bg-zinc-600 shadow-sm" />
            <div className="absolute -right-[4.5px] top-28 w-[3px] h-14 rounded-r-sm bg-zinc-600 shadow-sm" />
          </>
        )}

        {/* Inner Black Bezel Layer */}
        <div className={`relative ${bezelRounding} bg-black overflow-hidden border border-zinc-800/80`}>
          
          {/* Glass Specular Reflection Highlight Across Screen */}
          <div className="absolute -top-12 -left-12 w-48 h-96 bg-gradient-to-br from-white/[0.07] to-transparent rotate-12 pointer-events-none z-30" />

          {/* Screen Container */}
          <div className={`relative ${screenRounding} bg-[#080c16] overflow-hidden flex flex-col justify-between ${screenClassName || defaultScreenMinH} text-zinc-100 z-10 border border-zinc-900`}>
            
            {/* Top iOS Status Bar */}
            <div className={`relative ${compact ? 'px-3 pt-1.5 pb-0.5 text-[9px]' : 'px-5 pt-3 pb-1 text-[11px]'} font-semibold text-zinc-300 z-20 flex items-center justify-between`}>
              {/* Time */}
              <span className="tracking-tight font-medium text-white">{time}</span>

              {/* Dynamic Island */}
              {showDynamicIsland && (
                <div className={`absolute left-1/2 -translate-x-1/2 ${compact ? 'top-1.5 w-[52px] h-[15px] px-1.5' : 'top-2.5 w-[76px] h-[22px] px-2.5'} bg-black rounded-full flex items-center justify-between border border-zinc-800/60 shadow-inner z-30`}>
                  <div className={`${compact ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'} rounded-full bg-[#0a0f18] border border-zinc-800 flex items-center justify-center`}>
                    <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                  </div>
                  <div className={`${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-[#070b12]`} />
                </div>
              )}

              {/* Status Icons: Cellular, Wifi, Battery */}
              <div className="flex items-center gap-1 text-zinc-200">
                {/* Cellular Signal Bars */}
                <div className="flex items-end gap-[1px] h-2">
                  <span className="w-[1.5px] h-1 bg-zinc-300 rounded-[0.5px]" />
                  <span className="w-[1.5px] h-1.5 bg-zinc-300 rounded-[0.5px]" />
                  <span className="w-[1.5px] h-2 bg-zinc-300 rounded-[0.5px]" />
                </div>
                {/* Wifi */}
                <Wifi className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-zinc-300`} />
                {/* Battery Pill */}
                <div className={`${compact ? 'w-3.5 h-2' : 'w-4 h-2.5'} rounded-[2px] border border-zinc-300 p-[1px] flex items-center`}>
                  <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Screen Custom Content */}
            <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
              {children}
            </div>

            {/* Bottom iOS Home Indicator Bar */}
            <div className={`${compact ? 'py-1' : 'py-2'} flex justify-center z-20 shrink-0`}>
              <div className={`${compact ? 'w-16 h-0.5' : 'w-24 h-1'} rounded-full bg-white/40`} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// ASSET 1: PROCESS FLOW 4-ICON SEQUENCE (PAGE 3)
// =========================================================================
export const ProcessFlowIconsAsset: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Prep',
      desc: 'Enable Wallet for installer or test resident',
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-[#1b1536] border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      )
    },
    {
      num: '02',
      title: 'Config',
      desc: 'Power cycle hardware & scan config card',
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-[#1b1536] border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )
    },
    {
      num: '03',
      title: 'Verify',
      desc: 'Test NFC reaction with smartphone wallet',
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-[#1b1536] border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg">
          <Smartphone className="w-7 h-7 text-purple-400" />
        </div>
      )
    },
    {
      num: '04',
      title: 'Sync',
      desc: 'Update lock tables via Hub or Quext App',
      icon: (
        <div className="w-14 h-14 rounded-2xl bg-[#1b1536] border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg">
          <RefreshCw className="w-7 h-7 text-purple-400" />
        </div>
      )
    }
  ];

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
        {steps.map((st, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#0e1424] border border-zinc-800/90 p-6 flex flex-col items-center text-center space-y-4 hover:border-purple-500/50 transition-all shadow-xl group"
          >
            <div className="relative">
              {st.icon}
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                {st.num}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                {st.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-[180px]">
                {st.desc}
              </p>
            </div>

            {idx < 3 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                <ArrowRight className="w-5 h-5 text-purple-500/60" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// ASSET 2: PREINSTALL CHECKLIST 3-ITEM CARDS (PAGE 4)
// =========================================================================
export const PreinstallChecklistAsset: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
      {/* 1. NFC Configuration Card */}
      <div className="rounded-2xl bg-[#0e1424] border border-zinc-800 p-6 flex flex-col items-center text-center space-y-4 shadow-xl hover:border-purple-500/40 transition-colors">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2a1347] to-[#120a22] border-2 border-purple-500/50 p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center text-[9px] text-purple-300 font-extrabold">
            <span>QUEXT</span>
            <Radio className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <div className="w-8 h-5 rounded bg-amber-400/90 my-auto shadow-sm flex items-center px-1">
            <div className="w-2 h-2 rounded-full border border-amber-600/60" />
          </div>
          <div className="text-[7.5px] text-purple-200 font-mono text-left tracking-wide">
            CONFIG · ALLEGION
          </div>
        </div>
        <div className="space-y-1.5">
          <h4 className="text-base font-bold text-white">NFC Configuration Card</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Commissioned by Allegion specifically for this property. If missing, contact Quext support immediately.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-[10px] font-bold text-purple-300">
          Cryptographic Domain Card
        </span>
      </div>

      {/* 2. Supported Hardware */}
      <div className="rounded-2xl bg-[#0e1424] border border-zinc-800 p-6 flex flex-col items-center text-center space-y-4 shadow-xl hover:border-purple-500/40 transition-colors">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1a233a] to-[#0c1220] border-2 border-purple-500/40 flex items-center justify-center text-purple-300 shadow-2xl">
          <Lock className="w-11 h-11" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-base font-bold text-white">Supported Hardware</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Confirm locks are supported Schlage models (Control BE467/FE285, NDEB, LEB) and approved by Quext.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-[10px] font-bold text-purple-300">
          Allegion Commercial & Resi
        </span>
      </div>

      {/* 3. Installer Credential */}
      <div className="rounded-2xl bg-[#0e1424] border border-zinc-800 p-6 flex flex-col items-center text-center space-y-4 shadow-xl hover:border-purple-500/40 transition-colors">
        <div className="w-24 h-24 rounded-2xl bg-black border-2 border-zinc-700 p-3 flex flex-col items-center justify-center space-y-2 shadow-2xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="text-[10px] font-extrabold text-white text-center leading-tight">
            Add to Apple Wallet
          </div>
        </div>
        <div className="space-y-1.5">
          <h4 className="text-base font-bold text-white">Installer Credential</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Your smartphone must have an active Wallet credential pass loaded before touching hardware.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-[10px] font-bold text-purple-300">
          Apple & Google Wallet Ready
        </span>
      </div>
    </div>
  );
};

// =========================================================================
// ASSET 3: DUAL IPHONE TESTING MOCKUP (PAGE 5 - SETUP YOUR TESTING DEVICE)
// =========================================================================
export const DualPhoneSetupAsset: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-6">
      {/* Phone 1: Generating Pass */}
      <div className="flex flex-col items-center space-y-3">
        <RealisticIPhone time="9:41" glowColor="rgba(168, 85, 247, 0.2)">
          {/* Quext App Header */}
          <div className="px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-purple-400 font-medium">&lt; Keys</span>
            <span className="font-bold text-white">Quext Access</span>
            <div className="w-5" />
          </div>

          {/* Screen Body */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="text-center space-y-1 pt-2">
              <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[9px] font-bold text-purple-300">
                TESTER SETUP
              </span>
              <h3 className="text-sm font-bold text-white">Installer Digital Pass</h3>
              <p className="text-[10px] text-zinc-400">Commissioning property-wide credentials</p>
            </div>

            {/* Glowing Card with Spinner */}
            <div className="my-auto rounded-2xl bg-gradient-to-br from-[#2a1347] via-[#1a0c2e] to-[#0f071c] p-4 border border-purple-500/50 shadow-2xl text-center space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="border border-white/80 px-1.5 py-0.5 text-white font-extrabold text-[9px] rounded tracking-tight">
                  quext
                </span>
                <span className="text-[9px] text-purple-300 font-medium">Field Master</span>
              </div>

              <div className="py-4">
                <div className="w-10 h-10 rounded-full border-2 border-purple-400 border-t-cyan-400 animate-spin mx-auto shadow-lg" />
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">Preparing your Wallet Pass...</p>
                <p className="text-[9px] text-purple-200/80">Signing with Apple servers</p>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 text-center font-mono">
              Allegion Cryptographic Domain
            </div>
          </div>
        </RealisticIPhone>
        <span className="text-xs font-bold text-purple-300">01 · Generating Installer Pass</span>
      </div>

      {/* Phone 2: Ready & Add to Apple Wallet */}
      <div className="flex flex-col items-center space-y-3">
        <RealisticIPhone time="9:41" glowColor="rgba(59, 130, 246, 0.25)">
          {/* Quext App Header */}
          <div className="px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-purple-400 font-medium">&lt; Keys</span>
            <span className="font-bold text-white">Quext Access</span>
            <div className="w-5" />
          </div>

          {/* Screen Body */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="text-center space-y-1 pt-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-bold text-emerald-300">
                CREDENTIAL READY
              </span>
              <h3 className="text-sm font-bold text-white">Ready for Hardware Testing</h3>
              <p className="text-[10px] text-zinc-400">Add pass to Apple Wallet</p>
            </div>

            {/* Glowing Active Card */}
            <div className="my-auto rounded-2xl bg-gradient-to-br from-[#3b126d] via-[#210940] to-[#120524] p-4 border border-purple-400/70 shadow-2xl text-center space-y-3">
              <div className="flex justify-between items-center">
                <span className="border border-white/80 px-1.5 py-0.5 text-white font-extrabold text-[9px] rounded tracking-tight">
                  quext
                </span>
                <span className="text-[9px] text-purple-200 font-medium">Field Master Key</span>
              </div>

              <div className="py-2 text-center">
                <Radio className="w-7 h-7 text-purple-300 mx-auto animate-pulse" />
                <div className="text-xs font-bold text-white mt-1">Property All-Access</div>
              </div>

              {/* Official Apple Wallet Button */}
              <div className="pt-1">
                <div className="w-full py-2.5 px-3 rounded-xl bg-black border border-zinc-700 text-[11px] font-bold text-white flex items-center justify-center gap-2 shadow-xl hover:border-zinc-500 cursor-pointer">
                  {/* Apple Icon */}
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.85-12.04-14.34-6.31-9.37-11.1-19.92-14.37-31.64-3.27-11.72-4.9-23.13-4.9-34.23 0-14.34 3.75-26.09 11.25-35.25 7.5-9.16 16.9-13.85 28.2-14.07 5.01 0 10.51 1.34 16.5 4.02 5.99 2.68 9.94 4.08 11.86 4.2 1.54 0 5.61-1.45 12.21-4.35 6.6-2.9 12.18-4.22 16.74-3.96 12.87.64 23.36 5.48 31.47 14.52-11.18 6.78-16.64 16.32-16.37 28.62.27 9.8 4.15 17.9 11.64 24.3 7.49 6.4 16.32 10.15 26.5 11.25-2.22 6.75-4.99 13.91-8.31 21.48zM119.22 31.86c0-7.72 2.76-14.94 8.28-21.66 5.52-6.72 12.44-10.74 20.76-12.06.32 1.37.48 2.74.48 4.11 0 7.72-2.87 15.05-8.61 22-5.74 6.95-12.72 10.82-20.91 11.61z" />
                  </svg>
                  <span>Add to Apple Wallet</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 text-center">
              Express Mode enables automatic tap-to-unlock
            </p>
          </div>
        </RealisticIPhone>
        <span className="text-xs font-bold text-emerald-400">02 · Pass Active in Wallet</span>
      </div>
    </div>
  );
};

// =========================================================================
// ASSET 4: LINE-ART BATTERY PACK SCHEMATIC (PAGE 6)
// =========================================================================
export const BatteryPackSchematicAsset: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#0b101c] border border-zinc-800 p-6 flex flex-col items-center shadow-xl">
      <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-4">
        HARDWARE REBOOT SCHEMATIC
      </div>

      {/* Lock Escutcheon Line Drawing on Dark Canvas */}
      <div className="relative w-56 sm:w-64 h-80 rounded-[2.5rem] bg-[#070b14] border-2 border-zinc-600 p-4 flex flex-col items-center justify-between shadow-2xl">
        {/* Top Screw Hole */}
        <div className="w-4 h-4 rounded-full border border-zinc-500 bg-zinc-800" />

        {/* 4 Battery Slots */}
        <div className="w-full bg-[#111728] border border-zinc-700 rounded-xl p-3 grid grid-cols-4 gap-2 relative">
          {/* Battery 1 */}
          <div className="h-28 rounded-lg bg-zinc-800/80 border border-zinc-600 flex flex-col justify-between items-center py-2 text-[10px] font-mono font-bold text-zinc-400">
            <span>+</span>
            <span className="text-[8px] rotate-[-90deg]">1.5V</span>
            <span>-</span>
          </div>

          {/* Battery 2: PULLED OUT WITH GLOWING ARROW */}
          <div className="h-28 rounded-lg bg-purple-950/80 border-2 border-purple-400 flex flex-col justify-between items-center py-2 text-[10px] font-mono font-bold text-purple-300 relative shadow-lg">
            <span>+</span>
            <span className="text-[8px] rotate-[-90deg]">1.5V</span>
            <span>-</span>

            {/* Glowing Arrow Pointing Up */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-cyan-400" />
              <div className="w-2.5 h-6 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            </div>
          </div>

          {/* Battery 3 */}
          <div className="h-28 rounded-lg bg-zinc-800/80 border border-zinc-600 flex flex-col justify-between items-center py-2 text-[10px] font-mono font-bold text-zinc-400">
            <span>-</span>
            <span className="text-[8px] rotate-[-90deg]">1.5V</span>
            <span>+</span>
          </div>

          {/* Battery 4 */}
          <div className="h-28 rounded-lg bg-zinc-800/80 border border-zinc-600 flex flex-col justify-between items-center py-2 text-[10px] font-mono font-bold text-zinc-400">
            <span>+</span>
            <span className="text-[8px] rotate-[-90deg]">1.5V</span>
            <span>-</span>
          </div>
        </div>

        {/* Bottom Screw Hole */}
        <div className="w-4 h-4 rounded-full border border-zinc-500 bg-zinc-800" />
      </div>

      <p className="text-xs text-zinc-300 mt-4 text-center font-medium">
        Remove 1 battery · Wait 5 seconds · Reinsert to initiate 60s config window
      </p>
    </div>
  );
};

// =========================================================================
// ASSET 5: CARD TAP & 60-SECOND TIMER (PAGE 7)
// =========================================================================
export const ScanConfigCardAsset: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#0b101c] border border-zinc-800 p-6 flex flex-col items-center shadow-xl relative overflow-hidden">
      {/* 60s Timer Badge Floating */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-xs font-bold text-purple-300 shadow-lg">
        <Clock className="w-4 h-4 text-purple-400" />
        <span>≤ 60 Seconds</span>
      </div>

      <div className="py-4 flex items-center justify-center relative w-full max-w-sm h-64">
        {/* Schlage Smart Deadbolt Outer Body */}
        <div className="w-36 h-52 rounded-3xl bg-[#141b2c] border-2 border-zinc-600 p-3 flex flex-col items-center justify-between shadow-2xl">
          <div className="text-[10px] font-bold text-zinc-400">SCHLAGE</div>
          {/* Circular Reader Lens */}
          <div className="w-20 h-20 rounded-full bg-[#0a0f1d] border-2 border-purple-500 flex items-center justify-center relative shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Radio className="w-8 h-8 text-purple-400 animate-pulse" />
            {/* NFC Waves */}
            <div className="absolute inset-0 rounded-full border border-purple-400/40 animate-ping pointer-events-none" />
          </div>
          <div className="w-6 h-10 rounded bg-zinc-700" />
        </div>

        {/* Purple NFC Config Card Tapping Face */}
        <div className="absolute left-1/3 top-10 rotate-[-12deg] z-10 transition-transform hover:rotate-0">
          <div className="w-44 h-28 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 border-2 border-white p-3 shadow-2xl flex flex-col justify-between">
            <div className="flex justify-between items-center text-white text-[11px] font-extrabold tracking-wider">
              <span>ALLEGION</span>
              <Radio className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-white">NFC Configuration Card</div>
              <div className="text-[8px] text-purple-200 font-mono">Commissioned Security Key</div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-300 text-center mt-2 font-medium">
        Hold card firmly against reader lens until green light flash & audio beep
      </p>
    </div>
  );
};

// =========================================================================
// ASSET 6: TEST FOR NFC RESPONSE (PAGE 8 - REALISTIC PHONE AT READER)
// =========================================================================
export const TestNfcHandshakeAsset: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#0b101c] border border-zinc-800 p-5 flex flex-col items-center shadow-xl w-full">
      {/* Upper Graphic Frame - strictly contained so phone never leaks out */}
      <div className="relative w-full max-w-sm h-64 rounded-xl bg-[#070b14]/90 border border-zinc-800/80 p-3 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
        {/* Schlage Deadbolt Outer Body */}
        <div className="w-26 h-44 rounded-2xl bg-[#141b2c] border-2 border-zinc-600 p-2.5 flex flex-col items-center justify-between shadow-xl relative z-10 mr-12">
          <div className="text-[8px] font-bold text-zinc-400">SCHLAGE</div>
          <div className="w-16 h-16 rounded-full bg-[#0a0f1d] border-2 border-emerald-500/80 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] relative">
            <Radio className="w-7 h-7 text-emerald-400 animate-pulse" />
            <div className="absolute -inset-1 rounded-full border border-emerald-400/30 animate-ping pointer-events-none" />
          </div>
          <div className="w-4 h-6 rounded bg-zinc-700" />
        </div>

        {/* Realistic iPhone Kept Inside Frame Above Green Box */}
        <div className="absolute left-[44%] top-2.5 rotate-[-7deg] z-20">
          <RealisticIPhone
            time="9:41"
            compact={true}
            glowColor="rgba(16, 185, 129, 0.25)"
            className="w-38 sm:w-42"
            screenClassName="min-h-[195px]"
          >
            <div className="p-2 flex-1 flex flex-col justify-between text-center">
              <div className="pt-0.5">
                <span className="text-[7px] font-mono text-zinc-400 uppercase tracking-wider">
                  Express Mode
                </span>
              </div>

              {/* Active Quext Key Pass */}
              <div className="rounded-xl bg-gradient-to-br from-[#3b126d] to-[#160c2b] p-2 border border-emerald-400/80 space-y-1 shadow-xl">
                <div className="flex justify-between items-center">
                  <span className="border border-white/80 px-1 py-0.2 text-white font-extrabold text-[7px] rounded">
                    quext
                  </span>
                  <span className="text-[7px] text-emerald-300 font-bold">NFC ACTIVE</span>
                </div>
                <div className="py-0.5">
                  <Radio className="w-4 h-4 text-emerald-300 mx-auto animate-pulse" />
                </div>
                <div className="text-[8.5px] font-extrabold text-white">Hold Near Reader</div>
                <div className="text-[7px] text-zinc-300">Unit 408 · Front Door</div>
              </div>

              <div className="p-1 rounded-md bg-emerald-950/70 border border-emerald-500/50 text-[7.5px] text-emerald-300 font-bold">
                ✓ Handshake Verified
              </div>
            </div>
          </RealisticIPhone>
        </div>
      </div>

      {/* Green highlighted box - sitting cleanly below with clear separation */}
      <div className="w-full p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-xs text-emerald-300 font-semibold text-center shadow-lg flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Lock recognized the phone NFC credential. Door does not need to unlock yet.</span>
      </div>
    </div>
  );
};


// =========================================================================
// ASSET 7: PRODUCT TRIAD (PAGE 9) - THERMOSTAT, LOCK, & QUEXT APP
// =========================================================================
export const SyncMethodsTriadAsset: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center py-4">
      {/* 1. Quext Thermostat Hub (Method A) */}
      <div className="rounded-2xl bg-[#0e1424] border border-zinc-800 p-5 flex flex-col items-center text-center space-y-3 shadow-xl hover:border-purple-500/40 transition-colors">
        <div className="w-36 h-36 rounded-2xl bg-black border-2 border-zinc-700 p-3 flex flex-col justify-between shadow-2xl relative">
          <div className="flex justify-between items-center text-[9px] text-zinc-400 font-mono">
            <span>70° TARGET</span>
            <span className="text-cyan-400 font-bold">COOL</span>
          </div>
          <div className="text-center my-auto">
            <span className="text-4xl font-extrabold text-white tracking-tighter">71°</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="border border-white/80 px-1 py-0.2 text-[8px] text-white font-extrabold rounded">
              quext
            </span>
            <span className="text-[8px] text-emerald-400 font-bold">HUB ONLINE</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white">Method A: Automatic</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Thermostat Hub syncs credential table over-the-air in 30-180 seconds.
          </p>
        </div>
      </div>

      {/* 2. Middle: Smart Lock Deadbolt */}
      <div className="rounded-2xl bg-[#0e1424] border border-zinc-800 p-5 flex flex-col items-center text-center space-y-3 shadow-xl">
        <div className="w-28 h-44 rounded-3xl bg-[#090d16] border-2 border-purple-500/50 p-3 flex flex-col justify-between items-center shadow-2xl">
          <span className="text-[9px] font-bold text-zinc-400">SCHLAGE</span>
          <div className="w-16 h-16 rounded-full bg-purple-900/30 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Radio className="w-8 h-8" />
          </div>
          <div className="w-6 h-10 rounded bg-zinc-700" />
        </div>

        <div>
          <h4 className="text-sm font-bold text-white">Schlage Smart Deadbolt</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Downloads credential keys into onboard encrypted flash memory.
          </p>
        </div>
      </div>

      {/* 3. Quext Mobile App Sync (Method B) */}
      <div className="rounded-2xl bg-[#0e1424] border border-zinc-800 p-5 flex flex-col items-center text-center space-y-3 shadow-xl hover:border-purple-500/40 transition-colors">
        <div className="w-36 h-48 rounded-2xl bg-[#090d16] border-2 border-zinc-700 p-2.5 flex flex-col justify-between shadow-2xl">
          <div className="text-left">
            <div className="text-[8px] text-purple-400 font-bold">Hello, Amber</div>
            <div className="text-[10px] font-bold text-white mt-0.5">Unit 408 Entrance</div>
          </div>

          <div className="space-y-1.5 my-auto">
            <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-300 flex justify-between items-center">
              <span>Front Deadbolt</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <button className="w-full py-1.5 rounded-lg bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center gap-1 shadow-md">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>Tap to Sync Lock</span>
            </button>
          </div>

          <div className="text-[7px] text-zinc-500 text-center font-mono">Quext Mobile App</div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white">Method B: Manual</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Installer or resident taps &quot;Sync&quot; inside the Quext app over Bluetooth.
          </p>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// ASSET 8: SCHLAGE RC READER CONTROLLER (PAGE 10)
// =========================================================================
export const SchlageRcReaderAsset: React.FC = () => {
  return (
    <div className="rounded-2xl bg-[#0b101c] border border-zinc-800 p-6 flex flex-col items-center shadow-xl">
      <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest mb-4">
        HARDWIRED PERIMETER CONTROLLER
      </div>

      <div className="relative py-2 flex items-center justify-center">
        {/* RC Mullion Housing */}
        <div className="w-24 h-64 rounded-3xl bg-[#070b14] border-2 border-zinc-600 p-2 flex flex-col justify-between items-center shadow-2xl relative">
          {/* Status LED Bar at top */}
          <div className="w-16 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />

          {/* Contactless Icon in center */}
          <div className="w-12 h-12 rounded-full border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Radio className="w-6 h-6" />
          </div>

          {/* Schlage Logo at bottom */}
          <div className="text-[9px] font-bold text-zinc-400 mb-2">SCHLAGE</div>
        </div>

        {/* White Pigtail Harness Cable */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-2 h-10 bg-zinc-300 rounded" />
          <div className="w-6 h-5 rounded bg-zinc-400 border border-zinc-200" />
        </div>
      </div>

      <p className="text-xs text-zinc-400 mt-8 text-center">
        Schlage RC Card Reader · 12V/24V Power · RS-485 / Wiegand Interface
      </p>
    </div>
  );
};

// =========================================================================
// ASSET 9: TOGGLE SWITCH ROLLOUT (PAGE 11)
// =========================================================================
export const RolloutToggleAsset: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="flex items-center gap-6 sm:gap-10">
        {/* OFF TOGGLE */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-24 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 p-1.5 flex items-center justify-start shadow-inner">
            <div className="w-9 h-9 rounded-full bg-zinc-500 shadow-md" />
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">OFF (PRE-UPGRADE)</span>
        </div>

        <ArrowRight className="w-6 h-6 text-purple-500 animate-pulse" />

        {/* ON TOGGLE (BLUE/PURPLE WITH SIGNAL WAVES) */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <div className="w-24 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-purple-400 p-1.5 flex items-center justify-end shadow-lg shadow-purple-600/40">
              <div className="w-9 h-9 rounded-full bg-white shadow-md" />
            </div>
            {/* Wireless Signal Waves at Top Right */}
            <div className="absolute -top-3 -right-3 text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">ON (ROLLOUT ACTIVE)</span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// ASSET 10: 4-STAGE RESIDENT EXPERIENCE SCREENS (PAGE 12)
// FOUR COMPLETE REALISTIC IPHONES DISPLAYING THE EXACT RESIDENT SCREENS
// WITH ZERO WHITE BACKGROUNDS (DARK THEME WITH PURPLE ACCENTS)
// =========================================================================
export const ResidentExperienceScreensAsset: React.FC = () => {
  return (
    <div className="w-full py-2">
      {/* Horizontal Left-to-Right Step Container */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4 min-w-[700px] lg:min-w-0 items-stretch">
          
          {/* STEP 01: WALLET PROMPT IN QUEXT APP */}
          <div className="rounded-2xl bg-[#0c111e]/90 border border-zinc-800/80 p-2.5 sm:p-3 flex flex-col justify-between items-center text-center space-y-2 shadow-xl hover:border-purple-500/40 transition-colors h-full">
            <div className="space-y-0.5 w-full">
              <span className="inline-block px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[9px] font-extrabold text-purple-300">
                STEP 01
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">Wallet Prompt</h4>
            </div>

            <div className="w-full flex justify-center py-1 flex-1 items-center">
              <RealisticIPhone
                time="9:41"
                compact={true}
                glowColor="rgba(168, 85, 247, 0.2)"
                className="w-[150px] sm:w-[170px] lg:w-[185px] shrink-0"
                screenClassName="h-[245px] sm:h-[260px]"
              >
                {/* Quext App Header */}
                <div className="px-2.5 py-1.5 border-b border-zinc-800/80 flex items-center justify-between text-[8px] shrink-0">
                  <div className="flex items-center gap-1">
                    <span className="border border-white/80 px-1 py-0.2 rounded bg-black text-white font-extrabold text-[7px] tracking-tight">
                      quext
                    </span>
                    <span className="text-[8.5px] font-bold text-zinc-300">Home</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-2.5 h-2.5 text-zinc-400" />
                    <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center text-[7.5px] font-bold text-white">
                      S
                    </div>
                  </div>
                </div>

                {/* Quext App Body */}
                <div className="p-2 flex-1 flex flex-col justify-between text-left overflow-hidden">
                  <div>
                    <p className="text-[7.5px] text-zinc-400">Welcome home,</p>
                    <h3 className="text-[10px] font-extrabold text-white leading-tight">Scott Miller</h3>
                    <p className="text-[7px] text-purple-300 font-medium">Unit 408 · The Heights</p>
                  </div>

                  {/* Exact In-App Branded Wallet Prompt Card */}
                  <div className="my-auto rounded-xl bg-gradient-to-br from-[#4c1d95] via-[#311166] to-[#1e0a42] p-2 border border-purple-400/80 shadow-lg space-y-1 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded bg-black flex items-center justify-center border border-zinc-700">
                          <CreditCard className="w-2 h-2 text-purple-300" />
                        </div>
                        <span className="text-[8px] font-extrabold text-white tracking-tight">Apple Wallet</span>
                      </div>
                      <span className="px-1 py-0.2 rounded bg-purple-900/80 text-[6.5px] font-bold text-purple-200">NEW</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-[8.5px] font-extrabold text-white leading-tight">
                        Wallet Pass Ready
                      </div>
                      <p className="text-[7px] text-purple-200 leading-snug line-clamp-2">
                        Add apartment key for fast one-tap unlock.
                      </p>
                    </div>

                    <div className="pt-0.5">
                      <div className="w-full py-1 px-1.5 rounded-lg bg-black border border-zinc-600 text-white font-extrabold text-[7.5px] flex items-center justify-center gap-1 shadow">
                        <span>Get Started</span>
                        <ArrowRight className="w-2 h-2 text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* Lock Status Widget */}
                  <div className="px-2 py-1 rounded-lg bg-[#0e1424] border border-zinc-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="text-[7.5px] font-bold text-white truncate">Front Door · Locked</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
              </RealisticIPhone>
            </div>

            <p className="text-[10px] text-zinc-400 leading-snug">
              Resident opens app &amp; taps &quot;Get Started&quot; on the wallet prompt.
            </p>
          </div>

          {/* STEP 02: GENERATE PASS WITH APPLE & GOOGLE */}
          <div className="rounded-2xl bg-[#0c111e]/90 border border-zinc-800/80 p-2.5 sm:p-3 flex flex-col justify-between items-center text-center space-y-2 shadow-xl hover:border-purple-500/40 transition-colors relative h-full">
            <div className="space-y-0.5 w-full">
              <span className="inline-block px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[9px] font-extrabold text-purple-300">
                STEP 02
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">Generate Pass</h4>
            </div>

            <div className="w-full flex justify-center py-1 flex-1 items-center">
              <RealisticIPhone
                time="9:41"
                compact={true}
                glowColor="rgba(168, 85, 247, 0.2)"
                className="w-[150px] sm:w-[170px] lg:w-[185px] shrink-0"
                screenClassName="h-[245px] sm:h-[260px]"
              >
                <div className="px-2.5 py-1.5 border-b border-zinc-800/80 flex items-center justify-between text-[8px] shrink-0">
                  <span className="text-zinc-500">Cancel</span>
                  <span className="font-bold text-white text-[8.5px]">Wallet Setup</span>
                  <div className="w-3" />
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between text-center overflow-hidden">
                  <span className="text-[7px] font-mono text-purple-400 uppercase tracking-wider">
                    PROVISIONING
                  </span>

                  <div className="my-auto rounded-xl bg-gradient-to-br from-[#2f1155] via-[#1b0833] to-[#0f041e] p-2 border border-purple-500/60 shadow-lg text-left space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="border border-white/80 px-1 py-0.2 text-white font-extrabold text-[7px] rounded">
                        quext
                      </span>
                      <Radio className="w-2.5 h-2.5 text-purple-300" />
                    </div>
                    <div className="text-[8px] font-bold text-white leading-tight">Apartment Key</div>
                    <div className="text-[7px] text-purple-200">Scott Miller · Apt 408</div>

                    <div className="py-1 flex justify-center">
                      <div className="w-7 h-7 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-purple-300" />
                      </div>
                    </div>

                    <div className="text-center text-[7.5px] text-white font-medium">
                      Preparing Wallet Pass...
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full w-3/4 animate-pulse" />
                    </div>
                    <p className="text-[6.5px] text-zinc-500 font-mono">Signing security payload...</p>
                  </div>
                </div>
              </RealisticIPhone>
            </div>

            <p className="text-[10px] text-zinc-400 leading-snug">
              System securely provisions cryptographic credentials with Apple &amp; Google.
            </p>
          </div>

          {/* STEP 03: ADD TO APPLE WALLET */}
          <div className="rounded-2xl bg-[#0c111e]/90 border border-zinc-800/80 p-2.5 sm:p-3 flex flex-col justify-between items-center text-center space-y-2 shadow-xl hover:border-purple-500/40 transition-colors relative h-full">
            <div className="space-y-0.5 w-full">
              <span className="inline-block px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[9px] font-extrabold text-purple-300">
                STEP 03
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">Add to Wallet</h4>
            </div>

            <div className="w-full flex justify-center py-1 flex-1 items-center">
              <RealisticIPhone
                time="9:41"
                compact={true}
                glowColor="rgba(168, 85, 247, 0.25)"
                className="w-[150px] sm:w-[170px] lg:w-[185px] shrink-0"
                screenClassName="h-[245px] sm:h-[260px]"
              >
                <div className="px-2.5 py-1.5 border-b border-zinc-800/80 flex items-center justify-between text-[8px] shrink-0">
                  <span className="text-purple-400">&lt; Back</span>
                  <span className="font-bold text-white text-[8.5px]">Wallet Pass</span>
                  <div className="w-3" />
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between text-center overflow-hidden">
                  <div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center mb-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <h5 className="text-[8.5px] font-bold text-white">Your Pass is Ready</h5>
                  </div>

                  <div className="my-auto rounded-xl bg-gradient-to-br from-[#3b126d] via-[#210940] to-[#120524] p-2 border border-purple-400/80 shadow-lg text-left space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="border border-white/80 px-1 py-0.2 text-white font-extrabold text-[7px] rounded">
                        quext
                      </span>
                      <span className="text-[7px] text-purple-200">Apt 408</span>
                    </div>
                    <div className="text-[8px] font-extrabold text-white">Scott Miller</div>
                    <div className="text-[7px] text-purple-300">The Heights Community Key</div>

                    <div className="pt-0.5">
                      <div className="w-full py-1 px-1.5 rounded-lg bg-black border border-zinc-600 text-[7.5px] font-bold text-white flex items-center justify-center gap-1 shadow">
                        <svg className="w-2 h-2 fill-white shrink-0" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.7-7.85-12.04-14.34-6.31-9.37-11.1-19.92-14.37-31.64-3.27-11.72-4.9-23.13-4.9-34.23 0-14.34 3.75-26.09 11.25-35.25 7.5-9.16 16.9-13.85 28.2-14.07 5.01 0 10.51 1.34 16.5 4.02 5.99 2.68 9.94 4.08 11.86 4.2 1.54 0 5.61-1.45 12.21-4.35 6.6-2.9 12.18-4.22 16.74-3.96 12.87.64 23.36 5.48 31.47 14.52-11.18 6.78-16.64 16.32-16.37 28.62.27 9.8 4.15 17.9 11.64 24.3 7.49 6.4 16.32 10.15 26.5 11.25-2.22 6.75-4.99 13.91-8.31 21.48zM119.22 31.86c0-7.72 2.76-14.94 8.28-21.66 5.52-6.72 12.44-10.74 20.76-12.06.32 1.37.48 2.74.48 4.11 0 7.72-2.87 15.05-8.61 22-5.74 6.95-12.72 10.82-20.91 11.61z" />
                        </svg>
                        <span>Add to Apple Wallet</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[7px] text-purple-300">Express Mode enabled</span>
                </div>
              </RealisticIPhone>
            </div>

            <p className="text-[10px] text-zinc-400 leading-snug">
              Resident taps &quot;Add to Apple Wallet&quot; with biometric confirmation.
            </p>
          </div>

          {/* STEP 04: TAP TO UNLOCK / EXPRESS MODE ACTIVE */}
          <div className="rounded-2xl bg-[#0c111e]/90 border border-purple-500/40 p-2.5 sm:p-3 flex flex-col justify-between items-center text-center space-y-2 shadow-xl hover:border-purple-400 transition-colors relative h-full">
            <div className="space-y-0.5 w-full">
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-extrabold text-emerald-300">
                STEP 04
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">Tap to Unlock</h4>
            </div>

            <div className="w-full flex justify-center py-1 flex-1 items-center">
              <RealisticIPhone
                time="9:41"
                compact={true}
                glowColor="rgba(16, 185, 129, 0.3)"
                className="w-[150px] sm:w-[170px] lg:w-[185px] shrink-0"
                screenClassName="h-[245px] sm:h-[260px]"
              >
                <div className="px-2.5 py-1.5 flex items-center justify-between text-[8px] shrink-0">
                  <Lock className="w-2 h-2 text-zinc-400" />
                  <span className="text-[7px] font-mono text-zinc-400">Express Mode</span>
                  <div className="w-2" />
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between text-center overflow-hidden">
                  <span className="text-[7px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    NFC FIELD DETECTED
                  </span>

                  <div className="my-auto rounded-xl bg-gradient-to-br from-[#2f1057] via-[#1b0833] to-[#0a0314] p-2 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="border border-white/80 px-1 py-0.2 text-white font-extrabold text-[7px] rounded">
                        quext
                      </span>
                      <span className="text-[7px] font-bold text-emerald-400">READY</span>
                    </div>

                    <div className="py-1 relative flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-purple-950/80 border border-purple-400 flex items-center justify-center text-purple-300 shadow">
                        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      </div>
                    </div>

                    <div className="text-[8px] font-extrabold text-white">Hold Near Reader</div>
                    <div className="text-[7px] text-zinc-300">Stephanie R · Apt 408</div>
                  </div>

                  <div className="p-1 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-[7.5px] font-bold text-emerald-300 shrink-0">
                    ✓ Express Mode Active
                  </div>
                </div>
              </RealisticIPhone>
            </div>

            <p className="text-[10px] text-zinc-400 leading-snug">
              Instant door unlock simply by holding phone near lock—no app needed.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

// =========================================================================
// ASSET 11: APPLE WATCH + IPHONE SHOWCASE (PAGE 13)
// =========================================================================
export const AppleWatchAndIPhoneAsset: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 py-6">
      {/* Apple Watch */}
      <div className="flex flex-col items-center space-y-3">
        {/* Watch Outer Chassis */}
        <div className="relative">
          {/* Watch Band Top */}
          <div className="w-24 h-6 bg-zinc-800 rounded-t-xl mx-auto border-t border-zinc-700" />

          {/* Watch Case */}
          <div className="w-36 h-48 rounded-[2.5rem] bg-gradient-to-b from-[#2b3544] via-[#18202c] to-[#0c1219] p-[3px] shadow-2xl relative">
            {/* Digital Crown on Right */}
            <div className="absolute -right-2.5 top-12 w-2.5 h-8 rounded-r-md bg-zinc-600 border-l border-zinc-800" />
            {/* Side Button on Right */}
            <div className="absolute -right-2 top-24 w-2 h-7 rounded-r-sm bg-zinc-700" />

            {/* Inner Screen */}
            <div className="w-full h-full rounded-[2.3rem] bg-black p-2 overflow-hidden flex flex-col justify-between items-center text-center">
              <div className="pt-1 flex justify-between items-center w-full px-2 text-[9px] text-zinc-400 font-semibold">
                <span>9:41</span>
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              </div>

              {/* Watch Quext Pass */}
              <div className="my-auto w-full rounded-2xl bg-gradient-to-br from-[#2a114f] to-[#120722] p-2 border border-purple-500/60 space-y-1.5 shadow-lg">
                <span className="border border-white/80 px-1 py-0.2 text-[7.5px] text-white font-extrabold rounded">
                  quext
                </span>
                <div className="text-[9px] font-bold text-white">Apartment Key</div>
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-[8px] font-bold text-emerald-300">Unlocked</div>
              </div>

              <div className="text-[7px] text-zinc-500 font-mono pb-1">Express Mode</div>
            </div>
          </div>

          {/* Watch Band Bottom */}
          <div className="w-24 h-6 bg-zinc-800 rounded-b-xl mx-auto border-b border-zinc-700" />
        </div>

        <span className="text-xs font-bold text-zinc-300">Apple Watch &amp; Wear OS</span>
      </div>

      {/* iPhone */}
      <div className="flex flex-col items-center space-y-3">
        <RealisticIPhone time="9:41" glowColor="rgba(168, 85, 247, 0.3)" className="w-56">
          <div className="p-3.5 flex-1 flex flex-col justify-between text-center">
            <div className="flex justify-between items-center text-[10px] text-zinc-400">
              <span className="font-mono text-purple-400">QUEXT PASS</span>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>

            <div className="my-auto rounded-2xl bg-gradient-to-br from-[#3b126d] via-[#210940] to-[#100422] p-3.5 border-2 border-purple-400/80 shadow-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="border border-white/80 px-1.5 py-0.5 text-white font-extrabold text-[8px] rounded">
                  quext
                </span>
                <span className="text-[8px] text-purple-200">Apt 408</span>
              </div>
              <div className="text-xs font-bold text-white">Stephanie R</div>
              <div className="w-8 h-8 rounded-full border border-purple-400 mx-auto flex items-center justify-center text-purple-300">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-[9px] font-bold text-emerald-400">Hold Near Reader</div>
            </div>

            <div className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[8px] text-zinc-400 font-mono">
              NFC Contactless Pass
            </div>
          </div>
        </RealisticIPhone>
        <span className="text-xs font-bold text-zinc-300">iOS &amp; Android Smartphone</span>
      </div>
    </div>
  );
};

// =========================================================================
// ASSET 12: DEAD PHONE POWER RESERVE SCREEN (PAGE 14)
// =========================================================================
export const DeadPhoneReserveAsset: React.FC = () => {
  return (
    <div className="flex justify-center py-4">
      <RealisticIPhone time="" showDynamicIsland={false} className="w-60 sm:w-64" glowColor="rgba(239, 68, 68, 0.2)">
        {/* Full Black OLED Screen Displaying Authentic Apple Power Reserve Interface */}
        <div className="flex-1 bg-black p-6 flex flex-col justify-between items-center text-center">
          <div className="w-16 h-3 bg-zinc-900 rounded-full mx-auto" />

          {/* Centered Red Empty Battery Outline */}
          <div className="my-auto space-y-5">
            <div className="w-24 h-12 rounded-xl border-[2.5px] border-rose-500 p-1.5 flex items-center mx-auto relative shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              {/* Flashing Red Bar */}
              <div className="w-4 h-full bg-rose-500 rounded-sm animate-pulse" />
              {/* Battery Nipple */}
              <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-2 h-5 bg-rose-500 rounded-r-md" />
            </div>

            <div className="space-y-1.5 max-w-[200px]">
              <div className="text-sm font-semibold text-zinc-200 tracking-tight">
                Express cards and
              </div>
              <div className="text-sm font-semibold text-zinc-200 tracking-tight">
                keys available
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-zinc-500">
            Apple Power Reserve · Up to 5 Hours
          </div>
        </div>
      </RealisticIPhone>
    </div>
  );
};
