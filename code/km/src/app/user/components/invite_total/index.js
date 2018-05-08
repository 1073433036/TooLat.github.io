import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import WechatCode from '~common/components/wechat_code';
import Models     from '~common/models';

export default {
  name: 'inviteTotal',
  data () {
    return {
      isShare: false,
      isWechat: false,
      formData: {
        list: {},
        wechat: '',
      }
    };
  },
  components: {
    'app-header': Header,
    WechatCode
  },
  computed: {
    isWeChat () {
      return this.device.is('WeChat');
    },

    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },

    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
    },

  },
  mounted () {
    this.shareInfo();
  },
  methods: {

    /*
     * 获取用户分享统计
     */
    shareInfo () {
      let self = this;
      Models.User
      .shareInfo()
      .then((res) => {
        if (1 === res.code) {
          self.formData.list = res.data;
          // self.share();
        }
      });
    },

    /*
     * 分享
     */
    share () {
      let self = this;

      if (true === this.isWeChat) {
        Models.Home
        .wechatShare()
        .then((res) => {
          if (1 === res.code) {
            console.log( res.data);
            self.formData.wechat = res.data;
          }
        });
      }
    },

    // 点击分享按钮
    handleShareClick () {
      if (false === this.device.is('WeChat')) {
        /* eslint-disable */
        let data = {
          title     : this.appShareData.title,
          desc      : this.appShareData.desc,
          url       : this.appShareData.link,
          share_img : this.appShareData.imgUrl
        };
        console.log(data);
        // js_obj.shareWeb(JSON.stringify(data));
        /* eslint-enable */
      }
      else {
        this.isShare = true;
      }
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

  },
};
