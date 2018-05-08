import './index.scss';

import _          from 'lodash';
import Header     from '~common/components/header';
import Cropper    from '~common/components/cropper';
import Models     from '~common/models';
import Zoom       from '~common/components/zoom';

export default {
  name: 'userCertify',
  data () {
    return {
      loading: false,
      isJust : false,
      isVerify: false,
      currentFile: '',
      formData: {
        real_name: '',
        id_card: '',
        validate: {
          back: '',
          just: '',
          body: '',
        },
      },
      formTemp: {
      },

      isZoom: false,
      zoomImage: '',
    };
  },
  components: {
    'app-header': Header,
    Cropper,
    Zoom,
  },
  computed: {
    uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
    },
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo');
    }
  },
  mounted () {
  },
  watch: {
    uploadImage (val) {
      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
        if ('back' === this.currentFile) {
          this.formData.validate.back = val.preview;
        }
        if ('just' === this.currentFile) {
          this.formData.validate.just = val.preview;
          // this.handleIdentityInfo(2, val.url);

        }
        if ('body' === this.currentFile) {
          this.formData.validate.body = val.preview;
        }
      }
    },

    userInfo () {
      this.verifyRealName();
    }
  },
  methods: {

    // 验证是否已经实名
    verifyRealName () {
      if (!_.isEmpty(this.userInfo.id_card)) {
      //   this.$router.push({
      //     name: 'user.Home'
      //   });
        this.isVerify = true;
      }
      Models.Profile
      .getAuthentication()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formData.real_name = data.real_name;
          this.formData.id_card = data.id_card;
          this.formData.validate.just = data.main;
          this.formData.validate.body = data.hand;
        }
      });
    },

    // 识别身份证
    handleIdentityInfo (type, url) {
      if (!_.isNumber(type * 1) || _.isEmpty(url)) {
        this.$toast('身份证识别类型错误');
        return;
      }

      this.$store.get.dispatch({
        type: 'Loading',
        Text: '上传中...',
        isShow: true
      });

      let data = {
        type,
        url
      };

      Models.Upload
      .identityInfo(data)
      .then((res) => {
        if (1 === res.code * 1) {
          let data = res.data;
          this.formData.id_card   = data.number || '';
          this.formData.real_name = data.name || '';
          this.isJust = true;
        }
        else {
          this.$toast('请按要求上传图片');
          this.isJust = false;
        }
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
      })
      .catch(() => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
      });
    },

    // 提交
    submit () {
      let self = this;

      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      // if (!self.formData.validate.back) {
      //   this.$toast('请上传身份证反面');
      //   return;
      // }

      if (!self.formData.validate.just) {
        this.$toast('请上传身份证正面');
        return;
      }

      if (!self.formData.validate.body) {
        this.$toast('请上传手持身份证半身照');
        return;
      }

      let arr = [
        // self.formData.validate.back.url,
        self.formData.validate.just,
        self.formData.validate.body,
      ];

      let data = {
        real_name: self.formData.real_name,
        id_card: self.formData.id_card,
        file: arr,
      };

      if (true === this.loading) {
        this.$toast('正在提交...');
        return;
      }
      this.loading = true;

      Models.User
      .setReal(data)
      .then((res) => {
        if (1 === res.code) {
          self.$toast(res.msg || '提交成功');
          setTimeout(() => {
            self.$router.go(-1);
          }, 1000);
        }
        else {
          self.loading = false;
          self.$toast(res.msg || '提交失败');
        }
      })
      .catch(() => {
        self.loading = false;
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
          data: {
            file: file
          }
        });
      }
    },

    // 重置input file值
    fileClose () {
      this.$refs[this.currentFile].value = '';
    },

    // 放大图片
    zoom (image) {
      this.isZoom = true;
      this.zoomImage = image;
    },

  }
};