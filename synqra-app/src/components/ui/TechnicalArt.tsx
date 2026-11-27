'use client';

import React, { useEffect, useState } from 'react';
import { EQUIPMENT_MEDIA } from '@/lib/mediaAssets';

interface TechnicalArtProps {
  type?: string;
  className?: string;
  darkMode?: boolean;
  breakout?: boolean;
}

export const TechnicalArt: React.FC<TechnicalArtProps> = ({
  type = 'pump',
  className = 'w-full h-24',
  darkMode = false,
  breakout = false,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [type]);

  const equipmentImage = EQUIPMENT_MEDIA[type];
  if (equipmentImage && !imgError) {
    const shadowClass = breakout
      ? darkMode
        ? 'asset-render-breakout-dark'
        : 'asset-render-breakout-light'
      : darkMode
        ? 'asset-render-dark'
        : 'asset-render-light';

    const hoverClass = breakout
      ? 'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.07]'
      : 'transition-transform duration-300 ease-out group-hover:scale-[1.06]';

    return (
      <img
        src={equipmentImage.src}
        alt={equipmentImage.alt}
        width={equipmentImage.width}
        height={equipmentImage.height}
        loading="eager"
        decoding="async"
        draggable={false}
        onError={() => setImgError(true)}
        className={`object-contain select-none ${hoverClass} ${shadowClass} ${className}`}
      />
    );
  }

  const strokeColor = darkMode ? '#7CC0FF' : '#1E4B6B';
  const fillColor = darkMode ? '#102A4C' : '#F8FCFD';
  const highlightColor = '#00B8D9';

  const renderGraphic = () => {
    switch (type) {
      case 'column':
      case 'stripper':
        return (
          <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M74 132h72M84 122h52" />
            <rect x="88" y="24" width="44" height="98" rx="18" fill={fillColor} />
            <path d="M88 44h44M88 64h44M88 84h44M88 104h44" stroke={highlightColor} />
            <path d="M110 24V12h38v40M70 94h18" stroke={highlightColor} strokeWidth="4" />
          </g>
        );
      case 'furnace':
      case 'heater':
        return (
          <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M36 125h148" />
            <rect x="52" y="52" width="116" height="73" rx="6" fill={fillColor} />
            <path d="M92 52V18h36v34" fill={fillColor} />
            <path d="M72 74v34m20-34v34m20-34v34m20-34v34m16-34v34" stroke={highlightColor} />
            <path d="M40 88h12m116 0h14" stroke={highlightColor} strokeWidth="5" />
          </g>
        );
      case 'finfan':
        return (
          <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M34 114h152M52 94v20m116-20v20" />
            <rect x="44" y="50" width="132" height="44" rx="8" fill={fillColor} />
            <circle cx="84" cy="40" r="14" fill={fillColor} stroke={highlightColor} />
            <circle cx="136" cy="40" r="14" fill={fillColor} stroke={highlightColor} />
            <path d="M44 72h132M26 72h18m132 0h18" stroke={highlightColor} strokeWidth="4" />
          </g>
        );
      case 'desalter':
      case 'vessel':
        return (
          <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M58 104v20m104-20v20M44 124h132" />
            <rect x="42" y="48" width="136" height="56" rx="28" fill={fillColor} />
            <path d="M76 48V30h18v18m32 0V30h18v18M110 104v16" stroke={highlightColor} strokeWidth="3.5" />
            <path d="M24 76h18m136 0h18" stroke={highlightColor} strokeWidth="5" />
          </g>
        );
      case 'pump':
        return (
          <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M32 102h154v13H32z" fill={fillColor} />
            <rect x="48" y="53" width="63" height="49" rx="9" fill={fillColor} />
            <circle cx="79" cy="77" r="18" fill="rgba(0,184,217,0.2)" />
            <path d="M79 59v36m-18-18h36" stroke={highlightColor} />
            <path d="M111 64h22l15 13v25h-37z" fill={fillColor} />
            <path d="M133 64V43h27v21m-19-21v-9h10v9" />
            <path d="M28 77h20m112 0h29" stroke={highlightColor} strokeWidth="5" />
          </g>
        );
      case 'heat':
        return (
          <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 54h22m120 0h22M28 91h22m120 0h22" />
            <rect x="48" y="38" width="124" height="70" rx="18" fill={fillColor} />
            <path
              d="M66 42v62m88-62v62M78 48c10 6 10 44 0 50m20-50c10 6 10 44 0 50m20-50c10 6 10 44 0 50m20-50c10 6 10 44 0 50"
              stroke={highlightColor}
            />
            <path d="M58 38V26h18v12m68 0V26h18v12M58 108v12h18v-12m68 0v12h18v-12" />
            <path d="M25 72h21m126 0h22" stroke={highlightColor} strokeWidth="5" />
          </g>
        );
      case 'valve':
        return (
          <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 87h55m66 0h55" stroke={highlightColor} strokeWidth="6" />
            <path d="m77 62 32 25-32 25V62zm66 0-32 25 32 25V62z" fill={fillColor} />
            <path d="M110 62V35m-21 0h42" />
            <rect x="93" y="16" width="34" height="20" rx="5" fill={fillColor} />
            <path d="M110 16V8" />
          </g>
        );
      default:
        return (
          <g stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <rect x="48" y="38" width="124" height="70" rx="14" fill={fillColor} />
            <circle cx="110" cy="73" r="24" stroke={highlightColor} />
            <path d="M110 49v48m-24-24h48" stroke={highlightColor} />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 220 145"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {renderGraphic()}
    </svg>
  );
};
