import './index.scss';

import _        from 'lodash';
import Header      from '~common/components/header';
import Models      from '~common/models';

export default {
  name: 'buySuccess',
  data () {
    return {
      isOther: true,
      formTemp: {},
      isShow: false,
      active: false,
      isShare: false,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
    this.info();
  },
  watch: {
  },
  methods: {
    info () {
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
      });
      Models.Order
      .info({
        params: {
          order_id: _.get(this.$route, 'query.order_id') * 1
        }
      })
      .then((res) => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if (1 === res.code) {
          this.formTemp = res.data;
          this.active   = true;

          this.$store.get.dispatch({
            type: 'histData',
            data: {
              agentOrder: {
                order_id: this.formTemp.df_order_id,
                pay_type: this.formTemp.pay_type,
                goods_id: this.formTemp.goods_id,
              }
            },
          });

        }
      });
    },

    // 直接返回首页
    goHomePage () {
      this.$router.push('/');
    },

    // 跳转App下载
    goToDown () {
			this.$route.push({ name: 'home.AppDownLoad' });
      // let device = this.device.os().toLowerCase();
      // if ('ios' === device) {
      //   window.location.href = 'https://www.pgyer.com/J3fL';
      // }
      // else {
      //   window.location.href = 'https://dafuvip.com/vq222i';
      // }
    }
  },
};