'use client';

import React from 'react';
import { Radar, Scan, Search, Sparkles } from 'lucide-react';

interface SynqraLoaderProps {
  label: string;
  sublabel?: string;
  variant?: 'scan' | 'extract' | 'search' | 'radar';
  compact?: boolean;
}

export const SynqraLoader: React.FC<SynqraLoaderProps> = ({
  label,
  sublabel,
  variant = 'extract',
  compact = false,
}) => {
  const Icon =
    variant === 'scan'
      ? Scan
      : variant === 'search'
        ? Search
        : variant === 'radar'
          ? Radar
          : Sparkles;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`surface-card rounded-2xl border-l-[3.5px] border-l-[var(--cyan)] animate-fade-in ${
        compact
          ? 'p-4 flex items-center gap-4'
          : 'p-6 sm:p-7 flex flex-col items-center justify-center text-center gap-3.5'
      }`}
    >
      <div
        className={`relative flex items-center justify-center shrink-0 ${
          compact ? 'w-12 h-12' : 'w-16 h-16'
        }`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full orbital-pulse"
          style={{ background: 'var(--stage-gradient-active)' }}
        />
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full orbital-spin"
          aria-hidden="true"
        >
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="var(--line)"
            strokeWidth="2.5"
            strokeDasharray="4 5"
          />
          <path
            d="M32 6 A26 26 0 0 1 58 32"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="58" cy="32" r="3.4" fill="var(--cyan)" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[var(--cyan-dark)]">
          <Icon className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
        </span>
      </div>

      <div className={compact ? 'min-w-0 flex-1 space-y-0.5' : 'space-y-1 max-w-md'}>
        <div className="font-heading font-bold text-sm sm:text-[15px] text-[var(--ink)]">
          {label}
        </div>
        {sublabel && (
          <p className="text-sm text-[var(--ink-soft)] m-0 leading-snug">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
};
