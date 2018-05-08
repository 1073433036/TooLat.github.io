import './index.scss';

import _              from 'lodash';
import Models         from '~common/models';
import LocalStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'simulateBank',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      formTemp: {
        data: [],
      },

      current: {},
    };
  },
  components: {
  },
  computed: {
  },
  mounted () {
    let data  = LocalStorage.get('testBankList');
    this.formTemp.data = _.get(data, 'data.bank_list') || [];
    // this.list();
  },
  watch: {
  },
  methods: {

    list () {
      let self = this;
      Models.Bank
      .list({
        params: {
          page: self.page,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (1 < self.page) {
            self.formTemp.data = _.concat(self.formTemp.data, data.data);
          }
          else {
            self.formTemp.data = data.data;
          }
          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;
        }
      });
    },

    // 选中
    handleClose () {
      this.$emit('bankClick', {
        status : false
      });
    },

    // 选中
    handleSelect (item) {
      this.current = item;
      this.$emit('bankClick', {
        status : false,
        content: item,
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.list();
        done();
      }, 1500);
    },

    infinite (done) {
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.list();
        done();
      }, 1500);
    },
  }
};