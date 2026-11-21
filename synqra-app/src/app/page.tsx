'use client';

import React, { useEffect, useState } from 'react';
import {
  Asset,
  CaseComment,
  CitationItem,
  Evidence,
  MainPage,
  Report,
  UserRole,
} from '@/types/synqra';
import {
  calculateSla,
  INITIAL_ASSETS,
  INITIAL_COMMENTS,
  INITIAL_EVIDENCES,
  INITIAL_REPORTS,
  ROLES,
} from '@/lib/constants';
import {
  loadWorkspaceData,
  persistComment,
  persistNewReport,
  persistReportUpdate,
  resetLocalWorkspace,
  saveLocalWorkspace,
} from '@/lib/dataService';
import { LoginView } from '@/components/auth/LoginView';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { HomeView } from '@/components/dashboard/HomeView';
import { LaporCepatView } from '@/components/reports/LaporCepatView';
import { CasesListView } from '@/components/reports/CasesListView';
import { CaseDetailView } from '@/components/reports/CaseDetailView';
import { KnowledgeGraphView } from '@/components/knowledge/KnowledgeGraphView';
import { TanyaSynqraView } from '@/components/knowledge/TanyaSynqraView';
import { EvidenceLightboxModal } from '@/components/knowledge/EvidenceLightboxModal';
import { Check } from 'lucide-react';

export default function SynqraApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('frontline_omi');
  const [activePage, setActivePage] = useState<MainPage>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [comments, setComments] = useState<CaseComment[]>(INITIAL_COMMENTS);
  const [evidences, setEvidences] = useState<Evidence[]>(INITIAL_EVIDENCES);
  const [dataSource, setDataSource] = useState<'supabase' | 'local'>('local');
  const [hydrated, setHydrated] = useState(false);

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [activeCitation, setActiveCitation] = useState<CitationItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Load saved theme & workspace data on mount
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('synqra-theme');
    const shouldDark = savedTheme === 'dark';
    setIsDarkMode(shouldDark);
    document.documentElement.classList.toggle('dark', shouldDark);

    loadWorkspaceData().then((snap) => {
      setAssets(snap.assets);
      setReports(snap.reports);
      setComments(snap.comments);
      setEvidences(snap.evidences);
      setDataSource(snap.source);
      setHydrated(true);
    });
  }, []);

  // Auto-persist local state changes
  useEffect(() => {
    if (hydrated && dataSource === 'local') {
      saveLocalWorkspace(reports, comments, evidences);
    }
  }, [reports, comments, evidences, hydrated, dataSource]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('synqra-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    setActivePage('home');
    showToast(`Masuk sebagai ${ROLES[role].name} (${ROLES[role].shortRole}).`);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    showToast(`Peran aktif diganti ke ${ROLES[role].name} (${ROLES[role].shortRole}).`);
  };

  const handleResetDemo = () => {
    const snap = resetLocalWorkspace();
    setAssets(snap.assets);
    setReports(snap.reports);
    setComments(snap.comments);
    setEvidences(snap.evidences);
    showToast('Data demo berhasil dikembalikan ke kondisi awal.');
  };

  const handleOpenReport = (report: Report) => {
    setSelectedReportId(report.id);
    setActivePage('case-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportCreated = async (newReport: Report, initialEvidence?: Evidence) => {
    setReports((prev) => [newReport, ...prev]);
    if (initialEvidence) {
      setEvidences((prev) => [...prev, initialEvidence]);
    }
    await persistNewReport(newReport);
    setSelectedReportId(newReport.id);
    setActivePage('case-detail');
    showToast(`Laporan ${newReport.id} berhasil disimpan dengan status awal PRADUGA.`);
  };

  const handleUpdateReport = async (
    reportId: string,
    patch: Partial<Report>,
    toastText: string
  ) => {
    const updatedAt = new Date().toISOString();
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, ...patch, updated_at: updatedAt } : r))
    );
    await persistReportUpdate(reportId, { ...patch, updated_at: updatedAt });
    showToast(toastText);
  };

  const handleAddEvidence = (ev: Evidence) => {
    setEvidences((prev) => [...prev, ev]);
    setReports((prev) =>
      prev.map((r) =>
        r.id === ev.report_id
          ? {
              ...r,
              evidence_note: `${ev.file_name} (${ev.caption || 'Terlampir'})`,
              image_url: ev.public_url || r.image_url,
              updated_at: new Date().toISOString(),
            }
          : r
      )
    );
    showToast(`Bukti "${ev.file_name}" berhasil ditambahkan ke Evidence Vault.`);
  };

  const handleAddComment = async (newComment: CaseComment) => {
    setComments((prev) => [...prev, newComment]);
    await persistComment(newComment);
    showToast('Catatan kasus berhasil disimpan ke jejak audit.');
  };

  const handleSendSlaReminder = (targetReports: Report[]) => {
    const ids = new Set(targetReports.map((t) => t.id));
    const nowIso = new Date().toISOString();
    setReports((prev) =>
      prev.map((r) =>
        ids.has(r.id)
          ? {
              ...r,
              sla_reminder_count: (r.sla_reminder_count || 0) + 1,
              sla_last_reminder_at: nowIso,
            }
          : r
      )
    );
    showToast(
      `Pengingat SLA terkirim ke pelapor & supervisor untuk ${targetReports.length} kasus tertunda.`
    );
  };

  if (!isLoggedIn) {
    return (
      <LoginView
        selectedRole={currentRole}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onLogin={handleLogin}
      />
    );
  }

  const roleInfo = ROLES[currentRole];
  const overdueCount = reports.filter(
    (r) => r.status !== 'VERIFIED' && calculateSla(r.updated_at || r.created_at).isOverdue
  ).length;
  const verifiedCount = reports.filter((r) => r.status === 'VERIFIED').length;

  const activeReport =
    reports.find((r) => r.id === selectedReportId) || reports[0] || INITIAL_REPORTS[0];
  const activeReportAsset =
    assets.find((a) => a.id === activeReport.asset_id) || assets[0];

  return (
    <div className="min-h-screen flex bg-[var(--canvas)] text-[var(--ink)]">
      {/* Left Sidebar + Mobile Bottom Nav */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        roleInfo={roleInfo}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onLogout={() => setIsLoggedIn(false)}
        overdueCount={overdueCount}
        verifiedCount={verifiedCount}
      />

      {/* Right Content Column */}
      <div className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-0">
        <Topbar
          activePage={activePage}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          dataSource={dataSource}
          onResetDemo={handleResetDemo}
        />

        <main className="w-full max-w-[1380px] mx-auto px-4 sm:px-8 py-7">
          {activePage === 'home' && (
            <HomeView
              roleInfo={roleInfo}
              assets={assets}
              reports={reports}
              isDarkMode={isDarkMode}
              onNavigate={setActivePage}
              onOpenReport={handleOpenReport}
              onSendSlaReminder={handleSendSlaReminder}
            />
          )}

          {activePage === 'lapor' && (
            <LaporCepatView
              assets={assets}
              roleInfo={roleInfo}
              isDarkMode={isDarkMode}
              onReportCreated={handleReportCreated}
              onCancel={() => setActivePage('home')}
            />
          )}

          {activePage === 'cases' && (
            <CasesListView
              roleInfo={roleInfo}
              assets={assets}
              reports={reports}
              evidences={evidences}
              isDarkMode={isDarkMode}
              onSelectReport={handleOpenReport}
              onCreateNew={() => setActivePage('lapor')}
              onSendSlaReminder={handleSendSlaReminder}
            />
          )}

          {activePage === 'case-detail' && activeReport && (
            <CaseDetailView
              report={activeReport}
              asset={activeReportAsset}
              roleInfo={roleInfo}
              evidences={evidences.filter((e) => e.report_id === activeReport.id)}
              comments={comments.filter((c) => c.report_id === activeReport.id)}
              isDarkMode={isDarkMode}
              onBack={() => setActivePage('cases')}
              onUpdateReport={handleUpdateReport}
              onAddEvidence={handleAddEvidence}
              onAddComment={handleAddComment}
              onPreviewEvidence={setActiveCitation}
            />
          )}

          {activePage === 'graph' && (
            <KnowledgeGraphView
              assets={assets}
              reports={reports}
              evidences={evidences}
              isDarkMode={isDarkMode}
              onOpenEvidence={setActiveCitation}
              onOpenReport={handleOpenReport}
            />
          )}

          {activePage === 'tanya' && (
            <TanyaSynqraView
              assets={assets}
              reports={reports}
              evidences={evidences}
              onOpenEvidence={setActiveCitation}
            />
          )}
        </main>
      </div>

      {/* Evidence Preview Modal (from Citations [1], [2] & Evidence Vault) */}
      <EvidenceLightboxModal
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-md px-4 py-3.5 rounded-xl bg-[#0B1F44] dark:bg-[#0F284E] text-white border border-cyan-400/50 shadow-xl flex items-center gap-3 animate-fade-in"
        >
          <span className="w-7 h-7 rounded-lg bg-[#00B8D9]/20 text-[#38D6F0] flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </span>
          <p className="text-sm font-heading font-semibold m-0 leading-snug">{toastMsg}</p>
        </div>
      )}
    </div>
  );
}
