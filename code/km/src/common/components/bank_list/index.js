import './index.scss';

import _ from 'lodash';

export default {
  name: 'bankList',
  data () {
    return {
      url: '',
      formTemp: {
        bankData: [
        ]
      }
    };
  },
  props: ['change', 'select'],
  mounted () {
    this.url = _.get(this.$route, 'name');
  },
  computed: {
  },
  components: {

  },
  methods: {
    handleClose () {
      this.$emit('bankCardClick', {
        status: false,
      });
    },

    handleClick (text) {
      this.$emit('bankCardClick', {
        status: false,
        content: _.isObject(text) || _.isArray(text) ? text : text + '',
      });
    }
  }
};