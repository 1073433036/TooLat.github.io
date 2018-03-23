// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {
  Radio,
  RadioGroup,
  RadioButton,
  Slider,
  Loading,
  MessageBox,
  Message,
  //Table,
  //TableColumn,
  //Button, 
  //Select, 
} from 'element-ui'

import './globalStyle.scss'
import store from './store'
import App from './App'

// import VueResource from 'vue-resource'

import 'flatpickr/dist/flatpickr.min.css'
import 'flatpickr/dist/themes/dark.css'
import './directive'

// Vue.use(VueResource)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Slider)
Vue.use(Loading)
Vue['prototype']['$confirm'] = MessageBox.confirm
Vue['prototype']['$message'] = Message
//Vue.use(Table)
//Vue.use(TableColumn)
//Vue.use(Button)
//Vue.use(Select)
Vue.config.productionTip = false


// tslint:disable-next-line:no-unused-new
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
