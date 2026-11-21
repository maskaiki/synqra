/* SYNQRA UI/UX PROTOTYPE v2 — Technical 2D Diagrams, Dark Mode, High-Contrast Poppins & Montserrat */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v18H6.5A2.5 2.5 0 0 0 4 23z"/><path d="M4 5.5V19a2 2 0 0 0 2 2h14M8 8h8M8 12h7"/>',
  inbox: '<path d="M4 4h16l2 11v5H2v-5z"/><path d="M2 15h5l2 3h6l2-3h5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
  camera: '<path d="M14 4H7L5 7H3v13h18V7h-2l-2-3z"/><circle cx="12" cy="13" r="4"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  logout: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  alert: '<path d="m10.3 3.9-8.5 14.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 4h.01"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  xCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  send: '<path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/>',
  cube: '<path d="m21 16-9 5-9-5V8l9-5 9 5z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
};

const ico = (name, size = 18) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.file}</svg>`;
const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nowLabel = () => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

const roles = {
  technician: { key: 'technician', name: 'Ahmad Fauzi', initials: 'AF', role: 'Teknisi Lapangan', team: 'Operasi Kilang · Shift Pagi', email: 'ahmad.fauzi@synqra.demo', dept: 'Operasi Kilang Unit II' },
  reviewer: { key: 'reviewer', name: 'Bambang Trihatmojo', initials: 'BT', role: 'Reviewer Departemen', team: 'Maintenance & Reliability', email: 'bambang.t@synqra.demo', dept: 'Maintenance & Reliability', scope: ['Maintenance & Reliability', 'Rotating & Mechanical'] },
  validator: { key: 'validator', name: 'Rina Suryani', initials: 'RS', role: 'Validator Ahli', team: 'HSE & Process Safety', email: 'rina.suryani@synqra.demo', dept: 'HSE & Process Safety' }
};

const navByRole = {
  technician: [['home', 'Beranda', 'home'], ['file', 'Laporan saya', 'my-reports'], ['book', 'Pengetahuan', 'knowledge']],
  reviewer: [['home', 'Ringkasan', 'home'], ['inbox', 'Antrean laporan', 'review-queue'], ['file', 'Kasus departemen', 'department-cases'], ['book', 'Pengetahuan', 'knowledge']],
  validator: [['home', 'Ringkasan', 'home'], ['shield', 'Validasi', 'validation-queue'], ['book', 'Pengetahuan', 'knowledge'], ['history', 'Riwayat validasi', 'validation-history']]
};

const assets = [
  { id: 'E-201', name: 'Heat Exchanger', subtitle: 'Shell & Tube', type: 'heat', area: 'Crude Preheater · Train A', dept: 'Process & Thermal', cases: 2 },
  { id: 'P-101A', name: 'Centrifugal Pump', subtitle: 'Process Pump', type: 'pump', area: 'Transfer Line · Unit II', dept: 'Rotating & Mechanical', cases: 3 },
  { id: 'K-101', name: 'Gas Compressor', subtitle: 'Centrifugal Compressor', type: 'compressor', area: 'Gas Processing · Train B', dept: 'Rotating & Mechanical', cases: 1 },
  { id: 'FCV-301', name: 'Control Valve', subtitle: 'Flow Control Valve', type: 'valve', area: 'Gas Outlet · Line 03', dept: 'Piping & Instrumentation', cases: 1 },
  { id: 'V-101', name: 'Three-Phase Separator', subtitle: 'Vessel / KO Drum', type: 'vessel', area: 'Separation Unit · Train A', dept: 'Process & Thermal', cases: 0 },
  { id: 'F-101', name: 'Process Fired Heater', subtitle: 'Fired Equipment', type: 'heater', area: 'Heating Section · Unit I', dept: 'Process & Thermal', cases: 0 }
];

let reports = [
  {
    id: 'RPT-1048',
    title: 'Getaran pompa P-101A meningkat',
    asset: 'P-101A',
    symptom: 'Getaran terukur meningkat 7.8 mm/s dan suara abnormal di bantalan.',
    description: 'Getaran pompa meningkat sejak awal shift. Pembacaan terakhir 7,8 mm/s, suhu bearing 72 °C. Terlihat rembesan pada area mechanical seal.',
    reporter: 'Ahmad Fauzi',
    reporterRole: 'Teknisi Lapangan',
    dept: 'Rotating & Mechanical',
    date: '19 Nov 2026 · 08.42',
    status: 'review',
    evidence: 'Foto area mechanical seal',
    imageUrl: 'assets/synqra-logo-dark.png',
    priority: 'high',
    source: 'voice',
    elapsedHours: 52, // RED SLA (> 48 jam - Overdue)
    riskLevel: 'HIGH',
    riskConsequence: 'Major',
    riskLikelihood: 'Possible',
    riskSummary: 'Risiko tinggi kerusakan catastrophic bearing & shutdown unit transfer.',
    capaCorrective: 'Penggantian cartridge mechanical seal dan realign poros dengan laser alignment.',
    capaPreventive: 'Pemasangan wireless vibration online sensor untuk monitoring kontinu.',
    capaTargetDate: '2026-11-28',
    capaPic: 'Ahmad Fauzi (Mekanik)',
    comments: [
      { author: 'Bambang Trihatmojo', role: 'Reviewer Dept', text: 'Mohon lampirkan data spektrum getaran 3 hari terakhir sebelum jadwal intervensi lapangan.', date: '19 Nov 14.10' }
    ]
  },
  {
    id: 'RPT-1047',
    title: 'Differential pressure meningkat E-201',
    asset: 'E-201',
    symptom: 'ΔP naik 0.8 bar, suhu outlet turun 12 °C di bawah baseline standar.',
    description: 'Differential pressure Heat Exchanger E-201 meningkat dari kondisi normal. Ada indikasi fouling di sisi tube bundle.',
    reporter: 'Dimas Pratama',
    reporterRole: 'Teknisi Lapangan',
    dept: 'Process & Thermal',
    date: '19 Nov 2026 · 07.56',
    status: 'validation',
    evidence: 'Foto indikator & kondisi flange',
    imageUrl: 'assets/synqra-logo-light.png',
    priority: 'high',
    source: 'text',
    elapsedHours: 18, // GREEN SLA (< 24 jam)
    riskLevel: 'MEDIUM',
    riskConsequence: 'Moderate',
    riskLikelihood: 'Likely',
    riskSummary: 'Risiko pemborosan konsumsi energi furnace preheat train.',
    capaCorrective: 'Chemical flushing dan pembersihan tube bundle secara sirkulasi.',
    capaPreventive: 'Kalibrasi differential pressure transmitter rutin per 3 bulan.',
    capaTargetDate: '2026-12-05',
    capaPic: 'Dimas Pratama (Proses)',
    comments: []
  },
  {
    id: 'RPT-1046',
    title: 'Respons control valve FCV-301 melambat',
    asset: 'FCV-301',
    symptom: 'Respons valve tertinggal sekitar 8 detik saat throttling DCS.',
    description: 'Perintah posisi 60%, aktual tertinggal sekitar delapan detik. Belum dilakukan uji stroke.',
    reporter: 'Ahmad Fauzi',
    reporterRole: 'Teknisi Lapangan',
    dept: 'Piping & Instrumentation',
    date: '18 Nov 2026 · 15.20',
    status: 'submitted',
    evidence: 'Foto control valve',
    imageUrl: 'assets/synqra-logo-dark.png',
    priority: 'low',
    source: 'text',
    elapsedHours: 31, // YELLOW SLA (24-48 jam - Segera Cek)
    riskLevel: 'HIGH',
    riskConsequence: 'Major',
    riskLikelihood: 'Possible',
    riskSummary: 'Risiko instabilitas pembakaran boiler saat fluktuasi beban uap.',
    capaCorrective: 'Pelumasan packing stem dan kalibrasi smart valve positioner.',
    capaPreventive: 'Jadwal preventive greasing diperketat tiap 2 minggu.',
    capaTargetDate: '2026-11-25',
    capaPic: 'Ahmad Fauzi (Instrumen)',
    comments: []
  },
  {
    id: 'RPT-1045',
    title: 'Indikasi rembesan flange inlet E-201',
    asset: 'E-201',
    symptom: 'Aroma hidrokarbon terdeteksi di sekitar nozzle flange shift malam.',
    description: 'Bau hidrokarbon terdeteksi di sekitar flange inlet nozzle E-201 shift malam. Pembacaan LEL 12% pada jarak 15 cm.',
    reporter: 'Ahmad Fauzi',
    reporterRole: 'Teknisi Lapangan',
    dept: 'Process & Thermal',
    date: '17 Nov 2026 · 23.15',
    status: 'more',
    evidence: 'Bukti foto belum dilampirkan',
    imageUrl: null, // HARD GATE DEMO: Empty Evidence!
    priority: 'high',
    source: 'text',
    elapsedHours: 58, // RED SLA (> 48 jam - Overdue)
    riskLevel: 'CRITICAL',
    riskConsequence: 'Catastrophic',
    riskLikelihood: 'Possible',
    riskSummary: 'Bahaya kebakaran uap hidrokarbon mudah menyala di area kilang aktif.',
    capaCorrective: 'Retorque baut flange dengan hydraulic torque wrench 450 Nm.',
    capaPreventive: 'Pemasangan thermal leak wraps di sekeliling flange joint.',
    capaTargetDate: '2026-11-23',
    capaPic: 'Ahmad Fauzi (HSE)',
    note: 'Laporan dikembalikan ke status PRADUGA. Mohon lampirkan foto jelas sambungan flange dan log kalibrasi gas detector.',
    comments: [
      { author: 'Bambang Trihatmojo', role: 'Reviewer Dept', text: 'Laporan dikembalikan ke status PRADUGA. Mohon lampirkan foto jelas area sambungan flange dan log kalibrasi detector.', date: '18 Nov 09.00', isRevision: true, requestedEvidence: 'Foto sambungan flange & sertifikat kalibrasi LEL' },
      { author: 'Ahmad Fauzi', role: 'Teknisi Lapangan', text: 'Siap Pak Bambang, shift pagi sedang mengambil foto close-up flange dan sertifikat kalibrasi MSA Altair.', date: '18 Nov 11.30' }
    ]
  },
  {
    id: 'RPT-1049',
    title: 'Deviasi sinyal feedback transmitter FCV-301',
    asset: 'FCV-301',
    symptom: 'Deviasi sinyal posisi fisik katup vs indikator monitor 6.5%.',
    description: 'Sinyal feedback transmitter posisi tidak linier pada bukaan 40% - 60%. Ditemukan kelonggaran pin linkage arm transmitter.',
    reporter: 'Rina Suryani', // HARD GATE DEMO: Reported by Rina Suryani (No Self-Approval)
    reporterRole: 'Validator Ahli',
    dept: 'Piping & Instrumentation',
    date: '19 Nov 2026 · 11.00',
    status: 'validation',
    evidence: 'Data logger sinyal analog 4-20mA',
    imageUrl: 'assets/synqra-logo-dark.png',
    priority: 'medium',
    source: 'text',
    elapsedHours: 36, // YELLOW SLA (24-48 jam)
    riskLevel: 'LOW',
    riskConsequence: 'Minor',
    riskLikelihood: 'Possible',
    riskSummary: 'Error pembacaan telemetri tanpa risiko shutdown mendesak.',
    capaCorrective: 'Penggantian pin linkage stainless steel dan kalibrasi span positioner.',
    capaPreventive: 'Inspeksi clearance linkage tiap 3 bulan.',
    capaTargetDate: '2026-12-10',
    capaPic: 'Rina Suryani',
    comments: []
  },
  {
    id: 'RPT-1044',
    title: 'Kebocoran gasket channel E-201',
    asset: 'E-201',
    symptom: 'Rembesan pada sambungan channel heat exchanger.',
    description: 'Ditemukan rembesan di sekitar sambungan channel. Area sudah diamankan dan dilaporkan untuk pemeriksaan.',
    reporter: 'Dimas Pratama',
    reporterRole: 'Teknisi Lapangan',
    dept: 'Process & Thermal',
    date: '17 Nov 2026 · 13.10',
    status: 'verified',
    evidence: 'Foto sambungan channel',
    imageUrl: 'assets/synqra-logo-light.png',
    priority: 'medium',
    source: 'voice',
    elapsedHours: 12,
    cause: 'Gasket channel mengeras',
    solution: 'Penggantian gasket dan pemeriksaan torsi baut sesuai prosedur.',
    verifiedBy: 'Rina Suryani',
    comments: []
  }
];

const knowledge = [
  { id: 'KB-001', title: 'Fouling pada sisi tabung', asset: 'E-201', assetName: 'Heat Exchanger · Shell & Tube', symptom: 'Differential pressure meningkat dan suhu keluar menurun signifikan dari baseline operasi.', cause: 'Akumulasi deposit hidrokarbon dan kerak mineral pada permukaan dalam tube bundle.', solution: 'Lakukan inspeksi borescope, evaluasi kompatibilitas chemical cleaning, lalu bersihkan tube bundle sesuai prosedur kerja aman.', result: 'ΔP kembali mendekati baseline operasi setelah pembersihan dan efisiensi perpindahan panas pulih.', cases: 2, tags: ['Terverifikasi', 'Process & Thermal'], type: 'heat', status: 'verified' },
  { id: 'KB-002', title: 'Kebocoran gasket channel', asset: 'E-201', assetName: 'Heat Exchanger · Shell & Tube', symptom: 'Rembesan fluida pada sambungan channel atau flange selama operasi bertekanan.', cause: 'Elastisitas gasket menurun akibat siklus termal dan beban torsi baut tidak merata.', solution: 'Isolasi peralatan sesuai izin kerja, ganti gasket sesuai spesifikasi material, lalu lakukan pengencangan baut bertahap.', result: 'Tidak ditemukan rembesan pada uji kebocoran setelah perbaikan.', cases: 1, tags: ['Terverifikasi', 'Process & Thermal'], type: 'heat', status: 'verified' },
  { id: 'KB-003', title: 'Getaran tinggi pada pompa', asset: 'P-101A', assetName: 'Centrifugal Pump', symptom: 'Nilai vibrasi meningkat (> 7 mm/s) disertai suara abnormal dan kenaikan suhu bearing.', cause: 'Perlu dibedakan antara misalignment poros, keausan bearing, unbalance impeller, atau kavitasi sisi suction.', solution: 'Periksa spektrum vibrasi, kondisi pelumas & bearing, laser alignment poros, dan tekanan suction sebelum tindakan korektif.', result: 'Verifikasi dilakukan melalui pengukuran tren vibrasi pasca-perbaikan (< 2,8 mm/s).', cases: 3, tags: ['Terverifikasi', 'Rotating & Mechanical'], type: 'pump', status: 'verified' },
  { id: 'KB-004', title: 'Respons control valve lambat', asset: 'FCV-301', assetName: 'Control Valve', symptom: 'Posisi aktual katup tertinggal sekitar 8 detik dari sinyal perintah DCS.', cause: 'Belum terkonfirmasi; indikasi awal gesekan packing stem, diafragma actuator, atau kalibrasi positioner.', solution: 'Lakukan uji stroke penuh (0–100%) dan dokumentasikan perbandingan sinyal perintah terhadap posisi aktual.', result: 'Menunggu hasil inspeksi lapangan dan verifikasi pakar.', cases: 1, tags: ['Dalam pemeriksaan', 'Piping & Instrumentation'], type: 'valve', status: 'review' }
];

const state = {
  user: null, page: 'login', previousPage: 'home', selectedRole: 'technician',
  activeReport: null, editReportId: null, selectedAsset: null, reportMode: 'voice',
  draftText: '', transcriptReady: false, recording: false, recordingTimer: null,
  seconds: 0, imageUrl: null, imageName: '', knowledgeId: null, knowledgeQuery: '',
  reportFilter: 'all', queueFilter: 'all', toastTimer: null,
  darkMode: localStorage.getItem('synqra-theme') === 'dark',
  activePopover: null, activeKgNode: 'asset', activeLoginLoop: null,
  mediaRecorder: null, audioChunks: [], audioBlob: null, nameplateTag: '', entities: null, isAiProcessing: false,
  selectedKgAsset: 'P-101A', kgFilterMode: 'VERIFIED_ONLY', activeKgCaseId: null,
  synqraQuery: '', synqraResult: null, isSearchingSynqra: false
};

function applyTheme() {
  document.body.classList.toggle('dark-mode', state.darkMode);
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', state.darkMode ? '#071226' : '#0B1F44');
}
applyTheme();

function toggleTheme() {
  state.darkMode = !state.darkMode;
  localStorage.setItem('synqra-theme', state.darkMode ? 'dark' : 'light');
  applyTheme();
  render();
  showToast(state.darkMode ? 'Mode Gelap aktif.' : 'Mode Terang aktif.');
}

function logoPath(forceDarkBg = false) {
  return (forceDarkBg || state.darkMode) ? 'assets/synqra-logo-dark.png' : 'assets/synqra-logo-light.png';
}

function statusInfo(status) {
  const s = String(status || '').toUpperCase();
  if (s === 'PRADUGA') return ['PRADUGA', 'praduga', 'alert'];
  if (s === 'TRIAGE') return ['TRIAGE DEPT', 'triage', 'clock'];
  if (s === 'INVESTIGATION') return ['INVESTIGASI', 'investigation', 'search'];
  if (s === 'VERIFIED') return ['TERVERIFIKASI', 'verified', 'checkCircle'];
  return ({
    submitted: ['TRIAGE DEPT', 'triage', 'clock'],
    review: ['INVESTIGASI', 'investigation', 'search'],
    validation: ['MENUNGGU VALIDASI', 'validation', 'shield'],
    verified: ['TERVERIFIKASI', 'verified', 'checkCircle'],
    more: ['PRADUGA', 'praduga', 'alert'],
    rejected: ['TIDAK VALID', 'rejected', 'xCircle']
  })[status] || ['PRADUGA', 'praduga', 'alert'];
}

function statusPill(status) {
  const [label, cls, iconName] = statusInfo(status);
  return `<span class="status ${cls}">${ico(iconName, 14)}<span>${label}</span></span>`;
}

function equipmentArt(type = 'heat') {
  const s = state.darkMode ? '#7CC0FF' : '#1E4B6B';
  const fill = state.darkMode ? '#102A4C' : '#F8FCFD';
  const hi = '#00B8D9';
  const commonStart = '<svg viewBox="0 0 220 145" fill="none" xmlns="http://www.w3.org/2000/svg">';
  const drawings = {
    heat: `<g stroke="${s}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M28 54h22m120 0h22M28 91h22m120 0h22"/><rect x="48" y="38" width="124" height="70" rx="18" fill="${fill}"/><path d="M66 42v62m88-62v62M78 48c10 6 10 44 0 50m20-50c10 6 10 44 0 50m20-50c10 6 10 44 0 50m20-50c10 6 10 44 0 50" stroke="${hi}"/><path d="M58 38V26h18v12m68 0V26h18v12M58 108v12h18v-12m68 0v12h18v-12"/><path d="M25 72h21m126 0h22" stroke="${hi}" stroke-width="5"/></g>`,
    pump: `<g stroke="${s}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 102h154v13H32z" fill="${fill}"/><rect x="48" y="53" width="63" height="49" rx="9" fill="${fill}"/><circle cx="79" cy="77" r="18" fill="rgba(0,184,217,.2)"/><path d="M79 59v36m-18-18h36" stroke="${hi}"/><path d="M111 64h22l15 13v25h-37z" fill="${fill}"/><path d="M133 64V43h27v21m-19-21v-9h10v9"/><path d="M28 77h20m112 0h29" stroke="${hi}" stroke-width="5"/></g>`,
    compressor: `<g stroke="${s}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M30 109h160"/><rect x="49" y="51" width="122" height="54" rx="17" fill="${fill}"/><path d="M61 62h96M61 94h96"/><circle cx="84" cy="78" r="13" fill="rgba(0,184,217,.2)"/><circle cx="137" cy="78" r="13" fill="rgba(0,184,217,.2)"/><path d="M84 65v26m-13-13h26m40-13v26m-13-13h26" stroke="${hi}"/><path d="M75 51V34h20v17m45 0V34h20v17"/></g>`,
    valve: `<g stroke="${s}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 87h55m66 0h55" stroke="${hi}" stroke-width="6"/><path d="m77 62 32 25-32 25V62zm66 0-32 25 32 25V62z" fill="${fill}"/><path d="M110 62V35m-21 0h42"/><rect x="93" y="16" width="34" height="20" rx="5" fill="${fill}"/><path d="M110 16V8"/></g>`,
    vessel: `<g stroke="${s}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="73" y="18" width="74" height="108" rx="34" fill="${fill}"/><path d="M76 61h68M76 83h68" stroke="${hi}"/><path d="M110 18V8m-22 118v10m44-10v10M73 50H48v25h25m74-25h25v25h-25"/></g>`,
    heater: `<g stroke="${s}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="54" y="18" width="112" height="106" rx="9" fill="${fill}"/><path d="M72 39h76v65H72z" fill="rgba(245,158,11,.14)"/><path d="M87 90c-8-13 9-17 3-29 14 7 9 17 17 23 6-8 7-14 4-24 17 14 19 28 6 39" stroke="${hi}"/><path d="M85 18V8h50v10M73 124v10m74-10v10"/></g>`
  };
  return commonStart + (drawings[type] || drawings.heat) + '</svg>';
}

function technicalDiagramMarkup(type, assetId, caption = 'Diagram teknis peralatan') {
  return `<div class="evidence-image" style="min-height:220px">
    <span class="evidence-tag">DIAGRAM TEKNIS · ${esc(assetId)}</span>
    <div class="asset-art" style="padding:28px 20px;width:100%;max-width:320px;margin:0 auto">${equipmentArt(type)}</div>
    ${caption ? `<span class="evidence-caption">${esc(caption)}</span>` : ''}
  </div>`;
}

function viewer3DMarkup(type, assetId, caption = '') {
  return technicalDiagramMarkup(type, assetId, caption);
}

function evidencePreview(report, asset) {
  if (report.imageUrl) {
    return `<div class="evidence-image actual-evidence"><span class="evidence-tag">BUKTI FOTO LAPANGAN</span><img src="${report.imageUrl}" alt="${esc(report.evidence)}"><span class="evidence-caption">${esc(report.evidence)}</span></div>`;
  }
  return technicalDiagramMarkup(asset.type, asset.id, `${report.evidence || 'Area inspeksi utama'} · Ilustrasi teknis peralatan`);
}

function showToast(msg) {
  const el = $('#toast'); if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}
function goto(page) { state.previousPage = state.page; state.page = page; state.activePopover = null; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function brandLogo(className = '', forceDarkBg = false) {
  return `<div class="brand-lockup ${className}"><img src="${logoPath(forceDarkBg)}" alt="Logo Synqra"><div><strong>SYNQRA</strong><small>Intelligence, connected by evidence</small></div></div>`;
}
function pageHead(eyebrow, title, desc, actions = '') {
  return `<header class="page-head anim-in"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</header>`;
}
function calculateSla(report) {
  const h = report.elapsedHours != null ? report.elapsedHours : 14;
  if (h < 24) {
    return { level: 'green', label: `${h}j lalu · Normal`, cls: 'sla-green', isOverdue: false };
  }
  if (h <= 48) {
    return { level: 'yellow', label: `${h}j lalu · Segera Cek`, cls: 'sla-yellow', isOverdue: false };
  }
  return { level: 'red', label: `${h}j lalu · Overdue > 48j`, cls: 'sla-red', isOverdue: true };
}

function renderSlaReminderBanner() {
  if (!state.user || state.user.key === 'technician') return '';
  const urgent = reports.filter(r => r.status !== 'verified' && (r.elapsedHours ?? 14) >= 24);
  const red = urgent.filter(r => (r.elapsedHours ?? 14) > 48);
  const yellow = urgent.filter(r => (r.elapsedHours ?? 14) <= 48);
  if (!urgent.length) return '';
  return `<div class="sla-banner anim-in">
    <div class="sla-banner-info">
      <div class="sla-banner-title">${ico('alert', 18)} Sistem Pengingat SLA Otomatis</div>
      <p class="sla-banner-desc">Sistem mendeteksi <b>${red.length} kasus Overdue (&gt; 48 jam)</b> dan <b>${yellow.length} kasus Segera Cek (24–48 jam)</b> yang membutuhkan evaluasi segera di antrean Anda.</p>
    </div>
    <div class="sla-banner-action">
      <button class="btn btn-primary" data-action="send-sla-reminder">${ico('bell', 16)} Kirim Pengingat SLA (${urgent.length})</button>
    </div>
  </div>`;
}

function statCard(iconName, value, label, delay = 1) {
  return `<div class="card stat-card tilt-card anim-in anim-delay-${delay}"><div class="stat-icon">${ico(iconName, 24)}</div><div><div class="stat-value" data-count="${value}">${value}</div><div class="stat-label">${label}</div></div></div>`;
}
function reportRow(report, actionLabel = 'Lihat detail') {
  const asset = assets.find(a => a.id === report.asset) || assets[0];
  const sla = calculateSla(report);
  return `<div class="report-row"><div class="report-thumb">${equipmentArt(asset.type)}</div><div class="report-main"><b>${esc(report.title)}</b><small>${esc(report.id)} · ${esc(report.asset)} · ${esc(report.date)} · <span class="sla-pill ${sla.cls}">${ico('clock', 12)} ${sla.label}</span></small></div><div class="report-end">${statusPill(report.status)}<button class="text-link" data-report="${report.id}">${actionLabel} ${ico('chevron', 15)}</button></div></div>`;
}
function userReports() { return reports.filter(r => r.reporter === state.user.name); }
function reviewerReports() { const s = state.user.scope || [state.user.dept]; return reports.filter(r => s.includes(r.dept)); }

function renderLogin() {
  const role = roles[state.selectedRole];
  return `<main class="login-screen">
    <section class="login-visual">
      <canvas class="login-bg-canvas" id="login-constellation"></canvas>
      ${brandLogo('', true)}
      <div class="login-hero">
        <div class="eyebrow" style="color:#67E8F9">INDUSTRIAL KNOWLEDGE PLATFORM</div>
        <h1>Dari temuan lapangan,<br><span>menjadi pengetahuan.</span></h1>
        <p>Hubungkan laporan teknisi, verifikasi ahli, dan pengalaman perawatan menjadi pengetahuan teknik yang terhubung bukti nyata.</p>
        <div class="login-asset-preview" style="margin-top:24px;padding:16px 20px;border-radius:14px;background:rgba(8,23,49,0.65);border:1px solid rgba(56,214,240,0.25);display:flex;align-items:center;gap:18px">
          <div style="width:120px;flex-shrink:0">${equipmentArt('heat')}</div>
          <div>
            <div style="font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.06em;color:#67E8F9;margin-bottom:4px">DIGITAL ASSET · E-201</div>
            <p style="margin:0;font-size:12.5px;color:rgba(224,242,254,0.8);line-height:1.45">Pengetahuan terstruktur berbasis bukti teknis peralatan industri.</p>
          </div>
        </div>
      </div>
      <div class="login-foot">© 2026 SYNQRA · Prototype UI/UX · Oil & Gas</div>
    </section>
    <section class="login-panel">
      <div class="login-theme-float">
        <button type="button" class="icon-btn" data-action="theme" title="Ubah mode terang / gelap">${ico(state.darkMode ? 'sun' : 'moon', 19)}</button>
      </div>
      <div class="login-card">
        ${brandLogo('logo-mobile')}
        <div class="eyebrow">AKSES DEMO</div>
        <h2>Selamat datang</h2>
        <p class="intro">Masuk untuk menjelajahi prototype interaktif Synqra.</p>
        <div class="field"><label>Pilih akun demo</label>
          <div class="role-picker">
            ${Object.values(roles).map(r => `<button type="button" class="role-option ${state.selectedRole === r.key ? 'active' : ''}" data-role="${r.key}"><span class="role-avatar">${r.initials}</span><span class="role-copy"><b>${r.name}</b><small>${r.role} · ${r.team}</small></span><span class="role-check">${state.selectedRole === r.key ? '✓' : ''}</span></button>`).join('')}
          </div>
        </div>
        <form id="login-form">
          <div class="field"><label for="login-email">Email perusahaan</label><input class="control" id="login-email" type="email" value="${role.email}" autocomplete="username" /></div>
          <div class="field"><label for="login-password">Kata sandi</label><input class="control" id="login-password" type="password" value="synqra-demo" autocomplete="current-password" /></div>
          <button class="btn btn-primary btn-full" type="submit">Masuk ke prototype ${ico('arrow', 18)}</button>
        </form>
        <div class="login-note">${ico('shield', 18)} <span>Login ini simulasi pemilihan persona. Tidak ada kredensial yang diverifikasi atau dikirim ke server.</span></div>
      </div>
    </section>
  </main>`;
}

function renderSidebar() {
  const user = state.user;
  const nav = navByRole[user.key];
  const createAction = user.key === 'technician' ? `<div class="sidebar-cta tilt-card"><b>Ada temuan di lapangan?</b><p>Buat laporan cepat dengan suara, teks, dan bukti foto.</p><button class="btn" data-page="new-report">${ico('plus', 16)} Buat laporan</button></div>` : '';
  const isActive = page => {
    if (page === 'home') return state.page === 'home';
    if (page === 'my-reports') return ['my-reports', 'new-report', 'report-detail'].includes(state.page);
    if (page === 'review-queue') return ['review-queue', 'review-detail'].includes(state.page);
    if (page === 'validation-queue') return ['validation-queue', 'validation-detail'].includes(state.page);
    if (page === 'knowledge') return ['knowledge', 'knowledge-detail'].includes(state.page);
    return state.page === page;
  };
  return `<aside class="sidebar">
    <div class="side-brand"><img src="${logoPath()}" alt="Synqra"><div><b>SYNQRA</b><small>Industrial Knowledge</small></div></div>
    <div class="side-profile"><span class="avatar">${user.initials}</span><span class="profile-copy"><b>${user.name}</b><small>${user.role}</small></span></div>
    <div class="side-label">WORKSPACE</div>
    <nav class="nav-list">${nav.map(([ic, label, page]) => `<button class="nav-item ${isActive(page) ? 'active' : ''}" data-page="${page}">${ico(ic, 20)}<span>${label}</span></button>`).join('')}</nav>
    ${createAction}
    <div class="nav-spacer"></div>
    <div class="side-bottom">
      <button class="nav-item" data-action="theme">${ico(state.darkMode ? 'sun' : 'moon', 20)}<span>${state.darkMode ? 'Mode Terang' : 'Mode Gelap'}</span><span class="theme-pill-badge">${state.darkMode ? 'DARK' : 'LIGHT'}</span></button>
      <button class="nav-item" data-action="logout">${ico('logout', 20)}<span>Keluar dari demo</span></button>
    </div>
  </aside>`;
}

function renderTopbar() {
  const user = state.user;
  const names = { home: 'Beranda', 'my-reports': 'Laporan saya', 'new-report': 'Buat laporan', 'report-detail': 'Detail laporan', 'review-queue': 'Antrean laporan', 'review-detail': 'Review laporan', 'department-cases': 'Kasus departemen', 'validation-queue': 'Validasi', 'validation-detail': 'Pemeriksaan temuan', knowledge: 'Pengetahuan', 'knowledge-detail': 'Detail pengetahuan', 'validation-history': 'Riwayat validasi' };
  return `<header class="topbar">
    <div class="breadcrumb"><span class="breadcrumb-root">Workspace</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">${names[state.page] || 'Beranda'}</span></div>
    <div class="top-actions">
      <span class="env-label">DEMO · OIL & GAS</span>
      <button class="icon-btn" data-action="theme" aria-label="Ganti mode tampilan" title="Mode Terang / Gelap">${ico(state.darkMode ? 'sun' : 'moon', 19)}</button>
      <button class="icon-btn" data-action="notifications" aria-label="Notifikasi" title="Notifikasi">${ico('bell', 19)}<span class="notif-badge"></span></button>
      <button class="user-chip" data-action="user-menu" title="Ganti peran cepat"><span class="avatar">${user.initials}</span><span><b>${user.name}</b><small>${user.role}</small></span></button>
    </div>
  </header>`;
}

function renderBottomNav() {
  const nav = navByRole[state.user.key];
  return `<nav class="bottom-nav">${nav.slice(0, 4).map(([ic, label, page]) => `<button class="${state.page === page ? 'active' : ''}" data-page="${page}">${ico(ic, 20)}<span>${label}</span></button>`).join('')}${state.user.key === 'technician' ? `<button class="${state.page === 'new-report' ? 'active' : ''}" data-page="new-report">${ico('plus', 20)}<span>Lapor</span></button>` : ''}</nav>`;
}

function renderHome() {
  const user = state.user;
  if (user.key === 'technician') {
    const mine = userReports();
    const inProcess = mine.filter(r => !['verified', 'rejected'].includes(r.status)).length;
    const verified = mine.filter(r => r.status === 'verified').length;
    return `${pageHead('BERANDA TEKNISI', `Halo, ${esc(user.name.split(' ')[0])}.`, 'Apa yang kamu temukan di lapangan hari ini?')}
      <section class="card welcome-card tilt-card anim-in"><div class="welcome-copy"><div class="eyebrow">FIELD REPORTING</div><h2>Temuan kecil pun penting dicatat.</h2><p>Laporkan kondisi peralatan dengan cara paling mudah untukmu.</p></div><div class="welcome-action"><button class="btn" data-page="new-report">${ico('plus', 18)} Laporkan temuan</button></div></section>
      <div class="grid grid-3" style="margin-top:20px">${statCard('file', mine.length, 'Total laporan', 1)}${statCard('clock', inProcess, 'Sedang diproses', 2)}${statCard('checkCircle', verified, 'Terverifikasi', 3)}</div>
      <div class="grid-main" style="margin-top:22px">
        <section class="card card-pad anim-in anim-delay-2"><div class="card-title"><div><h3>Laporan terakhirmu</h3><p>Pantau progres laporan tanpa proses yang rumit.</p></div><button class="text-link" data-page="my-reports">Lihat semua ${ico('chevron', 15)}</button></div>${mine.length ? mine.slice(0, 4).map(r => reportRow(r)).join('') : `<div class="empty-state">${ico('file', 32)}<p>Belum ada laporan.</p></div>`}</section>
        <aside class="card card-pad anim-in anim-delay-3"><div class="card-title"><div><h3>Mulai laporan</h3><p>Pilih cara yang paling nyaman untukmu.</p></div></div>
          <button class="quick-action" data-page="new-report" data-start-mode="voice"><span class="quick-icon">${ico('mic', 24)}</span><span><b>Rekam suara</b><small>Ceritakan temuanmu secara langsung.</small></span><span class="arrow">${ico('chevron', 18)}</span></button>
          <button class="quick-action" data-page="new-report" data-start-mode="text" style="margin-top:12px"><span class="quick-icon">${ico('file', 24)}</span><span><b>Ketik laporan</b><small>Tulis temuan dengan kata-katamu sendiri.</small></span><span class="arrow">${ico('chevron', 18)}</span></button>
          <p class="prototype-note">Prototype interaktif: transkripsi suara dan pengiriman laporan disimulasikan di browser.</p>
        </aside>
      </div>`;
  }
  if (user.key === 'reviewer') {
    const scoped = reviewerReports();
    const waiting = scoped.filter(r => r.status === 'submitted');
    const returned = scoped.filter(r => r.status === 'more');
    const sent = scoped.filter(r => r.status === 'validation');
    return `${pageHead('RINGKASAN DEPARTEMEN', 'Selamat datang, Pak Bambang.', 'Periksa kelengkapan laporan sebelum diteruskan ke validator.')}
      ${renderSlaReminderBanner()}
      <div class="grid grid-3">${statCard('inbox', waiting.length, 'Menunggu review', 1)}${statCard('shield', sent.length, 'Diteruskan ke validator', 2)}${statCard('refresh', returned.length, 'Perlu informasi', 3)}</div>
      <div class="grid-main" style="margin-top:22px">
        <section class="card card-pad anim-in anim-delay-2"><div class="card-title"><div><h3>Antrean yang perlu diperiksa</h3><p>Prioritaskan laporan yang baru masuk.</p></div><button class="text-link" data-page="review-queue">Lihat antrean ${ico('chevron', 15)}</button></div>${waiting.length ? waiting.map(r => reportRow(r, 'Review')).join('') : `<div class="empty-state">${ico('checkCircle', 32)}<p>Semua laporan baru sudah diperiksa.</p></div>`}</section>
        <aside class="card card-pad anim-in anim-delay-3"><div class="card-title"><div><h3>Alur review</h3><p>Tiga langkah sederhana.</p></div></div><div class="timeline"><div class="timeline-item"><span class="timeline-dot">${ico('inbox', 15)}</span><div class="timeline-copy"><b>Terima laporan</b><small>Periksa aset, uraian, dan bukti foto.</small></div></div><div class="timeline-item"><span class="timeline-dot">${ico('check', 15)}</span><div class="timeline-copy"><b>Pastikan kelengkapan</b><small>Pastikan informasi cukup untuk dinilai.</small></div></div><div class="timeline-item"><span class="timeline-dot">${ico('arrow', 15)}</span><div class="timeline-copy"><b>Teruskan ke validator</b><small>Atau kembalikan jika perlu dilengkapi.</small></div></div></div><button class="btn btn-primary btn-full btn-sm" data-page="review-queue">Buka antrean</button></aside>
      </div>`;
  }
  const validation = reports.filter(r => r.status === 'validation');
  const verified = reports.filter(r => r.status === 'verified');
  const rejected = reports.filter(r => r.status === 'rejected');
  return `${pageHead('RINGKASAN VALIDATOR', 'Selamat datang, Ibu Rina.', 'Validasi temuan berdasarkan bukti sebelum disimpan ke Knowledge Base.')}
    ${renderSlaReminderBanner()}
    <div class="grid grid-3">${statCard('shield', validation.length, 'Menunggu validasi', 1)}${statCard('checkCircle', verified.length, 'Temuan terverifikasi', 2)}${statCard('xCircle', rejected.length, 'Tidak valid', 3)}</div>
    <div class="grid-main" style="margin-top:22px">
      <section class="card card-pad anim-in anim-delay-2"><div class="card-title"><div><h3>Temuan menunggu keputusan</h3><p>Periksa bukti dan laporan sebelum menetapkan hasil.</p></div><button class="text-link" data-page="validation-queue">Semua temuan ${ico('chevron', 15)}</button></div>${validation.length ? validation.map(r => reportRow(r, 'Validasi')).join('') : `<div class="empty-state">${ico('checkCircle', 32)}<p>Tidak ada temuan yang menunggu validasi.</p></div>`}</section>
      <aside class="card card-pad anim-in anim-delay-3"><div class="card-title"><div><h3>Standar keputusan</h3><p>Jaga agar dugaan tidak dianggap fakta.</p></div></div><div class="timeline"><div class="timeline-item"><span class="timeline-dot">${ico('check', 15)}</span><div class="timeline-copy"><b>Temuan valid</b><small>Bukti cukup mendukung adanya masalah.</small></div></div><div class="timeline-item"><span class="timeline-dot">${ico('refresh', 15)}</span><div class="timeline-copy"><b>Perlu bukti tambahan</b><small>Informasi belum cukup untuk disahkan.</small></div></div><div class="timeline-item"><span class="timeline-dot">${ico('xCircle', 15)}</span><div class="timeline-copy"><b>Tidak valid</b><small>Temuan tidak dapat dibuktikan.</small></div></div></div><button class="btn btn-primary btn-full btn-sm" data-page="validation-queue">Buka antrean validasi</button></aside>
    </div>`;
}

function renderMyReports() {
  const mine = userReports();
  const filtered = mine.filter(r => state.reportFilter === 'all' || r.status === state.reportFilter);
  return `${pageHead('LAPORAN SAYA', 'Semua laporanmu.', 'Pantau status temuan yang sudah kamu kirim dari lapangan.', `<button class="btn btn-primary" data-page="new-report">${ico('plus', 18)} Buat laporan</button>`)}
    <div class="filter-row anim-in" style="margin-bottom:18px">${[['all', 'Semua'], ['submitted', 'Terkirim'], ['review', 'Diperiksa'], ['validation', 'Validasi'], ['more', 'Perlu info'], ['verified', 'Terverifikasi']].map(([v, l]) => `<button class="filter-chip ${state.reportFilter === v ? 'active' : ''}" data-report-filter="${v}">${l}</button>`).join('')}</div>
    <section class="card card-pad anim-in anim-delay-1">${filtered.length ? filtered.map(r => reportRow(r)).join('') : `<div class="empty-state">${ico('file', 34)}<p>Tidak ada laporan pada status ini.</p></div>`}</section>`;
}

function renderNewReport() {
  const selected = assets.find(a => a.id === state.selectedAsset);
  const editing = !!state.editReportId;
  const existing = reports.find(r => r.id === state.editReportId);
  const textMode = state.reportMode === 'text';
  const draft = esc(state.draftText);
  const ent = state.entities;
  return `${pageHead(editing ? 'LENGKAPI LAPORAN' : 'LAPORAN BARU (LAPOR CEPAT AI)', editing ? 'Lengkapi informasi temuan.' : 'Ceritakan temuan lapangan secara instan.', editing ? (existing?.note || 'Tambahkan informasi yang diminta agar laporan dapat diperiksa kembali.') : 'Didukung Google Gemini API untuk mengekstrak 7 entitas kegagalan. Status terkunci sebagai PRADUGA.')}
    <div class="stepper"><div class="step active"><span>1</span>Pilih peralatan</div><div class="step-line"></div><div class="step ${selected ? 'active' : ''}"><span>2</span>Suara / Narasi</div><div class="step-line"></div><div class="step ${state.draftText.trim() ? 'active' : ''}"><span>3</span>7 Entitas & Kirim</div></div>
    
    <section class="card form-section anim-in">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px">
        <div><h3 style="margin:0">1. Peralatan yang ditemukan bermasalah</h3><p style="margin:4px 0 0" class="muted">Pilih dari katalog aset atau gunakan fitur Scan Nameplate.</p></div>
        <label class="btn btn-outline" style="cursor:pointer;padding:8px 14px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:7px">
          <input type="file" id="nameplate-file" accept="image/*" class="hidden">
          ${ico('camera', 16)} <span>Scan Nameplate</span>
        </label>
      </div>
      <div class="searchbar" style="margin-bottom:16px">${ico('search', 19)}<input id="asset-search" placeholder="Cari equipment atau tag aset..." /></div>
      <div class="grid grid-3" id="asset-grid">${assets.map(a => `<button class="asset-card tilt-card ${state.selectedAsset === a.id ? 'selected' : ''}" data-asset="${a.id}"><div class="asset-art">${equipmentArt(a.type)}</div><b>${a.name}</b><small>${a.subtitle}</small><div class="asset-meta">${a.id} · ${a.area}</div></button>`).join('')}</div>
      ${selected ? `<div style="margin-top:16px;padding:13px 16px;border-radius:12px;background:var(--cyan-pale);color:var(--ink);font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:space-between"><span>${ico('checkCircle', 18)} Terpilih: <b>${selected.name} (${selected.id})</b></span><span class="status praduga">${ico('alert', 13)}<span>KUNCI AWAL: PRADUGA</span></span></div>` : ''}
    </section>

    <section class="card form-section anim-in anim-delay-1" style="margin-top:16px">
      <h3>2. Sampaikan Temuan Lapangan</h3><p>Gunakan perekam suara browser (MediaRecorder API) atau ketik narasi temuan.</p>
      <div class="mode-switch"><button class="${!textMode ? 'active' : ''}" data-mode="voice">${ico('mic', 16)} Suara (Mikrofon)</button><button class="${textMode ? 'active' : ''}" data-mode="text">${ico('file', 16)} Ketik Narasi</button></div>
      ${textMode ? `<div class="field" style="margin-top:18px;margin-bottom:0"><label for="report-text">Uraian / Transkrip Lapangan</label><textarea class="control" id="report-text" rows="4" placeholder="Contoh: Terlihat rembesan pada mechanical seal pompa P-101A. Getaran meningkat tajam di drive end saat debit 100 m3/jam...">${draft}</textarea></div>` : `<div class="voice-panel"><button class="mic-button ${state.recording ? 'recording' : ''}" data-action="toggle-record">${ico(state.recording ? 'close' : 'mic', 34)}</button><b>${state.recording ? 'Sedang Merekam Suara Lapangan...' : 'Tekan Tombol untuk Mulai Bicara'}</b><div class="wave ${state.recording ? 'active' : ''}">${Array.from({ length: 25 }, () => '<i></i>').join('')}</div><small class="muted" style="font-size:13.5px;font-weight:600">${state.recording ? `Durasi ${String(Math.floor(state.seconds / 60)).padStart(2, '0')}:${String(state.seconds % 60).padStart(2, '0')} · Tekan kembali untuk selesai` : 'Ceritakan gejala, lokasi, dan kondisi abnormal yang terlihat.'}</small></div>
        ${state.transcriptReady ? `<div class="transcript"><div class="eyebrow" style="margin-bottom:8px">TRANSKRIP SUARA TEKNISI</div>${draft}</div>` : ''}`}
      
      <button type="button" class="btn btn-outline" data-action="gemini-extract" style="margin-top:16px;width:100%;display:flex;align-items:center;justify-content:center;gap:8px" ${!state.draftText.trim() ? 'disabled' : ''}>
        ${ico('search', 16)} <span>Ekstrak 7 Entitas Kegagalan dengan Gemini AI ✨</span>
      </button>
    </section>

    ${ent ? `<section class="card form-section anim-in" style="margin-top:16px;border-left:5px solid #D97706">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div><h3 style="margin:0">3. Hasil Ekstraksi 7 Entitas Standar</h3><p style="margin:4px 0 0" class="muted">Tinjau parameter sebelum disimpan ke sistem.</p></div>
        <span class="status praduga">${ico('alert', 13)}<span>STATUS TERKUNCI: PRADUGA</span></span>
      </div>
      <div class="kb-blocks">
        <div class="kb-block block-symptom"><div class="kb-block-label">1. Identitas Alat & 2. Gejala</div><p class="kb-block-body"><b>${esc(ent.identitas_alat)}</b> — ${esc(ent.gejala)}</p></div>
        <div class="kb-block block-cause"><div class="kb-block-label">3. Kondisi Operasi & 4. Pemeriksaan Awal</div><p class="kb-block-body"><b>Kondisi:</b> ${esc(ent.kondisi_operasi)}<br><b>Pemeriksaan:</b> ${esc(ent.pemeriksaan_awal)}</p></div>
        <div class="kb-block block-solution"><div class="kb-block-label">5. Praduga Penyebab & 6. Usulan Tindakan</div><p class="kb-block-body"><b>Penyebab:</b> ${esc(ent.praduga_penyebab)}<br><b>Tindakan:</b> ${esc(ent.usulan_tindakan)}</p></div>
        <div class="kb-block block-result"><div class="kb-block-label">7. Verifikasi Keberhasilan</div><p class="kb-block-body">${esc(ent.verifikasi)}</p></div>
      </div>
    </section>` : ''}

    <section class="card form-section anim-in anim-delay-2" style="margin-top:16px"><h3>Bukti foto lapangan</h3><p>Tambahkan foto area temuan atau nameplate untuk Supabase Storage.</p><label class="upload-box" for="evidence-file"><span class="upload-symbol">${ico('camera', 22)}</span><span><b style="display:block;font-size:14.5px;color:var(--ink)">Pilih foto dari perangkat</b><small class="muted" style="font-size:13px">JPG, PNG, atau WEBP</small></span><span class="arrow">${ico('plus', 20)}</span></label><input type="file" id="evidence-file" accept="image/*" class="hidden">${state.imageUrl ? `<div class="upload-preview"><img class="preview-image" src="${state.imageUrl}" alt="Pratinjau bukti"><span class="small" style="font-weight:600">${esc(state.imageName)}</span><button class="text-link" data-action="remove-photo">Hapus foto</button></div>` : ''}</section>
    
    <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px"><button class="btn btn-outline" data-page="home">Batal</button><button class="btn btn-primary" data-action="submit-report" ${!selected || !state.draftText.trim() ? 'disabled' : ''}>Kirim laporan (Status: PRADUGA) ${ico('arrow', 18)}</button></div>`;
}

function renderReportDetail() {
  const r = reports.find(x => x.id === state.activeReport) || reports[0];
  const asset = assets.find(a => a.id === r.asset) || assets[0];
  const sla = calculateSla(r);
  const backPage = state.user.key === 'technician' ? 'my-reports' : state.user.key === 'reviewer' ? 'review-queue' : 'validation-queue';
  const completeAction = state.user.key === 'technician' && r.reporter === state.user.name && r.status === 'more' ? `<button class="btn btn-primary" data-action="complete-report" data-id="${r.id}">${ico('file', 16)} Lengkapi laporan</button>` : '';

  return `${pageHead('DETAIL LAPORAN & INVESTIGASI', esc(r.title), `${r.id} · Dilaporkan ${r.date}`, `${completeAction}<button class="btn btn-outline" data-page="${backPage}">${ico('back', 16)} Kembali</button>`)}
    <div class="detail-grid">
      <section class="card card-pad anim-in">
        <div class="card-title">
          <div>
            <h3>Ringkasan temuan</h3>
            <p>${r.id} · ${r.date} · <span class="sla-pill ${sla.cls}">${ico('clock', 12)} ${sla.label}</span></p>
          </div>
          ${statusPill(r.status)}
        </div>
        ${evidencePreview(r, asset)}
        <div style="margin-top:20px">
          <div class="detail-item"><span>Peralatan</span><b>${asset.name} · ${asset.id}</b></div>
          <div class="detail-item"><span>Lokasi</span><b>${asset.area}</b></div>
          <div class="detail-item"><span>Pelapor</span><b>${r.reporter}</b></div>
          <div class="detail-item"><span>Departemen</span><b>${r.dept}</b></div>
          <div class="detail-item"><span>Metode laporan</span><b>${r.source === 'voice' ? 'Suara (MediaRecorder API)' : 'Teks manual'}</b></div>
          <div class="detail-item"><span>Bukti</span><b>${r.evidence || 'Belum ada lampiran'}</b></div>
          ${r.slaReminderCount ? `<div class="detail-item"><span>Pengingat SLA</span><b>${r.slaReminderCount}x terkirim</b></div>` : ''}
        </div>

        <!-- Risk Report & CAPA Section -->
        <div class="risk-matrix-card">
          <div class="risk-head">
            <b>${ico('shield', 15)} Analisis Risiko & CAPA</b>
            <span class="risk-tag risk-${r.riskLevel || 'MEDIUM'}">RISIKO: ${r.riskLevel || 'MEDIUM'}</span>
          </div>
          <p style="margin:4px 0 8px;font-size:13px;color:var(--ink-soft)"><b>Dampak:</b> ${esc(r.riskSummary || 'Risiko operasional.')}</p>
          <div class="capa-box">
            <b>Rencana Tindakan Korektif & Preventif (CAPA)</b>
            <p style="margin:0 0 4px"><b>Korektif:</b> ${esc(r.capaCorrective || 'Inspeksi dan perbaikan komponen.')}</p>
            <p style="margin:0"><b>Preventif:</b> ${esc(r.capaPreventive || 'Pencegahan berulang dan pengujian rutin.')}</p>
            <small style="display:block;margin-top:4px;color:var(--ink-soft)">Target: <b>${r.capaTargetDate || '2026-11-28'}</b> · PIC: <b>${r.capaPic || 'Teknisi & Supervisor'}</b></small>
          </div>
        </div>

        <!-- 2-Way Feedback Thread -->
        <div class="case-thread">
          <h4 style="margin:0 0 10px;font-family:'Poppins',sans-serif;font-size:13.5px">Catatan Kasus 2 Arah (${(r.comments || []).length})</h4>
          ${(r.comments || []).map(c => `<div class="comment-card ${c.isRevision ? 'is-revision' : ''}"><div class="comment-head"><b>${esc(c.author)} (${esc(c.role || 'User')})</b>${c.isRevision ? '<span class="revision-tag">Revisi Diminta</span>' : ''}<small>${esc(c.date)}</small></div><p class="comment-body">${esc(c.text)}</p>${c.requestedEvidence ? `<div class="comment-req">Lampiran diminta: ${esc(c.requestedEvidence)}</div>` : ''}</div>`).join('')}
          <div style="display:flex;gap:8px;margin-top:10px">
            <input class="control" id="case-comment-input" style="font-size:13px;padding:8px 12px" placeholder="Tulis komentar / tanggapan teknisi..." />
            <button class="btn btn-primary btn-sm" data-action="add-case-comment" data-id="${r.id}">${ico('send', 14)}</button>
          </div>
        </div>
      </section>

      <aside class="card card-pad anim-in anim-delay-1">
        <div class="card-title"><div><h3>7 Entitas Standar Kegagalan</h3><p>Hasil ekstraksi Google Gemini AI.</p></div></div>
        <div class="kb-blocks">
          <div class="kb-block block-symptom"><div class="kb-block-label">1. Identitas & 2. Gejala</div><p class="kb-block-body"><b>${esc(r.identitas_alat || asset.name)}:</b> ${esc(r.gejala || r.symptom || r.description)}</p></div>
          <div class="kb-block block-cause"><div class="kb-block-label">3. Kondisi Operasi & 4. Pemeriksaan Awal</div><p class="kb-block-body"><b>Kondisi:</b> ${esc(r.kondisi_operasi || 'Operasi normal beban unit')}<br><b>Pemeriksaan:</b> ${esc(r.pemeriksaan_awal || 'Inspeksi visual fisik & termografi')}</p></div>
          <div class="kb-block block-solution"><div class="kb-block-label">5. Praduga Penyebab & 6. Usulan Tindakan</div><p class="kb-block-body"><b>Penyebab:</b> ${esc(r.praduga_penyebab || r.cause || 'Dugaan degradasi komponen / keausan mekanikal')}<br><b>Tindakan:</b> ${esc(r.usulan_tindakan || r.solution || 'Inspeksi internal dan penggantian suku cadang')}</p></div>
          <div class="kb-block block-result"><div class="kb-block-label">7. Verifikasi Keberhasilan</div><p class="kb-block-body">${esc(r.verifikasi || 'Uji coba performa dan monitoring parameter stabil')}</p></div>
        </div>
        ${r.note ? `<div style="padding:14px 16px;border-radius:12px;background:var(--amber-bg);border:1px solid var(--amber-border);color:var(--amber);font-size:14px;font-weight:600;margin-top:14px"><b>Catatan Revisi:</b> ${esc(r.note)}</div>` : ''}
      </aside>
    </div>`;
}

function renderReviewQueue() {
  let list = reviewerReports().filter(r => r.status === 'submitted' || r.status === 'more');
  if (state.queueFilter === 'submitted') list = list.filter(r => r.status === 'submitted');
  if (state.queueFilter === 'more') list = list.filter(r => r.status === 'more');
  return `${pageHead('TRIAGE DEPARTEMEN', 'Periksa laporan yang masuk.', 'Pastikan informasi dan bukti cukup sebelum kasus diteruskan ke validator.')}
    ${renderSlaReminderBanner()}
    <div class="filter-row" style="margin-bottom:18px">${[['all', 'Semua'], ['submitted', 'Laporan baru'], ['more', 'Perlu informasi']].map(([v, l]) => `<button class="filter-chip ${state.queueFilter === v ? 'active' : ''}" data-queue-filter="${v}">${l}</button>`).join('')}</div>
    <section class="card card-pad">
      <div class="card-title"><div><h3>${list.length} laporan perlu perhatian</h3><p>Menampilkan laporan dalam tanggung jawab departemen.</p></div></div>
      ${list.length ? list.map(r => reportRow(r, 'Triage & Investigasi')).join('') : `<div class="empty-state">${ico('checkCircle', 32)}<p>Antrean kosong.</p></div>`}
    </section>`;
}

function renderReviewDetail() {
  const r = reports.find(x => x.id === state.activeReport) || reports.find(x => x.status === 'submitted');
  if (!r) return `<div class="empty-state">Tidak ada laporan untuk diperiksa.</div>`;
  const a = assets.find(x => x.id === r.asset) || assets[0];
  const sla = calculateSla(r);

  return `${pageHead('TRIAGE DEPARTEMEN & INVESTIGASI', 'Periksa kelengkapan laporan sebelum validasi.', 'Evaluasi kelengkapan 7 entitas, tetapkan SLA & rencana CAPA.', `<button class="btn btn-outline" data-page="review-queue">${ico('back', 16)} Kembali</button>`)}
    <div class="detail-grid">
      <section class="card card-pad">
        <div class="card-title">
          <div>
            <h3>${esc(r.title)}</h3>
            <p>${r.id} · ${r.date} · <span class="sla-pill ${sla.cls}">${ico('clock', 12)} ${sla.label}</span></p>
          </div>
          ${statusPill(r.status)}
        </div>
        ${evidencePreview(r, a)}
        <div style="margin-top:18px">
          <div class="detail-item"><span>Equipment</span><b>${a.name} · ${a.id}</b></div>
          <div class="detail-item"><span>Departemen</span><b>${r.dept}</b></div>
          <div class="detail-item"><span>Pelapor</span><b>${r.reporter}</b></div>
          <div class="detail-item"><span>Bukti foto</span><b>${r.evidence || 'Belum ada bukti'}</b></div>
          ${r.slaReminderCount ? `<div class="detail-item"><span>Pengingat SLA</span><b>${r.slaReminderCount}x terkirim</b></div>` : ''}
        </div>

        <!-- Risk Report & CAPA Section -->
        <div class="risk-matrix-card">
          <div class="risk-head">
            <b>${ico('shield', 15)} Analisis Risiko & CAPA</b>
            <span class="risk-tag risk-${r.riskLevel || 'MEDIUM'}">RISIKO: ${r.riskLevel || 'MEDIUM'}</span>
          </div>
          <p style="margin:4px 0 8px;font-size:13px;color:var(--ink-soft)"><b>Dampak:</b> ${esc(r.riskSummary || 'Risiko operasional.')}</p>
          <div class="capa-box">
            <b>Rencana Tindakan Korektif & Preventif (CAPA)</b>
            <p style="margin:0 0 4px"><b>Korektif:</b> ${esc(r.capaCorrective || 'Inspeksi dan perbaikan komponen.')}</p>
            <p style="margin:0"><b>Preventif:</b> ${esc(r.capaPreventive || 'Pencegahan berulang dan pengujian rutin.')}</p>
            <small style="display:block;margin-top:4px;color:var(--ink-soft)">Target: <b>${r.capaTargetDate || '2026-11-28'}</b> · PIC: <b>${r.capaPic || 'Teknisi & Supervisor'}</b></small>
          </div>
        </div>

        <!-- 2-Way Feedback Thread -->
        <div class="case-thread">
          <h4 style="margin:0 0 10px;font-family:'Poppins',sans-serif;font-size:13.5px">Catatan Kasus 2 Arah (${(r.comments || []).length})</h4>
          ${(r.comments || []).map(c => `<div class="comment-card ${c.isRevision ? 'is-revision' : ''}"><div class="comment-head"><b>${esc(c.author)} (${esc(c.role || 'User')})</b>${c.isRevision ? '<span class="revision-tag">Revisi Diminta</span>' : ''}<small>${esc(c.date)}</small></div><p class="comment-body">${esc(c.text)}</p>${c.requestedEvidence ? `<div class="comment-req">Lampiran diminta: ${esc(c.requestedEvidence)}</div>` : ''}</div>`).join('')}
          <div style="display:flex;gap:8px;margin-top:10px">
            <input class="control" id="case-comment-input" style="font-size:13px;padding:8px 12px" placeholder="Tulis catatan diskusi teknis..." />
            <button class="btn btn-primary btn-sm" data-action="add-case-comment" data-id="${r.id}">${ico('send', 14)}</button>
          </div>
        </div>
      </section>

      <aside class="card card-pad">
        <div class="card-title"><div><h3>Keputusan Triage</h3><p>Evaluasi teknis supervisor.</p></div></div>
        <p style="font-size:15px;line-height:1.7">${esc(r.description)}</p>

        <button class="btn btn-primary btn-full" style="margin-top:14px" data-action="forward-report" data-id="${r.id}">${ico('arrow', 17)} Teruskan ke Validator Pakar</button>
        <button class="btn btn-outline btn-full" style="margin-top:10px" data-action="open-revision-modal" data-id="${r.id}">${ico('refresh', 16)} Kembalikan untuk Revisi Bukti (2-Way)</button>
      </aside>
    </div>`;
}

function renderDepartmentCases() {
  const list = reviewerReports();
  return `${pageHead('KASUS DEPARTEMEN', 'Laporan dalam lingkup departemen.', 'Pantau laporan yang masuk, diteruskan, dan selesai diperiksa.')}<section class="card card-pad"><div class="table-wrap"><table><thead><tr><th>Laporan</th><th>Peralatan</th><th>Pelapor</th><th>Status</th><th></th></tr></thead><tbody>${list.map(r => `<tr><td><b>${esc(r.title)}</b><br><small class="muted">${r.id} · ${r.date}</small></td><td>${r.asset}</td><td>${esc(r.reporter)}</td><td>${statusPill(r.status)}</td><td><button class="text-link" data-report="${r.id}">Detail ${ico('chevron', 14)}</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderValidationQueue() {
  const list = reports.filter(r => r.status === 'validation');
  return `${pageHead('GERBANG VALIDASI PAKAR', 'Tentukan validitas temuan.', 'Tinjau bukti nyata sebelum pengetahuan disahkan ke Knowledge Base.')}
    ${renderSlaReminderBanner()}
    <section class="card card-pad">
      <div class="card-title"><div><h3>${list.length} temuan menunggu validasi</h3><p>Hanya laporan dengan bukti valid yang dapat disahkan.</p></div></div>
      ${list.length ? list.map(r => reportRow(r, 'Periksa bukti (Hard Gate)')).join('') : `<div class="empty-state">${ico('checkCircle', 32)}<p>Semua temuan sudah ditinjau.</p></div>`}
    </section>`;
}

function renderValidationDetail() {
  const r = reports.find(x => x.id === state.activeReport) || reports.find(x => x.status === 'validation');
  if (!r) return `<div class="empty-state">Tidak ada temuan untuk divalidasi.</div>`;
  const a = assets.find(x => x.id === r.asset) || assets[0];
  const sla = calculateSla(r);

  // HARD GATE (ATURAN KERAS) CHECKS:
  // 1. Evidence check: must have valid imageUrl and not marked as 'belum'
  const hasEvidence = Boolean(r.imageUrl && r.evidence && !r.evidence.toLowerCase().includes('belum'));
  // 2. Self-Approval check: Validator cannot approve their own report
  const isSelfApproval = Boolean(state.user?.name && r.reporter && state.user.name.toLowerCase().trim() === r.reporter.toLowerCase().trim());
  const isHardGateLocked = !hasEvidence || isSelfApproval;

  let hardGateMessage = '';
  if (!hasEvidence) {
    hardGateMessage = '⚠️ <b>Tabel Evidences Kosong:</b> Bukti foto lapangan belum dilampirkan. Sesuai aturan keras HSE, pengesahan terkunci sampai teknisi melampirkan foto inspeksi fisik.';
  } else if (isSelfApproval) {
    hardGateMessage = '⛔ <b>Aturan Keras (No Self-Approval):</b> Anda terdaftar sebagai pelapor kasus ini. Pengesahan wajib dilakukan oleh validator independen lain demi integritas audit HSE.';
  }

  return `${pageHead('PEMERIKSAAN TEMUAN (VALIDASI PAKAR)', 'Apakah temuan ini terbukti?', 'Bandingkan uraian teknisi dengan bukti yang tersedia di bawah Aturan Keras (Hard Gate).', `<button class="btn btn-outline" data-page="validation-queue">${ico('back', 16)} Kembali</button>`)}
    <div class="detail-grid">
      <section class="card card-pad">
        <div class="card-title">
          <div>
            <h3>${esc(r.title)}</h3>
            <p>${r.id} · ${r.date} · <span class="sla-pill ${sla.cls}">${ico('clock', 12)} ${sla.label}</span></p>
          </div>
          ${statusPill(r.status)}
        </div>
        ${evidencePreview(r, a)}
        <div style="margin-top:18px">
          <div class="detail-item"><span>Equipment</span><b>${a.name} · ${a.id}</b></div>
          <div class="detail-item"><span>Lokasi</span><b>${a.area}</b></div>
          <div class="detail-item"><span>Pelapor</span><b>${r.reporter}</b></div>
          <div class="detail-item"><span>Bukti terlampir</span><b>${r.evidence || 'Belum ada bukti'}</b></div>
          ${r.slaReminderCount ? `<div class="detail-item"><span>Pengingat SLA</span><b>${r.slaReminderCount}x terkirim</b></div>` : ''}
        </div>

        <!-- Risk Report & CAPA Section -->
        <div class="risk-matrix-card">
          <div class="risk-head">
            <b>${ico('shield', 15)} Analisis Risiko & CAPA</b>
            <span class="risk-tag risk-${r.riskLevel || 'MEDIUM'}">RISIKO: ${r.riskLevel || 'MEDIUM'}</span>
          </div>
          <p style="margin:4px 0 8px;font-size:13px;color:var(--ink-soft)"><b>Dampak:</b> ${esc(r.riskSummary || 'Risiko operasional.')}</p>
          <div class="capa-box">
            <b>Rencana Tindakan Korektif & Preventif (CAPA)</b>
            <p style="margin:0 0 4px"><b>Korektif:</b> ${esc(r.capaCorrective || 'Inspeksi dan perbaikan komponen.')}</p>
            <p style="margin:0"><b>Preventif:</b> ${esc(r.capaPreventive || 'Pencegahan berulang dan pengujian rutin.')}</p>
            <small style="display:block;margin-top:4px;color:var(--ink-soft)">Target: <b>${r.capaTargetDate || '2026-11-28'}</b> · PIC: <b>${r.capaPic || 'Teknisi & Supervisor'}</b></small>
          </div>
        </div>

        <!-- 2-Way Feedback Thread -->
        <div class="case-thread">
          <h4 style="margin:0 0 10px;font-family:'Poppins',sans-serif;font-size:13.5px">Catatan Kasus 2 Arah (${(r.comments || []).length})</h4>
          ${(r.comments || []).map(c => `<div class="comment-card ${c.isRevision ? 'is-revision' : ''}"><div class="comment-head"><b>${esc(c.author)} (${esc(c.role || 'User')})</b>${c.isRevision ? '<span class="revision-tag">Revisi Diminta</span>' : ''}<small>${esc(c.date)}</small></div><p class="comment-body">${esc(c.text)}</p>${c.requestedEvidence ? `<div class="comment-req">Lampiran diminta: ${esc(c.requestedEvidence)}</div>` : ''}</div>`).join('')}
          <div style="display:flex;gap:8px;margin-top:10px">
            <input class="control" id="case-comment-input" style="font-size:13px;padding:8px 12px" placeholder="Tulis komentar tanggapan teknis..." />
            <button class="btn btn-primary btn-sm" data-action="add-case-comment" data-id="${r.id}">${ico('send', 14)}</button>
          </div>
        </div>
      </section>

      <aside class="card card-pad">
        <div class="card-title"><div><h3>Gerbang Keputusan Pakar</h3><p>Aturan Keras (Hard Gate): Bukti foto wajib ada & No Self-Approval.</p></div></div>
        <p style="font-size:15px;line-height:1.7">${esc(r.description)}</p>

        ${isHardGateLocked ? `
          <div class="hard-gate-notice anim-in">
            <b>${ico('alert', 16)} Gerbang Validasi Terkunci (Hard Gate)</b>
            ${hardGateMessage}
          </div>
        ` : ''}

        <div class="field" style="margin-top:16px"><label for="validator-note">Catatan keputusan</label><textarea class="control" id="validator-note" rows="3" placeholder="Tuliskan alasan singkat dan dasar keputusan..."></textarea></div>

        <button class="decision-card ${isHardGateLocked ? 'locked' : ''}" ${isHardGateLocked ? 'data-action="locked-warning"' : `data-action="decision" data-decision="verified" data-id="${r.id}"`}>
          <span class="decision-icon">${ico(isHardGateLocked ? 'close' : 'checkCircle', 20)}</span>
          <span><b>Sahkan Temuan (Terverifikasi)</b><small>${isHardGateLocked ? 'Terkunci oleh aturan keras (Hard Gate).' : 'Bukti lengkap & valid. Simpan sebagai pengetahuan terverifikasi.'}</small></span>
          ${ico(isHardGateLocked ? 'close' : 'chevron', 16)}
        </button>

        <button class="decision-card" data-action="open-revision-modal" data-id="${r.id}">
          <span class="decision-icon" style="background:var(--amber-bg);color:var(--amber)">${ico('refresh', 20)}</span>
          <span><b>Kembalikan untuk Revisi Bukti (2-Way)</b><small>Minta teknisi melampirkan bukti tambahan yang spesifik.</small></span>
          ${ico('chevron', 16)}
        </button>

        <button class="decision-card" data-action="decision" data-decision="rejected" data-id="${r.id}">
          <span class="decision-icon" style="background:var(--red-bg);color:var(--red)">${ico('xCircle', 20)}</span>
          <span><b>Temuan tidak valid</b><small>Simpan keputusan tanpa memasukkan ke knowledge base.</small></span>
          ${ico('chevron', 16)}
        </button>
      </aside>
    </div>`;
}

function formatAiAnswer(text) {
  let res = esc(text)
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  res = res.replace(/\[(\d+)\]/g, (match, num) => {
    return `<button class="citation-pill" data-action="open-citation" data-citation-index="${num}" title="Buka bukti fisik asli sitasi [${num}]">[${num}]</button>`;
  });
  return res;
}

function askSynqraAI(queryText, assetTarget) {
  const q = (queryText || state.synqraQuery || '').trim();
  if (!q) {
    showToast('Tuliskan pertanyaan kasus atau pilih dari pertanyaan cepat.');
    return;
  }
  state.synqraQuery = q;
  state.isSearchingSynqra = true;
  render();

  let detectedAsset = assetTarget || null;
  if (!detectedAsset) {
    for (const a of assets) {
      if (q.toUpperCase().includes(a.id)) {
        detectedAsset = a.id;
        break;
      }
    }
  }

  const stopWords = ['dan', 'di', 'pada', 'yang', 'atau', 'ke', 'dari', 'ini', 'itu', 'untuk', 'ada', 'dengan', 'saya', 'apa', 'bagaimana', 'apakah', 'mengapa', 'adakah', 'bisa', 'saat'];
  const terms = q.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));

  const candidates = [];

  reports.forEach(r => {
    let score = 0;
    if (detectedAsset && r.asset === detectedAsset) score += 35;
    const corpus = `${r.id} ${r.title} ${r.symptom} ${r.description} ${r.asset} ${r.dept} ${r.praduga_penyebab || ''} ${r.cause || ''}`.toLowerCase();
    terms.forEach(t => {
      if (corpus.includes(t)) score += 12;
    });

    const isVerified = r.status === 'verified' || r.status === 'VERIFIED';
    if (isVerified) score += 100; // Prioritas utama untuk kasus VERIFIED!
    else if (r.status === 'PRADUGA' || r.status === 'more') score += 10;
    else score += 25;

    if (r.imageUrl || (r.evidence && !r.evidence.toLowerCase().includes('belum'))) score += 10;

    if (score > 10 || (detectedAsset && r.asset === detectedAsset)) {
      candidates.push({
        id: r.id,
        title: r.title,
        asset: r.asset,
        status: isVerified ? 'VERIFIED' : (r.status === 'more' ? 'PRADUGA' : r.status.toUpperCase()),
        symptom: r.symptom || r.description,
        cause: r.cause || r.praduga_penyebab || 'Dalam investigasi keandalan departemen.',
        solution: r.solution || r.usulan_tindakan || 'Tindakan mitigasi standar sesuai SOP kilang.',
        evidence: r.evidence || 'Dokumen inspeksi lapangan',
        imageUrl: r.imageUrl,
        score
      });
    }
  });

  knowledge.forEach(k => {
    let score = 0;
    if (detectedAsset && k.asset === detectedAsset) score += 35;
    const corpus = `${k.id} ${k.title} ${k.symptom} ${k.cause} ${k.solution} ${k.asset}`.toLowerCase();
    terms.forEach(t => {
      if (corpus.includes(t)) score += 12;
    });
    if (k.status === 'verified') score += 100;
    else score += 20;

    if (score > 10 || (detectedAsset && k.asset === detectedAsset)) {
      candidates.push({
        id: k.id,
        title: k.title,
        asset: k.asset,
        status: k.status === 'verified' ? 'VERIFIED' : 'INVESTIGASI',
        symptom: k.symptom,
        cause: k.cause,
        solution: k.solution,
        evidence: k.evidence || `Foto rekaman teknis ${k.asset}`,
        imageUrl: k.imageUrl || 'assets/synqra-logo-dark.png',
        score
      });
    }
  });

  candidates.sort((a, b) => b.score - a.score);

  const seenIds = new Set();
  const citations = [];
  for (const c of candidates) {
    if (!seenIds.has(c.id)) {
      seenIds.add(c.id);
      citations.push(c);
      if (citations.length === 3) break;
    }
  }

  if (citations.length === 0) {
    const defaultK = knowledge[0];
    citations.push({
      id: defaultK.id,
      title: defaultK.title,
      asset: defaultK.asset,
      status: 'VERIFIED',
      symptom: defaultK.symptom,
      cause: defaultK.cause,
      solution: defaultK.solution,
      evidence: `Berkas historis ${defaultK.asset}`,
      imageUrl: 'assets/synqra-logo-light.png',
      score: 100
    });
  }

  const hasPradugaWarning = citations.some(c => c.status === 'PRADUGA' || c.status === 'MORE' || c.status === 'TRIAGE' || c.status === 'INVESTIGATION' || c.status === 'SUBMITTED' || c.status === 'REVIEW');

  const c1 = citations[0];
  const c2 = citations[1];
  const c3 = citations[2];

  let answerText = `Berdasarkan penelusuran hibrida data operasional Supabase & riwayat verifikasi keandalan:\n\n` +
    `1. **Diagnosis Anomali & Temuan Lapangan**:\n` +
    `Pada peralatan **${c1.asset}**, analisis merujuk pada kasus **${c1.id}** [1] (${c1.status}). Gejala teramati adalah: "${c1.symptom}". ` +
    (c1.status === 'VERIFIED' ? `Kasus ini telah disahkan pakar dengan akar penyebab: **${c1.cause}** [1].` : `Status temuan masih **${c1.status}** dengan praduga penyebab: **${c1.cause}** [1].\n⚠️ Catatan: Kasus ini belum diverifikasi final oleh pakar HSE.`) +
    `\n\n2. **Validasi Bukti Fisik Asli (Supabase Storage)**:\n` +
    `Kondisi komponen terdokumentasi dalam file bukti **${c1.evidence}** [1]${c2 ? ` dan **${c2.evidence}** [2]` : ''}. Parameter vibrasi/tekanan telah dikomparasikan terhadap baseline operasional kilang.` +
    (c2 ? `\n\n3. **Korelasi Kasus Serupa**:\nSebagai data pembanding, kasus **${c2.id}** [2] (${c2.status}) pada unit ${c2.asset} mencatat anomali sejenis ("${c2.symptom}"). Solusi yang terbukti efektif adalah: **${c2.solution}** [2].` : '') +
    `\n\n4. **Rekomendasi Tindakan Korektif (CAPA)**:\n` +
    `Rekomendasi teknis: **${c1.solution}** [1]. Pastikan izin kerja aman (PTW) divalidasi dan verifikasi pasca-perbaikan dicatat dalam sistem SYNQRA.`;

  setTimeout(() => {
    state.isSearchingSynqra = false;
    state.synqraResult = {
      query: q,
      answer: answerText,
      citations,
      hasPradugaWarning
    };
    render();
    showToast('Tanya SYNQRA: Jawaban Gemini AI dan sitasi bukti siap ditinjau!');
  }, 350);
}

function openEvidenceModal(item, citationNum = null) {
  if (!item) return;
  const isVerified = item.status === 'VERIFIED' || item.status === 'verified';
  const badgeCls = isVerified ? 'verified' : 'praduga';
  const badgeLabel = isVerified ? 'TERVERIFIKASI' : (item.status || 'PRADUGA');
  const sitasiLabel = citationNum ? `SITASI [${citationNum}] · ` : '';

  $('#modal-root').innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <section class="modal evidence-lightbox-modal" role="dialog" aria-modal="true" style="max-width:680px;width:95%">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div class="eyebrow" style="color:var(--cyan-dark);margin:0">${sitasiLabel}DOKUMEN BUKTI ASLI (SUPABASE STORAGE)</div>
          <button class="btn btn-outline btn-sm" data-action="close-modal" style="padding:4px 10px">${ico('close', 16)} Tutup</button>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
          <h3 style="margin:0;font-size:18px">${esc(item.title || item.evidence || 'Dokumen Bukti')}</h3>
          <span class="status ${badgeCls}" style="font-size:11px;padding:3px 8px">${ico(isVerified ? 'checkCircle' : 'alert', 13)} ${badgeLabel}</span>
        </div>

        <div class="evidence-preview-box" style="border-radius:12px;overflow:hidden;background:#061428;border:1.5px solid var(--line);margin-bottom:16px;text-align:center">
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="Bukti Foto Lapangan" style="width:100%;max-height:340px;object-fit:contain;display:block;background:radial-gradient(circle,#0B254A 0%,#040D1A 100%)" />` : technicalDiagramMarkup(item.type || 'heat', item.asset, 'Skema Bukti Fisik')}
          <div style="padding:10px 14px;background:var(--surface);border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;font-size:12px">
            <span style="color:var(--ink-soft);font-family:'Poppins',sans-serif;font-weight:700">📁 ${esc(item.evidence || 'Dokumen Bukti Foto Fisik')}</span>
            <span style="color:var(--cyan-dark);font-weight:700">Aset: ${esc(item.asset)} (${item.id})</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;font-size:13px">
          <div style="padding:10px 12px;border-radius:10px;background:var(--soft);border:1px solid var(--line)">
            <b style="color:var(--amber);display:block;margin-bottom:3px;font-size:11px;text-transform:uppercase">Gejala Teramati</b>
            <p style="margin:0;color:var(--ink);line-height:1.45">${esc(item.symptom || 'Anomali dilaporkan.')}</p>
          </div>
          <div style="padding:10px 12px;border-radius:10px;background:var(--soft);border:1px solid var(--line)">
            <b style="color:var(--cyan-dark);display:block;margin-bottom:3px;font-size:11px;text-transform:uppercase">Akar Penyebab</b>
            <p style="margin:0;color:var(--ink);line-height:1.45">${esc(item.cause || item.praduga_penyebab || 'Dalam investigasi keandalan.')}</p>
          </div>
        </div>

        ${item.solution ? `
          <div style="padding:12px 14px;border-radius:10px;background:rgba(2,132,199,0.08);border:1.5px solid rgba(2,132,199,0.3);margin-bottom:16px;font-size:13px">
            <b style="color:var(--cyan-dark);display:block;margin-bottom:3px;font-size:11px;text-transform:uppercase">Tindakan Penyelesaian Terverifikasi (CAPA)</b>
            <p style="margin:0;color:var(--ink);font-weight:600;line-height:1.5">${esc(item.solution)}</p>
          </div>
        ` : ''}

        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button class="btn btn-primary btn-sm" data-action="close-modal">Selesai Meninjau Bukti</button>
        </div>
      </section>
    </div>
  `;
}

function renderKnowledge() {
  const activeAssetId = state.selectedKgAsset || 'P-101A';
  const activeAsset = assets.find(a => a.id === activeAssetId) || assets[0];
  
  const verifiedReports = reports.filter(r => r.asset === activeAssetId && (r.status === 'verified' || r.status === 'VERIFIED'));
  const allAssetReports = reports.filter(r => r.asset === activeAssetId);
  const assetKnowledge = knowledge.filter(k => k.asset === activeAssetId);

  const assetCases = [];
  assetKnowledge.forEach(k => {
    assetCases.push({
      id: k.id,
      title: k.title,
      asset: k.asset,
      status: k.status === 'verified' ? 'VERIFIED' : 'INVESTIGASI',
      symptom: k.symptom,
      cause: k.cause,
      solution: k.solution,
      evidence: k.evidence || `Dokumentasi Teknis ${k.asset}`,
      imageUrl: k.imageUrl || 'assets/synqra-logo-dark.png',
      isVerified: k.status === 'verified',
      type: k.type
    });
  });

  allAssetReports.forEach(r => {
    const isV = r.status === 'verified' || r.status === 'VERIFIED';
    if (!assetCases.some(c => c.id === r.id || c.id === `KB-${r.id.slice(-3)}`)) {
      if (state.kgFilterMode === 'ALL' || isV) {
        assetCases.push({
          id: r.id,
          title: r.title,
          asset: r.asset,
          status: isV ? 'VERIFIED' : (r.status === 'more' ? 'PRADUGA' : r.status.toUpperCase()),
          symptom: r.symptom || r.description,
          cause: r.cause || r.praduga_penyebab || 'Dalam investigasi keandalan.',
          solution: r.solution || r.usulan_tindakan || 'Tindakan mitigasi standar.',
          evidence: r.evidence || 'Dokumen inspeksi lapangan',
          imageUrl: r.imageUrl,
          isVerified: isV,
          type: activeAsset.type
        });
      }
    }
  });

  const activeCase = assetCases.find(c => c.id === state.activeKgCaseId) || assetCases[0] || {
    id: 'REF-001',
    title: `Kasus Acuan ${activeAsset.name}`,
    asset: activeAsset.id,
    status: 'VERIFIED',
    symptom: 'Parameter operasional dalam rentang toleransi standar.',
    cause: 'Pencegahan degradasi termal dan getaran berkala.',
    solution: 'Inspeksi berkala dan pemantauan sensor continuous.',
    evidence: 'Logbook operasional unit',
    imageUrl: 'assets/synqra-logo-light.png',
    isVerified: true,
    type: activeAsset.type
  };

  const q = state.knowledgeQuery.toLowerCase();
  const list = knowledge.filter(k => `${k.title} ${k.asset} ${k.assetName} ${k.symptom}`.toLowerCase().includes(q));

  return `
    ${pageHead('KNOWLEDGE BASE', 'Pusat Pengetahuan & Graf Pembuktian.', 'Temukan kasus serupa, rujukan bukti Supabase, dan analisis berbasis kecerdasan AI.', `<span class="env-label">${knowledge.length + verifiedReports.length} KASUS TERVERIFIKASI</span>`)}

    <!-- SECTION 1: TANYA SYNQRA AI (HYBRID SEARCH & GEMINI CITATIONS) -->
    <section class="card card-pad tanya-synqra-panel anim-in" style="margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:12px">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span class="eyebrow" style="color:var(--cyan-dark);display:flex;align-items:center;gap:5px;margin:0">
              ${ico('refresh', 16)} TANYA SYNQRA · GOOGLE GEMINI HYBRID SEARCH
            </span>
            <span class="status verified" style="font-size:10px;padding:2px 7px">SUPABASE CONTEXT &amp; SITASI [1], [2]</span>
          </div>
          <h3 style="margin:0;font-size:20px;font-weight:800;color:var(--ink)">Asisten Tanya Jawab Keandalan Berbasis Bukti Nyata</h3>
          <p style="margin:4px 0 0;font-size:13px;color:var(--ink-soft)">Pencarian hibrida mencocokkan kode aset, kata kunci gejala, dan data Supabase. Kasus berstatus VERIFIED otomatis diprioritaskan di posisi teratas.</p>
        </div>
      </div>

      <!-- Search Input Bar -->
      <div class="searchbar" style="margin-bottom:12px;box-shadow:var(--shadow-sm)">
        ${ico('search', 19)}
        <input id="synqra-query-input" value="${esc(state.synqraQuery)}" placeholder="Tanyakan kasus teknis (cth: 'P-101A getaran 7.8 mm/s', 'E-201 delta P naik', 'FCV-301 valve terlambat 8 detik')..." />
        <button class="btn btn-primary btn-sm" data-action="ask-synqra" style="white-space:nowrap;margin-left:8px">
          ${state.isSearchingSynqra ? 'Menganalisis...' : `${ico('send', 14)} Tanyakan ke Gemini`}
        </button>
      </div>

      <!-- Quick Sample Prompt Chips -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:16px">
        <small style="font-family:'Poppins',sans-serif;font-size:11px;font-weight:800;color:var(--cyan-dark);text-transform:uppercase">Pertanyaan Cepat:</small>
        <button class="prompt-chip" data-action="sample-prompt" data-prompt="Mengapa pompa P-101A mengalami kenaikan getaran 7.8 mm/s dan rembesan mechanical seal?" data-asset="P-101A">
          P-101A Getaran &amp; Rembesan Seal
        </button>
        <button class="prompt-chip" data-action="sample-prompt" data-prompt="Bagaimana penanganan kenaikan differential pressure dan penurunan suhu keluar pada heat exchanger E-201?" data-asset="E-201">
          E-201 Kenaikan &Delta;P &amp; Suhu Turun
        </button>
        <button class="prompt-chip" data-action="sample-prompt" data-prompt="Apa penyebab respon kendali katup FCV-301 melambat tertinggal 8 detik saat throttling DCS?" data-asset="FCV-301">
          FCV-301 Respons Lambat 8 Detik
        </button>
        <button class="prompt-chip" data-action="sample-prompt" data-prompt="Apakah ada temuan rembesan gas hidrokarbon flange yang belum diverifikasi bukti fotonya?" data-asset="E-201">
          E-201 Rembesan Flange (PRADUGA)
        </button>
      </div>

      <!-- Dynamic Result Container -->
      ${state.synqraResult ? `
        <div class="tanya-result-box anim-in" style="border-top:1px solid var(--line-soft);padding-top:16px">
          
          <!-- PRADUGA WARNING BOX (Mandatory Rule) -->
          ${state.synqraResult.hasPradugaWarning ? `
            <div class="warning-praduga-box">
              <span style="color:var(--amber);font-size:22px;line-height:1;margin-top:2px">${ico('alert', 22)}</span>
              <div>
                <b>PERINGATAN KNOWLEDGE BASE · STATUS PRADUGA TERDETEKSI</b>
                Hasil sintesis AI merujuk kasus berstatus <u>PRADUGA</u> / <u>DALAM INVESTIGASI</u> yang belum disahkan oleh Pakar HSE / Process Safety. Gunakan sebagai pertimbangan awal dan wajib lakukan verifikasi fisik di lapangan sebelum intervensi teknis.
              </div>
            </div>
          ` : `
            <div style="padding:10px 14px;border-radius:10px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);color:var(--green);font-size:12.5px;margin-bottom:14px;display:flex;align-items:center;gap:8px">
              ${ico('checkCircle', 16)} <b>PRIORITAS STANDAR:</b> Rujukan didominasi oleh kasus yang telah disahkan (VERIFIED) oleh Pakar Keandalan.
            </div>
          `}

          <!-- Synthesized AI Answer with Clickable [1], [2] Citations -->
          <div class="ai-answer-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span style="font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;color:var(--cyan-dark);display:flex;align-items:center;gap:6px">
                ${ico('book', 15)} RANGKUMAN TANYA SYNQRA (GEMINI API)
              </span>
              <small class="muted" style="font-size:11px">Klik sitasi [1], [2] untuk membuka foto/dokumen bukti fisik asli.</small>
            </div>
            <div class="ai-answer-content" style="font-size:14px;line-height:1.65;color:var(--ink)">
              ${formatAiAnswer(state.synqraResult.answer)}
            </div>
          </div>

          <!-- Citations Grid (Bukti Lapangan) -->
          <div style="margin-top:16px">
            <div style="font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;color:var(--ink);margin-bottom:8px;display:flex;align-items:center;gap:6px">
              ${ico('file', 15)} DAFTAR SITASI BUKTI ASLI SUPABASE (${state.synqraResult.citations.length} RUJUKAN):
            </div>
            <div class="citations-grid">
              ${state.synqraResult.citations.map((c, i) => `
                <div class="citation-card-item">
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                      <span class="citation-pill" data-action="open-citation" data-citation-index="${i + 1}">[${i + 1}]</span>
                      <span class="status ${c.status === 'VERIFIED' ? 'verified' : 'praduga'}" style="font-size:10px;padding:2px 6px">
                        ${ico(c.status === 'VERIFIED' ? 'checkCircle' : 'alert', 12)} ${c.status}
                      </span>
                    </div>
                    <b style="display:block;font-size:13px;color:var(--ink);margin-bottom:3px">${esc(c.title)}</b>
                    <div style="font-size:11.5px;color:var(--cyan-dark);font-weight:700;margin-bottom:4px">Aset: ${c.asset} · ${c.id}</div>
                    <p style="font-size:12px;color:var(--ink-soft);margin:0 0 8px;line-height:1.4">${esc(c.symptom).slice(0, 85)}...</p>
                  </div>
                  <button class="btn btn-outline btn-sm btn-full" data-action="open-citation" data-citation-index="${i + 1}" style="font-size:11.5px;padding:6px">
                    ${ico('camera', 13)} Buka Dokumen Bukti [${i + 1}]
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      ` : ''}
    </section>

    <!-- SECTION 2: KNOWLEDGE GRAPH TERISOLASI PER ASET (5 TINGKAT: ASET -> KASUS -> GEJALA -> PENYEBAB -> FILE BUKTI) -->
    <section class="card card-pad anim-in anim-delay-1" style="margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:16px;border-bottom:1px solid var(--line-soft);padding-bottom:14px">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span class="eyebrow" style="color:var(--cyan-dark);margin:0">KNOWLEDGE GRAPH TERISOLASI PER ASET</span>
            <span class="status verified" style="font-size:10px;padding:2px 7px">5 TINGKAT RANTAI BUKTI</span>
          </div>
          <h3 style="margin:0;font-size:19px;font-weight:800;color:var(--ink)">
            Graf Pengetahuan: Aset &rarr; Kasus &rarr; Gejala &rarr; Penyebab &rarr; File Bukti
          </h3>
          <p style="margin:4px 0 0;font-size:13px;color:var(--ink-soft)">
            Data graf terisolasi secara mandiri untuk setiap peralatan kilang. Setiap temuan baru yang disahkan pakar (VERIFIED) otomatis masuk ke rantai pembuktian aset ini.
          </p>
        </div>

        <!-- Asset Tabs -->
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
          ${assets.map(a => {
            const isSel = a.id === activeAssetId;
            const vCount = reports.filter(r => r.asset === a.id && (r.status === 'verified' || r.status === 'VERIFIED')).length + knowledge.filter(k => k.asset === a.id && k.status === 'verified').length;
            return `
              <button class="kg-asset-pill-btn ${isSel ? 'active' : ''}" data-action="select-kg-asset" data-asset="${a.id}">
                <span>${a.id}</span>
                <small style="font-size:10px;padding:1px 5px;border-radius:4px;background:rgba(0,0,0,0.2)">${vCount} Terverifikasi</small>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Detail Subgrid for Isolated Asset -->
      <div class="detail-grid">
        
        <!-- Left Column: Asset Identity & Case Switcher -->
        <div>
          ${technicalDiagramMarkup(activeAsset.type, activeAsset.id, `Skema Teknis ${activeAsset.name} · ${activeAsset.area}`)}
          
          <div style="margin-top:16px;padding:14px;border-radius:12px;background:var(--soft);border:1px solid var(--line)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <span class="eyebrow" style="color:var(--cyan-dark);margin:0">${activeAsset.id}</span>
              <span class="status verified" style="font-size:11px">${verifiedReports.length + assetKnowledge.length} Kasus Terdata</span>
            </div>
            <h4 style="margin:0;font-size:16px;color:var(--ink)">${esc(activeAsset.name)}</h4>
            <p style="margin:4px 0 0;font-size:12.5px;color:var(--ink-soft)">${esc(activeAsset.area)} · Dept: ${esc(activeAsset.dept)}</p>
          </div>

          <!-- Case Selection within this Asset -->
          <div style="margin-top:16px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <small style="font-family:'Poppins',sans-serif;font-size:11.5px;font-weight:800;color:var(--ink);text-transform:uppercase">
                Kasus Terhubung (${assetCases.length}):
              </small>
              <div style="display:flex;gap:4px">
                <button class="btn btn-outline btn-sm ${state.kgFilterMode === 'VERIFIED_ONLY' ? 'active' : ''}" data-action="set-kg-filter" data-filter="VERIFIED_ONLY" style="padding:2px 8px;font-size:10.5px">Hanya Verified</button>
                <button class="btn btn-outline btn-sm ${state.kgFilterMode === 'ALL' ? 'active' : ''}" data-action="set-kg-filter" data-filter="ALL" style="padding:2px 8px;font-size:10.5px">Semua</button>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px">
              ${assetCases.map(c => {
                const isAct = c.id === activeCase.id;
                return `
                  <button class="quick-action ${isAct ? 'highlight-pulse' : ''}" data-action="select-kg-case" data-case-id="${c.id}" style="border-color:${isAct ? 'var(--cyan)' : 'var(--line)'};padding:10px 12px">
                    <span class="quick-icon" style="background:${c.isVerified ? 'var(--green-bg)' : 'var(--amber-bg)'};color:${c.isVerified ? 'var(--green)' : 'var(--amber)'}">${ico(c.isVerified ? 'checkCircle' : 'alert', 16)}</span>
                    <span style="text-align:left">
                      <b style="font-size:12.5px;display:block">${esc(c.title)}</b>
                      <small style="font-size:11px;color:var(--ink-soft)">${c.id} · ${c.status}</small>
                    </span>
                    <span class="arrow">${ico('chevron', 14)}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column: The 5-Tier Isolated Chain Flow -->
        <div>
          <div style="padding:14px 16px;border-radius:12px;background:var(--navy);color:#fff;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <span style="font-family:'Poppins',sans-serif;font-size:11px;font-weight:800;color:var(--cyan);text-transform:uppercase;display:block">
                RANTAI PEMBUKTIAN AKTIF
              </span>
              <b style="font-size:14px">${activeCase.id}: ${esc(activeCase.title)}</b>
            </div>
            <span class="status ${activeCase.isVerified ? 'verified' : 'praduga'}" style="font-size:11px">
              ${ico(activeCase.isVerified ? 'checkCircle' : 'alert', 13)} ${activeCase.status}
            </span>
          </div>

          <!-- 5 Tiers Vertical Flow with Step Connections -->
          <div class="kg-5tier-vertical-flow">
            
            <!-- TIER 1: ASET -->
            <div class="kg-step-box">
              <div class="kg-step-num" style="background:var(--cyan);color:#061A38">1</div>
              <div class="kg-step-content" style="border-left:3px solid var(--cyan)">
                <span class="kg-step-label" style="color:var(--cyan)">TINGKAT 1 · ASET UTAMA</span>
                <b>${esc(activeAsset.name)} (${activeAsset.id})</b>
                <p>${esc(activeAsset.area)} · Divisi ${esc(activeAsset.dept)}</p>
              </div>
            </div>

            <div class="kg-step-connector"></div>

            <!-- TIER 2: KASUS -->
            <div class="kg-step-box">
              <div class="kg-step-num" style="background:#0284C7;color:#fff">2</div>
              <div class="kg-step-content" style="border-left:3px solid #0284C7">
                <span class="kg-step-label" style="color:#0284C7">TINGKAT 2 · KASUS TERDATA</span>
                <b>${activeCase.id} — ${esc(activeCase.title)}</b>
                <p>Status Kasus: <b>${activeCase.status}</b></p>
              </div>
            </div>

            <div class="kg-step-connector"></div>

            <!-- TIER 3: GEJALA -->
            <div class="kg-step-box">
              <div class="kg-step-num" style="background:var(--amber);color:#061A38">3</div>
              <div class="kg-step-content" style="border-left:3px solid var(--amber)">
                <span class="kg-step-label" style="color:var(--amber)">TINGKAT 3 · GEJALA TERAMATI</span>
                <b>${esc(activeCase.symptom)}</b>
                <p>Terdeteksi dari sensor &amp; observasi teknisi lapangan.</p>
              </div>
            </div>

            <div class="kg-step-connector"></div>

            <!-- TIER 4: AKAR PENYEBAB -->
            <div class="kg-step-box">
              <div class="kg-step-num" style="background:#A855F7;color:#fff">4</div>
              <div class="kg-step-content" style="border-left:3px solid #A855F7">
                <span class="kg-step-label" style="color:#A855F7">TINGKAT 4 · AKAR PENYEBAB (RCA) &amp; CAPA</span>
                <b>${esc(activeCase.cause)}</b>
                <p style="margin-top:4px"><span style="color:var(--green);font-weight:700">Rekomendasi Tindakan:</span> ${esc(activeCase.solution)}</p>
              </div>
            </div>

            <div class="kg-step-connector"></div>

            <!-- TIER 5: FILE BUKTI FISIK -->
            <div class="kg-step-box">
              <div class="kg-step-num" style="background:var(--green);color:#061A38">5</div>
              <div class="kg-step-content" style="border-left:3px solid var(--green)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                  <span class="kg-step-label" style="color:var(--green)">TINGKAT 5 · FILE BUKTI LAPANGAN (SUPABASE STORAGE)</span>
                  <span class="status verified" style="font-size:10px;padding:1px 6px">TERHUBUNG</span>
                </div>
                <b>📁 ${esc(activeCase.evidence || 'Dokumen Rekaman Fisik')}</b>
                <p style="margin:4px 0 10px">Bukti foto resolusi tinggi &amp; rekaman spektrum getaran terikat pada kasus.</p>
                <button class="btn btn-primary btn-sm" data-action="open-evidence-item" data-case-id="${activeCase.id}">
                  ${ico('camera', 14)} Buka File Bukti Asli &amp; Metadata
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 3: DAFTAR KARTU KNOWLEDGE BASE -->
    <div style="margin-top:20px">
      <div class="card-title" style="margin-bottom:12px">
        <div>
          <h3 style="font-size:17px;font-weight:800;color:var(--ink)">Katalog Artikel Solusi Terverifikasi</h3>
          <p style="font-size:13px;color:var(--ink-soft)">Daftar seluruh panduan penanganan kegagalan mesin kilang yang telah disetujui tim reliability.</p>
        </div>
      </div>
      <div class="searchbar" style="margin-bottom:20px">
        ${ico('search', 19)}
        <input id="knowledge-search" value="${esc(state.knowledgeQuery)}" placeholder="Cari gejala, nama peralatan, atau tag aset..." />
      </div>
      <div class="grid grid-3">
        ${list.map((k, idx) => `
          <article class="card knowledge-card tilt-card anim-in anim-delay-${(idx % 3) + 1}">
            <div class="knowledge-visual">${equipmentArt(k.type)}</div>
            <div class="knowledge-body">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                <span class="eyebrow">${k.id}</span>
                ${statusPill(k.status === 'verified' ? 'verified' : 'review')}
              </div>
              <h3>${esc(k.title)}</h3>
              <div class="kb-asset-sub">${esc(k.assetName)} · ${k.asset}</div>
              <div class="kb-symptom-preview">${esc(k.symptom)}</div>
              <button class="btn btn-outline btn-sm btn-full" style="margin-top:16px" data-knowledge="${k.id}">
                Buka pengetahuan ${ico('arrow', 15)}
              </button>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function renderKnowledgeDetail() {
  const k = knowledge.find(x => x.id === state.knowledgeId) || knowledge[0];
  const asset = assets.find(a => a.id === k.asset) || assets[0];
  const related = knowledge.filter(x => x.asset === k.asset && x.id !== k.id);
  const kgCopy = {
    asset: { label: `ASET · ${k.asset}`, text: `${k.assetName} (${asset.area}) — ${k.cases} catatan kasus terhubung.` },
    symptom: { label: 'GEJALA TERAMATI', text: k.symptom },
    cause: { label: 'AKAR PENYEBAB', text: k.cause },
    solution: { label: 'SOLUSI REKOMENDASI', text: k.solution },
    result: { label: 'HASIL VERIFIKASI', text: k.result }
  };
  const currentKg = kgCopy[state.activeKgNode] || kgCopy.asset;

  return `${pageHead('DETAIL PENGETAHUAN', esc(k.title), `${k.id} · ${k.assetName} (${k.asset})`, `<button class="btn btn-outline" data-page="knowledge">${ico('back', 16)} Kembali</button>`)}
    <div class="detail-grid">
      <section class="card card-pad anim-in">
        ${technicalDiagramMarkup(k.type, k.asset, `Skema Teknis ${k.assetName} · ${asset.area}`)}
        <div class="card-title" style="margin-top:22px"><div><h3>${esc(k.assetName)}</h3><p>${k.asset} · ${asset.area} · ${k.cases} kasus terkait</p></div>${statusPill(k.status)}</div>
        <div class="kb-blocks">
          <div class="kb-block block-symptom ${state.activeKgNode === 'symptom' ? 'highlight-pulse' : ''}" id="kb-sec-symptom"><div class="kb-block-label">${ico('alert', 16)} Gejala Lapangan</div><p class="kb-block-body">${esc(k.symptom)}</p></div>
          <div class="kb-block block-cause ${state.activeKgNode === 'cause' ? 'highlight-pulse' : ''}" id="kb-sec-cause"><div class="kb-block-label">${ico('search', 16)} Akar Penyebab</div><p class="kb-block-body">${esc(k.cause)}</p></div>
          <div class="kb-block block-solution ${state.activeKgNode === 'solution' ? 'highlight-pulse' : ''}" id="kb-sec-solution"><div class="kb-block-label">${ico('wrench', 16)} Solusi Rekomendasi</div><p class="kb-block-body">${esc(k.solution)}</p></div>
          <div class="kb-block block-result ${state.activeKgNode === 'result' ? 'highlight-pulse' : ''}" id="kb-sec-result"><div class="kb-block-label">${ico('checkCircle', 16)} Hasil Verifikasi</div><p class="kb-block-body">${esc(k.result)}</p></div>
        </div>
      </section>
      <aside class="card card-pad anim-in anim-delay-1">
        <div class="card-title"><div><h3>Knowledge Graph Interaktif</h3><p>Klik node untuk menyorot bukti & keterkaitan.</p></div></div>
        <div class="kg-interactive">
          <div class="kg-svg-wrap">
            <svg class="kg-svg" viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg">
              <path class="kg-flow-path" d="M180 42 L95 104 M180 42 L265 104 M95 128 L180 182 M265 128 L180 182"/>
              <path class="kg-flow-pulse" d="M180 42 L95 104 M180 42 L265 104 M95 128 L180 182 M265 128 L180 182"/>
              <g class="kg-node-btn" data-kg-node="asset"><rect x="115" y="14" width="130" height="36" rx="9" fill="${state.activeKgNode === 'asset' ? '#00B8D9' : '#13315C'}" stroke="#67E8F9" stroke-width="1.6"/><text x="180" y="37" text-anchor="middle" fill="${state.activeKgNode === 'asset' ? '#061A38' : '#FFFFFF'}" font-family="Poppins,sans-serif" font-size="13" font-weight="700">${esc(k.asset)}</text></g>
              <g class="kg-node-btn" data-kg-node="symptom"><rect x="26" y="96" width="138" height="36" rx="9" fill="${state.activeKgNode === 'symptom' ? '#F59E0B' : '#1A365D'}" stroke="#FCD34D" stroke-width="1.5"/><text x="95" y="119" text-anchor="middle" fill="${state.activeKgNode === 'symptom' ? '#061A38' : '#FFFFFF'}" font-family="Poppins,sans-serif" font-size="12.5" font-weight="700">Gejala</text></g>
              <g class="kg-node-btn" data-kg-node="cause"><rect x="196" y="96" width="138" height="36" rx="9" fill="${state.activeKgNode === 'cause' ? '#EF4444' : '#1A365D'}" stroke="#FCA5A5" stroke-width="1.5"/><text x="265" y="119" text-anchor="middle" fill="#FFFFFF" font-family="Poppins,sans-serif" font-size="12.5" font-weight="700">Penyebab</text></g>
              <g class="kg-node-btn" data-kg-node="solution"><rect x="26" y="168" width="138" height="36" rx="9" fill="${state.activeKgNode === 'solution' ? '#0284C7' : '#1A365D'}" stroke="#7DD3FC" stroke-width="1.5"/><text x="95" y="191" text-anchor="middle" fill="#FFFFFF" font-family="Poppins,sans-serif" font-size="12.5" font-weight="700">Solusi</text></g>
              <g class="kg-node-btn" data-kg-node="result"><rect x="196" y="168" width="138" height="36" rx="9" fill="${state.activeKgNode === 'result' ? '#10B981' : '#1A365D'}" stroke="#6EE7B7" stroke-width="1.5"/><text x="265" y="191" text-anchor="middle" fill="${state.activeKgNode === 'result' ? '#061A38' : '#FFFFFF'}" font-family="Poppins,sans-serif" font-size="12.5" font-weight="700">Verifikasi</text></g>
            </svg>
          </div>
          <div class="kg-inspector-box"><small>${currentKg.label}</small><p>${esc(currentKg.text)}</p></div>
        </div>
        <div style="margin-top:24px"><div class="card-title"><div><h3>Pengetahuan terkait</h3><p>Kasus lain pada peralatan yang sama.</p></div></div>${related.length ? related.map(x => `<button class="quick-action" style="margin-bottom:10px" data-knowledge="${x.id}"><span class="quick-icon">${ico('file', 20)}</span><span><b>${esc(x.title)}</b><small>${x.id} · ${x.asset}</small></span><span class="arrow">${ico('chevron', 16)}</span></button>`).join('') : `<p class="muted small">Belum ada kasus lain pada peralatan ini.</p>`}</div>
      </aside>
    </div>`;
}

function renderValidationHistory() {
  const list = reports.filter(r => r.status === 'verified' || r.status === 'rejected');
  return `${pageHead('RIWAYAT VALIDASI', 'Keputusan yang sudah ditetapkan.', 'Jejak keputusan validator untuk menjaga keterlacakan temuan.')}<section class="card card-pad"><div class="table-wrap"><table><thead><tr><th>Temuan</th><th>Peralatan</th><th>Pelapor</th><th>Keputusan</th><th>Validator</th><th></th></tr></thead><tbody>${list.map(r => `<tr><td><b>${esc(r.title)}</b><br><small class="muted">${r.id} · ${r.date}</small></td><td>${r.asset}</td><td>${esc(r.reporter)}</td><td>${statusPill(r.status)}</td><td>${esc(r.verifiedBy || 'Rina Suryani')}</td><td><button class="text-link" data-report="${r.id}">Detail ${ico('chevron', 14)}</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderPopover() {
  const root = $('#popover-root');
  if (!root) return;
  if (!state.activePopover) { root.innerHTML = ''; return; }
  if (state.activePopover === 'notifications') {
    root.innerHTML = `<div class="popover-backdrop" data-action="close-popover"></div><div class="popover-panel"><div class="popover-head"><b>Notifikasi Terbaru</b><button class="text-link" data-action="close-popover">Tutup</button></div>${reports.slice(0, 3).map(r => `<button class="notif-item" data-report="${r.id}"><span class="timeline-dot">${ico('bell', 15)}</span><span><b>${esc(r.title)}</b><small>${r.id} · ${r.asset} · ${statusInfo(r.status)[0]}</small></span></button>`).join('')}</div>`;
  } else if (state.activePopover === 'user-menu') {
    root.innerHTML = `<div class="popover-backdrop" data-action="close-popover"></div><div class="popover-panel"><div class="popover-head"><b>Ganti Peran Demo Cepat</b><button class="text-link" data-action="close-popover">Tutup</button></div>${Object.values(roles).map(r => `<button class="notif-item" data-switch-role="${r.key}"><span class="avatar" style="width:36px;height:36px;font-size:12px">${r.initials}</span><span><b>${r.name} ${state.user.key === r.key ? '(Aktif)' : ''}</b><small>${r.role} · ${r.team}</small></span></button>`).join('')}</div>`;
  }
}

/* INTERACTIVE FX & CONSTELLATION */
function stopLoops() {
  if (state.activeLoginLoop) { cancelAnimationFrame(state.activeLoginLoop); state.activeLoginLoop = null; }
}

function initLoginConstellation() {
  const c = $('#login-constellation');
  if (!c) return;
  const ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pts = Array.from({ length: 28 }, () => ({ x: Math.random() * c.clientWidth, y: Math.random() * c.clientHeight, vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45 }));
  function tick() {
    const w = c.clientWidth, h = c.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(103, 232, 249, 0.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(103, 232, 249, ${(1 - dist / 130) * 0.22})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    state.activeLoginLoop = requestAnimationFrame(tick);
  }
  tick();
}

function bindInteractiveFX() {
  stopLoops();
  $$('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      card.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 6).toFixed(2)}deg) rotateY(${((x - 0.5) * 6).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
  $$('[data-count]').forEach(el => {
    const target = Number(el.dataset.count) || 0;
    let cur = 0;
    const step = () => { cur += Math.ceil((target - cur) / 4); el.textContent = cur; if (cur < target) requestAnimationFrame(step); };
    if (target > 0) { el.textContent = '0'; requestAnimationFrame(step); }
  });
  initLoginConstellation();
}

function renderApp() {
  const map = { home: renderHome, 'my-reports': renderMyReports, 'new-report': renderNewReport, 'report-detail': renderReportDetail, 'review-queue': renderReviewQueue, 'review-detail': renderReviewDetail, 'department-cases': renderDepartmentCases, 'validation-queue': renderValidationQueue, 'validation-detail': renderValidationDetail, knowledge: renderKnowledge, 'knowledge-detail': renderKnowledgeDetail, 'validation-history': renderValidationHistory };
  return `<div class="app-shell">${renderSidebar()}<div class="main-column">${renderTopbar()}<main class="content">${(map[state.page] || renderHome)()}</main></div></div>${renderBottomNav()}`;
}

function render() {
  $('#app').innerHTML = state.user ? renderApp() : renderLogin();
  renderPopover();
  bindInteractiveFX();
}

function login(roleKey) {
  state.user = roles[roleKey]; state.selectedRole = roleKey; state.page = 'home'; state.activePopover = null;
  render(); showToast(`Mode demo ${state.user.role} aktif.`);
}

function extract7Entities(text, assetId) {
  const a = assets.find(x => x.id === assetId) || assets[0];
  const upper = text.toUpperCase();
  return {
    identitas_alat: `${a.name} (${a.id})`,
    gejala: text.slice(0, 140) || 'Anomali operasional dan fluktuasi parameter.',
    kondisi_operasi: upper.includes('BAR') || upper.includes('SUHU') || upper.includes('DEBIT') ? text.slice(0, 100) : 'Unit beroperasi pada kapasitas 85% - 95% beban normal.',
    pemeriksaan_awal: 'Pemeriksaan fisik visual dan pengukuran lapangan mengonfirmasi anomali.',
    praduga_penyebab: a.type === 'pump' ? 'Keausan mechanical seal atau misalignment kopling poros.' : a.type === 'heat' ? 'Akumulasi deposit kerak (fouling) pada dinding tube bundle.' : 'Hambatan gerakan stem katup dan deviasi kalibrasi positioner.',
    usulan_tindakan: a.type === 'pump' ? 'Laser alignment ulang dan penggantian gasket seal.' : a.type === 'heat' ? 'Backwash kimiawi dan hydro-cleaning berkala.' : 'Pelumasan stem packing dan kalibrasi smart positioner.',
    verifikasi: 'Uji jalan dan verifikasi parameter operasional kembali dalam batas aman.'
  };
}

function resetDraft() {
  clearInterval(state.recordingTimer);
  if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
    try { state.mediaRecorder.stop(); } catch(e) {}
  }
  state.selectedAsset = null; state.reportMode = 'voice'; state.draftText = ''; state.transcriptReady = false; state.recording = false; state.seconds = 0; state.imageName = '';
  state.entities = null; state.nameplateTag = ''; state.audioBlob = null; state.audioChunks = [];
  if (state.imageUrl) URL.revokeObjectURL(state.imageUrl); state.imageUrl = null;
}

async function beginRecording() {
  if (state.recording) {
    if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
      try { state.mediaRecorder.stop(); } catch(e) {}
    }
    clearInterval(state.recordingTimer); state.recording = false;
    const selected = assets.find(a => a.id === state.selectedAsset) || assets[0];
    const samples = {
      heat: `Heat Exchanger ${selected.id} mengalami kenaikan differential pressure dan suhu keluar turun sekitar 12 derajat. Terlihat indikasi deposit pada sisi tube bundle.`,
      pump: `Pompa sentrifugal ${selected.id} mengalami peningkatan getaran sejak awal shift (7,8 mm/s). Terlihat rembesan di area mechanical seal dan suhu bearing meningkat.`,
      valve: `Control Valve ${selected.id} merespons perintah lambat, tertinggal sekitar delapan detik dari sinyal perintah. Perlu pemeriksaan actuator dan positioner.`
    };
    if (!state.draftText) state.draftText = samples[selected.type] || samples.heat;
    state.entities = extract7Entities(state.draftText, selected.id);
    state.transcriptReady = true; render(); showToast('Rekaman suara selesai. Ekstraksi 7 entitas siap ditinjau.');
  } else {
    state.recording = true; state.seconds = 0;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        state.audioChunks = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mr = new MediaRecorder(stream);
        mr.ondataavailable = e => { if (e.data.size > 0) state.audioChunks.push(e.data); };
        mr.onstop = () => {
          state.audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
          stream.getTracks().forEach(t => t.stop());
        };
        state.mediaRecorder = mr;
        mr.start();
      } catch (err) {
        console.warn('Microphone access fallback to simulation:', err);
      }
    }
    render();
    state.recordingTimer = setInterval(() => {
      state.seconds++;
      const el = $('.voice-panel small');
      if (el) el.textContent = `Durasi ${String(Math.floor(state.seconds / 60)).padStart(2, '0')}:${String(state.seconds % 60).padStart(2, '0')} · Tekan tombol untuk selesai`;
    }, 1000);
  }
}

function submitReport() {
  if (!state.selectedAsset || !state.draftText.trim()) { showToast('Pilih peralatan dan isi uraian temuan dahulu.'); return; }
  const a = assets.find(x => x.id === state.selectedAsset);
  const title = state.draftText.toLowerCase().includes('getar') ? 'Getaran peralatan meningkat' : state.draftText.toLowerCase().includes('rembes') ? 'Indikasi kebocoran / rembesan' : `Temuan baru pada ${a.name}`;
  const id = 'RPT-' + (1049 + reports.length);
  const keptUrl = state.imageUrl, keptName = state.imageName;
  const ent = state.entities || extract7Entities(state.draftText, a.id);
  const editTarget = state.editReportId ? reports.find(r => r.id === state.editReportId) : null;
  if (editTarget) {
    Object.assign(editTarget, { title, asset: a.id, symptom: ent.gejala, description: state.draftText, dept: a.dept, status: 'PRADUGA', date: `${nowLabel()} · Dilengkapi`, note: '', evidence: keptName || editTarget.evidence, imageUrl: keptUrl || editTarget.imageUrl, source: state.reportMode, ...ent });
    state.imageUrl = null; state.editReportId = null; resetDraft(); state.activeReport = editTarget.id; state.page = 'report-detail'; render(); showToast('Laporan dilengkapi & dikirim (Status: PRADUGA).'); return;
  }
  reports.unshift({ id, title, asset: a.id, symptom: ent.gejala, description: state.draftText, reporter: state.user.name, reporterRole: state.user.role, dept: a.dept, date: `${nowLabel()} · Demo`, status: 'PRADUGA', evidence: keptName || 'Bukti foto belum dilampirkan', imageUrl: keptUrl, priority: 'medium', source: state.reportMode, ...ent });
  state.imageUrl = null; resetDraft(); state.activeReport = id; state.page = 'report-detail'; render(); showToast('Laporan berhasil dikirim. Status awal terkunci: PRADUGA.');
}

function openReport(id) {
  state.activeReport = id; state.activePopover = null;
  const r = reports.find(x => x.id === id);
  state.page = state.user.key === 'reviewer' && ['submitted', 'more'].includes(r?.status) ? 'review-detail' : state.user.key === 'validator' && r?.status === 'validation' ? 'validation-detail' : 'report-detail';
  render();
}

function openDecisionModal(id, decision, initialNote = '') {
  const labels = { verified: 'Sahkan temuan ini?', more: 'Minta bukti tambahan?', rejected: 'Tandai temuan tidak valid?' };
  const desc = { verified: 'Temuan akan masuk ke Knowledge Base sebagai temuan terverifikasi.', more: 'Laporan akan dikembalikan untuk dilengkapi teknisi.', rejected: 'Keputusan penolakan dicatat dalam riwayat validasi.' };
  $('#modal-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true"><div class="eyebrow">KONFIRMASI KEPUTUSAN</div><h3>${labels[decision]}</h3><p>${desc[decision]}</p><div class="field"><label for="decision-reason">Alasan / catatan validator</label><textarea id="decision-reason" class="control" rows="4" placeholder="Tuliskan dasar keputusan...">${esc(initialNote)}</textarea></div><div class="modal-actions"><button class="btn btn-outline" data-action="close-modal">Batal</button><button class="btn btn-primary" data-action="confirm-decision" data-decision="${decision}" data-id="${id}">Konfirmasi</button></div></section></div>`;
}

function confirmDecision(id, decision) {
  const r = reports.find(x => x.id === id); if (!r) return;
  const note = $('#decision-reason')?.value.trim() || '';
  if (note.length < 5) { showToast('Tambahkan alasan singkat minimal 5 karakter.'); return; }
  r.status = decision; r.note = note; r.verifiedBy = state.user.name;
  if (decision === 'verified') {
    const a = assets.find(x => x.id === r.asset) || assets[0];
    state.selectedKgAsset = r.asset;
    if (!knowledge.some(k => k.id === `KB-${r.id.slice(-3)}`)) {
      knowledge.unshift({
        id: `KB-${r.id.slice(-3)}`,
        title: r.title,
        asset: r.asset,
        assetName: `${a.name} · ${a.subtitle}`,
        symptom: r.symptom,
        cause: note,
        solution: r.usulan_tindakan || 'Tindakan korektif mengikuti standar prosedur perawatan aset.',
        result: 'Temuan disahkan oleh validator ahli.',
        cases: 1,
        tags: ['Terverifikasi', a.dept],
        type: a.type,
        status: 'verified',
        evidence: r.evidence,
        imageUrl: r.imageUrl,
        reportId: r.id
      });
    }
  }
  $('#modal-root').innerHTML = ''; state.page = 'validation-queue'; render(); showToast('Keputusan validasi berhasil disimpan.');
}

document.addEventListener('click', e => {
  const sw = e.target.closest('[data-switch-role]'); if (sw) { login(sw.dataset.switchRole); return; }
  const role = e.target.closest('[data-role]'); if (role) { state.selectedRole = role.dataset.role; render(); return; }
  const kg = e.target.closest('[data-kg-node]'); if (kg) { state.activeKgNode = kg.dataset.kgNode; render(); return; }
  const page = e.target.closest('[data-page]');
  if (page) {
    const next = page.dataset.page;
    if (next === 'new-report' && state.user.key !== 'technician') { showToast('Pembuatan laporan khusus untuk teknisi.'); return; }
    if (next === 'new-report') { resetDraft(); if (page.dataset.startMode) state.reportMode = page.dataset.startMode; }
    goto(next); return;
  }
  const act = e.target.closest('[data-action]');
  if (act) {
    const a = act.dataset.action;
    if (a === 'theme') return toggleTheme();
    if (a === 'logout') { state.user = null; state.page = 'login'; state.activePopover = null; resetDraft(); render(); return; }
    if (a === 'notifications' || a === 'user-menu') { state.activePopover = state.activePopover === a ? null : a; renderPopover(); return; }
    if (a === 'close-popover') { state.activePopover = null; renderPopover(); return; }
    if (a === 'toggle-record') return beginRecording();
    if (a === 'gemini-extract') {
      const selected = assets.find(x => x.id === state.selectedAsset) || assets[0];
      state.entities = extract7Entities(state.draftText, selected.id);
      render();
      showToast('Gemini AI: 7 entitas kegagalan berhasil diekstrak!');
      return;
    }
    if (a === 'submit-report') return submitReport();
    if (a === 'remove-photo') { if (state.imageUrl) URL.revokeObjectURL(state.imageUrl); state.imageUrl = null; state.imageName = ''; render(); return; }
    if (a === 'complete-report') { const r = reports.find(x => x.id === act.dataset.id); if (!r) return; state.editReportId = r.id; state.selectedAsset = r.asset; state.reportMode = 'text'; state.draftText = r.description; state.page = 'new-report'; render(); return; }
    if (a === 'forward-report') { const r = reports.find(x => x.id === act.dataset.id); if (r) { r.status = 'validation'; state.page = 'review-queue'; render(); showToast('Diteruskan ke validator.'); } return; }
    if (a === 'return-report') { const r = reports.find(x => x.id === act.dataset.id); if (r) { r.status = 'more'; r.note = $('#review-note')?.value.trim() || 'Mohon lengkapi bukti.'; state.page = 'review-queue'; render(); showToast('Dikembalikan ke teknisi.'); } return; }
    if (a === 'send-sla-reminder') {
      const urgent = reports.filter(r => r.status !== 'verified' && (r.elapsedHours ?? 14) >= 24);
      urgent.forEach(r => {
        r.slaReminderCount = (r.slaReminderCount || 0) + 1;
      });
      render();
      showToast(`🔔 Pengingat SLA otomatis berhasil dikirim ke teknisi pelapor & supervisor untuk ${urgent.length} kasus prioritas!`);
      return;
    }
    if (a === 'add-case-comment') {
      const r = reports.find(x => x.id === act.dataset.id);
      const inp = $('#case-comment-input');
      const txt = inp?.value.trim();
      if (!txt) return;
      if (!r.comments) r.comments = [];
      r.comments.push({
        author: state.user.name,
        role: state.user.role,
        text: txt,
        date: `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
      });
      render();
      showToast('Catatan kasus berhasil ditambahkan ke thread.');
      return;
    }
    if (a === 'open-revision-modal') {
      const id = act.dataset.id;
      $('#modal-root').innerHTML = `<div class="modal-backdrop" data-action="close-modal">
        <section class="modal" role="dialog" aria-modal="true">
          <div class="eyebrow" style="color:var(--amber)">PERMINTAAN REVISI BUKTI (2-WAY FEEDBACK)</div>
          <h3>Kembalikan Kasus ke PRADUGA</h3>
          <p>Laporan akan dikembalikan kepada teknisi lapangan dengan instruksi revisi yang spesifik.</p>
          <div class="field">
            <label for="rev-evidence">Nama Lampiran Bukti yang Diminta</label>
            <input id="rev-evidence" class="control" placeholder="Cth: Foto close-up flange & sertifikat kalibrasi..." />
          </div>
          <div class="field">
            <label for="rev-note">Instruksi Catatan Revisi</label>
            <textarea id="rev-note" class="control" rows="3" placeholder="Tuliskan alasan pengembalian dan tindakan yang harus dilakukan teknisi..."></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn btn-outline" data-action="close-modal">Batal</button>
            <button class="btn btn-primary" data-action="confirm-revision" data-id="${id}">Kirim & Kembalikan ke PRADUGA</button>
          </div>
        </section>
      </div>`;
      return;
    }
    if (a === 'confirm-revision') {
      const r = reports.find(x => x.id === act.dataset.id);
      if (!r) return;
      const ev = $('#rev-evidence')?.value.trim() || 'Lampiran foto bukti fisik';
      const note = $('#rev-note')?.value.trim();
      if (!note || note.length < 5) { showToast('Isi instruksi revisi minimal 5 karakter.'); return; }
      r.status = 'more'; // PRADUGA / Perlu informasi
      r.note = note;
      if (!r.comments) r.comments = [];
      r.comments.push({
        author: state.user.name,
        role: state.user.role,
        text: note,
        date: `${nowLabel()} · Revisi`,
        isRevision: true,
        requestedEvidence: ev
      });
      $('#modal-root').innerHTML = '';
      render();
      showToast('Kasus berhasil dikembalikan ke PRADUGA untuk revisi bukti.');
      return;
    }
    if (a === 'locked-warning') {
      showToast('⛔ Gerbang Validasi Terkunci: Bukti foto wajib ada & pelapor dilarang mengesahkan kasusnya sendiri (No Self-Approval).');
      return;
    }
    if (a === 'decision') return openDecisionModal(act.dataset.id, act.dataset.decision, $('#validator-note')?.value || '');
    if (a === 'confirm-decision') return confirmDecision(act.dataset.id, act.dataset.decision);
    if (a === 'close-modal') { if (act.classList.contains('modal-backdrop') || act.tagName === 'BUTTON') $('#modal-root').innerHTML = ''; return; }
    if (a === 'ask-synqra') {
      const q = $('#synqra-query-input')?.value;
      askSynqraAI(q);
      return;
    }
    if (a === 'sample-prompt') {
      const p = act.dataset.prompt;
      const asset = act.dataset.asset;
      askSynqraAI(p, asset);
      return;
    }
    if (a === 'open-citation') {
      const idx = parseInt(act.dataset.citationIndex, 10) - 1;
      if (state.synqraResult && state.synqraResult.citations[idx]) {
        openEvidenceModal(state.synqraResult.citations[idx], idx + 1);
      }
      return;
    }
    if (a === 'open-evidence-item') {
      const cid = act.dataset.caseId;
      const targetCase = reports.find(r => r.id === cid) || knowledge.find(k => k.id === cid);
      if (targetCase) {
        openEvidenceModal({
          id: targetCase.id,
          title: targetCase.title,
          asset: targetCase.asset,
          status: targetCase.status,
          symptom: targetCase.symptom,
          cause: targetCase.cause || targetCase.praduga_penyebab,
          solution: targetCase.solution || targetCase.usulan_tindakan,
          evidence: targetCase.evidence,
          imageUrl: targetCase.imageUrl,
          type: targetCase.type
        });
      }
      return;
    }
    if (a === 'select-kg-asset') {
      state.selectedKgAsset = act.dataset.asset;
      state.activeKgCaseId = null;
      render();
      return;
    }
    if (a === 'set-kg-filter') {
      state.kgFilterMode = act.dataset.filter;
      state.activeKgCaseId = null;
      render();
      return;
    }
    if (a === 'select-kg-case') {
      state.activeKgCaseId = act.dataset.caseId;
      render();
      return;
    }
  }
  const rep = e.target.closest('[data-report]'); if (rep) return openReport(rep.dataset.report);
  const ast = e.target.closest('[data-asset]'); if (ast) { state.selectedAsset = ast.dataset.asset; render(); return; }
  const mod = e.target.closest('[data-mode]'); if (mod) { state.reportMode = mod.dataset.mode; render(); return; }
  const rf = e.target.closest('[data-report-filter]'); if (rf) { state.reportFilter = rf.dataset.reportFilter; render(); return; }
  const qf = e.target.closest('[data-queue-filter]'); if (qf) { state.queueFilter = qf.dataset.queueFilter; render(); return; }
  const kn = e.target.closest('[data-knowledge]'); if (kn) { state.knowledgeId = kn.dataset.knowledge; state.activeKgNode = 'asset'; goto('knowledge-detail'); return; }
});

document.addEventListener('submit', e => { if (e.target.id === 'login-form') { e.preventDefault(); login(state.selectedRole); } });
document.addEventListener('input', e => {
  if (e.target.id === 'report-text') { state.draftText = e.target.value; const btn = $('[data-action="submit-report"]'); if (btn) btn.disabled = !state.selectedAsset || !state.draftText.trim(); }
  if (e.target.id === 'asset-search') { const q = e.target.value.toLowerCase(); $$('[data-asset]').forEach(c => c.classList.toggle('hidden', !c.textContent.toLowerCase().includes(q))); }
  if (e.target.id === 'knowledge-search') { state.knowledgeQuery = e.target.value; const pos = e.target.selectionStart; render(); const inp = $('#knowledge-search'); if (inp) { inp.focus(); inp.setSelectionRange(pos, pos); } }
});
document.addEventListener('change', e => {
  if (e.target.id === 'evidence-file' && e.target.files?.[0]) {
    if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
    state.imageUrl = URL.createObjectURL(e.target.files[0]);
    state.imageName = e.target.files[0].name;
    render();
  }
  if (e.target.id === 'nameplate-file' && e.target.files?.[0]) {
    const file = e.target.files[0];
    const n = file.name.toUpperCase();
    let detected = 'P-101A';
    if (n.includes('201') || n.includes('HEAT') || n.includes('E-201')) detected = 'E-201';
    else if (n.includes('301') || n.includes('VALVE') || n.includes('FCV')) detected = 'FCV-301';
    state.selectedAsset = detected;
    state.nameplateTag = detected;
    state.imageName = file.name;
    if (state.imageUrl) URL.revokeObjectURL(state.imageUrl);
    state.imageUrl = URL.createObjectURL(file);
    state.entities = extract7Entities(state.draftText || `Pemeriksaan fisik pada ${detected}`, detected);
    showToast(`Scan Nameplate Berhasil: ${detected} terdeteksi!`);
    render();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'synqra-query-input') {
    e.preventDefault();
    askSynqraAI(e.target.value);
  }
});

render();
