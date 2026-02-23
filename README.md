# ⬡ InvenAI — Smart Inventory Management System

> Sistem manajemen inventori modern dengan AI terintegrasi (Anthropic Claude), laporan bulanan/triwulan/tahunan/per-kategori, dan export CSV.

![InvenAI Preview](https://img.shields.io/badge/Status-Ready-brightgreen) ![No Backend](https://img.shields.io/badge/Backend-None%20Required-blue) ![AI Powered](https://img.shields.io/badge/AI-Claude%20API-orange)

## ✨ Fitur Utama

### 📦 Manajemen Inventori
- CRUD produk (tambah, edit, hapus)
- Tracking stok dengan alert stok menipis & habis
- Filter berdasarkan kategori, status, dan sort
- Export inventori ke CSV
- SKU dan multi-kategori

### 💸 Transaksi
- Catat transaksi masuk, keluar, dan penyesuaian
- Filter per bulan dan tipe transaksi
- Riwayat transaksi lengkap

### 📊 Laporan & Rekap
| Tipe Laporan | Keterangan |
|---|---|
| **Bulanan** | Rekap per bulan dengan filter tahun & bulan |
| **Triwulan** | Rekap Q1–Q4 dengan perbandingan kuartal |
| **Tahunan** | Perbandingan antar tahun + pertumbuhan % |
| **Per Kategori** | Distribusi stok, nilai, masuk & keluar per kategori |

- Grafik interaktif (bar, line, doughnut) dengan Chart.js
- Export laporan ke CSV

### 🤖 AI Asisten (Claude API)
- Analisis stok otomatis berdasarkan data real-time
- Prediksi kebutuhan restok
- Rekomendasi strategi pengadaan
- Rekapitulasi laporan dengan bahasa natural
- Quick prompt untuk pertanyaan umum

## 🚀 Cara Penggunaan

### 1. Clone repo
```bash
git clone https://github.com/username/invenai.git
cd invenai
```

### 2. Buka langsung di browser
```bash
# Tidak perlu server! Cukup buka file:
open index.html

# Atau gunakan live server (VS Code extension)
# Atau Python simple server:
python3 -m http.server 8080
```

### 3. Setup AI (Opsional)
1. Dapatkan API key dari [console.anthropic.com](https://console.anthropic.com)
2. Buka halaman **AI Asisten** di aplikasi
3. Masukkan API key dan klik **Simpan**
4. Mulai bertanya kepada AI tentang inventori Anda!

> ⚠️ **Keamanan**: API key disimpan di `localStorage` browser. Jangan gunakan di komputer publik.

## 📁 Struktur File

```
invenai/
├── index.html    # Halaman utama & struktur UI
├── style.css     # Styling (dark theme, responsive)
├── app.js        # Logic aplikasi + AI integration
└── README.md     # Dokumentasi ini
```

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|---|---|
| **Vanilla HTML/CSS/JS** | Frontend — tanpa framework |
| **Chart.js 4** | Grafik interaktif |
| **Anthropic Claude API** | AI analisis inventori |
| **localStorage** | Penyimpanan data lokal |
| **Google Fonts (Syne + DM Sans)** | Tipografi |

## 📱 Responsif
- ✅ Desktop (full sidebar)
- ✅ Tablet (2-kolom grid)
- ✅ Mobile (hamburger menu, stacked layout)

## 🎨 Screenshot

**Dashboard** — Stats, tren stok bulanan, distribusi kategori, stok menipis
**Inventori** — Tabel produk dengan filter & sort
**Laporan** — Bulanan / Triwulan / Tahunan / Per Kategori dengan grafik
**AI Chat** — Tanya AI tentang kondisi inventori secara natural

## 📦 Data Sample

Aplikasi sudah dilengkapi **12 produk sample** dari 6 kategori dan **60+ transaksi** acak untuk demonstrasi.

Data di-reset ketika `localStorage` dibersihkan.

## 🔧 Kustomisasi

### Tambah Kategori
Edit array `STATE.categories` di `app.js`:
```javascript
STATE.categories: ['Elektronik', 'Makanan & Minuman', ...]
```

### Ganti Model AI
Edit di fungsi `sendChatMessage()`:
```javascript
model: 'claude-opus-4-6' // atau 'claude-sonnet-4-6'
```

### Integrasi Database
Ganti fungsi `saveData()` dan `loadData()` dengan API calls ke backend (Node.js, Laravel, dll).

## 📄 Lisensi
MIT — Bebas digunakan dan dimodifikasi.

---
Dibuat dengan ❤️ menggunakan Claude AI
