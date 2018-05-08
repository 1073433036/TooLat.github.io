import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import phoneCode  from '~common/components/phone_code';
import Models     from '~common/models';

export default {
  name: 'findpwd',
  data () {
    return {
      state: {
        agree: true,
      },
      formData: {
        mobile            : '',
        verification_code : '',
        password          : '',
        password_confirm  : '',
      },
      active : false,
      loading: false,
    };
  },
  components: {
    'app-header'    : Header,
    phoneCode,
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
    // 监测2次的密码是否一致
    handlePassChange () {
      if (!_.isEmpty(this.formData.mobile) && !_.isEmpty(this.formData.verification_code) && !_.isEmpty(this.formData.password) && !_.isEmpty(this.formData.password_confirm) && this.formData.password === this.formData.password_confirm) {
        this.active = true;
      }
      else {
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

      /**
        * 表单提交
        **/
      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      self.loading = true;

      Models.User
      .findpwd(self.formData)
      .then((res) => {
        if (1 === res.code) {
          self.$toast(res.msg || '修改成功');
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
          self.$toast(res.msg);
        }
      })
      .catch(() => {
        self.loading = false;
      });

    }
  }
};