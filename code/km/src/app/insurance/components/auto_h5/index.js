import './index.scss';
import 'swiper/dist/css/swiper.css';

import Swiper       from 'swiper';
import Radio        from '~common/components/radio';
import localStorage from '~common/services/localStorage.cookie';

export default {
  name: 'auto-h5',
  data () {
    return {
      swiper: '',
      swiperOption: {
        direction: 'vertical',
        autoHeight: true
      },

      formData: {
        read: 0
      },
      formTemp: {
        read: [
          {
            name: '已阅读 点击进入车险',
            value: 0
          }
        ]
      },
      isRead: false,
    };
  },
  components: {
    Radio
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
    handleRead () {
      let read = localStorage.get('isRead');
      if (true !== read.data) {
        localStorage.set('isRead', true);
      }

      this.$router.push({
        name: 'insurance.Home'
      });

    }
  }
};