import './index.scss';

import Header    from '~common/components/header';
import Primary   from './components/primary_menber';
import Manager   from './components/manager';
import Advanced  from './components/advanced_manager';

export default {
  name: 'AgencySeniorMember',
  data () {
    return {
			arr:['198元', '298元', '598元'],
			activeIndex:0,
      formTemp: {
			},
			page          : 1,
      current_page  : 1,
      last_page     : 1,
    };
  },
  components: {
		'app-header': Header,
		Primary,
		Advanced,
		Manager,
  },
  computed: {
	},
	watch: {

  },
  mounted () {
  },
  methods: {
		toggleTabs (index) {
			this.activeIndex = index;
		},
		/**
		 *上拉刷新
		*/
		refresh (done) {
			setTimeout(() => {
				done();
			}, 1500);
		},
		/**
		 * 下来刷新
		*/
		infinite (done) {
      if (this.last_page <= this.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page ++;
        done();
      }, 1500);
    },
  },
};