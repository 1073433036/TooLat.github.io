import './index.scss';

import _        from 'lodash';
import Header   from '../header';
import Models   from '~common/models';

export default {
  name: 'messageFriendDetail',
  data () {
    return {
      formTemp: {
      }
    };
  },
  computed: {
  },
  mounted () {
    this.info();
  },
  components: {
    'app-header': Header,
  },
  watch: {
  },
  methods: {

    // 获取好友信息
    info () {
      Models.Friend
      .info({
        params: {
          user_id: _.get(this.$route, 'params.id'),
        }
      })
      .then((res) => {
        if (1 === res.code) {
          this.formTemp = res.data;
        }
      });
    },

    // 添加好友请求
    addFriend () {
      if (!_.isNumber(this.formTemp.user_id * 1)) {
        this.$toast('缺少用户ID');
        return;
      }

      Models.Friend
      .apply({
        user_id: this.formTemp.user_id,
        message: `${this.$user.get().user_nickname}申请添加您为好友`,
      })
      .then((res) => {
        if (1 === res.code) {
          this.$toast('已发送添加请求');
        }
        else {
          this.$toast(res.msg || '添加好友失败');
        }
      });
    },

  }
};