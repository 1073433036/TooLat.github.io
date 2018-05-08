import './index.scss';

import _              from 'lodash';
import Models         from '~common/models';

export default {
  name: 'payment',
  props: {
    value: {
      type            : Boolean,
      default         : false,
    }
  },
  data () {
    return {
      visible         : false,
      loading         : false,
      /*
       * @param       payState          支付模态框
       * @param       payType           支付类型
       * @param       successState      支付成功页面
       * @param       goodsList         商品列表
       * @param       goodsId           商品id
       * @param       goodsPrice        商品价格
       * @param       payList           支付方式列表
       * @param       payId             支付方式id
       * @param       payName           支付方式名称
       * @param       orderId           订单id
       */
      payState        : true,
      payType         : false,
      successState    : false,
      goodsList       : '',
      goodsId         : 0,
      goodsPrice      : '',
      payList         : '',
      payId           : 0,
      payName         : '',
      orderId         : 0,
    };
  },
  components: {
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
    if (this.value) {
      this.visible = true;
    }
    this.getGoods();
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
     * 获取商品
     */
    getGoods () {
      let self = this;
      Models.Goods
      .list({
        params: {
          type: 4,
        },
      })
      .then((res) => {
        if (1 === res.code) {
          self.goodsList = res.data;
        }
      });
    },

    /*
     * 选择商品
     */
    selectGoods (goods) {
      this.goodsId    = goods.goods_id;
      this.goodsPrice = goods.price;
    },

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
        }
      });
    },

    /*
     * 选择支付方式
     */
    selectPay (item) {
      this.payId     = item.pay_id;
      this.payName   = item.pay_name;
      this.payState  = true;
      this.payType   = false;
    },

    /*
     * 立即投保
     */
    nowInsure () {
      let self = this;

      if (true === self.loading) {
        self.$toast('正在提交');
        return;
      }

      if (0 === self.goodsId) {
        self.$toast('请选择保险类型');
        return;
      }

      self.loading = true;

      self.create(() => {

        if (0 === self.payId) {
          self.$toast('请选择支付方式');
          return;
        }

        Models.Order
        .pay({
          order_id: self.orderId,
          pay_id  : self.payId,
        })
        .then((res) => {
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
                  self.payState         = false;
                  self.payType          = false;
                  self.successState     = true;

                  setTimeout(() => {
                    self.$router.push({
                      name: 'home.SetPaymentPlan'
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
              self.loading  = false;
              self.$toast('支付出错！');
            }
          }
          else {
            self.loading  = false;
            self.$toast(res.msg || '购买失败');
          }
        })
        .catch(() => {
          self.loading = false;
        });
      });

    },

    /*
     * 创建订单
     */
    create (callback) {
      let self = this;

      /*
       * @param goods_id int 必须
       * @param invite_code string (当type 为1 即购买会员时，invite_code 必填 )
       * @param lender_order_id int 信贷订单id (当购买信贷订单 “我要顶置” 时必填 )
       */

      Models.Order
      .create({
        goods_id: self.goodsId,
      })
      .then((res) => {
        if (1 === res.code) {
          if (1 === res.data.is_paid) {
            self.payState         = false;
            self.payType          = false;
            self.successState     = true;
          }
          else {
            self.orderId = res.data.order_id;
            if (callback && 'function' === typeof callback) {
              callback();
            }
          }
        }
        else {
          self.loading  = false;
          self.$toast(res.msg);
        }
      });
    },

    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },

  },
  filters: {
    levelText (value) {
      let name = '';
      switch (value) {
        case 1:
          name = '普通会员';
          break;
        case 2:
          name = '高级会员';
          break;
        case 3:
          name = '专员';
          break;
        case 4:
          name = '经理';
          break;
        case 5:
          name = '个人代理';
          break;
        case 6:
          name = '区域代理';
          break;
      }
      return name;
    },
  },
};