import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './AisDetail.html?style=./AisDetail.scss'

@WithRender
@Component
export default class AisDetail extends Vue {
  @Getter('monitorStore/AISDetailPosition_global') AISDetailPosition_global
  @Getter('monitorStore/AISDetailData_global') AISDetailData_global
  @Action('monitorStore/toggleModelHightLight_global') toggleModelHightLight_global
  @Action('monitorStore/toggleAISDetailPanel_global') toggleAISDetailPanel_global

winWidth: number = 0
  winHeight: number = 0
  eleWidth: number = 190
  eleHeight: number = 320
  top: string = ''
  left: string = ''
  topPosition() {
    if (this.eleHeight / 2 + this.AISDetailPosition_global.y > this.winHeight)
      return this.AISDetailPosition_global.y - this.eleHeight + 'px'
    return this.AISDetailPosition_global.y - this.eleHeight / 2 + 'px'
  }
  leftPosition() {
    console.info(this.AISDetailPosition_global)
    if (this.eleWidth + this.AISDetailPosition_global.x + 20 > this.winWidth)
      return this.AISDetailPosition_global.x - this.eleWidth - 20 + 'px'
    return this.AISDetailPosition_global.x + 20 + 'px'
  }
mounted() {
    this.winHeight = document.body.clientHeight
    this.winWidth = document.body.clientWidth
    this.top = this.topPosition()
    this.left = this.leftPosition()
  }
  @Watch('AISDetailData_global')
  onChanged(val: any, oldVal: any): void {
    this.top = this.topPosition()
    this.left = this.leftPosition()
    this.$forceUpdate()
  }
  destroyed() {
    this.toggleModelHightLight_global(false)
  }
}



