import './index.scss';

import _        from 'lodash';
import Models   from '~common/models';

export default {
  name: 'Branch',
  data () {
    return {
      isShowCustomInput: false,

      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      search: '',
      formTemp: {
        lastData: [],
        bankData: [],
      },
    };
  },
  props: [],
  mounted () {
  },
  computed: {
    isShow () {
      if (true === _.get(this.$store.get.state, 'Branch.content.isShow')) {
        this.bankBranch();
      }
      return _.get(this.$store.get.state, 'Branch.content.isShow') || false;
    },

    select () {
      return _.get(this.$store.get.state, 'Branch.content.data') || {};
    },

    bankName () {
      return _.get(this.$store.get.state, 'Branch.content.bankName');
    },

    bankCity () {
      return _.get(this.$store.get.state, 'Branch.content.bankCity');
    },

    bnakProvice () {
      return _.get(this.$store.get.state, 'Branch.content.bnakProvice');
    },

  },
  watch: {
    search (val, ovl) {
      if (val !== ovl) {
        this.formTemp.bankData = _.filter(this.formTemp.lastData, (item) => {
          if (-1 < item.lName.indexOf(val)) {
            return item;
          }
        });
      }
    }
  },
  components: {

  },
  methods: {
    customInput () {
      this.$store.get.dispatch({
        type  : 'branchData',
        isShow: false,
      });
      this.$emit('customBranchInputEvent');
    },


    // 银行支行列表
    bankBranch () {
      let self = this;
      let url = `bank_name/${self.bankName}/bank_city/${self.bankCity}/bnak_provice/${self.bnakProvice}/page/${self.page}`;
      Models.Pay
      .emptyBankBranchList(url)
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.formTemp.bankData = _.concat(self.formTemp.bankData, data.data);
          }
          else {
            self.formTemp.bankData = data.data;
          }

          self.formTemp.lastData = self.formTemp.bankData;
          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;
        }
      });
    },

    handleClose () {
      this.$store.get.dispatch({
        type  : 'branchData',
        isShow: false,
      });
    },

    handleClick (text) {
      this.$store.get.dispatch({
        type : 'branchData',
        data : text,
        isShow: false,
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.bankBranch();
        done();
      }, 1500);
    },

    infinite (done) {
      if (this.last_page * 1 <= this.current_page * 1) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.bankBranch();
        done();
      }, 1500);
    },
  }
};