import './index.scss';

import _        from 'lodash';
import Header   from '~common/components/header';
import Models   from '~common/models';

export default {
  name: 'NoopsycheCultivateCardPage',
  data () {
    return {
      isShowYearNotice: false,
      yearNotice: '',

      inCount: 0,
			isMaskVip:false,
      isOther: true,
      isSee:false,
      pageIndex: '',
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userLevel () {
      return _.get(this.$store.get.state, 'CultivateCard.userLevel');
    },
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    isWechatClient () {
      return this.device.is('WeChat');
    }
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      Models.Public.getYearMsg().then( res => {
        if (0 === res.code) {
          vm.isShowYearNotice = true;
          vm.yearNotice = res.msg;
        }
      });

      Models.Increase.userInfo().then(res => {
        if (1 === res.code) {
          vm.$store.get.commit('saveUserLevel', {
            userLevel: res.data.level
          });
        }
        else {
          vm.$toast(res.msg);
        }
      });
    });
  },
  mounted () {
    this.getForum();
    let img = new Image();
    img.onload = () => {
      console.log(111);
    };
    img.src = '~assets/images/card-advantage-02';
	},
	watch: {
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

		linkToRoute (options) {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      this.$router.push(options);
    },

    // 获取版块通知
    async getForum () {
      let res = await Models.Notify.forum('repay_remind');
      if (res.code === 1) {
        this.$store.get.dispatch({
          type: 'setSystemMessage',
          message: res.data
        });
      }
    },

    showYearNotice (event) {
      this.$toast(this.yearNotice);
      event.preventDefault();
    },

    /*
     * 返回上一步
     */
    goHomePage () {
      this.$router.push('/');
		},

    /*
     * 判断时候是会员
     */
    isVip (index) {
      // 未完善个人信息
			// if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }

      // this.$router.push({name: 'home.AddDepositCard'});

      this.pageIndex = index;
      if (1 === this.userInfo.level * 1) {
        this.isMaskVip = true;
      }
      else {
        let route = {
          name: 1 === this.pageIndex ? 'home.SetPaymentPlan' : 'home.PaymentProgress',
        };
        this.$router.push(route);
      }
    },

    /*
     * 关闭直接进入页面
     */
    closeVip () {
      this.isMaskVip = false;
      let route = {
        name: 1 === this.pageIndex ? 'home.SetPaymentPlan' : 'home.PaymentProgress',
      };
      this.$router.push(route);
    },

    handleTest () {
      this.$toast('暂未开放，敬请期待！');
    }
  },
};
