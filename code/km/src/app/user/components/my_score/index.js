import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import WechatCode from '~common/components/wechat_code';
import Models     from '~common/models';

export default {
  name: 'userMyScore',
  data () {
    return {
      isWechat: false,
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      type: 0,
      formTemp: {
        list: [],
        rating: {
          count     : 0,
          bad_num   : 0,
          good_num  : 0,
        },

        wx_qrcode: '',
        wechat_account: '',
      }
    };
  },
  created () {
    this.handleRatingCount();
    this.handleMyRating();
  },
  computed: {
		userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
		},
  },
  mounted () {
    window.aa = this;
  },
  watch: {
    type (val, old) {
      if (val !== old) {
        this.page = 1;
        this.handleMyRating();
      }
    }
  },
  components: {
    'app-header': Header,
    WechatCode
  },
  filters: {
    checkScoreType (value) {
      let data = '';
      switch (value) {
        case 1:
          data = '好评';
          break;
        case 2:
          data = '差评';
          break;
      }

      return data;
    }
  },
  methods: {

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    // 用户二维码
    handleUserQrcode (item) {
      this.formTemp.wx_qrcode       = item.user_info.wx_qrcode;
      this.formTemp.wechat_account  = item.user_info.wechat_account;
      this.isWechat = true;
    },

    // 用户评价统计
    handleRatingCount () {
      Models.User
      .ratingCount()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formTemp = _.assign({}, this.formTemp, {
            rating: data
          });
        }
      });
    },

    // 收到的评价
    handleMyRating () {
      let self = this;

      Models.User
      .myRating({
        params: {
          page: self.page,
          type: self.type,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.formTemp.list = _.concat(self.formTemp.list, data.data);
          }
          else {
            self.formTemp.list = data.data;
          }

          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
        }
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.handleMyRating();
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
        this.handleMyRating();
        done();
      }, 1500);
    },

  },
};