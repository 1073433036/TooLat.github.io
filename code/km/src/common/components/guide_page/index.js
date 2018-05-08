import './index.scss';

import _            from 'lodash';
import LocalStorage from '~common/services/localStorage.cookie';

export default {
  name: 'guide_page',
  props: {
    stepShow: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      isShow: false,
      stepAct: 1,
      isTouch: false,
      setTime: 1,
      handleTime: null,
    };
  },
  mounted () {
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || this.$user.get() || {};
    },
  },
  watch: {
    stepShow (val) {

      if (1 >= this.userInfo.level * 1) {

        let guideNumber = LocalStorage.get('guideNumber');
        let guide = _.get(guideNumber, 'data') || { home: 0, user: 0 };

        let setp = 'home';

        if ('user.Home' === this.$route.name) {
          setp = 'user';
        }

        if (2 > guide[setp] * 1) {
          this.isShow = val;
          this.handleTouchmove();
          LocalStorage.set('guideNumber', _.assign({}, guide, { [setp]: guide[setp] + 1 }));
        }
      }
    }
  },
  components: {

  },
  methods: {

    handleGuide () {
      // let guideNumber = LocalStorage.get('guideNumber');
      // let data = _.get(guideNumber, 'data') || 0;


    },

    handleSetInterval () {
      this.handleTime = setInterval(() => {
        this.setTime ++;
      }, 1000);
    },

    handleGuideChange () {
      let self = this;

       // || 2 < self.stepAct
      if (4 <= self.setTime) {
        clearInterval(self.handleTime);
      }

      if (1 <= self.setTime) {
        // if (2 <= self.stepAct) {
          self.isShow   = false;

          self.$store.get.dispatch({
            type: 'histData',
            data: {
              isFilter: false
            },
          });

          // return;
        // }
        // setTimeout(() => {
        //   if (false === self.isTouch)  {
        //     self.isTouch = true;
        //     let guideNumber = LocalStorage.get('guideNumber');
        //     let data = _.get(guideNumber, 'data') || 0;
        //     LocalStorage.set('guideNumber', data + 1);

        //     if (2 < self.stepAct) {
        //       self.isShow   = false;
        //       self.isTouch  = true;
        //       return;
        //     }

        //     if (1 === self.stepAct) {
        //       self.$emit('onGuideClick');
        //       this.setTime = 4;
        //     }
        //     self.stepAct ++;

        //   }
        // }, 500);

      }
    },

    // 点击事件
    handleGuideClose () {
      this.handleSetInterval();
      this.handleGuideChange();
    },

    // 滑动事件
    handleTouchmove () {
      let self = this;
      document.querySelector('.guide-close').addEventListener('touchmove', () => {
        self.handleSetInterval();
        self.handleGuideChange();
      }, false);
    }

  }
};