import './index.scss';

import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'userIssue',
  data () {
    return {
      page: 1,
      list: [],
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getList();
  },
  watch: {
  },
  methods: {

    /*
     * 获取我的发布
     */
    getList () {
      let self = this;

      Models.Task
      .myList({
        page: self.page,
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.list = data.data;
        }
      });
    },
  }
};