import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './OceanPicking.html?style=./OceanPicking.scss'

@WithRender
@Component
export default class OceanPicking extends Vue {
  @Getter('systemStore/oceanPickingValue_global') oceanPickingValue_global
  directionText: string = ''

  @Watch('oceanPickingValue_global')
  onoceanPickingValue_globalChanged(val: any, oldVal: any): void {
    this.directionText = this.computedWindTextByDirection()
  }

  computedWindTextByDirection() {
    if (this.oceanPickingValue_global.dir < 22.5 || this.oceanPickingValue_global.dir > 292.5) {
      return '北'
    }
    if (this.oceanPickingValue_global.dir < 67.5) {
      return '东北'
    }
    if (this.oceanPickingValue_global.dir < 112.5) {
      return '东'
    }
    if (this.oceanPickingValue_global.dir < 157.5) {
      return '东南'
    }
    if (this.oceanPickingValue_global.dir < 205.5) {
      return '南'
    }
    if (this.oceanPickingValue_global.dir < 247.5) {
      return '西南'
    }
    if (this.oceanPickingValue_global.dir < 292.5) {
      return '西北'
    }
  }
}