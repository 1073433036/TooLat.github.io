import { Getter, GetterTree } from "vuex";
import { State } from './state-system'

export function userInfo_global(state: State) {
  return state.userInfo
}

export function subMenu_global(state: State) {
  return state.subMenu
}

export function productViewHolder_global (state: State): any {
  return state.productViewHolder
}

export function isClosingPopup_global (state: State): any {
  return state.isClosingPopup
}

export function articleViewHolder_global (state: State):any {
  return state.articleViewHolder
}

export default <GetterTree<State, any>>{
  userInfo_global,
  subMenu_global,
  productViewHolder_global,
  isClosingPopup_global,
  articleViewHolder_global,
}