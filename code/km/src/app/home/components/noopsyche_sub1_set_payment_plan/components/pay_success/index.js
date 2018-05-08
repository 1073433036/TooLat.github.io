import './index.scss';

import Header          from '~common/components/header';

export default {
  name: 'PaySuccess',
  data () {
    return {
    };
  },
  components: {
    'app-header': Header
  },
  beforeRouteEnter (to, from, next) {
    let routeName = from.name;
    if ('home.SetPaymentPlanConfirmPlan' === routeName) {
      next();
    }
    else {
      next({path: '/'});
    }
  },
  computed: {
  },
  mounted () {
  },
  watch: {},
  methods: {
    goHomePage () {
      this.$router.push({name:'home.NoopsycheCultivateCard'});
    },
    //上传卡的信息到store,并跳转到还款进度详情页
    checkProgerssPage () {
      this.$router.push({ name: 'home.PaymentProgress' });
    }
  }
};