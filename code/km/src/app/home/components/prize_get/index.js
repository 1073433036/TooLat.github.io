import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Models     from '~common/models';
import CityList   from '~common/components/city_list';

export default {
  name: 'PrizeGet',
  data () {
    return {
      loading: false,
      active: false,
      formData: {
        name: '',
        phone: '',
        address: '',
      },
      formTemp: {
        goods: '',
      },
    };
  },
  components: {
    'app-header': Header,
    CityList,
  },
  computed: {

    goodsId () {
      return this.$route.params.id;
    },

    prov () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    city () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    area () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
    },

    region () {
      return _.get(this.prov, 'region_name') + _.get(this.city, 'region_name') + _.get(this.area, 'region_name');
    },
  },
  mounted () {
    this.integralGoodsInfo();
  },
  watch: {
    formData: {
      deep: true,
      handler () {
        this.handleIsempty();
      },
    },
  },
  methods: {

    /*
     * 监控表单是否为空
     */
    handleIsempty () {
      if (!_.isEmpty(this.formData.name) && !_.isEmpty(this.formData.phone) && !_.isEmpty(this.formData.address) && !_.isEmpty(this.region)) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    },

    /*
     * 自定义筛选城市切换
     */
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    /*
     * 提交表单
     */
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      if (true === self.loading) {
        self.$toast('正在为您提交');
        return;
      }
      self.loading = true;

      /*
       * @param id 商品ID，必须
       * @param name 收货人，必须
       * @param mobile 收货人手机，必须
       * @param address 收货人地址，必须
       * @param number 兑换数量 ，如没有传默认为 1
       */

      let data = {
        id: self.goodsId,
        name: self.formData.name,
        mobile: self.formData.phone,
        address: self.region + self.formData.address,
      };

      Models.User
      .luckyReceive(data)
      .then((res) => {
        if (1 === res.code) {
          self.$toast('领取成功');
          setTimeout(() => {
            self.$router.push({ name: 'home.SpoilGet' });
          }, 2000);
        }
        else {
          self.$toast(res.msg);
          self.loading = false;
        }
      })
      .catch(() => {
        self.loading = false;
      });
    },

    /*
     * 获取奖品信息
     */
    integralGoodsInfo () {
      let self = this;
      Models.User
      .luckyLogInfo({
        params: {
          id: self.goodsId
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.goods = res.data;
        }
      });
    },

    /*submit () {
      if (this.name && this.relation && this.site) {
        this.$router.push({ name: 'home.SpoilGet' });
      }
    }*/
  },
};