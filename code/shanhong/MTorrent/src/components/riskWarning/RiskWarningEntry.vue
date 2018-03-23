<template>
  <main id="RiskWarningEntry">
    <zmap />
    <zmap-tool />
    <RiskWarning />
    <tool-bar />
    <global-popup />
    <point-popup />
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import RiskWarning from './RiskWarning.vue'
  import Zmap from '../Zmap.vue'
  import ZmapTool from '../ZmapTool.vue'
  import ToolBar from '../toolBar/ToolBar.vue'
  import GlobalPopup from '../globalPopup/GlobalPopupEntry.vue'
  import pointPopup from './popView/popupViewEntry.vue'
  @Component({
    components: {
      Zmap,
      ZmapTool,
      RiskWarning,
      ToolBar,
      GlobalPopup,
      pointPopup,
    }
  })
  export default class RiskWarningEntry extends Vue {
    @Action('systemStore/storeResetVuex_global') storeResetVuex_global: any
    mounted() {
      this.storeResetVuex_global()
    }
  }
</script>

<style lang='scss' scoped>
  #RiskWarningEntry{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>












