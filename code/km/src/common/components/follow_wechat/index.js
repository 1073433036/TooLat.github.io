import './index.scss';

import _              from 'lodash';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'follow_wechat',
  props: {
  },
  data () {
    return {
      routeArr: [
        'user.Home',
      ],

      startPageY: 0,
      endPageY  : 0,
      isWechat  : false,
      peerInfo  : {},
      isEnd     : false,
      subscribe : {},
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
    this.handleCheckFollowWechat();

    if (true === this.device.is('WeChat')) {
      this.handlePeerInfo();
      this.handleFollowWechatClick();
    }
  },
  watch: {
    currentRoute () {
      this.handleCheckFollowWechat();
    },

    userInfo () {
      this.handleCheckFollowWechat();
    }
  },
  methods: {

    // 触摸事件
    handleCheckFollowWechat () {
      let self  = this;
      let index = _.indexOf(self.routeArr, self.currentRoute);

      if (-1 !== index && true === this.device.is('WeChat')) {
        document.addEventListener('touchstart', function (event) {
          self.touchstart(event);
        }, true);

        document.addEventListener('touchend', function (event) {
          if (false === self.isEnd) {
            self.isEnd = true;
            self.touchend(event);
          }
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
        self.isEnd = false;

        if (event && event.preventDefault &&
          -1 === target.className.indexOf('dialog-item') &&
          -1 === target.className.indexOf('header-back') &&
          -1 === target.className.indexOf('hp-close') &&
          -1 === target.className.indexOf('sp-mark') &&
          -1 === target.className.indexOf('foot-menu') &&
          -1 === target.className.indexOf('foot-menu-em') &&
          -1 === target.className.indexOf('foot-car') &&
          -1 === target.className.indexOf('icon-07') &&
          -1 === target.className.indexOf('icon-11') &&
          -1 === target.className.indexOf('icon-12') &&
          -1 === target.className.indexOf('sp-user-home-07') &&
          -1 === target.className.indexOf('sp-user-home-11') &&
          -1 === target.className.indexOf('sp-utility-home') &&
          -1 !== index) {

          if (0 === _.get(self.subscribe, 'code')) {
            event.preventDefault();
          }

          if (false === isEnd) {
            isEnd = true;
            setTimeout(() => {
              self.endPageY = event.changedTouches[0].pageY;
              if (10 >= Math.abs(self.endPageY - self.startPageY) && 0 === _.get(self.subscribe, 'code')) {
                self.isWechat = true;
              }
              isEnd = false;
            }, 500);
          }
        }
      }
    },

    // 是否关注微信号接口
    handleFollowWechatClick () {
      // if (_.isEmpty(this.subscribe)) {
      //   Models.Home
      //   .wechatSubscribe()
      //   .then((res) => {
      //     this.subscribe = res;
      //   });
      // }
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
  }
};
