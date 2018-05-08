import axios from 'axios';

class Credit {
  // 征信查询
  async creditQuery (data) {
    return await axios
      .post('/td/query', data)
      .then(res => res);
  }
  // 信用卡列表
  async list (data) {
    return await axios
      .get('/credit_card/list', data)
      .then(res => res);
  }
  // 信用卡详情
  async show (data) {
    return await axios
      .get('/credit_card/show', data)
      .then(res => res);
  }
  // 信用卡热度排行
  async hot (data) {
    return await axios
      .get('/credit_card/hot', data)
      .then(res => res);
  }
  // 办卡申请
  async create (data) {
    return await axios
      .post('/credit_card/create', data)
      .then(res => res);
  }
  // 快捷申请
  async reapply (data) {
    return await axios
      .post('/credit_card/reapply', data)
      .then(res => res);
  }
  // 信用卡热度排行
  async nameList (data) {
    return await axios
      .get('/credit_card/name_list', data)
      .then(res => res);
  }
  // 删除申请人
  async delete (data) {
    return await axios
      .post('/credit_card/delete', data)
      .then(res => res);
  }
  // 办卡成功提示
  async successInfo (data) {
    return await axios
      .get('/credit_card/success_info', data)
      .then(res => res);
  }
  // 办卡查询 用户记录列表
  async queryUserList (data) {
    return await axios
      .get('/user/credit_card_examine/query_user_list', data)
      .then(res => res);
  }
  // 办卡查询 删除查询人信息
  async queryUserDelete (data) {
    return await axios
      .post('/user/credit_card_examine/query_user_delete', data)
      .then(res => res);
  }
}

export default new Credit();
