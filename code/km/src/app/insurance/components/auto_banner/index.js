import './index.scss';

import Swiper         from 'swiper';
import TWEEN          from '@tweenjs/tween.js';

export default {
  name: 'wechat-auto',
  data () {
    return {
      swiper: '',
      swiperOption: {
        direction: 'vertical',
        autoHeight: true
      },
      changeNum: 10000,
      animationCount: 0,
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
      self.swiper.on('transitionEnd', () =>{
        if (13 === self.swiper.activeIndex) {
          self.animatedNum();
        }
      });
    });
  },
  watch: {},
  methods: {
    animatedNum () {
      if (this.animationCount) {
        return;
      }
      let self = this;
      let objNum = {tweenNum: 10000};
      let tween = new TWEEN.Tween(objNum);
      tween.to({tweenNum: 14168}, 2500)
      .onUpdate(function () {
        self.changeNum = objNum.tweenNum.toFixed(0);
      })
      .start();
      function animate () {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
      animate();
      this.animationCount = 1;
    }
  }
};