import {

} from '../mutation-types'

export class State {
  systemTitle: string = "遂溪县突发应急智能调度指挥系统"

  cityId: number = 24
  cityName: string = '湛江'
  countyId: number = 58
  countyName: string = '遂溪'
  regionType: string = 'county'

  loginPage: boolean = true
  loginUser: any = {}

  isTideMonitorOn: boolean = false

  // 全局日期对象
  datetime: Date = new Date()

  // 模式部分
  disasterType: string | null = null
  grapesElementTyph: any = null

  // 台风需要的部分
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
  mouseOverPos: object = null
  mouseOverData: object = null
  mouseOverName: object = null
  indexChanged: number = new Date().getTime()

  similarTyphData: any = {}
  isMouseOverPoint: boolean = false

  // zearth
  blurControl: number = (new Date()).getTime() //控制全局input元素焦点

  // 操作提示，错误提示
  oprateTip: boolean = false
  oprateText: string = ''

  isColorIndicatorDisplay: boolean = false

  //直播监控
  isPhoneMonitorOn: boolean = false
  //海流监控
  isOceanMonitorOn: boolean = false
  //气象监控
  isWeatherMonitorOn: boolean = false
  //天气推演面板
  isWeatherForecastPopupOn: boolean = false
  selectedWeatherForecastOpt: string = null
  //用于管理
  isUserManagementOn: boolean = false
  //潮汛表
  isTideTableOn: boolean = false
  //雷达云图
  isProgBarOn: boolean = false
  progBarElement: string = null
  //雷暴跟踪
  isTrackingResultOn: boolean = false
  trackingResult: any = null
  trackingTime: string = null
  trackingDatetime: Date = new Date()
  //视频监控
  isVideoAddressPopupOn: boolean = false
  videoAddress: any = {
    address: '',
    x: 0,
    y: 0,
  }
  isVideoMonitorPopupOn: boolean = false
  videoInfo: any = null
  isScreenVideoOn: boolean = false
  screenVideoUrl: string = null
  //水文监控
  isWaterNamePopupOn: boolean = false
  waterLevelName: any = {}
  // 台风监控
  isShowCurrentTy: boolean = false
  isClickedTy: boolean = false
  isNeedMountedTy: boolean = true

  // 强制关闭模型分析结果
  forceCloseModelResult: boolean = false

  // 天气推演 风场控制
  windValue: { dir: number, val: number, x: number, y: number } = null
  gridValue: { titleText: string, valText: string, x: number, y: number } = null

  // 气象监控 时间条
  weatherElementTime: any = {}

  // 洋流监控插值
  oceanPickingValue: any = null
}

class TideModel {
  timelineStatus: 'search' | 'detail' | 'history' = 'search'
  currentYear: number | null = null
  currentTyphName: string | null = null
  typhSelected: string | null = null
  containedTyphData: Array<any> = []
}