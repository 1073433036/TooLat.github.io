import './index.scss';

import _ from 'lodash';

export default {
  name: 'dates',
  data () {
    return {
      myDate: new Date(),
      year: '',
      month: '',
      day: '',
      hour: '',
      minute: '',
      second: '',
      maxYear: 80,
      formTemp: {
        year: [],
      }
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    child: {
      type: Array,
      default: () => ['year', 'month', 'day']
    },
    today: {
      type: Boolean,
      default: true,
    },
  },
  mounted () {
    this.handelToday();
    this.getYear();
  },
  filters: {
    month (value) {
      return 10 > value ? `0${value}` : value + '';
    },
    day (value) {
      return 10 > value ? `0${value}` : value + '';
    },
  },
  computed: {

  },

  updated () {
    let self = this;
    self.$nextTick(() => {
      setTimeout(() => {
        self.goToOffsetTop();
      }, 10);
    });
  },

  watch: {
    month (val) {
      this.month = val * 1;
    },
    day (val) {
      this.day = val * 1;
    },
    hour (val) {
      this.hour = val * 1;
    },
    minute (val) {
      this.minute = val * 1;
    },
    second (val) {
      this.second = val * 1;
    }
  },

  components: {

  },
  methods: {

    // 显示多少年
    getYear () {
      for (let i = this.maxYear; -20 <= i; i --) {
        this.formTemp.year.push(this.year - i);
      }
      /*this.formTemp.year.push(this.year + 1);*/
    },

    // 返回月份天数
    getDate (year = this.year, month = this.month) {
      let d = new Date(year, month, 0);
      return d.getDate();
    },

    // 滚动到当前选项
    goToOffsetTop () {
      _.each(this.child, (item) => {
        let el = _.get(this.$refs[item].$el, 'children[0]');
            el = _.get(el, 'children[0]');
        if (el.querySelector('.act')) {
          this.$refs[item].scrollTo(0, el.querySelector('.act').offsetTop, true);
        }
      });
    },

    // 至今
    handelToday () {
      this.year  = this.myDate.getFullYear();
      this.month = 10 > (this.myDate.getMonth() + 1)  * 1 ? `0${this.myDate.getMonth() + 1}` : this.myDate.getMonth() + 1;
      this.day   = 10 > this.myDate.getDate() * 1 ? `0${this.myDate.getDate()}` : this.myDate.getDate() + '';
      this.hour  = 10 > this.myDate.getHours() * 1 ? `0${this.myDate.getHours()}` : this.myDate.getHours() + '';
      this.minute  = 10 > this.myDate.getMinutes() * 1 ? `0${this.myDate.getMinutes()}` : this.myDate.getMinutes() + '';
      this.second  = 10 > this.myDate.getSeconds() * 1 ? `0${this.myDate.getSeconds()}` : this.myDate.getSeconds() + '';
    },

    // 取消
    dismiss () {
      this.$emit('onDateClick', {
        status : false
      });
    },

    // 完成
    submit () {

      let arr   = this.child;
      let data  = '';
      _.each(arr, (item) => {
        if (!_.isEmpty(data)) {
          data += '-';
        }
        data += 10 > this[item] * 1 ? `0${this[item]}` : this[item];
      });
      let _arr = data.split('-');
      let _data;
      if (_arr.length > 3) {
        _data = `${_arr[0]}-${_arr[1]}-${_arr[2]}` + ' ' + _arr[3] + ':' + _arr[4] + ':' + _arr[5];
      }
      else {
        _data = `${_arr[0]}-${_arr[1]}-${_arr[2]}`;
      }

      this.$emit('onDateClick', {
        status : false,
        content: _data
      });
      // console.log(content);
    }

  }
};
