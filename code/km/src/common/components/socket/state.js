
import _ from 'lodash';

const state = {
	content: {
    msg: '',
    isSuccess: false,
  },
};

const mutations = {
	message (state, options) {
		state.content = _.assign({}, state.content, options);
	},
};

const actions = {
  message: ({ commit }, options) => commit(options),
};
export default {
  state,
  mutations,
  actions,
};