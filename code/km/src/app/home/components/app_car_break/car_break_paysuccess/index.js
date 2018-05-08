import './index.scss';

import Header          from '~common/components/header';

export default {
  name: 'carBreakPaySuccess',
  data () {
    return {
    };
  },
  components: {
    'app-header': Header
  },
  computed: {
  },
  mounted () {
  },
  watch: {},
  methods: {
    goHomePage () {
      this.$router.push({name:'home.Home'});
    },
    goCarBreakHome () {
      this.$router.push({ name: 'home.AppCarBreakRules' });
    }
  }
};