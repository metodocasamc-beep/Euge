import React from 'react';

interface LogoProps {
  variant?: 'badge' | 'full' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Dimensions
  const sizeMap = {
    sm: { badge: 'w-8 h-8', text: 'text-sm', sub: 'text-[9px]' },
    md: { badge: 'w-10 h-10', text: 'text-base', sub: 'text-[11px]' },
    lg: { badge: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
    xl: { badge: 'w-24 h-24', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // The distinctive MC badge with the furniture blueprint in fine white lines and bold MC in #1c2120
  const renderBadge = (customClass?: string) => (
    <div
      className={`relative rounded-xl bg-[#fed767] flex items-center justify-center overflow-hidden shadow-sm shrink-0 select-none ${customClass || currentSize.badge}`}
    >
      {/* Background Furniture Blueprint in White Delicate Lines (as in official brand logo) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-white/90 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Outer stylized circular module representing modular cabinetry */}
        <circle cx="50" cy="50" r="38" strokeWidth="2.5" strokeDasharray="none" opacity="0.85" />
        {/* Vertical divider */}
        <line x1="50" y1="12" x2="50" y2="88" strokeWidth="1.8" opacity="0.8" />
        {/* Horizontal shelf lines */}
        <line x1="16" y1="42" x2="50" y2="42" strokeWidth="1.8" opacity="0.75" />
        <line x1="16" y1="65" x2="50" y2="65" strokeWidth="1.8" opacity="0.75" />
        {/* Drawers and handles on right side */}
        <line x1="50" y1="36" x2="84" y2="36" strokeWidth="1.5" opacity="0.7" />
        <line x1="50" y1="58" x2="84" y2="58" strokeWidth="1.5" opacity="0.7" />
        <circle cx="67" cy="47" r="2.5" fill="currentColor" opacity="0.7" />
        <circle cx="67" cy="72" r="2.5" fill="currentColor" opacity="0.7" />
        {/* Architectural extension line 'd' */}
        <line x1="88" y1="12" x2="88" y2="88" strokeWidth="2" opacity="0.85" />
      </svg>

      {/* Bold MC letters in Gris Oscuro #1c2120 */}
      <div className="relative z-10 flex items-center justify-center font-extrabold tracking-tight text-[#1c2120] font-sans">
        <span className={size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-base' : 'text-xs'}>
          MC
        </span>
      </div>
    </div>
  );

  if (variant === 'icon' || variant === 'badge') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {renderBadge()}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        <div className="relative p-6 rounded-2xl bg-[#fed767] shadow-md flex flex-col items-center justify-center">
          {renderBadge('w-28 h-28')}
          <span className="mt-3 text-[#1c2120] font-medium tracking-[0.25em] text-xs uppercase font-sans">
            método casa
          </span>
        </div>
      </div>
    );
  }

  // Default: horizontal with badge and brand typography
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {renderBadge()}
      <div className="flex flex-col leading-tight text-left">
        <span className="font-extrabold tracking-tight text-[#1c2120] text-lg sm:text-xl font-sans uppercase">
          MÉTODO CASA
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] tracking-[0.18em] text-[#1c2120]/75 uppercase font-medium">
            Diseño de Interiores · Euge
          </span>
        )}
      </div>
    </div>
  );
};
