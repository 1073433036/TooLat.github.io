import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import BombBox            from '~common/components/bomb_box';
import Checkbox           from '~common/components/checkbox';
import Dates              from '~common/components/dates';
import Models             from '~common/models';
import LocalStorage       from '~common/services/localStorage.cookie';

export default {
  name: 'InsuranceAllocation',
  data () {
    return {
      insureType           : [
        {
          id               : 1,
          name             : '基础型',
        },
        {
          id               : 2,
          name             : '大众型',
        },
        {
          id               : 3,
          name             : '自动义',
        },
      ],
      insureTypeIndex      : '基础型',
      insureBackups        : '',
      /*
       * 底部弹框组件
       * @param  1   bombShow                         投保组件状态
       * @param  2   formIndex                        险种代码
       * @param  3   isShow                           日期组件状态
       */
      bombShow             : false,
      formIndex            : '',
      isShow               : false,

      /*
       * 险种代码
       * @param  1   VehicleDemageIns                 车辆损失险
       * @param  2   ThirdPartyIns                    第三者责任险
       * @param  3   DriverIns                        司机责任险
       * @param  4   PassengerIns                     乘客责任险
       * @param  5   TheftIns                         全车盗抢险
       * @param  6   GlassIns                         玻璃单独破碎险
       * @param  7   CombustionIns                    自燃损失险
       * @param  8   ScratchIns                       车身划痕险
       * @param  9   WadingIns                        涉水损失险
       * @param  10  VehicleDemageMissedThirdPartyCla 机动车损失保险无法找到第三方特约险
       * @param  11  SpecifyingPlantCla               指定专修厂险
       * @param  12  GoodsOnVehicleIns                车上货物责任险
       * @param  13  CompensationForMentalDistressIns 精神损害抚慰金责任险
       * @param  14  VehicleCompulsoryIns             交强险
       * @param  15  VehicleTax                       车船税
       */
      insuranceCode        : {
        VehicleDemageIns: {
          riskCode: 'VehicleDemageIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        ThirdPartyIns: {
          riskCode: 'ThirdPartyIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        DriverIns: {
          riskCode: 'DriverIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        PassengerIns: {
          riskCode: 'PassengerIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        TheftIns: {
          riskCode: 'TheftIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        GlassIns: {
          riskCode: 'GlassIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        CombustionIns: {
          riskCode: 'CombustionIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        ScratchIns: {
          riskCode: 'ScratchIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        WadingIns: {
          riskCode: 'WadingIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        VehicleDemageMissedThirdPartyCla: {
          riskCode: 'VehicleDemageMissedThirdPartyCla',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        SpecifyingPlantCla: {
          riskCode: 'SpecifyingPlantCla',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        GoodsOnVehicleIns: {
          riskCode: 'GoodsOnVehicleIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
        CompensationForMentalDistressIns: {
          riskCode: 'CompensationForMentalDistressIns',
          amount: 0,
          notDeductible: 'N',
          name: '不投保',
        },
      },
      formTemp             : {
        VehicleDemageIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '投保',
            value: 1,
          },
        ],
        ThirdPartyIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '5万',
            value: 50000,
          },
          {
            name: '10万',
            value: 100000,
          },
          {
            name: '15万',
            value: 150000,
          },
          {
            name: '20万',
            value: 200000,
          },
          {
            name: '30万',
            value: 300000,
          },
          {
            name: '50万',
            value: 500000,
          },
          {
            name: '100万',
            value: 1000000,
          },
          {
            name: '150万',
            value: 1500000,
          },
          {
            name: '200万',
            value: 2000000,
          },
          {
            name: '250万',
            value: 2500000,
          },
          {
            name: '300万',
            value: 3000000,
          },
        ],
        DriverIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '0.5万',
            value: 5000,
          },
          {
            name: '1万',
            value: 10000,
          },
          {
            name: '2万',
            value: 20000,
          },
          {
            name: '3万',
            value: 30000,
          },
          {
            name: '4万',
            value: 40000,
          },
          {
            name: '5万',
            value: 50000,
          },
          {
            name: '10万',
            value: 100000,
          },
          {
            name: '15万',
            value: 150000,
          },
          {
            name: '20万',
            value: 200000,
          },
          {
            name: '50万',
            value: 500000,
          },
        ],
        PassengerIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '0.5万/座',
            value: 5000,
          },
          {
            name: '1万/座',
            value: 10000,
          },
          {
            name: '2万/座',
            value: 20000,
          },
          {
            name: '3万/座',
            value: 30000,
          },
          {
            name: '4万/座',
            value: 40000,
          },
          {
            name: '5万/座',
            value: 50000,
          },
          {
            name: '10万/座',
            value: 100000,
          },
          {
            name: '15万/座',
            value: 150000,
          },
          {
            name: '20万/座',
            value: 200000,
          },
          {
            name: '50万/座',
            value: 500000,
          },
        ],
        TheftIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '投保',
            value: 1,
          },
        ],
        GlassIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '国产玻璃',
            value: 1,
          },
          {
            name: '进口玻璃',
            value: 2,
          },
        ],
        CombustionIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '投保',
            value: 1,
          },
        ],
        ScratchIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '2000元',
            value: 2000,
          },
          {
            name: '5000元',
            value: 5000,
          },
          {
            name: '10000元',
            value: 10000,
          },
          {
            name: '20000元',
            value: 20000,
          },
        ],
        WadingIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '投保',
            value: 1,
          },
        ],
        VehicleDemageMissedThirdPartyCla: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '投保',
            value: 1,
          },
        ],
        SpecifyingPlantCla: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '投保',
            value: 1,
          },
        ],
        GoodsOnVehicleIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '1万',
            value: 10000,
          },
          {
            name: '2万',
            value: 20000,
          },
          {
            name: '5万',
            value: 50000,
          },
          {
            name: '10万',
            value: 100000,
          },
          {
            name: '20万',
            value: 200000,
          },
        ],
        CompensationForMentalDistressIns: [
          {
            name: '不投保',
            value: 0,
          },
          {
            name: '1万',
            value: 10000,
          },
          {
            name: '2万',
            value: 20000,
          },
          {
            name: '3万',
            value: 30000,
          },
          {
            name: '4万',
            value: 40000,
          },
          {
            name: '5万',
            value: 50000,
          },
        ],
      },
      /*
       * 险种 - 投保前置条件
       * @param  1  VehicleDemageIns                  车辆损失险=投保
       * @param  2  ThirdPartyIns                     第三者责任险=投保
       */
      VehicleDemageIns      : [
        'GlassIns',
        'CombustionIns',
        'ScratchIns',
        'WadingIns',
        'VehicleDemageMissedThirdPartyCla',
        'SpecifyingPlantCla',
      ],
      ThirdPartyIns         : [
        'GoodsOnVehicleIns',
      ],
      /*
       * 交强险/车船税
       * @param  1  efcInsureInfo                     交强险
       * @param  2  isPaymentTax                      车船税 投保前置条件：交强险=购买
       * @param  3  bizInsureInfoDate.startDate       商业险起保日期
       * @param  4  bizInsureInfoDate.endDate         商业险终保日期
       * @param  5  efcInsureInfoDate.startDate       交强险起保日期
       * @param  6  efcInsureInfoDate.endDate         交强险终保日期
       */
      efcInsureInfo         : false,
      isPaymentTax          : false,
      bizInsureInfoDate     : {
        startDate           : '',
        endDate             : ''
      },
      efcInsureInfoDate     : {
        startDate           : '',
        endDate             : ''
      },
      /*
       * 险种前置拦截组件
       * @param  1   iSwarn                           险种前置拦截状态
       * @param  2   warnList                         拦截提示
       * @param  3   providers                        已选择的保险公司
       */
      iSwarn                : false,
      warnList              : [],
      providers             : [],
    };
  },
  components: {
		'app-header': Header,
    BombBox,
    Checkbox,
    Dates,
  },
  computed: {
    taskId () {
      return this.$route.query.taskId || '';
    },
    prvId () {
      return this.$route.query.prvId || '';
    },
	},
	watch: {
    /*
     * 取消交强险，同时取消车船税，清除投保日期
     * 默认显示当天的明天为起保日期
     */
    efcInsureInfo (value) {
      if (false === value) {
        this.$refs.paymentTax.currentValue = false;
        this.efcInsureInfoDate.startDate = '';
      }
      else if (!this.efcInsureInfoDate.startDate) {
        this.efcInsureInfoDate.startDate = this.handelDateType(0);
      }
    },
    insuranceCode: {
      deep: true,
      handler () {
        let state = false;
        for (let i in this.insuranceCode) {
          if (0 !== this.insuranceCode[i].amount * 1) {
            state = true;
          }
        }
        if (state) {
          if (!this.bizInsureInfoDate.startDate) {
            this.bizInsureInfoDate.startDate = this.handelDateType(0);
          }
        }
        else {
          this.bizInsureInfoDate.startDate = '';
        }
      }
    },
  },
  mounted () {
    this.getTask();
    let quoteInfo = _.get(LocalStorage.get('quoteInfo'), 'data');
    this.providers = quoteInfo.setp3;
  },
  methods: {

    /*
     * 切换保险类型
     */
    toggleType (name) {
      if (this.insureTypeIndex !== name) {
        this.insureTypeIndex = name;
      }
      switch (name) {
        case '基础型':
          this.insureBaseType();
          break;
        case '大众型':
          this.insureManyType();
          break;
        case '自动义':
          this.insureDefinedType();
          if (this.taskId && this.prvId) {
            this.backupsTask(this.insureBackups);
          }
          break;
      }
    },

    /*
     * 如果有任务id和供应商id，则获取任务配置
     */
    getTask () {
      let self = this;
      if (this.taskId) {
        let params = {
          taskId: self.taskId,
        };
        if (self.prvId) {
          params.prvId = self.prvId;
        }
        Models.Insurance
        .orderQuoteInfo({
          params: params
        })
        .then((res) => {
          if (1 === res.code) {
            self.insureBackups = res.data;
            self.backupsTask(res.data, 1);
          }
        });
      }
      else {
        self.insureTypeIndex = '基础型';
        self.insureBaseType();
      }
    },

    /*
     * 如果有任务id和供应商id，任务配置
     */
    backupsTask (data, index) {
      let self = this;
      let insureInfo = _.get(data, 'q.insureInfo');
      /*
       * 保险类型
       */
      if (index) {
        if (self.prvId) {
          if (!_.isEmpty(_.get(data, 'q.insureType'))) {
            self.insureTypeIndex = data.q.insureType;
          }
          else {
            self.insureTypeIndex = '自动义';
          }
        }
        else {
          self.insureTypeIndex = '基础型';
          self.insureBaseType();
        }
      }

      /*
       * 交强险
       */
      let efcInsureInfo = _.get(insureInfo, 'efcInsureInfo');
      if (_.get(efcInsureInfo, 'startDate') && efcInsureInfo.endDate) {
        self.$refs.efcInsureInfo.currentValue = true;
        self.efcInsureInfoDate.startDate = efcInsureInfo.startDate;
        self.efcInsureInfoDate.endDate = efcInsureInfo.endDate;
      }

      /*
       * 商业险
       */
      let bizInsureInfo = _.get(insureInfo, 'bizInsureInfo');
      if (_.get(bizInsureInfo, 'startDate') && bizInsureInfo.endDate) {
        self.bizInsureInfoDate.startDate = bizInsureInfo.startDate;
        self.bizInsureInfoDate.endDate = bizInsureInfo.endDate;
        bizInsureInfo.riskKinds.forEach((item) => {
          self.insuranceCode[item.riskCode] = _.assign({}, self.insuranceCode[item.riskCode], item);
          if (1 === item.amount * 1 || 2 === item.amount * 1) {
            if ('GlassIns' === item.riskCode) {
              switch (item.amount * 1) {
                case 1:
                  self.insuranceCode[item.riskCode].name = '国产玻璃';
                  break;
                case 2:
                  self.insuranceCode[item.riskCode].name = '进口玻璃';
                  break;
              }
            }
            else {
              self.insuranceCode[item.riskCode].name = '投保';
            }
          }
          else {
            self.insuranceCode[item.riskCode].name = self.insuranceCode[item.riskCode].amount * 1 / 10000 + '万';
          }
        });
      }

      /*
       * 车船税
       */
      let taxInsureInfo = _.get(insureInfo, 'taxInsureInfo');
      if (taxInsureInfo) {
        self.$refs.paymentTax.currentValue = true;
      }
    },

    /*
     * 开始报价
     * @param  1  bizInsureInfo.startDate              商业险起保日期
     * @param  2  bizInsureInfo.endDate                交强险终保日期
     * @param  3  bizInsureInfo.riskKinds              险种信息
     * @param  4  efcInsureInfo.startDate              交强险起保日期
     * @param  5  efcInsureInfo.endDate                交强险终保日期
     * @param  6  taxInsureInfo                        是否代缴车船税
     */
    handelQuote () {
      let self = this;
      self.iSwarn = false;
      let quoteInfo = _.get(LocalStorage.get('quoteInfo'), 'data');


      if (quoteInfo) {
        let locat = LocalStorage.get('quoteInfoCount');

        let carNo = _.get(quoteInfo, 'setp1.carLicenseNo');
        let now   = new Date();
        let cTime = parseInt(now.getTime() / 1000);
        if (_.isEmpty(locat.data)) {
          locat.data = [{
            carNo: carNo,
            time : cTime,
            num  : 1,
          }];

        }

        else {
          let index = _.findIndex(locat.data, { carNo: carNo });
          if (-1 === index) {
            locat.data.push({
              carNo: carNo,
              time : cTime,
              num  : 1,
            });
          }
          else {
            let day = new Date(locat.data[index].time * 1000).getDate();
            if (day !== now.getDate()) {
              locat.data[index] = {
                carNo: carNo,
                time : cTime,
                num  : 1,
              };
            }
            else {
              // if (5 <= locat.data[index].num) {
              //   this.$toast('该车辆当天报价已达到5次，请次日再尝试报价');
              //   return;
              // }
              // if (2 <= locat.data[index].num && 5 > locat.data[index].num) {
              //   this.$toast(`该车辆当天还可报价${4 - locat.data[index].num}次`);
              // }
              locat.data[index].num ++;
            }
          }
        }
        LocalStorage.set('quoteInfoCount', locat.data, 60 * 60 * 24 * 1);
      }
      /*
       * 险种信息
       */
      let bizInsureInfo = {
        startDate: '',
        endDate: '',
        riskKinds: [],
      };
      let riskKindsState = false;
      for (let i in  this.insuranceCode) {
        if (0 !== this.insuranceCode[i].amount * 1) {
          let riskExclude = ['GlassIns', 'VehicleDemageMissedThirdPartyCla', 'SpecifyingPlantCla', 'VehicleCompulsoryIns', 'VehicleTax'];
          let data = {
            riskCode: self.insuranceCode[i].riskCode,
            amount: self.insuranceCode[i].amount,
          };
          if (-1 === riskExclude.indexOf(data.riskCode)) {
            data.notDeductible = self.insuranceCode[i].notDeductible;
          }
          bizInsureInfo.riskKinds.push(data);
          riskKindsState = true;
        }
      }
      if (riskKindsState || this.efcInsureInfo) {
        bizInsureInfo.startDate = this.bizInsureInfoDate.startDate;
        bizInsureInfo.endDate   = this.bizInsureInfoDate.startDate ? this.handelDateType(1, this.bizInsureInfoDate.startDate) : '';
      }
      else {
        self.$toast('请选择一个险种再提交');
        return;
      }

      /*
       * 提交字段
       */
      let insureInfo = {
        bizInsureInfo: bizInsureInfo,
      };

      /*
       * 交强险
       */
      if (this.efcInsureInfo) {
        insureInfo.efcInsureInfo = {
          startDate: this.efcInsureInfoDate.startDate,
          endDate: this.handelDateType(1, this.efcInsureInfoDate.startDate),
        };
      }

      /*
       * 车船税
       */
      if (this.efcInsureInfo && this.isPaymentTax) {
        insureInfo.taxInsureInfo = {
          isPaymentTax: 'Y',
        };
      }

      /*
       * 车辆信息
       */
      let carInfo = '';
      if (!self.prvId) {
        carInfo = {
          seat: quoteInfo.setp2.seat,
          carProperty: quoteInfo.setp2.carProperty,
          property: quoteInfo.setp2.property,
          isTransferCar: quoteInfo.setp2.isTransferCar,
        };

        if (quoteInfo.setp2.price) {
          carInfo.price = quoteInfo.setp2.price;
        }

        if (quoteInfo.setp1.isNew) {
          carInfo.isNew = 'Y';
        }
        else {
          carInfo.carLicenseNo = quoteInfo.setp1.carLicenseNo;
        }

        if (quoteInfo.setp2.vinCode) {
          carInfo.vinCode = quoteInfo.setp2.vinCode;
        }

        if (quoteInfo.setp2.registDate) {
          carInfo.registDate = quoteInfo.setp2.registDate;
        }

        if (quoteInfo.setp2.engineNo) {
          carInfo.engineNo = quoteInfo.setp2.engineNo;
        }

        if (quoteInfo.setp2.brand) {
          carInfo.vehicleName = quoteInfo.setp2.brand;
        }

        if (quoteInfo.setp2.vehicleId) {
          carInfo.vehicleId = quoteInfo.setp2.vehicleId;
        }

        if (quoteInfo.setp2.modelLoads) {
          carInfo.modelLoads = quoteInfo.setp2.modelLoads;
        }

        if (quoteInfo.setp2.transferDate) {
          carInfo.transferDate = quoteInfo.setp2.transferDate;
        }
      }

      /*
       * 车主信息
       */
      let carOwner = '';
      if (!self.prvId) {
        carOwner = {
          name: quoteInfo.setp1.name,
          idcardType: quoteInfo.setp2.idcardType,
          idcardNo: quoteInfo.setp2.idcardNo,
        };
      }

      /*
       * @param  1  insureAreaCode            投保地区代码(市级代码)
       * @param  2  providers                 投保供应商
       */
      let data = {};
      if (this.taskId) {
        data = {
          taskId: self.taskId,
          insureInfo: insureInfo,
          insureType: self.insureTypeIndex,
        };

        if (self.prvId) {
          data.prvId = self.prvId;
        }
        else {
          data.providers = self.providers;
        }

        if (carInfo) {
          data.carInfo = carInfo;
        }

        if (carOwner) {
          data.carOwner = carOwner;
        }
      }
      else {
        data = {
          insureAreaCode: quoteInfo.setp1.insureAreaCode,
          carInfo: carInfo,
          insureInfo: insureInfo,
          providers: self.providers,
          carOwner: carOwner,
          insureType: self.insureTypeIndex,
        };
      }

      self.$store.get.dispatch({
        type  : 'handleChangeDialog',
        active: true,
        title : '温馨提示',
        msg   : '请您仔细查看承保条件，建议您第三责任险选择50万以上，记得勾选不计免赔哦，这样在出现理赔的时候，在保额内保险公司将全额赔偿哦。如果您的车价值30万以上，建议您购买车损险。',
        lists : [
          {
            msg: '取消'
          },
          {
            msg: '确认提交',
            class: 'ok',
            func () {
              self.handelSubmit(data);
            },
          }
        ]
      });
    },

    /*
     * createTaskB || updateTask
     */
    handelSubmit (data) {
      /*
       * @param  1  createTaskB                创建报价B接口
       * @param  2  submitQuote                提交报价任务，1、报价成功，跳转成功提示页面
       */
      let self = this;

      if ('test' === _.get(self.$route, 'query.act')) {
        // 固定使用第二套模板
        self.$router.push({name: 'insurance.CopyStepsCompany', query:{type: 2}});
        return;
      }

      self.$store.get.dispatch({
        type: 'Loading',
        isShow: true,
        Text: '正在提交，请稍等...',
      });

      if (self.taskId) {
        Models.Insurance
        .updateTask(data)
        .then((res) => {
          if (1 === res.code) {
            self.submitQuote();
          }
          else {
            self.$store.get.dispatch({
              type: 'Loading',
              isShow: false,
            });
            self.$toast(res.msg);
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
        Models.Insurance
        .createTaskB(data)
        .then((res) => {
          if (1 === res.code) {
            self.submitQuote(res.data.taskId);
          }
          else {
            self.$store.get.dispatch({
              type: 'Loading',
              isShow: false,
            });
            this.$toast(res.msg);
          }
        })
        .catch(() => {
          this.$store.get.dispatch({
            type: 'Loading',
            isShow: false,
          });
        });
      }
    },

    /*
     * 提交报价任务
     */
    submitQuote (taskId) {
      let self = this;
      let params = {
        taskId: '',
      };
      if (taskId) {
        params.taskId = taskId;
      }
      else {
        params.taskId = self.taskId;
      }
      if (self.prvId) {
        params.prvId = self.prvId;
      }
      Models.Insurance
      .quote(params)
      .then((res) => {
        self.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
        if (1 === res.code) {
          self.$toast('提交成功，待审核');
          setTimeout(() => {
            self.$router.push({
              name: 'insurance.InsuranceDeploy'
            });
          }, 2000);
        }
        else {
          if (res.data && 0 !== res.data.length) {
            self.iSwarn = true;
            self.warnList = res.data;
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
        }
      })
      .catch(() => {
        this.$store.get.dispatch({
          type: 'Loading',
          isShow: false,
        });
      });
    },

    /*
     * 去掉前置保险公司
     */
    handlePrvId () {
      let self = this;

      let provList = self.providers;
      _.each(self.warnList, (item) => {
        let index = _.findIndex(self.providers, { prvId: item.prvId });
        self.providers.splice(index, 1);
      });

      self.iSwarn = false;
      if (0 === self.providers.length) {
        self.providers = provList;
        self.$store.get.dispatch({
          type  : 'handleChangeDialog',
          active: true,
          title : '温馨提示',
          msg   : '保险公司不能为空，请返回修改',
          lists : [
            {
              msg: '确定'
            },
          ]
        });
      }
      else {
        this.handelQuote();
      }
    },

    /*
     * 选择是否免赔              'Y':是，'N':否
     */
    checkStatus (name) {
      let code = this.insuranceCode[name];
      if (code.amount) {
        code.notDeductible = 'N' === code.notDeductible ? 'Y' : 'N';
      }
      else {
        this.$toast('请先选择投保');
      }
    },

    /*
     * 处理险种 - 底部弹框组件BombBox
     * @param  amount              是否投保   1/保额:投保  0:不投保
     * @param  notDeductible       清空投保不计免赔
     * @param  VehicleDemageIns    车辆损失险=不投保，清空前置条件后的选择
     * @param  ThirdPartyIns       第三者责任险=不投保，清空前置条件后的选择
     */
    handleBomb (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.bombShow = obj.status;
          if (!_.isEmpty(_.get(obj, 'content'))) {

            let code = this.insuranceCode[this.formIndex];
            code.amount = obj.content.value;
            code.name = obj.content.name;

            if (!code.amount) {
              code.notDeductible = 'N';
            }

            if ('VehicleDemageIns' === this.formIndex || 'ThirdPartyIns' === this.formIndex) {
              this[this.formIndex].forEach((item) => {
                this.insuranceCode[item].amount = 0;
                this.insuranceCode[item].notDeductible = 'N';
                this.insuranceCode[item].name = '不投保';
              });
            }

          }
          return;
        }
      }
    },

    /*
     * 选择险种 - 所属组件BombBox
     * @param  name                  险种代码
     * @param  index                 投保前置条件 1、车辆损失险=投保，2、第三者责任险=投保
     * @param  VehicleDemageIns      车辆损失险 1/保额=投保 0=不投保
     * @param  ThirdPartyIns         第三者责任险 1/保额=投保 0=不投保
     */
    handleBombBoxChange (name, index = 0) {
      if (1 === index && !this.insuranceCode.VehicleDemageIns.amount) {
        this.$toast('请先投保车辆损失险');
        return;
      }
      if (2 === index && !this.insuranceCode.ThirdPartyIns.amount) {
        this.$toast('请先投保第三者责任险');
        return;
      }
      this.formIndex  = name;
      this.bombShow   = true;
    },

    /*
     * 日期组件回调
     */
    handelDateClick (obj) {
      if (!_.isNull(obj)) {
        if (_.isObject(obj)) {
          this.isShow = obj.status;
          this[this.formIndex].startDate = obj.content;
          return;
        }
      }
    },

    /*
     * 日期组件改变
     */
    handleDateChange (item) {
      /*if ('bizInsureInfoDate' === item && !this.insuranceCode.VehicleDemageIns.amount) {
        this.$toast('请先购买商业险');
        return;
      }
      if ('efcInsureInfoDate' === item && !this.efcInsureInfo) {
        this.$toast('请先购买交强险');
        return;
      }*/
      this.isShow     = true;
      this.formIndex  = item;
    },

    /*
     * 设置默认生效日期(默认显示当天的明天为起保日期)
     * @param  1  index               设置年份，默认为今年
     * @param  2  fullYear            开始年份，默认为今年
     */
    handelDateType (index = 0, fullYear = new Date()) {
      let date   = new Date(fullYear);
      if (0 === index) {
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
      }
      else {
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
      }
      let year  = date.getFullYear() + index;
      let month = 10 > (date.getMonth() + 1)  * 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      let day   = 10 > date.getDate() * 1 ? `0${date.getDate()}` : date.getDate();
      return `${year}-${month}-${day}`;
    },

    /*
     * 保险基础型
     */
    insureBaseType () {
      let self = this;
      /*
       * 险种代码
       * @param  1   VehicleDemageIns                 车辆损失险  -- 投保，不计免赔
       * @param  2   ThirdPartyIns                    第三者责任险  -- 投保50万，不计免赔
       * @param  3   DriverIns                        司机责任险
       * @param  4   PassengerIns                     乘客责任险
       * @param  5   TheftIns                         全车盗抢险
       * @param  6   GlassIns                         玻璃单独破碎险
       * @param  7   CombustionIns                    自燃损失险
       * @param  8   ScratchIns                       车身划痕险
       * @param  9   WadingIns                        涉水损失险
       * @param  10  VehicleDemageMissedThirdPartyCla 机动车损失保险无法找到第三方特约险
       * @param  11  SpecifyingPlantCla               指定专修厂险
       * @param  12  GoodsOnVehicleIns                车上货物责任险
       * @param  13  CompensationForMentalDistressIns 精神损害抚慰金责任险
       * @param  14  VehicleCompulsoryIns             交强险
       * @param  15  VehicleTax                       车船税
       */
      this.insuranceCode.VehicleDemageIns.amount = 1;
      this.insuranceCode.VehicleDemageIns.name = '投保';
      this.insuranceCode.VehicleDemageIns.notDeductible = 'Y';

      this.insuranceCode.ThirdPartyIns.amount = 300000;
      this.insuranceCode.ThirdPartyIns.name = '30万';
      this.insuranceCode.ThirdPartyIns.notDeductible = 'Y';

      this.insuranceCode.DriverIns.amount = 0;
      this.insuranceCode.DriverIns.name = '不投保';
      this.insuranceCode.DriverIns.notDeductible = 'N';

      this.insuranceCode.PassengerIns.amount = 0;
      this.insuranceCode.PassengerIns.name = '不投保';
      this.insuranceCode.PassengerIns.notDeductible = 'N';

      this.insuranceCode.TheftIns.amount = 0;
      this.insuranceCode.TheftIns.name = '不投保';
      this.insuranceCode.TheftIns.notDeductible = 'N';

      this.insuranceCode.GlassIns.amount = 0;
      this.insuranceCode.GlassIns.name = '不投保';
      this.insuranceCode.GlassIns.notDeductible = 'N';

      this.insuranceCode.CombustionIns.amount = 0;
      this.insuranceCode.CombustionIns.name = '不投保';
      this.insuranceCode.CombustionIns.notDeductible = 'N';

      this.insuranceCode.ScratchIns.amount = 0;
      this.insuranceCode.ScratchIns.name = '不投保';
      this.insuranceCode.ScratchIns.notDeductible = 'N';

      this.insuranceCode.WadingIns.amount = 0;
      this.insuranceCode.WadingIns.name = '不投保';
      this.insuranceCode.WadingIns.notDeductible = 'N';

      this.insuranceCode.VehicleDemageMissedThirdPartyCla.amount = 0;
      this.insuranceCode.VehicleDemageMissedThirdPartyCla.name = '不投保';
      this.insuranceCode.VehicleDemageMissedThirdPartyCla.notDeductible = 'N';

      this.insuranceCode.SpecifyingPlantCla.amount = 0;
      this.insuranceCode.SpecifyingPlantCla.name = '不投保';
      this.insuranceCode.SpecifyingPlantCla.notDeductible = 'N';

      this.insuranceCode.GoodsOnVehicleIns.amount = 0;
      this.insuranceCode.GoodsOnVehicleIns.name = '不投保';
      this.insuranceCode.GoodsOnVehicleIns.notDeductible = 'N';

      this.insuranceCode.CompensationForMentalDistressIns.amount = 0;
      this.insuranceCode.CompensationForMentalDistressIns.name = '不投保';
      this.insuranceCode.CompensationForMentalDistressIns.notDeductible = 'N';

      self.$refs.efcInsureInfo.currentValue = true;
      self.$refs.paymentTax.currentValue = true;
    },

    /*
     * 保险大众型
     */
    insureManyType () {
      let self = this;
      /*
       * 险种代码
       * @param  1   VehicleDemageIns                 车辆损失险  -- 投保，不计免赔
       * @param  2   ThirdPartyIns                    第三者责任险  -- 投保50万，不计免赔
       * @param  3   DriverIns                        司机责任险
       * @param  4   PassengerIns                     乘客责任险
       * @param  5   TheftIns                         全车盗抢险
       * @param  6   GlassIns                         玻璃单独破碎险
       * @param  7   CombustionIns                    自燃损失险
       * @param  8   ScratchIns                       车身划痕险
       * @param  9   WadingIns                        涉水损失险
       * @param  10  VehicleDemageMissedThirdPartyCla 机动车损失保险无法找到第三方特约险
       * @param  11  SpecifyingPlantCla               指定专修厂险
       * @param  12  GoodsOnVehicleIns                车上货物责任险
       * @param  13  CompensationForMentalDistressIns 精神损害抚慰金责任险
       * @param  14  VehicleCompulsoryIns             交强险
       * @param  15  VehicleTax                       车船税
       */
      this.insuranceCode.VehicleDemageIns.amount = 1;
      this.insuranceCode.VehicleDemageIns.name = '投保';
      this.insuranceCode.VehicleDemageIns.notDeductible = 'Y';

      this.insuranceCode.ThirdPartyIns.amount = 500000;
      this.insuranceCode.ThirdPartyIns.name = '50万';
      this.insuranceCode.ThirdPartyIns.notDeductible = 'Y';

      this.insuranceCode.DriverIns.amount = 10000;
      this.insuranceCode.DriverIns.name = '1万';
      this.insuranceCode.DriverIns.notDeductible = 'Y';

      this.insuranceCode.PassengerIns.amount = 10000;
      this.insuranceCode.PassengerIns.name = '1万/座';
      this.insuranceCode.PassengerIns.notDeductible = 'Y';

      this.insuranceCode.TheftIns.amount = 1;
      this.insuranceCode.TheftIns.name = '投保';
      this.insuranceCode.TheftIns.notDeductible = 'Y';

      this.insuranceCode.GlassIns.amount = 0;
      this.insuranceCode.GlassIns.name = '不投保';
      this.insuranceCode.GlassIns.notDeductible = 'N';

      this.insuranceCode.CombustionIns.amount = 0;
      this.insuranceCode.CombustionIns.name = '不投保';
      this.insuranceCode.CombustionIns.notDeductible = 'N';

      this.insuranceCode.ScratchIns.amount = 0;
      this.insuranceCode.ScratchIns.name = '不投保';
      this.insuranceCode.ScratchIns.notDeductible = 'N';

      this.insuranceCode.WadingIns.amount = 0;
      this.insuranceCode.WadingIns.name = '不投保';
      this.insuranceCode.WadingIns.notDeductible = 'N';

      this.insuranceCode.VehicleDemageMissedThirdPartyCla.amount = 0;
      this.insuranceCode.VehicleDemageMissedThirdPartyCla.name = '不投保';
      this.insuranceCode.VehicleDemageMissedThirdPartyCla.notDeductible = 'N';

      this.insuranceCode.SpecifyingPlantCla.amount = 0;
      this.insuranceCode.SpecifyingPlantCla.name = '不投保';
      this.insuranceCode.SpecifyingPlantCla.notDeductible = 'N';

      this.insuranceCode.GoodsOnVehicleIns.amount = 0;
      this.insuranceCode.GoodsOnVehicleIns.name = '不投保';
      this.insuranceCode.GoodsOnVehicleIns.notDeductible = 'N';

      this.insuranceCode.CompensationForMentalDistressIns.amount = 0;
      this.insuranceCode.CompensationForMentalDistressIns.name = '不投保';
      this.insuranceCode.CompensationForMentalDistressIns.notDeductible = 'N';

      self.$refs.efcInsureInfo.currentValue = true;
      self.$refs.paymentTax.currentValue = true;
    },

    /*
     * 保险自定义型
     */
    insureDefinedType () {
      let self = this;
      /*
       * 险种代码
       * @param  1   VehicleDemageIns                 车辆损失险  -- 投保，不计免赔
       * @param  2   ThirdPartyIns                    第三者责任险  -- 投保50万，不计免赔
       * @param  3   DriverIns                        司机责任险
       * @param  4   PassengerIns                     乘客责任险
       * @param  5   TheftIns                         全车盗抢险
       * @param  6   GlassIns                         玻璃单独破碎险
       * @param  7   CombustionIns                    自燃损失险
       * @param  8   ScratchIns                       车身划痕险
       * @param  9   WadingIns                        涉水损失险
       * @param  10  VehicleDemageMissedThirdPartyCla 机动车损失保险无法找到第三方特约险
       * @param  11  SpecifyingPlantCla               指定专修厂险
       * @param  12  GoodsOnVehicleIns                车上货物责任险
       * @param  13  CompensationForMentalDistressIns 精神损害抚慰金责任险
       * @param  14  VehicleCompulsoryIns             交强险
       * @param  15  VehicleTax                       车船税
       */
      this.insuranceCode.VehicleDemageIns.amount = 0;
      this.insuranceCode.VehicleDemageIns.name = '不投保';
      this.insuranceCode.VehicleDemageIns.notDeductible = 'N';

      this.insuranceCode.ThirdPartyIns.amount = 0;
      this.insuranceCode.ThirdPartyIns.name = '不投保';
      this.insuranceCode.ThirdPartyIns.notDeductible = 'N';

      this.insuranceCode.DriverIns.amount = 0;
      this.insuranceCode.DriverIns.name = '不投保';
      this.insuranceCode.DriverIns.notDeductible = 'N';

      this.insuranceCode.PassengerIns.amount = 0;
      this.insuranceCode.PassengerIns.name = '不投保';
      this.insuranceCode.PassengerIns.notDeductible = 'N';

      this.insuranceCode.TheftIns.amount = 0;
      this.insuranceCode.TheftIns.name = '不投保';
      this.insuranceCode.TheftIns.notDeductible = 'N';

      this.insuranceCode.GlassIns.amount = 0;
      this.insuranceCode.GlassIns.name = '不投保';
      this.insuranceCode.GlassIns.notDeductible = 'N';

      this.insuranceCode.CombustionIns.amount = 0;
      this.insuranceCode.CombustionIns.name = '不投保';
      this.insuranceCode.CombustionIns.notDeductible = 'N';

      this.insuranceCode.ScratchIns.amount = 0;
      this.insuranceCode.ScratchIns.name = '不投保';
      this.insuranceCode.ScratchIns.notDeductible = 'N';

      this.insuranceCode.WadingIns.amount = 0;
      this.insuranceCode.WadingIns.name = '不投保';
      this.insuranceCode.WadingIns.notDeductible = 'N';

      this.insuranceCode.VehicleDemageMissedThirdPartyCla.amount = 0;
      this.insuranceCode.VehicleDemageMissedThirdPartyCla.name = '不投保';
      this.insuranceCode.VehicleDemageMissedThirdPartyCla.notDeductible = 'N';

      this.insuranceCode.SpecifyingPlantCla.amount = 0;
      this.insuranceCode.SpecifyingPlantCla.name = '不投保';
      this.insuranceCode.SpecifyingPlantCla.notDeductible = 'N';

      this.insuranceCode.GoodsOnVehicleIns.amount = 0;
      this.insuranceCode.GoodsOnVehicleIns.name = '不投保';
      this.insuranceCode.GoodsOnVehicleIns.notDeductible = 'N';

      this.insuranceCode.CompensationForMentalDistressIns.amount = 0;
      this.insuranceCode.CompensationForMentalDistressIns.name = '不投保';
      this.insuranceCode.CompensationForMentalDistressIns.notDeductible = 'N';

      self.$refs.efcInsureInfo.currentValue = false;
      self.$refs.paymentTax.currentValue = false;
    },

  },
};
