'use client';

import React from 'react';
import { MainPage, RoleInfo } from '@/types/synqra';
import {
  BarChart3,
  Home,
  Mic,
  Inbox,
  Layers,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  Plus,
} from 'lucide-react';

interface SidebarProps {
  activePage: MainPage;
  onNavigate: (page: MainPage) => void;
  roleInfo: RoleInfo;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  overdueCount: number;
  verifiedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  roleInfo,
  isDarkMode,
  onToggleTheme,
  onLogout,
  overdueCount,
  verifiedCount,
}) => {
  const navItems: {
    id: MainPage;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeTone?: 'red' | 'green';
  }[] = [
    { id: 'home', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'lapor', label: 'Lapor Cepat AI', icon: <Mic className="w-5 h-5" /> },
    {
      id: 'cases',
      label: 'Triage & Kasus',
      icon: <Inbox className="w-5 h-5" />,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : undefined,
      badgeTone: 'red',
    },
    {
      id: 'graph',
      label: 'Knowledge Graph',
      icon: <Layers className="w-5 h-5" />,
      badge: `${verifiedCount}`,
      badgeTone: 'green',
    },
    {
      id: 'tanya',
      label: 'Tanya SYNQRA',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'Analitik & ROI',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  const isNavActive = (id: MainPage) => {
    if (id === 'cases' && activePage === 'case-detail') return true;
    return activePage === id;
  };

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-[274px] shrink-0 bg-[var(--sidebar-bg)] border-r border-[var(--line)] px-4 py-6 sticky top-0 h-screen overflow-y-auto transition-colors">
        <div className="flex items-center gap-3 px-2 pb-6">
          <img
            src={isDarkMode ? '/assets/synqra-logo-dark.png' : '/assets/synqra-logo-light.png'}
            alt="SYNQRA Logo"
            className="w-11 h-11 object-contain rounded-xl p-1 bg-[var(--soft)] border border-[var(--line)]"
          />
          <div>
            <div className="font-heading font-extrabold text-xl tracking-wide text-[var(--ink)] leading-none">
              SYNQRA
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--cyan-dark)] mt-1">
              Industrial Knowledge
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] mb-6">
          <span className="w-10 h-10 rounded-xl bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
            {roleInfo.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-heading font-bold text-sm text-[var(--ink)] truncate">
              {roleInfo.name}
            </div>
            <div className="text-xs font-semibold text-[var(--ink-soft)] truncate">
              {roleInfo.shortRole}
            </div>
          </div>
        </div>

        <div className="font-heading text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--ink)] px-3 pb-2.5">
          WORKSPACE
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-[14.5px] transition-all text-left ${
                  active
                    ? 'bg-[var(--cyan-pale)] text-[var(--ink)] border border-[var(--cyan)]/40'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)] border border-transparent'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[var(--cyan-dark)]" />
                )}
                <span className={active ? 'text-[var(--cyan-dark)]' : ''}>{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span
                    style={
                      item.badgeTone === 'red'
                        ? {
                            backgroundColor: 'var(--red-bg)',
                            color: 'var(--red)',
                            borderColor: 'var(--red-border)',
                          }
                        : {
                            backgroundColor: 'var(--green-bg)',
                            color: 'var(--green)',
                            borderColor: 'var(--green-border)',
                          }
                    }
                    className="px-2 py-0.5 rounded-[6px] border font-heading text-[11px] font-bold"
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#0B1F44] to-[#14496D] text-white border border-cyan-400/25 shadow-sm">
          <div className="font-heading font-bold text-[15px] text-white mb-1">
            Temuan baru di lapangan?
          </div>
          <p className="text-[13px] text-slate-100/90 leading-relaxed mb-3">
            Rekam suara 2 menit atau scan nameplate alat — AI merapikan 7 entitas otomatis.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('lapor')}
            className="w-full py-2.5 px-3 rounded-xl bg-[#00B8D9] hover:bg-[#22D3EE] text-[#061A38] font-heading font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Buat Laporan</span>
          </button>
        </div>

        <div className="flex-1" />

        <div className="pt-4 mt-4 border-t border-[var(--line)] space-y-1.5">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)] font-bold text-sm transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#0B1F44]" />}
            <span className="flex-1 text-left">
              {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            </span>
            <span className="px-2 py-0.5 rounded-[6px] bg-[var(--soft)] border border-[var(--line)] font-heading text-[11px] font-bold text-[var(--cyan-dark)]">
              {isDarkMode ? 'DARK' : 'LIGHT'}
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)] font-bold text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Ganti Akun Login</span>
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--topbar-bg)] backdrop-blur-md border-t border-[var(--line)] flex justify-around py-2 px-1">
        {navItems.map((item) => {
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg font-heading text-[11px] font-bold transition-colors ${
                active ? 'text-[var(--cyan-dark)]' : 'text-[var(--ink-soft)]'
              }`}
            >
              {item.icon}
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
