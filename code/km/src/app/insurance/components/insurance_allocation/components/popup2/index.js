import './index.scss';

export default {
  name: 'popup2',
  data () {
    return {
      // isChecked: 999
    };
  },
  props: ['popupTxt'],
  mounted () {
  },
  activated () {
  },
  computed: {

  },
  components: {

  },
  methods: {
    handleClick (evnet, value) {
      // this.isChecked = value;

      this.$emit('checkedEvent', {
        value: value,
        chooseTxt: evnet.target.textContent
      });
    }
  }
};