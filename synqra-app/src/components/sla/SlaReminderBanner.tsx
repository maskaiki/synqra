'use client';

import React, { useState } from 'react';
import { Report, UserRole } from '@/types/synqra';
import { calculateSla } from '@/lib/constants';
import { SlaBadge } from '@/components/ui/StatusBadge';
import { BellRing, CheckCircle2, ChevronDown, ChevronRight, Send } from 'lucide-react';

interface SlaReminderBannerProps {
  reports: Report[];
  currentUserRole: UserRole;
  onSendReminder: (targetReports: Report[]) => void;
  onSelectReport: (report: Report) => void;
}

export const SlaReminderBanner: React.FC<SlaReminderBannerProps> = ({
  reports,
  currentUserRole,
  onSendReminder,
  onSelectReport,
}) => {
  const [expanded, setExpanded] = useState(false);

  const pending = reports.filter((r) => r.status !== 'VERIFIED');
  const overdueItems = pending
    .map((report) => ({ report, sla: calculateSla(report.updated_at || report.created_at) }))
    .filter((item) => item.sla.level === 'red' || item.sla.level === 'yellow')
    .sort((a, b) => b.sla.hoursElapsed - a.sla.hoursElapsed);

  const redCount = overdueItems.filter((i) => i.sla.level === 'red').length;
  const yellowCount = overdueItems.filter((i) => i.sla.level === 'yellow').length;

  if (overdueItems.length === 0) {
    return (
      <div
        style={{
          backgroundColor: 'var(--green-bg)',
          borderColor: 'var(--green-border)',
          borderLeftColor: 'var(--green)',
        }}
        className="p-4 rounded-2xl border border-l-[4px] flex items-center gap-3"
      >
        <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--green)' }} />
        <p className="text-sm font-bold" style={{ color: 'var(--green)' }}>
          Seluruh laporan aktif dalam batas SLA normal (&lt; 24 jam). Tidak ada kasus tertunda.
        </p>
      </div>
    );
  }

  const isRed = redCount > 0;
  const bannerStyle: React.CSSProperties = isRed
    ? {
        backgroundColor: 'var(--red-bg)',
        borderColor: 'var(--red-border)',
        borderLeftColor: 'var(--red)',
      }
    : {
        backgroundColor: 'var(--amber-bg)',
        borderColor: 'var(--amber-border)',
        borderLeftColor: 'var(--amber)',
      };

  const accentColor = isRed ? 'var(--red)' : 'var(--amber)';

  return (
    <section
      style={bannerStyle}
      className="rounded-2xl border border-l-[5px] p-4 sm:p-5 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            style={{ color: accentColor }}
            className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center shrink-0"
          >
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h3 style={{ color: accentColor }} className="font-heading font-bold text-base">
              Pengingat SLA: {redCount} Kasus Overdue (&gt;48 jam)
              {yellowCount > 0 ? ` · ${yellowCount} Segera Cek (24–48 jam)` : ''}
            </h3>
            <p className="text-sm font-medium text-[var(--ink-soft)] mt-0.5">
              {currentUserRole === 'frontline_omi'
                ? 'Beberapa laporan aktif menunggu tindak lanjut departemen atau kelengkapan bukti fisik.'
                : 'Terdapat kasus yang belum diperiksa atau diselesaikan melewati ambang SLA. Segera tindak lanjuti atau kirim pengingat.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {currentUserRole !== 'frontline_omi' && (
            <button
              type="button"
              onClick={() => onSendReminder(overdueItems.map((i) => i.report))}
              className="px-4 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pengingat ({overdueItems.length})</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-[var(--ink)] font-heading font-bold text-sm flex items-center gap-1.5 hover:border-[var(--cyan)] transition-colors"
          >
            <span>{expanded ? 'Sembunyikan' : 'Lihat Daftar'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-[var(--line)] space-y-2.5">
          {overdueItems.map(({ report, sla }) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-heading font-bold text-sm text-[var(--cyan-dark)]">
                    {report.id}
                  </span>
                  <span className="text-sm font-bold text-[var(--ink)]">{report.asset_id}</span>
                  <SlaBadge sla={sla} compact />
                </div>
                <div className="font-heading font-bold text-[15px] text-[var(--ink)] truncate">
                  {report.title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectReport(report)}
                className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center gap-1.5 shrink-0"
              >
                <span>Buka Kasus</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
