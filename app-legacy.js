/* ==========================================================================
   SYNQRA MOBILE SYSTEM — BLUE MOBILE APP THEME (PERSIS FIGMA COINPAY)
   ========================================================================== */

const $ = s => document.querySelector(s),
    esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
    toast = m => {
        const t = $('#toast');
        t.textContent = m;
        t.className = 'on';
        clearTimeout(toast.tm);
        toast.tm = setTimeout(() => t.className = '', 2800);
    };

/* IKON PERSIS VEKTOR FIGMA REFERENSI */
const IC = {
    award: '<path d="M12 15l-4 6 1.5-6.5L4 10h6L12 3l2 7h6l-5.5 4.5L16 21l-4-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    search: '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    bell: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    send: '<path d="M7 17L17 7M17 7H7M17 7V17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    request: '<path d="M17 7L7 17M7 17H17M7 17V7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    bank: '<path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10h20L12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    spending: '<rect x="2" y="5" width="20" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 10h20M6 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    income: '<circle cx="9" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="15" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 13v3a5 5 0 005 5h1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    bills: '<path d="M14 2H6a2 2 0 00-2 2v16l3-2 3 2 3-2 3 2 3-2 3 2V8l-6-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6M8 12h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    savings: '<path d="M19 11V6a2 2 0 00-2-2H7a2 2 0 00-2 2v5M12 2v2M5 11a7 7 0 1014 0 7 7 0 00-14 0z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="11" r="2" fill="currentColor"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    chev: '<path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    back: '<path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    home: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" fill="currentColor"/>',
    pie: '<path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    scan: '<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M4 16v3a1 1 0 001 1h3M16 20h3a1 1 0 001-1v-3M8 8h8v8H8z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    chat: '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 10a7 7 0 0014 0M12 17v4M8 21h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    plus: '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    check: '<path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
};

const ROLES = {
    hse: { id: 'hse', label: 'HSE Validator', user: 'Rina Suryani', dept: 'HSE & Safety Dept.', email: 'rina.suryani@synqra.com', init: 'RS' },
    engineer: { id: 'engineer', label: 'Engineer Dept.', user: 'Ir. Bambang', dept: 'Rotating & Mechanical', email: 'bambang.eng@synqra.com', init: 'BT' },
    teknisi: { id: 'teknisi', label: 'Teknisi Lapangan', user: 'Ahmad Fauzi', dept: 'Operasi Lapangan', email: 'ahmad.fauzi@synqra.com', init: 'AF' }
};

const STATE = {
    role: 'hse',
    page: 'home',        // 'home' | 'spending' | 'prelim' | 'triage' | 'investigasi' | 'repo' | 'search' | 'profile'
    prelimStep: 1,
    repoTab: 'graf',     // 'graf' | 'mon'
    monFilter: 'all',
    triageId: 'PR-102',
    invId: 'K-033',
    invStep: 1,
    repoTag: 'P-101A',
    repoSub: 'cases',
    repoOpen: { he: true, cv: false, pmp: true },
    searchQ: 'Seal bocor dan getaran naik',
    searchType: '',
    metricMode: 'usd',   // 'usd' | 'cases'
    spendingFilter: 'all'
};

/* DATA KASUS INVESTIGASI TERKONEKSI DENGAN TRANSAKSI */
const CASES = [
    { id: 'K-033', a: 'P', tag: 'P-101A', dp: 'Rotating & Mechanical', g: 'Getaran naik 6,9 mm/s, rembesan seal', st: 'dug', d: '12 Nov 2026', cat: 'Spending', amt: '-$500', icon: 'spending', cls: 'neg' },
    { id: 'K-027', a: 'E', tag: 'E-201', dp: 'Process & Thermal', g: 'Chemical cleaning tabung pulih normal', st: 'ver', d: '11 Nov 2026', cat: 'Income', amt: '+$3000', icon: 'income', cls: 'pos' },
    { id: 'K-031', a: 'F', tag: 'FCV-301', dp: 'Piping & Instrumentation', g: 'Respons valve lambat (tunda 8 detik)', st: 'bukti', d: '10 Nov 2026', cat: 'Bills', amt: '-$800', icon: 'bills', cls: 'neg' },
    { id: 'K-104', a: 'V', tag: 'V-101', dp: 'Process & Thermal', g: 'Fluktuasi level stabil (Auto-Closed)', st: 'ver', d: '08 Nov 2026', cat: 'Savings', amt: '+$1000', icon: 'savings', cls: 'warn' },
    { id: 'K-021', a: 'P', tag: 'P-101A', dp: 'Rotating & Mechanical', g: 'Getaran dan bunyi kerikil hisap', st: 'dug', d: '24 Okt 2026', cat: 'Spending', amt: '-$420', icon: 'spending', cls: 'neg' },
    { id: 'K-014', a: 'P', tag: 'P-101A', dp: 'Rotating & Mechanical', g: 'Mechanical seal aus retak termal', st: 'ver', d: '15 Sep 2026', cat: 'Income', amt: '+$1500', icon: 'income', cls: 'pos' }
];

const PRELIM_LIST = [
    { id: 'PR-101', tag: 'P-101A', dp: 'Rotating & Mechanical', dt: '12 Nov 2026', cat: 'Suspected Equipment Failure', urg: 'Mendesak', st: 4, stLbl: 'Investigation Required', disp: 'Investigasi Lanjutan', g: 'Getaran naik 6,9 mm/s & rembesan seal', kd: 'Getaran 6,9 mm/s, bearing 71 °C', iv: 'Rembesan di housing seal', cs: 'Praduga keausan mechanical seal', ac: 'Inspeksi seal & alignment', ev: ['foto_rembesan_seal.jpg'], linked: 'K-033', note: 'Eskalasi ke investigasi K-033.' },
    { id: 'PR-102', tag: 'E-201', dp: 'Process & Thermal', dt: '11 Nov 2026', cat: 'Abnormal Operating Condition', urg: 'Mendesak', st: 2, stLbl: 'Under Triage', disp: 'Menunggu Triage HSE', g: 'ΔP shell naik 1,1 bar, suhu keluar turun', kd: 'ΔP 1,1 bar (normal 0,2–0,8)', iv: 'Transmitter normal, indikasi fouling', cs: 'Praduga deposit fouling tabung', ac: 'Evaluasi pembersihan tabung', ev: ['log_dcs_e201.csv'], linked: '', note: 'Menunggu penetapan HSE.' },
    { id: 'PR-103', tag: 'FCV-301', dp: 'Piping & Instrumentation', dt: '10 Nov 2026', cat: 'Potential Hazard', urg: 'Belum Pasti', st: 3, stLbl: 'Under Verification', disp: 'Perlu Verifikasi', g: 'Respons bukaan valve tertinggal 8 detik', kd: 'Perintah 60%, aktual 52%', iv: 'Uji stroke belum dilakukan', cs: 'Praduga gesekan packing tinggi', ac: 'Uji stroke saat pemeliharaan', ev: ['log_fcv301.csv'], linked: 'K-031', note: 'Cek kurva histeresis.' },
    { id: 'PR-104', tag: 'V-101', dp: 'Process & Thermal', dt: '08 Nov 2026', cat: 'Near Miss', urg: 'Normal', st: 5, stLbl: 'Closed — With Disposition', disp: 'Auto-Closed', g: 'Fluktuasi level sesaat separator V-101', kd: 'Level 82% selama 20 detik lalu 54%', iv: 'Kondisi aktual aman', cs: 'Gangguan sinyal flushing', ac: 'Flushing impulse selesai', ev: ['kalibrasi_lt101.pdf'], linked: '', note: 'Loncat ke Tahap 5 (Auto-Closed).' }
];

const CASE_DETAIL = {
    'K-033': { g: 'Getaran naik 6,9 mm/s, rembesan seal', kd: 'Getaran 6,9 mm/s, bearing 71 °C, aliran 88%', iv: 'Rembesan 18 tetes/menit pada seal; belum dibongkar', cs: 'Praduga keausan berulang mechanical seal', ac: 'Switch ke P-101B & bongkar seal P-101A', vf: '', docs: { pid: true, hazop: true, dcs: true, insp: false, maint: true }, haz: { node: 'P-101A Seal Chamber', pg: 'Vibration — More', dev: 'Getaran tinggi & rembesan', safe: 'Sensor VT-101 & drain pan' }, fa: { m: 'RCA 5-Why', find: 'Menunggu pembongkaran cincin seal', root: 'Praduga keausan permukaan mechanical seal' }, risk: { il: 3, is: 3, rl: 2, rs: 2, mit: 'Siagakan pompa cadangan P-101B.' }, bk: [{ type: 'Foto Insiden', title: 'Foto rembesan gland seal P-101A', sup: 'Gejala', fig: 'seal' }, { type: 'Log DCS', title: 'Tren getaran 14 hari (3,1–6,9 mm/s)', sup: 'Gejala', fig: 'vib' }] },
    'K-027': { g: 'ΔP naik 40%, suhu keluar turun 12 °C', kd: 'ΔP shell 0,98 bar, suhu keluar turun 12 °C', iv: 'Borescope menemukan kerak 1,8 mm', cs: 'Fouling deposit karbon/aspaltena sisi tabung', ac: 'Chemical cleaning & hydro-jetting tabung', vf: 'ΔP kembali 0,40 bar & suhu pulih 142,5 °C', docs: { pid: true, hazop: true, dcs: true, insp: true, maint: true }, haz: { node: 'E-201 Tube Bundle', pg: 'ΔP — More', dev: 'ΔP tinggi menghambat aliran', safe: 'Transmitter PDT-201' }, fa: { m: 'FMEA', find: 'Kerak 1,8 mm menyempitkan alir 22%', root: 'Fouling sisi tabung pada laju alir rendah' }, risk: { il: 3, is: 3, rl: 1, rs: 2, mit: 'Chemical cleaning bila ΔP > 0,85 bar.' }, bk: [{ type: 'Foto Insiden', title: 'Foto borescope deposit tabung E-201', sup: 'Penyebab', fig: 'fouling' }] },
    'K-031': { g: 'Respons valve lambat (tunda 8 detik)', kd: 'Perintah 60%, aktual tertinggal 8,2 detik', iv: 'Uji stroke belum dilakukan', cs: 'Praduga gesekan stem packing tinggi', ac: 'Uji stroke & atur torsi gland packing', vf: '', docs: { pid: true, hazop: false, dcs: true, insp: false, maint: true }, haz: { node: 'Jalur Umpan FCV-301', pg: 'Flow — Late', dev: 'Lag bukaan 8,2 detik', safe: 'Bypass manual & alarm posisi' }, fa: { m: 'FMEA', find: 'Deadband 6,4% (normal < 1%)', root: 'Praduga gesekan packing tinggi' }, risk: { il: 3, is: 2, rl: 1, rs: 2, mit: 'Kalibrasi smart positioner.' }, bk: [{ type: 'Log Diagnostik', title: 'Kurva histeresis FCV-301', sup: 'Gejala', fig: 'valve' }] },
    'K-104': { g: 'Fluktuasi level sesaat separator V-101', kd: 'Level 82% selama 20 detik lalu 54%', iv: 'Transmitter normal pasca flushing', cs: 'Gangguan sinyal sesaat', ac: 'Flushing impulse line selesai', vf: 'Level stabil 50% selama 7 hari', docs: { pid: true, hazop: true, dcs: true, insp: true, maint: true }, haz: { node: 'V-101 Boot Level', pg: 'Level — High', dev: 'Sinyal transien', safe: 'High level interlock' }, fa: { m: 'RCA 5-Why', find: 'Endapan ringan di tap', root: 'Endapan pada impulse line' }, risk: { il: 2, is: 2, rl: 1, rs: 1, mit: 'Flushing berkala tiap bulan.' }, bk: [{ type: 'Log DCS', title: 'Grafik level sensor LT-101', sup: 'Gejala', fig: 'vib' }] },
    'K-021': { g: 'Getaran dan bunyi kerikil di hisap', kd: 'Aliran 70%, suhu hisap 68 °C', iv: 'Catatan shift malam; belum dibongkar', cs: 'Praduga kavitasi sisi hisap', ac: 'Bersihkan strainer hisap & jaga level > 55%', vf: '', docs: { pid: true, hazop: false, dcs: true, insp: false, maint: false }, haz: { node: 'Suction Line P-101A', pg: 'NPSHa — Less', dev: 'Tekanan hisap rendah', safe: 'Indikator PI-101' }, fa: { m: 'RCA 5-Why', find: 'Tekanan hisap 0,4 barG', root: 'Praduga kavitasi' }, risk: { il: 3, is: 3, rl: 2, rs: 2, mit: 'Pembersihan strainer berkala.' }, bk: [] },
    'K-014': { g: 'Mechanical seal bocor, getaran 7,8 mm/s', kd: 'Getaran 7,8 mm/s, bearing 72 °C', iv: 'Cincin SiC retak termal & misalignment', cs: 'Misalignment poros & kurang flushing', ac: 'Ganti seal & laser alignment poros', vf: 'Getaran turun ke 1,9 mm/s', docs: { pid: true, hazop: true, dcs: true, insp: true, maint: true }, haz: { node: 'P-101A Discharge', pg: 'Flow — Less', dev: 'Flushing rendah', safe: 'Alarm flow' }, fa: { m: 'RCA 5-Why', find: 'Retak radial SiC', root: 'Misalignment poros' }, risk: { il: 4, is: 3, rl: 1, rs: 2, mit: 'Laser alignment berkala.' }, bk: [] }
};

const ASSET_MON = [
    { tag: 'P-101A', name: 'Pompa Sentrifugal Umpan', dp: 'Rotating & Mechanical', st: 'perhatian', find: 'Getaran 6,9 mm/s & rembesan seal (K-033)', next: 'Bongkar seal & validasi' },
    { tag: 'E-201', name: 'Shell & Tube Heat Exchanger', dp: 'Process & Thermal', st: 'perhatian', find: 'ΔP naik ke 1,1 bar (PR-102)', next: 'Dalam Triage HSE' },
    { tag: 'FCV-301', name: 'Flow Control Valve', dp: 'Piping & Instrumentation', st: 'perhatian', find: 'Respons lambat 8 detik (K-031)', next: 'Menunggu uji stroke' },
    { tag: 'P-101B', name: 'Pompa Standby', dp: 'Rotating & Mechanical', st: 'normal', find: 'Getaran normal 1,6 mm/s', next: 'Siap operasi' },
    { tag: 'V-101', name: 'Three-Phase Separator', dp: 'Process & Thermal', st: 'normal', find: 'PR-104 selesai (Auto-Closed)', next: 'Operasi normal' }
];

const REPO_GROUPS = [
    { id: 'pmp', name: 'Pump', units: [{ tag: 'P-101A', dp: 'Rotating & Mechanical', comps: ['Mechanical seal', 'Bearing', 'Impeller', 'Poros'], hist: ['Mar 2025 — Ganti seal & alignment (K-014)', 'Nov 2025 — Kavitasi hisap (K-021)', 'Agu 2026 — Rembesan seal & getaran (K-033)'] }] },
    { id: 'he', name: 'Heat Exchanger', units: [{ tag: 'E-201', dp: 'Process & Thermal', comps: ['Bundel tabung', 'Gasket channel', 'Shell', 'Baffle'], hist: ['Sep 2024 — Ganti gasket channel', 'Jun 2025 — Chemical cleaning tabung (K-027)'] }] },
    { id: 'cv', name: 'Control Valve', units: [{ tag: 'FCV-301', dp: 'Piping & Instrumentation', comps: ['Stem & packing', 'Plug & seat', 'Aktuator', 'Positioner'], hist: ['Feb 2026 — Evaluasi respons lambat 8s (K-031)'] }] }
];

function badgeStatus(st, dp) {
    if (st === 'ver') return `<span class="status-badge ver">Terverifikasi</span>`;
    if (STATE.role === 'hse') return `<span class="status-badge dug">Menunggu HSE</span>`;
    if (STATE.role === 'engineer') return `<span class="status-badge err">Validasi Dept.</span>`;
    return `<span class="status-badge inf">Pemeriksaan</span>`;
}

function go(p) {
    STATE.page = p;
    renderApp();
    const vp = $('#app-viewport');
    if (vp) vp.scrollTo(0, 0);
}

/* ==========================================================================
   BOTTOM NAVIGATION BAR — PERSIS REFERENSI FIGMA:
   [Home] [Pie/Repo] [Royal Blue Center FAB] [Chat/Triage] [Profile]
   ========================================================================== */
function renderBottomNav() {
    const isWorkActive = STATE.page === 'triage' || STATE.page === 'investigasi';
    const workTarget = STATE.role === 'hse' ? 'triage' : STATE.role === 'engineer' ? 'investigasi' : 'search';

    $('#bottom-nav').innerHTML = `
    <!-- Tab 1: Home -->
    <button class="bn-item ${STATE.page === 'home' ? 'on' : ''}" onclick="go('home')" aria-label="Beranda">
      <svg viewBox="0 0 24 24">${IC.home}</svg>
      <span class="bn-active-dot"></span>
    </button>

    <!-- Tab 2: Analytics / Spending / Repo -->
    <button class="bn-item ${STATE.page === 'spending' || STATE.page === 'repo' ? 'on' : ''}" onclick="go('spending')" aria-label="Analitik & Spending">
      <svg viewBox="0 0 24 24">${IC.pie}</svg>
      <span class="bn-active-dot"></span>
    </button>

    <!-- Tab 3: Center Squircle Floating Action Button (Vibrant Royal Blue) -->
    <button class="bn-center-fab" onclick="STATE.prelimStep=1;go('prelim')" aria-label="Buat Laporan Baru">
      <svg viewBox="0 0 24 24">${IC.scan}</svg>
    </button>

    <!-- Tab 4: Messages / Triage -->
    <button class="bn-item ${isWorkActive ? 'on' : ''}" onclick="go('${workTarget}')" aria-label="Triage & Pesan">
      <svg viewBox="0 0 24 24">${IC.chat}</svg>
      <span class="bn-active-dot"></span>
    </button>

    <!-- Tab 5: Profile -->
    <button class="bn-item ${STATE.page === 'profile' ? 'on' : ''}" onclick="go('profile')" aria-label="Profil">
      <svg viewBox="0 0 24 24">${IC.user}</svg>
      <span class="bn-active-dot"></span>
    </button>
  `;
}

/* ==========================================================================
   LAYAR 1: BERANDA (BIRU ELEKTRIK FIGMA + FLOATING 3-AKSI + TRANSACTION ROWS)
   ========================================================================== */
function renderHome() {
    const r = ROLES[STATE.role];
    const isUSD = STATE.metricMode === 'usd';
    const mainMetric = isUSD ? '$20,000' : '20 Kasus';
    const subMetric = isUSD ? 'Available Balance' : 'Investigasi & Triage Aktif';

    return `
    <!-- 1. TOP HERO BANNER BIRU ELEKTRIK -->
    <section class="hero-blue">
      <!-- Ornamen Vektor Garis & Sirkuit Latar Belakang -->
      <svg class="hero-pattern" viewBox="0 0 400 240" fill="none">
        <circle cx="200" cy="120" r="140" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="8 8"/>
        <circle cx="200" cy="120" r="90" stroke="#FFFFFF" stroke-width="1.5"/>
        <circle cx="200" cy="120" r="40" stroke="#FFFFFF" stroke-width="1.5"/>
        <path d="M0 60 Q 200 180 400 60" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M0 180 Q 200 40 400 180" stroke="#FFFFFF" stroke-width="2"/>
        <circle cx="90" cy="80" r="18" fill="#FFFFFF" fill-opacity="0.12"/>
        <circle cx="310" cy="160" r="24" fill="#FFFFFF" fill-opacity="0.12"/>
      </svg>

      <!-- Baris Navigasi Atas Hero (Piala, Search, Lonceng) -->
      <div class="hero-nav">
        <!-- Ikon Trophy / Reward -->
        <button class="hero-icon-btn" onclick="toast('SYNQRA Intelijen Industri — 99.4% Verifikasi Sah')" aria-label="Sertifikasi">
          <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC.award}</svg>
        </button>

        <!-- Search Bar Pill Transparan -->
        <div class="hero-search-bar" onclick="go('search')">
          <svg style="width:17px;height:17px" viewBox="0 0 24 24">${IC.search}</svg>
          <input readonly placeholder='Search "Payments & Kasus"' aria-label="Pencarian">
        </div>

        <!-- Notification Bell dengan Badge Merah -->
        <button class="hero-icon-btn" onclick="go('${STATE.role === 'hse' ? 'triage' : 'investigasi'}')" aria-label="Notifikasi">
          <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC.bell}</svg>
          <span class="badge-dot"></span>
        </button>
      </div>

      <!-- Konten Tengah Hero (Pill Flag, Saldo $20,000, Add Money) -->
      <div class="hero-content">
        <button class="hero-tag-pill" onclick="STATE.metricMode = STATE.metricMode === 'usd' ? 'cases' : 'usd'; renderApp(); toast('Format diubah ke ' + (STATE.metricMode === 'usd' ? 'Finansial USD' : 'Metrik Kasus'));">
          <span>🇺🇸</span>
          <span>${isUSD ? 'US Dollar' : r.label}</span>
          <span style="font-size:10px;opacity:0.8">▾</span>
        </button>

        <div class="hero-balance">${mainMetric}</div>
        <div class="hero-sub-label">${subMetric}</div>

        <button class="hero-cta-btn" onclick="STATE.prelimStep=1;go('prelim')">
          <svg style="width:16px;height:16px" viewBox="0 0 24 24">${IC.plus}</svg>
          <span>Add Money & Lapor</span>
        </button>
      </div>
    </section>

    <!-- 2. KARTU MENGAMBANG 3-AKSI (SEND | REQUEST | BANK) -->
    <div class="floating-action-card">
      <button class="fa-item" onclick="STATE.prelimStep=1;go('prelim')">
        <span class="fa-circle blue">
          <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC.send}</svg>
        </span>
        <span class="fa-label">Send</span>
      </button>

      <button class="fa-item" onclick="go('${STATE.role === 'hse' ? 'triage' : 'investigasi'}')">
        <span class="fa-circle amber">
          <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC.request}</svg>
        </span>
        <span class="fa-label">Request</span>
      </button>

      <button class="fa-item" onclick="go('repo')">
        <span class="fa-circle yellow">
          <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC.bank}</svg>
        </span>
        <span class="fa-label">Bank</span>
      </button>
    </div>

    <!-- 3. SECTION "TRANSACTION" (PERSIS DAFTAR 4 BARIS SQUIRCLE PASTEL FIGMA) -->
    <div class="page-body">
      <div class="section-bar">
        <h2>Transaction</h2>
        <button class="section-arrow-btn" onclick="go('spending')" aria-label="Lihat Semua Transaksi">
          <svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.arrowRight}</svg>
        </button>
      </div>

      <div class="txn-card-group">
        ${CASES.slice(0, 4).map(c => `
          <button class="txn-row" onclick="STATE.invId='${c.id}';go('investigasi')">
            <!-- Icon Squircle Pastel -->
            <div class="txn-icon ${c.icon}">
              <svg style="width:22px;height:22px" viewBox="0 0 24 24">${IC[c.icon] || IC.spending}</svg>
            </div>

            <!-- Teks Tengah -->
            <div class="txn-mid">
              <span class="txn-title">${c.cat}</span>
              <span class="txn-sub">${c.id} (${c.tag}) · ${esc(c.g)}</span>
            </div>

            <!-- Nilai Nominal & Chevron -->
            <div class="txn-end">
              <span class="txn-val ${c.cls}">${c.amt}</span>
              <svg class="txn-chevron" viewBox="0 0 24 24">${IC.chev}</svg>
            </div>
          </button>
        `).join('')}
      </div>

      <!-- 4. RINGKASAN SPENDING & GRAFIK MINGGUAN (LAYAR 7 REFERENSI FIGMA) -->
      <div class="section-bar" style="margin-top:20px">
        <h2>Spending Overview</h2>
        <button class="section-arrow-btn" onclick="go('spending')">
          <svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.arrowRight}</svg>
        </button>
      </div>

      <!-- DUAL KPI CARDS (TOTAL SPEND & AVAILABLE BALANCE) -->
      <div class="dual-kpi-grid">
        <div class="kpi-card blue" onclick="go('spending')" style="cursor:pointer">
          <span class="kpi-title">Total Spend</span>
          <div class="kpi-amount">$500.00</div>
        </div>
        <div class="kpi-card yellow" onclick="go('spending')" style="cursor:pointer">
          <span class="kpi-title">Available Balance</span>
          <div class="kpi-amount">$20,000.00</div>
        </div>
      </div>

      <!-- GRAFIK MINGGUAN (2-8, 9-15, 16-22, 23-29, 30-1) -->
      <div class="bar-chart-card">
        <div class="chart-head">
          <b>Aktivitas Mingguan</b>
          <span class="pill-badge">Januari 2026</span>
        </div>
        <div class="bar-track-wrap">
          ${[
            ['2-8', 65, '$320'],
            ['9-15', 40, '$180'],
            ['16-22', 88, '$500'],
            ['23-29', 52, '$260'],
            ['30-1', 75, '$410']
        ].map(([day, pct, val]) => `
            <div class="bar-col" title="${day}: ${val}">
              <div class="bar-pill">
                <div class="bar-fill" style="height:${pct}%"></div>
              </div>
              <span class="bar-label">${day}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   LAYAR 2: SPENDING & ANALYTICS (PERSIS LAYAR 7 DI FIGMA)
   ========================================================================== */
function renderSpending() {
    return `
    <div class="subpage-head">
      <div class="subpage-left">
        <button class="back-circle-btn" onclick="go('home')"><svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.back}</svg></button>
        <h1 class="subpage-title">Spending</h1>
      </div>
      <button class="hero-tag-pill" style="background:var(--primary-soft);border-color:transparent;color:var(--primary);margin:0" onclick="toast('Filter bulan Januari terpilih')">
        <span>January ▾</span>
      </button>
    </div>

    <div class="page-body">
      <!-- DUAL KPI CARDS -->
      <div class="dual-kpi-grid">
        <div class="kpi-card blue">
          <span class="kpi-title">Total Spend</span>
          <div class="kpi-amount">$500.00</div>
        </div>
        <div class="kpi-card yellow">
          <span class="kpi-title">Available Balance</span>
          <div class="kpi-amount">$20,000.00</div>
        </div>
      </div>

      <!-- GRAFIK MINGGUAN -->
      <div class="bar-chart-card">
        <div class="chart-head">
          <b>Analisis Pengeluaran & Kasus</b>
          <span class="pill-badge">5 Periode</span>
        </div>
        <div class="bar-track-wrap">
          ${[
            ['2-8', 65],
            ['9-15', 40],
            ['16-22', 88],
            ['23-29', 52],
            ['30-1', 75]
        ].map(([day, pct]) => `
            <div class="bar-col">
              <div class="bar-pill">
                <div class="bar-fill" style="height:${pct}%"></div>
              </div>
              <span class="bar-label">${day}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- PILL CATEGORIES -->
      <div class="pill-tabs-row">
        ${['Spending', 'Income', 'Bills', 'Savings'].map(tab => `
          <button class="tab-pill ${STATE.spendingFilter === tab.toLowerCase() ? 'on' : ''}" onclick="STATE.spendingFilter='${tab.toLowerCase()}';renderApp()">${tab}</button>
        `).join('')}
      </div>

      <!-- SPENDING LIST -->
      <div class="section-bar">
        <h2>Spending list</h2>
        <svg style="width:18px;height:18px;color:var(--tx2)" viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </div>

      <div class="txn-card-group">
        ${CASES.map(c => `
          <button class="txn-row" onclick="STATE.invId='${c.id}';go('investigasi')">
            <div class="txn-icon ${c.icon}">
              <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC[c.icon] || IC.spending}</svg>
            </div>
            <div class="txn-mid">
              <span class="txn-title">${c.id} (${c.tag})</span>
              <span class="txn-sub">${c.d} · ${esc(c.g)}</span>
            </div>
            <div class="txn-end">
              <span class="txn-val ${c.cls}">${c.amt}</span>
              <svg class="txn-chevron" viewBox="0 0 24 24">${IC.chev}</svg>
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   LAYAR 3: PROFIL PENGGUNA (PERSIS "MY PROFILE" LAYAR 2 DI FIGMA)
   ========================================================================== */
function renderProfile() {
    const r = ROLES[STATE.role];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    return `
    <div class="subpage-head">
      <div class="subpage-left">
        <button class="back-circle-btn" onclick="go('home')"><svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.back}</svg></button>
        <h1 class="subpage-title">My Profile</h1>
      </div>
      <button class="back-circle-btn" onclick="toast('Edit data profil')" aria-label="Edit Profil">
        <svg style="width:16px;height:16px" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
      </button>
    </div>

    <div class="page-body">
      <!-- KARTU AVATAR & IDENTITAS USER -->
      <div class="white-card" style="text-align:center;padding:26px 16px">
        <div style="position:relative;width:76px;height:76px;margin:0 auto 12px">
          <div style="width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg, #304FFE, #1E3CD8);color:#FFFFFF;font-size:24px;font-weight:800;display:grid;place-items:center;box-shadow:var(--sh-fab)">
            ${r.init}
          </div>
          <span style="position:absolute;bottom:0;right:0;width:24px;height:24px;background:#10B981;border:3px solid #FFFFFF;border-radius:50%"></span>
        </div>
        <b style="font-size:18px;color:var(--tx);display:block">${r.user}</b>
        <span style="font-size:13px;color:var(--tx2);display:block;margin-top:2px">${r.email}</span>
        <span class="status-badge inf" style="margin-top:8px">${r.label} · ${r.dept}</span>
      </div>

      <!-- DAFTAR PENGATURAN ALA FIGMA (DARK MODE, PERSONAL INFO, DLL) -->
      <div class="txn-card-group">
        <!-- Row 1: Dark Mode Toggle -->
        <div class="txn-row" style="cursor:default">
          <div class="txn-icon" style="background:#E2E8F0;color:#1E293B">
            <svg style="width:20px;height:20px" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>
          </div>
          <div class="txn-mid">
            <span class="txn-title">Dark Mode</span>
          </div>
          <div class="txn-end">
            <label class="ios-switch">
              <input type="checkbox" ${isDark ? 'checked' : ''} onchange="toggleTheme();renderApp()">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <!-- Row 2: Personal Info -->
        <button class="txn-row" onclick="toast('Data personil: ' + '${r.user}')">
          <div class="txn-icon spending">
            <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC.user}</svg>
          </div>
          <div class="txn-mid">
            <span class="txn-title">Personal Info</span>
          </div>
          <div class="txn-end"><svg class="txn-chevron" viewBox="0 0 24 24">${IC.chev}</svg></div>
        </button>

        <!-- Row 3: Bank & Cards (Pabrik & Aset) -->
        <button class="txn-row" onclick="go('repo')">
          <div class="txn-icon bills">
            <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC.bank}</svg>
          </div>
          <div class="txn-mid">
            <span class="txn-title">Bank & Cards (Aset Pabrik)</span>
          </div>
          <div class="txn-end"><svg class="txn-chevron" viewBox="0 0 24 24">${IC.chev}</svg></div>
        </button>

        <!-- Row 4: Transaction -->
        <button class="txn-row" onclick="go('spending')">
          <div class="txn-icon income">
            <svg style="width:20px;height:20px" viewBox="0 0 24 24">${IC.spending}</svg>
          </div>
          <div class="txn-mid">
            <span class="txn-title">Transaction</span>
          </div>
          <div class="txn-end"><svg class="txn-chevron" viewBox="0 0 24 24">${IC.chev}</svg></div>
        </button>

        <!-- Row 5: Settings -->
        <button class="txn-row" onclick="toast('Buka Pengaturan Sistem')">
          <div class="txn-icon blue">
            <svg style="width:20px;height:20px" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </div>
          <div class="txn-mid">
            <span class="txn-title">Settings</span>
          </div>
          <div class="txn-end"><svg class="txn-chevron" viewBox="0 0 24 24">${IC.chev}</svg></div>
        </button>

        <!-- Row 6: Data Privacy -->
        <button class="txn-row" onclick="toast('Kebijakan privasi & keamanan bukti')">
          <div class="txn-icon savings">
            <svg style="width:20px;height:20px" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </div>
          <div class="txn-mid">
            <span class="txn-title">Data Privacy</span>
          </div>
          <div class="txn-end"><svg class="txn-chevron" viewBox="0 0 24 24">${IC.chev}</svg></div>
        </button>
      </div>

      <!-- GANTI PERAN USER -->
      <div class="section-bar">
        <h2>Pilih Peran Demo</h2>
      </div>

      <div class="txn-card-group">
        ${Object.values(ROLES).map(x => `
          <button class="txn-row" onclick="STATE.role='${x.id}';renderApp();toast('Beralih ke ' + '${x.label}')">
            <div class="txn-icon ${STATE.role === x.id ? 'blue' : 'spending'}">${x.init}</div>
            <div class="txn-mid">
              <span class="txn-title">${x.label}</span>
              <span class="txn-sub">${x.user} · ${x.dept}</span>
            </div>
            <div class="txn-end">
              ${STATE.role === x.id ? '<span class="status-badge ver">Aktif</span>' : `<svg class="txn-chevron" viewBox="0 0 24 24">${IC.chev}</svg>`}
            </div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   LAYAR 4: LAPOR AWAL / PRELIMINARY REPORT (STEPPER PERSIS SETTING UP ACC)
   ========================================================================== */
const P_FORM = {
    tag: 'P-101A',
    cat: 'Suspected Equipment Failure',
    urg: 'Mendesak',
    txt: 'Pompa P-101A getarannya naik ke 6,9 mm/s disertai rembesan pada mechanical seal. Suhu bearing 71 °C dan aliran 88% desain. Belum dibongkar.',
    files: ['foto_rembesan_seal.jpg'],
    ents: null
};

function makeEnts(txt, tag) {
    const dp = { 'P-101A': 'Rotating & Mechanical', 'E-201': 'Process & Thermal', 'FCV-301': 'Piping & Instrumentation' }[tag] || 'Process Unit';
    return [
        ['1. Identitas Aset', tag + ' (' + dp + ')'],
        ['2. Gejala Awal', txt.split('.')[0] || txt],
        ['3. Kondisi Operasi', 'Getaran 6,9 mm/s, bearing 71 °C, aliran 88%'],
        ['4. Pemeriksaan Awal', 'Observasi fisik (belum dibongkar)'],
        ['5. Praduga Penyebab', 'Praduga keausan mechanical seal'],
        ['6. Usulan Tindakan', 'Verifikasi fisik & alignment poros'],
        ['7. Verifikasi Sementara', 'Menunggu persetujuan HSE']
    ];
}

function renderPrelim() {
    if (!P_FORM.ents) P_FORM.ents = makeEnts(P_FORM.txt, P_FORM.tag);

    if (STATE.prelimStep === 2) {
        return `
      <div class="subpage-head">
        <div class="subpage-left">
          <button class="back-circle-btn" onclick="STATE.prelimStep=1;renderApp()"><svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.back}</svg></button>
          <h1 class="subpage-title">Review 7 Entitas</h1>
        </div>
        <span class="status-badge dug">Praduga</span>
      </div>

      <div class="page-body">
        <!-- STEPPER STATUS ALA SCREEN 4 FIGMA -->
        <div class="white-card">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:#FFFFFF;display:grid;place-items:center;font-size:12px">✓</div>
            <span style="font-size:13.5px;font-weight:700">Laporan Lapangan Terverifikasi</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:#FFFFFF;display:grid;place-items:center;font-size:12px">✓</div>
            <span style="font-size:13.5px;font-weight:700">Ekstraksi 7 Entitas Otomatis</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:28px;height:28px;border-radius:50%;background:#FEF3C7;color:#D97706;display:grid;place-items:center;font-size:12px;font-weight:800">3</div>
            <span style="font-size:13.5px;font-weight:700">Kirim ke Meja Triage HSE</span>
          </div>
        </div>

        <div class="white-card">
          ${P_FORM.ents.map(([l, v], i) => `
            <div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span class="form-lbl" style="margin:0">${l}</span>
                <span class="status-badge dug">Praduga</span>
              </div>
              <input class="form-inp" value="${esc(v)}" oninput="P_FORM.ents[${i}][1]=this.value">
            </div>
          `).join('')}

          <button class="btn-main" style="margin-top:12px" onclick="submitPrelim()">
            <span>Kirim ke Triage HSE</span>
            <svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.arrowRight}</svg>
          </button>
        </div>
      </div>
    `;
    }

    return `
    <div class="subpage-head">
      <div class="subpage-left">
        <button class="back-circle-btn" onclick="go('home')"><svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.back}</svg></button>
        <h1 class="subpage-title">Lapor Awal</h1>
      </div>
    </div>

    <div class="page-body">
      <div class="white-card">
        <label class="form-lbl" style="margin-top:0">Kode Aset Lapangan</label>
        <select onchange="P_FORM.tag=this.value;P_FORM.ents=makeEnts(P_FORM.txt,this.value)">
          ${['P-101A', 'E-201', 'FCV-301', 'P-101B', 'V-101'].map(a => `<option value="${a}" ${P_FORM.tag === a ? 'selected' : ''}>${a}</option>`).join('')}
        </select>

        <label class="form-lbl">Kategori Temuan</label>
        <div class="pill-tabs-row" style="margin-bottom:6px">
          ${['Suspected Equipment Failure', 'Abnormal Operating Condition', 'Potential Hazard', 'Near Miss'].map(c => `
            <button type="button" class="tab-pill ${P_FORM.cat === c ? 'on' : ''}" onclick="P_FORM.cat='${c}';renderApp()">${c}</button>
          `).join('')}
        </div>

        <label class="form-lbl">Deskripsi Lapangan (Suara / Teks)</label>
        <textarea oninput="P_FORM.txt=this.value;P_FORM.ents=makeEnts(this.value,P_FORM.tag)">${esc(P_FORM.txt)}</textarea>

        <button type="button" class="btn-main btn-sec btn-sm" style="margin-top:8px" onclick="fillVoice()">
          <svg style="width:16px;height:16px" viewBox="0 0 24 24">${IC.mic}</svg>
          <span>Transkrip Contoh Suara Teknisi</span>
        </button>

        <label class="form-lbl">Lampirkan Bukti Foto</label>
        <label style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1.5px dashed var(--primary);border-radius:14px;cursor:pointer;background:var(--card)">
          <span style="font-size:13px;font-weight:600">${P_FORM.files.join(', ') || 'Pilih foto atau log DCS…'}</span>
          <span class="status-badge inf">Pilih File</span>
          <input type="file" hidden multiple onchange="Array.from(this.files).forEach(f=>P_FORM.files.push(f.name));renderApp()">
        </label>

        <button class="btn-main" style="margin-top:20px" onclick="STATE.prelimStep=2;renderApp()">
          <span>Review 7 Entitas Praduga</span>
          <svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.arrowRight}</svg>
        </button>
      </div>
    </div>
  `;
}

function fillVoice() {
    const m = {
        'P-101A': 'Pompa P-101A getarannya naik ke 6,9 mm/s disertai rembesan pada mechanical seal. Suhu bearing 71 °C dan aliran 88% desain. Belum dibongkar.',
        'E-201': 'Heat exchanger E-201 ΔP naik ke 1,1 bar dan suhu keluar turun 9 °C. Indikasi deposit fouling tabung.',
        'FCV-301': 'Control valve FCV-301 respons bukaan tertinggal 8 detik dari sinyal perintah 60%.'
    };
    P_FORM.txt = m[P_FORM.tag] || m['P-101A'];
    P_FORM.ents = makeEnts(P_FORM.txt, P_FORM.tag);
    renderApp();
    toast('Transkrip suara berhasil diekstrak.');
}

function submitPrelim() {
    const id = 'PR-' + (PRELIM_LIST.length + 101);
    const dp = { 'P-101A': 'Rotating & Mechanical', 'E-201': 'Process & Thermal', 'FCV-301': 'Piping & Instrumentation' }[P_FORM.tag] || 'Process & Thermal';
    PRELIM_LIST.unshift({
        id, tag: P_FORM.tag, dp, dt: '13 Nov 2026', cat: P_FORM.cat, urg: P_FORM.urg,
        st: 2, stLbl: 'Under Triage', disp: 'Menunggu Triage HSE',
        g: P_FORM.ents[1][1], kd: P_FORM.ents[2][1], iv: P_FORM.ents[3][1], cs: P_FORM.ents[4][1], ac: P_FORM.ents[5][1],
        ev: [...P_FORM.files], linked: '', note: 'Laporan baru dari lapangan.'
    });
    STATE.prelimStep = 1;
    STATE.triageId = id;
    toast(id + ' berhasil diteruskan ke Meja Triage.');
    go(STATE.role === 'hse' ? 'triage' : 'home');
}

/* ==========================================================================
   LAYAR 5: MEJA TRIAGE HSE
   ========================================================================== */
function renderTriage() {
    const cur = PRELIM_LIST.find(p => p.id === STATE.triageId) || PRELIM_LIST[0];

    return `
    <div class="subpage-head">
      <div class="subpage-left">
        <button class="back-circle-btn" onclick="go('home')"><svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.back}</svg></button>
        <h1 class="subpage-title">Meja Triage HSE</h1>
      </div>
      <span class="status-badge inf">${PRELIM_LIST.length} Antrean</span>
    </div>

    <div class="page-body">
      <div class="section-bar">
        <h2>Pilih Laporan Masuk</h2>
      </div>

      <div class="txn-card-group">
        ${PRELIM_LIST.map(p => `
          <button class="txn-row" style="${p.id === cur.id ? 'background:var(--primary-soft)' : ''}" onclick="STATE.triageId='${p.id}';renderApp()">
            <div class="txn-icon ${p.st === 5 ? 'income' : 'bills'}">${p.tag[0]}</div>
            <div class="txn-mid">
              <span class="txn-title">${p.id} (${p.tag})</span>
              <span class="txn-sub">${p.cat} · ${esc(p.g)}</span>
            </div>
            <div class="txn-end">
              <span class="status-badge ${p.st === 5 ? 'ver' : p.st === 4 ? 'err' : 'dug'}">Tahap ${p.st}</span>
            </div>
          </button>
        `).join('')}
      </div>

      <div class="white-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <b style="font-size:15.5px">Disposisi ${cur.id} (${cur.tag})</b>
          <span class="status-badge dug">Tahap ${cur.st}</span>
        </div>

        <div style="background:var(--card);padding:12px;border-radius:14px;border:1px solid var(--border);font-size:13px;margin-bottom:14px">
          <div><b>Gejala:</b> ${esc(cur.g)}</div>
          <div style="margin-top:4px"><b>Kondisi Operasi:</b> ${esc(cur.kd)}</div>
          <div style="margin-top:4px"><b>Praduga:</b> ${esc(cur.cs)}</div>
        </div>

        <label class="form-lbl" style="margin-top:0">Keputusan Disposisi HSE</label>
        <select id="tr-dec">
          <option value="inv" ${cur.st === 4 ? 'selected' : ''}>Investigasi Lanjutan (Buka Ruang Penuh)</option>
          <option value="ver" ${cur.st === 3 && cur.disp.includes('Verifikasi') ? 'selected' : ''}>Perlu Verifikasi Fisik</option>
          <option value="mon" ${cur.st === 3 && cur.disp.includes('Monitoring') ? 'selected' : ''}>Monitoring Parameter Operasi</option>
          <option value="cls" ${cur.st === 5 ? 'selected' : ''}>Auto-Closed (Loncat ke Tahap 5 — Aman)</option>
        </select>

        <label class="form-lbl">Catatan Penetapan</label>
        <textarea id="tr-note">${esc(cur.note)}</textarea>

        <div style="display:flex;gap:10px;margin-top:14px">
          <button class="btn-main" onclick="saveTriage('${cur.id}')">Simpan Keputusan</button>
          ${cur.linked ? `<button class="btn-main btn-sec" onclick="STATE.invId='${cur.linked}';go('investigasi')">Buka ${cur.linked}</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function saveTriage(id) {
    const cur = PRELIM_LIST.find(p => p.id === id);
    const dec = $('#tr-dec').value;
    cur.note = $('#tr-note').value;
    if (dec === 'cls') { cur.st = 5; cur.stLbl = 'Closed — With Disposition'; cur.disp = 'Auto-Closed'; }
    else if (dec === 'mon') { cur.st = 3; cur.stLbl = 'Under Monitoring'; cur.disp = 'Monitoring'; }
    else if (dec === 'ver') { cur.st = 3; cur.stLbl = 'Under Verification'; cur.disp = 'Perlu Verifikasi'; }
    else {
        cur.st = 4; cur.stLbl = 'Investigation Required'; cur.disp = 'Investigasi Lanjutan';
        if (!cur.linked) {
            const nid = 'K-0' + (CASES.length + 30);
            cur.linked = nid;
            CASES.unshift({ id: nid, a: cur.tag[0], tag: cur.tag, dp: cur.dp, g: cur.g, st: 'dug', d: 'Nov 2026', cat: 'Spending', amt: '-$650', icon: 'spending', cls: 'neg' });
            CASE_DETAIL[nid] = {
                g: cur.g, kd: cur.kd, iv: cur.iv, cs: cur.cs, ac: cur.ac, vf: '',
                docs: { pid: true, hazop: false, dcs: true, insp: false, maint: false },
                haz: { node: cur.tag, pg: 'Operasi — More', dev: cur.g, safe: 'Alarm lokal' },
                fa: { m: 'RCA 5-Why', find: cur.iv, root: cur.cs },
                risk: { il: 3, is: 3, rl: 2, rs: 2, mit: cur.ac },
                bk: cur.ev.map(f => ({ type: 'Bukti Awal', title: f, sup: 'Gejala', fig: 'seal' }))
            };
        }
    }
    renderApp();
    toast('Disposisi ' + id + ' berhasil diperbarui.');
}

/* ==========================================================================
   LAYAR 6: RUANG INVESTIGASI LENGKAP (5 LANGKAH)
   ========================================================================== */
function renderInvestigasi() {
    const k = CASES.find(x => x.id === STATE.invId) || CASES[0];
    const c = CASE_DETAIL[k.id] || CASE_DETAIL['K-033'];

    const stepTabs = `
    <div class="pill-tabs-row">
      ${[[1, '1. 7 Entitas'], [2, '2. Bukti & P&ID'], [3, '3. HAZOP & RCA'], [4, '4. Risiko & CAPA'], [5, '5. Pengesahan']].map(([n, l]) => `
        <button class="tab-pill ${STATE.invStep === n ? 'on' : ''}" onclick="STATE.invStep=${n};renderApp()">${l}</button>
      `).join('')}
    </div>
  `;

    let body = '';
    if (STATE.invStep === 1) {
        const rows = [
            ['1. Identitas Aset', k.tag + ' · ' + k.dp],
            ['2. Gejala Kegagalan', c.g],
            ['3. Kondisi Operasi', c.kd],
            ['4. Hasil Investigasi', c.iv],
            ['5. Akar Penyebab', c.cs],
            ['6. Tindakan Korektif', c.ac],
            ['7. Verifikasi Pascaperbaikan', c.vf || 'Menunggu verifikasi lapangan']
        ];
        body = `
      <div class="txn-card-group">
        ${rows.map(([l, v], i) => `
          <div class="txn-row" style="cursor:default">
            <div class="txn-icon ${i > 3 && k.st !== 'ver' ? 'bills' : 'blue'}">${i + 1}</div>
            <div class="txn-mid">
              <span class="txn-sub" style="margin:0">${l}</span>
              <span class="txn-title" style="white-space:normal">${esc(v)}</span>
            </div>
            ${i === 4 ? `<div class="txn-end">${badgeStatus(k.st, k.dp)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
    } else if (STATE.invStep === 2) {
        body = `
      <div class="white-card">
        <b style="font-size:15px;display:block;margin-bottom:10px">Bukti Tertaut (${c.bk.length})</b>
        <div class="txn-card-group" style="box-shadow:none;border-color:var(--border)">
          ${c.bk.map((b, i) => `
            <button class="txn-row" onclick="showPhoto('${k.id}', ${i})">
              <div class="txn-icon blue">${b.type[0]}</div>
              <div class="txn-mid">
                <span class="txn-title">${esc(b.title)}</span>
                <span class="txn-sub">${esc(b.type)} · Mendukung ${esc(b.sup)}</span>
              </div>
              <div class="txn-end"><span class="status-badge inf">Lihat</span></div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    } else if (STATE.invStep === 3) {
        body = `
      <div class="white-card">
        <b style="font-size:15px;display:block;margin-bottom:10px">Worksheet HAZOP (${esc(c.haz.node)})</b>
        <label class="form-lbl" style="margin-top:0">Parameter & Guide Word</label>
        <input class="form-inp" value="${esc(c.haz.pg)}">
        <label class="form-lbl">Deviation</label>
        <input class="form-inp" value="${esc(c.haz.dev)}">
        <label class="form-lbl">Existing Safeguards</label>
        <input class="form-inp" value="${esc(c.haz.safe)}">

        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
          <b style="font-size:15px;display:block;margin-bottom:8px">Analisis RCA (${esc(c.fa.m)})</b>
          <label class="form-lbl">Temuan Fisik</label>
          <textarea id="fa-f">${esc(c.fa.find)}</textarea>
          <label class="form-lbl">Akar Penyebab (Root Cause)</label>
          <textarea id="fa-r">${esc(c.fa.root)}</textarea>
          <button class="btn-main" style="margin-top:12px" onclick="CASE_DETAIL['${k.id}'].fa.find=$('#fa-f').value;CASE_DETAIL['${k.id}'].fa.root=$('#fa-r').value;CASE_DETAIL['${k.id}'].cs=$('#fa-r').value;renderApp();toast('Analisis disimpan.')">Simpan Analisis</button>
        </div>
      </div>
    `;
    } else if (STATE.invStep === 4) {
        const r = c.risk;
        body = `
      <div class="white-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <b style="font-size:15px">Matriks Risiko 5×5</b>
          <span class="status-badge dug">Awal: ${r.il * r.is} ➔ Sisa: ${r.rl * r.rs}</span>
        </div>
        <label class="form-lbl" style="margin-top:0">Mitigasi Pengendalian</label>
        <textarea>${esc(r.mit)}</textarea>

        <label class="form-lbl">Tindakan Korektif (CAPA)</label>
        <textarea id="cp-a">${esc(c.ac)}</textarea>
        <label class="form-lbl">Verifikasi Pascaperbaikan</label>
        <input class="form-inp" id="cp-v" value="${esc(c.vf)}" placeholder="Diisi setelah perbaikan selesai…">
        <button class="btn-main" style="margin-top:14px" onclick="CASE_DETAIL['${k.id}'].ac=$('#cp-a').value;CASE_DETAIL['${k.id}'].vf=$('#cp-v').value;renderApp();toast('CAPA disimpan.')">Simpan CAPA</button>
      </div>
    `;
    } else {
        body = `
      <div class="white-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <b style="font-size:15.5px">Pengesahan Pakar HSE</b>
          ${badgeStatus(k.st, k.dp)}
        </div>
        <p style="font-size:13.5px;margin:0 0 14px"><b>Akar Penyebab:</b> ${esc(c.cs)}<br><b>Bukti Tertaut:</b> ${c.bk.length} berkas valid</p>
        <label class="form-lbl" style="margin-top:0">Catatan Pengesahan</label>
        <textarea>Bukti fisik dan analisis teknis pada ${k.tag} telah sesuai standar.</textarea>
        <div style="display:flex;gap:10px;margin-top:16px">
          ${STATE.role === 'hse' ? `
            <button class="btn-main" style="flex:1" onclick="CASES.find(x=>x.id==='${k.id}').st='ver';renderApp();toast('${k.id} disahkan menjadi Terverifikasi!')">✓ Sahkan Kasus</button>
            <button class="btn-main btn-sec" style="flex:1" onclick="CASES.find(x=>x.id==='${k.id}').st='bukti';renderApp();toast('${k.id} dikembalikan untuk tambah bukti.')">Minta Bukti</button>
          ` : `<button class="btn-main" onclick="toast('Pengajuan validasi dikirim ke HSE.')">Ajukan Pengesahan ke HSE</button>`}
        </div>
      </div>
    `;
    }

    return `
    <div class="subpage-head">
      <div class="subpage-left">
        <button class="back-circle-btn" onclick="go('home')"><svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.back}</svg></button>
        <h1 class="subpage-title">${k.id} (${k.tag})</h1>
      </div>
      ${badgeStatus(k.st, k.dp)}
    </div>

    <div class="page-body">
      <div style="margin-bottom:12px">
        <select onchange="STATE.invId=this.value;renderApp()" style="font-weight:700">
          ${CASES.map(x => `<option value="${x.id}" ${x.id === k.id ? 'selected' : ''}>${x.id} (${x.tag}) — ${x.g}</option>`).join('')}
        </select>
      </div>
      ${stepTabs}
      ${body}
    </div>
  `;
}

/* ==========================================================================
   LAYAR 7: ASET, KNOWLEDGE GRAPH & MONITORING
   ========================================================================== */
function renderRepo() {
    const curG = REPO_GROUPS.find(g => g.units.some(u => u.tag === STATE.repoTag)) || REPO_GROUPS[0];
    const curU = curG.units.find(u => u.tag === STATE.repoTag) || curG.units[0];
    const uCases = CASES.filter(c => c.tag === curU.tag);

    return `
    <div class="subpage-head">
      <div class="subpage-left">
        <button class="back-circle-btn" onclick="go('home')"><svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.back}</svg></button>
        <h1 class="subpage-title">Aset & Monitoring</h1>
      </div>
    </div>

    <div class="page-body">
      <div class="pill-tabs-row">
        <button class="tab-pill ${STATE.repoTab === 'graf' ? 'on' : ''}" onclick="STATE.repoTab='graf';renderApp()">Knowledge Graph</button>
        <button class="tab-pill ${STATE.repoTab === 'mon' ? 'on' : ''}" onclick="STATE.repoTab='mon';renderApp()">Monitoring Status</button>
      </div>

      <div class="white-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <b style="font-size:15px">Graf Pengetahuan: ${curU.tag}</b>
          <span class="status-badge inf">${curU.dp}</span>
        </div>
        <svg viewBox="0 0 380 140" style="width:100%;background:var(--card);border-radius:14px;border:1px solid var(--border)">
          <line x1="50" y1="70" x2="160" y2="40" stroke="#304FFE" stroke-width="2"/>
          <line x1="50" y1="70" x2="160" y2="100" stroke="#304FFE" stroke-width="2"/>
          <line x1="160" y1="40" x2="290" y2="40" stroke="#10B981" stroke-width="2"/>
          <line x1="160" y1="100" x2="290" y2="100" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4 4"/>
          <!-- Nodes -->
          <circle cx="50" cy="70" r="22" fill="#304FFE"/>
          <text x="50" y="75" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">${curU.tag}</text>
          <circle cx="160" cy="40" r="16" fill="#EEF2FF" stroke="#304FFE" stroke-width="2"/>
          <text x="160" y="44" fill="#304FFE" font-size="9.5" font-weight="700" text-anchor="middle">K-014</text>
          <circle cx="160" cy="100" r="16" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2"/>
          <text x="160" y="104" fill="#F59E0B" font-size="9.5" font-weight="700" text-anchor="middle">K-033</text>
          <rect x="250" y="26" width="90" height="26" rx="6" fill="#D1FAE5"/>
          <text x="295" y="43" fill="#065F46" font-size="9" font-weight="700" text-anchor="middle">Sah Terverifikasi</text>
          <rect x="250" y="86" width="90" height="26" rx="6" fill="#FEF3C7"/>
          <text x="295" y="103" fill="#92400E" font-size="9" font-weight="700" text-anchor="middle">Praduga Seal</text>
        </svg>
      </div>

      <div class="section-bar">
        <h2>Kasus Terkait ${curU.tag}</h2>
      </div>

      <div class="txn-card-group">
        ${uCases.map(k => `
          <button class="txn-row" onclick="STATE.invId='${k.id}';go('investigasi')">
            <div class="txn-icon ${k.icon}">${k.id.slice(-2)}</div>
            <div class="txn-mid">
              <span class="txn-title">${k.id} · ${esc(k.g)}</span>
              <span class="txn-sub">${esc(CASE_DETAIL[k.id]?.cs || '')}</span>
            </div>
            <div class="txn-end">${badgeStatus(k.st, curU.dp)}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   LAYAR 8: SEARCH RAG HIBRIDA
   ========================================================================== */
function renderSearch() {
    return `
    <div class="subpage-head">
      <div class="subpage-left">
        <button class="back-circle-btn" onclick="go('home')"><svg style="width:18px;height:18px" viewBox="0 0 24 24">${IC.back}</svg></button>
        <h1 class="subpage-title">Pencarian RAG</h1>
      </div>
    </div>

    <div class="page-body">
      <div class="white-card" style="display:flex;gap:8px;padding:12px">
        <input class="form-inp" id="sq-inp" value="${esc(STATE.searchQ)}" placeholder="Ketik gejala kerusakan atau kode aset…">
        <button class="btn-main btn-sm" onclick="STATE.searchQ=$('#sq-inp').value;renderApp()">Cari</button>
      </div>

      <div class="section-bar">
        <h2>Rekomendasi Cerdas Berbasis Bukti</h2>
      </div>

      <div class="txn-card-group">
        ${CASES.slice(0, 3).map((r, i) => `
          <button class="txn-row" onclick="showPhoto('${r.id}', 0)">
            <div class="txn-icon ${i === 0 ? 'income' : 'blue'}">${i + 1}</div>
            <div class="txn-mid">
              <span class="txn-title">${r.id} (${r.tag})</span>
              <span class="txn-sub">Tindakan: ${esc(r.g)}</span>
            </div>
            <div class="txn-end"><span class="status-badge ver">96% Cocok</span></div>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function showPhoto(caseId, idx) {
    const b = CASE_DETAIL[caseId]?.bk[idx];
    if (!b) return;
    $('#modal-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <b style="font-size:16px">${esc(b.title)}</b>
      <button class="back-circle-btn" style="width:34px;height:34px" onclick="$('#modal-overlay').hidden=true">×</button>
    </div>
    <div style="background:#1E293B;padding:24px;border-radius:18px;text-align:center;color:#FFFFFF;margin-bottom:14px">
      <svg style="width:64px;height:64px;color:#304FFE;margin-bottom:8px" viewBox="0 0 24 24">${IC.spending}</svg>
      <div style="font-size:14px;font-weight:700">${esc(b.title)}</div>
      <div style="font-size:12px;opacity:0.8;margin-top:4px">Kategori: ${esc(b.type)} · Mendukung: ${esc(b.sup)}</div>
    </div>
    <button class="btn-main" onclick="$('#modal-overlay').hidden=true">Tutup Bukti</button>
  `;
    $('#modal-overlay').hidden = false;
}

function renderApp() {
    const views = {
        home: renderHome,
        spending: renderSpending,
        profile: renderProfile,
        prelim: renderPrelim,
        triage: renderTriage,
        investigasi: renderInvestigasi,
        repo: renderRepo,
        search: renderSearch
    };
    $('#view').innerHTML = (views[STATE.page] || renderHome)();
    renderBottomNav();
}

$('#modal-overlay').onclick = e => { if (e.target === $('#modal-overlay')) $('#modal-overlay').hidden = true; };
renderApp();
