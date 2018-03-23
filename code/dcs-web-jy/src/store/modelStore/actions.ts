import { Store, ActionTree, ActionContext } from 'vuex'
import { State } from './state'

export const storeModelData_global = (store: ActionContext<State, any>, data: any) => {
  store.commit('storeModelData', data)
}

export default <ActionTree<State, any>> {
  storeModelData_global,
}