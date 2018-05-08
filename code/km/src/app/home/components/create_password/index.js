import './index.scss';

import _      from 'lodash';
import Header from '~common/components/header';

export default {
  name: 'createPass',
  data () {
    return {
      formData: {
        password1: '',
        password2: '',
        code     : '',
      },
      active: false,
    };
  },
  components: {
    'app-header': Header,
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
      if (!_.isEmpty(this.formData.password1) && this.formData.password1 === this.formData.password2) {
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

      let route = {
        name: 'home.Home'
      };

      let routeQuery = _.get(this.$route, 'query');

      if (!_.isEmpty(routeQuery)) {
        for (let [key, val] of Object.entries(routeQuery)) {
          if ('dt' === key) {
            route.name = val;
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