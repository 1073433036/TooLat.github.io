import './index.scss';

import Swiper     from 'swiper';

export default {
  name: 'wechat-auto',
  data () {
    return {
      swiper: '',
      swiperOption: {
        direction: 'vertical',
        autoHeight: true,
      },
    };
  },
  components: {
  },
  computed: {
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
        if (onlyScrolling) {
          e.stopPropagation();
        }
      }, true);
      /* eslint-enable */

    });
  },
  watch: {},
  methods: {
  }
};