import axios from 'axios';

/**
  * 这里放全局共用的
  **/
class Home {

  // 提交模拟数据，获得推荐银行
  async run (data) {
    return await axios
    .post('/home/test/run', data)
    .then(res => res);
  }

  // 提交模拟数据，获得推荐银行
  async localCity (data) {
    return await axios
    .get('/user/public/local_city', data)
    .then(res => res);
  }

  // 提交模拟数据，获得推荐银行
  async wechatShare (data) {
    return await axios
    .get('/home/index/wechatShare', data)
    .then(res => res);
  }

  // 申请办卡申请指南
  async procedure (data) {
    return await axios
    .get('/credit_card/procedure', data)
    .then(res => res);
  }

  // 大额信用卡提问
  async preApply (data) {
    return await axios
    .post('/credit_card/pre_apply', data)
    .then(res => res);
  }

  // 用户是否关注微信公众号
  async wechatSubscribe (data) {
    return await axios
    .get('/home/index/wechatSubscribe', data)
    .then(res => res);
  }

  // 获取天气预报信息
  async weather (data) {
    return await axios
    .get('/home/index/weather', data)
    .then(res => res);
  }

  // 生成二维码base64
  async createQr (data) {
    return await axios
    .post('/home/index/qr', data)
    .then(res => res);
  }

  // 保存浏览记录
  async shareRecord (data) {
    return await axios
    .post('/home/share/record', data)
    .then(res => res);
  }

  // 给分享人发送微信通知
  async shareSendMessage (data) {
    return await axios
    .post('/home/share/send_message', data)
    .then(res => res);
  }

  // 识别银行卡信息
  async getCardInfo (data) {
    return await axios
      .post('/home/index/card_info', data)
      .then(res => res);
  }

}

export default new Home();
