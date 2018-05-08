import './index.scss';

import _      from 'lodash';
import Header from '~common/components/header';
import Models from '~common/models';

export default {
  name: 'zxDetail',
  data () {
    return {
      formTemp: {
        credit: {
          creditCard: {},
          otherLoans: {},
          purchaseLoan: {},
        },
        creditCardInfo: [],
        purchaseLoanInfo: [],
        otherLoanInfo: [],
        guaranteeInfo: [],
        loginName: '',
        personalQueryRecord: [],
        providerQueryRecord: [],
        publishRecord: [],
        reportInfo: {},
        userInfo: {},
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getCredit();
  },
  watch: {
  },
  methods: {
    getCredit () {
      Models.User
      .zxLists()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (0 < data.length) {
            this.formTemp   = _.assign({}, this.result, data[0].result);
          }
        }
      });
    }
  }
};