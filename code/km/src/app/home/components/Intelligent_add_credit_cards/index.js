import './index.scss';
import Header           from '~common/components/header';
export default {
  data () {
    return {
      name: 'IntelligentAddCreditCards',
      userInfo: {
        name: '',
        id_number : '',
        card_code : '',
      },
    };
  },
  components: {
     'app-header': Header,
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
    async next () {
      /* eslint-disable */
      const identity =/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      const credit =/^([1-9]{1})(\d{15}|\d{18})$/;

      if (!identity.test(this.userInfo.id_number)) {
         this.$toast('身份证格式错误');
         return;
       }
       else if (!credit.test(this.userInfo.card_code)) {
         this.$toast('信用卡格式错误');
         return;
       }
       else {
        this.$router.push({
          name: 'home.IntelligentAddCreditCardsV2',
          params:this.userInfo
        });
       }
       /* eslint-enable */
    }
  }
};
