import axios from 'axios';

class CarVio {
  // 获取我的车辆
  async getMyCar () {
    return await axios
    .get('/car_vio_v3/car/my_car?stay=0');
  }

  // 获取车辆品牌
  async getCarBrand () {
    return await axios.get('/car_vio_v3/car/car_brand');
  }

  // 行驶证识别
  async distNumber (data) {
    return await axios
    .post('/car_vio_v3/car/ocr_vehicle', data);
  }

  // 车牌前缀
  async getCarProvinces () {
    return await axios
    .get('/car_vio/car/provinces');
  }

  // 添加车辆
  async addCar (data) {
    return await axios
    .post('/car_vio_v3/car/create', data);
  }

  // 删除车辆
  async deleteCar (data) {
    return await axios
    .post('/car_vio_v3/car/delete_car', data);
  }

  // 车辆违章信息
  async violationInformation (data) {
    return await axios
    .get('/car_vio_v3/car/query_violation', data)
    .then(res => res);
  }

  // 保存驾驶证
  async saveLicense (data) {
    return await axios
    .post('/car_vio_v3/car/save_license', data);
  }

  // 验证车辆
  async verification (data) {
    // console.log(data);
    return await axios
    .post('/car_vio_v3/car/auth_car', data);
  }

  // 获取补充资料
  async illegalIncome (data) {
    // console.log(data);
    return await axios
    .get('/car_vio_v3/car/further_info', data);
  }

  // 更新补充资料
  async updateFurther (data) {
    // console.log(data);
    return await axios
    .get('/car_vio_v3/car/update_further', data);
  }

  // 剩余天数
  async annualDay (data) {
    // console.log(data);
    return await axios
    .get('/car_vio_v3/car/annual_day', data);
  }

  // 订单列表
  async orderList (data) {
    return await axios
    .get('/car_vio_v3/order/index', data);
  }

  // 创建订单
  async createOrder (data) {
    return await axios
    .post('/car_vio_v3/car/create_order', data);
  }

  // 获取车牌是否可查询
  async queryCarRule (data) {
    return await axios.get('/car_vio_v3/car/query_rule', data);
  }
}

export default new CarVio();
