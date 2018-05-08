import './index.scss';

import Header from '~common/components/header';

export default {
  name: 'creditcard-highquota',
  data () {
    return {
      state: {},
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.bottom = 10;
  },
  watch: {
  },
  methods: {
    refresh (done) {
      setTimeout(() => {
        done();
      }, 1500);
    },
    infinite (done) {
      if ( 30 <= this.bottom) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }
      setTimeout(() => {
        this.bottom = this.bottom + 10;
        done();
      }, 1500);
    },
  },
};