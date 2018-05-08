import './index.scss';

import _          from 'lodash';
import Footer     from '~common/components/footer';
import Footing    from '~common/components/page_footing';
import CityList   from '~common/components/city_list';
import BotSelect  from '~common/components/bot_select';
import BombBox    from '~common/components/bomb_box';
import Models     from '~common/models';

export default {
  name: 'task',
  data () {
    return {
      state: {
        nav        : true,
        type       : false,
        city       : false,
        define     : false,
      },
      /*
       * @param page int 页码
       * @param order_type int 订单类型，0-全部，1-可抢订单，2-已抢订单
       * @param city_id int 所在城市
       * @param min_quota float 贷款额度 - 最低额度
       * @param max_quota float 贷款额度 - 最高额度
       * @param min_stage int 贷款期限 - 最低期数
       * @param max_stage int 贷款期限 - 最高期数
       * @param salary_get_type int 工资发放形式 1-银行转账，2-现金
       * @param hold_car int 贷款方式 - 车贷 固定值为1
       * @param hold_house int 贷款方式 - 房贷 固定值为1（除了车贷、房贷其他方式不用传值）
       * @param ss_card int 社保要求 0-不限，1-有社保
       * @param min_fund_age int 缴纳公积金要求 - 最低年限
       * @param max_fund_age int 缴纳公积金要求 - 最高年限
       */
      formData: {
        /*
         * 订单类型
         */
        orderTpye   : 0,
        money       : {},
        loanterm    : {},
        wages       : {},
        loanType    : {},
        gjj         : {},
        social      : {},
      },
      formTemp : {
        type    : [
          {
            name: '全部订单',
            value: 0,
          },
          {
            name: '可抢订单',
            value: 1,
          },
          {
            name: '已抢订单',
            value: 2,
          },
        ],
        money: [
          {
            name: '0—5万',
            value: '1-5',
            min: 1,
            max: 50000,
          },
          {
            name: '5万—10万',
            value: '5-10',
            min: 50000,
            max: 100000,
          },
          {
            name: '10万—20万',
            value: '1-20',
            min: 100000,
            max: 200000,
          },
          {
            name: '20万—50万',
            value: '20-50',
            min: 200000,
            max: 500000,
          },
        ],
        loanterm: [
          {
            name: '6-12个月',
            value: '6-12',
            min: 6,
            max: 12,
          },
          {
            name: '12-24个月',
            value: '12-24',
            min: 12,
            max: 24,
          },
          {
            name: '24-36个月',
            value: '24-36',
            min: 24,
            max: 36,
          },
          {
            name: '36-48个月',
            value: '36-48',
            min: 36,
            max: 48,
          },
        ],

        wages: [
          {
            name: '不限',
            value: 0,
          },
          {
            name: '银行转账',
            value: 1,
          },
          {
            name: '现金',
            value: 2,
          },
        ],
        loanType: [
          {
            name: '不限',
            value: 0,
          },
          {
            name: '车抵押贷款',
            value: 1,
          },
          {
            name: '房抵押贷款',
            value: 2,
          },
        ],
        gjj: [
          {
            name: '不限',
            value: 0,
          },
          {
            name: '有公积金',
            value: 1,
          },
        ],

        social: [
          {
            name: '不限',
            value: 0,
          },
          {
            name: '有社保',
            value: 1,
          },
        ],
      },
      /*
       * 订单列表
       */
      list: [],
      manager: '',
      isShow: false,
      bombShow: false,
      formIndex: '',
      botTitle: '',
      /*
       * 分页
       */
      page          : 1,
      total         : 0,
      per_page      : 0,
      current_page  : 0,
      last_page     : 0,
    };
  },
  components: {
		'app-footer': Footer,
		'app-footing': Footing,
    BotSelect,
    CityList,
    BombBox,
  },
  computed: {
    cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    prov () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    city () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    area () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
    },

  },
  created () {
    this.getList();
    this.getManager();
  },
  mounted () {

  },
  watch: {
    formIndex (value) {
      switch (value) {
        case 'money':
          this.botTitle = '贷款额度';
        break;
        case 'loanterm':
          this.botTitle = '贷款期限';
        break;
      }
    },
    city: {
      deep: true,
      handler () {
        this.getList();
      }
    },
  },
  methods: {

    // 自定义筛选城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    /*
     * 后退
     */
    handleBack () {
      this.$router.go(-1);
    },

    /*
     * 切换导航
     */
    switchNav (index) {
      if (1 === index) {
        this.getList();
        this.state.nav = true;
      }
      else {
        this.getSetting();
        this.state.nav = false;
      }
    },

    /*
     * 切换筛选
     */
    select (index) {
      switch (index) {
        case 0 :
          this.state.city = this.state.define = false;
          if (true === this.state.type) {
            this.state.type = false;
          }
          else {
            this.state.type = true;
          }
        break;
        case 1 :
          this.state.type = this.state.define = false;
          if (true === this.state.city) {
            this.state.city = false;
          }
          else {
            this.state.city = true;
          }
        break;
        case 2 :
          this.state.type = this.state.city = false;
          if (true === this.state.define) {
            this.state.define = false;
          }
          else {
            this.state.define = true;
          }
        break;
      }
    },

    /**
     * 获取订单列表
     */
    getList () {
      let self = this;

      let data = {
        params: {
          page             : self.page,
          order_type       : self.formData.orderTpye,
        },
      };

      /*
       * 城市
       */
      if (!_.isEmpty(self.city)) {
        data.params.city_id = self.city.region_id;
      }

      /*
       * 额度
       */
      if (self.formData.money.min && self.formData.money.max) {
        data.params.min_quota = self.formData.money.min;
        data.params.max_quota = self.formData.money.max;
      }

      /*
       * 期限
       */
      if (self.formData.loanterm.min && self.formData.loanterm.max) {
        data.params.min_stage = self.formData.loanterm.min;
        data.params.max_stage = self.formData.loanterm.max;
      }

      /*
       * 工资发放形式
       */
      if (self.formData.wages.value) {
        data.params.salary_get_type = self.formData.wages.value;
      }

      /*
       * 社保
       */
      if (self.formData.social.value) {
        data.params.ss_card = self.formData.social.value;
      }

      /*
       * 贷款方式
       */
      if (self.formData.loanType.value) {
        if (1 === self.formData.loanType.value) {
          data.params.hold_car = 1;
          data.params.hold_house = 0;
        }
        else {
          data.params.hold_house = 1;
          data.params.hold_car = 0;
        }
      }

      /*
       * 公积金缴纳
       */
      if (self.formData.gjj.value) {
        data.params.min_fund_age = 1;
        data.params.max_fund_age = 100;
      }

      Models.Task
      .list(data)
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;

          if (1 < self.page) {
            self.list = _.concat(self.list, data.data);
          }
          else {
            self.list = data.data;
          }

          self.total         = data.total;
          self.per_page      = data.per_page;
          self.current_page  = data.current_page;
          self.last_page     = data.last_page;
        }
      });
    },

    /**
     * 获取是否是信贷经理
     */
    getManager () {
      let self = this;
      Models.Task
      .getManager()
      .then((res) => {
        if (1 === res.code) {
          self.manager = res.data;
        }
      });
    },

    /**
     * 获取推送订单
     */
    getSetting () {
      let self = this;
      Models.Task
      .setList()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          self.list = data.data;
        }
      });
    },

    /**
     * 切换订单类型
     */
    switchOrderTpey (item) {
      this.formData.orderTpye = item.value;
      this.state.type = false;
      this.getList();
    },

    /**
     * 切换自定义筛选
     */
    screen () {
      this.getList();
      this.state.define = false;
    },

    // 底部弹框组件1
    botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content
            });
          }
          return;
        }
      }
    },


    // 所属组件1
    handleBotSelectChange (index) {
      this.formIndex  = index;
      this.isShow     = true;
    },


    // 底部弹框组件2
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.formData, {
              [this.formIndex]: obj.content,
            });
          }
          return;
        }
      }
    },

    // 所属组件2
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
    },

    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        this.getList();
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
        this.getList();
        done();
      }, 1500);
    },
  },

  filters: {
    isMarry (value) {
      return 0 === value ? '未婚' : '已婚';
    },
  },
};