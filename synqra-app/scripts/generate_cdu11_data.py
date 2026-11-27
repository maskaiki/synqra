"""Deterministic generator for Unit 11 CDU (PT Pertamina RU VI Balongan) dataset.

Reads:
  - Kasus_Synqra_per_Jenis_Unit11_CDU_RU_VI_Balongan.xlsx
  - scratch/evidence_media_manifest.json

Writes:
  - src/lib/mediaAssets.ts
  - src/lib/constants.ts
  - scripts/seed.mjs
  - supabase/seed.sql
"""

from __future__ import annotations

import datetime
import json
import os
import re
from typing import Any
import openpyxl

APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXCEL_PATH = os.path.join(APP_DIR, "Kasus_Synqra_per_Jenis_Unit11_CDU_RU_VI_Balongan.xlsx")
MANIFEST_PATH = (
    r"C:\Users\ASUS\.gemini\antigravity\brain\b8ad67c4-05e6-4d53-a641-0ef273a1c9fb"
    r"\scratch\evidence_media_manifest.json"
)

MEDIA_ASSETS_OUT = os.path.join(APP_DIR, "src", "lib", "mediaAssets.ts")
CONSTANTS_OUT = os.path.join(APP_DIR, "src", "lib", "constants.ts")
SEED_JS_OUT = os.path.join(APP_DIR, "scripts", "seed.mjs")
SEED_SQL_OUT = os.path.join(APP_DIR, "supabase", "seed.sql")

SHEETS: list[tuple[str, str, str]] = [
    ("1. Kolom (C)", "C", "Proses & Operasi"),
    ("2. Furnace (F)", "F", "Proses & Operasi"),
    ("3. Heat Exchanger (E)", "E", "Proses & Termal"),
    ("4. Vessel & Drum (V)", "V", "Proses & Integritas Statik"),
    ("5. Pompa (P)", "P", "Mekanik & Rotating"),
    ("6. Instrumen (LV, FV)", "I", "Instrumentasi & Kontrol"),
]

CUSTOM_DISPLAY_NAMES: dict[str, str] = {
    "11-E-128 A/B": "Exchanger Effluent Desalter 11-E-128",
    "11-V-106": "Vessel Injeksi Kaustik",
    "11-P-125 A/B": "Pompa Pre-Flash & Distilat Ringan",
    "11-P-126 A/B": "Pompa Sour Water Pre-Flash",
    "11-P-132 A/B": "Pompa Sirkuit Pre-Flash",
    "11-P-115": "Pompa Refluks Overhead Utama",
    "11-P-103 A/B/C": "Pompa Gas Oil Produk",
    "11-P-110 A/B": "Pompa Transfer Seksi Produk",
    "11-P-111 C/D": "Pompa Produk Naphtha Splitter",
    "11-P-131 A/B": "Pompa Sirkulasi Samping CDU",
    "11-P-112 C/D": "Pompa Transfer Produk Sekunder",
    "11-P-107 A/B": "Pompa LGO Side Stripper",
    "11-P-108 A/B": "Pompa HGO Side Stripper",
    "11-P-109 A/B": "Pompa Bottom Atmospheric Residue",
}

NO_SELF_APPROVAL_DEMO_IDS = {"CDU11-V08", "CDU11-I04"}

# Carefully curated hoursAgo ordering for top recent Activity Feed diversity + realistic SLA backlog
CURATED_UPDATED_HOURS: dict[str, int] = {
    # Top 4 diverse activity feed showcase (Praduga/Triage/Investigasi/Terverifikasi)
    "CDU11-C01": 2,
    "CDU11-F01": 5,
    "CDU11-V01": 9,
    "CDU11-E10": 14,
    "CDU11-P01": 18,
    "CDU11-I04": 22,
    # Realistic Overdue (> 48h) active cases for NotificationBell & SLA filter
    "CDU11-V08": 54,
    "CDU11-C02": 58,
    "CDU11-E05": 63,
    "CDU11-P02": 71,
    "CDU11-E09": 79,
    "CDU11-I01": 86,
    # Segera Cek (24-48h) active cases
    "CDU11-E06": 28,
    "CDU11-V04": 33,
    "CDU11-P04": 37,
    "CDU11-E12": 41,
    "CDU11-C05": 44,
    "CDU11-P08": 46,
}


def clean_text(val: Any) -> str:
    if val is None:
        return ""
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.strftime("%Y-%m-%d")
    s = str(val).strip()
    s = (
        s.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u2212", "-")
        .replace("\r\n", "\n")
        .replace("\r", "\n")
    )
    return s


def map_status(raw: str) -> str:
    low = clean_text(raw).lower()
    if "terverifikasi" in low or "verified" in low:
        return "VERIFIED"
    if "investigasi" in low or "investigation" in low:
        return "INVESTIGATION"
    if "triage" in low:
        return "TRIAGE"
    return "PRADUGA"


def map_consequence(raw: str) -> str:
    low = clean_text(raw).lower()
    if "catastrophic" in low:
        return "Catastrophic"
    if "major" in low:
        return "Major"
    if "moderate" in low:
        return "Moderate"
    return "Minor"


def map_likelihood(raw: str) -> str:
    low = clean_text(raw).lower()
    if "frequent" in low:
        return "Frequent"
    if "likely" in low:
        return "Likely"
    if "possible" in low:
        return "Possible"
    return "Rare"


def map_risk_level(raw: str) -> str:
    up = clean_text(raw).upper()
    if up in ("LOW", "MEDIUM", "HIGH", "CRITICAL"):
        return up
    return "MEDIUM"


def infer_asset_render_type(cat_code: str, tag: str, raw_type: str, raw_name: str) -> str:
    t_low = f"{raw_type} {raw_name}".lower()
    if cat_code == "C":
        if tag in ("11-C-101", "11-C-106"):
            return "column"
        return "stripper"
    if cat_code == "F":
        return "furnace"
    if cat_code == "E":
        if "fin fan" in t_low or "fin-fan" in t_low or "air cooler" in t_low:
            return "finfan"
        return "heat"
    if cat_code == "V":
        if "desalter" in t_low or tag.startswith("11-V-101"):
            return "desalter"
        return "vessel"
    if cat_code == "P":
        return "pump"
    return "valve"


def clean_display_name(tag: str, raw_name: str, raw_type: str, section: str) -> str:
    if tag in CUSTOM_DISPLAY_NAMES:
        return CUSTOM_DISPLAY_NAMES[tag]
    name = clean_text(raw_name)
    if not name or "tidak disebut" in name.lower():
        return f"{clean_text(raw_type) or 'Peralatan'} {section}".strip()
    return name


def infer_dept(reporter_raw: str, fallback_dept: str) -> str:
    low = reporter_raw.lower()
    if "rotat" in low or "mekanik" in low:
        return "Mekanik & Rotating"
    if "instrumen" in low or "kontrol" in low:
        return "Instrumentasi & Kontrol"
    if "korosi" in low or "inspeksi" in low or "statik" in low:
        return "Inspeksi Statik & Korosi"
    if "proses" in low or "operasi" in low:
        return "Proses & Operasi"
    return fallback_dept


def parse_lit_codes(raw_sumber: str) -> list[str]:
    s = clean_text(raw_sumber)
    # Match 2-letter + 2-digit codes or RDMP22 etc.
    codes = re.findall(r"\b([A-Z]{2,4}\d{2})\b", s)
    seen: list[str] = []
    for c in codes:
        if c not in seen:
            seen.append(c)
    return seen


def parse_journal_ids(raw_g: str) -> list[str]:
    s = clean_text(raw_g)
    if not s or s == "-":
        return []
    ids = re.findall(r"\b(G\d{2})\b", s.upper())
    seen: list[str] = []
    for gid in ids:
        if gid not in seen:
            seen.append(gid)
    return seen


def parse_discussion_comments(case_id: str, raw_disc: str, base_hours: int) -> list[dict[str, Any]]:
    s = clean_text(raw_disc)
    if not s or s == "-":
        return []
    comments: list[dict[str, Any]] = []
    lines = [ln.strip() for ln in s.split("\n") if ln.strip()]
    for idx, ln in enumerate(lines):
        m = re.match(r"^(Dedi Kusnadi|Ir\.\s*Agus Wijaya|Dr\.\s*Rina Suryani)\s*:\s*(.+)$", ln)
        if m:
            author = re.sub(r"\s+", " ", m.group(1).strip())
            body = m.group(2).strip()
        else:
            author = "Ir. Agus Wijaya"
            body = ln
        if "Rina" in author:
            role = "hse_validator"
        elif "Agus" in author:
            role = "dept_reviewer"
        else:
            role = "frontline_omi"
        c_hours = max(1, base_hours + (len(lines) - idx) * 2)
        comments.append(
            {
                "id": f"c-{case_id.lower()}-{idx + 1}",
                "report_id": case_id,
                "author_name": author,
                "author_role": role,
                "comment": body,
                "is_revision_request": False,
                "hours_ago": c_hours,
            }
        )
    return comments


def sql_str(val: Any) -> str:
    if val is None:
        return "NULL"
    s = str(val).replace("'", "''")
    return f"'{s}'"


def main() -> None:
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    available_journal: dict[str, str] = manifest.get("available_journal_imgs", {})
    ev_manifest: dict[str, dict[str, Any]] = manifest.get("evidences", {})

    assets: list[dict[str, Any]] = []
    reports: list[dict[str, Any]] = []
    evidences: list[dict[str, Any]] = []
    comments: list[dict[str, Any]] = []

    row_counter = 0
    for sheet_name, cat_code, default_dept in SHEETS:
        ws = wb[sheet_name]
        for r in range(5, ws.max_row + 1):
            case_id = clean_text(ws.cell(r, 2).value)
            tag = clean_text(ws.cell(r, 3).value)
            if not case_id or not tag:
                continue
            row_counter += 1

            status = map_status(ws.cell(r, 4).value)
            raw_name = clean_text(ws.cell(r, 5).value)
            raw_type = clean_text(ws.cell(r, 6).value)
            section = clean_text(ws.cell(r, 7).value)
            unit_count_val = ws.cell(r, 8).value
            unit_count = int(unit_count_val) if isinstance(unit_count_val, (int, float)) else 1

            title = clean_text(ws.cell(r, 9).value)
            sample_narrative = clean_text(ws.cell(r, 10).value)
            identitas = clean_text(ws.cell(r, 11).value)
            gejala = clean_text(ws.cell(r, 12).value)
            kondisi = clean_text(ws.cell(r, 13).value)
            pemeriksaan = clean_text(ws.cell(r, 14).value)
            praduga = clean_text(ws.cell(r, 15).value)
            usulan = clean_text(ws.cell(r, 16).value)
            verifikasi = clean_text(ws.cell(r, 17).value)

            cons = map_consequence(ws.cell(r, 18).value)
            lik = map_likelihood(ws.cell(r, 19).value)
            risk_lvl = map_risk_level(ws.cell(r, 20).value)
            risk_sum = clean_text(ws.cell(r, 21).value)
            capa_corr = clean_text(ws.cell(r, 22).value)
            capa_prev = clean_text(ws.cell(r, 23).value)
            capa_pic = clean_text(ws.cell(r, 24).value)
            capa_target = clean_text(ws.cell(r, 25).value)

            ev_count_val = ws.cell(r, 26).value
            ev_count = int(ev_count_val) if isinstance(ev_count_val, (int, float)) else 0
            b1 = clean_text(ws.cell(r, 27).value)
            b2 = clean_text(ws.cell(r, 28).value)
            raw_disc = clean_text(ws.cell(r, 30).value)
            val_status_txt = clean_text(ws.cell(r, 31).value)
            reporter_cell = clean_text(ws.cell(r, 32).value)
            raw_sumber = clean_text(ws.cell(r, 33).value)
            raw_gimg = clean_text(ws.cell(r, 34).value)
            fact_note = clean_text(ws.cell(r, 35).value)

            display_name = clean_display_name(tag, raw_name, raw_type, section)
            render_type = infer_asset_render_type(cat_code, tag, raw_type, raw_name)
            dept = infer_dept(reporter_cell, default_dept)

            subtitle = (
                f"{raw_type} ({unit_count} unit)" if unit_count > 1 else (raw_type or display_name)
            )
            asset_desc = (
                f"{display_name} pada seksi {section}, Unit 11 (CDU) PT Pertamina RU VI Balongan "
                f"({unit_count} unit terpasang)."
            )

            assets.append(
                {
                    "id": tag,
                    "name": display_name,
                    "subtitle": subtitle,
                    "type": render_type,
                    "categoryCode": cat_code,
                    "unitCount": unit_count,
                    "area": f"{section} · Unit 11 CDU Balongan",
                    "dept": dept,
                    "description": asset_desc,
                }
            )

            # Curate timestamps so SLA distribution & Home Activity Feed look natural
            if case_id in CURATED_UPDATED_HOURS:
                upd_h = CURATED_UPDATED_HOURS[case_id]
            elif status == "VERIFIED":
                upd_h = 120 + (row_counter * 19) % 520
            elif status == "PRADUGA":
                upd_h = 6 + (row_counter * 7) % 34
            elif status == "TRIAGE":
                upd_h = 16 + (row_counter * 9) % 30
            else:
                upd_h = 14 + (row_counter * 11) % 36
            cre_h = upd_h + (24 if status == "VERIFIED" else 6)

            # Determine evidences for this report (0 if PRADUGA)
            case_evs: list[dict[str, Any]] = []
            if status != "PRADUGA" and ev_count > 0:
                for slot in range(1, 4):
                    mkey = f"{case_id}_{slot}"
                    if mkey in ev_manifest:
                        em = ev_manifest[mkey]
                        ev_id = f"ev-{case_id.lower()}-{slot}"
                        fn = clean_text(em["file_name"])
                        ext = os.path.splitext(fn)[1].lower()
                        mime = (
                            "image/png"
                            if ext == ".png"
                            else "application/pdf"
                            if ext == ".pdf"
                            else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            if ext == ".xlsx"
                            else "image/jpeg"
                        )
                        case_evs.append(
                            {
                                "id": ev_id,
                                "report_id": case_id,
                                "file_name": fn,
                                "storage_path": f"evidences/{case_id}/{fn}",
                                "mime_type": mime,
                                "caption": clean_text(em["caption"]),
                                "uploaded_by": clean_text(em["uploaded_by"]) or "Dedi Kusnadi",
                                "hours_ago": max(1, upd_h + (3 - slot)),
                                "public_url": em["public_url"],
                                "source_attribution": clean_text(em.get("source_attribution", "")),
                                "license_label": clean_text(em.get("license_label", "")),
                            }
                        )
            evidences.extend(case_evs)

            # Reporter persona: assign 2 investigasi cases to Dr. Rina Suryani for No Self-Approval demo
            if case_id in NO_SELF_APPROVAL_DEMO_IDS:
                rep_name = "Dr. Rina Suryani"
                rep_role = "hse_validator"
                rep_dept = "HSE & Process Safety"
            else:
                rep_name = "Dedi Kusnadi"
                rep_role = "frontline_omi"
                rep_dept = dept

            # Urgency & finding_type inference
            is_urgent = (
                risk_lvl in ("CRITICAL", "HIGH")
                or any(
                    w in f"{title} {gejala}".lower()
                    for w in ("bocor", "rembes", "kavitasi", "retak", "hot spot", "h2s", "kaustik", "overheat")
                )
            )
            urgency = "Mendesak" if is_urgent else "Normal"
            finding_type = (
                "Near Miss"
                if "kaustik" in title.lower() or "h₂s" in title.lower() or "h2s" in title.lower()
                else "Potensi Bahaya"
                if risk_lvl in ("CRITICAL", "HIGH")
                else "Kondisi Abnormal"
            )

            if status == "PRADUGA":
                required_hint = "; ".join([p for p in (b1, b2) if p and p != "-"])
                ev_note = "Belum ada file bukti fisik yang diunggah."
            else:
                required_hint = ""
                ev_note = "; ".join(f"{e['file_name']} ({e['caption']})" for e in case_evs)

            lit_refs = parse_lit_codes(raw_sumber)
            g_ids = parse_journal_ids(raw_gimg)
            verified_by = (
                "Dr. Rina Suryani"
                if status == "VERIFIED" or "dr. rina suryani" in val_status_txt.lower()
                else None
            )

            reports.append(
                {
                    "id": case_id,
                    "title": title,
                    "asset_id": tag,
                    "status": status,
                    "finding_type": finding_type,
                    "urgency": urgency,
                    "identitas_alat": identitas,
                    "gejala": gejala,
                    "kondisi_operasi": kondisi,
                    "pemeriksaan_awal": pemeriksaan,
                    "praduga_penyebab": praduga,
                    "usulan_tindakan": usulan,
                    "verifikasi": verifikasi,
                    "risk_level": risk_lvl,
                    "risk_consequence": cons,
                    "risk_likelihood": lik,
                    "risk_summary": risk_sum,
                    "capa_corrective": capa_corr,
                    "capa_preventive": capa_prev,
                    "capa_target_date": capa_target,
                    "capa_pic": capa_pic,
                    "description": sample_narrative or gejala,
                    "sample_narrative": sample_narrative,
                    "reporter_name": rep_name,
                    "reporter_role": rep_role,
                    "dept": rep_dept,
                    "evidence_note": ev_note,
                    "required_evidence_hint": required_hint or None,
                    "image_url": case_evs[0]["public_url"] if case_evs else None,
                    "literature_refs": lit_refs,
                    "journal_image_ids": g_ids,
                    "fact_vs_scenario_note": fact_note or None,
                    "sla_reminder_count": 1 if upd_h > 48 and status != "VERIFIED" else 0,
                    "sla_last_reminder_at_hours": 6 if upd_h > 48 and status != "VERIFIED" else None,
                    "verified_by": verified_by,
                    "created_hours_ago": cre_h,
                    "updated_hours_ago": upd_h,
                }
            )

            comments.extend(parse_discussion_comments(case_id, raw_disc, upd_h))

    # Sort reports ascending by updated_hours_ago (newest Activity Feed first!)
    reports.sort(key=lambda r: (r["updated_hours_ago"], r["id"]))

    # 1. Emit src/lib/mediaAssets.ts
    ev_media_map: dict[str, dict[str, str]] = {}
    ev_path_map: dict[str, str] = {}
    for ev in evidences:
        ev_media_map[ev["id"]] = {
            "url": ev["public_url"],
            "attribution": ev["source_attribution"],
            "license": ev["license_label"],
        }
        ev_path_map[ev["storage_path"]] = ev["public_url"]

    media_ts = f"""import balonganCdu11HeroImg from '@/assets/branding/balongan-cdu11-hero.webp';
import pumpImg from '@/assets/equipment/centrifugal-pump-p101a.webp';
import heatImg from '@/assets/equipment/heat-exchanger-e201.webp';
import valveImg from '@/assets/equipment/control-valve-fcv301.webp';
import columnImg from '@/assets/equipment/column-fractionator.webp';
import stripperImg from '@/assets/equipment/column-stripper.webp';
import furnaceImg from '@/assets/equipment/furnace-heater.webp';
import finFanImg from '@/assets/equipment/fin-fan-cooler.webp';
import desalterImg from '@/assets/equipment/vessel-desalter.webp';
import vesselDrumImg from '@/assets/equipment/vessel-drum-boot.webp';

export interface MediaAssetEntry {{
  src: string;
  width: number;
  height: number;
}}

export interface EquipmentMediaEntry extends MediaAssetEntry {{
  alt: string;
}}

export interface EvidenceMediaMeta {{
  url: string;
  attribution?: string;
  license?: string;
}}

export const BRAND_MEDIA = {{
  loginHeroOilRig: {{
    src: balonganCdu11HeroImg.src,
    width: balonganCdu11HeroImg.width,
    height: balonganCdu11HeroImg.height,
    alt: 'Panorama Unit 11 Crude Distillation Unit (CDU) PT Pertamina RU VI Balongan saat senja',
  }},
}};

export const EQUIPMENT_MEDIA: Record<string, EquipmentMediaEntry> = {{
  column: {{
    src: columnImg.src,
    width: columnImg.width,
    height: columnImg.height,
    alt: 'Kolom Distilasi Utama 11-C-101 / Pre-Flash 11-C-106',
  }},
  stripper: {{
    src: stripperImg.src,
    width: stripperImg.width,
    height: stripperImg.height,
    alt: 'Kolom Side Stripper & Splitter Unit 11 CDU',
  }},
  furnace: {{
    src: furnaceImg.src,
    width: furnaceImg.width,
    height: furnaceImg.height,
    alt: 'Crude Charge Fired Heater 11-F-101',
  }},
  heater: {{
    src: furnaceImg.src,
    width: furnaceImg.width,
    height: furnaceImg.height,
    alt: 'Crude Charge Fired Heater 11-F-101',
  }},
  heat: {{
    src: heatImg.src,
    width: heatImg.width,
    height: heatImg.height,
    alt: 'Shell & Tube Heat Exchanger Unit 11 CDU',
  }},
  finfan: {{
    src: finFanImg.src,
    width: finFanImg.width,
    height: finFanImg.height,
    alt: 'Fin-Fan Air Cooler Unit 11 CDU',
  }},
  desalter: {{
    src: desalterImg.src,
    width: desalterImg.width,
    height: desalterImg.height,
    alt: 'Electrostatic Desalter 11-V-101 A/B',
  }},
  vessel: {{
    src: vesselDrumImg.src,
    width: vesselDrumImg.width,
    height: vesselDrumImg.height,
    alt: 'Vessel & Overhead Reflux Drum Unit 11 CDU',
  }},
  pump: {{
    src: pumpImg.src,
    width: pumpImg.width,
    height: pumpImg.height,
    alt: 'Pompa Sentrifugal Proses Unit 11 CDU',
  }},
  valve: {{
    src: valveImg.src,
    width: valveImg.width,
    height: valveImg.height,
    alt: 'Control Valve Pneumatik Unit 11 CDU',
  }},
}};

export const JOURNAL_IMAGES_BY_ID: Record<string, string> = {json.dumps(available_journal, indent=2, ensure_ascii=False)};

export const EVIDENCE_MEDIA_META: Record<string, EvidenceMediaMeta> = {json.dumps(ev_media_map, indent=2, ensure_ascii=False)};

export const EVIDENCE_MEDIA_BY_ID: Record<string, MediaAssetEntry> = Object.fromEntries(
  Object.entries(EVIDENCE_MEDIA_META).map(([k, v]) => [
    k,
    {{ src: v.url, width: 1280, height: 800 }},
  ])
);

export const EVIDENCE_MEDIA_BY_STORAGE_PATH: Record<string, string> = {json.dumps(ev_path_map, indent=2, ensure_ascii=False)};

/**
 * Mengembalikan URL asset WebP bawaan dan metadata atribusi jika bukti berasal dari katalog CDU 11.
 */
export function resolveBuiltInEvidenceUrl(ev: {{
  id?: string;
  storage_path?: string;
}}): string | undefined {{
  if (ev.id && EVIDENCE_MEDIA_META[ev.id]) {{
    return EVIDENCE_MEDIA_META[ev.id].url;
  }}
  if (ev.storage_path && EVIDENCE_MEDIA_BY_STORAGE_PATH[ev.storage_path]) {{
    return EVIDENCE_MEDIA_BY_STORAGE_PATH[ev.storage_path];
  }}
  return undefined;
}}
"""
    with open(MEDIA_ASSETS_OUT, "w", encoding="utf-8") as f:
        f.write(media_ts)

    # 2. Emit src/lib/constants.ts
    def fmt_report_ts(r: dict[str, Any]) -> dict[str, Any]:
        out = {k: v for k, v in r.items() if k not in ("created_hours_ago", "updated_hours_ago", "sla_last_reminder_at_hours") and v is not None}
        return out

    assets_json = json.dumps(assets, indent=2, ensure_ascii=False)

    rep_lines: list[str] = []
    for r in reports:
        base_obj = fmt_report_ts(r)
        raw_js = json.dumps(base_obj, indent=4, ensure_ascii=False)
        # Remove closing } to inject dynamic hoursAgo timestamps cleanly
        assert raw_js.endswith("}")
        extra = f",\n    created_at: hoursAgo({r['created_hours_ago']}),\n    updated_at: hoursAgo({r['updated_hours_ago']})"
        if r.get("sla_last_reminder_at_hours") is not None:
            extra = f",\n    sla_last_reminder_at: hoursAgo({r['sla_last_reminder_at_hours']})" + extra
        rep_lines.append("  " + raw_js[:-1].replace("\n", "\n  ") + extra + "\n  }")

    ev_lines: list[str] = []
    for ev in evidences:
        base_ev = {k: v for k, v in ev.items() if k != "hours_ago" and v != ""}
        raw_js = json.dumps(base_ev, indent=4, ensure_ascii=False)
        assert raw_js.endswith("}")
        extra = f",\n    created_at: hoursAgo({ev['hours_ago']})"
        ev_lines.append("  " + raw_js[:-1].replace("\n", "\n  ") + extra + "\n  }")

    com_lines: list[str] = []
    for cm in comments:
        base_cm = {k: v for k, v in cm.items() if k != "hours_ago"}
        raw_js = json.dumps(base_cm, indent=4, ensure_ascii=False)
        assert raw_js.endswith("}")
        extra = f",\n    created_at: hoursAgo({cm['hours_ago']})"
        com_lines.append("  " + raw_js[:-1].replace("\n", "\n  ") + extra + "\n  }")

    constants_ts = f"""import {{
  Asset,
  CaseComment,
  EarlyWarningAlert,
  Evidence,
  Report,
  RiskConsequence,
  RiskLevel,
  RiskLikelihood,
  RoleInfo,
  SlaInfo,
  UserRole,
}} from '@/types/synqra';
import {{ CDU11_SYSTEMIC_PATTERNS, COMPANY_UMBRELLA }} from '@/lib/cduBalonganKnowledge';

export {{ COMPANY_UMBRELLA }};

export const ROLES: Record<UserRole, RoleInfo> = {{
  frontline_omi: {{
    key: 'frontline_omi',
    name: 'Dedi Kusnadi',
    roleTitle: 'Teknisi Lapangan (Frontline OMI)',
    shortRole: 'Frontline OMI',
    department: 'Operasi & Mekanik Unit 11 CDU · PT Pertamina RU VI Balongan',
    email: 'dedi.kusnadi@ru6-balongan.demo',
    initials: 'DK',
    scope: [
      'Mekanik & Rotating',
      'Proses & Operasi',
      'Proses & Termal',
      'Proses & Integritas Statik',
      'Instrumentasi & Kontrol',
      'Inspeksi Statik & Korosi',
    ],
  }},
  dept_reviewer: {{
    key: 'dept_reviewer',
    name: 'Ir. Agus Wijaya',
    roleTitle: 'Reviewer Departemen (Supervisor)',
    shortRole: 'Reviewer Dept.',
    department: 'Reliability & Engineering Unit 11 CDU · RU VI Balongan',
    email: 'agus.wijaya@ru6-balongan.demo',
    initials: 'AW',
    scope: [
      'Mekanik & Rotating',
      'Proses & Operasi',
      'Proses & Termal',
      'Proses & Integritas Statik',
      'Instrumentasi & Kontrol',
      'Inspeksi Statik & Korosi',
    ],
  }},
  hse_validator: {{
    key: 'hse_validator',
    name: 'Dr. Rina Suryani',
    roleTitle: 'HSE & Pakar Validator',
    shortRole: 'HSE Validator',
    department: 'HSE & Process Safety · PT Pertamina RU VI Balongan',
    email: 'rina.suryani@ru6-balongan.demo',
    initials: 'RS',
    scope: [
      'Mekanik & Rotating',
      'Proses & Operasi',
      'Proses & Termal',
      'Proses & Integritas Statik',
      'Instrumentasi & Kontrol',
      'Inspeksi Statik & Korosi',
      'HSE & Process Safety',
    ],
  }},
}};

export const INITIAL_ASSETS: Asset[] = {assets_json};

export function calculateSla(dateStr: string): SlaInfo {{
  const parsed = new Date(dateStr).getTime();
  const now = Date.now();
  const diffHours = Number.isNaN(parsed)
    ? 0
    : Math.max(0, Math.floor((now - parsed) / (1000 * 60 * 60)));

  if (diffHours < 24) {{
    return {{
      level: 'green',
      hoursElapsed: diffHours,
      label: `${{diffHours}} jam lalu · SLA Normal`,
      shortLabel: `${{diffHours}}j · Normal`,
      isOverdue: false,
    }};
  }}

  if (diffHours <= 48) {{
    return {{
      level: 'yellow',
      hoursElapsed: diffHours,
      label: `${{diffHours}} jam lalu · Segera Cek`,
      shortLabel: `${{diffHours}}j · Segera Cek`,
      isOverdue: false,
    }};
  }}

  return {{
    level: 'red',
    hoursElapsed: diffHours,
    label: `${{diffHours}} jam lalu · Overdue`,
    shortLabel: `${{diffHours}}j · Overdue`,
    isOverdue: true,
  }};
}}

export function computeRiskLevel(
  consequence: RiskConsequence,
  likelihood: RiskLikelihood
): RiskLevel {{
  const cMap: Record<RiskConsequence, number> = {{
    Minor: 1,
    Moderate: 2,
    Major: 3,
    Catastrophic: 4,
  }};
  const lMap: Record<RiskLikelihood, number> = {{
    Rare: 1,
    Possible: 2,
    Likely: 3,
    Frequent: 4,
  }};
  const score = cMap[consequence] * lMap[likelihood];
  if (score >= 12) return 'CRITICAL';
  if (score >= 6) return 'HIGH';
  if (score >= 3) return 'MEDIUM';
  return 'LOW';
}}

export function detectEarlyWarnings(
  reports: Report[],
  assets: Asset[]
): EarlyWarningAlert[] {{
  const fourteenDaysMs = 14 * 24 * 3600 * 1000;
  const now = Date.now();
  const warnings: EarlyWarningAlert[] = [];

  // 1. Deteksi laporan berulang pada aset yang sama (misal laporan baru Lapor Cepat pada tag yang sudah punya kasus)
  for (const asset of assets) {{
    const recentActive = reports.filter((r) => {{
      const created = new Date(r.created_at).getTime();
      const within14Days = !Number.isNaN(created) && now - created <= fourteenDaysMs;
      return r.asset_id === asset.id && r.status !== 'VERIFIED' && within14Days;
    }});

    if (recentActive.length >= 2) {{
      const msg = `Terdeteksi ${{recentActive.length}} laporan aktif dalam 14 hari terakhir pada ${{asset.id}}. Disarankan evaluasi pola kegagalan berulang lintas shift.`;
      warnings.push({{
        id: `ew-local-${{asset.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}}`,
        assetId: asset.id,
        severity: recentActive.length >= 3 ? 'KRITIS' : 'WASPADA',
        patternTitle: `Anomali Berulang pada ${{asset.id}}`,
        frequencyLabel: `${{recentActive.length}} laporan aktif dalam 14 hari`,
        summary: msg,
        recommendedAction: `Jadwalkan inspeksi gabungan lintas shift untuk memverifikasi akar masalah pada ${{asset.id}}.`,
        relatedReportIds: recentActive.map((r) => r.id),
        assetName: asset.name,
        recentCount: recentActive.length,
        message: msg,
      }});
    }}
  }}

  // 2. Deteksi 9 pola sistemik lintas-aset Unit 11 CDU Balongan
  const reportById = new Map(reports.map((r) => [r.id, r]));
  for (const pat of CDU11_SYSTEMIC_PATTERNS) {{
    const matched = pat.relatedCaseIds
      .map((id) => reportById.get(id))
      .filter((r): r is Report => Boolean(r));
    const activeMatched = matched.filter((r) => r.status !== 'VERIFIED');
    if (matched.length >= 2 && activeMatched.length >= 1) {{
      warnings.push({{
        id: pat.id,
        assetId: pat.primaryAssetId,
        severity: pat.severity,
        patternTitle: pat.title,
        frequencyLabel: `${{matched.length}} kasus lintas-${{pat.affectedTags.length}} aset`,
        summary: pat.mechanismSummary,
        recommendedAction: pat.recommendedAction,
        relatedReportIds: matched.map((r) => r.id),
        assetName: pat.affectedTags.slice(0, 3).join(', '),
        recentCount: matched.length,
        message: pat.mechanismSummary,
        isCrossAssetPattern: true,
        affectedAssetIds: pat.affectedTags,
      }});
    }}
  }}

  return warnings;
}}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();

export const INITIAL_REPORTS: Report[] = [
{",".join(rep_lines)}
];

export const INITIAL_EVIDENCES: Evidence[] = [
{",".join(ev_lines)}
];

export const INITIAL_COMMENTS: CaseComment[] = [
{",".join(com_lines)}
];
"""
    with open(CONSTANTS_OUT, "w", encoding="utf-8") as f:
        f.write(constants_ts)

    # 3. Emit scripts/seed.mjs (full 66 Unit 11 CDU seed)
    seed_assets = [
        {
            "id": a["id"],
            "name": a["name"],
            "type": a["type"],
            "area": a["area"],
            "description": a["description"],
        }
        for a in assets
    ]
    seed_reports_code_items: list[str] = []
    for r in reports:
        sr = {
            "id": r["id"],
            "title": r["title"],
            "asset_id": r["asset_id"],
            "status": r["status"],
            "identitas_alat": r["identitas_alat"],
            "gejala": r["gejala"],
            "kondisi_operasi": r["kondisi_operasi"],
            "pemeriksaan_awal": r["pemeriksaan_awal"],
            "praduga_penyebab": r["praduga_penyebab"],
            "usulan_tindakan": r["usulan_tindakan"],
            "verifikasi": r["verifikasi"],
            "risk_level": r["risk_level"],
            "risk_consequence": r["risk_consequence"],
            "risk_likelihood": r["risk_likelihood"],
            "risk_summary": r["risk_summary"],
            "capa_corrective": r["capa_corrective"],
            "capa_preventive": r["capa_preventive"],
            "capa_target_date": r["capa_target_date"] or None,
            "capa_pic": r["capa_pic"],
            "description": r["description"],
            "reporter_name": r["reporter_name"],
            "reporter_role": r["reporter_role"],
            "dept": r["dept"],
            "evidence_note": r["evidence_note"],
            "image_url": r["image_url"],
            "verified_by": r["verified_by"],
            "finding_type": r["finding_type"],
            "urgency": r["urgency"],
            "sla_reminder_count": r["sla_reminder_count"],
        }
        raw_js = json.dumps(sr, indent=4, ensure_ascii=False)
        extra = f",\n    created_at: hoursAgo({r['created_hours_ago']}),\n    updated_at: hoursAgo({r['updated_hours_ago']})"
        seed_reports_code_items.append("  " + raw_js[:-1].replace("\n", "\n  ") + extra + "\n  }")

    seed_ev_items: list[str] = []
    for ev in evidences:
        se = {
            "report_id": ev["report_id"],
            "file_name": ev["file_name"],
            "storage_path": ev["storage_path"],
            "mime_type": ev["mime_type"],
            "caption": ev["caption"],
            "uploaded_by": ev["uploaded_by"],
        }
        raw_js = json.dumps(se, indent=4, ensure_ascii=False)
        extra = f",\n    created_at: hoursAgo({ev['hours_ago']})"
        seed_ev_items.append("  " + raw_js[:-1].replace("\n", "\n  ") + extra + "\n  }")

    seed_com_items: list[str] = []
    for cm in comments:
        sc = {
            "report_id": cm["report_id"],
            "author_name": cm["author_name"],
            "author_role": cm["author_role"],
            "comment": cm["comment"],
            "is_revision_request": cm["is_revision_request"],
        }
        raw_js = json.dumps(sc, indent=4, ensure_ascii=False)
        extra = f",\n    created_at: hoursAgo({cm['hours_ago']})"
        seed_com_items.append("  " + raw_js[:-1].replace("\n", "\n  ") + extra + "\n  }")

    seed_mjs = f"""/**
 * SYNQRA DATABASE SEED SCRIPT — UNIT 11 (CDU) PT PERTAMINA RU VI BALONGAN
 * Memuat 66 Kode Tag peralatan nyata, 66 kasus terstruktur, bukti fisik & diskusi 2-arah.
 */

import {{ createClient }} from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import {{ fileURLToPath }} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {{
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {{
    const lines = fs.readFileSync(envPath, 'utf8').split('\\n');
    for (const line of lines) {{
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0) {{
        const val = vals.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {{
          process.env[key.trim()] = val;
        }}
      }}
    }}
  }}
}}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')
);

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

const SEED_ASSETS = {json.dumps(seed_assets, indent=2, ensure_ascii=False)};

const SEED_REPORTS = [
{",".join(seed_reports_code_items)}
];

const SEED_EVIDENCES = [
{",".join(seed_ev_items)}
];

const SEED_COMMENTS = [
{",".join(seed_com_items)}
];

async function runSeed() {{
  console.log('----------------------------------------------------');
  console.log('SYNQRA SEED ENGINE - UNIT 11 CDU RU VI BALONGAN');
  console.log('----------------------------------------------------');

  if (!isConfigured) {{
    console.log('Supabase URL / Anon Key belum dikonfigurasikan di .env.local.');
    console.log('66 aset & 66 kasus Unit 11 CDU Balongan tersedia langsung di in-memory app & supabase/seed.sql.');
    process.exit(0);
  }}

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log(`Menghubungkan ke Supabase: ${{supabaseUrl}}`);

  const {{ error: assetErr }} = await supabase.from('assets').upsert(SEED_ASSETS, {{ onConflict: 'id' }});
  console.log(assetErr ? `Gagal seed assets: ${{assetErr.message}}` : `${{SEED_ASSETS.length}} aset Unit 11 CDU di-upsert.`);

  const {{ error: repErr }} = await supabase.from('reports').upsert(SEED_REPORTS, {{ onConflict: 'id' }});
  console.log(repErr ? `Gagal seed reports: ${{repErr.message}}` : `${{SEED_REPORTS.length}} laporan Unit 11 CDU di-upsert.`);

  const {{ data: existingEv }} = await supabase.from('evidences').select('storage_path');
  const existingEvPaths = new Set((existingEv || []).map((row) => row.storage_path));
  const missingEvs = SEED_EVIDENCES.filter((ev) => !existingEvPaths.has(ev.storage_path));
  if (missingEvs.length > 0) {{
    const {{ error: evErr }} = await supabase.from('evidences').insert(missingEvs);
    console.log(evErr ? `Catatan evidences: ${{evErr.message}}` : `${{missingEvs.length}} bukti fisik baru ditambahkan (total ${{SEED_EVIDENCES.length}}).`);
  }} else {{
    console.log(`Seluruh ${{SEED_EVIDENCES.length}} bukti fisik sudah tersedia.`);
  }}

  const {{ count: existingCommentCount }} = await supabase.from('case_comments').select('*', {{ count: 'exact', head: true }});
  if (!existingCommentCount || existingCommentCount === 0) {{
    const {{ error: comErr }} = await supabase.from('case_comments').insert(SEED_COMMENTS);
    console.log(comErr ? `Catatan comments: ${{comErr.message}}` : `${{SEED_COMMENTS.length}} komentar diskusi ditambahkan.`);
  }} else {{
    console.log(`Tabel case_comments sudah berisi ${{existingCommentCount}} komentar (lewati insert ulang).`);
  }}
}}

runSeed().catch((err) => {{
  console.error('Fatal error during seed:', err);
  process.exit(1);
}});
"""
    with open(SEED_JS_OUT, "w", encoding="utf-8") as f:
        f.write(seed_mjs)

    # 4. Emit supabase/seed.sql
    os.makedirs(os.path.dirname(SEED_SQL_OUT), exist_ok=True)
    sql_lines: list[str] = [
        "-- SYNQRA Seed SQL: Unit 11 (CDU) PT Pertamina RU VI Balongan",
        "-- 66 Asset Tags, 66 Reports, Evidences & Case Discussions",
        "",
    ]
    for a in seed_assets:
        sql_lines.append(
            "INSERT INTO assets (id, name, type, area, description) VALUES ("
            + ", ".join([sql_str(a["id"]), sql_str(a["name"]), sql_str(a["type"]), sql_str(a["area"]), sql_str(a["description"])])
            + ") ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, area = EXCLUDED.area, description = EXCLUDED.description;"
        )
    sql_lines.append("")
    for r in reports:
        cols = [
            "id", "title", "asset_id", "status", "identitas_alat", "gejala",
            "kondisi_operasi", "pemeriksaan_awal", "praduga_penyebab", "usulan_tindakan",
            "verifikasi", "risk_level", "risk_consequence", "risk_likelihood", "risk_summary",
            "capa_corrective", "capa_preventive", "capa_target_date", "capa_pic",
            "description", "reporter_name", "reporter_role", "dept", "evidence_note",
            "image_url", "verified_by", "finding_type", "urgency", "sla_reminder_count",
        ]
        vals = [
            sql_str(r["id"]), sql_str(r["title"]), sql_str(r["asset_id"]), sql_str(r["status"]),
            sql_str(r["identitas_alat"]), sql_str(r["gejala"]), sql_str(r["kondisi_operasi"]),
            sql_str(r["pemeriksaan_awal"]), sql_str(r["praduga_penyebab"]), sql_str(r["usulan_tindakan"]),
            sql_str(r["verifikasi"]), sql_str(r["risk_level"]), sql_str(r["risk_consequence"]),
            sql_str(r["risk_likelihood"]), sql_str(r["risk_summary"]), sql_str(r["capa_corrective"]),
            sql_str(r["capa_preventive"]), sql_str(r["capa_target_date"] or None), sql_str(r["capa_pic"]),
            sql_str(r["description"]), sql_str(r["reporter_name"]), sql_str(r["reporter_role"]),
            sql_str(r["dept"]), sql_str(r["evidence_note"]), sql_str(r["image_url"]),
            sql_str(r["verified_by"]), sql_str(r["finding_type"]), sql_str(r["urgency"]),
            str(r["sla_reminder_count"]),
        ]
        sql_lines.append(
            f"INSERT INTO reports ({', '.join(cols)}) VALUES ({', '.join(vals)}) ON CONFLICT (id) DO NOTHING;"
        )
    sql_lines.append("")
    for ev in evidences:
        sql_lines.append(
            "INSERT INTO evidences (report_id, file_name, storage_path, mime_type, caption, uploaded_by) VALUES ("
            + ", ".join([
                sql_str(ev["report_id"]),
                sql_str(ev["file_name"]),
                sql_str(ev["storage_path"]),
                sql_str(ev["mime_type"]),
                sql_str(ev["caption"]),
                sql_str(ev["uploaded_by"]),
            ])
            + ");"
        )
    sql_lines.append("")
    for cm in comments:
        sql_lines.append(
            "INSERT INTO case_comments (report_id, author_name, author_role, comment, is_revision_request) VALUES ("
            + ", ".join([
                sql_str(cm["report_id"]),
                sql_str(cm["author_name"]),
                sql_str(cm["author_role"]),
                sql_str(cm["comment"]),
                "TRUE" if cm["is_revision_request"] else "FALSE",
            ])
            + ");"
        )

    with open(SEED_SQL_OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines) + "\n")

    print(
        f"Generated OK: {len(assets)} assets, {len(reports)} reports, "
        f"{len(evidences)} evidences, {len(comments)} comments."
    )


if __name__ == "__main__":
    main()
