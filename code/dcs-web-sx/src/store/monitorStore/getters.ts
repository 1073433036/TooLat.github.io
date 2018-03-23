import { Getter, GetterTree } from "vuex";
import { State } from './state'

export function realPopup_global (state: State): any {
  return state.realPopup;
}

export function displayAISDetailPanel_global (state: State): any {
  return state.displayAISDetail
}

export function AISDetailPosition_global (state: State): any {
  return state.AISDetailPosition
}

export function AISDetailData_global (state: State): any {
  return state.AISDetailData
}

export function boatModel_global (state: State): any {
  return state.boatModel
}

export function isBoatModelHightLighted_global (state: State): any {
  return state.isModelHightLighted
}

export function isWaterLevelDetailOn_global (state: State): any {
  return state.isWaterLevelDetailOn
}

export default <GetterTree<State, any>> {
  realPopup_global,
  displayAISDetailPanel_global,
  AISDetailPosition_global,
  AISDetailData_global,
  boatModel_global,
  isBoatModelHightLighted_global,
  isWaterLevelDetailOn_global
}