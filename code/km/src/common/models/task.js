import axios from 'axios';

class Task {

  // 发布订单
  async add (data) {
    return await axios
    .post('/lender_order/create', data)
    .then(res => res);
  }

  // 订单列表
  async list (data) {
    return await axios
    .get('/lender_order/list', data)
    .then(res => res);
  }

  // 订单详情
  async detail (data) {
    return await axios
    .get('/lender_order/show', data)
    .then(res => res);
  }

  // 抢单
  async getOrder (data) {
    return await axios
    .post('/lender_order/get', data)
    .then(res => res);
  }

  // 我的发布
  async myList (data) {
    return await axios
    .get('/lender_order/my', data)
    .then(res => res);
  }

  // 订单的信贷经理
  async myManager (data) {
    return await axios
    .get('/lender_order/my_manager', data)
    .then(res => res);
  }

  // 信贷经理详情
  async myManagerDetail (data) {
    return await axios
    .get('/lender_order/my_manager_detail', data)
    .then(res => res);
  }

  // 发布抵押贷款订单
  async mortgage (data) {
    return await axios
    .post('/lender_order/create_mortgage', data)
    .then(res => res);
  }

  // 抢到的订单
  async myGet (data) {
    return await axios
    .get('/lender_order/my_get', data)
    .then(res => res);
  }

  // 推送设置
  async setting (data) {
    return await axios
    .post('/user/lender_order_push_setting', data)
    .then(res => res);
  }

  // 推送订单
  async setList (data) {
    return await axios
    .get('/lender_order/push_order', data)
    .then(res => res);
  }

  // 修改订单状态
  async setStatus (data) {
    return await axios
    .post('/lender_order/order_success', data)
    .then(res => res);
  }

  // 信贷经理信息（当前帐号）
  async getManager (data) {
    return await axios
    .get('/lender_order/manager_info', data)
    .then(res => res);
  }

  // 编辑信贷经理信息
  async editManager (data) {
    return await axios
    .post('/lender_order/manager_edit', data)
    .then(res => res);
  }

}

export default new Task();