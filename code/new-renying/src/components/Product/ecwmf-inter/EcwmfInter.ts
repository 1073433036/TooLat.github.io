import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './EcwmfInter.html?style=./EcwmfInter.scss'
import * as CONFIG from '../../../config/productId'

@WithRender
@Component
export default class EcwmfInter extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  productId: string = CONFIG.ecwmfInter
  utcSelected: number = 0
  scopeSelected: string = 'eurasian'
  date: any = null

  toggleUtcTime(key) {
    this.utcSelected = key
  }
  toggleScope(key) {
    this.scopeSelected = key
  }
}