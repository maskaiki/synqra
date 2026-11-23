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
      label: 'Peringatan Dini',
      icon: <Radar className="w-5 h-5" />,
    },
  ];

  const isNavActive = (id: MainPage) => {
    if (id === 'cases' && activePage === 'case-detail') return true;
    return activePage === id;
  };

  // Follow-through / moving in arcs: satu indikator aktif yang meluncur
  // antar menu (bukan muncul-hilang), sehingga mata mengikuti perpindahan.
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
      <aside className="hidden lg:flex lg:flex-col w-[268px] shrink-0 bg-[var(--sidebar-bg)] backdrop-blur-xl border-r border-[var(--line-soft)] px-4 py-6 sticky top-0 h-screen overflow-y-auto transition-colors">
        <div className="flex items-center gap-3 px-2 pb-6">
          <img
            src={isDarkMode ? '/assets/synqra-logo-dark.png' : '/assets/synqra-logo-light.png'}
            alt="SYNQRA Logo"
            className="w-11 h-11 object-contain rounded-xl p-1 bg-[var(--soft)] border border-[var(--line-soft)] shadow-sm"
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

        <div className="font-heading text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--muted)] px-3 pb-2.5">
          WORKSPACE
        </div>

        <nav ref={navRef} className="relative space-y-1">
          {indicator && (
            <span
              aria-hidden
              className="nav-indicator pointer-events-none absolute left-0 right-0 top-0 rounded-xl bg-gradient-to-r from-[var(--cyan-pale)] to-transparent border border-[var(--cyan)]/35 shadow-sm"
              style={{
                transform: `translateY(${indicator.top}px)`,
                height: indicator.height,
              }}
            >
              <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-[var(--cyan-dark)]" />
            </span>
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
                className={`relative z-[1] w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[14.5px] text-left border border-transparent ${
                  active
                    ? 'text-[var(--ink)]'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)]'
                }`}
              >
                <span
                  className={`transition-colors duration-200 ${active ? 'text-[var(--cyan-dark)]' : ''}`}
                >
                  {item.icon}
                </span>
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
                    className={`px-2 py-0.5 rounded-[7px] border border-l-[3px] font-heading text-[11px] font-bold ${
                      item.badgeTone === 'red' ? 'animate-ping-once' : ''
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="relative overflow-hidden mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#0A162B] via-[#0F274D] to-[#0B4A66] text-white border border-cyan-400/25 shadow-md">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#00B8D9]/20 blur-xl"
          />
          <div className="relative z-10 font-heading font-bold text-[15px] text-white mb-1">
            Temuan baru?
          </div>
          <p className="relative z-10 text-sm text-white/85 leading-snug mb-3.5 m-0">
            Scan alat atau rekam suara cepat.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('lapor')}
            className="relative z-10 group press-soft w-full py-2.5 px-3 rounded-xl bg-[#00C8EA] hover:bg-[#38DDF8] text-[#041529] font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
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
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)] font-bold text-sm transition-colors"
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
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)] font-bold text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Ganti Akun Login</span>
          </button>
        </div>
      </aside>

      {/* Mobile Floating Liquid-Glass Dock */}
      <nav
        aria-label="Navigasi Mobile"
        className="lg:hidden fixed bottom-3 left-3 right-3 z-30 rounded-2xl floating-glass shadow-[0_14px_34px_-12px_rgba(10,22,43,0.38)] flex items-center gap-1 p-1.5"
      >
        {navItems.map((item) => {
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
              className={`relative flex-1 min-h-[52px] flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-xl font-heading text-[11px] font-bold transition-all ${
                active
                  ? 'pop-btn shadow-md'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              <span key={active ? 'on' : 'off'} className={active ? 'animate-pop inline-flex' : 'inline-flex'}>
                {item.icon}
              </span>
              <span className="truncate max-w-full">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
