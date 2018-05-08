import './index.scss';


export default {
  name: 'botSelect',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '车牌号前缀'
    },
    formData : {
      type: Array,
      default: []
    },
    formIndex: {},
  },
  data () {
    return {
      checkedItem: '',
      activeIndex: ''
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
    handleItemChange (item, index) {
      this.activeIndex = index;
      this.checkedItem = item;
    },

    // 取消
    dismiss () {
      this.$emit('dismissEvent');
    },

    // 完成
    submit () {
      this.$emit('chenkedItemEvent', this.checkedItem);
    }

  }
};