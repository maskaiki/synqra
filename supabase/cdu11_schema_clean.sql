-- =========================================================================
-- SYNQRA INDUSTRIAL KNOWLEDGE PLATFORM - CLEAN SCHEMA DDL (UNIT 11 CDU BALONGAN)
-- Jalankan file ini diikuti oleh synqra-app/supabase/seed.sql (atau npm run seed)
-- Aman dijalankan ulang di Supabase SQL Editor (Idempotent, tanpa data pilot lama).
-- =========================================================================

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

CREATE TABLE IF NOT EXISTS public.assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    area VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    asset_id VARCHAR(50) REFERENCES public.assets(id) ON DELETE RESTRICT,
    status report_status NOT NULL DEFAULT 'PRADUGA',
    identitas_alat VARCHAR(255),
    gejala TEXT NOT NULL,
    kondisi_operasi TEXT,
    pemeriksaan_awal TEXT,
    praduga_penyebab TEXT,
    usulan_tindakan TEXT,
    verifikasi TEXT,
    risk_level risk_level DEFAULT 'MEDIUM',
    risk_consequence VARCHAR(100),
    risk_likelihood VARCHAR(100),
    risk_summary TEXT,
    capa_corrective TEXT,
    capa_preventive TEXT,
    capa_target_date DATE,
    capa_pic VARCHAR(100),
    sla_reminder_count INT DEFAULT 0,
    sla_last_reminder_at TIMESTAMPTZ,
    description TEXT NOT NULL,
    reporter_name VARCHAR(100) NOT NULL,
    reporter_role user_role NOT NULL DEFAULT 'frontline_omi',
    dept VARCHAR(100) NOT NULL,
    evidence_note TEXT,
    image_url TEXT,
    verified_by VARCHAR(100),
    finding_type VARCHAR(60),
    urgency VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports
    ADD COLUMN IF NOT EXISTS verified_by VARCHAR(100),
    ADD COLUMN IF NOT EXISTS finding_type VARCHAR(60),
    ADD COLUMN IF NOT EXISTS urgency VARCHAR(30);

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

CREATE TABLE IF NOT EXISTS public.evidences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) REFERENCES public.reports(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    caption TEXT,
    uploaded_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_asset_id ON public.reports(asset_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_report_id ON public.case_comments(report_id);
CREATE INDEX IF NOT EXISTS idx_evidences_report_id ON public.evidences(report_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'synqra-evidences',
    'synqra-evidences',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;
