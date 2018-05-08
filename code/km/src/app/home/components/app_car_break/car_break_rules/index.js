import './index.scss';
import 'swiper/dist/css/swiper.css';

import _            from 'lodash';
import Header       from '~common/components/header';
import Swiper       from 'swiper';
import Models       from '~common/models';

export default {
  name: 'carBreakRules',
  data () {
    return {
      isPhoneBundle: false,
      isShowTipsWrapper: true
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    if ( this.device.is('WeChat') ) {
      this.requestWechatAuthorization();
    }
    this.$nextTick(function () {
      /* eslint-disable */
      let swiper = new Swiper(this.$refs.swiperRoot, {
        autoplay: 2000,
        pagination : '.swiper-pagination',
        paginationClickable :true,
        bulletActiveClass: 'car-break-bullet-active',
        loop: true
      });
      /* eslint-enable */
    });

  },
  watch: {
    userInfo (value) {
      if (!value.mobile) {
        this.isPhoneBundle = true;
      }
    }
  },
  methods: {

    //微信支付授权
    requestWechatAuthorization () {
      Models.CarBreak.wechatAuthorization().then( res => {
        this.requestCount += 1;
        if (0 === res.code) {
          if (res.data.url) {
            window.location.href = res.data.url;
          }
          else {
            if (2 > this.requestCount) {
              this.$toast('微信授权失败');
            }
          }
        }
        else {
          if (2 > this.requestCount) {
            this.requestWechatAuthorization();
          }
        }
      });
    },
    goMyCarPage () {
      this.$router.push({name: 'home.AppMyCarInfo'});
    },
    goAddCarPage () {
      this.$router.push({name: 'home.AppAddCar'});
    },
    goMyOrderrPage () {
      this.$router.push({name: 'home.AppMySelfOrader'});
    },
    goHomePage () {
      this.$router.push({name: 'home.Home'});
    },
    cancel () {
      this.isShowTipsWrapper = false;
    },
    goBundlePhonePage () {
      this.$router.push({name: 'user.Profile'});
    }
  }
};