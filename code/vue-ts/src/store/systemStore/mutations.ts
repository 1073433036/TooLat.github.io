import { Mutation, MutationTree } from 'vuex'
import { State } from './state'

export const storeMessage = (state: State, data: string) => {
  state.message = data
}

export default <MutationTree<State>> {
  storeMessage
}