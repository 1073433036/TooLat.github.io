import _ from 'lodash';

const state = [
	{ App: require('../state') },
	{ Dialog: require('~common/components/dialog/state') },
	{ Loading: require('~common/components/loading/state') },
	{ StartPage: require('~common/components/start_page/state') },

	{ Banks: require('~common/components/banks/state') },
	{ CityList: require('~common/components/city_list/state') },
	{ Branch: require('~common/components/branch/state') },
	{ Cropper: require('~common/components/cropper/state') },

	{ Houseloan: require('./components/calculator/components/houseloan/state') },
	{ AccumulationLoan: require('./components/calculator/components/accumulation_loan/state') },
	{ BusinessLoan: require('./components/calculator/components/business_loan/state') },

	{ CreditCard: require('./components/credit_card/state') },
	{ EmptyPay: require('./components/empty_pay/state') },
	{ EmptyPayBanks: require('./components/empty_pay_banks/state') },
	{ CreditCardShare: require('./components/credit_card_share/state') },
	{ AuthPhotoCropper: require('./components/auth_photo/components/cropper/state') },
	{ AuthFlowBanks: require('./components/auth_flow/components/banks/state') },
	{ AuthFlowBranch: require('./components/auth_flow/components/branch/state') },
	{ CultivateCard: require('./components/noopsyche_cultivate_card/state.js') },
	{ CultivateCardAuthFlowBanks: require('./components/noopsyche_sub1_set_payment_plan/components/add_deposit_car_authflow/components/banks/state') },
	{ CultivateCardAuthFlowBranch: require('./components/noopsyche_sub1_set_payment_plan/components/add_deposit_car_authflow/components/branch/state') },
	{ IncreaseCheats: require('./components/increase_cheats/state') },

	{ CarBreak: require('./components/car_break_rules/state') },
	{ CarBreakRuleCity: require('./components/car_break_rules_addcar/components/car_break_city/state') },

	{ AppCarBreak: require('./components/app_car_break/car_break_rules/state') },
	{ AppCarBreakRuleCity: require('./components/app_car_break/car_break_rules_addcar/components/car_break_city/state') },

  { CarBreakInfo: require('./components/car_break/state') },
  { Authentication: require('./components/intelligent_generation_authflow/state') },
  { IntelligentInfo: require('./components/intelligent_credit_card_manager/state') },
];


/**
* 页面state请按照下面格式进行添加
*/
export default {

	// 公共部分
	common: {
		App: _.find(state, 'App').App.default,
		Dialog: _.find(state, 'Dialog').Dialog.default,
		Loading: _.find(state, 'Loading').Loading.default,
		StartPage: _.find(state, 'StartPage').StartPage.default,
	},

	//路由部分
	store: [

		// 文章列表
		{
			name: 'home.ArticleList',
			modules: {
				CreditCard: _.find(state, 'CreditCard').CreditCard.default,
			}
		},

		// 信用卡列表
		{
			name: 'home.CreditCard',
			modules: {
				CreditCard: _.find(state, 'CreditCard').CreditCard.default,
			}
		},

		// 添加信用卡
		{
			name: 'home.CreditCardAdd',
			modules: {
				Banks: _.find(state, 'Banks').Banks.default,
			}
		},

		// 添加信用卡账单
		{
			name: 'home.CreditCardBillAdd',
			modules: {
				Banks: _.find(state, 'Banks').Banks.default,
			}
		},
		// 计算器
		{
			name: 'home.Houseloan',
			modules: {
				Houseloan: _.find(state, 'Houseloan').Houseloan.default,
			}
		},
		{
			name: 'home.AccumulationLoan',
			modules: {
				AccumulationLoan: _.find(state, 'AccumulationLoan').AccumulationLoan.default,
			}
		},
		{
			name: 'home.IncomeTax',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},
		{
			name: 'home.BusinessLoan',
			modules: {
				BusinessLoan: _.find(state, 'BusinessLoan').BusinessLoan.default,
			}
		},

		// 申请信贷经理
		{
			name: 'home.ApplyLoan',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
				Cropper: _.find(state, 'Cropper').Cropper.default,
			}
		},

		// 办卡申请
		{
			name: 'home.CreditCardApply',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},

		//办卡评估
		{
			name: 'home.Simulate1',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},

		// 无卡闪付
		{
			name: 'home.Home',
			modules: {
				EmptyPay: _.find(state, 'EmptyPay').EmptyPay.default,
			}
		},
		{
			name: 'home.AuthFlow',
			modules: {
				Banks: _.find(state, 'AuthFlowBanks').AuthFlowBanks.default,
				CityList: _.find(state, 'CityList').CityList.default,
				Branch: _.find(state, 'AuthFlowBranch').AuthFlowBranch.default,
				EmptyPay: _.find(state, 'EmptyPay').EmptyPay.default,
				Cropper : _.find(state, 'Cropper').Cropper.default,
			}
		},
		{
			name: 'home.EmptyPay',
			modules: {
				EmptyPay: _.find(state, 'EmptyPay').EmptyPay.default,
			}
		},
		{
			name: 'home.EmptyPayDepositCardList',
			modules: {
				EmptyPay: _.find(state, 'EmptyPay').EmptyPay.default,
			}
		},
		{
			name: 'home.PaySlot',
			modules: {
				EmptyPay: _.find(state, 'EmptyPay').EmptyPay.default,
			}
		},
		{
			name: 'home.EmptyPayBankList',
			modules: {
				EmptyPay: _.find(state, 'EmptyPay').EmptyPay.default,
			}
		},
		{
			name: 'home.EmptyPayBankAdd',
			modules: {
				EmptyPay: _.find(state, 'EmptyPay').EmptyPay.default,
				EmptyPayBanks: _.find(state, 'EmptyPayBanks').EmptyPayBanks.default
			}
		},
		{
			name: 'home.AuthPhoto',
			modules: {
				AuthPhotoCropper: _.find(state, 'AuthPhotoCropper').AuthPhotoCropper.default,
			}
		},
		{
			name: 'home.EmptyPayOrderpay',
			modules: {
				EmptyPay: _.find(state, 'EmptyPay').EmptyPay.default,
			}
		},

		//智能精养卡
		{
			name: 'home.NoopsycheCultivateCard',
			modules: {
				CultivateCard: _.find(state, 'CultivateCard').CultivateCard.default,
			}
		},
		{
			name: 'home.CultivateAuthFlow',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
				Banks: _.find(state, 'CultivateCardAuthFlowBanks').CultivateCardAuthFlowBanks.default,
				Branch: _.find(state, 'CultivateCardAuthFlowBranch').CultivateCardAuthFlowBranch.default
			}
		},
		{
			name: 'home.SetPaymentPlan',
			modules: {
				CultivateCard: _.find(state, 'CultivateCard').CultivateCard.default,
			}
		},
		{
			name: 'home.SetPaymentPlanAddplan',
			modules: {
				CultivateCard: _.find(state, 'CultivateCard').CultivateCard.default,
			}
		},
		{
			name: 'home.SetPaymentPlanConfirmPlan',
			modules: {
				CultivateCard: _.find(state, 'CultivateCard').CultivateCard.default,
			}
		},
		{
			name: 'home.PaymentProgress',
			modules: {
				CultivateCard: _.find(state, 'CultivateCard').CultivateCard.default,
			}
		},
		{
			name: 'home.PaymentProgressDetail',
			modules: {
				CultivateCard: _.find(state, 'CultivateCard').CultivateCard.default,
			}
		},

		// 提额秘籍
		{
			name: 'home.Increase',
			modules: {
				Cropper: _.find(state, 'Cropper').Cropper.default,
				IncreaseCheats: _.find(state, 'IncreaseCheats').IncreaseCheats.default,
			}
		},
		{
			name: 'home.IncreaseClass',
			modules: {
				Banks: _.find(state, 'Banks').Banks.default,
				IncreaseCheats: _.find(state, 'IncreaseCheats').IncreaseCheats.default,
			}
		},
		{
			name: 'home.IncreaseList',
			modules: {
				Banks: _.find(state, 'Banks').Banks.default,
				IncreaseCheats: _.find(state, 'IncreaseCheats').IncreaseCheats.default,
			}
		},
		{
			name: 'home.IssueDetail',
			modules: {
				IncreaseCheats: _.find(state, 'IncreaseCheats').IncreaseCheats.default,
			}
		},
		{
			name: 'home.IncreaseIssue',
			modules: {
				Cropper: _.find(state, 'Cropper').Cropper.default,
				IncreaseCheats: _.find(state, 'IncreaseCheats').IncreaseCheats.default,
			}
		},

		{
			name: 'home.CreditCardShareInfo',
			modules: {
				Cropper: _.find(state, 'Cropper').Cropper.default,
				IncreaseCheats: _.find(state, 'IncreaseCheats').IncreaseCheats.default,
			}
		},

		// 信用卡/办卡吧
		{
			name: 'home.CreditCardShare',
			modules: {
				CreditCardShare: _.find(state, 'CreditCardShare').CreditCardShare.default,
			}
		},

		// 房产证所在城市
		{
			name: 'home.LoanLoans',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},

		// 办卡申请所在地
		{
			name: 'home.LoanApply',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},

		// 信用卡/办卡吧 - 填写信息
		{
			name: 'home.CreditCardShareInfo',
			modules: {
				CreditCardShare: _.find(state, 'CreditCardShare').CreditCardShare.default,
			}
		},

		// 添加同行
		{
			name: 'home.PeerAdd',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},

		// 信贷经理 - 修改资料
		{
			name: 'home.PeerEdit',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
				Cropper: _.find(state, 'Cropper').Cropper.default,
			}
		},

		// 积分兑换
		{
			name: 'home.IntegralConvert',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},

		// 积分兑换
		{
			name: 'home.PrizeGet',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},

		// 大额信用卡办理
		{
			name: 'home.CreditCardLarge',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},
		//信用贷款机构签约
		{
			name: 'home.WechatLoanOffice',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
			}
		},
		// 合伙人
		{
			name: 'home.WeChatCoop',
			modules: {
				Cropper: _.find(state, 'Cropper').Cropper.default,
			}
		},

		//合伙人
		{
			name: 'home.WeChatCoop',
			modules: {
				Cropper: _.find(state, 'Cropper').Cropper.default,
			}
		},

		//车辆违章
		// {
		// 	name: 'home.MyCarInfo',
		// 	modules: {
		// 		CarBreak: _.find(state, 'CarBreak').CarBreak.default,
		// 	}
		// },
		{
			name: 'home.AddCar',
			modules: {
				CarBreak: _.find(state, 'CarBreak').CarBreak.default,
				CarBreakRuleCity: _.find(state, 'CarBreakRuleCity').CarBreakRuleCity.default,
			}
		},
		{
			name: 'home.CarRulesQuery',
			modules: {
				CarBreak: _.find(state, 'CarBreak').CarBreak.default,
			}
		},
		{
			name: 'home.RepairData',
			modules: {
				CarBreak: _.find(state, 'CarBreak').CarBreak.default,
			}
		},
		{
			name: 'home.MySelfOrader',
			modules: {
				CarBreak: _.find(state, 'CarBreak').CarBreak.default,
			}
		},
		{
			name: 'home.OrderPay',
			modules: {
				CarBreak: _.find(state, 'CarBreak').CarBreak.default,
			}
    },

    {
      name: 'home.CarBreak',
      modules: {
        CarBreakInfo: _.find(state, 'CarBreakInfo').CarBreakInfo.default,
      }
    },
    {
      name: 'home.CarBreakDetail',
      modules: {
        CarBreakInfo: _.find(state, 'CarBreakInfo').CarBreakInfo.default,
      }
    },
    {
      name: 'home.MyCarInfo',
      modules: {
        CarBreakInfo: _.find(state, 'CarBreakInfo').CarBreakInfo.default,
      }
		},
		{
			name: 'home.CarAccreditation',
			modules: {
        CarBreakInfo: _.find(state, 'CarBreakInfo').CarBreakInfo.default,
				Cropper: _.find(state, 'Cropper').Cropper.default,
      }
		},
		{
			name: 'home.CarBrandChoice',
			modules: {
        CarBreakInfo: _.find(state, 'CarBreakInfo').CarBreakInfo.default,
      }
    },
    {
			name: 'home.CarBreakOrderConfirm',
			modules: {
        CarBreakInfo: _.find(state, 'CarBreakInfo').CarBreakInfo.default,
      }
		},

		//App 车辆违章
		{
			name: 'home.AppMyCarInfo',
			modules: {
				CarBreak: _.find(state, 'AppCarBreak').AppCarBreak.default,
			}
		},
		{
			name: 'home.AppAddCar',
			modules: {
				CarBreak: _.find(state, 'AppCarBreak').AppCarBreak.default,
				CarBreakRuleCity: _.find(state, 'AppCarBreakRuleCity').AppCarBreakRuleCity.default,
			}
		},
		{
			name: 'home.AppCarRulesQuery',
			modules: {
				CarBreak: _.find(state, 'AppCarBreak').AppCarBreak.default,
			}
		},
		{
			name: 'home.AppRepairData',
			modules: {
				CarBreak: _.find(state, 'AppCarBreak').AppCarBreak.default,
			}
		},
		{
			name: 'home.AppMySelfOrader',
			modules: {
				CarBreak: _.find(state, 'AppCarBreak').AppCarBreak.default,
			}
		},
		{
			name: 'home.AppOrderPay',
			modules: {
				CarBreak: _.find(state, 'AppCarBreak').AppCarBreak.default,
			}
		},
		{
			name: 'home.Generation',
			modules: {
				CityList: _.find(state, 'CityList').CityList.default,
        Authentication: _.find(state, 'Authentication').Authentication.default,
			}
    },

    {
			name: 'home.AddLicence',
			modules: {
				Cropper: _.find(state, 'Cropper').Cropper.default,
			}
		},
		{
			name: 'home.noopsycheCheckData',
			modules: {
				Cropper: _.find(state, 'Cropper').Cropper.default,
			}
		},
    {
			name: 'home.generationAuthFlow',
			modules: {
        Authentication: _.find(state, 'Authentication').Authentication.default,
        Cropper : _.find(state, 'Cropper').Cropper.default,
			}
		},
    {
			name: 'home.intelligentStorage',
			modules: {
        Authentication: _.find(state, 'Authentication').Authentication.default,
        Cropper : _.find(state, 'Cropper').Cropper.default,
			}
		},
    {
      name: 'home.intelligentIdentity',
      modules: {
        Authentication: _.find(state, 'Authentication').Authentication.default,
        Cropper : _.find(state, 'Cropper').Cropper.default,
      }
    },

    // 精养代还
    {
      name: 'home.intelligentCreditCardManager',
      modules: {
        IntelligentInfo: _.find(state, 'IntelligentInfo').IntelligentInfo.default,
      }
    },
    {
      name: 'home.intelligentPlanningMode',
      modules: {
        IntelligentInfo: _.find(state, 'IntelligentInfo').IntelligentInfo.default,
      }
    },
    {
      name: 'home.intelligentSetCreditCardPayment',
      modules: {
        IntelligentInfo: _.find(state, 'IntelligentInfo').IntelligentInfo.default,
      }
    },
    {
      name: 'home.cityChoice',
      modules: {
        IntelligentInfo: _.find(state, 'IntelligentInfo').IntelligentInfo.default,
      }
    },

	]
};
