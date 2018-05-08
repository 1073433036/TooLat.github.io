import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import phoneCode      from '~common/components/phone_code';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'preMoney',
  data () {
    return {
      loading : false,
      active  : false,
      btnTxt  : '立即查询',
      formData: {
        identity: '',
        phone: '',
        money: '',
        code: '',
      },

      data: {
        name: ''
      },
    };
  },
  components: {
    'app-header': Header,
    phoneCode
  },
  computed: {
  },
  mounted () {
    this.show();
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.handlePassChange();
      }
    },

  },
  methods: {
    // 获取银行
    show () {
      let id = _.get(this.$route, 'params.id');
      Models.Bank
      .show({
        params: {
          id: id
        }
      })
      .then((res) => {
        if (1 === res.code) {
          this.data = res.data;
        }
      });
    },

    handlePassChange () {
      this.active = true;
      for (let i in this.formData) {
        if ('money' !== i && 0 >= this.formData[i].length) {
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

      if (true === this.loading) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '前往立即办卡页面',
          lists : [
            {
              msg: '关闭',
            },
            {
              msg: '确认',
              func () {
                self.$router.push({
                  name: 'home.CreditCard'
                });
              },
              class: 'ok',
            },
          ]
        });
        return;
      }


      Models.SmsCode
      .check({
        phone: this.formData.phone,
        code : this.formData.code
      })
      .then((res) => {
        if (1 !== res.code) {
          this.$toast('验证码错误');
        }
        else {
          this.loading = true;
          this.btnTxt  = '立即办卡';
          let data = LocalStorage.get('preMoney');

          let LocalData = _.filter(data.data, {id: _.get(self.$route, 'params.id') * 1});
          if (0 < LocalData.length) {
            self.formData.money = LocalData[LocalData.length - 1].money;
            return;
          }

          let money   = Math.floor(Math.random() * 40 + 1 ) * 500;

          let setData = {
            id    : _.get(self.$route, 'params.id') ? _.get(self.$route, 'params.id') * 1 : '',
            money : money,
          };

          if (_.isEmpty(data, 'data')) {
            self.formData.money = money;

            let moneyData = [setData];
            LocalStorage.set('preMoney', moneyData);
          }
          else {
            let moneyData = _.concat(data.data, [setData]);
            LocalStorage.set('preMoney', moneyData);
          }
        }
      });

    }
  }
};