import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Footer         from '~common/components/footer';
import GuidePage      from '~common/components/guide_page';
import Models         from '~common/models';
import SessionStorage from '~common/services/sessionStorage.cookie';
import LocalStorage   from '~common/services/localStorage.cookie';
import ClipboardJS    from 'clipboard';
import leaderGrade    from './components/leaderGrade';
import ServiceCuetomerPopup from '~common/components/service_customer_popup';

export default {
  name: 'userHome',
  data () {
    return {
      integral    : '',
      isCard      : false,
      isLoan      : false,
      pointText   : {},

      /*
       * 消息提醒
       * @param     user_account    账户管理
       * @param     user_team       我的团队
       */
      user_account: '',
      user_team   : '',
      teamNum     : 0,
      isGuide     : false,
      isFilter    : false,
      isNotice    : false,
      isSenior    : false,
    };
  },
  components: {
    'app-header': Header,
    'app-footer': Footer,
    GuidePage,
    'leader-grade': leaderGrade,
    'service-cuetomer-popup': ServiceCuetomerPopup,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    message () {
      let data = _.get(this.$store.get.state, 'Message.content.msg');
      return data;
    },

    changeFilter () {
      let data = _.get(this.$store.get.state, 'App.histData');
      return data;
    },
    isWechatClient () {
      return this.device.is('WeChat');
    }
  },
  mounted () {
    let clipboard = new ClipboardJS('.inviteCode');
    clipboard.on('success', () => {
      setTimeout(() => {
        this.$toast('推荐码复制成功');
      }, 1000);
    });

    this.signIn();
    // this.handleCard();
    // this.handleLoan();
    this.getPoint();
    // this.getTeamNum();

  },
  watch: {
    userInfo (val, old) {
      if (!_.isEmpty(val) && val !== old) {
        let self = this;

        self.handleAudio();

        if (1 >= val.level) {
          self.isGuide = true;
          self.getTeamNum();

          let data = LocalStorage.get('guideNumber');
          if (_.isEmpty(data) || 2 > _.get(data, 'data.user') || 0) {
            self.isFilter = true;
          }
          else {
            self.isFilter = false;
          }
        }

        self.setUserSenior(val);

      }
    },

    changeFilter (val) {
      this.isFilter = val.isFilter || false;
    }
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

    handleAudio () {
      let audio = LocalStorage.get('userAudio');

      let cTime = new Date().getDate();
      let time  = _.get(audio, 'expired') ? new Date(_.get(audio, 'expired') * 1000).getDate() : '';

      if (_.isEmpty(time + '') || cTime > time) {
        LocalStorage.remove('userAudio');
      }

      if (_.isEmpty(audio)) {
        audio.data = 0;
      }

      if (5 > audio.data * 1 && 1 === this.userInfo.app_msg_push * 1) {
        LocalStorage.set('userAudio', audio.data + 1, 60 * 60 * 24 * 1);
        this.handlePlayAudio();
      }
    },

    // 播放语音
    handlePlayAudio () {
      let self = this;
      let isAudio = false;

      if ('ios' === self.device.os().toLowerCase()) {
        document.addEventListener('touchstart', function () {
          if (false === isAudio) {
            self.$refs.audio.play();
            isAudio = true;
          }
        }, false);
      }
      else {
        self.$refs.audio.play();
      }
    },

    /*
     * 获取团队总人数
     */
    getTeamNum () {
      let self = this;
      // let data = SessionStorage.get('user.TeamNum');

      // if (_.isEmpty(data.data)) {
        Models.User
        .getTeamNum()
        .then((res) => {
          if (1 === res.code) {
            SessionStorage.set('user.TeamNum', res.data, 60 * 2);
            self.teamNum = res.data;
          }
        });
      // }
      // else {
      //   self.teamNum = data.data;
      // }
    },

    // 根据ip获取定位
    async getPoint () {
      // let PointText = SessionStorage.get('user.PointText');

      // if (_.isEmpty(PointText.data)) {

        let data = await Models.Home
        .localCity()
        .then(res => res);

        if (1 === data.code) {
          this.pointText = data.data;
          SessionStorage.set('user.PointText', this.pointText);
        }
      // }
      // else {
      //   this.pointText = PointText.data;
      // }

    },

    /*
     * 获取用户积分
     */
    signIn () {
      let self = this;
      // let data = SessionStorage.get('user.signIn');

      // if (_.isEmpty(data.data)) {
        Models.User
        .signIn()
        .then((res) => {
          SessionStorage.set('user.signIn', res.data, 60 * 2);
          self.integral = res.data.integral;
        });
      // }
      // else {
      //   self.integral = data.data.integral;
      // }

    },

    /*
     * @是否有办卡
     * @issue         BOSS
     * @time          2018-01-06
     * @content       普通会员不显示微名片、团队管理、办卡查询、小贷查询、我的发布
     * @edit          李华东
     * @edit number   第一次
     */
    handleCard () {
      let self = this;
      Models.User
      .cardList({
        params: {
          type   : 1000,
        },
      })
      .then((res) => {
        if (1 === res.code && 0 !== res.data.data.length) {
          self.isCard = true;
        }
      });
    },

    /*
     * 是否有贷款
     */
    handleLoan () {
      let self = this;
      Models.User
      .lenderExamine()
      .then((res) => {
        if (1 === res.code && 0 !== res.data.data.length) {
          self.isLoan = true;
        }
      });
    },

    /*
     * 跳转团队管理
     */
    jumpTeam () {
      // 未完善个人信息
			// if (!this.userInfo.mobile) {
			// 	this.showUserDialog();
			// 	return;
      // }
      if (this.message.user_team) {
        this.onsend('user_team');
      }
      this.$router.push({name: 'user.Team'});
    },

    /*
     * 跳转意向代理
     */
    jumpUserYixiang () {
      // 未完善个人信息
			// if (!this.userInfo.mobile) {
			// 	this.showUserDialog();
			// 	return;
      // }
      if (this.message.user_yixiang) {
        this.onsend('user_yixiang');
      }
      this.$router.push({
        name: 'message.Team',
        query: {
          type: 1
        }
      });
    },


    /*
     * 视频账号
     */
    jumpVideoKey () {
      if (this.message.user_video) {
        this.onsend('user_video');
      }
      this.$router.push({name: 'user.VideoKey'});
    },

    /*
     * 发送socket消息
     */
    onsend (key) {
      this.$refs.footer.onsend(key);
    },

    onGuideClick () {
      this.$refs.myscroller.scrollTo(0, window.innerHeight, true);
    },

    /*
     * 每天弹2次
     */
    setUserSenior (val) {
      let self = this;
      let data = LocalStorage.get('userSeniorIndex');

      // 当天有效
      let cTime = new Date().getDate();
      let time  = _.get(data, 'expired') ? new Date(_.get(data, 'expired') * 1000).getDate() : '';

      if (_.isEmpty(time + '') || cTime > time) {
        LocalStorage.remove('userSeniorIndex');
      }

      if (_.isEmpty(data)) {
        data.data = 0;
      }

      if (2 > data.data * 1) {
        LocalStorage.set('userSeniorIndex', data.data + 1, 60 * 60 * 24 * 1);
        setTimeout(() => {
          if (2 === val.level * 1) {
            self.isNotice = true;
          }
          else if (3 === val.level * 1 || 4 === val.level * 1) {
            setTimeout(() => {
              self.isSenior = true;
            }, 0);
          }
        }, 500);
      }
    },
  },
};
