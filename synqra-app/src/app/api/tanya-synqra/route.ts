import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CitationItem, Evidence, Report } from '@/types/synqra';
import { INITIAL_ASSETS, INITIAL_EVIDENCES, INITIAL_REPORTS } from '@/lib/constants';
import {
  CDU11_ENGINEERING_BRIEF,
  CDU11_SYSTEMIC_PATTERNS,
  findRelevantLiterature,
} from '@/lib/cduBalonganKnowledge';
import { GEMINI_MODEL_FALLBACKS, matchCdu11AssetTag, withGeminiTimeout } from '@/lib/gemini';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

const apiKey =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

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

function stripForbiddenDashes(text: string): string {
  return text.replace(/[\u2013\u2014]/g, '-').trim();
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

    if (genAI) {
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

      const prompt = `Anda adalah asisten teknis SYNQRA pada Unit 11 (CDU - Crude Distillation Unit) PT Pertamina RU VI Balongan.
Jawab pertanyaan pengguna dalam Bahasa Indonesia teknis yang terstruktur, ringkas, dan jelas berdasarkan kasus Knowledge Base serta literatur ilmiah di bawah ini.

ATURAN KERAS (WAJIB DIPATUHI):
1. WAJIB sertakan nomor sitasi kasus [1], [2], dst. pada setiap klaim atau rekomendasi dari kasus lapangan.
2. Bila mengutip referensi ilmiah (seperti PE25, AL24, MB17, PN25, ST25, ZH23, CI24, SH23, KO25), sebutkan kodenya secara eksplisit.
3. Dahulukan referensi berstatus VERIFIED sebagai fakta resmi terverifikasi pakar.
4. Jika mengutip kasus berstatus PRADUGA / TRIAGE / INVESTIGATION, nyatakan eksplisit bahwa statusnya masih praduga/investigasi berjalan dan belum disahkan pakar.
5. Dilarang mengarang ID kasus di luar konteks yang diberikan; gunakan tanda hubung biasa (-) dan hindari em-dash.
${historyPrompt}
${CDU11_ENGINEERING_BRIEF}

KONTEKS KASUS KNOWLEDGE BASE (URUT STATUS VERIFIED TERATAS):
${contextText}
${patternContext}
${litContext}

PERTANYAAN PENGGUNA TERBARU:
${question}`;

      for (const modelName of GEMINI_MODEL_FALLBACKS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 900,
            },
          });

          const res = await withGeminiTimeout(
            model.generateContent(prompt),
            9500,
            modelName
          );
          const text = stripForbiddenDashes(res.response.text());
          if (text && text.length > 0) {
            aiAnswer = text;
            engine = 'gemini-live';
            errorReason = undefined;
            break;
          }
          errorReason = 'Gemini tidak mengembalikan respons teks.';
        } catch (err) {
          console.warn(`Gemini Tanya SYNQRA fallback (${modelName}):`, err);
          errorReason =
            err instanceof Error ? stripForbiddenDashes(err.message) : 'Gagal menghubungi Gemini API.';
        }
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
          `Berdasarkan arsip Knowledge Base terverifikasi pakar Unit 11 CDU RU VI Balongan:\n` +
            verifiedCits
              .map(
                (c) =>
                  `• **${c.title}** (${c.assetId}) [${c.index}]: Gejala "${c.gejala}". Penyebab terverifikasi: ${c.praduga_penyebab}. Tindakan: ${c.usulan_tindakan} [${c.index}].`
              )
              .join('\n')
        );
      }

      if (unverifiedCits.length > 0) {
        parts.push(
          `Sebagai referensi kasus aktif (masih berstatus **PRADUGA / dalam investigasi** dan belum disahkan pakar):\n` +
            unverifiedCits
              .map(
                (c) =>
                  `• **${c.title}** (${c.assetId} · ${c.status}) [${c.index}]: Dugaan awal mengarah pada ${c.praduga_penyebab}. Rencana tindak lanjut: ${c.usulan_tindakan} [${c.index}].`
              )
              .join('\n')
        );
      }

      if (relevantLiterature.length > 0) {
        parts.push(
          `Acuan literatur ilmiah terkait Unit 11 CDU Balongan:\n` +
            relevantLiterature
              .slice(0, 3)
              .map((lit) => `• **${lit.code}** (${lit.category}): ${lit.keyFindings}`)
              .join('\n')
        );
      }

      if (parts.length === 0) {
        parts.push(
          'Tidak ditemukan arsip kasus yang relevan dengan pertanyaan ini di basis pengetahuan SYNQRA.'
        );
      }

      aiAnswer = stripForbiddenDashes(parts.join('\n\n'));
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
