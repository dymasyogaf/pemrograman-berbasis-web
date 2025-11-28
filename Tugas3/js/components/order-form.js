// js/components/order-form.js
// 10. Form DO baru; kirim data ke parent lewat event 'submit-do'
Vue.component('order-form', {
    template: '#tpl-order-form',
    props: {
        paketList: {
            type: Array,
            default: () => []
        },
        ekspedisiList: {
            type: Array,
            default: () => []
        },
        nextDoNumber: {
            type: String,
            default: ''
        }
    },
    data() {
        const today = new Date().toISOString().slice(0, 10);
        return {
            localDo: {
                nim: '',
                nama: '',
                ekspedisi: '',
                paketId: '',
                tanggalKirim: today,
                totalHarga: 0
            },
            selectedPaket: null,
            errorText: ''
        };
    },
    watch: {
        // ketika paket berubah, otomatis update harga total (watcher)
        'localDo.paketId': function () {
            this.updatePaket();
        }
    },
    methods: {
        updatePaket() {
            this.selectedPaket = this.paketList.find(
                (p) => p.id === this.localDo.paketId
            );
            if (this.selectedPaket) {
                this.localDo.totalHarga = this.selectedPaket.harga;
            } else {
                this.localDo.totalHarga = 0;
            }
        },
        validate() {
            if (!this.localDo.nim || !this.localDo.nama) {
                return 'NIM dan Nama wajib diisi.';
            }
            if (!this.localDo.ekspedisi) {
                return 'Silakan pilih ekspedisi.';
            }
            if (!this.localDo.paketId) {
                return 'Silakan pilih paket bahan ajar.';
            }
            if (!this.localDo.tanggalKirim) {
                return 'Tanggal kirim belum diisi.';
            }
            return '';
        },
        submitForm() {
            this.errorText = '';
            const error = this.validate();
            if (error) {
                this.errorText = error;
                return;
            }

            // kirim ke parent
            this.$emit('submit-do', Object.assign({}, this.localDo));
            this.resetForm();
        },
        resetForm() {
            const today = new Date().toISOString().slice(0, 10);
            this.localDo = {
                nim: '',
                nama: '',
                ekspedisi: '',
                paketId: '',
                tanggalKirim: today,
                totalHarga: 0
            };
            this.selectedPaket = null;
            this.errorText = '';
        }
    }
});
