import './index.scss';
import 'swiper/dist/css/swiper.css';

import Swiper       from 'swiper';

export default {
  name: 'bombBox',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    formData: {}
  },
  data () {
    return {
      swiperHours: '',
      swiperOptionHours: {
        direction: 'vertical',
        pagination: {
          clickable: true,
        },
      },
      swiperMinutes: '',
      swiperOptionMinutes: {
        direction: 'vertical',
        pagination: {
          clickable: true,
        },
      },
      swiperSeconds: '',
      swiperOptionSeconds: {
        direction: 'vertical',
        pagination: {
          clickable: true,
        },
      },
    };
  },
  mounted () {
    this.init();
  },
  computed: {
  },
  watch: {
    show (value) {
      if (value) {
        if (this.formData) {
          this.$nextTick(() => {
            this.handleDefaultTime();
          });
        }
        this.swiperHours.update();
        this.swiperMinutes.update();
        this.swiperSeconds.update();
      }
    },
  },
  components: {
  },
  methods: {

    // 初始化swiper
    init () {
      this.$nextTick(() => {
        this.swiperHours = new Swiper(this.$refs.mySwiperHours, this.swiperOptionHours);
        this.swiperMinutes = new Swiper(this.$refs.mySwiperMinutes, this.swiperOptionMinutes);
        this.swiperSeconds = new Swiper(this.$refs.mySwiperSeconds, this.swiperOptionSeconds);
      });
    },

    // 取消
    dismiss () {
      this.$emit('setTimeClick', {
        status : false,
      });
    },

    // 完成
    submit () {
      let hours = 10 > this.swiperHours.activeIndex ? '0' + this.swiperHours.activeIndex : '' + this.swiperHours.activeIndex;
      let minutes = 10 > this.swiperMinutes.activeIndex ? '0' + this.swiperMinutes.activeIndex : '' + this.swiperMinutes.activeIndex;
      let seconds = 10 > this.swiperSeconds.activeIndex ? '0' + this.swiperSeconds.activeIndex : '' + this.swiperSeconds.activeIndex;
      this.$emit('setTimeClick', {
        status : false,
        content: hours + ':' + minutes + ':' + seconds,
      });
    },

    handleDefaultTime () {
      let list = this.formData.split(':');
      this.swiperHours.slideTo(list[0] * 1);
      this.swiperMinutes.slideTo(list[1] * 1);
      this.swiperSeconds.slideTo(list[2] * 1);
    },

  }
};