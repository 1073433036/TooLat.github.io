import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './MainMenu.html?style=./MainMenu.scss'

import tideMonitor from '../disasterModule/tide-monitor/TideMonitor'
import rainMonitor from '../disasterModule/rain-monitor/RainMonitor'
import ThunderMonitor from "../disasterModule/thunder-monitor/ThunderMonitor"
import weatherForecast from '../disasterModule/weather-forecast/WeatherForecast'
import shipManage from '../commandModule/ship-management/ShipManagement'
import phoneLive from '../monitorModule/phone-live/PhoneLive'
import weatherMonitor from '../monitorModule/weather-monitor/WeatherMonitor'
import waterMonitor from '../monitorModule/water-monitor/WaterMonitor'
import ProgBar from '../monitorModule/weather-monitor/progress-bar/ProgressBar'
import VideoMonitor from '../monitorModule/video-monitor/VideoMonitor'

@WithRender
@Component
export default class MainMenu extends Vue {
  @Getter('systemStore/typhTimelineStatus_global') typhTimelineStatus_global
  @Getter('systemStore/isColorIndicatorDisplay_global') isColorIndicatorDisplay_global
  @Getter('emergencyStore/planModel_global') planModel_global
  @Getter('emergencyStore/infoPublish_global') infoPublish_global
  @Getter('emergencyStore/eventDeal_global') eventDeal_global
  @Getter('systemStore/isPhoneMonitorOn_global') isPhoneMonitorOn_global
  @Action('systemStore/togglePhoneMonitor_global') togglePhoneMonitor_global
  @Getter('basicInfoStore/basicInfoPopup_global') basicInfoPopup_global
  @Action('systemStore/selectDisasterType_global') selectDisasterType_global
  @Action('emergencyStore/togglePlanModel_global') togglePlanModel_global
  @Action('emergencyStore/toggleInfoPublish_global') toggleInfoPublish_global
  @Action('systemStore/storeTideMonitorState_global') storeTideMonitorState_global
  @Action('emergencyStore/toggleEventDeal_global') toggleEventDeal_global
  @Action('basicInfoStore/toggleBasicInfoPopup_global') toggleBasicInfoPopup_global
  @Getter('systemStore/isWeatherMonitorOn_global') isWeatherMonitorOn_global
  @Getter('systemStore/isOceanMonitorOn_global') isOceanMonitorOn_global
  @Action('systemStore/toggleOceanMonitor_global') toggleOceanMonitor_global
  @Action('systemStore/toggleWeatherMonitor_global') toggleWeatherMonitor_global
  @Action('systemStore/toggleUserManagement_global') toggleUserManagement_global
  @Getter('systemStore/isTideTableOn_global') isTideTableOn_global
  @Action('systemStore/toggleTideTable_global') toggleTideTable_global
  @Getter('systemStore/isProgBarOn_global') isProgBarOn_global
  @Action('systemStore/toggleProgBar_global') toggleProgBar_global
  @Action('systemStore/changeProgBarElement_global') changeProgBarElement_global
  @Getter('systemStore/isShowCurrentTy_global') isShowCurrentTy_global
  @Getter('systemStore/isClickedTy_global') isClickedTy_global

  tideSeledVar: 'rain' | 'wind' = 'wind'
  firstTierMenuSelected: 'disaster' | 'monitor' | 'command' | 'info' | null = null
  disasterOptionSelected: 'tide' | 'rain' | 'torrent' | 'waterLog' | 'thunder' | 'weather' | null = null
  commandOptionSelected: 'prePlan' | 'infoPublish' | 'emergency' | 'shipManage' | null = null
  monitorOptionSelected: MonitorOption = {
    phone: false,
    video: false,
    ocean: false,
    water: false,
    weather: false,
    tide: false
  }
  disasterView: any = null
  commandView: any = null
  phoneLiveView: any = null
  weatherMonitorView: any = null
  waterMonitorView: any = null
  progBarView: any = null
  VideoMonitorView:any = null
  get isTransfomingMenuNeeded() {
    if (this.isColorIndicatorDisplay_global && this.typhTimelineStatus_global !== 'search')
      return true
    else
      return false
  }

  @Watch('isClickedTy_global')
  onisClickedTy_globalChanged(val: any, oldVal: any): void {
    if (this.firstTierMenuSelected !== 'disaster')
      this.selectFirstTierOption('disaster')
    if (this.disasterOptionSelected !== 'tide')
      this.selectDisasterOption('tide')
  }

  @Watch('isShowCurrentTy_global')
  onisShowCurrentTy_globalChanged(val: any, oldVal: any): void {
    if(val) {
      if (this.firstTierMenuSelected !== 'disaster')
        this.selectFirstTierOption('disaster')
      if (this.disasterOptionSelected !== 'tide')
        this.selectDisasterOption('tide')
    }
  }

  openManagementPage() {
    this.toggleUserManagement_global(true)
  }

  selectFirstTierOption(option: 'disaster' | 'monitor' | 'command' | 'info' | null): void {
    if (this.firstTierMenuSelected === option)
      this.firstTierMenuSelected = null
    else
      this.firstTierMenuSelected = option
  }

  selectDisasterOption(option: 'tide' | 'rain' | 'torrent' | 'waterLog' | 'thunder' | 'weather' | null): void {
    if (this.disasterOptionSelected === option)
      this.disasterOptionSelected = null
    else
      this.disasterOptionSelected = option

    this.selectDisasterType_global(this.disasterOptionSelected)
  }

  selectCommandOption(option: 'prePlan' | 'infoPublish' | 'emergency' | 'shipManage' | null): void {
    if (this.commandOptionSelected === option)
      this.commandOptionSelected = null
    else
      this.commandOptionSelected = option
  }

  selectMonitorOption(target) {
    this.monitorOptionSelected[target] = !this.monitorOptionSelected[target]
    if(target === 'video')
      this.VideoMonitorView = this.monitorOptionSelected[target] ? VideoMonitor : null
    if (target === 'phone')
      this.togglePhoneMonitor_global()
    if(target === 'ocean') {
      let ele = this.monitorOptionSelected[target] ? 'ocean' : null
      this.changeProgBarElement_global(ele)
      this.toggleProgBar_global(this.monitorOptionSelected[target])
      //this.toggleOceanMonitor_global()
    }
    if (target === 'weather')
      this.toggleWeatherMonitor_global()
    if(target === 'water' && this.monitorOptionSelected[target])
      this.waterMonitorView = waterMonitor  
    else if(target === 'water')
      this.waterMonitorView = null
    // if(target === 'tide')
    //   this.toggleTideTable_global()
  }

  @Watch('isProgBarOn_global')
  onisProgBarOn_globalChanged(val: any, oldVal: any): void {
    this.progBarView = val ? ProgBar : null
  }

  @Watch('isTideTableOn_global')
  onisTideTableOn_globalChanged(val: any, oldVal: any): void {
    if(!val)
      this.monitorOptionSelected.tide = false
  }

  @Watch('isOceanMonitorOn_global')
  onisOceanMonitorOn_globalChanged(val: any, oldVal: any): void {
    if(!val)
      this.monitorOptionSelected.ocean = false
  }

  @Watch('isWeatherMonitorOn_global')
  onisWeatherMonitorOn_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.weatherMonitorView = weatherMonitor
    else
      this.weatherMonitorView = null
  }

  @Watch('isPhoneMonitorOn_global')
  onisPhoneMonitorOn_globalChanged(val: any, oldVal: any): void {
    if (val)
      this.phoneLiveView = phoneLive
    else
      this.phoneLiveView = null
  }
  
  @Watch('basicInfoPopup_global')
  onbasicInfoPopup_globalChanged(val: any, oldVal: any): void {
    if (val === false && this.firstTierMenuSelected === 'info')
      this.selectFirstTierOption('info')
  }

  @Watch('infoPublish_global')
  oninfoPublish_globalChanged(val: any, oldVal: any): void {
    if (val === false && this.commandOptionSelected === 'infoPublish')
      this.selectCommandOption('infoPublish')
  }

  @Watch('planModel_global')
  onplanModel_globalChanged(val: any, oldVal: any): void {
    if (val === false && this.commandOptionSelected === 'prePlan')
      this.selectCommandOption('prePlan')
  }

  @Watch('eventDeal_global')
  oneventDeal_globalChanged(val: any, oldVal: any): void {
    if (val === false && this.commandOptionSelected === 'emergency')
      this.selectCommandOption('emergency')
  }

  @Watch('commandOptionSelected')
  oncommandOptionSelectedChanged(val: any, oldVal: any): void {
    if (val === 'prePlan')
      this.togglePlanModel_global(true)
    if (val !== 'prePlan')
      this.togglePlanModel_global(false)

    if (val === 'infoPublish')
      this.toggleInfoPublish_global(true)
    if (val !== 'infoPublish')
      this.toggleInfoPublish_global(false)

    if (val === 'emergency')
      this.toggleEventDeal_global(true)
    if (val !== 'emergency')
      this.toggleEventDeal_global(false)

    if (val === 'shipManage')
      this.commandView = shipManage
    if (val !== 'shipManage')
      this.commandView = null
  }

  @Watch('firstTierMenuSelected')
  onFirstTierMenuSelectedChange(val: 'disaster' | 'monitor' | 'command' | 'info' | null, oldVal): void {
    if (val !== 'disaster') {
      // this.disasterView = null
      // this.disasterOptionSelected = null
    }
    if(val === 'info') 
      this.toggleBasicInfoPopup_global(true)
    if(val !== 'info')
      this.toggleBasicInfoPopup_global(false)

    if(oldVal === 'disaster') {
      if (this.disasterOptionSelected)
        this.selectDisasterOption(this.disasterOptionSelected)
    }
    if (oldVal === 'monitor') {
      if(this.monitorOptionSelected.video)
        this.selectMonitorOption('video')
      if(this.monitorOptionSelected.phone)
        this.selectMonitorOption('phone')
      if(this.monitorOptionSelected.water)
        this.selectMonitorOption('water')
      if(this.monitorOptionSelected.ocean)
        this.selectMonitorOption('ocean')
      if(this.monitorOptionSelected.weather)
        this.selectMonitorOption('weather')
    }
    if(oldVal === 'command') {
      if (this.commandOptionSelected)
        this.selectCommandOption(this.commandOptionSelected)
    }
  }

  @Watch('disasterOptionSelected')
  onDisasterOptionChange(val: 'tide' | 'rain' | 'torrent' | 'waterLog' | 'thunder' | 'weather' | null): void {
    if (val === null) {
      this.disasterView = null
      return
    }

    switch (val) {
      case 'tide':
        this.disasterView = tideMonitor
        this.tideSeledVar = 'wind'
        break
      case 'rain':
        this.disasterView = rainMonitor
        this.tideSeledVar = 'rain'
        break
      case 'thunder': 
        this.disasterView = ThunderMonitor
        break
      case 'weather':
        this.disasterView = weatherForecast
        break
      default:
        this.disasterView = null
        break
    }
  }
}

interface MonitorOption {
  phone: boolean,
  video: boolean,
  water: boolean,
  ocean: boolean,
  weather: boolean,
  tide: boolean
}