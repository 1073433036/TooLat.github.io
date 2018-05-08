import './index.scss';
// import 'swiper/dist/css/swiper.css';

import _                  from 'lodash';
import Header       		  from '~common/components/header';
import UploadingImages    from './components/uploading_images';
import Invoice            from './components/invoice';
import Checkbox           from '~common/components/checkbox';
import Models             from '~common/models';
import BombBox            from '~common/components/bomb_box';
import CityList           from '~common/components/city_list';
import Dates              from '~common/components/dates';
import Services           from '~common/services';
// import Swiper             from 'swiper';
import axios              from 'axios';

export default {
  name: 'PerfectInsureMessage',
  data () {
    return {
      /*
       * @param  1  isProtocol                协议
       * @param  2  isStatement               投保声明
       * @param  3  isApplicant               投保人信息 - 是否与车主一致，true：是，false：否
       * @param  4  isInsured                 被保人信息 - 是否与车主一致，true：是，false：否
       * @param  5  isBeneficiary             索赔权益人信息 - 是否与车主一致，true：是，false：否
       * @param  6  isInvoice                 发票信息
       * @param  7  isImage                   影像信息
       * @param  8  isUploadImage             是否已上传影像信息
       */
      isProtocol              : true,
      isStatement             : false,
      isApplicant             : true,
      isInsured               : true,
      isBeneficiary           : true,
      isInvoice               : false,
      isImage                 : false,
      isUploadImage           : false,
      /*
       * @param  1  formData.list             报价数据
       * @param  2  formData.carOwner         车主信息
       * @param  2.1  name                    姓名
       * @param  2.2  idcardType              证件类型
       * @param  2.3  idcardNo                证件号
       * @param  2.4  phone                   手机号码
       * @param  2.5  email                   电子邮箱
       * @param  3  formData.applicant        投保人信息
       * @param  4  formData.insured          被保人信息
       * @param  5  formData.beneficiary      索赔权益人信息
       */
      formData                : {
        list                  : '',
        carOwner              : {
          name                : '',
          idcardType          : '',
          idcardNo            : '',
          idcardName          : '',
          phone               : '',
          email               : '',
        },
        applicant             : {
          name                : '',
          idcardType          : '',
          idcardNo            : '',
          idcardName          : '',
          phone               : '',
          email               : '',
        },
        insured               : {
          name                : '',
          idcardType          : '',
          idcardNo            : '',
          idcardName          : '',
          phone               : '',
          email               : '',
        },
        beneficiary           : {
          name                : '',
          idcardType          : '',
          idcardNo            : '',
          idcardName          : '',
          phone               : '',
          email               : '',
        },
        delivery              : {
          deliveryType        : 1,
          name                : '',
          phone               : '',
          province            : '',
          provinceName        : '',
          city                : '',
          cityName            : '',
          area                : '',
          areaName            : '',
          address             : '',
        },
      },
      formTemp                : {
        carOwner              : [
          {
            name              :'身份证',
            value             :0,
          },
          {
            name              :'户口本',
            value             :1
          },
          {
            name              :'驾驶证',
            value             :2
          },
          {
            name              :'军官证/士兵证',
            value             :3
          },
          {
            name              :'护照',
            value             :4
          },
          {
            name              :'港澳回乡证/台胞证',
            value             :5
          },
          {
            name              :'组织代码证',
            value             :6
          },
          {
            name              :'其他证件',
            value             :7
          },
          {
            name              :'社会信用代码证',
            value             :8
          },
          {
            name              :'税务登记证',
            value             :9
          },
          {
            name              :'营业执照',
            value             :10
          },
          {
            name              :'香港身份证',
            value             :11
          },
        ],
        applicant             : [
          {
            name              :'身份证',
            value             :0,
          },
          {
            name              :'户口本',
            value             :1
          },
          {
            name              :'驾驶证',
            value             :2
          },
          {
            name              :'军官证/士兵证',
            value             :3
          },
          {
            name              :'护照',
            value             :4
          },
          {
            name              :'港澳回乡证/台胞证',
            value             :5
          },
          {
            name              :'组织代码证',
            value             :6
          },
          {
            name              :'其他证件',
            value             :7
          },
          {
            name              :'社会信用代码证',
            value             :8
          },
          {
            name              :'税务登记证',
            value             :9
          },
          {
            name              :'营业执照',
            value             :10
          },
          {
            name              :'香港身份证',
            value             :11
          },
        ],
        insured               : [
          {
            name              :'身份证',
            value             :0,
          },
          {
            name              :'户口本',
            value             :1
          },
          {
            name              :'驾驶证',
            value             :2
          },
          {
            name              :'军官证/士兵证',
            value             :3
          },
          {
            name              :'护照',
            value             :4
          },
          {
            name              :'港澳回乡证/台胞证',
            value             :5
          },
          {
            name              :'组织代码证',
            value             :6
          },
          {
            name              :'其他证件',
            value             :7
          },
          {
            name              :'社会信用代码证',
            value             :8
          },
          {
            name              :'税务登记证',
            value             :9
          },
          {
            name              :'营业执照',
            value             :10
          },
          {
            name              :'香港身份证',
            value             :11
          },
        ],
        beneficiary           : [
          {
            name              :'身份证',
            value             :0,
          },
          {
            name              :'户口本',
            value             :1
          },
          {
            name              :'驾驶证',
            value             :2
          },
          {
            name              :'军官证/士兵证',
            value             :3
          },
          {
            name              :'护照',
            value             :4
          },
          {
            name              :'港澳回乡证/台胞证',
            value             :5
          },
          {
            name              :'组织代码证',
            value             :6
          },
          {
            name              :'其他证件',
            value             :7
          },
          {
            name              :'社会信用代码证',
            value             :8
          },
          {
            name              :'税务登记证',
            value             :9
          },
          {
            name              :'营业执照',
            value             :10
          },
          {
            name              :'香港身份证',
            value             :11
          },
        ],
      },
      /*
       * @param  1  bombShow                  组件状态
       * @param  2  formIndex                 组件标记
       * @param  3  remark                    备注
       * @param  4  isDate                    日期组件状态
       * @param  5  idcardList                证件类型数组
       * @param  6  idcardNum                 证件类型 - 发票用
       */
      bombShow                : false,
      formIndex               : '',
      remark                  : '',
      isDate                  : false,
      idcardList              : [
        '身份证',
        '户口本',
        '驾驶证',
        '军官证/士兵证',
        '护照',
        '港澳回乡证/台胞证',
        '组织代码证',
        '其他证件',
        '社会信用代码证',
        '税务登记证',
        '营业执照',
        '香港身份证',
      ],
      idcardNum               : [6, 8, 9, 10],
      /*
       * @param  1  ownerIDCardValidDate      车主身份证有效止期
       * @param  2  ownerAddress              车主身份证地址
       * @param  3  applicantIDCardValidDate  投保人身份证有效止期
       * @param  4  applicantAddress          投保人身份证地址
       * @param  5  insuredIDCardValidDate    被保人份证有效止期
       * @param  6  insuredAddress            被保人身份证地址
       * @param  7  drivingLicenseAddress     行驶证地址
       */
      ownerIDCardValidDate    : {
        itemCode: 'ownerIDCardValidDate',
        itemValue: '',
      },
      ownerAddress            : {
        itemCode: 'ownerAddress',
        itemValue: '',
      },
      applicantIDCardValidDate: {
        itemCode: 'applicantIDCardValidDate',
        itemValue: '',
      },
      applicantAddress        : {
        itemCode: 'applicantAddress',
        itemValue: '',
      },
      insuredIDCardValidDate  : {
        itemCode: 'insuredIDCardValidDate',
        itemValue: '',
      },
      insuredAddress          : {
        itemCode: 'insuredAddress',
        itemValue: '',
      },
      drivingLicenseAddress   : {
        itemCode: 'drivingLicenseAddress',
        itemValue: '',
      },
      /*
       * @param  1  invoiceInfo               发票信息
       */
      invoiceInfo             : {
        invoiceType           : -1,
        bankName              : '',
        accountNumber         : '',
        identifyNumber        : '',
        registerPhone         : '',
        registerAddress       : '',
        email                 : '',
      },
      showAddress             : '',

      swiper                  : '',
      swiperOption            : {
        scrollbar             : this.$refs.scrollbar,
        direction             : 'vertical',
        slidesPerView         : 'auto',
        autoHeight            : 'auto',
        // mousewheelControl: true,
        freeMode: true,
        // nested: true,
      },
      scrollTop               : '',
    };
  },
  components: {
		'app-header'    : Header,
		UploadingImages,
    Checkbox,
    BombBox,
    CityList,
    Invoice,
    Dates,
  },
  computed: {
    taskId () {
      return this.$route.query.taskId;
    },
    prvId () {
      return this.$route.query.prvId;
    },
    provObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },
    cityObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },
    areaObj () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
    },
    address () {
      let data = `${_.get(this.provObj, 'region_name') || ''}${_.get(this.cityObj, 'region_name') || ''}${_.get(this.areaObj, 'region_name') || ''}`;
      return data;
    },
  },
  mounted () {
    /*let self = this;
    this.$nextTick(() => {
      self.swiper = new Swiper(self.$refs.mySwiper, self.swiperOption);
    });*/
    this.list();

    this.$scrollerUpdate(this.$refs.scroller);
  },
  watch: {
    formData: {
      deep: true,
      handler (value) {
        let flag = this.isApplicant && -1 !== this.idcardNum.indexOf(value.carOwner.idcardType * 1);
        if (flag && !this.invoiceInfo.bankName || -1 !== this.idcardNum.indexOf(value.applicant.idcardType * 1) && !this.invoiceInfo.bankName) {
          this.invoiceInfo.invoiceType = 0;
        }
      },
    },
    address (value) {
      this.showAddress = value;
    },
  },
  methods: {

    /*
     * 提交投保
     */
    handleSumbit () {
      let self = this;
      let res = self.$validator(self.$refs.form);
      if (0 !== res.code) {
        self.$toast(res.data.msg);
        return;
      }

      /*
       * 获取车主信息
       */
      if (0 === self.formData.carOwner.idcardType * 1 && !Services.Validator.identity(self.formData.carOwner.idcardNo)) {
        self.$toast('请输入正确的车主证件号码');
        return;
      }
      let carOwner = {
        name: self.formData.carOwner.name,
        idcardType: self.formData.carOwner.idcardType,
        idcardNo: self.formData.carOwner.idcardNo,
        phone: self.formData.carOwner.phone,
        email: self.formData.carOwner.email,
      };

      /*
       * 获取投保人信息
       */
      if (!self.isApplicant) {
        if (!self.formData.applicant.name) {
          self.$toast('请输入投保人姓名');
          return;
        }
        if ('' === self.formData.applicant.idcardType) {
          self.$toast('请选择投保人证件类型');
          return;
        }
        if (!self.formData.applicant.idcardNo) {
          self.$toast('请输入投保人证件号码');
          return;
        }
        else if (0 === self.formData.applicant.idcardType * 1 && !Services.Validator.identity(self.formData.applicant.idcardNo)) {
          self.$toast('请输入正确的投保人证件号码');
          return;
        }
        if (!self.applicantIDCardValidDate.itemValue) {
          self.$toast('请选择投保人证件有效止期');
          return;
        }
        if (!self.applicantAddress.itemValue) {
          self.$toast('请输入投保人证件地址');
          return;
        }
        if (!self.formData.applicant.phone) {
          self.$toast('请输入投保人手机号码');
          return;
        }
        else if (!Services.Validator.phone(self.formData.applicant.phone)) {
          self.$toast('请输入正确的投保人手机号码');
          return;
        }
        if (!self.formData.applicant.email) {
          self.$toast('请输入投保人邮箱');
          return;
        }
        else if (!Services.Validator.email(self.formData.applicant.email)) {
          self.$toast('请输入正确的投保人邮箱');
          return;
        }
      }
      else {
        self.formData.applicant = carOwner;
        self.applicantAddress.itemValue = self.ownerAddress.itemValue;
        self.applicantIDCardValidDate.itemValue = self.ownerIDCardValidDate.itemValue;
      }

      /*
       * 获取被保人信息
       */
      if (!self.isInsured) {
        if (!self.formData.insured.name) {
          self.$toast('请输入被保人姓名');
          return;
        }
        if ('' === self.formData.insured.idcardType) {
          self.$toast('请选择被保人证件类型');
          return;
        }
        if (!self.formData.insured.idcardNo) {
          self.$toast('请输入被保人证件号码');
          return;
        }
        else if (0 === self.formData.insured.idcardType * 1 && !Services.Validator.identity(self.formData.insured.idcardNo)) {
          self.$toast('请输入正确的被保人证件号码');
          return;
        }
        if (!self.insuredIDCardValidDate.itemValue) {
          self.$toast('请选择被保人证件有效止期');
          return;
        }
        if (!self.insuredAddress.itemValue) {
          self.$toast('请输入被保人证件地址');
          return;
        }
        if (!self.formData.insured.phone) {
          self.$toast('请输入被保人手机号码');
          return;
        }
        else if (!Services.Validator.phone(self.formData.insured.phone)) {
          self.$toast('请输入正确的被保人手机号码');
          return;
        }
        if (!self.formData.insured.email) {
          self.$toast('请输入被保人邮箱');
          return;
        }
        else if (!Services.Validator.email(self.formData.insured.email)) {
          self.$toast('请输入正确的被保人邮箱');
          return;
        }
      }
      else {
        self.formData.insured = carOwner;
        self.insuredAddress.itemValue = self.ownerAddress.itemValue;
        self.insuredIDCardValidDate.itemValue = self.ownerIDCardValidDate.itemValue;
      }

      /*
       * 获取索赔权益人信息
       */
      if (!self.isBeneficiary) {
        if (!self.formData.beneficiary.name) {
          self.$toast('请输入权益索赔人姓名');
          return;
        }
        if ('' === self.formData.beneficiary.idcardType) {
          self.$toast('请选择权益索赔人证件类型');
          return;
        }
        if (!self.formData.beneficiary.idcardNo) {
          self.$toast('请输入权益索赔人证件号码');
          return;
        }
        else if (0 === self.formData.beneficiary.idcardType * 1 && !Services.Validator.identity(self.formData.beneficiary.idcardNo)) {
          self.$toast('请输入正确的权益索赔人证件号码');
          return;
        }
        if (!self.formData.beneficiary.phone) {
          self.$toast('请输入权益索赔人手机号码');
          return;
        }
        else if (!Services.Validator.phone(self.formData.beneficiary.phone)) {
          self.$toast('请输入正确的手机号码');
          return;
        }
        if (!self.formData.beneficiary.email) {
          self.$toast('请输入权益索赔人邮箱');
          return;
        }
        else if (!Services.Validator.email(self.formData.beneficiary.email)) {
          self.$toast('请输入正确的权益索赔人邮箱');
          return;
        }
      }
      else {
        self.formData.beneficiary = carOwner;
      }

      if (!self.formData.delivery.name) {
        self.$toast('请输入收件人姓名');
        return;
      }
      if (!self.formData.delivery.phone) {
        self.$toast('请输入收件人手机号码');
        return;
      }
      else if (!Services.Validator.phone(self.formData.delivery.phone)) {
        self.$toast('请输入正确的手机号码');
        return;
      }
      if (!self.showAddress) {
        self.$toast('请选择收件人省市区');
        return;
      }
      if (!self.formData.delivery.address) {
        self.$toast('请输入收件人详细地址');
        return;
      }

      if (!self.isUploadImage) {
        self.$toast('请上传影像');
        return;
      }

      if (!self.isProtocol) {
        self.$toast('请同意投保声明');
        return;
      }

      /*
       * 提交信息
       */
      let quoteInfo = {
        taskId: self.taskId,
        prvId: self.prvId,
        remark: self.remark,
        carOwner: carOwner,
        applicant: self.formData.applicant,
        insured: self.formData.insured,
        beneficiary: self.formData.beneficiary,
        insureSupplys: [
          self.ownerIDCardValidDate,
          self.ownerAddress,
          self.applicantAddress,
          self.applicantIDCardValidDate,
          self.insuredAddress,
          self.insuredIDCardValidDate,
          self.drivingLicenseAddress,
        ],
      };

      /*
       * 发票信息
       */
      if (-1 !== self.idcardNum.indexOf(self.formData.applicant.idcardType * 1) && -1 === self.invoiceInfo.invoiceType) {
        self.$toast('请选择发票信息');
        return;
      }
      if (0 === self.invoiceInfo.invoiceType) {
        quoteInfo.invoiceInfo = {
          invoiceType: 0,
        };
      }
      if (1 === self.invoiceInfo.invoiceType) {
        quoteInfo.invoiceInfo = self.invoiceInfo;
      }

      /*
       * 地址信息 - 获取省市区编码
       */
      if (!self.formData.delivery.province) {
        self.formData.delivery.province = this.provObj.region_code;
        self.formData.delivery.provinceName = this.provObj.region_name;
      }
      if (!self.formData.delivery.city) {
        self.formData.delivery.city = this.cityObj.region_code;
        self.formData.delivery.cityName = this.cityObj.region_name;
      }
      if (!self.formData.delivery.area) {
        self.formData.delivery.area = this.areaObj.region_code;
        self.formData.delivery.areaName = this.areaObj.region_name;
      }
      let delivery = {
        taskId: self.taskId,
        delivery: self.formData.delivery,
      };

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
      });

      axios.all([
        Models.Insurance.updateTask(quoteInfo),
        Models.Insurance.addDelivery(delivery),
      ]).then(axios.spread((acct, perms) => {
        if (1 === acct.code && 1 === perms.code) {
          self.submitInsure();
        }
        else {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });
          self.$toast(acct.msg + ' ' + perms.msg);
        }
      }))
      .catch(() => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
      });
    },

    /*
     * 提交核保任务
     */
    submitInsure () {
      let self = this;
      Models.Insurance
      .submitInsure({
        taskId: self.taskId,
        prvId: self.prvId,
      })
      .then((res) => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if (1 === res.code) {
          self.$toast('投保成功，待审核');
          setTimeout(() => {
            self.$router.push({
              name: 'insurance.Indent'
            });
          }, 2000);
        }
        else {
          self.$store.get.dispatch({
            type  : 'handleChangeDialog',
            active: true,
            title : '温馨提示',
            msg   : res.msg,
            lists : [
              {
                msg: '确定'
              },
            ]
          });
        }
      });
    },

    /*
     * 上传影像回调
     */
    handleUpload () {
      this.isUploadImage = true;
    },

    /*
     * 报价详情
     */
    list () {
      let self = this;
      Models.Insurance
      .orderQuoteInfo({
        params: {
          taskId: self.taskId,
          prvId: self.prvId,
        }
      })
      .then((res) => {
        if (1 === res.code) {
          let data = res.data.q;
          self.formData.list = res.data;

          self.formData.carOwner = _.assign({}, self.formData.carOwner, data.carOwner);
          self.formData.carOwner.idcardName = self.idcardList[self.formData.carOwner.idcardType] || '';

          self.formData.applicant = _.assign({}, self.formData.applicant, data.applicant);
          self.formData.applicant.idcardName = self.idcardList[self.formData.applicant.idcardType] || '';
          if (!self.formData.applicant.idcardName) {
            self.formData.applicant = _.assign({}, self.formData.carOwner);
            self.$refs.applicant.currentValue = true;
          }
          else {
            self.$refs.applicant.currentValue = false;
          }

          self.formData.insured = _.assign({}, self.formData.insured, data.insured);
          self.formData.insured.idcardName = self.idcardList[self.formData.insured.idcardType] || '';
          if (!self.formData.insured.idcardName) {
            self.formData.insured = _.assign({}, self.formData.carOwner);
            self.$refs.insured.currentValue = true;
          }
          else {
            self.$refs.insured.currentValue = false;
          }

          self.formData.beneficiary = _.assign({}, self.formData.beneficiary, data.beneficiary);
          self.formData.beneficiary.idcardName = self.idcardList[self.formData.beneficiary.idcardType] || '';
          if (!self.formData.beneficiary.idcardName) {
            self.formData.beneficiary = _.assign({}, self.formData.carOwner);
            self.$refs.beneficiary.currentValue = true;
          }
          else {
            self.$refs.beneficiary.currentValue = false;
          }

          data.insureSupplys.forEach((item) => {
            this[item.itemCode].itemValue = item.itemValue;
          });

          if (data.invoiceInfo) {
            self.invoiceInfo.invoiceType = data.invoiceInfo.invoiceType * 1;
          }

          if (0 !== data.imageInfos.length * 1) {
            self.isUploadImage = true;
          }
        }
      });

      Models.Insurance
      .getDelivery({
        params: {
          taskId: self.taskId
        }
      })
      .then((res) => {
        if (1 === res.code && res.data) {
          self.formData.delivery = _.assign({}, self.formData.delivery, res.data);
          self.showAddress = res.data.provinceName + '' + res.data.cityName + '' + res.data.areaName;
        }
      });
    },

    /*
     * 底部弹框组件 - BombBox
     */
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {
            this.formData[this.formIndex].idcardType = obj.content.value;
            this.formData[this.formIndex].idcardName = obj.content.name;
          }
          return;
        }
      }
    },

    /*
     * 所属组件 - BombBox
     */
    handleBombBoxChange (index) {
      this.formIndex  = index;
      this.bombShow   = true;
    },

    /*
     * 城市切换
     */
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    /*
     * 日期组件回调
     */
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isDate = obj.status;
          this[this.formIndex].itemValue = obj.content;
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
     * 处理保存发票回调
     */
    handleInvoice (obj) {
      this.invoiceInfo = obj;
    },

    focusUpdata () {
      this.scrollTop = this.$refs.scroller.getPosition().top;
    },

    blurUpdata () {
      setTimeout(() => {
        this.$refs.scroller.scrollTo(0, this.scrollTop, true);
      }, 100);
    },

  },
};
