'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  AnalyticsTabKey,
  Asset,
  CaseComment,
  CitationItem,
  Evidence,
  MainPage,
  Report,
  UserRole,
  WorkerLearningState,
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
  persistEvidenceRecord,
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
import { AnalyticsRoiView } from '@/components/analytics/AnalyticsRoiView';
import { EvidenceLightboxModal } from '@/components/knowledge/EvidenceLightboxModal';
import { CompetencyPassportModal } from '@/components/learning/CompetencyPassportModal';
import {
  awardWorkerPoints,
  createInitialLearningState,
  getTodayKey,
  loadLearningState,
  resetLearningState,
  saveLearningState,
} from '@/lib/learningEngine';
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
  const [isSyncing, setIsSyncing] = useState(false);

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedGraphAssetId, setSelectedGraphAssetId] = useState<string | undefined>(undefined);
  const [activeCitation, setActiveCitation] = useState<CitationItem | null>(null);
  const [learningState, setLearningState] = useState<WorkerLearningState>(
    createInitialLearningState
  );
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [analyticsInitialTab, setAnalyticsInitialTab] = useState<AnalyticsTabKey>('warnings');
  const [toast, setToast] = useState<{ id: number; msg: string; leaving: boolean } | null>(
    null
  );
  const toastTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Interruptible motion: toast baru langsung menggantikan yang lama
  // (timer lama dibatalkan), lalu keluar dengan animasi singkat.
  const dismissToast = (id: number) => {
    setToast((prev) => (prev && prev.id === id ? { ...prev, leaving: true } : prev));
    toastTimers.current.push(
      setTimeout(() => setToast((prev) => (prev && prev.id === id ? null : prev)), 220)
    );
  };

  const showToast = (msg: string) => {
    toastTimers.current.forEach(clearTimeout);
    toastTimers.current = [];
    const id = Date.now();
    setToast({ id, msg, leaving: false });
    toastTimers.current.push(setTimeout(() => dismissToast(id), 3600));
  };

  useEffect(() => () => toastTimers.current.forEach(clearTimeout), []);

  // Load saved theme & workspace data on mount
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('synqra-theme');
    const shouldDark = savedTheme === 'dark';
    setIsDarkMode(shouldDark);
    document.documentElement.classList.toggle('dark', shouldDark);

    setLearningState(loadLearningState());

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

  useEffect(() => {
    if (hydrated) {
      saveLearningState(learningState);
    }
  }, [learningState, hydrated]);

  useEffect(() => {
    if (hydrated) {
      saveLearningState(learningState);
    }
  }, [learningState, hydrated]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('synqra-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleSyncData = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const snap = await loadWorkspaceData();
      setAssets(snap.assets);
      setReports(snap.reports);
      setComments(snap.comments);
      setEvidences(snap.evidences);
      setDataSource(snap.source);
      showToast('Data berhasil disinkronkan dari Supabase.');
    } catch (err: unknown) {
      showToast(
        err instanceof Error
          ? `Gagal menyinkronkan data: ${err.message}`
          : 'Gagal menyinkronkan data dari Supabase.'
      );
    } finally {
      setIsSyncing(false);
    }
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
    setLearningState(resetLearningState());
    showToast('Data demo & poin kompetensi berhasil dikembalikan ke kondisi awal.');
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

    const repRes = await persistNewReport(newReport);
    let evError: string | undefined;
    if (initialEvidence && repRes.ok) {
      const evRes = await persistEvidenceRecord(initialEvidence);
      if (!evRes.ok) {
        evError = evRes.error;
      }
    }

    setSelectedReportId(newReport.id);
    setActivePage('case-detail');

    const ptRes = awardWorkerPoints(learningState, {
      userRole: currentRole,
      eventType: 'report_submitted',
      points: 5,
      label: `Laporan Temuan Lengkap: ${newReport.asset_id}`,
      referenceId: newReport.id,
      dailyCapCount: 3,
    });
    if (ptRes.awardedPoints > 0) {
      setLearningState(ptRes.nextState);
    }
    const pointSuffix = ptRes.awardedPoints > 0 ? ` (+${ptRes.awardedPoints} Poin)` : '';

    if (!repRes.ok) {
      showToast(`Laporan ${newReport.id} tersimpan lokal${pointSuffix}, namun gagal ke Supabase: ${repRes.error}`);
    } else if (evError) {
      showToast(`Laporan ${newReport.id} tersimpan${pointSuffix}, namun metadata bukti gagal dicatat: ${evError}`);
    } else {
      showToast(`Laporan ${newReport.id} disimpan berstatus PRADUGA${pointSuffix}.`);
    }
  };

  const handleUpdateReport = async (
    reportId: string,
    patch: Partial<Report>,
    toastText: string
  ) => {
    const existingReport = reports.find((r) => r.id === reportId);
    const becomingVerified =
      patch.status === 'VERIFIED' && existingReport && existingReport.status !== 'VERIFIED';

    const updatedAt = new Date().toISOString();
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, ...patch, updated_at: updatedAt } : r))
    );

    let bonusNote = '';
    if (becomingVerified && existingReport) {
      const targetRole = existingReport.reporter_role || 'frontline_omi';
      const verRes = awardWorkerPoints(learningState, {
        userRole: targetRole,
        eventType: 'report_verified',
        points: 10,
        label: `Bonus Mutu Bukti: ${existingReport.id} disahkan Validator HSE`,
        referenceId: existingReport.id,
      });
      if (verRes.awardedPoints > 0) {
        setLearningState(verRes.nextState);
        bonusNote = ` (+10 Poin Mutu Bukti dikirim ke ${existingReport.reporter_name})`;
      }
    }

    const res = await persistReportUpdate(reportId, { ...patch, updated_at: updatedAt });
    if (!res.ok) {
      showToast(`Gagal menyinkronkan perubahan ke Supabase: ${res.error}`);
    } else {
      showToast(`${toastText}${bonusNote}`);
    }
  };

  const handleAddEvidence = (ev: Evidence) => {
    const updatedAt = new Date().toISOString();
    const nextNote = `${ev.file_name} (${ev.caption || 'Terlampir'})`;
    setEvidences((prev) => [...prev, ev]);
    setReports((prev) =>
      prev.map((r) =>
        r.id === ev.report_id
          ? {
              ...r,
              evidence_note: nextNote,
              image_url: ev.public_url || r.image_url,
              updated_at: updatedAt,
            }
          : r
      )
    );
    void persistReportUpdate(ev.report_id, {
      evidence_note: nextNote,
      ...(ev.public_url ? { image_url: ev.public_url } : {}),
      updated_at: updatedAt,
    });
    showToast(`Bukti "${ev.file_name}" berhasil ditambahkan ke Evidence Vault.`);
  };

  const handleAddComment = async (newComment: CaseComment) => {
    setComments((prev) => [...prev, newComment]);
    const res = await persistComment(newComment);
    if (!res.ok) {
      showToast(`Catatan tampil lokal, namun gagal tersimpan ke Supabase: ${res.error}`);
    } else {
      showToast('Catatan kasus berhasil disimpan ke jejak audit.');
    }
  };

  const handleSendSlaReminder = async (targetReports: Report[]) => {
    const nowIso = new Date().toISOString();
    const countMap = new Map<string, number>();
    targetReports.forEach((t) => {
      countMap.set(t.id, (t.sla_reminder_count || 0) + 1);
    });

    setReports((prev) =>
      prev.map((r) => {
        const nextCount = countMap.get(r.id);
        return nextCount !== undefined
          ? {
              ...r,
              sla_reminder_count: nextCount,
              sla_last_reminder_at: nowIso,
            }
          : r;
      })
    );

    const results = await Promise.all(
      targetReports.map((t) =>
        persistReportUpdate(t.id, {
          sla_reminder_count: countMap.get(t.id) ?? (t.sla_reminder_count || 0) + 1,
          sla_last_reminder_at: nowIso,
          updated_at: nowIso,
        })
      )
    );

    const failed = results.find((res) => !res.ok);
    if (failed) {
      showToast(`Pengingat SLA terkirim lokal, namun sinkronisasi Supabase gagal: ${failed.error}`);
    } else {
      showToast(
        `Pengingat SLA terkirim ke pelapor & supervisor untuk ${targetReports.length} kasus tertunda.`
      );
    }
  };

  const handleInspectAsset = (assetId: string) => {
    setSelectedGraphAssetId(assetId);
    setActivePage('graph');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBriefingRead = () => {
    const res = awardWorkerPoints(learningState, {
      userRole: currentRole,
      eventType: 'briefing_read',
      points: 5,
      label: 'Konfirmasi Baca Prioritas & Briefing Awal Shift',
      dailyCapCount: 1,
    });
    if (res.awardedPoints > 0) {
      setLearningState(res.nextState);
      showToast(`Briefing awal shift dikonfirmasi (+${res.awardedPoints} Poin).`);
    }
  };

  const handleConfirmBriefingCheck = () => {
    const res = awardWorkerPoints(learningState, {
      userRole: currentRole,
      eventType: 'briefing_check',
      points: 2,
      label: 'Cek Pemahaman Fokus Patroli Shift',
      dailyCapCount: 1,
    });
    if (res.awardedPoints > 0) {
      setLearningState(res.nextState);
      showToast(`Cek pemahaman shift selesai (+${res.awardedPoints} Poin).`);
    }
  };

  const handleCompleteSimulation = (
    reportId: string,
    earnedPoints: number,
    correctCount: number
  ) => {
    const res = awardWorkerPoints(learningState, {
      userRole: currentRole,
      eventType: 'case_simulation',
      points: earnedPoints,
      label: `Simulasi Kasus ${correctCount}/5 Tepat: ${reportId}`,
      referenceId: reportId,
      dailyCapCount: 2,
    });
    if (res.awardedPoints > 0) {
      setLearningState(res.nextState);
      showToast(`Simulasi [${reportId}] tuntas (+${res.awardedPoints} Poin Kompetensi).`);
    } else {
      showToast(`Latihan ulang [${reportId}] selesai (${correctCount}/5 tepat).`);
    }
  };

  const handleTanyaQueryCompleted = (query: string) => {
    const shortQ = query.length > 36 ? `${query.slice(0, 36)}...` : query;
    const res = awardWorkerPoints(learningState, {
      userRole: currentRole,
      eventType: 'tanya_query',
      points: 1,
      label: `Penelusuran Pengetahuan: "${shortQ}"`,
      dailyCapCount: 5,
    });
    if (res.awardedPoints > 0) {
      setLearningState(res.nextState);
    }
  };

  const handleJumpToSimulation = () => {
    setAnalyticsInitialTab('simulation');
    setActivePage('analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const todayKey = getTodayKey();
  const currentPoints = learningState.pointsByRole[currentRole] || 0;
  const briefingReadToday = learningState.briefingReadDateByRole[currentRole] === todayKey;
  const briefingCheckedToday = learningState.briefingCheckDateByRole[currentRole] === todayKey;
  const completedSimulationIds = learningState.completedSimulationsByRole[currentRole] || [];

  return (
    <div className="min-h-screen flex text-[var(--ink)]">
      {/* Left Sidebar + Mobile Bottom Nav */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          if (page === 'analytics') {
            setAnalyticsInitialTab('warnings');
          }
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
      <div className="flex-1 min-w-0 flex flex-col pb-24 lg:pb-0">
        <Topbar
          activePage={activePage}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          dataSource={dataSource}
          onResetDemo={handleResetDemo}
          onSyncData={handleSyncData}
          isSyncing={isSyncing}
          reports={reports}
          assets={assets}
          onSelectReport={handleOpenReport}
          onSendSlaReminder={handleSendSlaReminder}
          currentPoints={currentPoints}
          onOpenPassport={() => setIsPassportOpen(true)}
        />

        <main className="w-full max-w-[1380px] mx-auto px-4 sm:px-8 py-6">
          <div key={`${activePage}-${selectedReportId || ''}`} className="page-transition-enter">
          {activePage === 'home' && (
            <HomeView
              roleInfo={roleInfo}
              assets={assets}
              reports={reports}
              isDarkMode={isDarkMode}
              onNavigate={setActivePage}
              onOpenReport={handleOpenReport}
              onInspectAsset={handleInspectAsset}
              onSendSlaReminder={handleSendSlaReminder}
              briefingReadToday={briefingReadToday}
              briefingCheckedToday={briefingCheckedToday}
              completedSimulationIds={completedSimulationIds}
              onConfirmBriefingRead={handleConfirmBriefingRead}
              onConfirmBriefingCheck={handleConfirmBriefingCheck}
              onOpenSimulation={handleJumpToSimulation}
            />
          )}

          {activePage === 'lapor' && (
            <LaporCepatView
              assets={assets}
              reports={reports}
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
              initialAssetId={selectedGraphAssetId}
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
              onQueryCompleted={handleTanyaQueryCompleted}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsRoiView
              assets={assets}
              reports={reports}
              evidences={evidences}
              comments={comments}
              roleInfo={roleInfo}
              isDarkMode={isDarkMode}
              onOpenReport={handleOpenReport}
              initialTab={analyticsInitialTab}
              completedCaseIds={completedSimulationIds}
              onCompleteSimulation={handleCompleteSimulation}
            />
          )}
          </div>
        </main>
      </div>

      {/* Evidence Preview Modal (from Citations [1], [2] & Evidence Vault) */}
      <EvidenceLightboxModal
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Competency Passport & Shift Points Modal */}
      <CompetencyPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        onStartSimulation={handleJumpToSimulation}
        roleInfo={roleInfo}
        learningState={learningState}
        reports={reports}
      />

      {/* Toast Notification */}
      {/* Moving in arcs + peak-end: toast meluncur melengkung dari pojok kanan bawah,
          ikon centang meletup sebagai penutup aksi. Klik untuk menutup lebih cepat. */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-md ${
            toast.leaving ? 'toast-leave' : 'toast-arc-x'
          }`}
        >
          <div
            onClick={() => dismissToast(toast.id)}
            className="toast-arc-y cursor-pointer px-4 py-3.5 rounded-xl bg-[#0B1F44] dark:bg-[#0F284E] text-white border border-cyan-400/50 shadow-xl flex items-center gap-3"
          >
            <span className="w-7 h-7 rounded-lg bg-[#00B8D9]/20 text-[#38D6F0] flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 stroke-[2.5] animate-pop" style={{ animationDelay: '120ms' }} />
            </span>
            <p className="text-sm font-heading font-semibold m-0 leading-snug">{toast.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
