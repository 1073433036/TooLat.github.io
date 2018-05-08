import './index.scss';

import _                    from 'lodash';
import Header               from '~common/components/header';
import Models               from '~common/models';

export default {
  name: 'PaymentProgressDetail',
  data () {
    return {
      paymentDetailInfo: [],
      pageStatus: 1,
      isShowPage: false

    };
  },
  components: {
    'app-header': Header,
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      let data = {
        main_sn: vm.main_sn
      };
      if (!vm.main_sn) {
        vm.$router.push({name: 'home.PaymentProgress'});
        return;
      }
      Models.Cultivate.paymentDetail(data).then(res => {
        if (1 === res.code) {
          vm.pageStatus = 0;
          vm.$store.get.dispatch({
            type: 'Loading',
            isShow: false
          });

          vm.paymentDetailInfo = res.data.order;
          vm.isShowPage = true;
        }
      });
    });
  },
  computed: {
    paymentProgressInfo () {
      return _.get(this.$store.get.state, 'CultivateCard.paymentProgressInfo');
    },
    main_sn () {
      return _.get(this.$store.get.state, 'CultivateCard.order_main_sn');
    },
    isShow () {
      return _.get(this.$store.get.state, 'Loading.isShow');
    }
  },
  mounted () {
  },
  watch: {
    isShow (val) {
      if (!val && this.pageStatus) {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: true
        });
      }
    }
  },
  methods: {
    handleCardNo (value) {
      let arr = [...value];
      let preArr = arr.slice(0, 4);
      let afterArr = arr.slice(-4);
      let midArr = arr.slice(4, arr.length - 4);
      midArr = midArr.map(function () {
        return '*';
      });
      let result = preArr.concat(midArr, afterArr);
      return result.join('');
    },
  },
  filters: {
    handleTime (val) {
      let day = new Date(val * 1000);
      let year = day.getFullYear();
      let month = 10 > day.getMonth() + 1 ? `0${day.getMonth() + 1}` : day.getMonth() + 1;
      let date = 10 > day.getDate() ? `0${day.getDate()}` : day.getDate();
      let hours = 10 > day.getHours() ? `0${day.getHours()}` : day.getHours();
      let minutes = 10 > day.getMinutes() ? `0${day.getMinutes()}` : day.getMinutes();
      return `${year}-${month}-${date} ${hours}:${minutes}`;
    },
  },
};