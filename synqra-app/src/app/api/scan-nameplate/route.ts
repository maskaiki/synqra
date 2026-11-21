import { NextRequest, NextResponse } from 'next/server';
import { scanNameplateFromImage } from '@/lib/gemini';

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

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const result = await scanNameplateFromImage(
      base64Image,
      imageFile.type || 'image/jpeg'
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Gagal membaca foto nameplate.';
    console.error('Error in /api/scan-nameplate:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
