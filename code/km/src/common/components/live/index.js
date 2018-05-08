import './index.scss';

import _ from 'lodash';

export default {
  name: 'dates',
  data () {
    return {
      myDate: new Date(),
      province: '',
      city: '',
      county: '',
      formTemp: {
        province: [],
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
      default: () => ['province', 'city', 'county']
    },
    tocounty: {
      type: Boolean,
      default: true,
    },
  },
  mounted () {
  },
  filters: {
    city (value) {
      return 10 > value ? `0${value}` : value + '';
    },
    county (value) {
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
  },

  components: {

  },
  methods: {
    // 滚动到当前选项
    goToOffsetTop () {
      _.each(this.child, (item) => {
        console.log(item);
        let el = _.get(this.$refs[item].$el, 'children[0]');
            el = _.get(el, 'children[0]');
        if (el.querySelector('.act')) {
          this.$refs[item].scrollTo(0, el.querySelector('.act').offsetTop, true);
        }
      });
    },

    // 取消
    dismiss () {
      this.$emit('onDateClick', {
        status : false
      });
    },

    // 完成
    submit () {

      // let arr   = this.child;
      // let data  = '';
      // this.$emit('onDateClick', {
      //   status : false,
      //   content: data
      // });
    }

  }
};