import { Store, ActionTree, ActionContext } from 'vuex'
import { State } from './state'
import Module from '../../interface/Module'

export const storeResetVuex_global = (store: ActionContext<State, any>) => {
  store.commit('storeResetVuex')
}

export const storeUserInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeUserInfo', data)
}

export const storeAdministrator_global = (store: ActionContext<State, any>, action: boolean) => {
  store.commit('storeAdministrator', action)
}

export const storeModuleList_global = (store: ActionContext<State, any>, data: Array<Module>) => {
  store.commit('storeModuleList', data)
}

export const storeZmapViewer_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeZmapViewer', data)
}

export const storePopupStatus_global = (store: ActionContext<State, any>, data: { key: string, action: boolean }) => {
  store.commit('storePopupStatus', data)
}

export const storeCappiProfile_global = (store: ActionContext<State, any>, data: { SLat: boolean, SLon: boolean, ELat: boolean, ELon: boolean }) => {
  store.commit('storeCappiProfile', data)
}

export const storeStationRealInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeStationRealInfo', data)
}

export const storeStationTableInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeStationTableInfo', data)
}

export const storehydrologyRealInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storehydrologyRealInfo', data)
}

export const storehydrologyChartInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storehydrologyChartInfo', data)
}

export const storehydrologyTableType_global = (store: ActionContext<State, any>, key: 'river' | 'reservoirs') => {
  store.commit('storehydrologyTableType', key)
}

export const storeColorbar_global = (store: ActionContext<State, any>, data: { key: string, type: string }) => {
  store.commit('storeColorbar', data)
}

export const storeSwanMessageTip_global = (store: ActionContext<State, any>, data: { key: string, time: string, hasData: boolean, type: string }) => {
  store.commit('storeSwanMessageTip', data)
}

export const storeResetThresholdp_global = (store: ActionContext<State, any>, key: string) => {
  store.commit('stoReresetThresholdp', key)
}

export const storeWarningMsgDatas_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeWarningMsgDatas', data)
}

export const storeRainColorDatas_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeRainColorDatas', data)
}

export const storeRiskPointInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeRiskPointInfo', data)
}
export const storeRiskTypeInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeRiskTypeInfo', data)
}

export default <ActionTree<State, any>> {
  storeResetVuex_global,
  storeUserInfo_global,
  storeAdministrator_global,
  storeModuleList_global,
  storeZmapViewer_global,
  storePopupStatus_global,
  storeCappiProfile_global,
  storeStationRealInfo_global,
  storeStationTableInfo_global,
  storehydrologyRealInfo_global,
  storehydrologyChartInfo_global,
  storehydrologyTableType_global,
  storeColorbar_global,
  storeSwanMessageTip_global,
  storeResetThresholdp_global,
  storeWarningMsgDatas_global,
  storeRainColorDatas_global,
  storeRiskPointInfo_global,
  storeRiskTypeInfo_global,
}
