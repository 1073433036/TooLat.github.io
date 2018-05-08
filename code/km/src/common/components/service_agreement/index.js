import './index.scss';

export default {
  name: 'service_agreement',
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
  }
};