import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';
import Cropper          from '~common/components/cropper';

export default {
  name: 'intelligentStorage',
  data () {
    return {
      active: false,
      cardPic: '',
      formData:{
        bank_name: '',
        card_code: '',
        card_pic: '',
      },

      // formTemp: {
      //   id_card_front : '',
      //   id_card_back  : '',
      //   id_card_person: '',
      //   card_front    : ''
      // },
      // submitStatus: 0,
      // authStep:1,
      // stepTo: false,
      // photoData: '',
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
          this.cardPic = val.preview;
          this.formData.card_pic = val.url;
          let data = {
            key: this.formData.card_pic,
          };
          this.getCardInfo(data);
        }
      }
    },
  },
  methods: {
    // 获取银行卡信息
    async getCardInfo (data) {
      let self = this;
      await Models.Home
        .getCardInfo(data)
        .then(res => {
          console.log(res);
          if (res.code === 1) {
            self.formData.bank_name = res.data.cardname;
            self.formData.card_code = res.data.cardnumber;
          }
          else {
            self.$toast(res.msg);
            self.active = false;
            return;
          }
        });
      self.$nextTick(() => {
        self.$store.get.dispatch('SAVE_AUTHENTICATION_STEP2', self.formData);
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
            file: file
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
            this.formData.bank_name = data.bank_name;
            this.formData.card_code = data.card_code;
          }
        });
    },
    submitData () {
      this.$router.push({
        name: 'home.intelligentIdentity',
      });
    },
  }
};
