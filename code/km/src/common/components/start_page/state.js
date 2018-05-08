
const state = {
	isStart: false,
};

const mutations = {
	startPage (state, options) {
		state.isStart = options.isStart;
	}
};

const actions = {
	startPage: ({ commit }, options) => commit(options),
};
export default {
  state,
  mutations,
  actions,
};