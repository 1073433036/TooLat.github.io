import './index.scss';

import _      from 'lodash';
import Header from '~common/components/header';

export default {
  name: 'CreditcardShare',
  data () {
    return {
      state: {
        layerFlag: false,
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    shareFlag () {
      return _.get(this.$store.get.state, 'CreditCardShare.share.isShow') || false;
    },
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    /*
     * 取消显示分享
     */
    cancelShow () {
      this.$store.get.dispatch({
        type  : 'creditCardShare',
        isShow: false,
      });
    },
  },
};