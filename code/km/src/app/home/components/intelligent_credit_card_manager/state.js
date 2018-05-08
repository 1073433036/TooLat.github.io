const state = {
  cardId: {},
  cityInfo: {},
};

const mutations = {
  setCardId (state, cardId) {
    state.cardId = cardId;
  },
  setCityInfo (state, cityInfo) {
    state.cityInfo = cityInfo;
  },
};

const actions = {
};

export default {
  state,
  mutations,
  actions
};
