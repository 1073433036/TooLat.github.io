import './index.scss';

export default {
  name: 'checkbox',
  props: {
    value: {
      type: Boolean,
      default: true,
    }
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
  components: {

  },
  watch: {
    currentValue (value) {
      this.$emit('input', value);
    },
    value (val) {
      this.currentValue = val;
    },
  },
  methods: {
    change (event) {
      const checked = event.target.checked;
      this.currentValue = checked;

      let value = checked ? true : false;
      this.$emit('input', value);
    }

  }
};