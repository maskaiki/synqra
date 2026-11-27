/**
 * SYNQRA DATABASE SEED SCRIPT — UNIT 11 (CDU) PT PERTAMINA RU VI BALONGAN
 * Memuat 66 Kode Tag peralatan nyata, 66 kasus terstruktur, bukti fisik & diskusi 2-arah.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0) {
        const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')
);

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

const SEED_ASSETS = [
  {
    "id": "11-C-106",
    "name": "Pre-Flash Column",
    "type": "column",
    "area": "Pre-Flash (RDMP) · Unit 11 CDU Balongan",
    "description": "Pre-Flash Column pada seksi Pre-Flash (RDMP), Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-C-101",
    "name": "Main Fractionator",
    "type": "column",
    "area": "Fraksinasi Utama · Unit 11 CDU Balongan",
    "description": "Main Fractionator pada seksi Fraksinasi Utama, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-C-102",
    "name": "LGO Stripper",
    "type": "stripper",
    "area": "Side Stripper · Unit 11 CDU Balongan",
    "description": "LGO Stripper pada seksi Side Stripper, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-C-103",
    "name": "HGO Stripper",
    "type": "stripper",
    "area": "Side Stripper · Unit 11 CDU Balongan",
    "description": "HGO Stripper pada seksi Side Stripper, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-C-104",
    "name": "Stabilizer",
    "type": "stripper",
    "area": "Stabilisasi Naphtha · Unit 11 CDU Balongan",
    "description": "Stabilizer pada seksi Stabilisasi Naphtha, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-C-105",
    "name": "Splitter (Naphtha-Kerosene)",
    "type": "stripper",
    "area": "Splitter · Unit 11 CDU Balongan",
    "description": "Splitter (Naphtha-Kerosene) pada seksi Splitter, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-F-101",
    "name": "Crude Furnace",
    "type": "furnace",
    "area": "Furnace · Unit 11 CDU Balongan",
    "description": "Crude Furnace pada seksi Furnace, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-129",
    "name": "Heat Exchanger (HE 1 di S1)",
    "type": "heat",
    "area": "Umpan & Cold Preheat · Unit 11 CDU Balongan",
    "description": "Heat Exchanger (HE 1 di S1) pada seksi Umpan & Cold Preheat, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-101",
    "name": "Cold Preheater (HE 2)",
    "type": "heat",
    "area": "Cold Preheat Train · Unit 11 CDU Balongan",
    "description": "Cold Preheater (HE 2) pada seksi Cold Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-102",
    "name": "Cold Preheater (HE 3)",
    "type": "heat",
    "area": "Cold Preheat Train · Unit 11 CDU Balongan",
    "description": "Cold Preheater (HE 3) pada seksi Cold Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-103 A/B",
    "name": "Cold Preheater (HE 4)",
    "type": "heat",
    "area": "Cold Preheat Train · Unit 11 CDU Balongan",
    "description": "Cold Preheater (HE 4) pada seksi Cold Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-E-104",
    "name": "Cold Preheater (HE 5)",
    "type": "heat",
    "area": "Cold Preheat Train · Unit 11 CDU Balongan",
    "description": "Cold Preheater (HE 5) pada seksi Cold Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-105 A/B",
    "name": "Cold Preheater (HE 6)",
    "type": "heat",
    "area": "Cold Preheat Train · Unit 11 CDU Balongan",
    "description": "Cold Preheater (HE 6) pada seksi Cold Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-E-116",
    "name": "Wash Water Heater",
    "type": "heat",
    "area": "Desalting · Unit 11 CDU Balongan",
    "description": "Wash Water Heater pada seksi Desalting, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-128 A/B",
    "name": "Exchanger Effluent Desalter 11-E-128",
    "type": "heat",
    "area": "Desalting · Unit 11 CDU Balongan",
    "description": "Exchanger Effluent Desalter 11-E-128 pada seksi Desalting, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-E-106 A/B",
    "name": "Hot Preheater (HE 7)",
    "type": "heat",
    "area": "Hot Preheat Train · Unit 11 CDU Balongan",
    "description": "Hot Preheater (HE 7) pada seksi Hot Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-E-107 A/B",
    "name": "Hot Preheater (HE 8)",
    "type": "heat",
    "area": "Hot Preheat Train · Unit 11 CDU Balongan",
    "description": "Hot Preheater (HE 8) pada seksi Hot Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-E-108",
    "name": "Hot Preheater (HE 9)",
    "type": "heat",
    "area": "Hot Preheat Train · Unit 11 CDU Balongan",
    "description": "Hot Preheater (HE 9) pada seksi Hot Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-109",
    "name": "Hot Preheater (HE 10)",
    "type": "heat",
    "area": "Hot Preheat Train · Unit 11 CDU Balongan",
    "description": "Hot Preheater (HE 10) pada seksi Hot Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-110 A/B",
    "name": "Hot Preheater (HE 16)",
    "type": "heat",
    "area": "Hot Preheat Train · Unit 11 CDU Balongan",
    "description": "Hot Preheater (HE 16) pada seksi Hot Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-E-111 A/B",
    "name": "Hot Preheater (HE 17)",
    "type": "heat",
    "area": "Hot Preheat Train · Unit 11 CDU Balongan",
    "description": "Hot Preheater (HE 17) pada seksi Hot Preheat Train, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-E-131",
    "name": "Pre-Flash Condenser (Kondensor 1)",
    "type": "heat",
    "area": "Pre-Flash (RDMP) · Unit 11 CDU Balongan",
    "description": "Pre-Flash Condenser (Kondensor 1) pada seksi Pre-Flash (RDMP), Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-114",
    "name": "Main Fractionator Overhead Condenser (Kondensor 2)",
    "type": "finfan",
    "area": "Sistem Overhead · Unit 11 CDU Balongan",
    "description": "Main Fractionator Overhead Condenser (Kondensor 2) pada seksi Sistem Overhead, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-119",
    "name": "Stabilizer Feed Heater (HE 12)",
    "type": "heat",
    "area": "Stabilisasi Naphtha · Unit 11 CDU Balongan",
    "description": "Stabilizer Feed Heater (HE 12) pada seksi Stabilisasi Naphtha, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-121",
    "name": "Heat Exchanger (HE 13)",
    "type": "heat",
    "area": "Stabilisasi Naphtha · Unit 11 CDU Balongan",
    "description": "Heat Exchanger (HE 13) pada seksi Stabilisasi Naphtha, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-120",
    "name": "Stabilizer Reboiler (HE 14)",
    "type": "heat",
    "area": "Stabilisasi Naphtha · Unit 11 CDU Balongan",
    "description": "Stabilizer Reboiler (HE 14) pada seksi Stabilisasi Naphtha, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-122",
    "name": "Splitter Reboiler (HE 22)",
    "type": "heat",
    "area": "Splitter · Unit 11 CDU Balongan",
    "description": "Splitter Reboiler (HE 22) pada seksi Splitter, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-123",
    "name": "Splitter Overhead Condenser (Kondensor 3)",
    "type": "heat",
    "area": "Splitter · Unit 11 CDU Balongan",
    "description": "Splitter Overhead Condenser (Kondensor 3) pada seksi Splitter, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-124",
    "name": "Naphtha Fin Fan Cooler (HE 18)",
    "type": "finfan",
    "area": "Pendinginan Produk · Unit 11 CDU Balongan",
    "description": "Naphtha Fin Fan Cooler (HE 18) pada seksi Pendinginan Produk, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-126",
    "name": "Naphtha Condenser/Cooler (HE 19)",
    "type": "heat",
    "area": "Pendinginan Produk · Unit 11 CDU Balongan",
    "description": "Naphtha Condenser/Cooler (HE 19) pada seksi Pendinginan Produk, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-118",
    "name": "Kerosene Cooler (HE 11)",
    "type": "heat",
    "area": "Pendinginan Produk · Unit 11 CDU Balongan",
    "description": "Kerosene Cooler (HE 11) pada seksi Pendinginan Produk, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-125",
    "name": "Kerosene Fin Fan Cooler (HE 20)",
    "type": "finfan",
    "area": "Pendinginan Produk · Unit 11 CDU Balongan",
    "description": "Kerosene Fin Fan Cooler (HE 20) pada seksi Pendinginan Produk, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-127",
    "name": "Kerosene Condenser/Cooler (HE 21)",
    "type": "heat",
    "area": "Pendinginan Produk · Unit 11 CDU Balongan",
    "description": "Kerosene Condenser/Cooler (HE 21) pada seksi Pendinginan Produk, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-E-112",
    "name": "Combined Gas Oil Cooler",
    "type": "finfan",
    "area": "Pendinginan Produk · Unit 11 CDU Balongan",
    "description": "Combined Gas Oil Cooler pada seksi Pendinginan Produk, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-V-101 A/B",
    "name": "Desalter",
    "type": "desalter",
    "area": "Desalting · Unit 11 CDU Balongan",
    "description": "Desalter pada seksi Desalting, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-V-116",
    "name": "Pre-Flash Condenser Drum",
    "type": "vessel",
    "area": "Pre-Flash (RDMP) · Unit 11 CDU Balongan",
    "description": "Pre-Flash Condenser Drum pada seksi Pre-Flash (RDMP), Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-V-102",
    "name": "Overhead Accumulator",
    "type": "vessel",
    "area": "Sistem Overhead · Unit 11 CDU Balongan",
    "description": "Overhead Accumulator pada seksi Sistem Overhead, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-V-103",
    "name": "Off-Gas KO Drum",
    "type": "vessel",
    "area": "Sistem Overhead · Unit 11 CDU Balongan",
    "description": "Off-Gas KO Drum pada seksi Sistem Overhead, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-V-104",
    "name": "Stabilizer Overhead Drum",
    "type": "vessel",
    "area": "Stabilisasi Naphtha · Unit 11 CDU Balongan",
    "description": "Stabilizer Overhead Drum pada seksi Stabilisasi Naphtha, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-V-105",
    "name": "Splitter Overhead Drum",
    "type": "vessel",
    "area": "Splitter · Unit 11 CDU Balongan",
    "description": "Splitter Overhead Drum pada seksi Splitter, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-V-113 A/B",
    "name": "Kerosene Clay Treater",
    "type": "vessel",
    "area": "Treating Kerosene · Unit 11 CDU Balongan",
    "description": "Kerosene Clay Treater pada seksi Treating Kerosene, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-V-106",
    "name": "Vessel Injeksi Kaustik",
    "type": "vessel",
    "area": "Bahan Kimia · Unit 11 CDU Balongan",
    "description": "Vessel Injeksi Kaustik pada seksi Bahan Kimia, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-V-114",
    "name": "Wetting Agent Preparation Vessel",
    "type": "vessel",
    "area": "Bahan Kimia · Unit 11 CDU Balongan",
    "description": "Wetting Agent Preparation Vessel pada seksi Bahan Kimia, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-P-112-B-V1",
    "name": "Reservoir pompa 11-P-112B",
    "type": "vessel",
    "area": "Produk (pompa) · Unit 11 CDU Balongan",
    "description": "Reservoir pompa 11-P-112B pada seksi Produk (pompa), Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-P-101 A/B",
    "name": "Crude Oil Charge Pump (Suction Feed Pump)",
    "type": "pump",
    "area": "Umpan & Cold Preheat · Unit 11 CDU Balongan",
    "description": "Crude Oil Charge Pump (Suction Feed Pump) pada seksi Umpan & Cold Preheat, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-102 A/B",
    "name": "Desalted Crude Pump",
    "type": "pump",
    "area": "Desalting · Unit 11 CDU Balongan",
    "description": "Desalted Crude Pump pada seksi Desalting, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-125 A/B",
    "name": "Pompa Pre-Flash & Distilat Ringan",
    "type": "pump",
    "area": "Pre-Flash (RDMP) · Unit 11 CDU Balongan",
    "description": "Pompa Pre-Flash & Distilat Ringan pada seksi Pre-Flash (RDMP), Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-126 A/B",
    "name": "Pompa Sour Water Pre-Flash",
    "type": "pump",
    "area": "Pre-Flash (RDMP) · Unit 11 CDU Balongan",
    "description": "Pompa Sour Water Pre-Flash pada seksi Pre-Flash (RDMP), Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-132 A/B",
    "name": "Pompa Sirkuit Pre-Flash",
    "type": "pump",
    "area": "(tidak disebut) · Unit 11 CDU Balongan",
    "description": "Pompa Sirkuit Pre-Flash pada seksi (tidak disebut), Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-104",
    "name": "Top Pump-Around Pump",
    "type": "pump",
    "area": "Pump-Around · Unit 11 CDU Balongan",
    "description": "Top Pump-Around Pump pada seksi Pump-Around, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-P-105",
    "name": "Middle Pump-Around Pump",
    "type": "pump",
    "area": "Pump-Around · Unit 11 CDU Balongan",
    "description": "Middle Pump-Around Pump pada seksi Pump-Around, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-P-106",
    "name": "Bottom Pump-Around Pump",
    "type": "pump",
    "area": "Pump-Around · Unit 11 CDU Balongan",
    "description": "Bottom Pump-Around Pump pada seksi Pump-Around, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-P-115",
    "name": "Pompa Refluks Overhead Utama",
    "type": "pump",
    "area": "Sistem Overhead · Unit 11 CDU Balongan",
    "description": "Pompa Refluks Overhead Utama pada seksi Sistem Overhead, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-P-103 A/B/C",
    "name": "Pompa Gas Oil Produk",
    "type": "pump",
    "area": "Gas Oil · Unit 11 CDU Balongan",
    "description": "Pompa Gas Oil Produk pada seksi Gas Oil, Unit 11 (CDU) PT Pertamina RU VI Balongan (3 unit terpasang)."
  },
  {
    "id": "11-P-110 A/B",
    "name": "Pompa Transfer Seksi Produk",
    "type": "pump",
    "area": "Stabilisasi Naphtha · Unit 11 CDU Balongan",
    "description": "Pompa Transfer Seksi Produk pada seksi Stabilisasi Naphtha, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-111 C/D",
    "name": "Pompa Produk Naphtha Splitter",
    "type": "pump",
    "area": "Splitter · Unit 11 CDU Balongan",
    "description": "Pompa Produk Naphtha Splitter pada seksi Splitter, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-131 A/B",
    "name": "Pompa Sirkulasi Samping CDU",
    "type": "pump",
    "area": "Pendinginan Produk · Unit 11 CDU Balongan",
    "description": "Pompa Sirkulasi Samping CDU pada seksi Pendinginan Produk, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-112 C/D",
    "name": "Pompa Transfer Produk Sekunder",
    "type": "pump",
    "area": "Pendinginan Produk · Unit 11 CDU Balongan",
    "description": "Pompa Transfer Produk Sekunder pada seksi Pendinginan Produk, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-107 A/B",
    "name": "Pompa LGO Side Stripper",
    "type": "pump",
    "area": "Side Stripper · Unit 11 CDU Balongan",
    "description": "Pompa LGO Side Stripper pada seksi Side Stripper, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-108 A/B",
    "name": "Pompa HGO Side Stripper",
    "type": "pump",
    "area": "Side Stripper · Unit 11 CDU Balongan",
    "description": "Pompa HGO Side Stripper pada seksi Side Stripper, Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-P-109 A/B",
    "name": "Pompa Bottom Atmospheric Residue",
    "type": "pump",
    "area": "(tidak disebut) · Unit 11 CDU Balongan",
    "description": "Pompa Bottom Atmospheric Residue pada seksi (tidak disebut), Unit 11 (CDU) PT Pertamina RU VI Balongan (2 unit terpasang)."
  },
  {
    "id": "11-LV-030",
    "name": "Control valve (level)",
    "type": "valve",
    "area": "Stabilisasi Naphtha · Unit 11 CDU Balongan",
    "description": "Control valve (level) pada seksi Stabilisasi Naphtha, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-FV-037",
    "name": "Control valve (flow)",
    "type": "valve",
    "area": "Splitter · Unit 11 CDU Balongan",
    "description": "Control valve (flow) pada seksi Splitter, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-FV-032",
    "name": "Control valve (flow) LGO",
    "type": "valve",
    "area": "Side Stripper · Unit 11 CDU Balongan",
    "description": "Control valve (flow) LGO pada seksi Side Stripper, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-FV-031",
    "name": "Control valve (flow) HGO",
    "type": "valve",
    "area": "Side Stripper · Unit 11 CDU Balongan",
    "description": "Control valve (flow) HGO pada seksi Side Stripper, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  },
  {
    "id": "11-FV-033",
    "name": "Control valve (flow) residu",
    "type": "valve",
    "area": "Fraksinasi Utama · Unit 11 CDU Balongan",
    "description": "Control valve (flow) residu pada seksi Fraksinasi Utama, Unit 11 (CDU) PT Pertamina RU VI Balongan (1 unit terpasang)."
  }
];

const SEED_REPORTS = [
  {
      "id": "CDU11-C01",
      "title": "Indikasi Tray Rusak & Flooding di Seksi Atas Pre-Flash Column 11-C-106",
      "asset_id": "11-C-106",
      "status": "INVESTIGATION",
      "identitas_alat": "Pre-Flash Column 11-C-106 (peralatan baru proyek RDMP Balongan Phase 1), Seksi Pre-Flash, Unit 11 CDU.",
      "gejala": "Beda tekanan seksi atas kolom naik dan berfluktuasi setelah laju umpan dinaikkan. Laboratorium melaporkan titik didih akhir naphtha overhead naik, sehingga fraksi berat terbawa ke atas.",
      "kondisi_operasi": "Kolom memisahkan off gas dan naphtha dari crude sebelum crude masuk furnace, dengan steam sebagai sumber energi. Kolom dipasang pada 15 Desember 2021 sebagai bagian dari kenaikan kapasitas CDU dari 125.000 menjadi 150.000 BPSD.",
      "pemeriksaan_awal": "Tim teknik melakukan gamma scanning online dengan sumber Co-60 pada beberapa garis pindai. Profil densitas menunjukkan satu tray di seksi atas tidak menahan cairan, sedangkan tray di bawahnya tampak lebih padat seperti tergenang (flooding).",
      "praduga_penyebab": "Sebagian tray di seksi atas diduga rusak atau terlepas, sehingga cairan jatuh ke tray di bawahnya dan memicu flooding lokal. Lonjakan uap atau air (water slug) saat start-up diduga memicu kerusakan mekanis tray.",
      "usulan_tindakan": "Tim proses menurunkan laju umpan ke batas aman dan memantau ΔP setiap jam. Tim teknik mengulang gamma scanning pada orientasi lain untuk memastikan posisi tray yang rusak, lalu menyiapkan rencana perbaikan internal saat shutdown.",
      "verifikasi": "Kriteria verifikasi: gamma scan ulang dan inspeksi internal mengonfirmasi tray terpasang utuh, ΔP seksi atas stabil, dan titik didih akhir naphtha kembali sesuai spesifikasi.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Tray yang rusak menurunkan kualitas pemisahan dan dapat memaksa penurunan laju umpan CDU. Perbaikan internal kolom hanya dapat dilakukan saat shutdown, sehingga kerugian produksi dapat besar.",
      "capa_corrective": "Turunkan laju umpan ke batas aman, lalu perbaiki atau ganti tray yang rusak saat shutdown terdekat dengan baut dan clamp yang terpasang sesuai prosedur.",
      "capa_preventive": "Tetapkan prosedur start-up yang mencegah water slug, jadikan ΔP per seksi sebagai alarm dini, dan jadwalkan gamma scan baseline setelah perbaikan.",
      "capa_target_date": "2027-02-15",
      "capa_pic": "Tim Proses & Inspeksi Statik",
      "description": "Lapor dari pre-flash column 11-C-106, beda tekanan seksi atas naik dan naik-turun sejak laju umpan dinaikkan, lalu hasil lab menunjukkan naphtha overhead mulai membawa fraksi berat.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_DP_SeksiAtas_11C106.png (grafik ΔP seksi atas naik dan berfluktuasi setelah laju umpan dinaikkan); GammaScan_11C106_GarisA-D.pdf (profil densitas per tray yang menunjukkan satu tray tanpa cairan dan tray di bawahnya tergenang. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-c01_trend_dp_seksiatas_11c106.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(8),
    updated_at: hoursAgo(2)
  },  {
      "id": "CDU11-F01",
      "title": "Hot Spot Tube Radiant & Dugaan Coking Internal Crude Furnace 11-F-101",
      "asset_id": "11-F-101",
      "status": "INVESTIGATION",
      "identitas_alat": "Crude furnace 11-F-101, seksi radiant pass 3, Seksi Furnace, Unit 11 CDU.",
      "gejala": "Operator melihat satu tube radiant di pass 3 tampak lebih terang dari peep hole. Suhu kulit tube (TMT) pass 3 naik bertahap, sedangkan suhu keluar crude tetap.",
      "kondisi_operasi": "Furnace memanaskan crude hingga 340-360 °C dengan bahan bakar off gas dari 11-V-103. Seksi konveksi memanaskan steam stripping hingga 350 °C.",
      "pemeriksaan_awal": "Survei termografi IR yang sudah dikoreksi emisivitas memetakan hot spot setempat di tube pass 3. Tren DCS menunjukkan TMT pass 3 naik sekitar 45 °C dalam 30 hari, dan laju alir pass 3 lebih rendah daripada pass lain.",
      "praduga_penyebab": "Lapisan kokas diduga terbentuk di dinding dalam tube pass 3 karena laju alirnya rendah. Lapisan kokas menghambat perpindahan panas sehingga dinding tube menjadi lebih panas.",
      "usulan_tindakan": "Tim menyeimbangkan laju alir antar-pass dan mengulang survei IR setiap minggu. Inspektor mengukur ketebalan tube dengan UT saat ada kesempatan, lalu engineer menghitung sisa umur creep sesuai API 579 Part 10.",
      "verifikasi": "Kriteria verifikasi: TMT pass 3 kembali setara dengan pass lain dan tidak ada tube yang melampaui batas suhu desain setelah dekoking.",
      "risk_level": "HIGH",
      "risk_consequence": "Catastrophic",
      "risk_likelihood": "Possible",
      "risk_summary": "Tube yang terus kepanasan dapat menggelembung dan pecah karena creep. Kebocoran crude di ruang bakar dapat memicu kebakaran besar dan shutdown CDU.",
      "capa_corrective": "Lakukan dekoking pass 3 (steam-air decoking atau pigging) dan ganti tube yang menggelembung melewati batas.",
      "capa_preventive": "Pasang alarm TMT per pass, jadwalkan termografi IR berkala, dan jaga keseimbangan laju alir antar-pass.",
      "capa_target_date": "2027-01-31",
      "capa_pic": "Tim Proses, Inspeksi & Furnace",
      "description": "Lapor dari furnace 11-F-101, dari peep hole satu tube radiant di pass tiga terlihat lebih terang dan suhu skin thermocouple-nya naik terus padahal suhu keluar crude tetap.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "IR_Thermography_11F101_Pass3.jpg (citra termal hot spot pass 3 yang sudah dikoreksi emisivitas); Trend_TMT_PassFlow_11F101.pdf (tren TMT naik 45 °C dalam 30 hari dan laju alir pass 3 lebih rendah. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/ir_thermography_11f101_pass3.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(11),
    updated_at: hoursAgo(5)
  },  {
      "id": "CDU11-E03",
      "title": "Beda Tekanan Naik & Dugaan Endapan Sedimen di Cold Preheater 11-E-102",
      "asset_id": "11-E-102",
      "status": "PRADUGA",
      "identitas_alat": "Cold preheater 11-E-102 (HE 3), Cold Preheat Train, Unit 11 CDU.",
      "gejala": "Beda tekanan sisi crude 11-E-102 naik perlahan selama dua minggu pada laju umpan yang sama. Suhu crude keluar alat juga sedikit turun.",
      "kondisi_operasi": "Alat merupakan bagian rangkaian 11-E-101 s.d. 11-E-105 yang memanaskan crude hingga 155,1 °C sebelum desalter. Anti-foulant dan demulsifier diinjeksikan di suction pompa umpan 11-P-101 A/B.",
      "pemeriksaan_awal": "Operator membaca indikator tekanan lokal di inlet dan outlet, lalu mencatat kenaikan beda tekanan sekitar 0,4 kg/cm². Data tren DCS belum ditarik.",
      "praduga_penyebab": "Sedimen, produk korosi besi, dan garam dari crude yang belum didesalting diduga mengendap di sisi crude.",
      "usulan_tindakan": "Engineer proses membandingkan tren ΔP dan duty selama 30 hari, memeriksa dosis anti-foulant, dan menilai kebutuhan pembersihan saat bypass memungkinkan.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: ΔP sisi crude kembali ke baseline dan suhu keluar alat pulih.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Minor",
      "risk_likelihood": "Likely",
      "risk_summary": "Fouling di cold preheat train menurunkan suhu crude ke desalter dan sedikit menambah beban furnace. Dampaknya masih terbatas dan belum mengancam keselamatan.",
      "capa_corrective": "Jadwalkan pembersihan sisi crude saat bypass memungkinkan dan sesuaikan dosis anti-foulant.",
      "capa_preventive": "Pantau ΔP dan duty 11-E-102 setiap minggu serta kandungan sedimen crude umpan setiap pergantian crude.",
      "capa_target_date": "2027-01-15",
      "capa_pic": "Tim Proses",
      "description": "Lapor dari cold preheat train, beda tekanan sisi crude 11-E-102 naik pelan dua minggu ini, padahal laju umpan sama.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(14),
    updated_at: hoursAgo(8)
  },  {
      "id": "CDU11-V01",
      "title": "Air Effluent Keruh Berminyak & Ampere Trafo Fluktuatif Desalter 11-V-101 A/B",
      "asset_id": "11-V-101 A/B",
      "status": "PRADUGA",
      "identitas_alat": "Desalter 11-V-101 A/B, Seksi Desalting, Unit 11 CDU PT KPI RU VI Balongan.",
      "gejala": "Operator melihat air effluent desalter berwarna keruh kecokelatan dan berminyak di titik sampling 11-E-128 A/B. Panel kontrol menunjukkan ampere trafo desalter naik-turun sejak crude blend baru masuk.",
      "kondisi_operasi": "Desalter beroperasi pada suhu ±150 °C dan tekanan 8 kg/cm² g. Crude masuk desalter pada suhu 155,1 °C dari cold preheat train, sedangkan demulsifier dan anti-foulant diinjeksikan di suction 11-P-101 A/B.",
      "pemeriksaan_awal": "Operator memeriksa sampel effluent secara visual di botol bening dan melihat lapisan minyak di permukaan. Laboratorium belum menganalisis oil content, dan foto sampel belum dilampirkan.",
      "praduga_penyebab": "Lapisan emulsi (rag layer) diduga menebal di antarmuka minyak-air karena crude blend baru membawa padatan halus, sementara dosis demulsifier dan pH wash water belum disesuaikan.",
      "usulan_tindakan": "Tim proses mengambil sampel effluent dan desalted crude untuk uji oil content, BS&W, dan kadar garam. Laboratorium melakukan bottle test demulsifier, dan operator memeriksa pH wash water serta ΔP mixing valve.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: oil content effluent di bawah 500 ppm dan kadar garam desalted crude kembali memenuhi KPI kilang.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Garam yang lolos dari desalter akan terhidrolisis menjadi HCl dan mempercepat korosi sistem overhead 11-C-101. Effluent berminyak juga menambah beban unit pengolahan air limbah.",
      "capa_corrective": "Optimasi dosis demulsifier sesuai hasil bottle test, penyetelan ulang ΔP mixing valve, dan koreksi pH wash water.",
      "capa_preventive": "Lakukan bottle test dan cek pH wash water setiap pergantian crude blend, lalu pantau oil content effluent harian.",
      "capa_target_date": "2026-12-10",
      "capa_pic": "Tim Proses & Laboratorium",
      "description": "Lapor dari Unit 11 CDU, air effluent desalter 11-V-101 A terlihat keruh kecokelatan dan berminyak di titik sampling 11-E-128, lalu ampere trafo desalter naik-turun sejak crude blend baru masuk pagi ini.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(15),
    updated_at: hoursAgo(9)
  },  {
      "id": "CDU11-C06",
      "title": "Kerosene Bottom Off-Spec & Dugaan Flooding di Splitter Naphtha-Kerosene 11-C-105",
      "asset_id": "11-C-105",
      "status": "PRADUGA",
      "identitas_alat": "Splitter Naphtha-Kerosene 11-C-105, Seksi Splitter, Unit 11 CDU.",
      "gejala": "Suhu bottom splitter naik-turun mengikuti perubahan laju middle pump-around. Laboratorium dua kali melaporkan flash point kerosene bottom turun dalam sepekan.",
      "kondisi_operasi": "Splitter memisahkan naphtha sebagai produk atas dan kerosene sebagai produk bawah. Reboiler 11-E-122 memanaskan bottom splitter dengan aliran middle pump-around, dan 11-FV-037 menjadi titik sampling naphtha column 11-C-105.",
      "pemeriksaan_awal": "Operator membandingkan tren suhu bottom dan laju middle pump-around di DCS secara visual. Grafik belum diekspor, dan sampel ulang belum diambil.",
      "praduga_penyebab": "Panas reboiler yang naik-turun diduga membuat tray atas sesekali flooding dan tray bawah weeping, sehingga naphtha ikut terbawa ke kerosene bottom.",
      "usulan_tindakan": "Tim proses menstabilkan laju middle pump-around ke 11-E-122, memeriksa loop kontrol 11-FV-037, dan mengambil sampel naphtha serta kerosene untuk uji distilasi.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: flash point kerosene bottom stabil sesuai spesifikasi dan suhu bottom splitter tidak lagi berosilasi.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Kerosene off-spec harus diolah ulang atau diturunkan mutunya. Dampaknya terbatas pada kualitas produk dan belum mengancam keselamatan.",
      "capa_corrective": "Stabilkan pasokan panas reboiler 11-E-122 dan setel ulang loop kontrol suhu bottom splitter.",
      "capa_preventive": "Pasang alarm deviasi suhu bottom dan pantau flash point kerosene bottom setiap shift.",
      "capa_target_date": "2027-01-10",
      "capa_pic": "Tim Proses & Instrumentasi",
      "description": "Lapor dari splitter 11-C-105, suhu bottom ikut naik-turun mengikuti laju middle pump-around, dan lab melaporkan flash point kerosene bottom turun dua kali minggu ini.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(20),
    updated_at: hoursAgo(14)
  },  {
      "id": "CDU11-E10",
      "title": "Efisiensi Turun & Faktor Pengotor Naik Hot Preheater 11-E-107 A/B",
      "asset_id": "11-E-107 A/B",
      "status": "TRIAGE",
      "identitas_alat": "Hot preheater 11-E-107 A/B (shell: atmospheric residue, tube: desalted crude), Hot Preheat Train, Unit 11 CDU.",
      "gejala": "Suhu desalted crude keluar sisi tube turun bertahap. Furnace 11-F-101 membutuhkan bahan bakar lebih banyak untuk mempertahankan suhu keluar yang sama.",
      "kondisi_operasi": "Data desain mencatat suhu shell 246,4 → 212,0 °C, suhu tube 169,0 → 193,0 °C, dan efisiensi 94,3%. Data aktual Juni 2023 masih menunjukkan efisiensi 87,6-91,5%.",
      "pemeriksaan_awal": "Engineer menghitung efisiensi 81% dan Rd 0,0018 hr·ft²·°F/Btu dari data DCS, sehingga Rd melampaui nilai desain 0,0014. ΔP sisi tube naik, tetapi masih di bawah batas izin 0,7 psi.",
      "praduga_penyebab": "Endapan aspalten dan kokas diduga menempel di dinding dalam tube, sedangkan endapan lumpur residu diduga menempel di sisi shell.",
      "usulan_tindakan": "Tim proses mengevaluasi tren Rd dan efisiensi delapan minggu terakhir. Tim merencanakan pembersihan saat unit A dan B dapat dibypass bergantian.",
      "verifikasi": "Kriteria verifikasi: efisiensi kembali ≥ 90% dan Rd turun di bawah nilai desain setelah pembersihan.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Penurunan efisiensi preheater menambah beban bahan bakar furnace 11-F-101 dan dapat membatasi kapasitas CDU.",
      "capa_corrective": "Hydrojetting tube bundle 11-E-107 A dan B secara bergantian serta chemical cleaning sisi shell.",
      "capa_preventive": "Pantau Rd, ΔP, dan efisiensi setiap minggu dengan ambang aksi efisiensi < 80%, lalu tinjau dosis anti-foulant.",
      "capa_target_date": "2027-01-20",
      "capa_pic": "Tim Proses & Thermal",
      "description": "Lapor dari hot preheat train, efisiensi 11-E-107 A/B dari data DCS turun ke sekitar 81 persen dan suhu desalted crude keluar tube makin rendah, padahal laju residu di shell relatif sama.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_Efisiensi_Rd_11E107_8minggu.png (grafik efisiensi turun dari 89% ke 81% dan Rd naik melewati nilai desain)",
      "image_url": "/assets/cdu11/evidences/cdu11-e10_trend_efisiensi_rd_11e107_8minggu.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(20),
    updated_at: hoursAgo(14)
  },  {
      "id": "CDU11-V06",
      "title": "Cat Mengelupas & Karat di Saddle Splitter Overhead Drum 11-V-105",
      "asset_id": "11-V-105",
      "status": "PRADUGA",
      "identitas_alat": "Splitter Overhead Drum 11-V-105 (drum refluks), Seksi Splitter, Unit 11 CDU.",
      "gejala": "Cat di saddle dan bagian bawah drum mengelupas, dan karat berlapis terlihat di celah antara saddle dan shell. Air hujan menggenang di celah tersebut.",
      "kondisi_operasi": "Menurut nama alatnya, drum menampung kondensat overhead splitter 11-C-105, sedangkan fungsinya tidak dirinci di sumber terbuka. Drum berada di area terbuka dan terpapar cuaca.",
      "pemeriksaan_awal": "Teknisi memeriksa secara visual dari platform dan mengetuk lapisan karat yang mudah lepas. Pengukuran ketebalan belum dilakukan.",
      "praduga_penyebab": "Air yang terperangkap di celah saddle diduga memicu korosi atmosferik dan korosi celah pada shell drum.",
      "usulan_tindakan": "Inspektor membersihkan karat di area saddle, mengukur ketebalan dengan UT, dan memeriksa apakah drainase serta penyekat celah saddle masih berfungsi.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: ketebalan shell di atas tebal minimum, coating baru utuh, dan tidak ada air yang menggenang di saddle.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Korosi di celah saddle sulit terlihat dan dapat menipiskan shell di titik tumpuan. Penipisan di area ini dapat berujung kebocoran hidrokarbon ringan.",
      "capa_corrective": "Bersihkan karat, ukur ketebalan, perbaiki coating, dan tutup celah saddle dengan sealant yang sesuai.",
      "capa_preventive": "Masukkan area saddle dan bagian bawah drum ke inspeksi visual berkala, dan jaga drainase agar air tidak menggenang.",
      "capa_target_date": "2027-01-31",
      "capa_pic": "Tim Inspeksi Statik",
      "description": "Lapor dari area splitter, cat di saddle dan bagian bawah drum 11-V-105 mengelupas, ada karat berlapis, dan air hujan menggenang di celah saddle.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(20),
    updated_at: hoursAgo(14)
  },  {
      "id": "CDU11-E26",
      "title": "Kerosene Berkabut Air & Dugaan Tube Bocor di Kerosene Condenser/Cooler 11-E-127",
      "asset_id": "11-E-127",
      "status": "INVESTIGATION",
      "identitas_alat": "Kerosene Condenser/Cooler 11-E-127 (HE 21), Seksi Pendinginan Produk, Unit 11 CDU.",
      "gejala": "Sampel kerosene di titik sampling 11-E-127 tampak berkabut. Butiran air terkumpul di dasar botol sampel sejak tiga hari lalu.",
      "kondisi_operasi": "Alat mendinginkan produk kerosene dan menjadi lokasi titik sampling kerosene. Media pendingin tidak disebut di sumber terbuka, sehingga kasus ini memakai skenario air pendingin.",
      "pemeriksaan_awal": "Uji kadar air menunjukkan kenaikan air bebas pada kerosene. Analisis air di dasar botol menemukan ion klorida dan sisa inhibitor yang sama dengan air pendingin.",
      "praduga_penyebab": "Tube 11-E-127 diduga bocor sehingga air pendingin yang bertekanan lebih tinggi masuk ke sisi kerosene.",
      "usulan_tindakan": "Tim mengisolasi 11-E-127 secara bergantian untuk memastikan sumber air, menyiapkan uji tekanan bundle, dan mengatur drain air di tangki kerosene.",
      "verifikasi": "Kriteria verifikasi: sampel kerosene jernih tanpa air bebas, dan uji tekanan bundle lulus setelah perbaikan.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Air dalam kerosene membuat produk off-spec dan mempercepat jenuhnya clay treater. Air juga menurunkan mutu kerosene di tangki.",
      "capa_corrective": "Plug tube yang bocor setelah uji tekanan bundle dan keringkan kerosene di tangki.",
      "capa_preventive": "Pantau kadar air dan kejernihan kerosene setiap shift, lalu masukkan 11-E-127 ke program inspeksi tube berbasis risiko.",
      "capa_target_date": "2027-01-31",
      "capa_pic": "Tim Proses & Inspeksi Statik",
      "description": "Lapor dari titik sampling kerosene di 11-E-127, sampel kerosene tampak berkabut dan ada butiran air di dasar botol sejak tiga hari lalu.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Foto_Sampel_Kerosene_Berkabut_11E127.jpg (sampel berkabut dengan butiran air di dasar botol); Lab_Air_Klorida_Inhibitor.pdf (klorida dan inhibitor air pendingin pada air di sampel kerosene. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e26_foto_sampel_kerosene_berkabut_11e127.webp",
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(23),
    updated_at: hoursAgo(17)
  },  {
      "id": "CDU11-P11",
      "title": "Pompa Standby 11-P-110 B Gagal Membangun Tekanan Saat Start (Dugaan Vapor Lock)",
      "asset_id": "11-P-110 A/B",
      "status": "PRADUGA",
      "identitas_alat": "Pompa 11-P-110 A/B (nama tidak disebut di sumber), Seksi Stabilisasi Naphtha, Unit 11 CDU.",
      "gejala": "Tekanan discharge pompa B tidak naik saat pompa distart untuk pergantian pompa. Casing pompa terasa dingin, dan bunyi pompa berbeda dari biasanya.",
      "kondisi_operasi": "Pompa tercantum setelah drum 11-V-104 pada daftar S1, sehingga pompa kemungkinan memompa cairan dari drum tersebut (perlu verifikasi P&ID). Drum 11-V-104 memisahkan off gas, air, dan minyak dari overhead stabilizer.",
      "pemeriksaan_awal": "Operator menghentikan pompa B dan kembali memakai pompa A. Pemeriksaan venting sebelum start belum tercatat di log.",
      "praduga_penyebab": "Uap atau gas diduga terperangkap di casing pompa B karena venting sebelum start tidak sempurna, sehingga pompa tidak dapat membangun tekanan (vapor lock).",
      "usulan_tindakan": "Operator melakukan venting casing hingga cairan keluar stabil sebelum start ulang. Tim mekanik memeriksa katup vent dan jalur pemanasan pompa standby.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: pompa B membangun tekanan normal dalam waktu start standar pada tiga kali uji start.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Pompa standby yang gagal start membuat sistem kehilangan cadangan saat pompa utama bermasalah. Menjalankan pompa tanpa cairan juga dapat merusak seal.",
      "capa_corrective": "Lakukan venting casing sebelum start dan perbaiki katup vent yang tidak berfungsi.",
      "capa_preventive": "Masukkan langkah venting ke prosedur start pompa standby dan uji start pompa B secara berkala.",
      "capa_target_date": "2026-12-22",
      "capa_pic": "Tim Operasi & Mekanik Rotating",
      "description": "Lapor dari seksi stabilizer, saat pompa 11-P-110 B distart untuk ganti pompa, tekanan discharge tidak naik dan casing pompa terasa dingin seperti ada gas.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(23),
    updated_at: hoursAgo(17)
  },  {
      "id": "CDU11-P01",
      "title": "Kavitasi Pompa Umpan Crude 11-P-101 A Saat Level Tangki Rendah",
      "asset_id": "11-P-101 A/B",
      "status": "VERIFIED",
      "identitas_alat": "Pompa umpan crude 11-P-101 A/B (pompa sentrifugal), Seksi Umpan & Cold Preheat, Unit 11 CDU.",
      "gejala": "Operator mendengar suara seperti kerikil di casing pompa A. Tekanan discharge naik-turun saat level tangki umpan rendah.",
      "kondisi_operasi": "Pompa mengalirkan sekitar 748.330 kg/jam crude pada 47,79 °C dan 3,3 kg/cm² g. Anti-foulant dan demulsifier diinjeksikan di suction pompa.",
      "pemeriksaan_awal": "Analisis vibrasi menunjukkan kenaikan amplitudo pita lebar pada frekuensi tinggi. ΔP strainer suction juga melebihi batas kondisi bersih.",
      "praduga_penyebab": "NPSH tersedia terbukti turun karena strainer suction tersumbat dan level tangki umpan terlalu rendah, sehingga crude menguap di mata impeller (kavitasi).",
      "usulan_tindakan": "Tim memindahkan beban ke pompa B, membersihkan strainer suction, memperbaiki pitting ringan di sisi masuk sudu impeller pompa A, dan menetapkan batas level minimum tangki umpan.",
      "verifikasi": "Uji jalan 4 jam menunjukkan suara kavitasi hilang, tekanan discharge stabil, dan vibrasi kembali ke baseline.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Kavitasi berulang dapat merusak impeller, seal, dan bearing pompa umpan sehingga laju umpan CDU terganggu.",
      "capa_corrective": "Pembersihan strainer suction, perbaikan impeller pompa A, dan penetapan batas level minimum tangki umpan.",
      "capa_preventive": "Pasang alarm ΔP strainer dan level rendah tangki, lalu pantau spektrum vibrasi pompa umpan setiap dua minggu.",
      "capa_target_date": "2026-11-12",
      "capa_pic": "Tim Mekanik Rotating & Operasi",
      "description": "Lapor dari pompa umpan crude 11-P-101 A, terdengar suara seperti kerikil di casing dan tekanan discharge naik-turun saat level tangki umpan rendah.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Spektrum_Vibrasi_11P101A.pdf (kenaikan pita lebar frekuensi tinggi saat kavitasi); Foto_Impeller_11P101A.jpg (pitting ringan di sisi masuk sudu impeller. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-p01_spektrum_vibrasi_11p101a.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(42),
    updated_at: hoursAgo(18)
  },  {
      "id": "CDU11-E23",
      "title": "Hidrokarbon di Air Pendingin & Dugaan Tube Bocor Akibat MIC di 11-E-126",
      "asset_id": "11-E-126",
      "status": "INVESTIGATION",
      "identitas_alat": "Naphtha Condenser/Cooler 11-E-126 (HE 19), Seksi Pendinginan Produk, Unit 11 CDU.",
      "gejala": "Operator utilitas melihat lapisan minyak tipis di basin cooling tower. Detektor gas portabel membaca hidrokarbon rendah di sekitar return air pendingin 11-E-126.",
      "kondisi_operasi": "Alat mendinginkan produk naphtha dan disebut “condenser” pada sumber S2. Media pendingin tidak disebut di sumber terbuka, sehingga kasus ini memakai skenario air pendingin.",
      "pemeriksaan_awal": "Uji isolasi bergantian menunjukkan hidrokarbon di return air hanya muncul saat 11-E-126 beroperasi. Uji tekanan bundle menemukan tiga tube bocor dengan pitting dari sisi air.",
      "praduga_penyebab": "Pitting di bawah endapan biofilm (MIC) di sisi air pendingin diduga menembus dinding tube, sehingga naphtha yang bertekanan lebih tinggi bocor ke air pendingin.",
      "usulan_tindakan": "Tim memplug tube yang bocor, mengambil sampel endapan untuk uji bakteri SRB dan APB, dan meminta tim utilitas mengevaluasi program biosida.",
      "verifikasi": "Kriteria verifikasi: tidak ada hidrokarbon di return air setelah plugging, dan hasil uji bakteri menunjukkan populasi di bawah batas program air pendingin.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Naphtha yang bocor ke air pendingin dapat terbawa ke cooling tower dan membentuk uap yang mudah terbakar. Kebocoran juga mencemari sistem air pendingin.",
      "capa_corrective": "Plug tube yang bocor, bersihkan sisi air, dan perbaiki program biosida berdasarkan hasil uji bakteri.",
      "capa_preventive": "Pasang pemantauan hidrokarbon di return air pendingin dan jadwalkan inspeksi tube berbasis risiko.",
      "capa_target_date": "2027-02-28",
      "capa_pic": "Tim Inspeksi Statik, Utilitas & HSE",
      "description": "Lapor dari pendinginan produk, operator utilitas melihat lapisan minyak tipis di basin cooling tower, dan detektor gas di sekitar 11-E-126 sempat membaca hidrokarbon rendah.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "Foto_Lapisan_Minyak_CoolingTower.jpg (lapisan minyak tipis di basin cooling tower); Laporan_Uji_Tekanan_11E126.pdf (tiga tube bocor dengan pitting dari sisi air. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e23_foto_lapisan_minyak_coolingtower.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(26),
    updated_at: hoursAgo(20)
  },  {
      "id": "CDU11-P09",
      "title": "Kavitasi Pompa Overhead 11-P-115 Saat Level Accumulator Rendah",
      "asset_id": "11-P-115",
      "status": "INVESTIGATION",
      "identitas_alat": "Pompa 11-P-115 (nama tidak disebut di sumber), Sistem Overhead, Unit 11 CDU.",
      "gejala": "Pompa berbunyi seperti kerikil, dan tekanan discharge naik-turun setiap kali level accumulator 11-V-102 turun.",
      "kondisi_operasi": "Pompa tercantum setelah overhead accumulator 11-V-102 pada daftar S1, sehingga pompa kemungkinan memompa cairan dari 11-V-102 (perlu verifikasi P&ID). Accumulator memisahkan minyak, gas, dan air kondensat overhead.",
      "pemeriksaan_awal": "Analisis vibrasi menunjukkan kenaikan pita lebar frekuensi tinggi saat level accumulator rendah. Perhitungan NPSH tersedia pada level rendah mendekati NPSH yang dibutuhkan pompa.",
      "praduga_penyebab": "NPSH tersedia diduga turun di bawah kebutuhan pompa saat level accumulator rendah, sehingga cairan menguap di mata impeller (kavitasi).",
      "usulan_tindakan": "Tim proses menaikkan batas level minimum 11-V-102 dan memeriksa kalibrasi level transmitter. Tim mekanik menjadwalkan inspeksi impeller untuk mencari pitting.",
      "verifikasi": "Kriteria verifikasi: bunyi kavitasi hilang, tekanan discharge stabil, dan pita lebar frekuensi tinggi kembali ke baseline pada level minimum yang baru.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Kavitasi berulang mengikis impeller dan merusak seal, sehingga pengiriman cairan overhead terganggu. Gangguan refluks juga mengganggu kestabilan kolom utama.",
      "capa_corrective": "Naikkan batas level minimum accumulator dan kalibrasi ulang level transmitter.",
      "capa_preventive": "Pasang alarm level rendah yang ditautkan ke pemantauan vibrasi pompa, dan periksa impeller pada setiap perawatan.",
      "capa_target_date": "2027-02-20",
      "capa_pic": "Tim Proses & Mekanik Rotating",
      "description": "Lapor dari sistem overhead, pompa 11-P-115 berbunyi seperti kerikil dan tekanan discharge naik-turun setiap kali level accumulator 11-V-102 turun.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Spektrum_Vibrasi_11P115.pdf (pita lebar frekuensi tinggi naik saat level rendah); Hitungan_NPSHa_11P115.xlsx (NPSH tersedia pada beberapa level accumulator. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-p09_spektrum_vibrasi_11p115.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(27),
    updated_at: hoursAgo(21)
  },  {
      "id": "CDU11-E17",
      "title": "Suhu Umpan Stabilizer Turun & Dugaan Endapan Besi Sulfida di 11-E-119",
      "asset_id": "11-E-119",
      "status": "TRIAGE",
      "identitas_alat": "Stabilizer Feed Heater 11-E-119 (HE 12), Seksi Stabilisasi Naphtha, Unit 11 CDU.",
      "gejala": "Suhu naphtha keluar 11-E-119 ke stabilizer turun sekitar 5 °C. Strainer pompa naphtha sering tersumbat endapan hitam halus.",
      "kondisi_operasi": "Alat memanaskan naphtha sebelum naphtha masuk stabilizer 11-C-104. Naphtha berasal dari overhead main fractionator yang bersentuhan dengan air ber-H₂S dan klorida.",
      "pemeriksaan_awal": "Uji cepat endapan strainer dengan asam encer mengeluarkan bau telur busuk, yang menandakan besi sulfida. Tren DCS menunjukkan duty 11-E-119 turun sekitar 18% dalam dua bulan.",
      "praduga_penyebab": "Produk korosi besi sulfida (FeS) dari sistem overhead diduga terbawa naphtha dan mengendap di sisi naphtha 11-E-119.",
      "usulan_tindakan": "Tim proses menelusuri sumber FeS dengan analisis Fe di naphtha, membersihkan strainer lebih sering, dan menjadwalkan pembersihan 11-E-119.",
      "verifikasi": "Kriteria verifikasi: suhu naphtha ke stabilizer kembali ke baseline dan kadar Fe dalam naphtha turun.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Umpan stabilizer yang kurang panas menurunkan pemisahan gas dari naphtha. Endapan yang sama juga menyumbat strainer dan menurunkan keandalan pompa naphtha.",
      "capa_corrective": "Bersihkan 11-E-119 dan strainer pompa naphtha, lalu kendalikan sumber korosi di sistem overhead.",
      "capa_preventive": "Pantau kadar Fe naphtha setiap minggu dan kaitkan hasilnya dengan program pengendalian korosi overhead 11-C-101.",
      "capa_target_date": "2027-02-05",
      "capa_pic": "Tim Proses & Inspeksi Korosi",
      "description": "Lapor dari seksi stabilizer, suhu naphtha keluar 11-E-119 ke stabilizer turun lima derajat, dan strainer pompa naphtha sering kotor dengan endapan hitam.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_Duty_11E119_60hari.png (duty 11-E-119 turun sekitar 18% dalam dua bulan)",
      "image_url": "/assets/cdu11/evidences/cdu11-e17_trend_duty_11e119_60hari.webp",
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(28),
    updated_at: hoursAgo(22)
  },  {
      "id": "CDU11-E27",
      "title": "Beda Tekanan Naik Saat Malam & Dugaan Endapan Wax di Combined Gas Oil Cooler 11-E-112",
      "asset_id": "11-E-112",
      "status": "TRIAGE",
      "identitas_alat": "Combined Gas Oil Cooler 11-E-112 (fin fan cooler), Seksi Pendinginan Produk, Unit 11 CDU.",
      "gejala": "Beda tekanan sisi proses 11-E-112 naik setiap malam atau saat hujan, lalu turun lagi pada siang hari. Suhu combined gas oil keluar juga lebih rendah saat ΔP naik.",
      "kondisi_operasi": "Alat mendinginkan combined gas oil (CGO) sebelum ke tangki atau unit hilir, dan sebagian CGO dikirim ke Unit 21 Gas Oil Hydrotreating. Crude desain Unit 11 adalah campuran Duri dan Minas.",
      "pemeriksaan_awal": "Tren DCS menunjukkan ΔP naik hingga dua kali lipat saat suhu udara turun, dan kenaikan itu terjadi pada suhu CGO keluar yang paling rendah. Laboratorium sedang menguji pour point dan titik kabut CGO.",
      "praduga_penyebab": "Wax dalam CGO diduga mengendap di dinding tube yang terlalu dingin saat suhu udara turun, sehingga penampang aliran menyempit dan ΔP naik.",
      "usulan_tindakan": "Tim proses mengatur jumlah kipas yang beroperasi atau sudut bilah pada malam hari dan saat hujan agar suhu dinding tetap di atas titik kabut CGO.",
      "verifikasi": "Kriteria verifikasi: ΔP sisi proses stabil siang dan malam selama 30 hari, dan suhu CGO keluar tetap di atas titik kabut.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Endapan wax yang terus bertambah dapat menyumbat tube dan membatasi pengiriman CGO. Gangguan ini dapat memaksa penurunan laju produksi gas oil.",
      "capa_corrective": "Atur jumlah kipas atau sudut bilah pada malam hari dan saat hujan, lalu panaskan bundle dengan aliran CGO hangat bila endapan sudah terbentuk.",
      "capa_preventive": "Tetapkan batas minimum suhu CGO keluar berdasarkan titik kabut dan pasang alarm ΔP 11-E-112.",
      "capa_target_date": "2027-01-15",
      "capa_pic": "Tim Proses & Operasi",
      "description": "Lapor dari pendinginan produk, beda tekanan sisi proses fin fan 11-E-112 naik tiap malam atau saat hujan, lalu turun lagi siang hari.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_DP_vs_SuhuUdara_11E112.png (ΔP naik setiap malam dan saat hujan)",
      "image_url": "/assets/cdu11/evidences/cdu11-e27_trend_dp_vs_suhuudara_11e112.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(28),
    updated_at: hoursAgo(22)
  },  {
      "id": "CDU11-I03",
      "title": "Kebocoran Udara Aktuator & Respons Lambat Control Valve LGO 11-FV-032",
      "asset_id": "11-FV-032",
      "status": "TRIAGE",
      "identitas_alat": "Flow control valve 11-FV-032 (titik sampling light gas oil), Seksi Side Stripper, Unit 11 CDU.",
      "gejala": "Aktuator valve mendesis seperti kebocoran udara. Valve lambat mengikuti perubahan setpoint laju LGO, dan laju LGO berosilasi kecil.",
      "kondisi_operasi": "Valve mengatur laju LGO dan menjadi lokasi titik sampling light gas oil. LGO berasal dari LGO stripper 11-C-102 dengan aliran keluar sekitar 81.930 kg/jam.",
      "pemeriksaan_awal": "Uji sabun menemukan kebocoran udara di sambungan tubing positioner ke aktuator. Data diagnostik positioner menunjukkan tekanan aktuator tidak stabil.",
      "praduga_penyebab": "Kebocoran udara di tubing aktuator diduga menurunkan tekanan kerja aktuator, sehingga valve lambat dan sesekali tertahan.",
      "usulan_tindakan": "Teknisi instrumentasi mengganti fitting dan tubing yang bocor, mengkalibrasi positioner, lalu menjalankan uji langkah untuk memeriksa respons valve.",
      "verifikasi": "Kriteria verifikasi: uji sabun ulang tidak menemukan kebocoran udara, dan valve mengikuti perubahan OP tanpa osilasi.",
      "risk_level": "LOW",
      "risk_consequence": "Minor",
      "risk_likelihood": "Possible",
      "risk_summary": "Respons valve yang lambat membuat laju LGO dan level stripper tidak stabil. Dampaknya terbatas pada kestabilan operasi.",
      "capa_corrective": "Ganti fitting dan tubing yang bocor, lalu kalibrasi positioner.",
      "capa_preventive": "Masukkan pemeriksaan kebocoran udara instrumen dan data diagnostik positioner ke perawatan rutin.",
      "capa_target_date": "2026-12-12",
      "capa_pic": "Tim Instrumentasi",
      "description": "Lapor dari side stripper, aktuator control valve 11-FV-032 mendesis seperti bocor udara dan valve lambat mengikuti perubahan setpoint laju LGO.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Instrumentasi & Kontrol",
      "evidence_note": "Diagnostik_Positioner_11FV032.pdf (tekanan aktuator tidak stabil)",
      "image_url": "/assets/cdu11/evidences/cdu11-i03_diagnostik_positioner_11fv032.webp",
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(28),
    updated_at: hoursAgo(22)
  },  {
      "id": "CDU11-I04",
      "title": "Penipisan Dinding Hilir Control Valve HGO 11-FV-031 & Dugaan Korosi Asam Naftenat",
      "asset_id": "11-FV-031",
      "status": "INVESTIGATION",
      "identitas_alat": "Flow control valve HGO 11-FV-031 beserta elbow dan pipa hilirnya, jalur produk HGO Stripper 11-C-103.",
      "gejala": "Valve 11-FV-031 sulit mengikuti setpoint DCS. Inspeksi UT spot menemukan dinding elbow hilir lebih tipis daripada data inspeksi sebelumnya.",
      "kondisi_operasi": "Jalur HGO beroperasi pada suhu tinggi dengan aliran turbulen di sekitar valve. Data CAIS mencatat TAN HGO 1,10-1,65 mg KOH/g pada tiga campuran crude Desember 2020.",
      "pemeriksaan_awal": "Pemetaan UT grid menemukan penipisan setempat berbentuk alur di sisi luar elbow dengan laju sekitar 0,30 mm/tahun. Inspeksi trim valve memperlihatkan permukaan yang tergerus.",
      "praduga_penyebab": "Korosi asam naftenat (NAC) diduga menipiskan dinding hilir valve, dan aliran turbulen mempercepat serangannya, terutama saat kilang mengolah crude impor yang lebih asam.",
      "usulan_tindakan": "Inspektor mengulang UT grid setiap bulan dan memasang probe UT permanen. Laboratorium menguji TAN dan Fe pada HGO setiap pergantian crude blend, dan engineer memeriksa kesesuaian metalurgi pipa serta trim.",
      "verifikasi": "Kriteria verifikasi: laju korosi terukur turun di bawah 0,13 mm/tahun selama tiga bulan berturut-turut.",
      "risk_level": "CRITICAL",
      "risk_consequence": "Catastrophic",
      "risk_likelihood": "Likely",
      "risk_summary": "Penipisan dinding di jalur HGO panas dapat berujung kebocoran yang memicu kebakaran besar (Process Safety Tier 1/2).",
      "capa_corrective": "Ganti elbow dan spool hilir dengan material yang lebih tahan NAC, perbaiki trim valve, lalu verifikasi dengan UT pasca-penggantian.",
      "capa_preventive": "Tetapkan batas TAN campuran crude, siapkan injeksi inhibitor suhu tinggi bila batas terlampaui, dan pantau ketebalan dengan UT online.",
      "capa_target_date": "2027-01-15",
      "capa_pic": "Tim Inspeksi Korosi, Proses & Instrumentasi",
      "description": "Lapor dari jalur HGO, control valve 11-FV-031 mulai sulit mengikuti setpoint dan hasil UT spot di elbow hilirnya lebih tipis dari data inspeksi sebelumnya.",
      "reporter_name": "Dr. Rina Suryani",
      "reporter_role": "hse_validator",
      "dept": "HSE & Process Safety",
      "evidence_note": "UT_Grid_Elbow_Hilir_11FV031.pdf (peta ketebalan dengan penipisan setempat berbentuk alur); Foto_Trim_11FV031.jpg (permukaan trim valve yang tergerus); Data_TAN_HGO_CAIS.xlsx (TAN HGO 1,10-1,65 mg KOH/g dan riwayat crude blend. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-i04_ut_grid_elbow_hilir_11fv031.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(28),
    updated_at: hoursAgo(22)
  },  {
      "id": "CDU11-E20",
      "title": "Warna Kerosene Turun & Dugaan Kebocoran Tube Reboiler Splitter 11-E-122",
      "asset_id": "11-E-122",
      "status": "INVESTIGATION",
      "identitas_alat": "Splitter Reboiler 11-E-122 (HE 22), Seksi Splitter, Unit 11 CDU.",
      "gejala": "Warna Saybolt kerosene bottom splitter turun, dan sampel tampak kekuningan. Clay di 11-V-113 A/B yang diganti tiga bulan lalu sudah cepat jenuh lagi.",
      "kondisi_operasi": "Reboiler memanaskan bottom splitter 11-C-105 dengan aliran middle pump-around. Middle pump-around kemudian mengalir ke 11-E-106 dan kembali ke tray 12 kolom 11-C-101.",
      "pemeriksaan_awal": "Laboratorium menemukan kenaikan titik didih akhir dan residu karbon pada kerosene bottom. Tim membandingkan tekanan kedua sisi reboiler dan menemukan sisi middle pump-around bertekanan lebih tinggi.",
      "praduga_penyebab": "Tube reboiler diduga bocor sehingga middle pump-around yang lebih berat dan gelap masuk ke sisi kerosene.",
      "usulan_tindakan": "Tim mengisolasi reboiler secara bertahap untuk melihat perubahan warna kerosene, lalu menyiapkan uji tekanan bundle saat reboiler dapat dibypass.",
      "verifikasi": "Kriteria verifikasi: warna Saybolt kerosene kembali sesuai spesifikasi tanpa bergantung pada clay treater, dan uji tekanan bundle lulus tanpa kebocoran.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Kontaminasi kerosene membuat produk off-spec dan mempercepat jenuhnya clay treater. Dampaknya terbatas pada mutu produk dan biaya clay.",
      "capa_corrective": "Isolasi reboiler, lakukan uji tekanan bundle, lalu plug atau ganti tube yang bocor.",
      "capa_preventive": "Pantau warna Saybolt kerosene bottom setiap shift dan tetapkan batas selisih warna sebelum dan sesudah clay treater sebagai tanda awal kebocoran.",
      "capa_target_date": "2027-01-20",
      "capa_pic": "Tim Proses & Inspeksi Statik",
      "description": "Lapor dari splitter, warna Saybolt kerosene bottom 11-C-105 turun dan sampelnya agak kekuningan, padahal clay di clay treater baru diganti tiga bulan lalu.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Lab_Saybolt_Kerosene_14hari.pdf (tren warna Saybolt kerosene bottom selama 14 hari); Data_Tekanan_Sisi_11E122.png (perbandingan tekanan sisi middle pump-around dan kerosene. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e20_lab_saybolt_kerosene_14hari.webp",
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(29),
    updated_at: hoursAgo(23)
  },  {
      "id": "CDU11-P07",
      "title": "Bunyi Berderak Saat Laju Rendah di Pompa Middle Pump-Around 11-P-105",
      "asset_id": "11-P-105",
      "status": "PRADUGA",
      "identitas_alat": "Middle Pump-Around Pump 11-P-105, Seksi Pump-Around, Unit 11 CDU.",
      "gejala": "Pompa berbunyi berderak dan bergetar setiap kali laju middle pump-around diturunkan. Bunyi hilang saat laju dinaikkan kembali.",
      "kondisi_operasi": "Pompa menarik cairan dari tray 15, mengalirkannya ke 11-E-122 lalu 11-E-106, dan mengembalikannya ke tray 12. Kode tag tanpa akhiran A/B menandakan satu unit.",
      "pemeriksaan_awal": "Operator mencatat bunyi muncul ketika laju alir turun jauh di bawah laju normal. Data vibrasi dan kurva pompa belum dibandingkan.",
      "praduga_penyebab": "Pompa diduga beroperasi terlalu jauh di bawah titik efisiensi terbaik (BEP), sehingga terjadi resirkulasi dan kavitasi di sisi masuk impeller.",
      "usulan_tindakan": "Tim mekanik mengukur vibrasi pada beberapa laju alir, lalu tim proses menetapkan laju alir minimum pompa berdasarkan kurva pabrik.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: tidak ada bunyi berderak, dan vibrasi tetap di zona aman pada seluruh rentang laju operasi.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Operasi berulang di laju rendah dapat merusak impeller, bearing, dan seal. Pompa tanpa cadangan membuat kerusakan langsung mengganggu reboiler splitter dan hot preheat train.",
      "capa_corrective": "Tetapkan dan terapkan laju alir minimum pompa, atau pasang jalur sirkulasi minimum bila belum ada.",
      "capa_preventive": "Pasang alarm laju alir rendah dan masukkan 11-P-105 ke rute vibrasi dua mingguan.",
      "capa_target_date": "2027-01-10",
      "capa_pic": "Tim Proses & Mekanik Rotating",
      "description": "Lapor dari pump-around, pompa 11-P-105 berbunyi berderak dan bergetar setiap kali laju middle pump-around diturunkan untuk mengatur kolom.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(29),
    updated_at: hoursAgo(23)
  },  {
      "id": "CDU11-E15",
      "title": "Getaran Pipa Inlet & Dugaan Erosi-Korosi di Kondensor Pre-Flash 11-E-131",
      "asset_id": "11-E-131",
      "status": "PRADUGA",
      "identitas_alat": "Pre-Flash Condenser 11-E-131 (kondensor 1), Seksi Pre-Flash, Unit 11 CDU.",
      "gejala": "Pipa inlet kondensor bergetar dan berbunyi seperti ketukan saat laju umpan tinggi. Sour water di drum 11-V-116 terlihat lebih keruh daripada biasanya.",
      "kondisi_operasi": "Kondensor mengembunkan uap atas pre-flash column 11-C-106 sebelum masuk drum 11-V-116. Sour water dari 11-V-116 diambil sebagai sampel di discharge pompa 11-P-126.",
      "pemeriksaan_awal": "Teknisi merasakan getaran dengan tangan dan merekam bunyi dengan ponsel. Pengukuran vibrasi pipa dan sampel sour water belum dilakukan.",
      "praduga_penyebab": "Aliran dua fasa berkecepatan tinggi di inlet diduga mengikis lapisan pelindung, sedangkan HCl yang mengembun di titik embun mempercepat korosi (erosi-korosi).",
      "usulan_tindakan": "Teknisi mengukur vibrasi pipa inlet, laboratorium menguji pH, klorida, dan Fe sour water 11-V-116, dan inspektor menjadwalkan UT di inlet nozzle.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: getaran pipa inlet turun ke batas aman dan tidak ada penipisan baru di inlet nozzle.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Penipisan di inlet kondensor dapat berujung kebocoran uap hidrokarbon ringan. Kebocoran di area pre-flash berpotensi memicu kebakaran dan shutdown CDU.",
      "capa_corrective": "Kurangi kecepatan aliran inlet dengan mengatur laju umpan sementara, lalu perbaiki penyangga pipa yang longgar.",
      "capa_preventive": "Pantau pH, klorida, dan Fe sour water 11-V-116 setiap minggu serta tambahkan inlet nozzle 11-E-131 ke titik UT berkala.",
      "capa_target_date": "2027-01-10",
      "capa_pic": "Tim Proses & Inspeksi Korosi",
      "description": "Lapor dari area pre-flash, pipa inlet kondensor 11-E-131 bergetar dan berbunyi seperti ketukan saat laju umpan tinggi, dan sour water drum 11-V-116 terlihat lebih keruh.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(30),
    updated_at: hoursAgo(24)
  },  {
      "id": "CDU11-P06",
      "title": "Head Turun & Endapan Garam di Impeller Pompa Top Pump-Around 11-P-104",
      "asset_id": "11-P-104",
      "status": "INVESTIGATION",
      "identitas_alat": "Top Pump-Around Pump 11-P-104, Seksi Pump-Around, Unit 11 CDU.",
      "gejala": "Tekanan discharge 11-P-104 turun perlahan selama sebulan pada laju alir yang sama. Strainer suction cepat penuh endapan putih keabu-abuan.",
      "kondisi_operasi": "Pompa menarik cairan dari tray 5 kolom 11-C-101, mengalirkannya ke 11-E-104 untuk memanaskan crude, lalu mengembalikannya ke tray teratas. Kode tag tanpa akhiran A/B menandakan satu unit.",
      "pemeriksaan_awal": "Kurva unjuk kerja lapangan menunjukkan head turun sekitar 6% dari kurva pabrik. Uji klorida pada endapan strainer memberi hasil positif tinggi.",
      "praduga_penyebab": "Garam amonium klorida dari seksi atas kolom diduga mengendap di saluran impeller dan menyempitkan aliran, sehingga head pompa turun.",
      "usulan_tindakan": "Tim membersihkan strainer lebih sering dan menyiapkan pembersihan impeller saat pump-around dapat dialihkan. Tim proses menjalankan kajian water wash bersama kasus CDU11-C02 dan CDU11-E05.",
      "verifikasi": "Kriteria verifikasi: head pompa kembali ke kurva pabrik, dan strainer tidak lagi penuh endapan dalam satu pekan.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Head pompa yang turun mengurangi aliran top pump-around dan mengganggu profil suhu kolom 11-C-101. Pompa tanpa cadangan membuat perbaikan memerlukan koordinasi operasi kolom.",
      "capa_corrective": "Bersihkan impeller dan strainer, lalu jalankan water wash terkendali pada sirkuit top pump-around.",
      "capa_preventive": "Pantau head pompa dan frekuensi pembersihan strainer sebagai indikator dini endapan garam.",
      "capa_target_date": "2027-02-15",
      "capa_pic": "Tim Mekanik Rotating & Proses",
      "description": "Lapor dari pump-around, tekanan discharge pompa 11-P-104 turun pelan sebulan ini dan strainer suction-nya cepat penuh endapan putih.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Kurva_Head_Lapangan_11P104.png (head lapangan turun sekitar 6% dari kurva pabrik); Foto_Endapan_Strainer_11P104.jpg (endapan putih keabu-abuan di strainer suction. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-p06_kurva_head_lapangan_11p104.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(30),
    updated_at: hoursAgo(24)
  },  {
      "id": "CDU11-E04",
      "title": "Beda Tekanan Sisi Residu Naik di Cold Preheater 11-E-103 A/B",
      "asset_id": "11-E-103 A/B",
      "status": "TRIAGE",
      "identitas_alat": "Cold preheater 11-E-103 A/B (HE 4; pemanas crude dengan atmospheric residue), Cold Preheat Train, Unit 11 CDU.",
      "gejala": "Beda tekanan sisi atmospheric residue pada unit A naik. Suhu residu keluar makin tinggi, sedangkan suhu crude keluar turun.",
      "kondisi_operasi": "Alat memanaskan crude dengan memanfaatkan panas atmospheric residue. Atmospheric residue kemudian dikirim ke AHU/ARHDM dan sebagian ke RCC.",
      "pemeriksaan_awal": "Engineer menghitung duty unit A turun sekitar 15% dibanding unit B pada data DCS yang sama. ΔP sisi residu unit A sekitar 1,5 kali unit B.",
      "praduga_penyebab": "Endapan residu berat (aspalten dan lumpur) diduga menumpuk di sisi residu unit A karena aliran melambat saat residu makin dingin dan kental.",
      "usulan_tindakan": "Tim proses membandingkan unit A dan B selama 30 hari, lalu menjadwalkan pembersihan unit A saat unit B mampu menanggung beban sendiri.",
      "verifikasi": "Kriteria verifikasi: duty unit A setara dengan unit B dan ΔP sisi residu kembali ke baseline setelah pembersihan.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Penurunan perolehan panas di cold preheat train menurunkan suhu crude ke desalter dan menaikkan konsumsi bahan bakar furnace.",
      "capa_corrective": "Bersihkan sisi residu 11-E-103 A dengan hydrojetting atau chemical cleaning saat unit B dapat menanggung beban.",
      "capa_preventive": "Pantau duty dan ΔP unit A dan B setiap minggu, lalu jadwalkan pembersihan bergantian sebelum duty turun melewati batas yang ditetapkan.",
      "capa_target_date": "2027-02-10",
      "capa_pic": "Tim Proses & Thermal",
      "description": "Lapor dari cold preheat train, beda tekanan sisi residu 11-E-103 A naik dan suhu residu keluar makin tinggi, jadi panas yang diambil crude berkurang.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Banding_Duty_DP_11E103A_B.png (grafik duty dan ΔP unit A dibanding unit B selama 30 hari)",
      "image_url": "/assets/cdu11/evidences/cdu11-e04_banding_duty_dp_11e103a_b.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(31),
    updated_at: hoursAgo(25)
  },  {
      "id": "CDU11-P17",
      "title": "Baut Fondasi Kendur & Grouting Retak di Pompa 11-P-109 A",
      "asset_id": "11-P-109 A/B",
      "status": "PRADUGA",
      "identitas_alat": "Pompa 11-P-109 A/B (nama tidak disebut di sumber), Unit 11 CDU.",
      "gejala": "Baseplate pompa A ikut bergetar saat pompa beroperasi. Grouting di bawah baseplate retak, dan satu baut fondasi dapat diputar dengan tangan.",
      "kondisi_operasi": "Pompa merupakan entri terakhir daftar spesifikasi S1, dan fungsi serta seksinya tidak dirinci di sumber terbuka.",
      "pemeriksaan_awal": "Teknisi memeriksa secara visual dan menandai baut yang kendur. Vibrasi baseplate dan housing bearing belum diukur.",
      "praduga_penyebab": "Grouting yang retak dan baut fondasi yang kendur diduga membuat dudukan pompa longgar (looseness), sehingga getaran pompa tersalur ke baseplate.",
      "usulan_tindakan": "Teknisi mengukur vibrasi di housing bearing dan baseplate, lalu tim sipil dan mekanik menyiapkan perbaikan grouting serta pengencangan baut fondasi.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: baseplate tidak lagi bergetar, baut kencang sesuai torsi, dan vibrasi pompa di zona aman.",
      "risk_level": "LOW",
      "risk_consequence": "Minor",
      "risk_likelihood": "Possible",
      "risk_summary": "Dudukan yang longgar mempercepat kerusakan bearing, seal, dan kopling. Pompa B tersedia sebagai cadangan.",
      "capa_corrective": "Perbaiki grouting, kencangkan baut fondasi sesuai torsi, lalu lakukan laser alignment ulang.",
      "capa_preventive": "Periksa baut fondasi dan grouting pompa dalam inspeksi rutin tahunan.",
      "capa_target_date": "2027-01-20",
      "capa_pic": "Tim Mekanik Rotating & Sipil",
      "description": "Lapor dari area pompa 11-P-109, baseplate pompa A ikut bergetar dan ada retak di grouting bawahnya, salah satu baut fondasi bisa diputar tangan.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(31),
    updated_at: hoursAgo(25)
  },  {
      "id": "CDU11-E25",
      "title": "Getaran Kipas & Bunyi Kasar Bearing di Fin Fan Cooler Kerosene 11-E-125",
      "asset_id": "11-E-125",
      "status": "PRADUGA",
      "identitas_alat": "Kerosene Fin Fan Cooler 11-E-125 (HE 20), Seksi Pendinginan Produk, Unit 11 CDU.",
      "gejala": "Salah satu kipas 11-E-125 bergetar keras, dan bearing kipas berbunyi kasar. Rangka dudukan motor ikut bergetar.",
      "kondisi_operasi": "Fin fan cooler mendinginkan produk kerosene dengan aliran udara dari kipas. Kerosene didinginkan sebelum masuk clay treater 11-V-113 A/B.",
      "pemeriksaan_awal": "Teknisi mengukur suhu housing bearing dengan thermal gun dan mendapati nilainya lebih tinggi daripada kipas lain. Pengukuran vibrasi dengan alat ukur belum dilakukan.",
      "praduga_penyebab": "Bearing kipas diduga aus atau kekurangan pelumas, dan bilah kipas diduga tidak seimbang karena endapan kotoran.",
      "usulan_tindakan": "Teknisi mengukur vibrasi di housing bearing sesuai ISO 10816-3, memeriksa pelumasan, serta mengecek sudut dan kebersihan bilah kipas.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: vibrasi kipas kembali ke zona aman dan suhu bearing setara dengan kipas lain.",
      "risk_level": "LOW",
      "risk_consequence": "Minor",
      "risk_likelihood": "Possible",
      "risk_summary": "Bila kipas berhenti, kerosene keluar lebih panas dan kinerja clay treater dapat turun. Dampaknya terbatas karena kipas lain masih bekerja.",
      "capa_corrective": "Ganti bearing kipas yang aus, lumasi sesuai jadwal, dan seimbangkan bilah kipas.",
      "capa_preventive": "Masukkan kipas fin fan ke rute pengukuran vibrasi bulanan dan jadwal pelumasan bearing.",
      "capa_target_date": "2026-12-15",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari pendinginan produk, salah satu kipas 11-E-125 bergetar keras dan bearing-nya berbunyi kasar, rangka dudukannya ikut bergetar.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(32),
    updated_at: hoursAgo(26)
  },  {
      "id": "CDU11-P16",
      "title": "Kebocoran Seal Berulang & Endapan Kokas di Sisi Atmosfer Pompa Side Stripper 11-P-108 A",
      "asset_id": "11-P-108 A/B",
      "status": "INVESTIGATION",
      "identitas_alat": "Pompa 11-P-108 A/B (nama tidak disebut di sumber), Seksi Side Stripper, Unit 11 CDU.",
      "gejala": "Seal pompa A bocor lagi dua bulan setelah diganti. Kerak hitam keras menempel di sekitar gland seal.",
      "kondisi_operasi": "Pompa tercantum setelah HGO stripper 11-C-103 pada daftar S1, sehingga pompa kemungkinan memompa HGO panas (perlu verifikasi P&ID). Data CAIS mencatat TAN HGO 1,10-1,65 mg KOH/g.",
      "pemeriksaan_awal": "Pembongkaran seal menemukan endapan kokas di sisi atmosfer seal yang menghambat gerak seal ring. Jalur steam quench seal tertutup karena katupnya rusak.",
      "praduga_penyebab": "Tanpa steam quench, rembesan HGO panas di sisi atmosfer diduga teroksidasi menjadi kokas, sehingga seal ring macet dan seal bocor berulang.",
      "usulan_tindakan": "Tim memperbaiki katup dan jalur steam quench, mengganti seal dengan desain yang sesuai untuk servis panas, dan memantau suhu gland setiap shift.",
      "verifikasi": "Kriteria verifikasi: seal bertahan tanpa bocor minimal enam bulan, dan steam quench mengalir sesuai prosedur.",
      "risk_level": "HIGH",
      "risk_consequence": "Catastrophic",
      "risk_likelihood": "Possible",
      "risk_summary": "Kebocoran HGO panas dapat menyala bila mengenai permukaan panas. Kejadian ini berpotensi menjadi Process Safety Tier 1/2.",
      "capa_corrective": "Perbaiki jalur steam quench dan ganti seal dengan desain servis panas.",
      "capa_preventive": "Masukkan pemeriksaan steam quench ke rute operator dan pantau suhu gland seal pompa HGO setiap shift.",
      "capa_target_date": "2027-01-31",
      "capa_pic": "Tim Mekanik Rotating, Proses & HSE",
      "description": "Lapor dari side stripper, seal pompa 11-P-108 A bocor lagi dua bulan setelah diganti, dan di sekitar gland ada kerak hitam keras.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Foto_Kokas_Gland_11P108A.jpg (kerak hitam keras di sisi atmosfer seal); Foto_Katup_SteamQuench_Rusak_11P108A.jpg (katup steam quench yang rusak dan tertutup. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-p16_foto_kokas_gland_11p108a.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(32),
    updated_at: hoursAgo(26)
  },  {
      "id": "CDU11-C03",
      "title": "Flash Point LGO Turun & Dugaan Stripping Tidak Optimal di LGO Stripper 11-C-102",
      "asset_id": "11-C-102",
      "status": "PRADUGA",
      "identitas_alat": "LGO Stripper 11-C-102 (kolom stripper samping), Seksi Side Stripper, Unit 11 CDU.",
      "gejala": "Laboratorium melaporkan flash point LGO turun mendekati batas spesifikasi selama dua hari. Operator melihat level stripper sering naik-turun walaupun laju stripping steam tidak berubah.",
      "kondisi_operasi": "Stripper melucuti fraksi ringan dari LGO, yaitu side draw kolom 11-C-101, dengan aliran keluar sekitar 81.930 kg/jam. Seksi konveksi furnace 11-F-101 memanaskan steam stripping hingga 350 °C.",
      "pemeriksaan_awal": "Operator memeriksa indikator laju stripping steam dan level secara visual. Data tren DCS dan foto belum dilampirkan.",
      "praduga_penyebab": "Stripping steam diduga basah atau kurang panas, atau sebagian tray stripper diduga rusak, sehingga fraksi ringan tidak terlucuti sempurna.",
      "usulan_tindakan": "Tim proses memeriksa suhu dan tekanan steam di inlet stripper, mengecek kerja steam trap, dan membandingkan tren level dengan laju draw. Tim teknik mengusulkan gamma scanning bila gejala berlanjut.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: flash point LGO kembali di atas batas spesifikasi dengan margin aman dan level stripper stabil.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Flash point LGO yang rendah membuat produk off-spec dan menambah risiko keselamatan saat penyimpanan. Dampaknya masih lokal karena laju draw dapat disesuaikan sementara.",
      "capa_corrective": "Perbaiki kualitas stripping steam dengan memeriksa steam trap dan suhu superheat, lalu sesuaikan rasio steam terhadap laju LGO.",
      "capa_preventive": "Pantau flash point LGO setiap shift dan pasang alarm suhu steam di inlet stripper.",
      "capa_target_date": "2026-12-20",
      "capa_pic": "Tim Proses & Laboratorium",
      "description": "Lapor dari LGO stripper 11-C-102, hasil lab dua hari ini menunjukkan flash point LGO turun mendekati batas, dan level stripper sering naik-turun meskipun laju stripping steam tetap.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(33),
    updated_at: hoursAgo(27)
  },  {
      "id": "CDU11-E01",
      "title": "Karat Merembes dari Insulasi Shell Heat Exchanger 11-E-129",
      "asset_id": "11-E-129",
      "status": "PRADUGA",
      "identitas_alat": "Heat exchanger 11-E-129 (HE 1 pada daftar S1), Seksi Umpan & Cold Preheat, Unit 11 CDU.",
      "gejala": "Teknisi melihat jacket insulasi di bagian bawah shell penyok. Noda karat cokelat merembes dari sambungan jacket setelah hujan deras.",
      "kondisi_operasi": "Alat tercantum setelah pompa umpan 11-P-101 A/B pada daftar S1, sedangkan fungsinya tidak dirinci di sumber terbuka. Crude keluar pompa umpan bersuhu sekitar 47,79 °C, dan cold preheat train memanaskannya hingga 155,1 °C.",
      "pemeriksaan_awal": "Teknisi memeriksa jacket secara visual dari luar tanpa membuka insulasi. Suhu dinding belum diukur, dan area tersebut belum difoto.",
      "praduga_penyebab": "Air hujan diduga masuk melalui jacket yang penyok dan sambungan yang terbuka, lalu memicu korosi di bawah insulasi (CUI) pada dinding shell.",
      "usulan_tindakan": "Inspektor memindai area dengan kamera IR untuk mencari insulasi basah, membuka insulasi di titik terburuk, lalu mengukur ketebalan dinding dengan UT.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: tidak ada penipisan di bawah tebal minimum, dan insulasi serta jacket kembali kedap air.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "CUI berkembang tanpa terlihat dan dapat menipiskan shell hingga bocor. Klorida dari udara atau dari bahan insulasi dapat mempercepat korosi tersebut.",
      "capa_corrective": "Buka insulasi di area yang basah, bersihkan karat, ukur ketebalan dengan UT, lalu pasang coating dan insulasi baru dengan jacket yang kedap.",
      "capa_preventive": "Masukkan 11-E-129 ke program inspeksi CUI berbasis risiko dengan pemindaian IR berkala, dan perbaiki jacket yang rusak segera.",
      "capa_target_date": "2027-01-20",
      "capa_pic": "Tim Inspeksi Statik",
      "description": "Lapor dari area umpan crude, jacket insulasi di bagian bawah shell 11-E-129 penyok dan ada noda karat merembes keluar setelah hujan deras kemarin.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(34),
    updated_at: hoursAgo(28)
  },  {
      "id": "CDU11-E06",
      "title": "Suhu Crude ke Desalter Turun di Bawah 150 °C Akibat Dugaan Fouling 11-E-105 A/B",
      "asset_id": "11-E-105 A/B",
      "status": "TRIAGE",
      "identitas_alat": "Cold preheater 11-E-105 A/B (HE 6; pemanas crude dengan atmospheric residue), Cold Preheat Train, Unit 11 CDU.",
      "gejala": "Suhu crude keluar 11-E-105 A/B turun hingga sekitar 146 °C. Ampere trafo desalter 11-V-101 A/B mulai tidak stabil.",
      "kondisi_operasi": "Rangkaian 11-E-101 s.d. 11-E-105, termasuk 11-E-105 A/B, memanaskan crude hingga 155,1 °C sebelum desalter. Desalter beroperasi pada suhu ±150 °C dan tekanan 8 kg/cm² g.",
      "pemeriksaan_awal": "Engineer menghitung duty 11-E-105 A/B turun sekitar 12% dibanding bulan lalu. ΔP sisi crude naik, sedangkan laju atmospheric residue relatif tetap.",
      "praduga_penyebab": "Fouling di sisi crude diduga menurunkan perpindahan panas, sehingga suhu crude ke desalter turun dan pemisahan air di desalter memburuk.",
      "usulan_tindakan": "Tim proses menjadwalkan pembersihan unit A dan B secara bergantian, lalu menyesuaikan dosis demulsifier selama suhu desalter rendah.",
      "verifikasi": "Kriteria verifikasi: suhu crude ke desalter kembali ≥ 150 °C dan ampere trafo desalter stabil.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Suhu desalter yang rendah menurunkan efisiensi pemisahan garam dan air. Garam yang lolos akan memperberat korosi sistem overhead.",
      "capa_corrective": "Bersihkan 11-E-105 A dan B secara bergantian dan sesuaikan dosis demulsifier selama suhu desalter rendah.",
      "capa_preventive": "Pasang alarm suhu crude ke desalter dan pantau duty 11-E-105 A/B setiap minggu.",
      "capa_target_date": "2027-01-25",
      "capa_pic": "Tim Proses & Thermal",
      "description": "Lapor dari cold preheat train, suhu crude keluar 11-E-105 ke desalter turun sampai sekitar 146 derajat, dan ampere trafo desalter mulai tidak stabil.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_Suhu_Desalter_Inlet_11E105.png (suhu crude ke desalter turun dari 155 ke 146 °C)",
      "image_url": "/assets/cdu11/evidences/cdu11-e06_trend_suhu_desalter_inlet_11e105.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(34),
    updated_at: hoursAgo(28)
  },  {
      "id": "CDU11-E21",
      "title": "Tekanan Splitter Naik & Dugaan Kerak Sisi Pendingin Kondensor 11-E-123",
      "asset_id": "11-E-123",
      "status": "TRIAGE",
      "identitas_alat": "Splitter Overhead Condenser 11-E-123 (kondensor 3), Seksi Splitter, Unit 11 CDU.",
      "gejala": "Tekanan puncak splitter 11-C-105 naik setiap siang hari. Suhu kondensat naphtha keluar 11-E-123 lebih tinggi daripada biasanya.",
      "kondisi_operasi": "Kondensor mengembunkan uap overhead splitter sebelum kondensat masuk drum 11-V-105. Media pendingin tidak disebut di sumber terbuka, sehingga kasus ini memakai skenario air pendingin.",
      "pemeriksaan_awal": "Engineer menghitung koefisien perpindahan panas (U) turun sekitar 25% dari nilai bersih. ΔP sisi air pendingin naik, dan analisis air menunjukkan jumlah bakteri yang tinggi.",
      "praduga_penyebab": "Kerak dan biofilm diduga menumpuk di sisi air pendingin, sehingga perpindahan panas turun dan korosi di bawah endapan (MIC) berpotensi terjadi.",
      "usulan_tindakan": "Tim utilitas menambah dosis biosida dan menyesuaikan program pengolahan air pendingin. Tim proses menjadwalkan pembersihan sisi air saat splitter dapat beroperasi dengan beban rendah.",
      "verifikasi": "Kriteria verifikasi: U kembali minimal 90% dari nilai bersih, dan tekanan puncak splitter stabil pada siang hari.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Kenaikan tekanan splitter dapat membatasi kapasitas dan mendekati setelan pressure safety valve. Korosi di bawah endapan juga dapat membuat tube bocor.",
      "capa_corrective": "Bersihkan sisi air pendingin 11-E-123 dan sesuaikan dosis biosida serta inhibitor kerak.",
      "capa_preventive": "Pantau U, ΔP sisi air, dan jumlah bakteri air pendingin setiap bulan, lalu jaga kecepatan air di atas batas minimum desain.",
      "capa_target_date": "2027-02-10",
      "capa_pic": "Tim Proses & Utilitas",
      "description": "Lapor dari splitter, tekanan puncak 11-C-105 naik setiap siang hari, dan suhu kondensat naphtha keluar 11-E-123 lebih tinggi dari biasanya.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_Tekanan_11C105_vs_SuhuKondensat.png (tekanan puncak splitter naik setiap siang hari)",
      "image_url": "/assets/cdu11/evidences/cdu11-e21_trend_tekanan_11c105_vs_suhukondensat.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(34),
    updated_at: hoursAgo(28)
  },  {
      "id": "CDU11-P14",
      "title": "Level Reservoir Seal Turun Cepat & Dugaan Kebocoran Seal Dalam Pompa 11-P-112 C",
      "asset_id": "11-P-112 C/D",
      "status": "TRIAGE",
      "identitas_alat": "Pompa 11-P-112 C/D (nama tidak disebut di sumber), Seksi Pendinginan Produk, Unit 11 CDU.",
      "gejala": "Level cairan di reservoir seal pompa C turun cepat dan harus diisi ulang setiap dua hari. Kebocoran ke luar tidak terlihat di gland.",
      "kondisi_operasi": "Pompa tercantum setelah 11-P-131 A/B pada daftar S1. Laporan RLA menilai reservoir 11-P-112-B-V1 milik unit 11-P-112B sebagai bejana tekan, sehingga pompa sejenis kemungkinan memakai reservoir serupa.",
      "pemeriksaan_awal": "Catatan pengisian ulang menunjukkan konsumsi cairan reservoir naik tiga kali lipat dalam sebulan. Tekanan reservoir juga lebih rendah daripada pompa D.",
      "praduga_penyebab": "Seal bagian dalam (inboard) diduga aus sehingga cairan reservoir mengalir ke sisi proses. Gejala ini mirip kasus buffer fluid yang bocor pada pompa lain di RU VI Balongan.",
      "usulan_tindakan": "Tim memantau laju penurunan level setiap shift, menyiapkan cartridge seal pengganti, dan menjadwalkan penggantian saat pompa D siap menanggung beban.",
      "verifikasi": "Kriteria verifikasi: level reservoir stabil tanpa pengisian ulang selama 14 hari, dan tidak ada kebocoran selama uji visual 30-60 menit.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Seal dalam yang terus aus dapat berlanjut menjadi kebocoran produk ke atmosfer. Pompa D tersedia sebagai cadangan selama perbaikan.",
      "capa_corrective": "Ganti cartridge seal pompa C serta periksa kondisi seal ring dan mating ring.",
      "capa_preventive": "Catat konsumsi cairan reservoir setiap shift sebagai indikator dini keausan seal.",
      "capa_target_date": "2027-01-08",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari pompa produk, level cairan di reservoir seal pompa 11-P-112 C turun cepat dan harus diisi ulang tiap dua hari.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Log_Pengisian_Reservoir_11P112C.xlsx (konsumsi cairan reservoir naik tiga kali lipat dalam sebulan)",
      "image_url": "/assets/cdu11/evidences/cdu11-p14_log_pengisian_reservoir_11p112c.webp",
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(34),
    updated_at: hoursAgo(28)
  },  {
      "id": "CDU11-P03",
      "title": "Oli Bearing Keruh Seperti Susu di Pompa Pre-Flash 11-P-125 A",
      "asset_id": "11-P-125 A/B",
      "status": "PRADUGA",
      "identitas_alat": "Pompa 11-P-125 A/B (nama tidak disebut di sumber), Seksi Pre-Flash (RDMP), Unit 11 CDU.",
      "gejala": "Oli di sight glass bearing pompa A tampak keruh seperti susu. Suhu housing bearing pompa A lebih tinggi daripada pompa B.",
      "kondisi_operasi": "Pompa tercantum setelah drum 11-V-116 pada daftar S1, sedangkan fungsinya tidak dirinci di sumber terbuka.",
      "pemeriksaan_awal": "Teknisi mengukur suhu housing dengan thermal gun dan memotret sight glass. Sampel oli belum dianalisis di laboratorium.",
      "praduga_penyebab": "Air diduga masuk ke oli bearing melalui seal bearing housing, misalnya dari semprotan air atau kondensasi, sehingga daya lumas oli turun dan bearing lebih panas.",
      "usulan_tindakan": "Teknisi mengganti oli bearing, memeriksa seal bearing housing dan breather, lalu mengirim sampel oli untuk uji kadar air.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: oli tetap jernih selama 30 hari dan suhu housing setara dengan pompa B.",
      "risk_level": "LOW",
      "risk_consequence": "Minor",
      "risk_likelihood": "Possible",
      "risk_summary": "Oli yang tercampur air mempercepat keausan bearing dan dapat membuat pompa berhenti mendadak. Pompa B tersedia sebagai cadangan.",
      "capa_corrective": "Ganti oli bearing serta perbaiki seal bearing housing dan breather.",
      "capa_preventive": "Periksa sight glass oli dalam setiap rute operator dan jadwalkan analisis oli berkala.",
      "capa_target_date": "2026-12-18",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari area pre-flash, oli di sight glass bearing pompa 11-P-125 A terlihat keruh seperti susu, dan suhu housing-nya lebih tinggi dari pompa B.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(35),
    updated_at: hoursAgo(29)
  },  {
      "id": "CDU11-E11",
      "title": "Rembesan Minyak di Flange Channel Hot Preheater 11-E-108 Setelah Start-Up",
      "asset_id": "11-E-108",
      "status": "PRADUGA",
      "identitas_alat": "Hot preheater 11-E-108 (HE 9), Hot Preheat Train, Unit 11 CDU.",
      "gejala": "Teknisi melihat rembesan minyak dan asap tipis di flange channel cover sehari setelah unit start-up. Rembesan menetes ke insulasi di bawah flange.",
      "kondisi_operasi": "Alat merupakan bagian rangkaian 11-E-106 s.d. 11-E-111 yang memanaskan desalted crude hingga 276,7 °C. Flange alat mengalami pemanasan cepat saat unit start-up.",
      "pemeriksaan_awal": "Teknisi mengukur suhu flange dengan thermal gun dan mencatat suhu tinggi di sisi yang merembes. Kebocoran belum diuji dengan metode resmi, dan foto belum dilampirkan.",
      "praduga_penyebab": "Tegangan gasket diduga turun (relaksasi) saat flange memanas cepat ketika start-up, sehingga tekanan kontak gasket tidak lagi cukup menahan minyak.",
      "usulan_tindakan": "Tim mekanik menyiapkan pengencangan ulang baut (hot bolting) atau penggantian gasket sesuai prosedur kerja aman, dengan izin kerja panas dan pengawasan regu pemadam.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: tidak ada rembesan di flange selama 30 hari operasi.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Rembesan minyak panas di flange dapat menyala bila menyentuh permukaan panas atau insulasi yang jenuh minyak. Kebocoran yang membesar berpotensi memicu kebakaran di hot preheat train.",
      "capa_corrective": "Kencangkan ulang baut flange dengan pola bertahap sesuai prosedur atau ganti gasket, lalu ganti insulasi yang jenuh minyak.",
      "capa_preventive": "Terapkan pemanasan bertahap saat start-up, pakai gasket yang sesuai untuk suhu tinggi, dan catat torsi baut setiap perakitan.",
      "capa_target_date": "2026-12-10",
      "capa_pic": "Tim Mekanik Statik & HSE",
      "description": "Lapor dari hot preheat train, setelah unit start-up kemarin ada rembesan minyak dan asap tipis di flange channel cover 11-E-108, area sudah saya beri tanda.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(36),
    updated_at: hoursAgo(30)
  },  {
      "id": "CDU11-E16",
      "title": "Beda Suhu Antar-Bay & Dugaan Kerak Garam Kondensor Overhead 11-E-114",
      "asset_id": "11-E-114",
      "status": "PRADUGA",
      "identitas_alat": "Fin fan condenser 11-E-114 (kondensor overhead Main Fractionator 11-C-101), Sistem Overhead, Unit 11 CDU.",
      "gejala": "Teknisi menemukan satu bay 11-E-114 dengan suhu outlet header jauh lebih dingin daripada bay lain saat patroli siang. Tekanan puncak kolom 11-C-101 juga naik perlahan selama sepekan.",
      "kondisi_operasi": "Kondensat overhead 11-C-101 mengalir melalui 11-E-114 menuju accumulator 11-V-102. Amonia dan corrosion inhibitor diinjeksikan di jalur overhead untuk menetralkan HCl dan menahan korosi.",
      "pemeriksaan_awal": "Teknisi mengukur selisih suhu sekitar 18 °C antara bay tersebut dan bay tetangga dengan thermal gun. Hasil pengukuran belum dicatat di log resmi dan belum difoto.",
      "praduga_penyebab": "Sebagian tube pada bay tersebut diduga tersumbat endapan garam amonium klorida (NH₄Cl). Endapan ini juga berpotensi memicu korosi di bawah endapan (under-deposit corrosion).",
      "usulan_tindakan": "Tim proses mengambil sampel sour water 11-V-102 untuk uji pH, klorida, dan besi (Fe). Inspektor memindai seluruh bay dengan kamera IR, dan engineer memeriksa data water wash serta suhu overhead.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: profil suhu outlet antar-bay kembali seragam dan tekanan puncak kolom kembali ke baseline.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Endapan garam dan korosi di bawah endapan dapat membuat tube 11-E-114 bocor. Kebocoran hidrokarbon di kondensor overhead berpotensi memicu kebakaran atau shutdown CDU.",
      "capa_corrective": "Lakukan water wash terkendali pada bay terdampak setelah kajian titik embun dan suhu deposisi garam.",
      "capa_preventive": "Pantau suhu outlet tiap bay setiap minggu serta tren klorida dan Fe sour water 11-V-102 sebagai indikator dini.",
      "capa_target_date": "2026-12-15",
      "capa_pic": "Tim Proses & Inspeksi Korosi",
      "description": "Lapor dari overhead 11-C-101, saat patroli saya ukur pakai thermal gun, satu bay fin fan 11-E-114 suhu outlet header-nya jauh lebih dingin dari bay lain, dan tekanan puncak kolom naik pelan seminggu ini.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(37),
    updated_at: hoursAgo(31)
  },  {
      "id": "CDU11-P13",
      "title": "Suhu Gland Seal Tinggi & Dugaan Strainer Flushing Tersumbat di Pompa 11-P-131 A",
      "asset_id": "11-P-131 A/B",
      "status": "PRADUGA",
      "identitas_alat": "Pompa 11-P-131 A/B (nama tidak disebut di sumber), Seksi Pendinginan Produk, Unit 11 CDU.",
      "gejala": "Gland seal pompa A jauh lebih panas daripada pompa B. Pipa flushing seal pompa A terasa dingin, yang menandakan aliran flushing kecil.",
      "kondisi_operasi": "Pompa tercantum setelah 11-E-124 dan 11-E-126 (naphtha) pada daftar S1, sedangkan fungsinya tidak dirinci di sumber terbuka.",
      "pemeriksaan_awal": "Teknisi mengukur suhu gland dengan thermal gun dan mendapati selisih sekitar 25 °C dengan pompa B. Kebocoran belum terlihat.",
      "praduga_penyebab": "Strainer atau orifice di jalur flushing seal diduga tersumbat, sehingga panas gesekan seal tidak terbawa keluar dan permukaan seal kepanasan.",
      "usulan_tindakan": "Teknisi membersihkan strainer dan orifice flushing, memeriksa arah aliran flushing, lalu memantau suhu gland setiap shift.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: suhu gland pompa A setara dengan pompa B dan tidak ada kebocoran seal.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Seal yang kepanasan cepat aus dan dapat bocor, sehingga produk ringan keluar ke atmosfer. Pompa B tersedia sebagai cadangan.",
      "capa_corrective": "Bersihkan strainer dan orifice flushing seal, lalu pastikan aliran flushing sesuai desain.",
      "capa_preventive": "Pantau suhu gland seal setiap shift dan masukkan strainer flushing ke jadwal pembersihan rutin.",
      "capa_target_date": "2026-12-15",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari area pendinginan produk, gland seal pompa 11-P-131 A panas sekali dibanding pompa B, dan pipa flushing seal-nya terasa dingin.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(37),
    updated_at: hoursAgo(31)
  },  {
      "id": "CDU11-V04",
      "title": "Kondensat Terbawa ke Fuel Gas & Ujung Burner Tersumbat dari KO Drum 11-V-103",
      "asset_id": "11-V-103",
      "status": "TRIAGE",
      "identitas_alat": "Off-Gas KO Drum 11-V-103 (knock-out drum), Sistem Overhead, Unit 11 CDU.",
      "gejala": "Operator melihat beberapa nyala burner 11-F-101 terangkat dan tidak stabil. Level KO drum 11-V-103 sering naik mendekati alarm tinggi.",
      "kondisi_operasi": "KO drum menangkap kondensat dari off gas, dan gasnya menjadi bahan bakar furnace 11-F-101. Drum ini juga tercantum sebagai titik injeksi kaustik untuk mengikat H₂S.",
      "pemeriksaan_awal": "Inspeksi burner saat pembersihan rutin menemukan lubang gas tip tersumbat endapan hitam. Tren DCS menunjukkan level KO drum tinggi pada jam yang sama dengan nyala yang tidak stabil.",
      "praduga_penyebab": "Kondensat diduga terbawa (carryover) dari KO drum ke jalur fuel gas karena level tinggi, lalu mengembun dan membentuk kokas di gas tip burner.",
      "usulan_tindakan": "Operator menurunkan setpoint level dan memeriksa level transmitter serta drain otomatis KO drum. Tim membersihkan gas tip dan memeriksa suhu jalur fuel gas ke burner.",
      "verifikasi": "Kriteria verifikasi: level KO drum stabil di bawah alarm, nyala burner merata, dan tidak ada gas tip yang tersumbat pada inspeksi berikutnya.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Burner yang tersumbat membuat sebaran panas tidak merata dan memicu hot spot pada tube furnace. Nyala yang tidak stabil juga meningkatkan risiko gangguan pembakaran.",
      "capa_corrective": "Turunkan setpoint level KO drum, perbaiki level transmitter dan drain, lalu bersihkan gas tip burner.",
      "capa_preventive": "Pasang alarm level KO drum yang ditautkan ke pemantauan nyala burner, dan jaga jalur fuel gas tetap hangat agar aerosol tidak mengembun.",
      "capa_target_date": "2027-01-15",
      "capa_pic": "Tim Proses, Instrumentasi & Furnace",
      "description": "Lapor dari furnace 11-F-101, beberapa nyala burner terlihat terangkat dan tidak stabil, dan level KO drum 11-V-103 sering tinggi menjelang alarm.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Foto_GasTip_Tersumbat_11F101.jpg (gas tip burner dengan endapan hitam)",
      "image_url": "/assets/cdu11/evidences/cdu11-v04_foto_gastip_tersumbat_11f101.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(39),
    updated_at: hoursAgo(33)
  },  {
      "id": "CDU11-E08",
      "title": "Kerak & Penipisan Inlet Tube di Sisi Effluent Desalter 11-E-128 A/B",
      "asset_id": "11-E-128 A/B",
      "status": "INVESTIGATION",
      "identitas_alat": "Heat exchanger 11-E-128 A/B (nama tidak disebut di sumber; lokasi titik sampling desalter effluent water), Seksi Desalting, Unit 11 CDU.",
      "gejala": "Sampel effluent di titik 11-E-128 sering membawa butiran pasir halus. Beda tekanan sisi effluent unit A naik bertahap selama sebulan.",
      "kondisi_operasi": "Effluent desalter 11-V-101 A/B mengalir melalui area 11-E-128 A/B. Effluent membawa air garam, padatan, dan sisa minyak dari proses desalting.",
      "pemeriksaan_awal": "Inspeksi borescope di inlet tube unit A menemukan kerak putih keabu-abuan dan penipisan berbentuk tapal kuda di ujung masuk tube. Hasil UT channel masih di atas tebal minimum.",
      "praduga_penyebab": "Padatan dalam effluent diduga mengikis ujung masuk tube (erosi-korosi), sementara garam karbonat membentuk kerak yang menyempitkan aliran.",
      "usulan_tindakan": "Tim memasang tube insert di ujung masuk tube unit A, membersihkan kerak secara kimia, dan mengevaluasi pengurangan padatan effluent lewat pengaturan mud wash desalter.",
      "verifikasi": "Kriteria verifikasi: ΔP sisi effluent kembali ke baseline dan borescope ulang tidak menunjukkan penipisan baru di ujung tube.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Minor",
      "risk_likelihood": "Likely",
      "risk_summary": "Kebocoran tube dapat mencampur effluent dengan aliran lain dan mengganggu unit pengolahan air limbah. Dampaknya terbatas pada area desalting.",
      "capa_corrective": "Pasang tube insert di ujung masuk tube, bersihkan kerak secara kimia, dan plug tube yang tipis.",
      "capa_preventive": "Kendalikan padatan effluent lewat jadwal mud wash desalter dan pantau ΔP 11-E-128 A/B setiap minggu.",
      "capa_target_date": "2027-02-20",
      "capa_pic": "Tim Proses & Inspeksi Statik",
      "description": "Lapor dari titik sampling effluent desalter di 11-E-128, sampel air sering membawa butiran pasir halus, dan beda tekanan sisi effluent unit A naik bertahap.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "Borescope_Inlet_Tube_11E128A.jpg (kerak dan penipisan tapal kuda di ujung masuk tube); Trend_DP_Effluent_11E128A.png (kenaikan ΔP sisi effluent selama sebulan. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/journal/g25.webp",
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(41),
    updated_at: hoursAgo(35)
  },  {
      "id": "CDU11-V09",
      "title": "Agitator Bergetar & Larutan Wetting Agent Tidak Homogen di Vessel 11-V-114",
      "asset_id": "11-V-114",
      "status": "PRADUGA",
      "identitas_alat": "Wetting Agent Preparation Vessel 11-V-114 (vessel preparasi), Seksi Bahan Kimia, Unit 11 CDU.",
      "gejala": "Agitator vessel bergetar keras dan berbunyi. Larutan di dasar vessel terlihat menggumpal dan tidak tercampur rata.",
      "kondisi_operasi": "Vessel menjadi tempat preparasi larutan wetting agent untuk mempercepat pemisahan.",
      "pemeriksaan_awal": "Teknisi mengukur suhu gearbox agitator dengan thermal gun dan mendapati nilainya lebih tinggi daripada biasanya. Pengukuran vibrasi dan pemeriksaan oli gearbox belum dilakukan.",
      "praduga_penyebab": "Bearing gearbox agitator diduga aus atau poros agitator diduga tidak sejajar, sehingga putaran tidak stabil dan pencampuran tidak sempurna.",
      "usulan_tindakan": "Teknisi mengukur vibrasi gearbox sesuai ISO 10816-3, memeriksa oli gearbox, serta mengecek kelurusan poros dan kondisi impeller agitator.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: vibrasi agitator kembali ke zona aman dan larutan wetting agent homogen.",
      "risk_level": "LOW",
      "risk_consequence": "Minor",
      "risk_likelihood": "Possible",
      "risk_summary": "Larutan wetting agent yang tidak homogen dapat mengganggu dosis bahan kimia untuk pemisahan. Dampaknya terbatas dan belum mengancam keselamatan.",
      "capa_corrective": "Ganti bearing gearbox yang aus, ganti oli, dan setel ulang kelurusan poros agitator.",
      "capa_preventive": "Masukkan agitator 11-V-114 ke rute vibrasi bulanan dan jadwal penggantian oli gearbox.",
      "capa_target_date": "2026-12-20",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari area bahan kimia, agitator vessel wetting agent 11-V-114 bergetar keras dan berbunyi, dan larutan di dasar vessel terlihat menggumpal.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(41),
    updated_at: hoursAgo(35)
  },  {
      "id": "CDU11-E07",
      "title": "Suhu Wash Water Turun & Dugaan Lumpur di Wash Water Heater 11-E-116",
      "asset_id": "11-E-116",
      "status": "PRADUGA",
      "identitas_alat": "Wash water heater 11-E-116, Seksi Desalting, Unit 11 CDU.",
      "gejala": "Operator mencatat suhu wash water keluar 11-E-116 lebih rendah daripada pekan sebelumnya pada laju alir yang sama.",
      "kondisi_operasi": "Alat ini memanaskan wash water desalter dengan memanfaatkan panas effluent desalter 11-V-101 A/B.",
      "pemeriksaan_awal": "Indikator suhu lokal menunjukkan penurunan sekitar 6 °C. Operator belum mengambil foto dan belum menarik data tren DCS.",
      "praduga_penyebab": "Lumpur dan kerak dari effluent desalter diduga menempel di permukaan perpindahan panas sehingga panas yang berpindah berkurang.",
      "usulan_tindakan": "Engineer proses membandingkan tren suhu masuk-keluar kedua sisi selama 30 hari. Laboratorium menguji oil content dan padatan tersuspensi pada effluent desalter.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: selisih suhu wash water kembali ke baseline setelah flushing atau pembersihan.",
      "risk_level": "LOW",
      "risk_consequence": "Minor",
      "risk_likelihood": "Possible",
      "risk_summary": "Wash water yang kurang panas dapat menurunkan efektivitas pencucian garam di desalter. Dampaknya masih lokal dan belum mengancam keselamatan.",
      "capa_corrective": "Jadwalkan flushing atau pembersihan sisi effluent saat bypass memungkinkan.",
      "capa_preventive": "Pantau selisih suhu 11-E-116 setiap bulan bersama kualitas effluent desalter.",
      "capa_target_date": "2027-01-15",
      "capa_pic": "Tim Proses",
      "description": "Lapor dari seksi desalting, suhu wash water keluar 11-E-116 turun sekitar enam derajat dibanding minggu lalu padahal aliran effluent desalter yang memanaskannya tetap.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(42),
    updated_at: hoursAgo(36)
  },  {
      "id": "CDU11-E18",
      "title": "Rembesan Flange & Endapan Amonium Bisulfida di Heat Exchanger Stabilizer 11-E-121",
      "asset_id": "11-E-121",
      "status": "INVESTIGATION",
      "identitas_alat": "Heat exchanger 11-E-121 (HE 13; fungsi tidak dirinci di sumber terbuka), Seksi Stabilisasi Naphtha, Unit 11 CDU.",
      "gejala": "Detektor gas portabel membaca H₂S rendah di dekat flange channel 11-E-121. ΔP sisi proses alat naik perlahan selama sebulan.",
      "kondisi_operasi": "Alat tercantum di antara stabilizer 11-C-104 dan drum 11-V-104 pada daftar S1, sehingga alat ini kemungkinan bekerja di jalur overhead stabilizer (perlu verifikasi P&ID). Overhead stabilizer membawa gas ringan, air, dan H₂S.",
      "pemeriksaan_awal": "Uji kebocoran flange dengan larutan sabun menemukan rembesan kecil. Analisis air di 11-V-104 menunjukkan kadar amonia dan H₂S yang tinggi, dan engineer memperkirakan konsentrasi NH₄HS mendekati 2 %berat.",
      "praduga_penyebab": "Garam amonium bisulfida (NH₄HS) diduga mengendap dan menimbulkan korosi di sisi proses, sementara gasket flange channel mengalami kebocoran kecil.",
      "usulan_tindakan": "Tim mengencangkan baut flange sesuai prosedur, memasang clamp sementara bila perlu, dan menyiapkan inspeksi tube saat alat dapat dibypass. Tim proses mengevaluasi water wash untuk menurunkan NH₄HS.",
      "verifikasi": "Kriteria verifikasi: tidak ada pembacaan H₂S di sekitar flange, ΔP kembali ke baseline, dan kadar NH₄HS air overhead di bawah 2 %berat.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Kebocoran di jalur overhead stabilizer dapat melepaskan gas H₂S beracun ke area kerja. Korosi NH₄HS juga dapat menipiskan tube hingga bocor.",
      "capa_corrective": "Perbaiki kebocoran flange sesuai prosedur dan lakukan water wash terkendali untuk melarutkan endapan NH₄HS.",
      "capa_preventive": "Pantau kadar NH₄HS dan kecepatan aliran di jalur overhead stabilizer, lalu pasang detektor H₂S tetap di area 11-E-121.",
      "capa_target_date": "2027-01-31",
      "capa_pic": "Tim Proses, Inspeksi Korosi & HSE",
      "description": "Lapor dari seksi stabilizer, detektor gas portabel saya membaca H₂S rendah di dekat flange channel 11-E-121, dan beda tekanan sisi proses alat itu naik pelan sejak sebulan.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "Foto_Uji_Sabun_Flange_11E121.jpg (gelembung kecil di flange channel); Lab_NH3_H2S_Air_11V104.pdf (kadar amonia dan H₂S air overhead stabilizer. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/foto_uji_sabun_flange_11e121.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(43),
    updated_at: hoursAgo(37)
  },  {
      "id": "CDU11-P04",
      "title": "Bau H₂S di Seal Pompa Sour Water Pre-Flash 11-P-126 A",
      "asset_id": "11-P-126 A/B",
      "status": "TRIAGE",
      "identitas_alat": "Pompa 11-P-126 A/B (dikaitkan dengan titik sampling sour water overhead 11-V-116), Seksi Pre-Flash (RDMP), Unit 11 CDU.",
      "gejala": "Teknisi mencium bau telur busuk di sekitar seal pompa A, dan detektor H₂S personal sempat berbunyi. Tetesan cairan terlihat di gland seal.",
      "kondisi_operasi": "Discharge pompa ini menjadi titik sampling sour water overhead 11-V-116. Sour water overhead mengandung H₂S terlarut.",
      "pemeriksaan_awal": "Pengukuran gas portabel di dekat gland seal membaca H₂S di atas ambang alarm personal, sedangkan bacaan pada jarak 3 m kembali nol. Vibrasi pompa masih di zona aman.",
      "praduga_penyebab": "Mechanical seal diduga aus sehingga sour water ber-H₂S bocor sedikit ke atmosfer.",
      "usulan_tindakan": "Operator memindahkan beban ke pompa B serta memasang barikade dan tanda bahaya H₂S. Tim mekanik menyiapkan penggantian seal dengan izin kerja gas beracun.",
      "verifikasi": "Kriteria verifikasi: tidak ada bacaan H₂S di sekitar seal, dan tidak ada kebocoran selama uji visual 30-60 menit setelah penggantian seal.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Kebocoran sour water ber-H₂S membahayakan pekerja di sekitar pompa. Gas H₂S beracun bahkan pada konsentrasi rendah.",
      "capa_corrective": "Ganti mechanical seal pompa A dan periksa impeller serta casing terhadap erosi-korosi.",
      "capa_preventive": "Pasang detektor H₂S tetap di area pompa sour water dan pertimbangkan seal ganda dengan sistem buffer untuk servis ini.",
      "capa_target_date": "2026-12-12",
      "capa_pic": "Tim Mekanik Rotating & HSE",
      "description": "Lapor dari area pre-flash, di sekitar seal pompa 11-P-126 A tercium bau telur busuk dan detektor H₂S personal saya sempat berbunyi.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Bacaan_H2S_Gland_11P126A.png (foto layar detektor dengan bacaan H₂S di dekat gland seal)",
      "image_url": "/assets/cdu11/evidences/bacaan_h2s_gland_11p126a.webp",
      "verified_by": null,
      "finding_type": "Near Miss",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(43),
    updated_at: hoursAgo(37)
  },  {
      "id": "CDU11-P15",
      "title": "Arus Motor Mendekati Batas & Vibrasi Naik di Pompa Side Stripper 11-P-107 A",
      "asset_id": "11-P-107 A/B",
      "status": "TRIAGE",
      "identitas_alat": "Pompa 11-P-107 A/B (nama tidak disebut di sumber), Seksi Side Stripper, Unit 11 CDU.",
      "gejala": "Arus motor pompa A mendekati batas nameplate sejak laju umpan CDU dinaikkan. Vibrasi pompa juga naik walaupun masih di zona peringatan.",
      "kondisi_operasi": "Pompa tercantum setelah LGO stripper 11-C-102 pada daftar S1, sehingga pompa kemungkinan memompa produk stripper tersebut (perlu verifikasi P&ID). Aliran keluar LGO stripper sekitar 81.930 kg/jam, dan kapasitas CDU naik menjadi 150.000 BPSD setelah RDMP Phase 1.",
      "pemeriksaan_awal": "Data DCS menunjukkan titik operasi pompa bergeser jauh ke kanan titik efisiensi terbaik (BEP) pada kurva pabrik. Pengukuran ISO 10816-3 mencatat vibrasi horizontal naik di semua titik.",
      "praduga_penyebab": "Pompa diduga beroperasi mendekati runout setelah kenaikan laju, sehingga NPSH yang dibutuhkan naik serta beban motor dan vibrasi meningkat.",
      "usulan_tindakan": "Tim proses menilai pembagian beban dengan menjalankan pompa A dan B paralel bila sistem memungkinkan. Tim mekanik mengevaluasi ukuran impeller yang sesuai untuk laju baru.",
      "verifikasi": "Kriteria verifikasi: titik operasi berada di sekitar BEP, arus motor di bawah 90% nameplate, dan vibrasi kembali ke zona aman.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Operasi dekat runout mempercepat kerusakan bearing dan seal serta dapat membuat motor trip. Gangguan pompa ini membatasi pengambilan produk dari side stripper.",
      "capa_corrective": "Atur pembagian beban pompa dan sesuaikan ukuran impeller atau pompa dengan laju setelah RDMP.",
      "capa_preventive": "Tinjau ulang semua pompa yang terdampak kenaikan kapasitas terhadap kurva pabriknya.",
      "capa_target_date": "2027-02-28",
      "capa_pic": "Tim Proses & Mekanik Rotating",
      "description": "Lapor dari side stripper, sejak laju umpan CDU dinaikkan, arus motor pompa 11-P-107 A mendekati batas dan getarannya naik.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Titik_Operasi_vs_Kurva_11P107A.png (titik operasi jauh di kanan BEP)",
      "image_url": "/assets/cdu11/evidences/cdu11-p15_titik_operasi_vs_kurva_11p107a.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(43),
    updated_at: hoursAgo(37)
  },  {
      "id": "CDU11-I02",
      "title": "Osilasi Laju Alir & Dugaan Valve Lengket (Stiction) di 11-FV-037",
      "asset_id": "11-FV-037",
      "status": "PRADUGA",
      "identitas_alat": "Flow control valve 11-FV-037 (titik sampling naphtha column 11-C-105), Seksi Splitter, Unit 11 CDU.",
      "gejala": "Laju alir di loop 11-FV-037 naik-turun teratur seperti gigi gergaji walaupun setpoint tetap. Osilasi tetap muncul setelah operator mengubah tuning controller.",
      "kondisi_operasi": "Valve mengatur aliran di sekitar splitter 11-C-105 dan menjadi lokasi titik sampling naphtha column 11-C-105.",
      "pemeriksaan_awal": "Operator melihat pola osilasi di tren DCS tanpa mengekspor data. Plot OP terhadap PV belum dibuat.",
      "praduga_penyebab": "Gesekan statis pada stem valve (stiction) diduga membuat valve tertahan lalu melompat, sehingga loop berosilasi terus.",
      "usulan_tindakan": "Tim instrumentasi membuat plot OP-PV dari data DCS, melakukan uji langkah kecil pada valve dalam mode manual, serta memeriksa packing dan positioner.",
      "verifikasi": "Menunggu perbaikan & verifikasi fisik. Target: osilasi hilang, dan valve mengikuti perubahan OP kecil tanpa lompatan.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Minor",
      "risk_likelihood": "Likely",
      "risk_summary": "Osilasi aliran mengganggu kestabilan splitter serta mutu naphtha dan kerosene. Valve yang terus berosilasi juga lebih cepat aus.",
      "capa_corrective": "Setel ulang atau ganti packing valve, kalibrasi positioner, dan perbaiki stem bila aus.",
      "capa_preventive": "Jalankan pemantauan kinerja loop secara berkala untuk mendeteksi pola stiction sejak dini.",
      "capa_target_date": "2026-12-18",
      "capa_pic": "Tim Instrumentasi",
      "description": "Lapor dari splitter, laju alir di loop 11-FV-037 naik-turun teratur seperti gergaji walaupun setpoint tidak berubah.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Instrumentasi & Kontrol",
      "evidence_note": "Belum ada file bukti fisik yang diunggah.",
      "image_url": null,
      "verified_by": null,
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(45),
    updated_at: hoursAgo(39)
  },  {
      "id": "CDU11-V02",
      "title": "pH Sour Water Turun & Dugaan Korosi Boot Pre-Flash Condenser Drum 11-V-116",
      "asset_id": "11-V-116",
      "status": "TRIAGE",
      "identitas_alat": "Pre-Flash Condenser Drum 11-V-116 (drum kondensor; panjang 6,3 m, diameter 3 m), Seksi Pre-Flash, Unit 11 CDU.",
      "gejala": "Laboratorium melaporkan pH sour water turun dan kadar besi naik selama dua minggu. Sampel diambil di discharge pompa 11-P-126 sebagai titik sampling sour water 11-V-116.",
      "kondisi_operasi": "Drum memisahkan fraksi ringan dari 11-C-106 menjadi fasa cair (air dan naphtha) dan fasa gas. Drum buatan PT Boma Bisma Indra ini termasuk peralatan baru proyek RDMP.",
      "pemeriksaan_awal": "Data UT baseline drum dari masa konstruksi tersedia sebagai pembanding. UT spot terbaru di boot air menunjukkan penipisan awal di dekat nozzle outlet air.",
      "praduga_penyebab": "HCl dari garam klorida yang terbawa ke overhead pre-flash diduga menurunkan pH air kondensat dan menyerang boot air drum.",
      "usulan_tindakan": "Tim proses meninjau apakah overhead pre-flash memerlukan injeksi penetral dan inhibitor seperti overhead 11-C-101. Inspektor memperluas UT grid di boot, dan laboratorium memantau pH, klorida, serta Fe setiap hari.",
      "verifikasi": "Kriteria verifikasi: pH sour water kembali ke rentang IOW, kadar Fe turun, dan UT ulang tidak menunjukkan penipisan baru.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Penipisan boot dapat berujung kebocoran sour water ber-H₂S dan hidrokarbon ringan. Drum baru yang cepat menipis juga menandakan masalah sistemik di overhead pre-flash.",
      "capa_corrective": "Optimalkan pengendalian korosi overhead pre-flash (penetral dan inhibitor) serta perbaiki kinerja desalter.",
      "capa_preventive": "Tetapkan IOW pH, klorida, dan Fe untuk sour water 11-V-116, lalu bandingkan UT berkala dengan data baseline konstruksi.",
      "capa_target_date": "2027-01-31",
      "capa_pic": "Tim Proses & Inspeksi Korosi",
      "description": "Lapor dari area pre-flash, hasil lab sour water dari discharge pompa 126 menunjukkan pH turun dan besi naik dua minggu ini.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "Lab_pH_Fe_SourWater_11V116_14hari.pdf (pH turun dan Fe naik selama 14 hari)",
      "image_url": "/assets/cdu11/evidences/cdu11-v02_lab_ph_fe_sourwater_11v116_14hari.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(46),
    updated_at: hoursAgo(40)
  },  {
      "id": "CDU11-E12",
      "title": "Penipisan Nozzle Inlet Sisi Bottom Pump-Around Hot Preheater 11-E-109",
      "asset_id": "11-E-109",
      "status": "TRIAGE",
      "identitas_alat": "Hot preheater 11-E-109 (HE 10; pemanas desalted crude dengan bottom pump-around), Hot Preheat Train, Unit 11 CDU.",
      "gejala": "UT rutin menemukan nozzle inlet sisi bottom pump-around lebih tipis daripada data tahun lalu. Teknisi belum melihat tanda kebocoran.",
      "kondisi_operasi": "Bottom pump-around ditarik dari tray 25 kolom 11-C-101 oleh 11-P-106, mengalir ke 11-E-120 lalu 11-E-109, dan kembali ke tray 22. Data CAIS mencatat TAN HGO 1,10-1,65 dan residu 1,00-1,24 mg KOH/g.",
      "pemeriksaan_awal": "Pengukuran UT spot menunjukkan laju penipisan sekitar 0,22 mm/tahun di nozzle inlet, terutama di sisi luar belokan aliran.",
      "praduga_penyebab": "Korosi asam naftenat diduga menyerang nozzle inlet karena aliran bottom pump-around panas, ber-TAN tinggi, dan turbulen di area masuk.",
      "usulan_tindakan": "Inspektor memetakan ketebalan dengan UT grid, memasang probe UT permanen, dan mengecek kesesuaian metalurgi nozzle bersama engineer material.",
      "verifikasi": "Kriteria verifikasi: laju korosi terukur di bawah 0,13 mm/tahun selama tiga bulan berturut-turut, atau nozzle diganti dengan material tahan NAC.",
      "risk_level": "HIGH",
      "risk_consequence": "Catastrophic",
      "risk_likelihood": "Possible",
      "risk_summary": "Nozzle yang terus menipis dapat bocor dan melepaskan hidrokarbon panas yang mudah terbakar. Kebocoran di hot preheat train berpotensi menjadi kejadian Process Safety Tier 1/2.",
      "capa_corrective": "Ganti nozzle dengan material tahan NAC bila tebal mendekati minimum, dan pasang probe UT permanen di nozzle inlet.",
      "capa_preventive": "Tetapkan batas TAN campuran crude, siapkan injeksi inhibitor suhu tinggi, dan pantau ketebalan nozzle secara online.",
      "capa_target_date": "2027-02-28",
      "capa_pic": "Tim Inspeksi Korosi & Proses",
      "description": "Lapor dari hot preheat train, hasil UT rutin di nozzle inlet sisi bottom pump-around 11-E-109 lebih tipis dari data tahun lalu.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "UT_Spot_Nozzle_11E109.pdf (data UT nozzle inlet tahun lalu dan tahun ini)",
      "image_url": "/assets/cdu11/evidences/cdu11-e12_ut_spot_nozzle_11e109.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(47),
    updated_at: hoursAgo(41)
  },  {
      "id": "CDU11-C05",
      "title": "ΔP Seksi Atas Naik & Dugaan Korosi Amonium Bisulfida di Stabilizer 11-C-104",
      "asset_id": "11-C-104",
      "status": "TRIAGE",
      "identitas_alat": "Stabilizer 11-C-104 (kolom distilasi), Seksi Stabilisasi Naphtha, Unit 11 CDU.",
      "gejala": "Beda tekanan seksi atas stabilizer naik perlahan selama sebulan. Operator melihat sour water dari drum 11-V-104 berwarna lebih hitam daripada biasanya.",
      "kondisi_operasi": "Stabilizer memisahkan hidrokarbon fasa gas dari naphtha dengan umpan fraksi minyak sekitar 63.600 kg/jam. Umpan dipanaskan di 11-E-119, bottom dipanaskan reboiler 11-E-120, dan uap atas masuk 11-V-104.",
      "pemeriksaan_awal": "Tren DCS menunjukkan ΔP seksi atas naik sekitar 25% dari baseline. Analisis sour water 11-V-104 menunjukkan kadar besi (Fe) dan H₂S lebih tinggi daripada bulan sebelumnya.",
      "praduga_penyebab": "Garam amonium bisulfida (NH₄HS) dan endapan besi sulfida diduga menumpuk di tray seksi atas. Endapan tersebut menyumbat tray dan mempercepat korosi.",
      "usulan_tindakan": "Tim proses menghitung konsentrasi NH₄HS di air overhead dan mengevaluasi kebutuhan water wash. Inspektor menyiapkan UT di area overhead, dan tim mempertimbangkan gamma scan bila ΔP terus naik.",
      "verifikasi": "Kriteria verifikasi: ΔP seksi atas kembali ke baseline dan kadar Fe sour water 11-V-104 turun ke rentang normal selama 30 hari.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Likely",
      "risk_summary": "Korosi NH₄HS dapat melubangi tray dan menipiskan dinding seksi atas. Kebocoran di area ini dapat melepaskan gas H₂S beracun.",
      "capa_corrective": "Lakukan water wash terkendali untuk melarutkan garam NH₄HS dan bersihkan tray saat ada kesempatan shutdown.",
      "capa_preventive": "Pantau ΔP seksi atas serta kadar Fe dan H₂S sour water 11-V-104 setiap minggu, lalu jaga konsentrasi NH₄HS dan kecepatan aliran di bawah batas desain.",
      "capa_target_date": "2027-01-25",
      "capa_pic": "Tim Proses & Inspeksi Korosi",
      "description": "Lapor dari stabilizer 11-C-104, beda tekanan seksi atas naik pelan sebulan ini, dan sour water dari drum 11-V-104 terlihat lebih hitam dari biasanya.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_DP_SeksiAtas_11C104_30hari.png (grafik ΔP seksi atas naik sekitar 25%)",
      "image_url": "/assets/cdu11/evidences/cdu11-c05_trend_dp_seksiatas_11c104_30hari.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(50),
    updated_at: hoursAgo(44)
  },  {
      "id": "CDU11-P08",
      "title": "Tetesan & Asap Tipis di Mechanical Seal Pompa Bottom Pump-Around 11-P-106",
      "asset_id": "11-P-106",
      "status": "TRIAGE",
      "identitas_alat": "Pompa bottom pump-around 11-P-106, Seksi Pump-Around, Unit 11 CDU.",
      "gejala": "Teknisi melihat tetesan cairan sekitar satu tetes per menit di gland mechanical seal. Asap tipis sesekali keluar dari area gland saat angin tenang.",
      "kondisi_operasi": "Pompa menarik cairan panas dari tray 25 kolom 11-C-101, mengalirkannya ke 11-E-120 lalu 11-E-109, dan mengembalikannya ke tray 22. Kode tag tanpa akhiran A/B menandakan satu unit, sehingga keberadaan pompa cadangan perlu dicek di P&ID.",
      "pemeriksaan_awal": "Teknisi mengukur suhu gland seal dengan thermal gun dan mendapati nilainya lebih tinggi daripada pompa sejenis. Pembacaan vibrasi masih dalam batas normal.",
      "praduga_penyebab": "Permukaan seal ring diduga aus atau retak karena panas berlebih dan aliran flushing seal yang kurang.",
      "usulan_tindakan": "Teknisi memeriksa aliran dan suhu flushing seal. Tim menyiapkan cartridge seal pengganti dan berkoordinasi dengan Proses untuk menurunkan laju pump-around selama perbaikan.",
      "verifikasi": "Kriteria verifikasi: tidak ada kebocoran selama uji visual 30-60 menit dan vibrasi tetap normal setelah penggantian seal.",
      "risk_level": "HIGH",
      "risk_consequence": "Catastrophic",
      "risk_likelihood": "Possible",
      "risk_summary": "Kebocoran hidrokarbon panas dari seal pompa pump-around berpotensi menyala dan menjadi kejadian Process Safety Tier 1/2.",
      "capa_corrective": "Ganti cartridge mechanical seal, periksa seal ring dan mating ring, lalu lakukan laser alignment ulang.",
      "capa_preventive": "Pantau suhu gland dan aliran flushing setiap shift, serta masukkan 11-P-106 ke rute analisis vibrasi dua mingguan.",
      "capa_target_date": "2026-12-05",
      "capa_pic": "Tim Mekanik Rotating & HSE",
      "description": "Lapor dari area pump-around, mechanical seal pompa 11-P-106 meneteskan cairan sekitar satu tetes per menit dan sesekali keluar asap tipis dari gland, area sudah saya barikade.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Foto_Tetesan_Seal_11P106.jpg (tetesan di gland seal dan area yang sudah dibarikade)",
      "image_url": "/assets/cdu11/evidences/foto_tetesan_seal_11p106.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(52),
    updated_at: hoursAgo(46)
  },  {
      "id": "CDU11-V05",
      "title": "Indikasi HIC/SOHIC di Dinding Stabilizer Overhead Drum 11-V-104",
      "asset_id": "11-V-104",
      "status": "INVESTIGATION",
      "identitas_alat": "Stabilizer overhead drum 11-V-104, Seksi Stabilisasi Naphtha, Unit 11 CDU.",
      "gejala": "Pemindaian ultrasonik otomatis (AUT) terjadwal menemukan banyak indikasi sejajar permukaan di tengah tebal dinding dekat water boot 11-V-104.",
      "kondisi_operasi": "Drum memisahkan off gas, air, dan naphtha dari overhead stabilizer 11-C-104. Sour water dari drum ini menjadi salah satu titik sampling CAIS.",
      "pemeriksaan_awal": "PAUT mengonfirmasi indikasi retak bertingkat (stepwise) pada area sekitar 300 × 200 mm. Analisis sour water menunjukkan kandungan H₂S terlarut yang tinggi.",
      "praduga_penyebab": "Atom hidrogen dari korosi H₂S basah diduga masuk ke dinding baja, lalu membentuk blister dan retak HIC/SOHIC.",
      "usulan_tindakan": "Engineer melakukan penilaian fitness-for-service (API 579 Part 7) dengan data PAUT. Tim memasang pemantauan acoustic emission (AE) dan menjadwalkan analisis sour water berkala.",
      "verifikasi": "Kriteria verifikasi: hasil FFS menyatakan drum layak operasi pada batas tekanan yang ditetapkan, dan aktivitas AE tetap rendah selama pemantauan.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Retak HIC/SOHIC yang tumbuh dapat menembus dinding drum dan melepaskan gas H₂S beracun ke area kerja.",
      "capa_corrective": "Turunkan tekanan operasi sesuai hasil FFS dan siapkan perbaikan atau penggantian shell dengan pelat baja tahan HIC.",
      "capa_preventive": "Kendalikan pH dan kadar H₂S sour water, lalu jadwalkan PAUT ulang setiap enam bulan.",
      "capa_target_date": "2027-01-31",
      "capa_pic": "Tim Inspeksi Statik & HSE",
      "description": "Lapor dari stabilizer overhead drum 11-V-104, hasil AUT terjadwal menunjukkan banyak indikasi sejajar permukaan di tengah tebal dinding dekat water boot.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "AUT_Cscan_11V104_Boot.png (peta C-scan indikasi HIC dekat water boot); PAUT_Sizing_11V104.pdf (ukuran dan kedalaman indikasi stepwise. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/journal/g34.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(53),
    updated_at: hoursAgo(47)
  },  {
      "id": "CDU11-V08",
      "title": "Retak Dekat Las pada Vessel Kaustik 11-V-106 & Dugaan Caustic Cracking",
      "asset_id": "11-V-106",
      "status": "INVESTIGATION",
      "identitas_alat": "Vessel 11-V-106 (nama tidak disebut di sumber; titik injeksi kaustik untuk mengikat H₂S), Seksi Bahan Kimia, Unit 11 CDU.",
      "gejala": "Teknisi melihat kristal putih merembes di dekat sambungan las nozzle bawah vessel. Jalur steam tracing di dekat nozzle terasa sangat panas.",
      "kondisi_operasi": "Vessel tercantum sebagai titik injeksi kaustik untuk mengikat H₂S. Nama, fungsi utama, dan kondisi operasi vessel tidak dirinci di sumber terbuka.",
      "pemeriksaan_awal": "Pemeriksaan WFMT (wet fluorescent magnetic particle) menemukan beberapa retak halus bercabang di daerah terpengaruh panas las. Suhu dinding di dekat steam tracing terukur di atas 80 °C.",
      "praduga_penyebab": "Kaustik pada dinding baja karbon yang terlalu panas di dekat las tanpa PWHT diduga memicu caustic stress corrosion cracking (caustic embrittlement).",
      "usulan_tindakan": "Tim mengisolasi vessel, menghentikan steam tracing di area tersebut, dan menyiapkan penilaian kedalaman retak dengan PAUT. Engineer material mengevaluasi perbaikan las dengan PWHT.",
      "verifikasi": "Kriteria verifikasi: WFMT ulang setelah perbaikan dan PWHT tidak menemukan retak, dan suhu dinding tetap di bawah 80 °C.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Retak yang tumbuh dapat membuat vessel bocor dan menyemburkan kaustik yang merusak kulit dan mata. Kebocoran juga mengganggu pengikatan H₂S di sistem terkait.",
      "capa_corrective": "Perbaiki retak dengan gerinda dan las ulang, lalu lakukan PWHT sesuai prosedur.",
      "capa_preventive": "Batasi suhu dinding vessel kaustik di bawah 80 °C dengan mengatur steam tracing, dan masukkan las vessel ke inspeksi WFMT berkala.",
      "capa_target_date": "2027-02-28",
      "capa_pic": "Tim Inspeksi Statik, Material & HSE",
      "description": "Lapor dari area bahan kimia, ada rembesan kristal putih di dekat sambungan las nozzle bawah vessel 11-V-106, dan jalur steam tracing di dekatnya terasa sangat panas.",
      "reporter_name": "Dr. Rina Suryani",
      "reporter_role": "hse_validator",
      "dept": "HSE & Process Safety",
      "evidence_note": "Foto_Kristal_Putih_Las_11V106.jpg (kristal kaustik di dekat las nozzle bawah); WFMT_Retak_HAZ_11V106.pdf (hasil WFMT dengan retak halus bercabang di HAZ. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/foto_kristal_putih_las_11v106.webp",
      "verified_by": null,
      "finding_type": "Near Miss",
      "urgency": "Mendesak",
      "sla_reminder_count": 1
  ,
    created_at: hoursAgo(60),
    updated_at: hoursAgo(54)
  },  {
      "id": "CDU11-C02",
      "title": "Kenaikan ΔP Tray Atas & Overlap Naphtha-Kerosene Main Fractionator 11-C-101",
      "asset_id": "11-C-101",
      "status": "TRIAGE",
      "identitas_alat": "Main Fractionator 11-C-101 (34 tray, umpan di tray 31), khususnya seksi tray atas dan zona top pump-around (tray 5).",
      "gejala": "Beda tekanan seksi atas naik perlahan selama dua minggu. Laju draw kerosene sulit stabil, dan laboratorium melaporkan overlap distilasi naphtha-kerosene.",
      "kondisi_operasi": "Top pump-around ditarik dari tray 5 melalui 11-P-104 dan 11-E-104, lalu kembali ke tray teratas. Amonia dan corrosion inhibitor diinjeksikan di overhead kolom.",
      "pemeriksaan_awal": "Tren DCS menunjukkan ΔP seksi atas naik sekitar 30% dari baseline. Hasil klorida sour water 11-V-102 juga naik pada periode yang sama.",
      "praduga_penyebab": "Garam amonium klorida dan garam amina klorida diduga mengendap di tray atas. Endapan tersebut menyumbat lubang valve tray dan memicu korosi di bawah endapan.",
      "usulan_tindakan": "Engineer proses menghitung suhu deposisi garam dengan data overhead terbaru. Tim memeriksa kinerja desalter dan menyiapkan rencana water wash terkendali.",
      "verifikasi": "Kriteria verifikasi: ΔP seksi atas kembali ke baseline dan spesifikasi distilasi naphtha-kerosene kembali normal.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Likely",
      "risk_summary": "Endapan garam dan korosi dapat melubangi tray atas sehingga pemisahan memburuk dan CDU harus berhenti untuk perbaikan internal kolom.",
      "capa_corrective": "Lakukan water wash terkendali sesuai kajian proses dan naikkan suhu top pump-around di atas suhu deposisi garam.",
      "capa_preventive": "Batasi kadar garam desalted crude dan pantau klorida overhead setiap hari sebagai batas operasi integritas (IOW).",
      "capa_target_date": "2027-01-10",
      "capa_pic": "Tim Proses & Inspeksi Korosi",
      "description": "Lapor dari main fractionator 11-C-101, beda tekanan seksi tray atas naik pelan dua minggu ini, draw kerosene susah stabil, dan lab melaporkan overlap distilasi naphtha dengan kerosene.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_DP_TopTray_11C101.png (grafik ΔP seksi atas naik 30% dalam 14 hari)",
      "image_url": "/assets/cdu11/evidences/cdu11-c02_trend_dp_toptray_11c101.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 1
  ,
    created_at: hoursAgo(64),
    updated_at: hoursAgo(58)
  },  {
      "id": "CDU11-E05",
      "title": "Endapan Garam Amonium Klorida di Sisi Top Pump-Around Cold Preheater 11-E-104",
      "asset_id": "11-E-104",
      "status": "INVESTIGATION",
      "identitas_alat": "Cold preheater 11-E-104 (HE 5; pemanas crude dengan top pump-around 11-C-101), Cold Preheat Train, Unit 11 CDU.",
      "gejala": "Duty 11-E-104 turun dan ΔP sisi top pump-around naik. Gejala ini muncul bersamaan dengan kenaikan ΔP tray atas 11-C-101 (kasus CDU11-C02).",
      "kondisi_operasi": "Top pump-around ditarik dari tray 5 kolom 11-C-101 oleh 11-P-104, melewati 11-E-104, lalu kembali ke tray teratas. Amonia dan corrosion inhibitor diinjeksikan di overhead kolom.",
      "pemeriksaan_awal": "Sampel endapan dari strainer 11-P-104 berwarna putih keabu-abuan dan larut dalam air. Uji klorida pada larutan endapan memberi hasil positif tinggi.",
      "praduga_penyebab": "Garam amonium klorida (NH₄Cl) dari seksi atas kolom diduga terbawa ke sirkuit top pump-around, mengendap di 11-E-104, lalu memicu korosi di bawah endapan.",
      "usulan_tindakan": "Tim proses menghitung suhu deposisi garam di sirkuit top pump-around. Inspektor menyiapkan UT di nozzle dan channel 11-E-104, dan tim mempertimbangkan water wash terkendali.",
      "verifikasi": "Kriteria verifikasi: duty 11-E-104 kembali ke baseline, ΔP sisi top pump-around turun, dan uji klorida endapan strainer negatif.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Endapan NH₄Cl menurunkan perolehan panas dan dapat menimbulkan korosi di bawah endapan hingga tube bocor. Kebocoran di sirkuit pump-around dapat mengganggu operasi kolom utama.",
      "capa_corrective": "Lakukan water wash terkendali pada sirkuit top pump-around setelah kajian suhu deposisi, lalu bersihkan bundle saat bypass memungkinkan.",
      "capa_preventive": "Jaga suhu top pump-around di atas suhu deposisi garam dan batasi kadar garam desalted crude sebagai IOW.",
      "capa_target_date": "2027-02-15",
      "capa_pic": "Tim Proses & Inspeksi Korosi",
      "description": "Lapor dari cold preheat train, duty 11-E-104 turun dan beda tekanan sisi top pump-around naik, bersamaan dengan kasus ΔP tray atas di main fractionator.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Foto_Endapan_Strainer_11P104.jpg (endapan putih keabu-abuan dari strainer top pump-around); Lab_Klorida_Endapan_TPA.pdf (hasil uji klorida larutan endapan. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/foto_endapan_strainer_11p104.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 1
  ,
    created_at: hoursAgo(69),
    updated_at: hoursAgo(63)
  },  {
      "id": "CDU11-P02",
      "title": "Vibrasi Horizontal Tinggi di Bearing NDE Pompa Desalted Crude 11-P-102 A",
      "asset_id": "11-P-102 A/B",
      "status": "INVESTIGATION",
      "identitas_alat": "Desalted Crude Pump 11-P-102 A/B, Seksi Desalting, Unit 11 CDU.",
      "gejala": "Getaran di bearing sisi non-drive end (NDE) pompa A makin keras selama tiga hari. Housing bearing pompa A lebih panas daripada pompa B.",
      "kondisi_operasi": "Pompa memompa desalted crude keluar desalter 11-V-101 A/B. Suction pompa ini menjadi titik sampling desalted crude.",
      "pemeriksaan_awal": "Pengukuran sesuai ISO 10816-3 menunjukkan vibrasi horizontal di NDE naik dari 9 ke 13 mm/s RMS dalam tiga hari, sedangkan titik lain masih rendah. Spektrum FFT menunjukkan puncak dominan pada 1× putaran.",
      "praduga_penyebab": "Impeller pompa A diduga tidak seimbang akibat endapan atau aus, dengan kemungkinan kontribusi ketidaksejajaran poros.",
      "usulan_tindakan": "Tim memindahkan beban ke pompa B, memeriksa kelurusan poros dengan laser, dan membongkar pompa A untuk memeriksa impeller serta bearing.",
      "verifikasi": "Kriteria verifikasi: vibrasi semua titik kembali ke zona aman ISO 10816-3, dan suhu housing bearing setara dengan pompa B setelah perbaikan.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Kerusakan bearing yang berlanjut dapat merusak seal dan memicu kebocoran crude panas. Pompa B masih dapat menanggung beban, sehingga dampak ke produksi terbatas.",
      "capa_corrective": "Ganti bearing yang rusak, seimbangkan atau ganti impeller, dan setel ulang kelurusan poros pompa A.",
      "capa_preventive": "Masukkan 11-P-102 A/B ke rute vibrasi dua mingguan dengan batas alarm per titik dan tren suhu bearing.",
      "capa_target_date": "2027-01-15",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari pompa desalted crude 11-P-102 A, getaran di bearing sisi non-drive terasa makin keras tiga hari ini dan housing bearing lebih panas dari pompa B.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Vibrasi_ISO10816_11P102A.pdf (tren RMS horizontal NDE naik dari 9 ke 13 mm/s); FFT_NDE_11P102A.png (spektrum dengan puncak dominan pada 1× putaran. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-p02_vibrasi_iso10816_11p102a.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 1
  ,
    created_at: hoursAgo(77),
    updated_at: hoursAgo(71)
  },  {
      "id": "CDU11-E09",
      "title": "Fouling Cepat Setelah Pergantian Campuran Crude di Hot Preheater 11-E-106 A/B",
      "asset_id": "11-E-106 A/B",
      "status": "INVESTIGATION",
      "identitas_alat": "Hot preheater 11-E-106 A/B (HE 7; pemanas desalted crude dengan middle pump-around), Hot Preheat Train, Unit 11 CDU.",
      "gejala": "ΔP sisi crude 11-E-106 A/B naik jauh lebih cepat daripada biasanya sejak campuran crude baru masuk sepekan lalu. Suhu crude keluar juga turun.",
      "kondisi_operasi": "Rangkaian 11-E-106 s.d. 11-E-111 memanaskan desalted crude hingga 276,7 °C. Middle pump-around ditarik dari tray 15 melalui 11-P-105, 11-E-122, dan 11-E-106, lalu kembali ke tray 12.",
      "pemeriksaan_awal": "Laju kenaikan Rd unit A tiga kali lebih cepat daripada periode sebelum pergantian crude. Laboratorium mendapati campuran crude baru mendekati batas kestabilan aspalten pada uji kompatibilitas.",
      "praduga_penyebab": "Campuran crude parafinik dan crude kaya aspalten diduga tidak kompatibel, sehingga aspalten mengendap di dinding tube yang panas.",
      "usulan_tindakan": "Tim proses mengubah rasio campuran crude, menambah dosis anti-foulant sementara, dan memantau Rd harian. Tim menyiapkan pembersihan unit A bila Rd terus naik.",
      "verifikasi": "Kriteria verifikasi: laju kenaikan Rd kembali seperti sebelum pergantian crude dan suhu crude keluar hot preheat train mendekati 276,7 °C.",
      "risk_level": "HIGH",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Likely",
      "risk_summary": "Fouling cepat menambah konsumsi bahan bakar furnace dan dapat memaksa penurunan laju umpan bila suhu masuk furnace terlalu rendah.",
      "capa_corrective": "Ubah rasio campuran crude dan tambah dosis anti-foulant sementara, lalu bersihkan unit A bila Rd melampaui batas.",
      "capa_preventive": "Uji kompatibilitas campuran crude sebelum blending dan pantau Rd harian selama sepekan pertama setiap pergantian crude.",
      "capa_target_date": "2027-01-31",
      "capa_pic": "Tim Proses, Laboratorium & Perencanaan Crude",
      "description": "Lapor dari hot preheat train, sejak campuran crude baru masuk minggu lalu, beda tekanan sisi crude 11-E-106 naik jauh lebih cepat dari biasanya.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_Rd_11E106A_vs_Blend.png (kenaikan Rd unit A sebelum dan sesudah pergantian crude); Lab_Kompatibilitas_Blend_Crude.pdf (hasil uji kestabilan aspalten campuran crude baru. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e09_trend_rd_11e106a_vs_blend.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 1
  ,
    created_at: hoursAgo(85),
    updated_at: hoursAgo(79)
  },  {
      "id": "CDU11-I01",
      "title": "Bunyi Keras & Dugaan Flashing-Kavitasi di Level Control Valve Stabilizer 11-LV-030",
      "asset_id": "11-LV-030",
      "status": "TRIAGE",
      "identitas_alat": "Level control valve 11-LV-030 (titik sampling naphtha column 11-C-104), Seksi Stabilisasi Naphtha, Unit 11 CDU.",
      "gejala": "Valve berbunyi keras seperti pasir mengalir, dan pipa hilir bergetar, terutama saat bukaan valve kecil. Level stabilizer juga sedikit berosilasi.",
      "kondisi_operasi": "Valve mengendalikan level pada kolom 11-C-104 dan menjadi lokasi titik sampling naphtha column 11-C-104. Cairan bottom kolom distilasi umumnya berada dekat titik didihnya, sehingga penurunan tekanan di valve dapat menguapkan sebagian cairan.",
      "pemeriksaan_awal": "Data DCS menunjukkan valve sering bekerja pada bukaan 10-20%. Perhitungan awal menunjukkan tekanan hilir dapat turun di bawah tekanan uap cairan pada laju rendah.",
      "praduga_penyebab": "Flashing atau kavitasi diduga terjadi di trim valve karena penurunan tekanan besar pada bukaan kecil, sehingga trim dan pipa hilir berisiko tererosi.",
      "usulan_tindakan": "Tim instrumentasi memeriksa ukuran valve terhadap kondisi operasi saat ini, mengukur vibrasi pipa hilir, dan menjadwalkan inspeksi trim saat bypass tersedia.",
      "verifikasi": "Kriteria verifikasi: bunyi dan getaran pipa hilir turun ke batas aman, dan inspeksi trim tidak menemukan erosi baru setelah ukuran atau trim valve disesuaikan.",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Possible",
      "risk_summary": "Erosi trim dan pipa hilir dapat berujung kebocoran hidrokarbon ringan di area stabilizer. Getaran pipa juga dapat merusak penyangga dan sambungan kecil.",
      "capa_corrective": "Sesuaikan ukuran valve atau pasang trim tahan kavitasi atau flashing, lalu perkuat penyangga pipa hilir.",
      "capa_preventive": "Tinjau ulang ukuran control valve setiap kali kondisi operasi berubah, dan jaga agar valve tidak lama bekerja pada bukaan di bawah 20%.",
      "capa_target_date": "2027-02-15",
      "capa_pic": "Tim Instrumentasi & Proses",
      "description": "Lapor dari seksi stabilizer, control valve 11-LV-030 berbunyi keras seperti pasir mengalir dan pipa hilirnya bergetar, terutama saat bukaan valve kecil.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Instrumentasi & Kontrol",
      "evidence_note": "Trend_Bukaan_11LV030.png (valve sering bekerja pada bukaan 10-20%)",
      "image_url": "/assets/cdu11/evidences/cdu11-i01_trend_bukaan_11lv030.webp",
      "verified_by": null,
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 1
  ,
    created_at: hoursAgo(92),
    updated_at: hoursAgo(86)
  },  {
      "id": "CDU11-P12",
      "title": "Head Pompa Splitter 11-P-111 C Pulih Setelah Penggantian Impeller dan Wear Ring",
      "asset_id": "11-P-111 C/D",
      "status": "VERIFIED",
      "identitas_alat": "Pompa 11-P-111 C/D (nama tidak disebut di sumber), Seksi Splitter, Unit 11 CDU.",
      "gejala": "Operator harus membuka control valve lebih lebar untuk mencapai laju alir yang sama. Arus motor naik, tetapi laju alir tidak bertambah.",
      "kondisi_operasi": "Pompa tercantum setelah drum 11-V-105 pada daftar S1, sedangkan fungsinya tidak dirinci di sumber terbuka.",
      "pemeriksaan_awal": "Uji unjuk kerja lapangan menunjukkan head turun sekitar 8% dari kurva pabrik. Pembongkaran menemukan celah wear ring melebar dan sisi masuk sudu impeller aus.",
      "praduga_penyebab": "Celah wear ring yang melebar terbukti membuat sebagian cairan bersirkulasi kembali di dalam pompa, sehingga head dan efisiensi turun.",
      "usulan_tindakan": "Tim mengganti impeller dan wear ring sesuai celah pabrik, lalu melakukan uji unjuk kerja setelah perakitan.",
      "verifikasi": "Setelah perbaikan, head kembali sesuai kurva pabrik dalam batas ±2%, arus motor turun, dan vibrasi berada di zona aman.",
      "risk_level": "LOW",
      "risk_consequence": "Minor",
      "risk_likelihood": "Possible",
      "risk_summary": "Penurunan head menambah konsumsi listrik dan membatasi laju alir. Pompa D tersedia sebagai cadangan.",
      "capa_corrective": "Ganti impeller dan wear ring sesuai celah pabrik.",
      "capa_preventive": "Lakukan uji unjuk kerja pompa setiap tahun dan catat celah wear ring pada setiap pembongkaran.",
      "capa_target_date": "2026-10-05",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari splitter, control valve pompa 11-P-111 C harus dibuka lebih lebar untuk laju yang sama, dan arus motornya naik tapi alirannya tidak bertambah.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Kurva_Head_Sebelum_11P111C.png (head turun sekitar 8% dari kurva pabrik); Uji_Unjuk_Kerja_Pasca_11P111C.pdf (head kembali sesuai kurva pabrik setelah penggantian. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-p12_kurva_head_sebelum_11p111c.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(168),
    updated_at: hoursAgo(144)
  },  {
      "id": "CDU11-E22",
      "title": "Suhu Naphtha ke Tangki Normal Kembali Setelah Pembersihan Fin Fan Cooler 11-E-124",
      "asset_id": "11-E-124",
      "status": "VERIFIED",
      "identitas_alat": "Naphtha Fin Fan Cooler 11-E-124 (HE 18), Seksi Pendinginan Produk, Unit 11 CDU.",
      "gejala": "Suhu naphtha keluar 11-E-124 naik pada siang hari hingga mendekati batas suhu ke tangki. Sirip bagian bawah bundle tertutup debu tebal.",
      "kondisi_operasi": "Fin fan cooler mendinginkan produk naphtha dengan aliran udara dari kipas. Naphtha juga melewati 11-E-126 (naphtha condenser/cooler) di jalur pendinginan produk.",
      "pemeriksaan_awal": "Inspeksi visual menemukan debu dan serangga menutup celah sirip, terutama di baris tube pertama dari arah datang udara. Kenaikan suhu udara melintasi bundle lebih kecil daripada saat kondisi bersih.",
      "praduga_penyebab": "Endapan debu di sisi udara terbukti menghambat aliran udara dan perpindahan panas, sehingga naphtha keluar lebih panas.",
      "usulan_tindakan": "Tim membersihkan sirip dengan udara tekan dan air bertekanan rendah dari sisi udara keluar, meluruskan sirip yang bengkok, dan memeriksa ketegangan sabuk kipas.",
      "verifikasi": "Setelah pembersihan, suhu naphtha keluar turun sekitar 6 °C pada siang hari dan tetap di bawah batas suhu ke tangki selama 30 hari.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Minor",
      "risk_likelihood": "Likely",
      "risk_summary": "Naphtha yang terlalu panas menambah penguapan di tangki dan kehilangan produk. Gangguan ini tidak langsung mengancam keselamatan.",
      "capa_corrective": "Bersihkan sirip, luruskan sirip yang bengkok, dan setel ulang sabuk kipas.",
      "capa_preventive": "Jadwalkan pembersihan sirip sebelum musim kemarau dan pantau selisih suhu udara masuk-keluar setiap bulan.",
      "capa_target_date": "2026-09-15",
      "capa_pic": "Tim Mekanik & Operasi",
      "description": "Lapor dari pendinginan produk, suhu naphtha keluar fin fan 11-E-124 terus naik di siang hari, dan sirip bagian bawah terlihat tertutup debu tebal.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Foto_Sirip_Berdebu_11E124.jpg (sirip bagian bawah tertutup debu tebal sebelum dibersihkan); Trend_Suhu_Naphtha_PascaCleaning_11E124.pdf (suhu naphtha keluar 30 hari setelah pembersihan. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e22_foto_sirip_berdebu_11e124.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(175),
    updated_at: hoursAgo(151)
  },  {
      "id": "CDU11-E24",
      "title": "Suhu Kerosene ke Clay Treater Turun Kembali Setelah Pembersihan Kerak 11-E-118",
      "asset_id": "11-E-118",
      "status": "VERIFIED",
      "identitas_alat": "Kerosene Cooler 11-E-118 (HE 11), Seksi Pendinginan Produk, Unit 11 CDU.",
      "gejala": "Suhu kerosene keluar 11-E-118 naik bertahap selama tiga minggu. Warna Saybolt kerosene setelah clay treater mulai turun.",
      "kondisi_operasi": "Alat mendinginkan kerosene sebelum ke tangki, dan kerosene didinginkan sebelum masuk clay treater 11-V-113 A/B. Media pendingin tidak disebut di sumber terbuka, sehingga kasus ini memakai skenario air pendingin.",
      "pemeriksaan_awal": "Pembukaan channel menemukan kerak putih keras di dinding tube sisi air. Analisis kerak menunjukkan dominasi kalsium karbonat.",
      "praduga_penyebab": "Kerak kalsium karbonat di sisi air pendingin terbukti menurunkan perpindahan panas, sehingga kerosene keluar lebih panas.",
      "usulan_tindakan": "Tim membersihkan kerak secara kimia dan mekanis, lalu tim utilitas menyesuaikan dosis inhibitor kerak dan siklus konsentrasi air pendingin.",
      "verifikasi": "Setelah pembersihan, suhu kerosene keluar turun sekitar 8 °C, dan warna Saybolt kerosene setelah clay treater kembali sesuai spesifikasi selama 30 hari.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Minor",
      "risk_likelihood": "Likely",
      "risk_summary": "Kerosene yang terlalu panas menurunkan kinerja clay treater dan mempercepat jenuhnya clay. Gangguan ini berdampak pada mutu produk, bukan keselamatan.",
      "capa_corrective": "Bersihkan kerak sisi air 11-E-118 dan sesuaikan dosis inhibitor kerak.",
      "capa_preventive": "Pantau suhu kerosene ke clay treater setiap shift serta kendalikan kesadahan dan siklus konsentrasi air pendingin.",
      "capa_target_date": "2026-10-20",
      "capa_pic": "Tim Proses & Utilitas",
      "description": "Lapor dari pendinginan produk, suhu kerosene keluar 11-E-118 naik terus, padahal clay treater butuh kerosene yang sudah dingin.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Foto_Kerak_Tube_11E118.jpg (kerak putih keras di dinding tube sisi air); Trend_Suhu_Kerosene_PascaCleaning_11E118.pdf (suhu kerosene dan warna Saybolt 30 hari setelah pembersihan. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e24_foto_kerak_tube_11e118.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(213),
    updated_at: hoursAgo(189)
  },  {
      "id": "CDU11-C04",
      "title": "Penipisan Tray & Shell Akibat Korosi Asam Naftenat di HGO Stripper 11-C-103",
      "asset_id": "11-C-103",
      "status": "VERIFIED",
      "identitas_alat": "HGO Stripper 11-C-103 (kolom stripper samping), Seksi Side Stripper, Unit 11 CDU.",
      "gejala": "Inspektor menemukan tray bagian bawah menipis dan berlubang saat turnaround. Hasil UT shell di sekitar nozzle inlet HGO juga lebih tipis daripada data inspeksi sebelumnya.",
      "kondisi_operasi": "Stripper melucuti fraksi ringan dari HGO dengan aliran keluar sekitar 45.720 kg/jam. Data CAIS mencatat TAN HGO 1,10-1,65 mg KOH/g pada tiga campuran crude Desember 2020.",
      "pemeriksaan_awal": "Inspeksi visual menemukan permukaan logam yang halus dan beralur tanpa produk korosi tebal. Pemetaan UT grid menunjukkan penipisan paling dalam di zona aliran turbulen dekat nozzle.",
      "praduga_penyebab": "Korosi asam naftenat (NAC) terbukti menipiskan tray dan shell karena HGO ber-TAN tinggi mengalir pada suhu tinggi dan turbulen.",
      "usulan_tindakan": "Tim mengganti tray bawah dengan material paduan tahan NAC, memperbaiki area shell yang tipis, dan memasang probe UT permanen di dekat nozzle inlet HGO.",
      "verifikasi": "Selama 90 hari setelah unit beroperasi kembali, probe UT mencatat laju korosi di bawah 0,13 mm/tahun (kategori Low), dan flash point HGO tetap sesuai spesifikasi.",
      "risk_level": "HIGH",
      "risk_consequence": "Catastrophic",
      "risk_likelihood": "Possible",
      "risk_summary": "Penipisan shell di zona panas dapat berujung kebocoran HGO panas yang mudah terbakar. Tray yang berlubang juga menurunkan kualitas pemisahan sebelum kebocoran terjadi.",
      "capa_corrective": "Ganti tray bawah dengan material tahan NAC, perbaiki shell yang menipis, dan lakukan UT pasca-perbaikan.",
      "capa_preventive": "Batasi TAN campuran crude, siapkan injeksi inhibitor suhu tinggi saat crude asam diolah, dan pantau ketebalan dengan probe UT permanen.",
      "capa_target_date": "2026-10-30",
      "capa_pic": "Tim Inspeksi Korosi & Proses",
      "description": "Lapor dari HGO stripper 11-C-103, saat inspeksi turnaround tray bawah terlihat menipis dan berlubang, dan UT shell di sekitar nozzle inlet HGO lebih tipis dari data sebelumnya.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "UT_Grid_Shell_Nozzle_11C103.pdf (peta ketebalan dengan penipisan setempat dekat nozzle inlet HGO); Trend_ProbeUT_90hari_11C103.pdf (laju korosi pasca-perbaikan di bawah 0,13 mm/tahun. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-c04_ut_grid_shell_nozzle_11c103.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(220),
    updated_at: hoursAgo(196)
  },  {
      "id": "CDU11-E02",
      "title": "Pitting di Bawah Endapan pada Tube Cold Preheater 11-E-101 Ditangani dengan Plugging",
      "asset_id": "11-E-101",
      "status": "VERIFIED",
      "identitas_alat": "Cold preheater 11-E-101 (HE 2), Cold Preheat Train, Unit 11 CDU.",
      "gejala": "Teknisi melihat tetesan air di tubesheet saat uji hidrostatik pada turnaround. Dinding dalam tube tertutup endapan cokelat kehitaman.",
      "kondisi_operasi": "Rangkaian 11-E-101 s.d. 11-E-105 memanaskan crude hingga 155,1 °C sebelum crude masuk desalter. Crude di rangkaian ini masih membawa air dan garam karena belum melewati desalter.",
      "pemeriksaan_awal": "Inspeksi IRIS menemukan pitting di bawah endapan pada sebagian tube, dengan dua tube berlubang tembus. Analisis endapan menunjukkan campuran oksida besi, garam, dan pasir halus.",
      "praduga_penyebab": "Endapan garam dan sedimen dari crude yang belum didesalting terbukti menahan air di permukaan tube, sehingga pitting berkembang di bawah endapan (under-deposit corrosion).",
      "usulan_tindakan": "Tim memplug tube yang bocor dan tube yang ketebalannya di bawah batas, membersihkan bundle dengan hydrojetting, lalu mengulang uji hidrostatik.",
      "verifikasi": "Uji hidrostatik ulang lulus tanpa kebocoran. Selama 60 hari operasi, ΔP dan duty 11-E-101 tetap dalam rentang desain.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Kebocoran tube mencampur dua aliran proses sehingga mutu aliran bertekanan lebih rendah terganggu. Tube yang diplug juga mengurangi luas perpindahan panas.",
      "capa_corrective": "Plug tube yang bocor dan yang menipis, bersihkan bundle, lalu lakukan uji hidrostatik ulang.",
      "capa_preventive": "Jadwalkan IRIS berkala, tetapkan jumlah tube yang diplug sebagai batas penggantian bundle, dan jaga kinerja desalter serta dosis anti-foulant.",
      "capa_target_date": "2026-10-15",
      "capa_pic": "Tim Inspeksi Statik & Proses",
      "description": "Lapor dari cold preheat train, saat uji hidrostatik turnaround ada tetesan air dari tubesheet 11-E-101, mohon dicek tube yang bocor.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "IRIS_Map_Tube_11E101.pdf (peta ketebalan tube dengan pitting di bawah endapan dan dua tube tembus); Hydrotest_Ulang_11E101.pdf (laporan uji hidrostatik ulang tanpa kebocoran setelah plugging. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e02_iris_map_tube_11e101.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(315),
    updated_at: hoursAgo(291)
  },  {
      "id": "CDU11-V03",
      "title": "Kadar Fe Sour Water Naik & Penipisan Boot Overhead Accumulator 11-V-102",
      "asset_id": "11-V-102",
      "status": "VERIFIED",
      "identitas_alat": "Overhead accumulator 11-V-102 (pemisah minyak, gas, dan air kondensat overhead 11-C-101), Sistem Overhead, Unit 11 CDU.",
      "gejala": "Laboratorium melaporkan kadar besi (Fe) sour water naik dan pH turun selama dua minggu berturut-turut.",
      "kondisi_operasi": "Air dari 11-V-102 dikirim ke Sour Water Stripper Unit 24, dan gasnya dialirkan ke 11-V-103. Amonia dan corrosion inhibitor diinjeksikan di overhead 11-C-101.",
      "pemeriksaan_awal": "UT spot di boot air menemukan penipisan setempat. Probe ER menunjukkan laju korosi naik ke kategori Moderate menurut ambang CAIS (0,05-0,51 mm/tahun).",
      "praduga_penyebab": "HCl dari hidrolisis garam klorida yang lolos dari desalter terbukti menurunkan pH air kondensat, sementara dosis neutralizer belum mengikuti kenaikan klorida.",
      "usulan_tindakan": "Tim menyetel ulang dosis amonia dan corrosion inhibitor, memperbaiki kinerja desalter, dan menambah pemantauan pH serta Fe harian.",
      "verifikasi": "Selama 90 hari, pH sour water stabil di rentang IOW, kadar Fe turun, dan probe ER mencatat laju korosi < 0,05 mm/tahun (kategori Low CAIS).",
      "risk_level": "HIGH",
      "risk_consequence": "Major",
      "risk_likelihood": "Likely",
      "risk_summary": "Korosi HCl di sistem overhead dapat menipiskan boot dan pipa hingga bocor, lalu memaksa CDU berhenti tak terencana.",
      "capa_corrective": "Optimasi injeksi neutralizer dan corrosion inhibitor serta perbaikan kinerja desalter 11-V-101 A/B.",
      "capa_preventive": "Tetapkan IOW harian untuk pH, klorida, dan Fe sour water 11-V-102, lalu pantau laju korosi dengan probe ER dan UT.",
      "capa_target_date": "2026-11-05",
      "capa_pic": "Tim Proses, Laboratorium & Inspeksi Korosi",
      "description": "Lapor dari overhead accumulator 11-V-102, hasil lab sour water dua minggu ini menunjukkan kadar besi naik dan pH turun, lalu UT di boot menunjukkan penipisan.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Inspeksi Statik & Korosi",
      "evidence_note": "UT_Boot_11V102.pdf (hasil UT penipisan setempat di boot air); Trend_pH_Fe_ER_90hari_11V102.pdf (tren pH, Fe, dan laju korosi ER selama 90 hari. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-v03_ut_boot_11v102.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Potensi Bahaya",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(327),
    updated_at: hoursAgo(303)
  },  {
      "id": "CDU11-I05",
      "title": "Valve Residu 11-FV-033 Kembali Responsif Setelah Pembersihan Endapan Kokas",
      "asset_id": "11-FV-033",
      "status": "VERIFIED",
      "identitas_alat": "Flow control valve 11-FV-033 (titik sampling residue), Seksi Fraksinasi Utama, Unit 11 CDU.",
      "gejala": "Valve sering tertahan lalu melompat, sehingga laju atmospheric residue ke unit hilir naik-turun.",
      "kondisi_operasi": "Valve mengatur aliran atmospheric residue dari kolom 11-C-101 dan menjadi lokasi titik sampling residue. Atmospheric residue dikirim ke AHU/ARHDM dan sebagian ke RCC.",
      "pemeriksaan_awal": "Plot OP-PV dari data DCS membentuk pola stiction yang jelas. Pembongkaran valve menemukan endapan kokas dan residu keras di stem serta guide.",
      "praduga_penyebab": "Endapan kokas dan residu di stem dan guide terbukti menaikkan gesekan statis, sehingga valve tertahan lalu melompat.",
      "usulan_tindakan": "Tim membersihkan stem dan guide, mengganti packing, lalu menambahkan steam flushing berkala pada body valve saat laju operasi rendah.",
      "verifikasi": "Setelah perbaikan, plot OP-PV tidak lagi menunjukkan pola stiction, dan laju residu stabil selama 30 hari.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Laju residu yang tidak stabil mengganggu level bottom kolom dan unit hilir. Gangguan ini tidak langsung mengancam keselamatan.",
      "capa_corrective": "Bersihkan stem dan guide dari endapan, ganti packing, dan kalibrasi positioner.",
      "capa_preventive": "Jadwalkan steam flushing body valve dan pantau pola OP-PV setiap bulan.",
      "capa_target_date": "2026-10-25",
      "capa_pic": "Tim Instrumentasi & Proses",
      "description": "Lapor dari aliran residu, control valve 11-FV-033 sering tertahan lalu melompat, dan laju residu ke unit hilir naik-turun.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Instrumentasi & Kontrol",
      "evidence_note": "Plot_OP_PV_Sebelum_11FV033.png (pola stiction sebelum perbaikan); Plot_OP_PV_Sesudah_11FV033.png (respons normal 30 hari setelah perbaikan. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/journal/g53.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(358),
    updated_at: hoursAgo(334)
  },  {
      "id": "CDU11-V07",
      "title": "Warna Kerosene Pulih Setelah Penggantian Clay Jenuh di Clay Treater 11-V-113 A/B",
      "asset_id": "11-V-113 A/B",
      "status": "VERIFIED",
      "identitas_alat": "Kerosene Clay Treater 11-V-113 A/B, Seksi Treating Kerosene, Unit 11 CDU.",
      "gejala": "Beda tekanan clay treater unit A naik, dan warna Saybolt kerosene produk turun mendekati batas spesifikasi.",
      "kondisi_operasi": "Clay treater menstabilkan warna kerosene dan menghilangkan pengotor. Kerosene didinginkan terlebih dahulu sebelum masuk clay treater.",
      "pemeriksaan_awal": "Data operasi menunjukkan clay unit A sudah melewati umur pakai yang biasa. Sampel clay dari bagian atas bed berwarna gelap dan menggumpal.",
      "praduga_penyebab": "Clay di unit A terbukti jenuh oleh pengotor dan air, sehingga daya serap warnanya turun dan bed yang menggumpal menaikkan ΔP.",
      "usulan_tindakan": "Tim memindahkan aliran ke unit B, mengganti clay unit A, dan memeriksa kerja pendingin kerosene sebelum clay treater.",
      "verifikasi": "Setelah clay diganti, ΔP unit A kembali ke nilai awal, dan warna Saybolt kerosene produk kembali di atas batas spesifikasi selama 30 hari.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Minor",
      "risk_likelihood": "Likely",
      "risk_summary": "Kerosene yang warnanya di bawah spesifikasi tidak dapat dikirim sebagai produk. Dampaknya terbatas pada mutu produk dan biaya penggantian clay.",
      "capa_corrective": "Ganti clay unit A dan alihkan aliran ke unit B selama penggantian.",
      "capa_preventive": "Pantau ΔP serta warna Saybolt sebelum dan sesudah clay treater setiap shift, lalu jaga suhu dan kadar air kerosene masuk.",
      "capa_target_date": "2026-08-20",
      "capa_pic": "Tim Proses & Operasi",
      "description": "Lapor dari kerosene treating, beda tekanan clay treater 11-V-113 A naik dan warna Saybolt kerosene produk turun mendekati batas.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Foto_Clay_Jenuh_11V113A.jpg (clay gelap dan menggumpal dari bagian atas bed); Trend_DP_Saybolt_PascaGanti_11V113.pdf (ΔP dan warna Saybolt 30 hari setelah penggantian. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/foto_clay_jenuh_11v113a.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(403),
    updated_at: hoursAgo(379)
  },  {
      "id": "CDU11-V10",
      "title": "Rembesan di Reservoir 11-P-112-B-V1 Ternyata dari Fitting, Dinding Bejana Tetap Aman",
      "asset_id": "11-P-112-B-V1",
      "status": "VERIFIED",
      "identitas_alat": "Reservoir 11-P-112-B-V1 (bejana kecil milik pompa 11-P-112B; Serial No. 91729 C-1), Seksi Produk (Pompa), Unit 11 CDU.",
      "gejala": "Teknisi melihat rembesan minyak di bawah reservoir. Level cairan di reservoir turun sedikit dalam sepekan.",
      "kondisi_operasi": "Reservoir dinilai sebagai bejana tekan dalam laporan Remaining Life Assessment (RLA) yang mengacu API 510. Laporan RLA mencatat laju korosi maksimum 0,045 mm/tahun, sisa umur terendah lebih dari 20 tahun, dan kategori risiko maksimum medium.",
      "pemeriksaan_awal": "Uji larutan sabun menemukan rembesan pada fitting tubing di dekat reservoir. UT pada dinding reservoir menunjukkan ketebalan yang sesuai dengan hasil RLA.",
      "praduga_penyebab": "Rembesan terbukti berasal dari fitting tubing yang longgar, bukan dari dinding bejana.",
      "usulan_tindakan": "Tim mengencangkan fitting dan mengganti ferrule, membersihkan sisa minyak, dan mengisi ulang cairan reservoir hingga level normal.",
      "verifikasi": "Tidak ada rembesan selama 14 hari pemantauan, level reservoir stabil, dan hasil UT sejalan dengan laju korosi RLA 0,045 mm/tahun.",
      "risk_level": "LOW",
      "risk_consequence": "Minor",
      "risk_likelihood": "Rare",
      "risk_summary": "Kebocoran kecil di fitting reservoir dapat menurunkan level cairan dan mengganggu kerja pompa. Dinding bejana masih aman menurut RLA dan UT.",
      "capa_corrective": "Kencangkan fitting tubing yang bocor, ganti ferrule, lalu isi ulang reservoir.",
      "capa_preventive": "Periksa fitting reservoir dalam setiap rute operator dan lanjutkan UT serta inspeksi visual sesuai rekomendasi RLA.",
      "capa_target_date": "2026-11-03",
      "capa_pic": "Tim Mekanik & Inspeksi Statik",
      "description": "Lapor dari area pompa produk, ada rembesan minyak di bawah reservoir kecil 11-P-112-B-V1 milik pompa 11-P-112B, mohon dicek apakah dindingnya bocor.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Foto_Fitting_Rembes_11P112BV1.jpg (gelembung uji sabun di fitting tubing); UT_Reservoir_11P112BV1.pdf (ketebalan dinding yang sesuai hasil RLA. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/foto_uji_sabun_flange_11e121.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Mendesak",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(460),
    updated_at: hoursAgo(436)
  },  {
      "id": "CDU11-E13",
      "title": "Fouling Sisi Tube Hot Preheater 11-E-110 A/B Pulih Setelah Hydrojetting",
      "asset_id": "11-E-110 A/B",
      "status": "VERIFIED",
      "identitas_alat": "Hot preheater 11-E-110 A/B (pemanas desalted crude dengan atmospheric residue), Hot Preheat Train, Unit 11 CDU.",
      "gejala": "Efisiensi 11-E-110 A turun di bawah 80%, dan suhu crude keluar hot preheat train ikut turun.",
      "kondisi_operasi": "Rangkaian 11-E-106 s.d. 11-E-111 menaikkan suhu desalted crude hingga 276,7 °C sebelum crude masuk furnace 11-F-101.",
      "pemeriksaan_awal": "Inspeksi borescope saat bundle dibuka menemukan endapan hitam keras setebal sekitar 3 mm di dinding dalam tube.",
      "praduga_penyebab": "Endapan organik (aspalten dan kokas) yang bercampur garam serta produk korosi terbukti menempel di sisi tube karena suhu dinding tinggi di ujung panas preheat train.",
      "usulan_tindakan": "Tim melakukan hydrojetting tube bundle 11-E-110 A dan B secara bergantian serta chemical cleaning di sisi shell.",
      "verifikasi": "Efisiensi kembali ke 92%, Rd turun di bawah nilai desain, dan suhu crude keluar hot preheat train kembali sekitar 276 °C.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Penurunan efisiensi preheater menambah konsumsi bahan bakar furnace dan emisi CO₂, tetapi tidak langsung mengancam keselamatan.",
      "capa_corrective": "Hydrojetting tube bundle dan chemical cleaning sisi shell 11-E-110 A/B.",
      "capa_preventive": "Pantau efisiensi, Rd, dan ΔP setiap minggu dengan ambang aksi efisiensi < 80%, lalu evaluasi dosis anti-foulant.",
      "capa_target_date": "2026-11-10",
      "capa_pic": "Tim Proses & Thermal",
      "description": "Lapor dari hot preheat train, efisiensi 11-E-110 A turun di bawah 80 persen dan ΔP sisi tube naik, mohon dievaluasi untuk pembersihan.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Borescope_Deposit_11E110A.jpg (endapan hitam ±3 mm di dinding dalam tube); Trend_Efisiensi_PascaCleaning_11E110.pdf (efisiensi pulih ke 92% setelah hydrojetting. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/borescope_deposit_11e110a.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(524),
    updated_at: hoursAgo(500)
  },  {
      "id": "CDU11-E14",
      "title": "Suhu Masuk Furnace Pulih Setelah Pembersihan Bergantian Hot Preheater 11-E-111 A/B",
      "asset_id": "11-E-111 A/B",
      "status": "VERIFIED",
      "identitas_alat": "Hot preheater 11-E-111 A/B (HE 17; pemanas desalted crude dengan atmospheric residue), Hot Preheat Train, Unit 11 CDU.",
      "gejala": "Suhu crude keluar 11-E-111 A/B turun sekitar 4 °C dalam sebulan. Konsumsi fuel gas furnace 11-F-101 naik untuk menjaga suhu keluar furnace.",
      "kondisi_operasi": "Rangkaian 11-E-106 s.d. 11-E-111 memanaskan desalted crude hingga 276,7 °C sebelum crude masuk furnace 11-F-101. Atmospheric residue panas menjadi pemanasnya.",
      "pemeriksaan_awal": "Engineer menghitung Rd unit A melampaui nilai desain, sedangkan unit B masih di bawahnya. Inspeksi saat bundle A dibuka menemukan endapan hitam keras di dinding dalam tube.",
      "praduga_penyebab": "Endapan organik di ujung panas preheat train terbukti menurunkan perpindahan panas unit A.",
      "usulan_tindakan": "Tim membersihkan unit A dengan hydrojetting saat unit B menanggung beban, lalu menjadwalkan pembersihan unit B secara bergantian.",
      "verifikasi": "Setelah pembersihan, suhu crude keluar 11-E-111 A/B naik kembali sekitar 4 °C, dan konsumsi fuel gas furnace turun ke level sebelum gangguan.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Penurunan suhu masuk furnace menambah konsumsi bahan bakar dan emisi CO₂. Gangguan ini tidak langsung mengancam keselamatan.",
      "capa_corrective": "Hydrojetting bundle 11-E-111 A dan B secara bergantian.",
      "capa_preventive": "Pantau Rd dan suhu crude keluar setiap minggu, lalu jadwalkan pembersihan HE ujung panas lebih sering daripada HE lain sesuai temuan pinch analysis.",
      "capa_target_date": "2026-09-30",
      "capa_pic": "Tim Proses & Thermal",
      "description": "Lapor dari hot preheat train, suhu crude keluar 11-E-111 A/B turun empat derajat dalam sebulan, dan konsumsi fuel gas furnace 11-F-101 ikut naik.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Trend_Rd_11E111A_B.png (Rd unit A melampaui desain, sedangkan unit B masih normal); Trend_FuelGas_PascaCleaning_11F101.pdf (suhu crude keluar naik kembali dan fuel gas turun setelah pembersihan. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e14_trend_rd_11e111a_b.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(543),
    updated_at: hoursAgo(519)
  },  {
      "id": "CDU11-P05",
      "title": "Vibrasi Aksial Tinggi Pompa 11-P-132 B Hilang Setelah Laser Alignment Ulang",
      "asset_id": "11-P-132 A/B",
      "status": "VERIFIED",
      "identitas_alat": "Pompa 11-P-132 A/B (nama tidak disebut di sumber), Unit 11 CDU.",
      "gejala": "Getaran aksial di sekitar kopling pompa B terasa kuat setelah pompa selesai diperbaiki. Elemen karet kopling cepat aus, dan serbuk karet terlihat di bawah guard kopling.",
      "kondisi_operasi": "Pompa tercantum setelah 11-P-126 A/B pada daftar S1, sedangkan fungsi dan seksinya tidak dirinci di sumber terbuka.",
      "pemeriksaan_awal": "Pengukuran sesuai ISO 10816-3 menunjukkan vibrasi aksial di DE lebih tinggi daripada arah horizontal dan vertikal. Pemeriksaan laser menemukan ketidaksejajaran sudut di luar toleransi.",
      "praduga_penyebab": "Ketidaksejajaran poros pompa dan motor setelah perbaikan terbukti menimbulkan beban aksial tambahan dan mempercepat keausan kopling.",
      "usulan_tindakan": "Tim melakukan laser alignment ulang, memperbaiki soft foot pada dudukan motor, dan mengganti elemen karet kopling.",
      "verifikasi": "Setelah alignment ulang, vibrasi aksial turun ke zona aman ISO 10816-3, suhu bearing normal, dan elemen kopling tidak aus selama 30 hari.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Minor",
      "risk_likelihood": "Likely",
      "risk_summary": "Ketidaksejajaran mempercepat kerusakan bearing, seal, dan kopling. Pompa A tersedia sebagai cadangan sehingga dampaknya terbatas.",
      "capa_corrective": "Laser alignment ulang, perbaikan soft foot, dan penggantian elemen kopling.",
      "capa_preventive": "Wajibkan laporan laser alignment dan pengukuran vibrasi awal sebelum pompa diserahkan kembali ke operasi.",
      "capa_target_date": "2026-10-10",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari pompa 11-P-132 B yang baru selesai perbaikan, getaran aksial di kopling terasa kuat dan karet kopling cepat aus.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Laser_Alignment_Sebelum_Sesudah_11P132B.pdf (data ketidaksejajaran sebelum dan sesudah alignment); Vibrasi_PascaAlignment_11P132B.pdf (vibrasi aksial di zona aman 30 hari setelah perbaikan. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-p05_laser_alignment_sebelum_sesudah_11p132b.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(555),
    updated_at: hoursAgo(531)
  },  {
      "id": "CDU11-E19",
      "title": "RVP Naphtha Stabil Kembali Setelah Pembersihan Reboiler Stabilizer 11-E-120",
      "asset_id": "11-E-120",
      "status": "VERIFIED",
      "identitas_alat": "Stabilizer Reboiler 11-E-120 (HE 14), Seksi Stabilisasi Naphtha, Unit 11 CDU.",
      "gejala": "Suhu bottom stabilizer sulit mencapai setpoint walaupun aliran bottom pump-around sudah maksimal. Laboratorium melaporkan RVP naphtha mendekati batas atas.",
      "kondisi_operasi": "Reboiler memanaskan bottom stabilizer dengan aliran bottom pump-around dari 11-P-106. Bottom pump-around kemudian mengalir ke 11-E-109 dan kembali ke tray 22 kolom 11-C-101.",
      "pemeriksaan_awal": "Engineer menghitung duty reboiler turun sekitar 20% dari data desain. Saat bundle dibuka, inspektor menemukan endapan kokas tipis di sisi pump-around dan lumpur di sisi naphtha.",
      "praduga_penyebab": "Fouling di kedua sisi tube terbukti menurunkan panas yang diterima bottom stabilizer, sehingga fraksi ringan tidak terlucuti sempurna.",
      "usulan_tindakan": "Tim membersihkan bundle 11-E-120 dengan hydrojetting pada jendela perawatan, lalu menyetel ulang kontrol suhu bottom stabilizer.",
      "verifikasi": "Setelah pembersihan, suhu bottom stabilizer mencapai setpoint, dan RVP naphtha kembali di bawah batas spesifikasi selama 30 hari pemantauan.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "RVP naphtha yang tinggi membuat produk off-spec dan menambah penguapan di tangki. Gangguan ini tidak langsung mengancam keselamatan.",
      "capa_corrective": "Hydrojetting bundle 11-E-120 dan penyetelan ulang kontrol suhu bottom stabilizer.",
      "capa_preventive": "Pantau duty reboiler dan RVP naphtha setiap minggu, lalu jadwalkan pembersihan sebelum duty turun lebih dari 15%.",
      "capa_target_date": "2026-08-31",
      "capa_pic": "Tim Proses & Thermal",
      "description": "Lapor dari stabilizer, suhu bottom 11-C-104 sulit mencapai setpoint walaupun aliran bottom pump-around ke reboiler 11-E-120 sudah maksimal, dan RVP naphtha mulai tinggi.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Proses & Operasi",
      "evidence_note": "Foto_Bundle_11E120_Endapan.jpg (endapan kokas tipis dan lumpur pada bundle saat dibuka); Trend_RVP_TBottom_PascaCleaning_11C104.pdf (RVP dan suhu bottom stabilizer 30 hari setelah pembersihan. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-e19_foto_bundle_11e120_endapan.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(638),
    updated_at: hoursAgo(614)
  },  {
      "id": "CDU11-P10",
      "title": "Cacat Bearing Pompa Gas Oil 11-P-103 C Terdeteksi Dini dan Diganti",
      "asset_id": "11-P-103 A/B/C",
      "status": "VERIFIED",
      "identitas_alat": "Pompa 11-P-103 A/B/C (nama tidak disebut di sumber; dekat titik sampling combined gas oil), Seksi Gas Oil, Unit 11 CDU.",
      "gejala": "Teknisi mendengar bunyi mendesing halus dari bearing housing pompa C. Suhu housing naik perlahan selama sepekan.",
      "kondisi_operasi": "Pompa terdiri atas tiga unit (A, B, C) dan berada dekat titik sampling combined gas oil (dekat 11-P-103C). Fungsinya tidak dirinci di sumber terbuka.",
      "pemeriksaan_awal": "Spektrum envelope menunjukkan puncak pada frekuensi cacat lintasan luar bearing (BPFO) beserta harmoniknya. Vibrasi keseluruhan masih di zona aman, sehingga cacat terdeteksi sejak dini.",
      "praduga_penyebab": "Cacat awal berupa spalling di lintasan luar bearing terbukti menjadi sumber bunyi dan kenaikan suhu.",
      "usulan_tindakan": "Tim memindahkan beban ke pompa A, mengganti bearing pompa C, memeriksa pelumasan, dan mengecek kelurusan poros.",
      "verifikasi": "Bearing lama memperlihatkan spalling di lintasan luar. Setelah penggantian, puncak BPFO hilang dari spektrum envelope, dan suhu housing normal selama 30 hari.",
      "risk_level": "MEDIUM",
      "risk_consequence": "Moderate",
      "risk_likelihood": "Possible",
      "risk_summary": "Bearing yang dibiarkan rusak dapat membuat poros bergeser dan merusak seal hingga gas oil panas bocor. Tiga unit pompa memberi cadangan yang cukup.",
      "capa_corrective": "Ganti bearing pompa C serta periksa pelumasan dan kelurusan poros.",
      "capa_preventive": "Tambahkan pengukuran envelope ke rute vibrasi bulanan pompa gas oil.",
      "capa_target_date": "2026-09-25",
      "capa_pic": "Tim Mekanik Rotating",
      "description": "Lapor dari area gas oil dekat 11-P-103 C, ada bunyi mendesing halus dari bearing housing dan suhunya pelan-pelan naik seminggu ini.",
      "reporter_name": "Dedi Kusnadi",
      "reporter_role": "frontline_omi",
      "dept": "Mekanik & Rotating",
      "evidence_note": "Envelope_BPFO_11P103C.pdf (spektrum envelope dengan puncak BPFO dan harmonik); Foto_Bearing_Spalling_11P103C.jpg (spalling di lintasan luar bearing lama. Oleh Ir. Agus Wijaya)",
      "image_url": "/assets/cdu11/evidences/cdu11-p10_envelope_bpfo_11p103c.webp",
      "verified_by": "Dr. Rina Suryani",
      "finding_type": "Kondisi Abnormal",
      "urgency": "Normal",
      "sla_reminder_count": 0
  ,
    created_at: hoursAgo(650),
    updated_at: hoursAgo(626)
  }
];

const SEED_EVIDENCES = [
  {
      "id": "ev-cdu11-c01-1",
      "report_id": "CDU11-C01",
      "file_name": "Trend_DP_SeksiAtas_11C106.png",
      "storage_path": "evidences/CDU11-C01/Trend_DP_SeksiAtas_11C106.png",
      "mime_type": "image/png",
      "caption": "grafik ΔP seksi atas naik dan berfluktuasi setelah laju umpan dinaikkan",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(4)
  },  {
      "id": "ev-cdu11-c01-2",
      "report_id": "CDU11-C01",
      "file_name": "GammaScan_11C106_GarisA-D.pdf",
      "storage_path": "evidences/CDU11-C01/GammaScan_11C106_GarisA-D.pdf",
      "mime_type": "application/pdf",
      "caption": "profil densitas per tray yang menunjukkan satu tray tanpa cairan dan tray di bawahnya tergenang. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(3)
  },  {
      "id": "ev-cdu11-c02-1",
      "report_id": "CDU11-C02",
      "file_name": "Trend_DP_TopTray_11C101.png",
      "storage_path": "evidences/CDU11-C02/Trend_DP_TopTray_11C101.png",
      "mime_type": "image/png",
      "caption": "grafik ΔP seksi atas naik 30% dalam 14 hari",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(60)
  },  {
      "id": "ev-cdu11-c04-1",
      "report_id": "CDU11-C04",
      "file_name": "UT_Grid_Shell_Nozzle_11C103.pdf",
      "storage_path": "evidences/CDU11-C04/UT_Grid_Shell_Nozzle_11C103.pdf",
      "mime_type": "application/pdf",
      "caption": "peta ketebalan dengan penipisan setempat dekat nozzle inlet HGO",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(198)
  },  {
      "id": "ev-cdu11-c04-2",
      "report_id": "CDU11-C04",
      "file_name": "Trend_ProbeUT_90hari_11C103.pdf",
      "storage_path": "evidences/CDU11-C04/Trend_ProbeUT_90hari_11C103.pdf",
      "mime_type": "application/pdf",
      "caption": "laju korosi pasca-perbaikan di bawah 0,13 mm/tahun. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(197)
  },  {
      "id": "ev-cdu11-c05-1",
      "report_id": "CDU11-C05",
      "file_name": "Trend_DP_SeksiAtas_11C104_30hari.png",
      "storage_path": "evidences/CDU11-C05/Trend_DP_SeksiAtas_11C104_30hari.png",
      "mime_type": "image/png",
      "caption": "grafik ΔP seksi atas naik sekitar 25%",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(46)
  },  {
      "id": "ev-cdu11-f01-1",
      "report_id": "CDU11-F01",
      "file_name": "IR_Thermography_11F101_Pass3.jpg",
      "storage_path": "evidences/CDU11-F01/IR_Thermography_11F101_Pass3.jpg",
      "mime_type": "image/jpeg",
      "caption": "citra termal hot spot pass 3 yang sudah dikoreksi emisivitas",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(7)
  },  {
      "id": "ev-cdu11-f01-2",
      "report_id": "CDU11-F01",
      "file_name": "Trend_TMT_PassFlow_11F101.pdf",
      "storage_path": "evidences/CDU11-F01/Trend_TMT_PassFlow_11F101.pdf",
      "mime_type": "application/pdf",
      "caption": "tren TMT naik 45 °C dalam 30 hari dan laju alir pass 3 lebih rendah. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(6)
  },  {
      "id": "ev-cdu11-e02-1",
      "report_id": "CDU11-E02",
      "file_name": "IRIS_Map_Tube_11E101.pdf",
      "storage_path": "evidences/CDU11-E02/IRIS_Map_Tube_11E101.pdf",
      "mime_type": "application/pdf",
      "caption": "peta ketebalan tube dengan pitting di bawah endapan dan dua tube tembus",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(293)
  },  {
      "id": "ev-cdu11-e02-2",
      "report_id": "CDU11-E02",
      "file_name": "Hydrotest_Ulang_11E101.pdf",
      "storage_path": "evidences/CDU11-E02/Hydrotest_Ulang_11E101.pdf",
      "mime_type": "application/pdf",
      "caption": "laporan uji hidrostatik ulang tanpa kebocoran setelah plugging. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(292)
  },  {
      "id": "ev-cdu11-e04-1",
      "report_id": "CDU11-E04",
      "file_name": "Banding_Duty_DP_11E103A_B.png",
      "storage_path": "evidences/CDU11-E04/Banding_Duty_DP_11E103A_B.png",
      "mime_type": "image/png",
      "caption": "grafik duty dan ΔP unit A dibanding unit B selama 30 hari",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(27)
  },  {
      "id": "ev-cdu11-e05-1",
      "report_id": "CDU11-E05",
      "file_name": "Foto_Endapan_Strainer_11P104.jpg",
      "storage_path": "evidences/CDU11-E05/Foto_Endapan_Strainer_11P104.jpg",
      "mime_type": "image/jpeg",
      "caption": "endapan putih keabu-abuan dari strainer top pump-around",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(65)
  },  {
      "id": "ev-cdu11-e05-2",
      "report_id": "CDU11-E05",
      "file_name": "Lab_Klorida_Endapan_TPA.pdf",
      "storage_path": "evidences/CDU11-E05/Lab_Klorida_Endapan_TPA.pdf",
      "mime_type": "application/pdf",
      "caption": "hasil uji klorida larutan endapan. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(64)
  },  {
      "id": "ev-cdu11-e06-1",
      "report_id": "CDU11-E06",
      "file_name": "Trend_Suhu_Desalter_Inlet_11E105.png",
      "storage_path": "evidences/CDU11-E06/Trend_Suhu_Desalter_Inlet_11E105.png",
      "mime_type": "image/png",
      "caption": "suhu crude ke desalter turun dari 155 ke 146 °C",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(30)
  },  {
      "id": "ev-cdu11-e08-1",
      "report_id": "CDU11-E08",
      "file_name": "Borescope_Inlet_Tube_11E128A.jpg",
      "storage_path": "evidences/CDU11-E08/Borescope_Inlet_Tube_11E128A.jpg",
      "mime_type": "image/jpeg",
      "caption": "kerak dan penipisan tapal kuda di ujung masuk tube",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(37)
  },  {
      "id": "ev-cdu11-e08-2",
      "report_id": "CDU11-E08",
      "file_name": "Trend_DP_Effluent_11E128A.png",
      "storage_path": "evidences/CDU11-E08/Trend_DP_Effluent_11E128A.png",
      "mime_type": "image/png",
      "caption": "kenaikan ΔP sisi effluent selama sebulan. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(36)
  },  {
      "id": "ev-cdu11-e09-1",
      "report_id": "CDU11-E09",
      "file_name": "Trend_Rd_11E106A_vs_Blend.png",
      "storage_path": "evidences/CDU11-E09/Trend_Rd_11E106A_vs_Blend.png",
      "mime_type": "image/png",
      "caption": "kenaikan Rd unit A sebelum dan sesudah pergantian crude",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(81)
  },  {
      "id": "ev-cdu11-e09-2",
      "report_id": "CDU11-E09",
      "file_name": "Lab_Kompatibilitas_Blend_Crude.pdf",
      "storage_path": "evidences/CDU11-E09/Lab_Kompatibilitas_Blend_Crude.pdf",
      "mime_type": "application/pdf",
      "caption": "hasil uji kestabilan aspalten campuran crude baru. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(80)
  },  {
      "id": "ev-cdu11-e10-1",
      "report_id": "CDU11-E10",
      "file_name": "Trend_Efisiensi_Rd_11E107_8minggu.png",
      "storage_path": "evidences/CDU11-E10/Trend_Efisiensi_Rd_11E107_8minggu.png",
      "mime_type": "image/png",
      "caption": "grafik efisiensi turun dari 89% ke 81% dan Rd naik melewati nilai desain",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(16)
  },  {
      "id": "ev-cdu11-e12-1",
      "report_id": "CDU11-E12",
      "file_name": "UT_Spot_Nozzle_11E109.pdf",
      "storage_path": "evidences/CDU11-E12/UT_Spot_Nozzle_11E109.pdf",
      "mime_type": "application/pdf",
      "caption": "data UT nozzle inlet tahun lalu dan tahun ini",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(43)
  },  {
      "id": "ev-cdu11-e13-1",
      "report_id": "CDU11-E13",
      "file_name": "Borescope_Deposit_11E110A.jpg",
      "storage_path": "evidences/CDU11-E13/Borescope_Deposit_11E110A.jpg",
      "mime_type": "image/jpeg",
      "caption": "endapan hitam ±3 mm di dinding dalam tube",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(502)
  },  {
      "id": "ev-cdu11-e13-2",
      "report_id": "CDU11-E13",
      "file_name": "Trend_Efisiensi_PascaCleaning_11E110.pdf",
      "storage_path": "evidences/CDU11-E13/Trend_Efisiensi_PascaCleaning_11E110.pdf",
      "mime_type": "application/pdf",
      "caption": "efisiensi pulih ke 92% setelah hydrojetting. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(501)
  },  {
      "id": "ev-cdu11-e14-1",
      "report_id": "CDU11-E14",
      "file_name": "Trend_Rd_11E111A_B.png",
      "storage_path": "evidences/CDU11-E14/Trend_Rd_11E111A_B.png",
      "mime_type": "image/png",
      "caption": "Rd unit A melampaui desain, sedangkan unit B masih normal",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(521)
  },  {
      "id": "ev-cdu11-e14-2",
      "report_id": "CDU11-E14",
      "file_name": "Trend_FuelGas_PascaCleaning_11F101.pdf",
      "storage_path": "evidences/CDU11-E14/Trend_FuelGas_PascaCleaning_11F101.pdf",
      "mime_type": "application/pdf",
      "caption": "suhu crude keluar naik kembali dan fuel gas turun setelah pembersihan. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(520)
  },  {
      "id": "ev-cdu11-e17-1",
      "report_id": "CDU11-E17",
      "file_name": "Trend_Duty_11E119_60hari.png",
      "storage_path": "evidences/CDU11-E17/Trend_Duty_11E119_60hari.png",
      "mime_type": "image/png",
      "caption": "duty 11-E-119 turun sekitar 18% dalam dua bulan",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(24)
  },  {
      "id": "ev-cdu11-e18-1",
      "report_id": "CDU11-E18",
      "file_name": "Foto_Uji_Sabun_Flange_11E121.jpg",
      "storage_path": "evidences/CDU11-E18/Foto_Uji_Sabun_Flange_11E121.jpg",
      "mime_type": "image/jpeg",
      "caption": "gelembung kecil di flange channel",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(39)
  },  {
      "id": "ev-cdu11-e18-2",
      "report_id": "CDU11-E18",
      "file_name": "Lab_NH3_H2S_Air_11V104.pdf",
      "storage_path": "evidences/CDU11-E18/Lab_NH3_H2S_Air_11V104.pdf",
      "mime_type": "application/pdf",
      "caption": "kadar amonia dan H₂S air overhead stabilizer. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(38)
  },  {
      "id": "ev-cdu11-e19-1",
      "report_id": "CDU11-E19",
      "file_name": "Foto_Bundle_11E120_Endapan.jpg",
      "storage_path": "evidences/CDU11-E19/Foto_Bundle_11E120_Endapan.jpg",
      "mime_type": "image/jpeg",
      "caption": "endapan kokas tipis dan lumpur pada bundle saat dibuka",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(616)
  },  {
      "id": "ev-cdu11-e19-2",
      "report_id": "CDU11-E19",
      "file_name": "Trend_RVP_TBottom_PascaCleaning_11C104.pdf",
      "storage_path": "evidences/CDU11-E19/Trend_RVP_TBottom_PascaCleaning_11C104.pdf",
      "mime_type": "application/pdf",
      "caption": "RVP dan suhu bottom stabilizer 30 hari setelah pembersihan. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(615)
  },  {
      "id": "ev-cdu11-e20-1",
      "report_id": "CDU11-E20",
      "file_name": "Lab_Saybolt_Kerosene_14hari.pdf",
      "storage_path": "evidences/CDU11-E20/Lab_Saybolt_Kerosene_14hari.pdf",
      "mime_type": "application/pdf",
      "caption": "tren warna Saybolt kerosene bottom selama 14 hari",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(25)
  },  {
      "id": "ev-cdu11-e20-2",
      "report_id": "CDU11-E20",
      "file_name": "Data_Tekanan_Sisi_11E122.png",
      "storage_path": "evidences/CDU11-E20/Data_Tekanan_Sisi_11E122.png",
      "mime_type": "image/png",
      "caption": "perbandingan tekanan sisi middle pump-around dan kerosene. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(24)
  },  {
      "id": "ev-cdu11-e21-1",
      "report_id": "CDU11-E21",
      "file_name": "Trend_Tekanan_11C105_vs_SuhuKondensat.png",
      "storage_path": "evidences/CDU11-E21/Trend_Tekanan_11C105_vs_SuhuKondensat.png",
      "mime_type": "image/png",
      "caption": "tekanan puncak splitter naik setiap siang hari",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(30)
  },  {
      "id": "ev-cdu11-e22-1",
      "report_id": "CDU11-E22",
      "file_name": "Foto_Sirip_Berdebu_11E124.jpg",
      "storage_path": "evidences/CDU11-E22/Foto_Sirip_Berdebu_11E124.jpg",
      "mime_type": "image/jpeg",
      "caption": "sirip bagian bawah tertutup debu tebal sebelum dibersihkan",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(153)
  },  {
      "id": "ev-cdu11-e22-2",
      "report_id": "CDU11-E22",
      "file_name": "Trend_Suhu_Naphtha_PascaCleaning_11E124.pdf",
      "storage_path": "evidences/CDU11-E22/Trend_Suhu_Naphtha_PascaCleaning_11E124.pdf",
      "mime_type": "application/pdf",
      "caption": "suhu naphtha keluar 30 hari setelah pembersihan. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(152)
  },  {
      "id": "ev-cdu11-e23-1",
      "report_id": "CDU11-E23",
      "file_name": "Foto_Lapisan_Minyak_CoolingTower.jpg",
      "storage_path": "evidences/CDU11-E23/Foto_Lapisan_Minyak_CoolingTower.jpg",
      "mime_type": "image/jpeg",
      "caption": "lapisan minyak tipis di basin cooling tower",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(22)
  },  {
      "id": "ev-cdu11-e23-2",
      "report_id": "CDU11-E23",
      "file_name": "Laporan_Uji_Tekanan_11E126.pdf",
      "storage_path": "evidences/CDU11-E23/Laporan_Uji_Tekanan_11E126.pdf",
      "mime_type": "application/pdf",
      "caption": "tiga tube bocor dengan pitting dari sisi air. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(21)
  },  {
      "id": "ev-cdu11-e24-1",
      "report_id": "CDU11-E24",
      "file_name": "Foto_Kerak_Tube_11E118.jpg",
      "storage_path": "evidences/CDU11-E24/Foto_Kerak_Tube_11E118.jpg",
      "mime_type": "image/jpeg",
      "caption": "kerak putih keras di dinding tube sisi air",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(191)
  },  {
      "id": "ev-cdu11-e24-2",
      "report_id": "CDU11-E24",
      "file_name": "Trend_Suhu_Kerosene_PascaCleaning_11E118.pdf",
      "storage_path": "evidences/CDU11-E24/Trend_Suhu_Kerosene_PascaCleaning_11E118.pdf",
      "mime_type": "application/pdf",
      "caption": "suhu kerosene dan warna Saybolt 30 hari setelah pembersihan. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(190)
  },  {
      "id": "ev-cdu11-e26-1",
      "report_id": "CDU11-E26",
      "file_name": "Foto_Sampel_Kerosene_Berkabut_11E127.jpg",
      "storage_path": "evidences/CDU11-E26/Foto_Sampel_Kerosene_Berkabut_11E127.jpg",
      "mime_type": "image/jpeg",
      "caption": "sampel berkabut dengan butiran air di dasar botol",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(19)
  },  {
      "id": "ev-cdu11-e26-2",
      "report_id": "CDU11-E26",
      "file_name": "Lab_Air_Klorida_Inhibitor.pdf",
      "storage_path": "evidences/CDU11-E26/Lab_Air_Klorida_Inhibitor.pdf",
      "mime_type": "application/pdf",
      "caption": "klorida dan inhibitor air pendingin pada air di sampel kerosene. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(18)
  },  {
      "id": "ev-cdu11-e27-1",
      "report_id": "CDU11-E27",
      "file_name": "Trend_DP_vs_SuhuUdara_11E112.png",
      "storage_path": "evidences/CDU11-E27/Trend_DP_vs_SuhuUdara_11E112.png",
      "mime_type": "image/png",
      "caption": "ΔP naik setiap malam dan saat hujan",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(24)
  },  {
      "id": "ev-cdu11-v02-1",
      "report_id": "CDU11-V02",
      "file_name": "Lab_pH_Fe_SourWater_11V116_14hari.pdf",
      "storage_path": "evidences/CDU11-V02/Lab_pH_Fe_SourWater_11V116_14hari.pdf",
      "mime_type": "application/pdf",
      "caption": "pH turun dan Fe naik selama 14 hari",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(42)
  },  {
      "id": "ev-cdu11-v03-1",
      "report_id": "CDU11-V03",
      "file_name": "UT_Boot_11V102.pdf",
      "storage_path": "evidences/CDU11-V03/UT_Boot_11V102.pdf",
      "mime_type": "application/pdf",
      "caption": "hasil UT penipisan setempat di boot air",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(305)
  },  {
      "id": "ev-cdu11-v03-2",
      "report_id": "CDU11-V03",
      "file_name": "Trend_pH_Fe_ER_90hari_11V102.pdf",
      "storage_path": "evidences/CDU11-V03/Trend_pH_Fe_ER_90hari_11V102.pdf",
      "mime_type": "application/pdf",
      "caption": "tren pH, Fe, dan laju korosi ER selama 90 hari. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(304)
  },  {
      "id": "ev-cdu11-v04-1",
      "report_id": "CDU11-V04",
      "file_name": "Foto_GasTip_Tersumbat_11F101.jpg",
      "storage_path": "evidences/CDU11-V04/Foto_GasTip_Tersumbat_11F101.jpg",
      "mime_type": "image/jpeg",
      "caption": "gas tip burner dengan endapan hitam",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(35)
  },  {
      "id": "ev-cdu11-v05-1",
      "report_id": "CDU11-V05",
      "file_name": "AUT_Cscan_11V104_Boot.png",
      "storage_path": "evidences/CDU11-V05/AUT_Cscan_11V104_Boot.png",
      "mime_type": "image/png",
      "caption": "peta C-scan indikasi HIC dekat water boot",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(49)
  },  {
      "id": "ev-cdu11-v05-2",
      "report_id": "CDU11-V05",
      "file_name": "PAUT_Sizing_11V104.pdf",
      "storage_path": "evidences/CDU11-V05/PAUT_Sizing_11V104.pdf",
      "mime_type": "application/pdf",
      "caption": "ukuran dan kedalaman indikasi stepwise. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(48)
  },  {
      "id": "ev-cdu11-v07-1",
      "report_id": "CDU11-V07",
      "file_name": "Foto_Clay_Jenuh_11V113A.jpg",
      "storage_path": "evidences/CDU11-V07/Foto_Clay_Jenuh_11V113A.jpg",
      "mime_type": "image/jpeg",
      "caption": "clay gelap dan menggumpal dari bagian atas bed",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(381)
  },  {
      "id": "ev-cdu11-v07-2",
      "report_id": "CDU11-V07",
      "file_name": "Trend_DP_Saybolt_PascaGanti_11V113.pdf",
      "storage_path": "evidences/CDU11-V07/Trend_DP_Saybolt_PascaGanti_11V113.pdf",
      "mime_type": "application/pdf",
      "caption": "ΔP dan warna Saybolt 30 hari setelah penggantian. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(380)
  },  {
      "id": "ev-cdu11-v08-1",
      "report_id": "CDU11-V08",
      "file_name": "Foto_Kristal_Putih_Las_11V106.jpg",
      "storage_path": "evidences/CDU11-V08/Foto_Kristal_Putih_Las_11V106.jpg",
      "mime_type": "image/jpeg",
      "caption": "kristal kaustik di dekat las nozzle bawah",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(56)
  },  {
      "id": "ev-cdu11-v08-2",
      "report_id": "CDU11-V08",
      "file_name": "WFMT_Retak_HAZ_11V106.pdf",
      "storage_path": "evidences/CDU11-V08/WFMT_Retak_HAZ_11V106.pdf",
      "mime_type": "application/pdf",
      "caption": "hasil WFMT dengan retak halus bercabang di HAZ. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(55)
  },  {
      "id": "ev-cdu11-v10-1",
      "report_id": "CDU11-V10",
      "file_name": "Foto_Fitting_Rembes_11P112BV1.jpg",
      "storage_path": "evidences/CDU11-V10/Foto_Fitting_Rembes_11P112BV1.jpg",
      "mime_type": "image/jpeg",
      "caption": "gelembung uji sabun di fitting tubing",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(438)
  },  {
      "id": "ev-cdu11-v10-2",
      "report_id": "CDU11-V10",
      "file_name": "UT_Reservoir_11P112BV1.pdf",
      "storage_path": "evidences/CDU11-V10/UT_Reservoir_11P112BV1.pdf",
      "mime_type": "application/pdf",
      "caption": "ketebalan dinding yang sesuai hasil RLA. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(437)
  },  {
      "id": "ev-cdu11-p01-1",
      "report_id": "CDU11-P01",
      "file_name": "Spektrum_Vibrasi_11P101A.pdf",
      "storage_path": "evidences/CDU11-P01/Spektrum_Vibrasi_11P101A.pdf",
      "mime_type": "application/pdf",
      "caption": "kenaikan pita lebar frekuensi tinggi saat kavitasi",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(20)
  },  {
      "id": "ev-cdu11-p01-2",
      "report_id": "CDU11-P01",
      "file_name": "Foto_Impeller_11P101A.jpg",
      "storage_path": "evidences/CDU11-P01/Foto_Impeller_11P101A.jpg",
      "mime_type": "image/jpeg",
      "caption": "pitting ringan di sisi masuk sudu impeller. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(19)
  },  {
      "id": "ev-cdu11-p02-1",
      "report_id": "CDU11-P02",
      "file_name": "Vibrasi_ISO10816_11P102A.pdf",
      "storage_path": "evidences/CDU11-P02/Vibrasi_ISO10816_11P102A.pdf",
      "mime_type": "application/pdf",
      "caption": "tren RMS horizontal NDE naik dari 9 ke 13 mm/s",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(73)
  },  {
      "id": "ev-cdu11-p02-2",
      "report_id": "CDU11-P02",
      "file_name": "FFT_NDE_11P102A.png",
      "storage_path": "evidences/CDU11-P02/FFT_NDE_11P102A.png",
      "mime_type": "image/png",
      "caption": "spektrum dengan puncak dominan pada 1× putaran. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(72)
  },  {
      "id": "ev-cdu11-p04-1",
      "report_id": "CDU11-P04",
      "file_name": "Bacaan_H2S_Gland_11P126A.png",
      "storage_path": "evidences/CDU11-P04/Bacaan_H2S_Gland_11P126A.png",
      "mime_type": "image/png",
      "caption": "foto layar detektor dengan bacaan H₂S di dekat gland seal",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(39)
  },  {
      "id": "ev-cdu11-p05-1",
      "report_id": "CDU11-P05",
      "file_name": "Laser_Alignment_Sebelum_Sesudah_11P132B.pdf",
      "storage_path": "evidences/CDU11-P05/Laser_Alignment_Sebelum_Sesudah_11P132B.pdf",
      "mime_type": "application/pdf",
      "caption": "data ketidaksejajaran sebelum dan sesudah alignment",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(533)
  },  {
      "id": "ev-cdu11-p05-2",
      "report_id": "CDU11-P05",
      "file_name": "Vibrasi_PascaAlignment_11P132B.pdf",
      "storage_path": "evidences/CDU11-P05/Vibrasi_PascaAlignment_11P132B.pdf",
      "mime_type": "application/pdf",
      "caption": "vibrasi aksial di zona aman 30 hari setelah perbaikan. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(532)
  },  {
      "id": "ev-cdu11-p06-1",
      "report_id": "CDU11-P06",
      "file_name": "Kurva_Head_Lapangan_11P104.png",
      "storage_path": "evidences/CDU11-P06/Kurva_Head_Lapangan_11P104.png",
      "mime_type": "image/png",
      "caption": "head lapangan turun sekitar 6% dari kurva pabrik",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(26)
  },  {
      "id": "ev-cdu11-p06-2",
      "report_id": "CDU11-P06",
      "file_name": "Foto_Endapan_Strainer_11P104.jpg",
      "storage_path": "evidences/CDU11-P06/Foto_Endapan_Strainer_11P104.jpg",
      "mime_type": "image/jpeg",
      "caption": "endapan putih keabu-abuan di strainer suction. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(25)
  },  {
      "id": "ev-cdu11-p08-1",
      "report_id": "CDU11-P08",
      "file_name": "Foto_Tetesan_Seal_11P106.jpg",
      "storage_path": "evidences/CDU11-P08/Foto_Tetesan_Seal_11P106.jpg",
      "mime_type": "image/jpeg",
      "caption": "tetesan di gland seal dan area yang sudah dibarikade",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(48)
  },  {
      "id": "ev-cdu11-p09-1",
      "report_id": "CDU11-P09",
      "file_name": "Spektrum_Vibrasi_11P115.pdf",
      "storage_path": "evidences/CDU11-P09/Spektrum_Vibrasi_11P115.pdf",
      "mime_type": "application/pdf",
      "caption": "pita lebar frekuensi tinggi naik saat level rendah",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(23)
  },  {
      "id": "ev-cdu11-p09-2",
      "report_id": "CDU11-P09",
      "file_name": "Hitungan_NPSHa_11P115.xlsx",
      "storage_path": "evidences/CDU11-P09/Hitungan_NPSHa_11P115.xlsx",
      "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "caption": "NPSH tersedia pada beberapa level accumulator. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(22)
  },  {
      "id": "ev-cdu11-p10-1",
      "report_id": "CDU11-P10",
      "file_name": "Envelope_BPFO_11P103C.pdf",
      "storage_path": "evidences/CDU11-P10/Envelope_BPFO_11P103C.pdf",
      "mime_type": "application/pdf",
      "caption": "spektrum envelope dengan puncak BPFO dan harmonik",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(628)
  },  {
      "id": "ev-cdu11-p10-2",
      "report_id": "CDU11-P10",
      "file_name": "Foto_Bearing_Spalling_11P103C.jpg",
      "storage_path": "evidences/CDU11-P10/Foto_Bearing_Spalling_11P103C.jpg",
      "mime_type": "image/jpeg",
      "caption": "spalling di lintasan luar bearing lama. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(627)
  },  {
      "id": "ev-cdu11-p12-1",
      "report_id": "CDU11-P12",
      "file_name": "Kurva_Head_Sebelum_11P111C.png",
      "storage_path": "evidences/CDU11-P12/Kurva_Head_Sebelum_11P111C.png",
      "mime_type": "image/png",
      "caption": "head turun sekitar 8% dari kurva pabrik",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(146)
  },  {
      "id": "ev-cdu11-p12-2",
      "report_id": "CDU11-P12",
      "file_name": "Uji_Unjuk_Kerja_Pasca_11P111C.pdf",
      "storage_path": "evidences/CDU11-P12/Uji_Unjuk_Kerja_Pasca_11P111C.pdf",
      "mime_type": "application/pdf",
      "caption": "head kembali sesuai kurva pabrik setelah penggantian. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(145)
  },  {
      "id": "ev-cdu11-p14-1",
      "report_id": "CDU11-P14",
      "file_name": "Log_Pengisian_Reservoir_11P112C.xlsx",
      "storage_path": "evidences/CDU11-P14/Log_Pengisian_Reservoir_11P112C.xlsx",
      "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "caption": "konsumsi cairan reservoir naik tiga kali lipat dalam sebulan",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(30)
  },  {
      "id": "ev-cdu11-p15-1",
      "report_id": "CDU11-P15",
      "file_name": "Titik_Operasi_vs_Kurva_11P107A.png",
      "storage_path": "evidences/CDU11-P15/Titik_Operasi_vs_Kurva_11P107A.png",
      "mime_type": "image/png",
      "caption": "titik operasi jauh di kanan BEP",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(39)
  },  {
      "id": "ev-cdu11-p16-1",
      "report_id": "CDU11-P16",
      "file_name": "Foto_Kokas_Gland_11P108A.jpg",
      "storage_path": "evidences/CDU11-P16/Foto_Kokas_Gland_11P108A.jpg",
      "mime_type": "image/jpeg",
      "caption": "kerak hitam keras di sisi atmosfer seal",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(28)
  },  {
      "id": "ev-cdu11-p16-2",
      "report_id": "CDU11-P16",
      "file_name": "Foto_Katup_SteamQuench_Rusak_11P108A.jpg",
      "storage_path": "evidences/CDU11-P16/Foto_Katup_SteamQuench_Rusak_11P108A.jpg",
      "mime_type": "image/jpeg",
      "caption": "katup steam quench yang rusak dan tertutup. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(27)
  },  {
      "id": "ev-cdu11-i01-1",
      "report_id": "CDU11-I01",
      "file_name": "Trend_Bukaan_11LV030.png",
      "storage_path": "evidences/CDU11-I01/Trend_Bukaan_11LV030.png",
      "mime_type": "image/png",
      "caption": "valve sering bekerja pada bukaan 10-20%",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(88)
  },  {
      "id": "ev-cdu11-i03-1",
      "report_id": "CDU11-I03",
      "file_name": "Diagnostik_Positioner_11FV032.pdf",
      "storage_path": "evidences/CDU11-I03/Diagnostik_Positioner_11FV032.pdf",
      "mime_type": "application/pdf",
      "caption": "tekanan aktuator tidak stabil",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(24)
  },  {
      "id": "ev-cdu11-i04-1",
      "report_id": "CDU11-I04",
      "file_name": "UT_Grid_Elbow_Hilir_11FV031.pdf",
      "storage_path": "evidences/CDU11-I04/UT_Grid_Elbow_Hilir_11FV031.pdf",
      "mime_type": "application/pdf",
      "caption": "peta ketebalan dengan penipisan setempat berbentuk alur",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(24)
  },  {
      "id": "ev-cdu11-i04-2",
      "report_id": "CDU11-I04",
      "file_name": "Foto_Trim_11FV031.jpg",
      "storage_path": "evidences/CDU11-I04/Foto_Trim_11FV031.jpg",
      "mime_type": "image/jpeg",
      "caption": "permukaan trim valve yang tergerus",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(23)
  },  {
      "id": "ev-cdu11-i04-3",
      "report_id": "CDU11-I04",
      "file_name": "Data_TAN_HGO_CAIS.xlsx",
      "storage_path": "evidences/CDU11-I04/Data_TAN_HGO_CAIS.xlsx",
      "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "caption": "TAN HGO 1,10-1,65 mg KOH/g dan riwayat crude blend. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(22)
  },  {
      "id": "ev-cdu11-i05-1",
      "report_id": "CDU11-I05",
      "file_name": "Plot_OP_PV_Sebelum_11FV033.png",
      "storage_path": "evidences/CDU11-I05/Plot_OP_PV_Sebelum_11FV033.png",
      "mime_type": "image/png",
      "caption": "pola stiction sebelum perbaikan",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(336)
  },  {
      "id": "ev-cdu11-i05-2",
      "report_id": "CDU11-I05",
      "file_name": "Plot_OP_PV_Sesudah_11FV033.png",
      "storage_path": "evidences/CDU11-I05/Plot_OP_PV_Sesudah_11FV033.png",
      "mime_type": "image/png",
      "caption": "respons normal 30 hari setelah perbaikan. Oleh Ir. Agus Wijaya",
      "uploaded_by": "Dedi Kusnadi"
  ,
    created_at: hoursAgo(335)
  }
];

const SEED_COMMENTS = [
  {
      "report_id": "CDU11-C01",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Mohon tambahkan satu garis pindai yang tidak terhalang manhole atau platform agar posisi tray yang rusak lebih pasti.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(6)
  },  {
      "report_id": "CDU11-C01",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "Garis pindai tambahan sudah dijadwalkan bersama vendor gamma scan pekan ini.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(4)
  },  {
      "report_id": "CDU11-C02",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon lampirkan klorida sour water 11-V-102 tiga hari terakhir sebelum water wash diputuskan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(60)
  },  {
      "report_id": "CDU11-C05",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon cocokkan tren ΔP dengan hasil Fe dan H₂S sour water 11-V-104 sebelum water wash diputuskan, karena kasus HIC di 11-V-104 (CDU11-V05) juga sedang diinvestigasi.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(46)
  },  {
      "report_id": "CDU11-F01",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Mohon pastikan laporan IR memuat koreksi emisivitas dan pantulan dinding, karena kesalahannya bisa puluhan derajat.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(9)
  },  {
      "report_id": "CDU11-F01",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "Laporan IR terkoreksi dan tren laju alir per pass sudah diunggah ke Evidence Vault.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(7)
  },  {
      "report_id": "CDU11-E04",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon pastikan laju residu terbagi rata ke unit A dan B sebelum menyimpulkan fouling, karena pembagian aliran yang timpang juga menurunkan duty.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(27)
  },  {
      "report_id": "CDU11-E05",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus ini saya tautkan ke CDU11-C02 karena sumber garamnya kemungkinan sama.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(67)
  },  {
      "report_id": "CDU11-E05",
      "author_name": "Dr. Rina Suryani",
      "author_role": "hse_validator",
      "comment": "Mohon sertakan perhitungan suhu deposisi sebelum water wash agar air tidak memperparah korosi.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(65)
  },  {
      "report_id": "CDU11-E06",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage karena berdampak langsung ke desalter. Mohon pantau bersama kasus CDU11-V01 agar tindakan di desalter tidak tumpang tindih.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(30)
  },  {
      "report_id": "CDU11-E08",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Mohon pastikan dulu fungsi 11-E-128 A/B di P&ID karena sumber terbuka tidak menyebutnya.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(39)
  },  {
      "report_id": "CDU11-E08",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "P&ID sedang dicek bersama engineer proses, dan hasilnya akan saya lampirkan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(37)
  },  {
      "report_id": "CDU11-E09",
      "author_name": "Dr. Rina Suryani",
      "author_role": "hse_validator",
      "comment": "Mohon cantumkan komposisi campuran crude sebelum dan sesudah pergantian agar keterkaitannya dengan fouling jelas.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(83)
  },  {
      "report_id": "CDU11-E09",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Komposisi campuran sudah ditambahkan pada lampiran laboratorium.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(81)
  },  {
      "report_id": "CDU11-E10",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus saya naikkan ke Triage. Mohon pakai data Juni 2023 sebagai baseline sebelum jadwal hydrojetting disusun.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(16)
  },  {
      "report_id": "CDU11-E12",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon bandingkan laju penipisan dengan kasus HGO 11-FV-031 (CDU11-I04) karena keduanya membawa fraksi ber-TAN tinggi.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(43)
  },  {
      "report_id": "CDU11-E17",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Endapan hitam ini kemungkinan berasal dari korosi overhead, jadi mohon kaitkan dengan kasus CDU11-V03 di 11-V-102.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(24)
  },  {
      "report_id": "CDU11-E18",
      "author_name": "Dr. Rina Suryani",
      "author_role": "hse_validator",
      "comment": "Area ini wajib memakai detektor H₂S personal selama perbaikan. Mohon cantumkan juga perhitungan NH₄HS yang dipakai.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(41)
  },  {
      "report_id": "CDU11-E18",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Perhitungan NH₄HS dan izin kerja dengan pengukuran gas sudah dilampirkan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(39)
  },  {
      "report_id": "CDU11-E20",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus ini terkait dengan CDU11-V07 di clay treater. Mohon jangan mengganti clay lagi sebelum sumber kontaminasi dipastikan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(27)
  },  {
      "report_id": "CDU11-E20",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "Penggantian clay ditunda sampai uji isolasi reboiler selesai.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(25)
  },  {
      "report_id": "CDU11-E21",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon pastikan media pendingin 11-E-123 di P&ID sebelum rencana pembersihan disusun.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(30)
  },  {
      "report_id": "CDU11-E23",
      "author_name": "Dr. Rina Suryani",
      "author_role": "hse_validator",
      "comment": "Mohon pastikan media pendingin dan tekanan kedua sisi di P&ID, karena arah kebocoran bergantung pada sisi yang bertekanan lebih tinggi.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(24)
  },  {
      "report_id": "CDU11-E23",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Data tekanan desain kedua sisi sedang diminta dari engineering.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(22)
  },  {
      "report_id": "CDU11-E26",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Mohon pastikan clay treater tidak menahan air berlebih selama investigasi.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(21)
  },  {
      "report_id": "CDU11-E26",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "Drain air di clay treater dan tangki sudah dijadwalkan setiap shift.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(19)
  },  {
      "report_id": "CDU11-E27",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon lampirkan hasil pour point dan titik kabut CGO sebelum batas suhu keluar ditetapkan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(24)
  },  {
      "report_id": "CDU11-V02",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon lampirkan data UT baseline konstruksi agar laju penipisan bisa dihitung.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(42)
  },  {
      "report_id": "CDU11-V04",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon tautkan ke kasus hot spot furnace CDU11-F01, karena sebaran panas yang tidak merata dapat memperparah TMT pass 3.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(35)
  },  {
      "report_id": "CDU11-V05",
      "author_name": "Dr. Rina Suryani",
      "author_role": "hse_validator",
      "comment": "Mohon sertakan data H₂S sour water 11-V-104 enam bulan terakhir untuk memperkuat dugaan mekanisme H₂S basah.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(51)
  },  {
      "report_id": "CDU11-V05",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "Data lab enam bulan sedang direkap dan akan diunggah minggu ini.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(49)
  },  {
      "report_id": "CDU11-V08",
      "author_name": "Dr. Rina Suryani",
      "author_role": "hse_validator",
      "comment": "Pekerjaan di area kaustik wajib memakai APD kimia lengkap. Mohon tambahkan data suhu dinding sepanjang jalur steam tracing.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(58)
  },  {
      "report_id": "CDU11-V08",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Data suhu dinding sedang diambil dengan thermal gun dan kamera IR.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(56)
  },  {
      "report_id": "CDU11-P02",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Puncak 1× bisa berasal dari ketidakseimbangan atau ketidaksejajaran. Mohon tambahkan pembacaan aksial dan fase sebelum pompa dibongkar.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(75)
  },  {
      "report_id": "CDU11-P02",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "Pembacaan aksial dan fase sudah dijadwalkan besok pagi.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(73)
  },  {
      "report_id": "CDU11-P04",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage dengan prioritas tinggi karena menyangkut H₂S. Pekerjaan wajib memakai SCBA dan uji gas sebelum seal dibuka.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(39)
  },  {
      "report_id": "CDU11-P06",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus ini satu rangkaian dengan CDU11-C02 dan CDU11-E05. Mohon tindakan water wash dirancang sekali untuk ketiga alat.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(28)
  },  {
      "report_id": "CDU11-P06",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "Ketiga kasus sudah saya tautkan di Synqra, dan jadwal pembersihan strainer sudah dibuat.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(26)
  },  {
      "report_id": "CDU11-P08",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kode tag 11-P-106 tidak berakhiran A/B. Pastikan dulu ada tidaknya pompa cadangan di P&ID, lalu koordinasikan penurunan laju pump-around dengan Proses sebelum perbaikan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(48)
  },  {
      "report_id": "CDU11-P09",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Fungsi pompa ini perlu dipastikan di P&ID karena sumber terbuka hanya mencantumkan urutannya.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(25)
  },  {
      "report_id": "CDU11-P09",
      "author_name": "Dedi Kusnadi",
      "author_role": "frontline_omi",
      "comment": "P&ID sudah dicek bersama operator panel, dan salinannya akan saya unggah.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(23)
  },  {
      "report_id": "CDU11-P14",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon cek juga reservoir 11-P-112-B-V1, karena laporan RLA-nya baru ditinjau pada kasus CDU11-V10.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(30)
  },  {
      "report_id": "CDU11-P15",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon cek apakah pompa lain di side stripper juga bergeser ke kanan BEP sejak kenaikan kapasitas.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(39)
  },  {
      "report_id": "CDU11-P16",
      "author_name": "Dr. Rina Suryani",
      "author_role": "hse_validator",
      "comment": "Mohon pastikan desain seal baru sesuai untuk suhu dan TAN HGO, lalu lampirkan lembar data seal.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(30)
  },  {
      "report_id": "CDU11-P16",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Lembar data seal dari vendor sedang ditinjau tim rotating.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(28)
  },  {
      "report_id": "CDU11-I01",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Mohon lampirkan perhitungan tekanan hilir terhadap tekanan uap agar flashing dan kavitasi bisa dibedakan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(88)
  },  {
      "report_id": "CDU11-I03",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Kasus naik ke Triage. Perbaikannya sederhana, tetapi mohon pastikan osilasi LGO hilang setelah perbaikan karena gejalanya mirip stiction pada 11-FV-037 (CDU11-I02).",
      "is_revision_request": false
  ,
    created_at: hoursAgo(24)
  },  {
      "report_id": "CDU11-I04",
      "author_name": "Dr. Rina Suryani",
      "author_role": "hse_validator",
      "comment": "Mohon cocokkan laju penipisan dengan jadwal masuknya crude impor ber-TAN tinggi sebelum mekanisme disimpulkan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(26)
  },  {
      "report_id": "CDU11-I04",
      "author_name": "Ir. Agus Wijaya",
      "author_role": "dept_reviewer",
      "comment": "Data CAIS dan riwayat crude blend enam bulan sudah dilampirkan.",
      "is_revision_request": false
  ,
    created_at: hoursAgo(24)
  }
];

async function runSeed() {
  console.log('----------------------------------------------------');
  console.log('SYNQRA SEED ENGINE - UNIT 11 CDU RU VI BALONGAN');
  console.log('----------------------------------------------------');

  if (!isConfigured) {
    console.log('Supabase URL / Anon Key belum dikonfigurasikan di .env.local.');
    console.log('66 aset & 66 kasus Unit 11 CDU Balongan tersedia langsung di in-memory app & supabase/seed.sql.');
    process.exit(0);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log(`Menghubungkan ke Supabase: ${supabaseUrl}`);

  const { error: assetErr } = await supabase.from('assets').upsert(SEED_ASSETS, { onConflict: 'id' });
  console.log(assetErr ? `Gagal seed assets: ${assetErr.message}` : `${SEED_ASSETS.length} aset Unit 11 CDU di-upsert.`);

  const { error: repErr } = await supabase.from('reports').upsert(SEED_REPORTS, { onConflict: 'id' });
  console.log(repErr ? `Gagal seed reports: ${repErr.message}` : `${SEED_REPORTS.length} laporan Unit 11 CDU di-upsert.`);

  const { data: existingEv } = await supabase.from('evidences').select('storage_path');
  const existingEvPaths = new Set((existingEv || []).map((row) => row.storage_path));
  const sanitizedEvidences = SEED_EVIDENCES.map(({ id: _ignoredId, ...rest }) => rest);
  const missingEvs = sanitizedEvidences.filter((ev) => !existingEvPaths.has(ev.storage_path));
  if (missingEvs.length > 0) {
    const { error: evErr } = await supabase.from('evidences').insert(missingEvs);
    console.log(evErr ? `Catatan evidences: ${evErr.message}` : `${missingEvs.length} bukti fisik baru ditambahkan (total ${sanitizedEvidences.length}).`);
  } else {
    console.log(`Seluruh ${sanitizedEvidences.length} bukti fisik sudah tersedia.`);
  }

  const { count: existingCommentCount } = await supabase.from('case_comments').select('*', { count: 'exact', head: true });
  if (!existingCommentCount || existingCommentCount === 0) {
    const { error: comErr } = await supabase.from('case_comments').insert(SEED_COMMENTS);
    console.log(comErr ? `Catatan comments: ${comErr.message}` : `${SEED_COMMENTS.length} komentar diskusi ditambahkan.`);
  } else {
    console.log(`Tabel case_comments sudah berisi ${existingCommentCount} komentar (lewati insert ulang).`);
  }
}

runSeed().catch((err) => {
  console.error('Fatal error during seed:', err);
  process.exit(1);
});
