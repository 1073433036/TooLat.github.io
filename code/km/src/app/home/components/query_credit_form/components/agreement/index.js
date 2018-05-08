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