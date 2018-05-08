/**
 * Toast 弹出框插件
 * Version Beta 0.0.1
 */

/* eslint-disable */

let _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; };

(function () {

  /**
   * Install plugin
   * @param Vue
   * @param axios
   */

  function plugin(Vue) {

    if (plugin.installed) {
      return;
    }

    plugin.installed = true;

    let t = null;

    let toast = function (tips, opt = { duration: 3500 }) {

      if (document.querySelector('.toast')) {
        clearTimeout(t);
        document.body.removeChild(document.querySelector('.toast'));
      }

      let toastTpl = Vue.extend({
        template: `<div class="toast">${tips}</div>`
      });

      let tpl = new toastTpl().$mount().$el;
      document.body.appendChild(tpl);

      t = setTimeout(function () {
        document.body.removeChild(tpl);
      }, opt.duration);
    };


    Vue.prototype.$toast = toast;
    Vue.$toast = toast;

  }

  if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object') {
    module.exports = plugin;
  } else if (typeof define == 'function' && define.amd) {
    define([], function () {
      return plugin;
    });
  } else if (window.Vue && window.axios) {
    Vue.use(plugin, window.axios);
  }
})();

/* eslint-enable */

/* eslint-enable */