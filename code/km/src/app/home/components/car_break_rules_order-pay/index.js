import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Protocol     from '~common/components/protocol_detail';
import Models       from '~common/models';


export default {
  name: 'orderPay',
  data () {
    return {
      createMe: 0,
      isShowPage: false,
      isOpenProtocol: false,
      isShowTransactionTips: false,
      isAccept: false,
      payList: [],
      requestCount: 0,
      payMode: '',
      isCheckedStatement: []
    };
  },
  components: {
    'app-header': Header,
    Protocol
  },
  computed: {
    payOrderId () {
      return _.get(this.$store.get.state, 'CarBreak.content.payOrderId');
    },
    orderPrice () {
      return _.get(this.$store.get.state, 'CarBreak.content.orderPrice');
    },
    orderDegree () {
      return _.get(this.$store.get.state, 'CarBreak.content.orderDegree');
    }
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      if (!vm.payOrderId) {
        vm.$router.push({name: 'home.CarBreakRules'});
      }
    });
  },
  created () {
    this.requestPayType();
  },
  watch: {
  },
  methods: {
    //获取支付方式
    requestPayType () {
      let self = this;
      Models.Payment.get({
        channel: true === self.device.is('WeChat') ? 'wechat' : 'wap',
      })
      .then((res) => {
        if (1 === res.code) {
          this.payList = res.data;
          this.isShowPage = true;
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    handleAccept () {
      this.isAccept = true;
      this.isShowTransactionTips = false;
    },
    //订单支付
    confirmPay () {
      if (!this.payMode) {
        this.$toast('请选择支付方式');
        return;
      }
      else if ('agree' !== this.isCheckedStatement[0]) {
        this.$toast('请先阅读支付协议免责声明！');
        return;
      }

      if (!this.isAccept) {
        this.isShowTransactionTips = true;
        return;
      }

      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });

      let self = this;
      Models.Order.pay({
        order_id: self.payOrderId,
        pay_id  : self.payMode,
      })
      .then((res) => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          let data = res.data;
          if ('jump' === data.type && !_.isEmpty(data.url)) {
            window.location.href = data.url;
          }
          else if ('wechat' === data.type) {
            /* eslint-disable */
            new self.wechatPay(data, function (r) {
              if(r.err_msg == 'get_brand_wcpay_request:ok') {
                self.$toast('支付成功');
                setTimeout(() => {
                  self.$router.push({
                    name: 'home.CarBreakPaySuccess',
                  });
                }, 800);
              }
              else if (r.err_msg == 'get_brand_wcpay_request:cancel') {
                self.$toast('已取消支付');
              }
              else {
                self.$toast('支付失败');
              }
            });
            /* eslint-enable */
          }
          else {
            self.$toast('支付出错！');
          }
        }
        else {
          self.$toast(res.msg || '支付失败');
        }
      });
    }
  }
};