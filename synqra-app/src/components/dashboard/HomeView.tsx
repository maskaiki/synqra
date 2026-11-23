'use client';

import React from 'react';
import { Asset, MainPage, Report, RoleInfo } from '@/types/synqra';
import { calculateSla, detectEarlyWarnings } from '@/lib/constants';
import { BRAND_MEDIA } from '@/lib/mediaAssets';
import { SlaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { EquipmentBreakoutCard } from '@/components/ui/EquipmentBreakoutCard';
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
  onInspectAsset?: (assetId: string) => void;
  onSendSlaReminder: (targets: Report[]) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  roleInfo,
  assets,
  reports,
  isDarkMode,
  onNavigate,
  onOpenReport,
  onInspectAsset,
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
    <div className="space-y-7 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-[34px] font-bold text-[var(--ink)] tracking-tight leading-tight">
            Halo, {firstName}.
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1 m-0">
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
          className="group surface-card lift px-4 py-2.5 rounded-full hover:border-[var(--cyan)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[var(--cyan-dark)] spin-on-hover" />
          <span>Tanya SYNQRA AI</span>
        </button>
      </header>

      <SlaReminderBanner
        reports={reports}
        currentUserRole={roleInfo.key}
        onSendReminder={onSendSlaReminder}
        onSelectReport={onOpenReport}
      />

      {/* Atmospheric Hero Banner + Elevated KPI Strip */}
      <div className="space-y-4">
        <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-[#081734] text-white border border-cyan-400/20 shadow-[0_18px_40px_-20px_rgba(8,23,52,0.55)] flex flex-col md:flex-row md:items-center justify-between gap-5">
          <img
            src={BRAND_MEDIA.loginHeroOilRig.src}
            alt=""
            aria-hidden="true"
            width={BRAND_MEDIA.loginHeroOilRig.width}
            height={BRAND_MEDIA.loginHeroOilRig.height}
            loading="eager"
            decoding="async"
            className="pointer-events-none absolute inset-0 w-full h-full object-cover object-[60%_56%] scale-[1.03] opacity-55 select-none"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#051229]/95 via-[#0B2952]/76 to-[#074A67]/62"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#051229]/68 via-transparent to-[#051229]/30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-24 w-64 h-64 rounded-full bg-[#00C8EA]/15 blur-3xl"
          />

          <div className="relative z-10 max-w-2xl">
            <h2 className="font-heading text-2xl sm:text-[27px] font-bold text-white mb-2 leading-snug drop-shadow-[0_2px_10px_rgba(4,13,31,0.65)]">
              Temuan kecil di lapangan mencegah unplanned shutdown.
            </h2>
            <p className="text-[15px] text-white/90 leading-relaxed m-0 drop-shadow-[0_1px_6px_rgba(4,13,31,0.75)]">
              Laporan awal berstatus <b className="text-amber-300">PRADUGA</b> hingga bukti disahkan pakar.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('lapor')}
              className="group press-soft w-full md:w-auto px-6 py-3.5 rounded-full bg-[#00C8EA] hover:bg-[#38DDF8] text-[#041529] font-heading font-bold text-[15px] inline-flex items-center justify-center gap-2 shadow-[0_10px_24px_-8px_rgba(0,200,234,0.65)]"
            >
              <Plus className="w-5 h-5 stroke-[2.5] spin-on-hover" />
              <span>Laporkan Temuan</span>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          <div
            style={{ '--i': 0 } as React.CSSProperties}
            className="surface-card lift p-5 rounded-2xl flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading text-3xl font-bold text-[var(--ink)] leading-none">
                {reports.length}
              </div>
              <div className="text-sm font-semibold text-[var(--ink-soft)] mt-1.5">
                Total Kasus
              </div>
            </div>
          </div>

          <div
            style={{ '--i': 1 } as React.CSSProperties}
            className="surface-card lift p-5 rounded-2xl flex items-center gap-4"
          >
            <div
              style={{ backgroundColor: 'var(--amber-bg)', color: 'var(--amber)' }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
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

          <div
            style={{ '--i': 2 } as React.CSSProperties}
            className="surface-card lift p-5 rounded-2xl flex items-center gap-4"
          >
            <div
              style={{ backgroundColor: 'var(--green-bg)', color: 'var(--green)' }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
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
      </div>

      {/* Showcase 3 Aset Pilot (Seamless Breakout Cards) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
            Aset Pilot Terpantau
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('graph')}
            className="group hit-area font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Peta Pengetahuan</span>
            <ChevronRight className="w-4 h-4 nudge-x" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          {assets.map((asset, idx) => {
            const assetCases = reports.filter((r) => r.asset_id === asset.id);
            const verifiedTotal = assetCases.filter((r) => r.status === 'VERIFIED').length;
            const unitLabel = asset.area.split(' · ')[0];

            return (
              <EquipmentBreakoutCard
                key={asset.id}
                asset={asset}
                isDarkMode={isDarkMode}
                style={{ '--i': idx } as React.CSSProperties}
                badgeText={`${verifiedTotal} Verified`}
                metaText={`${assetCases.length} Kasus · ${unitLabel}`}
                onClick={() =>
                  onInspectAsset ? onInspectAsset(asset.id) : onNavigate('graph')
                }
              />
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 surface-card p-6 rounded-3xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
              Aktivitas Terbaru
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('cases')}
              className="group hit-area font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Lihat semua</span>
              <ChevronRight className="w-4 h-4 nudge-x" />
            </button>
          </div>

          <div className="divide-y divide-[var(--line-soft)] stagger">
            {recentReports.map((report, idx) => {
              const asset = assets.find((a) => a.id === report.asset_id) || assets[0];
              const sla = calculateSla(report.updated_at || report.created_at);

              return (
                <div
                  key={report.id}
                  role="button"
                  tabIndex={0}
                  style={{ '--i': idx + 2 } as React.CSSProperties}
                  onClick={() => onOpenReport(report)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenReport(report);
                    }
                  }}
                  className="group py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[var(--hover-bg)] active:scale-[0.995] -mx-3 px-3 rounded-2xl cursor-pointer transition-[background-color,transform] duration-150"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 p-1"
                    style={{ background: 'var(--stage-gradient)' }}
                  >
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
                      {report.id} · {report.asset_id} · {report.reporter_name}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <StatusBadge status={report.status} size="sm" />
                    {report.status !== 'VERIFIED' && <SlaBadge sla={sla} compact />}
                    <ChevronRight className="hidden sm:block w-4 h-4 text-[var(--cyan-dark)] opacity-0 group-hover:opacity-100 nudge-x" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="xl:col-span-4 space-y-5">
          <div className="surface-card p-6 rounded-3xl space-y-3">
            <h3 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
              Aksi Cepat
            </h3>

            <button
              type="button"
              onClick={() => onNavigate('lapor')}
              className="group lift press-soft w-full p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line-soft)] hover:border-[var(--cyan)] hover:bg-[var(--hover-bg)] flex items-center gap-3.5 text-left"
            >
              <span className="w-11 h-11 rounded-2xl pop-btn flex items-center justify-center shrink-0 shadow-sm">
                <Mic className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-[15px] text-[var(--ink)]">
                  Rekam Suara (VN)
                </div>
                <div className="text-sm text-[var(--ink-soft)]">
                  Susun 7 entitas otomatis
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--cyan-dark)] shrink-0 nudge-x" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('lapor')}
              className="group lift press-soft w-full p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line-soft)] hover:border-[var(--cyan)] hover:bg-[var(--hover-bg)] flex items-center gap-3.5 text-left"
            >
              <span className="w-11 h-11 rounded-2xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] flex items-center justify-center shrink-0">
                <Scan className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-[15px] text-[var(--ink)]">
                  Scan Nameplate Alat
                </div>
                <div className="text-sm text-[var(--ink-soft)]">
                  Deteksi tag &amp; anomali kamera
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--cyan-dark)] shrink-0 nudge-x" />
            </button>
          </div>

          <div className="surface-card p-6 rounded-3xl space-y-3.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[var(--amber)]" />
              <h3 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
                Briefing Awal Shift
              </h3>
            </div>
            <div className="space-y-2.5">
              {briefingPoints.map((pt, idx) => (
                <div
                  key={idx}
                  onClick={() => pt.report && onOpenReport(pt.report)}
                  className={`p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--line-soft)] ${
                    pt.report ? 'lift cursor-pointer hover:border-[var(--cyan)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg pop-btn font-heading font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-sm text-[var(--ink)]">
                        {pt.title}
                      </div>
                      <p className="text-sm text-[var(--ink-soft)] mt-0.5 leading-snug m-0">
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
