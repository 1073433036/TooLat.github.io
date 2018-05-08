
import _            from 'lodash';
import LocalStorage from '../services/localStorage.cookie';

/**
 * User 弹出框插件
 * Version Beta 0.0.1
 */

/* eslint-disable */
let Vue;
class User {
  constructor () {
  }

  install (externalVue) {
    if (this.installed) {
      return;
    }

    Vue = externalVue;

    Vue.prototype.$user = {
      get () {
        return LocalStorage.get('userInfo').data || {};
      },

      set (value) {
        return LocalStorage.set('userInfo', value);
      }
    };


    // LocalStorage
    Vue.prototype.$session = {
      get (name) {
        return LocalStorage.get(name) || {};
      },

      set (name, value, expired) {
        return LocalStorage.set(name, value, expired);
      }
    };

    Vue.prototype.$parseQueryString = (str = window.location.href) => {
      let regUrl   = /^[^\?]+\?([\w\W]+)$/;
      let regPara  = /([^&=]+)=([\w\W]*?)(&|$|#)/g;
      let arrUrl =  regUrl.exec(str);
      let ret     = {};

      if (arrUrl && arrUrl[1]) {
       let strPara = arrUrl[1];
       let result;
       while (null !== (result = regPara.exec(strPara))) {
        ret[result[1]] = result[2];
       }
      }

      return ret;
    }


    Vue.prototype.$stringUrl = (obj) => {
      if (!_.isObject(obj)) {
        return '';
      }
      return JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&');
    }

    // 删除Url指定字段
    Vue.prototype.$delUrlParams = (location, names) => {
      if ('string' === typeof names) {
        names = [names];
      }

      let obj = Vue.prototype.$parseQueryString(location);

      //删除指定参数
      for (let i = 0; i < names.length; i ++) {
        delete obj[names[i]];
      }
      //重新拼接url
      let url = window.location.origin + window.location.pathname + '?' + JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&');
      return url;
    }

    // 解决安卓手机里面scroller回不到顶部的Bugs
    Vue.prototype.$scrollerUpdate = (el) => {
      if (el) {
        el.mouseDown = (e) => {
          let target = e.target;
          if (target.tagName.match(/input|textarea|select/i)) {
            getOffTop(el, target, e);
          }
        };
      }
    }

    function getOffTop (dom, el, e) {
      /*let offTop = el.parentNode;

      if (offTop) {
        let prev = offTop.previousSibling || offTop.nextSibling;
        if (prev) {
          if (prev.previousElementSibling && offTop.className === prev.previousElementSibling.className) {
            let offsetTop = offTop.parentNode.offsetTop;
            dom.scrollTo(0, offsetTop, true);
          }
          else {
            let offsetTop = offTop.offsetTop;
            dom.scrollTo(0, offsetTop, true);
          }
          return;
        }

        getOffTop(dom, offTop);
      }*/
      let clientY = e.clientY;
      let scrollTop = dom.getPosition().top;
      let offsetTop = clientY * 1 + scrollTop * 1 - 100;
      dom.scrollTo(0, offsetTop, true);
    }

    Date.prototype.format = function(fmt) {
      var o = {
        'M+' : this.getMonth()+1,
        'd+' : this.getDate(),
        'h+' : this.getHours(),
        'm+' : this.getMinutes(),
        's+' : this.getSeconds(),
        'q+' : Math.floor((this.getMonth()+3)/3),
        'S'  : this.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
      }
      return fmt;
    }

    this.installed = true;
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(User);
}

export default new User();
/* eslint-enable */