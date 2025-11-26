/*
  Berkas: dataBahanAjar.js
  Keterangan: Berkas JavaScript berisi data master untuk aplikasi SITTA UT
  Fungsi: Menyimpan data referensi yang digunakan oleh seluruh aplikasi
  Isi: Daftar UPBJJ, kategori mata kuliah, jenis pengiriman, paket bahan ajar, data stok, tracking, dan data pengguna
  Digunakan untuk: Menyediakan data sumber untuk aplikasi manajemen stok dan tracking
*/

// Data Bahan Ajar untuk SITTA UT
const dataBahanAjar = {
  // Data pengguna untuk autentikasi
  dataPengguna: [
    {
      id: 1,
      email: "admin@ut.ac.id",
      password: "admin123",
      nama: "Administrator SITTA",
      role: "admin",
      upbjj: "Pusat",
    },
    {
      id: 2,
      email: "jakarta@ut.ac.id",
      password: "jakarta123",
      nama: "Admin UPBJJ Jakarta",
      role: "operator",
      upbjj: "Jakarta",
    },
    {
      id: 3,
      email: "surabaya@ut.ac.id",
      password: "surabaya123",
      nama: "Admin UPBJJ Surabaya",
      role: "operator",
      upbjj: "Surabaya",
    },
    {
      id: 4,
      email: "makassar@ut.ac.id",
      password: "makassar123",
      nama: "Admin UPBJJ Makassar",
      role: "operator",
      upbjj: "Makassar",
    },
    {
      id: 5,
      email: "padang@ut.ac.id",
      password: "padang123",
      nama: "Admin UPBJJ Padang",
      role: "operator",
      upbjj: "Padang",
    },
    {
      id: 6,
      email: "denpasar@ut.ac.id",
      password: "denpasar123",
      nama: "Admin UPBJJ Denpasar",
      role: "operator",
      upbjj: "Denpasar",
    },
  ],
  upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
  kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
  pengirimanList: [
    { kode: "REG", nama: "Reguler (3-5 hari)" },
    { kode: "EXP", nama: "Ekspres (1-2 hari)" },
  ],
  paket: [
    {
      kode: "PAKET-UT-001",
      nama: "PAKET IPS Dasar",
      isi: ["EKMA4116", "EKMA4115"],
      harga: 120000,
    },
    {
      kode: "PAKET-UT-002",
      nama: "PAKET IPA Dasar",
      isi: ["BIOL4201", "FISIP4001"],
      harga: 140000,
    },
  ],
  stok: [
    {
      kode: "EKMA4116",
      judul: "Pengantar Manajemen",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-A3",
      harga: 65000,
      qty: 28,
      safety: 20,
      catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
    },
    {
      kode: "EKMA4115",
      judul: "Pengantar Akuntansi",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-A4",
      harga: 60000,
      qty: 7,
      safety: 15,
      catatanHTML: "<strong>Cover baru</strong>",
    },
    {
      kode: "BIOL4201",
      judul: "Biologi Umum (Praktikum)",
      kategori: "Praktikum",
      upbjj: "Surabaya",
      lokasiRak: "R3-B2",
      harga: 80000,
      qty: 12,
      safety: 10,
      catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
    },
    {
      kode: "FISIP4001",
      judul: "Dasar-Dasar Sosiologi",
      kategori: "MK Pilihan",
      upbjj: "Makassar",
      lokasiRak: "R2-C1",
      harga: 55000,
      qty: 2,
      safety: 8,
      catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
    },
  ],
  // Simulasi status DO (opsional fitur Tracking DO)
  tracking: {
    "DO2025-0001": {
      nim: "123456789",
      nama: "Rina Wulandari",
      status: "Dalam Perjalanan",
      ekspedisi: "JNE",
      tanggalKirim: "2025-08-25",
      paket: "PAKET-UT-001",
      total: 120000,
      perjalanan: [
        {
          waktu: "2025-08-25 10:12:20",
          keterangan: "Penerimaan di Loket: TANGSEL",
        },
        { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
        {
          waktu: "2025-08-26 08:44:01",
          keterangan: "Diteruskan ke Kantor Tujuan",
        },
      ],
    },
  },
};
