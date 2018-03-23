<template>
  <main id="TyphTimelineEntry" :style="{transform: timelineTransform, transition: timelineTransition}">
    <typh-search :maxTyphYear="maxTyphYear" :minTyphYear="minTyphYear" />
    <keep-alive>
      <components :is="timelineView" :storeTyphYearData="storeTyphYearData" />
    </keep-alive>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import TyphSearch from './TyphSearch.vue'
  import TyphTimeline from "./MainTimeline.vue"

  @Component({
    components: {
      TyphSearch
    }
  })
  export default class TyphTimelineEntry extends Vue {
    @Getter('decisionStore/typhTimelineStatus_global') typhTimelineStatus_global

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
          this.timelineTransition = 'transform .3s linear'
          this.timelineTransform = 'translateY(0)'
        })
      } else if (toggleDirection === 'down') {
        setTimeout(() => {
          this.timelineView = null
          this.timelineTransition = ''
          this.timelineTransform = ''
        }, 300)
        this.timelineTransform = 'translateY(110px)'
      }
    }
  }
</script>

<style lang='scss' scoped>
#TyphTimelineEntry {
  position: absolute;
  width: 100%;
  z-index: 1;
  bottom: 0;
}
</style>