import './index.scss';


import Header   from '~common/components/header';

export default {
  name: 'carInsuranceSuccessList',
  data () {
    return {
      companyList: [
        {
          name: '平安保险',
          money: '2006.00'
        },
        {
          name: '平安保险',
          money: '2006.00'
        }
      ],
      isShowFilterPage: false,
      checkedNum: 0
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
  },
  watch: {
    isShowFilterPage () {
      if (this.isShowFilterPage) {
        this.checkedNum = 0;
      }
    }
  },
  methods: {
    controlFilterPage () {
      this.isShowFilterPage = !this.isShowFilterPage;
    },
    hanldFilter (value) {
      this.checkedNum = value;
      this.isShowFilterPage = false;
    }
  }
};