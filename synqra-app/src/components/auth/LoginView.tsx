'use client';

import React, { useState } from 'react';
import { ROLES } from '@/lib/constants';
import { UserRole } from '@/types/synqra';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { ArrowRight, Check, Moon, ShieldCheck, Sun } from 'lucide-react';

interface LoginViewProps {
  selectedRole: UserRole;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogin: (role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  selectedRole,
  isDarkMode,
  onToggleTheme,
  onLogin,
}) => {
  const [roleChoice, setRoleChoice] = useState<UserRole>(selectedRole);
  const currentRoleInfo = ROLES[roleChoice];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(roleChoice);
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[var(--surface)]">
      {/* Left Hero Visual Panel */}
      <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative overflow-hidden flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-[#07152F] via-[#0E2B52] to-[#084E69] text-white">
        <div className="pointer-events-none absolute -right-44 top-12 w-[560px] h-[560px] rounded-full border border-cyan-300/20" />
        <div className="pointer-events-none absolute -right-24 top-32 w-[380px] h-[380px] rounded-full border border-cyan-300/15" />

        <div className="relative z-10 flex items-center gap-4">
          <img
            src="/assets/synqra-logo-dark.png"
            alt="Logo SYNQRA"
            className="w-14 h-14 object-contain rounded-xl p-1.5 bg-white/10 border border-white/20"
          />
          <div>
            <div className="font-heading font-extrabold text-2xl tracking-wider text-white">
              SYNQRA
            </div>
            <div className="text-xs font-semibold tracking-widest uppercase text-cyan-200/90">
              Intelligence, Connected by Evidence
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-xl my-8 space-y-5">
          <h1 className="font-heading text-4xl xl:text-5xl font-bold leading-tight text-white">
            Dari temuan lapangan,
            <br />
            <span className="text-cyan-300">menjadi pengetahuan.</span>
          </h1>
          <p className="text-base text-white/90 leading-relaxed font-medium">
            Hubungkan laporan suara, validasi bukti pakar, dan peta pengetahuan aset.
          </p>

          <div className="mt-6 p-5 rounded-2xl bg-[#071630]/65 border border-cyan-300/25 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-cyan-300">
                Aset Terpantau
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                P-101A · E-201 · FCV-301
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <TechnicalArt type="pump" darkMode={true} className="w-full h-16" />
                <div className="font-heading text-xs font-bold text-white mt-1">P-101A</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <TechnicalArt type="heat" darkMode={true} className="w-full h-16" />
                <div className="font-heading text-xs font-bold text-white mt-1">E-201</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <TechnicalArt type="valve" darkMode={true} className="w-full h-16" />
                <div className="font-heading text-xs font-bold text-white mt-1">FCV-301</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/80 font-medium">
          © 2026 SYNQRA · Evidence-Based Reliability &amp; Process Safety Platform
        </div>
      </section>

      {/* Right Login Card Panel */}
      <section className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center p-6 sm:p-12 bg-[var(--surface)]">
        <button
          type="button"
          onClick={onToggleTheme}
          title="Ubah Mode Terang / Gelap"
          className="absolute top-6 right-6 w-11 h-11 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] flex items-center justify-center text-[var(--ink)] transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#0B1F44]" />}
        </button>

        <div className="w-full max-w-md animate-fade-in">
          <div className="flex lg:hidden items-center gap-3 mb-7">
            <img
              src={isDarkMode ? '/assets/synqra-logo-dark.png' : '/assets/synqra-logo-light.png'}
              alt="Logo SYNQRA"
              className="w-12 h-12 object-contain rounded-xl p-1 bg-[var(--soft)] border border-[var(--line)]"
            />
            <div>
              <div className="font-heading font-extrabold text-xl text-[var(--ink)]">SYNQRA</div>
              <div className="text-xs font-semibold text-[var(--cyan-dark)] uppercase tracking-wider">
                Intelligence, Connected by Evidence
              </div>
            </div>
          </div>

          <h2 className="font-heading text-3xl font-bold text-[var(--ink)] mb-2">
            Selamat datang
          </h2>
          <p className="text-[15px] text-[var(--ink-soft)] mb-6">
            Pilih peran pengguna untuk masuk ke workspace SYNQRA.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[var(--ink)] mb-2.5">
                Pilih Persona Demo
              </label>
              <div className="space-y-2.5">
                {Object.values(ROLES).map((r) => {
                  const isActive = roleChoice === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRoleChoice(r.key)}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all ${
                        isActive
                          ? 'border-[var(--cyan)] bg-[var(--cyan-pale)] shadow-sm'
                          : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)]/60 hover:bg-[var(--hover-bg)]'
                      }`}
                    >
                      <span className="w-11 h-11 rounded-xl bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
                        {r.initials}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-heading font-bold text-[15px] text-[var(--ink)] truncate">
                          {r.name}
                        </div>
                        <div className="text-sm font-semibold text-[var(--ink-soft)] truncate">
                          {r.roleTitle}
                        </div>
                      </div>
                      <span
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[var(--cyan-dark)] border-[var(--cyan-dark)] text-white dark:bg-[var(--cyan)] dark:border-[var(--cyan)] dark:text-[#061830]'
                            : 'border-[var(--line)]'
                        }`}
                      >
                        {isActive && <Check className="w-4 h-4 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                  Email Perusahaan
                </label>
                <input
                  type="email"
                  readOnly
                  value={currentRoleInfo.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                  Departemen
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentRoleInfo.department}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-[15px] flex items-center justify-center gap-2.5 shadow-md transition-all"
            >
              <span>Masuk ke Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-5 p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] flex items-start gap-2.5 text-sm text-[var(--ink-soft)]">
            <ShieldCheck className="w-5 h-5 text-[var(--cyan-dark)] shrink-0 mt-0.5" />
            <span>
              Anda juga dapat berpindah peran kapan saja langsung dari pojok kanan atas tanpa perlu keluar.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};
