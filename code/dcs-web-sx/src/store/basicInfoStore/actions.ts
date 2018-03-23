import { Store, ActionTree, ActionContext } from "vuex";
import { State } from './state';
import * as types from '../mutation-types'
import GeoPoi from '../../util/GeoPoi'

export function toggleBasicInfoPopup_global (store: ActionContext<State, any>, action: boolean) {
  store.commit(types.TOGGLE_BASIC_INFO_POPUP, action);
}

export async function addGeoCollection_global (store: ActionContext<State, any>, { type, subType, subTypeEn, cityId, countyId }) {
  let geoPoi = new GeoPoi;
  const data = await geoPoi.getPoi({ type, subType, cityId, countyId });
  store.commit(types.ADD_GEO_COLLECTION, { type, subType, subTypeEn, data });
  store.commit(types.ADD_POI_CLICK_EVENT);
}

export function removeGeoCollection_global (store: ActionContext<State, any>, { type, subType }) {
  store.commit(types.REMOVE_GEO_COLLECTION, {type, subType});
  store.commit(types.REMOVE_POI_CLICK_EVENT);
}

export function showMaterialList_global (store: ActionContext<State, any>, key) {
  store.commit(types.SHOW_MATERIAL_LIST, key);
}

export function hidePoiDetailPopup_global (store: ActionContext<State, any>) {
  store.commit(types.HIDE_POI_DETAIL_POPUP);
}

export function addGeoPoiSet_global (store: ActionContext<State, any>, { type, subType, subTypeEn, data }) {
  store.commit(types.ADD_GEO_COLLECTION, { type, subType, subTypeEn, data });
  store.commit(types.ADD_POI_CLICK_EVENT);
}

export function clearAllGeoPoi_global (store: ActionContext<State, any>) {
  store.commit(types.CLEAR_ALL_GEO_POI);
}


export function matchGeoPoi_global (store: ActionContext<State, any>, data) {
  store.commit(types.MATCH_GEO_POI, data);
}

export function toggleGeoPopup_global (store: ActionContext<State, any>, action) {
  store.commit(types.TOGGLE_GEO_INFO_POPUP, action);
}

export function clearSelectedPri_global (store: ActionContext<State, any>) {
  store.commit(types.CLEAR_SELECTED_PRI);
}

export function changeDetatilData_global(store: ActionContext<State, any> , obj) {
  store.commit('changeDetatilData', obj)
}

export default <ActionTree<State, any>>{
    toggleBasicInfoPopup_global,
    addGeoCollection_global,
    removeGeoCollection_global,
    showMaterialList_global,
    hidePoiDetailPopup_global,
    addGeoPoiSet_global,
    clearAllGeoPoi_global,
    matchGeoPoi_global,
    toggleGeoPopup_global,
    clearSelectedPri_global,
    changeDetatilData_global,
}