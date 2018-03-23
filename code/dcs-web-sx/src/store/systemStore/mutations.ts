import { Mutation, MutationTree } from "vuex";
import { State } from "./state";

export function STORE_LOGIN_USER(state: State, user) {
  state.loginUser = user;
}

export function TOGGLE_LOGIN_PAGE(state: State, action) {
  state.loginPage = action;
}

export function selectDisasterType(state: State, type: string) {
  state.disasterType = type
}

export function toggleTyphTimelineStatus(state: State, status: 'search' | 'detail' | 'history') {
  state.tidemodel.timelineStatus = status
}

export function changeTyphCurrentYear(state: State, year: number) {
  state.tidemodel.currentYear = year
}

export function changeDatetime(state: State, date: Date) {
  state.datetime = new Date(date)
}

export function changeTrackingDatetime(state: State, date: Date) {
  state.trackingDatetime = new Date(date)
}

export function activeBlurControl(state: State) {
  state.blurControl = (new Date()).getTime()
}

export function selectTyph(state: State, tsId: string) {
  let ctnedHtyTyphData = state.tidemodel.containedTyphData
  if (ctnedHtyTyphData.length == 4) {
    let hasTyph = false     //判断tsId 是否已存在数组中
    for (let opt of ctnedHtyTyphData) {
      if (opt.tsId == tsId) {
        hasTyph = true
        break
      }
    }
    if (!hasTyph) {
      let index
      ctnedHtyTyphData.map((opt, i) => {
        if (!opt.isCurrentTyph && !index) {
          index = i
        }
      })
      ctnedHtyTyphData.splice(index, 1)
    }
  }
  
  state.tidemodel.typhSelected = tsId
}

export function changeTyphCurrentName(state: State, name: string) {
  state.tidemodel.currentTyphName = name
}

export function storeTyphData(state: State, data) {
  console.info(data)
  let containTyphExcludeCurrent = 0,
    currentTyphLength = 0
  for (let item of state.tidemodel.containedTyphData) {
    if (!item.isCurrentTyph) containTyphExcludeCurrent++
    else currentTyphLength++
  }
  if (containTyphExcludeCurrent === 4) {
    state.tidemodel.containedTyphData.splice(currentTyphLength - 1, 1)
  }
  state.tidemodel.containedTyphData.push(data)
}

export function storeTyphMouseOverData(state: State, data: any) {
  state.mouseOverData = data
}

export function storeTyphMouseOverPos(state: State, pos: any) {
  state.mouseOverPos = pos
}

export function storeTyphMouseOverName (state: State, action: any) {
  state.mouseOverName = action
}

export function toggleTyphMouseOverPopup(state: State, action: boolean) {
  state.mouseOverPopup = action
}

export function deleteHistTyph(state: State, id: string) {
  let ctnedHtyTyphData = state.tidemodel.containedTyphData
  for (let i in ctnedHtyTyphData) {
    if (ctnedHtyTyphData[i].tsId == id) {
      ctnedHtyTyphData.splice(Number(i), 1)
    }
  }
  if (id === state.tidemodel.typhSelected)
    state.tidemodel.typhSelected = null
}

export function toggleTyphGrapesPopup(state: State, action: boolean) {
  state.grapesPopup = action
}

export function changeTyphClickPointIndex(state: State, index) {
  state.clickIndex = index
}

export function toggleIsClickingLastPoint(state: State, action) {
  state.isClickingLastPoint = action
}

export function storeTyphClickingPos(state: State, pos) {
  state.clickPos = pos
}

export function manulChangeTyphClickIndex(state: State) {
  state.indexChanged = new Date().getTime()
}

export function toggleOprateTip(state: State, action: OprateTip) {
  state.oprateTip = action.tip
  state.oprateText = action.text
}
interface OprateTip {
  tip: boolean
  text: string
}

export function toggleIsColorIndicatorDisplay(state: State, action: boolean) {
  state.isColorIndicatorDisplay = action
}

export function togglePhoneMonitor(state: State, action) {
  state.isPhoneMonitorOn = !state.isPhoneMonitorOn
}

export function toggleOceanMonitor(state: State) {
  state.isOceanMonitorOn = !state.isOceanMonitorOn
}

export function toggleWeatherMonitor(state: State) {
  state.isWeatherMonitorOn = !state.isWeatherMonitorOn
}

export function toggleWeatherForecastPopup(state: State, action: boolean) {
  state.isWeatherForecastPopupOn = action
}

export function selectWeatherForecastOpt(state: State, type: string) {
  state.selectedWeatherForecastOpt = type
}

export function toggleUserManagement(state: State, action: boolean) {
  state.isUserManagementOn = action
}

export function storeWindPickingValue(state: State, data) {
  state.windValue = data
}

export function storeGridPickingValue(state: State, data) {
  state.gridValue = data
}

export function storeTideMonitorState(state: State, data) {
  state.isTideMonitorOn = data
}

export function forceCloseModelResult(state: State) {
  state.forceCloseModelResult = !state.forceCloseModelResult
}

export function toggleTideTable(state: State) {
  state.isTideTableOn = !state.isTideTableOn
}

export function toggleProgBar (state: State, action: boolean) {
  state.isProgBarOn = action
}

export function changeProgBarElement (state: State, ele) {
  state.progBarElement = ele
}

export function toggleTrackingResult (state: State, action: boolean) {
  state.isTrackingResultOn = action
}

export function changeTrackingResult (state: State, data: any) {
  if(!data) state.trackingResult = null
  else state.trackingResult = { ...data }
}

export function changeTrackingTime (state: State, time: string) {
  state.trackingTime = time
}

export function toggleVideoMonitorPopup (state: State, action: boolean) {
  state.isVideoMonitorPopupOn = action
}

export function toggleVideoAddressPopup (state: State, action: boolean) {
  state.isVideoAddressPopupOn = action
}

export function changeVideoInfo (state: State, info: any) {
  state.videoInfo = { ...info }
}

export function changeVideoAddress (state: State, obj: any) {
  state.videoAddress = { ...obj }
}

export function toggleWaterNamePopup (state: State, action: boolean) {
  state.isWaterNamePopupOn = action
}

export function changeWaterLevelName (state: State, obj: any) {
  state.waterLevelName = { ...obj }
}

export function toggleScreenVideo (state: State, action: boolean) {
  state.isScreenVideoOn = action
}

export function changeScreenVideoUrl (state: State, url: string) {
  state.screenVideoUrl = url
}

export function toggleShowCurrentTy (state: State, action: boolean) {
  state.isShowCurrentTy = action
}

export function toggleClickedTy (state: State) {
  state.isClickedTy = !state.isClickedTy
}

export function toggleisNeedMountedTy (state: State, action: boolean) {
  state.isNeedMountedTy = action
}

export function changeWeatherEleTime (state: State, element: any) {
  if (element.time)
    state.weatherElementTime[element.type] = element
  else
    delete state.weatherElementTime[element.type]
  state.weatherElementTime = { ...state.weatherElementTime }
}

export function storeSimilarTyphData (state: State, action: any) {
  state.similarTyphData = action
}

export function toggleMouseOverPoint (state: State, action: any) {
  state.isMouseOverPoint = action
}

export function storeOceanPickingValue (state: State, action: any) {
  state.oceanPickingValue = action
}

export default <MutationTree<State>>{
  STORE_LOGIN_USER,
  TOGGLE_LOGIN_PAGE,
  selectDisasterType,
  toggleTyphTimelineStatus,
  changeTyphCurrentYear,
  changeDatetime,
  changeTrackingDatetime,
  activeBlurControl,
  selectTyph,
  changeTyphCurrentName,
  storeTyphData,
  storeTyphMouseOverData,
  storeTyphMouseOverPos,
  storeTyphMouseOverName,
  toggleTyphMouseOverPopup,
  deleteHistTyph,
  toggleTyphGrapesPopup,
  changeTyphClickPointIndex,
  toggleIsClickingLastPoint,
  storeTyphClickingPos,
  manulChangeTyphClickIndex,
  toggleOprateTip,
  toggleIsColorIndicatorDisplay,
  togglePhoneMonitor,
  toggleOceanMonitor,
  toggleWeatherMonitor,
  toggleWeatherForecastPopup,
  selectWeatherForecastOpt,
  toggleUserManagement,
  storeWindPickingValue,
  storeTideMonitorState,
  storeGridPickingValue,
  forceCloseModelResult,
  toggleTideTable,
  toggleProgBar,
  changeProgBarElement,
  toggleTrackingResult,
  changeTrackingResult,
  changeTrackingTime,
  toggleVideoMonitorPopup,
  toggleVideoAddressPopup,
  changeVideoInfo,
  changeVideoAddress,
  toggleWaterNamePopup,
  changeWaterLevelName,
  toggleScreenVideo,
  changeScreenVideoUrl,
  toggleShowCurrentTy,
  toggleClickedTy,
  toggleisNeedMountedTy,
  changeWeatherEleTime,
  storeSimilarTyphData,
  toggleMouseOverPoint,
  storeOceanPickingValue,
}