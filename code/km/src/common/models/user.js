import axios from 'axios';

class User {

  // 登录
  async login (data) {
    return await axios
    .post('/user/login', data)
    .then(res => res);
  }

  // 注册
  async register (data) {
    return await axios
    .post('/user/register', data)
    .then(res => res);
  }

  // invite_code-用户信息
  async getInviteCodeInfo (data) {
    return await axios.get('/user/invite_code_info/', {
      params: data
    });
  }

  // 找回密码
  async findpwd (data) {
    return await axios
    .post('/user/public/password_reset', data)
    .then(res => res);
  }

  // 注销
  async logout (data) {
    return await axios
    .post('/user/logout', data)
    .then(res => res);
  }

  // 征信授权链接
  async zx (data) {
    return await axios
    .get('/user/zx', data)
    .then(res => res);
  }

  // 征信历史查询
  async zxLists (data) {
    return await axios
    .get('/user/zx/lists', data)
    .then(res => res);
  }

  // 职业列表
  async workList (data) {
    return await axios
    .get('/user/public/work_list', data)
    .then(res => res);
  }

  // 微名片详情
  async nameCardShow (data) {
    return await axios
    .get('/user/name_card/show', data)
    .then(res => res);
  }

  // 保存微名片
  async nameCardSave (data) {
    return await axios
    .post('/user/name_card/save', data)
    .then(res => res);
  }

  // 各等级人数
  async teamLevel (data) {
    return await axios
    .get('/user/team/level_num', data)
    .then(res => res);
  }

  // 团队总人数
  async getTeamNum (data) {
    return await axios
    .get('/user/team/get_team_num', data)
    .then(res => res);
  }

  // 我的团队 - 列表
  async teamList (data) {
    return await axios
    .get('/user/team/list', data)
    .then(res => res);
  }

  // 我的团队 - 进度条
  async advance (data) {
    return await axios
    .get('/user/advanced', data)
    .then(res => res);
  }

  // 我的团队 - 下级成员列表
  async childUserList (data) {
    return await axios
    .get('/user/team/child_user_list', data)
    .then(res => res);
  }

  // 我的团队 - 同等级人数
  async same (data) {
    return await axios
    .get('/user/team/same', data)
    .then(res => res);
  }

  // 我的团队 - 团队今日统计
  async teamStatistics (data) {
    return await axios
    .get('/user/team/statistics', data)
    .then(res => res);
  }

  // 我的团队 - 团队成员基本资料
  async teamDetail (data) {
    return await axios
    .get('/user/team/info', data)
    .then(res => res);
  }

  // 我的团队 - 团队成员办卡申请
  async teamCard (data) {
    return await axios
    .get('/user/team/card_list', data)
    .then(res => res);
  }

  // 我的团队 - 团队成员贷款申请
  async teamLender (data) {
    return await axios
    .get('/user/team/lender_list', data)
    .then(res => res);
  }

  // 专属服务经理
  async getMyManager () {
    return await axios.get('/user/my_manager');
  }

  //提现记录
  async withdraw (data) {
    return await axios
    .get('/user/withdraw/list', data)
    .then(res => res);
  }

  // 小贷列表
  async lenderExamine (data) {
    return await axios
    .get('/user/lender_examine/list', data)
    .then(res => res);
  }

  // 生成授权码
  async authCode (data) {
    return await axios
    .post('/user/auth_code', data)
    .then(res => res);
  }

  // 授权证书
  async myCertificate (data) {
    return await axios
    .get('/user/my_certificate', data)
    .then(res => res);
  }

  // 海报详情
  async myPoster (data) {
    return await axios
    .get('/user/my_poster', data)
    .then(res => res);
  }

  // 办卡查询 - 办卡列表
  async cardList (data) {
    return await axios
    .get('/user/credit_card_examine/list', data)
    .then(res => res);
  }

  // 办卡查询 - 卡片详情
  async cardInfo (data) {
    console.log(data);
    return await axios
    .get('/user/credit_card_examine/info', data)
    .then(res => res);
  }
  // 贷款查询 - 卡片详情
  async lenderInfo (data) {
    return await axios
    .get('/user/lender_examine/info', data)
    .then(res => res);
  }

  // 办卡查询 - 提示客户进度更新
  async notice (data) {
    return await axios
    .post('/user/credit_card_examine/notice', data)
    .then(res => res);
  }

  // 办卡查询 - 获取进度提醒通知
  async getNotice (data) {
    return await axios
    .get('/user/credit_card_examine/get_notice', data)
    .then(res => res);
  }

  // 是否可签到
  async signIn (data) {
    return await axios
    .get('/user/sign_in/check', data)
    .then(res => res);
  }

  // 签到
  async setSignIn (data) {
    return await axios
    .post('/user/sign_in/sign', data)
    .then(res => res);
  }

  // 签到历史
  async signInList (data) {
    return await axios
    .get('/user/sign_in/list', data)
    .then(res => res);
  }

  // 用户签到次数及积分
  async signInInfo (data) {
    return await axios
    .get('/user/sign_in/info', data)
    .then(res => res);
  }

  // 积分兑换 - 商品列表
  async integralGoodsList (data) {
    return await axios
    .get('/user/integral_goods/list', data)
    .then(res => res);
  }

  // 积分兑换 - 商品详情
  async integralGoodsInfo (data) {
    return await axios
    .get('/user/integral_goods/info', data)
    .then(res => res);
  }

  // 积分兑换 - 兑换商品
  async exchange (data) {
    return await axios
    .post('/user/integral_goods/exchange', data)
    .then(res => res);
  }

  // 积分兑换 - 兑换历史
  async integralLog (data) {
    return await axios
    .get('/user/integral_goods/log', data)
    .then(res => res);
  }

  // 积分抽奖 - 活动列表
  async lucky (data) {
    return await axios
    .get('/user/lucky/list', data)
    .then(res => res);
  }

  // 积分抽奖 - 活动详情及奖品
  async luckyInfo (data) {
    return await axios
    .get('/user/lucky/info', data)
    .then(res => res);
  }

  // 积分抽奖 - 抽奖
  async luckyRun (data) {
    return await axios
    .post('/user/lucky/run', data)
    .then(res => res);
  }

  // 积分抽奖 - 中奖记录（所有人）
  async luckyLog (data) {
    return await axios
    .get('/user/lucky/lucky_log', data)
    .then(res => res);
  }

  // 积分抽奖 - 抽奖记录详情
  async luckyLogInfo (data) {
    return await axios
    .get('/user/lucky/lucky_log_info', data)
    .then(res => res);
  }

  // 积分抽奖 - 领取奖品
  async luckyReceive (data) {
    return await axios
    .post('/user/lucky/address', data)
    .then(res => res);
  }

  // 积分抽奖 - 我的抽奖记录
  async luckyMylog (data) {
    return await axios
    .get('/user/lucky/my_log', data)
    .then(res => res);
  }

  // 积分 - 积分转让
  async trade (data) {
    return await axios
    .post('/user/integral/trade', data)
    .then(res => res);
  }

  // 积分 - 积分记录
  async integralLog (data) {
    return await axios
    .get('/user/integral/list', data)
    .then(res => res);
  }

  //账户管理银行卡列表
  async userBankList (data) {
    return await axios
    .get('/user/bank/list', {
      params: data
    });
  }

  //账户管理增加银行卡
  async userAddBank (data) {
    return await axios
    .post('/user/bank/add', data);
  }

  //账户管理删除银行卡
  async userDeleteBank (data) {
    return await axios
    .post('/user/bank/del', data);
  }

  //视频账号激活码
  async videoKey () {
    return await axios
    .get('/user/video_vip/list');
  }

  //删除 - 视频账号激活码
  async videoDel (data) {
    return await axios
    .post('/user/video_vip/del', data)
    .then(res => res);
  }

  //视频账号激活码
  async setReal (data) {
    return await axios
    .post('/user/profile/set_real', data)
    .then(res => res);
  }

  //视频账号激活码
  async shareInfo (data) {
    return await axios
    .get('/user/share_info', data)
    .then(res => res);
  }

  //积分排行榜
  async integralList (data) {
    return await axios
    .get('/user/public/integral_list', data)
    .then(res => res);
  }

  //收入排行
  async accountList (data) {
    return await axios
    .get('/user/public/account_list', data)
    .then(res => res);
  }

  //锁粉排行
  async fansList (data) {
    return await axios
    .get('/user/public/fans_list', data)
    .then(res => res);
	}

	// 卡盟龙虎榜
	async getRankingList (data) {
    return await axios.get('/user/ranking/list', {
			params: data
		});
	}

  //分享得积分
  async shareTheIntegral (data) {
    return await axios
    .post('/user/share/share', data)
    .then(res => res);
  }

  //分享得积分
  async inviteUserInfo (data) {
    return await axios
    .get('/user/invite_user_info', data)
    .then(res => res);
  }

  //极验验证码URL
  async geetest (data) {
    return await axios
    .get('/home/geetest/index', data)
    .then(res => res);
  }

  //授权后完善资料
  async ouathReg (data) {
    return await axios
    .post('/user/profile/ouath_reg', data)
    .then(res => res);
  }

  //帮助中心
  async help (data) {
    return await axios
    .get('/portal/help', data)
    .then(res => res);
  }
  //分享微名片
  async nameCardShare (data) {
    return await axios
    .get('/user/public/name_card_share', data)
    .then(res => res);
  }

  //公告、通知
  async messageNotice (data) {
    return await axios
    .get('/user/message/notice', data)
    .then(res => res);
  }

  //公告通知-已读
  async readNotice (data) {
    return await axios
    .post('/user/message/read_notice', data)
    .then(res => res);
  }

  //公告通知-已读
  async weixin (data) {
    return await axios
    .post('/user/sns_login/check_openid_chat/chat/1/channel/weixin', data)
    .then(res => res);
  }

  //信用卡信息查询弹框信息
  async getPopup (data) {
    return await axios
    .get('/user/message/card_tips', data)
    .then(res => res);
  }

  //信用卡信息关闭弹框信息
  async closePopup (data) {
    return await axios
    .get('/user/message/read_card_tips', data)
    .then(res => res);
  }

  // 用户评价统计
  async ratingCount (data) {
    return await axios
    .get('/user/rating_count', data)
    .then(res => res);
  }

  // 收到的评价
  async myRating (data) {
    return await axios
    .get('/user/my_rating', data)
    .then(res => res);
  }

  // 提交评价
  async rating (data) {
    return await axios
    .post('/user/rating', data)
    .then(res => res);
  }

  // 对别人的评价
  async mySendRating (data) {
    return await axios
    .get('/user/my_send_rating', data)
    .then(res => res);
  }

  // 取消评价
  async cancelRating (data) {
    return await axios
    .post('/user/cancel_rating', data)
    .then(res => res);
  }

  // 用户上级推荐人
  async myManager (data) {
    return await axios
    .get('/user/my_manager', data)
    .then(res => res);
  }

  // 用户可评价上级
  async parentList () {
    return await axios.get('user/spread/parent_list');
  }

  // 征信查询列表
  async creditList (data) {
    return await axios
    .get('/td/list', data)
    .then(res => res);
  }

  // 征信查询列表 - 详情
  async creditQuery (data) {
    return await axios
    .get('/td/query', data)
    .then(res => res);
  }

  // 绑定手机
  async bindMobile (data) {
    return await axios.post('/user/profile/bind_mobile', data);
  }

  // 获取上级推荐码
  async getParentInviteCode () {
    return await axios.get('/user/profile/parent_invite_code');
  }

  // 获取意见反馈列表
  async getFeedBack (data) {
    return await axios.get('/user/feedback/index', {
      params: data
    });
  }

  // 提交意见反馈
  async submitFeedBack (data) {
    return await axios.post('/user/feedback/new', data);
  }
}

export default new User();
