import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './NowCasting.html?style=./NowCasting.scss'
import * as CONFIG from '../../../config/productId'

@WithRender
@Component
export default class NowCasting extends Vue {
  @Action('systemStore/toggleProductView_global') toggleProductView_global
  productId: string = CONFIG.nowCasting

  cappi3: boolean = false 
  echoHeight: boolean = false 
  cappi1: boolean = false 
  reflex: boolean = false 
  cappi5: boolean = false 
  vil: boolean = false 
  scit: boolean = false 
  titan: boolean = false 
  hail: boolean = false 
  qpe: boolean = false 
  qpeAdd: boolean = false 
  qpeSix: boolean = false 
  qpeSixAdd: boolean = false 
  qpf: boolean = false 
  qpfAdd: boolean = false 
  qpfSix: boolean = false 
  qpfSixAdd: boolean = false 
  mixRain: boolean = false 
  mixRainAdd: boolean = false 

  toggleCappi3() {
    this.cappi3 = !this.cappi3
  }
  toggleEchoHeight() {
    this.echoHeight = !this.echoHeight
  }
  toggleCappi1() {
    this.cappi1 = !this.cappi1
  }
  toggleReflex() {
    this.reflex = !this.reflex
  }
  toggleCappi5() {
    this.cappi5 = !this.cappi5
  }
  toggleVil() {
    this.vil = !this.vil
  }
  toggleScit() {
    this.scit = !this.scit
  }
  toggleTitan() {
    this.titan = !this.titan
  }
  toggleHail() {
    this.hail = !this.hail
  }



  toggleQpe() {
    this.qpe = !this.qpe
  }
  toggleQpeAdd() {
    this.qpeAdd = !this.qpeAdd
  }
  toggleQpeSix() {
    this.qpeSix = !this.qpeSix
  }
  toggleQpeSixAdd() {
    this.qpeSixAdd = !this.qpeSixAdd
  }
  toggleQpf() {
    this.qpf = !this.qpf
  }
  toggleQpfAdd() {
    this.qpfAdd = !this.qpfAdd
  }
  toggleQpfSix() {
    this.qpfSix = !this.qpfSix
  }
  toggleQpfSixAdd() {
    this.qpfSixAdd = !this.qpfSixAdd
  }
  toggleMixRain() {
    this.mixRain = !this.mixRain
  }
  toggleMixRainAdd() {
    this.mixRainAdd = !this.mixRainAdd
  }
}