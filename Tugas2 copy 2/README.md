# SITTA UT - Sistem Informasi Terpadu Bahan Ajar

Aplikasi frontend demo berbasis Vue.js untuk manajemen stok bahan ajar dan tracking delivery order di Universitas Terbuka.

## Fitur Utama
- Login, validasi form, dan manajemen sesi (admin & operator).
- Modul stok: filter UT-Daerah/kategori, sortir, inline edit, tambah/hapus data, status aman/menipis/kosong.
- Modul tracking DO: nomor otomatis, pilihan paket & ekspedisi, timeline perjalanan, detail penerima.
- UI responsif dengan komponen kartu, tabel, modal, toast, dan notifikasi error.

## Struktur Proyek
Tugas2/
- index.html             # Halaman utama/dashboard
- login.html             # Halaman login
- stok.html              # Halaman manajemen stok
- tracking.html          # Halaman tracking DO
- css/
  - common.css           # Gaya umum & variabel
  - index.css            # Gaya halaman utama
  - login.css            # Gaya halaman login
  - stok.css             # Gaya halaman stok
  - tracking.css         # Gaya halaman tracking
  - style.css            # Gaya tambahan/backup
- js/
  - dataBahanAjar.js     # Data master (stok, paket, pengguna)
  - auth.js              # Logika autentikasi & notifikasi login
  - session.js           # Manajemen sesi & info pengguna
  - stok-app.js          # Aplikasi Vue halaman stok
  - tracking-app.js      # Aplikasi Vue halaman tracking

## Akun Demo
- Admin: admin@ut.ac.id / admin123
- Operator Jakarta: jakarta@ut.ac.id / jakarta123
- Operator Surabaya: surabaya@ut.ac.id / surabaya123
- Operator Makassar: makassar@ut.ac.id / makassar123
- Operator Padang: padang@ut.ac.id / padang123
- Operator Denpasar: denpasar@ut.ac.id / denpasar123

## Cara Menjalankan
1. Buka `login.html` di browser modern.
2. Login menggunakan salah satu akun demo.
3. Jelajahi modul stok dan tracking DO melalui navigasi.

## Teknologi
- HTML5, CSS3 (Flexbox & Grid), JavaScript ES6.
- Vue.js 2 (via CDN).
- Google Fonts: Inter.

## Catatan
- Data disimpan statis di `js/dataBahanAjar.js` untuk keperluan demo.
- Sesi disimpan di `sessionStorage`; gunakan tombol keluar untuk mengakhiri sesi.

## Lisensi
(c) 2025 SITTA UT - Tugas Praktik 2 Vue.js
