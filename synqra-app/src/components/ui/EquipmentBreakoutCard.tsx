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
      {/* Panggung gradien + objek alat menembus tepi atas kartu */}
      <div
        className={`relative rounded-t-2xl px-4 ${
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
              compact ? 'h-28 -mt-9' : 'h-32 sm:h-36 -mt-11'
            }`}
          />
          <div
            aria-hidden="true"
            className="w-3/4 h-3.5 -mt-2 rounded-[50%] pointer-events-none transition-transform duration-300 group-hover:scale-90"
            style={{ background: 'var(--stage-floor)' }}
          />
        </div>
      </div>

      {/* Metadata ringkas & tombol pop kontras tinggi */}
      <div
        className={`flex items-end justify-between gap-3 ${
          compact ? 'px-4 pb-4 pt-1' : 'px-5 pb-5 pt-1.5'
        }`}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)] tracking-tight">
              {asset.id}
            </span>
            {badgeText && (
              <span
                style={{
                  backgroundColor: 'var(--green-bg)',
                  color: 'var(--green)',
                  borderColor: 'var(--green-border)',
                  borderLeftColor: 'var(--green)',
                }}
                className="px-2 py-0.5 rounded-[7px] border border-l-[3.5px] font-heading text-[11px] font-bold whitespace-nowrap"
              >
                {badgeText}
              </span>
            )}
          </div>
          <div className="font-heading font-bold text-[15.5px] text-[var(--ink)] leading-snug truncate">
            {asset.name}
          </div>
          <div className="text-sm font-medium text-[var(--ink-soft)] truncate">
            {metaText || asset.area}
          </div>
        </div>

        <span
          aria-hidden="true"
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
            selected
              ? 'pop-btn shadow-md scale-105'
              : 'bg-[var(--soft)] border border-[var(--line)] text-[var(--ink)] group-hover:bg-[var(--pop-bg)] group-hover:text-[var(--pop-ink)] group-hover:border-transparent'
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

  const cardClasses = `group lift press-soft relative w-full text-left rounded-2xl overflow-visible surface-card transition-all ${
    selected
      ? 'ring-2 ring-[#00B8D9] border-[var(--cyan)]'
      : 'hover:border-[var(--cyan)]/60'
  }`;

  return (
    <div style={style} className={`${compact ? 'pt-7' : 'pt-9'} ${className}`}>
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
