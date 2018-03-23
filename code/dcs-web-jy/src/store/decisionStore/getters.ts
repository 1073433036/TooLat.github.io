import { Getter, GetterTree } from 'vuex'
import { State } from './state'

export const region_global = (state: State): any => state.region

export const zmapLayer_global = (state: State): any => state.zmapLayer

export const zmapViewer_global = (state: State): any => state.zmapViewer

export const popupStatus_global = (state: State): any => state.popupStatus

export const stationLiveDetailInfo_global = (state: State): any => state.stationLiveDetailInfo

export const stationColorBar_global = (state: State): any => state.stationColorBar

export const detailNameInfo_global = (state: State): any => state.detailNameInfo

export const waterMonitorDetailInfo_global = (state: State): any => state.waterMonitorDetailInfo

export const disasterDetailInfo_global = (state: State): any => state.disasterDetailInfo

export const videoDetailInfo_global = (state: State): any => state.videoDetailInfo

export const geoDetailInfo_global = (state: State): any => state.geoDetailInfo

export const geoDetailPoint_global = (state: State): any => state.geoDetailPoint

export const geoDetailType_global = (state: State): any => state.geoDetailType

export const windPickingValue_global = (state: State): any => state.windPickingValue

export const rainPickingValue_global = (state: State): any => state.rainPickingValue

export const refreshPlan_global = (state: State): any => state.refreshPlan

export const refreshOnlinePlan_global = (state: State): any => state.refreshOnlinePlan

export const dealPlanInfo_global = (state: State): any => state.dealPlanInfo

export const colorTableData_global = (state: State): any => state.colorTable

export const isColorDelete_global = (state: State): any => state.colorTable.isColorDelete

export const colorTypeData_global = (state: State): any => state.colorTable.colorTypeData

export const isColorAdd_global = (state: State): any => state.colorTable.isColorAdd

export const deleteColorType_global = (state: State): any => state.colorTable.deleteColorType

export const emergencyMonitor_global = (state: State): any => state.emergencyMonitor

export const alarmTyphTsid_global = (state: State): any => state.alarmTyphTsid

export const alarmMonitorDetail_global = (state: State): any => state.alarmMonitorDetail


export const disasterTypeSelected_global = (state: State): any => state.disasterType

export const typhTimelineStatus_global = (state: State): any => state.tidemodel.timelineStatus

export const typhCurrentYear_global = (state: State): any => state.tidemodel.currentYear

export const typhSelected_global = (state: State): any => state.tidemodel.typhSelected

export const containedTyph_global = (state: State): any => state.tidemodel.containedTyphData

export const typhPointEffect_global = (state: State): any => state.typhPointEffect

export default <GetterTree<State, any>> {
  region_global,
  zmapLayer_global,
  zmapViewer_global,
  popupStatus_global,
  stationLiveDetailInfo_global,
  stationColorBar_global,
  detailNameInfo_global,
  waterMonitorDetailInfo_global,
  disasterDetailInfo_global,
  videoDetailInfo_global,
  geoDetailInfo_global,
  geoDetailPoint_global,
  geoDetailType_global,
  windPickingValue_global,
  rainPickingValue_global,
  refreshPlan_global,
  refreshOnlinePlan_global,
  dealPlanInfo_global,
  colorTableData_global,
  isColorDelete_global,
  colorTypeData_global,
  isColorAdd_global,
  deleteColorType_global,
  emergencyMonitor_global,
  alarmTyphTsid_global,
  alarmMonitorDetail_global,

  disasterTypeSelected_global,
  typhTimelineStatus_global,
  typhCurrentYear_global,
  typhSelected_global,
  containedTyph_global,
  typhPointEffect_global,
}
