'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Asset, CitationItem, Evidence, Report } from '@/types/synqra';
import { EQUIPMENT_CATEGORIES, LITERATURE_DATABASE } from '@/lib/cduBalonganKnowledge';
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
  onQueryCompleted?: (query: string) => void;
}

const SUGGESTED_QUESTIONS = [
  'Mengapa tray atas Pre-Flash Column 11-C-106 mengalami flooding dan kenaikan DP?',
  'Bagaimana mekanisme korosi HCl & deposit NH4Cl di overhead 11-C-101 dan 11-V-102?',
  'Kapan Hot Preheater 11-E-107 A/B harus dibersihkan berdasarkan efisiensi dan fouling Rd?',
  'Mengapa jalur HGO 11-FV-031 dan 11-C-103 rentan korosi asam naftenat (High-TAN)?',
];

function normalizeAnswerText(
  raw: string,
  citations: CitationItemWithHybrid[]
): string {
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

  // Petakan referensi ID laporan seperti [CDU11-C01] ke indeks sitasinya jika cocok
  for (const cit of citations) {
    if (cit.reportId) {
      const escapedId = cit.reportId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      normalized = normalized.replace(
        new RegExp(`\\[${escapedId}\\]`, 'gi'),
        `[${cit.index}]`
      );
    }
  }

  // Hapus sitasi angka tidak valid seperti [0] atau indeks yang tidak ada di citations
  const validIndices = new Set(citations.map((c) => c.index));
  normalized = normalized.replace(/[ \t]*\[(\d+)\]/g, (match, numStr: string) =>
    validIndices.has(Number(numStr)) ? match : ''
  );

  // Rapikan spasi berlebih sebelum tanda baca setelah sitasi/paper code, misal "[2] ." -> "[2]."
  normalized = normalized.replace(
    /(\[(?:\d+|[A-Z0-9]{2,8})\])[ \t]+([.,;:!?])/g,
    '$1$2'
  );
  normalized = normalized.replace(/[ \t]+([.,;:!?])/g, '$1');
  return normalized;
}

// Bersihkan sisa simbol markdown inline (*kata*, _kata_, `kode`) agar tampilan selalu polos & rapi
function stripStrayInlineSymbols(segment: string): string {
  let cleaned = segment;
  cleaned = cleaned.replace(
    /\*\*([^*]+?)\*([^*\n]+?)\*([^*]*?)\*\*/g,
    '**$1$2$3**'
  );
  cleaned = cleaned.replace(/(^|[^\w*])\*([^*\n]+?)\*(?!\*)/g, '$1$2');
  cleaned = cleaned.replace(
    /(^|\s|\()_([^_\n]+?)_(?=$|[\s.,;:!?)])/g,
    '$1$2'
  );
  cleaned = cleaned.replace(/`([^`\n]+)`/g, '$1');
  return cleaned;
}

function renderInlineTokens(
  rawSegment: string,
  citations: CitationItemWithHybrid[],
  onOpenEvidence: (citation: CitationItem) => void,
  keyPrefix: string
): React.ReactNode[] {
  const segment = stripStrayInlineSymbols(rawSegment);
  const tokenRegex = /(\[(?:\d+|[A-Z0-9]{2,8})\]|\*\*[^\n]+?\*\*)/g;
  const parts = segment.split(tokenRegex).filter((part) => part.length > 0);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;
    const prevPart = parts[idx - 1] || '';
    const nextPart = parts[idx + 1] || '';
    const afterOpenParen = /[(\[]$/.test(prevPart);
    const followedByPunct = /^[.,;:!?)\]]/.test(nextPart);

    const citMatch = part.match(/^\[(\d+)\]$/);
    if (citMatch) {
      const num = Number(citMatch[1]);
      const cit = citations.find((c) => c.index === num);
      if (cit) {
        return (
          <button
            key={key}
            type="button"
            onClick={() => onOpenEvidence(cit)}
            title={`Buka bukti sumber ${cit.reportId}: ${cit.evidenceName}`}
            className={`inline-flex items-center justify-center px-1.5 py-0.5 ${
              afterOpenParen ? 'ml-0' : 'ml-1'
            } ${
              followedByPunct ? 'mr-0' : 'mr-1'
            } rounded-[6px] bg-[#0B1F44] hover:bg-[#00B8D9] dark:bg-[#00B8D9] text-white hover:text-[#061A38] dark:text-[#061830] font-heading text-xs font-extrabold transition-colors align-baseline`}
          >
            [{num}]
          </button>
        );
      }
      return null;
    }

    const paperMatch = part.match(/^\[([A-Z0-9]{2,8})\]$/);
    if (paperMatch) {
      const code = paperMatch[1];
      const lit = LITERATURE_DATABASE[code];
      if (lit) {
        return (
          <span
            key={key}
            title={`${lit.code} (${lit.year}): ${lit.citation} | ${lit.keyFindings}`}
            className={`inline-flex items-center justify-center px-1.5 py-0.5 ${
              afterOpenParen ? 'ml-0' : 'ml-1'
            } ${
              followedByPunct ? 'mr-0' : 'mr-1'
            } rounded-[5px] bg-[var(--soft)] border border-[var(--line)] text-[var(--cyan-dark)] font-heading text-xs font-bold align-baseline cursor-help`}
          >
            [{code}]
          </span>
        );
      }
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const inner = part.slice(2, -2).replace(/\*/g, '');
      return (
        <strong
          key={key}
          className="font-heading font-semibold text-[var(--ink)]"
        >
          {renderInlineTokens(inner, citations, onOpenEvidence, `${key}-b`)}
        </strong>
      );
    }

    const cleanPlain = part.replace(/\*/g, '');
    return <span key={key}>{cleanPlain}</span>;
  });
}

function detectSectionHeading(trimmed: string): string | null {
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
    /^\*{0,2}((?:Fakta|Penyebab|Temuan|Dugaan Awal|Langkah Rekomendasi|Rekomendasi Tindakan|Acuan Literatur|Ringkasan|Kesimpulan|Catatan Penting)[^:\n]{0,55}):\*{0,2}$/i
  );
  if (plainSection) {
    return plainSection[1].replace(/\*/g, '').trim();
  }
  return null;
}

function getSectionAccentColor(title: string): string {
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
}

function renderAnswerWithCitations(
  text: string,
  citations: CitationItemWithHybrid[],
  onOpenEvidence: (citation: CitationItem) => void
) {
  const normalizedText = normalizeAnswerText(text, citations);
  const lines = normalizedText.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed || /^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      i += 1;
      continue;
    }

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
                      {renderInlineTokens(cell, citations, onOpenEvidence, `th-${i}-${cIdx}`)}
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
                          onOpenEvidence,
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
            {renderInlineTokens(sectionTitle, citations, onOpenEvidence, `sec-${i}`)}
          </h3>
        </div>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s?/, '');
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="my-1.5 pl-3.5 py-2 pr-3 border-l-[3.5px] border-[var(--cyan)] bg-[var(--soft)] rounded-r-xl text-[15px] leading-[1.68] text-[var(--ink)] font-medium m-0"
        >
          {renderInlineTokens(quoteText, citations, onOpenEvidence, `bq-${i}`)}
        </blockquote>
      );
      i += 1;
      continue;
    }

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
            {renderInlineTokens(itemContent, citations, onOpenEvidence, `ol-${i}`)}
          </div>
        </div>
      );
      i += 1;
      continue;
    }

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
            {renderInlineTokens(itemContent, citations, onOpenEvidence, `ul-${i}`)}
          </div>
        </div>
      );
      i += 1;
      continue;
    }

    elements.push(
      <p
        key={`p-${i}`}
        className="text-[15px] leading-[1.7] text-[var(--ink)] font-normal m-0"
      >
        {renderInlineTokens(trimmed, citations, onOpenEvidence, `p-${i}`)}
      </p>
    );
    i += 1;
  }

  return elements;
}

const ChatMessageBubble = React.memo(function ChatMessageBubble({
  msg,
  onOpenEvidence,
}: {
  msg: ChatMessageItem;
  onOpenEvidence: (citation: CitationItem) => void;
}) {
  return (
    <div className="space-y-3">
      {msg.role === 'user' ? (
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
        <div className="space-y-4">
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

          <article className="surface-card p-6 rounded-3xl space-y-4">
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

            <div className="space-y-2.5">
              {renderAnswerWithCitations(
                msg.content,
                msg.citations || [],
                onOpenEvidence
              )}
            </div>

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
                      className="p-4 rounded-2xl bg-[var(--soft)] hover:bg-[var(--hover-bg)] cursor-pointer transition-colors flex flex-col justify-between gap-3 group"
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

                        {cit.literatureRefs && cit.literatureRefs.length > 0 && (
                          <div className="text-xs font-heading font-bold text-[var(--cyan-dark)]">
                            Rujukan Literatur: {cit.literatureRefs.join(', ')}
                          </div>
                        )}
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
  );
});

export const TanyaSynqraView: React.FC<TanyaSynqraViewProps> = ({
  assets,
  reports,
  evidences,
  onOpenEvidence,
  onQueryCompleted,
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [question, setQuestion] = useState('');
  const [assetFilter, setAssetFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assetSelectGroups = useMemo(
    () =>
      EQUIPMENT_CATEGORIES.map((cat) => ({
        code: cat.code,
        label: cat.label,
        items: assets.filter((a) => a.categoryCode === cat.code),
      })),
    [assets]
  );

  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages.length, isLoading]);

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

    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Pangkas URL base64/blob besar agar payload request tetap ringan
    const lightweightReports = reports.map((r) => ({
      id: r.id,
      title: r.title,
      asset_id: r.asset_id,
      status: r.status,
      identitas_alat: r.identitas_alat,
      gejala: r.gejala,
      kondisi_operasi: r.kondisi_operasi,
      praduga_penyebab: r.praduga_penyebab,
      usulan_tindakan: r.usulan_tindakan,
      evidence_note: r.evidence_note,
      verified_by: r.verified_by,
      literature_refs: r.literature_refs,
      image_url:
        r.image_url && !r.image_url.startsWith('data:') && !r.image_url.startsWith('blob:')
          ? r.image_url
          : undefined,
    }));

    const lightweightEvidences = evidences.map((e) => ({
      id: e.id,
      report_id: e.report_id,
      file_name: e.file_name,
      storage_path: e.storage_path,
      source_attribution: e.source_attribution,
      license_label: e.license_label,
      public_url:
        e.public_url && !e.public_url.startsWith('data:') && !e.public_url.startsWith('blob:')
          ? e.public_url
          : undefined,
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
          customReports: lightweightReports,
          customEvidences: lightweightEvidences,
          history: historyPayload,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal mencari pengetahuan.');
      }

      const rawCitations: CitationItemWithHybrid[] = Array.isArray(json.citations)
        ? json.citations
        : [];
      const hydratedCitations = rawCitations.map((cit) => {
        if (cit.evidenceUrl) return cit;
        const localEv = evidences.find((e) => e.report_id === cit.reportId && e.public_url);
        const localRep = reports.find((r) => r.id === cit.reportId && r.image_url);
        return {
          ...cit,
          evidenceUrl: localEv?.public_url || localRep?.image_url || cit.evidenceUrl,
        };
      });

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
        citations: hydratedCitations,
        detectedAsset: json.detectedAsset,
        verifiedCount: json.verifiedCount,
        hasUnverified: json.hasUnverified,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      onQueryCompleted?.(trimmed);
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
            <ChatMessageBubble
              key={msg.id}
              msg={msg}
              onOpenEvidence={onOpenEvidence}
            />
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
            className="px-4 py-3 rounded-full border border-[var(--line-soft)] bg-[var(--surface)] text-[var(--ink)] font-heading text-sm font-bold focus:outline-none focus:border-[var(--cyan)] max-w-[260px]"
          >
            <option value="ALL">Semua Aset ({assets.length})</option>
            {assetSelectGroups.map((cat) => (
              <optgroup key={cat.code} label={cat.label}>
                {cat.items.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} · {a.name}
                  </option>
                ))}
              </optgroup>
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
