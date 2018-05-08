import axios from 'axios';
class StudentCreditCard {
  //信用卡银行列表
  async creditcardlist (data) {
    return await axios
    .get('/credit_card/student', data)
    .then(res => res);
  }

  // 申请信用卡
  async applyCreditCard (data) {
    return await axios
    .post('/credit_card/school_apply', data)
    .then(res => res);
  }
}

export default new StudentCreditCard();
