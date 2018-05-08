import './index.scss';

import _                from 'lodash';
import Header   				from '~common/components/header';
import Models           from '~common/models';
import Selecter         from '~common/components/selecter';
import Swiper           from 'swiper';

export default {
  name: 'WechatCreditCardSign',
  data () {
    return {
      loading         : false,
      active          : false,
      isShow          : false,
      /*
       * @param name string 姓名
       * @param phone int 电话
       * @param company string 机构名称
       * @param card_num int 月考核下卡张数
       * @param total_card int 月考核激活卡张数
       * @param settle_mode string 佣金结算方式
       * @param province string 省份名称
       * @param province_id int 省份id
       * @param city string 城市名称
       * @param city_id string 城市id
       */
			formData:{
        name          : '',
        phone         : '',
        company       : '',
        card_num      : '',
        total_card    : '',
        settle_mode   : '',
        province      : '',
        province_id   : '',
        city          : '',
        city_id       : '',
			},
      formTemp: {
        address       : '',
      },
      formIndex       : '',
      swiper          : '',
      swiperOption: {
        scrollbar: this.$refs.scrollbar,
        direction: 'vertical',
        slidesPerView: 'auto',
        mousewheelControl: true,
        freeMode: true,
        nested: true,
      },
		};
	},
  components: {
		'app-header': Header,
    Selecter,
	},
	computed: {
	},
	mounted () {
    let self = this;
    this.$nextTick(() => {
      self.swiper = new Swiper(self.$refs.mySwiper, self.swiperOption);
    });
	},
	watch: {
    formData: {
      deep: true,
      handler () {
        this.handlePassChange();
      }
    },
  },
  methods: {

    /*
     * 监控表单是否为空
     */
    handlePassChange () {
      if (!_.isEmpty(this.formData.name) && !_.isEmpty(this.formData.phone) && !_.isEmpty(this.formData.company) && !_.isEmpty(this.formData.card_num) && !_.isEmpty(this.formData.total_card) && !_.isEmpty(this.formData.settle_mode)) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    },

    /*
     * 提交
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

      if (!self.formData.province && !self.formData.province_id) {
        self.$toast('请选择省份');
        return;
      }

      if (!self.formData.city && !self.formData.city_id) {
        self.$toast('请选择城市');
        return;
      }

      self.loading = true;

      Models.Public
      .creditCard(self.formData)
      .then((res) => {
        self.$toast(res.msg);
        if (1 === res.code) {
          setTimeout(() => {
            self.$router.push({
              name: 'home.Home'
            });
          }, 2000);
        }
        else {
          self.loading = false;
        }
      })
      .catch(() => {
        self.loading = false;
      });
    },

    /*
     * 请求地址接口
     */
    getRegion (id) {
      let self = this;
      Models.Region
      .get(id)
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.address = res.data;
        }
      });
    },

    /*
     * 显示选择省份城市
     */
    handleChangeAddress (index) {
      let self = this;
      if ('prov' === index) {
        this.getRegion(0);
      }
      else {
        if (!self.formData.province) {
          self.$toast('请先选择省份');
          return;
        }
      }
      this.formIndex = index;
      this.isShow = true;
    },

    /*
     * 选择省份城市
     */
    handelClick (item) {
      let self = this;
      self.dismiss();
      if ('prov' === this.formIndex) {
        self.getRegion(item.region_id);
        self.formData.province    = item.region_name;
        self.formData.province_id = item.region_id;
        self.formData.city        = '';
        self.formData.city_id     = '';
      }
      else {
        self.formData.city = item.region_name;
        self.formData.city_id = item.region_id;
      }
    },

    /*
     * 销毁窗口
     */
    dismiss () {
      this.isShow = false;
    },

  },
};