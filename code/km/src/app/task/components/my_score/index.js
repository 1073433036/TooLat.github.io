import './index.scss';

import _      from 'lodash';
import Header from '~common/components/header';
import Models from '~common/models';

export default {
  name: 'taskMyScore',
  data () {
    return {
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      formTemp: {
        list: [],
      },
      loading: false,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  created () {
    this.handleMySendRating();
  },
  mounted () {
  },
  watch: {

  },
  filters: {
    checkTime (value) {
      let time  = parseInt(new Date().getTime() / 1000);

      let val   = parseInt((time - value) / 60);
      let data  = '秒';

      if (60 <= val) {
        data = `${Math.ceil(60 / val)} 小时`;
      }
      else if (1 <= val) {
        data = `${val} 分钟`;
      }
      return data;
    }
  },
  methods: {

    // 对别人的评价
    handleMySendRating () {
      let self = this;

      Models.User
      .mySendRating({
        params: {
          page: self.page,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.formTemp.list = _.concat(self.formTemp.list, data.data);
          }
          else {
            self.formTemp.list = data.data;
          }

          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
        }
      });
    },

    // 撤销评价
    handleCancel (item) {

      if (true === this.loading) {
        this.$toast('正在取消...');
        return;
      }

      this.loading = true;

      Models.User
      .cancelRating({
        id: item.id
      })
      .then((res) => {
        this.$toast(res.msg);
        if (1 !== res.code) {
          this.loading = false;
        }
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.handleMySendRating();
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
        this.handleMySendRating();
        done();
      }, 1500);
    },

  }
};