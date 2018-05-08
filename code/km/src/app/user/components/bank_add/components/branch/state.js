
import _ from 'lodash';

const state = {
  content: {
    isShow: false,
    data  : {},
    bankName    : '',
    bankCity    : '',
    bnakProvice : '',
  },
};

const mutations = {
  branchData (state, options) {
    state.content = _.assign({}, state.content, options);
  },

};

const actions = {
  branchData: ({ commit }, options) => commit(options),
};

const getters = {

};

export default {
  state,
  mutations,
  actions,
  getters,
};