// js/services/api.js
const ApiService = {
    // 5. Fetch data JSON (data/dataBahanAjar.json), rapikan jadi stocks, paketList, ekspedisiList, doList
    async loadAllData() {
        const response = await fetch('data/dataBahanAjar.json');
        if (!response.ok) {
            throw new Error('Gagal memuat data master bahan ajar.');
        }

        const raw = await response.json();

        const paketList = (raw.paket || raw.paketList || []).map((p, idx) => ({
            id: p.id || p.kode || `PAKET-${idx + 1}`,
            kode: p.kode || p.id || `PAKET-${idx + 1}`,
            nama: p.nama || 'Paket Bahan Ajar',
            isi: p.isi || [],
            harga: Number(p.harga) || 0
        }));

        const stocksSource = raw.stok || raw.stocks || [];
        const stocks = stocksSource.map((item, idx) => ({
            id: item.id || idx + 1,
            kode: item.kode || `MK-${idx + 1}`,
            judul: item.judul || '-',
            kategori: item.kategori || '',
            upbjj: item.upbjj || '',
            lokasiRak: item.lokasiRak || '-',
            harga: Number(item.harga) || 0,
            qty: Number(item.qty) || 0,
            safety: Number(item.safety) || 0,
            catatanHTML: item.catatanHTML || ''
        }));

        const pengiriman = raw.pengirimanList || raw.ekspedisiList || [];
        const ekspedisiList = pengiriman.map((e, idx) => ({
            kode: e.kode || e.id || `EXP-${idx + 1}`,
            nama: e.nama || e.label || e
        }));

        const doList = [];
        const seenNomor = new Set();

        const findPaket = (kode) =>
            paketList.find((p) => p.kode === kode || p.id === kode) || null;

        const pushDo = (nomor, info = {}) => {
            if (!nomor || seenNomor.has(nomor)) return;
            const paket = findPaket(info.paket || info.paketId);
            doList.push({
                id: doList.length + 1,
                nomor,
                nim: info.nim || '-',
                nama: info.nama || '-',
                ekspedisi: info.ekspedisi || info.kurir || '',
                paket: paket || {
                    id: info.paketId || info.paket || 'PAKET',
                    kode: info.paket || info.paketId || 'PAKET',
                    nama: 'Paket Bahan Ajar',
                    isi: [],
                    harga: info.totalHarga || info.total || 0
                },
                paketId: (paket && paket.id) || info.paketId || info.paket || null,
                tanggalKirim: info.tanggalKirim || info.tanggal || '',
                totalHarga:
                    Number(info.totalHarga || info.total || (paket ? paket.harga : 0)) ||
                    0,
                status:
                    info.status ||
                    ((info.progress || info.perjalanan || []).length > 0
                        ? 'Dalam Perjalanan'
                        : 'Menunggu'),
                progress: (info.progress || info.perjalanan || []).map((step) => ({
                    waktu: step.waktu || step.time || step.tanggal || '',
                    keterangan: step.keterangan || step.catatan || step.deskripsi || ''
                }))
            });
            seenNomor.add(nomor);
        };

        if (Array.isArray(raw.doList)) {
            raw.doList.forEach((entry) => {
                pushDo(entry.nomor, entry);
            });
        }

        if (Array.isArray(raw.tracking)) {
            raw.tracking.forEach((entry) => {
                Object.keys(entry || {}).forEach((nomor) => pushDo(nomor, entry[nomor]));
            });
        } else if (raw.tracking && typeof raw.tracking === 'object') {
            Object.keys(raw.tracking).forEach((nomor) => pushDo(nomor, raw.tracking[nomor]));
        }

        return {
            stocks,
            upbjjList: raw.upbjjList || [],
            kategoriList: raw.kategoriList || [],
            paketList,
            ekspedisiList,
            doList
        };
    }
};

if (typeof window !== 'undefined') {
    window.ApiService = ApiService;
}
