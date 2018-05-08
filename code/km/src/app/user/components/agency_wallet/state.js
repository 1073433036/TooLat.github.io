
const state = {
  userWithdrawInfo: {},
  withdrawStatus: 0,

  integralWithdrawInfo: {},
  integralWithdrawStatus: 0,

  userBankCarInfo: {}
};

const mutations = {
  saveUserWithdrawInfo (state, playLoad) {
    state.userWithdrawInfo = playLoad.userWithdrawInfo;
  },
  saveWithdrawStatus (state, playLoad) {
    state.withdrawStatus = playLoad.withdrawStatus;
  },
  saveIntegralWithdrawInfo (state, playLoad) {
    state.integralWithdrawInfo = playLoad.integralWithdrawInfo;
  },
  saveIntegralWithdrawStatus (state, playLoad) {
    state.integralWithdrawStatus = playLoad.integralWithdrawStatus;
  },
  saveUserBankCarInfo (state, playLoad) {
    state.userBankCarInfo = playLoad;
  }
};

const actions = {
  test: ({ commit }, options) => commit(options),
};

export default {
  state,
  mutations,
  actions
};