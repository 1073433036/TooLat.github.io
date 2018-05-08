import './index.scss';

import _                from 'lodash';
import Header           from '~common/components/header';
import Banks            from './components/banks';
import CityList         from '~common/components/city_list';
import Branch           from './components/branch';
import phoneCode        from '~common/components/phone_code';

export default {
	name: 'BankCard',
	data () {
		return {
		};
	},
	components: {
		'app-header': Header,
		Banks,
		CityList,
		Branch,
		phoneCode
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
	},
	watch: {
	},
	methods: {
		/**
      * 选择银行
      **/
		changeBank () {
			this.$store.get.dispatch({
				type  : 'bankData',
				isShow: true
			});
		},
		// 自定义筛选城市切换
		handleCityShowChange () {
			this.$store.get.dispatch({
				type: 'cityListData',
				isShow: true,
			});
		},
		// 所属支行
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
	}
};