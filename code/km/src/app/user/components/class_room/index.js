import './index.scss';

import Header           from '~common/components/header';
import Models           from '~common/models';

export default {
  name: 'classRoom',
  data () {
    return {
      isGetFromServer: false,
      formTemp: {
        list: [
          {
            id: 'study01',
            name: '实习会员介绍',
            url : {name: 'user.UseDetail', query: {id: 9}}
          },
          {
            id: 'study02',
            name: '办理信用卡新手指南',
            url : {name: 'home.NewbieGuide'}
          },
          {
            id: 'insurance01',
            name: '晶晶老师车险业务培训',
            url : 'http://mp.weixin.qq.com/s/ZB432e0ZVxDKVf0xnt-jyA',
            location: true
          },
          {
            id: 1,
            name: '卡盟的业务范围',
            url : 'https://m.qlchat.com/wechat/page/topic-intro?topicId=2000000715861836',
            location: true
          },
          {
            id: 2,
            name: '卡盟模式介绍',
            url : 'https://m.qlchat.com/wechat/page/topic-intro?topicId=2000000715971532&preview=Y&intoPreview=Y',
            location: true
          },
          {
            id: 3,
            name: '车险知识',
            url : 'https://m.qlchat.com/wechat/page/topic-intro?topicId=2000000715904613',
            location: true
          },
          {
            id: 4,
            name: '卡盟模式和收益介绍',
            url : 'https://m.qlchat.com/wechat/page/topic-intro?topicId=2000000728153287',
            location: true
          },
          {
            id: 5,
            name: '车险---交强险',
            url : 'https://m.qlchat.com/wechat/page/topic-intro?topicId=2000000728159706',
            location: true
          },
          {
            id: 6,
            name: '车险',
            url : 'https://m.qlchat.com/wechat/page/topic-intro?topicId=2000000757247146',
            location: true
          },
          {
            id: 7,
            name: '卡盟新人培训如何锁粉如何建立团队',
            url : 'https://m.qlchat.com/wechat/page/topic-intro?topicId=2000000757252886',
            location: true
          },
          {
            id: 8,
            name: '车险投保用户实操视频01',
            url : 'http://kmimage.wifizx.cc/chexianshicao.mp4',
            location: true
          },
          {
            id: 9,
            name: '车险投保用户实操视频02',
            url : 'https://v.qq.com/x/page/l05479cfssv.html',
            location: true
          },
          {
            id: 10,
            name: '汽车保险业务介绍',
            url : {name: 'insurance.AutoBanner'}
          },
          {
            id: 11,
            name: '了解汽车保险',
            url : {name: 'insurance.AutoH5'}
          },
          // {
          //   id: 12,
          //   name: '排行榜活动说明',
          //   url : {name: 'user.Stimulate'}
          // },
          {
            id: 13,
            name: '车险下单教程',
            url : 'https://m.v.qq.com/play.html?vid=l05479cfssv&ptag=v_qq_com%23v.play.adaptor%233&from=groupmessage&isappinstalled=0',
            location: true
          }
        ],
      },
      currentList: [],
      serverList: []
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  created () {
    //筛选分类，渲染条目
    if ('activity' === this.$route.params.id) {
      this.currentList = this.formTemp.list.filter(function (item) {
        if (10 === item.id  || 11 === item.id || 12 === item.id) {
          return item;
        }
      });
    }
    else if ('strategy' === this.$route.params.id) {
      this.isGetFromServer = true;
      this.requestStudyItem('团队打造攻略');

      // this.currentList = this.formTemp.list.filter(function (item) {
      //   if (4 === item.id || 7 === item.id || 'strategy01' === item.id || 'strategy02' === item.id) {
      //     return item;
      //   }
      // });
    }
    else if ('insurance' === this.$route.params.id) {
      this.isGetFromServer = true;
      this.requestStudyItem('汽车保险实操讲解');

      // this.currentList = this.formTemp.list.filter(function (item) {
      //   if (3 === item.id || 5 === item.id || 6 === item.id || 8 === item.id || 9 === item.id || 13 === item.id || 'insurance01' === item.id) {
      //     return item;
      //   }
      // });
    }
    else if ('study' === this.$route.params.id) {
      this.isGetFromServer = true;
      this.requestStudyItem('新手学习专区');

      // this.currentList = this.formTemp.list.filter(function (item) {
      //   if (1 === item.id || 2 === item.id || 'study01' === item.id || 'study02' === item.id) {
      //     return item;
      //   }
      // });
    }
  },
  watch: {
  },
  methods: {
    requestStudyItem (cat) {
      let data = {
        params: {
          cat: cat,
          top_cat: '卡盟课堂'
        }
      };
      Models.User.help(data).then( res => {
        if (1 === res.code) {
          this.serverList = res.data.data;
        }
        else {
          this.$toast(res.msg);
        }
      });
    }
  },
};
