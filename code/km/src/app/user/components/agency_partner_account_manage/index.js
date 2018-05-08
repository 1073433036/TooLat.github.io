import './index.scss';

import Header         from '~common/components/header';
import Activated      from './components/activated';
import Nonactivated   from './components/nonactivated';

export default {
  name: 'AgencySeniorMember',
  data () {
    return {
			arr:['已激活（3人）', '未激活（17人）'],
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
		Activated,
		Nonactivated,
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