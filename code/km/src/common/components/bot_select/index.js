import './index.scss';


export default {
  name: 'botSelect',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isBankList: {
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
      if (item === this.formTemp) {
        this.formTemp = {};
        return;
      }
      this.formTemp = item;
    },

    // 取消
    dismiss () {
      this.$emit('onChildClick', {
        status : false,
        isBankList : false,
      });
    },

    // 完成
    submit () {
      this.$emit('onChildClick', {
        status : false,
        isBankList : false,
        content: this.formTemp
      });
    }

  }
};
