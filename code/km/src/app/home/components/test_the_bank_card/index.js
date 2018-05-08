import './index.scss';
import Swiper from 'swiper';
export default {
  name: 'homeCard',
  data () {
    return {
      swiperList: [{

        UserImage: 'tou1',
        WhatSay: 'FirstQQ',
        options: [{
          page: 1,
          optionImg: 'xx12',
          background: 'btn1',
          name: '18(含)-26岁'
        }, {
          page: 1,
          optionImg: 'xx13',
          background: 'btn1',
          name: '27-30岁'
        }, {
          page: 1,
          optionImg: 'xx14',
          background: 'btn1',
          name: '31-40岁'
        }, {
          page: 1,
          optionImg: 'xx15',
          background: 'btn1',
          name: '41-50岁'
        }, {
          page: 1,
          optionImg: 'xx16',
          background: 'btn1',
          name: '50周岁以上'
        }]
      }, {
        UserImage: 'tou2',
        WhatSay: 'title12',
        options: [{
          page: 2,
          optionImg: 'xx21',
          background: 'btn2',
          name: '中专/高中以下'
        }, {
          page: 2,
          optionImg: 'xx22',
          background: 'btn2',
          name: '大专'
        }, {
          page: 2,
          optionImg: 'xx23',
          background: 'btn2',
          name: '本科'
        }, {
          page: 2,
          optionImg: 'xx24',
          background: 'btn2',
          name: '硕士及以上'
        }]
      }, {
        UserImage: 'tou3',
        WhatSay: 'title21',
        options: [{
          page: 3,
          optionImg: 'xx31',
          background: 'btn3',
          name: '未进爱情坟墓'
        }, {
          page: 3,
          optionImg: 'xx32',
          background: 'btn3',
          name: '进入爱情坟墓'
        }]
      }, {
        UserImage: 'tou4',
        WhatSay: 'title13',
        options: [{
          page: 4,
          optionImg: 'xx41',
          background: 'btn1',
          name: '党政机关/政府部门'
        }, {
          page: 4,
          optionImg: 'xx42',
          background: 'btn1',
          name: '国企/事业单位'
        }, {
          page: 4,
          optionImg: 'xx43',
          background: 'btn1',
          name: '世界500强企业'
        }, {
          page: 4,
          optionImg: 'xx45',
          background: 'btn1',
          name: '普通外企/民营企业'
        }, {
          page: 4,
          optionImg: 'xx45',
          background: 'btn1',
          name: '自由职业/待业人员'
        }]
      }, {
        UserImage: 'tou5',
        WhatSay: 'title14',
        options: [{
          page: 5,
          optionImg: 'xx52',
          background: 'btn3',
          name: '小于5万'
        }, {
          page: 5,
          optionImg: 'xx53',
          background: 'btn3',
          name: '5万-10万(含)'
        }, {
          page: 5,
          optionImg: 'xx54',
          background: 'btn3',
          name: '10万-20万(含)'
        }, {
          page: 5,
          optionImg: 'xx55',
          background: 'btn3',
          name: '大于20万'
        }]
      }, {
        UserImage: 'tou6',
        WhatSay: 'title15',
        options: [{
          page: 6,
          optionImg: 'xx61',
          background: 'btn3',
          name: '压根没有'
        }, {
          page: 6,
          optionImg: 'xx62',
          background: 'btn3',
          name: '半年以内'
        }, {
          page: 6,
          optionImg: 'xx63',
          background: 'btn3',
          name: '半年-1年'
        }, {
          page: 6,
          optionImg: 'xx64',
          background: 'btn3',
          name: '1年-3年'
        }, {
          page: 6,
          optionImg: 'xx65',
          background: 'btn3',
          name: '3年-5年'
        }, {
          page: 6,
          optionImg: 'xx66',
          background: 'btn3',
          name: '5年以上'
        }]
      }, {
        UserImage: 'tou7',
        WhatSay: 'title16',
        options: [{
          page: 7,
          optionImg: 'xx71',
          background: 'btn1',
          name: '租房'
        }, {
          page: 7,
          optionImg: 'xx72',
          background: 'btn1',
          name: '按揭中房产'
        }, {
          page: 7,
          optionImg: 'xx73',
          background: 'btn1',
          name: '全款房产'
        }, {
          page: 7,
          optionImg: 'xx74',
          background: 'btn1',
          name: '其他'
        }]
      }, {
        UserImage: 'tou8',
        WhatSay: 'title22',
        options: [{
          page: 8,
          optionImg: 'xx81',
          background: 'btn2',
          name: '无'
        }, {
          page: 8,
          optionImg: 'xx82',
          background: 'btn2',
          name: '家or单位电话'
        }, {
          page: 8,
          optionImg: 'xx83',
          background: 'btn2',
          name: '都有'
        }]
      }, {
        UserImage: 'tou9',
        WhatSay: 'title17',
        options: [{
          page: 9,
          optionImg: 'xx91',
          background: 'btn3',
          name: '1个月申请了>=3次'
        }, {
          page: 9,
          optionImg: 'xx92',
          background: 'btn3',
          name: '6个月申请了>=3次'
        }, {
          page: 9,
          optionImg: 'xx93',
          background: 'btn3',
          name: '1个月申请了1-2次'
        }, {
          page: 9,
          optionImg: 'xx94',
          background: 'btn3',
          name: '12个月申请了>=3次'
        }, {
          page: 9,
          optionImg: 'xx95',
          background: 'btn3',
          name: '12个月申请了1-2次'
        }, {
          page: 9,
          optionImg: 'xx96',
          background: 'btn3',
          name: '无记录'
        }]
      }, {
        UserImage: 'tou10',
        WhatSay: 'title18',
        options: [{
          page: 10,
          optionImg: 'xx101',
          background: 'btn1',
          name: '有逾期记录'
        }, {
          page: 10,
          optionImg: 'xx102',
          background: 'btn1',
          name: '无信贷记录'
        }, {
          page: 10,
          optionImg: 'xx103',
          background: 'btn1',
          name: '有担保记录'
        }, {
          page: 10,
          optionImg: 'xx104',
          background: 'btn1',
          name: '有供房or供车记录'
        }, {
          page: 10,
          optionImg: 'xx105',
          background: 'btn1',
          name: '由供房+供车记录'
        }]
      }],
      Allmoney: 0,
      page: 1,
      active: 0,
      swiper: '',
      swiperOption: {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        direction: 'vertical'
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
    this.$nextTick(() => {
      /* eslint-disable */
      this.swiper = new Swiper(this.$refs.homeSwiper, this.swiperOption);
      /* eslint-enable */
    });
  },
  watch: {

  },
  methods: {
    tuNextpage () {
      this.swiper.slideNext();
    },
    chlick (Url) {
      let self = this;
      let name = Url.name;
      let page = Url.page;
      if (1 === page) {
        if ('18(含)-26岁' === name) {
          self.Allmoney += 1000;
        }
        else if ('27-30岁' === name) {
          self.Allmoney += 2000;
        }
        else if ('31-40岁' === name) {
          self.Allmoney += 5000;
        }
        else if ('41-50岁' === name) {
          self.Allmoney += 3000;
        }
        else if ('50周岁以上' === name) {
          self.Allmoney += 1000;
        }
      }
      else if (2 === page) {
        if ('中专/高中以下' === name) {
          self.Allmoney += 1000;
        }
        else if ('大专' === name) {
          self.Allmoney += 3000;
        }
        else if ('本科' === name) {
          self.Allmoney += 5000;
        }
        else if ('硕士及以上' === name) {
          self.Allmoney += 10000;
        }
      }
      else if (3 === page) {
        if ('未进爱情坟墓' === name) {
          self.Allmoney += 1000;
        }
        else if ('进入爱情坟墓' === name) {
          self.Allmoney += 3000;
        }
      }
      else if (4 === page) {
        if ('党政机关/政府部门' === name) {
          self.Allmoney += 10000;
        }
        else if ('国企/事业单位' === name) {
          self.Allmoney += 10000;
        }
        else if ('世界500强企业' === name) {
          self.Allmoney += 10000;
        }
        else if ('普通外企/民营企业' === name) {
          self.Allmoney += 3000;
        }
        else if ('自由职业/待业人员' === name) {
          self.Allmoney += 0;
        }
      }
      else if (5 === page) {
        if ('小于5万' === name) {
          self.Allmoney += 3000;
        }
        else if ('5万-10万(含)' === name) {
          self.Allmoney += 4000;
        }
        else if ('10万-20万(含)' === name) {
          self.Allmoney += 6000;
        }
        else if ('小于20万(含)' === name) {
          self.Allmoney += 10000;
        }
      }
      else if (6 === page) {
        if ('压根没有' === name) {
          self.Allmoney += 0;
        }
        else if ('半年以内' === name) {
          self.Allmoney += 1000;
        }
        else if ('半年-1年' === name) {
          self.Allmoney += 2000;
        }
        else if ('1年-3年' === name) {
          self.Allmoney += 5000;
        }
        else if ('3年-5年' === name) {
          self.Allmoney += 10000;
        }
        else if ('5年以上' === name) {
          self.Allmoney += 20000;
        }
      }
      else if (7 === page) {
        if ('租房' === name || '其他' === name) {
          self.Allmoney += 0;
        }
        else if ('按揭中房产' === name) {
          self.Allmoney += 5000;
        }
        else if ('全款房产' === name) {
          self.Allmoney += 10000;
        }
      }
      else if (8 === page) {
        if ('固定电话' === name) {
          self.Allmoney += 0;
        }
        else if ('家or单位电话' === name) {
          self.Allmoney += 1000;
        }
        else if ('都有' === name) {
          self.Allmoney += 1000;
        }
      }
      else if (9 === page) {
        if ('1个月申请了>=3次' === name) {
          self.Allmoney = self.Allmoney - 5000;
        }
        else {
          self.Allmoney += 0;
        }
      }
      else if (10 === page) {
        if ('有逾期记录' === name) {
          self.Allmoney = 0;
        }
        else if ('无信贷记录' === name) {
          self.Allmoney += 0;
        }
        else if ('有担保记录' === name) {
          self.Allmoney += 5000;
        }
        else if ('有供房or供车记录' === name) {
          self.Allmoney += 3000;
        }
        else if ('由供房+供车记录' === name) {
          self.Allmoney += 5000;
        }
      }
      this.swiper.slideNext();
      // console.log(self.Allmoney);
    }
  },
};