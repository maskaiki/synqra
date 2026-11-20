'use client';

import React, { useState } from 'react';
import { Asset, Report, UserRole } from '@/types/synqra';
import { ROLES, INITIAL_ASSETS, INITIAL_REPORTS } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { LaporCepatModal } from '@/components/reports/LaporCepatModal';
import { ReportDetailModal } from '@/components/reports/ReportDetailModal';
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
} from 'lucide-react';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('frontline_omi');
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [assets] = useState<Asset[]>(INITIAL_ASSETS);

  // Filters
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isLaporCepatOpen, setIsLaporCepatOpen] = useState(false);
  const [activeReportDetail, setActiveReportDetail] = useState<Report | null>(null);

  // Dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(true);

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
    const matchesQuery =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.identitas_alat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.gejala.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAsset && matchesStatus && matchesQuery;
  });

  // KPI counts
  const countPraduga = reports.filter((r) => r.status === 'PRADUGA').length;
  const countInvestigation = reports.filter((r) => r.status === 'INVESTIGATION' || r.status === 'TRIAGE').length;
  const countVerified = reports.filter((r) => r.status === 'VERIFIED').length;

  const handleReportCreated = (newReport: Report) => {
    setReports([newReport, ...reports]);
    setActiveReportDetail(newReport);
  };

  const handleStatusUpdate = (reportId: string, newStatus: Report['status']) => {
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: newStatus, updated_at: new Date().toISOString() } : r
      )
    );
    if (activeReportDetail && activeReportDetail.id === reportId) {
      setActiveReportDetail({ ...activeReportDetail, status: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/95 dark:bg-slate-950 text-slate-100 font-['Montserrat',sans-serif]">
      
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
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* 2. WELCOME HERO CARD */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-['Poppins',sans-serif] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Mode Demo Aktif: {activeRoleInfo.roleTitle}
            </div>
            <h1 className="font-['Poppins',sans-serif] text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Dari temuan lapangan, <span className="text-cyan-400">menjadi pengetahuan terstruktur.</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {currentRole === 'frontline_omi' &&
                'Gunakan fitur Lapor Cepat AI untuk merekam suara teknisi, scan nameplate aset, dan mengekstrak 7 entitas kegagalan dengan status awal terkunci sebagai PRADUGA.'}
              {currentRole === 'dept_reviewer' &&
                'Tinjau kelengkapan laporan yang masuk dari Frontline OMI, evaluasi gejala & akar penyebab, lalu teruskan ke status TRIAGE atau INVESTIGASI.'}
              {currentRole === 'hse_validator' &&
                'Periksa bukti nyata lapangan dan pengujian verifikasi untuk menetapkan keputusan akhir (VERIFIKASI ke Knowledge Base).'}
            </p>

            {/* Hero Quick Trigger */}
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

        {/* 3. KPI STAT METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-2xl font-black text-white">{reports.length}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Total Temuan</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-2xl font-black text-amber-400">{countPraduga}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Status PRADUGA</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-2xl font-black text-sky-400">{countInvestigation}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Triage & Investigasi</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-['Poppins',sans-serif] text-2xl font-black text-emerald-400">{countVerified}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Knowledge Terverifikasi</div>
            </div>
          </div>
        </div>

        {/* 4. THREE INDUSTRIAL ASSETS SHOWCASE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Poppins',sans-serif] text-lg font-bold text-white">
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
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-['Poppins',sans-serif] font-bold text-xs tracking-wider text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {asset.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {assetReportsCount} Temuan
                      </span>
                    </div>
                    <div className="py-2">
                      <TechnicalArt type={asset.type} darkMode={true} className="w-full h-28 mx-auto" />
                    </div>
                    <h3 className="font-['Poppins',sans-serif] font-bold text-sm text-white mt-2">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {asset.area}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                    <span>{isSelected ? 'Menampilkan Temuan' : 'Filter Kasus'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. REPORTS FEED WITH ARCHITECTURAL STATUS BADGES */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-['Poppins',sans-serif] text-lg font-bold text-white">
                Daftar Temuan Lapangan ({filteredReports.length})
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Setiap laporan memuat 7 entitas kegagalan dan status alur kasus.
              </p>
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              {[
                { key: 'ALL', label: 'Semua' },
                { key: 'PRADUGA', label: 'Praduga' },
                { key: 'TRIAGE', label: 'Triage' },
                { key: 'INVESTIGATION', label: 'Investigasi' },
                { key: 'VERIFIED', label: 'Terverifikasi' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg font-['Poppins',sans-serif] font-semibold transition-all ${
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
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-['Poppins',sans-serif] font-bold text-xs text-cyan-400">
                      {report.id}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">·</span>
                    <span className="text-xs text-slate-300 font-bold">{report.identitas_alat}</span>
                    <StatusBadge status={report.status} size="sm" />
                  </div>

                  <h3 className="font-['Poppins',sans-serif] font-bold text-base text-white truncate">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 font-medium">
                    <b className="text-slate-300">Gejala:</b> {report.gejala}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>Pelapor: <b className="text-slate-400">{report.reporter_name}</b> ({report.dept})</span>
                    <span>Tanggal: <b className="text-slate-400">{new Date(report.created_at).toLocaleDateString('id-ID')}</b></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveReportDetail(report)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-800/80 hover:bg-slate-800 text-xs font-['Poppins',sans-serif] font-bold text-cyan-400 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <span>Periksa 7 Entitas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-400 font-medium">Tidak ada temuan yang cocok dengan filter.</p>
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

      {/* MODAL 2: REPORT DETAIL & CASE COMMENTS */}
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
