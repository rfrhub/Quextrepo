import React from 'react';
import whiteLogo from '../assets/images/quext-powered-by-gfiber-white.png';

interface QuextLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'boxed' | 'modern' | 'glow';
  showSubtitle?: boolean;
}

export const QuextLogo: React.FC<QuextLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const logoHeights = {
    sm: 'h-6 sm:h-7',
    md: 'h-7 sm:h-8',
    lg: 'h-9 sm:h-10',
  };

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Official Quext Powered by gFiber Logo White PNG */}
      <div className="relative inline-flex items-center justify-center transition-transform hover:scale-[1.02]">
        <img
          src={whiteLogo}
          alt="Quext powered by GFiber"
          className={`${logoHeights[size]} w-auto object-contain flex-shrink-0 drop-shadow-sm`}
          loading="eager"
        />
      </div>

      {showSubtitle && (
        <div className="hidden sm:flex flex-col leading-none border-l border-zinc-700/80 pl-3">
          <span className="text-xs uppercase tracking-[0.18em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-400">
            Partner Academy
          </span>
          <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-medium mt-0.5">
            Field Installation &amp; Training
          </span>
        </div>
      )}
    </div>
  );
};

