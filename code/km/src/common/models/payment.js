import axios from 'axios';

class Payment {

  // 银行列表
  async get (data) {
    return await axios
    .post('/home/payment', data)
    .then(res => res);
  }

}

export default new Payment();