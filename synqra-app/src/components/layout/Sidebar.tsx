'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MainPage, RoleInfo } from '@/types/synqra';
import {
  Radar,
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
  roleInfo?: RoleInfo;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  overdueCount: number;
  verifiedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onLogout,
  overdueCount,
  verifiedCount,
}) => {
  const navItems: {
    id: MainPage;
    label: string;
    mobileLabel: string;
    icon: React.ReactNode;
    dotTone?: 'red';
    count?: number;
  }[] = [
    { id: 'home', label: 'Beranda', mobileLabel: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'lapor', label: 'Lapor Cepat', mobileLabel: 'Lapor', icon: <Mic className="w-5 h-5" /> },
    {
      id: 'cases',
      label: 'Triage & Kasus',
      mobileLabel: 'Triage',
      icon: <Inbox className="w-5 h-5" />,
      dotTone: overdueCount > 0 ? 'red' : undefined,
      count: overdueCount > 0 ? overdueCount : undefined,
    },
    {
      id: 'graph',
      label: 'Knowledge Graph',
      mobileLabel: 'Graph',
      icon: <Layers className="w-5 h-5" />,
      count: verifiedCount,
    },
    {
      id: 'tanya',
      label: 'Tanya SYNQRA',
      mobileLabel: 'Tanya',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'Peringatan Dini',
      mobileLabel: 'Sinyal',
      icon: <Radar className="w-5 h-5" />,
    },
  ];

  const isNavActive = (id: MainPage) => {
    if (id === 'cases' && activePage === 'case-detail') return true;
    return activePage === id;
  };

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Partial<Record<MainPage, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);
  const activeNavId: MainPage = activePage === 'case-detail' ? 'cases' : activePage;

  useEffect(() => {
    const measure = () => {
      const el = itemRefs.current[activeNavId];
      if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeNavId, overdueCount, verifiedCount]);

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-[260px] shrink-0 bg-[var(--sidebar-bg)] backdrop-blur-2xl border-r border-[var(--line-soft)] px-4 py-6 sticky top-0 h-screen overflow-y-auto transition-colors">
        {/* Seamless Logo tanpa kotak cangkang */}
        <div className="flex items-center gap-3 px-2.5 pb-7">
          <img
            src={isDarkMode ? '/assets/synqra-logo-dark.png' : '/assets/synqra-logo-light.png'}
            alt="SYNQRA Logo"
            className="w-10 h-10 object-contain shrink-0 mix-blend-multiply dark:mix-blend-normal"
          />
          <div>
            <div className="font-heading font-extrabold text-[21px] tracking-wide text-[var(--ink)] leading-none">
              SYNQRA
            </div>
            <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--cyan-dark)] mt-1">
              Industrial Knowledge
            </div>
          </div>
        </div>

        <nav ref={navRef} className="relative space-y-1">
          {indicator && (
            <span
              aria-hidden
              className="nav-indicator pointer-events-none absolute left-0 right-0 top-0 rounded-2xl pop-btn shadow-md"
              style={{
                transform: `translateY(${indicator.top}px)`,
                height: indicator.height,
              }}
            />
          )}
          {navItems.map((item) => {
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
                className={`relative z-[1] w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-heading font-bold text-[14px] text-left transition-colors ${
                  active
                    ? 'text-[var(--pop-ink)]'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)]'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.dotTone === 'red' && item.count ? (
                  <span
                    title={`${item.count} kasus overdue`}
                    className={`font-heading text-xs font-extrabold ${
                      active ? 'text-[var(--pop-ink)]' : 'text-[var(--red)]'
                    }`}
                  >
                    {item.count}
                  </span>
                ) : typeof item.count === 'number' ? (
                  <span
                    className={`font-heading text-xs font-bold ${
                      active ? 'opacity-80' : 'text-[var(--muted)]'
                    }`}
                  >
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="relative overflow-hidden mt-7 p-4 rounded-3xl bg-gradient-to-br from-[#071530] via-[#0E2C5E] to-[#0B5A78] text-white shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#00C8EA]/25 blur-2xl"
          />
          <div className="relative z-10 font-heading font-bold text-[15px] text-white mb-3">
            Ada temuan baru?
          </div>
          <button
            type="button"
            onClick={() => onNavigate('lapor')}
            className="relative z-10 group press-soft w-full py-2.5 px-3.5 rounded-full bg-[#00C8EA] hover:bg-[#3CE2FF] text-[#041326] font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5] spin-on-hover" />
            <span>Buat Laporan</span>
          </button>
        </div>

        <div className="flex-1" />

        <div className="pt-4 mt-4 border-t border-[var(--line-soft)] space-y-1">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)] font-bold text-sm transition-colors"
          >
            <span key={isDarkMode ? 'sun' : 'moon'} className="animate-spin-in inline-flex">
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[var(--ink)]" />}
            </span>
            <span className="flex-1 text-left">
              {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)] font-bold text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Ganti Akun</span>
          </button>
        </div>
      </aside>

      {/* Mobile Floating Liquid-Glass Dock */}
      <nav
        aria-label="Navigasi Mobile"
        className="lg:hidden fixed bottom-3 left-3 right-3 z-30 rounded-[26px] floating-glass shadow-[0_16px_36px_-12px_rgba(9,19,38,0.40)] flex items-center gap-1 p-1.5"
      >
        {navItems.map((item) => {
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
              className={`relative flex-1 min-w-0 min-h-[50px] flex flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 rounded-[20px] font-heading text-[10px] font-bold transition-all ${
                active
                  ? 'pop-btn shadow-md'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              <span key={active ? 'on' : 'off'} className={active ? 'animate-pop inline-flex' : 'inline-flex'}>
                {item.icon}
              </span>
              <span className="truncate max-w-full">{item.mobileLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
