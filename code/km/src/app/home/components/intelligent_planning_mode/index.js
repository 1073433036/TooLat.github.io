import './index.scss';

// import _            from 'lodash';
import Header from '~common/components/header';
// import Models       from '~common/models';


export default {
  name: 'order-pay',
  data () {
    return {

    };
  },
  components: {
    'app-header': Header,
  },
  computed: {},
  mounted () {

  },
  watch: {},
  methods: {
    //大师推荐
    masterRecommend () {
      this.$toast('即将开放');
      // this.$router.push({
      //   name: 'home.intelligentPaymentReservation',
      // });
    },
    //新手上路
    addCustom () {
      this.$store.get.commit('setCityInfo', {});
      this.$router.push({
        name: 'home.intelligentSetCreditCardPayment',
      });
    },
  },
};
