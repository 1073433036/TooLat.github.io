import './index.scss';
import Dates              from '~common/components/dates';
import _        from 'lodash';
export default {
  name: 'botSelect',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: '',
    formData : {},
    formIndex: {},
  },
  data () {
    return {
      isShow: false,
      Showdate: false,
      forIdx: '',
      userInfo: {
        time0    : '',
        time1   : '',
        time2   : '',
      },
      formTemp: {
        select: this.formIndex,
      }
    };
  },
  mounted () {
  },
  filters: {
  },
  computed: {
  },

  components: {
    Dates,
  },
  methods: {
    // 日期选择
    handleDateChange () {
      this.Showdate = true;
    },
    // 日期组件回调
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.Showdate = obj.status;
          this.userInfo['time' + this.formTemp] = obj.content;
          return;
        }
      }
    },

    // 选择
    handleItemChange (item) {
      if (item === this.formTemp) {
        this.formTemp = {};
        return;
      }
      this.formTemp = item;
      this.Showdate = true;
    },

    // 取消
    dismiss () {
      this.$emit('onChildClick', {
        status : false
      });
    },

  }
};