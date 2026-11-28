import {
  Asset,
  CaseSimulationPayload,
  Evidence,
  PointEventType,
  PointLedgerEntry,
  PointTierKey,
  Report,
  ShiftGroupName,
  SimulationDisciplineFilter,
  SimulationOption,
  SimulationStepItem,
  UserRole,
  WorkerLearningState,
} from '@/types/synqra';
import { INITIAL_ASSETS, INITIAL_REPORTS, ROLES } from '@/lib/constants';
import { JOURNAL_IMAGES_BY_ID, resolveBuiltInEvidenceUrl } from '@/lib/mediaAssets';

const LEARNING_STORAGE_KEY = 'synqra_v4_balongan_learning';

export interface PointTierMeta {
  key: PointTierKey;
  label: string;
  minPoints: number;
  nextThreshold: number | null;
  nextLabel: string | null;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  rewardSummary: string;
  careerBenefit: string;
}

export const POINT_TIERS: PointTierMeta[] = [
  {
    key: 'pemula',
    label: 'Pemula',
    minPoints: 0,
    nextThreshold: 250,
    nextLabel: 'Aktif',
    badgeColor: 'var(--info)',
    badgeBg: 'var(--info-bg)',
    badgeBorder: 'var(--info-border)',
    rewardSummary: 'Umpan balik diagnostik personal & rekomendasi materi kasus Unit 11 CDU.',
    careerBenefit: 'Akumulasi jam belajar mikro (JPL) tercatat otomatis pada portofolio teknisi.',
  },
  {
    key: 'aktif',
    label: 'Aktif',
    minPoints: 250,
    nextThreshold: 400,
    nextLabel: 'Teladan',
    badgeColor: 'var(--cyan-dark)',
    badgeBg: 'var(--cyan-pale)',
    badgeBorder: 'var(--cyan)',
    rewardSummary: 'Rekognisi pada Toolbox Briefing regu & kredit otomatis Leading Indicator K3.',
    careerBenefit: 'Memenuhi target kuartalan keaktifan PEKA & jam pembelajaran keselamatan.',
  },
  {
    key: 'teladan',
    label: 'Teladan',
    minPoints: 400,
    nextThreshold: 520,
    nextLabel: 'Safety Champion',
    badgeColor: 'var(--amber)',
    badgeBg: 'var(--amber-bg)',
    badgeBorder: 'var(--amber-border)',
    rewardSummary: 'Sertifikat Apresiasi Unit 11 & Tiket Prioritas Antrean Sertifikasi Teknis.',
    careerBenefit: 'Prioritas pelatihan eksternal (API 510/570, BNSP, ISO Vibration) & skor CSMS.',
  },
  {
    key: 'safety_champion',
    label: 'Safety Champion',
    minPoints: 520,
    nextThreshold: null,
    nextLabel: null,
    badgeColor: 'var(--green)',
    badgeBg: 'var(--green-bg)',
    badgeBorder: 'var(--green-border)',
    rewardSummary: 'Penghargaan Bulanan Grand Safety Talk (Saldo Koperasi / Voucher Operasional).',
    careerBenefit: 'Nilai tambah penuh penilaian kinerja (KPI) K3 tahunan & portofolio ahli utama.',
  },
];

export const ROLE_SHIFT_MAP: Record<UserRole, ShiftGroupName> = {
  frontline_omi: 'Regu Shift A',
  dept_reviewer: 'Regu Shift B',
  hse_validator: 'Regu Shift A',
};

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTierForPoints(points: number): PointTierMeta {
  for (let i = POINT_TIERS.length - 1; i >= 0; i -= 1) {
    if (points >= POINT_TIERS[i].minPoints) {
      return POINT_TIERS[i];
    }
  }
  return POINT_TIERS[0];
}

export function createInitialLearningState(): WorkerLearningState {
  const hoursAgoIso = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();

  return {
    pointsByRole: {
      frontline_omi: 382,
      dept_reviewer: 425,
      hse_validator: 470,
    },
    ledger: [
      {
        id: 'pt-seed-1',
        userRole: 'frontline_omi',
        userName: ROLES.frontline_omi.name,
        shiftGroup: 'Regu Shift A',
        eventType: 'report_verified',
        points: 10,
        label: 'Bonus Mutu Bukti: Laporan CDU11-P01 disahkan Validator HSE',
        referenceId: 'CDU11-P01',
        createdAt: hoursAgoIso(18),
      },
      {
        id: 'pt-seed-2',
        userRole: 'frontline_omi',
        userName: ROLES.frontline_omi.name,
        shiftGroup: 'Regu Shift A',
        eventType: 'case_simulation',
        points: 13,
        label: 'Simulasi Kasus 5/5 Tepat: Kavitasi Suction 11-P-101 A/B',
        referenceId: 'CDU11-P01',
        createdAt: hoursAgoIso(26),
      },
      {
        id: 'pt-seed-3',
        userRole: 'frontline_omi',
        userName: ROLES.frontline_omi.name,
        shiftGroup: 'Regu Shift A',
        eventType: 'report_submitted',
        points: 5,
        label: 'Laporan Temuan Lengkap & Bukti Awal: 11-F-101 Pass 3',
        referenceId: 'CDU11-F01',
        createdAt: hoursAgoIso(34),
      },
      {
        id: 'pt-seed-4',
        userRole: 'dept_reviewer',
        userName: ROLES.dept_reviewer.name,
        shiftGroup: 'Regu Shift B',
        eventType: 'case_simulation',
        points: 11,
        label: 'Simulasi Kasus 4/5 Tepat: Fouling Hot Preheater 11-E-107',
        referenceId: 'CDU11-E10',
        createdAt: hoursAgoIso(40),
      },
      {
        id: 'pt-seed-5',
        userRole: 'hse_validator',
        userName: ROLES.hse_validator.name,
        shiftGroup: 'Regu Shift A',
        eventType: 'briefing_read',
        points: 5,
        label: 'Konfirmasi Briefing Awal Shift & Prioritas Risiko Unit 11',
        createdAt: hoursAgoIso(46),
      },
    ],
    briefingReadDateByRole: {},
    briefingCheckDateByRole: {},
    completedSimulationsByRole: {
      frontline_omi: ['CDU11-P01'],
      dept_reviewer: ['CDU11-E10'],
      hse_validator: ['CDU11-C02'],
    },
    dailyCounters: {},
  };
}

export function loadLearningState(): WorkerLearningState {
  if (typeof window === 'undefined') {
    return createInitialLearningState();
  }
  try {
    const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return createInitialLearningState();
    const parsed = JSON.parse(raw) as Partial<WorkerLearningState>;
    const base = createInitialLearningState();
    return {
      pointsByRole: { ...base.pointsByRole, ...(parsed.pointsByRole || {}) },
      ledger: Array.isArray(parsed.ledger) && parsed.ledger.length > 0 ? parsed.ledger : base.ledger,
      briefingReadDateByRole: parsed.briefingReadDateByRole || {},
      briefingCheckDateByRole: parsed.briefingCheckDateByRole || {},
      completedSimulationsByRole: {
        ...base.completedSimulationsByRole,
        ...(parsed.completedSimulationsByRole || {}),
      },
      dailyCounters: parsed.dailyCounters || {},
    };
  } catch {
    return createInitialLearningState();
  }
}

export function saveLearningState(state: WorkerLearningState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

export function resetLearningState(): WorkerLearningState {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(LEARNING_STORAGE_KEY);
  }
  return createInitialLearningState();
}

export interface AwardPointResult {
  nextState: WorkerLearningState;
  awardedPoints: number;
  cappedReason?: string;
}

export function awardWorkerPoints(
  prev: WorkerLearningState,
  params: {
    userRole: UserRole;
    eventType: PointEventType;
    points: number;
    label: string;
    referenceId?: string;
    dailyCapCount?: number;
  }
): AwardPointResult {
  const today = getTodayKey();
  const safePoints = Math.max(0, Math.round(params.points));
  if (safePoints === 0) {
    return { nextState: prev, awardedPoints: 0 };
  }

  const counterKey = `${today}:${params.userRole}:${params.eventType}`;
  const usedCount = prev.dailyCounters[counterKey] || 0;

  if (typeof params.dailyCapCount === 'number' && usedCount >= params.dailyCapCount) {
    return {
      nextState: prev,
      awardedPoints: 0,
      cappedReason: 'Kuota poin harian untuk aktivitas ini sudah terpenuhi hari ini.',
    };
  }

  const roleInfo = ROLES[params.userRole];
  const entry: PointLedgerEntry = {
    id: `pt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userRole: params.userRole,
    userName: roleInfo.name,
    shiftGroup: ROLE_SHIFT_MAP[params.userRole],
    eventType: params.eventType,
    points: safePoints,
    label: params.label,
    referenceId: params.referenceId,
    createdAt: new Date().toISOString(),
  };

  const nextPoints = (prev.pointsByRole[params.userRole] || 0) + safePoints;
  const nextCompleted =
    params.eventType === 'case_simulation' && params.referenceId
      ? {
          ...prev.completedSimulationsByRole,
          [params.userRole]: Array.from(
            new Set([...(prev.completedSimulationsByRole[params.userRole] || []), params.referenceId])
          ),
        }
      : prev.completedSimulationsByRole;

  const nextState: WorkerLearningState = {
    ...prev,
    pointsByRole: {
      ...prev.pointsByRole,
      [params.userRole]: nextPoints,
    },
    ledger: [entry, ...prev.ledger].slice(0, 30),
    briefingReadDateByRole:
      params.eventType === 'briefing_read'
        ? { ...prev.briefingReadDateByRole, [params.userRole]: today }
        : prev.briefingReadDateByRole,
    briefingCheckDateByRole:
      params.eventType === 'briefing_check'
        ? { ...prev.briefingCheckDateByRole, [params.userRole]: today }
        : prev.briefingCheckDateByRole,
    completedSimulationsByRole: nextCompleted,
    dailyCounters: {
      ...prev.dailyCounters,
      [counterKey]: usedCount + 1,
    },
  };

  return { nextState, awardedPoints: safePoints };
}

export interface ShiftStandingItem {
  shiftName: ShiftGroupName;
  averagePoints: number;
  memberCount: number;
  isCurrentUserShift: boolean;
}

export function computeShiftStandings(
  state: WorkerLearningState,
  currentRole: UserRole
): ShiftStandingItem[] {
  const userShift = ROLE_SHIFT_MAP[currentRole];
  const shiftAExtra = Math.round(
    ((state.pointsByRole.frontline_omi - 382) + (state.pointsByRole.hse_validator - 470)) / 4
  );
  const shiftBExtra = Math.round((state.pointsByRole.dept_reviewer - 425) / 4);

  const raw: ShiftStandingItem[] = [
    {
      shiftName: 'Regu Shift A',
      averagePoints: 412 + shiftAExtra,
      memberCount: 14,
      isCurrentUserShift: userShift === 'Regu Shift A',
    },
    {
      shiftName: 'Regu Shift B',
      averagePoints: 396 + shiftBExtra,
      memberCount: 14,
      isCurrentUserShift: userShift === 'Regu Shift B',
    },
    {
      shiftName: 'Regu Shift C',
      averagePoints: 374,
      memberCount: 13,
      isCurrentUserShift: userShift === 'Regu Shift C',
    },
    {
      shiftName: 'Regu Shift D',
      averagePoints: 358,
      memberCount: 13,
      isCurrentUserShift: userShift === 'Regu Shift D',
    },
  ];

  return raw.sort((a, b) => b.averagePoints - a.averagePoints);
}

export function filterVerifiedCasesByDiscipline(
  reports: Report[],
  assets: Asset[],
  discipline: SimulationDisciplineFilter
): Report[] {
  const assetById = new Map(assets.map((a) => [a.id, a]));
  const baseVerified = reports.filter((r) => r.status === 'VERIFIED');
  const pool =
    baseVerified.length > 0
      ? baseVerified
      : INITIAL_REPORTS.filter((r) => r.status === 'VERIFIED');

  if (discipline === 'all') return pool;

  const filtered = pool.filter((r) => {
    const cat = assetById.get(r.asset_id)?.categoryCode;
    if (discipline === 'rotating') return cat === 'P';
    if (discipline === 'instrument') return cat === 'I';
    if (discipline === 'static') return cat === 'C' || cat === 'F' || cat === 'E' || cat === 'V';
    return true;
  });

  return filtered.length > 0 ? filtered : pool;
}

function deterministicShuffle(
  correctText: string,
  distractors: string[],
  seedKey: string
): SimulationOption[] {
  const cleanCorrect = correctText.trim();
  const uniqueDistractors: string[] = [];

  for (const d of distractors) {
    const trimmed = d.trim();
    if (trimmed && trimmed !== cleanCorrect && !uniqueDistractors.includes(trimmed)) {
      uniqueDistractors.push(trimmed);
    }
    if (uniqueDistractors.length >= 2) break;
  }

  const fallbackOptions = [
    'Gangguan transien sinyal transmiter lokal tanpa perubahan kondisi fisik peralatan.',
    'Fluktuasi beban listrik jaringan utilitas luar yang tidak berkaitan dengan proses CDU.',
  ];
  let fbIdx = 0;
  while (uniqueDistractors.length < 2) {
    uniqueDistractors.push(fallbackOptions[fbIdx % fallbackOptions.length]);
    fbIdx += 1;
  }

  const raw: SimulationOption[] = [
    { text: cleanCorrect, isCorrect: true },
    { text: uniqueDistractors[0], isCorrect: false },
    { text: uniqueDistractors[1], isCorrect: false },
  ];

  const seed = seedKey.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const shift = seed % raw.length;
  return raw.map((_, idx) => raw[(idx + shift) % raw.length]);
}

function truncateSentence(text: string, maxChars = 210): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars);
  const lastPeriod = cut.lastIndexOf('.');
  if (lastPeriod > 90) return cut.slice(0, lastPeriod + 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : maxChars)}...`;
}

export function resolveReportVisualEvidence(
  report: Report,
  evidences: Evidence[]
): { imageUrl?: string; caption?: string } {
  const reportEvidences = evidences.filter((e) => e.report_id === report.id);
  for (const ev of reportEvidences) {
    const url = ev.public_url || resolveBuiltInEvidenceUrl(ev);
    if (url) {
      return {
        imageUrl: url,
        caption: ev.caption || ev.source_attribution || ev.file_name,
      };
    }
  }

  if (report.image_url) {
    return {
      imageUrl: report.image_url,
      caption: report.evidence_note,
    };
  }

  const firstJournalId = report.journal_image_ids?.[0];
  if (firstJournalId && JOURNAL_IMAGES_BY_ID[firstJournalId]) {
    return {
      imageUrl: JOURNAL_IMAGES_BY_ID[firstJournalId],
      caption: report.evidence_note || `Bukti literatur terindeks (${firstJournalId})`,
    };
  }

  return {};
}

export function buildLocalCaseSimulation(
  targetCase: Report,
  allReports: Report[] = INITIAL_REPORTS,
  allAssets: Asset[] = INITIAL_ASSETS,
  allEvidences: Evidence[] = []
): CaseSimulationPayload {
  const asset =
    allAssets.find((a) => a.id === targetCase.asset_id) ||
    INITIAL_ASSETS.find((a) => a.id === targetCase.asset_id);
  const assetName = asset?.name || targetCase.identitas_alat;
  const peers = [
    ...allReports.filter((r) => r.id !== targetCase.id && r.status === 'VERIFIED'),
    ...INITIAL_REPORTS.filter((r) => r.id !== targetCase.id),
  ];

  const sameDeptFirst = [...peers].sort((a, b) => {
    const aSame = a.dept === targetCase.dept ? 0 : 1;
    const bSame = b.dept === targetCase.dept ? 0 : 1;
    return aSame - bSame;
  });

  const visual = resolveReportVisualEvidence(targetCase, allEvidences);
  const correctiveText = targetCase.capa_corrective || targetCase.usulan_tindakan;
  const refsText =
    targetCase.literature_refs && targetCase.literature_refs.length > 0
      ? ` (rujukan ${targetCase.literature_refs.join(', ')})`
      : '';

  const steps: SimulationStepItem[] = [
    {
      stepNumber: 1,
      entityLabel: '1. Identifikasi Gejala',
      question: `Pada kondisi operasi normal ${targetCase.asset_id} (${assetName}), gejala penyimpangan mana yang tercatat sebagai pemicu awal kasus [${targetCase.id}]?`,
      options: deterministicShuffle(
        truncateSentence(targetCase.gejala),
        sameDeptFirst.map((p) => truncateSentence(p.gejala)),
        `${targetCase.id}-step-1`
      ),
      coachExplanation: `Pada kasus terverifikasi [${targetCase.id}], gejala kunci pada ${targetCase.asset_id} adalah: ${truncateSentence(targetCase.gejala, 240)}`,
    },
    {
      stepNumber: 2,
      entityLabel: '2. Pemeriksaan & Bukti',
      question: `Sebelum menetapkan akar masalah pada ${targetCase.asset_id}, pemeriksaan lapangan dan bukti teknis apa yang membuktikan temuan ini?`,
      options: deterministicShuffle(
        truncateSentence(targetCase.pemeriksaan_awal),
        sameDeptFirst.map((p) => truncateSentence(p.pemeriksaan_awal)),
        `${targetCase.id}-step-2`
      ),
      coachExplanation: `Sesuai Aturan R2 (Hard Gate Bukti), kasus [${targetCase.id}] divalidasi melalui: ${truncateSentence(targetCase.pemeriksaan_awal, 240)}`,
    },
    {
      stepNumber: 3,
      entityLabel: '3. Akar Penyebab',
      question: `Berdasarkan bukti fisik tersebut, apa akar penyebab teknis (root cause) yang telah disahkan Validator HSE pada [${targetCase.id}]?`,
      options: deterministicShuffle(
        truncateSentence(targetCase.praduga_penyebab),
        sameDeptFirst.map((p) => truncateSentence(p.praduga_penyebab)),
        `${targetCase.id}-step-3`
      ),
      coachExplanation: `Akar penyebab terverifikasi pada [${targetCase.id}]${refsText}: ${truncateSentence(targetCase.praduga_penyebab, 240)}`,
    },
    {
      stepNumber: 4,
      entityLabel: '4. Tindakan Korektif',
      question: `Langkah perbaikan teknis apa yang paling tepat untuk memitigasi risiko kegagalan berulang pada ${targetCase.asset_id}?`,
      options: deterministicShuffle(
        truncateSentence(correctiveText),
        sameDeptFirst.map((p) => truncateSentence(p.capa_corrective || p.usulan_tindakan)),
        `${targetCase.id}-step-4`
      ),
      coachExplanation: `Rekomendasi tindakan resmi dari pengetahuan terverifikasi [${targetCase.id}]: ${truncateSentence(correctiveText, 240)}`,
    },
    {
      stepNumber: 5,
      entityLabel: '5. Verifikasi Pascaperbaikan',
      question: `Indikator terukur apa yang wajib dipenuhi sebagai kriteria verifikasi pascaperbaikan sebelum kasus [${targetCase.id}] dinyatakan tuntas?`,
      options: deterministicShuffle(
        truncateSentence(targetCase.verifikasi),
        sameDeptFirst
          .filter((p) => !p.verifikasi.toLowerCase().startsWith('menunggu'))
          .map((p) => truncateSentence(p.verifikasi)),
        `${targetCase.id}-step-5`
      ),
      coachExplanation: `Tolok ukur verifikasi pascaperbaikan [${targetCase.id}]: ${truncateSentence(targetCase.verifikasi, 240)}`,
    },
  ];

  return {
    reportId: targetCase.id,
    assetId: targetCase.asset_id,
    assetName,
    caseTitle: targetCase.title,
    disciplineLabel: targetCase.dept,
    kondisiOperasi: targetCase.kondisi_operasi,
    evidenceImageUrl: visual.imageUrl,
    evidenceCaption: visual.caption,
    literatureRefs: targetCase.literature_refs,
    verifiedBy: targetCase.verified_by || ROLES.hse_validator.name,
    steps,
    engine: 'local-fallback',
  };
}
