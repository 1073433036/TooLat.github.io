import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Socket       from '~common/components/socket';
import Models       from '~common/models';
import posterAgreement   from '~common/components/poster_agreement';
import Checkbox           from '~common/components/checkbox';


export default {
  name: 'userAccount',
  data () {
    return {
      user: {},

      /*
       * 消息提醒
       * @param     user_account_balance        账户管理
       * @param     user_account_integral       我的团队
       */
      user_account    : '',
      user_team       : '',
      zsNumberData    : 0,
      isNotice        : 0,
      user_account_balance   : 0,
      user_account_integral  : 0,
      user_account_insurance : 0,
      isShowStandard: false,
      single: true,
    };
  },
  components: {
    'app-header': Header,
    Socket,
    posterAgreement,
    Checkbox
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    userWithdrawInfo () {
      return _.get(this.$store.get.state, 'Acount.userWithdrawInfo');
    },
    message () {
      let data = _.get(this.$store.get.state, 'Message.content.msg');

      this.user_account_balance     = data.user_account_balance;
      this.user_account_integral    = data.user_account_integral;
      this.user_account_insurance   = data.user_account_insurance || 0;
      return data;
    },
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      Models.Account.userWithdrawInfo().then(res => {
        if (1 === res.code) {
          vm.user = res.data;
          vm.$store.get.commit('saveUserWithdrawInfo', {
            userWithdrawInfo: res.data || {}
          });
        }
        else {
          this.$toast(res.msg || '网络出错');
        }
      });
    });
  },
  mounted () {
    this.zsNumber();

    this.getInsuranceNotice();
  },
  watch: {
    message (data) {
      this.user_account_balance     = data.user_account_balance;
      this.user_account_integral    = data.user_account_integral;
      this.user_account_insurance   = data.user_account_insurance || 0;
    },
  },
  methods: {

    // 实习会员转正还需要推荐数量
    zsNumber () {
      Models.Profile
      .zsNumber()
      .then((res) => {
        if (1 === res.code) {
          this.zsNumberData = res.data;
        }
      });
    },

    /*
     * 跳转收益明细
     */
    jumpIncome () {
      if (this.user_account_balance) {
        this.onsend('user_account_balance');
      }
      this.$router.push({name: 'user.Income'});
    },

    /*
     * 跳转积分明细
     */
    jumpIntegral () {
      if (this.user_account_integral) {
        this.onsend('user_account_integral');
      }
      this.$router.push({name: 'user.IntegralDetail'});
    },

    /*
     * 跳转保险收益明细
     */
    jumpInsurance () {
      if (this.user_account_insurance) {
        this.onsend('user_account_insurance');
      }
      this.$router.push({name: 'message.Insurance'});
    },


    /*
     * 发送socket消息
     */
    onsend (key) {
      this.$refs.socket.onsend(key);
    },

    /*
     * 提现
     */
    goWithdrawDepositPage () {
      if (1 >= this.userInfo.level) {
        this.$toast('抱歉！您目前是实习会员Lv1，暂时不能使用提现功能', { duration: 4000 });
        return;
      }
      if (!this.userWithdrawInfo.account || 0 === parseInt(this.userWithdrawInfo.account)) {
        this.$toast('没有金额可提现');
        return;
      }
      // if (!window.js_obj) {
      //   let self = this;
      //   self.$store.get.dispatch({
      //     type  : 'handleChangeDialog',
      //     active: true,
      //     title : '温馨提示',
      //     msg   : '提现功能暂时只支持APP，请前往APP提现',
      //     lists : [
      //       {
      //         msg: '取消',
      //       },
      //       {
      //         msg: '下载APP',
      //         class: 'ok',
      //         func () {
      //           self.$router.push({ name: 'home.AppDownLoad' });
      //         }
      //       },
      //     ]
      //   });
      //   return;
      // }
      this.$router.push({name: 'user.WithdrawDeposit'});
    },

    /*
     * 显示车险佣金积分
     */
    getInsuranceNotice () {
      Models.Profile
      .getInsuranceNotice()
      .then((res) => {
        this.isNotice = res.data || 0;
      });
    }
  },
};
