import { Module, GetterTree, MutationTree, ActionTree } from 'vuex'
import { State } from './state'
import Mutations from './mutations'
import Getters from './getters'
import Actions from './actions'

export default class DecisionStore implements Module<State, any> {
  namespaced: boolean = true

  state: State
  mutations = Mutations
  getters = Getters
  actions = Actions

  constructor() {
    this.state = new State()
  }
}
