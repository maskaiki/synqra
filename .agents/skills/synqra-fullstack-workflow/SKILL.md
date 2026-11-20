---
name: synqra-fullstack-workflow
description: >-
  Panduan dan cheatsheet pengembangan full-stack untuk Synqra Industrial Knowledge Platform
  menggunakan Next.js App Router, TypeScript, Tailwind CSS, Supabase (Database & Storage),
  dan Google Gemini API (Lapor Cepat audio/text structuring & Vision nameplate OCR).
---

# Synqra Full-Stack Workflow & Implementation Guide

Gunakan panduan ini saat mengembangkan modul fitur di proyek Synqra.

## 1. Arsitektur Komponen & Direktori
- `src/app/api/lapor-cepat/route.ts`: Endpoint Route Handler server-side yang memproses input teks / audio dan memanggil Google Gemini API (`gemini-1.5-flash` atau `gemini-2.0-flash`) dengan skema JSON terstruktur 7 entitas.
- `src/app/api/scan-nameplate/route.ts`: Endpoint pengenal nameplate aset berbasis gambar (multimodal Gemini Vision).
- `src/components/reports/QuickReportModal.tsx`: Komponen modal perekaman suara (`MediaRecorder` API) dan formulir interaktif hasil ekstraksi AI.
- `src/components/layout/RoleSwitcher.tsx`: Demo role switcher untuk `frontline_omi`, `dept_reviewer`, dan `hse_validator`.
- `src/components/ui/StatusBadge.tsx`: Tag status arsitektural bersudut tegas dengan border aksen kiri.
- `src/components/ui/TechnicalArt.tsx`: Vektor 2D SVG schematics untuk peralatan industri.

## 2. Supabase Integration
- Gunakan `@supabase/supabase-js` dan `@supabase/ssr` untuk client/server context.
- Skema tabel relasional:
  - `assets`: `id` (PK), `name`, `type`, `area`, `description`.
  - `reports`: `id` (PK), `title`, `asset_id` (FK), `status` (`PRADUGA`, `TRIAGE`, `INVESTIGATION`, `VERIFIED`), `description`, `reporter_name`, `reporter_role`, `dept`, `evidence_note`, `cause`, `solution`, `created_at`, `updated_at`.
  - `case_comments`: `id` (PK), `report_id` (FK), `author_name`, `author_role`, `comment`, `created_at`.
  - `evidences`: `id` (PK), `report_id` (FK), `file_name`, `storage_path`, `mime_type`, `file_size_bytes`, `caption`, `uploaded_by`.
- Storage Bucket: `synqra-evidences` (public read untuk demo, restricted write).

## 3. Ekstraksi Google Gemini
- Gunakan `@google/genai` atau `@google/generative-ai` dengan prompt sistem yang menegaskan output JSON murni tanpa markdown fence jika parsing manual, atau gunakan `responseMimeType: "application/json"` dan `responseSchema`.
- Selalu sediakan fallback parser lokal / mock analyzer cerdas jika `GEMINI_API_KEY` belum disetel di `.env.local`, sehingga pengguna tetap dapat menguji fitur secara end-to-end langsung dari browser.
