import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import BombBox            from '~common/components/bomb_box';
import Models             from '~common/models';
import Search             from './components/search';
import Dates              from '~common/components/dates';
import LocalStorage       from '~common/services/localStorage.cookie';
import Validator          from '~common/services/validator';

export default {
  name: 'CardInsurance',
  data () {
    return {
			active:false,
      /*
       * @param idcardType        证件类型
       * @param idcardNo          证件
       * @param registDate        初登日期
       * @param vinCode           车架号
       * @param engineNo          发动机号
       * @param brand             品牌
       * @param price             新车发票价
       * @param carLicenseNo      车牌号
       * @param seat              核定载客人数
       * @param property          车辆所属性质
       * @param carProperty       车辆使用性质
       * @param modelLoads        核定载重量
       * @param isTransferCar     过户车 Y/N
       * @param transferDate      过户日期
       */
			formData:{
				idcardType                : {},
        idcardNo                  : '',
        registDate                : '',
        vinCode                   : '',
        engineNo                  : '',
        brand                     : {},
        price                     : '',
        seat                      : '',
        property                  : {},
        carProperty               : {},
        modelLoads                : '',
				isTransferCar             : {},
        transferDate              : '',
			},
			formTemp:{
				idcardType: [
          {
            name                  :'身份证',
            value                 :0,
          },
          {
            name                  :'户口本',
            value                 :1
          },
          {
            name                  :'驾驶证',
            value                 :2
          },
          {
            name                  :'军官证/士兵证',
            value                 :3
          },
          {
            name                  :'护照',
            value                 :4
          },
          {
            name                  :'港澳回乡证/台胞证',
            value                 :5
          },
          {
            name                  :'组织代码证',
            value                 :6
          },
          {
            name                  :'其他证件',
            value                 :7
          },
          {
            name                  :'社会信用代码证',
            value                 :8
          },
          {
            name                  :'税务登记证',
            value                 :9
          },
          {
            name                  :'营业执照',
            value                 :10
          },
          {
            name                  :'香港身份证',
            value                 :11
          },
        ],
				property:[
					{
						name: '个人用车',
						value: 0,
            children: [
              {
                name: '家庭自用汽车',
                value: 1,
                isShow: false,
              },
              {
                name: '出租租凭营业客车',
                value: 2,
                isShow: false,
              },
              {
                name: '城市公交营业客车',
                value: 3,
                isShow: false,
              },
              {
                name: '公路客运营业客车',
                value: 4,
                isShow: false,
              },
              {
                name: '旅游营业客车',
                value: 5,
                isShow: false,
              },
              {
                name: '营业货车',
                value: 6,
                isShow: true,
              },
              {
                name: '非营业货运',
                value: 12,
                isShow: true,
              },
              {
                name: '营业特种车',
                value: 15,
                isShow: true,
              },
              {
                name: '非营业特种车',
                value: 16,
                isShow: true,
              },
            ],
					},
					{
						name: '企业用车',
						value: 1,
            children: [
              {
                name: '出租租凭营业客车',
                value: 2,
                isShow: false,
              },
              {
                name: '城市公交营业客车',
                value: 3,
                isShow: false,
              },
              {
                name: '公路客运营业客车',
                value: 4,
                isShow: false,
              },
              {
                name: '旅游营业客车',
                value: 5,
                isShow: false,
              },
              {
                name: '营业货车',
                value: 6,
                isShow: true,
              },
              {
                name: '企业非营业客车',
                value: 10,
                isShow: false,
              },
              {
                name: '机关非营业客车',
                value: 11,
                isShow: false,
              },
              {
                name: '非营业货车',
                value: 12,
                isShow: true,
              },
              {
                name: '营业特种车',
                value: 15,
                isShow: true,
              },
              {
                name: '非营业特种车',
                value: 16,
                isShow: true,
              },
            ],
					},
					{
						name:'机关团队用车',
						value: 2,
            children: [
              {
                name: '出租租凭营业客车',
                value: 2,
                isShow: false,
              },
              {
                name: '城市公交营业客车',
                value: 3,
                isShow: false,
              },
              {
                name: '公路客运营业客车',
                value: 4,
                isShow: false,
              },
              {
                name: '旅游营业客车',
                value: 5,
                isShow: false,
              },
              {
                name: '营业货车',
                value: 6,
                isShow: true,
              },
              {
                name: '企业非营业客车',
                value: 10,
                isShow: false,
              },
              {
                name: '机关非营业客车',
                value: 11,
                isShow: false,
              },
              {
                name: '非营业货车',
                value: 12,
                isShow: true,
              },
              {
                name: '营业特种车',
                value: 15,
                isShow: true,
              },
              {
                name: '非营业特种车',
                value: 16,
                isShow: true,
              },
            ],
					},
				],
				carProperty:[],
				isTransferCar:[
					{
						name: '是',
						value: 'Y',
					},
					{
						name: '否',
						value: 'N',
					},
				],
			},
      /*
       * @param  1  bombShow      组件状态
       * @param  2  formIndex     组件标记
       * @param  3  isShow        搜索状态
       * @param  4  isModelLoads  核定载重量状态
       * @param  5  vehicleName   默认
       * @param  6  isNew         是否已上牌
       * @param  7  isRegister    标记是否大于9个月
       */
			bombShow         : false,
			formIndex        : '',
      isShow           : false,
      isDate           : false,
      isModelLoads     : false,
      carInfo          : {},
      isNew            : false,
      isRegister       : false,

      isDialogShow     : false,
      photoData        : undefined,
      base64           : '',
		};
	},
  components: {
		'app-header': Header,
		BombBox,
    Search,
    Dates,
	},
	computed: {
    userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    },
    /*
     * @param  1  carLicenseNo       车牌号
     * @param  2  code               市级地区编码
     */
    carLicenseNo () {
      return this.$route.query.id || '';
    },
    code () {
      return this.$route.query.code;
    },
    taskId () {
      return this.$route.query.taskId || '';
    },
	},
	mounted () {
    this.getLocalStorage();
	},
	watch: {
    formData: {
      deep: true,
      handler (value) {
        this.handlePassChange();
        if (value.vinCode) {
          value.vinCode = value.vinCode.toUpperCase();
        }
        if (value.engineNo) {
          value.engineNo = value.engineNo.toUpperCase();
        }
        /*
         * 把输入的信息LocalStorage
         */
        this.saveLocalStorage('autoInsur', 'idcardNo', value.idcardNo);
        this.saveLocalStorage('autoInsur', 'price', value.price);
        this.saveLocalStorage('autoInsur', 'modelLoads', value.modelLoads);
        this.saveLocalStorage('autoInsur', 'vinCode', value.vinCode);
        this.saveLocalStorage('autoInsur', 'engineNo', value.engineNo);
        this.saveLocalStorage('autoInsur', 'seat', value.seat);
      }
    },

    // 核定载重量只能为正整数
    'formData.modelLoads' (value) {
      if (true !== this.$rules.integer(value)) {
        this.$toast('请输入正整数');
        this.formData.modelLoads = '';
      }
    }

  },
  methods: {

    /*
     * 是否完善表单
     */
    handlePassChange () {
      let flag = !_.isEmpty(this.formData.idcardType.name) &&
        !_.isEmpty(this.formData.idcardNo) &&
        !_.isEmpty(this.formData.registDate) &&
        !_.isEmpty(this.formData.vinCode) &&
        !_.isEmpty(this.formData.engineNo) &&
        !_.isEmpty(this.formData.brand) &&
        !_.isEmpty(this.formData.seat) &&
        !_.isEmpty(this.formData.property.name) &&
        !_.isEmpty(this.formData.carProperty.name) &&
        !_.isEmpty(this.formData.isTransferCar.name);
      if (flag) {
        this.active = true;
      }
      else {
        this.active = false;
      }
    },

    /*
     * 处理型号
     */
    handleCar (item) {
      this.formData.brand = item;
      this.formData.price = item.price;
      this.formData.seat = item.seat;
      this.saveLocalStorage('autoInsur', 'brand', item);
    },

    /*
     * 提交
     */
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      if (0 === self.formData.idcardType.value && !Validator.identity(self.formData.idcardNo)) {
        self.$toast('请输入正确的证件号码');
        self.$refs.idcardNo.focus();
        return;
      }

      if (this.isModelLoads && !self.formData.modelLoads) {
        self.$toast('请输入核定载重量');
        return;
      }

      if ('Y' === self.formData.isTransferCar.value && !self.formData.transferDate) {
        self.$toast('请选择过户日期');
        return;
      }

      let quoteInfo  = LocalStorage.get('quoteInfo');

      /*
       * 后端保存
       */
      let info = {
        insureAreaCode            : self.code,
        name                      : _.get(quoteInfo, 'data.setp1.name'),
        idcardType                : self.formData.idcardType.value,
        idcardNo                  : self.formData.idcardNo,
        registDate                : self.formData.registDate,
        vinCode                   : self.formData.vinCode,
        engineNo                  : self.formData.engineNo,
        brand                     : self.formData.brand.vehicleName,
        vehicleName               : self.formData.brand.vehicleName,
        vehicleId                 : self.formData.brand.vehicleId,
        seat                      : this.formData.seat,
        carLicenseNo              : self.carLicenseNo,
        property                  : self.formData.property.value,
        carProperty               : self.formData.carProperty.value,
        modelLoads                : self.formData.modelLoads,
        isTransferCar             : self.formData.isTransferCar.value,
        transferDate              : self.formData.transferDate,
      };

      /*
       * 第三方保存
       */
      let data = {
        idcardType                : self.formData.idcardType.value,
        idcardNo                  : self.formData.idcardNo,
        // registDate                : self.formData.registDate,
        // vinCode                   : self.formData.vinCode,
        // engineNo                  : self.formData.engineNo,
        // brand                     : self.formData.brand.vehicleName,
        // vehicleId                 : self.formData.brand.vehicleId || '',
        // carLicenseNo              : self.carLicenseNo,
        seat                      : self.formData.seat,
        property                  : self.formData.property.value,
        carProperty               : self.formData.carProperty.value,
        // modelLoads                : self.formData.modelLoads,
        isTransferCar             : self.formData.isTransferCar.value,
      };

      /*
       * 车牌号码
       */
      if (this.carInfo.carLicenseNo) {
        data.carLicenseNo = this.carLicenseNo;
      }

      /*
       * 车辆初登日期
       */
      if (this.carInfo.registDate !== this.formData.registDate) {
        data.registDate = this.formData.registDate;
      }

      /*
       * 发动机号
       */
      if (this.carInfo.engineNo !== this.formData.engineNo) {
        data.engineNo = this.formData.engineNo;
      }

      /*
       * 品牌类型和ID
       */
      if (this.carInfo.vehicleName !== this.formData.brand.vehicleName) {
        data.vehicleName = this.formData.brand.vehicleName;
        data.vehicleId   = this.formData.brand.vehicleId;
      }

      /*
       * 车架号
       */
      if (this.carInfo.vinCode !== this.formData.vinCode) {
        data.vinCode = this.formData.vinCode;
      }

      /*
       * 载重
       */
      if (self.formData.modelLoads) {
        data.modelLoads = self.formData.modelLoads;
      }

      /*
       * 过户日期
       */
      if (self.formData.transferDate) {
        data.transferDate = self.formData.transferDate;
      }

      /*
       * 新车发票价
       */
      if (this.isRegister || this.isNew) {
        if (self.formData.price) {
          data.price = self.formData.price;
          info.price = self.formData.price;
        }
        else {
          self.$toast('请输入发票价');
          return;
        }
      }

      if (!_.isEmpty(quoteInfo.data)) {
        quoteInfo.data.setp2 = data;
      }
      LocalStorage.set('quoteInfo', quoteInfo.data);

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
      });

      /*
       * 普通用户开始模拟
       */
      if (1 >= self.userInfo.level * 1) {
        // let type = 1;
        // let vehicle = [
        //   ['宝骏', '比亚迪', '北汽幻速', '宝沃', '北汽绅宝', '北汽新能源', '长安', '长城', '东风风神', '东风风光', '东风风行', '东风小康', '菲亚特', '广汽传祺', '哈佛', '海马', '华泰', '哈飞', '吉利', '江淮', '金杯', '铃木', '猎豹汽车', '陆风', '纳智捷', '欧宝', '奇瑞', '启辰', '荣威', '五菱汽车', '众泰', '中华'],
        //   ['本田', '别克', '标志', '大众', 'DS', '丰田', '福特', 'MGC', 'Jeep', '马自达', '名爵', '讴歌', '起亚', '日产', '斯柯达', '三菱', '斯巴鲁', '现代', '雪佛兰', '雪铁龙'],
        //   ['奔驰', '宝马', '保时捷', '路虎', '奥迪', '宾利', '悍马', '捷豹', '卡迪拉克', '雷克萨斯', '林肯', '兰博基尼', '劳斯莱斯', '莲花汽车', '玛莎拉蒂', '迈巴赫', 'MINI', '特斯拉', '沃尔沃', '英菲尼迪'],
        // ];
        // vehicle.forEach((item, index) => {
        //   item.forEach((brand) => {
        //     if (-1 !== self.formData.brand.vehicleName.indexOf(brand)) {
        //       type = index + 1;
        //     }
        //   });
        // });

        // 固定使用第二套模板
        self.$router.push({name: 'insurance.CopyStepsCompany', query:{type: 2}});
        return;
      }

      Models.Insurance
      .carAdd(info)
      .then((res) => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if (1 === res.code) {
          let params = {
            code: self.code,
          };
          if (self.taskId) {
            params.taskId = self.taskId;
          }

          if ('test' === _.get(self.$route, 'query.act')) {
            params.act = 'test';
          }

          self.$router.push({
            name: 'insurance.InsuranceCompany',
            query: params,
          });
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

		// 底部弹框组件
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {

            _.assign(this.formData, {
              [this.formIndex]: obj.content
            });
            this.saveLocalStorage('autoInsur', [this.formIndex], obj.content);

            /*
             * 不是过户车，则清除过户日期
             */
            if ('isTransferCar' === this.formIndex && 'N' === this.formData.isTransferCar.value) {
              this.formData.transferDate = '';
            }

            /*
             * 车辆所属性质、车辆使用性质及核定载质量三者之间显示的关联关系
             */
            if ('property' === this.formIndex) {
              this.formData.carProperty = '';
              this.saveLocalStorage('autoInsur', 'carProperty', '');
              this.formTemp.carProperty = this.formTemp.property[obj.content.value].children;
              this.saveLocalStorage('autoInsur', 'formTempCarProperty', this.formTemp.property[obj.content.value].children);
            }
            if ('carProperty' === this.formIndex) {
              if (obj.content.isShow) {
                this.isModelLoads = true;
                this.saveLocalStorage('autoInsur', 'isModelLoads', true);
              }
              else {
                this.formData.modelLoads = '';
                this.isModelLoads = false;
                this.saveLocalStorage('autoInsur', 'modelLoads', '');
                this.saveLocalStorage('autoInsur', 'isModelLoads', false);
              }
            }

          }
          return;
        }
      }
    },
		// 所属组件
    handleBombBoxChange (index) {
      if ('carProperty' === index && !this.formData.property.name) {
        this.$toast('请先选择车辆所属性质');
        return;
      }
      this.formIndex  = index;
      this.bombShow   = true;
		},

    /*
     * 日期组件回调
     */
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isDate = obj.status;
          this.formData[this.formIndex] = obj.content;
          this.saveLocalStorage('autoInsur', [this.formIndex], obj.content);

          if ('registDate' === this.formIndex) {
            if (9 < this.getMonths(obj.content)) {
              this.isRegister = false;
              this.saveLocalStorage('autoInsur', 'isRegister', false);
            }
            else {
              this.isRegister = true;
              this.saveLocalStorage('autoInsur', 'isRegister', true);
            }
          }
          return;
        }
      }
    },

    /*
     * 日期组件改变
     */
    handleDateChange (item) {
      this.isDate     = true;
      this.formIndex  = item;
    },

    /*
     * 如果有则获取车辆信息
     */
    getLocalStorage () {
      let quoteInfo  = LocalStorage.get('quoteInfo');
      let data       = LocalStorage.get('autoInsur');
      let carInfo    = _.get(quoteInfo, 'data.carInfo');

      if (!_.isEmpty(carInfo)) {
        this.carInfo = carInfo;
      }

      if (!_.isEmpty(_.get(quoteInfo, 'data.setp1'))) {
        this.isNew = quoteInfo.data.setp1.isNew;
      }

      if (!_.isEmpty(_.get(data, 'data'))) {
        /*
         * 证件类型
         * 证件号码
         */
        this.formData.idcardNo = data.data.idcardNo;
        if (!_.isEmpty(_.get(data.data, 'idcardType'))) {
          this.formData.idcardType = {
            value: data.data.idcardType.value,
            name: data.data.idcardType.name,
          };
        }
        /*
         * 新车发票价
         * 车辆初登日期
         * 车辆识别代号
         */
        this.formData.price = data.data.price;
        if (!_.isEmpty(_.get(data.data, 'registDate'))) {
          this.formData.registDate = data.data.registDate;
        }
        else if (!_.isEmpty(_.get(carInfo, 'registDate'))) {
          this.formData.registDate = carInfo.registDate;
          this.saveLocalStorage('autoInsur', 'registDate', carInfo.registDate);
        }
        if (this.formData.registDate && 9 < this.getMonths(this.formData.registDate)) {
          this.saveLocalStorage('autoInsur', 'isRegister', false);
        }
        else {
          this.saveLocalStorage('autoInsur', 'isRegister', true);
        }
        if (!_.isEmpty(_.get(data.data, 'vinCode'))) {
          this.formData.vinCode = data.data.vinCode;
        }
        else if (!_.isEmpty(_.get(carInfo, 'vinCode'))) {
          this.formData.vinCode = carInfo.vinCode;
        }
        if (!_.isEmpty(_.get(data.data, 'engineNo'))) {
          this.formData.engineNo = data.data.engineNo;
        }
        else if (!_.isEmpty(_.get(carInfo, 'engineNo'))) {
          this.formData.engineNo = carInfo.engineNo;
        }
        if (!_.isEmpty(_.get(data.data, 'brand'))) {
          this.formData.brand.vehicleName = data.data.brand.vehicleName;
          this.formData.brand.vehicleId = data.data.brand.vehicleId;
        }
        else if (!_.isEmpty(carInfo)) {
          this.formData.brand.vehicleName = carInfo.vehicleName;
          this.saveLocalStorage('autoInsur', 'brand', {vehicleName: carInfo.vehicleName});
        }
        if (!_.isEmpty(_.get(data.data, 'seat'))) {
          this.formData.seat = data.data.seat;
        }
        else if (!_.isEmpty(_.get(carInfo, 'seat'))) {
          this.formData.seat = carInfo.seat;
        }
        /*
         * 车辆所属性质
         * 车辆使用性质
         * 核定载重量
         */
        if (!_.isEmpty(_.get(data.data, 'property'))) {
          this.formData.property = {
            value: data.data.property.value,
            name: data.data.property.name,
          };
        }
        this.formTemp.carProperty = data.data.formTempCarProperty;
        if (!_.isEmpty(_.get(data.data, 'carProperty'))) {
          this.formData.carProperty = {
            value: data.data.carProperty.value,
            name: data.data.carProperty.name,
          };
        }
        /*
         * 是否过户车
         * 过户日期
         */
        this.formData.modelLoads = data.data.modelLoads;
        this.isModelLoads = data.data.isModelLoads;
        if (!_.isEmpty(_.get(data.data, 'isTransferCar'))) {
          this.formData.isTransferCar = {
            value: data.data.isTransferCar.value,
            name: data.data.isTransferCar.name,
          };
        }
        this.formData.transferDate = data.data.transferDate;
        this.isRegister = data.data.isRegister;
      }
    },

    /*
     * 计算月份差
     */
    getMonths (date) {
      let today = new Date(),
          registDate = new Date(date);
      let todayYear = today.getFullYear(),
          todayMouth = today.getMonth(),
          registYear = registDate.getFullYear(),
          registMouth = registDate.getMonth();
      let months = (todayYear - registYear) * 12 + (todayMouth - registMouth) + 1;
      return months;
    },

    /*
     * 本地存储
     */
    saveLocalStorage (name, key, value) {
      let data = LocalStorage.get([name]);
      if (!_.isEmpty(data, 'data')) {
        data.data[key] = value;
        LocalStorage.set([name], data.data);
      }
      else {
        LocalStorage.set([name], {
          [key]: value,
        });
      }
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
        this.formData.registDate = res.data.register_date;
        this.formData.vinCode = res.data.vin;
        this.formData.engineNo = res.data.engine_num;
        this.searchCar(res.data.model);
        this.isDialogShow = false;
      }
      else {
        this.$toast('识别失败');
      }
    },

    // 车辆信息搜索
    async searchCar (word) {
      /*
       * 过滤filterArr关键字
       */
      let filterArr = ['牌'];
      let keywordArr = word.split('');
      filterArr.forEach((item) => {
        let index = keywordArr.indexOf(item);
        if (-1 !== index) {
          keywordArr.splice(index, 1);
        }
      });
      let keyword = keywordArr.join('');

      Models.Insurance
      .queryCarModelInfos({
        vehicleName: keyword,
        page: 1,
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          if (0 === data.totalSize * 1) {
            this.formData.brand = {};
            this.formData.price = '';
            this.formData.seat = '';
          }
          else {
            let carModelInfo = data.carModelInfos[0];
            this.handleCar(carModelInfo);
          }
        }
        else {
          this.formData.brand = {};
          this.formData.price = '';
          this.formData.seat = '';
        }
      });
    }

  },
};
