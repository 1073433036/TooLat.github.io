import './index.scss';

import _              from 'lodash';
import Models         from '~common/models';

export default {
  name: 'payment',
  props: {
    value             : {
      type            : Boolean,
      default         : false,
    },
    price             : {
      type            : String,
      default         : '',
    },
    goodsInfo         : {
      type            : Object,
      default         : '',
    },
  },
  data () {
    return {
      visible         : false,
      payList         : '',
      payId           : 0,
      orderId         : 0,
    };
  },
  components: {
  },
  computed: {
  },
  mounted () {
    if (this.value) {
      this.visible = true;
    }
    this.getPayType();
  },
  watch: {
    value (val) {
      this.visible = val;
    },
    visible (val) {
      this.$emit('input', val);
    },
  },
  methods: {

    /*
     * 获取支付方式
     */
    getPayType () {
      let self = this;

      Models.Payment
      .get({
        channel: true === self.device.is('WeChat') ? 'wechat' : 'wap',
      })
      .then((res) => {
        if (1 === res.code) {
          this.payList = res.data;
          if (0 < this.payList.length) {
            this.payId = this.payList[0].pay_id;
          }
        }
      });
    },

    /*
     * 选择支付方式
     */
    selectPay (item) {
      this.payId     = item.pay_id;
    },

    /*
     * 立即付款
     */
    nowPay () {
      let self = this;

      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '加载中，请稍等'
      });

      self.create(() => {

        if (0 === self.payId) {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false
          });
          self.$toast('请选择支付方式');
          return;
        }

        Models.Order
        .pay({
          order_id: self.orderId,
          pay_id  : self.payId,
        })
        .then((res) => {
          self.$store.get.dispatch({
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
                      name: 'home.QueryCreditSuccess'
                    });
                  }, 2000);
                }
                else if (r.err_msg == 'get_brand_wcpay_request:cancel') {
                  self.$toast('已取消支付');
                  self.loading = false;
                }
                else {
                  self.$toast('支付失败');
                  self.loading = false;
                }
              });
              /* eslint-enable */
            }
            else {
              self.$toast('支付出错！');
            }
          }
          else {
            self.$toast(res.msg || '购买失败');
          }
        })
        .catch(() => {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false
          });
        });
      });

    },

    /*
     * 创建订单
     */
    create (callback) {
      Models.Order
      .create(this.goodsInfo)
      .then((res) => {
        if (1 === res.code) {
          this.orderId = res.data.order_id;
          if (callback && 'function' === typeof callback) {
            callback();
          }
        }
        else {
          this.$store.get.dispatch({
            type: 'Loading',
            isShow: true,
            Text: '加载中，请稍等'
          });
          this.$toast(res.msg || '购买失败');
        }
      })
      .catch(() => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
      });
    },

    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },

  },
};