import { GoogleGenerativeAI } from '@google/generative-ai';
import { FailureEntities } from '@/types/synqra';

export const GEMINI_MODEL = 'gemini-3.5-flash';

export const GEMINI_MODEL_FALLBACKS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.5-flash',
] as const;

function getGenAI(): GoogleGenerativeAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  return apiKey ? new GoogleGenerativeAI(apiKey) : null;
}

export interface LaporCepatExtractionResult {
  transcript: string;
  entities: FailureEntities;
  suggestedTitle: string;
  suggestedUrgency: 'Mendesak' | 'Normal';
  engine: 'gemini-live' | 'local-fallback';
  usedModel?: string;
  errorReason?: string;
}

export const SYSTEM_PROMPT_LAPOR_CEPAT = `Anda adalah asisten AI Industrial Engineering & Reliability untuk platform SYNQRA (Industri Pengolahan Minyak & Gas).
Tugas Anda adalah menganalisis transkrip audio lapangan atau teks narasi campuran Bahasa Indonesia–Inggris dari teknisi pabrik, lalu mengekstrak 7 entitas kegagalan peralatan beserta judul & urgensi dalam format JSON murni:

1. identitas_alat: Tag/nama alat (misal: "Pompa Sentrifugal P-101A", "Heat Exchanger E-201", "Control Valve FCV-301").
2. gejala: Gejala anomali yang teramati langsung (vibrasi, kebocoran, penurunan suhu, respons lambat).
3. kondisi_operasi: Kondisi proses saat anomali terjadi (suhu, tekanan, laju alir, beban motor).
4. pemeriksaan_awal: Pemeriksaan awal yang sudah dilakukan di lapangan.
5. praduga_penyebab: Praduga awal akar masalah (tetap bersifat dugaan, bukan vonis final).
6. usulan_tindakan: Usulan tindakan awal atau mitigasi aman segera.
7. verifikasi: Tolok ukur verifikasi setelah perbaikan (isi "Menunggu perbaikan & verifikasi fisik" bila baru melapor).
8. suggestedTitle: Judul singkat laporan (5–9 kata) dalam Bahasa Indonesia teknis yang merangkum gejala utama dan kode tag aset.
9. suggestedUrgency: Isi "Mendesak" jika terdapat kebocoran/rembesan, panas ekstrem/overheating, vibrasi kritis/tinggi, tekanan berbahaya, asap/api, atau near miss; selain itu isi "Normal".

ATURAN WAJIB:
- Kembalikan HANYA JSON murni tanpa markdown code fence.
- Gunakan Bahasa Indonesia teknis industri migas yang ringkas, jelas, dan akurat.`;

function cleanJsonString(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function normalizeEntities(
  parsed: Partial<FailureEntities>,
  fallbackText: string
): FailureEntities {
  const local = generateLocalFallbackEntities(fallbackText);
  return {
    identitas_alat: parsed.identitas_alat?.trim() || local.identitas_alat,
    gejala: parsed.gejala?.trim() || local.gejala,
    kondisi_operasi: parsed.kondisi_operasi?.trim() || local.kondisi_operasi,
    pemeriksaan_awal: parsed.pemeriksaan_awal?.trim() || local.pemeriksaan_awal,
    praduga_penyebab: parsed.praduga_penyebab?.trim() || local.praduga_penyebab,
    usulan_tindakan: parsed.usulan_tindakan?.trim() || local.usulan_tindakan,
    verifikasi: parsed.verifikasi?.trim() || local.verifikasi,
  };
}

function inferFallbackUrgency(text: string): 'Mendesak' | 'Normal' {
  const lower = text.toLowerCase();
  const urgentPattern =
    /(bocor|kebocoran|rembes|rembesan|leak|panas ekstrem|overheat|suhu tinggi|vibrasi kritis|vibrasi tinggi|getar keras|bergetar keras|near miss|bahaya|darurat|asap|api|trip|pecah|kritis|darah|cedera)/i;
  return urgentPattern.test(lower) ? 'Mendesak' : 'Normal';
}

function normalizeUrgency(
  raw: unknown,
  fallbackText: string
): 'Mendesak' | 'Normal' {
  if (typeof raw === 'string') {
    const cleaned = raw.trim().toLowerCase();
    if (cleaned === 'mendesak' || cleaned === 'urgent' || cleaned === 'high') {
      return 'Mendesak';
    }
    if (cleaned === 'normal' || cleaned === 'standar' || cleaned === 'low') {
      return 'Normal';
    }
  }
  return inferFallbackUrgency(fallbackText);
}

function inferFallbackTitle(text: string, entities: FailureEntities): string {
  const combined = `${entities.identitas_alat} ${text}`.toUpperCase();
  let tag = 'Peralatan Unit';
  if (combined.includes('P-101') || combined.includes('POMPA')) {
    tag = 'Pompa P-101A';
  } else if (combined.includes('E-201') || combined.includes('HEAT') || combined.includes('EXCHANGER')) {
    tag = 'Heat Exchanger E-201';
  } else if (combined.includes('FCV') || combined.includes('VALVE') || combined.includes('KATUP')) {
    tag = 'Control Valve FCV-301';
  }

  const lower = text.toLowerCase();
  if (lower.includes('vibrasi') || lower.includes('getar')) {
    if (lower.includes('rembes') || lower.includes('seal') || lower.includes('bocor')) {
      return `Vibrasi Tinggi & Rembesan Seal pada ${tag}`;
    }
    return `Anomali Vibrasi Berlebih pada ${tag}`;
  }
  if (lower.includes('fouling') || lower.includes('delta') || lower.includes('suhu')) {
    return `Penurunan Performa Termal & Fouling pada ${tag}`;
  }
  if (lower.includes('gasket') || lower.includes('rembes') || lower.includes('bocor')) {
    return `Indikasi Kebocoran & Rembesan pada ${tag}`;
  }
  if (lower.includes('stroke') || lower.includes('lambat') || lower.includes('respons')) {
    return `Respons Pergerakan Melambat pada ${tag}`;
  }
  return `Temuan Anomali Operasional pada ${tag}`;
}

function formatGeminiError(err: unknown): string {
  if (err && typeof err === 'object') {
    const errObj = err as { status?: number; message?: string };
    const statusPrefix = errObj.status ? `HTTP ${errObj.status}: ` : '';
    const rawMsg = errObj.message || String(err);
    const shortMsg = rawMsg.split('\n')[0].slice(0, 180);
    return `${statusPrefix}${shortMsg}`;
  }
  return String(err).slice(0, 180);
}

function isInvalidKeyError(msg: string): boolean {
  const upper = msg.toUpperCase();
  return upper.includes('API_KEY_INVALID') || upper.includes('API KEY NOT VALID');
}

interface GeminiParsedPayload extends Partial<FailureEntities> {
  transcript?: string;
  suggestedTitle?: string;
  suggestedUrgency?: string;
}

export async function extractFailureEntitiesFromText(
  text: string
): Promise<LaporCepatExtractionResult> {
  const trimmed = text.trim();
  const genAI = getGenAI();

  if (!genAI) {
    const entities = generateLocalFallbackEntities(trimmed);
    return {
      transcript: trimmed,
      entities,
      suggestedTitle: inferFallbackTitle(trimmed, entities),
      suggestedUrgency: inferFallbackUrgency(trimmed),
      engine: 'local-fallback',
      errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
    };
  }

  let lastError = 'Semua model Gemini gagal merespons.';

  for (const modelName of GEMINI_MODEL_FALLBACKS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
        systemInstruction: SYSTEM_PROMPT_LAPOR_CEPAT,
      });

      const result = await model.generateContent(trimmed);
      const cleaned = cleanJsonString(result.response.text());
      const parsed = JSON.parse(cleaned) as GeminiParsedPayload;

      const entities = normalizeEntities(parsed, trimmed);
      const suggestedTitle =
        parsed.suggestedTitle?.trim() || inferFallbackTitle(trimmed, entities);
      const suggestedUrgency = normalizeUrgency(parsed.suggestedUrgency, trimmed);

      return {
        transcript: trimmed,
        entities,
        suggestedTitle,
        suggestedUrgency,
        engine: 'gemini-live',
        usedModel: modelName,
      };
    } catch (error) {
      const formatted = formatGeminiError(error);
      lastError = `[${modelName}] ${formatted}`;
      console.warn(`Gemini text extraction fallback (${modelName}):`, formatted);
      if (isInvalidKeyError(formatted)) {
        break;
      }
    }
  }

  const fallbackEntities = generateLocalFallbackEntities(trimmed);
  return {
    transcript: trimmed,
    entities: fallbackEntities,
    suggestedTitle: inferFallbackTitle(trimmed, fallbackEntities),
    suggestedUrgency: inferFallbackUrgency(trimmed),
    engine: 'local-fallback',
    errorReason: lastError,
  };
}

export async function extractFromAudio(
  audioBase64: string,
  mimeType: string
): Promise<LaporCepatExtractionResult> {
  const cleanMimeType = (mimeType || '').split(';')[0].trim() || 'audio/webm';
  const genAI = getGenAI();

  if (!genAI) {
    const fallbackText =
      'Lapor dari unit CDU, pompa P-101A bergetar cukup keras di area bearing drive end dan terlihat rembesan oli tipis di mechanical seal saat beban operasi 90%.';
    const entities = generateLocalFallbackEntities(fallbackText);
    return {
      transcript: fallbackText,
      entities,
      suggestedTitle: inferFallbackTitle(fallbackText, entities),
      suggestedUrgency: inferFallbackUrgency(fallbackText),
      engine: 'local-fallback',
      errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
    };
  }

  let lastError = 'Semua model Gemini gagal memproses audio.';

  for (const modelName of GEMINI_MODEL_FALLBACKS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
        systemInstruction: `${SYSTEM_PROMPT_LAPOR_CEPAT}\n10. transcript: Transkrip utuh verbatim dari ucapan teknisi pada rekaman audio (campuran Indonesia-Inggris apa adanya).`,
      });

      const result = await model.generateContent([
        {
          inlineData: {
            data: audioBase64,
            mimeType: cleanMimeType,
          },
        },
        'Transkripsikan rekaman suara teknisi ini secara utuh dan ekstrak 7 entitas kegagalan industri beserta suggestedTitle dan suggestedUrgency dalam JSON murni.',
      ]);

      const parsed = JSON.parse(
        cleanJsonString(result.response.text())
      ) as GeminiParsedPayload;

      const transcript =
        parsed.transcript?.trim() || 'Transkrip audio lapangan berhasil diproses.';
      const entities = normalizeEntities(parsed, transcript);
      const suggestedTitle =
        parsed.suggestedTitle?.trim() || inferFallbackTitle(transcript, entities);
      const suggestedUrgency = normalizeUrgency(
        parsed.suggestedUrgency,
        `${transcript} ${entities.gejala}`
      );

      return {
        transcript,
        entities,
        suggestedTitle,
        suggestedUrgency,
        engine: 'gemini-live',
        usedModel: modelName,
      };
    } catch (error) {
      const formatted = formatGeminiError(error);
      lastError = `[${modelName}] ${formatted}`;
      console.warn(`Gemini audio extraction fallback (${modelName}):`, formatted);
      if (isInvalidKeyError(formatted)) {
        break;
      }
    }
  }

  const fallbackText =
    'Rekaman suara lapangan: Terdeteksi vibrasi dan indikasi anomali pada peralatan. Perlu pemeriksaan awal dan foto bukti.';
  const fallbackEntities = generateLocalFallbackEntities(fallbackText);
  return {
    transcript: fallbackText,
    entities: fallbackEntities,
    suggestedTitle: inferFallbackTitle(fallbackText, fallbackEntities),
    suggestedUrgency: inferFallbackUrgency(fallbackText),
    engine: 'local-fallback',
    errorReason: lastError,
  };
}

export interface NameplateScanResult {
  assetTag: string;
  matchedAssetId: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  specifications: string;
  confidence: number;
  engine: 'gemini-live' | 'local-fallback';
  usedModel?: string;
  errorReason?: string;
  isUnknownAsset?: boolean;
}

export async function scanNameplateFromImage(
  imageBase64: string,
  mimeType: string
): Promise<NameplateScanResult> {
  const defaultResult: NameplateScanResult = {
    assetTag: 'P-101A',
    matchedAssetId: 'P-101A',
    manufacturer: 'Sulzer Pumps Ltd.',
    model: 'OH2 Centrifugal Multistage',
    serialNumber: 'SN-2024-8849-CDU',
    specifications: 'Head 142m · Flow 125 m³/h · Motor 75 kW · 2950 RPM',
    confidence: 0.95,
    engine: 'local-fallback',
    isUnknownAsset: false,
  };

  const genAI = getGenAI();
  if (!genAI) {
    return {
      ...defaultResult,
      errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
    };
  }

  const cleanMime = (mimeType || '').split(';')[0].trim() || 'image/jpeg';
  let lastError = 'Semua model Gemini Vision gagal memindai foto nameplate.';

  for (const modelName of GEMINI_MODEL_FALLBACKS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const prompt = `Analisis foto nameplate atau label kode tag peralatan industri ini dan kembalikan JSON murni:
{
  "assetTag": "Kode tag persis seperti tertulis (misal P-101A, E-201, FCV-301, atau tag lain yang terlihat)",
  "manufacturer": "Nama pabrikan atau 'Tidak Tertera'",
  "model": "Model atau jenis peralatan atau 'Tidak Tertera'",
  "serialNumber": "Nomor seri atau 'Tidak Tertera'",
  "specifications": "Spesifikasi teknis ringkas yang terbaca",
  "confidence": 0.95
}`;

      const result = await model.generateContent([
        {
          inlineData: {
            data: imageBase64,
            mimeType: cleanMime,
          },
        },
        prompt,
      ]);

      const parsed = JSON.parse(
        cleanJsonString(result.response.text())
      ) as Partial<NameplateScanResult>;

      const knownTags = ['P-101A', 'E-201', 'FCV-301'];
      const rawTag = (parsed.assetTag || '').trim().toUpperCase();
      const matched = knownTags.find(
        (t) => rawTag.includes(t) || rawTag.includes(t.replace('-', ''))
      );
      const isUnknownAsset = !matched;

      let confidence =
        typeof parsed.confidence === 'number' && !Number.isNaN(parsed.confidence)
          ? parsed.confidence
          : 0.92;
      if (confidence > 1) confidence = confidence / 100;
      confidence = Math.max(0, Math.min(1, confidence));

      return {
        assetTag: parsed.assetTag?.trim() || matched || 'Tidak Teridentifikasi',
        matchedAssetId: matched || '',
        manufacturer: parsed.manufacturer?.trim() || 'Tidak Tertera',
        model: parsed.model?.trim() || 'Tidak Tertera',
        serialNumber: parsed.serialNumber?.trim() || 'Tidak Tertera',
        specifications:
          parsed.specifications?.trim() || 'Data terbaca dari foto nameplate lapangan.',
        confidence,
        engine: 'gemini-live',
        usedModel: modelName,
        isUnknownAsset,
      };
    } catch (err) {
      const formatted = formatGeminiError(err);
      lastError = `[${modelName}] ${formatted}`;
      console.warn(`Gemini vision scan fallback (${modelName}):`, formatted);
      if (isInvalidKeyError(formatted)) {
        break;
      }
    }
  }

  return {
    ...defaultResult,
    errorReason: lastError,
  };
}

export function generateLocalFallbackEntities(text: string): FailureEntities {
  const upper = text.toUpperCase();
  let tag = 'P-101A';
  if (
    upper.includes('E-201') ||
    upper.includes('HEAT') ||
    upper.includes('EXCHANGER') ||
    upper.includes('FOULING')
  ) {
    tag = 'E-201';
  } else if (
    upper.includes('FCV') ||
    upper.includes('VALVE') ||
    upper.includes('KATUP') ||
    upper.includes('STROKE')
  ) {
    tag = 'FCV-301';
  }

  return {
    identitas_alat:
      tag === 'P-101A'
        ? 'Pompa Sentrifugal P-101A'
        : tag === 'E-201'
          ? 'Heat Exchanger E-201'
          : 'Control Valve FCV-301',
    gejala:
      text.trim().length > 15
        ? text.trim()
        : 'Anomali operasional teramati di lapangan saat patroli shift.',
    kondisi_operasi: 'Unit beroperasi kontinu pada kapasitas 85%–95% beban normal.',
    pemeriksaan_awal:
      'Observasi visual awal & pengecekan alat ukur portabel di lapangan.',
    praduga_penyebab:
      tag === 'P-101A'
        ? 'Praduga awal: keausan mechanical seal atau misalignment poros pompa.'
        : tag === 'E-201'
          ? 'Praduga awal: penumpukan kerak (fouling) tube bundle atau relaksasi gasket.'
          : 'Praduga awal: gesekan packing stem atau deviasi kalibrasi smart positioner.',
    usulan_tindakan:
      'Lakukan verifikasi fisik di lapangan, amankan area, dan siapkan rencana inspeksi departemen.',
    verifikasi: 'Kosong — menunggu tindakan perbaikan dan verifikasi fisik.',
  };
}
