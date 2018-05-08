import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';
import Zoom         from '~common/components/zoom';
import WechatCode   from '~common/components/wechat_code';

export default {
  name: 'peerDetail',
  data () {
    return {
      formTemp: {
				apply: {}
			},

      isZoom: false,
      isWechat: false,
      zoomImage: '',
    };
  },
  computed: {
  },
  mounted () {
    this.info();
  },
  components: {
    'app-header': Header,
    Zoom,
    WechatCode
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
					let data = res.data;
					this.formTemp = _.assign({}, this.formTemp, data);
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

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    // 放大图片
    zoom (image) {
      this.isZoom = true;
      this.zoomImage = image;
    },

  }
};