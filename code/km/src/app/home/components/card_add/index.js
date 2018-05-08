import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import phoneCode  from '~common/components/phone_code';

export default {
  name: 'card',
  data () {
    return {
      formData: {
        username: '',
        identity: '',
        card: '',
        phone: '',
        phoneCode: '',
      },
      active: false,
      sendSms: false,
      animated: false,
      payPass: false,
    };
  },
  components: {
    'app-header': Header,
    phoneCode
  },
  computed: {
  },
  mounted () {
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.handlePassChange();
      }
    }
  },
  methods: {
    // 监测表单值
    handlePassChange () {
      this.active = true;
      for (let i in this.formData) {
        if (0 >= this.formData[i].length) {
          this.active = false;
          break;
        }
      }
    },

    // 下一步
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        // self.$store.get.dispatch({
        //   type  : 'handleChangeDialog',
        //   active: true,
        //   title : '温馨提示',
        //   msg   : res.data.msg,
        //   lists : [
        //     {
        //       msg: '关闭',
        //     },

        //   ]
        // });
        return;
      }

      self.animated = true;
      self.sendSms  = true;
    },

    // 关闭弹出
    handleClose () {
      this.animated = false;
      setTimeout(() => {
        this.sendSms = false;
      }, 500);
    },

    // 跳转到设置交易密码
    handleTradePass () {
      if (_.isEmpty(this.formData.phoneCode)) {
        this.$toast('请输入验证码');
        return;
      }

      let route = {};
      let routeQuery = _.get(this.$route, 'query');
      if (!_.isEmpty(routeQuery)) {
        for (let [key, val] of Object.entries(routeQuery)) {
          if ('dt' === key) {
            route.name = val;
            if (false === this.payPass) {
              route = {
                name: 'home.TradePass',
                query: {
                  dt: val
                }
              };
            }
          }
          else {
            route.query = {
              [key]: val
            };
          }
        }
      }

      this.$router.push(route);
    }
  }
};