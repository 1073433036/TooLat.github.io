import axios from 'axios';

class Public {

  // 汽车保险签约
  async sign (data) {
    return await axios
    .post('/home/sign/insurance', data)
    .then(res => res);
  }

  async credit (data) {
    return await axios
    .post('/home/sign/lender', data)
    .then(res => res);
  }

  // 合伙人签约
  async partner (data) {
    return await axios
    .post('/home/sign/partner', data)
    .then(res => res);
  }

  // 信用卡签约
  async creditCard (data) {
    return await axios
    .post('/home/sign/credit_card', data)
    .then(res => res);
  }

  // 信贷签约
  async lender (data) {
    return await axios
    .post('/home/sign/lender', data)
    .then(res => res);
  }

  // 更新未读消息
  async updateTips (data) {
    return await axios
    .post('/home/index/update_tips', data)
    .then(res => res);
  }

  // 长链接
  async getMsg (data) {
    return await axios
    .get('/msg.php', data)
    .then(res => res);
  }

  // 精养卡新年公告
  async getYearMsg (data) {
    return await axios
    .get('/cash_df/open', data);
  }

  // 判断是否节假日
  async isHoliday (data) {
    return await axios
    .get('/home/index/is_holiday', data);
  }

  // 判断是否节假日
  async indexV (data) {
    return await axios
    .get('/home/index/v', data);
  }
}

export default new Public();