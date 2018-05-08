import './index.scss';

import Header       from '~common/components/header';
import Models       from '~common/models';
import provConf     from './provinceConf';

export default {
  name: 'addCar',
  data () {
    return {
      carProvinces: [],
      carProvSelected: '',
      isProvPopupShow: false,
      carNumber: '',
      engineNum: '',
      vin: '',
      photoData: undefined,
      base64: '',
      isDialogShow: false,
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {

  },
  async mounted () {
    await this.getCarProvinces();
    // 根据用户省份 初始化车牌前缀
    let userInfo = this.$store.get.state.App.userInfo;
    let prov = userInfo ? userInfo.province_name : null;
    if (prov) {
      for (let i in provConf) {
        let reg = new RegExp(i);
        if (reg.test(prov) && this.carProvinces.includes(provConf[i])) {
          this.carProvSelected = provConf[i];
        }
      }
    }
  },
  watch: {
    carNumber (val) {
      this.carNumber = val.toUpperCase();
    }
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

    // 图片上传
    uploadLocalPhoto (e) {
      let ele = e.target.files[0];
      let imageData = window[window.webkitURL ? 'webkitURL' : 'URL'].createObjectURL(ele);
      this.photoData = imageData;

      let img = new Image();
      img.onload = () => {
        this.base64 = this.getBase64Image(img);
        this.takePhoto();
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
        this.engineNum = res.data.engine_num;
        this.vin = res.data.vin;
        this.isDialogShow = false;
      }
      else {
        this.$toast('识别失败');
      }
    },

    // 保存
    async goCarInfoVerifyHome () {
      if (!this.carNumber) {
        this.$toast('请输入车牌号码');
        return;
      }

      let res = await Models.CarVio.queryCarRule({
        params: {
          car_prefix: this.carProvSelected,
          car_number: this.carNumber
        }
      });
      if (res.code !== 1) {
        this.$toast(res.msg || '该地区暂不提供违章查询');
        return;
      }

      if (this.carProvSelected && this.carNumber && this.vin && this.engineNum) {
        this.addCar();
      }
      else {
        this.$router.push({
          name: 'home.IDVerifyHome',
          query: { carCode: this.carProvSelected + this.carNumber }
        });
      }
    },

    // 通过拍照添加  并且识别成功
    async addCar () {
      let params = {
        car_prefix: this.carProvSelected,
        car_number: this.carNumber,
        car_code: this.vin,
        car_drive_number: this.engineNum
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
          this.$router.replace({ name: 'home.CarBreak' });
        }, 1000);
      }
    }
  }
};
