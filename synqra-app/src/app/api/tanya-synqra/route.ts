import { NextRequest, NextResponse } from 'next/server';
import { CitationItem, Evidence, Report } from '@/types/synqra';
import { INITIAL_ASSETS, INITIAL_EVIDENCES, INITIAL_REPORTS } from '@/lib/constants';
import {
  CDU11_ENGINEERING_BRIEF,
  CDU11_OPERATING_SOP_BRIEF,
  CDU11_SYSTEMIC_PATTERNS,
  LITERATURE_DATABASE,
  LiteratureReference,
  findRelevantLiterature,
  formatAllLiteratureIndex,
} from '@/lib/cduBalonganKnowledge';
import { EVIDENCE_MEDIA_META, resolveBuiltInEvidenceUrl } from '@/lib/mediaAssets';
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

function sanitizeTanyaAnswer(raw: string, maxCitationIndex = 5): string {
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

    // Hapus sitasi angka tidak valid seperti [0] atau indeks melebihi jumlah sitasi
    line = line.replace(/[ \t]*\[(\d+)\]/g, (match, numStr: string) => {
      const n = Number(numStr);
      return n >= 1 && n <= maxCitationIndex ? match : '';
    });

    line = line.replace(/(\[(?:\d+|[A-Z0-9]{2,8})\])[ \t]+([.,;:!?])/g, '$1$2');
    line = line.replace(/[ \t]+([.,;:!?])/g, '$1');

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
    let dbLiteratureRefs: LiteratureReference[] = [];

    if (isSupabaseConfigured && supabase) {
      const fetchPromises: Array<PromiseLike<unknown>> = [
        supabase.from('literature_references').select('*'),
      ];
      if (!body.customReports?.length) {
        fetchPromises.push(
          supabase.from('reports').select('*'),
          supabase.from('evidences').select('*')
        );
      }

      const [litRes, repRes, evRes] = (await Promise.all(fetchPromises)) as [
        { data: Array<Record<string, unknown>> | null; error: unknown },
        { data: Report[] | null; error: unknown } | undefined,
        { data: Evidence[] | null; error: unknown } | undefined,
      ];

      if (!litRes.error && Array.isArray(litRes.data) && litRes.data.length > 0) {
        dbLiteratureRefs = litRes.data
          .filter((row) => typeof row.code === 'string' && typeof row.citation === 'string')
          .map((row) => ({
            code: String(row.code),
            citation: String(row.citation),
            year: Number(row.year) || 2024,
            category: String(row.category || 'Referensi Ilmiah'),
            doiOrUrl: String(row.doi_or_url || ''),
            keyFindings: String(row.key_findings || ''),
            isBalonganSpecific: Boolean(row.is_balongan_specific),
          }));
      }

      if (repRes && !repRes.error && repRes.data?.length) {
        allReports = repRes.data;
      }
      if (evRes && !evRes.error && evRes.data?.length) {
        allEvidences = evRes.data;
      }
    }

    // Gabungkan metadata literature_refs & media built-in dari konstanta agar tidak hilang saat membaca Supabase
    const initialReportMap = new Map(INITIAL_REPORTS.map((r) => [r.id, r]));
    allReports = allReports.map((r) => {
      const base = initialReportMap.get(r.id);
      if (!base) return r;
      return {
        ...r,
        literature_refs: r.literature_refs?.length ? r.literature_refs : base.literature_refs,
        journal_image_ids: r.journal_image_ids?.length ? r.journal_image_ids : base.journal_image_ids,
        fact_vs_scenario_note: r.fact_vs_scenario_note || base.fact_vs_scenario_note,
        required_evidence_hint: r.required_evidence_hint || base.required_evidence_hint,
      };
    });

    allEvidences = allEvidences.map((ev) => {
      const builtInUrl = resolveBuiltInEvidenceUrl(ev);
      const meta = ev.id ? EVIDENCE_MEDIA_META[ev.id] : undefined;
      return {
        ...ev,
        ...(builtInUrl && !ev.public_url ? { public_url: builtInUrl } : {}),
        ...(meta?.attribution && !ev.source_attribution ? { source_attribution: meta.attribution } : {}),
        ...(meta?.license && !ev.license_label ? { license_label: meta.license } : {}),
      };
    });

    const totalAssetsCount = INITIAL_ASSETS.length;
    const totalReportsCount = allReports.length;
    const totalVerifiedAll = allReports.filter((r) => r.status === 'VERIFIED').length;
    const totalInvestigationAll = allReports.filter((r) => r.status === 'INVESTIGATION').length;
    const totalTriageAll = allReports.filter((r) => r.status === 'TRIAGE').length;
    const totalPradugaAll = allReports.filter((r) => r.status === 'PRADUGA').length;
    const totalEvidencesCount = allEvidences.length;
    const totalPapersCount = new Set([
      ...Object.keys(LITERATURE_DATABASE),
      ...dbLiteratureRefs.map((d) => d.code.toUpperCase()),
    ]).size;

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
        ? `\nREFERENSI PAPER & JURNAL PRIORITAS UNTUK KASUS TERKAIT:\n` +
          relevantLiterature
            .map((l) => `- [${l.code}] ${l.citation} -> Temuan: ${l.keyFindings}`)
            .join('\n')
        : '';

      const allPapersCatalog = formatAllLiteratureIndex(dbLiteratureRefs);

      const corpusInventoryContext = `INVENTORI AKTUAL BASIS PENGETAHUAN & KNOWLEDGE GRAPH SYNQRA (REAL-TIME):
- Total Tag Aset Terdaftar (Unit 11 CDU RU VI Balongan): ${totalAssetsCount} tag peralatan.
- Total Seluruh Kasus di Database: ${totalReportsCount} kasus, terdiri dari ${totalVerifiedAll} berstatus VERIFIED, ${totalInvestigationAll} INVESTIGATION, ${totalTriageAll} TRIAGE, dan ${totalPradugaAll} PRADUGA.
- Total Bukti Inspeksi & Telemetri: ${totalEvidencesCount} item bukti.
- Total Paper & Referensi Ilmiah Terindeks: ${totalPapersCount} dokumen (termasuk 6 studi spesifik RU VI Balongan: PE25, AL24, PN25, RDMP22, MB17, YP11).
- Mengapa Sumber Sitasi Bukti di bawah hanya menampilkan ${citations.length} kartu (maksimal 5)? Karena chat Tanya SYNQRA membatasi tampilan kartu Sumber Sitasi Bukti ke 5 kasus paling relevan agar teknisi cepat fokus ke inti penanganan, sementara seluruh ${totalVerifiedAll} kasus VERIFIED dan relasi ${totalAssetsCount} asetnya tampil lengkap pada halaman Knowledge Graph, dan seluruh ${totalReportsCount} kasus dapat dibuka pada halaman Triage & Kasus.`;

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
Jawab pertanyaan pengguna secara jujur, akurat, dan terstruktur HANYA berdasarkan data kasus, inventori Knowledge Graph, panduan SOP Unit 11, dan katalog ${totalPapersCount} paper ilmiah yang diberikan dalam Bahasa Indonesia yang jelas bagi engineer dan teknisi lapangan.

ATURAN KERAS (WAJIB DIPATUHI):
1. Nomor sitasi kasus HANYA bernomor [1] sampai [${citations.length}] sesuai daftar 5 KONTEKS KASUS di bawah. DILARANG keras menulis [0] atau nomor lebih besar dari ${citations.length}.
2. Gunakan [1], [2], dst. HANYA untuk klaim fakta dari kasus spesifik di bawah, letakkan tepat sebelum tanda titik kalimat (contoh: "...karena coking internal [1]."). Jangan gabungkan angka dalam satu kurung (tulis [1] [2], bukan [1, 2]). Untuk informasi yang berasal dari inventori Knowledge Graph atau katalog paper/SOP (bukan kasus [1]..[${citations.length}]), sebutkan kode papernya (misal [PE25] [AL24]) atau angkanya langsung TANPA menempelkan sitasi kasus palsu.
3. Bila mengutip referensi ilmiah, sebutkan kodenya secara eksplisit seperti [PE25], [AL24], [PN25], [RDMP22], [MB17], [YP11], [ST25], [FI25], dll.
4. Dahulukan referensi berstatus VERIFIED sebagai fakta resmi.
5. Jika mengutip kasus berstatus PRADUGA/TRIAGE/INVESTIGATION, letakkan di bagian terpisah dan nyatakan eksplisit bahwa temuan itu masih dugaan awal/investigasi yang belum disahkan pakar.
6. Dilarang mengarang ID kasus, alasan fiktif, atau data di luar konteks; gunakan tanda hubung biasa (-) dan hindari em-dash.

ATURAN FORMAT & TIPOGRAFI (WAJIB DIPATUHI):
- DILARANG menggunakan simbol pagar (#, ##, ###), garis pemisah (---), backtick (\`), atau tanda bintang miring (*kata*) maupun garis bawah (_kata_) untuk istilah Inggris. Tulis istilah teknis secara normal tanpa tanda bintang (contoh: flooding, fouling, mechanical seal, smart positioner).
- Susun jawaban jelas dalam blok berikut (hanya tampilkan blok yang relevan dengan pertanyaan):
  1) Pembuka 1-2 kalimat ringkas yang langsung menjawab inti pertanyaan.
  2) Baris judul polos: Fakta Terverifikasi:
     Diikuti daftar bernomor (1., 2., ...) dengan format: 1. **Judul Singkat:** Penjelasan padat [1]. atau [PE25].
  3) (Hanya bila relevan dan ada rujukan non-VERIFIED) Baris judul polos: Dugaan Awal (Belum Disahkan Pakar):
     Diikuti poin ringkas (1 kalimat) yang menegaskan status praduga/investigasi [4].
  4) Baris judul polos: Langkah Rekomendasi:
     Diikuti 2-3 langkah praktis bernomor (1., 2., ...) langsung ke tindakan lapangan.`;

      const userPrompt = `${CDU11_ENGINEERING_BRIEF}

${corpusInventoryContext}

${CDU11_OPERATING_SOP_BRIEF}

KONTEKS 5 KASUS TERATAS KNOWLEDGE BASE (URUT STATUS VERIFIED TERATAS):
${contextText}
${patternContext}
${litContext}

KATALOG LENGKAP ${totalPapersCount} PAPER & REFERENSI ILMIAH SYNQRA UNIT 11 CDU:
${allPapersCatalog}
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
            aiAnswer = sanitizeTanyaAnswer(text, citations.length);
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

      if (/(kenapa|kok).*(5|lima)|knowledge graph|berapa.*kasus|total.*kasus/i.test(question)) {
        parts.push(
          `Database Unit 11 CDU Balongan memiliki ${totalReportsCount} kasus di ${totalAssetsCount} aset (${totalVerifiedAll} VERIFIED tampil di Knowledge Graph). Chat Tanya SYNQRA menampilkan maksimal 5 Sumber Sitasi Bukti paling relevan agar analisis tetap fokus.`
        );
      } else if (/(sop|prosedur|pengoperasian|parameter|paper|jurnal|referensi)/i.test(question)) {
        parts.push(
          `Ringkasan SOP operasi dan acuan ${totalPapersCount} paper Unit 11 CDU Balongan:`
        );
        parts.push(`Fakta Terverifikasi:\n${CDU11_OPERATING_SOP_BRIEF}`);
      } else if (verifiedCits.length > 0) {
        parts.push(
          `Ringkasan temuan arsip Knowledge Base SYNQRA Unit 11 CDU Balongan yang paling relevan:`
        );
      }

      if (verifiedCits.length > 0 && !parts.some((p) => p.includes('Fakta Terverifikasi:'))) {
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
              .slice(0, 5)
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

      aiAnswer = sanitizeTanyaAnswer(parts.join('\n\n'), citations.length);
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
      corpusStats: {
        totalAssets: totalAssetsCount,
        totalReports: totalReportsCount,
        verifiedReports: totalVerifiedAll,
        totalEvidences: totalEvidencesCount,
        totalPapers: totalPapersCount,
      },
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
