import { Store, ActionTree, ActionContext } from 'vuex'
import { State } from './state'

export const changeInfoPopupStatus = (store: ActionContext<State, any>, params): void => {
  store.commit('changeInfoPopupStatus', params);
}
export default <ActionTree<State, any>> {
  changeInfoPopupStatus
}
