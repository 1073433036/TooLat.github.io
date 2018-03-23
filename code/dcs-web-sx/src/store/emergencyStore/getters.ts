import { Getter, GetterTree } from "vuex";
import { State } from './state'

export function planModel_global(state: State): boolean {
  return state.planModel;
}

export function infoPublish_global(state: State): any {
  return state.isInfoPublishOn
}

export function eventDeal_global(state: State): boolean {
  return state.isEventDealOn;
}

export function addTempPopup_global(state: State): boolean {
  return state.addTempPopup;
}

export function tempNames_global(state: State): any {
  return state.tempNames;
}

export function selectedTempNameKey_global(state: State): string {
  return state.selectedTempNameKey;
}

export function template_global(state: State): any {
  return state.template;
}

export function types_global(state: State): any {
  return state.types;
}

export function allLevels_global(state: State): any {
  return state.allLevels;
}

export function levels_global(state: State): any {
  return state.levels;
}

export function relateorgs_global(state: State): any {
  return state.relateorgs;
}

export function influences_global(state: State): any {
  return state.influences;
}

export function allDuties_global(state: State): any {
  return state.allDuties;
}

export function duties_global(state: State): any {
  return state.duties;
}

export function currentDuties_global(state: State): any {
  return state.currentDuties;
}

export function refreshPlan_global(state: State): boolean {
  return state.refreshPlan;
}

export function refreshOnlinePlan_global(state: State): boolean {
  return state.refreshOnlinePlan;
}

export function waterLevelData_global(state: State): any {
  return state.waterLevelData
}

export function waterLevelPopup_global(state: State): any {
  return state.isWaterLevelPanelDisplay
}

export function waterLevelPosition_global (state: State): any {
  return state.waterLevelPosition
}

export function waterLevelTablePopup_global (state: State): any {
  return  state.waterLevelTablePopup
}

export function emergencyPlan_global(state: State): any {
  return state.isEmergencyPlanOn
}


export default <GetterTree<State, any>>{
  planModel_global,

  addTempPopup_global,
  tempNames_global,
  selectedTempNameKey_global,
  template_global,
  types_global,
  allLevels_global,
  levels_global,
  relateorgs_global,
  influences_global,
  allDuties_global,
  duties_global,
  currentDuties_global,

  refreshPlan_global,
  refreshOnlinePlan_global,

  emergencyPlan_global,
  infoPublish_global,
  eventDeal_global,
  waterLevelPopup_global,
  waterLevelData_global,
  waterLevelPosition_global,
  waterLevelTablePopup_global
}