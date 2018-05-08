import './index.scss';

import _      from 'lodash';
import Header from '~common/components/header';
import Models from '~common/models';

export default {
  name: 'cityList',
  props: {
    point: {
      type: Boolean,
      default: true,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      cityId: 0,
      parentIndex: 1,
      loading: false,
      formData: {
        prov: {},
        city: {},
        data: '',
      },
      formTemp: {
        address : [],
        lastData: [],
      },
      formIndex: 'prov',
      pointData: {
        province    : '',
        province_id : '',
        city        : '',
        city_id     : ''
      },
    };
  },
  created () {
    if (this.point) {
      // this.getPoint();
    }
  },
  computed: {
  },
  mounted () {
  },
  watch: {
    parentIndex (value) {
      switch (value) {
        case 1:
          this.formIndex      = 'prov';
          this.formData.city  = {};
        break;
        case 2:
          this.formIndex      = 'city';
        break;
      }
    },

    isShow (value) {
      if (true === value && _.isEmpty(this.formTemp.address) && _.isEmpty(this.formTemp.lastData)) {
        this.getAgreementAreas();
      }

      return value || false;
    },
  },
  components: {
    'app-header': Header,
  },
  methods: {

    // 根据ip获取定位
    async getPoint () {
      let data = await Models.Home
      .localCity()
      .then(res => res);

      if (1 === data.code) {
        this.pointData = _.assign({}, this.pointData, data.data);
        this.formData = _.assign({}, this.formData, {
          prov: {
            region_id   : _.get(this.pointData, 'province_id'),
            region_name : _.get(this.pointData, 'province'),
          },
          city: {
            region_id   : _.get(this.pointData, 'city_id'),
            region_name : _.get(this.pointData, 'city'),
          }
        });

        this.$store.get.dispatch({
          type: 'cityListData',
          data: this.formData,
          isShow: false,
        });
      }

    },

    // 获取投保地区
    getAgreementAreas () {
      this.$store.get.dispatch({
        type: 'Loading',
        Text: '获取投保地区...',
        isShow: true
      });

      Models.Insurance
      .getAgreementAreas()
      .then((res) => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          let data = res.data;
          _.each(data, (item) => {
            item.active = false;
          });

          this.formTemp.address   = data;
          this.formTemp.lastData  = data;
        }
        else {
          this.$toast(res.msg);
        }
      });

    },

    // Tab切换
    handleParent (index) {
      this.parentIndex  = index;
      if (1 === index * 1) {
        this.formData.prov    = {};
        this.formTemp.address = this.formTemp.lastData;
      }
    },

    // 城市选择
    handleSelect (item) {
      _.each(this.formTemp.address, (el) => {
        el.active = false;
      });
      item.active = true;

      if (_.isArray(item.citys) && 0 < item.citys.length) {
        this.formTemp.address = item.citys;
      }
      this.formData[this.formIndex] = item;
      if (2 > this.parentIndex) {
        this.parentIndex ++;
      }
      else {
        this.handleSubmit();
      }
    },

    // 保存到Vuex
    handleSubmit () {
      let data = `${_.get(this.formData, 'prov.name') || ''}${_.get(this.formData, 'city.name') || ''}`;
      let number = {
        prov: _.get(this.formData, 'prov.id'),
        city: _.get(this.formData, 'city.id'),
      };
      this.$emit('onCityClick', {
        status : false,
        content: data,
        number : number,
      });
    }
  }
};