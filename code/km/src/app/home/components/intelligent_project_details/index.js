import './index.scss';

// import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';


export default {
  name: 'intelligentProjectDetails',
  data () {
    return {
      orderId : '',
      orderList : ''
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.getOrderId();
    this.getOrderDetails();
  },
  watch: {
  },
  methods: {
    getOrderId () {
      this.orderId = this.$route.params.id;
    },
    getOrderDetails () {
      Models.Intelligent
        .orderSublist({
          params: {
            id: this.orderId,
            page: 1
          }
        })
        .then((res) => {
          for (let i in res.data.data) {
            res.data.data[i].plan_pay_time = timestampToTime(res.data.data[i].plan_pay_time);
          }
          function  timestampToTime (timestamp) {
            let date = new Date( timestamp * 1000);
            let Y = date.getFullYear() + '/';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +  '/';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            return Y + M + D + h + m + s;
          }
          this.orderList = res.data;
      });
    },
    addCustom () {
    this.$router.push({
       name: 'home.intelligentSetCreditCardPayment',
     });
    }
  }
};
