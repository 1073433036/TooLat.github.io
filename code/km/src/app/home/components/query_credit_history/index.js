import './index.scss';

import _                    from 'lodash';
import Header               from '~common/components/header';
import Models               from '~common/models';

export default {
  name: 'history',
  data () {
    return {
      isShow: true,
      queryList: [],
      /*
       * 分页
       */
      page          : 1,
      total         : 0,
      per_page      : 0,
      current_page  : 0,
      last_page     : 0,
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
  },
  mounted () {
    this.list();
  },
  watch: {},
  methods: {

    list () {
      Models.User
      .creditList()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (1 < this.page) {
            this.queryList = _.concat(this.queryList, data.data);
          }
          else {
            this.queryList = data.data;
          }
        }
      });
    },

    queryDetail (item) {
      this.$router.push({
        name: 'home.QueryCreditDetail',
        query: {
          id: item.id,
        },
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

  },
  filters: {

    handleDate (value) {
      return new Date(value * 1000).format('yyyy-MM-dd hh:mm:ss');
    },

    handleIdentity (value) {
      return value.replace(value.substr(6, 8), '*'.repeat(6));
    },

  },
};