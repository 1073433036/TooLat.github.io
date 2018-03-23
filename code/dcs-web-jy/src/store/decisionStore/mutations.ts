import { Mutation, MutationTree } from 'vuex'
import { State } from './state'
import mutations from '../systemStore/mutations';

export const storeResetVuex = (state: State) => {
  state.zmapLayer = 'tianditu'
  for (let i in state.popupStatus) {
    state.popupStatus[i] = false
  }
}

export const storeZmapLayer = (state: State, layer: any) => {
  state.zmapLayer = layer
}

export const storeZmapViewer = (state: State, data: any) => {
  state.zmapViewer = { ...data }
}

export const storePopupStatus = (state: State, data: { key: string, action: boolean }) => {
  state.popupStatus[data.key] = data.action
}

export const storestationLiveDetailInfo = (state: State, data: any) => {
  state.stationLiveDetailInfo = { ...data }
}

export const storestationColorBar = (state: State, data: any) => {
  state.stationColorBar = data
}

export const storedetailNameInfo = (state: State, data: any) => {
  state.detailNameInfo = { ...data }
}

export const storeWaterMonitorDetailInfo = (state: State, data: any) => {
  state.waterMonitorDetailInfo = { ...data }
}

export const storeDisasterDetailInfo = (state: State, data: any) => {
  state.disasterDetailInfo = { ...data }
}

export const storeVideoDetailInfo = (state: State, data: any) => {
  state.videoDetailInfo = { ...data }
}

export const storeGeoDetailInfo = (state: State, data: any) => {
  state.geoDetailInfo = { ...data }
}

export const storeGeoDetailPoint = (state: State, data: any) => {
  state.geoDetailPoint = { ...data }
}

export const storeGeoDetailType = (state: State, type: number) => {
  state.geoDetailType = type
}

export const storeWindPickingValue = (state: State, data: any) => {
  state.windPickingValue = { ...data }
}

export const storerainPickingValue = (state: State, data: any) => {
  state.rainPickingValue = { ...data }
}

export const storeRefreshPlan = (state: State, data: any) => {
  state.refreshPlan = data
}

export const storeRefreshOnlinePlan = (state: State, data: any) => {
  state.refreshOnlinePlan = data
}

export const storeDealPlanInfo = (state: State, data: any) => {
  state.dealPlanInfo = { ...data }
}

export const storeColorTable = (state: State, colorData: any) => {
  if(colorData.type === 'add') {
    state.colorTable.colorTypeData = colorData.data
    state.colorTable.isColorAdd = Math.random()
  } else {
    state.colorTable.deleteColorType = colorData.data.type
    state.colorTable.isColorDelete = Math.random()
  }
}

export const storeEmergencyMonitor = (state: State, data: { key: string, action: boolean }) => {
  state.emergencyMonitor[data.key] = data.action
}

export const storeAlarmTyphFlag = (state: State) => {
  state.alarmTyphTsid.flag = !state.alarmTyphTsid.flag
}

export const storeAlarmTyphTsid = (state: State, tsid: number) => {
  state.alarmTyphTsid.tsid = tsid
}

export const storeAlarmMonitorDetail = (state: State, data: any) => {
  state.alarmMonitorDetail = { ...data }
}


export const selectDisasterType = (state: State, data: any) => {
  state.disasterType = data
}

export const toggleTyphTimelineStatus = (state: State, status: 'search' | 'detail' | 'history') => {
  state.tidemodel.timelineStatus = status
}

export const changeTyphCurrentYear = (state: State, year: number) => {
  state.tidemodel.currentYear = year
}

export const changeTyphCurrentName = (state: State, name: string) => {
  state.tidemodel.currentTyphName = name
}

export const storeTyphData = (state: State, data: any) => {
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

export const selectTyph = (state: State, tsId: string) => {
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

export const deleteHistTyph = (state: State, id: string) => {
  let ctnedHtyTyphData = state.tidemodel.containedTyphData
  for (let i in ctnedHtyTyphData) {
    if (ctnedHtyTyphData[i].tsId == id) {
      ctnedHtyTyphData.splice(Number(i), 1)
    }
  }
  if (state.tidemodel.typhSelected == id)
    state.tidemodel.typhSelected = null
}

export const storeTyphPointEffect = (state: State, data: any) => {
  state.typhPointEffect = { ...data }
}

export default <MutationTree<State>> {
  storeResetVuex,
  storeZmapLayer,
  storeZmapViewer,
  storePopupStatus,
  storestationLiveDetailInfo,
  storestationColorBar,
  storedetailNameInfo,
  storeWaterMonitorDetailInfo,
  storeDisasterDetailInfo,
  storeVideoDetailInfo,
  storeGeoDetailInfo,
  storeGeoDetailPoint,
  storeGeoDetailType,
  storeWindPickingValue,
  storerainPickingValue,
  storeRefreshPlan,
  storeRefreshOnlinePlan,
  storeDealPlanInfo,
  storeColorTable,
  storeEmergencyMonitor,
  storeAlarmTyphFlag,
  storeAlarmTyphTsid,
  storeAlarmMonitorDetail,

  selectDisasterType,
  toggleTyphTimelineStatus,
  changeTyphCurrentYear,
  changeTyphCurrentName,
  storeTyphData,
  selectTyph,
  deleteHistTyph,
  storeTyphPointEffect,
}
