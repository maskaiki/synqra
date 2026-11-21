'use client';

import React, { useRef, useState } from 'react';
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
import { uploadEvidenceFile } from '@/lib/dataService';
import { RiskBadge, SlaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Eye,
  FileCheck2,
  Lock,
  MessageSquare,
  RotateCcw,
  Send,
  ShieldAlert,
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
  const [activeTab, setActiveTab] = useState<'entities' | 'risk_capa' | 'discussion'>('entities');
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

  // Hard Gate Validation Rules
  const canVerifyRole = roleInfo.key === 'hse_validator';
  const verifyBlockedReason = !canVerifyRole
    ? 'Hanya HSE & Pakar Validator yang berhak mengesahkan ke Knowledge Base.'
    : !hasEvidence
      ? 'TERKUNCI (Hard Gate): Wajib melampirkan minimal 1 file bukti fisik di Evidence Vault terlebih dahulu.'
      : isSelfReporter
        ? 'TERKUNCI (No Self-Approval): Validator tidak boleh mengesahkan kasus yang dilaporkan sendiri.'
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
      caption: 'Lampiran foto bukti fisik & pembacaan instrumen kalibrasi lapangan.',
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
        ? `Kasus ${report.id} disahkan TERVERIFIKASI oleh ${roleInfo.name} dan resmi masuk Knowledge Graph!`
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
    setActiveTab('discussion');
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
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 font-heading text-sm font-bold text-[var(--cyan-dark)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
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
          <p className="text-sm font-medium text-[var(--ink-soft)]">
            Aset: <b className="text-[var(--ink)]">{asset.id} ({asset.name})</b> · Pelapor:{' '}
            <b className="text-[var(--ink)]">{report.reporter_name}</b> ({report.dept})
          </p>
        </div>
      </header>

      {/* Sub-Tabs */}
      <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
        {(
          [
            ['entities', '7 Entitas & Evidence Vault'],
            ['risk_capa', 'Risk Report & CAPA'],
            ['discussion', `Catatan Kasus (${comments.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-xl font-heading text-sm font-bold transition-colors ${
              activeTab === id
                ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830]'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--soft)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Main Workspace (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          {activeTab === 'entities' && (
            <>
              {/* 7 Structured Entities */}
              <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
                    7 Entitas Terstruktur Kasus
                  </h2>
                  <span className="text-sm font-semibold text-[var(--ink-soft)]">
                    {isVerified ? 'Fakta Terverifikasi' : 'Masih Berstatus Praduga / Investigasi'}
                  </span>
                </div>

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
                      style={{ borderLeftColor: accent }}
                      className={`p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] border-l-[4px] ${
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

              {/* Evidence Vault */}
              <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
                      Evidence Vault ({evidences.length} File Bukti)
                    </h2>
                    <p className="text-sm text-[var(--ink-soft)]">
                      Bukti fisik (foto kerusakan, log sensor, sertifikat uji) menjadi syarat mutlak validasi pakar.
                    </p>
                  </div>
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
                      Tombol pengesahan pakar otomatis dikunci oleh sistem sampai minimal 1 file bukti diunggah.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {evidences.map((ev, idx) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            style={{
                              backgroundColor: 'var(--green-bg)',
                              color: 'var(--green)',
                            }}
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          >
                            <FileCheck2 className="w-5 h-5" />
                          </span>
                          <div className="min-w-0">
                            <div className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                              {ev.file_name}
                            </div>
                            <div className="text-sm text-[var(--ink-soft)]">
                              {ev.caption || 'Lampiran bukti inspeksi'} · Diunggah oleh {ev.uploaded_by}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
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
                            })
                          }
                          className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] font-heading text-xs font-bold text-[var(--ink)] inline-flex items-center gap-1.5 shrink-0"
                        >
                          <Eye className="w-4 h-4 text-[var(--cyan-dark)]" />
                          <span>Pratinjau</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!isVerified && (
                  <div className="pt-4 border-t border-[var(--line-soft)] space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={evidenceCaption}
                        onChange={(e) => setEvidenceCaption(e.target.value)}
                        placeholder="Keterangan singkat bukti (misal: Foto termografi 82°C atau log vibrasi)..."
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
                        + Tambah 1 Lampiran Bukti Simulasi Cepat (untuk uji buka kunci Validasi)
                      </button>
                    )}
                  </div>
                )}
              </section>
            </>
          )}

          {activeTab === 'risk_capa' && (
            <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
                    Risk Report (HSE) &amp; Rencana CAPA
                  </h2>
                  <p className="text-sm text-[var(--ink-soft)]">
                    Penilaian risiko berbasis Consequence × Likelihood serta tindakan korektif/preventif.
                  </p>
                </div>
                <RiskBadge level={computedRisk} />
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[var(--line-soft)]">
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
                  Simpan Risk Report &amp; CAPA
                </button>
              </div>
            </section>
          )}

          {activeTab === 'discussion' && (
            <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[var(--ink)] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[var(--cyan-dark)]" />
                  <span>Catatan Kasus 2-Arah (Case-Bound Audit Trail)</span>
                </h2>
                <p className="text-sm text-[var(--ink-soft)]">
                  Seluruh komunikasi terikat pada nomor kasus {report.id} untuk revisi bukti &amp; koordinasi teknis.
                </p>
              </div>

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
                          ? {
                              backgroundColor: 'var(--amber-bg)',
                              borderColor: 'var(--amber-border)',
                              borderLeftColor: 'var(--amber)',
                            }
                          : undefined
                      }
                      className={`p-4 rounded-xl border ${
                        c.is_revision_request
                          ? 'border-l-[4px]'
                          : 'bg-[var(--soft)] border-[var(--line)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-heading font-bold text-sm text-[var(--ink)]">
                          {c.author_name}
                        </span>
                        <span className="text-xs font-semibold text-[var(--ink-soft)]">
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

              <form onSubmit={handlePostComment} className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[var(--line-soft)]">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Tulis catatan sebagai ${roleInfo.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Catatan</span>
                </button>
              </form>
            </section>
          )}
        </div>

        {/* Right Governance & Hard Gate Validation Panel (4 cols) */}
        <aside className="xl:col-span-4 space-y-5">
          {/* Asset Context Card */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm">
            <div className="h-28 rounded-xl bg-[var(--soft)] border border-[var(--line-soft)] flex items-center justify-center p-2 mb-3">
              <TechnicalArt type={asset.type} darkMode={isDarkMode} className="w-full h-24" />
            </div>
            <div className="font-heading font-extrabold text-sm text-[var(--cyan-dark)]">
              {asset.id}
            </div>
            <div className="font-heading font-bold text-base text-[var(--ink)]">
              {asset.name}
            </div>
            <div className="text-sm text-[var(--ink-soft)] mt-0.5">{asset.area}</div>
          </div>

          {/* Triage & Hard Gate Decision Box */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[var(--cyan-dark)]" />
              <h3 className="font-heading text-lg font-bold text-[var(--ink)]">
                Gerbang Keputusan &amp; Validasi
              </h3>
            </div>

            {isVerified ? (
              <div
                style={{
                  backgroundColor: 'var(--green-bg)',
                  borderColor: 'var(--green-border)',
                  color: 'var(--green)',
                }}
                className="p-4 rounded-xl border space-y-1"
              >
                <div className="font-heading font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Disahkan &amp; Masuk Knowledge Base</span>
                </div>
                <p className="text-sm font-medium text-[var(--ink-soft)] m-0">
                  Diverifikasi oleh {report.verified_by || 'Dr. Rina Suryani'} dengan {evidences.length} bukti fisik terlampir.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Step Buttons for Reviewer / Validator */}
                {roleInfo.key !== 'frontline_omi' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleChangeStatus('TRIAGE')}
                      className={`py-2.5 px-3 rounded-xl border font-heading text-xs font-bold transition-colors ${
                        report.status === 'TRIAGE'
                          ? 'bg-[var(--info-bg)] border-[var(--info)] text-[var(--info)]'
                          : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--cyan)]'
                      }`}
                    >
                      Set Triage Dept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangeStatus('INVESTIGATION')}
                      className={`py-2.5 px-3 rounded-xl border font-heading text-xs font-bold transition-colors ${
                        report.status === 'INVESTIGATION'
                          ? 'bg-[var(--purple-bg)] border-[var(--purple)] text-[var(--purple)]'
                          : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--cyan)]'
                      }`}
                    >
                      Full Investigation
                    </button>
                  </div>
                )}

                {/* Hard Gate Expert Verification Button */}
                <button
                  type="button"
                  disabled={Boolean(verifyBlockedReason)}
                  onClick={() => handleChangeStatus('VERIFIED')}
                  className={`w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    verifyBlockedReason
                      ? 'bg-[var(--soft)] border border-[var(--line)] text-[var(--ink-soft)] opacity-75 cursor-not-allowed'
                      : 'bg-[#087F5B] hover:bg-[#066346] text-white shadow-md'
                  }`}
                >
                  {verifyBlockedReason ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Terkunci — Syarat Validasi Belum Penuh</span>
                    </>
                  ) : (
                    <>
                      <BadgeCheck className="w-5 h-5" />
                      <span>Sahkan Terverifikasi Pakar</span>
                    </>
                  )}
                </button>

                {verifyBlockedReason && (
                  <div
                    style={{
                      backgroundColor: 'var(--amber-bg)',
                      borderColor: 'var(--amber-border)',
                      color: 'var(--amber)',
                    }}
                    className="p-3.5 rounded-xl border text-sm font-semibold leading-snug"
                  >
                    {verifyBlockedReason}
                  </div>
                )}

                {/* Return for Additional Evidence */}
                {roleInfo.key !== 'frontline_omi' && (
                  <div className="pt-2 border-t border-[var(--line-soft)] space-y-2.5">
                    {!showRevisionForm ? (
                      <button
                        type="button"
                        onClick={() => setShowRevisionForm(true)}
                        className="w-full py-2.5 px-4 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--amber)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Perlu Bukti Tambahan (Kembalikan)</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={revisionNote}
                          onChange={(e) => setRevisionNote(e.target.value)}
                          placeholder="Sebutkan bukti fisik apa yang wajib dilengkapi..."
                          className="w-full p-3 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowRevisionForm(false)}
                            className="flex-1 py-2 rounded-xl border border-[var(--line)] text-sm font-bold text-[var(--ink)]"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleRequestRevision}
                            className="flex-1 py-2 rounded-xl bg-[#9A5B06] text-white font-heading text-sm font-bold"
                          >
                            Kirim Revisi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
