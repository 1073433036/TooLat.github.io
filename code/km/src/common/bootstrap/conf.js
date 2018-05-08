import _    from 'lodash';
import Vue  from 'vue';

window.API_DOMAIN = `${window.location.protocol}//${window.location.host}/assets/api`;
Vue.prototype.API_DOMAIN  = window.API_DOMAIN;

if ('production' === _.get(process.env, 'NODE_ENV')) {
  let worker = document.createElement('script');
  worker.id = 'baidu-statistics';
  worker.src = 'https://hm.baidu.com/hm.js?47fa38d830e280c13bb8b962fd388450';

  let node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(worker, node);
}