import './index.scss';

import _ 				        from 'lodash';
import Header           from '~common/components/header';
import Count            from './components/count';
import General          from './components/general';
import WechatCode       from '~common/components/wechat_code';
import Models           from '~common/models';
import SessionStorage   from '~common/services/sessionStorage.cookie';

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
			isTotal: false,
			isWechat: false,
      isShowTeamExplain :false,
      isShowPaging: false,
      isShowpagingBtn: false,
			formTemp: {
				manager: {},
        data: [],
        nav: [],
			},

      toDayList: {},

			manager: {
				wx_qrcode: '',
				wechat_account: '',
			},

      sameData: {},
      day: 0,
      teamTotal: 0,
      keyword: '',
      direct: '',

    };
  },
  components: {
    'app-header': Header,
		Count,
		General,
    WechatCode
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    // this.getTeamNum();
    this.list();
    this.handleToDayList();
    this.getNav();

    this.handleSame();
  },
  watch: {
    'formTemp.data': {
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

    filterNumber (value) {
      if (value) {
        return 10000 <= value * 1 ? `${(value * 1 / 10000).toFixed(1)}万` : value;
      }
      return value;
    },
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

    handleNav (item) {
      if ('专员' === item.name && !item.count) {
        return false;
      }
      else if ('经理' === item.name && !item.count) {
        return false;
      }
      return true;
    },

    /*
     * 获取今日统计数据
     */
    handleToDayList () {
      let self = this;
      // let data = SessionStorage.get('user.TeamStatistics');

      // if (_.isEmpty(data.data)) {
        Models.User
        .teamStatistics({
          params: {
            day: self.day,
          }
        })
        .then((res) => {
          if (1 === res.code) {
            self.toDayList = res.data;
            if (0 === self.day) {
              SessionStorage.set('user.TeamStatistics', res.data, 60 * 2);
            }
            // self.formTemp.data = res.data;
          }
        });
      // }
      // else {
      //   self.toDayList = data.data;
      // }
    },


    // tab切换
    navTabChange (val) {
      if (this.day !== val) {
        this.day = val;
        SessionStorage.remove('user.TeamStatistics');
        this.handleToDayList();
      }
    },


    /*
     * 获取tab统计数据
     */
    getNav () {
      let self = this;

      // let data = SessionStorage.get('user.TeamLevel');

      // if (_.isEmpty(data.data)) {
        Models.User
        .teamLevel()
        .then((res) => {

          if (1 === res.code) {
            SessionStorage.set('user.TeamLevel', res.data, 60 * 2);

            res.data.forEach((value) => {
              self.teamTotal += value.count;
              self.formTemp.nav.unshift(value);
            });
          }
        });
      // }
      // else {
      //   data.data.forEach((value) => {
      //     self.teamTotal += value.count;
      //     self.formTemp.nav.unshift(value);
      //   });
      // }
    },

    /*
     * 获取团队总人数
     */
    // getTeamNum () {
    //   let self = this;
    //   Models.User
    //   .getTeamNum()
    //   .then((res) => {
    //     if (1 === res.code) {
    //       self.total = res.data;
    //     }
    //   });
    // },

    /*
     * 获取等级id
     */
    switchNav (level) {
      if (level !== this.level) {
        this.page   = 1;
        this.level  = level;
        this.list();
      }
    },

    /*
     * 获取团队列表
     */
    list (page) {
      let self = this;

      let params = {
        params: {
          page: self.page,
          level: self.level,
        }
      };


      if (page) {
        params.params.page = page;
        this.isShowPaging = false;
      }

      if (!_.isEmpty(self.keyword + '')) {
        params.params.keyword = self.keyword;
      }

      if (!_.isEmpty(self.direct + '')) {
        params.params.direct = self.direct;
      }

      Models.User
      .teamList(params)
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.formTemp.data = _.concat(self.formTemp.data, data.data);
          }
          else {
            self.formTemp.data = data.data;
            self.$refs.my_scroller.scrollTo(0, 0);
          }

          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;

        }

			});
    },

    // 同等级人数
    handleSame () {
      // let data = SessionStorage.get('user.TeamSame');

      // if (_.isEmpty(data.data)) {
        Models.User
        .same()
        .then((res) => {
          if (1 === res.code) {
            SessionStorage.set('user.TeamSame', res.data, 60 * 2);
            this.sameData = res.data;
            if (true === this.sameData.update && 1 < this.userInfo.level) {
              this.isShowTeamExplain = true;
            }

          }
        });
      // }
      // else {
      //   this.sameData = data.data;
      //   if (true === this.sameData.update && 1 < this.userInfo.level) {
      //     this.isShowTeamExplain = true;
      //   }
      // }
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

		teamDec (item) {
			this.$router.push(
        {
          name: 'user.TeamDetail',
          params: {
            id: item.id,
          }
        }
      );
		},

    // 搜索
    handleSearch () {
      this.page = 1;
      this.list();
    },

    // 我的直推
    handleMyList () {
      this.direct  = 3;
      this.page    = 1;
      this.keyword = '';
      this.list();
    },
  },
};