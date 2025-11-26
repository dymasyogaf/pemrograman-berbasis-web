/*
  Berkas: stok-app.js
  Keterangan: Berkas JavaScript berisi logika aplikasi Vue.js untuk halaman manajemen stok
  Fungsi: Mengimplementasikan fitur pengelolaan stok (Create, Read, Update)
  Fitur: Filter berdasarkan UT-Daerah dan kategori, sorting, edit inline, validasi form, dan statistik stok
  Digunakan untuk: Mengelola inventaris bahan ajar Universitas Terbuka secara interaktif
*/

// Store app instance globally for session management
document.addEventListener("DOMContentLoaded", function () {
  window.stokApp = new Vue({
    el: "#stok-app",
    data: {
      // Data dari dataBahanAjar.js
      upbjjList: dataBahanAjar.upbjjList,
      kategoriList: dataBahanAjar.kategoriList,

      // Data stok dengan tambahan properti untuk editing
      stocks: dataBahanAjar.stok.map((item) => ({
        ...item,
        _editing: false,
        _backup: null,
      })),

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
        catatanHTML: "",
      },
      errors: {},

      lowStockReminder: "",
    },

    computed: {
      filteredStocks() {
        return this.stocks.filter((item) => {
          // Filter UT-Daerah
          if (this.selectedUpbjj && item.upbjj !== this.selectedUpbjj)
            return false;

          // Filter kategori (hanya aktif jika UT-Daerah dipilih)
          if (
            this.selectedUpbjj &&
            this.selectedKategori &&
            item.kategori !== this.selectedKategori
          ) {
            return false;
          }

          // Filter stok menipis
          if (
            this.showLowStockOnly &&
            !(item.qty < item.safety && item.qty > 0)
          ) {
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
        return this.stocks.filter((s) => s.qty >= s.safety && s.qty > 0).length;
      },
      totalMenipis() {
        return this.stocks.filter((s) => s.qty < s.safety && s.qty > 0).length;
      },
      totalKosong() {
        return this.stocks.filter((s) => s.qty === 0).length;
      },
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
          const low = this.stocks.filter(
            (s) => s.qty < s.safety && s.qty > 0,
          ).length;
          const empty = this.stocks.filter((s) => s.qty === 0).length;

          if (low === 0 && empty === 0) {
            this.lowStockReminder = "";
          } else {
            this.lowStockReminder = `Ada ${low} item menipis dan ${empty} item stok kosong yang perlu diperhatikan.`;
          }
        },
        deep: true,
        immediate: true,
      },
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

        const newItem = {
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
          _backup: null,
        };

        // Tambahkan di urutan teratas supaya langsung terlihat
        this.stocks.unshift(newItem);

        // Reset filter supaya item baru pasti muncul
        this.resetFilters();

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
          catatanHTML: "",
        };
        this.errors = {};
      },

      // Function to filter stocks by UPBJJ (for operators)
      filterStocksByUPBJJ(upbjj) {
        if (SessionManager.hasRole("admin")) {
          // Admin can see all stocks
          return;
        }

        // Filter stocks to show only user's UPBJJ
        this.selectedUpbjj = upbjj;
      },
    },
  });
});
