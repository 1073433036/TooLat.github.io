<template>
  <main id="PupProductEntry">
    <zmap />
    <zmap-tool />
    <PupProduct />
    <tool-bar />
    <global-popup />
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import PupProduct from './PupProduct.vue'
  import Zmap from '../Zmap.vue'
  import ZmapTool from '../ZmapTool.vue'
  import ToolBar from '../toolBar/ToolBar.vue'
  import GlobalPopup from '../globalPopup/GlobalPopupEntry.vue'

  @Component({
    components: {
      Zmap,
      ZmapTool,
      PupProduct,
      ToolBar,
      GlobalPopup,
    }
  })
  export default class PupProductEntry extends Vue {
    @Action('systemStore/storeResetVuex_global') storeResetVuex_global: any

    mounted() {
      this.storeResetVuex_global()
    }
  }
</script>

<style lang='scss' scoped>
  #PupProductEntry{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
