import React from 'react';

interface RoadSenseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
  iconOnly?: boolean;
}

export const RoadSenseLogo: React.FC<RoadSenseLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  theme = 'light',
  className = '',
  iconOnly = false
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric SVG Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-1.5 shadow-md shadow-emerald-950/20 border border-slate-800/80 group transition-transform hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* V2X Concentric Broadcast Radar Waves */}
          <path
            d="M 22 42 A 38 38 0 0 1 78 42"
            stroke="url(#emeraldGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />
          <path
            d="M 32 32 A 26 26 0 0 1 68 32"
            stroke="url(#emeraldGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Vanishing Point Perspective Highway Lanes */}
          <polygon
            points="50,22 18,88 82,88"
            fill="url(#glowGrad)"
          />
          {/* Left Lane Boundary */}
          <line
            x1="50" y1="22"
            x2="16" y2="90"
            stroke="url(#emeraldGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Right Lane Boundary */}
          <line
            x1="50" y1="22"
            x2="84" y2="90"
            stroke="url(#emeraldGrad)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Dashed Center Guidance Line */}
          <line
            x1="50" y1="36"
            x2="50" y2="46"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="50" y1="56"
            x2="50" y2="68"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="50" y1="78"
            x2="50" y2="90"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Electric Cyan Digital Telemetry Pulse Wave */}
          <path
            d="M 28 66 L 40 66 L 45 52 L 50 78 L 55 56 L 60 66 L 72 66"
            stroke="url(#cyanGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Subtle Radar Pulse Glow */}
        <span className="absolute -inset-0.5 rounded-2xl bg-emerald-500/10 blur-sm pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
      </div>

      {/* Brand Typography */}
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${currentSize.text} ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Road<span className="text-[#00875A]">Sense</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#00875A] to-emerald-600 text-white font-black text-[10px] tracking-wider uppercase shadow-xs">
              AI
            </span>
          </div>

          {showSubtitle && (
            <span className={`font-medium tracking-tight mt-1 ${currentSize.sub} ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Predictive Road Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
