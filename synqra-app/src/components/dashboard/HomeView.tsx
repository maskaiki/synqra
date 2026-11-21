'use client';

import React from 'react';
import { Asset, MainPage, Report, RoleInfo } from '@/types/synqra';
import { calculateSla, detectEarlyWarnings } from '@/lib/constants';
import { SlaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { SlaReminderBanner } from '@/components/sla/SlaReminderBanner';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Mic,
  Plus,
  Scan,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  roleInfo: RoleInfo;
  assets: Asset[];
  reports: Report[];
  isDarkMode: boolean;
  onNavigate: (page: MainPage) => void;
  onOpenReport: (report: Report) => void;
  onSendSlaReminder: (targets: Report[]) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  roleInfo,
  assets,
  reports,
  isDarkMode,
  onNavigate,
  onOpenReport,
  onSendSlaReminder,
}) => {
  const activeCount = reports.filter((r) => r.status !== 'VERIFIED').length;
  const verifiedCount = reports.filter((r) => r.status === 'VERIFIED').length;
  const earlyWarnings = detectEarlyWarnings(reports, assets);
  const recentReports = reports.slice(0, 4);

  const overdueTop = reports.find(
    (r) => r.status !== 'VERIFIED' && calculateSla(r.updated_at || r.created_at).isOverdue
  );
  const criticalTop = reports.find(
    (r) => r.status !== 'VERIFIED' && (r.risk_level === 'CRITICAL' || r.risk_level === 'HIGH')
  );
  const briefingPoints: { title: string; detail: string; report?: Report }[] = [
    overdueTop
      ? {
          title: `SLA Overdue · ${overdueTop.asset_id}`,
          detail: `${overdueTop.title} menunggu tindak lanjut > 48 jam.`,
          report: overdueTop,
        }
      : {
          title: 'Status SLA Terkendali',
          detail: 'Belum ada laporan melewati batas 48 jam pada shift ini.',
        },
    earlyWarnings[0]
      ? {
          title: `Pola Berulang · ${earlyWarnings[0].assetId}`,
          detail: `${earlyWarnings[0].recentCount ?? earlyWarnings[0].relatedReportIds.length} laporan aktif dalam 14 hari pada aset yang sama.`,
        }
      : {
          title: 'Tidak Ada Anomali Berulang',
          detail: 'Belum terdeteksi lonjakan laporan berulang lintas shift.',
        },
    criticalTop
      ? {
          title: `Prioritas Risiko · ${criticalTop.asset_id}`,
          detail: `${criticalTop.title} (${criticalTop.risk_level}). Cek kondisi operasi saat patroli.`,
          report: criticalTop,
        }
      : {
          title: 'Kondisi Operasi Stabil',
          detail: 'Seluruh unit terpantau dalam batas risiko normal.',
        },
  ];

  const firstName = roleInfo.name.split(' ')[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)]">
            Halo, {firstName}.
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1">
            {roleInfo.key === 'frontline_omi' &&
              'Catat temuan lapangan cepat atau cari solusi terverifikasi.'}
            {roleInfo.key === 'dept_reviewer' &&
              'Tinjau bukti laporan masuk, SLA, dan investigasi aset.'}
            {roleInfo.key === 'hse_validator' &&
              'Validasi risiko dan bukti sebelum mengesahkan pengetahuan baru.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('tanya')}
          className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[var(--cyan-dark)]" />
          <span>Tanya SYNQRA AI</span>
        </button>
      </header>

      <SlaReminderBanner
        reports={reports}
        currentUserRole={roleInfo.key}
        onSendReminder={onSendSlaReminder}
        onSelectReport={onOpenReport}
      />

      <section className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#091B3D] via-[#123D68] to-[#0C5F7D] text-white border border-cyan-400/25 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="pointer-events-none absolute -right-16 -top-28 w-72 h-72 rounded-full border border-cyan-300/25" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-heading text-2xl sm:text-[26px] font-bold text-white mb-2">
            Temuan kecil di lapangan mencegah unplanned shutdown.
          </h2>
          <p className="text-[15px] text-white/90 leading-relaxed m-0">
            Laporan awal berstatus <b className="text-amber-300">PRADUGA</b> hingga bukti disahkan pakar.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('lapor')}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#00B8D9] hover:bg-[#22D3EE] text-[#061A38] font-heading font-bold text-[15px] inline-flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Laporkan Temuan</span>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[var(--ink)] leading-none">
              {reports.length}
            </div>
            <div className="text-sm font-semibold text-[var(--ink-soft)] mt-1.5">
              Total Laporan Kasus
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex items-center gap-4 shadow-sm">
          <div
            style={{ backgroundColor: 'var(--amber-bg)', color: 'var(--amber)' }}
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          >
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[var(--ink)] leading-none">
              {activeCount}
            </div>
            <div className="text-sm font-semibold text-[var(--ink-soft)] mt-1.5">
              Aktif (Praduga &amp; Triage)
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex items-center gap-4 shadow-sm">
          <div
            style={{ backgroundColor: 'var(--green-bg)', color: 'var(--green)' }}
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="font-heading text-3xl font-bold text-[var(--ink)] leading-none">
              {verifiedCount}
            </div>
            <div className="text-sm font-semibold text-[var(--ink-soft)] mt-1.5">
              Terverifikasi Pakar
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="font-heading text-lg font-bold text-[var(--ink)]">
                Aktivitas Laporan Terbaru
              </h3>
              <p className="text-sm text-[var(--ink-soft)] mt-0.5">
                Pantau progres triage, SLA, dan validasi kasus terbaru.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('cases')}
              className="font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Lihat semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-[var(--line-soft)]">
            {recentReports.map((report) => {
              const asset = assets.find((a) => a.id === report.asset_id) || assets[0];
              const sla = calculateSla(report.updated_at || report.created_at);

              return (
                <div
                  key={report.id}
                  onClick={() => onOpenReport(report)}
                  className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[var(--hover-bg)] -mx-3 px-3 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-center shrink-0 p-1">
                    <TechnicalArt
                      type={asset?.type || 'pump'}
                      darkMode={isDarkMode}
                      className="w-12 h-12"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-heading font-bold text-[15.5px] text-[var(--ink)] truncate">
                      {report.title}
                    </div>
                    <div className="text-sm font-medium text-[var(--ink-soft)] mt-0.5">
                      {report.id} · {report.asset_id} · Pelapor: {report.reporter_name}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <StatusBadge status={report.status} size="sm" />
                    {report.status !== 'VERIFIED' && <SlaBadge sla={sla} compact />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="xl:col-span-4 space-y-5">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-3">
            <div>
              <h3 className="font-heading text-lg font-bold text-[var(--ink)]">
                Mulai Laporan Cepat
              </h3>
              <p className="text-sm text-[var(--ink-soft)] mt-0.5">
                Hemat waktu entry dari 15 menit menjadi ~2 menit.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('lapor')}
              className="w-full p-4 rounded-2xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] hover:bg-[var(--hover-bg)] flex items-center gap-3.5 text-left transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-[15px] text-[var(--ink)]">
                  Rekam Suara (VN)
                </div>
                <div className="text-sm text-[var(--ink-soft)]">
                  AI menyusun 7 entitas otomatis
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--cyan-dark)] shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('lapor')}
              className="w-full p-4 rounded-2xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] hover:bg-[var(--hover-bg)] flex items-center gap-3.5 text-left transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] flex items-center justify-center shrink-0">
                <Scan className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-[15px] text-[var(--ink)]">
                  Scan Nameplate Alat
                </div>
                <div className="text-sm text-[var(--ink-soft)]">
                  Deteksi kode tag via kamera
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--cyan-dark)] shrink-0" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-[var(--amber)]" />
              <h3 className="font-heading text-lg font-bold text-[var(--ink)]">
                Briefing Awal Shift
              </h3>
            </div>
            <p className="text-sm text-[var(--ink-soft)] mb-4">
              3 hal prioritas yang perlu diperhatikan pada shift hari ini:
            </p>
            <div className="space-y-3">
              {briefingPoints.map((pt, idx) => (
                <div
                  key={idx}
                  onClick={() => pt.report && onOpenReport(pt.report)}
                  className={`p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] ${
                    pt.report ? 'cursor-pointer hover:border-[var(--cyan)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] font-heading font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-sm text-[var(--ink)]">
                        {pt.title}
                      </div>
                      <p className="text-sm text-[var(--ink-soft)] mt-0.5 leading-snug">
                        {pt.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
