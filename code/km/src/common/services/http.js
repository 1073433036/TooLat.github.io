import _ 				      from 'lodash';
import Vue 			      from 'vue';
import axios 		      from 'axios';
import VueAxios       from 'vue-axios';
import Loading        from '../plugs/loading';
import router         from 'vue-router'

import LocalStorage   from './localStorage.cookie';

Vue.use(VueAxios, axios);
Vue.use(Loading);

/**
 * axios 配置
 */

axios.defaults.baseURL = 'http://api.kamengjinfu.com/api',
axios.defaults.timeout = 10000;

const options = {
	headers: {}
};

/* eslint-disable */
let $toast = function (tips, opt = {duration: 3500}) {
  if (document.querySelector('.toast')) {
    return;
  }
  let toastTpl = Vue.extend({
    template: `<div class="toast">${tips}</div>`
  });

  let tpl = new toastTpl().$mount().$el;
  document.body.appendChild(tpl);
  setTimeout(function () {
    document.body.removeChild(tpl);
  }, opt.duration);
};

/* eslint-enable */


let Token = LocalStorage.get('KMToken');
if (!_.isEmpty(_.get(Token, 'data'))) {
  options.headers = _.assign({}, options.headers, {
   'KM-Token'       : Token.data,
   'KM-Device-Type' : 'mobile',
  });
}


// 注入request请求信息
axios.interceptors.request.use((config) => {
// 	if (_.isEmpty(_.get(config, 'params.page')) || _.get(config, 'params.page') && 1 === _.get(config, 'params.page')) {
// 		Vue.$loading();
// 	}
	config = _.assign({}, config, options);
	return config;
}, (err) => {
  return Promise.reject(err);
});


//返回结果拦截
axios.interceptors.response.use((response) => {
	Vue.$loadingClose();
	let data;
	if (200 === response.status) {
		data = _.get(response, 'data');
	}
	else {
		data = response;
	}
  return data;
}, (error) => {
  Vue.$loadingClose();
	$toast(error);
  // return Promise.reject(error.response.data);
});
