import axios from 'axios';

class Profile {

  // 获取用户信息
  async get (data) {
    return await axios
    .get('/profile/get', data)
    .then(res => res);
  }

  // 完善用户信息
  async update (data) {
    return await axios
    .post('/profile/update', data)
    .then(res => res);
  }

  // 完善用户信息
  async parentInviteCode (data) {
    return await axios
    .get('/user/profile/parent_invite_code', data)
    .then(res => res);
  }

  // 用户信息是否完善
  async checkUserInfo (data) {
    return await axios
    .get('/user/profile/checkUserInfo', data)
    .then(res => res);
  }

  // 获取实名信息
  async getAuthentication (data) {
    return await axios
    .get('/user/profile/getAuthentication', data)
    .then(res => res);
  }

  // 实习会员转正还需要推荐数量
  async zsNumber (data) {
    return await axios
    .get('/user/profile/zs_number', data)
    .then(res => res);
  }

  // 环信ID获取会员信息
  async imInfo (data) {
    return await axios
    .get('/user/profile/im_info', data)
    .then(res => res);
  }

  // 显示车险佣金积分
  async getInsuranceNotice (data) {
    return await axios
    .get('/user/profile/get_insurance_notice', data)
    .then(res => res);
  }

  // 清除车险佣金积分
  async rmInsuranceNotice (data) {
    return await axios
    .get('/user/profile/rm_insurance_notice', data)
    .then(res => res);
  }

  // 获取客服列表
  async handleService (data) {
    return await axios
    .get('/user/profile/service', data)
    .then(res => res);
  }

}

export default new Profile();