import * as getters from '../getters/dateGetters'
import * as actions from '../actions/dateAct'

import {
  UPDATE_DATE,
} from '../mutation-types'

const state = {
  globalDate: new Date(),
}

const mutations = {
  [UPDATE_DATE](state, date) {
    state.globalDate = date;
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
