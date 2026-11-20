'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FailureEntities, Report, UserRole } from '@/types/synqra';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  Mic,
  MicOff,
  Type,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Scan,
  ShieldAlert,
} from 'lucide-react';

interface LaporCepatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (newReport: Report) => void;
  currentUserRole: UserRole;
  currentUserName: string;
  currentUserDept: string;
}

export const LaporCepatModal: React.FC<LaporCepatModalProps> = ({
  isOpen,
  onClose,
  onReportCreated,
  currentUserRole,
  currentUserName,
  currentUserDept,
}) => {
  // Input Modes: 'voice' | 'text'
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Text narrative state
  const [textNarrative, setTextNarrative] = useState('');

  // Attached evidence photo
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | null>(null);

  // Scan Nameplate state
  const [isScanningNameplate, setIsScanningNameplate] = useState(false);
  const [nameplateInfo, setNameplateInfo] = useState<{
    assetTag?: string;
    manufacturer?: string;
    model?: string;
    specifications?: string;
  } | null>(null);

  // Gemini extraction state
  const [isExtracting, setIsExtracting] = useState(false);
  const [step, setStep] = useState<'input' | 'review'>('input');
  const [extractedEntities, setExtractedEntities] = useState<FailureEntities>({
    identitas_alat: '',
    gejala: '',
    kondisi_operasi: '',
    pemeriksaan_awal: '',
    praduga_penyebab: '',
    usulan_tindakan: '',
    verifikasi: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Audio timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  // 1. MediaRecorder Handlers
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingSeconds(0);
      setAudioBlob(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlobResult = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlobResult);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mikrofon gagal diakses:', err);
      alert('Gagal mengakses mikrofon browser. Mohon izinkan akses mikrofon atau gunakan tab input Teks.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 2. Scan Nameplate Handler
  const handleNameplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningNameplate(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/scan-nameplate', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal scan nameplate.');

      const data = json.data;
      setNameplateInfo(data);
      // Automatically inject into extracted entities
      setExtractedEntities((prev) => ({
        ...prev,
        identitas_alat: data.matchedAssetId || data.assetTag || prev.identitas_alat,
        kondisi_operasi: prev.kondisi_operasi || data.specifications || '',
      }));

      setStatusMessage({
        type: 'success',
        text: `Nameplate terdeteksi: ${data.assetTag} (${data.manufacturer || 'Industri'})`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal scan nameplate.';
      console.error(err);
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setIsScanningNameplate(false);
    }
  };

  // 3. Evidence Photo Handler
  const handleEvidencePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
      setEvidencePreviewUrl(URL.createObjectURL(file));
    }
  };

  // 4. Trigger Gemini Extraction
  const handleExtractWithGemini = async () => {
    setIsExtracting(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append('reporter_name', currentUserName);
      formData.append('reporter_role', currentUserRole);
      formData.append('dept', currentUserDept);

      if (activeTab === 'voice' && audioBlob) {
        formData.append('audio', audioBlob, 'recording.webm');
      } else if (textNarrative.trim()) {
        formData.append('text', textNarrative);
      } else {
        throw new Error('Mohon rekam suara atau ketik narasi temuan terlebih dahulu.');
      }

      const res = await fetch('/api/lapor-cepat', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal memproses Lapor Cepat.');

      const rep: Report = json.report;

      // Update extracted entities from Gemini response
      setExtractedEntities({
        identitas_alat: nameplateInfo?.assetTag || rep.identitas_alat || 'Pompa P-101A',
        gejala: rep.gejala || '',
        kondisi_operasi: rep.kondisi_operasi || '',
        pemeriksaan_awal: rep.pemeriksaan_awal || '',
        praduga_penyebab: rep.praduga_penyebab || '',
        usulan_tindakan: rep.usulan_tindakan || '',
        verifikasi: rep.verifikasi || '',
      });

      setStep('review');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ekstraksi gagal dijalankan.';
      console.error('Ekstraksi gagal:', err);
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setIsExtracting(false);
    }
  };

  // 5. Final Save to Supabase
  const handleSaveReport = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      let finalAssetId = 'P-101A';
      const upperAlat = (extractedEntities.identitas_alat || '').toUpperCase();
      if (upperAlat.includes('E-201') || upperAlat.includes('HEAT')) finalAssetId = 'E-201';
      else if (upperAlat.includes('FCV') || upperAlat.includes('VALVE')) finalAssetId = 'FCV-301';

      const reportId = `REP-${String(Date.now()).slice(-4)}`;

      let uploadedImageUrl: string | undefined = undefined;

      // If Supabase Storage is configured and evidenceFile exists, upload it:
      if (isSupabaseConfigured && supabase && evidenceFile) {
        const fileExt = evidenceFile.name.split('.').pop();
        const filePath = `reports/${reportId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('synqra-evidences')
          .upload(filePath, evidenceFile);

        if (!uploadError) {
          const { data } = supabase.storage.from('synqra-evidences').getPublicUrl(filePath);
          uploadedImageUrl = data.publicUrl;
        }
      } else if (evidencePreviewUrl) {
        uploadedImageUrl = evidencePreviewUrl;
      }

      const newReport: Report = {
        id: reportId,
        title: `Temuan: ${extractedEntities.identitas_alat || 'Peralatan Lapangan'}`,
        asset_id: finalAssetId,
        status: 'PRADUGA', // LOCKED INITIAL STATUS
        identitas_alat: extractedEntities.identitas_alat,
        gejala: extractedEntities.gejala,
        kondisi_operasi: extractedEntities.kondisi_operasi,
        pemeriksaan_awal: extractedEntities.pemeriksaan_awal,
        praduga_penyebab: extractedEntities.praduga_penyebab,
        usulan_tindakan: extractedEntities.usulan_tindakan,
        verifikasi: extractedEntities.verifikasi,
        description: extractedEntities.gejala,
        reporter_name: currentUserName,
        reporter_role: currentUserRole,
        dept: currentUserDept,
        evidence_note: evidenceFile ? `Bukti foto: ${evidenceFile.name}` : 'Bukti dari rekaman suara / input teknisi.',
        image_url: uploadedImageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // If Supabase DB is active, insert into 'reports'
      if (isSupabaseConfigured && supabase) {
        const { error: insertError } = await supabase.from('reports').insert([
          {
            id: newReport.id,
            title: newReport.title,
            asset_id: newReport.asset_id,
            status: newReport.status,
            identitas_alat: newReport.identitas_alat,
            gejala: newReport.gejala,
            kondisi_operasi: newReport.kondisi_operasi,
            pemeriksaan_awal: newReport.pemeriksaan_awal,
            praduga_penyebab: newReport.praduga_penyebab,
            usulan_tindakan: newReport.usulan_tindakan,
            verifikasi: newReport.verifikasi,
            description: newReport.description,
            reporter_name: newReport.reporter_name,
            reporter_role: newReport.reporter_role,
            dept: newReport.dept,
            evidence_note: newReport.evidence_note,
          },
        ]);
        if (insertError) {
          console.warn('Supabase DB error, saving to client state:', insertError);
        }
      }

      // Notify parent component
      onReportCreated(newReport);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan laporan.';
      console.error('Simpan gagal:', err);
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Poppins',sans-serif] text-xs font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                Lapor Cepat AI
              </span>
              <StatusBadge status="PRADUGA" size="sm" />
            </div>
            <h2 className="font-['Poppins',sans-serif] text-xl font-bold mt-1 text-slate-900 dark:text-slate-50">
              Pelaporan Temuan Lapangan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Didukung Google Gemini API untuk ekstraksi 7 entitas kegagalan industri.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* STEP 1: INPUT SUARA / TEKS / SCAN NAMEPLATE */}
        {step === 'input' && (
          <div className="mt-5 space-y-5">
            {/* Mode Tabs */}
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('voice')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-['Poppins',sans-serif] font-bold transition-all ${
                    activeTab === 'voice'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-cyan-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  Rekam Suara
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-['Poppins',sans-serif] font-bold transition-all ${
                    activeTab === 'text'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-cyan-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  Ketik Narasi
                </button>
              </div>

              {/* Scan Nameplate Action */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-cyan-500/50 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-['Poppins',sans-serif] font-bold cursor-pointer transition-all">
                {isScanningNameplate ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Scan className="w-3.5 h-3.5" />
                )}
                <span>Scan Nameplate</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleNameplateUpload}
                  disabled={isScanningNameplate}
                />
              </label>
            </div>

            {/* Nameplate Tag Badge if detected */}
            {nameplateInfo && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-['Poppins',sans-serif] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider block">
                    Tag Terdeteksi via Gemini Vision
                  </span>
                  <div className="text-sm font-['Poppins',sans-serif] font-extrabold text-slate-900 dark:text-slate-100">
                    {nameplateInfo.assetTag} · {nameplateInfo.manufacturer || 'Industrial Asset'}
                  </div>
                  {nameplateInfo.specifications && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {nameplateInfo.specifications}
                    </div>
                  )}
                </div>
                <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              </div>
            )}

            {/* TAB 1: VOICE RECORDER */}
            {activeTab === 'voice' && (
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-sm font-['Poppins',sans-serif] font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {isRecording ? 'Merekam Suara Teknisi...' : audioBlob ? 'Rekaman Siap Diekstrak' : 'Tekan Tombol untuk Mulai Bicara'}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                    Contoh: &quot;Pompa P-101A bergetar hebat di bantalan drive-end dan ada rembesan oli saat debit 100 m3/jam...&quot;
                  </p>

                  {/* Big Mic Button */}
                  <div className="relative inline-block mb-3">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
                        isRecording
                          ? 'bg-rose-600 animate-pulse ring-4 ring-rose-500/30'
                          : audioBlob
                          ? 'bg-cyan-600 hover:bg-cyan-500'
                          : 'bg-gradient-to-br from-cyan-500 to-sky-600 hover:opacity-95'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                  </div>

                  {/* Timer & Waveform */}
                  {isRecording && (
                    <div className="space-y-2 animate-in fade-in">
                      <div className="font-['Poppins',sans-serif] font-bold text-rose-500 text-sm">
                        00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                      </div>
                      <div className="flex items-center justify-center gap-1 h-6">
                        {[40, 75, 100, 60, 90, 45, 80, 100, 65, 85, 30].map((h, i) => (
                          <span
                            key={i}
                            className="w-1 bg-cyan-500 rounded-full animate-pulse"
                            style={{
                              height: `${h}%`,
                              animationDelay: `${i * 0.08}s`,
                              animationDuration: '0.6s',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {audioBlob && !isRecording && (
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-700 dark:text-cyan-400 font-semibold flex items-center justify-center gap-2 mt-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Audio tersimpan ({recordingSeconds}s). Siap diproses oleh AI.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: TEXT NARRATIVE */}
            {activeTab === 'text' && (
              <div className="space-y-2">
                <label className="block text-xs font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Uraian Kejadian / Transkrip Lapangan
                </label>
                <textarea
                  rows={5}
                  value={textNarrative}
                  onChange={(e) => setTextNarrative(e.target.value)}
                  placeholder="Ketik narasi temuan, parameter yang terbaca, atau dugaan awal teknisi..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
              </div>
            )}

            {/* Evidence Photo Attachment */}
            <div className="space-y-2">
              <label className="block text-xs font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Lampiran Bukti Lapangan (Foto / Nameplate)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold cursor-pointer transition-all">
                  <Camera className="w-4 h-4 text-cyan-500" />
                  <span>{evidenceFile ? 'Ganti Foto' : 'Ambil Foto Bukti'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleEvidencePhotoUpload}
                  />
                </label>
                {evidenceFile && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {evidencePreviewUrl && (
                      <img
                        src={evidencePreviewUrl}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-700"
                      />
                    )}
                    <span className="truncate max-w-[200px]">{evidenceFile.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button: Extract with Gemini */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExtractWithGemini}
                disabled={isExtracting || (activeTab === 'voice' && !audioBlob) || (activeTab === 'text' && !textNarrative.trim())}
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-['Poppins',sans-serif] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition-all"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengekstrak 7 Entitas Kegagalan dengan Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Ekstrak dengan Google Gemini AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW 7 ENTITAS KEGAGALAN */}
        {step === 'review' && (
          <div className="mt-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-['Poppins',sans-serif] font-bold text-amber-800 dark:text-amber-300">
                  Status Terkunci: PRADUGA
                </span>
                <p className="text-amber-700 dark:text-amber-400 mt-0.5 font-medium">
                  Seluruh laporan awal dikunci sebagai praduga hingga ditinjau oleh Reviewer Departemen dan divalidasi oleh Tim HSE.
                </p>
              </div>
            </div>

            {/* 7 Editable Entities Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div className="md:col-span-2">
                <label className="block font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  1. Identitas Alat (Tag / Nama)
                </label>
                <input
                  type="text"
                  value={extractedEntities.identitas_alat}
                  onChange={(e) => setExtractedEntities({ ...extractedEntities, identitas_alat: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  2. Gejala Teramati (Symptom)
                </label>
                <textarea
                  rows={2}
                  value={extractedEntities.gejala}
                  onChange={(e) => setExtractedEntities({ ...extractedEntities, gejala: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  3. Kondisi Operasi
                </label>
                <textarea
                  rows={2}
                  value={extractedEntities.kondisi_operasi}
                  onChange={(e) => setExtractedEntities({ ...extractedEntities, kondisi_operasi: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  4. Pemeriksaan Awal
                </label>
                <textarea
                  rows={2}
                  value={extractedEntities.pemeriksaan_awal}
                  onChange={(e) => setExtractedEntities({ ...extractedEntities, pemeriksaan_awal: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  5. Praduga Penyebab
                </label>
                <textarea
                  rows={2}
                  value={extractedEntities.praduga_penyebab}
                  onChange={(e) => setExtractedEntities({ ...extractedEntities, praduga_penyebab: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  6. Usulan Tindakan
                </label>
                <textarea
                  rows={2}
                  value={extractedEntities.usulan_tindakan}
                  onChange={(e) => setExtractedEntities({ ...extractedEntities, usulan_tindakan: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-['Poppins',sans-serif] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  7. Verifikasi Keberhasilan
                </label>
                <textarea
                  rows={2}
                  value={extractedEntities.verifikasi}
                  onChange={(e) => setExtractedEntities({ ...extractedEntities, verifikasi: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold font-['Poppins',sans-serif] hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ← Rekam / Edit Ulang
              </button>
              <button
                type="button"
                onClick={handleSaveReport}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-['Poppins',sans-serif] shadow-lg shadow-cyan-600/25"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan ke Supabase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simpan Laporan & Lampiran</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
