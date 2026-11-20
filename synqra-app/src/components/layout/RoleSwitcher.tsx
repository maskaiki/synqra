'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types/synqra';
import { ROLES } from '@/lib/constants';
import { Users, ChevronDown, Check, ShieldCheck, Wrench, FileSearch } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeRoleInfo = ROLES[currentRole];

  const getRoleIcon = (roleKey: UserRole) => {
    switch (roleKey) {
      case 'frontline_omi':
        return <Wrench className="w-4 h-4 text-cyan-400" />;
      case 'dept_reviewer':
        return <FileSearch className="w-4 h-4 text-sky-400" />;
      case 'hse_validator':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 hover:border-cyan-500 transition-all shadow-sm text-left"
      >
        <div className={`w-8 h-8 rounded-lg ${activeRoleInfo.avatarBg} text-white flex items-center justify-center font-['Poppins',sans-serif] font-bold text-xs shadow-inner`}>
          {activeRoleInfo.initials}
        </div>
        <div className="hidden sm:block leading-tight">
          <div className="font-['Poppins',sans-serif] font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            {activeRoleInfo.name}
            <span className="text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded font-extrabold">Demo</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {activeRoleInfo.roleTitle}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
              <span className="font-['Poppins',sans-serif] text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ganti Peran Demo
              </span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-1">
              {(Object.values(ROLES) as typeof activeRoleInfo[]).map((r) => {
                const isSelected = r.key === currentRole;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      onRoleChange(r.key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/10 border border-cyan-500/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${r.avatarBg} text-white flex items-center justify-center font-['Poppins',sans-serif] font-bold text-xs flex-shrink-0 mt-0.5`}>
                      {r.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-['Poppins',sans-serif] font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {r.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                      </div>
                      <div className="text-xs text-cyan-700 dark:text-cyan-400 font-semibold mt-0.5 flex items-center gap-1">
                        {getRoleIcon(r.key)}
                        <span className="truncate">{r.roleTitle}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {r.department}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3 py-1.5 text-[11px] text-slate-400">
              💡 Berganti peran akan mengubah hak akses aksi laporan secara instan.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
