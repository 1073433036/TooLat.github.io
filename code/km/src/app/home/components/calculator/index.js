import './index.scss';

import Header         from '~common/components/header';

export default {
  name: 'calculator',
  data () {
    return {

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
    lockItem () {
      this.$toast('即将开放，敬请期待');
    }
  }
};