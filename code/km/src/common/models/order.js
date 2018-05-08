import axios from 'axios';

class Order {

  // 创建信贷经理置顶订单
  async createLenderOrder (data) {
    return await axios
    .post('lender_order/stick_order', data)
    .then(res => res);
  }

  // 购买会员下单
  async create (data) {
    return await axios
    .post('/user/order/create', data)
    .then(res => res);
  }

  // 会员支付订单
  async pay (data) {
    return await axios
    .post('/user/order/pay', data)
    .then(res => res);
  }

  // 订单详情
  async info (data) {
    return await axios
    .get('/user/order/info', data)
    .then(res => res);
  }

  // 是否需要购买盗刷险
  async isInsurance (data) {
    return await axios
    .get('/user/order/theft_brush_insurance', data)
    .then(res => res);
  }

  // 会员升级代付详情
  async dfInfo (data) {
    return await axios
    .get('/user/order/df_info', data)
    .then(res => res);
  }

  // 向上级发送会员升级消息
  async sendDfmsg (data) {
    return await axios
    .get('/user/order/send_dfmsg', data)
    .then(res => res);
  }

}

export default new Order();