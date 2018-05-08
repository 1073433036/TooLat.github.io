import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'breakRulesOrder',
  data () {
    return {
      userOrderList: [],
      currentOrderId: '',
      isShowPage: false,
      checkedItem: 'all',
      orderStatus: -1,
      LoadingEnterType: 1
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    isShowLoading () {
      return _.get(this.$store.get.state, 'Loading.isShow');
    },
    isShowEmptyImg () {
      if ( _.isEmpty(this.userOrderList) ) {
        return true;
      }
      return false;
    }
  },
  created () {
    this.requestOrderList();
    this.requestGetGoods();
  },
  watch: {
    isShowLoading () {
      if (false === this.isShowLoading) {
        if (1 === this.LoadingEnterType) {
          this.$store.get.dispatch({
            type: 'Loading',
            isShow: true
          });
        }
      }
    }
  },
  methods: {
    //订单列表请求数据
    requestOrderList () {
      Models.CarBreak.orderList().then( res => {
        this.LoadingEnterType = 2;
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          this.userOrderList = res.data.data || [];
          this.isShowPage = true;
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    //处理切换tab
    handleStatus (item) {
      if (0 === item.status) {
        return '未支付';
      }
      else if (1 === item.status) {
        return '处理中';
      }
      else if (2 === item.status) {
        return '已成功';
      }
      return '';
    },
    handleOrderItemShow (item) {
      if (-1 === this.orderStatus) {
        return true;
      }
      return item.status === this.orderStatus;
    },
    tabItem (tabStr) {
      this.checkedItem = tabStr;
      if ('all' === tabStr) {
        this.orderStatus = -1;
      }
      else if ('nonpay' === tabStr) {
        this.orderStatus = 0;
      }
      else if ('handling' === tabStr) {
        this.orderStatus = 1;
      }
      else if ('success' === tabStr) {
        this.orderStatus = 2;
      }

    },
    /*去支付(流程)*/
    //获取商品
    requestGetGoods () {
      Models.Goods.list({
        params: {
          type: 5,
        },
      })
      .then((res) => {
        if (1 === res.code) {
          this.goodsId = res.data[0].goods_id;
        }
      });
    },
    //下单
    createOrder () {
      /*
       * @param goods_id int 必须
       * @param invite_code string (当type 为1 即购买会员时，invite_code 必填 )
       * @param lender_order_id int 信贷订单id (当购买信贷订单 “我要顶置” 时必填 )
       * @param vio_order_id int 违章代缴订单id (当支付违章代缴订单时必填 )
       */
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let self = this;
      let data = {
        goods_id: self.goodsId,
        vio_order_id: self.currentOrderId
      };
      Models.Order.create(data)
      .then((res) => {
        if (1 === res.code) {
          self.$store.get.commit('savePayOrderId', {
            payOrderId: res.data.order_id
          });
          self.$store.get.commit('saveOrderPrice', {
            orderPrice: res.data.total_fee
          });
          this.$router.push({name: 'home.OrderPay'});
        }
        else {
          this.$store.get.dispatch({
            type: 'Loading',
            isShow: false
          });
          this.$toast(res.msg);
        }
      })
      .catch(() => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
      });
    },
    //跳转支付页面
    goOrderPayPage (item) {
      this.currentOrderId = item.id;
      this.$store.get.commit('saveOrderId', {
        orderId: item.id
      });
      /*this.$store.get.commit('saveOrderPrice', {
        orderPrice: item.price
      });*/
      this.$store.get.commit('saveOrderDegree', {
        orderDegree: item.degree
      });
      this.createOrder();
    },

    //取消订单
    cancelOrder (item, index) {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '确定要删除该订单吗？',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确定',
            class: 'ok',
            func () {
              self.$store.get.dispatch({
                type: 'Loading',
                isShow: true,
                Text: '正在删除，请稍等...',
              });
              Models.CarBreak
              .cancelOrder({
                id: item.id
              })
              .then((res) => {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false,
                });
                if (1 === res.code) {
                  self.$toast('删除成功');
                  self.userOrderList.splice(index, 1);
                }
                else {
                  self.$toast(res.msg);
                }
              })
              .catch(() => {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false,
                });
              });
            }
          },
        ]
      });
    },
  }
};