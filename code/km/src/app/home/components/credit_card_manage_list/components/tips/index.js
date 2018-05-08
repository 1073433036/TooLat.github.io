import './index.scss';
import 'swiper/dist/css/swiper.css';

import Models       from '~common/models';
import Swiper       from 'swiper';

export default {
  name: 'tips',
  props: {
    bankId: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      isShow                         : false,
      list                           : [],
      swiper                         : '',
      swiperOption: {
        direction : 'vertical',
        autoplay: 2000,
        loop: true,
        height: 25,
        autoplayDisableOnInteraction: false,
      },
      timer: '',
      index: 0,
    };
  },
  components: {
  },
  computed: {
  },
  mounted () {
    let self = this;
    self.getList(() => {
      self.initSwiper();
    });
    document.addEventListener('touchend', () => {
      clearTimeout(self.timer);
      self.timer = setTimeout(() => {
        self.index++;
        if (3 === self.index && 2 < ~~(Math.random() * 4 + 1) ? true : false) {
          self.isShow = true;
          self.initSwiper();
          setTimeout(() => {
            self.isShow = false;
          }, 4000);
        }
      }, 300);
    });
  },
  watch: {
  },
  methods: {

    initSwiper () {
      let self = this;
      self.$nextTick(() => {
        self.swiper = Swiper(self.$refs.mySwiper, self.swiperOption);
      });
    },

    /*
     * 办卡成功提示
     */
    getList (callback) {
      let self = this;
      Models.Credit
      .successInfo({
        params: {
          id: self.bankId,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.list = res.data;
          if (callback && 'function' === typeof callback) {
            callback();
          }
        }
      });
    },

  },
};