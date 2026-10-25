import React, { useState } from 'react';
import { Wifi, Sun, Snowflake, RotateCw } from 'lucide-react';

interface QuextThermostatDeviceProps {
  className?: string;
  initialTemp?: number;
  initialSetpoint?: number;
  mode?: 'COOL' | 'HEAT' | 'AUTO';
  isOnline?: boolean;
  interactive?: boolean;
}

export const QuextThermostatDevice: React.FC<QuextThermostatDeviceProps> = ({
  className = '',
  initialTemp = 72,
  initialSetpoint = 68,
  mode = 'COOL',
  isOnline = true,
  interactive = true,
}) => {
  const [temp, setTemp] = useState<number>(initialTemp);
  const [setpoint, setSetpoint] = useState<number>(initialSetpoint);
  const [currentMode, setCurrentMode] = useState<'COOL' | 'HEAT' | 'AUTO'>(mode);
  const [dialRotation, setDialRotation] = useState<number>(0);

  const handleDialTurn = (delta: number) => {
    if (!interactive) return;
    setSetpoint((prev) => Math.min(85, Math.max(60, prev + delta)));
    setDialRotation((prev) => prev + delta * 15);
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Physical Wall Mount Casing matching PDF Page 1 & 12 */}
      <div className="relative w-64 sm:w-72 aspect-[3/4.6] bg-gradient-to-b from-[#1c1c1e] via-[#141416] to-[#0c0c0e] rounded-[32px] p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col justify-between overflow-hidden border border-zinc-700/60">
        
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none rounded-[32px]" />

        {/* Digital Screen Display Area */}
        <div className="relative z-10 pt-2 px-1">
          {/* Top Row: Antenna Icon and Boxed Quext Logo */}
          <div className="flex items-start justify-between">
            {/* Wireless LoRaWAN Antenna & Weather Status */}
            <div className="flex items-center gap-1.5 text-zinc-300">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4.9-3.5c2.7-2.7 7.1-2.7 9.8 0l1.4-1.4c-3.5-3.5-9.2-3.5-12.6 0l1.4 1.4zm-2.8-2.8c4.3-4.3 11.1-4.3 15.4 0l1.4-1.4c-5.1-5.1-13.1-5.1-18.2 0l1.4 1.4z" />
              </svg>
              <div className="flex items-center gap-0.5 text-[9px] font-mono text-zinc-400">
                <span>❄️</span>
                <span>☀️</span>
              </div>
            </div>

            {/* Official Boxed Quext Logo on glass face */}
            <div className="inline-flex items-center justify-center border border-white/90 px-1.5 py-0.5 rounded text-[11px] font-extrabold text-white tracking-tight lowercase">
              quext
            </div>
          </div>

          {/* Mode labels & Main Temperature LED Readout */}
          <div className="mt-4 flex items-center justify-between">
            {/* Left Status Text Column matching PDF */}
            <div className="space-y-1 font-mono text-[9px] tracking-wider text-zinc-400 font-semibold">
              <div className="text-white">SMART</div>
              <div className="text-cyan-400 font-bold">{currentMode}</div>
              <div className="text-zinc-400">AUTO</div>
            </div>

            {/* Large White LED Segment Readout (72) */}
            <div className="text-right">
              <div className="text-[10px] font-mono font-bold text-zinc-400 flex items-center justify-end gap-1">
                <span>SET</span>
                <span className="text-white text-xs">{setpoint}</span>
              </div>
              <div className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white font-mono leading-none drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                {temp}
              </div>
            </div>
          </div>
        </div>

        {/* Physical Matte Black Knurled Rotary Dial */}
        <div className="relative z-10 flex flex-col items-center pb-2">
          {/* Outer Dial Shadow & Ring */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-[#2a2a2e] to-[#121214] p-1.5 shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center">
            {/* Knurled Ridges / Ring */}
            <div
              className="w-full h-full rounded-full bg-[#18181b] border-2 border-zinc-700/80 shadow-inner flex items-center justify-center transition-transform duration-150"
              style={{ transform: `rotate(${dialRotation}deg)` }}
            >
              {/* Dial Center Cap with subtle concavity */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#242428] via-[#1a1a1c] to-[#0f0f10] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_2px_4px_rgba(255,255,255,0.05)] border border-zinc-800 flex items-center justify-center relative">
                {/* Dial Indicator Notch */}
                <div className="absolute top-2 w-1.5 h-3 bg-zinc-400 rounded-full" />
                <div className="w-4 h-4 rounded-full bg-black/60 border border-zinc-700/50" />
              </div>
            </div>
          </div>

          {/* Interactive Temperature Controls */}
          {interactive && (
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => handleDialTurn(-1)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow"
                title="Decrease temperature"
              >
                −
              </button>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                Turn Dial
              </span>
              <button
                onClick={() => handleDialTurn(1)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow"
                title="Increase temperature"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Model Spec Tag at Bottom */}
        <div className="text-center text-[9px] font-mono text-zinc-500 tracking-wider">
          MODEL: QXT100048 · LORAWAN GATEWAY
        </div>
      </div>
    </div>
  );
};
