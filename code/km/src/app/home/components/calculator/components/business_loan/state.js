
const state = {
  formData: {
    businessLoan: {
      downPaymentRate: '',
      mortgageYears: '',
      interestRate: ''
    },
    accumulationLoan: {
      downPaymentRate: '',
      mortgageYears: '',
      interestRate: ''
    },
    combinationLoan: {
      businessMortgageYears: '',
      businessInterestRate: '',
      accumulationMortgageYears: '',
      accumulationInterestRate: ''
    }
  }
};

const mutations = {
  saveformDatadownPaymentRatioBusinessLoan (state, options) {
    state.formData.businessDownPaymentRatio = options.name;
  },
  saveformDatadownPaymentRatioAccumulationLoan (state, options) {
    state.formData.accumulationDownPaymentRatio = options.name;
  },
  saveformDatamortgageYears (state, options) {
    state.formData.businessMortgageYears = options.name;
  }
};

export default {
  state,
  mutations
};