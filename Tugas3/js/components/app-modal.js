// js/components/app-modal.js
Vue.component('app-modal', {
    template: '#tpl-app-modal',
    props: {
        title: {
            type: String,
            default: 'Informasi'
        }
    }
});
