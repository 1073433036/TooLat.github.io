import './index.scss';

import _          from 'lodash';
import WechatCode from '~common/components/wechat_code';
import Models     from '~common/models';

export default {
  name: 'invite',
  data () {
    return {
      filterData: [
      ],

      isShow  : false,
      isWechat: false,
      open    : false,
      formTemp: {},
      lastData: {},
    };
  },

  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  watch: {
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

  },
  components: {
    WechatCode
  },
  methods: {
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