import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './PopupEntry.html?style=./PopupEntry.scss'

import TyphMouseOver from '../typh-mouse-over/TyphMouseOver'
import TyphGrapes from '../typh-grapes/TyphGrapes'
import OprateTip from '../oprate-tip/OprateTip'
import ModelAnalysisResult from '../model-analysis-result/ModelAnalysisResult'
// import FstTimeline from '../fst-timeline/FstTimeline'
import ColorTableIndicator from "../color-table-indicator/ColorTableIndicator";

import InfoPublish from '../../commandModule/info-publish/InfoPublish'
import EventDeal from '../../commandModule/event-deal/EventDeal'
import BasicInfo from '../../infoModule/basic-info/BasicInfo'
import PointDetailPopup from '../../infoModule/point-detail-popup/PointDetailPopup'
import stationRealPopup from '../../monitorModule/weather-monitor/station-real-popup/StationRealPopup'
import userManagement from '../../user-management/UserManagement'
import planModel from '../../commandModule/plan/PlanModel'
import oceanMonitor from '../../monitorModule/ocean-monitor/OceanMonitor'
import waterLevel from '../water-level/WaterLevel'
import AisDetail from "../ais-detail/AisDetail";
import waterLevelWarningTable from '../water-level-warning-table/WaterLevelWarningTable'
import matchPoiInfoPopup from '../../tool-box/search/match-poi-info-popup/MatchPoiInfoPopup'
import windPicking from '../wind-picking/WindPicking'
import gridPicking from '../grid-picking/GridPicking'
import EmergencyPlan from '../../commandModule/emergency-plan/EmergencyPlan'
import TideTable from '../../disasterModule/tide-table/TideTable'
import TrackingEffect from '../tracking-effect/TrackingEffect'
import VideoPopup from '../../monitorModule/video-monitor/video-popup/VideoPopup'
import VideoPointAddress from '../../monitorModule/video-monitor/video-point-address/VideoPointAddress'
import WaterLevelName from '../water-level-name/WaterLevelName'
import VideoScreen from '../video-screen/VideoScreen'
import PointNamePopup from '../../infoModule/point-name-popup/PointNamePopup'
import EleTimeTip from '../../monitorModule/weather-monitor/ele-time-tip/EleTimeTip'
import OceanPicking from '../ocean-picking/OceanPicking'

@WithRender
@Component
export default class PopupEntry extends Vue {
  @Getter('systemStore/typhMouseOverPopup_global') typhMouseOverPopup_global
  @Getter('systemStore/typhGrapesPopup_global') typhGrapesPopup_global
  @Getter('systemStore/oprateTipPopup_global') oprateTipPopup_global
  @Getter('modelStore/isModelAnalysing_global') isModelAnalysing_global
  @Getter('emergencyStore/infoPublish_global') infoPublish_global
  @Getter('emergencyStore/eventDeal_global') eventDeal_global
  @Getter('systemStore/disasterTypeSelected_global') disasterTypeSelected_global
  @Getter('basicInfoStore/basicInfoPopup_global') basicInfoPopup_global
  @Getter('basicInfoStore/poiDetail_global') poiDetail_global
  @Getter('monitorStore/realPopup_global') realPopup_global
  @Getter('monitorStore/displayAISDetailPanel_global') displayAISDetailPanel_global
  @Getter('systemStore/isWeatherForecastPopupOn_global') isWeatherForecastPopupOn_global
  @Getter('systemStore/isUserManagementOn_global') isUserManagementOn_global
  @Getter('emergencyStore/planModel_global') planModel_global
  @Getter('systemStore/isOceanMonitorOn_global') isOceanMonitorOn_global
  @Getter('emergencyStore/waterLevelPopup_global') waterLevelPopup_global
  @Getter('emergencyStore/waterLevelTablePopup_global') waterLevelTablePopup_global
  @Getter('basicInfoStore/matchPoiInfoPopup_global') matchPoiInfoPopup_global
  @Getter('systemStore/whetherDisplayWindValuePanel_global') whetherDisplayWindValuePanel_global
  @Getter('systemStore/whetherDisplayGridValuePanel_global') whetherDisplayGridValuePanel_global
  @Getter('emergencyStore/emergencyPlan_global') emergencyPlan_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Getter('systemStore/isCloseModelResult_global') isCloseModelResult_global
  @Getter('systemStore/isTideTableOn_global') isTideTableOn_global
  @Getter('systemStore/isTrackingResultOn_global') isTrackingResultOn_global
  @Getter('systemStore/isVideoMonitorPopupOn_global') isVideoMonitorPopupOn_global
  @Getter('systemStore/isVideoAddressPopupOn_global') isVideoAddressPopupOn_global  
  @Getter('systemStore/getWaterNamePopupOn_global') getWaterNamePopupOn_global
  @Getter('systemStore/isScreenVideoOn_global') isScreenVideoOn_global
  @Getter('basicInfoStore/isTitlePopupOn_global') isTitlePopupOn_global
  @Getter('systemStore/weatherElementTime_global') weatherElementTime_global  
  @Getter('systemStore/oceanPickingValue_global') oceanPickingValue_global

  typhMouseOverPopupView: any = null
  typhGrapesPopupView: any = null
  oprateTipPopupView: any = null
  oprateTipCloseDelay: any = null
  modelAnalysisResultView: any = null
  fstTimelineView: any = null
  colorTableIndicatorView: any = ColorTableIndicator
  infoPublishView: any = null
  eventDealView: any = null
  basicInfoView: any = null
  basicInfoOn: boolean = null
  pointDetailView: any = null
  stationRealView: any = null
  aisDetailView: any = null
  forecastView: any = null
  managementView: any = null
  planModelView: any = null
  OceanMonitorView: any = null
  waterLevelPopupView: any = null
  waterLevelWarningTableView: any = null
  matchPoiInfoView: any = null
  windPickingView: any = null
  gridPickingView: any = null
  emergencyPlanView: any = null
  tideTableView: any = null
  trackingView: any = null
  videoView: any = null
  videoAddressView: any = null
  waterLevelNameView: any = null
  screenImageView: any = null
  basicNameView: any = null
  eleTimeView: any = null
  oceanPickingView: any = null

  @Watch('oceanPickingValue_global')
  onoceanPickingValue_globalChanged(val: any, oldVal: any): void {
     this.oceanPickingView = val ? OceanPicking : null
  }

  @Watch('weatherElementTime_global')
  onweatherElementTime_globalChanged(val: any, oldVal: any): void {
    this.eleTimeView = Object.keys(val).length ? EleTimeTip : null
  }

  @Watch('isTitlePopupOn_global')
  onisTitlePopupOn_globalChanged(val: any, oldVal: any): void {
    this.basicNameView = val ? PointNamePopup : null
  }

  @Watch('isScreenVideoOn_global')
  onisScreenVideoOn_globalChanged(val: any, oldVal: any): void {
    this.screenImageView = val ? VideoScreen : null
  }

  @Watch('getWaterNamePopupOn_global')
  ongetWaterNamePopupOn_globalChanged(val: any, oldVal: any): void {
    this.waterLevelNameView = val ? WaterLevelName : null
  }

  @Watch('isVideoAddressPopupOn_global')
  onisVideoAddressPopupOn_globalChanged(val: any, oldVal: any): void {
    this.videoAddressView = val ? VideoPointAddress : null
  }

  @Watch('isVideoMonitorPopupOn_global')
  onisVideoMonitorPopupOn_globalChanged(val: any, oldVal: any): void {
    this.videoView = val ? VideoPopup : null
  }

  @Watch('isTrackingResultOn_global')
  onisTrackingResultOn_globalChanged(val: any, oldVal: any): void {
    this.trackingView = val ? TrackingEffect : null
  }

  @Watch('isTideTableOn_global')
  onisTideTableOn_globalChanged(val: any, oldVal: any): void {
    this.tideTableView = val ? TideTable : null
  }

  @Watch('isCloseModelResult_global')
  onisCloseModelResult_globalChanged(val: any, oldVal: any): void {
    console.info('hjahahaha')
    this.modelAnalysisResultView = null
  }

  @Watch('whetherDisplayWindValuePanel_global')
  onwhetherDisplayWindValuePanel_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.windPickingView = windPicking
    else
      this.windPickingView = null
  }

  @Watch('whetherDisplayGridValuePanel_global')
  onwhetherDisplayGridValuePanel_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.gridPickingView = gridPicking
    else
      this.gridPickingView = null
  }

  @Watch('isModelAnalysing_global')
  onisModelAnalysing_globalChanged(val: any, oldVal: any): void {
    console.info('model analysing')
    if (val) {
      this.modelAnalysisResultView = ModelAnalysisResult
      console.info(this.modelAnalysisResultView)
    }
  }

  @Watch('emergencyPlan_global')
  onemergencyPlan_globalChanged(val: any, oldVal: any): void {
    this.emergencyPlanView = val ? EmergencyPlan : null
  }

  @Watch('matchPoiInfoPopup_global')
  onmatchPoiInfoPopup_globalChanged(val: any, oldVal: any): void {
    this.matchPoiInfoView = val ? matchPoiInfoPopup : null
  }

  @Watch('waterLevelTablePopup_global')
  onwaterLevelTablePopupChanged(val: any, oldVal: any): void {
    if (val)
      this.waterLevelWarningTableView = waterLevelWarningTable
    else
      this.waterLevelWarningTableView = null
  }

  @Watch('waterLevelPopup_global')
  onwaterLevelPopup_globalChanged(val: any, oldVal: any): void {
    if (val) {
      this.waterLevelPopupView = waterLevel
    } else {
      this.waterLevelPopupView = null
    }
  }

  @Watch('isOceanMonitorOn_global')
  onisOceanMonitorOn_globalChanged(val: any, oldVal: any): void {
    this.OceanMonitorView = val ? oceanMonitor : null
  }

  @Watch('planModel_global')
  onplanModel_globalChanged(val: any, oldVal: any): void {
    this.planModelView = val ? planModel : null
  }

  @Watch('isUserManagementOn_global')
  onisUserManagementOn_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.managementView = userManagement
    else
      this.managementView = null
  }

  @Watch('isWeatherForecastPopupOn_global')
  onisWeatherForecastPopupOn_globalChanged(val: any, oldVal: any): void {
  }

  @Watch('displayAISDetailPanel_global')
  ondisplayAISDetailPanal_globakChanged(val: any, oldVal: any): void {
    console.info(val)
    if (val && !this.aisDetailView)
      this.aisDetailView = AisDetail
    else
      this.aisDetailView = null
  }

  // @Watch('realPopup_global.show')
  // onRealPopup_globalChanged(val: any, oldVal: any): void {
  //   if(val)
  //     this.stationRealView = stationRealPopup
  //   else
  //     this.stationRealView = null
  // }

  @Watch('realPopup_global')
  onRealPopup_globalChanged(val: any, oldVal: any): void {
    if (Object.keys(val).length)
      this.stationRealView = stationRealPopup
    else
      this.stationRealView = null
  }

  @Watch('poiDetail_global.show')
  onPoiDetail_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.pointDetailView = PointDetailPopup
    else
      this.pointDetailView = null
  }

  @Watch('basicInfoPopup_global')
  onbasicInfoPopup_globalChanged(val: any, oldVal: any): void {
    if (val) {
      if (!this.basicInfoView)
        this.basicInfoView = BasicInfo
      this.basicInfoOn = true
    }
    else
      this.basicInfoOn = false
  }

  @Watch('infoPublish_global')
  oninfoPublish_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.infoPublishView = InfoPublish
    else
      this.infoPublishView = null
  }

  @Watch('eventDeal_global')
  oneventDeal_globalChanged(val: any, oldVal: any): void {
    this.eventDealView = val ? EventDeal : null
  }

  @Watch('disasterTypeSelected_global')
  ondisasterTyphSelected_globalChanged(val: any, oldVal: any): void {
    this.modelAnalysisResultView = null
    this.fstTimelineView = null
  }

  @Watch('typhMouseOverPopup_global')
  ontyphMouserOverPopup_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.typhMouseOverPopupView = TyphMouseOver
    else
      this.typhMouseOverPopupView = null
  }

  @Watch('typhGrapesPopup_global')
  ontyphGrapesPopup_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.typhGrapesPopupView = TyphGrapes
    else
      this.typhGrapesPopupView = null
  }

  @Watch('oprateTipPopup_global')
  onoprateTipPopup_globalChanged(val: any, oldVal: any): void {
    if (val && this.oprateTipPopupView === null) {
      this.oprateTipPopupView = OprateTip
      this.oprateTipCloseDelay = setTimeout(() => {
        this.oprateTipPopupView = null
        this.oprateTipCloseDelay = null
        this.toggleOprateTip_global({ tip: false, text: '' })
      }, 3000)
    } else if (val && this.oprateTipPopupView) {
      clearTimeout(this.oprateTipCloseDelay)
      this.oprateTipCloseDelay = setTimeout(() => {
        this.oprateTipPopupView = null
        this.oprateTipCloseDelay = null
        this.toggleOprateTip_global({ tip: false, text: '' })
      }, 3000)
    }
    if (!val)
      this.oprateTipPopupView = null
  }


  closeModelResultPanel() {
    this.modelAnalysisResultView = null
  }
}



