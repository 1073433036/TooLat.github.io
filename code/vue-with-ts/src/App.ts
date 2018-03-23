import Vue from 'vue'
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import WithRender from './App.html?style=./App.scss'

import LeftNav from './components/left-nav/LeftNav'

@WithRender
@Component({
  components: {
    LeftNav,
  }
})
export default class App extends Vue {
    
}