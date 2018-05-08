import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import WechatCode from '~common/components/wechat_code';
import Models     from '~common/models';

export default {
  name: 'messageTeam',
  data () {
    return {
      /*
       * 分页
       */
      page          : 1,
      total         : 1,
      per_page      : 1,
      current_page  : 1,
      last_page     : 1,
      formData      : {},
      isWechat      : false,
      direct        : '',

      formTemp: {
        list: [],
      },
    };
  },
  components: {
    'app-header': Header,
    WechatCode
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
     * 获取通知列表
     */
    getList () {
      let self = this;
      Models.Notify
      .index({
        params: {
          page  : self.page,
          type  : self.$route.query.type,
          direct: self.direct,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (1 === self.page) {
            self.formTemp.list = [];
          }
          data.data.forEach((item) => {
            self.formTemp.list.push(item);
          });

          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
        }
      });
    },

    // direct改变
    handleDirectChange (value) {
      this.direct = value;
      this.page   = 1;
      this.getList();
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    // 推荐人二维码
    handleUserQrcode (item) {
      if (!_.isEmpty(item)) {
        this.formData = item.extend;
        this.isWechat = true;
      }
    },

    // 下拉刷新
    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getList();
        done();
      }, 1500);
    },

    // 上拉加载
    infinite (done) {
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        this.getList();
        done();
      }, 1500);
    },

  },
};