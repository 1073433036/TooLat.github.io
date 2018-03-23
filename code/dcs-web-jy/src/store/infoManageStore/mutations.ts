import { Mutation, MutationTree } from 'vuex'
import { State } from './state'

export const changeInfoPopupStatus = (state: State, params): void => {
  for(let key in params){
    state.infoPopupStatus[key]=params[key]
  }
}

export default <MutationTree<State>> {
  changeInfoPopupStatus,
}
