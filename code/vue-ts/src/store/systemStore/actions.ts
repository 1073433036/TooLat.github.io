import { Store, ActionTree, ActionContext } from 'vuex'
import { State } from './state'

export const storeMessage_global = (store: ActionContext<State, any>, data: string) => {
  store.commit('storeMessage', data)
}

export default <ActionTree<State, any>> {
  storeMessage_global
}