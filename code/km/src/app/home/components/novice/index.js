import './index.scss';

import Header           from '~common/components/header';

export default {
  name: 'Novice',
  data () {
    return {
      formTemp: {
        list: [],
      },
      /*
       * 分页
       */
      page          : 1,
      total         : 1,
      per_page      : 1,
      current_page  : 1,
      last_page     : 1,

    };
  },
  components: {
    'app-header': Header
  },
  computed: {
  },
  mounted () {
  },
  watch: {
  },
  methods: {

  }
};