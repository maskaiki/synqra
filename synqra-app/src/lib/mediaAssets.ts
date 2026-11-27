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
  "G07": "/assets/cdu11/journal/g07.webp",
  "G10": "/assets/cdu11/journal/g10.webp",
  "G11": "/assets/cdu11/journal/g11.webp",
  "G18": "/assets/cdu11/journal/g18.webp",
  "G19": "/assets/cdu11/journal/g19.webp",
  "G20": "/assets/cdu11/journal/g20.webp",
  "G23": "/assets/cdu11/journal/g23.webp",
  "G24": "/assets/cdu11/journal/g24.webp",
  "G25": "/assets/cdu11/journal/g25.webp",
  "G28": "/assets/cdu11/journal/g28.webp",
  "G29": "/assets/cdu11/journal/g29.webp",
  "G31": "/assets/cdu11/journal/g31.webp",
  "G32": "/assets/cdu11/journal/g32.webp",
  "G33": "/assets/cdu11/journal/g33.webp",
  "G34": "/assets/cdu11/journal/g34.webp",
  "G35": "/assets/cdu11/journal/g35.webp",
  "G38": "/assets/cdu11/journal/g38.webp",
  "G39": "/assets/cdu11/journal/g39.webp",
  "G40": "/assets/cdu11/journal/g40.webp",
  "G42": "/assets/cdu11/journal/g42.webp",
  "G43": "/assets/cdu11/journal/g43.webp",
  "G44": "/assets/cdu11/journal/g44.webp",
  "G45": "/assets/cdu11/journal/g45.webp",
  "G49": "/assets/cdu11/journal/g49.webp",
  "G50": "/assets/cdu11/journal/g50.webp",
  "G51": "/assets/cdu11/journal/g51.webp",
  "G52": "/assets/cdu11/journal/g52.webp",
  "G53": "/assets/cdu11/journal/g53.webp",
  "G54": "/assets/cdu11/journal/g54.webp"
};

export const EVIDENCE_MEDIA_META: Record<string, EvidenceMediaMeta> = {
  "ev-cdu11-c01-1": {
    "url": "/assets/cdu11/evidences/cdu11-c01_trend_dp_seksiatas_11c106.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G03, G04)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-c01-2": {
    "url": "/assets/cdu11/evidences/cdu11-c01_gammascan_11c106_garisa_d.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G03, G04)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-c02-1": {
    "url": "/assets/cdu11/evidences/cdu11-c02_trend_dp_toptray_11c101.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G01, G02, G07)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-c04-1": {
    "url": "/assets/cdu11/evidences/cdu11-c04_ut_grid_shell_nozzle_11c103.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G05, G06)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-c04-2": {
    "url": "/assets/cdu11/evidences/cdu11-c04_trend_probeut_90hari_11c103.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G05, G06)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-c05-1": {
    "url": "/assets/cdu11/evidences/cdu11-c05_trend_dp_seksiatas_11c104_30hari.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G36, G33)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-f01-1": {
    "url": "/assets/cdu11/evidences/ir_thermography_11f101_pass3.webp",
    "attribution": "Simulasi Termografi Lapangan SYNQRA ( mengacu MA22 / DU26 )",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-f01-2": {
    "url": "/assets/cdu11/evidences/cdu11-f01_trend_tmt_passflow_11f101.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G08, G09, G10, G11)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e02-1": {
    "url": "/assets/cdu11/evidences/cdu11-e02_iris_map_tube_11e101.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G24, G25)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e02-2": {
    "url": "/assets/cdu11/evidences/cdu11-e02_hydrotest_ulang_11e101.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G24, G25)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e04-1": {
    "url": "/assets/cdu11/evidences/cdu11-e04_banding_duty_dp_11e103a_b.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G15, G12)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e05-1": {
    "url": "/assets/cdu11/evidences/foto_endapan_strainer_11p104.webp",
    "attribution": "Dokumentasi Simulasi Inspeksi Strainer 11-P-104 ( mengacu AH21 )",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-e05-2": {
    "url": "/assets/cdu11/evidences/cdu11-e05_lab_klorida_endapan_tpa.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G16, G17)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e06-1": {
    "url": "/assets/cdu11/evidences/cdu11-e06_trend_suhu_desalter_inlet_11e105.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G31, G30)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e08-1": {
    "url": "/assets/cdu11/journal/g25.webp",
    "attribution": "Ardy dkk. (2023) Metals 13(7):1182, Fig. 4 - Penampang endapan & penipisan dalam tube HE",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-e08-2": {
    "url": "/assets/cdu11/evidences/cdu11-e08_trend_dp_effluent_11e128a.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G25, G22)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e09-1": {
    "url": "/assets/cdu11/evidences/cdu11-e09_trend_rd_11e106a_vs_blend.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G15, G12)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e09-2": {
    "url": "/assets/cdu11/evidences/cdu11-e09_lab_kompatibilitas_blend_crude.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G15, G12)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e10-1": {
    "url": "/assets/cdu11/evidences/cdu11-e10_trend_efisiensi_rd_11e107_8minggu.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G12, G13, G14)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e12-1": {
    "url": "/assets/cdu11/evidences/cdu11-e12_ut_spot_nozzle_11e109.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G06, G05)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e13-1": {
    "url": "/assets/cdu11/evidences/borescope_deposit_11e110a.webp",
    "attribution": "Inspeksi Borescope Tube Bundle 11-E-110A ( mengacu AL24 / YU21 )",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-e13-2": {
    "url": "/assets/cdu11/evidences/cdu11-e13_trend_efisiensi_pascacleaning_11e110.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G14, G15)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e14-1": {
    "url": "/assets/cdu11/evidences/cdu11-e14_trend_rd_11e111a_b.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G15, G14)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e14-2": {
    "url": "/assets/cdu11/evidences/cdu11-e14_trend_fuelgas_pascacleaning_11f101.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G15, G14)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e17-1": {
    "url": "/assets/cdu11/evidences/cdu11-e17_trend_duty_11e119_60hari.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G36, G32)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e18-1": {
    "url": "/assets/cdu11/evidences/foto_uji_sabun_flange_11e121.webp",
    "attribution": "Dokumentasi Uji Gelembung Sabun Flange 11-E-121",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-e18-2": {
    "url": "/assets/cdu11/evidences/cdu11-e18_lab_nh3_h2s_air_11v104.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G36, G33)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e19-1": {
    "url": "/assets/cdu11/evidences/cdu11-e19_foto_bundle_11e120_endapan.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G15)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e19-2": {
    "url": "/assets/cdu11/evidences/cdu11-e19_trend_rvp_tbottom_pascacleaning_11c104.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G15)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e20-1": {
    "url": "/assets/cdu11/evidences/cdu11-e20_lab_saybolt_kerosene_14hari.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G23)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e20-2": {
    "url": "/assets/cdu11/evidences/cdu11-e20_data_tekanan_sisi_11e122.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G23)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e21-1": {
    "url": "/assets/cdu11/evidences/cdu11-e21_trend_tekanan_11c105_vs_suhukondensat.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G24, G25)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e22-1": {
    "url": "/assets/cdu11/evidences/cdu11-e22_foto_sirip_berdebu_11e124.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G26, G27)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e22-2": {
    "url": "/assets/cdu11/evidences/cdu11-e22_trend_suhu_naphtha_pascacleaning_11e124.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G26, G27)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e23-1": {
    "url": "/assets/cdu11/evidences/cdu11-e23_foto_lapisan_minyak_coolingtower.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G24, G25)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e23-2": {
    "url": "/assets/cdu11/evidences/cdu11-e23_laporan_uji_tekanan_11e126.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G24, G25)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e24-1": {
    "url": "/assets/cdu11/evidences/cdu11-e24_foto_kerak_tube_11e118.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G25)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e24-2": {
    "url": "/assets/cdu11/evidences/cdu11-e24_trend_suhu_kerosene_pascacleaning_11e118.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G25)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e26-1": {
    "url": "/assets/cdu11/evidences/cdu11-e26_foto_sampel_kerosene_berkabut_11e127.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G23)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e26-2": {
    "url": "/assets/cdu11/evidences/cdu11-e26_lab_air_klorida_inhibitor.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G23)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-e27-1": {
    "url": "/assets/cdu11/evidences/cdu11-e27_trend_dp_vs_suhuudara_11e112.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G27)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-v02-1": {
    "url": "/assets/cdu11/evidences/cdu11-v02_lab_ph_fe_sourwater_11v116_14hari.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G32, G19)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-v03-1": {
    "url": "/assets/cdu11/evidences/cdu11-v03_ut_boot_11v102.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G32, G19, G20, G17)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-v03-2": {
    "url": "/assets/cdu11/evidences/cdu11-v03_trend_ph_fe_er_90hari_11v102.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G32, G19, G20, G17)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-v04-1": {
    "url": "/assets/cdu11/evidences/cdu11-v04_foto_gastip_tersumbat_11f101.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G09)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-v05-1": {
    "url": "/assets/cdu11/journal/g34.webp",
    "attribution": "Kourousis dkk. (2025) Eng. Proc. 119(1):22, Fig. 2 - Peta C-scan AUT indikasi HIC",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-v05-2": {
    "url": "/assets/cdu11/journal/g35.webp",
    "attribution": "Kourousis dkk. (2025) Eng. Proc. 119(1):22, Fig. 3 - Tampilan PAUT B-scan/S-scan/C-scan",
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
    "url": "/assets/cdu11/evidences/cdu11-v08_wfmt_retak_haz_11v106.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G35)",
    "license": "SYNQRA Engineering Telemetry"
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
    "url": "/assets/cdu11/evidences/cdu11-p01_spektrum_vibrasi_11p101a.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G38, G39, G40)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p01-2": {
    "url": "/assets/cdu11/journal/g38.webp",
    "attribution": "Zhu dkk. (2023) Water 16(1):52, Fig. 4 - Sudu impeller mengalami pitting kavitasi",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-p02-1": {
    "url": "/assets/cdu11/evidences/cdu11-p02_vibrasi_iso10816_11p102a.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G46, G42, G43)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p02-2": {
    "url": "/assets/cdu11/evidences/cdu11-p02_fft_nde_11p102a.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G46, G42, G43)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p04-1": {
    "url": "/assets/cdu11/evidences/bacaan_h2s_gland_11p126a.webp",
    "attribution": "Dokumentasi Detektor Gas Portabel Area Gland Seal 11-P-126A",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-p05-1": {
    "url": "/assets/cdu11/evidences/cdu11-p05_laser_alignment_sebelum_sesudah_11p132b.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G45, G46)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p05-2": {
    "url": "/assets/cdu11/evidences/cdu11-p05_vibrasi_pascaalignment_11p132b.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G45, G46)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p06-1": {
    "url": "/assets/cdu11/evidences/cdu11-p06_kurva_head_lapangan_11p104.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G01, G38)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p06-2": {
    "url": "/assets/cdu11/evidences/foto_endapan_strainer_11p104.webp",
    "attribution": "Dokumentasi Simulasi Inspeksi Strainer 11-P-104 ( mengacu AH21 )",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-p08-1": {
    "url": "/assets/cdu11/evidences/foto_tetesan_seal_11p106.webp",
    "attribution": "Dokumentasi Inspeksi Area Gland Seal 11-P-106 ( mengacu PN25 )",
    "license": "Internal SYNQRA"
  },
  "ev-cdu11-p09-1": {
    "url": "/assets/cdu11/evidences/cdu11-p09_spektrum_vibrasi_11p115.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G38, G40)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p09-2": {
    "url": "/assets/cdu11/evidences/cdu11-p09_hitungan_npsha_11p115.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G38, G40)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p10-1": {
    "url": "/assets/cdu11/evidences/cdu11-p10_envelope_bpfo_11p103c.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G45, G43)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p10-2": {
    "url": "/assets/cdu11/journal/g45.webp",
    "attribution": "Hou dkk. (2022) Appl. Sci. 12(19):9658, Fig. 9 - Spalling lintasan luar bearing (BPFO)",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-p12-1": {
    "url": "/assets/cdu11/evidences/cdu11-p12_kurva_head_sebelum_11p111c.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G38)",
    "license": "SYNQRA Engineering Telemetry"
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
    "url": "/assets/cdu11/evidences/cdu11-p15_titik_operasi_vs_kurva_11p107a.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G46, G40)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p16-1": {
    "url": "/assets/cdu11/evidences/cdu11-p16_foto_kokas_gland_11p108a.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G41, G47)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-p16-2": {
    "url": "/assets/cdu11/evidences/cdu11-p16_foto_katup_steamquench_rusak_11p108a.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G41, G47)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-i01-1": {
    "url": "/assets/cdu11/evidences/cdu11-i01_trend_bukaan_11lv030.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G49, G50, G51)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-i03-1": {
    "url": "/assets/cdu11/evidences/cdu11-i03_diagnostik_positioner_11fv032.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G52)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-i04-1": {
    "url": "/assets/cdu11/evidences/cdu11-i04_ut_grid_elbow_hilir_11fv031.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G06, G55, G56, G57)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-i04-2": {
    "url": "/assets/cdu11/journal/g49.webp",
    "attribution": "Jin dkk. (2025) Fluids 10(4):99, Fig. 3 - Morfologi erosi-kavitasi permukaan trim valve",
    "license": "CC BY 4.0"
  },
  "ev-cdu11-i04-3": {
    "url": "/assets/cdu11/evidences/cdu11-i04_data_tan_hgo_cais.webp",
    "attribution": "Visualisasi Telemetri & Inspeksi Unit 11 CDU Balongan (rujukan format: G06, G55, G56, G57)",
    "license": "SYNQRA Engineering Telemetry"
  },
  "ev-cdu11-i05-1": {
    "url": "/assets/cdu11/journal/g53.webp",
    "attribution": "Shang dkk. (2023) Processes 11(7):1913, Fig. 4 - Karakteristik plot OP-PV katup mengalami stiction",
    "license": "CC BY 4.0"
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
  "evidences/CDU11-C01/Trend_DP_SeksiAtas_11C106.png": "/assets/cdu11/evidences/cdu11-c01_trend_dp_seksiatas_11c106.webp",
  "evidences/CDU11-C01/GammaScan_11C106_GarisA-D.pdf": "/assets/cdu11/evidences/cdu11-c01_gammascan_11c106_garisa_d.webp",
  "evidences/CDU11-C02/Trend_DP_TopTray_11C101.png": "/assets/cdu11/evidences/cdu11-c02_trend_dp_toptray_11c101.webp",
  "evidences/CDU11-C04/UT_Grid_Shell_Nozzle_11C103.pdf": "/assets/cdu11/evidences/cdu11-c04_ut_grid_shell_nozzle_11c103.webp",
  "evidences/CDU11-C04/Trend_ProbeUT_90hari_11C103.pdf": "/assets/cdu11/evidences/cdu11-c04_trend_probeut_90hari_11c103.webp",
  "evidences/CDU11-C05/Trend_DP_SeksiAtas_11C104_30hari.png": "/assets/cdu11/evidences/cdu11-c05_trend_dp_seksiatas_11c104_30hari.webp",
  "evidences/CDU11-F01/IR_Thermography_11F101_Pass3.jpg": "/assets/cdu11/evidences/ir_thermography_11f101_pass3.webp",
  "evidences/CDU11-F01/Trend_TMT_PassFlow_11F101.pdf": "/assets/cdu11/evidences/cdu11-f01_trend_tmt_passflow_11f101.webp",
  "evidences/CDU11-E02/IRIS_Map_Tube_11E101.pdf": "/assets/cdu11/evidences/cdu11-e02_iris_map_tube_11e101.webp",
  "evidences/CDU11-E02/Hydrotest_Ulang_11E101.pdf": "/assets/cdu11/evidences/cdu11-e02_hydrotest_ulang_11e101.webp",
  "evidences/CDU11-E04/Banding_Duty_DP_11E103A_B.png": "/assets/cdu11/evidences/cdu11-e04_banding_duty_dp_11e103a_b.webp",
  "evidences/CDU11-E05/Foto_Endapan_Strainer_11P104.jpg": "/assets/cdu11/evidences/foto_endapan_strainer_11p104.webp",
  "evidences/CDU11-E05/Lab_Klorida_Endapan_TPA.pdf": "/assets/cdu11/evidences/cdu11-e05_lab_klorida_endapan_tpa.webp",
  "evidences/CDU11-E06/Trend_Suhu_Desalter_Inlet_11E105.png": "/assets/cdu11/evidences/cdu11-e06_trend_suhu_desalter_inlet_11e105.webp",
  "evidences/CDU11-E08/Borescope_Inlet_Tube_11E128A.jpg": "/assets/cdu11/journal/g25.webp",
  "evidences/CDU11-E08/Trend_DP_Effluent_11E128A.png": "/assets/cdu11/evidences/cdu11-e08_trend_dp_effluent_11e128a.webp",
  "evidences/CDU11-E09/Trend_Rd_11E106A_vs_Blend.png": "/assets/cdu11/evidences/cdu11-e09_trend_rd_11e106a_vs_blend.webp",
  "evidences/CDU11-E09/Lab_Kompatibilitas_Blend_Crude.pdf": "/assets/cdu11/evidences/cdu11-e09_lab_kompatibilitas_blend_crude.webp",
  "evidences/CDU11-E10/Trend_Efisiensi_Rd_11E107_8minggu.png": "/assets/cdu11/evidences/cdu11-e10_trend_efisiensi_rd_11e107_8minggu.webp",
  "evidences/CDU11-E12/UT_Spot_Nozzle_11E109.pdf": "/assets/cdu11/evidences/cdu11-e12_ut_spot_nozzle_11e109.webp",
  "evidences/CDU11-E13/Borescope_Deposit_11E110A.jpg": "/assets/cdu11/evidences/borescope_deposit_11e110a.webp",
  "evidences/CDU11-E13/Trend_Efisiensi_PascaCleaning_11E110.pdf": "/assets/cdu11/evidences/cdu11-e13_trend_efisiensi_pascacleaning_11e110.webp",
  "evidences/CDU11-E14/Trend_Rd_11E111A_B.png": "/assets/cdu11/evidences/cdu11-e14_trend_rd_11e111a_b.webp",
  "evidences/CDU11-E14/Trend_FuelGas_PascaCleaning_11F101.pdf": "/assets/cdu11/evidences/cdu11-e14_trend_fuelgas_pascacleaning_11f101.webp",
  "evidences/CDU11-E17/Trend_Duty_11E119_60hari.png": "/assets/cdu11/evidences/cdu11-e17_trend_duty_11e119_60hari.webp",
  "evidences/CDU11-E18/Foto_Uji_Sabun_Flange_11E121.jpg": "/assets/cdu11/evidences/foto_uji_sabun_flange_11e121.webp",
  "evidences/CDU11-E18/Lab_NH3_H2S_Air_11V104.pdf": "/assets/cdu11/evidences/cdu11-e18_lab_nh3_h2s_air_11v104.webp",
  "evidences/CDU11-E19/Foto_Bundle_11E120_Endapan.jpg": "/assets/cdu11/evidences/cdu11-e19_foto_bundle_11e120_endapan.webp",
  "evidences/CDU11-E19/Trend_RVP_TBottom_PascaCleaning_11C104.pdf": "/assets/cdu11/evidences/cdu11-e19_trend_rvp_tbottom_pascacleaning_11c104.webp",
  "evidences/CDU11-E20/Lab_Saybolt_Kerosene_14hari.pdf": "/assets/cdu11/evidences/cdu11-e20_lab_saybolt_kerosene_14hari.webp",
  "evidences/CDU11-E20/Data_Tekanan_Sisi_11E122.png": "/assets/cdu11/evidences/cdu11-e20_data_tekanan_sisi_11e122.webp",
  "evidences/CDU11-E21/Trend_Tekanan_11C105_vs_SuhuKondensat.png": "/assets/cdu11/evidences/cdu11-e21_trend_tekanan_11c105_vs_suhukondensat.webp",
  "evidences/CDU11-E22/Foto_Sirip_Berdebu_11E124.jpg": "/assets/cdu11/evidences/cdu11-e22_foto_sirip_berdebu_11e124.webp",
  "evidences/CDU11-E22/Trend_Suhu_Naphtha_PascaCleaning_11E124.pdf": "/assets/cdu11/evidences/cdu11-e22_trend_suhu_naphtha_pascacleaning_11e124.webp",
  "evidences/CDU11-E23/Foto_Lapisan_Minyak_CoolingTower.jpg": "/assets/cdu11/evidences/cdu11-e23_foto_lapisan_minyak_coolingtower.webp",
  "evidences/CDU11-E23/Laporan_Uji_Tekanan_11E126.pdf": "/assets/cdu11/evidences/cdu11-e23_laporan_uji_tekanan_11e126.webp",
  "evidences/CDU11-E24/Foto_Kerak_Tube_11E118.jpg": "/assets/cdu11/evidences/cdu11-e24_foto_kerak_tube_11e118.webp",
  "evidences/CDU11-E24/Trend_Suhu_Kerosene_PascaCleaning_11E118.pdf": "/assets/cdu11/evidences/cdu11-e24_trend_suhu_kerosene_pascacleaning_11e118.webp",
  "evidences/CDU11-E26/Foto_Sampel_Kerosene_Berkabut_11E127.jpg": "/assets/cdu11/evidences/cdu11-e26_foto_sampel_kerosene_berkabut_11e127.webp",
  "evidences/CDU11-E26/Lab_Air_Klorida_Inhibitor.pdf": "/assets/cdu11/evidences/cdu11-e26_lab_air_klorida_inhibitor.webp",
  "evidences/CDU11-E27/Trend_DP_vs_SuhuUdara_11E112.png": "/assets/cdu11/evidences/cdu11-e27_trend_dp_vs_suhuudara_11e112.webp",
  "evidences/CDU11-V02/Lab_pH_Fe_SourWater_11V116_14hari.pdf": "/assets/cdu11/evidences/cdu11-v02_lab_ph_fe_sourwater_11v116_14hari.webp",
  "evidences/CDU11-V03/UT_Boot_11V102.pdf": "/assets/cdu11/evidences/cdu11-v03_ut_boot_11v102.webp",
  "evidences/CDU11-V03/Trend_pH_Fe_ER_90hari_11V102.pdf": "/assets/cdu11/evidences/cdu11-v03_trend_ph_fe_er_90hari_11v102.webp",
  "evidences/CDU11-V04/Foto_GasTip_Tersumbat_11F101.jpg": "/assets/cdu11/evidences/cdu11-v04_foto_gastip_tersumbat_11f101.webp",
  "evidences/CDU11-V05/AUT_Cscan_11V104_Boot.png": "/assets/cdu11/journal/g34.webp",
  "evidences/CDU11-V05/PAUT_Sizing_11V104.pdf": "/assets/cdu11/journal/g35.webp",
  "evidences/CDU11-V07/Foto_Clay_Jenuh_11V113A.jpg": "/assets/cdu11/evidences/foto_clay_jenuh_11v113a.webp",
  "evidences/CDU11-V07/Trend_DP_Saybolt_PascaGanti_11V113.pdf": "/assets/cdu11/evidences/cdu11-v07_trend_dp_saybolt_pascaganti_11v113.webp",
  "evidences/CDU11-V08/Foto_Kristal_Putih_Las_11V106.jpg": "/assets/cdu11/evidences/foto_kristal_putih_las_11v106.webp",
  "evidences/CDU11-V08/WFMT_Retak_HAZ_11V106.pdf": "/assets/cdu11/evidences/cdu11-v08_wfmt_retak_haz_11v106.webp",
  "evidences/CDU11-V10/Foto_Fitting_Rembes_11P112BV1.jpg": "/assets/cdu11/evidences/foto_uji_sabun_flange_11e121.webp",
  "evidences/CDU11-V10/UT_Reservoir_11P112BV1.pdf": "/assets/cdu11/evidences/cdu11-v10_ut_reservoir_11p112bv1.webp",
  "evidences/CDU11-P01/Spektrum_Vibrasi_11P101A.pdf": "/assets/cdu11/evidences/cdu11-p01_spektrum_vibrasi_11p101a.webp",
  "evidences/CDU11-P01/Foto_Impeller_11P101A.jpg": "/assets/cdu11/journal/g38.webp",
  "evidences/CDU11-P02/Vibrasi_ISO10816_11P102A.pdf": "/assets/cdu11/evidences/cdu11-p02_vibrasi_iso10816_11p102a.webp",
  "evidences/CDU11-P02/FFT_NDE_11P102A.png": "/assets/cdu11/evidences/cdu11-p02_fft_nde_11p102a.webp",
  "evidences/CDU11-P04/Bacaan_H2S_Gland_11P126A.png": "/assets/cdu11/evidences/bacaan_h2s_gland_11p126a.webp",
  "evidences/CDU11-P05/Laser_Alignment_Sebelum_Sesudah_11P132B.pdf": "/assets/cdu11/evidences/cdu11-p05_laser_alignment_sebelum_sesudah_11p132b.webp",
  "evidences/CDU11-P05/Vibrasi_PascaAlignment_11P132B.pdf": "/assets/cdu11/evidences/cdu11-p05_vibrasi_pascaalignment_11p132b.webp",
  "evidences/CDU11-P06/Kurva_Head_Lapangan_11P104.png": "/assets/cdu11/evidences/cdu11-p06_kurva_head_lapangan_11p104.webp",
  "evidences/CDU11-P06/Foto_Endapan_Strainer_11P104.jpg": "/assets/cdu11/evidences/foto_endapan_strainer_11p104.webp",
  "evidences/CDU11-P08/Foto_Tetesan_Seal_11P106.jpg": "/assets/cdu11/evidences/foto_tetesan_seal_11p106.webp",
  "evidences/CDU11-P09/Spektrum_Vibrasi_11P115.pdf": "/assets/cdu11/evidences/cdu11-p09_spektrum_vibrasi_11p115.webp",
  "evidences/CDU11-P09/Hitungan_NPSHa_11P115.xlsx": "/assets/cdu11/evidences/cdu11-p09_hitungan_npsha_11p115.webp",
  "evidences/CDU11-P10/Envelope_BPFO_11P103C.pdf": "/assets/cdu11/evidences/cdu11-p10_envelope_bpfo_11p103c.webp",
  "evidences/CDU11-P10/Foto_Bearing_Spalling_11P103C.jpg": "/assets/cdu11/journal/g45.webp",
  "evidences/CDU11-P12/Kurva_Head_Sebelum_11P111C.png": "/assets/cdu11/evidences/cdu11-p12_kurva_head_sebelum_11p111c.webp",
  "evidences/CDU11-P12/Uji_Unjuk_Kerja_Pasca_11P111C.pdf": "/assets/cdu11/evidences/cdu11-p12_uji_unjuk_kerja_pasca_11p111c.webp",
  "evidences/CDU11-P14/Log_Pengisian_Reservoir_11P112C.xlsx": "/assets/cdu11/evidences/cdu11-p14_log_pengisian_reservoir_11p112c.webp",
  "evidences/CDU11-P15/Titik_Operasi_vs_Kurva_11P107A.png": "/assets/cdu11/evidences/cdu11-p15_titik_operasi_vs_kurva_11p107a.webp",
  "evidences/CDU11-P16/Foto_Kokas_Gland_11P108A.jpg": "/assets/cdu11/evidences/cdu11-p16_foto_kokas_gland_11p108a.webp",
  "evidences/CDU11-P16/Foto_Katup_SteamQuench_Rusak_11P108A.jpg": "/assets/cdu11/evidences/cdu11-p16_foto_katup_steamquench_rusak_11p108a.webp",
  "evidences/CDU11-I01/Trend_Bukaan_11LV030.png": "/assets/cdu11/evidences/cdu11-i01_trend_bukaan_11lv030.webp",
  "evidences/CDU11-I03/Diagnostik_Positioner_11FV032.pdf": "/assets/cdu11/evidences/cdu11-i03_diagnostik_positioner_11fv032.webp",
  "evidences/CDU11-I04/UT_Grid_Elbow_Hilir_11FV031.pdf": "/assets/cdu11/evidences/cdu11-i04_ut_grid_elbow_hilir_11fv031.webp",
  "evidences/CDU11-I04/Foto_Trim_11FV031.jpg": "/assets/cdu11/journal/g49.webp",
  "evidences/CDU11-I04/Data_TAN_HGO_CAIS.xlsx": "/assets/cdu11/evidences/cdu11-i04_data_tan_hgo_cais.webp",
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
