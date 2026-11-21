'use client';

import React, { useMemo, useState } from 'react';
import {
  Asset,
  CaseComment,
  EarlyWarningAlert,
  EarlyWarningResponse,
  EarlyWarningSeverity,
  Evidence,
  Report,
  RoleInfo,
} from '@/types/synqra';
import { calculateSla, INITIAL_REPORTS } from '@/lib/constants';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Cpu,
  ExternalLink,
  Flame,
  Radar,
  ShieldAlert,
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

function getSeverityStyle(severity: EarlyWarningSeverity): React.CSSProperties {
  if (severity === 'KRITIS') {
    return {
      backgroundColor: 'var(--red-bg)',
      color: 'var(--red)',
      borderColor: 'var(--red-border)',
      borderLeftColor: 'var(--red)',
    };
  }
  if (severity === 'WASPADA') {
    return {
      backgroundColor: 'var(--amber-bg)',
      color: 'var(--amber)',
      borderColor: 'var(--amber-border)',
      borderLeftColor: 'var(--amber)',
    };
  }
  return {
    backgroundColor: 'var(--info-bg)',
    color: 'var(--info)',
    borderColor: 'var(--info-border)',
    borderLeftColor: 'var(--info)',
  };
}

export const AnalyticsRoiView: React.FC<AnalyticsRoiViewProps> = ({
  assets,
  reports,
  evidences,
  comments,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<'warnings' | 'summary'>('warnings');

  // --- Tab 1: State Peringatan Dini AI ---
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<EarlyWarningResponse | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // --- Tab 2: State Tebak Kasus 2 Menit ---
  const [drillIdx, setDrillIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);

  // --- Ringkasan Metrik Pilot (3 Metrik Ringkas) ---
  const pilotSummary = useMemo(() => {
    const evidenceReportIds = new Set(evidences.map((e) => e.report_id));
    const revisionReportIds = new Set(
      comments.filter((c) => c.is_revision_request).map((c) => c.report_id)
    );

    const totalReports = reports.length;
    const ftrCount = reports.filter(
      (r) => evidenceReportIds.has(r.id) && !revisionReportIds.has(r.id)
    ).length;
    const evidenceRate =
      totalReports > 0 ? Math.round((ftrCount / totalReports) * 100) : 0;

    const activeReports = reports.filter((r) => r.status !== 'VERIFIED');
    const compliantActiveCount = activeReports.filter(
      (r) => !calculateSla(r.updated_at || r.created_at).isOverdue
    ).length;
    const slaRate =
      activeReports.length > 0
        ? Math.round((compliantActiveCount / activeReports.length) * 100)
        : 100;

    const targetIds = ['P-101A', 'E-201', 'FCV-301'];
    const distribution = targetIds.map((assetId) => {
      const list = reports.filter((r) => r.asset_id === assetId);
      const verified = list.filter((r) => r.status === 'VERIFIED').length;
      const pct = totalReports > 0 ? Math.round((list.length / totalReports) * 100) : 0;
      return { assetId, count: list.length, verified, pct };
    });

    return {
      totalReports,
      ftrCount,
      evidenceRate,
      activeCount: activeReports.length,
      compliantActiveCount,
      slaRate,
      distribution,
    };
  }, [reports, evidences, comments]);

  const verifiedCases = useMemo(() => {
    const verified = reports.filter((r) => r.status === 'VERIFIED');
    return verified.length > 0
      ? verified
      : INITIAL_REPORTS.filter((r) => r.status === 'VERIFIED');
  }, [reports]);

  // --- Data Tebak Kasus 2 Menit ---
  const currentDrill = useMemo(() => {
    const safeIndex = drillIdx % verifiedCases.length;
    const targetCase = verifiedCases[safeIndex];
    const targetAsset = assets.find((a) => a.id === targetCase.asset_id);

    const distractorPool = [...reports, ...INITIAL_REPORTS].filter(
      (r) =>
        r.id !== targetCase.id &&
        r.praduga_penyebab &&
        r.praduga_penyebab.trim() !== targetCase.praduga_penyebab.trim()
    );

    const distractors: string[] = [];
    for (const candidate of distractorPool) {
      const txt = candidate.praduga_penyebab.trim();
      if (!distractors.includes(txt)) distractors.push(txt);
      if (distractors.length >= 2) break;
    }

    while (distractors.length < 2) {
      distractors.push(
        distractors.length === 0
          ? 'Kegagalan suplai udara instrumen akibat kebocoran jalur pipa regulator.'
          : 'Kerusakan modul input analog DCS pada panel kontrol utama.'
      );
    }

    const rawOptions = [
      { text: targetCase.praduga_penyebab.trim(), isCorrect: true },
      { text: distractors[0], isCorrect: false },
      { text: distractors[1], isCorrect: false },
    ];

    const idSum = targetCase.id
      .split('')
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const shift = (safeIndex + idSum) % rawOptions.length;
    const options = rawOptions.map(
      (_, idx) => rawOptions[(idx + shift) % rawOptions.length]
    );

    return { targetCase, targetAsset, options, safeIndex };
  }, [verifiedCases, drillIdx, assets, reports]);

  const handleScanPatterns = async () => {
    setIsScanning(true);
    setScanError(null);
    try {
      const res = await fetch('/api/peringatan-dini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reports, assets }),
      });
      const json = (await res.json()) as EarlyWarningResponse & {
        success?: boolean;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(json.error || 'Gagal memindai pola peringatan dini.');
      }
      setScanResult(json);
    } catch (err: unknown) {
      setScanError(
        err instanceof Error
          ? err.message
          : 'Gagal menghubungi layanan Peringatan Dini AI.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectDrillOption = (idx: number) => {
    if (selectedOptionIdx !== null) return;
    setSelectedOptionIdx(idx);
    setTotalAnswered((prev) => prev + 1);
    if (currentDrill.options[idx]?.isCorrect) {
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

  const openReportById = (reportId: string) => {
    const found = reports.find((r) => r.id === reportId);
    if (found) {
      onOpenReport(found);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-[var(--cyan-dark)]">
            DETEKSI POLA KEGAGALAN &amp; KESIAPAN PILOT
          </div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)] mt-1">
            Peringatan Dini AI
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1">
            Deteksi pola gangguan berulang lintas shift dari {reports.length} riwayat kasus
            peralatan untuk tindakan pencegahan lebih awal.
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1.5 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--cyan-dark)] bg-[var(--surface)] font-heading text-xs font-bold text-[var(--ink)] inline-flex items-center gap-2">
          <Radar className="w-4 h-4 text-[var(--cyan-dark)]" />
          <span>{reports.length} Kasus Terpantau</span>
        </span>
      </header>

      {/* 2 Tab Internal */}
      <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('warnings')}
          className={`px-4 py-2.5 rounded-xl font-heading text-sm font-bold inline-flex items-center gap-2 transition-colors ${
            activeTab === 'warnings'
              ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830]'
              : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)]'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Peringatan Dini AI</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2.5 rounded-xl font-heading text-sm font-bold inline-flex items-center gap-2 transition-colors ${
            activeTab === 'summary'
              ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830]'
              : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)]'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Ringkasan &amp; Latihan</span>
        </button>
      </div>

      {/* TAB 1: PERINGATAN DINI AI */}
      {activeTab === 'warnings' && (
        <section className="space-y-5 animate-fade-in">
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-heading text-base font-bold text-[var(--ink)]">
                Pemindaian Pola Kegagalan Berulang
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0">
                AI mengelompokkan seluruh laporan berdasarkan aset untuk menandai risiko gangguan
                yang muncul berkali-kali.
              </p>
            </div>

            <button
              type="button"
              disabled={isScanning}
              onClick={handleScanPatterns}
              className="px-5 py-3 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 shrink-0"
            >
              <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Memindai Pola...' : 'Pindai Pola Berulang'}</span>
            </button>
          </div>

          {scanError && (
            <div
              style={{
                backgroundColor: 'var(--red-bg)',
                borderColor: 'var(--red-border)',
                color: 'var(--red)',
              }}
              className="p-4 rounded-xl border text-sm font-bold"
            >
              {scanError}
            </div>
          )}

          {!scanResult && !isScanning && (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
              <div className="font-heading text-base font-bold text-[var(--ink)]">
                Ringkasan Populasi Kasus Siap Pindai
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pilotSummary.distribution.map((d) => (
                  <div
                    key={d.assetId}
                    className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-1"
                  >
                    <div className="font-heading text-sm font-extrabold text-[var(--cyan-dark)]">
                      {d.assetId}
                    </div>
                    <div className="font-heading text-2xl font-extrabold text-[var(--ink)]">
                      {d.count} Kasus
                    </div>
                    <div className="text-sm text-[var(--ink-soft)]">
                      {d.verified} kasus sudah terverifikasi pakar
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0">
                Tekan tombol <b>Pindai Pola Berulang</b> di atas untuk melihat sinyal peringatan
                dini pada tiap aset.
              </p>
            </div>
          )}

          {scanResult && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="flex flex-wrap items-center gap-2.5">
                  {scanResult.engine === 'gemini-live' ? (
                    <span
                      style={{
                        backgroundColor: 'var(--green-bg)',
                        color: 'var(--green)',
                        borderColor: 'var(--green-border)',
                        borderLeftColor: 'var(--green)',
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {(scanResult.usedModel || 'GEMINI-3.5-FLASH').toUpperCase()} LIVE
                      </span>
                    </span>
                  ) : (
                    <span
                      style={{
                        backgroundColor: 'var(--amber-bg)',
                        color: 'var(--amber)',
                        borderColor: 'var(--amber-border)',
                        borderLeftColor: 'var(--amber)',
                      }}
                      title={scanResult.errorReason}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>LOCAL FALLBACK</span>
                    </span>
                  )}

                  <span className="font-heading text-sm font-bold text-[var(--ink)]">
                    Ditemukan {scanResult.alerts.length} Sinyal Pola Berulang
                  </span>
                </div>

                <span className="text-sm text-[var(--ink-soft)]">
                  Dipindai pukul{' '}
                  {new Date(scanResult.generatedAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {scanResult.engine === 'local-fallback' && scanResult.errorReason && (
                <div
                  style={{
                    backgroundColor: 'var(--amber-bg)',
                    borderColor: 'var(--amber-border)',
                    borderLeftColor: 'var(--amber)',
                  }}
                  className="p-3.5 rounded-[7px] border border-l-[4px] text-sm font-semibold text-[var(--ink)]"
                >
                  <b style={{ color: 'var(--amber)' }}>Mode Fallback Lokal: </b>
                  <span>{scanResult.errorReason}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {scanResult.alerts.map((alert: EarlyWarningAlert) => (
                  <article
                    key={alert.id}
                    className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          style={getSeverityStyle(alert.severity)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                        >
                          {alert.severity === 'KRITIS' ? (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          <span>{alert.severity}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-[7px] bg-[var(--cyan-pale)] text-[var(--cyan-dark)] font-heading text-xs font-extrabold">
                          {alert.assetId}
                        </span>
                      </div>

                      <span className="px-2.5 py-1 rounded-[7px] bg-[var(--soft)] border border-[var(--line)] font-heading text-xs font-bold text-[var(--ink-soft)]">
                        {alert.frequencyLabel}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
                        {alert.patternTitle}
                      </h2>
                      <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                        {alert.summary}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] border-l-[3.5px] border-l-[var(--cyan)] text-sm font-semibold text-[var(--ink)]">
                      <b className="text-[var(--cyan-dark)]">Saran Pencegahan: </b>
                      <span>{alert.recommendedAction}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="font-heading text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                        Kasus Terkait:
                      </span>
                      {alert.relatedReportIds.map((repId) => {
                        const repObj = reports.find((r) => r.id === repId);
                        return (
                          <button
                            key={repId}
                            type="button"
                            disabled={!repObj}
                            onClick={() => openReportById(repId)}
                            className="px-2.5 py-1 rounded-[7px] border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] hover:bg-[var(--hover-bg)] font-heading text-xs font-bold text-[var(--cyan-dark)] inline-flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            <span>{repId}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: RINGKASAN & LATIHAN */}
      {activeTab === 'summary' && (
        <div className="space-y-6 animate-fade-in">
          {/* 3 Metrik Ringkas Kesiapan Pilot */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm font-bold text-[var(--ink)]">
                  Evidence Rate
                </span>
                <CheckCircle2 className="w-5 h-5 text-[var(--cyan-dark)]" />
              </div>
              <div className="font-heading text-3xl font-extrabold text-[var(--ink)]">
                {pilotSummary.evidenceRate}%
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0">
                {pilotSummary.ftrCount}/{pilotSummary.totalReports} kasus memiliki bukti fisik
                tanpa revisi terbuka.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm font-bold text-[var(--ink)]">
                  Kepatuhan SLA (&lt; 48 jam)
                </span>
                <Clock className="w-5 h-5 text-[var(--cyan-dark)]" />
              </div>
              <div className="font-heading text-3xl font-extrabold text-[var(--ink)]">
                {pilotSummary.slaRate}%
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0">
                {pilotSummary.compliantActiveCount}/{pilotSummary.activeCount} kasus aktif masih
                dalam batas SLA.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-2.5">
              <div className="font-heading text-sm font-bold text-[var(--ink)]">
                Distribusi Kasus
              </div>
              <div className="space-y-2">
                {pilotSummary.distribution.map((item) => (
                  <div key={item.assetId} className="space-y-1">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="font-heading font-bold text-[var(--ink)]">
                        {item.assetId}
                      </span>
                      <span className="text-[var(--ink-soft)]">
                        {item.count} ({item.verified} verified)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-[4px] bg-[var(--soft)] border border-[var(--line-soft)] overflow-hidden">
                      <div
                        className="h-full rounded-[3px] bg-[#00B8D9]"
                        style={{ width: `${Math.max(item.pct, item.count > 0 ? 12 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tebak Kasus 2 Menit (Padat Ruang & Minim Teks) */}
          <section className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line-soft)]">
              <div>
                <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
                  Tebak Kasus 2 Menit (Opsional)
                </h2>
                <p className="text-sm text-[var(--ink-soft)] m-0">
                  Pilih akar penyebab yang tepat dari arsip terverifikasi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  style={{
                    backgroundColor: 'var(--amber-bg)',
                    color: 'var(--amber)',
                    borderColor: 'var(--amber-border)',
                    borderLeftColor: 'var(--amber)',
                  }}
                  className="px-2.5 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold inline-flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Streak: {streak}</span>
                </span>
                <span className="px-2.5 py-1 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--cyan-dark)] bg-[var(--soft)] font-heading text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[var(--cyan-dark)]" />
                  <span>
                    Skor: {totalCorrect}/{totalAnswered}
                  </span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] border-l-[4px] border-l-[var(--cyan)] space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-[7px] bg-[var(--cyan-pale)] text-[var(--cyan-dark)] font-heading text-xs font-extrabold">
                  {currentDrill.targetCase.asset_id}
                  {currentDrill.targetAsset ? ` : ${currentDrill.targetAsset.name}` : ''}
                </span>
                <span className="font-heading text-xs font-bold text-[var(--ink-soft)]">
                  Kasus #{currentDrill.safeIndex + 1}/{verifiedCases.length}
                </span>
              </div>
              <p className="text-sm font-bold text-[var(--ink)] m-0 leading-relaxed">
                Gejala: &ldquo;{currentDrill.targetCase.gejala}&rdquo;
              </p>
            </div>

            <div className="space-y-2">
              {currentDrill.options.map((opt, idx) => {
                const isAnswered = selectedOptionIdx !== null;
                const isSelected = selectedOptionIdx === idx;
                const letter = String.fromCharCode(65 + idx);

                let btnClass =
                  'bg-[var(--soft)] border-[var(--line)] hover:border-[var(--cyan)] text-[var(--ink)]';
                let btnStyle: React.CSSProperties | undefined;

                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnClass = 'text-[var(--ink)]';
                    btnStyle = {
                      backgroundColor: 'var(--green-bg)',
                      borderColor: 'var(--green-border)',
                    };
                  } else if (isSelected) {
                    btnClass = 'text-[var(--ink)]';
                    btnStyle = {
                      backgroundColor: 'var(--red-bg)',
                      borderColor: 'var(--red-border)',
                    };
                  } else {
                    btnClass =
                      'bg-[var(--soft)] border-[var(--line)] text-[var(--ink-soft)] opacity-70';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectDrillOption(idx)}
                    style={btnStyle}
                    className={`w-full p-3.5 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${btnClass}`}
                  >
                    <span className="w-6 h-6 rounded-[7px] bg-[var(--surface)] border border-[var(--line)] font-heading text-xs font-extrabold text-[var(--ink)] flex items-center justify-center shrink-0 mt-0.5">
                      {letter}
                    </span>
                    <span className="text-sm font-semibold leading-snug flex-1">
                      {opt.text}
                    </span>
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: 'var(--green)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOptionIdx !== null && (
              <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2.5 animate-fade-in">
                <div className="font-heading text-sm font-bold text-[var(--ink)]">
                  {currentDrill.options[selectedOptionIdx]?.isCorrect
                    ? 'Tepat. Selaras dengan kasus terverifikasi.'
                    : 'Kurang tepat. Tinjau solusi resminya di bawah.'}
                </div>
                <div className="text-sm text-[var(--ink)] space-y-1">
                  <div>
                    <b>Penyebab:</b> {currentDrill.targetCase.praduga_penyebab}
                  </div>
                  <div>
                    <b>Solusi:</b> {currentDrill.targetCase.usulan_tindakan}
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenReport(currentDrill.targetCase)}
                    className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] font-heading text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
                  >
                    <span>Detail Kasus</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--cyan-dark)]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextDrill}
                    className="px-4 py-2 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <span>Kasus Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
