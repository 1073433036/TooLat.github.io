import './index.scss';

import _            from 'lodash';
import LocalStorage from '~common/services/localStorage.cookie';

export default {
  name: 'messageHeader',
  data () {
    return {
    };
  },
  components: {
  },
  computed: {
    msgNum () {
      let data = LocalStorage.get('MessageNum');
      if (_.isEmpty(data)) {
        data.data = 0;
      }

      return data;
    }
  },
  mounted () {

  },
  watch: {

  },
  methods: {

  },
};