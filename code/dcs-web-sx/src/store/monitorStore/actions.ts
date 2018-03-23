import { Store, ActionTree, ActionContext } from "vuex";
import { State } from './state';
import * as types from '../mutation-types'

export function changeRealPopup_global (store: ActionContext<State, any>, obj: any) {
  store.commit(types.CHANGE_REAL_POPUP, obj);
}

export function toggleAISDetailPanel_global (store: ActionContext<State, any>, data) {
  store.commit('toggleAISDetailPanel', data)
}

export function storeAISDetailData_global (store: ActionContext<State, any>, data) {
  store.commit('storeAISDetailData', data)
}

export function storeBoatModel_global (store: ActionContext<State, any>, data) {
  store.commit('storeBoatModel', data)
}

export function toggleModelHightLight_global (store: ActionContext<State, any>, action) {
  store.commit('toggleBoatHightLight', action)
}

export function toggleWaterLevelDetail_global (store: ActionContext<State, any>, action) {
  store.commit('toggleWaterLevelDetail', action)
}

export default <ActionTree<State, any>>{
    changeRealPopup_global,
    toggleAISDetailPanel_global,
    storeAISDetailData_global,
    toggleModelHightLight_global,
    storeBoatModel_global,
    toggleWaterLevelDetail_global
}