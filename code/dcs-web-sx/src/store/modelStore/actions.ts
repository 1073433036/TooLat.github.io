import { Store, ActionTree, ActionContext } from 'vuex'
import { State } from './state'

export function selectModel_global (store: ActionContext<State, any>, model) {
  store.commit('selectModel', model)
}

export function storeModelData_global (store: ActionContext<State, any>, data) {
  store.commit('storeModelData', data)
}

export function selectSeledTime_global (store: ActionContext<State, any>, seledTime: number) {
  store.commit('selectSeledTime', seledTime)
}

export function addColorTable_global (store: ActionContext<State, any>, colorTable) {
  store.commit('addColorTable', colorTable)
}

export function deleteColorTable_global (store: ActionContext<State, any>, colorTable) {
  store.commit('deleteColorTable', colorTable)
}

export default <ActionTree<State, any>> {
  selectModel_global,
  storeModelData_global,
  selectSeledTime_global,
  addColorTable_global,
  deleteColorTable_global
}
