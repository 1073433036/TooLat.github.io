import { Store, ActionTree, ActionContext } from 'vuex'
import { State } from './state'
import UserInfo from '../../interface/UserInfo'

export const storeUserInfo_global = (store: ActionContext<State, any>, userInfo: UserInfo): void => {
  store.commit('storeUserInfo', userInfo);
}

export const userLogout_global = (store: ActionContext<State, any>): void => {
  store.commit('userLogout');
}

export default <ActionTree<State, any>> {
  storeUserInfo_global,
  userLogout_global
}
