import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './ToolBox.html?style=./ToolBox.scss'

import MapLayer from './map-layer/MapLayer'
import RouteNav from './route-nav/RouteNav'
import Ranging from './ranging/Ranging'
import Measure from './measure/Measure'
import Search from './search/Search'

const view: any = {
  layer: MapLayer,
  routeNav: RouteNav,
  ranging: Ranging,
  measure: Measure,
  search: Search,
}

@WithRender
@Component
export default class ToolBox extends Vue {
  selectedOpt: string = ''
  currentView: any = null

  toggleOpt(opt) {
    if (this.selectedOpt === opt) {
      this.selectedOpt = ''
      this.currentView = null
    } else {
      this.selectedOpt = opt
      this.currentView = view[opt]
    } 
  }
}