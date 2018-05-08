import './index.scss';

import _ from 'lodash';
import Header from '~common/components/header';
import Models from '~common/models';
import Cropper          from '~common/components/cropper';

export default {
  name: 'generationAuthFlow',
  data () {
    return {
      active: false,
      idPic: '',
      formData: {
        id_pic: '',
        name: '',
        id_number: '',
      },
    };
  },
  components: {
    'app-header': Header,
    Cropper
  },
  computed: {
    authentication () {
      return _.get(this.$store.get.state, 'Authentication');
    },
    uploadImage () {
      return _.get(this.$store.get.state, 'Cropper.content.data');
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getAuthentication();
    });
  },
  watch: {
    uploadImage (val) {
      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
        if ('code' === this.currentFile) {
          this.$toast('上传成功');
          // this.formData.id_pic = val.preview;
        }
        else {
          this.idPic    = val.preview;
          this.formData.id_pic    = val.url;
          let data = {
            type: 2,
            url: this.formData.id_pic,
          };
          this.getIdentityInfo(data);
        }
      }
    },
  },
  methods: {
    // 获取身份证号
    async getIdentityInfo (data) {
      let self = this;
      await Models.Upload
        .identityInfo(data)
        .then(res => {
          self.formData.name = res.data.name;
          self.formData.id_number = res.data.number;
        });
      self.$nextTick(() => {
        self.$store.get.dispatch('SAVE_AUTHENTICATION_STEP1', self.formData);
        self.active = true;
      });
    },
    // 图片上传组件
    setImage (e, el) {
      if (!_.isEmpty(e)) {
        this.currentFile = el;
        const file = e.target.files[0];
        this.$store.get.dispatch({
          type  : 'cropperData',
          isShow: true,
          save: 1,
          data: {
            file: file,
          }
        });
      }
    },
    // 重置input file值
    fileClose () {
      this.$refs[this.currentFile].value = '';
    },
    // 获取基本共用字段
    getAuthentication () {
      Models.Profile
        .getAuthentication()
        .then((res) => {
          if (1 === res.code) {
            let data = res.data;
            this.formData.name = data.name;
            this.formData.id_number = data.id_number;
          }
        });
    },
    submitData () {
      this.$router.push({
        name: 'home.intelligentStorage',
      });
    },

    /*fetchPhoto (data) {
      Models
        .Upload
        .uploadImage(data)
        .then(res => {
      });
    },
    uploadLocalPhoto (e) {
      let ele = e.target.files[0];
      let imageData = window[window.webkitURL ? 'webkitURL' : 'URL'].createObjectURL(ele);
      // this.formData.id_pic = imageData;

      let img = new Image();
      img.onload = () => {
        this.formData.id_pic = this.getBase64Image(img);
        console.log(this.formData.id_pic);
        this.fetchPhoto(this.formData.id_pic);
      };
      img.src = imageData;
      this.$toast('上传成功');
      this.$store.get.dispatch('SAVE_AUTHENTICATION_STEP1', this.formData);
      // setTimeout(() => {
      //   console.log(this.formData.id_pic);
      // }, 200);
    },
    getBase64Image (img) {
      let canvas = document.createElement('canvas');

      canvas.width = 400;
      canvas.height = 300;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 400, 300);
      let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
      let dataURL = canvas.toDataURL('image/' + ext);
      return dataURL;
    },*/

  },
};
