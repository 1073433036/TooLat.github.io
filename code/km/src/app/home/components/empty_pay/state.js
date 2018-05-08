
const state = {
  payInfo: {
    money: '',
    channelRemark: '',
    depositCard: ''
  },
  emptyOrderData: {
    orderNum: '',
    channel_id: '',
    payRoadInfo: [],
    creditCardInfo: {
      credit_card_id: ''
    }
  }
};

const mutations = {
  savePayMoney (state, playload) {
    state.payInfo.money = playload.money;
  },
  saveChannelRemark (state, playload) {
    state.payInfo.channelRemark = playload.channelRemark;
  },
  saveChannelId (state, playload) {
    state.emptyOrderData.channel_id = playload.channel_id;
  },
  savePayRoadInfo (state, playload) {
    state.emptyOrderData.orderNum = playload.orderNum;
    if (playload.resRoadInfo) {
      state.emptyOrderData.payRoadInfo = playload.resRoadInfo;
    }
  },
  saveDepositCard (state, playload) {
    state.payInfo.depositCard = playload.depositCard;
  },
  saveCreditCardInfo (state, playload) {
    state.emptyOrderData.creditCardInfo = playload;
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