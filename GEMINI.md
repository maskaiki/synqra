# SYNQRA Workspace Rules & Design System Guidelines

## 1. Tipografi & Kontras
- Heading, judul, angka metrik, dan KPI wajib menggunakan font **Poppins** (`font-weight`: 600, 700, 800).
- Body copy, input form, label, dan metadata teknis wajib menggunakan font **Montserrat** (`font-weight`: 500, 600, 700).
- Strictly High Contrast: Dilarang menggunakan teks abu-abu pudar yang sulit dibaca di lingkungan industri.
- Wajib mendukung Mode Terang (Light) dan Mode Gelap (Dark) dengan varian warna CSS token `--surface`, `--surface-elevated`, `--line`, `--ink`, `--cyan`.

## 2. Tag Status Arsitektural (Industrial Status Tag)
- Dilarang menggunakan rounded pill generik (`rounded-full`).
- Gunakan format arsitektural: sudut tegas (`rounded-md` atau `rounded-[7px]`), garis batas aksen warna di sisi kiri (`border-l-[3.5px]`), latar belakang semi-transparan, teks kapital tegas dengan tracking tajam, dan ikon mikro (13-14px).
- Status resmi alur kasus:
  - `PRADUGA`: Amber / Oranye (`#D97706`, latar amber lembut)
  - `TRIAGE`: Biru Cerah (`#0284C7`, latar info lembut)
  - `INVESTIGATION`: Ungu / Sian (`#8B5CF6` atau `#00B8D9`)
  - `VERIFIED`: Emerald Hijau (`#059669`, latar hijau lembut)

## 3. Visualisasi Teknis Peralatan
- Dilarang menambahkan kembali 3D Canvas / WebGL Inspector loop yang membebani browser.
- Gunakan representasi 2D vector SVG teknis (`equipmentArt`) untuk peralatan: Heat Exchanger, Centrifugal Pump, Control Valve, Compressor, Separator Vessel, dan Furnace Heater.

## 4. Multi-Role Workflow
- Setiap alur kerja harus mempertimbangkan 3 peran demo:
  1. Frontline OMI: Input temuan lapangan, unggah bukti foto, status awal terkunci `PRADUGA`.
  2. Reviewer Departemen: Triage & evaluasi kelengkapan data (`TRIAGE` / `INVESTIGATION`).
  3. HSE / Pakar Validator: Verifikasi akhir (`VERIFIED` / ditolak) dan konversi menjadi pengetahuan terstruktur (Knowledge Base).

## 5. Fitur Lapor Cepat & Gemini AI Extraction
- Ekstraksi AI wajib memetakan narasi lapangan menjadi 7 entitas kegagalan:
  1. Identitas Alat (Asset Tag/Name)
  2. Gejala (Symptom)
  3. Kondisi Operasi (Operating Condition)
  4. Pemeriksaan Awal (Initial Inspection)
  5. Praduga Penyebab (Suspected Cause)
  6. Usulan Tindakan (Proposed Action)
  7. Verifikasi (Follow-up Verification)
- Status awal laporan baru wajib dikunci sebagai `PRADUGA`.
- Scan Nameplate mendeteksi kode tag aset dan mencocokkan dengan katalog aset terdaftar (`P-101A`, `E-201`, `FCV-301`).
