import { Store, ActionTree, ActionContext } from "vuex";
import { State } from './state-system';
import * as types from '../mutation-types'

export function changeName_global (store: ActionContext<State, any>, name) {
  store.commit('changeName', name)
}

export default <ActionTree<State, any>> {
  changeName_global,
}