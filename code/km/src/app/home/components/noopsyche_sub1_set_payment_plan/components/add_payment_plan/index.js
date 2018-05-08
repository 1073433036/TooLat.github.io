import './index.scss';

import _                             from 'lodash';
import Header                        from '~common/components/header';
import BotSelect                     from '~common/components/bot_select';
import LocalStorage                  from '~common/services/localStorage.cookie';
import Models                        from '~common/models';
import Services                      from '~common/services';


export default {
  name: 'AddPaymentPlan',
  data () {
    return {
      formData: {
        card_no: '',
        type: '我要精养',
        paymentAmount: '',
        reservedMoney: {
          name: ''
        },
        cutAmount: '1',
        identity: '',
        income: ''
      },
      formTemp: {
        reservedMoney: [
          {
            name: '5%',
            value: 5
          },
          {
            name: '10%',
            value: 10
          }
        ]
      },
      botTitle: '预留资金选择',
      isShow: false,
      formIndex: '',
      submitCount: 0,
      minMoney: 4100,
    };
  },
  components: {
    'app-header': Header,
    BotSelect
  },
  computed: {
    reservedMoney () {
      return this.formData.reservedMoney.name;
    },
    card_no: function () {
      return _.get(this.$store.get.state, 'CultivateCard.creditCardInfo.card_no');
    },
    card_id: function () {
      return _.get(this.$store.get.state, 'CultivateCard.creditCardInfo.id');
    }
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      if (!vm.card_no) {
        vm.$router.push({name: 'home.SetPaymentPlan'});
      }
    });
  },
  mounted () {
    this.formData.card_no = this.handleCardNo(this.card_no);

    this.handleGetAddPlanInfo();

  },
  watch: {
    reservedMoney (val) {
      if ('5%' === val) {
        this.formData.cutAmount = 22;
      }
      else if ('10%' === val) {
        this.formData.cutAmount = 12;
      }
    },

    'formData.paymentAmount' (value) {
      if (this.minMoney <= value * 1 && 8200 >= value * 1) {
        this.formTemp = {
          reservedMoney: [
            {
              name: '10%',
              value: 10
            }
          ]
        };
      }
      else {
        this.formTemp = {
          reservedMoney: [
            {
              name: '5%',
              value: 5
            },
            {
              name: '10%',
              value: 10
            }
          ]
        };
      }
    },
  },
  methods: {

    // 获取历史保存资料
    handleGetAddPlanInfo () {
      let addPlanInfo = LocalStorage.get('addPlanInfo');

      if (!_.isEmpty(addPlanInfo.data)) {
        this.formData = _.assign({}, this.formData, addPlanInfo.data);
      }

    },

    // 检验输入金额
    handleChangePaymentAmount () {
      if (this.minMoney > this.formData.paymentAmount * 1) {
        this.formData.paymentAmount = '';
        this.isShow = false;
        this.$toast('由于您的账单金额较小，预留资金不能低于450，否则将无法进行正常代还，感谢您的配合！', { duration: 6000 });
        return;
      }
    },

    //提交资料，下一步
    goConfirmPlanPage () {

      if (!this.reservedMoney) {
        this.$toast('请选择预留资金');
        return;
      }

      if (!this.formData.identity) {
        this.$toast('请填写身份');
        return;
      }
      else if (!this.formData.income) {
        this.$toast('请填写年收入');
        return;
      }
      let self = this;
      if (this.submitCount) {
        this.$toast('请不要重复提交');
        return;
      }

      this.submitCount = 1;
      let data = {
        card_id: this.card_id,
        amount: parseInt(this.formData.paymentAmount).toFixed(2),
        num: this.formData.cutAmount,
        percent: this.formData.reservedMoney.value,
      };
      Models.Cultivate.addNewwPaymentPlan(data).then(res => {
        if (1 === res.code) {
          this.$store.get.commit('saveSetPaymentPlanMainInfo', {money: self.formData.paymentAmount});
          this.$store.get.commit('saveConfirmPaymentPlan', res);

          // 我也很迷糊，不知道什么鬼，只能这样去做了
          LocalStorage.set('setPaymentPlanMainInfo', {money: self.formData.paymentAmount});
          LocalStorage.set('confirmPaymentPlanInfo', res);
          LocalStorage.set('addPlanInfo', self.formData);

          this.$router.push({name: 'home.SetPaymentPlanConfirmPlan'});
        }
        else {
          this.$toast(res.msg);
          this.submitCount = 0;
        }
      });
		},
    //处理隐藏银行卡号信息
    handleCardNo (value) {
      let arr = [...value];
      let preArr = arr.slice(0, 4);
      let afterArr = arr.slice(-4);
      let midArr = arr.slice(4, arr.length - 4);
      midArr = midArr.map(function () {
        return '*';
      });
      let result = preArr.concat(midArr, afterArr);
      return result.join('');
    },
    //验证金额
    vdMoney (value) {
      let isNum = Services.Validator.money(value);
      if (!isNum) {
        this.formData.paymentAmount = value.substring(0, value.length - 1);
        this.$toast('请输入正确金额');
      }
    },

    /*分拆笔数模块*/
    subtractAmount () {

      if ( 0 === Number(this.formData.cutAmount) ) {
        this.formData.cutAmount = 0;
      }
      else {
        this.formData.cutAmount = Number(this.formData.cutAmount) - 1;
      }
      if ('5%' === this.formData.reservedMoney.name ) {
        if ( 22 >= this.formData.cutAmount) {
          this.formData.cutAmount = 22;
          return;
        }
      }
      if ('10%' === this.formData.reservedMoney.name ) {
        if ( 12 >= this.formData.cutAmount) {
          this.formData.cutAmount = 12;
          return;
        }
      }
    },

    plusAmount () {
      if ('5%' === this.formData.reservedMoney.name ) {
        if (22 <= this.formData.cutAmount) {
          this.formData.cutAmount = 22;
          return;
        }
      }
      if ('10%' === this.formData.reservedMoney.name ) {
        if (12 <= this.formData.cutAmount && 4100 <= this.formData.paymentAmount && 8200 >= this.formData.paymentAmount ) {
          this.formData.cutAmount = 12;
          return;
        }
        if (15 <= this.formData.cutAmount && 8200 <= this.formData.paymentAmount ) {
          this.formData.cutAmount = 15;
          return;
        }
      }
      this.formData.cutAmount = Number(this.formData.cutAmount) + 1;
    },

    /*选择百分比模块*/
    selectRate (index) {
      if (this.minMoney <= this.formData.paymentAmount * 1) {
        this.formIndex = index;
        this.isShow = true;
      }
		},

    botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            // this.formData.reservedMoney = obj.content;
            _.assign(this.formData, {
              [this.formIndex]: obj.content
            });
            //提交弹框选择的数据--mutation

          }
          return;
        }
      }
    }
  }
};