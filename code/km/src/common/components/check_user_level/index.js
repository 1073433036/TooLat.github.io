import './index.scss';

import _ from 'lodash';

export default {
  name: 'real_name',
  props: {
  },
  data () {
    return {
      routeArr: [
        'home.IncreaseList',
        'tool.UploadMaterial'
      ],

      isShow: false,

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
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo') || {};
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

    // 匹配路由组
    handleCheckRealName () {
      let self = this;
      let index   = _.indexOf(self.routeArr, self.currentRoute);
      let level = _.get(self.userInfo, 'level');

      if (-1 !== index && 1 >= level * 1) {
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
          -1 === target.className.indexOf('abolish') &&
          -1 === target.className.indexOf('commissioner') &&
          -1 === target.className.indexOf('header-back') &&
          -1 === target.className.indexOf('sp-utility-home') &&
          -1 !== index) {

          event.preventDefault();

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
      this.isShow = true;
    },

    handleGoToVip () {
      this.isShow = false;
      this.$router.push({
        name: 'user.BuyVip',
      });
    }
  }
};