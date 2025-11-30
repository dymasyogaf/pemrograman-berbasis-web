// Vue app untuk pelacakan Delivery Order SITTA UT
// Store app instance globally for session management
document.addEventListener("DOMContentLoaded", function () {
  window.trackingApp = new Vue({
    el: "#tracking-app",
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
          alamat: "Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta",
          telepon: "0812-3456-7890",
          ekspedisi: "REG",
          paketKode: "PAKET-UT-001",
          paketNama: "PAKET IPS Dasar",
          tanggalKirim: "2025-08-25",
          total: 120000,
          status: "Dalam Perjalanan",
          diterimaOleh: "",
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
        {
          nomor: "DO2025-0002",
          nim: "987654321",
          nama: "Ahmad Fauzi",
          alamat: "Jl. Merdeka No. 456, Bandung, Jawa Barat",
          telepon: "0822-1234-5678",
          ekspedisi: "EXP",
          paketKode: "PAKET-UT-002",
          paketNama: "PAKET IPA Dasar",
          tanggalKirim: "2025-08-26",
          total: 140000,
          status: "Terkirim",
          diterimaOleh: "Ahmad Fauzi",
          perjalanan: [
            {
              waktu: "2025-08-26 09:00:00",
              keterangan: "Paket diambil dari Gudang UT Bandung",
            },
            {
              waktu: "2025-08-26 10:30:00",
              keterangan: "Dalam perjalanan ke alamat tujuan",
            },
            {
              waktu: "2025-08-26 14:15:00",
              keterangan: "Tiba di Kantor Pos Bandung",
            },
            {
              waktu: "2025-08-27 09:45:00",
              keterangan: "Paket sedang diantar ke alamat penerima",
            },
            {
              waktu: "2025-08-27 11:30:00",
              keterangan: "Paket berhasil dikirim ke penerima",
            },
          ],
        },
      ],

      form: {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: "",
        catatanAwal: "",
      },
      errors: {},

      lastHint: "",
      selectedTrackingItem: null,
    },

    computed: {
      // Nomor DO berikutnya: DO<YEAR>-<sequence 4 digit>
      nextDoNumber() {
        const year = new Date().getFullYear(); // Tahun berjalan
        const prefix = `DO${year}-`;

        // Hitung DO yang sudah ada tahun ini
        const countThisYear = this.doList.filter((doItem) =>
          doItem.nomor.startsWith(prefix),
        ).length;

        const nextSeq = countThisYear + 1;
        const seqStr = String(nextSeq).padStart(4, "0");
        return prefix + seqStr;
      },

      selectedPaket() {
        if (!this.form.paketKode) return null;
        return this.paket.find((p) => p.kode === this.form.paketKode) || null;
      },

      latestTracking() {
        if (
          !this.selectedTrackingItem ||
          !this.selectedTrackingItem.perjalanan
        ) {
          return { waktu: "-", keterangan: "-" };
        }
        const steps = this.selectedTrackingItem.perjalanan;
        return steps.length
          ? steps[steps.length - 1]
          : { waktu: "-", keterangan: "-" };
      },

      receiverName() {
        if (!this.selectedTrackingItem) return "-";
        if (this.selectedTrackingItem.diterimaOleh)
          return this.selectedTrackingItem.diterimaOleh;
        return this.selectedTrackingItem.status === "Terkirim"
          ? "Penerima"
          : "Belum diterima";
      },
    },

    watch: {
      // Watcher 1: ketika paket berubah, update hint
      "form.paketKode"(newVal) {
        if (!newVal) {
          this.lastHint = "";
          return;
        }
        const p = this.paket.find((p) => p.kode === newVal);
        if (p) {
          this.lastHint = `Paket "${p.nama}" dipilih dengan total harga Rp ${this.formatRupiah(p.harga)}.`;
        }
      },

      // Watcher 2: ketika ekspedisi berubah, berikan pesan kecil
      "form.ekspedisi"(newVal) {
        if (newVal === "EXP") {
          this.lastHint =
            "Anda memilih layanan ekspres. Pengiriman diprioritaskan lebih cepat.";
        } else if (newVal === "REG") {
          this.lastHint =
            "Anda memilih layanan reguler. Estimasi 3-5 hari kerja.";
        }
      },
    },

    methods: {
      formatRupiah(num) {
        if (num == null) return "0";
        return num.toLocaleString("id-ID");
      },

      getEkspedisiName(kode) {
        const e = this.pengirimanList.find((x) => x.kode === kode);
        return e ? e.nama : kode;
      },

      getStatusClass(status) {
        switch (status) {
          case "Dalam Perjalanan":
            return "do-status-processing";
          case "Terkirim":
            return "do-status-delivered";
          case "Menunggu":
            return "do-status-pending";
          default:
            return "do-status-processing";
        }
      },

      validateForm() {
        const e = {};

        if (!this.form.nim) e.nim = "NIM wajib diisi.";
        if (!this.form.nama) e.nama = "Nama wajib diisi.";
        if (!this.form.ekspedisi) e.ekspedisi = "Ekspedisi wajib dipilih.";
        if (!this.form.paketKode) e.paketKode = "Paket wajib dipilih.";
        if (!this.form.tanggalKirim)
          e.tanggalKirim = "Tanggal kirim wajib diisi.";

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
            keterangan: this.form.catatanAwal,
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
          diterimaOleh: "",
          perjalanan,
        });

        // Reset form
        this.form = {
          nim: "",
          nama: "",
          ekspedisi: "",
          paketKode: "",
          tanggalKirim: "",
          catatanAwal: "",
        };
        this.errors = {};
        this.lastHint = "Data DO berhasil ditambahkan.";
      },

      // Function to filter DO by UPBJJ (for operators)
      filterTrackingByUPBJJ(upbjj) {
        if (SessionManager.hasRole("admin")) {
          // Admin can see all DOs
          return;
        }

        // For operators, we would need to filter DOs based on their UPBJJ
        // This would require additional data structure to track which UPBJJ created each DO
        // For now, we'll show all DOs but this can be enhanced
        console.log(`Filtering DOs for UPBJJ: ${upbjj}`);
      },

      // Function to show tracking modal
      showTrackingModal(doItem) {
        this.selectedTrackingItem = doItem;
      },

      // Function to close tracking modal
      closeTrackingModal() {
        this.selectedTrackingItem = null;
      },
    },
  });
});
