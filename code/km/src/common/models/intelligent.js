import axios from 'axios';

class Intelligent {

  // 绑定信用卡
  async cardOpen (data) {
    return await axios
      .post('/intelligent_repayment/card/open', data)
      .then(res => res);
  }

  // 信用卡列表
  async cardList (data) {
    return await axios
      .get('/intelligent_repayment/card/lists', data)
      .then(res => res);
  }
  // 信用卡列表
  async cardDel (data) {
    return await axios
      .post('/intelligent_repayment/card/del', data)
      .then(res => res);
  }
  // 信用卡认证
  async cardBind (data) {
    return await axios
      .post('/intelligent_repayment/card/bind', data)
      .then(res => res);
  }

  // 实名验证
  async userAuthentication (data) {
    return await axios
      .post('/intelligent_repayment/authentication', data)
      .then(res => res);
  }

  // 用户是否已实名验证
  async userCheck (data) {
    return await axios
      .get('/intelligent_repayment/authentication/check', data)
      .then(res => res);
  }

  // 银行列表
  async bankList (data) {
    return await axios
      .get('/intelligent_repayment/bank_list', data)
      .then(res => res);
  }

  // 选择行业
  async industry (data) {
    return await axios
    .get('/intelligent_repayment/mcc', data);
  }

  //选择地区
  async area (data) {
    return await axios
    .get('/intelligent_repayment/area', data);
  }


  // 消费日期
  async consumeDate (data) {
    return await axios
      .post('/intelligent_repayment/date', data)
      .then(res => res);
  }

  // 消费行业
  async consumeIndustry (data) {
    return await axios
      .get('/intelligent_repayment/mcc', data)
      .then(res => res);
  }

  ///短信验证
  async checkSms (data) {
    return await axios
      .post('/user/sms_code/check', data)
      .then(res => res);
  }
  // 确认计划
  async createConfirm (data) {
    // console.log(data);
    return await axios
    .post('/intelligent_repayment/createConfirm', data);
  }

  // 提交计划
  async submitPlan (data) {
    return await axios
      .post('/intelligent_repayment/create', data)
      .then(res => res);
  }

  // 确认计划
  async confirmPlan (data) {
    return await axios
      .post('/intelligent_repayment/createConfirm', data)
      .then(res => res);
  }

  // 消费地区
  async consumerArea (data) {
    return await axios
      .get('/intelligent_repayment/area', data)
      .then(res => res);
  }

  // 订单状态列表
  async orderStatusList (data) {
    return await axios
      .get('/intelligent_repayment/menu', data)
      .then(res => res);
  }

  // 订单列表
  async orderLists (data) {
    return await axios
      .get('/intelligent_repayment/lists', data)
      .then(res => res);
  }

  // 子订单列表
  async orderSublist (data) {
    return await axios
      .get('/intelligent_repayment/c_lists', data)
      .then(res => res);
  }

  // 暂停订单列表
  async orderCancellist (data) {
    return await axios
      .post('/intelligent_repayment/cancel', data)
      .then(res => res);
  }
  // 城市字母
  async areaInitial (data) {
    return await axios
      .post('/intelligent_repayment/areaInitial', data)
      .then(res => res);
  }
  // profile/get
  async userInfo (data) {
    return await axios
      .post('/profile/get', data)
      .then(res => res);
  }
}

export default new Intelligent();
