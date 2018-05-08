
const state = {
  content: {
    payOrderId: '',

    carId: '',
    orderId: '',
    carLicensePhoto: 0,
    orderDegree: '',
    orderPrice: ''
  }
};

const mutations = {
  savePayOrderId (state, playload) {
    state.content.payOrderId = playload.payOrderId;
  },
  saveCarId (state, playload) {
    state.content.carId = playload.carId;
  },
  saveOrderId (state, playload) {
    state.content.orderId = playload.orderId;
  },
  saveCarLicensePhoto (state, playload) {
    state.content.carLicensePhoto = playload.carLicensePhoto;
  },
  saveOrderDegree (state, playload) {
    state.content.orderDegree = playload.orderDegree;
  },
  saveOrderPrice (state, playload) {
    state.content.orderPrice = playload.orderPrice;
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