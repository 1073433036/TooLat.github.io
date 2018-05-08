import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Navbar         from '~common/components/navbar';
import BusinessLoan   from './business_loan';
import Combination    from './combination_loan';
import BotSelect  from '~common/components/bot_select';




export default {
  name: 'houseloan',
  data () {
    return {
      listData: ['商业贷款', '公积金贷款', '组合贷款'],
      isComponent: ['business-loan', 'business-loan', 'combination-loan'],
      componentIndex: 0,
      businessLoan: true,
      accumulationLoan: false,
      combinationLoan: false,
      formData: {
        businessLoan: {
          value: ''
        },
        accumulationLoan: {
          value: ''
        },
        downPaymentRatio: ''
      },
      formTemp: {
        downPaymentRatio: [
          {
            name: '20%（二成）',
            value: 20
          },
          {
            name: '30%（三成）',
            value: 30
          },
          {
            name: '40%（四成）',
            value: 40
          },
          {
            name: '50%（五成）',
            value: 50
          }
        ],
        mortgageYears: [],
        rateChoiceData: [
          {
            name: '自定义利率',
            value: 20
          },
          {
            name: '15年10月24日',
            value: 30
          },
          {
            name: '15年08月26日',
            value: 40
          },
          {
            name: '15年06月28日',
            value: 60
          },
          {
            name: '15年05月21日',
            value: 70
          },
          {
            name: '15年04月12日',
            value: 80
          }
        ]

      },
      botTitle: '',
      isShow: false,
      formIndex: '',
      toSubRouter: false,
      subComponentMutationVal: ''
    };
  },
  components: {
    'app-header': Header,
    navbar: Navbar,
    'business-loan': BusinessLoan,
    'combination-loan': Combination,
    BotSelect
  },
  computed: {
    business_loan () {
      return _.get(this.$store.get.state, 'Houseloan.formData.businessLoan');
    },
    accumulation_loan () {
      return _.get(this.$store.get.state, 'Houseloan.formData.accumulationLoan');
    }

  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      if (to.meta.islogin) {
        vm.toSubRouter = true;
      }
    });
  },
  beforeRouteLeave (to, from, next) {
    if (to.meta.login) {
      this.toSubRouter = true;
    }
    next();
  },
  mounted () {
    this.formTemp.mortgageYears = this.makeYears(30);
  },
  watch: {
    formIndex (value) {
      switch (value) {
        case 'downPaymentRatio':
          this.botTitle = '首付比例';
          break;
        case 'mortgageYears':
          this.botTitle = '按揭年数';
          break;
        case 'rateChoiceData':
          this.botTitle = '利率选择';
          break;
      }
    },
    $route () {
      this.toSubRouter = !this.toSubRouter;
    }
  },
  methods: {
    //变换组件
    handleSelfEvent (value) {
      switch (value) {
        case 0:
          this.businessLoan = true;
          this.accumulationLoan = false;
          this.combinationLoan = false;
          break;
        case 1:
          this.businessLoan = false;
          this.accumulationLoan = true;
          this.combinationLoan = false;
          break;
        case 2:
          this.businessLoan = false;
          this.accumulationLoan = false;
          this.combinationLoan = true;
          break;
      }
      // this.componentIndex = value;
    },
    //接收子组件传过来的字符串，选择弹框数据并显示
    handleBotSelectChange (index) {
      this.formIndex  = index;
      this.isShow     = true;

      this.subComponentMutationVal = index;
    },
    handleBotSelectChangeBusinessLoan (index) {
      this.formIndex  = index;
      this.isShow     = true;

      this.subComponentMutationVal = index + 'BusinessLoan';
    },
    handleBotSelectChangeAccumulationLoan (index) {
      this.formIndex  = index;
      this.isShow     = true;

      this.subComponentMutationVal = index + 'AccumulationLoan';
    },
    // 底部弹框
    botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            // _.assign(this.formData, {
            //   [this.formIndex]: obj.content
            // });
            //提交弹框选择的数据--mutation
            let mutationName = 'saveformData' + this.subComponentMutationVal;
            this.$store.get.commit(mutationName, obj.content);
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
    },

  }
};