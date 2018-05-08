import './index.scss';

import _               from 'lodash';
import Header          from '~common/components/header';
import Models          from '~common/models';

export default {
  name: 'advertiseArticleDetail',
  data () {
    return {
      isShowPage: false,
      isShowCommentPopup: false,
      loadingStatus: 0,
      isShowVideoCoverWrapper: true,

      itemRemark: '',
      articleId: 0,
      articleDetail: {
        post_content: ''
      },
      articleCommentList: [],
      userComment: '',


      touchTimer: null
    };
  },
  components: {
    'app-header': Header
  },
  computed: {
    isShowLoading () {
      return _.get(this.$store.get.state, 'Loading.isShow');
    },

    headerTitle () {
      if ('article' === this.itemRemark) {
        document.title = '短文';
        return '短文';
      }
      else if ('photo' === this.itemRemark) {
        document.title = '图片';
        return '图片';
      }
      else if ('video' === this.itemRemark) {
        document.title = '视频';
        return '视频';
      }
    },
    articleContent () {
      return this.hanldeTextContent(this.articleDetail.post_content);
    }
  },
  created () {
    this.itemRemark = this.$route.query.itemRemark;
    this.articleId = this.$route.query.articleId;
    this.requestArticleDetail();
    this.requestArticleComments();
  },
  watch: {
    isShowPage () {
      this.$nextTick(function () {
        if (this.$refs.photoGroup) {
          let imgs = this.$refs.photoGroup.querySelectorAll('img');
          for (let item of imgs) {
            item.addEventListener('touchstart', this.userSelectImg, false);
            item.addEventListener('touchend', this.userSelectImg, false);
          }
        }
      });
    },
    isShowCommentPopup (val) {
      if (val) {
        this.userComment = '';
      }
    },
    isShowLoading (val) {
      if (!val) {
        if (0 === this.loadingStatus) {
          this.$store.get.dispatch({
            type: 'Loading',
            isShow: true
          });
        }
      }
    }
  },
  methods: {

    //获取文章详细内容
    requestArticleDetail () {
      let data = {
        id: this.articleId
      };
      Models.Advertise.articleDetail(data).then( res => {
        this.loadingStatus = 1;
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          this.articleDetail = res.data;
          this.isShowPage = true;
        }
        else {
          this.$toast('获取文章出错！');
          // this.$router.back();
        }

        this.$nextTick(() => {
          this.handlePeerInfo();
        });

      });
    },

    //获取文章评论
    requestArticleComments (page = 1) {
      let data = {
        post_id: this.articleId,
        page: page
      };
      Models.Advertise.articleComments(data).then( res => {
        if (1 === res.code) {
          this.articleCommentList = res.data.data;
        }
      });
    },

    //点赞
    postLike () {
      let data = {
        id: this.articleId
      };
      Models.Advertise.postLike(data).then( res => {
        if (1 === res.code) {
          this.articleDetail.post_like += 1;
        }
        this.$toast(res.msg);
      });
    },

    //发表文章评论
    requestCommentArticle () {
      this.isShowCommentPopup = false;
      let data = {
        post_id: this.articleId,
        content: this.userComment
      };
      Models.Advertise.commentArticle(data).then( res => {
        if (1 === res.code) {
          this.requestArticleComments();
          this.$toast('评论成功');
        }
        else {
          this.$toast('评论失败');
        }
      });
    },

    //播放视频
    playVideo () {
      let self = this;
      this.isShowVideoCoverWrapper = false;
      this.$store.get.dispatch({
        type: 'Loading',
        Text: '视频加载中...',
        isShow: true
      });
      this.$refs.myVideo.load();
      self.$refs.myscroller.resize();
      this.$refs.myVideo.addEventListener('canplay', function () {
        // self.$refs.myscroller.resize();
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        self.$refs.myVideo.play();
      }, false);
      self.$refs.myVideo.addEventListener('play', function () {
        self.$refs.myscroller.resize();
      }, false);
    },

    //处理文章的换行符
    hanldeTextContent (content) {
      let regu = /\n/g;
      return content.replace(regu, '</br>');
    },

    // 获取分享用户
    handlePeerInfo () {
      let parse = this.$parseQueryString();

      let uid = parse.invite_code;
      if (!_.isEmpty(uid)) {
        Models.Friend
        .info({
          params: {
            user_id: uid,
          }
        })
        .then((res) => {
          if (1 === res.code) {
            let data = res.data;
            this.articleDetail = _.assign({}, this.articleDetail, {
              user_nickname: data.name || data.user_nickname
            });
          }
        });
      }
    },

    refresh (done) {
      setTimeout(() => {
        done();
      }, 1000);
    },

    infinite (done) {
      setTimeout(() => {
        done(true);
      }, 1000);
    },

    //长按图片，图片透明度变化
    userSelectImg (event) {
      if ('touchend' === event.type) {
        clearTimeout(this.touchTimer);
        event.target.classList.remove('select-img');
        return;
      }

      this.touchTimer = setTimeout(() => {
        if ('touchstart' === event.type) {
          event.target.classList.add('select-img');
        }
      }, 500);

      // setTimeout(() => {
      //   event.target.classList.remove('select-img');
      // }, 3000);
    }
  },
};