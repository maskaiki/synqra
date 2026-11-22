'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Asset, Evidence, FailureEntities, Report, RoleInfo } from '@/types/synqra';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { uploadEvidenceFile } from '@/lib/dataService';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Cpu,
  FileAudio,
  FileText,
  Mic,
  MicOff,
  RotateCcw,
  Scan,
  Sparkles,
  Upload,
} from 'lucide-react';

interface LaporCepatViewProps {
  assets: Asset[];
  roleInfo: RoleInfo;
  isDarkMode: boolean;
  onReportCreated: (report: Report, initialEvidence?: Evidence) => void;
  onCancel: () => void;
}

type WizardStep = 1 | 2 | 3;
type MicStatus = 'idle' | 'requesting' | 'live' | 'recorded' | 'denied' | 'unavailable';

interface ExtractionMeta {
  engine: 'gemini-live' | 'local-fallback';
  usedModel?: string;
  errorReason?: string;
  transcript: string;
  sourceMode: 'audio' | 'text';
}

interface NameplateScanViewState {
  thumbnailUrl: string;
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
  originalKb: number;
  compressedKb: number;
  scannedFile: File;
}

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const MAX_NAMEPLATE_IMAGE_BYTES = 4 * 1024 * 1024;

const INVALID_SPEC_VALUES = new Set([
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

function isValidSpecValue(value?: string): boolean {
  if (!value) return false;
  return !INVALID_SPEC_VALUES.has(value.trim().toLowerCase());
}

const SAMPLE_PROMPTS: Record<string, string> = {
  'P-101A':
    'Lapor dari unit CDU, pompa P-101A bergetar keras 7,6 mm/s di bearing drive end dan terlihat rembesan cairan di sekitar mechanical seal saat beban 90%.',
  'E-201':
    'Heat exchanger E-201 menunjukkan penurunan suhu outlet 12 derajat dari baseline dan differential pressure naik 0,6 bar. Indikasi awal fouling di tube bundle.',
  'FCV-301':
    'Control valve FCV-301 merespons perintah DCS terlambat sekitar 8 detik saat setpoint diubah ke 60%. Suplai instrument air normal 4,2 bar.',
};

function pickSupportedAudioMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

async function compressNameplateImage(file: File): Promise<{
  blob: Blob;
  previewUrl: string;
  originalKb: number;
  compressedKb: number;
}> {
  const rawUrl = URL.createObjectURL(file);
  const originalKb = Math.max(1, Math.round(file.size / 1024));

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Gagal memuat gambar nameplate.'));
      el.src = rawUrl;
    });

    const maxWidth = 1280;
    const scale = img.width > maxWidth ? maxWidth / img.width : 1;
    const targetWidth = Math.max(1, Math.round(img.width * scale));
    const targetHeight = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas tidak tersedia untuk kompresi gambar.');
    }
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error('Gagal mengompresi foto ke JPEG.'));
        },
        'image/jpeg',
        0.82
      );
    });

    const previewUrl = URL.createObjectURL(blob);
    const compressedKb = Math.max(1, Math.round(blob.size / 1024));
    return { blob, previewUrl, originalKb, compressedKb };
  } finally {
    URL.revokeObjectURL(rawUrl);
  }
}

export const LaporCepatView: React.FC<LaporCepatViewProps> = ({
  assets,
  roleInfo,
  isDarkMode,
  onReportCreated,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState<WizardStep>(1);
  const [highestStep, setHighestStep] = useState<WizardStep>(1);

  const [selectedAssetId, setSelectedAssetId] = useState<string>('P-101A');
  const [findingType, setFindingType] = useState<'Kondisi Abnormal' | 'Potensi Bahaya' | 'Near Miss'>('Kondisi Abnormal');
  const [urgency, setUrgency] = useState<'Mendesak' | 'Normal'>('Normal');

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [narrative, setNarrative] = useState<string>('');
  const [micStatus, setMicStatus] = useState<MicStatus>('idle');
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<NameplateScanViewState | null>(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [entities, setEntities] = useState<FailureEntities | null>(null);
  const [extractionMeta, setExtractionMeta] = useState<ExtractionMeta | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const photoPreviewRef = useRef<string | null>(null);
  const scanThumbUrlRef = useRef<string | null>(null);
  const nameplateInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const revokeAudioUrl = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      if (photoPreviewRef.current) URL.revokeObjectURL(photoPreviewRef.current);
      if (scanThumbUrlRef.current) URL.revokeObjectURL(scanThumbUrlRef.current);
    };
  }, []);

  const goToStep = (step: WizardStep) => {
    setErrorMsg(null);
    setActiveStep(step);
    setHighestStep((prev) => (step > prev ? step : prev));
  };

  const canJumpToStep = (step: WizardStep): boolean => {
    if (step === 1) return true;
    if (step === 2) return highestStep >= 2 || Boolean(selectedAssetId);
    return Boolean(entities);
  };

  const startRecording = async () => {
    setErrorMsg(null);
    setMicNotice(null);
    setRecordedBlob(null);
    revokeAudioUrl();

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setIsRecording(false);
      setMicStatus('unavailable');
      setMicNotice(
        'Mikrofon tidak tersedia di browser ini. Beralih ke Ketik Teks atau pakai Contoh Narasi.'
      );
      return;
    }

    setMicStatus('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const supportedMime = pickSupportedAudioMimeType();
      const recorder = supportedMime
        ? new MediaRecorder(stream, { mimeType: supportedMime })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || supportedMime || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const previewUrl = URL.createObjectURL(blob);
        audioUrlRef.current = previewUrl;
        setRecordedBlob(blob);
        setAudioUrl(previewUrl);
        setMicStatus('recorded');
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setMicStatus('live');
      setRecordSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err: unknown) {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const errName = err instanceof Error ? err.name : '';
      const isDenied = errName === 'NotAllowedError' || errName === 'PermissionDeniedError';
      setMicStatus(isDenied ? 'denied' : 'unavailable');
      setMicNotice(
        isDenied
          ? 'Izin mikrofon ditolak browser. Aktifkan izin mic atau gunakan Ketik Teks.'
          : 'Perangkat mikrofon tidak terdeteksi. Gunakan Ketik Teks atau Contoh Narasi.'
      );
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  const handleReRecord = () => {
    setRecordedBlob(null);
    revokeAudioUrl();
    setRecordSeconds(0);
    setMicStatus('idle');
    void startRecording();
  };

  const handleScanNameplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    setErrorMsg(null);
    let nextThumbUrl: string | null = null;

    try {
      const compressed = await compressNameplateImage(file);
      nextThumbUrl = compressed.previewUrl;

      if (compressed.blob.size > MAX_NAMEPLATE_IMAGE_BYTES) {
        URL.revokeObjectURL(nextThumbUrl);
        nextThumbUrl = null;
        setErrorMsg('Ukuran foto setelah kompresi masih melebihi 4 MB. Ambil foto lebih dekat.');
        return;
      }

      const compressedFile = new File([compressed.blob], 'nameplate.jpg', {
        type: 'image/jpeg',
      });
      const fd = new FormData();
      fd.append('image', compressedFile);

      const res = await fetch('/api/scan-nameplate', { method: 'POST', body: fd });
      const json = (await res.json()) as {
        success?: boolean;
        engine?: 'gemini-live' | 'local-fallback';
        usedModel?: string;
        errorReason?: string;
        isUnknownAsset?: boolean;
        data?: {
          matchedAssetId?: string;
          assetTag?: string;
          equipmentType?: string;
          manufacturer?: string;
          model?: string;
          serialNumber?: string;
          specifications?: string;
          visualObservation?: string;
          hasVisibleAnomaly?: boolean;
          suggestedNarrative?: string;
          metadataSource?: 'nameplate-ocr' | 'asset-catalog';
          confidence?: number;
          engine?: 'gemini-live' | 'local-fallback';
          usedModel?: string;
          errorReason?: string;
          isUnknownAsset?: boolean;
        };
        error?: string;
      };

      if (!res.ok || !json.success || !json.data) {
        URL.revokeObjectURL(nextThumbUrl);
        nextThumbUrl = null;
        setErrorMsg(json.error || 'Gagal memindai nameplate.');
        return;
      }

      if (scanThumbUrlRef.current) {
        URL.revokeObjectURL(scanThumbUrlRef.current);
      }
      scanThumbUrlRef.current = nextThumbUrl;

      const d = json.data;
      const isUnknown = Boolean(d.isUnknownAsset ?? json.isUnknownAsset);
      const matched = d.matchedAssetId || '';
      const scanPhotoFile = new File(
        [compressed.blob],
        `foto-scan-${(matched || 'alat').toLowerCase()}.jpg`,
        { type: 'image/jpeg' }
      );

      if (!isUnknown && matched && assets.some((a) => a.id === matched)) {
        setSelectedAssetId(matched);
      }

      if (!photoFile) {
        if (photoPreviewRef.current) {
          URL.revokeObjectURL(photoPreviewRef.current);
        }
        const nextPhotoUrl = URL.createObjectURL(compressed.blob);
        photoPreviewRef.current = nextPhotoUrl;
        setPhotoFile(scanPhotoFile);
        setPhotoPreview(nextPhotoUrl);
      }

      setScanResult({
        thumbnailUrl: nextThumbUrl,
        assetTag: d.assetTag || matched || 'Tidak Teridentifikasi',
        matchedAssetId: matched,
        equipmentType: d.equipmentType || '',
        manufacturer: d.manufacturer || '',
        model: d.model || '',
        serialNumber: d.serialNumber || '',
        specifications: d.specifications || 'Data terbaca dari foto lapangan.',
        visualObservation: d.visualObservation || '',
        hasVisibleAnomaly: Boolean(d.hasVisibleAnomaly),
        suggestedNarrative: d.suggestedNarrative || '',
        metadataSource: d.metadataSource,
        confidence: typeof d.confidence === 'number' ? d.confidence : 0.92,
        engine: d.engine || json.engine || 'local-fallback',
        usedModel: d.usedModel || json.usedModel,
        errorReason: d.errorReason || json.errorReason,
        isUnknownAsset: isUnknown,
        originalKb: compressed.originalKb,
        compressedKb: compressed.compressedKb,
        scannedFile: scanPhotoFile,
      });
    } catch (err: unknown) {
      if (nextThumbUrl) {
        URL.revokeObjectURL(nextThumbUrl);
      }
      setErrorMsg(
        err instanceof Error ? err.message : 'Gagal menghubungi layanan Scan Nameplate.'
      );
    } finally {
      setIsScanning(false);
      if (nameplateInputRef.current) nameplateInputRef.current.value = '';
    }
  };

  const handleApplyScanToFinding = () => {
    if (!scanResult) return;
    const text = (
      scanResult.suggestedNarrative ||
      scanResult.visualObservation ||
      ''
    ).trim();

    setInputMode('text');
    if (text) {
      setNarrative(text);
      if (
        scanResult.hasVisibleAnomaly &&
        /rembes|bocor|leak|retak|asap|api|overheat|panas|kritis|bahaya/i.test(text)
      ) {
        setUrgency('Mendesak');
      }
    }

    if (!photoFile && scanResult.scannedFile) {
      if (photoPreviewRef.current) {
        URL.revokeObjectURL(photoPreviewRef.current);
      }
      const nextPhotoUrl = URL.createObjectURL(scanResult.scannedFile);
      photoPreviewRef.current = nextPhotoUrl;
      setPhotoFile(scanResult.scannedFile);
      setPhotoPreview(nextPhotoUrl);
    }

    goToStep(2);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoPreviewRef.current) {
      URL.revokeObjectURL(photoPreviewRef.current);
    }
    const nextUrl = URL.createObjectURL(file);
    photoPreviewRef.current = nextUrl;
    setPhotoFile(file);
    setPhotoPreview(nextUrl);
  };

  const handleExtractAI = async (forcedMode?: 'audio' | 'text') => {
    setErrorMsg(null);
    const useAudio =
      forcedMode === 'audio'
        ? Boolean(recordedBlob)
        : forcedMode === 'text'
          ? false
          : inputMode === 'voice' && Boolean(recordedBlob);

    if (!useAudio && !narrative.trim()) {
      setErrorMsg('Rekam suara atau isi narasi singkat sebelum ekstraksi AI.');
      return;
    }

    if (useAudio && recordedBlob && recordedBlob.size > MAX_AUDIO_BYTES) {
      setErrorMsg('Ukuran rekaman audio melebihi batas maksimal 10 MB.');
      return;
    }

    setIsExtracting(true);
    try {
      let res: Response;
      if (useAudio && recordedBlob) {
        const fd = new FormData();
        const ext = recordedBlob.type.includes('mp4')
          ? 'mp4'
          : recordedBlob.type.includes('ogg')
            ? 'ogg'
            : 'webm';
        fd.append('audio', recordedBlob, `voice-note.${ext}`);
        fd.append('asset_id', selectedAssetId);
        res = await fetch('/api/lapor-cepat', { method: 'POST', body: fd });
      } else {
        res = await fetch('/api/lapor-cepat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: narrative, asset_id: selectedAssetId }),
        });
      }

      const json = (await res.json()) as {
        success?: boolean;
        transcript?: string;
        asset_id?: string;
        suggestedTitle?: string;
        suggestedUrgency?: 'Mendesak' | 'Normal';
        engine?: 'gemini-live' | 'local-fallback';
        usedModel?: string;
        errorReason?: string;
        entities?: FailureEntities;
        error?: string;
      };

      if (!res.ok || !json.entities) {
        throw new Error(json.error || 'Ekstraksi AI gagal.');
      }

      const rawTranscript = json.transcript || narrative.trim();
      if (rawTranscript && (useAudio || !narrative.trim())) {
        setNarrative(rawTranscript);
      }

      if (json.asset_id && assets.some((a) => a.id === json.asset_id)) {
        setSelectedAssetId(json.asset_id);
      }

      if (json.suggestedUrgency === 'Mendesak' || json.suggestedUrgency === 'Normal') {
        setUrgency(json.suggestedUrgency);
      }

      setEntities(json.entities);
      setReportTitle(
        json.suggestedTitle?.trim() ||
          `${findingType} pada ${json.entities.identitas_alat || json.asset_id || selectedAssetId}`
      );
      setExtractionMeta({
        engine: json.engine || 'local-fallback',
        usedModel: json.usedModel,
        errorReason: json.errorReason,
        transcript: rawTranscript,
        sourceMode: useAudio ? 'audio' : 'text',
      });
      setShowTranscript(false);
      setActiveStep(3);
      setHighestStep(3);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Kendala saat menghubungi AI.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!entities) return;
    setIsSubmitting(true);
    try {
      const assetObj = assets.find((a) => a.id === selectedAssetId) || assets[0];
      const nowIso = new Date().toISOString();
      const newId = `REP-${Math.floor(100 + Math.random() * 899)}`;

      let createdEvidence: Evidence | undefined;
      if (photoFile) {
        createdEvidence = await uploadEvidenceFile(
          newId,
          photoFile,
          `Foto awal lapangan (${assetObj.id})`,
          roleInfo.name,
          { skipDbInsert: true }
        );
      }

      const newReport: Report = {
        id: newId,
        title: reportTitle.trim() || `Temuan Lapangan ${assetObj.id}`,
        asset_id: assetObj.id,
        status: 'PRADUGA',
        finding_type: findingType,
        urgency,
        ...entities,
        risk_level: urgency === 'Mendesak' ? 'HIGH' : 'MEDIUM',
        risk_consequence: urgency === 'Mendesak' ? 'Major' : 'Moderate',
        risk_likelihood: 'Possible',
        risk_summary: 'Penilaian risiko awal (PRADUGA) menunggu verifikasi HSE & Departemen.',
        description: extractionMeta?.transcript || narrative.trim() || entities.gejala,
        reporter_name: roleInfo.name,
        reporter_role: roleInfo.key,
        dept: assetObj.dept,
        evidence_note: createdEvidence
          ? `Foto awal terlampir: ${createdEvidence.file_name}`
          : 'Belum ada foto bukti fisik yang diunggah.',
        image_url: createdEvidence?.public_url,
        sla_reminder_count: 0,
        created_at: nowIso,
        updated_at: nowIso,
      };

      onReportCreated(newReport, createdEvidence);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  const audioSizeKb = recordedBlob ? Math.max(1, Math.round(recordedBlob.size / 1024)) : 0;

  return (
    <div className="space-y-4 max-w-5xl animate-fade-in">
      {/* Header Ringkas */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--ink)] m-0">
            Lapor Cepat
          </h1>
        </div>
        <StatusBadge status="PRADUGA" size="sm" />
      </header>

      {/* Indikator Langkah Wizard (Klik Ulang untuk Langkah Terlewati) */}
      <nav
        aria-label="Langkah Lapor Cepat"
        className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm"
      >
        {(
          [
            { step: 1 as WizardStep, label: '1. Pilih Alat' },
            { step: 2 as WizardStep, label: '2. Catat Temuan' },
            { step: 3 as WizardStep, label: '3. Tinjau & Kirim' },
          ] as const
        ).map((item, idx) => {
          const active = activeStep === item.step;
          const unlocked = canJumpToStep(item.step);
          const completed =
            (item.step === 1 && highestStep > 1) ||
            (item.step === 2 && Boolean(entities)) ||
            (item.step === 3 && Boolean(entities) && activeStep === 3);

          return (
            <React.Fragment key={item.step}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => unlocked && setActiveStep(item.step)}
                aria-current={active ? 'step' : undefined}
                className={`px-3.5 py-2 rounded-xl font-heading text-sm font-bold inline-flex items-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed ${
                  active
                    ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830]'
                    : completed
                      ? 'bg-[var(--cyan-pale)] text-[var(--cyan-dark)] hover:opacity-90'
                      : 'bg-[var(--soft)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {completed && !active && <CheckCircle2 className="w-4 h-4 shrink-0 animate-pop" />}
                <span>{item.label}</span>
              </button>
              {idx < 2 && (
                <ChevronRight className="w-4 h-4 text-[var(--muted)] shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* LAYAR 1: PILIH ALAT & SCAN NAMEPLATE */}
      {activeStep === 1 && (
        <section className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-5 animate-step-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
              1. Pilih Peralatan atau Scan Nameplate
            </h2>

            <div>
              <input
                ref={nameplateInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleScanNameplate}
                className="hidden"
              />
              <button
                type="button"
                disabled={isScanning}
                onClick={() => nameplateInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[var(--cyan-pale)] border border-[var(--cyan)]/40 text-[var(--cyan-dark)] font-heading font-bold text-sm inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
              >
                <Scan className="w-4 h-4" />
                <span>
                  {isScanning ? 'Memindai...' : 'Scan Nameplate (Kamera/Foto)'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
            {assets.map((asset, idx) => {
              const active = selectedAssetId === asset.id;
              return (
                <button
                  key={asset.id}
                  type="button"
                  style={{ '--i': idx } as React.CSSProperties}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`group lift press-soft p-4 rounded-2xl border-2 text-left ${
                    active
                      ? 'border-[var(--cyan)] bg-[var(--cyan-pale)] shadow-sm'
                      : 'border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)]/60'
                  }`}
                >
                  <div className="h-24 rounded-xl bg-gradient-to-b from-[var(--cyan-pale)]/35 to-[var(--surface)] border border-[var(--line-soft)] flex items-center justify-center p-2 mb-2.5">
                    <TechnicalArt
                      type={asset.type}
                      darkMode={isDarkMode}
                      className="w-full h-20"
                    />
                  </div>
                  <div className="font-heading font-extrabold text-sm text-[var(--cyan-dark)]">
                    {asset.id}
                  </div>
                  <div className="font-heading font-bold text-[15px] text-[var(--ink)] mt-0.5">
                    {asset.name}
                  </div>
                  <div className="text-sm text-[var(--ink-soft)] mt-0.5 truncate">
                    {asset.area}
                  </div>
                </button>
              );
            })}
          </div>

          {isScanning && (
            <div aria-busy="true" className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex gap-3.5 animate-fade-in">
              <div className="skeleton w-20 h-20 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 py-1" aria-hidden>
                <div className="skeleton h-4 w-48" />
                <div className="skeleton h-3.5 w-3/4" />
                <div className="skeleton h-3.5 w-1/2" />
              </div>
            </div>
          )}

          {scanResult && (() => {
            const matchedCatalogAsset =
              !scanResult.isUnknownAsset && scanResult.matchedAssetId
                ? assets.find((a) => a.id === scanResult.matchedAssetId)
                : undefined;

            const specParts = (
              [
                ['Pabrikan', scanResult.manufacturer],
                ['Model', scanResult.model],
                ['No. Seri', scanResult.serialNumber],
              ] as const
            ).filter(([, val]) => isValidSpecValue(val));

            const equipmentHeading =
              scanResult.equipmentType ||
              matchedCatalogAsset?.name ||
              'Peralatan Industri';

            const canApplyObservation = Boolean(
              scanResult.visualObservation || scanResult.suggestedNarrative
            );

            return (
              <div className="p-4 rounded-2xl bg-[var(--soft)] border border-[var(--line)] border-l-[3.5px] border-l-[var(--cyan)] space-y-3 animate-fade-in">
                <div className="flex flex-col sm:flex-row gap-3.5">
                  <img
                    src={scanResult.thumbnailUrl}
                    alt={`Foto nameplate ${scanResult.assetTag}`}
                    className="w-20 h-20 rounded-xl object-cover border border-[var(--line)] bg-[var(--surface)] shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-heading font-bold text-base text-[var(--ink)]">
                        Hasil Scan: {scanResult.assetTag}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {scanResult.engine === 'gemini-live' ? (
                          <span
                            style={{
                              backgroundColor: 'var(--green-bg)',
                              color: 'var(--green)',
                              borderColor: 'var(--green-border)',
                              borderLeftColor: 'var(--green)',
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {(scanResult.usedModel || 'GEMINI-3.5-FLASH').toUpperCase()} LIVE
                            </span>
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: 'var(--amber-bg)',
                              color: 'var(--amber)',
                              borderColor: 'var(--amber-border)',
                              borderLeftColor: 'var(--amber)',
                            }}
                            title={scanResult.errorReason}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            <span>LOCAL FALLBACK</span>
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-[7px] bg-[var(--cyan-pale)] text-[var(--cyan-dark)] font-heading text-xs font-bold">
                          {Math.round(scanResult.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {matchedCatalogAsset && (
                      <div
                        style={{
                          backgroundColor: 'var(--green-bg)',
                          borderColor: 'var(--green-border)',
                          borderLeftColor: 'var(--green)',
                        }}
                        className="px-3 py-2 rounded-[7px] border border-l-[3.5px] flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: 'var(--green)' }}
                        />
                        <div className="min-w-0">
                          <div className="font-heading font-bold text-[var(--ink)]">
                            Cocok Katalog: {matchedCatalogAsset.id} · {matchedCatalogAsset.name}
                          </div>
                          <div className="text-sm text-[var(--ink-soft)]">
                            {matchedCatalogAsset.area}
                          </div>
                        </div>
                      </div>
                    )}

                    {specParts.length > 0 ? (
                      <div className="text-sm text-[var(--ink-soft)]">
                        {specParts.map(([label, val], idx) => (
                          <React.Fragment key={label}>
                            {idx > 0 && ' · '}
                            <span className="font-semibold text-[var(--ink)]">
                              {label}:
                            </span>{' '}
                            {val}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--ink-soft)]">
                        <span className="font-semibold text-[var(--ink)]">
                          {equipmentHeading}
                        </span>
                        {' · '}Pelat tag lapangan (kompresi {scanResult.originalKb} KB ke{' '}
                        {scanResult.compressedKb} KB)
                      </div>
                    )}

                    <div className="text-sm text-[var(--ink-soft)] leading-relaxed">
                      {scanResult.specifications}
                      {specParts.length > 0 &&
                        ` (${scanResult.originalKb} KB ke ${scanResult.compressedKb} KB)`}
                    </div>
                  </div>
                </div>

                {scanResult.visualObservation && (
                  <div
                    style={
                      scanResult.hasVisibleAnomaly
                        ? {
                            backgroundColor: 'var(--amber-bg)',
                            borderColor: 'var(--amber-border)',
                            borderLeftColor: 'var(--amber)',
                          }
                        : {
                            backgroundColor: 'var(--surface)',
                            borderColor: 'var(--line)',
                            borderLeftColor: 'var(--cyan)',
                          }
                    }
                    className="p-3 rounded-[7px] border border-l-[3.5px] space-y-1"
                  >
                    <div className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wide">
                      {scanResult.hasVisibleAnomaly ? (
                        <>
                          <AlertTriangle
                            className="w-4 h-4 shrink-0"
                            style={{ color: 'var(--amber)' }}
                          />
                          <span style={{ color: 'var(--amber)' }}>
                            Observasi Visual AI · Anomali Terdeteksi
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 shrink-0 text-[var(--cyan-dark)]" />
                          <span className="text-[var(--cyan-dark)]">
                            Observasi Visual AI
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-[var(--ink)] leading-relaxed m-0">
                      {scanResult.visualObservation}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                  {photoFile && (
                    <div className="text-sm text-[var(--ink-soft)] inline-flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[var(--cyan-dark)] shrink-0" />
                      <span>
                        Foto scan otomatis siap dilampirkan sebagai Foto Bukti Awal di Langkah 3.
                      </span>
                    </div>
                  )}

                  {scanResult.hasVisibleAnomaly && canApplyObservation && (
                    <button
                      type="button"
                      onClick={handleApplyScanToFinding}
                      className="group px-3.5 py-2 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm shrink-0"
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Pakai Observasi AI ke Narasi Temuan</span>
                      <ArrowRight className="w-4 h-4 nudge-x shrink-0" />
                    </button>
                  )}
                </div>

                {scanResult.isUnknownAsset && (
                  <div
                    style={{
                      backgroundColor: 'var(--amber-bg)',
                      borderColor: 'var(--amber-border)',
                      borderLeftColor: 'var(--amber)',
                    }}
                    className="p-3 rounded-[7px] border border-l-[4px] flex items-center gap-2 text-sm font-semibold text-[var(--ink)]"
                  >
                    <AlertTriangle
                      className="w-4 h-4 shrink-0"
                      style={{ color: 'var(--amber)' }}
                    />
                    <span>
                      Tag &ldquo;{scanResult.assetTag}&rdquo; tidak ada di daftar utama. Pilih kartu alat secara manual di atas.
                    </span>
                  </div>
                )}
              </div>
            );
          })()}

          {errorMsg && (
            <div
              key={errorMsg}
              role="alert"
              style={{
                backgroundColor: 'var(--red-bg)',
                borderColor: 'var(--red-border)',
                color: 'var(--red)',
              }}
              className="p-3.5 rounded-xl border text-sm font-bold animate-shake"
            >
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--line-soft)]">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--hover-bg)] text-[var(--ink)] font-heading font-bold text-sm"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="group px-5 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <span>Lanjut ke Temuan</span>
              <ArrowRight className="w-4 h-4 nudge-x" />
            </button>
          </div>
        </section>
      )}

      {/* LAYAR 2: REKAM SUARA ATAU KETIK TEMUAN */}
      {activeStep === 2 && (
        <section className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4 animate-step-in">
          {/* Baris Info Aset Terpilih + Toggle Mode Input */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line-soft)]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[7px] bg-[var(--cyan-pale)] border border-[var(--cyan)]/35 font-heading text-sm font-bold text-[var(--cyan-dark)]">
              <span>Alat: {selectedAsset.id}</span>
              <span className="text-[var(--ink)] font-semibold">({selectedAsset.name})</span>
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="underline text-xs font-extrabold ml-1"
              >
                Ganti
              </button>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
              <button
                type="button"
                onClick={() => setInputMode('voice')}
                className={`px-3.5 py-1.5 rounded-lg font-heading text-sm font-bold inline-flex items-center gap-1.5 transition-colors ${
                  inputMode === 'voice'
                    ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm'
                    : 'text-[var(--ink-soft)]'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Rekam Suara</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`px-3.5 py-1.5 rounded-lg font-heading text-sm font-bold inline-flex items-center gap-1.5 transition-colors ${
                  inputMode === 'text'
                    ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm'
                    : 'text-[var(--ink-soft)]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Ketik Teks</span>
              </button>
            </div>
          </div>

          {inputMode === 'voice' ? (
            <div className="p-5 rounded-2xl border-2 border-dashed border-[var(--line)] bg-[var(--soft)] text-center space-y-3">
              <div className="flex justify-center">
                {micStatus === 'live' && isRecording ? (
                  <span
                    style={{
                      backgroundColor: 'var(--red-bg)',
                      color: 'var(--red)',
                      borderColor: 'var(--red-border)',
                      borderLeftColor: 'var(--red)',
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase"
                  >
                    <span className="w-2 h-2 rounded-[2px] bg-[#DC2626] animate-pulse" />
                    <span>MIC LIVE · {formatTimer(recordSeconds)}</span>
                  </span>
                ) : micStatus === 'requesting' ? (
                  <span
                    style={{
                      backgroundColor: 'var(--info-bg)',
                      color: 'var(--info)',
                      borderColor: 'var(--info-border)',
                      borderLeftColor: 'var(--info)',
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase"
                  >
                    <span>MEMINTA IZIN MIC...</span>
                  </span>
                ) : micStatus === 'recorded' && recordedBlob ? (
                  <span
                    style={{
                      backgroundColor: 'var(--green-bg)',
                      color: 'var(--green)',
                      borderColor: 'var(--green-border)',
                      borderLeftColor: 'var(--green)',
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>REKAMAN SIAP ({formatTimer(recordSeconds)})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--cyan-dark)] bg-[var(--surface)] text-[var(--ink-soft)] font-heading text-xs font-bold uppercase">
                    <Mic className="w-3.5 h-3.5 text-[var(--cyan-dark)]" />
                    <span>
                      {micStatus === 'denied' || micStatus === 'unavailable'
                        ? 'MIKROFON TIDAK AKTIF'
                        : 'SIAP MEREKAM'}
                    </span>
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={micStatus === 'requesting'}
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg transition-transform hover:scale-105 disabled:opacity-60 ${
                  isRecording ? 'bg-[#DC2626] text-white' : 'bg-[#00B8D9] text-[#061A38]'
                }`}
                title={isRecording ? 'Hentikan rekaman' : 'Mulai rekam suara'}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              <div className="font-heading font-bold text-sm text-[var(--ink)]">
                {isRecording
                  ? `Merekam (${formatTimer(recordSeconds)}). Tekan tombol merah untuk berhenti.`
                  : recordedBlob
                    ? 'Rekaman selesai. Putar pratinjau atau langsung ekstrak.'
                    : 'Tekan tombol mikrofon untuk mulai berbicara.'}
              </div>

              <div
                className={`h-7 flex items-center justify-center gap-1 ${
                  isRecording ? 'voice-wave-active' : 'opacity-40'
                }`}
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} className="voice-wave-bar" />
                ))}
              </div>

              {(micStatus === 'denied' || micStatus === 'unavailable') && micNotice && (
                <div
                  style={{
                    backgroundColor: 'var(--amber-bg)',
                    borderColor: 'var(--amber-border)',
                    borderLeftColor: 'var(--amber)',
                  }}
                  className="p-3.5 rounded-[7px] border border-l-[4px] text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2 text-sm font-semibold text-[var(--ink)]">
                    <AlertTriangle
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: 'var(--amber)' }}
                    />
                    <span>{micNotice}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInputMode('text')}
                      className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] font-heading text-xs font-bold text-[var(--ink)]"
                    >
                      Ketik Teks
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRecordedBlob(null);
                        revokeAudioUrl();
                        setNarrative(SAMPLE_PROMPTS[selectedAssetId] || SAMPLE_PROMPTS['P-101A']);
                        setInputMode('text');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] font-heading text-xs font-bold text-[var(--cyan-dark)]"
                    >
                      Contoh {selectedAssetId}
                    </button>
                  </div>
                </div>
              )}

              {!isRecording && recordedBlob && audioUrl && (
                <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-left space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-sm font-bold text-[var(--ink)]">
                    <span className="inline-flex items-center gap-2 font-heading">
                      <FileAudio className="w-4 h-4 text-[var(--cyan-dark)]" />
                      <span>Pratinjau Audio</span>
                    </span>
                    <span className="text-xs font-heading text-[var(--ink-soft)]">
                      {formatTimer(recordSeconds)} · {audioSizeKb} KB
                    </span>
                  </div>
                  <audio controls src={audioUrl} className="w-full" />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleReRecord}
                      className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] text-xs font-heading font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rekam Ulang</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setRecordedBlob(null);
                    revokeAudioUrl();
                    setNarrative(SAMPLE_PROMPTS[selectedAssetId] || SAMPLE_PROMPTS['P-101A']);
                    setInputMode('text');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] text-sm font-bold text-[var(--ink)]"
                >
                  Isi Contoh Narasi {selectedAssetId}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-bold text-[var(--ink)]">
                  Narasi Temuan Lapangan
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setNarrative(SAMPLE_PROMPTS[selectedAssetId] || SAMPLE_PROMPTS['P-101A'])
                  }
                  className="px-3 py-1.5 rounded-[7px] border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] text-xs font-heading font-bold text-[var(--cyan-dark)]"
                >
                  Isi Contoh {selectedAssetId}
                </button>
              </div>
              <textarea
                rows={5}
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Tulis gejala alat, kondisi operasi, dan dugaan awal..."
                className="w-full p-4 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-[15px] font-medium focus:outline-none focus:border-[var(--cyan)]"
              />
            </div>
          )}

          {errorMsg && (
            <div
              key={errorMsg}
              role="alert"
              style={{
                backgroundColor: 'var(--red-bg)',
                borderColor: 'var(--red-border)',
                color: 'var(--red)',
              }}
              className="p-3.5 rounded-xl border text-sm font-bold animate-shake"
            >
              {errorMsg}
            </div>
          )}

          {isExtracting && (
            <div aria-busy="true" className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] space-y-2.5 animate-fade-in">
              <div className="skeleton h-3.5 w-3/4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" aria-hidden>
                <div className="skeleton h-9" />
                <div className="skeleton h-9" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--line-soft)]">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="group px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--hover-bg)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 nudge-back" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              disabled={isExtracting}
              onClick={() => handleExtractAI()}
              className="group px-5 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isExtracting ? 'animate-spin' : ''}`} />
              <span>
                {isExtracting
                  ? 'Mengekstrak...'
                  : 'Ekstrak 7 Entitas dengan AI'}
              </span>
              {!isExtracting && <ArrowRight className="w-4 h-4 nudge-x" />}
            </button>
          </div>
        </section>
      )}

      {/* LAYAR 3: TINJAU 7 ENTITAS & LAMPIRKAN BUKTI */}
      {activeStep === 3 && entities && (
        <section className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4 animate-step-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--line-soft)]">
            <h2 className="font-heading text-lg font-bold text-[var(--ink)] m-0">
              3. Tinjau 7 Entitas &amp; Lampirkan Bukti
            </h2>

            {extractionMeta?.engine === 'gemini-live' ? (
              <span
                style={{
                  backgroundColor: 'var(--green-bg)',
                  color: 'var(--green)',
                  borderColor: 'var(--green-border)',
                  borderLeftColor: 'var(--green)',
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{(extractionMeta.usedModel || 'GEMINI-3.5-FLASH').toUpperCase()} LIVE</span>
              </span>
            ) : (
              <span
                style={{
                  backgroundColor: 'var(--amber-bg)',
                  color: 'var(--amber)',
                  borderColor: 'var(--amber-border)',
                  borderLeftColor: 'var(--amber)',
                }}
                title={extractionMeta?.errorReason}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>LOCAL FALLBACK</span>
              </span>
            )}
          </div>

          {extractionMeta?.engine === 'local-fallback' && extractionMeta.errorReason && (
            <div
              style={{
                backgroundColor: 'var(--amber-bg)',
                borderColor: 'var(--amber-border)',
                borderLeftColor: 'var(--amber)',
              }}
              className="p-3 rounded-[7px] border border-l-[4px] text-sm font-semibold text-[var(--ink)]"
            >
              <b style={{ color: 'var(--amber)' }}>Fallback Lokal: </b>
              <span>{extractionMeta.errorReason}</span>
            </div>
          )}

          {/* Ringkasan Judul, Aset, Urgensi & Jenis Temuan */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label className="block text-sm font-bold text-[var(--ink)] mb-1">
                Judul Laporan
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-bold focus:outline-none focus:border-[var(--cyan)]"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-[var(--ink)] mb-1">
                Aset
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] font-heading text-sm font-bold focus:outline-none focus:border-[var(--cyan)]"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} : {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[var(--ink)] mb-1">
                Urgensi
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'Mendesak' | 'Normal')}
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] font-heading text-sm font-bold focus:outline-none focus:border-[var(--cyan)]"
              >
                <option value="Normal">Normal</option>
                <option value="Mendesak">Mendesak</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[var(--ink)] mb-1">
                Jenis
              </label>
              <select
                value={findingType}
                onChange={(e) =>
                  setFindingType(
                    e.target.value as 'Kondisi Abnormal' | 'Potensi Bahaya' | 'Near Miss'
                  )
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] font-heading text-sm font-bold focus:outline-none focus:border-[var(--cyan)]"
              >
                <option value="Kondisi Abnormal">Kondisi Abnormal</option>
                <option value="Potensi Bahaya">Potensi Bahaya</option>
                <option value="Near Miss">Near Miss</option>
              </select>
            </div>
          </div>

          {/* 7 Kolom Entitas dalam Grid 2 Kolom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(
              [
                ['1. Identitas Alat', 'identitas_alat'],
                ['2. Gejala Teramati', 'gejala'],
                ['3. Kondisi Operasi', 'kondisi_operasi'],
                ['4. Pemeriksaan Awal', 'pemeriksaan_awal'],
                ['5. Praduga Penyebab', 'praduga_penyebab'],
                ['6. Usulan Tindakan Awal', 'usulan_tindakan'],
                ['7. Verifikasi Pasca-Perbaikan', 'verifikasi'],
              ] as const
            ).map(([label, key]) => (
              <div key={key} className={key === 'verifikasi' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1">
                  {label}
                </label>
                <textarea
                  rows={2}
                  value={entities[key]}
                  onChange={(e) => setEntities({ ...entities, [key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>
            ))}
          </div>

          {/* Kotak Unggah Foto Bukti Opsional */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </span>
              <div>
                <div className="font-heading font-bold text-sm text-[var(--ink)]">
                  Foto Bukti Awal (Opsional)
                </div>
                <div className="text-sm text-[var(--ink-soft)]">
                  {photoFile ? photoFile.name : 'Mendukung JPG, PNG, WEBP.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview bukti"
                  className="w-11 h-11 rounded-lg object-cover border border-[var(--line)]"
                />
              )}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{photoFile ? 'Ganti Foto' : 'Pilih Foto'}</span>
              </button>
            </div>
          </div>

          {/* Accordion Transkrip Asli (Tertutup Default) */}
          {extractionMeta?.transcript && (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--soft)] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowTranscript((prev) => !prev)}
                className="w-full px-4 py-2.5 flex items-center justify-between gap-2 font-heading text-sm font-bold text-[var(--ink)] hover:bg-[var(--hover-bg)] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  {extractionMeta.sourceMode === 'audio' ? (
                    <FileAudio className="w-4 h-4 text-[var(--cyan-dark)]" />
                  ) : (
                    <FileText className="w-4 h-4 text-[var(--cyan-dark)]" />
                  )}
                  <span>Transkrip Asli</span>
                </span>
                {showTranscript ? (
                  <ChevronUp className="w-4 h-4 text-[var(--ink-soft)]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[var(--ink-soft)]" />
                )}
              </button>
              {showTranscript && (
                <div className="px-4 pb-3 pt-1 border-t border-[var(--line-soft)] text-sm text-[var(--ink)] leading-relaxed">
                  &ldquo;{extractionMeta.transcript}&rdquo;
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div
              key={errorMsg}
              role="alert"
              style={{
                backgroundColor: 'var(--red-bg)',
                borderColor: 'var(--red-border)',
                color: 'var(--red)',
              }}
              className="p-3.5 rounded-xl border text-sm font-bold animate-shake"
            >
              {errorMsg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--line-soft)]">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="group px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--hover-bg)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 nudge-back" />
              <span>Ubah Narasi</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitReport}
              className="group px-5 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#066346] text-white font-heading font-bold text-sm inline-flex items-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <span>
                {isSubmitting ? 'Menyimpan...' : 'Kirim Laporan (Status Praduga)'}
              </span>
              <ArrowRight className="w-4 h-4 nudge-x" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
