import './index.scss';

import _        from 'lodash';
import Models   from '~common/models';

export default {
  name: 'bankList',
  data () {
    return {
      isShowCustomInput: false,

      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
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
          if (-1 < item.name.indexOf(val)) {
            return item;
          }
        });
      }
    }
  },
  components: {

  },
  methods: {
    //选择手动输入银行
    customInput () {
      this.$store.get.dispatch({
        type  : 'bankData',
        isShow: false,
      });
      this.$emit('customInputEvent');
    },

    // 银行列表
    bank () {
      let self = this;

      Models.Bank
      .list({
        params: {
          page: self.page,
          type: 'user'
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.formTemp.bankData = _.concat(self.formTemp.bankData, data.data);
          }
          else {
            self.formTemp.bankData = data.data;
          }

          self.formTemp.lastData = this.formTemp.bankData;

          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;

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

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.bank();
        done();
      }, 1500);
    },

    infinite (done) {
      let self = this;

      if (self.last_page <= self.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        self.page ++;
        self.bank();
        done();
      }, 1500);
    },

  }
};