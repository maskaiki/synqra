'use client';

import React from 'react';
import { Asset, MainPage, Report, RoleInfo } from '@/types/synqra';
import { calculateSla, COMPANY_UMBRELLA, detectEarlyWarnings } from '@/lib/constants';
import { EQUIPMENT_TYPE_SHOWCASE } from '@/lib/cduBalonganKnowledge';
import { BRAND_MEDIA } from '@/lib/mediaAssets';
import { SlaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { EquipmentBreakoutCard } from '@/components/ui/EquipmentBreakoutCard';
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
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
  const briefingPoints: { tag: string; detail: string; report?: Report }[] = [
    overdueTop
      ? {
          tag: `SLA · ${overdueTop.asset_id}`,
          detail: overdueTop.title,
          report: overdueTop,
        }
      : {
          tag: 'SLA',
          detail: 'Semua kasus dalam batas waktu.',
        },
    earlyWarnings[0]
      ? {
          tag: `Pola · ${earlyWarnings[0].assetId}`,
          detail: `${earlyWarnings[0].recentCount ?? earlyWarnings[0].relatedReportIds.length} laporan aktif dalam 14 hari.`,
        }
      : {
          tag: 'Pola Aset',
          detail: 'Tidak ada lonjakan berulang.',
        },
    criticalTop
      ? {
          tag: `Risiko · ${criticalTop.asset_id}`,
          detail: criticalTop.title,
          report: criticalTop,
        }
      : {
          tag: 'Operasi',
          detail: 'Semua unit dalam batas normal.',
        },
  ];

  const firstName = roleInfo.name.split(' ')[0];

  return (
    <div className="space-y-7">
      {/* Hero Banner + Standalone Glass Stats & Quick-Tools Bar (No Overlap) */}
      <div className="space-y-4">
        <section className="relative overflow-hidden rounded-[32px] py-8 sm:py-10 px-6 sm:px-10 bg-[#07152F] text-white ring-1 ring-white/10 shadow-[0_24px_54px_-24px_rgba(6,20,46,0.62)]">
          <img
            src={BRAND_MEDIA.loginHeroOilRig.src}
            alt=""
            aria-hidden="true"
            width={BRAND_MEDIA.loginHeroOilRig.width}
            height={BRAND_MEDIA.loginHeroOilRig.height}
            loading="eager"
            decoding="async"
            className="pointer-events-none absolute inset-0 w-full h-full object-cover object-[72%_44%] scale-[1.03] opacity-65 select-none"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#051026]/95 via-[#0A2552]/80 to-[#095575]/60"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[#00C8EA]/24 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 bottom-0 w-72 h-72 rounded-full bg-[#2563EB]/20 blur-3xl"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-cyan-200/95">
                <span>Halo, {firstName}</span>
                <span className="opacity-50">·</span>
                <span className="text-white/90">{roleInfo.shortRole}</span>
                <span className="opacity-50">·</span>
                <span className="text-white/85">{COMPANY_UMBRELLA.fullTitle}</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-[38px] font-bold text-white leading-[1.14] tracking-tight m-0 drop-shadow-[0_3px_14px_rgba(4,12,28,0.6)]">
                Dari temuan lapangan, menjadi pengetahuan.
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('tanya')}
                className="group press-soft px-5 py-3 rounded-full bg-white/12 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-heading font-bold text-sm inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#3CE2FF] spin-on-hover" />
                <span>Tanya AI</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('lapor')}
                className="group press-soft px-6 py-3 rounded-full bg-[#00C8EA] hover:bg-[#3CE2FF] text-[#041326] font-heading font-bold text-sm inline-flex items-center gap-2 shadow-[0_12px_28px_-8px_rgba(0,200,234,0.7)]"
              >
                <Plus className="w-4 h-4 stroke-[2.75] spin-on-hover" />
                <span>Lapor Cepat</span>
              </button>
            </div>
          </div>
        </section>

        {/* Standalone Frosted Glass Stats & Quick Tools Bar */}
        <section className="surface-card rounded-[28px] p-4 sm:px-6 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 flex-1">
            <button
              type="button"
              onClick={() => onNavigate('cases')}
              className="group flex items-center gap-3 sm:gap-3.5 px-2.5 sm:px-3.5 py-2 rounded-2xl hover:bg-[var(--hover-bg)] text-left transition-colors"
            >
              <span className="hidden sm:flex w-11 h-11 rounded-2xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] items-center justify-center shrink-0">
                <FolderKanban className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="font-heading text-2xl sm:text-[28px] font-extrabold text-[var(--ink)] leading-none group-hover:text-[var(--cyan-dark)] transition-colors">
                  {reports.length}
                </div>
                <div className="text-sm font-semibold text-[var(--ink-soft)] mt-1 truncate">
                  Total Kasus
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('cases')}
              className="group flex items-center gap-3 sm:gap-3.5 px-2.5 sm:px-3.5 py-2 rounded-2xl hover:bg-[var(--hover-bg)] text-left transition-colors"
            >
              <span
                style={{ backgroundColor: 'var(--amber-bg)', color: 'var(--amber)' }}
                className="hidden sm:flex w-11 h-11 rounded-2xl items-center justify-center shrink-0"
              >
                <Activity className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="font-heading text-2xl sm:text-[28px] font-extrabold text-[var(--ink)] leading-none group-hover:text-[var(--amber)] transition-colors">
                  {activeCount}
                </div>
                <div className="text-sm font-semibold text-[var(--ink-soft)] mt-1 truncate">
                  Kasus Aktif
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('graph')}
              className="group flex items-center gap-3 sm:gap-3.5 px-2.5 sm:px-3.5 py-2 rounded-2xl hover:bg-[var(--hover-bg)] text-left transition-colors"
            >
              <span
                style={{ backgroundColor: 'var(--green-bg)', color: 'var(--green)' }}
                className="hidden sm:flex w-11 h-11 rounded-2xl items-center justify-center shrink-0"
              >
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="font-heading text-2xl sm:text-[28px] font-extrabold text-[var(--ink)] leading-none group-hover:text-[var(--green)] transition-colors">
                  {verifiedCount}
                </div>
                <div className="text-sm font-semibold text-[var(--ink-soft)] mt-1 truncate">
                  Terverifikasi
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[var(--line-soft)] lg:pl-5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('lapor')}
              className="group press-soft flex-1 lg:flex-none pop-btn px-5 py-2.5 rounded-full font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <Mic className="w-4 h-4" />
              <span>Rekam</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('lapor')}
              className="group press-soft flex-1 lg:flex-none px-5 py-2.5 rounded-full bg-[var(--soft)] hover:bg-[var(--hover-bg)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center justify-center gap-2"
            >
              <Scan className="w-4 h-4 text-[var(--cyan-dark)]" />
              <span>Scan Alat</span>
            </button>
          </div>
        </section>
      </div>

      {/* 9 Tipe Peralatan Unit 11 CDU: Menampilkan ke-9 Aset Visual 3D Unit 11 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
              {EQUIPMENT_TYPE_SHOWCASE.length} Tipe Peralatan Unit 11 CDU
            </h2>
            <p className="text-sm text-[var(--ink-soft)] m-0">
              {assets.length} Kode Tag aktif ({COMPANY_UMBRELLA.totalPhysicalUnits} unit fisik) di {COMPANY_UMBRELLA.refineryName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('graph')}
            className="group hit-area font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Peta {assets.length} Aset</span>
            <ChevronRight className="w-4 h-4 nudge-x" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {EQUIPMENT_TYPE_SHOWCASE.map((item, idx) => {
            const typeAssets = assets.filter((a) => a.type === item.renderType);
            const typeAssetIds = new Set(typeAssets.map((a) => a.id));
            const typeCases = reports.filter((r) => typeAssetIds.has(r.asset_id));
            const verifiedTotal = typeCases.filter((r) => r.status === 'VERIFIED').length;
            const unitTotal = typeAssets.reduce((sum, a) => sum + (a.unitCount || 1), 0);
            const representative =
              typeAssets.find((a) => reports.some((r) => r.asset_id === a.id && r.status === 'VERIFIED')) ||
              typeAssets[0];

            const syntheticAsset: Asset = {
              id: item.tagHint,
              name: item.label,
              subtitle: `${typeAssets.length} Kode Tag`,
              type: item.renderType,
              categoryCode: item.categoryCode,
              unitCount: unitTotal || 1,
              area: `${typeAssets.length} Kode Tag · ${unitTotal} Unit`,
              dept: representative?.dept || 'Operasi Unit 11 CDU',
              description: item.summary,
            };

            return (
              <EquipmentBreakoutCard
                key={item.renderType}
                asset={syntheticAsset}
                isDarkMode={isDarkMode}
                style={{ '--i': idx } as React.CSSProperties}
                badgeText={`${verifiedTotal} Verified`}
                metaText={`${typeAssets.length} Tag · ${typeCases.length} Kasus · ${unitTotal} Unit Fisik`}
                onClick={() =>
                  onInspectAsset && representative
                    ? onInspectAsset(representative.id)
                    : onNavigate('graph')
                }
              />
            );
          })}
        </div>
      </section>

      {/* Bottom Clean 2-Column Feed */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 surface-card p-6 rounded-3xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
              Aktivitas Terbaru
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('cases')}
              className="group hit-area font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Semua</span>
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
                  style={{ '--i': idx } as React.CSSProperties}
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

        <aside className="xl:col-span-4 surface-card p-6 rounded-3xl space-y-4">
          <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
            Prioritas Shift
          </h2>
          <div className="divide-y divide-[var(--line-soft)]">
            {briefingPoints.map((pt, idx) => (
              <div
                key={idx}
                onClick={() => pt.report && onOpenReport(pt.report)}
                className={`py-3.5 first:pt-1 last:pb-1 flex items-start gap-3 ${
                  pt.report
                    ? 'cursor-pointer hover:bg-[var(--hover-bg)] -mx-2.5 px-2.5 rounded-2xl transition-colors'
                    : ''
                }`}
              >
                <span className="w-6 h-6 rounded-full pop-btn font-heading font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-heading font-bold text-sm text-[var(--ink)]">
                    {pt.tag}
                  </div>
                  <p className="text-sm text-[var(--ink-soft)] mt-0.5 leading-snug m-0 line-clamp-2">
                    {pt.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};
