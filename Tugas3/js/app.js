// js/app.js

// ===== GLOBAL FILTERS =====
Vue.filter('rupiah', function (value) {
    if (value == null || value === '') return '-';
    const number = Number(value) || 0;
    return 'Rp ' + number.toLocaleString('id-ID');
});

Vue.filter('withUnit', function (value, unit) {
    if (value == null || value === '') return '-';
    const number = Number(value) || 0;
    return number.toLocaleString('id-ID') + ' ' + (unit || '');
});

Vue.filter('indoDate', function (value) {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date)) return value;
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
});

Vue.filter('dateTime', function (value) {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date)) return value;
    return date.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// ===== ROOT APP =====
// 2. Nyalakan Vue di #app, daftarkan filter global untuk format rupiah/tanggal
new Vue({
    el: '#app',
    data: {
        currentTab: 'stok',
        isLoading: true,
        initialData: {
            stocks: [],
            upbjjList: [],
            kategoriList: [],
            paketList: [],
            ekspedisiList: [],
            doList: []
        }
    },
    methods: {
        loadInitialData() {
            // 3. Ambil semua data awal (stok, paket, ekspedisi, DO) lewat ApiService
            this.isLoading = true;
            ApiService.loadAllData()
                .then((data) => {
                    this.initialData.stocks = data.stocks || [];
                    this.initialData.upbjjList = data.upbjjList || [];
                    this.initialData.kategoriList = data.kategoriList || [];
                    this.initialData.paketList = data.paketList || [];
                    this.initialData.ekspedisiList = data.ekspedisiList || [];
                    this.initialData.doList = data.doList || [];
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    },
    created() {
        // 4. Saat app dibuat, langsung muat data supaya tampilan siap dipakai
        this.loadInitialData();
    }
});
