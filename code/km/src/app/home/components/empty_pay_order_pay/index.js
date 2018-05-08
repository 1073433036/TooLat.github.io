import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import phoneCode      from '~common/components/phone_code';
import Models         from '~common/models';
// import LocalStorage   from '~common/services/localStorage.cookie';


export default {
  name: 'order-pay',
  data () {
    return {
      state: {
        active: true,
      },
      callBackData: '',
      formData: {
        amount: '',
        name: '',
        card_no: '',
        phone: ''
      },
      postMessageData: {},
      captcha: '',
      showPage: true,
      isRepeatPay: false,
      phoneText: '获取验证码',
      active: false
    };
  },
  components: {
    'app-header'    : Header,
    phoneCode,
  },
  computed: {
    paymentTx () {
      if (this.isRepeatPay) {
        return '正在支付';
      }
      return '确定支付';
    },
    channelRemark () {
      return _.get(this.$store.get.state, 'EmptyPay.payInfo.channelRemark');
    },
    order_sn () {
      return _.get(this.$store.get.state, 'EmptyPay.emptyOrderData.orderNum');
    },
    card_id () {
      return _.get(this.$store.get.state, 'EmptyPay.payInfo.depositCard');
    },
    credit_card_id () {
      return _.get(this.$store.get.state, 'EmptyPay.emptyOrderData.creditCardInfo.credit_card_id');
    },
    channel_id () {
      return _.get(this.$store.get.state, 'EmptyPay.emptyOrderData.channel_id');
    },
    hasIntegral () {
      if ('有积分' === this.channelRemark) {
        return true;
      }
      else if ('无积分' === this.channelRemark) {
        return false;
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    let fromRouteName = from.name;

    if ('home.EmptyPayBankList' === fromRouteName || 'home.EmptyPayBankAdd' === fromRouteName) {
      next(function (vm) {
        if (vm.order_sn && vm.hasIntegral) {
          vm.getPayInfoRequest();
        }
        else if (!vm.hasIntegral) {
          vm.requestConfirmPayNoneIntegral();
        }
        else {
          vm.$router.push({name: 'home.EmptyPay'});
        }
      });
    }
    else {
      next({name: 'home.EmptyPay'});
    }
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    //处理字符串
    handleGetString (str) {
      let pattern = /<form[\s\S]+<\/form>/;
      let formStr = pattern.exec(str);
      return null === formStr ? '' : formStr[0];
    },
    //无积分支付跳转
    requestConfirmPayNoneIntegral () {
      let data = {
        card_id: this.card_id,
        credit_card_id: this.credit_card_id,
        order_sn: this.order_sn,
        channel_id: this.channel_id,
      };
      Models.Pay.confirmPayNoneIntegral(data).then(res => {
        if (1 === res.code) {
          this.callBackData = this.handleGetString(res.data.html);
          this.$nextTick(function () {
            setTimeout(() => {
              let formElem = document.querySelector('#form');
              if (formElem) {
                formElem.submit();
              }
            }, 200);
          });
        }
        else {
          this.$toast(res.msg);
        }
      });
    },

    //获取订单页信息
    getPayInfoRequest () {
      let data = {
        params: {
          order_sn: this.order_sn,
          credit_card_id: this.credit_card_id
        }
      };
      Models.Pay.getPayInfo(data).then(res => {
        if ( 1 === res.code ) {
          this.formData = Object.assign({}, this.formData, res.data);
          this.showPage = true;
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    //验证码计时
    PhoneTimer () {
      let self = this;
      let times = 60;
      function loops () {
        setTimeout(() => {
          if (0 >= times) {
            self.phoneText = '获取验证码';
            self.active = false;
            return;
          }
          let num = -- times;
          self.phoneText = `(${num}s)重新获取`;
          self.active = true;
          loops();
        }, 1000);
      }
      loops();
    },
    //获取银行验证码
    getCaptcha () {
      if (this.active) {
        return;
      }
      let data = {
        card_id: this.card_id,
        credit_card_id: this.credit_card_id,
        order_sn: this.order_sn,
        channel_id: this.channel_id
      };
      Models.Pay.getPayCaptcha(data).then(res => {
        if (1 === res.code) {
          this.PhoneTimer();
        }
        this.$toast(res.msg);
      });
    },
    //提交支付
    confirmPay () {
      let self = this;
      let data = {
        card_id: this.card_id,
        credit_card_id: this.credit_card_id,
        order_sn: this.order_sn,
        channel_id: this.channel_id,
        code: this.captcha
      };
      if (!self.isRepeatPay) {
        Models.Pay.confirmPay(data).then(res => {
          if ( 1 === res.code) {
            self.requestpaySuccess();
          }
          else {
            self.$toast(res.msg);
            self.isRepeatPay = false;
          }
        }).catch(function (er) {
          self.isRepeatPay = false;
          self.$toast(er);
        });
      }
      else {
        self.$toast('请不要重复提交');
      }
      self.isRepeatPay = true;
    },
    //支付成功
    requestpaySuccess () {
      let data = {
        card_id: this.card_id,
        order_sn: this.order_sn,
        channel_id: this.channel_id,
      };
      Models.Pay.paySuccess(data).then(res => {
        this.$toast(res.msg);
        if ( 1 === res.code ) {
          this.$router.push({name: 'home.EmptyPaySuccess'});
        }
      });
    }

  }
};