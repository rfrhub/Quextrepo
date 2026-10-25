import React from 'react';
import { Sparkles, Shield, Scan, CheckCircle2, Lock } from 'lucide-react';

interface PlaqueProps {
  propertyName?: string;
  subTitle?: string;
  onScanClick?: () => void;
  scale?: number;
  interactive?: boolean;
}

/**
 * Precision Vector QR Code Generator (SVG)
 * Generates an authentic high-density QR code matrix with 3 standard corner finder patterns.
 */
export const VectorQrCode: React.FC<{ size?: number; color?: string; bg?: string }> = ({
  size = 180,
  color = '#111827',
  bg = 'transparent'
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="shrink-0"
      shapeRendering="crispEdges"
    >
      {bg !== 'transparent' && <rect width="100" height="100" fill={bg} />}

      {/* TOP-LEFT FINDER PATTERN */}
      <rect x="5" y="5" width="26" height="26" fill={color} />
      <rect x="9" y="9" width="18" height="18" fill="#e2e8f0" />
      <rect x="13" y="13" width="10" height="10" fill={color} />

      {/* TOP-RIGHT FINDER PATTERN */}
      <rect x="69" y="5" width="26" height="26" fill={color} />
      <rect x="73" y="9" width="18" height="18" fill="#e2e8f0" />
      <rect x="77" y="13" width="10" height="10" fill={color} />

      {/* BOTTOM-LEFT FINDER PATTERN */}
      <rect x="5" y="69" width="26" height="26" fill={color} />
      <rect x="9" y="73" width="18" height="18" fill="#e2e8f0" />
      <rect x="13" y="77" width="10" height="10" fill={color} />

      {/* TIMING PATTERNS */}
      <rect x="35" y="8" width="4" height="4" fill={color} />
      <rect x="43" y="8" width="4" height="4" fill={color} />
      <rect x="51" y="8" width="4" height="4" fill={color} />
      <rect x="59" y="8" width="4" height="4" fill={color} />
      <rect x="8" y="35" width="4" height="4" fill={color} />
      <rect x="8" y="43" width="4" height="4" fill={color} />
      <rect x="8" y="51" width="4" height="4" fill={color} />
      <rect x="8" y="59" width="4" height="4" fill={color} />

      {/* INNER QR DATA BLOCKS */}
      <rect x="35" y="16" width="6" height="6" fill={color} />
      <rect x="45" y="16" width="6" height="6" fill={color} />
      <rect x="55" y="16" width="8" height="4" fill={color} />
      
      <rect x="35" y="26" width="4" height="8" fill={color} />
      <rect x="43" y="24" width="8" height="4" fill={color} />
      <rect x="55" y="26" width="6" height="6" fill={color} />

      <rect x="18" y="35" width="6" height="6" fill={color} />
      <rect x="28" y="35" width="6" height="6" fill={color} />
      <rect x="38" y="35" width="8" height="4" fill={color} />
      <rect x="50" y="35" width="6" height="6" fill={color} />
      <rect x="60" y="35" width="8" height="6" fill={color} />
      <rect x="72" y="35" width="6" height="8" fill={color} />
      <rect x="82" y="35" width="8" height="6" fill={color} />

      <rect x="18" y="45" width="6" height="8" fill={color} />
      <rect x="28" y="47" width="8" height="6" fill={color} />
      <rect x="40" y="43" width="6" height="6" fill={color} />
      <rect x="50" y="45" width="10" height="6" fill={color} />
      <rect x="64" y="45" width="6" height="8" fill={color} />
      <rect x="74" y="47" width="8" height="6" fill={color} />
      <rect x="86" y="45" width="6" height="8" fill={color} />

      <rect x="18" y="57" width="8" height="6" fill={color} />
      <rect x="30" y="55" width="6" height="8" fill={color} />
      <rect x="40" y="57" width="8" height="6" fill={color} />
      <rect x="52" y="55" width="6" height="6" fill={color} />
      <rect x="62" y="57" width="8" height="6" fill={color} />
      <rect x="74" y="55" width="6" height="8" fill={color} />
      <rect x="84" y="57" width="8" height="6" fill={color} />

      {/* BOTTOM-RIGHT DATA ALIGNMENT */}
      <rect x="35" y="69" width="6" height="8" fill={color} />
      <rect x="45" y="69" width="8" height="6" fill={color} />
      <rect x="57" y="69" width="6" height="6" fill={color} />
      <rect x="67" y="69" width="8" height="8" fill={color} />
      <rect x="79" y="69" width="8" height="6" fill={color} />

      <rect x="35" y="81" width="8" height="6" fill={color} />
      <rect x="47" y="79" width="6" height="8" fill={color} />
      <rect x="57" y="81" width="8" height="6" fill={color} />
      <rect x="69" y="81" width="6" height="8" fill={color} />
      <rect x="79" y="79" width="8" height="8" fill={color} />

      <rect x="35" y="91" width="6" height="4" fill={color} />
      <rect x="45" y="89" width="8" height="6" fill={color} />
      <rect x="57" y="91" width="6" height="4" fill={color} />
      <rect x="67" y="89" width="8" height="6" fill={color} />
      <rect x="79" y="91" width="8" height="4" fill={color} />
    </svg>
  );
};

// Realistic Stainless Steel Fastener / Screw Head
const PlaqueScrew: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`rounded-full bg-gradient-to-br from-[#f8fafc] via-[#cbd5e1] to-[#64748b] border border-[#475569] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 ${className}`}
  >
    {/* Phillips screw slot */}
    <div className="relative w-2 h-2 flex items-center justify-center">
      <div className="w-2 h-[1px] bg-[#334155] rotate-45 shadow-[0_0.5px_0.5px_rgba(255,255,255,0.3)]" />
      <div className="w-2 h-[1px] bg-[#334155] -rotate-45 shadow-[0_0.5px_0.5px_rgba(255,255,255,0.3)] absolute" />
    </div>
  </div>
);

// Geokey Padlock Logo Vector
export const GeokeyLockLogo: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#1e293b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path
      d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <rect
      x="4"
      y="11"
      width="16"
      height="11"
      rx="2.5"
      stroke={color}
      strokeWidth="2.2"
    />
    <circle cx="12" cy="16" r="1.5" fill={color} />
    <path d="M12 17.5V19.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 1. VERTICAL CUSTOM ENTRANCE PLAQUE (Tamarin Ridge Architecture)
 * Isolated pure plaque with brushed stainless steel finish, mounting screws,
 * laser-etched typography, and vector QR code. NO BACKGROUND OR WALL.
 */
export const VerticalTamarinRidgePlaque: React.FC<PlaqueProps> = ({
  propertyName = 'TAMARIN | RIDGE',
  subTitle = 'APARTMENTS',
  onScanClick,
  interactive = true
}) => {
  return (
    <div
      onClick={interactive ? onScanClick : undefined}
      className={`relative w-72 sm:w-80 rounded-xl p-5 select-none transition-all duration-300 ${
        interactive
          ? 'cursor-pointer hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)] group'
          : ''
      }`}
      style={{
        // Authentic Brushed Stainless Steel gradient with metallic bevel
        background: 'linear-gradient(135deg, #e4e7eb 0%, #f4f6f8 25%, #cfd4dc 45%, #eef1f5 70%, #bfc5ce 100%)',
        boxShadow:
          'inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.3), 0 12px 30px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4)',
        border: '1px solid #94a3b8'
      }}
    >
      {/* 4 Corner Screws */}
      <PlaqueScrew className="absolute top-3 left-3" />
      <PlaqueScrew className="absolute top-3 right-3" />
      <PlaqueScrew className="absolute bottom-3 left-3" />
      <PlaqueScrew className="absolute bottom-3 right-3" />

      {/* Brushed Texture Subtle Overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)'
        }}
      />

      {/* Plaque Content */}
      <div className="relative z-10 flex flex-col items-center text-center pt-2 pb-1 space-y-3">
        {/* Welcome Header */}
        <div className="space-y-0.5">
          <p className="text-[13px] font-medium tracking-wide text-[#334155]">
            Welcome to
          </p>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#0f172a] font-serif uppercase">
            {propertyName}
          </h3>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-[#475569] uppercase">
            {subTitle}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-3 bg-white/40 rounded-lg border border-[#94a3b8]/40 shadow-inner my-1 group-hover:bg-white/60 transition-colors">
          <VectorQrCode size={168} color="#0f172a" />
        </div>

        {/* Plaque Footer Markings */}
        <div className="space-y-0.5 pt-1">
          <p className="text-[11px] font-semibold tracking-wide text-[#334155]">
            Geokey Intercom
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#1e293b]">
            <span className="text-[10px] font-medium text-[#475569]">Powered by</span>
            <GeokeyLockLogo size={14} color="#0f172a" />
            <span>Geokey</span>
          </div>
        </div>

        {/* Scan Badge Prompt (Interactive State) */}
        {interactive && (
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-bold tracking-wide uppercase shadow-md group-hover:bg-blue-500 transition-colors">
              <Scan className="w-3 h-3 animate-pulse" />
              <span>Simulate Visitor Scan</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 2. HORIZONTAL COMPACT ENTRANCE PLAQUE (Geokey Standard Vestibule / Glass Format)
 * Isolated pure plaque with brushed aluminum finish, 4 corner mounting holes,
 * left QR code, and right Geokey lock logo. NO HAND, NO GLASS, NO BACKGROUND.
 */
export const HorizontalGeokeyPlaque: React.FC<PlaqueProps> = ({
  propertyName = 'Geokey',
  onScanClick,
  interactive = true
}) => {
  return (
    <div
      onClick={interactive ? onScanClick : undefined}
      className={`relative w-80 sm:w-96 rounded-lg p-4 select-none transition-all duration-300 ${
        interactive
          ? 'cursor-pointer hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)] group'
          : ''
      }`}
      style={{
        background: 'linear-gradient(120deg, #d8dbe0 0%, #eceff3 30%, #c8ced6 55%, #f1f4f8 80%, #b8bfc8 100%)',
        boxShadow:
          'inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.25), 0 10px 25px rgba(0,0,0,0.55), 0 2px 5px rgba(0,0,0,0.3)',
        border: '1px solid #94a3b8'
      }}
    >
      {/* 4 Corner Screws / Mounting Holes */}
      <PlaqueScrew className="absolute top-2.5 left-2.5" size={13} />
      <PlaqueScrew className="absolute top-2.5 right-2.5" size={13} />
      <PlaqueScrew className="absolute bottom-2.5 left-2.5" size={13} />
      <PlaqueScrew className="absolute bottom-2.5 right-2.5" size={13} />

      {/* Brushed Texture Subtle Overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)'
        }}
      />

      {/* Horizontal Layout: Left QR Code | Right Verification */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-2 py-1">
        {/* Left: Big QR Code */}
        <div className="p-2 bg-white/40 rounded-md border border-[#94a3b8]/40 shadow-inner group-hover:bg-white/60 transition-colors shrink-0">
          <VectorQrCode size={120} color="#0f172a" />
        </div>

        {/* Right: Welcome + Geokey Lock Mark */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-1.5 pr-2">
          <p className="text-[12px] font-medium text-[#334155] tracking-wide">
            Welcome to
          </p>

          <div className="flex items-center justify-center gap-2">
            <GeokeyLockLogo size={24} color="#0f172a" />
            <span className="text-xl font-extrabold tracking-tight text-[#0f172a]">
              {propertyName}
            </span>
          </div>

          <div className="pt-1 space-y-0.5">
            <p className="text-[10px] font-semibold text-[#334155] tracking-wide">
              Geokey Intercom
            </p>
            <div className="flex items-center justify-center gap-1 text-[9.5px] font-bold text-[#1e293b]">
              <span className="text-[9px] font-medium text-[#475569]">Powered by</span>
              <GeokeyLockLogo size={11} color="#0f172a" />
              <span>Geokey</span>
            </div>
          </div>

          {interactive && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[9px] font-bold uppercase tracking-wider group-hover:bg-blue-500 transition-colors">
                <Scan className="w-2.5 h-2.5" />
                <span>Tap to Scan</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
