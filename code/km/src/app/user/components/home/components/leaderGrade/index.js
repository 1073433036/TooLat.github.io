import './index.scss';

import Models         from '~common/models';
import _              from 'lodash';
import WechatCode     from '~common/components/wechat_code';

export default {
  name: 'LeaderGrade',
  props: {
  },

  data () {
    return {
      isWechat: false,
      wechat_account: '',
      wx_qrcode: '',

      isPopupShow: false,
      isExtendShow: false,
      isTipShow: false,
      managerInfo: {},
      parentList: [],
    };
  },

  components: {
    WechatCode
  },

  async mounted () {
    if (this.userInfo.level <= 1) {
      return;
    }

    // 每天显示三次，第三次在晚上6点之后显示
    let times = localStorage.getItem('gradeCloseTime');
    if (times) {
      times = JSON.parse(times);
      let y = new Date().getFullYear(),
          m = new Date().getMonth() + 1,
          d = new Date().getDate();
      let t = '' + y + '/' + m + '/' + d;
      t = new Date(t).getTime();

      if (times[0] < t) {
        localStorage.removeItem('gradeCloseTime');
        await this.getMyManager();
        this.getLeader();
      }
      else {
        if (times.length < 2) {
          await this.getMyManager();
          this.getLeader();
        }
        else if (times.length < 3) {
          let s = new Date(t + ' 18:00:00').getTime();
          if (Date.now() > s) {
            await this.getMyManager();
            this.getLeader();
          }
        }
      }
    }
    else {
      await this.getMyManager();
      this.getLeader();
    }
  },

  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },

    isMordLeader () {
      let flag = false;
      for (let el of this.parentList) {
        if (el.user_id !== this.managerInfo.id && el.rating === 0) {
          flag = true;
          break;
        }
      }
      return flag;
    }
  },

  methods: {
    closePopup () {
      let el = localStorage.getItem('gradeCloseTime');
      if (el) {
        el = JSON.parse(el);
      }
      else {
        el = [];
      }
      el.push(Date.now());
      el = JSON.stringify(el);
      localStorage.setItem('gradeCloseTime', el);
      this.isPopupShow = false;
    },

    // 获取上级推荐人
    async getMyManager () {
      let res = await Models.User.getMyManager();
      if (res.code === 1) {
        this.managerInfo = res.data;
      }
    },

    // 获取可评价上级
    async getLeader () {
      let res = await Models.User.parentList();
      if (res.code === 1) {
        let data = res.data;
        if (data.length) {
          let flag = false;
          for (let el of data) {
            if (el.rating  === 0) {
              flag = true;
              break;
            }
          }

          // 如果含有未点评上级
          if (flag) {
            this.isPopupShow = true;
            this.parentList = data;
          }
        }
      }
    },

    // 判断是否点评过直属推荐人
    isManagerGraded () {
      let flag = false;
      let id = this.managerInfo.id;
      for (let el of this.parentList) {
        if (el.user_id === id) {
          if (el.rating === 1) {
            flag = true;
          }
          break;
        }
      }
      return flag;
    },

    // 去点评
    comment () {
      let flag = this.isManagerGraded();
      if (flag) {
        this.$toast('已评价直属推荐人，请点评更多领导');
        return;
      }
      this.$router.push({ name: 'task.Score', query: { fromR: 'leaderGrade', ratingId: this.managerInfo.id } });
    },

    // 微信聊
    showWechatCode (el) {
      this.wechat_account = el.wechat_account;
      this.wx_qrcode = el.wx_qrcode;
      this.isWechat = true;
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    //  微聊
    handleGotoChat (id) {
      this.$router.push({
        name: 'chat.Home',
        params: { id }
      });
    },
  }
};
