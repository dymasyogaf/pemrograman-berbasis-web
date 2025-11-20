/*
  Berkas: tracking-app.js
  Keterangan: Berkas JavaScript berisi logika aplikasi Vue.js untuk halaman tracking delivery order
  Fungsi: Mengimplementasikan fitur tracking pengiriman bahan ajar ke mahasiswa
  Fitur: Form tambah DO baru, generate nomor DO otomatis, timeline perjalanan, dan validasi form
  Digunakan untuk: Melacak status pengiriman bahan ajar dari gudang ke mahasiswa
*/

new Vue({
    el: '#tracking-app',
    data: {
        // Data dari dataBahanAjar.js
        pengirimanList: dataBahanAjar.pengirimanList,
        paket: dataBahanAjar.paket,

        // Data DO awal (diambil dari contoh tracking dummy)
        doList: [
            {
                nomor: "DO2025-0001",
                nim: "123456789",
                nama: "Rina Wulandari",
                ekspedisi: "REG",
                paketKode: "PAKET-UT-001",
                paketNama: "PAKET IPS Dasar",
                tanggalKirim: "2025-08-25",
                total: 120000,
                status: "Dalam Perjalanan",
                perjalanan: [
                    { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
                    { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
                    { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
                ]
            }
        ],

        form: {
            nim: "",
            nama: "",
            ekspedisi: "",
            paketKode: "",
            tanggalKirim: "",
            catatanAwal: ""
        },
        errors: {},

        lastHint: ""
    },

    computed: {
        // Nomor DO berikutnya: DO<YEAR>-<sequence 4 digit>
        nextDoNumber() {
            const year = new Date().getFullYear(); // Tahun berjalan
            const prefix = `DO${year}-`;

            // Hitung DO yang sudah ada tahun ini
            const countThisYear = this.doList.filter(doItem =>
                doItem.nomor.startsWith(prefix)
            ).length;

            const nextSeq = countThisYear + 1;
            const seqStr = String(nextSeq).padStart(4, "0");
            return prefix + seqStr;
        },

        selectedPaket() {
            if (!this.form.paketKode) return null;
            return this.paket.find(p => p.kode === this.form.paketKode) || null;
        }
    },

    watch: {
        // Watcher 1: ketika paket berubah, update hint
        'form.paketKode'(newVal) {
            if (!newVal) {
                this.lastHint = "";
                return;
            }
            const p = this.paket.find(p => p.kode === newVal);
            if (p) {
                this.lastHint = `Paket "${p.nama}" dipilih dengan total harga Rp ${this.formatRupiah(p.harga)}.`;
            }
        },

        // Watcher 2: ketika ekspedisi berubah, berikan pesan kecil
        'form.ekspedisi'(newVal) {
            if (newVal === "EXP") {
                this.lastHint = "Anda memilih layanan ekspres. Pengiriman diprioritaskan lebih cepat.";
            } else if (newVal === "REG") {
                this.lastHint = "Anda memilih layanan reguler. Estimasi 3-5 hari kerja.";
            }
        }
    },

    methods: {
        formatRupiah(num) {
            if (num == null) return "0";
            return num.toLocaleString("id-ID");
        },

        getEkspedisiName(kode) {
            const e = this.pengirimanList.find(x => x.kode === kode);
            return e ? e.nama : kode;
        },

        validateForm() {
            const e = {};

            if (!this.form.nim) e.nim = "NIM wajib diisi.";
            if (!this.form.nama) e.nama = "Nama wajib diisi.";
            if (!this.form.ekspedisi) e.ekspedisi = "Ekspedisi wajib dipilih.";
            if (!this.form.paketKode) e.paketKode = "Paket wajib dipilih.";
            if (!this.form.tanggalKirim) e.tanggalKirim = "Tanggal kirim wajib diisi.";

            this.errors = e;
            return Object.keys(e).length === 0;
        },

        addDo() {
            if (!this.validateForm()) return;

            const nomor = this.nextDoNumber;
            const paket = this.selectedPaket;
            const total = paket ? paket.harga : 0;

            const perjalanan = [];
            if (this.form.catatanAwal) {
                const now = new Date();
                const waktu = now.toISOString().replace("T", " ").slice(0, 19);
                perjalanan.push({
                    waktu,
                    keterangan: this.form.catatanAwal
                });
            }

            this.doList.push({
                nomor,
                nim: this.form.nim,
                nama: this.form.nama,
                ekspedisi: this.form.ekspedisi,
                paketKode: this.form.paketKode,
                paketNama: paket ? paket.nama : "-",
                tanggalKirim: this.form.tanggalKirim,
                total,
                status: "Dalam Perjalanan",
                perjalanan
            });

            // Reset form
            this.form = {
                nim: "",
                nama: "",
                ekspedisi: "",
                paketKode: "",
                tanggalKirim: "",
                catatanAwal: ""
            };
            this.errors = {};
            this.lastHint = "Data DO berhasil ditambahkan.";
        }
    }
});
