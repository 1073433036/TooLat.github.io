const state = {
  userLevel: '',
  setPaymentPlanMainInfo: {
    money: ''
  },
  creditCardInfo: {
    card_no: ''
  },
  confirmPaymentPlanInfo: {
    stateCode: 0,
    paymentType_one: {},
    paymentType_two: {},
    paymentType_three: {}
  },
  paymentProgressInfo: {},
  order_main_sn: '',
};

const mutations = {
  saveUserLevel (state, options) {
    state.userLevel = options.userLevel;
  },
  saveSetPaymentPlanMainInfo (state, playload) {
    state.setPaymentPlanMainInfo.money = playload.money;
  },
  saveCreditCardInfo (state, playload) {
    state.creditCardInfo = playload;
  },
  saveConfirmPaymentPlan (state, playload) {
    state.confirmPaymentPlanInfo.stateCode = playload.code;
    state.confirmPaymentPlanInfo.paymentType_one = playload.data[1];
    state.confirmPaymentPlanInfo.paymentType_two = playload.data[2];
    state.confirmPaymentPlanInfo.paymentType_three = playload.data[3];
  },
  savePaymentProgressInfo (state, playload) {
    state.paymentProgressInfo = playload;
  },
  saveOrderMainSn (state, playload) {
    state.order_main_sn = playload.main_sn;
  }
};


export default {
  state,
  mutations
};