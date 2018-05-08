
const state = {
    isShowCityList: false,
    provinceData: {},
    cityData: {}
};

const mutations = {
  resetCityData (state) {
    state.cityData = {};

  },
  saveIsShowCityList (state, options) {
    state.isShowCityList = options.isShowCityList;
  },
  saveProvinceData (state, options) {
    state.provinceData = options.provinceData;
  },
  saveCityData (state, options) {
    state.cityData = options.cityData;
  }
};

const actions = {
  cityListData: ({ commit }, options) => {
    commit(options);
  },
};

const getters = {

};

export default {
  state,
  mutations,
  actions,
  getters,
};