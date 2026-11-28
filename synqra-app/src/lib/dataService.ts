import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  INITIAL_ASSETS,
  INITIAL_COMMENTS,
  INITIAL_EVIDENCES,
  INITIAL_REPORTS,
} from '@/lib/constants';
import { resolveBuiltInEvidenceUrl, EVIDENCE_MEDIA_META } from '@/lib/mediaAssets';
import { Asset, CaseComment, Evidence, Report } from '@/types/synqra';

const STORAGE_KEYS = {
  reports: 'synqra_v4_balongan_reports',
  comments: 'synqra_v4_balongan_comments',
  evidences: 'synqra_v4_balongan_evidences',
};

export interface WorkspaceSnapshot {
  assets: Asset[];
  reports: Report[];
  comments: CaseComment[];
  evidences: Evidence[];
  source: 'supabase' | 'local';
}

export interface PersistResult {
  ok: boolean;
  error?: string;
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

function hydrateBuiltInEvidences(list: Evidence[]): Evidence[] {
  return list.map((ev) => {
    const builtInUrl = resolveBuiltInEvidenceUrl(ev);
    const meta = ev.id ? EVIDENCE_MEDIA_META[ev.id] : undefined;
    if (!builtInUrl && !meta) return ev;
    return {
      ...ev,
      ...(builtInUrl ? { public_url: builtInUrl } : {}),
      ...(meta?.attribution ? { source_attribution: meta.attribution } : {}),
      ...(meta?.license ? { license_label: meta.license } : {}),
    };
  });
}

export async function loadWorkspaceData(): Promise<WorkspaceSnapshot> {
  if (isSupabaseConfigured && supabase) {
    try {
      const [assetsRes, reportsRes, commentsRes, evidencesRes] = await Promise.all([
        supabase.from('assets').select('*').order('id', { ascending: true }),
        supabase.from('reports').select('*').order('created_at', { ascending: false }),
        supabase.from('case_comments').select('*').order('created_at', { ascending: true }),
        supabase.from('evidences').select('*').order('created_at', { ascending: true }),
      ]);

      if (!reportsRes.error && reportsRes.data && reportsRes.data.length > 0) {
        const initialAssetById = new Map(INITIAL_ASSETS.map((a) => [a.id, a]));
        const initialReportById = new Map(INITIAL_REPORTS.map((r) => [r.id, r]));

        const mappedAssets =
          assetsRes.data && assetsRes.data.length > 0
            ? (assetsRes.data as Asset[]).map((a) => {
                const base = initialAssetById.get(a.id);
                return {
                  ...base,
                  ...a,
                  categoryCode: a.categoryCode || base?.categoryCode || 'E',
                  unitCount: a.unitCount ?? base?.unitCount ?? 1,
                  subtitle: a.subtitle || base?.subtitle || a.type.toUpperCase(),
                  dept: a.dept || base?.dept || a.area,
                };
              })
            : INITIAL_ASSETS;

        const mappedReports = (reportsRes.data as Report[]).map((r) => {
          const base = initialReportById.get(r.id);
          return {
            ...r,
            literature_refs: r.literature_refs || base?.literature_refs,
            journal_image_ids: r.journal_image_ids || base?.journal_image_ids,
            fact_vs_scenario_note: r.fact_vs_scenario_note || base?.fact_vs_scenario_note,
            sample_narrative: r.sample_narrative || base?.sample_narrative,
            required_evidence_hint: r.required_evidence_hint || base?.required_evidence_hint,
          };
        });

        const mappedEvidences = hydrateBuiltInEvidences(
          ((evidencesRes.data as Evidence[]) || []).map((ev) => {
            if (
              !ev.public_url &&
              ev.storage_path &&
              ev.mime_type?.toLowerCase().startsWith('image/') &&
              supabase
            ) {
              const { data: pub } = supabase.storage
                .from('synqra-evidences')
                .getPublicUrl(ev.storage_path);
              return {
                ...ev,
                public_url: pub.publicUrl,
              };
            }
            return ev;
          })
        );

        return {
          assets: mappedAssets,
          reports: mappedReports,
          comments: (commentsRes.data as CaseComment[]) || [],
          evidences: mappedEvidences,
          source: 'supabase',
        };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using local persistence:', err);
    }
  }

  return {
    assets: INITIAL_ASSETS,
    reports: readLocal<Report[]>(STORAGE_KEYS.reports, INITIAL_REPORTS),
    comments: readLocal<CaseComment[]>(STORAGE_KEYS.comments, INITIAL_COMMENTS),
    evidences: hydrateBuiltInEvidences(
      readLocal<Evidence[]>(STORAGE_KEYS.evidences, INITIAL_EVIDENCES)
    ),
    source: 'local',
  };
}

export function saveLocalWorkspace(
  reports: Report[],
  comments: CaseComment[],
  evidences: Evidence[]
): void {
  writeLocal(STORAGE_KEYS.reports, reports);
  writeLocal(STORAGE_KEYS.comments, comments);
  writeLocal(STORAGE_KEYS.evidences, evidences);
}

export function resetLocalWorkspace(): WorkspaceSnapshot {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEYS.reports);
    window.localStorage.removeItem(STORAGE_KEYS.comments);
    window.localStorage.removeItem(STORAGE_KEYS.evidences);
  }
  return {
    assets: INITIAL_ASSETS,
    reports: INITIAL_REPORTS,
    comments: INITIAL_COMMENTS,
    evidences: INITIAL_EVIDENCES,
    source: 'local',
  };
}

export async function persistNewReport(report: Report): Promise<PersistResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true };
  }

  const { error } = await supabase.from('reports').insert({
    id: report.id,
    title: report.title,
    asset_id: report.asset_id,
    status: report.status,
    identitas_alat: report.identitas_alat,
    gejala: report.gejala,
    kondisi_operasi: report.kondisi_operasi,
    pemeriksaan_awal: report.pemeriksaan_awal,
    praduga_penyebab: report.praduga_penyebab,
    usulan_tindakan: report.usulan_tindakan,
    verifikasi: report.verifikasi,
    risk_level: report.risk_level || 'MEDIUM',
    risk_consequence: report.risk_consequence || 'Moderate',
    risk_likelihood: report.risk_likelihood || 'Possible',
    risk_summary: report.risk_summary || '',
    capa_corrective: report.capa_corrective || '',
    capa_preventive: report.capa_preventive || '',
    capa_target_date: report.capa_target_date || null,
    capa_pic: report.capa_pic || '',
    description: report.description,
    reporter_name: report.reporter_name,
    reporter_role: report.reporter_role,
    dept: report.dept,
    evidence_note: report.evidence_note || '',
    image_url: report.image_url || null,
    verified_by: report.verified_by || null,
    finding_type: report.finding_type || null,
    urgency: report.urgency || null,
    sla_reminder_count: report.sla_reminder_count ?? 0,
    sla_last_reminder_at: report.sla_last_reminder_at || null,
    created_at: report.created_at,
    updated_at: report.updated_at,
  });

  if (error) {
    console.warn('Supabase insert report error:', error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function persistReportUpdate(
  reportId: string,
  patch: Partial<Report>
): Promise<PersistResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true };
  }

  const rawPayload: Record<string, unknown> = {
    ...patch,
    updated_at: patch.updated_at || new Date().toISOString(),
  };

  if ('capa_target_date' in rawPayload && rawPayload.capa_target_date === '') {
    rawPayload.capa_target_date = null;
  }

  const payload = Object.fromEntries(
    Object.entries(rawPayload).filter(([, value]) => value !== undefined)
  );

  const { error } = await supabase
    .from('reports')
    .update(payload)
    .eq('id', reportId);

  if (error) {
    console.warn('Supabase update report error:', error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function persistEvidenceRecord(ev: Evidence): Promise<PersistResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true };
  }

  const { error } = await supabase.from('evidences').insert({
    report_id: ev.report_id,
    file_name: ev.file_name,
    storage_path: ev.storage_path,
    mime_type: ev.mime_type || null,
    file_size_bytes: ev.file_size_bytes ?? null,
    caption: ev.caption || null,
    uploaded_by: ev.uploaded_by,
  });

  if (error) {
    console.warn('Supabase insert evidence error:', error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function persistComment(comment: CaseComment): Promise<PersistResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true };
  }

  const { error } = await supabase.from('case_comments').insert({
    report_id: comment.report_id,
    author_name: comment.author_name,
    author_role: comment.author_role,
    comment: comment.comment,
    is_revision_request: Boolean(comment.is_revision_request),
    requested_evidence: comment.requested_evidence || null,
  });

  if (error) {
    console.warn('Supabase insert comment error:', error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function uploadEvidenceFile(
  reportId: string,
  file: File,
  caption: string,
  uploadedBy: string,
  options?: { skipDbInsert?: boolean }
): Promise<Evidence> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `evidences/${reportId}/${Date.now()}_${safeName}`;
  let publicUrl: string | undefined;

  if (isSupabaseConfigured && supabase) {
    const { error: uploadErr } = await supabase.storage
      .from('synqra-evidences')
      .upload(storagePath, file, { upsert: true });

    if (uploadErr) {
      console.warn('Supabase storage upload warning:', uploadErr.message);
    } else {
      const { data: pub } = supabase.storage
        .from('synqra-evidences')
        .getPublicUrl(storagePath);
      publicUrl = pub.publicUrl;
    }

    if (!options?.skipDbInsert) {
      await persistEvidenceRecord({
        id: `ev-${Date.now()}`,
        report_id: reportId,
        file_name: file.name,
        storage_path: storagePath,
        mime_type: file.type,
        file_size_bytes: file.size,
        caption: caption || 'Bukti fisik inspeksi lapangan',
        uploaded_by: uploadedBy,
        created_at: new Date().toISOString(),
        public_url: publicUrl,
      });
    }
  }

  if (!publicUrl && typeof window !== 'undefined' && file.type.startsWith('image/')) {
    publicUrl = URL.createObjectURL(file);
  }

  return {
    id: `ev-${Date.now()}`,
    report_id: reportId,
    file_name: file.name,
    storage_path: storagePath,
    mime_type: file.type,
    file_size_bytes: file.size,
    caption: caption || 'Bukti fisik inspeksi lapangan',
    uploaded_by: uploadedBy,
    created_at: new Date().toISOString(),
    public_url: publicUrl,
  };
}
