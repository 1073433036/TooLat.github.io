import './index.scss';

import Header   				 from '~common/components/header';
import AddSite   				 from './components/add_site';
import DeleteSite   		 from './components/delete_site';

export default {
  name: 'SendSite',
  data () {
    return {
			add:false,
			modification:false,
      formTemp: {
			},
    };
  },
  components: {
		'app-header': Header,
		AddSite,
		DeleteSite,
  },
  computed: {
  },
  mounted () {
	},
	watch: {
  },
  methods: {
    refresh (done) {
      setTimeout(() => {
        done();
      }, 1500);
		},
		//修改地址
		amend () {
			this.modification = true;
		},

  },
};