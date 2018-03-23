<template>
  <main id="WarningAnalysisEntry">
    <zmap />
    <zmap-tool />
    <tool-bar />
    <global-popup />
    <warning-analy-panel />
    <station-live-popup />
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import Zmap from '../Zmap.vue'
  import ZmapTool from '../ZmapTool.vue'
  import ToolBar from '../toolBar/ToolBar.vue'
  import GlobalPopup from '../globalPopup/GlobalPopupEntry.vue'
  import WarningAnalyPanel from './warningAnalysisPanel.vue'
  import StationLivePopup from '../stationLive/popup/PopupEntry.vue'

  @Component({
    components: {
      Zmap,
      ZmapTool,
      ToolBar,
      GlobalPopup,
      WarningAnalyPanel,
      StationLivePopup,
    }
  })
  export default class WarningAnalysisEntry extends Vue {
    @Action('systemStore/storeResetVuex_global') storeResetVuex_global: any

    mounted() {
      this.storeResetVuex_global()
    }
  }
</script>

<style lang='scss' scoped>
#WarningAnalysisEntry{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
