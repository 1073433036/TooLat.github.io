import axios from 'axios';

class Pay {
  constructor () {
    this.url = 'https://api.kamengjinfu.com/api';
  }

  //无卡支付银行列表
  async emptyBankList (data) {
    return await axios
    .get('/cash/bank', data)
    .then(res => res);
  }

  //无卡支付银行支行列表
  async emptyBankBranchList (data) {
    return await axios
    .get(`/cash/bank_branch/${data}`)
    .then(res => res);
  }

  //用户绑定的银行卡列表
  async userBundleLBankist (data) {
    return await axios
    .get('/cash/card', data)
    .then(res => res);
  }

  //申请绑定用户储蓄银行卡
  async applyBundleCard (data) {
    return await axios
    .post('/cash/bind_card', data, {timeout: 30000});
  }

  //储蓄卡实名认证
  async authenticateCar (data) {
    return await axios
    .post('/cash/bind_card', data, {timeout: 30000});
  }

  //上传身份证和银行卡图片
  async uploadCardAndPapers (data) {
    return await axios
    .post('/cash/upload_card', data);
  }

  //银行卡列表(id)
  async bankList (data) {
    return await axios
    .get('/cash/card', data)
    .then(res => res);
  }

  //支付通道列表
  async payList (data) {
    return await axios
    .get('/cash/channel', data)
    .then(res => res);
  }

  //设置金额生成订单
  async createOrder (data) {
    return await axios
    .post('/cash/order/create', data)
    .then(res => res);
  }

  //储蓄卡对应的用户信用卡列表
  async userCreditCardList (data) {
    return await axios
    .get('/cash/credit_card', {
      params: data
    }).then(res => res);
  }

  //解除绑定信用卡
  async deleteCreditCard (data) {
    return await axios
    .post('/cash/credit_card_delete', data);
  }

  //添加信用卡申请
  async addCardApply (data) {
    return await axios
    .post('/cash/bind_credit_card', data);
  }

  //添加信用卡(无积分)
  async addCardNoneIntegral (data) {
    return await axios
    .post('/cash/bind_credit_card2', data);
  }

  //支付订单页的订单信息获取
  async getPayInfo (data) {
    return await axios
    .get('/cash/order/detail', data);
  }

  //获取支付验证码
  async getPayCaptcha (data) {
    return await axios
    .post('/cash/order/sms', data);
  }

  //提交支付(有积分)
  async confirmPay (data) {
    return await axios
    .post('/cash/order/pay', data);
  }

  //提交支付(无积分)
  async confirmPayNoneIntegral (data) {
    return await axios
    .post('/cash/order/pay', data);
  }

  //支付成功
  async paySuccess (data) {
    return await axios
    .post('/cash/order/query', data);
  }

  //易宝支付
  async handlePayYee (data) {
    return await axios
    .post('/cash/order/pay_yee', data, { timeout: 30000 });
  }
}

export default new Pay();