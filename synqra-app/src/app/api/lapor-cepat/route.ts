import { NextRequest, NextResponse } from 'next/server';
import { extractFailureEntitiesFromText, extractFromAudio } from '@/lib/gemini';
import { Report, UserRole } from '@/types/synqra';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File | null;
      const textNarrative = formData.get('text') as string | null;
      const reporterName = (formData.get('reporter_name') as string) || 'Dedi Kusnadi';
      const reporterRole = ((formData.get('reporter_role') as string) || 'frontline_omi') as UserRole;
      const dept = (formData.get('dept') as string) || 'Mekanik & Rotating';

      let extractedEntities;
      let transcript = '';

      if (audioFile && audioFile.size > 0) {
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');
        const audioResult = await extractFromAudio(base64Audio, audioFile.type || 'audio/webm');
        extractedEntities = audioResult.entities;
        transcript = audioResult.transcript || '';
      } else if (textNarrative) {
        extractedEntities = await extractFailureEntitiesFromText(textNarrative);
        transcript = textNarrative;
      } else {
        return NextResponse.json({ error: 'Tidak ada audio atau teks yang dikirimkan.' }, { status: 400 });
      }

      // Map to asset
      let assetId = 'P-101A';
      const upperAlat = (extractedEntities.identitas_alat || '').toUpperCase();
      if (upperAlat.includes('E-201') || upperAlat.includes('HEAT')) assetId = 'E-201';
      else if (upperAlat.includes('FCV') || upperAlat.includes('VALVE') || upperAlat.includes('KATUP')) assetId = 'FCV-301';

      // Assemble new report locked as PRADUGA
      const newReport: Report = {
        id: `REP-${String(Date.now()).slice(-4)}`,
        title: `Temuan Lapangan: ${extractedEntities.identitas_alat}`,
        asset_id: assetId,
        status: 'PRADUGA', // LOCKED INITIAL STATUS AS REQUESTED
        identitas_alat: extractedEntities.identitas_alat,
        gejala: extractedEntities.gejala,
        kondisi_operasi: extractedEntities.kondisi_operasi,
        pemeriksaan_awal: extractedEntities.pemeriksaan_awal,
        praduga_penyebab: extractedEntities.praduga_penyebab,
        usulan_tindakan: extractedEntities.usulan_tindakan,
        verifikasi: extractedEntities.verifikasi,
        description: transcript || extractedEntities.gejala,
        reporter_name: reporterName,
        reporter_role: reporterRole,
        dept: dept,
        evidence_note: `Laporan Cepat suara/teks AI (${new Date().toLocaleDateString('id-ID')})`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        report: newReport,
        transcript,
      });
    }

    // JSON Body Handling
    const body = await req.json();
    const { text, reporter_name, reporter_role, dept } = body;

    if (!text) {
      return NextResponse.json({ error: 'Field "text" wajib diisi.' }, { status: 400 });
    }

    const extracted = await extractFailureEntitiesFromText(text);

    let assetId = 'P-101A';
    const upperAlat = (extracted.identitas_alat || '').toUpperCase();
    if (upperAlat.includes('E-201') || upperAlat.includes('HEAT')) assetId = 'E-201';
    else if (upperAlat.includes('FCV') || upperAlat.includes('VALVE')) assetId = 'FCV-301';

    const newReport: Report = {
      id: `REP-${String(Date.now()).slice(-4)}`,
      title: `Temuan Lapangan: ${extracted.identitas_alat}`,
      asset_id: assetId,
      status: 'PRADUGA', // LOCKED AS PRADUGA
      identitas_alat: extracted.identitas_alat,
      gejala: extracted.gejala,
      kondisi_operasi: extracted.kondisi_operasi,
      pemeriksaan_awal: extracted.pemeriksaan_awal,
      praduga_penyebab: extracted.praduga_penyebab,
      usulan_tindakan: extracted.usulan_tindakan,
      verifikasi: extracted.verifikasi,
      description: text,
      reporter_name: reporter_name || 'Dedi Kusnadi',
      reporter_role: (reporter_role || 'frontline_omi') as UserRole,
      dept: dept || 'Mekanik & Rotating',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      report: newReport,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan pemrosesan Lapor Cepat.';
    console.error('Error in /api/lapor-cepat:', err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
