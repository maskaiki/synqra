'use client';

import React, { useState } from 'react';
import { Asset, CitationItem, Evidence, Report } from '@/types/synqra';
import { detectEarlyWarnings } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import {
  AlertTriangle,
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
  onOpenEvidence: (citation: CitationItem) => void;
  onOpenReport: (report: Report) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  assets,
  reports,
  evidences,
  isDarkMode,
  onOpenEvidence,
  onOpenReport,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || 'P-101A');
  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const [focusedReportId, setFocusedReportId] = useState<string | null>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const assetReports = selectedAsset
    ? reports.filter((r) => r.asset_id === selectedAsset.id)
    : [];
  const visibleReports = showAllStatuses
    ? assetReports
    : assetReports.filter((r) => r.status === 'VERIFIED');

  const warnings = selectedAsset ? detectEarlyWarnings(reports, [selectedAsset]) : [];
  const focusedIndex = focusedReportId
    ? visibleReports.findIndex((r) => r.id === focusedReportId)
    : -1;
  const focusedReport = focusedIndex >= 0 ? visibleReports[focusedIndex] : null;

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setFocusedReportId(null);
  };

  if (!selectedAsset) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)]">
            Peta Pengetahuan Aset
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1">
            Telusuri hubungan aset, gejala, dan bukti per peralatan.
          </p>
        </div>

        <label className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] cursor-pointer text-sm font-bold text-[var(--ink)] select-none self-start sm:self-auto">
          <input
            type="checkbox"
            checked={showAllStatuses}
            onChange={(e) => {
              setShowAllStatuses(e.target.checked);
              setFocusedReportId(null);
            }}
            className="w-4 h-4 accent-[#00B8D9]"
          />
          <span>Sertakan Praduga / Investigasi</span>
        </label>
      </header>

      {/* Asset Selector Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assets.map((asset) => {
          const isSelected = asset.id === selectedAsset.id;
          const verifiedTotal = reports.filter(
            (r) => r.asset_id === asset.id && r.status === 'VERIFIED'
          ).length;
          const allTotal = reports.filter((r) => r.asset_id === asset.id).length;

          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => handleSelectAsset(asset.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                isSelected
                  ? 'border-[var(--cyan)] bg-[var(--cyan-pale)] shadow-sm'
                  : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)]/60'
              }`}
            >
              <div className="w-16 h-16 rounded-xl bg-[var(--soft)] border border-[var(--line-soft)] flex items-center justify-center p-1.5 shrink-0">
                <TechnicalArt type={asset.type} darkMode={isDarkMode} className="w-14 h-14" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-heading font-extrabold text-sm text-[var(--cyan-dark)]">
                  {asset.id}
                </div>
                <div className="font-heading font-bold text-[15px] text-[var(--ink)] truncate">
                  {asset.name}
                </div>
                <div className="text-sm font-semibold text-[var(--ink-soft)] mt-0.5">
                  {verifiedTotal} Verified · {allTotal} Total
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {warnings.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--amber-bg)',
            borderColor: 'var(--amber-border)',
            borderLeftColor: 'var(--amber)',
          }}
          className="p-4 rounded-2xl border border-l-[4px] flex items-start gap-3"
        >
          <AlertTriangle
            className="w-5 h-5 shrink-0 mt-0.5"
            style={{ color: 'var(--amber)' }}
          />
          <div className="text-sm font-semibold text-[var(--ink)]">
            <b style={{ color: 'var(--amber)' }}>Sinyal Dini {selectedAsset.id}: </b>
            {warnings[0].summary || warnings[0].message}
          </div>
        </div>
      )}

      {focusedReport ? (
        /* Panel Fokus Kasus: Tampilan rantai sebab-akibat 5 lapis yang lega */
        <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--line-soft)]">
            <button
              type="button"
              onClick={() => setFocusedReportId(null)}
              className="inline-flex items-center gap-2 font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline self-start"
            >
              <ArrowLeft className="w-4 h-4" />
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
                    className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] font-heading text-sm font-bold text-[var(--ink)] inline-flex items-center gap-2 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-[var(--cyan-dark)]" />
                    <span>Lihat Bukti</span>
                  </button>
                );
              })()}

              <button
                type="button"
                onClick={() => onOpenReport(focusedReport)}
                className="px-4 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading text-sm font-bold inline-flex items-center gap-2 transition-colors"
              >
                <span>Buka Detail Lengkap</span>
                <ArrowRight className="w-4 h-4" />
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
              <div className="space-y-0">
                {chainNodes.map((node) => (
                  <div key={node.tier}>
                    <div
                      style={{ borderLeftColor: node.accent }}
                      className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] border-l-[4px]"
                    >
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
                    <div className="w-[2px] h-4 bg-[var(--line)] ml-6" />
                  </div>
                ))}

                <div
                  style={{
                    backgroundColor: 'var(--green-bg)',
                    borderColor: 'var(--green-border)',
                    borderLeftColor: 'var(--green)',
                  }}
                  className="p-4 rounded-xl border border-l-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
        <div className="space-y-6">
          {/* Bagian 1: Peta Simpul Visual Ringkas */}
          <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[var(--cyan-dark)]" />
                <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
                  Peta Simpul Aset {selectedAsset.id}
                </h2>
              </div>
              <span className="text-sm font-semibold text-[var(--ink-soft)]">
                {visibleReports.length} kasus ditampilkan
              </span>
            </div>

            {visibleReports.length === 0 ? (
              <div className="p-10 rounded-xl bg-[var(--soft)] border border-dashed border-[var(--line)] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[var(--cyan-dark)]" />
                <div className="font-heading font-bold text-base text-[var(--ink)]">
                  Belum ada kasus TERVERIFIKASI pada aset {selectedAsset.id}
                </div>
                <p className="text-sm text-[var(--ink-soft)]">
                  Aktifkan opsi Sertakan Praduga / Investigasi atau sahkan kasus di menu Triage &amp; Kasus.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[240px_72px_1fr] items-stretch gap-4 lg:gap-0">
                {/* Simpul Aset Pusat */}
                <div className="p-4 rounded-2xl bg-[var(--soft)] border-2 border-[var(--cyan)] flex flex-col justify-between gap-3">
                  <div className="h-28 rounded-xl bg-[var(--surface)] border border-[var(--line-soft)] flex items-center justify-center p-2">
                    <TechnicalArt
                      type={selectedAsset.type}
                      darkMode={isDarkMode}
                      className="w-full h-24"
                    />
                  </div>
                  <div>
                    <div className="font-heading text-xl font-bold text-[var(--ink)]">
                      {selectedAsset.id}
                    </div>
                    <div className="font-heading font-bold text-sm text-[var(--cyan-dark)]">
                      {selectedAsset.name}
                    </div>
                    <div className="text-sm text-[var(--ink-soft)] mt-1">
                      {selectedAsset.area}
                    </div>
                  </div>
                </div>

                {/* Garis Penghubung Visual (Desktop) */}
                <div className="hidden lg:block w-full h-full min-h-[160px]" aria-hidden="true">
                  <svg
                    viewBox="0 0 72 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    {visibleReports.map((rep, idx) => {
                      const targetY = ((idx + 0.5) / visibleReports.length) * 100;
                      const strokeColor =
                        rep.status === 'VERIFIED' ? 'var(--cyan)' : 'var(--amber)';
                      return (
                        <path
                          key={rep.id}
                          d={`M 0 50 C 36 50, 36 ${targetY}, 72 ${targetY}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="1.75"
                          strokeOpacity="0.65"
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* Kelompok Simpul Gejala / Kasus */}
                <div className="grid auto-rows-fr gap-2.5">
                  {visibleReports.map((rep) => {
                    const isVer = rep.status === 'VERIFIED';
                    return (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => setFocusedReportId(rep.id)}
                        style={{
                          borderLeftColor: isVer ? 'var(--green)' : 'var(--amber)',
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--soft)] border border-[var(--line)] border-l-[3.5px] hover:border-[var(--cyan)] text-left transition-all flex items-center justify-between gap-3 group"
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
                        <ChevronRight className="w-4 h-4 text-[var(--cyan-dark)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Bagian 2: Daftar Kartu Kasus 1 Baris */}
          {visibleReports.length > 0 && (
            <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-3">
              <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
                Daftar Kasus Terkait ({visibleReports.length})
              </h2>

              <div className="space-y-2.5">
                {visibleReports.map((rep) => {
                  const evCount = evidences.filter((e) => e.report_id === rep.id).length;
                  return (
                    <button
                      key={rep.id}
                      type="button"
                      onClick={() => setFocusedReportId(rep.id)}
                      className="w-full p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] hover:border-[var(--cyan)] transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)] shrink-0">
                          {rep.id}
                        </span>
                        <span className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                          {rep.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={rep.status} size="sm" />
                        <span className="text-sm font-semibold text-[var(--ink-soft)] whitespace-nowrap">
                          {evCount} bukti
                        </span>
                        <span className="inline-flex items-center gap-1 font-heading text-sm font-bold text-[var(--cyan-dark)]">
                          <span>Rantai</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </span>
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
