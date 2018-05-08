import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';

export default {
  name: 'use-flow',
  data () {
    return {
      formTemp: {
        list: [
          {
            id: 9,
            name: '实习会员奖励说明',
          },
          {
            id: 1,
            name: '信用卡申请步骤',
          },
          {
            id: 2,
            name: '精养卡操作步骤',
          },
          {
            id: 3,
            name: '违章查询操作步骤',
          },
          {
            id: 4,
            name: '贷款申请操作步骤',
          },
          {
            id: 5,
            name: '无卡支付操作步骤',
          },
          {
            id: 6,
            name: '招商代理操作说明',
          },
          {
            id: 7,
            name: '注册账号操作步骤',
          },
          {
            id: 8,
            name: '锁粉操作步骤',
          },
          {
            id: 9,
            name: '精养代还操作步骤',
          },
        ],
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      let data = _.get(this.$store.get.state, 'App.userInfo') || this.$user.get();
      return data;
    }
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    refresh (done) {
      setTimeout(() => {
        done(true);
      }, 1500);
    },

    infinite (done) {
      setTimeout(() => {
        done(true);
      }, 1500);
    },
  },
};
