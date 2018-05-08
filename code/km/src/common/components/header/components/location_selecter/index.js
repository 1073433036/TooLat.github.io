import './index.scss';

import _        from 'lodash';
import Services from '~common/services';
import Models   from '~common/models';

export default {
  name: 'location',
  data () {
    return {
      formTemp  : {
        mainHeight: 0,
      },
      pointData : {},
      provData  : [],
      cityData  : [],
      histData  : [],
      current   : {
        prov: {},
        city: {},
      },
    };
  },
  props: ['point', 'isOpen'],
  mounted () {
    if (true === this.point) {
      this.getPoint();
    }
  },
  computed: {

  },
  components: {

  },
  watch: {
    isOpen () {
      this.$nextTick(() => {
        this.getCityData();
        this.changeMainHerght();
      });
    }
  },
  methods: {

    changeMainHerght () {
      this.formTemp.mainHeight = this.$refs.inner.offsetHeight;
    },

    getCityData (item) {
      let id = 0;
      if (_.isObject(item) && item.region_id) {
        id = item.region_id;
        this.current.prov = item;
      }

      Models.Region
      .get(id)
      .then((res) => {
        if (1 === res.code) {
          if (0 === id * 1) {
            this.provData = res.data;
          }
          else {
            this.cityData = res.data;
          }
        }
      });

    },

    // 城市选择
    handleCitySelect (item) {
      if (_.isObject(item)) {
        this.current.city = item;
        if (_.isEmpty(this.histData)) {
          this.histData.push(item);
        }
        else {
          this.histData = _.concat(this.histData, item);
        }
      }

      this.$nextTick(() => {
        this.handleClose();
        this.changeMainHerght();
      });
    },

    getPoint () {
      Services.BaiduMap.get();
    },

    // 关闭
    handleClose () {
      this.$emit('locationClick', {
        status: false,
      });
    }
  }
};