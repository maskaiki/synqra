import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { INITIAL_ASSETS, INITIAL_REPORTS } from '@/lib/constants';
import {
  CDU11_ENGINEERING_BRIEF,
  CDU11_SYSTEMIC_PATTERNS,
} from '@/lib/cduBalonganKnowledge';
import { GEMINI_MODEL_FALLBACKS, withGeminiTimeout } from '@/lib/gemini';
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
    isCrossAssetPattern?: boolean;
    affectedAssetIds?: string[];
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
  const reportById = new Map(allReports.map((r) => [r.id, r]));

  // 1. Peringatan Dini Kejadian Berulang pada Tag Aset yang Sama (>= 2 laporan)
  for (const asset of allAssets) {
    const assetReports = allReports.filter((r) => r.asset_id === asset.id);
    if (assetReports.length < 2) continue;

    const recent60Days = assetReports.filter((r) => {
      const t = new Date(r.created_at).getTime();
      return !Number.isNaN(t) && now - t <= sixtyDaysMs;
    });
    const scoped = recent60Days.length >= 2 ? recent60Days : assetReports;
    const activeHigh = scoped.filter(
      (r) =>
        r.status !== 'VERIFIED' &&
        (r.risk_level === 'HIGH' || r.risk_level === 'CRITICAL')
    ).length;

    const severity: EarlyWarningSeverity =
      scoped.length >= 3 || activeHigh >= 1 ? 'KRITIS' : 'WASPADA';

    const summary = `Tercatat ${scoped.length} laporan pada ${asset.id} (${asset.name}) dalam pemantauan aktif lintas shift.`;
    const recommendedAction = `Jadwalkan audit keandalan terpadu dan tinjau kelengkapan bukti serta histori CAPA pada ${asset.id}.`;

    alerts.push({
      id: `ew-asset-${asset.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      assetId: asset.id,
      severity,
      patternTitle: stripForbiddenDashes(`Kejadian Berulang pada ${asset.id}`),
      frequencyLabel: `${scoped.length} kasus terdeteksi`,
      summary: stripForbiddenDashes(summary),
      recommendedAction: stripForbiddenDashes(recommendedAction),
      relatedReportIds: scoped.map((r) => r.id),
      assetName: asset.name,
      recentCount: scoped.length,
      message: stripForbiddenDashes(summary),
    });
  }

  // 2. 9 Pola Peringatan Dini Sistemik Lintas-Aset Unit 11 CDU RU VI Balongan
  for (const pat of CDU11_SYSTEMIC_PATTERNS) {
    const relatedReports = pat.relatedCaseIds
      .map((id) => reportById.get(id))
      .filter((r): r is Report => Boolean(r));
    const tagMatched = allReports.filter(
      (r) => pat.affectedTags.includes(r.asset_id) && !pat.relatedCaseIds.includes(r.id)
    );
    const mergedReports = [...relatedReports, ...tagMatched];
    if (mergedReports.length < 2) continue;

    alerts.push({
      id: pat.id,
      assetId: pat.primaryAssetId,
      severity: pat.severity,
      patternTitle: stripForbiddenDashes(pat.title),
      frequencyLabel: `${mergedReports.length} kasus lintas-${pat.affectedTags.length} aset`,
      summary: stripForbiddenDashes(pat.mechanismSummary),
      recommendedAction: stripForbiddenDashes(pat.recommendedAction),
      relatedReportIds: mergedReports.map((r) => r.id),
      assetName: pat.affectedTags.slice(0, 3).join(', '),
      recentCount: mergedReports.length,
      message: stripForbiddenDashes(pat.mechanismSummary),
      isCrossAssetPattern: true,
      affectedAssetIds: pat.affectedTags,
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

    const validReportIds = new Set(allReports.map((r) => r.id));
    const fallbackAlerts = buildFallbackAlerts(allReports, allAssets);
    const generatedAt = new Date().toISOString();

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

    if (genAI) {
      let lastError = 'Semua model Gemini gagal memindai pola berulang.';

      // Kelompokkan ringkas per seksi / pola Unit 11 agar hemat token namun lengkap
      const activeDigest = allReports
        .filter((r) => r.status !== 'VERIFIED' || r.risk_level === 'HIGH' || r.risk_level === 'CRITICAL')
        .slice(0, 48)
        .map(
          (r) =>
            `* ${r.id} | Tag: ${r.asset_id} | Status: ${r.status} | Risiko: ${r.risk_level || 'MEDIUM'} | ${r.title} -> Penyebab: ${r.praduga_penyebab}`
        )
        .join('\n');

      const systemicSeedText = CDU11_SYSTEMIC_PATTERNS.map(
        (p) =>
          `- [${p.id}] ${p.title} | Primary: ${p.primaryAssetId} | Tags: ${p.affectedTags.join(', ')} | IDs: ${p.relatedCaseIds.join(', ')}`
      ).join('\n');

      const prompt = `Anda adalah Sistem Deteksi Dini Keandalan Kilang (Early Warning AI) pada platform SYNQRA untuk Unit 11 (CDU) PT Pertamina RU VI Balongan.
${CDU11_ENGINEERING_BRIEF}

RINGKASAN KASUS UNIT 11 CDU (${allReports.length} total kasus):
${activeDigest}

PETA POLA KETERKAITAN HULU-HILIR UNIT 11:
${systemicSeedText}

ATURAN KERAS:
1. Kembalikan HANYA JSON murni tanpa markdown code fence.
2. Buat 6-9 peringatan dini utama yang mencakup pola sistemik lintas-aset hulu-hilir maupun aset dengan kejadian berulang.
3. "relatedReportIds" WAJIB berisi ID laporan nyata yang ada pada daftar kasus di atas. DILARANG mengarang ID baru.
4. "severity" harus tepat salah satu dari: "KRITIS", "WASPADA", atau "PANTAU".
5. "summary" dan "recommendedAction" ditulis ringkas (1-2 kalimat) dalam Bahasa Indonesia teknis yang langsung ke inti.
6. DILARANG menggunakan em-dash atau en-dash; gunakan tanda hubung biasa (-).

FORMAT JSON:
{
  "alerts": [
    {
      "id": "pat-overhead-hcl-nh4cl",
      "assetId": "11-C-101",
      "severity": "KRITIS",
      "patternTitle": "Judul pola singkat",
      "frequencyLabel": "9 kasus lintas aset",
      "summary": "Ringkasan mekanisme hulu-hilir.",
      "recommendedAction": "Saran pencegahan teknis.",
      "relatedReportIds": ["CDU11-V01", "CDU11-C02"],
      "isCrossAssetPattern": true,
      "affectedAssetIds": ["11-V-101 A/B", "11-C-101"]
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

          const res = await withGeminiTimeout(
            model.generateContent(prompt),
            12000,
            modelName
          );
          const parsed = JSON.parse(
            cleanJsonString(res.response.text())
          ) as GeminiAlertPayload;

          const rawAlerts = Array.isArray(parsed.alerts) ? parsed.alerts : [];
          const normalizedAlerts: EarlyWarningAlert[] = [];
          const seenIds = new Set<string>();

          for (const item of rawAlerts) {
            const rawId = stripForbiddenDashes(item.id?.trim() || '');
            const assetObj = allAssets.find(
              (a) => a.id.toUpperCase() === (item.assetId || '').trim().toUpperCase()
            );
            const fallbackForItem =
              fallbackAlerts.find((f) => f.id === rawId) ||
              (assetObj ? fallbackAlerts.find((f) => f.assetId === assetObj.id) : undefined);

            const resolvedAssetId = assetObj?.id || fallbackForItem?.assetId;
            if (!resolvedAssetId) continue;

            const finalId = rawId || fallbackForItem?.id || `ew-${resolvedAssetId.toLowerCase()}`;
            if (seenIds.has(finalId)) continue;

            const filteredIds = Array.isArray(item.relatedReportIds)
              ? item.relatedReportIds
                  .map((id) => id.trim().toUpperCase())
                  .filter((id) => validReportIds.has(id))
              : [];

            const finalIds =
              filteredIds.length > 0
                ? Array.from(new Set(filteredIds))
                : fallbackForItem?.relatedReportIds || [];

            if (finalIds.length === 0) continue;

            seenIds.add(finalId);
            const summary = stripForbiddenDashes(
              item.summary?.trim() ||
                fallbackForItem?.summary ||
                `Terdeteksi ${finalIds.length} kasus terkait pada ${resolvedAssetId}.`
            );

            const affectedTags = Array.isArray(item.affectedAssetIds) && item.affectedAssetIds.length > 0
              ? item.affectedAssetIds.map(stripForbiddenDashes)
              : fallbackForItem?.affectedAssetIds;

            normalizedAlerts.push({
              id: finalId,
              assetId: resolvedAssetId,
              severity: normalizeSeverity(item.severity),
              patternTitle: stripForbiddenDashes(
                item.patternTitle?.trim() ||
                  fallbackForItem?.patternTitle ||
                  `Pola Berulang ${resolvedAssetId}`
              ),
              frequencyLabel: stripForbiddenDashes(
                item.frequencyLabel?.trim() ||
                  `${finalIds.length} kasus terdeteksi`
              ),
              summary,
              recommendedAction: stripForbiddenDashes(
                item.recommendedAction?.trim() ||
                  fallbackForItem?.recommendedAction ||
                  `Lakukan inspeksi preventif menyeluruh pada ${resolvedAssetId}.`
              ),
              relatedReportIds: finalIds,
              assetName: assetObj?.name || resolvedAssetId,
              recentCount: finalIds.length,
              message: summary,
              isCrossAssetPattern: Boolean(
                item.isCrossAssetPattern ?? (affectedTags && affectedTags.length > 1)
              ),
              affectedAssetIds: affectedTags,
            });
          }

          // Pastikan aset berulang maupun pola inti fallback tetap tercover bila ada yang terlewat
          for (const fb of fallbackAlerts) {
            if (!seenIds.has(fb.id) && normalizedAlerts.length < 10) {
              seenIds.add(fb.id);
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
