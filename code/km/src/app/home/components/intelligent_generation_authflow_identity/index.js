import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';
import Cropper          from '~common/components/cropper';

export default {
  name: 'intelligentIdentity',
  data () {
    return {
      active: false,
      handIdPic: '',
      formData:{
        hand_id_pic: '',
        audit: ''
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
  },
  watch: {
    uploadImage (val) {
      if (!_.isEmpty(val.preview) && !_.isEmpty(val.url)) {
        if ('code' === this.currentFile) {
          this.$toast('上传成功');
        }
        else {
          this.handIdPic = val.preview;
          this.formData.hand_id_pic = val.url;
          this.formData.audit = true;
        }
      }
      let self = this;
      self.$nextTick(() => {
        self.$store.get.dispatch('SAVE_AUTHENTICATION_STEP3', self.formData);
        self.active = true;
      });
    },
  },
  methods: {
    // 提交认证
    postAuthentication (data) {
      Models.Intelligent
        .userAuthentication(data);
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
            file: file
          }
        });
      }
    },
    // 重置input file值
    fileClose () {
      this.$refs[this.currentFile].value = '';
    },

    submitData () {
      let data = this.authentication.authentication;
      this.postAuthentication(data);
      this.$router.push({
        name: 'home.Generation',
      });
    },
  }
};
