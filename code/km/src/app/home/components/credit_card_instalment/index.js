import './index.scss';

import Header     from '~common/components/header';
import _          from 'lodash';
import Models     from '~common/models';

export default {
  name: 'CreditcardInstalment',
  data () {
    return {
      state: {
      },
      formTemp: {
        bankData: []
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    bankId () {
      return this.$route.params.id;
    },
  },
  mounted () {
    this.bank();
  },
  watch: {
  },
  methods: {
    /**
     * 银行列表
     */
    bank () {
      Models.Bank
      .list()
      .then((res) => {
        if (1 === res.code) {
          for (let n in res.data.data) {
            if (this.bankId * 1 === res.data.data[n].id * 1) {
              this.formTemp.bankData = res.data.data[n];
            }
          }
        }
      });
    },
  },
};