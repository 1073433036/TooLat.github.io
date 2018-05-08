
const state = {
  userLevel: '',
  id: '',
  articelContent: {
    title: '',
    content:'',
    articelImg:'',
  }
};

const mutations = {
  saveUserLevel (state, options) {
    state.userLevel = options.userLevel;
  },
  saveTypeId (state, options) {
    state.id = options.id;
  },
  saveArticelContent (state, options) {
    state.articelContent = Object.assign({}, state.articelContent, options);
  }
  // testState (state, options) {
  //   state.text = options.text;
  // },
  // contentState (state, options) {
  //   state.content = options.content;
  // },
  // imagesState (state, options) {
  //   state.images = options.images;
  // },
};

const actions = {
  test: ({ commit }, options) => commit(options),
};

export default {
  state,
  mutations,
  actions
};