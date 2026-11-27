'use client';

import React, { useEffect, useRef } from 'react';
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
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const isOpen = Boolean(citation);

  // Jakob's law + staging: Esc menutup, fokus langsung ke tombol tutup,
  // dan halaman di belakang tidak ikut ter-scroll selama modal terbuka.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!citation) return null;

  const isVerified = citation.status === 'VERIFIED';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#051024]/60 backdrop-blur-md flex items-center justify-center p-4 animate-backdrop"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={citation.title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-[var(--surface-elevated)] border border-[var(--line)] shadow-2xl overflow-hidden animate-modal"
      >
        {/* Header dengan sentuhan gradien halus */}
        <div
          style={{ background: 'var(--stage-gradient)' }}
          className="p-5 sm:p-6 border-b border-[var(--line-soft)] flex items-start justify-between gap-4"
        >
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-[7px] pop-btn font-heading text-xs font-extrabold">
                SITASI [{citation.index}]
              </span>
              <span className="font-heading text-sm font-bold text-[var(--cyan-dark)]">
                {citation.reportId} · {citation.assetId}
              </span>
              <StatusBadge status={citation.status} size="sm" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[var(--ink)] m-0">
              {citation.title}
            </h3>
          </div>
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            aria-label="Tutup pratinjau"
            className="group w-11 h-11 rounded-full border border-[var(--line-soft)] bg-[var(--surface)] flex items-center justify-center text-[var(--ink)] hover:border-[var(--cyan)] shadow-sm shrink-0"
          >
            <X className="w-5 h-5 spin-on-hover" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Evidence Preview Box */}
          <div className="p-4 rounded-2xl bg-[var(--soft)]">
            <div className="flex items-center gap-2.5 mb-3">
              <FileCheck2 className="w-5 h-5 text-[var(--cyan-dark)]" />
              <span className="font-heading font-bold text-sm text-[var(--ink)] truncate">
                {citation.evidenceName}
              </span>
            </div>

            {citation.evidenceUrl ? (
              <img
                src={citation.evidenceUrl}
                alt={citation.evidenceName}
                decoding="async"
                className="w-full max-h-80 object-contain rounded-2xl bg-[var(--surface)] shadow-sm"
              />
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] text-center space-y-2">
                <FileCheck2 className="w-10 h-10 mx-auto text-[var(--cyan-dark)]" />
                <div className="font-heading font-bold text-sm text-[var(--ink)]">
                  Arsip Bukti Teknis ({citation.evidenceName})
                </div>
                <p className="text-sm text-[var(--ink-soft)] m-0">
                  Tersimpan untuk kasus {citation.reportId} pada aset {citation.assetId}.
                </p>
              </div>
            )}

            {(citation.sourceAttribution || (citation.literatureRefs && citation.literatureRefs.length > 0)) && (
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ink-soft)] font-medium">
                {citation.sourceAttribution && <span>{citation.sourceAttribution}</span>}
                {citation.literatureRefs && citation.literatureRefs.length > 0 && (
                  <span className="font-heading font-bold text-[var(--cyan-dark)]">
                    Rujukan: {citation.literatureRefs.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Evidence Traceability Details */}
          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-4 rounded-2xl bg-[var(--soft)]">
              <div className="font-heading text-xs font-extrabold uppercase text-[var(--amber)] mb-1">
                Gejala Teramati
              </div>
              <p className="text-sm font-semibold text-[var(--ink)] m-0">{citation.gejala}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--soft)]">
              <div className="font-heading text-xs font-extrabold uppercase text-[var(--red)] mb-1">
                {isVerified ? 'Akar Penyebab Terverifikasi' : 'Praduga Penyebab (Belum Disahkan)'}
              </div>
              <p className="text-sm font-semibold text-[var(--ink)] m-0">
                {citation.praduga_penyebab}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--soft)]">
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
                    color: 'var(--green)',
                  }
                : {
                    backgroundColor: 'var(--amber-bg)',
                    color: 'var(--amber)',
                  }
            }
            className="p-3.5 rounded-2xl flex items-center gap-2.5 text-sm font-bold"
          >
            {isVerified ? (
              <>
                <CheckCircle2 className="w-5 h-5 shrink-0 animate-pop" style={{ animationDelay: '180ms' }} />
                <span>
                  Disahkan oleh Pakar Validator ({citation.verifiedBy || 'Dr. Rina Suryani'}). Siap dijadikan acuan teknis.
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
