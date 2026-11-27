'use client';

import React from 'react';
import { Asset, MainPage, Report, UserRole } from '@/types/synqra';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { Database, Moon, RefreshCw, RotateCcw, Sun } from 'lucide-react';

interface TopbarProps {
  activePage: MainPage;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  dataSource: 'supabase' | 'local';
  onResetDemo: () => void;
  onSyncData?: () => void;
  isSyncing?: boolean;
  reports: Report[];
  assets: Asset[];
  onSelectReport: (report: Report) => void;
  onSendSlaReminder: (targets: Report[]) => void;
}

const PAGE_LABELS: Record<MainPage, string> = {
  home: 'Beranda',
  lapor: 'Lapor Cepat',
  cases: 'Triage & Kasus',
  'case-detail': 'Detail Kasus',
  graph: 'Knowledge Graph',
  tanya: 'Tanya SYNQRA',
  analytics: 'Peringatan Dini',
};

export const Topbar: React.FC<TopbarProps> = ({
  activePage,
  currentRole,
  onRoleChange,
  isDarkMode,
  onToggleTheme,
  dataSource,
  onResetDemo,
  onSyncData,
  isSyncing = false,
  reports,
  assets,
  onSelectReport,
  onSendSlaReminder,
}) => {
  return (
    <header className="sticky top-0 z-20 h-[72px] floating-glass border-x-0 border-t-0 border-b border-[var(--line-soft)] px-4 sm:px-8 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <img
          src={isDarkMode ? '/assets/synqra-logo-dark.png' : '/assets/synqra-logo-light.png'}
          alt="SYNQRA"
          className="lg:hidden w-8 h-8 object-contain shrink-0 mix-blend-multiply dark:mix-blend-normal"
        />
        <div className="flex items-center gap-2 font-heading text-[15px] font-bold min-w-0">
          <span className="hidden sm:inline text-[var(--cyan-dark)] font-extrabold shrink-0">
            Unit 11 CDU · Balongan
          </span>
          <span className="hidden sm:inline text-[var(--muted)] shrink-0">/</span>
          <span className="text-[var(--ink)] font-extrabold truncate">
            {PAGE_LABELS[activePage]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {dataSource === 'supabase' && (
          <span
            title="Terhubung ke Supabase PostgreSQL Live"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-heading font-bold text-[var(--cyan-dark)]"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Live</span>
          </span>
        )}

        {dataSource === 'supabase' && (
          <button
            type="button"
            onClick={() => onSyncData?.()}
            disabled={isSyncing}
            title="Sinkronkan Data terbaru"
            aria-label="Sinkronkan Data"
            className="hidden sm:flex w-11 h-11 rounded-full surface-card hover:border-[var(--cyan)] items-center justify-center text-[var(--ink)] disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 text-[var(--cyan-dark)] ${isSyncing ? 'animate-spin' : ''}`}
            />
          </button>
        )}

        {dataSource === 'local' && (
          <button
            type="button"
            onClick={onResetDemo}
            title="Reset data awal"
            aria-label="Reset data awal"
            className="hidden sm:flex group w-11 h-11 rounded-full surface-card hover:border-[var(--cyan)] items-center justify-center text-[var(--ink)]"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-90" />
          </button>
        )}

        <NotificationBell
          reports={reports}
          assets={assets}
          currentUserRole={currentRole}
          onSelectReport={onSelectReport}
          onSendReminder={onSendSlaReminder}
        />

        <button
          type="button"
          onClick={onToggleTheme}
          title="Ubah Mode Terang / Gelap"
          aria-label="Ubah Mode Terang / Gelap"
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full surface-card hover:border-[var(--cyan)] flex items-center justify-center text-[var(--ink)]"
        >
          <span key={isDarkMode ? 'sun' : 'moon'} className="animate-spin-in inline-flex">
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--ink)]" />
            )}
          </span>
        </button>

        <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  );
};
