
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function toast(msg) {
  let old = $('.toast');
  if (old) old.remove();

  let t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

const demoItems = [
  {
    id: 'TP-1042', name: 'Dompet Hitam',
    type: 'Barang hilang',
    place: 'Perpustakaan · Lantai 2',
    date: '13 Okt 2026', status: 'Menunggu',
    emoji: '👛', owner: 'Raka Pratama'
  },
  {
    id: 'TP-1041', name: 'AC Rusak Lab 3',
    type: 'Kerusakan fasilitas',
    place: 'Gedung B · Lab 3',
    date: '13 Okt 2026', status: 'Prioritas',
    emoji: '❄️', owner: 'Dina Putri'
  },
  {
    id: 'TP-1038', name: 'Kunci Motor',
    type: 'Barang temuan',
    place: 'Parkiran Timur',
    date: '12 Okt 2026', status: 'Terverifikasi',
    emoji: '🔑', owner: 'Fajar Ramadhan'
  },
  {
    id: 'TP-1036', name: 'Botol Minum',
    type: 'Barang temuan',
    place: 'Kantin Utama',
    date: '12 Okt 2026', status: 'Selesai',
    emoji: '🧴', owner: 'Nadia Putri'
  },
  {
    id: 'TP-1033', name: 'Laptop Silver',
    type: 'Barang hilang',
    place: 'Ruang Kelas A-203',
    date: '11 Okt 2026', status: 'Menunggu',
    emoji: '💻', owner: 'Rizky Maulana'
  },
  {
    id: 'TP-1029', name: 'Proyektor',
    type: 'Kerusakan fasilitas',
    place: 'Gedung C · Kelas 2',
    date: '10 Okt 2026', status: 'Diproses',
    emoji: '📽️', owner: 'Bagas Saputra'
  }
];

function roleInfo(role) {
  if (role === 'user') {
    return {
      name: 'Nadia Putri',
      title: 'Mahasiswa',
      greet: 'Selamat pagi, Nadia',
      subtitle: 'Pantau laporan dan temukan barang Anda.',
      nav: [
        ['home', '⌂', 'Beranda'],
        ['catalog', '▦', 'Katalog Barang'],
        ['report', '＋', 'Buat Laporan'],
        ['reports', '▤', 'Laporan Saya'],
        ['claims', '◈', 'Tiket Klaim'],
        ['profile', '●', 'Profil']
      ]
    };
  }

  if (role === 'admin') {
    return {
      name: 'Bayu Santoso',
      title: 'Staf IT',
      greet: 'Selamat pagi, Pak Bayu',
      subtitle: 'Ada 6 hal yang perlu perhatian Anda.',
      nav: [
        ['home', '⌂', 'Home'],
        ['reports', '▤', 'Reports'],
        ['verify', '▣', 'Verify'],
        ['analytics', '▥', 'Analytics'],
        ['profile', '●', 'Profile']
      ]
    };
  }

  return {
    name: 'Super Admin',
    title: 'Administrator Sistem',
    greet: 'Selamat pagi, Super Admin',
    subtitle: 'Ringkasan pengelolaan seluruh sistem TITIPIN.',
    nav: [
      ['home', '⌂', 'Dashboard'],
      ['users', '♙', 'Manajemen User'],
      ['reports', '▤', 'Semua Laporan'],
      ['locations', '⌖', 'Lokasi & Unit'],
      ['analytics', '▥', 'Analitik Sistem'],
      ['settings', '⚙', 'Pengaturan']
    ]
  };
}

function navHref(role, key) {
  if (key === 'logout') return 'index.html';
  return '#' + key;
}

function shell(role) {
  const info = roleInfo(role);
  const initials = info.name.split(' ')
    .map(x => x[0]).slice(0, 2).join('');

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" href="index.html">
          <span class="brand-mark">⌕</span>
          <div><b>TITIPIN</b><small>Campus Care</small></div>
        </a>

        <div class="side-label">Menu utama</div>
        <nav class="nav-links">
          ${info.nav.map(([k, ic, l]) => `
            <a class="nav-link" href="#${k}" data-page="${k}">
              <span class="nav-icon">${ic}</span>${l}
            </a>
          `).join('')}
        </nav>

        <div class="side-bottom">
          <div class="profile-mini">
            <div class="avatar">${initials}</div>
            <div>${info.name}<small>${info.title}</small></div>
          </div>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div style="display:flex;align-items:center;gap:10px">
            <button class="icon-btn mobile-menu" id="menuBtn">☰</button>
            <span class="breadcrumb">
              TITIPIN / <b id="crumb">Beranda</b>
            </span>
          </div>

          <div class="top-actions">
            <button class="icon-btn" id="bell" aria-label="Notifikasi">
              ♧<i class="notification-dot"></i>
            </button>
            <a class="top-user" href="#profile">
              <div class="avatar">${initials}</div>
              <div>${info.name}<small>${info.title}</small></div>
            </a>
          </div>
        </header>

        <section class="content" id="pageContent"></section>
      </main>

      <nav class="mobile-nav">
        ${info.nav.slice(0, 5).map(([k, ic, l]) => `
          <a href="#${k}" data-page="${k}">
            <span>${ic}</span>${l}
          </a>
        `).join('')}
      </nav>
    </div>
  `;
}

function stat(icon, label, num, note) {
  return `
    <article class="stat-card">
      <div class="stat-icon">${icon}</div>
      <div class="stat-label">${label}</div>
      <div class="stat-number">${num}</div>
      <div class="stat-note">${note}</div>
    </article>
  `;
}

function actionRow(item, button = 'Cek') {
  return `
    <div class="action-row">
      <div class="mini-icon">${item.emoji}</div>
      <div class="action-copy">
        <b>${item.name}</b>
        <small>${item.type} · ${item.place}</small>
      </div>
      <button class="btn small dark"
        data-action="inspect" data-id="${item.id}">
        ${button}
      </button>
    </div>
  `;
}

function table(items, admin = false) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID LAPORAN</th><th>JUDUL</th>
            <th>KATEGORI</th><th>LOKASI</th>
            <th>STATUS</th><th>TANGGAL</th><th>AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td>${i.id}</td>
              <td><b>${i.name}</b></td>
              <td>${i.type}</td>
              <td>${i.place}</td>
              <td>
                <span class="status ${
                  i.status === 'Selesai' ||
                  i.status === 'Terverifikasi' ? 'green' :
                  i.status === 'Prioritas' ? 'red' :
                  i.status === 'Diproses' ? 'blue' : ''
                }">${i.status}</span>
              </td>
              <td>${i.date}</td>
              <td>
                <button class="btn small outline"
                  data-action="inspect" data-id="${i.id}">
                  Detail
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function heading(title, sub, actions = '') {
  return `
    <div class="welcome">
      <div>
        <div class="greeting">${sub}</div>
        <h1>${title}</h1>
      </div>
      <div class="welcome-actions">${actions}</div>
    </div>
  `;
}

/* DASHBOARD USER */

function homeUser() {
  return `
    ${heading(
      'Beranda',
      'Halo, Nadia! Senang melihat Anda kembali.',
      '<button class="btn primary" data-page="report">＋ Buat Laporan</button>'
    )}

    <div class="stats">
      ${stat('▤', 'Laporan Saya', '4', '2 masih diproses')}
      ${stat('⌕', 'Barang Ditemukan', '12', 'Di sekitar kampus')}
      ${stat('◈', 'Tiket Klaim', '1', 'Menunggu verifikasi')}
      ${stat('✓', 'Laporan Selesai', '3',
        '<span class="positive">Terima kasih sudah peduli!</span>')}
    </div>

    <div class="dashboard-grid">
      <section>
        <div class="section-head">
          <h2>Barang terbaru</h2>
          <a href="#catalog">Lihat semua →</a>
        </div>
        <div class="item-grid">
          ${demoItems.slice(0, 3).map(itemCard).join('')}
        </div>
      </section>

      <section class="panel">
        <div class="section-head">
          <h2>Aktivitas laporan</h2>
          <a href="#reports">Detail</a>
        </div>
        ${actionRow(demoItems[0], 'Lihat')}
        ${actionRow(demoItems[2], 'Klaim')}
        <div style="margin-top:16px;padding:14px;background:#f3f8e9;border-radius:8px">
          <b style="font-size:12px">💡 Tips TITIPIN</b>
          <p class="muted" style="font-size:11px;margin-bottom:0">
            Tambahkan lokasi dan foto yang jelas agar barang lebih mudah ditemukan.
          </p>
        </div>
      </section>
    </div>
  `;
}

function itemCard(i) {
  return `
    <article class="item-card">
      <div class="item-photo">
        ${i.emoji}
        <span class="status ${
          i.status === 'Selesai' ? 'green' :
          i.status === 'Prioritas' ? 'red' : 'blue'
        }">${i.type}</span>
      </div>
      <div class="item-body">
        <h3>${i.name}</h3>
        <p>⌖ ${i.place}<br>◷ ${i.date}</p>
        <div class="item-foot">
          <small>${i.id}</small>
          <button class="btn small outline"
            data-action="inspect" data-id="${i.id}">
            Lihat detail
          </button>
        </div>
      </div>
    </article>
  `;
}

/* DASHBOARD ADMIN */

function homeAdmin() {
  return `
    ${heading(
      'Ringkasan hari ini',
      'Selamat pagi, Pak Bayu',
      '<button class="btn outline" data-page="reports">Lihat laporan</button>'
    )}

    <div class="stats">
      ${stat('▤', 'Total Laporan', '128', '+12% bulan ini')}
      ${stat('▣', 'Klaim Pending', '14', 'Perlu diverifikasi')}
      ${stat('⬡', 'Kerusakan Aktif', '9', '3 prioritas tinggi')}
      ${stat('◷', 'Selesai Hari Ini', '42', 'Sesuai target')}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-head">
          <h2>Perlu Tindakan</h2>
          <a href="#reports">Lihat semua</a>
        </div>
        ${demoItems.slice(0, 3).map(i => actionRow(i)).join('')}
      </section>

      <section class="panel">
        <div class="section-head"><h2>Target layanan bulanan</h2></div>
        <div class="target-number">86%</div>
        <p class="muted" style="font-size:11px">
          108 dari 125 laporan terselesaikan
        </p>
        <div class="progress"><span style="width:86%"></span></div>
        <p class="muted" style="font-size:10px">
          14% lagi untuk mencapai target bulanan.
        </p>
        <button class="btn outline full" data-page="analytics">
          Lihat analitik
        </button>
      </section>
    </div>
  `;
}

/* DASHBOARD SUPER ADMIN */

function homeSuper() {
  return `
    ${heading(
      'Dashboard sistem',
      'Ikhtisar aktivitas seluruh kampus',
      '<button class="btn primary" data-action="add-user">＋ Tambah pengguna</button>'
    )}

    <div class="stats">
      ${stat('♙', 'Total Pengguna', '2.486', '+8,4% bulan ini')}
      ${stat('▤', 'Total Laporan', '1.284', 'Seluruh unit kampus')}
      ${stat('✓', 'Tingkat Selesai', '92,4%',
        '<span class="positive">+3,2% dari bulan lalu</span>')}
      ${stat('⌁', 'Unit Aktif', '18', 'Semua unit terhubung')}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-head">
          <h2>Aktivitas terbaru</h2>
          <a href="#reports">Semua laporan →</a>
        </div>
        ${demoItems.slice(0, 3).map(i => actionRow(i, 'Detail')).join('')}
      </section>

      <section class="panel">
        <div class="section-head">
          <h2>Kesehatan sistem</h2>
          <span class="status green">Normal</span>
        </div>
        <div class="target-number">99,8%</div>
        <p class="muted" style="font-size:11px">
          Uptime dalam 30 hari terakhir
        </p>
        <div class="progress"><span style="width:99.8%"></span></div>

        <div class="action-row">
          <div class="mini-icon">✓</div>
          <div class="action-copy">
            <b>Database</b><small>Beroperasi normal</small>
          </div>
          <span class="status green">Aktif</span>
        </div>

        <div class="action-row">
          <div class="mini-icon">✓</div>
          <div class="action-copy">
            <b>Layanan notifikasi</b>
            <small>Sinkron terakhir 2 menit lalu</small>
          </div>
          <span class="status green">Aktif</span>
        </div>
      </section>
    </div>
  `;
}

/* HALAMAN LAPORAN */

function reportsPage(role) {
  return `
    ${heading(
      role === 'user' ? 'Laporan Saya' : 'Manajemen Laporan',
      role === 'user'
        ? 'Pantau status laporan yang Anda buat.'
        : 'Cari, tinjau, dan kelola laporan kampus.',
      '<button class="btn primary" data-page="report">＋ Buat laporan</button>'
    )}

    <div class="toolbar">
      <div class="searchbox">
        ⌕ <input id="tableSearch" placeholder="Cari nama atau ID laporan...">
      </div>
      <select class="select" id="statusFilter">
        <option value="">Semua status</option>
        <option>Menunggu</option>
        <option>Diproses</option>
        <option>Terverifikasi</option>
        <option>Selesai</option>
        <option>Prioritas</option>
      </select>
      <button class="btn outline" data-action="export">↓ Ekspor</button>
    </div>

    <section class="panel" id="tablePanel">
      ${table(
        role === 'user'
          ? demoItems.filter(i =>
              ['TP-1042', 'TP-1038', 'TP-1036'].includes(i.id))
          : demoItems
      )}
    </section>
  `;
}

/* FORM LAPORAN */

function reportForm() {
  return `
    ${heading(
      'Buat laporan baru',
      'Ceritakan detail barang hilang, barang temuan, atau kerusakan fasilitas.'
    )}

    <section class="form-panel" style="padding:22px">
      <div class="section-head">
        <h2>Informasi laporan</h2>
        <span class="status blue">Langkah 1 dari 1</span>
      </div>

      <form id="reportForm" class="form-grid">
        <div class="field">
          <label>Jenis laporan *</label>
          <select required id="reportType">
            <option>Barang hilang</option>
            <option>Barang temuan</option>
            <option>Kerusakan fasilitas</option>
          </select>
        </div>

        <div class="field">
          <label>Nama barang / fasilitas *</label>
          <input required placeholder="Contoh: Dompet hitam">
        </div>

        <div class="field">
          <label>Lokasi kejadian *</label>
          <select required>
            <option value="">Pilih lokasi</option>
            <option>Perpustakaan</option>
            <option>Gedung A</option>
            <option>Gedung B</option>
            <option>Kantin</option>
            <option>Parkiran Timur</option>
            <option>Laboratorium</option>
          </select>
        </div>

        <div class="field">
          <label>Tanggal kejadian *</label>
          <input type="date" required value="2026-10-13">
        </div>

        <div class="field full-width">
          <label>Deskripsi detail *</label>
          <textarea required placeholder="Jelaskan ciri-ciri barang, warna, lokasi detail, atau kerusakan..."></textarea>
        </div>

        <div class="field full-width">
          <label>Foto pendukung (opsional)</label>
          <div class="upload">
            ＋<br><b>Unggah foto</b><br>
            <small>PNG, JPG atau JPEG</small><br>
            <input type="file" accept="image/*" id="photoUpload">
          </div>
        </div>

        <div class="field full-width">
          <label class="check">
            <input type="checkbox" required>
            Saya memastikan informasi yang diberikan benar.
          </label>
        </div>

        <div class="field full-width"
             style="display:flex;justify-content:flex-end;gap:10px">
          <button type="button" class="btn outline" data-page="home">
            Batal
          </button>
          <button class="btn primary" type="submit">
            Kirim laporan →
          </button>
        </div>
      </form>
    </section>
  `;
}

/* KATALOG BARANG */

function catalogPage() {
  return `
    ${heading(
      'Katalog barang',
      'Jelajahi barang temuan yang dilaporkan di lingkungan kampus.'
    )}

    <div class="toolbar">
      <div class="searchbox">
        ⌕ <input id="catalogSearch" placeholder="Cari barang atau lokasi...">
      </div>

      <select class="select" id="categoryFilter">
        <option value="">Semua kategori</option>
        <option>Barang temuan</option>
        <option>Barang hilang</option>
        <option>Kerusakan fasilitas</option>
      </select>

      <select class="select" id="locationFilter">
        <option value="">Semua lokasi</option>
        <option>Perpustakaan</option>
        <option>Gedung</option>
        <option>Kantin</option>
        <option>Parkiran</option>
      </select>
    </div>

    <div class="item-grid" id="catalogGrid">
      ${demoItems.map(itemCard).join('')}
    </div>
  `;
}

/* VERIFIKASI KLAIM */

function verifyPage() {
  return `
    ${heading(
      'Verifikasi klaim',
      'Periksa kode tiket sebelum penyerahan barang.'
    )}

    <div class="dashboard-grid">
      <section class="panel">
        <div class="section-head">
          <h2>Masukkan kode klaim</h2>
        </div>

        <form id="verifyForm">
          <div class="field">
            <label>Kode klaim 6 karakter</label>
            <input id="claimCode" required minlength="6" maxlength="6"
              placeholder="Contoh: A7K3FP"
              style="width:100%;padding:14px;border:1px solid var(--line);border-radius:8px;text-transform:uppercase;letter-spacing:3px">
          </div>

          <button class="btn primary" style="margin-top:14px">
            Verifikasi kode →
          </button>
        </form>

        <div id="verifyResult"></div>
      </section>

      <section class="panel">
        <h2 style="font-size:15px;margin-top:0">Panduan verifikasi</h2>

        ${[
          ['1', 'Cocokkan kode', 'Pastikan kode sesuai tiket klaim pengguna.'],
          ['2', 'Periksa identitas', 'Cocokkan identitas dan detail barang.'],
          ['3', 'Konfirmasi serah terima', 'Simpan bukti penyerahan barang.']
        ].map(x => `
          <div class="action-row">
            <div class="mini-icon">${x[0]}</div>
            <div class="action-copy">
              <b>${x[1]}</b><small>${x[2]}</small>
            </div>
          </div>
        `).join('')}
      </section>
    </div>
  `;
}

/* ANALITIK */

function analyticsPage(role) {
  return `
    ${heading(
      role === 'super' ? 'Analitik sistem' : 'Analitik laporan',
      'Pantau tren dan kinerja layanan TITIPIN.',
      `<select class="select" id="periodSelect">
        <option>7 hari terakhir</option>
        <option>30 hari terakhir</option>
        <option>Tahun ini</option>
      </select>`
    )}

    <div class="stats">
      ${stat('▤', 'Total laporan', '1.284', 'Periode terpilih')}
      ${stat('✓', 'Terselesaikan', '92,4%', 'Di atas target 85%')}
      ${stat('◷', 'Rata-rata waktu', '1,8 hari', '-0,4 hari dari periode lalu')}
      ${stat('♙', 'Pengguna aktif', '846', '+14% periode lalu')}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <h2 style="font-size:15px">Laporan berdasarkan kategori</h2>

        <div class="chart-bars">
          ${[
            ['Barang hilang', 72, 72],
            ['Barang temuan', 88, 88],
            ['Kerusakan fasilitas', 46, 46],
            ['Lainnya', 24, 24]
          ].map(x => `
            <div class="bar-row">
              <span>${x[0]}</span>
              <div class="bar-track">
                <span style="width:${x[1]}%"></span>
              </div>
              <b>${x[2]}%</b>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="panel">
        <h2 style="font-size:15px">Status penyelesaian</h2>
        <div class="target-number">92,4%</div>
        <p class="muted" style="font-size:11px">
          Laporan selesai sesuai standar layanan
        </p>
        <div class="progress"><span style="width:92.4%"></span></div>

        <div class="action-row">
          <div class="mini-icon">✓</div>
          <div class="action-copy">
            <b>Selesai</b><small>1.186 laporan</small>
          </div>
          <span class="status green">92,4%</span>
        </div>

        <div class="action-row">
          <div class="mini-icon">◷</div>
          <div class="action-copy">
            <b>Dalam proses</b><small>98 laporan</small>
          </div>
          <span class="status">7,6%</span>
        </div>
      </section>
    </div>
  `;
}

/* PROFIL */

function profilePage(role) {
  const info = roleInfo(role);
  const email = role === 'user'
    ? 'nadia@kampus.ac.id'
    : role === 'admin'
      ? 'bayu@kampus.ac.id'
      : 'superadmin@kampus.ac.id';

  return `
    ${heading(
      'Profil saya',
      'Kelola informasi akun dan preferensi Anda.'
    )}

    <section class="panel" style="max-width:720px">
      <div style="display:flex;align-items:center;gap:16px;padding-bottom:20px;border-bottom:1px solid var(--line)">
        <div class="avatar" style="width:64px;height:64px;font-size:20px">
          ${info.name.split(' ').map(x => x[0]).slice(0, 2).join('')}
        </div>
        <div>
          <h2 style="margin:0 0 6px">${info.name}</h2>
          <p class="muted" style="margin:0">${info.title} · Kampus</p>
        </div>
        <span class="status green" style="margin-left:auto">Aktif</span>
      </div>

      <form id="profileForm" class="form-grid" style="padding-top:20px">
        <div class="field">
          <label>Nama lengkap</label>
          <input value="${info.name}" required>
        </div>

        <div class="field">
          <label>Email kampus</label>
          <input type="email" value="${email}" required>
        </div>

        <div class="field">
          <label>Peran</label>
          <input value="${info.title}" disabled>
        </div>

        <div class="field">
          <label>Nomor telepon</label>
          <input placeholder="08xxxxxxxxxx">
        </div>

        <div class="field full-width">
          <button class="btn primary">Simpan perubahan</button>
          <a class="btn outline" href="index.html">Keluar</a>
        </div>
      </form>
    </section>
  `;
}

/* MANAJEMEN USER */

function usersPage() {
  return `
    ${heading(
      'Manajemen pengguna',
      'Kelola akses, peran, dan status akun kampus.',
      '<button class="btn primary" data-action="add-user">＋ Tambah pengguna</button>'
    )}

    <div class="toolbar">
      <div class="searchbox">
        ⌕ <input id="tableSearch" placeholder="Cari nama atau email...">
      </div>
      <select class="select">
        <option>Semua peran</option>
        <option>Mahasiswa</option>
        <option>Staf</option>
        <option>Admin</option>
      </select>
    </div>

    <section class="panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>NAMA</th><th>EMAIL</th><th>PERAN</th>
              <th>STATUS</th><th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nadia Putri</td>
              <td>nadia@kampus.ac.id</td>
              <td>Mahasiswa</td>
              <td><span class="status green">Aktif</span></td>
              <td><button class="btn small outline" data-action="edit-user">Kelola</button></td>
            </tr>
            <tr>
              <td>Bayu Santoso</td>
              <td>bayu@kampus.ac.id</td>
              <td>Staf IT</td>
              <td><span class="status green">Aktif</span></td>
              <td><button class="btn small outline" data-action="edit-user">Kelola</button></td>
            </tr>
            <tr>
              <td>Dina Putri</td>
              <td>dina@kampus.ac.id</td>
              <td>Admin Unit</td>
              <td><span class="status">Menunggu</span></td>
              <td><button class="btn small outline" data-action="edit-user">Kelola</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

/* PENGATURAN */

function settingsPage() {
  return `
    ${heading(
      'Pengaturan sistem',
      'Konfigurasi aturan dan layanan TITIPIN.'
    )}

    <section class="panel" style="max-width:800px">
      <form id="settingsForm" class="form-grid">
        <div class="field">
          <label>Nama aplikasi</label>
          <input value="TITIPIN Campus Care">
        </div>

        <div class="field">
          <label>Durasi penyimpanan laporan (hari)</label>
          <input type="number" value="90" min="1">
        </div>

        <div class="field">
          <label>Target penyelesaian (%)</label>
          <input type="number" value="85" min="1" max="100">
        </div>

        <div class="field">
          <label>Notifikasi email</label>
          <select><option>Aktif</option><option>Nonaktif</option></select>
        </div>

        <div class="field full-width">
          <button class="btn primary">Simpan pengaturan</button>
        </div>
      </form>
    </section>
  `;
}

/* ROUTING HALAMAN */

function contentFor(role, page) {
  if (page === 'home') {
    return role === 'user' ? homeUser()
      : role === 'admin' ? homeAdmin()
      : homeSuper();
  }

  if (page === 'catalog') return catalogPage();
  if (page === 'report') return reportForm();
  if (page === 'reports') return reportsPage(role);
  if (page === 'verify') return verifyPage();
  if (page === 'analytics') return analyticsPage(role);
  if (page === 'profile') return profilePage(role);
  if (page === 'users') return usersPage();
  if (page === 'settings') return settingsPage();

  if (page === 'claims') {
    return `
      ${heading('Tiket klaim', 'Lihat tiket dan kode klaim barang Anda.')}

      <section class="panel" style="max-width:650px;text-align:center;padding:28px">
        <div style="font-size:42px">◈</div>
        <h2>Dompet Hitam</h2>
        <p class="muted">Perpustakaan · Lantai 2</p>

        <div class="timeline">
          <div class="timeline-step active">✓<br>Laporan dibuat</div>
          <div class="timeline-step active">✓<br>Klaim diajukan</div>
          <div class="timeline-step">3<br>Serah terima</div>
        </div>

        <p class="muted">Kode klaim Anda</p>
        <h1 style="letter-spacing:7px;color:var(--navy)">A7K3FP</h1>
        <button class="btn primary" data-action="copy-code">Salin kode</button>
      </section>
    `;
  }

  if (page === 'locations') {
    return `
      ${heading(
        'Lokasi & unit',
        'Kelola gedung, fasilitas, dan unit layanan.',
        '<button class="btn primary" data-action="add-location">＋ Tambah lokasi</button>'
      )}
      <section class="panel">${table(demoItems)}</section>
    `;
  }

  return homeAdmin();
}

function renderPage(role, page) {
  const info = roleInfo(role);
  $('#pageContent').innerHTML = contentFor(role, page);

  $('#crumb').textContent =
    (info.nav.find(x => x[0] === page) || [])[2] || 'Beranda';

  $$('[data-page]').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page)
  );

  $$('.mobile-nav a').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page)
  );

  bindPage(role, page);
}

/* EVENT DAN INTERAKSI HALAMAN */

function bindPage(role, page) {
  const search = $('#tableSearch');
  const filter = $('#statusFilter');

  if (search) {
    const update = () => {
      const q = search.value.toLowerCase();
      const st = filter?.value || '';

      const list = demoItems.filter(i =>
        `${i.id} ${i.name} ${i.type} ${i.place}`
          .toLowerCase().includes(q) &&
        (!st || i.status === st)
      );

      const visible = role === 'user'
        ? list.filter(i =>
            ['TP-1042', 'TP-1038', 'TP-1036'].includes(i.id))
        : list;

      const panel = $('#tablePanel');
      if (panel) panel.innerHTML = table(visible);
    };

    search.addEventListener('input', update);
    filter?.addEventListener('change', update);
  }

  const cs = $('#catalogSearch');

  if (cs) {
    const update = () => {
      const q = cs.value.toLowerCase();
      const cat = $('#categoryFilter').value;
      const loc = $('#locationFilter').value;

      const list = demoItems.filter(i =>
        `${i.name} ${i.place}`.toLowerCase().includes(q) &&
        (!cat || i.type === cat) &&
        (!loc || i.place.toLowerCase().includes(loc.toLowerCase()))
      );

      $('#catalogGrid').innerHTML = list.length
        ? list.map(itemCard).join('')
        : '<div class="empty">Tidak ada barang yang cocok.</div>';
    };

    cs.addEventListener('input', update);
    $('#categoryFilter').addEventListener('change', update);
    $('#locationFilter').addEventListener('change', update);
  }

  $('#reportForm')?.addEventListener('submit', e => {
    e.preventDefault();
    toast('Laporan berhasil dikirim (mode demo).');
    setTimeout(() => location.hash = 'reports', 800);
  });

  $('#verifyForm')?.addEventListener('submit', e => {
    e.preventDefault();

    const code = $('#claimCode').value.toUpperCase();
    const res = $('#verifyResult');

    res.innerHTML = code === 'A7K3FP'
      ? `<div style="margin-top:18px;padding:14px;background:#edf8e8;border-radius:8px">
          <b>✓ Kode valid</b>
          <p class="muted">Dompet Hitam · Nadia Putri</p>
          <button class="btn primary" id="confirmHand">
            Konfirmasi serah terima
          </button>
        </div>`
      : '<p style="color:#c55b54;font-size:12px;margin-top:15px">Kode tidak ditemukan. Periksa kembali tiket klaim.</p>';

    $('#confirmHand')?.addEventListener('click', () => {
      toast('Serah terima berhasil dikonfirmasi.');
      res.innerHTML = '<span class="status green">Klaim selesai</span>';
    });
  });

  $('#profileForm')?.addEventListener('submit', e => {
    e.preventDefault();
    toast('Profil berhasil disimpan (mode demo).');
  });

  $('#settingsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    toast('Pengaturan tersimpan (mode demo).');
  });

  $('#periodSelect')?.addEventListener('change', () => {
    toast('Periode analitik diubah: ' + $('#periodSelect').value);
  });
}

/* MODAL */

function showModal(title, body, submitText = 'Simpan') {
  const back = document.createElement('div');
  back.className = 'modal-backdrop';

  back.innerHTML = `
    <div class="modal">
      <h2>${title}</h2>
      ${body}
      <div class="modal-actions">
        <button class="btn outline" data-close>Batal</button>
        <button class="btn primary" data-submit>${submitText}</button>
      </div>
    </div>
  `;

  document.body.append(back);

  back.querySelector('[data-close]').onclick = () => back.remove();

  back.querySelector('[data-submit]').onclick = () => {
    back.remove();
    toast('Aksi berhasil (mode demo).');
  };
}

/* EVENT GLOBAL */

document.addEventListener('click', e => {
  const p = e.target.closest('[data-page]');

  if (p) {
    const page = p.dataset.page;

    if (page) {
      e.preventDefault();
      location.hash = page;
      renderPage(document.body.dataset.role || 'user', page);
      return;
    }
  }

  const b = e.target.closest('[data-action]');
  if (!b) return;

  const act = b.dataset.action;

  if (act === 'inspect') {
    const item = demoItems.find(i => i.id === b.dataset.id);

    if (item) {
      showModal(
        item.name,
        `<p class="muted">${item.id} · ${item.date}</p>
         <p><b>Kategori:</b> ${item.type}</p>
         <p><b>Lokasi:</b> ${item.place}</p>
         <p><b>Pelapor:</b> ${item.owner}</p>
         <p><b>Status:</b> ${item.status}</p>`,
        'Tutup'
      );
    }
  }

  if (act === 'export') {
    const csv = 'ID,Nama,Kategori,Lokasi,Status,Tanggal\n' +
      demoItems.map(i =>
        [i.id, i.name, i.type, i.place, i.status, i.date].join(',')
      ).join('\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv' })
    );
    a.download = 'laporan-titipin.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Data laporan diekspor.');
  }

  if (act === 'add-user') {
    showModal('Tambah pengguna', `
      <div class="field">
        <label>Nama lengkap</label>
        <input placeholder="Nama pengguna">
      </div>
      <div class="field" style="margin-top:12px">
        <label>Email kampus</label>
        <input type="email" placeholder="nama@kampus.ac.id">
      </div>
      <div class="field" style="margin-top:12px">
        <label>Peran</label>
        <select>
          <option>Mahasiswa</option>
          <option>Staf</option>
          <option>Admin Unit</option>
          <option>Super Admin</option>
        </select>
      </div>
    `);
  }

  if (act === 'edit-user') {
    showModal('Kelola pengguna', `
      <div class="field">
        <label>Status akun</label>
        <select><option>Aktif</option><option>Ditangguhkan</option></select>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Peran</label>
        <select>
          <option>Mahasiswa</option>
          <option>Staf</option>
          <option>Admin Unit</option>
          <option>Super Admin</option>
        </select>
      </div>
    `);
  }

  if (act === 'add-location') {
    showModal('Tambah lokasi', `
      <div class="field">
        <label>Nama lokasi / unit</label>
        <input placeholder="Contoh: Gedung D">
      </div>
      <div class="field" style="margin-top:12px">
        <label>Jenis</label>
        <select>
          <option>Gedung</option>
          <option>Fasilitas</option>
          <option>Unit layanan</option>
        </select>
      </div>
    `);
  }

  if (act === 'copy-code') {
    navigator.clipboard?.writeText('A7K3FP');
    toast('Kode klaim: A7K3FP');
  }
});

/* LOGIN */

if ($('#loginForm')) {
  $('#togglePass').onclick = () => {
    const i = $('#password');
    i.type = i.type === 'password' ? 'text' : 'password';

    $('#togglePass').textContent =
      i.type === 'password' ? 'Lihat' : 'Sembunyikan';
  };

  $('#loginForm').onsubmit = e => {
    e.preventDefault();
    toast('Login demo berhasil. Pilih peran di bagian bawah.');
  };
}

$('#sso')?.addEventListener('click', () => {
  toast('SSO kampus tersedia setelah backend dihubungkan.');
});

$('#bell')?.addEventListener('click', () => {
  showModal(
    'Notifikasi',
    '<p>• 2 laporan baru menunggu pemeriksaan.</p><p>• Tiket klaim A7K3FP menunggu verifikasi.</p>',
    'Tandai dibaca'
  );
});

$('#menuBtn')?.addEventListener('click', () => {
  toast('Gunakan menu navigasi di bagian bawah layar.');
});

/* INISIALISASI DASHBOARD */

if (document.body.dataset.role) {
  const role = document.body.dataset.role;

  document.querySelector('#app').innerHTML = shell(role);

  const pg = location.hash.slice(1) || 'home';
  renderPage(role, pg);

  window.addEventListener('hashchange', () => {
    renderPage(role, location.hash.slice(1) || 'home');
  });
}
