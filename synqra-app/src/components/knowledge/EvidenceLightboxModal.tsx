'use client';

import React from 'react';
import { CitationItem } from '@/types/synqra';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CheckCircle2, FileCheck2, ShieldAlert, X } from 'lucide-react';

interface EvidenceLightboxModalProps {
  citation: CitationItem | null;
  onClose: () => void;
}

export const EvidenceLightboxModal: React.FC<EvidenceLightboxModalProps> = ({
  citation,
  onClose,
}) => {
  if (!citation) return null;

  const isVerified = citation.status === 'VERIFIED';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#051024]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--line)] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-[7px] bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] font-heading text-xs font-extrabold">
                SITASI [{citation.index}]
              </span>
              <span className="font-heading text-sm font-bold text-[var(--cyan-dark)]">
                {citation.reportId} · {citation.assetId}
              </span>
              <StatusBadge status={citation.status} size="sm" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[var(--ink)]">
              {citation.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau"
            className="w-9 h-9 rounded-xl border border-[var(--line)] bg-[var(--soft)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--cyan)] shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Evidence Preview Box */}
          <div className="p-5 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
            <div className="flex items-center gap-2.5 mb-3">
              <FileCheck2 className="w-5 h-5 text-[var(--cyan-dark)]" />
              <span className="font-heading font-bold text-sm text-[var(--ink)]">
                Dokumen / Foto Bukti: {citation.evidenceName}
              </span>
            </div>

            {citation.evidenceUrl ? (
              <img
                src={citation.evidenceUrl}
                alt={citation.evidenceName}
                className="w-full max-h-72 object-contain rounded-xl border border-[var(--line)] bg-[var(--surface)]"
              />
            ) : (
              <div className="p-6 rounded-xl bg-[var(--surface)] border border-dashed border-[var(--line)] text-center space-y-2">
                <FileCheck2 className="w-10 h-10 mx-auto text-[var(--cyan-dark)]" />
                <div className="font-heading font-bold text-sm text-[var(--ink)]">
                  Arsip Bukti Teknis Terverifikasi ({citation.evidenceName})
                </div>
                <p className="text-sm text-[var(--ink-soft)]">
                  Tersimpan dalam repositori integritas kasus {citation.reportId} pada aset {citation.assetId}.
                </p>
              </div>
            )}
          </div>

          {/* Evidence Traceability Details */}
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
              <div className="font-heading text-xs font-extrabold uppercase text-[var(--amber)] mb-1">
                Gejala Teramati
              </div>
              <p className="text-sm font-semibold text-[var(--ink)] m-0">{citation.gejala}</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
              <div className="font-heading text-xs font-extrabold uppercase text-[var(--red)] mb-1">
                {isVerified ? 'Akar Penyebab Terverifikasi' : 'Praduga Penyebab (Belum Disahkan)'}
              </div>
              <p className="text-sm font-semibold text-[var(--ink)] m-0">
                {citation.praduga_penyebab}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
              <div className="font-heading text-xs font-extrabold uppercase text-[var(--info)] mb-1">
                Tindakan Rekomendasi
              </div>
              <p className="text-sm font-semibold text-[var(--ink)] m-0">
                {citation.usulan_tindakan}
              </p>
            </div>
          </div>

          {/* Verification Stamp */}
          <div
            style={
              isVerified
                ? {
                    backgroundColor: 'var(--green-bg)',
                    borderColor: 'var(--green-border)',
                    color: 'var(--green)',
                  }
                : {
                    backgroundColor: 'var(--amber-bg)',
                    borderColor: 'var(--amber-border)',
                    color: 'var(--amber)',
                  }
            }
            className="p-3.5 rounded-xl border flex items-center gap-2.5 text-sm font-bold"
          >
            {isVerified ? (
              <>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  Disahkan oleh Pakar Validator ({citation.verifiedBy || 'Dr. Rina Suryani'}) — Siap dijadikan acuan teknis.
                </span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>
                  Peringatan: Kasus ini masih berstatus {citation.status} dan belum disahkan pakar. Jangan jadikan kesimpulan pasti tanpa pemeriksaan fisik.
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
