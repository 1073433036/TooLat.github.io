import './index.scss';


import _              from 'lodash';
import Header         from '~common/components/header';
import Footing        from '~common/components/page_footing';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';
import Tips           from '../credit_card_list/components/tips';

export default {
  name: 'creditcard',
  data () {
    return {
			isMaskVip   : false,
      isSee:false,
      state: {},
			isBonus: false,
			isExplain   : false,
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      catList: [],
      formTemp: {
        bankData: [],
        hotBankData: [],
        catList: [],
      },

      currentBank: {},
			bankId: '',
			brokerage:'',
			bank_name:'',
      positionStart: 0,
      positionEnd: 0,
      isWeChatShare: false,
      isShare: false,
      isBankTips: false,
      day: '',
    };
  },
  components: {
		'app-header': Header,
		'app-footing': Footing,
    Tips,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    appShareData () {
      return _.get(this.$store.get.state, 'App.histData.appShareData') || {};
		},
		isWechatClient () {
      return this.device.is('WeChat');
		},
  },
  mounted () {
    this.getForum();
    let self = this;

    self.bankList();
    self.getCategories();
    self.hotBankList();

    let myScroller = self.$refs.my_scroller;

    if (myScroller) {
      document.addEventListener('touchmove', function () {
        let positionData = myScroller.getPosition();
        self.positionEnd = positionData.top;
        if (self.positionEnd > self.positionStart) {
          self.isWeChatShare = true;
        }
        else {
          self.isWeChatShare = false;
        }
        self.positionStart = positionData.top;
      }, false);
    }


  },
  watch: {
    userInfo (value, old) {
      let self = this;
      if (!_.isEmpty(value) && _.isObject(value) && value !== old) {

        self.handleAudio();

        let userName = value.real_name || value.user_nickname;
        if (1 === value.has_car * 1 && 1 === value.has_card && !_.isEmpty(value.id_card)) {

          if (_.isEmpty(userName)) {
            userName = value.user_nickname;
            userName = userName.substring(0, 6);
          }
          // self.dialogHasCard(userName);
        }
        else {
          let ruleNumber = LocalStorage.get('ruleNumber');
          let data = _.get(ruleNumber, 'data') || 0;

          // 只弹出2次
          if (2 > data * 1) {
            LocalStorage.set('ruleNumber', data + 1);
            self.$store.get.dispatch({
              type  : 'handleChangeDialog',
              active: true,
              title : '温馨提示',
              msg   : '活动期间平台实习会员，通过宣传推广赚取佣金，业绩考核晋升正式会员佣金奖励，即可提现到个人账户，免费实习会员制针对办卡和招商业务板块',
              lists : [
                {
                  msg: '取消',
                },
                {
                  msg: '查看详情',
                  class: 'ok',
                  func () {
                    self.$router.push({
                      name: 'home.Rule'
                    });
                  }
                }
              ]
            });
          }
        }
      }
    }
  },
  methods: {
    // 获取版块通知
    async getForum () {
      let res = await Models.Notify.forum('credit_card');
      if (res.code === 1) {
        this.$store.get.dispatch({
          type: 'setSystemMessage',
          message: res.data
        });
      }
    },

    handleAudio () {
      let audio = LocalStorage.get('cardAudio');

      // 当天有效
      let cTime = new Date().getDate();
      let time  = _.get(audio, 'expired') ? new Date(_.get(audio, 'expired') * 1000).getDate() : '';

      if (_.isEmpty(time + '') || cTime > time) {
        LocalStorage.remove('cardAudio');
      }

      if (_.isEmpty(audio)) {
        audio.data = 0;
      }

      if (5 > audio.data * 1 && 1 === this.userInfo.app_msg_push * 1) {
        LocalStorage.set('cardAudio', audio.data + 1, 60 * 60 * 24 * 1);
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

    // 点击分享按钮
    handleShareClick () {

      if (false === this.device.is('WeChat') && window.js_obj) {
        /* eslint-disable */
        let data = {
          title     : this.appShareData.title,
          desc      : this.appShareData.desc,
          url       : this.appShareData.link,
          share_img : this.appShareData.imgUrl
        };

        js_obj.shareWeb(JSON.stringify(data));
        /* eslint-enable */
      }
      else {
        this.isShare = true;
      }
    },

    // 判断是否有车，然后弹出提示
    dialogHasCard (userName) {
      console.log(userName);
      // let self = this;
      // self.$store.get.dispatch({
      //   type  : 'handleChangeDialog',
      //   active: true,
      //   title : '温馨提示',
      //   msg   : `${userName}，听说您名下有车，卡盟金服推荐您办理一张平安车主卡，最高额度是5万，平时对车主很实用`,
      //   lists : [
      //     {
      //       msg: '取消',
      //     },
      //     {
      //       msg: '立即前往',
      //       class: 'ok',
      //       func () {
      //         self.$router.push({
      //           name: 'home.CreditCardList',
      //           params: {
      //             bid: 8,
      //           }
      //         });
      //       }
      //     }
      //   ]
      // });
    },

    /*
     * 热门银行机构
     */
    bankList () {
      Models.Bank
      .list({
        params: {
          page: 1,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formTemp.bankData = data.data;
        }
      });
    },

    /*
     * 获取文章分类列表
     */
    getCategories () {
      Models.Portal
      .categories({
        params: {
          type:1
        }
      })
      .then((res) => {
        if (1 === res.code) {
          this.formTemp.catList = res.data;
        }
      });
    },

    // 弹出层
    handleBonus (item) {
      // if (this.isWechatClient) {
      //   return;
      // }

      this.isBonus      = true;
			this.currentBank  = item;
      this.day = this.currentBank.work_day.slice(4, 15);
			this.brokerage = item.bonus;
			this.bank_name = item.name;
      this.isBankTips = false;

      if (11 === item.id * 1) {
        this.isBankTips = true;
      }

    },


    /*
     * 年度热申信用卡排行榜
     */
    hotBankList () {
      Models.Credit
      .hot()
      .then((res) => {
        if (1 === res.code) {
          this.formTemp.hotBankData = res.data;
        }
      });
    },

    /*
     * 上拉刷新
     */
    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.bankList();
        self.hotBankList();
        done();
      }, 1500);
    },

    /*
     * 判断是否实名验证
     */
		isVip (id) {
      this.bankId = id;
      // if (1 === this.userInfo.level * 1) {
      //   this.isMaskVip    = true;
      // }
      // else {
        let route = {
          name: 'home.CreditCardList',
          params: {
            bid: this.bankId,
          },
        };
        this.$router.push(route);
      // }

    },

    /*
     * 关闭直接进入信用卡列表
     */
    closeVip () {
      this.isMaskVip = false;
      let route = {
        name: 'home.CreditCardList',
        params: {
          bid: this.bankId,
        },
      };
      this.$router.push(route);
    },

    /*
     * @是否是高级会员及以上级别
       @issue         BOSS
       @time          2018-01-06
       @content       普通会员信用卡奖金、贷款奖金说明不能让他看到，只有交了钱的高级会员及以上级别才能看到
       @param         userInfo.level === 1 普通会员
       @edit          李华东
       @edit number   第一次
     */
    isMember () {
      let self = this;
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
          name: 'home.CreditCardLarge'
        };
        this.$router.push(route);
      }
    },

  },
  filters: {
    levelText (value) {
      let name = '普通会员';
      switch (value) {
        case 1:
          name = '普通会员';
          break;
        case 2:
          name = '高级会员';
          break;
        case 3:
          name = '专员';
          break;
        case 4:
          name = '经理';
          break;
        case 5:
          name = '个人代理';
          break;
        case 6:
          name = '区域代理';
          break;
      }
      return name;
    },
    filterNumber (value) {
      if (value) {
        return 10000 <= value * 1 ? `${(value * 1 / 10000).toFixed(1)}万` : value;
      }
      return value;
    },
  },
};
