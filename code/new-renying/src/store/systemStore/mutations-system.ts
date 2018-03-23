import { Mutation, MutationTree } from "vuex";
import { State } from "./state-system";

export function changeUserInfo(state: State, userInfo: any) {
  state.userInfo = userInfo
}

export function changeSubMenu(state: State, action: any) {
  state.subMenu = action
}

export function toggleProductView (state: State, payload: {id: number, action: boolean}) {
  state.productViewHolder[payload.id] = payload.action
  state.productViewHolder = { ...state.productViewHolder }
}

export function closeProductView (state: State) {
  for (let i in state.productViewHolder)
    state.productViewHolder[i] = false
  state.productViewHolder = { ...state.productViewHolder }
  state.isClosingPopup = !state.isClosingPopup
}

export function changeArticleViewHolder(state: State, action: any) {
  state.articleViewHolder.id = action.id
  state.articleViewHolder.type = action.type
  state.articleViewHolder = { ...state.articleViewHolder }
}

export default <MutationTree<State>>{
  changeUserInfo,
  changeSubMenu,
  toggleProductView,
  closeProductView,
  changeArticleViewHolder,
}