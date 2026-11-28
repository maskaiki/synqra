export type ReportStatus = 'PRADUGA' | 'TRIAGE' | 'INVESTIGATION' | 'VERIFIED';

export type UserRole = 'frontline_omi' | 'dept_reviewer' | 'hse_validator';

export type MainPage =
  | 'home'
  | 'lapor'
  | 'cases'
  | 'case-detail'
  | 'graph'
  | 'tanya'
  | 'analytics';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskConsequence = 'Minor' | 'Moderate' | 'Major' | 'Catastrophic';
export type RiskLikelihood = 'Rare' | 'Possible' | 'Likely' | 'Frequent';

export type AssetCategoryCode = 'C' | 'F' | 'E' | 'V' | 'P' | 'I';

export type AssetRenderType =
  | 'column'
  | 'stripper'
  | 'furnace'
  | 'heat'
  | 'finfan'
  | 'desalter'
  | 'vessel'
  | 'pump'
  | 'valve'
  | 'compressor'
  | 'heater';

export interface SlaInfo {
  level: 'green' | 'yellow' | 'red';
  hoursElapsed: number;
  label: string;
  shortLabel: string;
  isOverdue: boolean;
}

export interface RoleInfo {
  key: UserRole;
  name: string;
  roleTitle: string;
  shortRole: string;
  department: string;
  email: string;
  initials: string;
  scope: string[];
}

export interface Asset {
  id: string;
  name: string;
  subtitle: string;
  type: AssetRenderType;
  categoryCode?: AssetCategoryCode;
  unitCount?: number;
  area: string;
  dept: string;
  description: string;
}

export interface FailureEntities {
  identitas_alat: string;
  gejala: string;
  kondisi_operasi: string;
  pemeriksaan_awal: string;
  praduga_penyebab: string;
  usulan_tindakan: string;
  verifikasi: string;
}

export interface RiskReport {
  risk_level: RiskLevel;
  risk_consequence: RiskConsequence;
  risk_likelihood: RiskLikelihood;
  risk_summary: string;
}

export interface CapaData {
  capa_corrective: string;
  capa_preventive: string;
  capa_target_date: string;
  capa_pic: string;
}

export interface Report extends FailureEntities, Partial<RiskReport>, Partial<CapaData> {
  id: string;
  title: string;
  asset_id: string;
  status: ReportStatus;
  finding_type?: 'Kondisi Abnormal' | 'Potensi Bahaya' | 'Near Miss';
  urgency?: 'Mendesak' | 'Normal';
  description: string;
  sample_narrative?: string;
  reporter_name: string;
  reporter_role: UserRole;
  dept: string;
  evidence_note?: string;
  required_evidence_hint?: string;
  image_url?: string;
  literature_refs?: string[];
  journal_image_ids?: string[];
  fact_vs_scenario_note?: string;
  sla_reminder_count?: number;
  sla_last_reminder_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CaseComment {
  id: string;
  report_id: string;
  author_name: string;
  author_role: UserRole;
  comment: string;
  is_revision_request?: boolean;
  requested_evidence?: string;
  created_at: string;
}

export interface Evidence {
  id: string;
  report_id: string;
  file_name: string;
  storage_path: string;
  mime_type?: string;
  file_size_bytes?: number;
  caption?: string;
  uploaded_by: string;
  created_at: string;
  public_url?: string;
  source_attribution?: string;
  license_label?: string;
}

export interface CitationItem {
  index: number;
  reportId: string;
  status: ReportStatus;
  assetId: string;
  title: string;
  evidenceName: string;
  evidenceUrl?: string;
  gejala: string;
  praduga_penyebab: string;
  usulan_tindakan: string;
  verifiedBy?: string;
  literatureRefs?: string[];
  sourceAttribution?: string;
}

export type EarlyWarningSeverity = 'KRITIS' | 'WASPADA' | 'PANTAU';

export interface EarlyWarningAlert {
  id: string;
  assetId: string;
  severity: EarlyWarningSeverity;
  patternTitle: string;
  frequencyLabel: string;
  summary: string;
  recommendedAction: string;
  relatedReportIds: string[];
  assetName?: string;
  recentCount?: number;
  message?: string;
  isCrossAssetPattern?: boolean;
  affectedAssetIds?: string[];
}

export interface EarlyWarningResponse {
  alerts: EarlyWarningAlert[];
  engine: 'gemini-live' | 'local-fallback';
  usedModel?: string;
  errorReason?: string;
  generatedAt: string;
}

export type AnalyticsTabKey = 'warnings' | 'summary' | 'simulation';

export type PointTierKey = 'pemula' | 'aktif' | 'teladan' | 'safety_champion';

export type ShiftGroupName =
  | 'Regu Shift A'
  | 'Regu Shift B'
  | 'Regu Shift C'
  | 'Regu Shift D';

export type PointEventType =
  | 'briefing_read'
  | 'briefing_check'
  | 'report_submitted'
  | 'report_verified'
  | 'tanya_query'
  | 'case_simulation';

export interface PointLedgerEntry {
  id: string;
  userRole: UserRole;
  userName: string;
  shiftGroup: ShiftGroupName;
  eventType: PointEventType;
  points: number;
  label: string;
  referenceId?: string;
  createdAt: string;
}

export interface WorkerLearningState {
  pointsByRole: Record<UserRole, number>;
  ledger: PointLedgerEntry[];
  briefingReadDateByRole: Partial<Record<UserRole, string>>;
  briefingCheckDateByRole: Partial<Record<UserRole, string>>;
  completedSimulationsByRole: Record<UserRole, string[]>;
  dailyCounters: Record<string, number>;
}

export type SimulationDisciplineFilter = 'all' | 'rotating' | 'static' | 'instrument';

export interface SimulationOption {
  text: string;
  isCorrect: boolean;
}

export interface SimulationStepItem {
  stepNumber: number;
  entityLabel: string;
  question: string;
  options: SimulationOption[];
  coachExplanation: string;
}

export interface CaseSimulationPayload {
  reportId: string;
  assetId: string;
  assetName: string;
  caseTitle: string;
  disciplineLabel: string;
  kondisiOperasi: string;
  evidenceImageUrl?: string;
  evidenceCaption?: string;
  literatureRefs?: string[];
  verifiedBy: string;
  steps: SimulationStepItem[];
  engine: 'gemini-live' | 'local-fallback';
  usedModel?: string;
  errorReason?: string;
}

