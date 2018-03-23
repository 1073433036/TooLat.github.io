import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './GrapesMode.html?style=./GrapesMode.scss'
import * as CONFIG from '../../../config/productId'

@WithRender
@Component
export default class GrapesMode extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  productId: string = CONFIG.grapesMode
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