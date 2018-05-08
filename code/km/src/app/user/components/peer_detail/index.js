import './index.scss';

import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'userPeerDetail',
  data () {
    return {
      formTemp: {
        list: '',
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getDetail();
  },
  watch: {
  },
  methods: {
    /*
     * 获取订单信贷经理详情
     */
    getDetail () {
      let self = this;

      Models.Task
      .myManagerDetail({
        params: {
          id: self.$route.params.id,
        },
      })
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.list = res.data;
        }
      });
    },
  }
};