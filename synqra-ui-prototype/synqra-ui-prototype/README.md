# SYNQRA — UI/UX Prototype

Prototype antarmuka interaktif untuk platform industrial knowledge management pada industri Oil & Gas.

## Cara membuka

1. Ekstrak folder `synqra-ui-prototype`.
2. Buka `index.html` di browser modern (Chrome, Edge, Firefox, Safari).
3. Pilih salah satu persona demo untuk melihat tampilan sesuai role.

Opsional: jalankan melalui local web server agar perilaku file lokal konsisten:

```bash
python -m http.server 8000
```

Kemudian buka `http://localhost:8000` dari folder proyek.

## Persona demo

- Ahmad Fauzi — Teknisi Lapangan
- Bambang Trihatmojo — Reviewer Departemen
- Rina Suryani — Validator Ahli

## Alur yang dapat dicoba

- Teknisi: buat laporan, pilih equipment, simulasi rekaman suara/transkrip, ketik laporan, unggah foto lokal untuk preview, kirim, lihat status, dan lengkapi laporan yang dikembalikan.
- Reviewer: buka antrean dalam lingkup departemen, periksa laporan, teruskan ke validator atau kembalikan ke teknisi.
- Validator: periksa temuan, pilih valid/perlu bukti tambahan/tidak valid, masukkan alasan, dan konfirmasi.
- Pengetahuan: cari contoh kasus, buka detail, lihat hubungan sederhana aset → gejala → penyebab → solusi.

## Batasan prototype

Ini murni prototype front-end untuk eksplorasi UI/UX. Tidak ada backend, database, autentikasi sungguhan, role permission server-side, penyimpanan permanen, integrasi kamera/mikrofon, speech-to-text, AI, atau integrasi sistem industri. Rekaman suara, transkripsi, keputusan, dan status adalah simulasi JavaScript di browser. Foto yang dipilih hanya digunakan untuk preview lokal.

## Struktur proyek

- `index.html` — kerangka halaman dan pemanggilan stylesheet/script.
- `styles.css` — design system, layout, komponen, dan responsivitas.
- `app.js` — data contoh, navigasi, dan interaksi simulasi.
- `assets/` — logo Synqra asli untuk mode terang dan gelap.

## Font

- Poppins: heading, judul, dan angka utama.
- Plus Jakarta Sans: body, label, kontrol, dan teks antarmuka.

Font dimuat dari Google Fonts, sehingga koneksi internet diperlukan untuk mendapatkan font web; fallback system font tetap tersedia.
