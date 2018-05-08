import './index.scss';
import Dates              from '~common/components/dates';
import Header           from '~common/components/header';
import _                  from 'lodash';
import BombBox            from '~common/components/bomb_box';
import BotSelect     from '~common/components/bot_select';
import BotSelectB    from '~common/components/bot_select_b';
import PayType           from '~common/components/pay';
import Models         from '~common/models';
export default {
  data () {
    return {
      name: 'insuranceOrderDetail',
      formIndex: false,
      botTitle: '',
      loading: false,
			bombShow: false,
      userInfo: {
        plan: '',
        insurePlan: '',
        insureDate: '',
        insureDeadline: '',
        details: '',
        name: '',
        insured: '',
      },
      formTemp       : {
        pay      : [
          {
            name: '微信支付',
            value: 9,
            img: '/assets/images/insurance_order/wechat.png',
          },
          {
            name: '支付宝支付',
            value: 10,
            img: '/assets/images/insurance_order/alipay.png',
          },
          {
            name: '储蓄卡支付',
            value: 11,
             img: '/assets/images/insurance_order/unionpay.png',
          },
        ],
        plan         : [
          {
            name: '珍珠计划',
            value: 6,
          },
          {
            name: '玛瑙计划',
            value: 7,
          },
          {
            name: '砖石计划',
            value: 8,
          },
        ],
        insurePlan   : [
          {
            name: '6个月',
            value: 6,
          },
          {
            name: '12个月',
            value: 12,
          },
          {
            name: '24个月',
            value: 24,
          },
          {
            name: '36个月',
            value: 36,
          },
          {
            name: '48个月',
            value: 48,
          },
        ],
        details      : [
          {
            name: '意外伤害',
            value: 1,
            price: '30万',

          },
          {
            name: '车架意外伤害',
            value: 2,
            price: '30万',
          },
          {
            name: '意外医疗伤害',
            value: 3,
            price: '30万',
          },
          {
            name: '意外',
            value: 4,
            price: '30万',
          },
          {
            name: '48个月',
            value: 5,
            price: '30万',
          },
        ],
      },
      isShow: false,
      Show: false,
      Showa: false,
      Showpay: false,
    };
  },
  components: {
    'app-header': Header,
     Dates,
     BombBox,
     BotSelect,
     BotSelectB,
     PayType
  },
  computed: {
  },
  mounted () {
    this.orderDetails();
  },
  watch: {

  },
  methods: {
    // 获取订单信息
    async orderDetails () {
          let res = await Models.Insure.orderDetails({
            params: {
              car_id: '27'
            }
          });
          if (res.code === 1) {
             // this.plan = res.data
             // this.insurePlan = res.data
             // this.insureDate = res.data
             // this.insureDeadline = res.data
             // this.details = res.data
             // this.name = res.data
             // this.insured = res.data
             // 保费
             // this.premium = res.data
             // 订单号
             // this.orderNumber = res.data
             // 订单时间
             // this.orderTime = res.data
          }
        },
    // 期限
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
    },
    //底部弹框组件2
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.userInfo, {
              [this.formIndex]: obj.content.name,
            });
          }
          return;

        }
      }
    },
    // 底部弹框组件1(投保计划)
    botSelectClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Show = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.userInfo, {
              [this.formIndex]: obj.content.name
            });
          }
          return;
        }
      }
    },
    // 所属组件1(投保计划)
    handleBotSelectChange (index) {
      this.formIndex  = index;
      this.Show     = true;
      if ( index === 'plan' ) {
        this.botTitle = '计划';
      }
      else if (index === 'insurePlan') {
        this.botTitle = '保障计划';
      }
    },
    //支付方式（底部弹窗）
    botPayClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Showpay = obj.status;
          console.log(this.Showpay);
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.userInfo, {
              [this.formIndex]: obj.content.name
            });
          }
          return;
        }
      }
    },
    //支付方式
    handlePayClick (index) {
      this.formIndex  = index;
      this.Showpay    = true;
      if ( index === 'pay' ) {
        this.botTitle = '支付方式';
      }
    },
     // 所属组件1(投保内容)
    botSelectbClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Showa = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            _.assign(this.userInfo, {
              [this.formIndex]: obj.content.name
            });
          }
          return;
        }
      }
    },
    // 所属组件1(投保内容)
    handleBotSelectb (index) {
      this.formIndex  = index;
      this.Showa     = true;
      if ( index === 'details' ) {
        this.botTitle = '保障内容';
      }
      else if (index === 'insurePlan') {
        this.botTitle = '保障计划';
      }
    },
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
          _.assign(this.userInfo, {
            [this.formIndex]: obj.content
          });
          return;
        }
      }
    },
  }
};
