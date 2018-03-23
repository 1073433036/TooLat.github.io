import { Getter, GetterTree } from "vuex";
import { State } from './state'

export function basicInfoPopup_global (state: State): any {
  return state.basicInfoPopup;
}

export function poiDetail_global (state: State): any {
  return state.poiDetail;
}

export function matchPoiCollection_global (state: State): any {
  return state.matchPoiCollection;
}

export function matchPoiInfoPopup_global (state: State): boolean {
  return state.matchPoiInfoPopup;
}

export function isTitlePopupOn_global (state: State): boolean {
  return state.isTitlePopupOn
}

export function pointTitle_global (state: State): any {
  return state.pointTitle
}

export default <GetterTree<State, any>> {
  basicInfoPopup_global,
  poiDetail_global,
  matchPoiCollection_global,
  matchPoiInfoPopup_global,
  isTitlePopupOn_global,
  pointTitle_global,
}