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
      peccancyListId: [],
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
      record_id: '',
      isQuery: 0,
      carStatus: 0,
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
      return this.$route.query.carId;
      // return _.get(this.$store.get.state, 'CarBreak.content.carId');
    },
    carNumber () {
      return this.$route.query.carNumber;
    },
    carLicensePhoto () {
      return _.get(this.$store.get.state, 'CarBreak.content.carLicensePhoto');
    },
    isShowLoading () {
      return _.get(this.$store.get.state, 'Loading.isShow');
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next(function (vm) {
  //     if (!vm.carId) {
  //       vm.$router.push({name: 'home.CarBreakRules'});
  //     }
  //   });
  // },
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
          this.record_id = res.data.record_id;
          this.isQuery = res.data.is_query;
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
          // this.peccancyList = res.data.peccancy_list;
          this.totalCount = res.data.order_price;
          this.totalDegree = res.data.total_degree;
          this.punishMoney = res.data.total_count;
          this.isShowPage = true;
          this.carStatus = res.data.status;

          _.each(res.data.peccancy_list, (item) => {
            let data = item;
            data.status = true;
            this.peccancyList.push(data);
            this.peccancyListId.push(data.id);
          });

          // _.each(this.peccancyList, (item) => {
          //   this.punishMoney += item.count ? item.count * 1 : 0;
          // });
        }
        else if (2 === res.code) {
          this.isShowNoPeccancyTips = false;
          this.isShowRepairPopup = true;
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
      if (0 === this.peccancyListId.length) {
        this.$toast('请至少选择一个违章');
      }
      else {
        this.popupTransactionTips();
      }

      /*if (this.record_id) {
      }
      else {
        this.isShowRepairPopup = true;
      }*/
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
        id: this.carId,
        p_id: this.peccancyListId.join(',')
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
        else if (2 === res.code) {
          this.isShowRepairPopup = true;
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
          this.$router.push({name: 'home.OrderPay'});
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
    //选择处理的违章id
    selectPeccancyId (item) {
      if (item.status) {
        item.status = false;
        this.peccancyListId.splice(this.peccancyListId.indexOf(item.id), 1);
      }
      else {
        item.status = true;
        this.peccancyListId.push(item.id);
      }
    },

    //人工查询
    stayQuery () {
      let self = this;
      self.isShowNoPeccancyTips = false;
      if (this.isQuery) {
        if (0 === this.carStatus * 1) {
          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : '您已经申请过了，请稍后查看!',
            lists : [
              {
                msg: '返回',
                func () {
                  self.$router.go(-1);
                }
              },
              {
                msg: '确定',
                class: 'ok',
              },
            ]
          });
        }
        else if (2 === this.carStatus * 1) {
          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : '找不到违章信息!',
            lists : [
              {
                msg: '返回',
                func () {
                  self.$router.go(-1);
                }
              },
              {
                msg: '确定',
                class: 'ok',
              },
            ]
          });
        }
      }
      else {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: true,
        });
        Models.CarBreak
        .stayQuery({
          id: self.carId
        })
        .then((res) => {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });
          if (1 === res.code) {
            self.$store.get.dispatch({
              type  : 'handleChangeDialog',
              active: true,
              title : '温馨提示',
              msg   : '提交成功，我们将尽快处理',
              lists : [
                {
                  msg: '确定'
                },
              ]
            });
          }
          else if (2 === res.code) {
            self.isShowRepairPopup = true;
          }
          else {
            self.$toast(res.msg);
          }
        })
        .catch(() => {});
      }
    },
  }
};