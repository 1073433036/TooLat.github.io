import axios from 'axios';

class Insure {
  // 车辆保险—-目的地选择
  async getDestinationList (data) {
    return await axios
    .get('/car_vio_v3/car/car_brand', data);
  }

  // 车辆保险—-消息中心
  async getmessageList (data) {
    return await axios
    .get('/car_vio_v3/car/car_brand', data);
  }

  // 车辆保险—-首页
  async getInsList (data) {
    return await axios
    .get('/credit_card/student', data);
  }

  // 车辆保险—-列表页
  async getListDetails (data) {
    return await axios
    .get('/credit_card/student', data);
  }

  // 车辆保险—-填写投保信息
  async insuranceInformation (data) {
    return await axios
    .post('/car_vio_v3/car/save_license', data);
  }

  // 订单详情
  async orderDetails (data) {
    // console.log(data);
    return await axios
    .get('/car_vio_v3/car/further_info', data);
  }

  // 更新补充资料
  async annualDay (data) {
    // console.log(data);
    return await axios
    .get('/car_vio_v3/car/annual_day', data);
  }
}
export default new Insure();
