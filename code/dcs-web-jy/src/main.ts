// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './filter'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'
Vue.use(ElementUI)
import './styles/date-picker-sim.scss'

import './styles/global.scss'
import './util/fontSize.ts'
import './directive'

Vue.config.productionTip = false

Object.keys(filters).map(name => {
  Vue.filter(name, filters[name])
})

router.beforeEach((to, from, next) => {
  //判断是否通过路径直接打开页面
  if (to.path !== '/' && to.path !== '/main' && !Object.keys(store.getters['systemStore/userInfo_global']).length) {
    window.sessionStorage.getItem('userInfo') && window.sessionStorage.removeItem('userInfo');
    next('/main');
  } else {
    next();
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  // components: { App }
  render: h => h(App)
})
