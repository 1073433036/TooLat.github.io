
/**
 * 异步按需加载模块
 */
const Home                      = resolve => require(['./components/home'], resolve);
const CreatePassword            = resolve => require(['./components/create_password'], resolve);
const Loan                      = resolve => require(['./components/loan'], resolve);
const LoanDeatil                = resolve => require(['./components/loan_detail'], resolve);
const LoanApply                 = resolve => require(['./components/loan_apply'], resolve);
const LoanLoans                 = resolve => require(['./components/loan_loans'], resolve);
const LoanSucceed               = resolve => require(['./components/loan_succeed'], resolve);
const LoanStick                 = resolve => require(['./components/loan_stick'], resolve);
const LoanStepDesc              = resolve => require(['./components/loan_step_desc'], resolve);
const TradePass                 = resolve => require(['./components/trade_pass'], resolve);
const CardAdd                   = resolve => require(['./components/card_add'], resolve);
const CreditCard                = resolve => require(['./components/credit_card'], resolve);
const CreditCardList            = resolve => require(['./components/credit_card_list'], resolve);
const CreditCardDetail          = resolve => require(['./components/credit_card_detail'], resolve);
const CreditCardApply           = resolve => require(['./components/credit_card_apply'], resolve);
const CreditCardHighQuota       = resolve => require(['./components/credit_card_high_quota'], resolve);
const CreditCardProgress        = resolve => require(['./components/credit_card_progress'], resolve);
const CreditCardProgressQuery   = resolve => require(['./components/credit_card_progress_query'], resolve);
const CreditCardAdd             = resolve => require(['./components/credit_card_add'], resolve);
const CreditCardRepayment       = resolve => require(['./components/credit_card_repayment'], resolve);
const CreditCardBillAdd         = resolve => require(['./components/credit_card_bill_add'], resolve);
const CreditCardInstalment      = resolve => require(['./components/credit_card_instalment'], resolve);
const CreditCardShare           = resolve => require(['./components/credit_card_share'], resolve);
const CreditCardShareJoin       = resolve => require(['./components/credit_card_share_join'], resolve);
const CreditCardShareInfo       = resolve => require(['./components/credit_card_share_info'], resolve);
const CreditCardShareInvite     = resolve => require(['./components/credit_card_share_invite'], resolve);
const CreditCardShareInput      = resolve => require(['./components/credit_card_share_input'], resolve);
const CreateApplyGuide      		= resolve => require(['./components/credit_card_list/components/create_apply_guide'], resolve);
const CreditCardLarge           = resolve => require(['./components/credit_card_large'], resolve);

const ArticleList               = resolve => require(['./components/article_list'], resolve);
const ArticleDetail             = resolve => require(['./components/article_detail'], resolve);
const Peer                      = resolve => require(['./components/peer'], resolve);
const PeerAdd                   = resolve => require(['./components/peer_add'], resolve);
const PeerDetail                = resolve => require(['./components/peer_detail'], resolve);
const PeerEdit                  = resolve => require(['./components/peer_edit'], resolve);
const Zx                        = resolve => require(['./components/zx'], resolve);
const ZxDetail                  = resolve => require(['./components/zx_detail'], resolve);
const Simulate1                 = resolve => require(['./components/simulate_1'], resolve);
const Simulate2                 = resolve => require(['./components/simulate_2'], resolve);
const Simulate3                 = resolve => require(['./components/simulate_3'], resolve);
const Simulate4                 = resolve => require(['./components/simulate_4'], resolve);

const EmptyPay                  = resolve => require(['./components/empty_pay'], resolve);
const EmptyPayDepositCardList   = resolve => require(['./components/empty_pay_deposit_bank_list'], resolve);
const EmptyPayDepositCardAdd    = resolve => require(['./components/empty_pay_deposit_bank_add'], resolve);
const PaySlot                   = resolve => require(['./components/pay_slot'], resolve);
const MoneyCode                 = resolve => require(['./components/money_code'], resolve);
const EmptyPayBill              = resolve => require(['./components/empty_pay_bill'], resolve);
const EmptyPayBillDetail        = resolve => require(['./components/empty_pay_bill_detail'], resolve);
const EmptyPayOrderpay          = resolve => require(['./components/empty_pay_order_pay'], resolve);
const Auth                      = resolve => require(['./components/auth'], resolve);
const AuthFlow                  = resolve => require(['./components/auth_flow'], resolve);
const AuthPhoto                 = resolve => require(['./components/auth_photo'], resolve);
const EmptyPayBankList          = resolve => require(['./components/empty_pay_bank_list'], resolve);
const EmptyPayBankAdd           = resolve => require(['./components/empty_pay_bank_add'], resolve);
const EmptyPaySuccess           = resolve => require(['./components/empty_pay_success'], resolve);

const Calculator                = resolve => require(['./components/calculator'], resolve);
const Houseloan                 = resolve => require(['./components/calculator/components/houseloan'], resolve);
const Carloan                   = resolve => require(['./components/calculator/components/carloan'], resolve);
const Equalfund                 = resolve => require(['./components/calculator/components/equalfund'], resolve);
const Equalinterest             = resolve => require(['./components/calculator/components/equalinterest'], resolve);
const SecondhandHouseLoan       = resolve => require(['./components/calculator/components/secondhand_house_loan'], resolve);
const AccumulationLoan          = resolve => require(['./components/calculator/components/accumulation_loan'], resolve);
const HousePropertyTax          = resolve => require(['./components/calculator/components/house_property_tax'], resolve);
const IncomeTax                 = resolve => require(['./components/calculator/components/income_tax'], resolve);
const BusinessLoan              = resolve => require(['./components/calculator/components/business_loan'], resolve);
const ApplyLoan                 = resolve => require(['./components/peer_apply_loan'], resolve);
const RateChoice                = resolve => require(['./components/calculator/components/houseloan/rate_choice'], resolve);

const NoopsycheCultivateCard    = resolve => require(['./components/noopsyche_cultivate_card'], resolve);
const NoopsycheCreditRefer      = resolve => require(['./components/noopsyche_credit_refer'], resolve);
const AddDepositCard            = resolve => require(['./components/noopsyche_sub1_set_payment_plan/components/add_deposit_card'], resolve);
const CultivateAuthFlow         = resolve => require(['./components/noopsyche_sub1_set_payment_plan/components/add_deposit_car_authflow'], resolve);
const DepositCardManage         = resolve => require(['./components/noopsyche_sub1_set_payment_plan/components/deposit_card_list'], resolve);
const SetPaymentPlan            = resolve => require(['./components/noopsyche_sub1_set_payment_plan'], resolve);
const PaymentProgress           = resolve => require(['./components/noopsyche_sub2_payment_progress_query'], resolve);
const PaymentProgressDetail     = resolve => require(['./components/noopsyche_sub2_payment_progress_query/components/payment_progress_detail'], resolve);
const SetPaymentPlanAddCard     = resolve => require(['./components/noopsyche_sub1_set_payment_plan/components/add_credit_card'], resolve);
const SetPaymentPlanAddplan     = resolve => require(['./components/noopsyche_sub1_set_payment_plan/components/add_payment_plan'], resolve);
const SetPaymentPlanConfirmPlan = resolve => require(['./components/noopsyche_sub1_set_payment_plan/components/comfirm_payment_plan'], resolve);
const SetPaymentPastPlan        = resolve => require(['./components/noopsyche_sub1_set_payment_plan/components/past_plan'], resolve);
const SetPaymentPlanPaySuccess  = resolve => require(['./components/noopsyche_sub1_set_payment_plan/components/pay_success'], resolve);
const PrenentTheft              = resolve => require(['./components/prevent_theft'], resolve);

const Increase                  = resolve => require(['./components/increase_cheats'], resolve);
const IncreaseList              = resolve => require(['./components/increase_cheats_list'], resolve);
const IncreaseClass             = resolve => require(['./components/increase_class'], resolve);
const IncreaseDetail            = resolve => require(['./components/increase_detail'], resolve);
const IncreaseIssue             = resolve => require(['./components/increase_issue'], resolve);
const IssueDetail              	= resolve => require(['./components/issue_detail'], resolve);
const SignIn              			= resolve => require(['./components/sign_in'], resolve);
const MyPrize              			= resolve => require(['./components/my_prize'], resolve);
const PrizeGet              		= resolve => require(['./components/prize_get'], resolve);
const ConvertRecord             = resolve => require(['./components/convert_record'], resolve);
const IntegralConvert           = resolve => require(['./components/integral_convert'], resolve);
const SpoilGet                  = resolve => require(['./components/spoil_get'], resolve);
const PreMoney                  = resolve => require(['./components/pre_money'], resolve);
const Card                  		= resolve => require(['./components/card'], resolve);
const SmallLoan                 = resolve => require(['./components/small_loan'], resolve);

const AppLogin                  = resolve => require(['./components/app_login'], resolve);
const AppDownLoad               = resolve => require(['./components/app_download'], resolve);
const AppHorizon                = resolve => require(['./components/app_horizon'], resolve);
const WeChatCard                = resolve => require(['./components/wechat_card'], resolve);
const WeChatAuto                = resolve => require(['./components/wechat_auto'], resolve);
const WeChatCoop                = resolve => require(['./components/wechat_coop'], resolve);
const WeChatCardInsuranceSign   = resolve => require(['./components/wechat_card_insurance_sign'], resolve);
const WechatLoanOffice          = resolve => require(['./components/wechat_loan_office'], resolve);
const WechatCreditCardSign      = resolve => require(['./components/wechat_credit_card_sign'], resolve);

const NewbieGuide               = resolve => require(['./components/newbie_guide'], resolve);

const CarBreakRules             = resolve => require(['./components/car_break_rules'], resolve);
const CarBreak                  = resolve => require(['./components/car_break'], resolve);
const CodeQuery                 = resolve => require(['./components/car_break_code_query'], resolve);
const MyCarInfo                 = resolve => require(['./components/car_break_rules_mycar'], resolve);
const CarDetails                = resolve => require(['./components/car_break_rules_cardetails'], resolve);
const AddCar                    = resolve => require(['./components/car_break_rules_addcar'], resolve);
const IDVerify                  = resolve => require(['./components/car_break_rules_verify'], resolve);
const IDVerifyHome              = resolve => require(['./components/car_break_rules_verifyhome'], resolve);
const CarRulesQuery             = resolve => require(['./components/car_break_rules_query'], resolve);
const RepairData                = resolve => require(['./components/car_break_rules_repair-data'], resolve);
const OrderPay                  = resolve => require(['./components/car_break_rules_order-pay'], resolve);
const MySelfOrader              = resolve => require(['./components/car_break_rules_myorder'], resolve);
const CarBreakPaySuccess        = resolve => require(['./components/car_break_paysuccess'], resolve);

const AppCarBreakRules          = resolve => require(['./components/app_car_break/car_break_rules'], resolve);
const AppCodeQuery              = resolve => require(['./components/app_car_break/car_break_code_query'], resolve);
const AppMyCarInfo              = resolve => require(['./components/app_car_break/car_break_rules_mycar'], resolve);
const AppAddCar                 = resolve => require(['./components/app_car_break/car_break_rules_addcar'], resolve);
const AppCarRulesQuery          = resolve => require(['./components/app_car_break/car_break_rules_query'], resolve);
const AppRepairData             = resolve => require(['./components/app_car_break/car_break_rules_repair-data'], resolve);
const AppOrderPay               = resolve => require(['./components/app_car_break/car_break_rules_order-pay'], resolve);
const AppMySelfOrader           = resolve => require(['./components/app_car_break/car_break_rules_myorder'], resolve);
const AppCarBreakPaySuccess     = resolve => require(['./components/app_car_break/car_break_paysuccess'], resolve);

const TracelessCode             = resolve => require(['./components/traceless_code'], resolve);
const ShareBusinessCard         = resolve => require(['./components/share_business_card'], resolve);
const Rule                      = resolve => require(['./components/rule'], resolve);
const Novice                    = resolve => require(['./components/novice'], resolve);
const CardShare                 = resolve => require(['./components/card_share'], resolve);
const LoanShare                 = resolve => require(['./components/loan_share'], resolve);

const WeChatFalseData           = resolve => require(['./components/wechat_false_data'], resolve);
const TestTheBankCard           = resolve => require(['./components/test_the_bank_card'], resolve);
const BankCardReasult           = resolve => require(['./components/bank_card_Reasult'], resolve);
const MessageFalseData          = resolve => require(['./components/message_false_data'], resolve);

const QueryCredit               = resolve => require(['./components/query_credit'], resolve);
const QueryCreditForm           = resolve => require(['./components/query_credit_form'], resolve);
const QueryCreditHistory        = resolve => require(['./components/query_credit_history'], resolve);
const QueryCreditReport         = resolve => require(['./components/query_credit_report'], resolve);
const QueryCreditReport1         = resolve => require(['./components/query_credit_report1'], resolve);
const QueryCreditDetail         = resolve => require(['./components/query_credit_detail'], resolve);
const QueryCreditSuccess        = resolve => require(['./components/query_credit_success'], resolve);

const SimulationApplyLoan       = resolve => require(['./components/SimulationApplyLoan'], resolve);
const simulationBank            = resolve => require(['./components/simulationBank'], resolve);
const LoanResults               = resolve => require(['./components/Loan_results'], resolve);

const studentCreditCard         = resolve => require(['./components/student_credit_card'], resolve);
const StudentCreditCardApply    = resolve => require(['./components/student_credit_card_apply'], resolve);
const CarVerification           = resolve => require(['./components/car_verification'], resolve);
const CollegeChoice             = resolve => require(['./components/college_choice'], resolve);
const GetSpShare                = resolve => require(['./components/get_sp_share'], resolve);
const CgbDetail                 = resolve => require(['./components/cgb_detail'], resolve);
const BankDetails               = resolve => require(['./components/bank_details'], resolve);
const CarBreakDetail            = resolve => require(['./components/car_break_detail'], resolve);
const AddLicence                = resolve => require(['./components/add_licence'], resolve);
const CarAccreditation          = resolve => require(['./components/car_accreditation'], resolve);
const CarBreakCheck             = resolve => require(['./components/car_break_check'], resolve);
const CarBrandChoice            = resolve => require(['./components/car_brand_choice'], resolve);
const IllegalIncome             = resolve => require(['./components/illegal_income'], resolve);
const CarBreakOrderConfirm      = resolve => require(['./components/car_break_order_confirm'], resolve);
const AppAndriodDownload        = resolve => require(['./components/app_andriod_download'], resolve);
const InsuranceNew              = resolve => require(['./components/insurance'], resolve);
const finishInvite              = resolve => require(['./components/finish_invite'], resolve);
const insuranceMessageCenter    = resolve => require(['./components/insurance_message_center'], resolve);
const insuranceList             = resolve => require(['./components/insurance_list'], resolve);
const insuranceInformation      = resolve => require(['./components/insurance_information'], resolve);
const insuranceListDetail       = resolve => require(['./components/insurance_list_detail'], resolve);
const insuranceOrderDetail      = resolve => require(['./components/insurance_order_detail'], resolve);
const carBreakRulesAllorder     = resolve => require(['./components/car_break_rules_allorder'], resolve);
const CarBreakPayResult         = resolve => require(['./components/car_break_pay_result'], resolve);
const generation                = resolve => require(['./components/intelligent_generation'], resolve);

const insuranceDestinationChoice              = resolve => require(['./components/insurance_destination_choice'], resolve);
const generationAuthFlow                      = resolve => require(['./components/intelligent_generation_authflow'], resolve);
const creditcardManageAdd                     = resolve => require(['./components/credit_card_manage_add'], resolve);
const creditcardManageList                    = resolve => require(['./components/credit_card_manage_list'], resolve);
const LoanDetailDesc                          = resolve => require(['./components/loan_detail_desc'], resolve);

const IntelligentAddCreditCards               = resolve => require(['./components/intelligent_add_credit_cards'], resolve);
const IntelligentAddCreditCardsV2             = resolve => require(['./components/intelligent_add_credit_cards_v2'], resolve);
const intelligentStorage                      = resolve => require(['./components/intelligent_generation_authflow_Storage'], resolve);
const intelligentIdentity                     = resolve => require(['./components/intelligent_generation_authflow_identity'], resolve);
const intelligentCreditCardManager            = resolve => require(['./components/intelligent_credit_card_manager'], resolve);
const intelligentAuthenticationInformation    = resolve => require(['./components/intelligent_authentication_information'], resolve);
const intelligentSetCreditCardPayment         = resolve => require(['./components/Intelligent_set_credit_card_payment'], resolve);
const intelligentPlanningMode                 = resolve => require(['./components/intelligent_planning_mode'], resolve);
const intelligentProjectDetails               = resolve => require(['./components/intelligent_project_details'], resolve);
const intelligentschedulelist                 = resolve => require(['./components/intelligent_schedule_list'], resolve);
const intelligentPaymentReservation           = resolve => require(['./components/intelligent_payment_reservation'], resolve);
const intelligentAuthentication               = resolve => require(['./components/intelligent_authentication'], resolve);
const noopsycheCheckData                      = resolve => require(['./components/noopsyche_check_data'], resolve);
const generalMessage                          = resolve => require(['./components/general_message'], resolve);
const cityChoice                              = resolve => require(['./components/city_choice'], resolve);

/**
 * 路由配置
 */
let router = {
  linkActiveClass: 'active',
  routes: [
    // 首页
    {
      path: '/',
      name: 'home.Home',
      component: Home,
      meta: {
        title: '卡盟V金服',
        authorization: true,
      }
    },
    {
      path: '/loan',
      name: 'home.Loan',
      component: Loan,
      meta: {
        title: '信用贷款',
        authorization: true,
      }
    },
    {
      path: '/loan/apply/:id',
      name: 'home.LoanApply',
      component: LoanApply,
      meta: {
        title: '贷款申请',
        authorization: true,
      }
    },
    {
      path: '/LoanResults',
      name: 'home.LoanResults',
      component:LoanResults,
      meta: {
        title: '模拟贷款结果页',
      }
    },
    {
      path: '/CollegeChoice',
      name: 'home.CollegeChoice',
      component:CollegeChoice,
      meta: {
        title: '大学选择',
      }
    },
    {
      path: '/loan/:id',
      name: 'home.LoanDeatil',
      component: LoanDeatil,
      meta: {
        title: '贷款详情',
      }
    },
    {
      path: '/loan_succeed/:id',
      name: 'home.LoanSucceed',
      component: LoanSucceed,
      meta: {
        title: '成功申请',
      }
    },
    {
      path: '/loan_loans',
      name: 'home.LoanLoans',
      component: LoanLoans,
      meta: {
        title: '申请贷款',
      }
    },
    {
      path: '/SimulationApplyLoan',
      name: 'home.SimulationApplyLoan',
      component: SimulationApplyLoan,
      meta: {
        title: '测试办信用卡',
      }
    },
     {
      path: '/testthebankcard',
      name: 'home.TestTheBankCard',
      component: TestTheBankCard,
      meta: {
        title: '模拟办卡',
      }
    },
    {
      path: '/simulationBank',
      name: 'home.simulationBank',
      component: simulationBank,
      meta: {
        title: '额度评估',
      }
    },
    {
      path: '/studentCreditCard',
      name: 'home.studentCreditCard',
      component:studentCreditCard,
      meta: {
        title: '校园卡申请',
      }
    },
    {
      path: '/bankcardReasult',
      name: 'home.BankCardReasult',
      component: BankCardReasult,
      meta: {
        title: '办卡结果',
      }
    },
    {
      path: '/loan_stick',
      name: 'home.LoanStick',
      component: LoanStick,
      meta: {
        title: '我要置顶',
        authorization: true,
      }
    },
    {
      path: '/LoanStepDesc',
      name: 'home.LoanStepDesc',
      component: LoanStepDesc,
      meta: {
        title: '申请步骤',
      }
    },
    {
      path: '/tradepass',
      name: 'home.TradePass',
      component: TradePass,
      meta: {
        title: '设置交易密码',
      }
    },
    {
      path: '/card/add',
      name: 'home.CardAdd',
      component: CardAdd,
      meta: {
        title: '添加储蓄卡',
      }
    },
    {
      path: '/creditcard',
      name: 'home.CreditCard',
      component: CreditCard,
      meta: {
        title: '信用卡中心',
        authorization: true,
      }
    },
    {
      path: '/creditcard/list/:bid',
      name: 'home.CreditCardList',
      component: CreditCardList,
      meta: {
        authorization: true,
        title: '信用卡列表',
      }
		},
		{
      path: '/credit_card_list/components/create_apply_guide/:id',
      name: 'home.CreateApplyGuide',
      component: CreateApplyGuide,
      meta: {
        authorization: true,
        title: '信用卡申请指南',
      }
    },
    {
      path: '/creditcard/large',
      name: 'home.CreditCardLarge',
      component: CreditCardLarge,
      meta: {
        title: '大额信用卡办理',
      }
    },

    {
      path: '/creditcard/:bid/apply/:id',
      name: 'home.CreditCardApply',
      component: CreditCardApply,
      meta: {
        title: '办卡申请',
      }
    },
    {
      path: '/creditcard/highquota',
      name: 'home.CreditCardHighQuota',
      component: CreditCardHighQuota,
      meta: {
        title: '大额信用卡办理',
      }
    },
    {
      path: '/creditcard/progress',
      name: 'home.CreditCardProgress',
      component: CreditCardProgress,
      meta: {
        title: '进度查询',
      }
    },
    {
      path: '/creditcard/progress/:id',
      name: 'home.CreditCardProgressQuery',
      component: CreditCardProgressQuery,
      meta: {
        title: '进度查询',
      }
    },
    {
      path: '/creditcard/add',
      name: 'home.CreditCardAdd',
      component: CreditCardAdd,
      meta: {
        title: '添加信用卡',
      }
    },
    {
      path: '/creditcard/repayment',
      name: 'home.CreditCardRepayment',
      component: CreditCardRepayment,
      meta: {
        authorization: true,
        title: '信用卡还款',
      }
    },
    {
      path: '/creditcard/bill/add',
      name: 'home.CreditCardBillAdd',
      component: CreditCardBillAdd,
      meta: {
        title: '添加信用卡账单',
      }
    },
    {
      path: '/creditcard/instalment/:id',
      name: 'home.CreditCardInstalment',
      component: CreditCardInstalment,
      meta: {
        authorization: true,
        title: '我要分期',
      }
    },
    {
      path: '/creditcard/share',
      name: 'home.CreditCardShare',
      component: CreditCardShare,
      meta: {
        title: '信用卡/办卡吧',
      }
    },
    {
      path: '/creditcard/share/join',
      name: 'home.CreditCardShareJoin',
      component: CreditCardShareJoin,
      meta: {
        title: '邀请加盟',
      }
    },
    {
      path: '/creditcard/share/info',
      name: 'home.CreditCardShareInfo',
      component: CreditCardShareInfo,
      meta: {
        authorization: true,
        title: '个人信息',
      }
    },
    {
      path: '/creditcard/share/invite',
      name: 'home.CreditCardShareInvite',
      component: CreditCardShareInvite,
      meta: {
        title: '我也要邀请',
      }
    },
    {
      path: '/creditcard/share/input',
      name: 'home.CreditCardShareInput',
      component: CreditCardShareInput,
      meta: {
        title: '信用卡/买单吧',
      }
    },
    {
      path: '/creditcard/:bid/:id',
      name: 'home.CreditCardDetail',
      component: CreditCardDetail,
      meta: {
        title: '信用卡介绍',
      }
    },
    {
      path: '/article/list/:id',
      name: 'home.ArticleList',
      component: ArticleList,
      meta: {
        title: '文章列表',
      }
    },
    {
      path: '/article/:id',
      name: 'home.ArticleDetail',
      component: ArticleDetail,
      meta: {
        title: '文章详情',
      }
    },
    {
      path: '/register/createpassword',
      name: 'home.CreatePassword',
      component: CreatePassword,
      meta: {
        title: '创建登录密码',
      }
    },
    {
      path: '/peer',
      name: 'home.Peer',
      component: Peer,
      meta: {
        title: '同行通讯录',
      }
    },
    {
      path: '/peer/add',
      name: 'home.PeerAdd',
      component: PeerAdd,
      meta: {
        title: '信贷经理',
        authorization: true,
      }
    },
    {
      path: '/peer/detail/:id',
      name: 'home.PeerDetail',
      component: PeerDetail,
      meta: {
        title: '信贷经理',
      }
    },
    {
      path: '/peer/edit',
      name: 'home.PeerEdit',
      component: PeerEdit,
      meta: {
        title: '修改资料',
        authorization: true,
      }
    },

    {
      path: '/zx',
      name: 'home.Zx',
      component: Zx,
      meta: {
        title: '征信查询',
      }
    },

    {
      path: '/zx/detail',
      name: 'home.ZxDetail',
      component: ZxDetail,
      meta: {
        title: '征信详情',
      }
    },

    {
      path: '/simulate/1',
      name: 'home.Simulate1',
      component: Simulate1,
      meta: {
        title: '测试办卡',
        authorization: true,
      }
    },

    {
      path: '/simulate/2',
      name: 'home.Simulate2',
      component: Simulate2,
      meta: {
        title: '测试办卡',
        authorization: true,
      }
    },

    {
      path: '/simulate/3',
      name: 'home.Simulate3',
      component: Simulate3,
      meta: {
        title: '测试办卡',
        authorization: true,
      }
    },

    {
      path: '/simulate/4',
      name: 'home.Simulate4',
      component: Simulate4,
      meta: {
        title: '模拟结果',
        authorization: true,
      }
    },

    {
      path: '/emptypay',
      name: 'home.EmptyPay',
      component: EmptyPay,
      meta: {
        title: '无卡支付',
        authorization: true,
      },
    },
    {
      path: '/auth',
      name: 'home.Auth',
      component: Auth,
      meta: {
        authorization: true,
        title: '申请开通'
      },
    },
    {
      path: '/auth/flow',
      name: 'home.AuthFlow',
      component: AuthFlow,
      meta: {
        authorization: true,
        title: '实名认证'
      },
    },
    {
      path: '/auth/photo',
      name: 'home.AuthPhoto',
      component: AuthPhoto,
      meta: {
        authorization: true,
        title: '实名认证'
      },
    },
    {
      path: '/emptypay/depositcard',
      name: 'home.EmptyPayDepositCardList',
      component: EmptyPayDepositCardList,
      meta: {
        authorization: true,
        title: '储蓄卡管理'
      },
    },
    {
      path: '/emptypay/adddepositcard',
      name: 'home.EmptyPayDepositCardAdd',
      component: EmptyPayDepositCardAdd,
      meta: {
        authorization: true,
        title: '添加储蓄卡'
      },
    },
    {
      path: '/emptypay/payslot',
      name: 'home.PaySlot',
      component: PaySlot,
      meta: {
        title: '选择支付通道',
      },
    },
    {
      path: '/emptypay/creditcardlist',
      name: 'home.EmptyPayBankList',
      component: EmptyPayBankList,
      meta: {
        title: '无卡支付信用卡列表',
      },
    },
    {
      path: '/emptypay/addcreditcard',
      name: 'home.EmptyPayBankAdd',
      component: EmptyPayBankAdd,
      meta: {
        title: '无卡支付添加信用卡',
      },
    },
    {
      path: '/emptypay/pay',
      name: 'home.EmptyPayOrderpay',
      component: EmptyPayOrderpay,
      meta: {
        title: '订单支付'
      },
    },
    {
      path: '/emptypay/paysuccess',
      name: 'home.EmptyPaySuccess',
      component: EmptyPaySuccess,
      meta: {
        title: '支付成功'
      },
    },
    {
      path: '/emptypay/payslot/moneycode',
      name: 'home.MoneyCode',
      component: MoneyCode,
      meta: {
        title: '收款码',
      },
    },
    {
      path: '/emptypay/bill',
      name: 'home.EmptyPayBill',
      component: EmptyPayBill,
      meta: {
        title: '账单',
      },
    },
    {
      path: '/emptypay/bill/detail',
      name: 'home.EmptyPayBillDetail',
      component: EmptyPayBillDetail,
      meta: {
        title: '账单详情',
      },
    },
    {
      path: '/calculator',
      name: 'home.Calculator',
      component: Calculator,
      meta: {
        title: '计算器'
      }
    },
    {
      path: '/calculator/houseloan',
      name: 'home.Houseloan',
      component: Houseloan,
      meta: {
        title: '房贷'
      },
      children: [
        {
          path: 'rateChoice',
          name: 'RateChoice',
          component: RateChoice,
          meta: {
            islogin: true
          }
        }
      ]
    },
    {
      path: '/calculator/equalfund/:id',
      name: 'home.Equalfund',
      component: Equalfund,
      meta: {
        title: '等额本金计算器'
      }
    },
    {
      path: '/calculator/equalinterest',
      name: 'home.Equalinterest',
      component: Equalinterest,
      meta: {
        title: '等额本息计算器'
      }
    },
    {
      path: '/calculator/carloan',
      name: 'home.Carloan',
      component: Carloan,
      meta: {
        title: '车贷'
      }
    },
    {
      path: '/calculator/secondhandhouseloan',
      name: 'home.SecondhandHouseLoan',
      component: SecondhandHouseLoan,
      meta: {
        title: '二手房贷款'
      }
    },
    {
      path: '/calculator/accumulationloan',
      name: 'home.AccumulationLoan',
      component: AccumulationLoan,
      meta: {
        title: '公积金贷款'
      }
    },
    {
      path: '/calculator/incometax/:id',
      name: 'home.IncomeTax',
      component: IncomeTax,
      meta: {
        title: '个人所得税'
      }
    },
    {
      path: '/calculator/housepropertytax',
      name: 'home.HousePropertyTax',
      component: HousePropertyTax,
      meta: {
        title: '房产税'
      }
    },
    {
      path: '/calculator/businessloan',
      name: 'home.BusinessLoan',
      component: BusinessLoan,
      meta: {
        title: '商业贷款'
      }
    },
    {
      path: '/noopsychecultivatecard',
      name: 'home.NoopsycheCultivateCard',
      component: NoopsycheCultivateCard,
      meta: {
        title: '智能精养卡',
        authorization: true,
      }
    },
    {
      path: '/noopsyche_credit_refer',
      name: 'home.NoopsycheCreditRefer',
      component: NoopsycheCreditRefer,
      meta: {
        title: '信息查询'
      }
    },
    {
      path: '/adddepositcard',
      name: 'home.AddDepositCard',
      component: AddDepositCard,
      meta: {
        title: '申请开通'
      }
    },
    {
      path: '/cultivateauthflow',
      name: 'home.CultivateAuthFlow',
      component: CultivateAuthFlow,
      meta: {
        title: '实名认证'
      }
    },
    {
      path: '/depositcardmanage',
      name: 'home.DepositCardManage',
      component: DepositCardManage,
      meta: {
        title: '银行卡管理'
      }
    },
    {
      path: '/setpaymentplan',
      name: 'home.SetPaymentPlan',
      component: SetPaymentPlan,
      meta: {
        title: '设置精养卡计划'
      }
    },
    {
      path: '/paymentprogress',
      name: 'home.PaymentProgress',
      component: PaymentProgress,
      meta: {
        title: '还款进度查询'
      }
    },
    {
      path: '/paymentdetail',
      name: 'home.PaymentProgressDetail',
      component: PaymentProgressDetail,
      meta: {
        title: '还款进度详情'
      }
    },
    {
      path: '/paymentplan/addcard',
      name: 'home.SetPaymentPlanAddCard',
      component: SetPaymentPlanAddCard,
      meta: {
        title: '添加信用卡'
      }
    },
    {
      path: '/paymentplan/addplan',
      name: 'home.SetPaymentPlanAddplan',
      component: SetPaymentPlanAddplan,
      meta: {
        title: '添加精养卡计划'
      }
    },
    {
      path: '/paymentplan/confirmplan',
      name: 'home.SetPaymentPlanConfirmPlan',
      component: SetPaymentPlanConfirmPlan,
      meta: {
        title: '确认还款计划'
      }
    },
		{
			path: '/paymentplan/paysuccess',
			name: 'home.SetPaymentPlanPaySuccess',
			component: SetPaymentPlanPaySuccess,
			meta: {
				title: '支付成功'
			}
		},
    {
      path: '/prenenttheft',
      name: 'home.PrenentTheft',
      component: PrenentTheft,
      meta: {
        title: '账户盗刷险',
        authorization: true,
      }
    },
    {
      path: '/past_plan',
      name: 'home.SetPaymentPastPlan',
      component: SetPaymentPastPlan,
      meta: {
				title: '往期计划'
			}
		},
    {
      path: '/applyloan',
      name: 'home.ApplyLoan',
      component: ApplyLoan,
      meta: {
        title: '我要申请',
        authorization: true,
      }
    },
    {
      path: '/increase_cheats',
      name: 'home.Increase',
      component: Increase,
      meta: {
        title: '提额秘籍'
      }
    },
    {
      path: '/increase_cheats_list/:id',
      name: 'home.IncreaseList',
      component: IncreaseList,
      meta: {
        title: '提额秘籍'
      }
    },
    {
      path: '/increase_detail/:id',
      name: 'home.IncreaseDetail',
      component: IncreaseDetail,
      meta: {
        title: '提额秘籍'
      }
    },
    {
      path: '/increase_issue',
      name: 'home.IncreaseIssue',
      component: IncreaseIssue,
      meta: {
        title: '发布'
      }
    },
    {
      path: '/issue_detail',
      name: 'home.IssueDetail',
      component: IssueDetail,
      meta: {
        title: '预览'
      }
		},
		{
      path: '/increase_class',
      name: 'home.IncreaseClass',
      component: IncreaseClass,
      meta: {
        title: '提额培训班'
      }
    },
		{
      path: '/sign_in',
      name: 'home.SignIn',
      component: SignIn,
      meta: {
        title: '签到',
        authorization: true,
      }
		},
		{
      path: '/my_prize/:id',
      name: 'home.MyPrize',
      component: MyPrize,
      meta: {
        title: '我的奖品'
      }
		},
		{
      path: '/prize_get/:id',
      name: 'home.PrizeGet',
      component: PrizeGet,
      meta: {
        title: '奖品领取'
      }
		},
		{
      path: '/convert_record',
      name: 'home.ConvertRecord',
      component: ConvertRecord,
      meta: {
        title: '兑奖记录'
      }
		},
		{
      path: '/integral_convert/:id',
      name: 'home.IntegralConvert',
      component: IntegralConvert,
      meta: {
        title: '积分兑换'
      }
		},
		{
      path: '/spoil_get',
      name: 'home.SpoilGet',
      component: SpoilGet,
      meta: {
        title: '奖品领取'
      }
		},
    {
      path: '/pre_money/:id',
      name: 'home.PreMoney',
      component: PreMoney,
      meta: {
        title: '工商银行预审额度查询'
      }
    },
    {
      path: '/card',
      name: 'home.Card',
      component: Card,
      meta: {
        title: '办卡查询'
      }
    },
    {
      path: '/small_loan',
      name: 'home.SmallLoan',
      component: SmallLoan,
      meta: {
        title: '小贷查询'
      }
    },
    {
      path: '/app/login',
      name: 'home.AppLogin',
      component: AppLogin,
      meta: {
        title: 'app登陆'
      }
    },
    {
      path: '/app/download',
      name: 'home.AppDownLoad',
      component: AppDownLoad,
      meta: {
        title: 'APP下载'
      }
    },
    {
      path: '/app/horizon',
      name: 'home.AppHorizon',
      component: AppHorizon,
      meta: {
        title: 'APP下载'
      }
    },
    {
      path: '/wechat/card',
      name: 'home.WeChatCard',
      component: WeChatCard,
      meta: {
        title: '信用卡管家'
      }
    },
    {
      path: '/wechat/auto',
      name: 'home.WeChatAuto',
      component: WeChatAuto,
      meta: {
        title: '汽车保险'
      }
    },
    {
      path: '/wechat/coop',
      name: 'home.WeChatCoop',
      component: WeChatCoop,
      meta: {
        title: '合伙人'
      }
    },
    {
      path: '/wechat_card_insurance_sign',
      name: 'home.WeChatCardInsuranceSign',
      component: WeChatCardInsuranceSign,
      meta: {
        title: '汽车保险签约'
      }
    },
    {
      path: '/wechat_loan_office',
      name: 'home.WechatLoanOffice',
      component: WechatLoanOffice,
      meta: {
        title: '信用贷款机构签约'
      }
    },
    {
      path: '/wechat_credit_card_sign',
      name: 'home.WechatCreditCardSign',
      component: WechatCreditCardSign,
      meta: {
        title: '信用卡签约'
      }
    },
    {
      path: '/newbie_guide',
      name: 'home.NewbieGuide',
      component: NewbieGuide,
      meta: {
        title: '新手指南'
			}
		},
    {
      path: '/carbreakrules',
      name: 'home.CarBreakRules',
      component: CarBreakRules,
      meta: {
        authorization: true,
        title: '违章查询'
      }
    },
		{
      path: '/CarBreak',
      name: 'home.CarBreak',
      component: CarBreak,
      meta: {
        authorization: true,
        title: '违章查询'
      }
    },
    {
      path: '/codequery',
      name: 'home.CodeQuery',
      component: CodeQuery,
      meta: {
        title: '违章代码查询'
      }
    },
    {
      path: '/mycar',
      name: 'home.MyCarInfo',
      component: MyCarInfo,
      meta: {
        authorization: true,
        title: '我的车辆'
      }
    },
    {
      path: '/cardetails',
      name: 'home.CarDetails',
      component: CarDetails,
      meta: {
        authorization: true,
        title: '车辆违章详情'
      }
    },
    {
      path: '/addcar',
      name: 'home.AddCar',
      component: AddCar,
      meta: {
        authorization: true,
        title: '添加车辆'
      }
    },
    {
      path: '/verify',
      name: 'home.IDVerify',
      component: IDVerify,
      meta: {
        authorization: true,
        title: '身份验证'
      }
    },
    {
      path: '/verifyhome',
      name: 'home.IDVerifyHome',
      component: IDVerifyHome,
      meta: {
        authorization: true,
        title: '身份验证'
      }
    },
    {
      path: '/carrulesquery',
      name: 'home.CarRulesQuery',
      component: CarRulesQuery,
      meta: {
        authorization: true,
        title: '违章查询'
      }
    },
    {
      path: '/repairdata',
      name: 'home.RepairData',
      component: RepairData,
      meta: {
        authorization: true,
        title: '补充资料'
      }
    },
    {
      path: '/carbreakorderpay',
      name: 'home.OrderPay',
      component: OrderPay,
      meta: {
        title: '支付订单'
      }
    },
    {
      path: '/carbreakorder',
      name: 'home.MySelfOrader',
      component: MySelfOrader,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/carbreakpaysuccess',
      name: 'home.CarBreakPaySuccess',
      component: CarBreakPaySuccess,
      meta: {
        title: '支付订单'
      }
    },
    {
      path: '/traceless_code',
      name: 'home.TracelessCode',
      component: TracelessCode,
      meta: {
        title: '无痕扫码'
      }
    },
    {
      path: '/share_business_card',
      name: 'home.ShareBusinessCard',
      component: ShareBusinessCard,
      meta: {
        title: '查看微名片'
      }
    },

    {
      path: '/novice',
      name: 'home.Novice',
      component: Novice,
      meta: {
        title: '新手上路'
      }
    },
    {
      path: '/rule',
      name: 'home.Rule',
      component: Rule,
      meta: {
        title: '常见问题'
      }
    },
    {
      path: '/card_share',
      name: 'home.CardShare',
      component: CardShare,
      meta: {
        authorization: true,
        title: '信用卡申请'
      }
    },
    {
      path: '/loan_share',
      name: 'home.LoanShare',
      component: LoanShare,
      meta: {
        authorization: true,
        title: '贷款额度预测'
      }
    },
    //app 违章
    {
      path: '/app/carbreakrules',
      name: 'home.AppCarBreakRules',
      component: AppCarBreakRules,
      meta: {
        authorization: true,
        title: '违章查询'
      }
    },
    {
      path: '/app/codequery',
      name: 'home.AppCodeQuery',
      component: AppCodeQuery,
      meta: {
        title: '违章代码查询'
      }
    },
    {
      path: '/app/mycar',
      name: 'home.AppMyCarInfo',
      component: AppMyCarInfo,
      meta: {
        authorization: true,
        title: '我的车辆'
      }
    },
    {
      path: '/app/addcar',
      name: 'home.AppAddCar',
      component: AppAddCar,
      meta: {
        authorization: true,
        title: '添加车辆'
      }
    },
    {
      path: '/app/carrulesquery',
      name: 'home.AppCarRulesQuery',
      component: AppCarRulesQuery,
      meta: {
        authorization: true,
        title: '违章查询'
      }
    },
    {
      path: '/app/repairdata',
      name: 'home.AppRepairData',
      component: AppRepairData,
      meta: {
        authorization: true,
        title: '补充资料'
      }
    },
    {
      path: '/app/carbreakorderpay',
      name: 'home.AppOrderPay',
      component: AppOrderPay,
      meta: {
        title: '支付订单'
      }
    },
    {
      path: '/app/carbreakorder',
      name: 'home.AppMySelfOrader',
      component: AppMySelfOrader,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/app/carbreakpaysuccess',
      name: 'home.AppCarBreakPaySuccess',
      component: AppCarBreakPaySuccess,
      meta: {
        title: '支付订单'
      }
    },
    {
      path: '/wechat_false_data',
      name: 'home.WeChatFalseData',
      component: WeChatFalseData,
      meta: {
        title: '生成数据'
      }
    },
    {
      path: '/message_false_data',
      name: 'home.MessageFalseData',
      component: MessageFalseData,
      meta: {
        title: '生成短信图片'
      }
    },
    {
      path: '/query_credit',
      name: 'home.QueryCredit',
      component: QueryCredit,
      meta: {
        title: '征信查询'
      }
    },
    {
      path: '/query_credit_form',
      name: 'home.QueryCreditForm',
      component: QueryCreditForm,
      meta: {
        title: '征信查询'
      }
    },
    {
      path: '/query_credit_history',
      name: 'home.QueryCreditHistory',
      component: QueryCreditHistory,
      meta: {
        title: '历史记录'
      }
    },
    {
      path: '/query_credit_detail',
      name: 'home.QueryCreditDetail',
      component: QueryCreditDetail,
      meta: {
        title: '历史记录'
      }
    },
    {
      path: '/query_credit_report',
      name: 'home.QueryCreditReport',
      component: QueryCreditReport,
      meta: {
        title: '信用报告'
      }
    },
    {
      path: '/query_credit_report1',
      name: 'home.QueryCreditReport1',
      component: QueryCreditReport1,
      meta: {
        title: '信用报告'
      }
    },
    {
      path: '/query_credit_success',
      name: 'home.QueryCreditSuccess',
      component: QueryCreditSuccess,
      meta: {
        title: '支付成功'
      }
    },
    {
      path: '/student_credit_card_apply',
      name: 'home.StudentCreditCardApply',
      component: StudentCreditCardApply,
      meta: {
        title: '信用卡申请'
      }
    },
    {
      path: '/carVerification',
      name: 'home.CarVerification',
      component: CarVerification,
      meta: {
        title: '车辆信息验证'
      }
    },
    {
      path: '/GetSpShare',
      name: 'home.GetSpShare',
      component: GetSpShare,
      meta: {
        title: '生成二维码'
      }
    },
    {
      path: '/CgbDetail',
      name: 'home.CgbDetail',
      component: CgbDetail,
      meta: {
        title: '广发银行'
      }
    },
    {
      path: '/BankDetails',
      name: 'home.BankDetails',
      component: BankDetails,
      meta: {
        title: '银行详情'
      }
    },
    {
      path: '/CarBreakDetail',
      name: 'home.CarBreakDetail',
      component: CarBreakDetail,
      meta: {
        title: '车辆详情'
      }
    },
    {
      path: '/AddLicence',
      name: 'home.AddLicence',
      component: AddLicence,
      meta: {
        title: '添加驾照'
      }
    },
    {
      path: '/CarAccreditation',
      name: 'home.CarAccreditation',
      component: CarAccreditation,
      meta: {
        title: '添加认证'
      }
    },
    {
      path: '/CarBrandChoice',
      name: 'home.CarBrandChoice',
      component: CarBrandChoice,
      meta: {
        title: '车辆选择'
      }
    },
    {
      path: '/CarBreakCheck',
      name: 'home.CarBreakCheck',
      component: CarBreakCheck,
      meta: {
        title: '车险车检'
      }
    },
    {
      path: '/IllegalIncome',
      name: 'home.IllegalIncome',
      component: IllegalIncome,
      meta: {
        title: '违章代缴'
      }
    },
    {
      path: '/CarBreakOrderConfirm',
      name: 'home.CarBreakOrderConfirm',
      component: CarBreakOrderConfirm,
      meta: {
        title: '订单确认'
      }
    },
    {
      path: '/AppAndriodDownload',
      name: 'home.AppAndriodDownload',
      component: AppAndriodDownload,
      meta: {
        title: '安卓APP下载流程'
      }
    },
    {
      path: '/InsuranceNew',
      name: 'home.InsuranceNew',
      component: InsuranceNew,
      meta: {
        title: '保险首页'
      }
    },
    {
      path: '/insuranceMessageCenter',
      name: 'home.insuranceMessageCenter',
      component: insuranceMessageCenter,
      meta: {
        title: '消息中心'
      }
    },
    {
      path: '/insuranceList',
      name: 'home.insuranceList',
      component: insuranceList,
      meta: {
        title: '保险列表'
      }
    },
    {
      path: '/insuranceInformation',
      name: 'home.insuranceInformation',
      component: insuranceInformation,
      meta: {
        title: '填写投保信息'
      }
    },
    {
      path: '/insuranceListDetail',
      name: 'home.insuranceListDetail',
      component: insuranceListDetail,
      meta: {
        title: '保险列表详情'
      }
    },
    {
      path: '/finishInvite',
      name: 'home.finishInvite',
      component: finishInvite,
      meta: {
        title: '注册'
      }
    },
    {
      path: '/insuranceOrderDetail',
      name: 'home.insuranceOrderDetail',
      component: insuranceOrderDetail,
      meta: {
        title: '保险订单详情'
      }
    },
    {
      path: '/insuranceDestinationChoice',
      name: 'home.insuranceDestinationChoice',
      component: insuranceDestinationChoice,
      meta: {
        title: '目的地的选择'
      }
    },
    {
      path: '/carBreakRulesAllorder',
      name: 'home.carBreakRulesAllorder',
      component: carBreakRulesAllorder,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/CarBreakPayResult',
      name: 'home.CarBreakPayResult',
      component: CarBreakPayResult,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/intelligentGeneration',
      name: 'home.Generation',
      component: generation,
      meta: {
        title: '智能代还首页'
      }
    },
    {
      path: '/generationAuthFlow',
      name: 'home.generationAuthFlow',
      component: generationAuthFlow,
      meta: {
        title: '实名认证'
      }
    },
    {
      path: '/creditcardManageAdd',
      name: 'home.creditcardManageAdd',
      component: creditcardManageAdd,
      meta: {
        title: '信用卡管理'
      }
    },
    {
      path: '/creditcardManageList',
      name: 'home.creditcardManageList',
      component: creditcardManageList,
      meta: {
        title: '信用卡管理'
      }
    },
    {
      path: '/LoanDetailDesc',
      name: 'home.LoanDetailDesc',
      component: LoanDetailDesc,
      meta: {
        title: '注意事项'
      }
    },
    {
      path: '/IntelligentAddCreditCards',
      name: 'home.IntelligentAddCreditCards',
      component: IntelligentAddCreditCards,
      meta: {
        title: '添加信用卡'
      }
    },
    {
      path: '/IntelligentAddCreditCardsV2',
      name: 'home.IntelligentAddCreditCardsV2',
      component: IntelligentAddCreditCardsV2,
      meta: {
        title: '填写信用卡信息'
      }
    },
    {
      path: '/intelligentStorage',
      name: 'home.intelligentStorage',
      component: intelligentStorage,
      meta: {
        title: '添加储蓄卡'
      }
    },
    {
      path: '/intelligentIdentity',
      name: 'home.intelligentIdentity',
      component: intelligentIdentity,
      meta: {
        title: '添加身份证'
      }
    },
    {
      path: '/intelligentCreditCardManager',
      name: 'home.intelligentCreditCardManager',
      component: intelligentCreditCardManager,
      meta: {
        title: '信用卡管理'
      }
    },
    {
      path: '/intelligentAuthenticationInformation',
      name: 'home.intelligentAuthenticationInformation',
      component: intelligentAuthenticationInformation,
      meta: {
        title: '认证信息'
      }
    },
    {
      path: '/intelligentSetCreditCardPayment',
      name: 'home.intelligentSetCreditCardPayment',
      component: intelligentSetCreditCardPayment,
      meta: {
        title: '设置还款计划'
      }
    },
    {
      path: '/intelligentPlanningMode',
      name: 'home.intelligentPlanningMode',
      component: intelligentPlanningMode,
      meta: {
        title: '设计模式'
      }
    },
    {
      path: '/intelligentProjectDetails',
      name: 'home.intelligentProjectDetails',
      component: intelligentProjectDetails,
      meta: {
        title: '设计详情'
      }
    },
    {
      path: '/intelligentschedulelist',
      name: 'home.intelligentschedulelist',
      component: intelligentschedulelist,
      meta: {
        title: '计划列表'
      }
    },
    {
      path: '/intelligentPaymentReservation',
      name: 'home.intelligentPaymentReservation',
      component: intelligentPaymentReservation,
      meta: {
        title: '预约还款'
      }
    },
    {
      path: '/intelligentAuthentication',
      name: 'home.intelligentAuthentication',
      component: intelligentAuthentication,
      meta: {
        title: '信用卡认证'
      }
    },
    {
      path: '/noopsycheCheckData',
      name: 'home.noopsycheCheckData',
      component: noopsycheCheckData,
      meta: {
        title: '信息查询核对资料'
      }
    },
    {
      path: '/generalMessage',
      name: 'home.generalMessage',
      component: generalMessage,
      meta: {
        title: '综合信息'
      }
    },
    {
      path: '/cityChoice',
      name: 'home.cityChoice',
      component: cityChoice,
      meta: {
        title: '城市选择'
      }
    },
  ]
};

export default router;
