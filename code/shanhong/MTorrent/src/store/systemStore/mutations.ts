import { Mutation, MutationTree } from 'vuex'
import { State } from './state'
import Module from '../../interface/Module'

export const storeResetVuex = (state: State) => {
  for (let i in state.popupStatus) {
    state.popupStatus[i] = false
  }
  state.colorbar = {}
  state.swanMessageTip = {}
  state.warningMsgData = {}
}

export const storeUserInfo = (state: State, data: any) => {
  state.userInfo = { ...data }
}

export const storeAdministrator = (state: State, action: boolean) => {
  state.isAdministrator = action
}

export const storeModuleList = (state: State, data: Module[]) => {
  state.moduleList = data
}

export const storeZmapViewer = (state: State, data: any) => {
  state.zmapViewer = { ...data }
}

export const storePopupStatus = (state: State, data: { key: string, action: boolean }) => {
  state.popupStatus[data.key] = data.action
}

export const storeCappiProfile = (state: State, data: { SLat: boolean, SLon: boolean, ELat: boolean, ELon: boolean }) => {
  state.cappiProfile.SLat = data.SLat
  state.cappiProfile.SLon = data.SLon
  state.cappiProfile.ELat = data.ELat
  state.cappiProfile.ELon = data.ELon
}

export const storeStationRealInfo = (state: State, data: any) => {
  state.stationRealInfo = data ? { ...data } : null
}

export const storeStationTableInfo = (state: State, data: any) => {
  state.stationTableInfo = { ...data }
}

export const storehydrologyRealInfo = (state: State, data: any) => {
  state.hydrologyRealInfo = { ...data }
}

export const storehydrologyChartInfo = (state: State, data: any) => {
  state.hydrologyChartInfo = { ...data }
}

export const storehydrologyTableType = (state: State, key: 'river' | 'reservoirs') => {
  state.hydrologyTableType = key
}

export const storeRiskPointInfo = (state: State, data: any) => {
  state.riskPointInfo = { ...data }
}

export const storeRiskTypeInfo = (state: State, data: any) => {
  state.riskTypeInfo = { ...data }
}

export const storeColorbar = (state: State, data: { key: string, type: string }) => {
  if (data.type === 'add') {
    if (state.colorbar[data.key])
      state.colorbar[data.key]++
    else
      state.colorbar[data.key] = 1
    if (!state.popupStatus.ColorBar)
      state.popupStatus.ColorBar = true
  } else if (data.type === 'remove') {
    state.colorbar[data.key]--
    if (!state.colorbar[data.key])
      delete state.colorbar[data.key]
    if (!Object.keys(state.colorbar).length)
      state.popupStatus.ColorBar = false
  }
  state.colorbar = { ...state.colorbar }
}

export const storeSwanMessageTip = (state: State, data: { key: string, time: string, hasData: boolean, type: string }) => {
  if (data.type === 'add') {
    state.swanMessageTip[data.key] = { time: data.time, hasData: data.hasData }
    if (!state.popupStatus.SwanMessageTip)
      state.popupStatus.SwanMessageTip = true
  } else if (data.type === 'remove') {
    if (state.swanMessageTip[data.key])
      delete state.swanMessageTip[data.key]
    if (!Object.keys(state.swanMessageTip).length)
      state.popupStatus.SwanMessageTip = false
  }
  state.swanMessageTip = { ...state.swanMessageTip }
}

export  const storeWarningMsgDatas = (state: State, data: any) => {
  state.warningMsgData = data ? [ ...data ] : null
}

export  const storeRainColorDatas = (state: State, data: any) => {
  state.rainColorData = data ? { ...data } : {}
}


export const stoReresetThresholdp = (state: State, key: string) => {
  state.resetThreshold[key] = !state.resetThreshold[key]
}


export default <MutationTree<State>> {
  storeResetVuex,
  storeUserInfo,
  storeAdministrator,
  storeModuleList,
  storeZmapViewer,
  storePopupStatus,
  storeCappiProfile,
  storeStationRealInfo,
  storeStationTableInfo,
  storehydrologyRealInfo,
  storehydrologyChartInfo,
  storehydrologyTableType,
  storeColorbar,
  storeSwanMessageTip,
  stoReresetThresholdp,
  storeWarningMsgDatas,
  storeRainColorDatas,
  storeRiskPointInfo,
  storeRiskTypeInfo,
}
