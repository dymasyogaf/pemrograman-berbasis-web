new Vue({
    el: '#stok-app',
    data: {
        // Data stok (diadaptasi dari dataBahanAjar.js) :contentReference[oaicite:0]{index=0}
        stocks: [
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
                _editing: false,
                _backup: null
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
                _editing: false,
                _backup: null
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
                _editing: false,
                _backup: null
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
                _editing: false,
                _backup: null
            }
        ],

        // Filter & sort
        selectedUpbjj: "",
        selectedKategori: "",
        showLowStockOnly: false,
        showEmptyOnly: false,
        sortKey: "judul",
        sortDir: "asc",

        // Form tambah stok
        form: {
            kode: "",
            judul: "",
            kategori: "",
            upbjj: "",
            lokasiRak: "",
            harga: null,
            qty: null,
            safety: null,
            catatanHTML: ""
        },
        errors: {},

        lowStockReminder: ""
    },

    computed: {
        upbjjList() {
            const set = new Set(this.stocks.map(s => s.upbjj));
            return Array.from(set);
        },
        kategoriList() {
            const set = new Set(this.stocks.map(s => s.kategori));
            return Array.from(set);
        },

        filteredStocks() {
            return this.stocks.filter(item => {
                // Filter UT-Daerah
                if (this.selectedUpbjj && item.upbjj !== this.selectedUpbjj) return false;

                // Filter kategori (hanya aktif jika UT-Daerah dipilih)
                if (this.selectedUpbjj && this.selectedKategori && item.kategori !== this.selectedKategori) {
                    return false;
                }

                // Filter stok menipis
                if (this.showLowStockOnly && !(item.qty < item.safety && item.qty > 0)) {
                    return false;
                }

                // Filter stok kosong
                if (this.showEmptyOnly && item.qty !== 0) {
                    return false;
                }

                return true;
            });
        },

        sortedStocks() {
            const arr = this.filteredStocks.slice();
            const key = this.sortKey;
            const dir = this.sortDir === "asc" ? 1 : -1;

            arr.sort((a, b) => {
                let va = a[key];
                let vb = b[key];

                if (typeof va === "string") va = va.toLowerCase();
                if (typeof vb === "string") vb = vb.toLowerCase();

                if (va < vb) return -1 * dir;
                if (va > vb) return 1 * dir;
                return 0;
            });

            return arr;
        },

        totalItems() {
            return this.stocks.length;
        },
        totalAman() {
            return this.stocks.filter(s => s.qty >= s.safety && s.qty > 0).length;
        },
        totalMenipis() {
            return this.stocks.filter(s => s.qty < s.safety && s.qty > 0).length;
        },
        totalKosong() {
            return this.stocks.filter(s => s.qty === 0).length;
        }
    },

    watch: {
        // Watcher 1: ketika UT-Daerah berubah, reset kategori
        selectedUpbjj(newVal) {
            if (!newVal) {
                this.selectedKategori = "";
            }
        },

        // Watcher 2: pantau stok yang menipis/kosong untuk membuat pesan pengingat
        stocks: {
            handler() {
                const low = this.stocks.filter(s => s.qty < s.safety && s.qty > 0).length;
                const empty = this.stocks.filter(s => s.qty === 0).length;

                if (low === 0 && empty === 0) {
                    this.lowStockReminder = "";
                } else {
                    this.lowStockReminder = `Ada ${low} item menipis dan ${empty} item stok kosong yang perlu diperhatikan.`;
                }
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        formatRupiah(num) {
            if (num == null) return "0";
            return num.toLocaleString("id-ID");
        },

        resetFilters() {
            this.selectedUpbjj = "";
            this.selectedKategori = "";
            this.showLowStockOnly = false;
            this.showEmptyOnly = false;
            this.sortKey = "judul";
            this.sortDir = "asc";
        },

        getStatusLabel(item) {
            if (item.qty === 0) return "Kosong";
            if (item.qty < item.safety) return "Menipis";
            return "Aman";
        },

        getStatusClass(item) {
            if (item.qty === 0) return "badge-kosong";
            if (item.qty < item.safety) return "badge-menipis";
            return "badge-aman";
        },

        editRow(item) {
            // Simpan backup untuk tombol batal
            item._backup = Object.assign({}, item);
            item._editing = true;
        },

        saveRow(item) {
            // Pastikan qty tidak negatif
            if (item.qty < 0) item.qty = 0;
            item._editing = false;
            item._backup = null;
        },

        cancelEdit(item, index) {
            if (item._backup) {
                // Kembalikan data ke sebelum edit
                const backup = item._backup;
                for (const key in backup) {
                    if (key !== "_backup" && key !== "_editing") {
                        this.$set(this.stocks[index], key, backup[key]);
                    }
                }
            }
            item._editing = false;
            item._backup = null;
        },

        validateForm() {
            const e = {};

            if (!this.form.kode) e.kode = "Kode MK wajib diisi.";
            if (!this.form.judul) e.judul = "Judul mata kuliah wajib diisi.";
            if (!this.form.kategori) e.kategori = "Kategori wajib dipilih.";
            if (!this.form.upbjj) e.upbjj = "UT-Daerah wajib dipilih.";

            if (this.form.harga == null || this.form.harga < 0) {
                e.harga = "Harga harus diisi dan tidak boleh negatif.";
            }
            if (this.form.qty == null || this.form.qty < 0) {
                e.qty = "Qty harus diisi dan tidak boleh negatif.";
            }
            if (this.form.safety == null || this.form.safety < 0) {
                e.safety = "Safety stok harus diisi dan tidak boleh negatif.";
            }

            this.errors = e;
            return Object.keys(e).length === 0;
        },

        addStock() {
            if (!this.validateForm()) return;

            this.stocks.push({
                kode: this.form.kode,
                judul: this.form.judul,
                kategori: this.form.kategori,
                upbjj: this.form.upbjj,
                lokasiRak: this.form.lokasiRak || "-",
                harga: this.form.harga,
                qty: this.form.qty,
                safety: this.form.safety,
                catatanHTML: this.form.catatanHTML || "",
                _editing: false,
                _backup: null
            });

            // Reset form
            this.form = {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: null,
                qty: null,
                safety: null,
                catatanHTML: ""
            };
            this.errors = {};
        }
    }
});
