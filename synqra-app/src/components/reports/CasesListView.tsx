'use client';

import React, { useMemo, useState } from 'react';
import { Asset, AssetCategoryCode, Evidence, Report, ReportStatus, RoleInfo } from '@/types/synqra';
import { calculateSla } from '@/lib/constants';
import { EQUIPMENT_CATEGORIES } from '@/lib/cduBalonganKnowledge';
import { RiskBadge, SlaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { ArrowRight, Lock, Plus, Search } from 'lucide-react';

interface CasesListViewProps {
  roleInfo: RoleInfo;
  assets: Asset[];
  reports: Report[];
  evidences: Evidence[];
  isDarkMode: boolean;
  onSelectReport: (report: Report) => void;
  onCreateNew: () => void;
  onSendSlaReminder: (targets: Report[]) => void;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  roleInfo,
  assets,
  reports,
  evidences,
  isDarkMode,
  onSelectReport,
  onCreateNew,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AssetCategoryCode>('ALL');
  const [assetFilter, setAssetFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReportStatus>('ALL');
  const [slaFilter, setSlaFilter] = useState<'ALL' | 'OVERDUE' | 'URGENT'>('ALL');
  const [query, setQuery] = useState('');

  const normalize = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const assetById = useMemo(
    () => new Map(assets.map((a) => [a.id, a])),
    [assets]
  );

  const scopedAssets = useMemo(
    () =>
      categoryFilter === 'ALL'
        ? assets
        : assets.filter((a) => a.categoryCode === categoryFilter),
    [assets, categoryFilter]
  );

  const filtered = reports.filter((r) => {
    const assetObj = assetById.get(r.asset_id);
    const matchCategory =
      categoryFilter === 'ALL' || assetObj?.categoryCode === categoryFilter;
    const matchAsset = assetFilter === 'ALL' || r.asset_id === assetFilter;
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const sla = calculateSla(r.updated_at || r.created_at);
    const matchSla =
      slaFilter === 'ALL' ||
      (slaFilter === 'OVERDUE' && r.status !== 'VERIFIED' && sla.level === 'red') ||
      (slaFilter === 'URGENT' &&
        r.status !== 'VERIFIED' &&
        (sla.level === 'red' || sla.level === 'yellow'));

    const q = query.trim().toLowerCase();
    const nq = normalize(q);
    const fields = [
      r.id,
      r.title,
      r.asset_id,
      r.identitas_alat,
      r.gejala,
      r.reporter_name,
      ...(r.literature_refs || []),
    ];
    const matchQuery =
      !q ||
      fields.some((f) => f.toLowerCase().includes(q)) ||
      (nq.length > 0 && fields.some((f) => normalize(f).includes(nq)));

    return matchCategory && matchAsset && matchStatus && matchSla && matchQuery;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)] m-0">
            Triage &amp; Kasus
          </h1>
          <span className="font-heading text-base font-bold text-[var(--muted)]">
            {filtered.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="group pop-btn px-5 py-3 rounded-full font-heading font-bold text-sm inline-flex items-center gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[2.5] spin-on-hover" />
          <span>Buat Laporan</span>
        </button>
      </header>

      <section className="surface-card p-5 rounded-3xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[var(--cyan-dark)] absolute left-4 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari laporan, aset, gejala, atau pelapor..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full border-0 bg-[var(--soft)] text-[var(--ink)] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#00B8D9]/20 transition-shadow duration-200"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('ALL');
                setAssetFilter('ALL');
              }}
              className={`px-3.5 py-2 rounded-full font-heading text-xs sm:text-sm font-bold ${
                categoryFilter === 'ALL'
                  ? 'pop-btn shadow-sm'
                  : 'bg-[var(--soft)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              Semua ({assets.length})
            </button>
            {EQUIPMENT_CATEGORIES.map((cat) => (
              <button
                key={cat.code}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat.code);
                  setAssetFilter('ALL');
                }}
                className={`px-3.5 py-2 rounded-full font-heading text-xs sm:text-sm font-bold ${
                  categoryFilter === cat.code
                    ? 'pop-btn shadow-sm'
                    : 'bg-[var(--soft)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {cat.shortLabel}
              </button>
            ))}

            <select
              aria-label="Filter Kode Tag Alat"
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value)}
              className="px-3.5 py-2 rounded-full border border-[var(--line-soft)] bg-[var(--soft)] text-[var(--ink)] font-heading text-xs sm:text-sm font-bold focus:outline-none focus:border-[var(--cyan)]"
            >
              <option value="ALL">
                Semua Tag ({scopedAssets.length})
              </option>
              {scopedAssets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} · {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--line-soft)]">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['ALL', 'Semua Status'],
                ['PRADUGA', 'Praduga'],
                ['TRIAGE', 'Triage'],
                ['INVESTIGATION', 'Investigasi'],
                ['VERIFIED', 'Terverifikasi'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`hit-area px-3.5 py-1.5 rounded-full font-heading text-xs font-bold ${
                  statusFilter === key
                    ? 'bg-[var(--cyan-pale)] text-[var(--cyan-dark)]'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--soft)] hover:text-[var(--ink)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['ALL', 'Semua SLA'],
                ['OVERDUE', 'Overdue'],
                ['URGENT', 'Segera Cek'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSlaFilter(key)}
                className={`hit-area px-3.5 py-1.5 rounded-full font-heading text-xs font-bold ${
                  slaFilter === key
                    ? 'bg-[#DC2626] text-white shadow-sm'
                    : 'text-[var(--ink-soft)] hover:bg-[var(--soft)] hover:text-[var(--ink)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3 stagger">
        {filtered.map((report, idx) => {
          const asset = assets.find((a) => a.id === report.asset_id) || assets[0];
          const sla = calculateSla(report.updated_at || report.created_at);
          const evCount = evidences.filter((e) => e.report_id === report.id).length;
          const isSelfReport =
            roleInfo.key === 'hse_validator' && report.reporter_name === roleInfo.name;

          return (
            <article
              key={report.id}
              role="button"
              tabIndex={0}
              style={{ '--i': Math.min(idx, 6) } as React.CSSProperties}
              onClick={() => onSelectReport(report)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectReport(report);
                }
              }}
              className="group surface-card lift p-5 rounded-3xl cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center p-1.5 shrink-0"
                  style={{ background: 'var(--stage-gradient)' }}
                >
                  <TechnicalArt
                    type={asset?.type || 'pump'}
                    darkMode={isDarkMode}
                    className="w-14 h-14"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)]">
                      {report.id}
                    </span>
                    <span className="font-heading font-bold text-sm text-[var(--ink)]">
                      · {report.asset_id}
                    </span>
                    <StatusBadge status={report.status} size="sm" />
                    {report.status !== 'VERIFIED' && <SlaBadge sla={sla} compact />}
                    {report.risk_level && <RiskBadge level={report.risk_level} />}
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[var(--ink)] leading-snug m-0">
                    {report.title}
                  </h3>

                  <p className="text-sm text-[var(--ink-soft)] line-clamp-1 m-0">
                    {report.gejala}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[var(--ink-soft)] pt-0.5">
                    <span>{report.reporter_name}</span>
                    <span style={{ color: evCount > 0 ? 'var(--green)' : 'var(--red)' }} className="font-semibold">
                      {evCount > 0 ? `${evCount} bukti` : '0 bukti'}
                    </span>
                    {isSelfReport && report.status !== 'VERIFIED' && (
                      <span
                        style={{ color: 'var(--amber)' }}
                        className="inline-flex items-center gap-1 font-bold"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        No Self-Approval
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span className="w-10 h-10 rounded-full bg-[var(--soft)] text-[var(--ink)] group-hover:bg-[var(--pop-bg)] group-hover:text-[var(--pop-ink)] transition-colors duration-200 inline-flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 nudge-x" />
                </span>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="surface-card p-12 rounded-3xl text-center animate-fade-in">
            <p className="text-base font-bold text-[var(--ink-soft)] m-0">
              Tidak ada kasus yang cocok dengan filter saat ini.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
