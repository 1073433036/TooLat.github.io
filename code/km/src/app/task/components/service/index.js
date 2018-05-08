import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import WechatCode from '~common/components/wechat_code';
import Models     from '~common/models';


export default {
  name: 'taskService',
  data () {
    return {
      isWechat: false,
      isSuperior: false,
      hasSuperior: false,
      formTemp: {
        manager: {},
        rating : {
          count     : 0,
          bad_num   : 0,
          good_num  : 0,
        },
      },
      weChatInfo: {
        title: '',
        wx_qrcode: '',
        wechat_account: '',
      },
    };
  },
  components: {
    'app-header': Header,
    WechatCode

  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
    this.getMyManager();
  },
  watch: {
  },
  methods: {

    /*
     * 获取专属服务经理信息
     */
    getMyManager () {
      let self = this;

      Models.User
      .myManager()
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.manager = res.data;

          self.handleRatingCount(res.data);

          if (res.data.user_list.length) {
            this.hasSuperior = true;
          }
        }
        else {
          self.$toast('您无专属服务经理');
        }
      });
    },

    /*
     * 添加微信
     */
    addWeChat () {
      if (_.isEmpty(this.formTemp.manager)) {
        this.$toast('您无专属服务经理');
      }
      else if (_.isEmpty(_.get(this.formTemp, 'manager.wx_qrcode')) && _.isEmpty(_.get(this.formTemp, 'manager.wechat_account') + '')) {
        this.$toast('专属服务经理暂无上传微信');
      }
      else {
        this.weChatInfo.title = '专属客户经理二维码';
        this.weChatInfo.wx_qrcode = this.formTemp.manager.wx_qrcode;
        this.weChatInfo.wechat_account = this.formTemp.manager.wechat_account;
        this.isWechat = true;
      }
    },

    /*
     * 我的上级
     */
    mySuperior () {
      if (this.formTemp.manager.user_list.length) {
        this.isSuperior = true;
      }
      else {
        this.$toast('您无上级');
      }
    },

    /*
     * 微信聊
     */
    openWeChat (item) {
      if (1 < this.userInfo.level * 1) {
        if (_.isEmpty(_.get(item, 'wechat_account')) && _.isEmpty(_.get(item, 'wx_qrcode') + '')) {
          this.$toast('上级领导暂无上传微信');
        }
        else {
          this.isSuperior = false;
          this.weChatInfo.title = '上级领导二维码';
          this.weChatInfo.wx_qrcode = item.wx_qrcode;
          this.weChatInfo.wechat_account = item.wechat_account;
          this.isWechat = true;
        }
      }
      else {
        this.$toast('您暂无权限查看');
      }
    },

    /*
     * 微聊
     */
    openChat (id) {
      if (1 < this.userInfo.level * 1) {
        this.$router.push({
          name: 'chat.Home',
          params: {
            id: id
          }
        });
      }
      else {
        this.$toast('您暂无权限查看');
      }
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    // 用户评价统计
    handleRatingCount (userInfo) {
      Models.User
      .ratingCount({
        params: {
          user_id: userInfo.id
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formTemp = _.assign({}, this.formTemp, {
            rating: data
          });
        }
      });
    },
  }
};