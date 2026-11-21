/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { X, Image as ImageIcon, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

export interface EvidenceCitationData {
  index: number;
  reportId: string;
  status: 'PRADUGA' | 'TRIAGE' | 'INVESTIGATION' | 'VERIFIED';
  assetId: string;
  title: string;
  evidenceName: string;
  evidenceUrl?: string;
  gejala?: string;
  praduga_penyebab?: string;
  usulan_tindakan?: string;
}

interface EvidenceLightboxModalProps {
  citation: EvidenceCitationData | null;
  onClose: () => void;
}

export const EvidenceLightboxModal: React.FC<EvidenceLightboxModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  const getAssetType = (assetId: string) => {
    if (assetId.includes('E-201')) return 'heat';
    if (assetId.includes('FCV')) return 'valve';
    return 'pump';
  };

  const hasImage = Boolean(
    citation.evidenceUrl &&
    citation.evidenceUrl.trim() !== '' &&
    !citation.evidenceName.toLowerCase().includes('belum')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-['Poppins',sans-serif] font-black flex items-center justify-center">
                [{citation.index}]
              </span>
              <span className="font-['Poppins',sans-serif] text-xs font-bold text-white">
                {citation.reportId} · {citation.assetId}
              </span>
              <StatusBadge status={citation.status} size="sm" />
            </div>
            <h3 className="font-['Poppins',sans-serif] text-base font-bold text-white">
              {citation.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evidence Photo Preview or Empty Notice */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 text-center">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span className="font-['Poppins',sans-serif] font-bold uppercase tracking-wider flex items-center gap-1.5 text-cyan-400">
              <ImageIcon className="w-4 h-4" /> Dokumen Bukti Fisik Lapangan
            </span>
            {hasImage ? (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Bukti Terverifikasi
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Bukti Belum Terlampir
              </span>
            )}
          </div>

          {hasImage && citation.evidenceUrl ? (
            <div className="space-y-2">
              <img
                src={citation.evidenceUrl}
                alt="File Bukti Lapangan"
                className="w-full max-h-64 object-contain rounded-xl border border-slate-700 bg-black/40 mx-auto shadow-inner"
              />
              <p className="text-xs font-semibold text-slate-300">
                {citation.evidenceName}
              </p>
            </div>
          ) : (
            <div className="py-8 px-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 space-y-2">
              <TechnicalArt type={getAssetType(citation.assetId)} darkMode={true} className="w-full h-24 mx-auto opacity-70" />
              <p className="text-xs font-bold text-amber-300">
                Laporan ini ({citation.reportId}) berstatus {citation.status} dan file foto bukti belum diunggah.
              </p>
              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                Sesuai aturan keras kepatuhan keandalan, temuan ini belum dapat disahkan pakar ke dalam standar Knowledge Base.
              </p>
            </div>
          )}
        </div>

        {/* Fact Connection details from Citation */}
        <div className="space-y-2 text-xs">
          {citation.gejala && (
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
              <span className="font-['Poppins',sans-serif] font-bold text-amber-400 uppercase text-[10.5px] block mb-0.5">
                Gejala Teramati:
              </span>
              <p className="text-slate-200">{citation.gejala}</p>
            </div>
          )}

          {citation.praduga_penyebab && (
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
              <span className="font-['Poppins',sans-serif] font-bold text-purple-400 uppercase text-[10.5px] block mb-0.5">
                Akar Masalah (Root Cause):
              </span>
              <p className="text-slate-200">{citation.praduga_penyebab}</p>
            </div>
          )}

          {citation.usulan_tindakan && (
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
              <span className="font-['Poppins',sans-serif] font-bold text-emerald-400 uppercase text-[10.5px] block mb-0.5">
                Tindakan Rekomendasi Teruji:
              </span>
              <p className="text-slate-200">{citation.usulan_tindakan}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Sitasi [{citation.index}] dari Supabase Storage
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-['Poppins',sans-serif] font-bold text-white transition-colors"
          >
            Tutup Pratinjau
          </button>
        </div>

      </div>
    </div>
  );
};
