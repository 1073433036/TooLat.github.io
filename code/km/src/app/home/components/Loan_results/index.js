import './index.scss';
export default {
  name:'homeCard',
  data () {
    return {
      Allfraction:0,
    };
  },
  mounted () {
    let self = this;
    let Allfraction = parseInt(self.$route.params.Allfraction);
    self.Allfraction = Allfraction;
  },
  watch: {},
  methods: {
    tuNextpage () {
      this.swiper.slideNext();
    },
    chlick (Next, firstIndex) {
      // 测试贷款传过来的分数
      let fraction = Next.fraction;
      let swiperList = this.swiperList;
      swiperList[firstIndex].fraction = fraction;
    }
  }
};
