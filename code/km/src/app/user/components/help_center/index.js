import './index.scss';

import Header           from '~common/components/header';
import Models           from '~common/models';
import _                from 'lodash';

export default {
  name: 'HelpCenter',
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

      formText      : 2 === this.$route.query.id * 1 ? '汽车保险' : '金融业务',
      searchString  : '',
      timer: undefined,
    };
  },
  components: {
		'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.list();
  },
  watch: {
    searchString () {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
      this.timer = setTimeout(this.list, 500);
    }
  },
  methods: {

    /*
     * 切换导航
     */
    switchNav (index) {
      if (index !== this.formText) {
        this.formText = index;
        this.list();
      }
    },

    /*
     * 帮助内容列表
     */
    list () {
      let self = this;
      let params = {
        page: self.page,
        cat : self.formText,
      };
      if (this.searchString) {
        params.title = this.searchString;
      }
      Models.User.help({ params })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (1 === self.page) {
            self.formTemp.list = [];
          }
          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
          _.each(data.data, (item) => {
            self.formTemp.list.push({
              id: item.id,
              post_content: item.post_content,
              post_title: item.post_title,
              status: false,
            });
          });
        }
      });
    },

    /*
     * 切换阅读
     */
    switchItem (index) {
      let self = this;
      self.formTemp.list[index].status = !self.formTemp.list[index].status;
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        self.list();
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
        self.list();
        done();
      }, 1500);
    },

  }
};
