import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import CityList     from '~common/components/city_list';
import BotSelect    from '~common/components/bot_select';
import BombBox      from '~common/components/bomb_box';
import Models       from '~common/models';

export default {
  name: 'task-center',
  data () {
    return {
      loading: false,
      /*
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
      isShow: false,
      bombShow: false,
      formIndex: '',
      botTitle: '',
    };
  },
  components: {
    'app-header'    : Header,
    CityList,
    BotSelect,
    BombBox,
  },
  computed: {
    city () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },
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
  },
  methods: {

    /**
     * 获取订单列表
     */
    save () {
      let self = this;

      let data = {};

      /*
       * 城市
       */
      if (!_.isEmpty(self.city)) {
        data.city_id = self.city.region_id;
      }

      /*
       * 额度
       */
      if (self.formData.money.min && self.formData.money.max) {
        data.min_quota = self.formData.money.min;
        data.max_quota = self.formData.money.max;
      }

      /*
       * 期限
       */
      if (self.formData.loanterm.min && self.formData.loanterm.max) {
        data.min_stage = self.formData.loanterm.min;
        data.max_stage = self.formData.loanterm.max;
      }

      /*
       * 工资发放形式
       */
      if (self.formData.wages.value) {
        data.salary_get_type = self.formData.wages.value;
      }
      else {
        data.salary_get_type = 0;
      }

      /*
       * 社保
       */
      if (self.formData.social.value) {
        data.ss_card = self.formData.social.value;
      }
      else {
        data.ss_card = 0;
      }

      /*
       * 贷款方式
       */
      if (self.formData.loanType.value) {
        if (1 === self.formData.loanType.value) {
          data.hold_car = 1;
          data.hold_house = 0;
        }
        else {
          data.hold_house = 1;
          data.hold_car = 0;
        }
      }

      /*
       * 公积金缴纳
       */
      if (self.formData.gjj.value) {
        data.min_fund_age = 1;
        data.max_fund_age = 100;
      }

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }

      self.loading = true;

      Models.Task
      .setting(data)
      .then((res) => {
        self.$toast(res.msg);
        self.loading = false;
      });
    },

    // 自定义筛选城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
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
  }
};