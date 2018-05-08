import './index.scss';

import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'article-detail',
  data () {
    return {
      state: {
        /*
         * 是否已点赞
         */
        focusFlag: false,
      },
      /*
       * 文章详情
       */
      article: '',
      /*
       * 文章点赞量
       */
      like: 0,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {

  },
  mounted () {
    this.getDetail();
  },
  watch: {
  },
  methods: {

    /*
     * 获取文章详情
     */
    getDetail () {
      let self = this;
      Models.Portal
      .show({
        params: {
          id: self.$route.params.id
        }
      })
      .then((res) => {
        if (1 === res.code) {
          self.article = res.data;
          self.like = parseInt(res.data.post_like);
        }
      });
    },

    /*
     * 点赞
     */
    getFocus () {
      let self = this;
        if (!this.state.focusFlag) {
          this.state.focusFlag = true;

          Models.Portal
          .like({
            params: {
              id: self.$route.params.id,
            }
          })
          .then(function (res) {
            if (1 === res.code) {
              self.article.post_like += 1;
            }
            else {
              self.$toast(res.msg);
            }
          });
        }
    },
  },
};