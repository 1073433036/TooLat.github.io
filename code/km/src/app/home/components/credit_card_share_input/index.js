import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import phoneCode  from '~common/components/phone_code';

export default {
  name: 'creditcard-share-input',
  data () {
    return {
      state: {
        active      : false,
      },
      formData: {
        phone       : '',
        code        : '',
        password    : '',
      },
    };
  },
  components: {
    'app-header'  : Header,
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
      },
    },
  },
  methods: {
    /*
     * 监测2次的密码是否一致
     */
    handlePassChange () {
      if (!_.isEmpty(this.formData.phone) && !_.isEmpty(this.formData.code) && !_.isEmpty(this.formData.password)) {
        this.state.active = true;
      }
      else {
        this.state.active = false;
      }
    },
    /*
     * 下一步
     */
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }
    },
  },
};