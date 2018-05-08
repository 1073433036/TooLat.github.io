import './index.scss';
import 'swiper/dist/css/swiper.css';

import _          from 'lodash';
import Header     from '~common/components/header';
import Footing    from '~common/components/page_footing';
import Models     from '~common/models';
import Swiper     from 'swiper';

export default {
  name: 'loan',
  data () {
    return {
			isShow:true,
      isBonus: false,
      state: {
        sortFlag: false,
        selectFlag: false,
      },
      setIndex: {
        sortIndex: 0,
        quotaIndex: 0,
        workIndex : 0,
        mortgageIndex: [true],
        cycleIndex: 0,
        termIndex: 0,
			},
      objects: {
        sortList: [
          {
            name: '默认',
            mode: '（综合排序）',
            value: 'id',
          },
          {
            name: '按额度',
            mode: '（从高到低）',
            value: 'max_quota',
          },
          {
            name: '按放款速度',
            mode: '（从快到慢）',
            value: 'deal_speed',
          },
          {
            name: '按上新时间',
            mode: '（从新到旧）',
            value: 'start_time',
          },
          {
            name: '申请成功率',
            mode: '（从高到低）',
            value: 'deal_rate',
          },
        ],
        quotaList: [
          {
            name: '不限',
          },
          {
            name: '100-5000元',
          },
          {
            name: '5000-20000元',
          },
          {
            name: '2万-5万',
          },
          {
            name: '5万-10万元',
          },
          {
            name: '10万元以上',
          },
        ],
        workList: [
          {
            name: '不限',
          },
          {
            name: '上班族',
          },
          {
            name: '学生',
          },
          {
            name: '自由职业者',
          },
          {
            name: '个体户',
          },
        ],
        mortgageList: [
          {
            name: '不限',
          },
          {
            name: '有营业执照',
          },
          {
            name: '有商业风险',
          },
          {
            name: '有公积金',
          },
          {
            name: '有社保',
          },
          {
            name: '有打卡工资',
          },
          {
            name: '有车',
          },
          {
            name: '有房',
          },
          {
            name: '有信用卡',
          },
          {
            name: '有淘宝京东',
          },
          {
            name: '有芝麻信用分',
          },
          {
            name: '手机已实名认证',
          },
        ],
        cycleList: [
          {
            name: '不限',
          },
          {
            name: '当天放款',
          },
          {
            name: '1-3天',
          },
          {
            name: '3天以上',
          },
        ],
        termList: [
          {
            name: '不限',
          },
          {
            name: '一个月内',
          },
          {
            name: '1-6个月',
          },
          {
            name: '6个月以上',
          },
        ],
      },

      page  : 1,
      total : 0,
      per_page: 0,
      current_page: 0,
      last_page: 0,
      sort  : 'id',
      filter: {
        quota: '',
        work: '',
        data: '',
        deal: '',
        lend: '',
      },
      formTemp: {
        filter: {
          quota: '',
          work: '',
          data: '',
          deal: '',
          lend: '',
        },
        data: [],
			},
				brokerage:'',
				explain:'',
      swiperOption: {
        notNextTick: true,
        autoplay: 2000,
        grabCursor : true,
        pagination : '.swiper-pagination',
        paginationClickable :true,
        mousewheelControl : false,
        observeParents:true,
        loop: true
      },

      filterData: [],

      isMaskVip   : false,
      isSee       : false,
      currentBank : {},
      loanId      : '',
    };
  },
  components: {
		'app-header': Header,
		'app-footing': Footing,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    isWechatClient () {
      return this.device.is('WeChat');
    },
  },
  created () {
    this.list();
  },
  mounted () {
    this.getForum();
    this.$nextTick(() => {
      /* eslint-disable */
      let swiper = new Swiper(this.$refs.mySwiper, this.swiperOption);
      /* eslint-enable */
		});
  },
  watch: {
  },
  methods: {
    // 获取版块通知
    async getForum () {
      let res = await Models.Notify.forum('loan');
      if (res.code === 1) {
        this.$store.get.dispatch({
          type: 'setSystemMessage',
          message: res.data
        });
      }
    },

    // 获取信贷列表
    list () {
      let self = this;
      let data = {
        params: {
          page: self.page,
        }
      };

      if (!_.isEmpty(self.sort)) {
        data.params.sort = self.sort;
      }

      for (let i in self.filter) {
        if (0 < self.filter[i].length || _.isNumber(self.filter[i]) * 1) {
          data.params[i] = self.filter[i];
        }
      }

      Models.Lender
      .list(data)
      .then((res) => {
        if (res && 1 === res.code) {
          let data = _.get(res, 'data.list');

          if (1 < self.page) {
            self.formTemp.data = _.concat(self.formTemp.data, data.data);
            console.log(self.formTemp.data);
          }
          else {
						self.formTemp.data = data.data;
            console.log(self.formTemp.data);
					}

          self.formTemp.filter = _.get(res, 'data.filter');

          self.total        = data.total;
          self.per_page     = data.per_page;
          self.current_page = data.current_page;
          self.last_page    = data.last_page;
        }
			});
    },

    /*
     * 智能排序
     */
    handleSort (index) {
      this.sort = index;
      this.state.sortFlag = false;
      this.page = 1;
      this.list();
    },
    /*
     * 贷款额度
     */
    quota (index) {
      this.filter.quota = index;
    },
    /*
     * 职业身份
     */
    work (index) {
      this.filter.work = index;
    },
    /*
     * 个人资质（可多选）
     */
    mortgage (value) {

      let index = _.indexOf(this.filterData, value);

      _.remove(this.filterData, el => 0 === el * 1);

      if (-1 === index) {
        this.filterData.push(value);
      }
      else {
        this.filterData.splice(index, 1);
      }

      if (0 === value * 1) {
        this.filterData = [];
        this.filterData.push(value);
      }

      let str = JSON.stringify(this.filterData);

      str = _.replace(str, '[', '');
      str = _.replace(str, ']', '');

      this.filter.data = str;

    },


    /*
     * 办理周期
     */
    cycle (index) {
      this.filter.deal = index;
    },
    /*
     * 借款期限
     */
    term (index) {
      this.filter.lend = index;
    },

    /*
     * 重置
     */
    reset () {
      this.filter = {
        quota: '',
        work: '',
        data: '',
        deal: '',
        lend: '',
      };

    },

    /*
     * 立即申请
     */
    applying (id) {
      this.loanId = id;
      if (1 === this.userInfo.level * 1) {
        this.isMaskVip = true;
      }
      else {
        let route = {
          name: 'home.LoanDeatil',
          params: {
            id: this.loanId,
          },
        };
        this.$router.push(route);
      }
    },

    /*
     * 关闭直接进入贷款页面
     */
    closeVip () {
      this.isMaskVip = false;
      let route = {
        name: 'home.LoanDeatil',
        params: {
          id: this.loanId,
        },
      };
      this.$router.push(route);
    },


    // 弹出层
    handleBonus (item) {
      // if (this.isWechatClient) {
      //   return;
      // }
      this.isBonus      = true;
			this.currentBank  = item;
			this.brokerage = item.cms_val;
			this.explain = item.notice;
    },

    /*
     * 完成
     */
    submit () {

      this.state.sortFlag = false;
      this.state.selectFlag = false;
      this.page = 1;
      this.list();
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.list();
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
        this.list();
        done();
      }, 1500);
		},
		//关闭广告
		close () {
			this.isShow = false;
		},

    /*
     * @是否是高级会员及以上级别
       @issue         BOSS
       @time          2018-01-06
       @content       普通会员信用卡奖金、贷款奖金说明不能让他看到，只有交了钱的高级会员及以上级别才能看到
       @param         userInfo.level === 1 普通会员
       @edit          李华东
       @edit number   第一次
     */
    isMember () {
      let self = this;
      if (1 === this.userInfo.level) {
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '目前此功能只针对高级会员及以上身份开放，是否立即升级会员？',
          lists : [
            {
              msg: '关闭',
            },
            {
              msg: '立即升级',
              class: 'ok',
              func () {
                let route = {
                  name: 'user.BuyVip'
                };
                self.$router.push(route);
              },
            }
          ]
        });
      }
      else {
        let route = {
          name: 'home.LoanLoans'
        };
        this.$router.push(route);
      }
    },

  },
  filters: {
    levelText (value) {
      let name = '';
      switch (value) {
        case 1:
          name = '普通会员';
          break;
        case 2:
          name = '高级会员';
          break;
        case 3:
          name = '专员';
          break;
        case 4:
          name = '经理';
          break;
        case 5:
          name = '个人代理';
          break;
        case 6:
          name = '区域代理';
          break;
      }
      return name;
    },
  },
};
