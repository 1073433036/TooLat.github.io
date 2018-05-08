import './index.scss';
import Header           from '~common/components/header';
import Models           from '~common/models';
import _                from 'lodash';

export default {
  name: 'CarBreakOrderConfirm',
  data () {
    return {
      breakRules: [],
      cid: '',
      carNumber: '',
      isPaying: false,
      payTypeData: [],
      formData: {},
      orderId: undefined,
      loading: false,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    isAllSelected () {
      let flag = true;
      for (let el of this.breakRules) {
        if (!el.selected) {
          flag = false;
          break;
        }
      }
      return flag;
    },

    countOfSelected () {
      let count = 0;
      for (let el of this.breakRules) {
        if (el.selected) {
          count += 1;
        }
      }
      return count;
    },

    pointOfSelected () {
      let point = 0;
      for (let el of this.breakRules) {
        if (el.selected) {
          point += el.actual_degree;
        }
      }
      return point;
    },

    priceOfSelected () {
      let price = 0;
      for (let el of this.breakRules) {
        if (el.selected) {
          price += el.count + el.latefine;
        }
      }
      return price;
    },

    servicePriceOfSelected () {
      let price = 0;
      for (let el of this.breakRules) {
        if (el.selected) {
          price += el.servicePrice;
        }
      }
      return price;
    },

    hasSelected () {
      let flag = false;
      for (let el of this.breakRules) {
        if (el.selected) {
          flag = true;
          break;
        }
      }
      return flag;
    }
  },
  mounted () {
    let carSelected = this.$store.get.state.CarBreakInfo.carSelected;
    this.cid = carSelected.cid;
    if (!this.cid) {
      this.$router.replace({ name: 'home.CarBreak' });
      return;
    }
    this.carNumber = carSelected.carNumber;

    let info = this.$store.get.state.CarBreakInfo.violation;
    let data = info[this.cid] || {};
    data = JSON.parse(JSON.stringify(data));
    let orderSelected = this.$store.get.state.CarBreakInfo.orderSelected;

    let breakRules = [];
    if (data.peccancy_list && data.peccancy_list.length) {
      for (let el of data.peccancy_list) {
        if (orderSelected.includes(el.violation_id)) {
          el.selected = true;
          breakRules.push(el);
        }
      }
    }
    this.breakRules = breakRules;

    this.payment();
  },
  watch: {
  },
  methods: {
    // 获取支付方式
    payment () {
      Models.Payment
      .get({
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

    // 选中取消
    toggleSingle (el) {
      if (el.can_process === 0) {
        this.$toast('该违章不支持代办');
        return;
      }
      el.selected = !el.selected;
    },

    // 全选取消
    toggleAllSelected () {
      let flag = !this.isAllSelected;
      for (let el of this.breakRules) {
        el.selected = flag;
      }
    },

    // 生成订单
    async createOrder () {
      if (!this.hasSelected) {
        return;
      }
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在生成订单',
      });

      let orderList = [];
      for (let el of this.breakRules) {
        if (el.selected) {
          orderList.push(el.violation_id);
        }
      }

      let res = await Models.CarVio.createOrder({
        car_id: this.cid,
        violation_id: orderList
      });
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: false
      });
      if (res.code === 1) {
        this.orderId = res.data.order_id;
        this.$toast('生成订单成功');
        setTimeout(() => {
          this.isPaying = true;
        }, 500);
      }
      else {
        this.$toast(res.msg);
      }
    },

    // 立即支付
    handleSumbitPay () {
      if (true === this.loading) {
        this.$toast('正在提交');
        return;
      }

      this.loading = true;
      let self = this;

      Models.Order
      .pay({
        order_id: self.orderId,
        pay_id  : self.formData.pay_id
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
  },
};
