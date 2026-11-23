'use client';

import React, { useState } from 'react';
import { ROLES } from '@/lib/constants';
import { BRAND_MEDIA } from '@/lib/mediaAssets';
import { UserRole } from '@/types/synqra';
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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
      {/* Left Hero Visual Panel */}
      <section className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative overflow-hidden flex-col justify-between p-12 xl:p-16 bg-[#07152F] text-white">
        {/* Foto Latar Oil Rig Senja (WebP teroptimasi) */}
        <img
          src={BRAND_MEDIA.loginHeroOilRig.src}
          alt=""
          aria-hidden="true"
          width={BRAND_MEDIA.loginHeroOilRig.width}
          height={BRAND_MEDIA.loginHeroOilRig.height}
          loading="eager"
          decoding="async"
          className="pointer-events-none absolute inset-0 w-full h-full object-cover object-[52%_62%] scale-[1.02] select-none"
        />

        {/* Lapisan Gradasi Biru Navy & Teal untuk Keharmonisan Warna & Kontras Teks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#051026]/90 via-[#0A2245]/68 to-[#063A52]/62"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040D1F]/88 via-transparent to-[#040D1F]/60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-1/4 w-[420px] h-[420px] rounded-full bg-[#00B8D9]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-44 top-12 w-[560px] h-[560px] rounded-full border border-cyan-300/15"
        />

        <div className="relative z-10 flex items-center gap-3.5">
          <img
            src="/assets/synqra-logo-dark.png"
            alt="Logo SYNQRA"
            className="w-12 h-12 object-contain shrink-0 drop-shadow-[0_4px_16px_rgba(0,200,234,0.38)]"
          />
          <div>
            <div className="font-heading font-extrabold text-2xl tracking-wider text-white">
              SYNQRA
            </div>
            <div className="text-xs font-semibold tracking-widest uppercase text-cyan-200/95">
              Intelligence, Connected by Evidence
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-xl my-auto py-12 space-y-5 stagger">
          <div
            style={{ '--i': 0 } as React.CSSProperties}
            className="w-12 h-[3px] rounded-[2px] bg-[#00B8D9]"
          />
          <h1
            style={{ '--i': 1 } as React.CSSProperties}
            className="font-heading text-4xl xl:text-5xl font-bold leading-tight text-white drop-shadow-[0_4px_20px_rgba(4,13,31,0.75)]"
          >
            Dari temuan lapangan,
            <br />
            <span className="text-[#38D6F0]">menjadi pengetahuan.</span>
          </h1>
          <p
            style={{ '--i': 2 } as React.CSSProperties}
            className="text-base xl:text-lg text-white/95 leading-relaxed font-medium max-w-lg drop-shadow-[0_2px_12px_rgba(4,13,31,0.85)]"
          >
            Hubungkan laporan suara, validasi bukti pakar, dan peta pengetahuan aset.
          </p>
        </div>

        <div className="relative z-10 text-sm text-white/85 font-medium">
          © 2026 SYNQRA · Evidence-Based Reliability &amp; Process Safety Platform
        </div>
      </section>

      {/* Right Login Card Panel */}
      <section className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center p-6 sm:p-12">
        <button
          type="button"
          onClick={onToggleTheme}
          title="Ubah Mode Terang / Gelap"
          aria-label="Ubah Mode Terang / Gelap"
          className="absolute top-6 right-6 w-11 h-11 rounded-full surface-card hover:border-[var(--cyan)] flex items-center justify-center text-[var(--ink)]"
        >
          <span key={isDarkMode ? 'sun' : 'moon'} className="animate-spin-in inline-flex">
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-[#0B1F44]" />
            )}
          </span>
        </button>

        <div className="w-full max-w-md animate-fade-in">
          <div className="flex lg:hidden items-center gap-3 mb-7">
            <img
              src={isDarkMode ? '/assets/synqra-logo-dark.png' : '/assets/synqra-logo-light.png'}
              alt="Logo SYNQRA"
              className="w-10 h-10 object-contain shrink-0 mix-blend-multiply dark:mix-blend-normal"
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
              <div className="block text-sm font-bold text-[var(--ink)] mb-2.5">
                Pilih Persona Demo
              </div>
              <div className="space-y-2.5 stagger" role="radiogroup" aria-label="Pilih Persona Demo">
                {Object.values(ROLES).map((r, idx) => {
                  const isActive = roleChoice === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      style={{ '--i': idx + 1 } as React.CSSProperties}
                      onClick={() => setRoleChoice(r.key)}
                      className={`press-soft w-full flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all ${
                        isActive
                          ? 'surface-card ring-2 ring-[#00B8D9] shadow-md'
                          : 'surface-card hover:bg-[var(--hover-bg)]'
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
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isActive
                            ? 'bg-[var(--cyan-dark)] border-[var(--cyan-dark)] text-white dark:bg-[var(--cyan)] dark:border-[var(--cyan)] dark:text-[#061830]'
                            : 'border-[var(--line)]'
                        }`}
                      >
                        {isActive && <Check className="w-4 h-4 stroke-[3] animate-pop" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="synqra-login-email"
                  className="block text-sm font-bold text-[var(--ink)] mb-1.5"
                >
                  Email Perusahaan
                </label>
                <input
                  id="synqra-login-email"
                  type="email"
                  readOnly
                  value={currentRoleInfo.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-semibold"
                />
              </div>
              <div>
                <label
                  htmlFor="synqra-login-dept"
                  className="block text-sm font-bold text-[var(--ink)] mb-1.5"
                >
                  Departemen
                </label>
                <input
                  id="synqra-login-dept"
                  type="text"
                  readOnly
                  value={currentRoleInfo.department}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group press-soft pop-btn w-full py-3.5 px-5 rounded-full font-heading font-bold text-[15px] flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
            >
              <span>Masuk ke Workspace</span>
              <ArrowRight className="w-5 h-5 nudge-x" />
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2.5 text-sm text-[var(--ink-soft)] px-1">
            <ShieldCheck className="w-5 h-5 text-[var(--cyan-dark)] shrink-0 mt-0.5" />
            <span>
              Bisa ganti peran kapan saja dari pojok kanan atas tanpa keluar.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};
