import {
  TOGGLE_PLAN_MODEL,

  INIT_TEMP_NAMES,
  INIT_RELATEORGS,
  INIT_DEPS,
  INIT_TYPES,
  INIT_ADD_DUITES,
  INIT_LEVELS,
  INIT_TEMPLATE,
  INIT_DUTIES,
  TOGGLE_DUTY,
  DELETE_DUTY,
  ADD_NEW_DUTY,
  TOGGLE_TEMP_DUTY,
  DELETE_TEMP_DUTY,
  DO_REFRESH_PLAN,
  
  INIT_NEW_TEMPLATE,
  TOGGLE_NEW_TEMPLATE,
} from '../mutation-types'

export class State {
  planModel: boolean = false               //在线预案窗口显示

  addTempPopup: boolean = false           //false 选中启动预案  true 选中预案库
  tempNames: any = {}                     //所有模板名称                   
  selectedTempNameKey: string = null      //当前选择模板名称key
  template: any = {}                      //当前模板
  types: Array<string> = []               //预案类型
  allLevels: Array<number> = [1,2,3,4]    //所有预案等级
  levels: any = null                      //当前模板预案等级
  relateorgs: any = {}                    //部门单位
  influences: any = {}                    //单位类型 
  allDuties: any = null                   //所有工作备忘
  duties: any = null                      //当前模板工作备忘
  currentDuties: any = null               //当前工作备忘  //包含手动新增

  refreshPlan: any = false                 //true时刷新当前预案状态
  refreshOnlinePlan: any = false

  //预案在线
  isEmergencyPlanOn: boolean = false
  // 信息发布
  isInfoPublishOn: boolean = false
  //应急处理
  isEventDealOn: boolean = false

  // 水文监控弹窗
  isWaterLevelPanelDisplay: boolean = false
  waterLevelData: object = {}
  waterLevelPosition: object = {}
  waterLevelTablePopup: boolean = false
}