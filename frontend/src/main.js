// import Vue from 'vue'
// import App from './App.vue'

// Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')



import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import vueCompositionApi from '@vue/composition-api'
import Axios from 'axios'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Import process polyfill
import process from 'process'
window.process = process

Vue.prototype.$http = Axios

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(vueCompositionApi);
Vue.use(Toast);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(BootstrapVueIcons)


Vue.prototype.moment = moment

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)

  next()
})