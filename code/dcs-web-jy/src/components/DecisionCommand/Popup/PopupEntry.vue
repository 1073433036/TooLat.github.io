<template>
  <main id="PopupEntry">
    <color-bar />
    <component :is="phoneLiveView"></component>
    <transition name="top-fade">
      <component :is="disasterImitateView"></component>
      <component :is="shipManageView"></component>
      <component :is="targetReleaseView"></component>
      <component :is="rescueLibView"></component>
      <component :is="expertLibView"></component>
      <component :is="infoSearchView"></component> 
      <component :is="RouteNavView"></component>     
    </transition>
    <component :is="modelResultView"></component>
    <component :is="weatherForecastView"></component>
    <component :is="windPickingView"></component>
    <component :is="rainPickingView"></component>
    <component :is="typhPointEffectView"></component>
    <component :is="stationLiveDetailView"></component>
    <!-- <component :is="stationColorBarView"></component> -->
    <component :is="swanProductView"></component>
    <component :is="waterMonitorDetailView"></component>
    <component :is="torrentDetailView"></component>
    <component :is="waterlogDetailView"></component>
    <component :is="geolDetailView"></component>
    <component :is="forestDetailView"></component>
    <component :is="detailNameView"></component>
    <component :is="videoDetailView"></component>
    <component :is="geographyDetailView"></component>
    <component :is="alarmMonitorDetailView"></component>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'
  import ColorBar from './ColorBar.vue'

  import PhoneLive from './PhoneLive/PhoneLive.vue'
  import DisasterImitate from './DisasterImitate/DisasterImitate.vue'
  import ModelResult from './Model/ModelResult.vue'
  import ShipManage from './ShipManage.vue'
  import TargetRelease from './TargetRelease.vue'
  import RescueLib from './RescueLib.vue'
  import ExpertLib from './ExpertLib.vue'
  import InfoSearch from './InfoSearch.vue'
  import RouteNav from './RouteNav.vue'

  import WeatherForecast from './WeatherForecast/WeatherForecast.vue'
  import WindPicking from './WeatherForecast/WindPicking.vue'
  import RainPicking from './WeatherForecast/RainPicking.vue'
  import TyphPointEffect from './Typhoon/TyphPointEffect.vue'
  import StationLiveDetail from './StationLiveDetail.vue'
  import StationColorBar from './StationColorBar.vue'
  import SwanProduct from './SwanProduct.vue'
  import WaterMonitorDetail from './WaterMonitorDetail.vue'
  import TorrentDetail from './DisasterMonitor/TorrentDetail.vue'
  import WaterlogDetail from './DisasterMonitor/WaterlogDetail.vue'
  import GeolDetail from './DisasterMonitor/GeolDetail.vue'
  import ForestDetail from './DisasterMonitor/ForestDetail.vue'
  import DetailName from './DetailName.vue'
  import VideoDetail from './Video/VideoDetail.vue'
  import GeographyDetail from './GeographyDetail.vue'

  import AlarmMonitorDetail from './AlarmMonitorDetail.vue'

  @Component({
    components: {
      ColorBar
    }
  })
  export default class PopupEntry extends Vue {
    @Getter('decisionStore/popupStatus_global') popupStatus_global
    @Getter('decisionStore/stationColorBar_global') stationColorBar_global
    @Getter('modelStore/selectedModel') selectedModel
    @Getter('modelStore/isModelAnalyzing') isModelAnalyzing
    @Action('decisionStore/storePopupStatus_global') storePopupStatus_global
    phoneLiveView: any = null
    disasterImitateView: any = null
    modelResultView: any = null
    shipManageView: any = null
    targetReleaseView: any = null
    rescueLibView: any = null
    expertLibView: any = null
    infoSearchView: any = null
    RouteNavView: any = null
    
    weatherForecastView: any = null
    windPickingView: any = null
    rainPickingView: any = null
    typhPointEffectView: any = null
    stationLiveDetailView: any = null
    stationColorBarView: any = null
    swanProductView: any = null
    waterMonitorDetailView: any = null
    torrentDetailView: any = null
    waterlogDetailView: any = null
    geolDetailView: any = null
    forestDetailView: any = null
    detailNameView: any = null
    videoDetailView: any = null
    geographyDetailView: any = null

    alarmMonitorDetailView: any = null

    @Watch('popupStatus_global.phoneLive')
    onPhoneLiveChanged (val: boolean, oldVal: boolean) {
      this.phoneLiveView = val ? PhoneLive : null
    }
    @Watch('popupStatus_global.disasterImitate')
    onDisasterImitateChanged (val: boolean, oldVal: boolean) {
      this.disasterImitateView = val ? DisasterImitate : null
    }
    /** 模式分析 */
    @Watch('selectedModel')
    onselectedModelChanged (val: any, oldVal: any) {
      if (val === null)
        this.storePopupStatus_global({ key: 'modelResult', action: false })
    }
    @Watch('isModelAnalyzing')
    onisModelAnalyzingChanged (val: boolean, oldVal: boolean) {
      if (val)
        this.storePopupStatus_global({ key: 'modelResult', action: true })
    }
    @Watch('popupStatus_global.modelResult')
    onModelResultChanged (val: boolean, oldVal: boolean) {
      this.modelResultView = val ? ModelResult : null
    }
    /** */
    @Watch('popupStatus_global.shipManage')
    onShipManageChanged (val: boolean, oldVal: boolean) {
      this.shipManageView = val ? ShipManage : null
    }
    @Watch('popupStatus_global.targetRelease')
    onTargetReleaseChanged (val: boolean, oldVal: boolean) {
      this.targetReleaseView = val ? TargetRelease : null
    }
    @Watch('popupStatus_global.rescueLib')
    onRescueLibChanged (val: boolean, oldVal: boolean) {
      this.rescueLibView = val ? RescueLib : null
    }
    @Watch('popupStatus_global.expertLib')
    onExpertLibChanged (val: boolean, oldVal: boolean) {
      this.expertLibView = val ? ExpertLib : null
    }
    @Watch('popupStatus_global.infoSearch')
    onInfoSearchChanged (val: boolean, oldVal: boolean) {
      this.infoSearchView = val ? InfoSearch : null
    }
    @Watch('popupStatus_global.routeNav')
    onRouteNavChanged (val: boolean, oldVal: boolean) {
      this.RouteNavView = val ? RouteNav : null
    }
    @Watch('popupStatus_global.weatherForecast')
    onWeatherForecastChanged (val: boolean, oldVal: boolean) {
      this.weatherForecastView = val ? WeatherForecast : null
    }
    @Watch('popupStatus_global.windPicking')
    onWindPickingChanged (val: boolean, oldVal: boolean) {
      this.windPickingView = val ? WindPicking : null
    }
    @Watch('popupStatus_global.rainPicking')
    onRainPickingChanged (val: boolean, oldVal: boolean) {
      this.rainPickingView = val ? RainPicking : null
    }
    @Watch('popupStatus_global.typhPointEffect')
    onTyphPointEffectChanged (val: boolean, oldVal: boolean) {
      this.typhPointEffectView = val ? TyphPointEffect : null
    }
    @Watch('popupStatus_global.stationLiveDetail')
    onStationLiveDetailChanged (val: boolean, oldVal: boolean) {
      this.stationLiveDetailView = val ? StationLiveDetail : null
    }
    @Watch('stationColorBar_global')
    onStationColorBarChanged (val: any, oldVal: any) {
      this.stationColorBarView = val ? StationColorBar : null
    }
    @Watch('popupStatus_global.swanProduct')
    onSwanProductChanged (val: boolean, oldVal: boolean) {
      this.swanProductView = val ? SwanProduct : null
    }
    @Watch('popupStatus_global.waterMonitorDetail')
    onWaterMonitorDetailChanged (val: boolean, oldVal: boolean) {
      this.waterMonitorDetailView = val ? WaterMonitorDetail : null
    }
    @Watch('popupStatus_global.torrentDetail')
    onTorrentDetailChanged (val: boolean, oldVal: boolean) {
      this.torrentDetailView = val ? TorrentDetail : null
    }
    @Watch('popupStatus_global.waterlogDetail')
    onWaterlogDetailChanged (val: boolean, oldVal: boolean) {
      this.waterlogDetailView = val ? WaterlogDetail : null
    }
    @Watch('popupStatus_global.geolDetail')
    onGeolDetailChanged (val: boolean, oldVal: boolean) {
      this.geolDetailView = val ? GeolDetail : null
    }
    @Watch('popupStatus_global.forestDetail')
    onForestDetailChanged (val: boolean, oldVal: boolean) {
      this.forestDetailView = val ? ForestDetail : null
    }
    @Watch('popupStatus_global.detailName')
    onDetailNameChanged (val: boolean, oldVal: boolean) {
      this.detailNameView = val ? DetailName : null
    }
    @Watch('popupStatus_global.videoDetail')
    onVideoDetailNameChanged (val: boolean, oldVal: boolean) {
      this.videoDetailView = val ? VideoDetail : null
    }
    @Watch('popupStatus_global.geographyDetail')
    onGeographyDetailChanged (val: boolean, oldVal: boolean) {
      this.geographyDetailView = val ? GeographyDetail : null
    }
    @Watch('popupStatus_global.alarmMonitorDetail')
    onAlarmMonitorDetailChanged (val: boolean, oldVal: boolean) {
      this.alarmMonitorDetailView = val ? AlarmMonitorDetail : null
    }
  }
</script>

<style lang='scss' scoped>
#PopupEntry {
  position: relative;
  z-index: 9;
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
  .top-fade-enter-active, .top-fade-leave-active {
    transition: all .3s ease;
  }
  .top-fade-enter, .top-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
}
</style>