'use client';

import React, { useEffect, useState } from 'react';
import { Asset, CitationItem, Evidence, Report } from '@/types/synqra';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { EquipmentBreakoutCard } from '@/components/ui/EquipmentBreakoutCard';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCheck2,
  GitBranch,
} from 'lucide-react';

interface KnowledgeGraphViewProps {
  assets: Asset[];
  reports: Report[];
  evidences: Evidence[];
  isDarkMode: boolean;
  initialAssetId?: string;
  onOpenEvidence: (citation: CitationItem) => void;
  onOpenReport: (report: Report) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  assets,
  reports,
  evidences,
  isDarkMode,
  initialAssetId,
  onOpenEvidence,
  onOpenReport,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    initialAssetId || assets[0]?.id || 'P-101A'
  );
  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const [focusedReportId, setFocusedReportId] = useState<string | null>(null);
  const [hoveredReportId, setHoveredReportId] = useState<string | null>(null);

  useEffect(() => {
    if (initialAssetId && assets.some((a) => a.id === initialAssetId)) {
      setSelectedAssetId(initialAssetId);
      setFocusedReportId(null);
      setHoveredReportId(null);
    }
  }, [initialAssetId, assets]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const assetReports = selectedAsset
    ? reports.filter((r) => r.asset_id === selectedAsset.id)
    : [];
  const visibleReports = showAllStatuses
    ? assetReports
    : assetReports.filter((r) => r.status === 'VERIFIED');

  const focusedIndex = focusedReportId
    ? visibleReports.findIndex((r) => r.id === focusedReportId)
    : -1;
  const focusedReport = focusedIndex >= 0 ? visibleReports[focusedIndex] : null;

  // Jakob's law: Esc mengembalikan pengguna dari Panel Fokus Kasus ke Peta Simpul.
  useEffect(() => {
    if (!focusedReport) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocusedReportId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedReport]);

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setFocusedReportId(null);
    setHoveredReportId(null);
  };

  if (!selectedAsset) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold text-[var(--ink)] m-0">
          Knowledge Graph
        </h1>

        <label className="surface-card inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full cursor-pointer text-sm font-bold text-[var(--ink)] select-none self-start sm:self-auto">
          <input
            type="checkbox"
            checked={showAllStatuses}
            onChange={(e) => {
              setShowAllStatuses(e.target.checked);
              setFocusedReportId(null);
              setHoveredReportId(null);
            }}
            className="w-4 h-4 accent-[#00B8D9]"
          />
          <span>Sertakan Praduga</span>
        </label>
      </header>

      {/* Asset Selector Cards (Breakout Seamless) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
        {assets.map((asset, idx) => {
          const isSelected = asset.id === selectedAsset.id;
          const verifiedTotal = reports.filter(
            (r) => r.asset_id === asset.id && r.status === 'VERIFIED'
          ).length;
          const allTotal = reports.filter((r) => r.asset_id === asset.id).length;

          return (
            <EquipmentBreakoutCard
              key={asset.id}
              asset={asset}
              isDarkMode={isDarkMode}
              selected={isSelected}
              compact
              style={{ '--i': idx } as React.CSSProperties}
              badgeText={`${verifiedTotal} Verified`}
              metaText={`${allTotal} Kasus · ${asset.area.split(' · ')[0]}`}
              onClick={() => handleSelectAsset(asset.id)}
            />
          );
        })}
      </section>

      {focusedReport ? (
        /* Panel Fokus Kasus: Tampilan rantai sebab-akibat 5 lapis yang lega */
        <section
          key={focusedReport.id}
          className="surface-card p-6 rounded-3xl space-y-6 animate-slide-next"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--line-soft)]">
            <button
              type="button"
              onClick={() => setFocusedReportId(null)}
              className="group hit-area inline-flex items-center gap-2 font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline self-start"
            >
              <ArrowLeft className="w-4 h-4 nudge-back" />
              <span>Kembali ke Peta</span>
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              {(() => {
                const repEvidences = evidences.filter((e) => e.report_id === focusedReport.id);
                const firstEv = repEvidences[0];
                return (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenEvidence({
                        index: focusedIndex + 1,
                        reportId: focusedReport.id,
                        status: focusedReport.status,
                        assetId: focusedReport.asset_id,
                        title: focusedReport.title,
                        evidenceName:
                          firstEv?.file_name || focusedReport.evidence_note || 'Lampiran Bukti',
                        evidenceUrl: firstEv?.public_url || focusedReport.image_url,
                        gejala: focusedReport.gejala,
                        praduga_penyebab: focusedReport.praduga_penyebab,
                        usulan_tindakan: focusedReport.usulan_tindakan,
                        verifiedBy: focusedReport.verified_by,
                      })
                    }
                    className="px-4 py-2.5 rounded-full border border-[var(--line-soft)] bg-[var(--soft)] hover:border-[var(--cyan)] font-heading text-sm font-bold text-[var(--ink)] inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-[var(--cyan-dark)]" />
                    <span>Lihat Bukti</span>
                  </button>
                );
              })()}

              <button
                type="button"
                onClick={() => onOpenReport(focusedReport)}
                className="group pop-btn px-5 py-2.5 rounded-full font-heading text-sm font-bold inline-flex items-center gap-2 shadow-md"
              >
                <span>Buka Detail Lengkap</span>
                <ArrowRight className="w-4 h-4 nudge-x" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)]">
                  {focusedReport.id}
                </span>
                <span className="text-sm font-bold text-[var(--ink-soft)]">
                  {selectedAsset.id} ({selectedAsset.name})
                </span>
                <StatusBadge status={focusedReport.status} size="sm" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--ink)]">
                {focusedReport.title}
              </h2>
            </div>
          </div>

          {/* Rantai Sebab-Akibat 5 Lapis */}
          {(() => {
            const repEvidences = evidences.filter((e) => e.report_id === focusedReport.id);
            const firstEv = repEvidences[0];

            const chainNodes = [
              {
                tier: '1 · KASUS TERCATAT',
                accent: 'var(--cyan-dark)',
                text: `${focusedReport.id}: ${focusedReport.title}`,
              },
              {
                tier: '2 · GEJALA LAPANGAN',
                accent: 'var(--amber)',
                text: focusedReport.gejala,
              },
              {
                tier:
                  focusedReport.status === 'VERIFIED'
                    ? '3 · AKAR PENYEBAB (TERVERIFIKASI)'
                    : '3 · PRADUGA PENYEBAB (BELUM DISAHKAN)',
                accent: 'var(--red)',
                text: focusedReport.praduga_penyebab,
              },
              {
                tier: '4 · SOLUSI & VERIFIKASI',
                accent: 'var(--info)',
                text: `${focusedReport.usulan_tindakan}. Verifikasi: ${focusedReport.verifikasi}`,
              },
            ];

            return (
              <div className="space-y-0 stagger">
                {chainNodes.map((node, idx) => (
                  <div key={node.tier} style={{ '--i': idx } as React.CSSProperties}>
                    <div className="p-4 rounded-2xl bg-[var(--soft)]">
                      <div
                        style={{ color: node.accent }}
                        className="font-heading text-xs font-extrabold uppercase tracking-wider mb-1"
                      >
                        {node.tier}
                      </div>
                      <div className="text-sm font-semibold text-[var(--ink)] leading-relaxed">
                        {node.text}
                      </div>
                    </div>
                    <div className="w-[2px] h-3.5 bg-[var(--line)] ml-6" />
                  </div>
                ))}

                <div
                  style={{
                    '--i': 4,
                    backgroundColor: 'var(--green-bg)',
                  } as React.CSSProperties}
                  className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <FileCheck2
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: 'var(--green)' }}
                    />
                    <div className="min-w-0">
                      <div
                        style={{ color: 'var(--green)' }}
                        className="font-heading text-xs font-extrabold uppercase tracking-wider"
                      >
                        5 · BUKTI FISIK ({repEvidences.length} LAMPIRAN)
                      </div>
                      <div className="text-sm font-bold text-[var(--ink)] truncate mt-0.5">
                        {firstEv?.file_name || focusedReport.evidence_note || 'Belum ada file bukti'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenEvidence({
                        index: focusedIndex + 1,
                        reportId: focusedReport.id,
                        status: focusedReport.status,
                        assetId: focusedReport.asset_id,
                        title: focusedReport.title,
                        evidenceName:
                          firstEv?.file_name || focusedReport.evidence_note || 'Lampiran Bukti',
                        evidenceUrl: firstEv?.public_url || focusedReport.image_url,
                        gejala: focusedReport.gejala,
                        praduga_penyebab: focusedReport.praduga_penyebab,
                        usulan_tindakan: focusedReport.usulan_tindakan,
                        verifiedBy: focusedReport.verified_by,
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--cyan)] font-heading text-sm font-bold text-[var(--ink)] inline-flex items-center gap-2 shrink-0"
                  >
                    <Eye className="w-4 h-4 text-[var(--cyan-dark)]" />
                    <span>Lihat Bukti</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </section>
      ) : (
        /* Overview Mode: Peta Simpul Visual + Daftar Kasus 1 Baris */
        <div className="space-y-6 animate-slide-prev">
          {/* Bagian 1: Peta Simpul Visual Ringkas */}
          <section className="surface-card p-6 rounded-3xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[var(--cyan-dark)]" />
                <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
                  Peta Simpul Aset {selectedAsset.id}
                </h2>
              </div>
              <span className="text-sm font-semibold text-[var(--ink-soft)]">
                {visibleReports.length} kasus ditampilkan
              </span>
            </div>

            {visibleReports.length === 0 ? (
              <div className="p-10 rounded-3xl bg-[var(--soft)] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[var(--cyan-dark)]" />
                <div className="font-heading font-bold text-base text-[var(--ink)]">
                  Belum ada kasus TERVERIFIKASI pada aset {selectedAsset.id}
                </div>
                <p className="text-sm text-[var(--ink-soft)] m-0">
                  Aktifkan opsi Sertakan Praduga / Investigasi atau sahkan kasus di menu Triage &amp; Kasus.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[260px_76px_1fr] items-center gap-5 lg:gap-0 pt-6">
                {/* Simpul Aset Pusat seamless kompak tanpa kotak border cyan tebal */}
                <div className="group pt-6 min-w-0">
                  <div
                    style={{ background: 'var(--stage-gradient-active)' }}
                    className="rounded-3xl p-5 flex flex-col items-center text-center gap-3 overflow-visible"
                  >
                    <TechnicalArt
                      type={selectedAsset.type}
                      darkMode={isDarkMode}
                      breakout
                      className="w-full h-36 -mt-12 relative z-10"
                    />
                    <div
                      aria-hidden="true"
                      className="w-3/4 h-3 -mt-2 rounded-[50%]"
                      style={{ background: 'var(--stage-floor)' }}
                    />
                    <div className="space-y-0.5 pt-1">
                      <div className="font-heading text-xl font-extrabold text-[var(--ink)]">
                        {selectedAsset.id}
                      </div>
                      <div className="font-heading font-bold text-sm text-[var(--cyan-dark)]">
                        {selectedAsset.name}
                      </div>
                      <div className="text-sm text-[var(--ink-soft)]">
                        {selectedAsset.area}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Garis Penghubung Visual (Desktop) */}
                <div className="hidden lg:block w-full h-full min-h-[220px]" aria-hidden="true">
                  <svg
                    viewBox="0 0 76 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    {visibleReports.map((rep, idx) => {
                      const targetY = ((idx + 0.5) / visibleReports.length) * 100;
                      const strokeColor =
                        rep.status === 'VERIFIED' ? 'var(--cyan)' : 'var(--amber)';
                      const isActive = hoveredReportId === rep.id;
                      const opacity = hoveredReportId ? (isActive ? 1 : 0.2) : 0.65;
                      const width = isActive ? 2.6 : 1.75;
                      return (
                        <path
                          key={rep.id}
                          d={`M 0 50 C 38 50, 38 ${targetY}, 76 ${targetY}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={width}
                          strokeOpacity={opacity}
                          vectorEffect="non-scaling-stroke"
                          style={{ transition: 'stroke-opacity 180ms ease, stroke-width 180ms ease' }}
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Kelompok Simpul Gejala / Kasus (Tanpa border kiri/luar) */}
                <div className="min-w-0 grid auto-rows-fr gap-2.5 stagger">
                  {visibleReports.map((rep, idx) => (
                    <button
                      key={rep.id}
                      type="button"
                      onClick={() => {
                        setHoveredReportId(null);
                        setFocusedReportId(rep.id);
                      }}
                      onMouseEnter={() => setHoveredReportId(rep.id)}
                      onMouseLeave={() => setHoveredReportId(null)}
                      onFocus={() => setHoveredReportId(rep.id)}
                      onBlur={() => setHoveredReportId(null)}
                      style={{ '--i': Math.min(idx, 5) } as React.CSSProperties}
                      className="group lift w-full min-w-0 max-w-full overflow-hidden px-4 py-3.5 rounded-2xl bg-[var(--soft)] hover:bg-[var(--hover-bg)] text-left flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)] shrink-0">
                            {rep.id}
                          </span>
                          <span className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                            {rep.title}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--ink-soft)] truncate m-0 mt-0.5">
                          {rep.gejala}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--cyan-dark)] shrink-0 nudge-x" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Bagian 2: Daftar Kasus Terkait (Clean Divider List tanpa kotak-dalam-kotak) */}
          {visibleReports.length > 0 && (
            <section className="surface-card p-6 rounded-3xl space-y-2">
              <h2 className="font-heading text-lg font-bold text-[var(--ink)] mb-3 m-0">
                Daftar Kasus ({visibleReports.length})
              </h2>

              <div className="divide-y divide-[var(--line-soft)] stagger">
                {visibleReports.map((rep, idx) => {
                  const evCount = evidences.filter((e) => e.report_id === rep.id).length;
                  return (
                    <button
                      key={rep.id}
                      type="button"
                      style={{ '--i': Math.min(idx, 5) } as React.CSSProperties}
                      onClick={() => {
                        setHoveredReportId(null);
                        setFocusedReportId(rep.id);
                      }}
                      onMouseEnter={() => setHoveredReportId(rep.id)}
                      onMouseLeave={() => setHoveredReportId(null)}
                      className="group w-full min-w-0 max-w-full py-3.5 px-3 rounded-2xl hover:bg-[var(--hover-bg)] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)] shrink-0">
                          {rep.id}
                        </span>
                        <span className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                          {rep.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <StatusBadge status={rep.status} size="sm" />
                        <span className="text-sm font-semibold text-[var(--ink-soft)] whitespace-nowrap">
                          {evCount} bukti
                        </span>
                        <ChevronRight className="w-4 h-4 text-[var(--cyan-dark)] nudge-x" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
