# SYNQRA — UI/UX Prototype (v2 Interactive Edition)

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

## Pembaruan Utama (v2)

- **Tipografi Poppins & Montserrat:** Seluruh heading, judul, dan angka menggunakan Poppins; seluruh body, label, dan kontrol menggunakan Montserrat dengan skala ukuran yang lebih besar dan mudah dibaca.
- **Kontras Tinggi:** Menghilangkan teks abu-abu pudar di seluruh halaman (Login, Beranda Teknisi, Laporan Saya, Detail Pengetahuan KB-001, dan Navigasi Workspace).
- **Mode Terang & Mode Gelap (Dark Mode):** Tombol Mode Tampilan aktif penuh di sidebar, topbar, dan halaman login dengan pergantian logo otomatis (`synqra-logo-light.png` / `synqra-logo-dark.png`) serta penyimpanan preferensi di browser.
- **Badge Status Industrial:** Mengganti pil bulat lama dengan tag status bergaya arsitektural (sudut tegas, aksen garis kiri, dan ikon mikro) berkontras tinggi.
- **Technical 2D Vector Diagrams:** Diagram teknis skematik peralatan industri berbasis SVG yang presisi dan ringan pada halaman Detail Laporan, Detail Pengetahuan (`KB-001` dst.), dan Hero Login.
- **Interactive Animated Knowledge Graph:** Visualisasi hubungan Aset → Gejala → Penyebab → Solusi → Verifikasi dengan aliran partikel energi dan node yang dapat diklik.
- **3D Tilt, Sheen & Micro-Interactions:** Efek perspektif 3D dinamis mengikuti kursor pada kartu utama, animasi angka KPI, kanvas jaringan interaktif pada halaman login, panel Notifikasi interaktif, dan Quick Persona Switcher.
