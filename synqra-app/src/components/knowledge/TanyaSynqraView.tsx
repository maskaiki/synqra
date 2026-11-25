'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Asset, CitationItem, Evidence, Report } from '@/types/synqra';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SynqraLoader } from '@/components/ui/SynqraLoader';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  RotateCcw,
  Search,
  Sparkles,
  Send,
  User,
  HelpCircle,
} from 'lucide-react';

export interface CitationItemWithHybrid extends CitationItem {
  matchReasons?: string[];
  relevanceScore?: number;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  engine?: 'gemini-live' | 'local-fallback';
  errorReason?: string;
  citations?: CitationItemWithHybrid[];
  detectedAsset?: string | null;
  verifiedCount?: number;
  hasUnverified?: boolean;
}

interface TanyaSynqraViewProps {
  assets: Asset[];
  reports: Report[];
  evidences: Evidence[];
  onOpenEvidence: (citation: CitationItem) => void;
}

const SUGGESTED_QUESTIONS = [
  'Kenapa pompa P-101A bergetar tinggi dan mechanical seal rembes?',
  'Apa penyebab penurunan delta-T dan fouling pada Heat Exchanger E-201?',
  'Kenapa respons stroke Control Valve FCV-301 melambat?',
  'Bagaimana penanganan kebocoran gasket channel pada E-201?',
];

export const TanyaSynqraView: React.FC<TanyaSynqraViewProps> = ({
  assets,
  reports,
  evidences,
  onOpenEvidence,
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [question, setQuestion] = useState('');
  const [assetFilter, setAssetFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleResetSession = () => {
    setMessages([]);
    setQuestion('');
    setErrorMsg(null);
  };

  const runQuery = async (qText: string) => {
    const trimmed = qText.trim();
    if (!trimmed || isLoading) return;

    const timeString = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: timeString,
    };

    // Ambil maksimal 6 pesan riwayat terakhir sebelum pesan baru ini
    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/tanya-synqra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          assetFilter,
          customReports: reports,
          customEvidences: evidences,
          history: historyPayload,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal mencari pengetahuan.');
      }

      const assistantMessage: ChatMessageItem = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: json.answer,
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        engine: json.engine,
        errorReason: json.errorReason,
        citations: json.citations,
        detectedAsset: json.detectedAsset,
        verifiedCount: json.verifiedCount,
        hasUnverified: json.hasUnverified,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Gagal menghubungi layanan Tanya SYNQRA.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runQuery(question);
  };

  const normalizeAnswerText = (
    raw: string,
    citations: CitationItemWithHybrid[]
  ): string => {
    let normalized = raw.replace(/\r\n/g, '\n');

    // Ubah multi-sitasi seperti [1, 2] atau [1; 3] menjadi [1] [2]
    normalized = normalized.replace(
      /\[(\d+(?:\s*[,;]\s*\d+)+)\]/g,
      (_match, nums: string) =>
        nums
          .split(/\s*[,;]\s*/)
          .map((n) => `[${n.trim()}]`)
          .join(' ')
    );

    // Petakan referensi ID laporan seperti [REP-017] ke indeks sitasinya jika cocok
    for (const cit of citations) {
      if (cit.reportId) {
        const escapedId = cit.reportId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        normalized = normalized.replace(
          new RegExp(`\\[${escapedId}\\]`, 'gi'),
          `[${cit.index}]`
        );
      }
    }

    // Rapikan spasi berlebih sebelum tanda baca setelah sitasi, misal "[2] ." -> "[2]."
    normalized = normalized.replace(/(\[\d+\])\s+([.,;:!?])/g, '$1$2');
    return normalized;
  };

  // Bersihkan sisa simbol markdown inline (*kata*, _kata_, `kode`) agar tampilan selalu polos & rapi
  const stripStrayInlineSymbols = (segment: string): string => {
    let cleaned = segment;
    // Lepas *italic* yang bersarang di dalam **bold**
    cleaned = cleaned.replace(
      /\*\*([^*]+?)\*([^*\n]+?)\*([^*]*?)\*\*/g,
      '**$1$2$3**'
    );
    // Lepas *kata* tunggal
    cleaned = cleaned.replace(/(^|[^\w*])\*([^*\n]+?)\*(?!\*)/g, '$1$2');
    // Lepas _kata_ yang bukan snake_case
    cleaned = cleaned.replace(
      /(^|\s|\()_([^_\n]+?)_(?=$|[\s.,;:!?)])/g,
      '$1$2'
    );
    // Lepas backtick `kode`
    cleaned = cleaned.replace(/`([^`\n]+)`/g, '$1');
    return cleaned;
  };

  // Render token inline: sitasi [1] yang bisa diklik dan penekanan **bold** (bebas simbol mentah)
  const renderInlineTokens = (
    rawSegment: string,
    citations: CitationItemWithHybrid[],
    keyPrefix: string
  ): React.ReactNode[] => {
    const segment = stripStrayInlineSymbols(rawSegment);
    const tokenRegex = /(\[\d+\]|\*\*[^\n]+?\*\*)/g;
    const parts = segment.split(tokenRegex);

    return parts
      .filter((part) => part.length > 0)
      .map((part, idx) => {
        const key = `${keyPrefix}-${idx}`;

        // 1. Tombol Sitasi [1], [2], dst.
        const citMatch = part.match(/^\[(\d+)\]$/);
        if (citMatch) {
          const num = Number(citMatch[1]);
          const cit = citations.find((c) => c.index === num);
          const nextPart = parts[idx + 1] || '';
          const followedByPunct = /^[.,;:!?)]/.test(nextPart);
          if (cit) {
            return (
              <button
                key={key}
                type="button"
                onClick={() => onOpenEvidence(cit)}
                title={`Buka bukti sumber ${cit.reportId}: ${cit.evidenceName}`}
                className={`inline-flex items-center justify-center px-1.5 py-0.5 ${
                  followedByPunct ? 'ml-1 mr-0.5' : 'mx-1'
                } rounded-[6px] bg-[#0B1F44] hover:bg-[#00B8D9] dark:bg-[#00B8D9] text-white hover:text-[#061A38] dark:text-[#061830] font-heading text-xs font-extrabold transition-colors align-baseline`}
              >
                [{num}]
              </button>
            );
          }
          return (
            <span
              key={key}
              className="font-heading text-xs font-bold text-[var(--cyan-dark)] mx-0.5"
            >
              [{num}]
            </span>
          );
        }

        // 2. Bold **...** (tampilkan dengan font-heading agar hierarki tipografi tegas & mudah dipindai)
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          const inner = part.slice(2, -2).replace(/\*/g, '');
          return (
            <strong
              key={key}
              className="font-heading font-semibold text-[var(--ink)]"
            >
              {renderInlineTokens(inner, citations, `${key}-b`)}
            </strong>
          );
        }

        // Hapus bintang tunggal tersisa yang tidak berpasangan
        const cleanPlain = part.replace(/\*/g, '');
        return <span key={key}>{cleanPlain}</span>;
      });
  };

  // Deteksi judul bagian (baik dari marker @@SECTION@@, heading ###, maupun label bagian baku)
  const detectSectionHeading = (trimmed: string): string | null => {
    if (trimmed.startsWith('@@SECTION@@')) {
      return trimmed.replace(/^@@SECTION@@/, '').replace(/:+$/, '').trim();
    }
    const mdHeading = trimmed.match(/^#{1,6}\s+(.+?)(?:\s+#+)?$/);
    if (mdHeading) {
      return mdHeading[1]
        .replace(/^\*{1,3}(.+?)\*{1,3}$/, '$1')
        .replace(/^\d+\.\s+/, '')
        .replace(/:+$/, '')
        .trim();
    }
    const plainSection = trimmed.match(
      /^\*{0,2}((?:Fakta|Penyebab|Temuan|Dugaan Awal|Langkah Rekomendasi|Rekomendasi Tindakan|Ringkasan|Kesimpulan|Catatan Penting)[^:\n]{0,55}):\*{0,2}$/i
    );
    if (plainSection) {
      return plainSection[1].replace(/\*/g, '').trim();
    }
    return null;
  };

  const getSectionAccentColor = (title: string): string => {
    const lower = title.toLowerCase();
    if (
      lower.includes('verif') ||
      lower.includes('fakta') ||
      lower.includes('resmi')
    ) {
      return 'var(--green)';
    }
    if (
      lower.includes('dugaan') ||
      lower.includes('praduga') ||
      lower.includes('triage') ||
      lower.includes('belum disahkan')
    ) {
      return 'var(--amber)';
    }
    return 'var(--cyan)';
  };

  // Render teks jawaban sederhana, informatif, bebas simbol mentah, dengan tipografi terstruktur
  const renderAnswerWithCitations = (
    text: string,
    citations: CitationItemWithHybrid[] = []
  ) => {
    const normalizedText = normalizeAnswerText(text, citations);
    const lines = normalizedText.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      // Baris kosong & garis pemisah mentah (---) diabaikan agar alur bersih tanpa noise
      if (!trimmed || /^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        i += 1;
        continue;
      }

      // Blok kode ```...```
      if (trimmed.startsWith('```')) {
        const codeLines: string[] = [];
        i += 1;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i += 1;
        }
        if (i < lines.length) i += 1;
        elements.push(
          <pre
            key={`code-${i}`}
            className="my-2 p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-sm font-mono text-[var(--ink)] overflow-x-auto m-0"
          >
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        continue;
      }

      // Tabel Markdown | ... |
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const tableLines: string[] = [];
        while (
          i < lines.length &&
          lines[i].trim().startsWith('|') &&
          lines[i].trim().endsWith('|')
        ) {
          tableLines.push(lines[i].trim());
          i += 1;
        }
        const rows = tableLines
          .map((tl) => tl.split('|').slice(1, -1).map((c) => c.trim()))
          .filter(
            (cols) =>
              cols.length > 0 && !cols.every((c) => /^:?-{2,}:?$/.test(c))
          );

        if (rows.length > 0) {
          const [headerRow, ...bodyRows] = rows;
          elements.push(
            <div
              key={`tbl-${i}`}
              className="my-2 overflow-x-auto rounded-xl border border-[var(--line)]"
            >
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-[var(--soft)] border-b border-[var(--line)]">
                  <tr>
                    {headerRow.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        className="px-3.5 py-2 font-heading font-bold text-[var(--ink)]"
                      >
                        {renderInlineTokens(cell, citations, `th-${i}-${cIdx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b last:border-b-0 border-[var(--line-soft)]"
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3.5 py-2 text-[var(--ink)] font-medium"
                        >
                          {renderInlineTokens(
                            cell,
                            citations,
                            `td-${i}-${rIdx}-${cIdx}`
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Judul Bagian (Fakta Terverifikasi, Dugaan Awal, Langkah Rekomendasi, dsb.)
      const sectionTitle = detectSectionHeading(trimmed);
      if (sectionTitle) {
        const accentColor = getSectionAccentColor(sectionTitle);
        elements.push(
          <div
            key={`sec-${i}`}
            className={`${
              elements.length > 0 ? 'pt-3.5 mt-1 border-t border-[var(--line-soft)]' : 'pt-0.5'
            } flex items-center gap-2.5`}
          >
            <span
              aria-hidden="true"
              style={{ backgroundColor: accentColor }}
              className="w-1 h-4 rounded-sm shrink-0"
            />
            <h3 className="font-heading text-[15px] font-bold tracking-tight text-[var(--ink)] m-0">
              {renderInlineTokens(sectionTitle, citations, `sec-${i}`)}
            </h3>
          </div>
        );
        i += 1;
        continue;
      }

      // Kutipan blockquote (> ...)
      if (trimmed.startsWith('>')) {
        const quoteText = trimmed.replace(/^>\s?/, '');
        elements.push(
          <blockquote
            key={`bq-${i}`}
            className="my-1.5 pl-3.5 py-2 pr-3 border-l-[3.5px] border-[var(--cyan)] bg-[var(--soft)] rounded-r-xl text-[15px] leading-[1.68] text-[var(--ink)] font-medium m-0"
          >
            {renderInlineTokens(quoteText, citations, `bq-${i}`)}
          </blockquote>
        );
        i += 1;
        continue;
      }

      // Daftar bernomor (1. ... atau 1) ...)
      const orderedMatch = rawLine.match(/^(\s*)(\d+)[.)]\s+(.+)$/);
      if (orderedMatch) {
        const indentSpaces = orderedMatch[1].length;
        const numberLabel = orderedMatch[2];
        const itemContent = orderedMatch[3].trim();
        elements.push(
          <div
            key={`ol-${i}`}
            className={`flex items-start gap-3 text-[15px] leading-[1.68] text-[var(--ink)] font-normal ${
              indentSpaces >= 2 ? 'pl-6' : ''
            }`}
          >
            <span className="mt-0.5 w-6 h-6 rounded-[7px] bg-[var(--cyan-pale)] text-[var(--cyan-dark)] font-heading text-xs font-extrabold flex items-center justify-center shrink-0 select-none">
              {numberLabel}
            </span>
            <div className="min-w-0 flex-1">
              {renderInlineTokens(itemContent, citations, `ol-${i}`)}
            </div>
          </div>
        );
        i += 1;
        continue;
      }

      // Daftar poin (- ..., * ..., • ...)
      const unorderedMatch = rawLine.match(/^(\s*)[-*•]\s+(.+)$/);
      if (unorderedMatch) {
        const indentSpaces = unorderedMatch[1].length;
        const itemContent = unorderedMatch[2].trim();
        elements.push(
          <div
            key={`ul-${i}`}
            className={`flex items-start gap-3 text-[15px] leading-[1.68] text-[var(--ink)] font-normal ${
              indentSpaces >= 2 ? 'pl-6' : ''
            }`}
          >
            <span
              aria-hidden="true"
              className="mt-2.5 w-1.5 h-1.5 rounded-sm bg-[var(--cyan-dark)] shrink-0 select-none"
            />
            <div className="min-w-0 flex-1">
              {renderInlineTokens(itemContent, citations, `ul-${i}`)}
            </div>
          </div>
        );
        i += 1;
        continue;
      }

      // Paragraf standar (ringkasan pembuka / penjelasan singkat)
      elements.push(
        <p
          key={`p-${i}`}
          className="text-[15px] leading-[1.7] text-[var(--ink)] font-normal m-0"
        >
          {renderInlineTokens(trimmed, citations, `p-${i}`)}
        </p>
      );
      i += 1;
    }

    return elements;
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in pb-12">
      {/* Header dengan Tombol Mulai Sesi Baru */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)] m-0">
            Tanya SYNQRA AI
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1 m-0">
            Cari solusi kasus serupa lengkap dengan sitasi bukti terverifikasi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetSession}
          disabled={messages.length === 0 && !question}
          className="self-start sm:self-auto px-4 py-2.5 rounded-full surface-card hover:bg-[var(--hover-bg)] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-heading font-bold text-[var(--ink)] inline-flex items-center gap-2 transition-all shrink-0"
          title="Bersihkan percakapan dan mulai sesi tanya jawab baru"
        >
          <RotateCcw className="w-4 h-4 text-[var(--cyan-dark)]" />
          <span>Mulai Sesi Baru</span>
        </button>
      </header>

      {/* Suggested Quick Questions jika percakapan masih kosong */}
      {messages.length === 0 && (
        <section className="surface-card p-5 sm:p-6 rounded-3xl space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-[var(--ink-soft)] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[var(--cyan-dark)]" />
            <span>Pertanyaan Lapangan Populer</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger">
            {SUGGESTED_QUESTIONS.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                style={{ '--i': idx } as React.CSSProperties}
                onClick={() => runQuery(sq)}
                className="lift press-soft p-3.5 rounded-2xl border border-[var(--line-soft)] bg-[var(--soft)] hover:border-[var(--cyan)] hover:bg-[var(--hover-bg)] text-sm font-semibold text-[var(--ink)] text-left flex items-center justify-between gap-2 group"
              >
                <span>{sq}</span>
                <span className="text-[var(--cyan-dark)] font-heading text-xs font-bold shrink-0 group-hover:translate-x-1 transition-transform">
                  Tanya →
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Chat Thread (Alur Percakapan Multi-Giliran) */}
      {messages.length > 0 && (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {msg.role === 'user' ? (
                /* Kartu Pertanyaan Pengguna */
                <div className="flex justify-end">
                  <div className="max-w-2xl w-full p-4 rounded-3xl bg-[var(--soft)] space-y-1.5">
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-[var(--line-soft)] text-xs text-[var(--ink-soft)] font-heading font-bold">
                      <span className="inline-flex items-center gap-1.5 text-[var(--cyan-dark)]">
                        <User className="w-3.5 h-3.5" />
                        Pertanyaan Pengguna
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-[15px] font-medium text-[var(--ink)] m-0 leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ) : (
                /* Kartu Jawaban AI SYNQRA */
                <div className="space-y-4">
                  {/* Banner Peringatan Guardrail PRADUGA (bersih, tanpa sabit kiri) */}
                  {msg.hasUnverified && (
                    <div
                      style={{ backgroundColor: 'var(--amber-bg)' }}
                      className="px-4 py-3 rounded-2xl flex items-center gap-2.5 text-sm font-semibold text-[var(--ink)]"
                    >
                      <AlertTriangle
                        className="w-4 h-4 shrink-0"
                        style={{ color: 'var(--amber)' }}
                      />
                      <span>
                        Sebagian referensi berstatus <b style={{ color: 'var(--amber)' }}>PRADUGA</b>. Utamakan sumber TERVERIFIKASI.
                      </span>
                    </div>
                  )}

                  {/* Kontainer Sintesis Jawaban AI */}
                  <article className="surface-card p-6 rounded-3xl space-y-4">
                    {/* Header Kartu Jawaban Minimalis (Zero Dots / Zero Badge Slop) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--line-soft)]">
                      <div className="flex items-center gap-2 font-heading font-bold text-base text-[var(--ink)]">
                        <Sparkles className="w-4 h-4 text-[var(--cyan-dark)]" />
                        <span>Jawaban SYNQRA</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-heading font-bold text-[var(--ink-soft)]">
                        <span
                          title={
                            msg.engine === 'gemini-live'
                              ? 'Didukung Google Gemini API'
                              : msg.errorReason || 'Mode analisis lokal'
                          }
                          style={{ color: msg.engine === 'gemini-live' ? 'var(--green)' : 'var(--amber)' }}
                        >
                          {msg.engine === 'gemini-live' ? 'AI Live' : 'Lokal'}
                        </span>

                        {msg.detectedAsset && (
                          <>
                            <span className="opacity-40">·</span>
                            <span className="text-[var(--cyan-dark)]">{msg.detectedAsset}</span>
                          </>
                        )}

                        {typeof msg.verifiedCount === 'number' && (
                          <>
                            <span className="opacity-40">·</span>
                            <span className="inline-flex items-center gap-1 text-[var(--green)]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {msg.verifiedCount} Verified
                            </span>
                          </>
                        )}

                        <span className="opacity-40">·</span>
                        <span className="font-normal text-[var(--muted)]">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Teks Isi Jawaban AI */}
                    <div className="space-y-2.5">
                      {renderAnswerWithCitations(
                        msg.content,
                        msg.citations || []
                      )}
                    </div>

                    {/* Daftar Sumber Sitasi Bukti dengan Chip matchReasons */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-4 border-t border-[var(--line-soft)] space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-heading text-sm font-bold text-[var(--ink)] uppercase tracking-wider">
                            Sumber Sitasi Bukti ({msg.citations.length})
                          </h3>
                          <span className="text-sm font-semibold text-[var(--ink-soft)]">
                            Klik kartu untuk pratinjau
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {msg.citations.map((cit) => (
                            <article
                              key={cit.reportId}
                              onClick={() => onOpenEvidence(cit)}
                              className="p-4 rounded-2xl bg-[var(--soft)] hover:bg-[var(--hover-bg)] cursor-pointer transition-all flex flex-col justify-between gap-3 group"
                            >
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-[6px] bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] font-heading text-xs font-extrabold">
                                      [{cit.index}]
                                    </span>
                                    <span className="font-heading font-bold text-sm text-[var(--cyan-dark)]">
                                      {cit.reportId} · {cit.assetId}
                                    </span>
                                  </div>
                                  <StatusBadge status={cit.status} size="sm" />
                                </div>

                                <h4 className="font-heading font-bold text-[15px] text-[var(--ink)] group-hover:text-[var(--cyan-dark)] transition-colors leading-snug">
                                  {cit.title}
                                </h4>

                                {/* CHIP MATCH REASONS DI BAWAH JUDUL KARTU SUMBER SITASI */}
                                {cit.matchReasons &&
                                  cit.matchReasons.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                      {cit.matchReasons.map((reason, rIdx) => (
                                        <span
                                          key={rIdx}
                                          className="px-2.5 py-0.5 rounded-full text-[11.5px] font-heading font-semibold bg-[var(--surface-elevated)] text-[var(--ink-soft)]"
                                        >
                                          {reason}
                                        </span>
                                      ))}
                                      {typeof cit.relevanceScore ===
                                        'number' && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11.5px] font-heading font-bold bg-[var(--cyan-pale)] text-[var(--cyan-dark)]">
                                          Skor: {cit.relevanceScore}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                <p className="text-sm text-[var(--ink-soft)] line-clamp-2 m-0">
                                  {cit.praduga_penyebab}
                                </p>
                              </div>

                              <div className="pt-2.5 border-t border-[var(--line-soft)] flex items-center justify-between gap-2 text-xs font-bold text-[var(--cyan-dark)]">
                                <span className="truncate">
                                  {cit.evidenceName}
                                </span>
                                <span className="inline-flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                                  <Eye className="w-3.5 h-3.5" />
                                  Buka
                                </span>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                </div>
              )}
            </div>
          ))}

          {/* Indikator Loading Saat AI Berpikir */}
          {isLoading && (
            <SynqraLoader
              variant="search"
              compact
              label="Mencocokkan arsip bukti terverifikasi..."
              sublabel="Menyusun sintesis jawaban lengkap dengan sitasi kasus."
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Pesan Kesalahan jika ada */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: 'var(--red-bg)',
            borderColor: 'var(--red-border)',
            color: 'var(--red)',
          }}
          className="p-4 rounded-xl border text-sm font-bold shadow-sm animate-shake"
        >
          {errorMsg}
        </div>
      )}

      {/* Input Box Sticky Floating Liquid-Glass */}
      <section className="floating-glass p-3.5 sm:p-4 rounded-3xl shadow-[0_14px_34px_-14px_rgba(10,22,43,0.28)] sticky bottom-20 lg:bottom-4 z-10">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[var(--cyan-dark)] absolute left-4 top-3.5" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Tulis pertanyaan teknis lanjutan atau anomali baru..."
              disabled={isLoading}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--line-soft)] bg-[var(--surface)] text-[var(--ink)] text-[15px] font-medium focus:outline-none focus:border-[var(--cyan)] focus:ring-4 focus:ring-[#00B8D9]/20 transition-[border-color,box-shadow] duration-200"
            />
          </div>

          <select
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
            disabled={isLoading}
            className="px-4 py-3 rounded-full border border-[var(--line-soft)] bg-[var(--surface)] text-[var(--ink)] font-heading text-sm font-bold focus:outline-none focus:border-[var(--cyan)]"
          >
            <option value="ALL">Semua Aset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                Khusus {a.id}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="group pop-btn px-6 py-3 rounded-full font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-md"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 nudge-x" />
                <span>Kirim</span>
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};
