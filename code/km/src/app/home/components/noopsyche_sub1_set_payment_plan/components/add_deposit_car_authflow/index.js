import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import phoneCode    from '~common/components/phone_code';
import Tips         from '~common/components/tips';
import CityList     from '~common/components/city_list';
import Models       from '~common/models'
;
import Banks        from './components/banks';
import Branch       from './components/branch';

export default {
  name: 'depositCardAuthflow',
  data () {
    return {
      state: {
        active: true,
      },
      formData:{
        name          : '',
        id_card       : '',
        account_no    : '',
        bank_name     : '',
        cash_bank_id  : '',
        bank_province : '',
        bank_city     : '',
        bank_county   : '',
        bank_branch   : '',
        bank_code     : '',
        phone         : '',
        code          : '',
      },
      submitStatus: 0
    };
  },
  components: {
    'app-header': Header,
    'app-tips'  : Tips,
    phoneCode,
    Banks,
    CityList,
    Branch,
  },
  computed: {
    bank_name () {
      return _.get(this.$store.get.state, 'Banks.content.data.bank_name');
    },
    cash_bank_id () {
      return _.get(this.$store.get.state, 'Banks.content.data.id');
    },

    cityShow () {
      return _.get(this.$store.get.state, 'CityList.content.isShow') || false;
    },

    bank_province () {
      return _.get(this.$store.get.state, 'CityList.content.data.prov') || {};
    },

    bank_city () {
      return _.get(this.$store.get.state, 'CityList.content.data.city') || {};
    },

    area () {
      return _.get(this.$store.get.state, 'CityList.content.data.area') || {};
    },

    branch () {
      return _.get(this.$store.get.state, 'Branch.content.data');
    },

    bank_branch () {
      return this.branch.lName;
    },

    bank_code () {
      return this.branch.bankCode;
    },

  },
  mounted () {
    this.getAuthentication();
  },
  watch: {
  },
  methods: {

    // 获取基本共用字段
    getAuthentication () {
      Models.Profile
      .getAuthentication()
      .then((res) => {
        if (1 === res.code) {
          let data = res.data;
          this.formData.name    = data.real_name;
          this.formData.id_card = data.id_card;
          this.formData.phone   = data.mobile;
        }
      });
    },

    // 自定义筛选城市切换
    handleCityShowChange () {
      this.$store.get.dispatch({
        type: 'cityListData',
        isShow: true,
      });
    },

    /**
      * 选择银行
      **/
    chnageBank () {
      this.$store.get.dispatch({
        type  : 'bankData',
        isShow: true
      });
    },

    // 支行列表
    handleBankBranch () {
      if (_.isEmpty(this.bank_name)) {
        this.$toast('请选择发卡行');
        return;
      }
      if (_.isEmpty(this.bank_city.region_name)) {
        this.$toast('请选择支行地区');
        return;
      }

      this.$store.get.dispatch({
        type        : 'branchData',
        isShow      : true,
        bankName    : this.bank_name,
        bankCity    : this.bank_city.region_name,
        bnakProvice : this.bank_province.region_name,
      });

    },

   submitData () {
    this.$router.push({name: 'home.DepositCardManage'});
    // if ( true !== this.$rules.identity(this.formData.id_card) ) {
    //   this.$toast('请输入正确的身份证号码');
    //   return;
    // }
    // else if ( true !== this.$rules.bank(this.formData.account_no) ) {
    //   this.$toast('请输入正确的银行卡号');
    //   return;
    // }
    // else if ( true !== this.$rules.phone(this.formData.phone) ) {
    //   this.$toast('请输入正确的手机号码');
    //   return;
    // }

    // if (this.submitStatus) {
    //   this.$toast('请不要重复提交');
    //   return;
    // }
    // this.submitStatus = 1;

    // let data = _.assign({}, this.formData, {
    //   bank_name: this.bank_name,
    //   cash_bank_id: this.cash_bank_id,
    //   bank_province: this.bank_province.region_name,
    //   bank_city: this.bank_city.region_name,
    //   bank_county: this.area.region_name,
    //   bank_branch: this.branch.lName,
    //   bank_code: this.bank_code
    // });
    // Models.Pay.applyBundleCard(data).then(res => {
    //   if ( 1 === res.code) {
    //     this.$toast(res.msg);
    //     this.$router.push({name: 'home.AuthPhoto'});
    //   }
    //   else {
    //     this.submitStatus = 0;
    //     this.$toast(res.msg);
    //   }
    // });

   }

  }
};