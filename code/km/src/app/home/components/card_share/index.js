import './index.scss';

import                'pinyin4js';
import _              from 'lodash';
import { Gauge }      from 'gaugeJS';
import TWEEN          from '@tweenjs/tween.js';
import Models         from '~common/models';
import Header         from '~common/components/header';
import LocalStorage   from '~common/services/localStorage.cookie';
import NotifyPopup    from '~common/components/notify_popup';

export default {
  name: 'cardShare',
  data () {
    return {
      isStart: false,
      isApply: false,
      formTemp: {},
      point: {},
      query: {},

      weatherData: {},

      isNoticeShow: false,
      noticeTime: new Date('2018/04/09 10:00:00').getTime(),
      notifyMsg: ['因银行业务第二季度任务发布，广发银行于2018-04-09开始对系统升级，广发校园卡通道暂停申请，预计维护时间2天，具体开放时间另行通知，感谢您的配合']
    };
  },
  components: {
    'app-header': Header,
    'notify-popup': NotifyPopup
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    isStudentCard () {
      let flag = false;
      if (this.formTemp.id >= 18) {
        flag = true;
      }
      return flag;
    },
    isWechatClient () {
      return this.device.is('WeChat');
    },
  },
  mounted () {
    this.query = this.$route.query;

    if (_.isEmpty(this.query)) {
      this.$toast('该信息不存在');
      this.$router.push({
        name: 'home.Home'
      });
      return;
    }

    this.getBank(this.query);
    // this.handlePoint();

    this.handleWeather();
  },
  watch: {
    formTemp (val) {
      let self = this;

      if (!_.isEmpty(val) && _.isObject(val)) {

        self.$store.get.dispatch({
          type: 'histData',
          data: {
            shareData: {
              logo: val.thumb,
              name: val.name,
            }
          },
        });

        setTimeout(() => {
          self.initGauge();
        }, 2500);
      }
    },
    userInfo (val, old) {
      if (!_.isEmpty(val) && val !== old) {
        this.$nextTick(() => {
          if (1 === val.app_msg_push * 1) {
            this.handlePlayAudio();
          }
        });
      }
    },
  },
  filters: {
    pinyin (value) {
      /* eslint-disable */
      let data = PinyinHelper.convertToPinyinString(value, '', PinyinFormat.WITHOUT_TONE);
      return data.toLowerCase();
      /* eslint-enable */
    },

    bankName (val, old) {
      if (!_.isEmpty(val) && val !== old) {
        return val.replace('银行', '');
      }
    },

  },
  methods: {

    // 播放语音
    handlePlayAudio () {
      let self = this;
      let isAudio = false;

      if ('ios' === self.device.os().toLowerCase()) {
        document.addEventListener('touchstart', function () {
          if (false === isAudio) {
            self.$refs.audio.play();
            isAudio = true;
          }
        }, false);
      }
      else {
        self.$refs.audio.play();
      }
    },

    // 获取天气预报信息
    handleWeather () {
      let data  = LocalStorage.get('home.Weather');

      let date  = new Date();
      let year  = date.getFullYear();
      let month = date.getMonth() + 1;
      let day   = date.getDate();

      let Time  = parseInt(new Date(`${year}-${month}-${day}`) / 1000);

      if (_.isEmpty(data.data) || !_.isEmpty(_.get(data, 'data.date')) && new Date(_.get(data, 'data.date')).getTime() / 1000 < Time) {
        Models.Home
        .weather()
        .then((res) => {
          if (1 === res.code) {
            LocalStorage.set('home.Weather', res.data, 60 * 60 * 24);
            this.weatherData = res.data;
          }
        });
      }
      else {
        this.weatherData = data.data;
      }

    },

    // 获取银行详情
    getBank (query) {
      // 银行ID
      if (query.bid) {
        Models.Bank
        .show({
          params: {
            id: query.bid
          }
        })
        .then((res) => {
          if (1 === res.code) {
            let data = res.data;
            if ('avg_apply_num' in data) {
              data.avg_apply_num = Number(data.avg_apply_num);
            }
            this.formTemp = data;
            document.title = `${this.formTemp.name}信用卡申请`;
          }
        });
      }

      // 银行信用卡ID
      else if (query.id) {
        Models.Credit
        .show({
          params: {
            id: query.id
          }
        })
        .then((res) => {
          if (1 === res.code) {
            let data = res.data;
            this.formTemp = data.bank;
            document.title = `${this.formTemp.name}信用卡申请`;
          }
        });
      }

    },


    // 数字滚动
    animatedNum (start = 0, value = 100, time = 1500) {

      let self = this;
      let objNum = { tweenNum: start };
      let tween = new TWEEN.Tween(objNum);
      tween.to({ tweenNum: value * 1 }, time)
      .onUpdate(function () {
        // self.changeNum = objNum.tweenNum.toFixed(0);
        self.formTemp.pass_rate = objNum.tweenNum.toFixed(0);
      })
      .start();

      function animate () {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
      animate();
    },

    // 仪表盘
    initGauge () {
      let self = this;

      let opts = {
        lines: 12,
        angle: 0,
        lineWidth: 0.6,
        pointer: {
          length: 0.71,
          strokeWidth: 0.029,
          color: '#000000'
        },
        limitMax: 'true',
        colorStart: '#076df8',
        colorStop: '#2faff3',
        strokeColor: '#ec772b',
        generateGradient: true
      };

      let gauge = new Gauge(self.$refs.foo);
      self.isStart = true;
      gauge.maxValue = 100;
      gauge.setMinValue(0);
      gauge.animationSpeed = 30;

      let rate = self.formTemp.pass_rate * 1 || 0.1;
      gauge.set(rate + rate * 0.2);
      gauge.setOptions(opts);
      self.animatedNum(0, rate + rate * 0.2);

      setTimeout(() => {
        gauge.set(rate);
        self.animatedNum(rate + rate * 0.2, rate, 800);
      }, 2000);
    },

    // Ip定位
    handlePoint () {
      let PointText = LocalStorage.get('user.PointText');

      if (_.isEmpty(PointText.data)) {
        Models.Home
        .localCity()
        .then((res) => {
          if (1 === res.code) {
            this.point = res.data;
            LocalStorage.set('user.PointText', this.point, 60 * 60 * 2);
          }
        });
      }
      else {
        this.point = PointText.data;
      }
    },

    applyCard () {
      if (this.formTemp.id === 20) {
        this.notifyMsg = ['因银行业务第二季度任务发布，广发银行于2018-04-09开始对系统升级，广发校园卡通道暂停申请，预计维护时间2天，具体开放时间另行通知，感谢您的配合'];
        this.noticeTime = new Date('2018/04/09 10:00:00').getTime();
        this.isNoticeShow = true;
        return;
      }
      this.isApply = true;
    },

    keepApply () {
      if (this.isStudentCard) {
        this.$router.push({
          name: 'home.StudentCreditCardApply',
          query: { bankCardName: this.formTemp.name, bankId: this.formTemp.id, creditCardId: this.formTemp.card_id }
        });
      }
      else {
        this.$router.push({
          name: 'home.CreditCardApply',
          query: { bid: this.formTemp.id, id: this.formTemp.card_id }
        });
      }
    },

    toggleNotifyFn () {
      this.isNoticeShow = false;
    }

  }
};
