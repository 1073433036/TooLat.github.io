import './index.scss';

import Header   from '~common/components/header';
import Models   from '~common/models';

export default {
  name: 'make_over',
  data () {
    return {
      loading: false,
      formTemp: {
        info: '',
      },
      formData: {
        integral: '',
        to_user_id: '',
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getIntegral();
  },
  methods: {

    /*
     * 获取积分
     */
    getIntegral () {
      let self = this;
      Models.User
      .signInInfo()
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.info = res.data;
        }
      });
    },

    /*
     * 转让
     */
    submit () {
      let self = this;

      if (!self.formData.integral) {
        self.$toast('请输入转让积分数');
        return;
      }

      if (!self.formData.to_user_id) {
        self.$toast('请输入你的受让人');
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
      .trade(self.formData)
      .then((res) => {
        if (1 === res.code) {
          self.getIntegral();
          self.formData.integral = '';
          self.formData.to_user_id = '';
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
          self.loading = false;
        }
        else {
          self.$toast(res.msg);
          self.loading = false;
        }
      })
      .catch(() => {
        self.loading = false;
      });
    },

  },
  watch: {
  },
};