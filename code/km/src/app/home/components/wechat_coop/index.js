import './index.scss';

import _          from 'lodash';
import Swiper     from 'swiper';
import Radio      from '~common/components/radio';
import Models     from '~common/models';
import Selecter   from '~common/components/selecter';
import Cropper    from '~common/components/cropper';

export default {
  name: 'wechat-coop',
  data () {
    return {
      loading: false,
      active: false,
      swiper: '',
      swiperOption: {
        direction: 'vertical',
        autoHeight: true,
      },
      formData: {
        name: '',
        phone: '',
        business: '',
        reason: '',
        province: '',
        province_id: '',
        city: '',
        city_id: '',
        has_office: 0,
        office_image: '',
        has_license: 0,
      },
      formTemp: {
        address: '',
        has_office: [
          {
            name: '是',
            value: 1,
          },
          {
            name: '否',
            value: 0,
          }
        ],
        has_license: [
          {
            name: '是',
            value: 1,
          },
          {
            name: '否',
            value: 0,
          }
        ],
      },
      /*
       * 地址
       */
      isShow: false,
      formIndex: '',
      currentFile: '',
    };
  },
  components: {
    Radio,
    Selecter,
    Cropper,
  },
  computed: {
    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },
  },
  mounted () {
    let self = this;
    this.$nextTick(() => {
      self.swiper = new Swiper(self.$refs.mySwiper, self.swiperOption);
      /* eslint-disable */
      let startScroll, touchStart, touchCurrent;
      self.swiper.slides.on('touchstart', function (e) {
        startScroll = this.scrollTop;
        touchStart = e.targetTouches[0].pageY;
      }, true);
      self.swiper.slides.on('touchmove', function (e) {
        touchCurrent = e.targetTouches[0].pageY;
        let touchesDiff = touchCurrent - touchStart;
        let slide = this;
        let onlyScrolling =
          ( slide.scrollHeight > slide.offsetHeight ) &&
          (
              ( touchesDiff < 0 && startScroll === 0 ) ||
              ( touchesDiff > 0 && startScroll === ( slide.scrollHeight - slide.offsetHeight ) ) ||
              ( startScroll > 0 && startScroll < ( slide.scrollHeight - slide.offsetHeight ) )
          );
        self.swiper.update();
        if (onlyScrolling) {
          e.stopPropagation();
        }
      }, true);
      /* eslint-enable */
    });
  },
  watch: {
    uploadImage (val) {

      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
        if ('file' === this.currentFile) {
          this.formData.office_image = val.preview;
        }
      }
    },
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
      if (!_.isEmpty(this.formData.name) && !_.isEmpty(this.formData.phone) && !_.isEmpty(this.formData.business) && !_.isEmpty(this.formData.reason)) {
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
      .partner(self.formData)
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
     * 图片上传组件
     */
    setImage (e, el) {
      if (!_.isEmpty(e)) {
        this.currentFile = el;
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
          data: {
            file: file
          }
        });
      }
    },

    /*
     * 销毁窗口
     */
    dismiss () {
      this.isShow = false;
    },

    /*
     * 重置input file值
     */
    fileClose () {
      this.$refs[this.currentFile].value = '';
    },

  }
};