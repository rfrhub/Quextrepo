import React from 'react';
import whiteLogo from '../assets/images/quext-powered-by-gfiber-white.png';
import { QUEXT_GFIBER_WHITE_LOGO_BASE64 } from '../assets/images/quext-gfiber-white-base64';

interface QuextLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'boxed' | 'modern' | 'glow';
  showSubtitle?: boolean;
  title?: string;
  subtitle?: string;
}

export const QuextLogo: React.FC<QuextLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  title = 'Partner Academy',
  subtitle = 'Field Installation & Training',
}) => {
  const logoHeights = {
    sm: 'h-7 sm:h-8',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-11',
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3.5 ${className}`}>
      {/* Official Quext Powered by GFiber Logo with 4-Color Icon */}
      <div className="relative inline-flex items-center justify-center transition-transform hover:scale-[1.02]">
        <img
          src={QUEXT_GFIBER_WHITE_LOGO_BASE64 || whiteLogo}
          alt="Quext powered by GFiber"
          className={`${logoHeights[size]} w-auto object-contain flex-shrink-0`}
          style={{
            height: size === 'sm' ? '30px' : size === 'lg' ? '42px' : '36px',
            width: 'auto',
            minWidth: size === 'sm' ? '114px' : size === 'lg' ? '160px' : '136px',
            display: 'inline-block',
          }}
          loading="eager"
          decoding="sync"
        />
      </div>

      {showSubtitle && (
        <div className="flex flex-col leading-none border-l border-zinc-700/80 pl-2 sm:pl-3 shrink-0">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-400">
            {title}
          </span>
          <span className="hidden sm:inline text-[9px] sm:text-[10px] text-zinc-400 tracking-wider uppercase font-medium mt-0.5">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};

