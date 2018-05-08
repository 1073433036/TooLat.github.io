import './index.scss';

import Header       from '~common/components/header';
import Insurance    from './components/insurance_attache';
import Vip          from './components/advanced_vip';

export default {
  name: 'AgencyMyTeam',
  data () {
    return {
			insurance:false,
			vip:false,
      userInfo: {}
    };
  },
  components: {
		'app-header': Header,
		Insurance,
		Vip,
  },
  computed: {
  },
  mounted () {
  },
  watch: {

  },
  methods: {
  },
};