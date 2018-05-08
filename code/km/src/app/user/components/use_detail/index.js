import './index.scss';

import Header     from '~common/components/header';

export default {
  name: 'use-detail',
  data () {
    return {
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    title () {
      return this.$route.query.name || '卡盟流程说明';
    },
    image () {
      return this.$route.query.id;
    },
  },
  mounted () {
  },
  watch: {
  },
  methods: {
  },
};