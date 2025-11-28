// js/components/do-tracking.js
// 11. Panel tracking DO: daftar, cari, pilih DO, tambah progres, ubah status; pakai paketList + ekspedisiList + initialDoList
Vue.component('do-tracking', {
    template: '#tpl-do-tracking',
    props: {
        paketList: {
            type: Array,
            default: () => []
        },
        ekspedisiList: {
            type: Array,
            default: () => []
        },
        initialDoList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            doList: [],
            searchQuery: '',
            searchResult: null,
            selectedDo: null,
            progressInput: {
                keterangan: ''
            },
            nextSequence: 1
        };
    },
    computed: {
        nextDoNumber() {
            const year = new Date().getFullYear();
            const seq = String(this.nextSequence).padStart(3, '0');
            return `DO${year}-${seq}`;
        }
    },
    watch: {
        searchQuery(val) {
            if (!val) {
                this.searchResult = null;
            }
        }
    },
    methods: {
        initData() {
            this.doList = (this.initialDoList || []).map((d, idx) => ({
                id: d.id || idx + 1,
                nomor: d.nomor,
                nim: d.nim,
                nama: d.nama,
                ekspedisi: d.ekspedisi,
                paket:
                    this.paketList.find((p) => p.id === d.paketId || p.kode === d.paketId || p.kode === d.paket?.kode) ||
                    d.paket ||
                    this.paketList[0] || {
                        id: d.paketId || 'PAKET',
                        kode: d.paketId || 'PAKET',
                        nama: 'Paket Bahan Ajar',
                        isi: [],
                        harga: d.totalHarga || 0
                    },
                paketId: d.paketId || (d.paket && d.paket.id) || (d.paket && d.paket.kode),
                tanggalKirim: d.tanggalKirim,
                totalHarga: d.totalHarga,
                status:
                    d.status ||
                    ((d.progress || []).length > 0 ? 'Dalam Perjalanan' : 'Menunggu'),
                progress: (d.progress || []).map((p) => ({
                    waktu: p.waktu,
                    keterangan: p.keterangan
                }))
            }));

            if (this.doList.length > 0) {
                const maxSeq = Math.max(
                    ...this.doList.map((d) => {
                        const match = /DO\d{4}-(\d+)/.exec(d.nomor || '');
                        return match ? parseInt(match[1], 10) : 0;
                    })
                );
                this.nextSequence = (isFinite(maxSeq) ? maxSeq : 0) + 1;
            }
        },
        generateDoNumber() {
            const nomor = this.nextDoNumber;
            this.nextSequence += 1;
            return nomor;
        },
        addDo(newDo) {
            const paket =
                this.paketList.find((p) => p.id === newDo.paketId) ||
                this.paketList[0] || {
                    id: newDo.paketId || 'PAKET',
                    kode: newDo.paketId || 'PAKET',
                    nama: 'Paket Bahan Ajar',
                    isi: [],
                    harga: newDo.totalHarga || 0
                };
            const nomor = this.generateDoNumber();

            const doObj = {
                id: this.doList.length > 0 ? this.doList.length + 1 : 1,
                nomor,
                nim: newDo.nim,
                nama: newDo.nama,
                ekspedisi: newDo.ekspedisi,
                paket,
                paketId: paket ? paket.id : newDo.paketId,
                tanggalKirim: newDo.tanggalKirim,
                totalHarga: newDo.totalHarga,
                status: 'Dalam Perjalanan',
                progress: []
            };

            this.doList.push(doObj);
            this.selectedDo = doObj;
            this.searchResult = null;
            this.searchQuery = '';
        },
        handleSearch() {
            const key = this.searchQuery.trim().toLowerCase();
            if (!key) {
                this.searchResult = null;
                return;
            }

            const found = this.doList.find(
                (d) =>
                    d.nomor.toLowerCase() === key ||
                    d.nim.toLowerCase() === key
            );

            this.searchResult = found || null;
            if (found) {
                this.selectedDo = found;
            }
        },
        resetSearch() {
            this.searchQuery = '';
            this.searchResult = null;
        },
        selectDo(item) {
            this.selectedDo = item;
        },
        addProgress() {
            if (!this.selectedDo) return;
            const text = this.progressInput.keterangan.trim();
            if (!text) return;

            const now = new Date().toISOString();
            this.selectedDo.progress.push({
                waktu: now,
                keterangan: text
            });
            this.selectedDo.status = 'Dalam Perjalanan';
            this.progressInput.keterangan = '';
        },
        updateStatus(status) {
            if (!this.selectedDo) return;
            this.selectedDo.status = status;
            const now = new Date().toISOString();
            this.selectedDo.progress.push({
                waktu: now,
                keterangan: `Status diubah menjadi ${status}`
            });
        },
        getEkspedisiName(kode) {
            const e = this.ekspedisiList.find((x) => x.kode === kode);
            return e ? `${e.kode} - ${e.nama}` : kode;
        },
        statusClass(status) {
            switch (status) {
                case 'Terkirim':
                case 'Selesai':
                    return 'delivered';
                case 'Menunggu':
                    return 'pending';
                default:
                    return 'processing';
            }
        }
    },
    created() {
        this.initData();
    }
});
