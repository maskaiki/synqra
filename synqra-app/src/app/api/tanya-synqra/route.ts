import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Report } from '@/types/synqra';
import { INITIAL_REPORTS } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface Citation {
  index: number;
  reportId: string;
  status: Report['status'];
  assetId: string;
  title: string;
  evidenceName: string;
  evidenceUrl?: string;
  gejala: string;
  praduga_penyebab: string;
  usulan_tindakan: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, assetFilter, customReports } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Pertanyaan tidak boleh kosong.' }, { status: 400 });
    }

    // 1. Ambil data laporan dari Supabase jika configured, atau gunakan customReports / INITIAL_REPORTS
    let allReports: Report[] = customReports || INITIAL_REPORTS;
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reports').select('*');
      if (!error && data && data.length > 0) {
        allReports = data as Report[];
      }
    }

    // 2. METODE PENCARIAN HIBRIDA (Hybrid Search):
    // - Ekstraksi keyword & deteksi kode aset (P-101A, E-201, FCV-301)
    const qLower = question.toLowerCase();
    const detectedAsset = assetFilter ||
      (qLower.includes('p-101') || qLower.includes('pompa') ? 'P-101A' :
       qLower.includes('e-201') || qLower.includes('heat') || qLower.includes('exchanger') ? 'E-201' :
       qLower.includes('fcv-301') || qLower.includes('valve') || qLower.includes('katup') ? 'FCV-301' : null);

    // Scoring & Ranking:
    // WAJIB ATURAN: Prioritaskan kasus berstatus VERIFIED di paling atas!
    const scoredReports = allReports.map((r) => {
      let score = 0;

      // Filter aset jika ada
      if (detectedAsset && r.asset_id === detectedAsset) score += 30;

      // Cocokkan kata kunci pada teks
      const textCorpus = `${r.title} ${r.identitas_alat} ${r.gejala} ${r.praduga_penyebab} ${r.usulan_tindakan} ${r.kondisi_operasi}`.toLowerCase();
      const keywords = qLower.split(/\s+/).filter((w) => w.length > 3);
      
      keywords.forEach((kw) => {
        if (textCorpus.includes(kw)) score += 10;
      });

      // WAJIB ATURAN: Score booster besar untuk kasus VERIFIED agar berada di posisi teratas
      if (r.status === 'VERIFIED') score += 100;
      else if (r.status === 'INVESTIGATION') score += 40;
      else if (r.status === 'TRIAGE') score += 20;
      else if (r.status === 'PRADUGA') score += 5; // PRADUGA tetap terbawa tapi di bawah

      return { report: r, score };
    });

    // Urutkan berdasarkan score tertinggi
    scoredReports.sort((a, b) => b.score - a.score);
    const topMatches = scoredReports.slice(0, 4).map((item) => item.report);

    // Buat metadata sitasi [1], [2], [3]
    const citations: Citation[] = topMatches.map((r, idx) => ({
      index: idx + 1,
      reportId: r.id,
      status: r.status,
      assetId: r.asset_id,
      title: r.title,
      evidenceName: r.evidence_note || (r.image_url ? 'Dokumentasi Foto Lapangan' : 'Bukti Belum Dilampirkan'),
      evidenceUrl: r.image_url,
      gejala: r.gejala,
      praduga_penyebab: r.praduga_penyebab,
      usulan_tindakan: r.usulan_tindakan,
    }));

    // Cek apakah ada rujukan berstatus PRADUGA untuk menampilkan kotak peringatan kuning
    const hasPradugaWarning = citations.some((c) => c.status === 'PRADUGA');
    const pradugaReports = citations.filter((c) => c.status === 'PRADUGA').map((c) => c.reportId);

    // 3. Sintesis AI dengan Google Gemini API
    let answerText = '';

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            temperature: 0.2,
          },
          systemInstruction: `Anda adalah Tanya SYNQRA, asisten kecerdasan teknik industri Oil & Gas berbasis bukti nyata.
Tugas Anda adalah merangkum data kasus rujukan yang diberikan untuk menjawab pertanyaan teknisi dengan tepat dan profesional.

ATURAN WAJIB DAN KETAT:
1. PRIORITASKAN rujukan berstatus [VERIFIED] sebagai kebenaran teruji standar pengetahuan.
2. Setiap kali Anda menyebutkan fakta kerusakan, gejala, akar penyebab, atau solusi, Anda WAJIB menyertakan nomor sitasi dalam kurung siku seperti [1], [2] yang merujuk pada nomor index kasus yang disediakan.
3. JIKA ada informasi yang bersumber dari kasus berstatus [PRADUGA], Anda WAJIB menyatakan secara eksplisit bahwa temuan tersebut masih praduga dan belum diverifikasi pakar.
4. Gunakan bahasa Indonesia teknis baku (terminologi Oil & Gas/Reliability).
5. Jangan gunakan format heading markdown besar (# atau ##). Buat dalam paragraf ringkas terstruktur dengan poin-poin yang mudah dibaca di lapangan.`,
        });

        const contextPrompt = `Pertanyaan Teknisi: "${question}"

Rujukan Kasus Terkait dari Database Supabase:
${citations
  .map(
    (c) =>
      `[${c.index}] ID: ${c.reportId} | Status: [${c.status}] | Aset: ${c.assetId} - ${c.title}
- Gejala: ${c.gejala}
- Penyebab: ${c.praduga_penyebab}
- Rekomendasi Solusi: ${c.usulan_tindakan}
- File Bukti: ${c.evidenceName} (${c.evidenceUrl || 'Belum ada file'})`
  )
  .join('\n\n')}

Berikan jawaban terpadu dengan sitasi [1], [2], dll.`;

        const result = await model.generateContent(contextPrompt);
        answerText = result.response.text();
      } catch (err) {
        console.warn('Gemini generateContent error, falling back to local synthesizer:', err);
        answerText = generateLocalSynthesizedAnswer(question, citations);
      }
    } else {
      answerText = generateLocalSynthesizedAnswer(question, citations);
    }

    return NextResponse.json({
      answer: answerText,
      citations,
      hasPradugaWarning,
      pradugaReports,
      detectedAsset,
      totalMatched: scoredReports.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function generateLocalSynthesizedAnswer(question: string, citations: Citation[]): string {
  if (citations.length === 0) {
    return 'Tidak ditemukan kasus serupa di database Supabase untuk kata kunci tersebut. Coba gunakan kode tag aset (seperti P-101A, E-201, FCV-301) atau gejala spesifik.';
  }

  const verifiedCases = citations.filter((c) => c.status === 'VERIFIED');
  const pradugaCases = citations.filter((c) => c.status === 'PRADUGA');
  const otherCases = citations.filter((c) => c.status !== 'VERIFIED' && c.status !== 'PRADUGA');

  let text = '';

  if (verifiedCases.length > 0) {
    const v = verifiedCases[0];
    text += `Berdasarkan pengetahuan terverifikasi [${v.index}], penanganan pada peralatan ${v.assetId} berfokus pada akar penyebab "${v.praduga_penyebab}". Gejala umum yang dilaporkan berupa ${v.gejala} [${v.index}]. Tindakan korektif standar yang terbukti efektif adalah ${v.usulan_tindakan} [${v.index}].\n\n`;
  }

  if (otherCases.length > 0) {
    const o = otherCases[0];
    text += `Selain itu, catatan investigasi aktif [${o.index}] pada ${o.assetId} mencatat gejala serupa: ${o.gejala} [${o.index}], dengan usulan mitigasi berupa ${o.usulan_tindakan} [${o.index}].\n\n`;
  }

  if (pradugaCases.length > 0) {
    const p = pradugaCases[0];
    text += `Perhatian: Terdapat temuan [${p.index}] (${p.reportId}) yang mencatat indikasi ${p.gejala}, namun statusnya masih PRADUGA karena bukti fisik belum diverifikasi pakar [${p.index}].`;
  }

  return text.trim();
}
