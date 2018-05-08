import './index.scss';

import _        from 'lodash';
import Header   from '~common/components/header';
import Models   from '~common/models';

export default {
  name: 'IntegralWithdraw',
  data () {
    return {
      money: '',
      level: 0,
      bankInfo: {}
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userBankCarInfo () {
      return _.get(this.$store.get.state, 'Acount.userBankCarInfo');
    },
    integralWithdrawInfo () {
      return _.get(this.$store.get.state, 'Acount.integralWithdrawInfo');
    },

    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo');
    },
  },
  created () {
    if (!parseInt(this.integralWithdrawInfo.integral) ) {
      this.$toast('您的积分不足');
      // this.$router.push({name: 'user.IntegralDetail'});
    }
    if (!_.isEmpty(this.userBankCarInfo)) {
      this.bankInfo = this.userBankCarInfo;
      return;
    }
    let data = {
      page: 1
    };
    Models.User.userBankList(data).then(res => {
      if (1 === res.code) {
        if (!res.data.total) {
          this.$toast('没有银行卡, 请先去添加银行卡');
        }
        this.bankInfo = res.data.data[0] || {};
        this.$store.get.commit('saveUserBankCarInfo', res.data.data[0]);
      }
    });
  },
  watch: {
    userInfo (val) {
      this.level = val.level * 1 || 0;
    }
  },
  methods: {
    goBankListPage () {
      this.$store.get.commit('saveIntegralWithdrawStatus', {
        integralWithdrawStatus: 1
      });
      this.$router.push({name: 'user.BankList'});
    },

    handleCardNo (value) {
      if (!value) {
        return;
      }
      let arr = [...value];
      let preArr = arr.slice(0, 4);
      let afterArr = arr.slice(-4);
      let midArr = arr.slice(4, arr.length - 4);
      midArr = midArr.map(function () {
        return '*';
      });
      let result = preArr.concat(midArr, afterArr);
      return result.join('');
    },

    submitWithdrawData () {
      let self = this;
      let money = this.integralWithdrawInfo.integral;

      if (true !== self.$rules.money(self.money)) {
        self.$toast('请输入正确的金额');
        return;
      }

      if (self.money > money / 100) {
        this.$toast(`提现金额不能大于${money / 100}`);
        return;
      }

      if (1 >= this.level) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '抱歉！积分提现仅对高级会员及以上身份会员开放',
          lists : [
            {
              msg: '取消',
            },
            {
              msg: '升级会员',
              class: 'ok',
              func () {
                self.$router.push({
                  name: 'user.BuyVip'
                });
              }
            },
          ]
        });
        return;
      }

      // 判断提现金额
      if (1000 > money * 1) {
        this.$toast('您的积分未满1000，尚不能提现');
        return;
      }


      let bankId = _.get(self.userBankCarInfo, 'id') || '';

      if (0 >= _.isNumber(bankId * 1)) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '请先添加银行卡',
          lists : [
            {
              msg: '取消',
            },
            {
              msg: '添加银行卡',
              class: 'ok',
              func () {
                self.$router.push({
                  name: 'user.BankAdd'
                });
              }
            },
          ]
        });
        return;
      }

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });

      let data = {
        money: self.money,
        bank_id: bankId
      };

      Models.Account
      .integralWithdraw(data)
      .then(res => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          self.$toast(res.msg);
          setTimeout(() => {
            self.$router.push({
              name: 'user.IntegralDetail'
            });
          }, 2000);
        }
        else {
          self.$toast(res.msg);
        }
      });
    },

    // 全部提现
    withdrawAllMoney () {

      // 判断提现金额
      let money = this.integralWithdrawInfo.integral;
      if (1000 > money * 1) {
        this.$toast('您的积分未满1000，尚不能提现');
        return;
      }
      this.money = money / 100;
    },
  },
};