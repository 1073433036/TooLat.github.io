import './index.scss';

import Header from '~common/components/header';

export default {
  name: 'userLoan',
  data () {
    return {
      page: 1,
      isMask: false,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    // 点击查询
    handleQuery () {
      this.isMask = true;
    },

    // 上拉刷新
    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        // this.list();
        done();
      }, 1500);
    },

    infinite (done) {
      let self = this;
      if (1 <= self.page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        self.page ++;
        // this.list();
        done();
      }, 1500);
    },
  },
};