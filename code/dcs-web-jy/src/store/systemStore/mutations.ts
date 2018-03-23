import { Mutation, MutationTree } from 'vuex'
import { State } from './state'
import UserInfo from '../../interface/UserInfo'

export const storeUserInfo = (state: State, userInfo: UserInfo): void => {
  state.userInfo = userInfo;
}

export const userLogout = (state: State): void => {
  state.userInfo = {};
}

export default <MutationTree<State>> {
  storeUserInfo,
  userLogout
}
