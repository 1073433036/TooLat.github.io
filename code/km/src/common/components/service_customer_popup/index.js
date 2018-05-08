import './index.scss';
import Header           from '~common/components/header';

export default {
  name: 'ServiceCuetomerPopup',
  data () {
    return {
      isCustomer: true,
      startPageY: 0,
      isDetailPopupShow: false,
      isWechatCustomerShow: false,
    };
  },

  components: {
    'app-header': Header,
  },

  computed: {
  },

  mounted () {
    this.initAnimation();
  },

  watch: {
  },

  methods: {
    // QQ客服显示隐藏特效
    initAnimation () {
      document.addEventListener('touchstart', e => {
        this.startPageY = e.touches[0].pageY;
      }, true);

      document.addEventListener('touchmove', e => {
        let y = e.changedTouches[0].pageY;
        if (10 <  Math.abs(y - this.startPageY)) {
          this.isCustomer = false;
        }
      }, true);

      document.addEventListener('touchend', () => {
        if (!this.isCustomer) {
          this.isCustomer = true;
        }
      }, true);
    },
  },
};
