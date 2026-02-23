// ================================================
// InvenAI — Smart Inventory Management System
// AI-powered with Anthropic Claude API
// ================================================

// ===== STATE =====
const STATE = {
  products: [],
  transactions: [],
  categories: ['Elektronik', 'Makanan & Minuman', 'Pakaian', 'Kesehatan', 'Alat Tulis', 'Furnitur', 'Otomotif', 'Lainnya'],
  currentPeriod: 'monthly',
  apiKey: localStorage.getItem('invenai_api_key') || '',
  charts: {}
};

// ===== SAMPLE DATA =====
function initSampleData() {
  if (STATE.products.length > 0) return;

  const samples = [
    { id: 'P001', name: 'Laptop ASUS Vivobook', sku: 'ELK-001', category: 'Elektronik', stock: 15, minStock: 5, price: 7500000, unit: 'unit' },
    { id: 'P002', name: 'Mouse Wireless Logitech', sku: 'ELK-002', category: 'Elektronik', stock: 3, minStock: 10, price: 250000, unit: 'unit' },
    { id: 'P003', name: 'Headphone Sony WH-1000', sku: 'ELK-003', category: 'Elektronik', stock: 8, minStock: 5, price: 3200000, unit: 'unit' },
    { id: 'P004', name: 'Indomie Goreng Box', sku: 'FNB-001', category: 'Makanan & Minuman', stock: 200, minStock: 50, price: 85000, unit: 'box' },
    { id: 'P005', name: 'Air Mineral Aqua 600ml', sku: 'FNB-002', category: 'Makanan & Minuman', stock: 0, minStock: 30, price: 4000, unit: 'botol' },
    { id: 'P006', name: 'Kemeja Oxford Putih', sku: 'PKN-001', category: 'Pakaian', stock: 45, minStock: 10, price: 180000, unit: 'pcs' },
    { id: 'P007', name: 'Masker KF94 Box 20pcs', sku: 'KSH-001', category: 'Kesehatan', stock: 4, minStock: 15, price: 35000, unit: 'box' },
    { id: 'P008', name: 'Buku Tulis A5 Sidu', sku: 'ATS-001', category: 'Alat Tulis', stock: 120, minStock: 30, price: 12000, unit: 'buku' },
    { id: 'P009', name: 'Pulpen Pilot G2', sku: 'ATS-002', category: 'Alat Tulis', stock: 80, minStock: 20, price: 8500, unit: 'pcs' },
    { id: 'P010', name: 'Kursi Ergonomis', sku: 'FRN-001', category: 'Furnitur', stock: 6, minStock: 3, price: 2500000, unit: 'unit' },
    { id: 'P011', name: 'Oli Mesin Pertamina', sku: 'OTM-001', category: 'Otomotif', stock: 50, minStock: 20, price: 75000, unit: 'liter' },
    { id: 'P012', name: 'Keyboard Mechanical', sku: 'ELK-004', category: 'Elektronik', stock: 12, minStock: 5, price: 850000, unit: 'unit' },
  ];

  STATE.products = samples.map(p => ({ ...p, createdAt: randomPastDate(180) }));

  // Generate transactions
  const types = ['masuk', 'masuk', 'keluar', 'keluar', 'keluar', 'penyesuaian'];
  let transId = 1;
  for (let i = 0; i < 60; i++) {
    const product = STATE.products[Math.floor(Math.random() * STATE.products.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const qty = Math.floor(Math.random() * 20) + 1;
    STATE.transactions.push({
      id: `T${String(transId++).padStart(4, '0')}`,
      date: randomPastDate(180),
      productId: product.id,
      productName: product.name,
      type,
      qty,
      price: product.price,
      total: qty * product.price,
      note: type === 'masuk' ? 'Pembelian dari supplier' : type === 'keluar' ? 'Penjualan' : 'Penyesuaian stok'
    });
  }

  STATE.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  saveData();
}

function randomPastDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days));
  return d.toISOString().split('T')[0];
}

// ===== STORAGE =====
function saveData() {
  localStorage.setItem('invenai_products', JSON.stringify(STATE.products));
  localStorage.setItem('invenai_transactions', JSON.stringify(STATE.transactions));
}

function loadData() {
  const p = localStorage.getItem('invenai_products');
  const t = localStorage.getItem('invenai_transactions');
  if (p) STATE.products = JSON.parse(p);
  if (t) STATE.transactions = JSON.parse(t);
  if (STATE.products.length === 0) initSampleData();
}

// ===== NAVIGATION =====
function navigate(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const pageEl = document.getElementById(page);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    inventory: 'Manajemen Inventori',
    transactions: 'Transaksi',
    reports: 'Laporan & Rekap',
    'ai-chat': 'AI Asisten'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;

  if (page === 'dashboard') renderDashboard();
  else if (page === 'inventory') renderInventoryTable();
  else if (page === 'transactions') renderTransactions();
  else if (page === 'reports') generateReport();
}

document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    navigate(el.dataset.page);
  });
});

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===== DASHBOARD =====
function renderDashboard() {
  const totalProducts = STATE.products.length;
  const totalValue = STATE.products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = STATE.products.filter(p => p.stock > 0 && p.stock <= p.minStock);
  const outOfStock = STATE.products.filter(p => p.stock === 0);

  document.getElementById('totalProducts').textContent = totalProducts;
  document.getElementById('totalValue').textContent = formatRp(totalValue);
  document.getElementById('lowStockCount').textContent = lowStock.length + outOfStock.length;
  document.getElementById('totalCategories').textContent = [...new Set(STATE.products.map(p => p.category))].length;

  renderLowStockList(lowStock.concat(outOfStock));
  renderActivityList();
  renderStockChart();
  renderCategoryChart();
}

function renderLowStockList(items) {
  const el = document.getElementById('lowStockList');
  if (!items.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><p>Semua stok aman</p></div>';
    return;
  }
  el.innerHTML = items.slice(0, 5).map(p => {
    const pct = p.stock === 0 ? 0 : Math.round((p.stock / p.minStock) * 100);
    return `
      <div class="low-stock-item">
        <div style="flex:1">
          <div style="font-size:13px;font-weight:500">${p.name}</div>
          <div style="font-size:11px;color:var(--text2)">${p.category}</div>
        </div>
        <div style="text-align:right;min-width:60px">
          <div style="font-size:13px;font-weight:700;color:${p.stock===0?'var(--accent3)':'var(--accent4)'}">${p.stock} ${p.unit}</div>
          <div style="font-size:11px;color:var(--text2)">Min: ${p.minStock}</div>
        </div>
        <div class="low-stock-bar" style="width:80px">
          <div class="low-stock-bar-fill" style="width:${Math.min(pct,100)}%;background:${p.stock===0?'var(--accent3)':'var(--accent4)'}"></div>
        </div>
      </div>`;
  }).join('');
}

function renderActivityList() {
  const el = document.getElementById('recentActivity');
  const recent = STATE.transactions.slice(0, 8);
  el.innerHTML = recent.map(t => {
    const colors = { masuk: 'var(--accent)', keluar: 'var(--accent3)', penyesuaian: 'var(--accent2)' };
    return `
      <div class="activity-item">
        <div class="activity-dot" style="background:${colors[t.type]}"></div>
        <div class="activity-text">
          <strong>${t.productName}</strong> — ${t.type} ${t.qty} unit<br>
          <span class="activity-time">${t.date}</span>
        </div>
        <div style="font-size:12px;color:${colors[t.type]}">${t.type.toUpperCase()}</div>
      </div>`;
  }).join('');
}

// ===== CHARTS =====
function renderStockChart() {
  const year = document.getElementById('chartYear').value;
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  const masukData = Array(12).fill(0);
  const keluarData = Array(12).fill(0);

  STATE.transactions.forEach(t => {
    if (t.date.startsWith(year)) {
      const m = parseInt(t.date.split('-')[1]) - 1;
      if (t.type === 'masuk') masukData[m] += t.qty;
      else if (t.type === 'keluar') keluarData[m] += t.qty;
    }
  });

  const ctx = document.getElementById('stockChart').getContext('2d');
  if (STATE.charts.stock) STATE.charts.stock.destroy();

  STATE.charts.stock = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Masuk',
          data: masukData,
          backgroundColor: 'rgba(79,255,176,0.3)',
          borderColor: 'rgba(79,255,176,0.8)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Keluar',
          data: keluarData,
          backgroundColor: 'rgba(255,107,107,0.3)',
          borderColor: 'rgba(255,107,107,0.8)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#8b8fa8', font: { family: 'DM Sans' } } }
      },
      scales: {
        x: { ticks: { color: '#8b8fa8' }, grid: { color: 'rgba(37,40,48,0.8)' } },
        y: { ticks: { color: '#8b8fa8' }, grid: { color: 'rgba(37,40,48,0.8)' } }
      }
    }
  });
}

function renderCategoryChart() {
  const catMap = {};
  STATE.products.forEach(p => {
    catMap[p.category] = (catMap[p.category] || 0) + p.stock * p.price;
  });

  const labels = Object.keys(catMap);
  const data = Object.values(catMap);
  const colors = ['#4fffb0','#00d4ff','#ffd166','#c77dff','#ff6b6b','#ff9f43','#54a0ff','#5f27cd'];

  const ctx = document.getElementById('categoryChart').getContext('2d');
  if (STATE.charts.category) STATE.charts.category.destroy();

  STATE.charts.category = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors.slice(0, labels.length), borderWidth: 0 }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#8b8fa8', font: { family: 'DM Sans', size: 11 }, padding: 12 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${formatRp(ctx.raw)}`
          }
        }
      }
    }
  });
}

function renderChart() { renderStockChart(); }

// ===== INVENTORY TABLE =====
function renderInventoryTable() {
  updateCategoryFilter();
  let products = [...STATE.products];

  const cat = document.getElementById('filterCategory').value;
  const status = document.getElementById('filterStatus').value;
  const sort = document.getElementById('sortBy').value;
  const search = document.getElementById('globalSearch').value.toLowerCase();

  if (cat) products = products.filter(p => p.category === cat);
  if (status === 'low') products = products.filter(p => p.stock > 0 && p.stock <= p.minStock);
  else if (status === 'out') products = products.filter(p => p.stock === 0);
  else if (status === 'normal') products = products.filter(p => p.stock > p.minStock);
  if (search) products = products.filter(p =>
    p.name.toLowerCase().includes(search) ||
    p.sku.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search)
  );

  if (sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'stock') products.sort((a, b) => a.stock - b.stock);
  else if (sort === 'value') products.sort((a, b) => (b.stock * b.price) - (a.stock * a.price));
  else if (sort === 'date') products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const tbody = document.getElementById('inventoryTableBody');
  if (!products.length) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><div class="empty-icon">📦</div><p>Tidak ada produk ditemukan</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    let status, badgeClass;
    if (p.stock === 0) { status = 'Habis'; badgeClass = 'badge-red'; }
    else if (p.stock <= p.minStock) { status = 'Menipis'; badgeClass = 'badge-yellow'; }
    else { status = 'Normal'; badgeClass = 'badge-green'; }

    return `
      <tr>
        <td><div style="font-weight:500">${p.name}</div></td>
        <td><code style="font-size:11px;color:var(--text2)">${p.sku}</code></td>
        <td><span class="badge badge-blue">${p.category}</span></td>
        <td><strong>${p.stock}</strong> ${p.unit}</td>
        <td>${p.minStock} ${p.unit}</td>
        <td>${formatRp(p.price)}</td>
        <td>${formatRp(p.stock * p.price)}</td>
        <td><span class="badge ${badgeClass}">${status}</span></td>
        <td>
          <button class="action-btn" onclick="openModal('editProduct','${p.id}')">Edit</button>
          <button class="action-btn" onclick="openModal('adjustStock','${p.id}')">Stok</button>
          <button class="action-btn danger" onclick="deleteProduct('${p.id}')">Hapus</button>
        </td>
      </tr>`;
  }).join('');
}

function updateCategoryFilter() {
  const sel = document.getElementById('filterCategory');
  const cats = [...new Set(STATE.products.map(p => p.category))].sort();
  const current = sel.value;
  sel.innerHTML = '<option value="">Semua Kategori</option>' +
    cats.map(c => `<option value="${c}" ${c === current ? 'selected' : ''}>${c}</option>`).join('');
}

function handleSearch(val) {
  const page = document.querySelector('.page.active');
  if (page && page.id === 'inventory') renderInventoryTable();
}

// ===== TRANSACTIONS =====
function renderTransactions() {
  let txns = [...STATE.transactions];
  const type = document.getElementById('transType').value;
  const month = document.getElementById('transMonth').value;

  if (type) txns = txns.filter(t => t.type === type);
  if (month) txns = txns.filter(t => t.date.startsWith(month));

  const colors = { masuk: 'badge-green', keluar: 'badge-red', penyesuaian: 'badge-blue' };

  document.getElementById('transTableBody').innerHTML = txns.length
    ? txns.map(t => `
        <tr>
          <td>${t.date}</td>
          <td><code style="font-size:11px">${t.id}</code></td>
          <td>${t.productName}</td>
          <td><span class="badge ${colors[t.type]}">${t.type}</span></td>
          <td>${t.qty}</td>
          <td>${formatRp(t.price)}</td>
          <td>${formatRp(t.total)}</td>
          <td style="color:var(--text2);font-size:12px">${t.note}</td>
        </tr>`).join('')
    : `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">📋</div><p>Tidak ada transaksi</p></div></td></tr>`;
}

// ===== REPORTS =====
function switchReport(period) {
  STATE.currentPeriod = period;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.period === period);
  });
  const monthSel = document.getElementById('reportMonth');
  monthSel.style.display = period === 'monthly' ? '' : 'none';
  generateReport();
}

function generateReport() {
  const year = parseInt(document.getElementById('reportYear').value);
  const month = parseInt(document.getElementById('reportMonth').value);
  const period = STATE.currentPeriod;

  if (period === 'monthly') generateMonthlyReport(year, month);
  else if (period === 'quarterly') generateQuarterlyReport(year);
  else if (period === 'yearly') generateYearlyReport();
  else if (period === 'category') generateCategoryReport(year);
}

function generateMonthlyReport(year, month) {
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  let txns = STATE.transactions.filter(t => t.date.startsWith(year.toString()));
  if (month > 0) txns = txns.filter(t => parseInt(t.date.split('-')[1]) === month);

  const masuk = txns.filter(t => t.type === 'masuk');
  const keluar = txns.filter(t => t.type === 'keluar');
  const masukTotal = masuk.reduce((s, t) => s + t.total, 0);
  const keluarTotal = keluar.reduce((s, t) => s + t.total, 0);

  document.getElementById('reportSummary').innerHTML = `
    <div class="summary-card"><div class="val">${masuk.length}</div><div class="lbl">Transaksi Masuk</div></div>
    <div class="summary-card"><div class="val">${keluar.length}</div><div class="lbl">Transaksi Keluar</div></div>
    <div class="summary-card"><div class="val">${formatRp(masukTotal)}</div><div class="lbl">Nilai Masuk</div></div>
  `;

  // Per month data for chart
  const labels = months;
  const masukData = Array(12).fill(0);
  const keluarData = Array(12).fill(0);
  STATE.transactions.filter(t => t.date.startsWith(year.toString())).forEach(t => {
    const m = parseInt(t.date.split('-')[1]) - 1;
    if (t.type === 'masuk') masukData[m] += t.total;
    else if (t.type === 'keluar') keluarData[m] += t.total;
  });

  renderReportChart(labels, masukData, keluarData, 'line', 'Nilai Masuk (Rp)', 'Nilai Keluar (Rp)');

  // Table
  const byProduct = {};
  txns.forEach(t => {
    if (!byProduct[t.productId]) byProduct[t.productId] = { name: t.productName, masuk: 0, keluar: 0, masukVal: 0, keluarVal: 0 };
    if (t.type === 'masuk') { byProduct[t.productId].masuk += t.qty; byProduct[t.productId].masukVal += t.total; }
    else if (t.type === 'keluar') { byProduct[t.productId].keluar += t.qty; byProduct[t.productId].keluarVal += t.total; }
  });

  document.getElementById('reportTableHead').innerHTML = `<tr><th>Produk</th><th>Qty Masuk</th><th>Nilai Masuk</th><th>Qty Keluar</th><th>Nilai Keluar</th></tr>`;
  document.getElementById('reportTableBody').innerHTML = Object.values(byProduct).map(r => `
    <tr>
      <td>${r.name}</td>
      <td><span style="color:var(--accent)">${r.masuk}</span></td>
      <td>${formatRp(r.masukVal)}</td>
      <td><span style="color:var(--accent3)">${r.keluar}</span></td>
      <td>${formatRp(r.keluarVal)}</td>
    </tr>`).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text2);padding:20px">Tidak ada data</td></tr>';
}

function generateQuarterlyReport(year) {
  const quarters = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Okt-Des)'];
  const qMasuk = [0, 0, 0, 0];
  const qKeluar = [0, 0, 0, 0];
  const qMasukQty = [0, 0, 0, 0];
  const qKeluarQty = [0, 0, 0, 0];

  STATE.transactions.filter(t => t.date.startsWith(year.toString())).forEach(t => {
    const m = parseInt(t.date.split('-')[1]) - 1;
    const q = Math.floor(m / 3);
    if (t.type === 'masuk') { qMasuk[q] += t.total; qMasukQty[q] += t.qty; }
    else if (t.type === 'keluar') { qKeluar[q] += t.total; qKeluarQty[q] += t.qty; }
  });

  const totalMasuk = qMasuk.reduce((a, b) => a + b, 0);
  const totalKeluar = qKeluar.reduce((a, b) => a + b, 0);

  document.getElementById('reportSummary').innerHTML = `
    <div class="summary-card"><div class="val">${formatRp(totalMasuk)}</div><div class="lbl">Total Nilai Masuk ${year}</div></div>
    <div class="summary-card"><div class="val">${formatRp(totalKeluar)}</div><div class="lbl">Total Nilai Keluar ${year}</div></div>
    <div class="summary-card"><div class="val">${formatRp(totalMasuk - totalKeluar)}</div><div class="lbl">Selisih Bersih</div></div>
  `;

  renderReportChart(quarters, qMasuk, qKeluar, 'bar', 'Nilai Masuk', 'Nilai Keluar');

  document.getElementById('reportTableHead').innerHTML = `<tr><th>Kuartal</th><th>Qty Masuk</th><th>Nilai Masuk</th><th>Qty Keluar</th><th>Nilai Keluar</th><th>Selisih</th></tr>`;
  document.getElementById('reportTableBody').innerHTML = quarters.map((q, i) => `
    <tr>
      <td><strong>${q}</strong></td>
      <td>${qMasukQty[i]}</td>
      <td>${formatRp(qMasuk[i])}</td>
      <td>${qKeluarQty[i]}</td>
      <td>${formatRp(qKeluar[i])}</td>
      <td style="color:${qMasuk[i]-qKeluar[i]>=0?'var(--accent)':'var(--accent3)'}">${formatRp(qMasuk[i] - qKeluar[i])}</td>
    </tr>`).join('');
}

function generateYearlyReport() {
  const years = ['2023', '2024', '2025'];
  const yMasuk = years.map(y => STATE.transactions.filter(t => t.date.startsWith(y) && t.type === 'masuk').reduce((s, t) => s + t.total, 0));
  const yKeluar = years.map(y => STATE.transactions.filter(t => t.date.startsWith(y) && t.type === 'keluar').reduce((s, t) => s + t.total, 0));

  document.getElementById('reportSummary').innerHTML = `
    <div class="summary-card"><div class="val">${formatRp(yMasuk.reduce((a,b)=>a+b,0))}</div><div class="lbl">Total Masuk Semua Tahun</div></div>
    <div class="summary-card"><div class="val">${formatRp(yKeluar.reduce((a,b)=>a+b,0))}</div><div class="lbl">Total Keluar Semua Tahun</div></div>
    <div class="summary-card"><div class="val">${STATE.products.length}</div><div class="lbl">Total Produk Aktif</div></div>
  `;

  renderReportChart(years, yMasuk, yKeluar, 'bar', 'Masuk', 'Keluar');

  document.getElementById('reportTableHead').innerHTML = `<tr><th>Tahun</th><th>Nilai Masuk</th><th>Nilai Keluar</th><th>Pertumbuhan</th></tr>`;
  document.getElementById('reportTableBody').innerHTML = years.map((y, i) => {
    const growth = i > 0 && yMasuk[i - 1] > 0 ? ((yMasuk[i] - yMasuk[i - 1]) / yMasuk[i - 1] * 100).toFixed(1) : '-';
    return `<tr>
      <td><strong>${y}</strong></td>
      <td>${formatRp(yMasuk[i])}</td>
      <td>${formatRp(yKeluar[i])}</td>
      <td>${growth !== '-' ? `<span style="color:${parseFloat(growth)>=0?'var(--accent)':'var(--accent3)'}">${growth}%</span>` : '-'}</td>
    </tr>`;
  }).join('');
}

function generateCategoryReport(year) {
  const catMap = {};
  STATE.products.forEach(p => {
    if (!catMap[p.category]) catMap[p.category] = { products: 0, stock: 0, value: 0, masuk: 0, keluar: 0 };
    catMap[p.category].products++;
    catMap[p.category].stock += p.stock;
    catMap[p.category].value += p.stock * p.price;
  });

  STATE.transactions.filter(t => t.date.startsWith(year.toString())).forEach(t => {
    const product = STATE.products.find(p => p.id === t.productId);
    if (product && catMap[product.category]) {
      if (t.type === 'masuk') catMap[product.category].masuk += t.total;
      else if (t.type === 'keluar') catMap[product.category].keluar += t.total;
    }
  });

  const cats = Object.keys(catMap);
  const values = cats.map(c => catMap[c].value);

  document.getElementById('reportSummary').innerHTML = `
    <div class="summary-card"><div class="val">${cats.length}</div><div class="lbl">Total Kategori</div></div>
    <div class="summary-card"><div class="val">${formatRp(values.reduce((a,b)=>a+b,0))}</div><div class="lbl">Total Nilai Stok</div></div>
    <div class="summary-card"><div class="val">${cats.reduce((max, c) => catMap[c].products > (catMap[max]?.products||0) ? c : max, cats[0])}</div><div class="lbl">Kategori Terbanyak</div></div>
  `;

  renderReportChart(cats, values, null, 'doughnut', 'Nilai Stok', null);

  document.getElementById('reportTableHead').innerHTML = `<tr><th>Kategori</th><th>Produk</th><th>Total Stok</th><th>Nilai Stok</th><th>Masuk (${year})</th><th>Keluar (${year})</th></tr>`;
  document.getElementById('reportTableBody').innerHTML = cats.map(c => `
    <tr>
      <td><span class="badge badge-blue">${c}</span></td>
      <td>${catMap[c].products}</td>
      <td>${catMap[c].stock}</td>
      <td>${formatRp(catMap[c].value)}</td>
      <td>${formatRp(catMap[c].masuk)}</td>
      <td>${formatRp(catMap[c].keluar)}</td>
    </tr>`).join('');
}

function renderReportChart(labels, data1, data2, type, label1, label2) {
  const ctx = document.getElementById('reportChart').getContext('2d');
  if (STATE.charts.report) STATE.charts.report.destroy();

  const colors = ['#4fffb0','#00d4ff','#ffd166','#c77dff','#ff6b6b','#ff9f43','#54a0ff','#5f27cd'];

  const datasets = [
    {
      label: label1,
      data: data1,
      backgroundColor: type === 'doughnut' ? colors : 'rgba(79,255,176,0.3)',
      borderColor: type === 'doughnut' ? colors : 'rgba(79,255,176,0.8)',
      borderWidth: type === 'doughnut' ? 0 : 2,
      borderRadius: type === 'bar' ? 4 : 0,
      tension: 0.4,
      fill: type === 'line'
    }
  ];

  if (data2) {
    datasets.push({
      label: label2,
      data: data2,
      backgroundColor: 'rgba(255,107,107,0.3)',
      borderColor: 'rgba(255,107,107,0.8)',
      borderWidth: 2,
      borderRadius: 4,
      tension: 0.4,
      fill: type === 'line'
    });
  }

  STATE.charts.report = new Chart(ctx, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#8b8fa8', font: { family: 'DM Sans' } } }
      },
      scales: type !== 'doughnut' ? {
        x: { ticks: { color: '#8b8fa8' }, grid: { color: 'rgba(37,40,48,0.6)' } },
        y: { ticks: { color: '#8b8fa8' }, grid: { color: 'rgba(37,40,48,0.6)' } }
      } : undefined
    }
  });
}

// ===== EXPORT =====
function exportToCSV() {
  const headers = ['ID', 'Nama', 'SKU', 'Kategori', 'Stok', 'Min Stok', 'Harga', 'Nilai Total', 'Status'];
  const rows = STATE.products.map(p => {
    const status = p.stock === 0 ? 'Habis' : p.stock <= p.minStock ? 'Menipis' : 'Normal';
    return [p.id, p.name, p.sku, p.category, p.stock, p.minStock, p.price, p.stock * p.price, status];
  });
  downloadCSV(headers, rows, `inventori_${new Date().toISOString().split('T')[0]}.csv`);
  showToast('✅ Export CSV berhasil!');
}

function exportReport() {
  const period = STATE.currentPeriod;
  const year = document.getElementById('reportYear').value;
  const rows = [];
  const table = document.getElementById('reportTableBody');
  table.querySelectorAll('tr').forEach(tr => {
    rows.push(Array.from(tr.querySelectorAll('td')).map(td => td.innerText));
  });
  const head = Array.from(document.getElementById('reportTableHead').querySelectorAll('th')).map(th => th.innerText);
  downloadCSV(head, rows, `laporan_${period}_${year}.csv`);
  showToast('✅ Export laporan berhasil!');
}

function downloadCSV(headers, rows, filename) {
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ===== MODALS =====
function openModal(type, id) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');
  overlay.classList.add('active');

  if (type === 'addProduct') {
    content.innerHTML = `
      <h3>➕ Tambah Produk Baru</h3>
      <div class="form-row">
        <div class="form-group"><label>Nama Produk *</label><input id="m_name" placeholder="Nama produk"></div>
        <div class="form-group"><label>SKU *</label><input id="m_sku" placeholder="ELK-001"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Kategori *</label>
          <select id="m_cat">${STATE.categories.map(c => `<option>${c}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Satuan</label><input id="m_unit" placeholder="pcs, unit, kg..." value="pcs"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Stok Awal</label><input id="m_stock" type="number" value="0"></div>
        <div class="form-group"><label>Minimal Stok</label><input id="m_min" type="number" value="5"></div>
      </div>
      <div class="form-group"><label>Harga Satuan (Rp)</label><input id="m_price" type="number" placeholder="0"></div>
      <div class="form-actions">
        <button class="btn-cancel" onclick="closeModal()">Batal</button>
        <button class="btn-primary" onclick="saveProduct()">Simpan Produk</button>
      </div>`;
  }

  else if (type === 'editProduct') {
    const p = STATE.products.find(x => x.id === id);
    content.innerHTML = `
      <h3>✏️ Edit Produk</h3>
      <input type="hidden" id="m_id" value="${p.id}">
      <div class="form-row">
        <div class="form-group"><label>Nama Produk</label><input id="m_name" value="${p.name}"></div>
        <div class="form-group"><label>SKU</label><input id="m_sku" value="${p.sku}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Kategori</label>
          <select id="m_cat">${STATE.categories.map(c => `<option ${c===p.category?'selected':''}>${c}</option>`).join('')}</select>
        </div>
        <div class="form-group"><label>Satuan</label><input id="m_unit" value="${p.unit}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Stok</label><input id="m_stock" type="number" value="${p.stock}"></div>
        <div class="form-group"><label>Minimal Stok</label><input id="m_min" type="number" value="${p.minStock}"></div>
      </div>
      <div class="form-group"><label>Harga Satuan (Rp)</label><input id="m_price" type="number" value="${p.price}"></div>
      <div class="form-actions">
        <button class="btn-cancel" onclick="closeModal()">Batal</button>
        <button class="btn-primary" onclick="updateProduct('${p.id}')">Perbarui</button>
      </div>`;
  }

  else if (type === 'adjustStock') {
    const p = STATE.products.find(x => x.id === id);
    content.innerHTML = `
      <h3>📦 Penyesuaian Stok: ${p.name}</h3>
      <div class="form-group"><label>Tipe Transaksi</label>
        <select id="m_type">
          <option value="masuk">Masuk (Pembelian/Penerimaan)</option>
          <option value="keluar">Keluar (Penjualan/Pengeluaran)</option>
          <option value="penyesuaian">Penyesuaian Manual</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Jumlah ${p.unit}</label><input id="m_qty" type="number" value="1" min="1"></div>
        <div class="form-group"><label>Harga Per Unit (Rp)</label><input id="m_price" type="number" value="${p.price}"></div>
      </div>
      <div class="form-group"><label>Catatan</label><input id="m_note" placeholder="Keterangan..."></div>
      <div style="margin-top:12px;padding:12px;background:var(--bg3);border-radius:8px;font-size:13px">
        Stok saat ini: <strong>${p.stock} ${p.unit}</strong>
      </div>
      <div class="form-actions">
        <button class="btn-cancel" onclick="closeModal()">Batal</button>
        <button class="btn-primary" onclick="adjustStock('${p.id}')">Simpan</button>
      </div>`;
  }

  else if (type === 'addTransaction') {
    content.innerHTML = `
      <h3>+ Tambah Transaksi</h3>
      <div class="form-group"><label>Produk</label>
        <select id="m_product">
          ${STATE.products.map(p => `<option value="${p.id}">${p.name} (Stok: ${p.stock})</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Tipe</label>
        <select id="m_type">
          <option value="masuk">Masuk</option>
          <option value="keluar">Keluar</option>
          <option value="penyesuaian">Penyesuaian</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Jumlah</label><input id="m_qty" type="number" value="1"></div>
        <div class="form-group"><label>Harga</label><input id="m_price" type="number" value="0"></div>
      </div>
      <div class="form-group"><label>Catatan</label><input id="m_note" placeholder="Keterangan..."></div>
      <div class="form-actions">
        <button class="btn-cancel" onclick="closeModal()">Batal</button>
        <button class="btn-primary" onclick="addTransactionDirect()">Simpan</button>
      </div>`;
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

function saveProduct() {
  const name = document.getElementById('m_name').value.trim();
  const sku = document.getElementById('m_sku').value.trim();
  if (!name || !sku) { showToast('⚠️ Nama dan SKU wajib diisi', true); return; }

  const newProduct = {
    id: 'P' + String(STATE.products.length + 1).padStart(3, '0'),
    name,
    sku,
    category: document.getElementById('m_cat').value,
    unit: document.getElementById('m_unit').value || 'pcs',
    stock: parseInt(document.getElementById('m_stock').value) || 0,
    minStock: parseInt(document.getElementById('m_min').value) || 5,
    price: parseInt(document.getElementById('m_price').value) || 0,
    createdAt: new Date().toISOString().split('T')[0]
  };

  STATE.products.push(newProduct);
  saveData();
  closeModal();
  renderInventoryTable();
  showToast('✅ Produk berhasil ditambahkan!');
}

function updateProduct(id) {
  const p = STATE.products.find(x => x.id === id);
  p.name = document.getElementById('m_name').value;
  p.sku = document.getElementById('m_sku').value;
  p.category = document.getElementById('m_cat').value;
  p.unit = document.getElementById('m_unit').value;
  p.stock = parseInt(document.getElementById('m_stock').value);
  p.minStock = parseInt(document.getElementById('m_min').value);
  p.price = parseInt(document.getElementById('m_price').value);
  saveData();
  closeModal();
  renderInventoryTable();
  showToast('✅ Produk berhasil diperbarui!');
}

function adjustStock(id) {
  const p = STATE.products.find(x => x.id === id);
  const type = document.getElementById('m_type').value;
  const qty = parseInt(document.getElementById('m_qty').value);
  const price = parseInt(document.getElementById('m_price').value);
  const note = document.getElementById('m_note').value;

  if (type === 'keluar' && qty > p.stock) { showToast('⚠️ Stok tidak cukup!', true); return; }
  if (type === 'masuk') p.stock += qty;
  else if (type === 'keluar') p.stock -= qty;
  else p.stock = qty;

  const txn = {
    id: `T${String(STATE.transactions.length + 1).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    productId: p.id,
    productName: p.name,
    type, qty, price,
    total: qty * price,
    note: note || `Penyesuaian stok ${type}`
  };

  STATE.transactions.unshift(txn);
  saveData();
  closeModal();
  renderInventoryTable();
  showToast('✅ Stok berhasil diperbarui!');
}

function addTransactionDirect() {
  const productId = document.getElementById('m_product').value;
  const p = STATE.products.find(x => x.id === productId);
  const type = document.getElementById('m_type').value;
  const qty = parseInt(document.getElementById('m_qty').value);
  const price = parseInt(document.getElementById('m_price').value);
  const note = document.getElementById('m_note').value;

  if (type === 'keluar' && qty > p.stock) { showToast('⚠️ Stok tidak cukup!', true); return; }
  if (type === 'masuk') p.stock += qty;
  else if (type === 'keluar') p.stock -= qty;

  STATE.transactions.unshift({
    id: `T${String(STATE.transactions.length + 1).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    productId: p.id, productName: p.name,
    type, qty, price, total: qty * price, note
  });

  saveData();
  closeModal();
  renderTransactions();
  showToast('✅ Transaksi berhasil disimpan!');
}

function deleteProduct(id) {
  if (!confirm('Hapus produk ini?')) return;
  STATE.products = STATE.products.filter(p => p.id !== id);
  saveData();
  renderInventoryTable();
  showToast('✅ Produk dihapus');
}

// ===== AI CHAT =====
function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key) { showToast('⚠️ Masukkan API key terlebih dahulu', true); return; }
  STATE.apiKey = key;
  localStorage.setItem('invenai_api_key', key);
  showToast('✅ API key tersimpan!');
}

function getInventorySummary() {
  const totalProducts = STATE.products.length;
  const totalValue = STATE.products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = STATE.products.filter(p => p.stock > 0 && p.stock <= p.minStock);
  const outOfStock = STATE.products.filter(p => p.stock === 0);
  const categories = [...new Set(STATE.products.map(p => p.category))];
  const recentTxns = STATE.transactions.slice(0, 20);
  const topProducts = STATE.products.sort((a, b) => (b.stock * b.price) - (a.stock * a.price)).slice(0, 5);

  return `
DATA INVENTORI SAAT INI:
- Total Produk: ${totalProducts}
- Total Nilai Stok: ${formatRp(totalValue)}
- Produk Stok Menipis (${lowStock.length}): ${lowStock.map(p => `${p.name} (${p.stock}/${p.minStock})`).join(', ')}
- Produk Habis (${outOfStock.length}): ${outOfStock.map(p => p.name).join(', ')}
- Kategori: ${categories.join(', ')}
- Total Transaksi: ${STATE.transactions.length}

TOP 5 PRODUK NILAI TERTINGGI:
${topProducts.map(p => `- ${p.name}: stok ${p.stock} ${p.unit}, nilai ${formatRp(p.stock * p.price)}`).join('\n')}

TRANSAKSI TERBARU (20):
${recentTxns.map(t => `- ${t.date}: ${t.type} ${t.productName} ${t.qty} unit = ${formatRp(t.total)}`).join('\n')}

DETAIL SEMUA PRODUK:
${STATE.products.map(p => `- ${p.name} (${p.category}): stok ${p.stock}/${p.minStock}, harga ${formatRp(p.price)}`).join('\n')}
`;
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

function sendQuickPrompt(text) {
  document.getElementById('chatInput').value = text;
  sendChatMessage();
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  if (!STATE.apiKey) {
    showToast('⚠️ Masukkan API key Anthropic di atas untuk menggunakan AI!', true);
    return;
  }

  input.value = '';
  addChatMessage(msg, 'user');

  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-message ai';
  typing.id = 'typing';
  typing.innerHTML = `<div class="chat-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  document.getElementById('chatContainer').appendChild(typing);
  scrollChat();

  const sendBtn = document.getElementById('sendBtn');
  sendBtn.disabled = true;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': STATE.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: `Anda adalah AI Asisten untuk sistem manajemen inventori InvenAI. Anda memiliki akses ke data inventori real-time berikut:\n\n${getInventorySummary()}\n\nBerikan analisis yang berguna, actionable, dan dalam Bahasa Indonesia. Gunakan format yang mudah dibaca dengan poin-poin jika perlu. Selalu berikan rekomendasi konkret berdasarkan data yang ada.`,
        messages: [{ role: 'user', content: msg }]
      })
    });

    const data = await response.json();
    document.getElementById('typing')?.remove();

    if (data.content && data.content[0]) {
      addChatMessage(data.content[0].text, 'ai');
    } else if (data.error) {
      addChatMessage(`❌ Error: ${data.error.message}`, 'ai');
    }
  } catch (err) {
    document.getElementById('typing')?.remove();
    addChatMessage(`❌ Gagal terhubung ke AI. Periksa API key dan koneksi internet.\n\nError: ${err.message}`, 'ai');
  }

  sendBtn.disabled = false;
}

function addChatMessage(text, role) {
  const container = document.getElementById('chatContainer');
  const div = document.createElement('div');
  div.className = `chat-message ${role}`;
  div.innerHTML = `<div class="chat-bubble">${formatMarkdown(text)}</div>`;
  container.appendChild(div);
  scrollChat();
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/^- (.+)/gm, '• $1')
    .replace(/^(\d+\.) (.+)/gm, '$1 $2');
}

function scrollChat() {
  const c = document.getElementById('chatContainer');
  c.scrollTop = c.scrollHeight;
}

// ===== UTILITIES =====
function formatRp(val) {
  if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)}M`;
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}jt`;
  return `Rp ${val.toLocaleString('id-ID')}`;
}

function showToast(msg, isError = false) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = `toast${isError ? ' error' : ''}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ===== INIT =====
function init() {
  loadData();

  // Set API key if saved
  if (STATE.apiKey) {
    document.getElementById('apiKeyInput').value = '••••••••••••';
  }

  // Set current month for transactions
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  document.getElementById('transMonth').value = ym;

  renderDashboard();
  navigate('dashboard');
}

window.addEventListener('DOMContentLoaded', init);
