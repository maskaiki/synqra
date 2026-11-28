import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ASSETS, INITIAL_EVIDENCES, INITIAL_REPORTS } from '@/lib/constants';
import { CDU11_ENGINEERING_BRIEF } from '@/lib/cduBalonganKnowledge';
import {
  cleanJsonString,
  formatGeminiError,
  GEMINI_MODEL_FALLBACKS,
  getGenAI,
  isInvalidKeyError,
  withGeminiTimeout,
} from '@/lib/gemini';
import { buildLocalCaseSimulation } from '@/lib/learningEngine';
import {
  Asset,
  CaseSimulationPayload,
  Evidence,
  Report,
  SimulationOption,
  SimulationStepItem,
} from '@/types/synqra';

export const maxDuration = 60;

interface SimulasiKasusRequestBody {
  reportId?: string;
  reports?: Report[];
  assets?: Asset[];
  evidences?: Evidence[];
}

interface GeminiSimPayload {
  steps?: Array<{
    stepNumber?: number;
    entityLabel?: string;
    question?: string;
    correctAnswer?: string;
    distractors?: string[];
    coachExplanation?: string;
  }>;
}

const SIMULATION_SCHEMA = {
  type: 'object',
  properties: {
    steps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          stepNumber: { type: 'number' },
          entityLabel: { type: 'string' },
          question: { type: 'string' },
          correctAnswer: { type: 'string' },
          distractors: {
            type: 'array',
            items: { type: 'string' },
          },
          coachExplanation: { type: 'string' },
        },
        required: [
          'stepNumber',
          'entityLabel',
          'question',
          'correctAnswer',
          'distractors',
          'coachExplanation',
        ],
      },
    },
  },
  required: ['steps'],
};

function stripForbiddenDashes(text: string): string {
  return text.replace(/[\u2013\u2014]/g, '-').trim();
}

function buildShuffledOptions(
  correctRaw: string,
  distractorsRaw: string[],
  seedKey: string,
  fallbackOptions: SimulationOption[]
): SimulationOption[] {
  const correctText = stripForbiddenDashes(correctRaw);
  const distractors = distractorsRaw
    .map(stripForbiddenDashes)
    .filter((d) => d.length > 8 && d !== correctText);

  if (!correctText || distractors.length < 2) {
    return fallbackOptions;
  }

  const raw: SimulationOption[] = [
    { text: correctText, isCorrect: true },
    { text: distractors[0], isCorrect: false },
    { text: distractors[1], isCorrect: false },
  ];

  const seed = seedKey.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const shift = seed % raw.length;
  return raw.map((_, idx) => raw[(idx + shift) % raw.length]);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SimulasiKasusRequestBody;
    const allReports: Report[] =
      Array.isArray(body.reports) && body.reports.length > 0
        ? body.reports
        : INITIAL_REPORTS;
    const allAssets: Asset[] =
      Array.isArray(body.assets) && body.assets.length > 0
        ? body.assets
        : INITIAL_ASSETS;
    const allEvidences: Evidence[] =
      Array.isArray(body.evidences) && body.evidences.length > 0
        ? body.evidences
        : INITIAL_EVIDENCES;

    const verifiedPool = allReports.filter((r) => r.status === 'VERIFIED');
    const safePool =
      verifiedPool.length > 0
        ? verifiedPool
        : INITIAL_REPORTS.filter((r) => r.status === 'VERIFIED');

    const targetCase =
      safePool.find((r) => r.id === body.reportId) || safePool[0];

    const fallbackSim = buildLocalCaseSimulation(
      targetCase,
      allReports,
      allAssets,
      allEvidences
    );

    const ai = getGenAI();
    if (!ai) {
      return NextResponse.json({
        success: true,
        ...fallbackSim,
        errorReason: 'GEMINI_API_KEY belum dikonfigurasi di environment.',
      });
    }

    const systemInstruction = `Anda adalah Agen AI Pelatih Kompetensi Diagnostik (#8) pada platform SYNQRA untuk Unit 11 CDU PT Pertamina RU VI Balongan.
${CDU11_ENGINEERING_BRIEF}

TUGAS UTAMA:
Susun 5 tahap simulasi diagnostik kasus nyata berstatus VERIFIED untuk melatih penalaran teknisi kilang berdasarkan rantai 7 entitas SYNQRA:
- Tahap 1: "1. Identifikasi Gejala" (mengenali gejala abnormal & parameter menyimpang)
- Tahap 2: "2. Pemeriksaan & Bukti" (memilih metode inspeksi/bukti fisik yang memvalidasi temuan)
- Tahap 3: "3. Akar Penyebab" (menentukan root cause terverifikasi dari bukti)
- Tahap 4: "4. Tindakan Korektif" (memilih langkah perbaikan teknis sesuai SOP)
- Tahap 5: "5. Verifikasi Pascaperbaikan" (menentukan indikator terukur keberhasilan perbaikan)

ATURAN KERAS:
1. Kembalikan HANYA JSON murni sesuai skema tanpa markdown code fence.
2. Semua fakta teknis WAJIB 100% bersumber dari data kasus [${targetCase.id}] yang diberikan. DILARANG mengarang fakta di luar kasus.
3. Buat tepat 2 opsi pengecoh (distractors) per tahap yang terdengar teknis masuk akal namun tidak sesuai bukti kasus [${targetCase.id}].
4. "coachExplanation" berisi 1-2 kalimat pembinaan positif yang menyebut kode sitasi [${targetCase.id}] tanpa menghakimi pekerja.
5. DILARANG menggunakan tanda em-dash atau en-dash; gunakan tanda hubung biasa (-).`;

    const userPrompt = `DATA KASUS TERVERIFIKASI [${targetCase.id}]:
- Judul: ${targetCase.title}
- Aset: ${targetCase.asset_id} (${fallbackSim.assetName})
- Kondisi Operasi: ${targetCase.kondisi_operasi}
- Gejala Teramati: ${targetCase.gejala}
- Pemeriksaan & Bukti: ${targetCase.pemeriksaan_awal} | Bukti: ${targetCase.evidence_note || '-'}
- Akar Penyebab Terverifikasi: ${targetCase.praduga_penyebab}
- Tindakan Korektif: ${targetCase.capa_corrective || targetCase.usulan_tindakan}
- Verifikasi Pascaperbaikan: ${targetCase.verifikasi}
- Rujukan Literatur: ${(targetCase.literature_refs || []).join(', ') || '-'}`;

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
            response_format: {
              type: 'text',
              mime_type: 'application/json',
              schema: SIMULATION_SCHEMA,
            },
            store: false,
          }),
          11000,
          modelName
        );

        const rawText = interaction.output_text || '';
        if (!rawText.trim()) {
          throw new Error('Respons JSON simulasi kosong.');
        }

        const parsed = JSON.parse(cleanJsonString(rawText)) as GeminiSimPayload;
        const rawSteps = Array.isArray(parsed.steps) ? parsed.steps : [];
        if (rawSteps.length < 5) {
          throw new Error('Jumlah tahapan simulasi kurang dari 5.');
        }

        const normalizedSteps: SimulationStepItem[] = fallbackSim.steps.map((fbStep, idx) => {
          const item =
            rawSteps.find((s) => Number(s.stepNumber) === idx + 1) || rawSteps[idx];
          if (!item) return fbStep;

          const question = stripForbiddenDashes(item.question || '') || fbStep.question;
          const coachExplanation =
            stripForbiddenDashes(item.coachExplanation || '') || fbStep.coachExplanation;
          const options = buildShuffledOptions(
            item.correctAnswer || '',
            Array.isArray(item.distractors) ? item.distractors : [],
            `${targetCase.id}-ai-${idx + 1}-${Date.now() % 7}`,
            fbStep.options
          );

          return {
            stepNumber: idx + 1,
            entityLabel: fbStep.entityLabel,
            question,
            options,
            coachExplanation,
          };
        });

        const livePayload: CaseSimulationPayload = {
          ...fallbackSim,
          steps: normalizedSteps,
          engine: 'gemini-live',
          usedModel: modelName,
        };

        return NextResponse.json({ success: true, ...livePayload });
      } catch (err) {
        const formatted = stripForbiddenDashes(formatGeminiError(err));
        errors.push(`[${modelName}] ${formatted}`);
        if (isInvalidKeyError(formatted)) {
          break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...fallbackSim,
      errorReason: errors[0] || 'Menggunakan skenario terverifikasi lokal.',
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? stripForbiddenDashes(err.message)
        : 'Gagal memuat simulasi kasus.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
