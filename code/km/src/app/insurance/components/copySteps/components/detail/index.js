import './index.scss';

import _                  from 'lodash';
import Header             from '~common/components/header';
import LocalStorage       from '~common/services/localStorage.cookie';

export default {
  name: 'carInsuranceDetail',
  data () {
    return {
      isSwitchNav: 1,
      formTemp: {
        list: '',
        carOwner: '',
        insureInfo: {
          bizInsureInfo: {
            riskKinds: [],
          },
          efcInsureInfo: {
            premium: '',
          },
          taxInsureInfo: {
            taxFee: '',
          },
          totalPremium: '',
        },
      },
      startDate: '',
      endDate: '',
      seller: {
        info: {}
      },
    };
  },
  components: {
    'app-header': Header,
  },
  computed: {
    prvId () {
      return this.$route.query.prvId;
    },
    type () {
      return this.$route.query.type;
    },
  },
  mounted () {
    this.getLocalStorage();
    this.startDate = this.handelDateType();
    this.endDate = this.handelDateType(1);
    this.getRiskKinds(this.type);
  },
  watch: {
  },
  methods: {

    /*
     * 获取本地存储
     */
    getLocalStorage () {
      let quoteInfo  = LocalStorage.get('quoteInfo');
      let data       = LocalStorage.get('autoInsur');

      if (!_.isEmpty(_.get(quoteInfo, 'data.setp1'))) {
        this.formTemp.carOwner = _.get(quoteInfo, 'data.setp1');
      }

      if (!_.isEmpty(_.get(data, 'data'))) {
        this.formTemp.list = data.data;
      }

      // 麦广扬到此一游
      let provider = LocalStorage.get('providersData');

      if (!_.isEmpty(provider.data)) {
        let seller = _.filter(provider.data, { prvId: this.prvId + '' });
        if (!_.isEmpty(seller)) {
          this.seller = seller[0];
        }
      }
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
      let year  = date.getFullYear() + index;
      let month = 10 > (date.getMonth() + 1)  * 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      let day   = 10 > date.getDate() * 1 ? `0${date.getDate()}` : date.getDate();
      return `${year}-${month}-${day}`;
    },

    /*
     * 险种配置
     */
    getRiskKinds (index) {
      let self = this;
      switch (index * 1) {
        case 1:
          self.formTemp.insureInfo.bizInsureInfo.riskKinds = [
            {
              riskCode: '第三者责任险',
              amount: '300000.00',
              premium: '￥1226.00',
              ncfPremium: '￥183.9',
            },
          ];
          self.formTemp.insureInfo.efcInsureInfo.premium = '￥950';
          self.formTemp.insureInfo.taxInsureInfo.taxFee = '￥350';
          self.formTemp.insureInfo.totalPremium = '￥2709.9元';
          break;
        case 2:
          self.formTemp.insureInfo.bizInsureInfo.riskKinds = [
            {
              riskCode: '第三者责任险',
              amount: '300000.00',
              premium: '￥1226.00',
              ncfPremium: '￥183.9',
            },
          ];
          self.formTemp.insureInfo.efcInsureInfo.premium = '￥950';
          self.formTemp.insureInfo.taxInsureInfo.taxFee = '￥350';
          self.formTemp.insureInfo.totalPremium = '￥2709.9元';

          /*self.formTemp.insureInfo.bizInsureInfo.riskKinds = [
            {
              riskCode: '车辆损失险',
              amount: '160000.00',
              premium: '￥1342.88',
              ncfPremium: '￥201.42',
            },
            {
              riskCode: '第三者责任险',
              amount: '500000.00',
              premium: '￥1472',
              ncfPremium: '￥220.8',
            },
            {
              riskCode: '司机责任险',
              amount: '10000.00',
              premium: '￥58.53',
              ncfPremium: '￥8.78',
            },
          ];
          self.formTemp.insureInfo.efcInsureInfo.premium = '￥950';
          self.formTemp.insureInfo.taxInsureInfo.taxFee = '￥450';
          self.formTemp.insureInfo.totalPremium = '￥4704.41元';*/
          break;
        case 3:
          self.formTemp.insureInfo.bizInsureInfo.riskKinds = [
            {
              riskCode: '车辆损失险',
              amount: '300000.00',
              premium: '￥2517.9',
              ncfPremium: '￥377.66',
            },
            {
              riskCode: '第三者责任险',
              amount: '1000000.00',
              premium: '￥1917',
              ncfPremium: '￥287.55',
            },
            {
              riskCode: '司机责任险',
              amount: '20000.00',
              premium: '￥80',
              ncfPremium: '￥12',
            },
            {
              riskCode: '乘客责任险',
              amount: '10000.00',
              premium: '￥58.53',
              ncfPremium: '￥8.78',
            },
          ];
          self.formTemp.insureInfo.efcInsureInfo.premium = '￥950';
          self.formTemp.insureInfo.taxInsureInfo.taxFee = '￥850';
          self.formTemp.insureInfo.totalPremium = '￥7059.42元';
          break;
      }
    },

  }
};