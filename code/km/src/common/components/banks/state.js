
import _ from 'lodash';

const state = {
  content: {
    isShow: false,
    data  : {}
  },
};

const mutations = {
  bankData (state, options) {
    state.content = _.assign({}, state.content, options);
  },
};

const actions = {
  bankData: ({ commit }, options) => commit(options),
};

const getters = {

};

export default {
  state,
  mutations,
  actions,
  getters,
};