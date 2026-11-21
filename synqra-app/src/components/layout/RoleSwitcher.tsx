'use client';

import React, { useState } from 'react';
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
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] transition-colors text-left"
      >
        <span className="w-9 h-9 rounded-lg bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] font-heading font-extrabold text-xs flex items-center justify-center shrink-0">
          {activeRole.initials}
        </span>
        <div className="hidden sm:block leading-tight">
          <div className="font-heading font-bold text-sm text-[var(--ink)]">
            {activeRole.name}
          </div>
          <div className="text-xs font-semibold text-[var(--ink-soft)]">
            {activeRole.shortRole}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-[var(--ink-soft)] ml-1" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-xl p-3 z-40 animate-fade-in">
            <div className="font-heading text-xs font-extrabold uppercase tracking-wider text-[var(--cyan-dark)] px-2 pb-2 mb-2 border-b border-[var(--line-soft)]">
              Ganti Peran Demo Cepat
            </div>
            <div className="space-y-1.5">
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
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'bg-[var(--cyan-pale)] border-[var(--cyan)]/50'
                        : 'bg-[var(--soft)] border-transparent hover:border-[var(--line)] hover:bg-[var(--hover-bg)]'
                    }`}
                  >
                    <span className="w-9 h-9 rounded-lg bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center shrink-0">
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
