
import _ from 'lodash';

const state = {
  content: {
    isShow: false,
    data  : {}
  },
};

const mutations = {
  cropperData (state, options) {
    state.content = _.assign({}, state.content, options);
  },
};

const actions = {
  cropperData: ({ commit }, options) => commit(options),
};

const getters = {

};

export default {
  state,
  mutations,
  actions,
  getters,
};