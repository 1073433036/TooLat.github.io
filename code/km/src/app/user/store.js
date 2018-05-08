import _   		from 'lodash';

const state = [
	{ App 						  : require('../state') },
	{ Dialog 						: require('~common/components/dialog/state') },
	{ Loading 					: require('~common/components/loading/state') },
	{ Visitor 					: require('~common/components/visitor/state') },

	{ CityList 		  		: require('~common/components/city_list/state') },
	{ Cropper 		  		: require('~common/components/cropper/state') },

	{ BankAddBanks 			: require('./components/bank_add/components/banks/state') },
	{ BankAddBranch 		: require('./components/bank_add/components/branch/state') },
	{ Acount 		        : require('./components/account/state') },

	{ BankCardBanks     : require('./components/agency_bank_card/components/banks/state') },
	{ BanksCardBranch   : require('./components/agency_bank_card/components/branch/state') },
];


/**
* 页面state请按照下面格式进行添加
*/
export default {

	// 公共部分
	common: {
		App 		: _.find(state, 'App').App.default,
		Dialog  : _.find(state, 'Dialog').Dialog.default,
		Loading : _.find(state, 'Loading').Loading.default,
		Visitor : _.find(state, 'Visitor').Visitor.default,
	},

	//路由部分
	store: [

		//账户管理
		{
			name 		: 'user.Account',
			modules : {
				Acount: _.find(state, 'Acount').Acount.default,
			}
		},
		{
			name 		: 'user.WithdrawDeposit',
			modules : {
				Acount: _.find(state, 'Acount').Acount.default,
			}
		},
		{
			name 		: 'user.IntegralDetail',
			modules : {
				Acount: _.find(state, 'Acount').Acount.default,
			}
		},
		{
			name 		: 'user.Integralwithdraw',
			modules : {
				Acount: _.find(state, 'Acount').Acount.default,
			}
		},
		{
			name 		: 'user.BankList',
			modules : {
				Acount: _.find(state, 'Acount').Acount.default,
			}
		},

		// 编辑名片信息
		{
			name 		: 'user.BusinessEdit',
			modules : {
				CityList: _.find(state, 'CityList').CityList.default,
				Cropper : _.find(state, 'Cropper').Cropper.default,
			}
		},

		// 个人设置
		{
			name : 'user.Profile',
			modules : {
				CityList: _.find(state, 'CityList').CityList.default,
				Cropper : _.find(state, 'Cropper').Cropper.default,
			}
		},

		//新增银行卡
		{
			name 		: 'user.BankAdd',
			modules : {
				Banks 	: _.find(state, 'BankAddBanks').BankAddBanks.default,
				CityList: _.find(state, 'CityList').CityList.default,
				Branch  : _.find(state, 'BankAddBranch').BankAddBranch.default,
			}
		},

		// 个人设置
		{
			name 		: 'user.Certify',
			modules : {
				Cropper : _.find(state, 'Cropper').Cropper.default,
			}
		},
		//银行卡
		{
			name 		: 'user.BankCard',
			modules : {
				Banks 	: _.find(state, 'BankCardBanks').BankCardBanks.default,
				CityList: _.find(state, 'CityList').CityList.default,
				Branch  : _.find(state, 'BanksCardBranch').BanksCardBranch.default,
			}
		},

	]
};