import { NextRequest, NextResponse } from 'next/server';
import { CitationItem, Evidence, Report } from '@/types/synqra';
import { INITIAL_ASSETS, INITIAL_EVIDENCES, INITIAL_REPORTS } from '@/lib/constants';
import {
  CDU11_ENGINEERING_BRIEF,
  CDU11_SYSTEMIC_PATTERNS,
  findRelevantLiterature,
} from '@/lib/cduBalonganKnowledge';
import {
  formatGeminiError,
  GEMINI_MODEL_FALLBACKS,
  getGenAI,
  isInvalidKeyError,
  matchCdu11AssetTag,
  stripForbiddenDashes,
  withGeminiTimeout,
} from '@/lib/gemini';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

export const maxDuration = 60;

export interface TanyaHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface CitationItemWithHybrid extends CitationItem {
  matchReasons: string[];
  relevanceScore: number;
}

interface TanyaRequestBody {
  question?: string;
  assetFilter?: string;
  customReports?: Report[];
  customEvidences?: Evidence[];
  history?: TanyaHistoryItem[];
}

function sanitizeTanyaAnswer(raw: string): string {
  const lines = stripForbiddenDashes(raw).replace(/\r\n/g, '\n').split('\n');
  const cleanedLines: string[] = [];

  for (const originalLine of lines) {
    let line = originalLine.trimEnd();
    const trimmed = line.trim();

    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      cleanedLines.push('');
      continue;
    }

    const headingMatch = trimmed.match(/^#{1,6}\s+(.+?)(?:\s+#+)?$/);
    if (headingMatch) {
      let headingText = headingMatch[1]
        .replace(/^\*{1,3}(.+?)\*{1,3}$/, '$1')
        .replace(/^\d+\.\s+/, '')
        .trim();
      if (!headingText.endsWith(':')) {
        headingText = `${headingText}:`;
      }
      cleanedLines.push(`@@SECTION@@${headingText}`);
      continue;
    }

    let listPrefix = '';
    const bulletMatch = line.match(/^(\s*)[-*•]\s+(.+)$/);
    if (bulletMatch) {
      listPrefix = `${bulletMatch[1]}• `;
      line = bulletMatch[2];
    }

    line = line.replace(/\*\*([^*]+?)\*([^*\n]+?)\*([^*]*?)\*\*/g, '**$1$2$3**');
    line = line.replace(/(^|[^\w*])\*([^*\n]+?)\*(?!\*)/g, '$1$2');
    line = line.replace(/(^|\s|\()_([^_\n]+?)_(?=$|[\s.,;:!?)])/g, '$1$2');
    line = line.replace(/`([^`\n]+)`/g, '$1');

    line = line.replace(
      /\[(\d+(?:\s*[,;]\s*\d+)+)\]/g,
      (_m, nums: string) =>
        nums
          .split(/\s*[,;]\s*/)
          .map((n) => `[${n.trim()}]`)
          .join(' ')
    );
    line = line.replace(/(\[\d+\])\s+([.,;:!?])/g, '$1$2');

    cleanedLines.push(`${listPrefix}${line}`);
  }

  return cleanedLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TanyaRequestBody;
    const question = body.question?.trim() || '';

    if (!question) {
      return NextResponse.json(
        { error: 'Pertanyaan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history: TanyaHistoryItem[] = rawHistory
      .filter(
        (h) =>
          h &&
          (h.role === 'user' || h.role === 'assistant') &&
          typeof h.content === 'string' &&
          h.content.trim().length > 0
      )
      .slice(-6);

    let allReports: Report[] = body.customReports?.length
      ? body.customReports
      : INITIAL_REPORTS;
    let allEvidences: Evidence[] = body.customEvidences?.length
      ? body.customEvidences
      : INITIAL_EVIDENCES;

    if (isSupabaseConfigured && supabase && !body.customReports?.length) {
      const [repRes, evRes] = await Promise.all([
        supabase.from('reports').select('*'),
        supabase.from('evidences').select('*'),
      ]);
      if (!repRes.error && repRes.data?.length) {
        allReports = repRes.data as Report[];
      }
      if (!evRes.error && evRes.data?.length) {
        allEvidences = evRes.data as Evidence[];
      }
    }

    const qLower = question.toLowerCase();
    const historyLower = history.map((m) => m.content).join(' ').toLowerCase();
    const fullSearchContext = `${historyLower} ${qLower}`;

    // Deteksi dinamis dari 66 kode tag + sinonim seksi Unit 11 CDU Balongan
    const explicitFilter =
      body.assetFilter && body.assetFilter !== 'ALL' ? body.assetFilter : null;
    const detectedAsset =
      explicitFilter ||
      matchCdu11AssetTag(question, INITIAL_ASSETS)?.id ||
      matchCdu11AssetTag(fullSearchContext, INITIAL_ASSETS)?.id ||
      null;

    // Deteksi pola sistemik lintas-aset yang relevan dengan pertanyaan
    const matchedPatterns = CDU11_SYSTEMIC_PATTERNS.filter((p) => {
      const blob = `${p.title} ${p.mechanismSummary} ${p.affectedTags.join(' ')}`.toLowerCase();
      if (detectedAsset && p.affectedTags.includes(detectedAsset)) return true;
      const qWords = qLower.split(/\s+/).filter((w) => w.length >= 4);
      return qWords.some((w) => blob.includes(w));
    });
    const patternCaseBoostIds = new Set(
      matchedPatterns.flatMap((p) => p.relatedCaseIds)
    );
    const patternTagBoostIds = new Set(
      matchedPatterns.flatMap((p) => p.affectedTags)
    );

    const keywords = qLower
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    const scored = allReports
      .map((r) => {
        let score = 0;
        const matchReasons: string[] = [];

        const rTitle = (r.title || '').toLowerCase();
        const rGejala = (r.gejala || '').toLowerCase();
        const rPenyebab = (r.praduga_penyebab || '').toLowerCase();
        const rKondisi = (r.kondisi_operasi || '').toLowerCase();
        const rTindakan = (r.usulan_tindakan || '').toLowerCase();
        const rDesc = (r.description || '').toLowerCase();
        const rLit = (r.literature_refs || []).join(' ').toLowerCase();
        const searchable = `${r.id} ${r.asset_id} ${r.identitas_alat} ${rTitle} ${rGejala} ${rKondisi} ${rPenyebab} ${rTindakan} ${rDesc} ${rLit}`;

        if (explicitFilter && r.asset_id !== explicitFilter) {
          score -= 40;
        } else if (detectedAsset && r.asset_id === detectedAsset) {
          score += 55;
          matchReasons.push(`Konteks Aset ${r.asset_id}`);
        } else if (patternCaseBoostIds.has(r.id) || patternTagBoostIds.has(r.asset_id)) {
          score += 24;
          matchReasons.push('Pola Lintas-Aset Unit 11');
        }

        let symptomHit = false;
        let causeHit = false;
        let actionHit = false;
        let genericHit = false;

        for (const kw of keywords) {
          if (searchable.includes(kw)) {
            score += 13;
            if (rGejala.includes(kw)) symptomHit = true;
            else if (rPenyebab.includes(kw)) causeHit = true;
            else if (rTindakan.includes(kw)) actionHit = true;
            else genericHit = true;
          }
        }

        if (symptomHit) matchReasons.push('Kecocokan Gejala');
        if (causeHit) matchReasons.push('Korelasi Penyebab');
        if (actionHit) matchReasons.push('Kecocokan Tindakan');
        if (!symptomHit && !causeHit && !actionHit && genericHit) {
          matchReasons.push('Kesesuaian Kata Kunci');
        }

        // Prioritas Status Kasus: VERIFIED selalu diutamakan (+45)
        if (r.status === 'VERIFIED') {
          score += 45;
          matchReasons.push('Status Terverifikasi');
        } else if (r.status === 'INVESTIGATION') {
          score += 18;
          matchReasons.push('Status Investigasi');
        } else if (r.status === 'TRIAGE') {
          score += 10;
          matchReasons.push('Status Triage');
        } else if (r.status === 'PRADUGA') {
          matchReasons.push('Status Praduga Awal');
        }

        if (allEvidences.some((e) => e.report_id === r.id)) {
          score += 8;
        }

        if (matchReasons.length === 0) {
          matchReasons.push('Katalog Kasus Unit 11');
        }

        return { report: r, score, matchReasons };
      })
      .sort((a, b) => b.score - a.score);

    const topMatches = scored.slice(0, 5);

    // Aturan Keras GEMINI.md: Kasus VERIFIED wajib berada di urutan teratas sitasi [1], [2]...
    topMatches.sort((a, b) => {
      const rank: Record<string, number> = {
        VERIFIED: 3,
        INVESTIGATION: 2,
        TRIAGE: 1,
        PRADUGA: 0,
      };
      const rankDiff = (rank[b.report.status] ?? 0) - (rank[a.report.status] ?? 0);
      if (rankDiff !== 0) return rankDiff;
      return b.score - a.score;
    });

    const citations: CitationItemWithHybrid[] = topMatches.map((item, idx) => {
      const r = item.report;
      const ev = allEvidences.find((e) => e.report_id === r.id);
      return {
        index: idx + 1,
        reportId: r.id,
        status: r.status,
        assetId: r.asset_id,
        title: r.title,
        evidenceName:
          ev?.file_name || r.evidence_note || 'Catatan investigasi lapangan',
        evidenceUrl: ev?.public_url || r.image_url,
        gejala: r.gejala,
        praduga_penyebab: r.praduga_penyebab,
        usulan_tindakan: r.usulan_tindakan,
        verifiedBy: r.verified_by,
        literatureRefs: r.literature_refs,
        sourceAttribution: ev?.source_attribution
          ? `${ev.source_attribution}${ev.license_label ? ` (${ev.license_label})` : ''}`
          : undefined,
        matchReasons: item.matchReasons,
        relevanceScore: Math.max(0, item.score),
      };
    });

    const citedLitCodes = Array.from(
      new Set(citations.flatMap((c) => c.literatureRefs || []))
    );
    const relevantLiterature = findRelevantLiterature(
      `${question} ${detectedAsset || ''} ${citations.map((c) => c.assetId).join(' ')}`,
      citedLitCodes
    );

    const verifiedCount = citations.filter((c) => c.status === 'VERIFIED').length;
    const hasUnverified = citations.some((c) => c.status !== 'VERIFIED');

    let aiAnswer = '';
    let engine: 'gemini-live' | 'local-fallback' = 'local-fallback';
    let errorReason: string | undefined = undefined;

    const ai = getGenAI();
    if (ai) {
      const contextText = citations
        .map(
          (c) =>
            `[${c.index}] ${c.reportId} | Aset: ${c.assetId} | Status: ${c.status}\n` +
            `Judul: ${c.title}\n` +
            `Gejala: ${c.gejala}\n` +
            `Penyebab: ${c.praduga_penyebab}\n` +
            `Tindakan: ${c.usulan_tindakan}\n` +
            `Bukti: ${c.evidenceName}${c.literatureRefs?.length ? ` | Sumber Ilmiah: ${c.literatureRefs.join(', ')}` : ''}`
        )
        .join('\n\n');

      const litContext = relevantLiterature.length
        ? `\nREFERENSI PAPER & JURNAL ILMIAH UNIT 11 CDU BALONGAN:\n` +
          relevantLiterature
            .map((l) => `- [${l.code}] ${l.citation} -> Temuan: ${l.keyFindings}`)
            .join('\n')
        : '';

      const patternContext = matchedPatterns.length
        ? `\nPOLA KETERKAITAN LINTAS-ASET TERKAIT:\n` +
          matchedPatterns
            .slice(0, 2)
            .map((p) => `- ${p.title} (${p.affectedTags.join(', ')}): ${p.mechanismSummary}`)
            .join('\n')
        : '';

      const historyPrompt =
        history.length > 0
          ? `\nRIWAYAT PERCAKAPAN SEBELUMNYA (Maksimal 6 pesan terakhir):\n` +
            history
              .map(
                (m) =>
                  `${m.role === 'user' ? 'Pengguna' : 'Asisten SYNQRA'}: ${m.content}`
              )
              .join('\n') +
            '\n'
          : '';

      const systemInstruction = `Anda adalah asisten teknis SYNQRA (Intelligence, Connected by Evidence) pada Unit 11 (CDU - Crude Distillation Unit) PT Pertamina RU VI Balongan.
Jawab pertanyaan pengguna HANYA berdasarkan konteks kasus & literatur ilmiah Unit 11 CDU Balongan yang diberikan dalam Bahasa Indonesia yang ringkas, jelas, dan langsung dapat ditindaklanjuti teknisi lapangan.

ATURAN KERAS (WAJIB DIPATUHI):
1. WAJIB sertakan nomor sitasi tunggal [1], [2], dst. tepat sebelum tanda titik kalimat pada setiap klaim penyebab atau rekomendasi teknis (contoh: "...karena coking internal [1]."). Jangan gabungkan angka di satu kurung (tulis [1] [2], bukan [1, 2]).
2. Bila mengutip referensi ilmiah (seperti PE25, AL24, MB17, PN25, ST25, ZH23, CI24, SH23, KO25), sebutkan kodenya secara eksplisit.
3. Dahulukan referensi berstatus VERIFIED sebagai fakta resmi.
4. Jika mengutip kasus berstatus PRADUGA/TRIAGE/INVESTIGATION, letakkan di bagian terpisah dan nyatakan eksplisit bahwa temuan itu masih dugaan awal/investigasi yang belum disahkan pakar.
5. Dilarang mengarang ID kasus atau data di luar konteks; gunakan tanda hubung biasa (-) dan hindari em-dash.

ATURAN FORMAT & TIPOGRAFI (WAJIB DIPATUHI):
- DILARANG menggunakan simbol pagar (#, ##, ###), garis pemisah (---), backtick (\`), atau tanda bintang miring (*kata*) maupun garis bawah (_kata_) untuk istilah Inggris. Tulis istilah teknis secara normal tanpa tanda bintang (contoh: flooding, fouling, mechanical seal, smart positioner).
- Susun jawaban sederhana dan padat dalam maksimal 4 blok berikut:
  1) Pembuka 1-2 kalimat ringkas yang langsung menjawab inti pertanyaan.
  2) Baris judul polos: Fakta Terverifikasi:
     Diikuti daftar bernomor (1., 2.) dengan format: 1. **Judul Singkat:** Penjelasan inti 1-2 kalimat padat [1].
  3) (Hanya bila ada rujukan non-VERIFIED yang relevan) Baris judul polos: Dugaan Awal (Belum Disahkan Pakar):
     Diikuti poin ringkas (1 kalimat) yang menegaskan status praduga/investigasi [4].
  4) Baris judul polos: Langkah Rekomendasi:
     Diikuti 2-3 langkah praktis bernomor (1., 2.) langsung ke tindakan lapangan [1].`;

      const userPrompt = `${CDU11_ENGINEERING_BRIEF}

KONTEKS KASUS KNOWLEDGE BASE (URUT STATUS VERIFIED TERATAS):
${contextText}
${patternContext}
${litContext}
${historyPrompt}
PERTANYAAN PENGGUNA TERBARU:
${question}`;

      const errors: string[] = [];

      for (const modelName of GEMINI_MODEL_FALLBACKS) {
        try {
          const interaction = await withGeminiTimeout(
            ai.interactions.create({
              model: modelName,
              input: userPrompt,
              system_instruction: systemInstruction,
              generation_config: {
                thinking_level: 'low',
              },
              store: false,
            }),
            9500,
            modelName
          );

          const text = interaction.output_text?.trim() || '';
          if (text.length > 0) {
            aiAnswer = sanitizeTanyaAnswer(text);
            engine = 'gemini-live';
            errorReason = undefined;
            break;
          }
          errors.push(`[${modelName}] Respons teks kosong.`);
        } catch (err) {
          const formatted = formatGeminiError(err);
          errors.push(`[${modelName}] ${formatted}`);
          console.warn(`Gemini Tanya SYNQRA fallback (${modelName}):`, formatted);
          if (isInvalidKeyError(formatted)) {
            break;
          }
        }
      }

      if (!aiAnswer && errors.length > 0) {
        errorReason = errors[0];
      }
    } else {
      errorReason = 'GEMINI_API_KEY belum dikonfigurasi di environment.';
    }

    // Fallback lokal deterministik berbasis Kasus + Literatur Ilmiah Balongan
    if (!aiAnswer) {
      const verifiedCits = citations.filter((c) => c.status === 'VERIFIED');
      const unverifiedCits = citations.filter((c) => c.status !== 'VERIFIED');
      const parts: string[] = [];

      if (verifiedCits.length > 0) {
        parts.push(
          `Ringkasan temuan arsip Knowledge Base SYNQRA Unit 11 CDU Balongan yang paling relevan:`
        );
        parts.push(
          `Fakta Terverifikasi:\n` +
            verifiedCits
              .map(
                (c, i) =>
                  `${i + 1}. **${c.title} (${c.assetId}):** ${c.praduga_penyebab} [${c.index}].`
              )
              .join('\n')
        );
      }

      if (unverifiedCits.length > 0) {
        parts.push(
          `Dugaan Awal (Belum Disahkan Pakar):\n` +
            unverifiedCits
              .map(
                (c) =>
                  `• **${c.title} (${c.assetId}, status ${c.status}):** Indikasi awal mengarah pada ${c.praduga_penyebab} dan belum disahkan pakar [${c.index}].`
              )
              .join('\n')
        );
      }

      if (relevantLiterature.length > 0) {
        parts.push(
          `Acuan Literatur Unit 11 CDU:\n` +
            relevantLiterature
              .slice(0, 3)
              .map((lit) => `• **${lit.code} (${lit.category}):** ${lit.keyFindings}`)
              .join('\n')
        );
      }

      if (citations.length > 0) {
        parts.push(
          `Langkah Rekomendasi:\n` +
            citations
              .slice(0, 3)
              .map((c, i) => `${i + 1}. ${c.usulan_tindakan} [${c.index}].`)
              .join('\n')
        );
      }

      if (parts.length === 0) {
        parts.push(
          'Tidak ditemukan arsip kasus yang relevan dengan pertanyaan ini di basis pengetahuan SYNQRA.'
        );
      }

      aiAnswer = sanitizeTanyaAnswer(parts.join('\n\n'));
    }

    return NextResponse.json({
      success: true,
      answer: aiAnswer,
      engine,
      errorReason,
      citations,
      detectedAsset,
      verifiedCount,
      hasUnverified,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? stripForbiddenDashes(err.message)
        : 'Gagal memproses pencarian Tanya SYNQRA.';
    console.error('Error in /api/tanya-synqra:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
