import './index.scss';

import _              from 'lodash';
import Header         from '~common/components/header';
import phoneCode      from '~common/components/phone_code';
// import Selecter       from '~common/components/selecter';
import Banks          from '../banks';
import Models         from '~common/models';

export default {
  name: 'AddCreditCard',
  data () {
    return {
      state: {
        active: true,
      },
      formData: {
        name: '',
        id_card: '',
        card_no: '',
        cvn2: '',
        lastcvn: '',
        card_date: '',
        repay_date: '',
        bill_date: '',
        bankInfo: {
          bank_name: '',
          cash_df_bank_id: '',
          bank_code: ''
        },
        prov: {
          region_name: '请选择省'
        },
        city: {
          region_name: '请选择市'
        },
        address: '',
        phone: '',
        code: ''
      },
      formTemp: [],
      isOther: false,
      isShowBank: false,
      isCvn2: false,
      isCvn2Show: false,
      prov: false,
      cityId: 0,
      submitCount: 0
    };
  },
  components: {
    'app-header'    : Header,
    phoneCode,
    // Selecter,
    Banks
  },
  computed: {
  },
  mounted () {
    this.getAuthentication();
  },
  filters: {
  },
  watch: {
    prov () {
      if (this.prov) {
        this.isOther = true;
      }
      else {
        this.isOther = false;
      }
    },
    submitCount () {
      if (this.submitCount) {
        this.state.active = false;
      }
      else {
        this.state.active = true;
      }
    },

    'formData.cvn2' (val, old) {
      if (val !== old) {

        if (3 === val.length && false === this.isCvn2) {
          this.isCvn2         = true;
          this.isCvn2Show     = true;
          this.lastcvn        = val;
          this.formData.cvn2  = `${val.substr(0, 1)}**`;
        }
        else {
          this.isCvn2         = false;
        }

        if (!_.isEmpty(this.lastcvn) && 3 > this.lastcvn.length) {
          this.lastcvn = this.lastcvn.substr(0, this.lastcvn.length - 1);
          this.formData.cvn2 = this.lastcvn;
          this.isCvn2Show   = false;
        }
      }
    },

  },
  methods: {

    handleCvn () {
      this.isCvn2         = true;
      this.isCvn2Show     = false;
      this.formData.cvn2  = this.lastcvn;
    },

    // 获取基本共用字段
    getAuthentication () {
      Models.Profile
      .getAuthentication()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          // console.log(data);
          // this.formData.name    = data.real_name;
          this.formData.id_card = data.id_card;
          this.formData.phone   = data.mobile;
        }
      });
    },

    controlCityChoiceOnOff () {
      this.prov = false;
    },
    /*选择银行模块*/
    chooseItem (item) {
      this.formData.bankInfo.bank_name = item.name;
      this.formData.bankInfo.cash_df_bank_id = item.id;
      this.formData.bankInfo.bank_code = item.code;
    },

    // 判断还款日是否成立
    handleDayBlur () {
      let now = new Date();
      let day = now.getDate();

      // 信用卡账单日 formData.bill_date
      // 信用卡还款日 formData.repay_date
      if (!_.isEmpty(this.formData.bill_date) && !_.isEmpty(this.formData.repay_date)) {

        //跨月
        if ( this.formData.repay_date * 1  <  this.formData.bill_date * 1 ) {
          if (day >= this.formData.repay_date * 1  && day <= this.formData.bill_date * 1   ) {
             this.$toast('您的账单还未出，暂时不能生产刷卡计划');
              return;
          }
        }

        //不跨月
        if ( this.formData.repay_date * 1  >  this.formData.bill_date * 1 ) {
          if (day  <=  this.formData.bill_date * 1   || day >=  this.formData.repay_date * 1  ) {
             this.$toast('您的账单还未出，暂时不能生产刷卡计划');
              return;
          }
        }

        /*if (day >= this.formData.repay_date * 1 && day <= this.formData.bill_date || day <= this.formData.bill_date) {
          this.$toast('您的账单还未出，暂时不能生产刷卡计划');
          return;
        }*/
      }

    },

    //提交信用卡资料
    submitCreditData () {
      let self = this;

      if (true !== self.$rules.identity(self.formData.id_card)) {
        self.$toast('请输入正确的身份证号码');
        return;
      }
      else if (true !== self.$rules.creditCard(self.formData.card_no)) {
        self.$toast('请输入正确的卡号');
        return;
      }
      else if (true !== self.$rules.phone(self.formData.phone)) {
        self.$toast('请输入正确的手机号码');
        return;
      }

      let year  = self.formData.card_date.substring(0, 2);
      let month = self.formData.card_date.substring(2);

      if (4 > self.formData.card_date.length) {
        self.$toast('有效期输入错误');
        return;
      }

      if (18 > year * 1) {
        self.$toast('年份不能小于18');
        return;
      }

      if (12 < month * 1) {
        self.$toast('月份不能大于12');
        return;
      }

      let now = new Date();
      let day = now.getDate();

      // 信用卡账单日 formData.bill_date
      // 信用卡还款日 formData.repay_date
      /*if (day >= self.formData.repay_date * 1 && day <= self.formData.bill_date || day <= self.formData.bill_date) {
        self.$toast('您的账单还未出，暂时不能生产刷卡计划');
        return;
      }*/

      //跨月
      if ( this.formData.repay_date * 1  <  this.formData.bill_date * 1 ) {
        if (day >= this.formData.repay_date * 1  && day <= this.formData.bill_date * 1   ) {
           this.$toast('您的账单还未出，暂时不能生产刷卡计划');
            return;
        }
      }

      //不跨月
      if ( this.formData.repay_date * 1  >  this.formData.bill_date * 1 ) {
        if (day  <=  this.formData.bill_date * 1   || day >=  this.formData.repay_date * 1  ) {
           this.$toast('您的账单还未出，暂时不能生产刷卡计划');
            return;
        }
      }

      if (self.submitCount) {
        self.$toast('请不要重复提交');
        return;
      }

      self.submitCount = 1;
      let data = {
        name: self.formData.name,
        id_card: self.formData.id_card,
        card_no: self.formData.card_no,
        cvn2: self.lastcvn,
        card_date: self.formData.card_date,
        repay_date: self.formData.repay_date,
        bill_date: self.formData.bill_date,
        bank_name: self.formData.bankInfo.bank_name,
        cash_df_bank_id: self.formData.bankInfo.cash_df_bank_id,
        bank_code: self.formData.bankInfo.bank_code,
        // bank_province: self.formData.prov.region_name,
        // bank_city: self.formData.city.region_name,
        // bank_address: self.formData.address,
        phone: self.formData.phone,
        code: self.formData.code
      };
      Models.Cultivate.addCreditCard(data).then(res => {
        if (1 === res.code) {
          self.$toast(res.msg);

          // 判断是否需要购买防盗刷险
          Models.Order
          .isInsurance()
          .then((res) => {
            console.log(res);
            if (1 === res.code) {
              setTimeout(() => {
                self.$router.push({name: 'home.PrenentTheft'});
              }, 2000);
            }
            else {
              self.$router.push({name: 'home.SetPaymentPlan'});
            }
          })
          .catch(() => {
            self.$router.push({name: 'home.SetPaymentPlan'});
          });
        }
        else {
          self.$toast(res.msg);
          self.submitCount = 0;
        }
      }).catch(er => {
        self.$toast(er);
        self.submitCount = 0;
      });
    },

    /*选择地方模块*/
    // handleChangeAddres (str) {
    //   if ('prov' === str) {
    //     this.cityId = 0;
    //   }
    //   if ('city' === str && '请选择省' === this.formData.prov.region_name) {
    //     this.$toast('请先选择省');
    //     return;
    //   }
    //   Models.Region
    //   .get(this.cityId)
    //   .then((res) => {
    //     if (1 === res.code) {
    //       this.formTemp = res.data;
    //       this.prov = true;
    //     }
    //   });
    // },
    // // 选中
    // handelClick (item) {
    //   if (1 === item.region_type) {
    //     this.formData.prov.region_name = item.region_name;
    //     this.cityId = item.region_id;
    //   }
    //   else if (0 === item.region_type) {
    //     this.formData.city.region_name = item.region_name;
    //   }
    //   this.prov = false;
    // },
    // // 销毁窗口
    // dismiss () {
    //   this.prov = false;
    // },
  }
};