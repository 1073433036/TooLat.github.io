import './index.scss';

import _                        from 'lodash';
import Header                   from '~common/components/header';
import PaymentSuccess           from '../pay_success';
import Protocol                 from '~common/components/protocol_detail';
import ProtocolOwner            from '~common/components/protocol_detail_owner';
import LocalStorage             from '~common/services/localStorage.cookie';
import Models                   from '~common/models';


export default {
  name: 'AddPaymentPlan',
  data () {
    return {
      formData: {
        onceMaxMoney: '',
        paymentRate: '',
        PaymentPlanAmount: '',
        serviceCharge: '',
        planDays: '',
        count: ''
      },
      paymentMsg: [],
      radioCheckedNum: '',
      submitCount: 0,
      isShowPreviousPlan: false,

      paymentPlanData: {
        paymentType: '我要精养',
        money: '',
        onceMaxMoney: '1018.05',
        paymentRate: '0.45%+1',
        PaymentPlanAmount: '￥5032.8',
        serviceCharge: '￥32.8'
      },
      paymentMsg1: [
        {
          time: '1/5',
          paymentMoney: '￥1018.58',
          paymentDate: '2017-12-06 10:24:52',
          state: '未执行'
        },
        {
          time: '2/5',
          paymentMoney: '￥1018.58',
          paymentDate: '2017-12-06 10:24:52',
          state: '未执行'
        },
        {
          time: '3/5',
          paymentMoney: '￥1018.58',
          paymentDate: '2017-12-06 10:24:52',
          state: '未执行'
        }
      ],

      requestCount: {
        paymentProgressListCount: 0
      }
    };
  },
  components: {
    'app-header': Header,
    PaymentSuccess,
    Protocol,
    ProtocolOwner
  },
  computed: {
    money () {
      let data = LocalStorage.get('setPaymentPlanMainInfo');
      return _.get(data, 'data.money') || _.get(this.$store.get.state, 'CultivateCard.setPaymentPlanMainInfo.money');
    },
    stateCode () {
      let data = LocalStorage.get('confirmPaymentPlanInfo') || {};
      return _.get(data, 'data.code') || _.get(this.$store.get.state, 'CultivateCard.confirmPaymentPlanInfo.stateCode');
    },
    confirmPay_one () {
      let data = LocalStorage.get('confirmPaymentPlanInfo') || {};
      return _.get(data, 'data.data.1') || _.get(this.$store.get.state, 'CultivateCard.confirmPaymentPlanInfo.paymentType_one');
    },
    confirmPay_two () {
      let data = LocalStorage.get('confirmPaymentPlanInfo') || {};
      return _.get(data, 'data.data.2') || _.get(this.$store.get.state, 'CultivateCard.confirmPaymentPlanInfo.paymentType_two');
    },
    confirmPay_three () {
      let data = LocalStorage.get('confirmPaymentPlanInfo') || {};
      return _.get(data, 'data.data.3') || _.get(this.$store.get.state, 'CultivateCard.confirmPaymentPlanInfo.paymentType_three');
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next(function (vm) {
  //     if (1 !== vm.stateCode) {
  //       vm.$router.push({name: 'home.SetPaymentPlanAddplan'});
  //     }
  //   });
  // },
  mounted () {
    this.radioCheckedNum = '1';
    // this.requestPaymentProgressList();
  },
  watch: {
    radioCheckedNum (val) {
      if ('1' === val) {
        this.sendPlanData(this.confirmPay_one);
      }
      else if ('2' === val) {
        this.sendPlanData(this.confirmPay_two);
      }
      else if ('3' === val) {
        this.sendPlanData(this.confirmPay_three);
      }
    }
  },
  methods: {
    //往期还款进度列表数据
    // requestPaymentProgressList () {
    //   Models.Cultivate.paymentProgressList().then( res => {
    //     this.requestCount.paymentProgressListCount += 1;
    //     // if (1 === res.code) {

    //     // }
    //   });
    // },
    goOtherPlanPage (val) {
      let self = this;
      let route = {};
      let msg   = '';

      switch (val) {
        case 'modify':
          route = {name: 'home.SetPaymentPlanAddplan'};
          msg   = '修改';
        break;
        case 'cancel':
          route = {name: 'home.SetPaymentPlan'};
          msg   = '取消';
        break;
      }

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : `是否要${msg}精养计划？`,
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确认',
            class: 'ok',
            func () {
              self.$router.push(route);
            }
          },
        ]
      });
    },

    //radioChange函数
    sendPlanData (orderNum) {
      let self = this;

      if (_.isEmpty(orderNum)) {
        self.$toast('请先设置精养卡计划');
        setTimeout(() => {
          self.$router.push({name: 'home.SetPaymentPlan'});
        }, 2000);
        return;
      }
      self.formData.onceMaxMoney = orderNum.max_pay_amount;
      self.formData.paymentRate = orderNum.fee_rate;
      self.formData.PaymentPlanAmount = orderNum.total;
      self.formData.serviceCharge = orderNum.fee_price;
      self.formData.planDays = orderNum.days;
      self.formData.count = orderNum.num;
      self.paymentMsg = orderNum.orders;
    },

    //orders的status处理
    handleOrderState (value) {
      if (0 === value) {
        return '未执行';
      }
      else if (1 === value) {
        return '已完成';
      }
      else if (2 === value) {
        return '失败';
      }
    },

    //往期计划关闭
    hiddenPreviousPage () {
      this.isShowPreviousPlan = false;
    },
    //开启RO关闭支付弹框
    // closePayPopup () {
    //   this.isShowPasswordInput = false;
    // },
    // openPaySuccessPage () {
    //   this.isPaySuccess = true;
    // },
    // //open协议
    // openCardProtocol (item) {
    //   if ('card' === item) {
    //     this.isOpenProtocol = true;
    //   }
    //   else if ('owner' === item) {
    //     this.isOpenOwnerProtocol = true;
    //   }
    // },
    //接受支付协议，提交申请，跳转支付页面
    sumitPayPlan () {
      let self = this;

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '是否要启动精养计划？',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确认',
            class: 'ok',
            func () {
              if (self.submitCount) {
                self.$toast('请不要重复提交');
                return;
              }

              self.$store.get.dispatch({
                type: 'Loading',
                Text: '正在提交...',
                isShow: true,
              });

              self.submitCount = 1;

              let data = {
                id: parseInt(self.radioCheckedNum)
              };
              Models.Cultivate.confirmPlan(data).then(res => {
                if (1 === res.code) {
                  if ('pay' === res.data.action) {
                    self.$toast('支付成功');
                    self.$router.push({name: 'home.SetPaymentPlanPaySuccess'});
                  }
                  else if ('project' === res.data.action) {
                    self.$toast('计划定制成功');
                    self.$router.push({name: 'home.PaymentProgress'});
                  }

                  LocalStorage.remove('setPaymentPlanMainInfo');
                  LocalStorage.remove('confirmPaymentPlanInfo');
                  LocalStorage.remove('addPlanInfo');
                }
                else {
                  self.$toast(res.msg || '请求超时');
                  self.submitCount = 0;
                }

                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false,
                });
              });
            }
          },
        ]
      });
    }
  }
};