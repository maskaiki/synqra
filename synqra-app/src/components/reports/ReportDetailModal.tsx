'use client';

import React, { useState } from 'react';
import { Report, UserRole } from '@/types/synqra';
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
} from 'lucide-react';

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onStatusUpdate: (reportId: string, newStatus: Report['status']) => void;
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
  const [comments, setComments] = useState<Array<{ id: string; author: string; role: string; text: string; date: string }>>([
    {
      id: 'c-1',
      author: 'Ir. Agus Wijaya',
      role: 'Reviewer Departemen',
      text: 'Mohon lampirkan data log vibrasi 3 hari terakhir sebelum jadwal intervensi lapangan.',
      date: '2026-11-20 09:12',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  if (!report) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: `c-${Date.now()}`,
        author: currentUserName,
        role: currentUserRole === 'frontline_omi' ? 'Frontline OMI' : currentUserRole === 'dept_reviewer' ? 'Reviewer Dept' : 'HSE Validator',
        text: newComment.trim(),
        date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewComment('');
  };

  const getAssetType = (assetId: string) => {
    if (assetId.includes('E-201')) return 'heat';
    if (assetId.includes('FCV')) return 'valve';
    return 'pump';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-['Poppins',sans-serif] text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                {report.id}
              </span>
              <StatusBadge status={report.status} />
            </div>
            <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-slate-900 dark:text-slate-50">
              {report.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {report.reporter_name}</span>
              <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> {report.dept}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(report.created_at).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Left Column: 7 Entities & 2D Technical Diagram (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Technical Diagram Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center relative overflow-hidden">
              <span className="absolute top-2.5 left-3 text-[10.5px] font-['Poppins',sans-serif] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                DIAGRAM TEKNIS 2D · {report.asset_id}
              </span>
              <div className="pt-5 pb-2">
                <TechnicalArt type={getAssetType(report.asset_id)} className="w-full h-36 mx-auto" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {report.identitas_alat}
              </p>
            </div>

            {/* 7 Failure Entities Display */}
            <div className="space-y-2.5">
              <h3 className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
                7 Entitas Standar Kegagalan (Gemini Extracted)
              </h3>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-cyan-600 dark:text-cyan-400 uppercase">1. Identitas Alat</div>
                <div className="text-sm font-semibold mt-0.5">{report.identitas_alat}</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-amber-600 dark:text-amber-400 uppercase">2. Gejala Teramati (Symptom)</div>
                <div className="text-sm font-medium mt-0.5">{report.gejala}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-slate-500 uppercase">3. Kondisi Operasi</div>
                  <div className="text-xs font-medium mt-0.5">{report.kondisi_operasi || '-'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-slate-500 uppercase">4. Pemeriksaan Awal</div>
                  <div className="text-xs font-medium mt-0.5">{report.pemeriksaan_awal || '-'}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-purple-600 dark:text-purple-400 uppercase">5. Praduga Penyebab</div>
                <div className="text-sm font-medium mt-0.5">{report.praduga_penyebab || '-'}</div>
              </div>

              <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
                <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-sky-600 dark:text-sky-400 uppercase">6. Usulan Tindakan</div>
                <div className="text-sm font-medium mt-0.5">{report.usulan_tindakan || '-'}</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-emerald-600 dark:text-emerald-400 uppercase">7. Verifikasi Keberhasilan</div>
                <div className="text-sm font-medium mt-0.5">{report.verifikasi || '-'}</div>
              </div>
            </div>

            {/* Evidence Image if exists */}
            {report.image_url && (
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Bukti Foto Terunggah
                </div>
                <img
                  src={report.image_url}
                  alt="Bukti Foto"
                  className="w-full max-h-52 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-black/10"
                />
              </div>
            )}
          </div>

          {/* Right Column: Role Actions & Case Comments (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Status Transition Control (Role-based) */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <h4 className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Aksi Keputusan Status
              </h4>

              <div className="space-y-2">
                {currentUserRole === 'dept_reviewer' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onStatusUpdate(report.id, 'TRIAGE')}
                      className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2"
                    >
                      <span>Tetapkan ke Status TRIAGE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onStatusUpdate(report.id, 'INVESTIGATION')}
                      className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2"
                    >
                      <span>Mulai INVESTIGASI Detail</span>
                    </button>
                  </>
                )}

                {currentUserRole === 'hse_validator' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onStatusUpdate(report.id, 'VERIFIED')}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Validasi & Terbitkan ke Knowledge Base</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onStatusUpdate(report.id, 'PRADUGA')}
                      className="w-full py-2.5 px-3 rounded-xl border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-['Poppins',sans-serif] font-bold flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Kembalikan ke PRADUGA (Minta Bukti)</span>
                    </button>
                  </>
                )}

                {currentUserRole === 'frontline_omi' && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Sebagai Frontline OMI, laporan Anda berstatus <b>{report.status}</b> dan menunggu evaluasi departemen terkait.
                  </p>
                )}
              </div>
            </div>

            {/* Case Comments Section */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Catatan Kasus ({comments.length})
                </span>
              </div>

              {/* Comment list */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {comments.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-['Poppins',sans-serif] font-bold text-slate-900 dark:text-slate-100">{c.author}</span>
                      <span className="text-[10px] text-slate-400">{c.date}</span>
                    </div>
                    <span className="inline-block text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">{c.role}</span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Add comment form */}
              <form onSubmit={handleAddComment} className="pt-2 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tambahkan catatan revisi..."
                  className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-['Poppins',sans-serif]"
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
