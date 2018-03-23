export class State {
  region: any = {
    cityId: 15,
    cityName: '揭阳',
    countyId: null,
    countyName: '',
    type: 'city'
  }
  zmapLayer: 'tianditu' | 'satillite' | 'terrain' | 'business' = 'tianditu'
  zmapViewer: any = { center: [], zoom: 0 }
  popupStatus: any = {
    phoneLive: false,             // 视频直播
    disasterImitate: false,       // 灾情模拟
    modelResult: false,           // 模式分析
    shipManage: false,            // 渔船管理
    targetRelease: false,         // 靶向发布
    rescueLib: false,             // 救援库
    expertLib: false,             // 专家库
    infoSearch: false,            // 信息检索
    routeNav: false,              // 路线导航
    
    weatherForecast: false,       // 实况监测 - 天气推演
    windPicking: false,           // 实况监测 - 天气推演 - 格点风场
    rainPicking: false,           // 实况监测 - 天气推演 - 降雨
    typhPointEffect: false,       // 实况监测 - 气象监测 - 台风风圈
    stationLiveDetail: false,     // 实况监测 - 气象监测 - 站点实况
    swanProduct: false,           // 实况监测 - 气象监测 - 气象产品监测
    waterMonitorDetail: false,    // 实况监测 - 水文监测
    torrentDetail: false,         // 实况监测 - 灾害监测 - 山洪
    waterlogDetail: false,        // 实况监测 - 灾害监测 - 内涝
    geolDetail: false,            // 实况监测 - 灾害监测 - 地质灾害
    forestDetail: false,          // 实况监测 - 灾害监测 - 森林火险
    detailName: false,            // 名称窗口
    videoDetail: false,           // 视频监控 - 详细信息
    videoSceen: false,            // 视频监控 - 视频全屏
    geographyDetail: false,       // 基础信息 - 详细信息

    alarmMonitorDetail: false,     // 自动预警 - 报警监控 - 山洪、内涝、地质灾害
  }
  stationLiveDetailInfo: any = {}    // 站点实况
  stationColorBar: string = ''       // 站点实况 - 颜色条
  detailNameInfo: any = {}           // 名称窗口
  waterMonitorDetailInfo: any = {}   // 水库河流
  disasterDetailInfo: any = {}       // 灾害监测 - 山洪 | 内涝 | 地质灾害
  videoDetailInfo: any = {}          // 视频监控
  geoDetailInfo: any = {}            // 基础信息 - 详细数据
  geoDetailPoint: any = {}           // 基础信息 - 点数据
  geoDetailType: number = 0          // 基础信息 - 数据类型
  windPickingValue: any = {}         // 天气推演 - 格点风场
  rainPickingValue: any = {}         // 天气推演 - 降雨
  refreshPlan: boolean = false       // 应急预案 - true时刷新右下预案状态
  refreshOnlinePlan: boolean = false // 应急预案 - true时刷新应急预案状态
  dealPlanInfo: any = {}             // 应急处置 - 传递给应急预案的数据
  colorTable: any = {                // 颜色条
    isColorDelete: Math.random(),
    isColorAdd: Math.random(),
    deleteColorType: '',
    colorTypeData: {}
  }
  emergencyMonitor: any = {         // 自动预警
    onlinePlan: false,
    alarmMonitor: false,
  }
  alarmTyphTsid = {                 // 报警监控 - 台风id （选中时打开台风面板）
    flag: false,
    tsid: 0
  }
  alarmMonitorDetail: any = {}      // 报警监控 - 山洪、内涝、地质灾害

  // 台风
  disasterType: string | null = null
  tidemodel: TideModel = new TideModel()
  mouseOverPopup: boolean = false
  matchingPopup: boolean = false
  grapesPopup: boolean = false
  clickIndex: number | null = null
  clickPos: any = {
    x: 0,
    y: 0
  }
  isClickingLastPoint: boolean = false
  mouseOverPos: object = {}
  mouseOverData: object = {}
  mouseOverName: object = {}
  indexChanged: number = new Date().getTime()
  similarTyphData: any = {}
  isMouseOverPoint: boolean = false
  typhPointEffect: any = {}     // 风圈影响
}

class TideModel {
  timelineStatus: 'search' | 'detail' | 'history' = 'search'
  currentYear: number | null = null
  currentTyphName: string | null = null
  typhSelected: string | null = null
  containedTyphData: Array<any> = []
}