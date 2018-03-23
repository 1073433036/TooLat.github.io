import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './SatelliteProduct.html?style=./SatelliteProduct.scss'
import * as CONFIG from '../../../config/productId'

@WithRender
@Component
export default class SatelliteProduct extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  productId: string = CONFIG.satelliteProduct
}