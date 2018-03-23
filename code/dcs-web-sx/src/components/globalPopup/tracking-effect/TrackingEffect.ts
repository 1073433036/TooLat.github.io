import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './TrackingEffect.html?style=./TrackingEffect.scss'

@WithRender
@Component
export default class TrackingEffect extends Vue {
  @Getter('systemStore/getTrackingResult_global') data
  @Getter('systemStore/getTrackingTime_global') time
  @Action('systemStore/toggleTrackingResult_global') toggleTrackingResult_global
  option: any = {
    0: {
      text: '当前时间',
      color: '#caca67',
    },
    1: {
      text: '未来10分钟',
      color: '#00aefd',
    },
    2: {
      text: '未来20分钟',
      color: '#9b02ff',
    },
    3: {
      text: '未来30分钟',
      color: '#00bfdc',
    },
    4: {
      text: '未来40分钟',
      color: '#ffa500',
    },
    5: {
      text: '未来50分钟',
      color: '#ff0',
    },
    6: {
      text: '未来1小时',
      color: '#0f0',
    }
  }
}