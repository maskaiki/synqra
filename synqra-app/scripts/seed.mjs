/**
 * SYNQRA DATABASE SEED SCRIPT
 * Populates Supabase with 10 realistic refinery failure cases across:
 * - Pompa Sentrifugal P-101A (Rotating & Mechanical)
 * - Heat Exchanger E-201 (Process & Thermal)
 * - Control Valve FCV-301 (Piping & Instrumentation)
 *
 * Special test cases included:
 * 1. REP-001 & REP-005: Created > 48 hours ago to trigger RED SLA Overdue banner & reminders.
 * 2. REP-005: Has NO evidence attached (empty evidence) to demonstrate Hard Gate Validation Lock.
 * 3. REP-006: Reported by Dr. Rina Suryani (hse_validator) to demonstrate No Self-Approval lock.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if exists
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0) {
        const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')
);

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

const SEED_ASSETS = [
  {
    id: 'P-101A',
    name: 'Pompa Sentrifugal Umpan Mentah',
    type: 'pump',
    area: 'Unit Crude Distillation (CDU)',
    description: 'Pompa sentrifugal multistage transfer fluida hidrokarbon berat.',
  },
  {
    id: 'E-201',
    name: 'Heat Exchanger Pre-Heat Train',
    type: 'heat',
    area: 'Unit Treated Oil',
    description: 'Shell & tube heat exchanger perpindahan panas minyak mentah ke produk.',
  },
  {
    id: 'FCV-301',
    name: 'Pneumatic Flow Control Valve',
    type: 'valve',
    area: 'Jalur Gas Fuel Gas Unit',
    description: 'Katup kontrol aliran gas bertekanan tinggi dengan smart positioner.',
  },
];

const SEED_REPORTS = [
  {
    id: 'REP-001',
    title: 'Anomali Tekanan & Vibrasi Bantalan DE Pompa P-101A',
    asset_id: 'P-101A',
    status: 'INVESTIGATION',
    identitas_alat: 'Pompa Sentrifugal P-101A (Tag: P-101A)',
    gejala: 'Fluktuasi tekanan discharge 3.2 - 4.1 bar dan vibrasi abnormal pada bantalan drive end (DE).',
    kondisi_operasi: 'Tekanan hisap normal 1.2 bar, temperatur fluida 45°C, debit 110 m³/jam (kapasitas 88%).',
    pemeriksaan_awal: 'Vibrasi terukur 7.8 mm/s di bantalan DE, rembesan ringan mechanical seal.',
    praduga_penyebab: 'Keausan seal chamber dan misalignment kopling poros terhadap driver motor.',
    usulan_tindakan: 'Laser alignment ulang poros dan penggantian cartridge mechanical seal.',
    verifikasi: 'Uji jalan continuous 4 jam tanpa kenaikan vibrasi melampaui batas ISO 3.0 mm/s.',
    risk_level: 'HIGH',
    risk_consequence: 'Major',
    risk_likelihood: 'Possible',
    risk_summary: 'Risiko tinggi kerusakan bearing katastrofik & potensi unplanned shutdown unit CDU.',
    capa_corrective: 'Penggantian cartridge mechanical seal dan realign poros dengan laser alignment.',
    capa_preventive: 'Pemasangan sensor vibration online wireless untuk continuous telemetry monitoring.',
    capa_target_date: '2026-11-28',
    capa_pic: 'Dedi Kusnadi (Mekanik)',
    description: 'Tekanan discharge berfluktuasi tajam antara 3.2 - 4.1 bar disertai vibrasi pada bantalan drive end.',
    reporter_name: 'Dedi Kusnadi',
    reporter_role: 'frontline_omi',
    dept: 'Mekanik & Rotating',
    evidence_note: 'Spektrum FFT vibration logger & foto area seal.',
    image_url: '/assets/synqra-logo-dark.png',
    sla_reminder_count: 1,
    sla_last_reminder_at: hoursAgo(6),
    created_at: hoursAgo(52), // RED SLA (> 48 jam)
    updated_at: hoursAgo(52),
  },
  {
    id: 'REP-002',
    title: 'Penurunan Efisiensi Termal Heat Exchanger E-201',
    asset_id: 'E-201',
    status: 'VERIFIED',
    identitas_alat: 'Heat Exchanger Pre-Heat Train E-201 (Tag: E-201)',
    gejala: 'Delta temperatur fluida keluar turun 14°C di bawah baseline standar operasional.',
    kondisi_operasi: 'Laju alir minyak 120 m³/jam, temperatur inlet shell 145°C, tekanan 6.2 bar.',
    pemeriksaan_awal: 'Pressure drop shell side naik 0.8 bar di atas spesifikasi bersih.',
    praduga_penyebab: 'Akumulasi deposit kerak (fouling) pada dinding tube bundle.',
    usulan_tindakan: 'Backwash sirkulasi kimiawi dan hydro-cleaning berkala.',
    verifikasi: 'Verifikasi efisiensi pertukaran panas kembali ke 92% baseline operasi kilang.',
    risk_level: 'MEDIUM',
    risk_consequence: 'Moderate',
    risk_likelihood: 'Likely',
    risk_summary: 'Risiko pemborosan konsumsi energi fuel gas furnace preheat train.',
    capa_corrective: 'Pembersihan sirkulasi kimiawi (chemical flushing) pada sisi shell & tube bundle.',
    capa_preventive: 'Pemasangan differential pressure transmitter terkalibrasi dengan high alarm di DCS.',
    capa_target_date: '2026-12-05',
    capa_pic: 'Siti Nurhaliza (Proses)',
    description: 'Delta temperatur fluida keluar turun 14°C di bawah baseline standar operasional.',
    reporter_name: 'Siti Nurhaliza',
    reporter_role: 'frontline_omi',
    dept: 'Proses & Operasi',
    evidence_note: 'Log sensor temperatur inlet/outlet dan kurva efisiensi.',
    image_url: '/assets/synqra-logo-light.png',
    sla_reminder_count: 0,
    created_at: hoursAgo(18), // GREEN SLA (< 24 jam)
    updated_at: hoursAgo(2),
  },
  {
    id: 'REP-003',
    title: 'Keterlambatan Respon Stroke Katup Kontrol FCV-301',
    asset_id: 'FCV-301',
    status: 'TRIAGE',
    identitas_alat: 'Pneumatic Flow Control Valve FCV-301 (Tag: FCV-301)',
    gejala: 'Katup merespon sinyal DCS 4-20mA terlambat 8 detik saat fluktuasi beban operasi.',
    kondisi_operasi: 'Tekanan suplai udara instrumen 4.5 bar stabil, temperatur ambien 32°C.',
    pemeriksaan_awal: 'Stem movement tersendat pada rentang pembukaan 30% - 50%.',
    praduga_penyebab: 'Stem packing mengering dan gesekan berlebih di gland packing katup.',
    usulan_tindakan: 'Pelumasan packing stem dan kalibrasi smart valve positioner.',
    verifikasi: 'Tes step response stroke waktu buka-tutup di bawah 2 detik sesuai spesifikasi.',
    risk_level: 'HIGH',
    risk_consequence: 'Major',
    risk_likelihood: 'Possible',
    risk_summary: 'Risiko instabilitas tekanan fuel gas boiler yang memicu fluktuasi steam header.',
    capa_corrective: 'Pelumasan gland packing dan kalibrasi full stroke 0-100% pada smart positioner.',
    capa_preventive: 'Jadwal preventive maintenance greasing stem diperketat menjadi per 2 minggu.',
    capa_target_date: '2026-11-25',
    capa_pic: 'Budi Santoso (Instrumen)',
    description: 'Katup merespon sinyal DCS 4-20mA terlambat 8 detik saat fluktuasi beban operasi.',
    reporter_name: 'Budi Santoso',
    reporter_role: 'frontline_omi',
    dept: 'Instrumentasi & Kontrol',
    evidence_note: 'Rekaman grafik respon DCS dan posisi fisik stem.',
    image_url: '/assets/synqra-logo-dark.png',
    sla_reminder_count: 1,
    created_at: hoursAgo(31), // YELLOW SLA (24–48 jam)
    updated_at: hoursAgo(31),
  },
  {
    id: 'REP-004',
    title: 'Kenaikan Suhu Rumah Bantalan NDE Pompa P-101A',
    asset_id: 'P-101A',
    status: 'PRADUGA',
    identitas_alat: 'Pompa Sentrifugal P-101A (Tag: P-101A)',
    gejala: 'Temperatur rumah bearing non-drive end terdeteksi 74°C (ambang batas normal < 65°C).',
    kondisi_operasi: 'Beban motor 82%, level oli di sight glass 50%, temperatur ambien 33°C.',
    pemeriksaan_awal: 'Inspeksi termografi FLIR menunjukkan hot spot terisolasi di area bearing NDE.',
    praduga_penyebab: 'Degradasi viskositas pelumas oli atau keausan bearing rollers.',
    usulan_tindakan: 'Pengambilan sampel oli pelumas untuk analisis lab dan penggantian grease sintetik.',
    verifikasi: 'Pemantauan suhu berkala pasca pelumasan stabil di bawah 60°C selama 48 jam.',
    risk_level: 'CRITICAL',
    risk_consequence: 'Catastrophic',
    risk_likelihood: 'Possible',
    risk_summary: 'Potensi seizure bearing mendadak yang memicu trip pompa umpan utama dan kebakaran gesekan.',
    capa_corrective: 'Penggantian oli pelumas sintetik ISO VG 46 dan greasing ulang bantalan.',
    capa_preventive: 'Uji getaran spektrum demodulasi untuk deteksi dini cacat raceway bearing.',
    capa_target_date: '2026-11-24',
    capa_pic: 'Dedi Kusnadi (Mekanik)',
    description: 'Inframerah termografi mendeteksi temperatur rumah bearing mencapai 74°C.',
    reporter_name: 'Dedi Kusnadi',
    reporter_role: 'frontline_omi',
    dept: 'Mekanik & Rotating',
    evidence_note: 'Foto termografi kamera FLIR E5.',
    image_url: '/assets/synqra-logo-dark.png',
    sla_reminder_count: 0,
    created_at: hoursAgo(12), // GREEN SLA (< 24 jam)
    updated_at: hoursAgo(12),
  },
  {
    id: 'REP-005',
    title: 'Indikasi Rembesan Flange Inlet Nozzle E-201',
    asset_id: 'E-201',
    status: 'PRADUGA',
    identitas_alat: 'Heat Exchanger Pre-Heat Train E-201 (Tag: E-201)',
    gejala: 'Aroma uap hidrokarbon terdeteksi di area nozzle inlet shell E-201 shift malam.',
    kondisi_operasi: 'Suhu lingkungan 31°C, angin tenang, unit beroperasi pada beban 100%.',
    pemeriksaan_awal: 'Deteksi gas portabel menunjukkan pembacaan LEL 12% pada jarak 15 cm dari flange.',
    praduga_penyebab: 'Relaksasi baut flange akibat siklus ekspansi termal berulang.',
    usulan_tindakan: 'Retorque baut flange inlet dengan hydraulic torque wrench 450 Nm terkalibrasi.',
    verifikasi: 'Pemeriksaan ulang detector gas setelah retorquing menunjukkan 0% LEL.',
    risk_level: 'CRITICAL',
    risk_consequence: 'Catastrophic',
    risk_likelihood: 'Possible',
    risk_summary: 'Bahaya kebakaran uap hidrokarbon mudah menyala di area kilang aktif.',
    capa_corrective: 'Pengencangan baut flange bertahap menggunakan hydraulic torque wrench 450 Nm.',
    capa_preventive: 'Pemasangan pita deteksi kebocoran termal (thermal leak wraps) di sekeliling sambungan flange.',
    capa_target_date: '2026-11-23',
    capa_pic: 'Hadi Purnomo (HSE)',
    description: 'Bau hidrokarbon terdeteksi di sekitar flange inlet nozzle E-201 shift malam.',
    reporter_name: 'Hadi Purnomo',
    reporter_role: 'frontline_omi',
    dept: 'Keselamatan & HSE',
    evidence_note: 'Bukti foto belum dilampirkan',
    image_url: null, // HARD GATE DEMO: Empty Evidence!
    sla_reminder_count: 2,
    created_at: hoursAgo(58), // RED SLA (> 48 jam - Overdue)
    updated_at: hoursAgo(58),
  },
  {
    id: 'REP-006',
    title: 'Deviasi Sinyal Feedback Transmitter FCV-301',
    asset_id: 'FCV-301',
    status: 'INVESTIGATION',
    identitas_alat: 'Pneumatic Flow Control Valve FCV-301 (Tag: FCV-301)',
    gejala: 'Deviasi sinyal posisi fisik katup vs indikator monitor DCS sebesar 6.5%.',
    kondisi_operasi: 'Operasi normal loop kendali debit fuel gas pada bukaan 40% - 60%.',
    pemeriksaan_awal: 'Linkage arm positioner memiliki clearance kelonggaran 1.2 mm.',
    praduga_penyebab: 'Aus mekanik pada pin linkage arm transmitter akibat getaran siklis pipa.',
    usulan_tindakan: 'Penggantian pin linkage stainless steel dan re-zeroing kalibrasi span positioner.',
    verifikasi: 'Verifikasi deviasi sinyal posisi < 0.5% di seluruh rentang bukaan 0-100%.',
    risk_level: 'LOW',
    risk_consequence: 'Minor',
    risk_likelihood: 'Possible',
    risk_summary: 'Error pembacaan telemetri tanpa risiko shutdown proses mendesak.',
    capa_corrective: 'Penggantian pin linkage stainless steel dan kalibrasi digital span positioner.',
    capa_preventive: 'Inspeksi clearance linkage setiap 3 bulan.',
    capa_target_date: '2026-12-10',
    capa_pic: 'Budi Santoso (Instrumen)',
    description: 'Sinyal feedback transmitter posisi tidak linier pada bukaan 40% - 60%.',
    reporter_name: 'Dr. Rina Suryani', // HARD GATE DEMO: Reported by Validator (No Self-Approval)
    reporter_role: 'hse_validator',
    dept: 'Keselamatan & HSE',
    evidence_note: 'Data logger sinyal analog 4-20mA Yokogawa.',
    image_url: '/assets/synqra-logo-dark.png',
    sla_reminder_count: 1,
    created_at: hoursAgo(36), // YELLOW SLA (24–48 jam)
    updated_at: hoursAgo(36),
  },
  {
    id: 'REP-007',
    title: 'Suara Kavitasi Suction Impeller Pompa P-101A',
    asset_id: 'P-101A',
    status: 'TRIAGE',
    identitas_alat: 'Pompa Sentrifugal P-101A (Tag: P-101A)',
    gejala: 'Suara berderak kerikil khas kavitasi pada sisi suction impeller saat laju alir diturunkan.',
    kondisi_operasi: 'Level tangki suction 2.1 m (ambang minimum operasi), debit 65% beban nominal.',
    pemeriksaan_awal: 'Pengukuran tekanan suction turun mendekati tekanan uap jenuh fluida.',
    praduga_penyebab: 'Net Positive Suction Head Available (NPSHa) kritis akibat level tangki hisap terlalu rendah.',
    usulan_tindakan: 'Kenaikan setpoint level tangki suction ke 3.0 m dan buka penuh suction line throttle valve.',
    verifikasi: 'Verifikasi spektrum akustik kavitasi hilang saat margin NPSHa naik melampaui 2 meter.',
    risk_level: 'HIGH',
    risk_consequence: 'Major',
    risk_likelihood: 'Likely',
    risk_summary: 'Erosi pitting pada impeler pompa yang dapat menghancurkan sudu sudu dalam jangka menengah.',
    capa_corrective: 'Penyesuaian batas interlock level tangki hisap minimal 3.0 meter di DCS.',
    capa_preventive: 'Pemeriksaan ketebalan dinding pipa hisap menggunakan Ultrasonic Thickness Gauge.',
    capa_target_date: '2026-11-26',
    capa_pic: 'Dedi Kusnadi (Mekanik)',
    description: 'Terdengar suara dentuman kerikil saat laju alir diturunkan ke 65% beban nominal.',
    reporter_name: 'Dedi Kusnadi',
    reporter_role: 'frontline_omi',
    dept: 'Mekanik & Rotating',
    evidence_note: 'Audio rekaman mikrofon akustik industri.',
    image_url: '/assets/synqra-logo-dark.png',
    sla_reminder_count: 0,
    created_at: hoursAgo(26), // YELLOW SLA (24–48 jam)
    updated_at: hoursAgo(26),
  },
  {
    id: 'REP-008',
    title: 'Kebocoran Gasket Channel Head Heat Exchanger E-201',
    asset_id: 'E-201',
    status: 'VERIFIED',
    identitas_alat: 'Heat Exchanger Pre-Heat Train E-201 (Tag: E-201)',
    gejala: 'Rembesan cairan minyak mentah di sekeliling sambungan channel cover flange saat start-up dingin.',
    kondisi_operasi: 'Unit start-up pasca-turnaround, tekanan uji 4.5 bar, temperatur 38°C.',
    pemeriksaan_awal: 'Gasket spiral wound terkompresi tidak seragam akibat deviasi torsi baut flange.',
    praduga_penyebab: 'Torsi baut channel cover tidak merata dan gasket terpasang miring 1.5 mm.',
    usulan_tindakan: 'Penggantian gasket spiral wound 316L/graphite baru dan pengencangan baut menyilang sesuai ASME PCC-1.',
    verifikasi: 'Uji hidrostatik 1.5x tekanan kerja desain (9.0 bar) selama 2 jam tanpa penurunan tekanan dan nol rembesan.',
    risk_level: 'MEDIUM',
    risk_consequence: 'Moderate',
    risk_likelihood: 'Possible',
    risk_summary: 'Risiko kontaminasi lingkungan area paving dan bahaya slip-trip bagi operator lapangan.',
    capa_corrective: 'Penggantian gasket spiral wound baru dengan pemandu torsi bertahap (star pattern).',
    capa_preventive: 'Penerapan checklist verifikasi kalibrasi torque wrench sebelum setiap pekerjaan flange joint.',
    capa_target_date: '2026-11-27',
    capa_pic: 'Ir. Agus Wijaya (Supervisor)',
    description: 'Rembesan minyak mentah terlihat menetes pada flange channel cover sisi produk.',
    reporter_name: 'Siti Nurhaliza',
    reporter_role: 'frontline_omi',
    dept: 'Proses & Operasi',
    evidence_note: 'Foto pemeriksaan channel head flange dan sertifikat uji tekan hidrolik.',
    image_url: '/assets/synqra-logo-light.png',
    sla_reminder_count: 0,
    created_at: hoursAgo(8), // GREEN SLA (< 24 jam)
    updated_at: hoursAgo(1),
  },
  {
    id: 'REP-009',
    title: 'Kebocoran Udara Diafragma Actuator FCV-301',
    asset_id: 'FCV-301',
    status: 'PRADUGA',
    identitas_alat: 'Pneumatic Flow Control Valve FCV-301 (Tag: FCV-301)',
    gejala: 'Terdengar desisan udara instrumen kontinu di sekitar casing pneumatic diaphragm actuator.',
    kondisi_operasi: 'Tekanan udara suplai 4.2 bar, valve beroperasi di modulasi 45% - 55%.',
    pemeriksaan_awal: 'Deteksi kebocoran ultrasonik mendeteksi kebocoran udara sebesar 14 liter/menit pada sambungan casing atas.',
    praduga_penyebab: 'Robekan mikro atau keausan elastisitas pada diafragma karet neoprene akibat penuaan siklus kerja.',
    usulan_tindakan: 'Isolasi bypass valve, de-pressurisasi chamber, dan ganti diafragma actuator kit.',
    verifikasi: 'Tes kedap udara 4.5 bar selama 30 menit dengan gelembung sabun (Snoop) tanpa kebocoran.',
    risk_level: 'MEDIUM',
    risk_consequence: 'Moderate',
    risk_likelihood: 'Possible',
    risk_summary: 'Penurunan tekanan udara kontrol yang dapat menyebabkan fail-safe position valve tertutup mendadak.',
    capa_corrective: 'Overhaul assembly diaphragm actuator dan penggantian internal rubber kit.',
    capa_preventive: 'Penggantian berkala diafragma pneumatic setiap 24 bulan dalam program PM terjadwal.',
    capa_target_date: '2026-12-01',
    capa_pic: 'Budi Santoso (Instrumen)',
    description: 'Desisan suplai udara instrumen terdeteksi di casing actuator bagian atas saat valve modulasi.',
    reporter_name: 'Budi Santoso',
    reporter_role: 'frontline_omi',
    dept: 'Instrumentasi & Kontrol',
    evidence_note: 'Spektrogram detektor kebocoran ultrasonik SDT270.',
    image_url: '/assets/synqra-logo-dark.png',
    sla_reminder_count: 0,
    created_at: hoursAgo(15), // GREEN SLA (< 24 jam)
    updated_at: hoursAgo(15),
  },
  {
    id: 'REP-010',
    title: 'Resonansi Frekuensi Sudu Impeller Pompa P-101A',
    asset_id: 'P-101A',
    status: 'VERIFIED',
    identitas_alat: 'Pompa Sentrifugal P-101A (Tag: P-101A)',
    gejala: 'Puncak vibrasi 1X dan 5X Blade Pass Frequency (BPF) mencapai 6.4 mm/s pada putaran 2980 RPM.',
    kondisi_operasi: 'Operasi continuous pada beban penuh 125 m³/jam, tekanan discharge 4.6 bar.',
    pemeriksaan_awal: 'Analisis spektrum FFT menunjukkan fenomena resonansi struktur baseplate dengan frekuensi sudu pompa.',
    praduga_penyebab: 'Kelonggaran baut angkur fondasi baseplate pompa dan deviasi massa dinamis sudu.',
    usulan_tindakan: 'Grouting ulang fondasi epoxy baseplate dan dynamic balance rotor pompa di workshop.',
    verifikasi: 'Hasil balancing ISO 1940 Grade G2.5 terverifikasi, vibrasi operasional turun menjadi 1.8 mm/s.',
    risk_level: 'HIGH',
    risk_consequence: 'Major',
    risk_likelihood: 'Possible',
    risk_summary: 'Kelelahan material struktural (fatigue cracking) pada impeler dan poros pompa transfer.',
    capa_corrective: 'Grouting baseplate dengan Chockfast Red epoxy dan pengencangan baut fondasi 600 Nm.',
    capa_preventive: 'Inspeksi visual kekencangan angkur fondasi dan torque check rutin per 6 bulan.',
    capa_target_date: '2026-11-20',
    capa_pic: 'Dedi Kusnadi (Mekanik)',
    description: 'Vibrasi terukur tinggi pada spektrum FFT 1X dan 5X blade pass saat pompa mencapai debit maksimal.',
    reporter_name: 'Dedi Kusnadi',
    reporter_role: 'frontline_omi',
    dept: 'Mekanik & Rotating',
    evidence_note: 'Laporan spektrum FFT waterfall & sertifikat dynamic balancing ISO G2.5.',
    image_url: '/assets/synqra-logo-light.png',
    sla_reminder_count: 1,
    created_at: hoursAgo(42), // YELLOW SLA (24–48 jam)
    updated_at: hoursAgo(4),
  },
];

const SEED_COMMENTS = [
  {
    report_id: 'REP-001',
    author_name: 'Ir. Agus Wijaya',
    author_role: 'dept_reviewer',
    comment: 'Mohon tim mekanik melampirkan data log vibrasi 3 hari terakhir sebelum intervensi overhaul dimulai.',
    is_revision_request: false,
    created_at: hoursAgo(24),
  },
  {
    report_id: 'REP-001',
    author_name: 'Dedi Kusnadi',
    author_role: 'frontline_omi',
    comment: 'Data spektrum FFT vibration logger sudah kami upload di lampiran evidence tambahan.',
    is_revision_request: false,
    created_at: hoursAgo(22),
  },
  {
    report_id: 'REP-005',
    author_name: 'Ir. Agus Wijaya',
    author_role: 'dept_reviewer',
    comment: 'Laporan dikembalikan ke status PRADUGA. Mohon lampirkan foto jelas area sambungan nozzle flange dan bukti hasil kalibrasi gas detector MSA Altair sebelum disetujui untuk triage perbaikan.',
    is_revision_request: true,
    requested_evidence: 'Foto close-up sambungan flange nozzle & sertifikat kalibrasi LEL gas detector',
    created_at: hoursAgo(10),
  },
  {
    report_id: 'REP-005',
    author_name: 'Hadi Purnomo',
    author_role: 'frontline_omi',
    comment: 'Siap Pak Agus, teknisi shift pagi sedang mengambil foto close-up flange dan melampirkan log detector.',
    is_revision_request: false,
    created_at: hoursAgo(8),
  },
  {
    report_id: 'REP-006',
    author_name: 'Dr. Rina Suryani',
    author_role: 'hse_validator',
    comment: 'Catatan validator: Deviasi sinyal transmitter ini berulang setiap 3 bulan, investigasi perlu mengecek apakah getaran pipa beresonansi dengan arm positioner.',
    is_revision_request: false,
    created_at: hoursAgo(15),
  },
  {
    report_id: 'REP-008',
    author_name: 'Ir. Agus Wijaya',
    author_role: 'dept_reviewer',
    comment: 'Sertifikat kalibrasi torque wrench dan laporan uji hidrolik 9 bar sudah divalidasi tim QC.',
    is_revision_request: false,
    created_at: hoursAgo(5),
  },
  {
    report_id: 'REP-010',
    author_name: 'Dr. Rina Suryani',
    author_role: 'hse_validator',
    comment: 'Kasus disahkan: Hasil dynamic balancing rotor pompa memenuhi standar ISO 1940 G2.5.',
    is_revision_request: false,
    created_at: hoursAgo(3),
  },
];

async function runSeed() {
  console.log('----------------------------------------------------');
  console.log('🚀 SYNQRA DATABASE SEEDING ENGINE');
  console.log('----------------------------------------------------');

  if (!isConfigured) {
    console.log('⚠️ Supabase URL / Anon Key belum dikonfigurasikan di .env.local.');
    console.log('📦 Data 10 kasus realistis telah siap disajikan secara in-memory di aplikasi Next.js.');
    console.log('📄 Untuk eksekusi langsung via SQL Editor Supabase, gunakan berkas:');
    console.log('   -> supabase/seed.sql');
    console.log('   -> supabase/migrations/20261120_init_schema.sql');
    console.log('----------------------------------------------------');
    console.log('✅ Skrip seed selesai (Mode Standby / In-Memory Demo siap).');
    process.exit(0);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`📡 Menghubungkan ke Supabase: ${supabaseUrl}`);

  // 1. Seed Assets
  console.log('⏳ Mengunggah 3 aset utama...');
  const { error: assetErr } = await supabase.from('assets').upsert(SEED_ASSETS, { onConflict: 'id' });
  if (assetErr) {
    console.error('❌ Gagal seed assets:', assetErr.message);
  } else {
    console.log('✅ 3 Aset berhasil di-seed (P-101A, E-201, FCV-301).');
  }

  // 2. Seed Reports
  console.log('⏳ Mengunggah 10 laporan realistis...');
  const { error: repErr } = await supabase.from('reports').upsert(SEED_REPORTS, { onConflict: 'id' });
  if (repErr) {
    console.error('❌ Gagal seed reports:', repErr.message);
  } else {
    console.log('✅ 10 Laporan kasus berhasil di-seed:');
    console.log('   - Pompa P-101A: 4 kasus (REP-001 [RED SLA >48h], REP-004, REP-007, REP-010)');
    console.log('   - Heat Exchanger E-201: 3 kasus (REP-002, REP-005 [RED SLA & EMPTY EVIDENCE], REP-008)');
    console.log('   - Control Valve FCV-301: 3 kasus (REP-003, REP-006 [VALIDATOR REPORTED], REP-009)');
  }

  // 3. Seed Case Comments
  console.log('⏳ Mengunggah komentar thread 2 arah...');
  const { error: comErr } = await supabase.from('case_comments').insert(SEED_COMMENTS);
  if (comErr) {
    console.warn('⚠️ Catatan komentar (mungkin sudah ada):', comErr.message);
  } else {
    console.log('✅ Catatan komentar revisi 2-way feedback berhasil di-seed.');
  }

  console.log('----------------------------------------------------');
  console.log('🎉 SEEDING SELESAI BERHASIL!');
  console.log('----------------------------------------------------');
}

runSeed().catch((err) => {
  console.error('Fatal error during seed:', err);
  process.exit(1);
});
