import './index.scss';

import Header                   from '~common/components/header';
import PaymentProgressDetail    from './components/payment_progress_detail';
import Models                   from '~common/models';


export default {
  name: 'PaymentProgress',
  data () {
    return {
      bankList: []
    };
  },
  components: {
    'app-header': Header,
    PaymentProgressDetail
  },
  computed: {
  },
  mounted () {
  },
  beforeRouteEnter (to, from, next) {
    let data = {
      page: 1
    };
    Models.Cultivate.paymentProgressList(data).then(res => {
      if (1 === res.code) {
        next(function (vm) {
          if (0 === res.data.total) {
            vm.$toast('没有还款计划');
            return;
          }
          vm.bankList = res.data.data;
        });
      }
    });
    // next();
  },
  watch: {},
  methods: {
    goHomePage () {
      this.$router.push({name: 'home.NoopsycheCultivateCard'});
    },
    handleCardNo (value) {
      let arr = [...value];
      let preArr = arr.slice(0, 4);
      let afterArr = arr.slice(-4);
      let midArr = arr.slice(4, arr.length - 4);
      midArr = midArr.map(function () {
        return '*';
      });
      let result = preArr.concat(midArr, afterArr);
      return result.join('');
    },

    bundleSendItem (item) {
      this.$store.get.commit('saveOrderMainSn', item);
      this.$store.get.commit('savePaymentProgressInfo', item);
      this.$router.push({name: 'home.PaymentProgressDetail'});
    },

    // 终止还款计划
    handleDelete (item) {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '确定要终止该精养计划？',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '确认',
            class: 'ok',
            func () {
              Models.Cultivate
              .delete({
                main_sn: item.main_sn,
              })
              .then((res) => {
                self.$toast(res.msg);
                if (1 === res.code) {
                  window.location.reload();
                }
              });
            }
          },
        ]
      });

    }
  }
};