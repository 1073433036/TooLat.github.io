import './index.scss';

import Swiper         from 'swiper';

export default {
  name: 'download',
  data () {
    return {
      swiper: '',
      swiperOption: {
        direction: 'vertical',
        autoHeight: true
      },
      isDownloadTip: false,
    };
  },
  components: {
  },
  computed: {
  },
  mounted () {
    let self = this;
    self.$nextTick(() => {
      self.swiper = new Swiper(self.$refs.mySwiper, self.swiperOption);
    });
  },
  watch: {},
  methods: {
    downloadAndriod () {
      if (this.device.is('WeChat')) {
        this.isDownloadTip = true;
      }
      else {
        window.location.href = 'http://kmimage.wifizx.cc/kamengjinfu1.apk';
      }
    }
  }
};
