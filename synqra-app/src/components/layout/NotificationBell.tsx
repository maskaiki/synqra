'use client';

import React, { useEffect, useState } from 'react';
import { Asset, Report, UserRole } from '@/types/synqra';
import { calculateSla, detectEarlyWarnings } from '@/lib/constants';
import { SlaBadge } from '@/components/ui/StatusBadge';
import { Bell, CheckCircle2, ChevronRight, Send } from 'lucide-react';

interface NotificationBellProps {
  reports: Report[];
  assets: Asset[];
  currentUserRole: UserRole;
  onSelectReport: (report: Report) => void;
  onSendReminder: (targets: Report[]) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  reports,
  assets,
  currentUserRole,
  onSelectReport,
  onSendReminder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const pending = reports.filter((r) => r.status !== 'VERIFIED');
  const overdueItems = pending
    .map((report) => ({
      report,
      sla: calculateSla(report.updated_at || report.created_at),
    }))
    .filter((item) => item.sla.level === 'red' || item.sla.level === 'yellow')
    .sort((a, b) => b.sla.hoursElapsed - a.sla.hoursElapsed);

  const redCount = overdueItems.filter((i) => i.sla.level === 'red').length;
  const earlyWarnings = detectEarlyWarnings(reports, assets);
  const totalAlerts = overdueItems.length + earlyWarnings.length;
  const hasCritical = redCount > 0 || earlyWarnings.length > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={
          totalAlerts > 0
            ? `Notifikasi (${overdueItems.length} kasus)`
            : 'Notifikasi'
        }
        title={
          totalAlerts > 0
            ? `${redCount} Overdue · ${earlyWarnings.length} Sinyal Pola`
            : 'Tidak ada peringatan aktif'
        }
        className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full surface-card hover:border-[var(--cyan)] flex items-center justify-center text-[var(--ink)]"
      >
        <Bell className={`w-4 h-4 ${hasCritical ? 'animate-bell' : ''}`} />
        {overdueItems.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DC2626] text-white font-heading text-[10px] font-extrabold flex items-center justify-center shadow-sm"
          >
            {overdueItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div
            role="dialog"
            aria-label="Pusat Notifikasi"
            className="absolute right-0 mt-2.5 w-[330px] sm:w-[380px] rounded-3xl bg-[var(--surface-elevated)] border border-[var(--line)] shadow-[0_24px_60px_-15px_rgba(9,19,38,0.38)] p-4 z-40 animate-pop-origin space-y-3.5"
          >
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-bold text-base text-[var(--ink)]">
                  Notifikasi
                </span>
                {overdueItems.length > 0 && (
                  <span className="text-xs font-heading font-bold text-[var(--red)]">
                    {overdueItems.length} SLA
                  </span>
                )}
              </div>

              {currentUserRole !== 'frontline_omi' && overdueItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onSendReminder(overdueItems.map((i) => i.report));
                    setIsOpen(false);
                  }}
                  className="pop-btn px-3 py-1.5 rounded-full font-heading text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ingatkan</span>
                </button>
              )}
            </div>

            {earlyWarnings.length > 0 && (
              <div className="px-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-heading font-bold text-[var(--amber)]">
                {earlyWarnings.slice(0, 4).map((w) => (
                  <span key={w.id || w.assetId}>
                    Pola {w.assetId}: {w.recentCount ?? w.relatedReportIds.length} aktif
                  </span>
                ))}
                {earlyWarnings.length > 4 && (
                  <span className="text-[var(--muted)]">
                    +{earlyWarnings.length - 4} pola lain
                  </span>
                )}
              </div>
            )}

            {overdueItems.length === 0 ? (
              <div className="p-5 rounded-2xl bg-[var(--soft)] text-center space-y-1.5">
                <CheckCircle2
                  className="w-6 h-6 mx-auto"
                  style={{ color: 'var(--green)' }}
                />
                <div className="font-heading font-bold text-sm text-[var(--ink)]">
                  Semua SLA Terkendali
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[var(--line-soft)] max-h-[300px] overflow-y-auto pr-0.5">
                {overdueItems.map(({ report, sla }) => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => {
                      onSelectReport(report);
                      setIsOpen(false);
                    }}
                    className="group w-full py-3 px-2 rounded-2xl hover:bg-[var(--hover-bg)] text-left flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-0.5">
                        <span className="font-heading font-extrabold text-xs text-[var(--cyan-dark)]">
                          {report.id}
                        </span>
                        <span className="font-heading font-bold text-xs text-[var(--ink-soft)]">
                          {report.asset_id}
                        </span>
                        <SlaBadge sla={sla} compact />
                      </div>
                      <div className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                        {report.title}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--cyan-dark)] shrink-0 nudge-x" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
