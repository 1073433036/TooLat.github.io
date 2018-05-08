import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';
import CarPayOype   from '~common/components/car_pay_type';
export default {
  name: 'carBreakRulesAllorder',
  data () {
    return {
      orderStatus: [
        { key: 'all', text: '全部' },
        { key: 0, text: '待支付', num: 0, color: '#ff4840' },
        { key: 1, text: '已付款', num: 0, color: '#f8b010' },
        { key: 2, text: '办理中', num: 0, color: '#f8b010' },
        // { key: 3, text: '已退款' },
        { key: 4, text: '已完成', num: 0, color: '#77c99b' },
      ],
      statusSelected: 'all',
      orderList: [],
      orderListForPay: {},
      payTypeData: [],
      formData: {},
      isDelPopupShow: false,
      loading: false,

      Showpay: false,
      formIndex: '',
      formTemp       : {
        pay      : [
          {
            name: '全额支付',
            value: 9,
          },
          {
            name: '微信支付',
            value: 10,
          },
          {
            name: '支付宝支付',
            value: 11,
          },
        ],
      },
      isPaying: false,
    };
  },
  components: {
    'app-header': Header,
     CarPayOype,
  },
  computed: {
  },
  mounted () {
    this.getOrderList();
    this.payment();
  },
  watch: {
    statusSelected () {
      this.getOrderList();
    }
  },
  methods:{
    // 获取订单
    async getOrderList () {
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在加载'
      });
      let params = {};
      if (this.statusSelected !== 'all') {
        params = { status: this.statusSelected };
      }
      let s = this.statusSelected;
      let res = await Models.CarVio.orderList({ params });
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: false
      });
      if (res.code === 1) {
        this.orderList = res.data.data;

        if (s === 'all') {
          for (let el of this.orderStatus) {
            if (el.num) {
              el.num = 0;
            }
          }
          for (let opt of this.orderList) {
            let item = this.orderStatus.find(el => el.key === opt.status);
            if (item) {
              item.num ++;
            }
          }
        }
      }
      else {
        this.$toast(res.msg || '数据获取失败');
      }
    },

    // 获取状态中文名称
    getStatusText (key) {
      let str = '';
      let item = this.orderStatus.find(el => el.key === key);
      if (item) {
        str = item.text;
      }
      return str;
    },

    // 获取支付方式
    payment () {
      Models.Payment.get({
        channel: true === this.device.is('WeChat') ? 'wechat' : 'wap',
      })
      .then((res) => {
        if (1 === res.code) {
          let arr = [];
          for (let el of res.data) {
            if (el.type === 'wechat') {
              arr.unshift(el);
            }
            else {
              arr.push(el);
            }
          }
          this.payTypeData = arr;
          for (let el of this.payTypeData) {
            if (el.type === 'wechat') {
              this.formData = el;
              break;
            }
          }
          if (!Object.keys(this.formData).length) {
            this.formData = this.payTypeData[0];
          }
        }
      });
    },

    // 选择新的支付方式
    handleSelectType (data) {
      if (this.formData.pay_id !== data.pay_id) {
        this.formData = data;
      }
    },

    // 立即支付
    CarPayOypeClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Showpay = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.userInfo, {
              [this.formIndex]: obj.content.name
            });
          }
          return;
        }
      }
    },

    // 打开支付方式弹窗
    handlePayClick (el) {
      this.orderListForPay = el;
      this.isPaying = true;
    },

    // 立即支付
    handleSumbitPay () {
      if (true === this.loading) {
        this.$toast('正在提交');
        return;
      }

      let self = this;

      Models.Order.pay({
        order_id: self.orderListForPay.pay_order_id,
        pay_id  : self.formData.pay_id
      }).then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if ('jump' === data.type && !_.isEmpty(data.url)) {
            window.location.href = data.url;
          }
          else if ('wechat' === data.type) {
            /* eslint-disable */
            new self.wechatPay(data, function (r) {
              if(r.err_msg == 'get_brand_wcpay_request:ok') {
                self.$store.get.dispatch({
                  type  : 'handleChangeDialog',
                  active: true,
                  title : '提示',
                  msg   : '支付成功',
                  lists : [
                    {
                      msg: '确定',
                      class: 'ok',
                      async func () {
                        self.$router.replace({ name: 'home.CarBreakPayResult', query: { isSuccess: true } });
                      }
                    },
                  ]
                });
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
      });
    }

  }
};
