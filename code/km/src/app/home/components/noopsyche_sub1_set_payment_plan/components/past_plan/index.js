import './index.scss';

import Header                        from '~common/components/header';


export default {
  name: 'PastPlan',
  data () {
    return {
      paymentPlanData: {
        paymentType: '我要精养',
        money: '',
        onceMaxMoney: '1018.05',
        paymentRate: '0.45%+1',
        PaymentPlanAmount: '￥5032.8',
        serviceCharge: '￥32.8'
      },
      paymentMsg: [
        {
          time: '1/5',
          paymentMoney: '￥1018.58',
          paymentDate: '2017-12-06 10:24:52',
          state: '未执行'
        },
        {
          time: '2/5',
          paymentMoney: '￥1018.58',
          paymentDate: '2017-12-06 10:24:52',
          state: '未执行'
        },
        {
          time: '3/5',
          paymentMoney: '￥1018.58',
          paymentDate: '2017-12-06 10:24:52',
          state: '未执行'
        }
      ]
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {

  },
  watch: {
  },
  methods: {
  }
};