import { Store, ActionTree, ActionContext } from "vuex";
import { State } from './state';
import * as types from '../mutation-types'

export function storeUserLogin_global (store: ActionContext<State, any>, user) {
  store.commit(types.STORE_LOGIN_USER, user);
}

export function toggleLoginPage_global (store: ActionContext<State, any>, action) {
  store.commit(types.TOGGLE_LOGIN_PAGE, action);
}

export function selectDisasterType_global(store: ActionContext<State, any>, type: string | null) {
  store.commit('selectDisasterType', type)
}

export function toggleTyphTimelineStatus_global(store: ActionContext<State, any>, status: string) {
  store.commit('toggleTyphTimelineStatus', status)
}

export function changeTyphCurrentYear_global(store: ActionContext<State, any>, year: number) {
  store.commit('changeTyphCurrentYear', year)
}

export function changeDatetime_global(store: ActionContext<State, any>, date: Date) {
  store.commit('changeDatetime', date)
}

export function changeTrackingDatetime_global(store: ActionContext<State, any>, date: Date) {
  store.commit('changeTrackingDatetime', date)
}

export function activeBlurControl_global(store: ActionContext<State, any>) {
  store.commit('activeBlurControl')
}

export function selectTyph_global(store: ActionContext<State, any>, tsId: string) {
  store.commit('selectTyph', tsId)
}

export function storeTyphData_global(store: ActionContext<State, any>, data: any) {
  store.commit('storeTyphData', data)
}

export function changeTyphCurrentName_global (store: ActionContext<State, any>, name: string) {
  store.commit('changeTyphCurrentName', name)
}

export function storeTyphMouseOverData_global (store: ActionContext<State, any>, data) {
  store.commit('storeTyphMouseOverData', data)
}

export function storeTyphMouseOverPos_global (store: ActionContext<State, any>, pos) {
  store.commit('storeTyphMouseOverPos', pos)
}

export function storeTyphMouseOverName_global (store: ActionContext<State, any>, action) {
  store.commit('storeTyphMouseOverName', action)
}

export function toggleTyphMouseOverPopup_global (store: ActionContext<State, any>, action) {
  store.commit('toggleTyphMouseOverPopup', action)
}

export function deleteHistTyph_global (store: ActionContext<State, any>, id) {
  store.commit('deleteHistTyph', id)
}

export function toggleTyphGrapesPopup_global (store: ActionContext<State, any>, action) {
  store.commit('toggleTyphGrapesPopup', action)
}

export function changeTyphClickPointIndex_global (store: ActionContext<State, any>, index) {
  store.commit('changeTyphClickPointIndex', index)
}

export function toggleIsClickingLastPoint_global (store: ActionContext<State, any>, action) {
  store.commit('toggleIsClickingLastPoint', action)
}

export function storeTyphClickingPos_global (store: ActionContext<State, any>, pos) {
  store.commit('storeTyphClickingPos', pos)
}

export function manulChangeTyphClickIndex_global (store: ActionContext<State, any>) {
  store.commit('manulChangeTyphClickIndex')
}

export function toggleOprateTip_global (store: ActionContext<State, any>, action) {
  store.commit('toggleOprateTip', action)
}

export function toggleIsColorIndicatorDisplay_global (store: ActionContext<State, any>, action) {
  store.commit('toggleIsColorIndicatorDisplay', action)
}

export function togglePhoneMonitor_global (store: ActionContext<State, any>) {
  store.commit('togglePhoneMonitor')
}

export function toggleOceanMonitor_global (store: ActionContext<State, any>) {
  store.commit('toggleOceanMonitor')
}

export function toggleWeatherMonitor_global (store: ActionContext<State, any>) {
  store.commit('toggleWeatherMonitor')
}

export function toggleWeatherForecastPopup_global (store: ActionContext<State, any>, action) {
  store.commit('toggleWeatherForecastPopup', action)
}

export function selectWeatherForecastOpt_global (store: ActionContext<State, any>, type) {
    store.commit('selectWeatherForecastOpt', type)
}

export function toggleUserManagement_global (store: ActionContext<State, any>, action) {
  store.commit('toggleUserManagement', action)
}

export function storeWindPickingValue_global (store: ActionContext<State, any>, data) {
  store.commit('storeWindPickingValue', data)
}

export function storeGridPickingValue_global (store: ActionContext<State, any>, data) {
  store.commit('storeGridPickingValue', data)
}


export function storeTideMonitorState_global (store: ActionContext<State, any>, data) {
  store.commit('storeTideMonitorState', data)
}

export function forceCloseModelResult_global (store: ActionContext<State, any>) {
  store.commit('forceCloseModelResult')
}

export function toggleTideTable_global (store: ActionContext<State, any>) {
  store.commit('toggleTideTable')
}

export function toggleProgBar_global (store: ActionContext<State, any>, action) {
  store.commit('toggleProgBar', action)
}

export function changeProgBarElement_global (store: ActionContext<State, any>, ele) {
  store.commit('changeProgBarElement', ele)
}

export function toggleTrackingResult_global (store: ActionContext<State, any>, action) {
  store.commit('toggleTrackingResult', action)
}

export function changeTrackingResult_global (store: ActionContext<State, any>, data) {
  store.commit('changeTrackingResult', data)
}

export function changeTrackingTime_global (store: ActionContext<State, any>, time) {
  store.commit('changeTrackingTime', time)
}

export function toggleVideoMonitorPopup_global (store: ActionContext<State, any>, action) {
  store.commit('toggleVideoMonitorPopup', action)
}

export function toggleVideoAddressPopup_global (store: ActionContext<State, any>, action) {
  store.commit('toggleVideoAddressPopup', action)
}

export function changeVideoInfo_global (store: ActionContext<State, any>, info) {
  store.commit('changeVideoInfo', info)
}

export function changeVideoAddress_global (store: ActionContext<State, any>, obj) {
  store.commit('changeVideoAddress', obj)
}

export function toggleWaterNamePopup_global (store: ActionContext<State, any>, action) {
  store.commit('toggleWaterNamePopup', action)
}

export function changeWaterLevelName_global (store: ActionContext<State, any>, obj) {
  store.commit('changeWaterLevelName', obj)
}

export function toggleScreenVideo_global (store: ActionContext<State, any>, action) {
  store.commit('toggleScreenVideo', action)
}

export function changeScreenVideoUrl_global (store: ActionContext<State, any>, url) {
  store.commit('changeScreenVideoUrl', url)
}

export function toggleShowCurrentTy_global (store: ActionContext<State, any>, action) {
  store.commit('toggleShowCurrentTy', action)
}

export function toggleClickedTy_global (store: ActionContext<State, any>) {
  store.commit('toggleClickedTy')
}

export function  toggleisNeedMountedTy_global (store: ActionContext<State, any>, action) {
  store.commit('toggleisNeedMountedTy', action)
}

export function  changeWeatherEleTime_global (store: ActionContext<State, any>, element) {
  store.commit('changeWeatherEleTime', element)
}

export function storeSimilarTyphData_global (store: ActionContext<State, any>, action) {
  store.commit('storeSimilarTyphData', action)
}

export function toggleMouseOverPoint_global (store: ActionContext<State, any>, action) {
  store.commit('toggleMouseOverPoint', action)
}

export function storeOceanPickingValue_global (store: ActionContext<State, any>, action) {
  store.commit('storeOceanPickingValue', action)
}

export default <ActionTree<State, any>>{
  storeUserLogin_global,
  toggleLoginPage_global,
  selectDisasterType_global,
  toggleTyphTimelineStatus_global,
  changeTyphCurrentYear_global,
  changeDatetime_global,
  changeTrackingDatetime_global,
  activeBlurControl_global,
  selectTyph_global,
  storeTyphData_global,
  changeTyphCurrentName_global,
  toggleTyphMouseOverPopup_global,
  storeTyphMouseOverData_global,
  storeTyphMouseOverPos_global,
  storeTyphMouseOverName_global,
  deleteHistTyph_global,
  toggleTyphGrapesPopup_global,
  changeTyphClickPointIndex_global,
  toggleIsClickingLastPoint_global,
  storeTyphClickingPos_global,
  manulChangeTyphClickIndex_global,
  toggleOprateTip_global,
  toggleIsColorIndicatorDisplay_global,
  togglePhoneMonitor_global,
  toggleOceanMonitor_global,
  toggleWeatherMonitor_global,
  toggleWeatherForecastPopup_global,
  selectWeatherForecastOpt_global,
  toggleUserManagement_global,
  storeWindPickingValue_global,
  storeTideMonitorState_global,
  storeGridPickingValue_global,
  forceCloseModelResult_global,
  toggleTideTable_global,
  toggleProgBar_global,
  changeProgBarElement_global,
  toggleTrackingResult_global,
  changeTrackingResult_global,
  changeTrackingTime_global,
  toggleVideoMonitorPopup_global,
  toggleVideoAddressPopup_global,
  changeVideoInfo_global,
  changeVideoAddress_global,
  toggleWaterNamePopup_global,
  changeWaterLevelName_global,
  toggleScreenVideo_global,
  changeScreenVideoUrl_global,
  toggleShowCurrentTy_global,
  toggleClickedTy_global,
  toggleisNeedMountedTy_global,
  changeWeatherEleTime_global,
  storeSimilarTyphData_global,
  toggleMouseOverPoint_global,
  storeOceanPickingValue_global,
}