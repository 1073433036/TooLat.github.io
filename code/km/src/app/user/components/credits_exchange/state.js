
const state = {
  violation: {},
  carSelected: {},
  carId: undefined,
  carCode: undefined,
  orderSelected: [],
};

const mutations = {
  setViolation (state, options) {
    state.violation[options.id] = options.data;
  },
  setCarSelected (state, options) {
    state.carSelected = options;
  },
  setCarId (state, options) {
    state.carId = options;
  },
  setcarCode (state, options) {
    state.carCode = options;
  },
  setOrderSelected (state, options) {
    state.orderSelected = options;
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
