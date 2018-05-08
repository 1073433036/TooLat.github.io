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
    showAllCity: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      cityId: 0,
      parentIndex: 1,
      loading: false,
      formData: {
        prov: {
        },
        city: {
        },
        area: {
        },
      },
      formTemp: {
        address: [],
      },
      formIndex: 'prov',
      pointData: {
        province    : '',
        province_id: '',
        city        : '',
        city_id     : ''
      },
    };
  },
  created () {
    if (this.point && !this.showAllCity) {
      this.getPoint();
    }
  },
  computed: {
    isShow () {
      if (true === _.get(this.$store.get.state, 'CityList.content.isShow')) {
        this.getRegion();
      }

      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },
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
          this.formData.area  = {};
        break;
        case 3:
          this.formIndex = 'area';
        break;
      }
    }
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
        // console.log(this.pointData);
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

    // 请求接口
    getRegion () {
      let self = this;

      Models.Region
      .get(self.cityId)
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.address = res.data;

          if ('prov' === self.formIndex) {
            if (this.showAllCity) {
              self.formTemp.address.unshift({
                region_id: 0,
                region_name: '全国',
              });
            }
          }

          if (false === self.loading) {
            if ('prov' === self.formIndex && _.get(self.pointData, 'province') && _.get(self.pointData, 'province_id')) {

              _.filter(self.formTemp.address, (item) => {
                if (item.region_id === _.get(self.pointData, 'province_id')) {
                  self.formData.prov  = item;

                  if (!_.isEmpty(_.get(self.pointData, 'city'))) {
                    self.cityId         = self.formData.prov.region_id;
                    self.parentIndex ++;
                  }
                }
              });
            }

            if ('city' === self.formIndex && !_.isEmpty(_.get(self.pointData, 'city'))) {
              _.filter(self.formTemp.address, (item) => {
                if (item.region_id === _.get(self.pointData, 'city_id')) {
                  self.formData.city  = item;
                  self.loading = true;
                }
              });
            }

            self.$nextTick(() => {
              setTimeout(() => {
                let el = _.get(self.$refs.myCityScroller.$el, 'children[0]');
                el = _.get(el, 'children[0]');
                if (el.querySelector('.active')) {
                  self.$refs.myCityScroller.scrollTo(0, el.querySelector('.active').offsetTop * 1 - 45, true);
                }
              }, 100);
            });
          }

        }
      });
    },

    // Tab切换
    handleParent (index) {
      this.parentIndex  = index;
      this.$nextTick(() => {
        this.cityId = 1 === index ? 0 : _.get(this.formData[this.formIndex], 'parent_id') || this.cityId;
        this.pointData = {
          province    : '',
          province_id : '',
          city        : '',
          city_id     : ''
        };
      });
    },

    // 城市选择
    handleSelect (item) {
      this.formData[this.formIndex] = item;
      if (0 === item.region_id) {
        this.handleSubmit();
      }
      else {
        if (3 > this.parentIndex) {
          this.parentIndex ++;
          this.cityId = _.get(this.formData[this.formIndex], 'region_id') || this.cityId;
        }
        else {
          this.handleSubmit();
        }
      }
    },

    // 保存到Vuex
    handleSubmit () {
      this.$store.get.dispatch({
        type: 'cityListData',
        data: this.formData,
        isShow: false,
      });
    }
  }
};