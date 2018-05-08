import './index.scss';

import Header   from '~common/components/header';
import Models   from '~common/models';

export default {
  name: 'make_over_record',
  data () {
    return {
      formTemp: {
        list: [],
      },
      /*
       * 分页
       */
      page          : 1,
      total         : 1,
      per_page      : 1,
      current_page  : 1,
      last_page     : 1,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getIntegralLog();
  },
  methods: {

    /*
     * 获取积分转让记录
     */
    getIntegralLog () {
      let self = this;
      Models.User
      .integralLog({
        params: {
          type: 5,
          page: self.page,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          data.data.forEach((item) => {
            self.formTemp.list.push(item);
          });
          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
        }
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        self.formTemp.list = [];
        this.getIntegralLog();
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
        this.getIntegralLog();
        done();
      }, 1500);
    },

  },
  watch: {
  },
  filters: {
    toDate (value) {
      return new Date(parseInt(value) * 1000).toLocaleString().split(' ')[0].split('/').join('-');
    },
    toTime (value) {
      return new Date(parseInt(value) * 1000).toLocaleString().split(' ')[1];
    },
  },
};