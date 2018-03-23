import { Getter, GetterTree } from 'vuex'
import { State } from './state'
import Module from '../../interface/Module'

export const userInfo_global = (state: State): any => state.userInfo

export const moduleList_global = (state: State): Array<Module> => state.moduleList

export const isAdministrator_global = (state: State): boolean => state.isAdministrator

export const zmapViewer_global = (state: State): any => state.zmapViewer

export const popupStatus_global = (state: State): any => state.popupStatus

export const cappiProfile_global = (state: State): any => state.cappiProfile

export const stationRealInfo_global = (state: State): any => state.stationRealInfo

export const stationTableInfo_global = (state: State): any => state.stationTableInfo

export const hydrologyRealInfo_global = (state: State): any => state.hydrologyRealInfo

export const hydrologyChartInfo_global = (state: State): any => state.hydrologyChartInfo

export const hydrologyTableType_global = (state: State): any => state.hydrologyTableType

export const colorbar_global = (state: State): any => state.colorbar

export const swanMessageTip_global = (state: State): any => state.swanMessageTip

export const resetThresholdp_global = (state: State): any => state.resetThreshold

export const swanWarningMsgDatas_global = (state: State): any => {
  return state.warningMsgData
}

export const rainColorDatas_global = (state: State): any => {
  return state.rainColorData
}

export const riskPointInfo_global = (state: State): any => {
  return state.riskPointInfo
}

export const riskTypeInfo_global = (state: State): any => {
  return state.riskTypeInfo
}


export default <GetterTree<State, any>> {
  userInfo_global,
  moduleList_global,
  isAdministrator_global,
  zmapViewer_global,
  popupStatus_global,
  cappiProfile_global,
  stationRealInfo_global,
  stationTableInfo_global,
  hydrologyRealInfo_global,
  hydrologyChartInfo_global,
  hydrologyTableType_global,
  colorbar_global,
  swanMessageTip_global,
  resetThresholdp_global,
  swanWarningMsgDatas_global,
  rainColorDatas_global,
  riskPointInfo_global,
  riskTypeInfo_global,
}
