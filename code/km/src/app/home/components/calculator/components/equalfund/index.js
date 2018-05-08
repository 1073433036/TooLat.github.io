import './index.scss';

import _                    from 'lodash';
import Header               from '~common/components/header';
import BotSelect            from '~common/components/bot_select';
import CalculateLoanResult  from '../calculate_loan_result';

export default {
  name: 'equalfund',
  data () {
    return {
      formData: {
        loanAmount: '',
        loanDeadline: {},
        monthRate: '',
        repayment: '',
        amountInterest: '',
        amount: ''

      },
      formTemp: {
        loanDeadline: []
      },
      botTitle: '',
      isShow: false,
      formIndex: '',
      isCalculate: true,
      title: '等额本金计算器'
    };
  },
  components: {
    'app-header': Header,
    BotSelect,
    CalculateLoanResult
  },
  computed: {
  },
  mounted () {
    this.formTemp.loanDeadline = this.makeYears(30);
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      vm.$router.push({name:'home.Equalfund', params:{id:'home'}});
      vm.isCalculate = false;
      vm.title = '等额本金计算器';
    });

  },
  beforeRouteUpdate (to, from, next) {
    this.isCalculate = !this.isCalculate;
    if (this.isCalculate) {
      this.title = '信贷工具';
    }
    else {
      this.title = '等额本金计算器';
    }
    next();
  },
  watch: {
    formIndex (value) {
      switch (value) {
        case 'loanDeadline':
          this.botTitle = '贷款期限';
          break;
      }
    }
  },
  methods: {
    handlereset () {
      let datas = Object.keys(this.formData);
      datas.forEach((item) => {
        if (typeof this.formData[item] === Object) {
          this.formData[item] = {};
        }
        else {
          this.formData[item] = '';
        }
      });
    },
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