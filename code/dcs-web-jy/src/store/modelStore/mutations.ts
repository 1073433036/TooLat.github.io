import { Mutation, MutationTree } from 'vuex'
import { State } from './state'

export const storeModelData = (state: State, data: any) => {
  state.modelData[data.attr] = data.value
}

export default <MutationTree<State>> {
  storeModelData,
}
