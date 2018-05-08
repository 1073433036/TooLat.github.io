import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import Models         from '~common/models';
import Cropper        from './components/cropper';
let pluploadPromiss   = import('~common/plugs/plupload.full.min');
let qiniuPromiss      = import('qiniu-js');

export default {
  name: 'advertiseUploadMaterial',
  data () {
    return {
      uploadToken: '',
      typeRemark: '',
      itemRemark: '',
      uploadTypeRemark: '',
      articleTitle: '',
      articleDesc: '',
      categories: '',
      videoKey: '',
      articleImages: [],
      videoCoverImg: '',
      videoSrc: '',
      emptyFileinputVal: null,

      currentUploadIndex: 0,
      isVideoUpload: false,
      isShowSuccessTips: false,
      isShowDescPopup: false,
      status: {
        article: 0,
        video: 0
      },

      // 对应后台类目
      childNav: [
        { id: 28, parentId: 26 },
        { id: 29, parentId: 26 },
        { id: 33, parentId: 26 },
        { id: 35, parentId: 26 },
        { id: 30, parentId: 27 },
        { id: 31, parentId: 27 },
        { id: 34, parentId: 27 },
        { id: 36, parentId: 27 },
      ]

    };
  },
  components: {
    'app-header': Header,
    Cropper
  },
  computed: {
    itemStr () {
      if ('article' === this.itemRemark) {
        return '短文';
      }
      else if ('photo' === this.itemRemark) {
        return '图片';
      }
      else if ('video' === this.itemRemark) {
        return '视频';
      }
      else if ('material' === this.itemRemark) {
        return '公司素材';
      }

      return '';
    },
    uploadTips () {
      if ('article' === this.itemRemark || 'photo' === this.itemRemark || 'material' === this.itemRemark) {
        return '（最多可上传3张,限JPG、PNG格式）';
      }
      else if ('video' === this.itemRemark) {
        return '（视频大小在20M以内）';
      }
      return '';
    },
    uploadImage () {
      return _.get(this.$store.get.state, 'AdvertiseCropper.content.data');
    }
  },
  mounted () {
    //初始化跳转过来的金融or保险分类
    this.typeRemark = this.$route.query.typeRemark;
    //初始化跳转过来分类的id和对应分类
    this.categories = parseInt(this.$route.query.typeId);
    if (28 === this.categories || 30 === this.categories) {
      this.itemRemark = 'article';
    }
    else if (33 === this.categories || 34 === this.categories) {
      this.itemRemark = 'photo';
    }
    else if (29 === this.categories || 31 === this.categories) {
      this.itemRemark = 'video';
    }
    else if (35 === this.categories || 36 === this.categories) {
      this.itemRemark = 'material';
    }

    this.requestUploadToken();
  },
  watch: {
    itemRemark (val) {
      if ('article' === val) {
        this.isVideoUpload = false;
        //设置文章上传分类id
        if ('financial' === this.typeRemark) {
          this.categories = 28;
        }
        else if ('insurance' === this.typeRemark) {
          this.categories = 30;
        }
      }
      else if ('photo' === val) {
        this.isVideoUpload = false;
        //设置图片上传分类id
        if ('financial' === this.typeRemark) {
          this.categories = 33;
        }
        else if ('insurance' === this.typeRemark) {
          this.categories = 34;
        }
      }
      else if ('material' === val) {
        this.isVideoUpload = false;
        //设置图片上传分类id
        if ('financial' === this.typeRemark) {
          this.categories = 35;
        }
        else if ('insurance' === this.typeRemark) {
          this.categories = 36;
        }
      }
      else if ('video' === val) {
        this.isVideoUpload = true;
        //设置视频上传分类id
        if ('financial' === this.typeRemark) {
          this.categories = 29;
        }
        else if ('insurance' === this.typeRemark) {
          this.categories = 31;
        }
      }
    },
    //更新上传图片
    uploadImage (val) {
      if (val.preview) {
        if ('photo' === this.uploadTypeRemark) {
          this.articleImages.push(val.preview);
        }
        else if ('video' === this.uploadTypeRemark) {
          this.videoCoverImg = val.preview;
        }
      }
    },
  },
  methods: {

    routerBackHome () {
      this.$router.back();
    },

    /*切换文章or图片or视频*/
    setArticleOrVideo (remarkStr) {
      if (remarkStr === this.itemRemark) {
        return;
      }
      this.itemRemark = remarkStr;

      if ('video' === remarkStr) {
        this.$nextTick(function () {
          this.initializeQiniuObj(this.uploadToken);
        });
      }

      this.articleTitle = '';
      this.articleDesc = '';
      this.articleImages = [];
    },

    /*上传视频模块*/
    // 获取七牛上传凭证
    requestUploadToken () {
      Models.Advertise.uploadToken().then( res => {
        if (1 === res.code) {
          this.uploadToken = res.data;
          if ('video' === this.itemRemark) {
            this.initializeQiniuObj(this.uploadToken);
          }
        }
        else {
          this.$toast(res.msg);
        }
      });
    },
    // 七牛视频上传对象初始化
    initializeQiniuObj (uploadToken) {
      let self = this;
      /* eslint-disable */
      pluploadPromiss.then(() => {
        qiniuPromiss.then(() => {
          let uploader = Qiniu.uploader({
            disable_statistics_report: false,
            runtimes: 'html5,flash,html4',
            browse_button: 'video-upload-btn',
            uptoken: uploadToken,
            get_new_uptoken: false,
            domain: 'http://res.kamengjinfu.com/',
            max_file_size: '25mb',
            auto_start: true,
            init: {
              BeforeUpload: function(up, file) {
                if (!self.articleTitle) {
                  self.$toast('请先输入标题');
                  uploader.stop();
                  return;
                }
                self.$store.get.dispatch({
                  type: 'Loading',
                  Text: '上传中...',
                  isShow: true
                });
              },
              FileUploaded: function (up, file, info) {
                self.$store.get.dispatch({
                  type: 'Loading',
                  isShow: false
                });
                self.$toast('视频上传成功！');

                let res = JSON.parse(info.response);
                let domain = up.getOption('domain');
                let sourceLink = domain + res.key;
                self.videoSrc = sourceLink;
                self.$forceUpdate();
                self.videoKey = res.key;
              },
              Error: function (up, err, errTips) {
                self.$toast(errTips);
              },
              // UploadComplete: function () {
              //   self.$store.get.dispatch({
              //     type: 'Loading',
              //     isShow: false
              //   });
              //   self.$forceUpdate();
              //   self.$toast('完成！');
              // }
            }
          });
        });
      });
      /* eslint-enable */
    },
    //替换已上传的上一个视频
    replaceVideo (uploaderObj) {
      this.isShowSuccessTips = false;
      uploaderObj.start();
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
    },
    //播放视频
    playVideo () {
      // this.$refs.myUploadVideo.load();
      this.$refs.myUploadVideo.play();
      // this.$refs.myUploadVideo.webkitRequestFullScreen();
    },
    //删除视频
    deleteVideo () {
      this.videoSrc = '';
      this.videoKey = '';
    },

    /*上传图片模块*/
    //呼出图片处理组件
    setImage (event, remarkStr) {
      this.uploadTypeRemark = remarkStr;

      let uploadImgCount = this.articleImages.length;
      if (3 <= uploadImgCount) {
        this.$toast('最多上传3张图片');
        return;
      }

      const file = event.target.files[0];
      this.$store.get.dispatch({
        type  : 'cropperData',
        isShow: true,
        data: {
          file: file
        }
      });
    },
    //删除图片
    deleteImg (remarkIndex) {
      this.articleImages.splice(remarkIndex, 1);
    },
    Choosevalidate (event) {
      if (!this.articleTitle && 'material' !== this.itemRemark) {
        this.$toast('请先输入标题');
        event.preventDefault();
        return;
      }
    },

    /*上传发布文章or图片or公司素材*/
    uploadArticle () {
      let self = this;
      if (self.status.article) {
        self.$toast('已上传成功，请耐心等候工作人员审核，审核通过后将获得30积分奖励');
        return;
      }

      if (!self.articleTitle && 'material' !== self.itemRemark) {
        self.$toast('请输入标题');
        return;
      }
      else if (8 > self.articleTitle.length && 'material' !== self.itemRemark) {
        self.$toast('标题至少8个字长度');
        return;
      }
      else if (!self.articleDesc && 'material' !== self.itemRemark) {
        self.$toast('请输入描述内容');
        return;
      }
      else if (1 > self.articleImages.length) {
        self.$toast('至少上传一张图片');
        return;
      }

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });

      let data = {
        post_title: self.articleTitle,
        post_content: self.articleDesc,
        categories: self.categories,
        cover: self.articleImages[0],
        image: self.articleImages,
        post_status: 0
      };

      if ('material' === self.itemRemark) {
        data.post_content = 'default';
        data.post_title = 'default';
      }

      Models.Advertise.uploadArticle(data).then( res => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          self.status.article = 1;
          self.$toast('已上传成功，请耐心等候工作人员审核，审核通过后将获得30积分奖励');

          setTimeout(() => {
            let parent = _.filter(self.childNav, { id: self.categories });
            if (!_.isEmpty(parent) && parent[0].parentId) {
              self.$router.push({
                name: 'tool.MyList',
                query: {
                  act: self.categories,
                  type: parent[0].parentId
                }
              });
            }
          }, 2000);

        }
        else {
          self.$toast(res.msg);
        }

      });

    },
    /*上传发布视频*/
    uploadVideo () {
      let self = this;
      if (self.status.video) {
        self.$toast('视频已提交成功，请耐心等候工作人员审核，审核通过后将获得30积分奖励');
        return;
      }

      if (!self.articleTitle) {
        self.$toast('请输入标题');
        return;
      }
      else if (8 > self.articleTitle.length) {
        self.$toast('标题至少8个字长度');
        return;
      }
      else if (!self.videoCoverImg) {
        self.$toast('请上传视频封面');
        return;
      }
      else if (!self.videoKey) {
        self.$toast('请上传视');
        return;
      }

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });

      let data = {
        post_title: self.articleTitle,
        post_content: '---',
        categories: self.categories,
        cover: self.videoCoverImg,
        video: self.videoKey,
        post_status: 0
      };

      Models.Advertise.uploadArticle(data).then( res => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          self.status.video = 1;
          self.$toast('视频已提交成功，请耐心等候工作人员审核，审核通过后将获得30积分奖励');

          setTimeout(() => {
            let parent = _.filter(self.childNav, { id: self.categories });
            if (!_.isEmpty(parent) && parent[0].parentId) {
              self.$router.push({
                name: 'tool.MyList',
                query: {
                  act: self.categories,
                  type: parent[0].parentId
                }
              });
            }
          }, 2000);

        }
        else {
          self.$toast(res.msg);
        }

      });
    }
  },
};