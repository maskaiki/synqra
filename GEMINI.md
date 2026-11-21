# SYNQRA Workspace Rules & Design System Guidelines

## STRICT PROHIBITIONS (WAJIB DIPATUHI OLEH AGEN AI)
- DILARANG menggunakan hardcoded dark classes (`bg-slate-950`, `bg-slate-900`, `text-slate-400`, `text-slate-500`) pada elemen utama. WAJIB gunakan CSS variables (`bg-[var(--canvas)]`, `bg-[var(--surface)]`, `bg-[var(--soft)]`, `text-[var(--ink)]`, `text-[var(--ink-soft)]`, `border-[var(--line)]`) agar Mode Terang & Mode Gelap bekerja sempurna.
- DILARANG menumpuk semua fitur ke dalam satu halaman. Gunakan navigasi Sidebar kiri untuk memisahkan `Beranda`, `Lapor Cepat`, `Triage & Kasus`, `Knowledge Graph`, dan `Tanya SYNQRA`.
- DILARANG membuat teks body/paragraf lebih kecil dari `text-sm` (14px). Jaga keterbacaan dan kontras tinggi.
- DILARANG mengganti logo PNG SYNQRA dengan kotak huruf inisial `"S"`. Wajib gunakan `/assets/synqra-logo-light.png` (Light Mode) dan `/assets/synqra-logo-dark.png` (Dark Mode).
- DILARANG menggunakan `rounded-full` pada badge status atau badge SLA. Gunakan tag status arsitektural `rounded-[7px]` dengan aksen garis kiri `border-l-[3.5px]`.
- DILARANG menggunakan model lawas `gemini-1.5-flash`. Wajib gunakan `gemini-2.5-flash`.
- DILARANG menambahkan 3D Canvas / WebGL loop yang berat. Gunakan `TechnicalArt` 2D SVG schematics.

## 1. Tipografi & Tema
- Heading, judul, tombol, dan angka KPI wajib menggunakan **Poppins**.
- Body copy, input form, dan metadata teknis wajib menggunakan **Montserrat**.
- Default tema adalah **Mode Terang (Light Mode)** dengan opsi tombol toggle ke **Mode Gelap (Dark Mode)** (`tailwind.config.ts` wajib `darkMode: 'class'`).

## 2. Tata Kelola & Hard Gate Rules
- Laporan baru via Lapor Cepat wajib berstatus awal `PRADUGA`.
- Tombol `Sahkan Terverifikasi` wajib TERKUNCI (*disabled*) jika:
  1. Bukti fisik (`evidences`) untuk kasus tersebut masih kosong (0 bukti), ATAU
  2. Akun Validator saat ini adalah orang yang sama dengan pelapor kasus (*No Self-Approval / Four-Eyes Principle*).
- Pencarian `Tanya SYNQRA` wajib menampilkan kasus `VERIFIED` di urutan teratas, menampilkan peringatan kuning jika ada kasus `PRADUGA`, dan menyertakan sitasi `[1]`, `[2]` yang dapat diklik untuk membuka bukti.
