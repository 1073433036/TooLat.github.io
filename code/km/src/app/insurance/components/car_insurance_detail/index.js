import './index.scss';

import Header             from '~common/components/header';
import Models             from '~common/models';

export default {
  name: 'carInsuranceDetail',
  data () {
    return {
      isSwitchNav: 1,
      formTemp: {
        list: '',
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    taskId () {
      return this.$route.query.taskId;
    },
    prvId () {
      return this.$route.query.prvId;
    },
  },
  mounted () {
    this.list();
  },
  watch: {
  },
  methods: {

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
          self.formTemp.list = res.data;
        }
      });
    },

  },
  filters: {
    idType (value) {
      let data = [
        '身份证',
        '户口本',
        '驾照',
        '军官证/士兵证',
        '护照',
        '港澳回乡证/台胞证',
        '组织代码证',
        '其他证件',
        '社会信用代码证',
        '税务登记证',
        '营业执照',
        '香港身份证',
      ];
      return data[value] || '无';
    },
    riskFilter (value) {
      let data = {
        VehicleDemageIns: '车辆损失险',
        ThirdPartyIns: '第三者责任险',
        DriverIns: '司机责任险',
        PassengerIns: '乘客责任险',
        TheftIns: '全车盗抢险',
        GlassIns: '玻璃单独破碎险',
        CombustionIns: '自燃损失险',
        ScratchIns: '车身划痕险',
        WadingIns: '涉水损失险',
        VehicleDemageMissedThirdPartyCla: '机动车损失保险无法找到第三方特约险',
        SpecifyingPlantCla: '指定专修厂险',
        GoodsOnVehicleIns: '车上货物责任险',
        CompensationForMentalDistressIns: '精神损害抚慰金责任险',
        VehicleCompulsoryIns: '交强险',
        VehicleTax: '车船税',
        VehicleTaxOverdueFine: '车船税滞纳金',
        CarToCarDamageIns: '车碰车损失险',
        CombustionExclusionCla: '自燃免除特约',
        WadingExclusionCla: '涉水免除特约',
        OptionalDeductiblesCla: '可选免赔额特约',
        AccidentDeductiblesCla: '多次事故免赔特约',
        NewEquipmentIns: '新增设备损失险',
        LossOfBaggageIns: '随车行李物品损失保险',
        TrainnigCarCla: '教练车特约',
        NcfDriverPassengerIns: '附加车上人员责任险不计免赔',
        VehicleSuspendedIns: '机动车停驶损失险',
        NcfBasicClause: '基本险不计免赔',
        NcfAddtionalClause: '附加险不计免赔',
        NcfClause: '不计免赔险',
        MirrorLightIns: '倒车镜车灯损坏险',
        AccidentFranchiseCla: '事故责任免赔率特约条款',
        SpecialVehicleExtensionIns: '特种车扩展险',
        CompensationDuringRepairIns: '修理期间费用补偿险',
        OthersIns: '其他',
      };
      return data[value] || '无';
    },
    amountFilter (value, code) {
      let data = value;
      if (1 === value * 1) {
        data = '投保';
      }
      if (1 === value * 1 && ('GlassIns' === code || 'MirrorLightIns' === code)) {
        data = '国产';
      }
      if (2 === value * 1 && ('GlassIns' === code || 'MirrorLightIns' === code)) {
        data = '进口';
      }
      if (1 === value * 1 && 'AccidentFranchiseCla' === code) {
        data = '事故责任免赔率I';
      }
      if (2 === value * 1 && 'AccidentFranchiseCla' === code) {
        data = '事故责任免赔率II';
      }
      if (3 === value * 1 && 'AccidentFranchiseCla' === code) {
        data = '事故责任免赔率III';
      }
      return data;
    },
    carLicenseNoFilter (value) {
      let data = value.split('');
      data.splice(2, 0, ' ');
      return data.join('');
    },
  },
};