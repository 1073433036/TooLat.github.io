import Module from '../../interface/Module'

export class State {
  userInfo: any = {}
  moduleList: Array<Module> = []
  isAdministrator: boolean = false
  zmapViewer: any = { center: [], zoom: 0 }     // 设置完成 则地图边界加载完毕 watch以添加初始化数据
  popupStatus: any = {
    CappiProfile: false,
    WindCorridor: false,
    StationReal: false,
    StationTable: false,
    HydrologyReal: false,
    HydrologyChart: false,
    HydrologyTable: false,
    thresholdSetting: false,
    StationSearch: false,
    ColorBar: false,
    SwanMessageTip: false,
    warningMsgTable: false,
    rainColorsBar: false,    //降雨数值预报颜色条
    RiskPoint: false, //灾害点
    RiskType: false,  // 应急响应 类型信息
  }
  cappiProfile: any = { SLat: null, SLon: null, ELat: null, ELon: null }      // 雷达剖面
  stationRealInfo: any = {}      // 当前站点数据
  stationTableInfo: any = {}     // 站点表格数据
  hydrologyRealInfo: any = {}    // 水文站点数据
  hydrologyChartInfo: any = {}   // 水文站点echart数据
  hydrologyTableType: 'river' | 'reservoirs' = 'river'    // 水文表格类型
  colorbar: any = {}             // 颜色条
  swanMessageTip: any = {}       // 提示框
  resetThreshold: any = {        // 重设阈值
    RainWarning: false,
    QPFWarning: false,
    CappiWarning: false,
    WindWarning: false
  }
  warningMsgData: any = []  //预警信息的列表数据

  riskPointInfo: any = {} //灾害点信息数据

  riskTypeInfo: any = {} //应急响应 类型信息


  rainColorData: {
    title?: string,
    colorsObj?: any
  } = {} //雨颜色数据(title, colors数组, 颜色代表数值)

}
