import './index.scss';

import _ 				    from 'lodash';
import Header       from '~common/components/header';
import WechatCode   from '~common/components/wechat_code';
import Models       from '~common/models';

export default {
  name: 'userTeam',
  data () {
    return {
      level: 1,
      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      current_position: 0,
			isWechat: false,
      isShowTeamExplain :false,
      isShowPaging: false,
      isShowpagingBtn: false,
			formTemp: {
				manager: {},
        list: [],
        nav: [],
			},


			manager: {
				wx_qrcode: '',
				wechat_account: '',
			},
      sameData: {},

      type: null,
      teamTotal: 0,
      keyword: '',
      direct: 0,

    };
  },
  components: {
    'app-header': Header,
    WechatCode
  },
  computed: {
    userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    this.type = _.get(this.$route, 'params.id');
    this.list();
    this.getNav();
  },
  watch: {
    'formTemp.list': {
      deep: true,
      handler: function (val) {
        if (!_.isEmpty(val)) {
          this.isShowpagingBtn = true;
        }
        else {
          this.isShowpagingBtn = false;
        }
      }
    },
    isShowPaging (val) {
      if (val) {
        setTimeout(() => {
          this.$refs.pageScroller.scrollTo(0, this.current_position);
        }, 50);
      }
    },
    last_page (val) {
      let page = parseInt(val);
      if (8 > page && 1 < page) {
        this.$nextTick(function () {
          let itemNum = this.$refs.pagingUl.querySelectorAll('.item').length;
          let itemHeight = this.$refs.currentPage.offsetHeight;
          this.$refs.choosePage.style.height = itemHeight * itemNum + 'px';
        });
      }
    },

    direct (val, old) {
      if (val !== old) {
        this.page = 1;
        this.list();
      }
    }
  },
  filters: {
    removeSecond (value) {
      if (value) {
        let data = value.split(':');

        return `${data[0]}:${data[1]}`;
      }

      return value;
    },

    filterDirect (value) {
      return true === value ? '直' : '间';
    },

    filterTitle (value) {
      let data = '团队管理';
      if (value) {
        switch (value * 1) {
          case 1: data = '直接锁粉';
          break;
          case 2: data = '间接锁粉';
          break;
          case 3: data = '实习会员';
          break;
          case 4: data = '高级会员';
          break;
          case 5: data = '保险经理';
          break;
          case 6: data = '保险主任';
          break;
        }
      }
      return data;
    }
  },
  methods: {
    choosePageSwitch () {
      if (1 === this.last_page) {
        return;
      }

      this.isShowPaging = !this.isShowPaging;
    },
    checkedCurrentPage (index, str) {
      if ('front' === str && 1 === this.current_page) {
        return;
      }
      if ('next' === str && this.last_page === this.current_page) {
        return;
      }
      if (1 === this.last_page) {
        return;
      }

      if (this.$refs.pageScroller) {
        this.current_position = this.$refs.pageScroller.getPosition().top;
        this.current_page = index;
        setTimeout(() => {
          this.list(index);
        }, 200);
      }
    },
    handleCompText (item) {
      if (this.userInfo.level < item.level) {
        return '（比你高级别）';
      }
      else if (this.userInfo.level === item.level) {
        return '（同级别）';
      }
    },

    /*
     * 获取tab统计数据
     */
    getNav () {
      this.teamTotal = _.get(this.$route, 'query.count') || 0;
      // let self = this;
      // Models.User
      // .teamLevel()
      // .then((res) => {
      //   if (1 === res.code) {
      //     let data = res.data;
      //     _.forEach(data, (item) => {
      //       self.teamTotal += item.count;
      //     });
      //   }
      // });
    },

    /*
     * 获取团队列表
     */
    list (page) {
      let self = this;

      let params = {
        params: {
          user_id: self.userInfo.id,
          page: self.page,
          type: self.type,
          direct: self.direct
        }
      };

      if (page) {
        params.params.page = page;
        this.isShowPaging = false;
      }

      if (!_.isEmpty(self.keyword + '')) {
        params.params.keyword = self.keyword;
      }

      Models.User
      .childUserList(params)
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.formTemp.list = _.concat(self.formTemp.list, data.data);
          }
          else {
            self.formTemp.list = data.data;
          }

          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;

        }

			});
    },

    handleSame () {
      Models.User
      .same()
      .then((res) => {
        if (1 === res.code) {
          this.sameData = res.data;
          if (true === this.sameData.update && 1 < this.userInfo.level) {
            this.isShowTeamExplain = true;
          }

        }
      });
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        self.list();
        done();
      }, 1500);
    },

    infinite (done) {
      let self = this;
      if (self.last_page <= self.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        self.page ++;
        self.list();
        done();
      }, 1500);
    },

		/*
     * 添加微信
     */
    addWeChat (item) {
			if (_.isObject(item)) {
				this.formTemp.manager.wx_qrcode  			= item.wx_qrcode ;
				this.formTemp.manager.wechat_account 	= item.wechat_account;
				this.isWechat = true;
			}
			else {
				this.isWechat = false;
			}
		},

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    // 搜索
    handleSearch () {
      this.page = 1;
      this.list();
    }

  },
};