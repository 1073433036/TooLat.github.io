import './index.scss';

import _            from 'lodash';
import html2canvas  from 'html2canvas';
import Header       from '~common/components/header';
import Edit         from './components/edit';

export default {
  name: 'wechat-false-data',
  data () {
    return {
      isEdit         : false,
      isResult       : false,
      formData       : {
        version      : '安卓Android3',
        operator     : '移动',
        operator2    : '联通',
        network      : '4G',
        systemTime   : '13:45',
        electricity  : '50',
        location     : '显示',
        lockScreen   : '显示',
        clock        : '显示',
        bluetooth    : '显示',
        flow         : '显示',
        footer       : '不显示',
        bgimage      : '',
        charge       : '显示',

        level        : '',
        position     : '',
        isShowInfo   : '',
        isShowSTime  : '',
        sendDate     : '',
        sendTime     : '',
        avatar       : '',
        userInfo     : '',

        isShow1      : '',
        messageType1 : '',
        source1      : '',
        isShowDate1  : '',
        nick1        : '',
        date1        : '2018-03-02',
        time1        : '19:20',
        order1       : '',
        price1       : '',
        commission1  : '',
        points1      : '',
        gradeed1     : '',
        gradeing1    : '',
        getCash1     : '',
        creditCard1  : '',

        isShow2      : '',
        messageType2 : '',
        source2      : '',
        isShowDate2  : '',
        nick2        : '',
        date2        : '2018-03-03',
        time2        : '20:20',
        order2       : '',
        price2       : '',
        commission2  : '',
        points2      : '',
        gradeed2     : '',
        gradeing2    : '',
        getCash2     : '',
        creditCard2  : '',
      },
      resultImage    : '',
    };
  },
  components: {
    'app-header'     : Header,
    Edit,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
  },
  mounted () {
  },
  watch: {
  },
  methods: {

    /*
     * 处理保存数据
     */
    handleEdit (data) {
      _.assign(this.formData, data);
    },

    /*
     * 生成图片
     */
    createCanvasImage () {
      let self = this;
      let dom = self.$refs.canvas;
      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在生成，请稍等...',
      });
      self.$nextTick(() => {
        let scale = 2;
        let canvas = document.createElement('canvas'),
          w = dom.offsetWidth,
          h = dom.offsetHeight;
        canvas.width = w * scale;
        canvas.height = h * scale;
        canvas.getContext('2d').scale(scale, scale);
        html2canvas(dom, {
          useCORS: true,
          logging: false,
          canvas: canvas,
          width: w,
          height: h,
          scale: scale,
        }).then(canvas => {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });
          let context = canvas.getContext('2d');
          context.mozImageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;
          context.msImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          self.resultImage = canvas.toDataURL();
          self.isResult = true;
        });
      });
    },

  },
  filters: {
    handleDate (data) {
      let day = new Date(data);
      let month = day.getMonth() + 1;
      let date = day.getDate();
      return `${month}月${date}日`;
    },
    handlePushTime (data) {
      /* eslint-disable */
      //选择的日期
      let day = new Date(data);
      let year = day.getFullYear();
      let month = day.getMonth() + 1;
      let date = day.getDate();

      //当前的日期
      let dayNow = new Date();
      let yearNow = dayNow.getFullYear();
      let monthNow = dayNow.getMonth() + 1;
      let dateNow = dayNow.getDate();
      
      console.log(date);
      // console.log(dateNow);
      if ( date === dateNow && month === monthNow && year === yearNow) {
          return `今天`;
      } else {
          return `${year}年${month}月${date}日`;
      }
      /* eslint-enable */
      // let day = new Date(data);
      // let year = day.getFullYear();
      // let month = day.getMonth() + 1;
      // let date = day.getDate();
      // return `${year}年${month}月${date}日`;
    },
    handleGrade (data) {
      let money = '';
      switch (data) {
        case '高级会员Lv1':
          money = '198.00';
          break;
        case '保险经理Lv1':
          money = '298.00';
          break;
        case '保险主任Lv1':
          money = '598.00';
          break;
      }
      return money;
    },
    handleSysTime (data) {
      return data.substr(0, 5);
    },
  },
};