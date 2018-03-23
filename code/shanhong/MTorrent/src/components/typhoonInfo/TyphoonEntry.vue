<template>
  <main id="TyphoonEntry">
    <zmap />
    <zmap-tool />
    <tool-bar />
    <global-popup />
    <Typhoon-info-panel />
    <Typhoon-level-tip />
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
  import TyphoonInfoPanel from './TyphoonInfoPanel.vue'
  import TyphoonLevelTip from './TyphoonLevelTip.vue'

  @Component({
    components: {
      Zmap,
      ZmapTool,
      ToolBar,
      GlobalPopup,
      TyphoonInfoPanel,
      TyphoonLevelTip,
    }
  })
  export default class TyphoonEntry extends Vue {
    @Action('systemStore/storeResetVuex_global') storeResetVuex_global: any

    mounted() {
      this.storeResetVuex_global()
    }
  }
</script>

<style lang='scss' scoped>
#TyphoonEntry {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>