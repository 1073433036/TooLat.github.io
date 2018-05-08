import './index.scss';

import _        from 'lodash';
import Models   from '~common/models';

export default {
  name: 'bankList',
  data () {
    return {
      url: '',
      formTemp: {
        lastData: [],
        bankData: []
      },
      search: '',
    };
  },
  props: [],
  mounted () {
    this.url = _.get(this.$route, 'name');
  },
  computed: {
    isShow () {
      if (true === _.get(this.$store.get.state, 'Banks.content.isShow') && _.isEmpty(_.get(this.formTemp, 'lastData'))) {
        this.bank();
      }
      return _.get(this.$store.get.state, 'Banks.content.isShow') || false;
    },

    select () {
      return _.get(this.$store.get.state, 'Banks.content.data') || {};
    },
  },
  watch: {
    search (val, ovl) {
      if (val !== ovl) {
        this.formTemp.bankData = _.filter(this.formTemp.lastData, (item) => {
          if (-1 < item.bank_name.indexOf(val)) {
            return item;
          }
        });
      }
    }
  },
  components: {

  },
  methods: {


    // 银行列表
    bank () {
      Models.Pay
      .emptyBankList({
        params: {
          type: 'cash'
        }
      })
      .then((res) => {

        if (1 === res.code) {
          this.formTemp.bankData = res.data;
          this.formTemp.lastData = this.formTemp.bankData;
        }
      });
    },

    handleClose () {
      this.$store.get.dispatch({
        type  : 'bankData',
        isShow: false,
      });
    },

    handleClick (text) {
      this.$store.get.dispatch({
        type : 'bankData',
        data : text,
        isShow: false,
      });
    },
  }
};