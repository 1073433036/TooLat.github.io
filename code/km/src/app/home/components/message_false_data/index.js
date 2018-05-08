

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
        version      : '苹果IOS',
        operator     : '移动',
        network      : '4G',
        systemTime   : '13:45',
        electricity  : '50',
        location     : true,
        lockScreen   : true,
        clock        : true,
        bluetooth    : true,
        flow         : true,
        footer       : true,
        charge       : true,

        bank         : '',
        phone        : '',
        cardName     : '',
        quota        : '',
        code         : '',
        serialNumber : '',
        fontSize     : '',

        isShow1      : '',
        isShowTime1  : '',
        date1        : '',
        time1        : '',
        content1     : '',
        codeWarn1    : '',

        isShow2      : '',
        isShowTime2  : '',
        date2        : '',
        time2        : '',
        content2     : '',
        codeWarn2    : '',

        isShow3      : '',
        isShowTime3  : '',
        date3        : '',
        time3        : '',
        content3     : '',
        codeWarn3    : '',

        isShow4      : '',
        isShowTime4  : '',
        date4        : '',
        time4        : '',
        content4     : '',
        codeWarn4    : '',
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

        let scroller = '';

        if ('苹果IOS' === this.formData.version) {
          scroller = this.$refs.myScrollerIos;
        }

        if ('安卓Android1' === this.formData.version) {
          scroller = this.$refs.myScrollerAndroid1;
        }

        if ('安卓Android2' === this.formData.version) {
          scroller = this.$refs.myScrollerAndroid2;
        }

        let scrollTop = scroller.getPosition().top;
        scroller.scrollTo(0, 0, true);

        if ('苹果IOS' === this.formData.version) {
          document.querySelector('.scroll-ios').style.marginTop = -scrollTop + 'px';
        }

        if ('安卓Android1' === this.formData.version) {
          document.querySelector('.scroll-android1').style.marginTop = -scrollTop + 'px';
        }

        if ('安卓Android2' === this.formData.version) {
          document.querySelector('.scroll-android2').style.marginTop = -scrollTop + 'px';
        }

        setTimeout(() => {
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

            if ('苹果IOS' === this.formData.version) {
              document.querySelector('.scroll-ios').style.marginTop = 0 + 'px';
            }

            if ('安卓Android1' === this.formData.version) {
              document.querySelector('.scroll-android1').style.marginTop = 0 + 'px';
            }

            if ('安卓Android2' === this.formData.version) {
              document.querySelector('.scroll-android2').style.marginTop = 0 + 'px';
            }
            scroller.scrollTo(0, scrollTop, true);
          });
        }, 1000);

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
      let day = new Date(data);
      let year = day.getFullYear();
      let month = day.getMonth() + 1;
      let date = day.getDate();
      return `${year}年${month}月${date}日`;
    },
    handleSysTime (data) {
      return data ? data.substr(0, 5) : data;
    },

    /*
     * 当天的消息，以每5分钟为一个跨度的显示时间；
     * 消息超过1天、小于1周，显示星期+收发消息的时间；
     * 消息大于1周，显示手机收发时间的日期。
     */
    handleIosDate (date) {
      let now = new Date();
      let nowYear = now.getFullYear();
      let nowMouth = 10 > now.getMonth() + 1 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
      let nowdate = now.getDate();

      let day = new Date(date);
      let month = day.getMonth() + 1;
      let olddate = day.getDate();

      let old = date.split('-').join('') * 1;
      let nowTime = (nowYear + '' + nowMouth + '' + nowdate) * 1;

      let text = `${month}月${olddate}日`;
      if (nowTime === old) {
        text = '今天';
      }
      if (nowTime === old + 1) {
        text = '昨天';
      }

      if (nowTime === old + 2) {
        text = '前天';
      }
      return text;
    },

  },
};