<template>
  <main id="typh-timeline-entry"
    :style="{transform: timelineTransform,
      transition: timelineTransition}">
    <typh-search :allTyphData="allTyphoonData" />
    <components :is="timelineView" :allTyphData="allTyphoonData" />
  </main>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import typhSearch from './typhSearch'
import timeLine from './timeLine'
import {getAllHistoryTyph} from './typhUtil'

export default {
  data() {
    return {
      timelineView: null,

      timelineTransform: '',
      timelineTransition: '',
      allTyphoonData: {}
    }
  },
  computed:{
    ...mapGetters([
      'typhTimeLineStatus_global',
    ])
  },
  mounted() {
    getAllHistoryTyph(this.$http)
      .then(data => {
        this.storeBefore03TyphIds_global(data.before03TyphIds);
        this.allTyphoonData = data.allTyphData;
      });
  },
  watch: {
    typhTimeLineStatus_global(nv, ov) {
      let toggleDirection = null
      if(ov === 'search') {
        if(nv === 'deteil' || nv === 'history') {
          toggleDirection = 'up'
        }
      } else if (ov === 'history') {
        if(nv === 'deteil' ) {
          toggleDirection = null
        } else if(nv === 'search') {
          toggleDirection = 'down'
        }
      } else if (ov === 'deteil') {
        if(nv === 'history') {
          toggleDirection = null
        } else if (nv === 'search'){
          toggleDirection = null
        }
      }

      if(toggleDirection === 'up') {
        this.timelineView = timeLine
        this.timelineTransform = 'translateY(136px)'
        setTimeout(() => {
          this.timelineTransition = 'transform .3s ease-in-out'
          this.timelineTransform = 'translateY(0)'
        })
      } else if(toggleDirection === 'down'){
        setTimeout(() => {
          this.timelineView = null
          this.timelineTransition = ''
          this.timelineTransform = ''
        }, 400)
        this.timelineTransform = 'translateY(136px)'
      }
    },
  },
  destroyed(){
    this.toggleTyphTimelineStatus_global('search')
  },
  methods: {
    ...mapActions([
      'toggleTyphTimelineStatus_global',
      'storeBefore03TyphIds_global'
    ])
  },
  components: {
    typhSearch,
    timeLine
  }
}
</script>
<style lang="scss">
#typh-timeline-entry{
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 40px;
}
</style>
