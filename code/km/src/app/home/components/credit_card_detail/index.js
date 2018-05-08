import './index.scss';

import _      from 'lodash';
import Header from '~common/components/header';
import Models from '~common/models';

export default {
  name: 'creditcard-detail',
  data () {
    return {
      state: {
        seeFlag: false,
        isApply: false,
      },
      id: '',
      formTemp: {
        data: {
          bank: {}
        },
      }
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      let data = this.$user.get() || _.get(this.$store.get.state, 'App.userInfo') || {};
      return data;
    },
  },
  mounted () {
    this.id = this.$route.params.id ? this.$route.params.id * 1 : '';
    this.show();

  },
  watch: {
  },
  methods: {
    show () {
      let self = this;
      Models.Credit
      .show({
        params: {
          id: self.id,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          // console.log(res.data);
          if (_.isEmpty(data)) {
            self.$store.get.dispatch({
              type  : 'handleChangeDialog',
              active: true,
              title : '错误提示',
              msg   : '内容不存在',
              lists : [
                {
                  msg: '关闭',
                  func () {
                    self.$router.push({
                      name: 'home.Home',
                    });
                  }
                },
              ]
            });
            return;
          }
          this.formTemp.data = data;
        }
      });
    }
  },
};