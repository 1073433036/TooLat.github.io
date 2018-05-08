import _   		from 'lodash';

const state = [
	{ App 						  : require('../state') },
	{ Dialog 						: require('~common/components/dialog/state') },
	{ Loading 					: require('~common/components/loading/state') },


	{ CityList 		  		: require('~common/components/city_list/state') },
	{ Cropper 		  		: require('~common/components/cropper/state') },

	{ CarInsurance 		  : require('./components/home/state') },
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
	},

	//路由部分
	store: [
			// 抢单首页
		/*{
			name 		: 'task.Home',
			modules : {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},*/
		//完善投保信息
		{
			name 		: 'insurance.PerfectInsureMessage',
			modules : {
				CityList: _.find(state, 'CityList').CityList.default,
				Cropper : _.find(state, 'Cropper').Cropper.default,
			}
		},
		// 收件地址
		{
			name 		: 'insurance.SendSite',
			modules : {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},
		// 汽车保险
		{
			name 		: 'insurance.Home',
			modules : {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},
	]
};