# SYNQRA — Industrial Knowledge Platform (Clean Full-Stack Edition)

Platform *Context-Aware Evidence-Based Knowledge Management System* berbasis AI untuk preservasi pengetahuan dan analisis kasus kegagalan peralatan industri minyak dan gas (Migas).

## Struktur Folder
- `synqra-app/` — Aplikasi Web Full-Stack (Next.js 15 App Router, TypeScript, Tailwind CSS, Supabase, Google Gemini 2.5 Flash).
- `supabase/` — Migrasi SQL skema database (`assets`, `reports`, `case_comments`, `evidences`) & data awal (`seed.sql`).
- `GEMINI.md` — Aturan desain & larangan ketat untuk pengembangan di Antigravity.

## Cara Menjalankan (Cepat)
1. Buka terminal di dalam folder `synqra-app/`:
   ```bash
   cd synqra-app
   npm install
   ```
2. (Opsional untuk AI & Database Live) Salin `.env.example` menjadi `.env.local`, lalu isi `GEMINI_API_KEY` dan kredensial Supabase.
   *Catatan: Tanpa `.env.local` pun, seluruh fitur aplikasi tetap berjalan penuh secara lokal (data tersimpan di browser `localStorage` + fallback analyzer lokal).*
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:3000` di browser.

## Alur Demo yang Siap Diuji
1. **Login & Ganti Peran Cepat:** Pilih `Teknisi Lapangan (Frontline OMI)`, `Reviewer Departemen`, atau `HSE & Pakar Validator`.
2. **Lapor Cepat AI (Halaman Penuh):** Rekam suara (VN) / ketik narasi + Scan Nameplate -> otomatis terekstrak menjadi 7 Entitas berstatus `PRADUGA`.
3. **Pengingat SLA Otomatis:** Laporan berumur > 48 jam (`REP-001`, `REP-004`) langsung memunculkan banner pengingat SLA Merah dan tombol **Kirim Pengingat**.
4. **Hard Gate Validasi Pakar:**
   - Buka `REP-004` (bukti kosong) sebagai `HSE Validator` -> tombol **Sahkan Terverifikasi** terkunci hingga bukti fisik diunggah.
   - Buka `REP-006` (dilaporkan oleh `Dr. Rina Suryani`) sebagai `Dr. Rina Suryani` -> tombol terkunci oleh aturan **No Self-Approval**.
5. **Knowledge Graph Terisolasi & Tanya SYNQRA:** Jelajahi graf per aset (`P-101A`, `E-201`, `FCV-301`) dan ajukan pertanyaan di *Tanya SYNQRA* lengkap dengan peringatan `PRADUGA` dan sitasi `[1]`, `[2]` yang bisa diklik.
