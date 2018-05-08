import './index.scss';

import Header   from '~common/components/header';

export default {
  name: 'homeCard',
  data () {
    return {
			page: 1,
			active: 0,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
  },
  watch: {

  },
  methods: {

    // 查询
    handleQuery () {
      this.$router.push({
        name: 'user.CardDetail',
        params: {
          id: 1,
        }
      });
    }

  },
};