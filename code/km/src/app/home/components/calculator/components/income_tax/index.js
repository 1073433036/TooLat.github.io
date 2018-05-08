import './index.scss';

import _                     from 'lodash';
import Header                from '~common/components/header';
import BotSelect             from '~common/components/bot_select';

import CalculateResult       from './components/calculate_result';
import CalculateResultDetail from './components/calculate_result_detail';
import TaxRate               from './components/tax_rate/';
import CityList     from '~common/components/city_list';


export default {
  name: 'incometax',
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
      title: '个人所得税',
      componentName: '',
      botTitle: '',
      isOther: false,
      isShow: false,
      formIndex: '',
      isTaxgPage: true,
      homePage: true

    };
  },
  computed: {
    loan_forward_province () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },
    loan_back_provice () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    }
  },
  components: {
    'app-header': Header,
    BotSelect,
    CalculateResult,
    CalculateResultDetail,
    TaxRate,
    CityList
  },
  mounted () {
    this.formTemp.loanDeadline = this.makeYears(30);
  },
  beforeRouteEnter (to, from, next) {
    let routeName = to.params.id;
    switch (routeName) {
      case 'result':
        next((vm) => {
          vm.homePage = false;
          vm.componentName = 'CalculateResult';
          vm.title = '个人所得税';
        });
        break;
      case 'resultdetail':
        next((vm) => {
          vm.homePage = false;
          vm.componentName = 'CalculateResultDetail';
          vm.title = '缴纳明细';
        });
        break;
      case 'rate':
        next((vm) => {
          vm.homePage = false;
          vm.componentName = 'TaxRate';
          vm.title = '社保及公积金缴纳';
          vm.$nextTick(function () {
            if (vm.$refs.subcomponent.isRateInputPage ) {
              vm.isOther = true;
            }
          });
        });
        break;
      default:
        next((vm) => {
          vm.homePage = true;
          vm.title = '个人所得税';
        });
    }
  },
  beforeRouteUpdate (to, from, next) {
    let routeName = to.params.id;
    switch (routeName) {
      case 'result':
        next();
        this.homePage = false;
        this.componentName = 'CalculateResult';
        this.title = '个人所得税';
        break;
      case 'resultdetail':
        next();
        this.homePage = false;
        this.componentName = 'CalculateResultDetail';
        this.title = '缴纳明细';
        break;
      case 'rate':
        next();
        this.homePage = false;
        this.componentName = 'TaxRate';
        this.title = '社保及公积金缴纳';
        //判断是否是社保公积金比例页，改变isOther值
        this.$nextTick(function () {
            if (this.$refs.subcomponent.isRateInputPage ) {
              this.isOther = true;
            }
          });
        break;
      default:
        next();
        this.homePage = true;
        this.title = '个人所得税';
    }
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
    goTaxfOrTaxgPage (event, value) {
      document.querySelector('.gone-btn').classList.remove('active-btn');
      document.querySelector('.forward-btn').classList.remove('active-btn');
      event.target.classList.add('active-btn');
      if ( 'taxgone' === value ) {
        this.isTaxgPage = true;
      }
      else if ( 'taxforward' === value ) {
        this.isTaxgPage = false;
      }
    },
    //重置数据
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
    //点击头部后退，如果是社保和公积金输入比例页面就关闭，并设置isOther(false表示点击header不会传播自定义事件)
    hanldeOther () {
      if ( 'TaxRate' === this.componentName && true === this.$refs.subcomponent.isRateInputPage ) {
        this.$refs.subcomponent.isRateInputPage = false;
        this.title = '社保及公积金缴纳';
        this.isOther = false;
      }
    },
    //监听点击TaxRate组件的item传播自定义事件,改变isOther值
    changeIsother () {
      this.isOther = true;
      this.title = '输入比例';
    },
    // 自定义筛选城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
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