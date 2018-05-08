import './index.scss';
import Header           from '~common/components/header';
import phoneCode        from '~common/components/phone_code';
export default {
  data () {
    return {
      name: 'IntelligentAddCreditCards',
      userInfo: {
        cvn2: '',
        validity: '',
        phone: '',
        code: '',
      },
    };
  },
  components: {
     'app-header': Header,
     phoneCode
  },
  computed: {
    active () {
      let bool = true;
      for (let i in this.userInfo) {
        if (!this.userInfo[i]) {
          bool = false;
          break;
        }
      }
      return bool;
    }
  },
  mounted () {
  },
  watch: {
  },
  methods: {

    //确认开通
    async next () {
      /* eslint-disable */
      // const identity = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      // if (!identity.test(this.userInfo.identity)) {
       // this.$toast('身份在格式错误');
         // return;
       // }
       // else {
        this.$router.push({
          name: 'home.intelligentSetCreditCardPayment',
        });
      // }
      /* eslint-enable */
    }
  }
};
