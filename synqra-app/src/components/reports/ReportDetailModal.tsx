/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Report, UserRole, CaseComment } from '@/types/synqra';
import { calculateSla, INITIAL_COMMENTS } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import {
  X,
  MessageSquare,
  Send,
  Calendar,
  User,
  Building,
  Image as ImageIcon,
  CheckCircle,
  RotateCcw,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Lock,
  FileCheck2,
  ListPlus,
  Target,
  UserCheck,
} from 'lucide-react';

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onStatusUpdate: (reportId: string, newStatus: Report['status'], revisionComment?: string, requestedEvidence?: string) => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onStatusUpdate,
  currentUserRole,
  currentUserName,
}) => {
  const [activeTab, setActiveTab] = useState<'entities' | 'risk_capa'>('entities');
  
  // Case comments state initialized with seeded comments for this report
  const [comments, setComments] = useState<CaseComment[]>(() => {
    if (!report) return [];
    return INITIAL_COMMENTS.filter((c) => c.report_id === report.id);
  });

  const [newComment, setNewComment] = useState('');
  
  // Revision Request State for 2-way feedback
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [requestedEvidence, setRequestedEvidence] = useState('');

  if (!report) return null;

  // SLA Calculation
  const sla = calculateSla(report.updated_at || report.created_at);

  // HARD GATE CHECKS (Aturan Keras):
  // 1. Evidence Check: must have valid image_url and not marked as "belum"
  const hasEvidence = Boolean(
    report.image_url &&
    report.image_url.trim() !== '' &&
    (!report.evidence_note || !report.evidence_note.toLowerCase().includes('belum'))
  );

  // 2. Self-Approval Check: Current user cannot approve their own report
  const isSelfApproval = Boolean(
    currentUserName &&
    report.reporter_name &&
    currentUserName.trim().toLowerCase() === report.reporter_name.trim().toLowerCase()
  );

  const isHardGateLocked = !hasEvidence || isSelfApproval;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newEntry: CaseComment = {
      id: `c-${Date.now()}`,
      report_id: report.id,
      author_name: currentUserName,
      author_role: currentUserRole,
      comment: newComment.trim(),
      created_at: new Date().toISOString(),
    };

    setComments([...comments, newEntry]);
    setNewComment('');
  };

  const handleExecuteRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNote.trim()) return;

    const revisionEntry: CaseComment = {
      id: `rev-${Date.now()}`,
      report_id: report.id,
      author_name: currentUserName,
      author_role: currentUserRole,
      comment: revisionNote.trim(),
      is_revision_request: true,
      requested_evidence: requestedEvidence.trim() || 'Lampiran foto bukti fisik & dokumen inspeksi',
      created_at: new Date().toISOString(),
    };

    setComments([...comments, revisionEntry]);
    onStatusUpdate(report.id, 'PRADUGA', revisionNote.trim(), requestedEvidence.trim());
    setIsRevisionMode(false);
    setRevisionNote('');
    setRequestedEvidence('');
  };

  const getAssetType = (assetId: string) => {
    if (assetId.includes('E-201')) return 'heat';
    if (assetId.includes('FCV')) return 'valve';
    return 'pump';
  };

  // Find any active revision requests in comments
  const activeRevisions = comments.filter((c) => c.is_revision_request);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 p-5 sm:p-7">
        
        {/* Header with SLA Live Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-['Poppins',sans-serif] text-xs font-black text-cyan-400">
                {report.id}
              </span>
              <StatusBadge status={report.status} />

              {/* SLA Indicator Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-['Poppins',sans-serif] font-bold border ${sla.badgeClass}`}
                title={`Durasi sejak update terakhir: ${sla.hoursElapsed} jam`}
              >
                <Clock className="w-3 h-3" />
                <span>{sla.label}</span>
              </span>

              {report.sla_reminder_count ? (
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Pengingat: {report.sla_reminder_count}x
                </span>
              ) : null}
            </div>

            <h2 className="font-['Poppins',sans-serif] text-xl sm:text-2xl font-bold text-white">
              {report.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Pelapor: <b className="text-slate-200">{report.reporter_name}</b>
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" /> Dept: <b className="text-slate-200">{report.dept}</b>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Dibuat: {new Date(report.created_at).toLocaleDateString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-auto p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Way Revision Banner if there is an active revision request */}
        {activeRevisions.length > 0 && (
          <div className="mt-4 p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-amber-300">
                  Laporan Memerlukan Revisi Bukti dari Teknisi Lapangan (2-Way Feedback)
                </div>
                <p className="text-xs text-amber-100">
                  <b>Permintaan:</b> {activeRevisions[activeRevisions.length - 1].comment}
                </p>
                {activeRevisions[activeRevisions.length - 1].requested_evidence && (
                  <div className="text-[11px] text-amber-300 font-semibold mt-1">
                    Bukti yang diminta: <u>{activeRevisions[activeRevisions.length - 1].requested_evidence}</u>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs: 7 Entitas vs Risk Report & CAPA */}
        <div className="flex items-center gap-2 mt-5 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('entities')}
            className={`px-4 py-2 rounded-xl text-xs font-['Poppins',sans-serif] font-bold transition-all flex items-center gap-2 ${
              activeTab === 'entities'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            <span>7 Entitas Standar Kegagalan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('risk_capa')}
            className={`px-4 py-2 rounded-xl text-xs font-['Poppins',sans-serif] font-bold transition-all flex items-center gap-2 ${
              activeTab === 'risk_capa'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Risk Report & CAPA</span>
            {report.risk_level && (
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                report.risk_level === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                report.risk_level === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {report.risk_level}
              </span>
            )}
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Main Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {activeTab === 'entities' ? (
              <>
                {/* 2D Technical Diagram Card */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 text-center relative overflow-hidden">
                  <span className="absolute top-2.5 left-3 text-[10px] font-['Poppins',sans-serif] font-bold text-cyan-400 uppercase tracking-wider">
                    DIAGRAM TEKNIS 2D · {report.asset_id}
                  </span>
                  <div className="pt-4 pb-2">
                    <TechnicalArt type={getAssetType(report.asset_id)} darkMode={true} className="w-full h-32 mx-auto" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {report.identitas_alat}
                  </p>
                </div>

                {/* 7 Failure Entities */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                    <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-cyan-400 uppercase">1. Identitas Alat</div>
                    <div className="text-sm font-semibold mt-0.5 text-white">{report.identitas_alat}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-amber-400 uppercase">2. Gejala Teramati (Symptom)</div>
                    <div className="text-sm font-medium mt-0.5 text-slate-200">{report.gejala}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                      <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-slate-400 uppercase">3. Kondisi Operasi</div>
                      <div className="text-xs font-medium mt-0.5 text-slate-200">{report.kondisi_operasi || '-'}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                      <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-slate-400 uppercase">4. Pemeriksaan Awal</div>
                      <div className="text-xs font-medium mt-0.5 text-slate-200">{report.pemeriksaan_awal || '-'}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                    <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-purple-400 uppercase">5. Praduga Penyebab</div>
                    <div className="text-sm font-medium mt-0.5 text-slate-200">{report.praduga_penyebab || '-'}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
                    <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-sky-400 uppercase">6. Usulan Tindakan</div>
                    <div className="text-sm font-medium mt-0.5 text-slate-200">{report.usulan_tindakan || '-'}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-emerald-400 uppercase">7. Verifikasi Keberhasilan</div>
                    <div className="text-sm font-medium mt-0.5 text-slate-200">{report.verifikasi || '-'}</div>
                  </div>
                </div>

                {/* Evidence Photo Card */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-['Poppins',sans-serif] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Lampiran Bukti Foto (Tabel Evidences)
                    </span>
                    {hasEvidence ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Bukti Valid
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Bukti Kosong
                      </span>
                    )}
                  </div>

                  {report.image_url ? (
                    <div className="space-y-2">
                      <img
                        src={report.image_url}
                        alt="Bukti Temuan"
                        className="w-full max-h-48 object-contain rounded-lg border border-slate-700 bg-black/40"
                      />
                      <p className="text-xs text-slate-400 font-medium">
                        <b>Catatan Lampiran:</b> {report.evidence_note || 'Foto inspeksi lapangan.'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 text-center rounded-lg border border-dashed border-rose-500/40 bg-rose-500/5">
                      <ImageIcon className="w-8 h-8 text-rose-400/50 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-rose-300">
                        Belum ada file bukti foto yang diunggah ke storage untuk laporan ini.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Harap minta revisi bukti kepada teknisi lapangan sebelum proses validasi.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* TAB: Risk Report & CAPA */
              <div className="space-y-4">
                
                {/* Risk Assessment Matrix */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      Analisis Risiko (Risk Matrix 4x4)
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-['Poppins',sans-serif] font-black tracking-wider ${
                      report.risk_level === 'CRITICAL' ? 'bg-rose-500 text-white' :
                      report.risk_level === 'HIGH' ? 'bg-amber-500 text-slate-950' :
                      report.risk_level === 'MEDIUM' ? 'bg-sky-500 text-slate-950' :
                      'bg-emerald-500 text-slate-950'
                    }`}>
                      RISIKO: {report.risk_level || 'MEDIUM'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-800">
                      <div className="text-slate-400 font-semibold">Konsekuensi (Consequence):</div>
                      <div className="text-white font-bold text-sm mt-0.5">{report.risk_consequence || 'Major'}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-800">
                      <div className="text-slate-400 font-semibold">Probabilitas (Likelihood):</div>
                      <div className="text-white font-bold text-sm mt-0.5">{report.risk_likelihood || 'Possible'}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                    <div className="text-rose-400 font-bold mb-0.5 font-['Poppins',sans-serif]">Ringkasan Dampak Operasional:</div>
                    <p className="text-slate-200 font-medium">
                      {report.risk_summary || 'Risiko downtime unit dan degradasi peralatan jika tidak ditangani segera.'}
                    </p>
                  </div>
                </div>

                {/* CAPA Section */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-cyan-400" />
                      Rencana Tindakan Korektif & Preventif (CAPA)
                    </span>
                    <span className="text-xs text-cyan-400 font-semibold">ISO 9001 & OHSAS Standard</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-800">
                      <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-sky-400 uppercase">
                        Tindakan Korektif (Corrective Action):
                      </div>
                      <p className="text-xs text-slate-200 mt-1 font-medium">
                        {report.capa_corrective || 'Pemeriksaan menyeluruh dan perbaikan komponen yang rusak.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-800">
                      <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-emerald-400 uppercase">
                        Tindakan Preventif (Preventive Action):
                      </div>
                      <p className="text-xs text-slate-200 mt-1 font-medium">
                        {report.capa_preventive || 'Peningkatan frekuensi inspeksi dan kalibrasi rutin berkala.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400">Target Selesai (Target Date)</div>
                          <div className="text-xs font-bold text-white">{report.capa_target_date || '2026-11-30'}</div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400">Penanggung Jawab (PIC)</div>
                          <div className="text-xs font-bold text-white">{report.capa_pic || 'Teknisi & Supervisor Area'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Actions & 2-Way Case-Bound Feedback (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 1. GERBANG KEPUTUSAN STATUS (ROLE ACTIONS & HARD GATE) */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
                  Gerbang Keputusan & Alur Kasus
                </h4>
                <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded">
                  {currentUserRole === 'dept_reviewer' ? 'Triage Dept' : currentUserRole === 'hse_validator' ? 'Validasi Pakar' : 'Frontline View'}
                </span>
              </div>

              {/* Action Buttons for Reviewer */}
              {currentUserRole === 'dept_reviewer' && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onStatusUpdate(report.id, 'TRIAGE')}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 text-white text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Tetapkan ke Status TRIAGE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStatusUpdate(report.id, 'INVESTIGATION')}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-98 text-white text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Target className="w-4 h-4" />
                    <span>Mulai INVESTIGASI Detail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRevisionMode(!isRevisionMode)}
                    className="w-full py-2.5 px-3 rounded-xl border border-amber-500/50 hover:bg-amber-500/10 text-amber-400 text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Kembalikan ke PRADUGA (Minta Revisi Bukti)</span>
                  </button>
                </div>
              )}

              {/* Action Buttons for HSE / Pakar Validator (WITH HARD GATE) */}
              {currentUserRole === 'hse_validator' && (
                <div className="space-y-3">
                  
                  {/* HARD GATE ALERT BOX WHEN LOCKED */}
                  {isHardGateLocked && (
                    <div className="p-3 rounded-xl border border-rose-500/50 bg-rose-500/10 text-rose-200 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-['Poppins',sans-serif] font-bold text-rose-400 uppercase tracking-wider text-[11px]">
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        Gerbang Validasi Terkunci (Hard Gate)
                      </div>
                      
                      {!hasEvidence && (
                        <p className="text-[11px] leading-relaxed">
                          ⚠️ <b>Tabel Evidences Kosong:</b> Tidak ada bukti foto inspeksi yang terlampir. Pengesahan ditolak sampai teknisi mengunggah bukti fisik.
                        </p>
                      )}

                      {isSelfApproval && (
                        <p className="text-[11px] leading-relaxed">
                          ⛔ <b>Aturan Keras (No Self-Approval):</b> Anda (<span className="text-white font-bold">{currentUserName}</span>) tercatat sebagai pelapor kasus ini. Pengesahan harus dilakukan oleh validator independen lain demi integritas audit HSE.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Sahkan Terverifikasi Button (Hard Gate Protected) */}
                  <button
                    type="button"
                    disabled={isHardGateLocked}
                    onClick={() => onStatusUpdate(report.id, 'VERIFIED')}
                    className={`w-full py-3 px-3 rounded-xl text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2 transition-all ${
                      isHardGateLocked
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                        : 'bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-lg shadow-emerald-600/30'
                    }`}
                  >
                    {isHardGateLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Sahkan Terverifikasi (Terkunci)</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sahkan Terverifikasi & Terbitkan ke Knowledge Base</span>
                      </>
                    )}
                  </button>

                  {/* Return for revision */}
                  <button
                    type="button"
                    onClick={() => setIsRevisionMode(!isRevisionMode)}
                    className="w-full py-2.5 px-3 rounded-xl border border-amber-500/50 hover:bg-amber-500/10 text-amber-400 text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Kembalikan ke PRADUGA (Minta Bukti)</span>
                  </button>

                </div>
              )}

              {/* Frontline OMI View */}
              {currentUserRole === 'frontline_omi' && (
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                  <p>
                    Sebagai <b>Frontline OMI</b>, status kasus ini adalah <b>{report.status}</b>. Anda dapat membalas permintaan revisi atau menambahkan catatan lapangan pada thread di bawah.
                  </p>
                </div>
              )}

              {/* INLINE REVISION FORM (When Revision Mode is active) */}
              {isRevisionMode && (
                <form onSubmit={handleExecuteRevision} className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/5 space-y-2.5 mt-2 animate-in fade-in">
                  <div className="text-xs font-['Poppins',sans-serif] font-bold text-amber-400 uppercase">
                    Formulir Permintaan Revisi Bukti (2-Way Feedback)
                  </div>
                  <input
                    type="text"
                    value={requestedEvidence}
                    onChange={(e) => setRequestedEvidence(e.target.value)}
                    placeholder="Nama bukti yang diminta (cth: Foto close-up flange)..."
                    className="w-full p-2 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    required
                  />
                  <textarea
                    rows={2}
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    placeholder="Instruksi revisi teknis untuk teknisi pelapor..."
                    className="w-full p-2 rounded-lg border border-slate-700 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    required
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsRevisionMode(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-['Poppins',sans-serif] font-bold text-xs"
                    >
                      Kirim & Kembalikan ke PRADUGA
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* 2. CASE-BOUND 2-WAY FEEDBACK THREAD (CATATAN 2 ARAH) */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  Catatan 2 Arah Kasus ({comments.length})
                </span>
                <span className="text-[10px] text-slate-400">Diskusi Lapangan & Reviewer</span>
              </div>

              {/* Comments List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                      c.is_revision_request
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-100'
                        : 'bg-slate-800/40 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Poppins',sans-serif] font-bold text-white">
                          {c.author_name}
                        </span>
                        {c.is_revision_request && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                            Revisi Diminta
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <span className="inline-block text-[10px] text-cyan-400 font-semibold uppercase">
                      {c.author_role === 'frontline_omi' ? 'Teknisi OMI' : c.author_role === 'dept_reviewer' ? 'Reviewer Dept' : 'HSE Validator'}
                    </span>

                    <p className="font-medium leading-relaxed">
                      {c.comment}
                    </p>

                    {c.requested_evidence && (
                      <div className="pt-1 border-t border-amber-500/20 text-[11px] text-amber-300 font-semibold">
                        Lampiran yang diminta: {c.requested_evidence}
                      </div>
                    )}
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Belum ada catatan untuk kasus ini. Mulai diskusi di bawah.
                  </div>
                )}
              </div>

              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ketik tanggapan / klarifikasi teknis..."
                  className="flex-1 p-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-['Poppins',sans-serif] flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
