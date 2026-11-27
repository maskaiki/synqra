'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Asset, AssetCategoryCode, CitationItem, Evidence, Report } from '@/types/synqra';
import {
  CDU11_SYSTEMIC_PATTERNS,
  EQUIPMENT_CATEGORIES,
} from '@/lib/cduBalonganKnowledge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCheck2,
  GitBranch,
  Network,
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
    initialAssetId || assets[0]?.id || '11-C-106'
  );
  const [activeCategory, setActiveCategory] = useState<AssetCategoryCode>(() => {
    const initialObj = assets.find((a) => a.id === (initialAssetId || assets[0]?.id));
    return initialObj?.categoryCode || 'C';
  });
  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const [focusedReportId, setFocusedReportId] = useState<string | null>(null);
  const [hoveredReportId, setHoveredReportId] = useState<string | null>(null);

  useEffect(() => {
    if (initialAssetId) {
      const target = assets.find((a) => a.id === initialAssetId);
      if (target) {
        setSelectedAssetId(target.id);
        if (target.categoryCode) setActiveCategory(target.categoryCode);
        setFocusedReportId(null);
        setHoveredReportId(null);
      }
    }
  }, [initialAssetId, assets]);

  const categoryAssets = useMemo(
    () => assets.filter((a) => a.categoryCode === activeCategory),
    [assets, activeCategory]
  );

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || categoryAssets[0] || assets[0];
  const crossAssetPatterns = useMemo(
    () =>
      selectedAsset
        ? CDU11_SYSTEMIC_PATTERNS.filter((p) =>
            p.affectedTags.includes(selectedAsset.id)
          )
        : [],
    [selectedAsset]
  );
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

      {/* Scalable 2-Level Asset Selector (6 Categories + 66 Tags) */}
      <section className="surface-card p-4 sm:p-5 rounded-3xl space-y-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {EQUIPMENT_CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat.code;
            const catIds = new Set(
              assets.filter((a) => a.categoryCode === cat.code).map((a) => a.id)
            );
            const verifiedInCat = reports.filter(
              (r) => catIds.has(r.asset_id) && r.status === 'VERIFIED'
            ).length;
            return (
              <button
                key={cat.code}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.code);
                  const firstInCat =
                    assets.find(
                      (a) =>
                        a.categoryCode === cat.code &&
                        reports.some((r) => r.asset_id === a.id && r.status === 'VERIFIED')
                    ) || assets.find((a) => a.categoryCode === cat.code);
                  if (firstInCat) handleSelectAsset(firstInCat.id);
                }}
                className={`px-4 py-2 rounded-full font-heading text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors ${
                  isCatActive
                    ? 'pop-btn shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                <span>{cat.shortLabel}</span>
                <span className={`text-xs ${isCatActive ? 'opacity-80' : 'text-[var(--green)]'}`}>
                  {verifiedInCat} Verified
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-[var(--line-soft)]">
          {categoryAssets.map((a) => {
            const activeTag = a.id === selectedAsset.id;
            const hasVerified = reports.some(
              (r) => r.asset_id === a.id && r.status === 'VERIFIED'
            );
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => handleSelectAsset(a.id)}
                className={`px-3 py-1.5 rounded-[7px] border font-heading text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                  activeTag
                    ? 'border-[var(--cyan)] bg-[var(--cyan-pale)] text-[var(--cyan-dark)] shadow-sm'
                    : 'border-[var(--line-soft)] bg-[var(--soft)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                <span>{a.id}</span>
                {hasVerified && (
                  <CheckCircle2
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: 'var(--green)' }}
                  />
                )}
              </button>
            );
          })}
        </div>
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
                        literatureRefs: focusedReport.literature_refs,
                        sourceAttribution: firstEv?.source_attribution,
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
                        literatureRefs: focusedReport.literature_refs,
                        sourceAttribution: firstEv?.source_attribution,
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

          {/* Bagian 3: Keterkaitan Pola Lintas-Aset Unit 11 CDU */}
          {crossAssetPatterns.length > 0 && (
            <section className="surface-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-[var(--cyan-dark)]" />
                <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
                  Pola Keterkaitan Lintas-Aset ({selectedAsset.id})
                </h2>
              </div>

              <div className="space-y-3">
                {crossAssetPatterns.map((pat) => (
                  <div key={pat.id} className="p-4 rounded-2xl bg-[var(--soft)] space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-heading font-bold text-sm sm:text-base text-[var(--ink)]">
                        {pat.title}
                      </div>
                      <span className="font-heading text-xs font-extrabold uppercase text-[var(--cyan-dark)]">
                        {pat.literatureCodes.join(' · ')}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--ink-soft)] m-0 leading-relaxed">
                      {pat.mechanismSummary}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {pat.affectedTags.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            const target = assets.find((a) => a.id === t);
                            if (target?.categoryCode) setActiveCategory(target.categoryCode);
                            handleSelectAsset(t);
                          }}
                          className={`px-2.5 py-1 rounded-[6px] font-heading text-xs font-bold transition-colors ${
                            t === selectedAsset.id
                              ? 'pop-btn'
                              : 'bg-[var(--surface)] text-[var(--cyan-dark)] hover:bg-[var(--hover-bg)]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
