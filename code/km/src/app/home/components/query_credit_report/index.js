import './index.scss';
// import Echarts        from 'echarts';
import Header               from '~common/components/header';
// import Models               from '~common/models';

export default {
  name: 'report',
  data () {
    return {
      isShow: true,
      loanInfo:{
        total:'',
        text:''
      },
      hdTitle:'信贷全流程报告',
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
  },
  mounted () {
  },
  watch: {},
  methods: {
  }
};
