import './index.scss';

import _          from 'lodash';
import WechatCode from '~common/components/wechat_code';

export default {
  name: 'visitor',
  data () {
    return {
      formTemp: {},
      visitors: [],
      isShow: false,
      isWechat: false,
    };
  },
  props: [],
  mounted () {
    window.aa = this;
  },
  computed: {
    // isShow () {
    //   return _.get(this.$store.get.state, 'Visitor.isShow');
    // },
    guest () {
      return _.get(this.$store.get.state, 'Visitor.visitor');
    },
  },
  watch: {
    guest (val) {
      if (!_.isEmpty(val)) {
        if (3 <= this.visitors.length) {
          this.visitors.splice(0, 1);
        }

        this.visitors.push(val);
        this.visitors = _.uniqWith(this.visitors, _.isEqual);
      }
      else {
        this.visitors = [];
      }
    },
  },
  components: {
    WechatCode
  },
  methods: {

    handleGoToChat (item) {
      if (!_.isEmpty(item)) {
        this.formTemp = item;
        this.isShow   = true;

        let index = _.indexOf(this.visitors, item);

        if (-1 !== index) {
          this.visitors.splice(index, 1);
        }
      }
    },

    //推荐人二维码
    handleUserQrcode () {
      this.isWechat = true;
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    // 跳转到聊天
    handleGotoChat () {
      this.isShow = false;

      this.$router.push({
        name: 'chat.Home',
        params: {
          id: this.formTemp.user_id
        }
      });
    },

  }
};