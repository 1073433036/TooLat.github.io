import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './TyphTimelineEntry.html?style=./TyphTimelineEntry.scss'

import TyphSearch from "../typh-search/TyphSearch"
import TyphTimeline from "../main-timeline/MainTimeline"

@WithRender
@Component({
  components: {
    TyphSearch
  }
})
export default class TyphTimelineEntry extends Vue {
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global

  timelineView: any = null
  timelineTransform: string = ''
  timelineTransition: string = ''
  maxTyphYear: number = 0
  minTyphYear: number = 0

  storeTyphYearData(max, min) {
    this.maxTyphYear = max
    this.minTyphYear = min
  }

  @Watch('typhTimelineStatus_global')
  ontyphTimelineStatus_globalChanged(val: any, oldVal: any): void {
    let toggleDirection: 'up' | 'down' | null = null

    if (oldVal === 'search') {
      if (val === 'detail' || val === 'history') {
        toggleDirection = 'up'
      }
    } else if (oldVal === 'history') {
      if (val === 'detail') {
        toggleDirection = null
      } else if (val === 'search') {
        toggleDirection = 'down'
      }
    } else if (oldVal === 'detail') {
      if (val === 'history') {
        toggleDirection = null
      } else if (val === 'search') {
        toggleDirection = null
      }
    }


    if (toggleDirection === 'up') {
      this.timelineView = TyphTimeline
      this.timelineTransform = 'translateY(110px)'
      setTimeout(() => {
        this.timelineTransition = 'transform .3s ease-in-out'
        this.timelineTransform = 'translateY(0)'
      })
    } else if (toggleDirection === 'down') {
      setTimeout(() => {
        this.timelineView = null
        this.timelineTransition = ''
        this.timelineTransform = ''
      }, 600)
      this.timelineTransform = 'translateY(110px)'
    }

  }
}



