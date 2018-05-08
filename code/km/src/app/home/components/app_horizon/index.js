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
  }
};