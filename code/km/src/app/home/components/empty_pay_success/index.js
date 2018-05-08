import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'EmptySuccessPay',
  data () {
    return {
      isSuccess: false
    };
  },
  components: {
    'app-header'    : Header
  },
  computed: {
  },
  beforeRouteEnter (to, from, next) {
    let fromRouteName = from.name;
    let thisRouteQuery = to.query;
    next(function (vm) {
      if ('home.EmptyPayOrderpay' === fromRouteName) {
        vm.isSuccess = true;
      }
      else {
        if (!_.isEmpty(thisRouteQuery)) {
          let data = {
            card_id: thisRouteQuery.card_id,
            order_sn: thisRouteQuery.order_sn,
            channel_id: thisRouteQuery.channel_id
          };
          Models.Pay.paySuccess(data).then(res => {
            if (1 === res.code) {
              vm.isSuccess = true;
            }
            else {
              vm.$toast(res.msg);
            }
          });
        }
        else {
          vm.$toast('页面出错啦！请返回首页');
        }
      }
    });

  },
  mounted () {
  },
  watch: {},
  methods: {
    goBackHomePage () {
      this.$router.push('/');
    }
  }
};