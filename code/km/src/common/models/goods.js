import axios from 'axios';

class Goods {
  // 学校选择
  async schoolList (data) {
    // console.log(data);
    return await axios
    .get('credit_card/school', data)
    .then(res => res);
  }
  // 车牌选择
  async plateList () {
    // console.log(data);
    return await axios
    .get('car_vio_v3/car/car_brand')
    .then(res => res);
  }

  // 商品列表
  async list (data) {
    return await axios
    .get('/goods', data)
    .then(res => res);
  }

  // 信贷经理置顶日期
  async stickDay (data) {
    return await axios
    .get('/lender_order/stick_day', data)
    .then(res => res);
  }
}

export default new Goods();