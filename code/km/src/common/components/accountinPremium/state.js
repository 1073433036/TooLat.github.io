
const state = {
    time0   : '',
    time1   : '',
    time2   : '',
};

const mutations = {
  setTime1 (state, options) {
    state.time0 = options;
  },
  setTime1 (state, options) {
    state.time1 = options;
  },
  setTime2 (state, options) {
    state.time2 = options;
  },
};

const actions = {
  test: ({ commit }, options) => commit(options),
};

export default {
  state,
  mutations,
  actions
};
