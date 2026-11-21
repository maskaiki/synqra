'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Asset, Evidence, FailureEntities, Report, RoleInfo } from '@/types/synqra';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { uploadEvidenceFile } from '@/lib/dataService';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
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

type MicStatus = 'idle' | 'requesting' | 'live' | 'recorded' | 'denied' | 'unavailable';

interface ExtractionMeta {
  engine: 'gemini-live' | 'local-fallback';
  usedModel?: string;
  errorReason?: string;
  transcript: string;
  sourceMode: 'audio' | 'text';
}

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB

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

export const LaporCepatView: React.FC<LaporCepatViewProps> = ({
  assets,
  roleInfo,
  isDarkMode,
  onReportCreated,
  onCancel,
}) => {
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
  const [scanSummary, setScanSummary] = useState<string | null>(null);

  const [isExtracting, setIsExtracting] = useState(false);
  const [entities, setEntities] = useState<FailureEntities | null>(null);
  const [extractionMeta, setExtractionMeta] = useState<ExtractionMeta | null>(null);
  const [reportTitle, setReportTitle] = useState('');

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
  const nameplateInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

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
    };
  }, []);

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
        'Mikrofon browser tidak tersedia pada perangkat atau konteks ini. Silakan gunakan tab Ketik Teks atau tombol Contoh Narasi di bawah.'
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
          ? 'Izin mikrofon ditolak browser. Aktifkan izin mikrofon di address bar atau beralih ke Ketik Teks / Contoh Narasi untuk melanjutkan.'
          : 'Perangkat mikrofon tidak terdeteksi atau sedang dipakai aplikasi lain. Silakan gunakan Ketik Teks atau Contoh Narasi.'
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
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/scan-nameplate', { method: 'POST', body: fd });
      const json = (await res.json()) as {
        success?: boolean;
        data?: {
          matchedAssetId?: string;
          assetTag?: string;
          manufacturer?: string;
          specifications?: string;
        };
        error?: string;
      };
      if (json.success && json.data) {
        const matched = json.data.matchedAssetId || 'P-101A';
        setSelectedAssetId(matched);
        setScanSummary(
          `Terdeteksi: ${json.data.assetTag || matched} (${json.data.manufacturer || 'Industrial Asset'}) — ${json.data.specifications || 'Katalog cocok'}`
        );
      } else {
        setErrorMsg(json.error || 'Gagal memindai nameplate.');
      }
    } catch {
      setErrorMsg('Gagal menghubungi layanan Scan Nameplate.');
    } finally {
      setIsScanning(false);
      if (nameplateInputRef.current) nameplateInputRef.current.value = '';
    }
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
      setErrorMsg('Rekam suara atau isi narasi singkat terlebih dahulu sebelum ekstraksi AI.');
      return;
    }

    if (useAudio && recordedBlob && recordedBlob.size > MAX_AUDIO_BYTES) {
      setErrorMsg(
        'Ukuran rekaman audio melebihi batas maksimal 10 MB. Silakan rekam lebih singkat atau gunakan input teks.'
      );
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
        status?: string;
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
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kendala saat menghubungi AI.');
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
          roleInfo.name
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
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="font-heading text-xs font-bold uppercase tracking-[0.12em] text-[var(--cyan-dark)]">
            TAHAP 1 · PRELIMINARY REPORT
          </div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ink)] mt-1">
            Lapor Cepat Lapangan
          </h1>
          <p className="text-[15px] text-[var(--ink-soft)] mt-1">
            Pilih aset, rekam suara (VN) atau ketik singkat — Gemini AI menyusun 7 entitas berstatus{' '}
            <b className="text-[var(--amber)]">PRADUGA</b>.
          </p>
        </div>
        <StatusBadge status="PRADUGA" />
      </header>

      <div className="flex items-center gap-3 flex-wrap">
        {[
          { num: 1, label: 'Pilih Aset / Scan', done: Boolean(selectedAssetId) },
          { num: 2, label: 'Rekam Suara / Narasi', done: Boolean(narrative.trim() || recordedBlob) },
          { num: 3, label: 'Tinjau 7 Entitas & Kirim', done: Boolean(entities) },
        ].map((st, idx) => (
          <React.Fragment key={st.num}>
            <div className="flex items-center gap-2 font-heading text-sm font-bold text-[var(--ink)]">
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                  st.done
                    ? 'bg-[#00B8D9] text-[#061A38]'
                    : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-soft)]'
                }`}
              >
                {st.num}
              </span>
              <span>{st.label}</span>
            </div>
            {idx < 2 && <div className="w-8 h-[2px] bg-[var(--line)] hidden sm:block" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Pilih Peralatan & Klasifikasi */}
      <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
              1. Pilih Peralatan atau Scan Nameplate
            </h2>
            <p className="text-sm text-[var(--ink-soft)]">
              Pastikan kode aset tepat untuk mencegah kesalahan riwayat antar-mesin.
            </p>
          </div>
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
              className="px-4 py-2.5 rounded-xl bg-[var(--cyan-pale)] border border-[var(--cyan)]/40 text-[var(--cyan-dark)] font-heading font-bold text-sm inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Scan className="w-4 h-4" />
              <span>{isScanning ? 'Memindai Nameplate...' : 'Scan Nameplate (Kamera AI)'}</span>
            </button>
          </div>
        </div>

        {scanSummary && (
          <div
            style={{
              backgroundColor: 'var(--green-bg)',
              borderColor: 'var(--green-border)',
              color: 'var(--green)',
            }}
            className="p-3.5 rounded-xl border text-sm font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{scanSummary}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const active = selectedAssetId === asset.id;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelectedAssetId(asset.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  active
                    ? 'border-[var(--cyan)] bg-[var(--cyan-pale)] shadow-sm'
                    : 'border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)]/60'
                }`}
              >
                <div className="h-24 rounded-xl bg-[var(--surface)] border border-[var(--line-soft)] flex items-center justify-center p-2 mb-3">
                  <TechnicalArt type={asset.type} darkMode={isDarkMode} className="w-full h-20" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--line-soft)]">
          <div>
            <label className="block text-sm font-bold text-[var(--ink)] mb-2">
              Klasifikasi Temuan Awal
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Kondisi Abnormal', 'Potensi Bahaya', 'Near Miss'] as const).map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => setFindingType(ft)}
                  className={`px-3.5 py-2 rounded-xl border font-heading text-sm font-bold transition-colors ${
                    findingType === ft
                      ? 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] border-transparent'
                      : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--ink)] mb-2">
              Tingkat Urgensi Lapangan
            </label>
            <div className="flex gap-2">
              {(['Normal', 'Mendesak'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`px-4 py-2 rounded-xl border font-heading text-sm font-bold transition-colors ${
                    urgency === u
                      ? u === 'Mendesak'
                        ? 'bg-[#B42318] text-white border-transparent'
                        : 'bg-[#0B1F44] dark:bg-[#00B8D9] text-white dark:text-[#061830] border-transparent'
                      : 'bg-[var(--soft)] border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Rekam Suara / Narasi Teks & Foto Bukti */}
      <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
              2. Sampaikan Temuan &amp; Foto Bukti Awal
            </h2>
            <p className="text-sm text-[var(--ink-soft)]">
              Gunakan rekaman suara atau ketik bebas dalam bahasa lapangan Indonesia–Inggris.
            </p>
          </div>
          <div className="inline-flex p-1 rounded-xl bg-[var(--soft)] border border-[var(--line)] self-start">
            <button
              type="button"
              onClick={() => setInputMode('voice')}
              className={`px-4 py-2 rounded-lg font-heading text-sm font-bold inline-flex items-center gap-2 transition-colors ${
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
              className={`px-4 py-2 rounded-lg font-heading text-sm font-bold inline-flex items-center gap-2 transition-colors ${
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
          <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--line)] bg-[var(--soft)] text-center space-y-4">
            {/* Status Mikrofon Eksplisit */}
            <div className="flex justify-center">
              {micStatus === 'live' && isRecording ? (
                <span
                  style={{
                    backgroundColor: 'var(--red-bg)',
                    color: 'var(--red)',
                    borderColor: 'var(--red-border)',
                    borderLeftColor: 'var(--red)',
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
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
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                >
                  <span>MEMINTA IZIN MIKROFON...</span>
                </span>
              ) : micStatus === 'recorded' && recordedBlob ? (
                <span
                  style={{
                    backgroundColor: 'var(--green-bg)',
                    color: 'var(--green)',
                    borderColor: 'var(--green-border)',
                    borderLeftColor: 'var(--green)',
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>REKAMAN SIAP ({formatTimer(recordSeconds)})</span>
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-[7px] border border-l-[3.5px] border-[var(--line)] border-l-[var(--cyan-dark)] bg-[var(--surface)] text-[var(--ink-soft)] font-heading text-xs font-bold uppercase tracking-wider"
                >
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
              className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-lg transition-transform hover:scale-105 disabled:opacity-60 ${
                isRecording ? 'bg-[#DC2626] text-white' : 'bg-[#00B8D9] text-[#061A38]'
              }`}
              title={isRecording ? 'Hentikan rekaman suara' : 'Mulai rekam suara'}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <div className="font-heading font-bold text-base text-[var(--ink)]">
              {isRecording
                ? `Merekam suara lapangan secara langsung (${formatTimer(recordSeconds)})`
                : recordedBlob
                  ? 'Rekaman suara selesai — putar pratinjau atau langsung ekstrak'
                  : 'Tekan tombol mikrofon untuk mulai berbicara'}
            </div>

            <div
              className={`h-9 flex items-center justify-center gap-1 ${
                isRecording ? 'voice-wave-active' : 'opacity-45'
              }`}
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} className="voice-wave-bar" />
              ))}
            </div>

            {/* Peringatan Ramah jika Mikrofon Ditolak / Tidak Tersedia */}
            {(micStatus === 'denied' || micStatus === 'unavailable') && micNotice && (
              <div
                style={{
                  backgroundColor: 'var(--amber-bg)',
                  borderColor: 'var(--amber-border)',
                  borderLeftColor: 'var(--amber)',
                }}
                className="p-4 rounded-[7px] border border-l-[4px] text-left space-y-3"
              >
                <div className="flex items-start gap-2.5 text-sm font-semibold text-[var(--ink)]">
                  <AlertTriangle
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: 'var(--amber)' }}
                  />
                  <div>
                    <b style={{ color: 'var(--amber)' }}>Mikrofon Tidak Dapat Diakses: </b>
                    <span>{micNotice}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pl-7">
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--cyan)] text-sm font-heading font-bold text-[var(--ink)] inline-flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4 text-[var(--cyan-dark)]" />
                    <span>Beralih ke Ketik Teks</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRecordedBlob(null);
                      revokeAudioUrl();
                      setNarrative(SAMPLE_PROMPTS[selectedAssetId] || SAMPLE_PROMPTS['P-101A']);
                      setInputMode('text');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--cyan)] text-sm font-heading font-bold text-[var(--ink)]"
                  >
                    Isi Contoh Narasi {selectedAssetId}
                  </button>
                </div>
              </div>
            )}

            {/* Pratinjau Pemutar Audio & Tombol Rekam Ulang / Ekstrak Langsung */}
            {!isRecording && recordedBlob && audioUrl && (
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-left space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-[var(--ink)]">
                  <span className="inline-flex items-center gap-2 font-heading">
                    <FileAudio className="w-4 h-4 text-[var(--cyan-dark)]" />
                    <span>Pratinjau Rekaman Suara</span>
                  </span>
                  <span className="text-[var(--ink-soft)] font-heading text-xs">
                    Durasi {formatTimer(recordSeconds)} · {audioSizeKb} KB
                  </span>
                </div>
                <audio controls src={audioUrl} className="w-full" />
                <div className="flex flex-wrap justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleReRecord}
                    className="px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] text-sm font-heading font-bold text-[var(--ink)] inline-flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Rekam Ulang</span>
                  </button>
                  <button
                    type="button"
                    disabled={isExtracting}
                    onClick={() => handleExtractAI('audio')}
                    className="px-4 py-2.5 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isExtracting
                        ? 'Mengekstrak Audio...'
                        : 'Ekstrak Audio ke 7 Entitas'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            <p className="text-sm text-[var(--ink-soft)]">
              {isRecording
                ? 'Tekan kembali tombol merah untuk menghentikan rekaman.'
                : 'Atau gunakan contoh narasi teks di bawah untuk menguji ekstraksi 7 entitas langsung:'}
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
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
                Gunakan Contoh Narasi {selectedAssetId}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-sm font-bold text-[var(--ink)]">
                Narasi Kondisi Lapangan
              </label>
              <button
                type="button"
                onClick={() =>
                  setNarrative(SAMPLE_PROMPTS[selectedAssetId] || SAMPLE_PROMPTS['P-101A'])
                }
                className="px-3 py-1.5 rounded-[7px] border border-[var(--line)] bg-[var(--soft)] hover:border-[var(--cyan)] text-xs font-heading font-bold text-[var(--cyan-dark)]"
              >
                Isi Contoh Narasi {selectedAssetId}
              </button>
            </div>
            <textarea
              rows={4}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Contoh: Pompa P-101A bergetar keras 7,6 mm/s di bearing drive end dan ada rembesan tipis di sekitar mechanical seal..."
              className="w-full p-4 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-[15px] font-medium focus:outline-none focus:border-[var(--cyan)]"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)]">
          <div className="flex items-center gap-3.5">
            <span className="w-11 h-11 rounded-xl bg-[var(--cyan-pale)] text-[var(--cyan-dark)] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <div className="font-heading font-bold text-sm text-[var(--ink)]">
                Lampirkan Foto Bukti Awal (Disarankan)
              </div>
              <div className="text-sm text-[var(--ink-soft)]">
                {photoFile
                  ? photoFile.name
                  : 'Mendukung JPG, PNG, WEBP. Mempercepat lolos validasi pakar.'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview bukti"
                className="w-12 h-12 rounded-lg object-cover border border-[var(--line)]"
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
              className="px-4 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--cyan)] text-[var(--ink)] font-heading font-bold text-sm inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{photoFile ? 'Ganti Foto' : 'Pilih Foto'}</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--red-bg)',
              borderColor: 'var(--red-border)',
              color: 'var(--red)',
            }}
            className="p-3.5 rounded-xl border text-sm font-bold"
          >
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            disabled={isExtracting}
            onClick={() => handleExtractAI()}
            className="px-6 py-3 rounded-xl bg-[#0B1F44] hover:bg-[#13315C] dark:bg-[#00B8D9] dark:hover:bg-[#22D3EE] text-white dark:text-[#061830] font-heading font-bold text-sm inline-flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isExtracting
                ? 'Mengekstrak 7 Entitas via Gemini AI...'
                : 'Ekstrak 7 Entitas dengan AI'}
            </span>
          </button>
        </div>
      </section>

      {/* Step 3: Hasil Ekstraksi AI — 7 Entitas Terstruktur */}
      {entities && (
        <section className="p-6 rounded-2xl bg-[var(--surface)] border-2 border-[var(--cyan)] shadow-md space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--line-soft)]">
            <div>
              <h2 className="font-heading text-lg font-bold text-[var(--ink)]">
                3. Hasil Ekstraksi AI — 7 Entitas Terstruktur
              </h2>
              <p className="text-sm text-[var(--ink-soft)]">
                Tinjau dan sunting bila perlu sebelum dikirim ke antrean Triage. Status awal dikunci sebagai PRADUGA.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {extractionMeta?.engine === 'gemini-live' ? (
                <span
                  style={{
                    backgroundColor: 'var(--green-bg)',
                    color: 'var(--green)',
                    borderColor: 'var(--green-border)',
                    borderLeftColor: 'var(--green)',
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border border-l-[3.5px] font-heading text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                >
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <span>LOCAL FALLBACK</span>
                </span>
              )}
              <StatusBadge status="PRADUGA" />
            </div>
          </div>

          {/* Keterangan Fallback jika model lokal aktif */}
          {extractionMeta?.engine === 'local-fallback' && extractionMeta.errorReason && (
            <div
              style={{
                backgroundColor: 'var(--amber-bg)',
                borderColor: 'var(--amber-border)',
                borderLeftColor: 'var(--amber)',
              }}
              className="p-3.5 rounded-[7px] border border-l-[4px] flex items-start gap-2.5 text-sm font-semibold text-[var(--ink)]"
            >
              <AlertTriangle
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: 'var(--amber)' }}
              />
              <div>
                <b style={{ color: 'var(--amber)' }}>Mode Fallback Lokal Aktif: </b>
                <span>{extractionMeta.errorReason}</span>
              </div>
            </div>
          )}

          {/* Kotak Transkrip Audio Asli untuk perbandingan langsung dengan 7 entitas */}
          {extractionMeta?.transcript && (
            <div className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--line)] border-l-[3.5px] border-l-[var(--cyan)] space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--cyan-dark)] inline-flex items-center gap-1.5">
                  {extractionMeta.sourceMode === 'audio' ? (
                    <FileAudio className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>Transkrip Audio Asli</span>
                </span>
                <span className="font-heading text-xs font-bold text-[var(--ink-soft)]">
                  Sumber: {extractionMeta.sourceMode === 'audio' ? 'Rekaman Suara (VN)' : 'Input Narasi Teks'}
                </span>
              </div>
              <p className="text-sm text-[var(--ink)] font-medium leading-relaxed m-0">
                &ldquo;{extractionMeta.transcript}&rdquo;
              </p>
            </div>
          )}

          {/* Field Auto-fill AI yang tetap dapat diedit manual */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                Judul Singkat Laporan (Saran AI)
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-[15px] font-bold focus:outline-none focus:border-[var(--cyan)]"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                Aset Terdeteksi
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] font-heading text-sm font-bold focus:outline-none focus:border-[var(--cyan)]"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} — {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                Urgensi (Saran AI)
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'Mendesak' | 'Normal')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] font-heading text-sm font-bold focus:outline-none focus:border-[var(--cyan)]"
              >
                <option value="Normal">Normal</option>
                <option value="Mendesak">Mendesak</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(
              [
                ['1. Identitas Alat', 'identitas_alat'],
                ['2. Gejala Teramati', 'gejala'],
                ['3. Kondisi Operasi', 'kondisi_operasi'],
                ['4. Pemeriksaan Awal', 'pemeriksaan_awal'],
                ['5. Praduga Penyebab (Belum Pasti)', 'praduga_penyebab'],
                ['6. Usulan Tindakan Awal', 'usulan_tindakan'],
                ['7. Verifikasi Pasca-Perbaikan', 'verifikasi'],
              ] as const
            ).map(([label, key]) => (
              <div key={key} className={key === 'verifikasi' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                  {label}
                </label>
                <textarea
                  rows={2}
                  value={entities[key]}
                  onChange={(e) => setEntities({ ...entities, [key]: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--soft)] text-[var(--ink)] text-sm font-medium focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[var(--line-soft)]">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-heading font-bold text-sm"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitReport}
              className="px-6 py-3 rounded-xl bg-[#087F5B] hover:bg-[#066346] text-white font-heading font-bold text-sm inline-flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Menyimpan...' : 'Kirim Laporan (Status PRADUGA)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
