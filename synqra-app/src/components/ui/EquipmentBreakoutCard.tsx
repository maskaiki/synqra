'use client';

import React from 'react';
import { Asset } from '@/types/synqra';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { ArrowUpRight, Check } from 'lucide-react';

interface EquipmentBreakoutCardProps {
  asset: Asset;
  isDarkMode: boolean;
  selected?: boolean;
  metaText?: string;
  badgeText?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

export const EquipmentBreakoutCard: React.FC<EquipmentBreakoutCardProps> = ({
  asset,
  isDarkMode,
  selected = false,
  metaText,
  badgeText,
  onClick,
  className = '',
  style,
  compact = false,
}) => {
  const inner = (
    <>
      {/* Panggung gradien seamless + objek alat keluar menembus tepi atas kartu */}
      <div
        className={`relative rounded-t-3xl px-5 ${
          compact ? 'pt-2 pb-3' : 'pt-2 pb-4'
        }`}
        style={{
          background: selected
            ? 'var(--stage-gradient-active)'
            : 'var(--stage-gradient)',
        }}
      >
        <div className="relative flex flex-col items-center justify-end">
          <TechnicalArt
            type={asset.type}
            darkMode={isDarkMode}
            breakout
            className={`relative z-10 w-full ${
              compact ? 'h-28 -mt-10' : 'h-36 sm:h-40 -mt-12'
            }`}
          />
          <div
            aria-hidden="true"
            className="w-3/4 h-3.5 -mt-2 rounded-[50%] pointer-events-none transition-transform duration-300 group-hover:scale-90"
            style={{ background: 'var(--stage-floor)' }}
          />
        </div>
      </div>

      {/* Metadata ultra-ringkas ala Furniture Shop + tombol pop obsidian */}
      <div
        className={`flex items-end justify-between gap-3 ${
          compact ? 'px-5 pb-4 pt-1' : 'px-5 pb-5 pt-1.5'
        }`}
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)] tracking-tight">
              {asset.id}
            </span>
            {badgeText && (
              <span className="text-xs font-heading font-bold text-[var(--green)]">
                {badgeText}
              </span>
            )}
          </div>
          <div className="font-heading font-bold text-base text-[var(--ink)] leading-snug truncate">
            {asset.name}
          </div>
          <div className="text-sm font-medium text-[var(--ink-soft)] truncate">
            {metaText || asset.area.split(' · ')[0]}
          </div>
        </div>

        <span
          aria-hidden="true"
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
            selected
              ? 'pop-btn shadow-md scale-105'
              : 'pop-btn opacity-90 group-hover:opacity-100 group-hover:scale-105 shadow-sm'
          }`}
        >
          {selected ? (
            <Check className="w-4 h-4 stroke-[2.75] animate-pop" />
          ) : (
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </span>
      </div>
    </>
  );

  const cardClasses = `group lift press-soft relative w-full text-left rounded-3xl overflow-visible surface-card transition-all ${
    selected
      ? 'ring-2 ring-[#00B8D9]'
      : ''
  }`;

  return (
    <div style={style} className={`${compact ? 'pt-8' : 'pt-10'} ${className}`}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={selected}
          className={cardClasses}
        >
          {inner}
        </button>
      ) : (
        <div className={cardClasses}>{inner}</div>
      )}
    </div>
  );
};
