import './index.scss';

import _          from 'lodash';
import VueCropper from 'vue-cropperjs';
import Models     from '~common/models';

export default {
  name: 'cropper',
  props: {


  },
  data () {
    return {
      loading : false,
      imgSrc  : '',
      imgType : 'image/jpeg',
    };
  },
  watch: {
    cropImg (val) {
      this.newImgUrl = val;
    }
  },
  computed: {
    isShow () {
      if (true === _.get(this.$store.get.state, 'Cropper.content.isShow')) {
        this.setImage();
      }
      return _.get(this.$store.get.state, 'Cropper.content.isShow') || false;
    },
    save () {
      return _.get(this.$store.get.state, 'Cropper.content.save') || 0;
    },
  },
  mounted () {
  },

  components: {
    VueCropper
  },

  watch: {
  },
  methods: {
    // 取消上传
    cancel () {
      this.imgSrc = this.lastImg;
      this.$store.get.dispatch({
        type  : 'cropperData',
        isShow: false,
        data: {}
      });

      this.fileClose();
    },

    fileClose () {
      this.$emit('uploadFileClose');
    },

    setImage () {
      const file = _.get(this.$store.get.state, 'Cropper.content.data.file');
      let type   = _.get(file, 'type');
      this.imgType = type;
      if (!_.includes(type, 'image')) {
        this.$toast('请选择图片文件');
        return;
      }
      const reader = new FileReader();

      // 加载图片
      reader.onloadstart = () => {
        this.$store.get.dispatch({
          type: 'Loading',
          Text: '图片加载中...',
          isShow: true
        });
      };

      // 加载完成
      reader.onload = (event) => {
        this.imgSrc  = event.target.result;
        this.$refs.cropper.replace(event.target.result);
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
      };

      // 加载错误
      reader.onerror = () => {
        this.$toast('图片加载失败');
        return;
      };

      reader.readAsDataURL(file);

    },

    // 上传图片
    upload () {
      let self = this;

      if (false === self.loading) {
        self.$store.get.dispatch({
          type: 'Loading',
          Text: '上传中...',
          isShow: true
        });

        self.loading = true;

        self.getBase(self.$refs.cropper.getCroppedCanvas().toDataURL(self.imgType, 0.3) || '')
        .then(image => {
          let data = {
            image,
            save: self.save
          };

          Models.Upload.uploadImage(data)
          .then((res) => {

            if (1 === res.code) {
              self.$store.get.dispatch({
                type  : 'cropperData',
                isShow: false,
                data: res.data
              });
            }
            else {
              self.$toast(res.msg || '图片上传失败');
            }

            self.$store.get.dispatch({
              type: 'Loading',
              isShow: false
            });
            self.loading = false;
            self.fileClose();

          });
        });
      }

    },

    // 压缩图片
    getBase (src) {
      return new Promise(resolve => {
        let image = new Image(),
          canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
        image.onload = () => {
          let w = image.naturalWidth > 1000 ? image.naturalWidth / 4 : image.naturalWidth / 2,
            h = image.naturalHeight > 1000 ? image.naturalHeight / 4 : image.naturalHeight / 2;
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(image, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        image.onerror = () => {
          resolve('');
        };
        image.src = src;
      });
    },

    rotate () {
      this.$refs.cropper.rotate(90);
    }
  }
};
