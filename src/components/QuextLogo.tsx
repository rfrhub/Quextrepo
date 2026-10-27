import React from 'react';

interface QuextLogoProps {
  className?: string;
  onClick?: () => void;
}

export const QuextLogo: React.FC<QuextLogoProps> = ({ className = 'h-7 sm:h-8', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md transition-transform active:scale-95 cursor-pointer shrink-0"
      title="Quext Home · View Latest Projects Activity"
    >
      <img
        src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png"
        alt="Quext"
        className={`${className} w-auto object-contain`}
        onError={(e) => {
          if (e.currentTarget.src !== '/quext-logo-boxed.png') {
            e.currentTarget.src = '/quext-logo-boxed.png';
          }
        }}
      />
    </button>
  );
};

