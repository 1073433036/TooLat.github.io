
import _ from 'lodash';

const state = {
  content: {
    isShow: false,
    data  : {}
  },
};

const mutations = {
  cityListData (state, options) {
    state.content = _.assign({}, state.content, options);
  },
};

const actions = {
  cityListData: ({ commit }, options) => commit(options),
};

const getters = {

};

export default {
  state,
  mutations,
  actions,
  getters,
};