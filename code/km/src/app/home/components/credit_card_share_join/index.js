import './index.scss';
// import 'swiper/dist/css/swiper.css';

// import Swiper             from 'swiper';
import _                  from 'lodash';
import Header             from '~common/components/header';
import Checkbox           from '~common/components/checkbox';
import ServiceAgreement   from '~common/components/service_agreement';
import WechatCode         from '~common/components/wechat_code';
import Models             from '~common/models';

export default {
  name: 'creditcard-share-join',
  data () {
    return {
      isShow: false,
      isWechat: false,
      single: true,
      formTemp: {
        manager: {},
      },
      swiperOption: {
        direction: 'vertical',
        autoHeight: true,
      },
    };
  },
  components: {
    'app-header': Header,
    Checkbox,
    ServiceAgreement,
    WechatCode
  },
  computed: {
    isWechatClient () {
      return this.device.is('WeChat');
    }
  },
  mounted () {
    let self = this;
    self.getMyManager();

    // this.$nextTick(() => {
    //   self.swiper = new Swiper(self.$refs.mySwiper, self.swiperOption);
    //   /* eslint-disable */
    //   let startScroll, touchStart, touchCurrent;
    //   self.swiper.slides.on('touchstart', function (e) {
    //     startScroll = this.scrollTop;
    //     touchStart = e.targetTouches[0].pageY;
    //   }, true);
    //   self.swiper.slides.on('touchmove', function (e) {
    //     touchCurrent = e.targetTouches[0].pageY;
    //     let touchesDiff = touchCurrent - touchStart;
    //     let slide = this;
    //     let onlyScrolling =
    //       ( slide.scrollHeight > slide.offsetHeight ) &&
    //       (
    //           ( touchesDiff < 0 && startScroll === 0 ) ||
    //           ( touchesDiff > 0 && startScroll === ( slide.scrollHeight - slide.offsetHeight ) ) ||
    //           ( startScroll > 0 && startScroll < ( slide.scrollHeight - slide.offsetHeight ) )
    //       );
    //     self.swiper.update();
    //     if (onlyScrolling) {
    //       e.stopPropagation();
    //     }
    //   }, true);
    //   /* eslint-enable */
    // });
  },
  watch: {
  },
  methods: {

    /*
     * 获取专属服务经理信息
     */
    getMyManager () {
      let self = this;
      let invite = self.parseQueryString();

      Models.User
      .inviteUserInfo({
        params: {
          invite_code: invite.invite_code,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.formTemp.manager = res.data;
        }
      });
    },

    /*
     * 添加微信
     */
    addWeChat () {
      if (_.isEmpty(this.formTemp.manager.wx_qrcode) && _.isEmpty(this.formTemp.manager.wechat_account)) {
        this.$toast('专属服务经理暂无上传微信');
      }
      else {
        this.isWechat = true;
      }
    },

    // 微信组件回调
    wechatClose (obj) {
      if (_.isObject(obj)) {
        this.isWechat = obj.status;
      }
    },

    /*
     * 没有手机号码
     */
    noPhone () {
      this.$toast('专属服务经理暂无上传电话号码');
    },

    /*
     * 邀请好友加入
     */
    invite () {
      if (!this.single) {
        this.$toast('请同意平台协议');
        return;
      }
      let route = {
        name: 'home.CreditCardShareInfo'
      };
      this.$router.push(route);
    },

    /*
     * 获取url参数
     */
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      let r = window.location.search.substr(1).match(reg);
      return null !== r ? unescape(r[2]) : null;
    },

    // 解析url里面参数为Json
    parseQueryString () {
      let regUrl   = /^[^\?]+\?([\w\W]+)$/;
      let regPara  = /([^&=]+)=([\w\W]*?)(&|$|#)/g;
      let arrUrl =  regUrl.exec(window.location.href);
      let ret     = {};

      if (arrUrl && arrUrl[1]) {
       let strPara = arrUrl[1];
       let result;
       while (null !== (result = regPara.exec(strPara))) {
        ret[result[1]] = result[2];
       }
      }
      return ret;
    },

  },
  filters: {
    idFilter (val) {
      let data = val.split('');
      data.splice(6, 8, '*', '*', '*', '*', '*', '*', '*', '*');
      return data.join('');
    },
  },
};
