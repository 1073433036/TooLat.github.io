import './index.scss';

export default {
  name: 'tips',
  data () {
    return {
      isWechat: false,
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    formTemp: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted () {
  },
  computed: {
  },
  watch: {
    show (val) {
      this.isWechat = val;
    }
  },
  components: {
  },
  methods: {

    // 关闭弹框
    handleClose () {
      this.$emit('wechatClose', {
        status: false,
      });
    }
  }
};