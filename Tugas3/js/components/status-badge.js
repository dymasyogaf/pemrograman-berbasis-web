// js/components/status-badge.js
// 8. Lencana status stok: Aman/Menipis/Kosong berdasar qty vs safety
Vue.component('status-badge', {
    template: '#tpl-status-badge',
    props: {
        qty: {
            type: Number,
            default: 0
        },
        safety: {
            type: Number,
            default: 0
        },
        note: {
            type: String,
            default: ''
        }
    },
    computed: {
        label() {
            if (this.qty === 0) return 'Kosong';
            if (this.qty < this.safety) return 'Menipis';
            return 'Aman';
        },
        badgeClass() {
            if (this.qty === 0) return 'badge-kosong';
            if (this.qty < this.safety) return 'badge-menipis';
            return 'badge-aman';
        },
        notePlain() {
            const div = document.createElement('div');
            div.innerHTML = this.note || '';
            return div.textContent || div.innerText || '';
        }
    }
});
