import './index.scss';


export default {
  name: 'bombBox',
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
      formTemp: {
        select: this.formIndex,
      },
      lastData: {},
      beforeIndex: '',
    };
  },
  mounted () {
  },

  computed: {
  },
  watch: {

  },

  components: {

  },
  methods: {

    // 选择
    handleItemChange (item) {
      // if (item === this.formTemp) {
      //   this.formTemp = {};
      //   return;
      // }
      this.formTemp = item;
      this.beforeIndex = this.formIndex;
      this.submit();
    },

    // 取消
    dismiss () {
      this.$emit('bombClick', {
        status : false,
      });
    },

    // 完成
    submit () {
      this.$emit('bombClick', {
        status : false,
        content: this.formTemp
      });
    }

  }
};