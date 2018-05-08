import './index.scss';

// import Models  from '~common/models';
import _              from 'lodash';
import Footing        from '~common/components/page_footing';
import Policy         from './components/policy';
import Payment        from './components/payment';

export default {
  name: 'preventtheft',
  data () {
    return {
      /*
       * @param    policy           是否显示投保须知
       * @param    payment          是否显示支付
       */
      policy          : false,
      payment         : false,
    };
  },
  components: {
    Footing,
    Policy,
    Payment,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
  },
  watch: {
  },
  methods: {
  },
  filters: {
  },
};