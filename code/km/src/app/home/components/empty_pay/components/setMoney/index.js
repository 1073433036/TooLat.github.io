import './index.scss';

export default {
  name: 'setMoney',
  props: {
    value: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      visible    : false,
      money      : '',
    };
  },
  components: {
  },
  computed: {
    inputFlag () {
      return this.money ? true : false;
    },
  },
  mounted () {
    if (this.value) {
      this.visible = true;
    }
  },
  watch: {
    value (val) {
      let self = this;
      this.visible = val;
      let timer = setTimeout(function () {
        self.$refs.money.focus();
        clearTimeout(timer);
      }, 100);
    },
    visible (val) {
      this.$emit('input', val);
    },
  },
  methods: {
    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
    },
    /*
     * 确认金额
     */
    submit () {
      this.$emit('submit', this.money);
      this.visible = false;
      this.money = this.handleMoneyNumber(this.money);
      this.$store.get.commit('savePayMoney', {
        money: this.money
      });
      this.money = '';
    },
    handleMoneyNumber (value) {
      let num = Number(value);
      return num.toFixed(2);
    }
  }
};