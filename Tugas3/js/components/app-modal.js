// js/components/app-modal.js
// 9. Modal sederhana untuk konfirmasi/himbauan
Vue.component('app-modal', {
    template: '#tpl-app-modal',
    props: {
        title: {
            type: String,
            default: 'Informasi'
        }
    }
});
