import axios from 'axios';

class SmsCode {

  // 银行列表
  async check (data) {
    return await axios
    .post('/user/sms_code/check', data)
    .then(res => res);
  }

}

export default new SmsCode();