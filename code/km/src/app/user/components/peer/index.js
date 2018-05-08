import './index.scss';

import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'userPeer',
  data () {
    return {
      bottom: 20,
      page: 1,
      formTemp: {
        list: [],
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
     * 获取订单信贷经理列表
     */
    getList () {
      let self = this;

      Models.Task
      .myManager({
        params: {
          order_id: self.$route.params.id,
          page: self.page,
        },
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.formTemp.list = data.data;
        }
      });
    },

    refresh (done) {
      setTimeout(() => {
        done();
      }, 1500);
    },
    infinite (done) {
      if ( 30 <= this.bottom) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }
      setTimeout(() => {
        this.bottom = this.bottom + 10;
        done();
      }, 1500);
    }
  }
};