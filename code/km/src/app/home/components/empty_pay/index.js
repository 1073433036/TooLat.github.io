import './index.scss';

import Header       from '~common/components/header';
import SetMoney     from './components/setMoney';
import Models       from '~common/models';
import _            from 'lodash';

export default {
  name: 'empty-pay',
  data () {
    return {
      state: {
        /*
         * 设置金额
         */
        setMoney    : false,
        active      : false,
      },
      money         : '',
      isMaskVip     : false,
      checkBank     : false,

    };
  },
  components: {
    'app-header'    : Header,
    SetMoney,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    depositCard () {
      return _.get(this.$store.get.state, 'EmptyPay.payInfo.depositCard');
    },
    isWechatClient () {
      return this.device.is('WeChat');
    },
  },
  created () {
    this.getForum();
    this.handleCheckBank();
  },
  mounted () {
    if (!this.depositCard) {
      this.requestUserBankList();
    }
  },
  watch: {
    userInfo (user) {
      this.isMaskVip = 1 === user.level * 1 ? true : false;
    },
  },
  methods: {
    showUserDialog () {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '请先完善个人资料',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '去完善',
            class: 'ok',
            func () {
              self.$router.push({ name: 'user.Profile', query: { dt: self.$route.path } });
            }
          },
        ]
      });
    },

    // 设置金额
    showSetMoneyPopup () {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      this.state.setMoney = true;
    },

    // 获取版块通知
    async getForum () {
      let res = await Models.Notify.forum('epos');
      if (res.code === 1) {
        this.$store.get.dispatch({
          type: 'setSystemMessage',
          message: res.data
        });
      }
    },

    // 判断是否已经实名验证
    handleCheckBank () {
      Models.Pay
      .userBundleLBankist()
      .then((res) => {
        if (1 === res.code) {
          if (0 >= res.data.total) {
            this.handleMaskText();
          }
          else {
            this.checkBank = true;
          }
        }
        else {
          this.$toast(res.msg);
        }
      });
    },

    handleMaskText () {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '尊敬的用户，为了确保用户信息的唯一性和安全性，确保账户资金安全，请您先进行银行储蓄卡实名认证，方可免费办理此业务！',
        html  : '<div style="color: #01b3f0">自己账户不能给他人信用卡支付使用</div>',
        lists : [
          {
            msg: '取消'
          },
          {
            msg: '实名验证',
            class: 'ok',
            func () {
              self.$router.push({
                name: 'home.AuthFlow'
              });
            }
          },
        ]
      });
    },

    goDepositCardPage () {
      this.$router.push({name: 'home.EmptyPayDepositCardList'});
    },
    goBackHomePage () {
      this.$router.push('/');
    },
    queryPayBill () {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      this.$toast('暂未开放数据');
    },

    //请求用户储蓄卡列表，保存储蓄卡id
    requestUserBankList () {
      Models.Pay
      .userBundleLBankist()
      .then((res) => {
        if (1 === res.code) {
          let carList = res.data.data;
          if (!_.isEmpty(carList)) {
            this.$store.get.commit('saveDepositCard', {
              depositCard: carList[0] ? carList[0].id : 0
            });
          }
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    /*
     * 设置金额
     */
    handleMoneyNumber (value) {
      let num = Number(value);
      return num.toFixed(2);
    },
    setAmount (money) {
      this.money = this.handleMoneyNumber(money);
    },
    //填写正确金额生成订单号，请求支付通道，并跳转
    goToPaySlot (str) {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      if ('WechatPay' === str) {
        this.$toast('抱歉！微信支付暂停使用，请等候通知。');
        return;
      }
      else if ('Alipay' === str) {
        this.$toast('抱歉！支付宝支付暂停使用，请等候通知。');
        return;
      }

      let self = this;
      let payRoadName = str;
      switch (payRoadName) {
        case 'UnionPay':
        payRoadName = '快捷支付';
        break;
      }
      if ( 0.009 < Number(self.money) ) {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: true
        });

        let data = {
          price: self.money
        };
        Models.Pay.createOrder(data) .then(res => {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false
          });
          if (1 === res.code) {
            let data = res.data;
            let orderNum = data.order_sn;
            Models.Pay
            .payList({
              params: {
                card_id: this.depositCard,
              }
            })
            .then( res => {
              if (1 === res.code) {
                let resData = res.data;
                // let theRoadInfoArr = [];
                // resData.forEach((item) => {
                //   if (item.name === payRoadName) {
                //     theRoadInfoArr.push(item);
                //   }
                // });
                self.$store.get.commit('savePayRoadInfo', {
                  orderNum: orderNum,
                  resRoadInfo: resData
                });
                self.$router.push({ name: 'home.PaySlot' });
              }
            });
          }
          else {
            self.$toast(res.msg);
          }
        });

      }
      else {
        this.$toast('请填写金额');
      }
    },

    /*
     * 关闭
     */
    closeVip () {
      this.isMaskVip = false;
    },

  }
};
