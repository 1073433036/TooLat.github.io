import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'carRulesQuery',
  data () {
    return {
      currentOrderId: '',
      payData: {
        goodsId: '',
      },
      peccancyList: [],
      totalCount: '',
      totalDegree: '',
      itemDetailData: {},
      checkedPeccancyList: [0],
      // wechatIndex: 0,

      isWechat: false,
      isShowPage: false,
      isShowNoPeccancyTips: false,
      isShowOrderDetail: false,
      isShowTransactionTips: false,
      isShowRepairPopup: false,

      carInfoRequstCount: 0,

      LoadingEnterType: 1,
      punishMoney: 0,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    carId () {
      return _.get(this.$store.get.state, 'CarBreak.content.carId');
    },
    carLicensePhoto () {
      return _.get(this.$store.get.state, 'CarBreak.content.carLicensePhoto');
    },
    isShowLoading () {
      return _.get(this.$store.get.state, 'Loading.isShow');
    }
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      if (!vm.carId) {
        vm.$router.push({name: 'home.AppCarBreakRules'});
      }
    });
  },
  created () {
    this.requestCarInfo();
    this.requestCarBreakInfo();
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
    //车辆信息(保存该车辆行驶证正面图片信息)
    requestCarInfo () {
      this.carInfoRequstCount += 1;
      let data = {
        id: this.carId
      };
      Models.CarBreak.carInfo(data).then( res => {
        if (1 === res.code) {
          this.$store.get.commit('saveCarLicensePhoto', {
            carLicensePhoto: res.data.car_license_photo
          });
        }
        else {
          if (1 <= this.carInfoRequstCount) {
            return;
          }
          this.requestCarInfo();
        }
      });
    },
    //车辆违章信息请求
    requestCarBreakInfo () {
      let data = {
        id: this.carId
      };
      Models.CarBreak.carBreakInfo(data).then( res => {
        this.LoadingEnterType = 2;
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          if (!res.data.total_num) {
            this.isShowNoPeccancyTips = true;
            return;
          }
          this.peccancyList = res.data.peccancy_list;
          this.totalCount = res.data.order_price;
          this.totalDegree = res.data.total_degree;
          this.isShowPage = true;

          _.each(this.peccancyList, (item) => {
            this.punishMoney += item.count ? item.count * 1 : 0;
          });
        }
        else {
          // this.$toast(res.msg);
          this.isShowNoPeccancyTips = true;
        }
      }).catch(() => {

      });
    },
    //提交订单
    submitOrder () {
      if (0 === this.carLicensePhoto) {
        return;
      }
      else if (this.carLicensePhoto) {
        this.popupTransactionTips();
      }
      else {
        this.isShowRepairPopup = true;
      }
    },
    //弹出客服二维码
    handleWechatCode () {
      // this.wechatIndex  = index;
      this.isWechat     = true;
    },
    //查看or关闭订单详情
    checkPeccancyItemDetail () {
      this.isShowOrderDetail = true;
    },
    closeOrderDetailPage () {
      this.isShowOrderDetail = false;
    },
    //办理须知
    popupTransactionTips () {
      this.isShowTransactionTips = true;
    },
    handleCancel () {
      this.isShowTransactionTips = false;
    },
    //同意办理须知，创建订单
    handleAccept () {
      this.isShowTransactionTips = false;

      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let data = {
        id: this.carId
      };
      Models.CarBreak.createOrder(data).then( res => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          this.currentOrderId = res.data.id;
          this.isShowTransactionTips = false;
          this.checkPeccancyItemDetail();
        }
        else {
          this.$toast(res.msg);
        }
      });
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
          this.payData.goodsId = res.data[0].goods_id;
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
        goods_id: self.payData.goodsId,
        vio_order_id: self.currentOrderId
      };
      Models.Order.create(data)
      .then((res) => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          self.$store.get.commit('savePayOrderId', {
            payOrderId: res.data.order_id
          });
          this.$router.push({name: 'home.AppOrderPay'});
        }
        else {
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

    //去支付
    goOrderPayPage () {
      // this.$store.get.commit('saveOrderId', {
      //   orderId: item.id
      // });
      this.$store.get.commit('saveOrderPrice', {
        orderPrice: this.totalCount
      });
      this.$store.get.commit('saveOrderDegree', {
        orderDegree: this.totalDegree
      });
      this.createOrder();
    },
  }
};