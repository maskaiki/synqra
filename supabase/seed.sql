-- =========================================================================
-- SYNQRA INDUSTRIAL KNOWLEDGE PLATFORM - SUPABASE DATABASE SEED SCRIPT
-- 10 Realistic Refinery Cases for P-101A, E-201, and FCV-301
-- Includes:
-- 1. REP-001 & REP-005: Age > 48 hours to trigger RED SLA Overdue Reminder
-- 2. REP-005: Empty evidence to demonstrate Hard Gate Validation Lock
-- 3. REP-006: Reported by Dr. Rina Suryani (hse_validator) for No Self-Approval
-- =========================================================================

-- 1. SEED ASSETS (3 Peralatan Utama Kilang)
INSERT INTO public.assets (id, name, type, area, description) VALUES
('P-101A', 'Pompa Sentrifugal Umpan Mentah', 'pump', 'Unit Crude Distillation (CDU)', 'Pompa sentrifugal multistage transfer fluida hidrokarbon berat.'),
('E-201', 'Heat Exchanger Pre-Heat Train', 'heat', 'Unit Treated Oil', 'Shell & tube heat exchanger perpindahan panas minyak mentah ke produk.'),
('FCV-301', 'Pneumatic Flow Control Valve', 'valve', 'Jalur Gas Fuel Gas Unit', 'Katup kontrol aliran gas bertekanan tinggi dengan smart positioner.')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    area = EXCLUDED.area,
    description = EXCLUDED.description;

-- 2. SEED 10 REALISTIC REPORTS
INSERT INTO public.reports (
    id, title, asset_id, status, 
    identitas_alat, gejala, kondisi_operasi, pemeriksaan_awal, praduga_penyebab, usulan_tindakan, verifikasi,
    risk_level, risk_consequence, risk_likelihood, risk_summary,
    capa_corrective, capa_preventive, capa_target_date, capa_pic,
    description, reporter_name, reporter_role, dept, evidence_note, image_url, created_at, updated_at
) VALUES
(
    -- KASUS 1: Pompa P-101A (RED SLA > 48 jam)
    'REP-001', 'Anomali Tekanan & Vibrasi Bantalan DE Pompa P-101A', 'P-101A', 'INVESTIGATION',
    'Pompa Sentrifugal P-101A (Tag: P-101A)', 'Fluktuasi tekanan discharge 3.2 - 4.1 bar dan vibrasi abnormal pada bantalan drive end (DE).', 'Tekanan hisap normal 1.2 bar, temperatur fluida 45°C, debit 110 m³/jam (kapasitas 88%).', 'Vibrasi terukur 7.8 mm/s di bantalan DE, rembesan ringan mechanical seal.', 'Keausan seal chamber dan misalignment kopling poros terhadap driver motor.', 'Laser alignment ulang poros dan penggantian cartridge mechanical seal.', 'Uji jalan continuous 4 jam tanpa kenaikan vibrasi melampaui batas ISO 3.0 mm/s.',
    'HIGH', 'Major', 'Possible', 'Risiko tinggi kerusakan bearing katastrofik & potensi unplanned shutdown unit CDU.',
    'Penggantian cartridge mechanical seal dan realign poros dengan laser alignment.', 'Pemasangan sensor vibration online wireless untuk continuous telemetry monitoring.', '2026-11-28', 'Dedi Kusnadi (Mekanik)',
    'Tekanan discharge berfluktuasi tajam antara 3.2 - 4.1 bar disertai vibrasi pada bantalan drive end.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Spektrum FFT vibration logger & foto area seal.', '/assets/synqra-logo-dark.png',
    NOW() - INTERVAL '52 hours', NOW() - INTERVAL '52 hours' -- SLA: RED (> 48 jam - Overdue)
),
(
    -- KASUS 2: Heat Exchanger E-201 (VERIFIED, GREEN SLA)
    'REP-002', 'Penurunan Efisiensi Termal Heat Exchanger E-201', 'E-201', 'VERIFIED',
    'Heat Exchanger Pre-Heat Train E-201 (Tag: E-201)', 'Delta temperatur fluida keluar turun 14°C di bawah baseline standar operasional.', 'Laju alir minyak 120 m³/jam, temperatur inlet shell 145°C, tekanan 6.2 bar.', 'Pressure drop shell side naik 0.8 bar di atas spesifikasi bersih.', 'Akumulasi deposit kerak (fouling) pada dinding tube bundle.', 'Backwash sirkulasi kimiawi dan hydro-cleaning berkala.', 'Verifikasi efisiensi pertukaran panas kembali ke 92% baseline operasi kilang.',
    'MEDIUM', 'Moderate', 'Likely', 'Risiko pemborosan konsumsi energi fuel gas furnace preheat train.',
    'Pembersihan sirkulasi kimiawi (chemical flushing) pada sisi shell & tube bundle.', 'Pemasangan differential pressure transmitter terkalibrasi dengan high alarm di DCS.', '2026-12-05', 'Siti Nurhaliza (Proses)',
    'Delta temperatur fluida keluar turun 14°C di bawah baseline standar operasional.', 'Siti Nurhaliza', 'frontline_omi', 'Proses & Operasi', 'Log sensor temperatur inlet/outlet dan kurva efisiensi.', '/assets/synqra-logo-light.png',
    NOW() - INTERVAL '18 hours', NOW() - INTERVAL '2 hours' -- SLA: GREEN (< 24 jam)
),
(
    -- KASUS 3: Control Valve FCV-301 (TRIAGE, YELLOW SLA)
    'REP-003', 'Keterlambatan Respon Stroke Katup Kontrol FCV-301', 'FCV-301', 'TRIAGE',
    'Pneumatic Flow Control Valve FCV-301 (Tag: FCV-301)', 'Katup merespon sinyal DCS 4-20mA terlambat 8 detik saat fluktuasi beban operasi.', 'Tekanan suplai udara instrumen 4.5 bar stabil, temperatur ambien 32°C.', 'Stem movement tersendat pada rentang pembukaan 30% - 50%.', 'Stem packing mengering dan gesekan berlebih di gland packing katup.', 'Pelumasan packing stem dan kalibrasi smart valve positioner.', 'Tes step response stroke waktu buka-tutup di bawah 2 detik sesuai spesifikasi.',
    'HIGH', 'Major', 'Possible', 'Risiko instabilitas tekanan fuel gas boiler yang memicu fluktuasi steam header.',
    'Pelumasan gland packing dan kalibrasi full stroke 0-100% pada smart positioner.', 'Jadwal preventive maintenance greasing stem diperketat menjadi per 2 minggu.', '2026-11-25', 'Budi Santoso (Instrumen)',
    'Katup merespon sinyal DCS 4-20mA terlambat 8 detik saat fluktuasi beban operasi.', 'Budi Santoso', 'frontline_omi', 'Instrumentasi & Kontrol', 'Rekaman grafik respon DCS dan posisi fisik stem.', '/assets/synqra-logo-dark.png',
    NOW() - INTERVAL '31 hours', NOW() - INTERVAL '31 hours' -- SLA: YELLOW (24–48 jam - Segera Cek)
),
(
    -- KASUS 4: Pompa P-101A (PRADUGA, GREEN SLA)
    'REP-004', 'Kenaikan Suhu Rumah Bantalan NDE Pompa P-101A', 'P-101A', 'PRADUGA',
    'Pompa Sentrifugal P-101A (Tag: P-101A)', 'Temperatur rumah bearing non-drive end terdeteksi 74°C (ambang batas normal < 65°C).', 'Beban motor 82%, level oli di sight glass 50%, temperatur ambien 33°C.', 'Inspeksi termografi FLIR menunjukkan hot spot terisolasi di area bearing NDE.', 'Degradasi viskositas pelumas oli atau keausan bearing rollers.', 'Pengambilan sampel oli pelumas untuk analisis lab dan penggantian grease sintetik.', 'Pemantauan suhu berkala pasca pelumasan stabil di bawah 60°C selama 48 jam.',
    'CRITICAL', 'Catastrophic', 'Possible', 'Potensi seizure bearing mendadak yang memicu trip pompa umpan utama dan kebakaran gesekan.',
    'Penggantian oli pelumas sintetik ISO VG 46 dan greasing ulang bantalan.', 'Uji getaran spektrum demodulasi untuk deteksi dini cacat raceway bearing.', '2026-11-24', 'Dedi Kusnadi (Mekanik)',
    'Inframerah termografi mendeteksi temperatur rumah bearing mencapai 74°C.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Foto termografi kamera FLIR E5.', '/assets/synqra-logo-dark.png',
    NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours' -- SLA: GREEN (< 24 jam)
),
(
    -- KASUS 5: Heat Exchanger E-201 (PRADUGA, RED SLA > 48 jam, HARD GATE DEMO: EMPTY EVIDENCE!)
    'REP-005', 'Indikasi Rembesan Flange Inlet Nozzle E-201', 'E-201', 'PRADUGA',
    'Heat Exchanger Pre-Heat Train E-201 (Tag: E-201)', 'Aroma uap hidrokarbon terdeteksi di area nozzle inlet shell E-201 shift malam.', 'Suhu lingkungan 31°C, angin tenang, unit beroperasi pada beban 100%.', 'Deteksi gas portabel menunjukkan pembacaan LEL 12% pada jarak 15 cm dari flange.', 'Relaksasi baut flange akibat siklus ekspansi termal berulang.', 'Retorque baut flange inlet dengan hydraulic torque wrench 450 Nm terkalibrasi.', 'Pemeriksaan ulang detector gas setelah retorquing menunjukkan 0% LEL.',
    'CRITICAL', 'Catastrophic', 'Possible', 'Bahaya kebakaran uap hidrokarbon mudah menyala di area kilang aktif.',
    'Pengencangan baut flange bertahap menggunakan hydraulic torque wrench 450 Nm.', 'Pemasangan pita deteksi kebocoran termal (thermal leak wraps) di sekeliling sambungan flange.', '2026-11-23', 'Hadi Purnomo (HSE)',
    'Bau hidrokarbon terdeteksi di sekitar flange inlet nozzle E-201 shift malam.', 'Hadi Purnomo', 'frontline_omi', 'Keselamatan & HSE', 'Bukti foto belum dilampirkan', NULL, -- EMPTY EVIDENCE!
    NOW() - INTERVAL '58 hours', NOW() - INTERVAL '58 hours' -- SLA: RED (> 48 jam - Overdue)
),
(
    -- KASUS 6: Control Valve FCV-301 (INVESTIGATION, YELLOW SLA, HARD GATE DEMO: NO SELF-APPROVAL!)
    'REP-006', 'Deviasi Sinyal Feedback Transmitter FCV-301', 'FCV-301', 'INVESTIGATION',
    'Pneumatic Flow Control Valve FCV-301 (Tag: FCV-301)', 'Deviasi sinyal posisi fisik katup vs indikator monitor DCS sebesar 6.5%.', 'Operasi normal loop kendali debit fuel gas pada bukaan 40% - 60%.', 'Linkage arm positioner memiliki clearance kelonggaran 1.2 mm.', 'Aus mekanik pada pin linkage arm transmitter akibat getaran siklis pipa.', 'Penggantian pin linkage stainless steel dan re-zeroing kalibrasi span positioner.', 'Verifikasi deviasi sinyal posisi < 0.5% di seluruh rentang bukaan 0-100%.',
    'LOW', 'Minor', 'Possible', 'Error pembacaan telemetri tanpa risiko shutdown proses mendesak.',
    'Penggantian pin linkage stainless steel dan kalibrasi digital span positioner.', 'Inspeksi clearance linkage setiap 3 bulan.', '2026-12-10', 'Budi Santoso (Instrumen)',
    'Sinyal feedback transmitter posisi tidak linier pada bukaan 40% - 60%.', 'Dr. Rina Suryani', 'hse_validator', 'HSE & Process Safety', 'Data logger sinyal analog 4-20mA Yokogawa.', '/assets/synqra-logo-dark.png', -- REPORTED BY VALIDATOR
    NOW() - INTERVAL '36 hours', NOW() - INTERVAL '36 hours' -- SLA: YELLOW (24–48 jam)
),
(
    -- KASUS 7: Pompa P-101A (TRIAGE, YELLOW SLA)
    'REP-007', 'Suara Kavitasi Suction Impeller Pompa P-101A', 'P-101A', 'TRIAGE',
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

-- 3. SEED CASE COMMENTS (Catatan 2 Arah & Revision Requests)
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

-- 4. SEED EVIDENCES (Catatan file bukti fisik di Supabase Storage)
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

-- 5. STORAGE BUCKET CONFIGURATION
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'synqra-evidences',
    'synqra-evidences',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;
