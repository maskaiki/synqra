-- =========================================================================
-- SYNQRA MIGRATION: EKSPANSI 18 KASUS REALISTIS (REP-011 s.d. REP-018)
-- Memperkuat pola berulang Early Warning AI & kepadatan Knowledge Graph
-- Aman dijalankan ulang di Supabase SQL Editor (Idempotent)
-- =========================================================================

ALTER TABLE public.reports
    ADD COLUMN IF NOT EXISTS verified_by VARCHAR(100),
    ADD COLUMN IF NOT EXISTS finding_type VARCHAR(60),
    ADD COLUMN IF NOT EXISTS urgency VARCHAR(30);

-- 1. TAMBAH 8 KASUS TERVERIFIKASI BARU (REP-011 s.d. REP-018)
INSERT INTO public.reports (
    id, title, asset_id, status,
    identitas_alat, gejala, kondisi_operasi, pemeriksaan_awal, praduga_penyebab, usulan_tindakan, verifikasi,
    risk_level, risk_consequence, risk_likelihood, risk_summary,
    capa_corrective, capa_preventive, capa_target_date, capa_pic,
    description, reporter_name, reporter_role, dept, evidence_note,
    verified_by, finding_type, urgency, created_at, updated_at
) VALUES
(
    'REP-011', 'Rembesan Mechanical Seal & Misalignment Kopling P-101A', 'P-101A', 'VERIFIED',
    'Pompa Sentrifugal P-101A', 'Tetesan fluida di seal gland disertai getaran radial 6,5 mm/s pada bantalan penggerak.',
    'Debit transfer 118 m3/jam pada tekanan discharge 4,4 bar.',
    'Pengukuran laser alignment mendapati deviasi paralel kopling sebesar 0,14 mm.',
    'Misalignment kopling poros mempercepat keausan face mechanical seal dan kebocoran cairan.',
    'Ganti cartridge mechanical seal, bersihkan jalur seal flush, dan lakukan laser alignment.',
    'Uji jalan 4 jam menunjukkan vibrasi turun ke 2,1 mm/s tanpa rembesan.',
    'HIGH', 'Major', 'Likely', 'Rembesan fluida hidrokarbon berisiko memicu kebakaran lokal di area pompa transfer.',
    'Penggantian cartridge seal baru dan laser alignment ulang kopling motor-pompa.',
    'Pemeriksaan strainer saluran flush plan 11 setiap penggantian shift mingguan.', '2026-10-28', 'Tim Mekanik Rotating',
    'Pola berulang rembesan mechanical seal akibat misalignment kopling pada pompa P-101A telah diperbaiki dan diverifikasi.',
    'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Laporan laser alignment dan foto seal cartridge baru.',
    'Dr. Rina Suryani', 'Potensi Bahaya', 'Mendesak', NOW() - INTERVAL '640 hours', NOW() - INTERVAL '615 hours'
),
(
    'REP-012', 'Kelelahan Elastomer Kopling & Getaran Axial P-101A', 'P-101A', 'VERIFIED',
    'Pompa Sentrifugal P-101A', 'Getaran arah axial mencapai 6,1 mm/s disertai suara ketukan halus dari pelindung kopling.',
    'Beban operasi 92%, putaran motor stabil di 2950 RPM.',
    'Ditemukan serpihan karet hitam di bawah guard kopling dan celah baut pipa hisap.',
    'Kelelahan elemen elastomer kopling akibat tegangan pipa hisap (pipe strain) berlebih.',
    'Lepas stress baut flange pipa hisap, ganti elemen kopling, dan periksa kerataan mechanical seal.',
    'Getaran axial pasca perbaikan terukur 1,6 mm/s pada beban penuh.',
    'HIGH', 'Major', 'Possible', 'Getaran axial berulang merusak thrust bearing dan face mechanical seal P-101A.',
    'Penggantian elemen kopling dan penyetelan pipe support suction.',
    'Tambahkan inspeksi visual serpihan elastomer kopling pada patroli mingguan.', '2026-10-10', 'Tim Mekanik Rotating',
    'Kelelahan kopling dan getaran axial pada P-101A teratasi setelah pelepasan pipe strain.',
    'Dedi Kusnadi', 'frontline_omi', 'Mekanik & Rotating', 'Foto elemen kopling retak dan hasil uji vibrasi axial.',
    'Dr. Rina Suryani', 'Kondisi Abnormal', 'Normal', NOW() - INTERVAL '1120 hours', NOW() - INTERVAL '1090 hours'
),
(
    'REP-013', 'Kenaikan Pressure Drop & Deposit Kerak Tube E-201', 'E-201', 'VERIFIED',
    'Heat Exchanger E-201', 'Beda tekanan sisi tube naik 0,75 bar dan suhu keluar produk turun 11 derajat dari target.',
    'Laju alir minyak mentah 125 m3/jam, suhu masuk shell 255 derajat C.',
    'Pengambilan sampel endapan pada nozzle drain menunjukkan kerak aspalten keras.',
    'Pengendapan fraksi berat hidrokarbon (fouling) akibat kecepatan aliran di bawah batas minimum.',
    'Lakukan chemical flushing dan hydrojetting bertekanan 700 bar pada tube bundle.',
    'Pressure drop kembali normal ke 0,22 bar dan selisih suhu pulih penuh.',
    'MEDIUM', 'Moderate', 'Likely', 'Fouling berulang menaikkan konsumsi fuel gas furnace dan tekanan pompa umpan.',
    'Hydrojetting tube bundle E-201 saat jendela pemeliharaan terencana.',
    'Jaga laju alir minimum di atas 105 m3/jam untuk mencegah pengendapan partikel berat.', '2026-11-02', 'Tim Proses & Thermal',
    'Kenaikan pressure drop akibat fouling aspalten di tube bundle E-201 berhasil dipulihkan.',
    'Dedi Kusnadi', 'frontline_omi', 'Proses & Operasi', 'Log tren pressure drop dan foto endapan nozzle drain E-201.',
    'Dr. Rina Suryani', 'Kondisi Abnormal', 'Normal', NOW() - INTERVAL '520 hours', NOW() - INTERVAL '495 hours'
),
(
    'REP-014', 'Rembesan Gasket Floating Head Pasca Startup E-201', 'E-201', 'VERIFIED',
    'Heat Exchanger E-201', 'Muncul uap tipis dan rembesan minyak pada sambungan flange cover floating head.',
    'Pemanasan bertahap pasca stop singkat, tekanan 5,8 bar pada suhu 175 derajat C.',
    'Deteksi LEL terukur 2% di bibir flange bawah akibat torsi baut tidak seragam.',
    'Relaksasi tegangan baut dan keausan gasket spiral wound akibat siklus panas-dingin cepat.',
    'Isolasi unit, ganti gasket spiral wound baru, dan kencangkan baut pola bintang terukur.',
    'Lulus uji tekan nitrogen 7 bar tanpa kebocoran dan pembacaan LEL 0%.',
    'HIGH', 'Major', 'Possible', 'Kebocoran gasket panas pada startup berisiko menyulut api di area unit treated oil.',
    'Penggantian gasket floating head dan kalibrasi ulang torque wrench.',
    'Batasi laju kenaikan suhu startup maksimal 25 derajat C per jam.', '2026-10-18', 'Tim Maintenance Piping',
    'Rembesan gasket floating head E-201 pasca startup berhasil ditangani dan lolos uji tekan.',
    'Dedi Kusnadi', 'frontline_omi', 'Proses & Operasi', 'Foto sambungan floating head dan lembar sertifikat uji tekan nitrogen.',
    'Dr. Rina Suryani', 'Potensi Bahaya', 'Mendesak', NOW() - INTERVAL '880 hours', NOW() - INTERVAL '850 hours'
),
(
    'REP-015', 'Penurunan Efisiensi Perpindahan Panas & Fouling Awal E-201', 'E-201', 'VERIFIED',
    'Heat Exchanger E-201', 'Koefisien perpindahan panas keseluruhan turun 18% dalam tiga minggu operasi.',
    'Pompa injeksi kimia antifoulant terdeteksi beroperasi di bawah dosis standar.',
    'Kalibrasi stroke pompa dosing kimia menemukan kebocoran check valve injeksi.',
    'Suplai injeksi antifoulant tidak masuk sempurna sehingga memicu fouling dini pada dinding tube.',
    'Perbaiki check valve pompa dosing antifoulant dan bersihkan jalur balik E-201.',
    'Laju injeksi kimia kembali sesuai target 15 ppm dan tren suhu keluar kembali stabil.',
    'MEDIUM', 'Moderate', 'Likely', 'Kegagalan injeksi antifoulant mempercepat siklus pembersihan E-201 hingga dua kali lipat.',
    'Perbaikan check valve pompa dosing dan flushing ringan sisi shell.',
    'Tambahkan flow switch alarm pada lini injeksi bahan kimia antifoulant.', '2026-10-03', 'Tim Proses & Kimia',
    'Penyebab fouling dini E-201 teridentifikasi pada kegagalan check valve pompa dosing antifoulant.',
    'Dedi Kusnadi', 'frontline_omi', 'Proses & Operasi', 'Log kalibrasi pompa dosing dan kurva pemulihan efisiensi termal.',
    'Dr. Rina Suryani', 'Kondisi Abnormal', 'Normal', NOW() - INTERVAL '1280 hours', NOW() - INTERVAL '1240 hours'
),
(
    'REP-016', 'Hunting Aliran Gas & Osilasi Positioner FCV-301', 'FCV-301', 'VERIFIED',
    'Control Valve FCV-301', 'Bukaan katup FCV-301 berosilasi terus menerus antara 45% sampai 62% tanpa perubahan setpoint.',
    'Tekanan jalur fuel gas 14,2 bar dengan setpoint kontrol tetap di 54%.',
    'Sinyal output positioner berfluktuasi akibat penyumbatan debu oli di spool valve I/P converter.',
    'Kontaminasi kabut oli pada udara instrumen menyumbat spool pilot smart positioner.',
    'Alihkan aliran ke bypass manual, bersihkan spool I/P converter, dan lakukan autotune positioner.',
    'Osilasi hilang sepenuhnya dan deviasi posisi terhadap setpoint stabil di bawah 0,4%.',
    'HIGH', 'Major', 'Likely', 'Hunting katup fuel gas memicu fluktuasi tekanan pembakaran boiler yang berpotensi menyebabkan trip.',
    'Pembersihan spool pilot I/P converter dan autotune ulang smart positioner.',
    'Ganti cartridge coalescing filter udara instrumen unit gas tiap 3 bulan.', '2026-11-06', 'Tim Instrumentasi',
    'Hunting bukaan katup FCV-301 berhasil diatasi dengan pembersihan spool valve dan autotune positioner.',
    'Dedi Kusnadi', 'frontline_omi', 'Instrumentasi & Kontrol', 'Grafik osilasi tren DCS sebelum dan sesudah autotune positioner.',
    'Dr. Rina Suryani', 'Kondisi Abnormal', 'Mendesak', NOW() - INTERVAL '430 hours', NOW() - INTERVAL '405 hours'
),
(
    'REP-017', 'Sticking Stem Packing & Respons Lambat Aktuator FCV-301', 'FCV-301', 'VERIFIED',
    'Control Valve FCV-301', 'Katup mengalami jeda 6 detik sebelum bergerak dan melompat mendadak melewati target bukaan.',
    'Tekanan udara instrumen 4,3 bar, suhu ambient 33 derajat C.',
    'Uji langkah bertahap menunjukkan histeresis tinggi sebesar 7% pada stem katup.',
    'Packing PTFE pada gland stem mengering dan mengeras sehingga menimbulkan static friction tinggi.',
    'Ganti set packing PTFE baru sesuai torsi pabrikan dan lumasi stem guide bushing.',
    'Uji step response menunjukkan histeresis turun di bawah 1% dengan gerak halus.',
    'MEDIUM', 'Moderate', 'Likely', 'Sticking stem memicu keterlambatan respon kontrol aliran saat perubahan beban cepat.',
    'Penggantian packing stem PTFE dan kalibrasi step response FCV-301.',
    'Lakukan partial stroke test terjadwal sebulan sekali untuk deteksi dini gesekan stem.', '2026-10-21', 'Tim Instrumentasi',
    'Masalah sticking stem pada FCV-301 selesai diperbaiki dengan penggantian packing PTFE.',
    'Dedi Kusnadi', 'frontline_omi', 'Instrumentasi & Kontrol', 'Kurva histeresis valve signature dan foto penggantian packing stem.',
    'Dr. Rina Suryani', 'Kondisi Abnormal', 'Normal', NOW() - INTERVAL '790 hours', NOW() - INTERVAL '760 hours'
),
(
    'REP-018', 'Penurunan Tekanan Filter Regulator Aktuator FCV-301', 'FCV-301', 'VERIFIED',
    'Control Valve FCV-301', 'Tekanan suplai aktuator anjlok ke 2,4 bar saat katup diperintahkan membuka cepat.',
    'Header udara instrumen 6,0 bar normal, tetapi output regulator lokal tidak stabil.',
    'Mangkuk filter regulator penuh kondensat air berkarat yang menyumbat elemen saringan.',
    'Akumulasi kondensat air di mangkuk filter regulator menyumbat aliran udara menuju aktuator.',
    'Kuras kondensat, ganti elemen filter regulator baru, dan uji ulang bukaan penuh.',
    'Tekanan keluar regulator stabil di 4,2 bar saat katup bergerak cepat 0 sampai 100%.',
    'HIGH', 'Major', 'Possible', 'Kehilangan tekanan udara aktuator dapat memaksa FCV-301 menutup total secara mendadak.',
    'Pengurasan mangkuk drain dan penggantian elemen filter regulator udara.',
    'Tambahkan jadwal blowdown manual air filter regulator pada patroli shift pagi.', '2026-10-08', 'Tim Instrumentasi',
    'Anjloknya tekanan suplai aktuator FCV-301 akibat filter tersumbat kondensat sudah diperbaiki.',
    'Dedi Kusnadi', 'frontline_omi', 'Instrumentasi & Kontrol', 'Foto kondensat mangkuk filter regulator dan log uji tekanan suplai 4,2 bar.',
    'Dr. Rina Suryani', 'Potensi Bahaya', 'Normal', NOW() - INTERVAL '1180 hours', NOW() - INTERVAL '1150 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 2. TAMBAH CATATAN AUDIT & VALIDASI UNTUK REP-011 s.d. REP-018
INSERT INTO public.case_comments (report_id, author_name, author_role, comment, is_revision_request, requested_evidence, created_at)
SELECT v.report_id, v.author_name, v.author_role::user_role, v.comment, FALSE, NULL, v.created_at
FROM (
    VALUES
    ('REP-011', 'Dr. Rina Suryani', 'hse_validator', 'Laser alignment sudah memenuhi toleransi 0,02 mm dan uji jalan 4 jam bebas rembesan. Disahkan.', NOW() - INTERVAL '615 hours'),
    ('REP-012', 'Ir. Agus Wijaya', 'dept_reviewer', 'Pipe strain pada jalur suction sudah dilepas; getaran axial turun stabil di 1,6 mm/s.', NOW() - INTERVAL '1095 hours'),
    ('REP-013', 'Dr. Rina Suryani', 'hse_validator', 'Hasil hydrojetting terverifikasi aman dan pressure drop E-201 kembali sesuai desain.', NOW() - INTERVAL '495 hours'),
    ('REP-014', 'Dr. Rina Suryani', 'hse_validator', 'Sertifikat uji tekan nitrogen 7 bar bersih tanpa kebocoran. Kasus disahkan ke Knowledge Base.', NOW() - INTERVAL '850 hours'),
    ('REP-015', 'Ir. Agus Wijaya', 'dept_reviewer', 'Check valve pompa dosing antifoulant sudah diganti; efisiensi termal E-201 pulih.', NOW() - INTERVAL '1245 hours'),
    ('REP-016', 'Dr. Rina Suryani', 'hse_validator', 'Tren osilasi DCS sudah rata setelah pembersihan spool I/P converter dan autotune.', NOW() - INTERVAL '405 hours'),
    ('REP-017', 'Dr. Rina Suryani', 'hse_validator', 'Kurva histeresis katup turun di bawah 1% setelah penggantian packing PTFE. Terverifikasi.', NOW() - INTERVAL '760 hours'),
    ('REP-018', 'Ir. Agus Wijaya', 'dept_reviewer', 'Kondensat pada filter regulator udara telah dikuras dan elemen baru terpasang stabil di 4,2 bar.', NOW() - INTERVAL '1155 hours')
) AS v(report_id, author_name, author_role, comment, created_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.case_comments c WHERE c.report_id = v.report_id AND c.comment = v.comment
)
ON CONFLICT DO NOTHING;

-- 3. TAMBAH BUKTI FISIK UNTUK REP-011 s.d. REP-018
INSERT INTO public.evidences (report_id, file_name, storage_path, mime_type, file_size_bytes, caption, uploaded_by, created_at)
SELECT v.report_id, v.file_name, v.storage_path, v.mime_type, v.file_size_bytes, v.caption, v.uploaded_by, v.created_at
FROM (
    VALUES
    ('REP-011', 'Laporan_Laser_Alignment_P101A.pdf', 'evidences/REP-011/laser_alignment.pdf', 'application/pdf', 310000, 'Laporan laser alignment kopling dan foto pemasangan cartridge seal baru P-101A.', 'Dedi Kusnadi', NOW() - INTERVAL '620 hours'),
    ('REP-012', 'Foto_Elastomer_Kopling_P101A.jpg', 'evidences/REP-012/coupling_wear.jpg', 'image/jpeg', 284000, 'Foto keausan elemen elastomer kopling dan pembacaan vibrasi axial pasca-perbaikan.', 'Dedi Kusnadi', NOW() - INTERVAL '1100 hours'),
    ('REP-013', 'Log_PressureDrop_Fouling_E201.pdf', 'evidences/REP-013/dp_fouling.pdf', 'application/pdf', 265000, 'Kurva penurunan pressure drop setelah hydrojetting 700 bar pada tube bundle E-201.', 'Dedi Kusnadi', NOW() - INTERVAL '500 hours'),
    ('REP-014', 'Sertifikat_UjiTekan_Nitrogen_E201.pdf', 'evidences/REP-014/nitrogen_test.pdf', 'application/pdf', 392000, 'Berita acara penggantian gasket spiral wound floating head dan uji tekan nitrogen 7 bar.', 'Ir. Agus Wijaya', NOW() - INTERVAL '860 hours'),
    ('REP-015', 'Log_Injeksi_Antifoulant_E201.png', 'evidences/REP-015/antifoulant_log.png', 'image/png', 218000, 'Grafik pemulihan efisiensi perpindahan panas setelah perbaikan check valve dosing.', 'Dedi Kusnadi', NOW() - INTERVAL '1250 hours'),
    ('REP-016', 'Tren_DCS_Hunting_Positioner_FCV301.png', 'evidences/REP-016/hunting_trend.png', 'image/png', 240000, 'Rekaman tren DCS osilasi bukaan katup FCV-301 sebelum dan sesudah autotune.', 'Dedi Kusnadi', NOW() - INTERVAL '410 hours'),
    ('REP-017', 'Valve_Signature_Hysteresis_FCV301.pdf', 'evidences/REP-017/valve_signature.pdf', 'application/pdf', 295000, 'Laporan kurva histeresis stem pasca penggantian packing PTFE FCV-301.', 'Ir. Agus Wijaya', NOW() - INTERVAL '770 hours'),
    ('REP-018', 'Foto_Filter_Regulator_FCV301.jpg', 'evidences/REP-018/filter_regulator.jpg', 'image/jpeg', 274000, 'Foto kondisi elemen filter regulator udara sebelum diganti dan pembacaan suplai 4,2 bar.', 'Dedi Kusnadi', NOW() - INTERVAL '1160 hours')
) AS v(report_id, file_name, storage_path, mime_type, file_size_bytes, caption, uploaded_by, created_at)
WHERE NOT EXISTS (
    SELECT 1 FROM public.evidences e WHERE e.report_id = v.report_id AND e.file_name = v.file_name
)
ON CONFLICT DO NOTHING;
