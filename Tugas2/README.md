# SITTA UT - Sistem Informasi Terpadu Bahan Ajar

Aplikasi frontend demo berbasis Vue.js untuk manajemen stok bahan ajar dan tracking delivery order di Universitas Terbuka.

## Fitur Utama
- Login dengan validasi, sesi admin/operator, popup selamat datang & konfirmasi logout.
- Stok: tabel kode/judul, kategori, UPBJJ, lokasi, qty, safety, status (aman/menipis/kosong), catatan HTML.
- Stok: filter UT-Daerah, filter kategori terikat, filter menipis/kosong, sortir judul/qty/harga, reset filter, edit inline, tambah stok dengan validasi.
- Tracking DO: nomor otomatis (DO<tahun>-<urut>), pilih paket & ekspedisi, total harga otomatis, timeline perjalanan, modal status pengiriman.
- UI responsif: sidebar ikon, kartu, tabel, modal, toast/error notification, tooltip nav.

## Struktur Proyek
Tugas2/
- index.html             # Dashboard & greeting
- login.html             # Halaman login
- stok.html              # Halaman stok (Vue)
- tracking.html          # Halaman tracking DO (Vue)
- css/
  - common.css           # Gaya umum & variabel
  - index.css            # Gaya dashboard
  - login.css            # Gaya login
  - stok.css             # Gaya stok
  - tracking.css         # Gaya tracking
  - style.css            # Gaya tambahan
- js/
  - dataBahanAjar.js     # Data master (stok, paket, pengguna)
  - auth.js              # Autentikasi & notifikasi login
  - session.js           # Manajemen sesi & logout modal
  - stok-app.js          # Logika Vue stok (filter/sort/edit/tambah)
  - tracking-app.js      # Logika Vue DO (form, nomor otomatis, timeline)
- IMG/                   # Logo & ikon sidebar

## Akun Demo
- Admin: admin@ut.ac.id / admin123
- Operator: jakarta@ut.ac.id / jakarta123, surabaya@ut.ac.id / surabaya123, makassar@ut.ac.id / makassar123, padang@ut.ac.id / padang123, denpasar@ut.ac.id / denpasar123

## Cara Menjalankan
1. Buka `login.html` di browser modern.
2. Login dengan akun demo.
3. Navigasi ke stok atau tracking melalui sidebar.

## Teknologi
- HTML5, CSS3 (Flexbox & Grid), JavaScript ES6.
- Vue.js 2 (CDN).
- Google Fonts: Inter.

## Catatan
- Data stok/DO bersifat statis di `js/dataBahanAjar.js`; tidak tersimpan setelah reload.
- Sesi disimpan di `sessionStorage`; gunakan tombol keluar untuk mengakhiri sesi.

## Lisensi
(c) 2025 SITTA UT - Tugas Praktik 2 Vue.js
