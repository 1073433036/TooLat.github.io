import './index.scss';

import Header     from '~common/components/header';
import Models     from '~common/models';

export default {
  name: 'messageRewardDetail',
  data () {
    return {
      formTemp: {
        data: '',
      },
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
     * 获取通知详情
     */
    getList () {
      let self = this;
      Models.Notify
      .account({
        params: {
          id: self.$route.params.id,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.data = res.data;
        }
      });
    },
  },
  filters: {
    status (value) {
      let state;
      switch (value) {
        case 1:
          state = '待结算';
          break;
        case 2:
          state = '已结算';
          break;
        case 3:
          state = '失败';
          break;
      }
      return state;
    }
  },
};