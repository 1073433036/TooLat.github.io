import './index.scss';

import _        from 'lodash';
import Header   from '~common/components/header';
import Models   from '~common/models';

export default {
  name: 'withdrawDeposit',
  data () {
    return {
      bankInfo: {},
      money: ''
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    userBankCarInfo () {
      return _.get(this.$store.get.state, 'Acount.userBankCarInfo');
    },
    userWithdrawInfo () {
      return _.get(this.$store.get.state, 'Acount.userWithdrawInfo');
    }
  },
  beforeRouteEnter (to, from, next) {
    let data = {
      page: 1
    };
    next(function (vm) {
      if (!_.isEmpty(vm.userBankCarInfo)) {
        vm.bankInfo = vm.userBankCarInfo;
        return;
      }
      Models.User
      .userBankList(data)
      .then(res => {
        if (1 === res.code) {
          let data = res.data;
          if (0 >= data.total) {
            vm.$toast('没有银行卡, 请先去添加银行卡');
          }
          vm.bankInfo = data.data[0] || {};
          vm.$store.get.commit('saveUserBankCarInfo', data.data[0]);
        }
      });
    });
  },
  mounted () {
    this.requestUserWithdrawInfo();
  },
  watch: {
  },
  methods: {
    requestUserWithdrawInfo () {
      Models.Account.userWithdrawInfo().then(res => {
        if (1 === res.code) {
          this.$store.get.commit('saveUserWithdrawInfo', {
            userWithdrawInfo: res.data || {}
          });
        }
      });
    },

    goBankListPage () {
      this.$store.get.commit('saveWithdrawStatus', {
        withdrawStatus: 1
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

    //全部提现
    withdrawAllMoney () {
      if (!this.userWithdrawInfo.account || 0 === parseInt(this.userWithdrawInfo.account)) {
        this.$toast('没有金额可提现');
        return;
      }
      this.money = this.userWithdrawInfo.account;
    },

    submitWithdrawData () {
      let self = this;

      if (self.money > self.userWithdrawInfo.account) {
        self.$toast('提现金额不能大于当前余额');
        return;
      }

      if (true !== self.$rules.money(self.money)) {
        self.$toast('请输入正确的金额');
        return;
      }

      let bankId = _.get(self.userBankCarInfo, 'id') || '';

      if (!_.isNumber(bankId * 1) || 0 >= bankId * 1) {
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

      let realName   = self.userBankCarInfo.real_name;
      let realNameArr = realName.split('');
      if (realNameArr[1]) {
        realName = realName.replace(realNameArr[1], '*');
      }

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        align : 'left',
        title : '温馨提示',
        msg   : '请您确认提现信息，以免出现不到账情况',
        html: `
                <div class="info-item">姓名：${realName}</div>
                <div class="info-item">银卡：${self.userBankCarInfo.bank_name}</div>
                <div class="info-item">卡号：${self.handleCardNo(self.userBankCarInfo.bank_card)}</div>
              `,
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确认',
            class: 'ok',
            func () {
              self.$store.get.dispatch({
                type: 'Loading',
                isShow: true
              });

              let data = {
                money: self.money,
                bank_id: self.userBankCarInfo.id
              };

              Models.Account
              .userWithdraw(data)
              .then(res => {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false
                });
                if (1 === res.code) {
                  self.$toast(res.msg);
                  setTimeout(() => {
                    self.$router.push({
                      name: 'user.Account',
                    });
                  }, 2000);
                }
                else {
                  self.$toast(res.msg);
                }
              });
            }
          },
        ]
      });

    }
  },
};