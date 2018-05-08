import './index.scss';

import _ from 'lodash';
import Header from '~common/components/header';
import Models       from '~common/models';
import BotSelect from '~common/components/bot_select';
import AddPaln from './components/add_paln';
import Dates from '~common/components/dates';


export default {
  name: 'intelligentPaymentReservation',
  data () {
    return {
      formIndex: false,
      isShow: false,
      userInfo: {
        region: '',
        industry: '',
      },
      time: {
        date1: '',
        date2: '',
      },
      Show: false,
      consumePlan: false,
      repaymentPlan: false,
      ShowPlan: false,
      botTitle: '',
      formTemp: {
        region: [],
        industry: [],
      },

    };
  },
  components: {
    'app-header': Header,
    BotSelect,
    AddPaln,
    Dates,
  },
  computed: {},
  mounted () {
    this.industry();
    this.confirmAdd();
    // console.log(this.industry);
    // let self = this;
    // self.$store.get.dispatch({
    //   type  : 'handleChangeDialog',
    //   CustomClass: ['grey-header', 'grey-header'],
    //   active: true,
    //   width: '90%',
    //   title: '温馨提示',
    //   msg   : '请制定至少两天计划,可重复点击添加消费还款计划',
    //   html  : '',
    //   lists : [
    //     {
    //       msg: '否'
    //     },
    //     {
    //       msg: '是',
    //       func () {
    //         // self.$router.push({
    //         //   name: 'home.CarAccreditation',
    //         //   query: Object.assign({}, self.$route.query ,
    //         //     {
    //         //       school: self.cartName ,
    //         //       id: item.id ,
    //         //       parentid: item.parentid
    //         //     })
    //         // });
    //       }
    //     },
    //   ]
    // });
  },
  watch: {},
  methods: {
    // 日期选择
    handleDateChange (item) {
      this.isShow = true;
      this.formIndex = item;
    },
    // 日期组件回调
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          _.assign(this.time, {
            [this.formIndex]: obj.content,
          });
          return;
        }
      }
    },

    // 添加消费计划
    addconsumePlan () {
      this.consumePlan = true;
    },

    // 添加还款计划
    addrepaymentPlan () {
      this.repaymentPlan = true;
    },
    // 确认计划
    async confirmAdd () {
      this.ShowPlan = true;
      let res = await Models.Intelligent.createConfirm();
      if (res.code === 1) {
        console.log(res);
      }
    },

    //添加计划弹窗
    AddPalnClick () {
      this.ShowPlan = false;
    },
    //地区
    getRegionClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Show = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.userInfo, {
              [this.formIndex]: obj.content.name,
            });
          }
          return;
        }
      }
    },
    // 地区弹窗
    async handleBotSelectChange (index) {
      this.formIndex = index;
      this.Show = true;
      if (index === 'region') {
        this.botTitle = '地区';
      }
      else if (index === 'industry') {
        this.botTitle = '行业';
      }
      let res = await Models.Intelligent.area({
      });
      if (res.code === 1) {
        this.formTemp.region = res.data.data;
      }
    },

    //行业
    async industry () {
      let res = await Models.Intelligent.industry({
      });
      if (res.code === 1) {
        this.formTemp.industry = res.data.data;
      }
    },

    addCustom () {
      this.$router.push({
        name: 'home.intelligentSetCreditCardPayment',
      });
    },
  },
};
