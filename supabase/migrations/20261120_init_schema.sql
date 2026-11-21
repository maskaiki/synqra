-- =========================================================================
-- SYNQRA INDUSTRIAL KNOWLEDGE PLATFORM - SUPABASE SCHEMA MIGRATION
-- (Includes Risk Report, CAPA, SLA Reminders, and Evidence Hard Gate)
-- =========================================================================

-- 1. ENUMS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
        CREATE TYPE report_status AS ENUM ('PRADUGA', 'TRIAGE', 'INVESTIGATION', 'VERIFIED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('frontline_omi', 'dept_reviewer', 'hse_validator');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_level') THEN
        CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
    END IF;
END $$;

-- 2. ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'pump', 'heat', 'valve', 'compressor', 'vessel', 'heater'
    area VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REPORTS TABLE (7 Entitas Kegagalan, Risk Matrix, CAPA, & SLA)
CREATE TABLE IF NOT EXISTS public.reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    asset_id VARCHAR(50) REFERENCES public.assets(id) ON DELETE RESTRICT,
    status report_status NOT NULL DEFAULT 'PRADUGA',
    
    -- 7 Entitas Standar Kegagalan:
    identitas_alat VARCHAR(255),
    gejala TEXT NOT NULL,
    kondisi_operasi TEXT,
    pemeriksaan_awal TEXT,
    praduga_penyebab TEXT,
    usulan_tindakan TEXT,
    verifikasi TEXT,
    
    -- Risk Report (Matrix Consequence x Likelihood):
    risk_level risk_level DEFAULT 'MEDIUM',
    risk_consequence VARCHAR(100), -- 'Minor', 'Moderate', 'Major', 'Catastrophic'
    risk_likelihood VARCHAR(100),  -- 'Rare', 'Possible', 'Likely', 'Frequent'
    risk_summary TEXT,

    -- CAPA (Corrective and Preventive Actions):
    capa_corrective TEXT,
    capa_preventive TEXT,
    capa_target_date DATE,
    capa_pic VARCHAR(100),

    -- SLA & Audit:
    sla_reminder_count INT DEFAULT 0,
    sla_last_reminder_at TIMESTAMPTZ,
    
    -- Metadata Pelaporan:
    description TEXT NOT NULL,
    reporter_name VARCHAR(100) NOT NULL,
    reporter_role user_role NOT NULL DEFAULT 'frontline_omi',
    dept VARCHAR(100) NOT NULL,
    evidence_note TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CASE_COMMENTS TABLE (Catatan 2 Arah & Permintaan Revisi Bukti)
CREATE TABLE IF NOT EXISTS public.case_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) REFERENCES public.reports(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_role user_role NOT NULL,
    comment TEXT NOT NULL,
    is_revision_request BOOLEAN DEFAULT FALSE,
    requested_evidence TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EVIDENCES TABLE (Penyimpanan File Foto di Supabase Storage)
CREATE TABLE IF NOT EXISTS public.evidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) REFERENCES public.reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL, -- Relative path di bucket 'synqra-evidences'
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    caption TEXT,
    uploaded_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_asset_id ON public.reports(asset_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_report_id ON public.case_comments(report_id);
CREATE INDEX IF NOT EXISTS idx_evidences_report_id ON public.evidences(report_id);

-- 7. SEED DATA: 3 ASSETS UTAMA
INSERT INTO public.assets (id, name, type, area, description) VALUES
('P-101A', 'Pompa Sentrifugal Umpan Mentah', 'pump', 'Unit Crude Distillation (CDU)', 'Pompa sentrifugal multistage transfer fluida hidrokarbon berat.'),
('E-201', 'Heat Exchanger Pre-Heat Train', 'heat', 'Unit Treated Oil', 'Shell & tube heat exchanger perpindahan panas minyak mentah ke produk.'),
('FCV-301', 'Pneumatic Flow Control Valve', 'valve', 'Jalur Gas Fuel Gas Unit', 'Katup kontrol aliran gas bertekanan tinggi dengan smart positioner.')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    area = EXCLUDED.area,
    description = EXCLUDED.description;

-- 8. SEED DATA: 7 ENTITAS LAPORAN LENGKAP (Termasuk variasi SLA & Hard Gate Demo)
INSERT INTO public.reports (
    id, title, asset_id, status, 
    identitas_alat, gejala, kondisi_operasi, pemeriksaan_awal, praduga_penyebab, usulan_tindakan, verifikasi,
    risk_level, risk_consequence, risk_likelihood, risk_summary,
    capa_corrective, capa_preventive, capa_target_date, capa_pic,
    description, reporter_name, reporter_role, dept, evidence_note, image_url, created_at, updated_at
) VALUES
(
    'REP-001', 'Anomali Tekanan & Vibrasi Pompa P-101A', 'P-101A', 'INVESTIGATION',
    'Pompa P-101A (Tag: P-101A)', 'Fluktuasi tekanan discharge 3.2 - 4.1 bar dan vibrasi abnormal', 'Tekanan hisap normal 1.2 bar, temperatur fluida 45°C', 'Spektrum vibrasi 7.8 mm/s di bantalan DE, rembesan ringan mechanical seal', 'Keausan seal chamber dan misalignment kopling poros', 'Alignment laser ulang dan ganti mechanical seal cartridge', 'Uji jalan 4 jam tanpa kenaikan vibrasi > 3.0 mm/s',
    'HIGH', 'Major', 'Possible', 'Risiko tinggi kerusakan catastrophic bearing & shutdown CDU.',
    'Penggantian cartridge mechanical seal dan realign poros dengan laser alignment.', 'Penambahan sensor vibration online wireless untuk pemantauan kontinu.', '2026-11-28', 'Dedi Kusnadi (Mekanik)',
    'Tekanan discharge berfluktuasi tajam antara 3.2 - 4.1 bar disertai vibrasi pada bantalan drive end.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Vibrasi 7.8 mm/s, rembesan ringan mechanical seal.', 'assets/synqra-logo-dark.png',
    NOW() - INTERVAL '52 hours', NOW() - INTERVAL '52 hours' -- SLA: RED (> 48 jam)
),
(
    'REP-002', 'Penurunan Efisiensi Termal Heat Exchanger E-201', 'E-201', 'VERIFIED',
    'Heat Exchanger E-201 (Tag: E-201)', 'Penurunan delta temperatur fluida keluar 14°C di bawah baseline standar', 'Laju alir minyak 120 m³/jam, temperatur inlet 145°C', 'Pressure drop shell side naik 0.8 bar di atas spesifikasi bersih', 'Akumulasi deposit kerak (fouling) pada dinding tube bundle', 'Backwash kimiawi dan hydro-cleaning berkala', 'Verifikasi efisiensi pertukaran panas kembali ke 92% baseline',
    'MEDIUM', 'Moderate', 'Likely', 'Risiko pemborosan konsumsi energi fuel gas furnace.',
    'Pembersihan sirkulasi kimiawi (chemical flushing) pada sisi shell & tube bundle.', 'Pemasangan differential pressure transmitter terkalibrasi dengan alarm otomatis di DCS.', '2026-12-05', 'Siti Nurhaliza (Proses)',
    'Delta temperatur fluida keluar turun 14°C di bawah baseline standar operasional.', 'Siti Nurhaliza', 'frontline_omi', 'Proses & Operasi', 'Log sensor temperatur inlet/outlet dan kurva efisiensi.', 'assets/synqra-logo-light.png',
    NOW() - INTERVAL '18 hours', NOW() - INTERVAL '2 hours' -- SLA: GREEN (< 24 jam)
),
(
    'REP-003', 'Keterlambatan Respon Stroke FCV-301', 'FCV-301', 'TRIAGE',
    'Control Valve FCV-301 (Tag: FCV-301)', 'Katup merespon sinyal DCS 4-20mA terlambat 8 detik', 'Tekanan suplai udara instrumen 4.5 bar stabil', 'Stem movement tersendat pada pembukaan 30% - 50%', 'Stem packing mengering dan gesekan berlebih di gland packing', 'Pelumasan packing stem dan kalibrasi smart valve positioner', 'Tes step response stroke waktu buka-tutup di bawah 2 detik',
    'HIGH', 'Major', 'Possible', 'Risiko kestabilan pembakaran fuel gas boiler tidak terkontrol.',
    'Pelumasan gland packing dan kalibrasi full stroke 0-100% pada smart positioner.', 'Jadwal preventive maintenance greasing stem diperketat menjadi per 2 minggu.', '2026-11-25', 'Budi Santoso (Instrumen)',
    'Katup merespon sinyal DCS 4-20mA terlambat 8 detik saat fluktuasi beban operasi.', 'Budi Santoso', 'frontline_omi', 'Instrumentasi & Kontrol', 'Rekaman grafik respon DCS dan posisi fisik stem.', 'assets/synqra-logo-dark.png',
    NOW() - INTERVAL '31 hours', NOW() - INTERVAL '31 hours' -- SLA: YELLOW (24–48 jam)
),
(
    'REP-004', 'Kenaikan Suhu Bearing Rumah Pompa P-101A', 'P-101A', 'PRADUGA',
    'Pompa P-101A (Tag: P-101A)', 'Temperatur rumah bearing non-drive end terdeteksi 74°C', 'Beban motor 82%, level oli di sight glass 50%', 'Inspeksi termografi FLIR menunjukkan hot spot terisolasi di NDE', 'Degradasi viskositas pelumas oli atau keausan bearing rollers', 'Pengambilan sampel oli pelumas untuk analisis lab dan penambahan grease', 'Pemantauan suhu berkala pasca pelumasan',
    'CRITICAL', 'Catastrophic', 'Possible', 'Potensi seizure bearing mendadak yang memicu trip pompa umpan utama.',
    'Penggantian oli pelumas sintetik ISO VG 46 dan greasing ulang bantalan.', 'Uji getaran spektrum demodulasi untuk deteksi dini cacat ras bearing.', '2026-11-24', 'Dedi Kusnadi (Mekanik)',
    'Inframerah termografi mendeteksi temperatur rumah bearing mencapai 74°C.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Foto termografi FLIR E5.', 'assets/synqra-logo-dark.png',
    NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours' -- SLA: GREEN (< 24 jam)
),
(
    'REP-005', 'Indikasi Rembesan Flange Inlet E-201', 'E-201', 'PRADUGA',
    'Heat Exchanger E-201 (Tag: E-201)', 'Aroma uap hidrokarbon di area nozzle inlet shell E-201', 'Suhu lingkungan 31°C, angin tenang, unit beban 100%', 'Deteksi gas portabel menunjukkan pembacaan LEL 12% pada jarak 15 cm', 'Relaksasi baut flange akibat siklus ekspansi termal berulang', 'Retorque baut flange inlet dengan hydraulic torque wrench terkalibrasi', 'Pemeriksaan ulang LEL setelah retorquing',
    'CRITICAL', 'Catastrophic', 'Possible', 'Bahaya kebakaran uap hidrokarbon mudah menyala di area kilang.',
    'Pengencangan baut flange bertahap menggunakan hydraulic torque wrench 450 Nm.', 'Pemasangan pita deteksi kebocoran termal (thermal leak wraps) di sekeliling sambungan flange.', '2026-11-23', 'Hadi Purnomo (HSE)',
    'Bau hidrokarbon terdeteksi di sekitar flange inlet nozzle E-201 shift malam.', 'Hadi Purnomo', 'frontline_omi', 'Keselamatan & HSE', 'Bukti foto belum dilampirkan', NULL, -- HARD GATE DEMO: Empty Evidence!
    NOW() - INTERVAL '58 hours', NOW() - INTERVAL '58 hours' -- SLA: RED (> 48 jam)
),
(
    'REP-006', 'Deviasi Sinyal Feedback Transmitter FCV-301', 'FCV-301', 'INVESTIGATION',
    'Control Valve FCV-301 (Tag: FCV-301)', 'Deviasi sinyal posisi fisik katup vs indikator monitor 6.5%', 'Operasi normal loop kendali debit gas fuel', 'Linkage arm positioner memiliki clearance longgar 1.2 mm', 'Aus mekanik pada pen linkage arm transmitter', 'Penggantian pen linkage dan re-zeroing kalibrasi span', 'Verifikasi deviasi sinyal posisi < 0.5% di seluruh rentang 0-100%',
    'LOW', 'Minor', 'Possible', 'Error pembacaan telemetri tanpa risiko shutdown mendesak.',
    'Penggantian pin linkage stainless steel dan kalibrasi digital span positioner.', 'Inspeksi clearance linkage setiap 3 bulan.', '2026-12-10', 'Budi Santoso (Instrumen)',
    'Sinyal feedback transmitter posisi tidak linier pada bukaan 40% - 60%.', 'Dr. Rina Suryani', 'hse_validator', 'HSE & Process Safety', 'Data logger sinyal analog 4-20mA.', 'assets/synqra-logo-dark.png', -- HARD GATE DEMO: Reported by Dr. Rina (No Self-Approval)
    NOW() - INTERVAL '36 hours', NOW() - INTERVAL '36 hours' -- SLA: YELLOW (24–48 jam)
),
(
    -- KASUS 7: Pompa P-101A (TRIAGE, YELLOW SLA)
    'REP-007', 'Suara Kavitasi Suction Pompa P-101A', 'P-101A', 'TRIAGE',
    'Pompa Sentrifugal P-101A (Tag: P-101A)', 'Suara berderak kerikil khas kavitasi pada sisi suction impeller saat laju alir diturunkan.', 'Level tangki suction 2.1 m (ambang minimum operasi), debit 65% beban nominal.', 'Pengukuran tekanan suction turun mendekati tekanan uap jenuh fluida.', 'Net Positive Suction Head Available (NPSHa) kritis akibat level tangki hisap terlalu rendah.', 'Kenaikan setpoint level tangki suction ke 3.0 m dan buka penuh suction line throttle valve.', 'Verifikasi spektrum akustik kavitasi hilang saat margin NPSHa naik melampaui 2 meter.',
    'HIGH', 'Major', 'Likely', 'Erosi pitting pada impeler pompa yang dapat menghancurkan sudu sudu dalam jangka menengah.',
    'Penyesuaian batas interlock level tangki hisap minimal 3.0 meter di DCS.', 'Pemeriksaan ketebalan dinding pipa hisap menggunakan Ultrasonic Thickness Gauge.', '2026-11-26', 'Dedi Kusnadi (Mekanik)',
    'Terdengar suara dentuman kerikil saat laju alir diturunkan ke 65% beban nominal.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Audio rekaman mikrofon akustik industri.', '/assets/synqra-logo-dark.png',
    NOW() - INTERVAL '26 hours', NOW() - INTERVAL '26 hours' -- SLA: YELLOW (24–48 jam)
),
(
    -- KASUS 8: Heat Exchanger E-201 (VERIFIED, GREEN SLA)
    'REP-008', 'Kebocoran Gasket Channel Head Heat Exchanger E-201', 'E-201', 'VERIFIED',
    'Heat Exchanger Pre-Heat Train E-201 (Tag: E-201)', 'Rembesan cairan minyak mentah di sekeliling sambungan channel cover flange saat start-up dingin.', 'Unit start-up pasca-turnaround, tekanan uji 4.5 bar, temperatur 38°C.', 'Gasket spiral wound terkompresi tidak seragam akibat deviasi torsi baut flange.', 'Torsi baut channel cover tidak merata dan gasket terpasang miring 1.5 mm.', 'Penggantian gasket spiral wound 316L/graphite baru dan pengencangan baut menyilang sesuai ASME PCC-1.', 'Uji hidrostatik 1.5x tekanan kerja desain (9.0 bar) selama 2 jam tanpa penurunan tekanan dan nol rembesan.',
    'MEDIUM', 'Moderate', 'Possible', 'Risiko kontaminasi lingkungan area paving dan bahaya slip-trip bagi operator lapangan.',
    'Penggantian gasket spiral wound baru dengan pemandu torsi bertahap (star pattern).', 'Penerapan checklist verifikasi kalibrasi torque wrench sebelum setiap pekerjaan flange joint.', '2026-11-27', 'Ir. Agus Wijaya (Supervisor)',
    'Rembesan minyak mentah terlihat menetes pada flange channel cover sisi produk.', 'Siti Nurhaliza', 'frontline_omi', 'Proses & Operasi', 'Foto pemeriksaan channel head flange dan sertifikat uji tekan hidrolik.', '/assets/synqra-logo-light.png',
    NOW() - INTERVAL '8 hours', NOW() - INTERVAL '1 hours' -- SLA: GREEN (< 24 jam)
),
(
    -- KASUS 9: Control Valve FCV-301 (PRADUGA, GREEN SLA)
    'REP-009', 'Kebocoran Udara Diafragma Actuator FCV-301', 'FCV-301', 'PRADUGA',
    'Pneumatic Flow Control Valve FCV-301 (Tag: FCV-301)', 'Terdengar desisan udara instrumen kontinu di sekitar casing pneumatic diaphragm actuator.', 'Tekanan udara suplai 4.2 bar, valve beroperasi di modulasi 45% - 55%.', 'Deteksi kebocoran ultrasonik mendeteksi kebocoran udara sebesar 14 liter/menit pada sambungan casing atas.', 'Robekan mikro atau keausan elastisitas pada diafragma karet neoprene akibat penuaan siklus kerja.', 'Isolasi bypass valve, de-pressurisasi chamber, dan ganti diafragma actuator kit.', 'Tes kedap udara 4.5 bar selama 30 menit dengan gelembung sabun (Snoop) tanpa kebocoran.',
    'MEDIUM', 'Moderate', 'Possible', 'Penurunan tekanan udara kontrol yang dapat menyebabkan fail-safe position valve tertutup mendadak.',
    'Overhaul assembly diaphragm actuator dan penggantian internal rubber kit.', 'Penggantian berkala diafragma pneumatic setiap 24 bulan dalam program PM terjadwal.', '2026-12-01', 'Budi Santoso (Instrumen)',
    'Desisan suplai udara instrumen terdeteksi di casing actuator bagian atas saat valve modulasi.', 'Budi Santoso', 'frontline_omi', 'Instrumentasi & Kontrol', 'Spektrogram detektor kebocoran ultrasonik SDT270.', '/assets/synqra-logo-dark.png',
    NOW() - INTERVAL '15 hours', NOW() - INTERVAL '15 hours' -- SLA: GREEN (< 24 jam)
),
(
    -- KASUS 10: Pompa P-101A (VERIFIED, YELLOW SLA)
    'REP-010', 'Resonansi Frekuensi Sudu Impeller Pompa P-101A', 'P-101A', 'VERIFIED',
    'Pompa Sentrifugal P-101A (Tag: P-101A)', 'Puncak vibrasi 1X dan 5X Blade Pass Frequency (BPF) mencapai 6.4 mm/s pada putaran 2980 RPM.', 'Operasi continuous pada beban penuh 125 m³/jam, tekanan discharge 4.6 bar.', 'Analisis spektrum FFT menunjukkan fenomena resonansi struktur baseplate dengan frekuensi sudu pompa.', 'Kelonggaran baut angkur fondasi baseplate pompa dan deviasi massa dinamis sudu.', 'Grouting ulang fondasi epoxy baseplate dan dynamic balance rotor pompa di workshop.', 'Hasil balancing ISO 1940 Grade G2.5 terverifikasi, vibrasi operasional turun menjadi 1.8 mm/s.',
    'HIGH', 'Major', 'Possible', 'Kelelahan material struktural (fatigue cracking) pada impeler dan poros pompa transfer.',
    'Grouting baseplate dengan Chockfast Red epoxy dan pengencangan baut fondasi 600 Nm.', 'Inspeksi visual kekencangan angkur fondasi dan torque check rutin per 6 bulan.', '2026-11-20', 'Dedi Kusnadi (Mekanik)',
    'Vibrasi terukur tinggi pada spektrum FFT 1X dan 5X blade pass saat pompa mencapai debit maksimal.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Laporan spektrum FFT waterfall & sertifikat dynamic balancing ISO G2.5.', '/assets/synqra-logo-light.png',
    NOW() - INTERVAL '42 hours', NOW() - INTERVAL '4 hours' -- SLA: YELLOW (24–48 jam)
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    status = EXCLUDED.status,
    risk_level = EXCLUDED.risk_level,
    risk_consequence = EXCLUDED.risk_consequence,
    risk_likelihood = EXCLUDED.risk_likelihood,
    risk_summary = EXCLUDED.risk_summary,
    capa_corrective = EXCLUDED.capa_corrective,
    capa_preventive = EXCLUDED.capa_preventive,
    capa_target_date = EXCLUDED.capa_target_date,
    capa_pic = EXCLUDED.capa_pic,
    created_at = EXCLUDED.created_at,
    updated_at = EXCLUDED.updated_at;

-- 9. CASE_COMMENTS SEED (2-Way Feedback Thread Demo)
INSERT INTO public.case_comments (report_id, author_name, author_role, comment, is_revision_request, requested_evidence)
VALUES
('REP-001', 'Ir. Agus Wijaya', 'dept_reviewer', 'Mohon tim mekanik melampirkan data log vibrasi 3 hari terakhir sebelum intervensi overhaul dimulai.', FALSE, NULL),
('REP-001', 'Dedi Kusnadi', 'frontline_omi', 'Data spektrum FFT vibration logger sudah kami upload di lampiran evidence tambahan.', FALSE, NULL),
('REP-005', 'Ir. Agus Wijaya', 'dept_reviewer', 'Laporan dikembalikan ke status PRADUGA. Mohon lampirkan foto area sambungan flange dan hasil log kalibrasi gas detector MSA Altair sebelum diteruskan ke investigasi.', TRUE, 'Foto flange & kalibrasi gas detector'),
('REP-005', 'Hadi Purnomo', 'frontline_omi', 'Siap Pak Agus, foto nameplate dan hasil pengetesan LEL sedang disiapkan oleh tim shift pagi dan akan segera diunggah.', FALSE, NULL),
('REP-006', 'Dr. Rina Suryani', 'hse_validator', 'Catatan validator: Deviasi sinyal transmitter ini berulang setiap 3 bulan, investigasi perlu mengecek apakah getaran pipa beresonansi dengan arm positioner.', FALSE, NULL),
('REP-008', 'Ir. Agus Wijaya', 'dept_reviewer', 'Sertifikat kalibrasi torque wrench dan laporan uji hidrolik 9 bar sudah divalidasi tim QC.', FALSE, NULL),
('REP-010', 'Dr. Rina Suryani', 'hse_validator', 'Kasus disahkan: Hasil dynamic balancing rotor pompa memenuhi standar ISO 1940 G2.5.', FALSE, NULL)
ON CONFLICT DO NOTHING;

-- 10. EVIDENCES SEED (Catatan file bukti fisik di Supabase Storage)
-- PERHATIAN: REP-005 SENGAJA TIDAK MEMILIKI RECORD DI SINI AGAR KUNCI VALIDASI TERKUNCI!
INSERT INTO public.evidences (report_id, file_name, storage_path, mime_type, file_size_bytes, caption, uploaded_by)
VALUES
('REP-001', 'fft-vibration-spectrum-p101a.png', 'p-101a/fft-vibration-spectrum-p101a.png', 'image/png', 245000, 'Spektrum getaran FFT bantalan DE 7.8 mm/s', 'Dedi Kusnadi'),
('REP-002', 'thermal-profile-curve-e201.png', 'e-201/thermal-profile-curve-e201.png', 'image/png', 312000, 'Kurva penurunan efisiensi termal preheat train', 'Siti Nurhaliza'),
('REP-003', 'step-response-chart-fcv301.png', 'fcv-301/step-response-chart-fcv301.png', 'image/png', 198000, 'Grafik respon stroke step delay 8 detik', 'Budi Santoso'),
('REP-004', 'flir-thermography-nde-bearing.jpg', 'p-101a/flir-thermography-nde-bearing.jpg', 'image/jpeg', 420000, 'Citra inframerah hot spot temperatur 74C NDE', 'Dedi Kusnadi'),
('REP-006', 'analog-signal-logger-4-20ma.png', 'fcv-301/analog-signal-logger-4-20ma.png', 'image/png', 185000, 'Log sinyal transmitter Yokogawa deviasi 6.5%', 'Dr. Rina Suryani'),
('REP-007', 'cavitation-acoustic-spectrogram.png', 'p-101a/cavitation-acoustic-spectrogram.png', 'image/png', 276000, 'Spektrogram audio kavitasi suction impeller', 'Dedi Kusnadi'),
('REP-008', 'flange-channel-cover-hydrotest.jpg', 'e-201/flange-channel-cover-hydrotest.jpg', 'image/jpeg', 389000, 'Hasil uji tekan hidrolik 9 bar channel head', 'Ir. Agus Wijaya'),
('REP-009', 'ultrasonic-leak-sdt270.png', 'fcv-301/ultrasonic-leak-sdt270.png', 'image/png', 215000, 'Data detektor kebocoran ultrasonik diafragma', 'Budi Santoso'),
('REP-010', 'dynamic-balancing-certificate-g25.pdf', 'p-101a/dynamic-balancing-certificate-g25.pdf', 'application/pdf', 540000, 'Sertifikat balancing rotor ISO 1940 Grade G2.5', 'Dedi Kusnadi')
ON CONFLICT DO NOTHING;

-- 11. STORAGE BUCKET CONFIGURATION
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'synqra-evidences',
    'synqra-evidences',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;
