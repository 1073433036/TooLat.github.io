import { Mutation, MutationTree } from "vuex";
import { State } from "./state";

import { Helper } from '../../util/Helper'

export function CHANGE_REAL_POPUP (state: State, obj) {
  state.realPopup = { ...obj };
}

export function toggleAISDetailPanel (state: State, data: {action: boolean, position: any}) {
  state.displayAISDetail = data.action
  state.AISDetailPosition = data.position
}

export function storeAISDetailData (state: State, data) {
  state.AISDetailData = data 
}

export function storeBoatModel (state: State, boat: any) {
  state.boatModel = boat 
}

export function toggleBoatHightLight (state: State, action) {
  state.isModelHightLighted = action
}

export function toggleWaterLevelDetail (state: State, action) {
    state.isWaterLevelDetailOn = action 
}

export default <MutationTree<State>> {
    CHANGE_REAL_POPUP,
    toggleAISDetailPanel,
    storeAISDetailData,
    storeBoatModel,
    toggleBoatHightLight,
    toggleWaterLevelDetail
}