import Vue  from 'vue';

Vue.filter('hideId', function (key) {
  if (key) {
    let arr = key.split('');
    arr.splice(4, 8, '*', '*', '*', '*', '*', '*', '*', '*', '*', '*');
    return arr.join('');
  }

  return key;
});

Vue.filter('hidePhone', function (key) {
  if (key) {
    let arr = key.split('');
    arr.splice(3, 4, '*', '*', '*', '*');
    return arr.join('');
  }

  return key;
});