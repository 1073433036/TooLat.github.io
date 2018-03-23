<template>
  <main id="GlobalPopupEntry">
    <components :is="CappiProfileView"></components>
    <components :is="windCorridorView"></components>
    <components :is="colorBarView"></components>
    <components :is="SwanMessageTipView"></components>
    <components :is="thresholdSettingView"></components>
    <components :is="warningMsgTableView"></components>
    <components :is="rainColorBarView"></components>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  import CappiProfile from './CappiProfile.vue'
  import WindCorridor from './WindCorridor.vue'
//  import WindCorridor from './vwp.vue'
  import ColorBar from './ColorBar.vue'
  import SwanMessageTip from './SwanMessageTip.vue'
  import thresholdSetting from './thresholdSetting.vue'
  import warningMsgTable from './warningMessage.vue'
  import rainColorBar from './rainColorBar.vue'

  @Component
  export default class GlobalPopupEntry extends Vue {
    @Getter('systemStore/popupStatus_global') popupStatus_global: any

    CappiProfileView: any = null        // 雷达剖面
    windCorridorView: any = null        // 风廊线
    colorBarView: any = null            // 颜色条
    SwanMessageTipView: any = null      // 提示框
    thresholdSettingView: any = null    // 阈值
    warningMsgTableView: any = null     //预警信息列表
    rainColorBarView: any = null      //降雨颜色条

    @Watch('popupStatus_global.CappiProfile')
    onCappiProfileChanged(val: boolean, oldVal: boolean) {
      this.CappiProfileView = val ? CappiProfile : null
    }

    @Watch('popupStatus_global.WindCorridor')
    onWindCorridorChanged(val: boolean, oldVal: boolean) {
      this.windCorridorView = val ? WindCorridor : null
    }

    @Watch('popupStatus_global.ColorBar')
    onColorBarChanged(val: boolean, oldVal: boolean) {
      this.colorBarView = val ? ColorBar : null
    }

    @Watch('popupStatus_global.SwanMessageTip')
    onSwanMessageTipChanged (val: boolean, oldVal: boolean) {
      this.SwanMessageTipView = val ? SwanMessageTip : null
    }

    @Watch('popupStatus_global.thresholdSetting')
    onthresholdSettingChanged (val: boolean, oldVal: boolean) {
      this.thresholdSettingView = val ? thresholdSetting : null
    }

    @Watch('popupStatus_global.warningMsgTable')
    onWarningMsgTableChanged (val: boolean, oldVal: boolean) {
      this.warningMsgTableView = val ? warningMsgTable : null
    }

    @Watch('popupStatus_global.rainColorsBar')
    onRainColorBarChanged (val: boolean, oldVal: boolean) {
      this.rainColorBarView = val ? rainColorBar : null
    }


  }
</script>

<style lang='scss' scoped>

</style>
