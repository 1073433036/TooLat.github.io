import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './GridPicking.html?style=./GridPicking.scss'

@WithRender
@Component
export default class GridPicking extends Vue {
  @Getter('systemStore/gridPickingValue_global')
  gridPickingValue_global: { x: number, y: number, titleText: string, valText: string }

  @Watch('gridPickingValue_global')
  ongridPickingValue_globalChanged(val: any, oldVal: any): void {
    // console.info(val)
  }
}