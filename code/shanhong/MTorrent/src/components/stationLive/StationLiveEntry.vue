<template>
  <main id="StationLiveEntry">
    <zmap />
    <zmap-tool />
    <station-live-panel />
    <station-live-popup />
    <tool-bar />
    <global-popup />
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import StationLivePanel from './StationLivePanel.vue'
  import StationLivePopup from './popup/PopupEntry.vue'
  import Zmap from '../Zmap.vue'
  import ZmapTool from '../ZmapTool.vue'
  import ToolBar from '../toolBar/ToolBar.vue'
  import GlobalPopup from '../globalPopup/GlobalPopupEntry.vue'

  @Component({
    components: {
      Zmap,
      ZmapTool,
      StationLivePanel,
      StationLivePopup,
      ToolBar,
      GlobalPopup
    }
  })
  export default class StationLiveEntry extends Vue {
    @Action('systemStore/storeResetVuex_global') storeResetVuex_global: any

    mounted() {
      this.storeResetVuex_global()
    }
  }
</script>

<style lang='scss' scoped>
#StationLiveEntry{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
