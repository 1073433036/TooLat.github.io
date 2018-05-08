import './index.scss';

import _ from 'lodash';

export default {
  name: 'days',
  data () {
    return {
      myDate: new Date(),
      isMonths: false,
      model: 1,
      // 选中的li
      selectedLi: [],
      // 选中的日期
      selectedDay: [],
      days: [],
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    date: {},
  },
  mounted () {

  },
  computed: {

  },
  watch: {
  },
  methods: {
    getSelectClass () {
      if (this.model === 2) {
        return 'model-2';
      }
      else if (this.model === 3) {
        return 'model-3';
      }
      return '';
    },
    // 全选，反选
    handelSelectChange () {
      if (this.model < 3) {
        this.model++;
      }
      else {
        this.model = 1;
      }
      let self = this;
      let lis = this.$refs.body.querySelectorAll('li');
      // 全选
      let selectedDayAll = [];
      lis.forEach((item) => {
        selectedDayAll.push(item.dataset.day);
      });
      let selectedDayRev = [];
      let unSelectedLi = _.pullAll(_.toArray(lis), _.toArray(self.selectedLi));
      let modelHandel1 = function () {
        self.selectedLi.forEach((li) => {
          li.classList.add('act');
        });
        unSelectedLi.forEach((li) => {
          li.classList.remove('act');
        });
        self.days = self.selectedDay;
      };
      let modelHandel2 = function () {
        _.each(lis, (li) => {
          li.classList.add('act');
        });
        self.days = selectedDayAll;
      };
      let modelHandel3 = function () {
        unSelectedLi.forEach((li) => {
          li.classList.add('act');
        });
        self.selectedLi.forEach((li) => {
          li.classList.remove('act');
        });
        // 反选
        selectedDayRev = _.pullAll(selectedDayAll, self.selectedDay);
        self.days = selectedDayRev;
      };
      switch (this.model) {
        case 1:
          modelHandel1();
          break;
        // 全选
        case 2:
          modelHandel2();
          break;
        // 反选
        case 3:
          modelHandel3();
          break;
      }
    },
    // 点击日期
    handelDayClick (event, item) {
      let target = event.target;
      let lis = this.$refs.body.querySelectorAll('li');
      if (_.indexOf(target.classList, 'act') < 0) {
        target.classList.add('act');
        this.selectedDay.push(_.toString(item));
      }
      else {
        target.classList.remove('act');
        _.pull(this.selectedDay, _.toString(item));
      }
      if (this.model !== 1) {
        this.model = 1;
        this.selectedDay = [];
        _.each(lis, (li) => {
          li.classList.remove('act');
        });
      }
      this.days = this.selectedDay;
      this.selectedLi = this.$refs.body.querySelectorAll('.act');
    },
    // 取消
    dismiss () {
      this.$emit('onDateClick', {
        status: false,
        content: []
      });
    },
    // 完成
    submit () {
      let data = this.days;
      this.$emit('onDateClick', {
        status: false,
        content: data,
      });
    },
  },
};
