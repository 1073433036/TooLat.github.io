import './index.scss';

import Models   from '~common/models';
import Header   from '~common/components/header';

export default {
  name: 'MyPrize',
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
    this.luckyMylog();
  },
  methods: {

    /*
     * 我的抽奖记录
     */
    luckyMylog () {
      let self = this;
      Models.User
      .luckyMylog({
        params: {
          page: self.page,
          id: self.$route.params.id,
          is_lucky: 1,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          // self.formTemp.list = data.data;
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
        this.luckyMylog();
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
        this.luckyMylog();
        done();
      }, 1500);
    },

  },
  watch: {
  },

};