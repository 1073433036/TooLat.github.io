import './index.scss';

import _            from 'lodash';
// import phoneCode    from '~common/components/phone_code';

import localStorage from '~common/services/localStorage.cookie';
import Models       from '~common/models';


export default {
  name: 'login',
  data () {
    return {
      loading: false,
      active: false,
      formData: {
        username: '',
				password: '',
				// code:     '',
      },
    };
  },
  components: {
    // phoneCode
  },
  computed: {
  },
  mounted () {
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.handleIsempty();
      },
    },
  },
  methods: {
    /*
     * 监控表单是否为空
     */
    handleIsempty () {
      if (!_.isEmpty(this.formData.username) && !_.isEmpty(this.formData.password)) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    },


    /*
     * 提交表单
     */
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      self.loading = true;
      let data = _.assign({}, self.formData, { device_type: 'web' });

      Models.User
      .login(data)
      .then((res) => {
        if (1 === res.code) {
          self.$toast(res.msg || '登录成功');

          localStorage.set('KMToken', {
            token : _.get(res.data, 'token'),
            weChat: 0,
          });
          localStorage.set('KMDeviceType', 'web');
          self.$store.get.dispatch({
            type: 'histData',
            data: _.get(res.data, 'token')
          });

          setTimeout(() => {
            let route = { name: 'home.Home' };
            let routeQuery = _.get(self.$route, 'query.dt');
            try {
              route = JSON.parse(routeQuery);
            }
            catch (err) {
              route = {
                name: 'home.Home'
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
            msg   : res.msg || '登录失败',
            lists : [
              {
                msg: '关闭',
              },
            ]
          });
        }
      });

    },

    // 跳转至注册界面
    linkToRegister () {
      let dt = this.$route.query.dt;
      this.$router.push({ name: 'home.finishInvite', query: { dt } });
    }
  },
};
