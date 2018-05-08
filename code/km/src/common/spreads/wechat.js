import _    from 'lodash';
import Vue  from 'vue';

/* eslint-disable */
class WeChatPay {
  constructor (data = {}, func) {
    this.options = data;
    this.func    = func;

    if (typeof WeixinJSBridge == 'undefined'){
      if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
      }
      else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
        document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
      }
    }
    else{
      this.jsApiCall();
    }
  }

  jsApiCall () {
    let self = this;
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      self.options,
      function (res) {
        if (_.isFunction(self.func)) {
          self.func(res);
        }
        WeixinJSBridge.log(res.err_msg);
      }
    );
  }
}

Vue.prototype.wechatPay = WeChatPay;
/* eslint-enable */
