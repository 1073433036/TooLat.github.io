
const state = {
	/*自定义类名*/
	customClass : '',
  title 		  : '',
  msg 			  : '',
  align       : '',
  html 			  : '',
  active 		  : false,
  lists       : [],
  width 		  : '65%',
};

const mutations = {
	customClass (state, options) {
		state.customClass = options.customClass;
	},

	handleChangeDialog (state, options) {
		state = Object.assign(state, options);
	},

	resetDialog (state) {
		state.active 		= false;
		state.title 		= '';
		state.msg 			= '';
    state.html      = '';
		state.align 		= '';
    state.lists     = [];
		state.width 		= '65%';
	},
};

const actions = {
	handleChangeDialog: ({ commit }, options) => {
		commit({
			type: 'appFixed',
			appFixed: true,
		});
		commit('resetDialog');
		commit(options);
	},
	resetDialog: ({ commit }) => {
		commit({
			type: 'appFixed',
			appFixed: false,
		});
		commit('resetDialog');
	},
};
export default {
  state,
  mutations,
  actions,
};
