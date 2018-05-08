import './index.scss';

import _ from 'lodash';
import WechatCode from '~common/components/wechat_code';
import Models     from '~common/models';

export default {
  name: 'utilitybar',
  data () {
    return {
      isExtendshow: false,
      filterData: [
        'home.CreditCardShareJoin',
        'home.PrenentTheft',
        'home.Simulate1',
        'insurance.AutoBanner',
        'user.Invite',
      ],

      isUtilitybarShow: false,
      HomeClick: false,


      filterData: [
      ],

      isShow  : false,
      isWechat: false,
      open    : false,
      formTemp: {},
      lastData: {},

      isShowOpera: true,
      startPageY: 0,
      isOpenFromApp: false,
    };
  },

  computed: {
    historyRoute () {
      return _.get(this.$store.get.state, 'App.historyRoute');
    },

    lastRoute () {
      return _.get(this.$store.get.state, 'App.histData.lastRoute') || '';
    },

    isReferrer () {
      // 排除APP APP首页原生写 无论点到哪都会出现
      if (this.isOpenFromApp) {
        return false;
      }
      let foot = document.querySelector('.footer-page');
      let data = false;
      let routeName = this.$route.name;
      let filterRouteNames = ['home.Calculator', 'tool.AdvertiseHome', 'tool.UploadMaterial', 'home.AppCarBreakRules', 'home.AppCodeQuery', 'home.AppMyCarInfo', 'home.AppAddCar', 'home.AppCarRulesQuery', 'home.AppRepairData', 'home.AppOrderPay', 'home.AppMySelfOrader', 'home.AppCarBreakPaySuccess'];
      let isFilterRouteName = filterRouteNames.some(function (item) {
        if (item === routeName) {
          return true;
        }
      });

      if (isFilterRouteName) {
        return data;
      }

      if (_.isEmpty(this.historyRoute) && _.isEmpty(foot) ||
        this.lastRoute === routeName && _.isEmpty(foot)) {
        data = true;
      }
      else {
        data = false;
      }

      return data;
    },

    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  watch: {
    isReferrer (value) {
      this.isUtilitybarShow = value;
    },
    '$route' (val, old) {
      if (!_.isEmpty(val.name) && val !== old) {
        let inviteCode = _.get(val, 'query.invite_code');

        if (!_.isEmpty(inviteCode)) {
          this.open = false;
          this.handleInviteStatus();
        }
      }
    }
  },
  mounted () {
    if (window.js_obj) {
      this.isOpenFromApp = true;
    }
    let holder = setInterval(() => {
      if (window.js_obj) {
        this.isOpenFromApp = true;
        clearInterval(holder);
      }
    }, 500);
    this.isUtilitybarShow = this.isReferrer;
    this.initAnimation();
  },
  components: {
    WechatCode
  },
  methods: {
    // 悬浮窗隐藏显示
    initAnimation () {
      document.addEventListener('touchstart', e => {
        this.startPageY = e.touches[0].pageY;
      }, true);

      document.addEventListener('touchmove', e => {
        let y = e.changedTouches[0].pageY;
        if (10 <  Math.abs(y - this.startPageY)) {
          this.isShowOpera = false;
        }
      }, true);

      document.addEventListener('touchend', () => {
        if (!this.isShowOpera) {
          this.isShowOpera = true;
        }
      }, true);
    },

    goBack () {
      this.$router.go(-1);
    },

    handleInviteStatus () {
      let self = this;
      self.getMyManager();

      setTimeout(() => {
        self.isShow = true;
      }, 1000);

      setTimeout(() => {
        self.isShow = false;
      }, 3000);
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    /*
     * 获取最近上级信息
     */
    getMyManager () {
      let self = this;

      Models.User
      .inviteUserInfo({
        params: {
          invite_code: _.get(this.$route, 'query.invite_code')
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.formTemp = res.data;
          self.lastData = res.data;
          self.open     = true;
        }
      });
    },

    // 官方公众号
    handleQrcode () {
      this.formTemp = {
        wx_qrcode     : 'https://cdn.kamengjinfu.com/assets/images/wechat-code.a962568a.jpg',
        wechat_account: '',
      };
      this.isWechat = true;
    },

    //推荐人二维码
    handleUserQrcode () {
      this.formTemp = this.lastData;
      this.isWechat = true;
    },

    // 跳转到聊天
    handleGotoChat () {
      this.open   = false;
      this.isShow = false;

      this.$router.push({
        name: 'chat.Home',
        params: {
          id: this.formTemp.id
        }
      });
    },
  }
};
