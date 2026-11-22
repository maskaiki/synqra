import loginHeroOilRigImg from '@/assets/branding/login-hero-oil-rig.webp';
import pumpImg from '@/assets/equipment/centrifugal-pump-p101a.webp';
import heatImg from '@/assets/equipment/heat-exchanger-e201.webp';
import valveImg from '@/assets/equipment/control-valve-fcv301.webp';

import ev001Img from '@/assets/evidences/rep001-p101a-mechanical-seal-leak.webp';
import ev002Img from '@/assets/evidences/rep001-p101a-fft-vibration-spectrum.webp';
import ev003Img from '@/assets/evidences/rep002-e201-borescope-tube-fouling.webp';
import ev004Img from '@/assets/evidences/rep002-e201-delta-t-pasca-cleaning.webp';
import ev005Img from '@/assets/evidences/rep003-fcv301-stroke-response-lag.webp';
import ev006Img from '@/assets/evidences/rep006-fcv301-linkage-transmitter.webp';

export interface MediaAssetEntry {
  src: string;
  width: number;
  height: number;
}

export interface EquipmentMediaEntry extends MediaAssetEntry {
  alt: string;
}

export const BRAND_MEDIA = {
  loginHeroOilRig: {
    src: loginHeroOilRigImg.src,
    width: loginHeroOilRigImg.width,
    height: loginHeroOilRigImg.height,
    alt: 'Latar belakang kilang dan pompa angguk migas saat senja',
  },
};

export const EQUIPMENT_MEDIA: Record<string, EquipmentMediaEntry> = {
  pump: {
    src: pumpImg.src,
    width: pumpImg.width,
    height: pumpImg.height,
    alt: 'Pompa Sentrifugal P-101A',
  },
  heat: {
    src: heatImg.src,
    width: heatImg.width,
    height: heatImg.height,
    alt: 'Heat Exchanger E-201',
  },
  valve: {
    src: valveImg.src,
    width: valveImg.width,
    height: valveImg.height,
    alt: 'Control Valve FCV-301',
  },
};

export const EVIDENCE_MEDIA_BY_ID: Record<string, MediaAssetEntry> = {
  'ev-001': { src: ev001Img.src, width: ev001Img.width, height: ev001Img.height },
  'ev-002': { src: ev002Img.src, width: ev002Img.width, height: ev002Img.height },
  'ev-003': { src: ev003Img.src, width: ev003Img.width, height: ev003Img.height },
  'ev-004': { src: ev004Img.src, width: ev004Img.width, height: ev004Img.height },
  'ev-005': { src: ev005Img.src, width: ev005Img.width, height: ev005Img.height },
  'ev-006': { src: ev006Img.src, width: ev006Img.width, height: ev006Img.height },
};

export const EVIDENCE_MEDIA_BY_STORAGE_PATH: Record<string, string> = {
  'evidences/REP-001/seal_leak.jpg': ev001Img.src,
  'evidences/REP-001/fft_log.pdf': ev002Img.src,
  'evidences/REP-002/borescope.jpg': ev003Img.src,
  'evidences/REP-002/delta_t_report.pdf': ev004Img.src,
  'evidences/REP-003/stroke_lag.png': ev005Img.src,
  'evidences/REP-006/linkage.jpg': ev006Img.src,
};

/**
 * Mengembalikan URL asset WebP bawaan jika bukti berasal dari katalog demo/seed.
 */
export function resolveBuiltInEvidenceUrl(ev: {
  id?: string;
  storage_path?: string;
}): string | undefined {
  if (ev.id && EVIDENCE_MEDIA_BY_ID[ev.id]) {
    return EVIDENCE_MEDIA_BY_ID[ev.id].src;
  }
  if (ev.storage_path && EVIDENCE_MEDIA_BY_STORAGE_PATH[ev.storage_path]) {
    return EVIDENCE_MEDIA_BY_STORAGE_PATH[ev.storage_path];
  }
  return undefined;
}
