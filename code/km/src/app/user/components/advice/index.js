import './index.scss';
import Header      from '~common/components/header';
import Models      from '~common/models';
import _           from 'lodash';
import Cropper     from './components/cropper';

export default {
  name: 'Advice',
  data () {
    return {
      curPage             : 0,
      isLastPage          : false,
      feedBackList        : [],
      adviceString        : '',
      isExtend            : false,
      isCropperShow       : false,
      imageFile           : undefined,
      cropperCmpt         : undefined,
      enlargeImageSrc     : '',
      isImageLayerShow    : false,
      reSize              : false,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    userInfo () {
      return this.$user.get() || _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  async mounted () {
    await this.getFeedBack();
    let promiseHolder = [];
    for (let el of this.feedBackList) {
      if (el.type === 'image') {
        promiseHolder.push(this.clientLoadImage(el.content));
      }
    }
    if (promiseHolder.length) {
      Promise.all(promiseHolder).then(() => {
        this.scrollerUpdate();
      });
    }
    else {
      this.scrollerUpdate();
    }
  },
  watch: {
    isExtend () {
      this.scrollerUpdate();
    },
    isCropperShow (val) {
      this.cropperCmpt = val ? Cropper : undefined;
    }
  },
  methods: {
    // 获取意见反馈
    async getFeedBack () {
      let res = await Models.User.getFeedBack({
        cur_page: this.curPage,
        step: 3
      });
      if (res.code === 1 && Array.isArray(res.data)) {
        if (res.data.length < 3) {
          this.isLastPage = true;
        }

        let data = res.data.reverse();
        this.feedBackList = data.concat(this.feedBackList);
      }
    },

    // 发送文字消息
    submitFeedBack () {
      if (this.isExtend) {
        this.isExtend = false;
      }

      let content = this.adviceString;
      if (!content.trim()) {
        return;
      }
      this.adviceString = '';
      this.feedBackList.push({
        content,
        send_time: Math.floor(Date.now() / 1000),
        feedback: 1,
        user_nickname: this.userInfo.user_nickname,
        type: 'text',
        loading: true,
        fail: false,
      });
      this.scrollerUpdate();

      this.$nextTick(async () => {
        let data = {
          content,
          type   : 'text',
        };
        let res = await Models.User.submitFeedBack(data);
        let item = this.feedBackList[this.feedBackList.length - 1];
        item.loading = false;
        if (res.code !== 1) {
          item.fail = true;
        }
      });
    },

    // input image
    fileChanged (e) {
      if (e && e.target && e.target.files && e.target.files.length) {
        this.imageFile = e.target.files[0];
        this.isCropperShow = true;
      }
    },

    // 取消图片发送
    uploadFileClose () {
      this.isCropperShow = false;
      this.imageFile = undefined;
    },

    // 发送图片消息
    sendImagesInfo (el) {
      if (!el.success) {
        this.$toast('图片发送失败，请稍后重试');
        return;
      }
      this.feedBackList.push({
        content: el.image,
        send_time: Math.floor(Date.now() / 1000),
        feedback: 1,
        user_nickname: this.userInfo.user_nickname,
        type: 'image',
        loading: true,
        fail: false,
      });
      this.clientLoadImage(el.image).then(this.scrollerUpdate);

      this.$nextTick(async () => {
        let data = {
          content: el.image,
          type   : 'image',
        };
        let res = await Models.User.submitFeedBack(data);
        let item = this.feedBackList[this.feedBackList.length - 1];
        item.loading = false;
        if (res.code !== 1) {
          item.fail = true;
        }
      });
    },

    // 放大图片
    enlargeImage (src) {
      this.enlargeImageSrc = src;
      this.isImageLayerShow = true;
    },

    // 重新发送消息
    async resend (el) {
      el.fail = false;
      el.loading = true;
      let data = {
        content: el.content,
        type   : el.type,
      };
      let res = await Models.User.submitFeedBack(data);
      el.loading = false;
      if (res.code !== 1) {
        el.fail = true;
      }
    },

    // 更新scroller高度
    scrollerUpdate () {
      this.$nextTick(() => {
        let myscroller = this.$refs.myscroller;
        if (myscroller) {
          let dom = document.querySelector('.wrapper');
          setTimeout(() => {
            myscroller.scrollTo(0, dom.offsetTop + dom.offsetHeight, true);
          }, 50);
        }
      });
    },

    textareaFocus () {
      this.reSize = true;
      this.isExtend = false;
      this.scrollerUpdate();
    },

    // 加载更多
    async getMoreFeedBack (done) {
      if (!this.isLastPage) {
        this.curPage ++;
        await this.getFeedBack();
        done();
      }
      else {
        setTimeout(() => {
          done(true);
        }, 1000);
      }
    },

    // 加载图片
    clientLoadImage (src) {
      return new Promise(resolve => {
        let img = new Image();
        img.onload = () => {
          resolve();
        };
        img.src = src;
      });
    }
  },
};
