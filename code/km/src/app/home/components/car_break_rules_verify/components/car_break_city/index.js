import './index.scss';

import _                from 'lodash';
import Header           from '~common/components/header';
import Models           from '~common/models';

export default {
  name: 'cityList',
  props: {
    point: {
      type: Boolean,
      default: true,
    },
    remark: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formTemp: {
        provinceAddress: [],
        cityAddress: [],
      },
    };
  },
  computed: {
    isShow () {
      if (true === _.get(this.$store.get.state, 'CarBreakRuleCity.isShowCityList')) {
        if ('province' === this.remark && _.isEmpty(this.formTemp.provinceAddress) ) {
          this.getProvince();
        }
        else if ('city' === this.remark) {
          this.getCity();
        }
      }

      return _.get(this.$store.get.state, 'CarBreakRuleCity.isShowCityList') || false;
    },
    cityId () {
      return _.get(this.$store.get.state, 'CarBreakRuleCity.provinceData.pid');
    }
  },
  mounted () {
    this.getProvince();
  },
  watch: {
    isShow (val) {
      if (val) {
        this.$nextTick( () => {
          this.$refs.myCityScroller.scrollTo(0, 0);
        });
      }
    }
  },
  components: {
    'app-header': Header,
  },
  methods: {

    // 根据ip获取定位
    // async getPoint () {
    //   let data = await Models.Home
    //   .localCity()
    //   .then(res => res);

    //   if (1 === data.code) {
    //     this.pointData = _.assign({}, this.pointData, data.data);
    //     this.formData = _.assign({}, this.formData, {
    //       prov: {
    //         region_id   : _.get(this.pointData, 'province_id'),
    //         region_name : _.get(this.pointData, 'province'),
    //       },
    //       city: {
    //         region_id   : _.get(this.pointData, 'city_id'),
    //         region_name : _.get(this.pointData, 'city'),
    //       }
    //     });

    //     this.$store.get.dispatch({
    //       type: 'cityListData',
    //       data: this.formData,
    //       isShow: false,
    //     });
    //   }

    // },

    // 请求省接口
    getProvince () {
      let self = this;
      Models.CarBreak.provinceList()
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.provinceAddress = res.data;
        }
      });
    },
    //请求城市接口
    getCity () {
      let self = this;
      let data = {
        pid: this.cityId
      };
      Models.CarBreak.cityList(data)
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.cityAddress = res.data;
        }
      });
    },

    closeCityList () {
      this.$store.get.commit('saveIsShowCityList', {
        isShowCityList: false
      });
    },

    // 保存省到Vuex
    handleProvinceSubmit (item) {
      this.$store.get.commit('saveProvinceData', {
        provinceData: item
      });
      this.$store.get.commit('resetCityData');
      this.$store.get.commit('saveIsShowCityList', {
        isShowCityList: false
      });
    },

    // 保存城市到Vuex
    handleCitySubmit (item) {
      this.$store.get.commit('saveCityData', {
        cityData: item
      });
      this.$store.get.commit('saveIsShowCityList', {
        isShowCityList: false
      });
    }

  }
};