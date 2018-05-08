import './index.scss';

import _ from 'lodash';

export default {
  name: 'creditcardList',
  data () {
    return {
      formTemp: {
        bankData: [
          {
            cardId: 1,
            cardNum: '6228480402564890018',
            username: '李华西',
            bankName: '工商银行'
          },
          {
            cardId: 2,
            cardNum: '6228480402637874213',
            username: '李华南',
            bankName: '建设银行'
          }

        ]
      }
    };
  },
  props: ['change', 'select'],
  mounted () {
  },
  computed: {

  },
  filters: {
    // 取尾号4位
    sliceCard (value) {
      return value.substr(value.length - 4);
    }
  },
  components: {

  },
  methods: {
    handleClose () {
      this.$emit('creditCardClick', {
        status: false,
      });
    },

    handleClick (text) {
      this.$emit('creditCardClick', {
        status: false,
        content: _.isObject(text) || _.isArray(text) ? text : text + '',
      });
    }
  }
};