import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './WaterLevel.html?style=./WaterLevel.scss'
import moment from 'moment'

@WithRender
@Component
export default class WaterLevelPopup extends Vue {
  @Getter('emergencyStore/waterLevelData_global') waterLevelData_global
  @Getter('emergencyStore/waterLevelPosition_global') waterLevelPosition_global
  @Action('emergencyStore/toggleWaterLevelPopup_global') toggleWaterLevelPopup_global
  @Action('monitorStore/toggleWaterLevelDetail_global') toggleWaterLevelDetail_global

  winWidth: number = 0
  eleWidth: number = 304
  top: string = ''
  left: string = ''
  waterLevelRef: number = 82
  startSvgHeight: number = 55
  isOverFlow: boolean = false

  get levelImg() {
    let stringPrefix = 'static/img/waterLevel/'
    let result = this.waterLevelData_global.warnwaterlevel / this.waterLevelData_global.curwaterlevel
    if (this.waterLevelData_global.iswarning)
      return stringPrefix + 'red.png'
    else if (result < 0.65)
      return stringPrefix + 'blue.png'
    else if (result < 0.8)
      return stringPrefix + 'yellow.png'
    else
      return stringPrefix + 'orange.png'
  }
  get updateDateTime() {
    let string = moment(this.waterLevelData_global.updateTime).format('YYYY-MM-DD HH:mm')
    return string
  }
  get levelSvgColor() {
    if (this.waterLevelData_global.iswarning) {
      return '#ed1c24'
    } else {
      let warnPer = this.waterLevelData_global.curwaterlevel / this.waterLevelData_global.warnwaterlevel
      if (warnPer < 0.65)
        return '#00a0e9'
      else if (warnPer < 0.8)
        return '#fcee21'
      else
        return '#f7931e'
    }
  }
  levelSvgString: string = ''

  mounted() {
    this.winWidth = document.body.clientWidth
    this.levelSvgString = this.getSvgString()
    this.$forceUpdate()
  }
  destroyed() {
    this.toggleWaterLevelDetail_global(false)
  }

  @Watch('waterLevelData_global')
  onwaterLevelData_globalChanged(val: any, oldVal: any): void {
    this.levelSvgString = this.getSvgString()
    this.$forceUpdate()
  }

  getSvgString() {
    this.waterLevelRef = 82
    this.isOverFlow = false
    if (this.waterLevelData_global.distance > 0)
      this.waterLevelRef = this.waterLevelRef * (this.waterLevelData_global.distance / this.waterLevelData_global.warnwaterlevel)
    else {
      this.waterLevelRef = -10
      this.isOverFlow = true
    }
    let Y = this.startSvgHeight + this.waterLevelRef
    Y = Number(Y.toFixed(1))
    let upY = Y + 8,
      downY = Y - 8
    return `M 29 ${Y} Q 39 ${upY}, 49 ${Y} Q 59 ${downY}, 69 ${Y} Q 79 ${upY}, 89 ${Y} Q 99 ${downY}, 109 ${Y} Q 119 ${upY}, 129 ${Y} Q 139 ${downY}, 149 ${Y} Q 159 ${upY}, 169 ${Y} v 128 h -148 L 29 ${Y} Z`
  }
}



