import { Store, ActionTree, ActionContext } from 'vuex'
import { State } from './state'

export const storeResetVuex_global = (store: ActionContext<State, any>) => {
  store.commit('storeResetVuex')
}

export const storeZmapLayer_global = (store: ActionContext<State, any>, layer: any) => {
  store.commit('storeZmapLayer', layer)
}

export const storeZmapViewer_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeZmapViewer', data)
}

export const storePopupStatus_global = (store: ActionContext<State, any>, data: { key: string, action: boolean }) => {
  store.commit('storePopupStatus', data)
}

export const storestationLiveDetailInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storestationLiveDetailInfo', data)
}

export const storestationColorBar_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storestationColorBar', data)
}

export const storedetailNameInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storedetailNameInfo', data)
}

export const storeWaterMonitorDetailInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeWaterMonitorDetailInfo', data)
}

export const storeDisasterDetailInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeDisasterDetailInfo', data)
}

export const storeVideoDetailInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeVideoDetailInfo', data)
}

export const storeGeoDetailInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeGeoDetailInfo', data)
}

export const storeGeoDetailPoint_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeGeoDetailPoint', data)
}

export const storeGeoDetailType_global = (store: ActionContext<State, any>, type: number) => {
  store.commit('storeGeoDetailType', type)
}

export const storeWindPickingValue_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeWindPickingValue', data)
}

export const storerainPickingValue_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storerainPickingValue', data)
}

export const doRefreshPlan_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeRefreshPlan', data)
}

export const doRefreshOnlinePlan_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeRefreshOnlinePlan', data)
}

export const storeDealPlanInfo_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeDealPlanInfo', data)
}

export const storeColorTable_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeColorTable', data)
}

export const storeEmergencyMonitor_global = (store: ActionContext<State, any>, data: { key: string, action: boolean }) => {
  store.commit('storeEmergencyMonitor', data)
}

export const storeAlarmTyphFlag_global = (store: ActionContext<State, any>) => {
  store.commit('storeAlarmTyphFlag')
}

export const storeAlarmTyphTsid_global = (store: ActionContext<State, any>, tsid: number) => {
  store.commit('storeAlarmTyphTsid', tsid)
}

export const storeAlarmMonitorDetail_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeAlarmMonitorDetail', data)
}


export const selectDisasterType_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('selectDisasterType', data)
}

export const toggleTyphTimelineStatus_global = (store: ActionContext<State, any>, status: string) => {
  store.commit('toggleTyphTimelineStatus', status)
}

export const changeTyphCurrentYear_global = (store: ActionContext<State, any>, year: number) => {
  store.commit('changeTyphCurrentYear', year)
}

export const changeTyphCurrentName_global = (store: ActionContext<State, any>, name: string) => {
  store.commit('changeTyphCurrentName', name)
}

export const storeTyphData_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeTyphData', data)
}

export const selectTyph_global = (store: ActionContext<State, any>, tsId: string) => {
  store.commit('selectTyph', tsId)
}

export const deleteHistTyph_global = (store: ActionContext<State, any>, id: any) => {
  store.commit('deleteHistTyph', id)
}

export const storeTyphPointEffect_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeTyphPointEffect', data)
}

export default <ActionTree<State, any>> {
  storeResetVuex_global,
  storeZmapLayer_global,
  storeZmapViewer_global,
  storePopupStatus_global,
  storestationLiveDetailInfo_global,
  storestationColorBar_global,
  storedetailNameInfo_global,
  storeWaterMonitorDetailInfo_global,
  storeDisasterDetailInfo_global,
  storeVideoDetailInfo_global,
  storeGeoDetailInfo_global,
  storeGeoDetailPoint_global,
  storeGeoDetailType_global,
  storeWindPickingValue_global,
  storerainPickingValue_global,
  doRefreshPlan_global,
  doRefreshOnlinePlan_global,
  storeDealPlanInfo_global,
  storeColorTable_global,
  storeEmergencyMonitor_global,
  storeAlarmTyphFlag_global,
  storeAlarmTyphTsid_global,
  storeAlarmMonitorDetail_global,

  selectDisasterType_global,
  toggleTyphTimelineStatus_global,
  changeTyphCurrentYear_global,
  changeTyphCurrentName_global,
  storeTyphData_global,
  selectTyph_global,
  deleteHistTyph_global,
  storeTyphPointEffect_global,
}