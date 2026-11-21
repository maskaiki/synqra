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
  type: 'pump' | 'heat' | 'valve' | 'compressor' | 'vessel' | 'heater';
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
  reporter_name: string;
  reporter_role: UserRole;
  dept: string;
  evidence_note?: string;
  image_url?: string;
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
}

export interface EarlyWarningResponse {
  alerts: EarlyWarningAlert[];
  engine: 'gemini-live' | 'local-fallback';
  usedModel?: string;
  errorReason?: string;
  generatedAt: string;
}
