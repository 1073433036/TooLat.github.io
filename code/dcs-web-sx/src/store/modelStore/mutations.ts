import { Mutation, MutationTree } from "vuex";
import { State } from "./state";

export function selectModel (state: State, model) {
  state.modeldata.modelSelected = model;
}

export function storeModelData(state: State, data) {
  state.modeldata[data.attr] = data.value;
}

export function selectSeledTime (state: State, seledTime: number) {
  state.modeldata.seledTime = seledTime  
}

export function addColorTable (state: State, colorTable) {
  state.colorToAdd = colorTable 
}

export function deleteColorTable (state: State, colorTable) {
  state.colorToDelete = colorTable 
}

export default <MutationTree<State>>{
  selectModel,
  storeModelData,
  selectSeledTime,
  addColorTable,
  deleteColorTable
}
