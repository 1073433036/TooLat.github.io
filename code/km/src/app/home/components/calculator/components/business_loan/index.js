import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import BotSelect      from '~common/components/bot_select';

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
      },
      botTitle: 'www',
      isShow: false,
      formTemp: {},
      formIndex: ''


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
      return _.get(this.$store.get.state, 'BusinessLoan.formData.businessDownPaymentRatio');
    },
    value2 () {
      return _.get(this.$store.get.state, 'BusinessLoan.formData.businessMortgageYears');
    }

  },
  components: {
    'app-header': Header,
    BotSelect
  },
  methods: {
    botSelectClick () {

    },
    //传首付比例弹框数据给父组件
    sendDownPaymentRatio (value) {
      this.$emit('sendDownPaymentRatio', value);
    }
  }
};