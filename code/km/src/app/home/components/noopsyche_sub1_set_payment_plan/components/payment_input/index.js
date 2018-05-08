import './index.scss';


export default {
  name: 'PaymentInput',
  data () {
    return {
      password: [],
      passIndex: 0,
      payOpacity:false,
      payloader:false,
      payEntry:true
    };
  },
  props: {
    paymentType: {
      default: '我要精养',
      type: String
    },
    money: {
      default: '$5000',
      type: String
    },
    serviceCharge: {
      default: '$3.2',
      type: String
    },
    payShow: {
        default:false,
        type:Boolean
    },
    // 支付状态
    payStatus: {
        default: true,
        type:Boolean
    },
    // 支付标题
    payTitle: {
        default: '请输入支付密码',
        type: String
    },
    payLoad: {
        default: true,
        type: Boolean
    }
  },
  components: {
  },
  computed: {
  },
  mounted () {
    setTimeout(function (vue) {
        vue.payOpacity = true;
    }, 20, this);
  },
  watch: {},
  methods: {
    payEnd:function () {
      setTimeout(function (vue) {
          vue.payloader = true;
      }, 100, this);

      // 关闭窗口
      setTimeout(function (vue) {
          vue.payClose();
      }, 1500, this);
  },
  // 点击键盘添加颜色
  keytouchStart: function (ev) {
      // console.log(this.payData)
      ev.target.style.background = '#eff6ff';
  },
  // 放开还原
  keytouchEnd: function (ev, value) {
      ev.target.style.background = '#fff';
      this.fillValue(value);
  },
  // 给密码框添加值
  fillValue: function (value) {
      if ('complete' === value) {
        if (this.password.length === 6) {
            this.submitFn(this.password);
        }
        else {
            return false;
        }
      }
      // 输入点击值
      'delete' === value ? this.password.pop() : this.password.length < 6 ? this.password.push(value) : '';
  },
  // 提交
  submitFn: function (value) {
      this.payEntry = false;
      this.$emit('paySubmit', value.join(''));
  },
  // 关闭弹出框
  payClose: function () {
      // 打开输入框
      this.payEntry = true;
      this.payloader = false;
      this.$emit('payClose');

      this.password = [];
  }
  }
};