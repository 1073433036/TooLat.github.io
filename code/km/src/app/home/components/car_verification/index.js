import './index.scss';

import Header       from '~common/components/header';
import Models       from '~common/models';

export default {
  name: 'CarVerification',
  data () {
    return {
      carProvinces: [],
      carProvSelected: '',
      carNumber: '',
      vin: '',
      carDriveNumber: '',
      isConfirmOn: false,
      phone: '',

      isProvPopupShow: false,
      isDialogShow: false,
      isPhotoShow: false,
      isVinShow: false,
      photoData: undefined,
      base64: '',
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
  },
  mounted () {
    this.carProvSelected = this.$route.query.carCode.charAt(0);
    this.carNumber = this.$route.query.carCode.substring(1);
    this.getCarProvinces();
  },
  watch: {
  },
  methods: {
    // 获取所有省份
    async getCarProvinces () {
      let res = await Models.CarVio.getCarProvinces();
      if (res.code === 1) {
        this.carProvinces = res.data;
        if (!this.carProvSelected) {
          this.carProvSelected = this.carProvinces[0];
        }
      }
    },

    // 选择车牌省份
    selectProv (el) {
      this.carProvSelected = el;
      this.isProvPopupShow = false;
    },

    closeDialog () {
      this.isPhotoShow = false;
      this.isVinShow = false;
      this.isDialogShow = false;
    },

    showPhotoDialog () {
      this.isPhotoShow = true;
      this.isDialogShow = true;
    },

    showVinDialog () {
      this.isVinShow = true;
      this.isDialogShow = true;
    },

    uploadLocalPhoto (e) {
      let ele = e.target.files[0];
      let imageData = window[window.webkitURL ? 'webkitURL' : 'URL'].createObjectURL(ele);
      this.photoData = imageData;

      let img = new Image();
      img.onload = () => {
        this.base64 = this.getBase64Image(img);
      };
      img.src = imageData;
    },

    getBase64Image (img) {
      let canvas = document.createElement('canvas');
      // canvas.width = img.width;
      // canvas.height = img.height;
      canvas.width = 400;
      canvas.height = 300;
      let ctx = canvas.getContext('2d');
      // ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0, 400, 300);
      let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
      let dataURL = canvas.toDataURL('image/' + ext);
      return dataURL;
    },

    // 识别驾驶证
    async takePhoto () {
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let res = await Models.CarVio.distNumber({
        type: 'face',
        image: this.base64
      });
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: false
      });
      if (res.code === 1 && res.data.plate_num) {
        this.$toast('识别成功');
        let plateNum = res.data.plate_num;
        this.carProvSelected = plateNum.charAt(0);
        this.carNumber = plateNum.substring(1);
        this.vin = res.data.vin;
        this.carDriveNumber = res.data.engine_num;
        this.closeDialog();
      }
      else {
        this.$toast('识别失败');
      }
    },

    // 保存并查询
    async addCar () {
      if (!this.carNumber) {
        this.$toast('请输入车牌号');
        return;
      }
      if (!this.vin) {
        this.$toast('请输入车身架号');
        return;
      }
      if (!this.carDriveNumber) {
        this.$toast('请输入发动机号');
        return;
      }
      // if (this.isConfirmOn && !this.phone) {
      //   this.$toast('请输入手机号码');
      //   return;
      // }
      let params = {
        car_prefix: this.carProvSelected,
        car_number: this.carNumber,
        car_code: this.vin,
        car_drive_number: this.carDriveNumber
      };
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: true
      });
      let res = await Models.CarVio.addCar(params);
      this.$store.get.dispatch({
        type: 'Loading',
        isShow: false
      });
      this.$toast(res.msg);
      if (res.code === 1) {
        setTimeout(() => {
          // this.$router.replace({ name: 'home.CarBreakDetail', params: { cid: res.data.id } });
          this.$router.replace({ name: 'home.CarBreak' });
        }, 1000);
      }
    }
  }
};
