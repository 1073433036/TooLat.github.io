import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';

export default {
  name: 'task-center',
  data () {
    return {
      state: {},
    };
  },
  components: {
    'app-header'    : Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
  },
  watch: {},
  methods: {
  }
};