<template>
  <main id="EmergResponseEntry">
    <zmap />
    <emerg-response />
    <zmap-tool />
    <tool-bar />
    <global-popup />
    <pop-view />
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
  import EmergResponse from './EmergResponse.vue'

  import popView from './popResponseView/popupRiskTypeView.vue'

  @Component({
    components: {
      Zmap,
      ZmapTool,
      ToolBar,
      GlobalPopup,
      EmergResponse,
      popView,
    }
  })
  export default class EmergResponseEntry extends Vue {
    @Action('systemStore/storeResetVuex_global') storeResetVuex_global: any

    mounted() {
      this.storeResetVuex_global()
    }
  }
</script>

<style lang='scss' scoped>
#EmergResponseEntry {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
