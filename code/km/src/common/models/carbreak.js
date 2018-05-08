import axios from 'axios';

class CarBreak {

  //我的车辆
  async Mycar () {
    return await axios
    .get('/car_vio_v2/car/my_car', {
      timeout: 20000
    });
  }

  //删除车辆
  async deleteCar (data) {
    return await axios
    .post('/car_vio_v2/car/delete_car', data, {
      timeout: 15000
    });
  }

  // 车牌所在省
  async provinceList (data) {
    return await axios
    .get('/car_vio_v2/car/province_list', data)
    .then(res => res);
  }

  //车牌所在城市
  async cityList (data) {
    return await axios
    .get('/car_vio_v2/car/city_list', {
      params: data
    })
    .then(res => res);
  }

  //车牌号前缀
  async carPrefixList (data) {
    return await axios
    .get('/car_vio_v2/car/provinces', data)
    .then(res => res);
  }

  // 添加车辆
  async addCar (data) {
    return await axios
    .post('/car_vio_v2/car/create', data);
  }

  //车辆信息
  async carInfo (data) {
    return await axios
    .get('/car_vio_v2/car/car_info', {
      params: data
    })
    .then(res => res);
  }

  //车辆违章信息
  async carBreakInfo (data) {
    return await axios
    .get('/car_vio_v2/car/violation', {
      params: data
    })
    .then(res => res);
  }

  // 补充行驶证资料上传图片
  async uploadCarLicenseImg (data) {
    return await axios
    .post('/car_vio_v2/car/upload_image', data);
  }

  // 创建订单
  async createOrder (data) {
    return await axios
    .post('/car_vio_v2/car/create_order', data);
  }

  //微信支付授权
  async wechatAuthorization (data) {
    return await axios
    .get('/user/sns_login/check_openid', data)
    .then(res => res);
  }

  //订单详情
  async orderDetail (data) {
    return await axios
    .get('/car_vio_v2/car/order_detail', data)
    .then(res => res);
  }

  //订单列表
  async orderList (data) {
    return await axios
    .get('/car_vio_v2/order/index', data)
    .then(res => res);
  }

  //订单列表
  async stayQuery (data) {
    return await axios
    .post('/car_vio_v2/car/stay_query', data)
    .then(res => res);
  }

  //取消订单
  async cancelOrder (data) {
    return await axios
    .post('/car_vio_v2/order/cancel_order', data)
    .then(res => res);
  }

}



export default new CarBreak();