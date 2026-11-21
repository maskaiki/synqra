import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { INITIAL_ASSETS, INITIAL_REPORTS } from '@/lib/constants';
import { GEMINI_MODEL_FALLBACKS } from '@/lib/gemini';
import {
  Asset,
  EarlyWarningAlert,
  EarlyWarningResponse,
  EarlyWarningSeverity,
  Report,
} from '@/types/synqra';

interface PeringatanDiniRequestBody {
  reports?: Report[];
  assets?: Asset[];
}

interface GeminiAlertPayload {
  alerts?: Array<{
    id?: string;
    assetId?: string;
    severity?: string;
    patternTitle?: string;
    frequencyLabel?: string;
    summary?: string;
    recommendedAction?: string;
    relatedReportIds?: string[];
  }>;
}

function stripForbiddenDashes(text: string): string {
  return text.replace(/[\u2013\u2014]/g, '-').trim();
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
    return stripForbiddenDashes(`${statusPrefix}${rawMsg.split('\n')[0].slice(0, 180)}`);
  }
  return stripForbiddenDashes(String(err).slice(0, 180));
}

function isInvalidKeyError(msg: string): boolean {
  const upper = msg.toUpperCase();
  return upper.includes('API_KEY_INVALID') || upper.includes('API KEY NOT VALID');
}

function normalizeSeverity(raw: unknown): EarlyWarningSeverity {
  const upper = typeof raw === 'string' ? raw.trim().toUpperCase() : '';
  if (upper === 'KRITIS' || upper === 'CRITICAL') return 'KRITIS';
  if (upper === 'WASPADA' || upper === 'WARNING' || upper === 'HIGH') return 'WASPADA';
  return 'PANTAU';
}

const SEVERITY_RANK: Record<EarlyWarningSeverity, number> = {
  KRITIS: 3,
  WASPADA: 2,
  PANTAU: 1,
};

function buildFallbackAlerts(
  allReports: Report[],
  allAssets: Asset[]
): EarlyWarningAlert[] {
  const sixtyDaysMs = 60 * 24 * 3600 * 1000;
  const now = Date.now();
  const alerts: EarlyWarningAlert[] = [];

  for (const asset of allAssets) {
    const assetReports = allReports.filter((r) => r.asset_id === asset.id);
    if (assetReports.length < 2) continue;

    const recent60Days = assetReports.filter((r) => {
      const t = new Date(r.created_at).getTime();
      return !Number.isNaN(t) && now - t <= sixtyDaysMs;
    });
    const scoped = recent60Days.length >= 2 ? recent60Days : assetReports;
    const textBlob = (r: Report) =>
      `${r.title} ${r.gejala} ${r.praduga_penyebab} ${r.usulan_tindakan}`.toLowerCase();

    let patternTitle = `Pola Gangguan Berulang pada ${asset.id}`;
    let matchedReports = scoped;
    let summary = `Tercatat ${scoped.length} laporan pada ${asset.id} dengan gejala berulang di unit operasi.`;
    let recommendedAction = `Jadwalkan audit keandalan terpadu dan tinjau histori CAPA pada ${asset.id}.`;

    if (asset.id === 'P-101A') {
      const vibSeal = scoped.filter((r) =>
        /(vibrasi|getar|seal|kopling|alignment)/i.test(textBlob(r))
      );
      if (vibSeal.length >= 2) {
        matchedReports = vibSeal;
        patternTitle = 'Pola Berulang Vibrasi & Mechanical Seal P-101A';
        summary = `${vibSeal.length} insiden terkait vibrasi poros, misalignment kopling, dan rembesan mechanical seal terdeteksi dalam 60 hari.`;
        recommendedAction =
          'Lakukan audit laser alignment kopling, pelepasan pipe strain, dan inspeksi jalur flush seal secara menyeluruh.';
      }
    } else if (asset.id === 'E-201') {
      const fouling = scoped.filter((r) =>
        /(fouling|kerak|delta|pressure drop|antifoulant)/i.test(textBlob(r))
      );
      const gasket = scoped.filter((r) =>
        /(gasket|flange|rembes|baut)/i.test(textBlob(r))
      );
      if (fouling.length >= gasket.length && fouling.length >= 2) {
        matchedReports = fouling;
        patternTitle = 'Akumulasi Fouling & Penurunan Termal Berulang E-201';
        summary = `${fouling.length} kejadian penurunan efisiensi termal dan kenaikan pressure drop akibat fouling tube bundle tercatat pada periode 60 hari.`;
        recommendedAction =
          'Pastikan laju alir minimum terjaga dan pasang alarm flow switch pada pompa dosing antifoulant.';
      } else if (gasket.length >= 2) {
        matchedReports = gasket;
        patternTitle = 'Rembesan Flange & Gasket Thermal Cycling E-201';
        summary = `${gasket.length} temuan rembesan pada flange dan gasket channel/floating head terjadi saat siklus perubahan suhu.`;
        recommendedAction =
          'Terapkan prosedur pemanasan bertahap maksimal 25 derajat C per jam dan verifikasi torsi baut pasca-startup.';
      }
    } else if (asset.id === 'FCV-301') {
      const valvePattern = scoped.filter((r) =>
        /(hunting|osilasi|stroke|aktuator|positioner|packing|regulator)/i.test(
          textBlob(r)
        )
      );
      if (valvePattern.length >= 2) {
        matchedReports = valvePattern;
        patternTitle = 'Gangguan Aktuator, Positioner & Stroke FCV-301';
        summary = `${valvePattern.length} insiden osilasi bukaan, sticking stem packing, dan gangguan suplai udara aktuator muncul berulang dalam 60 hari.`;
        recommendedAction =
          'Jadwalkan penggantian filter regulator udara instrumen serta uji partial stroke test bulanan pada FCV-301.';
      }
    }

    const activeHigh = matchedReports.filter(
      (r) =>
        r.status !== 'VERIFIED' &&
        (r.risk_level === 'HIGH' || r.risk_level === 'CRITICAL')
    ).length;

    const severity: EarlyWarningSeverity =
      matchedReports.length >= 3 && activeHigh >= 1
        ? 'KRITIS'
        : matchedReports.length >= 3 || activeHigh >= 1
          ? 'WASPADA'
          : 'PANTAU';

    alerts.push({
      id: `ew-${asset.id.toLowerCase()}`,
      assetId: asset.id,
      severity,
      patternTitle: stripForbiddenDashes(patternTitle),
      frequencyLabel: `${matchedReports.length} kasus dalam 60 hari`,
      summary: stripForbiddenDashes(summary),
      recommendedAction: stripForbiddenDashes(recommendedAction),
      relatedReportIds: matchedReports.map((r) => r.id),
      assetName: asset.name,
      recentCount: matchedReports.length,
      message: stripForbiddenDashes(summary),
    });
  }

  return alerts.sort(
    (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PeringatanDiniRequestBody;
    const allReports: Report[] =
      Array.isArray(body.reports) && body.reports.length > 0
        ? body.reports
        : INITIAL_REPORTS;
    const allAssets: Asset[] =
      Array.isArray(body.assets) && body.assets.length > 0
        ? body.assets
        : INITIAL_ASSETS;

    const validIdsByAsset = new Map<string, Set<string>>();
    for (const asset of allAssets) {
      validIdsByAsset.set(
        asset.id,
        new Set(allReports.filter((r) => r.asset_id === asset.id).map((r) => r.id))
      );
    }

    const fallbackAlerts = buildFallbackAlerts(allReports, allAssets);
    const generatedAt = new Date().toISOString();

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

    if (genAI) {
      let lastError = 'Semua model Gemini gagal memindai pola berulang.';

      const groupedContext = allAssets
        .map((asset) => {
          const reps = allReports.filter((r) => r.asset_id === asset.id);
          const lines = reps
            .map(
              (r) =>
                `  * ${r.id} | Status: ${r.status} | Risiko: ${r.risk_level || 'MEDIUM'} | Tgl: ${r.created_at.slice(0, 10)}\n` +
                `    Judul: ${r.title}\n` +
                `    Gejala: ${r.gejala}\n` +
                `    Penyebab: ${r.praduga_penyebab}`
            )
            .join('\n');
          return `ASET ${asset.id} (${asset.name}) [Total: ${reps.length} kasus]:\n${lines}`;
        })
        .join('\n\n');

      const prompt = `Anda adalah Sistem Deteksi Dini Keandalan Peralatan (Early Warning AI) pada platform SYNQRA untuk kilang migas.
Analisislah seluruh riwayat kasus yang sudah dikelompokkan per aset di bawah ini untuk mendeteksi pola kegagalan berulang.

RIWAYAT KASUS PER ASET:
${groupedContext}

ATURAN KERAS:
1. Kembalikan HANYA JSON murni tanpa markdown code fence.
2. Buat tepat 1 peringatan utama per aset yang memiliki pola berulang (>= 2 kasus serupa).
3. "relatedReportIds" WAJIB berisi ID laporan nyata yang benar-benar ada pada aset tersebut di data di atas. DILARANG mengarang ID baru.
4. "severity" harus tepat salah satu dari: "KRITIS", "WASPADA", atau "PANTAU".
5. "summary" dan "recommendedAction" masing-masing cukup 1 kalimat pendek dalam Bahasa Indonesia langsung ke inti.
6. DILARANG keras menggunakan tanda em-dash atau en-dash pada seluruh teks output.

FORMAT JSON:
{
  "alerts": [
    {
      "id": "ew-p101a",
      "assetId": "P-101A",
      "severity": "KRITIS",
      "patternTitle": "Judul pola singkat",
      "frequencyLabel": "4 kasus dalam 60 hari",
      "summary": "1 kalimat ringkasan pola.",
      "recommendedAction": "1 kalimat saran pencegahan teknis.",
      "relatedReportIds": ["REP-001", "REP-010"]
    }
  ]
}`;

      for (const modelName of GEMINI_MODEL_FALLBACKS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.15,
            },
          });

          const res = await model.generateContent(prompt);
          const parsed = JSON.parse(
            cleanJsonString(res.response.text())
          ) as GeminiAlertPayload;

          const rawAlerts = Array.isArray(parsed.alerts) ? parsed.alerts : [];
          const normalizedAlerts: EarlyWarningAlert[] = [];
          const seenAssets = new Set<string>();

          for (const item of rawAlerts) {
            const assetObj = allAssets.find(
              (a) => a.id.toUpperCase() === (item.assetId || '').trim().toUpperCase()
            );
            if (!assetObj || seenAssets.has(assetObj.id)) continue;

            const validSet = validIdsByAsset.get(assetObj.id) || new Set<string>();
            const filteredIds = Array.isArray(item.relatedReportIds)
              ? item.relatedReportIds
                  .map((id) => id.trim().toUpperCase())
                  .filter((id) => validSet.has(id))
              : [];

            const fallbackForAsset = fallbackAlerts.find(
              (f) => f.assetId === assetObj.id
            );
            const finalIds =
              filteredIds.length > 0
                ? Array.from(new Set(filteredIds))
                : fallbackForAsset?.relatedReportIds || Array.from(validSet).slice(0, 3);

            if (finalIds.length === 0) continue;

            seenAssets.add(assetObj.id);
            const summary = stripForbiddenDashes(
              item.summary?.trim() ||
                fallbackForAsset?.summary ||
                `Terdeteksi ${finalIds.length} kasus berulang pada ${assetObj.id}.`
            );

            normalizedAlerts.push({
              id: stripForbiddenDashes(
                item.id?.trim() || `ew-${assetObj.id.toLowerCase()}`
              ),
              assetId: assetObj.id,
              severity: normalizeSeverity(item.severity),
              patternTitle: stripForbiddenDashes(
                item.patternTitle?.trim() ||
                  fallbackForAsset?.patternTitle ||
                  `Pola Berulang ${assetObj.id}`
              ),
              frequencyLabel: stripForbiddenDashes(
                item.frequencyLabel?.trim() ||
                  `${finalIds.length} kasus terdeteksi`
              ),
              summary,
              recommendedAction: stripForbiddenDashes(
                item.recommendedAction?.trim() ||
                  fallbackForAsset?.recommendedAction ||
                  `Lakukan inspeksi preventif menyeluruh pada ${assetObj.id}.`
              ),
              relatedReportIds: finalIds,
              assetName: assetObj.name,
              recentCount: finalIds.length,
              message: summary,
            });
          }

          // Pastikan seluruh aset dari fallback yang belum tercakup tetap muncul
          for (const fb of fallbackAlerts) {
            if (!seenAssets.has(fb.assetId)) {
              normalizedAlerts.push(fb);
            }
          }

          normalizedAlerts.sort(
            (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]
          );

          const payload: EarlyWarningResponse = {
            alerts: normalizedAlerts,
            engine: 'gemini-live',
            usedModel: modelName,
            generatedAt,
          };

          return NextResponse.json({ success: true, ...payload });
        } catch (err) {
          const formatted = formatGeminiError(err);
          lastError = `[${modelName}] ${formatted}`;
          console.warn(`Gemini early warning fallback (${modelName}):`, formatted);
          if (isInvalidKeyError(formatted)) {
            break;
          }
        }
      }

      const fallbackResp: EarlyWarningResponse = {
        alerts: fallbackAlerts,
        engine: 'local-fallback',
        errorReason: lastError,
        generatedAt,
      };
      return NextResponse.json({ success: true, ...fallbackResp });
    }

    const noKeyResp: EarlyWarningResponse = {
      alerts: fallbackAlerts,
      engine: 'local-fallback',
      errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
      generatedAt,
    };
    return NextResponse.json({ success: true, ...noKeyResp });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? stripForbiddenDashes(err.message)
        : 'Gagal memindai pola peringatan dini.';
    console.error('Error in /api/peringatan-dini:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
