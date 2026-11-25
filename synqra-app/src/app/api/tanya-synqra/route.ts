import { NextRequest, NextResponse } from 'next/server';
import { CitationItem, Evidence, Report } from '@/types/synqra';
import { INITIAL_EVIDENCES, INITIAL_REPORTS } from '@/lib/constants';
import {
  formatGeminiError,
  GEMINI_MODEL_FALLBACKS,
  getGenAI,
  isInvalidKeyError,
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
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const cleanedLines: string[] = [];

  for (const originalLine of lines) {
    let line = originalLine.trimEnd();
    const trimmed = line.trim();

    // Hapus garis pemisah horizontal mentah (---, ***, ___)
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      cleanedLines.push('');
      continue;
    }

    // Ubah heading markdown (### Judul) menjadi baris label bersih tanpa tanda #
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

    // Pertahankan bullet list (* item atau - item) tanpa merusak tanda bintang bullet
    let listPrefix = '';
    const bulletMatch = line.match(/^(\s*)[-*•]\s+(.+)$/);
    if (bulletMatch) {
      listPrefix = `${bulletMatch[1]}• `;
      line = bulletMatch[2];
    }

    // Lepas tanda miring *kata* di dalam **bold** (contoh: **Pengerasan (*Static Friction*)** -> **Pengerasan (Static Friction)**)
    line = line.replace(/\*\*([^*]+?)\*([^*\n]+?)\*([^*]*?)\*\*/g, '**$1$2$3**');

    // Lepas tanda miring single-asterisk (*stroke*, *gland stem*, *(Catatan:...)*) agar bersih tanpa simbol *
    line = line.replace(/(^|[^\w*])\*([^*\n]+?)\*(?!\*)/g, '$1$2');

    // Lepas tanda miring underscore (_kata_) namun jaga snake_case
    line = line.replace(/(^|\s|\()_([^_\n]+?)_(?=$|[\s.,;:!?)])/g, '$1$2');

    // Lepas backtick kode sederhana (`FCV-301` -> FCV-301)
    line = line.replace(/`([^`\n]+)`/g, '$1');

    // Perbaiki multi-sitasi [1, 2] -> [1] [2] dan spasi menggantung sebelum tanda baca [2] . -> [2].
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

    // Ambil maksimal 6 pesan riwayat percakapan terakhir
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

    // Deteksi konteks aset dari filter, pertanyaan saat ini, atau riwayat pesan
    const detectedAsset =
      body.assetFilter && body.assetFilter !== 'ALL'
        ? body.assetFilter
        : qLower.includes('p-101') ||
            qLower.includes('pompa') ||
            qLower.includes('seal') ||
            qLower.includes('vibrasi')
          ? 'P-101A'
          : qLower.includes('e-201') ||
              qLower.includes('heat') ||
              qLower.includes('exchanger') ||
              qLower.includes('fouling') ||
              qLower.includes('gasket')
            ? 'E-201'
            : qLower.includes('fcv') ||
                qLower.includes('valve') ||
                qLower.includes('katup') ||
                qLower.includes('stroke') ||
                qLower.includes('aktuator')
              ? 'FCV-301'
              : fullSearchContext.includes('p-101') ||
                  fullSearchContext.includes('pompa')
                ? 'P-101A'
                : fullSearchContext.includes('e-201') ||
                    fullSearchContext.includes('heat') ||
                    fullSearchContext.includes('exchanger')
                  ? 'E-201'
                  : fullSearchContext.includes('fcv') ||
                      fullSearchContext.includes('valve')
                    ? 'FCV-301'
                    : null;

    const keywords = qLower
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    // Pembobotan hibrida dan pencatatan alasan kecocokan (matchReasons)
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
        const searchable = `${r.id} ${r.asset_id} ${rTitle} ${rGejala} ${rKondisi} ${rPenyebab} ${rTindakan} ${rDesc}`;

        // 1. Kesesuaian Konteks Aset (Bobot: +35)
        if (detectedAsset && r.asset_id === detectedAsset) {
          score += 35;
          matchReasons.push(`Konteks Aset ${r.asset_id}`);
        }

        // 2. Kecocokan Entitas Kata Kunci (Gejala, Penyebab, Solusi)
        let symptomHit = false;
        let causeHit = false;
        let actionHit = false;
        let genericHit = false;

        for (const kw of keywords) {
          if (searchable.includes(kw)) {
            score += 12;
            if (rGejala.includes(kw)) symptomHit = true;
            else if (rPenyebab.includes(kw)) causeHit = true;
            else if (rTindakan.includes(kw)) actionHit = true;
            else genericHit = true;
          }
        }

        if (symptomHit) matchReasons.push('Kecocokan Gejala');
        if (causeHit) matchReasons.push('Korelasi Penyebab');
        if (actionHit) matchReasons.push('Kecocokan Rekomendasi Tindakan');
        if (!symptomHit && !causeHit && !actionHit && genericHit) {
          matchReasons.push('Kesesuaian Kata Kunci');
        }

        // 3. Prioritas Status Kasus (Kasus Terverifikasi mendapat bobot tertinggi +45)
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

        // 4. Keberadaan Bukti Fisik
        const hasEvidence = allEvidences.some((e) => e.report_id === r.id);
        if (hasEvidence) {
          score += 8;
        }

        if (matchReasons.length === 0) {
          matchReasons.push('Katalog Kasus Terkait');
        }

        return { report: r, score, matchReasons };
      })
      .sort((a, b) => {
        const aRelevant = a.score > 15 ? 1 : 0;
        const bRelevant = b.score > 15 ? 1 : 0;
        if (aRelevant !== bRelevant) return bRelevant - aRelevant;
        return b.score - a.score;
      });

    const topMatches = scored.slice(0, 4);

    // Aturan Keras: Prioritaskan kasus VERIFIED di urutan teratas
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
        matchReasons: item.matchReasons,
        relevanceScore: item.score,
      };
    });

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
            `Bukti: ${c.evidenceName}`
        )
        .join('\n\n');

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

      const systemInstruction = `Anda adalah asisten teknis SYNQRA (Intelligence, Connected by Evidence) untuk industri migas dan petrokimia.
Jawab pertanyaan pengguna HANYA berdasarkan konteks kasus yang diberikan dalam Bahasa Indonesia yang ringkas, sederhana, informatif, dan langsung dapat ditindaklanjuti teknisi lapangan.

ATURAN KERAS (WAJIB DIPATUHI):
1. WAJIB sertakan nomor sitasi tunggal [1], [2], dst. tepat sebelum tanda titik kalimat pada setiap klaim penyebab atau rekomendasi teknis (contoh: "...target bukaan [2]."). Jangan gabungkan angka di satu kurung (tulis [1] [2], bukan [1, 2]).
2. Dahulukan referensi berstatus VERIFIED sebagai fakta resmi.
3. Jika mengutip kasus berstatus PRADUGA/TRIAGE/INVESTIGATION, letakkan di bagian terpisah dan nyatakan secara eksplisit bahwa temuan itu masih dugaan awal yang belum disahkan pakar.
4. Dilarang mengarang data atau kesimpulan di luar konteks yang diberikan.

ATURAN FORMAT & TIPOGRAFI (WAJIB DIPATUHI):
- DILARANG menggunakan simbol pagar (#, ##, ###), garis pemisah (---), backtick (\`), atau tanda bintang miring (*kata*) maupun garis bawah (_kata_) untuk istilah Inggris. Tulis istilah teknis secara normal tanpa tanda bintang (contoh: stroke, gland stem, static friction, packing PTFE, smart positioner).
- Susun jawaban secara sederhana dan padat dalam maksimal 4 blok berikut:
  1) Pembuka 1-2 kalimat ringkas yang langsung menjawab inti pertanyaan.
  2) Baris judul polos: Fakta Terverifikasi:
     Diikuti daftar bernomor (1., 2.) dengan format: 1. **Judul Singkat:** Penjelasan inti 1-2 kalimat padat [1].
  3) (Hanya bila ada rujukan non-VERIFIED yang relevan) Baris judul polos: Dugaan Awal (Belum Disahkan Pakar):
     Diikuti poin ringkas (1 kalimat) yang menegaskan status praduga/triage [4].
  4) Baris judul polos: Langkah Rekomendasi:
     Diikuti 2-3 langkah praktis bernomor (1., 2.) langsung ke tindakan lapangan [1].`;

      const userPrompt = `KONTEKS KASUS KNOWLEDGE BASE:
${contextText}
${historyPrompt}
PERTANYAAN PENGGUNA TERBARU:
${question}`;

      const errors: string[] = [];

      for (const modelName of GEMINI_MODEL_FALLBACKS) {
        try {
          const interaction = await ai.interactions.create({
            model: modelName,
            input: userPrompt,
            system_instruction: systemInstruction,
            generation_config: {
              thinking_level: 'low',
            },
            store: false,
          });

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

    // Fallback lokal deterministik jika Gemini API offline / belum ada key
    if (!aiAnswer) {
      const verifiedCits = citations.filter((c) => c.status === 'VERIFIED');
      const unverifiedCits = citations.filter((c) => c.status !== 'VERIFIED');
      const parts: string[] = [];

      if (verifiedCits.length > 0) {
        parts.push(
          `Ringkasan temuan arsip Knowledge Base SYNQRA yang paling relevan untuk pertanyaan ini:`
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
        ? err.message
        : 'Gagal memproses pencarian Tanya SYNQRA.';
    console.error('Error in /api/tanya-synqra:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
