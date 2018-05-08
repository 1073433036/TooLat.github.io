
const state = {
	text: '',
	content:'',
	images:'',
};

const mutations = {
  testState (state, options) {
    state.text = options.text;
	},
  contentState (state, options) {
    state.content = options.content;
	},
  imagesState (state, options) {
    state.images = options.images;
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