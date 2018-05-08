import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import BotSelect      from '~common/components/bot_select';

export default {
  name: 'carloan',
  data () {
    return {
      formData: {
        downPaymentRate: {},
        installment: {},
        amount: ''
        // loanAmount: '',
        // loanDeadline: {},
        // monthRate: '',
        // repayment: '',
        // amountInterest: '',

      },
      formTemp: {
        downPaymentRate: [
          {
            name: '30%',
            value: 30
          },
          {
            name: '40%',
            value: 40
          },
          {
            name: '50%',
            value: 50
          },
          {
            name: '60%',
            value: 60
          }
        ],
        installment: []
      },
      extraPay: '0.00元',
      loanLimit: '0.00元',
      botTitle: '',
      isShow: false,
      formIndex: '',


    };
  },
  components: {
    'app-header': Header,
    BotSelect
  },
  computed: {
  },
  mounted () {
    this.formTemp.installment = this.makeYears(10);
  },
  watch: {
    formIndex (value) {
      switch (value) {
        case 'downPaymentRate':
          this.botTitle = '首付选择';
          break;
        case 'installment':
          this.botTitle = '月供选择';
          break;
      }
    }
  },
  methods: {
    handleBotSelectChange (index) {
      this.formIndex = index;
      this.isShow = true;
    },
    botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content
            });
            //提交弹框选择的数据--mutation

          }
          return;
        }
      }
    },
    makeYears (sum) {
      let arr = [];
      let obj = {
        name: '',
        value: ''
      };
      for (let i = 0; i < sum; i ++) {
        obj.name = i + 1 + '年';
        obj.value = i;
        let newObj = Object.assign({}, obj);
        arr.push(newObj);
      }
      return arr;
    }
  }
};