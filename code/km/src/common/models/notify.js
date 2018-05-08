import axios from 'axios';

class Notify {

  // 通知类型
  async list (data) {
    return await axios
    .get('/user/notify/list', data)
    .then(res => res);
  }

  // 通知列表
  async index (data) {
    return await axios
    .get('/user/notify/index', data)
    .then(res => res);
  }

  // 通知详情
  async detail (data) {
    return await axios
    .get('/user/notify/detail', data)
    .then(res => res);
  }

  // 删除通知
  async delete (data) {
    return await axios
    .post('/user/notify/delete', data)
    .then(res => res);
  }

  // 佣金消息详细
  async account (data) {
    return await axios
    .get('/user/account/info', data)
    .then(res => res);
  }

  // 版块通知
  async forum (forum) {
    return await axios.get('/user/forum/message', {
      params: {
        forum
      }
    });
  }

}

export default new Notify();
