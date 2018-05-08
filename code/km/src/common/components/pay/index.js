import './index.scss';


export default {
  name: 'Pay',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: '',
    formData : {},
    formIndex: {},
  },
  data () {
    return {
      active: false,
      formTemp: {
        select: this.formIndex,
      }
    };
  },
  mounted () {
  },
  filters: {
  },
  computed: {
  },

  components: {

  },
  methods: {

    // 选择
    handleItemChange (item) {
      this.active = true;
      if (item === this.formTemp) {
        this.formTemp = {};
        return;
      }
      this.formTemp = item;
    },

    // 取消
    dismiss () {
      this.$emit('payTypeClick', {
        status : false
      });
    },

    // 完成
    submit () {
      this.$emit('payTypeClick', {
        status : false,
        content: this.formTemp
      });
    }

  }
};