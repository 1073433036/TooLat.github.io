
const state = {
  userCarInfo: {
    carLicenseNo: ''
  }
};

const mutations = {
  saveCarLicenseNo (state, playload) {
    state.userCarInfo.carLicenseNo = playload.carLicenseNo;
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