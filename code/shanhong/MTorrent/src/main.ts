// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './hooks'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'

import {
  Select,
  Option,
  Button,
  DatePicker,
  Message,
  MessageBox,
  Loading,
  Notification,
  Table,
  TableColumn,
  Pagination,
  Radio,
  Checkbox,
  CheckboxGroup,
} from 'element-ui'
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Loading)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue['$message']=Vue['prototype']['$message'] = Message //this.$message()
Vue['prototype']['$msgbox'] = MessageBox
Vue['prototype']['$confirm'] = MessageBox.confirm
Vue['prototype']['$notify'] = Notification

import './styles/global.scss'
import './styles/global-panel.scss'
import './styles/global-popup.scss'
import './styles/element-ui.scss'
import './styles/z-map.scss'
import './directive'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
