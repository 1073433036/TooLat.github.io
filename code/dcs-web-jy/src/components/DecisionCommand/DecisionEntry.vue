<template>
  <main id="DecisionEntry">
    <common-header :headerTitle="headerTitle"/>
    <zmap />
    <zmap-tool />
    <main-menu />
    <tool-bar />
    <popup-entry />
    <emergency-monitor />
    <component :is="typhTimelineView"></component>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import Zmap from '../MapComponents/Zmap.vue'
  import ZmapTool from '../MapComponents/ZmapTool.vue'
  import MainMenu from './MainMenu/MainMenu.vue'
  import EmergencyMonitor from './EmergencyMonitor/EmergencyMonitor.vue'
  import ToolBar from './ToolBar/ToolBar.vue'
  import PopupEntry from './Popup/PopupEntry.vue'
  import CommonHeader from '../CommonComponents/CommonHeader.vue'
  import TyphTimeline from './Popup/Typhoon/TyphTimelineEntry.vue'
  
  @Component({
    components: {
      CommonHeader,
      Zmap,
      ZmapTool,
      MainMenu,
      EmergencyMonitor,
      ToolBar,
      PopupEntry
    }
  })
  export default class DecisionEntry extends Vue {
    @Getter('decisionStore/disasterTypeSelected_global') disasterTypeSelected_global
    @Getter('decisionStore/typhTimelineStatus_global') typhTimelineStatus_global
    @Action('decisionStore/storeResetVuex_global') storeResetVuex_global: any
    headerTitle: string = '揭阳市综合决策指挥系统'
    typhTimelineView: any = null

    mounted() {
      this.storeResetVuex_global()
    }

    @Watch('disasterTypeSelected_global')
    ondisasterTypeSelected_globalChanged(val: any, oldVal: any): void {
      if (val === 'tide') {
        this.typhTimelineView = TyphTimeline
      } else {
        if (oldVal === 'tide') {
          let entry: any = document.querySelector('#TyphTimelineEntry')
          entry.style.transition = 'transform .3s ease-in-out'
          if (this.typhTimelineStatus_global === 'search')
            entry.style.transform = 'translateY(50px)'
          else
            entry.style.transform = 'translateY(173px)'
          setTimeout(() => {
            this.typhTimelineView = null
          }, 400)
        }
      }
    }
  }
</script>

<style lang="scss">
@import '../../styles/decision.scss';
</style>

<style lang='scss' scoped>
#DecisionEntry {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>