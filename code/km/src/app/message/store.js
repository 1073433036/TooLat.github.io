import _   		from 'lodash';

const state = [
	{ Message 						: require('~common/components/socket/state') },
];

/**
* 页面state请按照下面格式进行添加
*/
export default {

	// 公共部分
	common: {
		Message : _.find(state, 'Message').Message.default,
	},

	//路由部分
	store: [
	]
};