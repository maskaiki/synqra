import { AssetCategoryCode, AssetRenderType } from '@/types/synqra';

export const COMPANY_UMBRELLA = {
  unitCode: 'Unit 11 (CDU)',
  unitFullName: 'Unit 11 (CDU - Crude Distillation Unit)',
  refineryName: 'Refinery Unit (RU) PT Pertamina RU VI Balongan',
  fullTitle: 'Unit 11 (CDU - Crude Distillation Unit) · PT Pertamina RU VI Balongan',
  shortBadge: 'Unit 11 CDU · PT Pertamina RU VI Balongan',
  location: 'Balongan, Indramayu, Jawa Barat',
  capacityDesign: '150.000 BPSD (150 MBSD pasca-RDMP Phase 1)',
  totalTagCount: 66,
  totalPhysicalUnits: 89,
};

export interface EquipmentCategoryMeta {
  code: AssetCategoryCode;
  label: string;
  shortLabel: string;
  tagPrefixHint: string;
  renderType: AssetRenderType;
  tagCount: number;
  unitCount: number;
  summary: string;
}

export interface EquipmentShowcaseItem {
  renderType: AssetRenderType;
  categoryCode: AssetCategoryCode;
  label: string;
  tagHint: string;
  summary: string;
}

export const EQUIPMENT_TYPE_SHOWCASE: EquipmentShowcaseItem[] = [
  {
    renderType: 'column',
    categoryCode: 'C',
    label: 'Kolom Fraksinasi & Pre-Flash',
    tagHint: '11-C-101 · 11-C-106',
    summary: 'Main Fractionator 34 tray dan Pre-Flash Column RDMP 150.000 BPSD.',
  },
  {
    renderType: 'stripper',
    categoryCode: 'C',
    label: 'Side Stripper, Stabilizer & Splitter',
    tagHint: '11-C-102 s.d. 11-C-105',
    summary: 'LGO/HGO Stripper, Naphtha Stabilizer, dan Naphtha-Kerosene Splitter.',
  },
  {
    renderType: 'furnace',
    categoryCode: 'F',
    label: 'Furnace & Fired Heater',
    tagHint: '11-F-101',
    summary: 'Crude Charge Heater pemanas akhir umpan 340-360 C dan steam 350 C.',
  },
  {
    renderType: 'heat',
    categoryCode: 'E',
    label: 'Shell & Tube Heat Exchanger',
    tagHint: '11-E-101 s.d. 11-E-131',
    summary: 'Cold & Hot Preheat Train, Reboiler, dan Cooler produk berbasis bundel tube.',
  },
  {
    renderType: 'finfan',
    categoryCode: 'E',
    label: 'Fin-Fan Air Cooler',
    tagHint: '11-E-112, 114, 124, 125',
    summary: 'Kondensor overhead dan pendingin udara Naphtha, Kerosene, serta Gas Oil.',
  },
  {
    renderType: 'desalter',
    categoryCode: 'V',
    label: 'Electrostatic Desalter',
    tagHint: '11-V-101 A/B',
    summary: 'Desalter elektrostatik dua tingkat pengendali garam klorida & rag layer.',
  },
  {
    renderType: 'vessel',
    categoryCode: 'V',
    label: 'Drum, Separator & Clay Treater',
    tagHint: '11-V-102 s.d. 116 · Seal Pot',
    summary: 'Overhead Accumulator, Off-Gas KO Drum, Clay Treater, Vessel Kaustik & Reservoir.',
  },
  {
    renderType: 'pump',
    categoryCode: 'P',
    label: 'Pompa Proses & Pump-Around',
    tagHint: '11-P-101 s.d. 11-P-132',
    summary: 'Crude Charge Pump, TPA/MPA/BPA Pump, Refluks, Side Stripper & Pompa Produk.',
  },
  {
    renderType: 'valve',
    categoryCode: 'I',
    label: 'Instrumen & Control Valve',
    tagHint: '11-LV-030 · 11-FV-031..037',
    summary: 'Control Valve Level & Flow pada Stabilizer, Splitter, LGO, HGO High-TAN & Residu.',
  },
];

export const EQUIPMENT_CATEGORIES: EquipmentCategoryMeta[] = [
  {
    code: 'C',
    label: 'Kolom Distilasi & Stripper',
    shortLabel: 'Kolom (C)',
    tagPrefixHint: '11-C-101 s.d. 11-C-106',
    renderType: 'column',
    tagCount: 6,
    unitCount: 6,
    summary: 'Main Fractionator 34 tray, Pre-Flash RDMP, Side Stripper LGO/HGO, Stabilizer, dan Splitter.',
  },
  {
    code: 'F',
    label: 'Furnace & Fired Heater',
    shortLabel: 'Furnace (F)',
    tagPrefixHint: '11-F-101',
    renderType: 'furnace',
    tagCount: 1,
    unitCount: 1,
    summary: 'Crude Charge Heater pemanas akhir umpan ke 340-360 derajat C serta superheated steam 350 derajat C.',
  },
  {
    code: 'E',
    label: 'Heat Exchanger & Fin-Fan',
    shortLabel: 'Exchanger (E)',
    tagPrefixHint: '11-E-101 s.d. 11-E-131',
    renderType: 'heat',
    tagCount: 27,
    unitCount: 34,
    summary: 'Cold & Hot Preheat Train, Reboiler, Overhead Condenser, serta Fin-Fan Air Cooler produk.',
  },
  {
    code: 'V',
    label: 'Desalter, Vessel & Drum',
    shortLabel: 'Vessel (V)',
    tagPrefixHint: '11-V-101 s.d. 11-V-116',
    renderType: 'desalter',
    tagCount: 10,
    unitCount: 12,
    summary: 'Electrostatic Desalter 2 tingkat, Overhead Accumulator, KO Drum, Clay Treater, dan Seal Reservoir.',
  },
  {
    code: 'P',
    label: 'Pompa Proses & Pump-Around',
    shortLabel: 'Pompa (P)',
    tagPrefixHint: '11-P-101 s.d. 11-P-132',
    renderType: 'pump',
    tagCount: 17,
    unitCount: 31,
    summary: 'Crude Charge Pump, Desalted Crude, Top/Middle/Bottom Pump-Around, Side Stripper, dan Produk.',
  },
  {
    code: 'I',
    label: 'Instrumen & Control Valve',
    shortLabel: 'Instrumen (LV/FV)',
    tagPrefixHint: '11-LV-030, 11-FV-031..037',
    renderType: 'valve',
    tagCount: 5,
    unitCount: 5,
    summary: 'Level & Flow Control Valve pada jalur Stabilizer, Splitter, LGO, HGO (High-TAN), dan Residue.',
  },
];

export interface SystemicPatternRule {
  id: string;
  title: string;
  severity: 'KRITIS' | 'WASPADA';
  primaryAssetId: string;
  affectedTags: string[];
  relatedCaseIds: string[];
  mechanismSummary: string;
  recommendedAction: string;
  literatureCodes: string[];
}

export const CDU11_SYSTEMIC_PATTERNS: SystemicPatternRule[] = [
  {
    id: 'pat-overhead-hcl-nh4cl',
    title: 'Rantai Garam Klorida Desalter ke Korosi HCl & Deposit NH4Cl Overhead',
    severity: 'KRITIS',
    primaryAssetId: '11-C-101',
    affectedTags: ['11-V-101 A/B', '11-E-105 A/B', '11-C-101', '11-E-104', '11-P-104', '11-E-114', '11-V-102', '11-E-131', '11-V-116'],
    relatedCaseIds: ['CDU11-V01', 'CDU11-E06', 'CDU11-C02', 'CDU11-E05', 'CDU11-P06', 'CDU11-E16', 'CDU11-V03', 'CDU11-E15', 'CDU11-V02'],
    mechanismSummary:
      'Penurunan suhu inlet desalter (< 150 derajat C dari 11-E-105) dan gangguan emulsi 11-V-101 meloloskan garam MgCl2/CaCl2 yang terhidrolisis di 11-F-101 menjadi HCl, memicu endapan salmiak NH4Cl dan korosi titik embun asam pada tray atas 11-C-101, sirkuit TPA (11-P-104/11-E-104), kondensor 11-E-114/131, serta boot 11-V-102/116.',
    recommendedAction:
      'Pulihkan suhu desalter 150-155 derajat C, jaga efisiensi desalting (garam keluar <= 30 PTB), kontrol pH sour water overhead 5,5-6,5 dengan filming/neutralizing amine, dan evaluasi water wash berkala.',
    literatureCodes: ['PE25', 'AH21', 'CH22', 'OR24', 'JP26', 'RA22'],
  },
  {
    id: 'pat-high-tan-nac',
    title: 'Korosi Asam Naftenat (NAC) pada Sirkuit Fraksi Panas Ber-TAN Tinggi',
    severity: 'KRITIS',
    primaryAssetId: '11-FV-031',
    affectedTags: ['11-C-103', '11-E-109', '11-FV-031', '11-P-108 A/B'],
    relatedCaseIds: ['CDU11-C04', 'CDU11-E12', 'CDU11-I04', 'CDU11-P16'],
    mechanismSummary:
      'Pengolahan crude asam dengan TAN HGO 1,10-1,65 mg KOH/g dan residu 1,00-1,24 mg KOH/g pada suhu > 220-350 derajat C serta turbulensi tinggi memicu penipisan beralur (grooving NAC) di HGO Stripper 11-C-103, nozzle BPA 11-E-109, elbow hilir 11-FV-031, dan coking seal 11-P-108.',
    recommendedAction:
      'Pantau laju penipisan dengan probe UT online (ambang High > 0,254 mm/tahun), batasi TAN campuran crude <= 1,5 mg KOH/g via blending, dan upgrade metalurgi jalur turbulen ke SS 316L/317L Mo >= 2,5%.',
    literatureCodes: ['PE25', 'CI24', 'AM26'],
  },
  {
    id: 'pat-preheat-fouling-energy',
    title: 'Fouling Beruntun Cold & Hot Preheat Train Menaikkan Beban Furnace 11-F-101',
    severity: 'KRITIS',
    primaryAssetId: '11-E-107 A/B',
    affectedTags: ['11-E-102', '11-E-103 A/B', '11-E-105 A/B', '11-E-106 A/B', '11-E-107 A/B', '11-E-110 A/B', '11-E-111 A/B', '11-F-101'],
    relatedCaseIds: ['CDU11-E03', 'CDU11-E04', 'CDU11-E06', 'CDU11-E09', 'CDU11-E10', 'CDU11-E13', 'CDU11-E14', 'CDU11-F01'],
    mechanismSummary:
      'Kenaikan faktor pengotor (Rd) terutama pada Hot Preheat di atas garis pinch (11-E-106 s.d. 11-E-111) menurunkan suhu masuk furnace dari target 276,7 derajat C, memaksa kenaikan firing fuel gas 11-F-101 yang mempercepat coking internal radiant tube.',
    recommendedAction:
      'Jadwalkan hydrojetting bergantian saat efisiensi HE mendekati batas aksi 80% (acuan 11-E-107), uji kompatibilitas aspalten sebelum ganti crude blend, dan optimalkan dosis antifoulant.',
    literatureCodes: ['AL24', 'YU21', 'GU24', 'AB23', 'DU26'],
  },
  {
    id: 'pat-stabilizer-wet-h2s',
    title: 'Degradasi Wet H2S, Blistering/HIC & Garam NH4HS di Seksi Stabilizer',
    severity: 'KRITIS',
    primaryAssetId: '11-V-104',
    affectedTags: ['11-C-104', '11-E-119', '11-E-121', '11-V-104'],
    relatedCaseIds: ['CDU11-C05', 'CDU11-E17', 'CDU11-E18', 'CDU11-V05'],
    mechanismSummary:
      'Akumulasi H2S fasa air (>= 50 ppm pada < 150 derajat C) dan konsentrasi NH4HS (> 2 wt%) di sirkuit Stabilizer memicu endapan FeS di 11-E-119, kenaikan DP 11-C-104/11-E-121, serta indikasi retak HIC/SOHIC dekat water boot drum 11-V-104.',
    recommendedAction:
      'Lakukan inspeksi AUT/PAUT untuk evaluasi Fitness-for-Service API 579 pada 11-V-104, jaga kecepatan aliran < 20 ft/s, dan kendalikan kadar H2S/NH3 air kondensat.',
    literatureCodes: ['PE25', 'AM26', 'OR22', 'KO25'],
  },
  {
    id: 'pat-furnace-fuelgas-carryover',
    title: 'Carryover Kondensat KO Drum 11-V-103 ke Fouling Burner & Hot Spot 11-F-101',
    severity: 'WASPADA',
    primaryAssetId: '11-F-101',
    affectedTags: ['11-V-103', '11-F-101'],
    relatedCaseIds: ['CDU11-V04', 'CDU11-F01'],
    mechanismSummary:
      'Level tinggi pada Off-Gas KO Drum 11-V-103 membawa aerosol hidrokarbon ke jalur fuel gas, menyumbat gas tip burner dan membuat distribusi nyala tidak merata sehingga memperparah hot spot TMT radiant pass 3 di 11-F-101.',
    recommendedAction:
      'Jaga suhu fuel gas > 50 derajat C (120 derajat F) agar aerosol tidak mengembun, bersihkan gas tip burner terjadwal, dan pantau TMT dengan termografi IR terkoreksi emisivitas (0,82).',
    literatureCodes: ['PL23', 'MA22', 'DU26', 'JA22'],
  },
  {
    id: 'pat-kerosene-quality-chain',
    title: 'Rantai Mutu Kerosene (Warna Saybolt, Air Bebas & Kejenuhan Clay Treater)',
    severity: 'WASPADA',
    primaryAssetId: '11-V-113 A/B',
    affectedTags: ['11-C-105', '11-E-122', '11-E-118', '11-E-125', '11-E-127', '11-V-113 A/B'],
    relatedCaseIds: ['CDU11-C06', 'CDU11-E20', 'CDU11-E24', 'CDU11-E25', 'CDU11-E26', 'CDU11-V07'],
    mechanismSummary:
      'Rembesan mikro reboiler 11-E-122, suhu keluar cooler 11-E-118/125 yang tinggi, dan kebocoran air pendingin di 11-E-127 menurunkan warna Saybolt serta mempercepat kejenuhan bed adsorben 11-V-113 A/B.',
    recommendedAction:
      'Uji tekan tube bundle 11-E-122 & 11-E-127, jaga suhu masuk clay treater sesuai desain lewat pembersihan 11-E-118, dan pantau DP bed 11-V-113 A/B.',
    literatureCodes: ['AR23', 'YA25', 'AM26'],
  },
  {
    id: 'pat-seal-flush-integrity',
    title: 'Degradasi Mechanical Seal, Steam Quench & Seal Pot Reservoir Pompa CDU',
    severity: 'WASPADA',
    primaryAssetId: '11-P-106',
    affectedTags: ['11-P-126 A/B', '11-P-106', '11-P-131 A/B', '11-P-112 C/D', '11-P-108 A/B', '11-P-112-B-V1'],
    relatedCaseIds: ['CDU11-P04', 'CDU11-P08', 'CDU11-P13', 'CDU11-P14', 'CDU11-P16', 'CDU11-V10'],
    mechanismSummary:
      'Penyumbatan strainer flushing Plan 11, kegagalan katup steam quench, dan kebocoran buffer fluid di seal pot menyebabkan overheating permukaan seat seal, coking atmosferik, serta emisi uap hidrokarbon/H2S.',
    recommendedAction:
      'Terapkan standar verifikasi seal RU VI Balongan (laser alignment, uji vibrasi ISO 10816-3, observasi kebocoran 30-60 menit) serta inspeksi strainer flush dan level seal pot per shift.',
    literatureCodes: ['PN25', 'TM26', 'FI25'],
  },
  {
    id: 'pat-control-valve-stiction-erosion',
    title: 'Stiction, Histeresis & Kavitasi-Erosi pada Control Valve Seksi Fraksinasi',
    severity: 'WASPADA',
    primaryAssetId: '11-LV-030',
    affectedTags: ['11-LV-030', '11-FV-037', '11-FV-032', '11-FV-031', '11-FV-033'],
    relatedCaseIds: ['CDU11-I01', 'CDU11-I02', 'CDU11-I03', 'CDU11-I04', 'CDU11-I05'],
    mechanismSummary:
      'Operasi bukaan kecil (10-20%) dengan pressure drop tinggi memicu kavitasi-erosi eksentrik di 11-LV-030, sedangkan endapan kokas dan gesekan packing memicu pola slip-jump (stiction) pada 11-FV-037 dan 11-FV-033.',
    recommendedAction:
      'Gunakan diagnostik plot OP-PV DCS untuk mendeteksi stiction lebih awal, hindari operasi throttling berkelanjutan < 20% bukaan, dan pasang anti-cavitation trim.',
    literatureCodes: ['JI25', 'SH23', 'PE25'],
  },
  {
    id: 'pat-cooling-water-mic',
    title: 'Fouling Skala CaCO3 & Korosi MIC Sisi Air Pendingin (Cooling Water)',
    severity: 'WASPADA',
    primaryAssetId: '11-E-126',
    affectedTags: ['11-E-123 A/B', '11-E-126', '11-E-118 A/B', '11-E-127'],
    relatedCaseIds: ['CDU11-E21', 'CDU11-E23', 'CDU11-E24', 'CDU11-E26'],
    mechanismSummary:
      'Laju aliran air pendingin yang lambat atau kenaikan suhu air balik memicu endapan kerak CaCO3 (aragonit) dan korosi mikrobiologis (MIC) di sisi tube cooler 11-E-123, 11-E-126, 11-E-118, dan 11-E-127 hingga menimbulkan pinhole bocor silang antara fluida proses dan basin cooling tower.',
    recommendedAction:
      'Jaga kecepatan aliran air pendingin > 1,5 m/s, lakukan injeksi biosida serta inhibitor kerak sesuai parameter kimia basin, dan jadwalkan backwash / uji tekan tube bundle secara berkala.',
    literatureCodes: ['AR23', 'AM26'],
  },
];

export interface LiteratureReference {
  code: string;
  citation: string;
  year: number;
  category: string;
  doiOrUrl: string;
  keyFindings: string;
  isBalonganSpecific?: boolean;
}

export const LITERATURE_DATABASE: Record<string, LiteratureReference> = {
  PE25: {
    code: 'PE25',
    citation: 'Permana, M. S., Soeweify, M. P., Nugroho, B., Yusupandi, F., Devianto, H., & Prakoso, A. D. (2025). Innovation in Inspection Planning Using CAIS to Prevent Stationary Equipment Failure in CDU. Scientific Contributions Oil & Gas (LEMIGAS), 48(3), 203-214.',
    year: 2025,
    category: 'Jurnal LEMIGAS · CDU RU VI Balongan',
    doiOrUrl: 'https://doi.org/10.29017/scog.v48i3.1848',
    keyFindings: 'Memetakan 9 mekanisme korosi API 571/581 di CDU RU VI Balongan; TAN HGO 1,10-1,65 dan residu 1,00-1,24 mg KOH/g; ambang laju korosi CAIS Low < 0,05, Moderate 0,05-0,51, High 0,51-1,27, Severe > 1,27 mm/tahun; titik sampling kritis 11-FV-031, 11-V-102, 11-V-104, 11-E-128 A/B.',
    isBalonganSpecific: true,
  },
  AL24: {
    code: 'AL24',
    citation: 'Alhanif, M., Frastia, W., Kamil, M. I., Kumoro, A. C., Yusupandi, F., dkk. (2024). Evaluasi Kinerja Alat Penukar Panas 11-E-107 pada Unit Distilasi Minyak Mentah (CDU). Distilat: Jurnal Teknologi Separasi, 10(2), 382-392.',
    year: 2024,
    category: 'Jurnal · Hot Preheater 11-E-107 CDU Balongan',
    doiOrUrl: 'https://doi.org/10.33795/distilat.v10i2.4713',
    keyFindings: 'Evaluasi aktual 11-E-107 Unit 11 CDU Balongan (Juni 2023): efisiensi desain 94,3% vs aktual 87,6-91,5%, dengan batas tindakan pembersihan (cleaning action limit) saat efisiensi turun < 80%.',
    isBalonganSpecific: true,
  },
  PN25: {
    code: 'PN25',
    citation: 'Prasetya, E. A. (2025). Analisis Kebocoran dan Tahapan Penggantian Mechanical Seal pada Pompa di PT KPI RU VI Balongan. Politeknik Negeri Jakarta.',
    year: 2025,
    category: 'Studi Lapangan · Mechanical Seal RU VI Balongan',
    doiOrUrl: 'https://repository.pnj.ac.id/25731/',
    keyFindings: 'Standar verifikasi pasca-perbaikan mechanical seal pompa proses di RU VI Balongan mencakup laser alignment kopling, pengukuran vibrasi, dan uji observasi kebocoran 30-60 menit.',
    isBalonganSpecific: true,
  },
  RDMP22: {
    code: 'RDMP22',
    citation: 'Kementerian ESDM & PT KPI RU VI Balongan (2022). Proyek Strategis Nasional RDMP RU VI Balongan Phase 1: Revamping Unit 11 CDU & Instalasi Pre-Flash Column 11-C-106.',
    year: 2022,
    category: 'Dokumentasi Rekayasa · RDMP Unit 11 Balongan',
    doiOrUrl: 'https://migas.esdm.go.id/',
    keyFindings: 'Peningkatan kapasitas Unit 11 CDU Balongan dari 125 MBSD ke 150 MBSD dan naphtha dari 5,29 ke 11,6 MBSD melalui penambahan Pre-Flash Column 11-C-106 (33,56 m x 5,14 m, 72 ton, fabrikasi PT BBI) dan Condenser Drum 11-V-116.',
    isBalonganSpecific: true,
  },
  MB17: {
    code: 'MB17',
    citation: 'Musyarofah, S., Ibrahim, P. A., & Putra, A. B. (2017). Analisa Kinerja Desalter pada Crude Distillation Unit. Jurnal Migasian AKAMIGAS Balongan, 1(2).',
    year: 2017,
    category: 'Jurnal · Desalter Unit 11 CDU Balongan',
    doiOrUrl: 'https://jurnal.akamigasbalongan.ac.id/',
    keyFindings: 'Analisis efisiensi penghilangan garam dan sedimen pada Electrostatic Desalter 11-V-101 A/B CDU Balongan (~150 derajat C, 8 kg/cm2g) untuk mencegah korosi HCl di perpipaan overhead dan fouling preheater.',
    isBalonganSpecific: true,
  },
  YP11: {
    code: 'YP11',
    citation: 'Perdana, Y. (2011). Studi Perancangan Kontrol Prediktif (MPC) pada Kolom Distilasi di Crude Distillation Unit PT Pertamina RU VI Balongan. Jurnal Otomasi Kontrol & Instrumentasi ITB, 2(2), 105.',
    year: 2011,
    category: 'Jurnal ITB · Kontrol Kolom 11-C-101 Balongan',
    doiOrUrl: 'https://journals.itb.ac.id/index.php/joki/',
    keyFindings: 'Pemodelan interaksi multi-variabel suhu top dan side-stream (kerosene, LGO, HGO) serta sirkuit pump-around (11-P-104/105/106) pada Main Fractionator 11-C-101 (34 tray, umpan tray 31).',
    isBalonganSpecific: true,
  },
  GU24: {
    code: 'GU24',
    citation: 'Gusniawan, P. V., Aldillah, A. Z., & Rulianah, S. (2024). Evaluasi Performa Heat Exchanger 11E-25 CDU I PT Pertamina RU IV Cilacap. Distilat, 10(2), 463-475.',
    year: 2024,
    category: 'Jurnal Pembanding Kilang Pertamina',
    doiOrUrl: 'https://doi.org/10.33795/distilat.v10i2.5065',
    keyFindings: 'Kenaikan Rd aktual shell/tube jauh di atas batas desain TEMA menjadi indikator utama penjadwalan cleaning bundle.',
  },
  YU21: {
    code: 'YU21',
    citation: 'Yusoff, N. I. M., dkk. (2021). Pinch Analysis Application for Fouled CDU and CFU of a Refinery. Chemical Engineering Transactions, 88, 163-168.',
    year: 2021,
    category: 'Jurnal · Pinch & Fouling Preheat Train',
    doiOrUrl: 'https://doi.org/10.3303/CET2188027',
    keyFindings: 'Exchanger di ujung panas (di atas titik pinch) mengalami laju fouling terberat dan pembersihan terarah mampu menghemat energi bahan bakar furnace 7-10%.',
  },
  JP26: {
    code: 'JP26',
    citation: 'Santoso, J., & Silviana, S. (2026). Optimalisasi Desalter Dua Tahap Kilang Pertamina. JPII Undip, 4(2), 100-107.',
    year: 2026,
    category: 'Jurnal · Operasi Desalter Kilang Pertamina',
    doiOrUrl: 'https://doi.org/10.14710/jpii.2026.32340',
    keyFindings: 'Parameter optimum desalter: wash water 2-5%, DP mixing valve 0,1-0,4 kg/cm2, pH wash water 7,5-9,0 (pH > 10 memicu emulsi stabil), oil content effluent < 500 ppm, demulsifier ~5 ppmv.',
  },
  RA22: {
    code: 'RA22',
    citation: 'Ramirez-Argaez, M. A., dkk. (2022). Numerical Study of Electrostatic Desalting. Processes, 10(10), 2118.',
    year: 2022,
    category: 'Jurnal CC BY 4.0 · Electrostatic Desalter',
    doiOrUrl: 'https://doi.org/10.3390/pr10102118',
    keyFindings: 'Penurunan viskositas melalui suhu operasi optimal (~150 derajat C) dan kestabilan medan listrik trafo sangat menentukan efisiensi koalesensi tetesan air-garam.',
  },
  AH21: {
    code: 'AH21',
    citation: 'Ahmed, A. A. (2021). Corrosion in Crude Oil Distillation Unit Overhead: A Recent Case Study. ARO Journal, 9(1), 21-27.',
    year: 2021,
    category: 'Jurnal CC BY · Korosi Overhead CDU',
    doiOrUrl: 'https://doi.org/10.14500/aro.10711',
    keyFindings: 'Garam umpan > 30 PTB pasca-desalter memicu deposit NH4Cl putih di tray atas, menurunkan pH lokal dari 7 ke 4,5 hingga melubangi tray 24/28 dan menyumbat draw nozzle kerosene.',
  },
  CH22: {
    code: 'CH22',
    citation: 'Chis, T., Sterpu, A. E., & Sapunaru, O. V. (2022). The Effect of Corrosion on Crude Oil Distillation Plants. ChemEngineering, 6(3), 41.',
    year: 2022,
    category: 'Jurnal CC BY · Korosi Puncak Kolom & Reflux Drum',
    doiOrUrl: 'https://doi.org/10.3390/chemengineering6030041',
    keyFindings: 'Hidrolisis MgCl2/CaCl2 menghasilkan HCl yang mengorosi pipa overhead dan reflux drum (laju 0,19-0,28 mm/tahun, Fe terlarut hingga 34,3 ppm).',
  },
  OR24: {
    code: 'OR24',
    citation: 'Orlikowski, J., dkk. (2024). Corrosion Monitoring in Petroleum Installations. Materials, 17(11), 2663.',
    year: 2024,
    category: 'Jurnal CC BY 3.0 · Monitoring UT & ER Overhead',
    doiOrUrl: 'https://doi.org/10.3390/ma17112663',
    keyFindings: 'Kombinasi probe Electrical Resistance (ER) dan Ultrasonic Testing (UT) efektif mendeteksi korosi titik embun asam dan under-deposit NH4Cl dalam 28 hari.',
  },
  OR22: {
    code: 'OR22',
    citation: 'Orlikowski, J., dkk. (2022). Effect of Wet Hydrogen Sulfide on Carbon Steels Degradation in Refinery. Arabian J. Sci. Eng., 48, 9171-9178.',
    year: 2022,
    category: 'Jurnal CC BY 4.0 · Degradasi Wet H2S',
    doiOrUrl: 'https://doi.org/10.1007/s13369-022-07154-0',
    keyFindings: 'Paparan H2S basah memicu difusi atom hidrogen ke dalam baja karbon kilang dan menurunkan ketangguhan mekanik.',
  },
  KO25: {
    code: 'KO25',
    citation: 'Kourousis, D., Papasalouros, D., & Anastasopoulos, A. (2025). Early Detection and Monitoring of HIC in Oil and Gas Vessels. Eng. Proc., 119(1), 22.',
    year: 2025,
    category: 'Prosiding CC BY 4.0 · Inspeksi AUT/PAUT HIC',
    doiOrUrl: 'https://doi.org/10.3390/engproc2025119022',
    keyFindings: 'AUT C-scan digunakan untuk screening blistering/HIC, sedangkan PAUT mengukur dimensi retak stepwise sebagai input Fitness-for-Service API 579.',
  },
  CI24: {
    code: 'CI24',
    citation: 'Chiofalo, G., dkk. (2024). Monitoring and Management of Naphthenic Acid Corrosion in Distillation Units. Chemical Engineering Transactions, 111, 103-108.',
    year: 2024,
    category: 'Jurnal · Manajemen Korosi Asam Naftenat (NAC)',
    doiOrUrl: 'https://doi.org/10.3303/CET24111018',
    keyFindings: 'NAC aktif pada 200-350 derajat C; kategori laju korosi probe UT: Low < 0,13, Moderate 0,13-0,254, High > 0,254 mm/tahun; batas aman TAN campuran <= 1,5 mg KOH/g.',
  },
  AM26: {
    code: 'AM26',
    citation: 'Almubarak, T., dkk. (2026). Refinery Corrosion: Challenges and Mitigation Methods. IntechOpen.',
    year: 2026,
    category: 'Referensi Komprehensif CC BY 4.0 · Korosi Kilang',
    doiOrUrl: 'https://doi.org/10.5772/intechopen.1016854',
    keyFindings: 'Ambang kritis korosi kilang: NAC (> 250 derajat C, TAN > 0,5), Wet H2S (>= 50 ppm, < 150 derajat C), NH4HS (> 2 wt%, kecepatan > 20 ft/s), Caustic Cracking (> 83 derajat C), CUI (50-175 derajat C), dan MIC pada aliran air pendingin lambat.',
  },
  DU26: {
    code: 'DU26',
    citation: 'Du, M., dkk. (2026). Numerical Simulation of Heat-Transfer Characteristics of Furnace Coil Under Coking Conditions. Processes, 14, 1722.',
    year: 2026,
    category: 'Jurnal CC BY · Coking & TMT Furnace',
    doiOrUrl: 'https://doi.org/10.3390/pr14111722',
    keyFindings: 'Lapisan kokas internal 1,25 mm menaikkan Tube Metal Temperature (TMT) > 100 derajat C dan kokas 5 mm mendorong suhu dinding ke 572 derajat C serta memangkas serapan panas 53%.',
  },
  MA22: {
    code: 'MA22',
    citation: 'Martinez, I., dkk. (2022). Error Analysis in Radiation Thermometry with Application to Industrial Furnaces. Measurement / arXiv:2201.04069.',
    year: 2022,
    category: 'Jurnal · Termografi IR Tube Furnace',
    doiOrUrl: 'https://doi.org/10.1016/j.measurement.2021.110646',
    keyFindings: 'Inspeksi IR peephole tube furnace wajib mengoreksi emisivitas (nominal 0,82) dan pantulan dinding ruang bakar agar tidak meleset -50 s.d. +60 derajat C.',
  },
  ZH23: {
    code: 'ZH23',
    citation: 'Zhu, Y., dkk. (2023). Monitoring the Cavitation State of Centrifugal Pumps. Water, 16(1), 52.',
    year: 2023,
    category: 'Jurnal CC BY · Kavitasi Pompa Sentrifugal',
    doiOrUrl: 'https://doi.org/10.3390/w16010052',
    keyFindings: 'Kavitasi ditandai penurunan head >= 3%, lonjakan vibrasi pita lebar frekuensi tinggi, bising kerikil, dan erosi pitting pada mata sudu impeller.',
  },
  TM26: {
    code: 'TM26',
    citation: 'Heel, D., dkk. (2026). Tribological and Thermal Analysis of Mechanical Seals Toward Condition Monitoring. Technische Mechanik, 46(1), 136-148.',
    year: 2026,
    category: 'Jurnal Diamond OA · Termal Mechanical Seal',
    doiOrUrl: 'https://doi.org/10.24352/UB.OVGU-2026-014',
    keyFindings: 'Kenaikan delta-T pada stationary seat dan minimnya aliran seal flush menandai gesekan kering dini sebelum kegagalan bocor besar.',
  },
  ST25: {
    code: 'ST25',
    citation: 'Stefanus, M., dkk. (2025). Gamma Transmission Technique to Inspect Trays Condition of Distillation Column. Atlantis Press (ICST 2024).',
    year: 2025,
    category: 'Prosiding OA · Gamma Scan Kolom Distilasi Indonesia',
    doiOrUrl: 'https://doi.org/10.2991/978-94-6463-772-4_48',
    keyFindings: 'Pemindaian transmisi gamma Co-60 langkah 50 mm secara online mampu membedakan tray runtuh/hilang dari fenomena flooding cairan tanpa mematikan kolom.',
  },
  FI25: {
    code: 'FI25',
    citation: 'Fitrian, A. B., & Kundori (2025). Analisis Kondisi Pompa Sentrifugal Berdasarkan Getaran di Kilang Migas. Jurnal Maritim Polimarin, 11(1), 1-5.',
    year: 2025,
    category: 'Jurnal · Vibrasi Pompa Kilang ISO 10816-3',
    doiOrUrl: 'https://doi.org/10.52492/jmp.v11i1.127',
    keyFindings: ' Evaluasi RMS vibrasi DE/NDE arah horizontal, vertikal, dan aksial menurut standar ISO 10816-3 untuk penentuan intervensi overhaul bearing & alignment.',
  },
  SH23: {
    code: 'SH23',
    citation: 'Shang, L., Zhang, Y., & Zhang, H. (2023). Valve Stiction Detection Method Based on Dynamic SFA and Hurst Exponent. Processes, 11(7), 1913.',
    year: 2023,
    category: 'Jurnal CC BY · Stiction Control Valve',
    doiOrUrl: 'https://doi.org/10.3390/pr11071913',
    keyFindings: ' Sekitar 20-30% osilasi loop kontrol proses disebabkan valve stiction (pola elips/gergaji slip-jump pada plot OP terhadap PV).',
  },
  JI25: {
    code: 'JI25',
    citation: 'Jin, H., dkk. (2025). Influence of Spool Structure on Flow and Damage Characteristics of Control Valves. Fluids, 10(4), 99.',
    year: 2025,
    category: 'Jurnal CC BY · Erosi & Kavitasi Control Valve',
    doiOrUrl: 'https://doi.org/10.3390/fluids10040099',
    keyFindings: 'Penurunan tekanan ekstrem pada bukaan kecil menimbulkan jet eksentrik, pitting kavitasi di kepala plug/seat, dan erosi dinding satu sisi.',
  },
  CA22: {
    code: 'CA22',
    citation: 'Cao, Q., dkk. (2022). A Review of Corrosion Under Insulation (CUI) in the Oil and Gas Industry. Metals, 12(4), 561.',
    year: 2022,
    category: 'Jurnal CC BY 4.0 · Corrosion Under Insulation',
    doiOrUrl: 'https://doi.org/10.3390/met12040561',
    keyFindings: 'Zona paling rawan CUI baja karbon berada pada 50-175 derajat C (API RP 583); deteksi dini efektif menggunakan termografi IR siang/malam untuk memetakan insulasi basah.',
  },
  AR23: {
    code: 'AR23',
    citation: 'Ardy, H., Albatros, T., & Sumboja, A. (2023). Failure Analysis of Heat Exchanger Tubes with Cooling Medium. Metals, 13(7), 1182.',
    year: 2023,
    category: 'Jurnal ITB CC BY 4.0 · Kegagalan Tube & MIC Exchanger',
    doiOrUrl: 'https://doi.org/10.3390/met13071182',
    keyFindings: 'Studi peneliti ITB atas kebocoran tube heat exchanger akibat skala CaCO3 (aragonit/dolomit) dan crevice corrosion yang diperparah bakteri MIC pada aliran lambat.',
  },
  EL22: {
    code: 'EL22',
    citation: 'Elkatory, M. R., dkk. (2022). Mitigation of Waxy Crude Oils Deposition. Polymers, 14(16), 3231.',
    year: 2022,
    category: 'Jurnal CC BY 4.0 · Deposisi Wax Minyak Parafinik',
    doiOrUrl: 'https://doi.org/10.3390/polym14163231',
    keyFindings: 'Pendinginan di bawah Wax Appearance Temperature (WAT) pada minyak parafinik (seperti Minas/Duri) mengendapkan kristal parafin di dinding cooler dan menaikkan pressure drop.',
  },
  YA25: {
    code: 'YA25',
    citation: 'Yang, Y., dkk. (2025). Performance Prediction of Fouled Spiral Fin-Tube Heat Exchanger. Modelling, 6(4), 138.',
    year: 2025,
    category: 'Jurnal CC BY · Fouling Debu Fin-Fan Air Cooler',
    doiOrUrl: 'https://doi.org/10.3390/modelling6040138',
    keyFindings: 'Akumulasi partikel debu paling tebal terjadi di sisi udara masuk baris tube terbawah fin-fan, menurunkan bilangan Nusselt dan kapasitas pendinginan siang hari.',
  },
  HO22: {
    code: 'HO22',
    citation: 'Hou, X., dkk. (2022). Root Cause Failure Analysis of Deep-Groove Ball Bearing. Applied Sciences, 12(19), 9658.',
    year: 2022,
    category: 'Jurnal CC BY · Spalling & Misalignment Bearing',
    doiOrUrl: 'https://doi.org/10.3390/app12199658',
    keyFindings: 'Ketidaksejajaran dudukan memicu beban aksial asimetris yang mengawali fatigue spalling pada raceway bearing (terdeteksi lewat frekuensi BPFO/BPFI).',
  },
  KH23: {
    code: 'KH23',
    citation: 'Khan, K. A., & Ahmed, I. (2023). Performance Analysis of Gasketed Bolted Flange Joints. JMES, 17(3), 9564-9575.',
    year: 2023,
    category: 'Jurnal OA · Relaksasi Baut & Gasket Spiral Wound',
    doiOrUrl: 'https://doi.org/10.15282/jmes.17.3.2023.3.0757',
    keyFindings: 'Tegangan duduk gasket spiral wound turun 20-30% pada pemanasan 200-300 derajat C; ketidakseragaman torsi baut memicu rembesan saat start-up.',
  },
  PL23: {
    code: 'PL23',
    citation: 'Platvoet, E. (2023). Fouling in Fired Heaters: Burner Fouling. Digital Refining.',
    year: 2023,
    category: 'Referensi Rekayasa · Burner Tip Fouling Furnace',
    doiOrUrl: 'https://www.digitalrefining.com/',
    keyFindings: 'Kondensat hidrokarbon berat di fuel gas menyumbat gas tip burner, memicu flame impingement dan hot spot lokal pada radiant coil.',
  },
};

export const CDU11_ENGINEERING_BRIEF = `KONTEKS REKAYASA UNIT 11 (CDU) PT PERTAMINA RU VI BALONGAN:
- Unit 11 adalah Crude Distillation Unit (CDU) di PT Pertamina RU VI Balongan (Indramayu), mengolah campuran minyak mentah domestik (Duri, Minas, Jatibarang) dan impor dengan kapasitas 150.000 BPSD (150 MBSD pasca-revamping RDMP Phase 1 tahun 2021-2022 yang menambahkan Pre-Flash Column 11-C-106 & Drum 11-V-116).
- Alur Proses Utama: Pompa umpan 11-P-101 A/B (748.330 kg/jam, 47,8 C) -> Cold Preheat Train (11-E-129, 11-E-101 s.d. 11-E-105 A/B hingga 155,1 C) -> Electrostatic Desalter 2 tingkat 11-V-101 A/B (~150 C, 8 kg/cm2g) -> Pompa Desalted Crude 11-P-102 A/B -> Pre-Flash Column 11-C-106 -> Hot Preheat Train (11-E-106 A/B s.d. 11-E-111 A/B hingga 276,7 C; batas aksi cleaning efisiensi < 80% sesuai studi 11-E-107 AL24) -> Crude Charge Furnace 11-F-101 (keluar 340-360 C, bahan bakar off-gas 11-V-103, juga memanaskan steam stripping 350 C) -> Main Fractionator 11-C-101 (34 tray, umpan masuk tray 31).
- Sirkuit Pump-Around & Produk: Top Pump-Around (tray 5 -> 11-P-104 -> 11-E-104), Middle Pump-Around (tray 15 -> 11-P-105 -> 11-E-122 -> 11-E-106), Bottom Pump-Around (tray 25 -> 11-P-106 -> 11-E-120 -> 11-E-109); Side Stripper LGO 11-C-102 (81.930 kg/jam, valve 11-FV-032) & HGO 11-C-103 (45.720 kg/jam, valve 11-FV-031); Overhead 11-C-101 -> Fin-Fan 11-E-114 -> Accumulator 11-V-102; Naphtha Stabilizer 11-C-104 (umpan 63.600 kg/jam via 11-E-119, reboiler 11-E-120, drum 11-V-104, valve 11-LV-030); Naphtha-Kerosene Splitter 11-C-105 (reboiler 11-E-122, kondensor 11-E-123, drum 11-V-105, valve 11-FV-037); Kerosene Cooler 11-E-118/125/127 -> Clay Treater 11-V-113 A/B; Combined Gas Oil Cooler 11-E-112; Residue Valve 11-FV-033.
- Data Korosi Aktual CAIS LEMIGAS (PE25): TAN HGO 1,10-1,65 mg KOH/g & TAN Residu 1,00-1,24 mg KOH/g (waspada Naphthenic Acid Corrosion di atas 220 C pada 11-C-103, 11-E-109, 11-FV-031, 11-P-108); risiko HCl & deposit garam NH4Cl di overhead (11-C-101, 11-E-104, 11-E-114, 11-V-102, 11-E-131, 11-V-116); risiko Wet H2S / HIC / NH4HS di seksi Stabilizer (11-C-104, 11-E-119, 11-E-121, 11-V-104).`;

export function findRelevantLiterature(queryText: string, citedCodes: string[] = []): LiteratureReference[] {
  const results: LiteratureReference[] = [];
  const seen = new Set<string>();

  for (const code of citedCodes) {
    const clean = code.trim().toUpperCase();
    if (LITERATURE_DATABASE[clean] && !seen.has(clean)) {
      seen.add(clean);
      results.push(LITERATURE_DATABASE[clean]);
    }
  }

  const q = queryText.toLowerCase();
  const keywordMap: Array<[RegExp, string[]]> = [
    [/(cais|tan|naftenat|naphthenic|11-c-103|11-fv-031|11-e-109)/i, ['PE25', 'CI24', 'AM26']],
    [/(11-e-107|fouling|preheat|rd|pinch|11-e-106|11-e-110|11-e-111)/i, ['AL24', 'YU21', 'GU24']],
    [/(desalter|11-v-101|garam|wash water|demulsifier|effluent)/i, ['MB17', 'JP26', 'RA22']],
    [/(overhead|hcl|nh4cl|amonia|11-c-101|11-v-102|11-e-114|11-e-104)/i, ['PE25', 'AH21', 'CH22', 'OR24']],
    [/(h2s|hic|sohic|nh4hs|stabilizer|11-v-104|11-c-104|11-e-121)/i, ['KO25', 'OR22', 'AM26']],
    [/(furnace|11-f-101|hot spot|coking|tmt|burner|11-v-103)/i, ['DU26', 'MA22', 'PL23']],
    [/(rdmp|pre-flash|preflash|11-c-106|11-v-116|150 mbsd|150\.000)/i, ['RDMP22', 'ST25']],
    [/(gamma|tray|flooding|11-c-102|11-c-105)/i, ['ST25', 'YP11']],
    [/(kavitasi|impeller|11-p-101|11-p-104|11-p-115|npsha)/i, ['ZH23', 'FI25']],
    [/(seal|gland|quench|reservoir|11-p-106|11-p-108|11-p-126|11-p-112)/i, ['PN25', 'TM26']],
    [/(bearing|vibrasi|alignment|spalling|11-p-102|11-p-103|11-p-132)/i, ['FI25', 'HO22']],
    [/(stiction|osilasi|control valve|11-fv-|11-lv-030)/i, ['SH23', 'JI25']],
    [/(cui|insulasi|11-e-129|11-v-105)/i, ['CA22', 'AM26']],
    [/(fin fan|air cooler|11-e-124|11-e-125|11-e-112|wax)/i, ['YA25', 'EL22']],
    [/(cooling tower|mic|kerak|air pendingin|11-e-126|11-e-118|11-e-123|11-e-127)/i, ['AR23', 'AM26']],
  ];

  for (const [regex, codes] of keywordMap) {
    if (regex.test(q)) {
      for (const c of codes) {
        if (LITERATURE_DATABASE[c] && !seen.has(c)) {
          seen.add(c);
          results.push(LITERATURE_DATABASE[c]);
        }
      }
    }
  }

  return results.slice(0, 5);
}
