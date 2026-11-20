-- =========================================================================
-- SYNQRA INDUSTRIAL KNOWLEDGE PLATFORM - SUPABASE SCHEMA MIGRATION
-- =========================================================================

-- 1. ENUMS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
        CREATE TYPE report_status AS ENUM ('PRADUGA', 'TRIAGE', 'INVESTIGATION', 'VERIFIED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('frontline_omi', 'dept_reviewer', 'hse_validator');
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

-- 3. REPORTS TABLE (7 Entitas Kegagalan & Status Kunci PRADUGA)
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
    
    -- Metadata Pelaporan:
    description TEXT NOT NULL,
    reporter_name VARCHAR(100) NOT NULL,
    reporter_role user_role NOT NULL DEFAULT 'frontline_omi',
    dept VARCHAR(100) NOT NULL,
    evidence_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CASE_COMMENTS TABLE (Catatan Revisi & Feedback per Kasus)
CREATE TABLE IF NOT EXISTS public.case_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) REFERENCES public.reports(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_role user_role NOT NULL,
    comment TEXT NOT NULL,
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

-- 8. SEED DATA: 7 ENTITAS LAPORAN AWAL
INSERT INTO public.reports (
    id, title, asset_id, status, 
    identitas_alat, gejala, kondisi_operasi, pemeriksaan_awal, praduga_penyebab, usulan_tindakan, verifikasi,
    description, reporter_name, reporter_role, dept, evidence_note
) VALUES
(
    'REP-001', 'Anomali Tekanan & Vibrasi Pompa P-101A', 'P-101A', 'INVESTIGATION',
    'Pompa P-101A (Tag: P-101A)', 'Fluktuasi tekanan discharge 3.2 - 4.1 bar dan vibrasi abnormal', 'Tekanan hisap normal 1.2 bar, temperatur fluida 45°C', 'Spektrum vibrasi 7.8 mm/s di bantalan DE, rembesan ringan mechanical seal', 'Keausan seal chamber dan misalignment kopling poros', 'Alignment laser ulang dan ganti mechanical seal cartridge', 'Uji jalan 4 jam tanpa kenaikan vibrasi > 3.0 mm/s',
    'Tekanan discharge berfluktuasi tajam antara 3.2 - 4.1 bar disertai vibrasi pada bantalan drive end.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Vibrasi 7.8 mm/s, rembesan ringan mechanical seal.'
),
(
    'REP-002', 'Penurunan Efisiensi Termal Heat Exchanger E-201', 'E-201', 'VERIFIED',
    'Heat Exchanger E-201 (Tag: E-201)', 'Penurunan delta temperatur fluida keluar 14°C di bawah baseline standar', 'Laju alir minyak 120 m³/jam, temperatur inlet 145°C', 'Pressure drop shell side naik 0.8 bar di atas spesifikasi bersih', 'Akumulasi deposit kerak (fouling) pada dinding tube bundle', 'Backwash kimiawi dan hydro-cleaning berkala', 'Verifikasi efisiensi pertukaran panas kembali ke 92% baseline',
    'Delta temperatur fluida keluar turun 14°C di bawah baseline standar operasional.', 'Siti Nurhaliza', 'frontline_omi', 'Proses & Operasi', 'Log sensor temperatur inlet/outlet dan kurva efisiensi.'
),
(
    'REP-003', 'Keterlambatan Respon Stroke FCV-301', 'FCV-301', 'TRIAGE',
    'Control Valve FCV-301 (Tag: FCV-301)', 'Katup merespon sinyal DCS 4-20mA terlambat 8 detik', 'Tekanan suplai udara instrumen 4.5 bar stabil', 'Stem movement tersendat pada pembukaan 30% - 50%', 'Stem packing mengering dan gesekan berlebih di gland packing', 'Pelumasan packing stem dan kalibrasi smart valve positioner', 'Tes step response stroke waktu buka-tutup di bawah 2 detik',
    'Katup merespon sinyal DCS 4-20mA terlambat 8 detik saat fluktuasi beban operasi.', 'Budi Santoso', 'frontline_omi', 'Instrumentasi & Kontrol', 'Rekaman grafik respon DCS dan posisi fisik stem.'
),
(
    'REP-004', 'Kenaikan Suhu Bearing Rumah Pompa P-101A', 'P-101A', 'PRADUGA',
    'Pompa P-101A (Tag: P-101A)', 'Temperatur rumah bearing non-drive end terdeteksi 74°C', 'Beban motor 82%, level oli di sight glass 50%', 'Inspeksi termografi FLIR menunjukkan hot spot terisolasi di NDE', 'Degradasi viskositas pelumas oli atau keausan bearing rollers', 'Pengambilan sampel oli pelumas untuk analisis lab dan penambahan grease', 'Pemantauan suhu berkala pasca pelumasan',
    'Inframerah termografi mendeteksi temperatur rumah bearing mencapai 74°C.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Foto termografi FLIR.'
),
(
    'REP-005', 'Indikasi Rembesan Flange Inlet E-201', 'E-201', 'PRADUGA',
    'Heat Exchanger E-201 (Tag: E-201)', 'Aroma uap hidrokarbon di area nozzle inlet shell E-201', 'Suhu lingkungan 31°C, angin tenang, unit beban 100%', 'Deteksi gas portabel menunjukkan pembacaan LEL 12% pada jarak 15 cm', 'Relaksasi baut flange akibat siklus ekspansi termal berulang', 'Retorque baut flange inlet dengan hydraulic torque wrench terkalibrasi', 'Pemeriksaan ulang LEL setelah retorquing',
    'Bau hidrokarbon terdeteksi di sekitar flange inlet nozzle E-201 shift malam.', 'Hadi Purnomo', 'frontline_omi', 'Keselamatan & HSE', 'Pemeriksaan gas detector portabel.'
),
(
    'REP-006', 'Deviasi Sinyal Feedback Transmitter FCV-301', 'FCV-301', 'INVESTIGATION',
    'Control Valve FCV-301 (Tag: FCV-301)', 'Deviasi sinyal posisi fisik katup vs indikator monitor 6.5%', 'Operasi normal loop kendali debit gas fuel', 'Linkage arm positioner memiliki clearance longgar 1.2 mm', 'Aus mekanik pada pen linkage arm transmitter', 'Penggantian pen linkage dan re-zeroing kalibrasi span', 'Verifikasi deviasi sinyal posisi < 0.5% di seluruh rentang 0-100%',
    'Sinyal feedback transmitter posisi tidak linier pada bukaan 40% - 60%.', 'Budi Santoso', 'frontline_omi', 'Instrumentasi & Kontrol', 'Data logger sinyal analog 4-20mA.'
),
(
    'REP-007', 'Suara Kavitasi Suction Pompa P-101A', 'P-101A', 'TRIAGE',
    'Pompa P-101A (Tag: P-101A)', 'Suara berderak kerikil khas kavitasi pada sisi suction impeller', 'Level tangki suction 2.1 m (ambang minimum operasi)', 'Pengukuran tekanan suction turun mendekati tekanan uap jenuh fluida', 'Net Positive Suction Head Available (NPSHa) kritis akibat level tangki', 'Kenaikan setpoint level tangki suction dan buka penuh suction valve', 'Verifikasi hilangnya kebisingan akustik kavitasi',
    'Terdengar suara dentuman kerikil saat laju alir diturunkan ke 65% beban nominal.', 'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Audio rekaman mikrofon akustik industri.'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    status = EXCLUDED.status,
    identitas_alat = EXCLUDED.identitas_alat,
    gejala = EXCLUDED.gejala,
    kondisi_operasi = EXCLUDED.kondisi_operasi,
    pemeriksaan_awal = EXCLUDED.pemeriksaan_awal,
    praduga_penyebab = EXCLUDED.praduga_penyebab,
    usulan_tindakan = EXCLUDED.usulan_tindakan,
    verifikasi = EXCLUDED.verifikasi,
    description = EXCLUDED.description;

-- 9. SUPABASE STORAGE BUCKET CONFIGURATION
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'synqra-evidences',
    'synqra-evidences',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 10485760;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidences ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert for demo application:
CREATE POLICY "Public read assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Public read reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Public insert reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update reports" ON public.reports FOR UPDATE USING (true);

CREATE POLICY "Public read comments" ON public.case_comments FOR SELECT USING (true);
CREATE POLICY "Public insert comments" ON public.case_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read evidences" ON public.evidences FOR SELECT USING (true);
CREATE POLICY "Public insert evidences" ON public.evidences FOR INSERT WITH CHECK (true);
