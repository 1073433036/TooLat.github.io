import './index.scss';

import _            from 'lodash';
import Header       from '~common/components/header';
import phoneCode    from '~common/components/phone_code';
import Tips         from '~common/components/tips';
import CityList     from '~common/components/city_list';
import Models       from '~common/models';
import Banks        from './components/banks';
import Branch       from './components/branch';

export default {
  name: 'order-pay',
  data () {
    return {
      isShowChooseBanks: true,
      isShowChooseBranch: true,
      state: {
        active: true,
      },
      formData:{
        real_name: '',
        bank_card: '',
        mobile: '',
        verification_code: ''
      },
      customData: {
        bank_name: '',
        branch: ''
      },
      submitCount: 0
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
      return _.get(this.$store.get.state, 'Banks.content.data.name');
    },
    cash_bank_id () {
      return _.get(this.$store.get.state, 'Banks.content.data.id');
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

  },
  beforeRouteLeave (to, from, next) {
    this.$store.get.dispatch({
      type  : 'bankData',
      isShow: false
    });
    this.$store.get.dispatch({
      type  : 'branchData',
      isShow: false
    });
    next();
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    //手动输入银行
    handleCustomBanksInput () {
      this.isShowChooseBanks = false;
      this.isShowChooseBranch = false;
    },
    handleCustomBranchInput () {
      this.isShowChooseBranch = false;
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
    if (true !== this.$rules.bank(this.formData.bank_card)) {
      this.$toast('请输入正确的卡号');
      return;
    }
    else if (true !== this.$rules.phone(this.formData.mobile)) {
      this.$toast('请输入正确的手机号码');
      return;
    }

    if (this.submitCount) {
      this.$toast('请不要重复提交');
    }
    this.submitCount = 1;
    let data = _.assign({}, this.formData, {
      bank_id: this.cash_bank_id,
      branch_province: this.bank_province.region_name,
      branch_city: this.bank_city.region_name,
      branch: this.branch.lName,
    });

    if (!this.isShowChooseBanks) {
      data.bank_name = this.customData.bank_name;
      data.branch = this.customData.branch;
    }
    else if (!this.isShowChooseBranch) {
      data.branch = this.customData.branch;
    }

    Models.User.userAddBank(data).then(res => {
      if ( 1 === res.code) {
        this.$toast(res.msg);
        this.$router.push({name: 'user.BankList'});
        return;
      }
      this.$toast(res.msg);
      this.submitCount = 0;
    });

   }

  }
};