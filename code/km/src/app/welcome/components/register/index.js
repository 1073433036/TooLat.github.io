import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import phoneCode          from '~common/components/phone_code';
import Checkbox           from '~common/components/checkbox';
import ServiceAgreement   from '~common/components/service_agreement';
import Models             from '~common/models';

export default {
  name: 'register',
  data () {
    return {
      single: true,
      active: false,
      loading: false,
      isShow: false,
      formData: {
        username        : '',
        code            : '',
        password        : '',
        password2       : '',
        wechat_account  : '',
        invite_code     : '',
      },
    };
  },
  components: {
    'app-header': Header,
    phoneCode,
    Checkbox,
    ServiceAgreement,
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
    },

    single () {
      this.handlePassChange();
    }
  },
  methods: {
    handlePassChange () {
      this.active = true;
      for (let i in this.formData) {
        if (0 >= this.formData[i].length) {
          this.active = false;
          break;
        }
      }
      if (false === this.single) {
        this.active = false;
      }
    },

    // 下一步
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      if (self.formData.password !== self.formData.password2) {
        self.$toast('两次输入的密码不一致');
        return;
      }

      if (false === self.single) {
        self.$toast('请先阅读并同意《卡盟金服服务协议》');
        return;
      }

      /**
        * 表单提交
        **/
      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      self.loading = true;

      Models.User
      .register(self.formData)
      .then((res) => {
        if (1 === res.code) {
          self.$toast(res.msg || '注册成功');
          setTimeout(() => {
            let route = { name: 'welcome.Login' };
            let routeQuery = _.get(self.$route, 'query.dt');
            try {
              route = JSON.parse(routeQuery);
            }
            catch (err) {
              route = {
                name: 'welcome.Login'
              };
            }
            self.$router.push(route);
          }, 2000);
        }
        else {
          self.loading = false;
          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : res.msg,
            lists : [
              {
                msg: '关闭',
              },
            ]
          });
        }
      })
      .catch(() => {
        self.loading = false;
      });
    },

    /*
     * 查看协议
     */
    see () {
      this.isShow = true;
    },

  }
};