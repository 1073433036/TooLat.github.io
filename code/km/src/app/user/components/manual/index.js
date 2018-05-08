import './index.scss';

import Header     from '~common/components/header';
import _          from 'lodash';

export default {
  name: 'manual',
  data () {
    return {
      formTemp: {
        navList: [
          {
            id: 1,
            name: '概述',
            image: '/assets/images/manual/manual1.jpg',
            isShow: true
          },
          {
            id: 2,
            name: '首页',
            image: '/assets/images/manual/manual2.jpg',
            isShow: true
          },
          {
            id: 3,
            name: '抢单',
            image: '/assets/images/manual/manual3.jpg',
            isShow: true
          },
          {
            id: 4,
            name: '精养卡',
            image: '/assets/images/manual/manual4.jpg',
            isShow: false
          },
          {
            id: 5,
            name: '车险',
            image: '/assets/images/manual/manual5.jpg',
            isShow: true
          },
          {
            id: 6,
            name: '消息',
            image: '/assets/images/manual/manual6.jpg',
            isShow: true
          },
          {
            id: 7,
            name: '个人中心',
            image: '/assets/images/manual/manual7.jpg',
            isShow: true
          },
        ],
      },
      formIndex: 1,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  mounted () {
    this.showJyCard();
  },
  watch: {
    userInfo: {
      handler () {
        this.showJyCard();
      },
      deep: true
    }
  },
  methods: {

    showJyCard () {
      if (this.userInfo.level > 1) {
        let item = this.formTemp.navList.find(el => el.id === 4);
        item.isShow = true;
      }
    },

    /*
     * 切换导航
     */
    switchNav (item) {
      let self = this;
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
      });
      this.formIndex       = item.id;
      this.$refs.image.onload = () => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
      };
    },

  },
};
