import './index.scss';

import Header   from '~common/components/header';

export default {
  name: 'CardInsurance',
  data () {
    return {
      formTemp: {
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    refresh (done) {
      setTimeout(() => {
        done();
      }, 1500);
    },

  },
  watch: {
  },
};