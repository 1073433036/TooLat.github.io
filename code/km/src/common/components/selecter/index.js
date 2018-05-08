import './index.scss';

export default {
  name: 'selecter',
  data () {
    return {
    };
  },
  props: ['change'],
  mounted () {
  },
  computed: {

  },
  components: {

  },
  methods: {
    handelClose () {
      this.$emit('itemClick');
    },

    handelClick () {
      this.$emit('itemClick');
    }
  }
};