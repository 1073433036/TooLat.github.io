import './index.scss';

import _       from 'lodash';
import Models  from '~common/models';

export default {
  name: 'to_auth',
  props: {
  },
  data () {
    return {
      isAuth: false,
      // routeArr: ['home.Loan', 'user.Poster', 'user.Exchange', 'user.Invite', 'user.Certificate'],
      routeArr: ['user.Poster', 'user.Exchange', 'user.Invite', 'user.Certificate'],
    };
  },
  components: {
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },

    lastRoute () {
      return _.get(this.$store.get.state, 'App.histData.lastRoute') || '';
    },

    historyRoute () {
      return _.get(this.$store.get.state, 'App.historyRoute') || '';
    },

    currentRoute () {
      return _.get(this.$store.get.state, 'App.currentRoute') || {};
    },

  },
  mounted () {
    this.handleSearch();

  },
  watch: {
    currentRoute () {
      this.isAuth = false;
      this.handleSearch();
    },
  },
  methods: {

    //查找路由组
    handleSearch () {
      let index = _.indexOf(this.routeArr, this.currentRoute);

      if (-1 < index) {
        this.isAuth = true;
        this.goAuth();
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
        let index = _.indexOf(this.routeArr, this.currentRoute);

        if (event && event.preventDefault &&
          -1 === target.className.indexOf('dialog-item') &&
          -1 === target.className.indexOf('header-back') &&
          -1 !== index) {

          if (-1 === target.className.indexOf('system-notify-close-btn')) {
            event.preventDefault();
          }

          if (false === isEnd) {
            isEnd = true;
            setTimeout(() => {
              self.endPageY = event.changedTouches[0].pageY;
              if (10 >= Math.abs(self.endPageY - self.startPageY)) {
                self.goAuth();
              }
              isEnd = false;
            }, 500);
          }
        }
      }
    },

    /*
     * 是否去实名认证弹窗
     */
    goAuth () {
      let self = this;
      Models.Profile
      .checkUserInfo()
      .then((res) => {

        if (0 === res.code * 1) {
          self.isAuth = true;

          document.addEventListener('touchstart', function (event) {
            self.touchstart(event);
          }, true);

          document.addEventListener('touchend', function (event) {
            self.touchend(event);
          }, true);

          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : '请完善个人基本信息',
            lists : [
              {
                msg: '取消',
                func () {
                  self.isAuth = false;
                }
              },
              {
                msg: '去完善',
                class: 'ok',
                func () {
                  self.$router.push({
                    name: 'user.Profile',
                    query: {
                      type: 0,
                    }
                  });
                }
              },
            ]
          });
        }
        else {
          self.isAuth = false;
        }

      });


      // self.$store.get.dispatch({
      //   type  : 'handleChangeDialog',
      //   active: true,
      //   title : '温馨提示',
      //   msg   : '抱歉！您尚未实名安全认证通过，不能继续操作',
      //   lists : [
      //     {
      //       msg: '关闭',
      //     },
      //     {
      //       msg: '实名认证',
      //       class: 'ok',
      //       func () {
      //         let route = {
      //           name: 'user.Certify'
      //         };
      //         self.$router.push(route);
      //       },
      //     }
      //   ]
      // });
    },

  }
};
