import axios from 'axios';

class Insurance {

  // 获取投保地区
  async getAgreementAreas (data) {
    return await axios
    .get('/insurance/getAgreementAreas', data)
    .then(res => res);
  }

  // 创建报价A接口
  async createTaskA (data) {
    return await axios
    .get('/insurance/createTaskA', { params: data, timeout: 30000 })
    .then(res => res);
  }

  // 车辆管理 - 添加
  async carAdd (data) {
    return await axios
    .post('/insurance/car/add', data)
    .then(res => res);
  }

  // 获取供应商列表
  async getProviders (data) {
    return await axios
    .get('/Insurance/getProviders', { params: data, timeout: 30000 })
    .then(res => res);
  }

  // 调用车型查询接口
  async queryCarModelInfos (data) {
    return await axios
    .get('/Insurance/queryCarModelInfos', {params: data, timeout: 30000})
    .then(res => res);
  }

  // 创建报价B接口
  async createTaskB (data) {
    return await axios
    .post('/Insurance/createTaskB', data, {timeout: 30000})
    .then(res => res);
  }

  // 提交报价任务 - 这个有毒
  async submitQuote (data) {
    return await axios
    .post('/Insurance/submitQuote', data, {timeout: 30000})
    .then(res => res);
  }

  // 提交报价任务 - 这个暂时没毒
  async quote (data) {
    return await axios
    .post('/Insurance/quote', data, {timeout: 30000})
    .then(res => res);
  }

  // 车辆管理 - 列表
  async carList (data) {
    return await axios
    .get('/insurance/car/list', data)
    .then(res => res);
  }

  // 车辆管理 - 删除
  async carDel (data) {
    return await axios
    .post('/insurance/car/del', data)
    .then(res => res);
  }

  // 订单列表
  async orderList (data) {
    return await axios
    .get('/insurance/order/list', data)
    .then(res => res);
  }

  // 订单列表 - 报价
  async orderQuote (data) {
    return await axios
    .get('/insurance/order/quote', data)
    .then(res => res);
  }

  // 订单列表 - 报价详情
  async orderQuoteInfo (data) {
    return await axios
    .get('/Insurance/order/quote_info/', data)
    .then(res => res);
  }

  // 修改报价-投保数据
  async updateTask (data) {
    return await axios
    .post('/Insurance/updateTask', data, {timeout: 20000})
    .then(res => res);
  }

  // 提交核保任务
  async submitInsure (data) {
    return await axios
    .post('/Insurance/submitInsure', data, {timeout: 20000})
    .then(res => res);
  }

  // 上传影像
  async uploadImage (data) {
    return await axios
    .post('/Insurance/uploadImage', data, {timeout: 20000})
    .then(res => res);
  }

  // 支付
  async pay (data) {
    return await axios
    .post('/Insurance/pay', data, {timeout: 20000})
    .then(res => res);
  }

  // 添加收货人信息
  async addDelivery (data) {
    return await axios
    .post('/Insurance/add_ins_delivery', data)
    .then(res => res);
  }

  // 获取收货人信息
  async getDelivery (data) {
    return await axios
    .get('/Insurance/get_ins_delivery', data)
    .then(res => res);
  }

  // 删除订单
  async delOrder (data) {
    return await axios
    .post('/insurance/order/del', data)
    .then(res => res);
  }

  // 核保成功通知
  async getOrderMsg () {
    return await axios.get('/insurance/orderMsg');
  }

}

export default new Insurance();
