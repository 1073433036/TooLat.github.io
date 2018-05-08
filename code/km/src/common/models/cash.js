import axios from 'axios';

class Cash {

  // 银行列表
  async bank (data) {
    return await axios
    .get('/cash/bank', data)
    .then(res => res);
  }

  // 银行支行列表
  async bankBranch (data) {
    return await axios
    .get(`/cash/bank_branch/${data}`, data)
    .then(res => res);
  }

  // 银行卡实名认证
  async bindCard (data) {
    return await axios
    .post('http://1c9048t279.imwork.net/api/cash/bind_card', data)
    .then(res => res);
  }

}

export default new Cash();