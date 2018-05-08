import axios from 'axios';

class Cultivate {
  constructor () {
    this.url = 'https://api.kamengjinfu.com/api';
  }

  //银行列表
  async getBankList () {
    return await axios
    .get('/cash_df/bank');
  }

  //信用卡列表
  async getCreditCardList (data) {
    return await axios
    .get('/cash_df/card/list', {
      params: data
    });
  }

  //添加信用卡
  async addCreditCard (data) {
    return await axios
    .post('/cash_df/card/create', data);
  }

  //删除信用卡
  async deleteCreditCard (data) {
    return await axios
    .post('/cash_df/card/delete', data);
  }

  //新增还款计划
  async addNewwPaymentPlan (data) {
    return await axios
    .post('/cash_df/order/create', data);
  }

  //确认计划、支付
  async confirmPlan (data) {
    return await axios
    .post('/cash_df/order/pay', data, { timeout: 20000 });
  }

  //还款进度列表
  async paymentProgressList (data) {
    return await axios
    .get('/cash_df/project/list', {
      params: data
    });
  }

  //还款详情
  async paymentDetail (data) {
    return await axios
    .get('/cash_df/project/detail', {
      params: data
    });
  }

  //删除还款计划
  async delete (data) {
    return await axios
    .post('/cash_df/order/delete', data);
  }

}

export default new Cultivate();