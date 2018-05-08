import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import BotSelect      from '~common/components/bot_select';

export default {
  name: 'carloan',
  data () {
    return {
      formData: {
        loanAmountPageData: {
          loanAmount: '',
          loanDeadline: {},
          loanRate: ''
        },
        areaPageData: {
          unit: '',
          proportion: '',
          houseNum: '1',
          loanDeadline: {},
        }

      },
      formTemp: {
        loanDeadline: []
      },
      botTitle: '',
      isShow: false,
      formIndex: '',
      isLoanPage: true

    };
  },
  components: {
    'app-header': Header,
    BotSelect
  },
  computed: {
  },
  mounted () {
    this.formTemp.loanDeadline = this.makeYears(30);
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
    goLoanOrAreaPage (event, value) {
      document.querySelector('.loan-btn').classList.remove('active-btn');
      document.querySelector('.area-btn').classList.remove('active-btn');
      event.target.classList.add('active-btn');
      if ( 'loan' === value ) {
        this.isLoanPage = true;
      }
      else if ( 'area' === value ) {
        this.isLoanPage = false;
      }
    },
    handlereset (resetName) {
      let loanAmountPageDatas = this.formData[resetName];
      let loanDatas = Object.keys(loanAmountPageDatas);
      loanDatas.forEach((item) => {
        if (typeof loanAmountPageDatas[item] === Object) {
          loanAmountPageDatas[item] = {};
        }
        else {
          loanAmountPageDatas[item] = '';
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
            if (this.isLoanPage) {
              _.assign(this.formData.loanAmountPageData, {
                [this.formIndex]: obj.content
              });
              //提交弹框选择的数据--mutation
            }
            else {
              _.assign(this.formData.areaPageData, {
                [this.formIndex]: obj.content
              });
            }

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