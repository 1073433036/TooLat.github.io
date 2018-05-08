import './index.scss';

import _              from 'lodash';
import localStorage   from '~common/services/localStorage.cookie';

export default {
  name: 'startpage',
  data () {
    return {
      image: 0,
    };
  },
  mounted () {
    this.runStartPage();
    this.autoCloseStartPage();

    let params  = this.$parseQueryString();
    if (_.isEmpty(params) && _.isEmpty(this.historyRoute)) {
      this.$store.get.dispatch({
        type: 'startPage',
        isStart: true,
      });
    }
    else if (0 === params.new_user * 1 && _.isEmpty(this.historyRoute)) {
      this.$store.get.dispatch({
        type: 'startPage',
        isStart: true,
      });
    }
  },
  computed: {
    isStart () {
      return this.$store.get.state.StartPage.isStart;
    },
    historyRoute () {
      let data = _.get(this.$store.get.state, 'App.historyRoute');
      return data;
    },
  },
  components: {
  },
  methods: {

    autoCloseStartPage () {
      let self = this;
      setTimeout(() => {
        self.handleStartClose();
      }, 1400);
    },

    /*
     * 关闭启动页
     */
    handleStartClose () {
      this.$store.get.dispatch({
        type: 'startPage',
        isStart: false,
      });
    },

    /*
     * 按顺序轮流启动页
     */
    runStartPage () {
      let self = this;
      let data = _.get(localStorage.get('StartPage'), 'data.index');
      if (data) {
        switch (data) {
          case 1:
            self.image = 1;
            localStorage.set('StartPage', {
              index : 2,
            });
            break;
          case 2:
            self.image = 2;
            localStorage.set('StartPage', {
              index : 3,
            });
            break;
          case 3:
            self.image = 3;
            localStorage.set('StartPage', {
              index : 1,
            });
            break;
        }
      }
      else {
        self.image = 1;
        localStorage.set('StartPage', {
          index : 2,
        });
      }
    },

  }
};