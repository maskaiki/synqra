'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Asset,
  CaseSimulationPayload,
  Evidence,
  Report,
  SimulationDisciplineFilter,
} from '@/types/synqra';
import {
  buildLocalCaseSimulation,
  filterVerifiedCasesByDiscipline,
} from '@/lib/learningEngine';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SynqraLoader } from '@/components/ui/SynqraLoader';
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CaseSimulationTabProps {
  assets: Asset[];
  reports: Report[];
  evidences: Evidence[];
  completedCaseIds: string[];
  onCompleteSimulation: (
    reportId: string,
    earnedPoints: number,
    correctCount: number
  ) => void;
  onOpenReport: (report: Report) => void;
}

const DISCIPLINE_OPTIONS: Array<{
  id: SimulationDisciplineFilter;
  label: string;
}> = [
  { id: 'all', label: 'Semua Unit 11' },
  { id: 'rotating', label: 'Rotating & Pompa' },
  { id: 'static', label: 'Statik & Termal' },
  { id: 'instrument', label: 'Instrumen & Katup' },
];

export const CaseSimulationTab: React.FC<CaseSimulationTabProps> = ({
  assets,
  reports,
  evidences,
  completedCaseIds,
  onCompleteSimulation,
  onOpenReport,
}) => {
  const [discipline, setDiscipline] = useState<SimulationDisciplineFilter>('all');
  const [caseIdx, setCaseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [aiOverride, setAiOverride] = useState<CaseSimulationPayload | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [rewardClaimedForSession, setRewardClaimedForSession] = useState(false);

  const verifiedCases = useMemo(
    () => filterVerifiedCasesByDiscipline(reports, assets, discipline),
    [reports, assets, discipline]
  );

  const safeCaseIndex = verifiedCases.length > 0 ? caseIdx % verifiedCases.length : 0;
  const activeCase = verifiedCases[safeCaseIndex];

  const baseSimulation = useMemo(
    () =>
      activeCase
        ? buildLocalCaseSimulation(activeCase, reports, assets, evidences)
        : null,
    [activeCase, reports, assets, evidences]
  );

  const simulation =
    aiOverride && aiOverride.reportId === activeCase?.id
      ? aiOverride
      : baseSimulation;

  useEffect(() => {
    setStepIdx(0);
    setAnswers({});
    setAiOverride(null);
    setRewardClaimedForSession(false);
  }, [activeCase?.id, discipline]);

  if (!activeCase || !simulation) {
    return (
      <div className="surface-card p-6 rounded-3xl text-sm text-[var(--ink-soft)]">
        Belum ada kasus berstatus TERVERIFIKASI untuk simulasi.
      </div>
    );
  }

  const totalSteps = simulation.steps.length;
  const isFinished = stepIdx >= totalSteps;
  const currentStep = simulation.steps[Math.min(stepIdx, totalSteps - 1)];
  const selectedOptIdx = answers[stepIdx];
  const isStepAnswered = typeof selectedOptIdx === 'number';

  const correctCount = simulation.steps.reduce((sum, step, idx) => {
    const chosenIdx = answers[idx];
    return typeof chosenIdx === 'number' && step.options[chosenIdx]?.isCorrect
      ? sum + 1
      : sum;
  }, 0);
  const potentialPoints = 3 + correctCount * 2;
  const alreadyCompletedBefore = completedCaseIds.includes(activeCase.id);

  const handleSelectOption = (optIdx: number) => {
    if (isStepAnswered) return;
    setAnswers((prev) => ({ ...prev, [stepIdx]: optIdx }));
  };

  const handleAdvanceStep = () => {
    const nextIdx = stepIdx + 1;
    setStepIdx(nextIdx);
    if (nextIdx >= totalSteps && !rewardClaimedForSession) {
      const finalCorrect = simulation.steps.reduce((sum, step, idx) => {
        const chosen = idx === stepIdx ? selectedOptIdx : answers[idx];
        return typeof chosen === 'number' && step.options[chosen]?.isCorrect
          ? sum + 1
          : sum;
      }, 0);
      const earned = 3 + finalCorrect * 2;
      setRewardClaimedForSession(true);
      onCompleteSimulation(activeCase.id, earned, finalCorrect);
    }
  };

  const handleNextCase = () => {
    setCaseIdx((prev) => prev + 1);
  };

  const handleGenerateAiVariant = async () => {
    if (isGeneratingAi) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/simulasi-kasus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: activeCase.id,
          reports,
          assets,
          evidences,
        }),
      });
      const json = (await res.json()) as CaseSimulationPayload & {
        success?: boolean;
      };
      if (res.ok && Array.isArray(json.steps) && json.steps.length === 5) {
        setAiOverride(json);
        setStepIdx(0);
        setAnswers({});
        setRewardClaimedForSession(false);
      }
    } catch {
      // tetap gunakan simulasi terverifikasi lokal bila jaringan melambat
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Bar Kontrol Disiplin & Prinsip Pembelajaran */}
      <div className="surface-card p-5 sm:p-6 rounded-3xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--cyan)] bg-[var(--cyan-pale)] font-heading text-xs font-extrabold text-[var(--cyan-dark)]">
                AGEN AI #8 · SIMULASI 5 TAHAP
              </span>
              <span className="px-2.5 py-0.5 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--green)] bg-[var(--soft)] font-heading text-xs font-bold text-[var(--ink)]">
                Tanpa Timer Paksa · Tanpa Potong Poin
              </span>
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[var(--ink)] m-0 pt-1">
              Simulasi Diagnostik Kasus Terverifikasi
            </h2>
            <p className="text-sm text-[var(--ink-soft)] m-0">
              Latih penalaran 5 tahap dari arsip nyata Unit 11 CDU (+3 poin selesai &amp; +2 poin
              per tahap tepat, maks +13 poin).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={handleGenerateAiVariant}
              className="group press-soft px-4 py-2.5 rounded-full bg-[var(--soft)] hover:bg-[var(--hover-bg)] border border-[var(--line)] font-heading text-sm font-bold text-[var(--ink)] inline-flex items-center gap-2 disabled:opacity-60"
            >
              <Sparkles
                className={`w-4 h-4 text-[var(--cyan-dark)] ${isGeneratingAi ? 'animate-spin' : ''}`}
              />
              <span>{isGeneratingAi ? 'Menyusun Soal AI...' : 'Variasi Soal AI'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextCase}
              className="group press-soft px-4 py-2.5 rounded-full pop-btn font-heading text-sm font-bold inline-flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ganti Kasus ({safeCaseIndex + 1}/{verifiedCases.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Disiplin */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--line-soft)]">
          {DISCIPLINE_OPTIONS.map((opt) => {
            const active = discipline === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setDiscipline(opt.id);
                  setCaseIdx(0);
                }}
                className={`px-3.5 py-1.5 rounded-full font-heading text-xs sm:text-sm font-bold transition-colors ${
                  active
                    ? 'pop-btn shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {isGeneratingAi ? (
        <SynqraLoader
          variant="extract"
          label="Agen AI menyusun skenario diagnostik 5 tahap..."
          sublabel={`Menautkan fakta kasus terverifikasi [${activeCase.id}] pada ${activeCase.asset_id}.`}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Kolom Kiri: Konteks Kasus Terverifikasi & Bukti Visual */}
          <aside className="lg:col-span-5 surface-card p-5 sm:p-6 rounded-3xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-heading text-sm font-extrabold text-[var(--cyan-dark)]">
                {simulation.reportId} · {simulation.assetId}
              </span>
              <div className="flex items-center gap-2">
                {alreadyCompletedBefore && (
                  <span className="px-2 py-0.5 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--green)] bg-[var(--soft)] font-heading text-[11px] font-bold text-[var(--ink)]">
                    Sudah Dilatih
                  </span>
                )}
                <StatusBadge status="VERIFIED" size="sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading text-base sm:text-lg font-bold text-[var(--ink)] m-0 leading-snug">
                {simulation.caseTitle}
              </h3>
              <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                <b className="text-[var(--ink)]">Kondisi Operasi:</b> {simulation.kondisiOperasi}
              </p>
            </div>

            {simulation.evidenceImageUrl && (
              <div className="p-3 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-2">
                <img
                  src={simulation.evidenceImageUrl}
                  alt={simulation.evidenceCaption || simulation.caseTitle}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-h-52 object-contain rounded-xl bg-[var(--surface)]"
                />
                {simulation.evidenceCaption && (
                  <p className="text-sm text-[var(--ink-soft)] m-0 line-clamp-2 leading-snug">
                    {simulation.evidenceCaption}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--line-soft)] text-sm">
              <span className="font-semibold text-[var(--ink-soft)]">
                Disahkan: <b className="text-[var(--ink)]">{simulation.verifiedBy}</b>
              </span>
              {simulation.literatureRefs && simulation.literatureRefs.length > 0 && (
                <span className="font-heading text-xs font-extrabold text-[var(--cyan-dark)]">
                  Jurnal: {simulation.literatureRefs.join(', ')}
                </span>
              )}
            </div>
          </aside>

          {/* Kolom Kanan: Wizard Fokus 1 Tahap per Layar */}
          <section className="lg:col-span-7 surface-card p-5 sm:p-6 rounded-3xl space-y-5">
            {!isFinished ? (
              <>
                {/* Progress Tahap 1-5 */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-heading text-xs font-extrabold uppercase tracking-wider text-[var(--cyan-dark)]">
                      Tahap {stepIdx + 1} dari {totalSteps} · {currentStep.entityLabel}
                    </span>
                    <span className="font-heading text-xs font-bold text-[var(--ink-soft)]">
                      {simulation.engine === 'gemini-live' ? 'AI Live' : 'Arsip Terverifikasi'} · Skor Sementara: {correctCount}/{Object.keys(answers).length}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {simulation.steps.map((s, idx) => {
                      const done = idx < stepIdx || (idx === stepIdx && isStepAnswered);
                      const active = idx === stepIdx;
                      return (
                        <div
                          key={s.stepNumber}
                          className={`h-2 rounded-[4px] transition-colors ${
                            done
                              ? 'bg-[#00B8D9]'
                              : active
                                ? 'bg-[var(--ink)]/35'
                                : 'bg-[var(--soft)]'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Pertanyaan Tahap Aktif */}
                <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)]">
                  <p className="font-heading text-[15.5px] font-bold text-[var(--ink)] m-0 leading-relaxed">
                    {currentStep.question}
                  </p>
                </div>

                {/* 3 Pilihan Jawaban */}
                <div className="space-y-2.5">
                  {currentStep.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isChosen = selectedOptIdx === idx;

                    let cardStyle: React.CSSProperties | undefined;
                    let cardClass =
                      'bg-[var(--soft)] border-[var(--line)] hover:border-[var(--cyan)] text-[var(--ink)]';

                    if (isStepAnswered) {
                      if (opt.isCorrect) {
                        cardStyle = {
                          backgroundColor: 'var(--green-bg)',
                          borderColor: 'var(--green-border)',
                        };
                        cardClass = 'text-[var(--ink)]';
                      } else if (isChosen) {
                        cardStyle = {
                          backgroundColor: 'var(--amber-bg)',
                          borderColor: 'var(--amber-border)',
                        };
                        cardClass = 'text-[var(--ink)]';
                      } else {
                        cardClass =
                          'bg-[var(--soft)] border-[var(--line-soft)] text-[var(--ink-soft)] opacity-70';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isStepAnswered}
                        onClick={() => handleSelectOption(idx)}
                        style={cardStyle}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${cardClass}`}
                      >
                        <span className="w-7 h-7 rounded-[7px] bg-[var(--surface)] border border-[var(--line)] font-heading text-xs font-extrabold text-[var(--ink)] flex items-center justify-center shrink-0 mt-0.5">
                          {letter}
                        </span>
                        <span className="text-sm font-semibold leading-relaxed flex-1">
                          {opt.text}
                        </span>
                        {isStepAnswered && opt.isCorrect && (
                          <CheckCircle2
                            className="w-5 h-5 shrink-0 mt-0.5"
                            style={{ color: 'var(--green)' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Umpan Balik AI Coach (Non-Punitive) */}
                {isStepAnswered && (
                  <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 font-heading text-sm font-bold text-[var(--ink)]">
                      <BookOpenCheck className="w-4 h-4 text-[var(--cyan-dark)] shrink-0" />
                      <span>
                        {currentStep.options[selectedOptIdx]?.isCorrect
                          ? 'Tepat! Penalaran selaras dengan bukti terverifikasi.'
                          : 'Catatan Pembinaan AI Coach (Tanpa Pengurangan Poin):'}
                      </span>
                    </div>

                    <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                      {currentStep.coachExplanation}
                    </p>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleAdvanceStep}
                        className="group press-soft px-5 py-2.5 rounded-full pop-btn font-heading text-sm font-bold inline-flex items-center gap-2 shadow-sm"
                      >
                        <span>
                          {stepIdx + 1 < totalSteps
                            ? `Lanjut ke Tahap ${stepIdx + 2}`
                            : 'Lihat Hasil & Klaim Poin'}
                        </span>
                        <ArrowRight className="w-4 h-4 nudge-x" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Kartu Ringkasan Selesai 5 Tahap */
              <div className="space-y-5 animate-fade-in">
                <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      style={{
                        backgroundColor: 'var(--green-bg)',
                        color: 'var(--green)',
                        borderColor: 'var(--green-border)',
                        borderLeftColor: 'var(--green)',
                      }}
                      className="px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>Simulasi Selesai · +{potentialPoints} Poin</span>
                    </span>

                    <span className="font-heading text-sm font-extrabold text-[var(--ink)]">
                      Ketepatan: {correctCount}/{totalSteps} Tahap
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[var(--ink)] m-0">
                    Studi Kasus [{activeCase.id}] Tuntas Dipelajari
                  </h3>

                  <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                    Rincian perolehan: <b className="text-[var(--ink)]">+3 poin</b> penyelesaian
                    simulasi dan <b className="text-[var(--ink)]">+{correctCount * 2} poin</b> dari{' '}
                    {correctCount} analisis tahap yang tepat. Poin tercatat ke Paspor Kompetensi
                    &amp; rata-rata Regu Shift Anda.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-2 text-sm">
                  <div className="flex items-center gap-2 font-heading font-bold text-[var(--ink)]">
                    <ShieldCheck className="w-4 h-4 text-[var(--cyan-dark)]" />
                    <span>Intisari Pengetahuan Terverifikasi [{activeCase.id}]</span>
                  </div>
                  <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                    <b className="text-[var(--ink)]">Akar Penyebab:</b> {activeCase.praduga_penyebab}
                  </p>
                  <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                    <b className="text-[var(--ink)]">Kriteria Verifikasi:</b> {activeCase.verifikasi}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenReport(activeCase)}
                    className="group press-soft px-4 py-2.5 rounded-full bg-[var(--soft)] hover:bg-[var(--hover-bg)] border border-[var(--line)] font-heading text-sm font-bold text-[var(--ink)] inline-flex items-center gap-2"
                  >
                    <span>Buka Detail Kasus</span>
                    <ExternalLink className="w-4 h-4 text-[var(--cyan-dark)]" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextCase}
                    className="group press-soft px-5 py-2.5 rounded-full pop-btn font-heading text-sm font-bold inline-flex items-center gap-2 shadow-sm"
                  >
                    <span>Simulasi Kasus Berikutnya</span>
                    <ArrowRight className="w-4 h-4 nudge-x" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
