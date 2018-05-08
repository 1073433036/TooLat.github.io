import axios from 'axios';

class Bank {

  // 银行列表
  async list (data) {
    return await axios
    .get('/bank/list', data)
    .then(res => res);
  }

  // 银行详情
  async show (data) {
    return await axios
    .get('/bank/show', data)
    .then(res => res);
  }

  // 区域银行列表
  async areaBank (data) {
    return await axios
    .post('/home/bank/list', data)
    .then(res => res);
  }
}

export default new Bank();