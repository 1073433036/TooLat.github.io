import axios from 'axios';

class Bill {

  // 账单列表
  async list (data) {
    return await axios
    .get('/user/bill/list', data)
    .then(res => res);
  }

  // 添加账单
  async create (data) {
    return await axios
    .post('/user/bill/create', data)
    .then(res => res);
  }
}

export default new Bill();