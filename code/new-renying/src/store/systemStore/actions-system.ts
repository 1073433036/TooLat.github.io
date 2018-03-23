import { Store, ActionTree, ActionContext } from "vuex";
import { State } from './state-system';
import * as types from '../mutation-types'

export function changeUserInfo_global (store: ActionContext<State, any>, userInfo) {
  store.commit('changeUserInfo', userInfo)
}

export function changeSubMenu_global (store: ActionContext<State, any>, action) {
  store.commit('changeSubMenu', action)
}

export function toggleProductView_global (store: ActionContext<State, any>, payload) {
  store.commit('toggleProductView', payload)
}

export function closeProductView_global (store: ActionContext<State, any>) {
  store.commit('closeProductView')
}

export function changeArticleViewHolder_global (store:ActionContext<State, any>,action) {
  store.commit('changeArticleViewHolder',action)
}

export default <ActionTree<State, any>> {
  changeUserInfo_global,
  changeSubMenu_global,
  toggleProductView_global,
  closeProductView_global,
  changeArticleViewHolder_global,
}