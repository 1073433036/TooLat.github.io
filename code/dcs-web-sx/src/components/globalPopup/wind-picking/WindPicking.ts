import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './WindPicking.html?style=./WindPicking.scss'

@WithRender
@Component
export default class WindPicking extends Vue {
  @Getter('systemStore/windPickingValue_global')
  windPickingValue_global: { x: number, y: number, dir: number, val: number }

  speed: string = ''
  level: string = ''
  directionText: string = ''
  direction: string = ''

  @Watch('windPickingValue_global')
  onwindPickingValue_globalChanged(val: any, oldVal: any): void {
    this.speed = this.windPickingValue_global.val.toFixed(1)
    this.level = this.computeWindLevel() + '级风'
    this.direction = this.windPickingValue_global.dir.toFixed(0)
    this.directionText = this.computedWindTextByDirection()
  }

  computeWindLevel() {
    //             0   1   2   3   4   5    6    7    8    9    10   11   12   13   14   15   16   17   18   19
    let levels = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37.0, 41.5, 46.2, 51.0, 56.1, 61.3, 66.8, 72.4];
    for (let i = 0; i < levels.length; i++) {
      if (this.windPickingValue_global.val < levels[i])
        return i;
    }
    return 20;
  }

  computedWindTextByDirection() {
    if (this.windPickingValue_global.dir < 22.5 || this.windPickingValue_global.dir > 292.5) {
      return '北风'
    }
    if (this.windPickingValue_global.dir < 67.5) {
      return '东北风'
    }
    if (this.windPickingValue_global.dir < 112.5) {
      return '东风'
    }
    if (this.windPickingValue_global.dir < 157.5) {
      return '东南风'
    }
    if (this.windPickingValue_global.dir < 205.5) {
      return '南风'
    }
    if (this.windPickingValue_global.dir < 247.5) {
      return '西南风'
    }
    if (this.windPickingValue_global.dir < 292.5) {
      return '西北风'
    }
  }
}



