import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Footer         from '~common/components/footer';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';
import ServiceCuetomerPopup from '~common/components/service_customer_popup';

export default {
  name: 'messageNotify',
  data () {
    return {
      page: 1,
      isWechat: false,
      wechatIndex: 0,
      formTemp: {
        list: [],
        notice: {},
        service: [],
      },
      isNotice: false,
      isSystem: false,
      lastNotice: [],
      isQrCodeShow: false,
    };
  },
  components: {
    'app-header': Header,
    'app-footer': Footer,
    'service-cuetomer-popup': ServiceCuetomerPopup,
  },
  computed: {
    message () {
      let data = _.get(this.$store.get.state, 'Message.content.msg');
      this.formTemp.list.forEach((item) => {
        item.num = data[item.msg];
      });
      return data;
    },
    isWechatClient () {
      return this.device.is('WeChat');
    },
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    // 弹出聊天客服公众号
    // if (true === this.device.is('WeChat') ) {
    //   this.followWechat();
    // }

    this.handleService();
    this.getList();
    this.getMessageNotice();
  },
  watch: {
    message (data) {
      this.formTemp.list.forEach((item) => {
        item.num = data[item.msg];
      });
    },

  },
  methods: {
    //是否关注聊天公众号
    followWechat () {
      Models.User
      .weixin({
          back_url : window.location.href,
      })
      .then((res) => {
       if (2 === res.code) {
          this.isQrCodeShow = true;
       }
       else if (0 === res.code) {
         window.location.href = res.data.url;
       }
      });
    },
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

    // 获取公告、通知
    getMessageNotice () {
      Models.User
      .messageNotice()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (!_.isEmpty(data)) {
            this.lastNotice = data;
            this.handleShowNotice(data[0]);
          }
        }
      });
    },

    // 显示公告
    handleShowNotice (item) {
      if (!_.isEmpty(item)) {
        this.formTemp.notice = item;

        let localNotice = LocalStorage.get('readNotice');

        if (_.isEmpty(localNotice)) {
          LocalStorage.set('readNotice', {
            content: this.formTemp.notice,
            num: 1,
          });
        }
        else {
          let data = localNotice.data;

          if (data.content.id * 1 !== this.formTemp.notice.id * 1) {
            LocalStorage.remove('readNotice');
          }
          else if (4 > data.num * 1) {
            data.num ++;
            LocalStorage.set('readNotice', data);
          }
          else {
            this.handelReadNotice(this.formTemp.notice);
          }
        }

        if (1 === this.formTemp.notice.templet * 1) {
          this.isSystem = false;
          this.isNotice = true;
        }
        else {
          this.isNotice = false;
          this.isSystem = true;
        }
      }
    },

    // 更新公告、通知
    handelReadNotice (data) {
      Models.User
      .readNotice({ id: data.id })
      .then((res) => {
        if (1 === res.code) {
          LocalStorage.remove('readNotice');
        }
      });
    },

    // 关闭通知
    handleNoticeClose () {
      let self = this;
      self.isNotice = false;
      self.isSystem = false;

      // if (!_.isEmpty(self.formTemp.notice)) {
      //   self.handelReadNotice(self.formTemp.notice);
      // }

      self.lastNotice.splice(0, 1);

      // 关闭、读取下一条
      if (!_.isEmpty(self.lastNotice)) {
        setTimeout(() => {
          self.handleShowNotice(self.lastNotice[0]);
        }, 500);
      }
    },

    /*
     * socket获取消息
     */
    onsend (key) {
      this.$refs.footer.onsend(key);
    },

    /*
     * 获取通知类型
     */
    getList () {
      let self = this;
      Models.Notify
      .list({
        params: {
          page: self.page
        }
      })
      .then((res) => {
        if (1 === res.code) {
          res.data.forEach((item) => {

            if (1 !== item.send_type * 1 && 3 !== item.send_type * 1) {
              let data = {
                is_read: item.is_read,
                msg_content: item.msg_content,
                send_time: item.send_time,
                send_type: item.send_type,
                title: item.title,
                num: 0,
                msg: item.tips_key,
              };
              self.formTemp.list.push(data);
            }
          });
        }
      });
    },

    // 选择可否
    handleWechatCode (index) {
      this.wechatIndex  = index;
      this.isWechat     = true;
    },

    /*
     * 跳转路由
     */
    switchType (type, num) {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      let self = this;
      let route;
      switch (type) {
        case 1:
          route = { name: 'message.Team', query: { type: type } };
          if (num) {
            self.onsend('message_team');
          }
          break;
        case 2:
          route = { name: 'message.Systems', query: { type: type } };
          if (num) {
            self.onsend('message_system');
          }
          break;
        case 3:
          route = { name: 'message.Info', query: { type: type } };
          if (num) {
            self.onsend('message_friend');
          }
          break;
        case 4:
          route = { name: 'message.Reward', query: { type: type } };
          if (num) {
            self.onsend('message_commission');
          }
          break;
      }
      this.$router.push(route);
    },

    // 获取客服列表
    handleService () {
      Models.Profile
      .handleService()
      .then((res) => {
        if (1 === res.code) {
          let parentArr = [],
              onlineArr = [],
              offLineArr = [];
          for (let el of res.data) {
            if (el.is_parent === 1) {
              parentArr.push(el);
            }
            else {
              if (el.status === 'online') {
                onlineArr.push(el);
              }
              else {
                offLineArr.push(el);
              }
            }
          }
          this.formTemp.service = [...parentArr, ...onlineArr, ...offLineArr];
        }
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        done();
      }, 1500);
    },
  },
};
