import { GoogleGenAI } from '@google/genai';
import { Asset, FailureEntities } from '@/types/synqra';
import { INITIAL_ASSETS } from '@/lib/constants';
import { CDU11_ENGINEERING_BRIEF } from '@/lib/cduBalonganKnowledge';

export const GEMINI_MODEL = 'gemini-3.5-flash-lite';

export const GEMINI_MODEL_FALLBACKS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-4-hydrogen',
  'gemini-2.5-flash',
] as const;

export const GEMINI_VISION_MODEL_FALLBACKS = [
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite',
  'gemini-4-hydrogen',
  'gemini-2.5-flash',
] as const;

export const GEMINI_TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';

export const SYNQRA_CUSTOM_VOCABULARY = [
  'SYNQRA',
  'Unit 11 CDU Balongan',
  '11-C-106',
  '11-C-101',
  '11-F-101',
  '11-E-107',
  '11-V-101',
  '11-P-101',
  '11-FV-031',
  'Pre-Flash Column',
  'Main Fractionator',
  'Desalter',
  'DCS',
  'mechanical seal',
  'bearing drive end',
  'impeller',
  'misalignment',
  'kavitasi',
  'vibrasi',
  'fouling',
  'coking',
  'tube bundle',
  'heat exchanger',
  'fin-fan cooler',
  'control valve',
  'stiction',
  'flooding',
  'NH4Cl',
  'wet H2S',
  'TAN',
  'delta-T',
  'pressure drop',
  'near miss',
];

export async function withGeminiTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Timeout ${timeoutMs}ms pada model ${label}`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function getGenAI(apiVersion?: 'v1' | 'v1beta'): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    '';
  if (!apiKey) return null;
  return apiVersion
    ? new GoogleGenAI({ apiKey, apiVersion })
    : new GoogleGenAI({ apiKey });
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

export const SYSTEM_PROMPT_LAPOR_CEPAT = `Anda adalah asisten AI Industrial Engineering & Reliability untuk platform SYNQRA pada Unit 11 (CDU - Crude Distillation Unit) PT Pertamina RU VI Balongan.
Tugas Anda adalah menganalisis transkrip audio lapangan atau teks narasi campuran Bahasa Indonesia-Inggris dari teknisi kilang, lalu mengekstrak 7 entitas kegagalan peralatan beserta judul & urgensi dalam format JSON murni:

${CDU11_ENGINEERING_BRIEF}

SKEMA 9 FIELD JSON WAJIB:
1. identitas_alat: Kode tag & nama alat spesifik Unit 11 CDU (misal: "Pre-Flash Column 11-C-106", "Hot Preheater 11-E-107 A/B", "Crude Charge Furnace 11-F-101", "Control Valve 11-FV-031").
2. gejala: Gejala anomali yang teramati langsung (vibrasi, kebocoran, penurunan efisiensi/delta-T, flooding, fouling, korosi).
3. kondisi_operasi: Kondisi proses saat anomali terjadi (suhu, tekanan, delta-P, laju alir, beban unit).
4. pemeriksaan_awal: Pemeriksaan awal yang sudah dilakukan di lapangan.
5. praduga_penyebab: Praduga awal akar masalah (tetap bersifat dugaan/PRADUGA, bukan vonis final).
6. usulan_tindakan: Usulan tindakan awal atau mitigasi aman segera.
7. verifikasi: Tolok ukur verifikasi setelah perbaikan (isi "Menunggu perbaikan & verifikasi fisik" bila baru melapor).
8. suggestedTitle: Judul singkat laporan (5-10 kata) dalam Bahasa Indonesia teknis yang merangkum gejala utama dan kode tag aset.
9. suggestedUrgency: Isi "Mendesak" jika terdapat kebocoran hidrokarbon/H2S/kaustik, panas ekstrem/overheating TMT, vibrasi tinggi/kavitasi kritis, tekanan berbahaya, retak, atau near miss; selain itu isi "Normal".

ATURAN WAJIB:
- Kembalikan HANYA JSON murni sesuai skema yang diminta tanpa markdown code fence.
- DILARANG menggunakan karakter em-dash atau en-dash; gunakan tanda hubung biasa (-).
- Gunakan Bahasa Indonesia teknis industri kilang migas yang ringkas, jelas, dan akurat.`;

const SYNONYM_TAG_RULES: Array<[RegExp, string]> = [
  [/(pre-?flash\s*column|kolom\s*pre-?flash|preflash)/i, '11-C-106'],
  [/(main\s*fractionator|fraksinasi\s*utama|top\s*tray|puncak\s*kolom\s*cdu)/i, '11-C-101'],
  [/(lgo\s*stripper|side\s*stripper\s*lgo)/i, '11-C-102'],
  [/(hgo\s*stripper|side\s*stripper\s*hgo)/i, '11-C-103'],
  [/(stabilizer\s*column|naphtha\s*stabilizer|kolom\s*stabilizer)/i, '11-C-104'],
  [/(splitter\s*column|naphtha[- ]?kerosene\s*splitter|kolom\s*splitter)/i, '11-C-105'],
  [/(furnace|fired\s*heater|crude\s*heater|radiant|tmt|burner|pass\s*3)/i, '11-F-101'],
  [/(desalter|ampere\s*trafo|electrostatic)/i, '11-V-101 A/B'],
  [/(clay\s*treater|attapulgite|saybolt)/i, '11-V-113 A/B'],
  [/(kaustik|caustic|injeksi\s*kaustik)/i, '11-V-106'],
  [/(off-?gas\s*ko|knock\s*out\s*drum|fuel\s*gas\s*drum)/i, '11-V-103'],
  [/(seal\s*pot|reservoir\s*11-?p-?112)/i, '11-P-112-B-V1'],
  [/(overhead\s*accumulator|reflux\s*drum\s*utama|boot\s*air\s*11-?v-?102)/i, '11-V-102'],
  [/(stabilizer\s*overhead\s*drum|blistering|hic|sohic)/i, '11-V-104'],
  [/(pre-?flash\s*condenser\s*drum|drum\s*11-?v-?116)/i, '11-V-116'],
  [/(hot\s*preheater\s*11-?e-?107|11e107)/i, '11-E-107 A/B'],
  [/(fin[- ]?fan\s*naphtha|naphtha\s*air\s*cooler)/i, '11-E-124'],
  [/(fin[- ]?fan\s*overhead|overhead\s*condenser)/i, '11-E-114'],
  [/(combined\s*gas\s*oil|wax|parafinik)/i, '11-E-112'],
  [/(charge\s*pump|pompa\s*umpan\s*crude)/i, '11-P-101 A/B'],
  [/(desalted\s*crude\s*pump|pompa\s*desalted)/i, '11-P-102 A/B'],
  [/(top\s*pump[- ]?around\s*pump|pompa\s*tpa)/i, '11-P-104'],
  [/(middle\s*pump[- ]?around\s*pump|pompa\s*mpa)/i, '11-P-105'],
  [/(bottom\s*pump[- ]?around\s*pump|pompa\s*bpa)/i, '11-P-106'],
  [/(hgo.*valve|valve.*hgo|tan\s*hgo|asam\s*naftenat.*valve)/i, '11-FV-031'],
  [/(level\s*control\s*valve|kavitasi\s*valve\s*stabilizer)/i, '11-LV-030'],
];

/**
 * Mencocokkan teks narasi/kueri dengan 1 dari 66 aset Unit 11 CDU RU VI Balongan.
 */
export function matchCdu11AssetTag(
  text: string,
  catalog: Asset[] = INITIAL_ASSETS,
  options?: { strictTagOnly?: boolean }
): Asset | undefined {
  const raw = (text || '').trim();
  if (!raw) return undefined;

  const upper = raw.toUpperCase();
  const compact = upper.replace(/[^A-Z0-9]/g, '');

  // Urutkan aset dari base-tag terpanjang agar 11-P-112-B-V1 dicocokkan sebelum 11-P-112
  const sortedCatalog = [...catalog].sort((a, b) => b.id.length - a.id.length);

  for (const asset of sortedCatalog) {
    const baseTag = asset.id.replace(/\s+[A-Z](\/[A-Z])+$/i, '').trim().toUpperCase();
    const baseCompact = baseTag.replace(/[^A-Z0-9]/g, '');
    const exactIdCompact = asset.id.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (upper.includes(asset.id.toUpperCase()) || compact.includes(exactIdCompact)) {
      return asset;
    }

    const escapedBase = baseTag.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const tagRegex = new RegExp(`(?:^|[^A-Z0-9])${escapedBase}(?:[A-D]|(?![0-9]))`, 'i');
    if (tagRegex.test(upper)) {
      return asset;
    }

    const compactRegex = new RegExp(`${baseCompact}(?:[A-D]|(?![0-9]))`, 'i');
    if (baseCompact.length >= 5 && compactRegex.test(compact)) {
      return asset;
    }
  }

  if (options?.strictTagOnly) {
    return undefined;
  }

  for (const [pattern, targetId] of SYNONYM_TAG_RULES) {
    if (pattern.test(raw)) {
      const found = catalog.find((a) => a.id === targetId);
      if (found) return found;
    }
  }

  return undefined;
}

const LAPOR_CEPAT_BASE_PROPERTIES = {
  identitas_alat: {
    type: 'string',
    description: 'Tag dan nama peralatan industri yang dilaporkan.',
  },
  gejala: {
    type: 'string',
    description: 'Gejala anomali fisik atau operasional yang teramati di lapangan.',
  },
  kondisi_operasi: {
    type: 'string',
    description: 'Kondisi parameter operasi saat temuan terjadi.',
  },
  pemeriksaan_awal: {
    type: 'string',
    description: 'Pemeriksaan awal visual atau instrumen portabel di lapangan.',
  },
  praduga_penyebab: {
    type: 'string',
    description: 'Praduga awal akar masalah teknis (bersifat dugaan awal).',
  },
  usulan_tindakan: {
    type: 'string',
    description: 'Usulan tindakan mitigasi atau inspeksi awal yang aman.',
  },
  verifikasi: {
    type: 'string',
    description: 'Tolok ukur verifikasi pasca-perbaikan.',
  },
  suggestedTitle: {
    type: 'string',
    description: 'Judul singkat laporan 5-9 kata merangkum gejala dan tag aset.',
  },
  suggestedUrgency: {
    type: 'string',
    enum: ['Mendesak', 'Normal'],
    description: 'Tingkat urgensi laporan.',
  },
};

const LAPOR_CEPAT_TEXT_SCHEMA = {
  type: 'object',
  properties: LAPOR_CEPAT_BASE_PROPERTIES,
  required: [
    'identitas_alat',
    'gejala',
    'kondisi_operasi',
    'pemeriksaan_awal',
    'praduga_penyebab',
    'usulan_tindakan',
    'verifikasi',
    'suggestedTitle',
    'suggestedUrgency',
  ],
};

const LAPOR_CEPAT_AUDIO_SCHEMA = {
  type: 'object',
  properties: {
    transcript: {
      type: 'string',
      description:
        'Transkrip utuh verbatim dari ucapan teknisi pada rekaman audio (campuran Bahasa Indonesia-Inggris apa adanya).',
    },
    ...LAPOR_CEPAT_BASE_PROPERTIES,
  },
  required: [
    'transcript',
    'identitas_alat',
    'gejala',
    'kondisi_operasi',
    'pemeriksaan_awal',
    'praduga_penyebab',
    'usulan_tindakan',
    'verifikasi',
    'suggestedTitle',
    'suggestedUrgency',
  ],
};

const NAMEPLATE_SCAN_SCHEMA = {
  type: 'object',
  properties: {
    assetTag: {
      type: 'string',
      description:
        'Kode tag persis seperti tertulis pada pelat tag/label/casing (misal 11-C-106, 11-F-101, 11-E-107 A/B, 11-V-101 A/B, 11-P-101 A/B, 11-FV-031), atau Tidak Teridentifikasi.',
    },
    equipmentType: {
      type: 'string',
      description: 'Jenis peralatan yang terlihat secara visual dalam Bahasa Indonesia singkat.',
    },
    manufacturer: {
      type: 'string',
      description: 'Nama pabrikan hanya jika tercetak fisik pada plat; jika tidak kembalikan string kosong.',
    },
    model: {
      type: 'string',
      description: 'Nomor/kode model hanya jika tercetak fisik pada plat; jika tidak kembalikan string kosong.',
    },
    serialNumber: {
      type: 'string',
      description: 'Nomor seri hanya jika tercetak fisik pada plat; jika tidak kembalikan string kosong.',
    },
    specifications: {
      type: 'string',
      description: 'Spesifikasi teknis ringkas yang terbaca dari plat atau ciri mekanis peralatan.',
    },
    visualObservation: {
      type: 'string',
      description: '1-2 kalimat teknis ringkas dalam Bahasa Indonesia tentang kondisi fisik aktual peralatan pada foto.',
    },
    hasVisibleAnomaly: {
      type: 'boolean',
      description: 'True jika tampak anomali visual seperti kebocoran, rembesan, korosi berat, atau kerusakan.',
    },
    suggestedNarrative: {
      type: 'string',
      description: 'Narasi temuan siap pakai 1-2 kalimat jika hasVisibleAnomaly true, atau string kosong.',
    },
    confidence: {
      type: 'number',
      description: 'Tingkat keyakinan pembacaan antara 0 dan 1.',
    },
  },
  required: [
    'assetTag',
    'equipmentType',
    'manufacturer',
    'model',
    'serialNumber',
    'specifications',
    'visualObservation',
    'hasVisibleAnomaly',
    'suggestedNarrative',
    'confidence',
  ],
};

export function cleanJsonString(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/[\u2013\u2014]/g, '-')
    .trim();
}

export function stripForbiddenDashes(text: string): string {
  return text.replace(/[\u2013\u2014]/g, '-').trim();
}

export function normalizeAudioMimeType(rawMime: string): string {
  const base = (rawMime || '').split(';')[0].trim().toLowerCase();
  if (!base) return 'audio/webm';
  if (base === 'audio/mp4' || base === 'audio/x-m4a' || base === 'video/mp4') {
    return 'audio/m4a';
  }
  if (base === 'audio/x-wav' || base === 'audio/wave') {
    return 'audio/wav';
  }
  if (base === 'audio/mp3' || base === 'audio/mpeg3' || base === 'audio/x-mp3') {
    return 'audio/mp3';
  }
  if (base === 'video/webm') {
    return 'audio/webm';
  }
  if (base === 'application/ogg' || base === 'audio/vorbis') {
    return 'audio/ogg';
  }
  return base;
}

function normalizeEntities(
  parsed: Partial<FailureEntities>,
  fallbackText: string,
  hintAssetId?: string
): FailureEntities {
  const local = generateLocalFallbackEntities(fallbackText, hintAssetId);
  return {
    identitas_alat: stripForbiddenDashes(parsed.identitas_alat?.trim() || local.identitas_alat),
    gejala: stripForbiddenDashes(parsed.gejala?.trim() || local.gejala),
    kondisi_operasi: stripForbiddenDashes(parsed.kondisi_operasi?.trim() || local.kondisi_operasi),
    pemeriksaan_awal: stripForbiddenDashes(parsed.pemeriksaan_awal?.trim() || local.pemeriksaan_awal),
    praduga_penyebab: stripForbiddenDashes(parsed.praduga_penyebab?.trim() || local.praduga_penyebab),
    usulan_tindakan: stripForbiddenDashes(parsed.usulan_tindakan?.trim() || local.usulan_tindakan),
    verifikasi: stripForbiddenDashes(parsed.verifikasi?.trim() || local.verifikasi),
  };
}

function inferFallbackUrgency(text: string): 'Mendesak' | 'Normal' {
  const lower = text.toLowerCase();
  const urgentPattern =
    /(bocor|kebocoran|rembes|rembesan|leak|panas ekstrem|overheat|suhu tinggi|hot spot|tmt|vibrasi kritis|vibrasi tinggi|getar keras|bergetar keras|kavitasi|h2s|kaustik|retak|near miss|bahaya|darurat|asap|api|trip|pecah|kritis|flooding)/i;
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
  const matched = matchCdu11AssetTag(`${entities.identitas_alat} ${text}`);
  const tag = matched ? `${matched.name} ${matched.id}` : entities.identitas_alat || 'Aset Unit 11 CDU';

  const lower = text.toLowerCase();
  if (lower.includes('flooding') || lower.includes('tray') || lower.includes('gamma')) {
    return `Indikasi Gangguan Tray & Kenaikan DP ${tag}`;
  }
  if (lower.includes('tmt') || lower.includes('hot spot') || lower.includes('coking')) {
    return `Kenaikan TMT & Hot Spot Radiant Tube ${tag}`;
  }
  if (lower.includes('kavitasi') || lower.includes('vibrasi') || lower.includes('getar')) {
    return `Anomali Vibrasi & Kavitasi pada ${tag}`;
  }
  if (lower.includes('fouling') || lower.includes('efisiensi') || lower.includes('rd')) {
    return `Penurunan Performa Termal & Fouling pada ${tag}`;
  }
  if (lower.includes('korosi') || lower.includes('naftenat') || lower.includes('hcl') || lower.includes('kaustik')) {
    return `Indikasi Penipisan & Korosi Material pada ${tag}`;
  }
  if (lower.includes('stiction') || lower.includes('stroke') || lower.includes('positioner')) {
    return `Anomali Respons Kontrol & Aktuator pada ${tag}`;
  }
  return `Temuan Anomali Operasional pada ${tag}`;
}

export function formatGeminiError(err: unknown): string {
  if (err && typeof err === 'object') {
    const errObj = err as { status?: number; code?: string | number; message?: string };
    const statusPrefix = errObj.status ? `HTTP ${errObj.status}: ` : '';
    const rawMsg = errObj.message || String(err);
    const shortMsg = rawMsg.split('\n')[0].slice(0, 180);
    return stripForbiddenDashes(`${statusPrefix}${shortMsg}`);
  }
  return stripForbiddenDashes(String(err).slice(0, 180));
}

export function isInvalidKeyError(msg: string): boolean {
  const upper = msg.toUpperCase();
  return upper.includes('API_KEY_INVALID') || upper.includes('API KEY NOT VALID');
}

interface GeminiParsedPayload extends Partial<FailureEntities> {
  transcript?: string;
  suggestedTitle?: string;
  suggestedUrgency?: string;
}

export async function extractFailureEntitiesFromText(
  text: string,
  hintAssetId?: string
): Promise<LaporCepatExtractionResult> {
  const trimmed = stripForbiddenDashes(text.trim());
  const ai = getGenAI();

  if (!ai) {
    const entities = generateLocalFallbackEntities(trimmed, hintAssetId);
    return {
      transcript: trimmed,
      entities,
      suggestedTitle: inferFallbackTitle(trimmed, entities),
      suggestedUrgency: inferFallbackUrgency(trimmed),
      engine: 'local-fallback',
      errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
    };
  }

  const errors: string[] = [];
  const promptInput = hintAssetId
    ? `Konteks aset terpilih: ${hintAssetId}\nNarasi temuan lapangan:\n${trimmed}`
    : trimmed;

  for (const modelName of GEMINI_MODEL_FALLBACKS) {
    try {
      const interaction = await withGeminiTimeout(
        ai.interactions.create({
          model: modelName,
          input: promptInput,
          system_instruction: SYSTEM_PROMPT_LAPOR_CEPAT,
          generation_config: {
            thinking_level: 'low',
          },
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: LAPOR_CEPAT_TEXT_SCHEMA,
          },
          store: false,
        }),
        10000,
        modelName
      );

      const rawOutput = interaction.output_text || '';
      if (!rawOutput.trim()) {
        throw new Error('Respons teks kosong dari model.');
      }

      const parsed = JSON.parse(cleanJsonString(rawOutput)) as GeminiParsedPayload;
      const entities = normalizeEntities(parsed, trimmed, hintAssetId);
      const suggestedTitle = stripForbiddenDashes(
        parsed.suggestedTitle?.trim() || inferFallbackTitle(trimmed, entities)
      );
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
      errors.push(`[${modelName}] ${formatted}`);
      console.warn(`Gemini text extraction fallback (${modelName}):`, formatted);
      if (isInvalidKeyError(formatted)) {
        break;
      }
    }
  }

  const fallbackEntities = generateLocalFallbackEntities(trimmed, hintAssetId);
  return {
    transcript: trimmed,
    entities: fallbackEntities,
    suggestedTitle: inferFallbackTitle(trimmed, fallbackEntities),
    suggestedUrgency: inferFallbackUrgency(trimmed),
    engine: 'local-fallback',
    errorReason: errors[0] || 'Semua model Gemini gagal merespons.',
  };
}

async function transcribeAudioWithDedicatedModel(
  audioBase64: string,
  cleanMimeType: string
): Promise<string | null> {
  const aiBeta = getGenAI('v1beta');
  if (!aiBeta) return null;

  try {
    const interaction = await aiBeta.interactions.create({
      model: GEMINI_TRANSCRIBE_MODEL,
      input: [
        {
          type: 'audio',
          data: audioBase64,
          mime_type: cleanMimeType,
        },
      ],
      generation_config: {
        transcription_config: {
          custom_vocabulary: SYNQRA_CUSTOM_VOCABULARY,
        },
      },
      store: false,
    });

    const text = interaction.output_text?.trim() || '';
    return text.length > 0 ? text : null;
  } catch (err) {
    console.warn(
      `Dedicated ASR (${GEMINI_TRANSCRIBE_MODEL}) fallback:`,
      formatGeminiError(err)
    );
    return null;
  }
}

export interface AudioExtractionOptions {
  hintAssetId?: string;
  clientTranscript?: string;
}

export async function extractFromAudio(
  audioBase64: string,
  mimeType: string,
  options?: AudioExtractionOptions
): Promise<LaporCepatExtractionResult> {
  const cleanMimeType = normalizeAudioMimeType(mimeType);
  const hintAssetId = options?.hintAssetId?.trim() || '';
  const clientTranscript = options?.clientTranscript?.trim() || '';
  const ai = getGenAI();

  if (!ai) {
    const fallbackText =
      clientTranscript ||
      `Lapor dari Unit 11 CDU Balongan pada aset ${hintAssetId || '11-P-101 A/B'}: teramati indikasi anomali operasional saat inspeksi shift.`;
    const entities = generateLocalFallbackEntities(fallbackText, hintAssetId);
    return {
      transcript: fallbackText,
      entities,
      suggestedTitle: inferFallbackTitle(fallbackText, entities),
      suggestedUrgency: inferFallbackUrgency(fallbackText),
      engine: 'local-fallback',
      errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
    };
  }

  const errors: string[] = [];
  const assetContextHint = hintAssetId
    ? `Konteks peralatan terpilih oleh teknisi: ${hintAssetId}. `
    : '';
  const vocabHint = `Kosakata domain kilang: ${SYNQRA_CUSTOM_VOCABULARY.join(', ')}.`;

  // 1. Jalur Utama: Multimodal Audio + Structured JSON dalam 1 pass cepat
  for (const modelName of GEMINI_VISION_MODEL_FALLBACKS) {
    try {
      const interaction = await withGeminiTimeout(
        ai.interactions.create({
          model: modelName,
          input: [
            {
              type: 'audio',
              data: audioBase64,
              mime_type: cleanMimeType,
            },
            {
              type: 'text',
              text: `${assetContextHint}Transkripsikan rekaman suara teknisi ini secara utuh verbatim ke field "transcript", lalu ekstrak 7 entitas kegagalan industri beserta suggestedTitle dan suggestedUrgency dalam JSON murni.`,
            },
          ],
          system_instruction: `${SYSTEM_PROMPT_LAPOR_CEPAT}\n10. transcript: Transkrip utuh verbatim dari ucapan teknisi pada rekaman audio (campuran Bahasa Indonesia-Inggris apa adanya, jangan diringkas).\n${vocabHint}`,
          generation_config: {
            thinking_level: 'low',
          },
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: LAPOR_CEPAT_AUDIO_SCHEMA,
          },
          store: false,
        }),
        14000,
        modelName
      );

      const rawOutput = interaction.output_text || '';
      if (!rawOutput.trim()) {
        throw new Error('Respons audio kosong dari model.');
      }

      const parsed = JSON.parse(cleanJsonString(rawOutput)) as GeminiParsedPayload;
      const transcript = stripForbiddenDashes(
        parsed.transcript?.trim() ||
          clientTranscript ||
          'Transkrip audio lapangan berhasil diproses.'
      );
      const entities = normalizeEntities(parsed, transcript, hintAssetId);
      const suggestedTitle = stripForbiddenDashes(
        parsed.suggestedTitle?.trim() || inferFallbackTitle(transcript, entities)
      );
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
      errors.push(`[${modelName}] ${formatted}`);
      console.warn(`Gemini audio extraction fallback (${modelName}):`, formatted);
      if (isInvalidKeyError(formatted)) {
        break;
      }
    }
  }

  // 2. Jalur Cadangan ASR Khusus: gemini-3.5-transcribe -> ekstraksi teks
  if (!errors.some((e) => isInvalidKeyError(e))) {
    const dedicatedTranscript = await transcribeAudioWithDedicatedModel(
      audioBase64,
      cleanMimeType
    );
    if (dedicatedTranscript) {
      const textExtraction = await extractFailureEntitiesFromText(
        dedicatedTranscript,
        hintAssetId
      );
      return {
        ...textExtraction,
        transcript: dedicatedTranscript,
        engine: 'gemini-live',
        usedModel: textExtraction.usedModel
          ? `${GEMINI_TRANSCRIBE_MODEL} + ${textExtraction.usedModel}`
          : GEMINI_TRANSCRIBE_MODEL,
        errorReason: undefined,
      };
    }
  }

  // 3. Fallback Lokal Cerdas (utamakan clientTranscript asli dari mikrofon bila tersedia)
  const fallbackText =
    clientTranscript ||
    'Rekaman suara lapangan Unit 11 CDU: Terdeteksi indikasi anomali operasional pada peralatan. Perlu pemeriksaan awal dan bukti fisik.';
  const fallbackEntities = generateLocalFallbackEntities(fallbackText, hintAssetId);
  return {
    transcript: fallbackText,
    entities: fallbackEntities,
    suggestedTitle: inferFallbackTitle(fallbackText, fallbackEntities),
    suggestedUrgency: inferFallbackUrgency(fallbackText),
    engine: 'local-fallback',
    errorReason: errors[0] || 'Semua model Gemini gagal memproses audio.',
  };
}

export interface NameplateScanResult {
  assetTag: string;
  matchedAssetId: string;
  equipmentType?: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  specifications: string;
  visualObservation?: string;
  hasVisibleAnomaly?: boolean;
  suggestedNarrative?: string;
  metadataSource?: 'nameplate-ocr' | 'asset-catalog';
  confidence: number;
  engine: 'gemini-live' | 'local-fallback';
  usedModel?: string;
  errorReason?: string;
  isUnknownAsset?: boolean;
}

const PLACEHOLDER_VISION_VALUES = new Set([
  '',
  '-',
  'n/a',
  'na',
  'none',
  'null',
  'undefined',
  'unknown',
  'tidak tertera',
  'tidak diketahui',
  'tidak terlihat',
  'tidak terbaca',
  'tidak ada',
]);

function cleanVisionField(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = stripForbiddenDashes(value);
  if (PLACEHOLDER_VISION_VALUES.has(trimmed.toLowerCase())) {
    return '';
  }
  return trimmed;
}

export async function scanNameplateFromImage(
  imageBase64: string,
  mimeType: string
): Promise<NameplateScanResult> {
  const defaultAsset = INITIAL_ASSETS.find((a) => a.id === '11-P-101 A/B') || INITIAL_ASSETS[0];
  const defaultResult: NameplateScanResult = {
    assetTag: defaultAsset.id,
    matchedAssetId: defaultAsset.id,
    equipmentType: defaultAsset.name,
    manufacturer: 'PT Pertamina RU VI Balongan Catalog',
    model: defaultAsset.subtitle,
    serialNumber: `CDU11-${defaultAsset.id.replace(/[^A-Z0-9]/g, '')}`,
    specifications: defaultAsset.description,
    visualObservation:
      'Mode simulasi lokal aktif. Pilih atau unggah ulang foto saat layanan Gemini Vision aktif untuk OCR langsung.',
    hasVisibleAnomaly: false,
    suggestedNarrative: '',
    metadataSource: 'asset-catalog',
    confidence: 0.92,
    engine: 'local-fallback',
    isUnknownAsset: false,
  };

  const ai = getGenAI();
  if (!ai) {
    return {
      ...defaultResult,
      errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
    };
  }

  const cleanMime = (mimeType || '').split(';')[0].trim() || 'image/jpeg';
  const errors: string[] = [];

  const tagRoster = INITIAL_ASSETS.map((a) => `${a.id} (${a.name})`).join(', ');
  const prompt = `Anda adalah engineer reliability kilang migas di Unit 11 (CDU) PT Pertamina RU VI Balongan yang menganalisis foto nameplate ATAU foto lapangan peralatan industri.
Daftar 66 kode tag terdaftar Unit 11 CDU: ${tagRoster}.
Periksa foto fisik peralatannya secara cermat (abaikan tombol/UI kamera layar ponsel bila ini foto layar) dan kembalikan JSON murni sesuai skema.`;

  for (const modelName of GEMINI_VISION_MODEL_FALLBACKS) {
    try {
      const interaction = await withGeminiTimeout(
        ai.interactions.create({
          model: modelName,
          input: [
            {
              type: 'image',
              data: imageBase64,
              mime_type: cleanMime,
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
          generation_config: {
            thinking_level: 'low',
          },
          response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: NAMEPLATE_SCAN_SCHEMA,
          },
          store: false,
        }),
        12000,
        modelName
      );

      const rawOutput = interaction.output_text || '';
      if (!rawOutput.trim()) {
        throw new Error('Respons Vision kosong dari model.');
      }

      const parsed = JSON.parse(
        cleanJsonString(rawOutput)
      ) as Partial<NameplateScanResult>;

      const rawTag = cleanVisionField(parsed.assetTag);
      const rawTypeHint = cleanVisionField(parsed.equipmentType);
      const matchedObj = matchCdu11AssetTag(
        rawTag || `${rawTypeHint} ${cleanVisionField(parsed.specifications)}`,
        INITIAL_ASSETS
      );
      const isUnknownAsset = !matchedObj;

      const manufacturer = cleanVisionField(parsed.manufacturer);
      const modelCode = cleanVisionField(parsed.model);
      const serialNumber = cleanVisionField(parsed.serialNumber);

      const equipmentType =
        cleanVisionField(parsed.equipmentType) || matchedObj?.name || '';
      const specifications =
        cleanVisionField(parsed.specifications) ||
        matchedObj?.description ||
        'Data terbaca dari foto lapangan Unit 11 CDU.';
      const visualObservation = cleanVisionField(parsed.visualObservation);
      const hasVisibleAnomaly = Boolean(
        parsed.hasVisibleAnomaly && visualObservation
      );
      const suggestedNarrative = hasVisibleAnomaly
        ? cleanVisionField(parsed.suggestedNarrative) || visualObservation
        : '';
      const metadataSource: 'nameplate-ocr' | 'asset-catalog' =
        manufacturer || modelCode || serialNumber
          ? 'nameplate-ocr'
          : matchedObj
            ? 'asset-catalog'
            : 'nameplate-ocr';

      let confidence =
        typeof parsed.confidence === 'number' && !Number.isNaN(parsed.confidence)
          ? parsed.confidence
          : 0.92;
      if (confidence > 1) confidence = confidence / 100;
      confidence = Math.max(0, Math.min(1, confidence));

      return {
        assetTag: rawTag || matchedObj?.id || 'Tidak Teridentifikasi',
        matchedAssetId: matchedObj?.id || '',
        equipmentType,
        manufacturer,
        model: modelCode,
        serialNumber,
        specifications,
        visualObservation,
        hasVisibleAnomaly,
        suggestedNarrative,
        metadataSource,
        confidence,
        engine: 'gemini-live',
        usedModel: modelName,
        isUnknownAsset,
      };
    } catch (err) {
      const formatted = formatGeminiError(err);
      errors.push(`[${modelName}] ${formatted}`);
      console.warn(`Gemini vision scan fallback (${modelName}):`, formatted);
      if (isInvalidKeyError(formatted)) {
        break;
      }
    }
  }

  return {
    ...defaultResult,
    errorReason: errors[0] || 'Semua model Gemini Vision gagal memindai foto nameplate.',
  };
}

export function generateLocalFallbackEntities(
  text: string,
  hintAssetId?: string
): FailureEntities {
  const clean = stripForbiddenDashes(text);
  const matched =
    matchCdu11AssetTag(`${clean} ${hintAssetId || ''}`) || INITIAL_ASSETS[0];
  const lower = clean.toLowerCase();

  let praduga = `Praduga awal: anomali operasional atau degradasi mekanis/proses pada ${matched.id}.`;
  let tindakan = `Lakukan verifikasi fisik di lapangan pada ${matched.id} (${matched.area}) dan lengkapi data bukti pendukung.`;

  if (matched.categoryCode === 'C') {
    praduga =
      'Praduga awal: fouling tray / deposit garam amonium klorida atau gangguan hidrolika (flooding/weeping) pada seksi kolom.';
    tindakan =
      'Evaluasi tren delta-P kolom, sampel sour water / produk samping, serta jadwalkan pemindaian gamma scan bila diperlukan.';
  } else if (matched.categoryCode === 'F') {
    praduga =
      'Praduga awal: coking internal tube pass atau pembakaran tidak merata dari gas tip burner pada furnace 11-F-101.';
    tindakan =
      'Pantau TMT via termografi IR terkoreksi emisivitas, seimbangkan aliran antar-pass, dan periksa burner/KO drum 11-V-103.';
  } else if (matched.categoryCode === 'E') {
    praduga =
      matched.type === 'finfan'
        ? 'Praduga awal: fouling debu pada sirip air cooler, gangguan fan pitch, atau deposisi wax di dinding tube.'
        : 'Praduga awal: akumulasi fouling kerak/aspalten di tube bundle atau kebocoran gasket/tube silang.';
    tindakan =
      'Pantau delta-T, delta-P, dan efisiensi pertukaran panas; jadwalkan hydrojetting atau uji tekan bundel tube.';
  } else if (matched.categoryCode === 'V') {
    praduga =
      'Praduga awal: gangguan pemisahan fasa/emulsi, korosi sour water / H2S basah pada boot, atau kejenuhan media adsorben.';
    tindakan =
      'Ambil sampel effluent/sour water untuk analisis laboratorium dan jadwalkan inspeksi ketebalan UT/PAUT pada titik kritis.';
  } else if (matched.categoryCode === 'P') {
    praduga =
      lower.includes('seal') || lower.includes('rembes')
        ? 'Praduga awal: keausan face mechanical seal, gangguan jalur flush/steam quench, atau misalignment kopling.'
        : 'Praduga awal: penurunan margin NPSH (kavitasi), penyumbatan strainer suction, atau cacat bearing.';
    tindakan =
      'Ukur vibrasi ISO 10816-3 (DE/NDE), periksa strainer & level tangki hisap, atau pindahkan operasi ke pompa standby.';
  } else if (matched.categoryCode === 'I') {
    praduga =
      lower.includes('penipisan') || lower.includes('korosi') || lower.includes('tan')
        ? 'Praduga awal: erosi-kavitasi pada trim valve atau korosi asam naftenat (NAC) di area turbulen hilir valve.'
        : 'Praduga awal: stiction/histeresis pada packing stem atau deviasi kalibrasi smart positioner.';
    tindakan =
      'Analisis plot OP-PV pada DCS, cek suplai udara instrumen, dan jadwalkan pengukuran UT hilir spool atau kalibrasi aktuator.';
  }

  return {
    identitas_alat: `${matched.name} ${matched.id}`,
    gejala:
      clean.length > 15
        ? clean
        : `Anomali operasional teramati di lapangan pada ${matched.id} saat patroli shift.`,
    kondisi_operasi: `Operasi kontinu Unit 11 CDU RU VI Balongan pada seksi ${matched.area.split(' · ')[0]}.`,
    pemeriksaan_awal: 'Observasi visual awal & pembacaan instrumen lokal/DCS di lapangan.',
    praduga_penyebab: praduga,
    usulan_tindakan: tindakan,
    verifikasi: 'Menunggu tindakan perbaikan & verifikasi bukti fisik.',
  };
}
