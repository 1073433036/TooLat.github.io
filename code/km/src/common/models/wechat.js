import axios from 'axios';

class Wechat {

  // 检测微信是否授权
  async checkAuth (data) {
    return await axios
    .get('/user/sns_login/check_oauth', data)
    .then(res => res);
  }

  // 微信JS支付时检查是否需要授权
  async checkOpenid (data) {
    return await axios
    .get('/user/sns_login/check_openid', data)
    .then(res => res);
  }
}

export default new Wechat();