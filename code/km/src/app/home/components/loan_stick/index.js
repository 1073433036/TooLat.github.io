import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Protocol       from '~common/components/protocol_detail';
import Checkbox       from '~common/components/checkbox';
import Models         from '~common/models';

export default {
  name: 'LoanStick',
  data () {
    return {
      loading          : false,
      goodsList        : [],
      formData: {
        goodsId        : 0,
        goodsPrice     : 0,
        orderId        : 0,
        payId          : 0,
        isOpenProtocol : false,
        checkFlag      : true,
        day            : 0,
      },
      formTemp: {
        payList: [],
      },
    };
  },
  components: {
    'app-header': Header,
    Protocol,
    Checkbox,
  },
  computed: {
  },
  mounted () {
    this.getGoods();
    this.getPayType();
	},
	watch: {
	},
  methods: {

    /*
     * 获取置顶商品
     */
    getGoods () {
      let self = this;
      Models.Goods
      .stickDay()
      .then((res) => {
        // console.log(res.data);
        if (1 === res.code) {
          self.goodsList = res.data;
        }
      });
    },

    /*
     * 选择置顶商品
     */
    selectGoods (goods) {
      this.formData.goodsId    = goods.__ob__.dep.id;
      this.formData.goodsPrice = goods.money;
      this.formData.day = goods.day;
    },

    /*
     * 选择支付方式
     */
    selectPay (id) {
      this.formData.payId = id;
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
        goods_id: self.formData.goodsId,
        lender_order_id: self.$route.params.id,
      })
      .then((res) => {
        if (1 === res.code) {
          self.formData.orderId = res.data.order_id;
          if (callback && 'function' === typeof callback) {
            callback();
          }
        }
      });
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
          this.formTemp.payList = res.data;
        }
      });
    },

    /*
     * 马上置顶
     */
    submit () {
      let self = this;

      if (true === self.loading) {
        self.$toast('正在提交');
        return;
      }

      if (0 === self.formData.goodsId) {
        self.$toast('请选择置顶天数');
        return;
      }

      if (0 === self.formData.payId) {
        self.$toast('请选择支付方式');
        return;
      }

      if (false === self.formData.checkFlag) {
        self.$toast('请同意支付协议');
        return;
      }

      self.loading = true;

      // self.create(() => {
        Models.Order
        .createLenderOrder({
          day : _.get(self.formData, 'day'),
        })
        .then((res) => {

          if (1 === res.code) {
            this.formData.orderId = res.data.order_id;

            Models.Order
            .pay({
              order_id: _.get(self.formData, 'orderId'),
              pay_id  : _.get(self.formData, 'payId'),
            })
            .then((res) => {
              if (1 === res.code) {
                let data = res.data;
                console.log(data);
                if ('jump' === data.type && !_.isEmpty(data.url)) {
                  window.location.href = data.url;
                }
                else if ('wechat' === data.type) {
                  /* eslint-disable */
                  new self.wechatPay(data, function (r) {
                    if(r.err_msg == 'get_brand_wcpay_request:ok') {
                      self.$toast('支付成功');
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
                }
                /* eslint-enable */
              }
              else {
                self.loading  = false;
                self.$toast('支付出错！');
              }
            });

          }
          else {
            self.loading  = false;
            self.$toast(res.msg || '购买失败');
          }
        });
      // });
    },
  },
};