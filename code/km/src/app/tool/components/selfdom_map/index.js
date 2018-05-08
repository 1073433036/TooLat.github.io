import './index.scss';

import Header    from '~common/components/header';
import Drawing   from './components/exhibition_drawing';
import Card      from './components/exhibition_card';

export default {
  name: 'SelfdomMap',
  data () {
    return {
      activeIndex:0,
      arr:['展业趣图', '展业名片'],
      formTemp: {
      },
      page:1,
      current_page: 0,
      last_page: 0,
    };
  },
  components: {
    'app-header': Header,
    Drawing,
    Card,
  },
  computed: {
  },
  mounted () {
	},
	watch: {
	},
  methods: {
    //切换
    toggleTabs (index) {
      this.activeIndex = index;
    },
    /**
    *上拉刷新
    */
    refresh (done) {
      let self = this;
      setTimeout(() => {
        self.page = 1;
        done();
      }, 1500);
    },
    /**
    *下拉刷新
    */
    infinte (done) {
      let self = this;
      if (self.last_page <= self.current_page) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        self.page ++;
        done();
      }, 1500);
    }
  },
};