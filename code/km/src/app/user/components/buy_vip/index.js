import './index.scss';
import 'swiper/dist/css/swiper.css';

import _ from 'lodash';
import Swiper from 'swiper';
import Header from '~common/components/header';
import PayType from '~common/components/pay_type';
import Models from '~common/models';
import LocalStorage from '~common/services/localStorage.cookie';

export default {
  name: 'BuyVip',
  data () {
    return {
      showInterval: false,
      intervalNum: 6,
      isShowTeamExplain: false,
      isShowDepositExplain: false,
      isShowOtherDetail: false,
      isShow: false,
      isMaskVip: false,
      isShowInviteCode: true,
      loading: false,
      isExplain: false,
      invite_code: '',
      explainImg: '',
      currentData: {},
      formData: {
        goods: {},
      },
      formTemp: {
        data: [],
      },
      // starNum: 0,
      swiperOption: {
        notNextTick: true,
        autoplay: false,
        grabCursor: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        mousewheelControl: false,
        observeParents: true,
        loop: false,
      },
      order_id: '',
      explain: {
        carCount: '',
        times: 15,
        investment: '',
        price: '',
      },

      query: {},
      isShare: false,

    };
  },
  components: {
    'app-header': Header,
    PayType,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo');
    },

    isWechatClient () {
      return this.device.is('WeChat');
    },
  },
  mounted () {
    /* eslint-disable */
    let swiper = new Swiper(this.$refs.swiperCart, this.swiperOption);
    /* eslint-enable */
    this.goodsList();

    if (true === this.device.is('WeChat')) {
      this.checkOpenid();
    }
  },
  watch: {
    invite_code () {
      this.formData.goods = _.assign({}, this.formData.goods, {
        invite_code: this.invite_code,
      });
    },
  },
  filters: {
    time (value) {
      let data = `${value}月`;
      switch (value) {
        case -1:
          data = '永久有效';
          break;
      }
      return data;
    },
  },
  methods: {

    showUserDialog () {
      let self = this;
      self.$store.get.dispatch({
        type: 'handleChangeDialog',
        active: true,
        title: '温馨提示',
        msg: '请先完善个人资料',
        lists: [
          {
            msg: '取消',
          },
          {
            msg: '去完善',
            class: 'ok',
            func () {
              self.$router.push({name: 'user.Profile', query: {dt: self.$route.path}});
            },
          },
        ],
      });
    },

    handleItemBoxBg (item) {
      if (1 === item.insurance_level * 1) {
        return 'item-box-bg1';
      }
      else if (2 === item.insurance_level * 1) {
        return 'item-box-bg2';
      }
      else if (3 === item.insurance_level * 1) {
        return 'item-box-bg3';
      }
    },

    handleBtnBg (item) {
      if (1 === item.insurance_level * 1) {
        return 'item-btn-bg1';
      }
      else if (2 === item.insurance_level * 1) {
        return 'item-btn-bg2';
      }
      else if (3 === item.insurance_level * 1) {
        return 'item-btn-bg3';
      }
    },

    handleTxColor (item) {
      if (1 === item.insurance_level * 1) {
        return 'tx-color1';
      }
      else if (2 === item.insurance_level * 1) {
        return 'tx-color2';
      }
      else if (3 === item.insurance_level * 1) {
        return 'tx-color3';
      }
    },

    handleStarNum (item) {
      if (1 === item.insurance_level * 1) {
        return 2;
      }
      else if (2 === item.insurance_level * 1) {
        return 3;
      }
      else if (3 === item.insurance_level * 1) {
        return 5;
      }
    },

    //退还说明弹框
    popupExplain (item) {

      // if (this.device.is('WeChat')) {
      //   return;
      // }

      if (1 === item.insurance_level * 1) {
        this.explain.carCount = 30;
        this.explain.times = 20;
        this.explain.investment = 10;
      }
      else if (2 === item.insurance_level * 1) {
        this.explain.carCount = 40;
        this.explain.times = 25;
        this.explain.investment = 25;
      }
      else if (3 === item.insurance_level * 1) {
        this.explain.carCount = 60;
        this.explain.times = 30;
        this.explain.investment = 35;
      }
      this.explain.price = 1 > item.price ? item.price : parseInt(item.price).toFixed(0);
      this.explain.goods_name = item.goods_name;
      this.isShowDepositExplain = true;
    },

    closeExplain () {
      this.isShowDepositExplain = false;
    },

    //微信支付二次授权验证
    checkOpenid () {
      Models.Wechat
        .checkOpenid()
        .then((res) => {
          if (0 === res.code * 1) {
            let url = _.get(res.data, 'url');
            if (!_.isEmpty(url)) {
              window.location.href = url;
            }
            else {
              this.$toast('微信授权失败');
            }
          }
        });
    },

    // 商品列表
    goodsList () {
      Models.Goods
        .list()
        .then((res) => {
          if (1 === res.code) {
            this.formTemp.data = res.data;

            _.each(this.formTemp.data, (item) => {
              item.isAgent = false;

              // 判断是否需要代付
              if (_.isObject(item.df_order) && !_.isEmpty(item.df_order)) {

                // 全额代付
                if (1 === item.df_order.pay_type * 1) {
                  item.isAgent = true;
                }

                // 部分代付
                if (2 === item.df_order.pay_type * 1 && 1 === item.df_order.self_is_paid) {
                  item.isAgent = true;
                }
              }
            });
            this.getQueryOrder();
          }
        });
    },

    // 获取订单编号，如果存在，表示是代付链接
    getQueryOrder () {
      this.query = _.get(this.$route, 'query');

      if (this.query.goods_id) {
        let data = _.filter(this.formTemp.data, {goods_id: this.query.goods_id * 1});

        if (_.isEmpty(data)) {
          this.$toast('该商品已失效');
          return;
        }

        this.isShowInviteCode = false;
        this.currentData = data[0];
        this.handleBuy();
      }
    },

    handleMask (item) {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      let self = this;

      Models.Order
        .sendDfmsg({
          params: {
            goods_id: item.goods_id,
          },
        })
        .then(res => res);

      let data = '';

      if (1 === item.insurance_level) {
        data = '<div class="info-item">享受汽车业务75%的提成，1%团队管理收益。</div>';
      }

      if (2 === item.insurance_level) {
        data = '<div class="info-item">享受汽车业务75%的提成，3%团队管理收益。</div>';
      }

      // <div class="info-item color">保险主任将享受车险佣金的95%，团队管理收益的5%。</div>

      if (3 !== item.insurance_level) {
        self.$store.get.dispatch({
          type: 'handleChangeDialog',
          active: true,
          title: '温馨提示',
          msg: `尊敬的会员：您现在即将升级${item.goods_name}，如您以后想升级更高级别的会员，需重新购买，无法补差价哦。`,
          html: `${data}<div class="info-item">升级业务主任享受95%的提成，5%团队管理收益</div><div class="info-item">业务主任还有团队管理的10元收益哦</div><div style="color: #e41414; padding: 5px 0;">您不能享受团队管理收益10元躺赚奖励</div>`,
          lists: [
            {
              msg: '取消',
            },
            {
              msg: '确认',
              class: 'ok',
              func () {
                self.currentData = item;
                self.handleBuy();
                // self.isMaskVip    = true;
              },
            },
          ],
        });
      }
      else {
        self.currentData = item;
        self.handleBuy();
        // self.isMaskVip    = true;
      }
    },

    // 升级按钮
    handleBuy () {
      let self = this;
      self.formData = _.assign({}, self.formData, {
        goods: self.currentData,
      });

      if (0 < this.query.order_id * 1 && 1 === this.query.pay_type * 1 || 0 < this.query.order_id * 1 && 2 === this.query.pay_type * 1) {
        Models.Order
          .dfInfo({
            params: {
              order_id: this.query.order_id,
            },
          })
          .then((res) => {
            if (0 === res.is_paid * 1) {
              self.formData.goods.name = res.title;
              self.formData.goods.money = res.total_fee;
              self.formData.goods.content_title = res.content_title;
              self.formData.goods.user_nickname = res.user_nickname;

              self.isMaskVip = false;
              self.isShow = true;
            }
            else {
              self.$toast('该代付订单已失效');

              setTimeout(() => {
                self.$router.push({
                  name: 'home.Home',
                });
              }, 2000);
            }
          });
      }
      else {
        self.formData.goods.name = self.currentData.goods_name;
        self.formData.goods.money = self.currentData.price;
        this.isMaskVip = false;
        self.isShow = true;
      }

      if (_.isEmpty(self.invite_code)) {
        self.getInviteCode();
      }

    },

    // 支付子组件回调
    handlePayClick (obj) {

      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.formData = _.assign({}, this.formData, {
            pay: obj.content,
          });

          if (!_.isEmpty(obj.content)) {

            // 全额代付
            if (0 < this.query.order_id * 1 && 1 === this.query.pay_type * 1 || 0 < this.query.order_id * 1 && 2 === this.query.pay_type * 1) {
              this.handlePostPays({
                order_id: this.query.order_id,
                pay_id: _.get(obj.content, 'data.pay_id'),
              });
            }

            // 部分代付
            else if (2 === obj.content.pay_type * 1) {
              this.handlePostPays({
                order_id: _.get(obj.content, 'data.self_order_id'),
                pay_id: _.get(obj.content, 'data.pay_id'),
                pay_type: obj.content.pay_type,
              });
            }

            // 在线支付
            else {
              this.createOrder();
            }
          }
          else {
            this.isShow = obj.status;

            if (_.isEmpty(this.invite_code)) {
              this.isShowInviteCode = true;
            }
            this.query = {};
          }
          return;
        }
      }
    },

    // 下单并支付
    createOrder () {
      let self = this;
      if (true === self.loading) {
        self.$toast('正在提交');
        return;
      }

      if (_.isEmpty(_.get(self.formData, 'goods'))) {
        self.$toast('请选择会员产品');
        return;
      }

      if (_.isEmpty(_.get(self.formData, 'pay'))) {
        self.$toast('请重新选择支付方式');
        return;
      }

      let type = _.get(self.formData, 'goods.type');

      if (1 === type * 1 && _.isEmpty(self.invite_code)) {
        self.$toast('请输入推荐码');
        return;
      }

      let data = {
        goods_id: _.get(self.formData, 'goods.goods_id'),
        pay_method: 0,
      };

      if (1 === type) {
        data.invite_code = self.invite_code;
      }

      self.loading = true;

      Models.Order
        .create(data)
        .then((res) => {
          if (1 === res.code) {
            self.isShow = false;
            // self.order_id = _.get(res.data, 'order_id');
            self.handlePostPays({
              order_id: _.get(res.data, 'order_id'),
            });

          }
          else {
            self.$toast(res.msg || '购买失败');
            self.loading = false;
          }

        })
        .catch(() => {
          self.loading = false;
        });
    },

    // 前往支付
    handlePostPays (obj = {}) {
      let self = this;
      self.showInterval = true;
      let timer = setInterval(function () {
        if (self.intervalNum > 0) {
          self.intervalNum--;
        }
        else {
          self.showInterval = false;
          clearInterval(timer);
        }
      }, 1000);
      Models.Order
        .pay({
          order_id: obj.order_id,
          pay_id: obj.pay_id || _.get(self.formData, 'pay.pay_id'),
        })
        .then((res) => {
          clearInterval(timer);
          self.showInterval = false;
          if (1 === res.code) {
            let data = res.data;
            if ('jump' === data.type && !_.isEmpty(data.url)) {
              window.location.href = data.url;
            }
            else if ('wechat' === data.type) {
              /* eslint-disable */
              new self.wechatPay(data, function (r) {
                if (r.err_msg == 'get_brand_wcpay_request:ok') {
                  self.$toast('支付成功');
                  LocalStorage.remove('userInfo');
                  setTimeout(() => {
                    self.$router.push({
                      name: 'user.BuySuccess',
                      query: {
                        order_id: obj.order_id,
                        pay_type: obj.pay_type || 0,
                      },
                    });
                  }, 1000);
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
              self.loading = false;
              self.$toast('支付出错！');
            }

          }
          else {
            self.loading = false;
            self.$toast(res.msg || '购买失败');
          }
        });
    },

    // 推荐码
    getInviteCode () {
      Models.Profile
        .parentInviteCode()
        .then((res) => {
          if (1 === res.code) {
            this.isShowInviteCode = false;
            // if (res.data.lock) {
            // }
            this.invite_code = res.data.code;

            if (_.isEmpty(this.invite_code)) {
              this.isShowInviteCode = true;
            }
          }
          else {
            this.$toast(res.msg || '推荐码为空');
          }
        });
    },

    level (val) {
      let level = 0;
      switch (val) {
        case '高级会员':
          level = 1;
          break;
        case '保险专员':
          level = 2;
          break;
        case '保险经理':
          level = 3;
          break;
      }
      return level;
    },

    // 分享代付
    handleAgentShare (item) {
      this.isShare = true;
      this.$store.get.dispatch({
        type: 'histData',
        data: {
          agentOrder: {
            title: item.goods_name,
            order_id: item.df_order.order_id,
            pay_type: item.df_order.pay_type,
            goods_id: item.goods_id,
          },
        },
      });
    },

  },
};
