import axios from 'axios';

class Account {

  //用户余额，提现信息
  async userWithdrawInfo () {
    return await axios
    .get('/user/withdraw/config')
    .then(res => res);
  }

  // 用户收益、账单
  async list (data) {
    return await axios
    .get('/user/account/lists', data)
    .then(res => res);
  }

  //提现
  async userWithdraw (data) {
    return await axios
    .post('/user/withdraw/add', data);
  }

  //用户积分信息
  async userIntegralInfo () {
    return await axios
    .get('/user/withdraw/config_integral');
  }

  //积分明细
  async integralList () {
    return await axios
    .get('/user/integral/list');
  }

  //积分提现
  async integralWithdraw (data) {
    return await axios
    .post('/user/withdraw/add_integral', data);
  }

}

export default new Account();