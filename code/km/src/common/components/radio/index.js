import './index.scss';

export default {
  name: 'radio',
  props: {
    value: {},
    dataList: {
      type: Array,
    },
  },
  data () {
    return {
      currentValue: this.value,
    };
  },
  mounted () {
  },
  computed: {
  },
  watch: {
    currentValue (val) {
      this.value = val;
    },
    value (val) {
      this.currentValue = val;
    },
  },
  components: {

  },
  methods: {
    change (item) {
      this.currentValue = item.value;
      this.$emit('input', item.value);
    }

  }
};