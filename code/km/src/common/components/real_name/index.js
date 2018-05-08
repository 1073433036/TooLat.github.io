import './index.scss';

import _ from 'lodash';

export default {
  name: 'real_name',
  props: {
  },
  data () {
    return {
      routeArr: [
        'home.Auth',
        'home.NoopsycheCultivateCard',
        'user.WithdrawDeposit',
        'user.BuySuccess',
        'user.IntegralDetail',
        'user.MakeOver',
      ],

      startPageY: 0,
      endPageY  : 0,
    };
  },
  components: {
  },
  computed: {
    currentRoute () {
      return _.get(this.$store.get.state, 'App.currentRoute') || {};
    },
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || this.$user.get() || {};
    },
  },
  mounted () {
    let self = this;
    self.handleCheckRealName();
  },
  watch: {
    currentRoute () {
      this.handleCheckRealName();
    },

    userInfo () {
      this.handleCheckRealName();
    }
  },
  methods: {

    handleCheckRealName () {
      let self = this;
      let index   = _.indexOf(self.routeArr, self.currentRoute);
      let idCard = _.get(self.userInfo, 'id_card');

      if (-1 !== index && _.isEmpty(idCard + '')) {
        document.addEventListener('touchstart', function (event) {
          self.touchstart(event);
        }, true);

        document.addEventListener('touchend', function (event) {
          self.touchend(event);
        }, true);
      }

    },

    // touchstart事件函数
    touchstart (event) {
      if (event) {
        let self = this;
        let isStart = false;
        if (false === isStart) {
          isStart = true;
          setTimeout(() => {
            self.startPageY = event.touches[0].pageY;
            isStart = false;
          }, 500);
        }
      }
    },

    // touchend事件函数
    touchend (event) {
      if (event) {
        let self    = this;
        let target  = event.target;
        let isEnd   = false;
        let index   = _.indexOf(self.routeArr, self.currentRoute);

        if (event && event.preventDefault &&
          -1 === target.className.indexOf('dialog-item') &&
          -1 === target.className.indexOf('header-back') &&
          -1 === target.className.indexOf('sp-overdue') &&
          -1 === target.className.indexOf('suspend-img') &&
          -1 === target.className.indexOf('slot-name') &&
          -1 === target.className.indexOf('sp-utility-home') &&
          -1 !== index) {

          if (-1 === target.className.indexOf('system-notify-close-btn')) {
            event.preventDefault();
          }

          if (false === isEnd) {
            isEnd = true;
            setTimeout(() => {
              self.endPageY = event.changedTouches[0].pageY;
              if (10 >= Math.abs(self.endPageY - self.startPageY)) {
                self.handleRealNameClick();
              }
              isEnd = false;
            }, 500);
          }
        }
      }
    },

    // 弹框提示
    handleRealNameClick () {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '尊敬的用户，为了确保用户信息的唯一性和安全性，保障用户权益，确保账户资金安全，请您先进行实名认证，方可免费办理此业务！',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '立即前往',
            class: 'ok',
            func () {
              setTimeout(() => {
                let route = {
                  name: 'user.Certify'
                };
                self.$router.push(route);
              }, 500);
            },
          }
        ]
      });
    }
  }
};
