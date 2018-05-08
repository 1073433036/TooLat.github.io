
const state = {
  authentication: {
    id_pic: '',
    name: '',
    id_number: '',
    bank_name: '',
    card_pic: '',
    card_code: '',
    hand_id_pic: '',
    audit: false
  }
};

const mutations = {
  SAVE_ID_PIC (state, options) {
    state.authentication.id_pic = options.id_pic;
  },
  SAVE_ID_NAME (state, options) {
    state.authentication.name = options.name;
  },
  SAVE_ID_NUMBER (state, options) {
    state.authentication.id_number = options.id_number;
  },
  SAVE_BANK_NAME (state, options) {
    state.authentication.bank_name = options.bank_name;
  },
  SAVE_CARD_PIC (state, options) {
    state.authentication.card_pic = options.card_pic;
  },
  SAVE_CARD_CODE (state, options) {
    state.authentication.card_code = options.card_code;
  },
  SAVE_HAND_ID_PIC (state, options) {
    state.authentication.hand_id_pic = options.hand_id_pic;
  },
  SET_AUDIT (state, options) {
    state.authentication.audit = options.audit;
  }
};

const actions = {
  SAVE_AUTHENTICATION_STEP1: ({ commit }, options) => {
    commit('SAVE_ID_PIC', options);
    commit('SAVE_ID_NAME', options);
    commit('SAVE_ID_NUMBER', options);
  },
  SAVE_AUTHENTICATION_STEP2: ({ commit }, options) => {
    commit('SAVE_BANK_NAME', options);
    commit('SAVE_CARD_PIC', options);
    commit('SAVE_CARD_CODE', options);
  },
  SAVE_AUTHENTICATION_STEP3: ({ commit }, options) => {
    commit('SAVE_HAND_ID_PIC', options);
    commit('SET_AUDIT', options);
  },

};

export default {
  state,
  mutations,
  actions
};
