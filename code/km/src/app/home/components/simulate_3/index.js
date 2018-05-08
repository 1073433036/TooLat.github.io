import './index.scss';

import                'pinyin4js';
import _              from 'lodash';
import Header         from '~common/components/header';
import Dates          from '~common/components/dates';
import Models         from '~common/models';


import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'simulate3',
  data () {
    return {
      prov: false,
      cityId: 0,
      lastId: 0,
      isShow: false,
      formData: {
        insurance             : '',
        accumulation_fund     : '',
        credit_investigation  : '',
        apply_times           : '',
        card                  : [],
        card_num              : '',
        card_money            : '',
        loan                  : '',
        loan_type             : [],

        house_loan_bank             : '',
        house_loan_repayments_time  : '',
        car_loan_bank               : '',
        car_loan_repayments_time    : '',
        credit_loan_bank            : '',
        credit_loan_repayments_time : '',
      },
      formTemp: {
        insurance : [
          {
            name: '有',
            value: 1
          },
          {
            name: '无',
            value: 2
          }
        ],
        accumulation_fund: [
          {
            name: '有',
            value: 1
          },
          {
            name: '无',
            value: 2
          }
        ],
        credit_investigation: [
          {
            name: '有逾期',
            value: 1
          },
          {
            name: '无逾期',
            value: 2
          }
        ],
        apply_times: [
          {
            name: '1次',
            value: 1
          },
          {
            name: '2次',
            value: 2
          },
          {
            name: '3次',
            value: 3
          },
          {
            name: '超过3次',
            value: 4
          },
          {
            name: '无',
            value: 0
          }
        ],
        card: [
          {
            name: '广发银行',
            value: 2
          },
          {
            name: '工商银行',
            value: 3
          },
          {
            name: '光大银行',
            value: 4
          },
          {
            name: '华夏银行',
            value: 5
          },
          {
            name: '交通银行',
            value: 6
          },
          {
            name: '民生银行',
            value: 7
          },
          {
            name: '平安银行',
            value: 8
          },
          {
            name: '浦发银行',
            value: 9
          },
          {
            name: '上海银行',
            value: 10
          },
          {
            name: '兴业银行',
            value: 11
          },
          {
            name: '招商银行',
            value: 12
          },
          {
            name: '中信银行',
            value: 13
          },
        ],
        loan: [
          {
            name: '有',
            value: 1
          },
          {
            name: '无',
            value: 2
          }
        ],
        loan_type: [
          {
            name: '房贷',
            value: 'house_loan'
          },
          {
            name: '车贷',
            value: 'car_loan'
          },
          {
            name: '信用贷款',
            value: 'credit_loan'
          }
        ]

      }
    };
  },
  components: {
    'app-header': Header,
    Dates
  },
  computed: {
  },
  filters: {
    pinyin (value) {
      /* eslint-disable */
      let data = PinyinHelper.convertToPinyinString(value, ' ', PinyinFormat.WITHOUT_TONE);
      return data.toUpperCase();
      /* eslint-enable */
    },

  },
  mounted () {

    this.$nextTick(() => {
      this.historySimulateData();
    });

  },
  watch: {
    'formData.apply_times' (val, old) {
      if (val !== old) {
        if (2 === val * 1) {
          this.dialog('您本用已经申请超过2次，建议您下个月最多再申请1次，过多的申请会影响您的征信哦，也会影响您的下卡及额度');
        }
        else if (3 <= val * 1) {
          this.dialog('您本用已经申请超过3次以上，建议您下个月再申请，过多的申请会影响您的征信哦，也会影响您的下卡及额度');
        }
      }
    },

    'formData.credit_investigation' (val, old) {
      if (val !== old) {
        if (1 === val * 1) {
          this.dialog('您的征信记录有逾期，会影响您的信用卡审批哦！请您好好维护您的信用,银行会根据您的表现酌情审核的！您可以尝试申请下哦！');
        }
      }
    }

  },
  methods: {

    dialog (msg) {
      if (!_.isEmpty(msg)) {
        this.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : msg,
          lists : [
            {
              msg: '确认',
              class: 'ok',
            },
          ]
        });
      }
    },

    // LocalStorage缓存信息
    historySimulateData () {
      let simulate  = LocalStorage.get('simulateData');
      let setp2     = _.get(simulate, 'data.setp2');
      let data      = _.get(simulate, 'data.setp3');
      if (_.isEmpty(setp2)) {
        this.$router.push({
          name: 'home.Simulate2'
        });
        return;
      }
      if (!_.isEmpty(data)) {
        this.formData = _.assign({}, this.formData, data);
      }
    },

    // 已有信用卡
    handleHaveCard (item) {

      let index = _.indexOf(this.formData.card, item);

      // _.remove(this.formData.card, el => '其他' === el);

      if (-1 === index) {
        this.formData.card.push(item);
      }
      else {
        this.formData.card.splice(index, 1);
      }

      // if ('其他' === item) {
      //   this.formData.card = [];
      //   this.formData.card.push(item);
      // }

    },


    // 贷款类型
    handleHaveLoanTye (item) {
      if (!_.isEmpty(item.value)) {
        this.formData[item.value] = item.name;
      }

      let index = _.indexOf(this.formData.loan_type, item.value);
      if (-1 === index) {
        this.formData.loan_type.push(item.value);
      }
      else {
        this.formData.loan_type.splice(index, 1);
      }
    },


    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          _.assign(this.formData, {
            birthday: obj.content
          });
          return;
        }
      }
    },

    // 销毁窗口
    dismiss () {
      this.prov = false;
    },

    // 提交表单
    handleSumbit () {
      let self = this;

      // 保险
      if (!_.isNumber(self.formData.insurance)) {
        self.$toast('请选择保险');
        return;
      }

      // 公积金
      if (!_.isNumber(self.formData.accumulation_fund)) {
        self.$toast('请选择公积金');
        return;
      }

      // 征信状况
      if (!_.isNumber(self.formData.credit_investigation)) {
        self.$toast('请选择征信状况');
        return;
      }

      // 近1个月信用卡申请记录
      if (!_.isNumber(self.formData.apply_times)) {
        self.$toast('请选择近1个月信用卡申请记录');
        return;
      }

      // 已有信用卡张数
      if (_.isEmpty(self.formData.card_num)) {
        self.$toast('请输入已有信用卡张数');
        return;
      }

      // 已有信用卡张数
      if (_.isEmpty(self.formData.card_num)) {
        self.$toast('请输入已有信用卡张数');
        return;
      }

      // 信用卡总额度
      if (_.isEmpty(self.formData.card_money)) {
        self.$toast('请输入信用卡总额度');
        return;
      }

      // 银行贷款
      if (!_.isNumber(self.formData.loan)) {
        self.$toast('请选择银行贷款');
        return;
      }

      // 贷款类型
      if (1 === self.formData.loan * 1) {
        if (_.isEmpty(self.formData.loan_type)) {
          self.$toast('请选择贷款类型');
          return;
        }

        if (-1 !== self.formData.loan_type.indexOf('house_loan')) {

          // 房贷银行
          if (_.isEmpty(self.formData.house_loan_bank)) {
            self.$toast('请输入房贷银行名称');
            return;
          }

          // 房贷银行还款次数
          if (_.isEmpty(self.formData.house_loan_repayments_time)) {
            self.$toast('请输入房贷银行还款次数');
            return;
          }
        }

        if (-1 !== self.formData.loan_type.indexOf('car_loan')) {

          // 车贷银行
          if (_.isEmpty(self.formData.car_loan_bank)) {
            self.$toast('请输入车贷银行名称');
            return;
          }

          // 车贷银行还款次数
          if (_.isEmpty(self.formData.car_loan_repayments_time)) {
            self.$toast('请输入车贷银行还款次数');
            return;
          }
        }

        if (-1 !== self.formData.loan_type.indexOf('credit_loan')) {

          // 信用贷款银行
          if (_.isEmpty(self.formData.credit_loan_bank)) {
            self.$toast('请输入信用贷款银行名称');
            return;
          }

          // 信用贷款银行还款次数
          if (_.isEmpty(self.formData.credit_loan_repayments_time)) {
            self.$toast('请输入信用贷款银行还款次数');
            return;
          }
        }
      }

      let simulate = LocalStorage.get('simulateData');
      self.formData = _.assign({}, self.formData, _.get(simulate, 'data.setp1'), _.get(simulate, 'data.setp2'));

      Models.Home
      .run(self.formData)
      .then((res) => {
        if (1 === res.code) {
          LocalStorage.remove('simulateData');
          LocalStorage.set('testBankList', res.data);
          this.$router.push({
            name: 'home.Simulate4',
          });
        }
        else {
          this.$toast(res.msh || '网络错误');
        }
      });
      return;
    }
  }
};