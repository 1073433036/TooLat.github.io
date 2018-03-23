<template>
  <main id="StationLivePopupEntry">
    <components :is="riskPointView"></components>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import riskPointView from './riskPointInfoView.vue'

  @Component
  export default class StationLivePopupEntry extends Vue {
    @Getter('systemStore/popupStatus_global') popupStatus_global: any

    riskPointView: any = null         // 站点数据

    @Watch('popupStatus_global.RiskPoint')
    onStationRealChanged(val: boolean, oldVal: boolean) {
      this.riskPointView = val ? riskPointView : null
    }

  }
</script>

<style lang='scss' scoped>
  #StationLivePopupEntry {

  }
</style>
