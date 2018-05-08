import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Banks          from '../empty_pay_banks';
import Models         from '~common/models';

export default {
  name: 'addbank',
  data () {
    return {
      state: {
        active: true,
      },
      formData:{
        cardName: '',
        card_no: '',
        cardSafeCode: '',
        cardPeriod: '',
        phone: '',
        captcha: ''
      },
      myUrl: '',
      submitStatus: 0
    };
  },
  components: {
    'app-header'    : Header,
    Banks
  },
  computed: {
    payInfo () {
      return _.get(this.$store.get.state, 'EmptyPay.payInfo');
    },
    emptyOrderData () {
      return _.get(this.$store.get.state, 'EmptyPay.emptyOrderData');
    },
    card_id () {
      return _.get(this.$store.get.state, 'EmptyPay.payInfo.depositCard');
    },
    bankName () {
      return _.get(this.$store.get.state, 'EmptyPayBanks.content.data.bank_name');
    },
    bankCardId () {
      return _.get(this.$store.get.state, 'EmptyPayBanks.content.data.id');
    },
    hasIntegralChannel () {
      if ('有积分' === this.payInfo.channelRemark) {
        return true;
      }
      else if ('无积分' === this.payInfo.channelRemark) {
        return false;
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      if (!vm.emptyOrderData.orderNum) {
        vm.$router.push({name: 'home.EmptyPay'});
      }
    });
  },
  //返回信用卡列表重新生成订单号
  beforeRouteLeave (to, from, next) {
    if ('无积分' === this.hasIntegralChannel) {
      return;
    }
    let toRouteName = to.name;
    let data = {
      price: this.payInfo.money
    };
    if ('home.EmptyPayBankList' === toRouteName) {
      Models.Pay.createOrder(data).then(res => {
        if (1 === res.code) {
          this.$store.get.commit('savePayRoadInfo', {
            orderNum: res.data.order_sn
          });
          next();
        }
      });
    }
    else {
      next();
    }
  },
  mounted () {
    let self = this;
    if (this.hasIntegralChannel) {
      this.getAddCardUrl();
    }
    //监听emptypay页面postMessage跳转回信用卡列表页
    window.addEventListener('message', (e) => {
      if ('gotopayment' === e.data) {
        self.$router.push({name: 'home.EmptyPayOrderpay'});
      }
    }, false);

  },
  watch: {
  },
  methods: {
    chnageBank () {
      this.$store.get.dispatch({
        type  : 'bankData',
        isShow: true
      });
    },
    // requestConfirmPayNoneIntegral () {
    //   let data = {
    //     card_id: this.card_id,
    //     credit_card_id: this.credit_card_id,
    //     order_sn: this.order_sn,
    //     channel_id: this.channel_id,
    //   };
    //   Models.Pay.confirmPayNoneIntegral(data).then(res => {
    //     if (1 === res.code) {
    //       this.backData = res.data.html;
    //     }
    //   });
    // },
    //支付无积分开通信用卡
    submitUserData () {
      if (true !== this.$rules.creditCard(this.formData.card_no)) {
        this.$toast('请输入正确的卡号');
        return;
      }

      if (this.submitStatus) {
        this.$toast('请不要重复提交资料');
        return;
      }
      this.submitStatus = 1;

      let data = {
        card_id: this.card_id,
        channel_id: this.emptyOrderData.channel_id,
        order_sn: this.emptyOrderData.orderNum,
        bank_id: this.bankCardId,
        card_no: this.formData.card_no
      };
      Models.Pay.addCardNoneIntegral(data).then(res => {
        if ( 1 === res.code ) {
          this.$toast(res.msg);
          this.$router.push({name: 'home.EmptyPayOrderpay'});
        }
        else {
          this.submitStatus = 0;
          this.$toast(res.msg);
        }
      }).catch(er => {
        this.$toast(er);
        this.$router.push('/');
      });
    },
    //支付有积分开通信用卡
    getAddCardUrl () {
      let data = {
        card_id: this.card_id,
        channel_id: this.emptyOrderData.channel_id,
        order_sn: this.emptyOrderData.orderNum
      };
      Models.Pay.addCardApply(data).then(res => {
        if ( 1 === res.code ) {
          this.myUrl = res.data.url;
        }
        else {
          this.$toast(res.msg);
        }
      }).catch(er => {
        this.$toast(er);
        this.$router.push('/');
      });
    }
  }
};