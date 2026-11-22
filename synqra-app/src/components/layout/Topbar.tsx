'use client';

import React from 'react';
import { MainPage, UserRole } from '@/types/synqra';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
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
}

const PAGE_LABELS: Record<MainPage, string> = {
  home: 'Beranda',
  lapor: 'Lapor Cepat AI',
  cases: 'Triage & Kasus',
  'case-detail': 'Detail Investigasi & Validasi',
  graph: 'Knowledge Graph Aset',
  tanya: 'Tanya SYNQRA AI',
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
}) => {
  return (
    <header className="sticky top-0 z-20 h-[76px] bg-[var(--topbar-bg)] backdrop-blur-md border-b border-[var(--line)] px-4 sm:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={isDarkMode ? '/assets/synqra-logo-dark.png' : '/assets/synqra-logo-light.png'}
          alt="SYNQRA"
          className="lg:hidden w-9 h-9 object-contain rounded-lg p-1 bg-[var(--soft)] border border-[var(--line)] shrink-0"
        />
        <div className="flex items-center gap-2 font-heading text-sm sm:text-[15px] font-bold truncate">
          <span className="text-[var(--cyan-dark)] font-extrabold">Workspace</span>
          <span className="text-[var(--muted)]">/</span>
          <span className="text-[var(--ink)] font-extrabold truncate">
            {PAGE_LABELS[activePage]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span
          title={
            dataSource === 'supabase'
              ? 'Terhubung ke Supabase PostgreSQL Live'
              : 'Mode Persistensi Lokal Browser (siap sambung Supabase via .env.local)'
          }
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-[var(--cyan-pale)] border border-[var(--cyan)]/35 font-heading text-xs font-bold text-[var(--cyan-dark)]"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{dataSource === 'supabase' ? 'SUPABASE LIVE' : 'DEMO · LOCAL DB'}</span>
        </span>

        {dataSource === 'supabase' && (
          <button
            type="button"
            onClick={() => onSyncData?.()}
            disabled={isSyncing}
            title="Sinkronkan Data terbaru dari Supabase"
            className="min-h-[44px] px-3 py-2 rounded-[7px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] hover:bg-[var(--hover-bg)] flex items-center gap-1.5 text-[var(--ink)] font-heading text-xs font-bold disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 text-[var(--cyan-dark)] ${isSyncing ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline">
              {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data'}
            </span>
          </button>
        )}

        {dataSource === 'local' && (
          <button
            type="button"
            onClick={onResetDemo}
            title="Reset data demo ke kondisi awal"
            aria-label="Reset data demo"
            className="group w-11 h-11 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] flex items-center justify-center text-[var(--ink)]"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-90" />
          </button>
        )}

        <button
          type="button"
          onClick={onToggleTheme}
          title="Ubah Mode Terang / Gelap"
          aria-label="Ubah Mode Terang / Gelap"
          className="w-11 h-11 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] flex items-center justify-center text-[var(--ink)]"
        >
          <span key={isDarkMode ? 'sun' : 'moon'} className="animate-spin-in inline-flex">
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#0B1F44]" />
            )}
          </span>
        </button>

        <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  );
};
