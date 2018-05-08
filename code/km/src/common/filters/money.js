
import _    from 'lodash';
import Vue  from 'vue';

Vue.filter('money', function (val) {
  let data = val * 1;
  if (true === _.isNaN(data)) {
    data = 0;
  }
  return data.toFixed(2);
});