import './index.scss';

// import _        from 'lodash';
import Header   from '~common/components/header';

export default {
  name: 'carSearch',
  data () {
    return {
      carSearchList: [
        {
          carName: '丰田GTM7161GB桥车',
          type: '主动档',
          seatNum: '5座',
          date: '2008年06月',
          money: '800000.00'
        },
        {
          carName: '丰田GTM7161GB桥车',
          type: '主动档',
          seatNum: '5座',
          date: '2008年06月',
          money: '800000.00'
        },
        {
          carName: '丰田GTM7161GB桥车',
          type: '主动档',
          seatNum: '5座',
          date: '2008年06月',
          money: '800000.00'
        }
      ],
      search: '',
      isShowTips: false,
      isShowResult: true,
      isShowNoneTips: false
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

  },
  methods: {
    handleSearch () {
      this.isShowTips = false;
      this.isShowNoneTips = true;
    }
  }
};