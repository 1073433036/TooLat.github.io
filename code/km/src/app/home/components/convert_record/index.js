import './index.scss';

import Header   from '~common/components/header';
import Models   from '~common/models';

export default {
  name: 'ConvertRecord',
  data () {
    return {
      formTemp: {
        log: [],
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
    this.signInList();
  },
  methods: {

    /*
     * 兑换历史
     */
    signInList () {
      let self = this;
      Models.User
      .integralLog({
        params: {
          page: self.page,
          type: 6,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (1 === self.page) {
            self.formTemp.log = [];
          }
          data.data.forEach((item) => {
            self.formTemp.log.push(item);
          });
          // self.formTemp.log  = data.data;
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
        this.signInList();
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
        this.signInList();
        done();
      }, 1500);
    },

  },
  watch: {
  },
};