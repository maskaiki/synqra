import { GoogleGenAI } from '@google/genai';
import { FailureEntities } from '@/types/synqra';

export const GEMINI_MODEL = 'gemini-4-hydrogen';

export const GEMINI_MODEL_FALLBACKS = [
  'gemini-4-hydrogen',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
] as const;

export const GEMINI_TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';

export const SYNQRA_CUSTOM_VOCABULARY = [
  'SYNQRA',
  'P-101A',
  'E-201',
  'FCV-301',
  'CDU',
  'DCS',
  'mechanical seal',
  'bearing drive end',
  'impeller',
  'misalignment',
  'vibrasi',
  'fouling',
  'tube bundle',
  'heat exchanger',
  'control valve',
  'gasket',
  'flange',
  'gland stem',
  'packing stem',
  'smart positioner',
  'aktuator',
  'filter regulator',
  'delta-T',
  'pressure drop',
  'stroke',
  'near miss',
];

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

export const SYSTEM_PROMPT_LAPOR_CEPAT = `Anda adalah asisten AI Industrial Engineering & Reliability untuk platform SYNQRA (Industri Pengolahan Minyak & Gas).
Tugas Anda adalah menganalisis transkrip audio lapangan atau teks narasi campuran Bahasa Indonesia-Inggris dari teknisi pabrik, lalu mengekstrak 7 entitas kegagalan peralatan beserta judul & urgensi dalam format JSON murni:

1. identitas_alat: Tag/nama alat (misal: "Pompa Sentrifugal P-101A", "Heat Exchanger E-201", "Control Valve FCV-301").
2. gejala: Gejala anomali yang teramati langsung (vibrasi, kebocoran, penurunan suhu, respons lambat).
3. kondisi_operasi: Kondisi proses saat anomali terjadi (suhu, tekanan, laju alir, beban motor).
4. pemeriksaan_awal: Pemeriksaan awal yang sudah dilakukan di lapangan.
5. praduga_penyebab: Praduga awal akar masalah (tetap bersifat dugaan, bukan vonis final).
6. usulan_tindakan: Usulan tindakan awal atau mitigasi aman segera.
7. verifikasi: Tolok ukur verifikasi setelah perbaikan (isi "Menunggu perbaikan & verifikasi fisik" bila baru melapor).
8. suggestedTitle: Judul singkat laporan (5-9 kata) dalam Bahasa Indonesia teknis yang merangkum gejala utama dan kode tag aset.
9. suggestedUrgency: Isi "Mendesak" jika terdapat kebocoran/rembesan, panas ekstrem/overheating, vibrasi kritis/tinggi, tekanan berbahaya, asap/api, atau near miss; selain itu isi "Normal".

ATURAN WAJIB:
- Kembalikan HANYA JSON murni sesuai skema yang diminta tanpa markdown code fence.
- Gunakan Bahasa Indonesia teknis industri migas yang ringkas, jelas, dan akurat.`;

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
        'Kode tag persis seperti tertulis pada pelat tag/label/casing (misal P-101A, E-201, FCV-301), atau Tidak Teridentifikasi.',
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
    .trim();
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
  } else if (
    combined.includes('E-201') ||
    combined.includes('HEAT') ||
    combined.includes('EXCHANGER')
  ) {
    tag = 'Heat Exchanger E-201';
  } else if (
    combined.includes('FCV') ||
    combined.includes('VALVE') ||
    combined.includes('KATUP')
  ) {
    tag = 'Control Valve FCV-301';
  }

  const lower = text.toLowerCase();
  if (lower.includes('vibrasi') || lower.includes('getar')) {
    if (
      lower.includes('rembes') ||
      lower.includes('seal') ||
      lower.includes('bocor')
    ) {
      return `Vibrasi Tinggi & Rembesan Seal pada ${tag}`;
    }
    return `Anomali Vibrasi Berlebih pada ${tag}`;
  }
  if (
    lower.includes('fouling') ||
    lower.includes('delta') ||
    lower.includes('suhu')
  ) {
    return `Penurunan Performa Termal & Fouling pada ${tag}`;
  }
  if (
    lower.includes('gasket') ||
    lower.includes('rembes') ||
    lower.includes('bocor')
  ) {
    return `Indikasi Kebocoran & Rembesan pada ${tag}`;
  }
  if (
    lower.includes('stroke') ||
    lower.includes('lambat') ||
    lower.includes('respons')
  ) {
    return `Respons Pergerakan Melambat pada ${tag}`;
  }
  return `Temuan Anomali Operasional pada ${tag}`;
}

export function formatGeminiError(err: unknown): string {
  if (err && typeof err === 'object') {
    const errObj = err as { status?: number; code?: string | number; message?: string };
    const statusPrefix = errObj.status ? `HTTP ${errObj.status}: ` : '';
    const rawMsg = errObj.message || String(err);
    const shortMsg = rawMsg.split('\n')[0].slice(0, 180);
    return `${statusPrefix}${shortMsg}`;
  }
  return String(err).slice(0, 180);
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
  const trimmed = text.trim();
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
      const interaction = await ai.interactions.create({
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
      });

      const rawOutput = interaction.output_text || '';
      if (!rawOutput.trim()) {
        throw new Error('Respons teks kosong dari model.');
      }

      const parsed = JSON.parse(cleanJsonString(rawOutput)) as GeminiParsedPayload;
      const entities = normalizeEntities(parsed, trimmed, hintAssetId);
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
      `Lapor lapangan pada aset ${hintAssetId || 'P-101A'}: teramati indikasi anomali operasional saat inspeksi shift.`;
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
  for (const modelName of GEMINI_MODEL_FALLBACKS) {
    try {
      const interaction = await ai.interactions.create({
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
      });

      const rawOutput = interaction.output_text || '';
      if (!rawOutput.trim()) {
        throw new Error('Respons audio kosong dari model.');
      }

      const parsed = JSON.parse(cleanJsonString(rawOutput)) as GeminiParsedPayload;
      const transcript =
        parsed.transcript?.trim() ||
        clientTranscript ||
        'Transkrip audio lapangan berhasil diproses.';
      const entities = normalizeEntities(parsed, transcript, hintAssetId);
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
    'Rekaman suara lapangan: Terdeteksi vibrasi dan indikasi anomali pada peralatan. Perlu pemeriksaan awal dan foto bukti.';
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

const CATALOG_ASSET_SPECS: Record<
  string,
  { equipmentType: string; specifications: string }
> = {
  'P-101A': {
    equipmentType: 'Pompa Sentrifugal Umpan Mentah',
    specifications:
      'Pompa sentrifugal multistage transfer fluida hidrokarbon berat bertekanan tinggi.',
  },
  'E-201': {
    equipmentType: 'Heat Exchanger Pre-Heat Train',
    specifications:
      'Shell & tube heat exchanger perpindahan panas minyak mentah menuju kolom distilasi.',
  },
  'FCV-301': {
    equipmentType: 'Pneumatic Flow Control Valve',
    specifications:
      'Katup kontrol aliran gas bertekanan tinggi dilengkapi pneumatic actuator & smart positioner.',
  },
};

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
  const trimmed = value.replace(/[—–]/g, '-').trim();
  if (PLACEHOLDER_VISION_VALUES.has(trimmed.toLowerCase())) {
    return '';
  }
  return trimmed;
}

export async function scanNameplateFromImage(
  imageBase64: string,
  mimeType: string
): Promise<NameplateScanResult> {
  const defaultResult: NameplateScanResult = {
    assetTag: 'P-101A',
    matchedAssetId: 'P-101A',
    equipmentType: CATALOG_ASSET_SPECS['P-101A'].equipmentType,
    manufacturer: 'Sulzer Pumps Ltd.',
    model: 'OH2 Centrifugal Multistage',
    serialNumber: 'SN-2024-8849-CDU',
    specifications: CATALOG_ASSET_SPECS['P-101A'].specifications,
    visualObservation:
      'Mode simulasi lokal aktif. Pilih atau unggah ulang foto saat layanan Vision aktif.',
    hasVisibleAnomaly: false,
    suggestedNarrative: '',
    metadataSource: 'asset-catalog',
    confidence: 0.95,
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

  const prompt = `Anda adalah engineer reliability migas yang menganalisis foto nameplate ATAU foto lapangan peralatan industri (mungkin hanya menampilkan pelat kode tag logam seperti P-101A tanpa pabrikan/no. seri, atau foto peralatan dengan kondisi fisik tertentu).
Periksa foto fisik peralatannya secara cermat (abaikan tombol/UI kamera layar ponsel bila ini foto layar) dan kembalikan JSON murni sesuai skema.`;

  for (const modelName of GEMINI_MODEL_FALLBACKS) {
    try {
      const interaction = await ai.interactions.create({
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
      });

      const rawOutput = interaction.output_text || '';
      if (!rawOutput.trim()) {
        throw new Error('Respons Vision kosong dari model.');
      }

      const parsed = JSON.parse(
        cleanJsonString(rawOutput)
      ) as Partial<NameplateScanResult>;

      const knownTags = ['P-101A', 'E-201', 'FCV-301'];
      const rawTag = cleanVisionField(parsed.assetTag).toUpperCase();
      const rawTagAlnum = rawTag.replace(/[^A-Z0-9]/g, '');
      const matched = knownTags.find((t) => {
        const stripped = t.replace(/[^A-Z0-9]/g, '');
        return rawTag.includes(t) || rawTagAlnum.includes(stripped);
      });
      const isUnknownAsset = !matched;

      const manufacturer = cleanVisionField(parsed.manufacturer);
      const modelCode = cleanVisionField(parsed.model);
      const serialNumber = cleanVisionField(parsed.serialNumber);
      const catalogSpec = matched ? CATALOG_ASSET_SPECS[matched] : undefined;

      const equipmentType =
        cleanVisionField(parsed.equipmentType) ||
        catalogSpec?.equipmentType ||
        '';
      const specifications =
        cleanVisionField(parsed.specifications) ||
        catalogSpec?.specifications ||
        'Data terbaca dari foto lapangan.';
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
          : matched
            ? 'asset-catalog'
            : 'nameplate-ocr';

      let confidence =
        typeof parsed.confidence === 'number' && !Number.isNaN(parsed.confidence)
          ? parsed.confidence
          : 0.92;
      if (confidence > 1) confidence = confidence / 100;
      confidence = Math.max(0, Math.min(1, confidence));

      return {
        assetTag:
          cleanVisionField(parsed.assetTag) || matched || 'Tidak Teridentifikasi',
        matchedAssetId: matched || '',
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
  const upper = `${text} ${hintAssetId || ''}`.toUpperCase();
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
    kondisi_operasi: 'Unit beroperasi kontinu pada kapasitas 85%-95% beban normal.',
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
    verifikasi: 'Kosong, menunggu tindakan perbaikan dan verifikasi fisik.',
  };
}
