import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'payslot',
  data () {
    return {
      state: {},
      isWeiXin: false,
      isZhiFuBao: false,
      isQuick: false,
      hasIntegralChannel: false,
      myUrl: '',
      isNotice: false,
      isNoticeBankShow: false,
      noticeText: '',
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
    payType () {
      if (this.isQuick) {
        return '银联快捷';
      }
      else if (this.isWeiXin) {
        return '微信支付';
      }
      else if (this.isZhiFuBao) {
        return '支付宝支付';
      }
    },
    orderData () {
      return _.get(this.$store.get.state, 'EmptyPay.emptyOrderData');
    },
    payRoadInfo () {
      return _.get(this.$store.get.state, 'EmptyPay.emptyOrderData.payRoadInfo');
    },
    payInfo () {
      return _.get(this.$store.get.state, 'EmptyPay.payInfo');
    },
    limitTips () {
      if (!this.payRoadInfo[0]) {
        return;
      }
      let limitMoney = this.payRoadInfo[0].quota_limit || '';
      let arr = limitMoney.split('-');
      let max = parseInt(arr[1]);
      if ( this.payInfo.money >= max ) {
        return true;
      }
    },

  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      // let payRoadName;
      if (!vm.payInfo.money) {
        vm.$router.push({ name: 'home.EmptyPay'});
        return;
      }
      vm.isQuick = true;
      // payRoadName = vm.payRoadInfo[0].name;
      // switch (payRoadName) {
      //   case '快捷支付':
      //   vm.isQuick = true;
      //   break;
      // }
    });
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    goBankListPage (item) {
      if (false === item.open) {
        // status: 2  未开通  3 升级中
        if (item.status === 2) {
          let self = this;
          this.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : '该通道的储蓄卡暂未绑定，请绑定开户',
            lists : [
              {
                msg: '取消'
              },
              {
                msg: '去绑定',
                class: 'ok',
                async func () {
                  self.$router.push({ name: 'home.EmptyPayDepositCardList' });
                }
              }
            ]
          });
        }
        else if (item.status !== 3) {
          this.$toast(item.msg);
        }
        return;
      }

      if ('无积分' === item.remark) {
        this.$toast('该支付通道正在做调整，暂停使用，给您带来的不便敬请谅解');
        return;
      }
      if (this.limitTips) {
        this.$toast('超额！请返回重新输入金额');
      }
      else {
        this.$store.get.commit('saveChannelRemark', {
          channelRemark: item.remark
        });
        this.$store.get.commit('saveChannelId', {
          channel_id: item.id
        });

        if ('YEE' === item.type) {
          this.$store.get.dispatch({
            type: 'Loading',
            isShow: true,
          });
          Models.Pay
          .handlePayYee({
            order_sn: _.get(this.orderData, 'orderNum'),
            card_id: _.get(this.payInfo, 'depositCard'),
          })
          .then((res) => {
            this.$store.get.dispatch({
              type: 'Loading',
              isShow: false,
            });

            if (1 === res.code) {
              this.myUrl = res.data.html;
              this.hasIntegralChannel = true;
            }
            else {
              this.$toast(res.msg);
            }

          });
          return;
        }


        this.$router.push({name: 'home.EmptyPayBankList'});
      }
    },

    handleother () {
      this.$router.push({
        name: 'home.EmptyPay'
      });
    },

    // 通道银行提示
    handleNotice (item) {
      if (3 === item.sort) {
        this.isNoticeBankShow = true;
      }

      else if (2 === item.sort) {
        this.noticeText = `${item.name}目前支持以下银行：北京银行、工商银行、广发银行、建设银行、平安银行、浦发银行、中国银行、邮政储蓄、光大银行、兴业银行、民生银行、花旗银行`;
        this.isNotice = true;
      }

    },
  }
};
