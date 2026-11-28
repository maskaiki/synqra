'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Asset,
  CaseComment,
  CitationItem,
  Evidence,
  Report,
  ReportStatus,
  RiskConsequence,
  RiskLikelihood,
  RoleInfo,
} from '@/types/synqra';
import { calculateSla, computeRiskLevel } from '@/lib/constants';
import { LITERATURE_DATABASE } from '@/lib/cduBalonganKnowledge';
import { JOURNAL_IMAGE_CATALOG } from '@/lib/mediaAssets';
import { uploadEvidenceFile } from '@/lib/dataService';
import { RiskBadge, SlaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileCheck2,
  Lock,
  MessageSquare,
  RotateCcw,
  Send,
  Upload,
} from 'lucide-react';

interface CaseDetailViewProps {
  report: Report;
  asset: Asset;
  roleInfo: RoleInfo;
  evidences: Evidence[];
  comments: CaseComment[];
  isDarkMode: boolean;
  onBack: () => void;
  onUpdateReport: (reportId: string, patch: Partial<Report>, toastText: string) => void;
  onAddEvidence: (evidence: Evidence) => void;
  onAddComment: (comment: CaseComment) => void;
  onPreviewEvidence: (citation: CitationItem) => void;
}

const CONSEQUENCES: RiskConsequence[] = ['Minor', 'Moderate', 'Major', 'Catastrophic'];
const LIKELIHOODS: RiskLikelihood[] = ['Rare', 'Possible', 'Likely', 'Frequent'];

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  report,
  asset,
  roleInfo,
  evidences,
  comments,
  isDarkMode,
  onBack,
  onUpdateReport,
  onAddEvidence,
  onAddComment,
  onPreviewEvidence,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'evidence_discussion' | 'risk_capa'>(
    'summary'
  );
  const [tabDir, setTabDir] = useState<'next' | 'prev'>('next');
  const switchTab = (next: 'summary' | 'evidence_discussion' | 'risk_capa') => {
    const order = ['summary', 'evidence_discussion', 'risk_capa'] as const;
    setTabDir(order.indexOf(next) >= order.indexOf(activeTab) ? 'next' : 'prev');
    setActiveTab(next);
  };
  const [consequence, setConsequence] = useState<RiskConsequence>(
    report.risk_consequence || 'Moderate'
  );
  const [likelihood, setLikelihood] = useState<RiskLikelihood>(
    report.risk_likelihood || 'Possible'
  );
  const [riskSummary, setRiskSummary] = useState(report.risk_summary || '');
  const [capaCorrective, setCapaCorrective] = useState(report.capa_corrective || '');
  const [capaPreventive, setCapaPreventive] = useState(report.capa_preventive || '');
  const [capaTargetDate, setCapaTargetDate] = useState(report.capa_target_date || '');
  const [capaPic, setCapaPic] = useState(report.capa_pic || '');

  const [commentText, setCommentText] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [evidenceCaption, setEvidenceCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sla = calculateSla(report.updated_at || report.created_at);
  const hasEvidence = evidences.length > 0;
  const isSelfReporter = report.reporter_name === roleInfo.name;
  const isVerified = report.status === 'VERIFIED';

  // Peak-end rule: momen kasus disahkan adalah puncak alur kerja validator,
  // maka cap "Disahkan" diberi perayaan singkat hanya saat transisi terjadi,
  // bukan setiap kali kasus terverifikasi dibuka (frequency of use).
  const prevStatusRef = useRef({ id: report.id, status: report.status });
  const [justVerified, setJustVerified] = useState(false);
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = { id: report.id, status: report.status };
    if (prev.id === report.id && prev.status !== 'VERIFIED' && report.status === 'VERIFIED') {
      setJustVerified(true);
      const t = setTimeout(() => setJustVerified(false), 1200);
      return () => clearTimeout(t);
    }
  }, [report.id, report.status]);

  // Jakob's law: tekan Esc untuk menutup form revisi inline.
  useEffect(() => {
    if (!showRevisionForm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowRevisionForm(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showRevisionForm]);

  // Hard Gate Validation Rules
  const canVerifyRole = roleInfo.key === 'hse_validator';
  const verifyBlockedReason = !canVerifyRole
    ? 'Khusus HSE & Pakar Validator untuk mengesahkan kasus.'
    : !hasEvidence
      ? 'Hard Gate: wajib melampirkan minimal 1 file bukti fisik terlebih dahulu.'
      : isSelfReporter
        ? 'No Self-Approval: validator tidak boleh mengesahkan laporan sendiri.'
        : null;

  const verifyShortLock = !canVerifyRole
    ? 'Terkunci: khusus HSE Validator'
    : !hasEvidence
      ? 'Terkunci: wajib minimal 1 bukti fisik'
      : isSelfReporter
        ? 'Terkunci: No Self-Approval'
        : null;

  const computedRisk = computeRiskLevel(consequence, likelihood);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const ev = await uploadEvidenceFile(
        report.id,
        file,
        evidenceCaption.trim() || `Bukti fisik inspeksi (${asset.id})`,
        roleInfo.name
      );
      onAddEvidence(ev);
      setEvidenceCaption('');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleQuickDemoEvidence = () => {
    const demoEv: Evidence = {
      id: `ev-${Date.now()}`,
      report_id: report.id,
      file_name: `Foto_Inspeksi_Fisik_${report.asset_id}_${report.id}.jpg`,
      storage_path: `evidences/${report.id}/demo_inspection.jpg`,
      mime_type: 'image/jpeg',
      caption: 'Lampiran foto bukti fisik dan pembacaan instrumen kalibrasi lapangan.',
      uploaded_by: roleInfo.name,
      created_at: new Date().toISOString(),
    };
    onAddEvidence(demoEv);
  };

  const handleSaveRiskCapa = () => {
    onUpdateReport(
      report.id,
      {
        risk_consequence: consequence,
        risk_likelihood: likelihood,
        risk_level: computedRisk,
        risk_summary: riskSummary,
        capa_corrective: capaCorrective,
        capa_preventive: capaPreventive,
        capa_target_date: capaTargetDate,
        capa_pic: capaPic,
      },
      `Risk Report (${computedRisk}) & rencana CAPA untuk ${report.id} berhasil disimpan.`
    );
  };

  const handleChangeStatus = (nextStatus: ReportStatus) => {
    if (nextStatus === 'VERIFIED' && verifyBlockedReason) return;
    const patch: Partial<Report> = {
      status: nextStatus,
      ...(nextStatus === 'VERIFIED' ? { verified_by: roleInfo.name } : {}),
    };
    const msg =
      nextStatus === 'VERIFIED'
        ? `Kasus ${report.id} disahkan TERVERIFIKASI oleh ${roleInfo.name} dan masuk Knowledge Graph.`
        : `Status kasus ${report.id} diperbarui ke ${nextStatus}.`;
    onUpdateReport(report.id, patch, msg);
  };

  const handleRequestRevision = () => {
    const note = revisionNote.trim();
    if (!note) return;
    onAddComment({
      id: `c-${Date.now()}`,
      report_id: report.id,
      author_name: roleInfo.name,
      author_role: roleInfo.key,
      comment: `Permintaan revisi / bukti tambahan: ${note}`,
      is_revision_request: true,
      requested_evidence: note,
      created_at: new Date().toISOString(),
    });
    onUpdateReport(
      report.id,
      { status: 'PRADUGA', evidence_note: `Diminta bukti tambahan: ${note}` },
      `Kasus ${report.id} dikembalikan ke PRADUGA untuk melengkapi bukti.`
    );
    setRevisionNote('');
    setShowRevisionForm(false);
    setActiveTab('evidence_discussion');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment({
      id: `c-${Date.now()}`,
      report_id: report.id,
      author_name: roleInfo.name,
      author_role: roleInfo.key,
      comment: commentText.trim(),
      created_at: new Date().toISOString(),
    });
    setCommentText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header + Compact Workflow Action Bar */}
      <header className="surface-card p-5 sm:p-6 rounded-3xl space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="group hit-area inline-flex items-center gap-2 font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline"
            >
              <ArrowLeft className="w-4 h-4 nudge-back" />
              <span>Kembali ke Daftar Kasus</span>
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-extrabold text-sm text-[var(--cyan-dark)]">
                {report.id}
              </span>
              <StatusBadge status={report.status} />
              {!isVerified && <SlaBadge sla={sla} />}
              <RiskBadge level={computedRisk} />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              {report.title}
            </h1>
            <p className="text-sm font-medium text-[var(--ink-soft)] m-0">
              Aset: <b className="text-[var(--ink)]">{asset.id} ({asset.name})</b> · Pelapor:{' '}
              <b className="text-[var(--ink)]">{report.reporter_name}</b> ({report.dept})
            </p>
          </div>

          {/* Bilah Aksi Alur Kerja Ringkas */}
          <div className="flex flex-col xl:items-end gap-2 shrink-0">
            {isVerified ? (
              <div
                className={`px-4 py-2.5 rounded-full bg-[#059669] text-white font-heading font-bold text-sm inline-flex items-center gap-2 shadow-sm ${
                  justVerified ? 'animate-celebrate' : ''
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${justVerified ? 'animate-pop' : ''}`}
                  style={justVerified ? { animationDelay: '160ms' } : undefined}
                />
                <span>Disahkan: {report.verified_by || 'Dr. Rina Suryani'}</span>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  {roleInfo.key !== 'frontline_omi' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleChangeStatus('TRIAGE')}
                        className={`px-3.5 py-2.5 rounded-xl border font-heading text-sm font-bold transition-colors ${
                          report.status === 'TRIAGE'
                            ? 'bg-[var(--info-bg)] border-[var(--info)] text-[var(--info)]'
                            : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--cyan)]'
                        }`}
                      >
                        Triage
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeStatus('INVESTIGATION')}
                        className={`px-3.5 py-2.5 rounded-xl border font-heading text-sm font-bold transition-colors ${
                          report.status === 'INVESTIGATION'
                            ? 'bg-[var(--purple-bg)] border-[var(--purple)] text-[var(--purple)]'
                            : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--cyan)]'
                        }`}
                      >
                        Investigasi
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRevisionForm((prev) => !prev)}
                        aria-expanded={showRevisionForm}
                        className="group px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--amber)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4 text-[var(--amber)] transition-transform duration-300 group-hover:-rotate-90" />
                        <span>Minta Revisi</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    disabled={Boolean(verifyBlockedReason)}
                    title={verifyBlockedReason || 'Sahkan kasus ke Knowledge Base'}
                    onClick={() => handleChangeStatus('VERIFIED')}
                    className={`px-4 py-2.5 rounded-xl font-heading font-bold text-sm inline-flex items-center gap-2 ${
                      verifyBlockedReason
                        ? 'bg-[var(--soft)] border border-[var(--line)] text-[var(--ink-soft)] opacity-75 cursor-not-allowed'
                        : 'bg-[#087F5B] hover:bg-[#066346] text-white shadow-sm hover:shadow-md'
                    }`}
                  >
                    {verifyBlockedReason ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sahkan Validasi</span>
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="w-4 h-4" />
                        <span>Sahkan Validasi</span>
                      </>
                    )}
                  </button>
                </div>

                {verifyShortLock && (
                  <span
                    style={{ color: 'var(--amber)' }}
                    className="text-sm font-heading font-bold"
                  >
                    {verifyShortLock}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Form Ringkas Minta Revisi */}
        {showRevisionForm && !isVerified && roleInfo.key !== 'frontline_omi' && (
          <div className="pt-4 border-t border-[var(--line-soft)] flex flex-col sm:flex-row gap-2.5 animate-reveal">
            <input
              type="text"
              autoFocus
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="Sebutkan bukti fisik apa yang wajib dilengkapi pelapor..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowRevisionForm(false)}
                className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-sm font-heading font-bold text-[var(--ink)]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRequestRevision}
                disabled={!revisionNote.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#9A5B06] text-white font-heading text-sm font-bold disabled:opacity-50"
              >
                Kirim Revisi
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3 Tab Bersih Berdiri Sendiri */}
      <div className="surface-card inline-flex flex-wrap gap-1.5 p-1.5 rounded-full">
        {(
          [
            ['summary', 'Ringkasan & 7 Entitas'],
            ['evidence_discussion', `Bukti & Diskusi (${evidences.length + comments.length})`],
            ['risk_capa', 'Risiko & CAPA'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => switchTab(id)}
            aria-pressed={activeTab === id}
            className={`px-4 py-2 rounded-full font-heading text-sm font-bold ${
              activeTab === id
                ? 'pop-btn shadow-sm'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Ringkasan & 7 Entitas */}
      {activeTab === 'summary' && (
        <div
          className={`space-y-5 ${
            tabDir === 'next' ? 'animate-slide-next' : 'animate-slide-prev'
          }`}
        >
          {/* Strip Konteks Aset dengan Panggung Gradien & Breakout Render */}
          <section className="group surface-card p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 overflow-visible">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-20 h-16 rounded-2xl flex items-center justify-center p-1 shrink-0 overflow-visible"
                style={{ background: 'var(--stage-gradient-active)' }}
              >
                <TechnicalArt
                  type={asset.type}
                  darkMode={isDarkMode}
                  breakout
                  className="w-20 h-20 -mt-3"
                />
              </div>
              <div className="min-w-0">
                <div className="font-heading font-extrabold text-sm text-[var(--cyan-dark)]">
                  {asset.id}
                </div>
                <div className="font-heading font-bold text-base text-[var(--ink)] truncate">
                  {asset.name}
                </div>
                <div className="text-sm text-[var(--ink-soft)]">
                  {asset.area} · {asset.dept}
                </div>
              </div>
            </div>

            <div className="text-sm font-semibold text-[var(--ink-soft)]">
              {isVerified ? 'Fakta Terverifikasi' : 'Status Praduga / Investigasi'}
            </div>
          </section>

          {/* Grid 2 Kolom 7 Entitas */}
          <section className="surface-card p-6 rounded-3xl space-y-4">
            <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
              7 Entitas Terstruktur Kasus
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(
                [
                  ['1. Identitas Alat', report.identitas_alat, 'var(--cyan-dark)'],
                  ['2. Gejala Lapangan', report.gejala, 'var(--amber)'],
                  ['3. Kondisi Operasi', report.kondisi_operasi, 'var(--info)'],
                  ['4. Pemeriksaan Awal', report.pemeriksaan_awal, 'var(--info)'],
                  ['5. Praduga / Akar Penyebab', report.praduga_penyebab, 'var(--red)'],
                  ['6. Usulan Tindakan', report.usulan_tindakan, 'var(--purple)'],
                  ['7. Verifikasi Pasca-Perbaikan', report.verifikasi, 'var(--green)'],
                ] as const
              ).map(([label, val, accent], idx) => (
                <div
                  key={label}
                  className={`p-4 rounded-2xl bg-[var(--soft)] ${
                    idx === 6 ? 'md:col-span-2' : ''
                  }`}
                >
                  <div
                    style={{ color: accent }}
                    className="font-heading text-xs font-extrabold uppercase tracking-wider mb-1"
                  >
                    {label}
                  </div>
                  <p className="text-sm font-semibold text-[var(--ink)] leading-relaxed m-0">
                    {val || '-'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Rujukan Literatur Ilmiah & Konteks Data Unit 11 CDU */}
          {((report.literature_refs && report.literature_refs.length > 0) ||
            (report.journal_image_ids && report.journal_image_ids.length > 0) ||
            report.fact_vs_scenario_note) && (
            <section className="surface-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 font-heading text-lg font-bold text-[var(--ink)]">
                <BookOpen className="w-5 h-5 text-[var(--cyan-dark)]" />
                <span>Rujukan Literatur Ilmiah &amp; Jejak Desain Unit 11 CDU</span>
              </div>

              {report.literature_refs && report.literature_refs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.literature_refs.map((code) => {
                    const lit = LITERATURE_DATABASE[code];
                    if (!lit) {
                      return (
                        <div key={code} className="p-3.5 rounded-2xl bg-[var(--soft)] text-sm font-bold text-[var(--ink)]">
                          Kode Sumber: {code}
                        </div>
                      );
                    }
                    return (
                      <div key={code} className="p-4 rounded-2xl bg-[var(--soft)] space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-heading text-xs font-extrabold text-[var(--cyan-dark)] uppercase">
                            {lit.code} · {lit.category}
                          </span>
                          {lit.doiOrUrl.startsWith('http') && (
                            <a
                              href={lit.doiOrUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[var(--cyan-dark)] hover:underline shrink-0"
                            >
                              <span>DOI</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-sm font-bold text-[var(--ink)] leading-snug">
                          {lit.citation}
                        </div>
                        <p className="text-sm text-[var(--ink-soft)] m-0 leading-snug">
                          {lit.keyFindings}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {report.journal_image_ids && report.journal_image_ids.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[var(--line-soft)]">
                  <div className="font-heading text-sm font-bold text-[var(--ink)]">
                    Gambar Rujukan Jurnal ({report.journal_image_ids.length} Figur)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.journal_image_ids.map((gid, idx) => {
                      const entry = JOURNAL_IMAGE_CATALOG[gid];
                      if (!entry) return null;
                      const openJournalPreview = () => {
                        if (!entry.available || !entry.url) return;
                        onPreviewEvidence({
                          index: idx + 1,
                          reportId: report.id,
                          status: report.status,
                          assetId: report.asset_id,
                          title: report.title,
                          evidenceName: `${entry.id} - ${entry.caption}`,
                          evidenceUrl: entry.url,
                          gejala: report.gejala,
                          praduga_penyebab: report.praduga_penyebab,
                          usulan_tindakan: report.usulan_tindakan,
                          verifiedBy: report.verified_by,
                          literatureRefs: report.literature_refs,
                          sourceAttribution: `${entry.id} · ${entry.source} (${entry.license})`,
                        });
                      };

                      return (
                        <div
                          key={gid}
                          className="p-3.5 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex gap-3 items-start"
                        >
                          {entry.available && entry.url ? (
                            <button
                              type="button"
                              onClick={openJournalPreview}
                              title={`Perbesar gambar rujukan ${entry.id}`}
                              className="w-24 h-20 rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] shrink-0"
                            >
                              <img
                                src={entry.url}
                                alt={`${entry.id} - ${entry.caption}`}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ) : (
                            <div className="w-24 h-20 rounded-xl border border-[var(--line)] bg-[var(--surface)] flex flex-col items-center justify-center text-center p-1.5 shrink-0">
                              <span className="font-heading text-xs font-extrabold text-[var(--muted)]">
                                {entry.id}
                              </span>
                              <span className="text-[11px] font-medium text-[var(--muted)] leading-tight">
                                Belum tersedia
                              </span>
                            </div>
                          )}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-[7px] border-l-[3.5px] border-[var(--cyan)] bg-[var(--surface)] font-heading text-xs font-extrabold text-[var(--ink)]">
                                {entry.id} · {entry.source}
                              </span>
                              {entry.drivePaperFolderUrl && (
                                <a
                                  href={entry.drivePaperFolderUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-heading font-bold text-[var(--cyan-dark)] hover:underline shrink-0"
                                >
                                  <span>Paper (Drive)</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-[var(--ink)] m-0 leading-snug">
                              {entry.caption}
                            </p>
                            {entry.usageInSynqra && (
                              <p className="text-sm text-[var(--ink-soft)] m-0 leading-snug">
                                {entry.available
                                  ? entry.usageInSynqra
                                  : 'File gambar Bab III belum tersedia pada repositori PNJ; PDF lampiran tersedia di Drive.'}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {report.fact_vs_scenario_note && (
                <div className="p-4 rounded-2xl bg-[var(--soft)] text-sm text-[var(--ink-soft)] leading-relaxed">
                  <b className="text-[var(--ink)]">Basis Parameter &amp; Batasan Skenario: </b>
                  <span>{report.fact_vs_scenario_note}</span>
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* Tab 2: Bukti & Diskusi */}
      {activeTab === 'evidence_discussion' && (
        <div
          className={`grid grid-cols-1 xl:grid-cols-12 gap-6 items-start ${
            tabDir === 'next' ? 'animate-slide-next' : 'animate-slide-prev'
          }`}
        >
          {/* Galeri & Unggah Bukti (7 cols) */}
          <section className="xl:col-span-7 surface-card p-6 rounded-3xl space-y-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
                Evidence Vault ({evidences.length} File Bukti)
              </h2>
              <p className="text-sm text-[var(--ink-soft)] mt-0.5">
                Minimal 1 bukti fisik wajib dilampirkan sebelum validasi pakar.
              </p>
            </div>

            {evidences.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'var(--amber-bg)',
                  borderColor: 'var(--amber-border)',
                }}
                className="p-5 rounded-xl border text-center space-y-2"
              >
                <AlertTriangle
                  className="w-7 h-7 mx-auto"
                  style={{ color: 'var(--amber)' }}
                />
                <div
                  style={{ color: 'var(--amber)' }}
                  className="font-heading font-bold text-base"
                >
                  Belum Ada Bukti Fisik Terlampir
                </div>
                <p className="text-sm font-medium text-[var(--ink-soft)]">
                  Unggah foto atau dokumen pengukuran di bawah untuk membuka kunci validasi.
                </p>
                {report.required_evidence_hint && (
                  <p className="text-sm font-semibold text-[var(--ink)] m-0 pt-1">
                    Bukti disarankan: {report.required_evidence_hint}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {evidences.map((ev, idx) => {
                  const openPreview = () =>
                    onPreviewEvidence({
                      index: idx + 1,
                      reportId: report.id,
                      status: report.status,
                      assetId: report.asset_id,
                      title: report.title,
                      evidenceName: ev.file_name,
                      evidenceUrl: ev.public_url,
                      gejala: report.gejala,
                      praduga_penyebab: report.praduga_penyebab,
                      usulan_tindakan: report.usulan_tindakan,
                      verifiedBy: report.verified_by,
                      literatureRefs: report.literature_refs,
                      sourceAttribution: ev.source_attribution
                        ? `${ev.source_attribution}${ev.license_label ? ` (${ev.license_label})` : ''}`
                        : undefined,
                    });

                  return (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-[var(--soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {ev.public_url ? (
                          <button
                            type="button"
                            onClick={openPreview}
                            title={`Pratinjau ${ev.file_name}`}
                            className="w-16 h-12 rounded-lg overflow-hidden border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] shrink-0"
                          >
                            <img
                              src={ev.public_url}
                              alt={ev.file_name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <span
                            style={{
                              backgroundColor: 'var(--green-bg)',
                              color: 'var(--green)',
                            }}
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          >
                            <FileCheck2 className="w-5 h-5" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                            {ev.file_name}
                          </div>
                          <div className="text-sm text-[var(--ink-soft)]">
                            {ev.caption || 'Lampiran bukti inspeksi'} · Oleh {ev.uploaded_by}
                          </div>
                          {ev.source_attribution && (
                            <div className="text-xs text-[var(--muted)] mt-0.5 truncate">
                              {ev.source_attribution}
                              {ev.license_label ? ` · ${ev.license_label}` : ''}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={openPreview}
                        className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] font-heading text-sm font-bold text-[var(--ink)] inline-flex items-center gap-1.5 shrink-0"
                      >
                        <Eye className="w-4 h-4 text-[var(--cyan-dark)]" />
                        <span>Pratinjau</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {!isVerified && (
              <div className="pt-4 border-t border-[var(--line-soft)] space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={evidenceCaption}
                    onChange={(e) => setEvidenceCaption(e.target.value)}
                    placeholder="Keterangan singkat bukti (misal: Foto termografi 82°C)..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleUploadFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Mengunggah...' : 'Unggah File Bukti'}</span>
                  </button>
                </div>
                {!hasEvidence && (
                  <button
                    type="button"
                    onClick={handleQuickDemoEvidence}
                    className="text-sm font-heading font-bold text-[var(--cyan-dark)] hover:underline"
                  >
                    + Tambah 1 Bukti Simulasi Cepat (untuk uji buka kunci validasi)
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Diskusi 2 Arah (5 cols) */}
          <section className="xl:col-span-5 surface-card p-6 rounded-3xl space-y-4">
            <h2 className="font-heading text-lg font-bold text-[var(--ink)] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--cyan-dark)]" />
              <span>Diskusi Kasus ({comments.length})</span>
            </h2>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-[var(--ink-soft)] py-4 text-center">
                  Belum ada catatan diskusi pada kasus ini.
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    style={
                      c.is_revision_request
                        ? { backgroundColor: 'var(--amber-bg)' }
                        : undefined
                    }
                    className={`p-4 rounded-2xl ${
                      c.is_revision_request ? '' : 'bg-[var(--soft)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-heading font-bold text-sm text-[var(--ink)]">
                        {c.author_name}
                      </span>
                      <span className="text-sm font-medium text-[var(--ink-soft)]">
                        {new Date(c.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[var(--ink)] leading-relaxed m-0">
                      {c.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handlePostComment}
              className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-[var(--line-soft)]"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Tulis catatan sebagai ${roleInfo.name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Kirim</span>
              </button>
            </form>
          </section>
        </div>
      )}

      {/* Tab 3: Risiko & CAPA */}
      {activeTab === 'risk_capa' && (
        <section
          className={`surface-card p-6 rounded-3xl space-y-6 ${
            tabDir === 'next' ? 'animate-slide-next' : 'animate-slide-prev'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
                Penilaian Risiko &amp; Rencana CAPA
              </h2>
              <p className="text-sm text-[var(--ink-soft)] mt-0.5">
                Tentukan Consequence dan Likelihood serta tindakan perbaikan permanen.
              </p>
            </div>
            <RiskBadge level={computedRisk} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Matriks 4x4 Ringkas */}
            <div className="lg:col-span-5 p-4 rounded-2xl bg-[var(--soft)] space-y-3">
              <div className="font-heading text-sm font-bold text-[var(--ink)]">
                Matriks Risiko (4 x 4)
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[...LIKELIHOODS].reverse().map((l) =>
                  CONSEQUENCES.map((c) => {
                    const level = computeRiskLevel(c, l);
                    const isCurrent = c === consequence && l === likelihood;
                    return (
                      <button
                        key={`${c}-${l}`}
                        type="button"
                        onClick={() => {
                          setConsequence(c);
                          setLikelihood(l);
                        }}
                        title={`${c} / ${l}: ${level}`}
                        style={{
                          backgroundColor:
                            level === 'CRITICAL' || level === 'HIGH'
                              ? 'var(--red-bg)'
                              : level === 'MEDIUM'
                                ? 'var(--amber-bg)'
                                : 'var(--green-bg)',
                          color:
                            level === 'CRITICAL' || level === 'HIGH'
                              ? 'var(--red)'
                              : level === 'MEDIUM'
                                ? 'var(--amber)'
                                : 'var(--green)',
                        }}
                        className={`py-2 px-1 rounded-lg text-center font-heading text-xs font-extrabold border transition-all ${
                          isCurrent
                            ? 'ring-2 ring-[var(--cyan)] border-[var(--cyan)] scale-[1.03]'
                            : 'border-[var(--line-soft)] opacity-85 hover:opacity-100'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })
                )}
              </div>
              <div className="text-sm text-[var(--ink-soft)]">
                Dipilih: <b className="text-[var(--ink)]">{consequence}</b> /{' '}
                <b className="text-[var(--ink)]">{likelihood}</b>
              </div>
            </div>

            {/* Pilihan Consequence, Likelihood & Ringkasan Risiko */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                    Consequence (Dampak)
                  </label>
                  <select
                    value={consequence}
                    onChange={(e) => setConsequence(e.target.value as RiskConsequence)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-bold"
                  >
                    <option value="Minor">Minor (Dampak ringan)</option>
                    <option value="Moderate">Moderate (Gangguan unit lokal)</option>
                    <option value="Major">Major (Potensi shutdown / cedera)</option>
                    <option value="Catastrophic">Catastrophic (Process Safety Tier 1/2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                    Likelihood (Kemungkinan Terjadi)
                  </label>
                  <select
                    value={likelihood}
                    onChange={(e) => setLikelihood(e.target.value as RiskLikelihood)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-bold"
                  >
                    <option value="Rare">Rare (Jarang)</option>
                    <option value="Possible">Possible (Mungkin terjadi)</option>
                    <option value="Likely">Likely (Sering / berulang)</option>
                    <option value="Frequent">Frequent (Sangat sering)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                  Ringkasan Kajian Risiko (Risk Summary)
                </label>
                <textarea
                  rows={2}
                  value={riskSummary}
                  onChange={(e) => setRiskSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--line-soft)]">
            <div>
              <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                Corrective Action (Tindakan Perbaikan)
              </label>
              <textarea
                rows={3}
                value={capaCorrective}
                onChange={(e) => setCapaCorrective(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                Preventive Action (Pencegahan Berulang)
              </label>
              <textarea
                rows={3}
                value={capaPreventive}
                onChange={(e) => setCapaPreventive(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                PIC Penanggung Jawab
              </label>
              <input
                type="text"
                value={capaPic}
                onChange={(e) => setCapaPic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                Target Penyelesaian CAPA
              </label>
              <input
                type="date"
                value={capaTargetDate}
                onChange={(e) => setCapaTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveRiskCapa}
              className="px-6 py-3 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm"
            >
              Simpan Risiko &amp; CAPA
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
