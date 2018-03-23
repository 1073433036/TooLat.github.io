import { Getter, GetterTree } from "vuex";
import { State } from './state'

export function typhTimelineStatus_global(state: State): string {
  return state.tidemodel.timelineStatus
}

export function region_global(state: State): any {
  return {
    cityId: state.cityId,
    cityName: state.cityName,
    countyName: state.countyName,
    countyId: state.countyId,
    type: state.regionType
  }
}

export function systemTitle_global(state: State): string {
  return state.systemTitle
}

export function loginPage_global(state: State): boolean {
  return state.loginPage;
}

export function loginUser_global(state: State): string {
  return state.loginUser;
}

export function typhCurrentYear_global(state: State): number {
  return state.tidemodel.currentYear
}

export function datetime_global(state: State): Date {
  return state.datetime
}

export function trackingDatetime_global(state: State): Date {
  return state.trackingDatetime
}

export function blurControl_global(state: State): number {
  return state.blurControl
}

export function typhSelected_global(state: State): string {
  return state.tidemodel.typhSelected
}

export function containedTyph_global(state: State): Array<any> {
  return state.tidemodel.containedTyphData
}

export function disasterTypeSelected_global(state: State): string {
  return state.disasterType
}

export function typhMouseOverPos_global(state: State) {
  return state.mouseOverPos
}

export function typhMouseOverData_global(state: State) {
  return state.mouseOverData
}

export function typhMouseOverName_global(state: State) {
  return state.mouseOverName
}

export function typhMouseOverPopup_global(state: State): boolean {
  return state.mouseOverPopup
}

export function typhSelectedName_global(state: State): string {
  return state.tidemodel.currentTyphName
}

export function typhGrapesPopup_global(state: State): boolean {
  return state.grapesPopup
}

export function typhClickPointIndex_global(state: State): number {
  return state.clickIndex
}

export function isClickingLastTyphPoint_global(state: State): boolean {
  return state.isClickingLastPoint
}

export function typhClickingPos_global(state: State): any {
  return state.clickPos
}

export function typhClickIndexManulChanged_global(state: State): number {
  return state.indexChanged
}

export function oprateTipPopup_global(state: State): boolean {
  return state.oprateTip
}

export function oprateTipText_global(state: State): string {
  return state.oprateText
}

export function isColorIndicatorDisplay_global(state: State): any {
  return state.isColorIndicatorDisplay
}

export function isPhoneMonitorOn_global(state: State): any {
  return state.isPhoneMonitorOn
}

export function isOceanMonitorOn_global(state: State): any {
  return state.isOceanMonitorOn
}

export function isWeatherMonitorOn_global(state: State): any {
  return state.isWeatherMonitorOn
}

export function isWeatherForecastPopupOn_global(state: State): any {
  return state.isWeatherForecastPopupOn
}

export function selectedWeatherForecastOpt_global(state: State): any {
  return state.selectedWeatherForecastOpt
}

export function isUserManagementOn_global(state: State): any {
  return state.isUserManagementOn;
}

export function whetherDisplayWindValuePanel_global(state: State): any {
  if (state.windValue === null)
    return false
  else
    return true
}

export function windPickingValue_global(state: State): any {
  return state.windValue
}

export function whetherDisplayGridValuePanel_global(state: State): any {
  if (state.gridValue === null)
    return false
  else
    return true
}

export function gridPickingValue_global(state: State): any {
  return state.gridValue
}

export function isTideMonitorOn_global(state: State): any {
  return state.isTideMonitorOn
}

export function isCloseModelResult_global (state: State): any {
  return state.forceCloseModelResult
}

export function isTideTableOn_global (state: State): any {
  return state.isTideTableOn
}

export function isProgBarOn_global (state: State): boolean {
  return state.isProgBarOn
}

export function progBarElement_global (state: State): string {
  return state.progBarElement
}

export function isTrackingResultOn_global (state: State): boolean {
  return state.isTrackingResultOn
}

export function getTrackingResult_global (state: State): any {
  return state.trackingResult
}

export function getTrackingTime_global (state: State): string {
  return state.trackingTime
}

export function isVideoMonitorPopupOn_global (state: State): boolean {
  return state.isVideoMonitorPopupOn
}

export function isVideoAddressPopupOn_global (state: State): boolean {
  return state.isVideoAddressPopupOn
}

export function getVideoInfo_global (state: State): any {
  return state.videoInfo
}

export function isScreenVideoOn_global (state: State): any {
  return state.isScreenVideoOn
}

export function screenVideoUrl_global (state: State): any {
  return state.screenVideoUrl
}

export function getVideoAddress_global (state: State): any {
  return state.videoAddress
}

export function getWaterNamePopupOn_global (state: State): boolean {
  return state.isWaterNamePopupOn
}

export function getWaterLevelName_global (state: State): any {
  return state.waterLevelName
}

export function isShowCurrentTy_global (state: State): any {
  return state.isShowCurrentTy
}

export function isClickedTy_global (state: State): any {
  return state.isClickedTy
}

export function isNeedMountedTy_global (state: State): any {
  return state.isNeedMountedTy
}

export function weatherElementTime_global (state: State): any {
  return state.weatherElementTime
}

export function similarTyphData_global (state: State): any {
  return state.similarTyphData
}

export function isMouseOverPoint_global (state: State): any {
  return state.isMouseOverPoint
}

export function oceanPickingValue_global (state: State): any {
  return state.oceanPickingValue
}

export default <GetterTree<State, any>>{
  region_global,
  systemTitle_global,
  loginPage_global,
  loginUser_global,
  typhTimelineStatus_global,
  typhCurrentYear_global,
  datetime_global,
  trackingDatetime_global,
  blurControl_global,
  typhSelected_global,
  containedTyph_global,
  disasterTypeSelected_global,
  typhMouseOverData_global,
  typhMouseOverName_global,
  typhMouseOverPos_global,
  typhMouseOverPopup_global,
  typhSelectedName_global,
  typhGrapesPopup_global,
  typhClickPointIndex_global,
  isClickingLastTyphPoint_global,
  typhClickingPos_global,
  typhClickIndexManulChanged_global,
  oprateTipPopup_global,
  oprateTipText_global,
  isColorIndicatorDisplay_global,
  isPhoneMonitorOn_global,
  isOceanMonitorOn_global,
  isWeatherMonitorOn_global,
  isWeatherForecastPopupOn_global,
  selectedWeatherForecastOpt_global,
  isUserManagementOn_global,
  windPickingValue_global,
  whetherDisplayWindValuePanel_global,
  isTideMonitorOn_global,
  gridPickingValue_global,
  whetherDisplayGridValuePanel_global,
  isCloseModelResult_global,
  isTideTableOn_global,
  isProgBarOn_global,
  progBarElement_global,
  isTrackingResultOn_global,
  getTrackingResult_global,
  getTrackingTime_global,
  isVideoMonitorPopupOn_global,
  isVideoAddressPopupOn_global,
  getVideoInfo_global,
  getVideoAddress_global,
  getWaterNamePopupOn_global,
  getWaterLevelName_global,
  isScreenVideoOn_global,
  screenVideoUrl_global,
  isShowCurrentTy_global,
  isClickedTy_global,
  isNeedMountedTy_global,
  weatherElementTime_global,
  similarTyphData_global,
  isMouseOverPoint_global,
  oceanPickingValue_global,
}