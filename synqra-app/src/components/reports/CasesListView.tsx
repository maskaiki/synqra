'use client';

import React, { useState } from 'react';
import { Asset, Evidence, Report, ReportStatus, RoleInfo } from '@/types/synqra';
import { calculateSla, detectEarlyWarnings } from '@/lib/constants';
import { RiskBadge, SlaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { SlaReminderBanner } from '@/components/sla/SlaReminderBanner';
import { AlertTriangle, ArrowRight, Lock, Plus, Search } from 'lucide-react';

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
  onSendSlaReminder,
}) => {
  const [assetFilter, setAssetFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReportStatus>('ALL');
  const [slaFilter, setSlaFilter] = useState<'ALL' | 'OVERDUE' | 'URGENT'>('ALL');
  const [query, setQuery] = useState('');

  const earlyWarnings = detectEarlyWarnings(reports, assets);

  // Postel's law: terima input yang longgar ("p101a", "P 101 A", atau "rep004")
  // agar tetap cocok dengan "P-101A" / "REP-004" (abaikan huruf besar, spasi & tanda hubung).
  const normalize = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const filtered = reports.filter((r) => {
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
    const fields = [r.id, r.title, r.asset_id, r.gejala, r.reporter_name];
    const matchQuery =
      !q ||
      fields.some((f) => f.toLowerCase().includes(q)) ||
      (nq.length > 0 && fields.some((f) => normalize(f).includes(nq)));

    return matchAsset && matchStatus && matchSla && matchQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)]">
            Triage &amp; Daftar Kasus ({filtered.length})
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1">
            Saring kasus berdasarkan aset, status, dan batas SLA.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="group px-5 py-3 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5] spin-on-hover" />
          <span>Buat Laporan</span>
        </button>
      </header>

      <SlaReminderBanner
        reports={reports}
        currentUserRole={roleInfo.key}
        onSendReminder={onSendSlaReminder}
        onSelectReport={onSelectReport}
      />

      {earlyWarnings.length > 0 && (
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
          <div className="text-sm text-[var(--ink)]">
            <span className="font-heading font-bold" style={{ color: 'var(--amber)' }}>
              Peringatan Dini Pola Berulang:{' '}
            </span>
            {earlyWarnings.map((w) => w.message || w.summary).join(' ')}
          </div>
        </div>
      )}

      <section className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[var(--cyan-dark)] absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nomor laporan, tag alat, gejala, atau nama pelapor..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium focus:outline-none focus:border-[var(--cyan)] focus:ring-4 focus:ring-[#00B8D9]/20 transition-[border-color,box-shadow] duration-200"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAssetFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl border font-heading text-sm font-bold ${
                assetFilter === 'ALL'
                  ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] border-transparent'
                  : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              Semua Aset
            </button>
            {assets.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAssetFilter(a.id)}
                className={`px-3.5 py-2 rounded-xl border font-heading text-sm font-bold ${
                  assetFilter === a.id
                    ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] border-transparent'
                    : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {a.id}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--line-soft)]">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['ALL', 'Semua Status'],
                ['PRADUGA', 'Praduga'],
                ['TRIAGE', 'Triage Dept'],
                ['INVESTIGATION', 'Investigasi'],
                ['VERIFIED', 'Terverifikasi'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`hit-area px-3.5 py-1.5 rounded-lg border font-heading text-xs font-bold ${
                  statusFilter === key
                    ? 'bg-[var(--cyan-pale)] border-[var(--cyan)] text-[var(--cyan-dark)]'
                    : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['ALL', 'Semua SLA'],
                ['OVERDUE', 'Overdue (>48j)'],
                ['URGENT', 'Segera Cek (>24j)'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSlaFilter(key)}
                className={`hit-area px-3 py-1.5 rounded-lg border font-heading text-xs font-bold ${
                  slaFilter === key
                    ? 'bg-[#B42318] text-white border-transparent'
                    : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3.5 stagger">
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
              // Staggering dibatasi 6 item agar daftar panjang tetap terasa instan.
              style={{ '--i': Math.min(idx, 6) } as React.CSSProperties}
              onClick={() => onSelectReport(report)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectReport(report);
                }
              }}
              className="group lift p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--cyan)] shadow-sm cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-16 h-16 rounded-xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-center p-1.5 shrink-0">
                  <TechnicalArt
                    type={asset?.type || 'pump'}
                    darkMode={isDarkMode}
                    className="w-14 h-14"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
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

                  <h3 className="font-heading font-bold text-lg text-[var(--ink)] leading-snug">
                    {report.title}
                  </h3>

                  <p className="text-sm text-[var(--ink-soft)] line-clamp-2">
                    <b className="text-[var(--ink)]">Gejala:</b> {report.gejala}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[var(--ink-soft)]">
                    <span>
                      Pelapor: <b className="text-[var(--ink)]">{report.reporter_name}</b>
                    </span>
                    <span>
                      Bukti Fisik:{' '}
                      <b style={{ color: evCount > 0 ? 'var(--green)' : 'var(--red)' }}>
                        {evCount > 0 ? `${evCount} file` : 'Kosong (Validasi Terkunci)'}
                      </b>
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
                    {report.sla_reminder_count ? (
                      <span style={{ color: 'var(--red)' }} className="font-bold">
                        Pengingat: {report.sla_reminder_count}x
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] group-hover:border-[var(--cyan)] group-hover:bg-[var(--cyan-pale)] transition-colors duration-200 font-heading font-bold text-sm text-[var(--ink)] inline-flex items-center gap-2">
                  <span>Buka Detail</span>
                  <ArrowRight className="w-4 h-4 text-[var(--cyan-dark)] nudge-x" />
                </span>
              </div>
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-12 rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--line)] text-center animate-fade-in">
            <p className="text-base font-bold text-[var(--ink-soft)]">
              Tidak ada kasus yang cocok dengan filter pencarian saat ini.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
