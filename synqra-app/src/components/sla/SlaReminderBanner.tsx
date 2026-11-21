'use client';

import React, { useState } from 'react';
import { Report, UserRole } from '@/types/synqra';
import { calculateSla } from '@/lib/constants';
import { BellRing, AlertCircle, Clock, CheckCircle2, ChevronRight, Send } from 'lucide-react';

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
  const [isSending, setIsSending] = useState(false);
  const [justSent, setJustSent] = useState(false);

  // SLA is prioritized for Reviewer & Validator
  if (currentUserRole === 'frontline_omi') {
    return null;
  }

  // Filter unverified reports and calculate SLA
  const pendingReports = reports.filter((r) => r.status !== 'VERIFIED');
  
  const redReports: { report: Report; sla: ReturnType<typeof calculateSla> }[] = [];
  const yellowReports: { report: Report; sla: ReturnType<typeof calculateSla> }[] = [];

  pendingReports.forEach((report) => {
    const sla = calculateSla(report.updated_at || report.created_at);
    if (sla.level === 'red') {
      redReports.push({ report, sla });
    } else if (sla.level === 'yellow') {
      yellowReports.push({ report, sla });
    }
  });

  const totalUrgent = redReports.length + yellowReports.length;

  if (totalUrgent === 0) {
    return (
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-['Poppins',sans-serif] text-sm font-bold text-emerald-400">
              SLA Responsif: Seluruh Kasus Tertangani Tepat Waktu
            </h4>
            <p className="text-xs text-slate-400">
              Tidak ada temuan yang tertunda lebih dari 24 jam di antrean Anda saat ini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    setIsSending(true);
    const urgentList = [...redReports, ...yellowReports].map((item) => item.report);
    setTimeout(() => {
      onSendReminder(urgentList);
      setIsSending(false);
      setJustSent(true);
      setTimeout(() => setJustSent(false), 4000);
    }, 600);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-amber-950/30 p-5 shadow-xl backdrop-blur-md">
      
      {/* Glow Accent */}
      <div className="absolute top-0 left-0 w-2 h-full bg-rose-500" />
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-rose-500/10 blur-2xl rounded-full pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Information */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center flex-shrink-0 animate-pulse">
            <BellRing className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-['Poppins',sans-serif] text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                PENGINGAT PRIORITAS SLA OTOMATIS
              </span>
              {redReports.length > 0 && (
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {redReports.length} Overdue (&gt; 48 Jam)
                </span>
              )}
              {yellowReports.length > 0 && (
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {yellowReports.length} Segera Cek (24–48 Jam)
                </span>
              )}
            </div>

            <h3 className="font-['Poppins',sans-serif] text-base font-bold text-white">
              {currentUserRole === 'dept_reviewer' ? 'Antrean Triage Departemen Membutuhkan Tindakan' : 'Gerbang Validasi Pakar Menunggu Keputusan'}
            </h3>

            <p className="text-xs text-slate-300 max-w-2xl font-medium">
              Sistem mendeteksi <b>{redReports.length} kasus lewat batas SLA</b> dan <b>{yellowReports.length} kasus mendekati batas SLA</b>. 
              Kirimkan pengingat notifikasi otomatis ke tim lapangan dan supervisor unit untuk mempercepat penanganan.
            </p>
          </div>
        </div>

        {/* Right Action: Kirim Pengingat Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || justSent}
            className={`px-5 py-3 rounded-xl font-['Poppins',sans-serif] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
              justSent
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-rose-600/30'
            }`}
          >
            {isSending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mengirim Notifikasi...</span>
              </>
            ) : justSent ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pengingat Terkirim!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Pengingat SLA</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Quick Action List of Overdue & Urgent Items */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {[...redReports, ...yellowReports].slice(0, 3).map(({ report, sla }) => (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between transition-all group"
          >
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-['Poppins',sans-serif] text-[11px] font-extrabold text-white">
                  {report.id}
                </span>
                <span className={`text-[10px] font-['Poppins',sans-serif] font-bold px-1.5 py-0.2 rounded border ${sla.badgeClass}`}>
                  {sla.level === 'red' ? 'Overdue > 48j' : 'Segera Cek'}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate font-medium">
                {report.title}
              </p>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Pengingat terkirim: {report.sla_reminder_count || 0}x
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
          </div>
        ))}
      </div>

    </div>
  );
};
