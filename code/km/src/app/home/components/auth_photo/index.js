import './index.scss';

import _                from 'lodash';
import Header           from '~common/components/header';
import Tips             from '~common/components/tips';
import Cropper          from './components/cropper';
import Models           from '~common/models';

export default {
  name: 'auth-photo',
  data () {
    return {
      state: {
        active: false,
      },
      formData: {
        avatarFront: '',
        avatarBack: '',
        avatarHand: '',
        avatarCard:''
      },
      imgMark: '',
      cardId: '',
    };
  },
  components: {
    'app-header'    : Header,
    'app-tips'      : Tips,
    Cropper
  },
  computed: {
    uploadImage () {
      let data = _.get(this.$store.get.state, 'AuthPhotoCropper.content.data');
      return data;
    },
  },
  mounted () {
    let self = this;
    //用户已绑定的银行卡列表
    Models.Pay.userBundleLBankist().then(res => {
      if (1 === res.code) {
        self.cardId = res.data.data[0].id;
      }
      else {
        self.$toast(res.msg);
      }
    });
  },
  watch: {
    uploadImage (val) {
      if ('string' === typeof val) {
        if ('avatarFront' === this.imgMark) {
          this.formData.avatarFront = val;
        }
        else if ('avatarBack' === this.imgMark) {
          this.formData.avatarBack = val;
        }
        else if ('avatarHand' === this.imgMark) {
          this.formData.avatarHand = val;
        }
        else if ('avatarCard' === this.imgMark) {
          this.formData.avatarCard = val;
        }
      }
    },
    formData: {
      handler: function () {
        let self = this;
        let keys = Object.keys(self.formData);
        let active = keys.every(function (item) {
          if (self.formData[item]) {
            return true;
          }
        });
        if (active) {
          self.$nextTick(function () {
            self.$refs.lastUploadImg.addEventListener('load', function () {
              self.state.active = true;
            }, false);
          });
        }
      },
      deep: true
    }
  },
  methods: {
    setImage (e, str) {
      this.imgMark = str;
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

    handleSubmit () {
      if (this.state.active) {
        this.$router.push({name: 'home.EmptyPay'});
      }
    }
  }
};