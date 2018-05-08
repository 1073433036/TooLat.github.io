import './index.scss';
export default {
  name: 'homeCard',
  data () {
    return {
      data: 1,
      ImageUrl: '',
      showMask: false,
      Banks: [{
        id: '4',
        name: '光大银行',
        Img: 'guangda',
      }, {
        id: '3',
        name: '工商银行',
        Img: 'gongshang'
      }, {
        id: '5',
        name: '华夏银行',
        Img: 'huaxia'
      }, {
        id: '6',
        name: '交通银行',
        Img: 'jiaotong'
      }, {
        id: '7',
        name: '民生银行',
        Img: 'minsheng'
      }, {
        id: '8',
        name: '平安银行',
        Img: 'pingan'
      }, {
        id: '9',
        name: '浦发银行',
        Img: 'pufa'
      }, {
        id: '10',
        name: '上海银行',
        Img: 'shanghai'
      }, {
        id: '11',
        name: '兴业银行',
        Img: 'xingye'
      }],
      NewImg: '',
      Id: '',
      Bid: '',
      Allmoney: ''
    };
  },
  components: {
  },
  computed: {
  },
  watch: {

  },
  // 10w 5-7w 3-4w 2-3w 1-2w 5k-1w 5000以下


  mounted () {
    let self = this;
    let money = parseInt(self.$route.query.Allmoney);
    self.Allmoney = money;
    //随机显示页面银行卡
    self.Bank();

  },
  methods: {
    radmon (len) {
      return [Math.floor(Math.random() * len)];
    },
    Bank () {
      let self = this;
      let BankLength = self.radmon(self.Banks.length);
      let NewImg = self.Banks[BankLength].Img;
      let Id = self.Banks[BankLength].id;
      self.NewImg = NewImg;
      self.Id = Id;
      // console.log(NewImg);
      // console.log(Id);
    },
    closeMask () {
      let self = this;
      self.showMask = false;
    },
    // 点击分享按钮
    handleShareClick () {
      let self = this;
      self.showMask = true;
      // if (false === this.device.is('WeChat') && window.js_obj) {
      //   /* eslint-disable */
      //   let data = {
      //     title: this.appShareData.title,
      //     desc: this.appShareData.desc,
      //     url: this.appShareData.link,
      //     share_img: this.appShareData.imgUrl
      //   };

      //   js_obj.shareWeb(JSON.stringify(data));
      //   /* eslint-enable */
      // }
      // else {
      //   this.isShare = true;
      // }
    },
  },
};