<template>
  <main id="StationLivePopupEntry">
    <components :is="stationRealView"></components>
    <components :is="stationTableView"></components>
    <components :is="StationSearchView"></components>
    <components :is="HydrologyRealView"></components>
    <components :is="HydrologyChartView"></components>
    <components :is="HydrologyTableView"></components>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import StationReal from './StationReal.vue'
  import StationTable from './StationTable.vue'
  import StationSearch from './StationSearch.vue'
  import HydrologyReal from './HydrologyReal.vue'
  import HydrologyChart from './HydrologyChart.vue'
  import HydrologyTable from './HydrologyTable.vue'

  @Component
  export default class StationLivePopupEntry extends Vue {
    @Getter('systemStore/popupStatus_global') popupStatus_global: any

    stationRealView: any = null         // 站点数据
    stationTableView: any = null        // 站点表格数据
    StationSearchView: any = null       // 站点搜索
    HydrologyRealView: any = null       // 水文数据
    HydrologyChartView: any = null      // 水文e-chart数据
    HydrologyTableView: any = null      // 水文列表数据

    @Watch('popupStatus_global.StationReal')
    onStationRealChanged(val: boolean, oldVal: boolean) {
      this.stationRealView = val ? StationReal : null
    }

    @Watch('popupStatus_global.StationTable')
    onStationTableChanged(val: boolean, oldVal: boolean) {
      this.stationTableView = val ? StationTable : null
    }

    @Watch('popupStatus_global.StationSearch')
    onStationSearchChanged(val: boolean, oldVal: boolean) {
      this.StationSearchView = val ? StationSearch : null
    }

    @Watch('popupStatus_global.HydrologyReal')
    onHydrologyRealChanged(val: boolean, oldVal: boolean) {
      this.HydrologyRealView = val ? HydrologyReal : null
    }

    @Watch('popupStatus_global.HydrologyChart')
    onHydrologyChartChanged(val: boolean, oldVal: boolean) {
      this.HydrologyChartView = val ? HydrologyChart : null
    }

    @Watch('popupStatus_global.HydrologyTable')
    onHydrologyTableChanged(val: boolean, oldVal: boolean) {
      this.HydrologyTableView = val ? HydrologyTable : null
    }
  }
</script>

<style lang='scss' scoped>
#StationLivePopupEntry {
  
}
</style>