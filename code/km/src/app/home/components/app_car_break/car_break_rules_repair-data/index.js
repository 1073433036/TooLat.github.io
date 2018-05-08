import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'repairDataPage',
  data () {
    return {
      fileVlaue: null,
      frontImg: '',
      reverseImg: ''
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    carId () {
      return _.get(this.$store.get.state, 'CarBreak.content.carId');
    }
  },
  beforeRouteEnter (to, from, next) {
    next(function (vm) {
      if (!vm.carId) {
        vm.$router.push({name: 'home.AppMyCarInfo'});
      }
    });
  },
  mounted () {
  },
  watch: {},
  methods: {
    //重置上传图片
    insertAnimation (event, remarkStr) {
      if (!this.frontImg) {
        this.$toast('请先上传资料');
        return;
      }
      let target = event.target;
      target.classList.add('animation-reset');
      setTimeout(() => {
        target.classList.remove('animation-reset');
        if ('front' === remarkStr) {
          this.frontImg = '';
        }
        else if ('reverse' === remarkStr) {
          this.reverseImg = '';
        }
        this.$toast('重置成功');
      }, 1100);
    },
    // input选择图片
    upload (event, remarkStr) {
      let self = this;
      let file = event.target.files[0];
      if (!file) {
        return;
      }
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      setTimeout(() => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
      }, 4000);

      if (file.size < 1024 * 1024 * 10) {
        self.getBase(file, function (data) {
          Models.Upload
          .uploadImage({
            image: data,
          })
          .then((res) => {
            self.$store.get.dispatch({
              type: 'Loading',
              isShow: false
            });
            if (1 === res.code) {
              if ('front' === remarkStr) {
                self.frontImg = res.data.preview;
              }
              else if ('reverse' === remarkStr) {
                self.reverseImg = res.data.preview;
              }
            }
            else {
              self.$toast(res.msg);
            }
          });
        });
      }
      else {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        self.$toast('注意:每张图片大小不超过10M');
      }
    },
    // 压缩图片
    getBase (file, callback) {
      let reader = new FileReader(),
        image = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        data = '';
      reader.readAsDataURL(file);
      reader.onload = function () {
        image.src = this.result;
      };
      image.onload = function () {
        let w = image.naturalWidth,
          h = image.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h);
        data = canvas.toDataURL('image/jpeg', 0.8);
        if (callback && 'function' === typeof callback) {
          callback(data);
        }
      };
    },
    //跳转支付页面
    goOrderPayPage () {
      if (!this.frontImg) {
        this.$toast('请先上传行驶证正面');
        return;
      }
      // else if (!this.reverseImg) {
      //   this.$toast('请先上传行驶证反面');
      //   return;
      // }
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let data = {
        id: this.carId,
        car_license_photo: this.frontImg
      };
      Models.CarBreak.uploadCarLicenseImg(data).then( res => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false
        });
        if (1 === res.code) {
          this.$toast('上传成功');
          setTimeout(() => {
            this.$router.push({name: 'home.AppCarRulesQuery'});
          }, 500);
        }
        else {
          this.$toast(res.msg);
        }
      });
    }

  }
};