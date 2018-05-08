import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Socket         from '~common/components/socket';
import Models         from '~common/models';
import ServiceCuetomerPopup from '~common/components/service_customer_popup';

export default {
  name: 'NoopsycheCultivateCardPage',
  data () {
    return {
      isOther: true,
      show: false
    };
  },
  components: {
    'app-header': Header,
    Socket,
    'service-cuetomer-popup': ServiceCuetomerPopup,
  },
  computed: {
    userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo');
    },
    message () {
      return _.get(this.$store.get.state, 'Message.content.msg');
    },
  },
  mounted () {
    let self = this;
    self.getNotice();

    // self.$nextTick(() => {
    //   setTimeout(() => {
    //     self.show = true;
    //   }, 500);
    // });
  },
  watch: {

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

    // 检查消息
    getNotice () {
      let self = this;

      Models.User
      .getNotice()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : '有好友提醒您注意查看信用卡申请进度信息哦，是否立即前往查询？',
            lists : [
              {
                msg: '取消',
              },
              {
                msg: '立即查询',
                class: 'ok',
                func () {
                  self.$router.push({
                    name: 'home.CreditCardProgressQuery',
                    params: {
                      id: data.bank_id
                    }
                  });
                },
              }
            ]
          });
        }
      });

    },

    /*
     * socket获取消息
     */
    onsend (key) {
      this.$refs.socket.onsend(key);
    },

    goHomePage () {
      this.$router.push('/');
    },

    isVipCard () {
      // 未完善个人信息
			// if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }

      // let self = this;
      // if (1 === this.userInfo.level) {
      //   self.$store.get.dispatch({
      //     type  : 'handleChangeDialog',
      //     active: true,
      //     title : '温馨提示',
      //     msg   : '目前此功能只针对高级会员及以上身份开放，是否立即升级会员？',
      //     lists : [
      //       {
      //         msg: '关闭',
      //       },
      //       {
      //         msg: '立即升级',
      //         class: 'ok',
      //         func () {
      //           let route = {
      //             name: 'user.BuyVip'
      //           };
      //           self.$router.push(route);
      //         },
      //       }
      //     ]
      //   });
      // }
      // else {
        if (this.message.index_loancard_card) {
          this.onsend('index_loancard_card');
        }
        let route = {
          name: 'user.Card'
        };
        this.$router.push(route);
      // }
    },

    isVipLoan () {
      // let self = this;
      // if (1 === this.userInfo.level) {
      //   self.$store.get.dispatch({
      //     type  : 'handleChangeDialog',
      //     active: true,
      //     title : '温馨提示',
      //     msg   : '目前此功能只针对高级会员及以上身份开放，是否立即升级会员？',
      //     lists : [
      //       {
      //         msg: '关闭',
      //       },
      //       {
      //         msg: '立即升级',
      //         class: 'ok',
      //         func () {
      //           let route = {
      //             name: 'user.BuyVip'
      //           };
      //           self.$router.push(route);
      //         },
      //       }
      //     ]
      //   });
      // }
      // else {
        if (this.message.index_loancard_loan) {
          this.onsend('index_loancard_loan');
        }
        let route = {
          name: 'user.Loan'
        };
        this.$router.push(route);
      // }
    },

    //  审核资料
    isCheckData () {
      this.$toast('敬请期待');
      // this.$router.push({
      //   name: 'home.noopsycheCheckData',
      // });
    },

  },


};
