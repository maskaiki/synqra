'use client';

import React, { useState } from 'react';
import { Asset, Report, UserRole } from '@/types/synqra';
import { ROLES, INITIAL_ASSETS, INITIAL_REPORTS, calculateSla } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { LaporCepatModal } from '@/components/reports/LaporCepatModal';
import { ReportDetailModal } from '@/components/reports/ReportDetailModal';
import { SlaReminderBanner } from '@/components/sla/SlaReminderBanner';
import {
  Mic,
  Scan,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  ChevronRight,
  Clock,
  Inbox,
  Filter,
  Check,
} from 'lucide-react';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('dept_reviewer'); // Default to reviewer to show Triage & SLA immediately
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [assets] = useState<Asset[]>(INITIAL_ASSETS);

  // Filters
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [slaFilter, setSlaFilter] = useState<'ALL' | 'OVERDUE' | 'URGENT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isLaporCepatOpen, setIsLaporCepatOpen] = useState(false);
  const [activeReportDetail, setActiveReportDetail] = useState<Report | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const activeRoleInfo = ROLES[currentRole];

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesAsset = selectedAssetFilter === 'ALL' || r.asset_id === selectedAssetFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;
    
    // SLA filter
    const sla = calculateSla(r.updated_at || r.created_at);
    let matchesSla = true;
    if (slaFilter === 'OVERDUE') matchesSla = sla.level === 'red';
    if (slaFilter === 'URGENT') matchesSla = sla.level === 'red' || sla.level === 'yellow';

    const matchesQuery =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.identitas_alat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.gejala.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAsset && matchesStatus && matchesSla && matchesQuery;
  });

  // KPI counts
  const countPraduga = reports.filter((r) => r.status === 'PRADUGA').length;
  const countTriage = reports.filter((r) => r.status === 'TRIAGE').length;
  const countInvestigation = reports.filter((r) => r.status === 'INVESTIGATION').length;
  const countVerified = reports.filter((r) => r.status === 'VERIFIED').length;

  const countOverdue = reports.filter((r) => {
    if (r.status === 'VERIFIED') return false;
    return calculateSla(r.updated_at || r.created_at).level === 'red';
  }).length;

  const handleReportCreated = (newReport: Report) => {
    setReports([newReport, ...reports]);
    setActiveReportDetail(newReport);
    showToast(`✅ Laporan ${newReport.id} berhasil dibuat dengan status awal terkunci PRADUGA.`);
  };

  const handleStatusUpdate = (
    reportId: string,
    newStatus: Report['status'],
    revisionComment?: string,
    requestedEvidence?: string
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: newStatus,
            updated_at: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    if (activeReportDetail && activeReportDetail.id === reportId) {
      setActiveReportDetail({
        ...activeReportDetail,
        status: newStatus,
        updated_at: new Date().toISOString(),
      });
    }

    if (newStatus === 'VERIFIED') {
      showToast(`🛡️ Kasus ${reportId} disahkan TERVERIFIKASI dan diterbitkan ke Knowledge Base!`);
    } else if (newStatus === 'PRADUGA' && revisionComment) {
      showToast(`↩️ Kasus ${reportId} dikembalikan ke PRADUGA untuk revisi bukti: "${requestedEvidence || revisionComment}"`);
    } else {
      showToast(`🔄 Status kasus ${reportId} diperbarui menjadi ${newStatus}.`);
    }
  };

  const handleSendSlaReminder = (targetReports: Report[]) => {
    const targetIds = new Set(targetReports.map((t) => t.id));
    const nowIso = new Date().toISOString();

    setReports((prev) =>
      prev.map((r) => {
        if (targetIds.has(r.id)) {
          return {
            ...r,
            sla_reminder_count: (r.sla_reminder_count || 0) + 1,
            sla_last_reminder_at: nowIso,
          };
        }
        return r;
      })
    );

    showToast(
      `🔔 Pengingat SLA otomatis berhasil dikirimkan ke Teknisi Pelapor & Supervisor untuk ${targetReports.length} kasus prioritas!`
    );
  };

  return (
    <div className="min-h-screen bg-slate-900/95 dark:bg-slate-950 text-slate-100 font-['Montserrat',sans-serif]">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-cyan-950 border border-cyan-500/50 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold leading-relaxed font-['Montserrat',sans-serif]">
            {toastMessage}
          </p>
        </div>
      )}

      {/* 1. TOPBAR */}
      <header className="sticky top-0 z-30 h-20 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-700 flex items-center justify-center font-['Poppins',sans-serif] font-black text-xl text-white shadow-lg shadow-cyan-500/25">
              S
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] font-extrabold text-lg tracking-wider text-white">
                SYNQRA
              </div>
              <div className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
                Intelligence Connected by Evidence
              </div>
            </div>
          </div>
          <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-['Poppins',sans-serif] font-bold tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            OIL & GAS v2.0
          </span>
        </div>

        {/* Topbar Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800/80 hover:border-cyan-500 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            title="Ubah Mode Tampilan"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          {/* Role Switcher Demo */}
          <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-7">
        
        {/* 2. SISTEM PENGINGAT SLA OTOMATIS (BANNER PRIORITAS TERATAS) */}
        <SlaReminderBanner
          reports={reports}
          currentUserRole={currentRole}
          onSendReminder={handleSendSlaReminder}
          onSelectReport={(report) => setActiveReportDetail(report)}
        />

        {/* 3. WELCOME HERO CARD */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-['Poppins',sans-serif] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Peran Aktif: {activeRoleInfo.roleTitle}
            </div>
            <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {currentRole === 'dept_reviewer' && 'Halaman Triage Departemen & Analisis Risiko'}
              {currentRole === 'hse_validator' && 'Gerbang Validasi Pakar (Hard Gate Protection)'}
              {currentRole === 'frontline_omi' && 'Dari Temuan Lapangan ke Pengetahuan Terstruktur'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {currentRole === 'frontline_omi' &&
                'Gunakan fitur Lapor Cepat AI untuk merekam suara teknisi, scan nameplate aset, dan mengekstrak 7 entitas kegagalan dengan status awal terkunci sebagai PRADUGA.'}
              {currentRole === 'dept_reviewer' &&
                'Tinjau kelengkapan laporan dari Frontline OMI, evaluasi SLA waktu respons, tetapkan Risk Report & CAPA, lalu teruskan ke status TRIAGE atau INVESTIGASI.'}
              {currentRole === 'hse_validator' &&
                'Sahkan temuan ke Knowledge Base dengan Aturan Keras (Hard Gate): tombol pengesahan otomatis terkunci jika bukti foto kosong atau pelapor adalah pengguna yang sama (no self-approval).'}
            </p>

            {/* Quick Actions */}
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsLaporCepatOpen(true)}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-['Poppins',sans-serif] font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02]"
              >
                <Mic className="w-4 h-4" />
                <span>Lapor Cepat AI (Suara & Scan)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLaporCepatOpen(true)}
                className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-['Poppins',sans-serif] font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <Scan className="w-4 h-4 text-cyan-400" />
                <span>Scan Nameplate</span>
              </button>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
        </div>

        {/* 4. KPI STAT METRICS (INCLUDING OVERDUE SLA METRIC) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-xl font-black text-white">{reports.length}</div>
              <div className="text-[11px] text-slate-400 font-semibold">Total Temuan</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-xl font-black text-amber-400">{countPraduga}</div>
              <div className="text-[11px] text-slate-400 font-semibold">PRADUGA</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-xl font-black text-sky-400">{countTriage + countInvestigation}</div>
              <div className="text-[11px] text-slate-400 font-semibold">Triage & Investigasi</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-xl font-black text-emerald-400">{countVerified}</div>
              <div className="text-[11px] text-slate-400 font-semibold">Terverifikasi</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 flex items-center gap-3 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-xl font-black text-rose-400">{countOverdue}</div>
              <div className="text-[11px] text-rose-300 font-semibold">SLA Overdue (&gt;48j)</div>
            </div>
          </div>
        </div>

        {/* 5. THREE INDUSTRIAL ASSETS SHOWCASE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Poppins',sans-serif] text-base font-bold text-white">
                Aset Terdaftar ({assets.length})
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Peralatan industri utama dengan visualisasi skematik 2D vektor.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((asset) => {
              const isSelected = selectedAssetFilter === asset.id;
              const assetReportsCount = reports.filter((r) => r.asset_id === asset.id).length;

              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetFilter(isSelected ? 'ALL' : asset.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-['Poppins',sans-serif] font-bold text-xs tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {asset.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {assetReportsCount} Kasus
                      </span>
                    </div>
                    <div className="py-2">
                      <TechnicalArt type={asset.type} darkMode={true} className="w-full h-24 mx-auto" />
                    </div>
                    <h3 className="font-['Poppins',sans-serif] font-bold text-sm text-white mt-1">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {asset.area}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                    <span>{isSelected ? 'Menampilkan Kasus Terfilter' : 'Filter Kasus'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. REPORTS FEED WITH SLA BADGES & ARCHITECTURAL TAGS */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-['Poppins',sans-serif] text-base font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-cyan-400" />
                Daftar Temuan Lapangan & Evaluasi Kasus ({filteredReports.length})
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Dilengkapi indikator durasi SLA otomatis (Hijau &lt;24j, Kuning 24-48j, Merah &gt;48j).
              </p>
            </div>

            {/* Filter Group */}
            <div className="flex flex-wrap items-center gap-2">
              {/* SLA Filter Preset */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="px-2 text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                  <Filter className="w-3 h-3" /> SLA:
                </span>
                {[
                  { key: 'ALL', label: 'Semua SLA' },
                  { key: 'OVERDUE', label: '🔴 Overdue' },
                  { key: 'URGENT', label: '⚠️ Urgent' },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSlaFilter(s.key as typeof slaFilter)}
                    className={`px-2.5 py-1 rounded-lg font-['Poppins',sans-serif] text-xs font-semibold transition-all ${
                      slaFilter === s.key ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                {[
                  { key: 'ALL', label: 'Semua Status' },
                  { key: 'PRADUGA', label: 'Praduga' },
                  { key: 'TRIAGE', label: 'Triage' },
                  { key: 'INVESTIGATION', label: 'Investigasi' },
                  { key: 'VERIFIED', label: 'Terverifikasi' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedStatusFilter(tab.key)}
                    className={`px-3 py-1 rounded-lg font-['Poppins',sans-serif] text-xs font-semibold transition-all ${
                      selectedStatusFilter === tab.key
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan kode tag, nama alat, gejala, atau nomor laporan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {filteredReports.map((report) => {
              const sla = calculateSla(report.updated_at || report.created_at);
              const isOverdue = sla.level === 'red' && report.status !== 'VERIFIED';

              return (
                <div
                  key={report.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isOverdue
                      ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-500/70'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-['Poppins',sans-serif] font-bold text-xs text-cyan-400">
                        {report.id}
                      </span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-300 font-bold">{report.identitas_alat}</span>
                      
                      {/* Status Architectural Badge */}
                      <StatusBadge status={report.status} size="sm" />

                      {/* SLA Automatic Indicator */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-['Poppins',sans-serif] font-bold border ${sla.badgeClass}`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{sla.label}</span>
                      </span>

                      {/* Hard Gate Indicator Flag for Empty Evidence */}
                      {(!report.image_url || report.evidence_note?.includes('belum')) && (
                        <span className="inline-flex items-center text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded">
                          Bukti Belum Lengkap
                        </span>
                      )}
                    </div>

                    <h3 className="font-['Poppins',sans-serif] font-bold text-base text-white truncate">
                      {report.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 font-medium">
                      <b className="text-slate-300">Gejala:</b> {report.gejala}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                      <span>Pelapor: <b className="text-slate-300">{report.reporter_name}</b> ({report.dept})</span>
                      <span>Target CAPA: <b className="text-slate-300">{report.capa_target_date || '-'}</b></span>
                      {report.sla_reminder_count ? (
                        <span className="text-rose-400 font-semibold">Pengingat dikirim: {report.sla_reminder_count}x</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveReportDetail(report)}
                      className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-800/80 hover:bg-slate-800 text-xs font-['Poppins',sans-serif] font-bold text-cyan-400 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <span>Periksa Detail & Investigasi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredReports.length === 0 && (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-400 font-medium">Tidak ada temuan yang cocok dengan kriteria filter.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* MODAL 1: LAPOR CEPAT (GEMINI AI + MEDIARECORDER + SCAN NAMEPLATE) */}
      <LaporCepatModal
        isOpen={isLaporCepatOpen}
        onClose={() => setIsLaporCepatOpen(false)}
        onReportCreated={handleReportCreated}
        currentUserRole={currentRole}
        currentUserName={activeRoleInfo.name}
        currentUserDept={activeRoleInfo.department}
      />

      {/* MODAL 2: REPORT DETAIL, RISK REPORT, CAPA, CASE COMMENTS & HARD GATE VALIDATION */}
      <ReportDetailModal
        report={activeReportDetail}
        onClose={() => setActiveReportDetail(null)}
        onStatusUpdate={handleStatusUpdate}
        currentUserRole={currentRole}
        currentUserName={activeRoleInfo.name}
      />

    </div>
  );
}
