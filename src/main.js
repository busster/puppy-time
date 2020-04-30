import Vue from 'vue'

import App2 from './App2.vue'

import { router } from './router'
import store from './store'

import { register } from './registrations'

Vue.config.productionTip = false

register()

new Vue({
  router,
  store,
  render: h => h(App2)
}).$mount('#app')
