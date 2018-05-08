import './index.scss';

import axios            from 'axios';
import Header           from '~common/components/header';
import Models           from '~common/models';

export default {
  name: 'IntegralDetail',
  data () {
    return {
      isShowPage: false,
      integralTotal: '',
      integralList: [],
      integral_freeze: 0,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  created () {
    axios.all([Models.Account.integralList(), Models.Account.userIntegralInfo()]).then(axios.spread( (res1, res2) => {
      if (1 === res1.code && 1 === res2.code) {
        this.integralList     = res1.data.data;
        this.integralTotal    = res2.data.integral;
        this.integral_freeze  = res2.data.integral_freeze;
        this.isShowPage = true;
        this.$store.get.commit('saveIntegralWithdrawInfo', {
          integralWithdrawInfo: res2.data
        });
      }
      else {
        this.$toast('网络出错');
      }
    }) );
  },
  mounted () {
    this.rmInsuranceNotice();
  },
  watch: {
  },
  methods: {
    goIntegralWithdrawDepositPage () {
      this.$router.push({name: 'user.Integralwithdraw'});
    },
    handleJsonTime (value) {
      let timeArr = value.split(' ');
      return timeArr || [];
    },

    // 清除车险佣金提示
    rmInsuranceNotice () {
      Models.Profile
      .rmInsuranceNotice()
      .then(res => res);
    },

    refresh (done) {
      setTimeout(() => {
        done();
      }, 1000);
    },
    infinite (done) {
      setTimeout(() => {
        done(true);
      }, 1000);
    }
  },
};