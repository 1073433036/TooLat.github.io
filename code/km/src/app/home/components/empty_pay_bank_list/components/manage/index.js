import './index.scss';

export default {
  name: 'setMoney',
  props: {
    value: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      visible    : false,
    };
  },
  components: {
  },
  computed: {
  },
  mounted () {
    if (this.value) {
      this.visible = true;
    }
  },
  watch: {
    value (val) {
      this.visible = val;
    },
    visible (val) {
      this.$emit('input', val);
    },
  },
  methods: {
    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },
    /*
     * 确认金额
     */
    unbund () {
      this.cancel();
      this.$emit('unbund');
    },
  }
};