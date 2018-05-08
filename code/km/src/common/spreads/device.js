import _            from 'lodash';
import MobileDetect from 'mobile-detect';
import Vue          from 'vue';

_.defaultsDeep(MobileDetect, {
  _impl: {
    mobileDetectRules: {
      props: {
        WeChat     : [/(MicroMessenger|wechatdevtools)\/([\d\.]+)/i],
        BadAndroid : [/Android /i],
      },
      uas: {
        WeChat     : /(MicroMessenger|wechatdevtools)\/([\d\.]+)/i,
        BadAndroid : /Android /i,
      },
    },
  },
});

export default new MobileDetect(window.navigator.userAgent);

Vue.prototype.device = new MobileDetect(window.navigator.userAgent);
