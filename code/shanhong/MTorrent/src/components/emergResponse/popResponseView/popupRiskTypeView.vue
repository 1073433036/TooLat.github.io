<template>
  <main id="responsePopupEntry">
    <components :is="riskTypeView"></components>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import riskTypeView from './responseMsg.vue'

  @Component
  export default class popupRiskTypeView extends Vue {
    @Getter('systemStore/popupStatus_global') popupStatus_global: any

    riskTypeView: any = null         // 站点数据

    @Watch('popupStatus_global.RiskType')
    onRiskTypeChanged(val: boolean, oldVal: boolean) {
      this.riskTypeView = val ? riskTypeView : null
    }

  }
</script>

<style lang='scss' scoped>
  #responsePopupEntry {

  }
</style>
