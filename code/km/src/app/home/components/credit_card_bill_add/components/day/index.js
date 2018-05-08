import './index.scss';

export default {
  name: 'day',
  data () {
    return {
      today: '',
    };
  },
  props: {
    isOpen: {
      default: false
    },
    select: {
      required: true,
    }
  },
  components: {
  },
  computed: {
  },
  mounted () {
    let myDate = new Date();
    this.today = myDate.getDate();
  },
  watch: {
  },
  methods: {
    handleClose (tye = '') {
      let data = {
        status: false,
      };
      if (tye) {
        data.content = {
          [this.select.key]: `${this.today}号`
        };
      }
      this.$emit('changeDay', data);
    },
  }
};