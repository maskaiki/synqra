/*
 * SYNQRA UI/UX PROTOTYPE
 * Front-end only: demo personas, sample data and in-memory interactions.
 * No authentication service, backend, database, real audio capture or AI processing.
 */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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
  building: '<path d="M3 21h18M5 21V5l7-3 7 3v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4"/>',
  pump: '<circle cx="12" cy="12" r="7"/><path d="M12 5V2m0 20v-3M5 12H2m20 0h-3M9 9l6 6m0-6-6 6"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  alert: '<path d="m10.3 3.9-8.5 14.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4m0 4h.01"/>',
  graph: '<circle cx="5" cy="7" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="14" cy="18" r="2"/><path d="m7 7 9-2M6 9l7 7m4-9-2 9"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  xCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
};
const ico = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.file}</svg>`;
const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nowLabel = () => new Intl.DateTimeFormat('id-ID', { day:'numeric', month:'long', year:'numeric' }).format(new Date());

const roles = {
  technician: { key:'technician', name:'Ahmad Fauzi', initials:'AF', role:'Teknisi Lapangan', team:'Operasi Kilang · Shift Pagi', email:'ahmad.fauzi@synqra.demo', dept:'Operasi Kilang Unit II' },
  reviewer: { key:'reviewer', name:'Bambang Trihatmojo', initials:'BT', role:'Reviewer Departemen', team:'Maintenance & Reliability', email:'bambang.t@synqra.demo', dept:'Maintenance & Reliability', scope:['Maintenance & Reliability','Rotating & Mechanical'] },
  validator: { key:'validator', name:'Rina Suryani', initials:'RS', role:'Validator Ahli', team:'HSE & Process Safety', email:'rina.suryani@synqra.demo', dept:'HSE & Process Safety' }
};
const navByRole = {
  technician: [ ['home','Beranda','home'], ['file','Laporan saya','my-reports'], ['book','Pengetahuan','knowledge'] ],
  reviewer: [ ['home','Ringkasan','home'], ['inbox','Antrean laporan','review-queue'], ['file','Kasus departemen','department-cases'], ['book','Pengetahuan','knowledge'] ],
  validator: [ ['home','Ringkasan','home'], ['shield','Validasi','validation-queue'], ['book','Pengetahuan','knowledge'], ['history','Riwayat validasi','validation-history'] ]
};
const assets = [
  { id:'E-201', name:'Heat Exchanger', subtitle:'Shell & Tube', type:'heat', area:'Crude Preheater · Train A', dept:'Process & Thermal', cases:2 },
  { id:'P-101A', name:'Centrifugal Pump', subtitle:'Process Pump', type:'pump', area:'Transfer Line · Unit II', dept:'Rotating & Mechanical', cases:3 },
  { id:'K-101', name:'Gas Compressor', subtitle:'Centrifugal Compressor', type:'compressor', area:'Gas Processing · Train B', dept:'Rotating & Mechanical', cases:1 },
  { id:'FCV-301', name:'Control Valve', subtitle:'Flow Control Valve', type:'valve', area:'Gas Outlet · Line 03', dept:'Piping & Instrumentation', cases:1 },
  { id:'V-101', name:'Three-Phase Separator', subtitle:'Vessel / KO Drum', type:'vessel', area:'Separation Unit · Train A', dept:'Process & Thermal', cases:0 },
  { id:'F-101', name:'Process Fired Heater', subtitle:'Fired Equipment', type:'heater', area:'Heating Section · Unit I', dept:'Process & Thermal', cases:0 }
];
let reports = [
  { id:'RPT-1048', title:'Getaran pompa meningkat', asset:'P-101A', symptom:'Getaran terukur meningkat dan terdengar suara tidak normal.', description:'Getaran pompa meningkat sejak awal shift. Pembacaan terakhir 7,8 mm/s, suhu bearing 72 °C. Terlihat rembesan pada area mechanical seal.', reporter:'Ahmad Fauzi', reporterRole:'Teknisi Lapangan', dept:'Maintenance & Reliability', date:'19 Nov 2026 · 08.42', status:'submitted', evidence:'Foto area mechanical seal', priority:'medium', source:'voice' },
  { id:'RPT-1047', title:'Differential pressure meningkat', asset:'E-201', symptom:'ΔP naik, suhu outlet turun 12 °C.', description:'Differential pressure Heat Exchanger E-201 meningkat dari kondisi normal. Ada indikasi fouling di sisi tube bundle, perlu pemeriksaan lebih lanjut.', reporter:'Dimas Pratama', reporterRole:'Teknisi Lapangan', dept:'Process & Thermal', date:'19 Nov 2026 · 07.56', status:'validation', evidence:'Foto indikator & kondisi flange', priority:'high', source:'text' },
  { id:'RPT-1046', title:'Respons control valve melambat', asset:'FCV-301', symptom:'Respons valve tertinggal sekitar 8 detik.', description:'Perintah posisi 60%, aktual tertinggal sekitar delapan detik. Belum dilakukan uji stroke.', reporter:'Ahmad Fauzi', reporterRole:'Teknisi Lapangan', dept:'Piping & Instrumentation', date:'18 Nov 2026 · 15.20', status:'more', evidence:'Foto control valve', priority:'low', source:'text', note:'Mohon lampirkan foto nameplate dan hasil uji stroke.' },
  { id:'RPT-1044', title:'Kebocoran gasket channel', asset:'E-201', symptom:'Rembesan pada sambungan channel heat exchanger.', description:'Ditemukan rembesan di sekitar sambungan channel. Area sudah diamankan dan dilaporkan untuk pemeriksaan.', reporter:'Dimas Pratama', reporterRole:'Teknisi Lapangan', dept:'Process & Thermal', date:'17 Nov 2026 · 13.10', status:'verified', evidence:'Foto sambungan channel', priority:'medium', source:'voice', cause:'Gasket channel mengeras', solution:'Penggantian gasket dan pemeriksaan torsi baut sesuai prosedur.', verifiedBy:'Rina Suryani' },
  { id:'RPT-1043', title:'Fouling pada sisi tabung', asset:'E-201', symptom:'ΔP meningkat dan suhu keluar turun.', description:'Inspeksi menunjukkan adanya deposit pada sisi tabung yang menghambat aliran.', reporter:'Ahmad Fauzi', reporterRole:'Teknisi Lapangan', dept:'Process & Thermal', date:'15 Nov 2026 · 10.05', status:'verified', evidence:'Foto hasil borescope', priority:'medium', source:'text', cause:'Akumulasi deposit pada tube bundle', solution:'Pembersihan kimia dan monitoring differential pressure.', verifiedBy:'Rina Suryani' }
];
const knowledge = [
  { id:'KB-001', title:'Fouling pada sisi tabung', asset:'E-201', assetName:'Heat Exchanger · Shell & Tube', symptom:'Differential pressure meningkat dan suhu keluar menurun.', cause:'Akumulasi deposit pada permukaan dalam tube bundle.', solution:'Lakukan inspeksi borescope, evaluasi kompatibilitas chemical cleaning, lalu bersihkan tube bundle sesuai prosedur.', result:'ΔP kembali mendekati baseline operasi setelah pembersihan.', cases:2, tags:['Terverifikasi','Process & Thermal'], type:'heat', status:'verified' },
  { id:'KB-002', title:'Kebocoran gasket channel', asset:'E-201', assetName:'Heat Exchanger · Shell & Tube', symptom:'Rembesan fluida pada sambungan channel atau flange.', cause:'Elastisitas gasket menurun dan beban baut tidak merata.', solution:'Isolasi peralatan sesuai izin kerja, ganti gasket dengan spesifikasi yang sesuai, lalu lakukan pemeriksaan sambungan.', result:'Tidak ditemukan rembesan pada pemeriksaan setelah perbaikan.', cases:1, tags:['Terverifikasi','Process & Thermal'], type:'heat', status:'verified' },
  { id:'KB-003', title:'Getaran tinggi pada pompa', asset:'P-101A', assetName:'Centrifugal Pump', symptom:'Nilai vibrasi meningkat disertai suara atau temperatur abnormal.', cause:'Perlu dibedakan antara misalignment, kondisi bearing, unbalance, dan kavitasi berdasarkan hasil inspeksi.', solution:'Periksa tren vibrasi, kondisi bearing, alignment poros, dan sisi suction sebelum menetapkan tindakan korektif.', result:'Verifikasi dilakukan melalui pengukuran vibrasi setelah tindakan.', cases:3, tags:['Terverifikasi','Rotating & Mechanical'], type:'pump', status:'verified' },
  { id:'KB-004', title:'Respons control valve lambat', asset:'FCV-301', assetName:'Control Valve', symptom:'Posisi aktual tertinggal dari sinyal perintah.', cause:'Belum terkonfirmasi; perlu pemeriksaan actuator, positioner, dan packing.', solution:'Lakukan uji stroke dan dokumentasikan perbandingan sinyal perintah dengan posisi aktual.', result:'Menunggu hasil pemeriksaan.', cases:1, tags:['Dalam pemeriksaan','Piping & Instrumentation'], type:'valve', status:'review' }
];
const state = {
  user:null, page:'login', previousPage:'home', selectedRole:'technician', activeReport:null, editReportId:null,
  selectedAsset:null, reportMode:'voice', draftText:'', transcriptReady:false, recording:false,
  recordingTimer:null, seconds:0, imageUrl:null, imageName:'', knowledgeId:null,
  knowledgeQuery:'', reportFilter:'all', queueFilter:'all', departmentFilter:'all', toastTimer:null
};

function statusInfo(status) {
  return ({ submitted:['Terkirim','submitted'], review:['Diperiksa Departemen','review'], validation:['Menunggu Validasi','validation'], verified:['Terverifikasi','verified'], more:['Perlu Informasi','more'], rejected:['Tidak Valid','rejected'] })[status] || ['Dalam proses','review'];
}
function statusPill(status) { const [label,cls] = statusInfo(status); return `<span class="status ${cls}">${label}</span>`; }
function equipmentArt(type = 'heat') {
  const commonStart = '<svg viewBox="0 0 220 145" fill="none" xmlns="http://www.w3.org/2000/svg">';
  const drawings = {
    heat: `<g stroke="#1E4B6B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M28 54h22m120 0h22M28 91h22m120 0h22"/><rect x="48" y="38" width="124" height="70" rx="18" fill="#F8FCFD"/><path d="M66 42v62m88-62v62M78 48c10 6 10 44 0 50m20-50c10 6 10 44 0 50m20-50c10 6 10 44 0 50m20-50c10 6 10 44 0 50" stroke="#00A9C8"/><path d="M58 38V26h18v12m68 0V26h18v12M58 108v12h18v-12m68 0v12h18v-12"/><path d="M25 72h21m126 0h22" stroke="#00B8D9" stroke-width="5"/></g><path d="M78 128h64" stroke="#A7BAC7" stroke-width="3" stroke-linecap="round"/>`,
    pump: `<g stroke="#1E4B6B" stroke-width="3" stroke-linejoin="round"><path d="M32 102h154v13H32z" fill="#D9E9EE"/><rect x="48" y="53" width="63" height="49" rx="9" fill="#F8FCFD"/><circle cx="79" cy="77" r="18" fill="#DDF5F9"/><path d="M79 59v36m-18-18h36" stroke="#00A9C8"/><path d="M111 64h22l15 13v25h-37z" fill="#E8F4F6"/><path d="M133 64V43h27v21m-19-21v-9h10v9"/><path d="M28 77h20m112 0h29" stroke="#00B8D9" stroke-width="5"/></g>`,
    compressor: `<g stroke="#1E4B6B" stroke-width="3" stroke-linejoin="round"><path d="M30 109h160"/><rect x="49" y="51" width="122" height="54" rx="17" fill="#F9FCFD"/><path d="M61 62h96M61 94h96"/><circle cx="84" cy="78" r="13" fill="#DDF5F9"/><circle cx="137" cy="78" r="13" fill="#DDF5F9"/><path d="M84 65v26m-13-13h26m40-13v26m-13-13h26" stroke="#00A9C8"/><path d="M75 51V34h20v17m45 0V34h20v17"/></g>`,
    valve: `<g stroke="#1E4B6B" stroke-width="3" stroke-linejoin="round"><path d="M22 87h55m66 0h55" stroke="#00B8D9" stroke-width="6"/><path d="m77 62 32 25-32 25V62zm66 0-32 25 32 25V62z" fill="#EAF7F9"/><path d="M110 62V35m-21 0h42"/><rect x="93" y="16" width="34" height="20" rx="5" fill="#F8FCFD"/><path d="M110 16V8"/></g>`,
    vessel: `<g stroke="#1E4B6B" stroke-width="3" stroke-linejoin="round"><rect x="73" y="18" width="74" height="108" rx="34" fill="#F8FCFD"/><path d="M76 61h68M76 83h68" stroke="#00A9C8"/><path d="M110 18V8m-22 118v10m44-10v10M73 50H48v25h25m74-25h25v25h-25"/><path d="M88 93h44"/></g>`,
    heater: `<g stroke="#1E4B6B" stroke-width="3" stroke-linejoin="round"><rect x="54" y="18" width="112" height="106" rx="9" fill="#F8FCFD"/><path d="M72 39h76v65H72z" fill="#FFF7EA"/><path d="M87 90c-8-13 9-17 3-29 14 7 9 17 17 23 6-8 7-14 4-24 17 14 19 28 6 39" stroke="#00A9C8"/><path d="M85 18V8h50v10M73 124v10m74-10v10"/></g>`
  };
  return commonStart + (drawings[type] || drawings.heat) + '</svg>';
}
function evidencePreview(report, asset) {
  if (report.imageUrl) return `<div class="evidence-image actual-evidence"><span class="evidence-tag">BUKTI FOTO LAPANGAN</span><img src="${report.imageUrl}" alt="${esc(report.evidence)}"><span class="evidence-caption">${esc(report.evidence)}</span></div>`;
  return `<div class="evidence-image evidence-placeholder"><span class="evidence-tag">ILUSTRASI · DATA DEMO</span>${equipmentArt(asset.type)}<span class="evidence-caption">${esc(report.evidence || 'Belum ada bukti foto')}</span></div>`;
}
function roleName(key) { return roles[key]?.role || ''; }
function showToast(message) {
  const el = $('#toast'); if (!el) return;
  el.textContent = message; el.classList.add('show');
  clearTimeout(state.toastTimer); state.toastTimer = setTimeout(() => el.classList.remove('show'), 2700);
}
function goto(page) { state.previousPage = state.page; state.page = page; render(); window.scrollTo({top:0,behavior:'smooth'}); }
function brandLogo(className='') { return `<div class="brand-lockup ${className}"><img src="assets/synqra-logo-light.png" alt="Logo Synqra"><div><strong>SYNQRA</strong><small>Intelligence, connected by evidence</small></div></div>`; }
function pageHead(eyebrow,title,desc,actions='') { return `<header class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</header>`; }
function statCard(iconName,value,label,sub='') { return `<div class="card stat-card"><div class="stat-icon">${ico(iconName,20)}</div><div><div class="stat-value">${value}</div><div class="stat-label">${label}${sub ? ` · ${sub}` : ''}</div></div></div>`; }
function reportRow(report, actionLabel='Lihat detail') {
  const asset = assets.find(a => a.id === report.asset) || assets[0];
  return `<div class="report-row"><div class="report-thumb">${equipmentArt(asset.type)}</div><div class="report-main"><b>${esc(report.title)}</b><small>${esc(report.id)} · ${esc(report.asset)} · ${esc(report.date)}</small></div><div class="report-end">${statusPill(report.status)}<button class="text-link" data-report="${report.id}">${actionLabel} ${ico('chevron',12)}</button></div></div>`;
}
function userReports() { return reports.filter(r => r.reporter === state.user.name); }
function reviewerReports() { const scope=state.user.scope||[state.user.dept]; return reports.filter(r => scope.includes(r.dept)); }
function countBy(statuses) { return reports.filter(r => statuses.includes(r.status)).length; }

function renderLogin() {
  const role = roles[state.selectedRole];
  return `<main class="login-screen">
    <section class="login-visual">
      ${brandLogo()}
      <div class="login-hero">
        <div class="eyebrow" style="color:#70D9EA">INDUSTRIAL KNOWLEDGE PLATFORM</div>
        <h1>Dari temuan lapangan,<br><span>menjadi pengetahuan.</span></h1>
        <p>Hubungkan laporan teknisi, verifikasi ahli, dan pengalaman perawatan menjadi pengetahuan teknik yang dapat digunakan kembali.</p>
        <svg class="login-art" viewBox="0 0 560 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g opacity=".5" stroke="#76DCEC" stroke-width="1.4"><path d="M22 220H530M44 242H504"/><path d="M65 205v-92h54v92m-44-92V93h34v20m-24-42h14v22M145 205V76h95v129m-77-129V50h58v26m-46-25V35h34v15"/><path d="M385 205V96h95v109m-74-109V71h54v25m-38-26V51h22v19"/></g>
          <g stroke="#C8F7FF" stroke-width="2.4" stroke-linejoin="round"><rect x="177" y="128" width="205" height="94" rx="22" fill="#E8FAFD" fill-opacity=".12"/><path d="M192 140h175M192 210h175"/><path d="M215 138v74m27-74v74m27-74v74m27-74v74m27-74v74m27-74v74" stroke="#64D7E9"/><path d="M159 174h18m205 0h26" stroke="#70D9EA" stroke-width="7"/><circle cx="412" cy="174" r="17" fill="#0B1F44"/><path d="M407 165v18m10-18v18" stroke="#70D9EA" stroke-width="3"/></g>
          <g fill="#70D9EA"><circle cx="98" cy="55" r="4"/><circle cx="456" cy="45" r="4"/><circle cx="502" cy="119" r="3"/><circle cx="137" cy="150" r="3"/></g>
          <path d="M105 64 147 94M456 54l-18 31" stroke="#70D9EA" stroke-dasharray="4 6"/>
        </svg>
      </div>
      <div class="login-foot">© 2026 SYNQRA · Prototype UI/UX · Oil & Gas</div>
    </section>
    <section class="login-panel"><div class="login-card">
      ${brandLogo('logo-mobile')}
      <div class="eyebrow">AKSES DEMO</div><h2>Selamat datang</h2><p class="intro">Masuk untuk menjelajahi prototype Synqra.</p>
      <div class="field"><label>Pilih akun demo</label>
        <div class="role-picker">
          ${Object.values(roles).map(r => `<button type="button" class="role-option ${state.selectedRole===r.key?'active':''}" data-role="${r.key}"><span class="role-avatar">${r.initials}</span><span class="role-copy"><b>${r.name}</b><small>${r.role} · ${r.team}</small></span><span class="role-check">${state.selectedRole===r.key?'✓':''}</span></button>`).join('')}
        </div>
      </div>
      <form id="login-form">
        <div class="field"><label for="login-email">Email perusahaan</label><input class="control" id="login-email" type="email" value="${role.email}" autocomplete="username" /></div>
        <div class="field"><label for="login-password">Kata sandi</label><input class="control" id="login-password" type="password" value="synqra-demo" autocomplete="current-password" /></div>
        <button class="btn btn-primary btn-full" type="submit">Masuk ke prototype ${ico('arrow',16)}</button>
      </form>
      <div class="login-note">${ico('shield',15)} <span>Login ini hanya simulasi pemilihan persona. Tidak ada kredensial yang diverifikasi atau dikirim ke server.</span></div>
    </div></section>
  </main>`;
}

function renderSidebar() {
  const user = state.user;
  const nav = navByRole[user.key];
  const createAction = user.key === 'technician' ? `<div class="sidebar-cta"><b>Ada temuan di lapangan?</b><p>Buat laporan singkat dengan suara, teks, dan foto.</p><button class="btn" data-page="new-report">${ico('plus',15)} Buat laporan</button></div>` : '';
  const isActive = page => {
    if (page === 'home') return state.page === 'home';
    if (page === 'my-reports') return ['my-reports','new-report','report-detail'].includes(state.page);
    if (page === 'review-queue') return ['review-queue','review-detail'].includes(state.page);
    if (page === 'validation-queue') return ['validation-queue','validation-detail'].includes(state.page);
    if (page === 'knowledge') return ['knowledge','knowledge-detail'].includes(state.page);
    return state.page === page;
  };
  return `<aside class="sidebar">
    <div class="side-brand"><img src="assets/synqra-logo-light.png" alt=""><div><b>SYNQRA</b><small>Industrial knowledge</small></div></div>
    <div class="side-profile"><span class="avatar">${user.initials}</span><span class="profile-copy"><b>${user.name}</b><small>${user.role}</small></span></div>
    <div class="side-label">WORKSPACE</div>
    <nav class="nav-list">${nav.map(([ic,label,page]) => `<button class="nav-item ${isActive(page)?'active':''}" data-page="${page}">${ico(ic,18)}<span>${label}</span></button>`).join('')}</nav>
    ${createAction}
    <div class="nav-spacer"></div>
    <div class="side-bottom"><button class="nav-item" data-action="theme">${ico('sun',18)}<span>Mode tampilan</span></button><button class="nav-item" data-action="logout">${ico('logout',18)}<span>Keluar dari demo</span></button></div>
  </aside>`;
}
function renderTopbar() {
  const user = state.user;
  const names = {home:'Beranda','my-reports':'Laporan saya','new-report':'Buat laporan','report-detail':'Detail laporan','review-queue':'Antrean laporan','review-detail':'Review laporan','department-cases':'Kasus departemen','validation-queue':'Validasi','validation-detail':'Pemeriksaan temuan',knowledge:'Pengetahuan','knowledge-detail':'Detail pengetahuan','validation-history':'Riwayat validasi'};
  return `<header class="topbar"><div class="breadcrumb"><span class="muted">Workspace</span> &nbsp;/&nbsp; ${names[state.page] || 'Beranda'}</div><div class="top-actions"><span class="env-label">DEMO · OIL & GAS</span><button class="icon-btn" data-action="notifications" aria-label="Notifikasi">${ico('bell',17)}</button><button class="user-chip" data-action="user-menu"><span class="avatar">${user.initials}</span><span><b>${user.name}</b><small>${user.role}</small></span></button></div></header>`;
}
function renderBottomNav() {
  const nav = navByRole[state.user.key];
  return `<nav class="bottom-nav">${nav.slice(0,4).map(([ic,label,page]) => `<button class="${state.page===page?'active':''}" data-page="${page}">${ico(ic,19)}<span>${label}</span></button>`).join('')}${state.user.key==='technician'?`<button class="${state.page==='new-report'?'active':''}" data-page="new-report">${ico('plus',19)}<span>Lapor</span></button>`:''}</nav>`;
}
function renderApp() {
  const pageRender = {
    home: renderHome,
    'my-reports': renderMyReports,
    'new-report': renderNewReport,
    'report-detail': renderReportDetail,
    'review-queue': renderReviewQueue,
    'review-detail': renderReviewDetail,
    'department-cases': renderDepartmentCases,
    'validation-queue': renderValidationQueue,
    'validation-detail': renderValidationDetail,
    knowledge: renderKnowledge,
    'knowledge-detail': renderKnowledgeDetail,
    'validation-history': renderValidationHistory
  };
  return `<div class="app-shell">${renderSidebar()}<div class="main-column">${renderTopbar()}<main class="content">${(pageRender[state.page] || renderHome)()}</main></div></div>${renderBottomNav()}`;
}

function renderHome() {
  const user = state.user;
  if (user.key === 'technician') {
    const mine = userReports();
    const inProcess = mine.filter(r => !['verified','rejected'].includes(r.status)).length;
    const verified = mine.filter(r => r.status === 'verified').length;
    return `${pageHead('BERANDA TEKNISI',`Halo, ${esc(user.name.split(' ')[0])}.`,'Apa yang kamu temukan hari ini?')}
      <section class="card welcome-card"><div class="welcome-copy"><div class="eyebrow">FIELD REPORTING</div><h2>Temuan kecil pun penting dicatat.</h2><p>Laporkan kondisi peralatan dengan cara paling mudah untukmu.</p></div><div class="welcome-action"><button class="btn" data-page="new-report">${ico('plus',16)} Laporkan temuan</button></div></section>
      <div class="grid grid-3" style="margin-top:17px">${statCard('file',mine.length,'Total laporan')}${statCard('clock',inProcess,'Sedang diproses')}${statCard('checkCircle',verified,'Terverifikasi')}</div>
      <div class="grid-main" style="margin-top:18px"><section class="card card-pad"><div class="card-title"><div><h3>Laporan terakhirmu</h3><p>Pantau progres laporan tanpa proses yang rumit.</p></div><button class="text-link" data-page="my-reports">Lihat semua ${ico('chevron',12)}</button></div>${mine.length?mine.slice(0,4).map(r=>reportRow(r)).join(''):`<div class="empty-state">${ico('file',28)}<p>Belum ada laporan.</p><button class="btn btn-primary btn-sm" data-page="new-report">Buat laporan pertama</button></div>`}</section>
      <aside class="card card-pad"><div class="card-title"><div><h3>Mulai laporan</h3><p>Pilih cara yang paling nyaman.</p></div></div><button class="quick-action" data-page="new-report"><span class="quick-icon">${ico('mic',22)}</span><span><b>Rekam suara</b><small>Ceritakan temuanmu secara langsung.</small></span><span class="arrow">${ico('chevron')}</span></button><button class="quick-action" data-page="new-report" style="margin-top:9px"><span class="quick-icon">${ico('file',22)}</span><span><b>Ketik laporan</b><small>Tulis temuan dengan kata-katamu.</small></span><span class="arrow">${ico('chevron')}</span></button><p class="prototype-note">Prototype: transkripsi suara dan pengiriman laporan disimulasikan.</p></aside></div>`;
  }
  if (user.key === 'reviewer') {
    const scoped = reviewerReports();
    const waiting = scoped.filter(r=>r.status==='submitted');
    const returned = scoped.filter(r=>r.status==='more');
    const sent = scoped.filter(r=>r.status==='validation');
    return `${pageHead('RINGKASAN DEPARTEMEN','Selamat datang, Pak Bambang.','Periksa kelengkapan laporan sebelum diteruskan ke validator.')}<div class="grid grid-3">${statCard('inbox',waiting.length,'Menunggu review')}${statCard('shield',sent.length,'Diteruskan ke validator')}${statCard('refresh',returned.length,'Perlu informasi')}</div>
    <div class="grid-main" style="margin-top:18px"><section class="card card-pad"><div class="card-title"><div><h3>Antrean yang perlu diperiksa</h3><p>Prioritaskan laporan yang baru masuk.</p></div><button class="text-link" data-page="review-queue">Lihat antrean ${ico('chevron',12)}</button></div>${waiting.length?waiting.map(r=>reportRow(r,'Review')).join(''):`<div class="empty-state">${ico('checkCircle',28)}<p>Semua laporan baru sudah diperiksa.</p></div>`}</section>
    <aside class="card card-pad"><div class="card-title"><div><h3>Alur review</h3><p>Tiga langkah sederhana.</p></div></div><div class="timeline"><div class="timeline-item"><span class="timeline-dot">${ico('inbox',13)}</span><div class="timeline-copy"><b>Terima laporan</b><small>Periksa aset, uraian, dan bukti foto.</small></div></div><div class="timeline-item"><span class="timeline-dot">${ico('check',13)}</span><div class="timeline-copy"><b>Pastikan kelengkapan</b><small>Pastikan informasi cukup untuk dinilai.</small></div></div><div class="timeline-item"><span class="timeline-dot">${ico('arrow',13)}</span><div class="timeline-copy"><b>Teruskan ke validator</b><small>Atau kembalikan jika perlu dilengkapi.</small></div></div></div><button class="btn btn-primary btn-full btn-sm" data-page="review-queue">Buka antrean</button></aside></div>`;
  }
  const validation = reports.filter(r=>r.status==='validation');
  const verified = reports.filter(r=>r.status==='verified');
  const rejected = reports.filter(r=>r.status==='rejected');
  return `${pageHead('RINGKASAN VALIDATOR','Selamat datang, Ibu Rina.','Validasi temuan berdasarkan bukti. Pengetahuan yang disahkan akan tersimpan di Synqra.')}<div class="grid grid-3">${statCard('shield',validation.length,'Menunggu validasi')}${statCard('checkCircle',verified.length,'Temuan terverifikasi')}${statCard('xCircle',rejected.length,'Tidak valid')}</div>
    <div class="grid-main" style="margin-top:18px"><section class="card card-pad"><div class="card-title"><div><h3>Temuan menunggu keputusan</h3><p>Periksa foto dan laporan sebelum menetapkan hasil.</p></div><button class="text-link" data-page="validation-queue">Semua temuan ${ico('chevron',12)}</button></div>${validation.length?validation.map(r=>reportRow(r,'Validasi')).join(''):`<div class="empty-state">${ico('checkCircle',28)}<p>Tidak ada temuan yang menunggu validasi.</p></div>`}</section>
    <aside class="card card-pad"><div class="card-title"><div><h3>Standar keputusan</h3><p>Jaga agar dugaan tidak dianggap fakta.</p></div></div><div class="timeline"><div class="timeline-item"><span class="timeline-dot">${ico('check',13)}</span><div class="timeline-copy"><b>Temuan valid</b><small>Bukti cukup mendukung adanya masalah.</small></div></div><div class="timeline-item"><span class="timeline-dot">${ico('refresh',13)}</span><div class="timeline-copy"><b>Perlu bukti tambahan</b><small>Informasi belum cukup untuk disahkan.</small></div></div><div class="timeline-item"><span class="timeline-dot">${ico('xCircle',13)}</span><div class="timeline-copy"><b>Tidak valid</b><small>Temuan tidak dapat dibuktikan.</small></div></div></div><button class="btn btn-primary btn-full btn-sm" data-page="validation-queue">Buka antrean validasi</button></aside></div>`;
}
function renderMyReports() {
  const mine = userReports();
  const filtered = mine.filter(r => state.reportFilter==='all' || r.status===state.reportFilter);
  return `${pageHead('LAPORAN SAYA','Semua laporanmu.','Pantau status temuan yang sudah dikirim.',`<button class="btn btn-primary" data-page="new-report">${ico('plus',16)} Buat laporan</button>`)}
    <div class="filter-row" style="margin-bottom:15px">${[['all','Semua'],['submitted','Terkirim'],['review','Diperiksa'],['validation','Validasi'],['more','Perlu info'],['verified','Selesai']].map(([v,l])=>`<button class="filter-chip ${state.reportFilter===v?'active':''}" data-report-filter="${v}">${l}</button>`).join('')}</div>
    <section class="card card-pad">${filtered.length?filtered.map(r=>reportRow(r)).join(''):`<div class="empty-state">${ico('file',28)}<p>Tidak ada laporan pada status ini.</p></div>`}</section>`;
}
function renderNewReport() {
  const selected = assets.find(a=>a.id===state.selectedAsset);
  const editing = !!state.editReportId;
  const existing = reports.find(r=>r.id===state.editReportId);
  const textMode = state.reportMode==='text';
  const draft = esc(state.draftText);
  return `${pageHead(editing?'LENGKAPI LAPORAN':'LAPORAN BARU',editing?'Lengkapi informasi temuan.':'Ceritakan temuanmu.',editing?(existing?.note||'Tambahkan informasi yang diminta agar laporan dapat diperiksa kembali.'):'Pilih peralatan, sampaikan kondisi yang ditemukan, lalu lampirkan foto.')}
    <div class="stepper"><div class="step active"><span>1</span>Pilih peralatan</div><div class="step-line"></div><div class="step ${selected?'active':''}"><span>2</span>Jelaskan temuan</div><div class="step-line"></div><div class="step ${state.draftText.trim()?'active':''}"><span>3</span>Kirim laporan</div></div>
    <section class="card form-section"><h3>Peralatan yang ditemukan bermasalah</h3><p>Cari berdasarkan nama peralatan atau tag aset.</p><div class="searchbar" style="margin-bottom:14px">${ico('search')}<input id="asset-search" placeholder="Cari equipment atau tag aset..." /></div><div class="grid grid-3" id="asset-grid">${assets.map(a=>`<button class="asset-card ${state.selectedAsset===a.id?'selected':''}" data-asset="${a.id}"><div class="asset-art">${equipmentArt(a.type)}</div><b>${a.name}</b><small>${a.subtitle}</small><div class="asset-meta">${a.id} · ${a.area}</div></button>`).join('')}</div>${selected?`<div style="margin-top:13px;padding:12px 14px;border-radius:12px;background:#F0FAFC;color:#256579;font-size:11px">${ico('checkCircle',14)} Dipilih: <b>${selected.name} · ${selected.id}</b></div>`:''}</section>
    <section class="card form-section" style="margin-top:14px"><h3>Jelaskan kondisi yang kamu temukan</h3><p>Gunakan suara atau ketik langsung. Tidak perlu mendiagnosis penyebabnya.</p>
      <div class="mode-switch"><button class="${!textMode?'active':''}" data-mode="voice">${ico('mic',14)} Suara</button><button class="${textMode?'active':''}" data-mode="text">${ico('file',14)} Ketik</button></div>
      ${textMode?`<div class="field" style="margin-top:16px;margin-bottom:0"><label for="report-text">Deskripsi temuan</label><textarea class="control" id="report-text" rows="5" placeholder="Contoh: Terlihat rembesan pada mechanical seal pompa. Getaran meningkat sejak awal shift...">${draft}</textarea></div>`:`<div class="voice-panel"><button class="mic-button ${state.recording?'recording':''}" data-action="toggle-record">${ico(state.recording?'close':'mic',32)}</button><b>${state.recording?'Sedang merekam':'Tekan untuk mulai bercerita'}</b><div class="wave ${state.recording?'active':''}">${Array.from({length:25},()=>'<i></i>').join('')}</div><small class="muted">${state.recording?`Durasi ${String(Math.floor(state.seconds/60)).padStart(2,'0')}:${String(state.seconds%60).padStart(2,'0')} · Tekan tombol untuk selesai`:'Ceritakan gejala, lokasi, dan kondisi yang terlihat.'}</small></div>
        ${state.transcriptReady?`<div class="transcript"><div class="eyebrow" style="margin-bottom:6px">HASIL TRANSKRIP SIMULASI</div>${draft}<div style="margin-top:7px;color:#91A0B2;font-size:10px">Tinjau teks simulasi sebelum dikirim.</div></div>`:''}`}
    </section>
    <section class="card form-section" style="margin-top:14px"><h3>Bukti foto lapangan <span class="muted" style="font-family:'Plus Jakarta Sans';font-size:10px;font-weight:500">(opsional untuk demo)</span></h3><p>Tambahkan foto area atau komponen yang ditemukan.</p><label class="upload-box" for="evidence-file"><span class="upload-symbol">${ico('camera',20)}</span><span><b style="display:block;font-size:11px">Pilih foto dari perangkat</b><small class="muted">JPG, PNG, atau WEBP</small></span><span class="arrow">${ico('plus',17)}</span></label><input type="file" id="evidence-file" accept="image/*" class="hidden">${state.imageUrl?`<div class="upload-preview"><img class="preview-image" src="${state.imageUrl}" alt="Pratinjau bukti"><span class="muted small">${esc(state.imageName)}</span><button class="text-link" data-action="remove-photo">Hapus foto</button></div>`:''}</section>
    <div style="display:flex;justify-content:flex-end;gap:9px;margin-top:17px"><button class="btn btn-outline" data-page="home">Batal</button><button class="btn btn-primary" data-action="submit-report" ${!selected||!state.draftText.trim()?'disabled':''}>Kirim laporan ${ico('arrow',16)}</button></div>
    <p class="prototype-note">Interaksi demo: rekaman suara menghasilkan contoh transkrip; tidak mengakses mikrofon atau layanan AI sungguhan.</p>`;
}
function renderReportDetail() {
  const r = reports.find(x=>x.id===state.activeReport) || reports[0];
  const asset = assets.find(a=>a.id===r.asset) || assets[0];
  const backPage=state.user.key==='technician'?'my-reports':state.user.key==='reviewer'?'review-queue':state.user.key==='validator'?'validation-queue':'department-cases';
  const completeAction=state.user.key==='technician'&&r.reporter===state.user.name&&r.status==='more'?`<button class="btn btn-primary" data-action="complete-report" data-id="${r.id}">${ico('file',15)} Lengkapi laporan</button>`:'';
  return `${pageHead('DETAIL LAPORAN',esc(r.title),`${r.id} · Dilaporkan ${r.date}`,`${completeAction}<button class="btn btn-outline" data-page="${backPage}">${ico('back',14)} Kembali</button>`)}
    <div class="detail-grid"><section class="card card-pad"><div class="card-title"><div><h3>Ringkasan temuan</h3><p>Informasi yang dikirim dari lapangan.</p></div>${statusPill(r.status)}</div>${evidencePreview(r,asset)}<div style="margin-top:17px"><div class="detail-item"><span>Peralatan</span><b>${asset.name} · ${asset.id}</b></div><div class="detail-item"><span>Lokasi</span><b>${asset.area}</b></div><div class="detail-item"><span>Pelapor</span><b>${r.reporter}</b></div><div class="detail-item"><span>Departemen</span><b>${r.dept}</b></div><div class="detail-item"><span>Metode laporan</span><b>${r.source==='voice'?'Suara (transkrip simulasi)':'Teks manual'}</b></div><div class="detail-item"><span>Bukti</span><b>${r.evidence||'Belum ada lampiran'}</b></div></div></section>
    <aside class="card card-pad"><div class="card-title"><div><h3>Uraian laporan</h3><p>Transkrip / deskripsi dari pelapor.</p></div></div><p style="font-size:12px;line-height:1.9;color:#40516A">${esc(r.description)}</p>${r.note?`<div style="padding:12px;border-radius:12px;background:var(--amber-bg);color:#8C611C;font-size:11px;margin-top:12px"><b>Catatan:</b> ${esc(r.note)}</div>`:''}${r.cause?`<div class="detail-item"><span>Penyebab</span><b>${esc(r.cause)}</b></div>`:''}${r.solution?`<div class="detail-item"><span>Solusi</span><b>${esc(r.solution)}</b></div>`:''}</aside></div>`;
}
function renderReviewQueue() {
  let list = reviewerReports().filter(r => r.status==='submitted' || r.status==='more');
  if (state.queueFilter==='submitted') list=list.filter(r=>r.status==='submitted');
  if (state.queueFilter==='more') list=list.filter(r=>r.status==='more');
  return `${pageHead('ANTREAN DEPARTEMEN','Periksa laporan yang masuk.','Pastikan informasi dan bukti cukup sebelum kasus diteruskan.')}<div class="filter-row" style="margin-bottom:15px">${[['all','Semua'],['submitted','Laporan baru'],['more','Perlu informasi']].map(([v,l])=>`<button class="filter-chip ${state.queueFilter===v?'active':''}" data-queue-filter="${v}">${l}</button>`).join('')}</div><section class="card card-pad"><div class="card-title"><div><h3>${list.length} laporan perlu perhatian</h3><p>Menampilkan laporan yang masih menjadi tanggung jawab departemen.</p></div></div>${list.length?list.map(r=>reportRow(r,'Periksa')).join(''):`<div class="empty-state">${ico('checkCircle',28)}<p>Antrean kosong. Tidak ada laporan yang perlu diperiksa.</p></div>`}</section>`;
}
function renderReviewDetail() {
  const r=reports.find(x=>x.id===state.activeReport)||reports.find(x=>x.status==='submitted');
  if(!r)return `<div class="empty-state">Tidak ada laporan untuk diperiksa.</div>`;
  const a=assets.find(x=>x.id===r.asset)||assets[0];
  return `${pageHead('REVIEW DEPARTEMEN','Periksa kelengkapan laporan.','Pastikan laporan dapat dipahami validator.',`<button class="btn btn-outline" data-page="review-queue">${ico('back',14)} Kembali</button>`)}<div class="detail-grid"><section class="card card-pad"><div class="card-title"><div><h3>${esc(r.title)}</h3><p>${r.id} · ${r.date}</p></div>${statusPill(r.status)}</div>${evidencePreview(r,a)}<div class="detail-item"><span>Equipment</span><b>${a.name} · ${a.id}</b></div><div class="detail-item"><span>Departemen</span><b>${r.dept}</b></div><div class="detail-item"><span>Pelapor</span><b>${r.reporter}</b></div><div class="detail-item"><span>Bukti foto</span><b>${r.evidence}</b></div></section><aside class="card card-pad"><div class="card-title"><div><h3>Isi laporan</h3><p>Uraian dari teknisi lapangan.</p></div></div><p style="font-size:12px;line-height:1.9">${esc(r.description)}</p><div class="field" style="margin-top:19px"><label for="review-note">Catatan untuk teknisi (bila dikembalikan)</label><textarea class="control" id="review-note" rows="3" placeholder="Contoh: Mohon tambahkan foto nameplate..."></textarea></div><button class="btn btn-primary btn-full" data-action="forward-report" data-id="${r.id}">${ico('arrow',15)} Teruskan ke validator</button><button class="btn btn-outline btn-full" style="margin-top:9px" data-action="return-report" data-id="${r.id}">Kembalikan ke teknisi</button><p class="prototype-note">Reviewer memeriksa kelengkapan, bukan menetapkan akar penyebab.</p></aside></div>`;
}
function renderDepartmentCases() {
  const list=reviewerReports();
  return `${pageHead('KASUS DEPARTEMEN','Laporan dalam lingkup departemen.','Pantau laporan yang masuk, diteruskan, dan selesai diperiksa.')}<section class="card card-pad"><div class="table-wrap"><table><thead><tr><th>Laporan</th><th>Peralatan</th><th>Pelapor</th><th>Status</th><th></th></tr></thead><tbody>${list.map(r=>`<tr><td><b>${esc(r.title)}</b><br><small class="muted">${r.id} · ${r.date}</small></td><td>${r.asset}</td><td>${esc(r.reporter)}</td><td>${statusPill(r.status)}</td><td><button class="text-link" data-report="${r.id}">Detail ${ico('chevron',12)}</button></td></tr>`).join('')}</tbody></table></div></section>`;
}
function renderValidationQueue() {
  const list=reports.filter(r=>r.status==='validation');
  return `${pageHead('VALIDASI AHLI','Tentukan validitas temuan.','Tinjau bukti lapangan sebelum pengetahuan dimasukkan ke Synqra.')}<section class="card card-pad"><div class="card-title"><div><h3>${list.length} temuan menunggu validasi</h3><p>Hanya laporan yang sudah diperiksa departemen ditampilkan di sini.</p></div></div>${list.length?list.map(r=>reportRow(r,'Periksa bukti')).join(''):`<div class="empty-state">${ico('checkCircle',28)}<p>Semua temuan sudah ditinjau.</p></div>`}</section>`;
}
function renderValidationDetail() {
  const r=reports.find(x=>x.id===state.activeReport)||reports.find(x=>x.status==='validation');
  if(!r)return `<div class="empty-state">Tidak ada temuan untuk divalidasi.</div>`;
  const a=assets.find(x=>x.id===r.asset)||assets[0];
  return `${pageHead('PEMERIKSAAN TEMUAN','Apakah temuan ini terbukti?','Bandingkan uraian teknisi dengan bukti yang tersedia.',`<button class="btn btn-outline" data-page="validation-queue">${ico('back',14)} Kembali</button>`)}
    <div class="detail-grid"><section class="card card-pad"><div class="card-title"><div><h3>${esc(r.title)}</h3><p>${r.id} · ${r.date}</p></div>${statusPill(r.status)}</div>${evidencePreview(r,a)}<div class="detail-item"><span>Equipment</span><b>${a.name} · ${a.id}</b></div><div class="detail-item"><span>Lokasi</span><b>${a.area}</b></div><div class="detail-item"><span>Pelapor</span><b>${r.reporter}</b></div><div class="detail-item"><span>Bukti terlampir</span><b>${r.evidence}</b></div></section>
    <aside class="card card-pad"><div class="card-title"><div><h3>Uraian temuan</h3><p>Dengarkan konteks dari lapangan.</p></div></div><p style="font-size:12px;line-height:1.9">${esc(r.description)}</p><div class="field" style="margin-top:15px"><label for="validator-note">Catatan keputusan</label><textarea class="control" id="validator-note" rows="3" placeholder="Tuliskan alasan singkat dan dasar keputusan..."></textarea></div>
    <button class="decision-card" data-action="decision" data-decision="verified" data-id="${r.id}"><span class="decision-icon">${ico('checkCircle',18)}</span><span><b>Temuan valid</b><small>Bukti mendukung adanya masalah. Simpan sebagai pengetahuan.</small></span>${ico('chevron',15)}</button>
    <button class="decision-card" data-action="decision" data-decision="more" data-id="${r.id}"><span class="decision-icon" style="background:var(--amber-bg);color:var(--amber)">${ico('refresh',18)}</span><span><b>Perlu bukti tambahan</b><small>Kembalikan untuk melengkapi pemeriksaan.</small></span>${ico('chevron',15)}</button>
    <button class="decision-card" data-action="decision" data-decision="rejected" data-id="${r.id}"><span class="decision-icon" style="background:var(--red-bg);color:var(--red)">${ico('xCircle',18)}</span><span><b>Temuan tidak valid</b><small>Simpan keputusan tanpa memasukkan ke knowledge base.</small></span>${ico('chevron',15)}</button><p class="prototype-note">Pengesahan pengetahuan pada prototype ini hanya mengubah status data demo.</p></aside></div>`;
}
function renderKnowledge() {
  const q=state.knowledgeQuery.toLowerCase();
  const list=knowledge.filter(k=>`${k.title} ${k.asset} ${k.assetName} ${k.symptom}`.toLowerCase().includes(q));
  return `${pageHead('KNOWLEDGE BASE','Pengetahuan dari pengalaman lapangan.','Temukan kasus serupa, penyebab yang sudah ditinjau, dan tindakan penyelesaian.',`<span class="env-label">${knowledge.length} CONTOH PENGETAHUAN</span>`)}<div class="searchbar" style="margin-bottom:17px">${ico('search')}<input id="knowledge-search" value="${esc(state.knowledgeQuery)}" placeholder="Cari gejala, nama peralatan, atau tag aset..." /></div><div class="grid grid-3">${list.map(k=>`<article class="card knowledge-card"><div class="knowledge-visual">${equipmentArt(k.type)}</div><div class="knowledge-body"><div style="display:flex;justify-content:space-between;align-items:center;gap:7px"><span class="eyebrow">${k.id}</span>${statusPill(k.status==='verified'?'verified':'review')}</div><h3>${esc(k.title)}</h3><p>${esc(k.assetName)} · ${k.asset}</p><div style="font-size:10px;color:#52647A;line-height:1.65;min-height:48px">${esc(k.symptom)}</div><button class="btn btn-outline btn-sm btn-full" style="margin-top:13px" data-knowledge="${k.id}">Buka pengetahuan ${ico('arrow',13)}</button></div></article>`).join('')}</div>${list.length?'':`<div class="card empty-state" style="margin-top:15px">${ico('search',28)}<p>Tidak ditemukan pengetahuan yang cocok.</p></div>`}<p class="prototype-note">Knowledge Graph divisualisasikan sebagai hubungan antar aset, gejala, penyebab, dan solusi. Data di halaman ini hanya contoh.</p>`;
}
function renderKnowledgeDetail() {
  const k=knowledge.find(x=>x.id===state.knowledgeId)||knowledge[0];
  const asset=assets.find(a=>a.id===k.asset)||assets[0];
  const related=knowledge.filter(x=>x.asset===k.asset && x.id!==k.id);
  return `${pageHead('DETAIL PENGETAHUAN',esc(k.title),`${k.id} · ${k.assetName}`,`<button class="btn btn-outline" data-page="knowledge">${ico('back',14)} Kembali</button>`)}<div class="detail-grid"><section class="card card-pad"><div class="asset-art" style="height:200px">${equipmentArt(k.type)}</div><div class="card-title" style="margin-top:17px"><div><h3>${esc(k.assetName)}</h3><p>${k.asset} · ${asset.area}</p></div>${statusPill(k.status)}</div><div class="detail-item"><span>Gejala</span><b>${esc(k.symptom)}</b></div><div class="detail-item"><span>Penyebab</span><b>${esc(k.cause)}</b></div><div class="detail-item"><span>Solusi</span><b>${esc(k.solution)}</b></div><div class="detail-item"><span>Hasil verifikasi</span><b>${esc(k.result)}</b></div><div class="detail-item"><span>Kasus terkait</span><b>${k.cases} catatan</b></div></section><aside class="card card-pad"><div class="card-title"><div><h3>Hubungan pengetahuan</h3><p>Gambaran sederhana koneksi di Knowledge Graph.</p></div></div><div class="kg-mini"><div class="kg-links"><span class="kg-node">${esc(k.asset)}</span><span class="kg-connector">→</span><span class="kg-node main">${esc(k.title)}</span></div><div class="kg-links"><span class="kg-node">Gejala</span><span class="kg-connector">→</span><span class="kg-node">Penyebab</span><span class="kg-connector">→</span><span class="kg-node">Solusi</span></div></div><div style="margin-top:22px"><div class="card-title"><div><h3>Pengetahuan terkait</h3><p>Kasus lain pada peralatan yang sama.</p></div></div>${related.length?related.map(x=>`<button class="quick-action" style="margin-bottom:8px" data-knowledge="${x.id}"><span class="quick-icon">${ico('file',19)}</span><span><b>${esc(x.title)}</b><small>${x.id} · ${x.asset}</small></span><span class="arrow">${ico('chevron')}</span></button>`).join(''):`<p class="muted small">Belum ada kasus lain pada peralatan ini.</p>`}</div></aside></div>`;
}
function renderValidationHistory() {
  const list=reports.filter(r=>r.status==='verified'||r.status==='rejected');
  return `${pageHead('RIWAYAT VALIDASI','Keputusan yang sudah ditetapkan.','Jejak keputusan validator untuk menjaga keterlacakan temuan.')}<section class="card card-pad"><div class="table-wrap"><table><thead><tr><th>Temuan</th><th>Peralatan</th><th>Pelapor</th><th>Keputusan</th><th>Validator</th><th></th></tr></thead><tbody>${list.map(r=>`<tr><td><b>${esc(r.title)}</b><br><small class="muted">${r.id} · ${r.date}</small></td><td>${r.asset}</td><td>${esc(r.reporter)}</td><td>${statusPill(r.status)}</td><td>${esc(r.verifiedBy||'Rina Suryani')}</td><td><button class="text-link" data-report="${r.id}">Detail ${ico('chevron',12)}</button></td></tr>`).join('')}</tbody></table></div>${list.length?'':`<div class="empty-state">Belum ada keputusan validasi.</div>`}</section>`;
}

function render() {
  const app=$('#app');
  app.innerHTML=state.user?renderApp():renderLogin();
}
function login(roleKey) {
  state.user=roles[roleKey]; state.selectedRole=roleKey; state.page='home'; state.selectedAsset=null; state.draftText='';
  render(); showToast(`Mode demo ${state.user.role} aktif.`);
}
function resetDraft() {
  clearInterval(state.recordingTimer);
  state.selectedAsset=null; state.reportMode='voice'; state.draftText=''; state.transcriptReady=false; state.recording=false; state.seconds=0; state.imageName='';
  if(state.imageUrl) URL.revokeObjectURL(state.imageUrl); state.imageUrl=null;
}
function beginRecording() {
  if(state.recording) {
    clearInterval(state.recordingTimer); state.recording=false;
    const selected=assets.find(a=>a.id===state.selectedAsset)||assets[0];
    const samples={
      heat:`Heat Exchanger ${selected.id} mengalami kenaikan differential pressure dan suhu keluar turun sekitar 12 derajat. Terlihat indikasi deposit pada sisi tube bundle. Kondisi perlu diperiksa lebih lanjut.`,
      pump:`Pompa sentrifugal ${selected.id} mengalami peningkatan getaran sejak awal shift. Terlihat rembesan di area mechanical seal dan suhu bearing meningkat. Mohon dilakukan pemeriksaan.`,
      valve:`Control Valve ${selected.id} merespons perintah dengan lambat. Posisi aktual tertinggal sekitar delapan detik dari sinyal perintah. Mohon dilakukan pemeriksaan actuator dan positioner.`,
      compressor:`Gas Compressor ${selected.id} menunjukkan getaran yang meningkat dari kondisi normal. Kondisi operasi perlu diperiksa dan dibandingkan dengan tren sebelumnya.`,
      vessel:`Separator ${selected.id} menunjukkan indikasi level cairan yang tidak stabil. Perlu pemeriksaan instrumen dan kondisi internal peralatan.`,
      heater:`Process Fired Heater ${selected.id} menunjukkan indikasi suhu skin tube meningkat. Mohon pemeriksaan kondisi operasi dan inspeksi lanjutan.`
    };
    state.draftText=samples[selected.type]||samples.heat;
    state.transcriptReady=true; state.seconds=Math.max(3,state.seconds); render(); showToast('Transkrip contoh berhasil dibuat. Silakan tinjau sebelum dikirim.');
  } else {
    state.recording=true; state.seconds=0; render();
    state.recordingTimer=setInterval(()=>{state.seconds++;const el=$('.voice-panel small');if(el)el.textContent=`Durasi ${String(Math.floor(state.seconds/60)).padStart(2,'0')}:${String(state.seconds%60).padStart(2,'0')} · Tekan tombol untuk selesai`;},1000);
  }
}
function submitReport() {
  if(!state.selectedAsset || !state.draftText.trim()) { showToast('Pilih peralatan dan isi uraian temuan terlebih dahulu.'); return; }
  const a=assets.find(x=>x.id===state.selectedAsset);
  const title = state.draftText.toLowerCase().includes('getar')?'Getaran peralatan meningkat':state.draftText.toLowerCase().includes('bocor')||state.draftText.toLowerCase().includes('rembes')?'Indikasi kebocoran / rembesan':state.draftText.toLowerCase().includes('pressure')||state.draftText.includes('ΔP')?'Perubahan tekanan diferensial':'Temuan baru pada '+a.name;
  const id='RPT-'+(1049+reports.filter(r=>r.id.startsWith('RPT-')).length-5);
  const keptImageUrl=state.imageUrl, keptImageName=state.imageName;
  const editTarget=state.editReportId?reports.find(r=>r.id===state.editReportId):null;
  if(editTarget) {
    editTarget.title=title; editTarget.asset=a.id; editTarget.symptom=state.draftText.slice(0,100); editTarget.description=state.draftText; editTarget.dept=a.dept; editTarget.status='submitted'; editTarget.date=`${nowLabel()} · Dilengkapi`; editTarget.note=''; editTarget.evidence=keptImageName||editTarget.evidence; editTarget.imageUrl=keptImageUrl||editTarget.imageUrl; editTarget.source=state.reportMode; 
    state.imageUrl=null; state.editReportId=null; resetDraft(); state.activeReport=editTarget.id; state.page='report-detail'; render(); showToast('Informasi tambahan dikirim kembali ke departemen.'); return;
  }
  reports.unshift({id,title,asset:a.id,symptom:state.draftText.slice(0,100),description:state.draftText,reporter:state.user.name,reporterRole:state.user.role,dept:a.dept,date:`${nowLabel()} · Demo`,status:'submitted',evidence:keptImageName||'Bukti foto belum dilampirkan',imageUrl:keptImageUrl,priority:'medium',source:state.reportMode});
  state.imageUrl=null; // URL is now owned by the in-memory demo report.
  resetDraft(); state.activeReport=id; state.page='report-detail'; render(); showToast('Laporan demo berhasil dikirim ke antrean departemen.');
}
function openReport(id) { state.activeReport=id; state.page=state.user.key==='reviewer'&&['submitted','more'].includes(reports.find(r=>r.id===id)?.status)?'review-detail':state.user.key==='validator'&&reports.find(r=>r.id===id)?.status==='validation'?'validation-detail':'report-detail'; render(); }
function openDecisionModal(id,decision,initialNote='') {
  const r=reports.find(x=>x.id===id); if(!r)return;
  const labels={verified:'Sahkan temuan ini?',more:'Minta bukti tambahan?',rejected:'Tandai temuan tidak valid?'};
  const desc={verified:'Temuan akan masuk ke Knowledge Base sebagai temuan terverifikasi.',more:'Laporan akan dikembalikan untuk dilengkapi oleh teknisi.',rejected:'Keputusan penolakan akan tercatat dalam riwayat validasi.'};
  $('#modal-root').innerHTML=`<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="decision-title"><div class="eyebrow">KONFIRMASI KEPUTUSAN</div><h3 id="decision-title">${labels[decision]}</h3><p>${desc[decision]}</p><div class="field"><label for="decision-reason">Alasan / catatan validator</label><textarea id="decision-reason" class="control" rows="4" placeholder="Tuliskan dasar keputusan secara singkat...">${esc(initialNote)}</textarea></div><div class="modal-actions"><button class="btn btn-outline" data-action="close-modal">Batal</button><button class="btn btn-primary" data-action="confirm-decision" data-decision="${decision}" data-id="${id}">Konfirmasi</button></div></section></div>`;
}
function confirmDecision(id,decision) {
  const r=reports.find(x=>x.id===id); if(!r)return;
  const note=$('#decision-reason')?.value.trim()||'';
  if(note.length<5){showToast('Tambahkan alasan singkat untuk keputusan ini.');return;}
  r.status=decision; r.note=note; r.verifiedBy=state.user.name;
  if(decision==='verified') {
    const a=assets.find(x=>x.id===r.asset)||assets[0];
    if(!knowledge.some(k=>k.id===`KB-${r.id.slice(-3)}`)) knowledge.unshift({id:`KB-${r.id.slice(-3)}`,title:r.title,asset:r.asset,assetName:a.name+' · '+a.subtitle,symptom:r.symptom,cause:'Menunggu investigasi lanjutan untuk konfirmasi akar penyebab.',solution:'Tindakan korektif akan ditambahkan setelah proses perbaikan dan verifikasi selesai.',result:'Temuan awal disahkan oleh validator; hasil perbaikan belum dicatat.',cases:1,tags:['Temuan terverifikasi',a.dept],type:a.type,status:'verified'});
  }
  $('#modal-root').innerHTML=''; state.page='validation-queue'; render(); showToast(decision==='verified'?'Temuan disahkan dan ditambahkan ke Knowledge Base demo.':decision==='more'?'Permintaan bukti tambahan dicatat.':'Keputusan tidak valid telah dicatat.');
}
function handleAction(action,target) {
  if(action==='logout') { state.user=null; state.page='login'; resetDraft(); render(); return; }
  if(action==='theme') { document.body.classList.toggle('soft-contrast'); showToast('Preferensi tampilan demo diubah.'); return; }
  if(action==='notifications') { showToast('Tidak ada notifikasi baru.'); return; }
  if(action==='user-menu') { showToast(`${state.user.name} · ${state.user.dept}`); return; }
  if(action==='toggle-record') { beginRecording(); return; }
  if(action==='complete-report') {
    const r=reports.find(x=>x.id===target.dataset.id); if(!r)return;
    state.editReportId=r.id; state.selectedAsset=r.asset; state.reportMode='text'; state.draftText=r.description; state.transcriptReady=false; state.imageUrl=r.imageUrl||null; state.imageName=''; state.page='new-report'; render(); return;
  }
  if(action==='submit-report') { submitReport(); return; }
  if(action==='remove-photo') { if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);state.imageUrl=null;state.imageName='';render();return; }
  if(action==='forward-report') {
    const r=reports.find(x=>x.id===target.dataset.id); if(r){r.status='validation';r.note='Laporan dinyatakan lengkap oleh reviewer departemen.';state.page='review-queue';render();showToast('Laporan diteruskan ke antrean validator.');} return;
  }
  if(action==='return-report') {
    const r=reports.find(x=>x.id===target.dataset.id); if(r){r.status='more';r.note=$('#review-note')?.value.trim()||'Mohon lengkapi informasi atau bukti pendukung.';state.page='review-queue';render();showToast('Laporan dikembalikan ke teknisi.');} return;
  }
  if(action==='decision') { openDecisionModal(target.dataset.id,target.dataset.decision,$('#validator-note')?.value||''); return; }
  if(action==='confirm-decision') { confirmDecision(target.dataset.id,target.dataset.decision); return; }
  if(action==='close-modal') { if(target.classList.contains('modal-backdrop')||target.closest('.modal')===null)$('#modal-root').innerHTML='';else if(target.tagName==='BUTTON'&&target.textContent.trim()==='Batal')$('#modal-root').innerHTML=''; return; }
}

document.addEventListener('click', e => {
  const role=e.target.closest('[data-role]'); if(role){state.selectedRole=role.dataset.role;render();return;}
  const page=e.target.closest('[data-page]'); if(page){const next=page.dataset.page;if(next==='new-report'&&state.user.key!=='technician'){showToast('Pembuatan laporan tersedia untuk teknisi.');return;}if(next==='new-report')resetDraft();goto(next);return;}
  const action=e.target.closest('[data-action]'); if(action){handleAction(action.dataset.action,action);return;}
  const report=e.target.closest('[data-report]'); if(report){openReport(report.dataset.report);return;}
  const asset=e.target.closest('[data-asset]'); if(asset){state.selectedAsset=asset.dataset.asset;render();return;}
  const mode=e.target.closest('[data-mode]'); if(mode){state.reportMode=mode.dataset.mode;render();return;}
  const rf=e.target.closest('[data-report-filter]'); if(rf){state.reportFilter=rf.dataset.reportFilter;render();return;}
  const qf=e.target.closest('[data-queue-filter]'); if(qf){state.queueFilter=qf.dataset.queueFilter;render();return;}
  const kn=e.target.closest('[data-knowledge]'); if(kn){state.knowledgeId=kn.dataset.knowledge;goto('knowledge-detail');return;}
});
document.addEventListener('submit', e=>{if(e.target.id==='login-form'){e.preventDefault();login(state.selectedRole);}});
document.addEventListener('input', e=>{
  if(e.target.id==='report-text'){state.draftText=e.target.value;const btn=$('[data-action="submit-report"]');if(btn)btn.disabled=!state.selectedAsset||!state.draftText.trim();}
  if(e.target.id==='asset-search'){
    const q=e.target.value.toLowerCase();$$('[data-asset]').forEach(card=>{card.classList.toggle('hidden',!card.textContent.toLowerCase().includes(q));});
  }
  if(e.target.id==='knowledge-search'){
    state.knowledgeQuery=e.target.value; const pos=e.target.selectionStart; render();const input=$('#knowledge-search');if(input){input.focus();input.setSelectionRange(pos,pos);}
  }
});
document.addEventListener('change', e=>{
  if(e.target.id==='evidence-file'&&e.target.files?.[0]){if(state.imageUrl)URL.revokeObjectURL(state.imageUrl);state.imageUrl=URL.createObjectURL(e.target.files[0]);state.imageName=e.target.files[0].name;render();}
});

// Start on the role-aware demo login screen.
render();
