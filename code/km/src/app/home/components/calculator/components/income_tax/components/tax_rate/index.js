import './index.scss';


export default {
  name: 'calculateResult',
  data () {
    return {
      formData: {
        yourself: {
          provide: '',
          medical: '',
          unemployment: '',
          accumulation: ''
        },
        company: {
          provide: '',
          medical: '',
          unemployment: '',
          injury: '',
          pregnancy: '',
          accumulation: ''
        },
        taxBasic: {
          provide: '',
          medical: '',
          unemployment: '',
          injury: '',
          pregnancy: '',
          accumulation: ''
        },
        rateInput: ''
      },
      formTemp: {
        loanDeadline: []
      },
      inputTitle: '',
      isRateInputPage: false,
      isTheInput: ''

    };
  },
  props: [],
  components: {

  },
  computed: {
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    goRateInput (value) {
      this.$emit('changeOtherEvent', '输入比例');
      this.formData.rateInput = '';
      this.isTheInput = value[0];
      this.inputTitle = value[1];
      this.isRateInputPage = true;

    },
    handleSaveValue () {
      switch (this.isTheInput) {
        case 'yourself.provide':
          this.formData.yourself.provide = this.formData.rateInput;
          break;
        case 'yourself.medical':
          this.formData.yourself.medical = this.formData.rateInput;
          break;
        case 'yourself.unemployment':
          this.formData.yourself.unemployment = this.formData.rateInput;
          break;
        case 'yourself.accumulation':
          this.formData.yourself.accumulation = this.formData.rateInput;
          break;
        case 'company.provide':
          this.formData.company.provide = this.formData.rateInput;
          break;
        case 'company.medical':
          this.formData.company.medical = this.formData.rateInput;
          break;
        case 'company.unemployment':
          this.formData.company.unemployment = this.formData.rateInput;
          break;
        case 'company.injury':
          this.formData.company.injury = this.formData.rateInput;
          break;
        case 'company.pregnancy':
          this.formData.company.pregnancy = this.formData.rateInput;
          break;
        case 'company.accumulation':
          this.formData.company.accumulation = this.formData.rateInput;
          break;
      }
      this.isRateInputPage = false;
    }


  }
};