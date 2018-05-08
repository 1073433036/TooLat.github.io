import Vue  from 'vue';

Vue.filter('fmtDateDay', function (key) {
  if (key) {
    let date =  new Date(key);
    let y = 1900 + date.getYear();
    let m = '0' + (date.getMonth() + 1);
    let d = '0' + date.getDate();
    return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length);
  }
  return key;
});

Vue.filter('fmtDate', function (key) {
  if (key) {
    let time = new Date(key);
    let y   = time.getFullYear();
    let M   = time.getMonth() + 1;
    let d   = time.getDate();
    let h   = time.getHours();
    let m  = time.getMinutes();
    let s   = time.getSeconds();
    if (10 > M) {
      M = `0${M}`;
    }
    if (10 > d) {
      d = `0${d}`;
    }
    if (10 > m) {
      m = `0${m}`;
    }
    if (10 > s) {
      s = `0${s}`;
    }
    return `${y}-${M}-${d} ${h}:${m}:${s}`;
  }
  return key;
});

Vue.filter('fmtDateTime', function (key) {
  if (key) {
    let time = new Date(key);
    let h   = time.getHours();
    let mm  = time.getMinutes();
    let s   = time.getSeconds();
    if (10 > h) {
      h = `0${h}`;
    }
    if (10 > mm) {
      mm = `0${mm}`;
    }
    if (10 > s) {
      s = `0${s}`;
    }
    return `${h}:${mm}:${s}`;
  }
  return key;
});

// 乱七八糟的
Vue.filter('fmtNewsDate', function (key) {
  if (key) {
    let time = new Date(key);
    let y   = time.getFullYear();
    let m   = time.getMonth() + 1;
    let d   = time.getDate();
    let h   = time.getHours();
    let mm  = time.getMinutes();
    if (10 > m) {
      m = `0${m}`;
    }
    if (10 > d) {
      d = `0${d}`;
    }
    if (10 > h) {
      h = `0${h}`;
    }
    if (10 > mm) {
      mm = `0${mm}`;
    }
    return `${y}-${m}-${d} ${h}:${mm}`;
  }
  return key;
});
