'use client';

import React, { useState } from 'react';
import { Asset, Report } from '@/types/synqra';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TechnicalArt } from '@/components/ui/TechnicalArt';
import {
  Layers,
  Image as ImageIcon,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { EvidenceCitationData } from './EvidenceLightboxModal';

interface KnowledgeGraphViewProps {
  assets: Asset[];
  reports: Report[];
  onOpenEvidence: (citation: EvidenceCitationData) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  assets,
  reports,
  onOpenEvidence,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('P-101A');
  const [filterMode, setFilterMode] = useState<'VERIFIED_ONLY' | 'ALL'>('VERIFIED_ONLY');
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  // Filter reports isolated for this asset
  const assetReports = reports.filter((r) => {
    if (r.asset_id !== selectedAssetId) return false;
    if (filterMode === 'VERIFIED_ONLY') return r.status === 'VERIFIED';
    return true;
  });

  // Selected or first report in the isolated chain
  const activeReport =
    assetReports.find((r) => r.id === activeReportId) || assetReports[0] || null;

  const verifiedCount = reports.filter(
    (r) => r.asset_id === selectedAssetId && r.status === 'VERIFIED'
  ).length;

  const totalAssetCount = reports.filter((r) => r.asset_id === selectedAssetId).length;

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Asset Selector (Terisolasi per Aset) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> KNOWLEDGE GRAPH TERISOLASI PER ASET
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              Otomatis Terupdate
            </span>
          </div>
          <h2 className="font-['Poppins',sans-serif] text-xl font-extrabold text-white">
            Graf Pengetahuan 5 Tingkat: Aset &rarr; Kasus &rarr; Gejala &rarr; Penyebab &rarr; File Bukti
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Setiap kali kasus baru disahkan oleh pakar (status VERIFIED), rantai bukti otomatis terintegrasi ke dalam graf aset terkait.
          </p>
        </div>

        {/* Asset Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {assets.map((asset) => {
            const isSelected = asset.id === selectedAssetId;
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  setSelectedAssetId(asset.id);
                  setActiveReportId(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-['Poppins',sans-serif] font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{asset.id}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}>
                  {reports.filter((r) => r.asset_id === asset.id && r.status === 'VERIFIED').length} KB
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Isolated Asset Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Asset Info & Technical 2D Diagram (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-['Poppins',sans-serif] text-xs font-extrabold text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  {selectedAsset.id}
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {verifiedCount} Kasus Terverifikasi
                </span>
              </div>

              <div className="py-2">
                <TechnicalArt type={selectedAsset.type} darkMode={true} className="w-full h-32 mx-auto" />
              </div>

              <h3 className="font-['Poppins',sans-serif] text-base font-bold text-white mt-1">
                {selectedAsset.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {selectedAsset.area} &mdash; {selectedAsset.description}
              </p>
            </div>

            {/* Filter Toggle: Verified Only vs Semua Status */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold">Tampilkan Graf:</span>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => setFilterMode('VERIFIED_ONLY')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    filterMode === 'VERIFIED_ONLY'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Terverifikasi ({verifiedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('ALL')}
                  className={`px-2.5 py-1 rounded font-bold transition-all ${
                    filterMode === 'ALL'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Semua ({totalAssetCount})
                </button>
              </div>
            </div>
          </div>

          {/* Cases List Selector for this Asset */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
            <div className="text-[11px] font-['Poppins',sans-serif] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Daftar Kasus Terhubung Pada {selectedAsset.id} ({assetReports.length})
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {assetReports.map((r) => {
                const isActive = (activeReport?.id || '') === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setActiveReportId(r.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-950/30 text-white shadow-md'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-['Poppins',sans-serif] text-xs font-black text-cyan-400">
                          {r.id}
                        </span>
                        <StatusBadge status={r.status} size="sm" />
                      </div>
                      <p className="text-xs font-semibold truncate text-slate-200">
                        {r.title}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}

              {assetReports.length === 0 && (
                <div className="p-4 text-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
                  Belum ada kasus berstatus {filterMode === 'VERIFIED_ONLY' ? 'VERIFIED' : 'aktif'} untuk aset ini.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 5-Tier Isolated Chain Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeReport ? (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
              
              {/* Chain Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-['Poppins',sans-serif] text-xs font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    RANTAI BUKTI
                  </span>
                  <span className="font-['Poppins',sans-serif] text-sm font-bold text-white">
                    {activeReport.id}: {activeReport.title}
                  </span>
                </div>
                <StatusBadge status={activeReport.status} />
              </div>

              {/* 5-Tier Flowchart Cards */}
              <div className="space-y-4 relative">
                
                {/* Connecting background vertical guide line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-cyan-500 via-sky-500 to-emerald-500 opacity-40 pointer-events-none" />

                {/* Level 1: ASET */}
                <div className="relative pl-12 flex items-start gap-3">
                  <div className="absolute left-3 top-2.5 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    1
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20">
                    <div className="flex items-center justify-between">
                      <span className="font-['Poppins',sans-serif] text-[10.5px] font-bold text-cyan-400 uppercase tracking-wider">
                        TINGKAT 1 · ASET UTAMA
                      </span>
                      <span className="text-xs font-semibold text-cyan-300">
                        {selectedAsset.id}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {selectedAsset.name} ({selectedAsset.area})
                    </div>
                  </div>
                </div>

                {/* Level 2: KASUS (Report) */}
                <div className="relative pl-12 flex items-start gap-3">
                  <div className="absolute left-3 top-2.5 w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-sky-500/40">
                    2
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl border border-sky-500/40 bg-sky-950/20">
                    <div className="flex items-center justify-between">
                      <span className="font-['Poppins',sans-serif] text-[10.5px] font-bold text-sky-400 uppercase tracking-wider">
                        TINGKAT 2 · KASUS TERDATA
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Pelapor: {activeReport.reporter_name}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {activeReport.title}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {activeReport.description}
                    </p>
                  </div>
                </div>

                {/* Level 3: GEJALA (Symptom) */}
                <div className="relative pl-12 flex items-start gap-3">
                  <div className="absolute left-3 top-2.5 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/40">
                    3
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/20">
                    <span className="font-['Poppins',sans-serif] text-[10.5px] font-bold text-amber-400 uppercase tracking-wider block">
                      TINGKAT 3 · GEJALA TERAMATI (SYMPTOM)
                    </span>
                    <div className="text-sm font-semibold text-amber-100 mt-0.5">
                      {activeReport.gejala}
                    </div>
                    {activeReport.kondisi_operasi && (
                      <div className="text-xs text-slate-400 mt-1">
                        <b>Kondisi Operasi:</b> {activeReport.kondisi_operasi}
                      </div>
                    )}
                  </div>
                </div>

                {/* Level 4: PENYEBAB (Root Cause & Solution) */}
                <div className="relative pl-12 flex items-start gap-3">
                  <div className="absolute left-3 top-2.5 w-6 h-6 rounded-full bg-purple-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-purple-500/40">
                    4
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/20">
                    <span className="font-['Poppins',sans-serif] text-[10.5px] font-bold text-purple-400 uppercase tracking-wider block">
                      TINGKAT 4 · AKAR MASALAH &amp; USULAN TINDAKAN
                    </span>
                    <div className="text-sm font-semibold text-purple-200 mt-0.5">
                      {activeReport.praduga_penyebab}
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      <b className="text-emerald-400">Solusi:</b> {activeReport.usulan_tindakan}
                    </div>
                  </div>
                </div>

                {/* Level 5: FILE BUKTI (Evidence File) */}
                <div className="relative pl-12 flex items-start gap-3">
                  <div className="absolute left-3 top-2.5 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    5
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
                    <div className="flex items-center justify-between">
                      <span className="font-['Poppins',sans-serif] text-[10.5px] font-bold text-emerald-400 uppercase tracking-wider">
                        TINGKAT 5 · FILE BUKTI NYATA (EVIDENCES)
                      </span>
                      {activeReport.image_url ? (
                        <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-bold">
                          Tersimpan di Supabase
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded font-bold">
                          Bukti Kosong
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                          {activeReport.evidence_note || 'Lampiran foto bukti fisik temuan.'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Klik untuk memeriksa gambar resolusi penuh & data EXIF.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenEvidence({
                            index: 1,
                            reportId: activeReport.id,
                            status: activeReport.status,
                            assetId: activeReport.asset_id,
                            title: activeReport.title,
                            evidenceName: activeReport.evidence_note || 'Bukti foto inspeksi',
                            evidenceUrl: activeReport.image_url,
                            gejala: activeReport.gejala,
                            praduga_penyebab: activeReport.praduga_penyebab,
                            usulan_tindakan: activeReport.usulan_tindakan,
                          })
                        }
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-['Poppins',sans-serif] font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Buka File Bukti</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
              <p className="text-sm text-slate-400 font-medium">
                Pilih kasus dari panel kiri untuk memvisualisasikan Knowledge Graph 5 tingkat.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
