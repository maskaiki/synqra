'use client';

import React, { useEffect, useId, useRef } from 'react';
import { Report, RoleInfo, WorkerLearningState } from '@/types/synqra';
import {
  computeShiftStandings,
  getTierForPoints,
  POINT_TIERS,
  ROLE_SHIFT_MAP,
} from '@/lib/learningEngine';
import {
  Award,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  Gift,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

interface CompetencyPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSimulation: () => void;
  roleInfo: RoleInfo;
  learningState: WorkerLearningState;
  reports: Report[];
}

export const CompetencyPassportModal: React.FC<CompetencyPassportModalProps> = ({
  isOpen,
  onClose,
  onStartSimulation,
  roleInfo,
  learningState,
  reports,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Fallback light-dismiss for browsers without native dialog closedby="any"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || typeof HTMLDialogElement === 'undefined') return;
    if ('closedBy' in HTMLDialogElement.prototype) return;

    let startedOutside = false;

    const isOutside = (e: MouseEvent | PointerEvent) => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    const handlePointerDown = (e: PointerEvent) => {
      startedOutside = isOutside(e);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (startedOutside && isOutside(e)) {
        dialog.close();
      }
      startedOutside = false;
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const totalPoints = learningState.pointsByRole[roleInfo.key] || 0;
  const currentTier = getTierForPoints(totalPoints);
  const pointsToNext = currentTier.nextThreshold
    ? Math.max(0, currentTier.nextThreshold - totalPoints)
    : 0;
  const progressPct = currentTier.nextThreshold
    ? Math.min(
        100,
        Math.max(
          8,
          Math.round(
            ((totalPoints - currentTier.minPoints) /
              Math.max(1, currentTier.nextThreshold - currentTier.minPoints)) *
              100
          )
        )
      )
    : 100;

  const estimatedJplHours = (totalPoints / 40).toFixed(1).replace('.', ',');
  const verifiedContributions = reports.filter(
    (r) =>
      r.status === 'VERIFIED' &&
      (r.reporter_role === roleInfo.key ||
        r.reporter_name.toLowerCase() === roleInfo.name.toLowerCase() ||
        r.verified_by?.toLowerCase() === roleInfo.name.toLowerCase())
  ).length;

  const standings = computeShiftStandings(learningState, roleInfo.key);
  const activeShiftTeam = ROLE_SHIFT_MAP[roleInfo.key];
  const topTeamAvg = standings[0]?.averagePoints || 1;
  const recentEntries = learningState.ledger
    .filter((entry) => entry.userRole === roleInfo.key)
    .slice(0, 5);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onClose={() => {
        if (dialogRef.current) {
          dialogRef.current.returnValue = '';
        }
        onClose();
      }}
      {...({ closedby: 'any' } as React.HTMLAttributes<HTMLDialogElement>)}
      className="m-auto w-[calc(100%-1.5rem)] max-w-3xl p-0 rounded-3xl bg-[var(--surface-elevated)] text-[var(--ink)] border border-[var(--line)] shadow-2xl overflow-hidden animate-modal"
    >
      {/* Header */}
      <div
        style={{ background: 'var(--stage-gradient)' }}
        className="p-5 sm:p-6 border-b border-[var(--line-soft)] flex items-start justify-between gap-4"
      >
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              style={{
                backgroundColor: currentTier.badgeBg,
                color: currentTier.badgeColor,
                borderColor: currentTier.badgeBorder,
                borderLeftColor: currentTier.badgeBorder,
              }}
              className="px-2.5 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-extrabold uppercase tracking-wider"
            >
              Level {currentTier.label}
            </span>
            <span
              style={{
                backgroundColor: 'var(--green-bg)',
                color: 'var(--green)',
                borderColor: 'var(--green-border)',
                borderLeftColor: 'var(--green)',
              }}
              className="px-2.5 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Penalty · Just Culture</span>
            </span>
          </div>

          <h1
            id={headingId}
            className="font-heading text-xl sm:text-2xl font-bold text-[var(--ink)] m-0"
          >
            Paspor Kompetensi &amp; Poin Regu
          </h1>
          <p className="text-sm text-[var(--ink-soft)] m-0">
            {roleInfo.name} · {roleInfo.shortRole} · {activeShiftTeam}
          </p>
        </div>

        <form method="dialog" className="shrink-0">
          <button
            type="submit"
            autoFocus
            aria-label="Tutup Paspor Kompetensi"
            className="group w-11 h-11 rounded-full border border-[var(--line-soft)] bg-[var(--surface)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--cyan)] shadow-sm"
          >
            <X className="w-5 h-5 spin-on-hover" />
          </button>
        </form>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 space-y-6 max-h-[76vh] overflow-y-auto">
        {/* Progress Akumulasi */}
        <section className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="font-heading text-xs font-extrabold uppercase tracking-wider text-[var(--cyan-dark)]">
                Akumulasi Bulan Berjalan
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--ink)] mt-0.5">
                {totalPoints}{' '}
                <span className="text-base font-bold text-[var(--ink-soft)]">Poin</span>
              </div>
            </div>

            <div className="text-sm font-semibold text-[var(--ink-soft)] sm:text-right">
              {currentTier.nextThreshold && currentTier.nextLabel ? (
                <span>
                  Butuh <b className="text-[var(--ink)]">{pointsToNext} poin</b> lagi menuju{' '}
                  <b className="text-[var(--cyan-dark)]">{currentTier.nextLabel}</b> (
                  {currentTier.nextThreshold} poin)
                </span>
              ) : (
                <span style={{ color: 'var(--green)' }} className="font-bold">
                  Level tertinggi bulan ini tercapai (Safety Champion)
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-3 rounded-[6px] bg-[var(--surface)] border border-[var(--line-soft)] overflow-hidden">
            <div
              className="h-full bg-[#00B8D9] transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {POINT_TIERS.map((tier) => {
              const reached = totalPoints >= tier.minPoints;
              return (
                <div
                  key={tier.key}
                  className={`px-3 py-2 rounded-[7px] border border-l-[3.5px] text-sm ${
                    reached
                      ? 'bg-[var(--surface)] border-[var(--cyan)]/40 border-l-[var(--cyan-dark)] text-[var(--ink)]'
                      : 'bg-[var(--surface)]/55 border-[var(--line-soft)] border-l-[var(--muted)] text-[var(--ink-soft)]'
                  }`}
                >
                  <div className="font-heading text-xs font-extrabold">{tier.label}</div>
                  <div className="text-sm font-bold">{tier.minPoints}+ Poin</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3 Kartu Konversi Manfaat Nyata */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-base font-bold text-[var(--ink)] m-0">
              Konversi Manfaat Nyata (Karyawan &amp; Mitra Kerja)
            </h2>
            <span className="text-sm font-semibold text-[var(--ink-soft)]">
              Tanpa Pemotongan Poin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-[var(--ink)]">
                <BookOpenCheck className="w-4 h-4 text-[var(--cyan-dark)] shrink-0" />
                <span>Kredit KPI K3 &amp; JPL</span>
              </div>
              <div className="font-heading text-xl font-extrabold text-[var(--cyan-dark)]">
                {estimatedJplHours} JPL Tercatat
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                Otomatis terhitung sebagai jam belajar mikro &amp; indikator proaktif PEKA pada rapor kinerja tahunan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-[var(--ink)]">
                <Briefcase className="w-4 h-4 text-[var(--cyan-dark)] shrink-0" />
                <span>Sertifikasi &amp; CSMS</span>
              </div>
              <div className="font-heading text-xl font-extrabold text-[var(--ink)]">
                {verifiedContributions} Bukti Verified
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                Prioritas antrean sertifikasi (API/BNSP) di level Teladan &amp; portofolio kompetensi kru vendor CSMS.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
              <div className="flex items-center gap-2 font-heading text-sm font-bold text-[var(--ink)]">
                <Gift className="w-4 h-4 text-[var(--cyan-dark)] shrink-0" />
                <span>Grand Safety Talk</span>
              </div>
              <div className="font-heading text-xl font-extrabold text-[var(--ink)]">
                Target 520 Poin
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                Apresiasi bulanan saldo koperasi pekerja &amp; dana apresiasi kolektif bagi Regu Shift terbaik.
              </p>
            </div>
          </div>
        </section>

        {/* Papan Kolaborasi Regu Shift */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--cyan-dark)]" />
              <h2 className="font-heading text-base font-bold text-[var(--ink)] m-0">
                Papan Kolaborasi Regu Shift Unit 11 CDU
              </h2>
            </div>
            <span className="text-sm text-[var(--ink-soft)]">
              Rata-rata per regu (privasi individu terjaga sesuai UU PDP)
            </span>
          </div>

          <div className="space-y-2.5">
            {standings.map((row, idx) => {
              const barPct = Math.max(20, Math.round((row.averagePoints / topTeamAvg) * 100));
              return (
                <div
                  key={row.shiftName}
                  className={`p-3.5 rounded-2xl border ${
                    row.isCurrentUserShift
                      ? 'bg-[var(--cyan-pale)]/55 border-[var(--cyan)]'
                      : 'bg-[var(--soft)] border-[var(--line)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-[7px] pop-btn font-heading text-xs font-extrabold flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-heading text-sm font-bold text-[var(--ink)]">
                        {row.shiftName}
                      </span>
                      {row.isCurrentUserShift && (
                        <span className="px-2 py-0.5 rounded-[7px] border border-l-[3.5px] border-[var(--cyan)] border-l-[var(--cyan-dark)] bg-[var(--surface)] font-heading text-xs font-bold text-[var(--cyan-dark)]">
                          Regu Anda
                        </span>
                      )}
                    </div>
                    <span className="font-heading text-sm font-extrabold text-[var(--ink)]">
                      Rata-rata {row.averagePoints} Poin ({row.memberCount} personel)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-[4px] bg-[var(--surface)] overflow-hidden">
                    <div
                      className="h-full bg-[#00B8D9] transition-all duration-500"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Riwayat Perolehan Poin Terbaru */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--cyan-dark)]" />
              <h2 className="font-heading text-base font-bold text-[var(--ink)] m-0">
                Riwayat Perolehan Poin Terbaru
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartSimulation();
              }}
              className="group press-soft pop-btn px-4 py-2 rounded-full font-heading text-sm font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 spin-on-hover" />
              <span>Simulasi Kasus (+13 Poin)</span>
            </button>
          </div>

          <div className="divide-y divide-[var(--line-soft)] rounded-2xl bg-[var(--soft)] border border-[var(--line)] px-4">
            {recentEntries.length > 0 ? (
              recentEntries.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: 'var(--green)' }}
                    />
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-[var(--ink)]">
                        {item.label}
                      </div>
                      <p className="text-sm text-[var(--ink-soft)] m-0 leading-snug">
                        {item.shiftGroup}
                        {item.referenceId ? ` · Referensi ${item.referenceId}` : ''}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: 'var(--green-bg)',
                      color: 'var(--green)',
                      borderColor: 'var(--green-border)',
                      borderLeftColor: 'var(--green)',
                    }}
                    className="px-2.5 py-0.5 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-extrabold whitespace-nowrap shrink-0"
                  >
                    +{item.points} Poin
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-[var(--ink-soft)] m-0">
                Belum ada aktivitas baru hari ini. Konfirmasi Briefing Shift di Beranda atau buka Simulasi Kasus untuk menambah poin.
              </p>
            )}
          </div>
        </section>
      </div>
    </dialog>
  );
};
