import './index.scss';

import Header     from '~common/components/header';

export default {
  name: 'creditcard-share-invite',
  data () {
    return {
      state: {
        boxFlag   : false
      },
      goodsList   : [
        {
          name    : 'Apple/苹果 iPhone X',
          profile : '全网通 原封国行 官方正品',
          image   : '/assets/images/reward-first.png',
          price   : '¥8488.00-9788.00',
        },
        {
          name    : '手拉箱',
          profile : '小米90分旅行箱男',
          image   : '/assets/images/reward-second.png',
          price   : '¥888',
        },
        {
          name    : '视频会员',
          profile : '精彩视频不断',
          image   : '/assets/images/reward-third.png',
          price   : '¥30',
        },
      ],
      goodsItem   : {},
    };
  },
  components: {
    'app-header'  : Header,
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