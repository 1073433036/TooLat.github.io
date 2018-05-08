import './index.scss';

import _        from 'lodash';
import Header   from '~common/components/header';
import Models   from '~common/models';

export default {
  name: 'article-list',
  data () {
    return {
      state: {},
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      bottom: 20,
      formTemp: {
        data: []
      },

    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    // title () {
    //   this.$store.
    // },
  },
  mounted () {
    this.getList();
  },
  watch: {
  },
  methods: {
    /*
     * 获取文章列表
     */
    getList () {
      let self = this;
      Models.Portal
      .list({
        params: {
          category_id: self.$route.params.id,
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

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getList();
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
        self.getList();
        done();
      }, 1500);
    },
  },
};