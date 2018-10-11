// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import Vue from 'vue'
import App from './App'
import router from './router'

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'
// import Axios from 'axios'
// Vue.use(ElementUI)
//已通过cdn引入
Vue.prototype.$http = axios 


Vue.config.productionTip = false

import navHeader from './components/navHeader.vue'
import footer from './components/footer.vue'
import scollbtn from './components/scollbtn.vue'

Vue.component('navHeader', navHeader)
Vue.component('v-footer', footer)
Vue.component('scollbtn', scollbtn)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
