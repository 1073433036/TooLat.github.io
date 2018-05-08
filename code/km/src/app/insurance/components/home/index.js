import './index.scss';
import 'swiper/dist/css/swiper.css';

import _                  from 'lodash';
import Swiper             from 'swiper';
import Header             from '~common/components/header';
import Checkbox           from '~common/components/checkbox';
import Models             from '~common/models';
import LocalStorage       from '~common/services/localStorage.cookie';
import Validator          from '~common/services/validator';
import Dates              from '~common/components/dates';

import CityList           from './components/city_list';
import Abbreviation       from './data.json';

export default {
  name: 'insuranceHome',
  data () {
    return {
      /*
       * @param   address                      投保地区
       * @param   isShow                       显示隐藏投保地区
       * @param   formData                     提交表单
       * @param   formData.isNew               是否上牌
       * @param   formData.insureAreaCode      国标地区编码(市级)
       * @param   formData.carLicenseNo        车牌号不能为空
       * @param   formData.vinCode             车架号 (江苏地区传)
       * @param   formData.name                车主姓名不能为空
       * @param   carLicenseNoStorage          用作记录车牌是否改变
       * @param   isJiangSu                    是否是江苏地区
       * @param   point                        IP定位信息
       */
      address                         : '',
      isShow                          : false,
      formData: {
        isNew                         : false,
        insureAreaCode                : '',
        carLicenseNo                  : '',
        vinCode                       : '',
        name                          : '',
        endDate                       : '',
      },
      formTemp: {
			},
			swiperOption                    : {
        notNextTick                   : true,
        autoplay                      : 3000,
        grabCursor                    : true,
        pagination                    : '.swiper-pagination',
        paginationClickable           : true,
				mousewheelControl             : false,
				autoplayDisableOnInteraction  : false,
				observer                      : true,
				observeParents                : true,
        loop                          : true
      },
      isMaskVip                       : false,
      carLicenseNoStorage             : '',
      isJiangSu                       : false,
      point                           : {},
      isDate                          : false,

      // 麦广扬新增
      areaGroup: [
        { name: '长沙', day : 60 },
        { name: '温州', day : 60 },
        { name: '浙江', day : 60 },
        { name: '山东', day : 60 },
        { name: '江苏', day : 40 },
        { name: '福建', day : 30 },
        { name: '宁波', day : 30 },
      ],
      endMaxDate: 90,
      isTest: false,

      orderMsgHolder: false,
      orderMsg: {},
    };
  },
  components: {
		'app-header': Header,
		CityList,
    Checkbox,
    Dates,
  },
  computed: {
		userInfo () {
      return _.get(this.$store.get.state, 'App.userInfo') || {};
    }
  },
  created () {
    this.getForum();
    let isRead = LocalStorage.get('isRead');
    if (true !== isRead.data) {
      this.$router.push({
        name: 'insurance.AutoH5'
      });
    }
  },
  mounted () {
    this.getInsuranceOrderMsg();

		this.$nextTick(() => {
      /* eslint-disable */
      let swiper = new Swiper(this.$refs.mySwiper, this.swiperOption);
      /* eslint-enable */
    });

    let data = LocalStorage.get('autoInsur');
    if (!_.isEmpty(_.get(data, 'data'))) {
      this.formData.carLicenseNo = data.data.carLicenseNo;
      this.carLicenseNoStorage = data.data.carLicenseNo;
      this.formData.name = data.data.name;
      this.formData.insureAreaCode = data.data.city;
      this.formData.isNew = data.data.isNew;
      this.address = data.data.address;
      this.isJiangSu = data.data.isJiangSu;
    }

    // this.getPoint();

    this.isTest = _.get(this.$route, 'query.act') ? true : false;
	},
	watch: {
    '$route' () {
      this.isTest = _.get(this.$route, 'query.act') ? true : false;
    },
    userInfo (user) {
      this.isMaskVip = 1 === user.level * 1 ? true : false;
    },
    formData: {
      deep: true,
      handler (value) {
        /*
         * 把输入的车牌字母转为大写
         */
        if (value.carLicenseNo) {
          value.carLicenseNo = value.carLicenseNo.toUpperCase();
          let first = value.carLicenseNo.substr(0, 1);
          if (first && !/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]$/.test(first)) {
            this.$toast('请输入正确的车牌号码');
            value.carLicenseNo = '';
          }
          let second = value.carLicenseNo.substr(1, 1);
          if (second && !/^[A-Z]$/.test(second)) {
            this.$toast('请输入正确的车牌号码');
            value.carLicenseNo = value.carLicenseNo.substr(0, value.carLicenseNo.length - 1);
          }
          let third = value.carLicenseNo.substr(2, 4);
          if (third && !/^[A-Z0-9]{1,4}$/.test(third)) {
            this.$toast('请输入正确的车牌号码');
            value.carLicenseNo = value.carLicenseNo.substr(0, value.carLicenseNo.length - 1);
          }
          let fourth = value.carLicenseNo.substr(6, value.carLicenseNo.length);
          if (fourth && !/^[A-Z0-9挂学警港澳]{1,2}$/.test(fourth)) {
            this.$toast('请输入正确的车牌号码');
            value.carLicenseNo = value.carLicenseNo.substr(0, value.carLicenseNo.length - 1);
          }
        }

        /*
         * 把输入的信息LocalStorage
         */
        this.saveLocalStorage('autoInsur', 'carLicenseNo', value.carLicenseNo);
        this.saveLocalStorage('autoInsur', 'name', value.name);
        this.saveLocalStorage('autoInsur', 'isNew', value.isNew);

      },
    },
    point (value) {
      let self = this;
      if (value && !this.address) {

        if (value.province_code && value.province) {
          self.address = value.province;

          let data = _.filter(Abbreviation, { code: value.city_code });

          if (!_.isEmpty(data)) {
            self.formData.carLicenseNo = data[0].no;
          }

          self.saveLocalStorage('autoInsur', 'prov', value.province_code);
          self.saveLocalStorage('autoInsur', 'address', self.address);

          if (value.city_code && value.city) {

            if (!_.isEmpty(data)) {
              self.formData.insureAreaCode = data[0].code;
              self.formData.carLicenseNo = data[0].no;
              self.saveLocalStorage('autoInsur', 'city', data[0].code);
            }
            self.address = self.address + '' + value.city;
            self.saveLocalStorage('autoInsur', 'address', self.address);

          }
        }
      }
    },

  },
  methods: {
    // 保险首页核保成功通知
    async getInsuranceOrderMsg () {
      let res = await Models.Insurance.getOrderMsg();
      if (res.code === 1) {
        this.orderMsgHolder = true;
        this.orderMsg = res.data;
      }
      else {
        this.orderMsgHolder = false;
        this.orderMsg = {};
      }
    },

		showUserDialog () {
      let self = this;
      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '请先完善个人资料',
        lists : [
          {
            msg: '取消',
          },
          {
            msg: '去完善',
            class: 'ok',
            func () {
              self.$router.push({ name: 'user.Profile', query: { dt: self.$route.path } });
            }
          },
        ]
      });
		},

		linkToRoute (options) {
      // 未完善个人信息
      // if (!this.userInfo.mobile) {
      //   this.showUserDialog();
      //   return;
      // }
      this.$router.push(options);
    },

    // 获取版块通知
    async getForum () {
      let res = await Models.Notify.forum('car_insurance');
      if (res.code === 1) {
        this.$store.get.dispatch({
          type: 'setSystemMessage',
          message: res.data
        });
      }
    },

    /*
     * 提交
     */
    submint () {
      // 未完善个人信息
			// if (!this.userInfo.mobile) {
			// 	this.showUserDialog();
			// 	return;
			// }

      let self = this;

      if (!self.formData.insureAreaCode) {
        self.$toast('请选择投保地区');
        return;
      }

      if (!self.formData.carLicenseNo && !self.formData.isNew) {
        self.$toast('请输入车牌号码');
        self.$refs.carLicenseNo.focus();
        return;
      }
      else if (!Validator.vehicleNumber(self.formData.carLicenseNo) && !self.formData.isNew) {
        self.$toast('请输入正确的车牌号码');
        self.$refs.carLicenseNo.focus();
        return;
      }

      if (self.isJiangSu && !self.formData.vinCode) {
        self.$toast('请输入车架号');
        self.$refs.vinCode.focus();
        return;
      }

      if (!self.formData.name) {
        self.$toast('请输入车主姓名');
        self.$refs.name.focus();
        return;
      }


      /**
        * 如果是模拟测试和已经上牌的条件下执行
        * 麦广扬操刀 + 1
        */
      if (true === self.isTest && !self.formData.isNew) {
        if (_.isEmpty(self.formData.endDate)) {
          self.$toast('请选择保险到期时间');
          return;
        }

        // 在特定地区里面搜索 匹配提前时间
        _.each(self.areaGroup, (item) => {
          if (-1 !== self.address.indexOf(item.name)) {
            self.endMaxDate = item.day;
            return;
          }
        });

        // 当前时间
        let day1 = new Date();

        // 选择时间
        let day2 = new Date(self.formData.endDate);

        let endTime = parseInt((day2 - day1) / (1000 * 60 * 60 * 24));

        if (endTime > self.endMaxDate) {
          self.$toast(`到期时间小于${self.endMaxDate}天才能进行投保`);
          return;
        }
      }

      if (self.formData.carLicenseNo !== self.carLicenseNoStorage || self.formData.isNew) {
        this.clearLocalStorage();
      }

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在提交，请稍等...',
      });

      if (!self.formData.isNew) {
        let data = {
          insureAreaCode: self.formData.insureAreaCode,
          carLicenseNo: self.formData.carLicenseNo,
          name: self.formData.name,
        };
        Models.Insurance
        .createTaskA(data)
        .then((res) => {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });
          if (1 === res.code) {
            let carInfo = res.data.carInfo;

            LocalStorage.set('quoteInfo', {
              setp1: self.formData,
              carInfo: carInfo,
            });

            let params = {
              id: self.formData.carLicenseNo,
              code: self.formData.insureAreaCode,
            };
            if (res.data.taskId) {
              params.taskId = res.data.taskId;
            }

            if (self.isTest) {
              params.act = 'test';
            }

            self.$router.push({
              name: 'insurance.PerfectCarMessage',
              query: params,
            });
          }
          else {

            LocalStorage.set('quoteInfo', {
              setp1: self.formData,
            });

            let params = {
              id: self.formData.carLicenseNo,
              code: self.formData.insureAreaCode,
            };

            if (self.isTest) {
              params.act = 'test';
            }

            self.$router.push({
              name: 'insurance.PerfectCarMessage',
              query: params,
            });
          }
        })
        .catch(() => {
          self.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });
        });
      }
      else {
        self.formData.carLicenseNo = '';
        LocalStorage.set('quoteInfo', {
          setp1: self.formData,
        });

        let params = {
          code: self.formData.insureAreaCode,
        };

        if (self.isTest) {
          params.act = 'test';
        }

        self.$router.push({
          name: 'insurance.PerfectCarMessage',
          query: params
        });
      }
		},

    /*
     * 限制投保
     */
    handleInsur () {
      let self = this;
      this.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '车险业务在线报价需要专业的平台高级会员以上才能操作，您目前只是普通会员不能进行保险报价操作，谢谢您的配合',
        lists : [
          {
            msg: '关闭',
          },
          {
            msg: '立即升级',
            class: 'ok',
            func () {
              let route = {
                name: 'user.BuyVip'
              };
              self.$router.push(route);
            },
          }
        ]
      });
    },

    /*
     * 选择投保地区
     */
    handleCityClick (obj) {
      let self = this;
      if (!_.isNull(obj) && _.isObject(obj)) {
        this.isShow = obj.status;
        if (!_.isEmpty(_.get(obj, 'content'))) {
          this.address = obj.content;
          this.formData.insureAreaCode = obj.number.city;

          let data = _.filter(Abbreviation, { code: obj.number.city });

          if (!_.isEmpty(data)) {
            if (self.formData.carLicenseNo.substr(0, 2) !== data[0].no) {
              self.formData.carLicenseNo = data[0].no;
              self.$refs.carLicenseNo.focus();
            }
          }

          this.saveLocalStorage('autoInsur', 'address', obj.content);
          this.saveLocalStorage('autoInsur', 'prov', obj.number.prov);
          this.saveLocalStorage('autoInsur', 'city', obj.number.city);

          if (320000 === obj.number.prov * 1) {
            this.isJiangSu = true;
            this.saveLocalStorage('autoInsur', 'isJiangSu', true);
          }
          else {
            this.isJiangSu = false;
            this.saveLocalStorage('autoInsur', 'isJiangSu', false);
          }

        }
        return;
      }
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

    /*
     * 车牌有变 - 清除本地存储
     */
    clearLocalStorage () {
      let self = this;
      let arr = [
        'idcardNo',
        'idcardType',
        'property',
        'carProperty',
        'modelLoads',
        'isModelLoads',
        'isTransferCar',
        'transferDate',
        'isRegister',
        'prvList',
        'price',
        'registDate',
        'vinCode',
        'engineNo',
        'brand',
      ];
      arr.forEach((item) => {
        self.saveLocalStorage('autoInsur', item, '');
      });
    },

    async getPoint () {
      let data = await Models.Home
      .localCity()
      .then(res => res);
      if (1 === data.code) {
        this.point = _.assign({}, this.point, data.data);
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
     * 日期组件回调
     */
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isDate = obj.status;
          this.formData[this.formIndex] = obj.content;
          return;
        }
      }
    },

  },
};
