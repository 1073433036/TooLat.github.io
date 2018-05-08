import _ from 'lodash';

const state = {
  isShow: false,
  visitor: {},
};

const mutations = {
  Visitor (state, options) {
    state = _.assign(state, options);
  }
};

const actions = {
  Visitor: ({ commit }, options) => commit(options),
};

const getters = {

};

export default {
  state,
  mutations,
  actions,
  getters,
};