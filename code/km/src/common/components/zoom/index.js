import './index.scss';
import 'swiper/dist/css/swiper.css';

import Swiper       from 'swiper';

export default {
  name: 'swiper-zoom',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    image: '',
  },
  data () {
    return {
      isShow: this.value,
      swiper: '',
      swiperOption: {
        zoom: true,
      },
    };
  },
  mounted () {
  },
  computed: {
  },
  components: {
  },
  watch: {
    value (val) {
      this.isShow = val;
      if (val && this.image) {
        this.initSwiper();
      }
    },
  },
  methods: {

    /*
     * 初始化swiper
     */
    initSwiper () {
      let self = this;
      self.$nextTick(() => {
        self.swiper = new Swiper(self.$refs.zoomSwiper, self.swiperOption);
      });
    },

    /*
     * 关闭swiper
     */
    onclose () {
      this.isShow = false;
      this.$emit('input', this.isShow);
    },

  }
};