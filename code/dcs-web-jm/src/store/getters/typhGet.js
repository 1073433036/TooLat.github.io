export const selectedModel_global = state => state.selectedModel
export const typhTimeLineStatus_global = state => state.tideModel.timeLineStatus
export const typhCurrentYear_global = state => state.tideModel.currentYear
export const typhCurrentName_global = state => state.tideModel.currentTyphName
export const containedTyph_global = state => state.tideModel.containedTyphData
export const historyTyphIdArray_global = state => state.tideModel.historyTyphIdArray
export const selectedTyph_global = state => state.tideModel.selectedTyph
export const currentTyphFlag_global = state => state.currentTyphFlag
export const typhMatchingPopup_global = state => state.matchingPopup
export const typhClickPopup_global = state => state.typhClickData.popupShow
export const typhClickPointIndex_global = state => state.typhClickData.index
export const typhClickPopupPos_global = state => state.typhClickData.popupPos
export const typhClickFstTime_global = state => state.typhClickData.fstTime
export const selectedMatchingTyph_global = state => state.selectedMatchingTyph
export const typhReportPopup_global = state => state.reportPopup
export const typhOverPopupData_global = state => state.mouseOverData.details
export const typhOverPopupPos_global = state => state.mouseOverData.position
export const typhOverPopupShow_global = state => state.mouseOverData.show
export const selectedTyphoonData_global = state => state.typhoonData

//判断是否为2003年之前的台风
export const isBefore03Typh_global = state => {
  return Array.isArray(state.tideModel.historyTyphIdArray) && state.tideModel.historyTyphIdArray.includes(state.tideModel.selectedTyph);
}
