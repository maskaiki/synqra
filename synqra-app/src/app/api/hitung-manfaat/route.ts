import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { INITIAL_REPORTS } from '@/lib/constants';
import { GEMINI_MODEL_FALLBACKS } from '@/lib/gemini';
import { Report, RoiAnalysisResult, RoiCaseBreakdownItem } from '@/types/synqra';

const DEFAULT_HOURLY_RATE_IDR = 250_000_000;

interface HitungManfaatRequestBody {
  reports?: Report[];
  hourlyDowntimeRateIdr?: number;
}

interface GeminiRoiPayload {
  executiveSummary?: string;
  caseBreakdown?: Array<{
    reportId?: string;
    assetId?: string;
    title?: string;
    preventedHours?: number;
    rationale?: string;
  }>;
}

function sanitizeHourlyRate(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return Math.min(50_000_000_000, Math.max(1_000_000, Math.round(raw)));
  }
  return DEFAULT_HOURLY_RATE_IDR;
}

function cleanJsonString(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function formatGeminiError(err: unknown): string {
  if (err && typeof err === 'object') {
    const errObj = err as { status?: number; message?: string };
    const statusPrefix = errObj.status ? `HTTP ${errObj.status}: ` : '';
    const rawMsg = errObj.message || String(err);
    return `${statusPrefix}${rawMsg.split('\n')[0].slice(0, 180)}`;
  }
  return String(err).slice(0, 180);
}

function isInvalidKeyError(msg: string): boolean {
  const upper = msg.toUpperCase();
  return upper.includes('API_KEY_INVALID') || upper.includes('API KEY NOT VALID');
}

function roundOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function defaultHoursForRisk(risk?: Report['risk_level']): number {
  switch (risk) {
    case 'CRITICAL':
      return 8;
    case 'HIGH':
      return 6;
    case 'MEDIUM':
      return 4;
    case 'LOW':
    default:
      return 2;
  }
}

function buildLocalFallbackBreakdown(
  verifiedReports: Report[]
): RoiCaseBreakdownItem[] {
  return verifiedReports.map((r) => {
    const hours = defaultHoursForRisk(r.risk_level);
    return {
      reportId: r.id,
      assetId: r.asset_id,
      title: r.title,
      preventedHours: hours,
      rationale: `Estimasi konservatif ${hours} jam downtime tercegah pada ${r.asset_id} melalui tindakan terverifikasi: ${r.usulan_tindakan || r.praduga_penyebab}.`,
    };
  });
}

function formatIdrShort(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HitungManfaatRequestBody;
    const hourlyDowntimeRateIdr = sanitizeHourlyRate(body.hourlyDowntimeRateIdr);
    const allReports: Report[] =
      Array.isArray(body.reports) && body.reports.length > 0
        ? body.reports
        : INITIAL_REPORTS;

    const verifiedReports = allReports.filter((r) => r.status === 'VERIFIED');
    const activeHighRisk = allReports.filter(
      (r) =>
        r.status !== 'VERIFIED' &&
        (r.risk_level === 'HIGH' || r.risk_level === 'CRITICAL')
    );

    const activeHighRiskCount = activeHighRisk.length;
    const potentialActiveHours = activeHighRisk.reduce(
      (acc, r) => acc + defaultHoursForRisk(r.risk_level),
      0
    );
    const activeHighRiskNote =
      activeHighRiskCount > 0
        ? `Terdapat ${activeHighRiskCount} kasus aktif berisiko HIGH/CRITICAL (${activeHighRisk
            .map((r) => r.id)
            .join(', ')}) yang belum terverifikasi. Penyelesaian & validasi kasus tersebut berpotensi menambah mitigasi sekitar ${potentialActiveHours} jam unplanned downtime (Rp ${formatIdrShort(
            Math.round(potentialActiveHours * hourlyDowntimeRateIdr)
          )}).`
        : undefined;

    if (verifiedReports.length === 0) {
      const emptyResult: RoiAnalysisResult = {
        estimatedHoursSaved: 0,
        estimatedCostSavedIdr: 0,
        hourlyDowntimeRateIdr,
        executiveSummary:
          'Belum ada kasus berstatus VERIFIED yang dapat dihitung sebagai penghematan terealisasi. Selesaikan validasi kasus di Triage & Kasus terlebih dahulu.',
        caseBreakdown: [],
        activeHighRiskCount,
        activeHighRiskNote,
        engine: 'local-fallback',
        errorReason: 'Belum ada kasus berstatus VERIFIED untuk dianalisis.',
      };
      return NextResponse.json({ success: true, ...emptyResult });
    }

    const fallbackBreakdown = buildLocalFallbackBreakdown(verifiedReports);
    const fallbackHours = roundOneDecimal(
      fallbackBreakdown.reduce((sum, item) => sum + item.preventedHours, 0)
    );
    const fallbackCost = Math.round(fallbackHours * hourlyDowntimeRateIdr);

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

    if (genAI) {
      let lastError = 'Semua model Gemini gagal menghasilkan estimasi ROI.';

      const verifiedContext = verifiedReports
        .map(
          (r) =>
            `- ID: ${r.id} | Aset: ${r.asset_id} | Risiko: ${r.risk_level || 'MEDIUM'} | Judul: ${r.title}\n` +
            `  Gejala: ${r.gejala}\n` +
            `  Penyebab Terverifikasi: ${r.praduga_penyebab}\n` +
            `  Tindakan: ${r.usulan_tindakan}\n` +
            `  CAPA: ${r.capa_corrective || '-'}`
        )
        .join('\n\n');

      const prompt = `Anda adalah Reliability & Industrial Economics Analyst untuk platform SYNQRA (Industri Migas).
Tugas Anda: hitung estimasi KONSERVATIF jam unplanned downtime yang berhasil dicegah untuk setiap kasus berstatus VERIFIED di bawah ini, lalu tulis ringkasan eksekutif singkat untuk manajemen.

ASUMSI BIAYA DOWNTIME: Rp ${formatIdrShort(hourlyDowntimeRateIdr)} per jam.
KONTEKS KASUS AKTIF BERISIKO TINGGI (BELUM VERIFIED): ${activeHighRiskCount} kasus (${activeHighRisk.map((r) => r.id).join(', ') || 'Tidak ada'}).

DAFTAR KASUS VERIFIED:
${verifiedContext}

ATURAN WAJIB:
1. Kembalikan HANYA JSON murni tanpa markdown code fence.
2. Estimasi preventedHours harus konservatif dan realistis per kasus (antara 1 hingga 16 jam, misalnya LOW 2 jam, MEDIUM 4 jam, HIGH 6-8 jam, CRITICAL 8-12 jam) sesuai tingkat keparahan teknis kasus.
3. Wajib sertakan tepat ${verifiedReports.length} item pada array "caseBreakdown" sesuai ID laporan di atas.
4. Gunakan Bahasa Indonesia formal dan ringkas untuk "rationale" (1-2 kalimat) dan "executiveSummary" (2-3 kalimat untuk direksi/dosen).

FORMAT JSON:
{
  "executiveSummary": "...",
  "caseBreakdown": [
    {
      "reportId": "REP-002",
      "assetId": "E-201",
      "title": "...",
      "preventedHours": 4,
      "rationale": "..."
    }
  ]
}`;

      for (const modelName of GEMINI_MODEL_FALLBACKS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          });

          const res = await model.generateContent(prompt);
          const parsed = JSON.parse(
            cleanJsonString(res.response.text())
          ) as GeminiRoiPayload;

          const aiItems = Array.isArray(parsed.caseBreakdown)
            ? parsed.caseBreakdown
            : [];

          const normalizedBreakdown: RoiCaseBreakdownItem[] = verifiedReports.map(
            (rep, idx) => {
              const matched = aiItems.find(
                (item) =>
                  item.reportId?.trim().toUpperCase() === rep.id.toUpperCase()
              );
              const fallbackItem = fallbackBreakdown[idx];
              const rawHours =
                typeof matched?.preventedHours === 'number' &&
                Number.isFinite(matched.preventedHours)
                  ? matched.preventedHours
                  : fallbackItem.preventedHours;
              const clampedHours = roundOneDecimal(
                Math.min(48, Math.max(0.5, rawHours))
              );

              return {
                reportId: rep.id,
                assetId: rep.asset_id,
                title: rep.title,
                preventedHours: clampedHours,
                rationale:
                  matched?.rationale?.trim() || fallbackItem.rationale,
              };
            }
          );

          const estimatedHoursSaved = roundOneDecimal(
            normalizedBreakdown.reduce(
              (sum, item) => sum + item.preventedHours,
              0
            )
          );
          const estimatedCostSavedIdr = Math.round(
            estimatedHoursSaved * hourlyDowntimeRateIdr
          );

          const result: RoiAnalysisResult = {
            estimatedHoursSaved,
            estimatedCostSavedIdr,
            hourlyDowntimeRateIdr,
            executiveSummary:
              parsed.executiveSummary?.trim() ||
              `Berdasarkan ${verifiedReports.length} kasus terverifikasi, penerapan Knowledge Base SYNQRA diperkirakan mencegah ${estimatedHoursSaved} jam unplanned downtime senilai Rp ${formatIdrShort(estimatedCostSavedIdr)}.`,
            caseBreakdown: normalizedBreakdown,
            activeHighRiskCount,
            activeHighRiskNote,
            engine: 'gemini-live',
            usedModel: modelName,
          };

          return NextResponse.json({ success: true, ...result });
        } catch (err) {
          const formatted = formatGeminiError(err);
          lastError = `[${modelName}] ${formatted}`;
          console.warn(`Gemini ROI analysis fallback (${modelName}):`, formatted);
          if (isInvalidKeyError(formatted)) {
            break;
          }
        }
      }

      const fallbackResult: RoiAnalysisResult = {
        estimatedHoursSaved: fallbackHours,
        estimatedCostSavedIdr: fallbackCost,
        hourlyDowntimeRateIdr,
        executiveSummary: `Berdasarkan kalkulasi deterministik konservatif terhadap ${verifiedReports.length} kasus terverifikasi, SYNQRA membantu mencegah ${fallbackHours} jam unplanned downtime dengan estimasi penghematan opportunity loss sebesar Rp ${formatIdrShort(fallbackCost)} (asumsi Rp ${formatIdrShort(hourlyDowntimeRateIdr)}/jam).`,
        caseBreakdown: fallbackBreakdown,
        activeHighRiskCount,
        activeHighRiskNote,
        engine: 'local-fallback',
        errorReason: lastError,
      };
      return NextResponse.json({ success: true, ...fallbackResult });
    }

    const noKeyResult: RoiAnalysisResult = {
      estimatedHoursSaved: fallbackHours,
      estimatedCostSavedIdr: fallbackCost,
      hourlyDowntimeRateIdr,
      executiveSummary: `Berdasarkan kalkulasi deterministik konservatif terhadap ${verifiedReports.length} kasus terverifikasi, SYNQRA membantu mencegah ${fallbackHours} jam unplanned downtime dengan estimasi penghematan opportunity loss sebesar Rp ${formatIdrShort(fallbackCost)} (asumsi Rp ${formatIdrShort(hourlyDowntimeRateIdr)}/jam).`,
      caseBreakdown: fallbackBreakdown,
      activeHighRiskCount,
      activeHighRiskNote,
      engine: 'local-fallback',
      errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
    };
    return NextResponse.json({ success: true, ...noKeyResult });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Gagal menghitung estimasi manfaat ROI.';
    console.error('Error in /api/hitung-manfaat:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
