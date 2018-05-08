import './index.scss';

export default {
  name: 'total',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    toDayList: {
      default: '',
    }
  },
  data () {
    return {
      visible    : false,
      formTemp: {
        list: [],
      },
      day: 0,
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

    toDayList (val) {
      this.formTemp.list = val;
    }
  },
  methods: {

    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },

    handleClick (value) {
      if (value !== this.day) {
        this.day = value;
        this.$emit('navTabChange', value);
      }
    }
  }
};