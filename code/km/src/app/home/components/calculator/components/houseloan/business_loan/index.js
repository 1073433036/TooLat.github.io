import './index.scss';

export default {
  name: 'business_loan',
  data () {
    return {
      formData: {
        housePrice: '',
        downPaymentRatio: '',
        amount: '',
        mortgageYears: '',
        rate: ''
      }

    };
  },
  mounted () {

  },
  watch: {
    value1 () {
      this.formData.downPaymentRatio = this.value1;
    },
    value2 () {
      this.formData.mortgageYears = this.value2;
    }
  },
  computed: {
    value1 () {
      return this.$store.get.state.Houseloan.formData.businessDownPaymentRatio;
    },
    value2 () {
      return this.$store.get.state.Houseloan.formData.businessMortgageYears;
    }

  },
  components: {

  },
  methods: {
    //传首付比例弹框数据给父组件
    sendDownPaymentRatio (value) {
      this.$emit('sendDownPaymentRatio', value);
    }
  }
};