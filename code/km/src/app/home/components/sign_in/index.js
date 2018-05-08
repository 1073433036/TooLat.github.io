import './index.scss';
import 'swiper/dist/css/swiper.css';

import Header   from '~common/components/header';
import Models   from '~common/models';
import Swiper   from 'swiper';
import _        from 'lodash';

export default {
  name: 'SignIn',
  data () {
    return {
      /*
       * @param isDisabled        签到状态 可签到：false，已签到：true
       * @param stateText         签到状态文字 '签到' or '已签到'
       * @param integral          当前积分
       * @param send_integral     签到送的积分数
       * @param times             累计签到
       * @param formTemp.history  签到历史列表
       * @param formTemp.goods    积分商城 - 商品列表
       * @param formTemp.activity 抽奖活动列表
       * @param time              当前时间
       * @param monthList         月份列表
       * @param activityId        抽奖活动id
       * @param consume           抽奖消耗积分
       * @param isLucky           0：不中奖，1：中奖
       * @param luckyGoods        奖品名
       * @param isShowLucky       显示中奖的
       * @param isShowNoLucky     显示不中奖的
       * @param luckyDog          中奖记录（所有人）
       * @param luckyTotal        中奖人数
       */
      isDisabled: false,
      stateText: '签到',
      integral: '',
      send_integral: '',
      prizedesc: '',
      turnAnimationClass: '',
      turnAnimationCount: 0,
      times: '',
      formTemp: {
        history: [],
        goods: [],
        activity: [],
      },
      nowTime: new Date(),
      monthList: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
      activityId: '',
      consume: '',
      isLucky: '',
      luckyGoods: '',
      isShowLucky: false,
      isShowNoLucky: false,
      luckyDog: [],
      luckyTotal: '',
      luckyId: '',

      luckySwiper: '',
			swiperOption: {
				direction : 'vertical',
        spaceBetween: 10,
        slidesPerView: 'auto',
        loop: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
			},

			swiperList: {
        direction : 'vertical',
				autoplay: 500,
				loop: true,
        height: 25,
			},
    };
  },
  components: {
		'app-header': Header,
  },
  computed: {
    /*
     * @param nowDate          日期
     * @param nowDate          月份
     */
    nowDate () {
      return this.nowTime.getDate();
    },
    nowMonth () {
      return this.nowTime.getMonth();
    },

    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
    this.signIn();
    this.signInList();
    this.goodsList();
    this.lucky();
	},
	watch: {
  },
  methods: {

    /*
    点击抽奖模块
     */
    drawRaffle () {
      //重置转盘
      this.turnAnimationClass = '';
      let prizeArr = ['Iphone', 'WIFI', '旅行箱', '皮带', '视频VIP', '200积分', '800积分', '再来一次'];

      if (this.integral * 1 >= this.consume * 1) {
        Models.User.luckyRun({
          id: this.activityId
        }).then(res => {
          if (1 === res.code) {
            if (res.data.is_lucky) {
              this.currentIntegral = res.data.user_integral;
              this.luckyGoods = res.data.prize;
              let patternStr = res.data.prize.prize;
              prizeArr.forEach((item) => {
                let matchStr = patternStr.match(item);
                if (matchStr) {
                  this.prizedesc = matchStr[0];
                }
              });
              this.turnFunc();
            }
          }
          else {
            this.$toast(res.msg);
          }
        });
      }
      else {
        let tips = `抽奖需要${this.consume}积分，当前${this.integral}积分`;
        this.$store.get.dispatch({
          type : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : tips,
          lists : [
            {
              msg: '确定',
              func () {
              },
              class: 'ok',
            },
          ]
        });
      }

    },

    turnFunc () {
      setTimeout(() => {
        this.turnAnimationClass = 'animation-time-pre-control1';
        this.turnAnimationCount = 1;

        //监听动画开始事件
        this.$refs.turnimg.addEventListener('animationstart', () => {
          if ('stopturn' === this.turnAnimationCount) {
            return;
          }

          setTimeout(() => {
            if ( 1 === this.turnAnimationCount ) {
              if ('Iphone' === this.prizedesc) {
                this.turnAnimationClass = 'animation-time-control1';
              }
              else if ('旅行箱' === this.prizedesc) {
                this.turnAnimationClass = 'animation-time-control2';
              }
              else if ('皮带' === this.prizedesc) {
                this.turnAnimationClass = 'animation-time-control3';
              }
              else if ('200积分' === this.prizedesc) {
                this.turnAnimationClass = 'animation-time-control4';
              }
              else if ('WIFI' === this.prizedesc) {
                this.turnAnimationClass = 'animation-time-control5';
              }
              else if ('视频VIP' === this.prizedesc) {
                this.turnAnimationClass = 'animation-time-control6';
              }
              else if ('再来一次' === this.prizedesc) {
                this.turnAnimationClass = 'animation-time-control7';
              }
              else if ('800积分' === this.prizedesc) {
                this.turnAnimationClass = 'animation-time-control8';
              }
              this.turnAnimationCount = 'stopturn';
            }
          }, 1820);

        });

        //监听动画完成事件
        this.$refs.turnimg.addEventListener('animationend', () => {
          if ('animation-time-pre-control1' !== this.turnAnimationClass && 'stopturn' === this.turnAnimationCount) {
            if ('再来一次' === this.prizedesc) {
              this.isShowNoLucky = true;
              this.isLucky = false;
            }
            else {
              this.isShowLucky = true;
              this.isLucky = true;
            }
            this.integral = this.currentIntegral;
          }
        }, false);

      }, 100);

    },

    /*
     * 签到 - 判断是否可签到
     */
    signIn () {
      let self = this;
      Models.User
      .signIn()
      .then((res) => {
        self.integral = res.data.integral;
        self.send_integral = res.data.send_integral;
        self.times = res.data.times;
        if (1 === res.code) {
          self.isDisabled = false;
          self.stateText = '签到';
        }
        else {
          self.isDisabled = true;
          self.stateText = '已签到';
        }
      });
    },

    /*
     * 签到 - 签到历史
     */
    signInList () {
      let self = this;
      Models.User
      .signInList()
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.history = res.data;
        }
      });
    },

    /*
     * 签到 - 签到
     */
    setSignIn () {
      let self = this;
      if (!self.isDisabled) {
        Models.User
        .setSignIn()
        .then((res) => {
          if (1 === res.code) {
            self.signIn();
            self.signInList();
            self.$store.get.dispatch({
              type : 'handleChangeDialog',
              active: true,
              title : '签到成功',
              msg   : res.msg,
              lists : [
                {
                  msg: '确定',
                  func () {
                  },
                  class: 'ok',
                },
              ]
            });
          }
          else {
            self.$store.get.dispatch({
              type : 'handleChangeDialog',
              active: true,
              title : '温馨提示',
              msg   : res.msg,
              lists : [
                {
                  msg: '确定',
                  func () {
                  },
                  class: 'ok',
                },
              ]
            });
          }
        });
      }
    },

    /*
     * 积分兑换 - 商品列表
     */
    goodsList () {
      let self = this;
      Models.User
      .integralGoodsList()
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.goods = res.data;
        }
      });
    },

    /*
     * 积分抽奖 - 活动列表
     */
    lucky () {
      let self = this;
      Models.User
      .lucky()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.activityId = data.data[0].id;
          self.consume = data.data[0].integral;
          self.luckyDetail();
          self.luckyLog();
        }
      });
    },

    /*
     * 积分抽奖 - 活动详情及奖品
     */
    luckyDetail () {
      let self = this;
      Models.User
      .luckyInfo({
        params: {
          id: self.activityId
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.formTemp.activity = data.prize_list;
          self.$nextTick(() => {
            self.luckySwiper = Swiper(self.$refs.sliderSwiper, self.swiperOption);
          });
        }
      });
    },

    /*
     * 积分抽奖 - 抽奖
     */
    luckDraw () {
      let self = this;
      self.swiperOption.speed = 1;
      self.swiperOption.autoplay = 1;

      setTimeout(() => {
        self.swiperOption.speed = 300;
        self.swiperOption.autoplay = 3000;

        Models.User
        .luckyRun({
          id: self.activityId
        })
        .then((res) => {
          if (1 === res.code) {
            let data = res.data;
            self.luckyId = data.id;
            self.isLucky = data.is_lucky;
            if (self.isLucky) {
              self.isShowLucky = true;
              self.isShowNoLucky = false;
            }
            else {
              self.isShowNoLucky = true;
              self.isShowLucky = false;
            }
            self.luckyGoods = data.prize;
            self.integral = data.user_integral;
          }
          else {
            self.$toast(res.msg);
          }
        });
      }, 3000);
    },

    /*
     * 积分抽奖 - 领取奖品
     */
    award () {
      let self = this;
      let route = {
        name: 'home.PrizeGet',
        params: {
          id: self.luckyId
        }
      };
      self.$router.push(route);
    },

    /*
     * 积分抽奖 - 我的奖品
     */
    myAward () {
      let self = this;
      let route = {
        name: 'home.MyPrize',
        params: {
          id: self.activityId
        }
      };
      self.$router.push(route);
    },

    /*
     * 积分抽奖 - 中奖记录（所有人）
     */
    luckyLog () {
      let self = this;
      Models.User
      .luckyLog({
        params: {
          id: self.activityId
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.luckyDog = data.data;
          self.luckyTotal = data.total;
          self.$nextTick(() => {
            Swiper(self.$refs.mySwiper, self.swiperList);
          });
        }
      });
    },

		/*handleTest () {
      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '兑换失败',
        msg   : '很抱歉！您的积分不足，无法兑换',
        lists : [
          {
						msg: '确定',
						class: 'ok',
          },
        ]
      });
		},*/
  },
};