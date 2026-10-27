import React, { useState, useRef } from 'react';

interface QuextVisionLogoProps {
  className?: string;
  size?: number;
  onTriggerSecretFocus?: () => void;
}

/**
 * QuextVisionLogo Component
 * Renders the Quext Vision logo in the top right of the Live Activity Hub.
 * By default, the logo is white (#ffffff) against the white background so it is hidden.
 * When hovered over with a mouse or tapped on mobile/touch, it transitions to Quext brand purple (#702082)
 * only while hovered or tapped.
 * Clicking or tapping the logo 10 times within 5 seconds triggers the secret Focus Mode / Quext Vision popup.
 */
export const QuextVisionLogo: React.FC<QuextVisionLogoProps> = ({
  className = '',
  size = 63,
  onTriggerSecretFocus,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [clickStreak, setClickStreak] = useState(0);
  const clickTimestampsRef = useRef<number[]>([]);

  const isActive = isHovered || isTapped;

  const handleLogoActivate = () => {
    const now = Date.now();
    const windowStart = now - 5000;
    const recent = clickTimestampsRef.current.filter((t) => t >= windowStart);
    recent.push(now);
    clickTimestampsRef.current = recent;
    setClickStreak(recent.length);

    if (recent.length >= 10) {
      clickTimestampsRef.current = [];
      setClickStreak(0);
      if (onTriggerSecretFocus) {
        onTriggerSecretFocus();
      }
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setClickStreak(0);
      }}
      onPointerDown={() => setIsTapped(true)}
      onPointerUp={() => setIsTapped(false)}
      onPointerCancel={() => setIsTapped(false)}
      onTouchStart={() => setIsTapped(true)}
      onTouchEnd={() => setIsTapped(false)}
      onTouchCancel={() => setIsTapped(false)}
      onClick={handleLogoActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLogoActivate();
        }
      }}
      tabIndex={0}
      onFocus={() => setIsHovered(true)}
      onBlur={() => {
        setIsHovered(false);
        setIsTapped(false);
        setClickStreak(0);
      }}
      aria-label="Quext Vision"
      title="Quext Vision (Click 10x or press ⌘+I / Ctrl+I)"
      role="button"
    >
      {/* 
        The logo mask div.
        Default: backgroundColor is pure white (#ffffff) so it blends invisibly into the white background.
        Hover / Tap: backgroundColor switches to Quext purple (#702082).
      */}
      <div
        className="transition-all duration-150 ease-out active:scale-90"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          maskImage: "url('/assets/aistudio/Quext_Vision_2d7a50c8.png')",
          WebkitMaskImage: "url('/assets/aistudio/Quext_Vision_2d7a50c8.png')",
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          backgroundColor: isActive ? '#702082' : '#ffffff',
        }}
      />
      {isActive && clickStreak > 1 && clickStreak < 10 && (
        <span className="absolute -bottom-2 right-0 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#702082] text-white shadow-xs pointer-events-none">
          {clickStreak}/10
        </span>
      )}
    </div>
  );
};

