'use client';

import React, { useEffect, useState } from 'react';
import { ROLES } from '@/lib/constants';
import { UserRole } from '@/types/synqra';
import { Check, ChevronDown, FileSearch, ShieldCheck, Wrench } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeRole = ROLES[currentRole];

  // Jakob's law: perilaku dropdown standar, tekan Esc untuk menutup menu.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const renderIcon = (role: UserRole) => {
    if (role === 'frontline_omi') return <Wrench className="w-4 h-4 text-[var(--cyan-dark)]" />;
    if (role === 'dept_reviewer') return <FileSearch className="w-4 h-4 text-[var(--info)]" />;
    return <ShieldCheck className="w-4 h-4 text-[var(--green)]" />;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2 sm:gap-2.5 p-0.5 sm:pl-1.5 sm:pr-3.5 sm:py-1.5 rounded-full surface-card hover:border-[var(--cyan)] text-left"
      >
        <span className="w-8 h-8 rounded-full pop-btn font-heading font-extrabold text-xs flex items-center justify-center shrink-0">
          {activeRole.initials}
        </span>
        <div className="hidden sm:block leading-tight">
          <div className="font-heading font-bold text-sm text-[var(--ink)]">
            {activeRole.name}
          </div>
          <div className="text-[11.5px] font-semibold text-[var(--ink-soft)]">
            {activeRole.shortRole}
          </div>
        </div>
        <ChevronDown
          className={`hidden sm:block w-4 h-4 text-[var(--ink-soft)] ml-0.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2.5 w-80 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--line)] shadow-[0_24px_60px_-15px_rgba(9,19,38,0.38)] p-3 z-40 animate-pop-origin">
            <div className="font-heading text-[11px] font-extrabold uppercase tracking-wider text-[var(--cyan-dark)] px-2.5 pb-2 mb-1.5 border-b border-[var(--line-soft)]">
              Ganti Peran
            </div>
            <div className="space-y-1">
              {Object.values(ROLES).map((r) => {
                const isSelected = r.key === currentRole;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      onRoleChange(r.key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-colors ${
                      isSelected
                        ? 'bg-[var(--cyan-pale)]'
                        : 'hover:bg-[var(--hover-bg)]'
                    }`}
                  >
                    <span className="w-9 h-9 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center shrink-0 shadow-sm">
                      {renderIcon(r.key)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                        {r.name}
                      </div>
                      <div className="text-xs font-semibold text-[var(--ink-soft)] truncate">
                        {r.roleTitle}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--cyan-dark)] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
