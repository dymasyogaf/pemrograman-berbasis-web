// js/components/stock-table.js
// 7. Tabel stok: terima data awal, sediakan filter/sort, edit inline, tambah/hapus stok lokal
Vue.component('ba-stock-table', {
    template: '#tpl-stock-table',
    props: {
        initialStocks: {
            type: Array,
            default: () => []
        },
        upbjjList: {
            type: Array,
            default: () => []
        },
        kategoriList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            allStocks: [],
            filterUpbjj: '',
            filterKategori: '',
            searchText: '',
            onlyLowStock: false,
            onlyEmptyStock: false,
            sortBy: 'judul',
            sortDir: 'asc',
            editId: null,
            editForm: {
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0
            },
            newItem: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            },
            formError: '',
            modal: {
                show: false,
                item: null
            }
        };
    },
    computed: {
        filteredStocks() {
            let list = this.allStocks.slice();

            if (this.filterUpbjj) {
                list = list.filter((s) => s.upbjj === this.filterUpbjj);
            }

            if (this.filterUpbjj && this.filterKategori) {
                list = list.filter((s) => s.kategori === this.filterKategori);
            }

            if (this.searchText) {
                const key = this.searchText.toLowerCase();
                list = list.filter(
                    (s) =>
                        s.kode.toLowerCase().includes(key) ||
                        s.judul.toLowerCase().includes(key)
                );
            }

            if (this.onlyLowStock) {
                list = list.filter((s) => s.qty > 0 && s.qty < s.safety);
            }

            if (this.onlyEmptyStock) {
                list = list.filter((s) => s.qty === 0);
            }

            list.sort((a, b) => {
                let valA = a[this.sortBy];
                let valB = b[this.sortBy];

                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
                return 0;
            });

            return list;
        },
        totalItems() {
            return this.allStocks.length;
        },
        totalAman() {
            return this.allStocks.filter((s) => s.qty >= s.safety && s.qty > 0).length;
        },
        totalMenipis() {
            return this.allStocks.filter((s) => s.qty < s.safety && s.qty > 0).length;
        },
        totalKosong() {
            return this.allStocks.filter((s) => s.qty === 0).length;
        },
        lowStockReminder() {
            const low = this.totalMenipis;
            const empty = this.totalKosong;
            if (low === 0 && empty === 0) return '';
            return `Ada ${low} item menipis dan ${empty} item stok kosong yang perlu diperhatikan.`;
        }
    },
    watch: {
        filterUpbjj(newVal) {
            if (!newVal) this.filterKategori = '';
        }
    },
    methods: {
        initData() {
            this.allStocks = this.initialStocks.map((s, idx) => ({
                id: s.id || idx + 1,
                ...s
            }));
        },
        resetFilter() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.searchText = '';
            this.onlyLowStock = false;
            this.onlyEmptyStock = false;
            this.sortBy = 'judul';
            this.sortDir = 'asc';
        },
        resetNewItem() {
            this.newItem = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
            this.formError = '';
        },
        validateItem(item) {
            if (!item.kode || !item.judul || !item.kategori || !item.upbjj) {
                return 'Kode, Judul, Kategori, dan UT-Daerah wajib diisi.';
            }
            if (item.harga < 0 || item.qty < 0 || item.safety < 0) {
                return 'Harga, stok, dan safety tidak boleh bernilai negatif.';
            }
            return '';
        },
        addItem() {
            this.formError = '';
            const error = this.validateItem(this.newItem);
            if (error) {
                this.formError = error;
                return;
            }

            const newId =
                this.allStocks.length > 0
                    ? Math.max.apply(
                        null,
                        this.allStocks.map((s) => s.id || 0)
                    ) + 1
                    : 1;

            const clone = Object.assign({ id: newId }, this.newItem);
            this.allStocks.unshift(clone);
            this.resetFilter();
            this.resetNewItem();
        },
        startEdit(item) {
            this.editId = item.id;
            this.editForm = {
                judul: item.judul,
                kategori: item.kategori,
                upbjj: item.upbjj,
                lokasiRak: item.lokasiRak,
                harga: item.harga,
                qty: item.qty,
                safety: item.safety
            };
            this.formError = '';
        },
        cancelEdit() {
            this.editId = null;
            this.formError = '';
        },
        saveEdit() {
            if (this.editId == null) return;
            const current = this.allStocks.find((s) => s.id === this.editId);
            if (!current) return;

            const payload = Object.assign({}, current, this.editForm);
            const error = this.validateItem(payload);
            if (error) {
                this.formError = error;
                return;
            }

            Object.assign(current, this.editForm);
            this.editId = null;
            this.formError = '';
        },
        confirmDelete(item) {
            this.modal.item = item;
            this.modal.show = true;
        },
        deleteItem() {
            if (!this.modal.item) return;
            this.allStocks = this.allStocks.filter((s) => s.id !== this.modal.item.id);
            this.modal.item = null;
            this.modal.show = false;
        }
    },
    created() {
        this.initData();
    }
});
