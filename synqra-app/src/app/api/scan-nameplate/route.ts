import { NextRequest, NextResponse } from 'next/server';
import { scanNameplateFromImage } from '@/lib/gemini';

export const maxDuration = 60;

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: 'File foto nameplate tidak ditemukan.' },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        {
          error:
            'Ukuran foto melebihi batas maksimal 4 MB. Silakan gunakan foto yang lebih kecil.',
        },
        { status: 400 }
      );
    }

    const cleanMime = (imageFile.type || '').split(';')[0].trim().toLowerCase();
    if (!ALLOWED_IMAGE_MIME_TYPES.has(cleanMime)) {
      return NextResponse.json(
        {
          error:
            'Format gambar tidak valid. Gunakan gambar JPG, PNG, atau WEBP.',
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const result = await scanNameplateFromImage(base64Image, cleanMime);

    return NextResponse.json({
      success: true,
      engine: result.engine,
      usedModel: result.usedModel,
      errorReason: result.errorReason,
      isUnknownAsset: result.isUnknownAsset,
      data: result,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal membaca foto nameplate.';
    console.error('Error in /api/scan-nameplate:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
