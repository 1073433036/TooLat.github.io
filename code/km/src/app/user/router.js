
/**
 * 异步按需加载模块
 */
const Home                          = resolve => require(['./components/home'], resolve);
const BuyVip                        = resolve => require(['./components/buy_vip'], resolve);
const BuySuccess                    = resolve => require(['./components/buy_success'], resolve);
const Account                       = resolve => require(['./components/account'], resolve);
const Income                        = resolve => require(['./components/income'], resolve);
const PresentRecord                 = resolve => require(['./components/present_record'], resolve);
const BankList                      = resolve => require(['./components/bank_list'], resolve);
const BankAdd                       = resolve => require(['./components/bank_add'], resolve);
const Business                      = resolve => require(['./components/business'], resolve);
const BusinessEdit                  = resolve => require(['./components/business_edit'], resolve);
const Team                          = resolve => require(['./components/team'], resolve);
const TeamChild                     = resolve => require(['./components/team_child'], resolve);
const TeamDetail                    = resolve => require(['./components/team_detail'], resolve);
const Card                          = resolve => require(['./components/card'], resolve);
const CardDetail                    = resolve => require(['./components/card_detail'], resolve);
const Loan                          = resolve => require(['./components/loan'], resolve);
const LoanDetail                    = resolve => require(['./components/loans_detail'], resolve);
const Peer                          = resolve => require(['./components/peer'], resolve);
const PeerDetail                    = resolve => require(['./components/peer_detail'], resolve);
const Certificate                   = resolve => require(['./components/certificate'], resolve);
const Invite                        = resolve => require(['./components/invite'], resolve);
const InviteTotal                   = resolve => require(['./components/invite_total'], resolve);
const Profile                       = resolve => require(['./components/profile'], resolve);
const Certify                       = resolve => require(['./components/certify'], resolve);
const Poster                        = resolve => require(['./components/poster'], resolve);
const Issue                         = resolve => require(['./components/issue'], resolve);
const RankingList                   = resolve => require(['./components/ranking_list'], resolve);
const VideoKey                      = resolve => require(['./components/video_key'], resolve);
// const Exchange                      = resolve => require(['./components/exchange'], resolve);
const MakeOver                      = resolve => require(['./components/make_over'], resolve);
const IntegralDeduction             = resolve => require(['./components/integral_deduction'], resolve);
const ExchangeRule                  = resolve => require(['./components/exchange_rule'], resolve);
const MakeOverRecord                = resolve => require(['./components/make_over_record'], resolve);
const HelpCenter                    = resolve => require(['./components/help_center'], resolve);
const WithdrawDeposit               = resolve => require(['./components/withdraw_deposit'], resolve);
const IntegralDetail                = resolve => require(['./components/integral_detail'], resolve);
const Integralwithdraw              = resolve => require(['./components/integral_withdraw_deposit'], resolve);

const Wallet                        = resolve => require(['./components/agency_wallet'], resolve);
const AgencyProfile                 = resolve => require(['./components/agency_profile'], resolve);
const Partner                       = resolve => require(['./components/agency_partner'], resolve);
const EverydayAdd                   = resolve => require(['./components/agency_everyday_add'], resolve);
const Withdraw                      = resolve => require(['./components/agency_withdraw'], resolve);
const WithdrawRecord                = resolve => require(['./components/agency_withdraw_record'], resolve);
const MyTeam                        = resolve => require(['./components/agency_my_team'], resolve);
const SeniorMember                  = resolve => require(['./components/agency_senior_member'], resolve);
const PartnerAccountManage          = resolve => require(['./components/agency_partner_account_manage'], resolve);
const BankCard                      = resolve => require(['./components/agency_bank_card'], resolve);
const AgencyBankList                = resolve => require(['./components/agency_bank_list'], resolve);
const videoPlay                     = resolve => require(['./components/video_play'], resolve);

const Stimulate                     = resolve => require(['./components/stimulate_plan'], resolve);
const UseFlow                       = resolve => require(['./components/use_flow'], resolve);
const UseDetail                     = resolve => require(['./components/use_detail'], resolve);
const Manual                        = resolve => require(['./components/manual'], resolve);
const Insure                        = resolve => require(['./components/insure'], resolve);
const ClassRoom                     = resolve => require(['./components/class_room'], resolve);
const ClassRoomHome                 = resolve => require(['./components/class_room_homepag'], resolve);
const MyScore                       = resolve => require(['./components/my_score'], resolve);
const Advice                        = resolve => require(['./components/advice'], resolve);
const CreditsExchange               = resolve => require(['./components/credits_exchange'], resolve);


/**
* 路由配置
*/
let router = {
  linkActiveClass: 'active',

  routes: [

    // 个人中心
    {
      path: '/user',
      component: {
        template: '<router-view></router-view>',
      },
      meta: {
        authorization: true,
      },
      children: [

        // 首页
        {
          path: '/',
          query: {
            dt: ''
          },
          name: 'user.Home',
          component: Home,
          meta: {
            title: '个人中心',
          },
        },

        // 账户管理
        {
          path: 'account',
          name: 'user.Account',
          component: Account,
          meta: {
            title: '账户管理',
          },
        },
        {
          path: 'withdrawdeposit',
          name: 'user.WithdrawDeposit',
          component: WithdrawDeposit,
          meta: {
            title: '提现',
          },
        },
        {
          path: 'integraldetail',
          name: 'user.IntegralDetail',
          component: IntegralDetail,
          meta: {
            title: '积分提现',
          },
        },
        {
          path: 'integralwithdraw',
          name: 'user.Integralwithdraw',
          component: Integralwithdraw,
          meta: {
            title: '积分提现',
          },
        },

        // 收益明细
        {
          path: 'income',
          name: 'user.Income',
          component: Income,
          meta: {
            title: '收益明细',
          },
        },

        // 提现记录
        {
          path: 'present_record',
          name: 'user.PresentRecord',
          component: PresentRecord,
          meta: {
            title: '提现记录',
          },
        },

        // 银行卡管理
        {
          path: 'bank',
          name: 'user.BankList',
          component: BankList,
          meta: {
            title: '银行卡管理',
          },
        },

        // 添加银行卡
        {
          path: 'bank/add',
          name: 'user.BankAdd',
          component: BankAdd,
          meta: {
            title: '添加银行卡'
          },
        },

        // 微名片
        {
          path: 'business',
          name: 'user.Business',
          component: Business,
          meta: {
            title: '微名片'
          },
        },

        // 微名片编辑
        {
          path: 'business/edit',
          name: 'user.BusinessEdit',
          component: BusinessEdit,
          meta: {
            title: '编辑名片信息'
          },
        },

        // 我的团队
        {
          path: 'team',
          name: 'user.Team',
          component: Team,
          meta: {
            title: '我的团队'
          },
        },

        // 子团队 团队管理
        {
          path: 'team_child/:id',
          name: 'user.TeamChild',
          component: TeamChild,
          meta: {
            title: '团队管理'
          },
        },

        // 团队详情
        {
          path: 'team/:id',
          name: 'user.TeamDetail',
          component: TeamDetail,
          meta: {
            title: '团队详情'
          },
        },

        // 办卡查询
        {
          path: 'card',
          name: 'user.Card',
          component: Card,
          meta: {
            title: '办卡查询'
          },
        },

        // 办卡查询
        {
          path: 'card/:id',
          name: 'user.CardDetail',
          component: CardDetail,
          meta: {
            title: '办卡查询'
          },
        },

        // 小贷查询
        {
          path: 'loan',
          name: 'user.Loan',
          component: Loan,
          meta: {
            title: '小贷查询'
          },
        },
          // 小贷查询
        {
          path: 'LoanDetail',
          name: 'user.LoanDetail',
          component: LoanDetail,
          meta: {
            title: '小贷查询详情'
          },
        },

        // 我的信贷经理
        {
          path: 'mypeer/:id',
          name: 'user.Peer',
          component: Peer,
          meta: {
            title: '我的信贷经理'
          },
        },

        // 信贷经理详情
        {
          path: 'peer/:id',
          name: 'user.PeerDetail',
          component: PeerDetail,
          meta: {
            title: '信贷经理'
          },
        },

        // 授权证书
        {
          path: 'certificate',
          name: 'user.Certificate',
          component: Certificate,
          meta: {
            title: '授权证书'
          },
        },

        // 去邀请好友
        {
          path: 'invite',
          name: 'user.Invite',
          component: Invite,
          meta: {
            title: '去邀请好友'
          },
        },

        // 邀请好友
        {
          path: 'invitetotal',
          name: 'user.InviteTotal',
          component: InviteTotal,
          meta: {
            title: '邀请好友'
          },
        },

        // 个人设置
        {
          path: 'profile',
          name: 'user.Profile',
          component: Profile,
          meta: {
            title: '个人设置'
          },
        },

        // 实名验证
        {
          path: 'certify',
          name: 'user.Certify',
          component: Certify,
          meta: {
            title: '实名验证'
          },
        },

        // 我的专属海报
        {
          path: 'poster',
          name: 'user.Poster',
          component: Poster,
          meta: {
            title: '我的专属海报'
          },
        },

        // 我的发布
        {
          path: 'issue',
          name: 'user.Issue',
          component: Issue,
          meta: {
            title: '我的发布'
          },
        },

        // 排行榜
        {
          path: 'rankinglist',
          name: 'user.RankingList',
          component: RankingList,
          meta: {
            title: '排行榜'
          },
        },

        // 购买会员
        {
          path: 'buy_vip',
          name: 'user.BuyVip',
          component: BuyVip,
          meta: {
            title: '升级代理',
          },
        },

        // 支付成功
        {
          path: 'buy_success',
          name: 'user.BuySuccess',
          component: BuySuccess,
          meta: {
            title: '支付成功',
          },
        },
        // 视频激活码
        {
          path: 'video_key',
          name: 'user.VideoKey',
          component: VideoKey,
          meta: {
            title: '视频激活码',
          },
        },
        // 积分兑换
        {
          path: 'CreditsExchange',
          name: 'user.CreditsExchange',
          component: CreditsExchange,
          meta: {
            title: '积分兑换',
          },
        },
        // 积分转让
        {
          path: 'make_over',
          name: 'user.MakeOver',
          component: MakeOver,
          meta: {
            title: '积分转让',
          },
        },
        // 积分抵扣
        {
          path: 'integral_deduction',
          name: 'user.IntegralDeduction',
          component: IntegralDeduction,
          meta: {
            title: '积分抵扣',
          },
        },
        // 兑换规则
        {
          path: 'exchange_rule',
          name: 'user.ExchangeRule',
          component: ExchangeRule,
          meta: {
            title: '兑换规则',
          },
        },
        // 转让记录
        {
          path: 'make_over_record',
          name: 'user.MakeOverRecord',
          component: MakeOverRecord,
          meta: {
            title: '转让记录',
          },
        },
        // 帮助中心
        {
          path: 'help_center',
          name: 'user.HelpCenter',
          component: HelpCenter,
          meta: {
            title: '帮助中心',
          },
        },
        // 代理---钱包
        {
          path: 'agency_wallet',
          name: 'user.Wallet',
          component: Wallet,
          meta: {
            title: '钱包',
          },
        },
        //代理---个人设置中心
        {
          path: 'agency_profile',
          name: 'user.AgencyProfile',
          component: AgencyProfile,
          meta: {
            title: '个人设置中心',
          },
        },
        //代理---合伙人
        {
          path: 'agency_partner',
          name: 'user.Partner',
          component: Partner,
          meta: {
            title: '合伙人',
          },
        },
        //代理---每日新增
        {
          path: 'agency_everyday_add',
          name: 'user.EverydayAdd',
          component: EverydayAdd,
          meta: {
            title: '每日新增',
          },
        },
        //代理---提现
        {
          path: 'agency_withdraw',
          name: 'user.Withdraw',
          component: Withdraw,
          meta: {
            title: '每日新增',
          },
        },
        //代理---提现记录
        {
          path: 'agency_withdraw_record',
          name: 'user.WithdrawRecord',
          component: WithdrawRecord,
          meta: {
            title: '提现记录',
          },
        },
        //代理---我的团队
        {
          path: 'agency_my_team',
          name: 'user.MyTeam',
          component: MyTeam,
          meta: {
            title: '我的团队',
          },
        },
        //代理---高级会员
        {
          path: 'agency_senior_member',
          name: 'user.SeniorMember',
          component: SeniorMember,
          meta: {
            title: '高级会员',
          },
        },
        //代理---合伙人账户管理
        {
          path: 'agency_partner_account_manage',
          name: 'user.PartnerAccountManage',
          component: PartnerAccountManage,
          meta: {
            title: '合伙人账户管理',
          },
        },
        //代理---银行卡
        {
          path: 'agency_bank_card',
          name: 'user.BankCard',
          component: BankCard,
          meta: {
            title: '银行卡',
          },
        },
        //代理---银行卡管理
        {
          path: 'agency_bank_list',
          name: 'user.AgencyBankList',
          component: AgencyBankList,
          meta: {
            title: '银行卡管理',
          },
        },

        //视频讲解
        {
          path: 'video_play',
          name: 'user.videoPlay',
          component: videoPlay,
          meta: {
            title: '视频讲解',
          },
        },
        //2018开战激励
        {
          path: 'stimulate2018',
          name: 'user.Stimulate',
          component: Stimulate,
          meta: {
            title: '排行榜详情',
          },
        },
        //卡盟流程说明
        {
          path: 'use_flow',
          name: 'user.UseFlow',
          component: UseFlow,
          meta: {
            title: '卡盟流程说明',
          },
        },
        //卡盟流程说明 - 详情
        {
          path: 'use_detail',
          name: 'user.UseDetail',
          component: UseDetail,
          meta: {
            title: '卡盟流程说明',
          },
        },
        //平台手册
        {
          path: 'manual',
          name: 'user.Manual',
          component: Manual,
          meta: {
            title: '平台手册',
          },
        },

        //保险设置
        {
          path: 'insure',
          name: 'user.Insure',
          component: Insure,
          meta: {
            title: '保险设置',
          },
        },

        //培训课堂
        {
          path: 'classroom',
          name: 'user.ClassRoomHome',
          component: ClassRoomHome,
          meta: {
            title: '卡盟课堂',
          },
        },
        {
          path: 'classroom/:id',
          name: 'user.ClassRoom',
          component: ClassRoom,
          meta: {
            title: '培训课堂',
          },
        },

        // 我的评价
        {
          path: 'my_score',
          name: 'user.MyScore',
          component: MyScore,
          meta: {
            title: '我的评价',
          },
        },
         // 积分兑换
         {
          path: 'my_score',
          name: 'user.MyScore',
          component: MyScore,
          meta: {
            title: '积分兑换',
          },
        },
        {
          path: 'Advice',
          name: 'user.Advice',
          component: Advice,
          meta: {
            title: '意见反馈',
          },
        }

      ]
    },
  ]
};

export default router;
