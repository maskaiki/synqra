import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CitationItem, Evidence, Report } from '@/types/synqra';
import { INITIAL_EVIDENCES, INITIAL_REPORTS } from '@/lib/constants';
import { GEMINI_MODEL } from '@/lib/gemini';
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

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: GEMINI_MODEL,
          generationConfig: { temperature: 0.2 },
        });

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

        const prompt = `Anda adalah asisten teknis SYNQRA (Intelligence, Connected by Evidence) untuk industri migas dan petrokimia.
Jawab pertanyaan pengguna HANYA berdasarkan konteks kasus di bawah ini dalam Bahasa Indonesia yang ringkas, terstruktur, dan jelas.

ATURAN KERAS (WAJIB DIPATUHI):
1. WAJIB sertakan nomor sitasi [1], [2], dst. di setiap klaim penyebab atau rekomendasi teknis.
2. Dahulukan referensi berstatus VERIFIED sebagai fakta resmi.
3. Jika mengutip kasus berstatus PRADUGA/TRIAGE/INVESTIGATION, sebutkan secara eksplisit bahwa itu masih dugaan awal yang belum disahkan pakar.
4. Dilarang mengarang data atau kesimpulan di luar konteks yang diberikan.
5. Jika ada RIWAYAT PERCAKAPAN SEBELUMNYA, pahami konteks pertanyaan lanjutan dan berikan jawaban yang koheren.

KONTEKS KASUS KNOWLEDGE BASE:
${contextText}
${historyPrompt}
PERTANYAAN PENGGUNA TERBARU:
${question}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text();
        if (text && text.trim().length > 0) {
          aiAnswer = text.trim();
          engine = 'gemini-live';
        } else {
          errorReason = 'Gemini tidak mengembalikan respons teks.';
        }
      } catch (err) {
        console.warn('Gemini Tanya SYNQRA fallback triggered:', err);
        errorReason =
          err instanceof Error ? err.message : 'Gagal menghubungi Gemini API.';
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
          `Berdasarkan arsip Knowledge Base terverifikasi pakar, temuan yang paling relevan adalah:\n` +
            verifiedCits
              .map(
                (c) =>
                  `• **${c.title}** (${c.assetId}) [${c.index}]: Gejala "${c.gejala}". Penyebab terverifikasi: ${c.praduga_penyebab}. Tindakan rekomendasi: ${c.usulan_tindakan} [${c.index}].`
              )
              .join('\n')
        );
      }

      if (unverifiedCits.length > 0) {
        parts.push(
          `Sebagai referensi tambahan (masih berstatus **PRADUGA / dalam pemeriksaan** dan belum disahkan pakar):\n` +
            unverifiedCits
              .map(
                (c) =>
                  `• **${c.title}** (${c.assetId} · ${c.status}) [${c.index}]: Indikasi awal mengarah pada ${c.praduga_penyebab}. Usulan pemeriksaan: ${c.usulan_tindakan} [${c.index}].`
              )
              .join('\n')
        );
      }

      if (parts.length === 0) {
        parts.push(
          'Tidak ditemukan arsip kasus yang relevan dengan pertanyaan ini di basis pengetahuan SYNQRA.'
        );
      }

      aiAnswer = parts.join('\n\n');
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
