import './index.scss';



export default {
  name: 'rate_choice',
  data () {
    return {
      formData: {
        rateChoice: '',
        radio: 'basic',
        customDiscount: ''
      },
    };
  },
  components: {

  },
  computed: {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    sendRateChoice (value) {
      this.$emit('sendRateChoiceEvent', value);
    },
    handleRadioChoose (event) {
      let el = event.currentTarget;
      let allI = [...document.querySelectorAll('.sp-active')];
      allI.forEach((item) => {
        item.setAttribute('class', 'sp');
      });
      el.querySelector('.radio-input').checked = true;
      el.querySelector('.sp').setAttribute('class', 'sp sp-active');
    }
  }
};