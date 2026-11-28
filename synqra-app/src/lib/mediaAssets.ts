import balonganCdu11HeroImg from '@/assets/branding/balongan-cdu11-hero.webp';
import pumpImg from '@/assets/equipment/centrifugal-pump-p101a.webp';
import heatImg from '@/assets/equipment/heat-exchanger-e201.webp';
import valveImg from '@/assets/equipment/control-valve-fcv301.webp';
import columnImg from '@/assets/equipment/column-fractionator.webp';
import stripperImg from '@/assets/equipment/column-stripper.webp';
import furnaceImg from '@/assets/equipment/furnace-heater.webp';
import finFanImg from '@/assets/equipment/fin-fan-cooler.webp';
import desalterImg from '@/assets/equipment/vessel-desalter.webp';
import vesselDrumImg from '@/assets/equipment/vessel-drum-boot.webp';

export interface MediaAssetEntry {
  src: string;
  width: number;
  height: number;
}

export interface EquipmentMediaEntry extends MediaAssetEntry {
  alt: string;
}

export interface EvidenceMediaMeta {
  url: string;
  attribution?: string;
  license?: string;
}

export interface JournalImageEntry {
  id: string;
  url: string;
  available: boolean;
  caption: string;
  source: string;
  license: string;
  usageInSynqra: string;
  usedInCases: string[];
  driveImageUrl: string;
  drivePaperFolderUrl: string;
}

export const BRAND_MEDIA = {
  loginHeroOilRig: {
    src: balonganCdu11HeroImg.src,
    width: balonganCdu11HeroImg.width,
    height: balonganCdu11HeroImg.height,
    alt: 'Panorama Unit 11 Crude Distillation Unit (CDU) PT Pertamina RU VI Balongan saat senja',
  },
};

export const EQUIPMENT_MEDIA: Record<string, EquipmentMediaEntry> = {
  column: {
    src: columnImg.src,
    width: columnImg.width,
    height: columnImg.height,
    alt: 'Kolom Distilasi Utama 11-C-101 / Pre-Flash 11-C-106',
  },
  stripper: {
    src: stripperImg.src,
    width: stripperImg.width,
    height: stripperImg.height,
    alt: 'Kolom Side Stripper & Splitter Unit 11 CDU',
  },
  furnace: {
    src: furnaceImg.src,
    width: furnaceImg.width,
    height: furnaceImg.height,
    alt: 'Crude Charge Fired Heater 11-F-101',
  },
  heater: {
    src: furnaceImg.src,
    width: furnaceImg.width,
    height: furnaceImg.height,
    alt: 'Crude Charge Fired Heater 11-F-101',
  },
  heat: {
    src: heatImg.src,
    width: heatImg.width,
    height: heatImg.height,
    alt: 'Shell & Tube Heat Exchanger Unit 11 CDU',
  },
  finfan: {
    src: finFanImg.src,
    width: finFanImg.width,
    height: finFanImg.height,
    alt: 'Fin-Fan Air Cooler Unit 11 CDU',
  },
  desalter: {
    src: desalterImg.src,
    width: desalterImg.width,
    height: desalterImg.height,
    alt: 'Electrostatic Desalter 11-V-101 A/B',
  },
  vessel: {
    src: vesselDrumImg.src,
    width: vesselDrumImg.width,
    height: vesselDrumImg.height,
    alt: 'Vessel & Overhead Reflux Drum Unit 11 CDU',
  },
  pump: {
    src: pumpImg.src,
    width: pumpImg.width,
    height: pumpImg.height,
    alt: 'Pompa Sentrifugal Proses Unit 11 CDU',
  },
  valve: {
    src: valveImg.src,
    width: valveImg.width,
    height: valveImg.height,
    alt: 'Control Valve Pneumatik Unit 11 CDU',
  },
};

export const JOURNAL_IMAGES_BY_ID: Record<string, string> = {
  "G01": "/assets/cdu11/journal/g01.webp",
  "G02": "/assets/cdu11/journal/g02.webp",
  "G03": "/assets/cdu11/journal/g03.webp",
  "G04": "/assets/cdu11/journal/g04.webp",
  "G05": "/assets/cdu11/journal/g05.webp",
  "G06": "/assets/cdu11/journal/g06.webp",
  "G07": "/assets/cdu11/journal/g07.webp",
  "G08": "/assets/cdu11/journal/g08.webp",
  "G09": "/assets/cdu11/journal/g09.webp",
  "G10": "/assets/cdu11/journal/g10.webp",
  "G11": "/assets/cdu11/journal/g11.webp",
  "G12": "/assets/cdu11/journal/g12.webp",
  "G13": "/assets/cdu11/journal/g13.webp",
  "G14": "/assets/cdu11/journal/g14.webp",
  "G15": "/assets/cdu11/journal/g15.webp",
  "G16": "/assets/cdu11/journal/g16.webp",
  "G17": "/assets/cdu11/journal/g17.webp",
  "G18": "/assets/cdu11/journal/g18.webp",
  "G19": "/assets/cdu11/journal/g19.webp",
  "G20": "/assets/cdu11/journal/g20.webp",
  "G21": "/assets/cdu11/journal/g21.webp",
  "G22": "/assets/cdu11/journal/g22.webp",
  "G23": "/assets/cdu11/journal/g23.webp",
  "G24": "/assets/cdu11/journal/g24.webp",
  "G25": "/assets/cdu11/journal/g25.webp",
  "G26": "/assets/cdu11/journal/g26.webp",
  "G27": "/assets/cdu11/journal/g27.webp",
  "G28": "/assets/cdu11/journal/g28.webp",
  "G29": "/assets/cdu11/journal/g29.webp",
  "G30": "/assets/cdu11/journal/g30.webp",
  "G31": "/assets/cdu11/journal/g31.webp",
  "G32": "/assets/cdu11/journal/g32.webp",
  "G33": "/assets/cdu11/journal/g33.webp",
  "G34": "/assets/cdu11/journal/g34.webp",
  "G35": "/assets/cdu11/journal/g35.webp",
  "G36": "/assets/cdu11/journal/g36.webp",
  "G37": "/assets/cdu11/journal/g37.webp",
  "G38": "/assets/cdu11/journal/g38.webp",
  "G39": "/assets/cdu11/journal/g39.webp",
  "G40": "/assets/cdu11/journal/g40.webp",
  "G42": "/assets/cdu11/journal/g42.webp",
  "G43": "/assets/cdu11/journal/g43.webp",
  "G44": "/assets/cdu11/journal/g44.webp",
  "G45": "/assets/cdu11/journal/g45.webp",
  "G46": "/assets/cdu11/journal/g46.webp",
  "G47": "/assets/cdu11/journal/g47.webp",
  "G48": "/assets/cdu11/journal/g48.webp",
  "G49": "/assets/cdu11/journal/g49.webp",
  "G50": "/assets/cdu11/journal/g50.webp",
  "G51": "/assets/cdu11/journal/g51.webp",
  "G52": "/assets/cdu11/journal/g52.webp",
  "G53": "/assets/cdu11/journal/g53.webp",
  "G54": "/assets/cdu11/journal/g54.webp",
  "G55": "/assets/cdu11/journal/g55.webp",
  "G56": "/assets/cdu11/journal/g56.webp",
  "G57": "/assets/cdu11/journal/g57.webp"
};

export const JOURNAL_IMAGE_CATALOG: Record<string, JournalImageEntry> = {
  "G01": {
    "id": "G01",
    "url": "/assets/cdu11/journal/g01.webp",
    "available": true,
    "caption": "Fig. 6 - temuan inspeksi di dalam kolom atmosferik: tray 28 dan tray 24 berlubang, nozzle kerosene tersumbat.",
    "source": "Ahmed (2021) - AH21",
    "license": "CC BY",
    "usageInSynqra": "Gambaran kerusakan tray akibat garam NH₄Cl/HCl.",
    "usedInCases": [
      "CDU11-C02",
      "CDU11-P06"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1xU_tooQJ9cvpMRfEWDuhdibmWkGUsYvC/view?usp=sharing",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1C40VxQicNs0RQ-OxJy3y5DZyCL_EPqFU?usp=sharing"
  },
  "G02": {
    "id": "G02",
    "url": "/assets/cdu11/journal/g02.webp",
    "available": true,
    "caption": "Fig. 7 - tren kadar garam (PTB) crude umpan sepanjang 2020.",
    "source": "Ahmed (2021) - AH21",
    "license": "CC BY",
    "usageInSynqra": "Hubungan kadar garam umpan dengan kerusakan tray.",
    "usedInCases": [
      "CDU11-C02"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1mXV-Pc4lih7HHyKKv0St508pFFahmno1/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1C40VxQicNs0RQ-OxJy3y5DZyCL_EPqFU?usp=sharing"
  },
  "G03": {
    "id": "G03",
    "url": "/assets/cdu11/journal/g03.webp",
    "available": true,
    "caption": "Fig. 7 - perbandingan data pindai K dan I: penyerapan gamma lebih tinggi di antara tray #37 dan #38.",
    "source": "Stefanus dkk. (2025) - ST25",
    "license": "Akses terbuka (prosiding)",
    "usageInSynqra": "Contoh bukti gamma scan untuk dugaan tray rusak.",
    "usedInCases": [
      "CDU11-C01",
      "CDU11-C03"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1JtJHVg2AoRX_1NaIpOFWq1nh1937bOAb/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1C40VxQicNs0RQ-OxJy3y5DZyCL_EPqFU?usp=sharing"
  },
  "G04": {
    "id": "G04",
    "url": "/assets/cdu11/journal/g04.webp",
    "available": true,
    "caption": "Fig. 8 - perbandingan data pindai F, J, dan K: material tray #37 dan fluida jatuh ke tray #38 (flooding).",
    "source": "Stefanus dkk. (2025) - ST25",
    "license": "Akses terbuka (prosiding)",
    "usageInSynqra": "Contoh pola flooding pada hasil gamma scan.",
    "usedInCases": [
      "CDU11-C01",
      "CDU11-C06"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1acfE8KnvtxQiciY3TuMX5ZdqNHwlJ3vC/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1C40VxQicNs0RQ-OxJy3y5DZyCL_EPqFU?usp=sharing"
  },
  "G05": {
    "id": "G05",
    "url": "/assets/cdu11/journal/g05.webp",
    "available": true,
    "caption": "Figure 2 - skema serangan korosi asam naftenat pada logam dan struktur umum asam naftenat.",
    "source": "Almubarak dkk. (2026) - AM26",
    "license": "CC BY 4.0",
    "usageInSynqra": "Penjelas mekanisme NAC pada tray, shell, dan nozzle bersuhu tinggi.",
    "usedInCases": [
      "CDU11-C04",
      "CDU11-E12"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1dQiOL_eMf33EVR40sCspyLnGxuZn0Kvq/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1C40VxQicNs0RQ-OxJy3y5DZyCL_EPqFU?usp=sharing"
  },
  "G06": {
    "id": "G06",
    "url": "/assets/cdu11/journal/g06.webp",
    "available": true,
    "caption": "Fig. 6 - tren ketebalan dinding side cut (termasuk HGO) dengan zoom periode pengolahan crude asam.",
    "source": "Chiofalo dkk. (2024) - CI24",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Contoh format bukti pemantauan UT online untuk NAC.",
    "usedInCases": [
      "CDU11-C04",
      "CDU11-E12",
      "CDU11-I04"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1XCCd5HwTdjJ5KSAhAPnRJtGdzIwDfHzj/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1C40VxQicNs0RQ-OxJy3y5DZyCL_EPqFU?usp=sharing"
  },
  "G07": {
    "id": "G07",
    "url": "/assets/cdu11/journal/g07.webp",
    "available": true,
    "caption": "Fig. 1 - pH fasa air terhadap suhu uap di kolom atmosferik (simulasi Aspen HYSYS).",
    "source": "Orlikowski dkk. (2024) - OR24",
    "license": "CC BY 3.0",
    "usageInSynqra": "Menjelaskan zona embun asam di bagian atas kolom dan sistem overhead.",
    "usedInCases": [
      "CDU11-C02",
      "CDU11-E15",
      "CDU11-E16"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1l7qkBPaMeD1RlYeb8AFlQr5WXD2s9TER/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1C40VxQicNs0RQ-OxJy3y5DZyCL_EPqFU?usp=sharing"
  },
  "G08": {
    "id": "G08",
    "url": "/assets/cdu11/journal/g08.webp",
    "available": true,
    "caption": "Fig. 2 - foto tube furnace yang rusak dan pecah akibat overheating.",
    "source": "Martinez dkk. (2022) - MA22",
    "license": "Preprint arXiv (versi terbit: Measurement)",
    "usageInSynqra": "Pembanding akibat overheating tube.",
    "usedInCases": [
      "CDU11-F01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1i8NWCtJU2jzGvRx0dPKMoJt-CUjgkfkY/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/13GBaGW90YhJcjScmOfYZPTSDNuIztfH1?usp=sharing"
  },
  "G09": {
    "id": "G09",
    "url": "/assets/cdu11/journal/g09.webp",
    "available": true,
    "caption": "Fig. 9 - citra termal tube furnace kilang dengan area ukur titik, garis, dan poligon.",
    "source": "Martinez dkk. (2022) - MA22",
    "license": "Preprint arXiv (versi terbit: Measurement)",
    "usageInSynqra": "Contoh format bukti termografi IR.",
    "usedInCases": [
      "CDU11-F01",
      "CDU11-V04"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1C-Y48oF_lBa0ebvw9t01C3d7wHM1GTtb/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/13GBaGW90YhJcjScmOfYZPTSDNuIztfH1?usp=sharing"
  },
  "G10": {
    "id": "G10",
    "url": "/assets/cdu11/journal/g10.webp",
    "available": true,
    "caption": "Fig. 4 - kontur suhu dinding luar tube pada tingkat coking 0-20%.",
    "source": "Du dkk. (2026) - DU26",
    "license": "CC BY",
    "usageInSynqra": "Visual pengaruh tebal kokas terhadap suhu dinding tube.",
    "usedInCases": [
      "CDU11-F01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1-a2Y-jjdmTPS9v8z0CdJ2mlz4KSdI7RO/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/13GBaGW90YhJcjScmOfYZPTSDNuIztfH1?usp=sharing"
  },
  "G11": {
    "id": "G11",
    "url": "/assets/cdu11/journal/g11.webp",
    "available": true,
    "caption": "Fig. 7 - suhu dinding dalam dan luar terhadap tingkat coking.",
    "source": "Du dkk. (2026) - DU26",
    "license": "CC BY",
    "usageInSynqra": "Dasar angka kenaikan TMT akibat kokas.",
    "usedInCases": [
      "CDU11-F01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1aOGOLx_DbxEVIHoDI_CDAVAWPjWDbNeh/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/13GBaGW90YhJcjScmOfYZPTSDNuIztfH1?usp=sharing"
  },
  "G12": {
    "id": "G12",
    "url": "/assets/cdu11/journal/g12.webp",
    "available": true,
    "caption": "Gambar 1 - fouling factor (Rd) desain vs aktual 11-E-107 (data Juni 2023).",
    "source": "Alhanif dkk. (2024) - AL24",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Baseline Rd untuk HE preheat train.",
    "usedInCases": [
      "CDU11-E04",
      "CDU11-E09",
      "CDU11-E10"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1hwAZ2pCp0EgR9Rs28KqEMiAeqtrsI5Y_/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G13": {
    "id": "G13",
    "url": "/assets/cdu11/journal/g13.webp",
    "available": true,
    "caption": "Gambar 2 - ΔP shell dan tube dibandingkan batas izin.",
    "source": "Alhanif dkk. (2024) - AL24",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Baseline ΔP HE preheat train.",
    "usedInCases": [
      "CDU11-E03",
      "CDU11-E10"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1efih2R0nYMcfzFao3W1BYHNBDkfqkoBm/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G14": {
    "id": "G14",
    "url": "/assets/cdu11/journal/g14.webp",
    "available": true,
    "caption": "Gambar 3 - efisiensi aktual vs desain 94,3%.",
    "source": "Alhanif dkk. (2024) - AL24",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Baseline efisiensi dan format grafik sebelum-sesudah pembersihan.",
    "usedInCases": [
      "CDU11-E10",
      "CDU11-E13",
      "CDU11-E14"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/10EENxDgU4gorf4dygxxdBhzi8jwz96h6/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G15": {
    "id": "G15",
    "url": "/assets/cdu11/journal/g15.webp",
    "available": true,
    "caption": "Figure 2 - grid diagram preheat train CDU dan CFU dengan garis pinch, HE baru, dan HE yang fouling.",
    "source": "Yusoff dkk. (2021) - YU21",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Menunjukkan HE ujung panas (di atas pinch) yang paling parah terkena fouling.",
    "usedInCases": [
      "CDU11-E03",
      "CDU11-E04",
      "CDU11-E09",
      "CDU11-E13",
      "CDU11-E14",
      "CDU11-E19"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1XF3AtnW0cFJystMvixgENBIBxQs2BBuS/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G16": {
    "id": "G16",
    "url": "/assets/cdu11/journal/g16.webp",
    "available": true,
    "caption": "Fig. 1 - grafik estimasi suhu deposisi garam NH₄Cl.",
    "source": "Ahmed (2021) - AH21",
    "license": "CC BY",
    "usageInSynqra": "Acuan menghitung suhu deposisi garam sebelum water wash.",
    "usedInCases": [
      "CDU11-E05",
      "CDU11-E16"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1jVO_LpxLuFez41QUArJDh1o0g_WBJGt_/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G17": {
    "id": "G17",
    "url": "/assets/cdu11/journal/g17.webp",
    "available": true,
    "caption": "Fig. 10 - skema masalah korosi dan fouling pada sirkuit crude, desalter, kolom, dan overhead.",
    "source": "Ahmed (2021) - AH21",
    "license": "CC BY",
    "usageInSynqra": "Peta titik rawan korosi di sistem overhead.",
    "usedInCases": [
      "CDU11-E05",
      "CDU11-V03"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1BUZsFtdw4vfMI2QwwsgB76p4j53udTWW/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G18": {
    "id": "G18",
    "url": "/assets/cdu11/journal/g18.webp",
    "available": true,
    "caption": "Fig. 1 - foto pori/lubang korosi pada pipa di puncak kolom distilasi atmosferik.",
    "source": "Chis dkk. (2022) - CH22",
    "license": "CC BY",
    "usageInSynqra": "Gambaran kerusakan akhir bila korosi HCl/NH₄Cl di overhead tidak terkendali.",
    "usedInCases": [
      "CDU11-E15",
      "CDU11-E16"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1F9u7xY_SF3oQnOoHNcTi_h02yOTW0C9w/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G19": {
    "id": "G19",
    "url": "/assets/cdu11/journal/g19.webp",
    "available": true,
    "caption": "Fig. 3 - kehilangan tebal dari pemantauan UT dinding pipa.",
    "source": "Orlikowski dkk. (2024) - OR24",
    "license": "CC BY 3.0",
    "usageInSynqra": "Contoh format bukti UT.",
    "usedInCases": [
      "CDU11-V02",
      "CDU11-V03"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1af4QZFpJoZ4MuF-fi2z2kmvq4pP9ssiD/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G20": {
    "id": "G20",
    "url": "/assets/cdu11/journal/g20.webp",
    "available": true,
    "caption": "Fig. 10 - hasil probe ER saat operasi normal.",
    "source": "Orlikowski dkk. (2024) - OR24",
    "license": "CC BY 3.0",
    "usageInSynqra": "Contoh format bukti ER.",
    "usedInCases": [
      "CDU11-V03"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1fH6Xnduej8VObHWav4xsX8X-LcqN-pQl/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G21": {
    "id": "G21",
    "url": "/assets/cdu11/journal/g21.webp",
    "available": true,
    "caption": "Gambar 9 - hasil analisis kualitas wash water.",
    "source": "Santoso & Silviana (2026) - JP26",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Pembanding kualitas wash water desalter.",
    "usedInCases": [
      "CDU11-E07"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1-EtgzpLN7SNkEGs09xwJtFUmZV8hjJYj/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G22": {
    "id": "G22",
    "url": "/assets/cdu11/journal/g22.webp",
    "available": true,
    "caption": "Gambar 10 - hasil analisis effluent water desalter (oil content).",
    "source": "Santoso & Silviana (2026) - JP26",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Pembanding target oil content effluent < 500 ppm.",
    "usedInCases": [
      "CDU11-E07",
      "CDU11-E08",
      "CDU11-V01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/111K863PJgjp88Ambm_r-bQ2VC1H65rkS/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G23": {
    "id": "G23",
    "url": "/assets/cdu11/journal/g23.webp",
    "available": true,
    "caption": "Fig. 2 - foto tube sheet HE yang gagal (di platform dan di gudang). Nomor gambar mengikuti versi preprint.",
    "source": "Ardy dkk. (2023) - AR23",
    "license": "CC BY 4.0",
    "usageInSynqra": "Pembanding visual kebocoran dan plugging tube.",
    "usedInCases": [
      "CDU11-E20",
      "CDU11-E26"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/115a62gpxhBHRSmXMem6UyGaPQ2Of7e09/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G24": {
    "id": "G24",
    "url": "/assets/cdu11/journal/g24.webp",
    "available": true,
    "caption": "Fig. 3 - antarmuka tube sheet-gasket dengan pitting, sisi inlet tube sheet, dan kondisi permukaan tube. Nomor gambar mengikuti versi preprint.",
    "source": "Ardy dkk. (2023) - AR23",
    "license": "CC BY 4.0",
    "usageInSynqra": "Pembanding pitting di bawah endapan dan di bawah gasket.",
    "usedInCases": [
      "CDU11-E02",
      "CDU11-E21",
      "CDU11-E23"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1SYzwnGkJVc1Ea0BP3-J_-3ZpDf1p_3RY/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G25": {
    "id": "G25",
    "url": "/assets/cdu11/journal/g25.webp",
    "available": true,
    "caption": "Fig. 4 - penampang memanjang tube: tube tanpa cacat, tube yang diplug, dan tube berisi endapan. Nomor gambar mengikuti versi preprint.",
    "source": "Ardy dkk. (2023) - AR23",
    "license": "CC BY 4.0",
    "usageInSynqra": "Pembanding endapan, kerak, dan korosi di dalam tube.",
    "usedInCases": [
      "CDU11-E02",
      "CDU11-E08",
      "CDU11-E21",
      "CDU11-E23",
      "CDU11-E24"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1-hTayZXCO83oe3xuDSCA9LPGwUSo__gn/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G26": {
    "id": "G26",
    "url": "/assets/cdu11/journal/g26.webp",
    "available": true,
    "caption": "Figure 3 - sebaran endapan debu hasil simulasi dibanding sebaran fouling aktual di lapangan pada air cooler fin-tube.",
    "source": "Yang dkk. (2025) - YA25",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Pembanding pola debu di sisi udara fin fan.",
    "usedInCases": [
      "CDU11-E22"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/112lA6Qgc0dK0KJP4lmGvWzwaOiwsz_68/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G27": {
    "id": "G27",
    "url": "/assets/cdu11/journal/g27.webp",
    "available": true,
    "caption": "Figure 9 - perubahan metrik kinerja terhadap tebal endapan debu.",
    "source": "Yang dkk. (2025) - YA25",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Dasar penurunan kinerja fin fan akibat fouling sisi udara.",
    "usedInCases": [
      "CDU11-E22",
      "CDU11-E27"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1sFWp9h2KmckSHB7uy8XsrKrIZdYJHjdJ/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G28": {
    "id": "G28",
    "url": "/assets/cdu11/journal/g28.webp",
    "available": true,
    "caption": "Figure 4 - kegagalan CUI di kilang: pipa berlubang besar dan braket walkway yang menempel pada pipa.",
    "source": "Cao dkk. (2022) - CA22",
    "license": "CC BY 4.0",
    "usageInSynqra": "Gambaran akhir CUI yang tidak terdeteksi.",
    "usedInCases": [
      "CDU11-E01",
      "CDU11-V06"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1pB8PC0o3InNI9c8XVdaze_qC7iViTjcg/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G29": {
    "id": "G29",
    "url": "/assets/cdu11/journal/g29.webp",
    "available": true,
    "caption": "Figure 7 - citra IR siang dan malam; area terang menandakan air di dalam insulasi.",
    "source": "Cao dkk. (2022) - CA22",
    "license": "CC BY 4.0",
    "usageInSynqra": "Contoh bukti pemindaian IR untuk insulasi basah.",
    "usedInCases": [
      "CDU11-E01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1jkyuaiZVxmN-jaw00as0DO3f3EpVLbQ_/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1R1e0H4NUK6pEMsGi3T7NcxSJIkG3h0Or?usp=sharing"
  },
  "G30": {
    "id": "G30",
    "url": "/assets/cdu11/journal/g30.webp",
    "available": true,
    "caption": "Gambar 2 - grafik hasil bottle test demulsifier (studi kasus Kilang Pertamina Cilacap).",
    "source": "Santoso & Silviana (2026) - JP26",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Pembanding cara membaca hasil bottle test.",
    "usedInCases": [
      "CDU11-E06",
      "CDU11-V01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1bPleOey4tF1GQeglPDWF8yrYpx7Hpr0b/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1ej4BxDaNWiLQE5tFZTd7eFz09mnsxZ04?usp=drive_link"
  },
  "G31": {
    "id": "G31",
    "url": "/assets/cdu11/journal/g31.webp",
    "available": true,
    "caption": "Figure artikel - geometri desalter elektrostatik dan hasil studi parametrik (medan listrik, suhu/viskositas, kadar air).",
    "source": "Ramirez-Argaez dkk. (2022) - RA22",
    "license": "CC BY 4.0",
    "usageInSynqra": "Penjelas mekanisme pemisahan air-minyak di desalter.",
    "usedInCases": [
      "CDU11-E06",
      "CDU11-V01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1ceLg9YCv2dVx7jjxJYy0GcxUC8b641hk/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1ej4BxDaNWiLQE5tFZTd7eFz09mnsxZ04?usp=drive_link"
  },
  "G32": {
    "id": "G32",
    "url": "/assets/cdu11/journal/g32.webp",
    "available": true,
    "caption": "Fig. 2 - foto korosi pada reflux vessel (bejana sejenis overhead accumulator).",
    "source": "Chis dkk. (2022) - CH22",
    "license": "CC BY",
    "usageInSynqra": "Gambaran korosi HCl di bejana refluks.",
    "usedInCases": [
      "CDU11-E17",
      "CDU11-V02",
      "CDU11-V03"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1q7iT6O3cbost4PbfMmSeOf7UWesXhEWH/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1ej4BxDaNWiLQE5tFZTd7eFz09mnsxZ04?usp=drive_link"
  },
  "G33": {
    "id": "G33",
    "url": "/assets/cdu11/journal/g33.webp",
    "available": true,
    "caption": "Fig. 1 - blistering permukaan dalam serta contoh HIC (a) dan SOHIC (b).",
    "source": "Kourousis dkk. (2025) - KO25",
    "license": "CC BY 4.0",
    "usageInSynqra": "Gambaran visual HIC/SOHIC.",
    "usedInCases": [
      "CDU11-C05",
      "CDU11-E18",
      "CDU11-V05"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1cejmnZlc60YBrt5vSU-1cOrg-n4ZtfU7/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1ej4BxDaNWiLQE5tFZTd7eFz09mnsxZ04?usp=drive_link"
  },
  "G34": {
    "id": "G34",
    "url": "/assets/cdu11/journal/g34.webp",
    "available": true,
    "caption": "Fig. 2 - C-scan AUT sebaran indikasi HIC.",
    "source": "Kourousis dkk. (2025) - KO25",
    "license": "CC BY 4.0",
    "usageInSynqra": "Contoh format bukti AUT.",
    "usedInCases": [
      "CDU11-V05"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1sj91gdjjdWB34iboB-GHKjoRxS3un9WC/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1ej4BxDaNWiLQE5tFZTd7eFz09mnsxZ04?usp=drive_link"
  },
  "G35": {
    "id": "G35",
    "url": "/assets/cdu11/journal/g35.webp",
    "available": true,
    "caption": "Fig. 3 - tampilan PAUT (B-scan, S-scan, C-scan).",
    "source": "Kourousis dkk. (2025) - KO25",
    "license": "CC BY 4.0",
    "usageInSynqra": "Contoh format bukti PAUT untuk mengukur retak.",
    "usedInCases": [
      "CDU11-V05",
      "CDU11-V08"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1P-nBGrmRxr8bBr2jDBRieDUtR-2VA8SA/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1ej4BxDaNWiLQE5tFZTd7eFz09mnsxZ04?usp=drive_link"
  },
  "G36": {
    "id": "G36",
    "url": "/assets/cdu11/journal/g36.webp",
    "available": true,
    "caption": "Fig. 1 - permukaan kupon korosi setelah terpapar air ber-H₂S (contoh degradasi H₂S basah).",
    "source": "Orlikowski dkk. (2022) - OR22",
    "license": "CC BY 4.0",
    "usageInSynqra": "Pembanding bentuk serangan H₂S basah.",
    "usedInCases": [
      "CDU11-C05",
      "CDU11-E17",
      "CDU11-E18",
      "CDU11-V05"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1VkmnclGQR8gO-XpMDX9Ab3Kk00fONBB-/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1ej4BxDaNWiLQE5tFZTd7eFz09mnsxZ04?usp=drive_link"
  },
  "G37": {
    "id": "G37",
    "url": "/assets/cdu11/journal/g37.webp",
    "available": true,
    "caption": "Figure 14 - degradasi coating berupa pitting berantai pada jalur hot oil.",
    "source": "Cao dkk. (2022) - CA22",
    "license": "CC BY 4.0",
    "usageInSynqra": "Pembanding kerusakan coating dan korosi eksternal.",
    "usedInCases": [
      "CDU11-V06"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/15xicGH1GsngKXNEyIaZVe3Ika87akpA9/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1ej4BxDaNWiLQE5tFZTd7eFz09mnsxZ04?usp=drive_link"
  },
  "G38": {
    "id": "G38",
    "url": "/assets/cdu11/journal/g38.webp",
    "available": true,
    "caption": "Fig. 4 - sudu impeller yang rusak akibat kavitasi.",
    "source": "Zhu dkk. (2023) - ZH23",
    "license": "CC BY",
    "usageInSynqra": "Pembanding pitting kavitasi pada impeller.",
    "usedInCases": [
      "CDU11-P01",
      "CDU11-P06",
      "CDU11-P09",
      "CDU11-P12"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1FpMPRNq5zT_TrsGokyxU546cWjoE7RVK/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G39": {
    "id": "G39",
    "url": "/assets/cdu11/journal/g39.webp",
    "available": true,
    "caption": "Fig. 8 - perubahan tingkat tekanan suara dari tanpa kavitasi hingga kavitasi berkembang.",
    "source": "Zhu dkk. (2023) - ZH23",
    "license": "CC BY",
    "usageInSynqra": "Pola bising untuk mendukung bukti kavitasi.",
    "usedInCases": [
      "CDU11-P01",
      "CDU11-P07",
      "CDU11-P11"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1ODHQJPtNtqhaIWS8JJc57GitRyWMgdlB/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G40": {
    "id": "G40",
    "url": "/assets/cdu11/journal/g40.webp",
    "available": true,
    "caption": "Fig. 9 - perubahan tingkat vibrasi badan pompa saat kavitasi.",
    "source": "Zhu dkk. (2023) - ZH23",
    "license": "CC BY",
    "usageInSynqra": "Pola vibrasi untuk mendukung bukti kavitasi.",
    "usedInCases": [
      "CDU11-P01",
      "CDU11-P07",
      "CDU11-P09",
      "CDU11-P15"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/19KBAypQvRYdB7pAz_hkGjAPwkWmfnUhj/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G41": {
    "id": "G41",
    "url": "",
    "available": false,
    "caption": "Gambar 3.5 - lokasi kebocoran mechanical seal; Gambar 3.6 - seal ring; Gambar 3.7 - mating ring (pompa 37-P-101B, RU VI Balongan).",
    "source": "Prasetya (2025) - PN25 (tidak dibaca penuh)",
    "license": "Repositori; isi Bab III tidak tersedia untuk umum",
    "usageInSynqra": "Contoh kerusakan seal di kilang yang sama.",
    "usedInCases": [
      "CDU11-P04",
      "CDU11-P08",
      "CDU11-P13",
      "CDU11-P14",
      "CDU11-P16"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1mkr7pLyA0eZoXPwE0sbT0h4dwh4VHFoo/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G42": {
    "id": "G42",
    "url": "/assets/cdu11/journal/g42.webp",
    "available": true,
    "caption": "Figure 3 - kerusakan makroskopis raceway inner ring dalam tiga zona.",
    "source": "Hou dkk. (2022) - HO22",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Pembanding visual kerusakan raceway bearing.",
    "usedInCases": [
      "CDU11-P02",
      "CDU11-V09"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1F6JJ55v7QyylDH7PM3nJbt8GLKjrxdXT/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G43": {
    "id": "G43",
    "url": "/assets/cdu11/journal/g43.webp",
    "available": true,
    "caption": "Figure 4 - spalling kelelahan kontak pada raceway inner ring.",
    "source": "Hou dkk. (2022) - HO22",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Pembanding spalling bearing.",
    "usedInCases": [
      "CDU11-E25",
      "CDU11-P02",
      "CDU11-P10"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1w15Szb65nWFqOg244GiMgJMygAFHddQL/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G44": {
    "id": "G44",
    "url": "/assets/cdu11/journal/g44.webp",
    "available": true,
    "caption": "Figure 7 - bola bantalan dengan keausan ringan (tampilan makro dan mikro).",
    "source": "Hou dkk. (2022) - HO22",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Pembanding keausan awal bearing.",
    "usedInCases": [
      "CDU11-P03"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1w15Szb65nWFqOg244GiMgJMygAFHddQL/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G45": {
    "id": "G45",
    "url": "/assets/cdu11/journal/g45.webp",
    "available": true,
    "caption": "Figure 9 - kerusakan pada raceway outer ring.",
    "source": "Hou dkk. (2022) - HO22",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Pembanding cacat lintasan luar (BPFO).",
    "usedInCases": [
      "CDU11-P05",
      "CDU11-P10"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/11M5wSJpbKrQLgHI7ZPYEtLS1o1C6dJw7/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G46": {
    "id": "G46",
    "url": "/assets/cdu11/journal/g46.webp",
    "available": true,
    "caption": "Tabel 2 (bukan gambar) - nilai vibrasi RMS per titik NDE/DE pada arah aksial, horizontal, dan vertikal pompa crude P100/3.",
    "source": "Fitrian & Kundori (2025) - FI25",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Contoh format tabel bukti vibrasi ISO 10816-3.",
    "usedInCases": [
      "CDU11-E25",
      "CDU11-P02",
      "CDU11-P05",
      "CDU11-P15",
      "CDU11-P17",
      "CDU11-V09"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1i70FbPTUsfxlWM94GVN9SU1prTRHXjda/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G47": {
    "id": "G47",
    "url": "/assets/cdu11/journal/g47.webp",
    "available": true,
    "caption": "Fig. 10 - seri pengukuran 1: variasi kecepatan putar pada tekanan seal tetap 6 bar.",
    "source": "Heel dkk. (2026) - TM26",
    "license": "Diamond Open Access",
    "usageInSynqra": "Pembanding tren suhu seal terhadap kecepatan putar.",
    "usedInCases": [
      "CDU11-P13",
      "CDU11-P16"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1MDTyXkJoyoneSY4t2lQJmhDSCLa-CX9M/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G48": {
    "id": "G48",
    "url": "/assets/cdu11/journal/g48.webp",
    "available": true,
    "caption": "Fig. 11 - seri pengukuran 2: variasi tekanan seal 6-11 bar pada 3600 rpm.",
    "source": "Heel dkk. (2026) - TM26",
    "license": "Diamond Open Access",
    "usageInSynqra": "Pembanding kenaikan suhu seat seal terhadap tekanan.",
    "usedInCases": [
      "CDU11-P04",
      "CDU11-P08"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1cxFe0BKh43x3al49Y3dWQ0ZmgZo7CiY0/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1MI-_r61FNvDn77Dxw1yG9Ms1nbuELdtk?usp=drive_link"
  },
  "G49": {
    "id": "G49",
    "url": "/assets/cdu11/journal/g49.webp",
    "available": true,
    "caption": "Figure 3 - kerusakan valve core: (a) morfologi pit kavitasi, (b) morfologi aus erosi.",
    "source": "Jin dkk. (2025) - JI25",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Pembanding kerusakan trim akibat kavitasi dan erosi.",
    "usedInCases": [
      "CDU11-I01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1h2JWm6A3xbYYYlANYI08llct9DFECenm/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  },
  "G50": {
    "id": "G50",
    "url": "/assets/cdu11/journal/g50.webp",
    "available": true,
    "caption": "Figure 4 - kerusakan bushing pada satu sisi akibat semburan eksentrik.",
    "source": "Jin dkk. (2025) - JI25",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Pembanding pola erosi satu sisi.",
    "usedInCases": [
      "CDU11-I01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1XsyBcdmpxRtPta6AeypwyzbcGr4the6E/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  },
  "G51": {
    "id": "G51",
    "url": "/assets/cdu11/journal/g51.webp",
    "available": true,
    "caption": "Figure 7(d) - tampilan aus spool aktual dengan alur dalam di dekat pusat.",
    "source": "Jin dkk. (2025) - JI25",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Pembanding aus spool pada level control valve.",
    "usedInCases": [
      "CDU11-I01"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1KHMRAlZhO_uBdq7A7EgLRpbezewwC8tR/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  },
  "G52": {
    "id": "G52",
    "url": "/assets/cdu11/journal/g52.webp",
    "available": true,
    "caption": "Figure 3 - karakteristik OP-MV valve yang lengket.",
    "source": "Shang dkk. (2023) - SH23",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Penjelas pola slip-jump.",
    "usedInCases": [
      "CDU11-I03"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/12XNQtkvnW8ZmyVt6_Cd7eJ1TOXDrYN4Y/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  },
  "G53": {
    "id": "G53",
    "url": "/assets/cdu11/journal/g53.webp",
    "available": true,
    "caption": "Figure 4 - plot OP-MV dan OP-PV dengan valve yang lengket.",
    "source": "Shang dkk. (2023) - SH23",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Contoh format bukti stiction dari data DCS.",
    "usedInCases": [
      "CDU11-I02",
      "CDU11-I05"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1r-uKrrUTpkQZhF6KITg7x7Fo2jJ64T5B/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  },
  "G54": {
    "id": "G54",
    "url": "/assets/cdu11/journal/g54.webp",
    "available": true,
    "caption": "Figure 5 - kurva OP dan PV dengan valve yang lengket.",
    "source": "Shang dkk. (2023) - SH23",
    "license": "Akses terbuka (MDPI)",
    "usageInSynqra": "Contoh pola osilasi akibat stiction.",
    "usedInCases": [
      "CDU11-C06",
      "CDU11-I02"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1t3VgA4prbxxHFsbm-XphSZgm2HkTE1LN/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  },
  "G55": {
    "id": "G55",
    "url": "/assets/cdu11/journal/g55.webp",
    "available": true,
    "caption": "Fig. 4 - tren ketebalan dinding seksi preheat dan transfer line.",
    "source": "Chiofalo dkk. (2024) - CI24",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Pembanding lokasi rawan NAC di sisi panas.",
    "usedInCases": [
      "CDU11-I04"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1ZxwTGPR4V7P4yit3TmN__xGUQ8sycKn7/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  },
  "G56": {
    "id": "G56",
    "url": "/assets/cdu11/journal/g56.webp",
    "available": true,
    "caption": "Fig. 3 - emulator CAIS dan peta warna tingkat korosi pada PFD CDU.",
    "source": "Permana dkk. (2025) - PE25",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Konteks langsung CDU RU VI Balongan.",
    "usedInCases": [
      "CDU11-I04"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1zwG6yVlJ0iyKdqH-d89bfj6HEtLbJitZ/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  },
  "G57": {
    "id": "G57",
    "url": "/assets/cdu11/journal/g57.webp",
    "available": true,
    "caption": "Fig. 1 - data kegagalan peralatan statik CDU (Pertamina, 2024).",
    "source": "Permana dkk. (2025) - PE25",
    "license": "Akses terbuka (jurnal)",
    "usageInSynqra": "Latar belakang kegagalan akibat korosi di CDU.",
    "usedInCases": [
      "CDU11-I04"
    ],
    "driveImageUrl": "https://drive.google.com/file/d/1GVQR8Bx9NFlY52paQnSdKGFNQ4gCWCNI/view?usp=drive_link",
    "drivePaperFolderUrl": "https://drive.google.com/drive/folders/1egWB0A7DFo55Ym8wMAQzSyc7JNJ39H33?usp=drive_link"
  }
};

export const EVIDENCE_MEDIA_META: Record<string, EvidenceMediaMeta> = {
  "ev-cdu11-c01-1": {
    "url": "/assets/cdu11/journal/g04.webp",
    "attribution": "G04 · Stefanus dkk. (2025) - ST25: Fig. 8 - perbandingan data pindai F, J, dan K: material tray #37 dan fluida jatuh ke tray #38 (flooding).",
    "license": "Akses terbuka (prosiding)"
  },
  "ev-cdu11-c01-2": {
    "url": "/assets/cdu11/journal/g03.webp",
    "attribution": "G03 · Stefanus dkk. (2025) - ST25: Fig. 7 - perbandingan data pindai K dan I: penyerapan gamma lebih tinggi di antara tray #37 dan #38.",
    "license": "Akses terbuka (prosiding)"
  },
  "ev-cdu11-c02-1": {
    "url": "/assets/cdu11/journal/g01.webp",
    "attribution": "G01 · Ahmed (2021) - AH21: Fig. 6 - temuan inspeksi di dalam kolom atmosferik: tray 28 dan tray 24 berlubang, nozzle kerosene tersumbat.",
    "license": "CC BY"
  },
  "ev-cdu11-c04-1": {
    "url": "/assets/cdu11/journal/g05.webp",
    "attribution": "G05 · Almubarak dkk. (2026) - AM26: Figure 2 - skema serangan korosi asam naftenat pada logam dan struktur umum asam naftenat.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-c04-2": {
    "url": "/assets/cdu11/journal/g06.webp",
    "attribution": "G06 · Chiofalo dkk. (2024) - CI24: Fig. 6 - tren ketebalan dinding side cut (termasuk HGO) dengan zoom periode pengolahan crude asam.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-c05-1": {
    "url": "/assets/cdu11/journal/g36.webp",
    "attribution": "G36 · Orlikowski dkk. (2022) - OR22: Fig. 1 - permukaan kupon korosi setelah terpapar air ber-H₂S (contoh degradasi H₂S basah).",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-f01-1": {
    "url": "/assets/cdu11/journal/g09.webp",
    "attribution": "G09 · Martinez dkk. (2022) - MA22: Fig. 9 - citra termal tube furnace kilang dengan area ukur titik, garis, dan poligon.",
    "license": "Preprint arXiv (versi terbit: Measurement)"
  },
  "ev-cdu11-f01-2": {
    "url": "/assets/cdu11/journal/g11.webp",
    "attribution": "G11 · Du dkk. (2026) - DU26: Fig. 7 - suhu dinding dalam dan luar terhadap tingkat coking.",
    "license": "CC BY"
  },
  "ev-cdu11-e02-1": {
    "url": "/assets/cdu11/journal/g24.webp",
    "attribution": "G24 · Ardy dkk. (2023) - AR23: Fig. 3 - antarmuka tube sheet-gasket dengan pitting, sisi inlet tube sheet, dan kondisi permukaan tube. Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e02-2": {
    "url": "/assets/cdu11/journal/g25.webp",
    "attribution": "G25 · Ardy dkk. (2023) - AR23: Fig. 4 - penampang memanjang tube: tube tanpa cacat, tube yang diplug, dan tube berisi endapan. Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e04-1": {
    "url": "/assets/cdu11/journal/g15.webp",
    "attribution": "G15 · Yusoff dkk. (2021) - YU21: Figure 2 - grid diagram preheat train CDU dan CFU dengan garis pinch, HE baru, dan HE yang fouling.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e05-1": {
    "url": "/assets/cdu11/journal/g16.webp",
    "attribution": "G16 · Ahmed (2021) - AH21: Fig. 1 - grafik estimasi suhu deposisi garam NH₄Cl.",
    "license": "CC BY"
  },
  "ev-cdu11-e05-2": {
    "url": "/assets/cdu11/journal/g17.webp",
    "attribution": "G17 · Ahmed (2021) - AH21: Fig. 10 - skema masalah korosi dan fouling pada sirkuit crude, desalter, kolom, dan overhead.",
    "license": "CC BY"
  },
  "ev-cdu11-e06-1": {
    "url": "/assets/cdu11/journal/g31.webp",
    "attribution": "G31 · Ramirez-Argaez dkk. (2022) - RA22: Figure artikel - geometri desalter elektrostatik dan hasil studi parametrik (medan listrik, suhu/viskositas, kadar air).",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e08-1": {
    "url": "/assets/cdu11/journal/g25.webp",
    "attribution": "G25 · Ardy dkk. (2023) - AR23: Fig. 4 - penampang memanjang tube: tube tanpa cacat, tube yang diplug, dan tube berisi endapan. Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e08-2": {
    "url": "/assets/cdu11/journal/g22.webp",
    "attribution": "G22 · Santoso & Silviana (2026) - JP26: Gambar 10 - hasil analisis effluent water desalter (oil content).",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e09-1": {
    "url": "/assets/cdu11/journal/g15.webp",
    "attribution": "G15 · Yusoff dkk. (2021) - YU21: Figure 2 - grid diagram preheat train CDU dan CFU dengan garis pinch, HE baru, dan HE yang fouling.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e09-2": {
    "url": "/assets/cdu11/journal/g12.webp",
    "attribution": "G12 · Alhanif dkk. (2024) - AL24: Gambar 1 - fouling factor (Rd) desain vs aktual 11-E-107 (data Juni 2023).",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e10-1": {
    "url": "/assets/cdu11/journal/g14.webp",
    "attribution": "G14 · Alhanif dkk. (2024) - AL24: Gambar 3 - efisiensi aktual vs desain 94,3%.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e12-1": {
    "url": "/assets/cdu11/journal/g06.webp",
    "attribution": "G06 · Chiofalo dkk. (2024) - CI24: Fig. 6 - tren ketebalan dinding side cut (termasuk HGO) dengan zoom periode pengolahan crude asam.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e13-1": {
    "url": "/assets/cdu11/journal/g15.webp",
    "attribution": "G15 · Yusoff dkk. (2021) - YU21: Figure 2 - grid diagram preheat train CDU dan CFU dengan garis pinch, HE baru, dan HE yang fouling.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e13-2": {
    "url": "/assets/cdu11/journal/g14.webp",
    "attribution": "G14 · Alhanif dkk. (2024) - AL24: Gambar 3 - efisiensi aktual vs desain 94,3%.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e14-1": {
    "url": "/assets/cdu11/journal/g15.webp",
    "attribution": "G15 · Yusoff dkk. (2021) - YU21: Figure 2 - grid diagram preheat train CDU dan CFU dengan garis pinch, HE baru, dan HE yang fouling.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e14-2": {
    "url": "/assets/cdu11/journal/g14.webp",
    "attribution": "G14 · Alhanif dkk. (2024) - AL24: Gambar 3 - efisiensi aktual vs desain 94,3%.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e17-1": {
    "url": "/assets/cdu11/journal/g36.webp",
    "attribution": "G36 · Orlikowski dkk. (2022) - OR22: Fig. 1 - permukaan kupon korosi setelah terpapar air ber-H₂S (contoh degradasi H₂S basah).",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e18-1": {
    "url": "/assets/cdu11/journal/g33.webp",
    "attribution": "G33 · Kourousis dkk. (2025) - KO25: Fig. 1 - blistering permukaan dalam serta contoh HIC (a) dan SOHIC (b).",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e18-2": {
    "url": "/assets/cdu11/journal/g36.webp",
    "attribution": "G36 · Orlikowski dkk. (2022) - OR22: Fig. 1 - permukaan kupon korosi setelah terpapar air ber-H₂S (contoh degradasi H₂S basah).",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e19-1": {
    "url": "/assets/cdu11/journal/g15.webp",
    "attribution": "G15 · Yusoff dkk. (2021) - YU21: Figure 2 - grid diagram preheat train CDU dan CFU dengan garis pinch, HE baru, dan HE yang fouling.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-e19-2": {
    "url": "/assets/cdu11/evidences/cdu11-e19_trend_rvp_tbottom_pascacleaning_11c104.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G15)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e20-1": {
    "url": "/assets/cdu11/journal/g23.webp",
    "attribution": "G23 · Ardy dkk. (2023) - AR23: Fig. 2 - foto tube sheet HE yang gagal (di platform dan di gudang). Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e20-2": {
    "url": "/assets/cdu11/evidences/cdu11-e20_data_tekanan_sisi_11e122.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G23)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e21-1": {
    "url": "/assets/cdu11/journal/g24.webp",
    "attribution": "G24 · Ardy dkk. (2023) - AR23: Fig. 3 - antarmuka tube sheet-gasket dengan pitting, sisi inlet tube sheet, dan kondisi permukaan tube. Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e22-1": {
    "url": "/assets/cdu11/journal/g27.webp",
    "attribution": "G27 · Yang dkk. (2025) - YA25: Figure 9 - perubahan metrik kinerja terhadap tebal endapan debu.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-e22-2": {
    "url": "/assets/cdu11/journal/g26.webp",
    "attribution": "G26 · Yang dkk. (2025) - YA25: Figure 3 - sebaran endapan debu hasil simulasi dibanding sebaran fouling aktual di lapangan pada air cooler fin-tube.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-e23-1": {
    "url": "/assets/cdu11/journal/g25.webp",
    "attribution": "G25 · Ardy dkk. (2023) - AR23: Fig. 4 - penampang memanjang tube: tube tanpa cacat, tube yang diplug, dan tube berisi endapan. Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e23-2": {
    "url": "/assets/cdu11/journal/g24.webp",
    "attribution": "G24 · Ardy dkk. (2023) - AR23: Fig. 3 - antarmuka tube sheet-gasket dengan pitting, sisi inlet tube sheet, dan kondisi permukaan tube. Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e24-1": {
    "url": "/assets/cdu11/journal/g25.webp",
    "attribution": "G25 · Ardy dkk. (2023) - AR23: Fig. 4 - penampang memanjang tube: tube tanpa cacat, tube yang diplug, dan tube berisi endapan. Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e24-2": {
    "url": "/assets/cdu11/evidences/cdu11-e24_trend_suhu_kerosene_pascacleaning_11e118.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G25)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e26-1": {
    "url": "/assets/cdu11/journal/g23.webp",
    "attribution": "G23 · Ardy dkk. (2023) - AR23: Fig. 2 - foto tube sheet HE yang gagal (di platform dan di gudang). Nomor gambar mengikuti versi preprint.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e26-2": {
    "url": "/assets/cdu11/evidences/cdu11-e26_lab_air_klorida_inhibitor.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G23)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e27-1": {
    "url": "/assets/cdu11/journal/g27.webp",
    "attribution": "G27 · Yang dkk. (2025) - YA25: Figure 9 - perubahan metrik kinerja terhadap tebal endapan debu.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-v02-1": {
    "url": "/assets/cdu11/journal/g32.webp",
    "attribution": "G32 · Chis dkk. (2022) - CH22: Fig. 2 - foto korosi pada reflux vessel (bejana sejenis overhead accumulator).",
    "license": "CC BY"
  },
  "ev-cdu11-v03-1": {
    "url": "/assets/cdu11/journal/g19.webp",
    "attribution": "G19 · Orlikowski dkk. (2024) - OR24: Fig. 3 - kehilangan tebal dari pemantauan UT dinding pipa.",
    "license": "CC BY 3.0"
  },
  "ev-cdu11-v03-2": {
    "url": "/assets/cdu11/journal/g32.webp",
    "attribution": "G32 · Chis dkk. (2022) - CH22: Fig. 2 - foto korosi pada reflux vessel (bejana sejenis overhead accumulator).",
    "license": "CC BY"
  },
  "ev-cdu11-v04-1": {
    "url": "/assets/cdu11/journal/g09.webp",
    "attribution": "G09 · Martinez dkk. (2022) - MA22: Fig. 9 - citra termal tube furnace kilang dengan area ukur titik, garis, dan poligon.",
    "license": "Preprint arXiv (versi terbit: Measurement)"
  },
  "ev-cdu11-v05-1": {
    "url": "/assets/cdu11/journal/g34.webp",
    "attribution": "G34 · Kourousis dkk. (2025) - KO25: Fig. 2 - C-scan AUT sebaran indikasi HIC.",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-v05-2": {
    "url": "/assets/cdu11/journal/g35.webp",
    "attribution": "G35 · Kourousis dkk. (2025) - KO25: Fig. 3 - tampilan PAUT (B-scan, S-scan, C-scan).",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-v07-1": {
    "url": "/assets/cdu11/evidences/foto_clay_jenuh_11v113a.webp",
    "attribution": "Dokumentasi Inspeksi Bed Clay Treater 11-V-113A",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-v07-2": {
    "url": "/assets/cdu11/evidences/cdu11-v07_trend_dp_saybolt_pascaganti_11v113.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-v08-1": {
    "url": "/assets/cdu11/evidences/foto_kristal_putih_las_11v106.webp",
    "attribution": "Dokumentasi Inspeksi Visual Sambungan Las 11-V-106",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-v08-2": {
    "url": "/assets/cdu11/journal/g35.webp",
    "attribution": "G35 · Kourousis dkk. (2025) - KO25: Fig. 3 - tampilan PAUT (B-scan, S-scan, C-scan).",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-v10-1": {
    "url": "/assets/cdu11/evidences/foto_uji_sabun_flange_11e121.webp",
    "attribution": "Dokumentasi Uji Sabun Fitting Tubing Seal Pot 11-P-112-B-V1",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-v10-2": {
    "url": "/assets/cdu11/evidences/cdu11-v10_ut_reservoir_11p112bv1.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p01-1": {
    "url": "/assets/cdu11/journal/g40.webp",
    "attribution": "G40 · Zhu dkk. (2023) - ZH23: Fig. 9 - perubahan tingkat vibrasi badan pompa saat kavitasi.",
    "license": "CC BY"
  },
  "ev-cdu11-p01-2": {
    "url": "/assets/cdu11/journal/g38.webp",
    "attribution": "G38 · Zhu dkk. (2023) - ZH23: Fig. 4 - sudu impeller yang rusak akibat kavitasi.",
    "license": "CC BY"
  },
  "ev-cdu11-p02-1": {
    "url": "/assets/cdu11/journal/g46.webp",
    "attribution": "G46 · Fitrian & Kundori (2025) - FI25: Tabel 2 (bukan gambar) - nilai vibrasi RMS per titik NDE/DE pada arah aksial, horizontal, dan vertikal pompa crude P100/3.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-p02-2": {
    "url": "/assets/cdu11/journal/g43.webp",
    "attribution": "G43 · Hou dkk. (2022) - HO22: Figure 4 - spalling kelelahan kontak pada raceway inner ring.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-p04-1": {
    "url": "/assets/cdu11/journal/g48.webp",
    "attribution": "G48 · Heel dkk. (2026) - TM26: Fig. 11 - seri pengukuran 2: variasi tekanan seal 6-11 bar pada 3600 rpm.",
    "license": "Diamond Open Access"
  },
  "ev-cdu11-p05-1": {
    "url": "/assets/cdu11/journal/g45.webp",
    "attribution": "G45 · Hou dkk. (2022) - HO22: Figure 9 - kerusakan pada raceway outer ring.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-p05-2": {
    "url": "/assets/cdu11/journal/g46.webp",
    "attribution": "G46 · Fitrian & Kundori (2025) - FI25: Tabel 2 (bukan gambar) - nilai vibrasi RMS per titik NDE/DE pada arah aksial, horizontal, dan vertikal pompa crude P100/3.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-p06-1": {
    "url": "/assets/cdu11/journal/g38.webp",
    "attribution": "G38 · Zhu dkk. (2023) - ZH23: Fig. 4 - sudu impeller yang rusak akibat kavitasi.",
    "license": "CC BY"
  },
  "ev-cdu11-p06-2": {
    "url": "/assets/cdu11/journal/g01.webp",
    "attribution": "G01 · Ahmed (2021) - AH21: Fig. 6 - temuan inspeksi di dalam kolom atmosferik: tray 28 dan tray 24 berlubang, nozzle kerosene tersumbat.",
    "license": "CC BY"
  },
  "ev-cdu11-p08-1": {
    "url": "/assets/cdu11/journal/g48.webp",
    "attribution": "G48 · Heel dkk. (2026) - TM26: Fig. 11 - seri pengukuran 2: variasi tekanan seal 6-11 bar pada 3600 rpm.",
    "license": "Diamond Open Access"
  },
  "ev-cdu11-p09-1": {
    "url": "/assets/cdu11/journal/g40.webp",
    "attribution": "G40 · Zhu dkk. (2023) - ZH23: Fig. 9 - perubahan tingkat vibrasi badan pompa saat kavitasi.",
    "license": "CC BY"
  },
  "ev-cdu11-p09-2": {
    "url": "/assets/cdu11/journal/g38.webp",
    "attribution": "G38 · Zhu dkk. (2023) - ZH23: Fig. 4 - sudu impeller yang rusak akibat kavitasi.",
    "license": "CC BY"
  },
  "ev-cdu11-p10-1": {
    "url": "/assets/cdu11/journal/g43.webp",
    "attribution": "G43 · Hou dkk. (2022) - HO22: Figure 4 - spalling kelelahan kontak pada raceway inner ring.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-p10-2": {
    "url": "/assets/cdu11/journal/g45.webp",
    "attribution": "G45 · Hou dkk. (2022) - HO22: Figure 9 - kerusakan pada raceway outer ring.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-p12-1": {
    "url": "/assets/cdu11/journal/g38.webp",
    "attribution": "G38 · Zhu dkk. (2023) - ZH23: Fig. 4 - sudu impeller yang rusak akibat kavitasi.",
    "license": "CC BY"
  },
  "ev-cdu11-p12-2": {
    "url": "/assets/cdu11/evidences/cdu11-p12_uji_unjuk_kerja_pasca_11p111c.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G38)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p14-1": {
    "url": "/assets/cdu11/evidences/cdu11-p14_log_pengisian_reservoir_11p112c.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G41)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p15-1": {
    "url": "/assets/cdu11/journal/g46.webp",
    "attribution": "G46 · Fitrian & Kundori (2025) - FI25: Tabel 2 (bukan gambar) - nilai vibrasi RMS per titik NDE/DE pada arah aksial, horizontal, dan vertikal pompa crude P100/3.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-p16-1": {
    "url": "/assets/cdu11/journal/g47.webp",
    "attribution": "G47 · Heel dkk. (2026) - TM26: Fig. 10 - seri pengukuran 1: variasi kecepatan putar pada tekanan seal tetap 6 bar.",
    "license": "Diamond Open Access"
  },
  "ev-cdu11-p16-2": {
    "url": "/assets/cdu11/evidences/cdu11-p16_foto_katup_steamquench_rusak_11p108a.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G41, G47)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-i01-1": {
    "url": "/assets/cdu11/journal/g51.webp",
    "attribution": "G51 · Jin dkk. (2025) - JI25: Figure 7(d) - tampilan aus spool aktual dengan alur dalam di dekat pusat.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-i03-1": {
    "url": "/assets/cdu11/journal/g52.webp",
    "attribution": "G52 · Shang dkk. (2023) - SH23: Figure 3 - karakteristik OP-MV valve yang lengket.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-i04-1": {
    "url": "/assets/cdu11/journal/g06.webp",
    "attribution": "G06 · Chiofalo dkk. (2024) - CI24: Fig. 6 - tren ketebalan dinding side cut (termasuk HGO) dengan zoom periode pengolahan crude asam.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-i04-2": {
    "url": "/assets/cdu11/journal/g55.webp",
    "attribution": "G55 · Chiofalo dkk. (2024) - CI24: Fig. 4 - tren ketebalan dinding seksi preheat dan transfer line.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-i04-3": {
    "url": "/assets/cdu11/journal/g56.webp",
    "attribution": "G56 · Permana dkk. (2025) - PE25: Fig. 3 - emulator CAIS dan peta warna tingkat korosi pada PFD CDU.",
    "license": "Akses terbuka (jurnal)"
  },
  "ev-cdu11-i05-1": {
    "url": "/assets/cdu11/journal/g53.webp",
    "attribution": "G53 · Shang dkk. (2023) - SH23: Figure 4 - plot OP-MV dan OP-PV dengan valve yang lengket.",
    "license": "Akses terbuka (MDPI)"
  },
  "ev-cdu11-i05-2": {
    "url": "/assets/cdu11/evidences/cdu11-i05_plot_op_pv_sesudah_11fv033.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G53)",
    "license": "SYNQRA Engineering Telemetry"
  }
};

export const EVIDENCE_MEDIA_BY_ID: Record<string, MediaAssetEntry> = Object.fromEntries(
  Object.entries(EVIDENCE_MEDIA_META).map(([k, v]) => [
    k,
    { src: v.url, width: 1280, height: 800 },
  ])
);

export const EVIDENCE_MEDIA_BY_STORAGE_PATH: Record<string, string> = {
  "evidences/CDU11-C01/Trend_DP_SeksiAtas_11C106.png": "/assets/cdu11/journal/g04.webp",
  "evidences/CDU11-C01/GammaScan_11C106_GarisA-D.pdf": "/assets/cdu11/journal/g03.webp",
  "evidences/CDU11-C02/Trend_DP_TopTray_11C101.png": "/assets/cdu11/journal/g01.webp",
  "evidences/CDU11-C04/UT_Grid_Shell_Nozzle_11C103.pdf": "/assets/cdu11/journal/g05.webp",
  "evidences/CDU11-C04/Trend_ProbeUT_90hari_11C103.pdf": "/assets/cdu11/journal/g06.webp",
  "evidences/CDU11-C05/Trend_DP_SeksiAtas_11C104_30hari.png": "/assets/cdu11/journal/g36.webp",
  "evidences/CDU11-F01/IR_Thermography_11F101_Pass3.jpg": "/assets/cdu11/journal/g09.webp",
  "evidences/CDU11-F01/Trend_TMT_PassFlow_11F101.pdf": "/assets/cdu11/journal/g11.webp",
  "evidences/CDU11-E02/IRIS_Map_Tube_11E101.pdf": "/assets/cdu11/journal/g24.webp",
  "evidences/CDU11-E02/Hydrotest_Ulang_11E101.pdf": "/assets/cdu11/journal/g25.webp",
  "evidences/CDU11-E04/Banding_Duty_DP_11E103A_B.png": "/assets/cdu11/journal/g15.webp",
  "evidences/CDU11-E05/Foto_Endapan_Strainer_11P104.jpg": "/assets/cdu11/journal/g16.webp",
  "evidences/CDU11-E05/Lab_Klorida_Endapan_TPA.pdf": "/assets/cdu11/journal/g17.webp",
  "evidences/CDU11-E06/Trend_Suhu_Desalter_Inlet_11E105.png": "/assets/cdu11/journal/g31.webp",
  "evidences/CDU11-E08/Borescope_Inlet_Tube_11E128A.jpg": "/assets/cdu11/journal/g25.webp",
  "evidences/CDU11-E08/Trend_DP_Effluent_11E128A.png": "/assets/cdu11/journal/g22.webp",
  "evidences/CDU11-E09/Trend_Rd_11E106A_vs_Blend.png": "/assets/cdu11/journal/g15.webp",
  "evidences/CDU11-E09/Lab_Kompatibilitas_Blend_Crude.pdf": "/assets/cdu11/journal/g12.webp",
  "evidences/CDU11-E10/Trend_Efisiensi_Rd_11E107_8minggu.png": "/assets/cdu11/journal/g14.webp",
  "evidences/CDU11-E12/UT_Spot_Nozzle_11E109.pdf": "/assets/cdu11/journal/g06.webp",
  "evidences/CDU11-E13/Borescope_Deposit_11E110A.jpg": "/assets/cdu11/journal/g15.webp",
  "evidences/CDU11-E13/Trend_Efisiensi_PascaCleaning_11E110.pdf": "/assets/cdu11/journal/g14.webp",
  "evidences/CDU11-E14/Trend_Rd_11E111A_B.png": "/assets/cdu11/journal/g15.webp",
  "evidences/CDU11-E14/Trend_FuelGas_PascaCleaning_11F101.pdf": "/assets/cdu11/journal/g14.webp",
  "evidences/CDU11-E17/Trend_Duty_11E119_60hari.png": "/assets/cdu11/journal/g36.webp",
  "evidences/CDU11-E18/Foto_Uji_Sabun_Flange_11E121.jpg": "/assets/cdu11/journal/g33.webp",
  "evidences/CDU11-E18/Lab_NH3_H2S_Air_11V104.pdf": "/assets/cdu11/journal/g36.webp",
  "evidences/CDU11-E19/Foto_Bundle_11E120_Endapan.jpg": "/assets/cdu11/journal/g15.webp",
  "evidences/CDU11-E19/Trend_RVP_TBottom_PascaCleaning_11C104.pdf": "/assets/cdu11/evidences/cdu11-e19_trend_rvp_tbottom_pascacleaning_11c104.webp",
  "evidences/CDU11-E20/Lab_Saybolt_Kerosene_14hari.pdf": "/assets/cdu11/journal/g23.webp",
  "evidences/CDU11-E20/Data_Tekanan_Sisi_11E122.png": "/assets/cdu11/evidences/cdu11-e20_data_tekanan_sisi_11e122.webp",
  "evidences/CDU11-E21/Trend_Tekanan_11C105_vs_SuhuKondensat.png": "/assets/cdu11/journal/g24.webp",
  "evidences/CDU11-E22/Foto_Sirip_Berdebu_11E124.jpg": "/assets/cdu11/journal/g27.webp",
  "evidences/CDU11-E22/Trend_Suhu_Naphtha_PascaCleaning_11E124.pdf": "/assets/cdu11/journal/g26.webp",
  "evidences/CDU11-E23/Foto_Lapisan_Minyak_CoolingTower.jpg": "/assets/cdu11/journal/g25.webp",
  "evidences/CDU11-E23/Laporan_Uji_Tekanan_11E126.pdf": "/assets/cdu11/journal/g24.webp",
  "evidences/CDU11-E24/Foto_Kerak_Tube_11E118.jpg": "/assets/cdu11/journal/g25.webp",
  "evidences/CDU11-E24/Trend_Suhu_Kerosene_PascaCleaning_11E118.pdf": "/assets/cdu11/evidences/cdu11-e24_trend_suhu_kerosene_pascacleaning_11e118.webp",
  "evidences/CDU11-E26/Foto_Sampel_Kerosene_Berkabut_11E127.jpg": "/assets/cdu11/journal/g23.webp",
  "evidences/CDU11-E26/Lab_Air_Klorida_Inhibitor.pdf": "/assets/cdu11/evidences/cdu11-e26_lab_air_klorida_inhibitor.webp",
  "evidences/CDU11-E27/Trend_DP_vs_SuhuUdara_11E112.png": "/assets/cdu11/journal/g27.webp",
  "evidences/CDU11-V02/Lab_pH_Fe_SourWater_11V116_14hari.pdf": "/assets/cdu11/journal/g32.webp",
  "evidences/CDU11-V03/UT_Boot_11V102.pdf": "/assets/cdu11/journal/g19.webp",
  "evidences/CDU11-V03/Trend_pH_Fe_ER_90hari_11V102.pdf": "/assets/cdu11/journal/g32.webp",
  "evidences/CDU11-V04/Foto_GasTip_Tersumbat_11F101.jpg": "/assets/cdu11/journal/g09.webp",
  "evidences/CDU11-V05/AUT_Cscan_11V104_Boot.png": "/assets/cdu11/journal/g34.webp",
  "evidences/CDU11-V05/PAUT_Sizing_11V104.pdf": "/assets/cdu11/journal/g35.webp",
  "evidences/CDU11-V07/Foto_Clay_Jenuh_11V113A.jpg": "/assets/cdu11/evidences/foto_clay_jenuh_11v113a.webp",
  "evidences/CDU11-V07/Trend_DP_Saybolt_PascaGanti_11V113.pdf": "/assets/cdu11/evidences/cdu11-v07_trend_dp_saybolt_pascaganti_11v113.webp",
  "evidences/CDU11-V08/Foto_Kristal_Putih_Las_11V106.jpg": "/assets/cdu11/evidences/foto_kristal_putih_las_11v106.webp",
  "evidences/CDU11-V08/WFMT_Retak_HAZ_11V106.pdf": "/assets/cdu11/journal/g35.webp",
  "evidences/CDU11-V10/Foto_Fitting_Rembes_11P112BV1.jpg": "/assets/cdu11/evidences/foto_uji_sabun_flange_11e121.webp",
  "evidences/CDU11-V10/UT_Reservoir_11P112BV1.pdf": "/assets/cdu11/evidences/cdu11-v10_ut_reservoir_11p112bv1.webp",
  "evidences/CDU11-P01/Spektrum_Vibrasi_11P101A.pdf": "/assets/cdu11/journal/g40.webp",
  "evidences/CDU11-P01/Foto_Impeller_11P101A.jpg": "/assets/cdu11/journal/g38.webp",
  "evidences/CDU11-P02/Vibrasi_ISO10816_11P102A.pdf": "/assets/cdu11/journal/g46.webp",
  "evidences/CDU11-P02/FFT_NDE_11P102A.png": "/assets/cdu11/journal/g43.webp",
  "evidences/CDU11-P04/Bacaan_H2S_Gland_11P126A.png": "/assets/cdu11/journal/g48.webp",
  "evidences/CDU11-P05/Laser_Alignment_Sebelum_Sesudah_11P132B.pdf": "/assets/cdu11/journal/g45.webp",
  "evidences/CDU11-P05/Vibrasi_PascaAlignment_11P132B.pdf": "/assets/cdu11/journal/g46.webp",
  "evidences/CDU11-P06/Kurva_Head_Lapangan_11P104.png": "/assets/cdu11/journal/g38.webp",
  "evidences/CDU11-P06/Foto_Endapan_Strainer_11P104.jpg": "/assets/cdu11/journal/g01.webp",
  "evidences/CDU11-P08/Foto_Tetesan_Seal_11P106.jpg": "/assets/cdu11/journal/g48.webp",
  "evidences/CDU11-P09/Spektrum_Vibrasi_11P115.pdf": "/assets/cdu11/journal/g40.webp",
  "evidences/CDU11-P09/Hitungan_NPSHa_11P115.xlsx": "/assets/cdu11/journal/g38.webp",
  "evidences/CDU11-P10/Envelope_BPFO_11P103C.pdf": "/assets/cdu11/journal/g43.webp",
  "evidences/CDU11-P10/Foto_Bearing_Spalling_11P103C.jpg": "/assets/cdu11/journal/g45.webp",
  "evidences/CDU11-P12/Kurva_Head_Sebelum_11P111C.png": "/assets/cdu11/journal/g38.webp",
  "evidences/CDU11-P12/Uji_Unjuk_Kerja_Pasca_11P111C.pdf": "/assets/cdu11/evidences/cdu11-p12_uji_unjuk_kerja_pasca_11p111c.webp",
  "evidences/CDU11-P14/Log_Pengisian_Reservoir_11P112C.xlsx": "/assets/cdu11/evidences/cdu11-p14_log_pengisian_reservoir_11p112c.webp",
  "evidences/CDU11-P15/Titik_Operasi_vs_Kurva_11P107A.png": "/assets/cdu11/journal/g46.webp",
  "evidences/CDU11-P16/Foto_Kokas_Gland_11P108A.jpg": "/assets/cdu11/journal/g47.webp",
  "evidences/CDU11-P16/Foto_Katup_SteamQuench_Rusak_11P108A.jpg": "/assets/cdu11/evidences/cdu11-p16_foto_katup_steamquench_rusak_11p108a.webp",
  "evidences/CDU11-I01/Trend_Bukaan_11LV030.png": "/assets/cdu11/journal/g51.webp",
  "evidences/CDU11-I03/Diagnostik_Positioner_11FV032.pdf": "/assets/cdu11/journal/g52.webp",
  "evidences/CDU11-I04/UT_Grid_Elbow_Hilir_11FV031.pdf": "/assets/cdu11/journal/g06.webp",
  "evidences/CDU11-I04/Foto_Trim_11FV031.jpg": "/assets/cdu11/journal/g55.webp",
  "evidences/CDU11-I04/Data_TAN_HGO_CAIS.xlsx": "/assets/cdu11/journal/g56.webp",
  "evidences/CDU11-I05/Plot_OP_PV_Sebelum_11FV033.png": "/assets/cdu11/journal/g53.webp",
  "evidences/CDU11-I05/Plot_OP_PV_Sesudah_11FV033.png": "/assets/cdu11/evidences/cdu11-i05_plot_op_pv_sesudah_11fv033.webp"
};

/**
 * Mengembalikan URL asset WebP bawaan dan metadata atribusi jika bukti berasal dari katalog CDU 11.
 */
export function resolveBuiltInEvidenceUrl(ev: {
  id?: string;
  storage_path?: string;
}): string | undefined {
  if (ev.id && EVIDENCE_MEDIA_META[ev.id]) {
    return EVIDENCE_MEDIA_META[ev.id].url;
  }
  if (ev.storage_path && EVIDENCE_MEDIA_BY_STORAGE_PATH[ev.storage_path]) {
    return EVIDENCE_MEDIA_BY_STORAGE_PATH[ev.storage_path];
  }
  return undefined;
}
