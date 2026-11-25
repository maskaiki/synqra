import { NextRequest, NextResponse } from 'next/server';
import {
  extractFailureEntitiesFromText,
  extractFromAudio,
  LaporCepatExtractionResult,
} from '@/lib/gemini';

export const maxDuration = 60;

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB

function detectAssetId(
  identitasAlat: string,
  transcript: string,
  fallbackAsset?: string
): string {
  const combined = `${identitasAlat} ${transcript}`.toUpperCase();
  if (
    combined.includes('E-201') ||
    combined.includes('HEAT') ||
    combined.includes('EXCHANGER')
  ) {
    return 'E-201';
  }
  if (
    combined.includes('FCV-301') ||
    combined.includes('FCV') ||
    combined.includes('VALVE') ||
    combined.includes('KATUP')
  ) {
    return 'FCV-301';
  }
  if (
    combined.includes('P-101') ||
    combined.includes('POMPA') ||
    combined.includes('PUMP')
  ) {
    return 'P-101A';
  }
  return fallbackAsset || 'P-101A';
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
      const clientTranscript =
        (formData.get('client_transcript') as string | null) || '';
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
          audioFile.type || 'audio/webm',
          {
            hintAssetId: requestedAsset,
            clientTranscript,
          }
        );
      } else if (textNarrative.trim() || clientTranscript.trim()) {
        extraction = await extractFailureEntitiesFromText(
          textNarrative.trim() || clientTranscript.trim(),
          requestedAsset
        );
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

      extraction = await extractFailureEntitiesFromText(
        textNarrative,
        requestedAsset
      );
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
