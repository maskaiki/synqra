import { NextRequest, NextResponse } from 'next/server';
import {
  extractFailureEntitiesFromText,
  extractFromAudio,
  LaporCepatExtractionResult,
  matchCdu11AssetTag,
} from '@/lib/gemini';
import { INITIAL_ASSETS } from '@/lib/constants';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB

function detectAssetId(
  identitasAlat: string,
  transcript: string,
  fallbackAsset?: string
): string {
  // 1. Prioritaskan kode tag eksplisit 11-* yang disebut langsung pada hasil ekstraksi/transkrip
  const strictMatch = matchCdu11AssetTag(`${identitasAlat} ${transcript}`, INITIAL_ASSETS, {
    strictTagOnly: true,
  });
  if (strictMatch) return strictMatch.id;

  // 2. Bila operator sudah memilih alat spesifik pada Step 1, pertahankan pilihan valid tersebut
  if (fallbackAsset && INITIAL_ASSETS.some((a) => a.id === fallbackAsset)) {
    return fallbackAsset;
  }

  // 3. Fallback sinonim teknis Unit 11 CDU Balongan
  const fuzzyMatch = matchCdu11AssetTag(`${identitasAlat} ${transcript}`, INITIAL_ASSETS);
  return fuzzyMatch?.id || INITIAL_ASSETS[0].id;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let extraction: LaporCepatExtractionResult;
    let requestedAsset = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File | null;
      const textNarrative = (formData.get('text') as string | null) || '';
      requestedAsset = (formData.get('asset_id') as string | null) || '';

      if (audioFile && audioFile.size > 0) {
        if (audioFile.size > MAX_AUDIO_BYTES) {
          return NextResponse.json(
            {
              error:
                'Ukuran file audio melebihi batas maksimal 10 MB. Rekam lebih singkat atau gunakan input teks.',
            },
            { status: 400 }
          );
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');
        extraction = await extractFromAudio(
          base64Audio,
          audioFile.type || 'audio/webm'
        );
      } else if (textNarrative.trim()) {
        extraction = await extractFailureEntitiesFromText(textNarrative);
      } else {
        return NextResponse.json(
          { error: 'Rekaman suara atau teks narasi tidak boleh kosong.' },
          { status: 400 }
        );
      }
    } else {
      const body = (await req.json()) as { text?: string; asset_id?: string };
      const textNarrative = body.text?.trim() || '';
      requestedAsset = body.asset_id || '';

      if (!textNarrative) {
        return NextResponse.json(
          { error: 'Teks narasi tidak boleh kosong.' },
          { status: 400 }
        );
      }

      extraction = await extractFailureEntitiesFromText(textNarrative);
    }

    const detectedAssetId = detectAssetId(
      extraction.entities.identitas_alat,
      extraction.transcript,
      requestedAsset
    );

    return NextResponse.json({
      success: true,
      status: 'PRADUGA',
      asset_id: detectedAssetId,
      transcript: extraction.transcript,
      suggestedTitle: extraction.suggestedTitle,
      suggestedUrgency: extraction.suggestedUrgency,
      engine: extraction.engine,
      usedModel: extraction.usedModel,
      errorReason: extraction.errorReason,
      entities: extraction.entities,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Gagal memproses ekstraksi Lapor Cepat.';
    console.error('Error in /api/lapor-cepat:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
