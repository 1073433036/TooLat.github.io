import './index.scss';

import _                  from 'lodash';
import Cropper            from '~common/components/cropper';
import Models             from '~common/models';

export default {
  name: 'UploadingImages',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    taskId: {
      type: String,
    },
  },
  data () {
    return {
      visible    : false,
			formData:{
				avatarFront        : '',
				avatarBack         : '',
				avatarCard         : '',
				avatarInvoice      : '',
        avatarSeat         : '',
        avatarCertificate  : '',
			},
			currentFile: '',
    };
  },
  components: {
		Cropper,
  },
  computed: {
		uploadImage () {
      let data = _.get(this.$store.get.state, 'Cropper.content.data');
      return data;
		},
  },
  mounted () {
    if (this.value) {
      this.visible = true;
		}
  },
  watch: {
    value (val) {
      this.visible = val;
    },
    visible (val) {
      this.$emit('input', val);
		},
		uploadImage: {
			handler: function (val) {
        this.formData[this.currentFile] = val.preview;
			},
      deep: true
		},
  },
  methods: {

    handleSubmit () {
      let self = this;

      if (!self.formData.avatarFront) {
        self.$toast('请上传被保人身份证正面照');
        return;
      }
      if (!self.formData.avatarBack) {
        self.$toast('请上传被保人身份证反面照');
        return;
      }
      if (!self.formData.avatarCard) {
        self.$toast('请上传行驶证正页照');
        return;
      }
      if (!self.formData.avatarInvoice) {
        self.$toast('请上传行驶证副页照');
        return;
      }

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
      });

      let images = [
        {
          imageMode: 'JPG',
          imageUrl: self.formData.avatarFront,
        },
        {
          imageMode: 'JPG',
          imageUrl: self.formData.avatarBack,
        },
        {
          imageMode: 'JPG',
          imageUrl: self.formData.avatarCard,
        },
        {
          imageMode: 'JPG',
          imageUrl: self.formData.avatarInvoice,
        },
      ];
      if (self.formData.avatarSeat) {
        images.push({
          imageMode: 'JPG',
          imageUrl: self.formData.avatarSeat,
        });
      }
      if (self.formData.avatarCertificate) {
        images.push({
          imageMode: 'JPG',
          imageUrl: self.formData.avatarCertificate,
        });
      }

      Models.Insurance
      .uploadImage({
        taskId: self.taskId,
        imageInfos: images
      })
      .then((res) => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if (1 === res.code) {
          self.$toast('保存成功');
          self.$emit('upload');
          self.cancel();
        }
        else {
          self.$toast(res.msg);
        }
      })
      .catch(() => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
      });
    },

    /*
     * 取消设置
     */
    cancel () {
      this.visible = false;
		},

    clickInput (el) {
      this.$refs[el].click();
    },

    /*
     * 图片上传组件
     */
    setImage (e, el) {
			this.currentFile = el;
      if (!_.isEmpty(e)) {
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

    /*
     * 重置input file值
     */
    fileClose () {
      this.$refs[this.currentFile].value = '';
		},

  }
};