import './index.scss';

import Header   from '~common/components/header';

export default {
  name: 'Loan_succeed',
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
	watch: {
  },
  methods: {
		goBack () {
			this.$router.push({  name: 'home.Home' });
		}
  },
};