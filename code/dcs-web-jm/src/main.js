// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import '../static/css/element_ui_change.css'
import store from './store'
import App from './App'
import {
  DatePicker,
  Loading,
  Table,
  TableColumn,
  Dialog,
  Switch,
  Slider,
  Tooltip,
  Button,
  Input,
  Select,
  Form,
  Option,
  FormItem,
  Tabs,
  Badge,
  Collapse,
  CollapseItem,
} from 'element-ui'
import Draggabilly from 'draggabilly'

Vue.use(VueResource)
Vue.http.options.emulateJSON = true;

Vue.use(DatePicker)  //添加时间控件
Vue.use(Loading)  //添加加载组件
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Slider)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tabs)
Vue.use(Badge)
Vue.use(Collapse)
Vue.use(CollapseItem)
//注册窗口拖动指令
Vue.directive('drag', {
  // 当绑定元素插入到 DOM 中。
  inserted: (el, binding) => {
    new Draggabilly(el, {
      containment: 'body',
      handle: binding.value.handle
    });
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})


