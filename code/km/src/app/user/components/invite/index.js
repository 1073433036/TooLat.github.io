import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import Checkbox           from '~common/components/checkbox';
import Models             from '~common/models';
import ServiceAgreement   from '~common/components/service_agreement';
import WechatCode         from '~common/components/wechat_code';
import posterAgreement   from '~common/components/poster_agreement';

export default {
  name: 'userInvite',
  data () {
    return {
      isWechat: false,
      isShow: false,
      isShowStandard: false,
			single: true,
			level:'',
      formTemp: {
        manager: {},
      },
    };
  },
  components: {
    'app-header': Header,
    Checkbox,
    ServiceAgreement,
    WechatCode,
    posterAgreement
  },
  computed: {
		userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    isWechatClient () {
      return this.device.is('WeChat');
    }
  },
  mounted () {
		// this.getMyManager();
  },
  watch: {
		userInfo (val) {
			this.level = val.level;
		}
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
      if (_.isEmpty(this.userInfo.wx_qrcode) && _.isEmpty(this.userInfo.wechat_account)) {
        this.$toast('暂未上传微信二维码');
      }
      else {
        this.isWechat = true;
      }
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    /*
     * 暂无手机号码
     */
    noPhone () {
      this.$toast('暂未上传手机号码');
    },

    /*
     * 邀请好友加入
     */
    invite () {
      let self = this;

      if (!self.single) {
        self.$toast('请同意平台协议');
        return;
      }

      self.$router.push({
        name: 'user.InviteTotal'
      });

      // Models.Profile
      // .checkUserInfo()
      // .then((res) => {
      //   if (1 === res.code * 1) {
      //     self.$router.push({
      //       name: 'user.InviteTotal'
      //     });
      //     return;
      //   }

      //   self.$store.get.dispatch({
      //     type  : 'handleChangeDialog',
      //     active: true,
      //     title : '温馨提示',
      //     msg   : '请完善个人基本信息',
      //     lists : [
      //       {
      //         msg: '取消',
      //       },
      //       {
      //         msg: '去完善',
      //         class: 'ok',
      //         func () {
      //           self.$router.push({
      //             name: 'user.Profile'
      //           });
      //         }
      //       },
      //     ]
      //   });
      // });
    },

  },
};
