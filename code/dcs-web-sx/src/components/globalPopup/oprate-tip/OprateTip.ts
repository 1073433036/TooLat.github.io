import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './OprateTip.html?style=./OprateTip.scss'

@WithRender
@Component
export default class OprateTip extends Vue {
  @Getter('systemStore/oprateTipText_global') oprateTipText_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global


  selfWidth: number = 200
  left: number = 0

  created() {
    let winWidth: number = document.body.clientWidth
    this.left = (winWidth - this.selfWidth) / 2
  }
}



