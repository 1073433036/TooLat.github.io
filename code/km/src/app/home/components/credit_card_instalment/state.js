
import _ from 'lodash';

const state = {
  share: {
    isShow: false,
  },
};

const mutations = {
  creditCardShare (state, options) {
    state.share = _.assign({}, state.share, options);
  },
};

const actions = {
  creditCardShare: ({ commit }, options) => commit(options),
};

export default {
  state,
  mutations,
  actions
};