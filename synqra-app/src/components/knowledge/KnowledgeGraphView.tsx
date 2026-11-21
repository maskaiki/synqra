'use client';

import React, { useState } from 'react';
import { Asset, CitationItem, Evidence, Report } from '@/types/synqra';
import { detectEarlyWarnings } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { AlertTriangle, CheckCircle2, Eye, FileCheck2, Layers } from 'lucide-react';

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

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const assetReports = reports.filter((r) => r.asset_id === selectedAsset.id);
  const visibleReports = showAllStatuses
    ? assetReports
    : assetReports.filter((r) => r.status === 'VERIFIED');

  const warnings = detectEarlyWarnings(reports, [selectedAsset]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-[var(--cyan-dark)]">
            TAHAP 5 · ISOLATED ASSET KNOWLEDGE GRAPH
          </div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)] mt-1">
            Peta Pengetahuan per Aset
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1">
            Graf dipisahkan khusus untuk satu peralatan agar riwayat gejala, penyebab, dan bukti tidak bercampur antar-mesin.
          </p>
        </div>

        <label className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] cursor-pointer text-sm font-bold text-[var(--ink)] select-none self-start sm:self-auto">
          <input
            type="checkbox"
            checked={showAllStatuses}
            onChange={(e) => setShowAllStatuses(e.target.checked)}
            className="w-4 h-4 accent-[#00B8D9]"
          />
          <span>Tampilkan juga kasus Praduga / Investigasi</span>
        </label>
      </header>

      {/* Asset Selector Cards (Isolated Switch) */}
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
              onClick={() => setSelectedAssetId(asset.id)}
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
                <div className="text-xs font-bold text-[var(--ink-soft)] mt-1">
                  {verifiedTotal} Verified · {allTotal} Total Kasus
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
            <b style={{ color: 'var(--amber)' }}>Sinyal Dini pada {selectedAsset.id}: </b>
            {warnings[0].message}
          </div>
        </div>
      )}

      {/* Isolated Graph Main View */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Root Asset Node (4 cols) */}
        <div className="xl:col-span-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] font-heading text-xs font-extrabold uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>NODE ASET TERISOLASI</span>
          </div>
          <div className="h-36 rounded-2xl bg-[var(--soft)] border border-[var(--line-soft)] flex items-center justify-center p-3">
            <TechnicalArt type={selectedAsset.type} darkMode={isDarkMode} className="w-full h-32" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-[var(--ink)]">
              {selectedAsset.id}
            </h2>
            <div className="font-heading font-bold text-base text-[var(--cyan-dark)]">
              {selectedAsset.name}
            </div>
            <p className="text-sm text-[var(--ink-soft)] mt-2 leading-relaxed">
              {selectedAsset.description}
            </p>
          </div>
          <div className="pt-3 border-t border-[var(--line-soft)] text-sm space-y-1.5 text-[var(--ink-soft)]">
            <div>
              Area: <b className="text-[var(--ink)]">{selectedAsset.area}</b>
            </div>
            <div>
              Departemen: <b className="text-[var(--ink)]">{selectedAsset.dept}</b>
            </div>
          </div>
        </div>

        {/* Connected 5-Tier Causal Chains (8 cols) */}
        <div className="xl:col-span-8 space-y-5">
          {visibleReports.length === 0 ? (
            <div className="p-10 rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--line)] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[var(--cyan-dark)]" />
              <div className="font-heading font-bold text-base text-[var(--ink)]">
                Belum ada kasus TERVERIFIKASI pada aset {selectedAsset.id}
              </div>
              <p className="text-sm text-[var(--ink-soft)]">
                Centang &ldquo;Tampilkan juga kasus Praduga / Investigasi&rdquo; di kanan atas, atau sahkan kasus pada menu Triage &amp; Kasus.
              </p>
            </div>
          ) : (
            visibleReports.map((rep, repIdx) => {
              const repEvidences = evidences.filter((e) => e.report_id === rep.id);
              const firstEv = repEvidences[0];

              const chainNodes = [
                {
                  tier: '1 · KASUS TERCATAT',
                  accent: 'var(--cyan-dark)',
                  text: `${rep.id} — ${rep.title}`,
                },
                {
                  tier: '2 · GEJALA LAPANGAN',
                  accent: 'var(--amber)',
                  text: rep.gejala,
                },
                {
                  tier:
                    rep.status === 'VERIFIED'
                      ? '3 · AKAR PENYEBAB (TERVERIFIKASI)'
                      : '3 · PRADUGA PENYEBAB (BELUM DISAHKAN)',
                  accent: 'var(--red)',
                  text: rep.praduga_penyebab,
                },
                {
                  tier: '4 · SOLUSI & VERIFIKASI',
                  accent: 'var(--info)',
                  text: `${rep.usulan_tindakan} · Verifikasi: ${rep.verifikasi}`,
                },
              ];

              return (
                <article
                  key={rep.id}
                  className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line-soft)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)]">
                        {rep.id}
                      </span>
                      <StatusBadge status={rep.status} size="sm" />
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenReport(rep)}
                      className="font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline"
                    >
                      Buka Ruang Kasus →
                    </button>
                  </div>

                  {/* 5-Tier Connected Chain */}
                  <div className="space-y-0">
                    {chainNodes.map((node, i) => (
                      <div key={node.tier}>
                        <div
                          style={{ borderLeftColor: node.accent }}
                          className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] border-l-[4px]"
                        >
                          <div
                            style={{ color: node.accent }}
                            className="font-heading text-[11.5px] font-extrabold uppercase tracking-wider mb-0.5"
                          >
                            {node.tier}
                          </div>
                          <div className="text-sm font-semibold text-[var(--ink)] leading-snug">
                            {node.text}
                          </div>
                        </div>
                        {i < chainNodes.length && (
                          <div className="w-[2px] h-3.5 bg-[var(--line)] ml-5" />
                        )}
                      </div>
                    ))}

                    {/* Tier 5: Clickable Evidence Node */}
                    <div
                      style={{
                        backgroundColor: 'var(--green-bg)',
                        borderColor: 'var(--green-border)',
                        borderLeftColor: 'var(--green)',
                      }}
                      className="p-3.5 rounded-xl border border-l-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <FileCheck2
                          className="w-5 h-5 shrink-0 mt-0.5"
                          style={{ color: 'var(--green)' }}
                        />
                        <div className="min-w-0">
                          <div
                            style={{ color: 'var(--green)' }}
                            className="font-heading text-[11.5px] font-extrabold uppercase tracking-wider"
                          >
                            5 · FILE BUKTI ({repEvidences.length} LAMPIRAN)
                          </div>
                          <div className="text-sm font-bold text-[var(--ink)] truncate">
                            {firstEv?.file_name || rep.evidence_note || 'Belum ada file bukti'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenEvidence({
                            index: repIdx + 1,
                            reportId: rep.id,
                            status: rep.status,
                            assetId: rep.asset_id,
                            title: rep.title,
                            evidenceName:
                              firstEv?.file_name || rep.evidence_note || 'Lampiran Bukti',
                            evidenceUrl: firstEv?.public_url || rep.image_url,
                            gejala: rep.gejala,
                            praduga_penyebab: rep.praduga_penyebab,
                            usulan_tindakan: rep.usulan_tindakan,
                            verifiedBy: rep.verified_by,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--cyan)] font-heading text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5 shrink-0"
                      >
                        <Eye className="w-4 h-4 text-[var(--cyan-dark)]" />
                        <span>Lihat Bukti</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
