import './index.scss';
import 'swiper/dist/css/swiper.css';

import _              from 'lodash';
import Swiper         from 'swiper';
import StartPage      from '~common/components/start_page';
import Footer         from '~common/components/footer';
import Footing        from '~common/components/page_footing';
import GuidePage      from '~common/components/guide_page';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';
import SessionStorage from '~common/services/sessionStorage.cookie';
import NotifyPopup    from '~common/components/notify_popup';

export default {
  name: 'home',
  data () {
    return {
      formTemp: {
        catList: []
			},
      swiper: '',
			swiperOption: {
				notNextTick: true,
        autoplay: 2000,
        grabCursor : true,
        pagination : '.swiper-pagination',
        paginationClickable :true,
        mousewheelControl : false,
				autoplayDisableOnInteraction: false,
				observer:true,
				observeParents:true,
        loop: true
      },

			isWechat : false,
      isMaskVip: false,
			noMaskVip: false,
      isGuide  : false,
      isNotice : false,
      peerInfo : {},

      isNoticeShow: false,
      notifyMsg: [],
      unreadArticleNum: 0,
      isQrCodeShow: false,
      qrCodeUrl: '',
    };
  },
  components: {
    'app-start'  : StartPage,
		'app-footer' : Footer,
		'app-footing': Footing,
    GuidePage,
    'notify-popup': NotifyPopup,
  },
  created () {
  },
  computed: {
    userInfo () {
      let data = _.get(this.$store.get.state, 'App.userInfo') || this.$user.get();
      return data;
    },
    isStart () {
      return this.$store.get.state.StartPage.isStart;
    },
    message () {
      return _.get(this.$store.get.state, 'Message.content.msg');
    },
    isWechatClient () {
      return this.device.is('WeChat');
    },
  },
  mounted () {
		this.getCategories();
		this.$nextTick(() => {
      /* eslint-disable */
      let swiper = new Swiper(this.$refs.homeSwiper, this.swiperOption);
      /* eslint-enable */
    });

    //公告
    // this.setNotice();
    this.getUnreadIncrease();
    // 备用公众号
    // if (this.device.is('WeChat')) {
    //   this.followWechat();
    // }
  },
  watch: {

    isStart (val) {
      if (false === val) {
        this.wechatSubscribe();
      }

    },

    // 监听微信公众号弹框
    isWechat (val) {
      if (!val && !this.isWechat) {
        // this.handlePrompt();
      }

      if (!val && !this.noMaskVip) {
        this.handleGuide();
      }
    },

    isMaskVip (val) {
      if (!val && !this.isWechat) {
        this.handleGuide();
      }
    },

  },

  methods: {
    //是否关注公众号
    followWechat () {
      Models.User.weixin({
        back_url : window.location.href,
      })
      .then((res) => {
        if (0 === res.code) {
          this.qrCodeUrl = res.data.qrcode;
          if (res.data.qrcode) {
            this.isQrCodeShow = true;
          }
        }
        else if (2 === res.code) {
          window.location.href = res.data.url;
        }
      });
    },

    linkToBuyVip () {
      // if (this.isWechatClient) {
      //   this.$toast('该功能仅对APP用户开放');
      // }
      // else {
      //   this.$router.push({ name: 'user.BuyVip' });
      // }
      this.$router.push({ name: 'user.BuyVip' });
    },

    linkToNovice () {
      // if (!this.isWechatClient) {
        this.$router.push({ name: 'home.Novice' });
      // }
    },

    linkToAdvertise () {
      this.$toast('敬请期待');
      // if (this.isWechatClient) {
      //   this.$toast('该功能仅对APP用户开放');
      // }
      // else {
      //   this.$router.push({ name: 'tool.AdvertiseHome', query: {typeid: 28}});
      // }
    },

    stopUse () {
      this.$toast('即将开发');
    },
    handleGuide () {
      // let guideNumber = LocalStorage.get('guideNumber');
      // let data = _.get(guideNumber, 'data') || 0;
      // if (2 > data * 1) {
        this.isGuide = true;
      // }
    },

    onGuideClick () {
      this.$refs.myscroller.scrollTo(0, window.innerHeight, true);
    },

    // 获取分享用户
    handlePeerInfo () {
      let uid = LocalStorage.get('invite_code');
      if (!_.isEmpty(uid.data)) {
        Models.Friend
        .info({
          params: {
            user_id: uid.data,
          }
        })
        .then((res) => {
          if (1 === res.code) {
            let data = res.data;
            this.peerInfo = data;
          }
        });
      }

    },


    // 提示框
    handlePrompt () {
      let self = this;
      let idCard = _.get(self.userInfo, 'id_card');
      let showNumber = LocalStorage.get('showNumber');
      let data = _.get(showNumber, 'data') || 0;

      if (2 > data * 1) {
        LocalStorage.set('showNumber', data + 1);
        if (_.isEmpty(idCard)) {
          self.isMaskVip = true;
          self.noMaskVip = true;
        }
      }

      // 不是付费会员并且没有实名验证 修改+2
      // else if (1 >= self.userInfo.level && _.isEmpty(idCard)) {
      //   self.isMaskVip = true;
      //   self.noMaskVip = true;
      // }
      else {
        self.isMaskVip = false;
        self.noMaskVip = false;
      }
		},
		//去实名
		autonym () {
			this.$router.push({name: 'user.Certify'});
		},

    /*
     * 获取文章分类列表
     */
    getCategories () {
      // let catList = SessionStorage.get('home.CatList');

      // if (_.isEmpty(catList.data)) {
        Models.Portal
        .categories()
        .then((res) => {
          if (1 === res.code) {
            let data = res.data;
            this.formTemp.catList = data;
            SessionStorage.set('home.CatList', data, 60 * 5);
          }
        });
      // }
      // else {
      //   this.formTemp.catList = catList.data;
      // }

		},

		signIn () {
			this.$router.push({ name: 'home.SignIn' });
		},

    // 判断用户是否关注公众号
    wechatSubscribe () {
      // let wechatSubscribe = SessionStorage.get('home.wechatSubscribe');

      // if (_.isEmpty(wechatSubscribe.data)) {
        Models.Home
        .wechatSubscribe()
        .then((res) => {
          SessionStorage.set('home.wechatSubscribe', res, 60 * 5);
          this.handleSubscribe(res);
        });
      // }
      // else {
      //   this.handleSubscribe(wechatSubscribe.data);
      // }
    },

    // 是否关注公众号弹框
    handleSubscribe (res) {
      if (0 === res.code * 1 && true === this.device.is('WeChat')) {
        this.handlePeerInfo();
        // 暂时关闭公众号弹窗
        // this.isWechat = true;
      }
      else {
        this.$nextTick(() => {
          this.handlePrompt();
          if (!this.isMaskVip && !this.isWechat) {
            this.handleGuide();
          }
        });
      }
    },

    //无卡闪付跳转
    skipPayPage () {
      this.$router.push({name: 'home.EmptyPay'});

      // this.$store.get.dispatch({
      //   type: 'Loading',
      //   isShow: true
      // });
      // Models.Pay.userBundleLBankist().then(res => {
      //   if (1 === res.code) {
      //     if (res.data.total) {
      //       this.$router.push({name: 'home.EmptyPay'});
      //     }
      //     else {
      //       this.$router.push({name: 'home.Auth'});
      //     }
      //   }
      //   else {
      //     this.$store.get.dispatch({
      //       type: 'Loading',
      //       isShow: false
      //     });
      //     this.$toast(res.msg);
      //   }
      // });
    },

    // 还款提醒
    remaindPay () {
      /*if (1 === this.userInfo.level) {
        // this.notifyMsg = ['抱歉！该板块功能仅高级会员及以上身份会员享受，如您要使用该功能请升级会员或找您的上级代理操作，感谢您的配合！'];
        // this.isNoticeShow = true;
        this.$toast('即将开启');
      }
      else {
        this.$router.push({ name: 'home.NoopsycheCultivateCard' });
      }*/
      this.$router.push({ name: 'home.Generation' });
      // window.location.href = 'https://m.kamengjinfu.com/noopsychecultivatecard';
    },

    toggleNotifyFn () {
      this.isNoticeShow = false;
    },

    /*
     * @是否是高级会员及以上级别
       @issue         BOSS
       @problem       普通会员信用卡奖金、贷款奖金说明不能让他看到，只有交了钱的高级会员及以上级别才能看到
       @param         userInfo.level === 1 普通会员
       @author        2018-01-06 李华东 第一次修改
       @author        2018-01-08 李华东 第二次修改
     */
    isVip () {
      let route = {
        name: 'home.NoopsycheCreditRefer'
      };
      this.$router.push(route);

      /*let self = this;
      if (1 === this.userInfo.level) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '目前此功能只针对高级会员及以上身份开放，是否立即升级会员？',
          lists : [
            {
              msg: '关闭',
            },
            {
              msg: '立即升级',
              class: 'ok',
              func () {
                let route = {
                  name: 'user.BuyVip'
                };
                self.$router.push(route);
              },
            }
          ]
        });
      }
      else {
        let route = {
          name: 'home.NoopsycheCreditRefer'
        };
        this.$router.push(route);
      }*/

    },

    /*
     * 每天弹5次
     */
    setNotice () {
      let self = this;
      let data = LocalStorage.get('noticeIndex');

      // 当天有效
      let cTime = new Date().getDate();
      let time  = _.get(data, 'expired') ? new Date(_.get(data, 'expired') * 1000).getDate() : '';

      if (_.isEmpty(time + '') || cTime > time) {
        LocalStorage.remove('noticeIndex');
      }

      if (_.isEmpty(data)) {
        data.data = 0;
      }

      if (5 > data.data * 1) {
        LocalStorage.set('noticeIndex', data.data + 1, 60 * 60 * 24 * 1);
        setTimeout(() => {
          self.isNotice = true;
        }, 500);
      }
    },

    // 获取新增未读提额秘籍数量
    getUnreadIncrease () {
      let self = this;
      let increaseData = [];
			Models.Increase.categories({ params: { type:1 } }).then(res => {
        if (1 === res.code) {
          increaseData = res.data;
          Models.Increase.categories({ params: { type:15 } }).then(result => {
            if (1 === result.code) {
              increaseData = increaseData.concat(result.data);

              let isReadData = localStorage.getItem('articleRead');
              if (isReadData) {
                isReadData = JSON.parse(isReadData);
                let time = isReadData.time;
                let today = this.getToday();

                // 判断数据存储时间是否是今天
                if (today < time) {
                  for (let el of increaseData) {
                    self.unreadArticleNum += el.today_count - (isReadData.detail[el.id] ? isReadData.detail[el.id] : 0);
                  }
                }
                else {
                  for (let el of increaseData) {
                    self.unreadArticleNum += el.today_count;
                  }
                }
              }
              else {
                for (let el of increaseData) {
                  self.unreadArticleNum += el.today_count;
                }
              }
            }
          });
        }
			});
    },

    // 获取今天0点时间戳
    getToday () {
      let y = new Date().getFullYear(),
          m = new Date().getMonth() + 1,
          d = new Date().getDate();
      return new Date(y + '/' + m + '/' + d).getTime();
    },

  }
};
