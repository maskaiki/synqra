'use client';

import React, { useMemo, useState } from 'react';
import {
  Asset,
  CaseComment,
  Evidence,
  Report,
  RoiAnalysisResult,
  RoleInfo,
} from '@/types/synqra';
import { calculateSla, INITIAL_REPORTS } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  Clock,
  Cpu,
  ExternalLink,
  Flame,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface AnalyticsRoiViewProps {
  assets: Asset[];
  reports: Report[];
  evidences: Evidence[];
  comments: CaseComment[];
  roleInfo: RoleInfo;
  onOpenReport: (report: Report) => void;
}

const RATE_PRESETS = [
  {
    label: 'Skala Unit Kecil',
    shortRate: 'Rp 100 Jt/jam',
    value: 100_000_000,
  },
  {
    label: 'Kilang Menengah',
    shortRate: 'Rp 250 Jt/jam',
    value: 250_000_000,
  },
  {
    label: 'Kilang Besar',
    shortRate: 'Rp 1 Miliar/jam',
    value: 1_000_000_000,
  },
] as const;

function formatRupiah(amount: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(amount))}`;
}

export const AnalyticsRoiView: React.FC<AnalyticsRoiViewProps> = ({
  assets,
  reports,
  evidences,
  comments,
  roleInfo,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<'roi' | 'drill'>('roi');

  // --- State B: Penghitung Manfaat AI (ROI) ---
  const [hourlyRate, setHourlyRate] = useState<number>(250_000_000);
  const [isCalculating, setIsCalculating] = useState(false);
  const [roiResult, setRoiResult] = useState<RoiAnalysisResult | null>(null);
  const [roiError, setRoiError] = useState<string | null>(null);
  const [confirmedBy, setConfirmedBy] = useState<string | null>(null);

  // --- State C: Tebak Kasus Hari Ini (Micro-Case Drill 2 Menit) ---
  const [drillIdx, setDrillIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);

  // --- Metrik Kesiapan Pilot Project (Section A) ---
  const pilotMetrics = useMemo(() => {
    const evidenceReportIds = new Set(evidences.map((e) => e.report_id));
    const revisionReportIds = new Set(
      comments.filter((c) => c.is_revision_request).map((c) => c.report_id)
    );

    const totalReports = reports.length;
    const ftrCount = reports.filter(
      (r) => evidenceReportIds.has(r.id) && !revisionReportIds.has(r.id)
    ).length;
    const ftrRate =
      totalReports > 0 ? Math.round((ftrCount / totalReports) * 100) : 0;

    const activeReports = reports.filter((r) => r.status !== 'VERIFIED');
    const compliantActiveCount = activeReports.filter(
      (r) => !calculateSla(r.updated_at || r.created_at).isOverdue
    ).length;
    const slaComplianceRate =
      activeReports.length > 0
        ? Math.round((compliantActiveCount / activeReports.length) * 100)
        : 100;

    const verifiedReports = reports.filter((r) => r.status === 'VERIFIED');
    const tracedVerifiedCount = verifiedReports.filter((r) =>
      evidenceReportIds.has(r.id)
    ).length;
    const traceabilityRate =
      verifiedReports.length > 0
        ? Math.round((tracedVerifiedCount / verifiedReports.length) * 100)
        : 100;

    const targetAssetIds = ['P-101A', 'E-201', 'FCV-301'];
    const assetDistribution = targetAssetIds.map((assetId) => {
      const assetReports = reports.filter((r) => r.asset_id === assetId);
      const assetVerified = assetReports.filter(
        (r) => r.status === 'VERIFIED'
      ).length;
      const pct =
        totalReports > 0
          ? Math.round((assetReports.length / totalReports) * 100)
          : 0;
      return {
        assetId,
        count: assetReports.length,
        verifiedCount: assetVerified,
        pct,
      };
    });

    return {
      totalReports,
      ftrCount,
      ftrRate,
      activeCount: activeReports.length,
      compliantActiveCount,
      slaComplianceRate,
      verifiedCount: verifiedReports.length,
      tracedVerifiedCount,
      traceabilityRate,
      assetDistribution,
    };
  }, [reports, evidences, comments]);

  const verifiedCases = useMemo(() => {
    const verified = reports.filter((r) => r.status === 'VERIFIED');
    return verified.length > 0
      ? verified
      : INITIAL_REPORTS.filter((r) => r.status === 'VERIFIED');
  }, [reports]);

  // --- Data untuk Tebak Kasus 2 Menit (Section C) ---
  const currentDrill = useMemo(() => {
    const safeIndex = drillIdx % verifiedCases.length;
    const targetCase = verifiedCases[safeIndex];
    const targetAsset = assets.find((a) => a.id === targetCase.asset_id);

    const distractorPoolSource = [...reports, ...INITIAL_REPORTS].filter(
      (r) =>
        r.id !== targetCase.id &&
        r.praduga_penyebab &&
        r.praduga_penyebab.trim() !== targetCase.praduga_penyebab.trim()
    );

    const uniqueDistractors: string[] = [];
    for (const candidate of distractorPoolSource) {
      const text = candidate.praduga_penyebab.trim();
      if (!uniqueDistractors.includes(text)) {
        uniqueDistractors.push(text);
      }
      if (uniqueDistractors.length >= 2) break;
    }

    while (uniqueDistractors.length < 2) {
      const fallbackText =
        uniqueDistractors.length === 0
          ? 'Kegagalan aktuator hidrolik akibat penurunan tekanan suplai udara instrumen.'
          : 'Korsleting modul relay panel kontrol DCS pada rak terminasi utama.';
      uniqueDistractors.push(fallbackText);
    }

    const rawOptions = [
      { text: targetCase.praduga_penyebab.trim(), isCorrect: true },
      { text: uniqueDistractors[0], isCorrect: false },
      { text: uniqueDistractors[1], isCorrect: false },
    ];

    // Susun urutan secara deterministik berdasarkan index latihan & panjang ID (tanpa Math.random)
    const idSum = targetCase.id
      .split('')
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const shift = (safeIndex + idSum) % rawOptions.length;
    const options = rawOptions.map(
      (_, idx) => rawOptions[(idx + shift) % rawOptions.length]
    );

    return {
      targetCase,
      targetAsset,
      options,
      safeIndex,
    };
  }, [verifiedCases, drillIdx, assets, reports]);

  const handleRateChange = (nextRate: number) => {
    setHourlyRate(nextRate);
    setConfirmedBy(null);
  };

  const handleCalculateRoi = async () => {
    setIsCalculating(true);
    setRoiError(null);
    setConfirmedBy(null);

    try {
      const res = await fetch('/api/hitung-manfaat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reports,
          hourlyDowntimeRateIdr: hourlyRate,
        }),
      });
      const json = (await res.json()) as RoiAnalysisResult & {
        success?: boolean;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(json.error || 'Gagal menghitung estimasi manfaat ROI.');
      }
      setRoiResult(json);
    } catch (err: unknown) {
      setRoiError(
        err instanceof Error
          ? err.message
          : 'Gagal menghubungi layanan Penghitung Manfaat AI.'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const canConfirmEngineer =
    roleInfo.key === 'dept_reviewer' || roleInfo.key === 'hse_validator';

  const handleConfirmEngineer = () => {
    if (!canConfirmEngineer || !roiResult) return;
    setConfirmedBy(`${roleInfo.name} · ${roleInfo.shortRole}`);
  };

  const handleSelectDrillOption = (idx: number) => {
    if (selectedOptionIdx !== null) return;
    setSelectedOptionIdx(idx);
    setTotalAnswered((prev) => prev + 1);
    const chosen = currentDrill.options[idx];
    if (chosen?.isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextDrill = () => {
    setSelectedOptionIdx(null);
    setDrillIdx((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-[var(--cyan-dark)]">
            TAHAP 4 · ANALITIK PENGETAHUAN &amp; DAMPAK FINANSIAL
          </div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)] mt-1">
            Analitik &amp; Penghitung Manfaat (ROI)
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1">
            Pantau metrik kesiapan pilot project, estimasi <i>opportunity loss</i> yang dicegah
            dengan konfirmasi engineer, dan latihan mikro 2 menit dari kasus terverifikasi.
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1.5 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--cyan-dark)] bg-[var(--surface)] font-heading text-xs font-bold text-[var(--ink)] inline-flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--cyan-dark)]" />
          <span>{pilotMetrics.verifiedCount} Kasus Terverifikasi</span>
        </span>
      </header>

      {/* Section A: 4 Kartu KPI Kesiapan Pilot Project */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-base font-bold text-[var(--ink)] uppercase tracking-wider">
            A. Metrik Kesiapan Pilot Project
          </h2>
          <span className="text-sm font-semibold text-[var(--ink-soft)]">
            Total Arsip: {pilotMetrics.totalReports} Kasus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1: First-Time-Right Evidence Rate */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="font-heading text-sm font-bold text-[var(--ink)]">
                First-Time-Right Evidence Rate
              </div>
              <span className="w-9 h-9 rounded-xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-[var(--ink)]">
                {pilotMetrics.ftrRate}%
              </div>
              <p className="text-sm text-[var(--ink-soft)] mt-1 mb-0">
                {pilotMetrics.ftrCount}/{pilotMetrics.totalReports} kasus memiliki bukti fisik tanpa
                permintaan revisi terbuka.
              </p>
            </div>
          </div>

          {/* KPI 2: Kepatuhan SLA (< 48 jam) */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="font-heading text-sm font-bold text-[var(--ink)]">
                Kepatuhan SLA (&lt; 48 jam)
              </div>
              <span
                style={{
                  backgroundColor:
                    pilotMetrics.slaComplianceRate >= 70
                      ? 'var(--green-bg)'
                      : 'var(--amber-bg)',
                  color:
                    pilotMetrics.slaComplianceRate >= 70
                      ? 'var(--green)'
                      : 'var(--amber)',
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              >
                <Clock className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-[var(--ink)]">
                {pilotMetrics.slaComplianceRate}%
              </div>
              <p className="text-sm text-[var(--ink-soft)] mt-1 mb-0">
                {pilotMetrics.compliantActiveCount}/{pilotMetrics.activeCount} kasus aktif masih
                dalam batas waktu SLA.
              </p>
            </div>
          </div>

          {/* KPI 3: Evidence Traceability */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="font-heading text-sm font-bold text-[var(--ink)]">
                Evidence Traceability
              </div>
              <span
                style={{
                  backgroundColor: 'var(--green-bg)',
                  color: 'var(--green)',
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              >
                <ShieldCheck className="w-5 h-5" />
              </span>
            </div>
            <div>
              <div className="font-heading text-3xl font-extrabold text-[var(--ink)]">
                {pilotMetrics.traceabilityRate}%
              </div>
              <p className="text-sm text-[var(--ink-soft)] mt-1 mb-0">
                {pilotMetrics.tracedVerifiedCount}/{pilotMetrics.verifiedCount} kasus VERIFIED
                terhubung ke bukti fisik (Hard Gate).
              </p>
            </div>
          </div>

          {/* KPI 4: Distribusi Kasus per Aset */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm flex flex-col justify-between gap-3">
            <div className="font-heading text-sm font-bold text-[var(--ink)]">
              Distribusi Kasus per Aset
            </div>
            <div className="space-y-2.5">
              {pilotMetrics.assetDistribution.map((item) => (
                <div key={item.assetId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="font-heading font-bold text-[var(--ink)]">
                      {item.assetId}
                    </span>
                    <span className="text-[var(--ink-soft)]">
                      {item.count} kasus ({item.verifiedCount} verified)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-[4px] bg-[var(--soft)] border border-[var(--line-soft)] overflow-hidden">
                    <div
                      className="h-full rounded-[3px] bg-[#00B8D9] transition-all duration-300"
                      style={{ width: `${Math.max(item.pct, item.count > 0 ? 12 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Switcher Tab Internal (Menghindari Penumpukan Konten) */}
      <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('roi')}
          className={`px-4 py-2.5 rounded-xl font-heading text-sm font-bold inline-flex items-center gap-2 transition-colors ${
            activeTab === 'roi'
              ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830]'
              : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>B. Penghitung Manfaat AI (ROI)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('drill')}
          className={`px-4 py-2.5 rounded-xl font-heading text-sm font-bold inline-flex items-center gap-2 transition-colors ${
            activeTab === 'drill'
              ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830]'
              : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)]'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>C. Tebak Kasus Hari Ini (2 Menit)</span>
        </button>
      </div>

      {/* Section B: Penghitung Manfaat AI (Downtime & Opportunity Loss Estimator) */}
      {activeTab === 'roi' && (
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--line-soft)]">
            <div>
              <h2 className="font-heading text-xl font-bold text-[var(--ink)]">
                Penghitung Manfaat AI — Downtime &amp; Opportunity Loss Estimator
              </h2>
              <p className="text-sm text-[var(--ink-soft)] mt-1 mb-0">
                Menghitung estimasi konservatif dampak finansial dari kasus{' '}
                <b className="text-[var(--ink)]">VERIFIED</b> berdasarkan asumsi biaya{' '}
                <i>unplanned downtime</i> per jam. Wajib dikonfirmasi oleh Engineer sebelum masuk
                laporan manajemen.
              </p>
            </div>
          </div>

          {/* Kontrol Asumsi Biaya & Tombol Hitung */}
          <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-5">
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                  Asumsi Biaya Unplanned Downtime per Jam (IDR)
                </label>
                <input
                  type="number"
                  min={1000000}
                  step={10000000}
                  value={hourlyRate}
                  onChange={(e) => {
                    const parsed = Number(e.target.value);
                    handleRateChange(Number.isFinite(parsed) && parsed > 0 ? parsed : 0);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-heading text-base font-bold focus:outline-none focus:border-[var(--cyan)]"
                />
                <div className="text-sm text-[var(--ink-soft)] mt-1">
                  Nilai aktif: <b className="text-[var(--ink)]">{formatRupiah(hourlyRate)}/jam</b>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-1.5">
                <span className="block text-sm font-bold text-[var(--ink)]">
                  Preset Skala Operasi
                </span>
                <div className="flex flex-wrap gap-2">
                  {RATE_PRESETS.map((preset) => {
                    const active = hourlyRate === preset.value;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleRateChange(preset.value)}
                        className={`px-3 py-2 rounded-xl border text-left transition-colors ${
                          active
                            ? 'bg-[var(--cyan-pale)] border-[var(--cyan)] text-[var(--cyan-dark)]'
                            : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--cyan)]'
                        }`}
                      >
                        <div className="font-heading text-xs font-bold">{preset.label}</div>
                        <div className="text-xs font-semibold opacity-85">{preset.shortRate}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-3 flex lg:justify-end">
                <button
                  type="button"
                  disabled={isCalculating || hourlyRate < 1_000_000}
                  onClick={handleCalculateRoi}
                  className="w-full lg:w-auto px-5 py-3 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
                  <span>
                    {isCalculating
                      ? 'Menghitung...'
                      : 'Hitung Estimasi Manfaat dengan AI'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {roiError && (
            <div
              style={{
                backgroundColor: 'var(--red-bg)',
                borderColor: 'var(--red-border)',
                color: 'var(--red)',
              }}
              className="p-4 rounded-xl border text-sm font-bold"
            >
              {roiError}
            </div>
          )}

          {roiResult && (
            <div className="space-y-5 animate-fade-in">
              {/* Baris Status Mesin + Human-in-the-Loop Gate */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
                <div className="flex flex-wrap items-center gap-2.5">
                  {roiResult.engine === 'gemini-live' ? (
                    <span
                      style={{
                        backgroundColor: 'var(--green-bg)',
                        color: 'var(--green)',
                        borderColor: 'var(--green-border)',
                        borderLeftColor: 'var(--green)',
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{(roiResult.usedModel || 'GEMINI-3.5-FLASH').toUpperCase()} LIVE</span>
                    </span>
                  ) : (
                    <span
                      style={{
                        backgroundColor: 'var(--amber-bg)',
                        color: 'var(--amber)',
                        borderColor: 'var(--amber-border)',
                        borderLeftColor: 'var(--amber)',
                      }}
                      title={roiResult.errorReason}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>LOCAL FALLBACK</span>
                    </span>
                  )}

                  {confirmedBy ? (
                    <span
                      style={{
                        backgroundColor: 'var(--green-bg)',
                        color: 'var(--green)',
                        borderColor: 'var(--green-border)',
                        borderLeftColor: 'var(--green)',
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>DIKONFIRMASI ENGINEER · {confirmedBy}</span>
                    </span>
                  ) : (
                    <span
                      style={{
                        backgroundColor: 'var(--amber-bg)',
                        color: 'var(--amber)',
                        borderColor: 'var(--amber-border)',
                        borderLeftColor: 'var(--amber)',
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>ESTIMASI AI (BELUM DIKONFIRMASI)</span>
                    </span>
                  )}
                </div>

                {/* Human-in-the-Loop Action Button */}
                <button
                  type="button"
                  disabled={!canConfirmEngineer || Boolean(confirmedBy)}
                  onClick={handleConfirmEngineer}
                  title={
                    !canConfirmEngineer
                      ? 'Hanya peran Reviewer Dept. atau HSE Validator yang dapat mengonfirmasi angka ROI.'
                      : 'Konfirmasi kelayakan angka estimasi untuk laporan manajemen'
                  }
                  className="px-4 py-2 rounded-[7px] bg-[#087F5B] hover:bg-[#066346] disabled:opacity-45 disabled:cursor-not-allowed text-white font-heading text-xs font-bold inline-flex items-center gap-2 transition-colors"
                >
                  {!canConfirmEngineer ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>
                    {confirmedBy
                      ? 'Angka Sudah Dikonfirmasi'
                      : 'Konfirmasi Angka oleh Engineer'}
                  </span>
                </button>
              </div>

              {!canConfirmEngineer && !confirmedBy && (
                <p className="text-sm text-[var(--ink-soft)] m-0">
                  Catatan tata kelola: Anda login sebagai <b>{roleInfo.shortRole}</b>. Ganti peran
                  ke <b>Ir. Agus Wijaya (Reviewer Dept.)</b> atau{' '}
                  <b>Dr. Rina Suryani (HSE Validator)</b> untuk mengonfirmasi angka estimasi ini.
                </p>
              )}

              {roiResult.engine === 'local-fallback' && roiResult.errorReason && (
                <div
                  style={{
                    backgroundColor: 'var(--amber-bg)',
                    borderColor: 'var(--amber-border)',
                    borderLeftColor: 'var(--amber)',
                  }}
                  className="p-3.5 rounded-[7px] border border-l-[4px] text-sm font-semibold text-[var(--ink)]"
                >
                  <b style={{ color: 'var(--amber)' }}>Info Fallback Lokal: </b>
                  <span>{roiResult.errorReason}</span>
                </div>
              )}

              {/* Total KPI Penghematan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] border-l-[4px] border-l-[var(--cyan)]">
                  <div className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--cyan-dark)]">
                    Total Jam Unplanned Downtime Tercegah
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[var(--ink)] mt-1">
                    {roiResult.estimatedHoursSaved} Jam
                  </div>
                  <p className="text-sm text-[var(--ink-soft)] mt-1 mb-0">
                    Akumulasi konservatif dari {roiResult.caseBreakdown.length} kasus berstatus
                    VERIFIED.
                  </p>
                </div>

                <div
                  style={{
                    borderLeftColor: 'var(--green)',
                  }}
                  className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] border-l-[4px]"
                >
                  <div
                    style={{ color: 'var(--green)' }}
                    className="font-heading text-xs font-bold uppercase tracking-wider"
                  >
                    Estimasi Opportunity Loss Terhindari
                  </div>
                  <div className="font-heading text-3xl font-extrabold text-[var(--ink)] mt-1">
                    {formatRupiah(roiResult.estimatedCostSavedIdr)}
                  </div>
                  <p className="text-sm text-[var(--ink-soft)] mt-1 mb-0">
                    Berdasarkan tarif downtime {formatRupiah(roiResult.hourlyDowntimeRateIdr)}/jam.
                  </p>
                </div>
              </div>

              {/* Ringkasan Eksekutif */}
              <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-1.5">
                <div className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--cyan-dark)]">
                  Ringkasan Eksekutif Manajemen
                </div>
                <p className="text-[15px] text-[var(--ink)] font-medium leading-relaxed m-0">
                  {roiResult.executiveSummary}
                </p>
              </div>

              {/* Catatan Potensi Mitigasi Kasus Aktif HIGH/CRITICAL */}
              {roiResult.activeHighRiskNote && (
                <div
                  style={{
                    backgroundColor: 'var(--amber-bg)',
                    borderColor: 'var(--amber-border)',
                    borderLeftColor: 'var(--amber)',
                  }}
                  className="p-4 rounded-[7px] border border-l-[4px] flex items-start gap-3 text-sm font-semibold text-[var(--ink)]"
                >
                  <AlertTriangle
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: 'var(--amber)' }}
                  />
                  <div>
                    <b style={{ color: 'var(--amber)' }}>
                      Potensi Mitigasi Tambahan (Kasus Aktif Risiko Tinggi):{' '}
                    </b>
                    <span>{roiResult.activeHighRiskNote}</span>
                  </div>
                </div>
              )}

              {/* Rincian Per Kasus VERIFIED */}
              {roiResult.caseBreakdown.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-heading text-base font-bold text-[var(--ink)]">
                    Rincian Estimasi per Kasus Terverifikasi ({roiResult.caseBreakdown.length})
                  </h3>
                  <div className="space-y-3">
                    {roiResult.caseBreakdown.map((item) => {
                      const matchedReport = reports.find((r) => r.id === item.reportId);
                      const estCost = Math.round(
                        item.preventedHours * roiResult.hourlyDowntimeRateIdr
                      );
                      return (
                        <div
                          key={item.reportId}
                          className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-[7px] bg-[var(--cyan-pale)] text-[var(--cyan-dark)] font-heading text-xs font-extrabold">
                                {item.reportId} · {item.assetId}
                              </span>
                              <StatusBadge status="VERIFIED" size="sm" />
                            </div>
                            <div className="font-heading font-bold text-base text-[var(--ink)]">
                              {item.title}
                            </div>
                            <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                              {item.rationale}
                            </p>
                          </div>

                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--line-soft)]">
                            <div className="text-left md:text-right">
                              <div className="font-heading text-lg font-extrabold text-[var(--ink)]">
                                {item.preventedHours} Jam
                              </div>
                              <div
                                style={{ color: 'var(--green)' }}
                                className="font-heading text-sm font-bold"
                              >
                                {formatRupiah(estCost)}
                              </div>
                            </div>

                            {matchedReport && (
                              <button
                                type="button"
                                onClick={() => onOpenReport(matchedReport)}
                                className="px-3 py-1.5 rounded-[7px] border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] font-heading text-xs font-bold text-[var(--cyan-dark)] inline-flex items-center gap-1.5"
                              >
                                <span>Buka Kasus</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Section C: Tebak Kasus Hari Ini (Micro-Case Drill 2 Menit — Opsional) */}
      {activeTab === 'drill' && (
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--line-soft)]">
            <div>
              <h2 className="font-heading text-xl font-bold text-[var(--ink)]">
                Tebak Kasus Hari Ini — Micro-Case Drill 2 Menit (Opsional)
              </h2>
              <p className="text-sm text-[var(--ink-soft)] mt-1 mb-0">
                Latihan singkat berbasis kasus nyata berstatus <b>VERIFIED</b> untuk mengasah
                intuisi diagnosa operator &amp; engineer tanpa memicu spam laporan baru.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span
                style={{
                  backgroundColor: 'var(--amber-bg)',
                  color: 'var(--amber)',
                  borderColor: 'var(--amber-border)',
                  borderLeftColor: 'var(--amber)',
                }}
                className="px-3 py-1.5 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Learning Streak: {streak}</span>
              </span>
              <span className="px-3 py-1.5 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--cyan-dark)] bg-[var(--soft)] font-heading text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[var(--cyan-dark)]" />
                <span>
                  Skor Sesi: {totalCorrect}/{totalAnswered}
                </span>
              </span>
            </div>
          </div>

          {/* Kartu Studi Kasus */}
          <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] border-l-[4px] border-l-[var(--cyan)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-[7px] bg-[var(--cyan-pale)] text-[var(--cyan-dark)] font-heading text-xs font-extrabold">
                  Aset: {currentDrill.targetCase.asset_id}
                  {currentDrill.targetAsset ? ` · ${currentDrill.targetAsset.name}` : ''}
                </span>
                <span className="font-heading text-xs font-bold text-[var(--ink-soft)]">
                  Studi Kasus #{currentDrill.safeIndex + 1} dari {verifiedCases.length}
                </span>
              </div>
              <StatusBadge status="VERIFIED" size="sm" />
            </div>

            <div>
              <div className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]">
                Gejala Lapangan Teramati
              </div>
              <p className="text-base font-bold text-[var(--ink)] mt-1 mb-0 leading-relaxed">
                &ldquo;{currentDrill.targetCase.gejala}&rdquo;
              </p>
            </div>

            <div className="text-sm text-[var(--ink-soft)]">
              <b className="text-[var(--ink)]">Kondisi Operasi:</b>{' '}
              {currentDrill.targetCase.kondisi_operasi}
            </div>
          </div>

          {/* 3 Pilihan Akar Penyebab */}
          <div className="space-y-3">
            <div className="font-heading text-sm font-bold text-[var(--ink)]">
              Pilih akar penyebab teknis yang paling tepat:
            </div>

            <div className="space-y-2.5">
              {currentDrill.options.map((opt, idx) => {
                const isAnswered = selectedOptionIdx !== null;
                const isSelected = selectedOptionIdx === idx;
                const labelLetter = String.fromCharCode(65 + idx);

                let boxClass =
                  'bg-[var(--soft)] border-[var(--line)] hover:border-[var(--cyan)] text-[var(--ink)]';
                let boxStyle: React.CSSProperties | undefined;

                if (isAnswered) {
                  if (opt.isCorrect) {
                    boxClass = 'text-[var(--ink)]';
                    boxStyle = {
                      backgroundColor: 'var(--green-bg)',
                      borderColor: 'var(--green-border)',
                    };
                  } else if (isSelected && !opt.isCorrect) {
                    boxClass = 'text-[var(--ink)]';
                    boxStyle = {
                      backgroundColor: 'var(--red-bg)',
                      borderColor: 'var(--red-border)',
                    };
                  } else {
                    boxClass =
                      'bg-[var(--soft)] border-[var(--line)] text-[var(--ink-soft)] opacity-70';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectDrillOption(idx)}
                    style={boxStyle}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${boxClass}`}
                  >
                    <span className="w-7 h-7 rounded-[7px] bg-[var(--surface)] border border-[var(--line)] font-heading text-xs font-extrabold text-[var(--ink)] flex items-center justify-center shrink-0 mt-0.5">
                      {labelLetter}
                    </span>
                    <span className="text-sm font-semibold leading-relaxed flex-1">
                      {opt.text}
                    </span>
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle2
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: 'var(--green)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Umpan Balik Teknis & Solusi Resmi Terverifikasi */}
          {selectedOptionIdx !== null && (
            <div className="p-5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] space-y-3 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-heading text-base font-bold text-[var(--ink)]">
                  {currentDrill.options[selectedOptionIdx]?.isCorrect
                    ? 'Tepat! Analisis selaras dengan arsip terverifikasi.'
                    : 'Kurang tepat — pelajari akar masalah resminya di bawah.'}
                </div>
                <span className="font-heading text-xs font-bold text-[var(--cyan-dark)]">
                  Referensi: {currentDrill.targetCase.id}
                </span>
              </div>

              <div className="space-y-2 text-sm text-[var(--ink)]">
                <div>
                  <b>Akar Penyebab Terverifikasi:</b>{' '}
                  {currentDrill.targetCase.praduga_penyebab}
                </div>
                <div>
                  <b>Solusi &amp; Tindakan Resmi:</b>{' '}
                  {currentDrill.targetCase.usulan_tindakan}
                </div>
                <div>
                  <b>Kriteria Verifikasi:</b> {currentDrill.targetCase.verifikasi}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2.5 pt-2 border-t border-[var(--line-soft)]">
                <button
                  type="button"
                  onClick={() => onOpenReport(currentDrill.targetCase)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] font-heading text-sm font-bold text-[var(--ink)] inline-flex items-center gap-2"
                >
                  <span>Buka Detail Kasus</span>
                  <ExternalLink className="w-4 h-4 text-[var(--cyan-dark)]" />
                </button>
                <button
                  type="button"
                  onClick={handleNextDrill}
                  className="px-5 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading text-sm font-bold inline-flex items-center gap-2"
                >
                  <span>Kasus Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
