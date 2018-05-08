import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import CityList     from './components/car_break_city';
import botSelect    from './components/bot_select';
import Models       from '~common/models';

/*
@param car_prefix string 车牌号前缀（省份简称）
@param car_number string 车牌号
@param car_code string 车身架号
@param car_drive_number string 发动机号
@param city string 城市id
@param province int 省份id
@param city_name string 城市名称
@param province_name string 省份名称
*/

export default {
  name: 'addCar',
  data () {
    return {
      formData: {
        carPrefix: localStorage.getItem('carPrefix'),
        carNumber: localStorage.getItem('carNumber'),
        carCode: '',
        carDriveNumber: ''
      },
      cityRemark: '',
      isShowBotSelect: false,
      carPrefixList: [],
      requestCarPrefixCount: 0,
      isShowTransactionTips: true

    };
  },
  components: {
    'app-header': Header,
    CityList,
    botSelect
  },
  computed: {
    // province () {
    //   let data = _.get(this.$store.get.state, 'CarBreakRuleCity.provinceData');
    //   return data;
    // },
    // province_name () {
    //   let data = _.get(this.$store.get.state, 'CarBreakRuleCity.provinceData.provincename');
    //   return data || '';
    // },
    // city_name () {
    //   return _.get(this.$store.get.state, 'CarBreakRuleCity.cityData.cityname') || '';
    // },
    // provinceId () {
    //   return _.get(this.$store.get.state, 'CarBreakRuleCity.provinceData.pid') || '';
    // },
    // cityId () {
    //   return _.get(this.$store.get.state, 'CarBreakRuleCity.cityData.cid') || '';
    // },

    // watchCarCode () {
    //   return this.formData.carCode;
    // },
    // watchCarDriveNumber () {
    //   return this.formData.carDriveNumber;
    // },
    // watchCarNumber () {
    //   return this.formData.carNumber;
    // },
  },
  beforeRouteLeave (to, from, next) {
    this.$store.get.commit('saveIsShowCityList', {
      isShowCityList: false
    });
    next();
  },
  mounted () {
    // this.requestCarPrefixList();
  },
  watch: {
    watchCarCode () {
      let toUpper = this.formData.carCode.toUpperCase();
      if (toUpper !== this.formData.carCode) {
        this.formData.carCode = toUpper;
      }
    },
    watchCarDriveNumber () {
      let toUpper = this.formData.carDriveNumber.toUpperCase();
      if (toUpper !== this.formData.carDriveNumber) {
        this.formData.carDriveNumber = toUpper;
      }
    },
    watchCarNumber () {
      let toUpper = this.formData.carNumber.toUpperCase();
      if (toUpper !== this.formData.carNumber) {
        this.formData.carNumber = toUpper;
      }
    }
  },
  methods: {
    saveInquire () {
      this.getCarbreak();
    },
    getCarbreak () {
      let url = '/car_vio_v3/car/create';
      let data = {
        car_prefix: this.formData.carPrefix,
        car_number: this.formData.carNumber,
        car_code: this.formData.carCode,
        car_drive_number: this.formData.carDriveNumber,
      };
      this.$http.post(url, data).then(res=>{
        this.$toast(res.msg);
      });
    },
    goCarBreakHomePage () {
      window.history.go(-1);
    },
    submitCarData () {
      if (!this.province_name) {
        this.$toast('请选择车牌号所在省');
        return;
      }
      else if (!this.city_name) {
        this.$toast('请选择车牌号所在市');
        return;
      }
      else if (!this.formData.carNumber) {
        this.$toast('请输入车牌号码');
        return;
      }
      else if (!this.formData.carCode) {
        this.$toast('请输入车身架号');
        return;
      }
      else if (!this.formData.carDriveNumber) {
        this.$toast('请输入发动机号');
        return;
      }

      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      // let data = {
      //   car_prefix: this.formData.carPrefix,
      //   car_number: this.formData.carNumber,
      //   car_code: this.formData.carCode,
      //   car_drive_number: this.formData.carDriveNumber,
      // };
      // Models.CarBreak.addCar(data).then( res => {
      //   this.$store.get.dispatch({
      //     type: 'Loading',
      //     isShow: false
      //   });
      //   if (1 === res.code) {
      //     console.log(res);
      //     this.$toast('添加车辆成功');
      //     this.$store.get.commit('saveCarId', {
      //       carId: res.data.id
      //     });
      //     setTimeout(() => {
      //       this.$router.push({
      //         name: 'home.CarRulesQuery',
      //         query: {
      //           carId: res.data.id
      //         }
      //       });
      //     }, 500);
      //   }
      //   else {
      //     this.$toast(res.msg);
      //   }
      // });
    },
    /*
      *选择省和城市模块
     */
    showCityList (remarkStr) {
      if ('city' === remarkStr && !this.province_name) {
        this.$toast('请选择车牌所在省');
        return;
      }
      this.cityRemark = remarkStr;
      this.$store.get.commit('saveIsShowCityList', {
        isShowCityList: true,
      });
    },
    //车牌号前缀请求
    requestCarPrefixList () {
      if (2 <= this.requestCarPrefixCount) {
        return;
      }
      Models.CarBreak.carPrefixList().then( res => {
        this.requestCarPrefixCount += 1;
        if (1 === res.code) {
          this.carPrefixList = res.data;
        }
        else {
          this.requestCarPrefixList();
        }
      });
    },
    //选择车牌号前缀
    chooseCarPrefix () {
      if (_.isEmpty(this.carPrefixList)) {
        return;
      }
      this.isShowBotSelect = true;
    },
    checkedCarPrefix (item) {
      this.formData.carPrefix = item;
      this.isShowBotSelect = false;
    }
  }
};