import './index.scss';
import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';
import Footing      from '~common/components/page_footing';
import 'swiper/dist/css/swiper.min.css';
import Swiper       from 'swiper';

export default {
  name: 'carBreakRules',
  data () {
    return {
      carTxt: [],
      carTxtIndex: 0,
      carTxtShow : false,
      isPhoneBundle: false,
      isShowTipsWrapper: false,
      isDialogShow: false,
      identityShow: false,
      codeShow: false,
      isVinShow: false,
      startPageY: 0,
      endPageY: 0,
      swiper: '',
      carCode: '',
      location: '',
      carList: [],
    };
  },
  components: {
    'app-header': Header,
    'app-footing': Footing,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    this.getMyCar();
    if ( this.device.is('WeChat') ) {
      this.requestWechatAuthorization();
    }
    this.getCarProvinces();
  },
  watch: {
    userInfo (value) {
      if (_.isEmpty(value.mobile)) {
        this.handleCheckRealName();
      }
    }
  },
  methods: {
     async getCarProvinces () {
      let res = await Models.CarVio.getCarProvinces();
      if (res.code === 1) {
        this.carTxt = res.data;
      }
    },
    carTxtItem (index) {
      this.carTxtIndex = index;
      this.carTxtShow = false;
    },
    btnCarTxtShow () {
      this.carTxtShow = true;
    },
    closeDialog () {
      this.identityShow = false;
      this.isVinShow = false;
      this.isDialogShow = false;
    },
    identityDialog () {
      this.identityShow = true;
      this.isDialogShow = true;
    },
    complete () {
      this.carCode = this.$refs.carCode.value;
      this.location = this.$refs.location.innerText.slice(0, 1);
       if (!this.carCode) {
        this.$toast('请输入车牌号');
        // return;
      }
      else {
        this.$router.push({
          name: 'home.IDVerifyHome',
          query: { carCode: this.location + this.carCode }
        });
      }
    },
    // 获取我的车辆
    async getMyCar () {
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let res = await Models.CarVio.getMyCar();
      if (res.code === 1) {
        this.carList = res.data;

        this.$nextTick(() => {
          /* eslint-disable */
          let swiper = new Swiper(this.$refs.homeSwiper, {
            notNextTick: true,
            grabCursor : true,
            paginationClickable :true,
            mousewheelControl : false,
            observer:true,
            observeParents:true,
          });
          /* eslint-enable */
        });

        if (this.carList.length) {
          this.$nextTick(() => {
            /* eslint-disable */
            let swiper = new Swiper(this.$refs.homeSwiper, {
              notNextTick: true,
              grabCursor : true,
              paginationClickable :true,
              mousewheelControl : false,
              observer:true,
              observeParents:true,
            });
            /* eslint-enable */
          });
          /* eslint-disable */
        }

        for (let el of this.carList) {
          this.getCarViolation(el);
        }

        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
      }
      else {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        this.$toast('车辆信息获取失败');
      }
    },

    // 获取车辆违章信息
    getCarViolation (el) {
      Models.CarVio.violationInformation({
        params: { id: el.id }
      })
      .then(res => {
        if (res.code === 1) {
          this.$set(el, 'violation', res.data);
        }
        else {
          this.$set(el, 'violation', {});
        }
      });
    },


    // getCarBreakMessage () {
    //   let url = '/car_vio_v3/car/query_violation?id=1515';
    //   this.$http.get(url).then( res => {
    //     console.log(res);
    //   });
    // },
    goHome () {
      this.$router.push({
        name:'home.Home'
      });
    },
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
    // 车辆详情页
    goDetailPage (id) {
      this.$router.push({ name: 'home.CarBreakDetail', params: { cid: id } });
    },
    goMyCarPage () {
      this.$router.push({name: 'home.MyCarInfo'});
    },
    goAddCarPage () {
      this.$router.push({name: 'home.AddCar'});
    },
    goMyOrderrPage () {
      this.$router.push({name: 'home.MySelfOrader'});
    },
    goHomePage () {
      this.$router.push({name: 'home.Home'});
    },
    cancel () {
      this.isShowTipsWrapper = false;
    },
    goBundlePhonePage () {
      this.$router.push({name: 'user.Profile'});
    },

    // 修改 + 3
    handleCheckRealName () {
      let self = this;
      if ('home.CarBreakRules' === self.$route.name) {
        document.addEventListener('touchstart', function (event) {
          self.touchstart(event);
        }, true);

        document.addEventListener('touchend', function (event) {
          self.touchend(event);
        }, true);
      }
    },

    // touchstart事件函数
    touchstart (event) {
      if (event) {
        let self = this;
        let isStart = false;
        if (false === isStart) {
          isStart = true;
          setTimeout(() => {
            self.startPageY = event.touches[0].pageY;
            isStart = false;
          }, 500);
        }
      }
    },

    // touchend事件函数
    touchend (event) {
      if (event) {
        let self    = this;
        let target  = event.target;
        let isEnd   = false;

        if (event && event.preventDefault &&
          'home.CarBreakRules' === self.$route.name &&
          -1 === target.className.indexOf('cancel') &&
          -1 === target.className.indexOf('bundle') &&
          -1 === target.className.indexOf('header-back') &&
          -1 === target.className.indexOf('utility-home') &&
          -1 === target.className.indexOf('top-img')) {

          event.preventDefault();

          if (false === isEnd) {
            isEnd = true;
            setTimeout(() => {
              self.endPageY = event.changedTouches[0].pageY;
              if (10 >= Math.abs(self.endPageY - self.startPageY)) {
                self.handleWrapper();
              }
              isEnd = false;
            }, 500);
          }
        }
      }
    },

    handleWrapper () {
      this.isShowTipsWrapper = true;
    },
  }
};
