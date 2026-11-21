'use client';

import React, { useState } from 'react';
import { Report } from '@/types/synqra';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Sparkles,
  Search,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  HelpCircle,
} from 'lucide-react';
import { EvidenceCitationData } from './EvidenceLightboxModal';

interface TanyaSynqraViewProps {
  reports: Report[];
  onOpenEvidence: (citation: EvidenceCitationData) => void;
}

export const TanyaSynqraView: React.FC<TanyaSynqraViewProps> = ({ reports, onOpenEvidence }) => {
  const [question, setQuestion] = useState('');
  const [selectedAssetFilter, setSelectedAssetFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  
  // Results State
  const [resultAnswer, setResultAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<EvidenceCitationData[]>([]);
  const [hasPradugaWarning, setHasPradugaWarning] = useState(false);
  const [pradugaReports, setPradugaReports] = useState<string[]>([]);

  const sampleQuestions = [
    {
      q: 'Mengapa pompa P-101A mengalami getaran abnormal 7.8 mm/s dan bagaimana rekomendasinya?',
      asset: 'P-101A',
    },
    {
      q: 'Bagaimana penanganan penurunan delta temperatur 14°C pada heat exchanger E-201?',
      asset: 'E-201',
    },
    {
      q: 'Apa penyebab katup kendali FCV-301 mengalami keterlambatan respon 8 detik?',
      asset: 'FCV-301',
    },
    {
      q: 'Apakah ada temuan rembesan gas hidrokarbon yang belum terverifikasi bukti fotonya?',
      asset: 'E-201',
    },
  ];

  const handleAsk = async (queryText?: string, assetTarget?: string) => {
    const q = (queryText || question).trim();
    if (!q) return;

    const targetAsset = assetTarget !== undefined ? assetTarget : selectedAssetFilter;

    setIsLoading(true);
    setResultAnswer(null);
    setCitations([]);
    setHasPradugaWarning(false);

    try {
      const res = await fetch('/api/tanya-synqra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          assetFilter: targetAsset === 'ALL' ? undefined : targetAsset,
          customReports: reports,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResultAnswer(data.answer);
        setCitations(data.citations || []);
        setHasPradugaWarning(data.hasPradugaWarning || false);
        setPradugaReports(data.pradugaReports || []);
      } else {
        setResultAnswer('Gagal memproses pertanyaan: ' + (data.error || 'Server error'));
      }
    } catch (err: unknown) {
      console.error('Tanya SYNQRA error:', err);
      setResultAnswer('Terjadi kendala jaringan saat menghubungi server Gemini API.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Helper untuk merender teks AI dengan sitasi [1], [2] yang interaktif dan dapat diklik
   * untuk membuka dokumen/foto bukti aslinya langsung di Lightbox Modal.
   */
  const renderAnswerWithClickableCitations = (text: string) => {
    // Regex matches [1], [2], [3], etc.
    const parts = text.split(/(\[\d+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNum = parseInt(match[1], 10);
        const targetCitation = citations.find((c) => c.index === citationNum);

        return (
          <button
            key={`cite-${index}`}
            type="button"
            onClick={() => {
              if (targetCitation) {
                onOpenEvidence(targetCitation);
              }
            }}
            className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/40 text-cyan-300 font-['Poppins',sans-serif] font-black text-xs transition-all hover:scale-105 cursor-pointer shadow-sm"
            title={`Klik untuk membuka file bukti fisik temuan ${targetCitation ? targetCitation.reportId : ''}`}
          >
            [{citationNum}]
          </button>
        );
      }
      return <span key={`text-${index}`}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Box */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-sky-950/80 to-slate-900 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" /> TANYA SYNQRA · GOOGLE GEMINI HYBRID SEARCH
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Didukung Rujukan Bukti Nyata dari Supabase
          </span>
        </div>

        <h2 className="font-['Poppins',sans-serif] text-2xl font-extrabold text-white">
          Asisten Tanya Jawab Keandalan & Investigasi Berbasis Bukti
        </h2>

        <p className="text-xs text-slate-300 font-medium max-w-3xl leading-relaxed">
          Pencarian hibrida memadukan pencocokan kode aset, kata kunci gejala, dan konteks laporan Supabase. 
          Kasus berstatus <b>VERIFIED</b> diprioritaskan di paling atas, peringatan kuning otomatis muncul jika temuan berstatus <b>PRADUGA</b>, dan setiap rekomendasi wajib menyertakan sitasi interaktif <b>[1]</b>, <b>[2]</b> yang terhubung langsung ke file foto/dokumen bukti fisik.
        </p>

        {/* Asset Filter Selector */}
        <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Fokus Aset:</span>
          {['ALL', 'P-101A', 'E-201', 'FCV-301'].map((assetKey) => (
            <button
              key={assetKey}
              type="button"
              onClick={() => setSelectedAssetFilter(assetKey)}
              className={`px-3 py-1 rounded-lg font-['Poppins',sans-serif] font-bold transition-all ${
                selectedAssetFilter === assetKey
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {assetKey === 'ALL' ? 'Semua Peralatan' : assetKey}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Search Bar Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="p-3 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tanyakan gejala kegagalan, penyebab kerusakan, atau tindakan korektif peralatan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-['Poppins',sans-serif] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Menganalisis Kasus...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Tanya SYNQRA</span>
            </>
          )}
        </button>
      </form>

      {/* Sample Quick Questions */}
      <div className="space-y-2">
        <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Contoh Pertanyaan Cepat Teknisi Lapangan:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuestion(sq.q);
                handleAsk(sq.q, sq.asset);
              }}
              className="p-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 bg-slate-900/60 hover:bg-slate-800/80 text-left transition-all group flex items-start gap-2 text-xs"
            >
              <span className="font-['Poppins',sans-serif] font-bold text-cyan-400 flex-shrink-0 mt-0.5">
                [{sq.asset}]
              </span>
              <span className="text-slate-300 group-hover:text-white font-medium">
                {sq.q}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. AI Results Section */}
      {resultAnswer && (
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-slate-900/90 shadow-2xl space-y-5 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-['Poppins',sans-serif] text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Jawaban Terpadu (Gemini Hybrid Retrieval)
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              {citations.length} Rujukan Kasus Database
            </span>
          </div>

          {/* ATURAN WAJIB: Kotak Peringatan Kuning jika ada hasil berstatus PRADUGA */}
          {hasPradugaWarning && (
            <div className="p-4 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-200 animate-in fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-['Poppins',sans-serif] font-bold text-xs uppercase tracking-wider text-amber-300">
                    Peringatan Status PRADUGA Terdeteksi (Unverified Case In Citations)
                  </h4>
                  <p className="text-xs text-amber-100 leading-relaxed">
                    Salah satu rujukan temuan (<b>{pradugaReports.join(', ')}</b>) masih berstatus <b>PRADUGA</b> dan belum diverifikasi secara independen oleh Tim HSE / Pakar Keandalan. Gunakan rekomendasi yang bersumber dari laporan tersebut sebagai petunjuk awal dengan kewaspadaan operasional.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Synthesized Answer with Clickable Citations */}
          <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line font-medium p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            {renderAnswerWithClickableCitations(resultAnswer)}
          </div>

          {/* Citations List & Direct Evidence Openers */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Daftar Sitasi Rujukan (Klik untuk Membuka Bukti Fisik Asli):
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {citations.map((c) => (
                <div
                  key={c.index}
                  onClick={() => onOpenEvidence(c)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    c.status === 'VERIFIED'
                      ? 'border-emerald-500/40 bg-emerald-950/15 hover:border-emerald-400'
                      : c.status === 'PRADUGA'
                      ? 'border-amber-500/40 bg-amber-950/15 hover:border-amber-400'
                      : 'border-slate-800 bg-slate-800/40 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[11px] font-['Poppins',sans-serif] font-black flex items-center justify-center">
                          [{c.index}]
                        </span>
                        <span className="font-['Poppins',sans-serif] text-xs font-bold text-white">
                          {c.reportId} ({c.assetId})
                        </span>
                      </div>
                      <StatusBadge status={c.status} size="sm" />
                    </div>

                    <h4 className="font-['Poppins',sans-serif] text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {c.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {c.gejala}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-cyan-400">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      {c.evidenceName}
                    </span>
                    <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Buka Dokumen Bukti &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
