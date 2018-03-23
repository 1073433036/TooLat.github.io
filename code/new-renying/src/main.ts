// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import store from './store'
import App from './App'

import './util/fontSize'
import './styles/main.scss'
import './styles/divIcon.scss'
import './styles/global-popup.scss'
import './directive'

import { Loading, DatePicker, Message, pagination, Slider } from 'element-ui'

Vue.use(Loading)
Vue.use(DatePicker)
Vue.use(pagination)
Vue.use(Slider)
Vue.prototype['$message'] = Message

// tslint:disable-next-line:no-unused-new
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
