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
import { calculateSla, COMPANY_UMBRELLA } from '@/lib/constants';
import { EQUIPMENT_CATEGORIES } from '@/lib/cduBalonganKnowledge';
import { EquipmentBreakoutCard } from '@/components/ui/EquipmentBreakoutCard';
import { SynqraLoader } from '@/components/ui/SynqraLoader';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Radar,
} from 'lucide-react';

interface AnalyticsRoiViewProps {
  assets: Asset[];
  reports: Report[];
  evidences: Evidence[];
  comments: CaseComment[];
  roleInfo: RoleInfo;
  isDarkMode?: boolean;
  onOpenReport: (report: Report) => void;
}

function getSeverityStyle(severity: EarlyWarningSeverity): React.CSSProperties {
  if (severity === 'KRITIS') {
    return { backgroundColor: '#DC2626', color: '#FFFFFF' };
  }
  if (severity === 'WASPADA') {
    return { backgroundColor: '#D97706', color: '#FFFFFF' };
  }
  return { backgroundColor: '#2563EB', color: '#FFFFFF' };
}

export const AnalyticsRoiView: React.FC<AnalyticsRoiViewProps> = ({
  assets,
  reports,
  evidences,
  comments,
  isDarkMode = false,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<'warnings' | 'summary'>('warnings');

  // --- Tab 1: State Peringatan Dini AI ---
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<EarlyWarningResponse | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // --- Ringkasan Metrik Pilot (3 Metrik Ringkas + Profil Aset) ---
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

    const distribution = EQUIPMENT_CATEGORIES.map((cat) => {
      const catAssets = assets.filter((a) => a.categoryCode === cat.code);
      const idSet = new Set(catAssets.map((a) => a.id));
      const list = reports.filter((r) => idSet.has(r.asset_id));
      const verified = list.filter((r) => r.status === 'VERIFIED').length;
      const pct = totalReports > 0 ? Math.round((list.length / totalReports) * 100) : 0;
      return {
        categoryCode: cat.code,
        assetId: cat.shortLabel,
        label: cat.label,
        renderType: cat.renderType,
        tagCount: catAssets.length,
        unitCount: cat.unitCount,
        count: list.length,
        verified,
        pct,
        latestCase: list[0],
      };
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
  }, [assets, reports, evidences, comments]);

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

  const openReportById = (reportId: string) => {
    const found = reports.find((r) => r.id === reportId);
    if (found) {
      onOpenReport(found);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)] m-0">
            Peringatan Dini
          </h1>
          <span className="font-heading text-sm font-bold text-[var(--muted)]">
            {reports.length} Kasus
          </span>
        </div>
      </header>

      {/* 2 Tab Internal */}
      <div className="surface-card inline-flex flex-wrap p-1.5 rounded-full gap-1.5">
        <button
          type="button"
          aria-pressed={activeTab === 'warnings'}
          onClick={() => setActiveTab('warnings')}
          className={`px-4 py-2 rounded-full font-heading text-sm font-bold inline-flex items-center gap-2 ${
            activeTab === 'warnings'
              ? 'pop-btn shadow-sm'
              : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)]'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Peringatan Dini AI</span>
        </button>
        <button
          type="button"
          aria-pressed={activeTab === 'summary'}
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-full font-heading text-sm font-bold inline-flex items-center gap-2 ${
            activeTab === 'summary'
              ? 'pop-btn shadow-sm'
              : 'text-[var(--ink-soft)] hover:bg-[var(--hover-bg)] hover:text-[var(--ink)]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ringkasan Unit 11</span>
        </button>
      </div>

      {/* TAB 1: PERINGATAN DINI AI */}
      {activeTab === 'warnings' && (
        <section className="space-y-5 animate-slide-prev">
          <div className="surface-card p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-heading text-base font-bold text-[var(--ink)]">
                Pemindaian Pola Kegagalan Berulang
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0">
                AI mengelompokkan seluruh laporan per aset untuk menandai risiko gangguan berulang.
              </p>
            </div>

            <button
              type="button"
              disabled={isScanning}
              onClick={handleScanPatterns}
              className="group pop-btn px-5 py-3 rounded-full font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md disabled:opacity-50 shrink-0"
            >
              <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Memindai Pola...' : 'Pindai Pola Berulang'}</span>
            </button>
          </div>

          {scanError && (
            <div
              key={scanError}
              role="alert"
              style={{
                backgroundColor: 'var(--red-bg)',
                borderColor: 'var(--red-border)',
                color: 'var(--red)',
              }}
              className="p-4 rounded-xl border text-sm font-bold animate-shake"
            >
              {scanError}
            </div>
          )}

          {isScanning && (
            <SynqraLoader
              variant="radar"
              label="Memindai pola anomali berulang..."
              sublabel={`Mengelompokkan riwayat lintas-aset pada ${assets.length} peralatan ${COMPANY_UMBRELLA.shortBadge}.`}
            />
          )}

          {!scanResult && !isScanning && (
            <div className="surface-card p-6 rounded-3xl space-y-4">
              <div className="font-heading text-base font-bold text-[var(--ink)]">
                Ringkasan Populasi Kasus Siap Pindai (6 Kelompok Peralatan)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
                {pilotSummary.distribution.map((d, idx) => (
                  <div
                    key={d.assetId}
                    style={{ '--i': idx } as React.CSSProperties}
                    className="p-4 rounded-2xl bg-[var(--soft)] space-y-1"
                  >
                    <div className="font-heading text-sm font-extrabold text-[var(--cyan-dark)]">
                      {d.assetId} · {d.tagCount} Tag
                    </div>
                    <div className="font-heading text-2xl font-extrabold text-[var(--ink)]">
                      {d.count} Kasus
                    </div>
                    <div className="text-sm text-[var(--ink-soft)]">
                      {d.verified} kasus terverifikasi pakar
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[var(--ink-soft)] m-0">
                Tekan tombol <b>Pindai Pola Berulang</b> di atas untuk melihat sinyal peringatan dini lintas-aset Unit 11 CDU.
              </p>
            </div>
          )}

          {scanResult && !isScanning && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2.5 text-sm font-heading font-bold">
                  <span
                    title={scanResult.errorReason || scanResult.usedModel}
                    style={{
                      color:
                        scanResult.engine === 'gemini-live'
                          ? 'var(--green)'
                          : 'var(--amber)',
                    }}
                  >
                    {scanResult.engine === 'gemini-live' ? 'AI Live' : 'Lokal'}
                  </span>
                  <span className="text-[var(--muted)]">·</span>
                  <span className="text-[var(--ink)]">
                    {scanResult.alerts.length} Sinyal Terdeteksi
                  </span>
                </div>

                <span className="text-sm text-[var(--muted)]">
                  {new Date(scanResult.generatedAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 stagger">
                {scanResult.alerts.map((alert: EarlyWarningAlert, idx: number) => (
                  <article
                    key={alert.id}
                    style={{ '--i': Math.min(idx, 5) } as React.CSSProperties}
                    className="surface-card lift p-5 sm:p-6 rounded-3xl space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          style={getSeverityStyle(alert.severity)}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-[7px] font-heading text-[11px] font-bold uppercase tracking-wider shadow-sm"
                        >
                          {alert.severity}
                        </span>

                        <span className="font-heading text-sm font-extrabold text-[var(--cyan-dark)]">
                          {alert.assetId}
                        </span>
                      </div>

                      <span className="font-heading text-xs font-bold text-[var(--muted)]">
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

                    <div className="p-4 rounded-2xl bg-[var(--soft)] text-sm font-semibold text-[var(--ink)]">
                      <b className="text-[var(--cyan-dark)]">Saran Pencegahan: </b>
                      <span>{alert.recommendedAction}</span>
                    </div>

                    {alert.isCrossAssetPattern && alert.affectedAssetIds && alert.affectedAssetIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-heading text-xs font-bold text-[var(--ink-soft)] mr-1">
                          Jalur Terdampak:
                        </span>
                        {alert.affectedAssetIds.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-[6px] bg-[var(--soft)] font-heading text-xs font-bold text-[var(--ink)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

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
                            className="group hit-area px-3 py-1.5 rounded-full bg-[var(--soft)] hover:bg-[var(--hover-bg)] font-heading text-xs font-bold text-[var(--cyan-dark)] inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <span>{repId}</span>
                            <ExternalLink className="w-3 h-3 nudge-x" />
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

      {/* TAB 2: RINGKASAN UNIT 11 CDU */}
      {activeTab === 'summary' && (
        <div className="space-y-6 animate-slide-next">
          {/* 3 Metrik Ringkas Kesiapan Pilot */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
            <div
              style={{ '--i': 0 } as React.CSSProperties}
              className="surface-card lift p-5 rounded-2xl space-y-2"
            >
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
                {pilotSummary.ftrCount}/{pilotSummary.totalReports} kasus memiliki bukti fisik tanpa revisi terbuka.
              </p>
            </div>

            <div
              style={{ '--i': 1 } as React.CSSProperties}
              className="surface-card lift p-5 rounded-2xl space-y-2"
            >
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
                {pilotSummary.compliantActiveCount}/{pilotSummary.activeCount} kasus aktif masih dalam batas SLA.
              </p>
            </div>

            <div
              style={{ '--i': 2 } as React.CSSProperties}
              className="surface-card lift p-5 rounded-2xl space-y-2.5"
            >
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
                        className="h-full rounded-[3px] bg-[#00B8D9] transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(item.pct, item.count > 0 ? 12 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Profil Kesiapan per Kelompok Peralatan Unit 11 CDU (Breakout Cards) */}
          <section className="surface-card p-6 rounded-3xl space-y-4">
            <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
              Profil Pengetahuan per Kelompok Peralatan Unit 11 CDU
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {pilotSummary.distribution.map((item, idx) => {
                const openCases = item.count - item.verified;
                const synthAsset: Asset = {
                  id: item.assetId,
                  name: item.label,
                  subtitle: `${item.tagCount} Kode Tag`,
                  type: item.renderType,
                  area: `${item.tagCount} Kode Tag · ${item.unitCount} Unit`,
                  dept: 'Unit 11 CDU',
                  description: item.label,
                };

                return (
                  <EquipmentBreakoutCard
                    key={item.categoryCode}
                    asset={synthAsset}
                    isDarkMode={isDarkMode}
                    style={{ '--i': idx } as React.CSSProperties}
                    badgeText={`${item.verified} Verified`}
                    metaText={
                      item.latestCase
                        ? `${openCases} aktif · Terbaru ${item.latestCase.id}`
                        : `${openCases} kasus aktif`
                    }
                    onClick={item.latestCase ? () => onOpenReport(item.latestCase!) : undefined}
                  />
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
