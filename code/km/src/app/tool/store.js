import _   		from 'lodash';

const state = [
	{ Cropper 		  		: require('~common/components/cropper/state') },

	{ Advertise 		    : require('./components/advertise_home/state') },
	{ AdvertiseCropper  : require('./components/advertise_upload_material/components/cropper/state') },
];


/**
* 页面state请按照下面格式进行添加
*/
export default {

	// 公共部分
	common: {
	},

	//路由部分
	store: [

		// 登录页
		{
			name 		: 'welcome.Login',
			modules : {
			}
		},
		//编辑信息
		{
			name 		: 'tool.CompileMessage',
			modules : {
				Cropper : _.find(state, 'Cropper').Cropper.default,
			}
		},

		//行业爆料资料库
		{
			name 		: 'tool.AdvertiseHome',
			modules : {
				Advertise : _.find(state, 'Advertise').Advertise.default,
			}
		},
		{
			name 		: 'tool.ArticleDetail',
			modules : {
				Advertise : _.find(state, 'Advertise').Advertise.default,
			}
		},
		{
			name 		: 'tool.UploadMaterial',
			modules : {
				Advertise : _.find(state, 'Advertise').Advertise.default,
				AdvertiseCropper : _.find(state, 'AdvertiseCropper').AdvertiseCropper.default,
			}
		},
	]
};