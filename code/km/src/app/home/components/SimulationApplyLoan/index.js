import './index.scss';
import Swiper from 'swiper';
export default {
  name: 'homeCard',
  data () {
    return {
      swiperList: [{
        title: '你的年龄?',
        swiperPage: 1,
        ischange: false,
        options: [{
          page: 1,
          id: 1,
          Whatchoice: '18-20岁',
          fraction: 3,
        }, {
          page: 1,
          id: 2,
          Whatchoice: '21-22岁',
          fraction: 5,
        }, {
          page: 1,
          id: 3,
          Whatchoice: '23-40岁',
          fraction: 8,
        }, {
          page: 1,
          id: 4,
          Whatchoice: '40岁以上',
          fraction: 5,
        }]
      }, {
        ischange: false,
        title: '本人实名认证手机号使用时长',
        swiperPage: 2,
        options: [{
          page: 2,
          id: 1,
          Whatchoice: '3个月以内',
          fraction: 3,
          ischange: false,
        }, {
          page: 2,
          id: 2,
          Whatchoice: '3-6个月',
          fraction: 5,
          ischange: false,
        }, {
          page: 2,
          id: 3,
          Whatchoice: '6个月以上',
          fraction: 10,
          ischange: false,
        }, {
          page: 2,
          id: 4,
          Whatchoice: '未实名',
          fraction: 0,
          ischange: false,
        }]
      }, {
        title: '你的芝麻信用分有多少',
        swiperPage: 3,
        options: [{
          page: 3,
          id: 1,
          Whatchoice: '600分以下',
          fraction: 5,
        }, {
          page: 3,
          id: 2,
          Whatchoice: '600-650分',
          fraction: 7,
        }, {
          page: 3,
          id: 3,
          Whatchoice: '650-700分',
          fraction: 10,
        }, {
          page: 3,
          id: 4,
          Whatchoice: '700分以上',
          fraction: 20,
        }],
      }, {
        title: '工资发放形式?',
        swiperPage: 4,
        options: [{
          page: 4,
          id: 1,
          Whatchoice: '发现金',
          fraction: 3,
        }, {
          page: 4,
          id: 2,
          Whatchoice: '银行转账',
          fraction: 5,
        }, {
          page: 4,
          id: 3,
          Whatchoice: '银行代发',
          fraction: 10,
        }],
      }, {
        title: '你在现单位的工作年限？',
        swiperPage: 5,
        options: [{
          id: 1,
          page: 5,
          Whatchoice: '3个月以内',
          fraction: 3,
          ischange: false,
        }, {
          id: 2,
          page: 5,
          Whatchoice: '3-6个月',
          fraction: 5,
          ischange: false,
        }, {
          id: 3,
          page: 5,
          Whatchoice: '6个月以上',
          fraction: 10,
          ischange: false,
        }, {
          id: 4,
          page: 5,
          Whatchoice: '无工作/个体',
          fraction: 0,
          ischange: false,
        }],
      }, {
        title: '个人月收入情况？',
        swiperPage: 6,
        options: [{
          id: 1,
          page: 6,
          Whatchoice: '2000以内',
          fraction: 3,
        }, {
          id: 2,
          page: 6,
          Whatchoice: '2000元-3000元',
          fraction: 5,
        }, {
          id: 3,
          page: 6,
          Whatchoice: '3000元-5000元 ',
          fraction: 8,
        }, {
          id: 4,
          page: 6,
          Whatchoice: '5000元以上',
          fraction: 15,
        }],
      }, {
        title: '有无信用卡？',
        swiperPage: 7,
        options: [{
          page: 7,
          id: 1,
          Whatchoice: '用卡6个月以上',
          fraction: 10,
        }, {
          page: 7,
          id: 2,
          Whatchoice: '用卡6个月以内',
          fraction: 5,
        }, {
          id: 3,
          page: 7,
          Whatchoice: '无信用卡 ',
          fraction: 0,
        }],
      }, {
        title: '近2年内你的信用记录？',
        swiperPage: 8,
        options: [{
          page: 8,
          id: 1,
          Whatchoice: '信用良好无逾期',
          fraction: 10,

        }, {
          page: 8,
          id: 2,
          Whatchoice: '有1、2次一个月逾期',
          fraction: 5,
        }, {
          page: 8,
          id: 3,
          Whatchoice: '有3次以上一个月逾期 ',
          fraction: 0,
        }, {
          page: 8,
          id: 4,
          Whatchoice: '有90天逾期',
          fraction: 0,
        }, {
          page: 8,
          id: 5,
          Whatchoice: '无信用记录',
          fraction: 3,
        }],
      }, {
        title: '近6个月审批查询次数？',
        swiperPage: 9,
        options: [{
          id: 1,
          page: 9,
          Whatchoice: '5次以内',
          fraction: 8,
        }, {
          id: 2,
          page: 9,
          Whatchoice: '6-10次',
          fraction: 3,
        }, {
          id: 3,
          page: 9,
          Whatchoice: '10次以上 ',
          fraction: 0,
        }],
      }],
      // 总积分
      Allmoney: 0,
      swIperindex:false,
      Allfraction: 0,
      nowfraction: 0,
      ischange: 1,
      lastResult: [],
      allpage:1,
      page: 1,
      borderColoer: false,
      active: 0,
      swiper: '',
      text:'下一题',
      swiperOption: {
        pagination: '.swiper-pagination',
        direction: 'vertical',
        allowSwipeToNext :true,
        allowSwipeToPrev:true,
      },
    };
  },
  components: {
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    window.aa = this;
    this.$nextTick(() => {
      /* eslint-disable */
      this.swiper = new Swiper(this.$refs.SwiperPage, this.swiperOption);
      /* eslint-enable */
    });
  },
  watch: {
    swiper () {
    }
  },
  methods: {
    tuNextpage () {
      let self = this;
      self.swiperOption.allowSwipeToPrev = true;
      self.swiper.slideNext();
    },
    toNext () {
      let self = this;
      let sum = 0;
      let len = self.lastResult.length;
      if (this.swiper.activeIndex  === len ) {
        self.swiper.slideNext();
        self.swIperindex = false;
        if (9  === len ) {
          for (let i = 0; i < len; i ++) {
            if (self.lastResult[i] === undefined ) {
              return  this.$toast('您有答案未选择');
            }
            sum += self.lastResult[i];
          }
          this.text = '去贷款';
          this.$router.push({ name: 'home.LoanResults', params: { Allfraction: sum }});
        }
      }
      else {
        this.$toast('请先选择答案');
      }
    },
    chlick (Next, i) {
      let self = this;
      let fraction = Next.fraction;
      // self.lastResult.length = index;
      let activeIndex = this.swiper.activeIndex;
      self.lastResult[activeIndex - 1] = fraction;
      self.swIperindex = i;
    }
  },
};