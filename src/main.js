import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { vuetify } from './vuetify'
import VueQriously from 'vue-qriously'
import moment from 'moment'
// import './registerServiceWorker'

moment.locale('ja', {
  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土']
})

Vue.use(VueQriously)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
