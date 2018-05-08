
const state = {
  content: {
    typeRemark: '',
    itemRemark: '',
    articleId: '',
    financialData: {
      id: ''
    },
    insuranceData: {
      id: ''
    }
  }
};

const mutations = {
  saveTypeRemark (state, playload) {
    state.content.typeRemark = playload.typeRemark;
  },
  saveItemRemark (state, playload) {
    state.content.itemRemark = playload.itemRemark;
  },
  saveArticleId (state, playload) {
    state.content.articleId = playload.articleId;
  },
  saveDataId (state, playload) {
    state.content.financialData.id = playload.financialId;
    state.content.insuranceData.id = playload.insuranceId;
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